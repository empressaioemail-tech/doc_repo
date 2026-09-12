# OPS-23 checkpoint 1 — end of wave 1

## Snapshot

- doc_repo HEAD: `a90adbb5` (`docs(OPS-23): wave 1 compiled for the dispatch planner; topology active; probe predicates for P-155/157/158/159/167`)
- origin/main of every repo touched this wave:
  - hauska-engine: `ce6a75af66aa4f606a348d86089b83b817957296`
  - hauska-map: `8b44f68db96d11624ed08631e01baa3d7b6b9814`
  - legacy-design-tools: `d58a033b90794d96d76eaf8e114b662bfc0e1cb4`
  - hauska-atom-contract: `995df5131b0490ed329ac5bb8d5ecbcfe43e4a44`
  - hauska-factory: `217b7dd7eb3a1b2f72f3a72d333008079f71fcaf` (unchanged this wave — P-157 stopped at CP1 before any merge, P-158's PR #421 is open/unmerged)

## Lane board (`node scripts/ops23-lane-status.mjs`, pasted verbatim)

```
OPS-23 LANE STATUS   2026-09-11T23:59:05.959Z   doc_repo a90adbb5
row    registered worktree                                    on disk  branch                          ahead  artifacts
P-151  P:/seat-worktrees/property/hauska-map-p151-seam      yes      fix/p151-placement-seam             1  -   placement never depends on geocoding
P-151  …ees/property/legacy-design-tools-p151-point-route   yes      fix/p151-envelope-point-route       2  -   placement never depends on geocoding
P-160  (doc_repo, integration seat)                         n/a      main                                -  CLOSE   surface probe instrument (doc_repo)
P-153  P:/seat-worktrees/property/hauska-map-p153-draw      yes      fix/p153-wire-live-envelope-augment     0  -   envelope polygon drawn, figure refused
P-153  …-worktrees/property/legacy-design-tools-p153-draw   yes      feat/p153-mcp-draw-polygon          3  -   envelope polygon drawn, figure refused
P-152  …seat-worktrees/property/hauska-engine-p152-reader   yes                                          0  -   one reader in retrieval-api
P-152  …property/legacy-design-tools-p152-cortex-consumer   yes      fix/p152-cell-read-never-throws     1  -   one reader in retrieval-api
P-154  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   most-current setback resolver
P-155  …ees/property/hauska-engine-p155-feasibility-async   yes                                          0  cp1+cp2+CLOSE   async feasibility refresh
P-155  …rktrees/property/hauska-map-p155-feasibility-poll   yes                                          0  cp1+cp2+CLOSE   async feasibility refresh
P-155  …roperty/legacy-design-tools-p155-feasibility-poll   yes      feat/p155-mcp-poll-budget-fix       1  cp1+cp2+CLOSE   async feasibility refresh
P-156  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   Travis city queue
P-157  …worktrees/property/hauska-factory-p157-structural   yes      feat/p157-tcad-improvement-detail     0  cp1   TCAD improvement detail
P-157  …rees/property/legacy-design-tools-p157-cad-ingest   yes      feat/p157-tcad-improvement-detail     0  cp1   TCAD improvement detail
P-158  …-worktrees/property/hauska-factory-p158-footprint   yes      feat/p158-footprint-join            0  cp1+cp2+CLOSE   footprint join
P-158  …trees/property/legacy-design-tools-p158-footprint   NONE YET -                                   -  cp1+cp2+CLOSE   footprint join
P-158  …orktrees/property/hauska-map-p158-footprint-layer   NONE YET -                                   -  cp1+cp2+CLOSE   footprint join
P-158  …t-worktrees/property/hauska-engine-p158-footprint   yes      feat/p158-footprint-absence-split     1  cp1+cp2+CLOSE   footprint join
P-159  P:/seat-worktrees/property/hauska-engine-p159-pdf    yes      feat/p159-one-buildable-figure      2  cp1+cp2+CLOSE   one buildable figure per PDF
P-161  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   identity rulings + crosswalk type
P-162  (doc_repo, integration seat)                         n/a      main                                -  -   rail-to-atom map (doc_repo)
P-163  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   one writer: atom + pointer + rendering
P-164  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   mint atoms from gated cells
P-165  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   edges as atoms; hop1/subgraph
P-166  NOT REGISTERED -- not dispatchable yet               -        -                                   -  -   node succession
P-167  P:/seat-worktrees/property/hauska-map-p167-vocab     NONE YET -                                   -  -   one vocabulary package
P-167  …/seat-worktrees/property/hauska-engine-p167-vocab   NONE YET -                                   -  -   one vocabulary package
P-167  …worktrees/property/legacy-design-tools-p167-vocab   NONE YET -                                   -  -   one vocabulary package
P-167  …rktrees/substrate/hauska-atom-contract-p167-vocab   yes      feat/p167-display-vocabulary        1  -   one vocabulary package

NOT REGISTERED means no worktree entry exists in _catalog/seat_register.json for that row; register before dispatching.
NONE YET means registered but not created on disk; the lane creates it from origin/main. ahead = origin/main..HEAD.
artifacts are _inbox checkpoint/close files by dispatch slug. Run scripts/surface-probe.mjs for the predicate; this is only the board.
```

Note: this board reads `_inbox` in this worktree, which now has copies of every lane's checkpoint/close artifact (originally scattered across `P:/doc_repo`, `P:/seat-worktrees/property/doc_repo`, and this worktree — three different locations three different lanes independently chose, since no lane dispatch this wave named a doc_repo worktree for lanes that don't have one of their own). P-157 shows only `cp1` because it stopped there by design; it has no close.

