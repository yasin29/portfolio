/* Prepare the five JTBS screenshots for the case study.
 *
 * Two of them show real personal data — a supplier's named contact with phone
 * and email, and a POS employee roster carrying cell numbers and CNIC (national
 * ID) numbers for eighteen people. That cannot go on a public, indexed page, so
 * those regions are blurred out before the image is optimised. Blur is applied
 * to the source pixels and flattened, not overlaid, so there is nothing to peel
 * back off the published file.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'D:/22-5-26/Screenshots';
const OUT = 'D:/pm-job-search-2026/portfolio/public/case-studies/jtbs-erp';
const MAX_EDGE = 1600;

const PLAN = [
  {
    file: 'supplier-terms',
    src: `${SRC}/Screenshot 2026-08-03 131135.png`,
    // contact person + address block, and the phone/mobile/email column
    redact: [
      { left: 232, top: 524, width: 480, height: 128 },
      { left: 862, top: 558, width: 310, height: 92 },
    ],
  },
  { file: 'article-items', src: `${SRC}/Screenshot 2026-08-03 131403.png`, redact: [] },
  { file: 'warehouse-transfer', src: `${SRC}/Screenshot 2026-08-03 131450.png`, redact: [] },
  { file: 'accounting-reports', src: `${SRC}/Screenshot 2026-08-03 131540.png`, redact: [] },
  {
    file: 'pos-employees',
    src: `${SRC}/Screenshot 2026-08-03 131631.png`,
    // surname, CELL # and CNIC # columns, full height of the table. First name
    // plus role is generic enough to read as demo data; a full name next to a
    // national ID number on an indexed page is not.
    redact: [{ left: 440, top: 288, width: 875, height: 620 }],
  },
];

fs.mkdirSync(OUT, { recursive: true });

for (const p of PLAN) {
  const raw = fs.readFileSync(p.src); // read to a Buffer so sharp never locks the path
  let img = sharp(raw);
  const meta = await img.metadata();

  if (p.redact.length) {
    const patches = [];
    for (const r of p.redact) {
      const region = {
        left: Math.max(0, r.left),
        top: Math.max(0, r.top),
        width: Math.min(r.width, meta.width - r.left),
        height: Math.min(r.height, meta.height - r.top),
      };
      const blurred = await sharp(raw).extract(region).blur(14).toBuffer();
      patches.push({ input: blurred, left: region.left, top: region.top });
    }
    // flatten the blur into the pixels before anything else touches the image
    img = sharp(await img.composite(patches).png().toBuffer());
  }

  const out = await img
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  fs.writeFileSync(path.join(OUT, `${p.file}.webp`), out);
  console.log(
    `${p.file}.webp  ${(out.length / 1024).toFixed(0)}KB` +
      (p.redact.length ? `  (${p.redact.length} region(s) blurred)` : '')
  );
}
