/**
 * G-138. External-authority citations on the Localgov filings boards, as a file rather than a habit.
 *
 *   node gen.mjs && node check.mjs            (reads the boards declared in ./canvas.json)
 *   node check.mjs --dir <path>               (reads another copy; violate.mjs uses this)
 *   node check.mjs --self-test-only
 *
 * Exit 0 PASS. Exit 1 a violation. Exit 2 means the instrument REFUSED to report a verdict, which is
 * not a pass and never renders as one.
 *
 * WHAT THIS GUARDS. This design printed two figures with citations to authorities outside the product,
 * and neither traced to anything: `Ordinance rate 7.00%` attributed to "Bastrop code of ordinances",
 * and `Fund 108` attributed to the city ledger. The rate was load bearing. The Exceptions worklist
 * scored three filings as "Rate does not match ordinance" against it, which would hand the city a list
 * accusing its own taxpayers of filing at the wrong rate, citing a number we could not trace,
 * attributed to their own law. 7.00% is plausible because Texas caps municipal hotel occupancy tax at
 * seven percent, and plausibility is the property that lets an untraced figure through.
 *
 * WHAT IS COMPARED, and which rules are which kind. Stated because a rule nobody can read is a rule that
 * gets widened again.
 *
 *   MEANING-SHAPED (C1, C3). This file does not ask the generator where its citations are. It carries
 *   its own REGISTRY of citation values and finds every occurrence in the rendered text itself, then
 *   requires each one to sit inside a tag for that citation. So a new use of the rate that the generator
 *   forgot to tag is found by a party that is not the generator. C3 compares the board's claim of
 *   verification against this file's record of a source, again two parties.
 *
 *   INTERNAL CONSISTENCY (C2, C4, C5, C6). These compare two outputs of the same generator. They catch
 *   a badge that was dropped, a check that was left scoring, a tag nobody registered, and a derived
 *   count that did not follow its source, which is exactly how a hardcoded 12 survived on the
 *   Unlabelled board after the rate check was held. They cannot catch a wrong source, and do not
 *   claim to.
 *
 * NON-VACUITY. Every rule reports a count of what it matched, and this file refuses a verdict if a rule
 * that must find something found nothing. A check that matches nothing reports success and proves
 * nothing; the Smart Files check did exactly that on 2026-09-15.
 *
 * STATED LIMITS. The rate pattern catches `7%`, `7.0%` and `7.00%` with or without a space before the
 * sign, and not the words "seven percent". A figure DERIVED from the rate (tax due on the base at the
 * rate) is not detected by value; it is covered only where its basis line cites the rate, which the
 * Lodging board does. Canvas notes in canvas.json are designer annotations, not boards, and are not
 * scanned.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* The registry. `source` stays null until a traceable source is on file: a URL at the authority
   itself, the date it was read, and the quoted text. Promoting a citation means filling this AND
   setting verified:true in gen.mjs; either one alone fails C2 or C3. */
export const REGISTRY = {
  'ordinance-rate': {
    pattern: /(?<![\d.])7(?:\.0+)?\s?%/g,
    authority: 'Bastrop code of ordinances',
    source: null,
  },
  'fund-108': {
    pattern: /\bfund\s*108\b/gi,
    authority: 'City ledger, OpenGov',
    source: null,
  },
};

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const attrsOf = (s) => {
  const a = {};
  for (const m of s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) a[m[1]] = m[2];
  return a;
};

/** Walk one board. Returns its text nodes with their ancestry, and the elements this file cares about. */
export function walk(html) {
  const stack = [];
  const texts = [];
  const elements = [];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g;
  for (const m of html.matchAll(re)) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) { stack.splice(i); break; }
      }
      continue;
    }
    if (m[2]) {
      const tag = m[2].toLowerCase();
      const el = { tag, attrs: attrsOf(m[3] || ''), text: '' };
      if (el.attrs['data-citation'] !== undefined || el.attrs['data-tab'] !== undefined ||
          el.attrs['data-worklist'] !== undefined || el.attrs['data-finding'] !== undefined) {
        elements.push(el);
      }
      if (!m[4] && !VOID.has(tag)) stack.push(el);
      continue;
    }
    const t = m[5];
    if (!t || !t.trim()) continue;
    for (const el of stack) el.text += t;
    texts.push({ text: t, citations: stack.map((e) => e.attrs['data-citation']).filter((x) => x !== undefined) });
  }
  return { texts, elements };
}

