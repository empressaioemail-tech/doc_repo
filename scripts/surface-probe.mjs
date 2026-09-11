#!/usr/bin/env node
/**
 * surface-probe.mjs — OPS-23's completion predicate: what the customer surfaces actually
 * serve for a fixed parcel set, measured live, never inferred from a merge or a store read.
 *
 * WHY THIS EXISTS. Every lane on this thread since August closed on a claim measured
 * somewhere other than the app: at cortex, at the ledger, at the MCP, at a merged PR. Each
 * claim was true where it was measured and false on smartsite.cloud. OPS-21's own close said
 * "setbacks serving in production, five counties, go open the app" on the day the app showed
 * five-week-old values. This instrument measures the surfaces. R-4 in OPS-23: a lane does not
 * close without its artifact.
 *
 * THE THREE-QUESTION GATE (ENFORCEMENT.md), answered here so it is not answered by memory:
 *   1. What executes this?  This file. `node scripts/surface-probe.mjs`.
 *   2. What triggers it?    A lane close (the close must cite the artifact this writes to
 *                           _inbox/), and any planner or operator by hand. The hook that
 *                           refuses a P-151..P-159 close without a cited artifact is
 *                           .claude/hooks/dirty-tree-close-gate.ps1 once armed; until then the
 *                           trigger is the close reviewer, which is not a control and is said so.
 *   3. What fails?          Non-zero exit, and a FAIL row in the artifact. Exit 1 = a measured
 *                           predicate failed. Exit 2 = refused: a required leg could not run
 *                           (missing credential, no network) and this never reports a pass it
 *                           did not measure.
 *   4. What bypasses it?    A close that cites no artifact (until the hook). The operator-run
 *                           legs (get_smart_site, export_instrument, the screenshot) enter via
 *                           --observations and are trusted as pasted; they are labelled
 *                           OBSERVED, never MEASURED, in every row that uses them.
 *
 * STATE YOUR SNAPSHOT. The artifact records doc_repo HEAD, the run time, every base URL, and
 * the sha256 of the observations file. It does not record serving revisions; read those from
 * Cloud Run by field name (the fleet's own rule) and paste them into the close.
 *
 *   node scripts/surface-probe.mjs                         run every row against production
 *   node scripts/surface-probe.mjs --rows P-151,P-153      run only those rows' predicates
 *   node scripts/surface-probe.mjs --observations f.json   fold in operator-run legs
 *   node scripts/surface-probe.mjs --self-test             fixtures, both directions, non-vacuity
 *   node scripts/surface-probe.mjs --fixtures              evaluate the committed fixtures
 *                                                          (the 2026-09-11 state) instead of live
 *
 * The cortex node leg needs CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER.
 * The header NAME is not guessed: a wrong header falls through to the anonymous gate silently
 * (fleet memory hauska-mcp-auth-header), so the seat that holds the key declares it.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "surface-probe");
const PE_BASE = process.env.SURFACE_PROBE_PE_BASE || "https://smartsite.cloud";
const CORTEX_PROXY = `${PE_BASE}/api/spine/cortex/api`;

/** Metres around the record point for the ring probe; mirrors the resolver's own constant. */
const RING_PROBE_METRES = 150;
const LEG_TIMEOUT_MS = { facets: 30_000, envelopeByAddress: 30_000, envelopeByPoint: 12_000, gisRing: 30_000, cortexNode: 30_000 };

// --------------------------------------------------------------------------- the parcel set
// OPS-23 §7. A lane may add one; it may not remove one. The four other-county parcels are
// chosen by this row's lane from parcel_record and appended here with the query that chose them.
export const PARCELS = [
  { id: "48021:34049", fips: "48021", label: "1109 Pecan St, Bastrop; corner lot, improved 1906; five-way setback disagreement" },
  { id: "48021:33223", fips: "48021", label: "P-91 gold parcel; MCP refuse baseline" },
  { id: "48453:113408", fips: "48453", label: "414 Spiller Ln, West Lake Hills; split situs; unplaceable card on 2026-09-11" },
  { id: "48453:474034", fips: "48453", label: "2601 Sterling Panorama Ct; unincorporated, Lake Pointe MUD; feasibility 154 s" },
  { id: "48453:367134", fips: "48453", label: "5833 Taylor Draper Cv, Austin SF-2; declared-complete city" },
];

