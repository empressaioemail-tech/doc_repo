#!/usr/bin/env node
/**
 * P-77 Travis identity-join MEASURE instrument (OPS-16 P-77 / Lane 3 WDLL item 3).
 *
 * SQL only. Grades cad_property join-hit / join-miss / vintage-gap / unmeasured
 * on a named Simsbrook/Dashwood block and a stated Travis sample, at declared
 * vintage 2026/cad-export. A-027 held the serve / honest-miss half.
 *
 * Join key (M02 T48453): cad_property (county_fips, normalizeCadPropId(prop_id))
 * at declared vintage. Map node 48453:280238 is StratMap prop_id. geo_id is
 * refused. Latest-tax_year fallback is the defect (L9).
 *
 * Self-tests both directions before any SQL:
 *   map node + cad row at 2026/cad-export -> HIT
 *   map node + no cad row at declared vintage -> MISS
 *   map node + cad row only at other vintage -> VINTAGE-GAP
 *   cad_property not queried / error -> UNMEASURED (not zero miss)
 *   not-vacuous: a predicate that matches every node MUST FAIL
 *
 * Live SQL is parameterized EXISTS against the named IDs only. A 48453
 * county-wide scan is forbidden (~493k-835k rows).
 *
 * Usage:
 *   node scripts/p77-travis-join-measure.mjs --self-test
 *   node scripts/p77-travis-join-measure.mjs --live
 * --live always runs --self-test first. Missing DEPLOYMENT_DATABASE_URL
 * exits 2 with UNMEASURED (does not fake hits).
 *
 * Exclusion set:
 *   - Does not change PE or LDT product code.
 *   - Does not --apply atoms, rebake tiles, or flip L17 vintage.
 *   - Does not treat registry prop_id_bad_rate 0.51 as the grade.
 *   - Does not invent a geo_id join.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "p77-travis-join");
const REPORT_PATH = join(
  ROOT,
  "_inbox",
  "2026-08-24_p77_travis_join_measure.json",
);

export const CONTROL = "p77-travis-join-measure";
export const PLAN_ROW = "P-77";
export const COUNTY_FIPS = "48453";
export const DECLARED_VINTAGE = "2026/cad-export";
export const DECLARED_TAX_YEAR = 2026;
export const DECLARED_TIER = "cad-export";
export const MAX_NAMED_IDS = 64;

/** Diagnosis miss class. Verified in 2026-08-24_travis_block_completeness_diagnosis.md. */
export const MISS_CLASS = ["48453:280238"];

/** Diagnosis hit class. 280239 plus at least one of 280210 / 280211. */
export const HIT_CLASS = ["48453:280239", "48453:280210", "48453:280211"];

/**
 * Named block = the ten-lot Simsbrook / Dashwood walk.
 * Sample = that walk plus 48453:280230 (16911 Simsbrook, listed neighbor).
 * N is stated. IDs not listed in the diagnosis or the same-neighborhood
 * write-path audit are not invented.
 */
export const NAMED_BLOCK = [
  "48453:280238",
  "48453:280239",
  "48453:280240",
  "48453:280209",
  "48453:280236",
  "48453:280233",
  "48453:280234",
  "48453:280237",
  "48453:280211",
  "48453:280210",
];

export const TRAVIS_SAMPLE = [...NAMED_BLOCK, "48453:280230"];
export const SAMPLE_N = TRAVIS_SAMPLE.length;

const VALID_GRADES = ["hit", "miss", "vintage-gap", "unmeasured"];

/**
 * Mirror of LDT parcelNodeId.normalizeCadPropId (origin/main). Leading zeros
 * stripped from an all-digit id; non-numeric ids left untouched.
 */
export function normalizeCadPropId(propId) {
  const t = String(propId ?? "").trim();
  if (!/^\d+$/.test(t)) return t;
  return t.replace(/^0+(?=\d)/, "");
}

