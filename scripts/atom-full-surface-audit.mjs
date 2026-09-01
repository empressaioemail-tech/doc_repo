#!/usr/bin/env node
/**
 * P-57 full-surface live audit instrument (OPS-16 P-57).
 *
 * Live GET only. Quotes every JSON-root *Fact field by name (state, code, source)
 * on SmartSite PE facets and cortex brokerage facets. Reuses P-47 manifest
 * self-tests for CC honesty (invented roads percent FAILS; 254 not-yet PASSES).
 *
 * Exclusion set:
 *   - Does not atoms --apply, POST recompute, invent CC rows, or start P-52.
 *   - Does not score rails or edit product repos.
 *
 * Usage:
 *   node scripts/atom-full-surface-audit.mjs --self-test
 *   node scripts/atom-full-surface-audit.mjs --live
 */

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fetchLedger as fetchCountyLedger,
  gradeManifest,
  runSelfTests as runManifestSelfTests,
} from "./p47-manifest-instrument.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PE_BASE =
  process.env.PE_FACETS_BASE ||
  "https://smartsite.cloud/api/spine/property-atoms";
const CORTEX_BASE =
  process.env.CORTEX_FACETS_BASE ||
  "https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node";

/** Fixed parcel set per mission_p57_live_audit.md */
export const PARCEL_SET = [
  { label: "gold", parcelNodeId: "48021:34137", why: "908 PINE regression anchor" },
  {
    label: "gold-near-pipeline",
    parcelNodeId: "48021:10048",
    why: "pipeline near hit",
  },
  {
    label: "gold-mud",
    parcelNodeId: "48021:102817",
    why: "special-district present",
  },
  {
    label: "travis",
    parcelNodeId: "48453:281076",
    cortexSubstitute: "48453:587851",
    why: "Travis sample (manifest 281076 cortex bake hole; substitute 587851)",
  },
  {
    label: "harris",
    parcelNodeId: "48201:412831",
    why: "Harris sample (cortex bake hole on probed id)",
  },
  {
    label: "williamson",
    parcelNodeId: "48491:182405",
    why: "Williamson sample (cortex bake hole on probed id)",
  },
  {
    label: "rural",
    parcelNodeId: "48103:1",
    ruralFips: "48103",
    why: "Crane FIPS 48103 geometry satisfied-present, low rail saturation",
  },
];

export const EXPECTED_FACT_FIELDS = [
  "floodHazardFact",
  "landUseFact",
  "specialDistrictFact",
  "pipelineFact",
  "wellFact",
  "buildingFootprintFact",
  "boundaryEdgeFact",
  "ownerFact",
];

/** WDLL item 14: inspect facet source vs CC manifest cell on same county. */
export const INSPECT_MANIFEST_LINKS = [
  {
    factField: "pipelineFact",
    expectedSource: "rrc-pipeline-fact",
    railKey: "rrc-pipelines",
  },
];

export function gradeInspectManifestDivergence({
  countyFips,
  factQuotes,
  manifestCells,
}) {
  const failures = [];
  if (!Array.isArray(manifestCells)) {
    return {
      pass: false,
      failures: ["missing manifestCells[] for divergence guard"],
    };
  }
  for (const link of INSPECT_MANIFEST_LINKS) {
    const cell = manifestCells.find(
      (c) => c.countyFips === countyFips && c.railKey === link.railKey,
    );
    const q = factQuotes[link.factField];
    if (!cell) {
      failures.push(
        `missing manifest cell ${link.railKey} countyFips=${countyFips}`,
      );
      continue;
    }
    const inspectServed =
      q && q.bucket === "present" && q.source === link.expectedSource;
    const manifestScoredPresent = cell.displayState === "satisfied-present";
    if (manifestScoredPresent && !inspectServed) {
      failures.push(
        `inspect/manifest divergence countyFips=${countyFips} rail=${link.railKey}: manifest satisfied-present but ${link.factField} source=${JSON.stringify(q?.source)} bucket=${JSON.stringify(q?.bucket)}`,
      );
    }
    if (inspectServed && cell.displayState === "not-yet") {
      failures.push(
        `inspect/manifest divergence countyFips=${countyFips} rail=${link.railKey}: inspect ${link.factField} present but manifest not-yet`,
      );
    }
  }
  return { pass: failures.length === 0, failures };
}