// --------------------------------------------------------------------------- small helpers
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const rec = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);

function composeAddress(base) {
  const a = str(base?.situsAddress);
  if (!a) return null;
  const city = str(base?.situsCity);
  const state = str(base?.situsState) || "TX";
  if (city && !a.toUpperCase().includes(city.toUpperCase())) return `${a}, ${city}, ${state}`;
  return a;
}

function bboxAround(pt, metres) {
  const dLat = metres / 111_320;
  const dLng = metres / (111_320 * Math.cos((pt.lat * Math.PI) / 180) || 1);
  return { west: pt.lng - dLng, south: pt.lat - dLat, east: pt.lng + dLng, north: pt.lat + dLat };
}

function firstPolygonVertexCount(geojson) {
  const f = rec(geojson)?.features;
  const g = Array.isArray(f) ? rec(f[0])?.geometry : rec(geojson)?.geometry ?? geojson;
  const ring = rec(g)?.type === "Polygon" && Array.isArray(g.coordinates) ? g.coordinates[0] : null;
  return Array.isArray(ring) ? ring.length : null;
}

async function call(method, url, body, timeoutMs, headers = {}) {
  const t0 = Date.now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctl.signal,
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* non-JSON body is a finding, kept as text */ }
    return { http: res.status, ms: Date.now() - t0, json, text: json ? null : text.slice(0, 300) };
  } catch (e) {
    return { http: 0, ms: Date.now() - t0, json: null, error: e?.name === "AbortError" ? `TIMEOUT after ${timeoutMs} ms` : String(e?.message ?? e) };
  } finally {
    clearTimeout(timer);
  }
}

// --------------------------------------------------------------------------- leg extractors
// Each extractor turns a raw response into the few fields the predicates read. They are pure so
// the self-test can run them on fixtures. A missing field is null, never a default.
export function extractFacets(resp) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, error: resp?.error ?? resp?.text ?? "no JSON body" };
  const f = rec(j.facets) ?? {};
  const base = rec(f.baseFacts) ?? {};
  const env = rec(f.envelope);
  const sb = rec(env?.setbacks);
  const cl = rec(j.cityLimitsFact);
  const qp = rec(cl?.queryPoint);
  return {
    measured: true,
    http: resp.http,
    readPath: str(j.readPath),
    bakedAt: str(f.bakedAt),
    situsAddress: str(base.situsAddress),
    situsCity: str(base.situsCity),
    situsState: str(base.situsState),
    composedAddress: composeAddress(base),
    zoningDistrict: str(rec(f.zoning)?.district),
    envelopeStatus: str(env?.status),
    envelopeDisclosure: str(env?.disclosure),
    envelopeGeojsonPresent: !!env?.geojson,
    buildableAreaSqFtInPayload: num(env?.buildableAreaSqFt),
    setbacks: sb ? { front: num(sb.front_ft), side: num(sb.side_ft), rear: num(sb.rear_ft), corner: num(sb.side_corner_ft) } : null,
    cityLimitsStatus: str(cl?.status),
    recordPoint: qp && num(qp.latitude) != null && num(qp.longitude) != null ? { lat: qp.latitude, lng: qp.longitude } : null,
    structuralState: str(rec(j.structuralFact)?.status ?? rec(j.structuralFact)?.state),
    footprintState: str(rec(j.buildingFootprintFact)?.state),
    boundaryState: str(rec(j.boundaryEdgeFact)?.state),
  };
}

export function extractEnvelope(resp) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, error: resp?.error ?? resp?.text ?? "no JSON body" };
  const sb = rec(j.setbacks);
  return {
    measured: true,
    http: resp.http,
    ms: resp.ms,
    status: str(j.status) ?? (j.errorClass ? `error:${j.errorClass}` : null),
    parcelNodeId: str(j.parcel_node_id ?? j.parcelNodeId),
    setbacks: sb ? { front: num(sb.front_ft), side: num(sb.side_ft), rear: num(sb.rear_ft), corner: num(sb.side_corner_ft) } : null,
    vertexCount: firstPolygonVertexCount(rec(j.payload)?.geojson ?? j.geometry ?? null),
    buildableAreaSqFtInPayload: num(rec(rec(rec(rec(j.payload)?.geojson)?.features?.[0])?.properties)?.buildableAreaSqFt),
    message: str(j.message ?? j.reason),
  };
}

