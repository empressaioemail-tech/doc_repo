#!/usr/bin/env node
/**
 * six-county-completeness.mjs -- the LEDGER LEG of the Phase 0 exit (scope rev 4, section 5).
 *
 * Question it answers: in each county, is every one of the 65 rails in a state the program has
 * ruled acceptable, and does no setback cell carry an earned state that nothing earned?
 * It reads the factory store only. It cannot see the served surface; that is the customer leg
 * (scripts/surface-probe.mjs, P-254). Exit 0 here is necessary for Phase 0, never sufficient.
 *
 * Reads, all read-only:
 *   1. parcel_gate_verdict, latest verdict per (county, rail), classified against RAIL_POLICY.
 *      Verdict strings: pass | refuse | excluded, plus P-201's excluded-not-applicable,
 *      excluded-mid-cutover and excluded-no-acquisition-path. Every excluded* string is an
 *      exclusion for acceptance, and the exact string is recorded.
 *   2. parcel_record_cell, per rail, counting cells whose earned state was written without a
 *      probe of the source of record (FALSE_EARNED). All five setback rails are checked.
 *   3. Couplings (P-253, A-187). An acceptance that rests on something outside the verdict table
 *      is checked against that thing, so it cannot outlive its reason:
 *        no-source       -> _catalog/capability_roadmap.json must still carry the rail;
 *        vendor-pending  -> _catalog/vendor_contracts.json must say the vendor is not in hand;
 *        deferred        -> the P-264 road residual artifact must show no unruled
 *                           road-blocked render in the county (UNMEASURED until it exists);
 *        county-scoped   -> accepted outside its scope, as an exclusion or an honest refusal;
 *        ruled-exclusion -> (P-337, A-215 rulings 3 and 4) the rail's roadmap entry must say
 *                           paused-by-ruling and name the rail's Phase 1 row, NO tracked close in
 *                           _inbox may name that row (a close means the reason may be gone; the
 *                           seat re-rules or acknowledges that close by path in the roadmap), and
 *                           the verdict must still be the exact string the ruling accepted.
 *   4. Rail-list drift: RAIL_POLICY must equal the factory's rail list at the pinned SHA
 *      (read with git from a local hauska-factory clone). Drift, or no clone, is UNMEASURED.
 *
 * Exit codes: 0 COMPLETE, 1 INCOMPLETE, 2 UNMEASURED. INCOMPLETE wins over UNMEASURED: a county
 * with an open rail is incomplete whatever else is unmeasured. UNMEASURED is never COMPLETE.
 *
 * Usage:
 *   FACTORY_DATABASE_URL_RO=<dsn> node scripts/six-county-completeness.mjs
 *       [--counties 48021,48053] [--road-residual <path>] [--factory-repo <path>] [--json <out>]
 *   node scripts/six-county-completeness.mjs --self-test
 *
 * The DSN is read from the environment and never printed. Requires psql (and git for the drift
 * check). Every run prints its own snapshot.
 */
import { spawnSync, execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./setback-parcel-census.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_REPO = resolve(HERE, "..");

export const SIX = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};
export const KNOWN_COUNTIES = { ...SIX, "48053": "Burnet", "48027": "Bell", "48331": "Milam" };

/** The factory rail list this policy was checked against. Move it only with a policy review. */
export const PINNED_FACTORY_SHA = "9171279";
export const FACTORY_RAIL_KEYS_PATH = "src/lib/parcel-record-engine/rail-keys.js";

/**
 * Per-rail policy. `accept` lists the non-pass verdict KINDS the program has ruled acceptable
 * ("excluded" matches every excluded* string). Anything else that is not `pass` is open.
 * Classes: must-pass | ruled-withheld | county-scoped | ruled-unavailable | mid-cutover |
 * ruled-exclusion | no-source | make-unbuilt | derived-trivial | deferred | vendor-pending.
 * `verdictExact`, where set, narrows acceptance to one verdict string: an exclusion ruled for one
 * reason is not accepted when the store starts giving another.
 */
