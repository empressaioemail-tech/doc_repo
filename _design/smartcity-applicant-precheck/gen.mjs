import fs from 'node:fs';

/* SmartCity applicant precheck -- the first public function for applicants.

   Operator direction 2026-09-17:
     - SmartCity is the product. This is a SmartCity public surface drawn in the
       SmartCity kit, next to the flood study and plan review, NOT a Smart Site
       screen. How Smart Site, Smart Files, SmartCity plan review and Development
       services blend is an open discussion; this is an initial design.
     - Branding is SmartCity plus the city's logo.
     - The AI reads the plan set. There is no form for the applicant to type
       dimensions into.
     - It is a PRE-SUBMITTAL SELF-CHECK. Quick check, then download or email the
       findings, revise, and the applicant may still submit with suggestions
       left open.

   What is read from source, via source-state.json (dump-source-state.mjs):
     plan-review 9149595f  every citation string on these boards is produced by
                           the product's renderCitationText(); BASTROP-UDC holds
                           exactly 14-02-003 and 14-02-008; IRC has no edition
                           declared, so an IRC rule carries no citation.
     dashboards  f776b4bf  the Citizen lens is public-free with no SKU name; the
                           city pack carries no branding, rule set or project types.
     ldt         dca5ec2e  the finding engine reads sheets with AI and reports
                           problems only; its eval harness has no ground truth.

   FIXTURE throughout. The lot, the requirements, the readings, the dates and the
   precheck code are invented for the design, and continue the 908 PINE ST story
   the plan-review-reasoner boards already tell (22'-0" against a 25'-0" front
   minimum). No person is named anywhere. */

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const SRC = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

const CITES = Object.fromEntries(SRC.planReview.citations.map((c) => [c.sectionNumber, c.text]));
function citeText(section) {
  const t = CITES[section];
  if (!t) throw new Error('section ' + section + ' is not in the BASTROP-UDC manifest at plan-review ' + SRC.planReview.sha.slice(0, 8));
  return t;
}
const ABSENCE = new Set(SRC.planReview.absenceKinds);
function absence(kind) {
  if (!ABSENCE.has(kind)) throw new Error('absence kind ' + kind + ' is not in the product vocabulary');
  return kind;
}

/* ------------------------------------------------------------------ fixture */

const CITY = { name: 'City of Bastrop', short: 'Bastrop, TX' };
const LOT = { address: '908 PINE ST', parcel: '48021:34137', district: 'SF-1', lotSf: '7,200 SF', lotDims: "80' × 90'", zone: 'X' };
const CODE = 'PC-7K2F-9QD4';
const PROJECT = 'New single-family home';
const SHEETS = [
  ['A-101', 'Site plan'], ['A-102', 'Floor plan'], ['A-201', 'Elevations'],
  ['S-101', 'Foundation'], ['C-101', 'Grading'], ['E-101', 'Electrical'],
];
const SHEET_IDS = SHEETS.map((s) => s[0]).join(',');
const V1 = { n: 1, when: '8 Sep 2026, 14:12' };
const V2 = { n: 2, when: '9 Sep 2026, 10:42' };

/* One numbering, used on every board, the findings document and the review. */
const CHECKS = [
  { num: 1, id: 'front', name: 'Front setback', kind: 'auto', req: "25'-0\" minimum", section: '14-02-003', sheet: 'A-101',
    v1: { read: "22'-0\"", out: 'suggest' }, v2: { read: "22'-0\"", out: 'suggest' } },
  { num: 2, id: 'side-w', name: 'Side setback, west', kind: 'auto', req: "5'-0\" minimum", section: '14-02-003', sheet: 'A-101',
    v1: { read: "6'-0\"", out: 'clear' }, v2: { read: "5'-6\"", out: 'clear' } },
  { num: 3, id: 'side-e', name: 'Side setback, east', kind: 'auto', req: "5'-0\" minimum", section: '14-02-003', sheet: 'A-101',
    v1: { read: "14'-0\"", out: 'clear' }, v2: { read: "14'-6\"", out: 'clear' } },
  { num: 4, id: 'rear', name: 'Rear setback', kind: 'auto', req: "20'-0\" minimum", section: '14-02-003', sheet: 'A-101',
    v1: { read: "20'-0\"", out: 'clear', note: 'meets the minimum exactly' }, v2: { read: "20'-0\"", out: 'clear', note: 'meets the minimum exactly' } },
  { num: 5, id: 'height', name: 'Building height', kind: 'auto', req: "35'-0\" maximum", section: '14-02-003', sheet: 'A-201',
    v1: { read: null, out: 'unread' }, v2: { read: "24'-6\"", out: 'clear' } },
  { num: 6, id: 'coverage', name: 'Lot coverage', kind: 'auto', req: '45% maximum', section: '14-02-003', sheet: 'A-101',
    v1: { read: '2,880 SF footprint', out: 'clear', note: '40.0% of the 7,200 SF lot on the city record' },
    v2: { read: '2,880 SF footprint', out: 'clear', note: '40.0% of the 7,200 SF lot on the city record' } },
  { num: 7, id: 'use', name: 'Permitted use', kind: 'city', section: '14-02-008',
    reason: 'Use is not a measurement, so nothing here can check it automatically. The city reviews it.' },
  { num: 8, id: 'walls', name: 'Exterior walls', kind: 'city', section: null, sectionLabel: 'R302.1',
    reason: 'The city has not set its residential code edition in this check, so no citation can be built and the rule does not run.' },
  { num: 9, id: 'driveway', name: 'Driveway width', kind: 'city', section: null,
    reason: 'Not part of this check yet. The city reviews it.' },
];
const AUTO = CHECKS.filter((c) => c.kind === 'auto');
const CITY_CHECKS = CHECKS.filter((c) => c.kind === 'city');

function groupOf(c, v) {
  if (c.kind === 'city') return 'city';
  const out = c[v].out;
  return out === 'clear' ? 'clear' : 'suggest';
}
function counts(v) {
  const k = { suggest: 0, city: 0, clear: 0 };
  for (const c of CHECKS) k[groupOf(c, v)] += 1;
  if (k.suggest + k.city + k.clear !== CHECKS.length) throw new Error('groups do not tie for ' + v);
  return k;
}
const C1 = counts('v1');
const C2 = counts('v2');

/* ------------------------------------------------------------------ atoms */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TAGSTYLE = 'flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;';
const tag = (t, c, w) => `<span data-tag="${t}" style="${TAGSTYLE} justify-self:start; align-self:center; color:var(${c}); background:var(${w});">${t}</span>`;
const T = {
  suggest: () => tag('SUGGESTION', '--sc-warn', '--sc-warn-wash'),
  unread: () => tag('COULD NOT READ', '--sc-info', '--sc-info-wash'),
  clear: () => tag('NO ISSUE FOUND', '--sc-ok', '--sc-ok-wash'),
  city: () => tag('CITY REVIEWS', '--sc-ink-3', '--sc-quiet-wash'),
  record: () => tag('CITY RECORD', '--sc-atom', '--sc-atom-wash'),
  fema: () => tag('FEMA MAP', '--sc-atom', '--sc-atom-wash'),
  unconfirmed: () => tag('NOT CONFIRMED', '--sc-warn', '--sc-warn-wash'),
  owed: () => tag('NOT SET', '--sc-warn', '--sc-warn-wash'),
  isNew: () => tag('NEW', '--sc-accent', '--sc-accent-wash'),
  partial: () => tag('PARTIAL', '--sc-warn', '--sc-warn-wash'),
  exists: () => tag('EXISTS', '--sc-ok', '--sc-ok-wash'),
};
const aiTag = (sheet) => `<span data-provenance="ai-reading" data-sheet="${sheet}" style="${TAGSTYLE} justify-self:start; align-self:center; color:var(--sc-restricted); background:var(--sc-restricted-wash);">AI READING &middot; ${sheet}</span>`;
const FIXTURE = '<span data-fixture="1" style="' + TAGSTYLE + ' color:var(--sc-restricted); border:1px solid var(--sc-restricted); padding:0 6px;">FIXTURE</span>';
const cite = (section) => `<span data-cite="${section}" style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-2);">${esc(citeText(section))}</span>`;
const neg = (s) => '<!--neg-->' + s + '<!--/neg-->';
const note = (html, w = 'auto') =>
  '<!--note--><div data-note="design" style="width:' + w + '; box-sizing:border-box; border:1px dashed var(--sc-line-strong); border-radius:var(--sc-r); padding:var(--sc-2) var(--sc-3); background:var(--sc-surface-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">' +
  '<span style="font-weight:600; letter-spacing:.08em; color:var(--sc-ink-2);">DESIGN NOTE</span> &middot; ' + html + '</div><!--/note-->';
const kicker = (t) => `<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3);">${t}</div>`;
const pin = (n, color) => `<span style="flex:none; width:22px; height:22px; border-radius:50%; background:var(${color}); color:#fff; display:inline-grid; place-items:center; font:600 12px/1 var(--sc-font-ui);">${n}</span>`;
const PIN_COLOR = { suggest: '--sc-warn', unread: '--sc-info', clear: '--sc-ok', city: '--sc-quiet' };
const btnOff = (t) => `<span aria-disabled="true" style="display:inline-flex; align-items:center; height:34px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); border:1px dashed var(--sc-line-strong); color:var(--sc-ink-3); font:500 14px/20px var(--sc-font-ui); white-space:nowrap;">${t}</span>`;
const btn = (t, primary = false, attrs = '') => primary
  ? `<span ${attrs} style="display:inline-flex; align-items:center; height:34px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); font:600 14px/20px var(--sc-font-ui); white-space:nowrap;">${t}</span>`
  : `<span ${attrs} style="display:inline-flex; align-items:center; height:34px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); border:1px solid var(--sc-line-strong); background:var(--sc-surface); color:var(--sc-ink); font:500 14px/20px var(--sc-font-ui); white-space:nowrap;">${t}</span>`;
