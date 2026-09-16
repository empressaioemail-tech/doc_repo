/**
 * Verify by violation. Plant one defect at a time in a REAL artboard, run
 * check.mjs, confirm it fails with the expected reason, then restore the file
 * byte for byte and prove the restoration with a hash.
 *
 * A check observed only passing has not been observed working.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const DIR = 'P:/doc_repo/_design/smartcity-police-lens';
const md5 = (p) => crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');

const BOARDS = ['Main.dc.html', 'Declined.dc.html', 'Patrol.dc.html', 'Bastrop.dc.html'];
const before = Object.fromEntries(BOARDS.map((b) => [b, md5(path.join(DIR, b))]));

const run = () => {
  try {
    execFileSync('node', ['check.mjs'], { cwd: DIR, encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out: '' };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
};

const base = run();
if (base.code !== 0) {
  console.error('the baseline is not clean; violation testing would be meaningless');
  console.error(base.out);
  process.exit(2);
}
console.log('baseline: check.mjs exits 0 on the unmodified artboards\n');

const VIOLATIONS = [
  ['a plate string in a device cell', 'Main.dc.html',
    'Mobile trailer camera 11', '7XYZ123', /PLATE-SHAPED TOKEN/],
  ['a person named in a table cell', 'Main.dc.html',
    'Dome camera 16', 'D. Moore', /table cells name people/],
  ['an uncatalogued vendor kind', 'Main.dc.html',
    'gatedBy verkada &middot; camera-device', 'gatedBy axon &middot; camera-device', /uncatalogued vendor kind/],
  ['an invented state word IN THE NAV, which the body-scoped read missed', 'Main.dc.html',
    'padding:1px 6px; white-space:nowrap;">Demo records</span>',
    'padding:1px 6px; white-space:nowrap;">Syncing</span>', /invented state word/],
  ['an invented state word in the lens body', 'Main.dc.html',
    'white-space:nowrap;">Restricted</span>', 'white-space:nowrap;">Syncing</span>', /invented state word/],
  ['a bare head count where the product carries a band', 'Main.dc.html',
    'data-occupancy="moderate" style', 'data-occupancy="41" style', /not a declared band/],
  ['an invented big figure at a NON-KIT weight (the Parks gap)', 'Main.dc.html',
    'font:400 24px/28px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(--sc-crit);">1<',
    'font:370 24px/28px var(--sc-font-data); font-variant-numeric:tabular-nums; letter-spacing:-.01em; color:var(--sc-crit);">9814<',
    /big figure the composer never produced/],
  ['two rows swapped out of composer order', 'Main.dc.html',
    'FIX-CAM-1007', 'FIX-CAM-1014', /camera ids are/],
  ['an unmarked surveillance term in prose', 'Declined.dc.html',
    'The live camera vendor exposes', 'The watchlist exposes', /SURVEILLANCE TERM outside a declared refusal/],
  ['a plate BESIDE a record id, which the first shape of this rule missed', 'Main.dc.html',
    'Doorway camera 12', 'FIX-CAM-1014 7XYZ123', /PLATE-SHAPED TOKEN/],
  ['a surveillance field name outside its refusal marker', 'Bastrop.dc.html',
    'NOT AN OBSTACLE.', 'NOT AN OBSTACLE. plateReads.', /SURVEILLANCE TERM outside a declared refusal/],
  ['a vendor named in prose that this lens does not gate', 'Bastrop.dc.html',
    'A commercial step at the city', 'A FirstDue step at the city', /vendor named in prose/],
  ['a forbidden matrix cell drawn as a count', 'Declined.dc.html',
    'data-cell="online:light"', 'data-cell="online:occupancy not measured"', /cannot occur by rule is drawn as a count/],
  ['the probe domain id on the canvas', 'Patrol.dc.html',
    'the only surviving meaning of Not built', 'probe-unregistered-surface', /probe domain id reached the canvas/],
  ['British "per cent", which the product money gate refuses', 'Patrol.dc.html',
    'never assumed', '100 per cent assumed', /money token reached this lens/],
  ['a composer sentence paraphrased away', 'Main.dc.html',
    'generated from the Verkada adapter output contract; no city rows were read',
    'generated from the Verkada adapter', /no artboard quotes verbatim/],
  ['the lens body marker removed', 'Patrol.dc.html',
    '<main data-lens-body="police"', '<main data-lens="police"', /no <main data-lens-body/],
];

let caught = 0;
const results = [];
for (const [label, board, find, replace, expect] of VIOLATIONS) {
  const p = path.join(DIR, board);
  const original = fs.readFileSync(p, 'utf8');
  if (!original.includes(find)) {
    console.error('SKIPPED (anchor not present): ' + label + ' -> ' + JSON.stringify(find.slice(0, 50)));
    results.push([label, board, 'ANCHOR MISSING']);
    continue;
  }
  fs.writeFileSync(p, original.replace(find, replace));
  const r = run();
  fs.writeFileSync(p, original);
  const restored = md5(p) === before[board];
  const ok = r.code !== 0 && expect.test(r.out);
  if (ok) caught += 1;
  results.push([label, board, ok ? 'CAUGHT' : 'MISSED (exit ' + r.code + ')', restored ? 'restored' : 'NOT RESTORED']);
  console.log((ok ? 'CAUGHT ' : 'MISSED ') + label + '  [' + board + ']' + (restored ? '' : '  *** NOT RESTORED ***'));
  if (!ok) console.log('    ' + r.out.split('\n').filter((l) => l.trim()).slice(0, 4).join('\n    '));
}

console.log('\n' + caught + ' of ' + VIOLATIONS.length + ' planted defects caught');
const after = Object.fromEntries(BOARDS.map((b) => [b, md5(path.join(DIR, b))]));
const drift = BOARDS.filter((b) => before[b] !== after[b]);
console.log('artboard hashes after restoration: ' + (drift.length ? 'DRIFTED: ' + drift.join(', ') : 'identical to before, all ' + BOARDS.length));
for (const b of BOARDS) console.log('  ' + b + '  ' + after[b]);
const final = run();
console.log('final baseline re-run: exit ' + final.code);
process.exit(caught === VIOLATIONS.length && drift.length === 0 && final.code === 0 ? 0 : 1);
