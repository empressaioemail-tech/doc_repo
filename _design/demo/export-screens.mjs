import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/* Export every designed surface as a PNG, in both themes.

     node export-screens.mjs

   Writes _design/exports/dark/ and _design/exports/light/. Each artboard is converted to
   standalone HTML and rendered at its native 1600x1040 by headless Chrome at 2x, so the
   image is the design as drawn rather than a demo shell.

   PLACEHOLDER NOTES. Some screens show a map, a drainage model or a plan sheet. Those are
   DRAWINGS made for the design, not renders from the system, and a screenshot cannot say
   so on its own. Every screen carrying one gets a strip across the bottom that says which
   kind it is. The list is derived from the artboards themselves, not from memory:

     map    overview lens, map dock, place tab
     flood  flood study, whose map AND model are both drawn
     sheet  plan review, whose site plan and sheet views are drawn

   Files are numbered in reading order so they sort correctly and drop into a document
   already in sequence. */

const HERE = fileURLToPath(new URL('.', import.meta.url));
const DESIGN = path.resolve(HERE, '..');
const OUT = path.join(DESIGN, 'exports');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const KIT = fs.readFileSync(path.join(HERE, '_kit.css'), 'utf8');

const NOTE = {
  map: 'Placeholder illustration — the map shown here is a drawing made for this design, not a render from the system.',
  flood: 'Placeholder illustration — the map and the drainage model shown here are drawings made for this design, not output from the system.',
  sheet: 'Placeholder illustration — the plan sheet shown here is a drawing made for this design, not a real submitted drawing.',
};

/* Ordered the way a reader should meet them. `cleared` is whether the set may go in front
   of the city. The third item on each screen is its placeholder note, or null. */
const SETS = [
  { folder: 'smartcity-overview-lens', name: 'Overview', cleared: true, screens: [
    ['Main.dc.html', 'a morning with records', 'map'],
    ['Sparse.dc.html', 'a newly onboarded city', 'map'],
    ['Empty.dc.html', 'before any source connects', 'map'] ] },

  { folder: 'smartcity-dev-services', name: 'Development services', cleared: true, screens: [
    ['Main.dc.html', 'pipeline', null], ['Inspections.dc.html', 'inspections', null],
    ['WorkOrders.dc.html', 'work orders', null], ['CodeEnforcement.dc.html', 'code enforcement', null],
    ['Licences.dc.html', 'licenses', null], ['Empty.dc.html', 'before any source connects', null] ] },

  { folder: 'smartcity-map-dock', name: 'Map', cleared: true, screens: [
    ['Main.dc.html', 'docked beside the work', 'map'],
    ['Expand.dc.html', 'expanded', 'map'],
    ['Full.dc.html', 'full with layers', 'map'] ] },

  { folder: 'smartcity-flood-study', name: 'Flood study', cleared: true, screens: [
    ['Main.dc.html', 'screening list', 'flood'], ['Parcel.dc.html', 'one parcel', 'flood'],
    ['Depth.dc.html', 'the four inch question', 'flood'], ['Running.dc.html', 'while the model runs', 'flood'],
    ['Empty.dc.html', 'when it cannot answer', 'flood'] ] },

  { folder: 'plan-review-reasoner', name: 'Plan review', cleared: true, screens: [
    ['Main.dc.html', 'review console', 'sheet'], ['Reasoning.dc.html', 'how a finding was reached', 'sheet'],
    ['Coverage.dc.html', 'what was and was not checked', null], ['Letter.dc.html', 'the correction notice', 'sheet'],
    ['Cycle.dc.html', 'the second cycle', 'sheet'] ] },

  { folder: 'plan-review-departments', name: 'Plan review, departments', cleared: true, screens: [
    ['Main.dc.html', 'routing by scope', null], ['Department.dc.html', 'one department', null],
    ['Board.dc.html', 'where work is sitting', null], ['Conflict.dc.html', 'two departments disagree', null],
    ['Letter.dc.html', 'one consolidated notice', 'sheet'] ] },

  { folder: 'plan-review', name: 'Plan review, earlier pass', cleared: false, screens: [
    ['Main.dc.html', 'queue', 'sheet'], ['Review.dc.html', 'review console', 'sheet'],
    ['Embedded.dc.html', 'embedded in dashboards', 'sheet'] ] },

  { folder: 'smart-files', name: 'Files', cleared: true, screens: [
    ['Main.dc.html', 'the file room', null], ['Search.dc.html', 'search', null],
    ['Document.dc.html', 'one document', null], ['Refusals.dc.html', 'when access is refused', null],
    ['Gaps.dc.html', 'internal, not for the city', null] ] },

  { folder: 'smartcity-finance-lens', name: 'Finance', cleared: true, screens: [
    ['Main.dc.html', 'the lens today', null], ['Departments.dc.html', 'departments', null],
    ['PermitRevenue.dc.html', 'permit fee revenue', null], ['Acquisition.dc.html', 'what has to land', null],
    ['Connected.dc.html', 'once the ledger arrives', null] ] },

  { folder: 'smartcity-finance-filings', name: 'Finance, tax filings', cleared: false, screens: [
    ['Main.dc.html', 'reconciled', null], ['Exceptions.dc.html', 'exceptions', null],
    ['Lodging.dc.html', 'lodging economy', null], ['Unlabelled.dc.html', 'tax type unconfirmed', null],
    ['Empty.dc.html', 'no grant', null] ] },

  { folder: 'smartcity-place-tab', name: 'Place tab, superseded', cleared: false, screens: [
    ['Main.dc.html', 'parcel dossier', 'map'], ['OtherCity.dc.html', 'another city', 'map'],
    ['Unselected.dc.html', 'nothing selected', 'map'] ] },
];

