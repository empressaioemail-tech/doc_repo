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
 *                           refuses a P-151..P-167 close without a cited passing artifact is
 *                           .claude/hooks/probe-close-gate.mjs (rules and self-test in
 *                           scripts/enforcement/probe-close-gate.mjs; registered 2026-09-11,
 *                           verified by direct invocation, live firing through the harness
 *                           owed the next session and said so in the P-160 close).
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
 *
 * The P-241 row needs P241_LDT_ROOT, the legacy-design-tools checkout that carries the ETJ
 * acquisition path, and it names the tree it used in the artifact. It defaults to the lane's own
 * worktree, which is right before the merge and wrong after it: once the ETJ path is on main,
 * point it at an ordinary checkout. A missing checkout is a REFUSAL, never a pass on another tree.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { execFileSync, execSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "surface-probe");
const PE_BASE = process.env.SURFACE_PROBE_PE_BASE || "https://smartsite.cloud";
const CORTEX_PROXY = `${PE_BASE}/api/spine/cortex/api`;

/** Metres around the record point for the ring probe; mirrors the resolver's own constant. */
const RING_PROBE_METRES = 150;
const LEG_TIMEOUT_MS = { facets: 30_000, envelopeByAddress: 30_000, envelopeByPoint: 12_000, gisRing: 30_000, cortexNode: 30_000, etjInstrument: 900_000 };
/** P-241: the ETJ instrument acquires every registered publisher live, so it is given real room. */
const ETJ_TIMEOUT_MS = LEG_TIMEOUT_MS.etjInstrument;

// --------------------------------------------------------------------------- the parcel set
// OPS-23 §7. A lane may add one; it may not remove one. The four other-county parcels are
// chosen by this row's lane from parcel_record and appended here with the query that chose them.
export const PARCELS = [
  { id: "48021:34049", fips: "48021", label: "1109 Pecan St, Bastrop; corner lot, improved 1906; five-way setback disagreement" },
  { id: "48021:33223", fips: "48021", label: "P-91 gold parcel; MCP refuse baseline" },
  { id: "48453:113408", fips: "48453", label: "414 Spiller Ln, West Lake Hills; split situs; unplaceable card on 2026-09-11" },
  { id: "48453:474034", fips: "48453", label: "2601 Sterling Panorama Ct; unincorporated, Lake Pointe MUD; feasibility 154 s" },
  { id: "48453:367134", fips: "48453", label: "5833 Taylor Draper Cv, Austin SF-2; declared-complete city" },
  { id: "48021:8723767", fips: "48021", label: "P-214: 7-digit split-node half of 1009 Pecan St, Bastrop; bare 'TX' situs sentinel; customer saw a raw hauska-engine R32 mechanical-verify diagnostic under More facts" },
  { id: "48209:97650", fips: "48209", label: "P-218: 613 Sturgeon Dr, San Marcos; real situs; adjacent to the 97651/97652 selection-leak pair" },
  { id: "48209:97651", fips: "48209", label: "P-218: STURGEON DR, San Marcos; sentinel situs (street name, no house number); the id the panel wrongly rendered" },
  { id: "48209:97652", fips: "48209", label: "P-218: STURGEON DR, San Marcos; sentinel situs (street name, no house number); the id the customer actually searched" },
  { id: "48209:97658", fips: "48209", label: "P-218: 629 Sturgeon Dr, San Marcos; real situs; adjacent to the 97651/97652 selection-leak pair" },
];

// P-175 (Hays online): address-keyed subjects. A customer reaches a parcel through the Find box, so the
// predicate starts from the address, not from a node id the fix is expected to change. Points are the
// CAPCOG address points in txgio_address (production, read 2026-09-12); each falls inside exactly the
// TxGIO parcel named beside it by ST_Contains. These legs run only when --rows names P-175.
export const ADDRESSES = [
  { key: "48209:addr:615-sturgeon", fips: "48209", address: "615 STURGEON DR, SAN MARCOS, TX 78666", houseNumber: "615", street: "STURGEON", ids: ["84632", "97651", "11-2011-0001-00400-3"], point: { lat: 29.87113, lng: -97.92674 }, label: "Conway Addition Sec IV blk 1 lot 4; CAD 84632 / R97651 / TxGIO 97651; vacant, no house number on the roll" },
  { key: "48209:addr:617-sturgeon", fips: "48209", address: "617 STURGEON DR, SAN MARCOS, TX 78666", houseNumber: "617", street: "STURGEON", ids: ["84633", "97652", "11-2011-0001-00500-3"], point: { lat: 29.87124, lng: -97.92662 }, label: "lot 5; CAD 84633 / R97652 / TxGIO 97652; vacant" },
  { key: "48209:addr:619-sturgeon", fips: "48209", address: "619 STURGEON DR, SAN MARCOS, TX 78666", houseNumber: "619", street: "STURGEON", ids: ["84634", "97653", "11-2011-0001-00600-3"], point: { lat: 29.87135, lng: -97.92649 }, label: "lot 6; CAD 84634 / R97653 / TxGIO 97653; vacant" },
  { key: "48209:addr:627-sturgeon", fips: "48209", address: "627 STURGEON DR, SAN MARCOS, TX 78666", houseNumber: "627", street: "STURGEON", ids: ["84638", "97657", "11-2011-0001-01000-3"], point: { lat: 29.87177, lng: -97.92600 }, label: "lot 10; CAD 84638 / R97657 / TxGIO 97657; vacant" },
  { key: "48209:addr:629-sturgeon", fips: "48209", address: "629 STURGEON DR, SAN MARCOS, TX 78666", houseNumber: "629", street: "STURGEON", ids: ["84639", "97658", "11-2011-0001-01100-3"], point: { lat: 29.87188, lng: -97.92588 }, label: "lot 11; CAD 84639 / R97658 / TxGIO 97658; resolves today to node 48209:97658, a chimera carrying CAD account 97658's label (13669 Mesa Verde Dr) on the Sturgeon polygon" },
];

// P-241 (ETJ acquisition). The ETJ path has NO served surface yet, and by this mission's own
// scope it is not supposed to: the consumer hardcode sites in hauska-engine and hauska-map are
// explicit follow-on work, so no route reads tx_etj_boundary today. A row that measured the card
// would measure something this lane did not change. So P-241's rows measure what the lane DID
// change — the acquisition path, live — through the lane's own instrument
// (lib/cad-ingest/src/boundary/etjCli.ts --verify --json), which runs the real register, the real
// ArcGIS client, the real parser and the real resolver against the real publishers. The leg
// REFUSES rather than passes when the instrument cannot run, like every other leg here.
// The subjects are the mission's four pre-registered falsifiers, and each one is a real address
// or a real city hall, never a synthetic point:
//   1. a Travis parcel whose only Austin jurisdiction label is an ETJ ring  -> present
//   2. a house inside Austin city limits, on the same combined layer        -> absent
//   3. Round Rock City Hall, a city-limits-only publisher                   -> unresolved
//   4. Houston City Hall, outside the register entirely                     -> unresolved
export const ETJ_SUBJECTS = [
  {
    key: "P-241:austin-2mile-etj",
    controlPointKey: "austin-2mile-etj",
    parcelNodeId: "48453:134392",
    situs: "3128 EDGEWATER DR, Travis County (unincorporated, inside Austin's 2-mile ETJ)",
    expect: "present",
    expectCityKey: "austin-tx",
    mustContain: ["tx_etj_boundary etj_id=austin-tx"],
  },
  {
    key: "P-241:austin-city-limits",
    controlPointKey: "austin-city-limits",
    parcelNodeId: "48453:367134",
    situs: "5833 TAYLOR DRAPER CV, Austin (inside city limits)",
    expect: "absent",
    expectCityKey: null,
    mustContain: ["verified absent"],
  },
  {
    key: "P-241:round-rock-city-limits-only",
    controlPointKey: "round-rock-city-limits-only",
    parcelNodeId: null,
    situs: "221 E MAIN ST, Round Rock (City Hall)",
    expect: "unresolved",
    expectCityKey: null,
    mustContain: ["mode=city_limits_only", "not a confirmed absence of ETJ"],
  },
  {
    key: "P-241:houston-outside-register",
    controlPointKey: "houston-outside-register",
    parcelNodeId: null,
    situs: "901 BAGBY ST, Houston (City Hall)",
    expect: "unresolved",
    expectCityKey: null,
    mustContain: ["not in the ETJ register"],
  },
];

// ------------------------------------------------------------------ OPS-24 customer leg (P-254)
// P-254 is the CUSTOMER LEG of the OPS-24 Phase 0 exit (program scope rev 4, section 5, leg 2):
// every fixture bucket in L-E's list graded on the map, the MCP and the PDF, including the buckets
// that were ungraded, with every envelope fixture carrying `status`, `declineReason`,
// `envelopeCovered`, geometry presence and figure presence.
//
// The list is L-E's read-only selection over `parcel_record_cell`
// (`_inbox/2026-09-16_scaleup-le_fixture_list.json`, sha256 in OPS24_FIXTURE_LIST_SHA256). It is
// COMMITTED beside this instrument as `scripts/fixtures/surface-probe/ops24-fixture-list.json` so
// the Phase 0 exit does not depend on an inbox file that gets archived, and the artifact records
// the sha256 it actually read. The self-test fails if the committed copy's bucket count drifts.
//
// THE DENOMINATOR IS PART OF THE CONTRACT (DEV_PROCESS: coverage figures travel with their
// denominator). The list as read holds 45 buckets and 100 distinct fixture ids; the plan's prose
// says 39. This instrument does NOT quietly agree with 39. It reports the count it read, the
// selection rule it used, the slots it graded and the slots it did not, each with its reason. The
// 39-versus-45 divergence is a finding for the close, not something to paper over.
export const OPS24_FIXTURE_LIST = "scripts/fixtures/surface-probe/ops24-fixture-list.json";
export const OPS24_FIXTURE_LIST_SHA256 = "bb5d38861d6a8875e6315d65bc2cbdded61189f50573914b118cb1f7ddc45e32";
/** Buckets the committed list holds. The plan's prose says 39; read 45, keep 45, say so. */
export const OPS24_BUCKET_COUNT = 45;

// The one fixture each bucket is graded on when it offers several. Deterministic and stated so the
// artifact's denominator is reproducible by a peer: codified first (a bucket with a codified
// district is gradeable against the card spec end to end), then the planned-development class
// (A-184's PUD message), then the two absence kinds, then vacancy, then the supplemental `fx_any`.
// `--ops24-all` grades every slot instead, and the artifact records which rule ran.
export const OPS24_CATEGORY_PRIORITY = ["fx_codified", "fx_pud", "fx_district_miss", "fx_no_table", "fx_vacant", "fx_any"];

// The engine-api base for the PDF leg. Named here, never guessed from a response header.
export const ENGINE_BASE = process.env.SURFACE_PROBE_ENGINE_BASE || "https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app";
// The Smart Site MCP. Its inbound gate is OAuth and a service Bearer is not an OAuth token
// (MEASURED 2026-09-17: `missing_bearer` with none, `invalid_oauth_token` with the fleet engine
// key), so the MCP leg runs live only when SURFACE_PROBE_MCP_TOKEN holds an OAuth token and
// otherwise enters through --observations as OBSERVED, or REFUSES. See runMcpLeg.
export const MCP_BASE = process.env.SURFACE_PROBE_MCP_BASE || "https://smartsite-mcp-tds7av26va-uc.a.run.app";

// P-303's subjects, from the dispatch and `_inbox/2026-09-17_p303-live-grade.txt`. Waco's panel
// must draw an envelope its own endpoint can draw and must print NO area figure; a class member
// with no district must still decline rather than have a district invented for it.
export const P303_SUBJECTS = [
  { id: "48309:103015", role: "waco-draws-no-figure", label: "8459 Rock Creek Rd, Waco; the panel declined an envelope its own endpoint draws (XD-2), graded live 2026-09-17 15:49Z as ok/envelope-unverified/figureWithheld" },
  { id: "48021:10001", role: "no-district-declines", label: "296 Country Ln, Mcdade (Bastrop county, no district on record); the class member that must still decline" },
  { id: "48021:10002", role: "no-district-declines", label: "the same class, second member (P-303's own grade list)" },
  { id: "48021:10003", role: "no-district-declines", label: "the same class, third member (P-303's own grade list)" },
];

// P-304's paired subjects, from `_inbox/2026-09-17_p304-area-figure_live-probe.md`. The SAME
// anonymous request against two parcels must DIVERGE: the unverified parcel withholds the area
// keys, the verified control keeps them. Fail-closed: both withholding is a blanket strip, not the
// entitlement, and it has taken the entitled figure away from a verified parcel (falsifier 2).
export const P304_SUBJECTS = [
  { id: "48209:97658", role: "unverified-must-withhold", label: "629 Sturgeon Dr, San Marcos; derivePath carries no +atom-reconciled", expectWithheld: true, expectSqFt: null, expectPct: null },
  { id: "48021:34049", role: "verified-control-must-keep", label: "1109 Pecan St, Bastrop; derivePath ends +atom-reconciled", expectWithheld: false, expectSqFt: 19052, expectPct: 63.5 },
];

// P-347: the COVERAGE leg of the Phase 0 exit (P-205, P-210), graded at the customer's surfaces.
// Coverage means the serving path (P-210's ruling). A coverage refusal fires only when the search
// finds nothing, so each subject is an address that genuinely does not exist in a real locality:
// the search must then say WHICH answer it is (covered-and-no-match `no-hit`, a named uncovered
// county, or out of state) instead of an empty list the customer cannot tell apart. The retrieval
// endpoint is the derived covered set; the Find box and the MCP's find_parcel are what a customer
// reads. Expectations are the live endpoint's own answers read 2026-09-18 13:08Z.
export const COVERAGE_SUBJECTS = [
  { key: "coverage:austin", query: "99999 ZZYZX RD, AUSTIN, TX 78701", city: "Austin", state: "TX", zip: "78701", endpoint: "covered", search: "no-hit", countyFips: null },
  { key: "coverage:cameron", query: "99999 ZZYZX RD, CAMERON, TX 76520", city: "Cameron", state: "TX", zip: "76520", endpoint: "not-covered", search: "county_out_of_coverage", countyFips: "48331" },
  { key: "coverage:marble-falls", query: "99999 ZZYZX RD, MARBLE FALLS, TX 78654", city: "Marble Falls", state: "TX", zip: "78654", endpoint: "not-covered", search: "county_out_of_coverage", countyFips: "48053" },
  { key: "coverage:denver", query: "1600 BROADWAY, DENVER, CO 80202", city: "Denver", state: "CO", zip: "80202", endpoint: null, search: "out_of_coverage", countyFips: null },
];
export const RETRIEVAL_BASE = process.env.SURFACE_PROBE_RETRIEVAL_BASE || "https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app";

// The required case measured by the integration seat on 2026-09-17 and handed to this lane:
// Travis `48453:367134` (5833 Taylor Draper Cv, SF-2, Austin). Its own read carries a RULED setback
// table (front 25, side 5, rear 10, corner 15), and a surface nevertheless tells the customer the
// setbacks are "unruled" / the envelope atom path is pending. Build a check that fails when a
// surface says "unruled" or `atom_path_pending` for a parcel whose own read carries a ruled table,
// and report the population it finds across the fixtures.
export const UNRULED_SUBJECT = "48453:367134";
/** The phrase classes that make a contradiction are RULE_REFUSAL_PHRASES and
 *  GEOMETRY_REFUSAL_PHRASES, declared beside `contradictions` with the guard each one needs. */
// The phrases that mean "setbacks are not ruled", as distinct from a geometry-only withhold. The
// panel's own disclosure for this parcel says "depth-warm geometry withheld", which withholds the
// POLYGON while the table stays ruled; that is honest and is not this defect. Only a statement
// about the setback RULE counts.
export const RULED_TABLE_MIN_AXES = 3;

// The open customer-visible defect list the Phase 0 exit reads (program scope section 4.5b's X list
// and section 2's XD list, renamed XD-1..XD-16). Each entry names the fixture it is graded on and
// the row that owns it. `gradedBy` is the name of the grader in this file; a defect with no grader
// is reported UNMEASURED with that stated, never silently counted open or closed. XD-15 and XD-16
// are the L-E lane's positive control and leave-behind, not defects.
export const OPS24_DEFECTS = [
  { id: "XD-1", defect: "buildable-area figure in payloads and disclosure strings", row: "P-249 (map and MCP), P-261 (PDF)", gradedBy: "figureLeak" },
  { id: "XD-2", defect: "Waco's panel declines what its own endpoint draws", row: "P-249", gradedBy: "p303PanelDraws" },
  { id: "XD-3", defect: "site plan asserts a miss that did not happen", row: "P-222", gradedBy: null },
  { id: "XD-4", defect: "Bastrop \"layer-23\" wording on other parcels", row: "P-257", gradedBy: "foreignDeclineWording" },
  { id: "XD-5", defect: "no-table cities decline while the payload holds the district", row: "P-257", gradedBy: "noTableDeclineNamesDistrict" },
  { id: "XD-6", defect: "Williamson: no MCP baked snapshot", row: "P-271", gradedBy: null },
  { id: "XD-7", defect: "Williamson: no composed address on the map payload", row: "P-271", gradedBy: "composedAddressAbsent" },
  { id: "XD-8", defect: "the card does not name the governing city", row: "P-270", gradedBy: "jurisdictionNamed" },
  { id: "XD-9", defect: "malformed situs breaks envelope drawing", row: "P-272", gradedBy: "malformedSitusDraws" },
  { id: "XD-10", defect: "land-use contradiction within one payload", row: "P-217", gradedBy: null },
  { id: "XD-11", defect: "setback citation served undated AND undeclared (P-270: an unreadable vintage is a conflict row, never a silent pick; a DECLARED undated citation is no longer this defect and is counted separately as `XD-11-declared`)", row: "P-270", gradedBy: "citationDatePresent" },
  { id: "XD-12", defect: "salesHistory absent from the MCP schema", row: "P-209", gradedBy: null },
  { id: "XD-13", defect: "dollar value reaches an ungranted caller", row: "P-246 (done)", gradedBy: "dollarReachesAnonymous" },
  { id: "XD-14", defect: "\"PUD\"-coded districts resolve Euclidean setbacks", row: "P-257, after the operator's ruling", gradedBy: "pudReadsPudMessage" },
  { id: "X2", defect: "the card names the governing city (map and LDT)", row: "P-270", gradedBy: "jurisdictionNamed" },
  { id: "X4", defect: "parcel-specific decline wording everywhere", row: "P-257", gradedBy: "foreignDeclineWording" },
  { id: "X5", defect: "Waco's panel declines an envelope its own live endpoint can draw", row: "hauska-map", gradedBy: "p303PanelDraws" },
  { id: "X6", defect: "Williamson: no MCP baked snapshot and no composed map address", row: "P-271", gradedBy: "composedAddressAbsent" },
  { id: "X7", defect: "salesHistory absent from the MCP schema rather than declared Unavailable", row: "LDT smartsite-mcp", gradedBy: null },
  { id: "X8", defect: "no-table cities decline with \"no zoning district observed\" while the payload holds the district", row: "hauska-map", gradedBy: "noTableDeclineNamesDistrict" },
  { id: "X9", defect: "a malformed situs (\", ,\") breaks envelope drawing", row: "hauska-map, LDT", gradedBy: "malformedSitusDraws" },
  { id: "X10", defect: "\"PUD\"-coded districts get the PUD message", row: "LDT, hauska-map", gradedBy: "pudReadsPudMessage" },
  { id: "X11", defect: "setback citation served undated AND undeclared on Pflugerville (P-270; LDT's copy of XD-11)", row: "LDT", gradedBy: "citationDatePresent" },
];

// --------------------------------------------------------------------------- small helpers
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const rec = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);
/**
 * The first date in customer-facing prose, for XD-11 (a citation's effective date). The panel
 * serves dates inside the disclosure SENTENCE ("parcel_record setback rule effective 2026-04-14"),
 * not in a field, so a grader that only reads fields would call a dated citation undated. Returns
 * the matched text, or null when the prose carries no date at all.
 */
const firstDateIn = (texts) => {
  for (const t of texts ?? []) {
    if (!t) continue;
    const s = String(t);
    const m = s.match(/\b(20\d{2}-\d{2}-\d{2})\b/) ?? s.match(/\b(\d{1,2}\/\d{1,2}\/20\d{2})\b/) ?? s.match(/\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*20\d{2})\b/);
    if (m) return m[1];
  }
  return null;
};

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
    // `str()` collapses a DECLARED absence (the inline `{status:"absent", verdict:"absent-verified",
    // authority, scopeSearched}` object the card spec's honest-refusal rule requires) into the same
    // null as a bare, undeclared one. Keep the distinction: an absence must carry its basis, and a
    // payload that declares one address component absent while silently nulling its sibling is a
    // different fact from a payload that declares both. Measured 2026-09-17 on 48021:51735:
    // situsCity is a full absent-verified object, situsAddress is plain null.
    situsAddressAbsenceDeclared: !!(rec(base.situsAddress) && (base.situsAddress.status || base.situsAddress.verdict)),
    situsCityAbsenceDeclared: !!(rec(base.situsCity) && (base.situsCity.status || base.situsCity.verdict)),
    situsCityAbsenceVerdict: str(rec(base.situsCity)?.verdict ?? rec(base.situsCity)?.status),
    composedAddress: composeAddress(base),
    zoningDistrict: str(rec(f.zoning)?.district),
    envelopeStatus: str(env?.status),
    envelopeDisclosure: str(env?.disclosure),
    /** The panel's own customer-facing sentence. `summary` is where the panel's "depth-warm
     *  geometry withheld" wording lives (P-249), and it is a surface string like any other. */
    envelopeMessage: str(env?.message ?? env?.reason),
    envelopeSummary: str(env?.summary),
    envelopeGeojsonPresent: !!env?.geojson,
    buildableAreaSqFtInPayload: num(env?.buildableAreaSqFt),
    setbacks: sb ? { front: num(sb.front_ft), side: num(sb.side_ft), rear: num(sb.rear_ft), corner: num(sb.side_corner_ft) } : null,
    cityLimitsStatus: str(cl?.status),
    recordPoint: qp && num(qp.latitude) != null && num(qp.longitude) != null ? { lat: qp.latitude, lng: qp.longitude } : null,
    structuralState: str(rec(j.structuralFact)?.status ?? rec(j.structuralFact)?.state),
    // Present shape carries the two values (LDT structuralFactResolve.ts:18-28); the absent shape
    // carries neither, so null here means "not present", never a default (P-157).
    structuralLivingArea: num(rec(j.structuralFact)?.livingAreaSqft),
    structuralYearBuilt: num(rec(j.structuralFact)?.yearBuilt),
    footprintState: str(rec(j.buildingFootprintFact)?.state),
    boundaryState: str(rec(j.boundaryEdgeFact)?.state),
    // P-175: the flood fact as served (LDT floodHazardFact). A null zone means not present, never a default.
    floodState: str(rec(j.floodHazardFact)?.state),
    floodZone: str(rec(j.floodHazardFact)?.floodZone),
    floodSfha: typeof rec(j.floodHazardFact)?.inSpecialFloodHazardArea === "boolean" ? j.floodHazardFact.inSpecialFloodHazardArea : null,
    // ---- OPS-24 customer leg (P-254). ADDITIVE: no field above changes meaning, so every
    // existing row and fixture keeps its verdict. A missing field stays null, never a default.
    situsZip: str(base.situsZip),
    countyNameFacet: str(f.countyName) ?? str(j.countyName),
    /** P-270/X2/XD-8: the jurisdiction whose ordinance governs. Absent means the payload cannot
     *  name it, and a renderer cannot recover a city the payload does not carry. */
    zoningJurisdictionKey: str(rec(f.zoning)?.jurisdictionKey ?? rec(f.zoning)?.zoningJurisdictionKey),
    /** The panel's own decline reason when it declines, and its withhold flag when it draws a
     *  reference outline whose figure is held back (P-249's shape on 48309:103015). */
    envelopeDeclineReason: str(env?.declineReason ?? env?.reason),
    envelopeFigureWithheld: typeof env?.figureWithheld === "boolean" ? env.figureWithheld : null,
    envelopeBuildableAreaPct: num(env?.buildableAreaPct),
    /** `envelopeCovered` is the facet layer's own boolean (atom-chain-to-facets.ts sets it true on
     *  the unverified-no-buildable-area branch, false on the declined branch). Read it as served. */
    envelopeCovered: typeof env?.envelopeCovered === "boolean" ? env.envelopeCovered : null,
    /** The panel's own claim about which facets it carries (`facetCoverage`), recorded because it
     *  is what a renderer is told it may draw. A false here beside a served value is a finding. */
    facetCoverage: rec(j.facetCoverage) ? { ...rec(j.facetCoverage) } : null,
    /** The payload's own per-rail ledger (`recordRailStates`). This is where the card's honest
     *  absences live, so a grader can tell "verified absent" from "refused" from "not attempted"
     *  instead of reading a blank as one thing. Counts are supplied for the close's use. */
    railStates: rec(j.recordRailStates) ? { ...rec(j.recordRailStates) } : null,
    railCounts: (() => {
      const rs = rec(j.recordRailStates);
      if (!rs) return null;
      const t = { present: 0, absentVerified: 0, refused: 0, absent: 0, other: 0 };
      for (const v of Object.values(rs)) {
        const s = String(rec(v)?.state ?? rec(v)?.status ?? v ?? "").toLowerCase();
        if (s === "present") t.present++;
        else if (/absent-verified|verified-absent/.test(s)) t.absentVerified++;
        else if (/refus/.test(s)) t.refused++;
        else if (/absent/.test(s)) t.absent++;
        else t.other++;
      }
      return t;
    })(),
    envelopeSetbackSource: str(env?.setbackSource),
    envelopeCitationUrl: str(env?.citationUrl),
    /** XD-11: the citation's effective or edited date. Read from the envelope's own named fields,
     *  ELSE from the panel's own disclosure text — 48021:34049 carries "parcel_record setback rule
     *  effective 2026-04-14" inside the sentence that cites the ordinance, and grading a dated
     *  citation as undated because the date sits in prose would be a false positive. The basis says
     *  which of the two was read. Absent is absent: an unreadable vintage is a conflict row. */
    envelopeCitationDate: str(env?.citationEffectiveDate ?? env?.effectiveDate ?? env?.sourceVintage ?? env?.citedAt) ?? firstDateIn([str(env?.disclosure), str(env?.summary)]),
    envelopeCitationDateFrom: str(env?.citationEffectiveDate ?? env?.effectiveDate ?? env?.sourceVintage ?? env?.citedAt) ? "field" : firstDateIn([str(env?.disclosure), str(env?.summary)]) ? "disclosure-text" : null,
    /**
     * P-270 (OPS-24 X11): the citation's VINTAGE DECLARATION — the conflict row a
     * payload must carry when its citation is served without a readable effective
     * date. Read as `{ kind, state, note }`, or null when the payload declares
     * nothing.
     *
     * WHY THIS FACET EXISTS. XD-11 asks "does this citation carry a usable
     * vintage". Before P-270 the only honest answer available to the instrument
     * was "no date found", because an undated citation and an undeclared citation
     * were indistinguishable on the wire — that IS the defect. P-270 makes them
     * distinguishable: an undated citation must now SAY SO. So the instrument
     * grades the declaration, and `envelopeCitationDateFrom` stays about the DATE
     * alone — a declaration is never a date and must never be read as one. The
     * note is deliberately digit-free (a test in the lane pins that), so it cannot
     * leak into `firstDateIn`'s disclosure-text fallback and be mistaken for a
     * vintage; `citationVintageFromDisclosureText` below measures that separately.
     */
    envelopeCitationVintage: rec(env?.citationVintage)
      ? {
          kind: str(rec(env.citationVintage).kind),
          state: str(rec(env.citationVintage).state),
          note: str(rec(env.citationVintage).note),
        }
      : null,
    /** The declaration's state token, or null. `read` is never a legal value here: a readable date is not a conflict. */
    envelopeCitationVintageState: rec(env?.citationVintage) ? str(rec(env.citationVintage).state) : null,
    /**
     * XD-11's other half, measured rather than assumed: does the vintage sentence
     * reach the DISCLOSURE prose too? A payload can carry the row and not the
     * sentence (a transformer that rewrites the disclosure is exactly how, and one
     * did — the P-304 withholding path). Grading only the row would let the
     * customer-facing paragraph go silent while the instrument stayed green.
     */
    citationVintageInDisclosure: /vintage unknown/i.test(`${str(env?.disclosure)} ${str(env?.summary)}`),
    /**
     * The trap this lane had to avoid, measured directly: does the declaration's
     * OWN text look like a date? If a future edit puts a year in the sentence, the
     * disclosure-text fallback above would read it as an effective date and this
     * probe would grade a silent pick as dated. Recorded so that regression is
     * visible as a facet rather than as a false PASS.
     */
    citationVintageFromDisclosureText:
      !str(env?.citationEffectiveDate ?? env?.effectiveDate ?? env?.sourceVintage ?? env?.citedAt) &&
      !!rec(env?.citationVintage) &&
     !!firstDateIn([str(env?.citationVintage?.note)]),
    envelopeProvisional: typeof env?.provisional === "boolean" ? env.provisional : null,
    /** XD-1/XD-13's other half: the watershed impervious figure, a TOP-LEVEL fact, printed
     *  beside the panel envelope's zoning-table `maxImperviousPct`. Two numbers a customer reads
     *  as "impervious cover" can both be correct law; recording both is the finding. */
    panelMaxImperviousPct: num(env?.maxImperviousPct),
    imperviousFactState: str(rec(j.maxImperviousCoverPctFact)?.state),
    imperviousFactPercent: num(rec(j.maxImperviousCoverPctFact)?.percent),
    imperviousFactWatershed: str(rec(j.maxImperviousCoverPctFact)?.watershedType),
    imperviousFactReason: str(rec(j.maxImperviousCoverPctFact)?.reason),
    /** XD-9: a situs the composer cannot use. `", ,"` is the fixture list's own flagged case. */
    situsMalformed: !!base.situsAddress && /^[\s,]*$/.test(String(base.situsAddress)),
    /** P-246/XD-13: any dollar rail that serves a value rather than a typed refusal. */
    dollarRailsServed: ["marketValue", "assessedValue", "landValue", "improvementValue"].filter((k) => {
      const v = rec(rec(base.cadRoll)?.[k]);
      return !!v && str(v.state) !== "refused" && num(v.value) != null;
    }),
    landUseState: str(rec(j.landUseFact)?.state),
    landUseDescription: str(rec(j.landUseFact)?.description) ?? str(rec(base.landUse)?.description),
  };
}

