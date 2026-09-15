import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* The Bastrop demo: a clickable prototype, not a deck.

   Operator ruling 2026-09-15. A navigable app the city can flip through. It carries
   EVERYTHING we have; a surface with no design gets a placeholder that names what it is
   for, so the flow and depth of the platform read complete without putting a half-drawn
   screen in front of a customer.

   REBUILT after the first attempt shipped broken. That attempt treated every artboard
   as an interchangeable full-app screen. They are not: three different product shells
   are in play, and reusing whichever chrome an artboard happened to carry produced
   screens with no shell, dead nav, and placeholders built by regex-mangling a real page.

   The fix is architectural. THE SHELL IS GENERATED HERE, ONCE, and every screen is that
   shell plus one artboard's content region. Nav is wired in one place, active state is
   set by the generator, and a placeholder is the same shell as everything else.

   Surfaces with their own product chrome -- Smart Files, Plan review, the map dock --
   keep their inner nav and lose only their top bar. That is not a compromise: it is
   exactly what smartcity-dashboards does today, in its own words, "mounts the serving
   Smart Files host with its own product top bar suppressed".

     node build.mjs            build dist/index.html
     node build.mjs --shots    build, then screenshot every screen with headless Chrome

   Output is one self-contained file: no asset loading to fail in a council room, and it
   opens from a USB stick if the wifi does not work. */

const HERE = fileURLToPath(new URL('.', import.meta.url));
const DESIGN = path.resolve(HERE, '..');
const KIT = fs.readFileSync(path.join(HERE, '_kit.css'), 'utf8');

/* Operator ruling: the v1 comparison stays out of the demo.

   BLOCKS are removed by the OUTER element's own style, not by the text inside them. The
   first version of this build searched backwards from the label text and found the
   INNERMOST div -- the label -- so the marker string vanished, the guard passed, and the
   box body stayed on the page. A check that reports success while the thing it protects
   against survives is worse than no check. Only rendering the page and reading the text
   found it. */
const BANNED_BLOCKS = [
  { style: 'border:1px dashed var(--sc-crit)', what: 'the v1 comparison box' },
];

/* Whole panels that are internal: they name our repositories and our build state. */
const BANNED_PANELS = ['What is not built'];

/* Vocabulary that must not reach a customer. Checked against VISIBLE TEXT only, and
   "v1 " is matched only where a lowercase word follows, so the v1/v2/v3 version cells in
   the Smart Files table are untouched. A blind scrub would have corrupted that table. */
const BANNED_TERMS = [
  // Narrow ON PURPOSE. "v1" also means version 1 of a DOCUMENT in Smart Files, and a
  // broad match flagged "a phrase that appeared in v1 and was removed in v2" -- a true
  // sentence about versioning, not a leak. A control wider than its claim is its own
  // defect: it teaches you to reach for the bypass. These are the constructions that
  // actually refer to the previous product.
  { re: /\bv1 (?:prints|does|states|carries|shows|renders|has|is)\b/gi, what: 'a reference to the previous product' },
  { re: /what v1|the v1 /gi, what: 'a reference to the previous product' },
  { re: /the capture/gi, what: 'the operator screenshot capture' },
  { re: /shipped lens/gi, what: 'internal framing' },
  { re: /this repo|doc_repo|smartcity-dashboards/gi, what: 'a repository name' },
  { re: /artboard/gi, what: 'design-tool vocabulary' },
];

/* Rewrites, sentence by sentence, because a scrub produces mangled prose. Each one is the
   customer-facing form of a line written for an internal reader. */
