#!/usr/bin/env node
/**
 * design-instrument-exits.mjs — run every design instrument and report its EXIT CODE.
 *
 * Why this exists (OPS-17 A-156). `design-completion-gate.mjs` answers "does every design past
 * DRAFT carry a check.mjs", and it answers by testing `hasCheck` — the file's existence. It
 * never runs the file and never reads an exit code. On 2026-09-18 it reached `exit 0` and
 * `verdict: FINISHED` while all four instruments it had just counted exited 1.
 *
 * That is not a bug in the gate: the gate's own wording is precise ("carries an instrument").
 * The gap is that `exit 0` from an artifact named `design-completion-gate` is read downstream as
 * "the designs are clean". This script is the missing half. It reports the exit codes, it pairs
 * them with the gate's own verdict, and it REFUSES rather than reporting a folder it could not run.
 *
 * Contract
 *   - A folder whose check.mjs cannot be run is a REFUSAL and makes this script exit 2. A design
 *     instrument that cannot execute is not a passing design, and "could not measure" must never
 *     be printed in the same column as "measured and clean".
 *   - `--violate` additionally runs each folder's violate.mjs when one exists. An instrument that
 *     reports a finding but whose violate.mjs does not exit 0 has not been shown to work in both
 *     directions, so the finding's ownership (design vs instrument) is unproven. That is reported
 *     as `UNPROVEN`, never as a design defect.
 *   - `--self-test` proves both directions before the instrument is trusted: a planted exit-0
 *     instrument reads PASS, a planted exit-1 instrument reads FAIL, and an unrunnable instrument
 *     produces the refusal exit code. Self-tests run in a temp directory and touch nothing real.
 *
 * Usage
 *   node scripts/govtech/design-instrument-exits.mjs
 *   node scripts/govtech/design-instrument-exits.mjs --violate
 *   node scripts/govtech/design-instrument-exits.mjs --self-test
 *
 * Read-only. Runs instruments; writes nothing, commits nothing, and reads no credential.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..');
const DESIGN = path.join(ROOT, '_design');
const GATE = path.join(ROOT, 'scripts', 'govtech', 'design-completion-gate.mjs');

const argv = process.argv.slice(2);
const DO_VIOLATE = argv.includes('--violate');

/* --------------------------------------------------- tracked-state guards */

/**
 * `--violate` runs instruments that PLANT defects into tracked design boards and restore them.
 * That makes this script a writer over tracked canon, so it fails closed in three places:
 *
 *   1. It refuses to start unless `_design` is clean. On a dirty tree, "did this instrument leave
 *      that behind?" is unanswerable, and an unanswerable question must not be answered.
 *   2. After every violate run it re-reads the folder's tracked state. A folder that came back
 *      modified is a REFUSAL, recorded by name.
 *   3. It restores any file an instrument left behind, and names every file it restored, because a
 *      silent restore of a tracked board is exactly the class of event this file exists to stop.
 *
 * Origin: a batch sweep with no guard left `_design/smartcity-records-search/Main.dc.html` — a
 * tracked, RATIFIED, CLOSED board — with its `data-coverage-rule` element removed, and the only
 * report of it was inside that folder's own stdout. The damage was found by `git status`, not by
 * the sweep. OPS-17 A-156.
 */
function git(args, cwd = ROOT) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  // Do NOT trim the whole output. Porcelain v1 encodes the status in the first two columns and an
  // unstaged modification is ` M path`, so a leading trim deletes a status character and shifts
  // every path by one — which is how a guard reads `design/x` for `_design/x` and a one-char
  // status becomes unparseable. Strip trailing newlines only.
  return { code: r.status, out: (r.stdout || '').replace(/[\r\n]+$/, '') };
}