/** Ray-casting point-in-ring test on [lng,lat] pairs; outer ring only, which is enough for a probe. */
function pointInRing(ring, pt) {
  if (!Array.isArray(ring) || ring.length < 4) return false;
  let inside = false;
  for (let i = 0, k = ring.length - 1; i < ring.length; k = i++) {
    const [xi, yi] = ring[i]; const [xk, yk] = ring[k];
    const hit = (yi > pt.lat) !== (yk > pt.lat) && pt.lng < ((xk - xi) * (pt.lat - yi)) / (yk - yi || 1e-12) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function outerRing(geometry) {
  const g = rec(geometry);
  if (!g) return null;
  if (g.type === "Polygon") return g.coordinates?.[0] ?? null;
  if (g.type === "MultiPolygon") return g.coordinates?.[0]?.[0] ?? null;
  return null;
}

/**
 * The ring probe matches two ways and says which. By id: a feature whose properties carry the
 * record's prop_id as a whole token (string or number). By point: the feature whose outer ring
 * contains the record point. When the point match exists and the id match does not, the layer
 * keys parcels by a different id scheme than the record does (Bastrop County GIS keys by its own
 * object id, `48021:8741972`, while every other path keys by CAD prop_id `34049`); that is a
 * node-identity finding for P-161, reported, never silently absorbed.
 */
export function extractGisRing(resp, propId, point = null) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, error: resp?.error ?? resp?.text ?? "no JSON body" };
  const feats = rec(j.geojson)?.features ?? j.features ?? [];
  const list = Array.isArray(feats) ? feats : [];
  const rx = new RegExp(`[":]\\s*"?${propId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"?\\s*[,}]`);
  const byId = list.find((f) => rx.test(JSON.stringify(rec(f)?.properties ?? {}))) ?? null;
  const byPoint = point ? list.find((f) => pointInRing(outerRing(rec(f)?.geometry), point)) ?? null : null;
  const idOf = (f) => str(rec(f?.properties)?.parcel_node_id ?? rec(f?.properties)?.apn ?? rec(f?.properties)?.prop_id);
  // When nothing contains the point, name the nearest feature by centroid so a hole in the
  // layer is reported as a hole with a distance, never as a bare `false`.
  let nearest = null;
  if (point && !byPoint) {
    const mLat = 111_320, mLng = 111_320 * Math.cos((point.lat * Math.PI) / 180) || 1;
    for (const f of list) {
      const r = outerRing(rec(f)?.geometry);
      if (!Array.isArray(r) || !r.length) continue;
      const cx = r.reduce((s, c) => s + c[0], 0) / r.length, cy = r.reduce((s, c) => s + c[1], 0) / r.length;
      const d = Math.hypot((cx - point.lng) * mLng, (cy - point.lat) * mLat);
      if (!nearest || d < nearest.metres) nearest = { id: idOf(f), situs: str(rec(f.properties)?.situsAddress), metres: Math.round(d) };
    }
  }
  return {
    measured: true,
    http: resp.http,
    provider: str(j.provider),
    featureCount: list.length,
    matchesParcel: !!byId || !!byPoint,
    matchedBy: byId ? "id" : byPoint ? "point" : null,
    containingFeatureId: byPoint ? idOf(byPoint) : null,
    idSchemeMismatch: !!byPoint && !byId,
    noContainingPolygon: !!point && !byPoint,
    nearest,
  };
}

// --------------------------------------------------------------------------- predicates
// Each predicate returns { verdict: 'PASS'|'FAIL'|'UNMEASURED', basis: string }. It reads only
// the extracted legs and the observations block. UNMEASURED means a leg it needs did not run;
// it is never a pass. A predicate that would pass on an empty input is a defect; the self-test
// asserts that it does not.
const sameSetbacks = (a, b) => !!a && !!b && ["front", "side", "rear", "corner"].every((k) => a[k] === b[k]);
const fmtSb = (s) => (s ? `${s.front}/${s.side}/${s.rear}/${s.corner ?? "-"}` : "none");

