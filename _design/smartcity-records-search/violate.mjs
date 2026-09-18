/**
 * The plants. `node violate.mjs`
 *
 * check.mjs passing is not evidence that check.mjs can fail. This file mutates a
 * real artboard in place, one violation at a time, runs check.mjs against it, and
 * requires the specific finding that violation should produce. Then it restores
 * the board and re-runs check.mjs clean, so the folder is left exactly as it was
 * found and the restoration is itself asserted rather than assumed.
 *
 * The board is mutated IN PLACE rather than copied to a new file on purpose:
 * check.mjs classifies every *.dc.html it finds, and an unclassified file would
 * make every plant fail for the same wrong reason, which is a plants file that
 * proves nothing about the plants.
 *
 * A plant that fails to be caught, or is caught for a DIFFERENT reason than the
 * one it was planted to prove, is a failure of this file. Both are checked.
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const path = (f) => new URL('./' + f, import.meta.url);

function runCheck() {
  const r = spawnSync(process.execPath, ['check.mjs'], { cwd: here, encoding: 'utf8' });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

const read = (f) => fs.readFileSync(path(f), 'utf8');
const write = (f, s) => fs.writeFileSync(path(f), s);

/** A body insertion point: immediately after the scoped main opens. */
const inBody = (html, snippet) => {
  const m = html.match(/data-lens-body="records"[^>]*>/);
  if (!m) throw new Error('a plant could not find the scoped body; the plants file is out of date');
  return html.slice(0, m.index + m[0].length) + snippet + html.slice(m.index + m[0].length);
};
const RESULT_ROW = '<div data-result="true" data-leg="cases" data-region="permits-pipeline">a planted row</div>';

const PLANTS = [
  {
    name: 'results with no coverage at all',
    file: 'Results.dc.html',
    apply: (h) => h.replace(/<section[^>]*data-coverage-panel="query"[\s\S]*?<\/section>/, ''),
    expect: 'NO coverage panel',
  },
  {
    name: 'a result row placed above the coverage panel',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, RESULT_ROW),
    expect: 'coverage panel comes AFTER the first result',
  },
  {
    name: 'the at-rest board quietly showing a result',
    file: 'Main.dc.html',
    apply: (h) => inBody(h, RESULT_ROW),
    expect: 'result rows on the at-rest board',
  },
  {
    name: 'an invented search state',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-search-state="pending-index">x</span>'),
    expect: 'invented states: pending-index',
  },
  {
    name: 'an invented not-indexed reason',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-search-reason="ocr-required">x</span>'),
    expect: 'invented search reason: ocr-required',
  },
  {
    name: 'reason-not-recorded used as a REASON, which the product refuses to store',
    file: 'Results.dc.html',
    apply: (h) => h.replace('data-search-reason="none"', 'data-search-reason="reason-not-recorded"'),
    expect: 'invented search reason: reason-not-recorded',
  },
  {
    name: 'an invented region',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-region="parks-facilities">x</span>'),
    expect: 'invented regions: parks-facilities',
  },
  {
    name: 'an uncatalogued vendor',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-gated-by="prophecy">x</span>'),
    expect: 'invented kinds: prophecy',
  },
  {
    name: 'a third leg',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-leg="parcels">x</span>'),
    expect: 'invented legs: parcels',
  },
  {
    name: 'an invented scope type',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<span data-scope-type="department">x</span>'),
    expect: 'invented scopes: department',
  },
  {
    name: 'an invented outcome word',
    file: 'Gaps.dc.html',
    apply: (h) => inBody(h, '<span data-outcome="partial">x</span>'),
    expect: 'invented outcomes: partial',
  },
  {
    name: 'a coverage panel whose numbers do not reconcile',
    file: 'Results.dc.html',
    apply: (h) => h.replace('data-searched="25"', 'data-searched="27"'),
    expect: 'does not reconcile',
  },
  {
    name: 'a coverage panel with a reason key dropped',
    file: 'Results.dc.html',
    apply: (h) => h.replace(' data-reason-extraction-failed="1"', ''),
    expect: 'a reason key is missing',
  },
  {
    name: 'an unbadged illustrative corpus count',
    file: 'Results.dc.html',
    apply: (h) => h.replace(' data-fixture="true"', ''),
    expect: 'is not badged data-fixture',
  },
  {
    name: 'a coverage panel with the counting rule stripped out',
    file: 'Main.dc.html',
    apply: (h) => h.replace(/<div data-coverage-rule="documents"[\s\S]*?<\/div>/, ''),
    expect: 'is not paired with a counting-rule element',
  },
  {
    name: 'an invented badge word',
    file: 'Main.dc.html',
    apply: (h) => inBody(h, '<span data-badge="Coming soon" style="x">Coming soon</span>'),
    expect: 'invented badge word: Coming soon',
  },
  {
    name: 'a badge that declares one word and prints another',
    file: 'Main.dc.html',
    apply: (h) => h.replace('<span data-badge="Island"', '<span data-badge="Empty"'),
    expect: 'a badge declares one word and prints another',
  },
  {
    name: 'the design saying "Not built" in its own voice',
    file: 'Results.dc.html',
    apply: (h) => inBody(h, '<p>This surface is Not built.</p>'),
    expect: 'in its own voice',
  },
  {
    name: 'a person named in a cell',
    file: 'Results.dc.html',
    apply: (h) => h.replace('Building permit, 2102 Pine St', 'S. Carrillo'),
    expect: 'cells name people: S. Carrillo',
  },
  {
    name: 'a refusal rendered as a zero instead of a refusal',
    file: 'Results.dc.html',
    apply: (h) => h.replace('Inspection photographs, applicant upload folder', '0 documents in this scope'),
    expect: 'a refusal is rendered with a zero count',
  },
  {
    name: 'the defect region given the coverage panel it exists to lack',
    file: 'Gaps.dc.html',
    apply: (h) => h.replace(
      'data-defect="silent-coverage"',
      'data-defect="silent-coverage" data-planted="x"><div data-coverage data-coverage-leg="cases" data-regions-registered="11" data-regions-asked="10" data-regions-not-asked="1"></div><div',
    ),
    expect: 'carries a coverage panel, so it is not the defect',
  },
  {
    name: 'a board with no scope marker at all',
    file: 'Gaps.dc.html',
    apply: (h) => h.replace(' data-lens-body="records"', ''),
    expect: 'no data-lens-body="records" marker',
  },
  {
    name: 'a board drawn with no design-state line',
    file: 'Main.dc.html',
    apply: (h) => h.replace('data-design-state="drawn-not-built"', 'data-design-state="shipped"'),
    expect: 'no data-design-state="drawn-not-built" line',
  },
  {
    name: 'a board that forgets the ref it was drawn against',
    file: 'Main.dc.html',
    apply: (h) => h.replace(/7487d7c0/g, '00000000'),
    expect: 'does not name the ref it was drawn against',
  },
];

