/**
 * GATE 1, run rather than described.
 *
 *   node violate.mjs
 *
 * For each acceptance item this plants the violation on a REAL artboard, runs
 * check.mjs against it in a scratch copy, and requires the check to fail for the
 * stated reason. Then it puts the artboard back and requires the check to pass.
 * Both directions, every item, in one run. Exit 1 if any direction is wrong.
 *
 * WHY A SCRATCH COPY. A violation planted in place and interrupted would leave the
 * design carrying a defect, and a tool whose failure mode is a corrupted artifact
 * does not get run. The copies are made in the OS temp directory and removed.
 *
 * WHAT A PASSING VIOLATION MEANS. Nothing here trusts check.mjs's exit code alone.
 * Each case names the substring the failure must contain, so a check that fails
 * for the wrong reason -- a typo in the extraction, a crash, a vacuity abort --
 * does not count as having caught the violation it was aimed at. That is the same
 * distinction this whole file exists to make about the design.
 *
 * THE ABORT CASES ARE PART OF GATE 1. A check that returns exit 2 instead of a
 * verdict when it has no inputs is only verified by taking its inputs away, so
 * three of these cases do exactly that: no source-state.json, no markers at all,
 * and a badge stripped from every row.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'g150-violate-'));
const SRC = ['check.mjs', 'source-state.json', 'Main.dc.html', 'Reasoning.dc.html', 'Coverage.dc.html', 'Letter.dc.html', 'Cycle.dc.html'];

const copyIn = () => {
  for (const f of SRC) fs.copyFileSync(new URL('./' + f, here), path.join(scratch, f));
};
const read = (f) => fs.readFileSync(new URL('./' + f, here), 'utf8');
const run = () => {
  try {
    const out = execFileSync(process.execPath, [path.join(scratch, 'check.mjs')], { encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status === undefined ? -1 : err.status, out: String(err.stdout || '') + String(err.stderr || '') };
  }
};
const write = (f, s) => fs.writeFileSync(path.join(scratch, f), s);
const strip = () => {
  for (const f of fs.readdirSync(scratch)) fs.rmSync(path.join(scratch, f), { recursive: true, force: true });
  copyIn();
};
const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
/** Replace once, and refuse to run if the anchor is not there. A violation planted
    against a board that has since been reworded would otherwise pass vacuously. */
const swap = (file, from, to) => {
  const s = read(file);
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 60)));
  write(file, s.replace(from, to));
};
/**
 * Replace inside ONE finding row, found by its rule. Text like
 * `data-badge="NO ADJUDICATOR"` occurs once per row, so a whole-file replace would
 * plant the violation on five rows and prove the check catches something other
 * than what the case names.
 */
const inRow = (file, rule, from, to) => {
  const s = read(file);
  const start = s.indexOf('data-rule="' + rule + '"');
  must(start > -1, 'row not found in ' + file + ': ' + rule);
  const next = s.indexOf('<div data-finding="', start);
  const end = next === -1 ? s.length : next;
  const chunk = s.slice(start, end);
  must(chunk.includes(from), 'anchor not found in row "' + rule + '": ' + JSON.stringify(from));
  write(file, s.slice(0, start) + chunk.replace(from, to) + s.slice(end));
};

/* --------------------------------------------------------------- the cases
   `name` is the acceptance item, `board` is the real artboard it is planted on,
   `expect` is the substring the check's failure must carry. */
