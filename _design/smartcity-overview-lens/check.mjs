/**
 * Adversarial read of the Overview-lens artboards against the ruling they were ratified on.
 *
 *   node dump-source-facts.mjs && node check.mjs
 *
 * Non-zero exit on a violation. Exit 2 means the instrument REFUSED to report a verdict, which
 * is not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested perfectly and
 * matched nothing on any board, because the canvas rendered display forms and the check looked
 * for the product's codes. It reported success and checked nothing. So:
 *
 *   1. EVERY PREDICATE REPORTS A COUNT of the inputs it matched, and the run refuses a verdict
 *      when a predicate that must have inputs has none.
 *   2. NOTHING IS COMPARED AGAINST ITSELF. One side of every predicate is an artboard; the
 *      other is source-facts.json, which is LENS_LABELS and WORK_LABELS read out of
 *      `smartcity-dashboards/src/staff-review.mjs` at a commit and the G-120 ruling read at
 *      doc_repo HEAD. The ruling's own sentences are located by the dump and it REFUSES if one
 *      is gone, so the check cannot pass on a ruling that lost the rule.
 *   3. THE BOARD-SIDE RULES ARE THE RULING'S WORDS, not this file's taste: six lanes, a
 *      five-word badge vocabulary, tiles that are entry points rather than metrics, never a
 *      zero where nothing has been read, Connections promote/demote, the rail keeps the map and
 *      the address lookup while `Sources` is replaced by "On the map", an Agenda on every
 *      meeting row, and every empty state keeping its basis line.
 *
 * WHAT THIS FOUND ON THE SHIPPED BOARDS, NAMED AND NOT FIXED:
 *
 *   CONNECTIONS IS PROMOTED ON A GRANTED PACK. The ruling's structural move is `Promotes on
 *   empty, demotes on populated.` and the shipped function that implements it,
 *   `placeOverviewConnections` in `web/app.js`, settles what "populated" means: `const connected
 *   = granted > 0`, with a comment saying it is "keyed on granted ... not demonstrated" so the
 *   page cannot disagree with itself about whether a city is connected. `Sparse.dc.html` states
 *   "1 of 10 sources granted" in its own nav footer and lists MyGov as Read, and still renders
 *   Connections above the decision queue. Either the board moves or the rule does; an instrument
 *   cannot pick for the operator.
 *
 *   THE LANE ROLL-UP COUNTS A LANE THAT IS NOT READING. `Main.dc.html` states "4 of 6 reading"
 *   over the six lanes, and exactly three of those lanes render a fact read from a source --
 *   Development services, Police and Fleet. Finance is the interesting one: it says "opengov
 *   granted, no records read", which is the design correctly refusing to call a grant a read.
 *   So the subhead is one higher than the lanes under it.
 *
 * REPORTED AS NOTES, NOT VIOLATIONS: the six lanes are drawn in an order that matches neither
 * the product's roster order nor the order the ruling enumerates them in, so the SET is checked
 * and the order is reported; the populated board states "9 located this week" over five drawn
 * rows, which is a sample and not a count of the list (a count below the rows drawn would be a
 * violation, so that direction is checked); and the footer's "N of 10 reading records" is over
 * ten adapter kinds while the Connections panel draws the granted ones, so the two figures are
 * not the same quantity and are not tied to each other here.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-facts.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-facts.json is missing or unparsable. It is the product side this file checks the');
  console.error('artboards against, and there is no second source without it. Re-dump it with');
  console.error('dump-source-facts.mjs rather than letting the check pass silently.');
  process.exit(2);
}

function refuse(msg) {
  console.error('REFUSING A VERDICT: ' + msg + '.');
  console.error('A facts file this file cannot trust is a facts file it must not check against. Re-dump it.');
  process.exit(2);
}

/* ------------------------------------------------------- the product side */

const LENS_LABELS = S.labels.lenses;
const WORK_LABELS = S.labels.work;
const BADGES = S.badges;
const LANES = S.lanes;
const RULES = S.rules;
const SCAN = S.scan;

if (!Array.isArray(LENS_LABELS) || LENS_LABELS.length !== 9) refuse('the facts file does not carry the product\'s nine lens labels');
if (!Array.isArray(WORK_LABELS) || WORK_LABELS.length !== 6) refuse('the facts file does not carry the shell\'s six work labels');
if (!Array.isArray(BADGES) || BADGES.length !== 5) refuse('the facts file does not carry the ruling\'s five-state badge vocabulary');
if (!Array.isArray(LANES) || LANES.length !== 6) refuse('the facts file does not carry the ruling\'s six lanes');
if (!RULES || !RULES.atomVocabulary || !RULES.atomVocabulary.length) refuse('the facts file does not carry the engine vocabulary the surface must not print');
if (!RULES.connections || !/promotes|demotes/i.test(RULES.connections)) refuse('the facts file does not carry the Connections promote/demote rule');
if (!RULES.connectionsKeyedOn || !RULES.connectionsDemoteAt) refuse('the facts file does not carry the figure the shipped placement function keys the Connections move on');
if (!Array.isArray(S.unbuilt) || S.unbuilt.length !== 3) refuse('the facts file does not carry the three roster rows the product\'s nav markup badges "Not built"');
if (!Array.isArray(S.lensBadge) || S.lensBadge.length !== 5) refuse('the facts file does not carry the product\'s own five-word nav vocabulary');
if (!RULES.honestEmpty || !/basis/i.test(RULES.honestEmpty)) refuse('the facts file does not carry the basis-line rule for empty states');
if (!RULES.meetings || !/Agenda/.test(RULES.meetings)) refuse('the facts file does not carry the Agenda rule for meeting rows');
if (!RULES.tiles || !/entry point/i.test(RULES.tiles)) refuse('the facts file does not carry the tile rule');
if (!SCAN || !Number.isInteger(SCAN.filesScanned) || SCAN.filesScanned <= 0) refuse('the source scan carries no file count, so its counts support nothing');

/** The three the product's own nav markup badges "Not built", read at the ref rather than typed
    here, and so the only three that may carry NOT BUILT. */
const UNBUILT = S.unbuilt;
/** The product's own five-word nav vocabulary, and the ruling's five words. They have drifted. */
const LENS_BADGE = S.lensBadge;

const normalize = (s) =>
  String(s)
    .replace(/&mdash;/g, ' ')
    .replace(/&middot;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/[\u2014\u2013:·]/g, ' ')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/* ------------------------------------------------------------- extractors */

const plainText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<helmet[\s\S]*?<\/helmet>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&mdash;/g, ' — ')
    .replace(/&middot;/g, ' · ')
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const one = (re, s) => {
  const m = s.match(re);
  return m ? m[1] : null;
};

/* The nav: three labelled groups of rows, each row a label and an optional badge. */
const NAV_GROUP_RE = /<div style="font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.12em; text-transform:uppercase; color:var\(--sc-ink-3\); padding:var\(--sc-2\) var\(--sc-3\) var\(--sc-1\);">([^<]+)<\/div>/g;
const NAV_ROW_RE = /<span style="flex:1; min-width:0; font:(?:400|600) 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink(?:-2)?\); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">([^<]+)<\/span>(?:<span style="flex:none;[^"]*">([^<]+)<\/span>)?/g;

