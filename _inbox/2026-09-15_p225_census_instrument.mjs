#!/usr/bin/env node
/**
 * p225_census_instrument.mjs -- P-225 setback codification census.
 *
 * CENSUS, NOT A BUILD. Enumerates every live zoning district code in every wired city across
 * the six onboarded counties (CONSTRAINT_SEARCH_COUNTIES) and records, per district, whether a
 * codified setback row exists -- using the REAL production resolver (getSetbackTableForZoning +
 * mapDistrict), imported directly from legacy-design-tools so this census can never drift from
 * what production actually does. Adds, changes, or invents NO setback value.
 *
 * Run: npx tsx _inbox/2026-09-15_p225_census_instrument.mjs [--ldt-root <path>] [--out <path>]
 *   LDT_ROOT env var (or --ldt-root) points at a legacy-design-tools worktree; defaults to
 *   P:/seat-worktrees/p225-setback-codification-census/legacy-design-tools.
 *
 * Requires network access to each city's public ArcGIS FeatureServer/MapServer layer.
 */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const LDT_ROOT = resolve(
  flag("ldt-root", process.env.LDT_ROOT || "P:/seat-worktrees/p225-setback-codification-census/legacy-design-tools"),
);
const OUT = flag("out", null);

const setbacksIndexUrl = pathToFileURL(resolve(LDT_ROOT, "lib/adapters/src/local/setbacks/index.ts")).href;
const districtMappingUrl = pathToFileURL(resolve(LDT_ROOT, "artifacts/api-server/src/lib/buildableEnvelope/districtMapping.ts")).href;
const zoningLayersUrl = pathToFileURL(resolve(LDT_ROOT, "lib/cad-ingest/src/txgio/zoning-layers.ts")).href;

const { getSetbackTableForZoning } = await import(setbacksIndexUrl);
const { mapDistrict, districtCode } = await import(districtMappingUrl);
const { ZONING_LAYERS } = await import(zoningLayersUrl);

// CONSTRAINT_SEARCH_COUNTIES, artifacts/api-server/src/lib/parcelConstraintSearch.ts:56-62.
const SIX_COUNTIES = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};

// --------------------------------------------------------------------- disposition taxonomy
// See CP1 (_inbox/2026-09-15_p225-setback-codification-census_cp1.json) for the full rationale.
// Bastrop's per-parcel BDC codes are the ONLY ones with documented atom-chain/GIS-layer-23
// evidence (dispatch's own live-read finding); everything else is judged acquire vs
// ruled-out-of-scope from each city's own zoning-layers.ts comment or the coverage doc.
const BDC_PER_PARCEL_CODES = new Set(["MU", "GC", "PDD", "PI", "IND", "OS", "P/OS", "P-OS"]);

/** One row per (city, canonical code). Manually curated from zoning-layers.ts's own comments
 * and docs/property-explorer-setback-coverage-central-tx.md, cited per entry. Codes not listed
 * here fall through to the DEFAULT_DISPOSITION heuristic below, flagged low-confidence. */
