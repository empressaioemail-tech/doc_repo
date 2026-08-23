#!/usr/bin/env node
/**
 * P-63 verdict layer serve instrument (OPS-16 A-024 / WDLL items 4, 6).
 *
 * Grades inspect facet layer absence per 19_the_instrument_contract.md §Layer.
 * Empty HTTP 200 with zero facts and no verdict declaration is the empty-success
 * defect this instrument refuses.
 *
 * Self-tests both directions before any live GET:
 *   metro structural empty chain WITHOUT verdict -> MUST FAIL
 *   same with lookup-failed + required fields -> MUST PASS
 *   not-applicable zoning fixture -> PASS
 *   absent-verified with scope -> PASS
 *   lookup-failed upgraded to absent-verified -> MUST FAIL
 *
 * Exclusion set:
 *   - Does not atoms --apply, POST recompute, or edit product repos.
 *   - Does not score rails or write county_facet_coverage.
 *   - Does not start P-52 or CAMA bulk load.
 *   - Live mode documents GET checks; may fail until deploy (expected).
 *
 * Usage:
 *   node scripts/verdict-layer-serve-selftest.mjs --self-test
 *   node scripts/verdict-layer-serve-selftest.mjs --live
 * --live always runs --self-test first and refuses if a fixture direction fails.
 */

import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "verdict-layer-serve");
const GOLDEN_DIR = join(ROOT, "_inbox", "2026-08-22_p63_verdict_fixtures");
const REGISTRY_PATH = join(ROOT, "_catalog", "tx_cad_source_registry.json");

const PE_BASE =
  process.env.PE_FACETS_BASE ||
  "https://smartsite.cloud/api/spine/property-atoms";
const CORTEX_BASE =
  process.env.CORTEX_FACETS_BASE ||
  "https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node";

export const VALID_VERDICTS = [
  "absent-verified",
  "lookup-failed",
  "not-applicable",
];

export const REQUIRED_ABSENCE_FIELDS = [
  "authority",
  "scopeSearched",
  "asOf",
  "basis",
];

/** Layer fields the live probe quotes by name on facets GET. */
export const LAYER_FACT_FIELDS = [
  "structuralFact",
  "landUseFact",
  "wellFact",
  "buildingFootprintFact",
  "floodHazardFact",
  "specialDistrictFact",
  "pipelineFact",
  "boundaryEdgeFact",
  "ownerFact",
];

export const LIVE_PARCEL_SET = [
  {
    label: "gold",
    parcelNodeId: "48021:34137",
    why: "908 PINE regression anchor",
  },
  {
    label: "dallas-metro",
    parcelNodeId: "48439:14437-2-1",
    countyFips: "48439",
    layerField: "structuralFact",
    expectedVerdict: "lookup-failed",
    why: "Tarrant bulk_primary baked parcel structural lookup-failed",
  },
  {
    label: "unincorporated",
    parcelNodeId: "48055:1",
    countyFips: "48055",
    layerField: "landUseFact",
    expectedVerdict: "not-applicable",
    why: "Caldwell FIPS baked unincorporated unzoned shape (48103:1 cortex not_baked)",
  },
];

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function extractLayerObject(payload, layerField) {
  if (!payload || typeof payload !== "object") return null;
  if (layerField && payload[layerField] !== undefined) {
    return payload[layerField];
  }
  if (payload.layer && typeof payload.layer === "object") {
    return payload.layer;
  }
  return null;
}

export function isPopulatedLayer(layer) {
  if (!layer || typeof layer !== "object") return false;
  if (layer.status === "populated") return true;
  if (layer.state === "present") return true;
  if (
    layer.livingAreaSqft !== undefined ||
    layer.yearBuilt !== undefined ||
    layer.landUseCode !== undefined
  ) {
    return true;
  }
  return false;
}

/**
 * Empty-success: absent layer with no typed verdict and required fields.
 * atom-miss alone is incomplete per WDLL / atom_full_surface.
 */
