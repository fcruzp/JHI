// ============================================================
// Admin Panel API - Metrics & Statistics
// GET: Return key metrics for the dashboard
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot';

export async function GET(request: NextRequest) {
  try {
    // Calculate date ranges
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all cotizaciones with pagination (HubSpot max 100 per request)
    let allCotizaciones: any[] = [];
    let after: string | undefined = undefined;
    
    do {
      const response = await HubSpotService.cotizaciones.list({ limit: 100, after });
      allCotizaciones = allCotizaciones.concat(response.results || []);
      after = response.paging?.next?.after;
    } while (after && allCotizaciones.length < 1000); // Safety limit

    // Calculate metrics from fetched data
    const metrics = {
      total: allCotizaciones.length,
      thisWeek: 0,
      thisMonth: 0,
      pendienteContactar: 0,
      esperandoValores: 0,
      valoresRecibidos: 0,
      enviadas: 0,
      conTrial: 0,
      perdidas: 0,
      convertidasTrial: 0,
      ganadas: 0,
      lastUpdated: new Date().toISOString(),
    };

    for (const cot of allCotizaciones) {
      const props = cot.properties;
      const createdDate = props.createdate || cot.createdAt;

      // This week/month counts (based on createdate)
      if (createdDate) {
        const created = new Date(createdDate);
        if (created >= startOfWeek) metrics.thisWeek++;
        if (created >= startOfMonth) metrics.thisMonth++;
      }

      // Count by estado del suplidor
      const estadoSuplidor = props.estado_del_suplidor || '';
      if (estadoSuplidor === 'pendiente_por_contactar') metrics.pendienteContactar++;
      if (estadoSuplidor === 'esperando_valores') metrics.esperandoValores++;
      if (estadoSuplidor === 'valores_recibidos') metrics.valoresRecibidos++;

      // Count by estado de la cotizacion
      const estadoCotizacion = props.estado_de_la_cotizacion || '';
      if (estadoCotizacion === 'enviada') metrics.enviadas++;

      // Count by trial
      if (props.trial_solicitado === 'true') metrics.conTrial++;

      // Count by resultado
      const resultado = props.resultado_de_la_cotizacion || '';
      if (resultado === 'perdida') metrics.perdidas++;
      if (resultado === 'ganada_para_continuar') metrics.ganadas++;

      // Count by tipo de proceso
      const tipoProceso = props.tipo_de_proceso || '';
      if (tipoProceso === 'oportunidad_trial') metrics.convertidasTrial++;
    }

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('[Admin API - Metrics Error]', error);
    // Return empty metrics instead of failing
    return NextResponse.json({
      success: true,
      data: {
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        pendienteContactar: 0,
        esperandoValores: 0,
        valoresRecibidos: 0,
        enviadas: 0,
        conTrial: 0,
        perdidas: 0,
        convertidasTrial: 0,
        ganadas: 0,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}