const cases = [
  {
    name: 'A1 one adjudicator, every other rule NO ADJUDICATOR (badge where none is)',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Permitted use', 'data-badge="NO ADJUDICATOR"', 'data-badge="LIVE CHECK"'),
    expect: 'LIVE CHECK on Permitted use',
  },
  {
    name: 'A1 one adjudicator, every other rule NO ADJUDICATOR (badge withheld where one exists)',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Front setback', 'data-badge="LIVE CHECK"', 'data-badge="NO ADJUDICATOR"'),
    expect: 'NO ADJUDICATOR on Front setback',
  },
  {
    name: 'A1 one adjudicator (the badge disagrees with the product for the same rule)',
    board: 'Cycle.dc.html',
    plant: () => inRow('Cycle.dc.html', 'Front setback', 'data-badge="LIVE CHECK"', 'data-badge="NO ADJUDICATOR"'),
    expect: 'NO ADJUDICATOR on Front setback',
  },
  {
    name: 'A2 adjudicated:null renders Unchecked, never Pass',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Permitted use', 'data-determination="Unchecked"', 'data-determination="Pass"'),
    expect: 'a machine Pass on Permitted use, which has no adjudicator',
  },
  {
    name: 'A3 Uncertain is not machine-derived',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Fire separation distance', 'data-author="reviewer"', 'data-author="machine"'),
    expect: 'an Uncertain on Fire separation distance that is not a named reviewer',
  },
  {
    name: 'A3 Uncertain requires a named reviewer (name removed, author left as reviewer)',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Fire separation distance', 'M. Leavis recorded a conflict', 'A reviewer recorded a conflict'),
    expect: 'an Uncertain on Fire separation distance that is not a named reviewer',
  },
  {
    name: 'A4 no invented section identifier (14-02-005 in prose)',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'This rule is drawn, not built.', 'See 14-02-005.'),
    expect: 'SECTION IDENTIFIER outside a citation that source does not hold: 14-02-005',
  },
  {
    name: 'A4 no invented section identifier (dots where source uses dashes)',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'This rule is drawn, not built.', 'See 14.02.005.'),
    expect: 'SECTION IDENTIFIER outside a citation that source does not hold: 14.02.005',
  },
  {
    name: 'A4 the book is City of Bastrop Building Block B3, not Bastrop Development Code',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)', 'Bastrop Development Code Section 14-02-003 (bastrop_tx-bdc-2026-adopted)'),
    expect: 'a citation naming a book nobody holds: "Bastrop Development Code Section',
  },
  {
    name: 'A4 a title nobody holds, stated without a citation',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'This rule is drawn, not built.', 'The Bastrop Development Code has no adjudicator here.'),
    expect: 'a book title in the shape "<Something> Code" that source does not hold: The Bastrop Development Code',
  },
  {
    name: 'A5 no paraphrasing a code where quotable === false',
    board: 'Main.dc.html',
    plant: () => inRow('Main.dc.html', 'Fire separation distance', 'M. Leavis recorded a conflict between two adopted authorities for the west wall, 12 Sep.', 'IBC 705.5 requires a two-hour rating for the west wall.'),
    expect: 'PARAPHRASE of a quotable:false code',
  },
  {
    name: 'A5 the letter refuses, or it does not cite the code at all',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', '<span data-refusal="1"', '<span data-refusal-removed="1"'),
    expect: 'refusal(s) for 1 finding(s) citing a quotable:false book',
  },
  {
    name: 'A6 the provenance ladder is the product (rung)',
    board: 'Reasoning.dc.html',
    plant: () => swap('Reasoning.dc.html', 'data-provenance="form-assertion"', 'data-provenance="captured-reading"'),
    expect: 'rung captured-reading',
  },
  {
    name: 'A6 the provenance ladder is the product (top rung claimed built)',
    board: 'Reasoning.dc.html',
    plant: () => swap('Reasoning.dc.html', 'data-provenance-next-built="0"', 'data-provenance-next-built="1"'),
    expect: 'next built 1',
  },
  {
    name: 'the letter ties (a notice count that does not match the product)',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'data-notice="corrections" data-count="1"', 'data-notice="corrections" data-count="2"'),
    expect: 'the corrections notice count disagrees with the product',
  },
  {
    name: 'the letter ties (counts that no longer sum to the stated total)',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'data-notice-total="13"', 'data-notice-total="14"'),
    expect: 'the correction notice does not tie',
  },
  {
    name: 'the two axes are never added together (a corpus count that drifts)',
    board: 'Coverage.dc.html',
    plant: () => swap('Coverage.dc.html', 'data-absence-kind="unchecked" data-absence-count="5"', 'data-absence-kind="unchecked" data-absence-count="6"'),
    expect: 'the unchecked absence count disagrees with the product',
  },
  {
    name: 'the whole-chain collapse is a property of the product',
    board: 'Coverage.dc.html',
    plant: () => swap('source-state.json', '"detected": true', '"detected": false'),
    expect: 'the product did not collapse a whole-chain failure',
  },
  {
    name: 'the console chips count what the product counts (the draft said Pass 1)',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'data-chip="Pass 0"', 'data-chip="Pass 1"'),
    expect: 'the filter chip "Pass 1" disagrees with the product',
  },
  {
    name: 'GATE 2 a second adjudicator changes the badge',
    board: 'source-state.json',
    plant: () => swap('source-state.json', '"withSecondAdjudicatorBadgeFor008": "LIVE CHECK"', '"withSecondAdjudicatorBadgeFor008": "NO ADJUDICATOR"'),
    expect: 'GATE 2: adding an adjudicator for BASTROP-UDC:14-02-008 did not change the badge',
  },
  {
    name: 'GATE 2 the wrong way through the contract must throw for the stated reason',
    board: 'source-state.json',
    plant: () => swap('source-state.json', '"code": "uncertain_not_machine_derived"', '"code": "something_else"'),
    expect: 'GATE 2: machineUncertain threw "something_else" and the contract names "uncertain_not_machine_derived"',
  },
  {
    name: 'GATE 3 the extraction file is written with its matched-input count',
    board: 'all',
    plant: () => {},
    expect: 'identifier extraction:',
    expectExit: 0,
  },
  {
    name: 'REFUSED a board whose marker was removed is not read at all',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '<main data-board="console"', '<main data-board-removed="console"'),
    expect: 'no <main data-board="..."> marker',
  },
  {
    name: 'REFUSED an undeclared board is not read',
    board: 'Extra.dc.html',
    plant: () => write('Extra.dc.html', '<!doctype html><html><body><x-dc><main data-board="extra"><div data-finding="1" data-rule="x" data-determination="Unchecked" data-author="machine"></div></main></x-dc></body></html>'),
    expect: 'board "extra" is not declared in DECLARED',
  },
  {
    name: 'ABORT missing source-state.json refuses a verdict',
    board: 'source-state.json',
    plant: () => fs.rmSync(path.join(scratch, 'source-state.json')),
    expect: 'source-state.json is missing or unparsable',
    abort: true,
  },
  {
    name: 'ABORT a board that fails closed fails closed (every badge stripped)',
    board: 'Main.dc.html + Cycle.dc.html',
    plant: () => {
      for (const f of ['Main.dc.html', 'Cycle.dc.html']) write(f, read(f).replace(/ data-badge="[^"]*"/g, ''));
    },
    expect: 'finding rows against 0 badges',
  },
  {
    name: 'ABORT a predicate with no inputs across every board refuses a verdict',
    board: 'Main.dc.html + Cycle.dc.html',
    plant: () => {
      for (const f of ['Main.dc.html', 'Cycle.dc.html']) write(f, read(f).replace(/ data-book="IBC2018P6"/g, ''));
    },
    expect: 'REFUSING A VERDICT: these predicates matched nothing',
    abort: true,
  },
];