const KNOWN_DISPOSITIONS = {
  // Georgetown: AG/BP/MH/MU-DT/PF explicitly named as the 5 GIS-only codes with no setback row
  // (zoning-layers.ts:22-24), "deliberately excluded as form-based/no-simple-setback districts".
  "georgetown-tx:AG": ["ruled-out-of-scope", "zoning-layers.ts:24-25: 'AG and MU are deliberately excluded from the setback table as form-based / no-simple-setback districts' (comment names AG explicitly; treated as the governing rule for this code family)"],
  "georgetown-tx:BP": ["acquire", "zoning-layers.ts:23 lists BP as one of 5 GIS-only codes with no table row; no form-based/overlay exclusion language attaches to it specifically (Business Park reads as a conventional commercial district)"],
  "georgetown-tx:MH": ["ruled-out-of-scope", "zoning-layers.ts:24-25: manufactured-housing districts are conventionally excluded alongside AG in this comment's 'form-based / no-simple-setback' framing; MH here is a small-count (6 parcel) legacy pocket, not a growth district"],
  "georgetown-tx:MU-DT": ["ruled-out-of-scope", "zoning-layers.ts:24-25: 'MU' (mixed-use / downtown) is named as deliberately excluded as form-based"],
  "georgetown-tx:PF": ["acquire", "zoning-layers.ts:23 lists PF (Public Facilities) as a GIS-only code with no table row and no exclusion language; a conventional institutional district that plausibly has a real dimensional standard"],
  "georgetown-tx:RL": ["acquire", "CP1 finding: comment claims RL was live-verified covered 2026-07-20 but the current table has no RL row (RT/RM exist instead) -- either a stale comment or a removed row; treated as an honest acquire gap until re-researched, not assumed ruled-out"],

  // Buda: F1..F5/HI/LI/PD named as form-based/commercial with no setback row (zoning-layers.ts:184-185).
  "buda-tx:F1": ["ruled-out-of-scope", "zoning-layers.ts:184-185: F1..F5/HI/LI/PD 'are form-based / commercial with no setback row -> conservative fallback (honest)'"],
  "buda-tx:F2": ["ruled-out-of-scope", "zoning-layers.ts:184-185, same form-based family"],
  "buda-tx:F3": ["ruled-out-of-scope", "zoning-layers.ts:184-185, same form-based family"],
  "buda-tx:F4": ["ruled-out-of-scope", "zoning-layers.ts:184-185, same form-based family"],
  "buda-tx:F5": ["ruled-out-of-scope", "zoning-layers.ts:184-185, same form-based family"],
  "buda-tx:HI": ["acquire", "zoning-layers.ts:184-185 names HI (Heavy Industrial) alongside the form-based codes but industrial districts conventionally do carry ordinance dimensional standards; not clearly form-based itself, treated as acquire pending direct ordinance check"],
  "buda-tx:LI": ["acquire", "same reasoning as HI -- Light Industrial"],
  "buda-tx:PD": ["ruled-out-of-scope", "PD (Planned Development) is a composite/negotiated-conditions district by definition, not a fixed Euclidean setback row"],

  // Kyle: A/C-2/CBD-*/MXD/PUD named as no-setback-row gaps (zoning-layers.ts:199-200).
  "kyle-tx:PUD": ["ruled-out-of-scope", "PUD is a negotiated planned-development composite, not a fixed Euclidean row"],
  "kyle-tx:MXD": ["ruled-out-of-scope", "zoning-layers.ts:199-200 groups MXD (Mixed-Use District) with the un-rowed gaps; mixed-use districts are conventionally form-based in this product's own taxonomy (see Georgetown MU-DT, San Marcos MU)"],
  "kyle-tx:A": ["ruled-out-of-scope", "Agricultural holding district; conventionally excluded (see Georgetown AG)"],
  "kyle-tx:C-2": ["acquire", "zoning-layers.ts:199-200 names C-2 as a gap with no exclusion language; a conventional commercial district"],

  // San Marcos: table populated for SF-6/SF-4.5/ND-3 only (coverage doc); other stamped codes
  // are 'explicit table-note gaps' -- no per-code exclusion language found, treated as acquire.

  // Cedar Park: DR/SR/SU/MF/NB/LB/PO populated; UR named as a specific remaining gap.
  "cedar-park-tx:UR": ["acquire", "zoning-layers.ts:222-223: 'UR and other live codes remain explicit table-note gaps' -- named with no exclusion language"],

  // Taylor: form-based SmartCode place-type system; EC/CS explicitly named TBD (coverage doc:27).
  "taylor-tx:EC": ["acquire", "docs/property-explorer-setback-coverage-central-tx.md:27: 'EC/CS remain TBD' -- explicitly flagged as an owed extension of the same place-type table, not excluded"],
  "taylor-tx:CS": ["acquire", "docs/property-explorer-setback-coverage-central-tx.md:27: 'EC/CS remain TBD'"],

  // Liberty Hill: 14 standard-lot districts populated; zero-lot-line/PUD/Edwards-Aquifer/MH2 omitted (coverage doc:20).
  "liberty-hill-tx:PUD": ["ruled-out-of-scope", "coverage doc:20 names PUD among the omitted set; planned-development composite by definition"],
  "liberty-hill-tx:MH2": ["ruled-out-of-scope", "coverage doc:20 names MH2 (manufactured housing) among the omitted set alongside PUD/Edwards-Aquifer overlays"],

  // Pflugerville: SF-S/SF-R/MF-20 populated; GB1/GB2/LI/O named as remaining table-note gaps
  // (zoning-layers.ts:260-261) pending non-residential dimensional extraction -- acquire.
  "pflugerville-tx:GB1": ["acquire", "zoning-layers.ts:260-261: 'GB1/GB2/LI/O remain explicit table-note gaps pending non-residential dimensional extraction'"],
  "pflugerville-tx:GB2": ["acquire", "zoning-layers.ts:260-261, same note"],
  "pflugerville-tx:LI": ["acquire", "zoning-layers.ts:260-261, same note"],
  "pflugerville-tx:O": ["acquire", "zoning-layers.ts:260-261, same note"],

  // Austin: SF-1/2/3 + MF-1..MF-6 populated (9 base districts); "remaining GIS codes stamp as
  // zoning-present / setback-pending" (zoning-layers.ts:273-274) -- no per-code exclusion
  // language for the rest, so every other live Austin code defaults to acquire unless it is
  // visibly an overlay/PUD/combining-district code (handled by DEFAULT_DISPOSITION below).

  // Bastrop city: P-1..P-5/P-CS/P-EC are REPEALED (isRepealedB3PlaceType) -- these are a
  // distinct disposition the mapDistrict/getSetbackTableForZoning pair already encodes as a
  // hard null, not a live gap to acquire or serve; still enumerated as uncodified (the customer
  // sees the same 404) but ruled-out-of-scope with the repeal as the reason, never acquire.
  "bastrop-city-tx:P-1": ["ruled-out-of-scope", "lib/adapters/src/local/setbacks/index.ts:125-127,183-189: P-1..P-5/P-CS/P-EC B3 Place Types are REPEALED by Ord. 2026-06/2026-04-14; isRepealedB3PlaceType() returns null by design (WDLL STEP 3), never served as current law"],
  "bastrop-city-tx:P-2": ["ruled-out-of-scope", "same repeal basis as P-1"],
  "bastrop-city-tx:P-3": ["ruled-out-of-scope", "same repeal basis as P-1"],
  "bastrop-city-tx:P-4": ["ruled-out-of-scope", "same repeal basis as P-1"],
  "bastrop-city-tx:P-5": ["ruled-out-of-scope", "same repeal basis as P-1"],
  "bastrop-city-tx:P-CS": ["ruled-out-of-scope", "same repeal basis as P-1"],
  "bastrop-city-tx:P-EC": ["ruled-out-of-scope", "same repeal basis as P-1"],

  // Lockhart: RLD/RMD/RHD populated; RMD/RHD development-type, CBD, PDD, conditional-adjacency
  // cases remain omitted per coverage doc:21 -- CBD/PDD ruled out (composite/CBD overlay-like),
  // commercial/industrial family (CCB/CHB/CLB/CMB/IH/IL) acquire (conventional districts).
  "lockhart-tx:PDD": ["ruled-out-of-scope", "Planned Development District -- negotiated composite, not a fixed Euclidean row (same reasoning as every other PDD/PUD code in this census)"],

  // Waco: OUT/STATE are explicitly not districts (already excluded server-side via layerWhere +
  // nullDistrictCodes in ZONING_LAYERS itself, so they will not appear in this census's live
  // enumeration at all). SETBACK TABLE OWED for every live Waco code (zoning-layers.ts:480) --
  // every live Waco code defaults to acquire.

  // Elgin: table ratified for all 8 districts (R-1/R-2/R-3/R-4/C-1/C-2/C-3/I) -- if a live code
  // outside that set appears, no comment names a specific gap; falls to DEFAULT_DISPOSITION.

  // Leander: live-fetched Use_/Descr pairs (2026-09-15) show every PUD-prefixed code (PUD-SF,
  // PUD-MF, PUD-TH, PUD-GC, PUD-LC, PUD-HC, PUD-CH, PUD-LO, PUD-MU) carrying a distinct,
  // individually-named project description ("Lakeline Ranch PUD", "Travisso PUD", "Bryson
  // Planned Unit Development", ~90 distinct project names observed) rather than one shared
  // district description -- direct live evidence these are per-project negotiated composites
  // (each with its own development agreement), not a citywide fixed-dimension district family,
  // upgrading this from the generic PUD-prefix heuristic to an evidenced call. PUD-SF alone
  // carries 7,815 parcels, the single largest uncodified row in this entire census.
  "leander-tx:PUD-SF": ["ruled-out-of-scope", "live Use_/Descr fetch 2026-09-15: PUD-SF carries dozens of distinct per-project names (Lakeline Ranch, Travisso, Connelly's Crossing, Palmera Ridge, Devine Lake, ...), confirming per-project negotiated PUD composites, not a shared district"],
  "leander-tx:PUD-MF": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Trails of Leander, Blake's Bend, Municipal Townhome, ...)"],
  "leander-tx:PUD-TH": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Horseshoe Addition, Sky Heights, Retreat at Hero Way, ...)"],
  "leander-tx:PUD-GC": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Gateway, NW Soccer Club, PEC Data Center Minor PUD, ...)"],
  "leander-tx:PUD-LC": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Lacy Drive Minor PUD, Moon Valley PUD, Sodalis Minor PUD, ...)"],
  "leander-tx:PUD-HC": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Capital Metro PUD, KOA Campground PUD, EMI PUD, ...)"],
  "leander-tx:PUD-CH": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (406 Hazelwood PUD, Monarch PUD, Castella Court PUD, ...)"],
  "leander-tx:PUD-LO": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Shops at CR 279 PUD, Journey Bible PUD, Raider Way Animal Hospital PUD, ...)"],
  "leander-tx:PUD-MU": ["ruled-out-of-scope", "same live evidence as PUD-SF -- distinct per-project PUD names observed (Knight PUD Amendment #1, Leander Springs PUD, Global Village PUD, ...)"],
  // T4/T5/T6/S2/SD/Civic: live Descr values are overwhelmingly "Planned Unit Development/Transit
  // Oriented Development District" or "T5 Transect"/"Urban Center Zone" -- these read as SmartCode
  // transect-zone / TOD-overlay codes (the same form-based shape as Taylor's Place Type system,
  // itself ruled TBD/acquire only for its two explicitly-named EC/CS codes), not conventional
  // fixed-dimension Euclidean districts. Lower confidence than the PUD family since a few T4/T5
  // rows carry plain descriptions ("Single-Family Urban/Transit Oriented Development District")
  // suggesting an underlying base use still applies -- kept low-confidence acquire rather than
  // forced into ruled-out, since I have not read Leander's TOD ordinance text directly.
  "leander-tx:T4": ["acquire", "live Descr fetch 2026-09-15: mixed TOD/transect descriptions (mostly 'Planned Unit Development/Transit Oriented Development District', some 'Single-Family Urban/TOD District') -- genuinely ambiguous between a form-based transect zone and a TOD overlay on a real base district; not confidently ruled out without reading the TOD ordinance text directly", true],
  "leander-tx:T5": ["acquire", "same ambiguity as T4 -- live Descr mixes 'T5 Transect'/'Urban Center Zone' (form-based) with plain base-use descriptions", true],
  "leander-tx:T6": ["acquire", "same ambiguity as T4/T5, smaller sample (3 live rows observed)", true],
};

