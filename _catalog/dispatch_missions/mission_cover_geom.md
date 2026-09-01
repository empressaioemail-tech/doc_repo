You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools. Do not atoms --apply. Do not Harris PBF. Do not POST ledger recompute. Do not run countyGeometryScoreCli without --county=48135. Do not --all. Do not mint absence. Do not copy L7 `--honest-absent`. Do not start P-17 / P-09 / P-11 or any other Wave A apply.

Plan row P-56. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/cover-p56 branch cover-p56 tracking origin/main. CLI and scorer edits only. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md item 8 and item 13. Prior close leftover: `_inbox/2026-08-21_s4-geom-48135_planner_review.json`. Stock CLI numerator counted 79650 prefix-range parcel-nodes including 3791 retired `prop_id` rows versus DISTINCT `feature_index` 75891, so pct 104.95 and `not-yet` via overcount. GET after planner recompute still carries that 104.95 cell.

## Mission

Name both halves of the 48135 geometry ratio before you write.

Denom (already documented on the CLI): `count(DISTINCT feature_index) FROM txgio_parcel WHERE county_fips = '48135'`. Do not invent accounted-features.

Numerator: active geo_id-keyed parcel-nodes only. Exclude the 3791 retired `prop_id` rows from P-02. P-02 close active count was 75859. If your active count and the denom disagree, that is a finding. Quote both. Do not hide the gap inside a clamp.

Change `countyGeometryScoreCli.ts` (and its tests) so the 48135 numerator cannot include those retired rows. Prove the old overcount by violating the new check (a fixture that includes retired ids must fail or classify not-yet, never `satisfied-present` by clamp).

Dry-run first:
`tsx artifacts/api-server/src/countyGeometryScoreCli.ts --county=48135 --dry-run`

Quote atoms / features / pct / rail_state / both SQL texts. Then write that county only (omit --dry-run). Env: gcloud DATABASE_URL hauska-prod-497015 and DEPLOYMENT_DATABASE_URL legacy-design-tools-prod. Do not print secrets.

Progress: P:/tmp/cover_p56/progress.log. Watch `_catalog/watch_registry/cover-p56-geom-48135.json` before the write.

Verify Neon by field name: geometry facet 48135 `last_verified_at` moves off 2026-08-21T18:26:28.553Z, and `honest_coverage_pct` is not 104.95. If still overcount, stop and report. Do not recompute GET.

This card does not take the atoms `--apply` slot for roads or anything else.

## Return

CP1 before edits: occupancy SHA, numerator SQL, denom SQL, retired exclusion, what you will violate. CP2 after tests and dry-run. CLOSE quotes both counts, dry-run, after-row, Neon fields by name. leave_behind: planner POST `/api/county-ledger/recompute?probe=skip`. Wave A `--apply` stays planner-queued after that GET.