const DEMO_COPY = [
  ['v1 prints both figures on adjacent screens and never compares them.', ''],
  ['A header of four confident numbers is what v1 does, and three of its four are not measurements.',
   'A header of four confident numbers would be four claims, and three of the four sources are not measured yet.'],
  ['This is the single region where v1 does the most damage, and the damage is not subtle.',
   'This is the region where an unmeasured number does the most damage.'],
  ['v1 prints 157% in green with a success mark, capture page 23.', ''],
  ['A posted-actuals feed. v1 states it does not have one: actual expenditure data is not available from BMP or Transparency sources.',
   'A posted-actuals feed. Actual expenditure data is not available from BMP or Transparency sources today.'],
  ['Read from the capture: fund rows sum to roughly $128M against a stated total budget of $69.6M.',
   'Fund rows sum to roughly $128M against a stated total budget of $69.6M.'],
  ['The appropriation column is read from the capture; the actuals, variance and burn are drawn to show the shape of a filled row and are not a reading of anything.',
   'The appropriation column is read from the adopted budget; the actuals, variance and burn are drawn to show the shape of a filled row and are not a reading of anything.'],
  ['Every row identical at 100% is the tell that nothing was measured, which is exactly what the capture shows.',
   'Every row identical at 100% is the tell that nothing was measured.'],
  ['The shipped lens carries this register already and counts 0 of 4. Bastrop reads one, so the count is 1 of 4 and the register is the thing that makes the other three countable.',
   'The register counts the sources this lens needs. Bastrop reads one of the four, and the register is what makes the other three countable.'],
  ['The shipped lens says it in one line and it is the right line:', 'The principle, in one line:'],
  ['The shipped lens already says so.', 'The register already says so.'],
  ['counted from the register the shipped lens already carries', 'counted from the register this lens carries'],
  ['the cells that were unaccounted on the first artboard are the cells that fill',
   'the cells that were unaccounted are the cells that fill'],
  ['The cost of not doing this is on the capture. ', ''],
];

/* ------------------------------------------------------------------- the IA
   The product's own information architecture, verified against smartcity-dashboards
   origin/main f776b4bf web/index.html: LENS is nine, WORK is three, CITY is three,
   DS_TABS is seven. The demo shows all of it. */

const NAV = [
  { group: 'Lenses', items: [
    { route: 'overview', label: 'Overview' },
    { route: 'development-services', label: 'Development services' },
    { route: 'finance', label: 'Finance' },
    { route: 'citizen', label: 'Citizen' },
    { route: 'public-works', label: 'Public works' },
    { route: 'parks', label: 'Parks' },
    { route: 'police', label: 'Police' },
    { route: 'fire-ems', label: 'Fire and EMS' },
    { route: 'fleet', label: 'Fleet' },
  ] },
  { group: 'Work', items: [
    { route: 'plan-review', label: 'Plan review' },
    { route: 'files', label: 'Files' },
    { route: 'records', label: 'Records search' },
  ] },
  { group: 'City', items: [
    { route: 'assets', label: 'Assets' },
    { route: 'connections', label: 'Connections' },
    { route: 'people', label: 'People and access' },
  ] },
];

/** How each artboard's content is taken. `main` keeps only <main>; `body` keeps the
 *  nav+main pair, which is how a mounted product renders inside the shell. */
