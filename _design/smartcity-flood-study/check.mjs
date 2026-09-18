/**
 * Adversarial read of the flood-study artboards against the engine they claim to be drawn against.
 *
 *   node dump-source-facts.mjs && node check.mjs
 *
 * Non-zero exit on a violation. Exit 2 means the instrument REFUSED to report a verdict, which is
 * not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested perfectly and matched
 * nothing on any board, because the canvas rendered display forms and the check looked for the
 * product's codes. It reported success and checked nothing. So:
 *
 *   1. EVERY PREDICATE REPORTS A COUNT of the inputs it matched, and the run refuses a verdict
 *      when a predicate that must have inputs has none.
 *   2. WHERE A RULE'S LEGITIMATE ANSWER IS "nothing found" it is paired with a count of what it
 *      SCANNED. Two of this design's claims are negatives about the engine -- "the model takes no
 *      storm duration" -- so the report carries the number of source files that negative was read
 *      across and the matching line count, and the check fails the claim outright if the product
 *      has since grown one.
 *   3. NOTHING IS COMPARED AGAINST ITSELF. One side of every predicate is an artboard; the other
 *      is source-facts.json, which is the four engine files the README names read at a commit,
 *      the legend parsed out of the Legend component's own item() calls, and the G-130 ruling read
 *      at doc_repo HEAD.
 *
 * WHAT THIS FOUND ON THE SHIPPED BOARDS, NAMED AND NOT FIXED:
 *
 *   THE BASIS LINE ASSERTS AN ABSENCE THE ENGINE DOES NOT HAVE. Every depth control carries
 *   "naming these by return period would need a local rainfall atlas nobody has cited yet". The
 *   README repeats it as one of the corrections: "no depth-to-return-period table anywhere in the
 *   source". The engine names the return period already. floodDrainageClient carries
 *   rainfallCurve (returnPeriodYears <-> depthInches, the study's own NOAA fetch) and
 *   returnPeriodYearsForDepthInches, and FloodTool renders the design storm as
 *   "100-yr (NOAA Atlas 14)" for the default and "~N-yr equivalent (interpolated)" when the depth
 *   was passed as a parameter. The 2026-09-15 correction deleted the invented 2/10/100-year
 *   presets correctly and over-corrected into a claim that no such naming is available.
 *
 * REPORTED AS NOTES, NOT VIOLATIONS: the Empty board's honest-empty copy is an illustration of the
 * reasons the engine can give rather than the engine's own string -- the board says so and shows
 * the verbatim field name, so it is a representable fixture rather than a paraphrase defect; and
 * the boards' depth presets are depths, which is the corrected position, so they are not the
 * deleted return-period presets returning.
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

const BOUND = S.depth;
const LEGEND = S.legend.labels;
const STATES = S.states.jobStates;
const RETRYABLE = S.states.retryable;
const RULING = S.ruling;
const NAMING = S.returnPeriodNaming;
const SCAN = S.scan;

if (!BOUND || BOUND.minInches !== 0 || !(BOUND.maxInches > 0)) refuse('the depth bound did not parse');
if (BOUND.statedRange !== '(' + BOUND.minInches + ', ' + BOUND.maxInches + ']') refuse('the depth bound is not in the (low, high] shape the engine enforces');
if (!Array.isArray(LEGEND) || LEGEND.length !== 9) refuse('the facts file does not carry the source\'s nine legend entries');
if (!Array.isArray(STATES) || STATES.length !== 4) refuse('the facts file does not carry the four job states');
if (!Array.isArray(RETRYABLE) || RETRYABLE.length !== 2) refuse('the facts file does not carry the engine\'s two retryable classes');
if (!RULING || !RULING.servingPhrase || !RULING.vintageRequired) refuse('the G-130 ruling did not carry both the citation limit and the vintage requirement');
if (!NAMING || !NAMING.lookupFunction || !NAMING.curveField) refuse('the facts file does not carry the depth-to-return-period machinery');
if (!SCAN || !Number.isInteger(SCAN.filesScanned) || SCAN.filesScanned <= 0) refuse('the source scan carries no file count, so its negatives support nothing');
if (!SCAN.byTerm || typeof SCAN.byTerm !== 'object') refuse('the scan does not report its matches per term');

const normalize = (s) =>
  String(s)
    .replace(/&Prime;/g, '"')
    .replace(/&mdash;/g, ' ')
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
    .replace(/&Prime;/g, '″')
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const one = (re, s) => {
  const m = s.match(re);
  return m ? m[1] : null;
};

/* The depth presets: one control, rendered as a depth in inches. */
const PRESET_RE = /<span style="font:(?:400|600) 14px\/19px var\(--sc-font-data\); font-variant-numeric:tabular-nums; color:var\(--sc-ink(?:-2)?\);">([^<]+)<\/span>/g;
const presets = (html) => [...html.matchAll(PRESET_RE)].map((m) => plainText(m[1]));

