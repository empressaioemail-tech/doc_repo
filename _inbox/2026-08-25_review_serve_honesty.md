---
id: 2026-08-25_review_serve_honesty
title: Adversarial code review — P-77 honest miss / PE chips / P-74
date: 2026-08-25
status: filed
author: integration reviewer (no commit, no product write, no deploy)
plan_row: P-77
seat: integration on P:/doc_repo
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-25_p77_honest_miss_close.json
  - _inbox/2026-08-25_wave222_pe_chips_close.json
  - _inbox/2026-08-25_factory_operating_instructions.md
---

# Adversarial review: serve honesty (WDLL items 3 and 7)

Code reading outranks the close JSON. Seat is integration reviewer on `P:/doc_repo` main. No product write. No deploy. No atoms `--apply`. No rematerialize. No P-80. No geometry seed. No situs bake.

Who-serves and city-limits are not atom families and not Manifest rails. This review does not treat inspect wiring as a rail cell.

## Snapshot

| Tree | Path | Branch | Commit | Notes |
| --- | --- | --- | --- | --- |
| Reviewer seat | `P:/doc_repo` | `main` | `11763c0d13f0f3b7d622ce637f477e21b8953bb9` | Integration checkout. Dirty working tree ignored. |
| LDT shipped P-77 | `empressaioemail-tech/legacy-design-tools` `origin/main` | `main` | `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce` | #478. Read via `git show`, not the local checkout. |
| Local LDT (not graded) | `P:/legacy-design-tools` | `feat/s1-instrument-hardening` | `10069854f5aa840cc94e6eadbd625c61d3e48010` | Behind P-77. Do not treat as shipped. |
| Property LDT worktree (not graded) | `P:/seat-worktrees/property/legacy-design-tools` | `feat/pe-pricing-ladder-alignment` | `869459f5501e6dd83a70f3a2253e2314c3fd10d6` | Not origin/main. |
| PE shipped #222 | `empressaioemail-tech/hauska-map` `origin/main` | `main` | `9224a735c329ee14501bc03210241e1ecd45ad91` | P-75/P-76 chips + P-74 sentinel. |
| Close-cited typecheck SHA | hauska-map | (absent) | `afc5941` | Not a known object on this clone after `git fetch origin`. Files named in the close live inside `9224a73`. |
| Local hauska-map (not graded) | `P:/hauska-map` | `fix/p35-vercel-token-preflight` | `d3510a6fbfa883907897d66b942579da132b8358` | Not origin/main. |
| Close claims | cortex | serving | `cortex-api-00584-gaf` / image `46e1a5a1` | This review did not re-read Cloud Run traffic JSON. Live facets below match the P-77 strings. |
| Close claims | smartsite.cloud | bundle | `index-DxalqxPC.js` / `dpl_9knoCspkz33ooM2JyppMFRiwt5Be` | Used as the live GET host only. |

Live probe (MEASURED 2026-08-25T14:28Z) `GET https://smartsite.cloud/api/spine/property-atoms/{id}/facets` and `GET https://smartsite.cloud/api/pe-who-serves`. Raw field names used below.

## WDLL 7 grade from CODE: met

Item: `48453:280238` facets name lookup-failed (or equivalent) and the declared vintage. `48453:280239` stays joined. HTTP 200 is not treated as a CAD bind.

**met** on the CAD write path that P-77 actually changed.

Evidence, code: `loadStructuralFactAtom` calls `makeCadPropertyLookup`. A null row goes to `resolveStructuralFactRead({ cadRow: null })`, which calls `buildCadPropertyJoinMissLookupFailed` for any parcel node, not a 280238 special case. `attachVerdictLayersToFacets` copies that absence onto `facets.livingAreaSqft`. The HTTP handler still returns 200 when a baked snapshot exists; the bind signal is `structuralFact.verdict`, not the status code.

Evidence, live 280238 (HTTP 200, `source=atom-chain`):

- `structuralFact.verdict=lookup-failed`
- `structuralFact.scopeSearched=cad_property declared vintage 2026/cad-export`
- `structuralFact.basis=No cad_property row at declared vintage for 48453:280238`
- `facets.livingAreaSqft` same verdict, same scope, same basis
- `facets.baseFacts.landUse=null`
- `facets.baseFacts.situsAddress=null`

Evidence, live 280239 stays joined: `landUseFact.state=present` `landUseCode=A1` `boundAs=48453:280239:2026`. `structuralFact.verdict=absent-verified` with basis `CAD row present but structural fields (living_area_sqft, year_built) are null`. That is a join hit with empty CAMA columns, not a miss.

HTTP 200 on 280238 is the baked node (`adapterKey` / `source=atom-chain`, `facetCoverage.baseFacts=true`, shoelace acreage). It is not a `cad_property` hit.

Caveat that does not drop the grade: `landUseFact` on 280238 is a typed atom absence (`state=absent`, `absence.kind=no-cad-row`), not `lookup-failed`. WDLL 7 says "or equivalent" and names facets, not the land-use atom family. Finding 2 records the split.

