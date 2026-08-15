---
id: 2026-07-27_S2F_bastrop_county_roadway_proxy_retire
title: Dispatch — Stage 2 Finisher — Bastrop_County_Roadway ingest (retire city OSM proxy)
status: active
date: 2026-07-27
applies_to: [hauska-engine]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [27f_bastrop_through_v2_program]
cites:
  - Stage 2 amendment (proxy retirement — was PARTIAL on StreetsSurveyed2016 alone)
  - S2 close OPEN: city street authoritative source
  - M0.2 / M0.3 (recipe-level promotion target)
related:
  - _inbox/2026-07-26_S2_stage2_planner_close_checkin.md
  - _inbox/2026-07-26_S2U1_planner_verify_checkin.md
  - _scratch/depth-engine-27c.md
---

# S2-F — Retire OSM proxy on city streets (Bastrop_County_Roadway)

You are the EXECUTOR for the Stage 2 Finisher. Build in `P:\hauska-engine` on a branch from **current main** (includes U1+U3). Open a PR on green CI. Return a close with evidence + M0 scratch. Do NOT self-grade done. Planner verifies LIVE. Do NOT promote MEMORY.md yourself. Central-TX stays HELD — no fan-out.

## FLEET MEMORY (M0) — paste-enforced

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read scratch context FIRST. Do NOT promote to durable memory yourself — planner gates promotion. Flush before context roll.

## Scratch context (start warm — DO NOT RE-DERIVE)

```
WHY THIS EXISTS (baked — do not claim proxy retired yet):
LESSON (U1): StreetsSurveyed2016 improves COUNTY CR surface/class but does NOT retire CITY OSM
  labeling proxy. City gold 28286/34785/33512/104985 stayed osm-fallback after U1.
GROUND-TRUTH (S2 close): depth_warm=3642/3657=99.59%; road_nodes=6201 (county-surveyed-2016=1307,
  OSM≈4894). Proxy retirement PARTIAL.
GROUND-TRUTH (BEFORE labels — OSM proxy path):
  28286: e2 front/residential; e3 side_corner/residential
  34785: e3 front/unclassified
  33512: e3 rear/alley(service); e4 front/residential
  104985: e8 front/residential  ← THE TELL — must flip to authoritative gravel

SOURCE PRIORITY (LOCKED):
  Bastrop_County_Roadway (comprehensive city+county)  >  StreetsSurveyed2016 (county CR)
  >  OSM approximate-assumed-per-class (fallback only)
Provenance kinds:
  - county-roadway-authoritative  (this unit — preferred)
  - county-surveyed-2016          (U1 — keep where roadway does not cover / or supersede with clear merge)
  - osm-fallback / approximate-assumed-per-class  (honest remainder — never drop coverage)

GATES THAT MUST STAY GREEN:
  front-labeling fixture gate; geometry / PATCH-A positive-space + genuine-self-touch negative;
  offset-consumes-primitive fixtures; unmapped edges never fabricate setback feet.

DEAD-END: assuming one county layer covers all jurisdiction-level roads (U1 under-retired the proxy).
```

## Source (LOCKED — planner confirmed live)

```
https://maps.co.bastrop.tx.us/server/rest/services/Transportation_BP/Bastrop_County_Roadway/MapServer/0
```

Layer name: `Bastrop_County_Road_Centerlines`. Fields include: `st_name`, `full_name`, `surface`, `surface_width`, `class`, `rdcls_typ`, `owner` (City / County - Bastrop / State / Federal / Private / WCID…), `l_muni`, `r_muni`, `row_permit`, `road_row_year`, polyline geometry (SR 2277 / 102739 — reproject to WGS84 like other intakes).

Win32 note (U1): Node TLS may fail ArcGIS — PowerShell export → fixture → ingest is acceptable; document it.

## What to build

1. **Adapter** mirroring U1 `fetch-streets-surveyed-2016` / `emit-county-road-node` shape under `road-intake/`:
   - Fetch/paginate FeatureServer (maxRecordCount=1000).
   - Map `surface` / `class` / `rdcls_typ` / gravel years into existing roadClass vocabulary (reuse/extend `classify-county-street`).
   - Emit/upsert `road-node` atoms with `row.provenance.kind = county-roadway-authoritative` (+ owner, l_muni/r_muni, surface, surface_width in provenance).
2. **Priority in labeling / warm load**: when multiple roads attach, prefer `county-roadway-authoritative` over `county-surveyed-2016` over OSM. Document merge rule if you retire/supersede overlapping U1 atoms vs keep both with priority.
3. **Ingest full layer** (city + county). Paste feature count + substrate road-node before/after + provenance split.
4. **Mechanical guards**:
   - Fixture: county-roadway gravel beats OSM residential/service on disagreement.
   - Fixture: provenance kind `county-roadway-authoritative` on emit.
   - Existing front-labeling + geometry + U3 primitive fixtures stay GREEN.
5. **Re-promote** place-type cohort after ingest. Expect ≥99.59% or honest improvement; paste before/after. No regression on gates.

## Acceptance (cite in PR + close)

| # | Gate | Observable |
|---|------|------------|
| F.1 | Roadway adapter ingests live features | Count pasted; sample City-owned atom body |
| F.2 | Gold cohort labeling honesty | **If** county has non-null defined surface/class for the attach → provenance `county-roadway-authoritative` and class/surface from county. **If** county row missing OR `surface`/`class` is Undefined/empty → **KEEP OSM**, provenance `osm-best-available` (or retain osm-fallback). **Do NOT** assign authoritative from Undefined — that is worse than the proxy. 104985 is THE tell only when real gravel data exists; no-flip against empty data is an honest MET finding, not a fail. |
| F.3 | Provenance split | Counts: county-roadway-authoritative (defined surface/class only) vs county-surveyed-2016 vs osm-best-available/osm-fallback |
| F.4 | OSM remains for uncovered / undefined | Honest remainder; no coverage drop; never fabricate |
| F.5 | Re-promote ≥99.59% or improve; gates green | Tally + vitest/CI |
| F.6 | Data-population ceiling pasted | Live query counts: city-limits City-owner rows; subset with **defined** (non-Undefined) surface — schema≠data |

## AMENDMENT (planner 2026-07-27 — grade honestly)

Operator live-queried the layer: `owner='City'` is large but roads **inside Bastrop city** (`l_muni/r_muni='BASTROP' AND owner='City'`) are sparse and often `surface='Undefined'` (sample LAUREL/CARTER/SPRING). Layer is skewed to unincorporated county roads. Schema supports city streets; **DATA does not populate them well**.

Interpret F.2 as:
- Real flip to defined authoritative surface/class → retirement MET for that segment.
- No flip / Undefined → **not a failed finisher** — OSM is best-available; mark provenance honestly; do not force retirement against empty data.

## Out of scope

- Boundary primitive shape changes / Stage 3 market-ready UI.
- Central-TX fan-out.
- Weakening guards.
- TxDOT (license unresolved).
- Treating `surface=Undefined` as authoritative truth.

## Close format

File `P:\doc_repo\_inbox\2026-07-27_S2F_executor_close.md` with: PR URL + SHA; feature/ingest counts; sample City atom; per-specimen before/after (esp. 104985); provenance split table; re-promote tally; vitest/CI; M0 scratch block.

Planner verifies; you do not mark Stage 2 proxy retirement done.
