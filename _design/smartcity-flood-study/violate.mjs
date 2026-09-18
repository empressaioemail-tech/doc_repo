/**
 * The flood-study instrument, run rather than described.
 *
 *   node violate.mjs
 *
 * WHY THIS FILE OPENS WITH A REPAIR. The G-150 model requires the unmodified
 * boards to pass before a violation can be attributed to a planted one. These boards do
 * not pass, and they should not: the depth control's basis line asserts that naming a
 * depth by return period "would need a local rainfall atlas nobody has cited yet", and
 * the engine names it already from NOAA Atlas 14. So the first direction here is the
 * shipped boards FAILING for that reason, and the clean baseline is established the only
 * honest way left: the three clauses that carry the stale claim are corrected IN THE
 * SCRATCH COPY and the check is required to pass with a matched-input count. Nothing
 * edits a design; the dispatch says report the defect, do not redraw the board.
 *
 * WHAT A PASSING VIOLATION MEANS. Exit codes are not trusted alone. Every case names the
 * substring the failure must carry, so a check that fails for the wrong reason -- a
 * broken extraction, a crash, a vacuity abort -- does not count as having caught the
 * violation it was aimed at. Each case is then removed and the run must return to exit 0,
 * so a case cannot pass by leaving the scratch copy broken.
 *
 * THE ABORT CASES ARE PART OF THE PROOF. A check that exits 2 rather than issuing a
 * verdict is only verified by taking its inputs away, so two cases do exactly that: the
 * product-side facts file, and the canvas annotations the matched-input floor is read on.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'g148-flood-study-violate-'));
const SRC = ['check.mjs', 'source-facts.json', 'README.md', 'canvas.json',
  'Main.dc.html', 'Parcel.dc.html', 'Depth.dc.html', 'Running.dc.html', 'Empty.dc.html'];

const must = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const copyIn = () => {
  for (const f of SRC) fs.copyFileSync(new URL('./' + f, here), path.join(scratch, f));
};
const read = (f) => fs.readFileSync(path.join(scratch, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(scratch, f), s);
const run = () => {
  try {
    return { code: 0, out: execFileSync(process.execPath, [path.join(scratch, 'check.mjs')], { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (err) {
    return { code: err.status === undefined ? -1 : err.status, out: String(err.stdout || '') + String(err.stderr || '') };
  }
};

/** Replace once, and refuse to run if the anchor is not on the board. A violation planted
    against copy that has since been reworded would otherwise pass vacuously. */
const swap = (file, from, to) => {
  const s = read(file);
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 80)));
  write(file, s.replace(from, to));
};
/** The same, scoped to one row: the anchor bounds the region and the edit happens inside it. */
const swapIn = (file, anchor, from, to) => {
  const s = read(file);
  const at = s.indexOf(anchor);
  must(at > -1, 'row anchor not found in ' + file + ': ' + JSON.stringify(anchor.slice(0, 60)));
  const end = s.indexOf('</div>', at);
  must(end > at, 'row anchor is not inside a row div in ' + file);
  const row = s.slice(at, end);
  must(row.includes(from), 'the value to swap is not in the row: ' + JSON.stringify(from));
  write(file, s.slice(0, at) + row.replace(from, to) + s.slice(end));
};
/** Edit the facts file the way a re-dump would: the product side, not the board side. */
const patchFacts = (fn) => {
  const s = JSON.parse(read('source-facts.json'));
  fn(s);
  write('source-facts.json', JSON.stringify(s, null, 2) + '\n');
};

/** The three clauses that carry the stale return-period claim, corrected in the scratch copy.
    Each anchor is required to be present, so this cannot silently become a repair of a board
    that has already been fixed. */
const repair = () => {
  copyIn();
  swap('Main.dc.html', ' the model takes no storm duration, and naming these by return period would need a local rainfall atlas nobody has cited yet.',
    ' the model takes no storm duration.');
  swap('README.md', 'no depth-to-return-period table anywhere in the source', 'no duration-to-depth table anywhere in the source');
  swap('README.md', 'naming them by return period needs a local', 'naming them by return period needs a source');
  swap('README.md', 'rainfall atlas nobody has cited', 'the boards cannot reach');
  swap('canvas.json', 'no depth-to-return-period table anywhere in', 'no duration-to-depth table anywhere in');
};
const strip = () => {
  for (const f of fs.readdirSync(scratch)) fs.rmSync(path.join(scratch, f), { recursive: true, force: true });
  repair();
};

