#!/usr/bin/env node
/**
 * ledger-truth.mjs -- OPS-24 lane scaleup-la-ledger-truth (L-A LEDGER TRUTH).
 *
 * Question it answers: can the serving ledger be read to see every parcel and every one of
 * its 65 facts (rails), what serves, and what has an atom? Read-only, self-testing, in the
 * style of scripts/six-county-completeness.mjs (same store-access pattern reused verbatim).
 *
 * TWO stores, both read-only, NEVER printed:
 *   FACTORY_DATABASE_URL_RO -- parcel_record_cell (76M rows / 26GB, PK (place_key,rail_key)),
 *     parcel_gate_verdict (391 rows, one verdict per county+rail -- NOT per parcel),
 *     parcel_record_companion_row.
 *   ATOMS_DATABASE_URL -- hauska_mcp `atoms` (102M rows / 199GB). Every query against it is
 *     index-bounded (see ATOM_FAMILY_INDEX below) or an explicitly declared sample.
 *
 * SERVE-STATE MODEL (read from code, not invented -- see the module docs cited inline):
 *   hauska-engine services/retrieval-api/src/parcel-record-reader.ts `buildRailResponse` is
 *   THE reader (P-152 ONE-READER). Its serve state is a pure function of TWO county-level
 *   facts: (a) is (county,rail) in the engine's vendored PARCEL_RECORD_SLATE
 *   (services/retrieval-api/src/parcel-record-slate.json), (b) the county-level gate verdict
 *   for that rail (parcel_gate_verdict has NO place_key column -- one verdict per county+rail,
 *   not per parcel). Consequence, itself a finding: the reader's serve state is UNIFORM across
 *   every parcel in a county for a given rail. It never varies by parcel or by city. What DOES
 *   vary by parcel is the cell's own `kind` (value/refused/unaccounted/absent-verified/
 *   not-applicable). "What serves" at parcel grain is the AND of both: a rail whose county-level
 *   serve state is "record" can still be individually absent-verified for one parcel.
 *
 *   This instrument's serve-state vocabulary is a SUPERSET of the reader's three-value enum
 *   ("record" | "refused" | "legacy-transitional"), because the reader's own enum collapses two
 *   things LDT's own source code keeps distinct (module docs read 2026-09-16, legacy-design-tools
 *   origin/main artifacts/api-server/src/lib/parcelRecordAllowlist.ts and the *FactServeCutover.ts
 *   siblings):
 *     record              -- slated + gate verdict 'pass'.
 *     refused             -- slated + gate verdict present and not 'pass'.
 *     legacy-transitional -- NOT slated, but the rail DOES have a legacy (bake-derived) reader
 *                             to fall back to (setbackFrontFt/Side/Rear/Corner -> nodeFacetBakeTier1
 *                             computeTier1Envelope; dollar rails -> place_layer_snapshots cadRoll).
 *     not-cut-over         -- NOT slated, and the rail has NO legacy reader at all (confirmed by
 *                             each rail's own *FactServeCutover.ts module doc: "No legacy serve
 *                             path exists for this rail" -- utilityService, overlayDistricts,
 *                             agValuation, schoolDistrict, valueHistory; setbackRules names its
 *                             own typed `notCutOverSetbackRulesFact`). The one-reader's own code
 *                             reports these identically to legacy-transitional, which is a real
 *                             collapse this instrument un-collapses, not a bug in this instrument.
 *     atom-chain            -- no parcel_record_cell ROW exists at all for (place_key,rail) but an
 *                             atom exists in this rail's family. NOTE (overload, itself a finding):
 *                             "atom-chain" is ALSO hauska-map's own top-level PE retrieval
 *                             `readPath` enum value (apps/property-explorer/api/_lib/
 *                             atom-chain-to-facets.ts), a REQUEST-LEVEL choice between the
 *                             `/property-nodes/:id/atom-chain` endpoint and the one-reader's
 *                             `/record` endpoint -- NOT a per-rail cell state. No single per-rail
 *                             "atom-chain" state exists anywhere in the product code today; this
 *                             instrument's bucket of the same name is a narrower, cell-grain
 *                             definition it defines for itself. The two uses should not be
 *                             conflated and this file's own header says so on purpose.
 *     other                 -- no cell row, no atom either (indeterminate / genuine gap).
 *
 * ATOM FAMILY MAP: P-162 ("RAIL-TO-ATOM MAP", OPS-16 row, ADDED 2026-09-11) is the row that owes
 * a CODE-OWNED version of this map and has not landed one as of 2026-09-16 (no downstream
 * artifact found under _catalog/ or _inbox/ at time of this instrument's build). RAIL_TO_ATOM_FAMILY
 * below is THIS INSTRUMENT'S OWN, provisional, evidence-based map -- built from the seven families'
 * documented semantics and cross-checked empirically against the two probe parcels' live atoms
 * (48209:97658, 48453:427599) before use. Treat it as a finding's input, not as P-162's output.
 *
 * Usage:
 *   FACTORY_DATABASE_URL_RO=<dsn> ATOMS_DATABASE_URL=<dsn> node scripts/ledger-truth.mjs --parcel 48209:97658
 *   FACTORY_DATABASE_URL_RO=<dsn> ATOMS_DATABASE_URL=<dsn> node scripts/ledger-truth.mjs --rollup [--json out.json] [--sample-size 200]
 *   node scripts/ledger-truth.mjs --self-test
 *
 * DSNs are read from the environment and NEVER printed, logged, or written to any output file.
 * Requires `psql` on PATH. Atoms-store sessions set default_transaction_read_only and a
 * statement_timeout on every connection per the operating rule for that store.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export const SIX = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};

/**
 * Vendored copy of hauska-factory's closed parcel-record rail set (PARCEL_RECORD_RAIL_META),
 * pinned SHA 217b7dd7eb3a1b2f72f3a72d333008079f71fcaf, as carried by hauska-engine
 * services/retrieval-api/src/parcel-record-rail-registry.ts (read from origin/main 2026-09-16).
 * Copied here, not re-derived, for the same reason that file vendors it: never hand-author the
 * list. If this drifts from the registry's own SHA, that is a finding, not silently absorbed.
 */
