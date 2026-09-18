/**
 * Verify check.mjs by violating it, on the REAL boards, one plant at a time.
 *
 *   node violate.mjs
 *
 * For each plant: copy the declared boards and canvas.json to a scratch directory, apply one mutation to
 * one real board, and require check.mjs to exit with the stated code AND name the stated rule. Then
 * restore and require exit 0. A check observed only passing has not been observed working.
 *
 * Two traps this file is shaped against, both of which caught its author the same day:
 *
 *   A PLANT THAT MISSES ITS TARGET leaves the board untouched, the check passes, and a careless harness
 *   reads that as "caught" or as "clean". Every plant here asserts that it changed the file, and a plant
 *   that did not is reported as a harness failure, never as a result.
 *
 *   AN EXIT CODE READ THROUGH A SHELL PIPE is the exit code of the last command in the pipe. Reading
 *   `node check.mjs | tail; echo $?` reported 0 while the check was refusing a verdict. Exit codes here
 *   come from spawnSync, directly.
 */
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const declared = JSON.parse(readFileSync(join(here, 'canvas.json'), 'utf8')).artboards.map((a) => a.file);
const CHECK = join(here, 'check.mjs');

const fresh = () => {
  const d = mkdtempSync(join(tmpdir(), 'g138-'));
  for (const f of [...declared, 'canvas.json']) copyFileSync(join(here, f), join(d, f));
  return d;
};
const run = (d) => {
  const r = spawnSync(process.execPath, [CHECK, '--dir', d], { encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};
/** Replace in one board, and refuse if the plant did not change it. */
const plant = (d, file, from, to, all = false) => {
  const p = join(d, file);
  const before = readFileSync(p, 'utf8');
  const after = all ? before.split(from).join(to) : (typeof from === 'string' ? before.replace(from, to) : before.replace(from, to));
  if (after === before) throw new Error(`plant did not apply to ${file}: ${String(from).slice(0, 60)}`);
  writeFileSync(p, after);
};

const PLANTS = [
  { rule: 'C2', code: 1, name: 'strip one UNVERIFIED badge from the Main headline',
    go: (d) => plant(d, 'Main.dc.html', />UNVERIFIED<\/span><\/span>/, '></span></span>') },
  { rule: 'C1', code: 1, name: 'add a bare 7.00% to the Lodging prose',
    go: (d) => plant(d, 'Lodging.dc.html', 'Reported gross revenue by month', 'Reported gross revenue by month at 7.00%') },
  { rule: 'C1', code: 1, name: 'add a bare Fund 108 to the Unlabelled board',
    go: (d) => plant(d, 'Unlabelled.dc.html', 'Localgov filings</h1>', 'Localgov filings, Fund 108</h1>') },
  { rule: 'C3', code: 1, name: 'claim a citation is verified with no source on file',
    go: (d) => plant(d, 'Main.dc.html', 'data-verified="false"', 'data-verified="true"') },
  { rule: 'C4', code: 1, name: 'put the rate worklist back to scoring filings',
    go: (d) => plant(d, 'Exceptions.dc.html', 'data-worklist="rate" data-count="0" data-scored="false"', 'data-worklist="rate" data-count="0" data-scored="true"') },
  { rule: 'C4', code: 1, name: 'score the rate-mismatch finding on the Main rail',
    go: (d) => plant(d, 'Main.dc.html', 'data-finding="rate-mismatch" data-scored="false"', 'data-finding="rate-mismatch" data-scored="true"') },
  { rule: 'C6', code: 1, name: 'the defect found by hand: a hardcoded 12 on the Unlabelled tab',
    go: (d) => plant(d, 'Unlabelled.dc.html', /data-tab="Exceptions" data-count="9"([^>]*)>9</, 'data-tab="Exceptions" data-count="12"$1>12<') },
  { rule: 'C6', code: 1, name: 'a tab whose visible number disagrees with its declared count',
    go: (d) => plant(d, 'Main.dc.html', /(data-tab="Exceptions" data-count="9"[^>]*)>9</, '$1>12<') },
  { rule: 'C5', code: 1, name: 'an unregistered citation id',
    go: (d) => plant(d, 'Main.dc.html', 'data-citation="fund-108"', 'data-citation="fund-99"') },
  { rule: 'C0', code: 1, name: 'an undeclared board on disk',
    go: (d) => writeFileSync(join(d, 'Extra.dc.html'), '<p>Ordinance rate 7.00%</p>') },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'every citation tag removed, so nothing is checked',
    go: (d) => { for (const f of declared) { try { plant(d, f, 'data-citation=', 'data-x=', true); } catch { /* boards with no citations */ } } } },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'every worklist region unmarked',
    go: (d) => plant(d, 'Exceptions.dc.html', 'data-worklist=', 'data-x-worklist=', true) },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'canvas.json deleted, so no boards are declared',
    go: (d) => rmSync(join(d, 'canvas.json')) },
];

let caught = 0, harness = 0;
for (const p of PLANTS) {
  const d = fresh();
  try {
    try { p.go(d); } catch (e) { console.error(`HARNESS  ${p.name}: ${e.message}`); harness++; continue; }
    const v = run(d);
    const ok = v.code === p.code && v.out.includes(p.rule);
    console.log(`direction 1  ${ok ? 'caught ' : 'MISSED '} ${p.rule.padEnd(18)} ${p.name}  (exit ${v.code})`);
    if (ok) caught++;
  } finally { rmSync(d, { recursive: true, force: true }); }

  const c = fresh();
  try {
    const v = run(c);
    const clean = v.code === 0;
    console.log(`direction 2  ${clean ? 'clean  ' : 'NOT CLEAN'} violation removed  (exit ${v.code})`);
    if (!clean) harness++;
  } finally { rmSync(c, { recursive: true, force: true }); }
}

console.log(`\n${caught}/${PLANTS.length} violations caught on a real board, and the unmodified boards pass.`);
if (harness) { console.error(`${harness} harness failure(s): a plant missed its target or a clean copy did not pass.`); process.exit(2); }
if (caught !== PLANTS.length) process.exit(1);
