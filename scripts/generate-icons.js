import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');
const iconsDir = path.resolve(publicDir, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to create an icon
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background with dark color
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, size, size);

  // Draw 'EP' text
  ctx.fillStyle = '#00ff9d';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EP', size / 2, size / 2);

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
}

// Generate icons in different sizes
[16, 48, 128].forEach(size => createIcon(size));
console.log('Icons generated successfully!'); 