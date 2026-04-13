import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

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

const HUBSPOT_API_URL = 'https://api.hubapi.com';

async function findOrCreateContact(data: { name: string; email: string }): Promise<string | null> {
  // Search for existing contact by email
  const searchRes = await fetch(
    `${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                value: data.email,
                operator: 'EQ',
              },
            ],
          },
        ],
      }),
    }
  );

  if (!searchRes.ok) {
    console.error('HubSpot contact search failed:', await searchRes.json().catch(() => ({})));
    return null;
  }

  const searchData = await searchRes.json();

  if (searchData.results && searchData.results.length > 0) {
    return searchData.results[0].id;
  }

  // Create new contact
  const firstName = data.name.split(' ')[0] || '';
  const lastName = data.name.split(' ').slice(1).join(' ') || '';

  const createRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        firstname: firstName,
        lastname: lastName,
        email: data.email,
      },
    }),
  });

  if (!createRes.ok) {
    console.error('HubSpot contact creation failed:', await createRes.json().catch(() => ({})));
    return null;
  }

  const createData = await createRes.json();
  return createData.id;
}

async function createHubSpotDeal(
  data: {
    commodity: string;
    quantity: string;
    origin: string;
    destination: string;
    incoterms: string;
    message: string;
    email: string;
  },
  contactId: string | null
): Promise<boolean> {
  // Extract numeric value from quantity (e.g., "10 MT" → "10")
  const numericQuantity = String(data.quantity).replace(/[^0-9.]/g, '') || String(data.quantity);

  const dealName = `${data.commodity} — ${data.quantity} MT from ${data.origin} to ${data.destination} (${data.incoterms})`;

  const body: Record<string, unknown> = {
    properties: {
      dealname: dealName,
      amount: numericQuantity,
      dealstage: 'appointmentscheduled',
      description: data.message || `Origin: ${data.origin}\nIncoterms: ${data.incoterms}\nContact: ${data.email}`,
    },
  };

  if (contactId) {
    body.associations = [
      {
        to: { id: String(contactId) },
        types: [
          {
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: '3',
          },
        ],
      },
    ];
  }

  const res = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('HubSpot deal creation failed:', err);

    // Fallback: try without associations
    const { associations, ...bodyNoAssoc } = body;
    const fallbackRes = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify(bodyNoAssoc),
    });

    if (!fallbackRes.ok) {
      const fallbackErr = await fallbackRes.json().catch(() => ({}));
      console.error('HubSpot deal creation fallback also failed:', fallbackErr);
      return false;
    }
    return true;
  }

  return true;
}

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

    // HubSpot integration: create contact and deal
    try {
      const contactId = await findOrCreateContact({ name, email });

      if (contactId) {
        console.log('Contact found/created with ID:', contactId);
      }

      const dealCreated = await createHubSpotDeal(
        { commodity, quantity, origin, destination, incoterms, message, email },
        contactId
      );

      if (dealCreated) {
        console.log('HubSpot deal created successfully');
      }
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