export const ROWS = {
  "P-151": {
    title: "placement never depends on geocoding",
    parcels: ["48453:113408", "48453:474034"],
    evaluate(id, legs, obs) {
      const pt = legs.envelopeByPoint;
      const fx = legs.facets;
      if (!pt?.measured && !pt?.http) return { verdict: "UNMEASURED", basis: "point route leg did not run" };
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      const pointAnswers = pt.http >= 200 && pt.http < 500 && !pt.error;
      const sealed = obs?.[id]?.sheetSealed;
      const parts = [
        `point route http ${pt.http}${pt.error ? " " + pt.error : ""} in ${pt.ms} ms (must answer or refuse, never 5xx/timeout)`,
        `record point ${fx.recordPoint ? "present" : "ABSENT"}`,
        `ring probe ${legs.gisRing?.measured ? (legs.gisRing.matchesParcel ? "matches parcel" : "NO MATCH") : "not run"}`,
        `sheet sealed: ${sealed === true ? "OBSERVED yes" : sealed === false ? "OBSERVED no" : "not observed"}`,
      ];
      if (!pointAnswers) return { verdict: "FAIL", basis: parts.join("; ") };
      if (sealed === false) return { verdict: "FAIL", basis: parts.join("; ") };
      if (sealed !== true) return { verdict: "UNMEASURED", basis: parts.join("; ") + " -- the sheet seal is an operator observation; paste it via --observations" };
      return { verdict: "PASS", basis: parts.join("; ") };
    },
  },
  "P-153": {
    title: "envelope polygon drawn on the map and carried by the MCP draw block; figure refused",
    parcels: ["48021:34049", "48453:474034"],
    evaluate(id, legs, obs) {
      const env = legs.envelopeByAddress;
      if (!env?.measured && !env?.http) return { verdict: "UNMEASURED", basis: "envelope-by-address leg did not run" };
      const o = obs?.[id] ?? {};
      if (id === "48453:474034") {
        // The negative control: no district, no polygon anywhere.
        const refused = env.status !== "ok";
        const mcpRefused = o.mcpEnvelopeGeomVertices == null;
        const drawn = o.overlayDrawn;
        const basis = `endpoint status ${env.status}; MCP envelope vertices ${o.mcpEnvelopeGeomVertices ?? "none/observed-none"}; overlay drawn ${drawn ?? "not observed"}`;
        if (!refused) return { verdict: "FAIL", basis };
        if (drawn === true || !mcpRefused) return { verdict: "FAIL", basis };
        if (drawn == null) return { verdict: "UNMEASURED", basis };
        return { verdict: "PASS", basis };
      }
      const n = env.vertexCount;
      const parts = [`endpoint status ${env.status}, polygon vertices ${n ?? "none"}`];
      if (env.status !== "ok" || !n) return { verdict: "FAIL", basis: parts.join("; ") + " -- precondition: the endpoint must return a polygon" };
      parts.push(`overlay drawn: ${o.overlayDrawn === true ? "OBSERVED yes" : o.overlayDrawn === false ? "OBSERVED no" : "not observed"}`);
      parts.push(`MCP draw envelope vertices: ${o.mcpEnvelopeGeomVertices ?? "not observed"}`);
      parts.push(`figure printed on any surface: ${o.figurePrinted === true ? "OBSERVED YES (defect)" : o.figurePrinted === false ? "OBSERVED no" : "not observed"}`);
      if (o.overlayDrawn === false || o.figurePrinted === true) return { verdict: "FAIL", basis: parts.join("; ") };
      if (o.mcpEnvelopeGeomVertices != null && o.mcpEnvelopeGeomVertices !== n) return { verdict: "FAIL", basis: parts.join("; ") + " -- two implementations" };
      if (o.overlayDrawn !== true || o.mcpEnvelopeGeomVertices == null || o.figurePrinted !== false) return { verdict: "UNMEASURED", basis: parts.join("; ") };
      return { verdict: "PASS", basis: parts.join("; ") };
    },
  },
  "P-152": {
    title: "one reader: panel and MCP agree on setbacks, source and vintage",
    parcels: ["48021:34049", "48021:33223", "48453:367134", "48453:113408", "48453:474034"],
    evaluate(id, legs, obs) {
      const fx = legs.facets;
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      const m = obs?.[id]?.mcpSetbacks ?? null;
      const basis = `panel ${fmtSb(fx.setbacks)} (readPath ${fx.readPath}, bakedAt ${fx.bakedAt}); MCP ${m ? fmtSb(m) + " OBSERVED" : "not observed"}`;
      if (!m) return { verdict: "UNMEASURED", basis };
      if (!fx.setbacks && !m.front && !m.side && !m.rear) return { verdict: "PASS", basis: basis + " -- both absent" };
      return sameSetbacks(fx.setbacks, m) ? { verdict: "PASS", basis } : { verdict: "FAIL", basis: basis + " -- DISAGREE" };
    },
  },
};

