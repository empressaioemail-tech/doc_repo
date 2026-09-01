import fs from "node:fs";

const COUNTY = {
  48021: "Bastrop",
  48055: "Caldwell",
  48209: "Hays",
  48309: "McLennan",
  48453: "Travis",
  48491: "Williamson",
};

const staged = {
  "bastrop-tx": { fips: "48021", features: 7075, source: "https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoned_Parcels/FeatureServer/83", vintage: "arcgis-live:bastrop-tx:2026-08-12" },
  "elgin-tx": { fips: "48021", features: 3220, source: "https://services3.arcgis.com/wdTkTU0MdZbNBEZy/arcgis/rest/services/Elgin_Zoning/FeatureServer/0", vintage: "arcgis-live:elgin-tx:2026-08-14" },
  "smithville-tx": { fips: "48021", features: 91, source: "https://services3.arcgis.com/wdTkTU0MdZbNBEZy/arcgis/rest/services/Smithville_Zoning/FeatureServer/0", vintage: "arcgis-live:smithville-tx:2026-08-14" },
  "lockhart-tx": { fips: "48055", features: 242, source: "https://services3.arcgis.com/kPfGI7KGlXn5IaHL/arcgis/rest/services/Lockhart_City_Zoning_Online/FeatureServer/0", vintage: "arcgis-live:lockhart-tx:2026-08-12" },
  "luling-tx": { fips: "48055", features: 140, source: "https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_CAD_Parcel_Map/FeatureServer/50", vintage: "arcgis-live:luling-tx:2026-08-12" },
  "martindale-tx": { fips: "48055", features: 17, source: "https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_CAD_Parcel_Map/FeatureServer/51", vintage: "arcgis-live:martindale-tx:2026-08-14" },
  "buda-tx": { fips: "48209", features: 126, source: "https://services6.arcgis.com/vXZW4vAaPRr14z2s/arcgis/rest/services/Zoning/FeatureServer/0", vintage: "arcgis-live:buda-tx:2026-08-14" },
  "dripping-springs-tx": { fips: "48209", features: 422, source: "https://services6.arcgis.com/XnTA1N5QxtOFa9o8/arcgis/rest/services/CODS_Zoning/FeatureServer/0", vintage: "arcgis-live:dripping-springs-tx:2026-08-14" },
  "kyle-tx": { fips: "48209", features: 3502, source: "https://utility.arcgis.com/usrsvcs/servers/cb715452b5464cd08d53449e26fa913d/rest/services/KCH-ESRI/Zoning/FeatureServer/0", vintage: "arcgis-live:kyle-tx:2026-08-12" },
  "san-marcos-tx": { fips: "48209", features: 1001, source: "https://smgis.sanmarcostx.gov/arcgis/rest/services/MPN/MyPermitNowFeatures/MapServer/6", vintage: "arcgis-live:san-marcos-tx:2026-08-14" },
  "woodcreek-tx": { fips: "48209", features: 3165, source: "https://services3.arcgis.com/NYBb8GS1tDodacOa/arcgis/rest/services/Woodcreek_Zoning/FeatureServer/0", vintage: "arcgis-live:woodcreek-tx:2026-08-12" },
  "robinson-tx": { fips: "48309", features: 6340, source: "https://services7.arcgis.com/Ls5quuABi3I5K4Lg/arcgis/rest/services/Zoning_2024/FeatureServer/21", vintage: "arcgis-live:robinson-tx:2026-08-12" },
  "waco-tx": { fips: "48309", features: 6332, source: "https://gis.wacotx.gov/server/rest/services/PublicMap/PublicMap_Planning_and_Economical_Development/FeatureServer/1", vintage: "arcgis-live:waco-tx:2026-08-12" },
  "austin-tx": { fips: "48453", features: 21953, source: "https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/Publish_Zoning_AGOL/FeatureServer/0", vintage: "arcgis-live:austin-tx:2026-08-12" },
  "lakeway-tx": { fips: "48453", features: 749, source: "https://services8.arcgis.com/Ovzem8VyXkJhfTgz/arcgis/rest/services/Zoning_Districts/FeatureServer/0", vintage: "arcgis-live:lakeway-tx:2026-08-12" },
  "pflugerville-tx": { fips: "48453", features: 725, source: "https://maps.pflugervilletx.gov/arcgis/rest/services/Planning/Zoning_Districts/FeatureServer/0", vintage: "arcgis-live:pflugerville-tx:2026-08-12" },
  "cedar-park-tx": { fips: "48491", features: 272, source: "https://gisrest.cedarparktexas.gov/cpgis/rest/services/Planning/Zoning/MapServer/3", vintage: "arcgis-live:cedar-park-tx:2026-08-12" },
  "georgetown-tx": { fips: "48491", features: 1890, source: "https://gis.georgetowntexas.gov/arcgis/rest/services/Planning/PlanningDevelopmentNew_WebMap/MapServer/20", vintage: "arcgis-live:georgetown-tx:2026-08-14" },
  "hutto-tx": { fips: "48491", features: 38, source: "https://services.arcgis.com/YZhxlqU7ABWQBGTG/arcgis/rest/services/Hutto_Zoning_Districts/FeatureServer/0", vintage: "arcgis-live:hutto-tx:2026-08-12" },
  "leander-tx": { fips: "48491", features: 27397, source: "https://services1.arcgis.com/L0MLvN0Ay0iEjnCT/arcgis/rest/services/Leander_Current_Zoning/FeatureServer/3", vintage: "arcgis-live:leander-tx:2026-08-12" },
  "liberty-hill-tx": { fips: "48491", features: 87, source: "https://services8.arcgis.com/qwMz1Ra8Qny9RDxC/ArcGIS/rest/services/Zoning_241031/FeatureServer/0", vintage: "arcgis-live:liberty-hill-tx:2026-08-12" },
  "round-rock-tx": { fips: "48491", features: 856, source: "https://maps.roundrocktexas.gov/arcgis/rest/services/Planning/Planning_Multi/MapServer/12", vintage: "arcgis-live:round-rock-tx:2026-08-14" },
  "taylor-tx": { fips: "48491", features: 8145, source: "https://services7.arcgis.com/SQVxkeGOcRYhZqOD/arcgis/rest/services/Zoning_011720/FeatureServer/46", vintage: "arcgis-live:taylor-tx:2026-08-12" },
};

