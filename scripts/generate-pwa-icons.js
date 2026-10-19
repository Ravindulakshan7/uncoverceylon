// Generate every brand/app icon from the supplied artwork without redrawing it.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.join(__dirname, '..');
const iconsDir = path.join(root, 'public', 'icons');
const brandDir = path.join(root, 'public', 'brand');
const source = path.join(brandDir, 'logo-source.png');
fs.mkdirSync(iconsDir, { recursive: true });

async function squareIcon(size, safeArea = 0.8) {
  const markSize = Math.round(size * safeArea);
  const mark = await sharp(source).trim().resize(markSize, markSize, { fit: 'contain', background: '#00000000' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: '#F5F3EC' } })
    .composite([{ input: mark, gravity: 'centre' }]).png().toBuffer();
}

async function buildIcons() {
  await sharp(source).trim().resize(512, 512, { fit: 'contain', background: '#00000000' }).png().toFile(path.join(brandDir, 'uncover-ceylon.png'));
  for (const size of [192, 512]) fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), await squareIcon(size));
  // Keep all artwork inside the maskable icon safe zone.
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), await squareIcon(512, 0.66));
  fs.writeFileSync(path.join(iconsDir, 'favicon-32.png'), await squareIcon(32, 0.88));
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), await squareIcon(180));
  const icon = await squareIcon(512);
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${icon.toString('base64')}"/></svg>`);
  // ICO container with PNG frames, supported by modern browsers and Windows.
  const frames = await Promise.all([16, 32, 48].map(size => squareIcon(size, 0.88)));
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, index) => {
    const entry = 6 + index * 16;
    header[entry] = [16, 32, 48][index];
    header[entry + 1] = [16, 32, 48][index];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(frame.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += frame.length;
  });
  fs.writeFileSync(path.join(root, 'src', 'app', 'favicon.ico'), Buffer.concat([header, ...frames]));
  console.log('Generated website logo, favicon, Apple and PWA icons from the supplied artwork.');
}
buildIcons().catch(error => { console.error(error); process.exitCode = 1; });