export const RAIL_META = [
  { key: "apn", grain: "scalar", group: "cad" },
  { key: "situsAddress", grain: "scalar", group: "cad" },
  { key: "situsCity", grain: "scalar", group: "cad" },
  { key: "situsState", grain: "scalar", group: "cad" },
  { key: "situsZip", grain: "scalar", group: "cad" },
  { key: "landUseCode", grain: "scalar", group: "cad" },
  { key: "landUseDescription", grain: "scalar", group: "cad" },
  { key: "landUseSource", grain: "scalar", group: "cad" },
  { key: "landUseVintage", grain: "scalar", group: "cad" },
  { key: "acreageAcres", grain: "scalar", group: "cad" },
  { key: "acreageSqft", grain: "scalar", group: "cad" },
  { key: "acreageMethod", grain: "scalar", group: "cad" },
  { key: "yearBuilt", grain: "scalar", group: "cad" },
  { key: "marketValue", grain: "scalar", group: "cad" },
  { key: "assessedValue", grain: "scalar", group: "cad" },
  { key: "landValue", grain: "scalar", group: "cad" },
  { key: "improvementValue", grain: "scalar", group: "cad" },
  { key: "livingAreaSqft", grain: "scalar", group: "cad" },
  { key: "legalDescription", grain: "scalar", group: "cad" },
  { key: "exemptionCodes", grain: "scalar", group: "cad" },
  { key: "countyFips", grain: "scalar", group: "jurisdiction" },
  { key: "cityLimits", grain: "scalar", group: "jurisdiction" },
  { key: "etjStatus", grain: "scalar", group: "jurisdiction" },
  { key: "schoolDistrict", grain: "scalar", group: "jurisdiction" },
  { key: "zoningDistrict", grain: "scalar", group: "zoning-envelope" },
  { key: "zoningJurisdictionKey", grain: "scalar", group: "zoning-envelope" },
  { key: "zoningProvenance", grain: "scalar", group: "zoning-envelope" },
  { key: "envelopeStatus", grain: "scalar", group: "zoning-envelope" },
  { key: "setbackFrontFt", grain: "scalar", group: "zoning-envelope" },
  { key: "setbackSideFt", grain: "scalar", group: "zoning-envelope" },
  { key: "setbackRearFt", grain: "scalar", group: "zoning-envelope" },
  { key: "setbackCornerFt", grain: "scalar", group: "zoning-envelope" },
  { key: "parcelAreaSqFt", grain: "scalar", group: "zoning-envelope" },
  { key: "buildableAreaSqFt", grain: "scalar", group: "zoning-envelope" },
  { key: "buildableAreaPct", grain: "scalar", group: "zoning-envelope" },
  { key: "maxLotCoveragePct", grain: "scalar", group: "zoning-envelope" },
  { key: "maxHeightFt", grain: "scalar", group: "zoning-envelope" },
  { key: "maxFootprintSqFt", grain: "scalar", group: "zoning-envelope" },
  { key: "citationUrl", grain: "scalar", group: "zoning-envelope" },
  { key: "envelopeDisclosure", grain: "scalar", group: "zoning-envelope" },
  { key: "edgeSignal", grain: "scalar", group: "zoning-envelope" },
  { key: "maxImperviousCoverPct", grain: "scalar", group: "zoning-envelope" },
  { key: "treeProtection", grain: "scalar", group: "zoning-envelope" },
  { key: "setbackRules", grain: "companion", group: "companion" },
  { key: "wells", grain: "companion", group: "companion" },
  { key: "pipelines", grain: "companion", group: "companion" },
  { key: "permits", grain: "companion", group: "companion" },
  { key: "easements", grain: "companion", group: "companion" },
  { key: "buildingFootprint", grain: "companion", group: "companion" },
  { key: "specialDistricts", grain: "companion", group: "companion" },
  { key: "flood", grain: "companion", group: "companion" },
  { key: "owner", grain: "companion", group: "companion" },
  { key: "valueHistory", grain: "companion", group: "companion" },
  { key: "salesHistory", grain: "companion", group: "companion" },
  { key: "publicRecordRefs", grain: "companion", group: "companion" },
  { key: "ossf", grain: "companion", group: "companion" },
  { key: "utilityService", grain: "companion", group: "companion" },
  { key: "agValuation", grain: "companion", group: "companion" },
  { key: "mineralRights", grain: "companion", group: "companion" },
  { key: "hoaDeedRestrictions", grain: "companion", group: "companion" },
  { key: "overlayDistricts", grain: "companion", group: "companion" },
  { key: "parcelGeometry", grain: "companion", group: "spine" },
  { key: "roads", grain: "companion", group: "spine" },
  { key: "terrain", grain: "companion", group: "spine" },
  { key: "railCorridor", grain: "companion", group: "spine" },
];
export const RAIL_KEYS = RAIL_META.map((r) => r.key);

