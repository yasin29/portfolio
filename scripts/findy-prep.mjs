/* Optimise the Findy Team+ product screenshots into the case-study folder.
 *
 * These are Findy Inc.'s own product images and the figures on them are Findy's
 * demo data, not delivery outcomes from this project — every caption in the case
 * study has to keep that straight.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DL = 'C:/Users/MSI/Downloads';
const OUT = 'D:/pm-job-search-2026/portfolio/public/case-studies/findy-team';
const MAX_EDGE = 1600;

const PLAN = [
  { file: 'project-insights', src: `${DL}/s-1584x993_v-fms_webp_3b6d382d-c0fc-4772-8956-df9ac8dced74_middle.webp` },
  { file: 'investment-summary', src: `${DL}/s-776x517_v-fs_webp_a68c9a77-a0a9-4eb7-9dfc-91bc37d8d3f7_small.webp` },
  { file: 'outcome-summary', src: `${DL}/s-776x517_v-fs_webp_84cf2757-23e2-42c0-84c5-e08ba9ca00ac_small.webp` },
  { file: 'dora-metrics', src: `${DL}/s-776x517_v-fs_webp_1b0774fd-219e-4992-837b-91bf43efb289_small.webp` },
  { file: 'cycle-time', src: `${DL}/s-776x517_v-fs_webp_cf2bdcd4-5fb8-44c8-b4bf-7febcc70b09e_small.webp` },
  { file: 'cycle-time-comparison', src: 'D:/22-5-26/Screenshots/Screenshot 2026-08-03 132233.png' },
  { file: 'review-summary', src: `${DL}/s-776x517_v-fs_webp_89625725-6ff3-4b93-8252-a9b29e7bd409_small.webp` },
  { file: 'copilot-usage', src: `${DL}/s-776x517_v-fs_webp_802291fe-deec-432e-af4c-cc26c0f27fd5_small.webp` },
  { file: 'meeting-analytics', src: `${DL}/s-776x517_v-fs_webp_efbc1fd8-d3e3-4c70-b382-084053ace542_small.webp` },
  { file: 'team-survey', src: `${DL}/s-776x517_v-fs_webp_e52f8a42-00de-481d-80d0-aa8d6d49af45_small.webp` },
];

fs.mkdirSync(OUT, { recursive: true });

for (const p of PLAN) {
  if (!fs.existsSync(p.src)) { console.log(`MISSING  ${p.file}  <- ${p.src}`); continue; }
  const raw = fs.readFileSync(p.src); // Buffer, so sharp never holds the source path open
  const out = await sharp(raw)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT, `${p.file}.webp`), out);
  const m = await sharp(out).metadata();
  console.log(`${p.file}.webp`.padEnd(28), `${m.width}x${m.height}`, `${(out.length / 1024).toFixed(0)}KB`);
}