/** When no KNOWN_DISPOSITIONS entry exists, a small set of code-shape heuristics -- always
 * flagged low-confidence so the close can call out which rows are provisional. */
function defaultDisposition(cityKey, code) {
  const c = code.toUpperCase();
  if (/^(PUD|PDD|PD)(\b|[-_])/.test(c)) return ["ruled-out-of-scope", "code shape (PUD/PDD/PD) is a negotiated planned-development composite, not a fixed Euclidean setback row -- default heuristic, not a per-city citation", true];
  if (/^(AG|AGR)(\b|[-_])/.test(c)) return ["ruled-out-of-scope", "code shape (AG) is an agricultural/conservation holding district, conventionally excluded from Euclidean setback tables in this product (see Georgetown AG) -- default heuristic", true];
  if (/^(OCL|UZROW|ROW|OUT|STATE|NONE)$/.test(c)) return ["ruled-out-of-scope", "code is a not-a-district sentinel (outside-city-limits / right-of-way / unassigned) -- default heuristic", true];
  if (/^MU/.test(c)) return ["ruled-out-of-scope", "code shape (MU-prefixed mixed-use) matches this product's own treatment of Georgetown MU-DT and Kyle MXD as form-based/excluded -- default heuristic, not independently verified for this city", true];
  return ["acquire", "no per-city comment evidence found either way; defaulting to acquire (a conventional-looking district code, most plausibly an untranscribed real ordinance row) is the conservative default per the dispatch's own framing that acquire is for cases where a real codified source PLAUSIBLY exists -- LOW CONFIDENCE, needs a direct per-city ordinance check before acting on it", true];
}

