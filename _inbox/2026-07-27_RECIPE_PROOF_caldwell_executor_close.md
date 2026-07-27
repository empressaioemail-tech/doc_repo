---
id: 2026-07-27_RECIPE_PROOF_caldwell_executor_close
title: Executor close — RECIPE-PROOF Caldwell 48055 (measurement, not done)
status: close
date: 2026-07-27
applies_to: [hauska-engine]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [_inbox/2026-07-27_RECIPE_PROOF_counties_2_3_WDLL.md]
cites: [WDLL 1-11 Caldwell; 27d gates 1-8; 27f Amendment 2]
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/145
sha: 6f2505e9df9c4088e6e8cd48ad462842b6129235
branch: feat/recipe-proof-caldwell-48055
---

# RECIPE-PROOF Caldwell 48055 — executor close (MEASUREMENT)

Executor does **not** self-grade done. Planner verifies LIVE. CTX fan-out HELD. Hays deferred.

## Per-gate tally

| Gate | Verdict | Evidence (one line) | New decision? |
| --- | --- | --- | --- |
| 1 Descriptor | HELD | `caldwell_tx_descriptor.json` mirrors Bastrop shape; RLD/RMD/RHD exact-match + roadClassSetbackTable; hard-hold PDD/CCB/IH/AO/PI/MH omitted | no — classic district codes fit `(district, road-class, edge-role)` without new structure |
| 2 Intake + road recon | RE-OPENED | CAD centerlines 3290 (surfaceDefined≈2278); cityish STREET non-county=55; Lockhart GIS DNS-fail; OSM Lockhart 1887; live ingest road_nodes=5171 auth/undef/osm=2273/1011/1887 | **yes** — propose **UNREACHABLE-CITY-GIS** gate: DNS-fail city endpoints = absent source; fall to OSM; record recon miss (do not invent authoritative) |
| 3 Road + front labeling | HELD | Front-labeling fixture gate 4/4 green on branch; no new Caldwell labeling case surfaced | no |
| 4 Rule | HELD | RLD residential front=25′ / side=7.5′ / rear=10′ from descriptor; alley-specific feet omitted (Ord 2024-18); flat rear fallthrough if alley road appears; tests green | no — honest absence of alley case (gate allows this) |
| 5 Reasoning | HELD | Warm path on main U2/U3 stack; sample promote `48055:103533` area≈14177 insetFeet=[10,10,25,10,10]; verifyFail residuals are honest empty inset (not 28286-class false-reject observed) | no |
| 6 Warm→verify→promote | HELD | Pilot n=100 city+RLD/RMD/RHD: promoted=78 verifyPass=78 verifyFail=21 no-road=1; pass2 offset100 limit400: promoted=259 verifyPass=259 verifyFail=136 no-road=5 | no |
| 7 Tally + cost | HELD | Live depth_warm=337 / place_type=5027 = **6.70%**; all-zoning 337/6490=5.19%; cost extrapolatedJurisdictionUsd≈**0.39** flaggedOverCostGate=false | no |
| 8 Smoke | HELD | Atom `did:hauska:buildable-envelope:48055:103533` depthWarmPromotion=depth-warm-promoted-v1 outcome.areaSqFt=14177 depthWarmVerifiedAt=2026-07-27T13:03:06.409Z | no |

## Generalization number

- **N held = 7**
- **M new-baked (proposed) = 1**

Proposed durable gate for M:

1. **UNREACHABLE-CITY-GIS** — When jurisdiction-level city GIS endpoints fail DNS/HTTP, treat as **absent** (not empty-authoritative). Record recon miss JSON; keep OSM as best-available. Do not invent `county-roadway-authoritative` from missing city layers. Prefer a failing recon fixture test over prose.

## M0-reach miss list

**none** — SCHEMA≠DATA / authoritative-from-defined-surface / footway+residential-first / PATCH-A / offset-consumes-primitive / honest-partial / no PDD invention were applied as baked gates, not re-derived.

## Live numbers (paste)

```
depth_warm / denom / ratio
  depth_warm_promoted = 337
  zoning_place_type (RLD/RMD/RHD) = 5027
  depth_ratio_place_type = 6.7038%
  zoning_facts_with_district = 6490
  depth_ratio_all = 5.1926%
  txgio_parcel 48055 = 32781 (cortex Neon)

road_nodes + provenance split
  road_nodes = 5171
  county-roadway-authoritative = 2273
  county-roadway-undefined = 1011  (excluded from warm labeling pool)
  approximate-assumed-per-class (OSM) = 1887

cost JSON (pilot n=100 city+place-type --promote)
  wallMsTotal=690652
  msPerParcel=6683
  usdPerParcel=0.00008
  extrapolatedJurisdictionUsd=0.4015
  extrapolatedWallHours=9.33
  costGateUsd=200
  flaggedOverCostGate=false

cost JSON (pass2 n=400 offset=100)
  wallMsTotal=2671766
  msPerParcel=6629
  extrapolatedJurisdictionUsd=0.3861
  flaggedOverCostGate=false

named smoke node
  48055:103533
  did:hauska:buildable-envelope:48055:103533
  depthWarmPromotion=depth-warm-promoted-v1
  outcome={ kind: buildable, areaSqFt: 14177 }
  depthWarmVerifiedAt=2026-07-27T13:03:06.409Z
```

Pilot outcomes JSON (summary):

```json
{
  "promoted": 78,
  "verifyPass": 78,
  "verifyFail": 21,
  "declines": { "no-road-adjacency": 1 }
}
```

Pass2 outcomes JSON (summary):

```json
{
  "promoted": 259,
  "verifyPass": 259,
  "verifyFail": 136,
  "declines": { "no-road-adjacency": 5 }
}
```

Recon artifact: `packages/engine-core/src/road-intake/fixtures/caldwell-road-source-recon.json`

## Scratch block

- LESSON (2026-07-27): Caldwell CAD Road_Centerlines is SCHEMA+DATA rich for **county** roads (surfaceDefined≈2278/3290) but **city-street-sparse** (CLASS non-county STREET≈55). Same AUTHORITATIVE-ROAD-SOURCE-RECON mold as Bastrop; city OSM still required for Lockhart.
- LESSON (2026-07-27): Lockhart GIS hostnames DNS-fail — new gate candidate UNREACHABLE-CITY-GIS.
- LESSON (2026-07-27): Lockhart RLD/RMD/RHD port cleanly into Bastrop descriptor shape; no new table structure.
- DEAD-END (2026-07-27): overpass-api.de single Lockhart bbox 504 — tiled kumi.systems + overpass-api.de recovered 1887 ways.
- GROUND-TRUTH (2026-07-27T13:59Z): road_nodes=5171; depth_warm=337; place_type ratio=6.70%; cost ~$0.39; PR #145 CI green @ `6f2505e`.
- OPEN: full Lockhart resolvable universe (~city ∩ RLD/RMD/RHD) not fully warmed — cohort proof only (500 parcels). Planner may order full pass.
- OPEN: Luling/Martindale/Mustang Ridge depth not in this measurement (Lockhart resolvable cohort only).
- OPEN: planner M0 promote of UNREACHABLE-CITY-GIS before Hays #3.

## PR URL + SHA

- PR: https://github.com/empressaioemail-tech/hauska-engine/pull/145
- Branch: `feat/recipe-proof-caldwell-48055`
- SHA: `6f2505e9df9c4088e6e8cd48ad462842b6129235`
- CI: typecheck + test **pass** (run 30270804739)
- Worktree: `P:\hauska-engine-worktrees\recipe-proof-caldwell-48055`

Not merged. Not claiming done.
