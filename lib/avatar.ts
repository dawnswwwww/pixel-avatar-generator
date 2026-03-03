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

export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 40 + Math.floor(Math.random() * 30);
  return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
}

export function generateRandomColors(count: number): string[] {
  const colors: string[] = [];
  let i = 0;
  while (i < count) {
    colors.push(generateRandomColor());
    i++;
  }
  return colors;
}

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

export function generatePixelPattern(options: AvatarOptions): string[] {
  const colors = options.colors;
  let seed: number;

  if (options.seed !== undefined) {
    seed = options.seed;
  } else {
    seed = Math.floor(Math.random() * 10000);
  }

  const rng = new SeededRandom(seed);
  const usedColors = colors || generateRandomColors(4);

  const pattern: string[] = [];

  let y = 0;
  while (y < 8) {
    let row = '';
    let x = 0;
    while (x < 8) {
      let shouldDraw = !rng.nextBoolean();

      if (x >= 2 && x <= 5 && y >= 1 && y <= 6) {
        shouldDraw = rng.nextBoolean();
      }

      if ((x === 2 || x === 5) && (y === 3 || y === 4)) {
        shouldDraw = true;
      }

      if (x >= 3 && x <= 4 && y === 6) {
        shouldDraw = true;
      }

      if (shouldDraw) {
        const colorIndex = rng.nextInt(0, usedColors.length - 1);
        row = row + colorIndex.toString();
      } else {
        row = row + '-';
      }

      x++;
    }

    pattern.push(row);
    y++;
  }

  return pattern;
}

export function generateAvatarSVG(options: AvatarOptions = {}): string {
  let size = 128;
  if (options.size !== undefined) {
    size = options.size;
  }

  let pixelSize = 16;
  if (options.pixelSize !== undefined) {
    pixelSize = options.pixelSize;
  }

  const colors = options.colors;
  const seed = options.seed;
  let bgColor = options.bgColor;
  if (bgColor === undefined) {
    bgColor = generateRandomColor();
  }

  const gridSize = Math.floor(size / pixelSize);
  const pattern = generatePixelPattern({ colors, seed });
  const usedColors = colors || generateRandomColors(4);

  let svg = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">';

  svg = svg + '<rect width="' + size + '" height="' + size + '" fill="' + bgColor + '" />';

  let py = 0;
  while (py < pattern.length && py < gridSize) {
    let px = 0;
    while (px < pattern[py].length && px < gridSize) {
      const char = pattern[py][px];
      if (char !== '-') {
        const colorIndex = parseInt(char);
        const color = usedColors[colorIndex] || usedColors[0];
        svg = svg + '<rect x="' + (px * pixelSize) + '" y="' + (py * pixelSize) + '" width="' + pixelSize + '" height="' + pixelSize + '" fill="' + color + '" />';
      }

      px++;
    }

    py++;
  }

  svg = svg + '</svg>';

  return svg;
}

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
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, size, size);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, 'image/png');
  });
}

export function svgToDataURL(svg: string): string {
  return 'data:image/svg+xml;base64,' + btoa(svg);
}
