#!/usr/bin/env node
/**
 * Seat register loader. Structural: JSON parse + path normalisation.
 * A text search over branch names is not a lookup.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REGISTER_PATH = join(__dirname, '../../_catalog/seat_register.json');

export function normalizePath(p) {
  if (p == null || p === '') return '';
  let s = String(p).trim().replace(/\\/g, '/');
  if (s.startsWith('/')) {
    const m = s.match(/^\/([a-zA-Z])\/(.+)$/);
    if (m) s = `${m[1]}:/${m[2]}`;
  }
  if (/^[a-zA-Z]:/.test(s)) {
    s = s[0].toUpperCase() + s.slice(1);
  }
  if (s.length > 3 && s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

export function pathsEqual(a, b) {
  return normalizePath(a).toLowerCase() === normalizePath(b).toLowerCase();
}

export function loadSeatRegister(path = REGISTER_PATH) {
  if (!existsSync(path)) {
    throw new Error(`seat register missing: ${path}`);
  }
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(data.seats) || data.seats.length === 0) {
    throw new Error('seat register has no seats[]');
  }
  for (const seat of data.seats) {
    for (const field of ['name', 'worktree', 'branch', 'namespace', 'authority']) {
      if (!seat[field]) throw new Error(`seat missing ${field}: ${JSON.stringify(seat.name || seat)}`);
    }
    if (!Array.isArray(seat.repos)) {
      throw new Error(`seat ${seat.name} repos must be an array`);
    }
  }
  return data;
}

export function allWorktreeEntries(register) {
  const rows = [];
  if (register.integration?.worktree) {
    rows.push({
      kind: 'integration',
      name: register.integration.name || 'integration',
      worktree: normalizePath(register.integration.worktree),
      branch: register.integration.branch,
      namespace: null,
      repoName: 'doc_repo',
      repoPath: normalizePath(register.integration.worktree),
    });
  }
  for (const seat of register.seats) {
    rows.push({
      kind: 'seat-doc',
      name: seat.name,
      worktree: normalizePath(seat.worktree),
      branch: seat.branch,
      namespace: seat.namespace,
      repoName: 'doc_repo',
      repoPath: normalizePath(seat.worktree),
    });
    for (const repo of seat.repos) {
      rows.push({
        kind: 'seat-product',
        name: seat.name,
        worktree: normalizePath(repo.worktree),
        branch: repo.branch,
        namespace: seat.namespace,
        repoName: repo.name,
        repoPath: normalizePath(repo.path),
      });
    }
  }
  return rows;
}

export function findByWorktree(register, worktreePath) {
  const rows = allWorktreeEntries(register);
  return rows.find((r) => pathsEqual(r.worktree, worktreePath)) || null;
}

export function ownerOfRepoPath(register, repoPath) {
  const rows = allWorktreeEntries(register);
  const hit = rows.find((r) => r.kind === 'seat-product' && pathsEqual(r.repoPath, repoPath));
  return hit || null;
}

/** Branches the prune must treat as live. Structural walk of the register. */
export function liveSeatBranches(register) {
  const out = [];
  for (const row of allWorktreeEntries(register)) {
    if (row.kind === 'integration') continue;
    out.push({
      repo: row.kind === 'seat-doc' ? 'P:/doc_repo' : row.repoPath,
      branch: row.branch,
      seat: row.name,
    });
  }
  return out;
}

export function namespaceFromStatePath(relPath) {
  const norm = String(relPath).replace(/\\/g, '/');
  const m = norm.match(/(^|\/)_state\/([^/]+)\//);
  if (!m) return null;
  const ns = m[2];
  if (ns === 'shared') return null;
  return ns;
}
