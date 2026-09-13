#!/usr/bin/env node
/**
 * TX CAD source inventory — aggregates the 254 statewide probe artifacts.
 *
 * WHY THIS EXISTS. `_inbox/t6_cad_probe_<fips>.json` artifacts were written by the
 * 2026-08-05 statewide probe batch: 254 of them, one per Texas county. Only tranche 1
 * (35 counties, CAPCOG + AACOG + NCTCOG) was ever transformed into
 * `_catalog/tx_cad_source_registry.json`. The other 219 probes have sat unaggregated,
 * which is why "how many Texas counties have a CAD source" has been argued from memory
 * instead of read from disk.
 *
 * WHAT IT REPORTS. Source availability only. NOT data loaded, NOT served to product.
 * Those are three different states (OPS-1 doctrine note, 2026-08-08) and conflating
 * them is the specific error this instrument exists to stop.
 *
 * Self-tests run in both directions before any aggregation, including a not-vacuous
 * case: a classifier that accepts everything MUST fail.
 *
 * Usage:
 *   node scripts/tx-cad-source-inventory.mjs --self-test
 *   node scripts/tx-cad-source-inventory.mjs --report
 *   node scripts/tx-cad-source-inventory.mjs --report --json out.json
 *
 * Read-only. Touches no database, no network, no product repo.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = join(ROOT, "_inbox");
const PROBE_RE = /^t6_cad_probe_(\d+)\.json$/;

/** Esri-hosted ArcGIS Online: one uniform, self-describing REST API. */
export function hostClass(url) {
  if (!url) return "none";
  const h = (String(url).match(/https?:\/\/([^/]+)/) || [])[1];
  if (!h) return "unparseable";
  if (/^services\d*\.arcgis\.com$/i.test(h)) return "arcgis-online";
  if (/arcgis\.com$/i.test(h)) return "arcgis-other";
  return "self-hosted";
}

/**
 * Source availability, from the probe's own evidence. Deliberately does NOT
 * trust a self-reported status field alone: a url with a successful sample
 * query is stronger evidence than a status string.
 */
export function classify(probe) {
  const url = probe.service_url || null;
  const steps = probe.probe_steps || {};
  const sampleOk = Boolean(steps.sample_query && steps.sample_query.ok);
  const count =
    steps.count && typeof steps.count.count === "number" ? steps.count.count : null;

  if (!url) return { klass: "absent", url: null, sampleOk: false, count: null };
  if (sampleOk || count !== null) {
    return { klass: "reachable", url, sampleOk, count };
  }
  return { klass: "url-unproven", url, sampleOk: false, count: null };
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`SELF-TEST FAIL: ${msg}`);
    process.exit(1);
  }
}

function selfTest() {
  assert(hostClass("https://services7.arcgis.com/x/arcgis/rest/services/A/FeatureServer") === "arcgis-online", "services7 must classify arcgis-online");
  assert(hostClass("https://services.arcgis.com/x/FeatureServer") === "arcgis-online", "bare services.arcgis.com must classify arcgis-online");
  assert(hostClass("https://feature.tnris.org/x") === "self-hosted", "tnris must classify self-hosted");
  assert(hostClass(null) === "none", "null url must classify none");

  const reachable = classify({ service_url: "https://services6.arcgis.com/a/FeatureServer", probe_steps: { sample_query: { ok: true }, count: { count: 1234 } } });
  assert(reachable.klass === "reachable" && reachable.count === 1234, "a url with an ok sample query is reachable");

  const absent = classify({ service_url: null, probe_steps: {} });
  assert(absent.klass === "absent", "no url is absent");

  // A url that proved nothing is NOT reachable. Absent, unproven and reachable
  // are three different states and must not collapse.
  const unproven = classify({ service_url: "https://x/FeatureServer", probe_steps: {} });
  assert(unproven.klass === "url-unproven", "a url with no successful step is unproven, not reachable");
  assert(unproven.klass !== absent.klass, "unproven must not collapse into absent");

  // A probe claiming success with no url and no evidence must NOT read reachable.
  const liar = classify({ service_url: null, probe_status: "verified", probe_steps: {} });
  assert(liar.klass === "absent", "a self-reported status must not override missing evidence");

  // NOT-VACUOUS: a permissive classifier that calls everything reachable must
  // disagree with the real one on a known-bad input.
  const permissive = () => ({ klass: "reachable" });
  assert(
    permissive(absent).klass !== classify({ service_url: null, probe_steps: {} }).klass,
    "NOT-VACUOUS: real classifier must disagree with a permissive one on an absent probe",
  );

  console.log("SELF-TEST PASS (8 checks, both directions, not-vacuous included)");
}

