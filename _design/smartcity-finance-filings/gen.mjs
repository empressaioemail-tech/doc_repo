import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');

/* SmartCity Finance lens — Localgov filings.
   Tokens copied from the frozen sc-kit, never invented.
   No figure on these artboards is measured: the endpoint has never been called. */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ALERT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>';
const LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

const BADGE = {
  'LIVE RECORDS': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'FIXTURE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'EMPTY': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'NOT READ': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NOT BUILT': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'UNLABELLED': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'UNVERIFIED': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'TENANT PRIVATE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t] || BADGE['EMPTY'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 5px;">' + t + '</span>';
};

/* G-138. An external-authority citation: a figure this product attributes to an authority outside
   itself (the city's ordinance, the city's ledger). While no traceable source is on file it renders
   with data-verified="false" and the UNVERIFIED badge beside the value. check.mjs refuses any text
   occurrence of a registered citation that is not inside one of these, and refuses verified=true
   without a source. Promote a citation by setting verified:true AND recording its source in
   check.mjs's REGISTRY; setting only one of the two fails the check. */
const CITES = {
  'ordinance-rate': { verified: false },
  'fund-108': { verified: false },
};
const cite = (id, text) => {
  const c = CITES[id];
  if (!c) throw new Error('cite(): unregistered citation ' + id);
  return '<span data-citation="' + id + '" data-verified="' + (c.verified ? 'true' : 'false') + '" style="display:inline-flex; align-items:center; gap:4px;">' + text + (c.verified ? '' : badge('UNVERIFIED')) + '</span>';
};

/* The Exceptions tab counts every SCORED finding. While the ordinance rate is unverified the rate
   check is held and scores nothing, so its three findings leave the count. Deriving the count from
   the same flag that holds the check makes the two unable to disagree. */
const RATE_N = 3, OUTSTANDING_N = 4, LATE_N = 5;
const EX_COUNT = String((CITES['ordinance-rate'].verified ? RATE_N : 0) + OUTSTANDING_N + LATE_N);

const LENSES = [
  ['Overview', 'LIVE RECORDS'], ['Development services', 'LIVE RECORDS'], ['Finance', 'LIVE RECORDS'],
  ['Citizen', 'PREVIEW'], ['Public works', 'NOT READ'], ['Parks', 'NOT BUILT'],
  ['Police', 'LIVE RECORDS'], ['Fire and EMS', 'NOT READ'], ['Fleet', 'LIVE RECORDS'],
];
const LENSES_EMPTY = LENSES.map((l) => (l[0] === 'Finance' ? ['Finance', 'EMPTY'] : l));

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (lenses, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', lenses.map((l) => navRow(l[0], l[1], l[0] === 'Finance'))) + '\n' +
  navGroup('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'EMPTY'], ['Connections', ''], ['People and access', 'NOT BUILT']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal, role) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">STAGING</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; ' + role + '</span>\n      </div>\n    </header>';

/* ---------- THE STRUCTURAL MOVE: the headline is an agreement, not an amount ---------- */
const agreement = (a) => {
  const tone = a.tone || '--sc-ok';
  const wash = a.wash || '--sc-ok-wash';
  return '        <section style="border:1px solid var(--sc-line); border-left:3px solid var(' + tone + '); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-4) var(--sc-5); display:flex; align-items:flex-start; gap:var(--sc-6);">\n' +
  '          <div style="flex:none; width:34px; height:34px; border-radius:var(--sc-r-full); background:var(' + wash + '); color:var(' + tone + '); display:grid; place-items:center;">' + (a.icon || CHECK) + '</div>\n' +
  '          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:3px;">\n' +
  '            <div style="font:650 19px/26px var(--sc-font-ui); letter-spacing:-.014em; color:var(--sc-ink);">' + a.head + '</div>\n' +
  '            <div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:78ch;">' + a.sub + '</div>\n' +
  '            <div style="margin-top:3px; font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); max-width:92ch;">' + a.basis + '</div>\n' +
  '          </div>\n' +
  (a.figure
    ? '          <div style="flex:none; display:flex; flex-direction:column; align-items:flex-end; gap:1px; padding-left:var(--sc-5); border-left:1px solid var(--sc-line-faint);">\n' +
      '            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + a.figureK + '</div>\n' +
      '            <div style="font:400 28px/34px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.015em; color:var(' + tone + ');">' + a.figure + '</div>\n' +
      '            <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + a.figureSub + '</div>\n          </div>\n'
    : '') +
  '        </section>';
};

/* ---------- three measures, each naming the source it came from ---------- */
const measure = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); box-shadow:var(--sc-e1); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:2px; min-width:0;">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + m.k + '</span>' + (m.tag ? badge(m.tag) : '') + '</div>\n' +
(m.read
  ? '            <div style="font:400 25px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.014em; color:var(' + (m.tone || '--sc-ink') + ');">' + m.v + '</div>'
  : '            <div style="font:620 16px/32px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>') + '\n' +
'            <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + m.field + '</div>\n' +
'            <div style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + m.src + '</div>\n          </div>';

const tabs = (items, active) =>
'        <div style="display:flex; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:6px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    (t.c ? '<span data-tab="' + t.n + '" data-count="' + t.c + '" style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (t.tone || '--sc-ink-3') + ');">' + t.c + '</span>' : '') + '</div>';
}).join('\n') + '\n        </div>';

