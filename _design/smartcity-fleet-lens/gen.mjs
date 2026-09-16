/**
 * SmartCity OS - Fleet lens.
 *
 *   node gen.mjs      rewrites every artboard and canvas.json
 *   node check.mjs    the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * Every row, count, format and basis sentence comes from `source-state.json`,
 * which is the OUTPUT of the product's own composer, its own live mapper and its
 * own record-shape guard, run against smartcity-dashboards origin/main f776b4bf.
 * Re-dump it rather than editing it, then re-run this.
 *
 * ONE REGION, AND ITS GROUPING DIMENSION IS NOT A PARTITION OF CONDITION.
 * src/domains.mjs registers a single domain under lensId "fleet":
 * fleet-vehicles, region "Vehicle roster", gatedBy samsara. The domain states
 * its own brief:
 *
 *   "the reason this domain is one of the three exemplars is that it is SIMPLE
 *    and its shape shares almost nothing with the permit queue: a flat roster,
 *    no place, no due date, and one grouping dimension"
 *
 * Fire and EMS drew ITS second axis as small multiples, because its domain said
 * a rollup could not answer the station question. Fleet's dimension cannot
 * answer a condition question at all: operatorRef is assigned by
 * `1 + ((seq - 1) % OPERATOR_COUNT)` over a plan already ordered by severity, so
 * an operator-by-status cross tab reports the stride and not the fleet. It is
 * measured in source-state.json and it is NOT DRAWN, because a refused thing
 * drawn is still drawn. The dimension is drawn as coverage instead.
 *
 * A VEHICLE IS NOT AN ASSET, and it is drawn as a rule rather than an apology.
 * A DRIVER IS A PERSON, and the opaque reference is drawn as a working
 * dimension with its declared format on the page.
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* ------------------------------------------------- the design refuses to lie

   If the product changes under this design, the design is WRONG rather than
   merely stale, and it should stop rather than render. */

const FLEET_DOMAINS = S.vocab.registry.filter((d) => d.lensId === 'fleet');
if (FLEET_DOMAINS.length !== 1) {
  throw new Error('fleet now has ' + FLEET_DOMAINS.length + ' registered regions; re-derive this design');
}
const D = FLEET_DOMAINS[0];
if (D.id !== 'fleet-vehicles' || D.gatedBy !== 'samsara' || D.recordType !== 'fleet-vehicle') {
  throw new Error('the fleet region moved: ' + JSON.stringify(D));
}
const FLEET = S.demo;
if (FLEET.status !== 'ok' || FLEET.recordCount !== FLEET.records.length) {
  throw new Error('the demo composer no longer returns an ok roster');
}

/* ------------------------------------------------------------ primitives */

