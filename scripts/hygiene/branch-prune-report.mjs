#!/usr/bin/env node
/**
 * HY-01 branch prune — measurement report, with optional armed delete.
 *
 * Measurement is the default. armed is true only when a delete verb can execute.
 * Deletion runs only with:
 *   --arm-delete --repo <one repo> --confirm-count N
 * N must equal delete-eligible. Mismatch deletes nothing.
 *
 * Usage:
 *   node scripts/hygiene/branch-prune-report.mjs --repo P:/legacy-design-tools
 *   node scripts/hygiene/branch-prune-report.mjs --arm-delete --repo P:/legacy-design-tools --confirm-count 135
 */
import { emitSnapshotBlock, repoSnapshot, git, gitExitCode } from './_lib.mjs';
import { assessBranchSafety } from './branch-safety.mjs';
import { summarizeExclusions, formatReachLine } from './reach-summary.mjs';
import { defaultHygieneOpsDir, writeStateChangeLog, finalizeStateChangeLog } from './state-change-log.mjs';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const armDelete = argv.includes('--arm-delete');
const disarmed = argv.includes('--disarmed');
const armed = armDelete;

if (argv.includes('--test-gh-failure')) {
  process.env.HY01_TEST_GH_FAIL = '1';
}

const repoArgs = [];
let confirmCount = null;
let logDir = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--repo' && argv[i + 1]) repoArgs.push(argv[++i]);
  if (argv[i] === '--confirm-count' && argv[i + 1]) {
    const n = Number(argv[++i]);
    confirmCount = Number.isInteger(n) && n >= 0 ? n : NaN;
  }
  if (argv[i] === '--log-dir' && argv[i + 1]) logDir = argv[++i];
}

const DEFAULT_REPOS = [
  'P:/doc_repo',
  'P:/legacy-design-tools',
  'P:/hauska-engine',
  'P:/hauska-map',
  'P:/hauska-mcp-server',
  'P:/Empressa Trading',
  'P:/smart-markets',
  'P:/smartcity-dashboards',
  'P:/smart-files',
];

const invocation = process.argv.slice(1);
const opsLogDir = logDir || defaultHygieneOpsDir();

function itemsFromEligible(rows) {
  return rows.map((c) => ({
    repo: c.repo,
    branch: c.branch,
    tipSha: c.tipSha || null,
    lastCommitDate: c.lastCommitDate || null,
    mergeKind: c.mergeKind || c.signals?.mergeKind || null,
  }));
}

function logStateChange(partial) {
  return writeStateChangeLog(
    {
      control: 'HY-01-branch-prune-report',
      verb: 'delete-local-branch',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      invocation,
      ...partial,
    },
    { logDir: opsLogDir },
  );
}

function refuseAndExit(message, extra = {}, code = 2) {
  console.error(message);
  try {
    const logged = logStateChange({
      result: 'refused',
      repo: repoArgs[0] ?? null,
      confirmCount,
      eligibleCount: extra.eligibleCount ?? null,
      reason: extra.reason ?? message,
      snapshot: extra.snapshot ?? null,
      items: extra.items ?? [],
    });
    console.error(`state-change log: ${logged.path}`);
  } catch (err) {
    console.error(`state-change log WRITE FAILED: ${err.message}`);
  }
  process.exit(code);
}

if (armDelete) {
  if (disarmed) {
    refuseAndExit('REFUSED: --arm-delete is not valid with --disarmed.', {
      reason: 'arm_delete_with_disarmed',
    });
  }
  if (repoArgs.length !== 1) {
    refuseAndExit('REFUSED: --arm-delete requires exactly one --repo (no fleet delete).', {
      reason: 'arm_delete_requires_one_repo',
    });
  }
  if (confirmCount === null || Number.isNaN(confirmCount)) {
    refuseAndExit('REFUSED: --arm-delete requires --confirm-count N matching delete-eligible.', {
      reason: 'arm_delete_requires_confirm_count',
      repo: repoArgs[0],
    });
  }
}

const repos = repoArgs.length ? repoArgs : DEFAULT_REPOS;