const cell = (c) => {
  if (c && typeof c === 'object') {
    return '<span style="font:400 13px/18px var(' + (c.mono ? '--sc-font-data' : '--sc-font-ui') + '); font-variant-numeric:tabular-nums; color:var(' + (c.tone || '--sc-ink') + '); ' + (c.right ? 'text-align:right;' : '') + ' overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + c.t + '</span>';
  }
  return '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + c + '</span>';
};

const table = (o) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:0 var(--sc-4); padding:var(--sc-2) var(--sc-4); border-bottom:1px solid var(--sc-line-faint); background:var(--sc-surface-2);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.07em; text-transform:uppercase; color:var(--sc-ink-3); ' + (h.right ? 'text-align:right;' : '') + '">' + (h.t || h) + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:0 var(--sc-4); align-items:center; min-height:var(--sc-row); padding:0 var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
r.map((c) => '              ' + cell(c)).join('\n') + '\n            </div>').join('\n');

const panel = (o) =>
'        <section' + (o.data || '') + ' style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;' + (o.grow ? ' flex:1; min-height:0;' : '') + '">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
'            <div style="flex:1;"></div>\n' + (o.right || '') + '\n          </div>\n' + o.body + '\n        </section>';

/* honest empty: a region that exists, is countable, and says what would fill it */
const emptyRegion = (o) =>
'            <div style="flex:1; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:var(--sc-2); padding:var(--sc-7) var(--sc-6); max-width:80ch;">\n' +
'              <div style="display:flex; align-items:center; gap:6px; font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + (o.lock ? LOCK : '') + '<span>' + o.k + '</span></div>\n' +
'              <div style="font:620 17px/24px var(--sc-font-ui); letter-spacing:-.01em; color:var(--sc-ink-2);">' + o.h + '</div>\n' +
'              <p style="margin:0; font:400 13px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>\n' +
'              <div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + o.b + '</div>\n            </div>';

const railBlock = (title, rows) =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3);">' + title + '</div>\n' +
rows.join('\n') + '\n          </div>';

const sourceRow = (s) =>
'            <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface);">\n' +
'              <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="flex:1; font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + s.n + '</span><span style="width:7px; height:7px; border-radius:var(--sc-r-full); background:var(' + (s.tone || '--sc-ok') + ');"></span></div>\n' +
'              <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + s.d + '</div>\n            </div>';

const gapRow = (g) =>
'            <div style="display:flex; flex-direction:column; gap:2px; padding:var(--sc-2) 0 var(--sc-2) var(--sc-3); border-left:2px solid var(--sc-line);">\n' +
'              <span style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + g.n + '</span>\n' +
'              <span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + g.d + '</span>\n            </div>';

const bars = (data, unit) =>
'            <div style="display:flex; align-items:flex-end; gap:var(--sc-2); height:190px; padding:var(--sc-4) var(--sc-5) var(--sc-2);">\n' +
data.map((d) =>
'              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; min-width:0;">\n' +
'                <div style="width:100%; height:' + d.h + 'px; border-radius:2px 2px 0 0; background:var(' + (d.tone || '--sc-accent') + '); opacity:' + (d.dim ? '.34' : '1') + ';"></div>\n' +
'                <span style="font:400 11px/14px var(--sc-font-data); color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%;">' + d.k + '</span>\n              </div>').join('\n') + '\n            </div>\n' +
'            <div style="padding:0 var(--sc-5) var(--sc-3); font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + unit + '</div>';

