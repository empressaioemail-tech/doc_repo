You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud run. Do not gh workflow run. Do not atoms --apply. Do not Harris PBF. Do not touch P:/legacy-design-tools.

Plan row P-08. Worktree: P:/seat-worktrees/property/hauska-map branch seat/property. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 3.

## Mission

Live SmartSite inspect is PROPERTY_ATOM_PATH=1 (`X-PE-Read-Path: atom-chain-warm`). GET `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` has no `floodHazardFact`. Cortex PR 449 adds that field on GET `/api/brokerage/v1/place/node/:id/facets`. The PE BFF must copy it onto the atom-chain payload.

1. `mergeBakedBaseFacts` (and the cortex-off / strip path if it is the live path) forwards `floodHazardFact` from the cortex JSON root. Do not adopt `tier2.flood`. Snapshot flood stays refused. If cortex body has no `floodHazardFact`, leave the field absent (honest), never invent a zone.

2. InspectCard shows a Flood row for gold `48021:34137` from `floodHazardFact` only: present zone, typed absence, or named refusal (`atom-miss` / `atoms-store-not-configured`). Never a silent null. Never `tier2.flood`.

Tests: merge copies a fixture `floodHazardFact` and does not copy `tier2.flood`. A missing field stays missing. Card test if one exists; otherwise a mapper unit test.

Leave the diff uncommitted. Planner commits after review.

## Return

CP1/CP2/CLOSE at dispatch paths. Quote files, lines, tests. leave_behind: planner commit/PR hauska-map.
