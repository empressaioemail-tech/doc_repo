#!/usr/bin/env node
/**
 * SmartCity tracker: where the program stands, DERIVED from source, never typed.
 *
 *   node scripts/govtech/smartcity-tracker.mjs            writes _design/SMARTCITY_TRACKER.md and checks it
 *   node scripts/govtech/smartcity-tracker.mjs --check    checks only, writes nothing
 *   node scripts/govtech/smartcity-tracker.mjs --self-test-only
 *
 * Exit 0 PASS. Exit 1 a row disagrees with its own close. Exit 2 the instrument refused a verdict.
 *
 * WHY IT IS GENERATED. A hand-kept status list is exactly how this program lost track of itself: on
 * 2026-09-17 and 2026-09-18 three OPS-17 rows (G-125, G-128, G-145) read OPEN while their own close
 * artifacts in `_inbox/` said closed, one for three days. The amendments were right and the status cells
 * were stale proxies, and nothing compared them. This reads the plan-of-record rows and every lane close,
 * and REFUSES when they disagree, so a close that lands without re-grading its row is no longer
 * invisible.
 *
 * WHAT IS COMPARED, and what kind of check each is. A row's status cell (written by the planner into the
 * plan of record) against the status in the row's close artifacts (written by the lane that did the
 * work). Two different authors, so one party acting alone cannot satisfy both sides. That is the one
 * rule that fails the run. The milestone grouping below is DECLARED, not derived: it is the roadmap's
 * skeleton, and it lives here so the tracker and the roadmap cannot group rows differently.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* ---------- the milestones, declared: the roadmap's skeleton ---------- */
export const MILESTONES = [
  { id: 'M1', name: 'Staff on v2: the soft launch', rows: ['D-12', 'G-134', 'G-143', 'G-127', 'G-144', 'G-158', 'G-167'] },
  { id: 'M2', name: 'The next deliverable: Finance, hotel occupancy tax, RBAC, city management board', rows: ['G-156', 'G-159', 'G-162', 'G-138', 'G-137', 'G-157'] },
  { id: 'M3', name: 'Lens builds on Bastrop live data', rows: ['G-135', 'G-161', 'G-154', 'G-149', 'G-153', 'G-152', 'G-151', 'G-155', 'G-150', 'G-165', 'G-168'] },
  { id: 'M4', name: 'DigitalOcean migration complete', rows: ['D-5', 'D-9', 'D-10', 'D-11', 'D-13', 'D-14', 'G-163'] },
  { id: 'M5', name: 'Design complete, and the controls that keep it honest', rows: ['G-146', 'G-142', 'G-147', 'G-148', 'G-160', 'G-164', 'G-166', 'G-169'] },
];

/* ---------- status vocabulary ---------- */
// Longest first, so CLOSED-PARTIAL is not read as CLOSED and "STILL BLOCKED" not as something shorter.
const CLASSES = [
  ['CLOSED-PARTIAL', 'closed-partial'], ['CLOSED', 'closed'], ['LANDED', 'landed'],
  ['MERGED AND DEPLOYED', 'merged'],
  ['STILL BLOCKED', 'blocked'], ['BLOCKED', 'blocked'], ['OUT OF SCOPE', 'out-of-scope'],
  ['DESIGNED', 'designed'], ['HELD', 'held'], ['SCOPED', 'open'], ['ADDED', 'open'], ['OPEN', 'open'],
];
/** Classify a status cell by its LEADING words, after bold markers and leading punctuation. */
export function classify(cell) {
  const lead = String(cell || '').replace(/\*\*/g, '').replace(/~~/g, '').trim().toUpperCase();
  for (const [word, cls] of CLASSES) if (lead.startsWith(word)) return cls;
  return 'unknown';
}
/** What counts as done. `landed` is deliberately NOT in it. This program uses "landed" for the state
    verified today on D-14, D-13 and G-161: the change is present at its target and read back at source,
    while the row's own instrument still has ungraded clauses and no lane close is filed. Folding that
    into `done` would count a row complete on a partial read, which is the "code-done is not
    customer-done" defect pointing the other way. Only CLOSED and CLOSED-PARTIAL mean graded. */
const DONE = new Set(['closed', 'closed-partial']);
const normClose = (s) => { const v = String(s || '').trim().toLowerCase(); return v === 'closed-partial' || v === 'closed' ? v : null; };