const SCREENS = [
  { route: 'overview', nav: 'overview', from: 'smartcity-overview-lens', file: 'Main.dc.html', take: 'main', title: 'A morning with records' },
  { route: 'overview', nav: 'overview', from: 'smartcity-overview-lens', file: 'Sparse.dc.html', take: 'main', title: 'A newly onboarded city' },
  { route: 'overview', nav: 'overview', from: 'smartcity-overview-lens', file: 'Empty.dc.html', take: 'main', title: 'Before any source is connected' },

  { route: 'development-services', nav: 'development-services', from: 'smartcity-dev-services', file: 'Main.dc.html', take: 'main', title: 'Pipeline' },
  { route: 'ds-inspections', nav: 'development-services', from: 'smartcity-dev-services', file: 'Inspections.dc.html', take: 'main', title: 'Inspections' },
  { route: 'ds-work-orders', nav: 'development-services', from: 'smartcity-dev-services', file: 'WorkOrders.dc.html', take: 'main', title: 'Work orders' },
  { route: 'ds-code-enforcement', nav: 'development-services', from: 'smartcity-dev-services', file: 'CodeEnforcement.dc.html', take: 'main', title: 'Code enforcement' },
  { route: 'ds-licenses', nav: 'development-services', from: 'smartcity-dev-services', file: 'Licences.dc.html', take: 'main', title: 'Licenses' },
  { route: 'ds-flood-study', nav: 'development-services', from: 'smartcity-flood-study', file: 'Main.dc.html', take: 'main', title: 'Flood study' },
  { route: 'ds-flood-parcel', nav: 'development-services', from: 'smartcity-flood-study', file: 'Parcel.dc.html', take: 'main', title: 'Flood study — one parcel' },
  { route: 'ds-flood-depth', nav: 'development-services', from: 'smartcity-flood-study', file: 'Depth.dc.html', take: 'main', title: 'Flood study — the four inch question' },
  { route: 'ds-flood-running', nav: 'development-services', from: 'smartcity-flood-study', file: 'Running.dc.html', take: 'main', title: 'Flood study — while the model runs' },
  { route: 'ds-map', nav: 'development-services', from: 'smartcity-map-dock', file: 'Main.dc.html', take: 'body', title: 'The map, docked beside the work' },
  { route: 'ds-map-expand', nav: 'development-services', from: 'smartcity-map-dock', file: 'Expand.dc.html', take: 'body', title: 'The map, expanded' },
  { route: 'ds-map-full', nav: 'development-services', from: 'smartcity-map-dock', file: 'Full.dc.html', take: 'body', title: 'The map, full, with layers' },
  { route: 'ds-empty', nav: 'development-services', from: 'smartcity-dev-services', file: 'Empty.dc.html', take: 'main', title: 'Before any source is connected' },

  { route: 'finance', nav: 'finance', from: 'smartcity-finance-lens', file: 'Main.dc.html', take: 'main', title: 'The lens today' },
  { route: 'finance-departments', nav: 'finance', from: 'smartcity-finance-lens', file: 'Departments.dc.html', take: 'main', title: 'Departments' },
  { route: 'finance-permits', nav: 'finance', from: 'smartcity-finance-lens', file: 'PermitRevenue.dc.html', take: 'main', title: 'Permit fee revenue' },
  { route: 'finance-acquisition', nav: 'finance', from: 'smartcity-finance-lens', file: 'Acquisition.dc.html', take: 'main', title: 'What has to land' },
  { route: 'finance-connected', nav: 'finance', from: 'smartcity-finance-lens', file: 'Connected.dc.html', take: 'main', title: 'Once the ledger arrives' },

  { route: 'plan-review', nav: 'plan-review', from: 'plan-review-reasoner', file: 'Main.dc.html', take: 'mount', title: 'The review console' },
  { route: 'pr-reasoning', nav: 'plan-review', from: 'plan-review-reasoner', file: 'Reasoning.dc.html', take: 'mount', title: 'How one finding was reached' },
  { route: 'pr-coverage', nav: 'plan-review', from: 'plan-review-reasoner', file: 'Coverage.dc.html', take: 'mount', title: 'What we could and could not check' },
  { route: 'pr-letter', nav: 'plan-review', from: 'plan-review-reasoner', file: 'Letter.dc.html', take: 'mount', title: 'The correction notice' },
  { route: 'pr-cycle', nav: 'plan-review', from: 'plan-review-reasoner', file: 'Cycle.dc.html', take: 'mount', title: 'The second cycle' },

  { route: 'files', nav: 'files', from: 'smart-files', file: 'Main.dc.html', take: 'body', title: 'The file room' },
  { route: 'files-search', nav: 'files', from: 'smart-files', file: 'Search.dc.html', take: 'body', title: 'Search' },
  { route: 'files-document', nav: 'files', from: 'smart-files', file: 'Document.dc.html', take: 'body', title: 'One document' },
  { route: 'files-refused', nav: 'files', from: 'smart-files', file: 'Refusals.dc.html', take: 'body', title: 'When access is refused' },
];

const PLACEHOLDERS = [
  { route: 'citizen', label: 'Citizen', purpose: 'What a resident sees about an address without an account: permits nearby, meetings, service requests, and how to ask for something. The only public surface in the platform.' },
  { route: 'public-works', label: 'Public works', purpose: 'Capital projects, streets and drainage work, reporting, and the call volume behind it.' },
  { route: 'parks', label: 'Parks', purpose: 'Park and trail assets, maintenance work, and dedication funds.' },
  { route: 'police', label: 'Police', purpose: 'Patrol coverage, cameras, and the incident log.' },
  { route: 'fire-ems', label: 'Fire and EMS', purpose: 'Occupancies, dispatch, and the flood and weather picture during an incident.' },
  { route: 'fleet', label: 'Fleet', purpose: 'Vehicles, drivers, utilisation and safety across every department that runs one.' },
  { route: 'records', label: 'Records search', purpose: 'One search across every city document, with the answer citing the record it came from.' },
  { route: 'assets', label: 'Assets', purpose: 'The city inventory: what it owns, where it is, what condition it is in, and what it costs to keep.' },
  { route: 'connections', label: 'Connections', purpose: 'Which city systems are connected, what each one fills, and what is still to come.' },
  { route: 'people', label: 'People and access', purpose: 'Who has access to this city data, what they can reach, and a record of who looked at what.' },
];