/* ---------- artboard shell ---------- */
const shell = (o) =>
  '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
  '<div class="{{themeClass}}" style="width:1600px; height:' + (o.h || 1040) + 'px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
  topbar(o.city, o.seal, o.role) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.lenses || LENSES, o.foot) + '\n' +
  '    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; gap:var(--sc-5); min-height:0;">\n' +
  '      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
  '        <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
  '          <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Finance / ' + o.crumb + '</div>\n' +
  '          <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + o.pageBadges.map(badge).join('') + '</div>\n' +
  '          <p style="margin:0; max-width:86ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.sub + '</p>\n        </div>\n' +
  o.body + '\n      </div>\n' +
  (o.rail ? '      <aside style="width:286px; flex:none; display:flex; flex-direction:column; gap:var(--sc-5); overflow:hidden;">\n' + o.rail + '\n      </aside>\n' : '') +
  '    </main>\n  </div>\n</div>\n</x-dc>\n' +
  '<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + o.theme + '"}}\'>\n' +
  'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + o.theme + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';

const OK = '--sc-ok', CRIT = '--sc-crit', WARN = '--sc-warn', Q = '--sc-ink-3';
const R = (t, tone) => ({ t, mono: true, right: true, tone });
const M = (t, tone) => ({ t, mono: true, tone });

const FOOT_LIVE = '2 of 10 sources granted<br>localgov &middot; opengov';
const TABS_MAIN = (ex, filings) => [
  { n: 'Reconciliation' }, { n: 'Exceptions', c: ex, tone: ex === '0' ? '--sc-ink-3' : '--sc-crit' },
  { n: 'Lodging economy' }, { n: 'All filings', c: filings },
];

/* =======================  1. MAIN — reconciled  ======================= */
const periodRows = [
  ['July 2026', R('12'), R('$6,904,100'), R('$6,682,300'), R('$464,872'), R('$461,433'), R('$460,253'), R('-$1,180', OK)],
  ['June 2026', R('11'), R('$6,218,400'), R('$6,012,700'), R('$419,051'), R('$415,149'), R('$413,829'), R('-$1,320', OK)],
  ['May 2026', R('11'), R('$5,817,700'), R('$5,632,800'), R('$392,478'), R('$388,298'), R('$387,338'), R('-$960', OK)],
];

const main = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'Finance', crumb: 'Filings',
  h1: 'Hotel occupancy filings', pageBadges: ['FIXTURE', 'TENANT PRIVATE'], foot: FOOT_LIVE,
  sub: 'Filings submitted through Localgov, reconciled against the city ledger. Every figure names the field and the system it came from, because three of them are different facts and only one is money in the bank.',
  body:
    agreement({
      tone: OK, wash: '--sc-ok-wash', icon: CHECK,
      head: 'Localgov and the ledger agree for Q3 FY26',
      sub: 'Tax received through Localgov is $3,460 above what ' + cite('fund-108', 'fund 108') + ' booked for the same three months, which is 0.27 percent of receipts.',
      basis: 'Localgov AmountPaid, 34 filings, read 09/14 16:02 &middot; OpenGov ' + cite('fund-108', 'fund 108') + ' revenue, read 09/14 06:00 &middot; AmountPaid excludes processing fees and the two sources close on different days, so a gap of this shape is expected. It is not evidence of an error.',
      figureK: 'Unreconciled', figure: '-$3,460', figureSub: '0.27% of receipts',
    }) + '\n' +
    '        <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--sc-3);">\n' +
    [
      { k: 'Filed', read: true, v: '$1,276,401', field: 'TotalAmountDue', src: 'What filers reported owing &middot; Localgov' },
      { k: 'Received', read: true, v: '$1,264,880', field: 'AmountPaid', src: 'Tax received, excludes processing fees &middot; Localgov' },
      { k: 'Booked', read: true, v: '$1,261,420', field: cite('fund-108', 'Fund 108 revenue'), src: 'City ledger &middot; OpenGov' },
    ].map(measure).join('\n') + '\n        </div>\n' +
    tabs(TABS_MAIN(EX_COUNT, '34'), 'Reconciliation') + '\n' +
    panel({
      grow: true, title: 'By filing period', sub: 'Q3 FY26 &middot; May to July',
      right: '<span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); padding:0 var(--sc-2);">Export</span>',
      body: table({
        cols: '128px 62px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 108px',
        head: ['Period', { t: 'Filings', right: true }, { t: 'Gross revenue', right: true }, { t: 'Taxable', right: true }, { t: 'Filed', right: true }, { t: 'Received', right: true }, { t: 'Booked', right: true }, { t: 'Delta', right: true }],
        rows: periodRows,
      }) +
      '\n            <div style="display:grid; grid-template-columns:128px 62px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 108px; gap:0 var(--sc-4); align-items:center; min-height:var(--sc-row); padding:0 var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line-faint);">\n' +
      ['<span style="font:620 13px/18px var(--sc-font-ui); color:var(--sc-ink);">Quarter</span>', cell(R('34')), cell(R('$18,940,200')), cell(R('$18,327,800')), cell(R('$1,276,401')), cell(R('$1,264,880')), cell(R('$1,261,420')), cell(R('-$3,460', OK))].map((c) => '              ' + c).join('\n') +
      '\n            </div>\n' +
      '            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3);">Taxable is gross revenue less exemptions as filed. Tax due, penalty, interest and the timely-filing allowance reconcile to Filed on every row in this period.</div>',
    }),
  rail:
    railBlock('Reading from', [
      sourceRow({ n: 'Localgov Filings', d: '34 filings &middot; read 09/14 16:02' }),
      sourceRow({ n: cite('fund-108', 'OpenGov fund 108'), d: 'FY26 ledger &middot; read 09/14 06:00' }),
    ]) + '\n' +
    railBlock('Needs attention', [
      '            <div style="display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
      [
        (CITES['ordinance-rate'].verified
          ? { k: 'Rate does not match ordinance', v: String(RATE_N), tone: CRIT, finding: 'rate-mismatch', scored: true }
          : { k: 'Rate check held: the ordinance rate is not sourced', v: 'Held', tone: Q, finding: 'rate-mismatch', scored: false }),
        { k: 'Outstanding after 30 days', v: '4', tone: WARN },
        { k: 'Filed late', v: '5', tone: WARN },
      ].map((x) =>
        '              <div' + (x.finding ? ' data-finding="' + x.finding + '" data-scored="' + (x.scored ? 'true' : 'false') + '"' : '') + ' style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-2) var(--sc-3); border:1px solid var(--sc-line-faint); border-radius:var(--sc-r-control); background:var(--sc-surface);"><span style="font:400 19px/24px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + x.tone + ');">' + x.v + '</span><span style="flex:1; font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-2);">' + x.k + '</span></div>').join('\n') +
      '\n              <div style="display:flex; align-items:center; gap:5px; font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent); padding-top:var(--sc-1);"><span>Open exceptions</span>' + ARROW + '</div>\n            </div>',
    ]) + '\n' +
    railBlock('This feed cannot answer', [
      gapRow({ n: 'Who has not filed', d: 'The filings feed identifies filings, not filers. Without a taxpayer key there is no roster to compare against.' }),
      gapRow({ n: 'One taxpayer over time', d: 'Same reason. Every view here is a period total, never a filer history.' }),
    ]),
});

