#!/usr/bin/env node
/**
 * HARNESS PARITY CONTROL. Enumerates the hook registrations in .claude/settings.json and
 * .cursor/hooks.json and refuses when the two harnesses do not carry the same gates.
 *
 * WHY THIS EXISTS. On 2026-09-18 the fleet ran eleven gates on Claude Code and one on Cursor,
 * while AGENTS.md told every agent that "the canon-gate hook blocks anything missing the
 * compiled markers". A Cursor agent read that and believed it. R-04's control census counted
 * zero armed register consumers and marked the four instruction .mdc vehicles UNENFORCED, but
 * nothing compared the two harnesses, so the size of the gap was not a number anyone could
 * read. This is that number.
 *
 * THE SECOND CHECK IS THE IMPORTANT ONE. Registering a `.claude/hooks/*` script directly in
 * `.cursor/hooks.json` produces a gate that loads, runs, decides nothing, and reports success,
 * because the payload shapes differ (see .cursor/hooks/normalize-payload.mjs for the three
 * concrete places). So this control does not merely ask whether a gate is REGISTERED on
 * Cursor; it asks whether it is registered THROUGH the translator. A registration that skips
 * run-gate.mjs is reported as a bypass even though the gate counts as present. A presence
 * shaped check would pass it.
 *
 *   node scripts/enforcement/harness-parity.mjs
 *   node scripts/enforcement/harness-parity.mjs --self-test
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Claude gates that genuinely have no Cursor counterpart, each with the reason. An entry here
 *  is a claim that the state is unreachable on Cursor, not a convenience. Empty is the normal
 *  state and the goal; every entry that appears has to be defended. */
export const EXCLUSIONS = [
  // Example of the shape, kept commented so the mechanism is visible without asserting a gap:
  // { gate: 'canon-divergence-run', reason: 'Cursor beforeReadFile cannot block a read.' },
];

const RUN_GATE = 'run-gate.mjs';

/** Pull the gate identity out of a hook command string.
 *  Identity is script basename plus its arguments, so the same gate under two harnesses with
 *  different runners and different path styles compares equal. */
