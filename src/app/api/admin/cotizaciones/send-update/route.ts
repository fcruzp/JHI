import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';
import { HubSpotService } from '@/lib/hubspot/service';

export async function POST(req: NextRequest) {
  try {
    const { 
      id, 
      comentario, 
      email, 
      nombre, 
      producto, 
      incoterm, 
      estadoLabel, 
      cantidad 
    } = await req.json();

    if (!email || !comentario) {
      return NextResponse.json({ error: 'Email and comentario are required' }, { status: 400 });
    }

    // Send email using data passed from frontend (avoiding redundant HubSpot calls)
    const result = await EmailService.sendStatusUpdate(email, {
      nombre: nombre || 'Cliente',
      producto: producto || 'Producto',
      incoterm: incoterm || 'N/A',
      estado: estadoLabel || 'En proceso',
      comentario,
      cotizacionId: id,
      cantidad: cantidad
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // 2. Persist the update as a note in HubSpot for chatbot context
    try {
      if (!id) {
        // eslint-disable-next-line no-console
        console.warn('[Admin API] No cotización id; skipping HubSpot note');
      } else {
        await HubSpotService.activities.createNote({
          cotizacionId: id,
          content: `[CORREO ADMIN]\n\n${comentario}`,
        });
        // eslint-disable-next-line no-console
        console.log('[Admin API] Update persisted as note in HubSpot');
      }
    } catch (noteError) {
      // eslint-disable-next-line no-console
      console.error('[Admin API] Failed to persist note in HubSpot:', noteError);
      // We don't fail the whole request because the email was already sent
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Send Update Error]:', error);
    return NextResponse.json({ error: 'Internal server error while sending update' }, { status: 500 });
  }
}
