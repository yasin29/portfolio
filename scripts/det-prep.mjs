/* Optimise the DET Bridge AI-scoring screenshot into the case-study folder.
 * Landscape 1280x720, so it works as card thumbnail, drawer preview and banner.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'C:/Users/MSI/Downloads/s-1280x720_v-fms_webp_d9f4fd42-6c51-43fb-a3d8-0acc74cf33dc_middle.webp';
const OUT = 'D:/pm-job-search-2026/portfolio/public/case-studies/det-bridge';

fs.mkdirSync(OUT, { recursive: true });

const raw = fs.readFileSync(SRC);
const out = await sharp(raw)
  .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toBuffer();

const file = path.join(OUT, 'ai-scoring.webp');
fs.writeFileSync(file, out);
const m = await sharp(out).metadata();
console.log(`ai-scoring.webp  ${m.width}x${m.height}  ${(out.length / 1024).toFixed(0)}KB`);
