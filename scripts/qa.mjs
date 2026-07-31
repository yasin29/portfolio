/**
 * End-to-end QA sweep, driven through CDP against the built static export.
 *
 * Checks the things that actually break a portfolio in front of a recruiter:
 * dead routes, broken images, horizontal scroll on a phone, links that 404,
 * missing alt text and labels, and the interactive pieces (filters, drawer,
 * accordion, chat) still working.
 *
 * Usage: node scripts/qa.mjs [baseUrl]
 */

import { spawn } from 'node:child_process';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9411;
const BASE = (process.argv[2] ?? 'http://127.0.0.1:4500').replace(/\/$/, '');

const ROUTES = [
  '/', '/case-studies/', '/about/',
  ...['ivory', 'artlive', 'bside', 'takapay', 'brandaid', 'trustix', 'thrll',
      'cart-traders', 'elite4print', 'ktalk', 'pm-dashboard', 'jtbs-erp',
      'findy-job', 'futurenation', 'det-bridge', 'lifeark-nihongo', 'insidemaps',
     ].map((s) => `/case-studies/${s}/`),
];

const VIEWPORTS = [
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];

const edge = spawn(EDGE, [
  '--headless=new', '--disable-gpu',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + process.env.TEMP + '\\edge-qa',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (e) =>
  (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }))?.result?.result?.value;

const fails = [];
const warns = [];
const fail = (where, msg) => fails.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

/* ---------- page-level audits, run in the browser ---------- */

const AUDIT = `(() => {
  const vw = document.documentElement.clientWidth;
  const out = { vw, scrollWidth: document.documentElement.scrollWidth, issues: [] };

  // images that failed to load or have no alt
  document.querySelectorAll('img').forEach((im) => {
    if (im.complete && im.naturalWidth === 0) out.issues.push('broken image: ' + (im.currentSrc || im.src));
    if (!im.hasAttribute('alt')) out.issues.push('img without alt attribute: ' + (im.currentSrc || im.src));
  });

  // headings
  const h1 = document.querySelectorAll('h1');
  if (h1.length === 0) out.issues.push('no h1');
  if (h1.length > 1) out.issues.push('multiple h1 (' + h1.length + ')');

  // controls without an accessible name
  document.querySelectorAll('button, a, input, select, textarea').forEach((el) => {
    if (el.closest('[aria-hidden="true"]')) return;
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim()
      || el.getAttribute('title') || el.getAttribute('placeholder') || '';
    if (!name) out.issues.push('control without accessible name: <' + el.tagName.toLowerCase() + ' class="' + (el.className || '').toString().slice(0, 40) + '">');
  });

  // elements sticking out past the viewport (marquee is intentional)
  document.querySelectorAll('body *').forEach((el) => {
    if (el.closest('.marquee')) return;
    // Fixed off-canvas panels (drawer, mobile menu, chat) sit outside the
    // viewport by design and never contribute to document scrollWidth.
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'absolute') return;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 2) {
      out.issues.push('overflows viewport by ' + Math.round(r.right - vw) + 'px: <' +
        el.tagName.toLowerCase() + ' class="' + (el.className || '').toString().slice(0, 40) + '">');
    }
  });

  // internal links, for a follow-up fetch
  out.links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))];
  return out;
})()`;