export function gateIdentity(command) {
  if (typeof command !== 'string' || !command.trim()) return null;
  const relay = command.match(/run-gate\.mjs\s+(\S+)\s+(\S+)([\s\S]*)$/);
  if (relay) {
    const script = relay[2].replace(/^"|"$/g, '');
    const args = relay[3].trim();
    return { key: `${basename(script).replace(/\.[^.]+$/, '')}${args ? '#' + args.split(/\s+/).join(' ') : ''}`, script, viaRelay: RUN_GATE };
  }
  const fileForm = command.match(/-File\s+("[^"]+"|\S+)/i);
  const nodeForm = command.match(/\bnode\s+("[^"]+"|\S+\.mjs)/i);
  const script = (fileForm?.[1] ?? nodeForm?.[1] ?? '').replace(/^"|"$/g, '');
  if (!script) return null;
  const rest = command.slice(command.indexOf(script) + script.length).trim();
  const head = script.split(/[\\/]/).slice(0, -1).join('/');
  return {
    key: `${basename(script).replace(/\.[^.]+$/, '')}${rest ? '#' + rest.split(/\s+/).join(' ') : ''}`,
    script,
    viaRelay: null,
    head,
  };
}

/** A `.claude/hooks/*` target registered on Cursor without the translator is a bypass: the
 *  gate will run and decide nothing. `.cursor/hooks/*` scripts parse both payload shapes
 *  natively and are exempt by construction. */
export function bypassedRegistrations(cursorRegs) {
  const out = [];
  for (const r of cursorRegs) {
    const id = gateIdentity(r.command);
    if (!id) continue;
    const targetsClaudeHookDir = /(^|\/)\.claude\/hooks\//.test(id.script.replace(/\\/g, '/'));
    if (targetsClaudeHookDir && id.viaRelay !== RUN_GATE) {
      out.push({ command: r.command, event: r.event, script: id.script });
    }
  }
  return out;
}

/**
 * WHERE A GATE FIRES, not only whether it is registered.
 *
 * Identity parity alone is a scope defect: a gate registered on both harnesses but narrowed on
 * one of them reads as parity while a whole tool class goes unchecked. The live example is real
 * rather than theoretical. Claude runs canon-gate and dispatch-template-gate on matcher
 * `Agent|Write`; Cursor runs them on `Write|StrReplace|Task`. Those happen to be equal-or-wider
 * on Cursor, but nothing in this file checked that, so the next person to trim a Cursor matcher
 * would have been told the harnesses were at parity.
 *
 * `Agent` maps to `Task`: Claude names its sub-agent launch tool Agent, Cursor names it Task.
 * That rename is the same one normalize-payload.mjs performs, and it is the only tool-name
 * translation between the harnesses.
 */
const TOOL_ALIAS = { Agent: 'Task' };

export function claudeSide(reg) {
  const m = reg.matcher;
  if (m === 'Bash') return { kind: 'shell', tokens: null, source: 'matcher Bash' };
  if (m === 'Read') return { kind: 'read', tokens: null, source: 'matcher Read' };
  const raw = String(m ?? '').split('|').map((s) => s.trim()).filter(Boolean);
  return { kind: 'tool', tokens: raw.length ? raw.map((t) => TOOL_ALIAS[t] ?? t) : null, source: `matcher ${m ?? '(none)'}` };
}

export function cursorSide(reg) {
  const e = reg.event;
  if (e === 'beforeShellExecution') return { kind: 'shell', tokens: null, source: e };
  if (e === 'beforeReadFile') return { kind: 'read', tokens: null, source: e };
  if (e === 'preToolUse') {
    const raw = String(reg.matcher ?? '').split('|').map((s) => s.trim()).filter(Boolean);
    return { kind: 'tool', tokens: raw.length ? raw : null, source: `preToolUse ${reg.matcher ?? '(no matcher)'}` };
  }
  return { kind: e, tokens: null, source: e };
}

/** True when the Cursor side fires everywhere the Claude side does. A null token set is a
 *  wildcard for that event kind. */
export function covers(cursor, claude) {
  if (cursor.kind !== claude.kind) return false;
  if (claude.tokens === null) return cursor.tokens === null;
  if (cursor.tokens === null) return true;
  return claude.tokens.every((t) => cursor.tokens.includes(t));
}

export function matcherGaps(claudeRegs, cursorRegs) {
  const claudeById = new Map();
  for (const r of claudeRegs) {
    const id = gateIdentity(r.command);
    if (!id) continue;
    if (!claudeById.has(id.key)) claudeById.set(id.key, []);
    claudeById.get(id.key).push(claudeSide(r));
  }
  const cursorById = new Map();
  for (const r of cursorRegs) {
    const id = gateIdentity(r.command);
    if (!id) continue;
    if (!cursorById.has(id.key)) cursorById.set(id.key, []);
    cursorById.get(id.key).push(cursorSide(r));
  }
  const excused = new Set(EXCLUSIONS.map((e) => e.gate));
  const out = [];
  for (const [key, cSides] of claudeById) {
    if (excused.has(key) || excused.has(key.split('#')[0])) continue;
    const kSides = cursorById.get(key);
    if (!kSides) continue; // an absent registration is already reported as a GAP
    for (const cs of cSides) {
      if (!kSides.some((ks) => covers(ks, cs))) {
        out.push({
          gate: key,
          claudeSide: cs.source,
          claudeTokens: cs.tokens ? cs.tokens.join('|') : '(all)',
          cursorSides: kSides.map((k) => `${k.source} [${k.tokens ? k.tokens.join('|') : 'all'}]`).join(', '),
        });
      }
    }
  }
  return out;
}

export function analyze(claudeRegs, cursorRegs) {
  const claudeKeys = new Set();
  for (const r of claudeRegs) {
    const id = gateIdentity(r.command);
    if (id) claudeKeys.add(id.key);
  }
  const cursorKeys = new Set();
  for (const r of cursorRegs) {
    const id = gateIdentity(r.command);
    if (id) cursorKeys.add(id.key);
  }
  const excused = new Set(EXCLUSIONS.map((e) => e.gate));
  const gaps = [...claudeKeys].filter((k) => !cursorKeys.has(k) && !excused.has(k) && !excused.has(k.split('#')[0]));
  const extras = [...cursorKeys].filter((k) => !claudeKeys.has(k));
  const bypasses = bypassedRegistrations(cursorRegs);
  const uncovered = matcherGaps(claudeRegs, cursorRegs);
  return { claudeCount: claudeKeys.size, cursorCount: cursorKeys.size, gaps, extras, bypasses, uncovered };
}

function readRegistrations() {
  const claude = [];
  for (const rel of ['.claude/settings.json', '.claude/settings.local.json']) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) continue;
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    for (const [event, groups] of Object.entries(cfg.hooks ?? {})) {
      for (const g of groups) {
        for (const h of g.hooks ?? []) {
          if (h.command) claude.push({ event, matcher: g.matcher ?? null, command: h.command });
        }
      }
    }
  }
  const p = join(ROOT, '.cursor/hooks.json');
  const cursor = [];
  if (existsSync(p)) {
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    for (const [event, groups] of Object.entries(cfg.hooks ?? {})) {
      for (const g of groups) {
        if (g.command) cursor.push({ event, matcher: g.matcher ?? null, command: g.command });
      }
    }
  }
  return { claude, cursor };
}

