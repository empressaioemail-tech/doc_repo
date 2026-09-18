#!/usr/bin/env node
/**
 * CURSOR GATE ADAPTER. One translation layer so the eleven existing Claude Code gates run on
 * Cursor unmodified, instead of being forked into Cursor-shaped copies that would drift.
 *
 *   node .cursor/hooks/run-gate.mjs <node|powershell> <repo-relative script> [args...]
 *
 * It reads the Cursor payload from stdin, normalizes it with normalize-payload.mjs, runs the
 * named gate with that normalized payload on ITS stdin, and translates the gate's verdict back
 * into the JSON shape Cursor expects. The gate files themselves are not edited, which is the
 * point: one copy of each rule, two harnesses.
 *
 * VERDICT MAPPING. Every gate in this repo exits 0 for allow and 2 for block, and writes its
 * block reason as a `{"block": true, "message": "..."}` line on stderr. That is the contract:
 *   exit 2, or a block line  -> deny, reason passed through
 *   exit 0                   -> allow, and any non-block stderr is passed on as agent_message
 *   anything else            -> allow, with the failure DECLARED on agent_message
 *
 * The last case is the interesting one. A gate that cannot run must not read as a pass, and
 * this is the class ENFORCEMENT.md names explicitly: a hook that cannot run and silently
 * passes is the defect. Cursor gives a hook no channel other than its own output, so the
 * declaration is put in front of the agent rather than into a log nobody reads. That is
 * strictly more visible than the Claude-side behaviour, which prints to a stderr the agent
 * often never sees.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePayload } from './normalize-payload.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.exit(0);
}

function allow(agentMessage) {
  const out = { permission: 'allow' };
  if (agentMessage) out.agent_message = agentMessage;
  emit(out);
}

function deny(message) {
  emit({ permission: 'deny', user_message: message, agent_message: message });
}

/** Pull the last `{"block": true, "message": "..."}` object out of a stderr stream. Scans
 *  rather than regexes the whole blob so a gate that prints a stack trace before its verdict
 *  still has its verdict read. */
function blockMessage(stderr) {
  let found = null;
  for (const line of String(stderr).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{') || !trimmed.includes('"block"')) continue;
    try {
      const obj = JSON.parse(trimmed);
      if (obj && obj.block === true && typeof obj.message === 'string') found = obj.message;
    } catch {
      // A line that starts like a block verdict and does not parse is not one. Keep scanning;
      // the exit code still carries the verdict.
    }
  }
  return found;
}

/** Stderr the gate wrote that is NOT its block verdict: warnings and self-declared failures. */
function advisoryText(stderr) {
  const kept = [];
  for (const line of String(stderr).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('{') && trimmed.includes('"block"')) continue;
    kept.push(trimmed);
  }
  return kept.join('\n');
}

const [runner, script, ...gateArgs] = process.argv.slice(2);

if (!runner || !script) {
  deny('run-gate.mjs was registered without a runner and a script. This is a configuration defect in .cursor/hooks.json, not a policy denial.');
}

const scriptPath = join(ROOT, script);

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  raw = '';
}

const normalized = normalizePayload(raw);

if (!normalized.ok) {
  // Fail open, declared. The gate could not be given a payload, so it made no decision, and a
  // decision that was never made must not be reported as one.
  allow(
    `CURSOR GATE ADAPTER: ${script} did not run. The hook payload could not be normalized ` +
      `(shape=${normalized.shape}: ${normalized.notes.join('; ')}). Allowed, not passed: ` +
      `this gate made no decision on this call.`,
  );
}

const run =
  runner === 'powershell'
    ? spawnSync(
        'powershell',
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, ...gateArgs],
        { cwd: ROOT, input: JSON.stringify(normalized.payload), encoding: 'utf8', timeout: 60_000 },
      )
    : spawnSync(process.execPath, [scriptPath, ...gateArgs], {
        cwd: ROOT,
        input: JSON.stringify(normalized.payload),
        encoding: 'utf8',
        timeout: 60_000,
      });

const stderr = run.stderr || '';
const message = blockMessage(stderr);

if (run.error) {
  allow(
    `CURSOR GATE ADAPTER: ${script} could not be executed (${run.error.message}). ` +
      `Allowed, not passed: this gate made no decision on this call.`,
  );
}

if (run.status === 2 || message) {
  deny(message || advisoryText(stderr) || `${script} refused this call with exit ${run.status}.`);
}

if (run.status !== 0) {
  allow(
    `CURSOR GATE ADAPTER: ${script} exited ${run.status}, which is not the 0-or-2 contract. ` +
      `Allowed, not passed: this gate made no decision on this call.` +
      (advisoryText(stderr) ? `\nGate output: ${advisoryText(stderr)}` : ''),
  );
}

allow(advisoryText(stderr) || undefined);
