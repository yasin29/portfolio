// Assembles everything the chatbot is allowed to know into one context file.
//
// Why one file and not a vector store: the whole corpus is small enough to fit
// in a single model context. Stuffing it beats retrieval here — no chunk
// boundaries to split a fact across, no embedding drift, no index to keep in
// sync with the content. Revisit only if this grows past ~100k tokens.
//
// Output: content/knowledge-base.md  (committed, served to the chat API)
// Usage:  node scripts/build-knowledge-base.mjs

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'content', 'site.json');
const STUDIES = path.join(ROOT, 'content', 'case-studies');
const OUT = path.join(ROOT, 'content', 'knowledge-base.md');

const site = JSON.parse(fs.readFileSync(SITE, 'utf8'));
const out = [];
const w = (s = '') => out.push(s);

const p = site.profile;

w('# Knowledge base: Yasin Billah');
w();
w('This is the complete, authoritative source about Yasin Billah. Everything an');
w('assistant answers about him must come from this document.');
w();

/* ---------------- identity ---------------- */
w('## Who he is');
w();
w(`- Name: ${p.name}`);
w(`- Current title: ${p.role}`);
w(`- Positioning: ${p.tagline}`);
w(`- Location: ${p.location} (${p.timezone})`);
w(`- Work mode: ${p.workMode}`);
w(`- Focus: ${p.focus}`);
w(`- Availability: ${p.availability}`);
w(`- Currently at: ${p.currentlyAt.company} — ${p.currentlyAt.note} (${p.currentlyAt.url})`);
w(`- Email: ${p.email}`);
w(`- Phone: ${p.phone}`);
w(`- LinkedIn: ${p.socials.linkedin}`);
w(`- GitHub: ${p.socials.github}`);
w(`- Spoken languages: ${site.languages.map((l) => `${l.name} (${l.level})`).join(', ')}`);
if (p.heroProof) {
  w();
  w(`- Headline proof point: ${p.heroProof.text}`);
}
w();

/* ---------------- headline numbers ---------------- */
w('## Headline numbers (all defensible)');
w();
for (const h of site.highlights) w(`- ${h.value} — ${h.label}`);
w();
for (const g of site.impact) {
  w(`### ${g.category}`);
  w(g.blurb);
  w();
  for (const m of g.metrics) w(`- ${m.value} — ${m.label}. ${m.detail}`);
  w();
}

/* ---------------- story ---------------- */
w('## His story, in his own framing');
w();
w(`${site.story.statementLead}${site.story.statementEm}${site.story.statementTail}`);
w();
for (const para of site.story.paragraphs) { w(para); w(); }

w('## How he runs a project (his actual process, in order)');
w();
for (const [i, s] of site.pmProcess.entries()) {
  w(`${i + 1}. **${s.title}** — ${s.caption}. ${s.body}`);
  w(`   Methods: ${s.methods.join(', ')}`);
}
w();

w('## Operating principles');
w();
for (const pr of site.principles) w(`- **${pr.title}**: ${pr.body}`);
w();
w(`Philosophy, in his words: "${site.capabilities.philosophy.quote}"`);
w();

/* ---------------- experience ---------------- */
w('## Work experience');
w();
for (const e of site.experience) {
  w(`### ${e.company} — ${e.role} (${e.period})`);
  w(`${e.context}. ${e.blurb}`);
  w();
  for (const b of e.bullets) w(`- ${b}`);
  w();
}

/* ---------------- projects ---------------- */
const LABEL = {
  client: 'Client work (delivered for an external client at an employer)',
  owned: 'Product he owned as Product Manager',
  inhouse: 'In-house product built for the company itself',
  personal: 'His own personal build',
};

w('## Projects');
w();
for (const proj of site.projects) {
  w(`### ${proj.name} — ${proj.solution}`);
  w(`- Category: ${LABEL[proj.category]}`);
  w(`- Organisation: ${proj.org} · Role: ${proj.role} · Period: ${proj.period}`);
  if (proj.team) w(`- Team: ${proj.team}`);
  if (proj.approach) w(`- Delivery approach: ${proj.approach}`);
  if (proj.live) w(`- Live at: ${proj.live}`);
  if (proj.stack) w(`- Stack: ${proj.stack.join(', ')}`);
  if (proj.stats) w(`- Figures: ${proj.stats.map((s) => `${s.value} ${s.label}`).join(' · ')}`);
  w(`- Summary: ${proj.summary}`);
  const secs = proj.sections ?? [];
  for (const s of secs) {
    w(`- ${s.title}: ${s.body}${s.quote ? ` Key point: "${s.quote}"` : ''}`);
  }
  if (!secs.length) for (const c of proj.contribution) w(`- ${c}`);
  w();
}

/* ---------------- credentials ---------------- */
w('## Skills');
w();
for (const g of site.skillGroups) w(`- **${g.title}**: ${g.items.join(', ')}`);
w();

w('## Core competencies');
w();
for (const c of site.coreCompetencies) w(`- **${c.title}**: ${c.items}`);
w();

w('## Education');
w();
for (const e of site.education) {
  w(`- ${e.degree}, ${e.school} (${e.period})${e.note ? ` — ${e.note}` : ''}`);
}
w();

w('## Certifications');
w();
for (const c of site.certifications) {
  w(`- ${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.id ? ` (ID ${c.id})` : ''}`);
}
w();
w(`## Publication`);
w();
w(`- ${site.publication.title} — ${site.publication.venue}`);
w();

/* ---------------- full case studies ---------------- */
w('## Full case studies');
w();
if (fs.existsSync(STUDIES)) {
  const files = fs.readdirSync(STUDIES).filter((f) => /\.mdx?$/.test(f)).sort();
  for (const f of files) {
    const { data, content } = matter(fs.readFileSync(path.join(STUDIES, f), 'utf8'));
    w(`### Case study: ${data.title ?? f}`);
    w(`Client: ${data.client ?? 'n/a'} · Role: ${data.role ?? 'n/a'} · Period: ${data.period ?? 'n/a'}`);
    if (data.link) w(`Live: ${data.link}`);
    w();
    // strip JSX figures and image markup — the model only needs the prose
    w(content.replace(/<Figure[\s\S]*?\/>/g, '').replace(/\n{3,}/g, '\n\n').trim());
    w();
  }
}

const text = out.join('\n');
fs.writeFileSync(OUT, text, 'utf8');

const words = text.split(/\s+/).length;
console.log(`wrote content/knowledge-base.md`);
console.log(`  ${(text.length / 1024).toFixed(0)}KB · ${words.toLocaleString()} words · ~${Math.round(words * 1.33).toLocaleString()} tokens`);
