#!/usr/bin/env node
/**
 * F3 adjudication for Smithville's PD-Z, and the side-yard question.
 *
 * Two things to settle:
 *  1. Smithville's own code enumerates PD-Z under its "Planned Development Districts" heading
 *     (§2.1.5 A. PDD / B. PD-Z) while giving it a fixed code-wide dimensions table. F3 says no
 *     planned-development code gets a Euclidean row. Does the lane disclose that judgment, and
 *     did it (correctly) leave the actual PDD district unrowed?
 *  2. The code states "Minimum combined side yard setback for both attached units | 15 feet",
 *     but the row records side_ft = 100 / not_specified. Is that explained, or is a real
 *     standard being dropped?
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const REPO = "P:/seat-worktrees/p258-setback-campaign/ldt-base";
const git = (a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const tbl = JSON.parse(git(["show", "origin/seat/p258-lane-f:lib/adapters/src/local/setbacks/smithville-tx.json"]));

const note = typeof tbl.note === "string" ? tbl.note : JSON.stringify(tbl.note ?? "");
console.log(`note length: ${note.length}`);
console.log("\n=== note: does it address PD-Z / planned development / PDD? ===");
for (const kw of ["PD-Z", "Planned Development", "PDD", "2.1.5", "planned-development", "out-of-scope", "PDD "]) {
  const i = note.indexOf(kw);
  if (i >= 0) console.log(`--- "${kw}" @${i} ---\n${note.slice(Math.max(0, i - 260), i + 520)}\n`);
  else console.log(`--- "${kw}": NOT PRESENT in the note`);
}

console.log("=== PD-Z row as shipped ===");
const row = tbl.districts.find((d) => /^PD ?-?Z/.test(d.district_name));
console.log(JSON.stringify(row, null, 1));

console.log("\n=== is there a PDD (real planned development) row? ===");
const pdd = tbl.districts.filter((d) => /PDD/.test(d.district_name));
console.log(pdd.length ? JSON.stringify(pdd.map((d) => d.district_name)) : "no PDD row — correct, PDD is negotiated/site-specific");