export function extractEnvelope(resp) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, error: resp?.error ?? resp?.text ?? "no JSON body" };
  const sb = rec(j.setbacks);
  // P-304 needs KEY PRESENCE, not a value: "Absent means the key is missing -- not 0, not null.
  // A present key holding 0 is a DIFFERENT false claim and is a FAIL."
  const props = rec(rec(rec(rec(j.payload)?.geojson)?.features?.[0])?.properties);
  const geometry = rec(rec(rec(rec(j.payload)?.geojson)?.features?.[0])?.geometry);
  const hasKey = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
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
    // P-214: the customer-facing disclosure/emptyReason strings on the envelope
    // feature's properties — where a raw hauska-engine mechanical-verify
    // diagnostic (per-edge inset remeasure text, "R32", "!=", full-precision
    // floats) leaked through unsanitized. Read from the same nested properties
    // buildableAreaSqFtInPayload already reads.
    disclosure: str(props?.disclosure),
    emptyReasonText: str(props?.emptyReason),
    // ---- OPS-24 customer leg (P-254). ADDITIVE; nothing above changes meaning. ----
    declineReason: str(j.declineReason ?? props?.declineReason),
    emptyKind: str(props?.emptyKind),
    derivePath: str(j.derivePath ?? props?.derivePath),
    hasBuildableAreaSqFtKey: hasKey(props, "buildableAreaSqFt"),
    hasBuildableAreaPctKey: hasKey(props, "buildableAreaPct"),
    buildableAreaPctInPayload: num(props?.buildableAreaPct),
    maxFootprintSqFt: num(props?.maxFootprintSqFt),
    parcelAreaSqFt: num(props?.parcelAreaSqFt ?? j.parcelAreaSqFt),
    /** "Geometry present" for the map's draw, read from the feature the route returns. An empty
     *  coordinate array is NOT geometry (P-249's own summarizer makes the same distinction). */
    geometryPresent: !!geometry && Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0,
    /** The atom a verified envelope would leave behind. A derive path without this token means the
     *  figure is unbacked by an atom, which is the entitlement P-249/P-304 hang on. */
    atomReconciled: /atom-reconciled/.test(str(j.derivePath ?? props?.derivePath) ?? ""),
  };
}

/** Great-circle distance in metres between two {lat,lng} points (P-175 record-point check). */
export function haversineM(a, b) {
  const R = 6371000, toR = (d) => (d * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
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

// The retrieval service's near-bbox route through the PE proxy. Shape read live 2026-09-11:
// { countyFips, bbox, limit, count, footprints: [...] } (present atoms only, pg-storage.ts:552-597).
// An unrecognised shape is reported as such, never counted as zero (P-158).
const FOOTPRINT_NEAR_METRES = 120;
const nearBboxQuery = (b) => `westLng=${b.west}&southLat=${b.south}&eastLng=${b.east}&northLat=${b.north}`;
export function extractFootprintNear(resp) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, ms: resp?.ms ?? null, error: resp?.error ?? resp?.text ?? "no JSON body" };
  const fps = Array.isArray(j.footprints) ? j.footprints : null;
  const count = num(j.count) ?? (fps ? fps.length : null);
  if (count == null) return { measured: true, http: resp.http, ms: resp.ms, count: null, shapeUnknown: true, keys: Object.keys(j).slice(0, 12) };
  return { measured: true, http: resp.http, ms: resp.ms, count, returned: fps ? fps.length : null };
}

/**
 * P-241: parse the ETJ instrument's single JSON document. Tolerant of a wrapper's own stdout
 * chatter by design — `pnpm exec` can print a line before the child's — but never tolerant of a
 * missing document: no document is UNMEASURED, never a pass on an empty parse.
 */
export function extractEtjInstrument(stdout) {
  const raw = typeof stdout === "string" ? stdout : "";
  let doc = null;
  try {
    doc = JSON.parse(raw);
  } catch {
    const open = raw.indexOf("{");
    const close = raw.lastIndexOf("}");
    if (open < 0 || close <= open) {
      return { measured: false, error: `ETJ instrument emitted no JSON document (${raw.trim().slice(0, 160) || "empty stdout"})` };
    }
    try {
      doc = JSON.parse(raw.slice(open, close + 1));
    } catch (e) {
      return { measured: false, error: `ETJ instrument document is not JSON (${String(e?.message ?? e)})` };
    }
  }
  const j = rec(doc);
  if (!j) return { measured: false, error: "ETJ instrument document is not an object" };
  const cps = Array.isArray(j.controlPoints) ? j.controlPoints : null;
  const pubs = Array.isArray(j.publishers) ? j.publishers : null;
  if (!cps || !pubs) {
    return { measured: false, error: `ETJ instrument document carries no controlPoints/publishers (keys ${Object.keys(j).join(",") || "none"})` };
  }
  return {
    measured: true,
    ranAt: str(j.ranAt),
    registerVintage: str(j.registerVintage),
    registerSize: num(j.registerSize),
    publishers: pubs,
    controlPoints: cps,
    summary: rec(j.summary),
    passed: num(j.passed),
    failed: num(j.failed),
  };
}

/**
 * P-241: run the lane's live ETJ instrument once and return its document. The checkout is named
 * by P241_LDT_ROOT (a lane's worktree before merge, an ordinary checkout after); when it is not
 * there this leg REFUSES — it does not silently measure a different tree.
 */
function runEtjLegs() {
  const root = process.env.P241_LDT_ROOT || "P:/seat-worktrees/p241-etj-acquisition/legacy-design-tools";
  const entry = join(root, "lib", "cad-ingest");
  if (!existsSync(entry)) {
    return { measured: false, error: `REFUSED: no legacy-design-tools checkout at ${root} (set P241_LDT_ROOT); the ETJ instrument is never run from a tree nobody named` };
  }
  try {
    const stdout = execSync("pnpm exec tsx src/boundary/etjCli.ts --verify --json", {
      cwd: entry,
      encoding: "utf8",
      timeout: ETJ_TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--use-system-ca" },
      windowsHide: true,
    });
    return { ...extractEtjInstrument(stdout), root };
  } catch (e) {
    const out = str(e?.stdout);
    // A non-zero exit still carries a document when a control point failed; parse it and let the
    // row fail on the measurement rather than reporting a bare exec error.
    if (out && out.includes("{")) {
      const parsed = extractEtjInstrument(out);
      if (parsed.measured) return { ...parsed, root, exitCode: e?.status ?? null };
    }
    return { measured: false, error: `REFUSED: the ETJ instrument did not complete (${String(e?.message ?? e).split("\n")[0]})` };
  }
}

// The situs-search route through the PE proxy (the Find box's address path). Shape read live
// 2026-09-12: 200 { hits: [{ parcelNodeId, situsAddress, countyFips, latitude, longitude }] } or
// 502 { error: "situs_search_unreachable", message } when cortex times out (P-172).
export function extractSitusSearch(resp, expectedId) {
  const j = rec(resp?.json);
  if (!j) return { measured: false, http: resp?.http ?? 0, ms: resp?.ms ?? null, error: resp?.error ?? resp?.text ?? "no JSON body" };
  if (str(j.error)) return { measured: true, http: resp.http, ms: resp.ms, hitCount: null, firstParcelNodeId: null, error: `${j.error}: ${j.message ?? ""}`.trim() };
  const hits = Array.isArray(j.hits) ? j.hits : null;
  if (!hits) return { measured: true, http: resp.http, ms: resp.ms, hitCount: null, firstParcelNodeId: null, shapeUnknown: true, keys: Object.keys(j).slice(0, 12) };
  const first = rec(hits[0]);
  return { measured: true, http: resp.http, ms: resp.ms, hitCount: hits.length, firstParcelNodeId: str(first?.parcelNodeId), firstSitusAddress: str(first?.situsAddress), matchesParcel: hits.some((h) => str(rec(h)?.parcelNodeId) === expectedId) };
}

// The OPS-24 fixture set is read ONCE at module load. A missing or unreadable list is a hard
// state, not a silently empty row: grading zero buckets must never look like grading all of them,
// so the self-test fails on it and P-254 reports UNMEASURED with the read error.
const OPS24_LOADED = (() => {
  try {
    return loadOps24FixtureList();
  } catch (e) {
    return { doc: null, sha256: null, path: OPS24_FIXTURE_LIST, error: String(e?.message || e) };
  }
})();
export const OPS24_LIST_SHA256 = OPS24_LOADED.sha256;
export const OPS24_LIST_ERROR = OPS24_LOADED.error ?? null;
export const OPS24_BUCKETS = OPS24_LOADED.doc ? flattenOps24Buckets(OPS24_LOADED.doc) : [];
export const OPS24_SUBJECTS = selectOps24Subjects(OPS24_BUCKETS, false);
/** Fixture slots the list offers across its buckets; the denominator, not the graded count. */
export const OPS24_FIXTURE_SLOTS = OPS24_SUBJECTS.reduce((n, s) => n + s.offered, 0);

export const ROWS = {
  "P-151": {
    title: "placement never depends on geocoding",
    parcels: ["48453:113408", "48453:474034"],
    evaluate(id, legs, obs) {
      const pt = legs.envelopeByPoint;
      const fx = legs.facets;
      if (!pt?.measured && !pt?.http) return { verdict: "UNMEASURED", basis: "point route leg did not run" };
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      // "Answer or refuse inside the budget." A declared refusal is a JSON body with a status or
      // errorClass, whatever its HTTP code (P-151's LDT half returns 503 resolution_timeout at
      // 8 s by design); a bare gateway 504, a non-JSON body, or anything past the budget fails.
      const POINT_BUDGET_MS = 10_000;
      const declared = pt.measured && (pt.status != null);
      const pointAnswers = declared && !pt.error && pt.ms <= POINT_BUDGET_MS && pt.http !== 504;
      const sealed = obs?.[id]?.sheetSealed;
      const parts = [
        `point route http ${pt.http} ${pt.status ?? "(no declared status)"}${pt.error ? " " + pt.error : ""} in ${pt.ms} ms (must answer or declare a refusal inside ${POINT_BUDGET_MS} ms; a bare 504 or a non-JSON body fails)`,
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
      // P152-PANEL (2026-09-12): the panel must read the one reader; any other readPath is the
      // adapter this row retires, so it fails before the MCP comparison is even consulted.
      if (fx.readPath != null && fx.readPath !== "record") return { verdict: "FAIL", basis: basis + " -- readPath is not the reader's (P152-PANEL)" };
      if (!m) return { verdict: "UNMEASURED", basis };
      if (!fx.setbacks && !m.front && !m.side && !m.rear) return { verdict: "PASS", basis: basis + " -- both absent" };
      return sameSetbacks(fx.setbacks, m) ? { verdict: "PASS", basis } : { verdict: "FAIL", basis: basis + " -- DISAGREE" };
    },
  },
  // ------------------------------------------------------------------ OPS-23 wave 1 (2026-09-11)
  "P-155": {
    title: "feasibility refresh is asynchronous; both clients get the PDF without a retry",
    // The card's predicate names the Travis parcel (the 154 s refresh that opened the row); the
    // instrument had listed the Bastrop parcel too and was corrected to the card on 2026-09-12.
    parcels: ["48453:474034"],
    evaluate(id, legs, obs) {
      // export_instrument and the app are operator-run legs; the BFF status is pasted from the
      // lane's raw response. All three enter via --observations. Nothing here is inferred.
      const o = obs?.[id] ?? {};
      const http = o.feasibilityRefreshHttp;
      const mcp = o.feasibilityMcpPdf;
      const app = o.feasibilityAppPdfWithoutRetry;
      const basis = `refresh http ${http ?? "not observed"} (202 required); MCP PDF ${mcp === true ? "OBSERVED yes" : mcp === false ? "OBSERVED no" : "not observed"}; app PDF without retry ${app === true ? "OBSERVED yes" : app === false ? "OBSERVED no" : "not observed"}`;
      if ((http != null && http !== 202) || mcp === false || app === false) return { verdict: "FAIL", basis };
      if (http !== 202 || mcp !== true || app !== true) return { verdict: "UNMEASURED", basis };
      return { verdict: "PASS", basis };
    },
  },
  "P-157": {
    title: "TCAD improvement detail ingested: structural fact present with living area and year built",
    parcels: ["48453:113408", "48453:474034"],
    evaluate(id, legs) {
      const fx = legs.facets;
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      const basis = `structuralFact ${fx.structuralState ?? "absent from payload"}; livingAreaSqft ${fx.structuralLivingArea ?? "null"}; yearBuilt ${fx.structuralYearBuilt ?? "null"} (readPath ${fx.readPath}, bakedAt ${fx.bakedAt})`;
      const ok = fx.structuralState === "present" && fx.structuralLivingArea != null && fx.structuralYearBuilt != null;
      return ok ? { verdict: "PASS", basis } : { verdict: "FAIL", basis };
    },
  },
  "P-158": {
    title: "building footprint present on the facets and returned by near-bbox around the record point",
    parcels: ["48021:34049", "48453:113408"],
    evaluate(id, legs) {
      const fx = legs.facets;
      const nb = legs.footprintNear;
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      const parts = [`buildingFootprintFact ${fx.footprintState ?? "absent from payload"}`];
      if (fx.footprintState !== "present") return { verdict: "FAIL", basis: parts.join("; ") };
      if (!nb?.measured) return { verdict: "UNMEASURED", basis: parts.join("; ") + `; near-bbox leg did not run (${nb?.error ?? "no leg"})` };
      if (nb.shapeUnknown) return { verdict: "UNMEASURED", basis: parts.join("; ") + `; near-bbox shape unknown, keys ${nb.keys?.join(",")}` };
      parts.push(`near-bbox count ${nb.count} in ${nb.ms} ms`);
      return nb.count >= 1 ? { verdict: "PASS", basis: parts.join("; ") } : { verdict: "FAIL", basis: parts.join("; ") };
    },
  },
  "P-159": {
    title: "one buildable figure per feasibility document or none; sheet 2 never claims an empty lot",
    parcels: ["48021:34049"],
    evaluate(id, legs, obs) {
      // The PDF is an operator/lane-extracted leg; the three values are read from the document text.
      const o = obs?.[id] ?? {};
      const figs = Array.isArray(o.pdfBuildableFigures) ? o.pdfBuildableFigures : null;
      const distinct = figs ? new Set(figs.map((n) => Math.round(Number(n)))).size : null;
      const pct = o.pdfPercentWithoutAtom;
      const empty = o.pdfSheet2ClaimsEmptyLot;
      const basis = `distinct buildable figures printed ${distinct ?? "not observed"}; percent without atom ${pct === true ? "OBSERVED YES (defect)" : pct === false ? "OBSERVED no" : "not observed"}; sheet 2 claims empty lot ${empty === true ? "OBSERVED YES (defect)" : empty === false ? "OBSERVED no" : "not observed"}`;
      if ((distinct != null && distinct > 1) || pct === true || empty === true) return { verdict: "FAIL", basis };
      if (distinct == null || pct !== false || empty !== false) return { verdict: "UNMEASURED", basis };
      return { verdict: "PASS", basis };
    },
  },
  "P-167": {
    title: "one display vocabulary: strings identical across panel, MCP and PDF; parity locks gone",
    parcels: ["48021:34049", "48021:33223", "48453:113408", "48453:474034", "48453:367134"],
    evaluate(id, legs, obs) {
      // Per-parcel: the lane's side-by-side string table, judged by the planner. Global (_vocab):
      // the retirement, proven on origin/main, and the package version every consumer imports.
      const o = obs?.[id] ?? {};
      const v = rec(obs?._vocab) ?? {};
      const same = o.displayStringsIdentical;
      const lock = v.parityLockDeleted;
      const importers = Array.isArray(v.importers) ? v.importers : [];
      const missing = ["hauska-map", "hauska-engine", "legacy-design-tools"].filter((r) => !importers.includes(r));
      const basis = `strings identical ${same === true ? "OBSERVED yes" : same === false ? "OBSERVED no" : "not observed"}; parity locks deleted ${lock === true ? "OBSERVED yes" : lock === false ? "OBSERVED no" : "not observed"}; package ${v.packageVersion ?? "not observed"} imported by ${importers.length ? importers.join(",") : "none observed"}`;
      if (same === false || lock === false) return { verdict: "FAIL", basis };
      if (same !== true || lock !== true || missing.length) return { verdict: "UNMEASURED", basis: basis + (missing.length ? `; importers missing ${missing.join(",")}` : "") };
      return { verdict: "PASS", basis };
    },
  },
  // ------------------------------------------------------------------ OPS-23 wave 2 (2026-09-12)
  "P-169": {
    title: "the CAD loader and the footprint writer have Cloud Run jobs; a laptop apply is refused by code",
    parcels: ["48453:113408"],
    evaluate(id, legs, obs) {
      // Observed row: the job list, the staging run records and the refusals are pasted by the
      // planner from gcloud output read by field. No surface leg exists for infrastructure.
      const o = obs?.[id] ?? rec(obs?._infra) ?? {};
      const jobs = Array.isArray(o.jobsListed) ? o.jobsListed : null;
      const recs = Array.isArray(o.stagingDryRunRecords) ? o.stagingDryRunRecords : null;
      const refused = o.laptopApplyRefused;
      const basis = `jobs listed ${jobs ? jobs.length + " (" + jobs.join(", ") + ")" : "not observed"}; staging run records ${recs ? recs.length : "not observed"}; laptop apply refused ${refused === true ? "OBSERVED yes" : refused === false ? "OBSERVED no" : "not observed"}`;
      if ((jobs && jobs.length < 2) || (recs && recs.length < 2) || refused === false) return { verdict: "FAIL", basis };
      if (!jobs || !recs || refused !== true) return { verdict: "UNMEASURED", basis };
      return { verdict: "PASS", basis };
    },
  },
  "P-171": {
    title: "the 2026-09-07 building-footprint atoms write has a named writer or a run record",
    parcels: ["48021:34049"],
    evaluate(id, legs, obs) {
      const o = obs?.[id] ?? rec(obs?._audit) ?? {};
      const outcome = str(o.outcome);
      const ref = str(o.recordRef);
      const basis = `outcome ${outcome ?? "not observed"}; record ${ref ?? "none"}`;
      if (outcome === "c") return { verdict: "FAIL", basis: basis + " -- not attributable from any listed source; the row stays open on its recommendation" };
      if ((outcome === "a" || outcome === "b") && ref) return { verdict: "PASS", basis };
      return { verdict: "UNMEASURED", basis };
    },
  },
  "P-172": {
    title: "the Find box resolves a split-situs Travis address from the situs index, geocoder labelled",
    parcels: ["48453:113408"],
    evaluate(id, legs, obs) {
      const b = legs.situsSearchBare;
      const c = legs.situsSearchCity;
      const o = obs?.[id] ?? {};
      const legOk = (l) => l?.measured && l.http === 200 && l.matchesParcel === true;
      const legBad = (l) => l?.measured && (l.http !== 200 || l.matchesParcel === false || l.error);
      const fmt = (l, name) => `${name} ${l?.measured ? `http ${l.http} ${l.error ? l.error : `hits ${l.hitCount} first ${l.firstParcelNodeId ?? "-"}`} in ${l.ms} ms` : `not run (${l?.error ?? "no leg"})`}`;
      const parts = [fmt(b, "bare"), fmt(c, "city-qualified"), `Find box resolves: ${o.findBoxResolves === true ? "OBSERVED yes" : o.findBoxResolves === false ? "OBSERVED no" : "not observed"}`, `resolved via: ${o.resolvedVia ?? "not observed"}`];
      if (legBad(b) || legBad(c) || o.findBoxResolves === false || o.resolvedVia === "geocoded") return { verdict: "FAIL", basis: parts.join("; ") };
      if (!legOk(b) || !legOk(c) || o.findBoxResolves !== true || o.resolvedVia !== "situs") return { verdict: "UNMEASURED", basis: parts.join("; ") };
      return { verdict: "PASS", basis: parts.join("; ") };
    },
  },
  // ------------------------------------------------------------------ OPS-23 wave 3 (2026-09-12)
  "P-154": {
    title: "most-current source wins: panel, envelope endpoint, MCP and PDF print the same setbacks and date, or all show the conflict row",
    parcels: ["48021:34049", "48021:33223"],
    evaluate(id, legs, obs) {
      const fx = legs.facets;
      const env = legs.envelopeByAddress;
      const o = obs?.[id] ?? {};
      if (!fx?.measured) return { verdict: "UNMEASURED", basis: "facets leg did not run" };
      const cands = [["panel", fx.setbacks], ["endpoint", env?.measured && env.status === "ok" ? env.setbacks : null], ["MCP", o.mcpSetbacks ?? null], ["PDF", o.pdfSetbacks ?? null]];
      const present = cands.filter(([, s]) => s && (s.front != null || s.side != null || s.rear != null));
      const conflictDeclared = o.conflictRow === true;
      const date = str(o.setbackSourceDate);
      const basis = cands.map(([n, s]) => `${n} ${s ? fmtSb(s) : "none"}`).join("; ") + `; sourceDate ${date ?? "not observed"}; conflict row ${conflictDeclared ? "OBSERVED" : "no"}`;
      // Any two measured or observed producers that disagree, absent a declared conflict row, fail.
      for (let i = 0; i < present.length; i++) for (let k = i + 1; k < present.length; k++) {
        if (!sameSetbacks(present[i][1], present[k][1]) && !conflictDeclared) return { verdict: "FAIL", basis: basis + ` -- ${present[i][0]} and ${present[k][0]} DISAGREE` };
      }
      if (present.length < 4 && !conflictDeclared) return { verdict: "UNMEASURED", basis: basis + " -- not every producer observed" };
      if (!date && !conflictDeclared) return { verdict: "UNMEASURED", basis: basis + " -- no source date observed" };
      return { verdict: "PASS", basis };
    },
  },
  "P-173": {
    title: "a writer's lease leaves a history row that survives release; the audit reads it by run id",
    parcels: ["48021:34049"],
    evaluate(id, legs, obs) {
      const o = obs?.[id] ?? rec(obs?._lease) ?? {};
      const a = o.leaseHistoryRowSurvivesRelease, b = o.auditReturnsByRunId;
      const basis = `history row survives release ${a === true ? "OBSERVED yes" : a === false ? "OBSERVED no" : "not observed"}; audit returns by run id ${b === true ? "OBSERVED yes" : b === false ? "OBSERVED no" : "not observed"}; run ${o.runId ?? "not observed"}`;
      if (a === false || b === false) return { verdict: "FAIL", basis };
      if (a !== true || b !== true || !str(o.runId)) return { verdict: "UNMEASURED", basis };
      return { verdict: "PASS", basis };
    },
  },
  "P-174": {
    title: "one placement path: a search-landed subject shows setbacks without a second click",
    parcels: ["48021:34049"],
    evaluate(id, legs, obs) {
      // Both legs are the operator's, on smartsite.cloud: search-landed, then clicked.
      const o = obs?.[id] ?? {};
      const s = o.searchLandedSetbacksShown, c = o.clickSetbacksShown;
      const basis = `search-landed setbacks shown ${s === true ? "OBSERVED yes" : s === false ? "OBSERVED no" : "not observed"}; click setbacks shown ${c === true ? "OBSERVED yes" : c === false ? "OBSERVED no" : "not observed"}`;
      if (s === false || c === false) return { verdict: "FAIL", basis };
      if (s !== true || c !== true) return { verdict: "UNMEASURED", basis };
      return { verdict: "PASS", basis };
    },
  },
  "P-175": {
    title: "Hays online: each Sturgeon Dr address resolves to a node whose label, record point and flood fact are that lot's",
    parcels: ADDRESSES.map((a) => a.key),
    evaluate(key, legs, _obs) {
      const a = ADDRESSES.find((x) => x.key === key);
      const s = legs.situsSearchCity;
      const f = legs.facets;
      if (!s?.measured) return { verdict: "UNMEASURED", basis: `situs-search leg did not run for "${a?.address ?? key}" (run with --rows P-175)` };
      if (s.error || !(s.hitCount >= 1) || !s.firstParcelNodeId) return { verdict: "FAIL", basis: `situs search for "${a.address}" returned no parcel hit (${s.error ?? "hits " + (s.hitCount ?? 0) + ", none carrying a parcel node id; a located address point is not a parcel"})` };
      if (!f?.measured) return { verdict: "UNMEASURED", basis: `node ${s.firstParcelNodeId} resolved but its facets leg did not run (${f?.error ?? "no leg"})` };
      // Three derivations against the lot's published identifiers (CAD PropertyID, TxGIO prop_id, geo_id):
      // the node the search resolved, the card label, and the county layer's polygon at the CAPCOG point.
      // The node's own served polygon is not readable through the surface (the map assembles it
      // client-side), so a right label on a wrong ring is the residual; the lane pastes get_smart_site's draw block.
      const nodePropId = s.firstParcelNodeId.split(":")[1];
      const nodeOk = a.ids.includes(nodePropId);
      const label = f.composedAddress ?? f.situsAddress ?? "";
      // P-160 ruling 2026-09-14 (A-147): a lot whose roll carries no house number prints the roll's numberless situs;
      // the card label is right when it is the numbered address OR the numberless street while the search hit carried the number.
      const numbered = new RegExp("^" + a.houseNumber + "\\s+" + a.street + "\\b", "i");
      const streetOnly = new RegExp("^" + a.street + "\\b", "i");
      const hitNumbered = numbered.test(s.firstSitusAddress ?? "");
      const labelOk = numbered.test(label) || (streetOnly.test(label) && hitNumbered);
      const distM = f.recordPoint ? Math.round(haversineM(f.recordPoint, a.point)) : null;
      const g = legs.gisRing;
      const ringId = g?.measured ? (g.containingFeatureId ?? null) : null;
      const ringOk = ringId != null && a.ids.some((id) => String(ringId).endsWith(id));
      const floodOk = f.floodState === "present" && f.floodZone != null;
      const basis = `node ${s.firstParcelNodeId} ${nodeOk ? "is" : "IS NOT"} one of the lot's identifiers; label "${label}" ${labelOk ? "matches" : "DOES NOT match"}; record point ${distM == null ? "absent on this path" : distM + " m from the address point"}; county polygon at the address point ${g?.measured ? (ringId == null ? "NONE (hole in the layer" + (g.nearest ? ", nearest " + g.nearest.id + " " + g.nearest.metres + " m" : "") + ")" : ringId + (ringOk ? " (the lot)" : " (NOT the lot)")) : "not read"}; flood ${f.floodState ?? "-"} zone ${f.floodZone ?? "-"}`;
      if (!nodeOk || !labelOk || (distM != null && distM > 150)) return { verdict: "FAIL", basis: basis + " -- the node that answers to the address is, or carries, another parcel" };
      if (g?.measured && ringId != null && !ringOk) return { verdict: "FAIL", basis: basis + " -- the county layer names a different parcel at the address point" };
      if (!(g?.measured && ringId != null) && distM == null) return { verdict: "UNMEASURED", basis: basis + " -- neither an anchor nor a containing polygon was readable" };
      if (!floodOk) return { verdict: "FAIL", basis: basis + " -- flood fact not present on the record" };
      return { verdict: "PASS", basis };
    },
  },
  // ------------------------------------------------------------------ P-241 (2026-09-16)
  "P-241": {
    title: "ETJ: a real Austin ETJ address resolves present from the published layer, while the city-limits trap, a city-limits-only city and an unserved city each answer honestly",
    parcels: ETJ_SUBJECTS.map((s) => s.key),
    evaluate(key, legs) {
      const l = legs.etjLive;
      const s = ETJ_SUBJECTS.find((x) => x.key === key);
      if (!s) return { verdict: "UNMEASURED", basis: `no ETJ subject definition for ${key}` };
      if (!l?.measured) {
        return { verdict: "UNMEASURED", basis: `ETJ instrument leg did not run (${l?.error ?? "no leg"}) -- run with --rows P-241 and P241_LDT_ROOT set to the checkout that carries the lane` };
      }
      const sum = l.summary ?? {};
      const cp = l.controlPoints.find((c) => c.key === s.controlPointKey) ?? null;
      const guards = Array.isArray(sum.predicateGuardFailures) ? sum.predicateGuardFailures : null;
      const withRings = l.publishers.filter((p) => p?.hasEtjRings === true).length;
      const withoutRings = l.publishers.length - withRings;
      const head =
        `register ${l.registerVintage ?? "?"} (${l.registerSize ?? "?"} cities), ${num(sum.publishersWithRings) ?? "?"} publishers with rings and ${num(sum.publishersEnumeratedWithoutRings) ?? "?"} enumerated without, ` +
        `${num(sum.ringsAcquired) ?? "?"} ETJ rings acquired live`;
      // The two halves of the document must agree: a summary that claims publishers the publisher
      // list does not carry is the instrument disagreeing with itself, and everything downstream
      // of it is unreadable.
      if (l.publishers.length === 0) return { verdict: "FAIL", basis: `${head} -- the instrument listed no publishers at all, so nothing was acquired` };
      if (num(sum.publishersWithRings) !== withRings || num(sum.publishersEnumeratedWithoutRings) !== withoutRings) {
        return { verdict: "FAIL", basis: `${head} -- but its publisher list carries ${withRings} with rings and ${withoutRings} without; the instrument disagrees with itself` };
      }
      if (cp === null) {
        return { verdict: "FAIL", basis: `${head}; the instrument reported NO control point "${s.controlPointKey}" for ${s.situs} — a control point that silently disappears is the defect this row exists to catch` };
      }
      const basis =
        `${head}; ${s.situs} -> pre-registered ${s.expect}, instrument said ${cp.actual ?? "nothing"}` +
        (cp.actualCityKey ? ` (${cp.actualCityKey})` : "") +
        (cp.ringLabel ? ` ring "${cp.ringLabel}"` : "") +
        (cp.sourceCitation ? ` cited ${cp.sourceCitation}` : "") +
        `: ${cp.basis ?? "no basis given"}`;
      // A publisher whose predicate stopped selecting its city's ETJ (or started selecting the
      // whole layer, city limits included) fails every subject at once, because the rings under
      // the whole resolution are then wrong. It is checked before the per-subject verdict.
      if (guards !== null && guards.length) return { verdict: "FAIL", basis: basis + ` -- predicate guard failed for ${guards.join(", ")}: the rings under every answer are wrong` };
      if (guards === null) return { verdict: "FAIL", basis: basis + " -- the instrument reported no predicate-guard summary, so no publisher's ETJ selection was proven selective" };
      if (cp.verdict !== "PASS") return { verdict: "FAIL", basis: basis + " -- the instrument itself marked this control point FAIL" };
      if (cp.actual !== s.expect) return { verdict: "FAIL", basis: basis + ` -- the disposition is not the pre-registered one` };
      if (s.expectCityKey !== null && cp.actualCityKey !== s.expectCityKey) return { verdict: "FAIL", basis: basis + ` -- resolved as ${cp.actualCityKey ?? "no city"}, expected ${s.expectCityKey}` };
      if (s.expect === "present" && !str(cp.sourceCitation)) return { verdict: "FAIL", basis: basis + " -- a present disposition must cite the source it came from" };
      if (s.expect === "present" && !str(cp.ringLabel)) return { verdict: "FAIL", basis: basis + " -- a present disposition must name the publisher's own ring label" };
      // The two unresolved subjects differ in WHY they are unresolved, and the wording is the only
      // thing that separates "checked, this city publishes no ETJ layer" from "not covered at all".
      // A generic unresolved that names neither is not evidence of the distinction.
      const missing = s.mustContain.filter((t) => !String(cp.basis ?? "").includes(t));
      if (missing.length) return { verdict: "FAIL", basis: basis + ` -- the basis does not state ${missing.join(", ")}` };
      return { verdict: "PASS", basis };
    },
  },
  "P-214": {
    title: "no customer-facing envelope string carries an internal identifier, an unrounded float, or assertion syntax",
    parcels: ["48021:8723767"],
    evaluate(id, legs) {
      const pt = legs.envelopeByPoint;
      if (!pt?.measured) return { verdict: "UNMEASURED", basis: "envelope-by-point leg did not run" };
      const text = [pt.disclosure, pt.emptyReasonText].filter(Boolean).join(" | ");
      if (!text) {
        return {
          verdict: "UNMEASURED",
          basis: `no disclosure/emptyReason text in the response (status ${pt.status ?? "?"}, http ${pt.http})`,
        };
      }
      const violations = [];
      if (/\bR\d+\b/.test(text)) violations.push("internal rule/gate identifier (R\\d+)");
      if (/!=/.test(text)) violations.push("assertion syntax (!=)");
      if (/\d+\.\d{4,}/.test(text)) violations.push("unrounded float (4+ decimal places)");
      if (/\bedge\s+\d+:/i.test(text)) violations.push("raw per-edge diagnostic prefix");
      const basis = `envelope-by-point disclosure/emptyReason: "${text}"`;
      if (violations.length) {
        return { verdict: "FAIL", basis: `${basis} -- violations: ${violations.join(", ")}` };
      }
      return { verdict: "PASS", basis };
    },
  },

  // ------------------------------------------------------------------ OPS-24 customer leg (P-254)
  // `optional: true` means a pass that did NOT drive this leg emits no result for it. Without that,
  // every cheap `--fixtures` run would report 45 buckets UNMEASURED and drown the rows it did
  // measure. When the row IS named, an unnamed bucket is reported ungraded, because then the
  // absence of a grade is itself the answer (program scope section 5: the ungraded count is the
  // number the Phase 0 exit reads).
  "P-254": {
    title: "the customer leg: every fixture bucket graded on the map, the MCP and the PDF, with status, declineReason, envelopeCovered, geometry presence and figure presence per envelope fixture",
    parcels: OPS24_BUCKETS.map((b) => b.key),
    optional: true,
    evaluate(id, legs, obs, rowFilter) {
      if (OPS24_LIST_ERROR) return { verdict: "UNMEASURED", basis: `${OPS24_FIXTURE_LIST} could not be read: ${OPS24_LIST_ERROR}` };
      if (legs?.ops24) return gradeOps24Bucket(legs.ops24, legs);
      return { verdict: "UNMEASURED", basis: `${id}: named in this pass and NOT graded -- no bucket legs were driven (selection rule ${rowFilter?.includes("P-254") ? "on" : "off"})` };
    },
  },

  // P-303. Both halves come from the same live pair, so a panel that declines while its own route
  // draws is caught by comparing the two surfaces of ONE parcel rather than by trusting a wording.
  "P-303": {
    title: "the panel draws an envelope its own endpoint can draw and prints no area figure, and a class member with no district still declines instead of having a district invented",
    parcels: P303_SUBJECTS.map((s) => s.id),
    optional: true,
    evaluate(id, legs) {
      const s = P303_SUBJECTS.find((x) => x.id === id);
      if (!s) return { verdict: "UNMEASURED", basis: `${id} is not a P-303 subject` };
      const fx = legs.facets ?? {};
      if (fx.measured === false) return { verdict: "UNMEASURED", basis: `${id}: the card payload did not answer (${fx.error ?? "http " + fx.http})` };
      if (s.role === "waco-draws-no-figure") {
        if (!legs.draw?.measured) return { verdict: "UNMEASURED", basis: `${id}: the draw route did not answer, so "an envelope its own endpoint can draw" is not measured` };
        // A-215 ruling 13 (P-347) replaced the P-153/P-159 blanket refusal: a figure a verified
        // envelope atom backs may show; an unbacked one may not; an unreadable backing grades nothing.
        const fig = figureVerdict(legs);
        if (fig.verdict === "FAIL") return { verdict: "FAIL", basis: `${id}: ${fig.basis}` };
        if (fig.verdict === "UNMEASURED") return { verdict: "UNMEASURED", basis: `${id}: ${fig.basis}` };
        const drew = legs.draw.status === "ok" && legs.draw.geometryPresent === true;
        if (!drew) return { verdict: "FAIL", basis: `${id}: the panel must draw an envelope its own endpoint can draw and the route answered ${legs.draw.status ?? "?"} with geometryPresent ${legs.draw.geometryPresent} (${legs.draw.vertexCount ?? "?"} vertices)` };
        if (panelEnvelopeDeclined({ facets: fx }).declined) return { verdict: "FAIL", basis: `${id}: the route draws ${legs.draw.vertexCount} vertices for this parcel while the panel declines the envelope (${panelEnvelopeDeclined({ facets: fx }).why}); the panel declines what its own place/buildable-envelope route draws (XD-2/X5)` };
        return { verdict: "PASS", basis: `${id}: route draws ${legs.draw.vertexCount} vertices, panel envelopeStatus "${fx.envelopeStatus ?? "-"}", no area figure on the payload` };
      }
      const declined = panelEnvelopeDeclined({ facets: fx });
      if (!declined.declined) return { verdict: "FAIL", basis: `${id}: the record holds no district and the panel did not decline (envelopeStatus "${fx.envelopeStatus ?? "-"}"; ${declined.why}); a district must not be invented for a class member` };
      if (fx.zoningDistrict) return { verdict: "FAIL", basis: `${id}: the panel declines and the payload now carries district ${fx.zoningDistrict}; this class member's record has no district, so the district was invented` };
      return { verdict: "PASS", basis: `${id}: declines (${declined.why}), no district invented` };
    },
  },

  // P-304. The entitlement test needs a PAIR: the same anonymous read must withhold on the parcel
  // whose derive path carries no reconciled atom and MUST KEEP the figure on the verified control.
  // A predicate that only failed open would pass a blanket strip, so the control is what proves it.
  "P-304": {
    title: "the area-figure entitlement is checkable: an unverified parcel withholds the figure and the verified control keeps it in the same anonymous read, never fail-closed on both",
    parcels: P304_SUBJECTS.map((s) => s.id),
    optional: true,
    evaluate(id, legs) {
      const s = P304_SUBJECTS.find((x) => x.id === id);
      if (!s) return { verdict: "UNMEASURED", basis: `${id} is not a P-304 subject` };
      const fx = legs.facets ?? {};
      if (fx.measured === false) return { verdict: "UNMEASURED", basis: `${id}: the card payload did not answer, so the entitlement is not measured` };
      const sqFt = fx.buildableAreaSqFtInPayload;
      const pct = fx.envelopeBuildableAreaPct;
      if (s.expectWithheld) {
        if (sqFt != null || pct != null) return { verdict: "FAIL", basis: `${id}: this parcel's derive path carries no reconciled atom and the payload still serves ${sqFt ?? "-"} sqFt / ${pct ?? "-"} pct; an unbacked figure must not reach a customer` };
        // Absence is NOT evidence of a withhold. An empty payload serves no figure either, so the
        // predicate needs a surface that SAYS the figure is held back. Without it: UNMEASURED.
        const evidence = fx.envelopeFigureWithheld === true || /withheld|unavail|unverif|declin|refus/i.test(str(fx.envelopeStatus) ?? "");
        if (!evidence) return { verdict: "UNMEASURED", basis: `${id}: no figure is served and no surface says one is withheld (envelopeStatus "${fx.envelopeStatus ?? "-"}"), so an empty payload is indistinguishable from an entitlement withhold` };
        if (legs.draw?.measured && legs.draw.atomReconciled === true) return { verdict: "FAIL", basis: `${id}: the derive path carries a reconciled atom, so this parcel IS verified and must keep its figure, and it is served none` };
        return { verdict: "PASS", basis: `${id}: unverified parcel, withholding stated (figureWithheld ${fx.envelopeFigureWithheld ?? "-"}, envelopeStatus "${fx.envelopeStatus ?? "-"}"), no figure served` };
      }
      if (sqFt == null && pct == null) return { verdict: "FAIL", basis: `${id}: the VERIFIED control must keep its figure and is served none; a blanket strip has taken an entitled figure off a verified parcel (P-304 fail-closed regression)` };
      if (s.expectSqFt != null && sqFt !== s.expectSqFt) return { verdict: "FAIL", basis: `${id}: expected ${s.expectSqFt} sqFt and the payload serves ${sqFt}` };
      if (s.expectPct != null && pct !== s.expectPct) return { verdict: "FAIL", basis: `${id}: expected ${s.expectPct} pct and the payload serves ${pct}` };
      return { verdict: "PASS", basis: `${id}: verified control keeps ${sqFt} sqFt / ${pct} pct in the same anonymous read that withholds on the unverified parcel` };
    },
  },

  // P-347: the coverage leg of the Phase 0 exit. P-210 grades the derived covered set (the retrieval
  // endpoint); P-205 grades what the customer reads on both search surfaces. A surface that was not
  // driven leaves its half UNMEASURED; a FAIL on either surface fails the subject.
  "P-210": {
    title: "coverage is the serving path, derived live: the retrieval endpoint answers covered, or not-covered naming the county and its state",
    // Only subjects with an endpoint expectation. An out-of-state subject has none, and grading it
    // "recorded only" as a PASS would count a pass nothing measured.
    parcels: COVERAGE_SUBJECTS.filter((s) => s.endpoint !== null).map((s) => s.key),
    optional: true,
    evaluate(id, legs) {
      const s = COVERAGE_SUBJECTS.find((x) => x.key === id);
      const e = legs.coverageEndpoint;
      if (!s || !e || s.endpoint === null) return { verdict: "UNMEASURED", basis: `${id}: not a P-210 subject, or the coverage legs were not driven (run with --rows P-210)` };
      if (!e.measured) return { verdict: "UNMEASURED", basis: `${id}: ${e.error}` };
      if (e.status !== s.endpoint) return { verdict: "FAIL", basis: `${id}: the endpoint answers "${e.status}" where "${s.endpoint}" is owed` };
      if (s.countyFips && (e.countyFips !== s.countyFips || !e.countyName || !e.state)) return { verdict: "FAIL", basis: `${id}: not-covered must name ${s.countyFips} with its name and state; served ${e.countyFips ?? "-"} "${e.countyName ?? "-"}" ${e.state ?? "-"}` };
      return { verdict: "PASS", basis: `${id}: ${e.status}${e.countyName ? ` naming ${e.countyName} (${e.countyFips}), ${e.state}` : ""}` };
    },
  },
  "P-205": {
    title: "Texas is held correctly at the customer's search: an uncovered county is named, a covered miss reads no-hit, never a silent empty list, on the Find box and the MCP",
    parcels: COVERAGE_SUBJECTS.map((s) => s.key),
    optional: true,
    evaluate(id, legs) {
      const s = COVERAGE_SUBJECTS.find((x) => x.key === id);
      if (!s || !legs.findBox) return { verdict: "UNMEASURED", basis: `${id}: the coverage legs were not driven (run with --rows P-205)` };
      const parts = [gradeCoverageSurface(s, legs.findBox, "map Find box"), gradeCoverageSurface(s, legs.mcpFind, "MCP find_parcel")];
      const verdict = parts.some((p) => p.verdict === "FAIL") ? "FAIL" : parts.some((p) => p.verdict === "UNMEASURED") ? "UNMEASURED" : "PASS";
      return { verdict, basis: `${id}: ${parts.map((p) => `${p.verdict} ${p.basis}`).join(" | ")}`, surfaces: { map: parts[0].verdict, mcp: parts[1].verdict } };
    },
  },
};

// --------------------------------------------------------------------------- live run
/** P-175: the customer's path. Situs search by the full address, then the facets of the first hit. */
async function runAddressLegs(a) {
  const ph = { measured: false, error: "address-keyed leg (P-175): not attempted" };
  const s = extractSitusSearch(await call("GET", `${PE_BASE}/api/pe-situs-search?q=${encodeURIComponent(a.address)}&limit=7`, null, 12_000), null);
  let facets = { measured: false, error: "no situs hit to read facets for" };
  if (s.measured && !s.error && s.firstParcelNodeId) {
    facets = extractFacets(await call("GET", `${PE_BASE}/api/spine/property-atoms/${encodeURIComponent(s.firstParcelNodeId)}/facets`, null, LEG_TIMEOUT_MS.facets));
  }
  const nodePropId = s.firstParcelNodeId ? s.firstParcelNodeId.split(":")[1] : "-";
  const gisRing = extractGisRing(await call("POST", `${CORTEX_PROXY}/brokerage/v1/map-data/gis-layer`, { layer: "parcels", bbox: bboxAround(a.point, RING_PROBE_METRES) }, LEG_TIMEOUT_MS.gisRing), nodePropId, a.point);
  return { facets, situsSearchCity: s, situsSearchBare: { measured: false, error: "address-keyed leg: one situs form only" }, envelopeByAddress: ph, envelopeByPoint: ph, gisRing, cortexNode: ph };
}

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
  legs.footprintNear = pt
    ? extractFootprintNear(await call("GET", `${PE_BASE}/api/spine/retrieval/building-footprints/near-bbox?countyFips=${parcel.fips}&${nearBboxQuery(bboxAround(pt, FOOTPRINT_NEAR_METRES))}&limit=50`, null, LEG_TIMEOUT_MS.gisRing))
    : { measured: false, error: "no record point; near-bbox leg not attempted" };
  // The Find box's address path, bare and city-qualified (P-172). Only for parcels with a situs.
  const bare = legs.facets.situsAddress;
  legs.situsSearchBare = bare
    ? extractSitusSearch(await call("GET", `${PE_BASE}/api/pe-situs-search?q=${encodeURIComponent(bare)}&limit=7`, null, 12_000), parcel.id)
    : { measured: false, error: "no situs on the record; bare situs-search leg not attempted" };
  legs.situsSearchCity = addr && addr !== bare
    ? extractSitusSearch(await call("GET", `${PE_BASE}/api/pe-situs-search?q=${encodeURIComponent(addr)}&limit=7`, null, 12_000), parcel.id)
    : { measured: false, error: "no composed address distinct from the bare situs; city-qualified leg not attempted" };
  if (opts.cortex) {
    const r = await call("GET", `${opts.cortex.base}/api/brokerage/v1/place/node/${encodeURIComponent(parcel.id)}`, null, LEG_TIMEOUT_MS.cortexNode, { [opts.cortex.header]: opts.cortex.key });
    legs.cortexNode = { measured: !!r.json, http: r.http, ms: r.ms, error: r.error ?? r.text ?? null, keys: r.json ? Object.keys(r.json).slice(0, 12) : null };
  } else {
    legs.cortexNode = { measured: false, error: "REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed" };
  }
  return legs;
}

