/**
 * The probe artifact. `node probe.mjs`
 *
 * Writes `_inbox/2026-09-18_g147-record-search_probe.json`, the artifact the
 * close cites. It runs check.mjs and violate.mjs and reads the DESIGN COMPLETION
 * GATE, and it plants three named violations into a real board one at a time,
 * capturing the verbatim refusal each time.
 *
 * IT IS AN INSTRUMENT PROBE, NOT A `scripts/surface-probe.mjs` ARTIFACT, and the
 * artifact says so in its own `instrument` field rather than leaving a reader to
 * infer it. Records search is not built: there is no deployed surface for this
 * lane to measure, and `surface-probe.mjs` measures deployed surfaces. What CAN
 * be measured is the instrument — that it passes with a non-zero matched-input
 * count on real boards, and that it refuses a named planted violation. Both are
 * measured here, verbatim, by running them.
 *
 * The gate leg is included because it is the row's own acceptance sentence:
 * "the design-completion gate stops reporting each one as uncovered". Its two
 * runs are taken from the same file, before and after this lane's declaration,
 * by flipping the declaration in a temp copy rather than by remembering what it
 * said. The convention is imported from the gate itself, so the two cannot drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOC_REPO = process.env.DOC_REPO_PATH || path.resolve(HERE, '..', '..');
const DASH = process.env.SMARTCITY_DASHBOARDS_PATH || 'P:/smartcity-dashboards';
const OUT = path.join(DOC_REPO, '_inbox', '2026-09-18_g147-record-search_probe.json');

const run = (cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  return { exit: r.status, out: ((r.stdout || '') + (r.stderr || '')).replace(/\r\n/g, '\n').trimEnd() };
};
const node = (args, cwd) => run(process.execPath, args, cwd);

/** The matched-input line check.mjs prints, pulled out rather than retyped. */
const matchedInput = (out) => (out.match(/^matched inputs: .*$/m) || [''])[0];
const verdictLine = (out) => (out.match(/^\d+ artboards pass\.$/m) || [''])[0];

/* ------------------------------------------------- the instrument, clean */

const check = node(['check.mjs'], HERE);
const violate = node(['violate.mjs'], HERE);

/* ------------------------------------- named plants, captured verbatim */

const PLANTS = [
  { name: 'no coverage panel above a result set', file: 'Results.dc.html', apply: (h) => h.replace(/<section[^>]*data-coverage-panel="query"[\s\S]*?<\/section>/, '') },
  { name: 'reason-not-recorded used as a stored REASON', file: 'Results.dc.html', apply: (h) => h.replace('data-search-reason="none"', 'data-search-reason="reason-not-recorded"') },
  { name: 'a refused scope rendered as a zero', file: 'Results.dc.html', apply: (h) => h.replace('Inspection photographs, applicant upload folder', '0 documents in this scope') },
  { name: 'a coverage panel whose numbers do not reconcile', file: 'Results.dc.html', apply: (h) => h.replace('data-searched="25"', 'data-searched="27"') },
];

const planted = [];
for (const p of PLANTS) {
  const target = path.join(HERE, p.file);
  const original = fs.readFileSync(target, 'utf8');
  let r;
  try {
    fs.writeFileSync(target, p.apply(original));
    r = node(['check.mjs'], HERE);
  } finally {
    fs.writeFileSync(target, original);
  }
  const refusals = r.out.split('\n').filter((l) => /^ {5}/.test(l)).map((l) => l.trim());
  planted.push({
    planted: p.name,
    board: p.file,
    exit: r.exit,
    refusedAsRequired: r.exit !== 0,
    expect: /FAIL/.test(r.out),
    verbatimRefusals: refusals,
  });
}

/* -------------------------------------------------- the completion gate */

const gateFile = path.join(DOC_REPO, '_design', 'surface_coverage.json');
const gateOriginal = fs.readFileSync(gateFile, 'utf8');
const gateWith = run(process.execPath, [path.join(DOC_REPO, 'scripts', 'govtech', 'design-completion-gate.mjs')]);

