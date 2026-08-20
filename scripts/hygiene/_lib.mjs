#!/usr/bin/env node
/**
 * Shared helpers for systems-agent hygiene controls (HY-01..HY-03).
 * Snapshot declaration per 90_enforcement_build_order C-02.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function git(repoPath, args, { allowFail = false } = {}) {
  const argv = Array.isArray(args) ? args : [args];
  try {
    return execFileSync('git', ['-C', repoPath, ...argv], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw new Error(`git -C ${repoPath} ${argv.join(' ')}\n${err.stderr?.toString() || err.message}`);
  }
}

export function gitExitCode(repoPath, args) {
  const argv = Array.isArray(args) ? args : [args];
  try {
    execFileSync('git', ['-C', repoPath, ...argv], { stdio: 'pipe' });
    return 0;
  } catch (err) {
    return err.status ?? 1;
  }
}

export function repoSnapshot(repoPath) {
  if (!existsSync(repoPath)) {
    return { path: repoPath, exists: false };
  }
  const head = git(repoPath, ['rev-parse', 'HEAD']);
  const branch = git(repoPath, ['branch', '--show-current'], { allowFail: true }) || '(detached)';
  const subject = git(repoPath, ['log', '-1', '--format=%s']);
  const date = git(repoPath, ['log', '-1', '--format=%cI']);
  return { path: repoPath, exists: true, head, branch, subject, date };
}

export function worktreeBranches(repoPath) {
  if (!existsSync(repoPath)) return new Set();
  const out = git(repoPath, ['worktree', 'list'], { allowFail: true });
  if (!out) return new Set();
  const branches = new Set();
  for (const line of out.split('\n')) {
    const m = line.match(/\[(.+?)\]/);
    if (m) branches.add(m[1]);
  }
  return branches;
}

/** Parsed worktree rows for audit and branch safety. */
export function listWorktrees(repoPath) {
  if (!existsSync(repoPath)) return [];
  const out = git(repoPath, ['worktree', 'list', '--porcelain'], { allowFail: true });
  if (!out) return [];

  const rows = [];
  let current = {};
  for (const line of out.split('\n')) {
    if (line.startsWith('worktree ')) {
      if (current.path) rows.push(current);
      current = { path: line.slice('worktree '.length).trim() };
    } else if (line.startsWith('HEAD ')) {
      current.head = line.slice('HEAD '.length).trim();
    } else if (line.startsWith('branch ')) {
      current.branch = line.slice('branch refs/heads/'.length).trim();
    } else if (line === '') {
      if (current.path) rows.push(current);
      current = {};
    }
  }
  if (current.path) rows.push(current);

  const today = new Date();
  for (const row of rows) {
    const lastCommitIso = git(row.path, ['log', '-1', '--format=%cI'], { allowFail: true });
    row.lastCommitIso = lastCommitIso || null;
    row.lastCommitSubject = git(row.path, ['log', '-1', '--format=%s'], { allowFail: true }) || null;
    if (lastCommitIso) {
      row.daysSinceActivity = Math.floor((today - new Date(lastCommitIso)) / 86400000);
    } else {
      row.daysSinceActivity = null;
    }
    row.stale30d = row.daysSinceActivity !== null && row.daysSinceActivity > 30;
  }
  return rows;
}

function sleepMs(ms) {
  if (ms <= 0) return;
  if (process.platform === 'win32') {
    execFileSync('powershell', ['-Command', `Start-Sleep -Milliseconds ${ms}`], { stdio: 'ignore' });
  } else {
    execFileSync('sleep', [String(Math.ceil(ms / 1000))], { stdio: 'ignore' });
  }
}

/**
 * Resolve comparison base for merge detection. Prefer origin/main after fetch;
 * fall back to local main only when origin is unavailable.
 */
