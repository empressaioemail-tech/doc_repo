/**
 * The Overview-lens instrument, run rather than described.
 *
 *   node check.mjs && node violate.mjs
 *
 * WHY THIS FILE OPENS WITH A REPAIR. The G-150 model requires the unmodified boards to pass
 * before a violation can be attributed to a planted one. These boards do not pass, and they
 * should not: Main's "Across departments" subhead says "4 of 6 reading" over three lanes that
 * render a fact, and Sparse promotes Connections above the decision queue while its own footer
 * says "1 of 10 sources granted", which is the figure the shipped `placeOverviewConnections`
 * demotes on. So the first direction here is the two shipped boards FAILING for those reasons,
 * and the clean baseline is established the only honest way left: those two clauses are
 * corrected IN THE SCRATCH COPY and the check is required to pass with a matched-input count.
 * Nothing edits a design; the dispatch says report the defect, do not redraw the board.
 *
 * WHAT A PASSING VIOLATION MEANS. Exit codes are not trusted alone. Every case names the
 * substring the failure must carry, so a check that fails for the wrong reason -- a broken
 * extraction, a crash, a vacuity abort -- does not count as having caught the violation it was
 * aimed at. Each case is then removed and the run must return to exit 0, so a case cannot pass
 * by leaving the scratch copy broken.
 *
 * THE ABORT CASES ARE PART OF THE PROOF. A check that exits 2 rather than issuing a verdict is
 * only verified by taking its inputs away, so five cases do exactly that: the facts file itself,
 * three separate facts a rule would otherwise be checked against, and the empty-state container
 * whose removal makes the honest-empty predicate match nothing at all.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'g148-overview-lens-violate-'));
const SRC = ['check.mjs', 'source-facts.json', 'README.md', 'canvas.json', 'Main.dc.html', 'Sparse.dc.html', 'Empty.dc.html'];

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
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 90)));
  write(file, s.replace(from, to));
};
/** The same, replacing every occurrence, for a style that several panels share. */
const swapAll = (file, from, to) => {
  const s = read(file);
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 90)));
  write(file, s.split(from).join(to));
};
/** Regex-anchored edits, for markup whose attribute order is not worth pinning literally. */
const swapRe = (file, re, to) => {
  const s = read(file);
  must(re.test(s), 'pattern found nothing in ' + file + ': ' + re.source.slice(0, 90));
  write(file, s.replace(re, to));
};
/** The same, scoped to one row: the anchor bounds the region and the edit happens inside it. */
const swapIn = (file, anchor, from, to) => {
  const s = read(file);
  const at = s.indexOf(anchor);
  must(at > -1, 'row anchor not found in ' + file + ': ' + JSON.stringify(anchor.slice(0, 70)));
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

/** Where a `<section>` starts and ends, found from a marker inside it. */
const sectionBounds = (s, mark) => {
  const at = s.indexOf(mark);
  must(at > -1, 'section marker not found: ' + mark);
  const start = s.lastIndexOf('<section', at);
  must(start > -1, 'no <section> before ' + mark);
  const end = s.indexOf('</section>', at);
  must(end > at, 'no </section> after ' + mark);
  return [start, end + '</section>'.length];
};
/** Move one section to the top of the content stack, ahead of the region that holds `anchor`. */
const sectionToTop = (file, mark, anchor) => {
  const s = read(file);
  const [a, b] = sectionBounds(s, mark);
  const chunk = s.slice(a, b);
  const rest = s.slice(0, a) + s.slice(b);
  const [c] = sectionBounds(rest, anchor);
  write(file, rest.slice(0, c) + chunk + '\n' + rest.slice(c));
};
/** Move one section to the bottom of the stack, below the region that holds `anchor`. */
const sectionToBottom = (file, mark, anchor) => {
  const s = read(file);
  const [a, b] = sectionBounds(s, mark);
  const chunk = s.slice(a, b);
  const rest = s.slice(0, a) + s.slice(b);
  const [, d] = sectionBounds(rest, anchor);
  write(file, rest.slice(0, d) + '\n' + chunk + rest.slice(d));
};

/** Remove one tile: bounded by its own wrapper and the two closes that end it. */
const removeTile = (file, label) => {
  const s = read(file);
  const at = s.indexOf('>' + label + '</div>');
  must(at > -1, 'tile label not found: ' + label);
  const start = s.lastIndexOf('<div style="border:1px solid var(--sc-line)', at);
  must(start > -1, 'no tile wrapper before ' + label);
  const spanEnd = s.indexOf('</span>', at);
  must(spanEnd > at, 'no destination span after ' + label);
  const destClose = s.indexOf('</div>', spanEnd);
  const wrapperClose = s.indexOf('</div>', destClose + 6);
  must(wrapperClose > destClose, 'the tile wrapper close was not found after ' + label);
  write(file, s.slice(0, start) + s.slice(wrapperClose + 6));
};

/* The two clauses that carry the shipped defects, corrected in the scratch copy. Each anchor is
   required to be present, so this cannot silently become a repair of a board already fixed. */
const repair = () => {
  copyIn();
  swap('Main.dc.html', '4 of 6 reading', '3 of 6 reading');
  sectionToBottom('Sparse.dc.html', '>Connections</div>', '>Public meetings</div>');
};
const strip = () => {
  for (const f of fs.readdirSync(scratch)) fs.rmSync(path.join(scratch, f), { recursive: true, force: true });
  repair();
};

/* ----------------------------------------------------------- the cases */

const cases = [
  {
    name: 'a nav row names a lens the product does not export',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Parks</span>', '>Zoning</span>'),
    expect: 'not a lens "Zoning"',
  },
  {
    name: 'the roster loses a lens the product exports',
    board: 'Main.dc.html',
    plant: () => swapRe('Main.dc.html', /<div style="display:flex; align-items:center; gap:var\(--sc-2\); min-height:28px;[^"]*">\s*<span style="flex:1;[^"]*">Parks<\/span>[\s\S]*?<\/div>/, ''),
    expect: 'missing "Parks"',
  },
  {
    name: 'a badge outside the ruling\'s five-word vocabulary',
    board: 'Main.dc.html',
    plant: () => swapIn('Main.dc.html', '>Finance</span>', '>EMPTY</span>', '>STALE</span>'),
    expect: 'not one of the five the ruling names',
  },
  {
    name: 'NOT BUILT lands on a surface whose page does exist',
    board: 'Main.dc.html',
    plant: () => swapIn('Main.dc.html', '>Finance</span>', '>EMPTY</span>', '>NOT BUILT</span>'),
    expect: 'and the surfaces whose page does not exist are',
  },
  {
    name: 'a work item the shell does not have',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Assets</span>', '>Asset register</span>'),
    expect: 'not a work item "Asset register"',
  },
  {
    name: 'a nav row states no disposition at all',
    board: 'Main.dc.html',
    plant: () => swapIn('Main.dc.html', '>Finance</span>', '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.06em; color:var(--sc-ink-3); background:var(--sc-quiet-wash); border-radius:var(--sc-r-control); padding:1px 5px;">EMPTY</span>', ''),
    expect: 'carries no badge',
  },
  {
    name: 'a tile renders a zero',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'color:var(--sc-ink);">6</div>', 'color:var(--sc-ink);">0</div>'),
    expect: 'renders 0',
  },
  {
    name: 'a tile names nowhere to go',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Decision queue</span>', '></span>'),
    expect: 'names nowhere to go',
  },
  {
    name: 'a tile shows a number and points at an absence',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Development services · Active</span>', '>No permit source</span>'),
    expect: 'points at an absence',
  },
  {
    name: 'a tile shows a number with no arrow to it',
    board: 'Main.dc.html',
    plant: () => swapRe('Main.dc.html', /(>Decision queue<\/span>)<svg[\s\S]*?<\/svg>/, '$1'),
    expect: 'renders no arrow',
  },
  {
    name: 'the region renders three tiles instead of four',
    board: 'Main.dc.html',
    plant: () => removeTile('Main.dc.html', 'Meetings this week'),
    expect: 'renders 3 tile(s)',
  },
  {
    name: 'the lane roll-up counts a lane that is not reading',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '3 of 6 reading', '6 of 6 reading'),
    expect: 'states "6 of 6 reading"',
  },
  {
    name: 'a lane claims a zero the city has not made',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>336</span>', '>0</span>'),
    expect: 'renders assets as 0',
  },
  {
    name: 'a quiet lane loses its basis line',
    board: 'Main.dc.html',
    plant: () => swapRe('Main.dc.html', /<div style="font:400 12px\/16px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-left:2px solid var\(--sc-line\); padding-left:var\(--sc-3\);">opengov granted, no records read<\/div>/, ''),
    expect: 'renders no basis line',
  },
  {
    name: 'a quiet lane basis stops saying what is missing',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'opengov granted, no records read', 'quiet this week'),
    expect: 'does not say what is missing',
  },
  {
    name: 'a lane draws a number under a basis that says nothing was read',
    board: 'Sparse.dc.html',
    plant: () => swap('Sparse.dc.html', 'mygov · permits granted, work orders not granted', 'no source connected'),
    expect: 'claiming a number nothing has read',
  },
  {
    name: 'a lane the ruling names is not rendered',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Public works</div>', '>Utilities</div>'),
    expect: 'not a lane "Utilities"',
  },
  {
    name: 'Connections is promoted on a pack that is granted a source',
    board: 'Main.dc.html',
    plant: () => sectionToTop('Main.dc.html', '>Connections</div>', '>What needs you today</div>'),
    expect: 'still promotes Connections above the decision queue',
  },
  {
    name: 'Connections is promoted on the granted pack as it ships',
    board: 'Sparse.dc.html',
    plant: () => sectionToTop('Sparse.dc.html', '>Connections</div>', '>What needs you today</div>'),
    expect: 'is granted 1 of 10 sources and still promotes Connections',
  },
  {
    name: 'Connections is demoted on a pack that is granted nothing',
    board: 'Empty.dc.html',
    plant: () => sectionToBottom('Empty.dc.html', '>Connections</div>', '>Public meetings</div>'),
    expect: 'is granted nothing and yet demotes Connections',
  },
  {
    name: 'a board stops stating how many sources are granted',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '7 of 10 sources granted', 'sources granted'),
    expect: 'states no granted-source count',
  },
  {
    name: 'the Sources panel comes back',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>On the map</div>', '>Sources</div>'),
    expect: 'renders a "Sources" panel',
  },
  {
    name: 'the map region is dropped from the rail',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '--sc-map-ground', '--sc-map-area'),
    expect: 'has no map region',
  },
  {
    name: 'the address lookup is dropped from the rail',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'Street address', 'Parcel lookup'),
    expect: 'has no address lookup',
  },
  {
    name: 'engine vocabulary leaks back onto a city-manager surface',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'samsara · read live for this request', 'setback-rule · read live for this request'),
    expect: 'prints the atom type "setback-rule"',
  },
  {
    name: 'an empty state loses the basis line under it',
    board: 'Empty.dc.html',
    plant: () => swapRe('Empty.dc.html', /<div style="font:400 12px\/17px var\(--sc-font-data\); color:var\(--sc-ink-3\); border-left:2px solid var\(--sc-line\); padding-left:var\(--sc-3\);">Basis: no operations grant on this pack\.<\/div>/, ''),
    expect: 'renders no basis line',
  },
  {
    name: 'an empty state loses its headline',
    board: 'Empty.dc.html',
    plant: () => swapRe('Empty.dc.html', /<h2 style="font:620 15px\/22px var\(--sc-font-ui\); letter-spacing:-\.008em; margin:0; color:var\(--sc-ink\);">No located records on this pack\.<\/h2>/, ''),
    expect: 'renders no headline',
  },
  {
    name: 'a meeting row loses the Agenda link it is supposed to carry',
    board: 'Main.dc.html',
    plant: () => swapRe('Main.dc.html', />Agenda<\/span>/, '>Open</span>'),
    expect: 'Agenda link(s), and every meeting row carries one',
  },
  {
    name: 'the meetings panel stops naming the calendar it read',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'City clerk calendar · read', 'Calendar'),
    expect: 'without naming the calendar',
  },
  {
    name: 'the not-read form is replaced by nothing on a quiet pack',
    board: 'Empty.dc.html',
    plant: () => swap('Empty.dc.html', 'No meeting packet has been read.', 'Meetings appear here.'),
    expect: 'renders neither meeting rows nor the not-read form',
  },
  {
    name: 'the nav footer and the Connections chip disagree on grants',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '7 of 10 sources granted', '6 of 10 sources granted'),
    expect: 'the Connections chip says 7 of 10',
  },
  {
    name: 'the located count falls under its own list',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '9 located this week', '2 located this week'),
    expect: 'count is under its own list',
  },
  {
    name: 'an artboard appears on disk that this instrument does not declare',
    board: 'Print.dc.html',
    plant: () => write('Print.dc.html', '<!doctype html><html><body><x-dc><main></main></x-dc></body></html>'),
    expect: 'an artboard on disk that this instrument does not declare',
  },
  {
    name: 'a declared artboard is missing from disk',
    board: 'Sparse.dc.html',
    plant: () => fs.rmSync(path.join(scratch, 'Sparse.dc.html')),
    expect: 'declared as an artboard and does not exist',
  },
  {
    name: 'the design record stops saying the map is pinned rather than designed here',
    board: 'README.md',
    plant: () => swapAll('README.md', 'G-121', 'G-999'),
    expect: 'is pinned rather than designed here',
  },
  {
    name: 'the canvas carries no annotation at all',
    board: 'canvas.json',
    plant: () => {
      const c = JSON.parse(read('canvas.json'));
      c.annotations = [];
      write('canvas.json', JSON.stringify(c, null, 2) + '\n');
    },
    expect: 'carries no annotation',
  },
  {
    name: 'ABORT the facts file is taken away and no verdict is issued',
    board: 'source-facts.json',
    plant: () => fs.rmSync(path.join(scratch, 'source-facts.json')),
    expect: 'source-facts.json is missing or unparsable',
    abort: true,
  },
  {
    name: 'ABORT the facts file loses the product label sets and the run refuses',
    board: 'source-facts.json',
    plant: () => patchFacts((s) => { s.labels.lenses = []; }),
    expect: 'does not carry the product\'s nine lens labels',
    abort: true,
  },
  {
    name: 'ABORT the facts file loses the figure Connections is keyed on',
    board: 'source-facts.json',
    plant: () => patchFacts((s) => { delete s.rules.connectionsDemoteAt; }),
    expect: 'does not carry the figure the shipped placement function keys the Connections move on',
    abort: true,
  },
  {
    name: 'ABORT the facts file loses the three NOT BUILT rows read off the nav markup',
    board: 'source-facts.json',
    plant: () => patchFacts((s) => { delete s.unbuilt; }),
    expect: 'three roster rows the product\'s nav markup badges',
    abort: true,
  },
  {
    name: 'ABORT the honest-empty predicate matches nothing at all and the run refuses rather than passing',
    board: 'Sparse.dc.html + Empty.dc.html',
    plant: () => {
      for (const f of ['Sparse.dc.html', 'Empty.dc.html']) {
        swapAll(f, '<div style="display:flex; flex-direction:column; align-items:flex-start; gap:var(--sc-3);', '<div style="display:flex; flex-direction:column; gap:var(--sc-3);');
      }
    },
    expect: 'REFUSING A VERDICT',
    abort: true,
  },
];