export function listFactFieldNames(payload) {
  if (!payload || typeof payload !== "object") return [];
  return Object.keys(payload)
    .filter((k) => k.endsWith("Fact"))
    .sort();
}

export function quoteFactFields(payload) {
  const names = listFactFieldNames(payload);
  const quotes = {};
  for (const name of names) {
    const fact = payload[name];
    if (fact === null) {
      quotes[name] = { state: null, code: null, source: null, bucket: "null" };
      continue;
    }
    if (typeof fact !== "object") {
      quotes[name] = {
        state: null,
        code: null,
        source: null,
        bucket: "null",
        raw: fact,
      };
      continue;
    }
    quotes[name] = {
      state: fact.state ?? null,
      code: fact.code ?? null,
      source: fact.source ?? null,
      bucket: classifyFactBucket(fact),
    };
  }
  return quotes;
}

export function classifyFactBucket(fact) {
  if (fact === undefined) return "missing";
  if (fact === null) return "null";
  if (typeof fact !== "object") return "null";
  const state = fact.state;
  if (state === "refused") return "refused";
  if (state === "present" || state === "absent") return "present";
  if (state === null || state === undefined) return "null";
  return "refused";
}

export function missingFactQuotes(fieldNames, quoted) {
  const out = {};
  for (const name of fieldNames) {
    if (!quoted[name]) {
      out[name] = {
        state: null,
        code: null,
        source: null,
        bucket: "missing",
      };
    }
  }
  return out;
}

export function extractSitusAddress(payload) {
  if (!payload || typeof payload !== "object") return null;
  const bf = payload.facets && payload.facets.baseFacts;
  if (bf && typeof bf === "object") {
    const parts = [bf.situsAddress, bf.situsCity, bf.situsState]
      .filter((p) => typeof p === "string" && p.length > 0);
    if (parts.length > 0) return parts.join(", ");
  }
  if (typeof payload.situsAddress === "string") return payload.situsAddress;
  return null;
}

export function detectNotBaked(httpStatus, payload) {
  if (httpStatus === 404) return true;
  if (payload && payload.code === "not_baked") return true;
  if (payload && payload.error === "not_baked") return true;
  return false;
}

function curlExecutable() {
  const names = process.platform === "win32" ? ["curl.exe", "curl"] : ["curl"];
  for (const name of names) {
    const probe = spawnSync(name, ["--version"], {
      encoding: "utf8",
      timeout: 5000,
      windowsHide: true,
    });
    if (probe.status === 0) return name;
  }
  return null;
}

export function fetchJsonUrl(url) {
  const startedAt = new Date().toISOString();
  const curl = curlExecutable();
  if (!curl) {
    return {
      httpStatus: null,
      ok: false,
      error: "curl executable unavailable",
      startedAt,
      fetchedAt: new Date().toISOString(),
      url,
      byteLength: 0,
      json: null,
      headers: {},
      transport: "none",
    };
  }
  const marker = "__P57_HTTP_STATUS__:";
  const headerFile = marker + "HDR";
  const args = [
    ...(process.platform === "win32" ? ["--ssl-no-revoke"] : []),
    "--max-time",
    "60",
    "--connect-timeout",
    "15",
    "-sS",
    "-D",
    "-",
    "-H",
    "Accept: application/json",
    "-w",
    `\n${marker}%{http_code}`,
    url,
  ];
  const run = spawnSync(curl, args, {
    encoding: "utf8",
    timeout: 70_000,
    maxBuffer: 40 * 1024 * 1024,
    windowsHide: true,
  });
  const fetchedAt = new Date().toISOString();
  if (run.error) {
    return {
      httpStatus: null,
      ok: false,
      error: `curl failed: ${run.error.message}`,
      startedAt,
      fetchedAt,
      url,
      byteLength: 0,
      json: null,
      headers: {},
      transport: curl,
    };
  }
  if (run.status !== 0) {
    return {
      httpStatus: null,
      ok: false,
      error: `curl exited ${run.status}: ${(run.stderr || run.stdout || "").slice(0, 400)}`,
      startedAt,
      fetchedAt,
      url,
      byteLength: 0,
      json: null,
      headers: {},
      transport: curl,
    };
  }
  const stdout = run.stdout || "";
  const i = stdout.lastIndexOf(`\n${marker}`);
  if (i < 0) {
    return {
      httpStatus: null,
      ok: false,
      error: "curl status marker missing",
      startedAt,
      fetchedAt,
      url,
      byteLength: stdout.length,
      json: null,
      headers: {},
      transport: curl,
    };
  }
  const headAndBody = stdout.slice(0, i);
  const split = headAndBody.indexOf("\r\n\r\n");
  const headerText = split >= 0 ? headAndBody.slice(0, split) : "";
  const bodyText = split >= 0 ? headAndBody.slice(split + 4) : headAndBody;
  const httpStatus = Number(stdout.slice(i + marker.length + 1));
  const headers = {};
  for (const line of headerText.split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon > 0) {
      headers[line.slice(0, colon).trim().toLowerCase()] = line
        .slice(colon + 1)
        .trim();
    }
  }
  let json = null;
  try {
    json = JSON.parse(bodyText);
  } catch {
    return {
      httpStatus,
      ok: false,
      error: "response is not JSON",
      startedAt,
      fetchedAt,
      url,
      byteLength: bodyText.length,
      json: null,
      headers,
      transport: curl,
    };
  }
  return {
    httpStatus,
    ok: httpStatus === 200 && json !== null,
    error: httpStatus === 200 ? null : `HTTP ${httpStatus}`,
    startedAt,
    fetchedAt,
    url,
    byteLength: bodyText.length,
    json,
    headers,
    transport: curl,
  };
}