/* ----------------------------------------------------------- the cases */

const cases = [
  {
    name: 'the depth control is labelled by return period again, the over-correction reversed',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>2&Prime;</span>', '>2-year</span>'),
    expect: 'which names a storm duration or return period the engine does not accept',
  },
  {
    name: 'a depth preset is rendered as something that is not a depth at all',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>7&Prime;</span>', '>seven</span>'),
    expect: 'as neither a depth in inches nor anything the engine takes',
  },
  {
    name: 'a preset is offered outside the bound the engine enforces',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>10&Prime;</span>', '>72&Prime;</span>'),
    expect: 'offers the preset 72 inches',
  },
  {
    name: 'the accepted depth range drifts off the engine message most boards carry it on',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'Engine accepts any depth in (0, 60].', 'Engine accepts any depth in (0, 48].'),
    expect: 'states the accepted range as (0, 48]',
  },
  {
    name: 'the only board stating the bound stops stating it',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'Engine accepts any depth in (0, 60].', 'Engine accepts any depth.'),
    expect: 'states no accepted depth range',
  },
  {
    name: 'the claim that no naming by return period exists is put back on the board',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', ' the model takes no storm duration.', ' the model takes no storm duration, and naming these by return period would need a local rainfall atlas nobody has cited yet.'),
    expect: 'the engine names it already',
  },
  {
    name: 'the no-duration claim goes stale against the engine, and the instrument refuses rather than passing it',
    board: 'source-facts.json',
    plant: () => patchFacts((s) => { s.scan.byTerm.duration = 3; }),
    expect: 'SELF-TEST FAILED: claim: the no-duration claim holds against the engine',
    abort: true,
  },
  {
    name: 'the legend drops an entry the source renders',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', '<div style="display:flex; align-items:flex-start; gap:7px; min-width:0;"><span style="flex:none; width:14px; height:10px; margin-top:3px; border-radius:2px; border:2px solid var(--sc-ink); background:transparent;"></span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2); overflow-wrap:break-word;">Parcel</span></div>', ''),
    expect: 'renders 8 legend entries',
  },
  {
    name: 'the legend grows an entry the source does not have',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', '>Flow path</span>', '>Basement seepage</span>'),
    expect: 'not in source "basement seepage"',
  },
  {
    name: 'two legend entries swap places and the key no longer matches the drawing',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', '>FEMA flood zone (reference)</span>', '>FEMA flood zone (ref)</span>'),
    expect: 'not in source',
  },
  {
    name: 'the ponding entry is stated as unconditional where the source only draws it when it ponds',
    board: 'Empty.dc.html',
    plant: () => swap('Empty.dc.html', 'The ponding entry drops out of the legend when there is no ponding on the map, since a legend key with nothing behind it reads as a broken render.', 'The ponding entry is drawn on every map.'),
    expect: 'does not state that the ponding legend entry is conditional',
  },
  {
    name: 'the citation refusal moves onto the modeled card, where G-130 does not govern',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', '>Drainage engine &middot; DEM-derived catchment',
      '<span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-warn);">Refused: provisional for citation, and not to be relied on to skip an engineer.</span><div style="margin-top:auto; padding-top:var(--sc-2); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-top:1px solid var(--sc-line-faint);">Drainage engine &middot; DEM-derived catchment'),
    expect: 'refusal sits on the modeled card',
  },
  {
    name: 'the surviving determination loses its vintage',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', 'NFHL_48_20260101 &middot; read 12 Sep. Authoritative for serving.', 'Parcel-record flood rail. Authoritative for serving.'),
    expect: 'carries no vintage',
  },
  {
    name: 'the modeled card stops saying it is not governed by G-130',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', 'Not a flood determination and not governed by G-130.', 'Modeled drainage study, illustrative only.'),
    expect: 'does not state that it is not governed by G-130',
  },
  {
    name: 'the ponding ellipse is redrawn so the picture no longer covers the stated share',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', 'rx="38" ry="23"', 'rx="56" ry="34"'),
    expect: 'no drawn ponding shape is within 3 points',
  },
  {
    name: 'the stated share drifts off the shape that is drawn',
    board: 'Parcel.dc.html',
    plant: () => swap('Parcel.dc.html', 'Ponding modeled across 34 percent of the parcel', 'Ponding modeled across 70 percent of the parcel'),
    expect: 'states 70 percent of the parcel ponded',
  },
  {
    name: 'a per-depth figure drifts on the depth board',
    board: 'Depth.dc.html',
    plant: () => swap('Depth.dc.html', '>34%</span>', '>70%</span>'),
    expect: 'states 70 percent of the parcel ponded',
  },
  {
    name: 'a parcel the engine never answered is written down as a parcel that does not pond',
    board: 'Running.dc.html',
    plant: () => swapIn('Running.dc.html', '>B-26-0344</span>', '>retry</span>', '>0.41 ac ponding</span>'),
    expect: 'down as a result',
  },
  {
    name: 'one of the two retryable classes stops offering a retry',
    board: 'Running.dc.html',
    plant: () => swapIn('Running.dc.html', '>B-26-0339</span>', '>retry</span>', '>&mdash;</span>'),
    expect: 'offers no retry',
  },
  {
    name: 'the run header disagrees with the rows it is counting',
    board: 'Running.dc.html',
    plant: () => swap('Running.dc.html', '>3 of 7 complete</span>', '>3 of 6 complete</span>'),
    expect: 'and renders 7 row',
  },
  {
    name: 'the board stops saying a non-answer is never recorded as a result',
    board: 'Running.dc.html',
    plant: () => swap('Running.dc.html', ' A parcel that did not answer is never recorded as a parcel that does not pond.', ''),
    expect: 'does not state that a run which did not answer is never recorded',
  },
  {
    name: 'the screening pair stops adding up against the parcel count in flight',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>112</div>', '>100</div>'),
    expect: 'which do not add up',
  },
  {
    name: 'the list footer disagrees with the stat row on the same screen',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '&middot; 31 model ponding &middot;', '&middot; 29 model ponding &middot;'),
    expect: 'the list footer says "29 model ponding"',
  },
  {
    name: 'two of the three look-alike states collapse into one',
    board: 'Empty.dc.html',
    plant: () => swap('Empty.dc.html', '<div style="margin-top:var(--sc-1); font:400 12px/17px var(--sc-font-data); color:var(--sc-ink-3); border-left:2px solid var(--sc-line); padding-left:var(--sc-3);">Basis: study.honestEmpty carries the reason. Never paraphrased, never replaced with a generic message.</div>', ''),
    expect: 'renders 2 state(s)',
  },
  {
    name: 'the declined state stops naming the field whose reason is rendered verbatim',
    board: 'Empty.dc.html',
    plant: () => swap('Empty.dc.html', 'Basis: study.honestEmpty carries the reason.', 'Basis: the engine carries the reason.'),
    expect: 'does not name study.honestEmpty',
  },
  {
    name: 'the no-ponding state drops the zones and flow paths that are the result',
    board: 'Empty.dc.html',
    plant: () => swap('Empty.dc.html', 'The drainage zones and flow paths are still drawn', 'Nothing else is drawn'),
    expect: 'does not say the drainage zones and flow paths are still drawn',
  },
  {
    name: 'the design stops saying its figures are a fixture',
    board: 'README.md + canvas.json',
    plant: () => {
      swap('README.md', 'No figure on any artboard is measured. Fixture throughout.', 'Figures are rounded for legibility.');
      swap('canvas.json', 'NO FIGURE IS MEASURED. Fixture throughout.', 'Figures are rounded for legibility.');
    },
    expect: 'neither the README nor the canvas says the figures are a fixture',
  },
  {
    name: 'an artboard appears on disk that this instrument does not declare',
    board: 'Print.dc.html',
    plant: () => write('Print.dc.html', '<!doctype html><html><body><x-dc><main></main></x-dc></body></html>'),
    expect: 'an artboard on disk that this instrument does not declare',
  },
  {
    name: 'ABORT the facts file is taken away and no verdict is issued',
    board: 'source-facts.json',
    plant: () => fs.rmSync(path.join(scratch, 'source-facts.json')),
    expect: 'source-facts.json is missing or unparsable',
    abort: true,
  },
  {
    name: 'ABORT the canvas annotations are taken away and the matched-input floor refuses',
    board: 'canvas.json',
    plant: () => {
      const c = JSON.parse(read('canvas.json'));
      c.annotations = [];
      write('canvas.json', JSON.stringify(c, null, 2) + '\n');
    },
    expect: 'annotations',
    abort: true,
  },
];

