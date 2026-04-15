// ============================================================
// Admin Panel API - Cotizacion Detail
// GET: Get full cotizacion details
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot';

// ============================================================
// GET - Get cotizacion by ID
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing cotizacion ID',
        },
        { status: 400 }
      );
    }

    const cotizacion = await HubSpotService.cotizaciones.getById(id);
    
    if (!cotizacion) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cotizacion not found',
        },
        { status: 404 }
      );
    }

    // Attempt to fetch associated contact
    let contact = null;
    try {
      contact = await HubSpotService.cotizaciones.getAssociatedContact(id);
    } catch (contactError) {
      console.warn(`[Admin API - Contact fetch error for ${id}]`, contactError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...cotizacion,
        contact: contact ? {
          id: contact.id,
          email: contact.properties.email,
          firstname: contact.properties.firstname,
          lastname: contact.properties.lastname,
          phone: contact.properties.phone,
        } : null
      },
    });
  } catch (error) {
    console.error('[Admin API - Detail Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
