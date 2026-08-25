#!/usr/bin/env node
/**
 * FLEET MEMORY TRAVEL — compiled dispatches must carry the verbatim M0 block.
 *
 * THE DEFECT. The 2026-08-08 memory-system audit found 0 compiled dispatches carried
 * the paste-ready FLEET MEMORY (M0) block from 90_runbooks/fleet_memory_practice.md.
 * The practice said "paste verbatim into every sprint dispatch." The compiler emitted
 * CANON-PREAMBLE + AGENT-CONTRACT + DEV-PROCESS and stopped. A document in a folder
 * is the 0-for-3 control shape.
 *
 * This file self-tests the extract + gate predicates in both directions before it
 * reads live sources. A check observed only passing has not been observed working.
 *
 * Run: node scripts/enforcement/fleet-memory-travel.test.mjs
 */

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PRACTICE = join(ROOT, "90_runbooks", "fleet_memory_practice.md");
const COMPILER = join(ROOT, "scripts", "dispatch.mjs");
const GATE = join(ROOT, ".claude", "hooks", "canon-gate.ps1");

function extractM0Block(practiceText) {
  const fence = practiceText.match(
    /cc-agent dispatch rule block[^\n]*\r?\n\r?\n```\r?\n([\s\S]*?)\r?\n```/,
  );
  if (!fence) return null;
  return fence[1].replace(/\r\n/g, "\n").trim();
}

function stripFleetMarker(text) {
  return text.replace(/^<!-- FLEET-MEMORY v[a-f0-9]{8} [^\n]*-->\r?\n/m, "");
}

function fleetHashOf(practiceText) {
  return createHash("sha256").update(stripFleetMarker(practiceText), "utf8").digest("hex").slice(0, 8);
}

function hasFleetMarker(text, hash) {
  return new RegExp(String.raw`FLEET-MEMORY v${hash}`).test(text);
}

function hasVerbatimM0(text) {
  return /FLEET MEMORY \(M0\):/.test(text);
}

function gateWouldRefuse(text, hash) {
  return !hasFleetMarker(text, hash) || !hasVerbatimM0(text);
}

const M0_FIXTURE =
  "FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.";

const HASH_FIXTURE = "deadbeef";
const COMPILED_SHAPE = [
  "CANON-PREAMBLE vaaaaaaaa",
  "You are a BUILD EXECUTOR working in P:\\hauska-engine.",
  "repo: hauska-engine",
  "AGENT-CONTRACT vbbbbbbbb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full.",
  `FLEET-MEMORY v${HASH_FIXTURE} — you are bound by 90_runbooks/fleet_memory_practice.md (M0).`,
  "",
  M0_FIXTURE,
  "",
  "PLAN-ROW: P-73",
].join("\n");

const STRIPPED = COMPILED_SHAPE.replace(M0_FIXTURE, "").replace(
  `FLEET-MEMORY v${HASH_FIXTURE} — you are bound by 90_runbooks/fleet_memory_practice.md (M0).\n\n`,
  "",
);

const HASH_ONLY = COMPILED_SHAPE.replace(M0_FIXTURE, "");

const selfTests = [
  ["predicate accepts compiled text with marker and block", () => gateWouldRefuse(COMPILED_SHAPE, HASH_FIXTURE) === false],
  ["predicate refuses compiled text minus the block", () => gateWouldRefuse(STRIPPED, HASH_FIXTURE) === true],
  ["predicate refuses hash marker without the verbatim block", () => gateWouldRefuse(HASH_ONLY, HASH_FIXTURE) === true],
  ["predicate refuses empty text", () => gateWouldRefuse("", HASH_FIXTURE) === true],
  ["predicate is not vacuous on a heading-only stub", () => gateWouldRefuse("## FLEET MEMORY (M0)\n", HASH_FIXTURE) === true],
  ["extract returns the fenced M0 line from a practice fixture", () => {
    const fake = [
      "cc-agent dispatch rule block (paste verbatim into every sprint dispatch):",
      "",
      "```",
      M0_FIXTURE,
      "```",
      "",
    ].join("\n");
    return extractM0Block(fake) === M0_FIXTURE;
  }],
  ["extract returns null when the fence is absent", () => extractM0Block("# no block here\n") === null],
];

const results = [];
let failed = 0;
for (const [name, fn] of selfTests) {
  let ok = false;
  try {
    ok = fn();
  } catch {
    ok = false;
  }
  results.push({ name, ok });
  if (!ok) failed += 1;
}

if (!existsSync(PRACTICE) || !existsSync(COMPILER) || !existsSync(GATE)) {
  console.error("REFUSING: practice, compiler, or canon-gate missing.");
  process.exit(1);
}

const practice = readFileSync(PRACTICE, "utf8");
const compiler = readFileSync(COMPILER, "utf8");
const gate = readFileSync(GATE, "utf8");
const liveM0 = extractM0Block(practice);
const liveHash = fleetHashOf(practice);

const liveChecks = [
  ["practice fence is the verbatim M0 install", () => liveM0 === M0_FIXTURE],
  ["practice marker hash matches the body", () => {
    const m = practice.match(/FLEET-MEMORY v([a-f0-9]{8})/);
    return Boolean(m) && m[1] === liveHash;
  }],
  ["compiler extracts the fenced M0 block", () => /cc-agent dispatch rule block/.test(compiler) && /m0Block/.test(compiler)],
  ["compiler emits FLEET-MEMORY v and the verbatim block", () => /FLEET-MEMORY v\$\{fleetHash\}/.test(compiler) && /\$\{m0Block\}/.test(compiler)],
  ["canon-gate reads FLEET-MEMORY hash from the practice file", () => /function Get-FleetMemoryHash/.test(gate) && /fleet_memory_practice\.md/.test(gate)],
  ["canon-gate refuses a missing FLEET-MEMORY marker", () => /CANON GATE \(M6\): dispatch missing or stale FLEET-MEMORY/.test(gate)],
  ["canon-gate refuses a missing verbatim M0 block", () => /FLEET MEMORY \\\(M0\\\):/.test(gate)],
];

for (const [name, fn] of liveChecks) {
  let ok = false;
  try {
    ok = fn();
  } catch {
    ok = false;
  }
  results.push({ name, ok });
  if (!ok) failed += 1;
}

console.log("\nFLEET MEMORY TRAVEL\n");
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
}
console.log("");
if (failed) {
  console.log(`FAIL: ${failed} of ${results.length} checks`);
  process.exit(1);
}
console.log(`PASS: ${results.length} checks (M0 hash ${liveHash})`);
process.exit(0);