/* ------------------------------------------------------------------- run */

const baseline = runCheck();
if (baseline.status !== 0) {
  console.error('check.mjs does not pass on the UNPLANTED boards, so this file cannot tell a caught');
  console.error('plant from an already-broken folder. Fix the design before planting anything.');
  console.error(baseline.out.trim());
  process.exit(2);
}

let failed = 0;
let caught = 0;
for (const plant of PLANTS) {
  const original = read(plant.file);
  let result;
  try {
    write(plant.file, plant.apply(original));
    result = runCheck();
  } finally {
    write(plant.file, original);
  }

  const ok = result.status !== 0 && result.out.includes(plant.expect);
  if (ok) {
    caught += 1;
    console.log(`caught  ${plant.file.padEnd(16)} ${plant.name}`);
  } else {
    failed += 1;
    console.error(`MISSED  ${plant.file.padEnd(16)} ${plant.name}`);
    console.error(`        expected a failure naming: ${plant.expect}`);
    console.error(`        check.mjs exited ${result.status}`);
  }
}

/** Restoration is asserted, not assumed: the boards must be clean again. */
const restored = runCheck();
const restoreOk = restored.status === 0;
if (!restoreOk) {
  failed += 1;
  console.error('\nRESTORE FAILED: check.mjs does not pass after the plants were removed.');
  console.error(restored.out.trim());
}

console.log(`\n${caught}/${PLANTS.length} plants caught, boards restored: ${restoreOk}`);
if (failed) {
  console.error(`${failed} problem(s). An instrument that cannot be shown to fail is not an instrument.`);
  process.exit(1);
}
console.log('every plant caught for the reason it was planted, and nothing left mutated.');