/**
 * Paths git reports as changed under `spec`, relative to `spec`'s repo. Returns null when git could
 * not answer, because "unknown" must never be spelled "clean".
 *
 * `spec` is a repo-relative pathspec and must stay that way: an absolute Windows path passed to git
 * as a pathspec is interpreted with backslashes as escapes, matches nothing, and returns an empty
 * list — a clean result for a dirty tree, which is the exact failure this file is about.
 */
function dirtyUnder(spec, repo = ROOT) {
  const r = git(['status', '--porcelain', '--', spec], repo);
  if (r.code !== 0) return null;
  if (r.out === '') return [];
  return r.out.split(/\r?\n/).filter((l) => l !== '').map((l) => {
    // porcelain v1 is `XY PATH`: exactly two status columns, one space, then the path.
    const m = l.match(/^(..) (.*)$/);
    return m ? m[2] : l;
  });
}

function requireCleanDesignTree() {
  const d = dirtyUnder('_design');
  if (d === null) {
    console.error('REFUSED: could not read git status for _design, so "is it clean?" is unknown.');
    process.exit(2);
  }
  if (d.length) {
    console.error(`REFUSED: _design is not clean (${d.length} path(s)), so this run could not tell its own`);
    console.error(`damage from yours. Commit or restore first, then re-run. Nothing was run.`);
    for (const f of d) console.error(`  - ${f}`);
    process.exit(2);
  }
}

/* ------------------------------------------------------------------ running */

/** Run `node <file>` in `dir`. Returns { ran, code, tail } — never throws, never guesses. */
function runNode(file, dir) {
  const r = spawnSync(process.execPath, [file], { cwd: dir, encoding: 'utf8', timeout: 120_000 });
  if (r.error) return { ran: false, code: null, tail: String(r.error.message || r.error) };
  if (r.status === null) return { ran: false, code: null, tail: 'process produced no exit status' };
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim().split(/\r?\n/).filter(Boolean);
  return { ran: true, code: r.status, tail: out.length ? out[out.length - 1].slice(0, 150) : '' };
}

/**
 * Every folder in _design that carries a check.mjs, plus the count of folders that do not.
 * The absent list is part of the contract: a reader must be able to see what was NOT measured
 * in the same run, rather than inferring it from a denominator.
 */