const panel = (head, body, extra = '') =>
  `<section style="background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); box-shadow:var(--sc-e1); ${extra}">` +
  (head ? `<div style="display:flex; align-items:center; gap:var(--sc-2); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">${head}</div>` : '') +
  body + '</section>';
const ptitle = (t, sub = '') => `<span style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">${t}</span>` + (sub ? `<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${sub}</span>` : '');
const HATCH = 'background-image:repeating-linear-gradient(135deg, var(--sc-line-faint) 0 1px, transparent 1px 7px);';

/* ------------------------------------------------------------------ chrome */

/* Every root is `class="{{themeClass}}" style="width:..; height:.."`, the shape the
   combined canvas (all-canvas/build.mjs) and the export script read frame sizes from.
   A public or design board is ALWAYS light, like the shipped Citizen lens: it sets
   .sc-light on an inner wrapper, which re-declares the light tokens under a dark root. */
function frame({ w, h, theme, audience, sheets = '', body }) {
  const light = theme === 'sc-light';
  const open = light
    ? '<div class="sc-light" style="flex:1; min-height:0; display:flex; flex-direction:column; background:var(--sc-canvas); color:var(--sc-ink);">\n'
    : '';
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
    `<div class="{{themeClass}}" style="width:${w}px; height:${h}px; display:flex; flex-direction:column; background:var(--sc-canvas); color:var(--sc-ink); overflow:hidden;" data-audience="${audience}" data-sheets="${sheets}">\n` +
    open + body + (light ? '\n</div>' : '') + '\n</div>\n</x-dc>\n</body>\n</html>\n';
}

const STEPS = ['Your lot', 'Your project', 'Your plans', 'Findings', 'Submit'];
function publicTop(active) {
  const steps = STEPS.map((s, i) => {
    const n = i + 1;
    const done = n < active;
    const on = n === active;
    const dot = done
      ? '<span style="width:20px; height:20px; border-radius:50%; background:var(--sc-accent); color:var(--sc-on-accent); display:grid; place-items:center; font:600 12px/1 var(--sc-font-ui);">&#10003;</span>'
      : `<span style="width:20px; height:20px; border-radius:50%; border:1px solid ${on ? 'var(--sc-accent)' : 'var(--sc-line-strong)'}; color:${on ? 'var(--sc-accent)' : 'var(--sc-ink-3)'}; display:grid; place-items:center; font:600 12px/1 var(--sc-font-ui); box-sizing:border-box;">${n}</span>`;
    return `<span style="display:flex; align-items:center; gap:var(--sc-2); font:${on ? 600 : 400} 14px/20px var(--sc-font-ui); color:${on ? 'var(--sc-ink)' : 'var(--sc-ink-2)'};">${dot}${s}</span>` +
      (n < STEPS.length ? '<span style="flex:none; width:32px; height:1px; background:var(--sc-line-strong);"></span>' : '');
  }).join('');
  return `<header style="height:60px; flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-6); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
    <div title="City logo, supplied by the city" style="width:36px; height:36px; border-radius:50%; border:1.5px dashed var(--sc-line-strong); display:grid; place-items:center; font:500 12px/1 var(--sc-font-data); color:var(--sc-ink-3);">logo</div>
    <div style="display:flex; flex-direction:column;"><span style="font:650 16px/20px var(--sc-font-ui); color:var(--sc-ink);">${CITY.name}</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Plan precheck</span></div>
    ${FIXTURE}
    <div style="flex:1;"></div>
    <span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-3);">No account needed</span>
    <span style="width:1px; height:24px; background:var(--sc-line);"></span>
    <span style="font:650 15px/20px var(--sc-font-ui); letter-spacing:-.01em; color:var(--sc-ink);">SmartCity</span>
  </header>
  <div style="height:48px; flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-6); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">${steps}</div>`;
}

const LENSES = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'EMPTY'], ['Citizen', 'PREVIEW'],
  ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'], ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];
const WORK = [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']];
const CITYNAV = [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'NOT BUILT']];
const BADGE = { 'LIVE RECORDS': ['--sc-ok', '--sc-ok-wash'], EMPTY: ['--sc-ink-3', '--sc-quiet-wash'], PREVIEW: ['--sc-restricted', '--sc-restricted-wash'], 'NOT READ': ['--sc-ink-3', '--sc-quiet-wash'], 'NOT BUILT': ['--sc-ink-3', '--sc-quiet-wash'] };
function navItem([label, badge], on) {
  const b = badge ? tag(badge, BADGE[badge][0], BADGE[badge][1]) : '';
  return `<div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:${on ? 'var(--sc-accent-wash)' : 'transparent'}; box-shadow:${on ? 'inset 2px 0 0 var(--sc-accent)' : 'none'};"><span style="flex:1; min-width:0; font:${on ? 600 : 400} 14px/20px var(--sc-font-ui); color:${on ? 'var(--sc-ink)' : 'var(--sc-ink-2)'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${label}</span>${b}</div>`;
}
function staffShell(activeWork, crumb, main) {
  const sec = (t, items, act) => `<div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">${kicker(t).replace('<div style="', '<div style="padding:var(--sc-2) var(--sc-3) var(--sc-1); ')}${items.map((it) => navItem(it, it[0] === act)).join('')}</div>`;
  return `<header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">BT</div>
      <div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">${CITY.short}</div>
      ${FIXTURE}
      <div style="flex:1;"></div>
      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>
      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Development services reviewer</span>
    </header>
    <div style="flex:1; display:flex; min-height:0;">
      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3);">
        ${sec('Lenses', LENSES, null)}${sec('Work', WORK, activeWork)}${sec('City', CITYNAV, null)}
      </nav>
      <main style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4); padding:var(--sc-5) var(--sc-6); overflow:hidden;">
        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${crumb}</div>
        ${main}
      </main>
    </div>`;
}

/* ------------------------------------------------------------------ the sheet */

/* One scale, 4.8 px per foot (1" = 20' at 96 dpi), the same as the reasoner's
   site plan. The lot is 80' x 90' and the house 60' x 48', so the four gaps
   always sum to the lot: west + 60 + east = 80 and front + 48 + rear = 90. */