export function probeSurface(surface, parcelNodeId) {
  const encoded = encodeURIComponent(parcelNodeId);
  const url =
    surface === "pe"
      ? `${PE_BASE}/${encoded}/facets`
      : `${CORTEX_BASE}/${encoded}/facets`;
  const fetched = fetchJsonUrl(url);
  const payload = fetched.json;
  const quoted = quoteFactFields(payload);
  const allQuotes = {
    ...quoted,
    ...missingFactQuotes(EXPECTED_FACT_FIELDS, quoted),
  };
  return {
    surface,
    parcelNodeId,
    url,
    httpStatus: fetched.httpStatus,
    ok: fetched.ok,
    error: fetched.error,
    startedAt: fetched.startedAt,
    fetchedAt: fetched.fetchedAt,
    transport: fetched.transport,
    readPath:
      surface === "pe"
        ? (payload && payload.readPath) ||
          fetched.headers["x-pe-read-path"] ||
          null
        : null,
    situsAddress: extractSitusAddress(payload),
    notBaked: detectNotBaked(fetched.httpStatus, payload),
    factFieldNames: listFactFieldNames(payload),
    facts: allQuotes,
    rawError:
      payload && typeof payload === "object"
        ? payload.error || payload.message || null
        : null,
  };
}

export function probeParcel(entry) {
  const pe = probeSurface("pe", entry.parcelNodeId);
  const cortexId = entry.cortexSubstitute || entry.parcelNodeId;
  const cortex = probeSurface("cortex", cortexId);
  return {
    label: entry.label,
    parcelNodeId: entry.parcelNodeId,
    cortexParcelNodeId: cortexId,
    cortexSubstitute: entry.cortexSubstitute || null,
    ruralFips: entry.ruralFips || null,
    why: entry.why,
    pe,
    cortex,
  };
}

export function summarizeFamilyBuckets(probes) {
  const summary = {};
  for (const field of EXPECTED_FACT_FIELDS) {
    summary[field] = {
      pe: { present: 0, refused: 0, null: 0, missing: 0 },
      cortex: { present: 0, refused: 0, null: 0, missing: 0 },
    };
  }
  for (const probe of probes) {
    for (const surface of ["pe", "cortex"]) {
      const facts = probe[surface].facts;
      for (const field of EXPECTED_FACT_FIELDS) {
        const row = facts[field] || { bucket: "missing" };
        const bucket = row.bucket || "missing";
        if (summary[field][surface][bucket] !== undefined) {
          summary[field][surface][bucket] += 1;
        }
      }
    }
  }
  return summary;
}