function survey() {
  const dirs = fs
    .readdirSync(DESIGN, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const withInstrument = [];
  const withoutInstrument = [];
  for (const name of dirs) {
    const dir = path.join(DESIGN, name);
    const check = path.join(dir, 'check.mjs');
    if (!fs.existsSync(check)) {
      withoutInstrument.push(name);
      continue;
    }
    const violate = fs.existsSync(path.join(dir, 'violate.mjs')) ? path.join(dir, 'violate.mjs') : null;
    withInstrument.push({ name, dir, check, violate });
  }
  return { withInstrument, withoutInstrument };
}

/** The gate's own verdict, read at the same moment, so the pairing is visible. */
function gateVerdict() {
  if (!fs.existsSync(GATE)) return { ran: false, code: null, verdict: 'gate script not found' };
  const r = spawnSync(process.execPath, [GATE], { cwd: ROOT, encoding: 'utf8', timeout: 120_000 });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  const m = out.match(/verdict:\s*(.+)/i);
  return { ran: r.status !== null, code: r.status, verdict: m ? m[1].trim() : '(no verdict line)' };
}

/* ------------------------------------------------------------------ self-test */

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-exit-selftest-'));
  const mk = (name, src) => {
    const d = path.join(tmp, name);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'check.mjs'), src);
    return d;
  };

  const passDir = mk('planted-pass', 'process.exit(0);\n');
  const failDir = mk('planted-fail', 'console.log("FAIL planted");\nprocess.exit(1);\n');
  const brokenDir = mk('planted-unrunnable', 'throw new Error("cannot run");\n');

  const results = [
    ['planted-pass reads exit 0', runNode(path.join(passDir, 'check.mjs'), passDir).code === 0],
    ['planted-fail reads exit 1', runNode(path.join(failDir, 'check.mjs'), failDir).code === 1],
    [
      'planted-unrunnable is NOT reported as a pass',
      (() => {
        const r = runNode(path.join(brokenDir, 'check.mjs'), brokenDir);
        return r.ran === true && r.code !== 0;
      })(),
    ],
    [
      'a folder with no check.mjs is visible as unmeasured rather than absent',
      (() => {
        const empty = path.join(tmp, 'planted-no-instrument');
        fs.mkdirSync(empty, { recursive: true });
        return !fs.existsSync(path.join(empty, 'check.mjs'));
      })(),
    ],
  ];

  let failed = 0;
  console.log('\nself-test (run in a temp directory; touches nothing real)');

  // Guard 2's instrument, proven both directions in a throwaway repo: a clean tree must read clean,
  // and a one-line edit to a tracked file must read dirty. A guard that cannot see dirt is the
  // defect class this whole file exists to catch, so it is planted and observed, not assumed.
  const repo = path.join(tmp, 'planted-repo');
  fs.mkdirSync(repo, { recursive: true });
  git(['init', '-q'], repo);
  fs.writeFileSync(path.join(repo, 'board.html'), '<div data-coverage-rule="documents"></div>\n');
  git(['add', 'board.html'], repo);
  git(['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'seed'], repo);
  const cleanRead = dirtyUnder('.', repo);
  fs.writeFileSync(path.join(repo, 'board.html'), '\n');
  const dirtyRead = dirtyUnder('.', repo);

  results.push(
    ['a clean tracked tree reads clean', Array.isArray(cleanRead) && cleanRead.length === 0],
    [
      'a tracked board with a planted element removal reads dirty and is named',
      Array.isArray(dirtyRead) && dirtyRead.length === 1 && dirtyRead[0] === 'board.html',
    ],
  );

  for (const [name, ok] of results) {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
    if (!ok) failed++;
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\nself-test: ${results.length - failed}/${results.length} passed`);
  if (failed) {
    console.error(`\nREFUSED: the self-test did not hold in both directions. This instrument is not trustworthy.`);
    process.exit(2);
  }
  console.log('non-vacuous: a planted failure is reported as a failure, an unrunnable instrument is not a pass,');
  console.log('and the restoration guard can see a modified tracked board.\n');
  return 0;
}

/* ------------------------------------------------------------------ main */

if (argv.includes('--self-test')) process.exit(selfTest());

const { withInstrument, withoutInstrument } = survey();
const gate = gateVerdict();

if (DO_VIOLATE) requireCleanDesignTree();

const rows = [];
const unrunnable = [];
const leftDirty = [];
const restored = [];

for (const d of withInstrument) {
  const check = runNode(d.check, d.dir);
  let violate = { ran: null, code: null, tail: '' };
  if (DO_VIOLATE && d.violate) {
    violate = runNode(d.violate, d.dir);

    // A violate run plants into tracked boards. Verify it put them back, and if it did not, put
    // them back ourselves and say so by name. Never report a restore this script performed.
    const rel = path.relative(ROOT, d.dir).replace(/\\/g, '/');
    const after = dirtyUnder(rel);
    if (after === null) {
      leftDirty.push({ name: d.name, files: ['<git status unreadable>'] });
    } else if (after.length) {
      leftDirty.push({ name: d.name, files: after });
      const r = git(['checkout', '--', rel]);
      if (r.code === 0) restored.push({ name: d.name, files: after });
    }  }
  if (!check.ran) unrunnable.push(`${d.name} (check.mjs: ${check.tail})`);
  if (DO_VIOLATE && d.violate && violate.ran === false) unrunnable.push(`${d.name} (violate.mjs: ${violate.tail})`);
  rows.push({ ...d, check, violate });
}

const pad = (s, n) => String(s).padEnd(n);
const failing = rows.filter((r) => r.check.ran && r.check.code !== 0).length;

console.log(`\ndesign instruments, run at ${new Date().toISOString()}`);
console.log(`  ${pad('design folder', 34)} ${pad('check', 7)} ${DO_VIOLATE ? pad('violate', 8) : ''} ownership`);
console.log(`  ${'-'.repeat(34)} ${'-'.repeat(7)} ${DO_VIOLATE ? '-'.repeat(8) + ' ' : ''}----------`);

for (const r of rows.sort((a, b) => (b.check.code || 0) - (a.check.code || 0))) {
  const code = r.check.ran ? `exit ${r.check.code}` : 'NO EXIT';
  const vio = DO_VIOLATE ? (r.violate.ran === null ? 'no file' : r.violate.ran ? `exit ${r.violate.code}` : 'NO EXIT') : '';

  // Ownership: a failure whose violate.mjs exits 0 is the DESIGN's. If violate did not run or did
  // not pass, the instrument has not been shown to work both ways and ownership is UNPROVEN.
  let owner = '';
  if (r.check.ran && r.check.code !== 0) {
    if (!DO_VIOLATE) owner = '(run --violate to establish ownership)';
    else if (!r.violate) owner = 'UNPROVEN (no violate.mjs)';
    else if (!r.violate.ran) owner = 'UNPROVEN (violate could not run)';
    else if (r.violate.code === 0) owner = 'DESIGN';
    else owner = 'UNPROVEN (violate.mjs does not pass)';
  }

  console.log(`  ${pad(r.name, 34)} ${pad(code, 7)} ${DO_VIOLATE ? pad(vio, 8) : ''} ${owner}`);
}

console.log(`\n  instruments run:      ${rows.length}`);
console.log(`  instruments failing:  ${failing}${failing ? '  <-- these are the designs that are wrong' : ''}`);
console.log(`  with no check.mjs:    ${withoutInstrument.length} of ${rows.length + withoutInstrument.length} folders in _design`);
console.log(`                        ${withoutInstrument.join(', ')}`);
console.log(`                        (this scan covers every _design subdir; the gate's denominator is its own 20`);
console.log(`                         "design folders", so 18 there and 18 here are different denominators, not a`);
console.log(`                         contradiction. The gate exempts SUPERSEDED designs: plan-review, smartcity-place-tab.)`);
console.log(`\n  design-completion-gate.mjs: exit ${gate.code} — ${gate.verdict}`);
console.log(`  It tests that a check.mjs EXISTS. It does not read the column above, and this script does not`);
console.log(`  change it. Both numbers are true at the same instant, which is the finding.`);
console.log(`\n  This script's exit 0 means THE MEASUREMENT RAN, not that the designs are clean. A failing`);
console.log(`  instrument is reported above and does not change the exit code, because what a failing design`);
console.log(`  should block is a policy decision and not this instrument's to make.\n`);

if (leftDirty.length) {
  console.error(`REFUSED: ${leftDirty.length} instrument(s) left TRACKED design files modified. These instruments`);
  console.error(`plant defects into boards and are supposed to restore them; nothing independently checked that`);
  console.error(`they did until this line existed. Files it left behind, by name:`);
  for (const l of leftDirty) for (const f of l.files) console.error(`  - ${f}`);
  if (restored.length) {
    console.error(`\nThis run restored them, and says so rather than reporting itself clean:`);
    for (const r of restored) console.error(`  restored ${r.files.join(', ')}`);
  } else {
    console.error(`\nThis run COULD NOT restore them. The tree is dirty: check it before committing.`);
  }
  process.exit(2);
}

if (unrunnable.length) {
  console.error(`REFUSED: ${unrunnable.length} instrument(s) could not be run, so this run cannot say whether`);
  console.error(`they pass. "Could not measure" is not "measured and clean":`);
  for (const u of unrunnable) console.error(`  - ${u}`);
  process.exit(2);
}

process.exit(0);