/** The rules, as a pure function of the boards and the registry, so the self-tests exercise the same code. */
export function evaluate(boards, registry = REGISTRY) {
  const findings = [];
  const totals = { boardsRead: 0, citationValues: 0, citationTags: 0, unverifiedBadges: 0, worklistRegions: 0, rateFindings: 0, exceptionTabs: 0 };
  const perBoard = [];
  let scoredSum = null;
  const tabs = [];

  for (const b of boards) {
    totals.boardsRead++;
    const { texts, elements } = walk(b.html);
    const row = { name: b.name, values: 0, tags: 0, badges: 0 };

    // C1 — every occurrence of a registered value sits inside a tag for that citation.
    for (const t of texts) {
      for (const [id, r] of Object.entries(registry)) {
        const hits = t.text.match(new RegExp(r.pattern.source, r.pattern.flags)) || [];
        if (!hits.length) continue;
        row.values += hits.length; totals.citationValues += hits.length;
        if (!t.citations.includes(id)) {
          findings.push({ rule: 'C1', board: b.name, detail: `"${hits[0]}" is a ${id} citation outside any ${id} tag: an untraced figure attributed to ${r.authority}` });
        }
      }
    }

    for (const el of elements) {
      const id = el.attrs['data-citation'];
      if (id !== undefined) {
        row.tags++; totals.citationTags++;
        const r = registry[id];
        // C5 — every tag names a registered citation.
        if (!r) { findings.push({ rule: 'C5', board: b.name, detail: `data-citation="${id}" is not in the registry` }); continue; }
        const verified = el.attrs['data-verified'];
        const hasBadge = /(^|[^A-Z])UNVERIFIED([^A-Z]|$)/.test(el.text);
        if (hasBadge) { row.badges++; totals.unverifiedBadges++; }
        if (!r.source) {
          // C2 — an unsourced citation says so on the page.
          if (verified !== 'false') findings.push({ rule: 'C2', board: b.name, detail: `${id} has no source on file but its tag says data-verified="${verified}"` });
          else if (!hasBadge) findings.push({ rule: 'C2', board: b.name, detail: `${id} is unverified and carries no UNVERIFIED badge beside "${el.text.trim().slice(0, 40)}"` });
        } else if (verified === 'true' && !(r.source.url && r.source.retrieved)) {
          findings.push({ rule: 'C3', board: b.name, detail: `${id} claims verification with a source that has no url and retrieval date` });
        }
        // C3 — no verification claim without a source on file.
        if (verified === 'true' && !r.source) findings.push({ rule: 'C3', board: b.name, detail: `${id} claims data-verified="true" and no traceable source is on file` });
      }

      // C4 — nothing is scored against the rate while the rate is unsourced.
      const rateUnsourced = registry['ordinance-rate'] && !registry['ordinance-rate'].source;
      if (el.attrs['data-worklist'] !== undefined) {
        totals.worklistRegions++;
        if (el.attrs['data-worklist'] === 'rate' && rateUnsourced) {
          if (el.attrs['data-scored'] !== 'false') findings.push({ rule: 'C4', board: b.name, detail: 'the rate worklist is scoring filings against an unsourced ordinance rate' });
          if (el.attrs['data-count'] !== '0') findings.push({ rule: 'C4', board: b.name, detail: `the held rate worklist declares data-count="${el.attrs['data-count']}"; a held check scores nothing` });
        }
      }
      if (el.attrs['data-finding'] === 'rate-mismatch') {
        totals.rateFindings++;
        if (rateUnsourced && el.attrs['data-scored'] !== 'false') findings.push({ rule: 'C4', board: b.name, detail: 'a rate-mismatch finding is scored while the ordinance rate is unsourced' });
      }
      if (el.attrs['data-tab'] !== undefined) {
        const shown = el.text.trim();
        if (shown !== el.attrs['data-count']) findings.push({ rule: 'C6', board: b.name, detail: `tab "${el.attrs['data-tab']}" shows "${shown}" but declares data-count="${el.attrs['data-count']}"` });
        tabs.push({ board: b.name, tab: el.attrs['data-tab'], count: el.attrs['data-count'] });
      }
    }

    const scored = elements.filter((e) => e.attrs['data-worklist'] !== undefined && e.attrs['data-scored'] === 'true');
    if (elements.some((e) => e.attrs['data-worklist'] !== undefined)) {
      const sum = scored.reduce((n, e) => n + Number(e.attrs['data-count']), 0);
      if (scoredSum !== null && scoredSum !== sum) findings.push({ rule: 'C6', board: b.name, detail: `two boards disagree on the scored worklist: ${scoredSum} and ${sum}` });
      scoredSum = sum;
    }
    perBoard.push(row);
  }

  // C6 — every board's Exceptions count is the scored worklist, or zero on a board with no filings.
  const byBoard = {};
  for (const t of tabs) (byBoard[t.board] ||= {})[t.tab] = t.count;
  for (const [board, tb] of Object.entries(byBoard)) {
    if (tb['Exceptions'] === undefined) continue;
    totals.exceptionTabs++;
    const filings = tb['All filings'] ?? tb['Filings'];
    const want = filings === '0' ? 0 : scoredSum;
    if (want === null) continue;
    if (Number(tb['Exceptions']) !== want) {
      findings.push({ rule: 'C6', board, detail: `Exceptions tab says ${tb['Exceptions']}; the scored worklist is ${want}` });
    }
  }

  return { findings, totals, perBoard, scoredSum };
}