const report = {
  control: 'HY-01-branch-prune-report',
  armed,
  mode: armDelete ? 'armed-delete' : 'measurement',
  note: armDelete
    ? 'ARMED DELETE — only deleteEligible refs; git branch -D after safety signals agree. Ancestry -d is not used (it undercounts squash). State-change log is written before any -D.'
    : 'Measurement report. Reach line required on every run. gh PR check must verify or run fails. Deletion cannot occur in this mode.',
  gate: {
    executor: 'scripts/hygiene/branch-prune-report.mjs + branch-safety.mjs + gh-pr-check.mjs',
    trigger: 'on invoke; --arm-delete only with --repo and --confirm-count',
    fails: 'non-zero when delete-eligible remain OR gh PR check fails after retry OR confirm-count mismatch OR state-change log cannot be written',
    bypasses: 'repos omitted from scan; worktree-attached; open PR heads; live/unknown/undeclared; fleet --arm-delete (refused); any git -D outside this script',
  },
  safetyModel: {
    rule: 'Delete-eligible ONLY when content-merged into origin/main AND declaration status prune-safe AND no worktree AND no open PR head AND gh PR check verified',
    rejected: 'current_checkout alone is NOT a safety signal (scan-time observation)',
    declarationsFile: '_catalog/branch_declarations.json',
    ghHardening: '3 attempts with backoff; verified=false aborts run (exit 3); deletes nothing',
    deleteCommand: armDelete ? 'git branch -D (control merge detector is authority, not git -d)' : null,
    confirmCount: armDelete ? confirmCount : null,
    stateChangeLog: 'write pending record naming each ref before any -D; refuse if the record cannot be written',
  },
  snapshot: emitSnapshotBlock({ repos }),
  repos: [],
  prCheckFailures: [],
  reach: {
    fleet: null,
    byRepo: [],
  },
  blastRadius: {
    deleteEligible: [],
    excludedBySafetySignal: [],
    totalDeleteEligible: 0,
    totalDeleted: 0,
    deleted: [],
    stateChangeLog: null,
  },
};

let exitCode = 0;
const allBranches = [];

function deleteEligibleBranch(repoPath, branchName) {
  git(repoPath, ['branch', '-D', branchName]);
  const stillThere = gitExitCode(repoPath, ['show-ref', '--verify', '--quiet', `refs/heads/${branchName}`]) === 0;
  if (stillThere) {
    throw new Error(`delete claimed success but refs/heads/${branchName} still exists`);
  }
}

for (const repoPath of repos) {
  const snap = repoSnapshot(repoPath);
  if (!snap.exists) {
    report.repos.push({ path: repoPath, exists: false });
    continue;
  }

  const assessment = assessBranchSafety(repoPath);

  if (!assessment.prCheck.verified) {
    report.prCheckFailures.push({
      repo: repoPath,
      error: assessment.prCheck.error,
      attempts: assessment.prCheck.attempts,
    });
    report.repos.push({
      path: repoPath,
      exists: true,
      snapshot: snap,
      prCheckVerified: false,
      prCheckError: assessment.prCheck.error,
      scanAborted: true,
    });
    continue;
  }

  const breakdown = summarizeExclusions(assessment.branches);
  allBranches.push(...assessment.branches);

  const deleteEligible = assessment.branches.filter((b) => b.deleteEligible);
  const excluded = assessment.branches.filter((b) => !b.deleteEligible);

  report.repos.push({
    path: repoPath,
    exists: true,
    snapshot: snap,
    mergedLocalCount: assessment.branches.length,
    deleteEligibleCount: deleteEligible.length,
    prCheckVerified: true,
    prCheckAttempts: assessment.prCheck.attempts,
    reach: breakdown,
    reachLine: formatReachLine(breakdown, { deleted: 0 }),
  });

  report.reach.byRepo.push({ repo: repoPath, ...breakdown, reachLine: formatReachLine(breakdown, { deleted: 0 }) });
  report.blastRadius.deleteEligible.push(...deleteEligible);
  report.blastRadius.excludedBySafetySignal.push(...excluded);
}

if (report.prCheckFailures.length > 0) {
  exitCode = 3;
}

report.reach.fleet = summarizeExclusions(allBranches);
report.blastRadius.totalDeleteEligible = report.blastRadius.deleteEligible.length;

if (armDelete && exitCode === 3) {
  try {
    const logged = logStateChange({
      result: 'aborted',
      repo: repoArgs[0],
      confirmCount,
      eligibleCount: report.blastRadius.totalDeleteEligible,
      reason: 'gh_pr_check_unverified',
      snapshot: report.snapshot,
      items: itemsFromEligible(report.blastRadius.deleteEligible),
    });
    report.blastRadius.stateChangeLog = logged.path;
    console.error(`state-change log: ${logged.path}`);
  } catch (err) {
    console.error(`state-change log WRITE FAILED: ${err.message}`);
  }
}

