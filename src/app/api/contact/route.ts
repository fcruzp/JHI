import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  commodity: z.string().min(1, 'Commodity is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  message: z.string().min(1, 'Message is required'),
});

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

    // In production, this would send an email or save to database
    // For now, we log and return success
    console.log('Contact form submission:', result.data);

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