## Probe output (final combined run, pasted verbatim, run id in the artifact)

Command: `node scripts/surface-probe.mjs --rows P-155,P-157,P-158,P-159,P-167 --observations _inbox/2026-09-11_ops23wave1_observations_combined.json --allow-unmeasured`

```
SURFACE PROBE  2026-09-11T23:55:52.552Z  doc_repo a90adbb5  source live  PE https://smartsite.cloud  observations sha256 a75876a8ca5a

LEGS (measured live unless marked)
  48021:34049
    facets       http 200 readPath atom-chain-warm bakedAt 2026-08-05T22:50:17.122Z zoning SF-1 envelope ok setbacks 25/5/25/15 city incorporated point yes
    env/address  http 200 status ok node 48021:34049 setbacks 30/10/30/20 vertices 6 946 ms
    env/point    http 200 status ok node 48021:34049 974 ms
    gis ring     http 200 features 44 matches false NO-CONTAINING-POLYGON (nearest 48021:34057 64 m)
    near-bbox    http 200 count 0 522 ms
    cortex node  NOT MEASURED REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed
  48021:33223
    facets       http 200 readPath atom-chain-warm bakedAt 2026-08-08T09:53:37.224Z zoning GC envelope ok setbacks 20/5/20/- city incorporated point yes
    env/address  http 200 status ok node 48491:R419407 setbacks 25/7/15/7 vertices 6 661 ms
    env/point    http 404 status no-district node 48021:33223 1192 ms
    gis ring     http 200 features 42 matches false NO-CONTAINING-POLYGON (nearest 48021:73722 24 m)
    near-bbox    http 200 count 0 288 ms
    cortex node  NOT MEASURED REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed
  48453:113408
    facets       http 200 readPath atom-chain bakedAt 2026-07-24T20:57:30.744Z zoning - envelope declined setbacks none city incorporated point yes
    env/address  http 422 status error:geocode_miss node - setbacks none vertices - 218 ms
    env/point    http 200 status declined node 48453:113408 2302 ms
    gis ring     http 200 features 26 matches true by id
    near-bbox    http 200 count 0 1552 ms
    cortex node  NOT MEASURED REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed
  48453:474034
    facets       http 200 readPath atom-chain bakedAt 2026-07-24T20:57:30.744Z zoning - envelope declined setbacks none city unincorporated point yes
    env/address  http 422 status error:geocode_miss node - setbacks none vertices - 227 ms
    env/point    http 200 status declined node 48453:474034 1743 ms
    gis ring     http 200 features 70 matches true by id
    near-bbox    http 200 count 0 1308 ms
    cortex node  NOT MEASURED REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed
  48453:367134
    facets       http 200 readPath atom-chain bakedAt 2026-07-24T20:57:30.744Z zoning SF-2 envelope ok setbacks 25/5/10/15 city incorporated point yes
    env/address  http 200 status ok node 48453:367134 setbacks 25/5/10/15 vertices 7 632 ms
    env/point    http 404 status no-district node 48453:367134 1425 ms
    gis ring     http 200 features 66 matches true by id
    near-bbox    http 200 count 0 1170 ms
    cortex node  NOT MEASURED REFUSED: CORTEX_API_BASE, CORTEX_SERVICE_API_KEY and CORTEX_API_KEY_HEADER not all set; the header name is declared, never guessed

FINDINGS (not a row predicate; never silent)
  NO-CONTAINING-POLYGON 48021:34049  the live parcel layer (Bastrop County GIS parcels) returned 44 features around the record point and none contains it; nearest 48021:34057 911 FARM ST at 64 m. Either the layer has a hole at this parcel or the record point is wrong; the probe does not choose
  FIGURE-IN-PAYLOAD  48021:34049  buildableAreaSqFt travels in the panel payload; the figure is refused by ruling and must not be printed by any surface (P-153 observation figurePrinted)
  WRONG-PARCEL       48021:33223  endpoint answered ok for 48491:R419407 when asked about 48021:33223; any consumer that does not compare node ids will serve another lot
  NO-CONTAINING-POLYGON 48021:33223  the live parcel layer (Bastrop County GIS parcels) returned 42 features around the record point and none contains it; nearest 48021:73722 925 MAIN ST at 24 m. Either the layer has a hole at this parcel or the record point is wrong; the probe does not choose
  FIGURE-IN-PAYLOAD  48021:33223  buildableAreaSqFt travels in the panel payload; the figure is refused by ruling and must not be printed by any surface (P-153 observation figurePrinted)

PREDICATES
  UNMEASURED P-155 48453:474034  refresh http 202 (202 required); MCP PDF OBSERVED yes; app PDF without retry not observed
  UNMEASURED P-155 48021:34049  refresh http 202 (202 required); MCP PDF OBSERVED yes; app PDF without retry not observed
  FAIL       P-157 48453:113408  structuralFact absent; livingAreaSqft null; yearBuilt null (readPath atom-chain, bakedAt 2026-07-24T20:57:30.744Z)
  FAIL       P-157 48453:474034  structuralFact absent; livingAreaSqft null; yearBuilt null (readPath atom-chain, bakedAt 2026-07-24T20:57:30.744Z)
  FAIL       P-158 48021:34049  buildingFootprintFact absent
  FAIL       P-158 48453:113408  buildingFootprintFact absent
  PASS       P-159 48021:34049  distinct buildable figures printed 1; percent without atom OBSERVED no; sheet 2 claims empty lot OBSERVED no
  UNMEASURED P-167 48021:34049  strings identical not observed; parity locks deleted not observed; package not observed imported by none observed; importers missing hauska-map,hauska-engine,legacy-design-tools
  UNMEASURED P-167 48021:33223  strings identical not observed; parity locks deleted not observed; package not observed imported by none observed; importers missing hauska-map,hauska-engine,legacy-design-tools
  UNMEASURED P-167 48453:113408  strings identical not observed; parity locks deleted not observed; package not observed imported by none observed; importers missing hauska-map,hauska-engine,legacy-design-tools
  UNMEASURED P-167 48453:474034  strings identical not observed; parity locks deleted not observed; package not observed imported by none observed; importers missing hauska-map,hauska-engine,legacy-design-tools
  UNMEASURED P-167 48453:367134  strings identical not observed; parity locks deleted not observed; package not observed imported by none observed; importers missing hauska-map,hauska-engine,legacy-design-tools

  PASS 1  FAIL 4  UNMEASURED 7

artifact: P:/seat-worktrees/dispatch-planner/doc_repo/_inbox/2026-09-11_235552_surface_probe.json
```

## Rulings taken since the last checkpoint

None before this wave existed (this is checkpoint 1). No new standing ruling was made by the dispatch planner this wave — only application of the five rulings already recorded 2026-09-11 (R-1 through R-6, OPS-23 §3) to five rows.

## Planner claims a lane or the probe contradicted (section 10 shape)

See `errorLog` in `_inbox/2026-09-11_ops23-wave1_close.json` for the four numbered entries (F8 staleness; P-155's own probe-predicate claim; the close-schema/gate mismatch; the join-vs-data mechanism mistake on P-158).

## Next three concrete actions

1. **P-157**: overseer/operator ruling on the break-glass-vs-new-infra question for the CAD loader, naming row/file `_inbox/2026-09-11_p157-structural_cp1.json`; no further lane work until that ruling lands.
2. **P-158**: overseer review and merge/hold decision on `hauska-engine` PR #421 (open), naming `_inbox/2026-09-11_p158-footprint_close.json`.
3. **P-167**: re-check `gh pr list --repo empressaioemail-tech/hauska-map --search p153 --state merged` (and the same for legacy-design-tools) before cutting the three held consumer worktrees named in `_catalog/dispatch_missions/mission_p167_display_vocabulary.md`.