if (armDelete && exitCode !== 3) {
  const items = itemsFromEligible(report.blastRadius.deleteEligible);
  if (report.blastRadius.totalDeleteEligible !== confirmCount) {
    console.error(
      `REFUSED: delete-eligible ${report.blastRadius.totalDeleteEligible} !== --confirm-count ${confirmCount}. Delete nothing.`,
    );
    report.blastRadius.deleteRefused = {
      reason: 'confirm_count_mismatch',
      eligible: report.blastRadius.totalDeleteEligible,
      confirmCount,
    };
    try {
      const logged = logStateChange({
        result: 'refused',
        repo: repoArgs[0],
        confirmCount,
        eligibleCount: report.blastRadius.totalDeleteEligible,
        reason: 'confirm_count_mismatch',
        snapshot: report.snapshot,
        items,
      });
      report.blastRadius.stateChangeLog = logged.path;
      console.error(`state-change log: ${logged.path}`);
    } catch (err) {
      console.error(`state-change log WRITE FAILED: ${err.message}`);
    }
    exitCode = 2;
  } else {
    let pending;
    try {
      pending = logStateChange({
        result: 'pending',
        repo: repoArgs[0],
        confirmCount,
        eligibleCount: report.blastRadius.totalDeleteEligible,
        reason: 'confirm_count_matched',
        snapshot: report.snapshot,
        items,
      });
      report.blastRadius.stateChangeLog = pending.path;
    } catch (err) {
      console.error(`REFUSED: state-change log could not be written. Delete nothing. ${err.message}`);
      report.blastRadius.deleteRefused = {
        reason: 'state_change_log_write_failed',
        error: err.message,
      };
      exitCode = 4;
    }

    if (pending) {
      for (const c of report.blastRadius.deleteEligible) {
        deleteEligibleBranch(c.repo, c.branch);
        report.blastRadius.deleted.push({
          repo: c.repo,
          branch: c.branch,
          tipSha: c.tipSha || null,
          lastCommitDate: c.lastCommitDate,
          mergeKind: c.mergeKind || c.signals?.mergeKind || null,
        });
      }
      report.blastRadius.totalDeleted = report.blastRadius.deleted.length;
      try {
        finalizeStateChangeLog(pending.path, {
          result: 'deleted',
          items: report.blastRadius.deleted,
          eligibleCount: report.blastRadius.totalDeleted,
        });
      } catch (err) {
        console.error(`state-change log finalize FAILED after deletes: ${err.message}`);
        console.error(`pending record remains at ${pending.path}`);
        exitCode = 4;
      }
    }
  }
}

report.reach.fleetLine = formatReachLine(report.reach.fleet, { deleted: report.blastRadius.totalDeleted });
if (report.reach.byRepo[0]) {
  report.reach.byRepo[0].reachLine = formatReachLine(report.reach.byRepo[0], {
    deleted: report.blastRadius.totalDeleted,
  });
}

if (exitCode === 0 && report.blastRadius.totalDeleteEligible > 0 && !armDelete) {
  exitCode = 1;
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const modeLabel = armDelete ? 'ARMED-DELETE' : 'MEASUREMENT';
  console.log(`HY-01 branch measurement report (${modeLabel}) — ${report.snapshot.scannedAt}`);
  console.log(`Scanner: ${report.snapshot.scannerRepo.path} @ ${report.snapshot.scannerRepo.head?.slice(0, 8)}`);
  console.log('');

  if (report.prCheckFailures.length > 0) {
    console.error('GH PR CHECK FAILED (fail loud — report incomplete):');
    for (const f of report.prCheckFailures) {
      console.error(`  ${f.repo}: ${f.error} (${f.attempts} attempts)`);
    }
    console.error('');
  }

  if (report.blastRadius.deleteRefused) {
    console.error(
      `DELETE REFUSED: ${report.blastRadius.deleteRefused.reason}` +
        (report.blastRadius.deleteRefused.eligible !== undefined
          ? ` eligible ${report.blastRadius.deleteRefused.eligible} !== confirm ${report.blastRadius.deleteRefused.confirmCount}`
          : ''),
    );
    console.error('');
  }

  for (const r of report.repos) {
    if (r.exists === false) {
      console.log(`  ${r.path}: ABSENT`);
      continue;
    }
    if (r.scanAborted) {
      console.log(`  ${r.path}: SCAN ABORTED — gh PR check failed`);
      continue;
    }
    console.log(`  ${r.path}: ${r.reachLine}`);
  }

  console.log('');
  console.log(`FLEET ${report.reach.fleetLine}`);

  if (report.blastRadius.totalDeleted > 0) {
    console.log(`\nDELETED (${report.blastRadius.totalDeleted}):`);
    for (const c of report.blastRadius.deleted.slice(0, 30)) {
      console.log(`  - ${c.repo} :: ${c.branch} (${c.lastCommitDate})`);
    }
    if (report.blastRadius.deleted.length > 30) {
      console.log(`  ... and ${report.blastRadius.deleted.length - 30} more`);
    }
  }

  if (report.blastRadius.totalDeleteEligible > 0 && report.blastRadius.totalDeleted === 0) {
    console.log(`\nDELETE ELIGIBLE (${report.blastRadius.totalDeleteEligible}):`);
    for (const c of report.blastRadius.deleteEligible.slice(0, 30)) {
      console.log(`  - ${c.repo} :: ${c.branch} (${c.lastCommitDate})`);
    }
    if (report.blastRadius.deleteEligible.length > 30) {
      console.log(`  ... and ${report.blastRadius.deleteEligible.length - 30} more`);
    }
  } else if (report.prCheckFailures.length === 0 && report.blastRadius.totalDeleted === 0) {
    console.log('\nDELETE ELIGIBLE: 0');
  }
}

process.exit(exitCode);
