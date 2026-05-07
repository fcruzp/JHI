// ============================================================
// API Route: /api/cotizaciones
// CRUD operations for cotizaciones
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot/service';
import { CotizacionValidator } from '@/lib/cotizacion/validator';
import { CotizacionData, HubSpotObject, EstadoCotizacion } from '@/lib/hubspot/types';
import { EmailService } from '@/lib/email/service';

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
    let finalRole: 'Broker' | 'Direct Buyer' = 'Broker'; // Default assumption per new rules
    let contactName = 'Unknown';

    if (data.contactEmail) {
      // Use findByEmail first to check the properties before creating
      let contact = await HubSpotService.contacts.findByEmail(data.contactEmail);
      
      const parsedFirstName = data.notes?.split(' ')[0] || '';
      const parsedLastName = data.notes?.split(' ').slice(1).join(' ') || '';
      contactName = parsedFirstName + (parsedLastName ? ` ${parsedLastName}` : '');

      if (!contact) {
        contact = await HubSpotService.contacts.create({
          email: data.contactEmail,
          firstName: parsedFirstName,
          lastName: parsedLastName,
          rol_en_la_operacion: 'broker', // default to broker if creating new
        });
        finalRole = 'Broker';
      } else {
        const existingRole = contact.properties.rol_en_la_operacion;
        contactName = `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim() || contactName;
        
        if (!existingRole) {
          // Update missing role to broker
          await HubSpotService.contacts.update(contact.id, { rol_en_la_operacion: 'broker' });
          finalRole = 'Broker';
        } else {
          // Determine deal role based on existing contact role
          finalRole = (existingRole === 'broker') ? 'Broker' : 'Direct Buyer';
        }
      }
      contactId = contact?.id;
    }

    // Find or create company if provided
    let companyId: string | undefined;

    // Create cotizacion
    const cotizacion = await HubSpotService.cotizaciones.create({
      ...data,
      contactId,
      companyId,
      hs_deal_role: finalRole,
    });

    // Send System Trigger to Virtual CEO (Skay Huge)
    if (data.contactEmail) {
      await EmailService.sendSkayTrigger({
        dealId: cotizacion.id,
        clientName: contactName || data.contactEmail,
        clientEmail: data.contactEmail,
        applicantRole: finalRole,
        commodity: data.producto_cotizado,
        volumeMt: String(data.amount || 'N/A'),
        incoterm: String(data.incoterm).toUpperCase(),
        targetPrice: 'N/A', // Assuming not collected in basic form
        attachmentsStatus: 'No documents uploaded yet.'
      });
    }

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