/** The envelope family, in full, per this lane's dispatch. */
export const ENVELOPE_RAILS = [
  "setbackFrontFt", "setbackSideFt", "setbackRearFt", "setbackCornerFt", "setbackRules",
  "maxHeightFt", "maxLotCoveragePct", "maxFootprintSqFt", "maxImperviousCoverPct",
  "parcelAreaSqFt", "buildableAreaSqFt", "buildableAreaPct", "envelopeStatus",
  "envelopeDisclosure", "edgeSignal", "citationUrl", "buildingFootprint", "parcelGeometry", "roads",
];

/** The seven atom families named in the dispatch, plus parcel-terrain-model (shares an index). */
export const ATOM_FAMILIES = [
  "zoning-fact", "setback-rule", "buildable-envelope",
  "property-boundary-edge", "building-footprint", "road-node", "parcel-node",
];

/**
 * THIS INSTRUMENT'S OWN rail -> atom-family map (P-162 has not landed a code-owned one; see the
 * module doc above). Cross-checked empirically 2026-09-16 against 48209:97658 and 48453:427599
 * live atoms (did:hauska:<family>:<parcelNodeId> for the one-atom-per-parcel-per-family families).
 * A rail with no entry is genuinely unmapped -- reported as such, never guessed.
 */
export const RAIL_TO_ATOM_FAMILY = {
  zoningDistrict: "zoning-fact",
  zoningJurisdictionKey: "zoning-fact",
  zoningProvenance: "zoning-fact",
  setbackFrontFt: "setback-rule",
  setbackSideFt: "setback-rule",
  setbackRearFt: "setback-rule",
  setbackCornerFt: "setback-rule",
  setbackRules: "setback-rule",
  buildableAreaSqFt: "buildable-envelope",
  buildableAreaPct: "buildable-envelope",
  envelopeStatus: "buildable-envelope",
  envelopeDisclosure: "buildable-envelope",
  maxHeightFt: "buildable-envelope",
  maxLotCoveragePct: "buildable-envelope",
  maxFootprintSqFt: "buildable-envelope",
  maxImperviousCoverPct: "buildable-envelope",
  parcelAreaSqFt: "buildable-envelope",
  citationUrl: "buildable-envelope",
  edgeSignal: "buildable-envelope",
  parcelGeometry: "property-boundary-edge",
  buildingFootprint: "building-footprint",
  roads: "road-node",
};

/**
 * Rails documented (each *FactServeCutover.ts's own module doc, legacy-design-tools origin/main,
 * read 2026-09-16) as having NO legacy serve path at all. When one of these is unslated, the
 * true state is "not-cut-over" (a typed refusal), not "legacy-transitional" (which implies a real
 * bake-derived fallback value exists). setbackRules is included on its own ServeCutover file's
 * explicit statement ("the not record branch here is not a legacy reader").
 */
export const NO_LEGACY_PATH_RAILS = new Set([
  "utilityService", "overlayDistricts", "agValuation", "schoolDistrict", "valueHistory", "setbackRules",
]);

/** Index map, exactly as given operationally: which atom families a parcel-bounded lookup can hit. */
export const ATOM_FAMILY_INDEX = {
  "zoning-fact": "atoms_property_parcel_node_idx (shared: zoning-fact/setback-rule/buildable-envelope/parcel-terrain-model)",
  "setback-rule": "atoms_property_parcel_node_idx (shared)",
  "buildable-envelope": "atoms_property_parcel_node_idx (shared)",
  "property-boundary-edge": "atoms_boundary_parcel_node_idx",
  "building-footprint": "atoms_building_footprint_parcel_node_idx",
  "parcel-node": "atoms_parcel_node_lookup_idx",
  "road-node": null, // indexed by roadNodeId and countyFips only -- NOT parcel-bounded. Must sample+declare.
};

function psqlCsv(dsn, sql, { pgoptions } = {}) {
  const env = { ...process.env };
  if (pgoptions) env.PGOPTIONS = pgoptions;
  const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1",
    "-c", "set default_transaction_read_only = on", "-c", "set statement_timeout = '240s'", "-c", sql], {
    encoding: "utf8", maxBuffer: 256 * 1024 * 1024, env,
  });
  if (r.status !== 0) throw new Error(`psql failed: ${(r.stderr || "").split("\n").slice(0, 4).join(" | ")}`);
  const lines = r.stdout.trim().split(/\r?\n/).filter((l) => l && l !== "SET");
  if (!lines.length) return [];
  const header = lines.shift().split(",");
  return lines.map((l) => {
    // naive CSV split is unsafe for embedded commas/quotes in jsonb text; use a tiny real parser.
    const vals = parseCsvLine(l);
    return Object.fromEntries(header.map((h, i) => [h, vals[i]]));
  });
}

