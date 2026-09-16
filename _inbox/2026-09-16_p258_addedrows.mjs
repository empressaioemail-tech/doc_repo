#!/usr/bin/env node
/**
 * P-258 — extract the district rows each lane ADDED (by district_name, per table file),
 * by comparing the lane branch's table against origin/main. Feeds the PUD scan in the verifier.
 *
 * Reads the branches from the shared clone; makes no network calls and edits nothing.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const REPO = "P:/seat-worktrees/p258-setback-campaign/ldt-base";
const LANES = ["lane-a", "lane-b", "lane-c", "lane-d", "lane-e", "lane-f"];
const DIR = "lib/adapters/src/local/setbacks";

const git = (a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const show = (ref, file) => { try { return git(["show", `${ref}:${file}`]); } catch { return null; } };
const tables = (ref) => git(["ls-tree", "--name-only", `${ref}:${DIR}`]).split("\n").filter((f) => f.endsWith(".json"));

const out = {};
for (const lane of LANES) {
  const ref = `origin/seat/p258-${lane}`;
  out[lane] = {};
  for (const file of tables(ref)) {
    const after = JSON.parse(show(ref, `${DIR}/${file}`));
    const beforeRaw = show("origin/main", `${DIR}/${file}`);
    const before = beforeRaw ? JSON.parse(beforeRaw) : { districts: [] };
    const beforeNames = new Set((before.districts ?? []).map((d) => d.district_name));
    const added = (after.districts ?? []).filter((d) => !beforeNames.has(d.district_name));
    if (added.length) out[lane][file] = added;
  }
}
const dest = path.join(HERE, "2026-09-16_p258_added_rows.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
for (const [lane, files] of Object.entries(out)) {
  const n = Object.values(files).reduce((a, d) => a + d.length, 0);
  console.log(`${lane}: ${n} added rows across ${Object.keys(files).length} files`);
  for (const [f, d] of Object.entries(files)) console.log(`   ${f}: ${d.length} -> ${d.map((x) => x.district_name).join(" | ").slice(0, 260)}`);
}
console.log(`wrote ${dest}`);
