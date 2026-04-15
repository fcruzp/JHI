// ============================================================
// Admin Panel API - Cotizaciones List & Update
// GET: List cotizaciones with advanced filters
// PATCH: Update operational fields
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot';
import {
  EstadoDelSuplidor,
  EstadoOperativoCotizacion,
  ResultadoDeCotizacion,
  TipoDeProceso,
  ESTADO_SUPLIDOR_LABELS,
  ESTADO_OPERATIVO_LABELS,
  RESULTADO_COTIZACION_LABELS,
  TIPO_PROCESO_LABELS,
} from '@/lib/hubspot';

// ============================================================
// GET - List cotizaciones with filters
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filter parameters
    const estadodelsuplidor = searchParams.get('estadodelsuplidor')?.split(',').filter(Boolean) as EstadoDelSuplidor[] | undefined;
    const estadodela_cotizacion = searchParams.get('estadodela_cotizacion')?.split(',').filter(Boolean) as EstadoOperativoCotizacion[] | undefined;
    const resultadodela_cotizacion = searchParams.get('resultadodela_cotizacion')?.split(',').filter(Boolean) as ResultadoDeCotizacion[] | undefined;
    const trial_solicitado = searchParams.get('trial_solicitado') ? searchParams.get('trial_solicitado') === 'true' : undefined;
    const tipodeproceso = searchParams.get('tipodeproceso')?.split(',').filter(Boolean) as TipoDeProceso[] | undefined;
    const fecha_solicitud_desde = searchParams.get('fecha_solicitud_desde') || undefined;
    const fecha_solicitud_hasta = searchParams.get('fecha_solicitud_hasta') || undefined;
    const fecha_respuesta_desde = searchParams.get('fecha_respuesta_desde') || undefined;
    const fecha_respuesta_hasta = searchParams.get('fecha_respuesta_hasta') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const after = searchParams.get('after') || undefined;
    const query = searchParams.get('q') || undefined;

    // Validate enum values
    const validEstadosSuplidor = estadodelsuplidor?.filter(e => e in ESTADO_SUPLIDOR_LABELS);
    const validEstadosCotizacion = estadodela_cotizacion?.filter(e => e in ESTADO_OPERATIVO_LABELS);
    const validResultados = resultadodela_cotizacion?.filter(e => e in RESULTADO_COTIZACION_LABELS);
    const validTiposProceso = tipodeproceso?.filter(e => e in TIPO_PROCESO_LABELS);

    const result = await HubSpotService.cotizaciones.searchWithFilters({
      estadodelsuplidor: validEstadosSuplidor,
      estadodela_cotizacion: validEstadosCotizacion,
      resultadodela_cotizacion: validResultados,
      trial_solicitado,
      tipodeproceso: validTiposProceso,
      fecha_solicitud_desde,
      fecha_solicitud_hasta,
      fecha_respuesta_desde,
      fecha_respuesta_hasta,
      limit,
      after,
      query,
    });

    // --- Batch Join Optimization ---
    const cotizaciones = result.results || [];
    if (cotizaciones.length > 0) {
      const cotizacionIds = cotizaciones.map(c => c.id);
      try {
        const contactMap = await HubSpotService.cotizaciones.batchGetAssociatedContacts(cotizacionIds);
        // Merge contacts into cotizaciones
        cotizaciones.forEach(cotizacion => {
          if (contactMap[cotizacion.id]) {
            (cotizacion as any).contact = contactMap[cotizacion.id];
          }
        });
      } catch (batchErr) {
        console.warn('[Admin API - Batch Contact Join Failed]', batchErr);
      }
    }
    // -------------------------------

    return NextResponse.json({
      success: true,
      data: cotizaciones,
      paging: result.paging,
    });
  } catch (error) {
    console.error('[Admin API - GET Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH - Update operational fields
// ============================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, fields } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: id',
        },
        { status: 400 }
      );
    }

    if (!fields || typeof fields !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: fields (object)',
        },
        { status: 400 }
      );
    }

    // Validate operational fields
    const validFields = [
      'tipodeproceso',
      'estadodelsuplidor',
      'fechasolicituda_suplidor',
      'fecharespuestadel_suplidor',
      'estadodela_cotizacion',
      'trial_solicitado',
      'resultadodela_cotizacion',
    ];

    const invalidFields = Object.keys(fields).filter(key => !validFields.includes(key));
    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid fields: ${invalidFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get current cotizacion to validate business rules
    const currentCotizacion = await HubSpotService.cotizaciones.getById(id);
    if (!currentCotizacion) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cotizacion not found',
        },
        { status: 404 }
      );
    }

    // Business rule validations
    const warnings: string[] = [];
    
    // Rule 1: If estadodelsuplidor = esperando_valores, fecha_solicitud_a_suplidor must exist
    if (fields.estadodelsuplidor === 'esperando_valores') {
      const fechaSolicitud = fields.fechasolicituda_suplidor || currentCotizacion.properties.fecha_solicitud_a_suplidor;
      if (!fechaSolicitud) {
        warnings.push('⚠️ Al cambiar a "esperando valores", debería existir una fecha de solicitud al suplidor');
      }
    }

    // Rule 2: If estadodelsuplidor = valores_recibidos, fecha_respuesta_del_suplidor must exist
    if (fields.estadodelsuplidor === 'valores_recibidos') {
      const fechaRespuesta = fields.fecharespuestadel_suplidor || currentCotizacion.properties.fecha_respuesta_del_suplidor;
      if (!fechaRespuesta) {
        warnings.push('⚠️ Al cambiar a "valores recibidos", debería existir una fecha de respuesta del suplidor');
      }
    }

    // Rule 3: If trial_solicitado = true, suggest changing tipo_de_proceso to oportunidad_trial
    if (fields.trial_solicitado === true) {
      const currentTipoProceso = fields.tipodeproceso || currentCotizacion.properties.tipo_de_proceso;
      if (currentTipoProceso !== 'oportunidad_trial') {
        warnings.push('💡 Sugerencia: Cuando se solicita un trial, considera cambiar el tipo de proceso a "oportunidad_trial"');
      }
    }

    // Rule 4: If resultadodela_cotizacion = perdida, lock the cotizacion (soft warning)
    if (fields.resultadodela_cotizacion === 'perdida') {
      warnings.push('🔒 La cotización se marcará como perdida. Esta acción es difícil de revertir');
    }

    // Validate enum values
    if (fields.tipodeproceso && !(fields.tipodeproceso in TIPO_PROCESO_LABELS)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid tipodeproceso value: ${fields.tipodeproceso}`,
        },
        { status: 400 }
      );
    }

    if (fields.estadodelsuplidor && !(fields.estadodelsuplidor in ESTADO_SUPLIDOR_LABELS)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid estadodelsuplidor value: ${fields.estadodelsuplidor}`,
        },
        { status: 400 }
      );
    }

    if (fields.estadodela_cotizacion && !(fields.estadodela_cotizacion in ESTADO_OPERATIVO_LABELS)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid estadodela_cotizacion value: ${fields.estadodela_cotizacion}`,
        },
        { status: 400 }
      );
    }

    if (fields.resultadodela_cotizacion && !(fields.resultadodela_cotizacion in RESULTADO_COTIZACION_LABELS)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid resultadodela_cotizacion value: ${fields.resultadodela_cotizacion}`,
        },
        { status: 400 }
      );
    }

    // Validate date formats (YYYY-MM-DD)
    const dateFields = ['fechasolicituda_suplidor', 'fecharespuestadel_suplidor'];
    for (const field of dateFields) {
      if (fields[field]) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fields[field])) {
          return NextResponse.json(
            {
              success: false,
              error: `Invalid date format for ${field}: expected YYYY-MM-DD`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate boolean
    if (fields.trial_solicitado !== undefined && typeof fields.trial_solicitado !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid trial_solicitado value: expected boolean`,
        },
        { status: 400 }
      );
    }

    // Log changes for audit trail
    const changes: Record<string, { old: string | null; new: string | null }> = {};
    for (const [key, newValue] of Object.entries(fields)) {
      const oldValue = currentCotizacion.properties[key] || null;
      const newStr = newValue !== undefined && newValue !== null ? String(newValue) : null;
      if (oldValue !== newStr) {
        changes[key] = { old: oldValue, new: newStr };
      }
    }

    console.log('[Admin API - Update]', {
      cotizacionId: id,
      changes,
      warnings,
      timestamp: new Date().toISOString(),
    });

    // Update in HubSpot
    const updated = await HubSpotService.cotizaciones.update(id, fields);

    return NextResponse.json({
      success: true,
      data: updated,
      changes,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    console.error('[Admin API - PATCH Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE - Batch delete cotizaciones
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid required field: ids (array of strings)',
        },
        { status: 400 }
      );
    }

    console.log('[Admin API - Batch Delete]', {
      count: ids.length,
      ids,
      timestamp: new Date().toISOString(),
    });

    await HubSpotService.cotizaciones.deleteBatch(ids);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} records.`,
    });
  } catch (error) {
    console.error('[Admin API - DELETE Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
