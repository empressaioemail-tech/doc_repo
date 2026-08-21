#!/usr/bin/env node
/**
 * MEMORY PROMOTION GATE — the trigger the fleet memory loop never had.
 *
 * THE DEFECT THIS CLOSES. fleet_memory_practice.md specifies Tier 2 capture, a
 * planner-gated promotion step, and Tier 1 durable memory. Capture works: 91 scratch files,
 * 65 carrying LESSON entries. Promotion has never happened once. The 2026-08-08 memory
 * system audit found the L3 grading rung executed zero times in 215 session summaries, and
 * grepping _sessions/ for HARMED returns nothing. The gate had a specification, an owner,
 * and no trigger. A control whose executor is "the planner remembers at session close" is
 * not a control, by this repo's own three-question gate.
 *
 * WHY IT MEASURES BACKLOG RATHER THAN AGE. An age threshold fails on arrival, because 65
 * files are already untriaged, and a gate that is red from its first run teaches the fleet
 * to reach for the bypass. It also punishes capture, which is the one part of this system
 * that works. So the metric is the size of the untriaged backlog, pinned, and the gate
 * fails when the backlog GROWS. Agents stay free to write LESSON entries as fast as they
 * like. The planner must triage at least as many as arrive. That is a forcing function on
 * the step that has never run, and it leaves untouched the step that runs fine.
 *
 * TRIAGE IS NOT PROMOTION. Declining a lesson is a valid, recorded outcome. The gate is
 * satisfied by a decision, not by an entry in MEMORY.md. A gate that only accepted
 * promotion would push the planner to promote weak lessons to clear a number, which is the
 * exact drift the planner-gated firewall exists to prevent.
 *
 * WHAT IT CANNOT SEE, stated rather than implied. It counts FILES carrying at least one
 * LESSON marker, not individual lessons. A file triaged once and then given three new
 * lessons reads as triaged. Per-lesson granularity needs a stable per-entry id, which the
 * Tier 2 format does not carry. Sizing that is a graduation item, not a silent limitation.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const SCRATCH = join(ROOT, "_scratch");
const LOG = join(ROOT, "_catalog", "memory_promotion_log.jsonl");
const PIN = join(ROOT, ".github", "memory-backlog-pin.json");

if (!existsSync(SCRATCH)) {
  console.error("REFUSING: _scratch/ not found. Absent is not zero.");
  process.exit(1);
}
if (!existsSync(PIN)) {
  console.error(`REFUSING: backlog pin not found at ${PIN}.`);
  console.error("A ratchet with no pin admits everything, which is worse than no ratchet.");
  process.exit(1);
}

// Tier 2 files carrying at least one LESSON. Top level only: subdirectories under
// _scratch/ are working residue (scraped pages, probe dumps) and are gitignored.
const lessonFiles = readdirSync(SCRATCH)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => {
    try {
      return /(^|\n)\s*[-*#>\s]*LESSON\b/.test(readFileSync(join(SCRATCH, f), "utf8"));
    } catch {
      return false;
    }
  })
  .sort();

// Triage decisions. Absent log is an empty log, not an error: before the first triage
// there is legitimately nothing to read.
const triaged = new Set();
if (existsSync(LOG)) {
  for (const line of readFileSync(LOG, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("//")) continue;
    try {
      const rec = JSON.parse(t);
      if (rec.scratchFile && rec.decision) triaged.add(rec.scratchFile);
    } catch {
      console.error(`REFUSING: unparseable line in ${LOG}. A log that cannot be read cannot gate.`);
      process.exit(1);
    }
  }
}

const untriaged = lessonFiles.filter((f) => !triaged.has(f));
const pin = JSON.parse(readFileSync(PIN, "utf8"));
const max = pin.maxUntriagedLessonFiles;

if (typeof max !== "number") {
  console.error("REFUSING: pin carries no numeric maxUntriagedLessonFiles.");
  process.exit(1);
}

const lines = [
  "",
  "MEMORY PROMOTION GATE",
  `pin snapshot: ${pin.snapshot ?? "(none declared)"}`,
  "",
  `Tier 2 files carrying a LESSON : ${lessonFiles.length}`,
  `triaged (promoted or declined) : ${triaged.size}`,
  `UNTRIAGED                      : ${untriaged.length}`,
  `pinned ceiling                 : ${max}`,
  "",
];

if (untriaged.length > max) {
  lines.push(
    `FAIL: the untriaged backlog grew past its pin (${untriaged.length} > ${max}).`,
    "",
    "Triage is a DECISION, not a promotion. Declining a lesson clears it. Append one line",
    "per decision to _catalog/memory_promotion_log.jsonl:",
    "",
    '  {"date":"YYYY-MM-DD","scratchFile":"<name>.md","decision":"promoted|declined",',
    '   "form":"guard|prose|none","ref":"<test path or MEMORY.md row id>","reason":"..."}',
    "",
    "Then lower maxUntriagedLessonFiles in .github/memory-backlog-pin.json in the SAME commit.",
    "",
    "Oldest untriaged, by name:",
    ...untriaged.slice(0, 10).map((f) => `  ${f}`),
  );
  console.log(lines.join("\n"));
  process.exit(1);
}

if (untriaged.length < max) {
  lines.push(
    `Backlog is BELOW the pin (${untriaged.length} < ${max}). Lower the pin in this commit,`,
    "or the ratchet silently re-admits the slack it just recorded.",
  );
}
lines.push("PASS");
console.log(lines.join("\n"));
process.exit(0);