/* G-138. The rate check is meaning-shaped: the implied rate comes from the filing and the expected
   rate from the city ordinance, two independent sources. That holds only while the second input is
   real. With the ordinance rate unsourced, scoring a filing against it hands the city a worklist
   accusing its own taxpayers of filing at the wrong rate, citing a number nobody has traced to the
   ordinance. So while it is unverified the region is HELD and scores nothing, and says why. It also
   honours the scope card, which forbids computing any rate over the monetary fields until the
   Azavar Q2 answer is filed. The scored table below returns unchanged the moment the citation is
   promoted. */
const RATE_CITATION = '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); display:inline-flex; align-items:center; gap:4px;">' + cite('ordinance-rate', 'Ordinance rate 7.00%') + ' &middot; Bastrop code of ordinances</span>';
const ratePanel = () => (CITES['ordinance-rate'].verified
  ? panel({
      data: ' data-region="worklist" data-worklist="rate" data-count="' + RATE_N + '" data-scored="true"',
      title: 'Rate does not match the ordinance', sub: RATE_N + ' filings &middot; tax due divided by taxable revenue',
      right: RATE_CITATION,
      body: table({
        cols: '112px 96px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 92px 92px 96px',
        head: ['Filing ref', 'Submitted', { t: 'Gross revenue', right: true }, { t: 'Exemptions', right: true }, { t: 'Tax due', right: true }, { t: 'Implied', right: true }, { t: 'Expected', right: true }, { t: 'Difference', right: true }],
        rows: [
          [M('AB12CD34'), M('07/18/26'), R('$1,284,000'), R('$0'), R('$83,460'), R('6.50%', CRIT), R(cite('ordinance-rate', '7.00%')), R('-$6,420', CRIT)],
          [M('GH88KL21'), M('06/20/26'), R('$402,800'), R('$61,200'), R('$28,196'), R('8.25%', CRIT), R(cite('ordinance-rate', '7.00%')), R('+$4,284', CRIT)],
          [M('RS40TU19'), M('05/19/26'), R('$96,400'), R('$96,400'), R('$0'), { t: 'n/a', mono: true, right: true, tone: Q }, R(cite('ordinance-rate', '7.00%')), { t: 'review', mono: true, right: true, tone: WARN }],
        ],
      }) +
      '\n            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); max-width:118ch;">The implied rate is computed from the filing itself and compared against the rate in the city ordinance, which is a separate source. A filing that claims full exemption has no implied rate and is shown for review rather than scored.</div>',
    })
  : panel({
      data: ' data-region="worklist" data-worklist="rate" data-count="0" data-scored="false"',
      title: 'Rate against the ordinance', sub: 'held &middot; no filing is scored',
      right: RATE_CITATION,
      body: emptyRegion({
        k: 'Check held',
        h: 'The ordinance rate is not sourced, so no filing is scored against it.',
        p: 'This check compares the rate each filing implies with the rate in the city ordinance, and that second, separate source is what makes it a real check rather than a filing agreeing with itself. It only works while the second input is real. The rate here has no traceable source on file, so scoring filings against it would tell staff that Bastrop taxpayers filed at the wrong rate on the strength of a number nobody has checked against the ordinance.',
        b: 'Resumes when the ordinance rate is sourced at Bastrop&#39;s published code of ordinances, and when the Azavar answer on which fields the form captures is filed. Until then no rate is computed over any monetary field.',
      }),
    }));

