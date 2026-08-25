#!/usr/bin/env node
/**
 * Two-track union pin (WDLL item 14).
 *
 * Preserves the Track A / Track B split at the 2026-08-24 union.
 * Track A = recalibration / PE hold / design leftover.
 * Track B = write-path / Manifest / deficit. Game plan wins ingest order.
 *
 * Three-question gate:
 *   Executes: this file. Not a person.
 *   Triggers: handoff read-order item 0 and WDLL item 14. Not a repo-wide hook
 *     (that would block unrelated docs and teach bypass).
 *   Fails: exit 1. A missing required phrase, a revived old Lane 3 queue
 *     fixture, or a dump script that drops who-serves from NOT_A_RAIL.
 *   Bypasses: anyone who does not run it. Canvases live outside git; a
 *     missing canvas is UNMEASURED, never a silent pass.
 *
 * Usage:
 *   node scripts/two-track-union-pin.mjs --self-test
 *   node scripts/two-track-union-pin.mjs --check
 * --check always self-tests first.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PIN_PATH = join(ROOT, "_inbox", "2026-08-24_two_track_union_pin.json");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "two-track-union");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function missingPhrases(text, phrases) {
  return phrases.filter((p) => !text.includes(p));
}

function gradeRequired(text, mustContain) {
  if (mustContain.some((p) => p === "")) {
    return {
      ok: false,
      reason: "empty mustContain phrase is refused (would match every file)",
      missing: [],
    };
  }
  const missing = missingPhrases(text, mustContain);
  return { ok: missing.length === 0, missing, reason: missing.length ? "missing required phrase" : null };
}

function gradeFile(absPath, mustContain) {
  if (!existsSync(absPath)) {
    return { ok: false, status: "MISSING", path: absPath, missing: mustContain, reason: "file absent" };
  }
  const graded = gradeRequired(readText(absPath), mustContain);
  return { ...graded, status: graded.ok ? "PASS" : "FAIL", path: absPath };
}

function gradeCanvas(absPath, mustContain) {
  if (!existsSync(absPath)) {
    return {
      ok: true,
      status: "UNMEASURED",
      path: absPath,
      reason: "canvas lives outside git; file not present on this machine",
      missing: [],
    };
  }
  const graded = gradeRequired(readText(absPath), mustContain);
  return { ...graded, status: graded.ok ? "PASS" : "FAIL", path: absPath };
}

function gradeDump(pin) {
  const abs = join(ROOT, pin.dump.path);
  if (!existsSync(abs)) {
    return { ok: false, status: "MISSING", path: abs, reason: "dump absent" };
  }
  const dump = loadJson(abs);
  const failures = [];
  if (dump.planRow !== pin.dump.planRow) {
    failures.push(`planRow ${dump.planRow} != ${pin.dump.planRow}`);
  }
  if (dump.rematerialized !== pin.dump.rematerialized) {
    failures.push(`rematerialized ${dump.rematerialized} != ${pin.dump.rematerialized}`);
  }
  return {
    ok: failures.length === 0,
    status: failures.length ? "FAIL" : "PASS",
    path: abs,
    reason: failures[0] || null,
    failures,
  };
}

function checkLive(pin) {
  const files = pin.required.map((row) => gradeFile(join(ROOT, row.path), row.mustContain));
  const canvases = pin.canvases.map((row) => gradeCanvas(row.path, row.mustContain));
  const dump = gradeDump(pin);
  const fileFail = files.filter((r) => !r.ok);
  const canvasFail = canvases.filter((r) => r.status === "FAIL");
  const ok = fileFail.length === 0 && canvasFail.length === 0 && dump.ok;
  return {
    status: ok ? "PASS" : "FAIL",
    unionCommit: pin.unionCommit,
    unionAt: pin.unionAt,
    files,
    canvases,
    dump,
    canvasUnmeasured: canvases.filter((r) => r.status === "UNMEASURED").length,
  };
}

function assert(name, cond, failures) {
  if (!cond) failures.push(name);
}

function runSelfTests() {
  const failures = [];
  const pin = loadJson(PIN_PATH);

  const good = gradeRequired(readText(join(FIXTURE_DIR, "good-handoff.md")), [
    "game plan wins",
    "pointer, not a queue",
    "Track A",
    "Track B",
    "P-75",
    "P-76",
    "Do not start CAMA",
  ]);
  assert("F1 good handoff PASS", good.ok, failures);

  const oldQueue = gradeRequired(readText(join(FIXTURE_DIR, "old-lane3-queue.md")), [
    "game plan wins",
    "pointer, not a queue",
    "Track A",
    "Track B",
    "P-75",
    "P-76",
    "Do not start CAMA",
  ]);
  assert("F2 old Lane 3 queue FAIL", !oldQueue.ok, failures);
  assert(
    "F2 names the missing split phrases",
    oldQueue.missing.includes("game plan wins") && oldQueue.missing.includes("Track A"),
    failures,
  );

  const empty = gradeRequired("", ["game plan wins"]);
  assert("F3 empty file FAIL", !empty.ok, failures);

  const vacuous = gradeRequired("anything", [""]);
  assert("F4 empty phrase refused (not vacuous)", !vacuous.ok, failures);

  const dumpScript = readText(join(ROOT, "scripts", "county-manifest-canvas-dump.mjs"));
  assert(
    "F5 live dump script still names who-serves as not-a-rail",
    dumpScript.includes('fact: "who-serves"') && dumpScript.includes('fact: "city-limits"'),
    failures,
  );
  const liveDump = loadJson(join(ROOT, "_inbox", "2026-08-24_county_manifest_dump.json"));
  const dumpRails = (liveDump.rails || []).map((r) => r.railKey);
  assert(
    "F6 live dump JSON does not invent a who-serves rail",
    !dumpRails.includes("who-serves") && !dumpRails.includes("city-limits"),
    failures,
  );

  const pinHasAuthority = pin.authority.includes("game plan wins");
  assert("F7 pin records authority", pinHasAuthority, failures);

  return { ok: failures.length === 0, failures };
}

function parseArgs(argv) {
  const out = { selfTest: false, check: false };
  for (const a of argv) {
    if (a === "--self-test") out.selfTest = true;
    else if (a === "--check") out.check = true;
  }
  if (!out.selfTest && !out.check) out.check = true;
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    process.stdout.write(JSON.stringify({ control: "two-track-union-pin", selfTest }, null, 2) + "\n");
    process.exit(1);
  }
  if (!args.check) {
    process.stdout.write(JSON.stringify({ control: "two-track-union-pin", selfTest, live: null }, null, 2) + "\n");
    process.exit(0);
  }

  const pin = loadJson(PIN_PATH);
  const live = checkLive(pin);
  process.stdout.write(
    JSON.stringify({ control: "two-track-union-pin", planRow: pin.planRow, wdllItem: pin.wdllItem, selfTest, live }, null, 2) + "\n",
  );
  process.exit(live.status === "PASS" ? 0 : 1);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