// --------------------------------------------------------------------------- live run
async function runLegs(parcel, opts) {
  const legs = {};
  const propId = parcel.id.split(":")[1];
  legs.facets = extractFacets(await call("GET", `${PE_BASE}/api/spine/property-atoms/${encodeURIComponent(parcel.id)}/facets`, null, LEG_TIMEOUT_MS.facets));
  const addr = legs.facets.composedAddress;
  legs.envelopeByAddress = addr
    ? extractEnvelope(await call("POST", `${CORTEX_PROXY}/brokerage/v1/place/buildable-envelope`, { address: addr }, LEG_TIMEOUT_MS.envelopeByAddress))
    : { measured: false, error: "no situs on the record; address leg not attempted" };
  const pt = legs.facets.recordPoint;
  legs.envelopeByPoint = pt
    ? extractEnvelope(await call("POST", `${CORTEX_PROXY}/brokerage/v1/place/buildable-envelope`, { lat: pt.lat, lng: pt.lng }, LEG_TIMEOUT_MS.envelopeByPoint))
    : { measured: false, error: "no record point; point leg not attempted" };
  legs.gisRing = pt
    ? extractGisRing(await call("POST", `${CORTEX_PROXY}/brokerage/v1/map-data/gis-layer`, { layer: "parcels", bbox: bboxAround(pt, RING_PROBE_METRES) }, LEG_TIMEOUT_MS.gisRing), propId, pt)
    : { measured: false, error: "no record point; ring leg not attempted" };
  if (opts.cortex) {
    const r = await call("GET", `${opts.cortex.base}/api/brokerage/v1/place/node/${encodeURIComponent(parcel.id)}`, null, LEG_TIMEOUT_MS.cortexNode, { [opts.cortex.header]: opts.cortex.key });
    legs.cortexNode = { measured: !!r.json, http: r.http, ms: r.ms, error: r.error ?? r.text ?? null, keys: r.json ? Object.keys(r.json).slice(0, 12) : null };
  } else {
    legs.cortexNode = { measured: false, error: "REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed" };
  }
  return legs;
}

function loadObservations(path) {
  if (!path) return { obs: null, sha256: null };
  const raw = readFileSync(path, "utf8");
  return { obs: JSON.parse(raw), sha256: createHash("sha256").update(raw).digest("hex") };
}

function docRepoHead() {
  try { return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); } catch { return "UNKNOWN"; }
}

function evaluateRows(legsById, obs, rowFilter) {
  const results = [];
  for (const [row, def] of Object.entries(ROWS)) {
    if (rowFilter && !rowFilter.includes(row)) continue;
    for (const id of def.parcels) {
      const legs = legsById[id];
      const r = legs ? def.evaluate(id, legs, obs) : { verdict: "UNMEASURED", basis: "parcel not in this run" };
      results.push({ row, title: def.title, parcel: id, ...r });
    }
  }
  return results;
}

/**
 * Cross-cutting findings that are not any one row's predicate but must never pass silently:
 * an endpoint answering for a DIFFERENT parcel than the record asked about is the wrong-parcel
 * class (address-primary landing on another lot, here across a county line on 2026-09-11).
 */