## WDLL 3 grade from CODE: partial

Item: live inspect title on `48453:280239` is not `, TX` when `txgio_parcel.situs_address` has a street. Gold `48021:34137` still `908 PINE`. Find/Photon string is not copied onto the county record.

**partial.** The sentinel reject is real. The street title is not delivered.

Evidence, code: `isUsableSitusAddress` requires a first comma-segment that starts with a digit and rejects `^,\s*(TX)?\s*$`. `resolveMergedSitusAddress` writes null when bake and txgio fail that test. `resolveCardHeading` then falls through to `Parcel {apn}`. That is a bind, not a CSS fallback. Photon/nav is not copied onto the county record in the merge (`navigationAddress` fixture in `atom-chain-to-facets.test.ts` stays null).

Evidence, live: gold `48021:34137` `facets.baseFacts.situsAddress=908 PINE , BASTROP, TX 78602`. `48453:280239` `facets.baseFacts.situsAddress` is empty/null, not `, TX`. Wave-222 close already said `txgioParcelSitusAddress` is null. This review did not query `txgio_parcel`. The WDLL "when txgio has a street" precondition is therefore UNMEASURED from the store and FALSE on the close's own txgio claim.

The wave-222 close graded `p74_wdll_item_3=met` because the heading is not `, TX`. That is the weaker half of the item.

## Findings

### 1. HTTP 200 is not a CAD bind on the P-77 fields — note

Live 280238 is HTTP 200 with `structuralFact.verdict=lookup-failed` and null bake land-use / situs. `makeCadPropertyLookup` returns null on declared-year miss (crosswalk and named-fallback are separate; both still null here). The old defect class (200 / present-shaped payload treated as a CAD bind) is not present on `structuralFact`, `livingAreaSqft`, or `baseFacts.landUse`.

Second mechanism that would look the same: a present-shaped land-use atom hiding the miss. Rejected for these three fields. `landUseFact` is typed absence `no-cad-row`, not present. `baseFacts.landUse` is null.

### 2. landUseFact typed absence vs structural lookup-failed — fix-before-next-bind

Same underlying miss, two vocabularies.

- Live 280238 `structuralFact` / `livingAreaSqft`: `verdict=lookup-failed`, vintage `2026/cad-export`.
- Live 280238 `landUseFact`: `state=absent`, `absence.kind=no-cad-row`, `absence.reason=no cad_property row for 48453:280238 at taxYear=2026`, `sourceAdapter=cad-property-land-use-v1`, `boundAs=48453:280238:2026`.
- PE `landUseFromInspectWire` maps `state=absent` to covered absence using the atom reason. It does not stamp `data-verdict=lookup-failed`.
- livingArea is not inverted vs structural. Both are lookup-failed. The inversion is land-use-fact (atom family) vs the live CAD read.

P-77 only changed `structuralFactResolve` / `verdictLayerServe` / the living-area attach. It did not rewrite land-use-fact atoms. Factory instructions say who-serves and city-limits are not atom families; land-use-fact is. A later bind that writes another `no-cad-row` atom will keep the split.

Second mechanism: land-use-fact is a different store, so a present A1 on 280238 would mean a stale atom, not a CAD row. Rejected. The live atom is an absence with `no-cad-row`, which agrees on the fact and disagrees on the verdict word.

### 3. Not gold-only wiring — note

`buildCadPropertyJoinMissLookupFailed` takes `parcelNodeId`. The new test names `48453:280238` as the class label and passes `cadRow: null`. Any id with a null row takes the same branch. No `if (propId === "280238")`.

Second mechanism: the unit test never calls `makeCadPropertyLookup`, so it would stay green if the loader always invented a row. Rejected as a P-77 product defect because the loader's `if (!row)` branch is general and live 280238 / 280239 diverge the way that branch predicts. The test is still not a store proof. Finding 8.

### 4. P-74 sentinel is real; street title is a display fallback — fix-before-next-bind

On `9224a73`, `, TX` is rejected in merge, fact-sheet identity, baked card model, SearchBar subject display, and `resolveCardHeading`. Live 280239 merged situs is null. Title `Parcel 280239` is the heading fallback after that reject, not a second situs value.

The leftover the hunt named (baked-facets treating `, TX` as a street) is closed on this SHA for the bare sentinel. A weaker leftover remains: `isUsableSitusAddress` accepts a first token that starts with a digit, so `17006 DASHWOOD CREEK DR , TX 78660` (the 280210 string in the P-77 close) is still a street. `pe-share-brief` still keeps any trimmed string.

WDLL 3's street-title half is unmet while txgio situs is null. Do not bake situs in this review's lane.

Second mechanism: PE only paints `Parcel 280239` in the heading while still treating `, TX` as present on the sheet. Rejected. `identityFacts` marks unusable situs `absent-covered` before the heading runs.

### 5. Who-serves residual and city-limits ETJ — note

