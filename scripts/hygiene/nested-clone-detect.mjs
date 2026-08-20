#!/usr/bin/env node
/**
 * HY-02 nested clone detector for doc_repo.
 *
 * Executor:   this script
 * Trigger:     every push (when wired to CI); manual audit
 * Fails:       non-zero when a nested .git directory or ruled clone path exists
 * Bypasses:    scans only under --root (default doc_repo cwd); product-repo nested worktrees out of scope
 *
 * Usage:
 *   node scripts/hygiene/nested-clone-detect.mjs
 *   node scripts/hygiene/nested-clone-detect.mjs --root /path/to/scratch-copy
 */
import { execSync } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { emitSnapshotBlock, CONTROL_DEFAULTS } from './_lib.mjs';

const argv = process.argv.slice(2);
const rootIdx = argv.indexOf('--root');
const ROOT = rootIdx >= 0 && argv[rootIdx + 1] ? argv[rootIdx + 1] : process.cwd();
const asJson = argv.includes('--json');

/** Ruled nested clones — .gitignore:12-13 and repo_cleanup_backlog item 7/8 */
const RULED_NESTED = ['hauska-mcp-server', 'tmpbrief-l3-spine-consume'];

function readRemoteSync(cloneRoot) {
  try {
    return execSync(`git -C "${cloneRoot}" remote get-url origin`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function findNestedGitDirs(dir, base = dir, hits = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return hits;
  }
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '.git' && dir !== base) {
        hits.push({ path: relative(base, dir), kind: 'nested-dot-git' });
      } else if (ent.name !== '.git' && ent.name !== 'node_modules') {
        findNestedGitDirs(full, base, hits);
      }
    }
  }
  return hits;
}

const ruled = RULED_NESTED.filter((name) => existsSync(join(ROOT, name, '.git'))).map((name) => ({
  path: name,
  kind: 'ruled-full-clone',
  remote: readRemoteSync(join(ROOT, name)),
}));

const nestedDotGit = findNestedGitDirs(ROOT).filter(
  (h) => !RULED_NESTED.some((r) => h.path === r || h.path.startsWith(`${r}/`) || h.path.startsWith(`${r}\\`)),
);

const violations = [...ruled, ...nestedDotGit];

const report = {
  control: 'HY-02-nested-clone-detect',
  ...CONTROL_DEFAULTS,
  gate: {
    executor: 'scripts/hygiene/nested-clone-detect.mjs',
    trigger: 'push when wired; manual audit',
    fails: 'non-zero on nested .git or ruled clone directory',
    bypasses: 'scanning outside --root; nested clones in product repos (out of scope)',
  },
  snapshot: emitSnapshotBlock({ root: ROOT }),
  violations,
  violationCount: violations.length,
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Nested clone detect — root ${ROOT}`);
  console.log(`Snapshot: ${report.snapshot.scannedAt}`);
  if (violations.length === 0) {
    console.log('PASS: no nested clones detected');
  } else {
    console.log(`FAIL: ${violations.length} violation(s)`);
    for (const v of violations) {
      console.log(`  - ${v.path} (${v.kind})${v.remote ? ` remote=${v.remote}` : ''}`);
    }
  }
}

process.exit(violations.length ? 1 : 0);