function navGroups(html) {
  const nav = html.slice(html.indexOf('<nav '), html.indexOf('</nav>'));
  const marks = [...nav.matchAll(NAV_GROUP_RE)];
  return marks.map((m, i) => {
    const body = nav.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : nav.length);
    return {
      group: m[1],
      items: [...body.matchAll(NAV_ROW_RE)].map((r) => ({ label: r[1], badge: r[2] ? r[2] : null })),
    };
  });
}

/** Every badge on the board, wherever it sits. */
const BADGE_RE = /<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.06em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 5px;">([^<]+)<\/span>/g;
const badges = (html) => [...html.matchAll(BADGE_RE)].map((m) => m[1]);

/* The tile row: label, a value or "Not read", and where the click goes. */
const TILE_SPLIT = '<div style="border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); padding:var(--sc-3) var(--sc-4); display:flex; flex-direction:column; gap:var(--sc-1); min-width:0; box-shadow:var(--sc-e1);">';
const TILE_LABEL_RE = /<div style="font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.08em; text-transform:uppercase; color:var\(--sc-ink-3\);">([^<]+)<\/div>/;
const TILE_NUM_RE = /<div style="font:400 26px\/32px var\(--sc-font-data\); font-variant-numeric:tabular-nums; letter-spacing:-\.01em; color:var\(--sc-ink\);">([^<]+)<\/div>/;
const TILE_WORD_RE = /<div style="font:620 15px\/32px var\(--sc-font-ui\); letter-spacing:-\.008em; color:var\(--sc-ink-3\);">([^<]+)<\/div>/;
const TILE_DEST_RE = /<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">([^<]+)<\/span>/;

function tiles(html) {
  return html
    .split(TILE_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 1400);
      const label = one(TILE_LABEL_RE, head);
      if (label === null) return null;
      const num = one(TILE_NUM_RE, head);
      const word = one(TILE_WORD_RE, head);
      return {
        label: plainText(label),
        value: num === null ? null : plainText(num),
        unread: word !== null && /not read/i.test(word),
        dest: plainText(one(TILE_DEST_RE, head) || ''),
        arrow: /<svg width="13" height="13"/.test(head),
      };
    })
    .filter((t) => t !== null);
}

/* The six lanes: name, the rail colour, the facts it renders, and its basis line. */
const LANE_SPLIT = '<div style="display:grid; grid-template-columns:3px minmax(0,1fr); gap:var(--sc-3); padding:var(--sc-3) var(--sc-4); border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-surface); min-width:0;">';
const LANE_RAIL_RE = /<div style="background:var\(--sc-([a-z0-9-]+)\); border-radius:var\(--sc-r-full\);"><\/div>/;
const LANE_NAME_RE = /<div style="font:600 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]+)<\/div>/;
const LANE_FACT_RE = /<span style="font:400 17px\/23px var\(--sc-font-data\); font-variant-numeric:tabular-nums; color:var\(--sc-ink\);">([^<]+)<\/span>\s*<span style="font:400 12px\/16px var\(--sc-font-ui\); color:var\(--sc-ink-3\);">([^<]+)<\/span>/g;
const LANE_BASIS_RE = /<div style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-left:2px solid var\(--sc-line\); padding-left:var\(--sc-3\);">([^<]+)<\/div>/;

function lanes(html) {
  return html
    .split(LANE_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 2200);
      const name = one(LANE_NAME_RE, head);
      if (name === null) return null;
      return {
        name: plainText(name),
        rail: one(LANE_RAIL_RE, head),
        facts: [...head.matchAll(LANE_FACT_RE)].map((m) => ({ v: plainText(m[1]), k: plainText(m[2]) })),
        basis: plainText(one(LANE_BASIS_RE, head) || ''),
      };
    })
    .filter((l) => l !== null);
}

/* The Connections rows: what this city reads, one row per source drawn. */
const SRC_SPLIT = '<div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">';
const SRC_NAME_RE = /<b style="font:600 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]+)<\/b>/;
const SRC_STATE_RE = /<span style="font:500 12px\/16px var\(--sc-font-ui\); color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-full\); padding:2px 8px;">([^<]+)<\/span>/;

function sources(html) {
  return html
    .split(SRC_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 1200);
      const n = one(SRC_NAME_RE, head);
      if (n === null) return null;
      return { name: plainText(n), state: plainText(one(SRC_STATE_RE, head) || ''), text: plainText(head) };
    })
    .filter((s) => s !== null);
}

/* The right rail: the map and the address lookup, then On the map. */
const railProbe = (html) => ({
  lookup: /Street address/.test(html) && /<div style="height:28px; padding:0 var\(--sc-4\); border-radius:var\(--sc-r-control\); background:var\(--sc-accent\); color:var\(--sc-on-accent\);[^"]*">Search<\/div>/.test(html),
  map: /--sc-map-ground/.test(html) && /border-radius:var\(--sc-r\); background:var\(--sc-map-ground/.test(html),
  onMap: /<div style="font:620 15px\/22px var\(--sc-font-ui\); letter-spacing:-\.008em; color:var\(--sc-ink\);">On the map<\/div>/.test(html),
  sourcesPanel: /<div style="font:620 15px\/22px var\(--sc-font-ui\); letter-spacing:-\.008em; color:var\(--sc-ink\);">Sources<\/div>/.test(html),
  mapNote: plainText(one(/<div style="position:absolute; right:var\(--sc-3\); bottom:var\(--sc-3\);[^"]*">([^<]+)<\/div>/, html) || ''),
});

/* On the map: rows, or the honest-empty form with its basis. The region is bounded to the rail
   so a three-column row elsewhere in the stack cannot be read as a located record. */
const ONMAP_SPLIT = '<div style="display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);">';
const PANEL_KICKER_RE = /<div style="font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.1em; text-transform:uppercase; color:var\(--sc-ink-3\);">([^<]+)<\/div>/;
const PANEL_HEAD_RE = /<h2 style="font:620 15px\/22px var\(--sc-font-ui\); letter-spacing:-\.008em; margin:0; color:var\(--sc-ink\);">([^<]+)<\/h2>/;
const PANEL_BASIS_RE = /<div style="font:400 12px\/17px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-left:2px solid var\(--sc-line\); padding-left:var\(--sc-3\);">([^<]+)<\/div>/;

/** The slice of a board between a marker and the tag that closes the region it sits in. Empty
    when the marker is gone, so a board whose region vanished reads as nothing rather than as
    everything -- the failure mode that made a check pass by matching the whole document. */
const regionFrom = (html, mark, closeTag) => {
  const at = html.indexOf(mark);
  if (at < 0) return '';
  const end = html.indexOf(closeTag, at);
  return end < 0 ? '' : html.slice(at, end + closeTag.length);
};
const MEET_MARK = '<div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Public meetings</div>';
const ONMAP_MARK = '<div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">On the map</div>';

const onMapRows = (html) =>
  regionFrom(html, ONMAP_MARK, '</aside>')
    .split(ONMAP_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 1000);
      const t = one(/<b style="font:600 13px\/18px var\(--sc-font-ui\); color:var\(--sc-ink\);[^"]*">([^<]+)<\/b>/, head);
      if (t === null) return null;
      return { title: plainText(t), addr: plainText(one(/<span style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\);[^"]*">([^<]+)<\/span>/, head) || ''), text: plainText(head) };
    })
    .filter((r) => r !== null);

