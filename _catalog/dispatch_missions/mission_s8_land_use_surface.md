You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud run. Do not gh workflow run. Do not atoms --apply. Do not Harris PBF. Do not re-key the store. Do not mint absence. Do not turn on mud-pid or texas-rrc. Do not touch P:/legacy-design-tools. Do not occupy P:/seat-worktrees/property/hauska-map (that checkout stays seat/property).

Plan row P-08. Occupancy: isolated worktree P:/hauska-map-worktrees/s8-land-use-surface branch s8-land-use-surface tracking origin/main (dual-grammar PR 175 already on that SHA). Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 5 (land-use leftover) and item 6 (no new ingest). Flood surface pattern: hauska-map PR 174 `mergeBakedBaseFacts` copies cortex-root `floodHazardFact`; `floodFact` reads that field only. Scout `_inbox/2026-08-21_s2-family-scout_close.json` land-use-fact row: adapter hardcodes `facetCoverage.landUse=false` then merges baked cad-roll.

## Mission

Live inspect still shows land use from baked cad-roll (`facets.baseFacts.landUse` `source=cad-roll`). The atom is in store (`48021:34137:2025`). Cortex lane s7 adds root sibling `landUseFact` from `land-use-fact` atoms (same shape family as `floodHazardFact`). This card is the PE copy + inspect Land use row. Cortex may still be undeployed: implement against fixtures. Do not wait. Do not invent a zone or a land-use code.

1. `mergeBakedBaseFacts` (and cortex-off / strip path if live) forwards `landUseFact` from the cortex JSON ROOT. Do not adopt baked `facets.baseFacts.landUse` as `landUseFact`. If the root field is missing, leave `landUseFact` absent (honest). Keep copying baked landUse onto `facets.baseFacts` this pass so acreage/situs do not regress; Land use DISPLAY must not prefer cad-roll once `landUseFact` is present.

2. Inspect Land use row reads `landUseFact` when the field is present (`state=present` uses `landUseCode` / `landUseLabel`; typed absence / named refusal stays visible). When `landUseFact` is missing, hide the Land use row or keep the existing baked path labelled as retiredStore in tests — never silently swap cad-roll into `landUseFact`. Provenance source on the atom path is `land-use-fact`, never `cad-roll`.

3. Dual-grammar alias already exists (`parcelGrammarAlias`). Cortex facets fetch used by merge must treat a missing `landUseFact` the same way it treats a missing `floodHazardFact` (try alias). Echo the REQUESTED `parcelNodeId`.

Tests: merge copies a fixture `landUseFact` and does not copy cad-roll `baseFacts.landUse` onto that field. A missing field stays missing. Card/resolver: present gold uses `landUseCode` from `landUseFact` with `source=land-use-fact`; a cad-roll-only bake without `landUseFact` does not claim the atom. Alias: padded request missing `landUseFact` aliases integer root.

Leave the diff uncommitted. Planner commits, PRs, and deploys after review.

## Return

CP1 before edits: occupancy SHA, files you will touch, field contract (`landUseFact` root sibling), what you will violate to prove the tests. CP2 after tests. CLOSE quotes files, tests, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy after s7 cortex is serving; live GET `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` must show `landUseFact.source=land-use-fact` and Inspect Land use must not cite cad-roll when the atom field is present. Same pair on Lockhart `48055:18925`.
