---
id: 2026-07-27_TRACK_B3_executor_close
title: BUILDER-B3 close — map/PDF/inspect vocabulary reconciliation
status: active
date: 2026-07-27
applies_to: [hauska-map, hauska-engine]
cites:
  - 2026-07-27_TRACK_B_customer_ui_quality_WDLL item 5, 6
  - 2026-07-27_TRACK_B3_map_pdf_vocab_reconciliation
---

# B3 executor close (do not claim live agreement)

## PRs (do not merge — planner go)

| Repo | PR | HEAD SHA |
|---|---|---|
| hauska-map | https://github.com/empressaioemail-tech/hauska-map/pull/71 | `c92d72ae6d29acf1e636f806abea4eba0580a66a` |
| hauska-engine | https://github.com/empressaioemail-tech/hauska-engine/pull/141 | `04555f67f6b6d364bbb501c6fe82bf69d272d34f` |

## Mapper location

- PE: `apps/property-explorer/src/lib/buildable-display-vocab.ts` → `mapBuildableDisplay`
- Wired: `deriveBakedCardModel` (map card / inspect), `InspectCard` consume banner via `buildableDisplayKind`
- Engine: `packages/engine-core/src/site-plan/buildable-display-vocab.ts` (identical) → site-model `buildablePdfLabel` + PDF SUMMARY

## Tests

- `mapBuildableDisplay — historical disagreement class (B3)` (9 cases) in both repos
- PE: `baked-facets.test.ts` including `B3: buildableAreaSqFt present without pct…`
- Engine: site-model + pdf/render still green (HOLD-1 provisional note preserved)

## Planner probe (trio — live PE + PDF after deploy)

Parcels: `48021:34785`, `48021:47728`, `48021:47595`.

For each, paste:

1. Map card / persona Buildable line
2. Inspect Buildable row (+ no false consume banner)
3. Site-plan PDF SUMMARY `Buildable Area` line

Pass: same `buildableDisplayKind` family (or honest shared pending on all three). Fail: any pending-vs-consumes-lot split when warm area/geojson exists.

Live agreement is planner-only (WDLL 6).
