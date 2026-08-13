---
id: 2026-08-13_L14_agent_brief
title: L14 utility deep-research — shared agent brief
status: active
lane: L14
plan_row: P-26
---

# L14 agent brief

You are a discovery agent for lane L14 (P-26). Probe and research only. No store writes. No roster edits. No rail proposals. Never synthesize a hostname.

Read this whole brief before searching. Write your county JSON files under `P:/tmp/l14_utility_research/` and a query log under `P:/tmp/l14_utility_research/logs/`. Do not write `_inbox/` checkpoint files — the planner owns those.

## Mission

Deep-research water / wastewater / electric sources for your assigned counties and their principal cities (plus `also` cities and any incorporated place over 50,000 you encounter). The prior pass (L10) only probed hosts already pinned in recon notes and returned NOT-FOUND-UNKNOWN-WHY for most of the footprint, including cities that OWN their electric utility. The operator standard: FIND WHAT A DILIGENT HUMAN WITH A SEARCH ENGINE FINDS. "We didn't have it bookmarked" is not an absence.

## Discovery ladder — run ALL rungs before any not-found verdict

A verdict without its `rungs_ran` list is invalid.

**R1. WEB SEARCH**, multiple phrasings per city: `"<city> GIS open data"`, `"<city> water utility map"`, `"<city> ArcGIS rest services"`, `"<city> utility open data"`, `"<utility name> GIS"`. Follow the results. Discovered URLs from search are allowed (finding, not guessing).

**R2. ARCGIS ONLINE SEARCH API** `https://www.arcgis.com/sharing/rest/search`. Find the city's/utility's AGOL org and hub by name. Enumerate feature services with utility keywords AND by browsing the org's full service list. Name-keyword search alone is the /zon/ trap (hurricane evacuation zones matched "zon").

Example queries (GET, `f=json`, `num=50`):

- `q=title:"Austin Water" AND type:"Feature Service"`
- `q=orgid:<orgid>` then page through
- `q="Denton Municipal Electric"`
- After you have an orgid: `https://<org>.maps.arcgis.com/sharing/rest/search?q=orgid:<orgid>&f=json&num=100`

**R3. OPEN-DATA PORTAL DISCOVERY.** Socrata discovery API, `data.<city>.gov`, `<name>.opendata.arcgis.com`, CKAN. Directory lookups are allowed.

- Socrata: `https://api.us.socrata.com/api/catalog/v1?q=water%20main&domains=data.austintexas.gov`
- CKAN: `https://data.sanantonio.gov/api/3/action/package_search?q=water+main`

**R4. WEBMAP UNWRAPPING.** When a city or utility exposes a public interactive utility viewer, fetch the webmap/app item JSON (`f=json`) and extract operational layer service URLs. A public viewer is a public service pointer.

- Item data: `https://www.arcgis.com/sharing/rest/content/items/<id>/data?f=json`
- Item meta: `https://www.arcgis.com/sharing/rest/content/items/<id>?f=json`

**R5. UTILITY-OWNED PORTALS**, not just city portals. Known municipal-electric owners in footprint (verify explicitly if in your counties): Austin Energy, CPS Energy (San Antonio), Denton Municipal Electric, Georgetown Utility Systems, Garland GP&L, Greenville GEUS. Water: SAWS, Austin Water, Dallas Water Utilities, Fort Worth Water. Plus co-ops (Bluebonnet, Pedernales, Oncor public layers) and river authorities (LCRA, Brazos).

**R6. STATE INVENTORIES** — you may note hits, but the planner owns the PUCT sewer zip download, TWDB viewer unwrap, TCEQ, TxGIO, NCTCOG full walk. Still RUN R6 searches for your counties (TWDB/NCTCOG/TxGIO keyword + county name) and record what you found. Do not skip R6 and dump it on the planner.

**R7.** Only after R1-R6: the honest typed verdict.

## Typed verdicts

Use these strings only:

- `LAYER-FOUND` — queryable public layer OR download product OR viewer-unwrapped service, verified by returnCountOnly PLUS groupBy or center/corner probe. Never advertised name/extent alone.
- `AUTH-WALLED` — GIS exists behind login/agreement/CEII. First-class honest verdict. Never credential-guess. Never scrape behind a login. Record the login URL.
- `HOST-BROKEN` — discovered host down or Application Error.
- `ORDINANCE-NO-GIS` — provider requires service letter / no public GIS.
- `NOT-FOUND-UNKNOWN-WHY` — ALL rungs ran; still no positive. Must list rungs_ran.
- `SERVICE-LETTER-REQUIRED` — product terminal where line-level truth is withheld. Record alongside ORDINANCE-NO-GIS when that is the honest answer.

Access form: `REST layer` | `open-data download` | `viewer-only-unwrapped` | `download-product` | `records-request-only` | `auth-walled`.

Publisher: `city` | `utility` | `district` | `state` | `cog` | `coop` | `river_authority`.

Geometry class: `mains` | `laterals` | `points` | `territory` | `transmission` | `basins` | `unknown`.

Electric pole POINTS without a distribution graph are `points`, not mains. Watering-day polygons, storm drain (unless sanitary), hydrography, cleanup sites, flood, city limits under a Distribution folder, EV chargers are FALSE FRIENDS — reject.

## Verify every found layer

```
GET {layerUrl}/query?where=1%3D1&returnCountOnly=true&f=json
```

Then either groupBy on a county/utility field, or a center-point / corner envelope probe with `returnCountOnly=true`. Record the verbatim JSON snippet (count + any groupBy rows). HTTP timeout 30s. No pagination storms.

If 401/403/login redirect: `AUTH-WALLED`. Stop. Do not guess credentials.

## Output

Write `P:/tmp/l14_utility_research/{fips}_{county}.json` with this shape:

```json
{
  "fips": "48453",
  "county": "Travis",
  "agent": "L14-A",
  "cities_probed": ["Austin", "Pflugerville"],
  "rungs_ran_county": ["R1","R2","R3","R4","R5","R6"],
  "rows": [
    {
      "city": "Austin",
      "utility": "water",
      "status": "AUTH-WALLED",
      "publisher": "utility",
      "publisher_name": "Austin Water",
      "access_form": "auth-walled",
      "url": "https://...",
      "feature_count": null,
      "probe_evidence": "...",
      "geometry_class": "unknown",
      "rungs_ran": ["R1","R2","R3","R4","R5","R6"],
      "l10_status": "NOT-FOUND-UNKNOWN-WHY",
      "diff_vs_l10": "REFUTED",
      "queries": ["Austin water utility map", "..."]
    }
  ],
  "search_log_path": "P:/tmp/l14_utility_research/logs/48453_queries.jsonl"
}
```

Append every search query and every URL probed to the jsonl log as one JSON object per line: `{"ts":"...","rung":"R1","query_or_url":"...","http_status":200,"note":"..."}`.

Also write a short `P:/tmp/l14_utility_research/{fips}_{county}_summary.md` naming the strongest find per utility.

## L10 baseline (do not copy as your answer)

L10 close: `_inbox/2026-08-12_L10_utility_probe_close.json`. Your job is to refute or confirm those rows by running the ladder, not by re-walking the same catalogue hosts.

Statewide already known (do not re-derive; you may cite):

- PUCT water CCN REST: `https://services2.arcgis.com/LYMgRMwHfrWWEg3s/arcgis/rest/services/PUCT_Water_CCN_Service_Areas/FeatureServer/0` count 3812, all 28 footprint counties.
- HIFLD electric retail territories on the same org.
- HIFLD transmission lines on the same org.
- TCEQ water districts on the same org.
- These are TERRITORY / who-serves, not mains. Still record them as the statewide floor, then hunt city/utility line geometry.

## Hard rules

1. NEVER synthesize `gis.<city>tx.gov`. If search/directories/webmaps did not produce the URL, you do not have it.
2. AUTH-WALLED is success for the prediction. Treat it as a real find.
3. Do not write atoms, staging, roster, or rails.
4. Cotality is extinguished. Regrid is dead. Do not touch either.
5. Finish your assigned counties. Do not return a partial "here's the plan."