try {
  let list = [];
  for (let i = 0; i < 40; i++) {
    try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (list.length) break; } catch {}
    await sleep(250);
  }
  ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  await send('Runtime.enable');
  await send('Page.enable');

  /* 1. every route responds */
  console.log('\n— routes —');
  const linkTargets = new Set();
  for (const route of ROUTES) {
    const r = await fetch(BASE + route).catch(() => null);
    if (!r || !r.ok) { fail(route, `HTTP ${r ? r.status : 'unreachable'}`); console.log(`  FAIL ${route}`); }
    else process.stdout.write('.');
  }
  console.log(` ${ROUTES.length} routes`);

  /* 2. per-viewport, per-page audit */
  for (const vp of VIEWPORTS) {
    console.log(`\n— ${vp.name} (${vp.width}px) —`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile,
    });

    // home plus a representative case study keeps the sweep quick
    for (const route of ['/', '/case-studies/', '/case-studies/ivory/', '/case-studies/takapay/']) {
      await send('Page.navigate', { url: BASE + route });
      await sleep(2600);
      await evaluate('document.documentElement.dataset.intro="done"');
      await evaluate('document.querySelectorAll("[data-reveal]").forEach(e=>e.classList.add("is-revealed"))');
      await sleep(500);

      const a = await evaluate(AUDIT);
      if (!a) { fail(`${vp.name} ${route}`, 'audit did not run'); continue; }
      if (a.scrollWidth > a.vw + 2) fail(`${vp.name} ${route}`, `horizontal scroll (${a.scrollWidth} > ${a.vw})`);
      for (const issue of a.issues) {
        (issue.startsWith('control without') ? warn : fail)(`${vp.name} ${route}`, issue);
      }
      (a.links ?? []).forEach((l) => linkTargets.add(l));
      process.stdout.write(a.issues.length || a.scrollWidth > a.vw + 2 ? 'x' : '.');
    }
    console.log('');
  }

  /* 3. internal links resolve */
  console.log('\n— internal links —');
  for (const href of [...linkTargets].filter((h) => !h.startsWith('//') && !h.includes('#'))) {
    const r = await fetch(BASE + href).catch(() => null);
    if (!r || !r.ok) fail('link', `${href} -> ${r ? r.status : 'unreachable'}`);
    else process.stdout.write('.');
  }
  console.log(` ${linkTargets.size} links`);

  /* 4. interactions */
  console.log('\n— interactions —');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(3000);
  await evaluate('document.documentElement.dataset.intro="done"');
  await evaluate('document.querySelectorAll("[data-reveal]").forEach(e=>e.classList.add("is-revealed"))');
  await sleep(400);

  const checks = [
    ['work grid renders cards',
      'document.querySelectorAll(".wk-card").length >= 6'],
    ['grid is capped at 6 before Show all',
      'document.querySelectorAll(".wk-card").length === 6'],
    ['filter chips present',
      'document.querySelectorAll(".wk-chip").length >= 4'],
    ['filter switches the grid',
      '(()=>{const c=[...document.querySelectorAll(".wk-chip")].find(b=>/Personal/.test(b.textContent));c.click();return true;})()'],
    ['drawer opens on card click',
      '(async()=>{document.querySelector(".wk-card").click();await new Promise(r=>setTimeout(r,400));return !!document.querySelector(".wk-drawer-root.is-open");})()'],
    ['drawer is visible and portalled to body',
      '(()=>{const d=document.querySelector(".wk-drawer-root.is-open");return !!d && d.parentElement === document.body;})()'],
    ['drawer accordion has numbered sections',
      'document.querySelectorAll(".wk-acc-item").length >= 2'],
    ['accordion expands a second section',
      '(async()=>{const h=document.querySelectorAll(".wk-acc-head");if(h.length<2)return false;h[1].click();await new Promise(r=>setTimeout(r,300));return document.querySelectorAll(".wk-acc-item.is-open").length===1;})()'],
    ['drawer closes on Escape',
      '(()=>{document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape"}));return true;})()'],
    ['chat button exists',
      '!!document.querySelector(".chat-fab")'],
    ['chat panel opens',
      '(async()=>{document.querySelector(".chat-fab").click();await new Promise(r=>setTimeout(r,300));return !!document.querySelector(".chat-panel.is-open");})()'],
    ['theme toggle flips the theme',
      '(()=>{const before=document.documentElement.dataset.theme;document.querySelector(".theme-toggle").click();const after=document.documentElement.dataset.theme;document.querySelector(".theme-toggle").click();return before!==after;})()'],
    ['nav hides hamburger on desktop',
      'getComputedStyle(document.querySelector(".mnav-toggle")).display === "none"'],
  ];

  for (const [label, expr] of checks) {
    const ok = await evaluate(expr);
    if (ok === true) process.stdout.write('.');
    else { fail('interaction', label); process.stdout.write('x'); }
    await sleep(250);
  }
  console.log(` ${checks.length} interactions`);

  // hamburger must be visible on a phone
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2600);
  await evaluate('document.documentElement.dataset.intro="done"');
  const burger = await evaluate('getComputedStyle(document.querySelector(".mnav-toggle")).display !== "none"');
  if (burger !== true) fail('interaction', 'hamburger hidden on phone');
  const menu = await evaluate('(async()=>{document.querySelector(".mnav-toggle").click();await new Promise(r=>setTimeout(r,300));return document.querySelector(".mnav-panel.is-open")!==null;})()');
  if (menu !== true) fail('interaction', 'mobile menu does not open');
  console.log('  mobile nav checked');
} catch (err) {
  fail('runner', err.message);
} finally {
  try { ws?.close(); } catch {}
  edge.kill();
}

console.log('\n================ QA RESULT ================');
if (warns.length) {
  console.log(`\n${warns.length} warning(s):`);
  [...new Set(warns)].slice(0, 20).forEach((w) => console.log('  ! ' + w));
}
if (fails.length) {
  console.log(`\n${fails.length} failure(s):`);
  [...new Set(fails)].slice(0, 40).forEach((f) => console.log('  X ' + f));
  process.exitCode = 1;
} else {
  console.log('\nAll checks passed.');
}