export function parseParcelNodeId(nodeId) {
  const raw = String(nodeId ?? "").trim();
  const i = raw.indexOf(":");
  if (i <= 0) return null;
  const countyFips = raw.slice(0, i).trim();
  const propId = normalizeCadPropId(raw.slice(i + 1));
  if (!/^\d{5}$/.test(countyFips) || !propId) return null;
  return { countyFips, propId, parcelNodeId: `${countyFips}:${propId}` };
}

export function parseDeclaredVintage(vintage) {
  const raw = String(vintage ?? "").trim();
  const m = raw.match(/^(\d{4})\/([a-z0-9-]+)$/i);
  if (!m) return null;
  return { taxYear: Number(m[1]), tier: m[2], vintage: raw };
}

export function emptyCounts() {
  return { hit: 0, miss: 0, vintage_gap: 0, unmeasured: 0 };
}

export function tallyGrades(grades) {
  const counts = emptyCounts();
  for (const grade of grades) {
    if (grade === "hit") counts.hit += 1;
    else if (grade === "miss") counts.miss += 1;
    else if (grade === "vintage-gap") counts.vintage_gap += 1;
    else counts.unmeasured += 1;
  }
  return counts;
}

/** WDLL three-bucket rollup. vintage-gap is a declared-vintage miss. */
export function rollupCounts(counts) {
  return {
    hit: counts.hit,
    miss: counts.miss + counts.vintage_gap,
    unmeasured: counts.unmeasured,
  };
}

/**
 * Grade one map node against independently supplied cad_property rows.
 * queryState other than "ok" is UNMEASURED. Never emits miss on a failed
 * or skipped query.
 */
export function gradeNode(input) {
  const node = parseParcelNodeId(input.parcelNodeId);
  if (!node || input.inMapList !== true) {
    return {
      parcelNodeId: input.parcelNodeId ?? null,
      grade: "unmeasured",
      basis: "node missing, unparseable, or not in the map list",
      hitAtDeclared: false,
      otherVintage: false,
    };
  }

  const vintage = parseDeclaredVintage(
    input.declaredVintage ?? DECLARED_VINTAGE,
  );
  if (!vintage) {
    return {
      parcelNodeId: node.parcelNodeId,
      grade: "unmeasured",
      basis: "declared vintage unparseable",
      hitAtDeclared: false,
      otherVintage: false,
    };
  }

  const query = input.cadQuery ?? {};
  if (query.state !== "ok") {
    return {
      parcelNodeId: node.parcelNodeId,
      grade: "unmeasured",
      basis:
        query.state === "error"
          ? `cad_property query error: ${query.error || "unspecified"}`
          : "cad_property not queried",
      hitAtDeclared: false,
      otherVintage: false,
    };
  }

  const rows = Array.isArray(query.rows) ? query.rows : [];
  let hitAtDeclared = false;
  let otherVintage = false;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    if (String(row.county_fips) !== node.countyFips) continue;
    if (normalizeCadPropId(row.prop_id) !== node.propId) continue;
    if (Number(row.tax_year) === vintage.taxYear) hitAtDeclared = true;
    else otherVintage = true;
  }

  if (hitAtDeclared) {
    return {
      parcelNodeId: node.parcelNodeId,
      grade: "hit",
      basis: `cad_property row at ${vintage.vintage}`,
      hitAtDeclared: true,
      otherVintage,
    };
  }
  if (otherVintage) {
    return {
      parcelNodeId: node.parcelNodeId,
      grade: "vintage-gap",
      basis: `cad_property row exists but not at ${vintage.vintage}`,
      hitAtDeclared: false,
      otherVintage: true,
    };
  }
  return {
    parcelNodeId: node.parcelNodeId,
    grade: "miss",
    basis: `no cad_property row at ${vintage.vintage}`,
    hitAtDeclared: false,
    otherVintage: false,
  };
}

/** Vacuous grader: would stamp HIT on every node. Self-test must reject it. */
export function vacuousAlwaysHitPredicate() {
  return "hit";
}