export const RAIL_POLICY = {
  // Ruled withheld (R-2, _decisions/2026-09-11_ruling_b_reversed_polygon_only.md).
  buildableAreaSqFt: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  buildableAreaPct: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  envelopeStatus: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  envelopeDisclosure: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  // Travis-only by ratified design (engine #444). Outside scope the rail is unacquired; after
  // P-252 its verdict there is an honest refuse, which P-292 keeps off the publish floor.
  maxImperviousCoverPct: { cls: "county-scoped", accept: ["excluded", "refuse"], onlyIn: ["48453"], ruling: "engine #444; P-292" },
  // Operator ruling 2026-09-14 (P-209): declared Unavailable in Texas, rail kept. Still carried
  // on the capability roadmap; the customer-facing declaration is graded by the customer leg.
  salesHistory: { cls: "ruled-unavailable", accept: ["excluded"], ruling: "P-209" },
  // P-204: data exists and serves by another path; the ledger is the serving path, so these cut over
  // (A-215 rulings 1 and 2, P-336).
  parcelGeometry: { cls: "mid-cutover" },
  pipelines: { cls: "mid-cutover" },
  etjStatus: { cls: "mid-cutover" },
  // P-337. A-215 ruling 3: landUseDescription stays on the bake for Phase 0, because cutting over
  // removes a description a customer reads today; its cutover is P-345. Ruling 4: railCorridor is
  // deferred, not retired; its first serve path (or a retirement ruling) is P-344. Each is
  // accepted only while its Phase 1 row is open and the store still says mid-cutover.
  landUseDescription: { cls: "ruled-exclusion", accept: ["excluded"], verdictExact: "excluded-mid-cutover", ruling: "A-215 ruling 3", coupling: "phase1-row", phase1Row: "P-345" },
  railCorridor: { cls: "ruled-exclusion", accept: ["excluded"], verdictExact: "excluded-mid-cutover", ruling: "A-215 ruling 4", coupling: "phase1-row", phase1Row: "P-344" },
  // Operator 2026-09-16 (A-177): the road-node pass comes after Phase 2 unless roads block
  // rendering. Accepted only while P-264's residual shows no unruled road-blocked render.
  roads: { cls: "deferred", accept: ["excluded"], ruling: "A-177", coupling: "road-residual" },
  edgeSignal: { cls: "deferred", accept: ["excluded"], ruling: "A-177", coupling: "road-residual" },
  // P-203: no acquisition path anywhere. Accepted only while the capability roadmap carries it.
  easements: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  hoaDeedRestrictions: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  mineralRights: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  ossf: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  permits: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  terrain: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  treeProtection: { cls: "no-source", accept: ["excluded"], ruling: "P-203", coupling: "roadmap" },
  // P-242: records are coming soon and off the purchase surface by ruling.
  publicRecordRefs: { cls: "no-source", accept: ["excluded"], ruling: "P-242", coupling: "roadmap" },
  // Manufactured by us; the writer exists and the rail is excluded in all six (P-266).
  citationUrl: { cls: "make-unbuilt" },
  // Trivially derived; written for Hays only as of 2026-09-16 (P-266).
  acreageSqft: { cls: "derived-trivial" },
  landUseVintage: { cls: "derived-trivial" },
  situsState: { cls: "derived-trivial" },
  // Texas-wide (operator 2026-09-16). Four counties take it from Cotality once the contract is
  // in hand (A-184); until then accepted there as vendor-pending. Must pass everywhere else.
  agValuation: { cls: "vendor-pending", accept: ["excluded", "refuse"], vendor: "cotality", pendingIn: ["48021", "48055", "48209", "48309"], ruling: "A-184" },
};
for (const k of [
  "apn", "situsAddress", "situsCity", "situsZip", "landUseCode", "landUseSource",
  "acreageAcres", "acreageMethod", "yearBuilt", "marketValue", "assessedValue", "landValue",
  "improvementValue", "livingAreaSqft", "legalDescription", "exemptionCodes", "countyFips",
  "cityLimits", "schoolDistrict", "zoningDistrict", "zoningJurisdictionKey", "zoningProvenance",
  "setbackFrontFt", "setbackSideFt", "setbackRearFt", "setbackCornerFt", "parcelAreaSqFt",
  "maxLotCoveragePct", "maxHeightFt", "maxFootprintSqFt", "setbackRules", "wells",
  "buildingFootprint", "specialDistricts", "flood", "owner", "valueHistory", "utilityService",
  "overlayDistricts",
]) RAIL_POLICY[k] ??= { cls: "must-pass" };

export const SETBACK_RAILS = ["setbackFrontFt", "setbackSideFt", "setbackRearFt", "setbackCornerFt", "setbackRules"];

/**
 * Earned states written without a probe of the source of record. The two setback writers
 * (buildNoRuledTableCells, buildResolvedCells in hauska-factory parcel-setback-cells.mjs) write
 * every setback rail the same way, so both predicates run on all five rails (teardown T1).
 */
