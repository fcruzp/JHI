import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/hubspot';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing cotizacion ID' },
        { status: 400 }
      );
    }

    const notes = await HubSpotService.activities.getNotesByCotizacionId(id);
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const content = String(body?.content || '').trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing cotizacion ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    await HubSpotService.activities.createNote({
      cotizacionId: id,
      content: `[NOTA ADMIN]\n\n${content}`,
    });

    const notes = await HubSpotService.activities.getNotesByCotizacionId(id);
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