/* ----------------------------------------------------------------- the shell */

const topbar = () =>
`<header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
  <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>
  <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Bastrop, TX</div>
  <div style="flex:1;"></div>
  <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:320px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>
  <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">
    <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>
    <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX</span>
  </div>
</header>`;

const DESIGNED = new Set(SCREENS.map((s) => s.nav));

function navHtml(active) {
  const row = (it) => {
    const on = it.route === active;
    const dim = !DESIGNED.has(it.route);
    return `<div data-goto="${it.route}" style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); cursor:pointer; background:${on ? 'var(--sc-accent-wash)' : 'transparent'}; box-shadow:${on ? 'inset 2px 0 0 var(--sc-accent)' : 'none'};">` +
      `<span style="flex:1; min-width:0; font:${on ? '600' : '400'} 14px/20px var(--sc-font-ui); color:var(${on ? '--sc-ink' : '--sc-ink-2'}); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${it.label}</span>` +
      (dim ? `<span style="flex:none; font:500 11px/15px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">SOON</span>` : '') +
      `</div>`;
  };
  return `<nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">` +
    NAV.map((g) =>
      `<div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">` +
      `<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">${g.group}</div>` +
      g.items.map(row).join('') + `</div>`).join('') +
    `<div style="flex:1;"></div>` +
    `<div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">City of Bastrop, TX<br>Demonstration</div>` +
    `</nav>`;
}

const shell = (active, content) =>
`<div class="sc-dark" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">
${topbar()}
  <div style="flex:1; display:flex; min-height:0;">
${navHtml(active)}
${content}
  </div>
</div>`;

/* ------------------------------------------------------------- extraction */

/** Balanced extraction of one element by tag name, starting at the first match. */
function extract(html, tag, from = 0) {
  const open = html.indexOf('<' + tag, from);
  if (open < 0) return null;
  const openTag = '<' + tag;
  const closeTag = '</' + tag + '>';
  let depth = 0;
  let i = open;
  for (;;) {
    const nextOpen = html.indexOf(openTag, i + 1);
    const nextClose = html.indexOf(closeTag, i + 1);
    if (nextClose < 0) return null;
    if (nextOpen >= 0 && nextOpen < nextClose) { depth += 1; i = nextOpen; continue; }
    if (depth === 0) return html.slice(open, nextClose + closeTag.length);
    depth -= 1; i = nextClose;
  }
}

function artboard(from, file) {
  const raw = fs.readFileSync(path.join(DESIGN, from, file), 'utf8');
  const a = raw.indexOf('</helmet>');
  const b = raw.lastIndexOf('</x-dc>');
  if (a < 0 || b < 0) throw new Error(`${from}/${file}: not an artboard`);
  return raw.slice(a + 9, b).replace(/\{\{themeClass\}\}/g, 'sc-dark');
}