export function isEmptySuccess(layer) {
  if (layer === null || layer === undefined) return true;
  if (typeof layer !== "object") return true;
  if (isPopulatedLayer(layer)) return false;
  if (layer.status === "absent" && isNonEmptyString(layer.verdict)) {
    return false;
  }
  if (layer.state === "refused" && layer.code === "atom-miss") return true;
  if (layer.state === "refused" && !isNonEmptyString(layer.verdict)) return true;
  if (Object.keys(layer).length === 0) return true;
  if (!isNonEmptyString(layer.verdict) && layer.status !== "absent") return true;
  return false;
}

export function hasRequiredAbsenceFields(layer) {
  const failures = [];
  if (!layer || typeof layer !== "object") {
    return { ok: false, failures: ["layer object missing"] };
  }
  if (layer.status !== "absent") {
    failures.push(`status=${JSON.stringify(layer.status)} (expected absent)`);
  }
  if (!VALID_VERDICTS.includes(layer.verdict)) {
    failures.push(`verdict=${JSON.stringify(layer.verdict)} not in ${VALID_VERDICTS.join("|")}`);
  }
  for (const field of REQUIRED_ABSENCE_FIELDS) {
    if (!isNonEmptyString(layer[field])) {
      failures.push(`missing or empty ${field}`);
    }
  }
  return { ok: failures.length === 0, failures };
}

export function gradeMetroStructural(layer) {
  const failures = [];
  const req = hasRequiredAbsenceFields(layer);
  if (!req.ok) failures.push(...req.failures);
  if (layer?.verdict !== "lookup-failed") {
    failures.push(
      `metro structural absent must be lookup-failed, got ${JSON.stringify(layer?.verdict)}`,
    );
  }
  const basis = String(layer?.basis ?? "").toLowerCase();
  if (!basis.includes("bulk_primary")) {
    failures.push("basis must cite registry bulk_primary");
  }
  if (!basis.includes("stratmap") && !basis.includes("cama")) {
    failures.push("basis must cite stratmap-roll tier or undeclared CAMA load");
  }
  return { pass: failures.length === 0, failures };
}

export function gradeUnincorporatedZoning(layer) {
  const failures = [];
  const req = hasRequiredAbsenceFields(layer);
  if (!req.ok) failures.push(...req.failures);
  if (layer?.verdict !== "not-applicable") {
    failures.push(
      `unincorporated zoning must be not-applicable, got ${JSON.stringify(layer?.verdict)}`,
    );
  }
  if (layer?.verdict === "absent-verified") {
    failures.push("not-applicable must not be scored as absent-verified");
  }
  return { pass: failures.length === 0, failures };
}

export function gradeAbsentVerified(layer) {
  const failures = [];
  const req = hasRequiredAbsenceFields(layer);
  if (!req.ok) failures.push(...req.failures);
  if (layer?.verdict !== "absent-verified") {
    failures.push(
      `expected absent-verified, got ${JSON.stringify(layer?.verdict)}`,
    );
  }
  if (!isNonEmptyString(layer?.scopeSearched)) {
    failures.push("absent-verified requires non-empty scopeSearched");
  }
  return { pass: failures.length === 0, failures };
}

export function gradeUpgradeViolation(layer, upstreamVerdict) {
  const failures = [];
  if (upstreamVerdict === "lookup-failed" && layer?.verdict === "absent-verified") {
    failures.push(
      "lookup-failed upgraded to absent-verified in transit (WDLL item 5)",
    );
  }
  return { pass: failures.length === 0, failures };
}

export function gradeLayerFixture(fixture) {
  const payload = fixture.payload ?? fixture;
  const layerField = fixture.layerField || "structuralFact";
  const layer = extractLayerObject(payload, layerField);
  const shape = fixture.shape || "generic";
  const upstreamVerdict = fixture.upstreamVerdict || null;

  if (isEmptySuccess(layer)) {
    return {
      pass: false,
      failures: ["empty-success: absent layer without typed verdict"],
    };
  }

  if (upstreamVerdict) {
    const upgrade = gradeUpgradeViolation(layer, upstreamVerdict);
    if (!upgrade.pass) return upgrade;
  }

  if (shape === "metro-structural") {
    return gradeMetroStructural(layer);
  }
  if (shape === "unincorporated-zoning") {
    return gradeUnincorporatedZoning(layer);
  }
  if (shape === "incorporated-parcel" || shape === "generic") {
    if (layer?.verdict === "absent-verified") {
      return gradeAbsentVerified(layer);
    }
    if (layer?.verdict === "lookup-failed") {
      return gradeMetroStructural(layer);
    }
    if (layer?.verdict === "not-applicable") {
      return gradeUnincorporatedZoning(layer);
    }
  }

  const req = hasRequiredAbsenceFields(layer);
  return { pass: req.ok, failures: req.failures };
}

