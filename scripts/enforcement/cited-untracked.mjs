#!/usr/bin/env node
/**
 * Cited-and-untracked gate.
 *
 * A tracked file that names a repo-relative path which exists on disk and is
 * not in git is the defect: a clone is missing what canon claims.
 *
 * What executes: this script.
 * What triggers: systems close, topology finish, or an explicit run. Not yet
 * a native git hook (core.hooksPath unset). Cursor/Claude can invoke it.
 * What fails: exit 2 listing each (citer, target).
 * What bypasses: citations that are not backtick or markdown-link paths;
 * URLs; paths under _scratch/; P:/tmp; node_modules; allowlist below.
 *
 * Prove by violation: a tracked file citing an untracked path must fail.
 * Pass --self-test to write and remove a fixture.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const ALLOW_PREFIX = [
  '_scratch/',
  'node_modules/',
  'P:/tmp/',
  'P:\\tmp\\',
  'http://',
  'https://',
  'mailto:',
];

function gitLsFiles() {
  const raw = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
  return new Set(raw.split(/\r?\n/).filter(Boolean).map((p) => p.replace(/\\/g, '/')));
}

function trackedTextFiles(tracked) {
  return [...tracked].filter((p) => /\.(md|json|mdc|txt)$/i.test(p));
}

function looksLikeRepoPath(s) {
  if (!s || s.length < 3 || s.length > 240) return false;
  if (s.includes('://')) return false;
  if (s.startsWith('#')) return false;
  if (ALLOW_PREFIX.some((a) => s.startsWith(a) || s.replace(/\\/g, '/').startsWith(a.replace(/\\/g, '/')))) {
    return false;
  }
  if (!/^[A-Za-z0-9_./\\-]+$/.test(s)) return false;
  if (!s.includes('/') && !s.includes('\\') && !/\.(md|json|mjs|js|ps1|mdc)$/i.test(s)) return false;
  return true;
}

function extractCandidates(text) {
  const out = new Set();
  const tick = /`([^`\n]{3,240})`/g;
  let m;
  while ((m = tick.exec(text))) out.add(m[1].trim());
  const link = /\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = link.exec(text))) {
    const t = m[1].trim().split(/\s+/)[0];
    if (t && !t.startsWith('http')) out.add(t);
  }
  return [...out];
}

function resolveCandidate(raw) {
  let s = raw.replace(/\\/g, '/').replace(/^\.\//, '');
  if (s.includes('..')) return null;
  if (s.startsWith('/')) return null;
  if (/^[A-Za-z]:\//.test(s)) {
    const root = ROOT.replace(/\\/g, '/');
    if (s.toLowerCase().startsWith(root.toLowerCase() + '/')) {
      s = s.slice(root.length + 1);
    } else {
      return null;
    }
  }
  return s;
}

function isInGit(rel, tracked, root) {
  const n = rel.replace(/\\/g, '/').replace(/\/+$/, '');
  if (tracked.has(n) || tracked.has(rel)) return true;
  const abs = join(root, n);
  try {
    if (statSync(abs).isDirectory()) {
      const prefix = n + '/';
      for (const f of tracked) {
        if (f === n || f.startsWith(prefix)) return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export function scan(root = ROOT) {
  const tracked = gitLsFiles();
  const hits = [];
  for (const file of trackedTextFiles(tracked)) {
    const abs = join(root, file);
    if (!existsSync(abs)) continue;
    let text;
    try {
      text = readFileSync(abs, 'utf8');
    } catch {
      continue;
    }
    for (const raw of extractCandidates(text)) {
      if (!looksLikeRepoPath(raw)) continue;
      const rel = resolveCandidate(raw);
      if (!rel) continue;
      const onDisk = existsSync(join(root, rel));
      if (!onDisk) continue;
      if (isInGit(rel, tracked, root)) continue;
      hits.push({ citer: file, target: rel.replace(/\\/g, '/') });
    }
  }
  return hits;
}

function selfTest() {
  const fixtureCiterRel = '_inbox/_cited_untracked_selftest_citer.md';
  const fixtureTargetRel = '_inbox/_cited_untracked_selftest_target.txt';
  const fixtureCiter = join(ROOT, fixtureCiterRel);
  const fixtureTarget = join(ROOT, fixtureTargetRel);
  mkdirSync(join(ROOT, '_inbox'), { recursive: true });
  writeFileSync(fixtureTarget, 'untracked target\n', 'utf8');
  writeFileSync(fixtureCiter, 'See `_inbox/_cited_untracked_selftest_target.txt`.\n', 'utf8');
  execFileSync('git', ['add', '--', fixtureCiterRel], { cwd: ROOT });
  try {
    const hits = scan();
    const found = hits.some((h) => h.target.replace(/\\/g, '/') === fixtureTargetRel);
    if (!found) {
      process.stderr.write('cited-untracked self-test: fixture citation was not detected. The scanner would miss this class.\n');
      process.stderr.write(JSON.stringify(hits.slice(0, 20), null, 2) + '\n');
      process.exit(2);
    }
    process.stdout.write(JSON.stringify({ control: 'cited-untracked', selfTest: 'fail-on-fixture', ok: true }) + '\n');
  } finally {
    try {
      execFileSync('git', ['reset', 'HEAD', '--', fixtureCiterRel], { cwd: ROOT, stdio: 'pipe' });
    } catch { /* ignore */ }
    try { unlinkSync(fixtureCiter); } catch { /* ignore */ }
    try { unlinkSync(fixtureTarget); } catch { /* ignore */ }
  }
}

function main() {
  if (process.argv.includes('--self-test')) {
    selfTest();
    return;
  }
  const hits = scan();
  const out = { control: 'cited-untracked', snapshot: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(), hits };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  if (hits.length) {
    process.stderr.write(`cited-untracked: ${hits.length} tracked citation(s) of untracked paths\n`);
    process.exit(2);
  }
}

const isMain = process.argv[1] && /cited-untracked\.mjs$/i.test(process.argv[1].replace(/\\/g, '/'));
if (isMain) main();
