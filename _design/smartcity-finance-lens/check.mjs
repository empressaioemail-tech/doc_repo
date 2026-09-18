/**
 * Adversarial read, as a file.
 *
 * `node check.mjs` after `node gen.mjs`. Non-zero exit on any violation.
 *
 * `node check.mjs --dir <path>` reads ANOTHER COPY of the surface instead of the
 * artboards in this folder: the built product's own markup, as
 * scripts/export-finance-lens.mjs writes it (a file, or a directory of them).
 * capture-figures.json is read from THIS folder either way, because it is the
 * record the figures are checked against and a copy of the surface must not be
 * able to bring its own. Added by G-156 under operator ruling, so that the
 * ratified instrument can be pointed at what the product actually renders.
 *
 * Exit 2 is also what a scan returns when it matched ZERO money tokens. A money
 * check that found no money has not passed; it has found nothing to check, and
 * reporting that as a pass is the same defect class as the plausible figure this
 * whole instrument exists for.
 *
 * THE CHECK THAT MATTERS HERE is money traceability. This lens draws figures
 * about a real city budget, and the defect class that has already reached two
 * canvases in this folder set is a number that looks right, carries a citation
 * to an authority, and traces to nothing. A tax rate attributed to a city
 * ordinance and a code section cited six times inside an issued letter both got
 * through a review pass because they were plausible.
 *
 * So: every money token rendered on an artboard must either appear in
 * capture-figures.json, which is the record of what was read from the operator
 * capture, or sit on an artboard that declares itself ILLUSTRATIVE in its own
 * basis line. Those are two independently derived inputs and the check asks
 * whether they agree. No sentinel satisfies it.
 *
 * Each check self-tests in BOTH directions before it reads an artboard.
 */
import fs from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = new URL('.', import.meta.url);

/** Artboards permitted to carry invented figures, because they say so on the page. */
const ILLUSTRATIVE = new Set(['Connected.dc.html']);

/** The declared state vocabulary. An artboard may not invent a sixth. */
const STATES = ['MEASURED', 'UNACCOUNTED', 'REFUSED', 'CONFLICT', 'PARTIAL'];

const MONEY = /\$[0-9][0-9,.]*\s?[MKB]?/g;
const BADGE = /border-radius:var\(--sc-r-control\); padding:1px 6px; white-space:nowrap;">([A-Z]+)<\/span>/g;
/**
 * The built surface marks a state cell with data-finance-pill / data-finance-state
 * rather than the artboards' inline style, so on a built file the vocabulary rule
 * below would otherwise be vacuous - it would find no badges at all and pass.
 * Both forms are read, and the artboards' own form is untouched by this line.
 */
const BADGE_BUILT = /data-finance-(?:pill|state)="[a-z-]+">([A-Z][A-Z ]*)</g;
const PERSON = /^(?:[A-Z]\.\s*)+[A-Z][a-z]+(?:-[A-Z][a-z]+)?$|^[A-Z]{2,}\s+[A-Z]{2,}(?:-[A-Z]{2,})?$/;
const CELL = /font:400 13px\/18px var\(--sc-font-(?:ui|data)\); font-variant-numeric:tabular-nums; color:var\(--sc-ink(?:-2|-3)?\);">([^<]*)<\/span>/g;

const money = (html) => [...new Set(html.match(MONEY) || [])].map((s) => s.trim());
const badges = (html) => [
  ...new Set([...html.matchAll(BADGE), ...html.matchAll(BADGE_BUILT)].map((m) => m[1])),
];
const cells = (html) => [...html.matchAll(CELL)].map((m) => m[1].trim());
const people = (html) => cells(html).filter((c) => PERSON.test(c));

const traceable = (token, blob) => blob.includes(token);
const statesOk = (html) => badges(html).every((b) => STATES.includes(b));

/* ------------------------------------------------------------- self-tests */

const FAKE_BLOB = 'total is $69.6M across 15 funds and $424.0M charged';
const badgeCell = (s) => `border-radius:var(--sc-r-control); padding:1px 6px; white-space:nowrap;">${s}</span>`;
const dataCell = (t) => `font:400 13px/18px var(--sc-font-ui); font-variant-numeric:tabular-nums; color:var(--sc-ink);">${t}</span>`;

