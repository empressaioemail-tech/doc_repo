#!/usr/bin/env node
/**
 * p252-apply-compare.mjs -- grades the P-252 gate scheduler apply against its pre-registered
 * prediction (A-195), from two independent derivations: the verdict table as it was BEFORE the
 * apply (a CSV snapshot taken read-only just before the run) and the table AFTER it (read live,
 * read-only), checked against the dry-run instrument's predicted flips (scripts/p252-rollout-dry-run.mjs
 * output, which computed them from cell counts, not from the verdict table).
 *
 * PASS requires, for every county in scope:
 *   1. complete: every (county, rail) pair in the before snapshot was rewritten at or after the
 *      apply start (otherwise UNMEASURED, exit 2: the run has not finished or skipped pairs);
 *   2. every predicted flip reads `refuse` with the predicted unaccounted count;
 *   3. no pair that read `pass` or `refuse` before reads anything else now (a changed count on a
 *      `refuse` row is reported, not failed: the ledger moves between the two reads);
 *   4. every pair that read the bare `excluded` before and was not predicted to flip now reads one
 *      of the three `excluded-*` kinds (never `pass`, never `refuse`, never a bare `excluded`);
 *   5. no bare `excluded` remains in scope.
 *
 * STATE YOUR SNAPSHOT: the output names the before file and its sha256, the prediction file and
 * its sha256, the apply start, and the time of the after read.
 *
 * USAGE  FACTORY_DATABASE_URL_RO=... node scripts/p252-apply-compare.mjs \
 *          --before _inbox/2026-09-16_p252_apply_verdicts_before.csv \
 *          --prediction _inbox/2026-09-16_p252_rollout_dry_run_prescheduler.json \
 *          --since 2026-09-16T22:40:00Z [--json out.json]
 *        node scripts/p252-apply-compare.mjs --self-test
 * EXIT   0 PASS, 1 FAIL, 2 UNMEASURED.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./setback-parcel-census.mjs";

const EXCLUDED_KINDS = new Set(["excluded-not-applicable", "excluded-mid-cutover", "excluded-no-acquisition-path"]);

/** Pure. rows: [{county_fips, rail_key, verdict, unaccounted_count, evaluated_at}] */
export function grade({ before, after, predicted, since, counties }) {
  const key = (r) => `${r.county_fips}|${r.rail_key}`;
  const afterBy = new Map(after.map((r) => [key(r), r]));
  const predictedBy = new Map(predicted.map((p) => [`${p.county}|${p.rail}`, p]));
  const sinceMs = Date.parse(since);
  const failures = [];
  const notes = [];
  const unwritten = [];
  const perCounty = {};

  for (const b of before) {
    if (!counties.includes(b.county_fips)) continue;
    const k = key(b);
    const a = afterBy.get(k);
    const pc = (perCounty[b.county_fips] ??= { pairs: 0, flipped: 0, reclassified: 0, unchanged: 0 });
    pc.pairs += 1;
    if (!a || !(Date.parse(a.evaluated_at) >= sinceMs)) { unwritten.push(k); continue; }
    const p = predictedBy.get(k);
    if (p) {
      if (a.verdict !== "refuse") failures.push(`${k}: predicted refuse, reads ${a.verdict}`);
      else if (Number(a.unaccounted_count) !== Number(p.unaccounted)) failures.push(`${k}: predicted ${p.unaccounted} unaccounted, reads ${a.unaccounted_count}`);
      else pc.flipped += 1;
      continue;
    }
    if (b.verdict === "pass" || b.verdict === "refuse") {
      if (a.verdict !== b.verdict) failures.push(`${k}: was ${b.verdict}, now ${a.verdict} (not predicted)`);
      else {
        pc.unchanged += 1;
        if (b.verdict === "refuse" && Number(a.unaccounted_count) !== Number(b.unaccounted_count)) {
          notes.push(`${k}: refuse count moved ${b.unaccounted_count} -> ${a.unaccounted_count}`);
        }
      }
      continue;
    }
    if (b.verdict === "excluded") {
      if (!EXCLUDED_KINDS.has(a.verdict)) failures.push(`${k}: was excluded (not predicted to flip), now ${a.verdict}`);
      else pc.reclassified += 1;
      continue;
    }
    notes.push(`${k}: before verdict ${b.verdict} is outside the pre-apply vocabulary`);
  }
  for (const p of predicted) {
    if (!counties.includes(p.county)) continue;
    if (!before.some((b) => b.county_fips === p.county && b.rail_key === p.rail)) failures.push(`${p.county}|${p.rail}: predicted flip has no before row`);
  }
  const bareLeft = after.filter((a) => counties.includes(a.county_fips) && a.verdict === "excluded").map(key);
  if (unwritten.length === 0 && bareLeft.length) failures.push(`bare 'excluded' still present: ${bareLeft.join(", ")}`);

  const status = unwritten.length ? "UNMEASURED" : failures.length ? "FAIL" : "PASS";
  return { status, failures, notes, unwritten, perCounty };
}

export function predictedFromDryRun(json) {
  const out = [];
  for (const c of json.counties ?? []) for (const ch of c.changes ?? []) out.push({ county: c.countyFips, rail: ch.rail, unaccounted: ch.unaccounted });
  return out;
}

function sha(path) { return createHash("sha256").update(readFileSync(path)).digest("hex"); }

