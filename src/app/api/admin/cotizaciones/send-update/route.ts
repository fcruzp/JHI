import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Send Update Error]:', error);
    return NextResponse.json({ error: 'Internal server error while sending update' }, { status: 500 });
  }
}