/* ======================= self-tests, both directions ======================= */
const cite = (id, v, verified = 'false', badge = true) =>
  `<span data-citation="${id}" data-verified="${verified}">${v}${badge ? '<span>UNVERIFIED</span>' : ''}</span>`;
const board = (html, name = 'T') => [{ name, html }];
const rules = (html, reg) => evaluate(board(html), reg).findings.map((f) => f.rule);
const sourced = {
  ...REGISTRY,
  'ordinance-rate': { ...REGISTRY['ordinance-rate'], source: { url: 'https://example.invalid/ord', retrieved: '2026-09-17', quote: 'seven percent' } },
};
const tabsHtml = (ex, filings) =>
  `<div><span data-tab="Exceptions" data-count="${ex}">${ex}</span><span data-tab="All filings" data-count="${filings}">${filings}</span></div>`;
const worklist = (w, n, scored) => `<section data-region="worklist" data-worklist="${w}" data-count="${n}" data-scored="${scored}"></section>`;

const selfTests = [
  ['PASS  a tagged, badged, unsourced citation is clean', rules(`<p>Ordinance rate ${cite('ordinance-rate', '7.00%')}</p>`).length === 0],
  ['C1    a bare 7.00% outside any tag is REFUSED', rules('<p>Ordinance rate 7.00%</p>').includes('C1')],
  ['C1    the rate tagged as the WRONG citation is REFUSED', rules(`<p>${cite('fund-108', '7.00%')}</p>`).includes('C1')],
  ['C1    text AFTER a closed tag is outside it', rules(`<p>${cite('ordinance-rate', 'rate')} then 7.00%</p>`).includes('C1')],
  ['C1    text nested deep inside the tag is inside it', rules(`<p><span data-citation="ordinance-rate" data-verified="false"><b><i>7.00%</i></b><span>UNVERIFIED</span></span></p>`).length === 0],
  ['C1    an svg self-closing path does not corrupt the stack', rules(`<p><svg><path d="M1 1"/></svg>${cite('fund-108', 'fund 108')}</p>`).length === 0],
  ['C1    7% and 7.0 % are the rate', rules('<p>7%</p>').includes('C1') && rules('<p>at 7.0 %</p>').includes('C1')],
  ['C1    17%, 0.7%, 74% and 70px are NOT the rate', rules('<p>17% 0.7% 74% of budget, 70px wide</p>').length === 0],
  ['C1    Fund 108 in any case is the fund; 108px is not', rules('<p>FUND 108</p>').includes('C1') && rules('<p>108px 1080</p>').length === 0],
  ['C2    an unsourced citation without a badge is REFUSED', rules(`<p>${cite('ordinance-rate', '7.00%', 'false', false)}</p>`).includes('C2')],
  ['C3    verified=true with no source on file is REFUSED', rules(`<p>${cite('ordinance-rate', '7.00%', 'true', false)}</p>`).includes('C3')],
  ['C3    verified=true WITH a source on file is clean', rules(`<p>${cite('ordinance-rate', '7.00%', 'true', false)}</p>`, sourced).length === 0],
  ['C5    an unregistered citation id is REFUSED', rules(`<p>${cite('made-up', 'x')}</p>`).includes('C5')],
  ['C4    a SCORED rate worklist while unsourced is REFUSED', rules(worklist('rate', 3, 'true')).includes('C4')],
  ['C4    a HELD rate worklist is clean', rules(worklist('rate', 0, 'false')).length === 0],
  ['C4    a held rate worklist that still declares a count is REFUSED', rules(worklist('rate', 3, 'false')).includes('C4')],
  ['C4    a scored rate-mismatch finding while unsourced is REFUSED', rules('<div data-finding="rate-mismatch" data-scored="true">3</div>').includes('C4')],
  ['C4    a scored rate worklist is clean once the rate is sourced', rules(worklist('rate', 3, 'true'), sourced).length === 0],
  ['C6    a tab that counts a held check is REFUSED', rules(tabsHtml(12, 34) + worklist('rate', 0, 'false') + worklist('outstanding', 4, 'true') + worklist('late', 5, 'true')).includes('C6')],
  ['C6    a tab equal to the scored worklist is clean', rules(tabsHtml(9, 34) + worklist('rate', 0, 'false') + worklist('outstanding', 4, 'true') + worklist('late', 5, 'true')).length === 0],
  ['C6    zero exceptions on a board with zero filings is clean', evaluate([{ name: 'Wl', html: worklist('outstanding', 4, 'true') + worklist('late', 5, 'true') + tabsHtml(9, 34) }, { name: 'Empty', html: tabsHtml(0, 0) }]).findings.length === 0],
  ['C6    a tab whose visible number disagrees with its declared count is REFUSED', rules('<span data-tab="Exceptions" data-count="9">12</span>').includes('C6')],
  ['VACUITY  a board with no citations reports zero matched', evaluate(board('<p>nothing here</p>')).totals.citationValues === 0],
];

