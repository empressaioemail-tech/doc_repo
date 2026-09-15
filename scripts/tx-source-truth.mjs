#!/usr/bin/env node
/**
 * TX source truth — one row per county, joining every unaggregated corpus on disk.
 *
 * WHY. Three separate artifact corpora describe Texas county sources and none of them
 * were ever joined:
 *   _inbox/t6_cad_probe_<fips>.json      254 CAD source probes (2026-08-05)
 *   _inbox/*L2_WAVE*_<fips>.json         165 StratMap geometry ingest runs (2026-08)
 *   _catalog/tx_cad_source_registry.json  35 transformed registry rows (tranche 1)
 * So "what do we have for county X" has been answered from memory instead of disk.
 *
 * THE HARRIS LESSON, ENCODED. A previous pass read only `service_url` and classified
 * Harris "absent at source." The same artifact carries `hcad_candidates_probed` showing
 * DNS failures FROM THE PROBE NETWORK (unmeasured, not absent), untested third-party
 * repackages, a `planning_object` flag, and a stratmap count that was itself truncated.
 * Harris subsequently landed 1,523,640 parcel-node atoms verified. So:
 *
 *   NO CAD REST  !=  NO DATA
 *   NO CAD REST  !=  NO ACQUISITION PATH
 *   DNS FAILURE FROM ONE NETWORK  !=  HOST DOES NOT EXIST
 *
 * This instrument reports those as separate states and refuses to collapse them.
 *
 * Usage:
 *   node scripts/tx-source-truth.mjs --self-test
 *   node scripts/tx-source-truth.mjs --report [--json out.json]
 *
 * Read-only. No database, no network, no product repo.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = join(ROOT, "_inbox");
const PROBE_RE = /^t6_cad_probe_(\d+)\.json$/;
const L2_RE = /L2_W(?:AVE|3R)[0-9_a-zA-Z]*_?(48\d{3})\.json$/;

/** CAD attribute source, from the probe's own evidence. Five states, never four. */
export function cadState(probe) {
  const url = probe.service_url || null;
  const steps = probe.probe_steps || {};
  const sampleOk = Boolean(steps.sample_query && steps.sample_query.ok);
  const hasCount = Boolean(steps.count && typeof steps.count.count === "number");

  if (url && (sampleOk || hasCount)) return "rest-reachable";
  if (url) return "rest-unproven";

  // No url. Distinguish "we looked hard and found nothing" from "the probe
  // could not reach anything", which are different claims about the world.
  const cands =
    probe.hcad_candidates_probed ||
    probe.candidates_probed ||
    probe.arcgis_repack_candidates_not_authoritative ||
    null;
  if (cands && cands.length) {
    const allNetworkFailures = cands.every(
      (c) => c.http == null && /dns|resolution|unreachable|getaddrinfo/i.test(String(c.error || "")),
    );
    if (allNetworkFailures) return "rest-unmeasured-network";
    return "rest-absent-searched";
  }
  return "rest-absent";
}

/** Geometry availability at source, independent of CAD. */
export function geomState(probe) {
  const n = probe.stratmap_feature_count;
  if (typeof n === "number" && n > 0) return { state: "stratmap-available", features: n };
  if (probe.no_stratmap || probe.stratmap_in_stratmap === false) return { state: "stratmap-absent", features: null };
  return { state: "unknown", features: null };
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`SELF-TEST FAIL: ${msg}`);
    process.exit(1);
  }
}

function selfTest() {
  assert(
    cadState({ service_url: "https://services6.arcgis.com/a/FeatureServer", probe_steps: { sample_query: { ok: true } } }) === "rest-reachable",
    "url + ok sample = reachable",
  );
  assert(
    cadState({ service_url: "https://x/FeatureServer", probe_steps: {} }) === "rest-unproven",
    "url with no proven step = unproven, never reachable",
  );
  assert(cadState({ service_url: null, probe_steps: {} }) === "rest-absent", "bare no-url = absent");

  // THE HARRIS CASE. All candidates failed DNS from the probe network. That is
  // UNMEASURED. Collapsing it into absent is the defect this function exists for.
  const harris = cadState({
    service_url: null,
    hcad_candidates_probed: [
      { url: "https://arcgis-web.hcad.org/x", http: null, ok: false, error: "DNS resolution failed (getaddrinfo)" },
      { url: "https://gis.hcad.org/x", http: null, ok: false, error: "DNS resolution failed" },
    ],
  });
  assert(harris === "rest-unmeasured-network", `Harris shape must be unmeasured-network, got ${harris}`);
  assert(harris !== "rest-absent", "unmeasured must NOT collapse into absent");

  // A real 404 search is a different claim from a network failure.
  const searched = cadState({
    service_url: null,
    candidates_probed: [{ url: "https://x", http: 404, ok: false, error: "not found" }],
  });
  assert(searched === "rest-absent-searched", "an http-answered miss is searched-absent");
  assert(searched !== harris, "searched-absent and unmeasured-network must be distinct");

  // Geometry is independent of CAD.
  const g = geomState({ stratmap_feature_count: 536512 });
  assert(g.state === "stratmap-available" && g.features === 536512, "stratmap count yields available");
  assert(geomState({}).state === "unknown", "no stratmap evidence is unknown, not absent");

  // NOT-VACUOUS: a permissive classifier calling everything absent must disagree
  // with the real one on the Harris shape.
  const permissive = () => "rest-absent";
  assert(permissive() !== harris, "NOT-VACUOUS: real classifier must disagree with a permissive one on Harris");

  console.log("SELF-TEST PASS (10 checks, both directions, Harris case and not-vacuous included)");
}