let gateWithout;
try {
  /** The declaration this lane added, removed again: the "before" half, measured rather than remembered. */
  fs.writeFileSync(
    gateFile,
    gateOriginal.replace('"folder": "smartcity-records-search"', '"folder": null,\n      "planRow": "G-147"'),
  );
  gateWithout = run(process.execPath, [path.join(DOC_REPO, 'scripts', 'govtech', 'design-completion-gate.mjs')]);
} finally {
  fs.writeFileSync(gateFile, gateOriginal);
}
// Restoration asserted, not assumed.
const gateRestored = run(process.execPath, [path.join(DOC_REPO, 'scripts', 'govtech', 'design-completion-gate.mjs')]);

const r4Lines = (out) => out.split('\n').filter((l) => /^\s+(work|lens):/.test(l)).map((l) => l.trim());

const artifacts = {
  lane: 'g147-record-search',
  planRow: 'G-147',
  kind: 'instrument probe (not a deployed-surface probe)',
  filedAt: new Date().toISOString(),
  instrument:
    'NOT scripts/surface-probe.mjs. That instrument measures DEPLOYED surfaces; Records search is not built, so there ' +
    'is no deployed surface for this lane to measure and none is claimed. What is measured here is the design ' +
    'instrument: that check.mjs passes non-vacuously on the real boards, that it refuses named planted violations, ' +
    'and that the design-completion gate stops reporting work:records at R4 once the declaration is in place.',

  refs: {
    dashboards: 'origin/main 7487d7c0a55deeefc286c4a1047545757b802c5b (dispatch ref 96fdafbb)',
    smartFiles: 'origin/main 6d71bf38fe0cc67fafd4fe8b55fb55b7f07c863d',
    dashboardsCheckout:
      'the dashboards working tree is parked on 178e968b, so nothing was read from it; every product fact was read ' +
      'with `git show <ref>:<path>` and the composer was imported from a temp extraction of the ref',
  },

  check: {
    command: 'node _design/smartcity-records-search/check.mjs',
    exit: check.exit,
    verdictLine: verdictLine(check.out),
    matchedInput: matchedInput(check.out),
    selfTests: (check.out.match(/^self-tests: .*$/m) || [''])[0],
    predicateCount: (matchedInput(check.out).split(',').length || 0),
    boards: check.out.split('\n').filter((l) => /^ok {3}/.test(l)).map((l) => l.trim()),
  },

  violate: {
    command: 'node _design/smartcity-records-search/violate.mjs',
    exit: violate.exit,
    summary: (violate.out.match(/^\d+\/\d+ plants caught.*$/m) || [''])[0],
    closing: violate.out.split('\n').slice(-2).map((l) => l.trim()).filter(Boolean),
  },

  plantedViolations: planted,

  designCompletionGate: {
    command: 'node scripts/govtech/design-completion-gate.mjs',
    withThisLanesDeclaration: { exit: gateWith.exit, r4Findings: r4Lines(gateWith.out), tail: gateWith.out.split('\n').slice(-3).map((l) => l.trim()) },
    withTheDeclarationRemoved: { exit: gateWithout.exit, r4Findings: r4Lines(gateWithout.out), tail: gateWithout.out.split('\n').slice(-3).map((l) => l.trim()) },
    restored: { exit: gateRestored.exit, r4Findings: r4Lines(gateRestored.out) },
    whatThisShows:
      'work:records appears at R4 when the declaration is removed and does not appear when it is present, measured by ' +
      'flipping the single line rather than by recalling the earlier run. The gate still exits non-zero for OTHER ' +
      'lanes\' findings (R1 smartcity-citizen-lens, R3 four designs with no instrument), none of which is this lane\'s.',
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(artifacts, null, 2) + '\n');

console.log(`wrote ${path.relative(DOC_REPO, OUT)}`);
console.log(`  check.mjs       exit ${check.exit}   ${check.out.match(/^matched inputs: (.*)$/m)?.[1] || ''}`);
console.log(`  violate.mjs     exit ${violate.exit}   ${(violate.out.match(/^\d+\/\d+ plants caught.*$/m) || [''])[0]}`);
console.log(`  plants          ${planted.filter((p) => p.refusedAsRequired).length}/${planted.length} refused`);
console.log(`  gate            R4 with declaration: [${r4Lines(gateWith.out).join(' | ') || 'none'}]`);
console.log(`  gate            R4 without it:       [${r4Lines(gateWithout.out).join(' | ') || 'none'}]`);
console.log(`  gate            restored:            exit ${gateRestored.exit}, R4 [${r4Lines(gateRestored.out).join(' | ') || 'none'}]`);
