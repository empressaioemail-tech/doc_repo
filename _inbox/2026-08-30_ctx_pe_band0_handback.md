---
id: 2026-08-30_ctx_pe_band0_handback
title: Handback — CTX PE wiring Band 0 (F-06 items 1-8)
date: 2026-08-30
status: filed
plan_row: F-06
wdll: _inbox/2026-08-30_ctx_pe_wiring_WDLL.md
seat: property
worktree: P:/seat-worktrees/property/hauska-map-ctx-labels
---

# CTX PE wiring Band 0 handback

Date: 2026-08-30. Property-seat executor. No commit, push, PR, bake, publish, or deploy.

## Snapshot

- Repo: hauska-map
- Worktree: `P:/seat-worktrees/property/hauska-map-ctx-labels`
- Branch: `seat/property-ctx-pe-wiring` (created from origin/main)
- HEAD: `a275a45955944ab4b93edd2e4bbf9de4c696ee6d` (origin/main; #310 `1a00b27` is an ancestor)
- Worktree was clean before the branch. Never stone / chrome / records.
- Diff is uncommitted. Planner commits by explicit pathspec.

#310 only widened `LAYER_ABSENCE_VERDICTS`. Redeploying current main changes nothing. This card is the missing change.

## Files

Modified:

- `apps/property-explorer/api/_lib/verdict-layer-merge.ts`
- `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`
- `apps/property-explorer/src/browse/InspectCard.tsx`
- `apps/property-explorer/src/browse/InspectCard.test.tsx`
- `apps/property-explorer/src/browse/InspectCard.consumer-voice.test.tsx`
- `apps/property-explorer/src/lib/baked-facets.ts`
- `apps/property-explorer/src/lib/baked-facets.test.ts`
- `apps/property-explorer/src/lib/fact-sheet-resolver.ts`
- `apps/property-explorer/src/lib/fact-sheet-resolver.test.ts`
- `apps/property-explorer/src/lib/sheet-to-card-model.ts`
- `apps/property-explorer/src/lib/sheet-to-card-model.test.ts`
- `apps/property-explorer/src/lib/sheet-to-card.ts`

Added:

- `apps/property-explorer/api/_lib/verdict-layer-merge.test.ts`
- `apps/property-explorer/src/lib/land-use-display.ts` + `.test.ts`
- `apps/property-explorer/src/lib/honest-absence-lines.ts` + `.test.ts`
- `apps/property-explorer/src/lib/ctx-pe-acceptance-golds.ts` + `.test.ts`
- `apps/property-explorer/src/lib/ctx-pe-wiring-marker.ts` + `.test.ts`
- `apps/property-explorer/src/lib/rail-absence-copy.ts` + `.test.ts`

## Tests and what each violated

Command (cwd `apps/property-explorer`):

`npx vitest run api/_lib/verdict-layer-merge.test.ts src/lib/land-use-display.test.ts src/lib/honest-absence-lines.test.ts src/lib/ctx-pe-acceptance-golds.test.ts src/lib/ctx-pe-wiring-marker.test.ts src/lib/rail-absence-copy.test.ts src/lib/baked-facets.test.ts src/lib/sheet-to-card-model.test.ts src/lib/fact-sheet-resolver.test.ts src/browse/InspectCard.test.tsx src/browse/InspectCard.consumer-voice.test.tsx src/lib/layer-absence.test.ts`

Pass: 12 files, 329 passed, 1 todo.

Fail-then-pass (item 1), run against HEAD `a275a45` before the union change, 2026-08-30T10:30:46-05:

- `layerAbsenceFromRecord({verdict: stamp-missing})` → null (expected a wire)
- `layerAbsenceFromRecord({verdict: unmeasured})` → null
- served `facets.zoning` stamp-missing / unmeasured not copied
- `structuralFact.yearBuilt` 2021 / 1910 undefined
- `withVerdictLayerFields` left Laird zoning undefined

Bogus verdict and missing-year (do not invent) already passed on main.

Item 3: `inspectHighLevelLabel("landUse", "Land use")` was `"Zone"` on main. Now `"Land use"`. Zoning row stays "Zoning".

Item 2 fixtures (`honest-absence-lines.test.ts`):

- PDD + no-setback-row: one Setbacks line; setbacks half (`no setback table covers this parcel's district`) kept; no "in this area"; no area-level "not stamped"
- SF-1 + setbacks present: zero lines
- unmeasured / stamp-missing: named per row, not an area collapse
- zoning uncovered + setbacks refused: TWO lines

Item 4: `formatLandUseChip("A1", null|"A1"|"A1 — A1")` → `"A1"`. Resolver no longer mints `description: landUseLabel ?? landUseCode`. sheet-to-card-model and `formatLandUseDisplay` use the same chip. sheet-to-card is the third renderer.

Item 5: yearBuilt copied from `structuralFact` when the wire has a finite year; source named (`structural-fact` / `cad-roll`). Missing year stays unknown. Inspect row `inspect-year-built`.

Item 6: `CTX_PE_ACCEPTANCE_GOLDS` includes `48453:231086` (Laird) and `48453:493738` (Shoalwood). A Bastrop-only set fails the test.

Item 7: shipped marker `CTX-PE-WIRING-2026-08-30` on `data-ctx-pe-wiring` of the inspect card. A live fetch of the deployed JS can assert it. A merged PR is not the grade. Not deployed.

Rail-absence (ADR-029 / A-028): PE names `county-coverage` (`No well source published for this county (48055)`). Zero atoms is not unmeasured. `tx_rrc_well` source is refused (P-50). Wells stay well-fact only.

Related suites also green: atom-chain-to-facets 82, chat-research 36, travis-table-backed-serve 3.

## leave_behind

```
leave_behind:
  - item: live customer-done grade (fetch index, fetch bundle, assert CTX-PE-WIRING-2026-08-30, briefs on 48453:231086, 48453:493738, 48021:8720522, 48021:34137)
    owner: planner
    plan_row: F-06
  - item: rail-absence serve path (manifest cell or rail_absence table). PE copy is ready; nothing reads county_manifest yet
    owner: Abs lane
    plan_row: F-06 / A-028
  - item: anti-zombie PE refusal of cortex zoning (atom-chain-to-facets). Copy does not surface Rainmaker PDD if that path still drops the district
    owner: property
    plan_row: F-06
```

No Rainmaker ring invented. No bake. No seed lift. No SmartCity kit. No commit from this seat.
