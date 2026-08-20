#!/usr/bin/env node
/**
 * Print porcelain for the integration checkout named in seat_register.json.
 *
 * Seat worktrees do not carry integration untracked files. This is how a seat
 * sees that estate without working in P:/doc_repo.
 *
 * What executes: this script.
 * What triggers: a seat asking what is uncommitted on integration; close/audit.
 * What fails: non-zero if git status itself fails. A clean tree exits 0 with count 0.
 * What bypasses: running git status in a seat worktree and treating that as the estate.
 */
import { execFileSync } from 'node:child_process';
import { loadSeatRegister, normalizePath } from '../enforcement/seat-register.mjs';

const register = loadSeatRegister();
const integration = register.integration?.worktree;
if (!integration) {
  process.stderr.write('untracked-estate: register has no integration.worktree\n');
  process.exit(2);
}
const cwd = normalizePath(integration);
let porcelain;
try {
  porcelain = execFileSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf8' });
} catch (e) {
  process.stderr.write(`untracked-estate: git status failed in ${cwd}: ${e.message}\n`);
  process.exit(2);
}
const lines = porcelain.split(/\r?\n/).filter(Boolean);
const staged = lines.filter((l) => l[0] !== ' ' && l[0] !== '?').length;
const unstaged = lines.filter((l) => l[1] && l[1] !== ' ' && l[0] !== '?').length;
const untracked = lines.filter((l) => l.startsWith('??')).length;
const out = {
  control: 'untracked-estate',
  integration: cwd,
  instrument: 'git status --porcelain',
  note: 'Default porcelain collapses untracked directories. Pass --uall for expanded files.',
  counts: { porcelain: lines.length, staged, unstaged, untracked },
  lines,
};
if (!process.argv.includes('--full')) {
  delete out.lines;
  out.note = (out.note || '') + ' Paths omitted; pass --full to include porcelain lines.';
}
if (process.argv.includes('--uall')) {
  const expanded = execFileSync('git', ['status', '--porcelain', '-uall'], { cwd, encoding: 'utf8' });
  const el = expanded.split(/\r?\n/).filter(Boolean);
  out.instrumentUall = 'git status --porcelain -uall';
  out.counts.porcelainUall = el.length;
  out.counts.untrackedUall = el.filter((l) => l.startsWith('??')).length;
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