function parseCsvLine(line) {
  const out = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function factoryQuery(sql) {
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!dsn) throw new Error("FACTORY_DATABASE_URL_RO not set");
  return psqlCsv(dsn, sql);
}

function atomsQuery(sql) {
  const dsn = process.env.ATOMS_DATABASE_URL;
  if (!dsn) throw new Error("ATOMS_DATABASE_URL not set");
  return psqlCsv(dsn, sql, { pgoptions: "-c default_transaction_read_only=on -c statement_timeout=240000" });
}

/** Read a file at a pinned ref from a sibling repo without touching its working tree. */
function gitShow(repoPath, ref, path) {
  const r = spawnSync("git", ["-C", repoPath, "show", `${ref}:${path}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) return null;
  return r.stdout;
}

/** Extract every "12345:railKey" literal from a block of source text. */
function extractSlateEntries(text) {
  if (!text) return new Set();
  const m = text.match(/"\d{5}:[A-Za-z]+"/g) || [];
  return new Set(m.map((s) => s.slice(1, -1)));
}

/**
 * Read both copies of the serve allowlist live from each repo's origin/main, at the paths and
 * repos the dispatch names. Returns {engine:Set, ldt:Set, engineMeta, ldtMeta}. Never mutates
 * either working tree (git show only).
 */
export function readSlates({
  // NOTE (LESSON, 2026-09-16): git.exe is a native Windows binary; it does not understand Git
  // Bash's /p/ MSYS path translation the way a shell built-in does. Passing "/p/hauska-engine"
  // here silently resolves to nothing when spawned from node's child_process (no shell to
  // translate it), and readSlates() used to fail closed to two EMPTY sets rather than throwing --
  // which collapsed every rail's serve state to "legacy-transitional" with no visible error until
  // the slatesAvailable flags were checked. Use a drive-letter path here, not an MSYS one.
  enginePath = "P:/hauska-engine",
  ldtPath = "P:/legacy-design-tools",
  engineRef = "origin/main",
  ldtRef = "origin/main",
} = {}) {
  const engineJson = gitShow(enginePath, engineRef, "services/retrieval-api/src/parcel-record-slate.json");
  const ldtTs = gitShow(ldtPath, ldtRef, "artifacts/api-server/src/lib/parcelRecordAllowlist.ts");
  let engine = new Set(), engineMeta = null;
  if (engineJson) {
    try {
      const parsed = JSON.parse(engineJson);
      engine = new Set(parsed.slate);
      engineMeta = { sourceCommit: parsed.sourceCommit, vendoredAt: parsed.vendoredAt };
    } catch { engine = extractSlateEntries(engineJson); }
  }
  const ldt = extractSlateEntries(ldtTs);
  return { engine, ldt, engineAvailable: !!engineJson, ldtAvailable: !!ldtTs };
}

/**
 * Pure classification: given the two slates and the county-level gate verdict, derive this
 * instrument's five-value serve state for one (county, rail). `verdict` is the gate's own string
 * (pass/refuse/excluded/...) or null when no verdict row exists. `hasCellRow`/`hasAtom` refine
 * the unslated branch into legacy-transitional / not-cut-over / atom-chain / other.
 */
export function classifyServe({ countyFips, railKey, engineSlate, ldtSlate, verdict, hasCellRow, hasAtom }) {
  const key = `${countyFips}:${railKey}`;
  const slatedEngine = engineSlate.has(key);
  const slatedLdt = ldtSlate.has(key);
  const slateDisagreement = slatedEngine !== slatedLdt;

  let serve;
  if (slatedEngine) {
    // Mirrors parcel-record-reader.ts buildRailResponse exactly: slated + no usable verdict
    // fails CLOSED to legacy-transitional, same as the allowlist's own "in slate, no verdict" branch.
    if (!verdict) serve = "legacy-transitional";
    else serve = verdict === "pass" ? "record" : "refused";
  } else if (hasCellRow === false && hasAtom) {
    serve = "atom-chain";
  } else if (hasCellRow === false && !hasAtom) {
    serve = "other";
  } else {
    serve = NO_LEGACY_PATH_RAILS.has(railKey) ? "not-cut-over" : "legacy-transitional";
  }
  return { serve, slatedEngine, slatedLdt, slateDisagreement };
}

function countyFipsOf(placeKey) {
  const m = /^(\d{5}):/.exec(placeKey || "");
  return m ? m[1] : null;
}

function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

// ---------------------------------------------------------------------------------------------
// MODE 1: per-parcel, all 65 rails.
// ---------------------------------------------------------------------------------------------

async function modeParcel(placeKey) {
  const countyFips = countyFipsOf(placeKey);
  if (!countyFips || !SIX[countyFips]) {
    console.error(`REFUSE: ${placeKey} does not resolve to one of the six program counties.`);
    process.exit(2);
  }

  const { engine, ldt, engineAvailable, ldtAvailable } = readSlates();
  if (!engineAvailable || !ldtAvailable) {
    console.error(`WARNING: could not read one or both slates live (engine=${engineAvailable} ldt=${ldtAvailable}); slate membership may be stale or empty.`);
  }

  const cellRows = factoryQuery(
    `select rail_key, cell_state from parcel_record_cell where place_key = '${placeKey.replace(/'/g, "''")}'`
  );
  const cellByRail = new Map(cellRows.map((r) => [r.rail_key, r.cell_state]));

  const verdictRows = factoryQuery(
    `select distinct on (rail_key) rail_key, verdict, evaluated_at
     from parcel_gate_verdict where county_fips = '${countyFips}'
     order by rail_key, evaluated_at desc`
  );
  const verdictByRail = new Map(verdictRows.map((r) => [r.rail_key, r]));

  // Atom families touched by this parcel's rails (dedup).
  const families = [...new Set(RAIL_KEYS.map((k) => RAIL_TO_ATOM_FAMILY[k]).filter(Boolean))];
  const familyAtoms = new Map();
  const indexBounded = families.filter((f) => ATOM_FAMILY_INDEX[f]);
  if (indexBounded.length) {
    // The three shared-index families in one query; the two separately-indexed families in their own.
    const shared = indexBounded.filter((f) => ["zoning-fact", "setback-rule", "buildable-envelope"].includes(f));
    if (shared.length) {
      const rows = atomsQuery(
        `select atom_did, entity_type, source_adapter, fetched_at::text, body
         from atoms where entity_type = ANY(ARRAY[${shared.map((f) => `'${f}'`).join(",")}])
           and body->>'parcelNodeId' = '${placeKey}'`
      );
      for (const r of rows) familyAtoms.set(r.entity_type, r);
    }
    for (const f of indexBounded.filter((f) => !["zoning-fact", "setback-rule", "buildable-envelope"].includes(f))) {
      const idxKeyField = f === "parcel-node" ? "parcelNodeId" : "parcelNodeId";
      const rows = atomsQuery(
        `select atom_did, entity_type, source_adapter, fetched_at::text, body
         from atoms where entity_type = '${f}' and body->>'${idxKeyField}' = '${placeKey}'
         limit 1`
      );
      if (rows.length) familyAtoms.set(f, rows[0]);
    }
  }
  // road-node has no parcel-bounded index; declare rather than scan.
  const roadNoteApplies = families.includes("road-node");

  const readAt = new Date().toISOString();
  const rails = RAIL_KEYS.map((railKey) => {
    const cell = cellByRail.get(railKey) ?? null;
    let cellParsed = null;
    try { cellParsed = cell ? JSON.parse(cell) : null; } catch { cellParsed = null; }
    const verdictRow = verdictByRail.get(railKey);
    const verdict = verdictRow ? verdictRow.verdict : null;
    const family = RAIL_TO_ATOM_FAMILY[railKey] ?? null;
    const atom = family ? (familyAtoms.get(family) ?? null) : null;
    const hasAtom = family === "road-node" ? null /* undeclared, no parcel-bounded index */ : !!atom;

    const { serve, slatedEngine, slatedLdt, slateDisagreement } = classifyServe({
      countyFips, railKey, engineSlate: engine, ldtSlate: ldt, verdict,
      hasCellRow: cell !== null, hasAtom: !!atom,
    });

    let agree = "n/a";
    if (family && cellParsed) {
      agree = compareCellToAtom(railKey, cellParsed, atom);
    } else if (family && !cellParsed && atom) {
      agree = "disagree (cell absent, atom present)";
    }

    return {
      rail: railKey,
      group: RAIL_META.find((r) => r.key === railKey)?.group,
      cellKind: cellParsed?.kind ?? "no-row",
      cellValue: cellParsed?.value ?? null,
      cellSource: cellParsed?.source ?? null,
      cellVintage: cellParsed?.vintage ?? null,
      servePath: serve,
      slatedEngine, slatedLdt, slateDisagreement,
      gateVerdict: verdict, gateEvaluatedAt: verdictRow?.evaluated_at ?? null,
      atomFamily: family,
      atomExists: family === "road-node" ? "not-parcel-indexed" : !!atom,
      atomSourceAdapter: atom?.source_adapter ?? null,
      atomFetchedAt: atom?.fetched_at ?? null,
      atomDid: atom?.atom_did ?? null,
      cellAtomAgree: agree,
    };
  });

  return { placeKey, countyFips, county: SIX[countyFips], readAt, rails, roadNoteApplies };
}