/** Take the content region an artboard contributes to the demo shell. */
function contentOf(spec) {
  const html = artboard(spec.from, spec.file);
  if (spec.take === 'main') {
    const m = extract(html, 'main');
    if (!m) throw new Error(`${spec.from}/${spec.file}: no <main>`);
    return m;
  }
  if (spec.take === 'body') {
    // The nav+main pair. This renders as a mounted product inside the shell,
    // which is what the real surface does.
    const at = html.indexOf('<div style="flex:1; display:flex; min-height:0;">');
    if (at < 0) throw new Error(`${spec.from}/${spec.file}: no body region`);
    const block = extract(html, 'div', at);
    if (!block) throw new Error(`${spec.from}/${spec.file}: unbalanced body region`);
    // unwrap the outer div so its children sit directly in the shell row
    return block.replace(/^<div style="flex:1; display:flex; min-height:0;">/, '').replace(/<\/div>$/, '');
  }
  // `mount`: a product whose nav lives in its own header. Keep those tabs above the main.
  const head = extract(html, 'header');
  const tabs = head ? extract(head, 'nav') : null;
  const m = extract(html, 'main');
  if (!m) throw new Error(`${spec.from}/${spec.file}: no <main>`);
  const strip = tabs
    ? `<div style="flex:none; display:flex; align-items:center; gap:var(--sc-4); padding:var(--sc-2) var(--sc-6) 0; border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface);">${tabs}</div>`
    : '';
  return `<div style="flex:1; min-width:0; display:flex; flex-direction:column; min-height:0;">${strip}${m}</div>`;
}

function placeholderContent(p) {
  return `<main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">
  <div style="display:flex; flex-direction:column; gap:var(--sc-1);">
    <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Bastrop, TX / ${p.label}</div>
    <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">${p.label}</h1><span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-restricted); background:var(--sc-restricted-wash); border-radius:var(--sc-r-control); padding:1px 6px;">IN DESIGN</span></div>
  </div>
  <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); display:flex; align-items:center; justify-content:center;">
    <div style="display:flex; flex-direction:column; gap:var(--sc-4); max-width:62ch; padding:var(--sc-8); text-align:left;">
      <h2 style="font:650 22px/30px var(--sc-font-ui); letter-spacing:-.016em; margin:0; color:var(--sc-ink);">${p.label}</h2>
      <p style="margin:0; font:400 15px/23px var(--sc-font-ui); color:var(--sc-ink-2);">${p.purpose}</p>
      <p style="margin:0; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-3);">This surface is part of the platform and is being designed now. It is shown here so the shape of the whole system is visible rather than left out.</p>
    </div>
  </section>
</main>`;
}

/* ---------------------------------------------------------------- assembly */

function removeBlock(html, marker) {
  let out = html;
  for (;;) {
    const at = out.indexOf(marker);
    if (at < 0) return out;
    const open = out.lastIndexOf('<div', at);
    if (open < 0) return out;
    const block = extract(out, 'div', open);
    if (!block) return out;
    out = out.slice(0, open) + out.slice(open + block.length);
  }
}

/** Remove a whole panel by its heading. Internal panels name our repositories. */
function removePanel(html, title) {
  const at = html.indexOf('>' + title + '<');
  if (at < 0) return html;
  const open = html.lastIndexOf('<section', at);
  if (open < 0) return html;
  const block = extract(html, 'section', open);
  if (!block) return html;
  return html.slice(0, open) + html.slice(open + block.length);
}

/** Tab strips inside an artboard's main. Wire them to routes we know. */
const TAB_ROUTE = new Map([
  ['Pipeline', 'development-services'], ['Inspections', 'ds-inspections'],
  ['Work orders', 'ds-work-orders'], ['Code enforcement', 'ds-code-enforcement'],
  ['Licenses', 'ds-licenses'], ['Licences', 'ds-licenses'],
  ['Plan review', 'plan-review'], ['Flood study', 'ds-flood-study'],
]);

function wireTabs(html) {
  return html.replace(
    /<span style="(font:(?:620|400) 14px\/20px var\(--sc-font-ui\)[^"]*)">([^<]+)<\/span>/g,
    (whole, style, text) => {
      const r = TAB_ROUTE.get(text.trim());
      return r ? `<span data-goto="${r}" style="${style} cursor:pointer;">${text}</span>` : whole;
    },
  );
}

const built = [];
for (const s of SCREENS) {
  let content = contentOf(s);
  for (const b of BANNED_BLOCKS) content = removeBlock(content, b.style);
  for (const t of BANNED_PANELS) content = removePanel(content, t);
  for (const [from, to] of DEMO_COPY) content = content.split(from).join(to);
  content = wireTabs(content);
  built.push({ route: s.route, nav: s.nav, title: s.title, html: shell(s.nav, content) });
}
for (const p of PLACEHOLDERS) {
  built.push({ route: p.route, nav: p.route, title: p.label, html: shell(p.route, placeholderContent(p)) });
}

