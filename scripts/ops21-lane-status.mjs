#!/usr/bin/env node
/**
 * ops21-lane-status.mjs — live status of the seven OPS-21 lanes.
 *
 * Read-only. Reports, per lane: whether a worktree exists, whether that worktree is
 * REGISTERED in _catalog/seat_register.json (an unregistered path is refused by
 * seat-worktree-gate at commit time, so this is the single most common stall), the branch,
 * commits ahead of origin/main, and whether checkpoint/close artifacts have landed.
 *
 * It reports UNKNOWN rather than a guess wherever it cannot determine something. A lane
 * with no worktree is not "not started" — it is unmeasured from here.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const LANES = [
  { lane: 'S1', row: 'P-132', repo: 'hauska-factory', match: /ops21-s1|setback-cell/i, what: 'setback cell writer' },
  { lane: 'S3', row: 'P-134', repo: 'hauska-engine', match: /ops21-s3|non-vacuity/i, what: 'non-vacuity guard' },
  { lane: 'D5', row: 'P-136', repo: 'hauska-factory', match: /ops21-d5|gate.?denominator|gate65/i, what: 'gate 17 -> 65' },
  { lane: 'D1', row: 'P-137', repo: 'hauska-factory', match: /ops21-d1|derivable/i, what: 'six derivable rails' },
  { lane: 'D6', row: 'P-141', repo: 'hauska-factory', match: /ops21-d6|available-on-request|on-request/i, what: 'sixth cell state' },
  { lane: 'L1', row: 'P-142', repo: 'legacy-design-tools', match: /ops21-l1|retirement-audit/i, what: 'retirement audit' },
  { lane: 'H1', row: 'P-145', repo: 'hauska-factory', match: /ops21-h1|hays-identity/i, what: 'Hays identity' },
];

const REPO_PATH = {
  'hauska-factory': 'P:/hauska-factory',
  'hauska-engine': 'P:/hauska-engine',
  'legacy-design-tools': 'P:/legacy-design-tools',
};

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function worktreesFor(repo) {
  const out = git(REPO_PATH[repo], ['worktree', 'list', '--porcelain']);
  if (out === null) return null; // UNKNOWN, not empty
  const entries = [];
  let cur = {};
  for (const line of out.split('\n')) {
    if (line.startsWith('worktree ')) {
      if (cur.path) entries.push(cur);
      cur = { path: line.slice(9).replace(/\\/g, '/') };
    } else if (line.startsWith('branch ')) cur.branch = line.slice(7).replace('refs/heads/', '');
    else if (line.startsWith('HEAD ')) cur.head = line.slice(5, 12);
  }
  if (cur.path) entries.push(cur);
  return entries;
}

const registeredPaths = (() => {
  try {
    const j = JSON.parse(readFileSync(join(ROOT, '_catalog/seat_register.json'), 'utf8'));
    const s = new Set();
    for (const seat of j.seats || []) for (const r of seat.repos || []) if (r.worktree) s.add(r.worktree.replace(/\\/g, '/'));
    return s;
  } catch {
    return null;
  }
})();

const inboxFiles = (() => {
  try {
    return readdirSync(join(ROOT, '_inbox'));
  } catch {
    return null;
  }
})();

const artifactFor = (lane) => {
  if (inboxFiles === null) return 'UNKNOWN';
  const l = lane.toLowerCase();
  const hit = (suffix) => inboxFiles.some((f) => f.toLowerCase().includes(`ops21-${l}_${suffix}`));
  const marks = [hit('cp1') ? 'cp1' : null, hit('cp2') ? 'cp2' : null, hit('close') ? 'CLOSE' : null].filter(Boolean);
  return marks.length ? marks.join('+') : '-';
};

const cache = {};
console.log(`\nOPS-21 LANE STATUS   ${new Date().toISOString()}`);
console.log('lane row    repo                 worktree                                       reg  br  ahead artifacts');

for (const L of LANES) {
  cache[L.repo] ??= worktreesFor(L.repo);
  const wts = cache[L.repo];
  let wtCol = 'UNKNOWN (repo unreadable)';
  let reg = '?';
  let ahead = '?';
  let br = '?';

  if (wts !== null) {
    const hits = wts.filter((w) => L.match.test(w.path) || (w.branch && L.match.test(w.branch)));
    if (hits.length === 0) {
      wtCol = 'NONE YET';
      reg = '-';
      ahead = '-';
      br = '-';
    } else {
      const w = hits[0];
      wtCol = w.path.length > 45 ? '…' + w.path.slice(-44) : w.path;
      reg = registeredPaths === null ? '?' : registeredPaths.has(w.path) ? 'yes' : 'NO';
      br = w.branch ? 'y' : 'det';
      const cnt = git(w.path, ['rev-list', '--count', 'origin/main..HEAD']);
      ahead = cnt === null ? '?' : cnt;
      if (hits.length > 1) wtCol += ` (+${hits.length - 1})`;
    }
  }
  console.log(
    `${L.lane.padEnd(4)} ${L.row.padEnd(6)} ${L.repo.padEnd(20)} ${wtCol.padEnd(46)} ${reg.padEnd(4)} ${br.padEnd(3)} ${String(ahead).padStart(5)} ${artifactFor(L.lane)}`
  );
}

console.log(
  '\nreg=NO means seat-worktree-gate will REFUSE that lane\'s commit. That is the most common stall.\n' +
    'ahead counts commits on origin/main..HEAD. artifacts are _inbox checkpoint/close files.\n' +
    'NONE YET is not "not started" — the lane may be reading, or working somewhere this cannot see.\n'
);