function selfTest() {
  const out = [];
  const t = (name, cond) => out.push({ name, ok: Boolean(cond) });

  const claude = [
    { event: 'PreToolUse', command: 'powershell -NoProfile -ExecutionPolicy Bypass -File P:/doc_repo/.claude/hooks/canon-gate.ps1' },
    { event: 'PreToolUse', command: 'node P:/doc_repo/.claude/hooks/fan-depth-gate.mjs commit' },
    { event: 'PreToolUse', command: 'node P:/doc_repo/.cursor/hooks/seat-gate.mjs write' },
  ];

  // Both harnesses carry the same three gates: no gap.
  const parity = [
    { event: 'preToolUse', command: 'node .cursor/hooks/run-gate.mjs powershell .claude/hooks/canon-gate.ps1' },
    { event: 'beforeShellExecution', command: 'node .cursor/hooks/run-gate.mjs node .claude/hooks/fan-depth-gate.mjs commit' },
    { event: 'preToolUse', command: 'node .cursor/hooks/seat-gate.mjs write' },
  ];
  const ok = analyze(claude, parity);
  t('1 identical sets produce no gaps', ok.gaps.length === 0);
  t('2 identical sets produce no bypasses', ok.bypasses.length === 0);
  t('3 the two runners resolve to the same identity', gateIdentity('powershell -File P:/doc_repo/.claude/hooks/canon-gate.ps1').key === gateIdentity('node .cursor/hooks/run-gate.mjs powershell .claude/hooks/canon-gate.ps1').key);

  // VIOLATION 1: a gate present on Claude and absent on Cursor is reported, not ignored.
  const missing = analyze(claude, parity.filter((r) => !r.command.includes('canon-gate')));
  t('4 VIOLATION a gate missing from Cursor is reported as a gap', missing.gaps.includes('canon-gate'));

  // VIOLATION 2: the registration exists but skips the translator.
  const direct = analyze(claude, [
    { event: 'preToolUse', command: 'powershell -NoProfile -ExecutionPolicy Bypass -File .claude/hooks/canon-gate.ps1' },
    ...parity.slice(1),
  ]);
  t('5 VIOLATION a direct .claude/hooks registration is reported as a bypass even though the gate is present', direct.bypasses.length === 1);
  t('6 and the bypass is NOT silently counted as parity', !direct.gaps.includes('canon-gate'));

  // A .cursor/hooks script needs no translator and must not be flagged.
  const native = analyze(claude, parity);
  t('7 .cursor/hooks scripts are exempt from the translator requirement', native.bypasses.length === 0);

  // MATCHER COVERAGE. Identity parity is not scope parity, so these cases pin the difference.
  const claudeMatched = [
    { event: 'PreToolUse', matcher: 'Agent|Write', command: 'powershell -File P:/doc_repo/.claude/hooks/canon-gate.ps1' },
    { event: 'PreToolUse', matcher: 'Bash', command: 'node P:/doc_repo/.claude/hooks/probe-close-gate.mjs' },
  ];
  const cursorMatched = [
    { event: 'preToolUse', matcher: 'Write|StrReplace|Task', command: 'node .cursor/hooks/run-gate.mjs powershell .claude/hooks/canon-gate.ps1' },
    { event: 'beforeShellExecution', matcher: null, command: 'node .cursor/hooks/run-gate.mjs node .claude/hooks/probe-close-gate.mjs' },
  ];
  t('8 equal-or-wider Cursor matchers are NOT reported', analyze(claudeMatched, cursorMatched).uncovered.length === 0);
  t('9 Agent maps to Task, so Agent|Write is covered by Write|StrReplace|Task',
    covers(cursorSide(cursorMatched[0]), claudeSide(claudeMatched[0])));

  const narrowed = analyze(claudeMatched, [
    { event: 'preToolUse', matcher: 'Write', command: 'node .cursor/hooks/run-gate.mjs powershell .claude/hooks/canon-gate.ps1' },
    cursorMatched[1],
  ]);
  t('10 VIOLATION a Cursor matcher narrowed to Write misses Task and is reported, though the gate IS registered', narrowed.uncovered.length === 1 && narrowed.gaps.length === 0);

  const wrongEvent = analyze(claudeMatched, [
    cursorMatched[0],
    { event: 'preToolUse', matcher: null, command: 'node .cursor/hooks/run-gate.mjs node .claude/hooks/probe-close-gate.mjs' },
  ]);
  t('11 VIOLATION a shell gate moved onto preToolUse is reported as uncovered', wrongEvent.uncovered.some((u) => u.gate === 'probe-close-gate'));

  const wildcardNarrowed = analyze(
    [{ event: 'PreToolUse', matcher: 'Bash', command: 'node P:/doc_repo/.claude/hooks/x.mjs' }],
    [{ event: 'beforeShellExecution', matcher: null, command: 'node .cursor/hooks/run-gate.mjs node .claude/hooks/x.mjs' }],
  );
  t('12 a Cursor event with no matcher is a wildcard and covers a shell gate', wildcardNarrowed.uncovered.length === 0);

  // Non-vacuity: the coverage predicate must be able to say no.
  t('13 the coverage predicate is not vacuous',
    covers({ kind: 'tool', tokens: ['Write'] }, { kind: 'tool', tokens: ['Task'] }) === false &&
    covers({ kind: 'shell', tokens: null }, { kind: 'shell', tokens: null }) === true &&
    covers({ kind: 'tool', tokens: null }, { kind: 'tool', tokens: ['Task'] }) === true);

  console.log('\nharness-parity self-test\n');
  for (const r of out) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`);
  const failed = out.filter((r) => !r.ok).length;
  console.log(`\n${out.length} checks, ${failed} failed`);
  return failed;
}

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() === 0 ? 0 : 1);
}

const { claude, cursor } = readRegistrations();
const { claudeCount, cursorCount, gaps, extras, bypasses, uncovered } = analyze(claude, cursor);

const lines = [];
lines.push('');
lines.push('HARNESS PARITY');
lines.push('');
lines.push(`  claude registrations: ${claudeCount} gate identities across ${claude.length} hook entries`);
lines.push(`  cursor registrations: ${cursorCount} gate identities across ${cursor.length} hook entries`);
for (const e of EXCLUSIONS) lines.push(`  excused: ${e.gate} (${e.reason})`);
if (extras.length) lines.push(`  cursor-only: ${extras.join(', ')}`);
if (bypasses.length) {
  lines.push('');
  lines.push('  BYPASS: registered on Cursor without run-gate.mjs. These gates will load, run,');
  lines.push('  decide nothing, and report success. Register them through run-gate.mjs instead.');
  for (const b of bypasses) lines.push(`    ${b.event}  ${b.script}  <- ${b.command}`);
}
if (gaps.length) {
  lines.push('');
  lines.push('  GAP: present on Claude Code and absent on Cursor.');
  for (const g of gaps) lines.push(`    ${g}`);
  lines.push('  Either register it on Cursor through run-gate.mjs, or add it to EXCLUSIONS with a');
  lines.push('  reason naming the state that is unreachable on Cursor.');
}
if (uncovered.length) {
  lines.push('');
  lines.push('  UNCOVERED: registered on both harnesses, but the Cursor side fires on a NARROWER');
  lines.push('  matcher. The gate is present and the tool class it was protecting is not.');
  for (const u of uncovered) {
    lines.push(`    ${u.gate}`);
    lines.push(`      claude: ${u.claudeSide} -> ${u.claudeTokens}`);
    lines.push(`      cursor: ${u.cursorSides}`);
  }
}
lines.push('');
const bad = gaps.length + bypasses.length + uncovered.length;
lines.push(`RESULT: ${bad === 0 ? 'PARITY (identity and matcher coverage)' : `FAIL (${gaps.length} gaps, ${bypasses.length} bypasses, ${uncovered.length} uncovered matchers)`}`);
console.log(lines.join('\n'));
process.exit(bad === 0 ? 0 : 1);