/* The legend: swatch then label, one row per entry. */
const LEGEND_ROW_RE = /<div style="display:flex; align-items:flex-start; gap:7px; min-width:0;"><span style="[^"]*"><\/span><span style="font:400 12px\/16px var\(--sc-font-ui\); color:var\(--sc-ink-2\);[^"]*">([^<]+)<\/span><\/div>/g;
const legendRows = (html) => [...html.matchAll(LEGEND_ROW_RE)].map((m) => plainText(m[1]));

/* The two authority cards: title, badges, value, refusal, footnote. */
const CARD_SPLIT = '<div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--sc-2); padding:var(--sc-4); border:1px solid var(--sc-line); border-left:3px solid ';
const CARD_TITLE_RE = /<span style="flex:1; min-width:120px; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.08em; text-transform:uppercase; color:var\(--sc-ink-3\);">([^<]+)<\/span>/;
const CARD_BADGE_RE = /<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.06em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 5px;">([^<]+)<\/span>/g;
const CARD_VALUE_RE = /<div style="font:650 24px\/30px var\(--sc-font-ui\); letter-spacing:-\.018em; color:var\(--sc-ink\);">([^<]+)<\/div>/;
const CARD_FOOT_RE = /<div style="margin-top:auto; padding-top:var\(--sc-2\); font:400 12px\/17px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-top:1px solid var\(--sc-line-faint\);">([^<]+)<\/div>/;
const CARD_REFUSAL_RE = /<span style="font:400 12px\/17px var\(--sc-font-ui\); color:var\(--sc-warn\);">(Refused:[^<]+)<\/span>/;

function authorityCards(html) {
  return html
    .split(CARD_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 4000);
      return {
        accent: chunk.slice(0, chunk.indexOf('"')),
        title: one(CARD_TITLE_RE, head),
        badges: [...head.matchAll(CARD_BADGE_RE)].map((m) => m[1]),
        value: one(CARD_VALUE_RE, head),
        refusal: one(CARD_REFUSAL_RE, head),
        footnote: one(CARD_FOOT_RE, head),
        text: plainText(head),
      };
    })
    .filter((c) => c.title !== null);
}

/* The running board's rows: permit, state, result. */
const RUN_ROW_SPLIT = '<div style="display:grid; grid-template-columns:116px minmax(0,1.4fr) 128px minmax(0,1fr) minmax(0,1.15fr);';
const RUN_STATE_RE = /<span style="justify-self:start; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.04em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 6px;">([^<]+)<\/span>/;
const RUN_RESULT_RE = /<span style="font:400 13px\/18px var\(--sc-font-data\); font-variant-numeric:tabular-nums; color:var\(--sc-[a-z0-9-]+\); text-align:right;[^"]*">([^<]+)<\/span>/;

function runRows(html) {
  return html
    .split(RUN_ROW_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 2200);
      const state = one(RUN_STATE_RE, head);
      if (state === null) return null;
      const result = one(RUN_RESULT_RE, head);
      return { permit: plainText(head).split(' ')[0], state, result: result === null ? '' : plainText(result) };
    })
    .filter((r) => r !== null);
}

/* The drawn picture: the parcel ring and the ponding ellipse in the same SVG. */
const shoelace = (pts) => {
  let sum = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
};
const VIZ_SVG_SPLIT = '<svg viewBox="0 0 520 400"';
const RING_RE = /<path d="(M[^"]*Z)" fill="none" stroke="var\(--sc-ink\)" stroke-width="2.2"/;
const ELLIPSE_RE = /<ellipse cx="[\d.]+" cy="[\d.]+" rx="([\d.]+)" ry="([\d.]+)"/;
const EXIT_MARK_RE = /<g transform="translate\([\d. ]+\) rotate\([\d.]+\)">/g;

function pondingShapes(html) {
  const out = [];
  for (const chunk of html.split(VIZ_SVG_SPLIT).slice(1)) {
    const body = chunk.slice(0, chunk.indexOf('</svg>'));
    const ring = one(RING_RE, body);
    const rx = Number(one(ELLIPSE_RE, body));
    const ry = Number((body.match(ELLIPSE_RE) || [])[2]);
    if (ring === null || !Number.isFinite(rx) || !Number.isFinite(ry)) continue;
    const pts = [...ring.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
    if (pts.length < 3) continue;
    out.push({ share: (Math.PI * rx * ry * 100) / shoelace(pts), exits: [...body.matchAll(EXIT_MARK_RE)].length });
  }
  return out;
}

/* The shares the figure claims, in the two shapes the boards state them. */
const SHARE_ROW_RE = /<span[^>]*>Share of the parcel<\/span>\s*<span[^>]*>(\d+(?:\.\d+)?)%<\/span>/g;
const SHARE_PROSE_RE = /(\d+)\s*(?:percent|%)\s*of the parcel/gi;
const statedShares = (text) => [...new Set([...[...text.matchAll(SHARE_ROW_RE)].map((m) => Number(m[1])), ...[...text.matchAll(SHARE_PROSE_RE)].map((m) => Number(m[1]))])];

/* The Empty board's three states: title, kicker, headline, basis. */
const EMPTY_HEAD_SPLIT = '<span style="font:620 15px/22px var(--sc-font-ui); letter-spacing:-.008em; color:var(--sc-ink);">';
const EMPTY_HEAD_RE = /^([^<]+)<\/span>\s*<span style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\);">([^<]+)<\/span>/;
const EMPTY_HEADLINE_RE = /<div style="font:620 15px\/22px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]+)<\/div>/;
const EMPTY_BASIS_RE = /<div style="margin-top:var\(--sc-1\); font:400 12px\/17px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-left:2px solid var\(--sc-line\); padding-left:var\(--sc-3\);">([^<]+)<\/div>/;

function emptyStates(html) {
  return html
    .split(EMPTY_HEAD_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 2600);
      const m = chunk.match(EMPTY_HEAD_RE);
      if (!m) return null;
      if (one(EMPTY_BASIS_RE, head) === null) return null;
      return {
        title: plainText(m[1]),
        kicker: plainText(m[2]),
        headline: one(EMPTY_HEADLINE_RE, head),
        basis: one(EMPTY_BASIS_RE, head),
        text: plainText(head),
      };
    })
    .filter((s) => s !== null);
}

/* ------------------------------------------------------------- predicates */

