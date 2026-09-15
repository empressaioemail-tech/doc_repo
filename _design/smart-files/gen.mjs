import fs from 'node:fs';
const KIT = fs.readFileSync(new URL('./_kit.css', import.meta.url), 'utf8');
const F = JSON.parse(fs.readFileSync(new URL('./source-facts.json', import.meta.url), 'utf8'));

/**
 * Smart Files.
 *
 * Read from the smart-files repo at origin/main 61c84f6, not from the nav item
 * that says "Files / Preview". The dashboards surface is a MOUNT POINT and says
 * so on itself; the product is its own repo, database and serving process.
 *
 * THE THESIS. Smart Files is not a file browser, and its best properties are
 * exactly the ones a file browser has nowhere to put. It knows whether a
 * document text is searchable and WHY NOT, in three named reasons. It knows
 * that a second upload under the same slug is a revision of one document rather
 * than a sibling. It knows who captured a file, when, from what kind of source
 * and in what declared role, and it REFUSES the write when any of that is
 * missing. It knows what a document is placed against, not just which folder it
 * sits in. A browser shows name, size and date. The filing is the product.
 *
 * The sharpest consequence, and the search artboard is built on it: a search
 * box over a corpus where some documents were never indexed is a box that lies
 * by omission. Smart Files is the only product here that can say what it did
 * not search, because `search_text IS NULL` is its one honest not-indexed
 * value. Coverage goes BEFORE results.
 */

const CHEV = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

const PILL = {
  'INDEXED': ['var(--sc-ok)', 'var(--sc-ok-wash)'],
  'NOT INDEXABLE': ['var(--sc-ink-3)', 'var(--sc-quiet-wash)'],
  'NO TEXT LAYER': ['var(--sc-warn)', 'var(--sc-warn-wash)'],
  'EXTRACTION FAILED': ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'TENANT PRIVATE': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
  'REVISION': ['var(--sc-info)', 'var(--sc-info-wash)'],
  'REFUSED': ['var(--sc-crit)', 'var(--sc-crit-wash)'],
  'PREVIEW': ['var(--sc-restricted)', 'var(--sc-restricted-wash)'],
};
const pill = (t) => {
  if (!t) return '';
  const [c, w] = PILL[t] || PILL['NOT INDEXABLE'];
  return '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:' + c + '; background:' + w + '; border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">' + t + '</span>';
};