/* =======================  2. EXCEPTIONS  ======================= */
const exceptions = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'Finance', crumb: 'Filings / Exceptions',
  h: 1300, h1: 'Exceptions', pageBadges: ['FIXTURE', 'TENANT PRIVATE'], foot: FOOT_LIVE,
  sub: 'Filings whose arithmetic, timing or payment does not look like the rest. This is the worklist, not a report: every row names a filing reference staff can open in Localgov.',
  body:
    tabs(TABS_MAIN(EX_COUNT, '34'), 'Exceptions') + '\n' +
    ratePanel() + '\n' +
    '        <div style="display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:var(--sc-4); min-height:0;">\n' +
    panel({
      data: ' data-region="worklist" data-worklist="outstanding" data-count="' + OUTSTANDING_N + '" data-scored="true"',
      title: 'Outstanding', sub: '4 filings &middot; $11,521 &middot; aged from submission',
      body: table({
        cols: '108px 86px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 70px',
        head: ['Filing ref', 'Submitted', { t: 'Filed', right: true }, { t: 'Received', right: true }, { t: 'Outstanding', right: true }, { t: 'Age', right: true }],
        rows: [
          [M('JK19MN60'), M('05/16/26'), R('$4,180'), R('$0'), R('$4,180', CRIT), R('121d', CRIT)],
          [M('PQ73VW08'), M('06/15/26'), R('$3,902'), R('$0'), R('$3,902', CRIT), R('91d', CRIT)],
          [M('CD55EF12'), M('07/17/26'), R('$40,928'), R('$39,664'), R('$1,264', WARN), R('59d', WARN)],
          [M('XY31ZA77'), M('07/20/26'), R('$3,220'), R('$1,045'), R('$2,175', WARN), R('56d', WARN)],
        ],
      }),
    }) + '\n' +
    panel({
      data: ' data-region="worklist" data-worklist="late" data-count="' + LATE_N + '" data-scored="true"',
      title: 'Filed late', sub: '5 filings &middot; $4,280 penalty, $1,115 interest',
      body: table({
        cols: '108px 86px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
        head: ['Filing ref', 'Submitted', { t: 'Penalty', right: true }, { t: 'Interest', right: true }, { t: 'Allowance', right: true }],
        rows: [
          [M('JK19MN60'), M('05/16/26'), R('$1,420'), R('$402'), R('$0', Q)],
          [M('PQ73VW08'), M('06/15/26'), R('$1,180'), R('$318'), R('$0', Q)],
          [M('XY31ZA77'), M('07/20/26'), R('$842'), R('$201'), R('$0', Q)],
          [M('LM26NO44'), M('06/18/26'), R('$520'), R('$124'), R('$0', Q)],
          [M('TU62VX90'), M('07/19/26'), R('$318'), R('$70'), R('$0', Q)],
        ],
      }) +
      '\n            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3);">Lateness is inferred, not reported: the timely-filing allowance is absent and a penalty is present on each of these. The feed carries no late flag.</div>',
    }) + '\n        </div>\n' +
    panel({
      title: 'Who has not filed', sub: 'unavailable',
      body: emptyRegion({
        lock: true, k: 'No taxpayer identifier',
        h: 'This feed cannot tell you who is missing.',
        p: 'Every row identifies a filing. None identifies a filer, so there is no roster to compare a period against and no way to notice that someone who filed in June did not file in July. Delinquency is the most valuable thing a city asks of a tax feed and it is the one thing this endpoint does not support today.',
        b: 'Basis: FilingId and FilingRefId both key a filing. A taxpayer or account identifier would fill this region and nothing else would need to change.',
      }),
    }),
});