/** Every panel that renders an absence: kicker, headline, basis. */
function emptyPanels(html) {
  const out = [];
  for (const chunk of html.split('<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3);').slice(1)) {
    const head = chunk.slice(0, 2200);
    const kicker = one(PANEL_KICKER_RE, head);
    if (kicker === null) continue;
    out.push({
      kicker: plainText(kicker),
      headline: plainText(one(PANEL_HEAD_RE, head) || ''),
      basis: plainText(one(PANEL_BASIS_RE, head) || ''),
      text: plainText(head),
    });
  }
  return out;
}

/* The meetings panel, bounded to its own section: rows with an Agenda action, or the not-read
   form with its basis. Unbounded, the decision queue's rows read as meeting rows. */
function meetings(html) {
  const region = regionFrom(html, MEET_MARK, '</section>');
  const rows = [...region.matchAll(/<b style="font:600 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]+)<\/b>\s*<span style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\);">([^<]+)<\/span>/g)].map((m) => ({ t: plainText(m[1]), d: plainText(m[2]) }));
  const agenda = (region.match(/>Agenda<\/span>/g) || []).length;
  const chip = plainText(one(/<span style="font:500 12px\/16px var\(--sc-font-data\); color:var\(--sc-ok\); background:var\(--sc-ok-wash\); border-radius:var\(--sc-r-full\); padding:2px 8px;">([^<]+)<\/span>/, region) || '');
  const notRead = /No meeting packet has been read\./.test(region);
  return { rows, agenda, chip, notRead };
}

/** The four regions in the order they render down the page. */
const SECTION_MARKS = [
  ['Connections', '<div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Connections</div>'],
  ['decision queue', '<div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">What needs you today</div>'],
  ['Across departments', '<h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">Across departments</h2>'],
  ['Public meetings', '<div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Public meetings</div>'],
];
const sectionOrder = (html) => SECTION_MARKS.map(([name, mark]) => ({ name, at: html.indexOf(mark) }));

