#!/usr/bin/env node
/**
 * FAN-DEPTH GATE: a lane may launch sub-agents only as deep as its compiled dispatch allows.
 *
 * WHY THIS EXISTS. On 2026-09-16 the Texas scale-up research wave said, twice and in writing,
 * "lanes spawn nothing". Two of five lanes (L-B, L-C) launched sub-agents anyway. One of L-C's
 * stalled, and 61 session files went unread without anyone noticing (A-179). A rule stated as
 * a sentence was overridden twice on the day it was issued. The operator approved making it a
 * check, in two layers (A-181).
 *
 * THE RULE.
 *   - `scripts/dispatch.mjs` compiles a `FAN-DEPTH: <n>` line into every dispatch.
 *     n = 0 means "this lane launches no sub-agents". n = 1 means "this lane may launch
 *     sub-agents, and those launch none".
 *   - A close for a dispatch that carries the line must declare
 *     `"subAgents": {"spawned": <int>, "maxDepth": <int>}`.
 *   - The close is refused when a field is missing or not a non-negative integer, when
 *     maxDepth exceeds n, or when n is 0 and spawned is above 0.
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?  `.claude/hooks/fan-depth-gate.mjs`, in two modes:
 *        - commit: before `git commit` in doc_repo, over every staged close;
 *        - agent: before the Agent tool is used in a session whose worktree holds a lane
 *          claim.
 *   2. What triggers it?    A `git commit` (Bash matcher), and an Agent tool call (Agent matcher).
 *   3. What fails?          The commit or the Agent call is refused, with the reason.
 *   4. What bypasses it?    Named, because the answer is never none:
 *      - A close that declares `spawned: 0` falsely. The gate reads the declaration; it
 *        cannot see a Cursor session's sub-agents. A false declaration is a lie in a durable
 *        record, which the overseer's review is there to catch.
 *      - Cursor and any other harness that does not load `.claude/hooks`. Only the commit layer
 *        reaches their closes, and only when the close is committed in a Claude Code session.
 *      - Dispatches compiled before this gate existed. They carry no marker, so their closes
 *        are reported as not gated, never silently passed.
 *      - A commit made outside Claude Code, for example a plain terminal.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DOC_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MARKER = /^FAN-DEPTH:\s*(\S+)\s*$/m;

/** Returns null when the dispatch carries no marker, an integer when it does, NaN when malformed. */
export function parseFanDepth(dispatchText) {
  if (typeof dispatchText !== "string") return null;
  const m = dispatchText.match(MARKER);
  if (!m) return null;
  return /^\d+$/.test(m[1]) ? Number(m[1]) : NaN;
}

const isCount = (v) => Number.isInteger(v) && v >= 0;

/** Pure: evaluate one close against its dispatch text. */
export function evaluateClose(close, dispatchText) {
  const lane = close?.lane ?? "(no lane)";
  const depth = parseFanDepth(dispatchText);
  if (depth === null) return { ok: true, gated: false, lane, reason: "dispatch carries no FAN-DEPTH marker (compiled before the gate); not gated" };
  if (Number.isNaN(depth)) return { ok: false, gated: true, lane, reason: "dispatch FAN-DEPTH marker is malformed; refusing rather than guessing" };
  const sa = close?.subAgents;
  if (!sa || typeof sa !== "object") return { ok: false, gated: true, lane, reason: `close must declare subAgents {spawned, maxDepth}; the dispatch allows FAN-DEPTH ${depth}` };
  if (!isCount(sa.spawned) || !isCount(sa.maxDepth)) return { ok: false, gated: true, lane, reason: "subAgents.spawned and subAgents.maxDepth must be non-negative integers" };
  if (sa.spawned > 0 && sa.maxDepth === 0) return { ok: false, gated: true, lane, reason: "subAgents is self-contradictory: spawned > 0 with maxDepth 0" };
  if (sa.maxDepth > depth) return { ok: false, gated: true, lane, reason: `sub-agents reached depth ${sa.maxDepth}; the dispatch allows ${depth}` };
  if (depth === 0 && sa.spawned > 0) return { ok: false, gated: true, lane, reason: `the dispatch says spawn nothing (FAN-DEPTH 0) and the close declares ${sa.spawned} sub-agent(s)` };
  return { ok: true, gated: true, lane, reason: `within FAN-DEPTH ${depth}` };
}

/** Find the compiled dispatch for a lane: the newest `_dispatches/*_<lane>_dispatch.md`. */
export function findDispatch(lane, root = DOC_REPO) {
  if (!lane) return null;
  const dir = join(root, "_dispatches");
  if (!existsSync(dir)) return null;
  const want = `_${String(lane).toLowerCase()}_dispatch.md`;
  const hits = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(want)).sort();
  return hits.length ? join(dir, hits[hits.length - 1]) : null;
}

/** Evaluate every staged close. `read(rel)` returns text or null; `dispatchFor(lane)` returns text or null. */
export function evaluateStaged(stagedPaths, read, dispatchFor) {
  const results = [];
  for (const rel of stagedPaths) {
    if (!/^_inbox\/.+_close\.json$/.test(rel)) continue;
    const text = read(rel);
    if (text === null) continue; // a staged deletion
    let close;
    try { close = JSON.parse(text); } catch { results.push({ rel, ok: false, gated: true, reason: "close is not valid JSON" }); continue; }
    results.push({ rel, ...evaluateClose(close, dispatchFor(close?.lane)) });
  }
  const refused = results.filter((r) => !r.ok);
  return {
    block: refused.length > 0,
    results,
    message: refused.length
      ? "FAN-DEPTH GATE (A-181) refused the commit:\n" + refused.map((r) => `- ${r.rel}: ${r.reason}`).join("\n")
      : "",
  };
}