/* =======================  3. LODGING ECONOMY  ======================= */
const monthly = [
  { k: 'Aug', h: 74, dim: true }, { k: 'Sep', h: 68, dim: true }, { k: 'Oct', h: 88, dim: true },
  { k: 'Nov', h: 96, dim: true }, { k: 'Dec', h: 79, dim: true }, { k: 'Jan', h: 52, dim: true },
  { k: 'Feb', h: 61, dim: true }, { k: 'Mar', h: 112, dim: true }, { k: 'Apr', h: 124, dim: true },
  { k: 'May', h: 131 }, { k: 'Jun', h: 140 }, { k: 'Jul', h: 156 },
];

const lodging = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'Finance', crumb: 'Filings / Lodging economy',
  h: 1140, h1: 'Lodging economy', pageBadges: ['FIXTURE', 'TENANT PRIVATE'], foot: FOOT_LIVE,
  sub: 'Gross revenue reported on filings is not a tax figure. It is what visitors spent on lodging in Bastrop, which the city has had nowhere else to read.',
  body:
    agreement({
      tone: '--sc-info', wash: '--sc-info-wash', icon: ALERT,
      head: 'Reported lodging revenue is at a twelve-month high',
      sub: 'Twelve months of reported gross revenue, from the filings themselves rather than from a forecast.',
      basis: 'Localgov GrossRevenue as reported by filers, 12 months to July 2026 &middot; Year over year is withheld: it needs filings from mid-2025, earlier than this feed has been read. Figures are as filed and are not adjusted for amendments.',
      figureK: 'Q3 gross revenue', figure: '$18.94M', figureSub: 'highest of the 12 months read',
    }) + '\n' +
    tabs(TABS_MAIN(EX_COUNT, '34'), 'Lodging economy') + '\n' +
    '        <div style="display:grid; grid-template-columns:minmax(0,1.5fr) minmax(0,1fr); gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Reported gross revenue by month', sub: 'August 2025 to July 2026',
      body: bars(monthly, 'Current quarter in full tone. Bars are reported gross revenue, not tax.'),
    }) + '\n' +
    panel({
      title: 'What the filings say about the base', sub: 'Q3 FY26',
      body:
        '            <div style="display:flex; flex-direction:column; padding:var(--sc-1) 0;">\n' +
        [
          { k: 'Gross revenue reported', v: '$18,940,200', d: 'before exemptions' },
          { k: 'Exemptions claimed', v: '$612,400', d: '3.2% of gross' },
          { k: 'Taxable base', v: '$18,327,800', d: 'gross less exemptions' },
          { k: 'Tax due on that base', v: '$1,282,946', d: CITES['ordinance-rate'].verified ? cite('ordinance-rate', '7.00%') + ' on every filing period' : 'at ' + cite('ordinance-rate', '7.00%') + ', derived from a rate not yet sourced', tone: CITES['ordinance-rate'].verified ? OK : Q },
          { k: 'Timely-filing allowance', v: '$11,940', d: 'forgone for on-time filing' },
        ].map((x) =>
          '              <div style="display:flex; align-items:baseline; gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">\n' +
          '                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:1px;"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + x.k + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + x.d + '</span></div>\n' +
          '                <span style="font:400 17px/22px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(' + (x.tone || '--sc-ink') + ');">' + x.v + '</span>\n              </div>').join('\n') +
        '\n            </div>\n' +
        '            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3);">Rates and shares are computed only over fields Bastrop&#39;s form captures. A field the form does not capture arrives as zero and is excluded from every denominator rather than averaged in.</div>',
    }) + '\n        </div>\n' +
    panel({
      title: 'Against the fund', sub: cite('fund-108', 'fund 108') + ' &middot; OpenGov',
      body:
        '            <div style="display:flex; align-items:center; gap:var(--sc-6); padding:var(--sc-4) var(--sc-5);">\n' +
        '              <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
        '                <div style="height:10px; border-radius:var(--sc-r-full); background:var(--sc-surface-3); overflow:hidden;"><div style="width:74%; height:100%; background:var(--sc-accent);"></div></div>\n' +
        '                <div style="display:flex; justify-content:space-between; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><span>$3,914,600 booked to date</span><span>74% of $5,290,000 adopted</span></div>\n' +
        '              </div>\n' +
        '              <div style="flex:none; padding-left:var(--sc-5); border-left:1px solid var(--sc-line-faint); display:flex; flex-direction:column; gap:1px;">\n' +
        '                <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">Filed, not yet booked</span>\n' +
        '                <span style="font:400 22px/28px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">$14,981</span>\n' +
        '                <span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">filings land before the books close</span>\n              </div>\n            </div>\n' +
        '            <div style="padding:0 var(--sc-5) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 var(--sc-5) var(--sc-3);">Adopted budget and booked revenue are the city ledger. Filed-not-yet-booked is the Localgov side, and it is what makes this a leading indicator rather than a second view of the same closed month.</div>',
    }),
});

