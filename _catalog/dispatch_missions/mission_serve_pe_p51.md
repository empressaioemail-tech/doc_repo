You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not vercel. Do not occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. Do not occupy P:/legacy-design-tools. Do not atoms --apply. Do not footprints apply. Do not start P-52 / P-53. Do not flip texas-rrc. Do not flip mud-pid.

Plan row P-51. Occupancy: isolated worktree P:/hauska-map-worktrees/serve-pe-p51 branch serve-pe-p51 tracking origin/main. Create that worktree if it is missing. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 5. Cortex is already serving. Execute `_inbox/2026-08-22_p51_cortex_execute.json`. Planner review ACCEPT `_inbox/2026-08-22_p51_cortex_planner_review.json`. Pattern: hauska-map PR 179 wellFact copy.

## Mission

Copy cortex-root `buildingFootprintFact` onto SmartSite inspect. This is the PE half of S4. Implement against fixtures. Do not wait. Do not invent a footprint on gold. Do not parse `:primary` as identity.

Footprints are a spatial overlay at WRITE time. Writer keys `${parcelNodeId}:footprint:${footprintId}`. Structure role is `body.structureRole`. Do not copy the special-district `:sd:` picker. Do not copy pipeline `ANY` bind. Do not share the `texas-rrc` key.

1. `mergeBakedBaseFacts` (and cortex-off / strip path if live) forwards `buildingFootprintFact` from the cortex JSON ROOT. If the root field is missing, leave it absent. Never adopt bake / CAD / GIS / `tx_building_footprint` as that field. Never parse the last entity_id token as the role.

2. Inspect shows a Footprint row from `buildingFootprintFact` only. Label `Footprint`. testid `inspect-footprint`.
   - Gold `48021:34137` is live `state=refused` `code=atom-miss` `source=building-footprint`. Honest miss that names the atom. Do not paint `structureRole`, `:primary`, or a footprint on gold. Bastrop `48021` has zero building-footprint rows.
   - Present fixture only: Anderson `48001:10136` `entityId=48001:10136.00000000:footprint:primary` `structureRole=primary` from the body. Live cortex GET of that parcel is HTTP 404 `not_baked`. That is a bake hole, not a footprint miss. Do not use Anderson as the live PE probe. Do not treat a PE 404 as proof of no footprint.
   - A fixture whose entity_id ends `:footprint:primary` but `body.structureRole=accessory` must render accessory. A fixture whose entity_id ends `:footprint:accessory-1` but `body.structureRole=primary` must render primary.
   - Typed `state=absent` (stored `no-footprint-feature`, e.g. fixture `48001:10001`) stays visible as honest absence. A missing field stays missing.

3. Dual grammar: integer gold is the live probe. Alias retries when `buildingFootprintFact` is missing even if flood / land-use / special-district / pipeline / well are already present.

4. `texas-rrc` stays `live:false`. Footprints do not share that key. Do not add a footprint GIS flip.

5. Project for a later planner deploy is `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. You do not deploy.

Tests: merge copies a fixture `buildingFootprintFact` and does not copy bake / GIS / `tx_building_footprint` onto that field. Gold-shaped atom-miss fixture does not render a footprint or `:primary`. Present fixture `48001:10136` shows `structureRole=primary` from the body. Alias retries when `buildingFootprintFact` is missing even if the other root facts are already present. Role-inversion fixtures prove `:primary` is not identity.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, files you will touch, gold must stay atom-miss, Anderson bake hole named, `:primary` is not identity, what you will violate. CP2 after tests. CLOSE quotes files and tests. leave_behind: planner PR/deploy PE. Live inspect `48021:34137` must cite `building-footprint` as atom-miss and must not show a footprint. WDLL item 5 is not met until smartsite.cloud. Do not start P-52 / P-53.