const ARROW = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/** Closed, and copied from web/index.html and web/app.js at f776b4bf. Nothing here invents a state word. */
const BADGE = {
  'Empty': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not built': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not read': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Preview': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'Demo records': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Live records': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'No records': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'No source': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'Mounted': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const pair = BADGE[t];
  if (!pair) throw new Error('badge word not in the shipped vocabulary: ' + t);
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:' + pair[0] + '; background:' + pair[1] + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const basisLine = (t, max) =>
  '<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:' + (max || 120) + 'ch;">' + t + '</span>';

/** The shipped nav, with the shipped badge on every entry except this lens. */
const SHIPPED_NAV = S.shipped.navBadges.map((n) => [n.label, n.badge]);

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (fleetBadge, foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', SHIPPED_NAV.map((r) => navRow(r[0], r[0] === 'Fleet' ? fleetBadge : r[1], r[0] === 'Fleet'))) + '\n' +
  navGroup('Work', [['Plan review', 'Preview'], ['Files', 'Preview'], ['Records search', 'Not built']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  navGroup('City', [['Assets', 'Empty'], ['Connections', ''], ['People and access', 'Not built']].map((r) => navRow(r[0], r[1], false))) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);">' + foot + '</div>\n      </nav>';

const topbar = (city, seal, env) =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">' + seal + '</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + city + '</div>\n' +
'      <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 6px;">' + env + '</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search vehicles, operators, records</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Fleet</span>\n      </div>\n    </header>';

const tile = (m) =>
'          <div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-1); min-width:0; box-shadow:var(--sc-e1);">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.k + '</div>\n' +
(m.unread
  ? '            <div style="font:620 15px/30px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">' + m.word + '</div>'
  : '            <div style="font:400 24px/30px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(' + (m.tone || '--sc-ink') + ');">' + m.v + '</div>') + '\n' +
'            <div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(' + (m.unread ? '--sc-ink-3' : '--sc-accent') + ');">\n' +
'              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + m.n + '</span>' + (m.unread ? '' : ARROW) + '\n            </div>\n          </div>';

const tiles = (items) =>
'        <div style="display:grid; grid-template-columns:repeat(' + items.length + ', minmax(0,1fr)); gap:var(--sc-3);">\n' + items.map(tile).join('\n') + '\n        </div>';

/**
 * The region strip carries ONE item on this lens, and it is drawn at one rather
 * than hidden, for the reason the Fire and EMS lens states: a strip that
 * disappears at one entry makes "this lens has one region" indistinguishable
 * from "this lens has regions we are not showing you".
 */
const regionStrip = (items, active, note) =>
'        <div style="display:flex; align-items:center; gap:var(--sc-5); border-bottom:1px solid var(--sc-line); padding:0 var(--sc-1);">\n' +
items.map((t) => {
  const on = t.n === active;
  return '          <div style="display:flex; align-items:center; gap:7px; padding:var(--sc-2) 0 10px; box-shadow:' + (on ? 'inset 0 -2px 0 var(--sc-accent)' : 'none') + ';">' +
    '<span style="font:' + (on ? '620' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + t.n + '</span>' +
    '<span style="font:400 12px/16px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink-3);">' + t.c + '</span>' +
    (t.b ? badge(t.b) : '') + '</div>';
}).join('\n') + '\n' +
'          <div style="flex:1;"></div>\n' +
'          <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); padding-bottom:10px;">' + note + '</span>\n' +
'        </div>';

const panelHead = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:38px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink); white-space:nowrap;">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + o.sub + '</span>\n' +
(o.demo
  ? '            ' + badge('Demo records') + '\n            <span style="flex:none; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);"><b style="font-weight:600; color:var(--sc-ink-2);">Generated fixture</b> <span style="color:var(--sc-line-strong);">|</span> ' + o.contract + '</span>\n'
  : (o.chip ? '            ' + badge(o.chip) + '\n' : '')) +
'            <div style="flex:1;"></div>\n' +
(o.right ? '            <span style="flex:none; font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.right + '</span>\n' : '') +
'          </div>';

const panel = (o, body) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
panelHead(o) + '\n' + body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">' + basisLine(o.basis, o.basisWidth) + '</div>\n' : '') +
'        </section>';

const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:5px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  if (c && c.chip) return '              <span style="justify-self:start; font:500 12px/16px var(--sc-font-ui); color:' + c.c + '; background:' + c.w + '; border-radius:var(--sc-r-full); padding:2px 8px; white-space:nowrap;">' + c.t + '</span>';
  const mono = i === 0 || (c && c.mono);
  const quiet = c && c.quiet;
  const txt = (c && c.t !== undefined) ? c.t : c;
  return '              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (quiet ? '--sc-ink-3' : (i === 0 ? '--sc-ink' : '--sc-ink-2')) + ');">' + txt + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

/**
 * THE FOUR FACT CARD, the component the Public works lane produced. A region
 * that cannot show data, or a rule that a page has to carry, states FOUR things
 * and never fewer: what state it is in, the basis VERBATIM from whatever
 * produced it, what KIND of thing would move it, and when that was last read.
 * "Not read" on its own is the sentence that made every blocked region on this
 * product look alike.
 */
const fourFact = (o) =>
'          <div style="display:flex; flex-direction:column; gap:var(--sc-3); padding:var(--sc-4);">\n' +
(o.region
  ? '            <div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;">\n' +
    '              <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.region + '</span>\n' +
    '              <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.domainId + ' &middot; gatedBy ' + o.kind + '</span>\n' +
    '              <div style="flex:1;"></div>\n' +
    '              <span style="font:500 12px/16px var(--sc-font-data); color:var(' + o.tone + '); background:var(' + o.wash + '); border-radius:var(--sc-r-control); padding:1px 6px;">' + o.state + '</span>\n            </div>\n'
  : '') +
'            <div style="display:grid; grid-template-columns:' + (o.labelWidth || 116) + 'px minmax(0,1fr); gap:var(--sc-2) var(--sc-3); align-items:start;">\n' +
o.facts.map((f) =>
'              <span style="font:500 12px/18px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">' + f[0] + '</span>\n' +
'              <span style="font:400 13px/18px ' + (f[2] ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (f[2] ? '--sc-ink' : '--sc-ink-2') + ');">' + f[1] + '</span>').join('\n') + '\n' +
'            </div>\n' +
(o.basis ? '            ' + basisLine(o.basis, o.basisWidth || 112) + '\n' : '') +
'          </div>';

/**
 * A wrapping three column matrix. The roster table ellipsises, which is correct
 * for records and wrong for sentences, so a panel whose cells are sentences gets
 * its own primitive rather than a widened one.
 */
const matrix = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:6px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:start;">\n' +
r.map((c, i) =>
'              <span style="min-width:0; font:400 13px/18px ' + ((c && c.mono) || i === 0 ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + ((c && c.tone) || (i === 0 ? '--sc-ink' : '--sc-ink-2')) + ');">' + ((c && c.t !== undefined) ? c.t : c) + '</span>').join('\n') + '\n' +
'            </div>').join('\n') + '\n          </div>';

const prose = (paras) =>
'          <div style="padding:var(--sc-3) var(--sc-4) var(--sc-2); display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
paras.map((p) => '            <p style="margin:0; font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">' + p + '</p>').join('\n') + '\n          </div>';

/**
 * THE PROVENANCE FOOT, and it is not decoration.
 *
 * Every board names, in the product's own codes, which region it draws: the
 * domain id, the vendor kind that gates it, the record type and the pack. It
 * also gives check.mjs real inputs to compare against the registry. A canvas
 * that renders only display forms gives a check nothing to check.
 */
const provFoot = (items, pack) =>
'      <div style="flex:none; display:flex; align-items:center; gap:var(--sc-5); flex-wrap:wrap; padding-top:var(--sc-1); border-top:1px solid var(--sc-line-faint);">\n' +
items.map((i) =>
'        <span style="font:400 11px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + i.domainId + ' &middot; gatedBy ' + i.kind + ' &middot; ' + i.recordType + '</span>').join('\n') + '\n' +
'        <div style="flex:1;"></div>\n' +
'        <span style="font:400 11px/16px var(--sc-font-data); color:var(--sc-ink-3);">pack ' + pack + ' &middot; read at smartcity-dashboards f776b4bf</span>\n' +
'      </div>';

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal, o.env) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.fleetBadge, o.foot) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-3) var(--sc-6) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Fleet</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">Fleet</h1>' + badge(o.pageBadge) + '<div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
'        <p style="margin:0; max-width:124ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
tiles(o.tiles) + '\n' +
regionStrip(o.regions, o.activeRegion, o.regionNote) + '\n' +
o.body + '\n' +
provFoot(o.prov, o.pack) + '\n' +
'    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'dark') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'dark') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ========================================================== the data reads */

const BANDS = S.axis.VEHICLE_STATUS_VALUES;
const bandLabel = (id) => BANDS.find((b) => b.id === id).label;
const BAND_TONE = {
  'out-of-service': '--sc-crit', 'inspection-due': '--sc-warn',
  'in-shop': '--sc-info', 'in-service': '--sc-ok',
};
const CHIP = {
  'out-of-service': ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'inspection-due': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'in-shop': ['var(--sc-info)', 'var(--sc-info-wash)'],
  /**
   * A RESOLVED STATUS RENDERS QUIET, and that is the product's rule rather than
   * a preference here: statusLabelsFor in web/app.js reads the resolved flag and
   * quiets the band. On a roster where eight of fourteen vehicles are in service,
   * eight coloured pills are the loudest thing on the page and they are the rows
   * that need nobody.
   */
  'in-service': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
};
const chip = (id) => ({ chip: true, t: bandLabel(id), c: CHIP[id][0], w: CHIP[id][1] });

/** Read off the registry rather than typed, so a rename in the product breaks the board. */
const PROV = FLEET_DOMAINS.map((d) => ({ domainId: d.id, kind: d.gatedBy, recordType: d.recordType }));

const FOOT_DEMO = 'template-city &middot; demo pack<br>1 registered region on this lens<br>badges outside this lens are the shipped values at f776b4bf';
const FOOT_LIVE = 'bastrop_tx &middot; staging pack<br>samsara granted, and answering<br>badges outside this lens are the shipped values at f776b4bf';

/* -------------------------------------------- the roster, whole and in order

   All fourteen, in the composer's own order, and no pager. The whole roster is
   on the page for the same reason the Fire and EMS lens gives: a readiness
   screen showing the first ten of fourteen is worse than no roster, because the
   four a reader cannot see are exactly the four somebody is looking for. That is
   a property of the fixture size, not a rule for every pack.

   SIX COLUMNS, NOT THE SHIPPED EIGHT, AND IT IS A PROPOSAL RATHER THAN A CUT.
   web/index.html ships Vehicle, Unit, Status, Operator, Odometer, DVIR,
   Safety (7d) and Flags, and web/app.js fills the last three from
   dvirUnresolvedDefects, safetyEvents7d and highMileage/lowFuel - every one of
   them a field only mapRealFleetVehicleRecord produces. On a generated pack all
   three render blank through td()'s null-is-blank, on every row. Three blank
   columns on a customer's own screen read as missing data about that customer's
   fleet. They are collapsed into ONE declared column here, which keeps the cell
   countable rather than invisible, and the basis names the three it stands for. */

/**
 * The declared format, said in words rather than printed as a regex literal.
 *
 * The literal is /^OPR-\d{2}$/ and it ENDS IN A CURRENCY SYMBOL, which the
 * product's money gate refuses anywhere on a surface and which a city reader
 * sees before they parse the syntax. So the sentence is DERIVED from the
 * literal rather than written beside it, and it FAILS CLOSED: a format this
 * function cannot parse stops the generator instead of falling back to the raw
 * regex or to a hand-typed description that could drift from it.
 */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
function formatInWords(literal) {
  const m = /^\/\^([A-Za-z-]+)\\d\{(\d+)\}\$\/$/.exec(literal);
  if (!m) throw new Error('cannot derive a words form for the declared format ' + literal);
  const n = Number(m[2]);
  if (!WORDS[n]) throw new Error('no word for a ' + n + ' digit format');
  return m[1] + ' followed by exactly ' + WORDS[n] + ' digits';
}
const OPR_IN_WORDS = formatInWords(S.axis.formats.OPERATOR_REF_FORMAT);

const FEED_ONLY = ['DVIR', 'Safety (7d)', 'Flags'];
const FEED_ONLY_FIELDS = ['dvirUnresolvedDefects', 'safetyEvents7d', 'highMileage', 'lowFuel'];

const rosterRows = FLEET.records.map((r) => [
  r.recordId,
  r.unitLabel,
  chip(r.status),
  { t: r.operatorRef, mono: true },
  r.odometerBand,
  { t: 'Not carried', quiet: true },
]);

const operatorRows = FLEET.extras.operators.map((o) => [
  { t: o.operatorRef, mono: true },
  String(o.vehicleCount),
]);

/** Two numbers that must agree, by two routes. */
const tileSum = FLEET.extras.metrics.reduce((n, m) => n + m.count, 0);
const operatorSum = FLEET.extras.operators.reduce((n, o) => n + o.vehicleCount, 0);
if (tileSum !== FLEET.recordCount || operatorSum !== FLEET.recordCount) {
  throw new Error('the two routes to the roster total disagree: tiles ' + tileSum + ', operators ' + operatorSum + ', roster ' + FLEET.recordCount);
}

/** The stride, measured rather than asserted, and deliberately NOT drawn. */
const stride = S.axis.crossTab.map((c) => c.operatorRef + ' ' + c.notInService + ' of ' + c.vehicles).join(', ');

/* ---------------------------------------------------------------- board 1 */

const main = artboard({
  city: 'Template city', seal: 'TC', env: 'DEMO', theme: 'dark',
  fleetBadge: 'Demo records', pageBadge: 'Demo records', foot: FOOT_DEMO,
  prov: PROV, pack: 'template-city',
  pageRule: FLEET.countingRule,
  lede: 'Vehicles and the operators they group under. A vehicle on a telemetry contract is a fleet record and never a city-owned asset record. A flat roster with one grouping dimension: no place, no due date, no queue position.',
  tiles: [
    ...BANDS.map((b) => ({
      k: b.label,
      v: FLEET.extras.metrics.find((m) => m.id === b.id).count,
      tone: BAND_TONE[b.id],
      n: 'of ' + FLEET.recordCount + ' vehicles',
    })),
    { k: 'Operators', v: FLEET.extras.operators.length, n: 'opaque, never a person' },
    { k: 'Driver name', unread: true, word: 'Not carried', n: 'no person on this record' },
  ],
  regions: [{ n: 'Vehicle roster', c: FLEET.recordCount + ' vehicles', b: 'Demo records' }],
  activeRegion: 'Vehicle roster',
  regionNote: '1 registered region on this lens. Public works carries 2. Parks carries 0.',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column;">\n' +
panel({
  grow: true, title: 'Vehicle roster', sub: D.id,
  demo: true, contract: 'Telemetry output contract',
  basis: 'All ' + FLEET.recordCount + ' of ' + FLEET.recordCount + ' on the page, sorted by severity then record id, with no pager: a partial roster is worse than none. Feed only stands for the three shipped columns ' + FEED_ONLY.join(', ') + ', which only a granted feed can fill. Basis: ' + FLEET.basis + '. Counting rule: ' + FLEET.countingRule + '.',
  basisWidth: 124,
}, table({
  cols: '90px minmax(0,1fr) 104px 68px 120px 92px',
  head: ['Vehicle', 'Unit', 'Status', 'Operator', 'Odometer', 'Feed only'],
  rows: rosterRows,
})) + '\n' +
'          </div>\n' +
'          <div style="width:556px; flex:none; display:flex; flex-direction:column; gap:var(--sc-2); min-height:0;">\n' +
panel({
  title: 'Operators', sub: '', right: 'declared format: ' + OPR_IN_WORDS,
  basis: 'The stride, measured and not drawn: ' + stride + '. Basis: ' + S.axis.bases.OPERATOR_BASIS + '. Counting rule: ' + S.axis.bases.DRIVER_COUNTING_RULE + '.',
  basisWidth: 80,
}, table({
  cols: '96px minmax(0,1fr)',
  head: ['Operator', 'Vehicles'],
  rows: operatorRows,
}) + '\n' + prose([
  'The one grouping dimension. There is no operator by condition breakdown: the reference is a modulo over a severity-ordered plan.',
])) + '\n' +
panel({
  title: 'A vehicle is not an asset', sub: 'the standing example',
  basis: 'Basis: ' + S.axis.bases.NOT_AN_ASSET_BASIS + '.',
  basisWidth: 80,
}, fourFact({
  labelWidth: 108,
  facts: [
    ['What it is', 'A vendor telemetry record on a files-writing kind. The catalogue: Not Asset Management Tier 1 nodes.'],
    ['What it is not', 'A city-owned inventory node. Nothing here counts toward the inventory, and City / Assets stays at zero.'],
    ['Why it holds', 'This is the standing example of the thing that looks like it should fill an inventory and must not.'],
    ['What would move it', 'A ruling, not a build. An inventory node has its own lifecycle; a telemetry row is a reading of a machine.'],
  ],
})) + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 2 */

/**
 * A RENDERED EXPRESSION MAY NOT CARRY A CURRENCY SYMBOL, and one of these does.
 * The live mapper builds unitLabel with a template literal, whose ${...} syntax
 * puts a currency symbol on the page; the product's own money gate refuses that
 * anywhere on a surface, and a reader scanning a city screen sees the symbol
 * before they parse the syntax. The expression is shown as the equivalent
 * concatenation, the rewrite is stated on the board, and source-state.json keeps
 * the exact source text.
 */
const safeExpr = (e) => e.split('`${row.make} ${row.model}`').join('row.make + " " + row.model');

/**
 * THE CLAIM THIS PARAGRAPH REPLACED WAS WRONG, and it is worth the comment.
 * The first draft said Fleet was the only one of the four mappers that falls to
 * three sentinels on one record. That was read off Fleet's mapper and assumed
 * about the others. Running all five says otherwise: every exported mapper
 * invents exactly three strings on an empty row, and two of them share the
 * literal "Unnamed unit", so the collision crosses lenses as well as rows. The
 * finding is systemic rather than local, which makes it a bigger finding than
 * the one that was claimed.
 */
const PEER_MEASURED = S.live.peerTriples.filter((t) => t.exported);
const PEER_TRIPLE_SENTENCE = PEER_MEASURED.length + ' of ' + S.live.peerTriples.length +
  ' are exported and each invents exactly ' +
  [...new Set(PEER_MEASURED.map((t) => t.inventedCount))].join(' or ') +
  '; samsara and spireon share "Unnamed unit", so it crosses lenses.';

const SENTINELS = S.live.sentinels;
const GUARD = S.live.guard;

const connected = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  fleetBadge: 'Not read', pageBadge: 'Not read', foot: FOOT_LIVE,
  prov: PROV, pack: 'bastrop_tx',
  pageRule: '0 of 1 region sourced; a region is sourced when its kind is granted on this pack and it returned records',
  lede: 'Samsara is granted on this pack and, on the one reading in the repository, it answers. This is the first lens in this wave whose vendor returns data, so the question stops being whether the page fills and becomes what the page still says once it has.',
  tiles: [
    { k: 'Status bands', unread: true, word: 'Not read', n: 'rebuilt from the payload' },
    { k: 'Vehicles', unread: true, word: 'Not read', n: 'no live read by this design' },
    { k: 'Operators', unread: true, word: 'Not carried', n: 'no operator reference on it' },
    { k: 'Inventory position', unread: true, word: 'Not carried', n: 'no inventory basis on it' },
    { k: 'Driver name', unread: true, word: 'Not carried', n: 'operator null, with no basis' },
  ],
  regions: [{ n: 'Vehicle roster', c: 'granted', b: 'Not read' }],
  activeRegion: 'Vehicle roster',
  regionNote: '1 registered region on this lens. Public works carries 2. Parks carries 0.',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-3);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-2);">\n' +
panel({
  title: 'The one vendor that answers', sub: D.id + ' &middot; gatedBy ' + D.gatedBy, chip: 'Not read',
  right: 'reading recorded, not re-read',
  basis: 'Basis: the seam answers ' + JSON.stringify(S.staging.basis) + ' here and the server branches to the live composer (REAL_LIVE_DOMAINS). A board may render a recorded reading badged with its date; never as a current one.',
  basisWidth: 122,
}, fourFact({
  facts: [
    ['Obstacle', 'None recorded. ' + S.live.vendorsAnswering.join(', ') + ' return real data; the other two feeds are held.'],
    ['Last read', '2026-09-03, recorded in the src/vendor-live.mjs header. Not re-read, and no credential was used by this lane.', true],
    ['Records', 'Unread. A count belongs to a live read, never to a canvas.', true],
    ['The values', 'Unestablished. The reading records that Samsara answers and records none of the values it returned, so the real status set is unknown and is not drawn.', true],
    ['The tiles', 'Already built for it, and this is where Fleet is ahead of its neighbours: renderRegionMetrics branches on extras.realStatusCounts, renderRealStatusTiles rebuilds the strip one tile per real value, and statusCell renders an unmapped vendor value quiet.'],
  ],
})) + '\n' +
panel({
  title: 'Three things change at the cutover', sub: 'two are defects and one is correct',
  basis: 'Basis: ' + S.live.liveExtrasBasis + ', and renderFleet overwrites those two sentences only when extras.inventoryBasis and extras.operators[0] exist. An absence wearing a sentence that says something else.',
  basisWidth: 122,
}, matrix({
  cols: 'minmax(0,0.8fr) minmax(0,0.75fr) minmax(0,1.5fr)',
  head: ['The generated record carries', 'The live record carries', 'And the page then shows'],
  rows: [
    [
      'operatorRef + operatorBasis',
      { t: 'operator: null, no basis', tone: '--sc-crit' },
      'zero rows in Operators, under a page still saying ' + JSON.stringify(S.shipped.defaultSentences.operatorBasis),
    ],
    [
      'inventoryBasis',
      { t: 'nothing', tone: '--sc-crit' },
      'a page still saying ' + JSON.stringify(S.shipped.defaultSentences.inventory) + ', about a rule that was never a reading',
    ],
    [
      'fixture true + fixtureBasis',
      { t: 'origin feed', tone: '--sc-ok' },
      'correct. The demo badge and the fixture chip come off, and this is the one difference that is not a defect',
    ],
  ],
})) + '\n' +
'          </div>\n' +
'          <div style="width:472px; flex:none; display:flex; flex-direction:column; gap:var(--sc-2); min-height:0;">\n' +
panel({
  title: 'Three sentinels, one record', sub: 'and every peer mapper does the same',
  basis: 'Unidentifiable vehicles all fall to one recordId and collide; an id-presence check passes on every one. MEASURED by running every live mapper on an empty row: ' + PEER_TRIPLE_SENTENCE + ' unitLabel is a concatenation here: its template form carries a symbol the money gate refuses.',
  basisWidth: 72,
}, matrix({
  cols: '108px minmax(0,1fr)',
  head: ['Field', 'Falls back to'],
  rows: SENTINELS.map((s) => [s.field, { t: JSON.stringify(s.value) + '<span style="color:var(--sc-ink-3);"> &nbsp; ' + safeExpr(s.expression) + '</span>', mono: true, tone: '--sc-crit' }]),
})) + '\n' +
panel({
  title: 'The shape guard never runs here', sub: '', right: 'REFUSED when run by hand',
  basis: 'assertRecordShape runs inside composeDomain; nothing in vendor-live.mjs calls it. Only the status fault is declared.',
  basisWidth: 72,
}, matrix({
  cols: '124px minmax(0,1fr)',
  head: ['Field', 'Fault against the declared shape'],
  /**
   * Faults GROUPED by their fault text rather than listed one per field. Two of
   * the three carry the identical sentence, and printing it twice spends four
   * lines saying one thing. The grouping is derived from the guard output, not
   * typed, so a fault whose text changes splits itself back out.
   */
  rows: [...GUARD.faults.reduce((m, f) => m.set(f.fault, [...(m.get(f.fault) || []), f.field]), new Map())]
    .map(([fault, fields]) => [fields.join(', '), { t: fault, tone: '--sc-crit' }]).concat([
    ['undeclared', { t: GUARD.undeclaredOnLive.length + ' fields the shape does not declare, among them vin, make, model and odometerMiles: an inventory field set arriving on the cutover that drops the sentence saying this is not one', tone: '--sc-warn' }],
  ]),
})) + '\n' +
'          </div>\n        </div>',
});