/** The nav footer's own counts: sources granted, and records reading. */
function footerCounts(html) {
  const foot = plainText(one(/<div style="border-top:1px solid var\(--sc-line-faint\); padding:var\(--sc-3\) var\(--sc-2\);[^"]*">([\s\S]*?)<\/div>/, html) || '');
  const granted = foot.match(/(\d+) of 10 sources granted/);
  const reading = foot.match(/(\d+) of 10 reading records/);
  return { foot, granted: granted ? Number(granted[1]) : null, reading: reading ? Number(reading[1]) : null };
}

/* ------------------------------------------------------------- predicates */

/** The nav names the product's own label sets, badges them, and uses no other badge word. */
const navFaults = (groups, allBadges, label) => {
  const out = [];
  const byGroup = Object.fromEntries(groups.map((g) => [g.group, g.items]));
  const lensItems = byGroup.Lenses || [];
  const workish = [...(byGroup['Work'] || []), ...(byGroup['City'] || [])];
  if (!groups.length) return [label + ' renders no nav groups at all'];
  if (lensItems.map((i) => i.label).join(' | ') !== LENS_LABELS.join(' | ')) {
    const missing = LENS_LABELS.filter((l) => !lensItems.some((i) => i.label === l));
    const extra = lensItems.filter((i) => !LENS_LABELS.includes(i.label)).map((i) => i.label);
    out.push(label + ' renders ' + lensItems.length + ' lens nav row(s) and the product exports ' + LENS_LABELS.length +
      (missing.length ? '; missing ' + missing.map((m) => '"' + m + '"').join(', ') : '') +
      (extra.length ? '; not a lens ' + extra.map((e) => '"' + e + '"').join(', ') : '') +
      (missing.length || extra.length ? '' : '; the order differs from the exported roster order'));
  }
  const workLabels = workish.map((i) => i.label);
  const missingWork = WORK_LABELS.filter((l) => !workLabels.includes(l));
  const extraWork = workLabels.filter((l) => !WORK_LABELS.includes(l));
  if (missingWork.length || extraWork.length) {
    out.push(label + ' renders ' + workish.length + ' work nav row(s) and the shell has ' + WORK_LABELS.length +
      (missingWork.length ? '; missing ' + missingWork.map((m) => '"' + m + '"').join(', ') : '') +
      (extraWork.length ? '; not a work item ' + extraWork.map((e) => '"' + e + '"').join(', ') : ''));
  }
  for (const item of [...lensItems, ...workish]) {
    if (item.badge === null && item.label !== 'Connections') {
      out.push(label + ' nav row "' + item.label + '" carries no badge, and every disposition but Connections is stated');
    }
  }
  for (const b of allBadges) {
    if (!BADGES.some((v) => v.toLowerCase() === String(b).trim().toLowerCase())) {
      out.push(label + ' carries the badge "' + b + '", which is not one of the five the ruling names (' + BADGES.join(' / ') + ')');
    }
  }
  const unbuilt = [...lensItems, ...workish].filter((i) => String(i.badge).toLowerCase() === 'not built').map((i) => i.label);
  const wantUnbuilt = UNBUILT.filter((u) => [...lensItems, ...workish].some((i) => i.label === u));
  if (wantUnbuilt.join(' | ') !== unbuilt.join(' | ')) {
    out.push(label + ' badges ' + (unbuilt.length ? '"' + unbuilt.join('", "') + '"' : 'nothing') + ' NOT BUILT, and the surfaces whose page does not exist are ' + UNBUILT.join(', '));
  }
  return out;
};

/** Six lanes, the ruling's six, each lane saying why it is quiet when it is. */
const laneFaults = (rows, texts, label) => {
  const out = [];
  if (!rows.length) return [label + ' renders no Across-departments lanes at all'];
  const got = rows.map((r) => r.name);
  const missing = LANES.filter((l) => !got.includes(l));
  const extra = got.filter((g) => !LANES.includes(g));
  if (got.length !== LANES.length || missing.length || extra.length) {
    out.push(label + ' renders ' + got.length + ' lane(s) and the ruling names six -- ' + LANES.join(', ') +
      (missing.length ? '; missing ' + missing.map((m) => '"' + m + '"').join(', ') : '') +
      (extra.length ? '; not a lane ' + extra.map((e) => '"' + e + '"').join(', ') : ''));
  }
  for (const r of rows) {
    if (!r.basis) out.push(label + ' lane "' + r.name + '" renders no basis line, and every quiet panel names its source or its absence');
    if (r.facts.length && /no source connected|no records read|nothing (?:is )?(?:connected|granted|read)/i.test(r.basis)) {
      out.push(label + ' lane "' + r.name + '" renders ' + r.facts.length + ' fact(s) while its own basis says nothing was read ("' + r.basis + '"), and the product\'s own test forbids a department card claiming a number nothing has read');
    }
    if (!r.facts.length && !/no source|not (?:granted|connected)|no records read|granted/i.test(r.basis)) {
      out.push(label + ' lane "' + r.name + '" reads nothing and its basis does not say what is missing ("' + r.basis + '")');
    }
    for (const f of r.facts) {
      if (f.v === '0') out.push(label + ' lane "' + r.name + '" renders ' + f.k + ' as 0, and a zero is a claim the city has not made');
    }
  }
  const reading = rows.filter((r) => r.facts.length).length;
  const note = texts.join(' ').match(/(\d+|none) of 6 reading/i) || texts.join(' ').match(/\b(none)\s+reading/i);
  if (!note) out.push(label + ' does not state how many of the six lanes are reading');
  else if (note[1].toLowerCase() !== 'none' && Number(note[1]) !== reading) {
    out.push(label + ' states "' + note[0] + '" over the six lanes and ' + reading + ' of them render a fact read from a source');
  }
  return out;
};

/** Tiles are entry points that never render a zero. */
const tileFaults = (rows, label) => {
  const out = [];
  if (rows.length !== 4) return [label + ' renders ' + rows.length + ' tile(s) and the region is a four-tile row'];
  for (const t of rows) {
    if (!t.dest) out.push(label + ' tile "' + t.label + '" names nowhere to go, and the acceptance is the click');
    if (t.value !== null && Number(t.value) === 0) out.push(label + ' tile "' + t.label + '" renders 0, and a zero here is a claim the city has not made');
    if (t.value === null && !t.unread) out.push(label + ' tile "' + t.label + '" renders neither a value nor "Not read"');
    if (t.value !== null && t.unread) out.push(label + ' tile "' + t.label + '" renders both a value and "Not read"');
    if (t.value !== null && /^(no |not |nothing)/i.test(t.dest)) out.push(label + ' tile "' + t.label + '" shows a value and points at an absence ("' + t.dest + '"), so the click and the number disagree about whether anything was read');
    if (t.value === null && / · /.test(t.dest)) out.push(label + ' tile "' + t.label + '" says "Not read" and points at a filter it cannot open yet');
    if (t.value !== null && !t.arrow) out.push(label + ' tile "' + t.label + '" shows a value and renders no arrow, and a tile is an entry point before it is a number');
    if (t.value === null && t.arrow) out.push(label + ' tile "' + t.label + '" renders "Not read" with an arrow to somewhere it cannot go yet');
  }
  return out;
};

/* Connections moves on the figure the SHIPPED function keys it on -- "granted", read out of
   `placeOverviewConnections` at the product ref -- not on this file's reading of "reads".
   A pack with one grant is connected even while every figure on it still says "Not read", and
   the function's own comment says why: granted is the one figure every honest-empty claim on
   the page already shares, so the move tracks it and the page cannot disagree with itself. */
const connections = (order, granted, label) => {
  const out = [];
  const placed = order.filter((s) => s.at > -1);
  if (placed.length !== order.length) {
    out.push(label + ' does not render all four regions, so the promote/demote move cannot be read (found ' + placed.map((p) => p.name).join(', ') + ')');
    return out;
  }
  if (granted === null) {
    out.push(label + ' states no granted-source count, and Connections is placed on that figure ("' + RULES.connectionsDemoteAt + '") so its position cannot be checked');
    return out;
  }
  const first = [...placed].sort((a, b) => a.at - b.at)[0].name;
  const atTop = first === 'Connections';
  if (granted > 0 && atTop) {
    out.push(label + ' is granted ' + granted + ' of 10 sources and still promotes Connections above the decision queue, where the shipped function demotes it (' +
      RULES.connections.trim() + ', keyed on ' + RULES.connectionsKeyedOn + ': ' + RULES.connectionsDemoteAt + ')');
  }
  if (granted === 0 && !atTop) {
    out.push(label + ' is granted nothing and yet demotes Connections below ' + first + ', and on a zero-grant pack it is the content');
  }
  return out;
};

/** The rail keeps the map and the address lookup, and the atom-type panel does not come back. */
const railFaults = (rail, texts, label) => {
  const out = [];
  if (!rail.lookup) out.push(label + ' has no address lookup in the rail, and the operator kept it explicitly');
  if (!rail.map) out.push(label + ' has no map region in the rail, and the operator kept it explicitly');
  if (!rail.onMap) out.push(label + ' has no "On the map" panel, which is what replaced Sources');
  if (rail.sourcesPanel) out.push(label + ' renders a "Sources" panel, which the ruling replaced with "On the map"');
  const joined = texts.join(' ');
  for (const term of RULES.atomVocabulary) {
    if (joined.includes(term)) out.push(label + ' prints the atom type "' + term + '" on a city-manager surface, which is engine vocabulary leaking through');
  }
  return out;
};

/* A board with no empty state is not a fault -- Main reads, and the honest-empty rule is checked
   once across the design (a design that renders no empty state at all is refused, not passed). */
const emptyPanelFaults = (panels, label) => {
  const out = [];
  for (const p of panels) {
    if (!p.headline) out.push(label + ' the "' + p.kicker + '" state renders no headline');
    if (!p.basis) out.push(label + ' the "' + p.kicker + '" state renders no basis line, and removing one is substantive rather than cosmetic');
  }
  return out;
};

/** Every meeting row carries an Agenda link, and a panel that has rows names the calendar it read. */
const meetingFaults = (m, label) => {
  const out = [];
  if (m.rows.length && m.agenda !== m.rows.length) {
    out.push(label + ' renders ' + m.rows.length + ' meeting row(s) and ' + m.agenda + ' Agenda link(s), and every meeting row carries one');
  }
  if (m.rows.length && !/read/i.test(m.chip)) out.push(label + ' renders meetings without naming the calendar that was read');
  if (!m.rows.length && !m.agenda && !m.chip && !m.notRead) out.push(label + ' renders neither meeting rows nor the not-read form');
  return out;
};

/** Two places on one board state the same count, so they have to tie. */
const countFaults = (foot, chip, onMapSub, onMapRows, label) => {
  const out = [];
  const chipN = chip.match(/^(\d+) of 10$/);
  if (!chipN) out.push(label + ' the Connections chip does not state how many of the ten sources are granted');
  else if (foot.granted === null) out.push(label + ' the nav footer does not state how many sources are granted, so the chip cannot be checked');
  else if (Number(chipN[1]) !== foot.granted) out.push(label + ' the nav footer says ' + foot.granted + ' of 10 sources granted and the Connections chip says ' + chipN[1] + ' of 10');
  const located = onMapSub.match(/(\d+) located/);
  if (located && Number(located[1]) < onMapRows) {
    out.push(label + ' says "' + onMapSub + '" and draws ' + onMapRows + ' row(s), so the count is under its own list');
  }
  return out;
};

/* ------------------------------------------------------------- self-tests */

const HEAD = '<!doctype html><html><body><x-dc><nav style="width:var(--sc-nav);">';
const navGroupFixture = (label, rows) =>
  '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.12em; text-transform:uppercase; color:var(--sc-ink-3); padding:var(--sc-2) var(--sc-3) var(--sc-1);">' + label + '</div>' +
  rows.map(([n, b]) => '<div style="display:flex; align-items:center; gap:var(--sc-2); min-height:28px; padding:3px var(--sc-3);"><span style="flex:1; min-width:0; font:400 14px/20px var(--sc-font-ui); color:var(--sc-ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + n + '</span>' +
    (b ? '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-quiet); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">' + b + '</span>' : '') + '</div>').join('');
const CLEAN_NAV = navGroupFixture('Lenses', LENS_LABELS.map((l) => [l, l === 'Overview' ? 'LIVE RECORDS' : l === 'Parks' ? 'NOT BUILT' : 'EMPTY']))
  + navGroupFixture('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']])
  + navGroupFixture('City', [['Assets', 'EMPTY'], ['Connections', null], ['People and access', 'NOT BUILT']]);

