#!/usr/bin/env node
/**
 * Cursor/Claude hook entry for SEAT-01.
 * Reads hook JSON on stdin, resolves the mutated worktree, calls evaluate.
 */
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { evaluate } from '../scripts/enforcement/seat-worktree-gate.mjs';
import { normalizePath } from '../scripts/enforcement/seat-register.mjs';

function gitToplevel(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return cwd;
  }
}

function gitBranch(cwd) {
  try {
    return execFileSync('git', ['branch', '--show-current'], {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function parsePayload(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function commandFrom(payload) {
  if (!payload || typeof payload !== 'object') return '';
  if (Array.isArray(payload) && payload[9]) {
    const ti = payload[9];
    if (Array.isArray(ti)) return String(ti[0] || '');
    return String(ti.command || '');
  }
  return String(payload.command || payload.tool_input?.command || '');
}

function cwdFrom(payload) {
  if (!payload || typeof payload !== 'object') return process.cwd();
  if (Array.isArray(payload) && payload[9]?.working_directory) return payload[9].working_directory;
  return payload.cwd || payload.tool_input?.working_directory || payload.working_directory || process.cwd();
}

function pathFrom(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const ti = Array.isArray(payload) ? payload[9] : payload.tool_input || payload;
  return ti?.path || ti?.file_path || payload.path || payload.file_path || '';
}

function isGitWrite(command) {
  return /\bgit\b[^&|;]*?\b(add|commit|push|restore\s+--staged|rm\s+--cached)\b/i.test(command || '');
}

const mode = process.argv[2] || 'shell';
let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  raw = '';
}
const payload = parsePayload(raw);
const command = commandFrom(payload);
const cwd = cwdFrom(payload);
const filePath = pathFrom(payload);

if (mode === 'shell' && command && !isGitWrite(command)) {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

const worktree = gitToplevel(filePath ? dirname(filePath) : cwd) || cwd;
const branch = gitBranch(worktree);
const paths = filePath ? [filePath] : [];
if (/\bgit\b[^&|;]*?\bcommit\b/i.test(command)) {
  try {
    const staged = execFileSync('git', ['diff', '--cached', '--name-only'], {
      cwd: worktree,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (staged) paths.push(...staged.split(/\r?\n/).filter(Boolean));
  } catch {
    /* index unreadable: evaluate without paths rather than fail-open on namespace */
  }
}
const result = evaluate({ worktree: normalizePath(worktree), branch, paths, command });

if (mode === 'session') {
  process.stdout.write(JSON.stringify({
    additional_context: result.allow
      ? `SEAT-01: seat=${result.seat} kind=${result.kind} worktree=${result.worktree} branch=${branch}. Load ENFORCEMENT.md. Declare this snapshot in your first output.`
      : `SEAT-01: this checkout is not a registered seat worktree. ${result.message}`,
  }));
  process.exit(0);
}

if (result.allow) {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

process.stdout.write(JSON.stringify({
  permission: 'deny',
  user_message: result.message,
  agent_message: result.message,
}));
process.stderr.write(JSON.stringify({ block: true, message: result.message }) + '\n');
process.exit(2);
