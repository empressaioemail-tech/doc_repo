/**
 * GATE 1 for the parallel-department-review instrument, run rather than described.
 *
 *   node violate.mjs
 *
 * WHAT IT DOES, IN TWO DIRECTIONS. It copies the real design into a scratch directory, requires
 * that copy to pass -- the baseline -- then plants one violation at a time and requires the check
 * to fail for the named reason. After each case it restores the baseline and requires the check
 * to pass again. Exit 1 if either direction is wrong.
 *
 * WHY THE BASELINE IS NOW JUST A COPY (G-164, 2026-09-18). check.mjs used to report three real
 * violations on the boards as shipped -- the stale department-model claim, finding 13's heading,
 * and the held-back item printed as an escalation -- so the unmodified design could not be the
 * baseline, and this file patched those three defects out IN A SCRATCH COPY to get one. G-164
 * repaired the design itself, in gen.mjs, so the shipped boards now ARE the clean baseline and
 * that patch is deleted rather than kept. It is deleted, not merely unused: a scratch repair
 * whose anchors no longer exist cannot apply, and one that still applied would make this
 * instrument's baseline a copy of a board the folder no longer ships. No predicate moved and no
 * plant was removed -- all three defects are still planted below, so any of them coming back
 * fails this instrument rather than hiding inside its own baseline step.
 *
 * WHY A SCRATCH COPY AT ALL. A violation planted in place and interrupted would leave the design
 * carrying a defect, and a tool whose failure mode is a corrupted artifact does not get run.
 *
 * WHAT A PASSING CASE MEANS. Nothing here trusts check.mjs's exit code alone. Each case names the
 * substring the failure must carry, so a check that fails for the wrong reason -- a typo in an
 * extractor, a crash, a vacuity abort -- does not count as having caught the violation it aimed
 * at. The abort cases take a predicate's inputs away and require exit 2, which is the difference
 * between "not run" and "passed".
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'g148-departments-'));
const BOARDS = ['Main.dc.html', 'Department.dc.html', 'Board.dc.html', 'Conflict.dc.html', 'Letter.dc.html'];
const SRC = ['check.mjs', 'source-facts.json', 'README.md', 'canvas.json', ...BOARDS];

const read = (f) => fs.readFileSync(new URL('./' + f, here), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(scratch, f), s);
const copyIn = () => {
  for (const f of SRC) fs.writeFileSync(path.join(scratch, f), read(f));
};
const run = () => {
  try {
    return { code: 0, out: execFileSync(process.execPath, [path.join(scratch, 'check.mjs')], { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (err) {
    return { code: err.status === undefined ? -1 : err.status, out: String(err.stdout || '') + String(err.stderr || '') };
  }
};
const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
/** Replace once, and refuse to run if the anchor is not there. */
const swap = (file, from, to) => {
  const s = fs.readFileSync(path.join(scratch, file), 'utf8');
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 70)));
  write(file, s.replace(from, to));
};
/** Read one scratch file, apply a function, write it back. */
const edit = (file, fn) => {
  const s = fs.readFileSync(path.join(scratch, file), 'utf8');
  const out = fn(s);
  must(out !== s, 'the edit to ' + file + ' changed nothing');
  write(file, out);
};
const del = (file) => fs.rmSync(path.join(scratch, file), { force: true });

/* ------------------------------------------------------------- the baseline
   The baseline is the design AS IT SHIPS. Until G-164 it was a scratch copy with the three
   defects check.mjs found patched out; the design now carries the repairs, so the list is empty
   and the loop below simply copies the folder. Kept as a named list so a later lane can see
   exactly what used to be patched here and cannot quietly reintroduce a patch step. */
const HELD_BACK_HEADING = '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Held back &mdash; cannot enter this letter &mdash; 1</div>\n                ';

