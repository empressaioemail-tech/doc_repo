#!/usr/bin/env node
/**
 * gh open-PR probe with retry. Fail loud — never silently proceed when verified=false.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const RETRY_DELAYS_MS = [500, 1500, 3000];
const DEFAULT_ATTEMPTS = 3;

function sleepMs(ms) {
  if (ms <= 0) return;
  if (process.platform === 'win32') {
    execFileSync('powershell', ['-Command', `Start-Sleep -Milliseconds ${ms}`], { stdio: 'ignore' });
  } else {
    execFileSync('sleep', [String(Math.ceil(ms / 1000))], { stdio: 'ignore' });
  }
}

/**
 * @returns {{ heads: Set<string>, verified: boolean, error?: string, attempts: number }}
 */
export function openPrHeads(repoPath, { attempts = DEFAULT_ATTEMPTS } = {}) {
  if (!existsSync(repoPath)) {
    return { heads: new Set(), verified: false, error: 'repo-absent', attempts: 0 };
  }

  if (process.env.HY01_TEST_GH_FAIL === '1') {
    return {
      heads: new Set(),
      verified: false,
      error: 'HY01_TEST_GH_FAIL injected',
      attempts,
    };
  }

  let lastError = 'unknown';
  for (let i = 0; i < attempts; i++) {
    try {
      const out = execFileSync(
        'gh',
        ['pr', 'list', '--state', 'open', '--json', 'headRefName', '--limit', '200'],
        { cwd: repoPath, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
      );
      const rows = JSON.parse(out);
      return {
        heads: new Set(rows.map((r) => r.headRefName)),
        verified: true,
        attempts: i + 1,
      };
    } catch (err) {
      lastError = err.stderr?.toString()?.trim() || err.message || String(err);
      if (i < attempts - 1) {
        sleepMs(RETRY_DELAYS_MS[i] ?? 3000);
      }
    }
  }

  return {
    heads: new Set(),
    verified: false,
    error: lastError,
    attempts,
  };
}