export function fixtureAllGreenCcWithoutScorer() {
  const cells = [];
  for (let i = 1; i <= 507; i += 2) {
    const fips = String(48000 + i);
    cells.push({
      countyFips: fips,
      railKey: "roads",
      displayState: "satisfied-present",
      honestCoveragePct: 99,
    });
  }
  return {
    summary: {
      computedAt: "fixture-all-green-cc",
      servedAt: "fixture-all-green-cc",
      totalCells: cells.length,
      totalRails: 1,
    },
    manifestCells: cells,
  };
}

export function fixtureHonestFacetGold() {
  return {
    readPath: "atom-chain-warm",
    parcelNodeId: "48021:34137",
    floodHazardFact: {
      state: "present",
      source: "flood-hazard-fact",
    },
    ownerFact: {
      state: "refused",
      code: "identified-session-required",
      source: "owner-fact",
    },
    wellFact: {
      state: "refused",
      code: "atom-miss",
      source: "well-fact",
    },
    pipelineFact: {
      state: "present",
      source: "rrc-pipeline-fact",
    },
  };
}

export function fixtureManifestPipelinePresentInspectWrongSource() {
  const countyFips = "48021";
  return {
    summary: {
      computedAt: "fixture-inspect-manifest-diverge",
      servedAt: "fixture-inspect-manifest-diverge",
      totalCells: 1,
      totalRails: 1,
    },
    manifestCells: [
      {
        countyFips,
        railKey: "rrc-pipelines",
        displayState: "satisfied-present",
        honestCoveragePct: 98.26,
        atomFamilyState: "present",
      },
    ],
    factQuotes: {
      pipelineFact: {
        state: "present",
        code: null,
        source: "gis-bake-wrong",
        bucket: "present",
      },
    },
    countyFips,
  };
}

export function fixtureInspectPipelinePresentManifestNotYet() {
  const countyFips = "48021";
  const facts = quoteFactFields({
    pipelineFact: {
      state: "present",
      source: "rrc-pipeline-fact",
    },
  });
  return {
    summary: {
      computedAt: "fixture-inspect-manifest-diverge-b",
      servedAt: "fixture-inspect-manifest-diverge-b",
      totalCells: 1,
      totalRails: 1,
    },
    manifestCells: [
      {
        countyFips,
        railKey: "rrc-pipelines",
        displayState: "not-yet",
        honestCoveragePct: null,
      },
    ],
    factQuotes: facts,
    countyFips,
  };
}

export function runSelfTests() {
  const manifest = runManifestSelfTests();
  const cases = [...manifest.cases];

  const inventedCc = gradeManifest(fixtureAllGreenCcWithoutScorer());
  cases.push({
    name: "all green CC without scorer FAILS",
    expectPass: false,
    pass: inventedCc.pass === false,
    observedPass: inventedCc.pass,
    failures: inventedCc.failures,
    whatWouldProveInstrumentWrong:
      "fixture with 254 roads satisfied-present PASSES (instrument admits green CC without scorer)",
  });

  const goldQuotes = quoteFactFields(fixtureHonestFacetGold());
  const ownerOk =
    goldQuotes.ownerFact &&
    goldQuotes.ownerFact.state === "refused" &&
    goldQuotes.ownerFact.code === "identified-session-required";
  cases.push({
    name: "ownerFact identified-session-required quoted by field name",
    expectPass: true,
    pass: ownerOk,
    observedPass: ownerOk,
    failures: ownerOk ? [] : ["ownerFact quote wrong"],
    whatWouldProveInstrumentWrong:
      "anonymous ownerFact is not identified-session-required",
  });

  const missing = missingFactQuotes(EXPECTED_FACT_FIELDS, {});
  const missingOk = EXPECTED_FACT_FIELDS.every(
    (f) => missing[f] && missing[f].bucket === "missing",
  );
  cases.push({
    name: "empty payload marks expected facts missing",
    expectPass: true,
    pass: missingOk,
    observedPass: missingOk,
    failures: missingOk ? [] : ["missing bucket wrong"],
    whatWouldProveInstrumentWrong: "empty payload does not mark facts missing",
  });

  const divA = fixtureManifestPipelinePresentInspectWrongSource();
  const divAGrade = gradeInspectManifestDivergence(divA);
  cases.push({
    name: "inspect/manifest divergence manifest-present inspect-wrong-source FAILS",
    expectPass: false,
    pass: divAGrade.pass === false,
    observedPass: divAGrade.pass,
    failures: divAGrade.failures,
    whatWouldProveInstrumentWrong:
      "manifest satisfied-present with wrong inspect source PASSES",
  });

  const divB = fixtureInspectPipelinePresentManifestNotYet();
  const divBGrade = gradeInspectManifestDivergence(divB);
  cases.push({
    name: "inspect/manifest divergence inspect-present manifest-not-yet FAILS",
    expectPass: false,
    pass: divBGrade.pass === false,
    observedPass: divBGrade.pass,
    failures: divBGrade.failures,
    whatWouldProveInstrumentWrong:
      "inspect present with manifest not-yet PASSES",
  });

  const divOk = gradeInspectManifestDivergence({
    countyFips: "48021",
    factQuotes: quoteFactFields(fixtureHonestFacetGold()),
    manifestCells: [
      {
        countyFips: "48021",
        railKey: "rrc-pipelines",
        displayState: "satisfied-present",
        honestCoveragePct: 98.26,
      },
    ],
  });
  cases.push({
    name: "inspect/manifest divergence aligned pipeline pair PASSES",
    expectPass: true,
    pass: divOk.pass === true,
    observedPass: divOk.pass,
    failures: divOk.failures,
    whatWouldProveInstrumentWrong: "aligned pipeline pair FAILS",
  });

  const ok = cases.every((c) => c.pass === true);
  return {
    ok,
    manifestOk: manifest.ok,
    cases,
    texasFipsN: manifest.texasFipsN,
  };
}

