/**
 * Plants a violation of every rule, one at a time, into a throwaway copy of this
 * folder and asserts that check.mjs CATCHES it — by the rule that was violated.
 *
 *   node violate.mjs
 *
 * A clean run of check.mjs is one observation. This is the other one: for each
 * rule, the exact defect that rule exists for, refused with that rule's id. It
 * also plants the two cases where the instrument must ABORT (exit 2) rather than
 * report a verdict — a moved product premise and a predicate with no inputs —
 * because "refuses to answer" is a behaviour and untested behaviour is a claim.
 *
 * Exit 0 means every planted violation was caught. Exit 1 means at least one was
 * not, which is a hole in the instrument and not a hole in the artboards.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const BOARD_FILES = ['Main.dc.html', 'Distances.dc.html', 'Filled.dc.html'];
const SUPPORT_FILES = ['check.mjs', 'source-state.json', 'canvas.json'];

const readBoards = () => Object.fromEntries(
  BOARD_FILES.filter((f) => fs.existsSync(path.join(here, f)))
    .map((f) => [f, fs.readFileSync(path.join(here, f), 'utf8')]),
);

/** Replace the first match and fail loudly if there was nothing to replace. */
const sub = (files, file, re, to, requireMatch = true) => {
  const before = files[file];
  if (typeof before !== 'string') throw new Error('no board ' + file + ' to mutate');
  const after = before.replace(re, to);
  if (requireMatch && after === before) throw new Error('planting into ' + file + ' matched nothing: ' + re);
  files[file] = after;
};

const FIRST_REGION = /<div data-region="([a-z0-9-]+)" data-state="[^"]*" data-mechanism="[a-z-]+"/;

const CASES = [
  {
    rule: 'R1', name: 'a board whose scope marker is gone, so it can never be read', expect: 1,
    // Added as a COPY rather than by breaking Main, because every real board is
    // the only source of some count: breaking one makes check.mjs refuse for
    // want of inputs (exit 2) before it reports the finding. Both behaviours are
    // correct; this case is here to test the finding.
    mutate: (f) => {
      f['Broken.dc.html'] = f['Main.dc.html'].replace(/<main data-lens-body="citizen"/, '<main');
      if (f['Broken.dc.html'] === f['Main.dc.html']) throw new Error('the R1 plant matched nothing');
    },
  },
  {
    rule: 'R2', name: 'a region prints "None on file" — the word the SHIPPED page uses and nobody defined', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', FIRST_REGION, (m) => m.replace(/data-state="[^"]*"/, 'data-state="None on file"')),
  },
  {
    rule: 'R3', name: 'two regions collapsed onto one distance', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /data-mechanism="no-source"/, 'data-mechanism="no-region"'),
  },
  {
    rule: 'R4', name: 'a state word with its basis deleted', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /<span data-basis[^>]*>[\s\S]*?<\/span>/, ''),
  },
  {
    rule: 'R5', name: 'a measured figure with its counting rule deleted', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', / data-counting-rule="[^"]*"/g, ''),
  },
  {
    rule: 'R6', name: 'a data-tile, which is the twelve-tile grid coming back', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /<\/main>/, '<div data-tile="1"></div></main>'),
  },
  {
    rule: 'R7', name: 'the pinned shipped sentence paraphrased instead of carried', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /Lookup returns nothing today/g, 'Lookup returns nothing yet'),
  },
  {
    rule: 'R8', name: 'the retired product name on the page', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /<\/main>/, '<p>CitizenConnect</p></main>'),
  },
  {
    rule: 'R9', name: 'a fixture board with its DEMO FIXTURE marker removed', expect: 1,
    mutate: (f) => sub(f, 'Filled.dc.html', /<span data-fixture-badge[\s\S]*?<\/span>/, ''),
  },
  {
    rule: 'R10', name: 'a fourth board nobody classified', expect: 1,
    mutate: (f) => { f['Extra.dc.html'] = f['Main.dc.html']; },
  },
  {
    rule: 'R11', name: 'a region-scoped measurement invented on the un-fed lens', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html',
      /<span data-figure data-measured="0" data-scope="region"([^>]*)>Not read<\/span>/,
      '<span data-figure data-measured="1" data-scope="region" data-count="1" data-counting-rule="a rule long enough to pass the length gate"$1>1</span>'),
  },
  {
    rule: 'R12', name: 'the Citizen nav badge drifting from the shipped value', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html',
      /(data-lens="citizen"[\s\S]{0,600}?data-badge[^>]*>)([^<]*)</,
      '$1Not built<'),
  },
  {
    rule: 'R13', name: 'every data-cell deleted, so the name scan has nothing to scan', expect: 1,
    mutate: (f) => sub(f, 'Main.dc.html', /<span data-cell[^>]*>[^<]*<\/span>/g, ''),
  },
  {
    rule: 'premise', name: 'the product moves under the design (a registered citizen domain)', expect: 2,
    mutate: (f) => {
      const S = JSON.parse(fs.readFileSync(path.join(here, 'source-state.json'), 'utf8'));
      S.registry.citizenCount = 1;
      f['source-state.json'] = JSON.stringify(S, null, 2);
    },
  },
  {
    rule: 'snapshot', name: 'the boards and the snapshot naming different product commits', expect: 2,
    mutate: (f) => {
      const S = JSON.parse(fs.readFileSync(path.join(here, 'source-state.json'), 'utf8'));
      S.snapshot.commit = '0000000000000000000000000000000000000000';
      f['source-state.json'] = JSON.stringify(S, null, 2);
    },
  },
  {
    rule: 'vacuity', name: 'a predicate left with no inputs at all (the fixture board deleted)', expect: 2,
    mutate: (f) => { delete f['Filled.dc.html']; },
  },
];

const REFUSAL_MARK = /REFUSING A VERDICT|matched nothing/;

let caught = 0;
const missed = [];

console.log('planting ' + CASES.length + ' violations, one at a time, into throwaway copies\n');

for (const c of CASES) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'citizen-lens-violate-'));
  try {
    const files = readBoards();
    // The mutations edit text, so a case that silently no-ops is impossible to miss.
    for (const s of SUPPORT_FILES) {
      const src = path.join(here, s);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, s));
    }
    c.mutate(files);
    for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body);

    const r = spawnSync(process.execPath, ['check.mjs'], { cwd: dir, encoding: 'utf8' });
    const out = (r.stdout || '') + (r.stderr || '');
    const okExit = r.status === c.expect;
    const okRule = c.expect === 2
      ? REFUSAL_MARK.test(out)
      : new RegExp('FAIL ' + c.rule + ' \\(').test(out);

    if (okExit && okRule) {
      caught += 1;
      console.log('caught  ' + c.rule.padEnd(8) + ' exit ' + r.status + '  ' + c.name);
    } else {
      missed.push({ rule: c.rule, name: c.name, status: r.status, out });
      console.log('MISSED  ' + c.rule.padEnd(8) + ' exit ' + r.status + ' (wanted ' + c.expect + ')  ' + c.name);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

console.log('\n' + caught + ' of ' + CASES.length + ' planted violations caught');

if (missed.length) {
  for (const m of missed) {
    console.error('\n--- ' + m.rule + ': ' + m.name + ' (exit ' + m.status + ') ---');
    console.error(m.out.split('\n').slice(-25).join('\n'));
  }
  console.error('\ncheck.mjs does not catch the defect these rules exist for. The instrument, not the boards, is wrong.');
  process.exit(1);
}
console.log('every rule caught the defect it exists for, including both refusals.');
process.exit(0);