const navItem = (n, on, badge) =>
  '          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3); border-radius:var(--sc-r-control); background:' + (on ? 'var(--sc-accent-wash)' : 'transparent') + '; box-shadow:' + (on ? 'inset 2px 0 0 var(--sc-accent)' : 'none') + ';">' +
  '<span style="flex:1; min-width:0; font:' + (on ? '600' : '400') + ' 14px/20px var(--sc-font-ui); color:var(' + (on ? '--sc-ink' : '--sc-ink-2') + ');">' + n + '</span>' +
  (badge ? '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + badge + '</span>' : '') + '</div>';

const navGroup = (label, rows) =>
  '        <div style="display:flex; flex-direction:column; gap:1px; padding:var(--sc-2) 0;">\n' +
  (label ? '          <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>\n' : '') +
  rows.join('\n') + '\n        </div>';

const nav = (active) =>
  '      <nav style="width:var(--sc-nav); flex:none; background:var(--sc-surface); border-right:1px solid var(--sc-line); display:flex; flex-direction:column; padding:var(--sc-2) var(--sc-3); overflow:hidden;">\n' +
  navGroup('', [['Search', 'Search'], ['Recents', 'Recents'], ['My files', 'My files'], ['Shared with me', 'Shared with me'], ['Shared by me', 'Shared by me']].map((r) => navItem(r[0], r[1] === active, r[0] === 'My files' ? '31' : (r[0] === 'Shared with me' ? '4' : '')))) + '\n' +
  navGroup('Folders', ['Submittals', 'Meeting records', 'Plan sets', 'Correspondence'].map((r) => navItem(r, false, ''))) + '\n' +
  navGroup('Add', [navItem('Bring files', false, ''), navItem('Upload from this computer', false, '')].map((x) => x)) + '\n' +
  '        <div style="flex:1;"></div>\n' +
  '        <div style="border-top:1px solid var(--sc-line-faint); padding:var(--sc-3) var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); margin:0 0 var(--sc-1) var(--sc-1);"><b style="color:var(--sc-ink-2);">' + F.shippedCopy.navFoot + '</b><br>tenant &middot; bastrop_tx</div>\n      </nav>';

const topbar = () =>
'    <header style="height:var(--sc-topbar); flex:none; display:flex; align-items:center; gap:var(--sc-3); padding:0 var(--sc-4); background:var(--sc-surface); border-bottom:1px solid var(--sc-line);">\n' +
'      <div style="width:24px; height:24px; border-radius:3px; border:1px solid var(--sc-line-strong); display:grid; place-items:center; font:500 12px/16px var(--sc-font-data); color:var(--sc-ink-2);">SF</div>\n' +
'      <div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Smart Files</div>\n' +
'      <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">mounted at city altitude &middot; Bastrop, TX</span>\n' +
'      <div style="flex:1;"></div>\n' +
'      <div style="display:flex; align-items:center; height:28px; padding:0 var(--sc-3); width:340px; border:1px solid var(--sc-line); border-radius:var(--sc-r-control); background:var(--sc-surface-2); color:var(--sc-ink-3); font:400 13px/18px var(--sc-font-ui);">Search the text inside these documents</div>\n    </header>';

const panel = (o) =>
'        <section style="' + (o.grow ? 'flex:1; min-height:0;' : 'flex:none;') + ' border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); overflow:hidden; box-shadow:var(--sc-e1); display:flex; flex-direction:column;">\n' +
'          <div style="display:flex; align-items:center; gap:var(--sc-2); min-height:40px; padding:var(--sc-1) var(--sc-3); border-bottom:1px solid var(--sc-line-faint);">\n' +
'            <span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">' + o.title + '</span>\n' +
(o.sub ? '            <span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.sub + '</span>\n' : '') +
'            <div style="flex:1;"></div>\n' + (o.pill ? '            ' + pill(o.pill) + '\n' : '') +
'          </div>\n' + o.body + '\n' +
(o.basis ? '          <div style="padding:var(--sc-2) var(--sc-4) var(--sc-3);"><span style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3); display:inline-block; max-width:120ch;">' + o.basis + '</span></div>\n' : '') +
'        </section>';

const table = (o) =>
'          <div style="overflow:hidden;">\n' +
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:7px var(--sc-4); background:var(--sc-surface-2); border-bottom:1px solid var(--sc-line);">\n' +
o.head.map((h) => '              <span style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + h + '</span>').join('\n') + '\n            </div>\n' +
o.rows.map((r) =>
'            <div style="display:grid; grid-template-columns:' + o.cols + '; gap:var(--sc-3); padding:9px var(--sc-4); border-bottom:1px solid var(--sc-line-faint); align-items:center;">\n' +
r.map((c, i) => {
  if (c && c.pill) return '              <span style="justify-self:start;">' + pill(c.pill) + '</span>';
  const cell = (c && typeof c === 'object') ? c : { t: c };
  const mono = cell.mono || i === 0;
  return '              <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font:400 13px/18px ' + (mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (cell.tone || (i === 0 ? '--sc-ink' : '--sc-ink-2')) + ');">' + cell.t + '</span>';
}).join('\n') + '\n            </div>').join('\n') + '\n          </div>';

/** Coverage bar: what a search actually searched over, before any result. */
const coverage = (bands, total) =>
'          <div style="padding:var(--sc-4) var(--sc-4) var(--sc-3);">\n' +
'            <div style="display:flex; height:10px; border-radius:3px; overflow:hidden; background:var(--sc-line-faint);">' +
bands.map((b) => '<span style="width:' + Math.round((b.n / total) * 100) + '%; background:' + PILL[b.pill][0] + ';"></span>').join('') + '</div>\n' +
'            <div style="display:flex; flex-wrap:wrap; gap:var(--sc-4); padding-top:var(--sc-3);">' +
bands.map((b) =>
  '<span style="display:flex; align-items:center; gap:7px;"><span style="width:9px; height:9px; border-radius:2px; background:' + PILL[b.pill][0] + '; flex:none;"></span>' +
  '<span style="font:400 15px/20px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + b.n + '</span>' +
  '<span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + b.k + '</span></span>').join('') + '</div>\n          </div>';

const kv = (rows) =>
'          <div style="display:flex; flex-direction:column;">\n' +
rows.map((r, i) =>
'            <div style="display:grid; grid-template-columns:172px minmax(0,1fr); gap:var(--sc-4); padding:9px var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + ' align-items:baseline;">' +
'<span style="font:400 12px/18px var(--sc-font-data); color:var(--sc-ink-3);">' + r.k + '</span>' +
'<span style="min-width:0; font:400 13px/19px ' + (r.mono ? 'var(--sc-font-data)' : 'var(--sc-font-ui)') + '; color:var(' + (r.tone || '--sc-ink') + ');">' + r.v + '</span></div>').join('\n') + '\n          </div>';

function artboard(o) {
  return '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n  <style>\n' + KIT + '\n  </style>\n</helmet>\n' +
'<div class="{{themeClass}}" style="width:1600px; height:1040px; display:flex; flex-direction:column; background:var(--sc-canvas); overflow:hidden;">\n' +
topbar() + '\n  <div style="flex:1; display:flex; min-height:0;">\n' + nav(o.navActive) + '\n' +
'    <main style="flex:1; min-width:0; overflow:hidden; padding:var(--sc-5) var(--sc-6); display:flex; flex-direction:column; gap:var(--sc-4);">\n' +
'      <div style="display:flex; flex-direction:column; gap:var(--sc-1);">\n' +
'        <div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + o.crumb + '</div>\n' +
'        <div style="display:flex; align-items:center; gap:var(--sc-2);"><h1 style="font:650 26px/32px var(--sc-font-ui); letter-spacing:-.022em; margin:0; color:var(--sc-ink);">' + o.h1 + '</h1>' + pill(o.pageBadge) + '</div>\n' +
'        <p style="margin:0; max-width:106ch; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">' + o.lede + '</p>\n      </div>\n' +
o.body + '\n    </main>\n  </div>\n</div>\n</x-dc>\n' +
'<script data-dc-script data-props=\'{"theme":{"editor":"enum","options":["light","dark"],"default":"dark"},"$preview":{"width":1600,"height":1040}}\'>\n' +
'class Component extends DCLogic {\n  renderVals() {\n    return { themeClass: (this.props.theme ?? "dark") === "dark" ? "sc-dark" : "sc-light" };\n  }\n}\n</script>\n</body>\n</html>\n';
}

/* ===================================================== 1. the room */

const ROWS = [
  ['2026-08-19_council-packet.pdf', 'Plan set', 'v3', { pill: 'INDEXED' }, 'Meeting 09-09', 'tenant / bastrop_tx'],
  ['SUB-2026-0141_site-plan.pdf', 'Submittal', 'v2', { pill: 'INDEXED' }, 'Submittal SUB-2026-0141', 'tenant / bastrop_tx'],
  ['SUB-2026-0141_drainage.pdf', 'Submittal', 'v1', { pill: 'NO TEXT LAYER' }, 'Submittal SUB-2026-0141', 'tenant / bastrop_tx'],
  ['zba-2026-09-09-minutes.json', 'Meeting record', 'v1', { pill: 'NOT INDEXABLE' }, 'Meeting 09-09', 'tenant / bastrop_tx'],
  ['zba-2026-08-12-minutes.json', 'Meeting record', 'v1', { pill: 'NOT INDEXABLE' }, 'Folder only', 'tenant / bastrop_tx'],
  ['plat_fairview-ph2_scan.pdf', 'Plan set', 'v1', { pill: 'EXTRACTION FAILED' }, 'Folder only', 'tenant / bastrop_tx'],
  ['2026-07-14_cip-budget-summary.pdf', 'Correspondence', 'v1', { pill: 'INDEXED' }, 'Folder only', 'tenant / bastrop_tx'],
];

const main = artboard({
  navActive: 'My files', h1: 'Submittals', pageBadge: 'TENANT PRIVATE',
  crumb: 'Bastrop, TX / Smart Files / Submittals',
  lede: 'A file browser shows name, size and date. This product knows whether a document text can be searched and why not, what a second upload did to the first, what the document is placed against, and who captured it in what role. The row carries what the product knows.',
  body:
    panel({
      grow: true,
      title: 'Documents', sub: '31 documents &middot; 7 shown',
      body: table({
        cols: 'minmax(0,1.5fr) 140px 62px 170px minmax(0,1fr) 168px',
        head: ['Name', 'Kind', 'Version', 'Searchable', 'Placed against', 'Scope'],
        rows: ROWS,
      }),
      basis: 'Basis: the shipped table already carries Version, Who can see it and Referenced. Searchable is the column it does not have, and the product has had the answer since the search wave: search_text IS NULL, never the empty string, is the one honest not-indexed value. Placed against replaces a folder-only column because a document that belongs to a meeting belongs to the meeting.',
    }) + '\n' +
    '        <div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:var(--sc-4);">\n' +
    panel({
      title: 'Who can see it',
      body: kv([
        { k: 'Scope', v: 'tenant / bastrop_tx', mono: true },
        { k: 'Default policy', v: 'tenant-private, until someone is named', tone: '--sc-ink-2' },
        { k: 'Shared out', v: '0 links, 0 grants', tone: '--sc-ink-2' },
      ]),
      basis: F.shippedCopy.accessRail,
    }) + '\n' +
    panel({
      title: 'Searchable in this folder',
      body: coverage([
        { k: 'indexed', n: 12, pill: 'INDEXED' },
        { k: 'no-text-layer', n: 7, pill: 'NO TEXT LAYER' },
        { k: 'content-type-not-indexable', n: 11, pill: 'NOT INDEXABLE' },
        { k: 'extraction-failed', n: 1, pill: 'EXTRACTION FAILED' },
      ], 31),
      basis: 'Nineteen of thirty-one documents in this folder cannot be found by their text, for three different reasons. The folder does not hide that.',
    }) + '\n' +
    panel({
      title: 'What is not built',
      body: kv([
        { k: 'Placement wiring', v: 'The municode scraper still uploads meeting documents without naming the meeting, so they land as folder-only. Two rows above show it.', tone: '--sc-ink-2' },
        { k: 'Owner', v: 'smartcity-dashboards, not this repo', tone: '--sc-ink-3' },
      ]),
      basis: 'Named rather than drawn as working. The capability landed here; the caller has not been wired.',
    }) + '\n        </div>',
});

/* ============================================ 2. coverage before results */

const search = artboard({
  navActive: 'Search', h1: 'Search', pageBadge: '',
  crumb: 'Bastrop, TX / Smart Files / Search',
  lede: 'A search box over a corpus where some documents were never indexed is a box that lies by omission. Three results can mean three matches, or it can mean twenty-eight documents were never searched. This page says which before it says anything else.',
  body:
    panel({
      title: 'What this search covered', sub: 'drainage easement',
      body: coverage([
        { k: 'searched', n: 12, pill: 'INDEXED' },
        { k: 'not searched &middot; no-text-layer', n: 7, pill: 'NO TEXT LAYER' },
        { k: 'not searched &middot; content-type-not-indexable', n: 11, pill: 'NOT INDEXABLE' },
        { k: 'not searched &middot; extraction-failed', n: 1, pill: 'EXTRACTION FAILED' },
      ], 31),
      basis: 'Basis: coverage is counted before results are ranked, over the documents in scope. Only the CURRENT version of a document is searched, so a phrase that appeared in v1 and was removed in v2 is correctly not found. Nineteen documents produced no answer because nothing looked inside them, which is not the same as not matching.',
    }) + '\n' +
    panel({
      grow: true,
      title: '3 results', sub: 'ranked &middot; snippet and rank only, never bytes',
      body:
        '          <div style="display:flex; flex-direction:column;">\n' +
        [
          { n: 'SUB-2026-0141_site-plan.pdf', s: 'existing 20 foot <b style="color:var(--sc-ink); background:var(--sc-accent-wash); padding:0 2px;">drainage easement</b> along the north property line shall remain unobstructed', r: '0.84', v: 'v2' },
          { n: '2026-08-19_council-packet.pdf', s: 'consideration of a variance to the <b style="color:var(--sc-ink); background:var(--sc-accent-wash); padding:0 2px;">drainage easement</b> setback requirement for Fairview Phase 2', r: '0.61', v: 'v3' },
          { n: '2026-07-14_cip-budget-summary.pdf', s: 'storm <b style="color:var(--sc-ink); background:var(--sc-accent-wash); padding:0 2px;">drainage</b> improvements, including <b style="color:var(--sc-ink); background:var(--sc-accent-wash); padding:0 2px;">easement</b> acquisition, are funded from', r: '0.29', v: 'v1' },
        ].map((r, i) =>
        '            <div style="display:flex; flex-direction:column; gap:3px; padding:var(--sc-3) var(--sc-4); ' + (i ? 'border-top:1px solid var(--sc-line-faint);' : '') + '">' +
        '<div style="display:flex; align-items:center; gap:var(--sc-2);"><span style="font:600 13px/18px var(--sc-font-data); color:var(--sc-ink);">' + r.n + '</span>' +
        '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + r.v + ' &middot; current</span><span style="flex:1;"></span>' +
        '<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">rank ' + r.r + '</span></div>' +
        '<div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2);">&hellip; ' + r.s + ' &hellip;</div></div>').join('\n') +
        '\n          </div>' +
        '          <div style="margin:var(--sc-3) var(--sc-4) var(--sc-4); border:1px solid var(--sc-warn); border-radius:var(--sc-r); background:var(--sc-warn-wash); padding:var(--sc-3) var(--sc-4);">' +
        '<div style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink); margin-bottom:4px;">Seven documents in scope have no text layer and were not searched.</div>' +
        '<div style="font:400 13px/19px var(--sc-font-ui); color:var(--sc-ink-2); max-width:104ch;">They are scanned images. Nothing has read their contents, so this result set says nothing about whether they mention a drainage easement. Six of the seven are plan sets, which is where a drainage easement would be drawn.</div></div>',
      basis: 'Basis: results carry entityId, title, snippet and rank only. Blob bytes stay behind the separately gated route, and the read gate runs before any data is touched, so the search gate is exactly as strict as every other read.',
    }),
});

/* ================================= 3. one document, and what filing means */

const document = artboard({
  navActive: 'My files', h1: 'SUB-2026-0141_site-plan.pdf', pageBadge: 'REVISION',
  crumb: 'Bastrop, TX / Smart Files / Submittals / SUB-2026-0141',
  lede: 'Two uploads, one document. The second upload carried the same slug, so it became version 2 of this record rather than a second file beside it. That is what makes a submittal identity stable across a revision cycle, and it is the difference between a filing system and a folder.',
  body:
    '        <div style="display:grid; grid-template-columns:minmax(0,1.25fr) minmax(0,1fr); gap:var(--sc-4); flex:1; min-height:0;">\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Versions', sub: 'one entity, two versions',
      body: table({
        cols: '58px minmax(0,1fr) 150px 132px',
        head: ['Ver', 'Captured', 'Source kind', 'Searchable'],
        rows: [
          [{ t: 'v2', tone: '--sc-ink' }, 'current &middot; replaced v1 under the same slug', 'applicant-upload', { pill: 'INDEXED' }],
          [{ t: 'v1', tone: '--sc-ink-3' }, 'superseded, retained', 'applicant-upload', { pill: 'INDEXED' }],
        ],
      }),
      basis: 'Basis: ' + F.revisionRule.verbatim + '. A browser that drew two rows here would be describing the filing incorrectly.',
    }) + '\n' +
    panel({
      grow: true,
      title: 'Provenance', sub: 'five keys, and the write refuses without them',
      body: kv([
        { k: 'capturedBy', v: 'applicant portal session', mono: true },
        { k: 'capturedAt', v: '2026-09-11T14:22:07Z', mono: true },
        { k: 'sourceKind', v: 'applicant-upload', mono: true },
        { k: 'originalFilename', v: 'Site Plan REV2 FINAL (2).pdf', mono: true },
        { k: 'declaredRole', v: 'site plan', mono: true },
      ]),
      basis: 'Basis: all five keys are required and a missing or invalid one refuses the write with 400 rather than defaulting. originalFilename is kept because what the applicant called it is evidence, and the slug is not.',
    }) + '\n          </div>\n' +
    '          <div style="display:flex; flex-direction:column; gap:var(--sc-4); min-height:0;">\n' +
    panel({
      title: 'Placed against',
      body: kv([
        { k: 'Target', v: 'Submittal SUB-2026-0141', tone: '--sc-ink' },
        { k: 'Folder', v: 'Submittals', tone: '--sc-ink-2' },
        { k: 'Reachable from', v: 'the submittal, the folder, and search', tone: '--sc-ink-2' },
      ]),
      basis: 'A placement names what the document belongs to, not only where it sits. A document reachable only through a folder tree is a document somebody has to already know about.',
    }) + '\n' +
    panel({
      title: 'Who can see it',
      body: kv([
        { k: 'Scope', v: 'tenant / bastrop_tx', mono: true },
        { k: 'Policy', v: 'tenant-private', mono: true },
        { k: 'Grants', v: 'none named', tone: '--sc-ink-2' },
      ]),
      basis: F.shippedCopy.peopleView,
    }) + '\n' +
    panel({
      grow: true,
      title: 'Searchable', pill: 'INDEXED',
      body: kv([
        { k: 'Indexed', v: 'yes, on upload', tone: '--sc-ok' },
        { k: 'Version searched', v: 'v2 only, the current one', tone: '--sc-ink-2' },
        { k: 'searchIndexReason', v: 'null &middot; the one honest indexed value', mono: true, tone: '--sc-ok' },
      ]),
      basis: 'Extraction runs synchronously on upload and only for PDFs. A failure here would fail the index and never the upload, and the reason would be named on this row rather than left as an absence.',
    }) + '\n          </div>\n        </div>',
});

/* ============================== 4. the two refusals, drawn as first class */

const refusals = artboard({
  navActive: 'My files', h1: 'Two refusals', pageBadge: 'REFUSED',
  crumb: 'Bastrop, TX / Smart Files / refusals',
  lede: 'This product refuses in two places that matter, and both refusals are better product than the thing they prevent. Neither is drawn today, so both read as errors instead of as the guarantee they are.',
  body:
    '        <div style="display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:var(--sc-4); flex:1; min-height:0;">\n' +
    panel({
      grow: true,
      title: 'A read outside your scope', pill: 'REFUSED',
      body:
        '          <div style="padding:var(--sc-6) var(--sc-4) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3); max-width:70ch;">\n' +
        '            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-crit);">403 &middot; not entitled</div>\n' +
        '            <h2 style="font:620 17px/24px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">This document exists and you cannot read it.</h2>\n' +
        '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Your identity holds a grant for <b style="font-family:var(--sc-font-data); color:var(--sc-ink);">tenant / acme</b>. This document is scoped to <b style="font-family:var(--sc-font-data); color:var(--sc-ink);">tenant / bastrop_tx</b>. Nothing about its contents is returned, and the fact that it exists is what you are being told.</p>\n' +
        '          </div>\n' +
        kv([
          { k: 'Scope held', v: 'tenant / acme', mono: true, tone: '--sc-ink-2' },
          { k: 'Scope required', v: 'tenant / bastrop_tx', mono: true, tone: '--sc-crit' },
          { k: 'Anonymous', v: 'refused identically', mono: false, tone: '--sc-ink-2' },
        ]),
      basis: 'Basis: ' + F.readGate.defaultDeny + ' A silent empty list would be the alternative, and it teaches the caller that nothing is there.',
    }) + '\n' +
    panel({
      grow: true,
      title: 'An upload with incomplete provenance', pill: 'REFUSED',
      body:
        '          <div style="padding:var(--sc-6) var(--sc-4) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-3); max-width:70ch;">\n' +
        '            <div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-crit);">400 &middot; not filed</div>\n' +
        '            <h2 style="font:620 17px/24px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">This upload named no capturing role, so it was not filed.</h2>\n' +
        '            <p style="margin:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2);">Four of the five required keys were supplied. The write refuses rather than filling the fifth with a default, because a provenance record with an invented field is worse than no provenance record at all.</p>\n' +
        '          </div>\n' +
        kv(F.provenanceRequiredKeys.values.map((k) => ({
          k, mono: true,
          v: k === 'declaredRole' ? 'missing &middot; the write refuses' : 'supplied',
          tone: k === 'declaredRole' ? '--sc-crit' : '--sc-ok',
        }))),
      basis: 'Basis: five required keys, validated on write. sourceKind is additionally checked against a closed set of four values, so a caller cannot invent a provenance category either.',
    }) + '\n        </div>',
});

/* ================================================ 5. what is not built */

const gaps = artboard({
  navActive: 'My files', h1: 'What this product does not do yet', pageBadge: 'PREVIEW',
  crumb: 'Bastrop, TX / Smart Files / gaps',
  lede: 'Four capabilities landed in the service and have no surface, or have a surface that is chrome. Named here rather than drawn as working, because a design that shows a capability as finished is how a capability stops being built.',
  body:
    panel({
      grow: true,
      title: 'Landed in the service, not reachable by a person',
      body: table({
        cols: 'minmax(0,1fr) 148px minmax(0,1.45fr) 190px',
        head: ['Capability', 'State', 'What is missing', 'Owner'],
        rows: [
          ['Placement targets', { t: 'built, unwired', tone: '--sc-warn' }, 'The municode scraper still uploads meeting documents without naming the meeting, so they land folder-only. The service accepts targetType and targetId today.', 'smartcity-dashboards'],
          ['Search coverage', { t: 'built, unsurfaced', tone: '--sc-warn' }, 'Three named not-indexed reasons exist on every version row and no screen renders them. The search box cannot say what it did not search.', 'this repo'],
          ['Provenance', { t: 'built, unsurfaced', tone: '--sc-warn' }, 'Five required keys are captured and refused on, and the browser shows none of them.', 'this repo'],
          ['Bring files', { t: 'chrome only', tone: '--sc-crit' }, 'The page is fixture data against a pasted link. There is no live Drive sync behind it and the page says so on itself.', 'this repo'],
          ['Jurisdiction and site scopes', { t: 'readable, not writable', tone: '--sc-ink-3' }, 'All four scopes read. Write accepts tenant and instrument only, so a jurisdiction-scoped document cannot be created through this product.', 'ruling owed'],
        ],
      }),
      basis: 'Basis: one row per capability, read from the repo at origin/main rather than from a roadmap. Three of the five are surfacing work in this product and one is a caller in another repo, which is the distinction that decides who is asked.',
    }),
});

fs.writeFileSync(new URL('./Main.dc.html', import.meta.url), main);
fs.writeFileSync(new URL('./Search.dc.html', import.meta.url), search);
fs.writeFileSync(new URL('./Document.dc.html', import.meta.url), document);
fs.writeFileSync(new URL('./Refusals.dc.html', import.meta.url), refusals);
fs.writeFileSync(new URL('./Gaps.dc.html', import.meta.url), gaps);

fs.writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify({
  artboards: [
    { file: 'Main.dc.html', x: 0, y: 0, w: 1600, h: 1040, title: 'The room — the row carries what the product knows' },
    { file: 'Search.dc.html', x: 1720, y: 0, w: 1600, h: 1040, title: 'Search — coverage before results' },
    { file: 'Document.dc.html', x: 3440, y: 0, w: 1600, h: 1040, title: 'One document — a revision, not a sibling' },
    { file: 'Refusals.dc.html', x: 5160, y: 0, w: 1600, h: 1040, title: 'Two refusals, drawn as first class' },
    { file: 'Gaps.dc.html', x: 6880, y: 0, w: 1600, h: 1040, title: 'Built in the service, no surface' },
  ],
  annotations: [
    { id: 'thesis', x: 0, y: -300, w: 700, text: 'SMART FILES IS NOT A FILE BROWSER, AND ITS BEST PROPERTIES ARE EXACTLY THE ONES A BROWSER HAS NOWHERE TO PUT.\nIt knows whether a document text is searchable and WHY NOT, in three named reasons. It knows a second upload under the same slug is a REVISION of one document, not a sibling. It knows who captured a file, when, from what kind of source and in what declared role - and REFUSES the write when any of that is missing. It knows what a document is placed against, not just which folder it sits in.\nA browser shows name, size and date. The filing is the product.' },
    { id: 'mount', x: 760, y: -300, w: 620, text: 'THE DASHBOARDS "FILES" NAV ITEM IS A MOUNT POINT, NOT A SECOND IMPLEMENTATION.\nsmartcity-dashboards says so on itself: "This view mounts the serving Smart Files host with its own product top bar suppressed. It does not copy the browser."\nSo designing Files in dashboards would be designing a frame. The product is its own repo, its own database and its own serving process, and that is what these artboards are drawn against.' },
    { id: 'coverage', x: 1720, y: -300, w: 720, text: 'COVERAGE BEFORE RESULTS, AND THIS IS THE STRONGEST MOVE ON THE CANVAS.\nA search box over a corpus where some documents were never indexed is a box that LIES BY OMISSION. Three results can mean three matches, or it can mean twenty-eight documents were never searched, and every other product in this category cannot tell you which.\nSmart Files can, because `search_text IS NULL` - never the empty string - is its one honest not-indexed value, and the three reasons are named on the row.\nHere: 12 searched, 19 not, and SIX of the seven with no text layer are plan sets, which is exactly where a drainage easement would be drawn.' },
    { id: 'three', x: 2500, y: -300, w: 640, text: 'THREE REASONS, AND THEY ARE NOT THE SAME THING.\ncontent-type-not-indexable - a JSON meeting record was never eligible. Nothing failed.\nno-text-layer - a scanned PDF. Something COULD read it, with OCR nobody has built.\nextraction-failed - a corrupt PDF. Something tried and broke.\nDifferent owners, different fixes, different answers to "can we find it". Collapsing them into "no results" is the defect, and it is the default everywhere else.' },
    { id: 'revision', x: 3440, y: -300, w: 680, text: 'TWO UPLOADS, ONE DOCUMENT.\nThe second upload carried the same slug, so it became version 2 of this record rather than a second file beside it. entityId is unchanged, currentVersion increments, the response carries revision: true.\nThat is what makes a submittal identity STABLE ACROSS A REVISION CYCLE - the thing every plan review product in the category charges for - and a browser that drew two rows here would be describing the filing incorrectly.\nNote also: only the CURRENT version is searched. A phrase in v1 removed in v2 is correctly not found.' },
    { id: 'prov', x: 4200, y: -300, w: 640, text: 'FIVE KEYS, AND THE WRITE REFUSES WITHOUT THEM.\ncapturedBy, capturedAt, sourceKind, originalFilename, declaredRole. A missing or invalid key returns 400 rather than defaulting, and sourceKind is checked against a closed set of four so a caller cannot invent a category either.\noriginalFilename is kept deliberately: what the applicant called it ("Site Plan REV2 FINAL (2).pdf") is evidence. The slug is not.\nAll five are captured today and NO screen shows any of them.' },
    { id: 'refuse', x: 5160, y: -300, w: 700, text: 'BOTH REFUSALS ARE BETTER PRODUCT THAN THE THING THEY PREVENT, AND NEITHER IS DRAWN.\nThe read gate refuses anonymous and wrong-tenant IDENTICALLY, and the service is default-deny: an environment that has not configured its identities reads NOTHING, by design, rather than keeping the old defect as a silent default.\nSo the refusal should name the scope held and the scope required. A silent empty list is the alternative, and it teaches the caller that nothing is there.\nSame shape on write: four of five provenance keys supplied means NOT FILED, because a provenance record with an invented field is worse than none.' },
    { id: 'gaps', x: 5920, y: -300, w: 660, text: 'WHAT IS BUILT AND WHAT IS REACHABLE ARE DIFFERENT QUESTIONS.\nFour capabilities landed in the service and have no surface, or have a surface that is chrome. Named rather than drawn as working, because a design that shows a capability as finished is how a capability stops being built.\nThe distinction that matters on this artboard is OWNER: three are surfacing work in this repo, one is a caller in smartcity-dashboards, and one needs a ruling. That is what decides who gets asked.' },
    { id: 'attorney', x: 6880, y: -300, w: 640, text: 'THE LINE THE PRODUCT ALREADY WROTE ABOUT ITSELF, KEPT VERBATIM.\nOn the People and access view: "Every grant, every link, every revoke, with a name and a time. This is the page a city attorney opens."\nAnd on the access rail: "A share link is a row in this list with a name and a time, not a URL that exists off the record. Revoke sits at the same weight as the grant."\nThat is the right posture for a government filing system and it did not need redesigning. It needed the rest of the product brought up to it.' },
  ],
  launch: { view: 'canvas' },
}, null, 2));

console.log('wrote Main, Search, Document, Refusals, Gaps + canvas.json');
