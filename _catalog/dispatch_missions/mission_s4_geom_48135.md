You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not touch P:/legacy-design-tools. Do not atoms --apply. Do not Harris PBF. Do not POST ledger recompute. Do not run countyGeometryScoreCli without --county=48135. Do not --all.

Plan row P-01. cwd: P:/seat-worktrees/property/legacy-design-tools on seat/property (CLI only, no git writes). Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 6.

## Mission

Score geometry for Ector 48135 now that parcel-nodes are geo_id-keyed (75859 active). Named denom: `count(DISTINCT feature_index) FROM txgio_parcel WHERE county_fips = '48135'`. That is what `countyGeometryScoreCli.ts` already documents. Do not invent accounted-features.

Dry-run first:
`tsx artifacts/api-server/src/countyGeometryScoreCli.ts --county=48135 --dry-run`

Quote atoms / features / pct / rail_state. Then write (omit --dry-run). Env: gcloud DATABASE_URL hauska-prod-497015 and DEPLOYMENT_DATABASE_URL legacy-design-tools-prod. Do not print secrets.

Progress: P:/tmp/s4_geom_48135/progress.log. Watch `_catalog/watch_registry/s4-geom-48135.json`.

Verify Neon: geometry facet 48135 last_verified_at moved off 2026-08-12T12:42:12.313Z. If dry-run pct < 95, still write the honest not-yet (allowed) and say so. Do not recompute GET.

## Return

CLOSE with dry-run and after-row. leave_behind: planner recompute.