export function isPredicateVacuous(predicate, fixtures) {
  if (!Array.isArray(fixtures) || fixtures.length < 2) return true;
  return fixtures.every((fixture) => {
    const observed =
      typeof predicate === "function"
        ? predicate(fixture)
        : vacuousAlwaysHitPredicate(fixture);
    return observed === "hit";
  });
}

export function assertNamedIdList(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error("named node list empty (would unmeasure or scan)");
  }
  if (nodes.length > MAX_NAMED_IDS) {
    throw new Error(
      `named node list ${nodes.length} exceeds cap ${MAX_NAMED_IDS}`,
    );
  }
  const seen = new Set();
  const parsed = [];
  for (const nodeId of nodes) {
    const node = parseParcelNodeId(nodeId);
    if (!node) throw new Error(`unparseable parcel_node_id: ${nodeId}`);
    if (node.countyFips !== COUNTY_FIPS) {
      throw new Error(`refusing non-Travis node ${node.parcelNodeId}`);
    }
    if (!/^\d+$/.test(node.propId)) {
      throw new Error(`prop_id is not all-digit: ${node.propId}`);
    }
    if (seen.has(node.parcelNodeId)) continue;
    seen.add(node.parcelNodeId);
    parsed.push(node);
  }
  return parsed;
}

/**
 * Build the live EXISTS query. Bound to named prop_ids only.
 * Refuse any shape that could become a 48453 table scan.
 */
export function buildLiveSql({
  countyFips = COUNTY_FIPS,
  taxYear = DECLARED_TAX_YEAR,
  propIds,
}) {
  if (!/^\d{5}$/.test(String(countyFips))) {
    throw new Error(`county_fips not a 5-digit FIPS: ${countyFips}`);
  }
  if (!Number.isInteger(taxYear) || taxYear < 1990 || taxYear > 2100) {
    throw new Error(`tax_year out of range: ${taxYear}`);
  }
  if (!Array.isArray(propIds) || propIds.length === 0) {
    throw new Error("propIds empty; refusing unbounded cad_property read");
  }
  if (propIds.length > MAX_NAMED_IDS) {
    throw new Error(`propIds ${propIds.length} exceeds cap ${MAX_NAMED_IDS}`);
  }
  const normalized = [];
  for (const raw of propIds) {
    const id = normalizeCadPropId(raw);
    if (!/^\d+$/.test(id)) {
      throw new Error(`prop_id is not all-digit after normalize: ${raw}`);
    }
    normalized.push(id);
  }

  // Digit-only literals only. psql -c does not interpolate :'var' (live
  // fail 2026-08-25T02:07:22Z: syntax error at ":"). Do not regress.
  const fipsLit = String(countyFips);
  const yearLit = String(taxYear);
  const idsLit = normalized.join(",");
  const sql = [
    "BEGIN TRANSACTION READ ONLY;",
    "SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.prop_id), '[]'::json)",
    "FROM (",
    "  WITH wanted(county_fips, prop_id) AS (",
    `    SELECT '${fipsLit}'::text, unnest(string_to_array('${idsLit}', ','))`,
    "  )",
    "  SELECT",
    "    w.county_fips,",
    "    w.prop_id,",
    "    (w.county_fips || ':' || w.prop_id) AS parcel_node_id,",
    "    EXISTS (",
    "      SELECT 1 FROM cad_property c",
    "      WHERE c.county_fips = w.county_fips",
    "        AND c.prop_id = w.prop_id",
    "        AND c.tax_year = " + yearLit,
    "    ) AS hit_at_declared,",
    "    EXISTS (",
    "      SELECT 1 FROM cad_property c",
    "      WHERE c.county_fips = w.county_fips",
    "        AND c.prop_id = w.prop_id",
    "        AND c.tax_year IS DISTINCT FROM " + yearLit,
    "    ) AS other_vintage,",
    "    EXISTS (",
    "      SELECT 1 FROM cad_property c",
    "      WHERE c.county_fips = w.county_fips",
    "        AND NULLIF(TRIM(LEADING '0' FROM c.prop_id), '') = w.prop_id",
    "        AND c.prop_id IS DISTINCT FROM w.prop_id",
    "    ) AS leading_zero_orphan",
    "  FROM wanted w",
    ") t;",
    "COMMIT;",
  ].join("\n");

  assertSafeNamedIdQuery(sql, normalized);
  return {
    sql,
    params: {
      county_fips: String(countyFips),
      tax_year: String(taxYear),
      prop_ids: normalized.join(","),
    },
    propIds: normalized,
  };
}

