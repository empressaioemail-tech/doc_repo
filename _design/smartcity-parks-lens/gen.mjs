/**
 * SmartCity OS — Parks lens.
 *
 *   node gen.mjs      rewrites every artboard and canvas.json
 *   node check.mjs    the adversarial read, as a file
 *
 * THE SOURCE IS THIS FILE, NOT THE ARTBOARD. Never hand-edit a .dc.html here.
 *
 * THIS IS THE ONE LENS IN THE PRODUCT THAT DOES NOT EXIST, AND DRAWING THAT IS
 * THE WHOLE DESIGN. src/domains.mjs states the rule in its own comment:
 *
 *   "WHAT ABSENCE FROM THIS LIST MEANS, and it is the only surviving meaning of
 *    the words 'not built': the surface does not exist yet. Everything in the
 *    list is built, and its emptiness on a given pack is a statement about
 *    SOURCES with a basis attached. Those are different sentences to a customer
 *    and this list is the line between them."
 *
 * and, of Parks specifically:
 *
 *   "Parks facilities and Court docket have no vendor at all — the build sheet
 *    records both as 'gates: none yet'. There is no vendorless path through
 *    this seam, so neither lens is registered here and neither is faked with an
 *    invented kind."
 *
 * So Parks gets NONE of the built-surface vocabulary. No metric tiles reading
 * "Not read". No region strip with an empty state inside it. No table header
 * with no rows under it. Every one of those is the sentence a BUILT region
 * prints when it has no source, and a city reading it on Parks would go looking
 * for a grant that no vendor exists to give.
 *
 * check.mjs enforces exactly that: the built-surface vocabulary must be ABSENT
 * from the Parks page body on Main and PRESENT on Difference, where it is
 * attributed to the other lens and drawn beside the Parks sentence for contrast.
 * Neither half of that can be satisfied by a sentinel.
 */
import fs from 'node:fs';

const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const S = JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));

/* ------------------------------------------------------------ primitives */

const BADGE = {
  'Empty': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not built': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Not read': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'Preview': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'Not connected': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
};
const badge = (t) => {
  if (!t) return '';
  const [c, w] = BADGE[t];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const basisLine = (t, max) =>
  '<span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:' + (max || 120) + 'ch;">' + t + '</span>';

const SHIPPED_NAV = [
  ['Overview', 'Empty'], ['Development services', 'Empty'], ['Finance', 'Empty'],
  ['Citizen', 'Preview'], ['Public works', 'Not read'], ['Parks', 'Not built'],
  ['Police', 'Not read'], ['Fire and EMS', 'Not read'], ['Fleet', 'Not read'],
];

const navRow = (n, b, on) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + '); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' + badge(b) + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' +
  rows.join('\n') + '\n        </div>';

const nav = (foot) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('Lenses', SHIPPED_NAV.map(([n, b]) => navRow(n, b, n === 'Parks'))) + '\n' +
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
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search records, parcels, cases</div>\n' +
'      <div style="display:flex; flex-direction:column; padding:0 var(--sc-3); border-left:1px solid var(--sc-line);">\n' +
'        <span style="font:620 14px/18px var(--sc-font-ui); color:var(--sc-ink);">Compass</span>\n' +
'        <span style="font:400 12px/15px var(--sc-font-data); color:var(--sc-ink-3);">' + city + ' &middot; Parks</span>\n      </div>\n    </header>';

const panelHead = (o) =>
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink); white-space:nowrap;">' + o.title + '</span>\n' +
'            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' +
(o.chip ? '            ' + badge(o.chip) + '\n' : '') +
'            <div style="flex:1;"></div>\n' +
(o.right ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.right + '</span>\n' : '') +
'          </div>';

const panel = (o, body) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
panelHead(o) + '\n' + body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);">' + basisLine(o.basis, o.basisWidth) + '</div>\n' : '') +
'        </section>';

