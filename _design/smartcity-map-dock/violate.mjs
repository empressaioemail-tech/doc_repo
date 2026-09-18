/**
 * The map dock instrument, run rather than described.
 *
 *   node violate.mjs
 *
 * WHY THIS FILE NO LONGER OPENS WITH A REPAIR (G-164, 2026-09-18). Until this lane, the
 * boards did not pass: the tab nav shipped "Licences" where the product's TAB_LABELS ships
 * "Licenses", so the G-150 model's precondition -- a clean baseline -- could not be met, and
 * this file patched that one character out IN A SCRATCH COPY to get one. G-164 repaired the
 * boards themselves, in gen.mjs, so the shipped boards now ARE the clean baseline. The patch
 * is deleted rather than kept: a scratch repair whose anchor no longer exists cannot apply,
 * and one that still applied would make this instrument's baseline a copy of a board the
 * folder no longer ships. No predicate moved and no plant was removed -- the misspelling is
 * still case 1 below, and a board that ships it again still has to be caught.
 *
 * The baseline is therefore the folder as it stands, copied. Both directions are shown on a
 * real artboard: the shipped boards pass with a matched-input count, and every plant fails
 * for its own named reason and passes again when it is taken away.
 *
 * WHAT A PASSING VIOLATION MEANS. Nothing trusts an exit code alone. Every case names the
 * substring the failure must carry, so a check that fails for the wrong reason -- a broken
 * extraction, a crash, a vacuity abort -- does not count as having caught the violation it
 * was aimed at.
 *
 * THE ABORT CASES ARE PART OF THE PROOF. A check that returns exit 2 rather than a verdict
 * when it has no inputs is only verified by taking its inputs away, so two of these cases
 * do exactly that: no source-facts.json, and every nav badge stripped from every board.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'g148-map-dock-violate-'));
const SRC = ['check.mjs', 'source-facts.json', 'Main.dc.html', 'Expand.dc.html', 'Full.dc.html', 'README.md', 'canvas.json'];

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

/** Replace once, and refuse to run if the anchor is not there. A violation planted
    against a board that has since been reworded would otherwise pass vacuously. */
const swap = (file, from, to) => {
  const s = read(file);
  must(s.includes(from), 'anchor not found in ' + file + ': ' + JSON.stringify(from.slice(0, 70)));
  write(file, s.replace(from, to));
};

/** The clean baseline every case plants on: the folder as it ships, copied. Until G-164
    this patched the tab misspelling out of the scratch copy; that repair is gone because the
    boards no longer carry the defect, and the plant below puts it back. */
const strip = () => {
  for (const f of fs.readdirSync(scratch)) fs.rmSync(path.join(scratch, f), { recursive: true, force: true });
  copyIn();
};

/* ----------------------------------------------------------- the cases */

