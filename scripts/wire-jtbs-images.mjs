// Wires the JTBS dashboard screenshots into the case study once they exist.
//
// Screenshots pasted into a chat cannot be written to disk, so drop the files
// into public/case-studies/jtbs-erp/ using the names below, then run this. It
// optimises each one to web-weight WebP and inserts the matching <Figure> into
// the case study at the section it illustrates.
//
// Usage: node scripts/wire-jtbs-images.mjs [--check]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'case-studies', 'jtbs-erp');
const STUDY = path.resolve(__dirname, '..', '..', 'case-studies', 'jtbs-erp.md');
const CHECK = process.argv.includes('--check');

/** Save each screenshot under `file`. `anchor` is the heading it slots under. */
const PLAN = [
  {
    file: 'purchase-orders',
    anchor: '## The problem\n',
    alt: 'JTBS purchase orders list showing supplier, address and transporter per order',
    caption: 'Purchase orders carry supplier, delivery address and transporter — the order is the contract, not just a quantity.',
  },
  {
    file: 'article-items',
    anchor: '## Approach\n',
    alt: 'JTBS article entry screen showing one article exploded into item codes by colour and size',
    caption: 'One article, thirty-plus items. Colour × size generates the rows; nobody types them by hand.',
  },
  {
    file: 'warehouse-transfer',
    anchor: '## What shipped\n',
    alt: 'JTBS inter-warehouse transfer screen with the godown network in a dropdown',
    caption: 'Stock lives in a network — dispatching unit, receiving store, main and retail warehouses, and regional godowns.',
  },
  {
    file: 'accounting-voucher',
    anchor: '## What shipped\n',
    alt: 'JTBS payable voucher entry with account codes, narration, debit and credit columns',
    caption: 'Double-entry accounting against the same data the inventory module writes.',
  },
  {
    file: 'pos-end-of-day',
    anchor: '## What I\'d do differently\n',
    alt: 'JTBS POS end-of-day reconciliation dialog showing sixteen cash and sales fields',
    caption: 'Sixteen fields at the moment a tired cashier wants to go home — correct, and denser than it needed to be.',
  },
  {
    file: 'privilege-sets',
    anchor: '## Outcome\n',
    alt: 'JTBS advanced security settings listing more than ten privilege sets',
    caption: 'Access control as a feature: finance groups split by the accounts they may touch, and a locked-year group that can read but not post.',
  },
  {
    file: 'customer-suppliers',
    anchor: '## The problem\n',
    alt: 'JTBS customer entry showing per-supplier discount percentages and credit terms',
    caption: 'Pricing is a matrix: a discount that varies by supplier, on top of credit limit and running balance.',
  },
];

const EXTS = ['.png', '.jpg', '.jpeg', '.webp'];

function findSource(stem) {
  for (const ext of EXTS) {
    const p = path.join(DIR, stem + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const present = PLAN.map((p) => ({ ...p, src: findSource(p.file) }));
const missing = present.filter((p) => !p.src);

console.log(`Looking in ${path.relative(process.cwd(), DIR)}\n`);
for (const p of present) {
  console.log(`  ${p.src ? 'found  ' : 'MISSING'}  ${p.file}.(png|jpg|webp)`);
}

if (missing.length) {
  console.log(`\n${missing.length} still missing. Save them with those exact names, then re-run.`);
}
if (CHECK || !present.some((p) => p.src)) process.exit(0);

// --- optimise + insert ---
const sharp = (await import('sharp')).default;
let study = fs.readFileSync(STUDY, 'utf8');
let wired = 0;

for (const p of present) {
  if (!p.src) continue;

  const out = path.join(DIR, `${p.file}.webp`);
  const input = fs.readFileSync(p.src);
  const buf = await sharp(input)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const tmp = out + '.tmp';
  fs.writeFileSync(tmp, buf);
  if (p.src !== out) fs.rmSync(p.src, { force: true });
  fs.rmSync(out, { force: true });
  fs.renameSync(tmp, out);
  console.log(`  optimised ${p.file}.webp  ${(input.length / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`);

  const figure = `\n<Figure\n  src="/case-studies/jtbs-erp/${p.file}.webp"\n  alt="${p.alt}"\n  caption="${p.caption}"\n/>\n`;
  if (study.includes(`/case-studies/jtbs-erp/${p.file}.webp`)) continue;
  if (!study.includes(p.anchor)) {
    console.warn(`  ! anchor not found for ${p.file}: ${p.anchor.trim()}`);
    continue;
  }
  study = study.replace(p.anchor, p.anchor + figure);
  wired += 1;
}

fs.writeFileSync(STUDY, study, 'utf8');
console.log(`\n${wired} figure(s) inserted into case-studies/jtbs-erp.md`);
console.log('Run `npm run build` to publish.');
