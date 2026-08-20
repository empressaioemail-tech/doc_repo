#!/usr/bin/env node
/**
 * Proof-by-violation runner for the three disarmed hygiene controls.
 * Each control must FAIL on a known violation before being reported as working.
 *
 * Usage: node scripts/hygiene/proof-by-violation.mjs
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function runExpectFail(cmd) {
  try {
    run(cmd);
    return { ok: false, detail: 'expected non-zero exit but got 0' };
  } catch (err) {
    const code = err.status ?? 1;
    return { ok: code !== 0, exitCode: code, stdout: err.stdout?.toString(), stderr: err.stderr?.toString() };
  }
}

function runExpectPass(cmd) {
  try {
    const out = run(cmd);
    return { ok: true, stdout: out };
  } catch (err) {
    return { ok: false, detail: err.stderr?.toString() || err.message };
  }
}

const results = [];

// 1. Nested clone — doc_repo has known violations
results.push({
  name: 'nested-clone-detect on doc_repo (must FAIL)',
  ...runExpectFail('node scripts/hygiene/nested-clone-detect.mjs --root "' + root.replace(/\\/g, '/') + '"'),
});

// 1b. Clean temp dir — must PASS
const cleanDir = mkdtempSync(join(tmpdir(), 'hygiene-clean-'));
try {
  results.push({
    name: 'nested-clone-detect on empty temp dir (must PASS)',
    ...runExpectPass('node scripts/hygiene/nested-clone-detect.mjs --root "' + cleanDir.replace(/\\/g, '/') + '"'),
  });
} finally {
  rmSync(cleanDir, { recursive: true, force: true });
}

results.push({
  name: 'branch-safety bulkRules named-override (must PASS)',
  ...runExpectPass('node scripts/hygiene/branch-safety.test.mjs'),
});

const measurement = runExpectFail('node scripts/hygiene/branch-prune-report.mjs --json --repo "P:/smart-markets"');
let measurementArmedOk = false;
let measurementArmedDetail;
try {
  const parsed = JSON.parse(measurement.stdout || '');
  measurementArmedOk = parsed.armed === false && parsed.mode === 'measurement';
  measurementArmedDetail = measurementArmedOk
    ? undefined
    : `armed=${parsed.armed} mode=${parsed.mode}`;
} catch (err) {
  measurementArmedDetail = err.message;
}
results.push({
  name: 'measurement report armed=false mode=measurement (must FAIL exit 1 on eligible)',
  ...measurement,
  ok: measurement.ok && measurement.exitCode === 1,
});
results.push({
  name: 'measurement report does not claim armed',
  ok: measurementArmedOk,
  detail: measurementArmedDetail,
});

const logDir = mkdtempSync(join(tmpdir(), 'hy01-ops-'));
try {
  const noRepo = runExpectFail(
    'node scripts/hygiene/branch-prune-report.mjs --arm-delete --log-dir "' + logDir.replace(/\\/g, '/') + '"',
  );
  const refuseLogs = readdirSync(logDir).filter((f) => f.endsWith('.json'));
  let refuseLogOk = false;
  if (refuseLogs.length === 1) {
    const rec = JSON.parse(readFileSync(join(logDir, refuseLogs[0]), 'utf8'));
    refuseLogOk =
      rec.result === 'refused' &&
      rec.verb === 'delete-local-branch' &&
      Array.isArray(rec.invocation) &&
      rec.reason === 'arm_delete_requires_one_repo';
  }
  results.push({
    name: '--arm-delete without --repo (must FAIL exit 2)',
    ...noRepo,
    ok: noRepo.ok && noRepo.exitCode === 2,
  });
  results.push({
    name: '--arm-delete without --repo writes refuse log naming invocation',
    ok: refuseLogOk,
    detail: refuseLogOk ? undefined : `logs=${refuseLogs.join(',') || 'none'}`,
  });

  const mismatch = runExpectFail(
    'node scripts/hygiene/branch-prune-report.mjs --json --arm-delete --repo "P:/smart-markets" --confirm-count 0 --log-dir "' +
      logDir.replace(/\\/g, '/') +
      '"',
  );
  const mismatchLogs = readdirSync(logDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(logDir, f), 'utf8')))
    .filter((r) => r.reason === 'confirm_count_mismatch');
  const mismatchLog = mismatchLogs[0];
  const mismatchLogOk =
    mismatchLog &&
    mismatchLog.result === 'refused' &&
    mismatchLog.repo &&
    Array.isArray(mismatchLog.items) &&
    mismatchLog.items.length >= 1 &&
    mismatchLog.items.every((it) => it.branch && it.timestamp === undefined);
  results.push({
    name: '--arm-delete confirm-count mismatch (must FAIL exit 2)',
    ...mismatch,
    ok: mismatch.ok && mismatch.exitCode === 2,
  });
  results.push({
    name: 'confirm-count mismatch refuse log names each item',
    ok: Boolean(mismatchLogOk),
    detail: mismatchLogOk
      ? undefined
      : `mismatchLogs=${mismatchLogs.length} firstItems=${JSON.stringify(mismatchLog?.items?.slice(0, 2))}`,
  });

  const blocker = join(logDir, 'not-a-dir');
  writeFileSync(blocker, 'x');
  const badLogDir = join(blocker, 'nested');
  const logFail = runExpectFail(
    'node scripts/hygiene/branch-prune-report.mjs --json --arm-delete --repo "P:/smart-markets" --confirm-count 1 --log-dir "' +
      badLogDir.replace(/\\/g, '/') +
      '"',
  );
  let stillThere = false;
  try {
    execSync('git -C "P:/smart-markets" show-ref --verify --quiet refs/heads/tw11/absence-fixtures', {
      cwd: root,
      stdio: 'pipe',
    });
    stillThere = true;
  } catch {
    stillThere = false;
  }
  results.push({
    name: 'state-change log write failure blocks delete (exit 4, ref remains)',
    ok: logFail.ok && logFail.exitCode === 4 && stillThere,
    exitCode: logFail.exitCode,
    detail: stillThere ? undefined : `exit=${logFail.exitCode} stillThere=${stillThere}`,
  });
} finally {
  rmSync(logDir, { recursive: true, force: true });
}

// 2. Branch prune — smart-markets has prune-safe merged branch (tw11/absence-fixtures)
results.push({
  name: 'branch-prune-report on smart-markets (must FAIL — 1 delete-eligible, reach line)',
  ...runExpectFail('node scripts/hygiene/branch-prune-report.mjs --repo "P:/smart-markets"'),
});

// 2b. gh failure — fail loud exit 3
results.push({
  name: 'branch-prune-report --test-gh-failure (must FAIL exit 3)',
  ...runExpectFail('node scripts/hygiene/branch-prune-report.mjs --repo "P:/doc_repo" --test-gh-failure'),
});

// 3. Backlog expiry — with today before threshold (must PASS at 5d age)
results.push({
  name: 'backlog-expiry with today=2026-08-19 (must PASS — age 5d < 14d)',
  ...runExpectPass('node scripts/hygiene/backlog-expiry-dryrun.mjs --today 2026-08-19'),
});

// 3b. Backlog expiry — simulated future (must FAIL)
results.push({
  name: 'backlog-expiry with today=2026-09-05 (must FAIL — age 22d >= 14d)',
  ...runExpectFail('node scripts/hygiene/backlog-expiry-dryrun.mjs --today 2026-09-05'),
});

const allOk = results.every((r) => r.ok);

const report = {
  scannedAt: new Date().toISOString(),
  scannerRepo: run('git rev-parse HEAD').trim(),
  allProofsPassed: allOk,
  results: results.map((r) => ({
    name: r.name,
    ok: r.ok,
    exitCode: r.exitCode,
    detail: r.detail,
  })),
};

console.log(JSON.stringify(report, null, 2));
process.exit(allOk ? 0 : 1);
