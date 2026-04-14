// ============================================================
// API Route: /api/cotizaciones
// CRUD operations for cotizaciones
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot/service';
import { CotizacionValidator } from '@/lib/cotizacion/validator';
import { CotizacionData, HubSpotObject, EstadoCotizacion } from '@/lib/hubspot/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: CotizacionData = body;

    // Validate input
    const errors = CotizacionValidator.validateCreateData(data);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Find or create contact
    let contactId: string | undefined;
    if (data.contactEmail) {
      const contact = await HubSpotService.contacts.findOrCreate({
        email: data.contactEmail,
        firstName: data.notes?.split(' ')[0], // Try to extract name from notes
        lastName: data.notes?.split(' ').slice(1).join(' '),
      });
      contactId = contact?.id;
    }

    // Find or create company if provided
    let companyId: string | undefined;

    // Create cotizacion
    const cotizacion = await HubSpotService.cotizaciones.create({
      ...data,
      contactId,
      companyId,
    });

    return NextResponse.json(
      { success: true, cotizacionId: cotizacion.id, data: cotizacion },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Error creating cotizacion:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results: HubSpotObject[];

    if (email) {
      // Get by contact email
      results = await HubSpotService.cotizaciones.getByContactEmail(email);
    } else if (status) {
      // Get by status
      results = await HubSpotService.cotizaciones.searchByStatus(status as EstadoCotizacion, limit);
    } else {
      // List all
      const response = await HubSpotService.cotizaciones.list({ limit });
      results = response.results;
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Error fetching cotizaciones:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
