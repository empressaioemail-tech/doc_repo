import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Composes ONE standalone file for the City of Bastrop to review.
   Populated screens only: no empty, sparse or template states.
   Sources are the published artboards; nothing is authored here except the
   document copy, so a change to any design re-runs this and picks it up.

     node build.mjs            # writes SmartCity-design-review-Bastrop.html
*/

const DESIGN = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const KIT = fs.readFileSync(path.join(DESIGN, 'smartcity-overview-lens', '_kit.css'), 'utf8');
const SCALE = 0.70;

/* Screens carry wording written for us, not for a city. Translated at composition
   time, never by editing a generated artboard.

   NOTE FOR THE DESIGN OWNERS: the plan-review entries below are not presentation
   preferences. `_design/plan-review/gen.mjs` puts engine vocabulary and one internal
   QA annotation on screens a customer reads. They are translated here so this document
   is safe to send, and they should be fixed at source so the next person who shows
   those screens does not have to know this file exists. */
const RELABEL = [
  [/>FIXTURE</g, '>SAMPLE DATA<'],
  [/>TENANT PRIVATE</g, '>FINANCE STAFF ONLY<'],
  // plan-review: an internal note sitting beside the Start a review button
  [/>icc-demo is the QA tenant, not a city pack</g, '><'],
  // plan-review: code citations rendered as engine identifiers
  [/atom IBC-2018\/([\d.]+)/g, 'IBC 2018 &sect;&nbsp;$1'],
  [/atom bastrop_tx-bdc-2026-adopted\/(\d+)-(\d+)-(\d+)/g, 'Bastrop 2026 code &sect;&nbsp;$1.$2.$3'],
  [/atom-chain resolved[^<]*/g, 'Traced to source &middot; full code text not reproduced'],
];

/* Nothing in this list may survive into the composed document. If one does, the
   build fails rather than shipping it: a leak that reaches a customer is the whole
   thing this document has to get right. `--sc-atom` is a colour token, not content. */
const BANNED = [
  /(^|[^-])\batom\b/i, /bodyVerbatim/i, /icc-demo/i, /QA tenant/i, /city pack/i,
  /tenant_id/i, /accessPolicy/i, /\bfixture\b/i, /Hauska/i, /tenant-private/i,
];