export function assertSafeNamedIdQuery(sql, propIds) {
  const text = String(sql);
  if (!Array.isArray(propIds) || propIds.length === 0) {
    throw new Error("safe-query refuse: empty prop id list");
  }
  if (/\bgeo_id\b/i.test(text)) {
    throw new Error("safe-query refuse: geo_id join is forbidden on P-77");
  }
  if (!/\bcad_property\b/i.test(text)) {
    throw new Error("safe-query refuse: cad_property not named");
  }
  if (!/\bprop_id\b/i.test(text)) {
    throw new Error("safe-query refuse: no prop_id predicate");
  }
  if (!/\btax_year\b/i.test(text)) {
    throw new Error("safe-query refuse: no tax_year predicate (L9)");
  }
  if (/:'[a-z_]+'/i.test(text)) {
    throw new Error("safe-query refuse: psql :'var' is not interpolated by -c");
  }
  if (!/\bunnest\b/i.test(text) && !/\bANY\s*\(/i.test(text)) {
    throw new Error("safe-query refuse: named-id unnest/ANY missing");
  }
  if (
    /FROM\s+cad_property\b[^;]*WHERE\s+c(?:ounty)?_fips/i.test(text) &&
    !/FROM\s+cad_property\s+\w+\s+WHERE[\s\S]*prop_id/i.test(text)
  ) {
    throw new Error("safe-query refuse: county-only cad_property scan");
  }
  return true;
}

export function countyWideScanSql(countyFips = COUNTY_FIPS) {
  return `SELECT COUNT(*) FROM cad_property WHERE county_fips = '${countyFips}'`;
}

export function loadFixtureFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function listFixtureFiles(dir = FIXTURE_DIR) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => join(dir, name));
}

function caseResult({ name, expectPass, pass, observed, failures, falsifier }) {
  return {
    name,
    expectPass,
    pass,
    observed,
    failures,
    whatWouldProveInstrumentWrong: falsifier,
  };
}