export function findings(legsById) {
  const out = [];
  for (const [id, legs] of Object.entries(legsById)) {
    for (const leg of ["envelopeByAddress", "envelopeByPoint"]) {
      const l = legs[leg];
      if (l?.measured && l.parcelNodeId && l.parcelNodeId !== id) {
        out.push({ kind: "WRONG-PARCEL", parcel: id, leg, answeredFor: l.parcelNodeId, status: l.status, detail: `endpoint answered ${l.status} for ${l.parcelNodeId} when asked about ${id}; any consumer that does not compare node ids will serve another lot` });
      }
    }
    if (legs.gisRing?.measured && legs.gisRing.noContainingPolygon) {
      const n = legs.gisRing.nearest;
      out.push({ kind: "NO-CONTAINING-POLYGON", parcel: id, leg: "gisRing", provider: legs.gisRing.provider, nearest: n, detail: `the live parcel layer (${legs.gisRing.provider}) returned ${legs.gisRing.featureCount} features around the record point and none contains it; nearest ${n ? `${n.id} ${n.situs ?? ""} at ${n.metres} m` : "none"}. Either the layer has a hole at this parcel or the record point is wrong; the probe does not choose` });
    }
    if (legs.gisRing?.measured && legs.gisRing.idSchemeMismatch) {
      out.push({ kind: "ID-SCHEME-MISMATCH", parcel: id, leg: "gisRing", provider: legs.gisRing.provider, containingFeatureId: legs.gisRing.containingFeatureId, detail: `the live parcel layer (${legs.gisRing.provider}) contains the record point in feature ${legs.gisRing.containingFeatureId} but no feature carries prop_id ${id.split(":")[1]}; two id schemes for one parcel (P-161)` });
    }
    if (legs.facets?.measured && legs.facets.buildableAreaSqFtInPayload != null) {
      out.push({ kind: "FIGURE-IN-PAYLOAD", parcel: id, leg: "facets", value: legs.facets.buildableAreaSqFtInPayload, detail: "buildableAreaSqFt travels in the panel payload; the figure is refused by ruling and must not be printed by any surface (P-153 observation figurePrinted)" });
    }
  }
  return out;
}

function printReport(results, legsById) {
  console.log("\nLEGS (measured live unless marked)");
  for (const [id, legs] of Object.entries(legsById)) {
    const f = legs.facets;
    console.log(`  ${id}`);
    console.log(`    facets       ${f.measured ? `http ${f.http} readPath ${f.readPath} bakedAt ${f.bakedAt} zoning ${f.zoningDistrict ?? "-"} envelope ${f.envelopeStatus ?? "-"} setbacks ${fmtSb(f.setbacks)} city ${f.cityLimitsStatus ?? "-"} point ${f.recordPoint ? "yes" : "no"}` : `NOT MEASURED ${f.error}`}`);
    const a = legs.envelopeByAddress;
    console.log(`    env/address  ${a.measured ? `http ${a.http} status ${a.status} node ${a.parcelNodeId ?? "-"} setbacks ${fmtSb(a.setbacks)} vertices ${a.vertexCount ?? "-"} ${a.ms} ms` : `NOT MEASURED ${a.error ?? "http " + a.http}`}`);
    const p = legs.envelopeByPoint;
    console.log(`    env/point    ${p.measured ? `http ${p.http} status ${p.status} node ${p.parcelNodeId ?? "-"} ${p.ms} ms` : `NOT MEASURED http ${p.http ?? "-"} ${p.error ?? ""}`}`);
    const g = legs.gisRing;
    console.log(`    gis ring     ${g.measured ? `http ${g.http} features ${g.featureCount} matches ${g.matchesParcel}${g.matchedBy ? " by " + g.matchedBy : ""}${g.idSchemeMismatch ? " ID-SCHEME-MISMATCH (" + g.containingFeatureId + ")" : ""}${g.noContainingPolygon ? " NO-CONTAINING-POLYGON (nearest " + (g.nearest ? g.nearest.id + " " + g.nearest.metres + " m" : "none") + ")" : ""}` : `NOT MEASURED ${g.error ?? ""}`}`);
    const c = legs.cortexNode;
    console.log(`    cortex node  ${c.measured ? `http ${c.http} keys ${c.keys?.join(",")}` : `NOT MEASURED ${c.error ?? ""}`}`);
  }
  const fnd = findings(legsById);
  if (fnd.length) {
    console.log("\nFINDINGS (not a row predicate; never silent)");
    for (const f of fnd) console.log(`  ${f.kind.padEnd(18)} ${f.parcel}  ${f.detail}`);
  }
  console.log("\nPREDICATES");
  for (const r of results) console.log(`  ${r.verdict.padEnd(10)} ${r.row} ${r.parcel}  ${r.basis}`);
  const tally = results.reduce((t, r) => ((t[r.verdict] = (t[r.verdict] ?? 0) + 1), t), {});
  console.log(`\n  PASS ${tally.PASS ?? 0}  FAIL ${tally.FAIL ?? 0}  UNMEASURED ${tally.UNMEASURED ?? 0}`);
  return tally;
}