const tileFixture = (label, value, dest, arrow = value !== null) =>
  TILE_SPLIT + '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + label + '</div>' +
  (value === null
    ? '<div style="font:620 15px/32px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>'
    : '<div style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(--sc-ink);">' + value + '</div>') +
  '<div style="display:flex; align-items:center; gap:5px; min-width:0; font:400 12px/16px var(--sc-font-ui); color:var(--sc-accent);"><span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + dest + '</span>' +
  (arrow ? '<svg width="13" height="13" viewBox="0 0 24 24"></svg>' : '') + '</div></div>';
const CLEAN_TILES = tileFixture('Needs a decision', '6', 'Decision queue') + tileFixture('Overdue reviews', '3', 'Plan review · Overdue')
  + tileFixture('Permits in flight', '148', 'Development services · Active') + tileFixture('Meetings this week', null, 'No clerk source');

const laneFixture = (name, facts, basis, rail = '--sc-ok') =>
  LANE_SPLIT + '<div style="background:var(' + rail + '); border-radius:var(--sc-r-full);"></div>' +
  '<div style="min-width:0; display:flex; flex-direction:column; gap:6px;"><div style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + name + '</div>' +
  (facts.length
    ? '<div style="display:flex; flex-wrap:wrap; gap:var(--sc-1) var(--sc-5);">' + facts.map(([v, k]) => '<div style="display:flex; flex-direction:column; gap:0; min-width:0;"><span style="font:400 17px/23px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + v + '</span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-3);">' + k + '</span></div>').join('') + '</div>'
    : '') +
  '<div style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + basis + '</div></div></div>';
const CLEAN_LANES = lanes(LANES.map((l, i) => laneFixture(l, i === 0 ? [['586', 'permits']] : [], i === 0 ? 'mygov · read live for this request' : 'no source connected')).join(''));

const panelFixture = (kicker, headline, basis) =>
  '<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3); padding:var(--sc-6) var(--sc-5);"><div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3);">' + kicker + '</div><h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">' + headline + '</h2><div style="font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + basis + '</div></div>';
const CLEAN_PANELS = panelFixture('Nothing located', 'No located records on this pack.', 'Basis: no located records on this pack.');

const orderFixture = (order) => order.map((n) => SECTION_MARKS.find(([name]) => name === n)[1]).join('<i></i>');
const CLEAN_RAIL = '<div style="display:flex; align-items:center; gap:var(--sc-2); height:28px; padding:0 var(--sc-3); width:340px; border:1px solid var(--sc-line);">Street address</div><div style="height:28px; padding:0 var(--sc-4); border-radius:var(--sc-r-control); background:var(--sc-accent); color:var(--sc-on-accent); display:flex; align-items:center; font:500 13px/18px var(--sc-font-ui);">Search</div><div style="margin:0 var(--sc-4) var(--sc-4); height:300px; border:1px solid var(--sc-line); border-radius:var(--sc-r); background:var(--sc-map-ground, #E7EBEE);"></div><div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">On the map</div>';

/* The meetings and On-the-map regions, in the markup the boards actually use, so the two
   region-bounded extractors are exercised on the shape they will meet. */