let failedTests = 0;
for (const [label, ok] of selfTests) if (!ok) { console.error('SELF-TEST FAILED: ' + label); failedTests++; }
if (failedTests) { console.error(`\nREFUSING A VERDICT: ${failedTests} self-test(s) failed, so this instrument cannot be trusted.`); process.exit(2); }
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);
if (process.argv.includes('--self-test-only')) process.exit(0);

/* ======================= the real boards ======================= */
const here = dirname(fileURLToPath(import.meta.url));
const di = process.argv.indexOf('--dir');
const dir = di >= 0 ? process.argv[di + 1] : here;

const canvasPath = join(dir, 'canvas.json');
if (!existsSync(canvasPath)) { console.error(`\nREFUSING A VERDICT: no canvas.json in ${dir}, so there is no declared set of boards.`); process.exit(2); }
let declared;
try { declared = JSON.parse(readFileSync(canvasPath, 'utf8')).artboards.map((a) => a.file); }
catch (e) { console.error('\nREFUSING A VERDICT: canvas.json is unparsable: ' + e.message); process.exit(2); }
if (!declared.length) { console.error('\nREFUSING A VERDICT: canvas.json declares no boards.'); process.exit(2); }

const onDisk = readdirSync(dir).filter((f) => f.endsWith('.dc.html'));
const undeclared = onDisk.filter((f) => !declared.includes(f));
const missing = declared.filter((f) => !onDisk.includes(f));

const boards = declared.filter((f) => onDisk.includes(f)).map((f) => ({ name: f, html: readFileSync(join(dir, f), 'utf8') }));
const { findings, totals, perBoard, scoredSum } = evaluate(boards);
for (const f of undeclared) findings.push({ rule: 'C0', board: f, detail: 'a board on disk that canvas.json does not declare is not read, so it is refused' });
for (const f of missing) findings.push({ rule: 'C0', board: f, detail: 'canvas.json declares a board that is not on disk' });

for (const r of perBoard) console.log(`${'ok  '} ${r.name.padEnd(20)} ${r.values} citation values, ${r.tags} citation tags, ${r.badges} UNVERIFIED badges`);
console.log('\nmatched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', ') + `, scoredWorklistSum=${scoredSum}`);

const vacuous = ['citationValues', 'citationTags', 'unverifiedBadges', 'worklistRegions', 'rateFindings', 'exceptionTabs'].filter((k) => totals[k] === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every board: ' + vacuous.join(', ') + '. A check that matched nothing has checked nothing.');
  process.exit(2);
}

if (findings.length) {
  for (const f of findings) console.error(`${f.rule}  ${f.board}  ${f.detail}`);
  console.error(`\n${findings.length} violation(s).`);
  process.exit(1);
}
const unsourced = Object.entries(REGISTRY).filter(([, r]) => !r.source).map(([id]) => id);
console.log(`\nPASS ${boards.length} boards. ${totals.citationValues} citation values found by this file and every one is tagged; ${totals.unverifiedBadges} carry the UNVERIFIED badge. Unsourced: ${unsourced.join(', ') || 'none'}. The rate check is ${REGISTRY['ordinance-rate'].source ? 'scored' : 'HELD'}; Exceptions counts ${scoredSum}.`);
