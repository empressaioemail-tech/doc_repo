#!/usr/bin/env node
/**
 * Multi-signal branch safety — Correction 3.
 * A branch is delete-eligible only when independent signals AGREE it is dead.
 *
 * Declaration semantics (2026-08-19):
 *   live     — protects from delete
 *   unknown  — protects from delete (first-class, not absence)
 *   undeclared — protects from delete (fail closed)
 *   prune-safe — explicit release; delete-eligible when merge/worktree/PR signals agree
 *
 * Schema v3: named declarations[] rows win. bulkRules[] apply only when no named
 * row exists. A bulk rule is an operator assertion, not a scanner inference.
 * Missing match context (no tip date when tipBefore is required) does not match.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergedLocalBranches, worktreeBranches } from './_lib.mjs';
import { openPrHeads } from './gh-pr-check.mjs';
import { loadSeatRegister, liveSeatBranches, pathsEqual } from '../enforcement/seat-register.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DECLARATIONS_PATH = join(__dirname, '../../_catalog/branch_declarations.json');

export const PROTECT_STATUSES = new Set(['live', 'unknown']);
const DEFAULT_MIN_AGE_DAYS = 0;

export function normalizePath(p) {
  return String(p).replace(/\\/g, '/');
}

export function loadBranchDeclarations(path = DECLARATIONS_PATH) {
  if (!existsSync(path)) {
    return { byKey: new Map(), bulkRules: [], source: 'none', schemaVersion: 2 };
  }
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    const byKey = new Map();
    for (const row of data.declarations ?? []) {
      if (!row.repo || !row.branch || !row.status) continue;
      const key = `${normalizePath(row.repo)}::${row.branch}`;
      byKey.set(key, row.status);
    }
    return {
      byKey,
      bulkRules: Array.isArray(data.bulkRules) ? data.bulkRules : [],
      source: path,
      schemaVersion: data._schemaVersion ?? 2,
    };
  } catch {
    return { byKey: new Map(), bulkRules: [], source: 'parse-error', schemaVersion: 2 };
  }
}

export function bulkRuleMatches(rule, repoPath, branchName, context = {}) {
  if (!rule || !rule.repo || !rule.status) return false;
  if (normalizePath(rule.repo) !== normalizePath(repoPath)) return false;
  const criteria = rule.criteria ?? {};
  const exclude = criteria.excludeBranches ?? [];
  if (exclude.includes(branchName)) return false;
  if (Object.prototype.hasOwnProperty.call(criteria, 'worktreeAttached')) {
    if (context.worktreeAttached !== criteria.worktreeAttached) return false;
  }
  if (criteria.tipBefore) {
    if (!context.lastCommitDate) return false;
    if (String(context.lastCommitDate) >= String(criteria.tipBefore)) return false;
  }
  return true;
}

/**
 * Named row wins. Else a registered seat branch is live. Else first matching
 * bulk rule. Else undeclared.
 * context.lastCommitDate and context.worktreeAttached are required for bulk
 * criteria that name them; absence is a non-match, not a pass.
 */
function seatRegisterLiveStatus(repoPath, branchName) {
  try {
    const live = liveSeatBranches(loadSeatRegister());
    const hit = live.find(
      (row) => pathsEqual(row.repo, repoPath) && row.branch === branchName,
    );
    return hit ? 'live' : null;
  } catch {
    return null;
  }
}

export function declarationStatus(declarations, repoPath, branchName, context = {}) {
  const key = `${normalizePath(repoPath)}::${branchName}`;
  if (declarations.byKey.has(key)) {
    return declarations.byKey.get(key);
  }
  const seatLive = seatRegisterLiveStatus(repoPath, branchName);
  if (seatLive) return seatLive;
  for (const rule of declarations.bulkRules ?? []) {
    if (bulkRuleMatches(rule, repoPath, branchName, context)) {
      return rule.status;
    }
  }
  return 'undeclared';
}

export { openPrHeads };

/**
 * Returns safety assessment per merged local branch.
 * Caller must abort when prCheck.verified is false (fail loud — no silent proceed).
 */
export function assessBranchSafety(
  repoPath,
  { minAgeDays = DEFAULT_MIN_AGE_DAYS, today = new Date().toISOString().slice(0, 10) } = {},
) {
  const merged = mergedLocalBranches(repoPath);
  const wt = worktreeBranches(repoPath);
  const pr = openPrHeads(repoPath);
  const declarations = loadBranchDeclarations();

  const results = [];

  for (const b of merged) {
    const worktreeAttached = wt.has(b.name);
    const status = declarationStatus(declarations, repoPath, b.name, {
      worktreeAttached,
      lastCommitDate: b.date,
    });
    const signals = {
      mergedIntoMain: true,
      mergeKind: b.mergeKind ?? 'ancestry',
      mergeBase: b.mergeBase,
      mergeBaseSource: b.mergeBaseSource,
      worktreeAttached,
      openPrHead: pr.verified && pr.heads.has(b.name),
      declarationStatus: status,
      prCheckVerified: pr.verified,
    };

    const safetyReasons = [];
    if (signals.worktreeAttached) safetyReasons.push('worktree_attached');
    if (signals.openPrHead) safetyReasons.push('open_pr_head');
    if (PROTECT_STATUSES.has(status)) {
      safetyReasons.push(`declared_${status}`);
    } else if (status === 'undeclared') {
      safetyReasons.push('undeclared_protects');
    } else if (status !== 'prune-safe') {
      safetyReasons.push(`declared_${status}`);
    }

    let ageDays = null;
    if (b.date) {
      ageDays = Math.floor((new Date(today) - new Date(b.date)) / 86400000);
      if (minAgeDays > 0 && ageDays < minAgeDays) {
        safetyReasons.push(`last_commit_within_${minAgeDays}d`);
      }
    }

    const deleteEligible =
      pr.verified &&
      status === 'prune-safe' &&
      signals.mergedIntoMain &&
      safetyReasons.length === 0;

    results.push({
      repo: repoPath,
      branch: b.name,
      tipSha: b.sha || null,
      lastCommitDate: b.date,
      mergeKind: signals.mergeKind,
      ageDays,
      signals,
      safetyReasons,
      deleteEligible,
      deleteBlockedReason: safetyReasons.length ? 'safety_signals' : null,
    });
  }

  return {
    branches: results,
    prCheck: pr,
    declaredSource: declarations.source,
    declarationSchema: declarations.schemaVersion,
  };
}

/** @deprecated use loadBranchDeclarations */
export function loadDeclaredLiveBranches() {
  const { byKey, source } = loadBranchDeclarations();
  const byRepo = {};
  for (const [key, status] of byKey) {
    if (!PROTECT_STATUSES.has(status) && status !== 'undeclared') continue;
    const [repo, branch] = key.split('::');
    if (!byRepo[repo]) byRepo[repo] = [];
    byRepo[repo].push(branch);
  }
  return { byRepo, source };
}