// =================================================================== OPS-24 customer leg (P-254)
// The customer leg measures what the THREE customer surfaces actually serve for the fixture set,
// measured LIVE, never inferred from a merge or a store read (program scope rev 4, section 5).
//
//   1. MAP  — the card payload `/api/spine/property-atoms/<id>/facets`, PLUS the draw the map makes
//             under Ruling B: `POST /api/spine/cortex/api/brokerage/v1/place/buildable-envelope`.
//             The panel payload carries NO envelope GeoJSON on any probed parcel (measured
//             2026-09-17), so "geometry presence" for the map is read from the draw route — the
//             same `place/buildable-envelope` call the MCP draw block makes, which is why a panel
//             that declines while its own route draws is a real defect (XD-2/X5) and not a wording
//             dispute. The instrument says which of the two it read, per field, in the basis.
//   2. MCP  — `get_smart_site` at node depth against smartsite-mcp.
//   3. PDF  — the engine-api feasibility export, read with GET and NEVER the refresh POST.
//
// A surface that cannot be reached enters as UNMEASURED carrying the measured refusal, and its
// bucket is then NOT fully graded. That is the honest state; the close counts it as ungraded and
// names the reason rather than reporting a green Phase 0 leg over a surface nobody reached.
const OPS24_LEG_TIMEOUT_MS = 45_000;
/** The gate front the map itself presents to the engine-api on the export read path. */
export const gateFrontHeaders = (reqId, pkgId) => ({
  "x-hauska-product": "cortex",
  "x-hauska-tenant-id": "public-catalog",
  "x-hauska-package-id": pkgId,
  "x-hauska-gate-credential-id": "property-explorer-feasibility-bff",
  "x-hauska-access-tier": "public-paid",
  "x-hauska-request-id": `surface-probe-p254-${reqId}`,
});

function loadOps24FixtureList(path = join(ROOT, OPS24_FIXTURE_LIST)) {
  const raw = readFileSync(path, "utf8");
  return { doc: JSON.parse(raw), sha256: createHash("sha256").update(raw).digest("hex"), path: String(path).replace(/\\/g, "/") };
}

/** Flatten the list's county -> city -> category shape into one record per bucket. */
export function flattenOps24Buckets(doc) {
  const buckets = [];
  for (const [county, byCity] of Object.entries(doc?.buckets ?? {})) {
    const countyName = byCity?.countyName ?? null;
    for (const [city, v] of Object.entries(byCity ?? {})) {
      if (city === "countyName") continue;
      const fixtures = [];
      for (const category of OPS24_CATEGORY_PRIORITY) {
        const f = v?.[category];
        if (f == null) continue;
        if (typeof f === "string") fixtures.push({ category, id: f, district: v?.district ?? null });
        else if (f.id) fixtures.push({ category, id: f.id, district: f.district ?? null });
      }
      buckets.push({ key: `${county}|${city}`, county, countyName, city, n: v?.n ?? null, note: v?.note ?? null, fixtures });
    }
  }
  return buckets;
}

/** The one fixture a bucket is graded on, by OPS24_CATEGORY_PRIORITY; `all` returns every slot. */
export function selectOps24Subjects(buckets, all = false) {
  return buckets.map((b) => ({
    ...b,
    gradedFixture: b.fixtures[0] ?? null,
    chosen: all ? b.fixtures : b.fixtures.slice(0, 1),
    offered: b.fixtures.length,
    ungradedFixtures: all ? [] : b.fixtures.slice(1).map((f) => `${f.category}:${f.id}`),
  }));
}

/** A read-only request that keeps the WHOLE body: MCP speaks SSE, and `call()` truncates. */
async function callRaw(method, url, body, timeoutMs, headers = {}) {
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
    // P-347: the headers are kept. The MCP session id travels in `mcp-session-id`, and a caller
    // that cannot read it can never make a second call on the session it opened.
    return { http: res.status, ms: Date.now() - t0, headers: res.headers, text: await res.text() };
  } catch (e) {
    return { http: 0, ms: Date.now() - t0, error: String(e?.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

/** JSON-RPC over SSE or plain JSON; takes the LAST parseable frame, which is the response. */
export function parseMcpBody(text) {
  if (!text) return null;
  const frames = String(text).split(/\r?\n/).filter((l) => /^data:/.test(l)).map((l) => l.replace(/^data:\s?/, "").trim());
  const candidates = frames.length ? frames : [String(text).trim()];
  for (let i = candidates.length - 1; i >= 0; i--) {
    try {
      const j = JSON.parse(candidates[i]);
      if (j && (j.result !== undefined || j.error !== undefined)) return j;
    } catch { /* keep looking */ }
  }
  return null;
}

/**
 * The PDF surface: the engine-api feasibility export, read-only. Shape measured 2026-09-17:
 * `state` is `ready` | `never-requested`, the asset is `artifacts["pdf-feasibility"]` carrying a
 * `gcs://` ref plus the build's own identity facts, and `entitlement` says which tier was granted.
 * `never-requested` is a NORMAL cold state (the build is triggered by the refresh POST that P-155
 * owns), so it is reported as a named not-built state, never as a defect and never as a pass.
 */
export function extractPdfRecord(resp) {
  if (!resp || resp.http === 0) return { measured: false, http: 0, error: resp?.error ?? "the export route did not answer" };
  const j = rec(resp.json);
  if (!j) return { measured: false, http: resp.http, error: `non-JSON body (${resp.text ? String(resp.text).slice(0, 120) : "empty"})` };
  const art = rec(rec(j.artifacts)?.["pdf-feasibility"]);
  const ent = rec(j.entitlement);
  return {
    measured: true,
    http: resp.http,
    ms: resp.ms,
    state: str(j.state),
    errorClass: str(j.errorClass),
    errorMessage: str(j.errorMessage),
    jobRef: str(j.jobRef),
    completedAt: str(j.completedAt),
    artifactKeys: j.artifacts ? Object.keys(j.artifacts) : [],
    artifactPresent: !!art,
    artifactRef: str(art?.ref),
    artifactBytes: num(art?.byteCount),
    pageCount: num(art?.pageCount),
    sitePlanAppended: typeof art?.sitePlanAppended === "boolean" ? art.sitePlanAppended : null,
    narrativeGrounded: typeof art?.narrativeGrounded === "boolean" ? art.narrativeGrounded : null,
    whoServesMeasured: typeof art?.whoServesMeasured === "boolean" ? art.whoServesMeasured : null,
    narrativeDeterministicSkeleton: typeof art?.narrativeIsDeterministicSkeleton === "boolean" ? art.narrativeIsDeterministicSkeleton : null,
    feasibilitySectionCount: num(art?.feasibilitySectionCount),
    feasibilityOpenItemCount: num(art?.feasibilityOpenItemCount),
    entitlementTier: str(ent?.tier),
    entitlementGranted: typeof ent?.granted === "boolean" ? ent.granted : null,
    gatedSections: Array.isArray(ent?.gatedSections) ? ent.gatedSections : null,
    /** The export's own text, when a route serves JSON rather than a stored binary. */
    pdfText: str(j.text ?? j.pdfText ?? j.renderedText) ?? null,
  };
}

/** How the PDF surface stands for one parcel, as a named state rather than a boolean. */
export function pdfSurfaceState(pdf) {
  if (!pdf?.measured) return { state: "UNREACHED", basis: pdf?.error ?? "the export route did not answer" };
  if (pdf.errorClass) return { state: "FAILED", basis: `the export failed: ${pdf.errorClass} ${pdf.errorMessage ?? ""}`.trim() };
  if (pdf.state && /never-requested/i.test(pdf.state)) return { state: "NOT-BUILT", basis: `the export answers state "${pdf.state}": no PDF has been built for this parcel (the build is the refresh POST P-155 owns), so the surface has nothing to serve yet` };
  if (pdf.artifactPresent) return { state: "SERVED", basis: `state "${pdf.state ?? "-"}", ${pdf.pageCount ?? "?"} pages, ${pdf.artifactBytes ?? "?"} bytes, sitePlanAppended ${pdf.sitePlanAppended ?? "?"}, entitlement ${pdf.entitlementTier ?? "?"}/granted ${pdf.entitlementGranted ?? "?"}` };
  return { state: "UNREACHED", basis: `the export answered state "${pdf.state ?? "-"}" with artifacts [${pdf.artifactKeys.join(",")}] and no pdf-feasibility asset` };
}

/**
 * The MCP leg. smartsite-mcp's inbound gate is OAuth (MEASURED 2026-09-17: `missing_bearer`
 * with no credential and `invalid_oauth_token` with the fleet engine key), so a service Bearer is
 * NOT an inbound token and this instrument does not pretend otherwise. It attempts the initialize
 * ONCE per run, records the gate's own refusal verbatim, and only calls `get_smart_site` when the
 * session actually opened. With no token the whole surface is UNMEASURED — never PASS.
 */
async function runMcpLegs(token, tokenSource, refresher = null) {
  const headers = { accept: "application/json, text/event-stream" };
  if (token) headers.authorization = `Bearer ${token}`;
  const init = await callRaw("POST", `${MCP_BASE}/mcp`, { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: MCP_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: "surface-probe-p347", version: "1" } } }, OPS24_LEG_TIMEOUT_MS, headers);
  const body = parseMcpBody(init.text) ?? (() => { try { return JSON.parse(init.text ?? ""); } catch { return null; } })();
  const gate = str(body?.error?.data?.reason) ?? str(typeof body?.error === "string" ? body.reason : body?.error?.message) ?? str(body?.reason) ?? (init.http ? `http ${init.http}` : init.error);
  const gateMessage = str(typeof body?.error === "string" ? body.message : body?.error?.message) ?? null;
  if (!body || body.error || !body.result) {
    return { measured: false, http: init.http, ms: init.ms, tokenSupplied: !!token, tokenSource: tokenSource ?? null, gateReason: gate, gateMessage, error: `REFUSED by the MCP gate: ${gate}${gateMessage ? ` ("${gateMessage}")` : ""}${token ? "" : " (no token: run with --mcp-sign-in, ruling 9; the engine key is not an OAuth token)"}`, calls: {} };
  }
  // P-347: a Streamable-HTTP session is carried by `mcp-session-id`, and the client must confirm
  // `notifications/initialized` before the server owes it a tool call. The 2026-09-17 version of
  // this leg read the header off an object that never carried headers and skipped the
  // notification, so a token alone would still have measured nothing.
  const session = { token, refresher, refreshes: 0, sessionId: str(init.headers?.get?.("mcp-session-id")), protocolVersion: str(body.result?.protocolVersion) ?? MCP_PROTOCOL_VERSION, tiers: new Set(), tools: {} };
  await callRaw("POST", `${MCP_BASE}/mcp`, { jsonrpc: "2.0", method: "notifications/initialized" }, OPS24_LEG_TIMEOUT_MS, mcpHeaders(session));
  const list = parseMcpBody((await callRaw("POST", `${MCP_BASE}/mcp`, { jsonrpc: "2.0", id: 2, method: "tools/list" }, OPS24_LEG_TIMEOUT_MS, mcpHeaders(session))).text);
  for (const t of list?.result?.tools ?? []) session.tools[t.name] = Object.keys(rec(t.inputSchema)?.properties ?? {});
  // Ruling 9: the tier the run grades at, read off the server's own words. `get_smart_site` does not
  // name it; the screens gate's `upgrade_required` refusal does (smartsite-mcp tool-honesty.ts
  // mapScreensGateNonOk). `list_screens` is a read with no arguments. A tier the server does not name
  // stays unrecorded, never assumed.
  // Measured 2026-09-18 15:58Z: `list_screens` answered 200 for the operator's account without
  // naming a tier, so a second read-only source follows it: the records gate's refusal envelope
  // (`refusePurchasedRecordRead`: status/tier/subscriptionTier/message). Both are reads.
  session.tierProbe = [];
  for (const tool of ["list_screens", "list_purchased_records"]) {
    if (!session.tools[tool] || session.tiers.size) continue;
    const tp = await callRaw("POST", `${MCP_BASE}/mcp`, { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: tool, arguments: {} } }, OPS24_LEG_TIMEOUT_MS, mcpHeaders(session));
    for (const t of tiersIn(tp.text)) session.tiers.add(t);
    session.tierProbe.push({ tool, http: tp.http, named: [...session.tiers] });
  }
  return { measured: true, http: init.http, ms: init.ms, tokenSupplied: true, tokenSource: tokenSource ?? null, serverInfo: body.result?.serverInfo ?? null, protocolVersion: session.protocolVersion, sessionIdPresent: !!session.sessionId, toolArgKeys: session.tools, gateReason: null, gateMessage: null, calls: {}, session };
}