/** The depth the control offers is the depth the engine accepts, and nothing else is named. */
const PERIOD_LABEL_RE = /\d[\s-]*(?:yr|year|hour|hr|h)\b/i;
const depthRangeFaults = (texts, boardLabel) => {
  const out = [];
  const stated = [...new Set(texts.flatMap((t) => [...t.matchAll(/\((\d+),\s*(\d+)\]/g)].map((m) => '(' + m[1] + ', ' + m[2] + ']')))];
  if (!stated.length) out.push(boardLabel + ' states no accepted depth range, so the bound the control honours is not on the page');
  for (const s of stated) if (s !== BOUND.statedRange) out.push(boardLabel + ' states the accepted range as ' + s + ' and the engine rejects outside ' + BOUND.statedRange + ' ("' + BOUND.engineMessage + '")');
  return out;
};
const presetFaults = (labels, boardLabel) => {
  const out = [];
  if (!labels.length) return [boardLabel + ' renders no depth preset, so the control has nothing to honour the bound with'];
  for (const label of labels) {
    const m = label.match(/^(\d+)\s*(?:″|"|inches|in)?$/);
    if (PERIOD_LABEL_RE.test(label)) {
      out.push(boardLabel + ' labels a preset "' + label + '", which names a storm duration or return period the engine does not accept');
    } else if (!m) {
      out.push(boardLabel + ' renders the preset "' + label + '" as neither a depth in inches nor anything the engine takes');
    } else if (!(Number(m[1]) > BOUND.minInches && Number(m[1]) <= BOUND.maxInches)) {
      out.push(boardLabel + ' offers the preset ' + m[1] + ' inches and the engine accepts strictly more than ' + BOUND.minInches + ' and at most ' + BOUND.maxInches);
    }
  }
  return out;
};
const depthFaults = (texts, presetLabels, boardLabel) => depthRangeFaults(texts, boardLabel).concat(presetFaults(presetLabels, boardLabel));

/** The design's stated source state about the depth control, read in both directions. */
const NO_DURATION_RE = /takes no storm duration|no storm duration|there is no duration in it/i;
const NO_PERIOD_NAMING_RE = /nobody has cited|would need a local rainfall atlas|no return[- ]period (?:table|naming)|no depth-to-return-period/i;
const claimFaults = (texts, boardLabel) => {
  const out = [];
  const noDuration = texts.filter((t) => NO_DURATION_RE.test(t));
  const noPeriodNaming = texts.filter((t) => NO_PERIOD_NAMING_RE.test(t));
  if (!noDuration.length && !noPeriodNaming.length) return [boardLabel + ' states no position on how a depth can be named, so the claim this design was corrected to is unchecked'];
  if (noDuration.length && SCAN.byTerm.duration > 0) {
    out.push(boardLabel + ' states the model takes no storm duration and ' + S._source.files.tool + ' carries ' + SCAN.byTerm.duration + ' duration reference(s) at ' + S._source.commit.slice(0, 8) + ', so the claim is stale');
  }
  if (noPeriodNaming.length && NAMING.byTerm.returnPeriod > 0) {
    out.push(
      boardLabel + ' states that naming a depth by return period is unavailable -- "would need a local rainfall atlas nobody has cited yet" -- and the engine names it already: ' +
        NAMING.sourceField + ' carries ' + NAMING.sourceValues.join('/') + ', ' + NAMING.atlas + ' is cited ' + NAMING.byTerm['noaa-atlas14'] +
        ' time(s) across the four files, ' + NAMING.curveField + ' pairs return period to depth, and ' + NAMING.lookupFunction +
        ' renders the default as "' + NAMING.defaultValueLabel + '" and a passed depth as "' + NAMING.interpolatedForm + '"',
    );
  }
  return out;
};

/** The legend is the product's nine entries, in the product's order, with the ponding entry conditional. */
const legendFaults = (labels, texts, boardLabel) => {
  const out = [];
  if (!labels.length) return [boardLabel + ' renders no legend at all, so the picture has no key'];
  const want = LEGEND.map(normalize);
  const got = labels.map(normalize);
  if (got.join(' | ') !== want.join(' | ')) {
    const missing = want.filter((w) => !got.includes(w));
    const extra = got.filter((g) => !want.includes(g));
    out.push(
      boardLabel + ' renders ' + labels.length + ' legend entries and the source renders ' + LEGEND.length + ' in source order' +
        (missing.length ? '; missing ' + missing.map((m) => '"' + m + '"').join(', ') : '') +
        (extra.length ? '; not in source ' + extra.map((e) => '"' + e + '"').join(', ') : '') +
        (missing.length || extra.length ? '' : '; the order differs'),
    );
  }
  if (S.legend.pondingConditional && !/(\d+)\s*$|drops out of the legend|legend entry with nothing behind it|ponding entry drops/i.test(texts.join(' '))) {
    out.push(boardLabel + ' does not state that the ponding legend entry is conditional, and the source renders it only when ponding is drawn');
  }
  return out;
};

/** A run that did not answer keeps its own name, stays retryable, and is never written down as a result. */
const runRowFaults = (rows, texts, boardLabel) => {
  const out = [];
  if (!rows.length) return [boardLabel + ' renders no run rows, so the failure classes have nowhere to appear'];
  const failed = rows.filter((r) => !STATES.includes(r.state.toLowerCase()) && /timeout|unreachable|fail|error/i.test(r.state));
  for (const name of ['timeout', 'unreachable']) {
    if (!rows.some((r) => new RegExp(name, 'i').test(r.state))) out.push(boardLabel + ' has no row in the engine\'s ' + name + ' class, so that class was not checked');
  }
  for (const r of failed) {
    if (/(?:ac|acre|ponding|none)\b/i.test(r.result)) {
      out.push(boardLabel + ' writes the ' + r.state + ' row for ' + r.permit + ' down as a result ("' + r.result + '"), and a parcel the engine never answered is not a parcel that does not pond');
    } else if (!/retry/i.test(r.result)) {
      out.push(boardLabel + ' row ' + r.permit + ' is in the ' + r.state + ' class and offers no retry, and both of the engine\'s retryable classes are retryable');
    }
  }
  if (!/never recorded as a parcel that does not pond|not a parcel that does not pond/i.test(texts.join(' '))) {
    out.push(boardLabel + ' does not state that a run which did not answer is never recorded as a parcel that does not pond');
  }
  return out;
};

/** One authoritative card, one modeled card, the citation limit on the authoritative one only. */
const authorityFaults = (cards, boardLabel) => {
  const out = [];
  const regulatory = cards.filter((c) => c.badges.includes('REGULATORY'));
  const modeled = cards.filter((c) => c.badges.includes('NOT A DETERMINATION'));
  if (regulatory.length !== 1) return [boardLabel + ' renders ' + regulatory.length + ' card(s) badged REGULATORY and the determination is a single card'];
  if (modeled.length !== 1) return [boardLabel + ' renders ' + modeled.length + ' card(s) badged NOT A DETERMINATION and the model is a single card'];
  const reg = regulatory[0];
  const mod = modeled[0];
  if (!reg.refusal) out.push(boardLabel + ' the authoritative card carries no refused affordance, so the citation limit is not a control on the surface');
  else if (!/provisional for citation/i.test(reg.refusal)) out.push(boardLabel + ' the refusal on the authoritative card does not give the ruling\'s reason (' + RULING.servingQuote.slice(0, 80) + ')');
  if (mod.refusal) out.push(boardLabel + ' the citation refusal sits on the modeled card, which G-130 does not govern, and leaves the authoritative card unrestricted');
  if (!/\d{4}-?\d{2}-?\d{2}|N ?FHL|read \d/i.test(reg.footnote || '')) out.push(boardLabel + ' the authoritative card carries no vintage, and the ruling requires the surviving determination to carry one');
  if (!/authoritative for serving/i.test(reg.footnote || '')) out.push(boardLabel + ' the authoritative card does not state that the rail is authoritative for serving');
  if (!/not governed by g-?130/i.test(mod.footnote || '')) out.push(boardLabel + ' the modeled card does not state that it is not governed by G-130, so the two cards read as one authority');
  if (!/not a (?:flood )?determination/i.test(mod.footnote || '')) out.push(boardLabel + ' the modeled card does not state that it is not a determination');
  return out;
};

/** The drawn ponding is the share the figures state, and no drawn share is unclaimed. */
const geometryFaults = (shapes, shares, texts, boardLabel) => {
  const out = [];
  if (!shapes.length) return [boardLabel + ' draws no ponding shape, so the figure cannot be compared to the picture'];
  if (!shares.length) return [boardLabel + ' states no share of the parcel, so the drawn ponding has nothing to be checked against'];
  for (const s of shares) {
    if (!shapes.some((p) => Math.abs(p.share - s) <= 3)) {
      out.push(boardLabel + ' states ' + s + ' percent of the parcel ponded and no drawn ponding shape is within 3 points of it (drawn: ' + shapes.map((p) => p.share.toFixed(1) + '%').join(', ') + ')');
    }
  }
  for (const p of shapes) {
    if (!shares.some((s) => Math.abs(p.share - s) <= 3)) {
      out.push(boardLabel + ' draws ponding across ' + p.share.toFixed(1) + ' percent of the parcel ring and no figure on the board claims that share, so the picture asserts a number the panel does not');
    }
  }
  const statedExits = [...texts.join(' ').matchAll(/(?:^|\s)(?:one|\d+)\s+exit/gi)].length;
  if (statedExits && !shapes.some((p) => p.exits > 0)) out.push(boardLabel + ' states an exit and draws no exit marker');
  return out;
};

/** The three look-alike states are three states. */
const emptyStateFaults = (states, boardLabel) => {
  const out = [];
  if (states.length !== 3) return [boardLabel + ' renders ' + states.length + ' state(s) and the design is about three that look alike and are not'];
  const kickers = states.map((s) => normalize(s.kicker));
  if (new Set(kickers).size !== 3) out.push(boardLabel + ' renders two states with the same kicker, so the states are not told apart by their reason');
  if (new Set(states.map((s) => normalize(s.headline))).size !== 3) out.push(boardLabel + ' renders two states with the same headline');
  if (new Set(states.map((s) => normalize(s.basis))).size !== 3) out.push(boardLabel + ' renders two states whose basis is the same, so one of them is unsupported');
  const gap = states.find((s) => /capability gap/i.test(s.kicker));
  const declined = states.find((s) => /refusal/i.test(s.kicker));
  const empty = states.find((s) => /result, not an absence/i.test(s.kicker));
  if (!gap) out.push(boardLabel + ' has no state for a pack with no geometry, which is the capability gap rather than a result');
  if (!declined) out.push(boardLabel + ' has no state for a study the engine declined, which is the engine authoring a reason');
  if (!empty) out.push(boardLabel + ' has no state for a study that ran and found nothing, which is a result');
  if (declined && !/study\.honestEmpty/.test(declined.basis || '')) out.push(boardLabel + ' the declined state does not name study.honestEmpty, the field whose reason is rendered verbatim');
  if (declined && !/verbatim/i.test(declined.text)) out.push(boardLabel + ' the declined state does not say the engine\'s reason is rendered verbatim');
  if (empty && !/(drainage zones|flow paths)/i.test(empty.text)) out.push(boardLabel + ' the no-ponding state does not say the drainage zones and flow paths are still drawn, and they are the result');
  return out;
};

/** Numbers the screen prints about itself tie. */
const arithmeticFaults = (text, rows, boardLabel) => {
  const out = [];
  const screened = text.match(/Permits screened (\d+) of (\d+) in flight/);
  const notYet = text.match(/Not yet screened (\d+)/);
  const ponding = text.match(/Model ponding (\d+) at/);
  const pipeline = text.match(/Pipeline (\d+)/);
  const footer = text.match(/(\d+) screened · (\d+) model ponding/);
  if (!screened || !notYet) return [boardLabel + ' does not print the screened/not-yet-screened pair, so the screening arithmetic cannot be checked'];
  const total = Number(screened[2]);
  if (Number(screened[1]) + Number(notYet[1]) !== total) out.push(boardLabel + ' prints ' + screened[1] + ' screened + ' + notYet[1] + ' not yet screened and ' + total + ' in flight, which do not add up');
  if (pipeline && Number(pipeline[1]) !== total) out.push(boardLabel + ' prints ' + pipeline[1] + ' in the Pipeline tab and ' + total + ' in flight on the same screen');
  if (footer && Number(footer[1]) !== Number(screened[1])) out.push(boardLabel + ' the list footer says "' + footer[1] + ' screened" and the stat row says ' + screened[1]);
  if (footer && ponding && Number(footer[2]) !== Number(ponding[1])) out.push(boardLabel + ' the list footer says "' + footer[2] + ' model ponding" and the stat row says ' + ponding[1]);
  const progress = text.match(/(\d+) of (\d+) complete/);
  if (progress) {
    if (rows.length !== Number(progress[2])) out.push(boardLabel + ' says "' + progress[0] + '" and renders ' + rows.length + ' row(s)');
    const done = rows.filter((r) => /^(complete|ready)$/i.test(r.state)).length;
    if (done !== Number(progress[1])) out.push(boardLabel + ' says ' + progress[1] + ' complete and ' + done + ' row(s) are in a finished state');
  }
  return out;
};

/* ------------------------------------------------------------- self-tests */

const HEAD = '<!doctype html><html><body><x-dc>';
const presetFixture = (label, weight = 400) => '<span style="font:' + weight + ' 14px/19px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink' + (weight === 600 ? '' : '-2') + ');">' + label + '</span>';
const legendFixture = (label) => '<div style="display:flex; align-items:flex-start; gap:7px; min-width:0;"><span style="flex:none; width:14px; height:10px; background:var(--sc-info);"></span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2); overflow-wrap:break-word;">' + label + '</span></div>';
const cardFixture = (title, badges, body, footnote, refusal) =>
  CARD_SPLIT + 'var(--sc-ink-2); border-radius:var(--sc-r); background:var(--sc-surface);"><div style="display:flex; align-items:center; gap:var(--sc-2); flex-wrap:wrap;"><span style="flex:1; min-width:120px; font:500 12px/16px var(--sc-font-data); letter-spacing:.08em; text-transform:uppercase; color:var(--sc-ink-3);">' + title + '</span>' +
  badges.map((b) => '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-quiet); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">' + b + '</span>').join('') +
  '</div><div style="font:650 24px/30px var(--sc-font-ui); letter-spacing:-.018em; color:var(--sc-ink);">' + body + '</div>' +
  (refusal ? '<span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-warn);">' + refusal + '</span>' : '') +
  '<div style="margin-top:auto; padding-top:var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-top:1px solid var(--sc-line-faint);">' + footnote + '</div></div>';
const runRowFixture = (permit, state, result) =>
  RUN_ROW_SPLIT + ' gap:0 var(--sc-4);"><span style="font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink);">' + permit + '</span><span style="justify-self:start; font:500 12px/16px var(--sc-font-data); letter-spacing:.04em; color:var(--sc-warn); background:var(--sc-warn-wash); border-radius:var(--sc-r-control); padding:1px 6px;">' + state + '</span><span style="font:400 13px/18px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-warn); text-align:right; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + result + '</span></div>';
const ringFixture = 'M196 178 L292 170 L300 254 L204 262 Z';
const svgFixture = (rx, ry, exits = 1) =>
  VIZ_SVG_SPLIT + ' width="100%"><rect width="520" height="400"/><ellipse cx="247" cy="220" rx="' + rx + '" ry="' + ry + '" fill="var(--sc-info)" fill-opacity=".42"/><path d="' + ringFixture + '" fill="none" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
  Array.from({ length: exits }, (_, i) => '<g transform="translate(' + (300 + i) + ' 340) rotate(38)"></g>').join('') + '</svg>';
const shareRowFixture = (n) => '<span style="flex:1; font:400 13px/18px var(--sc-font-ui); color:var(--sc-ink-2);">Share of the parcel</span><span style="font:400 16px/22px var(--sc-font-data); font-variant-numeric:tabular-nums; color:var(--sc-ink);">' + n + '%</span>';
const emptyStateFixture = (title, kicker, headline, body, basis) =>
  EMPTY_HEAD_SPLIT + title + '</span><span style="font:400 12px/16px var(--sc-font-data); color:var(--sc-ink-3);">' + kicker + '</span><div><div style="font:620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">' + headline + '</div><div>' + body + '</div><div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">' + basis + '</div></div>';

const CLEAN_REG_CARD = cardFixture('Regulatory flood zone', ['REGULATORY'], 'Zone X', 'Parcel-record flood rail · NFHL_48_20260101 · read 12 Sep. Authoritative for serving.', 'Refused: provisional for citation, and not to be relied on to skip an engineer.');
const CLEAN_MOD_CARD = cardFixture('Modeled drainage', ['NOT A DETERMINATION'], '{x}', 'Drainage engine · run 11 Sep. Not a flood determination and not governed by G-130.', null);
const CLEAN_CARDS = CLEAN_REG_CARD + CLEAN_MOD_CARD;
const CLEAN_ROWS = runRowFixture('B-26-0344', 'Engine timeout', 'retry') + runRowFixture('B-26-0339', 'Engine unreachable', 'retry') + runRowFixture('B-26-0418', 'Complete', '0.41 ac ponding');
const CLEAN_FAILURE_LINE = 'Timeout and unreachable are the engine\'s two retryable classes and each keeps its own name. A parcel that did not answer is never recorded as a parcel that does not pond.';

const SHARE_PROSE_FIXTURE = 'Ponding modeled across 34 percent of the parcel at this depth.';
const SHARE_ROW_FIXTURE = shareRowFixture(73);
const EMPTY_FIXTURES =
  emptyStateFixture('Nothing to model', 'a capability gap', 'No parcel geometry.', 'A study starts from the ring.', 'Basis: no parcel source granted on this pack.') +
  emptyStateFixture('The engine answered, and declined', 'a refusal the engine authors', 'The study ran and produced no model.', 'The engine states the reason and the surface renders that reason verbatim.', 'Basis: study.honestEmpty carries the reason. Never paraphrased.') +
  emptyStateFixture('The engine answered, and found nothing', 'a result, not an absence', 'No modeled ponding on this parcel.', 'The drainage zones and flow paths are still drawn, because they are the result.', 'Basis: engine returned a study with no ponding geometry.');

const tests = [
  ['depth: accepts the engine\'s own bound', depthFaults(['Engine accepts any depth in (0, 60].'], ['2″', '4″', '60″'], 'Main').length === 0],
  ['depth: REFUSES a bound that is not the engine\'s', depthFaults(['Engine accepts any depth in (0, 48].'], ['4″'], 'Main').length === 1],
  ['depth: REFUSES a board that states no bound at all', depthFaults(['A depth is a depth.'], ['4″'], 'Main').length === 1],
  ['depth: REFUSES a preset outside the engine range', depthFaults(['(0, 60]'], ['72″'], 'Main').length === 1],
  ['depth: REFUSES the zero depth the engine rejects', depthFaults(['(0, 60]'], ['0″'], 'Main').length === 1],
  ['depth: REFUSES a preset labelled by return period', depthFaults(['(0, 60]'], ['10-year'], 'Main').length === 1],
  ['depth: REFUSES a preset labelled by storm duration', depthFaults(['(0, 60]'], ['24-hour'], 'Main').length === 1],
  ['depth: the preset extractor read the control', presets(HEAD + presetFixture('2″') + presetFixture('4″', 600)).join(',') === '2″,4″'],
  ['claim: the no-duration claim holds against the engine', claimFaults(['the model takes no storm duration'], 'Main').length === 0],
  ['claim: REFUSES the return-period claim the engine contradicts', claimFaults(['naming these by return period would need a local rainfall atlas nobody has cited yet'], 'Main').length === 1],
  ['claim: REFUSES a design that states neither position', claimFaults(['A depth is a depth.'], 'Main').length === 1],
  ['claim: the source scan really looked across the engine', SCAN.filesScanned === 4 && Object.keys(SCAN.byTerm).length >= 4],
  ['legend: accepts the source\'s nine in source order', legendFaults(LEGEND, ['the ponding entry drops out of the legend'], 'Parcel').length === 0],
  ['legend: REFUSES a dropped entry', legendFaults(LEGEND.slice(0, 8), ['ponding entry drops out of the legend'], 'Parcel').length === 1],
  ['legend: REFUSES an invented entry', legendFaults(LEGEND.concat(['Basement']), ['ponding entry drops out of the legend'], 'Parcel').length === 1],
  ['legend: REFUSES the source order changed', legendFaults([...LEGEND].reverse(), ['ponding entry drops out of the legend'], 'Parcel').length === 1],
  ['legend: REFUSES a conditional entry stated as unconditional', legendFaults(LEGEND, ['nine entries'], 'Parcel').length === 1],
  ['legend: the extractor read the rows', legendRows(HEAD + legendFixture('Parcel') + legendFixture('Flow path')).join(',') === 'Parcel,Flow path'],
  ['rows: accepts a timeout row that keeps its name and retries', runRowFaults(runRows(HEAD + CLEAN_ROWS), [CLEAN_FAILURE_LINE], 'Running').length === 0],
  ['rows: REFUSES a timed-out parcel written down as a result', runRowFaults(runRows(HEAD + runRowFixture('B-26-0344', 'Engine timeout', 'none modeled') + runRowFixture('B-26-0339', 'Engine unreachable', 'retry')), [CLEAN_FAILURE_LINE], 'Running').length === 1],
  ['rows: REFUSES a failure class with no retry offered', runRowFaults(runRows(HEAD + runRowFixture('B-26-0344', 'Engine timeout', '—') + runRowFixture('B-26-0339', 'Engine unreachable', 'retry')), [CLEAN_FAILURE_LINE], 'Running').length === 1],
  ['rows: REFUSES a board that lost one of the two classes', runRowFaults(runRows(HEAD + runRowFixture('B-26-0344', 'Engine timeout', 'retry')), [CLEAN_FAILURE_LINE], 'Running').length === 1],
  ['rows: REFUSES a board that stopped saying a non-answer is not a result', runRowFaults(runRows(HEAD + CLEAN_ROWS), ['two retryable classes'], 'Running').length === 1],
  ['rows: the extractor read the states and results', runRows(HEAD + CLEAN_ROWS).map((r) => r.state + '=' + r.result).join(';') === 'Engine timeout=retry;Engine unreachable=retry;Complete=0.41 ac ponding'],
  ['authority: accepts the ruling\'s placement', authorityFaults(authorityCards(HEAD + CLEAN_CARDS), 'Parcel').length === 0],
  ['authority: REFUSES the refusal moved onto the modeled card', authorityFaults(authorityCards(HEAD + cardFixture('Regulatory flood zone', ['REGULATORY'], 'Zone X', 'NFHL_48_20260101. Authoritative for serving. Not a flood determination and not governed by G-130.', null) + cardFixture('Modeled drainage', ['NOT A DETERMINATION'], '{x}', 'Not a flood determination and not governed by G-130.', 'Refused: provisional for citation.')), 'Parcel').some((f) => /refusal sits on the modeled card/.test(f))],
  ['authority: REFUSES an authoritative card with no vintage', authorityFaults(authorityCards(HEAD + cardFixture('Regulatory flood zone', ['REGULATORY'], 'Zone X', 'Parcel-record flood rail. Authoritative for serving.', 'Refused: provisional for citation.') + CLEAN_MOD_CARD), 'Parcel').length === 1],
  ['authority: REFUSES the model badged as a determination', authorityFaults(authorityCards(HEAD + CLEAN_REG_CARD + cardFixture('Modeled drainage', ['REGULATORY'], '{x}', 'Not a flood determination and not governed by G-130.', null)), 'Parcel').length === 1],
  ['authority: the extractor read the badges and the refusal', authorityCards(HEAD + CLEAN_CARDS).map((c) => c.title + '/' + c.badges.join('+')).join(';') === 'Regulatory flood zone/REGULATORY;Modeled drainage/NOT A DETERMINATION'],
  ['geometry: accepts a picture that matches its figure', geometryFaults(pondingShapes(svgFixture(38, 23)), statedShares(SHARE_PROSE_FIXTURE), ['one exit'], 'Parcel').length === 0],
  ['geometry: REFUSES a ponding shape drifting past its figure', geometryFaults(pondingShapes(svgFixture(56, 34)), statedShares(SHARE_PROSE_FIXTURE), ['one exit'], 'Parcel').some((f) => /no drawn ponding shape is within 3 points/.test(f))],
  ['geometry: REFUSES a drawn share no figure claims', geometryFaults(pondingShapes(svgFixture(56, 34) + svgFixture(38, 23)), statedShares(SHARE_PROSE_FIXTURE), ['one exit'], 'Parcel').some((f) => /no figure on the board claims that share/.test(f))],
  ['geometry: REFUSES a figure with no picture behind it', geometryFaults(pondingShapes(svgFixture(38, 23)), statedShares('Ponding modeled across 73 percent of the parcel.'), ['one exit'], 'Parcel').some((f) => /no drawn ponding shape is within 3 points/.test(f))],
  ['geometry: the extractor read the ring and the ellipse', Math.abs(pondingShapes(svgFixture(38, 23))[0].share - 33.8) < 0.5],
  ['geometry: the share extractor reads both shapes the boards use', statedShares(SHARE_ROW_FIXTURE + ' and 34 percent of the parcel').sort().join(',') === '34,73'],
  ['empty: accepts three states that are not collapsed', emptyStateFaults(emptyStates(HEAD + EMPTY_FIXTURES), 'Empty').length === 0],
  ['empty: REFUSES two states collapsed into one', emptyStateFaults(emptyStates(HEAD + emptyStateFixture('Nothing to model', 'a capability gap', 'No parcel geometry.', 'No geometry.', 'Basis: no parcel source.')), 'Empty').length >= 1],
  ['empty: REFUSES a declined state without the verbatim field', emptyStateFaults(emptyStates(HEAD + EMPTY_FIXTURES.replace('study.honestEmpty', 'the study')), 'Empty').length === 1],
  ['empty: REFUSES a no-ponding state that drops the zones and flow paths', emptyStateFaults(emptyStates(HEAD + EMPTY_FIXTURES.replace(/the drainage zones and flow paths are still drawn/i, 'nothing else is drawn')), 'Empty').length === 1],
  ['empty: the extractor read the three kickers', emptyStates(HEAD + EMPTY_FIXTURES).map((s) => s.kicker).length === 3],
  ['arithmetic: accepts a screen that adds up', arithmeticFaults('Permits screened 112 of 304 in flight Not yet screened 192 Pipeline 304 Model ponding 31 at 4″ 112 screened · 31 model ponding', [], 'Main').length === 0],
  ['arithmetic: REFUSES a screened pair that misses the total', arithmeticFaults('Permits screened 112 of 304 in flight Not yet screened 100 Pipeline 304 Model ponding 31 at 4″', [], 'Main').length === 1],
  ['arithmetic: REFUSES a footer that disagrees with the stat row', arithmeticFaults('Permits screened 112 of 304 in flight Not yet screened 192 Pipeline 304 Model ponding 31 at 4″ 112 screened · 29 model ponding', [], 'Main').length === 1],
  ['arithmetic: REFUSES a run header that disagrees with its rows', arithmeticFaults('Permits screened 112 of 304 in flight Not yet screened 192 7 of 7 complete', runRows(HEAD + CLEAN_ROWS), 'Running').some((f) => /renders 3 row/.test(f))],
  ['text: a style block is never read as content', plainText('<style>.x{color:#fff}</style><p>ok</p>').includes('color') === false],
];

let selfFailed = 0;
for (const [label, passed] of tests) {
  if (!passed) {
    console.error('SELF-TEST FAILED: ' + label);
    selfFailed += 1;
  }
}
if (selfFailed) {
  console.error('\n' + selfFailed + ' of ' + tests.length + ' self-tests failed. The instrument is broken, so its');
  console.error('verdict on the artboards would be worthless and it does not report one.');
  process.exit(2);
}
console.log('self-tests: ' + tests.length + '/' + tests.length + ' passed, both directions on every rule that has two');

/* ------------------------------------------------------------ the artboards */

const BOARDS = ['Main.dc.html', 'Parcel.dc.html', 'Depth.dc.html', 'Running.dc.html', 'Empty.dc.html'];

const totals = {
  boardsRead: 0, visibleChars: 0, presets: 0, legendRows: 0, authorityCards: 0, runRows: 0,
  pondingShapes: 0, statedShares: 0, emptyStates: 0, annotations: 0,
};
const REQUIRED = ['boardsRead', 'presets', 'legendRows', 'authorityCards', 'runRows', 'pondingShapes', 'statedShares', 'emptyStates', 'annotations'];
const notes = [];
const problems = [];
const fail = (m) => problems.push(m);

const allText = [];
const allLabels = [];
const allLegend = [];
const allCards = [];
const allRows = [];
const allShares = [];
const allStates = [];
for (const file of BOARDS) {
  const p = new URL('./' + file, here);
  if (!fs.existsSync(p)) {
    fail(file + ': declared as an artboard and does not exist, so nothing was checked on it');
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const text = plainText(html);
  totals.boardsRead += 1;
  totals.visibleChars += text.length;
  if (text.length < 500) fail(file + ': under 500 characters of visible text, so it was barely rendered');
  allText.push(text);

  const labels = presets(html);
  const legend = legendRows(html);
  const cards = authorityCards(html);
  const rows = runRows(html);
  const shapes = pondingShapes(html);
  const shares = statedShares(html);
  const states = emptyStates(html);

  totals.presets += labels.length;
  totals.legendRows += legend.length;
  totals.authorityCards += cards.length;
  totals.runRows += rows.length;
  totals.pondingShapes += shapes.length;
  totals.statedShares += shares.length;
  totals.emptyStates += states.length;

  allLabels.push(...labels);
  allLegend.push(...legend);
  allCards.push(...cards);
  allRows.push(...rows);
  allShares.push(...shares);
  allStates.push(...states);

  /* Per board, not pooled: see the note where the union rules run. */
  if (shapes.length || shares.length) for (const f of geometryFaults(shapes, shares, [text], file)) fail(file + ': ' + f);

  console.log('read ' + file.padEnd(18) + labels.length + ' depth presets, ' + legend.length + ' legend entries, ' + cards.length +
    ' authority cards, ' + rows.length + ' run rows, ' + shapes.length + ' ponding shape(s), ' + shares.length + ' stated share(s), ' + states.length + ' empty states');
}

/* The artboards are one surface: a rule that a board states one half of is satisfied by the
   board that states it, and a rule about a drawn picture is checked against the shares the
   design states anywhere. Each predicate still runs on the union, so nothing is skipped. */
const README = fs.readFileSync(new URL('./README.md', import.meta.url), 'utf8');
const CANVAS = JSON.parse(fs.readFileSync(new URL('./canvas.json', import.meta.url), 'utf8'));
const annotations = (CANVAS.annotations || []).map((a) => a.text);
totals.annotations = annotations.length;

/* Each rule runs once, on the union of every board. */
for (const f of depthFaults(allText, allLabels, 'the design')) fail(f);
for (const f of depthRangeFaults([README, ...annotations], 'the design (README/canvas)')) fail(f);
for (const f of claimFaults([...allText, README, ...annotations], 'the design')) fail(f);
for (const f of legendFaults(allLegend, allText, 'the design')) fail(f);
for (const f of authorityFaults(allCards, 'the design')) fail(f);
for (const f of runRowFaults(allRows, allText, 'the design')) fail(f);
/* Geometry is the one rule NOT read on the union: a picture and the figure beside it are one
   board's pair, and pooling them lets a shape on one board answer a figure on another. So it
   runs per artboard, inside the loop above. */
for (const f of emptyStateFaults(allStates, 'the design')) fail(f);
for (const f of arithmeticFaults(allText.join(' '), allRows, 'the design')) fail(f);

/* The design's own corrected position, checked against the engine in both directions. */
for (const f of depthRangeFaults([README, ...annotations], 'design')) fail('design: ' + f);
if (!/no figure on any artboard is measured|Fixture throughout/i.test(README + annotations.join(' '))) {
  fail('design: neither the README nor the canvas says the figures are a fixture, and every number here is one');
}
const onDisk = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html'));
for (const f of onDisk) if (!BOARDS.includes(f)) fail(f + ': an artboard on disk that this instrument does not declare, so it was never checked');
if (!onDisk.length) fail('no artboards on disk at all');

notes.push('the depth presets the boards render are depths (' + (totals.presets) + ' of them), which is the corrected position; they are not the 2/10/100-year presets the 2026-09-15 pass deleted');
notes.push('the declined state\'s copy is an illustration of the reasons the engine can give, and the board names study.honestEmpty as the field rendered verbatim, so it is a representable fixture rather than a paraphrase of a specific answer');

console.log('');
console.log('matched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));
console.log('product side: ' + S._source.repo + ' @ ' + S._source.ref + ' ' + S._source.commit.slice(0, 12) + ' (' + SCAN.filesScanned +
  ' files scanned; duration ' + SCAN.byTerm.duration + ', returnPeriod ' + SCAN.byTerm.returnPeriod + ', NOAA Atlas 14 ' + SCAN.byTerm['noaa-atlas14'] +
  '), ruling ' + S._source.ruling + ' @ ' + S._source.rulingCommit.slice(0, 12));

/*
 * A run that changes nothing must not rewrite canon. The design gate and the
 * exits instrument both run check.mjs, so an unconditional write made a plain
 * measurement churn a tracked file (OPS-17 A-159). Compare the report with its
 * generatedAt removed and rewrite only when the measured body actually changed;
 * violate.mjs still finds the file it needs, because a real change writes one.
 */
function writeReportIfChanged(url, serialized) {
  let prev = null;
  try { prev = fs.readFileSync(url, 'utf8'); } catch { prev = null; }
  const strip = (text) => {
    try {
      const o = JSON.parse(text);
      if (!o || typeof o !== 'object' || Array.isArray(o)) return text;
      delete o.generatedAt;
      return JSON.stringify(o);
    } catch { return text; }
  };
  if (prev !== null && strip(prev) === strip(serialized)) {
    console.log('report body unchanged; ' + String(url).split('/').pop() + ' left as written');
    return;
  }
  fs.writeFileSync(url, serialized);
}

writeReportIfChanged(
  new URL('./instrument-report.json', import.meta.url),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      lane: 'g148-design-instruments',
      design: 'smartcity-flood-study',
      source: S._source,
      productFacts: {
        depth: BOUND,
        legend: LEGEND,
        jobStates: STATES,
        retryable: RETRYABLE,
        returnPeriodNaming: NAMING,
        ruling: { source: RULING.source, vintageRequired: RULING.vintageRequired, servingPhrase: RULING.servingPhrase },
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
console.log('PASS ' + totals.boardsRead + ' artboards, ' + totals.presets + ' depth presets, ' + totals.legendRows + ' legend entries, ' +
  totals.runRows + ' run rows and ' + totals.pondingShapes + ' drawn ponding shape(s) read, against ' + S._source.ref + ' ' +
  S._source.commit.slice(0, 12) + ' and G-130 (design record: instrument-report.json)');