const THEMES = [
  { id: 'dark', cls: 'sc-dark', page: '#0C1116', strip: { bg: '#3A2A12', fg: '#DDA14C', line: '#8A6524' } },
  { id: 'light', cls: 'sc-light', page: '#EEF1F4', strip: { bg: '#FBEEDA', fg: '#7A4A08', line: '#C89A50' } },
];

/* Clear ONLY the image folders. An earlier version wiped the whole exports directory and
   destroyed the customer-facing prose written alongside the images, which is authored
   content rather than build output. A build step may delete what it made and nothing else. */
for (const t of ['dark', 'light']) fs.rmSync(path.join(OUT, t), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function html(file, theme, note) {
  const raw = fs.readFileSync(file, 'utf8');
  const a = raw.indexOf('</helmet>');
  const b = raw.lastIndexOf('</x-dc>');
  const body = raw.slice(a + 9, b).replace(/\{\{themeClass\}\}/g, theme.cls).trim();
  const strip = note
    ? `<div style="position:fixed; left:0; right:0; bottom:0; height:38px; display:flex; align-items:center;
         gap:10px; padding:0 20px; background:${theme.strip.bg}; border-top:1px solid ${theme.strip.line};
         color:${theme.strip.fg}; font:500 13px/18px 'IBM Plex Mono', ui-monospace, monospace; z-index:99;">
         <span style="flex:none; border:1px solid ${theme.strip.line}; border-radius:3px; padding:1px 6px;
           font-size:11px; letter-spacing:.08em;">PLACEHOLDER</span>
         <span>${NOTE[note]}</span></div>`
    : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${KIT}
  html,body{margin:0;padding:0;background:${theme.page};width:1600px;height:1040px;overflow:hidden;}</style>
  </head><body>${body}${strip}</body></html>`;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const manifest = [];

for (const theme of THEMES) {
  const dir = path.join(OUT, theme.id);
  const tmp = path.join(dir, '_html');
  fs.mkdirSync(tmp, { recursive: true });
  let n = 0;
  for (const set of SETS) {
    for (const [file, label, note] of set.screens) {
      const src = path.join(DESIGN, set.folder, file);
      if (!fs.existsSync(src)) { console.log('skip (missing): ' + set.folder + '/' + file); continue; }
      n += 1;
      const stem = String(n).padStart(2, '0') + '-' + slug(set.name) + '--' + slug(label);
      const hp = path.join(tmp, stem + '.html');
      fs.writeFileSync(hp, html(src, theme, note), 'utf8');
      const png = path.join(dir, stem + '.png');
      execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=2', '--virtual-time-budget=3000', '--window-size=1600,1040',
        '--screenshot=' + png, 'file:///' + hp.replace(/\\/g, '/')], { stdio: 'ignore' });
      if (theme.id === 'dark') {
        manifest.push({ n, file: stem + '.png', surface: set.name, screen: label, note, cleared: set.cleared });
      }
      if (!fs.existsSync(png)) console.error('FAILED ' + theme.id + '/' + stem);
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(theme.id + ': ' + n + ' images');
}

const cleared = manifest.filter((m) => m.cleared);
const held = manifest.filter((m) => !m.cleared);
const noted = manifest.filter((m) => m.note);

fs.writeFileSync(path.join(OUT, 'README.md'),
`# Design screens, exported ${new Date().toISOString().slice(0, 10)}

Two complete sets, same ${manifest.length} screens, same filenames:

    dark/    ${manifest.length} images
    light/   ${manifest.length} images

3200 x 2080 each (rendered at 2x for print). Numbered in reading order, so they sort
correctly in a folder and drop into a document already in sequence.

Regenerate with \`node _design/demo/export-screens.mjs\`.

## Placeholder notes — ${noted.length} of ${manifest.length} screens

A screenshot cannot tell a reader that a picture is a drawing. Every screen showing a map,
a drainage model or a plan sheet carries a strip across the bottom saying so, in both
themes. Those pictures were drawn for the design; none is a render from the system.

${['map', 'flood', 'sheet'].map((k) => {
  const rows = noted.filter((m) => m.note === k);
  return `- **${k}** (${rows.length}) — ${[...new Set(rows.map((m) => m.surface))].join(', ')}`;
}).join('\n')}

Everything else on every screen is sample data too. The difference is that a table of
sample rows reads as sample; a picture of a map does not.

## Cleared to show the city — ${cleared.length} screens

${[...new Set(cleared.map((m) => m.surface))].map((s) => `- **${s}** — ${cleared.filter((m) => m.surface === s).map((m) => m.screen).join(', ')}`).join('\n')}

## NOT cleared — ${held.length} screens, each for a stated reason

- **Files, "internal, not for the city"** — names our repositories and our build state.
- **Finance, tax filings** — under an AMEND ruling. It prints an ordinance rate attributed
  to Bastrop's own code that traces to no source, and scores three of their filings against
  it. It may not enter a customer document until that is sourced or removed.
- **Plan review, earlier pass** — superseded by the reasoner set. Three plan review designs
  exist and only one should be shown; showing all three reads as indecision.
- **Place tab** — superseded by the map dock. Kept only as a record of the option not taken.
`, 'utf8');

console.log(`\n${manifest.length} screens x 2 themes -> ${OUT}`);
console.log(`${noted.length} carry a placeholder note · ${cleared.length} cleared, ${held.length} held back`);
