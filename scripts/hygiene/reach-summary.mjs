#!/usr/bin/env node
/**
 * Exclusion breakdown for HY-01 reach reporting.
 * The report is the product; deletion (when implemented) is secondary.
 */

export function summarizeExclusions(branches) {
  const breakdown = {
    mergedTotal: branches.length,
    deleteEligible: 0,
    undeclared: 0,
    declared_unknown: 0,
    declared_live: 0,
    worktree_attached: 0,
    open_pr_head: 0,
    /** prune-safe but blocked by worktree (markets seat declared, exclusion overrode) */
    prune_safe_blocked_by_worktree: 0,
    /** prune-safe but blocked by open PR head */
    prune_safe_blocked_by_open_pr: 0,
    /** prune-safe, no worktree, no open PR — delete-eligible only under --arm-delete */
    prune_safe_ready: 0,
    other_excluded: 0,
  };

  for (const b of branches) {
    const status = b.signals?.declarationStatus ?? 'undeclared';

    if (b.deleteEligible) {
      breakdown.deleteEligible++;
      breakdown.prune_safe_ready++;
      continue;
    }

    if (status === 'undeclared') breakdown.undeclared++;
    if (status === 'unknown') breakdown.declared_unknown++;
    if (status === 'live') breakdown.declared_live++;
    if (b.signals?.worktreeAttached) breakdown.worktree_attached++;
    if (b.signals?.openPrHead) breakdown.open_pr_head++;

    if (status === 'prune-safe') {
      if (b.signals?.worktreeAttached) breakdown.prune_safe_blocked_by_worktree++;
      else if (b.signals?.openPrHead) breakdown.prune_safe_blocked_by_open_pr++;
    } else if (b.safetyReasons?.length) {
      breakdown.other_excluded++;
    }
  }

  return breakdown;
}

export function formatReachLine(breakdown, { deleted = 0 } = {}) {
  const eligible = breakdown.deleteEligible;
  return (
    `REACH: ${deleted} deleted of ${eligible} eligible / ${breakdown.mergedTotal} merged - ` +
    `undeclared=${breakdown.undeclared}, unknown=${breakdown.declared_unknown}, live=${breakdown.declared_live}, ` +
    `worktree=${breakdown.worktree_attached}, prune_safe_blocked_by_worktree=${breakdown.prune_safe_blocked_by_worktree}, ` +
    `prune_safe_ready=${breakdown.prune_safe_ready}`
  );
}
