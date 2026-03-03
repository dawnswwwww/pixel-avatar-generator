# 🎨 Pixel Avatar Generator

A modern, pixel art avatar generator built with Next.js 14, TypeScript, and Tailwind CSS. Generate unique pixel avatars instantly with full control over size, colors, and patterns.

## ✨ Features

- 🎨 **Random Generation** - Create unique pixel art avatars with a single click
- 🎲 **Customizable** - Adjust size, pixel size, color count, and more
- 🔢 **Seed-based** - Reproduce the same avatar with a seed value
- 🎯 **Custom Colors** - Use your own color palette
- 📥 **Multiple Formats** - Export as SVG or PNG
- 🚀 **Fast API** - Edge runtime for instant responses
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/dawnswwwww/pixel-avatar-generator.git
cd pixel-avatar-generator

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Generate Avatar

```http
GET /api/avatar?size=128&pixelSize=16&seed=123&format=svg
```

**Parameters:**

| Parameter | Type | Range | Default | Description |
|-----------|-------|--------|----------|-------------|
| `size` | number | 16-1024 | 128 | Total avatar size in pixels |
| `pixelSize` | number | 4-64 | 16 | Size of each pixel block |
| `seed` | number | any | random | Random seed for reproducibility |
| `colors` | string | - | random | Comma-separated hex colors (e.g., `ff0000,00ff00,0000ff`) |
| `format` | string | svg, json | svg | Response format |

**Response:**
- `svg` - Returns SVG image
- `json` - Returns JSON with SVG data URL and metadata

**Examples:**

```bash
# Basic avatar (128x128)
curl http://localhost:3000/api/avatar --output avatar.svg

# Custom size and seed
curl "http://localhost:3000/api/avatar?size=256&pixelSize=32&seed=42" --output avatar.svg

# Custom colors
curl "http://localhost:3000/api/avatar?colors=ff0000,00ff00,0000ff" --output avatar.svg

# Get JSON response
curl "http://localhost:3000/api/avatar?format=json" | jq
```

### Get Random Colors

```http
GET /api/colors?count=5
```

**Parameters:**

| Parameter | Type | Range | Default |
|-----------|-------|--------|---------|
| `count` | number | 1-20 | 5 |

**Response:**

```json
{
  "colors": [
    "hsl(123, 70%, 50%)",
    "hsl(234, 65%, 45%)",
    "hsl(345, 80%, 55%)",
    "hsl(56, 60%, 48%)",
    "hsl(167, 72%, 42%)"
  ]
}
```

## 💡 Usage Examples

### In HTML

```html
<img src="/api/avatar?size=128" alt="Pixel Avatar" />
```

### In React

```tsx
import Image from 'next/image';

<Image
  src={`/api/avatar?size=256&seed=${seed}`}
  alt="Avatar"
  width={256}
  height={256}
/>
```

### In JavaScript

```javascript
const response = await fetch('/api/avatar?size=128&seed=42');
const svg = await response.text();
document.getElementById('avatar').innerHTML = svg;
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime:** Edge (for fast API responses)
- **Image Processing:** SVG-based (client-side)

## 📁 Project Structure

```
pixel-avatar-generator/
├── app/
│   ├── api/
│   │   ├── avatar/
│   │   │   └── route.ts     # Avatar generation API
│   │   └── colors/
│   │       └── route.ts     # Color generation API
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Main page
│   └── globals.css            # Global styles
├── lib/
│   └── avatar.ts             # Avatar generation logic
├── public/                   # Static assets
├── next.config.ts            # Next.js config
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── package.json            # Dependencies
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dawnswwwww/pixel-avatar-generator)

1. Click the button above
2. Connect your GitHub account
3. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:

- **Vercel** - Fastest, free tier available
- **Netlify** - Great free tier
- **Railway** - Easy setup
- **Cloudflare Pages** - Global CDN

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by pixel art aesthetics

---

Made with ❤️ using Next.js and TypeScript