export function runSelfTests() {
  const cases = [];
  const fixtureFiles = listFixtureFiles();
  const fixtures = fixtureFiles.map((filePath) => ({
    filePath,
    fixture: loadFixtureFile(filePath),
  }));

  for (const { filePath, fixture } of fixtures) {
    const graded = gradeNode({
      parcelNodeId: fixture.parcelNodeId,
      inMapList: fixture.inMapList,
      declaredVintage: fixture.declaredVintage,
      cadQuery: fixture.cadQuery,
    });
    const expectGrade = fixture.expectGrade;
    const pass = graded.grade === expectGrade;
    cases.push(
      caseResult({
        name: fixture.fixtureId || filePath.split(/[/\\]/).pop(),
        expectPass: true,
        pass,
        observed: graded,
        failures: pass
          ? []
          : [`expected ${expectGrade}, got ${graded.grade}`],
        falsifier: `this fixture grades ${expectGrade === "hit" ? "MISS/UNMEASURED" : "HIT"} (wrong direction)`,
      }),
    );
  }

  const notQueried = gradeNode({
    parcelNodeId: "48453:280239",
    inMapList: true,
    declaredVintage: DECLARED_VINTAGE,
    cadQuery: { state: "not-queried", rows: [] },
  });
  cases.push(
    caseResult({
      name: "cad_property not queried -> UNMEASURED",
      expectPass: true,
      pass: notQueried.grade === "unmeasured",
      observed: notQueried,
      failures:
        notQueried.grade === "unmeasured"
          ? []
          : [`expected unmeasured, got ${notQueried.grade}`],
      falsifier: "skipped query grades miss (fabricated zero-miss)",
    }),
  );

  const errorNodes = TRAVIS_SAMPLE.map((parcelNodeId) =>
    gradeNode({
      parcelNodeId,
      inMapList: true,
      declaredVintage: DECLARED_VINTAGE,
      cadQuery: { state: "error", error: "connection refused", rows: [] },
    }),
  );
  const errorCounts = tallyGrades(errorNodes.map((g) => g.grade));
  const errorHonest =
    errorCounts.unmeasured === TRAVIS_SAMPLE.length &&
    errorCounts.miss === 0 &&
    errorCounts.hit === 0;
  cases.push(
    caseResult({
      name: "query error is UNMEASURED not zero miss",
      expectPass: true,
      pass: errorHonest,
      observed: errorCounts,
      failures: errorHonest
        ? []
        : ["error path collapsed into hit or miss"],
      falsifier: "error path reports miss=N or hit>0",
    }),
  );

  const vacuous = isPredicateVacuous(
    vacuousAlwaysHitPredicate,
    fixtures.map((f) => f.fixture),
  );
  cases.push(
    caseResult({
      name: "not-vacuous: always-hit predicate is detected",
      expectPass: true,
      pass: vacuous === true,
      observed: { vacuous },
      failures: vacuous ? [] : ["always-hit predicate was not flagged"],
      falsifier:
        "always-hit predicate is not detected (instrument cannot see vacuity)",
    }),
  );

  const ownGrades = fixtures.map(({ fixture }) =>
    gradeNode({
      parcelNodeId: fixture.parcelNodeId,
      inMapList: fixture.inMapList,
      declaredVintage: fixture.declaredVintage,
      cadQuery: fixture.cadQuery,
    }),
  );
  const ownVacuous = ownGrades.every((g) => g.grade === "hit");
  const missFixtureHit = ownGrades.some(
    (g, i) =>
      fixtures[i].fixture.expectGrade === "miss" && g.grade === "hit",
  );
  cases.push(
    caseResult({
      name: "not-vacuous: gradeNode does not HIT every fixture",
      expectPass: true,
      pass: ownVacuous === false && missFixtureHit === false,
      observed: { ownVacuous, missFixtureHit, grades: ownGrades.map((g) => g.grade) },
      failures:
        ownVacuous || missFixtureHit
          ? ["gradeNode matches every node or promotes the miss fixture"]
          : [],
      falsifier: "gradeNode returns hit for the no-row fixture",
    }),
  );

  let liveSqlOk = false;
  let liveSqlError = null;
  let builtSql = "";
  try {
    const built = buildLiveSql({
      countyFips: COUNTY_FIPS,
      taxYear: DECLARED_TAX_YEAR,
      propIds: TRAVIS_SAMPLE.map((id) => parseParcelNodeId(id).propId),
    });
    builtSql = built.sql;
    liveSqlOk =
      Boolean(built.sql && built.params.prop_ids) &&
      built.sql.includes("280238") &&
      built.sql.includes("2026") &&
      built.sql.includes("LEADING") &&
      !/:'[a-z_]+'/i.test(built.sql);
  } catch (error) {
    liveSqlError = error.message;
  }
  cases.push(
    caseResult({
      name: "named-id EXISTS SQL builds and passes the scan guard",
      expectPass: true,
      pass: liveSqlOk,
        observed: { liveSqlOk, liveSqlError, hasPsqlVar: /:'[a-z_]+'/i.test(builtSql) },
        failures: liveSqlOk ? [] : [liveSqlError || "buildLiveSql failed or still uses :'var'"],
        falsifier: "named-id SQL is refused, omits tax_year / prop_id, or uses :'var'",
    }),
  );

  let scanRefused = false;
  try {
    assertSafeNamedIdQuery(countyWideScanSql(), ["280238"]);
  } catch {
    scanRefused = true;
  }
  cases.push(
    caseResult({
      name: "county-wide 48453 scan SQL is refused",
      expectPass: true,
      pass: scanRefused,
      observed: { scanRefused },
      failures: scanRefused ? [] : ["county-wide COUNT was admitted"],
      falsifier: "county-wide cad_property scan is treated as safe",
    }),
  );

  let geoRefused = false;
  try {
    assertSafeNamedIdQuery(
      "SELECT 1 FROM cad_property c WHERE c.geo_id = ANY(ARRAY['x']) AND c.tax_year = 2026 AND c.prop_id = ANY(ARRAY['1']) AND unnest",
      ["280238"],
    );
  } catch {
    geoRefused = true;
  }
  cases.push(
    caseResult({
      name: "geo_id join SQL is refused",
      expectPass: true,
      pass: geoRefused,
      observed: { geoRefused },
      failures: geoRefused ? [] : ["geo_id SQL was admitted"],
      falsifier: "geo_id join is treated as the P-77 key",
    }),
  );

  const leadingZero = normalizeCadPropId("000280239");
  cases.push(
    caseResult({
      name: "normalizeCadPropId strips leading zeros",
      expectPass: true,
      pass: leadingZero === "280239",
      observed: { leadingZero },
      failures: leadingZero === "280239" ? [] : [`got ${leadingZero}`],
      falsifier: "000280239 does not normalize to 280239",
    }),
  );

  const leaked = redactSecrets(
    "psql exited 2: connection to postgres://user:secret@host/db failed",
  );
  const redactOk =
    !leaked.includes("secret") &&
    !leaked.includes("postgres://user") &&
    leaked.includes("postgres://REDACTED");
  cases.push(
    caseResult({
      name: "live error text redacts postgres URLs",
      expectPass: true,
      pass: redactOk,
      observed: { leaked },
      failures: redactOk ? [] : ["URL still present in error text"],
      falsifier: "a postgres URL survives redactSecrets",
    }),
  );

  const ok = cases.every((c) => c.pass === true);
  return {
    ok,
    cases,
    fixtureCount: fixtureFiles.length,
    sampleN: SAMPLE_N,
    namedBlockN: NAMED_BLOCK.length,
  };
}

