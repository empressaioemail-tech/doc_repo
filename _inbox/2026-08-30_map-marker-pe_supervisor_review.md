---
id: 2026-08-30_map-marker-pe_supervisor_review
title: Supervisor grade — map marker + PE copy
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: MAP-MARKER-PE
plan_row: P-92
agent: e389fd26-a0bd-4ed0-99ae-c6bcdb281643
snapshot: integration P:/doc_repo; hauska-map clone P:/seat-worktrees/property/hauska-map-ctx-marker seat/property-ctx-map-marker HEAD a275a45; supervisor re-ran stamp + PE copy tests
---

# Supervisor grade — map marker + PE copy

Seat: integration on `P:/doc_repo`. Reviewed the write path on the clone, not the handback. All five source patches are not git-applyable. Hand apply matches the stated intent. Did not deploy. Did not open `P:/hauska-map`.

## Verdict

Apply accepted. Not customer-done.

| Item | Grade | Evidence |
|---|---|---|
| Bundle marker | MET | Both vite configs define `__HAUSKA_BUILD__` with `UNSTAMPED` fallback. Both `main.tsx` write `dataset.hauskaBuild` and `globalThis.__HAUSKA_BUILD__`. Workflow passes `--build-env HAUSKA_BUILD_SHA="$GITHUB_SHA"`. |
| UNSTAMPED fails | MET | `assertHauskaBuildStamped("UNSTAMPED")` throws. Empty string throws. Stamped `a275a45` passes. Vite source still contains the `UNSTAMPED` string. Supervisor re-ran `hauska-build-stamp.test.ts`. |
| This parcel | MET | Coverage header and `coverageFooterLine` say this parcel, not this area. |
| Land use label | MET | `inspectHighLevelLabel("landUse")` is `Land use`. |
| No `A1 — A1` | MET | `description: landUseLabel ?? ""`. Test refuses `A1 — A1`. |
| yearBuilt with source | MET | `yearBuiltLayerToCardFacet(2021, cad_property)` is present. Same year with null source is not present and contains no `2021`. BFF reads `structuralFact` only. |

## Holes

1. **`main.tsx` writes `UNSTAMPED` to the dataset and does not throw.** The local throw lives on `assertHauskaBuildStamped`, which boot does not call. Gate 8 live A2/A3 is still the preview violate (remove `--build-env` once). This card is the apply.

2. **BFF defaults a missing `structuralFact.source` to `cad_property`.** The card still hides a null source. Production merge will rarely pass null. Do not treat that default as a second derivation.

3. **Source patches are not unified diffs.** Recorded. Do not retry `git apply` on those five files.

## What I did not do

Deploy. Treat 383 as verified (re-ran stamp + baked-facets + InspectCard + fact-sheet + atom-chain: 292 pass, 1 todo). Add `node_modules`.

## Next

Pathspec commit this clone. Customer-done waits on a later live brief plus `dataset.hauskaBuild` equal to the serving sha.
