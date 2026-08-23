#!/usr/bin/env node
/**
 * CI wrapper for canon-divergence --check-only.
 *
 * ci-baseline.mjs spawns `node script` with no extra args. This wrapper is
 * the way to pass --check-only --no-fetch --no-stamp so CI cannot rewrite
 * _catalog/canon_divergence.md.
 *
 * What executes: this file, spawned by scripts/enforcement/ci-baseline.mjs.
 * What triggers: GitHub Actions enforcement.yml ratchet step (push/PR/dispatch).
 * What fails: child exit 1 on ALARM (divergent rows). Child exit 2 if a
 * checks file cannot be read or the fixture bundle cannot be materialized.
 * Spawn failure is unmeasured and also fails.
 * What bypasses: invoking scripts/canon-divergence.mjs without this wrapper
 * (default still writes the catalog and exits 0).
 *
 * Live P:/ sibling clones are SKIPPED fail-open on ubuntu-latest. The
 * checked-in bundle at _catalog/fixtures/r06-canon-clone.bundle is the
 * portable clone so the job can observe ALARM. Default fixture
 * last_verified is 2099-01-01 (OK). Inject 2000-01-01 to fail the job.
 * Stay REPORTING until a GitHub run, not only a laptop, sees that ALARM.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPT = join(ROOT, 'scripts', 'canon-divergence.mjs');
const FIXTURE_BUNDLE = join(ROOT, '_catalog', 'fixtures', 'r06-canon-clone.bundle');
const FIXTURE_CHECKS = join(ROOT, '_catalog', 'fixtures', 'r06-canon-checks.json');

function runCheck(extraArgs) {
  const run = spawnSync(
    process.execPath,
    [SCRIPT, '--check-only', '--no-fetch', '--no-stamp', ...extraArgs],
    { cwd: ROOT, stdio: 'inherit', timeout: 300_000 },
  );
  if (run.error) {
    console.error(`canon-divergence-check: unmeasured (${run.error.message})`);
    return 1;
  }
  return run.status === null ? 1 : run.status;
}

function parseArgs(argv) {
  const out = { checksPath: FIXTURE_CHECKS, skipLive: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--checks') out.checksPath = resolve(argv[++i]);
    else if (a === '--skip-live') out.skipLive = true;
  }
  return out;
}

function runFixture(checksPath) {
  if (!existsSync(FIXTURE_BUNDLE)) {
    console.error(`REFUSING: fixture bundle missing at ${FIXTURE_BUNDLE}. Absent is not a pass.`);
    return 2;
  }
  if (!existsSync(checksPath)) {
    console.error(`REFUSING: fixture checks missing at ${checksPath}. Absent is not a pass.`);
    return 2;
  }
  let data;
  try {
    data = JSON.parse(readFileSync(checksPath, 'utf8'));
  } catch (err) {
    console.error(`REFUSING: fixture checks unparseable (${err.message || err})`);
    return 2;
  }
  if (!data || !Array.isArray(data.repos)) {
    console.error('REFUSING: fixture checks missing repos[]');
    return 2;
  }
  const dir = mkdtempSync(join(tmpdir(), 'r06-ci-canon-'));
  try {
    const cloneDir = join(dir, 'clone');
    execFileSync('git', ['clone', '--quiet', FIXTURE_BUNDLE, cloneDir], { stdio: 'pipe' });
    for (const repo of data.repos) {
      repo.clone = cloneDir;
    }
    const checksPath = join(dir, 'checks.json');
    writeFileSync(checksPath, JSON.stringify(data, null, 2) + '\n');
    return runCheck(['--checks', checksPath]);
  } catch (err) {
    console.error(`canon-divergence-check: fixture unmeasured (${err.message || err})`);
    return 2;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (!existsSync(SCRIPT)) {
  console.error(`REFUSING: canon-divergence.mjs missing at ${SCRIPT}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const live = args.skipLive ? 0 : runCheck([]);
const fixture = runFixture(args.checksPath);
const exit = live === 2 || fixture === 2 ? 2 : Math.max(live, fixture);
process.exit(exit);
