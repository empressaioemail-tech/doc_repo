#!/usr/bin/env node
/**
 * gate-cycle-compare.mjs -- grades one gate-scheduler cycle that is predicted to change NOTHING
 * (a redeploy of the scheduler's image with no cell written in between), by comparing the
 * `parcel_gate_verdict` table before and after, pair by pair.
 *
 * WHY NOT scripts/p252-apply-compare.mjs. That instrument was built for P-252's vocabulary change.
 * A pair whose BEFORE verdict is an `excluded-*` string only earns a note there ("outside the
 * pre-apply vocabulary") and is never compared, so an `excluded-mid-cutover` that turned `pass` or
 * `refuse` would not fail it. Since P-201 every exclusion is an `excluded-*` string, so for a
 * no-change cycle that instrument is vacuous on a third of the table. Found 2026-09-18 (P-325's
 * #175 deploy) and recorded rather than patched in place.
 *
 * PASS requires, for every (county, rail) pair in the before snapshot within the named counties:
 *   1. the pair was rewritten at or after --since (otherwise UNMEASURED, exit 2);
 *   2. its verdict string is IDENTICAL to before (any string, any vocabulary);
 *   3. its unaccounted_count is IDENTICAL to before;
 *   4. no pair exists after that did not exist before, and none disappeared.
 * `evaluated_at` and `run_id` are the only fields allowed to differ.
 *
 * STATE YOUR SNAPSHOT: prints the before file's sha256, --since, and the after read's time.
 *
 * USAGE  FACTORY_DATABASE_URL_RO=... node scripts/gate-cycle-compare.mjs --before <csv> --since <ISO>
 *          [--counties 48021,48055,...] [--json out.json]
 *        node scripts/gate-cycle-compare.mjs --self-test
 * EXIT   0 PASS, 1 FAIL, 2 UNMEASURED.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./setback-parcel-census.mjs";

export const SIX = ["48021", "48055", "48209", "48309", "48453", "48491"];

/** Pure. rows: [{county_fips, rail_key, verdict, unaccounted_count, evaluated_at}] */
export function compareCycle({ before, after, since, counties = SIX }) {
  const key = (r) => `${r.county_fips}|${r.rail_key}`;
  const inScope = (r) => counties.includes(r.county_fips);
  const beforeBy = new Map(before.filter(inScope).map((r) => [key(r), r]));
  const afterBy = new Map(after.filter(inScope).map((r) => [key(r), r]));
  const sinceMs = Date.parse(since);
  if (!Number.isFinite(sinceMs)) return { status: "UNMEASURED", failures: [], unwritten: [], reason: `--since "${since}" is not a time` };
  if (beforeBy.size === 0) return { status: "UNMEASURED", failures: [], unwritten: [], reason: "the before snapshot holds no pair in scope" };
  const failures = [];
  const unwritten = [];
  let identical = 0;
  for (const [k, b] of beforeBy) {
    const a = afterBy.get(k);
    if (!a) { failures.push(`${k}: present before, absent after`); continue; }
    if (!(Date.parse(a.evaluated_at) >= sinceMs)) { unwritten.push(k); continue; }
    const diffs = [];
    if (a.verdict !== b.verdict) diffs.push(`verdict ${b.verdict} -> ${a.verdict}`);
    if (Number(a.unaccounted_count) !== Number(b.unaccounted_count)) diffs.push(`unaccounted ${b.unaccounted_count} -> ${a.unaccounted_count}`);
    if (diffs.length) failures.push(`${k}: ${diffs.join(", ")}`);
    else identical += 1;
  }
  for (const k of afterBy.keys()) if (!beforeBy.has(k)) failures.push(`${k}: absent before, present after`);
  const status = unwritten.length ? "UNMEASURED" : failures.length ? "FAIL" : "PASS";
  return { status, pairs: beforeBy.size, identical, failures, unwritten };
}