/** Rail-specific comparator between a parsed cell and its family's atom. Conservative: only
 * calls "agree"/"disagree" where a real comparison is possible; else "n/a-<reason>". */
function compareCellToAtom(railKey, cellParsed, atom) {
  if (!atom) {
    if (cellParsed.kind === "value") return "disagree (cell has value, no atom)";
    return "n/a (no atom, cell not a value)";
  }
  let body = atom.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  if (railKey === "zoningDistrict") {
    const atomDistrict = body.district ?? null;
    if (cellParsed.kind !== "value") {
      return atomDistrict ? "disagree (cell absent/refused, atom has a district)" : "agree (both absent)";
    }
    if (!atomDistrict) return "disagree (cell has a district, atom absent)";
    return String(cellParsed.value).trim().toUpperCase() === String(atomDistrict).trim().toUpperCase()
      ? "agree" : `disagree (cell=${cellParsed.value} atom=${atomDistrict})`;
  }
  if (railKey === "buildableAreaSqFt" || railKey === "buildableAreaPct" || railKey === "envelopeStatus" || railKey === "envelopeDisclosure") {
    // R-2 withholds these at the ledger entirely (RAIL_POLICY ruled-withheld, cell kind is always
    // 'unaccounted'/'excluded'-class); ANY buildable-envelope atom with a real outcome is therefore
    // a disagreement against the ledger's own withheld cell, by the ruling's own construction.
    const outcomeKind = body?.outcome?.kind ?? null;
    if (!outcomeKind) return "n/a (atom has no outcome)";
    if (cellParsed.kind === "value") return `disagree-shape (cell carries a value despite R-2 withholding; atom outcome=${outcomeKind})`;
    return `disagree (ledger withholds this rail by ruling R-2; atom outcome=${outcomeKind})`;
  }
  if (railKey.startsWith("setback")) {
    if (cellParsed.kind !== "value") return body ? "disagree (cell absent/refused, atom carries setback-rule data)" : "n/a";
    return "n/a (setback-rule atom body has no single scalar to compare against this rail's own value; see raw body)";
  }
  return "n/a (no comparator defined for this rail)";
}

