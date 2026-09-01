You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not vercel. Do not occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. Do not atoms --apply. Do not start P-49. Do not flip texas-rrc.

Plan row P-48. Occupancy: isolated worktree P:/hauska-map-worktrees/serve-pe-p48 branch serve-pe-p48 tracking origin/main. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md item 1. Cortex card `_inbox/2026-08-21_serve_close.json`. Pattern: hauska-map PR 176 landUseFact copy.

## Mission

Copy cortex-root `specialDistrictFact` onto SmartSite inspect. This is the PE half of S1. Cortex PR is LDT 451 (may still be undeployed). Implement against fixtures. Do not wait. Do not invent a MUD.

1. `mergeBakedBaseFacts` (and cortex-off / strip path if live) forwards `specialDistrictFact` from the cortex JSON ROOT. If the root field is missing, leave it absent. Never adopt bake / CAD / mud-pid as that field.

2. Inspect shows a Special district (or MUD/PID) row when `specialDistrictFact.state=present` (districtType + name). Typed `state=absent` stays visible as honest absence. Gold `48021:34137` is `:sd:outside` on the store. Do not paint a MUD on gold.

3. Present substitute for the live probe after planner deploy: `48021:102817` The Colony MUD 1C. Dual grammar on the parcel prefix.

4. `mud-pid` layer `live:true` only if the inspect row is already wired. If you cannot prove both, leave the layer false and say so.

5. IDENT will mint new absence as `{fips}:{integer}:sd` with no third token. If you touch a client parser of entity_id, accept both `:sd:outside` (live store) and exact `:sd` (next apply). Prefer the cortex field. Do not re-parse the store.

Tests: merge copies a fixture `specialDistrictFact` and does not copy bake onto that field. Gold-shaped absent fixture does not render a district name. Present fixture shows MUD 1C.

Leave the diff uncommitted.

## Return

CP1 before edits. CP2 after tests. CLOSE quotes files and tests. leave_behind: planner PR/deploy PE after LDT 451 is serving. Live inspect `48021:34137` must not show a MUD. Live `48021:102817` must show The Colony MUD 1C from `special-district-fact`.