/* ------------------------------------------------------------------- run */

let failures = 0;
let planted = 0;

/* Direction 1, on the boards as they stand. These are the real defects, not planted ones. */
copyIn();
const asShipped = run();
const shippedLines = ['states "4 of 6 reading"', 'is granted 1 of 10 sources and still promotes Connections'];
const missing = shippedLines.filter((l) => !asShipped.out.includes(l));
if (asShipped.code !== 1 || missing.length) {
  failures += 1;
  console.error('THE SHIPPED BOARDS WERE NOT CAUGHT. The lane roll-up and the promoted Connections are the');
  console.error('two defects this lane found on real artboards, and the check must fail on both. Got exit ' + asShipped.code + '.');
  if (missing.length) console.error('missing: ' + missing.join(' | '));
  console.error(asShipped.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('SELF-TEST') || l.startsWith('REFUSING')).slice(0, 6).join('\n'));
} else {
  console.log('direction 1  the boards as they ship                   exit ' + asShipped.code + '  caught: both defects');
  console.log('             ' + (asShipped.out.match(/matched inputs: (.*)/) || [, ''])[1]);
  console.log('             ' + asShipped.out.split('\n').filter((l) => l.startsWith('FAIL')).length + ' finding(s) on the shipped boards');
}
console.log('');

/* Direction 2, the clean baseline: the two clauses corrected in the scratch copy and nothing
   else touched. Without this, nothing below is attributable to a plant. */
strip();
const base = run();
if (base.code !== 0) {
  console.error('AFTER CORRECTING ONLY THE TWO SHIPPED CLAUSES IN A SCRATCH COPY THE BOARDS STILL DO NOT PASS, so');
  console.error('nothing below can be attributed to a planted violation. Got exit ' + base.code + '.');
  console.error(base.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('REFUSING') || l.startsWith('NOTE')).slice(0, 10).join('\n'));
  process.exit(1);
}
console.log('direction 2  the same boards with the two shipped clauses corrected in a scratch copy, nothing else');
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
console.log(planted + '/' + cases.length + ' planted violations caught, the shipped boards fail on the two defects');
console.log('they actually carry, and a copy with those two clauses corrected passes with a matched-input count.');