// ---------------------------------------------------------------------------------------------
// MODE 2: county x city x rail rollup.
// ---------------------------------------------------------------------------------------------

const CITY_SPLIT_RAILS = [...new Set([...ENVELOPE_RAILS, "zoningDistrict", "zoningJurisdictionKey"])];

function countyKindCounts(fips) {
  const rows = factoryQuery(
    `select rail_key, coalesce(cell_state->>'kind','<null>') as kind, count(*) as n
     from parcel_record_cell
     where place_key >= '${fips}:' and place_key < '${fips};'
     group by 1,2`
  );
  return rows.map((r) => ({ rail: r.rail_key, kind: r.kind, n: Number(r.n) }));
}

function countyCityKindCounts(fips) {
  const railList = CITY_SPLIT_RAILS.map((r) => `'${r}'`).join(",");
  const rows = factoryQuery(`
    with city_map as (
      select place_key, cell_state->>'value' as city
      from parcel_record_cell
      where place_key >= '${fips}:' and place_key < '${fips};' and rail_key = 'zoningJurisdictionKey'
        and cell_state->>'kind' = 'value'
    ),
    zd as (
      select place_key, cell_state->>'kind' as zd_kind
      from parcel_record_cell
      where place_key >= '${fips}:' and place_key < '${fips};' and rail_key = 'zoningDistrict'
    ),
    target as (
      select place_key, rail_key, coalesce(cell_state->>'kind','<null>') as kind
      from parcel_record_cell
      where place_key >= '${fips}:' and place_key < '${fips};' and rail_key = ANY(ARRAY[${railList}])
    )
    select coalesce(cm.city, '(no city: ' || coalesce(zd.zd_kind, 'none') || ')') as city,
           t.rail_key, t.kind, count(*) as n
    from target t
    left join city_map cm using (place_key)
    left join zd using (place_key)
    group by 1,2,3
  `);
  return rows.map((r) => ({ city: r.city, rail: r.rail_key, kind: r.kind, n: Number(r.n) }));
}

function gateVerdicts() {
  const list = Object.keys(SIX).map((f) => `'${f}'`).join(",");
  const rows = factoryQuery(`
    select distinct on (county_fips, rail_key) county_fips, rail_key, verdict, unaccounted_count, evaluated_at::text
    from parcel_gate_verdict where county_fips in (${list})
    order by county_fips, rail_key, evaluated_at desc
  `);
  return rows;
}

/** Deterministic hash-selected sample of place_keys for a county, same convention P-176's
 * vendor-testset-ctx.mjs uses (md5(place_key) ordering) -- reproducible, declared. */
function sampleParcels(fips, n) {
  const rows = factoryQuery(`
    select place_key from parcel_record_cell
    where place_key >= '${fips}:' and place_key < '${fips};' and rail_key = 'zoningDistrict'
    order by md5(place_key) limit ${n}
  `);
  return rows.map((r) => r.place_key);
}

function atomPresenceForSample(fips, placeKeys, families) {
  if (!placeKeys.length) return { rows: [], sampleSize: 0 };
  const inList = placeKeys.map((k) => `'${k}'`).join(",");
  const shared = families.filter((f) => ["zoning-fact", "setback-rule", "buildable-envelope"].includes(f));
  const results = [];
  if (shared.length) {
    const rows = atomsQuery(`
      select entity_type, body->>'parcelNodeId' as pnid, source_adapter, body->'outcome'->>'kind' as envelope_outcome
      from atoms where entity_type = ANY(ARRAY[${shared.map((f) => `'${f}'`).join(",")}])
        and body->>'parcelNodeId' = ANY(ARRAY[${inList}])
    `);
    results.push(...rows);
  }
  for (const f of families.filter((f) => f === "property-boundary-edge" || f === "building-footprint" || f === "parcel-node")) {
    const rows = atomsQuery(`
      select entity_type, body->>'parcelNodeId' as pnid, source_adapter, null as envelope_outcome
      from atoms where entity_type = '${f}' and body->>'parcelNodeId' = ANY(ARRAY[${inList}])
    `);
    results.push(...rows);
  }
  return { rows: results, sampleSize: placeKeys.length };
}

