// Pulls project screenshots for the case studies that have none yet.
//
// Two sources:
//   1. potentialai.com portfolio pages — the project shots live on S3 with a
//      predictable `<uuid>-<n>.png` name; site chrome is filtered out.
//   2. live product sites — captured with headless Edge, which gives a truer
//      picture of the shipped product than scraping their marketing assets.
//
// Downloads land in public/case-studies/<slug>/ and are then re-encoded by
// scripts/optimize-images.mjs.
//
// Usage: node scripts/fetch-project-images.mjs [slug ...]

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = path.resolve(__dirname, '..', 'public', 'case-studies');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

/** Portfolio pages whose S3 media we scrape. */
const SCRAPE = {
  thrll: 'https://potentialai.com/portfolio/the-personalized-adventure-platform',
  trustix: 'https://potentialai.com/portfolio/sports-ticket-supplier-management-dashboard',
  'cart-traders': 'https://potentialai.com/portfolio/card-traders-app',
  elite4print: 'https://potentialai.com/portfolio/elite4print',
  ktalk: 'https://potentialai.com/portfolio/korean-language-learning-platform',
};

/** Live products we screenshot directly. */
const SHOOT = {
  'findy-job': 'https://en.findy-team.io/',
  futurenation: 'https://platform.futurenation.gov.bd/',
  'det-bridge': 'https://det-bridge.com/',
  'lifeark-nihongo': 'https://www.lifeark-nihongo.com/',
  'jtbs-erp': 'https://jtbs.jintech.com/home/',
};

const only = process.argv.slice(2);
const wanted = (slug) => only.length === 0 || only.includes(slug);

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function scrape(slug, pageUrl) {
  const html = await fetchText(pageUrl);
  const all = html.match(/https:\/\/potential-website-media\.s3[^"'\\ )]+\.(?:png|jpe?g|webp)/gi) ?? [];

  // Some pages number their shots (`-1.png`), others name them
  // (`Overview-Elite4Print.jpg`). Take both; drop thumbnails and icon art.
  const ICONS = /(layers|source-code|phone-developer|icon|logo|thumbnail)/i;
  const shots = [...new Set(all)]
    .filter((u) => !ICONS.test(u))
    .sort((a, b) => {
      const n = (s) => parseInt(s.match(/-(\d+)\.\w+$/)?.[1] ?? '99', 10);
      return n(a) - n(b) || a.localeCompare(b);
    });

  if (!shots.length) {
    console.log(`  ${slug}: no project images found on the page`);
    return 0;
  }

  const dir = path.join(OUT_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });

  let n = 0;
  for (const [i, url] of shots.entries()) {
    const ext = path.extname(new URL(url).pathname) || '.png';
    const dest = path.join(dir, `screen-${i + 1}${ext}`);
    try {
      const bytes = await download(url, dest);
      console.log(`  ${slug}: screen-${i + 1}${ext}  ${(bytes / 1024).toFixed(0)}KB`);
      n += 1;
    } catch (err) {
      console.warn(`  ${slug}: FAILED ${url} — ${err.message}`);
    }
  }
  return n;
}

async function shoot(slug, url) {
  if (!fs.existsSync(EDGE)) {
    console.warn(`  ${slug}: Edge not found, skipping screenshot`);
    return 0;
  }
  const dir = path.join(OUT_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, 'screen-1.png');

  try {
    await run(EDGE, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--virtual-time-budget=12000',
      '--window-size=1440,900',
      `--screenshot=${dest}`,
      url,
    ], { timeout: 90_000 });

    if (!fs.existsSync(dest) || fs.statSync(dest).size < 5000) {
      console.warn(`  ${slug}: screenshot empty or tiny — site likely blocked the request`);
      fs.rmSync(dest, { force: true });
      return 0;
    }
    console.log(`  ${slug}: screen-1.png  ${(fs.statSync(dest).size / 1024).toFixed(0)}KB`);
    return 1;
  } catch (err) {
    console.warn(`  ${slug}: screenshot failed — ${err.message.split('\n')[0]}`);
    return 0;
  }
}

let total = 0;

console.log('Scraping portfolio pages:');
for (const [slug, url] of Object.entries(SCRAPE)) {
  if (!wanted(slug)) continue;
  try {
    total += await scrape(slug, url);
  } catch (err) {
    console.warn(`  ${slug}: page fetch failed — ${err.message}`);
  }
}

console.log('Capturing live products:');
for (const [slug, url] of Object.entries(SHOOT)) {
  if (!wanted(slug)) continue;
  total += await shoot(slug, url);
}

console.log(`\n[fetch-project-images] ${total} images written. Run optimize-images.mjs next.`);
