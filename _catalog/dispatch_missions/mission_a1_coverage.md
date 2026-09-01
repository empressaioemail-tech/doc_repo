You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not atoms `--apply`. Do not restart Harris PBF. Do not touch P:/legacy-design-tools.

Plan rows P-08, P-09, P-01, P-05. Read-only scout. Worktree for code reads: P:/seat-worktrees/property/legacy-design-tools on seat/property. Doc_repo writes only: your close JSON.

WDLL: P:/doc_repo/_inbox/2026-08-21_wave_a_execution_WDLL.md items 1, 2, 5.

## Mission

Inventory whether Wave A can SCORE without a new atoms apply.

Governing plan: P:/doc_repo/90_operations/OPS-18b_data_remediation_plan.md Wave A1. Live GET pin: computedAt 2026-08-21T15:53:02.907Z. not-yet: roads 254, footprint 254, flood 140, mud 45, geometry 1 (FIPS 48135 Ector).

## Do this

1. Find scorer CLIs: countyGeometryScoreCli, countyFloodScoreCli, countyCoverageScoreCli, plus roads/footprint/mud if bound in RAIL_ENGINE_BINDINGS (lib/db/src/schema/railEngineBinding.ts). Quote invoke command (tsx path, required env, --apply vs dry).
2. Query deployment Neon `neondb.county_facet_coverage` (NOT hauska_mcp.atoms). Bounded: GROUP BY facet or rail_key AND rail_state. No COUNT(*) on atoms. If you cannot query, mark UNMEASURED, do not estimate.
3. One row per rail: geometry, roads, flood, footprint, mud. Columns: coverage_rows, rail_state_counts, scorer_path, GO or NO-GO to score without atoms apply, one-line why. Roads: cite A-017; statewide PBF is NO-GO; scoring already-landed counties is GO only if coverage is missing and atoms or a landed table exist.
4. Geometry 48135: is the 5% coverage a score truth or a re-key debt (P-02)? Quote the coverage row if present.
5. Pre-register: if flood coverage already shows ~114 satisfied-present, that matches the live GET and scoring is not the missing piece for those 114. The 140 not-yet need a different cause named (no atoms, scorer skip, threshold, wrong facet key).

## Return

File `_inbox/2026-08-21_a1-coverage_close.json` with the table, query snapshot (db/project/time), scorer invoke strings, WDLL 1-2-5 grade, leave_behind: none or named score-apply command for GO rails. No product edits.