export const MCP_PROTOCOL_VERSION = "2025-06-18";
function mcpHeaders(session) {
  const h = { accept: "application/json, text/event-stream", authorization: `Bearer ${session.token}`, "mcp-protocol-version": session.protocolVersion };
  if (session.sessionId) h["mcp-session-id"] = session.sessionId;
  return h;
}

/** Ruling 9: the tier the run graded at, read off what the server itself says (`subscriptionTier`). */
export function tiersIn(text) {
  return [...new Set([...String(text ?? "").matchAll(/\\?"subscriptionTier\\?"\s*:\s*\\?"([a-z_-]+)\\?"/gi)].map((m) => m[1].toLowerCase()))];
}

/** One MCP tool call on the opened session. The argument key comes from the tool's own schema. */
/** Refresh the access token when it has under a minute left. A failed refresh is recorded on the
 *  session and the next call fails on its own merits: it is never papered over. */
export function needsMcpRefresh(session, now = Date.now()) {
  const r = session?.refresher;
  return !!(r?.refreshToken && r.tokenEndpoint && r.expMs - now <= 60_000);
}
/** Pure: fold a token-endpoint answer into the session. A failed refresh is recorded, never hidden. */
export function applyMcpRefresh(session, j, httpStatus, now = Date.now()) {
  if (!j?.access_token) { session.refreshError = `refresh failed: http ${httpStatus} ${j?.error ?? ""}`.trim(); return false; }
  session.token = j.access_token;
  if (j.refresh_token) session.refresher.refreshToken = j.refresh_token;
  const exp = tokenFacts(j.access_token)?.exp;
  session.refresher.expMs = exp ? Date.parse(exp) : now + (Number(j.expires_in) || 300) * 1000;
  session.refreshes = (session.refreshes ?? 0) + 1;
  return true;
}
export async function ensureFreshMcpToken(session, now = Date.now(), fetchFn = fetch) {
  if (!needsMcpRefresh(session, now)) return false;
  const r = session.refresher;
  const form = new URLSearchParams({ grant_type: "refresh_token", refresh_token: r.refreshToken, client_id: r.clientId, resource: r.resource });
  const res = await fetchFn(r.tokenEndpoint, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form });
  return applyMcpRefresh(session, await res.json().catch(() => null), res.status, now);
}

async function runMcpTool(session, name, candidates, value, extra = {}) {
  await ensureFreshMcpToken(session);
  const keys = session.tools[name];
  if (!keys) return { measured: false, error: `the server lists no ${name} tool (tools: ${Object.keys(session.tools).join(", ") || "none listed"})` };
  const argKey = candidates.find((k) => keys.includes(k));
  if (!argKey) return { measured: false, error: `${name} takes none of ${candidates.join(", ")} (schema keys: ${keys.join(", ")})` };
  const r = await callRaw("POST", `${MCP_BASE}/mcp`, { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name, arguments: { [argKey]: value, ...extra } } }, OPS24_LEG_TIMEOUT_MS, mcpHeaders(session));
  const body = parseMcpBody(r.text);
  if (body?.result) {
    const text = JSON.stringify(body.result);
    for (const t of tiersIn(text)) session.tiers.add(t);
    return { measured: true, http: r.http, ms: r.ms, argKey, payload: body.result, text, isError: body.result.isError === true };
  }
  return { measured: false, http: r.http, ms: r.ms, argKey, error: str(body?.error?.message) ?? (r.error ? `http 0 ${r.error}` : `http ${r.http}`) };
}

/** One `get_smart_site` at node depth. */
async function runMcpCall(id, session) {
  return runMcpTool(session, "get_smart_site", ["node_id", "nodeId", "parcel_node_id", "parcelNodeId"], id);
}

// ------------------------------------------------------------ MCP sign-in (P-347, A-216 ruling 9)
/**
 * The operator signs in per run with the paid Solo test account; the token lives in this process's
 * memory for this run only, and nothing new is stored. The flow is OAuth 2.1 authorization code
 * with PKCE and a loopback redirect, which is the flow an MCP connector uses, with the resource
 * indicator the server's own metadata names (its tokens are audience-checked against it).
 *
 * THE CLIENT IDENTITY IS NOT INVENTED HERE. AuthKit advertises no dynamic registration endpoint,
 * and the server's own WORKOS_CLIENT_ID is not an OAuth application there (measured 2026-09-18:
 * `invalid_client: Application not found`). The client id comes from SURFACE_PROBE_MCP_CLIENT_ID:
 * either a client-ID metadata document URL or a public client registered for the probe. Missing,
 * the helper refuses and says so; it never falls back to another client's identity.
 */
export const MCP_REDIRECT_PORT = Number(process.env.SURFACE_PROBE_MCP_REDIRECT_PORT || 53682);
/**
 * The probe's own public OAuth client (A-218): registered by the operator 2026-09-18 in WorkOS
 * (Connect, production), "Smart Site MCP Probe", PKCE, no secret, redirect
 * http://127.0.0.1:53682/callback. A client id is a public identifier, not a credential; the token
 * it obtains is never stored. SURFACE_PROBE_MCP_CLIENT_ID overrides it.
 */
export const MCP_PROBE_CLIENT_ID = "client_01M2TETZ4K9N2Z48KBJRD46ABF";
/** Standard OIDC scopes from the authorization server's metadata; the server needs only `sub`. */
/** `offline_access` is asked for because AuthKit's access tokens live 5 minutes (measured 2026-09-18:
 *  issued 15:17:50Z, expired 15:22:50Z) and a full run takes longer; the refresh token stays in
 *  memory with the access token and is guarded from the artifact the same way. */
export const MCP_PROBE_SCOPE = process.env.SURFACE_PROBE_MCP_SCOPE || "openid profile email offline_access";
const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export function pkcePair() {
  const verifier = b64url(randomBytes(32));
  return { verifier, challenge: b64url(createHash("sha256").update(verifier).digest()) };
}
/** Ruling 9's write guard: true when a serialized artifact carries the token (or a long run of it). */
export function artifactLeaksToken(text, token) {
  if (!token) return false;
  const t = String(token);
  return String(text).includes(t) || (t.length > 64 && String(text).includes(t.slice(-48)));
}

/** The claims the run records about its own token: never the token, never the subject. */
export function tokenFacts(token) {
  try {
    const c = JSON.parse(Buffer.from(String(token).split(".")[1], "base64url").toString("utf8"));
    return { iss: c.iss ?? null, aud: c.aud ?? null, exp: c.exp ? new Date(c.exp * 1000).toISOString() : null, scope: c.scope ?? null };
  } catch { return null; }
}

async function mcpSignIn() {
  const clientId = (process.env.SURFACE_PROBE_MCP_CLIENT_ID || MCP_PROBE_CLIENT_ID).trim();
  if (!clientId) return { ok: false, error: "no MCP client identity: set SURFACE_PROBE_MCP_CLIENT_ID (a client-ID metadata document URL or a public client registered for the probe). AuthKit has no dynamic registration, and the server's own WORKOS_CLIENT_ID is not an OAuth application there (invalid_client, measured 2026-09-18)" };
  let prm, asm;
  try {
    prm = await (await fetch(`${MCP_BASE}/.well-known/oauth-protected-resource`)).json();
    asm = await (await fetch(`${prm.authorization_servers[0].replace(/\/$/, "")}/.well-known/oauth-authorization-server`)).json();
  } catch (e) {
    return { ok: false, error: `OAuth discovery failed: ${e?.message ?? e}` };
  }
  const { verifier, challenge } = pkcePair();
  const state = b64url(randomBytes(16));
  const redirectUri = `http://127.0.0.1:${MCP_REDIRECT_PORT}/callback`;
  const codeP = new Promise((resolveCode, rejectCode) => {
    const srv = createServer((req, res) => {
      const u = new URL(req.url ?? "/", redirectUri);
      if (u.pathname !== "/callback") { res.writeHead(404).end(); return; }
      const err = u.searchParams.get("error");
      const okState = u.searchParams.get("state") === state;
      res.writeHead(okState && !err ? 200 : 400, { "content-type": "text/plain" }).end(okState && !err ? "Signed in. You can close this tab; the probe continues." : `Sign-in failed: ${err ?? "state mismatch"}`);
      srv.close();
      if (!okState) rejectCode(new Error("state mismatch on the loopback callback"));
      else if (err) rejectCode(new Error(`${err}: ${u.searchParams.get("error_description") ?? ""}`));
      else resolveCode(u.searchParams.get("code"));
    });
    srv.on("error", (e) => rejectCode(new Error(`loopback listener on ${redirectUri} failed: ${e.message}`)));
    srv.listen(MCP_REDIRECT_PORT, "127.0.0.1");
    setTimeout(() => { srv.close(); rejectCode(new Error("no sign-in completed within 5 minutes")); }, 300_000).unref();
  });
  const auth = new URL(asm.authorization_endpoint);
  for (const [k, v] of Object.entries({ response_type: "code", client_id: clientId, redirect_uri: redirectUri, code_challenge: challenge, code_challenge_method: "S256", state, scope: MCP_PROBE_SCOPE, resource: prm.resource })) auth.searchParams.set(k, v);
  console.log(`\nSign in to Smart Site with the paid Solo test account (ruling 9). Open:\n  ${auth}\n`);
  try {
    if (process.platform === "win32") execFileSync("rundll32", ["url.dll,FileProtocolHandler", auth.toString()]);
    else execFileSync(process.platform === "darwin" ? "open" : "xdg-open", [auth.toString()]);
  } catch { /* the URL is printed; opening a browser is a convenience */ }
  let code;
  try { code = await codeP; } catch (e) { return { ok: false, error: e.message }; }
  const form = new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri, client_id: clientId, code_verifier: verifier, resource: prm.resource });
  const tr = await fetch(asm.token_endpoint, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form });
  const tj = await tr.json().catch(() => null);
  if (!tj?.access_token) return { ok: false, error: `token exchange failed: http ${tr.status} ${tj?.error ?? ""} ${tj?.error_description ?? ""}`.trim() };
  const facts = tokenFacts(tj.access_token);
  const audOk = [facts?.aud].flat().includes(prm.resource);
  return { ok: true, token: tj.access_token, obtainedAt: new Date().toISOString(), facts, resource: prm.resource, audienceMatchesResource: audOk, refresher: { refreshToken: tj.refresh_token ?? null, tokenEndpoint: asm.token_endpoint, clientId, resource: prm.resource, expMs: facts?.exp ? Date.parse(facts.exp) : Date.now() + (Number(tj.expires_in) || 300) * 1000 } };
}

/**
 * The map's draw (Ruling B) and the PDF export for one fixture. The route is keyed by the composed
 * address when the record has one, else by the record point. When it has NEITHER — the Williamson
 * fixtures, where XD-7's missing composed address leaves the card with no address at all — the bare
 * situs is tried as the customer's own path, and the answer is accepted ONLY if the route names this
 * parcel (or names none): a bare situs can resolve into a neighbouring county, and drawing the wrong
 * lot would manufacture findings. A route that answers for another parcel is recorded as such.
 */
async function runOps24Legs(subject, opts) {
  const id = subject.id;
  const legs = { ops24: subject, mcp: opts.mcp ?? { measured: false, error: "the MCP leg did not run in this pass" } };
  legs.facets = extractFacets(await call("GET", `${PE_BASE}/api/spine/property-atoms/${encodeURIComponent(id)}/facets`, null, LEG_TIMEOUT_MS.facets));
  const addr = legs.facets.composedAddress;
  const bare = legs.facets.situsAddress;
  const pt = legs.facets.recordPoint;
  const ask = async (label, body) => {
    const r = extractEnvelope(await call("POST", `${CORTEX_PROXY}/brokerage/v1/place/buildable-envelope`, body, LEG_TIMEOUT_MS.envelopeByAddress));
    return { ...r, drawKey: label, answeredFor: r.parcelNodeId ?? null, wrongParcel: !!r.parcelNodeId && r.parcelNodeId !== id };
  };
  if (addr) legs.draw = await ask("composed-address", { address: addr });
  else if (pt) legs.draw = await ask("record-point", { lat: pt.lat, lng: pt.lng });
  if (!legs.draw || legs.draw.wrongParcel || legs.draw.measured === false) {
    const first = legs.draw;
    if (bare && bare !== addr) {
      const retry = await ask("bare-situs", { address: bare });
      // Keep the retry when it either names this parcel or names none and produced something.
      if (!retry.wrongParcel && (retry.measured || !first)) legs.draw = retry;
      else legs.draw = { ...(first ?? retry), rejectedRetry: retry.wrongParcel ? `the bare situs "${bare}" resolved to ${retry.answeredFor}, not ${id}` : `the bare situs "${bare}" also failed (${retry.error ?? "http " + retry.http})` };
    }
  }
  if (!legs.draw) legs.draw = { measured: false, error: "no composed address, no record point and no bare situs: the map has nothing to draw from", drawKey: null };
  legs.pdf = await runPdfLeg(id, opts);
  if (opts.mcp?.measured && opts.mcpSession) legs.mcpCall = await runMcpCall(id, opts.mcpSession);
  return legs;
}

/** P-347 coverage: the retrieval endpoint's answer, as served. */
export function extractCoverageEndpoint(resp) {
  if (!resp || resp.http === 0) return { measured: false, error: resp?.error ?? "the coverage endpoint did not answer" };
  if (resp.http === 401 || resp.http === 403) return { measured: false, http: resp.http, error: `the coverage endpoint refused the key (http ${resp.http})` };
  const j = rec(resp.json);
  if (!j) return { measured: false, http: resp.http, error: `non-JSON body (${String(resp.text ?? "").slice(0, 120)})` };
  return { measured: true, http: resp.http, status: str(j.status), countyFips: str(j.countyFips), countyName: str(j.countyName), state: str(j.state), candidates: Array.isArray(j.candidates) ? j.candidates.length : null, reason: str(j.reason) };
}

/** P-347 coverage: what a search surface told the customer, from a JSON body or an MCP result. */
export function extractSearchCoverage(obj) {
  const j = rec(obj);
  if (!j) return { measured: false, error: "no JSON body" };
  if (str(j.error)) return { measured: false, error: `${j.error}: ${j.message ?? ""}`.trim() };
  const hits = Array.isArray(j.hits) ? j.hits.length : Array.isArray(j.candidates) ? j.candidates.length : null;
  const county = rec(j.outOfCoverageCounty);
  const st = j.outOfCoverageState;
  return { measured: true, hits, missClass: str(j.missClass), countyFips: str(county?.countyFips), countyName: str(county?.countyName), state: str(county?.state) ?? str(rec(st)?.state ?? st), unavailableReason: str(j.coverageCheckUnavailableReason), displayText: str(j.missClassDisplayText) };
}

/** An MCP tool result's JSON: structuredContent first, else the first text block that parses. */
export function mcpResultJson(result) {
  const r = rec(result);
  if (!r) return null;
  if (rec(r.structuredContent)) return r.structuredContent;
  for (const c of Array.isArray(r.content) ? r.content : []) {
    if (c?.type !== "text") continue;
    try { const j = JSON.parse(c.text); if (rec(j)) return j; } catch { /* prose block */ }
  }
  return null;
}

/**
 * Pure. One surface's coverage answer against the subject's expectation. An empty list with no
 * missClass is the P-205 collapse itself (the customer cannot tell "we looked" from "we do not
 * cover this"), so it FAILS for every subject, never passes as a silent no-hit.
 */
export function gradeCoverageSurface(subject, read, surface) {
  if (!read?.measured) return { verdict: "UNMEASURED", basis: `${surface}: ${read?.error ?? "not driven"}` };
  if (read.hits) return { verdict: "UNMEASURED", basis: `${surface}: the search found ${read.hits} hit(s) for "${subject.query}", so no coverage answer was owed; the subject is not a genuine miss` };
  if (!read.missClass) return { verdict: "FAIL", basis: `${surface}: an empty result with no missClass for "${subject.query}"; the customer cannot tell a covered-and-no-match from a county we do not cover (the P-205 collapse)` };
  if (read.missClass !== subject.search) return { verdict: "FAIL", basis: `${surface}: missClass "${read.missClass}" where "${subject.search}" is owed${read.unavailableReason ? ` (${read.unavailableReason})` : ""}` };
  if (subject.countyFips && read.countyFips !== subject.countyFips) return { verdict: "FAIL", basis: `${surface}: names county ${read.countyFips ?? "none"} (${read.countyName ?? "-"}) where ${subject.countyFips} is owed` };
  if (subject.search === "county_out_of_coverage" && (!read.countyName || !read.state)) return { verdict: "FAIL", basis: `${surface}: an uncovered-county answer must name the county and its state; served county "${read.countyName ?? "-"}" state "${read.state ?? "-"}"` };
  return { verdict: "PASS", basis: `${surface}: ${read.missClass}${read.countyName ? ` naming ${read.countyName}, ${read.state}` : ""}` };
}

async function runCoverageLegs(subject, mcpSession) {
  const legs = { coverageSubject: subject };
  const key = (process.env.HAUSKA_ENGINE_API_KEY || "").trim();
  legs.coverageEndpoint = key
    ? extractCoverageEndpoint(await call("GET", `${RETRIEVAL_BASE}/parcel-record-gate-verdict/coverage/check?city=${encodeURIComponent(subject.city)}&state=${subject.state}&zip=${subject.zip}`, null, 30_000, { authorization: `Bearer ${key}` }))
    : { measured: false, error: "HAUSKA_ENGINE_API_KEY is not set; the coverage endpoint needs it" };
  const fb = await call("GET", `${PE_BASE}/api/pe-situs-search?q=${encodeURIComponent(subject.query)}&limit=7`, null, 30_000);
  legs.findBox = fb.json ? { ...extractSearchCoverage(fb.json), http: fb.http } : { measured: false, http: fb.http, error: fb.error ?? "no JSON body" };
  if (mcpSession) {
    const r = await runMcpTool(mcpSession, "find_parcel", ["query", "address", "q", "text"], subject.query);
    legs.mcpFind = r.measured ? { ...extractSearchCoverage(mcpResultJson(r.payload)), http: r.http, argKey: r.argKey } : { measured: false, error: r.error };
  } else {
    legs.mcpFind = { measured: false, error: "no MCP session (run with --mcp-sign-in, ruling 9)" };
  }
  return legs;
}

async function runPdfLeg(id, opts) {
  // P-347: the PDF leg carries the engine key. Without it the route answers 401, and a 401 is a
  // refused read, not a measurement of the PDF surface, so it is named as such rather than being
  // folded into UNREACHED beside a real outage.
  const key = (process.env.HAUSKA_ENGINE_API_KEY || "").trim();
  if (!key) return { measured: false, http: 0, error: "HAUSKA_ENGINE_API_KEY is not set: the PDF leg needs the engine key (P-347), and an unauthenticated read is a 401, not a measurement" };
  const headers = gateFrontHeaders(id.replace(/[^0-9a-zA-Z]/g, "-"), "feasibility-export");
  headers.authorization = `Bearer ${key}`;
  const resp = await call("GET", `${ENGINE_BASE}/v1/property-nodes/${encodeURIComponent(id)}/feasibility-export`, null, OPS24_LEG_TIMEOUT_MS, headers);
  if (resp.http === 401 || resp.http === 403) return { measured: false, http: resp.http, error: `the export refused the engine key (http ${resp.http}): ${str(rec(resp.json)?.error) ?? str(resp.text) ?? "no reason"}` };
  return extractPdfRecord(resp);
}

/**
 * P-347: the probe measures nothing on a host whose CA store Node does not trust (the Windows
 * integration host needs `node --use-system-ca`). Every leg then fails with the same certificate
 * error and the run reads as 45 UNMEASURED buckets, which looks like a surface outage. A preflight
 * names the cause once and refuses the run instead.
 */
export function tlsErrorCode(e) {
  const c = String(e?.cause?.code ?? e?.code ?? "");
  return /CERT|SELF_SIGNED|UNABLE_TO_(GET|VERIFY)|DEPTH_ZERO/.test(c) ? c : null;
}
async function tlsPreflight(bases) {
  const out = [];
  for (const base of bases) {
    try {
      const r = await fetch(base, { method: "HEAD", signal: AbortSignal.timeout(20_000) });
      out.push({ base, ok: true, http: r.status });
    } catch (e) {
      out.push({ base, ok: false, tls: tlsErrorCode(e), error: String(e?.cause?.code ?? e?.message ?? e) });
    }
  }
  return out;
}

// ------------------------------------------------------------------ OPS-24 grading (P-254)
/** How many of the four setback axes the payload actually rules. */
export const ruledAxes = (sb) => (sb ? ["front", "side", "rear", "corner"].filter((k) => sb[k] != null).length : 0);
/** Every customer-facing string on a bucket's legs, labelled with the surface that served it. */
export function surfaceTexts(legs) {
  return [
    ["panel.disclosure", legs.facets?.envelopeDisclosure],
    ["panel.declineReason", legs.facets?.envelopeDeclineReason],
    ["panel.message", legs.facets?.envelopeMessage],
    ["panel.summary", legs.facets?.envelopeSummary],
    ["draw.disclosure", legs.draw?.disclosure],
    ["draw.emptyReason", legs.draw?.emptyReasonText],
    ["draw.message", legs.draw?.message],
    ["draw.declineReason", legs.draw?.declineReason],
    ["mcp.text", mcpClaimText(legs.mcpCall)],
    ["pdf.text", legs.pdf?.pdfText],
  ].filter(([, v]) => !!v);
}

/**
 * The MCP answer's text with its reason-code GLOSSARY removed. Every `get_smart_site` answer ships
 * `smartSiteVocabulary`, a dictionary of every reason token and its display text ("Withheld,
 * setbacks unruled" among them). A dictionary is not a claim about the parcel, and scanning it made
 * every signed-in bucket read "says unruled" (measured 2026-09-18 15:17Z on six Williamson buckets
 * whose real answer was `record_retired`). Only that one key is removed; everything the answer says
 * about the parcel is still scanned.
 */
export function mcpClaimText(call) {
  if (!call?.text) return null;
  const strip = (o) => {
    if (Array.isArray(o)) return o.map(strip);
    if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).filter(([k]) => k !== "smartSiteVocabulary").map(([k, v]) => [k, strip(v)]));
    return o;
  };
  try {
    const payload = JSON.parse(call.text);
    const content = Array.isArray(payload?.content) ? payload.content.map((c) => {
      if (c?.type !== "text") return c;
      try { return { ...c, text: JSON.stringify(strip(JSON.parse(c.text))) }; } catch { return c; }
    }) : payload?.content;
    return JSON.stringify(strip({ ...payload, content }));
  } catch {
    return call.text;
  }
}

/**
 * THE REQUIRED CASE, as two separately-named kinds. The integration seat found a Travis parcel
 * whose own read carries a RULED setback table and whose surface nevertheless tells the customer
 * the envelope path is pending. A contradiction is a surface that names something it is at the
 * same moment serving — so each kind needs BOTH a phrase and the thing the phrase denies.
 *
 *   SAYS-RULES-UNRULED-BESIDE-RULED-TABLE  — the surface calls the setback rules unruled and the
 *     payload rules at least three axes. This is the dispatch's wording, taken literally.
 *   SAYS-GEOMETRY-WITHHELD-BESIDE-DRAWN-GEOMETRY — the surface says the envelope geometry is
 *     withheld or the atom path is pending, and the map's own `place/buildable-envelope` route
 *     returns a polygon for that same parcel. Measured live on 48453:367134: the panel's baked
 *     payload says "depth-warm geometry withheld — warm-verify-decline" while the route the map
 *     draws from answers ok with 7 vertices, so the customer sees a polygon under a sentence
 *     saying there is none.
 *
 * A geometry-only withhold ACCOMPANIED by wording that the outline is drawn for reference is NOT a
 * contradiction and must not be graded as one: that is the honest shape P-249 ships on
 * 48309:103015 and 48209:97658 (outline drawn, figure held back), and flagging it would be a false
 * positive. `saysOutlineDrawn` is what separates the two.
 */
export const RULE_REFUSAL_PHRASES = ["unruled", "no ruled table", "rules pending", "no setback rule", "setback table (unknown)", "setback table unknown"];
export const GEOMETRY_REFUSAL_PHRASES = ["depth-warm geometry withheld", "geometry withheld", "geometry unavailable", "envelope geometry withheld", "atom_path_pending", "atom-path-pending", "no envelope geometry", "geometry pending"];
export const saysOutlineDrawn = (text) => /outline is (?:modelled|modeled|drawn)|drawn for reference|outline is served|outline served/i.test(String(text ?? ""));

/** The rules-only subset, kept as its own name because the dispatch asks for this phrase class. */
export function saysUnruled(legs) {
  const axes = ruledAxes(legs.facets?.setbacks);
  if (axes < RULED_TABLE_MIN_AXES) return [];
  return surfaceTexts(legs).filter(([, text]) => RULE_REFUSAL_PHRASES.some((p) => String(text).toLowerCase().includes(p)));
}

/** The map's draw for whichever leg set was driven: OPS-24 names it `draw`, the standing parcel
 *  set names it `envelopeByAddress`. The defect scan must read both or 48453:367134 — a P-153
 *  subject, not a fixture row — would be skipped. */
const drawOf = (legs) => legs.draw ?? legs.envelopeByAddress ?? null;

/**
 * P-347 (A-215 ruling 13: P-304's rule governs). A buildable-area figure MAY show when a verified
 * envelope atom backs it. The backing is read from a SECOND surface, the draw route's derive path
 * (`+atom-reconciled`), never from the payload that carries the figure: one payload vouching for
 * its own figure is internal consistency, not a check. A draw route that did not answer, or
 * answered for another parcel, leaves the backing UNMEASURED, and an unmeasured backing never
 * admits a figure.
 */
export function figureBacking(legs) {
  const d = drawOf(legs);
  if (!d || d.measured === false) return { state: "unmeasured", why: `the draw route did not answer (${d?.error ?? "no draw leg"}), so whether a verified envelope atom backs the figure is not measured` };
  // A timeout or error body is not an answer about the envelope. Measured 2026-09-18 on 48021:14899:
  // the route returned 504 "upstream aborted after 10000ms" with a JSON body, and reading its absent
  // derivePath as "no reconciled atom" produced a false XD-1 FAIL. Absent evidence is not evidence.
  if (!(d.http >= 200 && d.http < 300)) return { state: "unmeasured", why: `the draw route answered http ${d.http}${d.message ? ` ("${d.message}")` : ""}, so the backing is not measured` };
  if (d.wrongParcel) return { state: "unmeasured", why: `the draw route answered for ${d.answeredFor ?? d.parcelNodeId}, not this parcel` };
  if (d.status && d.status !== "ok") return { state: "unbacked", why: `the draw route declines the envelope (status "${d.status}"), so no envelope atom backs a figure` };
  if (!d.derivePath) return { state: "unmeasured", why: "the draw route answered ok and named no derive path, so the backing is not readable" };
  return d.atomReconciled === true
    ? { state: "backed", why: `derivePath ${d.derivePath} carries a reconciled envelope atom` }
    : { state: "unbacked", why: `derivePath ${d.derivePath} carries no reconciled envelope atom` };
}