const rows = (items, cols) =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
items.map((r, i) =>
'            <div style="display:grid; grid-template-columns:' + cols + '; gap:var(--sc-3); padding:6px var(--sc-4); align-items:baseline; ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
r.map((c, j) => '<span style="min-width:0; font:400 13px/18px ' + (c && c.mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + ((c && c.tone) || (j === 0 ? '--sc-ink' : '--sc-ink-2')) + ');">' + ((c && c.t !== undefined) ? c.t : c) + '</span>').join('') +
'</div>').join('\n') + '\n          </div>';


/**
 * The roster panel has its own component rather than the generic row helper,
 * because check.mjs has to read the counts back and compare them to the
 * registry. data-roster-region carries "<lensId>:<regions>" so the comparison is
 * structural rather than a guess at which number on the page belongs to which
 * row. A count nobody can read back is a count nobody checks.
 */
const rosterPanel = (items) =>
'          <div style="display:flex; flex-direction:column; padding:var(--sc-2) 0 var(--sc-3);">\n' +
items.map((r, i) =>
'            <div data-roster-region="' + r.id + ':' + r.regions + '" style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) 28px; gap:var(--sc-3); padding:8px var(--sc-4); align-items:baseline; ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
  '<span style="font:400 13px/18px var(--sc-font-data); color:var(' + (r.regions === 0 ? '--sc-crit' : '--sc-ink') + ');">' + r.id + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-data); color:var(--sc-ink-2);">' + (r.regions === 0 ? 'no region, no vendor' : r.kinds.join(', ')) + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-data); color:var(' + (r.regions === 0 ? '--sc-crit' : '--sc-ink') + ');">' + r.regions + '</span>' +
'</div>').join('\n') + '\n          </div>';

/**
 * The page shell.
 *
 * `data-lens-body="parks"` is not decoration. check.mjs scopes its read to the
 * content between that attribute and the closing main tag, so the nav’s own
 * "Not read" badges on Police, Fire and EMS and Fleet, which are correct and
 * belong there, do not satisfy or violate a rule about the PARKS page. A check
 * that scanned the whole document would pass on the wrong evidence.
 */
function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar(o.city, o.seal, o.env) + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.foot) + '\n' +
'    <main data-lens-body="parks" style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.city + ' / Parks</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + badge(o.pageBadge) + '<div style="flex:1;"></div><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.pageRule + '</span></div>\n' +
'        <p style="margin:0; max-width:100ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
o.body + '\n' +
'    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"' + (o.theme || 'dark') + '"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "' + (o.theme || 'dark') + '") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ========================================================== the data reads */

const parks = S.notRegistered.onStaging;
const builtNoSource = S.builtButUnfed.callsOnUnconnected;
const builtUngranted = S.builtButUnfed.patrolOnDemo;

/** Regions per roster lens, counted off the registry rather than asserted. */
const ROSTER = S.vocab.ROSTER_LENS_IDS.map((id) => ({
  id,
  regions: S.vocab.registry.filter((d) => d.lensId === id).length,
  kinds: [...new Set(S.vocab.registry.filter((d) => d.lensId === id).map((d) => d.gatedBy))],
}));
const parksRegions = ROSTER.find((r) => r.id === 'parks').regions;
if (parksRegions !== 0) throw new Error('parks now has ' + parksRegions + ' registered regions; this design is out of date, re-derive it');

const FOOT = 'bastrop_tx &middot; staging pack<br>0 registered regions on this lens<br>badges outside this lens are the shipped values at f776b4bf';

/* ---------------------------------------------------------------- board 1 */

const main = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  h1: 'Parks', pageBadge: 'Not built', foot: FOOT,
  pageRule: '0 registered regions. Public works carries 2, Fire and EMS 1.',
  lede: 'Parks is a department on the city roster and it is named here so the roster stays honest about coverage rather than hiding behind an overflow menu. There is no region to read, no source to grant and nothing on this page is waiting for a connection.',
  body:
