You MAY NOT spawn sub-agents. You write only in P:/seat-worktrees/property/legacy-design-tools-ctx-join on branch fix/ctx-h-situs-recovery. You do NOT commit, push, deploy, execute a bake, or open a PR. You do NOT lift LANDUSE_JOIN_DISABLED_FIPS_SEED. You do NOT join 48209 or 48491 on prop_id.

Plan rows F-05, F-06, F-08. WDLL `_inbox/2026-08-29_ctx_h_situs_recovery_WDLL.md` items 1-7. Parent `_inbox/2026-08-29_ctx_quality_WDLL.md` item 3. Decision `_decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md`.

## Mission

Wire the old bake's owner-gated situs recovery into the conformant tier 1 bake. Read in this order: `lib/joinNormalize.ts` (seed, addressJoinKey), `lib/joinIntegrityGate.ts` (ownersAgree, resolveAddressLandUse, loadLedgerBlockedFips), `nodeFacetBakeTier1Cli.ts` (the working recovery), `lib/nodeFacetBakeTier1Conformant.ts`, `nodeFacetBakeTier1ConformantCli.ts`. Reuse the old functions. Do not fork a second gate.

## Return

CP1: `_inbox/2026-08-29_ctx-h_cp1.json` (seed still {48209,48491}, gold situs strings, current conformant refuse path).
CP2: `_inbox/2026-08-29_ctx-h_cp2.json` (fixtures: prop_id still refused; agree / disagree / blank; situs-keyed row used, prop_id-keyed row ignored).
CLOSE: `_inbox/2026-08-29_ctx-h_close.json` citing WDLL items 1-7. leave_behind: Travis no-row sentinels, P-80, remaining 0,0 rows outside Hays/Williamson recovery.
