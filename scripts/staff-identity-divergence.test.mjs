#!/usr/bin/env node
/**
 * staff-identity-divergence.test.mjs
 *
 * G-132 structural guard, following the sc-kit.css / plan-registry-divergence.test.mjs
 * precedent (DEV_PROCESS 2.4 -- CTRL-1: "when one rule has two implementations, the
 * divergence test IS the control").
 *
 * THE DEFECT THIS EXISTS TO PREVENT
 * ---------------------------------
 * `_decisions/2026-09-14_staff_identity_and_department_rbac.md` ruling 3: "the role is a
 * claim on the identity; the enforcement PRIMITIVES -- the guard, the typed refusal shape --
 * live in ONE shared package across smartcity-dashboards, plan-review and smart-files, with
 * a divergence test that fails when the implementations disagree." src/staff-identity.mjs
 * is that shared package for G-132's half (verification); it exists as three physical,
 * independently-editable copies -- one per product repo, no npm workspace, no shared
 * registry, same discipline as web/sc-kit.css (confirmed byte-identical across the same
 * three repos, CP1). A copy edited in one repo and not the other two is a fork of a security
 * boundary, not a stylesheet, and this test is what makes that structural rather than a
 * comment three engineers have to remember.
 *
 * WHAT THIS DOES NOT COVER. This machine has all three product repos checked out as sibling
 * worktrees (P:/seat-worktrees/govtech/*), which a single repo's own CI does not. This script
 * is therefore a SEAT-LEVEL / PLANNER-LEVEL guard, not something smartcity-dashboards' own
 * `npm test` can run in isolation -- exactly the same limitation sc-kit.css's own byte-check
 * has today (it only verifies properties of ONE repo's own copy). Recorded as a named
 * follow-up in this lane's close: each repo's own CI has no way to catch this by itself
 * without either a shared package (npm workspace / private registry) or a cross-repo CI job,
 * neither of which exists and neither of which this lane builds unilaterally (DEV_PROCESS 5.4).
 *
 * Run: node scripts/staff-identity-divergence.test.mjs   (exit 0 pass, 1 fail, 2 not-applicable)
 */

import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const docRepoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const seatRoot = join(docRepoRoot, ".."); // P:/seat-worktrees/govtech/
const REPOS = ["smartcity-dashboards", "plan-review", "smart-files"];
const REL_PATH = "src/staff-identity.mjs";

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

const found = [];
const missing = [];
for (const repo of REPOS) {
  const p = join(seatRoot, repo, REL_PATH);
  if (existsSync(p)) found.push({ repo, path: p });
  else missing.push(repo);
}

if (found.length === 0) {
  console.log(
    `NOT APPLICABLE: none of ${REPOS.join(", ")} found as siblings of ${seatRoot} -- this is a seat-level check, run from a worktree that has all three product repos checked out alongside doc_repo.`,
  );
  process.exit(2);
}

if (missing.length > 0) {
  console.error(`FATAL: expected all three product repos as siblings; missing ${REL_PATH} in: ${missing.join(", ")}.`);
  process.exit(1);
}

const hashes = found.map((f) => ({ ...f, hash: sha256(readFileSync(f.path)) }));
const distinct = [...new Set(hashes.map((h) => h.hash))];

if (distinct.length === 1) {
  console.log(`PASS: ${REL_PATH} is byte-identical across all ${found.length} repos (sha256 ${distinct[0].slice(0, 12)}...).`);
  for (const h of hashes) console.log(`  ${h.repo}: ${h.hash}`);
  process.exit(0);
}

console.error(`FAIL: ${REL_PATH} has DIVERGED across repos -- a shared security-verification module was edited in one repo and not the others.`);
for (const h of hashes) console.error(`  ${h.repo}: ${h.hash}`);
console.error(`\nThis is a real defect, not a formatting drift: the resource-server verification logic (issuer/signature/exp/revocation checks) must behave identically in all three products, per ruling 3. Diff the files, decide which copy is correct, and make the other two byte-identical to it.`);
process.exit(1);