'        <div style="flex:1; min-height:0; display:flex; gap:var(--sc-4);">\n' +
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
panel({
  title: 'This surface does not exist yet', sub: 'and that is a different sentence',
  basis: 'Basis, verbatim from the composer: ' + parks.basis + '. Status: ' + parks.status + ', the same on every pack. A state that does not vary by city is a statement about the PRODUCT.',
  basisWidth: 116,
},
'          <div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-4) var(--sc-6) var(--sc-3); max-width:92ch;">\n' +
'            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-crit);">' + parks.status + '</div>\n' +
'            <h2 style="font:650 22px/28px var(--sc-font-ui); letter-spacing:-.016em; margin:0; color:var(--sc-ink);">Parks is named, and it is not built.</h2>\n' +
'            <p style="margin:0; font:400 15px/22px var(--sc-font-ui); color:var(--sc-ink-2);">Every other department page on this roster exists and may be waiting for a source. This one is not. Nothing is connected, nothing is pending, and no grant would fill it, because there is no region here to fill. What is in the way is a source that does not exist: the build sheet records Parks facilities as <span style="font-family:var(--sc-font-data); color:var(--sc-ink);">gates: none yet</span>, and the product will not register a region against a vendor it cannot name.</p>\n' +
'          </div>') + '\n' +
panel({
  title: 'Why it cannot simply be added', sub: 'three refusals, in the product',
  basis: 'Basis: the three messages are the product’s own, from src/fixture-seam.mjs, src/city-pack.mjs and src/fixture-seam.mjs composeDomain. src/department-domains.test.mjs pins all three against a probe domain named parks-facilities, so the finding is inherited measured rather than re-derived.',
  basisWidth: 116,
}, rows([
  [{ t: 'assertDomainShape', mono: true }, 'refuses a region whose gate is not one of the ten catalogued vendor kinds', { t: 'gated by parks, which is not a catalogued adapter kind', mono: true, tone: '--sc-crit' }],
  [{ t: 'assertCityPackShape', mono: true }, 'refuses a city pack that names an uncatalogued kind', { t: 'fixtureGrants names parks, which is not a catalogued adapter kind', mono: true, tone: '--sc-crit' }],
  [{ t: 'composeDomain', mono: true }, 'refuses a record whose vendor id does not match the region’s gate', { t: 'returned a X record but is gated by Y', mono: true, tone: '--sc-crit' }],
], '178px minmax(0,1fr) minmax(0,1.5fr)')) + '\n' +
panel({
  title: 'What would change this', sub: 'one thing, and it is not engineering',
  basis: 'The ten catalogued kinds are mygov, samsara, opengov, esri, municode, firstdue, verkada, spireon, goto, powerbi. None is a parks system, and an eleventh is a contract rather than a sprint item.',
  basisWidth: 116,
}, rows([
  [{ t: '1', mono: true }, 'A parks or facilities system is identified and catalogued as an adapter kind'],
  [{ t: '2', mono: true }, 'A domain is written under that kind and appended to DOMAIN_REGISTRY'],
  [{ t: '3', mono: true }, 'Only then does this page become a built region that can be empty with a basis'],
], '32px minmax(0,1fr)')) + '\n' +
'          </div>\n' +
'          <div style="width:452px; flex:none; display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
panel({
  title: 'What Parks is not', sub: 'three near misses',
  basis: 'Each is real, none is this lens. Filling this page with one would claim coverage it does not have.',
  basisWidth: 62,
}, rows([
  [{ t: 'A map layer', tone: '--sc-ink' }, 'property-map-catalog.mjs catalogues a parks polygon layer. A geometry layer is not a department register, and whether it returns features anywhere is UNESTABLISHED here.'],
  [{ t: 'A role', tone: '--sc-ink' }, 'staff-identity.mjs carries parks in DEPARTMENT_ROLES. A role that can be issued is not a surface that can be opened, and lens access is not enforced yet.'],
  [{ t: 'A register row', tone: '--sc-ink' }, 'shell-homes.mjs routes Departments including Parks and Courts here, disposition Not built. That row is the pointer, not a source.'],
], 'minmax(0,1fr)')) + '\n' +
panel({
  title: 'The roster, counted', sub: 'regions per department lens',
  basis: 'Entries in DOMAIN_REGISTRY whose lensId equals this lens, at f776b4bf. Zero is a different kind of answer, not a low number.',
  basisWidth: 62,
}, rosterPanel(ROSTER)) + '\n' +
'          </div>\n        </div>',
});

/* ---------------------------------------------------------------- board 2 */