function gitSnapshot() {
  const run = (args) => {
    const result = spawnSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 10_000,
      windowsHide: true,
    });
    if (result.status !== 0) return null;
    return (result.stdout || "").trim() || null;
  };
  return {
    repository: "P:/doc_repo",
    branch: run(["rev-parse", "--abbrev-ref", "HEAD"]),
    commit: run(["rev-parse", "HEAD"]),
  };
}

export function redactSecrets(text) {
  return String(text ?? "")
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://REDACTED")
    .replace(/DEPLOYMENT_DATABASE_URL=\S+/gi, "DEPLOYMENT_DATABASE_URL=REDACTED")
    .replace(/CORTEX_DATABASE_URL=\S+/gi, "CORTEX_DATABASE_URL=REDACTED");
}

function command(name, args, options = {}) {
  const run = spawnSync(name, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout: options.timeout ?? 30_000,
    maxBuffer: 8 * 1024 * 1024,
    env: options.env ?? process.env,
    windowsHide: true,
  });
  if (run.error) throw new Error(`${name} failed: ${redactSecrets(run.error.message)}`);
  if (run.status !== 0) {
    throw new Error(
      redactSecrets(
        `${name} exited ${run.status}: ${(run.stderr || run.stdout || "").slice(0, 400)}`,
      ),
    );
  }
  return { stdout: run.stdout, stderr: run.stderr };
}

function resolveExecutable(names) {
  for (const name of names) {
    try {
      command(name, ["--version"], { timeout: 5_000 });
      return name;
    } catch {
      // next candidate
    }
  }
  return null;
}