const CLEAN_MEETINGS_ROWS = '<div style="display:grid; grid-template-columns:3px minmax(0,1fr) auto; gap:var(--sc-3); align-items:center; padding:10px var(--sc-4); border-bottom:1px solid var(--sc-line-faint);"><div style="align-self:stretch; background:var(--sc-line); border-radius:var(--sc-r-full);"></div><div style="display:flex; flex-direction:column; gap:1px; min-width:0;"><b style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">Zoning Board of Adjustments</b>\n<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">Sep 10 · 6:00 PM</span>\n</div><span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-accent); background:var(--sc-accent-wash); border-radius:var(--sc-r-full); padding:2px 8px;">Agenda</span></div>';
const CLEAN_MEETINGS = '<section style="border:1px solid var(--sc-line);"><div style="display:flex; align-items:center; gap:var(--sc-2); min-height:42px;"><div style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">Public meetings</div><div style="flex:1;"></div><span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-ok); background:var(--sc-ok-wash); border-radius:var(--sc-r-full); padding:2px 8px;">City clerk calendar · read</span></div><div>' + CLEAN_MEETINGS_ROWS + '</div></section>';
const CLEAN_ONMAP = ONMAP_MARK + ONMAP_SPLIT + '<div style="align-self:stretch; background:var(--sc-info); border-radius:var(--sc-r-full);"></div><div style="display:flex; flex-direction:column; gap:1px; min-width:0;"><b style="font:600 13px/18px var(--sc-font-ui); color:var(--sc-ink);">New commercial shell</b>\n<span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">1401 CHESTNUT ST</span>\n</div><span style="font:500 12px/16px var(--sc-font-ui); color:var(--sc-info); background:var(--sc-info-wash); border-radius:var(--sc-r-full); padding:2px 8px;">Permit</span></div></aside>';
const FAILED = [];
const tests = [
  ['nav: accepts the product\'s own label sets', navFaults(navGroups(HEAD + CLEAN_NAV), badges(HEAD + CLEAN_NAV), 'Main').length === 0],
  ['nav: REFUSES a lens the product does not export', navFaults(navGroups(HEAD + CLEAN_NAV.replace('>Finance<', '>Budget<')), badges(HEAD + CLEAN_NAV), 'Main').length === 1],
  ['nav: REFUSES a dropped lens', navFaults(navGroups(HEAD + CLEAN_NAV.replace(/>Parks<\/span>[\s\S]*?<\/div>/, '')), badges(HEAD + CLEAN_NAV), 'Main').length === 1],
  ['nav: REFUSES the roster reordered', navFaults(navGroups(HEAD + navGroupFixture('Lenses', [LENS_LABELS[1], LENS_LABELS[0], ...LENS_LABELS.slice(2)].map((l) => [l, l === 'Parks' ? 'NOT BUILT' : 'EMPTY'])) + navGroupFixture('Work', [['Plan review', 'PREVIEW'], ['Files', 'PREVIEW'], ['Records search', 'NOT BUILT']]) + navGroupFixture('City', [['Assets', 'EMPTY'], ['Connections', null], ['People and access', 'NOT BUILT']])), badges(HEAD + CLEAN_NAV), 'Main').some((f) => /the order differs/.test(f))],
  ['nav: REFUSES a work item the shell does not have', navFaults(navGroups(HEAD + CLEAN_NAV.replace('>Assets<', '>Asset register<')), badges(HEAD + CLEAN_NAV), 'Main').length === 1],
  ['nav: REFUSES a badge outside the five-word vocabulary', navFaults(navGroups(HEAD + CLEAN_NAV.replace('>EMPTY<', '>STALE<')), badges(HEAD + CLEAN_NAV.replace('>EMPTY<', '>STALE<')), 'Main').length === 1],
  ['nav: REFUSES a row that states no disposition', navFaults(navGroups(HEAD + CLEAN_NAV.replace('<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-quiet); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">EMPTY</span>', '')), badges(HEAD + CLEAN_NAV), 'Main').length === 1],
  ['nav: REFUSES NOT BUILT on a surface that does exist', navFaults(navGroups(HEAD + CLEAN_NAV.replace('<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-quiet); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">EMPTY</span>', '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-quiet); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">NOT BUILT</span>')), badges(HEAD + CLEAN_NAV), 'Main').length === 1],
  ['nav: the extractor read the three groups', navGroups(HEAD + CLEAN_NAV).map((g) => g.group + ':' + g.items.length).join(',') === 'Lenses:9,Work:3,City:3'],
  ['lane: accepts the ruling\'s six with their bases', laneFaults(CLEAN_LANES, ['1 of 6 reading'], 'Main').length === 0],
  ['lane: REFUSES a fifth lane', laneFaults(lanes(LANES.slice(0, 5).map((l) => laneFixture(l, [], 'no source connected')).join('')), ['none of 6 reading'], 'Main').length === 1],
  ['lane: REFUSES a lane the ruling does not name', laneFaults(lanes(LANES.map((l) => laneFixture(l === 'Finance' ? 'Budget' : l, [], 'no source connected')).join('')), ['none of 6 reading'], 'Main').length === 1],
  ['lane: REFUSES a lane note that counts a lane not reading', laneFaults(CLEAN_LANES, ['2 of 6 reading'], 'Main').length === 1],
  ['lane: REFUSES a quiet lane with no basis', laneFaults(lanes(laneFixture('Finance', [], '')), ['none of 6 reading'], 'Main').some((f) => /renders no basis line/.test(f))],
  ['lane: REFUSES a fact rendered as zero', laneFaults(lanes(laneFixture('Fleet', [['0', 'assets']], 'samsara · read live for this request')), ['1 of 6 reading'], 'Main').some((f) => /renders assets as 0/.test(f))],
  ['lane: REFUSES a quiet lane whose basis does not say what is missing', laneFaults(lanes(laneFixture('Finance', [], 'quiet this week')), ['none of 6 reading'], 'Main').some((f) => /does not say what is missing/.test(f))],
  ['lane: REFUSES a number drawn under a basis that says nothing was read', laneFaults(lanes(laneFixture('Finance', [['12', 'permits']], 'no source connected')), ['1 of 6 reading'], 'Main').some((f) => /claiming a number nothing has read/.test(f))],
  ['lane: the extractor read names, facts and bases', CLEAN_LANES.length === 6 && CLEAN_LANES[0].facts[0].k === 'permits' && CLEAN_LANES[1].basis === 'no source connected'],
  ['tile: accepts four entry points', tileFaults(tiles(HEAD + CLEAN_TILES), 'Main').length === 0],
  ['tile: REFUSES a zero', tileFaults(tiles(CLEAN_TILES.replace('>6</div>', '>0</div>')), 'Main').some((f) => /renders 0/.test(f))],
  ['tile: REFUSES a tile that names nowhere to go', tileFaults(tiles(CLEAN_TILES.replace('>Decision queue</span>', '><\/span>')), 'Main').some((f) => /names nowhere to go/.test(f))],
  ['tile: REFUSES an unread tile that still renders a value', tileFaults(tiles(CLEAN_TILES.replace('<div style="font:620 15px/32px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink-3);">Not read</div>', '<div style="font:400 26px/32px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(--sc-ink);">2</div>')), 'Main').some((f) => /points at an absence/.test(f))],
  ['tile: REFUSES an unread tile pointing at a filter it cannot open', tileFaults(tiles(CLEAN_TILES.replace('>No clerk source</span>', '>Public meetings · This week</span>')), 'Main').some((f) => /points at a filter it cannot open/.test(f))],
  ['tile: REFUSES a value with no arrow to it', tileFaults(tiles(CLEAN_TILES.replace('<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Decision queue</span><svg width="13" height="13" viewBox="0 0 24 24"></svg>', '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Decision queue</span>')), 'Main').some((f) => /renders no arrow/.test(f))],
  ['tile: REFUSES three tiles', tileFaults(tiles(HEAD + tileFixture('Needs a decision', '6', 'Decision queue') + tileFixture('Overdue reviews', '3', 'Plan review · Overdue') + tileFixture('Meetings this week', '2', 'Public meetings')), 'Main').length === 1],
  ['tile: the extractor read the value and the target', tiles(CLEAN_TILES).map((t) => t.label + '=' + (t.value === null ? 'Not read' : t.value) + '>' + t.dest).join(';') === 'Needs a decision=6>Decision queue;Overdue reviews=3>Plan review · Overdue;Permits in flight=148>Development services · Active;Meetings this week=Not read>No clerk source'],
  ['connections: accepts demoted on a pack granted a source', connections(sectionOrder(orderFixture(['decision queue', 'Across departments', 'Public meetings', 'Connections'])), 7, 'Main').length === 0],
  ['connections: accepts promoted on a pack granted nothing', connections(sectionOrder(orderFixture(['Connections', 'decision queue', 'Across departments', 'Public meetings'])), 0, 'Empty').length === 0],
  ['connections: REFUSES promoted on a pack that is granted one source', connections(sectionOrder(orderFixture(['Connections', 'decision queue', 'Across departments', 'Public meetings'])), 1, 'Sparse').length === 1],
  ['connections: REFUSES demoted on a pack granted nothing', connections(sectionOrder(orderFixture(['decision queue', 'Across departments', 'Public meetings', 'Connections'])), 0, 'Empty').length === 1],
  ['connections: REFUSES a board missing a region', connections(sectionOrder(orderFixture(['decision queue', 'Across departments'])), 7, 'Main').length === 1],
  ['connections: REFUSES a board that states no granted count, rather than passing it', connections(sectionOrder(orderFixture(['Connections', 'decision queue', 'Across departments', 'Public meetings'])), null, 'Sparse').length === 1],
  ['rail: accepts the map, the lookup and On the map', railFaults(railProbe(CLEAN_RAIL), ['the city'], 'Main').length === 0],
  ['rail: REFUSES the Sources panel coming back', railFaults(railProbe(CLEAN_RAIL.replace('>On the map<', '>Sources<')), ['the city'], 'Main').some((f) => /renders a "Sources" panel/.test(f))],
  ['rail: REFUSES the address lookup dropped', railFaults(railProbe(CLEAN_RAIL.replace('Street address', 'Address')), ['the city'], 'Main').length === 1],
  ['rail: REFUSES atom vocabulary on a city-manager surface', railFaults(railProbe(CLEAN_RAIL), ['setback-rule · state effective 2026-01-01'], 'Main').length === 1],
  ['rail: the extractor read the lookup and the map', railProbe(CLEAN_RAIL).lookup && railProbe(CLEAN_RAIL).map && railProbe(CLEAN_RAIL).onMap],
  ['empty: accepts a panel that keeps its basis', emptyPanelFaults(emptyPanels(CLEAN_PANELS), 'Empty').length === 0],
  ['empty: REFUSES a panel that dropped its basis', emptyPanelFaults(emptyPanels(CLEAN_PANELS.replace(/<div style="font:400 12px\/17px[^"]*">[^<]*<\/div>/, '')), 'Empty').length === 1],
  ['empty: REFUSES a panel with no headline', emptyPanelFaults([{ kicker: 'Nothing located', headline: '', basis: 'Basis: nothing.' }], 'Empty').length === 1],
  ['empty: the union is what refuses a design with no empty state at all (see the close)', emptyPanelFaults([], 'Main').length === 0],
  ['empty: the extractor read kicker, headline and basis', emptyPanels(CLEAN_PANELS)[0].headline === 'No located records on this pack.'],
  ['meetings: accepts rows each carrying an Agenda', meetingFaults({ rows: [{ t: 'Zoning Board', d: 'Sep 10' }], agenda: 1, chip: 'City clerk calendar · read' }, 'Main').length === 0],
  ['meetings: REFUSES a row with no Agenda link', meetingFaults({ rows: [{ t: 'Zoning Board', d: 'Sep 10' }, { t: 'Council', d: 'Sep 22' }], agenda: 1, chip: 'City clerk calendar · read' }, 'Main').length === 1],
  ['meetings: REFUSES rows that do not name the calendar read', meetingFaults({ rows: [{ t: 'Zoning Board', d: 'Sep 10' }], agenda: 1, chip: '' }, 'Main').length === 1],
  ['meetings: REFUSES a panel that is neither rows nor the not-read form', meetingFaults({ rows: [], agenda: 0, chip: '', notRead: false }, 'Sparse').length === 1],
  ['meetings: accepts the not-read form', meetingFaults({ rows: [], agenda: 0, chip: '', notRead: true }, 'Sparse').length === 0],
  ['meetings: the extractor read the row, its date and the calendar that was read', meetings(CLEAN_MEETINGS).rows.length === 1 && meetings(CLEAN_MEETINGS).rows[0].t === 'Zoning Board of Adjustments' && meetings(CLEAN_MEETINGS).agenda === 1 && /read/.test(meetings(CLEAN_MEETINGS).chip)],
  ['meetings: REFUSES rows that sit outside the meetings section, so the decision queue is not read as meetings', meetings(CLEAN_MEETINGS_ROWS).rows.length === 0],
  ['meetings: the extractor reads the not-read form when there are no rows', meetings(CLEAN_MEETINGS.replace(CLEAN_MEETINGS_ROWS, '<h2 style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; margin:0; color:var(--sc-ink);">No meeting packet has been read.</h2>')).notRead === true],
  ['onmap: the extractor is bounded to the rail', onMapRows(CLEAN_ONMAP).length === 1 && onMapRows(CLEAN_ONMAP.replace(ONMAP_MARK, '>Elsewhere<')).length === 0],
  ['count: accepts a chip that ties to the footer', countFaults({ granted: 7, reading: 4 }, '7 of 10', '9 located this week', 5, 'Main').length === 0],
  ['count: REFUSES a chip that disagrees with the footer', countFaults({ granted: 7, reading: 4 }, '6 of 10', '9 located this week', 5, 'Main').length === 1],
  ['count: REFUSES a located count under its own list', countFaults({ granted: 7, reading: 4 }, '7 of 10', '2 located this week', 5, 'Main').length === 1],
  ['count: REFUSES a footer that states no granted count', countFaults({ granted: null, reading: 4 }, '7 of 10', '9 located this week', 5, 'Main').length === 1],
  ['the source scan really looked across the product', SCAN.filesScanned === 5 && Object.keys(SCAN.byTerm).length >= 4],
  ['the three NOT BUILT rows came out of the product\'s nav markup, not out of this file', UNBUILT.length === 3 && UNBUILT.includes('Parks') && UNBUILT.includes('Records search')],
];

let selfFailed = 0;
if (process.env.DBG) {
  console.log('DBG nav items   ' + JSON.stringify(navGroups(HEAD + CLEAN_NAV)));
  console.log('DBG nav badges  ' + JSON.stringify(badges(HEAD + CLEAN_NAV)));
  console.log('DBG nav faults  ' + JSON.stringify(navFaults(navGroups(HEAD + CLEAN_NAV), badges(HEAD + CLEAN_NAV), 'Main')));
  console.log('DBG tiles       ' + JSON.stringify(tiles(HEAD + CLEAN_TILES)));
  console.log('DBG tile faults ' + JSON.stringify(tileFaults(tiles(HEAD + CLEAN_TILES), 'Main')));
  console.log('DBG lane faults ' + JSON.stringify(laneFaults(CLEAN_LANES, ['1 of 6 reading'], 'Main')));
  console.log('DBG zero faults ' + JSON.stringify(laneFaults(lanes(laneFixture('Fleet', [['0', 'assets']], 'samsara · read live for this request')), ['1 of 6 reading'], 'Main')));
  console.log('DBG no-basis    ' + JSON.stringify(laneFaults(lanes(laneFixture('Finance', [], '')), ['none of 6 reading'], 'Main')));
  console.log('DBG rail        ' + JSON.stringify(railProbe(CLEAN_RAIL)));
  console.log('DBG rail faults ' + JSON.stringify(railFaults(railProbe(CLEAN_RAIL.replace('>On the map<', '>Sources<')), ['x'], 'Main')));
  console.log('DBG empty       ' + JSON.stringify(emptyPanels(CLEAN_PANELS)));
}
for (const [name, ok] of tests) {
  if (!ok) {
    selfFailed += 1;
    console.error('SELF-TEST FAILED: ' + name);
  }
}
if (selfFailed) {
  console.error('\n' + selfFailed + ' of ' + tests.length + ' self-tests failed. The instrument is broken, so its');
  console.error('verdict on the artboards would be worthless and it does not report one.');
  process.exit(2);
}
console.log('self-tests: ' + tests.length + '/' + tests.length + ' passed, both directions on every rule that has two');

/* ------------------------------------------------------------ the artboards */

const BOARDS = ['Main.dc.html', 'Sparse.dc.html', 'Empty.dc.html'];

const totals = {
  boardsRead: 0, visibleChars: 0, navItems: 0, badges: 0, tiles: 0, lanes: 0,
  sources: 0, onMapRows: 0, emptyPanels: 0, meetingRows: 0, annotations: 0,
};
const REQUIRED = ['boardsRead', 'navItems', 'badges', 'tiles', 'lanes', 'sources', 'onMapRows', 'emptyPanels', 'meetingRows', 'annotations'];
const notes = [];
const problems = [];
const fail = (m) => problems.push(m);

const seenTiles = { numeric: 0, unread: 0 };
for (const file of BOARDS) {
  const p = new URL('./' + file, here);
  if (!fs.existsSync(p)) {
    fail(file + ': declared as an artboard and does not exist, so nothing was checked on it');
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const text = plainText(html);
  const groups = navGroups(html);
  const allBadges = badges(html);
  const tileRows = tiles(html);
  const laneRows = lanes(html);
  const srcRows = sources(html);
  const rail = railProbe(html);
  const mapRows = onMapRows(html);
  const panels = emptyPanels(html);
  const meet = meetings(html);
  const order = sectionOrder(html);
  const foot = footerCounts(html);
  const chip = plainText(one(/<span style="display:inline-flex; align-items:center; gap:5px; font:500 12px\/16px var\(--sc-font-ui\); color:var\(--sc-accent\); background:var\(--sc-accent-wash\); border-radius:var\(--sc-r-full\); padding:2px 8px;">[\s\S]*?>([^<]+)<\/span>/, html) || '');
  const onMapSub = (text.match(/(\d+ located this week)/) || ['', ''])[1];

  totals.boardsRead += 1;
  totals.visibleChars += text.length;
  totals.navItems += groups.reduce((n, g) => n + g.items.length, 0);
  totals.badges += allBadges.length;
  totals.tiles += tileRows.length;
  totals.lanes += laneRows.length;
  totals.sources += srcRows.length;
  totals.onMapRows += mapRows.length;
  totals.emptyPanels += panels.length;
  totals.meetingRows += meet.rows.length;
  for (const t of tileRows) if (t.value === null) seenTiles.unread += 1; else seenTiles.numeric += 1;

  if (text.length < 500) fail(file + ': under 500 characters of visible text, so it was barely rendered');

  for (const f of navFaults(groups, allBadges, file)) fail(file + ': ' + f);
  for (const f of laneFaults(laneRows, [text], file)) fail(file + ': ' + f);
  for (const f of tileFaults(tileRows, file)) fail(file + ': ' + f);
  for (const f of connections(order, foot.granted, file)) fail(file + ': ' + f);
  for (const f of railFaults(rail, [text], file)) fail(file + ': ' + f);
  for (const f of emptyPanelFaults(panels, file)) fail(file + ': ' + f);
  for (const f of meetingFaults(meet, file)) fail(file + ': ' + f);
  for (const f of countFaults(foot, chip, onMapSub, mapRows.length, file)) fail(file + ': ' + f);

  console.log('read ' + file.padEnd(15) + groups.reduce((n, g) => n + g.items.length, 0) + ' nav rows (' + groups.map((g) => g.group).join('/') + '), ' +
    laneRows.length + ' lanes, ' + tileRows.length + ' tiles, ' + srcRows.length + ' source rows, ' + mapRows.length + ' on-map rows, ' +
    panels.length + ' empty panel(s), ' + meet.rows.length + ' meeting row(s)');
}

const README = fs.readFileSync(new URL('./README.md', import.meta.url), 'utf8');
const CANVAS = JSON.parse(fs.readFileSync(new URL('./canvas.json', import.meta.url), 'utf8'));
const annotations = (CANVAS.annotations || []).map((a) => a.text);
totals.annotations = annotations.length;

/* The ruling's own structural moves, checked on the design record as well as the boards. */
if (!new RegExp(RULES.pinnedMap + '').test(README + annotations.join(' ')) || !/pinned/i.test(README + annotations.join(' '))) {
  fail('design: neither the README nor the canvas records that ' + RULES.pinnedMap + ' is pinned rather than designed here');
}
if (!annotations.length) fail('design: the canvas carries no annotation, so the pinned map and the structural move are recorded nowhere');
const onDisk = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html'));
for (const f of onDisk) if (!BOARDS.includes(f)) fail(f + ': an artboard on disk that this instrument does not declare, so it was never checked');
if (!onDisk.length) fail('no artboards on disk at all');

notes.push('the six lanes render in an order that matches neither the product\'s exported roster order nor the order the ruling enumerates them in, so the SET is checked and the order is reported here instead of failed');
notes.push('the rail\'s On-the-map list is a sample like the permit list, so a located count above the rows drawn is a sample and a count below them would be a violation');
notes.push('both tile treatments are exercised across the boards: ' + seenTiles.numeric + ' tile(s) carry a number and ' + seenTiles.unread + ' say "Not read"');
notes.push('the nav footer\'s "N of 10 reading records" counts adapter kinds while the Connections panel draws the granted ones, so the two figures are not the same quantity and are not tied to each other here');
const driftedWords = BADGES.map((b) => b.trim().toUpperCase()).filter((b) => !LENS_BADGE.map((w) => w.toUpperCase()).includes(b));
if (driftedWords.length) {
  notes.push('the ruling\'s five nav words (' + BADGES.join(' / ') + ') and the product\'s shipped LENS_BADGE map (' + LENS_BADGE.join(' / ') +
    ') have drifted apart on ' + driftedWords.length + ' word(s) (' + driftedWords.join(', ') + '); the boards follow the ruling, and reconciling the two vocabularies is the ruling\'s own open item rather than this design\'s');
}

console.log('');
console.log('matched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));
console.log('product side: ' + S._source.repo + ' @ ' + S._source.ref + ' ' + S._source.commit.slice(0, 12) + ' (' + SCAN.filesScanned +
  ' files scanned), ruling ' + S._source.ruling + ' @ ' + S._source.rulingCommit.slice(0, 12) +
  ' (badges ' + BADGES.length + ', lanes ' + LANES.length + ', atom tokens kept off the surface ' + RULES.atomVocabulary.length + ')');

fs.writeFileSync(
  new URL('./instrument-report.json', import.meta.url),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      lane: 'g148-design-instruments',
      design: 'smartcity-overview-lens',
      source: S._source,
      productFacts: {
        lensLabels: LENS_LABELS,
        workLabels: WORK_LABELS,
        badges: BADGES,
        lanes: LANES,
        rules: RULES,
        unbuilt: UNBUILT,
        scan: SCAN,
      },
      matchedInputs: totals,
      notes,
      findings: problems,
    },
    null,
    2,
  ) + '\n',
);

for (const n of notes) console.log('NOTE ' + n);
if (notes.length) console.log('');

if (problems.length) {
  for (const p of problems) console.error('FAIL ' + p);
  console.error('\n' + problems.length + ' violation(s).');
  process.exit(1);
}
const vacuous = REQUIRED.filter((k) => totals[k] === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard -- ' + vacuous.join(', ') + '.');
  console.error('A predicate with no inputs has not passed, it has not run.');
  process.exit(2);
}
console.log('PASS ' + totals.boardsRead + ' artboards, ' + totals.navItems + ' nav rows, ' + totals.lanes + ' lanes, ' + totals.tiles +
  ' tiles and ' + totals.emptyPanels + ' empty panel(s) read, against ' + S._source.ref + ' ' + S._source.commit.slice(0, 12) +
  ' and G-120 (design record: instrument-report.json)');
