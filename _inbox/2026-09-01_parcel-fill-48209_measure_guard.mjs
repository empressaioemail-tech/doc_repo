/**
 * Guard for 2026-09-01_parcel-fill-48209_measure.sql.
 * Presence-shaped "does the file exist" is not this check.
 * Meaning: the SQL is pinned to Hays 48209, refuses a swapped FIPS, and
 * carries a statement_timeout. Shown to fail on a known violation.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const HERE = dirname(fileURLToPath(import.meta.url));
const SQL_PATH = join(HERE, "2026-09-01_parcel-fill-48209_measure.sql");
const raw = readFileSync(SQL_PATH, "utf8");
const sql = raw
  .split("\n")
  .filter((line) => !/^\s*--/.test(line))
  .join("\n");

assert.match(sql, /SET statement_timeout = '15s'/);
assert.match(sql, /county_fips = '48209'/);
assert.doesNotMatch(sql, /place_layer_snapshots/);
assert.doesNotMatch(sql, /cad-parcel-roll/);
assert.doesNotMatch(sql, /hauska_mcp/);
assert.doesNotMatch(sql, /DISTINCT ON/);
assert.equal((sql.match(/county_fips = '48209'/g) || []).length >= 3, true);

const swapped = sql.replaceAll("48209", "48021");
assert.doesNotMatch(swapped, /county_fips = '48209'/);
assert.match(swapped, /county_fips = '48021'/);

console.log("parcel-fill-48209 measure guard: ok");