const col = (o) =>
'          <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-3); padding:var(--sc-5) var(--sc-5); ' + (o.left ? 'border-right:1px solid var(--sc-line);' : '') + '">\n' +
'            <div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(' + o.tone + ');">' + o.kicker + '</span>' + badge(o.chip) + '</div>\n' +
'            <h2 style="font:650 20px/26px var(--sc-font-ui); letter-spacing:-.014em; margin:0; color:var(--sc-ink);">' + o.head + '</h2>\n' +
'            <p style="margin:0; font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.p + '</p>\n' +
'            <div style="display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-3) 0 0;">\n' +
o.facts.map((f) =>
'              <div style="display:grid; grid-template-columns:118px minmax(0,1fr); gap:var(--sc-3); align-items:start;"><span style="font:500 12px/18px var(--sc-font-data); letter-spacing:.06em; text-transform:uppercase; color:var(--sc-ink-3);">' + f[0] + '</span><span style="font:400 13px/19px ' + (f[2] ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (f[2] ? '--sc-ink' : '--sc-ink-2') + ');">' + f[1] + '</span></div>').join('\n') + '\n' +
'            </div>\n' +
'            <div style="flex:1;"></div>\n' +
'            ' + basisLine(o.basis, 62) + '\n          </div>';

const difference = artboard({
  city: 'Bastrop, TX', seal: 'BT', env: 'STAGING', theme: 'dark',
  h1: 'Two sentences the product keeps apart', pageBadge: '', foot: FOOT,
  pageRule: 'The line src/domains.mjs draws, drawn',
  lede: 'These two states look alike on any screen that reports them as an absence, and they ask a city for two completely different things. The left column is every other department lens on a city with no grant. The right column is Parks, on every city there will ever be.',
  body:
'        <div style="flex:1; min-height:0; display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'          <section style="flex:1; min-height:0; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex;">\n' +
col({
  left: true, tone: '--sc-warn', kicker: 'BUILT, AND NO SOURCE', chip: 'Empty',
  head: 'Call handling has not been read for this city.',
  p: 'The region exists. A member of staff can see the shape of what will arrive, and the city knows what to do next. This is a statement about SOURCES and it changes from city to city.',
  facts: [
    ['Composer', 'composeDomain in src/fixture-seam.mjs, the absence branch', true],
    ['Status', builtNoSource.status, true],
    ['Basis', builtNoSource.basis, true],
    ['Variant', 'On a pack that generates but has not granted this kind, the sentence is instead: ' + builtUngranted.basis, true],
    ['Ask the city', 'Grant the source. One action, on the city side, with a named vendor.'],
  ],
  basis: 'Both sentences name a vendor and a city, because both are true of THAT city. Read the same region on a different pack and the sentence changes.',
}) + '\n' +
col({
  left: false, tone: '--sc-crit', kicker: 'NOT BUILT', chip: 'Not built',
  head: 'Parks is named, and it is not built.',
  p: 'There is no region. Nothing is pending, no grant would fill it, and there is no vendor to ask. This is a statement about the PRODUCT and it is identical on every city.',
  facts: [
    ['Composer', 'composeDomainById in src/domains.mjs, the unregistered branch', true],
    ['Status', parks.status, true],
    ['Basis', parks.basis, true],
    ['Variant', 'None. The same sentence on the demo pack, on an unconnected city and on the live staging pack.', true],
    ['Ask the city', 'Nothing. There is no action a city can take. The obstacle is ours.'],
  ],
  basis: 'The sentence names no vendor and no city, because neither is true of it. That invariance is the honest signal and it is worth preserving in the copy.',
}) + '\n' +
'          </section>\n' +
'          <section style="flex:none; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
panelHead({ title: 'The rule, in the product’s own words', sub: 'src/domains.mjs, above DOMAIN_REGISTRY' }) + '\n' +
'          <div style="padding:var(--sc-4) var(--sc-5) var(--sc-3);"><p style="margin:0; max-width:132ch; font:400 14px/21px var(--sc-font-ui); color:var(--sc-ink-2);">&ldquo;WHAT ABSENCE FROM THIS LIST MEANS, and it is the only surviving meaning of the words <span style="color:var(--sc-ink);">not built</span>: the surface does not exist yet. Everything in the list is built, and its emptiness on a given pack is a statement about SOURCES with a basis attached. Those are different sentences to a customer and this list is the line between them.&rdquo;</p></div>\n' +
'          <div style="padding:0 var(--sc-5) var(--sc-4);">' + basisLine('There are five states in all. Four are in DOMAIN_STATUSES: ' + S.states.DOMAIN_STATUSES.join(', ') + '. The fifth, ' + S.states.fifthState + ', deliberately has no entry there, and that absence is itself the design.', 148) + '</div>\n' +
'          </section>\n        </div>',
});

/* --------------------------------------------------------------- emit */

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Difference.dc.html', import.meta.url), difference);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'Parks — a surface that does not exist' },
    { file: 'Difference.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'The two sentences, side by side' },
  ],
  annotations: [
    { id: 'notempty', x: 0, y: -300, w: 720, text: 'PARKS IS NOT AN EMPTY PUBLIC WORKS, AND THE PAGE MAY NOT LOOK LIKE ONE.\nNo metric tiles reading "Not read". No region strip with an empty state inside it. No table header with no rows under it. Every one of those is the sentence a BUILT region prints when it has no source.\nA city reading "has not been read for this pack" on Parks would go looking for a grant that no vendor exists to give. That is the exact confusion ruling 1 was written to end, and it is the reason this lens gets its own shape rather than the lens template with the data removed.' },
    { id: 'invariance', x: 780, y: -300, w: 660, text: 'THE TELL IS THAT IT DOES NOT VARY.\ncomposeDomainById returns the same sentence for parks-facilities on the demo pack, on an unconnected city and on the live staging pack: "parks-facilities is not a registered domain, so this surface is not built".\nA state that varies by city is a statement about the city. A state identical on every city is a statement about the product. The copy is written to keep that signal: the Parks sentence names no vendor and no city, because neither is true of it.' },
    { id: 'refusals', x: 1500, y: -300, w: 680, text: 'THREE REFUSALS, AND THEY ARE WHY IT CANNOT SIMPLY BE ADDED.\nassertDomainShape refuses a region whose gate is not one of the ten catalogued vendor kinds. assertCityPackShape refuses a pack naming an uncatalogued kind. composeDomain refuses a record whose vendor id does not match its region gate.\nThere is no vendorless path through the seam, so Parks is not registered and is not faked with an invented kind. src/department-domains.test.mjs pins all three against a probe domain named parks-facilities, so the next lane inherits the finding measured rather than re-deriving it.\nThe unblock is a sourcing decision and a contract, not a sprint item.' },
    { id: 'nearmiss', x: 2200, y: -300, w: 660, text: 'THREE NEAR MISSES, NAMED SO NOBODY REACHES FOR THEM.\nThe product contains a parks polygon MAP LAYER and a Parks and Recreation preset, a parks ROLE in DEPARTMENT_ROLES, and a register ROW routing "Departments including Parks and Courts" here.\nEach is real and none is this lens. A reviewer filling this page with the map layer would be answering a different question and the page would claim coverage it does not have. Whether that layer returns features for any city is UNESTABLISHED from the dashboards repo and is stated as unestablished rather than assumed either way.' },
    { id: 'contrast', x: 1720, y: -300, w: 700, text: 'THE CONTRAST BOARD IS THE INSTRUMENT, NOT AN ILLUSTRATION.\ncheck.mjs requires the built-surface vocabulary to be ABSENT from the Parks page body on Main and PRESENT on this board, where it is attributed to the other lens. Neither half can be satisfied by a sentinel, and a Parks design that quietly drifted into the built-surface language would fail the first half while still rendering perfectly.\nThe scope is structural: the check reads only the content inside data-lens-body="parks", so the nav badges on Police, Fire and EMS and Fleet, which are correct and belong there, neither satisfy nor violate a rule about the Parks page.' },
  ],
  launch: { view: 'canvas' },
}, null, 2) + '\n');

console.log('wrote Main, Difference + canvas.json');
console.log('  parks status on every pack: ' + S.notRegistered.onDemo.status + ' / ' + S.notRegistered.onUnconnected.status + ' / ' + S.notRegistered.onStaging.status);
console.log('  roster regions: ' + ROSTER.map((r) => r.id + '=' + r.regions).join(', '));
