#!/usr/bin/env node
/**
 * Stall watchdog — detects QUIET, not death.
 *
 * Every stall in this program (L16 pipelines 5.5h, flood waiter, silent watcher expiry) shared one
 * root: liveness was inferred from a process existing, monitored by something that could die with
 * it. This watchdog inverts both: it reads _catalog/watch_registry/<id>.json
 * entries {id, path(file|glob), maxQuietMin, note} and checks the newest mtime behind each entry every 60s.
 * When any entry goes quiet past its budget, it prints the ALARM and EXITS NON-ZERO — run it as a
 * planner background task so its exit WAKES the planner for immediate triage (never a silent
 * timeout: on reaching maxCycles it exits 0 with WATCH-EXPIRED-REARM so the planner re-arms).
 *
 *   node scripts/stall-watchdog.mjs [maxCycles=240]
 *
 * Registry edits take effect on the next cycle; no restart needed. An entry with "paused": true is
 * skipped (use for legs between runs). A missing path older than maxQuietMin also alarms — a runner
 * that never started is a stall too.
 */
import { readFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registryDir = join(root, '_catalog', 'watch_registry');
const maxCycles = parseInt(process.argv[2] || '240', 10);

function loadWatches() {
  if (!existsSync(registryDir)) {
    throw new Error(`watch registry directory missing: ${registryDir}`);
  }
  const files = readdirSync(registryDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    throw new Error('watch registry directory has no json files');
  }
  const entries = [];
  for (const f of files) {
    const w = JSON.parse(readFileSync(join(registryDir, f), 'utf8'));
    if (!w.id || !w.path || typeof w.maxQuietMin !== 'number') {
      throw new Error(`watch file ${f} missing id, path, or maxQuietMin`);
    }
    entries.push(w);
  }
  return entries;
}

function newestMtime(pattern) {
  let files = [];
  try {
    files = pattern.includes('*') ? globSync(pattern) : (existsSync(pattern) ? [pattern] : []);
  } catch { files = existsSync(pattern) ? [pattern] : []; }
  let newest = 0;
  for (const f of files) {
    try { const m = statSync(f).mtimeMs; if (m > newest) newest = m; } catch {}
  }
  return { newest, count: files.length };
}

for (let cycle = 1; cycle <= maxCycles; cycle++) {
  let entries = [];
  try {
    entries = loadWatches();
  } catch (e) {
    console.log(`ALARM REGISTRY-UNREADABLE: ${e.message}`);
    process.exit(1);
  }
  const now = Date.now();
  for (const w of entries) {
    if (w.paused) continue;
    const { newest, count } = newestMtime(w.path);
    const quietMin = newest ? (now - newest) / 60000 : Infinity;
    if (quietMin > w.maxQuietMin) {
      console.log(`ALARM STALL: ${w.id} quiet ${newest ? Math.round(quietMin) + 'min' : 'NEVER-STARTED'} (budget ${w.maxQuietMin}min, files ${count}, path ${w.path})${w.note ? ' — ' + w.note : ''}`);
      process.exit(1);
    }
  }
  if (cycle === maxCycles) { console.log('WATCH-EXPIRED-REARM: all watches healthy for the full window; re-arm me.'); process.exit(0); }
  await new Promise((r) => setTimeout(r, 60000));
}
