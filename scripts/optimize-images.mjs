// Re-encodes oversized case-study screenshots to web-weight WebP.
//
// Source screenshots come off retina displays at 3-5x the size they are ever
// rendered at, so a 10-17 MB PNG ships for a card that is at most ~1600px wide.
// This caps the long edge and re-encodes to WebP, keeping visual quality.
//
// Usage: node scripts/optimize-images.mjs [--dry]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'public', 'case-studies');

const MAX_EDGE = 1600;
const QUALITY = 82;
const THRESHOLD = 40 * 1024; // convert anything above 40KB to WebP
const DRY = process.argv.includes('--dry');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const targets = walk(ROOT).filter(
  (f) => /\.(png|jpe?g|webp)$/i.test(f) && fs.statSync(f).size > THRESHOLD
);

if (!targets.length) {
  console.log('[optimize-images] nothing above threshold');
  process.exit(0);
}

let saved = 0;

for (const file of targets) {
  const before = fs.statSync(file).size;
  const out = file.replace(/\.(png|jpe?g|webp)$/i, '.webp');

  try {
    // Read into memory first: given a path, sharp keeps the file open and
    // Windows then refuses to overwrite or delete it in the same process.
    const input = fs.readFileSync(file);
    const buf = await sharp(input)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer();

    if (buf.length >= before && path.extname(file).toLowerCase() === '.webp') {
      console.log(`  skip  ${path.basename(file)} (already smaller)`);
      continue;
    }

    console.log(
      `  ${DRY ? 'would write' : 'write'}  ${path.relative(ROOT, out)}  ${kb(before)} -> ${kb(buf.length)}`
    );

    if (!DRY) {
      // Write via a temp file: on Windows, writing straight back to the path
      // sharp just read locks the handle and fails.
      const tmp = `${out}.tmp`;
      fs.writeFileSync(tmp, buf);
      if (out !== file) fs.unlinkSync(file); // drop the heavy original
      fs.rmSync(out, { force: true });
      fs.renameSync(tmp, out);
    }
    saved += before - buf.length;
  } catch (err) {
    console.warn(`  FAIL  ${path.basename(file)}: ${err.message}`);
  }
}

console.log(`[optimize-images] ${DRY ? 'would save' : 'saved'} ${kb(saved)} across ${targets.length} files`);