function parseArgs(argv) {
  const out = { selfTest: false, live: false };
  for (const a of argv) {
    if (a === "--self-test") out.selfTest = true;
    else if (a === "--live") out.live = true;
  }
  if (!out.selfTest && !out.live) out.selfTest = true;
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    process.stdout.write(
      JSON.stringify({ control: "p57-full-surface", selfTest, live: null }, null, 2) +
        "\n",
    );
    process.exit(1);
  }
  if (!args.live) {
    process.stdout.write(
      JSON.stringify({ control: "p57-full-surface", selfTest, live: null }, null, 2) +
        "\n",
    );
    process.exit(0);
  }

  const probes = PARCEL_SET.map((entry) => probeParcel(entry));
  const familySummary = summarizeFamilyBuckets(probes);

  const ledgerFetched = fetchCountyLedger();
  let ccBaseline = null;
  if (ledgerFetched.ok && ledgerFetched.json) {
    const grade = gradeManifest(ledgerFetched.json);
    ccBaseline = {
      url: ledgerFetched.url,
      httpStatus: ledgerFetched.httpStatus,
      fetchedAt: ledgerFetched.fetchedAt,
      transport: ledgerFetched.transport,
      pass: grade.pass,
      failures: grade.failures,
      quotes: grade.quotes,
      byRail: grade.byRail,
      harrisRoads: grade.harrisRoads,
      unspecifiedSatisfiedPresent: grade.unspecifiedSatisfiedPresent,
    };
  } else {
    ccBaseline = {
      pass: false,
      error: ledgerFetched.error,
      httpStatus: ledgerFetched.httpStatus,
    };
  }

  const report = {
    control: "p57-full-surface",
    planRow: "P-57",
    instrument: "scripts/atom-full-surface-audit.mjs",
    probedAt: new Date().toISOString(),
    selfTest: {
      ok: selfTest.ok,
      caseNames: selfTest.cases.map((c) => c.name),
    },
    parcels: probes,
    familySummary,
    ccBaseline,
    ruralFips: "48103",
    ruralSelection: {
      fips: "48103",
      county: "Crane",
      geometryDisplayState: "satisfied-present",
      honestCoveragePct: 100,
      lowRailSaturation: "0 of 6 scored rails satisfied-present on flood/mud/cad/zoning/roads/footprint",
      parcelNodeId: "48103:1",
    },
  };

  const gradePath = join(ROOT, "_inbox", "2026-08-22_p57_full_surface_grade.json");
  writeFileSync(gradePath, JSON.stringify(report, null, 2) + "\n", "utf8");
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(ccBaseline.pass ? 0 : 2);
}

main().catch((err) => {
  process.stderr.write(String(err && err.stack ? err.stack : err) + "\n");
  process.exit(1);
});