/* The guard reads VISIBLE TEXT. The first version checked markup and passed while the
   excluded content was still rendering on the page. Markup is not what a city reads. */
const visible = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  // A SEPARATOR, not a space: replacing tags with a space glues adjacent table
  // cells together and invents phrases that are not on the page. A version cell 'v1'
  // beside a cell reading 'superseded' became 'v1 superseded' and tripped the guard.
  .replace(/<[^>]+>/g, ' | ');

const leaks = [];
for (const sc of built) {
  const text = visible(sc.html);
  for (const b of BANNED_BLOCKS) if (sc.html.includes(b.style)) leaks.push(sc.route + ": " + b.what);
  for (const t of BANNED_TERMS) {
    const hits = text.match(t.re);
    if (hits) leaks.push(sc.route + ": " + t.what + " (" + hits.length + ") -> " + hits.slice(0, 3).join(", "));
  }
}
if (leaks.length) {
  console.error('REFUSED TO EMIT. Material that must not reach a customer survived:');
  for (const l of leaks) console.error('  ' + l);
  console.error('\nThis is an operator ruling. Fix the copy, not the ruling.');
  process.exit(1);
}
console.log('guard: clean across ' + built.length + ' screens, visible text checked');

/* Order the deck so the contents menu and the arrow keys read as the product does. */
const ORDER = ['overview', 'development-services', 'finance', 'citizen', 'public-works', 'parks', 'police', 'fire-ems', 'fleet', 'plan-review', 'files', 'records', 'assets', 'connections', 'people'];
built.sort((a, b) => {
  const d = ORDER.indexOf(a.nav) - ORDER.indexOf(b.nav);
  return d !== 0 ? d : 0;
});

const LABEL = new Map();
for (const g of NAV) for (const it of g.items) LABEL.set(it.route, it.label);

const routeIndex = {};
built.forEach((s, i) => { if (routeIndex[s.route] === undefined) routeIndex[s.route] = i; });

const groups = [];
for (let i = 0; i < built.length; i += 1) {
  const name = LABEL.get(built[i].nav) || built[i].nav;
  let g = groups.find((x) => x.name === name);
  if (!g) { g = { name, items: [] }; groups.push(g); }
  g.items.push({ i, title: built[i].title });
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SmartCity OS — City of Bastrop</title>
<style>
${KIT}
  html, body { height:100%; margin:0; overflow:hidden; background:#0C1116; }
  #stage { position:fixed; left:0; right:0; top:0; bottom:44px; overflow:hidden; }
  #frame { position:absolute; left:50%; top:50%; width:1600px; height:1040px;
           transform-origin:0 0; border-radius:10px; overflow:hidden;
           box-shadow:0 30px 90px rgba(0,0,0,.55); }
  #frame > div { position:absolute; inset:0; display:none; }
  #frame > div.on { display:flex; }
  [data-goto] { cursor:pointer; }
  [data-goto]:hover { filter:brightness(1.35); }
  #bar { position:fixed; left:0; right:0; bottom:0; height:44px; display:flex; align-items:center;
         gap:12px; padding:0 16px; background:#0C1116; border-top:1px solid #29343F; color:#8594A1;
         font:400 12px/16px "IBM Plex Mono", ui-monospace, monospace; z-index:10; }
  #bar b { color:#E6EDF3; font-weight:500; }
  #bar button { border:1px solid #29343F; background:#12191F; color:#A2B2C0; border-radius:4px;
                padding:4px 10px; font:inherit; cursor:pointer; }
  #bar button:hover { color:#E6EDF3; border-color:#4EAFC2; }
  #bar .s { margin-left:auto; color:#DDA14C; }
  #menu { position:fixed; inset:0 0 44px 0; background:rgba(12,17,22,.98); z-index:20;
          overflow:auto; padding:44px 48px; display:none; }
  #menu.on { display:block; }
  #menu h2 { font:650 22px/30px "Inter", system-ui, sans-serif; color:#E6EDF3; margin:0 0 6px; letter-spacing:-.016em; }
  #menu p.l { font:400 13px/20px "Inter", system-ui, sans-serif; color:#8594A1; margin:0 0 26px; max-width:74ch; }
  #menu .g { margin-bottom:20px; }
  #menu .g h3 { font:500 11px/16px "IBM Plex Mono", monospace; letter-spacing:.12em;
                text-transform:uppercase; color:#8594A1; margin:0 0 8px; }
  #menu a { display:inline-block; margin:0 8px 8px 0; padding:6px 12px; border:1px solid #29343F;
            border-radius:5px; color:#A2B2C0; font:400 13px/18px "Inter", system-ui, sans-serif; cursor:pointer; }
  #menu a:hover { color:#E6EDF3; border-color:#4EAFC2; }