export const FALSE_EARNED = [
  ...SETBACK_RAILS.flatMap((rail) => [
    {
      id: `setback-no-ruled-table:${rail}`,
      rail,
      kind: "absent-verified",
      sql: "cell_state->'basis'->>'finding' like 'no ruled setback table exists%'",
      why: "the city has no table in our corpus; that is a statement about our corpus, not the lot",
    },
    {
      id: `setback-router-miss:${rail}`,
      rail,
      kind: "absent-verified",
      sql: "cell_state->'basis'->>'method' like 'setback-table-router%'",
      why: "the district has no row in the city's table; the requirement exists and is unacquired",
    },
  ]),
  {
    id: "ag-valuation-no-source",
    rail: "agValuation",
    kind: "not-applicable",
    sql: "split_part(place_key, ':', 1) not in ('48453','48491')",
    why: "agricultural valuation applies Texas-wide; no source was acquired. A guard: these cells " +
      "were honestly unaccounted on 2026-09-16, so this reads 0 unless a sweep writes the false state.",
  },
  {
    id: "situsState-retired-d1-constant",
    rail: "situsState",
    kind: "value",
    sql: "cell_state->>'source' = 'derived-county-fips'",
    why: "P-348: the OPS-21 D1 constant wrote TX from the county FIPS without looking at the parcel. " +
      "P-266 retired it and re-resolves every such cell it can; one it cannot (its own situs names " +
      "another state) keeps the constant, because the upsert never downgrades, and the rail passes " +
      "on it. Measured 2026-09-18: one cell, Hays 48209:88885. P-352 replaces it.",
  },
];

/** Pure: the acceptance kind of a verdict string. */
export function verdictKind(v) {
  const s = String(v ?? "");
  if (s === "pass" || s === "refuse") return s;
  if (s === "excluded" || s.startsWith("excluded-")) return "excluded";
  return "unknown";
}

/** Pure: does a coupling still hold? Returns { state: "holds" | "broken" | "unmeasured", detail }. */
export function couplingState(pol, rail, fips, ctx) {
  if (pol.coupling === "roadmap") {
    const e = ctx.roadmap?.rails?.[rail];
    if (!ctx.roadmap) return { state: "unmeasured", detail: "capability roadmap not readable" };
    if (!e) return { state: "broken", detail: "the capability roadmap no longer lists this rail" };
    if (e.status === "carried" || e.status === "paused-by-ruling") return { state: "holds", detail: `${e.status} (${e.row})` };
    return { state: "broken", detail: `roadmap status is ${e.status}` };
  }
  if (pol.coupling === "road-residual") {
    const r = ctx.roadResidual;
    if (!r) return { state: "unmeasured", detail: "no P-264 road residual artifact yet" };
    const c = r.counties?.[fips];
    if (!c) return { state: "unmeasured", detail: "the road residual artifact does not cover this county" };
    if ((c.roadBlockedRenders ?? null) === 0) return { state: "holds", detail: "no road-blocked render" };
    if (c.ruledAcceptable === true && c.ruling) return { state: "holds", detail: `road-blocked renders ruled acceptable (${c.ruling})` };
    return { state: "broken", detail: `${c.roadBlockedRenders} road-blocked renders with no ruling` };
  }
  if (pol.coupling === "phase1-row") {
    if (!ctx.roadmap) return { state: "unmeasured", detail: "capability roadmap not readable" };
    const e = ctx.roadmap.rails?.[rail];
    if (!e) return { state: "broken", detail: "the capability roadmap no longer lists this rail" };
    if (e.status !== "paused-by-ruling") return { state: "broken", detail: `roadmap status is ${e.status}, not paused-by-ruling` };
    if (e.row !== pol.phase1Row) return { state: "broken", detail: `roadmap names ${e.row}; the ruling's Phase 1 row is ${pol.phase1Row}` };
    if (!ctx.closes) return { state: "unmeasured", detail: "tracked closes not readable" };
    const acknowledged = new Set(e.acknowledgedCloses ?? []);
    const hits = ctx.closes.filter((c) => c.rows.includes(pol.phase1Row) && !acknowledged.has(c.path));
    if (hits.length) {
      return { state: "broken", detail: `${pol.phase1Row} has a close (${hits.map((h) => h.path).join(", ")}): the reason may be gone; re-rule, or acknowledge the close by path in the roadmap` };
    }
    return { state: "holds", detail: `paused-by-ruling (${pol.ruling}); ${pol.phase1Row} has no close` };
  }
  return { state: "holds", detail: "" };
}

/**
 * Pure: the plan rows a close names. Parsed closes are read by field (five spellings are in use);
 * a close that does not parse is read conservatively, as naming every row id in its text, so an
 * unreadable close can break a coupling but can never hold one open.
 */
export const CLOSE_ROW_FIELDS = ["planRows", "planRow", "plan_row", "plan_rows", "planRowList"];
export function closeRows(text) {
  const t = String(text ?? "").replace(/^﻿/, "");
  const all = () => [...new Set(t.match(/\bP-\d+\b/g) ?? [])];
  let d;
  try { d = JSON.parse(t); } catch { return all(); }
  if (!d || typeof d !== "object" || Array.isArray(d)) return all();
  const out = new Set();
  for (const f of CLOSE_ROW_FIELDS) {
    if (d[f] == null) continue;
    for (const m of JSON.stringify(d[f]).match(/\bP-\d+\b/g) ?? []) out.add(m);
  }
  return [...out];
}