// --------------------------------------------------------------------------- fixtures
function loadFixtureLegs() {
  const manifest = JSON.parse(readFileSync(join(FIXTURE_DIR, "MANIFEST.json"), "utf8"));
  const read = (name) => (name ? { http: manifest.files[name].http, ms: manifest.files[name].ms ?? null, json: JSON.parse(readFileSync(join(FIXTURE_DIR, name), "utf8")) } : null);
  const legsById = {};
  for (const [id, f] of Object.entries(manifest.parcels)) {
    const facets = f.facets ? extractFacets(read(f.facets)) : { measured: false, error: "no fixture" };
    legsById[id] = {
      facets,
      envelopeByAddress: f.envelopeByAddress ? extractEnvelope(read(f.envelopeByAddress)) : { measured: false, error: "no fixture" },
      envelopeByPoint: f.envelopeByPoint ? extractEnvelope(read(f.envelopeByPoint)) : { measured: false, error: "no fixture" },
      gisRing: f.gisRing ? extractGisRing(read(f.gisRing), id.split(":")[1], facets.recordPoint) : { measured: false, error: "no fixture" },
      cortexNode: { measured: false, error: "fixtures carry no cortex leg" },
    };
  }
  return { manifest, legsById };
}

function selfTest() {
  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); if (!ok) failures++; };
  console.log("surface-probe self-test");
  const { manifest, legsById } = loadFixtureLegs();
  const obs = manifest.observations ?? {};

  // Known-bad, 2026-09-11: 113408 point route 504 and card unplaceable -> P-151 must FAIL.
  const r151 = ROWS["P-151"].evaluate("48453:113408", legsById["48453:113408"], obs);
  check("P-151 fails on the 2026-09-11 state of 48453:113408", r151.verdict === "FAIL", r151.basis);

  // Known-good precondition: 34049 endpoint returns a 6-vertex polygon.
  const e = legsById["48021:34049"].envelopeByAddress;
  check("34049 envelope fixture yields a polygon with 6 vertices and 30/10/30/20", e.vertexCount === 6 && e.setbacks?.front === 30 && e.setbacks?.corner === 20, `vertices ${e.vertexCount} setbacks ${fmtSb(e.setbacks)}`);

  // P-153 on 2026-09-11: polygon exists, overlay observed NOT drawn, MCP observed refused -> FAIL.
  const r153 = ROWS["P-153"].evaluate("48021:34049", legsById["48021:34049"], obs);
  check("P-153 fails on the 2026-09-11 state of 48021:34049 (overlay not drawn)", r153.verdict === "FAIL", r153.basis);

  // P-152 on 2026-09-11: panel 25/5/25/15 vs MCP 30/10/30/20 -> FAIL (the five-producer finding).
  const r152 = ROWS["P-152"].evaluate("48021:34049", legsById["48021:34049"], obs);
  check("P-152 flags the panel/MCP setback disagreement on 48021:34049", r152.verdict === "FAIL", r152.basis);

  // Not vacuous: an empty/malformed world must never PASS anything.
  const empty = { facets: extractFacets({ http: 200, json: {} }), envelopeByAddress: extractEnvelope({ http: 200, json: {} }), envelopeByPoint: extractEnvelope({ http: 200, json: {} }), gisRing: extractGisRing({ http: 200, json: {} }, "0"), cortexNode: { measured: false } };
  for (const [row, def] of Object.entries(ROWS)) {
    for (const id of def.parcels) {
      const r = def.evaluate(id, empty, {});
      check(`${row} ${id} does not PASS on an empty payload`, r.verdict !== "PASS", r.verdict);
    }
  }
  // Not vacuous, the other direction: a fully good world must PASS (so the predicate can succeed).
  const good = {
    facets: { measured: true, http: 200, readPath: "record", bakedAt: "x", recordPoint: { lat: 1, lng: 1 }, setbacks: { front: 30, side: 10, rear: 30, corner: 20 } },
    envelopeByAddress: { measured: true, http: 200, status: "ok", vertexCount: 6, setbacks: { front: 30, side: 10, rear: 30, corner: 20 } },
    envelopeByPoint: { measured: true, http: 200, status: "ok", ms: 900 },
    gisRing: { measured: true, http: 200, featureCount: 3, matchesParcel: true },
    cortexNode: { measured: false },
  };
  const goodObs = { "48021:34049": { overlayDrawn: true, mcpEnvelopeGeomVertices: 6, figurePrinted: false, mcpSetbacks: { front: 30, side: 10, rear: 30, corner: 20 } }, "48453:113408": { sheetSealed: true } };
  check("P-151 can PASS on a good world", ROWS["P-151"].evaluate("48453:113408", good, goodObs).verdict === "PASS");
  check("P-153 can PASS on a good world", ROWS["P-153"].evaluate("48021:34049", good, goodObs).verdict === "PASS");
  check("P-152 can PASS on a good world", ROWS["P-152"].evaluate("48021:34049", good, goodObs).verdict === "PASS");
  check("P-153 FAILS when MCP and map polygons differ (two implementations)", ROWS["P-153"].evaluate("48021:34049", good, { "48021:34049": { ...goodObs["48021:34049"], mcpEnvelopeGeomVertices: 5 } }).verdict === "FAIL");
  check("P-153 FAILS when any surface prints the figure", ROWS["P-153"].evaluate("48021:34049", good, { "48021:34049": { ...goodObs["48021:34049"], figurePrinted: true } }).verdict === "FAIL");

  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

