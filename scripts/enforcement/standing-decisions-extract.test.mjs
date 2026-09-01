// Verifies the STANDING DECISIONS extractor in both directions, per ENFORCEMENT.md
// "Verify a check by violating it": the legacy pattern must FAIL these fixtures and the
// current extractor must pass them. Run: node --test scripts/enforcement/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractStandingDecisions, LEGACY_PATTERN } from "../lib/standing-decisions.mjs";

const HEAD = "# _STATE\n\n## Seat index\n\n- property\n\n## STANDING DECISIONS (these govern every dispatch)\n\n";
const BULLETS = [
  "- FIRST — no capital zed here.",
  "- SECOND — MODEL LAW with a Z in ZONING inside the line.",
  "- THIRD — after the Z, still standing.",
  "- Full standing-decisions detail: `MEMORY.md`.",
];

test("capital Z inside a bullet does not truncate the block (legacy did)", () => {
  const state = HEAD + BULLETS.join("\n") + "\n\n## NEXT SECTION\n\nbody\n";
  const got = extractStandingDecisions(state);
  assert.equal(got.split("\n").filter((l) => l.startsWith("- ")).length, 4);
  const legacy = state.match(LEGACY_PATTERN)[1].trimEnd();
  assert.ok(legacy.length < got.length, "legacy pattern must be shown truncating at the Z");
  assert.ok(!legacy.includes("THIRD"), "legacy pattern must lose the bullet after the Z");
});

test("a single-hash heading after the block terminates it (legacy over-ran)", () => {
  const state = HEAD + BULLETS[0] + "\n" + BULLETS[3] + "\n\n# Seat: property\n\n## PHASE 1\n\nstate\n";
  const got = extractStandingDecisions(state);
  assert.ok(!got.includes("Seat: property"), "must stop before the seat heading");
  assert.ok(!got.includes("PHASE 1"));
  const legacy = state.match(LEGACY_PATTERN)[1];
  assert.ok(legacy.includes("Seat: property"), "legacy pattern must be shown over-running into the seat block");
});

test("a horizontal rule terminates the block and is not part of it", () => {
  const state = HEAD + BULLETS[0] + "\n\n---\n\n# Seat: property\n";
  const got = extractStandingDecisions(state);
  assert.equal(got, BULLETS[0]);
});

test("end of input terminates the block", () => {
  const state = HEAD + BULLETS[0] + "\n" + BULLETS[1] + "\n";
  const got = extractStandingDecisions(state);
  assert.equal(got, BULLETS[0] + "\n" + BULLETS[1]);
});

test("absent heading returns null, never an empty body", () => {
  assert.equal(extractStandingDecisions("# _STATE\n\n## Seat index\n"), null);
});

test("live _STATE.md: the block is not six lines and does not contain a seat heading", () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const state = readFileSync(join(root, "_STATE.md"), "utf8");
  const got = extractStandingDecisions(state);
  assert.ok(got, "STANDING DECISIONS must exist in _STATE.md");
  const bullets = got.split("\n").filter((l) => l.startsWith("- ")).length;
  assert.ok(bullets >= 10, `expected the full block, got ${bullets} bullets`);
  assert.ok(!got.includes("# Seat:"), "must not over-run into a seat block");
});
