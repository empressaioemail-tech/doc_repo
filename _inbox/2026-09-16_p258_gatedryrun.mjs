#!/usr/bin/env node
/** Dry-run both pre-commit gates over the staged close, so the commit is not the first test. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { evaluate as probeEvaluate } from "../scripts/enforcement/probe-close-gate.mjs";
import { evaluateStaged as fanEvaluateStaged, findDispatch } from "../scripts/enforcement/fan-depth-gate.mjs";

const root = "P:/seat-worktrees/p258-setback-campaign/doc_repo";
const read = (rel) => { try { return readFileSync(join(root, rel), "utf8"); } catch { return null; } };
const staged = ["_inbox/2026-09-16_p258-setback-campaign_close.json"];

const p = probeEvaluate(staged, read);
console.log("PROBE CLOSE GATE:", p.block ? "BLOCK" : "ALLOW");
if (p.message) console.log(p.message);

const f = fanEvaluateStaged(staged, read, (lane) => { const path = findDispatch(lane, root); return path ? readFileSync(path, "utf8") : null; });
console.log("\nFAN-DEPTH GATE:", f.block ? "BLOCK" : "ALLOW");
for (const r of f.results) console.log(`  ${r.gated ? "gated" : "not gated"} ok=${r.ok} :: ${r.reason}`);
if (f.message) console.log(f.message);

process.exitCode = p.block || f.block ? 1 : 0;
