#!/usr/bin/env node
/**
 * HY-03 backlog expiry job — DRY RUN / DISARMED by default.
 *
 * Executor:   this script (scheduled daily when armed)
 * Trigger:     daily schedule when armed
 * Fails:       non-zero when any P0/P1 item would expire (report mode)
 * Bypasses:    P2/P3 rows; items with an assigned plan row in disposition text
 *
 * Reshape of repo_cleanup_backlog "graduate or expire" — automatic, not protocol.
 *
 * Usage:
 *   node scripts/hygiene/backlog-expiry-dryrun.mjs
 *   node scripts/hygiene/backlog-expiry-dryrun.mjs --today 2026-09-05
 *   node scripts/hygiene/backlog-expiry-dryrun.mjs --backlog path/to/backlog.md
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitSnapshotBlock, CONTROL_DEFAULTS } from './_lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultBacklog = join(__dirname, '../../_catalog/repo_cleanup_backlog.md');

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const today = argv.includes('--today') ? argv[argv.indexOf('--today') + 1] : new Date().toISOString().slice(0, 10);
const thresholdDays = Number(argv.includes('--threshold-days') ? argv[argv.indexOf('--threshold-days') + 1] : 14);
const backlogPath = argv.includes('--backlog') ? argv[argv.indexOf('--backlog') + 1] : defaultBacklog;
const apply = argv.includes('--apply');

if (apply) {
  console.error('REFUSED: --apply is not implemented. DISARMED until operator go.');
  process.exit(2);
}

const text = readFileSync(backlogPath, 'utf8');
const fm = text.match(/^---\n([\s\S]*?)\n---/);
const lastUpdated = fm?.[1].match(/last_updated:\s*(\S+)/)?.[1] ?? null;

const PLAN_ROW_RE = /\b(?:P-\d+|G-\d+|A-\d+|OPS-\d+|PLAN-ROW\s+[PG]-\d+)\b/i;

function daysBetween(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return Math.floor((db - da) / (86400 * 1000));
}

function parseTableRows(sectionRegex) {
  const section = text.match(sectionRegex);
  if (!section) return [];
  const lines = section[1].split('\n').filter((l) => l.startsWith('|') && !l.includes('---'));
  const rows = [];
  for (const line of lines.slice(1)) {
    const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cols.length < 4) continue;
    const num = cols[0].replace(/\*\*/g, '');
    if (!/^\d+$/.test(num)) continue;
    rows.push({
      num: Number(num),
      item: cols[1],
      evidence: cols[2],
      disposition: cols[3],
      size: cols[4] ?? '',
    });
  }
  return rows;
}

const p0 = parseTableRows(/## P0[\s\S]*?\n(\|[\s\S]*?)\n\n## /);
const p1 = parseTableRows(/## P1[\s\S]*?\n(\|[\s\S]*?)\n\n## /);

const candidates = [...p0.map((r) => ({ ...r, priority: 'P0' })), ...p1.map((r) => ({ ...r, priority: 'P1' }))];

const ageDays = lastUpdated ? daysBetween(lastUpdated, today) : null;
const wouldExpire = [];
const skipped = [];

for (const row of candidates) {
  const hasPlanRow = PLAN_ROW_RE.test(row.disposition) || PLAN_ROW_RE.test(row.item);
  if (hasPlanRow) {
    skipped.push({ ...row, reason: 'plan-row-named-in-disposition' });
    continue;
  }
  if (ageDays !== null && ageDays >= thresholdDays) {
    wouldExpire.push({ ...row, ageDays, fileLastUpdated: lastUpdated });
  }
}

const report = {
  control: 'HY-03-backlog-expiry-dryrun',
  ...CONTROL_DEFAULTS,
  gate: {
    executor: 'scripts/hygiene/backlog-expiry-dryrun.mjs',
    trigger: 'daily schedule when armed',
    fails: 'non-zero when P0/P1 items would flip to expired',
    bypasses: 'P2/P3; rows naming a plan row in disposition',
  },
  snapshot: emitSnapshotBlock({ backlogPath, today, thresholdDays }),
  backlogLastUpdated: lastUpdated,
  ageDays,
  wouldExpire,
  skippedPlanRow: skipped,
  wouldExpireCount: wouldExpire.length,
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Backlog expiry dry-run (DISARMED) — as-of ${today}, threshold ${thresholdDays}d`);
  console.log(`Backlog last_updated: ${lastUpdated} (age ${ageDays}d)`);
  console.log(`Would expire: ${wouldExpire.length}; skipped (plan row named): ${skipped.length}`);
  for (const e of wouldExpire) {
    console.log(`  - [${e.priority} #${e.num}] ${e.item.slice(0, 80)}...`);
  }
}

process.exit(wouldExpire.length ? 1 : 0);
