// Copies case studies from ../case-studies/ into ./content/case-studies/
// Runs as predev / prebuild. Skips files starting with README or _.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, '..', '..', 'case-studies');
const dest = path.resolve(__dirname, '..', 'content', 'case-studies');

if (!fs.existsSync(src)) {
  console.warn(`[sync-case-studies] source not found: ${src}`);
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

const entries = fs.readdirSync(src, { withFileTypes: true });
let count = 0;

for (const entry of entries) {
  if (!entry.isFile()) continue;
  if (!entry.name.endsWith('.md')) continue;
  if (entry.name.startsWith('README') || entry.name.startsWith('_')) continue;

  const from = path.join(src, entry.name);
  const to = path.join(dest, entry.name.replace(/\.md$/, '.mdx'));
  fs.copyFileSync(from, to);
  count += 1;
}

console.log(`[sync-case-studies] copied ${count} case studies → ${dest}`);
