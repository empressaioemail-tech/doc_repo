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
 * What fails: child exit 1 on ALARM (divergent rows). Child exit 2 if the
 * checks file cannot be read. Spawn failure is unmeasured and also fails.
 * What bypasses: invoking scripts/canon-divergence.mjs without this wrapper
 * (default still writes the catalog and exits 0). Missing sibling clones
 * SKIPPED fail-open, so ubuntu-latest cannot observe a live alarm.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPT = join(ROOT, 'scripts', 'canon-divergence.mjs');

if (!existsSync(SCRIPT)) {
  console.error(`REFUSING: canon-divergence.mjs missing at ${SCRIPT}`);
  process.exit(1);
}

const run = spawnSync(
  process.execPath,
  [SCRIPT, '--check-only', '--no-fetch', '--no-stamp'],
  { cwd: ROOT, stdio: 'inherit', timeout: 300_000 },
);

if (run.error) {
  console.error(`canon-divergence-check: unmeasured (${run.error.message})`);
  process.exit(1);
}
process.exit(run.status === null ? 1 : run.status);
