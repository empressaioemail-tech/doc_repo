/**
 * Per-seat override log append. Historical rows stay in
 * _catalog/dispatch_overrides.log and _catalog/canon_overrides.log.
 * New rows go to _catalog/override_logs/<seat>.log.
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSeatRegister, seatNameFromCwd } from './seat-register.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const OVERRIDE_DIR = join(ROOT, '_catalog/override_logs');

export function overrideLogPath(seat) {
  const safe = String(seat || 'unknown').replace(/[^A-Za-z0-9_-]/g, '_') || 'unknown';
  return join(OVERRIDE_DIR, `${safe}.log`);
}

export function appendOverride({ kind, cwd, extra = '', worktree = '' }) {
  const register = loadSeatRegister();
  const seat = seatNameFromCwd(register, cwd || worktree || '');
  mkdirSync(OVERRIDE_DIR, { recursive: true });
  const line = `${new Date().toISOString()}\t${kind}\tseat=${seat}\ttarget=${worktree || '-'}\tcwd=${cwd || '-'}\t${extra}\n`;
  appendFileSync(overrideLogPath(seat), line, 'utf8');
  return { seat, path: overrideLogPath(seat) };
}
