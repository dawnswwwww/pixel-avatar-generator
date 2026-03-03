'use client';

import { useState } from 'react';
import Head from 'next/head';
import { generateAvatarSVG, svgToDataURL, generateRandomColors, AvatarOptions } from '@/lib/avatar';

export default function Home() {
  const [size, setSize] = useState(128);
  const [pixelSize, setPixelSize] = useState(16);
  const [colorCount, setColorCount] = useState(4);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate avatar
  const generateAvatar = () => {
    setIsGenerating(true);
    const colors = useCustomColors ? customColors : undefined;
    const svg = generateAvatarSVG({ size, pixelSize, colors, seed });
    setAvatarSvg(svg);
    setIsGenerating(false);
  };

  // Generate new random avatar
  const randomize = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    setSeed(newSeed);
    setCustomColors(generateRandomColors(colorCount));
  };

  // Download avatar
  const downloadAvatar = (format: 'svg' | 'png') => {
    if (!avatarSvg) return;

    if (format === 'svg') {
      const blob = new Blob([avatarSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avatar-${seed}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(avatarSvg);
      img.onload = () => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `avatar-${seed}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
    }
  };

  // Initialize
  useState(() => {
    generateAvatar();
  });

  return (
    <>
      <Head>
        <title>Pixel Avatar Generator</title>
        <meta name="description" content="Generate pixel art avatars" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🎨 Pixel Avatar Generator
            </h1>
            <p className="text-white/90 text-lg">
              Create unique pixel art avatars instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ⚙️ Settings
              </h2>

              {/* Size Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="32"
                  max="512"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Pixel Size Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pixel Size: {pixelSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={pixelSize}
                  onChange={(e) => setPixelSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Color Count Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Count: {colorCount}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={colorCount}
                  onChange={(e) => setColorCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Seed Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seed: {seed}
                </label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Use Custom Colors Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCustomColors"
                  checked={useCustomColors}
                  onChange={(e) => setUseCustomColors(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="useCustomColors" className="text-sm font-semibold text-gray-700">
                  Use Custom Colors
                </label>
              </div>

              {/* Custom Colors Display */}
              {useCustomColors && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Colors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {customColors.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...customColors];
                          newColors[index] = e.target.value;
                          setCustomColors(newColors);
                        }}
                        className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={generateAvatar}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '⏳ Generating...' : '✨ Generate'}
                </button>
                <button
                  onClick={randomize}
                  className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-all"
                >
                  🎲 Random
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                👁️ Preview
              </h2>

              <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center mb-6">
                {avatarSvg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: avatarSvg }}
                    className="max-w-full"
                    style={{
                      imageRendering: 'pixelated',
                    }}
                  />
                ) : (
                  <div className="text-gray-500">Loading...</div>
                )}
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadAvatar('svg')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  📥 Download SVG
                </button>
                <button
                  onClick={() => downloadAvatar('png')}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  📥 Download PNG
                </button>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📚 API Usage
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Generate Avatar:</h3>
                <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  GET /api/avatar?size=128&amp;pixelSize=16&amp;seed=123
                </code>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Parameters:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><code>size</code> (16-1024) - Avatar size in pixels</li>
                  <li><code>pixelSize</code> (4-64) - Size of each pixel</li>
                  <li><code>seed</code> - Random seed for reproducibility</li>
                  <li><code>colors</code> - Comma-separated hex colors</li>
                  <li><code>format</code> - svg or json</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Example:</h3>
                <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  &lt;img src="/api/avatar?size=128" alt="Avatar" /&gt;
                </code>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