function sitePlan(v, S = 4.8, x0 = 80) {
  const pins = true;
  const ft = (s) => { const m = String(s).match(/^(\d+)'-(\d+)"/); return Number(m[1]) + Number(m[2]) / 12; };
  const get = (id) => ft(CHECKS.find((c) => c.id === id)[v].read);
  const west = get('side-w'); const east = get('side-e'); const front = get('front'); const rear = get('rear');
  if (Math.abs(west + 60 + east - 80) > 0.01 || Math.abs(front + 48 + rear - 90) > 0.01) throw new Error('site plan does not close for ' + v);
  const y0 = 40; const LW = 80 * S; const LH = 90 * S;
  const hx = x0 + west * S; const hy = y0 + rear * S; const HW = 60 * S; const HH = 48 * S;
  const cx = hx + HW / 2;
  const P = (n, x, y, grp) => pins ? `<circle cx="${x}" cy="${y}" r="11" fill="var(${PIN_COLOR[grp]})"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#fff">${n}</text>` : '';
  const g = (id) => groupOf(CHECKS.find((c) => c.id === id), v);
  const lab = (x, y, t, sub, color = 'var(--sc-ink)') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="${color}">${esc(t)}</text><text x="${x}" y="${y + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--sc-ink-3)">${sub}</text>`;
  const frontRead = CHECKS.find((c) => c.id === 'front')[v].read;
  return `<svg width="${x0 * 2 + LW}" height="${y0 + LH + 70}" viewBox="0 0 ${x0 * 2 + LW} ${y0 + LH + 70}" style="display:block;">
    <rect x="${x0}" y="${y0}" width="${LW}" height="${LH}" fill="none" stroke="var(--sc-ink)" stroke-width="2"/>
    <rect x="${hx}" y="${hy}" width="${HW}" height="${HH}" fill="var(--sc-accent-wash)" stroke="var(--sc-accent)" stroke-width="2"/>
    <text x="${cx}" y="${hy + HH / 2 - 4}" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="var(--sc-accent)">PROPOSED RESIDENCE</text>
    <text x="${cx}" y="${hy + HH / 2 + 14}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--sc-ink-2)">60' &#215; 48' &#183; 2,880 SF</text>
    <line x1="${cx}" y1="${hy + HH}" x2="${cx}" y2="${y0 + LH}" stroke="var(--sc-warn)" stroke-dasharray="4 3"/>
    <line x1="${cx}" y1="${y0}" x2="${cx}" y2="${hy}" stroke="var(--sc-ink-3)" stroke-dasharray="4 3"/>
    <line x1="${x0}" y1="${hy + HH / 2 + 50}" x2="${hx}" y2="${hy + HH / 2 + 50}" stroke="var(--sc-ink-3)" stroke-dasharray="4 3"/>
    <line x1="${hx + HW}" y1="${hy + HH / 2 + 50}" x2="${x0 + LW}" y2="${hy + HH / 2 + 50}" stroke="var(--sc-ink-3)" stroke-dasharray="4 3"/>
    ${lab(cx + 60, hy + HH + (front * S) / 2 - 2, frontRead, 'FRONT', 'var(--sc-warn)')}
    ${lab(cx + 60, y0 + (rear * S) / 2 - 2, CHECKS.find((c) => c.id === 'rear')[v].read, 'REAR')}
    ${lab(x0 - 42, hy + HH / 2 + 46, CHECKS.find((c) => c.id === 'side-w')[v].read, 'SIDE W')}
    ${lab(x0 + LW + 42, hy + HH / 2 + 46, CHECKS.find((c) => c.id === 'side-e')[v].read, 'SIDE E')}
    ${P(1, cx, hy + HH + (front * S) / 2, g('front'))}
    ${P(4, cx, y0 + (rear * S) / 2, g('rear'))}
    ${P(2, (x0 + hx) / 2, hy + HH / 2 + 50, g('side-w'))}
    ${P(3, (hx + HW + x0 + LW) / 2, hy + HH / 2 + 50, g('side-e'))}
    ${P(6, hx + 22, hy + 22, g('coverage'))}
    <rect x="${x0 - 20}" y="${y0 + LH + 18}" width="${LW + 40}" height="40" fill="var(--sc-surface-3)"/>
    <text x="${x0 + LW / 2}" y="${y0 + LH + 43}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" letter-spacing="3" fill="var(--sc-ink-2)">PINE STREET</text>
  </svg>`;
}

function sheetViewer(v, h, S = 4.8, x0 = 80, narrow = false) {
  const tabs = SHEETS.map(([id], i) => `<span style="white-space:nowrap; font:${i === 0 ? 600 : 400} 13px/18px var(--sc-font-data); color:${i === 0 ? 'var(--sc-ink)' : 'var(--sc-ink-3)'}; padding-bottom:4px; border-bottom:2px solid ${i === 0 ? 'var(--sc-accent)' : 'transparent'};">${id}</span>`).join('');
  return panel(
    `<div style="display:flex; gap:var(--sc-4); align-items:flex-end;">${tabs}</div><span style="flex:1;"></span><span style="white-space:nowrap; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${narrow ? 'v' + (v === 'v1' ? 1 : 2) : '6 sheets &middot; version ' + (v === 'v1' ? 1 : 2) + ' &middot; your drawing'}</span>`,
    `<div style="height:${h}px; display:grid; place-items:center; background:var(--sc-surface-2);">${sitePlan(v, S, x0)}</div>
     <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint);">
       <span style="font:600 14px/20px var(--sc-font-data);">A-101</span><span style="white-space:nowrap; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Site plan &middot; ${LOT.address}${narrow ? '' : ' &middot; 1&quot; = 20&#39; &middot; lot ' + LOT.lotDims}</span>
       <span style="flex:1;"></span>${narrow ? '' : '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">pins are the numbered checks</span>'}
     </div>`,
    'display:flex; flex-direction:column; overflow:hidden;',
  );
}

/* ------------------------------------------------------------------ rows */

function findingRow(c, v) {
  const grp = groupOf(c, v);
  const r = c[v];
  const pc = r.out === 'unread' ? '--sc-info' : PIN_COLOR[grp];
  const stateTag = r.out === 'unread' ? T.unread() : T[grp]();
  let lead;
  if (r.out === 'suggest') lead = `Your site plan shows ${r.read} where this lot requires ${c.req}. Move the house back, or plan to ask the city about it.`;
  else if (r.out === 'unread') lead = `We could not find an overall building height on ${c.sheet}, your elevation sheet. Add the dimension and run the check again.`;
  else lead = `Read ${r.read} against ${c.req}${r.note ? ', ' + r.note : ''}.`;
  const prov = r.read ? aiTag(c.sheet) : `<span data-absence="${absence('unchecked')}" style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">nothing read on ${c.sheet}</span>`;
  return `<div data-check="${c.id}" data-num="${c.num}" data-group="${grp}" style="display:flex; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint);${r.out === 'suggest' ? ' background:var(--sc-warn-wash);' : ''}">
    ${pin(c.num, pc)}
    <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:4px;">
      <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;"><span style="font:600 14px/20px var(--sc-font-ui);">${c.name}</span>${stateTag}${prov}</div>
      <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">${lead}</div>
      <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">${T.record()}<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">${c.req}</span>${cite(c.section)}</div>
      <div style="display:flex; gap:var(--sc-4); font:500 13px/18px var(--sc-font-ui); color:var(--sc-accent);"><span>Show on sheet</span><span>This reading looks wrong</span></div>
    </div>
  </div>`;
}

function cityRow(c) {
  const citation = c.section
    ? cite(c.section)
    : `<span data-absence="${absence('unchecked')}" style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">No citation${c.sectionLabel ? ' (' + c.sectionLabel + ', edition not set)' : ''}</span>`;
  return `<div data-check="${c.id}" data-num="${c.num}" data-group="city" style="display:flex; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint); ${HATCH}">
    ${pin(c.num, '--sc-quiet')}
    <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">
      <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:600 14px/20px var(--sc-font-ui);">${c.name}</span>${T.city()}</div>
      <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">${c.reason}</div>
      <div>${citation}</div>
    </div>
  </div>`;
}

function clearRow(c, v) {
  const r = c[v];
  return `<div data-check="${c.id}" data-num="${c.num}" data-group="clear" style="display:grid; grid-template-columns:26px 1.2fr 1.1fr 0.9fr auto; align-items:center; gap:2px var(--sc-2); padding:7px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 13px/18px var(--sc-font-ui);">
    ${pin(c.num, '--sc-ok')}<span style="font-weight:600;">${c.name}</span><span style="font-family:var(--sc-font-data); color:var(--sc-ink-2); white-space:nowrap;">${r.read}</span><span style="font-family:var(--sc-font-data); color:var(--sc-ink-3);">${c.req}</span>${aiTag(c.sheet)}
    ${r.note ? '<span style="grid-column:2 / -1; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + r.note + '</span>' : ''}
  </div>`;
}

const groupHead = (grp, title, n, sub) =>
  `<div style="display:flex; align-items:baseline; gap:var(--sc-2); padding:var(--sc-3) var(--sc-4) var(--sc-2); background:var(--sc-surface);"><span style="font:620 14px/20px var(--sc-font-ui);">${title}</span><span data-count-group="${grp}" data-count="${n}" style="font:600 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">${n}</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${sub}</span></div>`;

const TITLES = {
  suggest: ['Suggested before you submit', 'you can fix these, or submit anyway'],
  city: ['The city reviews these', 'not checked here, each with its reason'],
  clear: ['No issue found', 'checked against the rule named'],
};

function tiles(k, total) {
  const t = (grp, label, n, sub, color) => `<div data-count-group="${grp}" data-count="${n}" style="flex:1; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); padding:var(--sc-3) var(--sc-4);">${kicker(label)}<div style="font:500 28px/36px var(--sc-font-ui); color:var(${color});">${n}</div><div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">${sub}</div></div>`;
  return `<div data-checklist-total="${total}" style="display:flex; gap:var(--sc-3);">
    ${t('suggest', 'Suggested before you submit', k.suggest, 'yours to fix, or to leave open', '--sc-warn')}
    ${t('city', 'The city reviews', k.city, 'not checked here', '--sc-ink-2')}
    ${t('clear', 'No issue found', k.clear, 'against the rule named', '--sc-ok')}
    <div style="flex:1; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); padding:var(--sc-3) var(--sc-4);">${kicker('Checks listed for this project')}<div style="font:500 28px/36px var(--sc-font-ui);">${total}</div><div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">${k.suggest} + ${k.city} + ${k.clear} = ${total}</div></div>
  </div>`;
}

const AI_BANNER = `<div style="display:flex; gap:var(--sc-3); align-items:flex-start; padding:var(--sc-3) var(--sc-4); border:1px solid var(--sc-restricted); border-radius:var(--sc-r-lg); background:var(--sc-restricted-wash);">
  <span style="${TAGSTYLE} color:var(--sc-restricted); background:var(--sc-surface);">AI READING</span>
  <span style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink);">Every number below was read from your drawings by software and has not been checked by a person. Compare each one with your sheet. ${neg('This is a self-check before you apply. It is not a plan review, a permit or an approval.')}</span>
</div>`;

/* ================================================================== BOARD 0: Flow */

function flowBox(title, state, evidence, w = 250) {
  return `<div style="width:${w}px; box-sizing:border-box; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); padding:var(--sc-3); display:flex; flex-direction:column; gap:6px; box-shadow:var(--sc-e1);">
    <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="flex:1; font:620 14px/19px var(--sc-font-ui);">${title}</span>${T[state]()}</div>
    <div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">${evidence}</div>
  </div>`;
}
const arrow = '<span style="flex:none; align-self:center; color:var(--sc-ink-3); font:400 18px/1 var(--sc-font-ui);">&rarr;</span>';
const lane = (label, sub, boxes, tint) => `<div style="display:flex; gap:var(--sc-4); align-items:stretch; padding:var(--sc-4); border-radius:var(--sc-r-lg); background:${tint}; border:1px solid var(--sc-line);">
  <div style="width:150px; flex:none; display:flex; flex-direction:column; gap:4px;">${kicker(label)}<div style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);">${sub}</div></div>
  <div style="flex:1; display:flex; gap:var(--sc-2); flex-wrap:wrap; align-items:stretch;">${boxes}</div>
</div>`;

const flow = frame({
  w: 1600, h: 940, theme: 'sc-light', audience: 'design', body: `
  <header style="flex:none; padding:var(--sc-6) var(--sc-7) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
    <div style="display:flex; align-items:center; gap:var(--sc-3);"><span style="font:650 24px/30px var(--sc-font-ui);">Plan precheck: the flow</span>${FIXTURE}</div>
    <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:1180px;">A pre-submittal self-check on a SmartCity public page, branded with the city's logo. The applicant finds the lot, picks a project, uploads plans, reads findings, revises, and may submit with suggestions still open. The city sets the rules, opens a precheck by its code, and records its decision against the lot. Each box states whether it exists today, read from source at the SHAs in source-state.json.</div>
  </header>
  <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4); padding:var(--sc-5) var(--sc-7);">
    ${lane('Applicant', 'SmartCity public page. City logo. No account.', [
      flowBox('1 Find the lot', 'partial', 'Citizen lens lookup ships disabled (dashboards f776b4bf web/index.html). Staff property-intel read exists for Bastrop.', 200),
      arrow,
      flowBox('2 Pick project, see what is checked', 'isNew', 'City pack carries no project types or rule set (city-pack.mjs fields).', 200),
      arrow,
      flowBox('3 Upload plans', 'partial', 'plan-review stores uploads in Smart Files, tagged applicant-upload. No applicant identity there.', 200),
      arrow,
      flowBox('4 Findings', 'partial', 'AI sheet read exists (ldt finding-engine), problems only, no measured accuracy.', 200),
      arrow,
      flowBox('5 Revise, compare', 'isNew', 'No version comparison anywhere.', 170),
      arrow,
      flowBox('6 Download, email, submit anyway', 'isNew', 'Share links expire; nothing verifies a document.', 190),
    ].join(''), 'var(--sc-accent-wash)')}
    ${lane('Shared', 'One parcel record, one rule set, one check.', [
      flowBox('Parcel record', 'partial', 'Setbacks, height and coverage served for 48021 per OPS-21 (2026-09-11); re-probe before build. plan-review still reads the older atom chain, not the one reader.', 330),
      flowBox('City rule set', 'partial', 'BASTROP-UDC holds two sections (plan-review code-lookup.mjs). No effective date. G-140: the city publishes a layer described as replacing B3.', 330),
      flowBox('Check engine', 'partial', 'One adjudicator, front setback only (plan-review adjudication.mjs). AI reading lives in a different repo (ldt).', 300),
      flowBox('Precheck record and verify', 'isNew', 'Versions, code, fingerprint, current or replaced.', 240),
    ].join(''), 'var(--sc-surface-2)')}
    ${lane('City', 'SmartCity staff. Development services.', [
      flowBox('Precheck settings', 'isNew', 'Branding, rules in force, project types, access, submission text.', 250),
      arrow,
      flowBox('Open by code', 'isNew', 'Scan or type the code; staff login for this city.', 230),
      arrow,
      flowBox('Review with the precheck', 'partial', 'Override with reason exists (plan-review server.mjs). Reasoner design RATIFIED.', 270),
      arrow,
      flowBox('Decision on the lot', 'partial', 'Engagement stage exists. No decision atom type in atom-contract 1.36.0. ldt outcome ledger is per city and attaches to findings.', 330),
    ].join(''), 'var(--sc-accent-wash)')}
    <div style="display:flex; gap:var(--sc-4);">
      ${panel(ptitle('Open, and not settled here', 'operator 2026-09-17: discuss before build'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:6px; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">
        <div><b>Where the public page lives.</b> A SmartCity public surface, per this design. Its address, and how it relates to Smart Site, is not ruled.</div>
        <div><b>Which service runs the check.</b> The adjudicator is in plan-review and the AI reading is in legacy-design-tools. The precheck needs both.</div>
        <div><b>Where plan sets are stored.</b> Smart Files is plan-review's store, and has no identity for an applicant who has not submitted.</div>
        <div><b>Who pays, and which checks ship first.</b> Access is drawn as a city setting with no value chosen.</div>
        <div><b>How far the decision travels.</b> A city's decision is that city's data. Showing it publicly is the city's choice.</div>
      </div>`, 'flex:1.3;')}
      ${panel(ptitle('What the boards hold to'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:6px; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">
        <div>The checklist is shown before upload, so every result has a denominator: ${CHECKS.length} checks, ${AUTO.length} read from plans against the lot, ${CITY_CHECKS.length} left to the city.</div>
        <div>Results are sorted by who acts next. The applicant never sees Pass or Fail.</div>
        <div>Every reading says it came from software and names its sheet.</div>
        <div>A rule with no edition carries no citation. Only the two Bastrop sections in source are cited.</div>
        <div>Suggestions never block. Submitting with one open is a normal path, and the city sees it.</div>
      </div>`, 'flex:1;')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 1: Start */

const lotFact = (k, v, src) => `<div style="display:grid; grid-template-columns:170px 1fr auto; gap:var(--sc-2); align-items:center; padding:6px 0; border-top:1px solid var(--sc-line-faint); font:400 13px/18px var(--sc-font-ui);"><span style="color:var(--sc-ink-2);">${k}</span><span style="font-family:var(--sc-font-data);">${v}</span>${src}</div>`;

const start = frame({
  w: 1600, h: 930, theme: 'sc-light', audience: 'applicant', body: `
  ${publicTop(2)}
  <div style="flex:1; display:flex; gap:var(--sc-5); padding:var(--sc-5) var(--sc-6); min-height:0;">
    <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">
      <div>
        <div style="font:650 26px/32px var(--sc-font-ui);">Check your plans before you submit</div>
        <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:760px;">A quick self-check against the ${CITY.name}'s rules and the facts of your lot. Upload your plan set, read what we found, fix what you want, and apply when you are ready. ${neg('It is not a plan review or an approval.')}</div>
      </div>
      ${panel(ptitle('Your lot', LOT.parcel), `<div style="padding:var(--sc-3) var(--sc-4);">
        <div style="display:flex; align-items:center; height:36px; padding:0 var(--sc-3); border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); font:500 14px/20px var(--sc-font-ui);">${LOT.address}, ${CITY.short}</div>
        <div style="margin-top:var(--sc-2);">
          ${lotFact('Zoning district', LOT.district, T.record())}
          ${lotFact('Lot area', LOT.lotSf, T.record())}
          ${lotFact('FEMA flood zone', LOT.zone, T.fema())}
          ${lotFact('Front / side / rear setback', "25'-0\" / 5'-0\" / 20'-0\" minimum", T.record())}
          ${lotFact('Height, lot coverage', "35'-0\" / 45% maximum", T.record())}
        </div>
        <div style="margin-top:var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Requirements from the city record for this lot, under ${esc(citeText('14-02-003'))}.</div>
      </div>`)}
      ${panel(ptitle('Your project'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; gap:var(--sc-2);">
        <div style="flex:1; border:2px solid var(--sc-accent); border-radius:var(--sc-r); padding:var(--sc-3); background:var(--sc-accent-wash);"><div style="font:600 14px/20px var(--sc-font-ui);">${PROJECT}</div><div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">${CHECKS.length} checks</div></div>
        <div style="flex:1; border:1px solid var(--sc-line); border-radius:var(--sc-r); padding:var(--sc-3); color:var(--sc-ink-3);"><div style="font:500 14px/20px var(--sc-font-ui);">Accessory structure</div><div style="font:400 12px/16px var(--sc-font-data);">not offered by the city yet</div></div>
        <div style="flex:1; border:1px solid var(--sc-line); border-radius:var(--sc-r); padding:var(--sc-3); color:var(--sc-ink-3);"><div style="font:500 14px/20px var(--sc-font-ui);">New commercial building</div><div style="font:400 12px/16px var(--sc-font-data);">not offered by the city yet</div></div>
      </div>`)}
      ${panel(ptitle('Your plans'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; gap:var(--sc-4); align-items:stretch;">
        <div style="flex:1.4; border:1.5px dashed var(--sc-line-strong); border-radius:var(--sc-r); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:var(--sc-4); background:var(--sc-surface-2);">
          <span style="font:600 14px/20px var(--sc-font-ui);">Drop your plan set here</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">one PDF, every sheet</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-2);">
          <span style="font:500 13px/18px var(--sc-font-ui);">Email for your findings <span style="color:var(--sc-ink-3); font-weight:400;">(optional)</span></span>
          <div style="height:34px; border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); display:flex; align-items:center; padding:0 var(--sc-3); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">name@example.com</div>
          <span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">The email carries a link back to this precheck, so you can upload a revised set later.</span>
          <div style="margin-top:auto;">${btn('Run the check', true)}</div>
        </div>
      </div>`)}
    </div>
    <div style="width:470px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${panel(ptitle('What this check covers', PROJECT), `<div style="padding:var(--sc-2) 0;">
        <div style="padding:var(--sc-1) var(--sc-4) var(--sc-2); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);"><b data-checklist-total="${CHECKS.length}">${CHECKS.length} checks.</b> ${AUTO.length} are read from your plans against this lot. ${CITY_CHECKS.length} are left to the city, and the findings will say so.</div>
        <div style="padding:var(--sc-2) var(--sc-4) 4px;">${kicker('Read from your plans &middot; ' + AUTO.length)}</div>
        ${AUTO.map((c) => `<div data-preview="${c.id}" style="display:flex; align-items:center; gap:var(--sc-2); padding:5px var(--sc-4); font:400 13px/18px var(--sc-font-ui);">${pin(c.num, '--sc-accent')}<span style="flex:1;">${c.name}</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">sheet ${c.sheet}</span></div>`).join('')}
        <div style="padding:var(--sc-3) var(--sc-4) 4px;">${kicker('The city reviews &middot; ' + CITY_CHECKS.length)}</div>
        ${CITY_CHECKS.map((c) => `<div data-preview="${c.id}" style="display:flex; align-items:center; gap:var(--sc-2); padding:5px var(--sc-4); font:400 13px/18px var(--sc-font-ui); ${HATCH}">${pin(c.num, '--sc-quiet')}<span style="flex:1;">${c.name}</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">not checked here</span></div>`).join('')}
        <div style="padding:var(--sc-3) var(--sc-4) 0; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3);">Rules as set by the city: ${esc(SRC.planReview.bastropUdc.title)} (${SRC.planReview.bastropUdc.editionId}). Anything not listed here is not checked.</div>
      </div>`)}
      ${note('G-140 is open: the city publishes a newer zoning layer it describes as replacing the B3 code. Until the city confirms which code is in force, this panel must not present B3 as current. The city setup board carries the question.')}
      ${note('The lookup here answers. The shipped Citizen lens lookup is disabled with a stated basis, and that treatment stays for any city with no parcel source.')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 2: Reading */

const READ_STATE = [
  ['A-101', 'Site plan', 'read', 'four setbacks, footprint 60\' × 48\''],
  ['A-102', 'Floor plan', 'read', 'nothing this check uses'],
  ['A-201', 'Elevations', 'reading', 'looking for an overall height'],
  ['S-101', 'Foundation', 'queued', 'not used by this check'],
  ['C-101', 'Grading', 'queued', 'not used by this check'],
  ['E-101', 'Electrical', 'queued', 'not used by this check'],
];
const reading = frame({
  w: 1600, h: 820, theme: 'sc-light', audience: 'applicant', sheets: SHEET_IDS, body: `
  ${publicTop(3)}
  <div style="flex:1; display:flex; gap:var(--sc-5); padding:var(--sc-5) var(--sc-6); min-height:0;">
    <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4);">
      <div><div style="font:650 26px/32px var(--sc-font-ui);">Reading your plans</div>
      <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">${LOT.address} &middot; ${PROJECT} &middot; version 1 &middot; ${CODE}</div></div>
      ${panel(ptitle('Sheets', '6 in the set &middot; 2 read &middot; 1 reading &middot; 3 queued'), `<div style="padding:var(--sc-2) var(--sc-4); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); background:var(--sc-restricted-wash);">Sheets are read by software. Nothing found here has been checked by a person.</div>` + READ_STATE.map(([id, label, st, found]) => {
        const s = st === 'read' ? tag('READ', '--sc-ok', '--sc-ok-wash') : st === 'reading' ? tag('READING', '--sc-info', '--sc-info-wash') : tag('QUEUED', '--sc-ink-3', '--sc-quiet-wash');
        return `<div style="display:grid; grid-template-columns:80px 160px 110px 1fr; align-items:center; gap:var(--sc-3); padding:10px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 14px/20px var(--sc-font-ui);"><span style="font:600 14px/20px var(--sc-font-data);">${id}</span><span>${label}</span>${s}<span style="color:var(--sc-ink-2);">${found}</span></div>`;
      }).join(''))}
      ${panel(ptitle('Checks', AUTO.length + ' read from your plans'), AUTO.map((c) => {
        const ready = c.sheet === 'A-101';
        return `<div style="display:flex; align-items:center; gap:var(--sc-3); padding:8px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 14px/20px var(--sc-font-ui);">${pin(c.num, ready ? '--sc-accent' : '--sc-quiet')}<span style="flex:1;">${c.name}</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">${ready ? 'reading found on A-101' : 'waiting on ' + c.sheet}</span></div>`;
      }).join(''))}
    </div>
    <div style="width:470px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${panel(ptitle('You can leave this page'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">
        <div>The check keeps running. Your findings will be at this link, and we will email them if you give us an address.</div>
        <div style="height:34px; border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); display:flex; align-items:center; padding:0 var(--sc-3); color:var(--sc-ink-3);">name@example.com</div>
        <div>${btn('Email me when it is done')}</div>
      </div>`)}
      ${panel(ptitle('If a sheet cannot be read'), `<div style="padding:var(--sc-3) var(--sc-4); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A sheet we could not read is listed as unread with the reason, and the checks that needed it say so. It is never counted as a check with no issue.</div>`)}
      ${note('Running is a real state, as in the flood study: the run is named by its code, survives navigation, and a sheet that fails to read stays retryable rather than being written down as clear.')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 3: Findings v1 */

function findingsList(v) {
  const k = v === 'v1' ? C1 : C2;
  const sug = CHECKS.filter((c) => groupOf(c, v) === 'suggest');
  const clr = CHECKS.filter((c) => groupOf(c, v) === 'clear');
  return groupHead('suggest', TITLES.suggest[0], k.suggest, TITLES.suggest[1]) + sug.map((c) => findingRow(c, v)).join('') +
    groupHead('city', TITLES.city[0], k.city, TITLES.city[1]) + CITY_CHECKS.map(cityRow).join('') +
    groupHead('clear', TITLES.clear[0], k.clear, TITLES.clear[1]) + clr.map((c) => clearRow(c, v)).join('');
}

const findings = frame({
  w: 1600, h: 1350, theme: 'sc-light', audience: 'applicant', sheets: SHEET_IDS, body: `
  ${publicTop(4)}
  <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4); padding:var(--sc-5) var(--sc-6); min-height:0;">
    <div style="display:flex; align-items:flex-end; gap:var(--sc-4);">
      <div style="flex:1;"><div style="font:650 26px/32px var(--sc-font-ui);">Findings for ${LOT.address}</div>
      <div style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">version ${V1.n} &middot; ${V1.when} &middot; ${PROJECT} &middot; ${CODE}</div></div>
      ${btn('Download findings')}${btn('Email findings')}${btn('Upload a revised set')}${btn('Continue to submit', true)}
    </div>
    ${tiles(C1, CHECKS.length)}
    ${AI_BANNER}
    <div style="flex:1; display:flex; gap:var(--sc-4); min-height:0;">
      <div style="flex:1; min-width:0; display:flex; flex-direction:column;">${sheetViewer('v1', 640)}</div>
      <div style="width:640px; flex:none;">${panel('', findingsList('v1'), 'overflow:hidden;')}</div>
    </div>
  </div>`,
});

/* ================================================================== BOARD 4: Revised */

function changeOf(c) {
  if (c.kind === 'city') return 'same';
  const a = c.v1; const b = c.v2;
  if (a.out !== 'clear' && b.out === 'clear') return 'resolved';
  if (a.out !== 'clear' && b.out !== 'clear') return 'open';
  if (a.read !== b.read) return 'changed';
  return 'same';
}
const CHANGE = {
  resolved: ['Resolved', '--sc-ok', '--sc-ok-wash'],
  open: ['Still open', '--sc-warn', '--sc-warn-wash'],
  changed: ['Reading changed, no issue', '--sc-info', '--sc-info-wash'],
  same: ['Unchanged', '--sc-ink-3', '--sc-quiet-wash'],
};
const chg = {}; for (const c of CHECKS) { const x = changeOf(c); chg[x] = (chg[x] || 0) + 1; }
const chgTotal = Object.values(chg).reduce((a, b) => a + b, 0);
if (chgTotal !== CHECKS.length) throw new Error('change classes do not tie');
const cell = (c, v) => {
  if (c.kind === 'city') return '<span style="color:var(--sc-ink-3);">city reviews</span>';
  const r = c[v];
  const g = r.out === 'unread' ? T.unread() : T[groupOf(c, v)]();
  return `<span style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font-family:var(--sc-font-data);">${r.read || 'not found'}</span>${g}</span>`;
};

const revised = frame({
  w: 1600, h: 920, theme: 'sc-light', audience: 'applicant', sheets: SHEET_IDS, body: `
  ${publicTop(4)}
  <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4); padding:var(--sc-5) var(--sc-6);">
    <div style="display:flex; align-items:flex-end; gap:var(--sc-4);">
      <div style="flex:1;"><div style="font:650 26px/32px var(--sc-font-ui);">Version 2, compared with version 1</div>
      <div style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">${LOT.address} &middot; version 1 ${V1.when} &middot; version 2 ${V2.when} &middot; ${CODE} &middot; changed sheets A-101, A-201</div></div>
      ${btn('Download findings')}${btn('Upload a revised set')}${btn('Continue to submit', true)}
    </div>
    <div data-change-total="${chgTotal}" style="display:flex; gap:var(--sc-3);">
      ${['resolved', 'open', 'changed', 'same'].map((k) => `<div data-count-change="${k}" data-count="${chg[k] || 0}" style="flex:1; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); padding:var(--sc-3) var(--sc-4);">${kicker(CHANGE[k][0])}<div style="font:500 28px/36px var(--sc-font-ui); color:var(${CHANGE[k][1]});">${chg[k] || 0}</div></div>`).join('')}
      <div style="flex:1; background:var(--sc-surface); border:1px solid var(--sc-line); border-radius:var(--sc-r-lg); padding:var(--sc-3) var(--sc-4);">${kicker('Checks')}<div style="font:500 28px/36px var(--sc-font-ui);">${chgTotal}</div><div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">${chg.resolved || 0} + ${chg.open || 0} + ${chg.changed || 0} + ${chg.same || 0} = ${chgTotal}</div></div>
    </div>
    ${AI_BANNER}
    ${panel('', `<div style="display:grid; grid-template-columns:40px 220px 1fr 1fr 230px; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); background:var(--sc-surface-2); font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; color:var(--sc-ink-3);"><span>#</span><span>CHECK</span><span>VERSION 1</span><span>VERSION 2</span><span>WHAT CHANGED</span></div>` +
      CHECKS.map((c) => {
        const x = changeOf(c);
        const extra = x === 'open' ? '<div style="grid-column:2 / -1; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Still open. Revise again, or submit with this open; the city will see it.</div>' : '';
        return `<div data-check="${c.id}" data-change="${x}" style="display:grid; grid-template-columns:40px 220px 1fr 1fr 230px; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 14px/20px var(--sc-font-ui);${x === 'open' ? ' background:var(--sc-warn-wash);' : ''}${c.kind === 'city' ? ' ' + HATCH : ''}">
          ${pin(c.num, c.kind === 'city' ? '--sc-quiet' : '--sc-accent')}<span style="font-weight:600;">${c.name}</span>${cell(c, 'v1')}${cell(c, 'v2')}${tag(CHANGE[x][0].toUpperCase(), CHANGE[x][1], CHANGE[x][2])}${extra}
        </div>`;
      }).join(''))}
    ${note('Compared check by check, not sheet by sheet: an applicant cares that the height is now found, not that A-201 changed. A reading that moved but stays clear is shown, because a silent change to a number is how a later surprise starts.')}
  </div>`,
});

/* ================================================================== BOARD 5: Submit */

const openNow = CHECKS.filter((c) => c.kind === 'auto' && c.v2.out !== 'clear');
const submit = frame({
  w: 1600, h: 660, theme: 'sc-light', audience: 'applicant', body: `
  ${publicTop(5)}
  <div style="flex:1; display:flex; gap:var(--sc-5); padding:var(--sc-5) var(--sc-6);">
    <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4);">
      <div><div style="font:650 26px/32px var(--sc-font-ui);">Apply to the ${CITY.name}</div>
      <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">${LOT.address} &middot; ${PROJECT} &middot; version ${V2.n} &middot; ${CODE}</div></div>
      ${panel(ptitle('Where your precheck stands'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">
        <div data-open-count="${openNow.length}" style="display:flex; align-items:center; gap:var(--sc-2); font:600 15px/22px var(--sc-font-ui);">${T.suggest()} ${openNow.length} suggestion still open</div>
        ${openNow.map((c) => `<div style="display:flex; align-items:center; gap:var(--sc-2); padding-left:var(--sc-2); font:400 14px/20px var(--sc-font-ui);">${pin(c.num, '--sc-warn')}${c.name}: ${c.v2.read} against ${c.req}</div>`).join('')}
        <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">${C2.city} checks are left to the city and ${C2.clear} found no issue. You can revise again, or apply now with the suggestion open.</div>
        <div style="display:flex; flex-direction:column; gap:4px; margin-top:var(--sc-2);">
          <span style="font:500 13px/18px var(--sc-font-ui);">Note for the reviewer <span style="color:var(--sc-ink-3); font-weight:400;">(optional)</span></span>
          <div style="height:64px; border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); padding:var(--sc-2) var(--sc-3); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui); box-sizing:border-box;">For example, that you are asking the city about the front setback.</div>
        </div>
        <label style="display:flex; gap:var(--sc-2); align-items:flex-start; font:400 13px/19px var(--sc-font-ui);"><span style="flex:none; width:16px; height:16px; margin-top:2px; border-radius:3px; background:var(--sc-accent); color:#fff; display:grid; place-items:center; font-size:12px;">&#10003;</span><span>Include my precheck with my application. With your code, city staff can open these findings and the drawings you checked, including the suggestion you left open.</span></label>
        <div style="display:flex; gap:var(--sc-2); margin-top:var(--sc-2);">${btn('Go back and revise')}${btn('Apply with 1 suggestion open', true, 'data-action="submit-anyway"')}</div>
      </div>`)}
      ${note('Suggestions never block. Leaving one open is a normal path, not an error: a variance request looks exactly like this. What changes is that the city sees it.')}
    </div>
    <div style="width:520px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${panel(ptitle('How the city takes applications', 'written by the city'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3); font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink);">
        <div>Apply through the city's permit portal. Attach your precheck findings, or give the reviewer your precheck code.</div>
        <div style="display:flex; align-items:center; gap:var(--sc-3); padding:var(--sc-3); border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface-2);">
          <div style="width:64px; height:64px; flex:none; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:400 12px/1 var(--sc-font-data); color:var(--sc-ink-3); ${HATCH}">QR</div>
          <div><div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">YOUR PRECHECK CODE</div><div style="font:600 20px/28px var(--sc-font-data); letter-spacing:.04em;">${CODE}</div></div>
        </div>
        <div style="display:flex; gap:var(--sc-2);">${btn('Download findings')}${btn('Copy code')}${btn('Open the permit portal')}</div>
      </div>`)}
      ${note('Blending question, not ruled: for a city that runs SmartCity plan review, this step could become "Submit to plan review" and the precheck would travel with the application. Drawn here as the v1 path with no integration.')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 6: Summary (download / email) */

const docRow = (c) => `<div data-check="${c.id}" data-group="suggest" style="display:grid; grid-template-columns:28px 1fr; gap:var(--sc-2); padding:var(--sc-3) 0; border-top:1px solid var(--sc-line-faint);">
  <span style="font:600 14px/20px var(--sc-font-ui);">${c.num}.</span>
  <div style="display:flex; flex-direction:column; gap:3px;"><span style="font:600 15px/22px var(--sc-font-ui);">${c.name}</span>
  <span style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">Your site plan shows ${c.v2.read}; this lot requires ${c.req}.</span>
  <span style="display:flex; gap:var(--sc-3); flex-wrap:wrap; align-items:center;">${cite(c.section)}<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">sheet ${c.sheet}</span>${aiTag(c.sheet)}</span></div>
</div>`;

const summary = frame({
  w: 1600, h: 1130, theme: 'sc-light', audience: 'applicant', sheets: SHEET_IDS, body: `
  <div style="flex:1; display:flex; gap:var(--sc-5); padding:var(--sc-6); background:var(--sc-surface-3);">
    <div style="width:880px; flex:none; background:var(--sc-surface); box-shadow:var(--sc-e2); padding:48px 56px; box-sizing:border-box; display:flex; flex-direction:column; gap:var(--sc-4);">
      <div style="display:flex; align-items:center; gap:var(--sc-3); padding-bottom:var(--sc-3); border-bottom:2px solid var(--sc-ink);">
        <div style="width:44px; height:44px; border-radius:50%; border:1.5px dashed var(--sc-line-strong); display:grid; place-items:center; font:500 12px/1 var(--sc-font-data); color:var(--sc-ink-3);">logo</div>
        <div style="flex:1;"><div style="font:650 22px/28px var(--sc-font-ui);">Plan precheck findings</div><div style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">${CITY.name}</div></div>
        ${FIXTURE}<span style="font:650 15px/20px var(--sc-font-ui);">SmartCity</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:var(--sc-2) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-2);">
        <span>${CODE}</span><span>version ${V2.n}, ${V2.when}</span><span>${PROJECT}</span>
        <span>${LOT.address}</span><span>parcel ${LOT.parcel}</span><span>${SRC.planReview.bastropUdc.editionId}</span>
      </div>
      <div style="font:400 15px/23px var(--sc-font-ui);">You ran this self-check before applying. ${AUTO.length} rules were checked by reading your drawings against this lot; ${CITY_CHECKS.length} are left to the city. ${C2.suggest} suggestion is still open. ${neg('This is not a plan review, a permit or an approval, and the city may reach a different result.')}</div>
      <div data-count-group="suggest" data-count="${C2.suggest}">${kicker('Suggested before you submit &mdash; ' + C2.suggest)}</div>
      ${CHECKS.filter((c) => groupOf(c, 'v2') === 'suggest').map(docRow).join('')}
      <div data-count-group="city" data-count="${C2.city}">${kicker('The city reviews these &mdash; ' + C2.city)}</div>
      ${CITY_CHECKS.map((c) => `<div data-check="${c.id}" data-group="city" style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);"><b style="color:var(--sc-ink);">${c.num}. ${c.name}.</b> ${c.reason}</div>`).join('')}
      <div data-count-group="clear" data-count="${C2.clear}">${kicker('No issue found &mdash; ' + C2.clear)}</div>
      <div style="display:flex; flex-direction:column;">
        ${CHECKS.filter((c) => groupOf(c, 'v2') === 'clear').map((c) => `<div data-check="${c.id}" data-group="clear" style="display:grid; grid-template-columns:28px 190px 150px 150px 1fr; gap:var(--sc-2); padding:5px 0; border-top:1px solid var(--sc-line-faint); font:400 13px/18px var(--sc-font-ui);"><span>${c.num}.</span><span>${c.name}</span><span style="font-family:var(--sc-font-data);">${c.v2.read}</span><span style="font-family:var(--sc-font-data); color:var(--sc-ink-3);">${c.req}</span>${aiTag(c.sheet)}${c.v2.note ? '<span style="grid-column:2 / -1; font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + c.v2.note + '</span>' : ''}</div>`).join('')}
        <div style="padding-top:6px; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">All five against ${esc(citeText('14-02-003'))}.</div>
      </div>
      <div style="margin-top:auto; display:flex; gap:var(--sc-4); align-items:center; padding-top:var(--sc-3); border-top:1px solid var(--sc-line);">
        <div style="width:72px; height:72px; flex:none; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:400 12px/1 var(--sc-font-data); color:var(--sc-ink-3); ${HATCH}">QR</div>
        <div style="font:400 12px/18px var(--sc-font-data); color:var(--sc-ink-2);">Check that this document is authentic and current at /precheck/verify/${CODE}<br>Readings marked AI READING were made by software from your drawings and were not checked by a person.<br>${C2.suggest} + ${C2.city} + ${C2.clear} = ${CHECKS.length} checks listed for this project.</div>
      </div>
    </div>
    <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${panel(ptitle('The same findings, by email'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2); font:400 14px/21px var(--sc-font-ui);">
        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">SUBJECT</div>
        <div style="font-weight:600;">Your plan precheck for ${LOT.address}: ${C2.suggest} suggestion open</div>
        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); margin-top:var(--sc-2);">BODY</div>
        <div style="color:var(--sc-ink-2);">Version ${V2.n} of your precheck is ready. ${C2.suggest} suggestion is open (front setback), ${C2.city} checks are left to the city, and ${C2.clear} found no issue. The findings are attached.</div>
        <div style="color:var(--sc-ink-2);">Open your precheck to upload a revised set or to apply. The link works for this precheck only.</div>
        <div>${btn('Open my precheck', true)}</div>
        <div style="color:var(--sc-ink-3); font-size:12px; line-height:17px;">${neg('A self-check, not a plan review or an approval.')}</div>
      </div>`)}
      ${note('The document is the product the applicant carries away, the same way the reasoner treats its correction notice. Its counts tie on the page, it cites only the two Bastrop sections that exist in source, and it prints no citation for a rule with no edition.')}
      ${note('Verification host is owed: the address of the public page is an open question, so the link is shown as a path.')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 7: Verify */

const vRow = (k, v) => `<div style="display:grid; grid-template-columns:200px 1fr; gap:var(--sc-3); padding:8px 0; border-top:1px solid var(--sc-line-faint); font:400 14px/20px var(--sc-font-ui);"><span style="color:var(--sc-ink-2);">${k}</span><span style="font-family:var(--sc-font-data);">${v}</span></div>`;
const verify = frame({
  w: 1600, h: 640, theme: 'sc-light', audience: 'public', body: `
  <header style="height:60px; flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-6); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
    <div style="width:36px; height:36px; border-radius:50%; border:1.5px dashed var(--sc-line-strong); display:grid; place-items:center; font:500 12px/1 var(--sc-font-data); color:var(--sc-ink-3);">logo</div>
    <span style="font:650 16px/20px var(--sc-font-ui);">${CITY.name}</span><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-3);">Verify a plan precheck</span>${FIXTURE}
    <div style="flex:1;"></div><span style="font:650 15px/20px var(--sc-font-ui);">SmartCity</span>
  </header>
  <div style="flex:1; display:flex; gap:var(--sc-5); padding:var(--sc-6);">
    <div style="flex:1.2; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${panel(`<span style="${TAGSTYLE} color:var(--sc-ok); background:var(--sc-ok-wash);">AUTHENTIC</span><span style="${TAGSTYLE} color:var(--sc-ok); background:var(--sc-ok-wash);">CURRENT</span>${ptitle(CODE)}`, `<div style="padding:var(--sc-3) var(--sc-4);">
        <div style="font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2); padding-bottom:var(--sc-2);">This document was issued by SmartCity for the ${CITY.name} and matches our record exactly. No newer version exists and the city's rules for this check have not changed since it was issued.</div>
        ${vRow('Issued', V2.when)}
        ${vRow('Plan set', 'version ' + V2.n + ' of ' + V2.n)}
        ${vRow('Lot', LOT.address + ' &middot; ' + LOT.parcel)}
        ${vRow('Project', PROJECT)}
        ${vRow('Rules', esc(SRC.planReview.bastropUdc.title) + ' (' + SRC.planReview.bastropUdc.editionId + ')')}
        ${vRow('Checks listed', `<span data-checklist-total="${CHECKS.length}">${CHECKS.length}</span>: <span data-count-group="suggest" data-count="${C2.suggest}">${C2.suggest} suggestion open</span>, <span data-count-group="city" data-count="${C2.city}">${C2.city} left to the city</span>, <span data-count-group="clear" data-count="${C2.clear}">${C2.clear} no issue found</span>`)}
        ${vRow('Document fingerprint', 'matches')}
        <div style="margin-top:var(--sc-3); font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-3);">This page shows no drawings, no readings and nothing about who ran the check. City staff open the full precheck from their own login. ${neg('A precheck is not a plan review, a permit or an approval.')}</div>
      </div>`)}
    </div>
    <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4);">
      ${kicker('The same page in its other states')}
      ${panel(`<span style="${TAGSTYLE} color:var(--sc-ok); background:var(--sc-ok-wash);">AUTHENTIC</span><span style="${TAGSTYLE} color:var(--sc-warn); background:var(--sc-warn-wash);">REPLACED</span>${ptitle('version 1')}`, `<div style="padding:var(--sc-3) var(--sc-4); font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">A newer version of this precheck exists (version 2, ${V2.when}). This document was accurate for version 1 and is out of date.</div>`)}
      ${panel(`<span style="${TAGSTYLE} color:var(--sc-ok); background:var(--sc-ok-wash);">AUTHENTIC</span><span style="${TAGSTYLE} color:var(--sc-warn); background:var(--sc-warn-wash);">RULES CHANGED</span>${ptitle('after issue')}`, `<div style="padding:var(--sc-3) var(--sc-4); font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">The city changed the rules for this check after this document was issued. Running the check again may give a different result.</div>`)}
      ${panel(`<span style="${TAGSTYLE} color:var(--sc-crit); background:var(--sc-crit-wash);">NO MATCH</span>${ptitle('unknown code or altered document')}`, `<div style="padding:var(--sc-3) var(--sc-4); font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">No precheck matches this code, or the document does not match the one we issued.</div>`)}
      ${note('Open to anyone, with no login: a verifier that needs our credential proves nothing to someone who does not already trust us. It confirms and it dates; it never serves content. Rate-limit it rather than gate it.')}
    </div>
  </div>`,
});

/* ================================================================== BOARD 8: Review (city) */

const REVIEW_STATE = {
  front: ['Fail', 'confirmed', 'Confirmed by the Development services reviewer, 12 Sep. The applicant applied with this open and asked about the setback.'],
  'side-w': ['Pass', 'pending', 'Not yet confirmed.'],
  'side-e': ['Pass', 'pending', 'Not yet confirmed.'],
  rear: ['Pass', 'pending', 'Not yet confirmed.'],
  height: ['Unchecked', 'overridden', 'Overridden from Pass, 12 Sep: the reading is not the dimension this rule measures. Asked the applicant for it.'],
  coverage: ['Pass', 'pending', 'Not yet confirmed.'],
};
const DETC = { Pass: ['--sc-ok', '--sc-ok-wash'], Fail: ['--sc-crit', '--sc-crit-wash'], Unchecked: ['--sc-ink-3', '--sc-quiet-wash'] };
const reviewRow = (c) => {
  const [d, st, text] = REVIEW_STATE[c.id];
  const actions = st === 'pending' ? `<span style="display:flex; gap:var(--sc-2);">${btn('Confirm')}${btn('Override')}</span>` : tag(st.toUpperCase(), st === 'confirmed' ? '--sc-ok' : '--sc-restricted', st === 'confirmed' ? '--sc-ok-wash' : '--sc-restricted-wash');
  return `<div data-check="${c.id}" data-review="${st}" style="display:flex; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-top:1px solid var(--sc-line-faint);${st === 'confirmed' ? ' background:var(--sc-accent-wash);' : ''}">
    ${pin(c.num, st === 'confirmed' ? '--sc-crit' : '--sc-quiet')}
    <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">
      <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;"><span style="font:600 14px/20px var(--sc-font-ui);">${c.name}</span>${tag(d, DETC[d][0], DETC[d][1])}${tag('FROM PRECHECK', '--sc-ink-3', '--sc-quiet-wash')}${aiTag(c.sheet)}</div>
      <div style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Read ${c.v2.read} against ${c.req}. ${text}</div>
      <div>${cite(c.section)}</div>
    </div>
    <div style="flex:none; align-self:center;">${actions}</div>
  </div>`;
};
const nPending = Object.values(REVIEW_STATE).filter((x) => x[1] === 'pending').length;

const review = frame({
  w: 1600, h: 1060, theme: '{{themeClass}}', audience: 'staff', sheets: SHEET_IDS, body: `
  <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-5); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">
    <span style="font:620 15px/22px var(--sc-font-ui);">Plan Review</span><span style="width:1px; height:20px; background:var(--sc-line);"></span>
    <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">${CITY.short}</span>${FIXTURE}
    <span style="margin-left:var(--sc-5); display:flex; gap:var(--sc-5); font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);"><span style="color:var(--sc-ink); font-weight:600; border-bottom:2px solid var(--sc-accent);">Queue</span><span>Library</span><span>Code</span><span>Applicant</span></span>
    <div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Development services reviewer</span>
  </header>
  <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4); padding:var(--sc-5) var(--sc-6); min-height:0;">
    <div style="display:flex; align-items:center; gap:var(--sc-3);">
      <span style="font:650 24px/30px var(--sc-font-ui);">PR-2026-0418</span>
      <span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">${LOT.address} &middot; single-family &middot; cycle 1 &middot; edition declared</span>
      <div style="flex:1;"></div>
      <div style="display:flex; align-items:center; gap:var(--sc-2); height:34px; padding:0 var(--sc-3); border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); background:var(--sc-surface); font:400 13px/18px var(--sc-font-data);"><span style="color:var(--sc-ink-3);">Open a precheck</span><span style="font-weight:600;">${CODE}</span></div>
    </div>
    <div style="flex:1; display:flex; gap:var(--sc-4); min-height:0;">
      <div style="width:520px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4);">
        ${panel(ptitle('Applicant precheck', CODE + ' &middot; attached by the applicant'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:6px; font:400 13px/19px var(--sc-font-ui);">
          <div style="display:flex; gap:var(--sc-2); flex-wrap:wrap;">${tag('AUTHENTIC', '--sc-ok', '--sc-ok-wash')}${tag('CURRENT', '--sc-ok', '--sc-ok-wash')}${tag('VERSION ' + V2.n + ' OF ' + V2.n, '--sc-ink-3', '--sc-quiet-wash')}</div>
          <div><b data-open-count="${openNow.length}">Applied with ${openNow.length} suggestion open:</b> ${openNow.map((c) => c.num + ' ' + c.name).join(', ')}.</div>
          <div style="color:var(--sc-ink-2);">Applicant's note: asking the city about the front setback.</div>
          <div style="color:var(--sc-ink-2);">${AUTO.length} readings from the drawings, none checked by a person until a reviewer confirms them here. ${CITY_CHECKS.length} rules were left to the city and appear in the findings as Unchecked.</div>
          <div style="color:var(--sc-ink-2);">The applicant flagged no readings as wrong.</div>
        </div>`)}
        <div style="flex:1; display:flex; flex-direction:column;">${sheetViewer('v2', 470, 3.6, 70, true)}</div>
      </div>
      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">
        ${panel(ptitle('Findings from the precheck', AUTO.length + ' readings &middot; ' + nPending + ' to confirm'), AUTO.map(reviewRow).join(''), 'overflow:hidden;')}
        ${panel(ptitle('Decision', 'recorded against the lot'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">
          <div style="display:flex; gap:var(--sc-2); flex-wrap:wrap;">${SRC.planReview.engagementStages.map((s) => `<span data-stage="${s}" style="height:30px; display:inline-flex; align-items:center; padding:0 var(--sc-3); border-radius:var(--sc-r-full); border:1px solid ${s === 'In Review' ? 'var(--sc-accent)' : 'var(--sc-line)'}; background:${s === 'In Review' ? 'var(--sc-accent-wash)' : 'var(--sc-surface)'}; font:${s === 'In Review' ? 600 : 400} 13px/18px var(--sc-font-ui);">${s}</span>`).join('')}</div>
          <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">A decision can be recorded once every reading is confirmed or overridden: ${nPending} still to go. It is written against ${LOT.parcel} with the stage, any conditions, the reviewer's role, the date, and ${CODE} version ${V2.n} as its basis.</div>
          <div style="display:flex; gap:var(--sc-2);">${btnOff('Record decision')}</div>
        </div>`)}
        ${note('Precheck readings arrive as sheet-located inputs, one rung above a number typed on a form (the reasoner thesis). The five stages are the product\'s own engagement stages. Writing the decision to the lot needs a decision record type the atom contract does not have (1.36.0). The city\'s decision stays that city\'s data unless the city publishes it.')}
      </div>
    </div>
  </div>`,
});

/* ================================================================== BOARD 9: Setup (city) */

const setRow = (a, b, c, d = '') => `<div style="display:grid; grid-template-columns:230px 1fr 190px; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 14px/20px var(--sc-font-ui);${d}"><span style="color:var(--sc-ink-2);">${a}</span><span>${b}</span><span style="justify-self:end;">${c}</span></div>`;
const setup = frame({
  w: 1600, h: 1100, theme: '{{themeClass}}', audience: 'staff', body: staffShell('Plan review', `${CITY.short} / Plan review / Precheck settings`, `
    <div style="display:flex; align-items:center; gap:var(--sc-3);"><span style="font:650 24px/30px var(--sc-font-ui);">Plan precheck settings</span>${tag('PREVIEW ONLY', '--sc-restricted', '--sc-restricted-wash')}<div style="flex:1;"></div>${btn('Preview the public page')}</div>
    <div style="font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); max-width:980px;">What applicants see before they apply. The public page stays in preview until two things are set: who can use it, and which code is in force.</div>
    <div style="display:flex; gap:var(--sc-4); min-height:0;">
      <div style="flex:1; display:flex; flex-direction:column; gap:var(--sc-4); min-width:0;">
        ${panel(ptitle('Rules in force'), [
          setRow('Zoning and development', esc(SRC.planReview.bastropUdc.title) + '<div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + SRC.planReview.bastropUdc.editionId + ' &middot; sections in this check: ' + SRC.planReview.bastropUdc.sections.join(', ') + '</div>', T.unconfirmed()),
          `<div style="padding:0 var(--sc-4) var(--sc-3); font:400 13px/19px var(--sc-font-ui); color:var(--sc-warn);">Confirm this is the code in force, and its effective date. The city also publishes a newer zoning layer it describes as replacing the B3 code.</div>`,
          setRow('Residential code', '<span style="color:var(--sc-ink-3);">not set</span><div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">choose an edition; available: ' + SRC.planReview.availableEditions.filter((e) => e.startsWith('IRC')).join(', ') + '</div>', `<span data-absence="${absence('unchecked')}" style="font:400 12px/16px var(--sc-font-data); color:var(--sc-warn);">1 check cannot run</span>`),
        ].join(''))}
        ${panel(ptitle('Project types'), [
          setRow(PROJECT, `${CHECKS.length} checks &middot; ${AUTO.length} from plans, ${CITY_CHECKS.length} city review`, tag('ON', '--sc-ok', '--sc-ok-wash')),
          setRow('Accessory structure', '<span style="color:var(--sc-ink-3);">no checklist yet</span>', tag('OFF', '--sc-ink-3', '--sc-quiet-wash')),
          setRow('New commercial building', '<span style="color:var(--sc-ink-3);">no checklist yet</span>', tag('OFF', '--sc-ink-3', '--sc-quiet-wash')),
        ].join(''))}
        ${panel(ptitle('Checklist', PROJECT + ' &middot; sections of ' + esc(SRC.planReview.bastropUdc.title) + ' (' + SRC.planReview.bastropUdc.editionId + ')'), `<div style="display:grid; grid-template-columns:40px 1fr 280px 1fr; gap:var(--sc-3); padding:var(--sc-2) var(--sc-4); background:var(--sc-surface-2); font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; color:var(--sc-ink-3);"><span>#</span><span>CHECK</span><span>DECIDED BY</span><span>RULE</span></div>` +
          CHECKS.map((c) => `<div data-check="${c.id}" style="display:grid; grid-template-columns:40px 1fr 280px 1fr; gap:var(--sc-3); align-items:center; padding:8px var(--sc-4); border-top:1px solid var(--sc-line-faint); font:400 13px/18px var(--sc-font-ui);${c.kind === 'city' ? ' ' + HATCH : ''}">${pin(c.num, c.kind === 'city' ? '--sc-quiet' : '--sc-accent')}<span style="font-weight:600;">${c.name}</span><span style="color:var(--sc-ink-2);">${c.kind === 'auto' ? 'reading of sheet ' + c.sheet + ' against the lot' : 'city review'}</span>${c.section ? `<span data-section="${c.section}" style="font:400 13px/18px var(--sc-font-data);">${c.section}</span>` : `<span data-absence="${absence('unchecked')}" style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">no citation${c.sectionLabel ? ', ' + c.sectionLabel + ' edition not set' : ''}</span>`}</div>`).join(''))}
      </div>
      <div style="width:430px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4);">
        ${panel(ptitle('Public page'), [
          setRow('Logo', '<span style="display:inline-grid; place-items:center; width:28px; height:28px; border-radius:50%; border:1.5px dashed var(--sc-line-strong); font:400 12px/1 var(--sc-font-data); color:var(--sc-ink-3);">logo</span>', tag('SET', '--sc-ok', '--sc-ok-wash')),
          setRow('Name', CITY.name, ''),
          setRow('Address', '<span style="color:var(--sc-ink-3);">not decided</span>', T.owed()),
        ].join('').replace(/grid-template-columns:230px 1fr 190px/g, 'grid-template-columns:90px 1fr 90px'))}
        ${panel(ptitle('Who can use it'), `<div style="padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-2);">
          ${['Free for everyone', 'Free check, paid findings document', 'Paid'].map((o) => `<div style="display:flex; align-items:center; gap:var(--sc-2); font:400 14px/20px var(--sc-font-ui);"><span style="width:16px; height:16px; border-radius:50%; border:1.5px solid var(--sc-line-strong); box-sizing:border-box;"></span>${o}</div>`).join('')}
          <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-warn);">Not decided. The page stays in preview until this is set.</div>
        </div>`)}
        ${panel(ptitle('How you take applications', 'shown to applicants'), `<div style="padding:var(--sc-3) var(--sc-4);"><div style="border:1px solid var(--sc-line-strong); border-radius:var(--sc-r-control); padding:var(--sc-2) var(--sc-3); font:400 13px/19px var(--sc-font-ui); min-height:80px; box-sizing:border-box;">Apply through the city's permit portal. Attach your precheck findings, or give the reviewer your precheck code.</div></div>`)}
        ${note('Nothing on this board exists in the product. The city pack carries ' + SRC.dashboards.bastropPackFields.length + ' fields today (' + SRC.dashboards.bastropPackFields.join(', ') + ') and none of them is branding, a rule set, a project type or submission text.')}
      </div>
    </div>`),
});

/* ------------------------------------------------------------------ write */

const BOARDS = [
  ['Flow.dc.html', flow, 0, 0, 1600, 940, 'The flow, and what exists today'],
  ['Main.dc.html', start, 1720, 0, 1600, 930, '1 Start: lot, project, what is checked'],
  ['Reading.dc.html', reading, 3440, 0, 1600, 820, '2 Reading the plans'],
  ['Findings.dc.html', findings, 5160, 0, 1600, 1350, '3 Findings, version 1'],
  ['Revised.dc.html', revised, 0, 1440, 1600, 920, '4 Version 2 compared'],
  ['Submit.dc.html', submit, 1720, 1440, 1600, 660, '5 Apply, with a suggestion open'],
  ['Summary.dc.html', summary, 3440, 1440, 1600, 1130, '6 The findings document and email'],
  ['Verify.dc.html', verify, 5160, 1440, 1600, 640, '7 Public verify page'],
  ['Review.dc.html', review, 0, 2720, 1600, 1060, '8 City: review with the precheck'],
  ['Setup.dc.html', setup, 1720, 2720, 1600, 1100, '9 City: precheck settings'],
];
for (const [file, html] of BOARDS) fs.writeFileSync(new URL('./' + file, import.meta.url), html);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: BOARDS.map(([file, , x, y, w, h, title]) => ({ file, x, y, w, h, title })),
  annotations: [
    { id: 'brief', x: 0, y: -380, w: 760, text: 'SMARTCITY APPLICANT PRECHECK. A pre-submittal self-check on a SmartCity public page with the city\'s logo (operator 2026-09-17).\nThe AI reads the plan set; there is no dimension form. Quick check, download or email the findings, revise, and apply even with suggestions open.\nFIXTURE throughout, continuing the 908 PINE ST story from the reasoner boards. Nobody is named.' },
    { id: 'thesis', x: 820, y: -380, w: 760, text: 'TWO MOVES. (1) The checklist is shown before upload, so every result has a denominator and "no issues" can never read as "complies". (2) Results are sorted by who acts next: suggested before you submit, the city reviews these, no issue found. The applicant never sees Pass or Fail.' },
    { id: 'open', x: 1640, y: -380, w: 760, text: 'OPEN, NOT RULED. How Smart Site, Smart Files, SmartCity plan review and Development services blend. Where the public page lives. Which service runs the check (adjudicator in plan-review, AI reading in legacy-design-tools). Who pays. Which checks ship first. G-140: which Bastrop code is in force.' },
    { id: 'honest', x: 2460, y: -380, w: 760, text: 'HELD TO SOURCE. Citations are rendered by plan-review\'s renderCitationText() via source-state.json; only 14-02-003 and 14-02-008 exist. A rule with no edition prints no citation. Requirements and readings are fixture. `node check.mjs` refuses any drift.' },
  ],
  launch: { x: 1720, y: 0, zoom: 0.5 },
}, null, 2) + '\n');

console.log('wrote ' + BOARDS.length + ' artboards + canvas.json');
console.log('v1 groups ' + JSON.stringify(C1) + '  v2 groups ' + JSON.stringify(C2) + '  changes ' + JSON.stringify(chg));
