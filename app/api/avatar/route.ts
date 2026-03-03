import { NextRequest, NextResponse } from 'next/server';
import { generateAvatarSVG, generateRandomColors, svgToDataURL, AvatarOptions } from '@/lib/avatar';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const size = parseInt(searchParams.get('size') || '128');
    const pixelSize = parseInt(searchParams.get('pixelSize') || '16');
    const colorsParam = searchParams.get('colors');
    const seed = searchParams.get('seed') ?
      parseInt(searchParams.get('seed')!) :
      Math.floor(Math.random() * 10000);
    const format = searchParams.get('format') || 'svg';

    // Validate parameters
    if (isNaN(size) || size < 16 || size > 1024) {
      return NextResponse.json(
        { error: 'Size must be between 16 and 1024' },
        { status: 400 }
      );
    }

    if (isNaN(pixelSize) || pixelSize < 4 || pixelSize > 64) {
      return NextResponse.json(
        { error: 'Pixel size must be between 4 and 64' },
        { status: 400 }
      );
    }

    // Parse colors
    let colors: string[] | undefined;
    if (colorsParam) {
      colors = colorsParam.split(',').map(c => c.trim());
    }

    const options: AvatarOptions = {
      size,
      pixelSize,
      colors,
      seed,
    };

    // Generate avatar
    const svg = generateAvatarSVG(options);

    // Return based on format
    if (format === 'svg') {
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else if (format === 'json') {
      const dataUrl = svgToDataURL(svg);
      return NextResponse.json({
        svg,
        dataUrl,
        seed,
        colors: colors || generateRandomColors(4),
      });
    } else {
      // Default: SVG
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

  } catch (error) {
    console.error('Error generating avatar:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}
