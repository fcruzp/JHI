// ============================================================
// API Route: /api/cotizaciones/[id]/estado
// Handle state transitions for cotizaciones
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { CotizacionStateMachine } from '@/lib/cotizacion/state-machine';
import { EstadoCotizacion } from '@/lib/hubspot/types';
import { HubSpotService } from '@/lib/hubspot/service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nuevoEstado, userId, userReason, metadata, skipAutoActions } = body;

    if (!nuevoEstado) {
      return NextResponse.json(
        { error: 'nuevoEstado is required' },
        { status: 400 }
      );
    }

    const result = await CotizacionStateMachine.transition(
      params.id,
      nuevoEstado as EstadoCotizacion,
      {
        userId,
        userReason,
        metadata,
        skipAutoActions,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: 'Transition failed', details: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      previousState: result.previousState,
      newState: result.newState,
      actions: result.actions,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Error transitioning state:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current state of cotizacion to determine allowed transitions
    const cotizacion = await HubSpotService.cotizaciones.getById(params.id);
    
    if (!cotizacion) {
      return NextResponse.json(
        { error: 'Cotización not found' },
        { status: 404 }
      );
    }

    const currentState = cotizacion.properties.estado_cotizacion as EstadoCotizacion;
    const allowedTransitions = CotizacionStateMachine.getAllowedTransitions(currentState);

    return NextResponse.json({
      success: true,
      currentState,
      allowedTransitions,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Error fetching allowed transitions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