/* Empty on purpose. It used to hold three swaps that patched the three findings out of the
   scratch copy: the stale "no department model at all" claim in README.md and canvas.json,
   finding 13's heading, and the escalation/held-back fold in Letter.dc.html. G-164 repaired
   all three on the boards, and each is still planted as a case below, so the list stays as a
   named step only so a later lane cannot reintroduce a patch here without it being visible. */
const repairs = [];

const baseline = () => {
  for (const f of fs.readdirSync(scratch)) fs.rmSync(path.join(scratch, f), { recursive: true, force: true });
  copyIn();
  for (const r of repairs) r();
};

/* ------------------------------------------------------------------ the cases */
const cases = [
  {
    name: 'the roster is the ruling\'s seven, not an invented department',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Development services</span></span>', '>Engineering</span></span>'),
    expect: 'the board names the department "Engineering"',
  },
  {
    name: 'finding 13 carries the heading the product puts at 13',
    board: 'Department.dc.html',
    plant: () => swap('Department.dc.html', '>Parking spaces required<', '>Fire apparatus access<'),
    expect: 'finding 13 is drawn as "Fire apparatus access"',
  },
  {
    name: 'a numbered circle outside the product numbering',
    board: 'Department.dc.html',
    plant: () => swap('Department.dc.html', 'background:var(--sc-crit);">2</span>', 'background:var(--sc-crit);">14</span>'),
    expect: "outside the product's numbering, which stops at 13",
  },
  {
    name: 'the notice loses the held-back heading and folds it into escalations',
    board: 'Letter.dc.html',
    plant: () => {
      swap('Letter.dc.html', 'no action from you &mdash; 1</div>', 'no action from you &mdash; 2</div>');
      edit('Letter.dc.html', (s) => s.replace(HELD_BACK_HEADING, ''));
    },
    expect: "No heading carries the product's 1 heldBack class",
  },
  {
    name: 'the held-back item is printed as an escalation',
    board: 'Letter.dc.html',
    plant: () => {
      edit('Letter.dc.html', (s) => s.replace(HELD_BACK_HEADING, ''));
      edit('Letter.dc.html', (s) => s.replace('<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Not evaluated, by department', HELD_BACK_HEADING + '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin:var(--sc-5) 0 var(--sc-1);">Not evaluated, by department'));
    },
    expect: 'the held-back finding 6 ("Driveway width") is printed under',
  },
  {
    name: 'the ledger sums to the product total',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'two claimants</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">1</span>', 'two claimants</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">2</span>'),
    expect: 'the per-department ledger sums to 14',
  },
  {
    name: 'a ledger row whose own parts miss its count',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', '>1 escalated, 1 not evaluated</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">2</span>', '>1 escalated, 1 not evaluated</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">3</span>'),
    expect: 'the ledger row "Fire and EMS" counts 3 and its own parts sum to 2',
  },
  {
    name: 'the not-evaluated breakout ties to the product',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'Public works 2. Each is named', 'Public works 3. Each is named'),
    expect: 'the not-evaluated breakout names',
  },
  {
    name: 'a stated addition that does not add up',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', '8 + 2 + 2 + 0 + 1 = 13.', '8 + 2 + 2 + 0 + 1 = 12.'),
    expect: 'the notice prints "8 + 2 + 2 + 0 + 1 = 12"',
  },
  {
    name: 'a citation the product does not hold',
    board: 'Letter.dc.html',
    plant: () => swap('Letter.dc.html', 'Section 14-02-003 (bastrop_tx-bdc-2026-adopted)', 'Section 14-02-099 (bastrop_tx-bdc-2026-adopted)'),
    expect: 'the board cites "City of Bastrop Building Block B3 Section 14-02-099',
  },
  {
    name: 'a status word where a determination belongs',
    board: 'Department.dc.html',
    plant: () => swap('Department.dc.html', 'padding:1px 6px;">Uncertain</span>', 'padding:1px 6px;">In review</span>'),
    expect: 'the board badges "In review"',
  },
  {
    name: 'one element carrying both the dot and the badge',
    board: 'Department.dc.html',
    plant: () => swap('Department.dc.html', '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.05em;', '<span style="flex:none; font:500 12px/16px var(--sc-font-data); width:8px; height:8px; border-radius:var(--sc-r-full); letter-spacing:.05em;'),
    expect: 'carries both the department dot and the determination badge',
  },
  {
    name: 'the design asserts a source state the product no longer has',
    board: 'README.md',
    plant: () => swap('README.md', 'now declares **DEPARTMENT_ROLES** in `src/staff-identity.mjs`.', 'has **no department model at all**.'),
    expect: 'the design states the product has "no department model at all"',
  },
  {
    name: 'the canvas states the role gate that blocks the build',
    board: 'canvas.json',
    plant: () => edit('canvas.json', (s) => JSON.stringify({ ...JSON.parse(s), annotations: JSON.parse(s).annotations.filter((a) => a.id !== 'amend') }, null, 2) + '\n'),
    expect: 'no canvas annotation states the role gate',
  },
  {
    name: 'an undeclared artboard is not read',
    board: 'Extra.dc.html',
    plant: () => write('Extra.dc.html', '<!doctype html><html><body><x-dc><p>Front setback and more text to pass the length floor. City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted). Just more characters here so the board is over five hundred characters of visible text and is read rather than skipped for being short.</p></x-dc></body></html>'),
    expect: 'an artboard on disk that this instrument does not declare',
  },
  {
    name: 'ABORT a missing facts file refuses a verdict',
    board: 'source-facts.json',
    plant: () => del('source-facts.json'),
    expect: 'source-facts.json is missing or unparsable',
    abort: true,
  },
  {
    name: 'ABORT a predicate with no inputs refuses a verdict',
    board: 'all boards',
    plant: () => {
      let changed = 0;
      for (const f of BOARDS) {
        const s = fs.readFileSync(path.join(scratch, f), 'utf8');
        const t = s.replace(/City of Bastrop Building Block B3 Section \d{2}-\d{2}-\d{3} \([^)]+\)/g, 'the adopted edition').replace(/20\d\d International Building Code Section [\d.]+ \([^)]+\)/g, 'the adopted edition');
        if (t !== s) {
          write(f, t);
          changed += 1;
        }
      }
      must(changed > 0, 'no citation text was on any board to strip');
    },
    expect: 'REFUSING A VERDICT: these predicates matched nothing',
    abort: true,
  },
];