async function modeRollup({ sampleSize = 200 } = {}) {
  const { engine, ldt, engineAvailable, ldtAvailable } = readSlates();
  const verdicts = gateVerdicts();
  const verdictKey = (fips, rail) => verdicts.find((v) => v.county_fips === fips && v.rail_key === rail);

  const servePathTable = {}; // county -> rail -> {serve, slatedEngine, slatedLdt, slateDisagreement, verdict}
  for (const fips of Object.keys(SIX)) {
    servePathTable[fips] = {};
    for (const rail of RAIL_KEYS) {
      const v = verdictKey(fips, rail);
      const cls = classifyServe({
        countyFips: fips, railKey: rail, engineSlate: engine, ldtSlate: ldt,
        verdict: v?.verdict ?? null,
        hasCellRow: true, // county-level rollup: presume rows exist; per-parcel absence is in the kind counts, not here.
        hasAtom: null,
      });
      servePathTable[fips][rail] = { ...cls, verdict: v?.verdict ?? null, evaluatedAt: v?.evaluated_at ?? null, unaccounted: v ? Number(v.unaccounted_count) : null };
    }
  }

  const slateDisagreements = [];
  for (const fips of Object.keys(SIX)) {
    for (const rail of RAIL_KEYS) {
      if (servePathTable[fips][rail].slateDisagreement) {
        slateDisagreements.push({ county: fips, rail, engineSlated: servePathTable[fips][rail].slatedEngine, ldtSlated: servePathTable[fips][rail].slatedLdt });
      }
    }
  }

  const byCounty = {};
  const cityRollup = {};
  for (const fips of Object.keys(SIX)) {
    console.error(`[ledger-truth] county ${fips} (${SIX[fips]}): cell kind counts (all 65 rails)...`);
    byCounty[fips] = countyKindCounts(fips);
    console.error(`[ledger-truth] county ${fips} (${SIX[fips]}): city x rail kind counts (envelope+zoning, ${CITY_SPLIT_RAILS.length} rails)...`);
    cityRollup[fips] = countyCityKindCounts(fips);
  }

  console.error(`[ledger-truth] atom-presence sample: ${sampleSize} parcels/county, selected by md5(place_key) ordering (P-176 convention).`);
  const atomSample = {};
  for (const fips of Object.keys(SIX)) {
    const parcels = sampleParcels(fips, sampleSize);
    const families = ["zoning-fact", "setback-rule", "buildable-envelope", "property-boundary-edge", "building-footprint", "parcel-node"];
    const { rows, sampleSize: n } = atomPresenceForSample(fips, parcels, families);
    const presentByFamily = {};
    for (const f of families) presentByFamily[f] = new Set(rows.filter((r) => r.entity_type === f).map((r) => r.pnid)).size;
    atomSample[fips] = { sampleSize: n, selectionRule: "order by md5(place_key) limit N, zoningDistrict-rail-anchored", presentByFamily, totalSampled: n };
  }

  // Whole-6-county-scope envelope-atom disagreement count (exact, index-bounded -- not a sample).
  console.error(`[ledger-truth] exact 6-county count: buildable-envelope atoms with outcome=no-buildable-area...`);
  const envDisagreeRows = atomsQuery(`
    select count(*) as n from atoms where entity_type='buildable-envelope'
      and (${Object.keys(SIX).map((f) => `body->>'parcelNodeId' like '${f}:%'`).join(" or ")})
      and body->'outcome'->>'kind' = 'no-buildable-area'
  `);
  const envDisagreeCount = Number(envDisagreeRows[0]?.n ?? 0);

  return {
    generatedAt: new Date().toISOString(),
    slatesAvailable: { engine: engineAvailable, ldt: ldtAvailable },
    slateDisagreements,
    servePathTable,
    cellKindByCounty: byCounty,
    cellKindByCity: cityRollup,
    atomSample,
    envelopeSixCountyNoBuildableAreaCount: envDisagreeCount,
  };
}

// ---------------------------------------------------------------------------------------------
// SELF-TEST
// ---------------------------------------------------------------------------------------------