export function loadFixtureFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function listFixtureFiles(dir = FIXTURE_DIR) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => join(dir, name));
}

export function runSelfTests() {
  const cases = [];
  const fixtureFiles = listFixtureFiles();

  for (const filePath of fixtureFiles) {
    const fixture = loadFixtureFile(filePath);
    const grade = gradeLayerFixture(fixture);
    const expectPass = fixture.expectGradePass !== false;
    cases.push({
      name: fixture.fixtureId || filePath.split(/[/\\]/).pop(),
      file: filePath,
      expectPass,
      pass: grade.pass === expectPass,
      observedPass: grade.pass,
      failures: grade.failures,
      whatWouldProveInstrumentWrong: expectPass
        ? "this fixture FAILS (instrument rejects honest typed absence)"
        : "this fixture PASSES (instrument admits empty-success or verdict upgrade)",
    });
  }

  const empty = gradeLayerFixture({
    shape: "metro-structural",
    layerField: "structuralFact",
    expectGradePass: false,
    payload: { structuralFact: null },
  });
  cases.push({
    name: "null structuralFact FAILS (not vacuous)",
    expectPass: false,
    pass: empty.pass === false,
    observedPass: empty.pass,
    failures: empty.failures,
    whatWouldProveInstrumentWrong: "null structuralFact PASSES (instrument is vacuous-pass)",
  });

  const atomMiss = gradeLayerFixture({
    shape: "metro-structural",
    layerField: "structuralFact",
    expectGradePass: false,
    payload: {
      structuralFact: { state: "refused", code: "atom-miss", source: "structural-fact" },
    },
  });
  cases.push({
    name: "atom-miss without verdict FAILS",
    expectPass: false,
    pass: atomMiss.pass === false,
    observedPass: atomMiss.pass,
    failures: atomMiss.failures,
    whatWouldProveInstrumentWrong:
      "atom-miss-only structuralFact PASSES (instrument admits incomplete absence)",
  });

  const ok = cases.every((c) => c.pass === true);
  return { ok, cases, fixtureCount: fixtureFiles.length };
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
      transport: "none",
    };
  }
  const marker = "__P63_HTTP_STATUS__:";
  const args = [
    ...(process.platform === "win32" ? ["--ssl-no-revoke"] : []),
    "--max-time",
    "60",
    "--connect-timeout",
    "15",
    "-sS",
    "-H",
    "Accept: application/json",
    "-w",
    `\n${marker}%{http_code}`,
    url,
  ];
  const run = spawnSync(curl, args, {
    encoding: "utf8",
    timeout: 70_000,
    maxBuffer: 20 * 1024 * 1024,
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
      transport: curl,
    };
  }
  const bodyText = stdout.slice(0, i);
  const httpStatus = Number(stdout.slice(i + marker.length + 1));
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
    transport: curl,
  };
}

export function quoteLayerFacts(payload) {
  const quotes = {};
  for (const field of LAYER_FACT_FIELDS) {
    const layer = payload && payload[field];
    if (layer === undefined) {
      quotes[field] = { bucket: "missing" };
      continue;
    }
    if (layer === null) {
      quotes[field] = { bucket: "null" };
      continue;
    }
    quotes[field] = {
      bucket: isPopulatedLayer(layer)
        ? "populated"
        : isEmptySuccess(layer)
          ? "empty-success"
          : "absent-typed",
      status: layer.status ?? null,
      state: layer.state ?? null,
      verdict: layer.verdict ?? null,
      code: layer.code ?? null,
      authority: layer.authority ?? null,
      scopeSearched: layer.scopeSearched ?? null,
      asOf: layer.asOf ?? null,
      basis: layer.basis ?? null,
      source: layer.source ?? null,
    };
  }
  return quotes;
}