/* ---------------------------------------------------------------------- run */

let failures = 0;
let planted = 0;
baseline();
const clean = run();
if (clean.code !== 0) {
  console.error('the baseline does not pass, so no violation can be attributed to a planted one:');
  console.error(clean.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('SELF-TEST') || l.startsWith('REFUSING')).slice(0, 8).join('\n'));
  fs.rmSync(scratch, { recursive: true, force: true });
  process.exit(1);
}
console.log('direction 1  baseline as it ships  exit 0  PASS');
console.log('             ' + (clean.out.match(/matched inputs: (.*)/) || [, ''])[1]);
console.log('             self-tests: ' + (clean.out.match(/self-tests: (\d+\/\d+)/) || [, '?'])[1]);
console.log('');

for (const c of cases) {
  baseline();
  const want = c.abort ? 2 : 1;
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
  baseline();
  const back = run();
  const restored = back.code === 0;
  if (!restored) failures += 1;
  console.log('direction 1  ' + c.name);
  console.log('             planted on ' + c.board + '  exit ' + r.code + '  caught: ' + c.expect);
  console.log('direction 2  violation removed     exit ' + back.code + '  ' + (restored ? 'PASS' : 'STILL FAILING'));
}

fs.rmSync(scratch, { recursive: true, force: true });

console.log('');
if (failures) {
  console.error(failures + ' case(s) wrong. ' + planted + '/' + cases.length + ' violations were caught.');
  process.exit(1);
}
console.log(planted + '/' + cases.length + ' violations caught on a real artboard, and the shipped design passes in both directions.');