/* ------------------------------------------------------------------- run */

let failures = 0;
let planted = 0;

/* Direction 1, on the boards as they stand. This is the real defect, not a planted one. */
copyIn();
const asShipped = run();
const shippedLine = 'the engine names it already';
const shippedCaught = asShipped.code === 1 && asShipped.out.includes(shippedLine);
if (!shippedCaught) {
  failures += 1;
  console.error('THE SHIPPED BOARDS WERE NOT CAUGHT. The return-period claim is the defect this lane');
  console.error('found on a real artboard, and the check must fail on it. Got exit ' + asShipped.code + '.');
  console.error(asShipped.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('SELF-TEST') || l.startsWith('REFUSING')).slice(0, 6).join('\n'));
} else {
  console.log('direction 1  the boards as they ship                   exit ' + asShipped.code + '  caught: ' + shippedLine);
  console.log('             ' + (asShipped.out.match(/matched inputs: (.*)/) || [, ''])[1]);
  console.log('             ' + asShipped.out.split('\n').filter((l) => l.startsWith('FAIL')).length + ' finding(s) on the shipped boards');
}
console.log('');

/* Direction 2, the clean baseline: the three stale claim clauses corrected in the scratch
   copy and nothing else touched. Without this, nothing below is attributable to a plant. */