const cases = [
  {
    name: 'the tab nav renders Licences where the product ships Licenses',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Licenses<', '>Licences<'),
    expect: 'renders "Licences", which is not a product tab',
  },
  {
    name: 'the same misspelling at rail width on Expand',
    board: 'Expand.dc.html',
    plant: () => swap('Expand.dc.html', '>Licenses<', '>Licences<'),
    expect: 'renders "Licences", which is not a product tab',
  },
  {
    name: 'a dropped tab is a dropped tab, not a rounding',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Flood study</span>', '>Flood risk</span>'),
    expect: 'drops "Flood study"',
  },
  {
    name: 'the dock grows a Layers button with drifted count',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'Layers <span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-full); padding:0 5px;">4</span>', 'Layers <span style="font:500 12px/16px var(--sc-font-data); color:var(--sc-on-accent); background:var(--sc-accent); border-radius:var(--sc-r-full); padding:0 5px;">5</span>'),
    expect: 'the Layers button says 5 active',
  },
  {
    name: 'the layers panel appears where the rule says it must not',
    board: 'Main.dc.html (panel moved in from Full)',
    plant: () => {
      const full = read('Full.dc.html');
      const at = full.indexOf('>Map layers</span>');
      must(at > -1, 'no layers panel found in Full to move');
      const open = full.lastIndexOf('<aside', at);
      const close = full.indexOf('</aside>', at);
      must(open > -1 && close > -1, 'could not bound the panel aside in Full');
      const panel = full.slice(open, close + '</aside>'.length);
      swap('Main.dc.html', '</main>', panel + '</main>');
    },
    expect: 'carries the layers panel, and the rule is that it exists in FULL ONLY',
  },
  {
    name: 'the panel search total drifts from the catalog',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', 'Search 52 layers', 'Search 51 layers'),
    expect: 'the panel searches 51 layers',
  },
  {
    name: 'the panel header claims more active layers than the product defaults on',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '>4 active</span>', '>5 active</span>'),
    expect: 'the panel says 5 active',
  },
  {
    name: 'a category header counts layers the catalog does not carry',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '>0/14</span>', '>0/13</span>'),
    expect: 'counts 13 layers and the product carries 14',
  },
  {
    name: 'a category header claims active layers its category does not hold',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '>0/4</span>', '>1/4</span>'),
    expect: 'says 1 active and the product defaults 0 of its layers on',
  },
  {
    name: 'a layer the product groups outside the catalog is drawn as a layer',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '>Wastewater lines</span>', '>Permits</span>'),
    expect: 'the panel says "Permits"',
  },
  {
    name: 'a layer row names something the catalog does not hold',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '>Fire stations</span>', '>Fire pump stations</span>'),
    expect: 'renders the layer "Fire pump stations", which is not a layer name in the catalog',
  },
  {
    name: 'buildable area is given a value instead of REFUSED',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', 'color:var(--sc-warn);">Refused</span>', 'color:var(--sc-ink);">0.41 ac</span>'),
    expect: 'is not a REFUSED value carrying ruling R-2',
  },
  {
    name: 'buildable area stays REFUSED but loses its basis',
    board: 'Expand.dc.html',
    plant: () => swap('Expand.dc.html', 'Refused by ruling R-2', 'Refused by policy'),
    expect: 'is not a REFUSED value carrying ruling R-2',
  },
  {
    name: 'the board stops being a picture of the pack the read path allows',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', '620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">Bastrop, TX</span>', '620 15px/22px var(--sc-font-ui); color:var(--sc-ink);">Elgin, TX</span>'),
    expect: 'the top bar names "Elgin, TX"',
  },
  {
    name: 'the permit row carries the free-text description the design forbids',
    board: 'Full.dc.html',
    plant: () => swap('Full.dc.html', 'text-transform:uppercase; color:var(--sc-ink-3);">Status</span>', 'text-transform:uppercase; color:var(--sc-ink-3);">Description</span>'),
    expect: 'carries a "Description" column',
  },
  {
    name: 'a nav row appears that the product does not ship',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>Records search</span>', '>Place</span>'),
    expect: 'carries "Place", which is neither a shipped lens nor a shipped work item',
  },
  {
    name: 'a nav badge appears that is not in the product vocabulary',
    board: 'Main.dc.html',
    plant: () => swap('Main.dc.html', '>LIVE RECORDS</span>', '>LIVE</span>'),
    expect: 'carries the badge "LIVE"',
  },
  {
    name: 'the design stops stating the layer total it asked to be held to',
    board: 'README.md + canvas.json',
    plant: () => {
      const strip52 = (s) => s.replace(/Fifty-two\s+layers/g, 'The layers').replace(/\b52\s+layers/g, 'the layers');
      write('README.md', strip52(read('README.md')));
      write('canvas.json', strip52(read('canvas.json')));
    },
    expect: 'states the layer total',
  },
  {
    name: 'an artboard appears on disk that the instrument does not declare',
    board: 'Print.dc.html',
    plant: () => write('Print.dc.html', '<!doctype html><html><body><x-dc><nav></nav></x-dc></body></html>'),
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
    name: 'ABORT every nav badge is stripped and the badge predicate refuses',
    board: 'all three boards',
    plant: () => {
      for (const f of ['Main.dc.html', 'Expand.dc.html', 'Full.dc.html']) write(f, read(f).replace(/<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.06em;[^"]*">[^<]*<\/span>/g, ''));
    },
    expect: 'navBadges',
    abort: true,
  },
];

/* ------------------------------------------------------------------- run */

let failures = 0;
let planted = 0;

/* Direction 1, on the boards as they stand: the baseline the plants below are attributed to.
   G-164 repaired the misspelling on the boards themselves, so this is a PASS rather than the
   catch it used to be, and this instrument now fails if the defect comes back. */
copyIn();
const asShipped = run();
if (asShipped.code !== 0) {
  failures += 1;
  console.error('THE SHIPPED BOARDS DO NOT PASS. Both directions below are unreadable until they do:');
  console.error('a violation planted on a board that is already failing cannot be attributed to the plant.');
  console.error('Got exit ' + asShipped.code + '.');
  console.error(asShipped.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('SELF-TEST') || l.startsWith('REFUSING')).slice(0, 6).join('\n'));
} else {
  console.log('direction 1  the boards as they ship    exit ' + asShipped.code + '  PASS, clean baseline');
}
console.log('             ' + ((asShipped.out.match(/matched inputs: (.*)/) || [, ''])[1] || '') + '');
console.log('             ' + asShipped.out.split('\n').filter((l) => l.startsWith('FAIL')).length + ' finding(s) on the shipped boards');
console.log('');

/* Direction 2 is the baseline itself, used again by every case. It is kept as its own named
   run so the counts printed above and the ones below come from the same copy. */
strip();
const base = run();
if (base.code !== 0) {
  console.error('THE COPIED BASELINE DOES NOT PASS, so nothing below can be attributed to a planted');
  console.error('violation. Got exit ' + base.code + '.');
  console.error(base.out.split('\n').filter((l) => l.startsWith('FAIL') || l.startsWith('REFUSING') || l.startsWith('NOTE')).slice(0, 10).join('\n'));
  process.exit(1);
}
console.log('direction 2  the same boards copied with nothing changed');
console.log('             exit 0  PASS');
console.log('             ' + (base.out.match(/matched inputs: (.*)/) || [, ''])[1]);
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
console.log(planted + '/' + cases.length + ' planted violations caught on a real artboard, and the shipped');
console.log('boards pass the check until one of them is planted.');
console.log('self-tests inside check.mjs: ' + (base.out.match(/self-tests: (\d+\/\d+)/) || [, '?'])[1]);