/* ------------------------------------------------------------------- run */

let failures = 0;
let planted = 0;
copyIn();
const clean = run();
if (clean.code !== 0) {
  console.error('the unmodified boards do not pass, so no violation can be attributed to a planted one:');
  console.error(clean.out.split('\n').filter((l) => l.startsWith('FAIL')).slice(0, 8).join('\n'));
  process.exit(1);
}
const cleanInputs = (clean.out.match(/matched inputs: (.*)/) || [, ''])[1];
console.log('direction 1  clean boards           exit 0  PASS');
console.log('             ' + cleanInputs);
console.log('');

for (const c of cases) {
  strip();
  const want = c.expectExit !== undefined ? c.expectExit : c.abort ? 2 : 1;
  let r;
  try {
    c.plant();
    r = run();
  } catch (err) {
    failures += 1;
    console.error('PLANT FAILED  ' + c.name);
    console.error('     ' + err.message);
    continue;
  }
  const caught = r.code === want && r.out.includes(c.expect);
  if (!caught) {
    failures += 1;
    console.error('NOT CAUGHT  ' + c.name);
    console.error('     planted on ' + c.board + ', expected exit ' + want + ' carrying "' + c.expect + '"');
    console.error('     got exit ' + r.code);
    for (const line of r.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('REFUSING') || l.startsWith('SELF-TEST')).slice(0, 4)) {
      console.error('     ' + line.trim());
    }
    continue;
  }
  planted += 1;
  strip();
  const back = run();
  const restored = back.code === 0;
  if (!restored) failures += 1;
  console.log('direction 1  ' + c.name);
  console.log('             planted on ' + c.board + '  exit ' + r.code + '  caught: ' + c.expect);
  console.log('direction 2  violation removed     exit ' + back.code + '  ' + (restored ? 'PASS' : 'STILL FAILING'));
}

strip();
fs.rmSync(scratch, { recursive: true, force: true });

const g3path = new URL('./identifier-extraction.json', here);
if (!fs.existsSync(g3path)) {
  failures += 1;
  console.error('GATE 3: identifier-extraction.json was not written. Run `node check.mjs` first.');
} else {
  const g3 = JSON.parse(fs.readFileSync(g3path, 'utf8'));
  console.log('');
  console.log('GATE 3 extraction: ' + g3.extraction.length + ' entries, ' + g3.totals.unknown +
    ' absent from source, kinds ' + JSON.stringify(g3.matchedInputs));
  if (g3.extraction.length === 0 || g3.totals.unknown !== 0) {
    failures += 1;
    console.error('GATE 3: the extraction is empty or holds an identifier source cannot back');
  }
}

console.log('');
if (failures) {
  console.error(failures + ' case(s) wrong. ' + planted + '/' + cases.length + ' violations were caught.');
  process.exit(1);
}
console.log(planted + '/' + cases.length + ' violations caught on a real artboard, and the unmodified boards pass.');
console.log('self-tests inside check.mjs: ' + (clean.out.match(/self-tests: (\d+\/\d+)/) || [, '?'])[1]);
