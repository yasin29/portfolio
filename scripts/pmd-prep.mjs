/* Prepare the PM Dashboard screenshots for the case study.
 *
 * This is a live internal tool, so the shots carry colleagues' names, work
 * email addresses and profile photos. Those are blurred into the pixels before
 * optimisation — flattened, not overlaid, so nothing can be peeled back off the
 * published file. Project and client names are deliberately left alone; see the
 * note in the case study commit.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'D:/22-5-26/Screenshots';
const OUT = 'D:/pm-job-search-2026/portfolio/public/case-studies/pm-dashboard';
const MAX_EDGE = 1600;

/** The signed-in user's name and role, bottom-left of every screen. */
const SIDEBAR_USER = { left: 8, top: 820, width: 190, height: 50 };

const PLAN = [
  {
    file: 'health-board',
    src: `${SRC}/Screenshot 2026-08-03 135225.png`,
    redact: [
      { left: 808, top: 344, width: 160, height: 220 }, // PM column
      SIDEBAR_USER,
    ],
  },
  {
    file: 'team-board',
    src: `${SRC}/Screenshot 2026-08-03 135238.png`,
    redact: [
      { left: 818, top: 338, width: 165, height: 110 }, // PM column
      { ...SIDEBAR_USER, top: 818 },
    ],
  },
  {
    file: 'members',
    src: `${SRC}/Screenshot 2026-08-03 135254.png`,
    redact: [
      { left: 412, top: 210, width: 258, height: 605 }, // name, email and avatar column
      SIDEBAR_USER,
    ],
  },
  {
    file: 'project-overview',
    src: `${SRC}/Screenshot 2026-08-03 135319.png`,
    redact: [
      { left: 518, top: 104, width: 95, height: 27 }, // PM: <name>
      SIDEBAR_USER,
    ],
  },
  {
    file: 'milestone-progress',
    src: `${SRC}/Screenshot 2026-08-03 135337.png`,
    redact: [
      { left: 476, top: 106, width: 100, height: 27 }, // PM: <name>
      { ...SIDEBAR_USER, top: 824 },
    ],
  },
  {
    file: 'tickets',
    src: `${SRC}/Screenshot 2026-08-03 135353.png`,
    redact: [
      { left: 513, top: 102, width: 95, height: 27 }, // PM: <name>
      { left: 1484, top: 470, width: 95, height: 34 }, // assignee avatar + name
      { ...SIDEBAR_USER, top: 818 },
    ],
  },
];

fs.mkdirSync(OUT, { recursive: true });

for (const p of PLAN) {
  if (!fs.existsSync(p.src)) { console.log(`MISSING  ${p.file}`); continue; }
  const raw = fs.readFileSync(p.src);
  const meta = await sharp(raw).metadata();

  const patches = [];
  for (const r of p.redact) {
    const region = {
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      width: Math.min(r.width, meta.width - r.left),
      height: Math.min(r.height, meta.height - r.top),
    };
    patches.push({
      input: await sharp(raw).extract(region).blur(12).toBuffer(),
      left: region.left,
      top: region.top,
    });
  }

  const flattened = await sharp(raw).composite(patches).png().toBuffer();
  const out = await sharp(flattened)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  fs.writeFileSync(path.join(OUT, `${p.file}.webp`), out);
  const m = await sharp(out).metadata();
  console.log(`${p.file}.webp`.padEnd(24), `${m.width}x${m.height}`,
    `${(out.length / 1024).toFixed(0)}KB`, `${p.redact.length} blurred`);
}