/* =======================  4. UNLABELLED — credentials live, tax type unconfirmed  ======================= */
const unlabelled = shell({
  theme: 'light', city: 'City of Bastrop', seal: 'BX', role: 'Finance', crumb: 'Filings',
  h: 1100, h1: 'Localgov filings', pageBadges: ['FIXTURE', 'UNLABELLED'], foot: FOOT_LIVE,
  sub: 'The feed is reading and the figures are real. The surface will not say which tax they are until the source says so.',
  body:
    agreement({
      tone: WARN, wash: '--sc-warn-wash', icon: ALERT,
      head: 'These filings are not labelled as hotel occupancy tax',
      sub: 'The filings endpoint returns no tax-type field, so nothing here can be attributed to a specific tax without asserting something the source did not say.',
      basis: 'Basis: the response carries FilingId, FilingRefId, SubmittedDate and ten amounts. There is no tax type on the row and no separate report per type. Reconciliation against ' + cite('fund-108', 'fund 108') + ' is suspended while the attribution is unconfirmed, because a match to that fund would be the assertion, not the evidence.',
      figureK: 'Received', figure: '$1,264,880', figureSub: 'tax unattributed',
    }) + '\n' +
    '        <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--sc-3);">\n' +
    [
      { k: 'Filed', read: true, v: '$1,276,401', field: 'TotalAmountDue', src: 'What filers reported owing &middot; Localgov' },
      { k: 'Received', read: true, v: '$1,264,880', field: 'AmountPaid', src: 'Tax received, excludes processing fees &middot; Localgov' },
      { k: 'Booked', read: false, tag: 'NOT READ', field: cite('fund-108', 'Fund 108 revenue'), src: 'Suspended: cannot match an unattributed figure to a named fund' },
    ].map(measure).join('\n') + '\n        </div>\n' +
    tabs([{ n: 'Filings', c: '34' }, { n: 'Exceptions', c: EX_COUNT, tone: CRIT }, { n: 'Reconciliation', c: 'held' }], 'Filings') + '\n' +
    panel({
      grow: true, title: 'All filings', sub: 'showing 6 of 34 &middot; Q3 FY26',
      body: table({
        cols: '112px 96px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
        head: ['Filing ref', 'Submitted', { t: 'Gross revenue', right: true }, { t: 'Exemptions', right: true }, { t: 'Tax due', right: true }, { t: 'Filed', right: true }, { t: 'Received', right: true }],
        rows: [
          [M('AB12CD34'), M('07/18/26'), R('$1,284,000'), R('$0'), R('$83,460'), R('$83,460'), R('$83,460')],
          [M('CD55EF12'), M('07/17/26'), R('$612,400'), R('$21,800'), R('$41,342'), R('$40,928'), R('$39,664')],
          [M('XY31ZA77'), M('07/20/26'), R('$31,100'), R('$0'), R('$2,177'), R('$3,220'), R('$1,045')],
          [M('TU62VX90'), M('07/19/26'), R('$28,400'), R('$1,200'), R('$1,904'), R('$2,292'), R('$2,292')],
          [M('GH88KL21'), M('06/20/26'), R('$402,800'), R('$61,200'), R('$28,196'), R('$27,914'), R('$27,914')],
          [M('LM26NO44'), M('06/18/26'), R('$74,600'), R('$0'), R('$5,222'), R('$5,866'), R('$5,866')],
        ],
      }) +
      '\n            <div style="padding:var(--sc-3) var(--sc-4); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:var(--sc-2) var(--sc-4) var(--sc-3); max-width:118ch;">Amounts, arithmetic checks and the exception worklist all work without knowing which tax this is. Only the label and the reconciliation wait.</div>',
    }),
});

