You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud run. Do not gh workflow run. Do not atoms --apply. Do not Harris PBF. Do not re-key the store. Do not mint absence. Do not turn on mud-pid or texas-rrc. Do not touch P:/legacy-design-tools. Do not occupy P:/seat-worktrees/property/hauska-map (that checkout stays seat/property).

Plan row P-08. Occupancy: isolated worktree P:/hauska-map-worktrees/s6-dual-grammar branch s6-dual-grammar tracking origin/main (flood PR 174 already on that SHA). Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 5. BP-PARCEL-KEY-01. Scout `_inbox/2026-08-21_s5-bind-scout_close.json`.

## Mission

Integer gold `48021:34137` now serves zoning/setback/envelope/flood on live inspect. Padded `{fips}:{prop}.00000000` still returns an empty atom-chain while the atoms sit on the integer key. Same miss on Lockhart `48055:18925`. Retrieval keys the path segment exactly. That is the remaining item-5 fail.

This card is a LOOKUP ALIAS, not a writer. For a requested parcelNodeId, also try the other grammar:

- `48021:34137` <-> `48021:34137.00000000`
- strip or add a trailing `.00000000` on the propId only
- no other suffixes
- no store UPDATE
- no new entity_id rows

Put the pair helper in `apps/property-explorer/api/_lib/parcel-node-id.ts` (already the shared regex). Use it on:

1. Inspect BFF `fetchAtomChainOnce` / `fetchAtomChain` in `pe-property-atoms.ts`. If the requested key is empty/unusable and the alias is usable, serve the alias chain. Echo the REQUESTED parcelNodeId on the PE response (do not rewrite the customer's URL identity). Warden treats a mismatched echo as unhealthy; the inspect JSON `parcelNodeId` field must stay the request id.

2. Cortex facets fetch used by `mergeBakedBaseFacts` (floodHazardFact). Same pair. Integer gold already returns Zone X; padded must copy that field too. Never adopt `tier2.flood`.

3. Retrieval proxy in `api/spine.ts` for `property-nodes/:id/atom-chain` and `property-nodes/:id/attaching-roads`. Padded attaching-roads is empty today while integer returns roads. Alias the upstream path when the requested key is empty; do not change near-bbox (viewport, not parcel bind).

Out of scope: land-use cad-roll retiredStore, HOLD families, engine retrieval-api deploy, MCP, dual-grammar as a store re-key.

Tests that fail if the alias is removed: padded gold fixture atom-chain empty then alias integer returns usable zoning; cortex merge still copies floodHazardFact and does not copy tier2.flood; attaching-roads padded rewrites to integer when the padded upstream is empty. A helper unit test for the pair (strip, add, refuse a non `.00000000` suffix).

Leave the diff uncommitted. Planner commits, PRs, and deploys after review.

## Return

CP1 before edits: occupancy SHA, files you will touch, alias pair definition, what you will violate to prove the tests. CP2 after tests. CLOSE quotes files, tests, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy; live GET `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137.00000000/facets` must match integer gold on zoning/setback/envelope/floodHazardFact; same pair on Lockhart `48055:18925`.
