#!/usr/bin/env node
/**
 * Durable record for state-changing hygiene operations.
 * A count is not a record. If this write fails, the mutation must not run.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function defaultHygieneOpsDir() {
  return join(__dirname, '../../_catalog/hygiene_ops');
}

function requireFields(body) {
  if (!body.verb || !body.result || !body.timestamp || !body.invocation) {
    throw new Error('state-change log missing required fields (verb, result, timestamp, invocation)');
  }
  if (!['pending', 'deleted', 'refused', 'aborted'].includes(body.result)) {
    throw new Error(`state-change log result not in {pending,deleted,refused,aborted}: ${body.result}`);
  }
  if (body.result === 'deleted' && (!Array.isArray(body.items) || body.items.length === 0)) {
    throw new Error('deleted result requires named items');
  }
}

export function writeStateChangeLog(record, { logDir } = {}) {
  const dir = logDir || defaultHygieneOpsDir();
  mkdirSync(dir, { recursive: true });
  const timestamp = record.timestamp || new Date().toISOString();
  const ts = timestamp.replace(/[:.]/g, '-');
  const pid = record.pid ?? process.pid;
  const control = record.control || 'unknown-control';
  const path = join(dir, `${control}_${ts}_${pid}.json`);
  const body = {
    control,
    verb: record.verb,
    result: record.result,
    timestamp,
    pid,
    invocation: record.invocation,
    repo: record.repo ?? null,
    confirmCount: record.confirmCount ?? null,
    eligibleCount: record.eligibleCount ?? null,
    snapshot: record.snapshot ?? null,
    reason: record.reason ?? null,
    items: record.items ?? [],
  };
  requireFields(body);
  writeFileSync(path, `${JSON.stringify(body, null, 2)}\n`);
  return { path, record: body };
}

export function finalizeStateChangeLog(path, patch) {
  const body = JSON.parse(readFileSync(path, 'utf8'));
  const next = { ...body, ...patch, finalizedAt: new Date().toISOString() };
  requireFields(next);
  writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
  return { path, record: next };
}
