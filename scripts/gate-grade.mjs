#!/usr/bin/env node
/**
 * Texas flush launch gate grader (OPS-16 P-36).
 *
 * Grades DC-1..DC-13 only through the instruments named in
 * _decisions/2026-08-11_texas_flush_launch_gate_amendment.md.
 *
 * Read-only except for _inbox/<UTC-date>_gate_grade.json.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_ROOT = process.env.GATE_EVIDENCE_ROOT
  ? process.env.GATE_EVIDENCE_ROOT
  : ROOT;
const DATE = new Date().toISOString().slice(0, 10);
const STARTED_AT = new Date().toISOString();
const OUTPUT_PATH = join(ROOT, "_inbox", `${DATE}_gate_grade.json`);
const LEDGER_URL =
  process.env.COUNTY_LEDGER_URL ||
  "https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger";
const MCP_HEALTH_URL =
  process.env.MCP_HEALTH_URL ||
  "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/health";
const SMARTSITE_URL =
  process.env.SMARTSITE_URL || "https://smartsite.cloud";
const MAX_AGE_MS = 30 * 60 * 1000;
const PROCESS_TIMEOUT_MS = 20_000;
const HTTP_TIMEOUT_SECONDS = 15;
const MAX_BUFFER = 40 * 1024 * 1024;

const UNIFORM_RAILS = [
  "geometry",
  "roads",
  "flood",
  "footprint",
  "rrc-wells",
  "rrc-pipelines",
  "rail-corridor",
  "mud",
];
const DEPTH_RAILS = [
  "cad",
  "owner",
  "zoning",
  "envelope",
  "landuse",
  "easement",
];
const FOOTPRINT_FIPS = new Set([
  "48453",
  "48491",
  "48209",
  "48021",
  "48055",
  "48053",
  "48031",
  "48287",
  "48149",
  "48299",
  "48029",
  "48091",
  "48187",
  "48027",
  "48309",
  "48113",
  "48439",
  "48085",
  "48121",
  "48139",
  "48251",
  "48257",
  "48367",
  "48397",
  "48231",
  "48497",
  "48221",
  "48425",
]);
const SATISFIED_STATES = new Set([
  "satisfied-present",
  "satisfied-absent",
  "satisfied-partial",
]);

const results = [];
const instrumentErrors = [];

function rel(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function compact(value, limit = 320) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value);
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function addResult(id, status, summary, evidence) {
  results.push({ id, status, summary, evidence });
}

function command(name, args, options = {}) {
  const run = spawnSync(name, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout: options.timeout ?? PROCESS_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
    input: options.input,
    env: options.env ?? process.env,
    windowsHide: true,
  });
  if (run.error) {
    throw new Error(`${name} failed: ${run.error.message}`);
  }
  if (run.status !== 0) {
    throw new Error(
      `${name} exited ${run.status}: ${compact(run.stderr || run.stdout)}`,
    );
  }
  return {
    stdout: run.stdout,
    stderr: run.stderr,
  };
}

function resolveExecutable(names) {
  for (const name of names) {
    try {
      command(name, ["--version"], { timeout: 5_000 });
      return name;
    } catch {
      // Try the next bounded candidate.
    }
  }
  return null;
}

const CURL =
  process.platform === "win32"
    ? resolveExecutable(["curl.exe", "curl"])
    : resolveExecutable(["curl"]);

function curlArgs(extra) {
  return [
    ...(process.platform === "win32" ? ["--ssl-no-revoke"] : []),
    "--max-time",
    String(HTTP_TIMEOUT_SECONDS),
    "--connect-timeout",
    "8",
    ...extra,
  ];
}

function curlJson(url) {
  if (!CURL) throw new Error("curl executable unavailable");
  const marker = "__GATE_HTTP_STATUS__:";
  const { stdout } = command(
    CURL,
    curlArgs(["-sS", "-w", `\n${marker}%{http_code}`, url]),
  );
  const i = stdout.lastIndexOf(`\n${marker}`);
  if (i < 0) throw new Error(`curl status marker missing for ${url}`);
  const body = stdout.slice(0, i);
  const status = Number(stdout.slice(i + marker.length + 1));
  let json;
  try {
    json = JSON.parse(body);
  } catch (error) {
    throw new Error(
      `HTTP ${status} from ${url} was not JSON: ${error.message}; body=${compact(body)}`,
    );
  }
  if (status < 200 || status >= 300) {
    throw new Error(`HTTP ${status} from ${url}: ${compact(body)}`);
  }
  return { status, body, json };
}

function curlHeaders(url) {
  if (!CURL) throw new Error("curl executable unavailable");
  const { stdout } = command(
    CURL,
    curlArgs(["-sS", "-I", "--max-redirs", "0", url]),
  );
  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const statusLine = lines.find((line) => /^HTTP\//i.test(line)) || null;
  const status = statusLine
    ? Number(statusLine.match(/^HTTP\/\S+\s+(\d+)/i)?.[1])
    : null;
  const headers = Object.fromEntries(
    lines
      .filter((line) => line.includes(":"))
      .map((line) => {
        const i = line.indexOf(":");
        return [
          line.slice(0, i).trim().toLowerCase(),
          line.slice(i + 1).trim(),
        ];
      }),
  );
  return { status, statusLine, lines, headers };
}

function read(path) {
  return readFileSync(join(EVIDENCE_ROOT, path), "utf8");
}

function fileEvidence(path) {
  const absolute = join(EVIDENCE_ROOT, path);
  return {
    path,
    exists: existsSync(absolute),
    ...(existsSync(absolute)
      ? {
          sha256: sha256(readFileSync(absolute)),
        }
      : {}),
  };
}

function countBy(rows, field) {
  const counts = {};
  for (const row of rows) {
    const key = String(row?.[field] ?? "null");
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function offenders(rows, predicate, fields, max = 25) {
  const found = rows.filter(predicate);
  return {
    count: found.length,
    first: found.slice(0, max).map((row) =>
      Object.fromEntries(fields.map((field) => [field, row?.[field] ?? null])),
    ),
    truncated: found.length > max,
  };
}

function ledgerStatus(pass) {
  if (!ledgerContext.ok) return "FAIL";
  if (!ledgerContext.fresh) return "STALE";
  return pass ? "PASS" : "FAIL";
}

function ledgerSummary(label, pass, detail) {
  if (!ledgerContext.ok) {
    return `${label}: instrument unavailable`;
  }
  if (!ledgerContext.fresh) {
    return `${label}: STALE-INSTRUMENT, computedAt age ${ledgerContext.ageMinutes} min exceeds 30 min`;
  }
  return `${label}: ${pass ? "pass" : "fail"}${detail ? `; ${detail}` : ""}`;
}

let ledgerContext = {
  ok: false,
  fresh: false,
  error: null,
  summary: null,
  cells: [],
  computedAt: null,
  ageMs: null,
  ageMinutes: null,
  responseSha256: null,
};

try {
  const response = curlJson(LEDGER_URL);
  const summary = response.json?.summary;
  const cells = response.json?.manifestCells;
  if (!summary || !Array.isArray(cells)) {
    throw new Error("response missing summary or manifestCells[]");
  }
  const computedAt = summary.computedAt;
  const computedMs = Date.parse(computedAt);
  const ageMs = Number.isFinite(computedMs)
    ? Date.now() - computedMs
    : Number.NaN;
  const futureSkewed = Number.isFinite(ageMs) && ageMs < -60_000;
  const fresh =
    Number.isFinite(ageMs) &&
    !futureSkewed &&
    ageMs >= 0 &&
    ageMs <= MAX_AGE_MS;
  ledgerContext = {
    ok: true,
    fresh,
    error: null,
    summary,
    cells,
    computedAt,
    ageMs: Number.isFinite(ageMs) ? ageMs : null,
    ageMinutes: Number.isFinite(ageMs)
      ? Number((ageMs / 60_000).toFixed(2))
      : null,
    responseSha256: sha256(response.body),
    httpStatus: response.status,
  };
} catch (error) {
  ledgerContext.error = error.message;
  instrumentErrors.push({
    instrument: "GET /api/county-ledger",
    error: error.message,
  });
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
      // Try the next bounded candidate.
    }
  }
  throw new Error("gcloud unavailable");
}

function resolveDeploymentDbUrl() {
  for (const name of [
    "DEPLOYMENT_DATABASE_URL",
    "CORTEX_DATABASE_URL",
  ]) {
    const value = process.env[name]?.trim();
    if (value) return { value, source: `env:${name}` };
  }
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
    source:
      "gcloud:legacy-design-tools-prod/DEPLOYMENT_DATABASE_URL:latest",
  };
}

function countyRailRowCount() {
  const db = resolveDeploymentDbUrl();
  const psql = resolveExecutable(
    process.platform === "win32"
      ? [
          "psql.exe",
          "psql",
          "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe",
        ]
      : ["psql"],
  );
  if (!psql) throw new Error("psql executable unavailable");
  const sql =
    "BEGIN TRANSACTION READ ONLY; SELECT COUNT(*)::bigint FROM county_rail; COMMIT;";
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
      sql,
    ],
  );
  const numeric = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^\d+$/.test(line));
  if (!numeric) throw new Error(`psql returned no count: ${compact(stdout)}`);
  return {
    count: Number(numeric),
    source: db.source,
    sql,
    sessionGuard: "BEGIN TRANSACTION READ ONLY",
    stdout: numeric,
  };
}

function declarationCount() {
  const gh = resolveExecutable(
    process.platform === "win32" ? ["gh.exe", "gh"] : ["gh"],
  );
  if (!gh) throw new Error("gh executable unavailable");
  const sourcePath = "lib/db/src/schema/countyRailDimension.ts";
  const { stdout } = command(gh, [
    "api",
    `repos/empressaioemail-tech/legacy-design-tools/contents/${sourcePath}?ref=main`,
  ]);
  const payload = JSON.parse(stdout);
  const source = Buffer.from(
    String(payload.content || "").replace(/\s/g, ""),
    "base64",
  ).toString("utf8");
  const match = source.match(
    /export const COUNTY_RAIL_DECLARATION[\s\S]*?=\s*\[([\s\S]*?)\n\];/,
  );
  if (!match) throw new Error("COUNTY_RAIL_DECLARATION array not found");
  const count = (match[1].match(/\brailKey\s*:/g) || []).length;
  if (!count) throw new Error("COUNTY_RAIL_DECLARATION parsed as zero rows");
  return {
    count,
    repo: "empressaioemail-tech/legacy-design-tools",
    ref: "main",
    path: sourcePath,
    blobSha: payload.sha,
    parser: "railKey property count inside declaration array",
  };
}

// DC-1
{
  let sqlEvidence = null;
  let sourceEvidence = null;
  const errors = [];
  try {
    sqlEvidence = countyRailRowCount();
  } catch (error) {
    errors.push(`SQL: ${error.message}`);
    instrumentErrors.push({ instrument: "DC-1 SQL", error: error.message });
  }
  try {
    sourceEvidence = declarationCount();
  } catch (error) {
    errors.push(`source: ${error.message}`);
    instrumentErrors.push({
      instrument: "DC-1 declaration",
      error: error.message,
    });
  }
  const s = ledgerContext.summary;
  const arithmetic =
    ledgerContext.ok &&
    s.totalCells === s.totalCounties * s.totalRails;
  // Instrument corrected per operator ruling 2026-08-14 (OPS-16 A-016): county_rail
  // holds the RAIL dimension; cells materialize via CROSS JOIN. Compare against totalRails.
  const sqlMatch =
    ledgerContext.ok &&
    sqlEvidence != null &&
    sqlEvidence.count === s.totalRails;
  const sourceMatch =
    ledgerContext.ok &&
    sourceEvidence != null &&
    sourceEvidence.count === s.totalRails;
  const pass =
    arithmetic && sqlMatch && sourceMatch && errors.length === 0;
  addResult(
    "DC-1",
    ledgerStatus(pass),
    ledgerSummary(
      "Denominator coherence",
      pass,
      ledgerContext.ok
        ? `${s.totalCounties} x ${s.totalRails} = ${s.totalCells}; SQL=${sqlEvidence?.count ?? "ERR"}; declaration=${sourceEvidence?.count ?? "ERR"}`
        : null,
    ),
    {
      ledger: ledgerContext.ok
        ? {
            totalCounties: s.totalCounties,
            totalRails: s.totalRails,
            totalCells: s.totalCells,
            computedAt: s.computedAt,
            arithmetic,
          }
        : { error: ledgerContext.error },
      sql: sqlEvidence,
      declaration: sourceEvidence,
      errors,
    },
  );
}

// DC-2
{
  const rows = ledgerContext.cells.filter(
    (cell) => cell.railKey === "geometry",
  );
  const bad = offenders(
    rows,
    (cell) =>
      !["satisfied-present", "satisfied-absent"].includes(
        cell.displayState,
      ) ||
      (cell.isPartial === true &&
        (cell.honestCoveragePct == null ||
          cell.verifiedByInstrument == null)),
    [
      "countyFips",
      "displayState",
      "isPartial",
      "honestCoveragePct",
      "verifiedByInstrument",
    ],
  );
  const pass =
    ledgerContext.ok &&
    rows.length === ledgerContext.summary.totalCounties &&
    bad.count === 0;
  addResult(
    "DC-2",
    ledgerStatus(pass),
    ledgerSummary(
      "Geometry fabric",
      pass,
      `${rows.length}/${ledgerContext.summary?.totalCounties ?? "?"} cells; ${bad.count} violations`,
    ),
    {
      cellCount: rows.length,
      expected: ledgerContext.summary?.totalCounties ?? null,
      displayStates: countBy(rows, "displayState"),
      violations: bad,
    },
  );
}

// DC-3
{
  const perRail = {};
  let pass = ledgerContext.ok;
  for (const rail of UNIFORM_RAILS) {
    const rows = ledgerContext.cells.filter(
      (cell) => cell.railKey === rail,
    );
    const bad = offenders(
      rows,
      (cell) => !SATISFIED_STATES.has(cell.displayState),
      ["countyFips", "displayState", "hasWriter"],
    );
    const railPass =
      ledgerContext.ok &&
      rows.length === ledgerContext.summary.totalCounties &&
      bad.count === 0;
    pass = pass && railPass;
    perRail[rail] = {
      status: railPass ? "PASS" : "FAIL",
      cellCount: rows.length,
      displayStates: countBy(rows, "displayState"),
      violations: bad,
    };
  }
  addResult(
    "DC-3",
    ledgerStatus(pass),
    ledgerSummary(
      "Statewide-uniform rails",
      pass,
      `${Object.values(perRail).filter((r) => r.status === "PASS").length}/8 rail checks pass`,
    ),
    { perRail },
  );
}

// DC-4
{
  const bad = offenders(
    ledgerContext.cells,
    (cell) => cell.displayState === "no-atom",
    ["countyFips", "railKey", "displayState", "atomFamilyState"],
  );
  const pass = ledgerContext.ok && bad.count === 0;
  addResult(
    "DC-4",
    ledgerStatus(pass),
    ledgerSummary("No no-atom cells", pass, `count=${bad.count}`),
    { count: bad.count, offenders: bad },
  );
}

// DC-5
{
  const bad = offenders(
    ledgerContext.cells,
    (cell) => cell.displayState === "no-writer",
    ["countyFips", "railKey", "displayState", "hasWriter"],
  );
  const pass = ledgerContext.ok && bad.count === 0;
  addResult(
    "DC-5",
    ledgerStatus(pass),
    ledgerSummary("No no-writer cells", pass, `count=${bad.count}`),
    { count: bad.count, offenders: bad },
  );
}

// DC-6
{
  const rows = ledgerContext.cells.filter(
    (cell) =>
      DEPTH_RAILS.includes(cell.railKey) &&
      FOOTPRINT_FIPS.has(cell.countyFips),
  );
  const bad = offenders(
    rows,
    (cell) => !SATISFIED_STATES.has(cell.displayState),
    ["countyFips", "railKey", "displayState", "hasWriter"],
    50,
  );
  const expected = DEPTH_RAILS.length * FOOTPRINT_FIPS.size;
  const pass =
    ledgerContext.ok && rows.length === expected && bad.count === 0;
  addResult(
    "DC-6",
    ledgerStatus(pass),
    ledgerSummary(
      "Depth rails inside footprint",
      pass,
      `${rows.length}/${expected} cells; ${bad.count} pre-terminal`,
    ),
    {
      footprintCounties: FOOTPRINT_FIPS.size,
      depthRails: DEPTH_RAILS,
      expectedCells: expected,
      actualCells: rows.length,
      displayStates: countBy(rows, "displayState"),
      violations: bad,
    },
  );
}

// DC-7
{
  const rows = ledgerContext.cells.filter(
    (cell) =>
      DEPTH_RAILS.includes(cell.railKey) &&
      !FOOTPRINT_FIPS.has(cell.countyFips),
  );
  const bad = offenders(
    rows,
    (cell) =>
      ["no-writer", "no-atom"].includes(cell.displayState) ||
      (cell.displayState === "not-yet" && cell.hasWriter !== true),
    ["countyFips", "railKey", "displayState", "hasWriter"],
  );
  const expected =
    DEPTH_RAILS.length *
    Math.max(
      0,
      (ledgerContext.summary?.totalCounties ?? 0) -
        FOOTPRINT_FIPS.size,
    );
  const pass =
    ledgerContext.ok && rows.length === expected && bad.count === 0;
  addResult(
    "DC-7",
    ledgerStatus(pass),
    ledgerSummary(
      "Depth rails outside footprint writer-live",
      pass,
      `${rows.length}/${expected} cells; ${bad.count} violations`,
    ),
    {
      expectedCells: expected,
      actualCells: rows.length,
      displayStates: countBy(rows, "displayState"),
      violations: bad,
    },
  );
}

// DC-8
{
  const rows = ledgerContext.cells.filter(
    (cell) =>
      cell.railKey === "owner" &&
      FOOTPRINT_FIPS.has(cell.countyFips),
  );
  const bad = offenders(
    rows,
    (cell) => !SATISFIED_STATES.has(cell.displayState),
    [
      "countyFips",
      "displayState",
      "source",
      "absenceBasis",
      "verifiedByInstrument",
    ],
  );
  const pass =
    ledgerContext.ok &&
    rows.length === FOOTPRINT_FIPS.size &&
    bad.count === 0;
  addResult(
    "DC-8",
    ledgerStatus(pass),
    ledgerSummary(
      "Owner rail footprint",
      pass,
      `${rows.length}/${FOOTPRINT_FIPS.size} cells; ${bad.count} pre-satisfied`,
    ),
    {
      cellCount: rows.length,
      expected: FOOTPRINT_FIPS.size,
      displayStates: countBy(rows, "displayState"),
      violations: bad,
    },
  );
}

// DC-9
{
  const rows = ledgerContext.cells.filter((cell) =>
    /^satisfied-/.test(String(cell.displayState)),
  );
  const bad = offenders(
    rows,
    (cell) =>
      cell.verifiedByInstrument == null &&
      cell.source == null &&
      cell.absenceBasis == null,
    [
      "countyFips",
      "railKey",
      "displayState",
      "verifiedByInstrument",
      "source",
      "absenceBasis",
    ],
  );
  const pass = ledgerContext.ok && bad.count === 0;
  addResult(
    "DC-9",
    ledgerStatus(pass),
    ledgerSummary(
      "Satisfied-cell provenance",
      pass,
      `${rows.length} satisfied cells; ${bad.count} violations`,
    ),
    { satisfiedCellCount: rows.length, violations: bad },
  );
}

// DC-10
{
  const statePath = "_STATE.md";
  const w3Path = "_inbox/2026-08-12_W3_cert_frame_close.json";
  const opsPath = "90_operations/OPS-11_invariant_register.md";
  const state = read(statePath);
  const openSection = state.match(
    /^## OPEN — ACTIVE[\s\S]*?(?=^## (?!#)|\Z)/m,
  )?.[0];
  const w3Exists = existsSync(join(EVIDENCE_ROOT, w3Path));
  let w3 = null;
  let w3Error = null;
  try {
    w3 = JSON.parse(read(w3Path));
  } catch (error) {
    w3Error = error.message;
  }
  const aPass =
    Boolean(openSection?.includes(w3Path)) &&
    w3Exists &&
    Number(w3?.block13?.passCount) ===
      Number(w3?.block13?.totalCount) &&
    Number(w3?.block13?.totalCount) === 7;

  let ci = null;
  let ciError = null;
  try {
    const gh = resolveExecutable(
      process.platform === "win32" ? ["gh.exe", "gh"] : ["gh"],
    );
    if (!gh) throw new Error("gh executable unavailable");
    const { stdout } = command(gh, [
      "run",
      "list",
      "-R",
      "empressaioemail-tech/hauska-engine",
      "--workflow",
      "block13-cert-grade",
      "--limit",
      "1",
      "--json",
      "conclusion,headSha,databaseId,url",
    ]);
    const rows = JSON.parse(stdout);
    ci = rows[0] || null;
  } catch (error) {
    ciError = error.message;
    instrumentErrors.push({
      instrument: "DC-10 block13 CI",
      error: error.message,
    });
  }
  const bPass =
    ci?.conclusion === "success" &&
    ci?.headSha === w3?.engineCommit;

  const ops = read(opsPath);
  const opsLines = ops
    .split(/\r?\n/)
    .filter((line) =>
      /cert.frame|cert-frame|Geometry Law/i.test(line),
    );
  const closedMarker = opsLines.find(
    (line) =>
      /\bStatus:\s*(?:CLEARED|CLOSED)|\bCLEARED\s*\/\s*CLOSED/i.test(
        line,
      ) && /cert.frame|cert-frame|Geometry Law/i.test(line),
  );
  const sessionPath = w3?.ops11?.session;
  const sessionExists =
    typeof sessionPath === "string" &&
    /_sessions\/\d{4}-\d{2}-\d{2}.*block13.*re.?earn/i.test(
      sessionPath,
    ) &&
    existsSync(join(EVIDENCE_ROOT, sessionPath));
  const cPass = Boolean(closedMarker && sessionExists);
  const pass = aPass && bPass && cPass;
  addResult(
    "DC-10",
    pass ? "PASS" : "FAIL",
    `Cert frame reconciled: ${[aPass, bPass, cPass].filter(Boolean).length}/3 sub-checks pass`,
    {
      a: {
        pass: aPass,
        stateOpenDeclaration: Boolean(openSection?.includes(w3Path)),
        artifact: fileEvidence(w3Path),
        block13: w3?.block13 ?? null,
        error: w3Error,
      },
      b: {
        pass: bPass,
        command:
          "gh run list -R empressaioemail-tech/hauska-engine --workflow block13-cert-grade --limit 1 --json conclusion,headSha,databaseId,url",
        expectedHeadSha: w3?.engineCommit ?? null,
        response: ci,
        error: ciError,
      },
      c: {
        pass: cPass,
        grepPattern: "cert.frame|cert-frame|Geometry Law",
        closedMarker: closedMarker ?? null,
        sessionPath: sessionPath ?? null,
        sessionExists,
      },
    },
  );
}

function stripeSecret() {
  const fromEnv = process.env.STRIPE_SECRET_KEY?.trim();
  if (fromEnv) return { value: fromEnv, source: "env:STRIPE_SECRET_KEY" };
  let value;
  try {
    value = gcloudReadSecret(
      "STRIPE_SECRET_KEY",
      "legacy-design-tools-prod",
    );
  } catch (error) {
    throw new Error(
      `STRIPE_SECRET_KEY unset and gcloud secret read failed: ${error.message}`,
    );
  }
  if (!value) throw new Error("STRIPE_SECRET_KEY secret was empty");
  return {
    value,
    source: "gcloud:legacy-design-tools-prod/STRIPE_SECRET_KEY:latest",
  };
}

function stripeActiveProducts() {
  if (!CURL) throw new Error("curl executable unavailable");
  const secret = stripeSecret();
  const products = [];
  let startingAfter = null;
  for (let page = 0; page < 20; page += 1) {
    const params = new URLSearchParams({ active: "true", limit: "100" });
    if (startingAfter) params.set("starting_after", startingAfter);
    const url = `https://api.stripe.com/v1/products?${params}`;
    const marker = "__GATE_HTTP_STATUS__:";
    const config = [
      `url = "${url}"`,
      `header = "Authorization: Bearer ${secret.value}"`,
      "silent",
      "show-error",
      `max-time = ${HTTP_TIMEOUT_SECONDS}`,
      `connect-timeout = 8`,
      `write-out = "\\n${marker}%{http_code}"`,
      "",
    ].join("\n");
    const { stdout } = command(
      CURL,
      curlArgs(["--config", "-"]),
      { input: config },
    );
    const i = stdout.lastIndexOf(`\n${marker}`);
    if (i < 0) throw new Error("Stripe curl status marker missing");
    const body = stdout.slice(0, i);
    const status = Number(stdout.slice(i + marker.length + 1));
    if (status < 200 || status >= 300) {
      throw new Error(`Stripe HTTP ${status}: ${compact(body)}`);
    }
    const payload = JSON.parse(body);
    if (!Array.isArray(payload.data)) {
      throw new Error("Stripe products response missing data[]");
    }
    products.push(...payload.data);
    if (!payload.has_more) {
      return {
        source: secret.source,
        pages: page + 1,
        products,
      };
    }
    startingAfter = payload.data.at(-1)?.id;
    if (!startingAfter) {
      throw new Error("Stripe pagination has_more without final id");
    }
  }
  throw new Error("Stripe products pagination exceeded 20 pages");
}

// DC-11
{
  const subchecks = {};

  try {
    const health = curlJson(MCP_HEALTH_URL);
    const store = health.json?.dependencies?.rate_limit_store;
    const pass =
      store?.state === "ok" && store?.memory_fallback === false;
    subchecks.a = {
      pass,
      url: MCP_HEALTH_URL,
      httpStatus: health.status,
      rate_limit_store: store ?? null,
    };
  } catch (error) {
    subchecks.a = { pass: false, error: error.message };
  }

  const programPath = "76j_smartsite_launch_readiness_program.md";
  const program = read(programPath);
  const loadPath =
    program.match(
      /_inbox\/\d{4}-\d{2}-\d{2}_76j_C4_loadtest_results\.json/,
    )?.[0] || "_inbox/2026-08-14_76j_C4_loadtest_results.json";
  let load = null;
  let loadError = null;
  try {
    load = JSON.parse(read(loadPath));
  } catch (error) {
    loadError = error.message;
  }
  const loadTs = Date.parse(load?.ts);
  subchecks.b = {
    pass:
      existsSync(join(EVIDENCE_ROOT, loadPath)) &&
      Number.isFinite(loadTs) &&
      loadTs <= Date.now(),
    artifact: fileEvidence(loadPath),
    datedRunTs: load?.ts ?? null,
    target: load?.target ?? null,
    phases: Array.isArray(load?.phases) ? load.phases.length : null,
    error: loadError,
  };

  const capacityPath =
    program.match(
      /_inbox\/\d{4}-\d{2}-\d{2}_launch_capacity_audit\.md/,
    )?.[0] || "_inbox/2026-08-05_launch_capacity_audit.md";
  let capacityUpdated = null;
  let capacityError = null;
  try {
    const capacity = read(capacityPath);
    capacityUpdated =
      capacity.match(/^last_updated:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1] ??
      null;
  } catch (error) {
    capacityError = error.message;
  }
  subchecks.c = {
    pass:
      existsSync(join(EVIDENCE_ROOT, capacityPath)) &&
      capacityUpdated != null &&
      capacityUpdated <= DATE,
    artifact: fileEvidence(capacityPath),
    lastUpdated: capacityUpdated,
    gateCloseDate: DATE,
    error: capacityError,
  };

  try {
    const headers = curlHeaders(SMARTSITE_URL);
    const vercelHeaderLines = headers.lines.filter((line) =>
      /(^server:\s*Vercel)|(^x-vercel-)|(^location:.*vercel\.app)/i.test(
        line,
      ),
    );
    const acceptableStatus =
      headers.status === 200 || headers.status === 301;
    subchecks.d = {
      pass: acceptableStatus && vercelHeaderLines.length > 0,
      url: SMARTSITE_URL,
      statusLine: headers.statusLine,
      acceptableStatus,
      vercelHeaderLines,
      headerLines: headers.lines,
    };
  } catch (error) {
    subchecks.d = { pass: false, error: error.message };
  }

  try {
    const stripe = stripeActiveProducts();
    const names = stripe.products.map((product) => ({
      id: product.id,
      name: product.name,
    }));
    const hits = names.filter((product) =>
      /Hauska Pro/i.test(String(product.name)),
    );
    subchecks.e = {
      pass: hits.length === 0,
      source: stripe.source,
      pages: stripe.pages,
      activeProductCount: names.length,
      activeProducts: names,
      hauskaProHits: hits,
    };
  } catch (error) {
    subchecks.e = { pass: false, error: error.message };
  }

  const pass = Object.values(subchecks).every(
    (check) => check.pass === true,
  );
  addResult(
    "DC-11",
    pass ? "PASS" : "FAIL",
    `76j capacity and branding: ${Object.values(subchecks).filter((c) => c.pass).length}/5 sub-checks pass`,
    { subchecks },
  );
}

// DC-12
{
  const amendmentPath =
    "_decisions/2026-08-11_texas_flush_launch_gate_amendment.md";
  const amendment = read(amendmentPath);
  const sourceLine =
    amendment
      .split(/\r?\n/)
      .find(
        (line) =>
          line.includes("DC-12.") &&
          line.includes("informational only"),
      ) ?? null;
  const pass =
    sourceLine != null &&
    !results.some(
      (result) =>
        result.id !== "DC-12" &&
        /texasCompletenessPct/.test(JSON.stringify(result.evidence)),
    );
  addResult(
    "DC-12",
    pass ? "PASS" : "FAIL",
    "texasCompletenessPct is recorded as informational only and is not a pass/fail threshold",
    {
      doneCardSource: amendmentPath,
      verbatimSourceLine: sourceLine,
      completenessPctInformationalOnly: true,
      threshold: null,
    },
  );
}

// DC-13
{
  const pass = ledgerContext.ok && ledgerContext.fresh;
  addResult(
    "DC-13",
    ledgerStatus(pass),
    ledgerSummary(
      "Progress headline snapshot",
      pass,
      "verbatim summary attached",
    ),
    {
      endpoint: LEDGER_URL,
      verbatimSummary: ledgerContext.summary,
    },
  );
}

const statusCounts = countBy(results, "status");
const overall =
  results.length === 13 &&
  results.every((result) => result.status === "PASS")
    ? "PASS"
    : "FAIL";
const artifact = {
  schemaVersion: 1,
  lane: "L23",
  planRows: ["P-36"],
  startedAt: STARTED_AT,
  finishedAt: new Date().toISOString(),
  overall,
  gatePolicy: {
    allThirteenMustPass: true,
    staleIsNotPass: true,
    ledgerMaxAgeMinutes: 30,
    texasCompletenessPctInformationalOnly: true,
    texasCompletenessPctThreshold: null,
  },
  instruments: {
    countyLedger: {
      url: LEDGER_URL,
      ok: ledgerContext.ok,
      fresh: ledgerContext.fresh,
      computedAt: ledgerContext.computedAt,
      ageMs: ledgerContext.ageMs,
      ageMinutes: ledgerContext.ageMinutes,
      responseSha256: ledgerContext.responseSha256,
      error: ledgerContext.error,
    },
    mcpHealth: MCP_HEALTH_URL,
    smartsite: SMARTSITE_URL,
  },
  statusCounts,
  results,
  instrumentErrors,
  constraintsHonored: [
    "read-only SQL",
    "HTTP GET/HEAD only",
    "gh reads only",
    "no atoms slot or lease",
    "no deploy",
    "no Cotality or Regrid",
    "only _inbox output write",
  ],
};

writeFileSync(OUTPUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

console.log(`\nTexas flush launch gate grade (${artifact.finishedAt})`);
console.table(
  results.map((result) => ({
    item: result.id,
    status: result.status,
    evidence: result.summary,
  })),
);
console.log(
  `Overall: ${overall} | PASS=${statusCounts.PASS || 0} FAIL=${statusCounts.FAIL || 0} STALE=${statusCounts.STALE || 0}`,
);
console.log(`Wrote ${rel(OUTPUT_PATH)}`);

if (overall !== "PASS") process.exitCode = 1;
