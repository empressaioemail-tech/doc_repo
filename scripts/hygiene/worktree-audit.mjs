#!/usr/bin/env node
/**
 * HY-04 worktree audit — which worktrees exist, last activity, stale >30d.
 * Prerequisite intelligence for releasing dead worktrees (converts declared
 * prune-safe branches into HY-01-eligible).
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitSnapshotBlock, repoSnapshot, listWorktrees, mergedLocalBranches, hostClassForPath, isThisHost } from './_lib.mjs';
import { loadBranchDeclarations, declarationStatus } from './branch-safety.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const staleDays = Number(argv.find((a, i) => argv[i - 1] === '--stale-days') ?? 30);

const repoArgs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--repo' && argv[i + 1]) repoArgs.push(argv[++i]);
}

const DEFAULT_REPOS = [
  'P:/legacy-design-tools',
  'P:/hauska-engine',
  'P:/hauska-map',
  'P:/Empressa Trading',
  'P:/smart-markets',
  'P:/smartcity-dashboards',
  'P:/smart-files',
  'P:/doc_repo',
];

const repos = repoArgs.length ? repoArgs : DEFAULT_REPOS;
const declarations = loadBranchDeclarations();

const report = {
  control: 'HY-04-worktree-audit',
  staleThresholdDays: staleDays,
  snapshot: emitSnapshotBlock({ repos }),
  fleet: {
    worktreeCount: 0,
    staleCount: 0,
    unmeasuredCount: 0,
    onMergedBranchCount: 0,
    declaredPruneSafeBlockedCount: 0,
    hostClass: {
      'this-host': 0,
      'local-missing': 0,
      'unc-present': 0,
      'unc-missing': 0,
    },
    coverage:
      'git worktree list on this host for the scanned checkouts. Off-host worktrees are not in the count. They are unmeasured, not stale, not absent. Unmeasured protects.',
  },
  repos: [],
};

for (const repoPath of repos) {
  if (!existsSync(repoPath)) {
    report.repos.push({ path: repoPath, exists: false });
    continue;
  }

  const snap = repoSnapshot(repoPath);
  const worktrees = listWorktrees(repoPath);
  const mergedNames = new Set(mergedLocalBranches(repoPath).map((b) => b.name));

  const rows = worktrees.map((wt) => {
    const branch = wt.branch ?? '(detached)';
    const decl = branch !== '(detached)' ? declarationStatus(declarations, repoPath, branch) : null;
    const onMergedBranch = branch !== '(detached)' && mergedNames.has(branch);
    const hostClass = hostClassForPath(wt.path);
    const unmeasured = !isThisHost(hostClass);
    const stale =
      !unmeasured && wt.daysSinceActivity !== null && wt.daysSinceActivity > staleDays;
    const pruneSafeBlocked = decl === 'prune-safe' && onMergedBranch;

    return {
      branch,
      path: wt.path,
      head: wt.head,
      lastCommitIso: wt.lastCommitIso,
      lastCommitSubject: wt.lastCommitSubject,
      daysSinceActivity: wt.daysSinceActivity,
      hostClass,
      unmeasured,
      stale,
      onMergedBranch,
      declarationStatus: decl,
      pruneSafeBlocked,
    };
  });

  const staleRows = rows.filter((r) => r.stale);
  const pruneSafeBlocked = rows.filter((r) => r.pruneSafeBlocked);

  report.fleet.worktreeCount += rows.length;
  report.fleet.staleCount += staleRows.length;
  report.fleet.unmeasuredCount += rows.filter((r) => r.unmeasured).length;
  report.fleet.onMergedBranchCount += rows.filter((r) => r.onMergedBranch).length;
  report.fleet.declaredPruneSafeBlockedCount += pruneSafeBlocked.length;
  for (const r of rows) {
    report.fleet.hostClass[r.hostClass] += 1;
  }

  report.repos.push({
    path: repoPath,
    exists: true,
    snapshot: snap,
    worktreeCount: rows.length,
    staleCount: staleRows.length,
    pruneSafeBlockedCount: pruneSafeBlocked.length,
    worktrees: rows,
  });
}

const outPath = join(__dirname, '../../_inbox/2026-08-20_systems_worktree_audit.json');

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`HY-04 worktree audit — ${report.snapshot.scannedAt} (stale >${staleDays}d)`);
  console.log(
    `Fleet: ${report.fleet.worktreeCount} worktrees, ${report.fleet.staleCount} stale, ` +
      `${report.fleet.unmeasuredCount} unmeasured, ` +
      `${report.fleet.declaredPruneSafeBlockedCount} declared prune-safe on merged branches`,
  );
  for (const r of report.repos) {
    if (!r.exists) continue;
    console.log(`  ${r.path}: ${r.worktreeCount} wt, ${r.staleCount} stale, ${r.pruneSafeBlockedCount} prune-safe blocked`);
  }
}

writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
if (!asJson) console.log(`\nWrote ${outPath}`);

process.exit(0);