function gcloudReadSecret(secret, project) {
  const args = [
    "secrets",
    "versions",
    "access",
    "latest",
    `--secret=${secret}`,
    `--project=${project}`,
  ];
  if (process.platform === "win32") {
    const gcloudCmd =
      "C:\\Users\\cente\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd";
    if (existsSync(gcloudCmd)) {
      const quoted = [gcloudCmd, ...args]
        .map((part) => `'${String(part).replaceAll("'", "''")}'`)
        .join(" ");
      return command("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `& ${quoted}`,
      ]).stdout.trim();
    }
  }
  for (const executable of ["gcloud", "gcloud.cmd"]) {
    try {
      return command(executable, args).stdout.trim();
    } catch {
      // next
    }
  }
  throw new Error("gcloud unavailable");
}

export function resolveDeploymentDbUrlFromEnv(env = process.env) {
  for (const name of ["DEPLOYMENT_DATABASE_URL", "CORTEX_DATABASE_URL"]) {
    const value = env[name]?.trim();
    if (value) return { value, source: `env:${name}` };
  }
  return null;
}

export function resolveDeploymentDbUrl() {
  const fromEnv = resolveDeploymentDbUrlFromEnv();
  if (fromEnv) return fromEnv;
  let value;
  try {
    value = gcloudReadSecret(
      "DEPLOYMENT_DATABASE_URL",
      "legacy-design-tools-prod",
    );
  } catch (error) {
    throw new Error(
      `no deployment DB env and gcloud secret read failed: ${error.message}`,
    );
  }
  if (!value) throw new Error("DEPLOYMENT_DATABASE_URL secret was empty");
  return {
    value,
    source: "gcloud:legacy-design-tools-prod/DEPLOYMENT_DATABASE_URL:latest",
  };
}

function rowsFromLiveJson(payload, nodes) {
  const byId = new Map();
  for (const row of payload) {
    if (!row || typeof row !== "object") continue;
    const node = parseParcelNodeId(
      row.parcel_node_id || `${row.county_fips}:${row.prop_id}`,
    );
    if (!node) continue;
    byId.set(node.parcelNodeId, row);
  }
  return nodes.map((node) => {
    const row = byId.get(node.parcelNodeId);
    if (!row) {
      return gradeNode({
        parcelNodeId: node.parcelNodeId,
        inMapList: true,
        declaredVintage: DECLARED_VINTAGE,
        cadQuery: { state: "error", error: "named id missing from result", rows: [] },
      });
    }
    const rows = [];
    if (row.hit_at_declared === true || row.hit_at_declared === "t") {
      rows.push({
        county_fips: node.countyFips,
        prop_id: node.propId,
        tax_year: DECLARED_TAX_YEAR,
      });
    }
    if (row.other_vintage === true || row.other_vintage === "t") {
      rows.push({
        county_fips: node.countyFips,
        prop_id: node.propId,
        tax_year: DECLARED_TAX_YEAR - 1,
      });
    }
    const graded = gradeNode({
      parcelNodeId: node.parcelNodeId,
      inMapList: true,
      declaredVintage: DECLARED_VINTAGE,
      cadQuery: { state: "ok", rows },
    });
    graded.leadingZeroOrphan =
      row.leading_zero_orphan === true || row.leading_zero_orphan === "t";
    return graded;
  });
}

export function runLiveSql(db, nodes) {
  const parsed = assertNamedIdList(nodes);
  const built = buildLiveSql({
    countyFips: COUNTY_FIPS,
    taxYear: DECLARED_TAX_YEAR,
    propIds: parsed.map((n) => n.propId),
  });
  const psql = resolveExecutable(
    process.platform === "win32"
      ? [
          "psql.exe",
          "psql",
          "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe",
        ]
      : ["psql"],
  );
  if (!psql) {
    throw new Error("psql executable unavailable");
  }
  const { stdout } = command(
    psql,
    [
      db.value,
      "-X",
      "-A",
      "-t",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      built.sql,
    ],
    { timeout: 20_000 },
  );
  const line = String(stdout)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.startsWith("["));
  if (!line) {
    throw new Error(`psql returned no JSON array: ${stdout.slice(0, 200)}`);
  }
  const payload = JSON.parse(line);
  if (!Array.isArray(payload)) {
    throw new Error("psql JSON was not an array");
  }
  return {
    sql: built.sql,
    params: {
      county_fips: built.params.county_fips,
      tax_year: built.params.tax_year,
      prop_id_count: built.propIds.length,
    },
    sessionGuard: "BEGIN TRANSACTION READ ONLY",
    rows: payload,
    grades: rowsFromLiveJson(payload, parsed),
  };
}