Who-serves: `assembleWhoServesFromHits` always sets `residual=SERVICE-LETTER-REQUIRED` on `status=measured`, including empty holders. `assertWhoServesSection` refuses `{}`. PE `formatWhoServesDisplay` / `whoServesFactPresentation` concatenate summary and residual. Live miss `GET /api/pe-who-serves?lat=26.0&lng=-96.0` is HTTP 200 `holders=[]` plus residual (UTF-8 em dash `E2 80 94`). Gold Bastrop point returned six holders plus the same residual. Item 4's no-polygon-hit residual is not blank on the BFF.

City-limits: `EtjStatus` is the literal `"unresolved"`. `cityLimitsFact.ts` and `containment.ts` have no buffer or offset path. The 2-mile offset test in `boundary.test.ts` forbids a derived ETJ ring. Live 280238 and 280239 are `cityLimitsFact.status=incorporated` `cityName=Pflugerville` `etjStatus=unresolved`. Gold 34137 is incorporated Bastrop, `etjStatus=unresolved`. Item 5's unresolved rule holds.

280238 inspect will not show the who-serves residual because `inspectCardStateFromResolve` on `unplaceable` sets `queryPoint=null` and the chip stays hidden. That is a missing centroid, not a searched miss with a blank residual.

Second mechanism for a blank residual: PE assert failing on a hyphen mismatch and the chip going to error. Rejected. Live residual bytes include `E2-80-94`, matching the PE constant.

### 6. PE chips are not starved of cortex fields — note

Who-serves chip reads `GET /api/pe-who-serves`, which proxies cortex `GET /api/who-serves` (mounted in `routes/index.ts` on `46e1a5a1`). It does not read `facets.whoServes`. That root key is absent on all three live payloads (`WHO_ON_ROOT=false`). That is an intentional split, not a starved facets field.

City-limits chip reads `cityLimitsFact` from the cortex JSON root. Live payloads emit it. PE `cityLimitsFactFromCortexRoot` copies that field only.

Living-area chip reads `facets.livingAreaSqft`. Cortex `attachVerdictLayersToFacets` writes it from `structuralFact`. PE `withVerdictLayerFields` remaps from `structuralFact` again. Live 280238 / 280239 / 34137 all have the wire.

`afc5941` remains UNMEASURED as a commit. The typecheck files the close names are in `9224a73`.

Second mechanism: chips render from bake land-use / situsCity. Rejected for city-limits (source must be `tx_city_boundary`) and who-serves (centroid BFF only).

### 7. Geometry-refusal overlay can hide the CAD miss — fix-before-next-bind

280238 has no map geometry. `UnplaceableParcelCard` says the record is real, names the node, and states a placement gap. It does not say CAD joined. It also does not surface `structuralFact.verdict=lookup-failed` or the declared vintage. The inspect living-area row never mounts on that path (`inspectCardStateFromResolve` returns `baked: null` for unplaceable).

WDLL 7 graded on facets stays met. PE does not claim a CAD bind. It can still present the miss as only a geometry problem.

Second mechanism: PE claims a CAD join on the overlay. Rejected. The copy is placement / "what we hold" (the node), not `cad_property`.

### 8. Tests that lock current output — note

`structuralFactRead.test.ts` P-77 case asserts the builder's own `scopeSearched` / `basis` strings against `cadRow: null`. No `cad_property` fixture. No second derivation. Live 280238 is the authority that makes those strings true.

`baked-facets.test.ts` still has `it.todo("live Tarrant metro GET returns lookup-failed livingAreaSqft")`.

`landUseFactRead.test.ts` uses an invented gold body (`landUseCode: "C1"`) to lock bind grammar. That is not a live CAD authority and does not speak to the 280238 `no-cad-row` atom.

None of these convert a live present-shaped CAD bind into a specification. The P-77 unit test would not catch a loader that fabricates a row.

Second mechanism: the P-77 test is gold-only product code. Rejected. Finding 3.

## leave_behind

```
leave_behind:
- item: land-use-fact atom 48453:280238:2026 still encodes the join miss as typed absence no-cad-row while structuralFact is lookup-failed
  owner: property
  plan_row: P-77 leftover / next land-use-fact writer
- item: 48453:280239 title is Parcel 280239 because txgio situs is null; P-74 street bake not done
  owner: later P-74
  plan_row: P-74
- item: isUsableSitusAddress still accepts street + ", TX" without a city (280210 class)
  owner: property
  plan_row: P-74
- item: 48453:280238 map geometry absent; Unplaceable overlay does not surface CAD lookup-failed
  owner: backlog
  plan_row: null
- item: afc5941 typecheck SHA cited in wave-222 close is not on hauska-map origin/main
  owner: planner
  plan_row: P-75
- item: P-80 Travis join cohort not started
  owner: property
  plan_row: P-80
```

No thesis parity ledger entry. This review did not move atoms, access policy, license, capture jobs, or tiles.