/** Pure classification. ctx: { roadmap, vendors, roadResidual, drift }. */
export function classify(verdicts, falseEarned, counties = Object.keys(SIX), ctx = {}) {
  const out = { verdict: "COMPLETE", counties: {}, drift: ctx.drift ?? null };
  const flag = (v) => {
    if (v === "INCOMPLETE") out.verdict = "INCOMPLETE";
    else if (v === "UNMEASURED" && out.verdict === "COMPLETE") out.verdict = "UNMEASURED";
  };
  if (ctx.drift && ctx.drift.state !== "match") flag("UNMEASURED");
  for (const fips of counties) {
    const rows = verdicts.filter((v) => v.county === fips);
    const c = { name: KNOWN_COUNTIES[fips] ?? fips, rails: rows.length, pass: 0, accepted: [], open: [], unmeasured: [], falseEarned: [] };
    out.counties[fips] = c;
    if (rows.length === 0) {
      c.unmeasured.push({ cls: "unmeasured", rail: "*", detail: "no gate verdicts for this county" });
      flag("UNMEASURED");
      continue;
    }
    const seen = new Set();
    for (const r of rows) {
      seen.add(r.rail);
      const pol = RAIL_POLICY[r.rail];
      if (!pol) { c.open.push({ cls: "undeclared-rail", rail: r.rail, verdict: r.verdict }); continue; }
      const kind = verdictKind(r.verdict);
      if (kind === "unknown") { c.open.push({ cls: "unknown-verdict", rail: r.rail, verdict: r.verdict }); continue; }
      if (kind === "pass") {
        if (pol.cls === "county-scoped" && !pol.onlyIn.includes(fips)) c.open.push({ cls: "county-scoped-breach", rail: r.rail, verdict: r.verdict });
        else c.pass++;
        continue;
      }
      let ok = !!pol.accept?.includes(kind);
      if (pol.cls === "county-scoped" && pol.onlyIn.includes(fips)) ok = false;
      if (pol.cls === "vendor-pending") {
        const inPending = pol.pendingIn.includes(fips);
        const status = ctx.vendors?.vendors?.[pol.vendor]?.status;
        if (!inPending) ok = false;
        else if (!ctx.vendors) { c.unmeasured.push({ cls: pol.cls, rail: r.rail, verdict: r.verdict, detail: "vendor register not readable" }); continue; }
        else if (status === "in-hand") { c.open.push({ cls: pol.cls, rail: r.rail, verdict: r.verdict, detail: `${pol.vendor} is in hand; the data is owed` }); continue; }
      }
      if (!ok) { c.open.push({ cls: pol.cls, rail: r.rail, verdict: r.verdict, unaccounted: r.unaccounted ?? null }); continue; }
      if (pol.verdictExact && r.verdict !== pol.verdictExact) {
        c.open.push({ cls: `${pol.cls}-verdict-changed`, rail: r.rail, verdict: r.verdict, detail: `accepted only as ${pol.verdictExact}` });
        continue;
      }
      const cp = couplingState(pol, r.rail, fips, ctx);
      if (cp.state === "broken") { c.open.push({ cls: `${pol.cls}-coupling-broken`, rail: r.rail, verdict: r.verdict, detail: cp.detail }); continue; }
      if (cp.state === "unmeasured") { c.unmeasured.push({ cls: pol.cls, rail: r.rail, verdict: r.verdict, detail: cp.detail }); continue; }
      c.accepted.push({ rail: r.rail, verdict: r.verdict, ruling: pol.ruling, coupling: cp.detail || undefined });
    }
    for (const rail of Object.keys(RAIL_POLICY)) if (!seen.has(rail)) c.open.push({ cls: "missing-verdict", rail });
    for (const f of falseEarned.filter((x) => x.county === fips && x.n > 0)) c.falseEarned.push({ id: f.id, n: f.n });
    if (c.open.length || c.falseEarned.length) flag("INCOMPLETE");
    else if (c.unmeasured.length) flag("UNMEASURED");
  }
  return out;
}

/** Pure: compare the policy's rail set with the factory's. */
export function railDrift(factoryKeys) {
  if (!factoryKeys) return { state: "unmeasured", detail: "factory rail list not readable" };
  const policy = new Set(Object.keys(RAIL_POLICY));
  const factory = new Set(factoryKeys);
  const missingFromPolicy = [...factory].filter((k) => !policy.has(k));
  const notInFactory = [...policy].filter((k) => !factory.has(k));
  if (missingFromPolicy.length || notInFactory.length) return { state: "drift", missingFromPolicy, notInFactory };
  return { state: "match", count: factory.size };
}

