export interface AvatarOptions {
  size?: number;
  colors?: string[];
  bgColor?: string;
  pixelSize?: number;
  seed?: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Generate random HSL color
 */
export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 40 + Math.floor(Math.random() * 30);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate multiple random colors
 */
export function generateRandomColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(generateRandomColor());
  }
  return colors;
}

/**
 * Parse HSL color to RGB
 */
export function hslToRgb(hsl: string): Color {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    return { r: 0, g: 0, b: 0 };
  }

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Simple seeded random number generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBoolean(): boolean {
    return this.next() < 0.5;
  }
}

/**
 * Generate pixel art pattern
 */
export function generatePixelPattern(options: AvatarOptions = {}): string[] {
  const {
    colors,
    seed = Math.random() * 10000,
  } = options;

  const rng = new SeededRandom(seed);
  const usedColors = colors || generateRandomColors(4);

  // 8x8 pixel grid
  const pattern: string[] = [];
  for (let y = 0; y < 8; y++) {
    let row = '';
    for (let x = 0; x < 8; x++) {
      // Different patterns for different rows
      let shouldDraw = true;

      // Background pattern
      if (rng.nextBoolean()) {
        shouldDraw = false;
      }

      // Face area (center)
      if (x >= 2 && x <= 5 && y >= 1 && y <= 6) {
        shouldDraw = rng.nextBoolean();
      }

      // Eyes
      if ((x === 2 || x === 5) && (y === 3 || y === 4)) {
        shouldDraw = true;
      }

      // Mouth
      if (x >= 3 && x <= 4 && y === 6) {
        shouldDraw = true;
      }

      if (shouldDraw) {
        const colorIndex = rng.nextInt(0, usedColors.length - 1);
        row += colorIndex.toString();
      } else {
        row += '-';
      }
    }

    pattern.push(row);
  }

  return pattern;
}

/**
 * Generate pixel avatar SVG
 */
export function generateAvatarSVG(options: AvatarOptions = {}): string {
  const {
    size = 128,
    pixelSize = 16,
    colors,
    bgColor = generateRandomColor(),
  } = options;

  const gridSize = size / pixelSize;
  const pattern = generatePixelPattern({ colors, seed: options.seed });
  const usedColors = colors || generateRandomColors(4);

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  svg += `<rect width="${size}" height="${size}" fill="${bgColor}" />`;

  // Pixel pattern
  for (let y = 0; y < pattern.length && y < gridSize; y++) {
    for (let x = 0; x < pattern[y].length && x < gridSize; x++) {
      const char = pattern[y][x];
      if (char !== '-') {
        const colorIndex = parseInt(char);
        const color = usedColors[colorIndex] || usedColors[0];
        svg += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
      }
    }
  }

  svg += '</svg>';

  return svg;
}

/**
 * Generate avatar as PNG (browser-only)
 */
export async function generateAvatarPNG(options: AvatarOptions = {}): Promise<Blob> {
  const svg = generateAvatarSVG(options);
  const size = options.size || 128;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const img = new Image();
  img.src = 'data:image/svg+xml;base64,' + btoa(svg);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, size, size);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, 'image/png');
  });
}

/**
 * Convert SVG to data URL
 */
export function svgToDataURL(svg: string): string {
  return 'data:image/svg+xml;base64,' + btoa(svg);
}