function selfTest() {
  const t0 = "2026-09-18T15:00:00Z";
  const before = [
    { county_fips: "48021", rail_key: "owner", verdict: "pass", unaccounted_count: "0", evaluated_at: "2026-09-18 14:10:00+00" },
    { county_fips: "48021", rail_key: "etjStatus", verdict: "excluded-mid-cutover", unaccounted_count: "0", evaluated_at: "2026-09-18 14:10:00+00" },
    { county_fips: "48021", rail_key: "setbackRules", verdict: "refuse", unaccounted_count: "1313", evaluated_at: "2026-09-18 14:10:00+00" },
  ];
  const later = (rows) => rows.map((r) => ({ ...r, evaluated_at: "2026-09-18 15:05:00+00" }));
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });
  const g = (after, extra = {}) => compareCycle({ before, after, since: t0, counties: ["48021"], ...extra });
  check("an identical cycle PASSES", g(later(before)).status === "PASS");
  check("NOT VACUOUS: an excluded-* pair that turned pass FAILS (the gap in p252-apply-compare)", g(later(before).map((r) => r.rail_key === "etjStatus" ? { ...r, verdict: "pass" } : r)).status === "FAIL");
  check("a refuse count that moved FAILS", g(later(before).map((r) => r.rail_key === "setbackRules" ? { ...r, unaccounted_count: "1312" } : r)).status === "FAIL");
  check("a pass that turned refuse FAILS", g(later(before).map((r) => r.rail_key === "owner" ? { ...r, verdict: "refuse", unaccounted_count: "3" } : r)).status === "FAIL");
  check("a pair not rewritten since the cycle began is UNMEASURED, never PASS", g(later(before).map((r) => r.rail_key === "owner" ? { ...r, evaluated_at: "2026-09-18 14:59:00+00" } : r)).status === "UNMEASURED");
  check("a pair that disappeared FAILS", g(later(before).filter((r) => r.rail_key !== "owner")).status === "FAIL");
  check("a pair that appeared FAILS", g([...later(before), { county_fips: "48021", rail_key: "newRail", verdict: "pass", unaccounted_count: "0", evaluated_at: "2026-09-18 15:05:00+00" }]).status === "FAIL");
  check("an empty before snapshot is UNMEASURED, never PASS", compareCycle({ before: [], after: later(before), since: t0, counties: ["48021"] }).status === "UNMEASURED");
  check("a bad --since is UNMEASURED", compareCycle({ before, after: later(before), since: "yesterday", counties: ["48021"] }).status === "UNMEASURED");
  check("pairs outside the named counties are ignored", g([...later(before), { county_fips: "48055", rail_key: "owner", verdict: "refuse", unaccounted_count: "9", evaluated_at: "2026-09-18 15:05:00+00" }]).status === "PASS");
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function readAfter(dsn, counties) {
  const dir = mkdtempSync(join(tmpdir(), "gate-cycle-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, `set default_transaction_read_only = on;\nset statement_timeout = '60s';\nselect county_fips, rail_key, verdict, coalesce(unaccounted_count, 0) as unaccounted_count, evaluated_at::text as evaluated_at, run_id from parcel_gate_verdict where county_fips in (${counties.map((c) => `'${c}'`).join(",")}) order by 1, 2;`, "utf8");
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, timeout: 90000, env: { ...process.env, PGOPTIONS: "-c default_transaction_read_only=on" } });
    if (r.status !== 0) throw new Error(`psql failed: ${(r.stderr || "").split("\n")[0]}`);
    return parseCsv(r.stdout.split(/\r?\n/).filter((l) => l !== "SET").join("\n"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const beforePath = arg("--before"), since = arg("--since");
  const counties = (arg("--counties") ?? SIX.join(",")).split(",").map((s) => s.trim());
  if (!beforePath || !since) { console.error("usage: --before csv --since ISO [--counties ...] [--json out]"); process.exit(2); }
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!dsn) { console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set"); process.exit(2); }
  const before = parseCsv(readFileSync(beforePath, "utf8"));
  const readAt = new Date().toISOString();
  const after = readAfter(dsn, counties);
  const out = { ...compareCycle({ before, after, since, counties }), before: beforePath, beforeSha256: createHash("sha256").update(readFileSync(beforePath)).digest("hex"), since, afterReadAt: readAt, counties };
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(out, null, 2));
  console.log(`GATE CYCLE ${out.status}  pairs ${out.pairs ?? 0}  identical ${out.identical ?? 0}  failures ${out.failures.length}  unwritten ${out.unwritten.length}  (before sha256 ${out.beforeSha256.slice(0, 12)}, since ${since}, after read ${readAt})`);
  for (const f of out.failures.slice(0, 40)) console.log(`  FAIL  ${f}`);
  if (out.unwritten.length) console.log(`  unwritten: ${out.unwritten.slice(0, 20).join(", ")}${out.unwritten.length > 20 ? " ..." : ""}`);
  if (out.reason) console.log(`  ${out.reason}`);
  process.exit(out.status === "PASS" ? 0 : out.status === "UNMEASURED" ? 2 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