/** Pure: the figure on each surface a bucket reads, and whether ruling 13 admits it. */
export function figureVerdict(legs) {
  const fx = legs.facets ?? {};
  const d = drawOf(legs) ?? {};
  const onCard = fx.buildableAreaSqFtInPayload != null || fx.envelopeBuildableAreaPct != null;
  const onDraw = d.buildableAreaSqFtInPayload != null || d.buildableAreaPctInPayload != null;
  if (!onCard && !onDraw) return { verdict: "PASS", present: false, basis: "no buildable-area figure on the panel payload or the draw route" };
  const where = [onCard && `the panel payload (${fx.buildableAreaSqFtInPayload ?? "-"} sqFt / ${fx.envelopeBuildableAreaPct ?? "-"} pct)`, onDraw && `the draw route's feature (${d.buildableAreaSqFtInPayload ?? "-"} sqFt / ${d.buildableAreaPctInPayload ?? "-"} pct)`].filter(Boolean).join(" and ");
  const b = figureBacking(legs);
  if (b.state === "backed") return { verdict: "PASS", present: true, backed: true, basis: `a figure on ${where}, admitted by ruling 13: ${b.why}` };
  if (b.state === "unbacked") return { verdict: "FAIL", present: true, backed: false, basis: `a figure on ${where} with no verified envelope atom behind it: ${b.why}` };
  return { verdict: "UNMEASURED", present: true, backed: null, basis: `a figure on ${where}; ${b.why}` };
}

/** Both kinds of contradiction, each labelled, each requiring the thing the phrase denies. */
export function contradictions(legs) {
  const hits = [];
  const axes = ruledAxes(legs.facets?.setbacks);
  const drew = drawOf(legs)?.geometryPresent === true;
  for (const [where, text] of surfaceTexts(legs)) {
    const low = String(text).toLowerCase();
    if (axes >= RULED_TABLE_MIN_AXES && RULE_REFUSAL_PHRASES.some((p) => low.includes(p))) {
      hits.push({ kind: "SAYS-RULES-UNRULED-BESIDE-RULED-TABLE", where, text: String(text).slice(0, 140) });
    }
    if (drew && !saysOutlineDrawn(text) && GEOMETRY_REFUSAL_PHRASES.some((p) => low.includes(p))) {
      hits.push({ kind: "SAYS-GEOMETRY-WITHHELD-BESIDE-DRAWN-GEOMETRY", where, text: String(text).slice(0, 140) });
    }
  }
  return hits;
}

/**
 * Does the PANEL decline the ENVELOPE? A figure withhold is NOT an envelope decline: on
 * 48309:103015 the panel answers `envelopeStatus: "ok"` with `figureWithheld: true` and a disclosure
 * that says the outline is drawn for reference and only the AREA figure is held back — which is the
 * ruling, not a defect. Treating `figureWithheld` as a decline made the XD-2 check fire on the one
 * parcel that is behaving correctly, so the predicate now needs positive evidence of a decline and
 * the outline-drawn wording is checked first.
 */
export function panelEnvelopeDeclined(legs) {
  const fx = legs.facets ?? {};
  const own = [fx.envelopeDisclosure, fx.envelopeSummary].filter(Boolean).join(" | ");
  if (saysOutlineDrawn(own)) return { declined: false, why: "the panel's own wording says the outline is drawn for reference (only the figure is held back)" };
  const status = str(fx.envelopeStatus);
  if (status && !/^ok$/i.test(status)) return { declined: true, why: `envelopeStatus "${status}"` };
  if (/no outline|outline (?:is )?(?:not|cannot|unavailable)|not drawn|outline withheld/i.test(own)) return { declined: true, why: "the panel's own wording says the outline is not drawn" };
  return { declined: false, why: `no surface states an envelope decline (status "${status ?? "-"}")` };
}

/** XD-2/X5: a panel that declines an envelope its own `place/buildable-envelope` route draws. */
export function panelDeclinesWhatRouteDraws(legs) {
  const d = panelEnvelopeDeclined(legs);
  const draw = drawOf(legs);
  const routeDraws = draw?.status === "ok" && draw?.geometryPresent === true;
  return { hit: !!d.declined && !!routeDraws, declined: d.declined, why: d.why, routeDraws, vertices: draw?.vertexCount ?? null };
}

/**
 * One bucket graded on all three surfaces. `pass` requires every surface that could be reached to
 * agree with the card spec; a surface that could not be reached makes the bucket UNMEASURED, not
 * PASS, and the basis names it. Universal rules run on every bucket; the category rule then runs.
 */
export function gradeOps24Bucket(subject, legs) {
  const f = subject.gradedFixture;
  const label = `${subject.key} ${f ? `${f.category}:${f.id}` : "(no fixture)"}`;
  if (!f) return { verdict: "UNMEASURED", basis: `${subject.key}: the bucket lists no fixture, so there is nothing to grade` };
  const fx = legs.facets ?? {};
  if (fx.measured === false) return { verdict: "UNMEASURED", basis: `${label}: the card payload did not answer (${fx.error ?? "http " + fx.http})` };
  const violations = [];
  const defects = [];
  const unknowns = [];
  const axes = ruledAxes(fx.setbacks);
  const draw = legs.draw ?? {};
  const pdf = legs.pdf ?? {};
  const mcp = legs.mcp ?? {};

  // --- universal, on every bucket. The verdict-bearing list is deliberately SHORT: it carries only
  // the things this lane's own standard forbids on the surface being graded, plus the two required
  // cases. The per-defect classes the plan names (XD-1 figure, XD-8/X2 jurisdiction, XD-11 citation
  // date) are RECORDED here and COUNTED in the open-defect ledger, because folding them into the
  // per-bucket verdict made 25 of 45 buckets fail on XD-11 alone and hid the two required cases.
  // XD-1 under A-215 ruling 13 (P-347): a figure is a violation only when no verified envelope atom
  // backs it, and a figure whose backing cannot be read leaves the bucket ungraded, never passed.
  const fig = figureVerdict(legs);
  if (fig.verdict === "FAIL") violations.push(`XD-1: ${fig.basis}`);
  else if (fig.verdict === "UNMEASURED") unknowns.push(`XD-1 (${fig.basis})`);
  const p2 = panelDeclinesWhatRouteDraws(legs);
  if (p2.hit) violations.push(`XD-2/X5: the panel declines this envelope (${p2.why}) while its own place/buildable-envelope route answers ok with geometry (${draw.vertexCount ?? "?"} vertices)`);
  for (const c of contradictions(legs)) violations.push(`${c.kind} on ${c.where}: "${c.text}"`);
  if (fx.zoningDistrict && !fx.zoningJurisdictionKey && !str(fx.composedAddress)?.includes(",")) defects.push(`XD-8/X2: the payload holds district ${fx.zoningDistrict} and names no jurisdiction (no jurisdictionKey, no composed address to read a city from)`);
  // P-270 (OPS-24 X11). An undated citation is the defect ONLY when it is also
  // undeclared. The declared case is recorded as its own class rather than
  // dropped: DEV-PROCESS says classes are measured, never subtracted, so the
  // population of undated citations must stay visible after the fix — it is the
  // same population, now declaring itself. A future edit that stops declaring
  // moves a subject from `XD-11-declared` back to `XD-11`, which is exactly the
  // direction the revert-and-run proves.
  if (fx.envelopeCitationUrl && !fx.envelopeCitationDate) {
    if (fx.envelopeCitationVintageState && /^unreadable-/.test(fx.envelopeCitationVintageState)) {
      defects.push(`XD-11-declared: the payload cites ${fx.envelopeCitationUrl} with no effective date and DECLARES it (${fx.envelopeCitationVintageState})${fx.citationVintageInDisclosure ? "" : " — but the vintage sentence is missing from the disclosure prose"}`);
    } else {
      defects.push(`XD-11: the payload cites ${fx.envelopeCitationUrl} with no effective date and no declaration; an unreadable vintage is a conflict row, never a silent pick`);
    }
  }
  // The trap, graded directly: if the declaration's own prose ever reads as a
  // date, the instrument's disclosure-text fallback would score a silent pick as
  // dated. Measured rather than trusted.
  if (fx.citationVintageFromDisclosureText) defects.push(`XD-11-self-defeat: the citation vintage declaration's own text parses as a date, so the disclosure-text fallback would grade an undated citation as dated`);
  if (fx.facetCoverage?.zoning === false && fx.zoningDistrict) defects.push(`FACET-COVERAGE: facetCoverage.zoning is false while the payload serves district ${fx.zoningDistrict}`);

  // --- the category rule ---
  let categoryBasis = "";
  if (f.category === "fx_codified") {
    if (draw.measured === false) unknowns.push(`map draw (${draw.error})`);
    else if (draw.status !== "ok" || !draw.geometryPresent) violations.push(`fx_codified: ${f.district ?? "a codified district"} must draw; the route answered ${draw.status ?? "?"} geometryPresent ${draw.geometryPresent}`);
    else if (axes < RULED_TABLE_MIN_AXES) unknowns.push(`the panel rules only ${axes}/4 setback axes`);
    else categoryBasis = `codified ${f.district ?? "-"}: route draws ${draw.vertexCount} vertices, table ${fmtSb(fx.setbacks)}`;
  } else if (f.category === "fx_district_miss" || f.category === "fx_no_table") {
    // XD-5/XD-8/X8: the decline must name the corpus gap, and must never say "no zoning district
    // observed" about a parcel whose own payload holds the district.
    const reason = [fx.envelopeDeclineReason, fx.envelopeDisclosure, draw.declineReason, draw.message, draw.emptyReasonText].filter(Boolean).join(" | ");
    const generic = /no zoning district|no district observed|district not observed/i.test(reason);
    if (fx.zoningDistrict && generic) violations.push(`XD-5/XD-8: the panel declines "${reason.slice(0, 90)}" while its own payload holds district ${fx.zoningDistrict}`);
    else if (!reason) unknowns.push("no decline wording on either surface to grade");
    else categoryBasis = `${f.category} ${f.district ?? fx.zoningDistrict ?? "-"}: typed decline "${reason.slice(0, 80)}"`;
  } else if (f.category === "fx_pud") {
    const reason = [fx.envelopeDeclineReason, fx.envelopeDisclosure, draw.declineReason, draw.message].filter(Boolean).join(" | ");
    if (axes >= RULED_TABLE_MIN_AXES) violations.push(`XD-14/X10: ${f.district ?? "a PUD-coded district"} resolved Euclidean setbacks ${fmtSb(fx.setbacks)} instead of the PUD message`);
    else if (!reason) unknowns.push("no wording on either surface, so whether the PUD class was named is not measured");
    else if (!/planned development|\bPUD\b|\bPDD\b|\bPC\b|\bPD\b/i.test(`${reason} ${f.district ?? ""}`)) unknowns.push(`the reason names neither the planned-development class nor the district (reason: "${reason.slice(0, 90)}")`);
    else categoryBasis = `fx_pud ${f.district ?? "-"}: no Euclidean resolution, reason served "${reason.slice(0, 90)}"`;
  } else if (f.category === "fx_vacant") {
    if (!fx.structuralState && !draw.emptyKind) unknowns.push("neither the structural fact on the payload nor the draw route's emptyKind is readable");
    else categoryBasis = `fx_vacant: structural ${fx.structuralState ?? "-"}, draw emptyKind ${draw.emptyKind ?? "-"}`;
  } else if (f.category === "fx_any") {
    if (!fx.zoningJurisdictionKey && !/not.applicable|unincorporated/i.test(str(fx.envelopeDisclosure) ?? "")) unknowns.push("the jurisdiction is neither named nor declared not-applicable");
    else categoryBasis = `fx_any: jurisdiction ${fx.zoningJurisdictionKey ?? "declared not-applicable"}`;
  }

  // --- the other two surfaces: reach decides whether the bucket is graded or merely measured ---
  // The MCP surface is graded on an actual `get_smart_site` result, never on the session flag: an
  // opened session that never returned a tool result has graded nothing, and must not read as PASS.
  if (mcp.measured !== true) unknowns.push(`MCP surface (${mcp.error ?? "not attempted"})`);
  else if (legs.mcpCall?.measured !== true) unknowns.push(`MCP surface (the session opened and no get_smart_site result came back: ${legs.mcpCall?.error ?? "not attempted"})`);
  // The PDF surface is graded by its own named state: SERVED grades the bucket, NOT-BUILT and
  // UNREACHED leave it ungraded with the reason, and FAILED is a violation rather than a silence.
  const pdfState = pdfSurfaceState(pdf);
  if (pdfState.state === "FAILED") violations.push(`PDF surface: ${pdfState.basis}`);
  else if (pdfState.state !== "SERVED") unknowns.push(`PDF surface (${pdfState.state}): ${pdfState.basis}`);

  const surfaces = {
    map: violations.length ? "FAIL" : unknowns.length ? "PARTIAL" : "PASS",
    mcp: mcp.measured === true ? (legs.mcpCall?.measured ? "PASS" : "PARTIAL") : "UNMEASURED",
    pdf: pdfState.state === "SERVED" ? "PASS" : pdfState.state === "FAILED" ? "FAIL" : pdfState.state,
  };
  const basis = [
    `${label}: ${f.district ? `district ${f.district}, ` : ""}table ${fmtSb(fx.setbacks)} (${axes}/4 axes)`,
    `envelope status "${fx.envelopeStatus ?? "-"}" declineReason "${fx.envelopeDeclineReason ?? "-"}" covered ${fx.envelopeCovered ?? "-"} geometryPresent ${draw.geometryPresent ?? "-"} (${draw.vertexCount ?? "?"} vertices) figure ${fx.buildableAreaSqFtInPayload != null || fx.envelopeBuildableAreaPct != null ? `PRESENT ${fx.buildableAreaSqFtInPayload ?? "-"}/${fx.envelopeBuildableAreaPct ?? "-"}` : "absent"}`,
    categoryBasis,
    `surfaces map ${surfaces.map} mcp ${surfaces.mcp} pdf ${surfaces.pdf}`,
    violations.length ? `VIOLATIONS: ${violations.join("; ")}` : null,
    defects.length ? `defects recorded (counted in the open-defect ledger, not this verdict): ${defects.join("; ")}` : null,
    unknowns.length ? `not graded: ${unknowns.join("; ")}` : null,
  ].filter(Boolean).join(" -- ");
  return { verdict: violations.length ? "FAIL" : unknowns.length ? "UNMEASURED" : "PASS", basis, surfaces, violations, defects, unknowns, envelopeRecord: { status: fx.envelopeStatus ?? null, declineReason: fx.envelopeDeclineReason ?? null, envelopeCovered: fx.envelopeCovered ?? null, geometryPresent: draw.geometryPresent ?? null, vertices: draw.vertexCount ?? null, figureSqFt: fx.buildableAreaSqFtInPayload ?? null, figurePct: fx.envelopeBuildableAreaPct ?? null } };
}

/**
 * The open-defect count the Phase 0 exit reads. A defect is graded only by a grader that exists in
 * this instrument; every other defect is reported UNMEASURED with the row that owns it, never
 * silently counted open or closed. `rows` is the per-defect ledger, `counts` the tally.
 */
export function defectLedger(defects, subjects) {
  const rows = [];
  for (const d of defects) {
    const grader = OPS24_DEFECT_GRADERS[d.gradedBy];
    if (!grader) {
      rows.push({ ...d, verdict: "UNMEASURED", basis: `no grader for "${d.gradedBy ?? "none"}" in scripts/surface-probe.mjs; the defect is graded by ${d.row}, not by this instrument` });
      continue;
    }
    const hits = [];
    let measuredOn = 0;
    for (const s of subjects) {
      const r = grader(s.id, s.legs);
      if (r.verdict === "UNMEASURED") continue;
      measuredOn++;
      if (r.verdict === "FAIL") hits.push({ parcel: s.id, basis: r.basis });
    }
    if (!measuredOn) rows.push({ ...d, verdict: "UNMEASURED", basis: `grader "${d.gradedBy}" ran on ${subjects.length} subjects and measured none of them` });
    else rows.push({ ...d, verdict: hits.length ? "OPEN" : "CLOSED", measuredOn, hits, basis: hits.length ? `${hits.length} of ${measuredOn} measured subjects still show it; first: ${hits[0].parcel} ${hits[0].basis}` : `not seen on any of the ${measuredOn} subjects this grader measured` });
  }
  const counts = rows.reduce((t, r) => ((t[r.verdict] = (t[r.verdict] ?? 0) + 1), t), {});
  return { counts, rows };
}

/** One grader per defect this instrument can actually decide. Absent means UNMEASURED, never OPEN. */
const OPS24_DEFECT_GRADERS = {
  // A-215 ruling 13 (P-347): open only where a figure shows with no verified envelope atom behind it.
  figureLeak: (id, legs) => {
    if (legs.facets?.measured === false) return { verdict: "UNMEASURED", basis: "the card payload did not answer" };
    const v = figureVerdict(legs);
    return { verdict: v.verdict, basis: v.basis };
  },
  p303PanelDraws: (id, legs) => {
    const p2 = panelDeclinesWhatRouteDraws(legs);
    if (!legs.draw?.measured) return { verdict: "UNMEASURED", basis: "the draw route did not answer" };
    return p2.hit ? { verdict: "FAIL", basis: `the panel declines while the route draws ${legs.draw.vertexCount ?? "?"} vertices` } : { verdict: "PASS", basis: `panel declined ${p2.declined}, route drew ${p2.routeDraws}` };
  },
  foreignDeclineWording: (id, legs) => {
    const text = surfaceTexts(legs).map(([, t]) => t).join(" | ");
    if (!text) return { verdict: "UNMEASURED", basis: "no decline wording on any surface" };
    return /layer-23|layer 23/i.test(text)
      ? { verdict: "FAIL", basis: `a surface carries the Bastrop-specific wording: "${text.slice(0, 120)}"` }
      : { verdict: "PASS", basis: "no layer-23 wording" };
  },
  noTableDeclineNamesDistrict: (id, legs) => {
    const district = legs.facets?.zoningDistrict;
    if (!district) return { verdict: "UNMEASURED", basis: "the payload holds no district, so the XD-5 shape cannot arise here" };
    const text = [legs.facets?.envelopeDeclineReason, legs.facets?.envelopeDisclosure, legs.draw?.declineReason, legs.draw?.message].filter(Boolean).join(" | ");
    if (!text) return { verdict: "UNMEASURED", basis: "no decline wording on either surface" };
    return /no zoning district|no district observed|district not observed/i.test(text)
      ? { verdict: "FAIL", basis: `declines "${text.slice(0, 100)}" while holding district ${district}` }
      : { verdict: "PASS", basis: `declines without denying district ${district}` };
  },
  composedAddressAbsent: (id, legs) => {
    const fx = legs.facets ?? {};
    if (fx.measured === false) return { verdict: "UNMEASURED", basis: "the card payload did not answer" };
    if (fx.composedAddress) return { verdict: "PASS", basis: `composed address served (${fx.composedAddress})` };
    if (fx.situsAddress) return { verdict: "FAIL", basis: `situs "${fx.situsAddress}" is on the record and no composed address is served` };
    // No situs. The first draft returned UNMEASURED here ("an absent situs is not evidence"), which
    // made XD-7 structurally blind to the very population it names: the Williamson fixtures serve
    // no situs at all. So distinguish an empty read from an answering read — a payload that serves
    // a district or a setback table is answering ABOUT a parcel, and serving it with no address of
    // any kind is the defect, not an absence of evidence. Measured 2026-09-17: 48491:R483884
    // carries baseFacts {apn R483884, landUse null, acreage null, situsAddress null}, district SF2,
    // a 4/4-axis table, cityLimitsFact.cityName "Round Rock", and no lat/lng anywhere.
    const answering = !!(fx.zoningDistrict || fx.setbacks || fx.zoningJurisdictionKey);
    if (!answering) return { verdict: "UNMEASURED", basis: "the payload carries nothing to be addressed (no district, no table, no jurisdiction), so an absent composed address is not evidence" };
    // Say exactly which of the three the payload lacks. The first draft of this line said "no
    // coordinate" for every case, which was FALSE for the Bastrop parcels: 48021:51735 carries no
    // situs and no composed address but DOES carry a record point (30.10219, -97.30069) and drew 6
    // vertices from it. A grader whose basis overclaims is worse than a vague one, because the
    // close quotes it.
    const lacks = [!fx.situsAddress && "situs", !fx.composedAddress && "composed address", !fx.recordPoint && "coordinate"].filter(Boolean);
    const has = [fx.situsAddress && "a situs", fx.recordPoint && "a coordinate"].filter(Boolean);
    return { verdict: "FAIL", basis: `the payload serves ${fx.zoningDistrict ? `district ${fx.zoningDistrict}` : "a setback table"} with no composed address: absent ${lacks.join(", ")}${has.length ? ` (present: ${has.join(", ")})` : ""}, so the card can show no street address` };
  },
  jurisdictionNamed: (id, legs) => {
    const fx = legs.facets ?? {};
    if (fx.measured === false) return { verdict: "UNMEASURED", basis: "the card payload did not answer" };
    if (!fx.zoningDistrict) return { verdict: "UNMEASURED", basis: "no district on the payload" };
    return fx.zoningJurisdictionKey ? { verdict: "PASS", basis: `jurisdictionKey ${fx.zoningJurisdictionKey}` } : { verdict: "FAIL", basis: `district ${fx.zoningDistrict} with no jurisdiction on the payload` };
  },
  malformedSitusDraws: (id, legs) => {
    const fx = legs.facets ?? {};
    if (fx.measured === false || !fx.situsMalformed) return { verdict: "UNMEASURED", basis: "this subject's situs is not the malformed class" };
    return legs.draw?.geometryPresent ? { verdict: "PASS", basis: `a malformed situs still drew (${legs.draw.vertexCount} vertices)` } : { verdict: "FAIL", basis: `situs "${fx.situsAddress}" and the draw route produced no geometry` };
  },
  citationDatePresent: (id, legs) => {
    const fx = legs.facets ?? {};
    if (!fx.envelopeCitationUrl) return { verdict: "UNMEASURED", basis: "no citation on the payload to date" };
    if (fx.envelopeCitationDate) return { verdict: "PASS", basis: `citation dated ${fx.envelopeCitationDate}` };
    // P-270 (OPS-24 X11): an undated citation is only a DEFECT when it is also
    // undeclared. The date is genuinely unreadable at source here — the ruling
    // forbids inventing one — so a payload that SAYS SO has done what this row
    // requires, and the grader must not keep calling it a silent pick. The
    // declaration is never treated as a date: the PASS basis names the state and
    // says the vintage is unknown.
    if (fx.envelopeCitationVintageState && /^unreadable-/.test(fx.envelopeCitationVintageState)) {
      return {
        verdict: "PASS",
        basis: `citation ${fx.envelopeCitationUrl} served undated and DECLARED (${fx.envelopeCitationVintageState})${fx.citationVintageInDisclosure ? "" : "; WARNING: the row is present but the vintage sentence is NOT in the disclosure prose"}`,
      };
    }
    return { verdict: "FAIL", basis: `citation ${fx.envelopeCitationUrl} with no effective date and no declaration; an unreadable vintage is a conflict row, never a silent pick` };
  },
  dollarReachesAnonymous: (id, legs) => {
    const fx = legs.facets ?? {};
    if (fx.measured === false) return { verdict: "UNMEASURED", basis: "the card payload did not answer" };
    return fx.dollarRailsServed?.length
      ? { verdict: "FAIL", basis: `served ${fx.dollarRailsServed.join(", ")} to an anonymous read` }
      : { verdict: "PASS", basis: "every dollar rail was refused or absent" };
  },
  pudReadsPudMessage: (id, legs) => {
    const fx = legs.facets ?? {};
    const district = fx.zoningDistrict ?? legs.ops24?.district;
    if (!district) return { verdict: "UNMEASURED", basis: "no district on the payload" };
    if (!/^(PUD|PDD|PD|PC)\b/i.test(String(district))) return { verdict: "UNMEASURED", basis: `district ${district} is not PUD-coded` };
    return ruledAxes(fx.setbacks) >= RULED_TABLE_MIN_AXES
      ? { verdict: "FAIL", basis: `${district} resolved Euclidean setbacks ${fmtSb(fx.setbacks)}` }
      : { verdict: "PASS", basis: `${district} did not resolve Euclidean setbacks` };
  },
};

/** Every subject the defect ledger grades: the fixture buckets plus the standing parcel set,
 *  DEDUPED BY PARCEL so one parcel that is both a bucket's graded fixture and a named subject is
 *  counted once. Without the dedupe the ledger's denominators double-count 37 parcels and every
 *  "N of M measured subjects" line in the close would be wrong. */
export function ops24SubjectList(bucketLegs, parcelLegs) {
  const out = [];
  const seen = new Set();
  for (const [key, legs] of Object.entries(bucketLegs)) {
    const id = legs.ops24?.gradedFixture?.id ?? key;
    out.push({ id, key, legs });
    seen.add(id);
  }
  for (const [id, legs] of Object.entries(parcelLegs)) {
    if (seen.has(id)) continue;
    out.push({ id, key: id, legs });
    seen.add(id);
  }
  return out;
}

