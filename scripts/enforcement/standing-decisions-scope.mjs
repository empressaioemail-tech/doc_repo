#!/usr/bin/env node
/**
 * standing-decisions-scope.mjs — the shared preamble carries fleet-wide rulings only.
 *
 * WHY. Every compiled dispatch opens with the CANON-PREAMBLE, the STANDING DECISIONS block of
 * _STATE.md. Measured 2026-09-10 and again 2026-09-11: nineteen of twenty-six lines a Property
 * Explorer lane received were SmartCity Dashboards (G-xx) and Factory (F-xx) program law it
 * could not use, at ~8 KB per dispatch, and the fix was recommended and never rowed. Program
 * law belongs in `_catalog/program_preambles/<PROGRAM>.md`, which the compiler attaches by row
 * membership (plan_registry.json `programs`).
 *
 * THE RULE, as a check with two independent inputs: a shared standing-decision bullet may not
 * name a plan row id (`G-12`, `F-16`, `R-3`, `P-151`) and may not name a program preamble's own
 * program as its scope. A ruling that needs a row id to be stated is program law.
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?  scripts/state/generate-combined.mjs imports check() and refuses to
 *                           write _STATE.md while a violation exists.
 *   2. What triggers it?    every regeneration of _STATE.md, which every dispatch compile reads.
 *   3. What fails?          generate-combined exits 1 and names the offending lines; the stale
 *                           _STATE.md stays, and check-generated.mjs reports the drift.
 *   4. What bypasses it?    hand-editing _STATE.md (forbidden; check-generated catches drift) and
 *                           a dispatch compiled from a stale _STATE.md that predates the rule.
 *
 *   node scripts/enforcement/standing-decisions-scope.mjs --self-test
 */

/** A plan-row id from any registered plan: P-, G-, R-, F- followed by one to four digits. */
export const ROW_ID = /\b[PGRF]-\d{1,4}\b/;
/** The trailer line that points at the detail; it is not a ruling and is exempt. */
const TRAILER = /^- Full standing-decisions detail:/;

/**
 * Pure check over the shared file text. Returns [] when clean; otherwise one entry per
 * offending bullet with the row ids it names.
 */
export function check(sharedText) {
  const out = [];
  const lines = String(sharedText).replace(/\r\n/g, "\n").split("\n");
  lines.forEach((line, i) => {
    if (!line.startsWith("- ") || TRAILER.test(line)) return;
    const ids = line.match(new RegExp(ROW_ID.source, "g"));
    if (ids) out.push({ line: i + 1, ids: [...new Set(ids)], head: line.slice(2, 70) });
  });
  return out;
}

export function render(violations) {
  return (
    "STANDING-DECISIONS SCOPE: the shared preamble carries fleet-wide rulings only. " +
    "These bullets name plan rows and belong in _catalog/program_preambles/<PROGRAM>.md:\n" +
    violations.map((v) => `  line ${v.line}: ${v.head}...  names ${v.ids.join(", ")}`).join("\n") +
    "\n"
  );
}

export function selfTest() {
  let failures = 0;
  const ok = (name, cond, detail = "") => { console.log(`  ${cond ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); if (!cond) failures++; };
  console.log("standing-decisions-scope self-test");
  ok("clean fleet-wide bullets pass", check("- COTALITY IS EXTINGUISHED — never rotate.\n- DEPLOYS ARE PLANNER-OWNED — fix it.\n- Full standing-decisions detail: `MEMORY.md`").length === 0);
  ok("a G-row bullet is caught", check("- G-45 SMARTSITE STAFF MAP (CLOSED) — embed.").length === 1);
  ok("an F-row inside prose is caught", check("- THE FACTORY — runner is F-02; next card F-16.").some((v) => v.ids.includes("F-02") && v.ids.includes("F-16")));
  ok("a P-row is caught", check("- SOMETHING — see P-151 for detail.").length === 1);
  ok("a non-bullet line is ignored", check("## STANDING DECISIONS\nG-45 in a heading\n").length === 0);
  ok("the trailer is exempt even if it named a row", check("- Full standing-decisions detail: P-1 `MEMORY.md`").length === 0);
  ok("not vacuous: an empty file passes and a violating file fails", check("").length === 0 && check("- X — R-3 applies.").length === 1);
  ok("a hyphenated word is not a row id", check("- CODE-DONE != CUSTOMER-DONE — a grade is a live probe.").length === 0);
  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

if (process.argv.includes("--self-test")) process.exit(selfTest() === 0 ? 0 : 1);