function screen(folder, file) {
  const raw = fs.readFileSync(path.join(DESIGN, folder, file), 'utf8');
  const afterHelmet = raw.split('</helmet>');
  if (afterHelmet.length < 2) throw new Error('no helmet in ' + folder + '/' + file);
  let body = afterHelmet[1].split('</x-dc>')[0].trim();
  if (!body.startsWith('<div')) throw new Error('unexpected artboard root in ' + folder + '/' + file);
  body = body.replace('{{themeClass}}', 'sc-light');
  if (body.includes('{{')) throw new Error('unresolved template hole in ' + folder + '/' + file);
  const h = body.match(/height:(\d+)px; display:flex; flex-direction:column; background:var\(--sc-canvas\)/);
  if (!h) throw new Error('no artboard height in ' + folder + '/' + file);
  for (const [from, to] of RELABEL) body = body.replace(from, to);
  return { body, h: Number(h[1]) };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function figure(folder, file, caption) {
  const s = screen(folder, file);
  return (
    '      <figure style="margin:0 0 var(--sc-6);">\n' +
    /* the screen is a fixed 1120px; on a narrow window it scrolls sideways in its own
       container rather than forcing the whole document to scroll */
    '        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; max-width:100%;">\n' +
    '        <div style="width:' + Math.round(1600 * SCALE) + 'px; height:' + Math.round(s.h * SCALE) + 'px; overflow:hidden; border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); box-shadow:var(--sc-e2); background:var(--sc-canvas);">\n' +
    '          <div style="width:1600px; height:' + s.h + 'px; transform:scale(' + SCALE + '); transform-origin:top left;">\n' +
    s.body + '\n' +
    '          </div>\n        </div>\n        </div>\n' +
    '        <figcaption style="margin-top:var(--sc-2); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-3);">' + esc(caption) + '</figcaption>\n' +
    '      </figure>'
  );
}

const SECTIONS = [
  {
    n: '1', id: 'overview', t: 'Overview',
    lead: 'The first screen staff see when they sign in. It answers one question: what needs attention across the city today.',
    body: [
      'Each tile along the top is a way in rather than a statistic. Selecting one opens that department already filtered to the records behind the number, so nobody has to go looking for the same list somewhere else.',
      'A department that is not yet connected to a system says so plainly instead of showing a zero, because zero and not-yet-connected are different answers and staff should never have to guess which one they are reading.',
    ],
    shots: [['smartcity-overview-lens', 'Main.dc.html', 'Overview, with several departments connected and reading.']],
  },
  {
    n: '2', id: 'development', t: 'Development services',
    lead: 'Permits, inspections, work orders, code enforcement and licences in one place, with the same table on every tab.',
    body: [
      'Staff learn one view rather than five. The counts sit in the tab strip itself, so the page does not open with a wall of numbers before any actual work appears.',
      'Free-text description fields are deliberately kept out of these lists. In the current system they often carry a resident’s name and personal phone number, and a scannable list is the wrong place for either. The structured columns are both safer and easier to scan.',
      'The work orders tab adds a workload strip showing how open work is distributed across the people it is assigned to.',
    ],
    shots: [
      ['smartcity-dev-services', 'Main.dc.html', 'Permit pipeline, the default tab.'],
      ['smartcity-dev-services', 'WorkOrders.dc.html', 'Work orders, with the workload strip open.'],
    ],
  },
  {
    n: '3', id: 'map', t: 'The map',
    lead: 'Property sits beside the work rather than on a separate page staff have to leave for.',
    body: [
      'The map lives in a rail next to whatever is open. It expands when someone needs to look properly and collapses when they do not, and the layers panel appears only at full size so the small state stays uncluttered.',
    ],
    shots: [
      ['smartcity-map-dock', 'Main.dc.html', 'Docked in the rail, alongside the record being worked.'],
      ['smartcity-map-dock', 'Full.dc.html', 'Expanded, with property detail and the layers panel.'],
    ],
  },
  {
    n: '4', id: 'planreview', t: 'Plan review',
    lead: 'The submittal queue, and the console a reviewer works a submittal in.',
    body: [
      'The queue shows what is in review, what is past deadline and what is waiting on the applicant, with the code edition each submittal is being reviewed against named on the record.',
      'Inside a review, intake, applicability, findings and the decision letter are steps in one sequence rather than separate tabs to remember. Every finding carries the code section it came from, and a finding the system is not confident about is marked uncertain rather than quietly passed.',
    ],
    shots: [
      ['plan-review', 'Main.dc.html', 'The review queue.'],
      ['plan-review', 'Review.dc.html', 'A submittal in review, on the applicability step.'],
    ],
  },
  {
    n: '5', id: 'filings', t: 'Hotel occupancy filings',
    lead: 'Filings submitted through Localgov, set against the city’s own ledger. This is the newest of the five and the least far along.',
    body: [
      'The screen opens with whether the two sources agree, not with a single revenue figure. What a filer reported owing, what was actually received, and what the fund recorded are three different numbers, and each one names the field and the system it came from. Collapsing them into one total is how a reconciliation quietly stops being a reconciliation.',
      'The exceptions view is the working list. It flags filings whose tax does not match the ordinance rate, which usually means an arithmetic error on the filing itself; filings still outstanding and how long they have been; and filings that arrived late. Each row carries the filing reference so staff can open it in Localgov and act on it.',
      'The third screen treats reported gross revenue as what it actually is, which is lodging activity in Bastrop. That is a read on the visitor economy the city has not had in one place before, and because filings land before the books close it runs slightly ahead of the fund.',
      'One thing this screen deliberately does not do is tell you who has not filed. The feed identifies each filing but not the business behind it, so there is no roster to compare a month against. Rather than leave that off the page we have drawn it as a gap, so the limitation is visible. We have asked Azavar whether a taxpayer identifier can be made available; if it can, that view becomes possible without anything else changing.',
    ],
    shots: [
      ['smartcity-finance-filings', 'Main.dc.html', 'Filings reconciled against the fund.'],
      ['smartcity-finance-filings', 'Exceptions.dc.html', 'Exceptions: rate mismatches, outstanding balances, late filings.'],
      ['smartcity-finance-filings', 'Lodging.dc.html', 'Reported lodging revenue over twelve months.'],
    ],
  },
];

const toc = SECTIONS.map((s) =>
  '        <li style="margin-bottom:var(--sc-2);"><a href="#' + s.id + '" style="font:400 15px/22px var(--sc-font-ui);">' +
  '<span style="display:inline-block; width:26px; font-family:var(--sc-font-data); color:var(--sc-ink-3);">' + s.n + '</span>' + esc(s.t) + '</a></li>').join('\n');

const sections = SECTIONS.map((s) =>
  '    <section id="' + s.id + '" style="margin-bottom:var(--sc-10);">\n' +
  '      <div style="display:flex; align-items:baseline; gap:var(--sc-3); margin-bottom:var(--sc-2);">\n' +
  '        <span style="font:400 15px/24px var(--sc-font-data); color:var(--sc-ink-3);">' + s.n + '</span>\n' +
  '        <h2 style="margin:0; font:650 28px/34px var(--sc-font-ui); letter-spacing:-.022em; color:var(--sc-ink);">' + esc(s.t) + '</h2>\n      </div>\n' +
  '      <p style="margin:0 0 var(--sc-4); max-width:74ch; font:400 17px/26px var(--sc-font-ui); color:var(--sc-ink);">' + esc(s.lead) + '</p>\n' +
  s.body.map((p) => '      <p style="margin:0 0 var(--sc-4); max-width:74ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink-2);">' + esc(p) + '</p>').join('\n') + '\n' +
  '      <div style="height:var(--sc-4);"></div>\n' +
  s.shots.map((sh) => figure(sh[0], sh[1], sh[2])).join('\n') + '\n    </section>').join('\n');

const DATE = 'September 2026';

const TITLE = 'Bastrop Design Review';

/* The document commits to one light look on purpose: the screens it shows are light by
   design, so flipping the surrounding chrome dark would misrepresent them. body still
   carries an explicit background, so it never inherits the viewer's own ground. */
const STYLE =
'<style>\n' + KIT + '\n' +
'  body { background:var(--sc-surface-2); }\n' +
'  .page { max-width:' + (Math.round(1600 * SCALE) + 96) + 'px; margin:0 auto; background:var(--sc-surface);\n' +
'          padding-block:clamp(28px, 6vw, 64px); padding-inline:clamp(16px, 4vw, 48px); }\n' +
'  .page h1 { font-size:clamp(28px, 5vw, 42px) !important; line-height:1.14 !important; }\n' +
'  @media print {\n' +
'    body { background:#fff; }\n' +
'    .page { max-width:none; padding:0; }\n' +
'    figure { break-inside:avoid; page-break-inside:avoid; }\n' +
'    section { break-before:page; page-break-before:always; }\n' +
'    section:first-of-type { break-before:auto; page-break-before:auto; }\n' +
'  }\n' +
'</style>';

const PAGE =
'  <div class="page">\n' +
/* masthead */
'    <header style="border-bottom:2px solid var(--sc-ink); padding-bottom:var(--sc-5); margin-bottom:var(--sc-7);">\n' +
'      <div style="font:500 13px/18px var(--sc-font-data); letter-spacing:.14em; text-transform:uppercase; color:var(--sc-accent); margin-bottom:var(--sc-3);">SmartCity &middot; Design review</div>\n' +
'      <h1 style="margin:0 0 var(--sc-3); font:650 42px/48px var(--sc-font-ui); letter-spacing:-.028em; color:var(--sc-ink);">Five screens, for the City of Bastrop</h1>\n' +
'      <div style="font:400 15px/22px var(--sc-font-ui); color:var(--sc-ink-2);">Prepared for review &middot; ' + DATE + '</div>\n    </header>\n' +
/* intro */
'    <section style="margin-bottom:var(--sc-8);">\n' +
'      <p style="margin:0 0 var(--sc-4); max-width:74ch; font:400 17px/27px var(--sc-font-ui); color:var(--sc-ink);">This is the working design for the next version of the SmartCity dashboards. Five areas are far enough along to show, and we would rather have your reaction now, while these are still drawings, than after they are built.</p>\n' +
'      <p style="margin:0 0 var(--sc-4); max-width:74ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink-2);">Nothing here is a finished product and none of it has replaced anything you use today. The current system keeps running exactly as it does now.</p>\n' +
'    </section>\n' +
/* the honesty box */
'    <section style="border:1px solid var(--sc-line); border-left:3px solid var(--sc-restricted); border-radius:var(--sc-r); background:var(--sc-surface-2); padding:var(--sc-5) var(--sc-6); margin-bottom:var(--sc-8);">\n' +
'      <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-restricted); margin-bottom:var(--sc-2);">Please read first</div>\n' +
'      <p style="margin:0 0 var(--sc-3); max-width:76ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink);"><strong>Every figure on every screen in this document is sample data.</strong> The names, amounts, counts and dates are there to show what the layout does when it is full. They are not Bastrop’s records and should not be read, quoted or forwarded as though they were.</p>\n' +
'      <p style="margin:0; max-width:76ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink-2);">The hotel occupancy screens in section 5 are the clearest case: that connection is not built yet and we have never read a single real filing, so those numbers are entirely illustrative.</p>\n    </section>\n' +
/* what we are asking */
'    <section style="margin-bottom:var(--sc-8);">\n' +
'      <h2 style="margin:0 0 var(--sc-3); font:650 20px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink);">What would help most</h2>\n' +
'      <p style="margin:0 0 var(--sc-3); max-width:74ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink-2);">Not the colours or the wording, which are easy to change later. The useful questions are these.</p>\n' +
'      <ol style="margin:0; padding-left:22px; max-width:74ch; font:400 15px/24px var(--sc-font-ui); color:var(--sc-ink-2);">\n' +
'        <li style="margin-bottom:var(--sc-2);">Is this the information your staff actually need in front of them, in roughly this order of importance?</li>\n' +
'        <li style="margin-bottom:var(--sc-2);">Is anything missing that someone in that department would look for first?</li>\n' +
'        <li style="margin-bottom:var(--sc-2);">Is anything on these screens that should not be visible to every member of staff who can sign in?</li>\n' +
'        <li>Which department should we work with first?</li>\n      </ol>\n    </section>\n' +
/* contents */
'    <section style="margin-bottom:var(--sc-9); border-top:1px solid var(--sc-line); padding-top:var(--sc-5);">\n' +
'      <h2 style="margin:0 0 var(--sc-3); font:650 20px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink);">Contents</h2>\n' +
'      <ol style="margin:0; padding:0; list-style:none;">\n' + toc + '\n      </ol>\n    </section>\n' +
sections + '\n' +
/* close */
'    <footer style="border-top:1px solid var(--sc-line); padding-top:var(--sc-5); margin-top:var(--sc-8); font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-3); max-width:74ch;">\n' +
'      <p style="margin:0 0 var(--sc-2);">Screens are shown at 70 percent. Sample data throughout, as set out at the top of this document.</p>\n' +
'      <p style="margin:0;">Questions and comments to Nick Smith, SmartCity.</p>\n    </footer>\n' +
'  </div>\n';

/* Two shapes, one content. The standalone file is what gets attached or printed; the
   artifact body is what gets published, and the host wraps its own doctype, head and
   body around it. */
const standalone =
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<title>' + TITLE + '</title>\n' + STYLE + '\n</head>\n<body>\n' + PAGE + '</body>\n</html>\n';

const artifactBody = '<title>' + TITLE + '</title>\n' + STYLE + '\n' + PAGE;

const scan = (standalone + artifactBody).replace(/--sc-atom[a-z-]*/g, '');
for (const rx of BANNED) {
  const hit = scan.match(new RegExp('.{0,60}' + rx.source + '.{0,60}', rx.flags.replace('g', '')));
  if (hit) throw new Error('REFUSED: internal vocabulary reached the customer document -> ' + JSON.stringify(hit[0]));
}

fs.writeFileSync(new URL('./artifact-body.html', import.meta.url), artifactBody);
fs.writeFileSync(new URL('./SmartCity-design-review-Bastrop.html', import.meta.url), standalone);
const n = SECTIONS.reduce((a, s) => a + s.shots.length, 0);
console.log('wrote SmartCity-design-review-Bastrop.html — ' + SECTIONS.length + ' sections, ' + n + ' screens, ' + Math.round(standalone.length / 1024) + ' KB');
