#!/usr/bin/env node
/**
 * CI enforcement ratchet.
 *
 * WHY THIS EXISTS. The first version of .github/workflows/enforcement.yml ran the
 * not-yet-graduated controls under `continue-on-error: true`. That sets step.conclusion to
 * success even when the command exits non-zero, so `gh run view` rendered a run green while
 * cited-untracked was exiting 2 and doc-staleness was exiting 1. That is the same false
 * green as TW-74 (protection present is not checks required), reproduced inside the
 * workflow written to catch that class.
 *
 * A control that is allowed to fail forever is not a control. A control whose failure is
 * allowed to GET WORSE is not even a measurement. This is the ratchet: every control has a
 * recorded baseline exit code, and the job fails if any control does worse than its
 * baseline or if a new control starts failing. Known debt is permitted and pinned. New debt
 * is not.
 *
 * Improvement is reported loudly and does not fail, but it does tell you to tighten the
 * baseline, because a stale-loose baseline silently re-admits the defect it recorded.
 *
 * Read-only. Runs each control as a subprocess and reports. Writes nothing except stdout
 * and, when present, the GitHub step summary.
 */

import { spawnSync } from "node:child_process";
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const BASELINE_PATH = join(ROOT, ".github", "enforcement-baseline.json");

if (!existsSync(BASELINE_PATH)) {
  console.error(`REFUSING: baseline not found at ${BASELINE_PATH}`);
  console.error("A ratchet with no baseline admits everything. That is worse than no ratchet.");
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
const controls = baseline.controls;

if (!Array.isArray(controls) || controls.length === 0) {
  console.error("REFUSING: baseline declares no controls.");
  process.exit(1);
}

const results = [];
let regressed = 0;
let improved = 0;
let missing = 0;
let starvedEnv = 0;

for (const c of controls) {
  const scriptPath = join(ROOT, c.script);

  // An absent script must never read as a pass. This is the check that would have caught
  // a control being deleted or renamed out from under the workflow.
  if (!existsSync(scriptPath)) {
    results.push({ ...c, actual: null, verdict: "MISSING" });
    missing += 1;
    continue;
  }

  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 300_000,
  });

  // A timeout or a spawn failure is not a zero. Never collapse unmeasured into pass.
  const actual = run.error ? null : run.status;
  let verdict;
  if (actual === null) {
    verdict = "UNMEASURED";
    missing += 1;
  } else if (c.environmentStarved && !(c.starvationNote && c.graduationItem)) {
    // The exemption is not free. environmentStarved suppresses a regression, so an agent
    // could set it to buy a green. It is honoured ONLY when the entry also carries the
    // evidence (starvationNote) and the way out (graduationItem). Without both, the flag is
    // treated as an unjustified exemption and fails.
    verdict = "UNJUSTIFIED-EXEMPTION";
    regressed += 1;
  } else if (c.environmentStarved && actual > c.baselineExit) {
    // DECLARED degradation, never silent. The control cannot fire where it gates (CI), and
    // its local exit reflects working-tree noise rather than the thing it claims to measure.
    // It is printed loudly and does not count as a regression, because a regression it cannot
    // have. This is NOT continue-on-error: that hid a failing control; this names one, with
    // the reason and the graduation item carried in the baseline entry.
    verdict = "STARVED-ENV";
    starvedEnv += 1;
  } else if (actual > c.baselineExit) {
    verdict = "REGRESSED";
    regressed += 1;
  } else if (actual < c.baselineExit) {
    verdict = "IMPROVED";
    improved += 1;
  } else {
    verdict = actual === 0 ? "PASS" : "KNOWN-DEBT";
  }
  results.push({ ...c, actual, verdict });
}

const pad = (s, n) => String(s).padEnd(n);
const lines = [];
lines.push("");
lines.push("ENFORCEMENT RATCHET");
lines.push(`snapshot: ${baseline.snapshot ?? "(none declared)"}`);
lines.push("");
lines.push(`${pad("control", 30)} ${pad("tier", 10)} ${pad("baseline", 9)} ${pad("actual", 7)} verdict`);
lines.push("-".repeat(78));
for (const r of results) {
  lines.push(
    `${pad(r.name, 30)} ${pad(r.tier, 10)} ${pad(r.baselineExit, 9)} ${pad(r.actual ?? "n/a", 7)} ${r.verdict}`,
  );
}
lines.push("");
lines.push(`regressed=${regressed}  improved=${improved}  unmeasured/missing=${missing}  starved-by-environment=${starvedEnv}`);

if (improved > 0) {
  lines.push("");
  lines.push("IMPROVED controls are not a pass to ignore. Tighten .github/enforcement-baseline.json");
  lines.push("to the new exit code, or the ratchet silently re-admits the defect it just recorded.");
}
if (regressed > 0) {
  lines.push("");
  lines.push("FAIL: a control did worse than its recorded baseline. This is new debt, not old debt.");
}
if (starvedEnv > 0) {
  lines.push("");
  lines.push("STARVED-ENV: a control cannot fire in the environment that gates it. Its green there");
  lines.push("means nothing. It is declared here rather than hidden, and each carries a");
  lines.push("graduationItem naming the semantic change that would let it fail. Do not read these");
  lines.push("as passing.");
}
if (missing > 0) {
  lines.push("");
  lines.push("FAIL: a control could not be measured. Absent is not zero and must never read as a pass.");
}

const out = lines.join("\n");
console.log(out);

if (process.env.GITHUB_STEP_SUMMARY) {
  const md = [
    "### Enforcement ratchet",
    "",
    `snapshot \`${baseline.snapshot ?? "none"}\``,
    "",
    "| control | tier | baseline | actual | verdict |",
    "|---|---|---:|---:|---|",
    ...results.map((r) => `| ${r.name} | ${r.tier} | ${r.baselineExit} | ${r.actual ?? "n/a"} | ${r.verdict} |`),
    "",
    `regressed **${regressed}** · improved **${improved}** · unmeasured **${missing}** · starved-by-env **${starvedEnv}**`,
  ].join("\n");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
}

process.exit(regressed > 0 || missing > 0 ? 1 : 0);
