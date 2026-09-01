You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not atoms `--apply`. Do not restart Harris PBF. Do not touch P:/legacy-design-tools.

Plan row P-08. Read-only. Code reads: P:/seat-worktrees/property/legacy-design-tools. Doc_repo write: your close JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_wave_a_next_WDLL.md items 1, 2, 3, 5.

## Mission

Split the 77 flood missing-row FIPS into atoms-present vs atoms-absent without a heap COUNT(*).

Prior close: `_inbox/2026-08-21_a1-coverage_close.json`. Coverage flood 114 satisfied-present + 63 not-yet = 177 rows. 254-177=77 missing. 76 have txgio_parcel; Donley 48129 does not.

## Do this

1. On deployment Neon `fancy-fire-06136146` / `neondb`: list FIPS in county_manifest (or the 254-county roster the scorer uses) with no `county_facet_coverage` row where facet='flood'. Quote the SQL and the count. If the count is not 77, stop and report; do not force the pin.
2. Exclude 48129 from the EXISTS set. For each remaining FIPS, EXISTS on `hauska_mcp.atoms` (or the atoms database on that project) using a prefix RANGE on `(entity_type, entity_id)`, not `left(entity_id,5)` (that cannot use the unique index). Example: `entity_type = 'flood-hazard-fact' AND entity_id >= '48001:' AND entity_id < '48001;'`. LIMIT 1 / EXISTS. Announce before the first EXISTS: not a heavy scan, 76 index probes.
3. Output three lists: GO (atoms exist, score-without-apply), NO-GO-no-atoms (needs P-08 apply), skip-Donley. Do not estimate UNMEASURED FIPS into GO.
4. Pre-register: if most of the 76 have atoms, A1's "cannot fill via --all" still holds; GO is `--county=` per FIPS, not `--all`. If most have no atoms, leave_behind is apply, not score.

## Return

File `_inbox/2026-08-21_a4-flood-exists_close.json`. WDLL 1-3-5. leave_behind: exact `tsx ... countyFloodScoreCli.ts --county=` commands for GO FIPS, or none. No product edits.