export function parseFactoryRailKeys(text) {
  const keys = [...String(text ?? "").matchAll(/\{\s*key:\s*"([^"]+)"/g)].map((m) => m[1]);
  return keys.length ? keys : null;
}

function readFactoryRailKeys(repo, sha) {
  try {
    return parseFactoryRailKeys(execFileSync("git", ["-C", repo, "show", `${sha}:${FACTORY_RAIL_KEYS_PATH}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch { return null; }
}

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

/**
 * Every TRACKED lane close in _inbox with the rows it names. Tracked only: an untracked close is
 * another seat's work in progress, and canon cites only what is tracked. Returns null (the
 * coupling then reads UNMEASURED) if git cannot list them or any listed close cannot be read.
 */
function readTrackedCloses() {
  let files;
  try {
    files = execFileSync("git", ["-C", DOC_REPO, "ls-files", "--", "_inbox/*_close.json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/).filter(Boolean);
  } catch { return null; }
  const out = [];
  for (const path of files) {
    try { out.push({ path, rows: closeRows(readFileSync(join(DOC_REPO, path), "utf8")) }); } catch { return null; }
  }
  return out;
}

function latestRoadResidual() {
  const dir = join(DOC_REPO, "_inbox");
  const hits = readdirSync(dir).filter((f) => /_p264_road_residual\.json$/.test(f)).sort();
  return hits.length ? join(dir, hits.at(-1)) : null;
}

function psqlCsv(dsn, sql) {
  const dir = mkdtempSync(join(tmpdir(), "completeness-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, `set default_transaction_read_only = on;\nset statement_timeout = '300s';\n${sql}`, "utf8");
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], {
      encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 320000,
      env: { ...process.env, PGOPTIONS: "-c default_transaction_read_only=on" },
    });
    if (r.error) throw new Error(`psql spawn error: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`psql failed: ${(r.stderr || "").split("\n")[0]}`);
    return parseCsv(r.stdout.split(/\r?\n/).filter((l) => l !== "SET").join("\n"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function measure(dsn, counties) {
  const list = counties.map((f) => `'${f}'`).join(",");
  const verdicts = psqlCsv(dsn, `
    select county_fips as county, rail_key as rail, verdict, coalesce(unaccounted_count, 0) as unaccounted,
           evaluated_at::text as evaluated_at
    from (select distinct on (county_fips, rail_key) * from parcel_gate_verdict
          where county_fips in (${list}) order by county_fips, rail_key, evaluated_at desc) v;`);
  const falseEarned = [];
  for (const f of FALSE_EARNED) {
    const rows = psqlCsv(dsn, `
      select split_part(place_key, ':', 1) as county, count(*) as n
      from parcel_record_cell
      where rail_key = '${f.rail}' and cell_state->>'kind' = '${f.kind}' and (${f.sql})
        and split_part(place_key, ':', 1) in (${list})
      group by 1;`);
    for (const r of rows) falseEarned.push({ county: r.county, id: f.id, n: Number(r.n) });
  }
  return { verdicts: verdicts.map((v) => ({ ...v, unaccounted: Number(v.unaccounted) })), falseEarned };
}

function selfTest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });
  const roadmap = readJson(join(DOC_REPO, "_catalog", "capability_roadmap.json"));
  const pending = { vendors: { cotality: { status: "pending" } } };
  const inHand = { vendors: { cotality: { status: "in-hand" } } };
  const residualClean = { counties: { "48209": { roadBlockedRenders: 0 }, "48453": { roadBlockedRenders: 0 } } };
  const ctx = { roadmap, vendors: pending, roadResidual: residualClean, drift: { state: "match" }, closes: [] };
  const full = (fips, overrides = {}) => Object.keys(RAIL_POLICY).map((rail) => {
    const pol = RAIL_POLICY[rail];
    let verdict = "pass";
    if (["ruled-withheld", "no-source", "ruled-unavailable", "deferred"].includes(pol.cls)) verdict = "excluded";
    if (pol.verdictExact) verdict = pol.verdictExact;
    if (pol.cls === "county-scoped" && !pol.onlyIn.includes(fips)) verdict = "excluded";
    if (pol.cls === "vendor-pending" && pol.pendingIn.includes(fips)) verdict = "refuse";
    return { county: fips, rail, verdict: overrides[rail] ?? verdict, unaccounted: 0 };
  });
  const one = ["48209"];

  check("1 a fully ruled county reads COMPLETE", classify(full("48209"), [], one, ctx).verdict === "COMPLETE");
  check("2 NOT VACUOUS: one false absent-verified population makes it INCOMPLETE",
    classify(full("48209"), [{ county: "48209", id: "setback-no-ruled-table:setbackFrontFt", n: 1026 }], one, ctx).verdict === "INCOMPLETE");
  const midCut = classify(full("48209", { parcelGeometry: "excluded" }), [], one, ctx);
  check("3 a mid-cutover rail left excluded is open", midCut.verdict === "INCOMPLETE" && midCut.counties["48209"].open.some((o) => o.rail === "parcelGeometry"));
  check("4 an undeclared rail fails closed", classify([...full("48209"), { county: "48209", rail: "newRail", verdict: "pass" }], [], one, ctx).counties["48209"].open.some((o) => o.cls === "undeclared-rail"));
  check("5 an empty county is UNMEASURED, never COMPLETE", classify([], [], one, ctx).verdict === "UNMEASURED");
  check("6 NEGATIVE CONTROL (ledger leg only; a served figure is the customer leg's): an R-2 rail excluded opens nothing",
    classify(full("48209", { buildableAreaSqFt: "excluded" }), [], one, ctx).verdict === "COMPLETE");
  check("7 the county-scoped rail excluded IN its own county is open", classify(full("48453", { maxImperviousCoverPct: "excluded" }), [], ["48453"], ctx).verdict === "INCOMPLETE");
  check("8 a rail with no verdict row is open", classify(full("48209").filter((r) => r.rail !== "owner"), [], one, ctx).counties["48209"].open.some((o) => o.cls === "missing-verdict" && o.rail === "owner"));
  check("9 a refusal on a must-pass rail is open", classify(full("48209", { maxHeightFt: "refuse" }), [], one, ctx).verdict === "INCOMPLETE");
  check("10 the policy declares exactly 65 rails", Object.keys(RAIL_POLICY).length === 65);
  check("11 deferred rails are accepted while the road residual is clean", classify(full("48209"), [], one, ctx).counties["48209"].accepted.some((a) => a.rail === "roads"));

  // P-253 additions.
  check("12 P-201 strings: excluded-no-acquisition-path on an R-2 rail is accepted, and the exact string is kept",
    classify(full("48209", { buildableAreaSqFt: "excluded-no-acquisition-path" }), [], one, ctx).counties["48209"].accepted.some((a) => a.rail === "buildableAreaSqFt" && a.verdict === "excluded-no-acquisition-path"));
  check("13 an unknown verdict string is open, never accepted", classify(full("48209", { owner: "maybe" }), [], one, ctx).counties["48209"].open.some((o) => o.cls === "unknown-verdict"));
  check("14 every setback rail has both false-earned predicates", SETBACK_RAILS.every((r) => FALSE_EARNED.filter((f) => f.rail === r).length === 2));
  check("15 a false absence on setbackSideFt alone makes it INCOMPLETE",
    classify(full("48209"), [{ county: "48209", id: "setback-router-miss:setbackSideFt", n: 5 }], one, ctx).verdict === "INCOMPLETE");
  const dropped = { ...roadmap, rails: { ...roadmap?.rails } }; delete dropped.rails.terrain;
  check("16 COUPLING: a no-source rail the roadmap no longer carries is open", classify(full("48209"), [], one, { ...ctx, roadmap: dropped }).counties["48209"].open.some((o) => o.rail === "terrain" && /coupling-broken/.test(o.cls)));
  check("17 the live roadmap register carries every no-source rail", !!roadmap && Object.entries(RAIL_POLICY).filter(([, p]) => p.coupling === "roadmap").every(([k]) => ["carried", "paused-by-ruling"].includes(roadmap.rails?.[k]?.status)));
  check("18 COUPLING: with no road residual artifact, the deferred rails are UNMEASURED, not accepted",
    (() => { const r = classify(full("48209"), [], one, { ...ctx, roadResidual: null }); return r.verdict === "UNMEASURED" && r.counties["48209"].unmeasured.some((u) => u.rail === "roads"); })());
  check("19 COUPLING: unruled road-blocked renders open the deferred rails",
    classify(full("48209"), [], one, { ...ctx, roadResidual: { counties: { "48209": { roadBlockedRenders: 12 } } } }).counties["48209"].open.some((o) => o.rail === "edgeSignal"));
  check("20 COUPLING: road-blocked renders with a named ruling keep them accepted",
    classify(full("48209"), [], one, { ...ctx, roadResidual: { counties: { "48209": { roadBlockedRenders: 12, ruledAcceptable: true, ruling: "A-999" } } } }).verdict === "COMPLETE");
  check("21 VENDOR: agValuation refusing in Hays is accepted while Cotality is pending", classify(full("48209"), [], one, ctx).verdict === "COMPLETE");
  check("22 VENDOR: the same refusal is open once Cotality is in hand", classify(full("48209"), [], one, { ...ctx, vendors: inHand }).counties["48209"].open.some((o) => o.rail === "agValuation"));
  check("23 VENDOR: agValuation refusing in Travis (not a pending county) is open",
    classify(full("48453", { agValuation: "refuse" }), [], ["48453"], ctx).counties["48453"].open.some((o) => o.rail === "agValuation"));
  check("24 SCOPE: maxImperviousCoverPct refusing outside Travis is accepted (P-252 with P-292)",
    classify(full("48209", { maxImperviousCoverPct: "refuse" }), [], one, ctx).verdict === "COMPLETE");
  check("25 INCOMPLETE wins over UNMEASURED", classify(full("48209", { maxHeightFt: "refuse" }), [], one, { ...ctx, roadResidual: null }).verdict === "INCOMPLETE");
  check("26 DRIFT: a rail the factory has and the policy lacks is reported", railDrift([...Object.keys(RAIL_POLICY), "newRail"]).state === "drift");
  check("27 DRIFT: a drifted or unreadable rail list makes the run UNMEASURED", classify(full("48209"), [], one, { ...ctx, drift: { state: "drift" } }).verdict === "UNMEASURED");
  check("28 the factory rail parser reads the META shape", JSON.stringify(parseFactoryRailKeys('{ key: "apn", grain: "scalar" },\n    { key: "situsCity", grain: "scalar" }')) === JSON.stringify(["apn", "situsCity"]));
  check("29 an unknown county reads its FIPS as its name", classify(full("48999"), [], ["48999"], ctx).counties["48999"].name === "48999");

  // P-337 (A-215 rulings 3 and 4). Both directions for every leg of the coupling.
  const openOn = (res, fips, rail, re) => res.counties[fips].open.some((o) => o.rail === rail && (!re || re.test(o.cls)));
  const acceptedOn = (res, fips, rail) => res.counties[fips].accepted.some((a) => a.rail === rail);
  const closeFor = (row) => ({ path: `_inbox/2099-01-01_${row.toLowerCase()}_close.json`, rows: [row] });
  const withEntry = (rail, patch) => ({ ...roadmap, rails: { ...roadmap?.rails, [rail]: patch === null ? undefined : { ...roadmap?.rails?.[rail], ...patch } } });
  check("30 landUseDescription excluded-mid-cutover is ACCEPTED while P-345 has no close",
    acceptedOn(classify(full("48209"), [], one, ctx), "48209", "landUseDescription"));
  check("31 railCorridor excluded-mid-cutover is ACCEPTED while P-344 has no close",
    acceptedOn(classify(full("48209"), [], one, ctx), "48209", "railCorridor"));
  check("32 NOT VACUOUS: a tracked close naming P-345 OPENS landUseDescription",
    openOn(classify(full("48209"), [], one, { ...ctx, closes: [closeFor("P-345")] }), "48209", "landUseDescription", /coupling-broken/));
  check("33 NOT VACUOUS: a tracked close naming P-344 OPENS railCorridor, and leaves landUseDescription accepted",
    (() => { const r = classify(full("48209"), [], one, { ...ctx, closes: [closeFor("P-344")] }); return openOn(r, "48209", "railCorridor", /coupling-broken/) && acceptedOn(r, "48209", "landUseDescription"); })());
  check("34 a close the seat acknowledged by path in the roadmap keeps the acceptance",
    acceptedOn(classify(full("48209"), [], one, { ...ctx, closes: [closeFor("P-345")], roadmap: withEntry("landUseDescription", { acknowledgedCloses: [closeFor("P-345").path] }) }), "48209", "landUseDescription"));
  check("35 the roadmap entry removed OPENS the rail",
    openOn(classify(full("48209"), [], one, { ...ctx, roadmap: withEntry("railCorridor", null) }), "48209", "railCorridor", /coupling-broken/));
  check("36 the roadmap entry flipped to carried (not paused-by-ruling) OPENS the rail",
    openOn(classify(full("48209"), [], one, { ...ctx, roadmap: withEntry("landUseDescription", { status: "carried" }) }), "48209", "landUseDescription", /coupling-broken/));
  check("37 the roadmap entry naming another row OPENS the rail",
    openOn(classify(full("48209"), [], one, { ...ctx, roadmap: withEntry("landUseDescription", { row: "P-999" }) }), "48209", "landUseDescription", /coupling-broken/));
  check("38 the store relabelling it excluded-not-applicable OPENS the rail (verdictExact)",
    openOn(classify(full("48209", { landUseDescription: "excluded-not-applicable" }), [], one, ctx), "48209", "landUseDescription", /verdict-changed/));
  check("39 a refusal on a ruled-exclusion rail is open", openOn(classify(full("48209", { railCorridor: "refuse" }), [], one, ctx), "48209", "railCorridor"));
  check("40 the cutover landing (verdict pass) counts as a pass, not an exclusion",
    (() => { const r = classify(full("48209", { landUseDescription: "pass" }), [], one, ctx); return r.verdict === "COMPLETE" && !acceptedOn(r, "48209", "landUseDescription"); })());
  check("41 unreadable closes make the ruled exclusions UNMEASURED, never accepted",
    (() => { const r = classify(full("48209"), [], one, { ...ctx, closes: null }); return r.verdict === "UNMEASURED" && r.counties["48209"].unmeasured.some((u) => u.rail === "landUseDescription"); })());
  check("42 the live roadmap register carries both ruled exclusions, paused-by-ruling, on their Phase 1 rows",
    !!roadmap && Object.entries(RAIL_POLICY).filter(([, p]) => p.coupling === "phase1-row").every(([k, p]) => roadmap.rails?.[k]?.status === "paused-by-ruling" && roadmap.rails?.[k]?.row === p.phase1Row));
  check("43 the other three P-204 rails are still open while excluded (P-336 has not cut them over)",
    ["parcelGeometry", "pipelines", "etjStatus"].every((rail) => openOn(classify(full("48209", { [rail]: "excluded-mid-cutover" }), [], one, ctx), "48209", rail)));
  check("44 closeRows reads each field spelling, and never a row named only in prose",
    JSON.stringify(closeRows('{"planRow":"P-345","note":"see P-344"}')) === JSON.stringify(["P-345"])
      && JSON.stringify(closeRows('{"plan_rows":["P-1","P-2"]}')) === JSON.stringify(["P-1", "P-2"])
      && closeRows('﻿{"planRows":["P-344"]}').includes("P-344"));
  check("45 closeRows reads an unparseable close conservatively (every row in its text)",
    closeRows('{"planRows": ["P-345"] broken').includes("P-345"));
  // P-348: the retired D1 situsState constant is a false earned state.
  check("46 the retired D1 situsState predicate is declared on situsState, as a value",
    FALSE_EARNED.some((f) => f.id === "situsState-retired-d1-constant" && f.rail === "situsState" && f.kind === "value" && /derived-county-fips/.test(f.sql)));
  check("47 NOT VACUOUS: one retired D1 cell makes the county INCOMPLETE",
    classify(full("48209"), [{ county: "48209", id: "situsState-retired-d1-constant", n: 1 }], one, ctx).verdict === "INCOMPLETE");

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function argValue(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!dsn) { console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set"); process.exit(2); }
  const counties = (argValue(args, "--counties") ?? Object.keys(SIX).join(",")).split(",").map((s) => s.trim());
  if (!counties.every((f) => /^\d{5}$/.test(f))) { console.error("UNMEASURED: --counties takes five-digit FIPS codes"); process.exit(2); }
  const factoryRepo = argValue(args, "--factory-repo") ?? "P:/hauska-factory";
  const residualPath = argValue(args, "--road-residual") ?? latestRoadResidual();
  const ctx = {
    roadmap: readJson(join(DOC_REPO, "_catalog", "capability_roadmap.json")),
    vendors: readJson(join(DOC_REPO, "_catalog", "vendor_contracts.json")),
    roadResidual: residualPath ? readJson(residualPath) : null,
    drift: railDrift(existsSync(factoryRepo) ? readFactoryRailKeys(factoryRepo, PINNED_FACTORY_SHA) : null),
    closes: readTrackedCloses(),
  };
  const started = new Date().toISOString();
  let data;
  try { data = measure(dsn, counties); } catch (e) { console.error(`UNMEASURED: ${e.message}`); process.exit(2); }
  const result = classify(data.verdicts, data.falseEarned, counties, ctx);
  const evals = data.verdicts.map((v) => v.evaluated_at).sort();
  result.snapshot = {
    ranAt: started, verdictsEvaluatedFrom: evals[0] ?? null, verdictsEvaluatedTo: evals.at(-1) ?? null,
    factoryRailListPin: PINNED_FACTORY_SHA, roadResidual: residualPath ?? null,
    vendorStatus: ctx.vendors?.vendors?.cotality?.status ?? null,
    trackedClosesRead: ctx.closes?.length ?? null,
  };
  const out = argValue(args, "--json");
  if (out) writeFileSync(out, JSON.stringify(result, null, 2));
  console.log(`VERDICT ${result.verdict}  (ran ${started}; rail list ${ctx.drift.state}; road residual ${residualPath ?? "none"})`);
  if (ctx.drift.state === "drift") console.log(`  rail drift: ${JSON.stringify(ctx.drift)}`);
  for (const [fips, c] of Object.entries(result.counties)) {
    const fe = c.falseEarned.map((f) => `${f.id}=${f.n}`).join(" ") || "none";
    console.log(`${fips} ${c.name.padEnd(10)} pass ${String(c.pass).padStart(2)}  ruled ${String(c.accepted.length).padStart(2)}  open ${String(c.open.length).padStart(2)}  unmeasured ${String(c.unmeasured.length).padStart(2)}`);
    console.log(`    false-earned: ${fe}`);
    for (const o of c.open) console.log(`    open        ${o.cls.padEnd(24)} ${o.rail}${o.verdict ? ` (${o.verdict}${o.unaccounted ? ` ${o.unaccounted}` : ""})` : ""}${o.detail ? `: ${o.detail}` : ""}`);
    for (const u of c.unmeasured) console.log(`    unmeasured  ${u.cls.padEnd(24)} ${u.rail}: ${u.detail}`);
  }
  process.exit(result.verdict === "COMPLETE" ? 0 : result.verdict === "UNMEASURED" ? 2 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
