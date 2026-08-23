#!/usr/bin/env node
/**
 * Sync instrument entity-type classifications from doc_repo catalog to product repos.
 * Usage: node scripts/sync-instrument-registry.mjs [--check]
 */
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "_catalog", "instrument_entity_type_classifications.json");

const TARGETS = [
  join(ROOT, "..", "seat-worktrees", "property", "legacy-design-tools", "lib", "instrument-registry", "classifications.json"),
  join(ROOT, "..", "seat-worktrees", "property", "hauska-map", "packages", "instrument-registry", "classifications.json"),
];

function main() {
  const checkOnly = process.argv.includes("--check");
  const source = JSON.parse(readFileSync(SOURCE, "utf8"));
  if (source.status !== "active") {
    console.error(`refuse: source registry status=${source.status}`);
    process.exit(2);
  }
  let drift = false;
  for (const target of TARGETS) {
    let targetText;
    try {
      targetText = readFileSync(target, "utf8");
    } catch {
      console.error(`missing target: ${target}`);
      drift = true;
      continue;
    }
    const normalized = JSON.stringify(JSON.parse(targetText), null, 2) + "\n";
    const expected = JSON.stringify(source, null, 2) + "\n";
    if (normalized !== expected) {
      drift = true;
      if (!checkOnly) {
        copyFileSync(SOURCE, target);
        console.log(`synced ${target}`);
      } else {
        console.error(`drift: ${target}`);
      }
    }
  }
  if (checkOnly && drift) process.exit(1);
  if (!checkOnly && !drift) console.log("all targets in sync");
  process.exit(0);
}

main();
