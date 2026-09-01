You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not vercel. Do not occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. Do not occupy P:/legacy-design-tools. Do not atoms --apply. Do not wells apply. Do not start P-51. Do not flip texas-rrc. Do not flip mud-pid.

Plan row P-50. Occupancy: isolated worktree P:/hauska-map-worktrees/serve-pe-p50 branch serve-pe-p50 tracking origin/main. Create that worktree if it is missing. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 4. Cortex is already serving. Execute `_inbox/2026-08-22_p50_cortex_execute.json`. Pattern: hauska-map PR 178 pipelineFact copy.

## Mission

Copy cortex-root `wellFact` onto SmartSite inspect. This is the PE half of S3. Implement against fixtures. Do not wait. Do not invent a well on gold.

Wells are a spatial overlay at WRITE time. Writer keys `${parcel}:${wellKey}`. Do not copy the special-district `:sd:` picker. Do not copy pipeline `ANY` bind. Do not share the `texas-rrc` key.

1. `mergeBakedBaseFacts` (and cortex-off / strip path if live) forwards `wellFact` from the cortex JSON ROOT. If the root field is missing, leave it absent. Never adopt bake / CAD / `texas-rrc` GIS / `tx_rrc_well` as that field.

2. Inspect shows a Well row from `wellFact` only.
   - Gold `48021:34137` is live `state=refused` `code=atom-miss` `source=well-fact`. Honest miss that names the atom. Do not paint `apiNumber14`, `:none`, or a well on gold. Bastrop `48021` has zero well-fact rows.
   - Present fixture only: Crane `48103:100` `entityId=48103:100:42000001030000` `parcelRelation=on-parcel` `apiNumber14=42000001030000` `wellStatus=dry` `operatorName` null. Live cortex GET of that parcel is HTTP 404 `not_baked`. That is a bake hole, not a well miss. Do not use Crane as the live PE probe. Do not treat a PE 404 as proof of no well.
   - Typed `state=absent` (stored `:none`, e.g. fixture `48103:104`) stays visible as honest absence. A missing field stays missing.

3. Dual grammar: integer gold is the live probe. Alias retries when `wellFact` is missing even if flood / land-use / special-district / pipeline are already present.

4. `texas-rrc` stays `live:false`. Wells do not share that key. Do not add a wells GIS flip.

5. Project for a later planner deploy is `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. You do not deploy.

Tests: merge copies a fixture `wellFact` and does not copy bake / GIS onto that field. Gold-shaped atom-miss fixture does not render a well or `:none`. Present-near fixture `48103:100` shows `apiNumber14=42000001030000`. Alias retries when `wellFact` is missing even if the other root facts are already present.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, files you will touch, gold must stay atom-miss, Crane bake hole named, what you will violate. CP2 after tests. CLOSE quotes files and tests. leave_behind: planner PR/deploy PE. Live inspect `48021:34137` must cite `well-fact` as atom-miss and must not show a well. WDLL item 4 is not met until smartsite.cloud. Do not start P-51.