// landing + DISTINCT stamp. [fips, city, place, in_city, stamped, juris, servedAny, servedDistrict, servedJuris]
const land = [
  ["48021", "Bastrop", "05864", 5819, 5757, "bastrop-city-tx", true, "SF-1", "bastrop_city_tx"],
  ["48021", "Elgin", "23044", 3749, 3692, "elgin-tx", true, "R-2", "elgin_tx"],
  ["48021", "Mustang Ridge", "50200", 1, 0, null, false, null, null],
  ["48021", "Smithville", "68456", 2406, 0, null, false, null, null],
  ["48021", "Webberville", "76924", 17, 0, null, false, null, null],
  ["48055", "Lockhart", "43240", 6490, 6455, null, true, "RLD", "lockhart_tx"],
  ["48055", "Luling", "45096", 2898, 0, null, false, null, null],
  ["48055", "Martindale", "46848", 618, 0, null, false, null, null],
  ["48055", "Mustang Ridge", "50200", 157, 0, null, false, null, null],
  ["48055", "Niederwald", "51492", 170, 0, null, false, null, null],
  ["48055", "San Marcos", "65600", 72, 0, null, false, null, null],
  ["48055", "Staples", "70052", 1, 0, null, false, null, null],
  ["48055", "Uhland", "74216", 221, 0, null, false, null, null],
  ["48209", "Austin", "05000", 423, 0, null, false, null, null],
  ["48209", "Bear Creek", "06242", 195, 0, null, false, null, null],
  ["48209", "Buda", "11080", 5932, 5812, null, true, "F4", "buda_tx"],
  ["48209", "Creedmoor", "17612", 4, 0, null, false, null, null],
  ["48209", "Dripping Springs", "21424", 4016, 3877, null, true, "SF-1", "dripping_springs_tx"],
  ["48209", "Hays", "32906", 117, 0, null, false, null, null],
  ["48209", "Kyle", "39952", 20069, 19767, null, true, "A-DA", "kyle_tx"],
  ["48209", "Mountain City", "49600", 249, 1, null, true, "PC R2", null],
  ["48209", "Niederwald", "51492", 727, 0, null, false, null, null],
  ["48209", "San Marcos", "65600", 18755, 18465, null, true, "MF-12", "san_marcos_tx"],
  ["48209", "Uhland", "74216", 1045, 10, null, false, null, null],
  ["48209", "Wimberley", "79624", 2273, 0, null, false, null, null],
  ["48209", "Woodcreek", "80058", 1030, 0, null, false, null, null],
  ["48309", "Bellmead", "07408", 4352, 10, "waco-tx", true, "C-3", "waco_tx"],
  ["48309", "Beverly Hills", "08104", 838, 25, "waco-tx", true, "R-2", "waco_tx"],
  ["48309", "Bruceville-Eddy", "10828", 1034, 0, null, false, null, null],
  ["48309", "Crawford", "17564", 459, 0, null, false, null, null],
  ["48309", "Gholson", "29408", 840, 0, null, false, null, null],
  ["48309", "Golinda", "30092", 95, 0, null, false, null, null],
  ["48309", "Hallsburg", "31880", 335, 0, null, false, null, null],
  ["48309", "Hewitt", "33428", 5868, 14, "waco-tx", true, "M-2", "waco_tx"],
  ["48309", "Lacy-Lakeview", "40168", 2628, 0, null, false, null, null],
  ["48309", "Leroy", "42400", 320, 0, null, false, null, null],
  ["48309", "Lorena", "44020", 1012, 0, null, false, null, null],
  ["48309", "Mart", "46824", 1495, 0, null, false, null, null],
  ["48309", "Moody", "49200", 1000, 0, null, false, null, null],
  ["48309", "Riesel", "62108", 740, 0, null, false, null, null],
  ["48309", "Robinson", "62588", 5728, 2, "waco-tx", true, "R-1B", "waco_tx"],
  ["48309", "Ross", "63380", 242, 0, null, false, null, null],
  ["48309", "Valley Mills", "74732", 41, 0, null, false, null, null],
  ["48309", "Waco", "76000", 48693, 47401, "waco-tx", true, "M-2", "waco_tx"],
  ["48309", "West", "77332", 1589, 0, null, false, null, null],
  ["48309", "Woodway", "80224", 4523, 41, "waco-tx", true, "R-1B", "waco_tx"],
  ["48453", "Austin", "05000", 204079, 199269, "austin-tx", true, "LA", "austin_tx"],
  ["48453", "Bee Cave", "07156", 2261, 4, "austin-tx", true, "P", "austin_tx"],
  ["48453", "Briarcliff", "10197", 1329, 0, null, false, null, null],
  ["48453", "Buda", "11080", 7, 0, null, false, null, null],
  ["48453", "Cedar Park", "13552", 2389, 0, null, false, null, null],
  ["48453", "Coupland", "17312", 5, 0, null, false, null, null],
  ["48453", "Creedmoor", "17612", 331, 0, null, false, null, null],
  ["48453", "Elgin", "23044", 1706, 0, null, false, null, null],
  ["48453", "Jonestown", "38020", 2769, 0, null, false, null, null],
  ["48453", "Lago Vista", "40264", 12745, 0, null, false, null, null],
  ["48453", "Lakeway", "40984", 8259, 0, null, false, null, null],
  ["48453", "Leander", "42016", 5192, 0, null, false, null, null],
  ["48453", "Manor", "46440", 8081, 1, "austin-tx", true, "RR", "austin_tx"],
  ["48453", "Mustang Ridge", "50200", 1826, 0, null, false, null, null],
  ["48453", "Pflugerville", "57176", 20138, 19977, "pflugerville-tx", true, "R", "pflugerville_tx"],
  ["48453", "Point Venture", "58586", 1086, 0, null, false, null, null],
  ["48453", "Rollingwood", "63008", 603, 13, "austin-tx", true, "P", "austin_tx"],
  ["48453", "Round Rock", "63500", 324, 23, "pflugerville-tx", true, "SF-MU", "pflugerville_tx"],
  ["48453", "San Leanna", "65552", 288, 0, null, false, null, null],
  ["48453", "Sunset Valley", "71324", 332, 6, "austin-tx", true, "P", "austin_tx"],
  ["48453", "The Hills", "72578", 985, 0, null, false, null, null],
  ["48453", "Volente", "75752", 497, 0, null, false, null, null],
  ["48453", "Webberville", "76924", 228, 0, null, false, null, null],
  ["48453", "West Lake Hills", "77632", 1543, 18, "austin-tx", true, "P", "austin_tx"],
  ["48491", "Austin", "05000", 13942, 6, null, false, null, null],
  ["48491", "Bartlett", "05732", 672, 0, null, false, null, null],
  ["48491", "Cedar Park", "13552", 22367, 21895, null, true, "GB", null],
  ["48491", "Coupland", "17312", 297, 0, null, false, null, null],
  ["48491", "Florence", "26136", 549, 0, null, false, null, null],
  ["48491", "Georgetown", "29336", 39015, 38368, null, true, "RS", null],
  ["48491", "Granger", "30548", 784, 0, null, false, null, null],
  ["48491", "Hutto", "35624", 16496, 15592, null, true, "SF-1", null],
  ["48491", "Jarrell", "37396", 2817, 0, null, false, null, null],
  ["48491", "Leander", "42016", 26587, 2150, null, true, "SFU", null],
  ["48491", "Liberty Hill", "42664", 3114, 3048, null, true, "SF2", null],
  ["48491", "Pflugerville", "57176", 102, 8, null, true, "PUD", null],
  ["48491", "Round Rock", "63500", 38839, 37946, null, "unmeasured-min-sample-empty", null, null],
  ["48491", "Taylor", "71948", 8541, 2576, null, true, "P2", null],
  ["48491", "Thorndale", "72776", 4, 0, null, false, null, null],
  ["48491", "Thrall", "72824", 487, 0, null, false, null, null],
  ["48491", "Weir", "77056", 214, 1, null, false, null, null],
];