// --------------------------------------------------------------------- live GIS enumeration
async function fetchCodeCounts(layer) {
  const where = encodeURIComponent(layer.layerWhere || "1=1");
  const stats = encodeURIComponent(JSON.stringify([{ statisticType: "count", onStatisticField: layer.codeField, outStatisticFieldName: "cnt" }]));
  const url = `${layer.layerUrl}/query?f=json&where=${where}&outFields=${encodeURIComponent(layer.codeField)}&groupByFieldsForStatistics=${encodeURIComponent(layer.codeField)}&outStatistics=${stats}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const json = await res.json();
  if (json.error) {
    return { ok: false, error: `${json.error.code ?? ""} ${json.error.message ?? JSON.stringify(json.error)}`.trim(), url };
  }
  const feats = Array.isArray(json.features) ? json.features : [];
  const raw = feats.map((f) => ({ value: f.attributes[layer.codeField], count: f.attributes.cnt }));
  return { ok: true, raw, url };
}

/** Apply codeDomainMap / codeExtractRegex / nullDistrictCodes to raw (value,count) pairs,
 * mirroring zoning-stamp.ts's own extraction order (domain-map OR regex; both never present
 * together in this registry). Returns a Map<canonicalCode, totalParcelCount>. */
function canonicalize(layer, rawCounts) {
  const out = new Map();
  const nullSet = new Set((layer.nullDistrictCodes || []).map((s) => s.trim().toLowerCase()));
  const regex = layer.codeExtractRegex ? new RegExp(layer.codeExtractRegex) : null;
  for (const { value, count } of rawCounts) {
    const rawStr = value == null ? "" : String(value).trim();
    let code = null;
    if (layer.codeDomainMap) {
      code = layer.codeDomainMap[rawStr] ?? null; // unmapped raw codes are dropped (never stamped)
    } else if (regex) {
      const m = regex.exec(rawStr);
      code = m ? m[1] : null;
    } else {
      code = rawStr || null;
    }
    if (!code) continue;
    if (nullSet.has(code.trim().toLowerCase())) continue;
    out.set(code, (out.get(code) ?? 0) + (Number(count) || 0));
  }
  return out;
}

// --------------------------------------------------------------------- census
async function main() {
  const inScope = Object.values(ZONING_LAYERS).filter((z) => SIX_COUNTIES[z.countyFips]);
  console.error(`In-scope layer entries (six counties): ${inScope.length}`);

  const rows = [];
  const cityErrors = [];
  for (const layer of inScope) {
    console.error(`Fetching ${layer.cityKey} (${layer.cityName}, ${SIX_COUNTIES[layer.countyFips]})...`);
    let fetched;
    try {
      fetched = await fetchCodeCounts(layer);
    } catch (e) {
      fetched = { ok: false, error: String(e?.message ?? e), url: layer.layerUrl };
    }
    if (!fetched.ok) {
      cityErrors.push({ cityKey: layer.cityKey, countyFips: layer.countyFips, error: fetched.error, url: fetched.url });
      continue;
    }
    const canonical = canonicalize(layer, fetched.raw);
    for (const [code, parcelCount] of canonical) {
      const table = getSetbackTableForZoning(layer.cityKey, code);
      const mapped = table && table.districts?.length ? mapDistrict(table, code) : null;
      const codified = !!mapped && (mapped.kind === "matched" || mapped.kind === "single");
      let disposition = null, dispositionBasis = null, lowConfidence = false;
      if (!codified) {
        const known = KNOWN_DISPOSITIONS[`${layer.cityKey}:${code.toUpperCase()}`] ?? KNOWN_DISPOSITIONS[`${layer.cityKey}:${code}`];
        if (known) {
          [disposition, dispositionBasis] = known;
        } else if (BDC_PER_PARCEL_CODES.has(code.toUpperCase()) && layer.cityKey === "bastrop-city-tx") {
          disposition = "serve-from-atom-chain";
          dispositionBasis = "P-225 dispatch's own live-read finding: the atom chain holds usable per-parcel setbacks from GIS layer 23 for Bastrop's BDC conditional codes (MU/GC/PDD/PI/IND/OS, P/OS), served today by the facets route; resolveAuthoritativeSetbacks never reaches the atom candidate because mapDistrict gates it out first (authoritativeSetbackSource.ts:258-266)";
        } else {
          const [d, b, low] = defaultDisposition(layer.cityKey, code);
          disposition = d; dispositionBasis = b; lowConfidence = !!low;
        }
      }
      rows.push({
        countyFips: layer.countyFips,
        county: SIX_COUNTIES[layer.countyFips],
        cityKey: layer.cityKey,
        cityName: layer.cityName,
        rawCode: code,
        parcelCount,
        jurisdictionKeyQueried: layer.cityKey,
        tableRouted: table?.jurisdictionKey ?? null,
        matchKind: mapped ? mapped.kind : (table ? "no-row" : "no-table"),
        codified,
        disposition,
        dispositionBasis,
        lowConfidenceDisposition: lowConfidence || undefined,
      });
    }
  }

  const uncodified = rows.filter((r) => !r.codified);
  const codifiedRows = rows.filter((r) => r.codified);
  const byCounty = {};
  for (const r of rows) {
    byCounty[r.county] ??= { districts: 0, uncodifiedDistricts: 0, uncodifiedParcels: 0 };
    byCounty[r.county].districts += 1;
    if (!r.codified) {
      byCounty[r.county].uncodifiedDistricts += 1;
      byCounty[r.county].uncodifiedParcels += r.parcelCount;
    }
  }
  const byDisposition = {};
  for (const r of uncodified) {
    byDisposition[r.disposition] ??= { districts: 0, parcels: 0 };
    byDisposition[r.disposition].districts += 1;
    byDisposition[r.disposition].parcels += r.parcelCount;
  }

  const artifact = {
    instrument: "_inbox/2026-09-15_p225_census_instrument.mjs",
    lane: "p225-setback-codification-census",
    planRows: ["P-225"],
    generatedAt: new Date().toISOString(),
    scopeCounties: SIX_COUNTIES,
    citiesQueried: inScope.length,
    citiesErrored: cityErrors,
    counts: {
      totalDistricts: rows.length,
      codifiedDistricts: codifiedRows.length,
      uncodifiedDistricts: uncodified.length,
      uncodifiedParcels: uncodified.reduce((s, r) => s + r.parcelCount, 0),
      totalParcelsCensused: rows.reduce((s, r) => s + r.parcelCount, 0),
    },
    byCounty,
    byDisposition,
    rows,
  };

  const outPath = OUT || resolve(process.cwd(), "_inbox", `${new Date().toISOString().slice(0, 10)}_p225_census.json`);
  writeFileSync(outPath, JSON.stringify(artifact, null, 2));
  console.error(`\nWrote ${outPath}`);
  console.error(`Districts: ${rows.length}  Codified: ${codifiedRows.length}  Uncodified: ${uncodified.length}  Uncodified parcels: ${artifact.counts.uncodifiedParcels}`);
  if (cityErrors.length) console.error(`City fetch errors: ${cityErrors.map((e) => e.cityKey).join(", ")}`);
  for (const [county, c] of Object.entries(byCounty)) {
    console.error(`  ${county}: ${c.districts} districts, ${c.uncodifiedDistricts} uncodified (${c.uncodifiedParcels} parcels)`);
  }
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