/** Cross-cutting findings that must never pass silently. Attached to the artifact, not a verdict. */
export function ops24Findings(bucketLegs, parcelLegs) {
  const out = [];
  const seen = new Set();
  const scan = [
    ...Object.entries(bucketLegs).map(([key, legs]) => ({ id: legs.ops24?.gradedFixture?.id ?? key, bucket: key, legs })),
    ...Object.entries(parcelLegs).map(([id, legs]) => ({ id, bucket: null, legs })),
  ].filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)));
  for (const { id, bucket, legs } of scan) {
    const p2 = panelDeclinesWhatRouteDraws(legs);
    if (p2.hit) out.push({ kind: "XD-2/PANEL-DECLINES-ROUTE-DRAWS", parcel: id, bucket, detail: `the panel declines the envelope (${p2.why}) while place/buildable-envelope answers ok with ${p2.vertices ?? "?"} vertices for the same parcel` });
    for (const c of contradictions(legs)) {
      const drew = drawOf(legs)?.geometryPresent === true;
      out.push({
        kind: `REQUIRED-CASE/${c.kind}`,
        parcel: id,
        bucket,
        where: c.where,
        detail: c.kind.startsWith("SAYS-RULES")
          ? `${c.where} says "${c.text}" while the same payload serves a ${ruledAxes(legs.facets?.setbacks)}/4-axis table ${fmtSb(legs.facets?.setbacks)}${drew ? ` and the draw route returns ${drawOf(legs).vertexCount ?? "?"} vertices` : " (the draw route did not answer for this parcel, so only the ruled table is the contradiction)"}`
          : `${c.where} says "${c.text}" while the draw route returns ${drawOf(legs)?.vertexCount ?? "?"} vertices for the same parcel and the payload serves a ${ruledAxes(legs.facets?.setbacks)}/4-axis table ${fmtSb(legs.facets?.setbacks)}`,
      });
    }
    // The strongest address defect the fixture set contains: a card that serves a district and a
    // ruled table but NO address and NO coordinate at all, so nothing can be drawn and no address
    // can be shown. Measured 2026-09-17 on the Williamson fixtures (R483884 and its siblings:
    // baseFacts {apn, landUse null, acreage null, situsAddress null}, no lat/lng anywhere in the
    // payload, facetCoverage honestly declaring landUse:false acreage:false).
    if (legs.facets?.measured && !legs.facets.situsAddress && !legs.facets.composedAddress && !legs.facets.recordPoint && (legs.facets.zoningDistrict || legs.facets.setbacks)) {
      out.push({ kind: "NO-LOCATION-AT-ALL", parcel: id, bucket, detail: `the payload serves ${legs.facets.zoningDistrict ? `district ${legs.facets.zoningDistrict}` : "a setback table"} and carries no situs, no composed address and no coordinate, so the card can show no address and the map has nothing to draw from (XD-6/XD-7 in their strongest form)` });
    }
    // An absence that carries no basis. The card spec's honest-refusal rule and AGENT_CONTRACT
    // section 5 both require a POSITIVE determination to write an absence WITH its basis; the panel
    // does this properly for some fields and not for the street address. Measured 2026-09-17 on
    // 48021:51735: `situsCity` is a full absent-verified object naming its authority (Bastrop County
    // CAD roll as published), its scopeSearched and the declared vintage, while `situsAddress` in the
    // SAME baseFacts object is a bare null with no verdict, no authority and no scope. Two address
    // components, one declared and one silent, in one payload.
    if (legs.facets?.measured && !legs.facets.situsAddress && !legs.facets.situsAddressAbsenceDeclared && (legs.facets.zoningDistrict || legs.facets.setbacks)) {
      const sibling = legs.facets.situsCityAbsenceDeclared
        ? `its sibling situsCity IS declared absent with its basis (verdict "${legs.facets.situsCityAbsenceVerdict}"), so the two address components disagree about whether an absence needs a reason`
        : "no sibling address component declares an absence either";
      out.push({ kind: "SITUS-ABSENT-UNDECLARED", parcel: id, bucket, detail: `the payload serves ${legs.facets.zoningDistrict ? `district ${legs.facets.zoningDistrict}` : "a setback table"} and its situsAddress is absent with no declared absence (a bare null: no verdict, no authority, no scope) while ${sibling} (AGENT_CONTRACT section 5: an empty result is not an absence; only a positive determination writes one, and every absence carries its basis)` });
    }
    const fx = legs.facets;
    // A-215 ruling 13 (P-347): a figure a verified envelope atom backs is admitted, and is not a finding.
    const fig = fx?.measured ? figureVerdict(legs) : null;
    if (fig?.present && fig.verdict !== "PASS") {
      out.push({ kind: fig.verdict === "FAIL" ? "FIGURE-UNBACKED" : "FIGURE-BACKING-UNMEASURED", parcel: id, bucket, leg: "facets", value: fx.buildableAreaSqFtInPayload, detail: `${fig.basis} (XD-1 under ruling 13)` });
    }
    // The dual figure: the zoning table's maxImperviousPct beside the watershed fact's percent.
    if (fx?.panelMaxImperviousPct != null && fx?.imperviousFactPercent != null && fx.panelMaxImperviousPct !== fx.imperviousFactPercent) {
      out.push({ kind: "IMPERVIOUS-DUAL-FIGURE", parcel: id, bucket, detail: `the panel serves maxImperviousPct ${fx.panelMaxImperviousPct} from the zoning table while the watershed fact serves ${fx.imperviousFactPercent} for ${fx.imperviousFactWatershed ?? "an unnamed watershed"}; both can be correct law and a customer reads both as "impervious cover"` });
    }
    if (fx?.measured && fx.imperviousFactState === "refused" && fx.panelMaxImperviousPct == null && !fx.imperviousFactReason) {
      out.push({ kind: "IMPERVIOUS-REFUSED-UNEXPLAINED", parcel: id, bucket, detail: "the impervious fact is refused and neither a watershed percent nor a reason is served, so the customer cannot tell a corpus gap from a parcel that has no limit" });
    }
    // The five-producer setback disagreement, on this lane's own legs: the card's table beside the
    // table the map's draw route resolves for the same parcel in the same pass.
    const draw = drawOf(legs);
    if (fx?.measured && ruledAxes(fx.setbacks) >= RULED_TABLE_MIN_AXES && draw?.measured && ruledAxes(draw.setbacks) >= RULED_TABLE_MIN_AXES) {
      const a = [fx.setbacks.front, fx.setbacks.side, fx.setbacks.rear, fx.setbacks.corner];
      const b = [draw.setbacks.front, draw.setbacks.side, draw.setbacks.rear, draw.setbacks.corner];
      if (JSON.stringify(a) !== JSON.stringify(b)) out.push({ kind: "PANEL-DRAW-TABLE-DISAGREE", parcel: id, bucket, detail: `the card's table ${fmtSb(fx.setbacks)} and the draw route's table ${fmtSb(draw.setbacks)} disagree for the same parcel in the same pass; P-154's class, reported here with its population` });
    }
    // A facet the panel declares it does not cover while the same payload serves a value for it.
    if (fx?.facetCoverage && fx.facetCoverage.zoning === false && fx.zoningDistrict) {
      out.push({ kind: "FACET-COVERAGE-CONTRADICTS-PAYLOAD", parcel: id, bucket, detail: `facetCoverage.zoning is false while the payload serves district ${fx.zoningDistrict}; a renderer told the facet is uncovered will not draw what is there` });
    }
  }
  // The population counts the close reads. Stated as numbers over a stated denominator.
  const pdfStates = scan.map((s) => pdfSurfaceState(s.legs.pdf).state);
  if (scan.length) out.push({ kind: "POPULATION", parcel: `${scan.length} scanned`, bucket: null, detail: `PDF surface: ${["SERVED", "NOT-BUILT", "FAILED", "UNREACHED"].map((k) => `${k} ${pdfStates.filter((x) => x === k).length}`).join(", ")}; figure present ${scan.filter((s) => s.legs.facets?.measured && figureVerdict(s.legs).present).length} (backed ${scan.filter((s) => s.legs.facets?.measured && figureVerdict(s.legs).backed === true).length}, unbacked ${scan.filter((s) => s.legs.facets?.measured && figureVerdict(s.legs).backed === false).length}, backing unmeasured ${scan.filter((s) => s.legs.facets?.measured && figureVerdict(s.legs).present && figureVerdict(s.legs).backed === null).length}); unruled-beside-ruled ${scan.filter((s) => contradictions(s.legs).some((c) => c.kind.startsWith("SAYS-RULES"))).length}; geometry-withheld-beside-drawn ${scan.filter((s) => contradictions(s.legs).some((c) => c.kind.startsWith("SAYS-GEOMETRY"))).length}; panel-draw-table-disagree ${out.filter((f) => f.kind === "PANEL-DRAW-TABLE-DISAGREE").length}; dual-impervious ${out.filter((f) => f.kind === "IMPERVIOUS-DUAL-FIGURE").length}` });
  return out;
}

function loadObservations(path) {
  if (!path) return { obs: null, sha256: null };
  const raw = readFileSync(path, "utf8");
  return { obs: JSON.parse(raw), sha256: createHash("sha256").update(raw).digest("hex") };
}

function docRepoHead() {
  try { return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); } catch { return "UNKNOWN"; }
}

