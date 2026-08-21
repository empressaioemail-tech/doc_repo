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

/** Mirrors scripts/dispatch.mjs: amendment ADDS a row (id + add-verb in the Row(s) cell). */
function isAddedByAmendment(planText, rowId) {
  const escaped = rowId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    String.raw`^\|\s*A-\d+\s*\|[^\n|]*\|[^\n|]*(?:^|[^A-Za-z0-9-])` +
      escaped +
      String.raw`(?:\s+(?:ADDED|added|ADD|NEW|new))`,
    "m",
  ).test(planText);
}

function isDispatchableRow(planText, rowId) {
  return isDeclaredRow(planText, rowId) || isAddedByAmendment(planText, rowId);
}

const FIX_ADD = "| A-021 | 2026-08-21 | P-48 ADDED, P-56 ADDED | prose that mentions P-57 is not enough |";
selfTests.push(
  ["amendment accepts P-48 ADDED in the Row(s) cell", () => isAddedByAmendment(FIX_ADD, "P-48") === true],
  ["amendment accepts P-56 ADDED in the same cell", () => isAddedByAmendment(FIX_ADD, "P-56") === true],
  ["amendment rejects P-57 mentioned only in Change prose", () => isAddedByAmendment(FIX_ADD, "P-57") === false],
  ["amendment is not vacuous (empty doc rejects)", () => isAddedByAmendment("", "P-48") === false],
);

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

  if (planId === "OPS-16") {
    const added = ["P-48", "P-49", "P-50", "P-51", "P-52", "P-53", "P-54", "P-55", "P-56"];
    for (const rid of added) {
      const okAdd = isDispatchableRow(text, rid) === true;
      results.push([okAdd, `OPS-16 A-021 makes ${rid} dispatchable`]);
      if (!okAdd) failed += 1;
    }
    const notAdded = isDispatchableRow(text, "P-57") === false;
    results.push([notAdded, "OPS-16 REJECTS P-57 (A-021 negative case)"]);
    if (!notAdded) failed += 1;
  }
}

console.log("\nrow-declaration test — mirrors canon-gate.ps1 M5\n");
for (const [ok, name] of results) console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`);
console.log(`\nRESULT: ${failed === 0 ? "PASS" : `FAIL (${failed})`} — exit ${failed === 0 ? 0 : 1}`);
process.exit(failed === 0 ? 0 : 1);