</style>
</head>
<body>
<div id="stage"><div id="frame">
${built.map((s, i) => `<div data-screen="${i}" data-route="${s.route}">${s.html}</div>`).join('\n')}
</div></div>

<div id="bar">
  <button id="prev">&larr;</button><button id="next">&rarr;</button>
  <span><b id="where">—</b> <span id="sub"></span></span>
  <button id="contents">Contents</button>
  <span class="s">Sample data throughout. No figure on these screens is a reading of a live city system.</span>
</div>

<div id="menu">
  <h2>SmartCity OS — City of Bastrop</h2>
  <p class="l">Every surface in the platform. Move through it by clicking the sidebar and the tabs, the way staff would, or jump straight to a screen below. Surfaces marked <b>In design</b> are part of the system and are being drawn now.</p>
  ${groups.map((g) => `<div class="g"><h3>${g.name}</h3>${g.items.map((it) => `<a data-jump="${it.i}">${it.title}</a>`).join('')}</div>`).join('\n  ')}
</div>

<script>
(function () {
  var META = ${JSON.stringify(built.map((s) => ({ route: s.route, nav: s.nav, title: s.title })))};
  var LABEL = ${JSON.stringify(Object.fromEntries(LABEL))};
  var ROUTES = ${JSON.stringify(routeIndex)};
  var frame = document.getElementById('frame'), stage = document.getElementById('stage');
  var menu = document.getElementById('menu'), at = -1;

  function fit() {
    var k = Math.min(stage.clientWidth / 1640, stage.clientHeight / 1080);
    frame.style.transform = 'translate(-50%,-50%) scale(' + k + ')';
  }
  window.addEventListener('resize', fit);

  function show(i) {
    if (i < 0 || i >= META.length || i === at) return;
    at = i;
    var n = frame.children;
    for (var j = 0; j < n.length; j++) n[j].classList.toggle('on', j === i);
    document.getElementById('where').textContent = LABEL[META[i].nav] || META[i].nav;
    var t = META[i].title, lab = LABEL[META[i].nav];
    document.getElementById('sub').textContent = (t && t !== lab) ? '· ' + t : '';
    try { history.replaceState(null, '', '#' + META[i].route); } catch (e) {}
    fit();
  }
  function goRoute(r) { if (ROUTES[r] !== undefined) show(ROUTES[r]); }

  frame.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-goto]') : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    goRoute(t.getAttribute('data-goto'));
  });
  document.getElementById('next').onclick = function () { show(at + 1); };
  document.getElementById('prev').onclick = function () { show(at - 1); };
  document.getElementById('contents').onclick = function () { menu.classList.toggle('on'); };
  menu.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-jump]') : null;
    if (!a) { if (e.target === menu) menu.classList.remove('on'); return; }
    menu.classList.remove('on');
    show(parseInt(a.getAttribute('data-jump'), 10));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(at + 1);
    else if (e.key === 'ArrowLeft') show(at - 1);
    else if (e.key === 'Escape') menu.classList.remove('on');
    else if (e.key === 'c') menu.classList.toggle('on');
  });

  var want = location.hash.slice(1), start = 0;
  if (want && ROUTES[want] !== undefined) start = ROUTES[want];
  fit(); show(start);
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.join(HERE, 'dist'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'dist', 'index.html'), page, 'utf8');
console.log(`wrote dist/index.html — ${built.length} screens, ${SCREENS.length} from artboards, ${PLACEHOLDERS.length} in design`);
console.log(`routes: ${Object.keys(routeIndex).length} · size ${(fs.statSync(path.join(HERE, 'dist', 'index.html')).size / 1048576).toFixed(2)} MB`);