function unmeasuredLive(reason, nodes = TRAVIS_SAMPLE) {
  const perNode = nodes.map((parcelNodeId) =>
    gradeNode({
      parcelNodeId,
      inMapList: true,
      declaredVintage: DECLARED_VINTAGE,
      cadQuery: { state: "not-queried", error: reason, rows: [] },
    }),
  );
  const counts = tallyGrades(perNode.map((g) => g.grade));
  return {
    ran: false,
    status: "UNMEASURED",
    reason,
    nodeList: nodes,
    namedBlock: NAMED_BLOCK,
    sampleN: SAMPLE_N,
    missClass: MISS_CLASS,
    hitClass: HIT_CLASS,
    counts,
    rollup: rollupCounts(counts),
    perNode,
    note: "prop_id_bad_rate 0.51 is NOT the grade. Live SQL did not run.",
  };
}

function writeReport(report) {
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n", "utf8");
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

function baseReport(selfTest, live) {
  return {
    control: CONTROL,
    planRow: PLAN_ROW,
    wdllItem: 3,
    instrument: "scripts/p77-travis-join-measure.mjs",
    snapshot: {
      timestamp: new Date().toISOString(),
      ...gitSnapshot(),
      vintage: DECLARED_VINTAGE,
      taxYear: DECLARED_TAX_YEAR,
      tier: DECLARED_TIER,
      countyFips: COUNTY_FIPS,
      joinKey:
        "cad_property (county_fips, normalizeCadPropId(prop_id)) at declared vintage",
      joinKeyRejected: "geo_id",
      nodeList: TRAVIS_SAMPLE,
      namedBlock: NAMED_BLOCK,
      sampleN: SAMPLE_N,
    },
    note: "prop_id_bad_rate 0.51 is NOT the grade. This file is the measure.",
    selfTest: {
      ok: selfTest.ok,
      fixtureCount: selfTest.fixtureCount,
      caseNames: selfTest.cases.map((c) => c.name),
      cases: selfTest.cases,
    },
    live,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    const report = baseReport(selfTest, null);
    writeReport(report);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(1);
  }

  if (!args.live) {
    const report = baseReport(
      selfTest,
      unmeasuredLive("self-test only; live SQL not requested"),
    );
    writeReport(report);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(0);
  }

  let db;
  try {
    db = resolveDeploymentDbUrl();
  } catch (error) {
    const report = baseReport(
      selfTest,
      unmeasuredLive(redactSecrets(error.message)),
    );
    writeReport(report);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(2);
  }

  try {
    const liveRun = runLiveSql(db, TRAVIS_SAMPLE);
    const counts = tallyGrades(liveRun.grades.map((g) => g.grade));
    const live = {
      ran: true,
      status: "MEASURED",
      dbSource: db.source,
      reason: null,
      nodeList: TRAVIS_SAMPLE,
      namedBlock: NAMED_BLOCK,
      sampleN: SAMPLE_N,
      missClass: MISS_CLASS,
      hitClass: HIT_CLASS,
      sql: liveRun.sql,
      params: liveRun.params,
      sessionGuard: liveRun.sessionGuard,
      counts,
      rollup: rollupCounts(counts),
      perNode: liveRun.grades,
      namedBlockGrades: liveRun.grades.filter((g) =>
        NAMED_BLOCK.includes(g.parcelNodeId),
      ),
      note: "prop_id_bad_rate 0.51 is NOT the grade.",
    };
    const report = baseReport(selfTest, live);
    writeReport(report);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(0);
  } catch (error) {
    const report = baseReport(
      selfTest,
      unmeasuredLive(`live SQL failed: ${redactSecrets(error.message)}`),
    );
    writeReport(report);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(2);
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
