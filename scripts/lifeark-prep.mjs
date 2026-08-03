/* Optimise the LifeArk Nihongo screenshots into the case-study folder.
 *
 * These are phone-width captures of the live product. They are portrait and
 * narrow, so they are capped on height rather than width — a 1600px width cap
 * would upscale nothing and the height is what decides how much page they eat.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'D:/22-5-26/Screenshots';
const OUT = 'D:/pm-job-search-2026/portfolio/public/case-studies/lifeark-nihongo';
const MAX_EDGE = 1400;

const PLAN = [
  { file: 'home-lessons', src: `${SRC}/Screenshot 2026-08-03 134015.png` },
  { file: 'learning-path', src: `${SRC}/Screenshot 2026-08-03 134044.png` },
  { file: 'training-gym', src: `${SRC}/Screenshot 2026-08-03 134052.png` },
  { file: 'streaks-badges', src: `${SRC}/Screenshot 2026-08-03 134221.png` },
  { file: 'jlpt-levels', src: `${SRC}/Screenshot 2026-08-03 134244.png` },
];

fs.mkdirSync(OUT, { recursive: true });

for (const p of PLAN) {
  if (!fs.existsSync(p.src)) { console.log(`MISSING  ${p.file}`); continue; }
  const raw = fs.readFileSync(p.src);
  const out = await sharp(raw)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT, `${p.file}.webp`), out);
  const m = await sharp(out).metadata();
  console.log(`${p.file}.webp`.padEnd(24), `${m.width}x${m.height}`, `${(out.length / 1024).toFixed(0)}KB`);
}
