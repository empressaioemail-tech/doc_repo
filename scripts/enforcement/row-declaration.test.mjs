#!/usr/bin/env node
/**
 * ROW DECLARATION TEST.
 *
 * Asserts that the plan-row declaration predicate accepts declared baseline rows and
 * REJECTS row ids that appear nowhere, or that appear only in prose.
 *
 * WHY THIS FILE EXISTS RATHER THAN AN INLINE CHECK. On 2026-08-20 the planner verified this
 * with an inline shell one-liner whose backslashes were stripped, producing the regex
 *
 *     ^|s*R-99s*|
 *
 * which is an alternation containing an EMPTY branch and therefore matches every input. It
 * reported R-99 as a declared row and every other id as declared too. A check that cannot
 * fail reported success, and a commit message went out asserting the negative case had
 * passed. That is the governing defect of this repo appearing inside its own verification,
 * caused by shell quoting, which is exactly why a test belongs in a file.
 *
 * The predicate mirrors canon-gate.ps1: a row is real only when it is the FIRST CELL of its
 * own table row. It is deliberately not satisfied by a mention in prose. That distinction is
 * CTRL-1, whose 2026-08-14 fail-open let the literal string "G-9999", quoted inside an
 * amendment while documenting a bug, validate as a real row.
 *
 * This test self-tests in both directions. A test that only asserts the positive case is the
 * same shape as the defect it is here to prevent.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Mirrors canon-gate.ps1: `$planDoc -match "(?m)^\|\s*$rid\s*\|"` */
function isDeclaredRow(planText, rowId) {
  const escaped = rowId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(String.raw`^\|\s*` + escaped + String.raw`\s*\|`, "m").test(planText);
}

// Self-test the predicate before trusting it against real files. If the predicate is broken
// the way the shell one-liner was, these fixtures catch it and nothing downstream runs.
const FIX_POS = "| R-01 | Canon reconciliation | x | y | OPEN |";
const FIX_PROSE = "The amendment quotes R-9999 while documenting the CTRL-1 bug.";
const selfTests = [
  ["predicate accepts a declared table row", () => isDeclaredRow(FIX_POS, "R-01") === true],
  ["predicate rejects an id absent entirely", () => isDeclaredRow(FIX_POS, "R-99") === false],
  ["predicate rejects an id mentioned only in prose", () => isDeclaredRow(FIX_PROSE, "R-9999") === false],
  ["predicate is not vacuous (empty doc rejects)", () => isDeclaredRow("", "R-01") === false],
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
  results.push([ok, name]);
  if (!ok) failed += 1;
}

// Now the real plans, read from the registry so this cannot drift from what the gate uses.
const REG = join(ROOT, "_catalog", "plan_registry.json");
if (!existsSync(REG)) {
  console.error("REFUSING: plan registry not found. Absent is not a pass.");
  process.exit(1);
}
const registry = JSON.parse(readFileSync(REG, "utf8"));

for (const [planId, plan] of Object.entries(registry.plans)) {
  const path = join(ROOT, plan.file);
  if (!existsSync(path)) {
    results.push([false, `${planId} baseline file exists`]);
    failed += 1;
    continue;
  }
  const text = readFileSync(path, "utf8");
  const prefix = plan.rowPrefix;

  // Positive: at least one row must be declared, or the plan gates nothing.
  const declaredRows = [...text.matchAll(new RegExp(String.raw`^\|\s*(${prefix}-\d+)\s*\|`, "gm"))].map(
    (m) => m[1],
  );
  const posOk = declaredRows.length > 0;
  results.push([posOk, `${planId} declares at least one ${prefix}- row (found ${declaredRows.length})`]);
  if (!posOk) failed += 1;

  // Negative: an id that cannot exist must be rejected. This is the case the broken
  // one-liner got wrong, and it is the one that proves the check can fail.
  const bogus = `${prefix}-99999`;
  const negOk = isDeclaredRow(text, bogus) === false;
  results.push([negOk, `${planId} REJECTS ${bogus} (negative case)`]);
  if (!negOk) failed += 1;
}

console.log("\nrow-declaration test — mirrors canon-gate.ps1 M5\n");
for (const [ok, name] of results) console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`);
console.log(`\nRESULT: ${failed === 0 ? "PASS" : `FAIL (${failed})`} — exit ${failed === 0 ? 0 : 1}`);
process.exit(failed === 0 ? 0 : 1);