function loadL2() {
  const out = {};
  for (const f of readdirSync(INBOX)) {
    const m = f.match(L2_RE);
    if (!m) continue;
    let j;
    try {
      j = JSON.parse(readFileSync(join(INBOX, f), "utf8"));
    } catch {
      continue;
    }
    const fips = j.fips || m[1];
    const dry = j.dry || {};
    out[fips] = {
      pass: j.pass === true,
      halted: Boolean(j.halted),
      haltReason: j.halt_reason || null,
      featuresRead: typeof dry.features === "number" ? dry.features : null,
      rowsPlanned: typeof dry.insert === "number" ? dry.insert : null,
    };
  }
  return out;
}

function report(jsonOut) {
  const probeFiles = readdirSync(INBOX).filter((f) => PROBE_RE.test(f));
  if (probeFiles.length === 0) {
    console.error("UNMEASURED: no t6_cad_probe_*.json artifacts found.");
    process.exit(2);
  }
  const l2 = loadL2();

  let registry = {};
  try {
    const r = JSON.parse(readFileSync(join(ROOT, "_catalog", "tx_cad_source_registry.json"), "utf8"));
    const rows = Array.isArray(r) ? r : r.counties || r.rows || Object.values(r).find(Array.isArray) || [];
    for (const row of rows) if (row.fips) registry[row.fips] = row;
  } catch {
    registry = {};
  }

  const counties = [];
  for (const f of probeFiles) {
    let j;
    try {
      j = JSON.parse(readFileSync(join(INBOX, f), "utf8"));
    } catch {
      continue;
    }
    const fips = j.fips || (f.match(PROBE_RE) || [])[1];
    const geom = geomState(j);
    counties.push({
      fips,
      name: j.county_name || j.name || null,
      cad: cadState(j),
      geometrySource: geom.state,
      geometryFeatures: geom.features,
      geometryIngest: l2[fips] ? (l2[fips].pass ? "pass" : "fail") : "not-run",
      ingestFeaturesRead: l2[fips] ? l2[fips].featuresRead : null,
      inRegistry: Boolean(registry[fips]),
      flags: [
        j.planning_object ? "planning-object" : null,
        j.sharding_required ? "sharding-required" : null,
        j.crosswalk_risk ? "crosswalk-risk" : null,
        typeof j.stratmap_prop_id_bad_rate === "number" && j.stratmap_prop_id_bad_rate >= 0.25 ? "prop-id-bad-rate-high" : null,
      ].filter(Boolean),
    });
  }

  const tally = (f) => {
    const m = {};
    for (const c of counties) m[c[f]] = (m[c[f]] || 0) + 1;
    return m;
  };

  const out = {
    id: "tx_source_truth",
    claim_scope:
      "SOURCE AVAILABILITY and INGEST-RUN outcome. Not served-to-product. Three different states.",
    generated_at: new Date().toISOString(),
    instrument: "scripts/tx-source-truth.mjs",
    evidence: ["_inbox/t6_cad_probe_<fips>.json", "_inbox/*L2_WAVE*_<fips>.json", "_catalog/tx_cad_source_registry.json"],
    counts: {
      counties: counties.length,
      cad: tally("cad"),
      geometry_source: tally("geometrySource"),
      geometry_ingest: tally("geometryIngest"),
      in_registry: counties.filter((c) => c.inRegistry).length,
    },
    flagged: counties.filter((c) => c.flags.length).map((c) => ({ fips: c.fips, name: c.name, flags: c.flags })),
    ingest_failures: counties.filter((c) => c.geometryIngest === "fail").map((c) => ({ fips: c.fips, name: c.name })),
    cad_absent_but_geometry_available: counties.filter(
      (c) => c.cad.startsWith("rest-absent") && c.geometrySource === "stratmap-available",
    ).length,
    counties,
  };

  console.log(`counties            ${out.counts.counties}`);
  console.log(`\nCAD attribute source:`);
  for (const [k, v] of Object.entries(out.counts.cad).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
  console.log(`\ngeometry at source:`);
  for (const [k, v] of Object.entries(out.counts.geometry_source).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
  console.log(`\ngeometry ingest run:`);
  for (const [k, v] of Object.entries(out.counts.geometry_ingest).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
  console.log(`\nCAD-absent BUT geometry available: ${out.cad_absent_but_geometry_available}`);
  console.log(`in tranche-1 registry:             ${out.counts.in_registry}`);
  if (out.ingest_failures.length) console.log(`\ningest failures: ${out.ingest_failures.map((x) => x.fips + " " + (x.name || "")).join(", ")}`);
  if (out.flagged.length) {
    console.log(`\nflagged counties (${out.flagged.length}):`);
    for (const c of out.flagged.slice(0, 15)) console.log(`  ${c.fips} ${(c.name || "").padEnd(12)} ${c.flags.join(", ")}`);
  }

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
  console.error("usage: tx-source-truth.mjs --self-test | --report [--json out.json]");
  process.exit(64);
}
