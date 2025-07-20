import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
  path.resolve(publicDir, 'manifest.json'),
  path.resolve(distDir, 'manifest.json')
);

// Copy background.js
fs.copyFileSync(
  path.resolve(publicDir, 'background.js'),
  path.resolve(distDir, 'background.js')
);

// Copy icons directory
const iconsDir = path.resolve(publicDir, 'icons');
const distIconsDir = path.resolve(distDir, 'icons');

if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Copy each icon file
['icon16.png', 'icon48.png', 'icon128.png'].forEach(iconFile => {
  const sourcePath = path.resolve(iconsDir, iconFile);
  const destPath = path.resolve(distIconsDir, iconFile);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
  } else {
    console.warn(`Warning: Icon file ${iconFile} not found in ${iconsDir}`);
  }
});

console.log('Extension files prepared successfully!');
console.log(`You can now load the extension from: ${distDir}`); 