function evaluateRows(legsById, obs, rowFilter, extraLegs = {}) {
  const results = [];
  const lookup = { ...legsById, ...extraLegs };
  for (const [row, def] of Object.entries(ROWS)) {
    if (rowFilter && !rowFilter.includes(row)) continue;
    for (const id of def.parcels) {
      const legs = lookup[id];
      // `optional` rows exist only to grade a leg that a pass may not have driven. Reporting them
      // UNMEASURED on every cheap run would bury the rows that pass did measure, so an undriven
      // optional row emits nothing; a NAMED optional row still reports, because then the missing
      // grade is the answer (P-254: the ungraded bucket count is what the Phase 0 exit reads).
      if (!legs && def.optional && !(rowFilter && rowFilter.includes(row))) continue;
      const r = legs ? def.evaluate(id, legs, obs, rowFilter) : { verdict: "UNMEASURED", basis: "parcel not in this run" };
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

function printReport(results, legsById, ops24 = null) {
  console.log("\nLEGS (measured live unless marked)");
  const absent = (what) => ({ measured: false, error: `no ${what} leg for this subject` });
  for (const [id, legs] of Object.entries(legsById)) {
    const f = legs.facets ?? absent("facets");
    console.log(`  ${id}`);
    console.log(`    facets       ${f.measured ? `http ${f.http} readPath ${f.readPath} bakedAt ${f.bakedAt} zoning ${f.zoningDistrict ?? "-"} envelope ${f.envelopeStatus ?? "-"} setbacks ${fmtSb(f.setbacks)} city ${f.cityLimitsStatus ?? "-"} point ${f.recordPoint ? "yes" : "no"}` : `NOT MEASURED ${f.error}`}`);
    const a = legs.envelopeByAddress ?? absent("envelope-by-address");
    console.log(`    env/address  ${a.measured ? `http ${a.http} status ${a.status} node ${a.parcelNodeId ?? "-"} setbacks ${fmtSb(a.setbacks)} vertices ${a.vertexCount ?? "-"} ${a.ms} ms` : `NOT MEASURED ${a.error ?? "http " + a.http}`}`);
    const p = legs.envelopeByPoint ?? absent("envelope-by-point");
    console.log(`    env/point    ${p.measured ? `http ${p.http} status ${p.status} node ${p.parcelNodeId ?? "-"} ${p.ms} ms` : `NOT MEASURED http ${p.http ?? "-"} ${p.error ?? ""}`}`);
    const g = legs.gisRing ?? absent("gis-ring");
    console.log(`    gis ring     ${g.measured ? `http ${g.http} features ${g.featureCount} matches ${g.matchesParcel}${g.matchedBy ? " by " + g.matchedBy : ""}${g.idSchemeMismatch ? " ID-SCHEME-MISMATCH (" + g.containingFeatureId + ")" : ""}${g.noContainingPolygon ? " NO-CONTAINING-POLYGON (nearest " + (g.nearest ? g.nearest.id + " " + g.nearest.metres + " m" : "none") + ")" : ""}` : `NOT MEASURED ${g.error ?? ""}`}`);
    const n = legs.footprintNear;
    if (n) console.log(`    near-bbox    ${n.measured ? `http ${n.http} count ${n.count ?? "?"}${n.shapeUnknown ? " SHAPE-UNKNOWN keys " + n.keys?.join(",") : ""} ${n.ms} ms` : `NOT MEASURED ${n.error ?? ""}`}`);
    for (const [label, s] of [["situs bare  ", legs.situsSearchBare], ["situs city  ", legs.situsSearchCity]]) {
      if (s) console.log(`    ${label} ${s.measured ? `http ${s.http} ${s.error ? s.error : `hits ${s.hitCount ?? "?"} first ${s.firstParcelNodeId ?? "-"} matches ${s.matchesParcel ?? "?"}`} ${s.ms} ms` : `NOT MEASURED ${s.error ?? ""}`}`);
    }
    const c = legs.cortexNode ?? absent("cortex-node");
    console.log(`    cortex node  ${c.measured ? `http ${c.http} keys ${c.keys?.join(",")}` : `NOT MEASURED ${c.error ?? ""}`}`);
    // P-241: the ETJ acquisition instrument, one live run shared by every ETJ subject.
    const e = legs.etjLive;
    if (e) {
      const sum = e.summary ?? {};
      const cps = Array.isArray(e.controlPoints) ? e.controlPoints : [];
      console.log(`    etj live     ${e.measured ? `register ${e.registerVintage ?? "?"} (${e.registerSize ?? "?"} cities) ${e.publishers?.length ?? "?"} publishers ${sum.ringsAcquired ?? "?"} rings; control points ${cps.map((p) => `${p.key}=${p.actual}${p.verdict ? " " + p.verdict : ""}`).join(", ")}${Array.isArray(sum.predicateGuardFailures) && sum.predicateGuardFailures.length ? " PREDICATE-GUARD-FAILED " + sum.predicateGuardFailures.join(",") : ""}` : `NOT MEASURED ${e.error ?? ""}`}`);
    }
  }
  if (ops24) {
    const grade = (key) => results.find((x) => x.row === "P-254" && x.parcel === key);
    const graded = ops24.subjects.filter((s) => ["PASS", "FAIL"].includes(grade(s.key)?.verdict)).length;
    const ungraded = ops24.subjects.length - graded;
    console.log("\nOPS-24 CUSTOMER LEG (P-254)");
    console.log(`  list ${ops24.path}  sha256 ${ops24.sha256 ? ops24.sha256.slice(0, 12) : "UNREADABLE"}  buckets ${ops24.subjects.length}  fixture slots offered ${ops24.fixtureSlots}  selection ${ops24.selection}`);
    console.log(`  mcp gate: ${ops24.mcp?.measured ? "session opened" : `REFUSED/UNMEASURED -- ${ops24.mcp?.error ?? "not attempted"}`}`);
    for (const s of ops24.subjects) {
      const r = grade(s.key);
      const fixture = s.gradedFixture ? `${s.gradedFixture.category}:${s.gradedFixture.id}` : "(no fixture)";
      console.log(`  ${(r?.verdict ?? "NOT RUN").padEnd(10)} ${s.key.padEnd(26)} ${fixture.padEnd(22)}${r?.surfaces ? ` map ${r.surfaces.map} mcp ${r.surfaces.mcp} pdf ${r.surfaces.pdf}` : ""}${s.ungradedFixtures.length ? `  (+${s.ungradedFixtures.length} ungraded slots)` : ""}`);
    }
    const c = ops24.ledger.counts;
    // "Graded on all three" must mean it: a bucket whose MCP or PDF leg did not run is graded on
    // the surfaces that answered and UNMEASURED on the rest, so say which instead of claiming three.
    const onThree = ops24.subjects.filter((s) => { const v = grade(s.key)?.surfaces; return v && v.map === "MEASURED" && v.mcp === "MEASURED" && v.pdf !== "UNMEASURED"; }).length;
    const mcpMeasured = Object.values(ops24.legsById).filter((l) => l.mcp?.measured).length;
    const pdfMeasured = Object.values(ops24.legsById).filter((l) => l.pdf?.measured).length;
    console.log(`  BUCKETS GRADED PASS/FAIL ${graded}/${ops24.subjects.length}   UNGRADED ${ungraded}`);
    console.log(`  SURFACES MEASURED over ${Object.keys(ops24.legsById).length} subject-parcels: map ${Object.values(ops24.legsById).filter((l) => l.facets?.measured).length}  draw ${Object.values(ops24.legsById).filter((l) => l.draw?.measured).length}  mcp ${mcpMeasured}  pdf ${pdfMeasured}  (a bucket graded on ALL THREE: ${onThree})`);
    if (Object.keys(ops24.violationClasses ?? {}).length) console.log(`  VIOLATION CLASSES (buckets affected): ${Object.entries(ops24.violationClasses).map(([k, v]) => `${k} ${v}`).join(", ")}`);
    if (Object.keys(ops24.defectClasses ?? {}).length) console.log(`  DEFECT CLASSES recorded, not counted in P-254's verdict: ${Object.entries(ops24.defectClasses).map(([k, v]) => `${k} ${v}`).join(", ")}`);
    console.log(`  OPEN DEFECTS ${c.OPEN ?? 0}  closed ${c.CLOSED ?? 0}  unmeasured ${c.UNMEASURED ?? 0}`);
    for (const r of ops24.ledger.rows) console.log(`  ${r.verdict.padEnd(10)} ${String(r.id).padEnd(5)} ${r.defect}  -- ${r.basis}`);
    for (const rc of ops24.requiredCases ?? []) {
      console.log(`\n  REQUIRED CASE ${rc.key} (${rc.subject})`);
      console.log(`    standard: ${rc.standard}`);
      console.log(`    measured: ${JSON.stringify(rc.measuredPanelHalf ?? rc.measured)}`);
      console.log(`    mcp half: ${JSON.stringify(rc.mcpHalf ?? "n/a")}`);
      console.log(`    population: ${JSON.stringify(rc.population)}`);
    }
    if (ops24.findings?.length) {
      console.log("\n  OPS-24 FINDINGS (not a row predicate; never silent)");
      for (const f of ops24.findings) console.log(`    ${f.kind}  ${f.parcel}${f.bucket ? ` (${f.bucket})` : ""}  ${f.detail}`);
    }
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
      footprintNear: { measured: false, error: "fixtures carry no near-bbox leg (read live 2026-09-11: count 0 for both P-158 parcels)" },
      situsSearchBare: f.situsSearchBare ? extractSitusSearch(read(f.situsSearchBare), id) : { measured: false, error: "no fixture" },
      situsSearchCity: f.situsSearchCity ? extractSitusSearch(read(f.situsSearchCity), id) : { measured: false, error: "no fixture" },
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

  // OPS-23 wave 1 rows. Known-bad on the 2026-09-11 fixtures and the day's observations.
  const r157 = ROWS["P-157"].evaluate("48453:113408", legsById["48453:113408"], obs);
  check("P-157 fails on the 2026-09-11 state of 48453:113408 (structural absent-verified)", r157.verdict === "FAIL", r157.basis);
  const r158 = ROWS["P-158"].evaluate("48021:34049", legsById["48021:34049"], obs);
  check("P-158 fails on the 2026-09-11 state of 48021:34049 (footprint absent)", r158.verdict === "FAIL", r158.basis);
  const r159 = ROWS["P-159"].evaluate("48021:34049", legsById["48021:34049"], obs);
  check("P-159 fails on the 2026-09-11 PDF observation (two figures, empty-lot narrative)", r159.verdict === "FAIL", r159.basis);
  check("P-155 FAILS on an observed 503 refresh", ROWS["P-155"].evaluate("48453:474034", good, { "48453:474034": { feasibilityRefreshHttp: 503, feasibilityMcpPdf: false, feasibilityAppPdfWithoutRetry: false } }).verdict === "FAIL");
  check("P-155 is UNMEASURED with no observation (never PASS by default)", ROWS["P-155"].evaluate("48453:474034", good, {}).verdict === "UNMEASURED");
  const vocabOk = { parityLockDeleted: true, packageVersion: "1.33.0", importers: ["hauska-map", "hauska-engine", "legacy-design-tools"] };
  check("P-167 FAILS when a string differs on one surface", ROWS["P-167"].evaluate("48021:34049", good, { "48021:34049": { displayStringsIdentical: false }, _vocab: vocabOk }).verdict === "FAIL");
  check("P-167 FAILS when a parity lock survives", ROWS["P-167"].evaluate("48021:34049", good, { "48021:34049": { displayStringsIdentical: true }, _vocab: { ...vocabOk, parityLockDeleted: false } }).verdict === "FAIL");
  check("P-167 is UNMEASURED when a consumer has not imported", ROWS["P-167"].evaluate("48021:34049", good, { "48021:34049": { displayStringsIdentical: true }, _vocab: { ...vocabOk, importers: ["hauska-map"] } }).verdict === "UNMEASURED");
  // Good world for the wave rows, so each predicate can succeed.
  const goodWave = { ...good, facets: { ...good.facets, structuralState: "present", structuralLivingArea: 1800, structuralYearBuilt: 1906, footprintState: "present" }, footprintNear: { measured: true, http: 200, ms: 500, count: 2, returned: 2 } };
  const goodWaveObs = {
    "48453:474034": { feasibilityRefreshHttp: 202, feasibilityMcpPdf: true, feasibilityAppPdfWithoutRetry: true },
    "48021:34049": { pdfBuildableFigures: [], pdfPercentWithoutAtom: false, pdfSheet2ClaimsEmptyLot: false, displayStringsIdentical: true },
    _vocab: vocabOk,
  };
  check("P-155 can PASS on a good world", ROWS["P-155"].evaluate("48453:474034", goodWave, goodWaveObs).verdict === "PASS");
  check("P-157 can PASS on a good world", ROWS["P-157"].evaluate("48453:113408", goodWave, goodWaveObs).verdict === "PASS");
  check("P-157 FAILS when present but year built is null", ROWS["P-157"].evaluate("48453:113408", { ...goodWave, facets: { ...goodWave.facets, structuralYearBuilt: null } }, goodWaveObs).verdict === "FAIL");
  check("P-158 can PASS on a good world", ROWS["P-158"].evaluate("48021:34049", goodWave, goodWaveObs).verdict === "PASS");
  check("P-158 FAILS when near-bbox returns nothing around a present footprint", ROWS["P-158"].evaluate("48021:34049", { ...goodWave, footprintNear: { measured: true, http: 200, ms: 500, count: 0, returned: 0 } }, goodWaveObs).verdict === "FAIL");
  check("P-158 is UNMEASURED on an unrecognised near-bbox shape (never counted as zero)", ROWS["P-158"].evaluate("48021:34049", { ...goodWave, footprintNear: extractFootprintNear({ http: 200, ms: 1, json: { items: [] } }) }, goodWaveObs).verdict === "UNMEASURED");
  check("P-159 can PASS on a good world (no figure, no percent, no empty-lot claim)", ROWS["P-159"].evaluate("48021:34049", goodWave, goodWaveObs).verdict === "PASS");
  check("P-159 can PASS with exactly one figure", ROWS["P-159"].evaluate("48021:34049", goodWave, { ...goodWaveObs, "48021:34049": { ...goodWaveObs["48021:34049"], pdfBuildableFigures: [16386, 16386] } }).verdict === "PASS");
  check("P-167 can PASS on a good world", ROWS["P-167"].evaluate("48021:34049", goodWave, goodWaveObs).verdict === "PASS");

  // OPS-23 wave 2 rows (2026-09-12).
  check("P-152 FAILS when readPath is not the reader's, even with agreeing setbacks", ROWS["P-152"].evaluate("48021:34049", { ...good, facets: { ...good.facets, readPath: "atom-chain-warm" } }, goodObs).verdict === "FAIL");
  const r172 = ROWS["P-172"].evaluate("48453:113408", legsById["48453:113408"], obs);
  check("P-172 fails on the 2026-09-12 state of 48453:113408 (bare form 502, city form no hits)", r172.verdict === "FAIL", r172.basis);
  const goodWave2 = { ...goodWave, situsSearchBare: { measured: true, http: 200, ms: 300, hitCount: 1, firstParcelNodeId: "48453:113408", matchesParcel: true }, situsSearchCity: { measured: true, http: 200, ms: 300, hitCount: 1, firstParcelNodeId: "48453:113408", matchesParcel: true } };
  const goodWave2Obs = { "48453:113408": { findBoxResolves: true, resolvedVia: "situs", jobsListed: ["factory-cad-ingest", "factory-footprint-writer"], stagingDryRunRecords: ["run-1", "run-2"], laptopApplyRefused: true }, "48021:34049": { outcome: "a", recordRef: "exec-123" } };
  check("P-172 can PASS on a good world", ROWS["P-172"].evaluate("48453:113408", goodWave2, goodWave2Obs).verdict === "PASS");
  check("P-172 FAILS when the Find box resolved through the geocoder", ROWS["P-172"].evaluate("48453:113408", goodWave2, { "48453:113408": { ...goodWave2Obs["48453:113408"], resolvedVia: "geocoded" } }).verdict === "FAIL");
  check("P-172 is UNMEASURED when the legs pass but nobody observed the Find box", ROWS["P-172"].evaluate("48453:113408", goodWave2, {}).verdict === "UNMEASURED");
  check("P-169 can PASS on a good world", ROWS["P-169"].evaluate("48453:113408", goodWave2, goodWave2Obs).verdict === "PASS");
  check("P-169 FAILS when only one job is listed", ROWS["P-169"].evaluate("48453:113408", goodWave2, { "48453:113408": { ...goodWave2Obs["48453:113408"], jobsListed: ["factory-cad-ingest"] } }).verdict === "FAIL");
  check("P-169 FAILS when a laptop apply was not refused", ROWS["P-169"].evaluate("48453:113408", goodWave2, { "48453:113408": { ...goodWave2Obs["48453:113408"], laptopApplyRefused: false } }).verdict === "FAIL");
  check("P-171 can PASS on outcome a with a record", ROWS["P-171"].evaluate("48021:34049", goodWave2, goodWave2Obs).verdict === "PASS");
  check("P-171 FAILS on outcome c (not attributable)", ROWS["P-171"].evaluate("48021:34049", goodWave2, { "48021:34049": { outcome: "c" } }).verdict === "FAIL");
  check("P-171 is UNMEASURED on outcome a with no record reference", ROWS["P-171"].evaluate("48021:34049", goodWave2, { "48021:34049": { outcome: "a" } }).verdict === "UNMEASURED");

  // OPS-23 wave 3 rows (2026-09-12).
  const r154 = ROWS["P-154"].evaluate("48021:34049", legsById["48021:34049"], obs);
  check("P-154 fails on the 2026-09-11 state of 48021:34049 (panel 25/5/25/15 vs endpoint and MCP 30/10/30/20)", r154.verdict === "FAIL", r154.basis);
  const sb = { front: 30, side: 10, rear: 30, corner: 20 };
  const good154 = { ...good, facets: { ...good.facets, setbacks: sb }, envelopeByAddress: { ...good.envelopeByAddress, setbacks: sb } };
  const obs154 = { "48021:34049": { mcpSetbacks: sb, pdfSetbacks: sb, setbackSourceDate: "2026-04-14" } };
  check("P-154 can PASS when all four producers agree and carry a date", ROWS["P-154"].evaluate("48021:34049", good154, obs154).verdict === "PASS");
  check("P-154 is UNMEASURED without a source date", ROWS["P-154"].evaluate("48021:34049", good154, { "48021:34049": { mcpSetbacks: sb, pdfSetbacks: sb } }).verdict === "UNMEASURED");
  check("P-154 FAILS when the PDF disagrees", ROWS["P-154"].evaluate("48021:34049", good154, { "48021:34049": { ...obs154["48021:34049"], pdfSetbacks: { front: 25, side: 5, rear: 25, corner: 15 } } }).verdict === "FAIL");
  check("P-154 can PASS on a declared conflict row (no silent pick)", ROWS["P-154"].evaluate("48021:34049", good, { "48021:34049": { mcpSetbacks: sb, conflictRow: true } }).verdict === "PASS");
  check("P-173 can PASS with both legs and a run id", ROWS["P-173"].evaluate("48021:34049", good, { "48021:34049": { leaseHistoryRowSurvivesRelease: true, auditReturnsByRunId: true, runId: "bfoot-apply-48021-x" } }).verdict === "PASS");
  check("P-173 FAILS when the row does not survive release", ROWS["P-173"].evaluate("48021:34049", good, { "48021:34049": { leaseHistoryRowSurvivesRelease: false, auditReturnsByRunId: true, runId: "x" } }).verdict === "FAIL");
  check("P-173 is UNMEASURED without a run id", ROWS["P-173"].evaluate("48021:34049", good, { "48021:34049": { leaseHistoryRowSurvivesRelease: true, auditReturnsByRunId: true } }).verdict === "UNMEASURED");
  check("P-174 FAILS on the 2026-09-12 operator observation (search-landed: no setbacks; click: setbacks)", ROWS["P-174"].evaluate("48021:34049", good, { "48021:34049": { searchLandedSetbacksShown: false, clickSetbacksShown: true } }).verdict === "FAIL");
  check("P-174 can PASS when both paths show setbacks", ROWS["P-174"].evaluate("48021:34049", good, { "48021:34049": { searchLandedSetbacksShown: true, clickSetbacksShown: true } }).verdict === "PASS");
  check("P-174 is UNMEASURED with only the click observed", ROWS["P-174"].evaluate("48021:34049", good, { "48021:34049": { clickSetbacksShown: true } }).verdict === "UNMEASURED");
  // P-175, from the 2026-09-12 production reads: 629 resolves to a chimera; 615 resolves to nothing.
  const k629 = "48209:addr:629-sturgeon", k615 = "48209:addr:615-sturgeon";
  const hit629 = { measured: true, http: 200, ms: 400, hitCount: 1, firstParcelNodeId: "48209:97658", matchesParcel: false };
  // The PE facets path carries no query point for Hays (read live 2026-09-12), so recordPoint is null in every live case.
  const chimera = { measured: true, http: 200, composedAddress: "13669 MESA VERDE DR, AUSTIN, TX 78737", recordPoint: null, floodState: "present", floodZone: "AO" };
  const fixed629 = { measured: true, http: 200, composedAddress: "629 STURGEON DR, SAN MARCOS, TX 78666", recordPoint: null, floodState: "present", floodZone: "AO" };
  const ringLot = { measured: true, http: 200, featureCount: 12, matchesParcel: true, matchedBy: "point", containingFeatureId: "97658", noContainingPolygon: false, nearest: null };
  const ringOther = { ...ringLot, containingFeatureId: "128076" };
  const hit84639 = { ...hit629, firstParcelNodeId: "48209:84639" };
  check("P-175 FAILS on the 2026-09-12 chimera (the lot's polygon, Mesa Verde label)", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit629, facets: chimera, gisRing: ringLot }, null).verdict === "FAIL");
  check("P-175 FAILS when the address is located but unbound (an address-point hit with no node id)", ROWS["P-175"].evaluate(k615, { situsSearchCity: { measured: true, http: 200, hitCount: 1, firstParcelNodeId: null }, facets: { measured: false } }, null).verdict === "FAIL");
  check("P-175 PASSES when the CAD-account node carries the lot's label, the county polygon at the point is the lot, and flood is present", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: fixed629, gisRing: ringLot }, null).verdict === "PASS");
  check("P-175 PASSES on a numberless roll situs when the search hit carried the number (A-147 label leg)", ROWS["P-175"].evaluate(k615, { situsSearchCity: { measured: true, http: 200, hitCount: 1, firstParcelNodeId: "48209:97651", firstSitusAddress: "615 STURGEON DR, San Marcos, TX, 78666" }, facets: { ...fixed629, composedAddress: "STURGEON DR, SAN MARCOS, TX 78666" }, gisRing: { ...ringLot, containingFeatureId: "97651" } }, null).verdict === "PASS");
  check("P-175 FAILS on a numberless label when the search hit carried no number either", ROWS["P-175"].evaluate(k615, { situsSearchCity: { measured: true, http: 200, hitCount: 1, firstParcelNodeId: "48209:97651", firstSitusAddress: "STURGEON DR" }, facets: { ...fixed629, composedAddress: "STURGEON DR, SAN MARCOS, TX 78666" }, gisRing: { ...ringLot, containingFeatureId: "97651" } }, null).verdict === "FAIL");
  check("P-175 PASSES on the TxGIO-id node too when its label is the lot's (either published identifier is the lot)", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit629, facets: fixed629, gisRing: ringLot }, null).verdict === "PASS");
  check("P-175 FAILS when the search resolves to a node that is none of the lot's identifiers", ROWS["P-175"].evaluate(k629, { situsSearchCity: { ...hit629, firstParcelNodeId: "48209:128076" }, facets: fixed629, gisRing: ringLot }, null).verdict === "FAIL");
  check("P-175 FAILS when the county layer names another parcel at the address point", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: fixed629, gisRing: ringOther }, null).verdict === "FAIL");
  check("P-175 FAILS when the right node has no flood fact", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: { ...fixed629, floodState: "absent", floodZone: null }, gisRing: ringLot }, null).verdict === "FAIL");
  check("P-175 FAILS when a record point is present but 35 miles away", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: { ...fixed629, recordPoint: { lat: 30.18232, lng: -97.97703 } }, gisRing: ringLot }, null).verdict === "FAIL");
  check("P-175 is UNMEASURED when the situs leg did not run", ROWS["P-175"].evaluate(k629, { facets: fixed629, gisRing: ringLot }, null).verdict === "UNMEASURED");
  check("P-175 is UNMEASURED when neither an anchor nor a containing polygon was readable", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: fixed629, gisRing: { measured: false } }, null).verdict === "UNMEASURED");
  check("P-175 is UNMEASURED on a hole in the county layer with no anchor", ROWS["P-175"].evaluate(k629, { situsSearchCity: hit84639, facets: fixed629, gisRing: { ...ringLot, containingFeatureId: null, noContainingPolygon: true, nearest: { id: "97657", metres: 9 } } }, null).verdict === "UNMEASURED");
  check("haversine: the Mesa Verde anchor is about 56 km from the Sturgeon point", Math.abs(haversineM({ lat: 30.18232, lng: -97.97703 }, { lat: 29.87188, lng: -97.92588 }) - 34900) < 2000);

  // P-241, the ETJ acquisition path. The leg is a live subprocess, so the self-test supplies a
  // document shaped exactly as extractEtjInstrument reads it and proves the row in both
  // directions: it passes the four pre-registered answers, and it refuses a document that
  // collapses the two unresolved subjects into one string or drops a publisher guard.
  const etjDoc = {
    measured: true,
    registerVintage: "selftest",
    registerSize: 23,
    summary: { publishersWithRings: 20, publishersEnumeratedWithoutRings: 3, ringsAcquired: 355, controlPointsPassed: 4, controlPointsFailed: 0, predicateGuardFailures: [] },
    publishers: [
      ...Array.from({ length: 20 }, (_, i) => ({ kind: "publisher", cityKey: `selftest-${i}-tx`, hasEtjRings: true, predicateGuard: "ok" })),
      ...Array.from({ length: 3 }, (_, i) => ({ kind: "publisher", cityKey: `selftest-only-${i}-tx`, hasEtjRings: false })),
    ],
    controlPoints: ETJ_SUBJECTS.map((s) => ({
      key: s.controlPointKey,
      preRegistered: s.expect,
      actual: s.expect,
      actualCityKey: s.expectCityKey,
      ringLabel: s.expect === "present" ? "AUSTIN 2 MILE ETJ" : null,
      sourceCitation: s.expect === "present" ? "https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_jurisdictions/FeatureServer/0" : null,
      basis:
        s.expect === "present"
          ? 'point-in-polygon against tx_etj_boundary etj_id=austin-tx:22 (Austin: "AUSTIN 2 MILE ETJ", ring 22)'
          : s.expect === "absent"
            ? "no published ETJ ring contains it, so ETJ is verified absent here"
            : s.controlPointKey === "round-rock-city-limits-only"
              ? "no source to check: Round Rock is enumerated in the ETJ register as mode=city_limits_only. This is a checked absence of a SOURCE, not a confirmed absence of ETJ"
              : "no source to check: Houston is not in the ETJ register at all; this is a checked absence of a SOURCE, not a confirmed absence of ETJ",
      verdict: "PASS",
    })),
  };
  const etjLeg = (doc) => ({ etjLive: doc });
  const etjAll = (doc) => ETJ_SUBJECTS.every((s) => ROWS["P-241"].evaluate(s.key, etjLeg(doc), {}).verdict === "PASS");
  check("P-241 PASSES on the four pre-registered answers", etjAll(etjDoc), ROWS["P-241"].evaluate(ETJ_SUBJECTS[0].key, etjLeg(etjDoc), {}).basis);
  check("P-241 FAILS when the present subject stops citing a source", ROWS["P-241"].evaluate(ETJ_SUBJECTS[0].key, etjLeg({ ...etjDoc, controlPoints: etjDoc.controlPoints.map((c) => (c.key === "austin-2mile-etj" ? { ...c, sourceCitation: null } : c)) }), {}).verdict === "FAIL");
  check("P-241 FAILS when the inside-city-limits subject is called present", ROWS["P-241"].evaluate(ETJ_SUBJECTS[1].key, etjLeg({ ...etjDoc, controlPoints: etjDoc.controlPoints.map((c) => (c.key === "austin-city-limits" ? { ...c, actual: "present" } : c)) }), {}).verdict === "FAIL");
  check("P-241 FAILS when a generic unresolved replaces the city-limits-only distinction", ROWS["P-241"].evaluate(ETJ_SUBJECTS[2].key, etjLeg({ ...etjDoc, controlPoints: etjDoc.controlPoints.map((c) => (c.key === "round-rock-city-limits-only" ? { ...c, basis: "no source covers this point" } : c)) }), {}).verdict === "FAIL");
  check("P-241 FAILS when a publisher's predicate guard fails", etjAll({ ...etjDoc, summary: { ...etjDoc.summary, predicateGuardFailures: ["austin-tx"] } }) === false);
  check("P-241 FAILS when the instrument drops a control point", ROWS["P-241"].evaluate(ETJ_SUBJECTS[0].key, etjLeg({ ...etjDoc, controlPoints: etjDoc.controlPoints.filter((c) => c.key !== "austin-2mile-etj") }), {}).verdict === "FAIL");
  check("P-241 FAILS when the summary claims publishers its list does not carry", ROWS["P-241"].evaluate(ETJ_SUBJECTS[0].key, etjLeg({ ...etjDoc, publishers: etjDoc.publishers.slice(0, 19) }), {}).verdict === "FAIL");
  check("P-241 is UNMEASURED when the instrument leg did not run", ROWS["P-241"].evaluate(ETJ_SUBJECTS[0].key, { etjLive: { measured: false, error: "REFUSED: no checkout" } }, {}).verdict === "UNMEASURED");
  check("extractEtjInstrument refuses a non-document and tolerates a wrapper line", extractEtjInstrument("pnpm: nothing\n").measured === false && extractEtjInstrument("noise\n" + JSON.stringify(etjDoc) + "\n").measured === true);

  // ---------------------------------------------------------------- OPS-24 customer leg (P-254)
  // Instrument integrity: the fixture list this file grades MUST be the committed copy the close
  // names. A drift here would make every bucket count in the artifact unreproducible.
  check(`the committed OPS-24 fixture list carries ${OPS24_BUCKET_COUNT} buckets`, OPS24_BUCKETS.length === OPS24_BUCKET_COUNT, `read ${OPS24_BUCKETS.length}`);
  check("the OPS-24 fixture list sha256 matches the value the artifact records", OPS24_LIST_SHA256 === OPS24_FIXTURE_LIST_SHA256, `${OPS24_LIST_SHA256}`);
  check("every OPS-24 bucket offers at least one fixture to grade", OPS24_BUCKETS.length > 0 && OPS24_BUCKETS.every((b) => b.fixtures.length > 0), `slots ${OPS24_FIXTURE_SLOTS}`);
  check("the selection rule picks one fixture per bucket and names the rest ungraded", OPS24_SUBJECTS.every((s) => s.chosen.length === 1 && s.ungradedFixtures.length === s.offered - 1));

  // The required case: a ruled table called "unruled" is caught; the honest outline-drawn shape is not.
  const ruledFacets = { measured: true, http: 200, setbacks: { front: 25, side: 5, rear: 10, corner: 15 } };
  check("the required-case check FIRES on a ruled table called unruled", contradictions({ facets: { ...ruledFacets, envelopeSummary: "setback rules unruled for this parcel" }, draw: { geometryPresent: true } }).some((c) => c.kind.startsWith("SAYS-RULES")));
  check("the required-case check FIRES on geometry called withheld while its own route draws", contradictions({ facets: { ...ruledFacets, envelopeDisclosure: "depth-warm geometry withheld — warm-verify-decline" }, draw: { geometryPresent: true, vertexCount: 7 } }).some((c) => c.kind.startsWith("SAYS-GEOMETRY")));
  check("the required-case check FIRES on an atom_path_pending statement beside a drawn polygon", contradictions({ facets: { ...ruledFacets, envelopeSummary: "geometry unavailable: atom_path_pending" }, draw: { geometryPresent: true, vertexCount: 7 } }).some((c) => c.kind.startsWith("SAYS-GEOMETRY")));
  check("the required-case check does NOT fire on a geometry withhold when the route cannot draw either", contradictions({ facets: { ...ruledFacets, envelopeDisclosure: "depth-warm geometry withheld" }, draw: { geometryPresent: false } }).length === 0);
  check("the required-case check does NOT fire on the honest outline-drawn, figure-withheld shape", contradictions({ facets: { ...ruledFacets, envelopeFigureWithheld: true, envelopeDisclosure: "The envelope outline is modelled from the setback table on record and drawn for reference; the area figure stays withheld until a verified atom backs it." }, draw: { geometryPresent: true, vertexCount: 246 } }).length === 0);
  check("saysUnruled stays the rules-only subset, with no false positive on a geometry withhold", saysUnruled({ facets: { ...ruledFacets, envelopeDisclosure: "depth-warm geometry withheld" } }).length === 0);
  check("saysUnruled does not fire when the table is not ruled", saysUnruled({ facets: { measured: true, setbacks: { front: 25, side: null, rear: null, corner: null }, envelopeSummary: "setback rules unruled" } }).length === 0);
  const declinedOn103015 = panelEnvelopeDeclined({ facets: { envelopeStatus: "ok", envelopeFigureWithheld: true, envelopeDisclosure: "The envelope outline is modelled from the setback table on record and drawn for reference; the area figure stays withheld until a verified atom backs it." } });
  check("a figure withhold beside an outline-drawn disclosure is NOT an envelope decline (the 48309:103015 shape)", declinedOn103015.declined === false, declinedOn103015.why);
  const dateFacets = extractFacets({ http: 200, json: { facets: { envelope: { citationUrl: "https://x", disclosure: "parcel_record setback rule effective 2026-04-14." } } } });
  check("XD-11 reads a citation's effective date out of the disclosure prose", dateFacets.envelopeCitationDate === "2026-04-14" && dateFacets.envelopeCitationDateFrom === "disclosure-text", `${dateFacets.envelopeCitationDate}/${dateFacets.envelopeCitationDateFrom}`);
  check("a citation with no date anywhere still reads undated", extractFacets({ http: 200, json: { facets: { envelope: { citationUrl: "https://x", disclosure: "no vintage stated" } } } }).envelopeCitationDate === null);

  // --- P-270 (OPS-24 X11): the DECLARATION, and that the instrument can still fire without it.
  // The instrument change this lane hands back is only trustworthy if its new PASS branch is
  // reachable AND its FAIL branch is still reachable. Both directions are asserted here, against
  // the real grader (`gradeOps24Bucket`, the function the P-254 row runs) rather than against a
  // copy of its logic — a check that re-implements the rule cannot catch the rule regressing.
  const VINTAGE_ROW = {
    kind: "setback-citation-vintage-unreadable",
    state: "unreadable-absent-at-source",
    sourceLabel: "codified setback table pflugerville-tx (City of Pflugerville)",
    citationUrl: "https://x/udc",
    note: "Setback rule vintage unknown — the rule is served undated, not as current. Verify with the city.",
  };
  const declaredFacets = extractFacets({
    http: 200,
    json: {
      facets: {
        envelope: {
          citationUrl: "https://x/udc",
          disclosure: `Estimated buildable area. ${VINTAGE_ROW.note}`,
          citationVintage: VINTAGE_ROW,
        },
      },
    },
  });
  // A minimal subject so the grader's defect ledger can be read on its own. `fx_codified` will add
  // its own VIOLATIONS about drawing — those are a different list and are not what is asserted.
  const XD11_SUBJECT = {
    key: "selftest|xd11",
    county: "selftest",
    city: "xd11",
    fixtures: [],
    gradedFixture: { category: "fx_codified", id: "selftest:1", district: "SF-S" },
    chosen: [],
    offered: 1,
    ungradedFixtures: [],
  };
  const undeclaredFacets = {
    ...declaredFacets,
    envelopeCitationVintage: null,
    envelopeCitationVintageState: null,
    citationVintageInDisclosure: false,
  };
  const undeclaredDefects = gradeOps24Bucket(XD11_SUBJECT, { facets: undeclaredFacets }).defects;
  const declaredDefects = gradeOps24Bucket(XD11_SUBJECT, { facets: declaredFacets }).defects;

  check("XD-11 reads the declaration's state off the payload", declaredFacets.envelopeCitationVintageState === "unreadable-absent-at-source", `${declaredFacets.envelopeCitationVintageState}`);
  check("XD-11 reads the declaration's sentence off the payload", declaredFacets.envelopeCitationVintage?.note === VINTAGE_ROW.note);
  check("a DECLARED undated citation is not read as a date — the note carries no date and the fallback must not find one", declaredFacets.envelopeCitationDate === null && declaredFacets.envelopeCitationDateFrom === null, `${declaredFacets.envelopeCitationDate}/${declaredFacets.envelopeCitationDateFrom}`);
  check("the declaration's own prose is measured for date-likeness (the self-defeat trap)", declaredFacets.citationVintageFromDisclosureText === false);
  check("the declaration's sentence is separately measured as present in the disclosure prose", declaredFacets.citationVintageInDisclosure === true);
  check("XD-11 PASSES a cited-undated-DECLARED payload (the fix's own direction)", !declaredDefects.some((d) => d.startsWith("XD-11:")), JSON.stringify(declaredDefects));
  check("XD-11 STILL FAILS a cited-undated-UNDECLARED payload (the pre-fix state, so the indicator can FIRE)", undeclaredDefects.some((d) => d.startsWith("XD-11:")), JSON.stringify(undeclaredDefects));
  check("a declared undated citation is COUNTED, not subtracted (DEV-PROCESS: classes are measured)", declaredDefects.some((d) => d.startsWith("XD-11-declared:")), JSON.stringify(declaredDefects));
  check("the row's own grader PASSES the declared case and FAILS the undeclared one", OPS24_DEFECT_GRADERS.citationDatePresent("selftest:1", { facets: declaredFacets }).verdict === "PASS" && OPS24_DEFECT_GRADERS.citationDatePresent("selftest:1", { facets: undeclaredFacets }).verdict === "FAIL", `${OPS24_DEFECT_GRADERS.citationDatePresent("selftest:1", { facets: declaredFacets }).verdict}/${OPS24_DEFECT_GRADERS.citationDatePresent("selftest:1", { facets: undeclaredFacets }).verdict}`);
  check("a declaration whose prose carries a date is caught as self-defeating", extractFacets({ http: 200, json: { facets: { envelope: { citationUrl: "https://x/udc", disclosure: "x", citationVintage: { ...VINTAGE_ROW, note: "Rule effective 2011-03-02" } } } } }).citationVintageFromDisclosureText === true);

  // P-254: the bucket grader in both directions, plus the refusal that must not read as a pass.
  const sbBucket = { key: "48453|austin", county: "48453", city: "austin", gradedFixture: { category: "fx_codified", id: "48453:367134", district: "SF-2" }, offered: 3, chosen: [], ungradedFixtures: ["fx_pud:x", "fx_vacant:y"] };
  const goodFacets = { measured: true, http: 200, situsAddress: "5833 Taylor Draper Cv", composedAddress: "5833 TAYLOR DRAPER CV, AUSTIN, TX 78759", zoningDistrict: "SF-2", zoningJurisdictionKey: "austin-tx", setbacks: { front: 25, side: 5, rear: 10, corner: 15 }, envelopeStatus: "ok", envelopeFigureWithheld: false, buildableAreaSqFtInPayload: null, envelopeBuildableAreaPct: null };
  const goodDraw = { measured: true, http: 200, status: "ok", geometryPresent: true, vertexCount: 7, hasBuildableAreaSqFtKey: false, buildableAreaSqFtInPayload: null, atomReconciled: true, derivePath: "labelEdges+derive+atom-reconciled" };
  const goodPdf = { measured: true, http: 200, status: "ok", artifactPresent: true, artifactKeys: ["pdf-feasibility"], artifactUrl: "https://example.invalid/pdf" };
  const okBucket = { facets: goodFacets, draw: goodDraw, pdf: goodPdf, mcp: { measured: true }, mcpCall: { measured: true, text: "{}" } };
  const g254 = gradeOps24Bucket(sbBucket, okBucket);
  check("P-254 can PASS a bucket on all three surfaces", g254.verdict === "PASS", g254.basis);
  // XD-1 under A-215 ruling 13 (P-347): the figure's BACKING decides, read from the draw route. Both directions.
  const unbackedDraw = { ...goodDraw, atomReconciled: false, derivePath: "setback-table" };
  check("P-254 FAILS when the panel payload carries a figure no verified envelope atom backs (ruling 13)", gradeOps24Bucket(sbBucket, { ...okBucket, draw: unbackedDraw, facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 } }).verdict === "FAIL");
  check("P-254 does NOT fail a figure a verified envelope atom backs (ruling 13)", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052, envelopeBuildableAreaPct: 63.5 } }).verdict === "PASS");
  check("P-254 FAILS when the draw route's own feature carries an unbacked figure", gradeOps24Bucket(sbBucket, { ...okBucket, draw: { ...unbackedDraw, hasBuildableAreaSqFtKey: true, buildableAreaSqFtInPayload: 5022 } }).verdict === "FAIL");
  check("P-254 never PASSES a figure whose backing is unreadable (the draw route did not answer)",
    (() => { const r = gradeOps24Bucket({ ...sbBucket, gradedFixture: { ...sbBucket.gradedFixture, category: "fx_any" } }, { ...okBucket, draw: { measured: false, error: "timeout" }, facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 } }); return r.verdict === "UNMEASURED" && r.unknowns.some((u) => /XD-1/.test(u)); })());
  check("figureBacking never reads the figure's own payload as its backing", figureBacking({ facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052, envelopeStatus: "ok" } }).state === "unmeasured");
  check("a draw route that answered for another parcel leaves the backing unmeasured", figureBacking({ draw: { ...goodDraw, wrongParcel: true, answeredFor: "48453:1" } }).state === "unmeasured");
  check("NOT VACUOUS, the live 48021:14899 shape: a 504 from the draw route leaves the backing unmeasured, never unbacked", figureBacking({ draw: { measured: true, http: 504, status: null, derivePath: null, atomReconciled: false, message: "upstream aborted after 10000ms" } }).state === "unmeasured");
  check("a 200 decline from the draw route is unbacked: the route says there is no envelope", figureBacking({ draw: { measured: true, http: 200, status: "declined", derivePath: null, atomReconciled: false } }).state === "unbacked");
  check("an ok draw that names no derive path leaves the backing unmeasured", figureBacking({ draw: { measured: true, http: 200, status: "ok", derivePath: null, atomReconciled: false } }).state === "unmeasured");
  check("an ok draw whose derive path lacks the reconciled atom is unbacked", figureBacking({ draw: { measured: true, http: 200, status: "ok", derivePath: "labelEdges+derive", atomReconciled: false } }).state === "unbacked");
  check("P-254 FAILS when a ruled table is called unruled", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, envelopeSummary: "setback rules unruled" } }).verdict === "FAIL");
  check("P-254 FAILS when the panel declines the envelope its own draw route draws", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, envelopeStatus: "declined", envelopeDeclineReason: "no envelope atom for this parcel" } }).verdict === "FAIL");
  check("P-254 does NOT fail the honest outline-drawn, figure-withheld shape", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, envelopeFigureWithheld: true, envelopeDisclosure: "The envelope outline is modelled from the setback table on record and drawn for reference; the area figure stays withheld." } }).verdict === "PASS");
  check("P-254 FAILS when geometry is called withheld while the draw route returns a polygon", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, envelopeDisclosure: "depth-warm geometry withheld — warm-verify-decline" } }).verdict === "FAIL");
  check("P-254 FAILS when the payload calls its setback table unknown while serving a ruled table", gradeOps24Bucket(sbBucket, { ...okBucket, facets: { ...goodFacets, envelopeDisclosure: "Codified setback table (unknown); other axes remain atom-chain-sourced." } }).verdict === "FAIL");
  check("the panel/draw table disagreement is reported as a FINDING, not folded into P-254's verdict", ops24Findings({}, { "x:1": { facets: { ...goodFacets }, draw: { ...goodDraw, setbacks: { front: 15, side: 3.5, rear: 5, corner: 10 } } } }).some((f) => f.kind === "PANEL-DRAW-TABLE-DISAGREE"));
  check("P-254 records the envelope fields the dispatch requires per fixture", (() => { const r = gradeOps24Bucket(sbBucket, okBucket); return r.envelopeRecord && "status" in r.envelopeRecord && "declineReason" in r.envelopeRecord && "envelopeCovered" in r.envelopeRecord && "geometryPresent" in r.envelopeRecord && "figureSqFt" in r.envelopeRecord; })());
  const refused = gradeOps24Bucket(sbBucket, { ...okBucket, mcp: { measured: false, error: "REFUSED by the MCP gate: missing_bearer" } });
  check("P-254 is UNMEASURED, never PASS, when the MCP gate refuses the credential", refused.verdict === "UNMEASURED" && /REFUSED by the MCP gate/.test(refused.basis), refused.basis);
  check("P-254 is UNMEASURED when the session opened but no get_smart_site result came back", gradeOps24Bucket(sbBucket, { ...okBucket, mcpCall: { measured: false, error: "http 401" } }).verdict === "UNMEASURED");
  check("P-254 is UNMEASURED when the PDF export serves no pdf-feasibility asset", gradeOps24Bucket(sbBucket, { ...okBucket, pdf: { measured: true, http: 200, artifactPresent: false, artifactKeys: [] } }).verdict === "UNMEASURED");
  check("P-254 is UNMEASURED on an empty payload (never PASS)", ROWS["P-254"].evaluate("48453|austin", { facets: extractFacets({ http: 200, json: {} }) }).verdict === "UNMEASURED");
  check("P-254 is UNMEASURED on a bucket that lists no fixture", gradeOps24Bucket({ ...sbBucket, gradedFixture: null, offered: 0 }, okBucket).verdict === "UNMEASURED");

  // P-303: the two live halves. The subject's own route is the witness against its own panel.
  const waco = { facets: { ...goodFacets, envelopeStatus: "declined", envelopeDeclineReason: "no envelope atom for this parcel" }, draw: goodDraw };
  const r303fail = ROWS["P-303"].evaluate("48309:103015", waco);
  check("P-303 FAILS when the panel declines an envelope its own route draws", r303fail.verdict === "FAIL", r303fail.basis);
  check("P-303 PASSES when the route draws and the panel does not decline and prints no figure", ROWS["P-303"].evaluate("48309:103015", { facets: { ...goodFacets, envelopeFigureWithheld: true }, draw: goodDraw }).verdict === "PASS");
  check("P-303 FAILS when the panel prints a figure no verified envelope atom backs (ruling 13)", ROWS["P-303"].evaluate("48309:103015", { facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 }, draw: { ...goodDraw, atomReconciled: false } }).verdict === "FAIL");
  check("P-303 admits a figure a verified envelope atom backs (ruling 13)", ROWS["P-303"].evaluate("48309:103015", { facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 }, draw: goodDraw }).verdict === "PASS");
  check("P-303 FAILS when a no-district class member is served a district", ROWS["P-303"].evaluate("48021:10001", { facets: { ...goodFacets, zoningDistrict: "SF-2" } }).verdict === "FAIL");
  check("P-303 PASSES when a no-district class member declines and invents nothing", ROWS["P-303"].evaluate("48021:10001", { facets: { measured: true, http: 200, zoningDistrict: null, envelopeStatus: "declined", envelopeDeclineReason: "no zoning district observed for this parcel" } }).verdict === "PASS");
  check("P-303 FAILS when a no-district class member is not declined at all", ROWS["P-303"].evaluate("48021:10001", { facets: { measured: true, http: 200, zoningDistrict: null, envelopeStatus: "ok" } }).verdict === "FAIL");

  // P-304: the pair. The control is what stops a fail-closed blanket strip from passing.
  check("P-304 PASSES when the unverified parcel states a withhold and serves no figure", ROWS["P-304"].evaluate("48209:97658", { facets: { ...goodFacets, envelopeStatus: "envelope-unverified", envelopeFigureWithheld: true }, draw: { ...goodDraw, atomReconciled: false } }).verdict === "PASS");
  check("P-304 FAILS when an unverified parcel is served a figure", ROWS["P-304"].evaluate("48209:97658", { facets: { ...goodFacets, envelopeFigureWithheld: true, buildableAreaSqFtInPayload: 19052 } }).verdict === "FAIL");
  check("P-304 is UNMEASURED when nothing is served and no surface says a figure is withheld", ROWS["P-304"].evaluate("48209:97658", { facets: { measured: true, http: 200, envelopeStatus: null, envelopeFigureWithheld: null } }).verdict === "UNMEASURED");
  check("P-304 PASSES when the verified control keeps its figure", ROWS["P-304"].evaluate("48021:34049", { facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052, envelopeBuildableAreaPct: 63.5 } }).verdict === "PASS");
  const strip = ROWS["P-304"].evaluate("48021:34049", { facets: { ...goodFacets, envelopeFigureWithheld: true } });
  check("P-304 FAILS when a fail-closed strip takes the figure off the verified control", strip.verdict === "FAIL", strip.basis);

  // P-304's pair divergence, stated as the exit reads it: one withheld, one kept, same read.
  const pair = [ROWS["P-304"].evaluate("48209:97658", { facets: { ...goodFacets, envelopeStatus: "envelope-unverified", envelopeFigureWithheld: true }, draw: { ...goodDraw, atomReconciled: false } }), ROWS["P-304"].evaluate("48021:34049", { facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052, envelopeBuildableAreaPct: 63.5 } })];
  check("P-304's pair DIVERGES (one withholds, one keeps) rather than fail-closing on both", pair[0].verdict === "PASS" && pair[1].verdict === "PASS");

  // The open-defect ledger: an undecidable defect is UNMEASURED, never counted OPEN or CLOSED.
  const ledger = defectLedger(OPS24_DEFECTS, [{ id: "48453:367134", key: "x", legs: okBucket }]);
  check("the defect ledger counts a defect as CLOSED only where a grader measured it", (ledger.counts.CLOSED ?? 0) > 0 && (ledger.counts.OPEN ?? 0) === 0, JSON.stringify(ledger.counts));
  check("the defect ledger reports a defect with no grader as UNMEASURED with the row that owns it", ledger.rows.some((r) => r.id === "XD-3" && r.verdict === "UNMEASURED" && /P-222/.test(r.basis)));
  const xd1 = (legs) => defectLedger(OPS24_DEFECTS.filter((d) => d.id === "XD-1"), [{ id: "x", key: "x", legs }]).rows[0].verdict;
  check("the defect ledger counts XD-1 OPEN where an UNBACKED figure reaches a payload", xd1({ facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 }, draw: { ...goodDraw, atomReconciled: false } }) === "OPEN");
  check("the defect ledger counts XD-1 CLOSED where the figure is backed by a verified envelope atom", xd1({ facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 }, draw: goodDraw }) === "CLOSED");
  check("the defect ledger keeps XD-1 UNMEASURED where a figure shows and its backing is unreadable", xd1({ facets: { ...goodFacets, buildableAreaSqFtInPayload: 19052 } }) === "UNMEASURED");
  check("the defect ledger is never vacuous: every one of its verdicts names a basis", ledger.rows.every((r) => !!r.basis));

  // XD-7 must be able to FIRE on the population it names. The first draft returned UNMEASURED
  // whenever the payload carried no situs, which made the indicator structurally blind to the
  // Williamson fixtures (no situs at all) while still printing "measured". Both shapes below are
  // real: the answering-no-address payload was read live from 48491:R483884 on 2026-09-17.
  const wmsnFacets = { measured: true, http: 200, situsAddress: null, composedAddress: null, recordPoint: null, zoningDistrict: "SF2", zoningJurisdictionKey: "round-rock-tx", setbacks: { front: 20, side: 5, rear: 20, corner: 20 }, facetCoverage: { baseFacts: true, landUse: false, acreage: false, zoning: true, envelope: true } };
  check("XD-7 FIRES on a Williamson-shaped payload (district and table served, no address of any kind)", defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "x", key: "x", legs: { facets: wmsnFacets } }]).counts.OPEN === 1, JSON.stringify(defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "x", key: "x", legs: { facets: wmsnFacets } }]).rows[0]));
  // ...and its basis must not overclaim. The Bastrop shape (48021:51735, read live 2026-09-17)
  // carries no address but DOES carry a record point, and called the draw route successfully with
  // it. The first draft printed "no coordinate" for this shape, which was false.
  const bastropFacets = { ...wmsnFacets, zoningDistrict: "SF-1", recordPoint: { lat: 30.10219, lng: -97.30069 } };
  const bastropX7 = defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "48021:51735", key: "x", legs: { facets: bastropFacets } }]).rows[0];
  check("XD-7 FIRES on the Bastrop shape (no address, coordinate present)", bastropX7.verdict === "OPEN");
  check("XD-7's basis says coordinate present, never 'no coordinate', when a record point exists", /present: a coordinate/.test(bastropX7.basis) && !/no coordinate/.test(bastropX7.basis), bastropX7.basis);
  check("XD-7's basis says coordinate absent when there is no record point", /absent .*coordinate/.test(defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "x", key: "x", legs: { facets: wmsnFacets } }]).rows[0].basis));
  check("XD-7 stays UNMEASURED on a wholly empty read (absence of evidence, not evidence)", defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "x", key: "x", legs: { facets: { measured: true, http: 200, situsAddress: null, composedAddress: null, zoningDistrict: null, setbacks: null, zoningJurisdictionKey: null } } }]).counts.UNMEASURED === 1);
  check("XD-7 PASSES where a composed address is served", defectLedger([{ id: "XD-7", gradedBy: "composedAddressAbsent" }], [{ id: "x", key: "x", legs: { facets: goodFacets } }]).counts.CLOSED === 1);
  // The no-location finding is carried on the parcel, not inferred from a verdict string.
  check("the no-location finding fires on the Williamson shape", ops24Findings({}, { "48491:R483884": { facets: wmsnFacets, draw: { measured: false } } }).some((f) => f.kind === "NO-LOCATION-AT-ALL" && f.parcel === "48491:R483884"));
  check("the no-location finding does NOT fire where a composed address is served", ops24Findings({}, { "48021:34049": { facets: goodFacets, draw: goodDraw } }).every((f) => f.kind !== "NO-LOCATION-AT-ALL"));
  // An absence with no basis, and the inconsistency where one address component declares its
  // absence and its sibling does not. Both shapes read live from 48021:51735 on 2026-09-17.
  const declared = { verdict: "absent-verified", status: "absent", authority: "Bastrop County CAD roll", scopeSearched: "claim.situsCity" };
  const bastropUndeclared = { facets: { ...wmsnFacets, situsAddressAbsenceDeclared: false, situsCityAbsenceDeclared: true, situsCityAbsenceVerdict: "absent-verified", recordPoint: { lat: 30.10219, lng: -97.30069 } }, draw: { measured: true, geometryPresent: true, vertexCount: 6 } };
  const f1 = ops24Findings({}, { "48021:51735": bastropUndeclared });
  check("the undeclared-absence finding fires where situsAddress is a bare null", f1.some((f) => f.kind === "SITUS-ABSENT-UNDECLARED" && f.parcel === "48021:51735"));
  check("...and it names the declared sibling as the inconsistency, rather than claiming no declaration exists anywhere", /sibling situsCity IS declared absent/.test(f1.find((f) => f.kind === "SITUS-ABSENT-UNDECLARED")?.detail ?? ""));
  check("the undeclared-absence finding does NOT fire where the absence itself is declared with its basis", ops24Findings({}, { "x:1": { facets: { ...wmsnFacets, situsAddressAbsenceDeclared: true } } }).every((f) => f.kind !== "SITUS-ABSENT-UNDECLARED"));
  check("the undeclared-absence finding does NOT fire where a situs is served", ops24Findings({}, { "x:2": { facets: { ...goodFacets } } }).every((f) => f.kind !== "SITUS-ABSENT-UNDECLARED"));
  check("a declared absence is read as a basis, not thrown away: the same payload reports the sibling's verdict", declared.verdict === "absent-verified");
  // A parcel that is both a bucket's graded fixture and a named subject is graded once, so the
  // ledger's denominators do not double-count it.
  check("ops24SubjectList dedupes a parcel that is both a bucket fixture and a named subject", ops24SubjectList({ b: { facets: { ...goodFacets }, ops24: { gradedFixture: { id: "48453:367134" } } } }, { "48453:367134": { facets: { ...goodFacets } } }).length === 1);

  // The MCP transport reader: SSE frames, plain JSON, and a gate refusal with no result.
  check("parseMcpBody reads an SSE frame", parseMcpBody('event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"serverInfo":{"name":"x"}}}\n\n')?.result?.serverInfo?.name === "x");
  check("parseMcpBody reads a plain JSON body", parseMcpBody('{"jsonrpc":"2.0","id":1,"result":{"ok":true}}')?.result?.ok === true);
  check("parseMcpBody returns a gate refusal, which the caller must treat as no session", parseMcpBody('{"jsonrpc":"2.0","id":1,"error":{"message":"invalid_oauth_token"}}')?.error?.message === "invalid_oauth_token");
  check("parseMcpBody returns null on a body that is neither", parseMcpBody("<html>401</html>") === null);

  // ---- P-347 ----
  // TLS preflight: a certificate failure is named; an ordinary network failure is not mistaken for one.
  check("tlsErrorCode names a certificate failure", tlsErrorCode({ cause: { code: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" } }) === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" && tlsErrorCode({ cause: { code: "SELF_SIGNED_CERT_IN_CHAIN" } }) === "SELF_SIGNED_CERT_IN_CHAIN");
  check("tlsErrorCode does NOT call a timeout or a reset a certificate failure", tlsErrorCode({ cause: { code: "UND_ERR_CONNECT_TIMEOUT" } }) === null && tlsErrorCode({ cause: { code: "ECONNRESET" } }) === null);
  // Ruling 9: tier recorded from the server's own words; the token never reaches the artifact.
  check("tiersIn reads subscriptionTier plain and JSON-escaped", JSON.stringify(tiersIn('{"subscriptionTier":"solo"}')) === '["solo"]' && JSON.stringify(tiersIn(JSON.stringify({ text: '{"subscriptionTier":"Studio"}' }))) === '["studio"]');
  check("tiersIn finds nothing where no tier is named (never a default tier)", tiersIn('{"tier":"paid"}').length === 0);
  const fakeJwt = `x.${Buffer.from(JSON.stringify({ iss: "https://a.example", aud: "https://mcp.smartsite.cloud/mcp", exp: 2000000000, sub: "user_123" })).toString("base64url")}.y`;
  check("tokenFacts records iss, aud and exp and never the subject", (() => { const f = tokenFacts(fakeJwt); return f.aud === "https://mcp.smartsite.cloud/mcp" && f.iss === "https://a.example" && !JSON.stringify(f).includes("user_123"); })());
  check("pkcePair: the challenge is base64url(sha256(verifier))", (() => { const p = pkcePair(); return p.challenge === createHash("sha256").update(p.verifier).digest("base64url") && p.verifier.length >= 43; })());
  const tok = "eyJ" + "a".repeat(120);
  check("NOT VACUOUS: the write guard refuses an artifact carrying the token", artifactLeaksToken(JSON.stringify({ legs: { mcp: { token: tok } } }), tok) === true);
  check("the write guard refuses a partial copy of a long token", artifactLeaksToken(`...${tok.slice(-60)}...`, tok) === true);
  check("the write guard admits an artifact with no token in it, and a run with no token", artifactLeaksToken('{"tokenSource":"sign-in helper"}', tok) === false && artifactLeaksToken("anything", null) === false);
  // Coverage (P-205, P-210).
  const cam = COVERAGE_SUBJECTS.find((s) => s.key === "coverage:cameron");
  const aus = COVERAGE_SUBJECTS.find((s) => s.key === "coverage:austin");
  const silent = extractSearchCoverage({ hits: [] });
  check("NOT VACUOUS: the live map shape (an empty list, no missClass) FAILS for an uncovered county", gradeCoverageSurface(cam, silent, "map").verdict === "FAIL");
  check("...and FAILS for a covered miss too: silence is not no-hit", gradeCoverageSurface(aus, silent, "map").verdict === "FAIL");
  check("an uncovered county named with its state PASSES", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [], missClass: "county_out_of_coverage", outOfCoverageCounty: { countyFips: "48331", countyName: "Milam County", state: "TX" } }), "map").verdict === "PASS");
  check("no-hit for an uncovered county FAILS (the P-205 bug itself)", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [], missClass: "no-hit" }), "map").verdict === "FAIL");
  check("the wrong county named FAILS", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [], missClass: "county_out_of_coverage", outOfCoverageCounty: { countyFips: "48027", countyName: "Bell County", state: "TX" } }), "map").verdict === "FAIL");
  check("an uncovered-county answer with no county name FAILS", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [], missClass: "county_out_of_coverage", outOfCoverageCounty: { countyFips: "48331" } }), "map").verdict === "FAIL");
  check("coverage_check_unavailable where an answer is owed FAILS", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [], missClass: "coverage_check_unavailable", coverageCheckUnavailableReason: "timeout" }), "map").verdict === "FAIL");
  check("a covered miss reading no-hit PASSES", gradeCoverageSurface(aus, extractSearchCoverage({ hits: [], missClass: "no-hit" }), "map").verdict === "PASS");
  check("a subject that found hits is UNMEASURED, never PASS", gradeCoverageSurface(cam, extractSearchCoverage({ hits: [{ parcelNodeId: "48331:1" }] }), "map").verdict === "UNMEASURED");
  check("mcpResultJson reads structuredContent, else a JSON text block", mcpResultJson({ structuredContent: { missClass: "no-hit" } }).missClass === "no-hit" && mcpResultJson({ content: [{ type: "text", text: "prose" }, { type: "text", text: '{"hits":[],"missClass":"no-hit"}' }] }).missClass === "no-hit");
  const covLegs = (fb, mcpF, ep) => ({ coverageSubject: cam, findBox: fb, mcpFind: mcpF, coverageEndpoint: ep });
  const named = extractSearchCoverage({ hits: [], missClass: "county_out_of_coverage", outOfCoverageCounty: { countyFips: "48331", countyName: "Milam County", state: "TX" } });
  check("P-205 FAILS on a map FAIL even while the MCP half is unmeasured", ROWS["P-205"].evaluate("coverage:cameron", covLegs(silent, { measured: false, error: "no session" })).verdict === "FAIL");
  check("P-205 is UNMEASURED when the map passes and the MCP half was not driven", ROWS["P-205"].evaluate("coverage:cameron", covLegs(named, { measured: false, error: "no session" })).verdict === "UNMEASURED");
  check("P-205 PASSES only when both surfaces pass", ROWS["P-205"].evaluate("coverage:cameron", covLegs(named, named)).verdict === "PASS");
  const ep = (j, http = 200) => extractCoverageEndpoint({ http, json: j });
  check("P-210 PASSES a not-covered answer naming the county and its state", ROWS["P-210"].evaluate("coverage:cameron", covLegs(null, null, ep({ status: "not-covered", countyFips: "48331", countyName: "Milam County", state: "TX" }))).verdict === "PASS");
  check("P-210 FAILS a not-covered answer naming another county", ROWS["P-210"].evaluate("coverage:cameron", covLegs(null, null, ep({ status: "not-covered", countyFips: "48053", countyName: "Burnet County", state: "TX" }))).verdict === "FAIL");
  check("P-210 FAILS when the endpoint calls an uncovered county covered", ROWS["P-210"].evaluate("coverage:cameron", covLegs(null, null, ep({ status: "covered" }))).verdict === "FAIL");
  check("P-210 is UNMEASURED on a refused key, never PASS", ROWS["P-210"].evaluate("coverage:cameron", covLegs(null, null, ep({ error: "unauthorized" }, 401))).verdict === "UNMEASURED");
  // Token refresh (AuthKit tokens live 5 minutes; a run takes longer).
  const jwt = (claims) => `x.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.y`;
  const sess = (expMs, refreshToken = "rt-1") => ({ token: "old", refreshes: 0, refresher: { refreshToken, tokenEndpoint: "https://as.example/token", clientId: "c", resource: "r", expMs } });
  const t0r = Date.parse("2026-09-18T15:20:00Z");
  check("no refresh while more than a minute is left", needsMcpRefresh(sess(t0r + 120_000), t0r) === false);
  check("NOT VACUOUS: a refresh is due inside the last minute", needsMcpRefresh(sess(t0r + 30_000), t0r) === true);
  check("no refresher (an env token) never refreshes", needsMcpRefresh({ token: "x" }, t0r) === false && needsMcpRefresh(sess(t0r, null), t0r) === false);
  check("a refresh answer replaces the token, rotates the refresh token and moves the expiry",
    (() => { const s1 = sess(t0r + 10_000); const ok = applyMcpRefresh(s1, { access_token: jwt({ exp: 1789745000 }), refresh_token: "rt-2" }, 200, t0r); return ok && s1.token !== "old" && s1.refresher.refreshToken === "rt-2" && s1.refresher.expMs === 1789745000000 && s1.refreshes === 1; })());
  check("a failed refresh is recorded and keeps the old token, never a silent pass",
    (() => { const s1 = sess(t0r + 10_000); const ok = applyMcpRefresh(s1, { error: "invalid_grant" }, 400, t0r); return ok === false && s1.token === "old" && /invalid_grant/.test(s1.refreshError); })());
  check("the write guard refuses an artifact carrying the refresh token", artifactLeaksToken(JSON.stringify({ x: "rt-secret-value-that-is-long-enough" }), "rt-secret-value-that-is-long-enough") === true);
  // The MCP glossary is not a claim about the parcel.
  const vocab = { smartSiteVocabulary: [{ token: "atom_path_pending", displayText: "Withheld, setbacks unruled", meaning: "..." }] };
  const mcpWith = (inner) => ({ measured: true, text: JSON.stringify({ content: [{ type: "text", text: JSON.stringify(inner) }] }) });
  check("NOT VACUOUS, the live Williamson shape: a glossary-only mention of 'unruled' is not a contradiction",
    contradictions({ facets: { ...goodFacets }, draw: goodDraw, mcpCall: mcpWith({ parcels: [], notFound: ["48491:R038268"], reason: "record_retired", ...vocab }) }).length === 0);
  check("the live Martindale shape still trips: the parcel's own overlay says unruled beside a ruled table",
    contradictions({ facets: { ...goodFacets }, draw: goodDraw, mcpCall: mcpWith({ overlays: [{ id: "envelope", state: "refused", reason: "atom_path_pending", reasonDisplayText: "Withheld, setbacks unruled" }], ...vocab }) }).some((c) => /mcp/.test(c.where)));
  check("mcpClaimText keeps everything but the glossary", (() => { const t = mcpClaimText(mcpWith({ a: "keep me", ...vocab })); return t.includes("keep me") && !t.includes("smartSiteVocabulary"); })());

  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