export function resolveMergeBase(repoPath) {
  if (!existsSync(repoPath)) {
    return { base: 'main', source: 'repo-absent', sha: null };
  }
  git(repoPath, ['fetch', 'origin'], { allowFail: true });
  const originSha = git(repoPath, ['rev-parse', '--verify', 'origin/main'], { allowFail: true });
  if (originSha) {
    return { base: 'origin/main', source: 'origin/main', sha: originSha };
  }
  const localSha = git(repoPath, ['rev-parse', '--verify', 'main'], { allowFail: true });
  if (localSha) {
    return { base: 'main', source: 'local-main-fallback', sha: localSha };
  }
  return { base: 'main', source: 'unresolved-fallback', sha: null };
}

export function isAncestryMerged(repoPath, branch, base) {
  return gitExitCode(repoPath, ['merge-base', '--is-ancestor', branch, base]) === 0;
}

/** Squash merges: every commit on branch not in base is cherry-equivalent (-). */
export function isContentMergedViaCherry(repoPath, branch, base) {
  const cherry = git(repoPath, ['cherry', '-v', base, branch], { allowFail: true });
  if (cherry === null) return false;
  const lines = cherry.split('\n').filter(Boolean);
  if (lines.length === 0) return true;
  return lines.every((line) => line.startsWith('-'));
}

export function isContentMergedViaDiff(repoPath, branch, base) {
  const stat = git(repoPath, ['diff', '--shortstat', `${base}...${branch}`], { allowFail: true });
  if (stat === null) return false;
  const trimmed = stat.trim();
  return trimmed === '' || /0 files changed/.test(trimmed);
}

export function branchMergeState(repoPath, branch, base) {
  if (isAncestryMerged(repoPath, branch, base)) {
    return { merged: true, kind: 'ancestry' };
  }
  if (isContentMergedViaCherry(repoPath, branch, base)) {
    return { merged: true, kind: 'content-cherry' };
  }
  if (isContentMergedViaDiff(repoPath, branch, base)) {
    return { merged: true, kind: 'content-empty-diff' };
  }
  return { merged: false, kind: null };
}

/**
 * Local branches whose content is fully represented on the merge base.
 * Uses origin/main (after fetch) rather than local main; detects squash merges
 * via git cherry in addition to ancestry.
 */
export function mergedLocalBranches(repoPath) {
  if (!existsSync(repoPath)) return [];
  const { base, source } = resolveMergeBase(repoPath);
  const out = git(
    repoPath,
    ['for-each-ref', 'refs/heads/', '--format=%(refname:short)\t%(objectname)\t%(committerdate:short)'],
    { allowFail: true },
  );
  if (!out) return [];

  const results = [];
  for (const line of out.split('\n').filter(Boolean)) {
    const [name, sha, date] = line.split('\t');
    if (name === 'main' || name.startsWith('(HEAD detached')) continue;
    const state = branchMergeState(repoPath, name, base);
    if (state.merged) {
      results.push({
        name,
        sha: sha || null,
        date,
        mergeKind: state.kind,
        mergeBase: base,
        mergeBaseSource: source,
      });
    }
  }
  return results;
}

export function emitSnapshotBlock(meta) {
  return {
    scannedAt: new Date().toISOString(),
    scannerRepo: repoSnapshot(join(__dirname, '../..')),
    ...meta,
  };
}

/**
 * Host locality of a worktree path. Structural: filesystem existence plus UNC
 * prefix. A grep over path strings cannot answer this. Off-host worktrees are
 * unmeasured, never stale.
 *
 * this-host: exists and is not UNC.
 * local-missing: registered on this host, directory gone.
 * unc-present / unc-missing: path is not this host.
 */
export function hostClassForPath(p) {
  if (typeof p !== 'string' || p.length === 0) {
    throw new Error('hostClassForPath: path required');
  }
  const n = p.replace(/\\/g, '/');
  const unc = n.startsWith('//');
  const exists = existsSync(p);
  if (unc) return exists ? 'unc-present' : 'unc-missing';
  return exists ? 'this-host' : 'local-missing';
}

export function isThisHost(hostClass) {
  return hostClass === 'this-host';
}

export const CONTROL_DEFAULTS = {
  armed: false,
  note: 'Measurement is the default and needs no adjective. armed is true only when a delete verb can execute.',
};
