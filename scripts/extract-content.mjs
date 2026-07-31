// One-off migration: lifts the hardcoded data out of src/lib/profile.ts and
// src/lib/projects.ts into content/site.json, so the admin dashboard has
// something it can actually edit. Run once; afterwards the JSON is the source
// of truth and this script is only useful for re-deriving it.
//
// Usage: node --experimental-strip-types scripts/extract-content.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'site.json');

const profileMod = await import('../src/lib/profile.ts');
const projectsMod = await import('../src/lib/projects.ts');

// basePath is applied at render time, so store bare public paths in the data.
const strip = (v) => (typeof v === 'string' ? v.replace(/^\/portfolio(?=\/)/, '') : v);

const p = { ...profileMod.profile };
p.resume = strip(p.resume);
p.photo = strip(p.photo);
p.photoCutout = strip(p.photoCutout);

const data = {
  // everything the admin dashboard will be able to edit
  profile: p,
  languages: profileMod.languages,
  highlights: profileMod.highlights,
  marqueeCompanies: profileMod.marqueeCompanies,
  story: profileMod.story,
  howIOperate: profileMod.howIOperate,
  pmProcess: profileMod.pmProcess,
  capabilities: profileMod.capabilities,
  coreCompetencies: profileMod.coreCompetencies,
  impact: profileMod.impact,
  experience: profileMod.experience,
  skillGroups: profileMod.skillGroups,
  certifications: profileMod.certifications,
  education: profileMod.education,
  publication: profileMod.publication,
  principles: profileMod.principles,
  projects: projectsMod.projects,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');

const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`wrote content/site.json (${kb}KB)`);
for (const [k, v] of Object.entries(data)) {
  console.log(`  ${k.padEnd(18)} ${Array.isArray(v) ? v.length + ' items' : 'object'}`);
}