function report(jsonOut) {
  const files = readdirSync(INBOX).filter((f) => PROBE_RE.test(f));
  if (files.length === 0) {
    console.error("UNMEASURED: no t6_cad_probe_*.json artifacts found in _inbox.");
    process.exit(2);
  }

  const rows = [];
  let unparseable = 0;
  for (const f of files) {
    let j;
    try {
      j = JSON.parse(readFileSync(join(INBOX, f), "utf8"));
    } catch {
      unparseable++;
      continue;
    }
    const fips = j.fips || (f.match(PROBE_RE) || [])[1];
    const c = classify(j);
    rows.push({ fips, ...c, host: hostClass(c.url) });
  }

  const by = (pred) => rows.filter(pred);
  const reachable = by((r) => r.klass === "reachable");
  const absent = by((r) => r.klass === "absent");
  const unproven = by((r) => r.klass === "url-unproven");
  const withUrl = by((r) => r.url);

  const hostTally = {};
  for (const r of withUrl) hostTally[r.host] = (hostTally[r.host] || 0) + 1;

  const counted = reachable.filter((r) => typeof r.count === "number");
  const totalParcels = counted.reduce((a, r) => a + r.count, 0);

  const out = {
    id: "tx_cad_source_inventory",
    claim_scope:
      "SOURCE AVAILABILITY ONLY. Not data-loaded, not served-to-product. Three different states (OPS-1 doctrine 2026-08-08).",
    generated_at: new Date().toISOString(),
    instrument: "scripts/tx-cad-source-inventory.mjs",
    evidence: "_inbox/t6_cad_probe_<fips>.json, statewide batch probed 2026-08-05",
    counts: {
      probe_artifacts: files.length,
      unparseable,
      reachable: reachable.length,
      url_unproven: unproven.length,
      absent: absent.length,
      counties_with_feature_count: counted.length,
      parcels_countable_at_source: totalParcels,
    },
    host_class: hostTally,
    absent_fips: absent.map((r) => r.fips).sort(),
    largest_by_probed_count: counted
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((r) => ({ fips: r.fips, count: r.count })),
  };

  console.log(`probe artifacts        ${out.counts.probe_artifacts}`);
  console.log(`reachable at source    ${out.counts.reachable}`);
  console.log(`url present, unproven  ${out.counts.url_unproven}`);
  console.log(`absent at source       ${out.counts.absent}`);
  console.log(`parcels countable      ${totalParcels.toLocaleString()} (across ${counted.length} counties)`);
  console.log(`\nhost class (the adapter lever):`);
  for (const [k, v] of Object.entries(hostTally).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(3)}  ${k}`);
  }
  console.log(`\nabsent at source (${absent.length}): ${out.absent_fips.join(" ")}`);

  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify(out, null, 2) + "\n", "utf8");
    console.log(`\nwrote ${jsonOut}`);
  }
}

const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  selfTest();
} else if (args.includes("--report")) {
  selfTest();
  const i = args.indexOf("--json");
  report(i >= 0 ? args[i + 1] : null);
} else {
  console.error("usage: tx-cad-source-inventory.mjs --self-test | --report [--json out.json]");
  process.exit(64);
}
