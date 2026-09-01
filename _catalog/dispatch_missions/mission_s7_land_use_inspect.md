You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud run. Do not gh workflow run. Do not atoms --apply. Do not Harris PBF. Do not re-key the store. Do not mint absence. Do not turn on mud-pid or texas-rrc. Do not touch P:/legacy-design-tools. Do not occupy P:/seat-worktrees/property/legacy-design-tools (that checkout stays seat/property). Do not write hauska-map.

Plan row P-08. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/s7-land-use-inspect branch s7-land-use-inspect tracking origin/main (flood PR 449 already on that SHA). Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md items 5 and 6. Same defect class as flood (item 3, closed live). Scout `_inbox/2026-08-21_s2-family-scout_close.json` land-use-fact row. Copy the flood READ pattern in `artifacts/api-server/src/lib/floodHazardFactRead.ts` (merged on origin/main as PR 449).

## Mission

SmartSite inspect GET `/api/brokerage/v1/place/node/:parcelNodeId/facets` still serves land use from baked `cad_property` / `place_layer_snapshots` (`mergeBakedBaseFacts` / bake). The atom already exists: gold `48021:34137` store hit `entity_type=land-use-fact` `entity_id=48021:34137:2025`. Inspect must read that atom. No new ingest.

Add a NEW sibling field `landUseFact` on the cortex JSON ROOT, parallel to `floodHazardFact`. Do not revive a snapshot land-use bake as the atom path. Keep existing baked `facets.baseFacts.landUse` as the retiredStore field this pass (PE will prefer `landUseFact`). Never SELECT land-use values from `cad_property` for `landUseFact`.

Gold probe: `48021:34137`. Confirmatory: Lockhart `48055:18925` (store hit `48055:18925:2026`).

Bind (fail closed, never a silent null):

- `entity_id` is `${parcelNodeId}:${taxYear}` (writer seam `land-use-fact-writer.ts`). Not the bare parcel id. Flood's `entity_id = ANY(parcel keys)` will miss.
- Dual grammar on the parcel prefix only: `{fips}:{prop}` and `{fips}:{prop}.00000000`, then `:{taxYear}`.
- Query `entity_type=land-use-fact` against both prefixes. Prefer the highest taxYear among hits. Same year on both grammars: serve integer first if bodies agree; `bind-conflict` if they disagree.
- Do not invent a taxYear from cad_property or from the request. Year comes from the atom row.
- Zero hits: typed refusal `code=atom-miss`, `tried` names both prefixes, `source=land-use-fact`.
- `ATOMS_DATABASE_URL` only. Never `DATABASE_URL` (deployment store). Unconfigured: `atoms-store-not-configured`.

Present payload (mirror floodHazardFact shape, land-use fields): `state=present`, `source=land-use-fact`, `boundAs`, `tried`, `entityId`, `taxYear`, `landUseCode`, `landUseLabel` (null if absent), `sourceAdapter`, `sourceVintage`, `evaluatedAt`. Read `landUseCode` / `landUseLabel` from the atom body; do not rename them to cad-roll `code`/`description` on this field.

Tests that fail if cad_property / snapshots are served as `landUseFact`. Tests that pass when a fixture atom on `48021:34137:2025` yields `landUseCode`. Dual-grammar fixture on padded parcel prefix. Gold dual-grammar bind. A boot-proof that the route source wires `landUseFact` from the new module.

Copy floodHazardFactRead structure: bind helper, interpret rows, load function, test seam. Do not POST ledger recompute. Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, files you will touch, bind SQL (prefixes + taxYear, not ANY parcel-only), what you will violate to prove tests. CP2 after tests. CLOSE quotes files, tests, fixture gold result. leave_behind: planner PR/deploy cortex-api; live GET `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A34137/facets` must show `landUseFact.state=present` `source=land-use-fact` and must not copy cad-roll into that field.
