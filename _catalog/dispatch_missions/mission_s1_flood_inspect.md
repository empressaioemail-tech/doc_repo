You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not touch P:/legacy-design-tools. Do not atoms --apply. Do not Harris PBF.

Plan row P-08. Isolated worktree: P:/legacy-design-tools-worktrees/s1-flood-inspect branch s1-flood-inspect HEAD 44d6fa89. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 3 (and 6: no new ingest).

## Mission

SmartSite inspect GET `/api/brokerage/v1/place/node/:parcelNodeId/facets` must return a flood determination from `flood-hazard-fact` atoms. It must NOT serve flood values from `place_layer_snapshots`. SS-W16 stays: `disposeTier2Flood` keeps refusing the tile-centre NFHL bake. The replacement is a NEW read of atoms, not a revival of the bake.

Gold probe parcel: `48021:34137`. Dual grammar: look up both `{fips}:{prop}` and `{fips}:{prop}.00000000` (R-07 Q8). Fail closed if both miss: typed refusal that names the atom miss, never a silent null.

Keep `ci-tier2-flood-not-served` (or equivalent) red if snapshots return as flood. Rewrite tests that currently encode "no input yields a flood value" so they still refuse snapshots AND assert the atoms path can yield a value when a fixture atom exists.

Do not POST ledger recompute. Do not deploy cortex-api (planner-owned). Leave the diff uncommitted in the isolated worktree.

## Return

CP1/CP2/CLOSE at dispatch paths. Quote: files changed, how bind works, test names that fail if snapshots are served, live or fixture result for 48021:34137. leave_behind: deploy + live GET on smartsite.cloud (planner).