// --------------------------------------------------------------------------- main
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

if (flag("--self-test")) {
  process.exit(selfTest() === 0 ? 0 : 1);
}

const rowFilter = val("--rows") ? val("--rows").split(",").map((s) => s.trim()) : null;
const { obs, sha256 } = loadObservations(val("--observations"));
const cortex = process.env.CORTEX_API_BASE && process.env.CORTEX_SERVICE_API_KEY && process.env.CORTEX_API_KEY_HEADER
  ? { base: process.env.CORTEX_API_BASE.replace(/\/$/, ""), key: process.env.CORTEX_SERVICE_API_KEY, header: process.env.CORTEX_API_KEY_HEADER }
  : null;

const ranAt = new Date().toISOString();
let legsById;
let source;
if (flag("--fixtures")) {
  const fx = loadFixtureLegs();
  legsById = fx.legsById;
  source = `fixtures captured ${fx.manifest.capturedAt}`;
} else {
  legsById = {};
  const wanted = rowFilter ? new Set(rowFilter.flatMap((r) => ROWS[r]?.parcels ?? [])) : null;
  for (const p of PARCELS) {
    if (wanted && !wanted.has(p.id)) continue;
    process.stdout.write(`probing ${p.id} ... `);
    legsById[p.id] = await runLegs(p, { cortex });
    console.log("done");
  }
  source = "live";
}

const results = evaluateRows(legsById, obs ?? (flag("--fixtures") ? loadFixtureLegs().manifest.observations : null), rowFilter);
console.log(`\nSURFACE PROBE  ${ranAt}  doc_repo ${docRepoHead()}  source ${source}  PE ${PE_BASE}  observations ${sha256 ? "sha256 " + sha256.slice(0, 12) : "none"}`);
const tally = printReport(results, legsById);

const artifactDir = join(ROOT, "_inbox");
if (!existsSync(artifactDir)) mkdirSync(artifactDir);
const stamp = ranAt.slice(0, 10) + "_" + ranAt.slice(11, 19).replace(/:/g, "");
const outPath = val("--out") ?? join(artifactDir, `${stamp}_surface_probe.json`);
writeFileSync(outPath, JSON.stringify({ instrument: "scripts/surface-probe.mjs", ranAt, docRepoHead: docRepoHead(), source, peBase: PE_BASE, observationsSha256: sha256, rows: rowFilter, legs: legsById, findings: findings(legsById), results, tally }, null, 2));
console.log(`\nartifact: ${outPath.replace(/\\/g, "/")}`);

if (tally.FAIL) process.exit(1);
if (tally.UNMEASURED && !flag("--allow-unmeasured")) {
  console.log("exit 2: unmeasured predicates present; pass --allow-unmeasured to accept an artifact that does not decide them");
  process.exit(2);
}
process.exit(0);