function selfTest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });

  check("65 rails declared", RAIL_KEYS.length === 65);
  check("envelope family has 19 rails per the dispatch's literal list", ENVELOPE_RAILS.length === 19);
  check("every RAIL_TO_ATOM_FAMILY value is one of the seven declared families", Object.values(RAIL_TO_ATOM_FAMILY).every((f) => ATOM_FAMILIES.includes(f)));

  // classifyServe: record.
  const rec = classifyServe({ countyFips: "48021", railKey: "wells", engineSlate: new Set(["48021:wells"]), ldtSlate: new Set(["48021:wells"]), verdict: "pass", hasCellRow: true, hasAtom: false });
  check("1 slated + verdict pass -> record", rec.serve === "record");

  const ref = classifyServe({ countyFips: "48209", railKey: "flood", engineSlate: new Set(["48209:flood"]), ldtSlate: new Set(["48209:flood"]), verdict: "excluded", hasCellRow: true, hasAtom: false });
  check("2 slated + verdict excluded -> refused", ref.serve === "refused");

  const legTrans = classifyServe({ countyFips: "48209", railKey: "setbackSideFt", engineSlate: new Set(), ldtSlate: new Set(["48209:setbackSideFt"]), verdict: null, hasCellRow: true, hasAtom: false });
  check("3 NOT engine-slated (has a legacy reader) -> legacy-transitional", legTrans.serve === "legacy-transitional");
  check("3b slate disagreement detected when engine and LDT differ", legTrans.slateDisagreement === true);

  const notCut = classifyServe({ countyFips: "48021", railKey: "utilityService", engineSlate: new Set(), ldtSlate: new Set(), verdict: null, hasCellRow: true, hasAtom: false });
  check("4 unslated + no-legacy-path rail -> not-cut-over", notCut.serve === "not-cut-over");

  const atomChain = classifyServe({ countyFips: "48021", railKey: "zoningDistrict", engineSlate: new Set(), ldtSlate: new Set(), verdict: null, hasCellRow: false, hasAtom: true });
  check("5 no cell row + atom present -> atom-chain", atomChain.serve === "atom-chain");

  const other = classifyServe({ countyFips: "48021", railKey: "zoningDistrict", engineSlate: new Set(), ldtSlate: new Set(), verdict: null, hasCellRow: false, hasAtom: false });
  check("6 no cell row + no atom -> other", other.serve === "other");

  const failClosed = classifyServe({ countyFips: "48021", railKey: "wells", engineSlate: new Set(["48021:wells"]), ldtSlate: new Set(["48021:wells"]), verdict: null, hasCellRow: true, hasAtom: false });
  check("7 slated + no verdict fails CLOSED to legacy-transitional (mirrors reader's own branch)", failClosed.serve === "legacy-transitional");

  // NOT VACUOUS (falsifier 3): a cell/atom pair that disagrees must be reported as disagreeing;
  // a fixture with no atom must not be reported as agreeing.
  const disagreeFixture = compareCellToAtom("zoningDistrict", { kind: "value", value: "SF-1" }, { source_adapter: "x", body: { district: "GC" } });
  check("8 NOT VACUOUS: disagreeing cell+atom reports disagree", /^disagree/.test(disagreeFixture));

  const agreeFixture = compareCellToAtom("zoningDistrict", { kind: "value", value: "sf-1" }, { source_adapter: "x", body: { district: "SF-1" } });
  check("9 case-insensitive matching value reports agree", agreeFixture === "agree");

  const noAtomFixture = compareCellToAtom("zoningDistrict", { kind: "value", value: "SF-1" }, null);
  check("10 NOT VACUOUS: a fixture with NO atom is never reported as agreeing", noAtomFixture !== "agree" && /^disagree/.test(noAtomFixture));

  const r2Fixture = compareCellToAtom("buildableAreaSqFt", { kind: "unaccounted" }, { body: { outcome: { kind: "no-buildable-area", areaSqFt: 0 } } });
  check("11 R-2-withheld cell + real envelope-atom outcome reports disagree", /^disagree/.test(r2Fixture));

  check("12 NO_LEGACY_PATH_RAILS matches the module-doc-cited set", [...NO_LEGACY_PATH_RAILS].sort().join(",") ===
    ["agValuation", "overlayDistricts", "schoolDistrict", "setbackRules", "utilityService", "valueHistory"].sort().join(","));

  check("13 road-node has no parcel-bounded index entry (must be sampled/declared)", ATOM_FAMILY_INDEX["road-node"] === null);

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad}/${results.length})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();

  const parcelIdx = args.indexOf("--parcel");
  if (parcelIdx >= 0) {
    const placeKey = args[parcelIdx + 1];
    const result = await modeParcel(placeKey);
    const outIdx = args.indexOf("--json");
    if (outIdx >= 0) writeFileSync(args[outIdx + 1], JSON.stringify(result, null, 2));
    console.log(`PARCEL ${result.placeKey} (${result.county}) read at ${result.readAt}`);
    for (const r of result.rails) {
      console.log(
        `  ${r.rail.padEnd(24)} kind=${String(r.cellKind).padEnd(16)} serve=${String(r.servePath).padEnd(20)} ` +
        `atomFamily=${String(r.atomFamily).padEnd(20)} atomExists=${String(r.atomExists).padEnd(6)} agree=${r.cellAtomAgree}`
      );
    }
    return;
  }

  if (args.includes("--rollup")) {
    const sIdx = args.indexOf("--sample-size");
    const sampleSize = sIdx >= 0 ? Number(args[sIdx + 1]) : 200;
    const result = await modeRollup({ sampleSize });
    const outIdx = args.indexOf("--json");
    if (outIdx >= 0) writeFileSync(args[outIdx + 1], JSON.stringify(result, null, 2));
    console.log(`ROLLUP generated ${result.generatedAt}`);
    console.log(`slate disagreements: ${result.slateDisagreements.length}`);
    for (const d of result.slateDisagreements) console.log(`  ${d.county}:${d.rail} engine=${d.engineSlated} ldt=${d.ldtSlated}`);
    console.log(`6-county buildable-envelope atoms with outcome=no-buildable-area: ${result.envelopeSixCountyNoBuildableAreaCount}`);
    return;
  }

  console.error("Usage: --self-test | --parcel <placeKey> [--json out.json] | --rollup [--sample-size N] [--json out.json]");
  process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(`UNMEASURED: ${e.message}`); process.exit(2); });
}
