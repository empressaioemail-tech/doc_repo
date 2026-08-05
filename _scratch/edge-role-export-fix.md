# edge-role export fix scratch (2026-08-05)

## GROUND-TRUTH (2026-08-05 live verify)
- block13 7/7 held post-fix branch (`_inbox/2026-08-05_block13_post_edge_role_export_fix.json`)
- 48021:31362 PASS: stored descriptor-fixture 15/0/0 → export refresh F25/S5/R25, front edge 4 = south/Higgins, situs-street-match (`_inbox/2026-08-05_31362_export_fix_verify.json`)
- 80577/80578: roles unchanged after refresh; flag-lot class NOT cleared (`_inbox/2026-08-05_mesquite_flag_lots_export_refresh_verify.json`)

## LESSON
- Card path gates stale setback-rule via `isStaleBastropCitySetbackRule`; export consumed stale boundary-edge atoms with no equivalent gate — cross-surface divergence by architecture, not just data vintage.
- cert-grade-core.ts R28+R30 gates were proven but not wired into site-plan author — operate-not-rebuild miss.

## OPEN
- Engine PR merge + deploy owed (`fix/export-boundary-primitive-refresh`)
- Flag-lot side-vs-rear (Mesquite) needs deeper orientation logic (OPS-10), not export-index refresh alone
- Full boundary-primitive re-warm for Bastrop city cohort still queued (export fix is serve-time refresh, not store backfill)
