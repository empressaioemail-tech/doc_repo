You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT Harris PBF. You MUST NOT mint absence. You MUST NOT flip `mud-pid` or `texas-rrc` to live. You MUST NOT write hauska-map. You MUST NOT occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools.

Plan row P-48. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/serve-p48 branch serve-p48 tracking origin/main. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md item 1 (S1) and item 13 (no --apply). Pattern: `artifacts/api-server/src/lib/floodHazardFactRead.ts` and `landUseFactRead.ts` (LDT PR 450). Scout `_inbox/2026-08-21_s2-family-scout_close.json` special-district-fact row: HOLD, `mud-pid` live:false, no inspect SELECT.

## Mission

This card is cortex read for S1 only. PE copy and `mud-pid` live:true are planner follow-on. Do not start P-49.

Add a NEW sibling field `specialDistrictFact` on the cortex JSON ROOT, parallel to `floodHazardFact` / `landUseFact`. Inspect later will prefer that field. Never SELECT special-district values from bake / `place_layer_snapshots` / CAD for this field.

Read the writer before you invent a bind: `write-special-district-fact-county.mjs` and any `special-district-fact` entity_id helper. Q8b (`_inbox/2026-08-21_r07_store_grade.md`) says the join strips `:sd:{districtId}` to reach a parcel. Fail closed if the bind is not independently derived from the writer and a live store row.

Dual grammar on the parcel prefix only: `{fips}:{prop}` and `{fips}:{prop}.00000000`. Zero hits: typed refusal `code=atom-miss`, `tried` names both prefixes, `source=special-district-fact`. `ATOMS_DATABASE_URL` only. Unconfigured: `atoms-store-not-configured`.

A-002 binds: mud is a `district_type` on `special-district-fact`, not a second family. Do not emit a fake mud atom.

Gold probe: a Bastrop (`48021`) parcel that has at least one `special-district-fact` row. Quote the store `entity_id` you bound. If gold `48021:34137` is an atom-miss, say so and name a substitute parcel you actually hit. Confirmatory: a second county.

Present payload (mirror flood shape, district fields): `state`, `source=special-district-fact`, `boundAs`, `tried`, `entityId`, district id, `districtType`, name if present, `evaluatedAt`. Do not invent a type or a name.

Tests that fail if snapshots / CAD are served as `specialDistrictFact`. Tests that pass on a fixture atom. Dual-grammar fixture. A boot-proof that the facets route wires the new field.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, files you will touch, bind SQL (writer-derived, not guessed), what you will violate to prove tests. CP2 after tests. CLOSE quotes files, tests, fixture result, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy cortex-api; then a PE card to copy `specialDistrictFact` onto inspect and consider `mud-pid`. WDLL item 1 is not met until that PE card is live.