/* ---------- parse the plans ---------- */
/** OPS-17: | ID | L | work | serves | instrument | blocked | status |. OPS-25: | Row | Date | Status | scope | depends |. */
export function parseRows(text, kind) {
  const rows = {}; const dropped = [];
  for (const line of text.split('\n')) {
    const m = line.match(kind === 'OPS-17' ? /^\| (G-\d+) \|/ : /^\| (D-\d+) \|/);
    if (!m) continue;
    // Split on UNESCAPED pipes only. Markdown requires an escaped pipe (`\|`) inside a table cell, and
    // splitting on every pipe turned such a row into extra cells, so it failed the width check below and
    // VANISHED from the tracker while the tracker went on reporting PASS. Found 2026-09-18 when G-161's
    // status gained `\|\|` and G-161 disappeared from the run that gates the roadmap. A row that cannot
    // be parsed is now RECORDED and the run REFUSES, because a gate that drops a row silently reports
    // health it did not measure.
    const c = line.split(/(?<!\\)\|/).slice(1, -1);
    const want = kind === 'OPS-17' ? 7 : 5;
    if (c.length !== want) { dropped.push(`${m[1]} (${kind}): ${c.length} cells, expected ${want}`); continue; }
    const status = kind === 'OPS-17' ? c[6] : c[2];
    const titleCell = kind === 'OPS-17' ? c[2] : c[3];
    const title = (titleCell.match(/\*\*(.+?)\*\*/) || [, titleCell])[1].replace(/[`*]/g, '').replace(/\s+/g, ' ').trim().slice(0, 96);
    rows[m[1]] = { id: m[1], plan: kind, status: status.trim(), cls: classify(status), title };
  }
  Object.defineProperty(rows, 'dropped', { value: dropped, enumerable: false });
  return rows;
}

/** The rows a close names. Lanes write the field four ways; the first version read only `planRows` and
    silently linked nothing for a third of all closes, including G-156's (`planRow`, a string). */
export function rowsOfClose(j) {
  const raw = [j.planRows, j.planRow, j.plan_rows, j.plan_row].find((v) => v !== undefined);
  return [].concat(raw ?? []).flatMap((x) => String(x).split(/[,\s]+/)).map((x) => x.trim()).filter((x) => /^[A-Z]-\d+$/.test(x));
}

/** Every `_inbox/*_close.json`, keyed by plan row. A close that names several rows counts for each. */
export function parseCloses(dir) {
  const by = {}; const unlinked = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('_close.json'))) {
    let j; try { j = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { unlinked.push(f); continue; }
    const st = normClose(j.status || j.verdict);
    const rs = rowsOfClose(j);
    if (!rs.length) { unlinked.push(f); continue; }
    for (const r of rs) (by[r] ||= []).push({ file: f, status: st, raw: j.status || j.verdict });
  }
  by.__unlinked = unlinked;
  return by;
}

/* ---------- the one rule that fails the run ---------- */
/** A row whose close says done must not still read as not done. */
export function disagreements(rows, closes, ids) {
  const out = [];
  for (const id of ids) {
    const r = rows[id]; if (!r) continue;
    const done = (closes[id] || []).filter((c) => c.status);
    if (done.length && !DONE.has(r.cls) && r.cls !== 'designed') {
      out.push({ id, row: r.cls, close: done.map((c) => `${c.status} (${c.file})`).join('; ') });
    }
  }
  return out;
}

/* ======================= self-tests, both directions ======================= */
const T = [
  ['classify: CLOSED-PARTIAL is not read as CLOSED', classify('**CLOSED-PARTIAL 2026-09-18.**') === 'closed-partial'],
  ['classify: bold and a date still read as CLOSED', classify('**CLOSED 2026-09-18, verified on x**') === 'closed'],
  ['classify: OPEN with a dash', classify('OPEN — carded 2026-09-17 (A-142)') === 'open'],
  ['classify: STILL BLOCKED before BLOCKED', classify('STILL BLOCKED — but') === 'blocked'],
  ['classify: OPS-25 ADDED reads as open', classify('ADDED, CRITICAL PATH') === 'open'],
  ['classify: a DRAFT design row', classify('**DESIGNED 2026-09-18, DRAFT awaiting**') === 'designed'],
  ['classify: nonsense is UNKNOWN, never guessed', classify('probably fine') === 'unknown'],
  ['REFUSE: a close says closed and the row says OPEN', disagreements({ 'G-1': { cls: 'open' } }, { 'G-1': [{ status: 'closed', file: 'a' }] }, ['G-1']).length === 1],
  ['REFUSE: a closed-partial close and the row says OPEN (the G-128 case)', disagreements({ 'G-1': { cls: 'open' } }, { 'G-1': [{ status: 'closed-partial', file: 'a' }] }, ['G-1']).length === 1],
  ['clean: both say closed', disagreements({ 'G-1': { cls: 'closed' } }, { 'G-1': [{ status: 'closed', file: 'a' }] }, ['G-1']).length === 0],
  ['clean: an OPEN row with no close is simply open', disagreements({ 'G-1': { cls: 'open' } }, {}, ['G-1']).length === 0],
  ['clean: a close with an unrecognised status is not counted as done', disagreements({ 'G-1': { cls: 'open' } }, { 'G-1': [{ status: null, file: 'a' }] }, ['G-1']).length === 0],
  ['parse: an OPS-17 row with the wrong cell count is skipped, not misread', Object.keys(parseRows('| G-9 | 5 | x | y |', 'OPS-17')).length === 0],
  ['parse: that same skipped row is RECORDED, so the run can refuse on it', parseRows('| G-9 | 5 | x | y |', 'OPS-17').dropped.length === 1],
  ['parse: an escaped pipe inside a cell does not drop the row (the G-161 case)', parseRows('| G-9 | 5 | **a \\| b** | B | inst | none | **LANDED 2026-09-18** |', 'OPS-17').dropped.length === 0],
  ['parse: LANDED reads as its own class, not as UNREADABLE (the G-161 status word)', parseRows('| G-9 | 5 | **a \\| b** | B | inst | none | **LANDED 2026-09-18, read at source** |', 'OPS-17')['G-9'].cls === 'landed'],
  ['classify: LANDED is not read as CLOSED (they are different words and stay different)', classify('**LANDED 2026-09-18**') !== 'closed' && classify('**CLOSED 2026-09-18**') === 'closed'],
  ['REFUSE: a LANDED row against a close that says closed (landed is not graded; resolve the row)', disagreements({ 'G-1': { cls: 'landed' } }, { 'G-1': [{ status: 'closed', file: 'a' }] }, ['G-1']).length === 1],
  ['clean: a LANDED row with no close is landed, not a disagreement', disagreements({ 'G-1': { cls: 'landed' } }, {}, ['G-1']).length === 0],
  ['parse: an OPS-17 row with the wrong cell count is recorded too, not only OPS-25 rows', parseRows('| G-9 | 5 | x |', 'OPS-17').dropped.join().includes('expected 7')],
  ['parse: escaped pipes do not shift the status column', parseRows('| G-9 | 5 | **a \\| b \\| c** | B | inst | none | OPEN |', 'OPS-17')['G-9'].cls === 'open'],
  ['parse: a well-formed OPS-17 row is read', parseRows('| G-9 | 5 | **Do it** | B | inst | none | OPEN |', 'OPS-17')['G-9'].cls === 'open'],
  ['link: planRows array', rowsOfClose({ planRows: ['G-1'] }).join() === 'G-1'],
  ['link: planRow as a single string (the G-156 case)', rowsOfClose({ planRow: 'G-156' }).join() === 'G-156'],
  ['link: a comma list in one string', rowsOfClose({ plan_rows: 'P-301, P-302' }).join() === 'P-301,P-302'],
  ['link: no row field links nothing, and is counted, not guessed', rowsOfClose({ lane: 'x' }).length === 0],
];
let bad = 0; for (const [l, ok] of T) if (!ok) { console.error('SELF-TEST FAILED: ' + l); bad++; }
if (bad) { console.error(`\nREFUSING A VERDICT: ${bad} self-test(s) failed.`); process.exit(2); }
console.log(`self-tests: ${T.length}/${T.length} passed, both directions`);
if (process.argv.includes('--self-test-only')) process.exit(0);

/* ======================= the real plans ======================= */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ops17 = parseRows(readFileSync(join(ROOT, '90_operations/OPS-17_govtech_stack_plan_of_record.md'), 'utf8'), 'OPS-17');
const ops25 = parseRows(readFileSync(join(ROOT, '90_operations/OPS-25_cloud_infrastructure_and_cost_program.md'), 'utf8'), 'OPS-25');
const rows = { ...ops17, ...ops25 };
const closes = parseCloses(join(ROOT, '_inbox'));
const tracked = MILESTONES.flatMap((m) => m.rows);
const unlinked = closes.__unlinked || []; delete closes.__unlinked;

const unparsed = [...ops17.dropped, ...ops25.dropped];
if (unparsed.length) { console.error('REFUSING A VERDICT: plan rows that could not be parsed (a row the tracker cannot read is not a row that passed): ' + unparsed.join('; ')); process.exit(2); }
const missing = tracked.filter((id) => !rows[id]);
if (missing.length) { console.error('REFUSING A VERDICT: tracked rows not found in either plan: ' + missing.join(', ')); process.exit(2); }
const unknown = tracked.filter((id) => rows[id].cls === 'unknown');
if (unknown.length) { console.error('REFUSING A VERDICT: tracked row(s) whose status word is not in the vocabulary, so the run cannot say whether they are done: ' + unknown.join(', ')); process.exit(2); }
if (Object.keys(ops17).length < 20 || Object.keys(ops25).length < 5) { console.error('REFUSING A VERDICT: too few rows parsed; the table shape has changed'); process.exit(2); }

let commit = 'unknown';
try { commit = execFileSync('git', ['-C', ROOT, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* reported as unknown */ }
const dis = disagreements(rows, closes, tracked);

/* ---------- render ---------- */
const LABEL = { closed: 'closed', 'closed-partial': 'closed, partly', landed: 'landed, not graded', merged: 'merged, not closed', designed: 'designed, awaiting ratification', open: 'open', held: 'held', blocked: 'blocked', 'out-of-scope': 'out of scope', unknown: 'UNREADABLE' };
const count = (ids, pred) => ids.filter((id) => pred(rows[id].cls)).length;
let md = '---\nid: smartcity_tracker\ntitle: "SmartCity tracker (generated)"\nstatus: generated\nkind: tracker\nowner: nick\nprograms: [OPS-17, OPS-25]\n---\n\n';
md += '# SmartCity tracker\n\n';
md += `**Generated, do not edit.** Regenerate with \`node scripts/govtech/smartcity-tracker.mjs\`. Read from doc_repo \`${commit}\`: ${Object.keys(ops17).length} OPS-17 rows, ${Object.keys(ops25).length} OPS-25 rows, and every \`_inbox/*_close.json\`. The milestones are the roadmap's, in \`_inbox/2026-09-15_roadmap_reconciliation.md\`.\n\n`;
md += `**Coverage:** ${unlinked.length} of ${unlinked.length + Object.values(closes).flat().length} close records name no plan row, so no row can be checked against them. They are counted, not guessed.

`;
md += dis.length
  ? `**${dis.length} row(s) disagree with their own close.** A lane closed the work and the plan of record still says it is not done. Re-grade each row below from its close.\n\n`
  : '**Every tracked row agrees with its own close.** A close that lands without re-grading its row fails this run.\n\n';
md += '| Milestone | Rows | Done | Open or blocked |\n|---|---|---|---|\n';
for (const m of MILESTONES) md += `| ${m.id} ${m.name} | ${m.rows.length} | ${count(m.rows, (c) => DONE.has(c))} | ${count(m.rows, (c) => !DONE.has(c))} |\n`;
for (const m of MILESTONES) {
  md += `\n## ${m.id}. ${m.name}\n\n| Row | What | Status | Close on file |\n|---|---|---|---|\n`;
  for (const id of m.rows) {
    const r = rows[id]; const cl = (closes[id] || []).map((c) => c.raw).filter(Boolean);
    md += `| ${id} | ${r.title.replace(/\|/g, '/')} | ${LABEL[r.cls]} | ${cl.length ? cl.join(', ') : '—'} |\n`;
  }
}
if (dis.length) { md += '\n## Disagreements\n\n| Row | Row says | Close says |\n|---|---|---|\n'; for (const d of dis) md += `| ${d.id} | ${d.row} | ${d.close} |\n`; }
if (unknown.length) md += `\n**Unreadable status cells:** ${unknown.join(', ')}. Their status words are not in the tracker's vocabulary, so they are reported, never guessed.\n`;

if (!process.argv.includes('--check')) { writeFileSync(join(ROOT, '_design/SMARTCITY_TRACKER.md'), md); console.log('wrote _design/SMARTCITY_TRACKER.md'); }
console.log(`read ${Object.keys(ops17).length} OPS-17 rows, ${Object.keys(ops25).length} OPS-25 rows, closes for ${Object.keys(closes).length} rows; tracking ${tracked.length} rows at ${commit}`);
console.log(`  coverage: ${unlinked.length} close file(s) name no plan row and are not linked to any row`);
for (const m of MILESTONES) console.log(`  ${m.id} ${String(count(m.rows, (c) => DONE.has(c))).padStart(2)}/${m.rows.length} done   ${m.name}`);
if (unknown.length) console.log('  unreadable: ' + unknown.join(', '));
if (dis.length) { for (const d of dis) console.error(`DISAGREE  ${d.id}  row=${d.row}  close=${d.close}`); console.error(`\n${dis.length} row(s) disagree with their own close.`); process.exit(1); }
console.log('\nPASS every tracked row agrees with its own close.');