strip();
const base = run();
if (base.code !== 0) {
  console.error('AFTER CORRECTING ONLY THE STALE CLAIM IN A SCRATCH COPY THE BOARDS STILL DO NOT PASS, so');
  console.error('nothing below can be attributed to a planted violation. Got exit ' + base.code + '.');
  console.error(base.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('REFUSING') || l.startsWith('NOTE')).slice(0, 10).join('\n'));
  process.exit(1);
}
console.log('direction 2  the same boards with the stale claim corrected in a scratch copy, nothing else');
console.log('             exit 0  PASS');
console.log('             ' + (base.out.match(/matched inputs: (.*)/) || [, ''])[1]);
console.log('             ' + (base.out.match(/self-tests: (\d+\/\d+)/) || [, '?'])[1] + ' self-tests inside check.mjs');
console.log('');

for (const c of cases) {
  strip();
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
  strip();
  const back = run();
  const restored = back.code === 0;
  if (!restored) failures += 1;
  console.log((c.abort ? 'ABORT        ' : 'PLANTED      ') + c.name);
  console.log('             on ' + c.board + '  exit ' + r.code + '  caught: ' + c.expect);
  if (!restored) console.error('             REMOVING THE VIOLATION DID NOT RESTORE A PASS (exit ' + back.code + ')');
}

strip();
fs.rmSync(scratch, { recursive: true, force: true });

const report = new URL('./instrument-report.json', here);
if (!fs.existsSync(report)) {
  failures += 1;
  console.error('instrument-report.json was not written. Run `node check.mjs` first.');
} else {
  const r = JSON.parse(fs.readFileSync(report, 'utf8'));
  const zero = Object.entries(r.matchedInputs).filter(([, v]) => v === 0);
  console.log('');
  console.log('evidence: instrument-report.json carries ' + Object.keys(r.matchedInputs).length + ' matched-input counters, ' +
    r.notes.length + ' note(s) and ' + r.findings.length + ' finding(s)');
  if (zero.length) {
    failures += 1;
    console.error('instrument-report.json carries a counter at zero: ' + zero.map(([k]) => k).join(', '));
  }
}

console.log('');
if (failures) {
  console.error(failures + ' case(s) wrong. ' + planted + '/' + cases.length + ' planted violations were caught.');
  process.exit(1);
}
console.log(planted + '/' + cases.length + ' planted violations caught, the shipped boards fail on the defect they');
console.log('actually carry, and a copy with that one claim corrected passes with a matched-input count.');