/* --------------------------------------------------------------- emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Connected.dc.html', import.meta.url), connected);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'The roster - a flat register and one grouping dimension' },
    { file: 'Connected.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'The live pack - the vendor answers, and three refusals do not survive' },
  ],
  annotations: [
    { id: 'not-a-queue', x: 0, y: -320, w: 700, text: 'THE ONE LENS THAT IS NOT A QUEUE, AND IT IS DRAWN AS ONE ROSTER.\nThe domain states its own brief: "the reason this domain is one of the three exemplars is that it is SIMPLE and its shape shares almost nothing with the permit queue: a flat roster, no place, no due date, and one grouping dimension".\nSo no stage, no due column, no age, no assignment. A design that dressed this as a work queue would misrepresent the domain and waste the one lens that proves the seam generalises beyond case-shaped records.\nFourteen of fourteen on the page, in the composer order, with no pager. That is a property of the fixture size and the design says so rather than pretending the small case generalises.' },
    { id: 'dimension', x: 760, y: -320, w: 700, text: 'THE GROUPING DIMENSION CANNOT ANSWER A CONDITION QUESTION, SO IT IS NOT ASKED ONE.\nFire and EMS drew its second axis as small multiples because its domain said a rollup could not answer the station question. Fleet is the opposite case and copying that shape would have been the mistake.\nThe operator reference is assigned by 1 + ((seq - 1) modulo 4) over a plan already ordered by severity. A cross tab of operator against condition therefore reports the stride: OPR-01 and OPR-02 carry 2 of 4 not in service, OPR-03 and OPR-04 carry 1 of 3, tracking the 4/4/3/3 vehicle split exactly.\nIt is measured in source-state.json and NOT DRAWN. A refused thing drawn is still drawn, and a reader takes the picture rather than the caption.' },
    { id: 'nobody', x: 1500, y: -320, w: 640, text: 'A DRIVER IS A PERSON, AND THE DIMENSION STILL WORKS.\nThe record carries operatorBasis: "a generated record names no person; the operator is an opaque reference and a granted feed is where a name would come from".\nThe declared format OPR-NN is on the page, in the panel head, so the reference reads as a contract rather than as a redaction. The absence is written positively on the record instead of being left as a missing field.\nPolice carries the identical constraint for patrol vehicles. Both domains declare the same format and the same basis string INDEPENDENTLY, so the two lenses share one namespace and nothing in the product says whether OPR-01 on Fleet and OPR-01 on Police are one person. Raised in the folder README; not settled by this design.' },
    { id: 'columns', x: 0, y: 1120, w: 700, text: 'THREE SHIPPED COLUMNS CAN ONLY FILL FROM A GRANTED FEED.\nweb/index.html ships eight columns and web/app.js fills DVIR, Safety (7d) and Flags from dvirUnresolvedDefects, safetyEvents7d and highMileage/lowFuel. Every one of those is produced by the live mapper alone, so on a generated pack all three render blank on every row through the renderer null-is-blank path.\nThree blank columns on a city own screen read as missing data about that city fleet. They are collapsed into one declared column here, which keeps the cell countable rather than invisible, and the basis names the three it stands for.\nThis is a design PROPOSAL against the shipped table, stated as one.' },
    { id: 'connected', x: 1720, y: -320, w: 720, text: 'THE FIRST LENS IN THIS WAVE THAT CAN BE DRAWN CONNECTED, AND THAT CHANGES THE QUESTION.\nPublic works, Parks and Fire and EMS were all drawn at some distance from data: a consent, a source that does not exist, an entitlement. Samsara answers, on the reading recorded 2026-09-03.\nSo the board is not about whether the page fills. It is about what the page still says once it has, and the answer is worse than a blocked region: the tile strip is already built to rebuild itself from the payload, and three refusals the generated record carries are simply absent from the live one.\nNo live read was performed and no credential was used. Every live-path fact here is a property of the code at f776b4bf, not of a reading.' },
    { id: 'refusals', x: 2500, y: -320, w: 720, text: 'THE REFUSALS DO NOT SURVIVE THE CUTOVER, AND THE PAGE SAYS SOMETHING FALSE ABOUT IT.\noperatorRef, operatorBasis and inventoryBasis are all generated-only. The live composer returns extras { realStatusCounts } and nothing else, and renderFleet only overwrites the two basis sentences when the extras that carry them exist.\nSo on a granted feed the Operators table renders zero rows under a page that says "The operator dimension has not been read for this pack", about a region that WAS read. The inventory sentence does the same about a product rule that was never a reading.\nThe third row is the control: the fixture mark correctly disappears. Not every difference is a defect, and a panel where every row is a defect is a panel a refuse-everything rewrite would also pass.' },
    { id: 'guard', x: 3280, y: -320, w: 700, text: 'A MECHANISM THAT EXISTS, IS CORRECT, AND IS NEVER CALLED.\nassertRecordShape runs inside composeDomain over every generated record. Nothing in src/vendor-live.mjs calls it, so the declared samsara shape has never been run against a real samsara record.\nRun by hand it REFUSES, with three faults and twelve undeclared fields. One fault is a declared position: the module header rules that real status is kept as-is and never force-mapped. The other two, operatorRef and odometerBand required and absent, are declared nowhere, and the shape table own preamble claims a fixture and a real record are the same shape.\nAmong the twelve undeclared fields are vin, make, model and odometerMiles. The field set of an inventory arrives on the same cutover that drops the one sentence saying this is not one.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Connected + canvas.json');
console.log('  roster: ' + FLEET.recordCount + ' of ' + FLEET.recordCount + ' records rendered, ' + FLEET.extras.operators.length + ' operators');
console.log('  two routes to the total agree: tiles ' + tileSum + ', operators ' + operatorSum + ', roster ' + FLEET.recordCount);
console.log('  stride (measured, not drawn): ' + stride);
console.log('  guard verdict on the live record: ' + GUARD.verdictPopulatedRow);
