import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { HubSpotService } from '@/lib/hubspot/service';
import { CotizacionData, ProductoCotizado, Incoterm, TipoClienteOperacion } from '@/lib/hubspot/types';
import { EmailService } from '@/lib/email/service';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  commodity: z.string().min(1, 'Commodity is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  incoterms: z.string().min(1, 'Incoterms is required'),
  message: z.string().min(1, 'Message is required'),
});

// OLD HUBSPOT FUNCTIONS REMOVED - Now using HubSpotService

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, commodity, quantity, origin, destination, incoterms, message } = result.data;

    console.log('Contact form submission:', result.data);

    try {
      // Normalize enum values
      const normalizeIncoterm = (val: string): Incoterm => {
        const lower = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes('fob')) return 'fob';
        if (lower.includes('cif')) return 'cif';
        if (lower.includes('cfr')) return 'cfr';
        if (lower.includes('exw')) return 'exw';
        return 'otro';
      };

      const normalizeProducto = (val: string): ProductoCotizado => {
        const lower = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes('azucar') || lower.includes('sugar')) return 'azucar';
        if (lower.includes('chicken') || lower.includes('paw')) return 'chicken_paws';
        if (lower.includes('grano') || lower.includes('grain')) return 'granos';
        if (lower.includes('cafe') || lower.includes('coffee')) return 'cafe';
        if (lower.includes('aceite') || lower.includes('oil')) return 'aceites';
        if (lower.includes('lacteo') || lower.includes('dairy')) return 'lacteos';
        // For other products, default to 'otro'
        return 'otro';
      };

      // First find or create contact
      const contact = await HubSpotService.contacts.findOrCreate({
        email: email,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      // Map to new cotizacion schema
      const cotizacionData: CotizacionData = {
        producto_cotizado: normalizeProducto(commodity),
        producto_nombre_original: commodity, // Keep original name for dealname display
        incoterm: normalizeIncoterm(incoterms),
        tipo_cliente_operacion: 'cliente_directo',
        mercado_origen: origin,
        contactId: contact.id,
        contactEmail: email,
        amount: String(quantity).replace(/[^0-9.]/g, '') || quantity, // Extract only numeric part
        description: message,
      };

      // Create cotizacion
      const cotizacion = await HubSpotService.cotizaciones.create(cotizacionData);
      
      // Save the customer message as a Note activity on the cotizacion
      if (message && message.trim()) {
        try {
          await HubSpotService.activities.createNote({
            content: `Solicitud del cliente:\n${message}`,
            cotizacionId: cotizacion.id,
          });
          // eslint-disable-next-line no-console
          console.log('[Contact] Customer message saved as note on cotizacion:', cotizacion.id);
        } catch (noteError) {
          // eslint-disable-next-line no-console
          console.error('[Contact] Failed to save message as note:', noteError);
        }
      }

      // Send confirmation email
      try {
        await EmailService.sendLevantandoPrecio(email, {
          nombre: name.split(' ')[0] || name,
          producto: commodity,
          incoterm: incoterms,
          cantidad: quantity,
          cotizacionId: cotizacion.id,
          mensaje: message, // Include customer's message in email
        });
        // eslint-disable-next-line no-console
        console.log('[Contact] Confirmation email sent to:', email);
      } catch (emailError) {
        // eslint-disable-next-line no-console
        console.error('[Contact] Failed to send confirmation email:', emailError);
      }
      
      // eslint-disable-next-line no-console
      console.log('[Contact] Contact ID:', contact.id, '| Cotización created with ID:', cotizacion.id);
    } catch (hubspotError) {
      console.error('HubSpot integration error:', hubspotError);
      // Don't fail the request to the user if HubSpot fails
    }

    return NextResponse.json(
      { success: true, message: 'Quote request received successfully' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