/* =======================  5. EMPTY — no grant  ======================= */
const empty = shell({
  theme: 'dark', city: 'This city', seal: 'TC', role: 'Finance', crumb: 'Filings',
  h1: 'Filings', pageBadges: ['EMPTY'], lenses: LENSES_EMPTY,
  foot: '0 of 10 sources granted<br>this pack generates no records',
  sub: 'Tax filings submitted through a filings provider, reconciled against the city ledger.',
  body:
    '        <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--sc-3);">\n' +
    [
      { k: 'Filed', read: false, field: 'TotalAmountDue', src: 'No filings source granted' },
      { k: 'Received', read: false, field: 'AmountPaid', src: 'No filings source granted' },
      { k: 'Booked', read: false, field: 'Fund revenue', src: 'No ledger source granted' },
    ].map(measure).join('\n') + '\n        </div>\n' +
    tabs(TABS_MAIN('0', '0'), 'Reconciliation') + '\n' +
    panel({
      grow: true, title: 'By filing period', sub: 'no source connected',
      body: emptyRegion({
        k: 'Not read',
        h: 'No filings have been read for this city.',
        p: 'One filings grant fills this table, the three measures above it, the exception worklist and the lodging-revenue view beside them. A second grant on the city ledger turns the three measures into a reconciliation, which is the only part of this lens that needs both.',
        b: 'Basis: no filings adapter and no ledger adapter granted on this pack.',
      }),
    }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Exceptions.dc.html', import.meta.url), exceptions);
fs.writeFileSync(new URL('./Lodging.dc.html', import.meta.url), lodging);
fs.writeFileSync(new URL('./Unlabelled.dc.html', import.meta.url), unlabelled);
fs.writeFileSync(new URL('./Empty.dc.html', import.meta.url), empty);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Reconciled — the default view' },
    { file: 'Exceptions.dc.html', x: 1720, y: 0, w: 1600, h: 1300, title: 'Exceptions — the worklist' },
    { file: 'Lodging.dc.html', x: 3440, y: 0, w: 1600, h: 1140, title: 'Lodging economy' },
    { file: 'Unlabelled.dc.html', x: 0, y: 1480, w: 1600, h: 1100, title: 'Unlabelled — tax type unconfirmed' },
    { file: 'Empty.dc.html', x: 1720, y: 1480, w: 1600, h: 1040, title: 'Empty — no grant' },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -300, w: 620, text: 'Finance lens, Localgov filings.\nLayout, hierarchy and density only. Palette and type ramp are the frozen sc-kit, copied byte-identical from the Overview lens, and do not change.\nNO FIGURE ON ANY ARTBOARD IS MEASURED. The endpoint has never been called; there is no credential. Every number is fixture, and the FIXTURE badge stays on the page until a real read replaces it.' },
    { id: 'move', x: 700, y: -300, w: 700, text: 'STRUCTURAL MOVE: the headline is an AGREEMENT, not an amount.\nEvery finance dashboard opens with a big number. This one opens with whether two independently derived sources agree, and by how much, with both named. The amount is subordinate to its own trustworthiness.\nThat is the one thing we can build and a spreadsheet cannot: nobody else holds both Localgov and the ledger.' },
    { id: 'three', x: 1720, y: -300, w: 660, text: 'THREE AMOUNTS, NEVER ONE NUMBER.\nFiled is what the taxpayer reported owing. Received is what came in, excluding processing fees. Booked is what the ledger recorded. They are three different facts and each names its field and its system underneath.\nA single "revenue" tile is exactly how those three silently become one wrong figure.' },
    { id: 'excep', x: 2460, y: -300, w: 660, text: 'THE WORKLIST IS WHERE IT EARNS ITS KEEP.\nImplied rate is tax due over taxable revenue, compared against the rate in the city ordinance - a SECOND, independently derived source, not another field from the same payload. That is what makes it a real check rather than internal consistency.\nLateness is inferred from an absent timely-filing allowance beside a present penalty. The feed carries no late flag.' },
    { id: 'gap', x: 3440, y: -300, w: 640, text: 'THE GAP IS DRAWN, NOT OMITTED.\n"Who has not filed" is the most valuable thing a city wants from a tax feed, and this endpoint cannot answer it: every row keys a FILING, none keys a FILER.\nIt gets a region with a basis line rather than being left off the page, so the gap is countable instead of invisible. One answer from the vendor fills it and nothing else changes.' },
    { id: 'unlab', x: 0, y: 1190, w: 700, text: 'UNLABELLED IS A REAL STATE, NOT AN ERROR STATE.\nThe endpoint is called bastrop-filings and returns no tax-type field. Nothing in the vendor spec says hotel occupancy.\nSo the figures render, the arithmetic checks run, the worklist works - and the page declines to name the tax, and suspends the reconciliation, because matching an unattributed figure to fund 108 would be the assertion rather than the evidence. Degradation declared, not silent.' },
    { id: 'emptyn', x: 1720, y: 1190, w: 620, text: 'EMPTY KEEPS EVERY REGION AND ITS BASIS LINE.\nThe measures stay on the page reading "Not read", never 0, and the empty state says which single grant lights which regions.\nDark here only to show both themes hold; theme is a tweak on every artboard.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Exceptions, Lodging, Unlabelled, Empty .dc.html + canvas.json');
