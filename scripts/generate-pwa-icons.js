// scripts/generate-pwa-icons.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Crisp SVG of the UncoverCeylon brand mark
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07111e"/>
      <stop offset="50%" stop-color="#0a1d37"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="gem" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Outer Rounded Container -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
  
  <!-- Island Mountain Silhouette Outline -->
  <path d="M120 340 L210 210 L280 290 L340 180 L410 340 Z" fill="rgba(2, 132, 199, 0.25)"/>
  
  <!-- Modern Geometric UC Monogram -->
  <g filter="url(#glow)">
    <!-- 'U' Monogram -->
    <path d="M170 170 L170 260 C170 295 198 322 232 322 L236 322 C270 322 298 295 298 260 L298 170" 
          fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Ceylon Sapphire Dot -->
    <circle cx="340" cy="200" r="24" fill="url(#gem)" stroke="#ffffff" stroke-width="6"/>
  </g>
  
  <!-- Sun / Dawn Aura -->
  <circle cx="256" cy="130" r="14" fill="#fbbf24" opacity="0.9"/>
</svg>
`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon.trim());
console.log('Created icon.svg');

async function buildIcons() {
  const buffer = Buffer.from(svgIcon);

  // 192x192 PNG
  await sharp(buffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  // 512x512 PNG
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('Created icon-512.png');

  // 512x512 Maskable PNG
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));
  console.log('Created icon-maskable-512.png');
}

buildIcons().catch(console.error);