// --------------------------------------------------------------------------- main
// Runs only when this file is the entry point. Importing the module (for its extractors and
// ROWS) must never probe production: on 2026-09-11 a fixture-reading one-liner that imported
// it fired a live run and wrote an artifact nobody asked for. Case-insensitive on purpose:
// Windows argv[1] and import.meta.url can differ in drive-letter case.
const isEntry = (() => {
  try { return !!process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase(); } catch { return false; }
})();
if (isEntry) await main();

async function main() {
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
  let ops24Report = null;
  let ops24LegsByBucket = {};
  let tls = null;
  let mcpRun = null;
  let mcpSession = null;
  let mcpRefresher = null;
  if (!flag("--fixtures")) {
    // P-347: refuse the whole run, once and by name, on a host whose CA store Node cannot use.
    tls = await tlsPreflight([PE_BASE, ENGINE_BASE, MCP_BASE]);
    const bad = tls.find((t) => t.tls);
    if (bad) {
      console.error(`UNMEASURED: TLS to ${bad.base} failed (${bad.tls}). On this host run \`node --use-system-ca scripts/surface-probe.mjs ...\` (P-347); nothing was measured.`);
      process.exit(2);
    }
    // P-347, ruling 9: one MCP session per run, opened only when a row needs the MCP surface. The
    // token comes from the sign-in helper (in memory) or, if the operator passes one, the env; the
    // run records which, and the tier it graded at, and never the token.
    const needsMcp = rowFilter && rowFilter.some((r) => ["P-254", "P-303", "P-304", "P-205"].includes(r));
    if (needsMcp) {
      let token = (process.env.SURFACE_PROBE_MCP_TOKEN || "").trim() || null;
      let tokenSource = token ? "env SURFACE_PROBE_MCP_TOKEN" : null;
      mcpRun = { signIn: null };
      if (!token && flag("--mcp-sign-in")) {
        const si = await mcpSignIn();
        mcpRun.signIn = si.ok ? { ok: true, obtainedAt: si.obtainedAt, tokenFacts: si.facts, resource: si.resource, audienceMatchesResource: si.audienceMatchesResource } : { ok: false, error: si.error };
        if (si.ok) { token = si.token; tokenSource = "sign-in helper (in memory, this run only)"; mcpRefresher = si.refresher; mcpRun.signIn.refreshTokenIssued = !!si.refresher?.refreshToken; }
        console.log(si.ok ? `signed in; token audience ${JSON.stringify(si.facts?.aud)} expires ${si.facts?.exp}` : `sign-in did not complete: ${si.error}`);
      }
      process.stdout.write(`opening the MCP session against ${MCP_BASE} ... `);
      const opened = await runMcpLegs(token, tokenSource, mcpRefresher);
      mcpSession = opened.session ?? null;
      delete opened.session;
      mcpRun.open = opened;
      console.log(opened.measured ? `done (session id ${opened.sessionIdPresent ? "present" : "absent"}, tools ${Object.keys(opened.toolArgKeys ?? {}).length})` : `did not open (${opened.gateReason})`);
    }
  }
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
    if (rowFilter && rowFilter.includes("P-175")) {
      for (const a of ADDRESSES) {
        process.stdout.write(`probing ${a.key} (${a.address}) ... `);
        legsById[a.key] = await runAddressLegs(a);
        console.log("done");
      }
    }
    // P-241: one live run of the ETJ acquisition instrument, shared by every ETJ subject (the
    // instrument acquires all 23 registered cities at once, so running it per subject would
    // re-query every publisher four times).
    if (rowFilter && rowFilter.includes("P-241")) {
      process.stdout.write("running the ETJ acquisition instrument against the live publishers ... ");
      const etjLive = runEtjLegs();
      console.log(etjLive.measured ? "done" : `did not run (${etjLive.error})`);
      for (const s of ETJ_SUBJECTS) {
        legsById[s.key] = { ...(legsById[s.key] ?? {}), etjLive };
      }
    }
    source = "live";
  }

  // P-254/P-303/P-304: the customer leg. One pass drives the three surfaces for every selected
  // bucket fixture plus the P-303/P-304 subjects, deduplicating so a fixture two buckets share is
  // probed once. The MCP session opens once per run, because its refusal is a property of the run's
  // credential, not of any parcel.
  if (!flag("--fixtures") && rowFilter && rowFilter.some((r) => ["P-254", "P-303", "P-304"].includes(r))) {
    const all = flag("--ops24-all");
    const subjects = selectOps24Subjects(OPS24_BUCKETS, all);
    ops24Report = {
      path: OPS24_FIXTURE_LIST,
      sha256: OPS24_LIST_SHA256,
      readError: OPS24_LIST_ERROR,
      selection: all ? "every fixture slot in every bucket (--ops24-all)" : `one fixture per bucket, first by OPS24_CATEGORY_PRIORITY [${OPS24_CATEGORY_PRIORITY.join(", ")}]`,
      subjects,
      fixtureSlots: subjects.reduce((n, s) => n + s.offered, 0),
      mcp: null,
      mcpCalls: {},
      findings: [],
      ledger: { counts: {}, rows: [] },
    };
    ops24Report.mcp = mcpRun?.open ?? { measured: false, error: "the MCP leg did not run in this pass" };
    const ids = [...new Set([...subjects.flatMap((s) => s.chosen.map((c) => c.id)), ...P303_SUBJECTS.map((s) => s.id), ...P304_SUBJECTS.map((s) => s.id), UNRULED_SUBJECT])];
    const byId = {};
    for (const id of ids) {
      process.stdout.write(`probing ${id} (map+draw+pdf${mcpSession ? "+mcp" : ""}) ... `);
      byId[id] = await runOps24Legs({ id }, { mcp: ops24Report.mcp, mcpSession });
      console.log(`done (panel ${byId[id].facets.http}, draw ${byId[id].draw.http ?? "-"}, pdf ${byId[id].pdf.http})`);
    }
    for (const s of subjects) {
      if (!s.gradedFixture) continue;
      const legs = byId[s.gradedFixture.id];
      if (legs) ops24LegsByBucket[s.key] = { ...legs, ops24: s };
    }
    // P-303/P-304 read legs keyed by their own parcel id, in the ordinary legs map.
    for (const s of [...P303_SUBJECTS, ...P304_SUBJECTS]) {
      if (byId[s.id]) legsById[s.id] = byId[s.id];
    }
    ops24Report.legsById = byId;
    const subjectsDeduped = ops24SubjectList(ops24LegsByBucket, byId);
    ops24Report.subjectsDeduped = subjectsDeduped.length;
    ops24Report.findings = ops24Findings(ops24LegsByBucket, { ...legsById, ...Object.fromEntries(Object.entries(byId).filter(([id]) => !ops24LegsByBucket[id])) });
    ops24Report.ledger = defectLedger(OPS24_DEFECTS, subjectsDeduped);
    // The two required cases the dispatch hands this lane, each with its measured population and
    // the MCP half's honest state (the MCP surface is UNMEASURED here: no OAuth token, measured
    // refusal recorded in ops24Report.mcp). The panel half is measured live in this pass.
    const scanAll = subjectsDeduped.map((s) => s.legs);
    // The denominator for both required cases is the DEDUPED subject list, so it agrees with the
    // ledger's. `kindCounts` counts kind-instances and a leg can trip both kinds, so it can exceed
    // `legsTripping`; both are printed so the difference is visible rather than looking like a bug.
    const contra = scanAll.flatMap((l) => contradictions(l));
    const dual = scanAll.filter((l) => l.facets?.panelMaxImperviousPct != null && l.facets?.imperviousFactPercent != null && l.facets.panelMaxImperviousPct !== l.facets.imperviousFactPercent);
    const req1 = byId[UNRULED_SUBJECT] ?? ops24LegsByBucket[UNRULED_SUBJECT];
    const req2 = req1;
    ops24Report.requiredCases = [
      {
        key: "cross-surface-envelope-reason",
        subject: UNRULED_SUBJECT,
        standard: "fails when ANY surface says \"unruled\" or `atom_path_pending` for a parcel whose own read carries a ruled setback table",
        measuredPanelHalf: req1 ? {
          tableServed: req1.facets.setbacks,
          ruledAxes: ruledAxes(req1.facets.setbacks),
          panelDisclosure: req1.facets.envelopeDisclosure,
          panelDeclineReason: req1.facets.envelopeDeclineReason,
          drawStatus: req1.draw.status,
          drawVertices: req1.draw.vertexCount,
          contradictionKinds: contradictions(req1).map((c) => ({ kind: c.kind, where: c.where, text: c.text })),
          verdictNote: contradictions(req1).length ? "the PANEL half is MEASURED and FAILS: its own disclosure denies the geometry its own route serves" : "the panel half is measured and does not trip the check",
        } : { verdictNote: "48453:367134 was not in this pass" },
        mcpHalf: ops24Report.mcp?.measured ? { state: "MEASURED", note: "session opened; see mcpCalls" } : { state: "UNMEASURED", refusal: ops24Report.mcp?.error, note: "the MCP copy of this contradiction (draw.overlays state refused / reason atom_path_pending / display \"Withheld, setbacks unruled\") is OBSERVED by the integration seat, NOT measured by this instrument: the gate refuses a service Bearer and no OAuth token was supplied" },
        population: { legsScanned: scanAll.length, legsTripping: scanAll.filter((l) => contradictions(l).length).length, kindCounts: contra.reduce((t, c) => ((t[c.kind] = (t[c.kind] ?? 0) + 1), t), {}) },
      },
      {
        key: "two-impervious-figures",
        subject: UNRULED_SUBJECT,
        standard: "flag any fixture where two surfaces print different values for fields a customer would read as the same quantity; a finding for a ruling, not a defect to fix in this lane",
        measured: req2 ? { panelMaxImperviousPct: req2.facets.panelMaxImperviousPct, watershedPercent: req2.facets.imperviousFactPercent, watershedType: req2.facets.imperviousFactWatershed, factState: req2.facets.imperviousFactState } : null,
        population: { legsScanned: scanAll.length, legsWithTwoDifferentFigures: dual.length, parcels: dual.map((l) => ({ panel: l.facets.panelMaxImperviousPct, fact: l.facets.imperviousFactPercent, watershed: l.facets.imperviousFactWatershed })) },
      },
    ];
  }

  // P-347: the coverage leg (P-205, P-210), one pass over the coverage subjects on every surface.
  if (!flag("--fixtures") && rowFilter && rowFilter.some((r) => ["P-205", "P-210"].includes(r))) {
    for (const s of COVERAGE_SUBJECTS) {
      process.stdout.write(`coverage ${s.key} ("${s.query}") ... `);
      legsById[s.key] = await runCoverageLegs(s, mcpSession);
      console.log(`endpoint ${legsById[s.key].coverageEndpoint.status ?? "-"}, find box ${legsById[s.key].findBox.missClass ?? (legsById[s.key].findBox.measured ? "no missClass" : "unmeasured")}, mcp ${legsById[s.key].mcpFind.missClass ?? (legsById[s.key].mcpFind.measured ? "no missClass" : "unmeasured")}`);
    }
  }
  // Ruling 9: the run records the tier it graded at, read off the server's own answers.
  if (mcpRun) mcpRun.tiersSeen = mcpSession ? [...mcpSession.tiers] : [];
  if (mcpRun && mcpSession?.tierProbe) mcpRun.tierProbe = mcpSession.tierProbe;
  if (mcpRun && mcpSession) { mcpRun.tokenRefreshes = mcpSession.refreshes; if (mcpSession.refreshError) mcpRun.tokenRefreshError = mcpSession.refreshError; }
  if (mcpRun && mcpSession && !mcpRun.tiersSeen.length) mcpRun.tierNote = "no MCP answer in this run named a subscriptionTier, so the tier graded at is NOT recorded; the close must say so";

  const results = evaluateRows(legsById, obs ?? (flag("--fixtures") ? loadFixtureLegs().manifest.observations : null), rowFilter, ops24LegsByBucket);
  // The per-class tallies the close reads: which defect class is failing how many buckets, so a
  // single class firing everywhere (XD-11 did, on 25 of 45 before this tally existed) is visible
  // as a number rather than hidden inside 25 identical verdict strings.
  if (ops24Report && !ops24Report.readError) {
    const cls = (s) => (String(s).match(/^([A-Za-z0-9/_-]+?)(?::|\s|$)/) ?? [, "other"])[1];
    ops24Report.violationClasses = {};
    ops24Report.defectClasses = {};
    for (const r of results.filter((x) => x.row === "P-254")) {
      for (const v of r.violations ?? []) ops24Report.violationClasses[cls(v)] = (ops24Report.violationClasses[cls(v)] ?? 0) + 1;
      for (const d of r.defects ?? []) ops24Report.defectClasses[cls(d)] = (ops24Report.defectClasses[cls(d)] ?? 0) + 1;
    }
  }
  console.log(`\nSURFACE PROBE  ${ranAt}  doc_repo ${docRepoHead()}  source ${source}  PE ${PE_BASE}  observations ${sha256 ? "sha256 " + sha256.slice(0, 12) : "none"}`);
  const tally = printReport(results, legsById, ops24Report && !ops24Report.readError ? ops24Report : null);

  const artifactDir = join(ROOT, "_inbox");
  if (!existsSync(artifactDir)) mkdirSync(artifactDir);
  const stamp = ranAt.slice(0, 10) + "_" + ranAt.slice(11, 19).replace(/:/g, "");
  const outPath = val("--out") ?? join(artifactDir, `${stamp}_surface_probe.json`);
  // P-347: HEAD alone does not name the instrument when the run uses a working-tree revision; the
  // file's own hash does, committed or not.
  const instrumentSha256 = createHash("sha256").update(readFileSync(fileURLToPath(import.meta.url))).digest("hex");
  const artifactText = JSON.stringify({ instrument: "scripts/surface-probe.mjs", instrumentSha256, ranAt, docRepoHead: docRepoHead(), source, peBase: PE_BASE, observationsSha256: sha256, tls, mcpRun, rows: rowFilter, legs: legsById, findings: findings(legsById), results, tally, ops24: ops24Report }, null, 2);
  // Ruling 9: nothing new is stored. The token never reaches the artifact; if it would, nothing is written.
  if (artifactLeaksToken(artifactText, mcpSession?.token) || artifactLeaksToken(artifactText, mcpSession?.refresher?.refreshToken)) {
    console.error("REFUSED: the artifact would contain the MCP token; nothing was written");
    process.exit(2);
  }
  writeFileSync(outPath, artifactText);
  console.log(`\nartifact: ${outPath.replace(/\\/g, "/")}`);

  if (tally.FAIL) process.exit(1);
  if (tally.UNMEASURED && !flag("--allow-unmeasured")) {
    console.log("exit 2: unmeasured predicates present; pass --allow-unmeasured to accept an artifact that does not decide them");
    process.exit(2);
  }
  process.exit(0);
}
