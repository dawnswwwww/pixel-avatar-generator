import { NextRequest, NextResponse } from 'next/server';
import { generateRandomColors } from '@/lib/avatar';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '5');

    // Validate parameters
    if (isNaN(count) || count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Generate random colors
    const colors = generateRandomColors(count);

    return NextResponse.json({ colors });

  } catch (error) {
    console.error('Error generating colors:', error);
    return NextResponse.json(
      { error: 'Failed to generate colors' },
      { status: 500 }
    );
  }
}