/** Agent mode: may this session launch a sub-agent? `claims` is the worktree's lane_claims.json. */
export function evaluateAgentLaunch(claims, dispatchFor, { inSubAgent = false } = {}) {
  const active = Object.values(claims?.claims ?? {});
  if (active.length === 0) return { ok: true, reason: "no lane claim in this worktree; not a lane session" };
  const depths = active.map((c) => ({ lane: c.lane, depth: parseFanDepth(dispatchFor(c.lane)) }));
  const known = depths.filter((d) => d.depth !== null);
  if (known.length === 0) return { ok: true, reason: "claimed lanes predate FAN-DEPTH; not gated" };
  if (known.some((d) => Number.isNaN(d.depth))) return { ok: false, reason: "a claimed lane's FAN-DEPTH marker is malformed" };
  const allowed = Math.max(...known.map((d) => d.depth));
  if (allowed === 0) return { ok: false, reason: `this worktree's claimed lane(s) ${known.map((d) => d.lane).join(", ")} say spawn nothing (FAN-DEPTH 0)` };
  if (inSubAgent && allowed <= 1) return { ok: false, reason: `a sub-agent may not launch another; the claimed dispatch allows FAN-DEPTH ${allowed}` };
  return { ok: true, reason: `within FAN-DEPTH ${allowed}` };
}

function selfTest() {
  const out = [];
  const t = (name, cond) => out.push({ name, ok: !!cond });
  const d0 = "PLAN-ROW: P-1\nFAN-DEPTH: 0\n";
  const d1 = "PLAN-ROW: P-1\nFAN-DEPTH: 1\n";
  const legacy = "PLAN-ROW: P-1\n";
  const bad = "FAN-DEPTH: many\n";
  const close = (spawned, maxDepth) => ({ lane: "x", subAgents: { spawned, maxDepth } });

  t("1 depth 0, nothing spawned: passes", evaluateClose(close(0, 0), d0).ok);
  t("2 VIOLATION depth 0, two spawned: refused", !evaluateClose(close(2, 1), d0).ok);
  t("3 depth 1, lanes one level deep: passes", evaluateClose(close(5, 1), d1).ok);
  t("4 VIOLATION depth 1, a lane's own sub-agents (depth 2): refused", !evaluateClose(close(6, 2), d1).ok);
  t("5 marker present, subAgents missing: refused", !evaluateClose({ lane: "x" }, d0).ok);
  t("6 legacy dispatch: passes but reported not gated", (() => { const r = evaluateClose({ lane: "x" }, legacy); return r.ok && r.gated === false; })());
  t("7 malformed marker: refused", !evaluateClose(close(0, 0), bad).ok);
  t("8 non-integer count: refused", !evaluateClose({ lane: "x", subAgents: { spawned: "0", maxDepth: 0 } }, d0).ok);
  t("9 self-contradictory declaration: refused", !evaluateClose(close(3, 0), d1).ok);
  t("10 dispatch not found (null) is not gated, not passed silently", evaluateClose({ lane: "x" }, null).gated === false);

  const staged = evaluateStaged(
    ["_inbox/2026-09-16_x_close.json", "scripts/a.mjs", "_inbox/2026-09-16_y_cp1.json"],
    (rel) => (rel.endsWith("_close.json") ? JSON.stringify(close(1, 1)) : "{}"),
    () => d0,
  );
  t("11 staged: only close files are read, and a depth-0 violation blocks", staged.block && staged.results.length === 1);

  const claims = (lane) => ({ claims: { [lane]: { lane, seat: "dispatch-planner" } } });
  t("12 agent: no claim, not a lane session: allowed", evaluateAgentLaunch({ claims: {} }, () => d0).ok);
  t("13 VIOLATION agent: a depth-0 lane launching: refused", !evaluateAgentLaunch(claims("lc2"), () => d0).ok);
  t("14 agent: a depth-1 planner launching a lane: allowed", evaluateAgentLaunch(claims("wave"), () => d1).ok);
  t("15 VIOLATION agent: a sub-agent inside a depth-1 wave launching: refused", !evaluateAgentLaunch(claims("wave"), () => d1, { inSubAgent: true }).ok);
  t("16 agent: a legacy claim is not gated", evaluateAgentLaunch(claims("old"), () => legacy).ok);

  for (const r of out) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const failed = out.filter((r) => !r.ok).length;
  console.log(failed ? `SELF-TEST FAILED (${failed})` : `SELF-TEST OK (${out.length})`);
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  if (process.argv.includes("--self-test")) selfTest();
  else {
    // Report mode: grade every close already on disk, so the gap is visible, not assumed.
    const inbox = join(DOC_REPO, "_inbox");
    const staged = readdirSync(inbox).filter((f) => f.endsWith("_close.json")).map((f) => `_inbox/${f}`);
    const r = evaluateStaged(staged, (rel) => readFileSync(join(DOC_REPO, rel), "utf8"), (lane) => { const p = findDispatch(lane); return p ? readFileSync(p, "utf8") : null; });
    const gated = r.results.filter((x) => x.gated);
    console.log(`closes ${r.results.length}, gated ${gated.length}, refused ${r.results.filter((x) => !x.ok).length}`);
  }
}