const selfTests = [
  ['money: extractor finds a plain figure', money('cost $69.6M here').includes('$69.6M')],
  ['money: extractor finds a comma figure', money('is $244,119,103.40 total').includes('$244,119,103.40')],
  ['money: extractor is not vacuous', money('no figures at all').length === 0],
  ['money: ACCEPTS a figure present in the record', traceable('$69.6M', FAKE_BLOB) === true],
  ['money: REFUSES a figure absent from the record', traceable('$99.9M', FAKE_BLOB) === false],
  ['states: accepts the declared vocabulary', statesOk(STATES.map(badgeCell).join('')) === true],
  ['states: REFUSES an invented state', statesOk(badgeCell('ESTIMATED')) === false],
  ['states: extractor is not vacuous', badges(STATES.map(badgeCell).join('')).length === STATES.length],
  ['people: REFUSES an initialised name in a cell', people(dataCell('D. Moore')).length === 1],
  ['people: ALLOWS a department', people(dataCell('Streets & Drainage')).length === 0],
  ['people: ALLOWS a figure', people(dataCell('$14.2M')).length === 0],
  /**
   * G-156. The built surface's own markup, in both directions, and the vacuity
   * rule itself. Without these three the bridge could be pointed at a built file
   * and quietly check nothing: no badges read, no figures matched, exit 0.
   */
  ['built: accepts the declared vocabulary in the built pill form', statesOk(`<span class="pill p-quiet" data-finance-pill="fund-ledger">UNACCOUNTED</span>`) === true],
  ['built: REFUSES an invented state in the built pill form', statesOk(`<span class="pill p-quiet" data-finance-pill="fund-ledger">ESTIMATED</span>`) === false],
  ['built: the badge extractor reads the built form', badges(`<span data-finance-state="a">PARTIAL</span> AND <span data-finance-pill="b">REFUSED</span>`).length === 2],
  ['vacuity: a surface with no figures matches none', money('<p>nothing here</p>').length === 0],
  ['vacuity: a surface with one figure matches one', money('<p>total $69.6M</p>').length === 1],
];

let failed = 0;
for (const [label, passed] of selfTests) {
  if (!passed) { console.error(`SELF-TEST FAILED: ${label}`); failed += 1; }
}
if (failed) {
  console.error(`\n${failed} self-test(s) failed. The instrument is broken, so it reports no`);
  console.error('verdict on the artboards rather than a verdict worth nothing.');
  process.exit(2);
}
console.log(`self-tests: ${selfTests.length}/${selfTests.length} passed, both directions`);

/* ----------------------------------------------------------- the artboards */

let blob;
try {
  blob = fs.readFileSync(new URL('./capture-figures.json', import.meta.url), 'utf8');
} catch {
  console.error('capture-figures.json is missing or unreadable. It is the record of what was');
  console.error('read from the operator capture, and the money check cannot run without it.');
  process.exit(2);
}

/**
 * G-156. WHICH SURFACE IS READ. Default: the artboards in this folder. With
 * `--dir <path>`: another copy of the surface - a file, or a directory of
 * .dc.html files - which is how this instrument is pointed at what the product
 * renders. capture-figures.json is NOT read from there: the record is the thing
 * the figures are checked against, and a surface must not arrive with its own.
 */
const di = process.argv.indexOf('--dir');
let target = null;
if (di >= 0) {
  const value = process.argv[di + 1];
  if (!value || value.startsWith('--')) {
    console.error('\nREFUSING A VERDICT: --dir needs a path.');
    process.exit(2);
  }
  if (!fs.existsSync(value)) {
    console.error(`\nREFUSING A VERDICT: ${value} does not exist, so there is no surface to read.`);
    process.exit(2);
  }
  target = value;
}

const sourceDir = target || fileURLToPath(here);
const files = (target && fs.statSync(target).isFile()
  ? [target]
  : fs.readdirSync(sourceDir).filter((f) => f.endsWith('.dc.html')).sort().map((f) => join(sourceDir, f))
);
if (!files.length) { console.error(`no artboards in ${sourceDir}. Run \`node gen.mjs\` first.`); process.exit(2); }

let bad = 0;
let matched = 0;
for (const reader of files) {
  const file = reader.split(/[\\/]/).pop();
  const html = fs.readFileSync(reader, 'utf8');
  const problems = [];

  const declared = html.includes('ILLUSTRATIVE');
  if (ILLUSTRATIVE.has(file) && !declared) {
    problems.push('is listed as illustrative but the page never says so');
  }
  if (!ILLUSTRATIVE.has(file)) {
    const found = money(html);
    matched += found.length;
    const untraced = found.filter((t) => !traceable(t, blob));
    if (untraced.length) problems.push(`money not traceable to the capture record: ${untraced.join(', ')}`);
  }

  if (!statesOk(html)) {
    problems.push(`undeclared state badge: ${badges(html).filter((b) => !STATES.includes(b)).join(', ')}`);
  }
  const named = people(html);
  if (named.length) problems.push(`table cells name people: ${[...new Set(named)].join(', ')}`);

  if (problems.length) {
    bad += 1;
    console.error(`FAIL ${file}`);
    for (const p of problems) console.error(`     ${p}`);
  } else {
    const n = money(html).length;
    console.log(`ok   ${file}${ILLUSTRATIVE.has(file) ? `  (${n} figures, declared illustrative)` : `  (${n} figures, all traceable)`}`);
  }
}

/**
 * THE VACUITY REFUSAL. Zero matched figures is not a pass. Pointed at a surface
 * that renders no money at all - which is what the built product's default
 * Finance lens honestly does - this instrument has nothing to check, and says so
 * at exit 2 rather than reporting a clean bill of health it did not earn.
 */
if (!bad && matched === 0) {
  console.error('\nREFUSING A VERDICT: 0 money tokens matched across the surface that was read.');
  console.error('A money traceability check that matched nothing has not checked anything.');
  process.exit(2);
}

if (bad) { console.error(`\n${bad} of ${files.length} artboards failed.`); process.exit(1); }
console.log(`\n${files.length} artboards pass, ${matched} matched money token(s) traced.`);