function keyOf(name) {
  return name.toLowerCase().replace(/\s+village$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-tx";
}

const rows = land.map(([fips, city, place, inCity, stamped, juris, servedAny, servedDistrict, servedJuris]) => {
  const key = keyOf(city);
  const st = staged[key] || null;
  const bleed =
    (servedJuris && city !== "Waco" && servedJuris === "waco_tx") ||
    (servedJuris && city !== "Austin" && servedJuris === "austin_tx") ||
    (servedJuris && city !== "Pflugerville" && servedJuris === "pflugerville_tx") ||
    (juris === "waco-tx" && city !== "Waco") ||
    (juris === "austin-tx" && city !== "Austin");
  return {
    city,
    city_key: key,
    place_fips: place,
    county_fips: fips,
    county: COUNTY[fips],
    in_city_parcels: inCity,
    in_city_source: "landing_parcel_jurisdiction disposition=in-city method=ring",
    layer_present: Boolean(st),
    source: st ? st.source : null,
    vintage: st ? st.vintage : null,
    features: st ? st.features : 0,
    features_count_kind: st ? "tx_zoning_district_staging rows (real polygons, not placeholder)" : "none",
    stamped_district: stamped,
    stamped_count_kind: "distinct landing prop_id with nonempty txgio_parcel.zoning_district",
    sample_zoning_jurisdiction: juris,
    served_district_any: servedAny,
    served_sample_district: servedDistrict,
    served_sample_jurisdiction: servedJuris,
    served_count_kind: "any: place_layer_snapshots adapter node-facets:tier1 place_key=node:{fips}:{prop_id}. Not a city-wide count (full join timed out).",
    foreign_jurisdiction_bleed: Boolean(bleed),
    coverage_pct: undefined,
  };
});

rows.push({
  city: "McGregor",
  city_key: "mcgregor-tx",
  place_fips: "45672",
  county_fips: "48309",
  county: "McLennan",
  in_city_parcels: 0,
  in_city_source: "absent-from-landing (roster primary; containment gap, not a zoning gap)",
  layer_present: false,
  source: null,
  vintage: null,
  features: 0,
  features_count_kind: "none",
  stamped_district: 0,
  stamped_count_kind: "distinct landing prop_id — no landing rows",
  sample_zoning_jurisdiction: null,
  served_district_any: false,
  served_sample_district: null,
  served_sample_jurisdiction: null,
  served_count_kind: "no in-city parcels to serve",
  foreign_jurisdiction_bleed: false,
});

for (const r of rows) delete r.coverage_pct;

const austin = rows.find((r) => r.city_key === "austin-tx" && r.county_fips === "48453");
const smithville = rows.find((r) => r.city_key === "smithville-tx");
const jarrell = rows.find((r) => r.city_key === "jarrell-tx");
if (!austin?.layer_present) throw new Error("Austin layer missing");
if (!smithville?.layer_present || smithville.stamped_district !== 0) throw new Error("Smithville stamp-gap fixture failed");
if (jarrell?.layer_present) throw new Error("Jarrell not-vacuous failed");

const out = {
  at: "2026-09-01T16:12:00Z",
  snapshot: {
    neondb: "2026-09-01T16:02:45.736736Z",
    hauska_mcp: "2026-09-01T16:07:57.356566Z",
    store: "fancy-fire-06136146 br-crimson-feather-aphfmy91",
    engine: "P:/tmp/hauska-engine-zoning-ingest feat/zoning-ingest 10dfc102",
  },
  counting_rules: {
    in_city: "landing_parcel_jurisdiction DISTINCT prop_id, disposition=in-city, method=ring. Unincorporated is not a row and not a gap.",
    layer: "neondb.tx_zoning_district_staging. Features are real acquired polygons, not placeholder rules.",
    stamped: "DISTINCT landing prop_id joined to txgio_parcel after collapsing duplicate geometry rows.",
    served_any: "At least one in-city snapshot has payload_json.zoning.district nonempty. City-wide served COUNT is unmeasured (join timed out at 30s on 48021).",
    no_coverage_pct: true,
  },
  setback_f1: {
    rule: "entity_type=setback-rule, entity_id FIPS range, placeholder = storage-port-proof/phase-1a on sourceCodeAtomRef or fieldProvenance.front|side|rear. Timeout 15s.",
    "48021": { placeholder: 1969, nonPlaceholder: 7534, status: "re-derived 2026-09-01T16:07:57Z" },
    "48055": { placeholder: 5170, nonPlaceholder: 337, status: "re-derived 2026-09-01T16:08:30Z" },
    "48209": { placeholder: 34454, nonPlaceholder: 0, status: "re-derived 2026-09-01T16:08:30Z both=placeholder" },
    "48309": { placeholder: 0, nonPlaceholder: 0, status: "re-derived empty keys, not UNMEASURED. Envelopes 65814 are F4, not F1." },
    "48453": { placeholder: "UNMEASURED this card (15s timeout)", nonPlaceholder: "UNMEASURED this card", lastScoredA3: { at: "2026-09-01T13:16:10Z", placeholder: 22011, nonPlaceholder: 150702 } },
    "48491": { placeholder: 124499, nonPlaceholder: 0, status: "re-derived 2026-09-01T16:09:00Z both=placeholder" },
  },
  live_second_derivation: {
    "48021:34137": { district: "SF-1", jurisdictionKey: "bastrop_city_tx", source: "https://smartsite.cloud/.../48021%3A34137/facets", setback_on_edges: "refused: retired road-class derivation — not a placeholder number" },
    "48453:493738": { district: null, verdict: "unmeasured", note: "gold has no query point; do not use as Travis-absent" },
  },
  rows,
};

fs.writeFileSync(
  "P:/doc_repo/_inbox/2026-09-01_zoning-ingest_city_truth.json",
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify({
  rows: rows.length,
  layer_present: rows.filter((r) => r.layer_present).length,
  stamp_gap_layer_no_stamp: rows.filter((r) => r.layer_present && r.stamped_district === 0).length,
  served_any_true: rows.filter((r) => r.served_district_any === true).length,
  austin_ok: austin.layer_present,
}, null, 2));
