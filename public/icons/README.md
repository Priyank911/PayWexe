# ExePay Extension Icons

This directory should contain the following icon files for the Chrome extension:

- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

## Creating Icons

You can create these icons using any image editing software like:

1. **Adobe Photoshop**
2. **GIMP** (free, open-source)
3. **Figma** (free, web-based)
4. **Canva** (free, web-based)

## Icon Requirements

- Format: PNG
- Background: Transparent
- Colors: Match the ExePay brand colors (#00ff9d for accent)
- Style: Simple, recognizable, and works well at small sizes

## Quick Solution

If you don't have image editing software, you can:

1. Search for "free icon generator" online
2. Create a simple icon with the text "EP" or a payment symbol
3. Download in the required sizes (16x16, 48x48, 128x128)
4. Place the files in this directory

## Testing Icons

After creating the icons, run:

```bash
npm run build:extension
```

Then load the extension in Chrome to verify the icons appear correctly. 