function readAfter(dsn, counties) {
  const dir = mkdtempSync(join(tmpdir(), "p252-cmp-"));
  const file = join(dir, "q.sql");
  const list = counties.map((c) => `'${c.replace(/[^0-9]/g, "")}'`).join(",");
  writeFileSync(file, `set default_transaction_read_only = on;\nset statement_timeout = '60s';\nselect county_fips, rail_key, verdict, unaccounted_count, evaluated_at from parcel_gate_verdict where county_fips in (${list}) order by 1,2;\n`);
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, timeout: 90000 });
    if (r.error || r.status !== 0) throw new Error(`psql failed: ${(r.stderr || r.error?.message || "").split("\n")[0]}`);
    return parseCsv(r.stdout.split(/\r?\n/).filter((l) => l !== "SET").join("\n"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function selfTest() {
  const results = [];
  const check = (n, c) => results.push({ n, ok: !!c });
  const t0 = "2026-09-16T22:40:00Z", t1 = "2026-09-16T22:41:00Z", old = "2026-09-16T21:00:00Z";
  const before = [
    { county_fips: "48021", rail_key: "flood", verdict: "pass", unaccounted_count: "0" },
    { county_fips: "48021", rail_key: "agValuation", verdict: "excluded", unaccounted_count: "0" },
    { county_fips: "48021", rail_key: "easements", verdict: "excluded", unaccounted_count: "0" },
    { county_fips: "48021", rail_key: "landUseSource", verdict: "refuse", unaccounted_count: "10" },
  ];
  const predicted = [{ county: "48021", rail: "agValuation", unaccounted: 62256 }];
  const good = [
    { county_fips: "48021", rail_key: "flood", verdict: "pass", unaccounted_count: "0", evaluated_at: t1 },
    { county_fips: "48021", rail_key: "agValuation", verdict: "refuse", unaccounted_count: "62256", evaluated_at: t1 },
    { county_fips: "48021", rail_key: "easements", verdict: "excluded-no-acquisition-path", unaccounted_count: "0", evaluated_at: t1 },
    { county_fips: "48021", rail_key: "landUseSource", verdict: "refuse", unaccounted_count: "12", evaluated_at: t1 },
  ];
  const g = (after) => grade({ before, after, predicted, since: t0, counties: ["48021"] });
  check("the predicted state grades PASS, and a moved refuse count is a note", g(good).status === "PASS" && g(good).notes.length === 1);
  check("NOT VACUOUS: a pass row that turned refuse FAILS", g(good.map((r) => r.rail_key === "flood" ? { ...r, verdict: "refuse" } : r)).status === "FAIL");
  check("a predicted flip that did not happen FAILS", g(good.map((r) => r.rail_key === "agValuation" ? { ...r, verdict: "excluded-not-applicable" } : r)).status === "FAIL");
  check("a predicted flip with the wrong count FAILS", g(good.map((r) => r.rail_key === "agValuation" ? { ...r, unaccounted_count: "5" } : r)).status === "FAIL");
  check("an unpredicted excluded row that turned refuse FAILS", g(good.map((r) => r.rail_key === "easements" ? { ...r, verdict: "refuse" } : r)).status === "FAIL");
  check("a bare excluded left behind FAILS", g(good.map((r) => r.rail_key === "easements" ? { ...r, verdict: "excluded" } : r)).status === "FAIL");
  check("a pair not rewritten since the apply start is UNMEASURED, never PASS", g(good.map((r) => r.rail_key === "flood" ? { ...r, evaluated_at: old } : r)).status === "UNMEASURED");
  check("predictedFromDryRun reads the dry run's change list", predictedFromDryRun({ counties: [{ countyFips: "48021", changes: [{ rail: "agValuation", unaccounted: 7 }] }] })[0].unaccounted === 7);
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.n}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  return bad ? 1 : 0;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const beforePath = arg("--before"), predictionPath = arg("--prediction"), since = arg("--since");
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!beforePath || !predictionPath || !since) { console.error("usage: --before csv --prediction json --since ISO [--json out]"); process.exit(2); }
  if (!dsn) { console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set"); process.exit(2); }
  const counties = ["48021", "48055", "48209", "48309", "48453", "48491"];
  const before = parseCsv(readFileSync(beforePath, "utf8"));
  const prediction = JSON.parse(readFileSync(predictionPath, "utf8"));
  const readAt = new Date().toISOString();
  let after;
  try { after = readAfter(dsn, counties); } catch (e) { console.error(`UNMEASURED: ${e.message}`); process.exit(2); }
  const res = grade({ before, after, predicted: predictedFromDryRun(prediction), since, counties });
  const out = {
    instrument: "scripts/p252-apply-compare.mjs", readAt, since,
    before: { path: beforePath, sha256: sha(beforePath), rows: before.length },
    prediction: { path: predictionPath, sha256: sha(predictionPath), ranAt: prediction.ranAt },
    ...res,
  };
  const jp = arg("--json");
  if (jp) writeFileSync(jp, JSON.stringify(out, null, 1));
  console.log(`P-252 APPLY COMPARE  ${res.status}  read ${readAt}  since ${since}`);
  for (const [c, v] of Object.entries(res.perCounty)) console.log(`  ${c} pairs=${v.pairs} flipped=${v.flipped} reclassified=${v.reclassified} unchanged=${v.unchanged}`);
  if (res.unwritten.length) console.log(`  not yet rewritten: ${res.unwritten.length}`);
  for (const f of res.failures) console.log(`  FAIL ${f}`);
  for (const n of res.notes.slice(0, 20)) console.log(`  note ${n}`);
  process.exit(res.status === "PASS" ? 0 : res.status === "FAIL" ? 1 : 2);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