export function probeSurface(surface, parcelNodeId) {
  const encoded = encodeURIComponent(parcelNodeId);
  const url =
    surface === "pe"
      ? `${PE_BASE}/${encoded}/facets`
      : `${CORTEX_BASE}/${encoded}/facets`;
  const fetched = fetchJsonUrl(url);
  const payload = fetched.json;
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
    layerFacts: quoteLayerFacts(payload),
    readPath: payload?.readPath ?? null,
  };
}

function gradeLiveLayerQuote(quote, shape, layerField) {
  const layer =
    quote && quote.bucket !== "missing" && quote.bucket !== "null"
      ? {
          status: quote.status,
          verdict: quote.verdict,
          authority: quote.authority,
          scopeSearched: quote.scopeSearched,
          asOf: quote.asOf,
          basis: quote.basis,
          state: quote.state,
          code: quote.code,
          source: quote.source,
        }
      : null;
  return gradeLayerFixture({
    shape,
    layerField,
    payload: { [layerField]: layer },
  });
}

export function probeLiveParcel(entry) {
  const pe = probeSurface("pe", entry.parcelNodeId);
  const cortex = probeSurface("cortex", entry.parcelNodeId);
  const layerField = entry.layerField || "structuralFact";
  const shape =
    entry.expectedVerdict === "lookup-failed"
      ? "metro-structural"
      : entry.expectedVerdict === "not-applicable"
        ? "unincorporated-zoning"
        : "incorporated-parcel";
  const peGrade = gradeLiveLayerQuote(pe.layerFacts[layerField], shape, layerField);
  const cortexGrade = gradeLiveLayerQuote(
    cortex.layerFacts[layerField],
    shape,
    layerField,
  );
  return {
    label: entry.label,
    parcelNodeId: entry.parcelNodeId,
    countyFips: entry.countyFips || null,
    layerField,
    expectedVerdict: entry.expectedVerdict || null,
    why: entry.why,
    pe,
    cortex,
    peGrade,
    cortexGrade,
    deployReady: entry.expectedVerdict
      ? peGrade.pass && cortexGrade.pass
      : null,
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
      JSON.stringify({ control: "p63-verdict-serve", selfTest, live: null }, null, 2) +
        "\n",
    );
    process.exit(1);
  }
  if (!args.live) {
    process.stdout.write(
      JSON.stringify(
        { control: "p63-verdict-serve", selfTest, live: null },
        null,
        2,
      ) + "\n",
    );
    process.exit(0);
  }

  const probes = LIVE_PARCEL_SET.map((entry) => probeLiveParcel(entry));
  const anyLivePass = probes.some(
    (p) => p.expectedVerdict && p.deployReady === true,
  );
  const report = {
    control: "p63-verdict-serve",
    planRow: "P-63",
    instrument: "scripts/verdict-layer-serve-selftest.mjs",
    probedAt: new Date().toISOString(),
    note: "Live checks may fail until cortex-api + PE deploy verdict fields. Document only.",
    selfTest: {
      ok: selfTest.ok,
      caseNames: selfTest.cases.map((c) => c.name),
    },
    goldenFixtures: readdirSync(GOLDEN_DIR)
      .filter((n) => n.endsWith(".json"))
      .map((n) => join("_inbox", "2026-08-22_p63_verdict_fixtures", n)),
    parcels: probes,
    livePass: anyLivePass,
    deployBlocked: !anyLivePass,
  };
  const gradePath = join(ROOT, "_inbox", "2026-08-22_p63_verdict_serve_live.json");
  writeFileSync(gradePath, JSON.stringify(report, null, 2) + "\n", "utf8");
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(anyLivePass ? 0 : 2);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(String(err && err.stack ? err.stack : err) + "\n");
    process.exit(1);
  });
}
