# Cohort re-persist 2026-08-07 — planner scratch

## OPEN (live thread)
- **Post-verify pack DONE** — `_inbox/2026-08-08_T1_bastrop_recovery_post_verify.json`
- Elgin: #276 merged (`--force-overwrite` parity). **Not started** until Bastrop closes.
- Warden #277 situs_address fix — **merged** @ `dba7a82` (2026-08-08). v1.3 sweep pending recovery verify pack.
- Heavy-scan slot: **HELD**.

## GROUND-TRUTH (2026-08-08)
- engine main: **dba7a82** post-#277 (+ #276 Elgin force-overwrite merged; cohort apply was @ a1989d0)
- Store roster post-partial-apply (2026-08-08T08:36Z): **3936** total promoted 48021; **1959** Bastrop non-Elgin; **1977** Elgin (was 4003/2026 pre-partial-apply)
- block13 post partial apply: **7/7**
- Saga plain-geometry operator twelve: **12/12** @ 2026-08-08T08:29Z

## LESSON
- **Plain-geometry verification:** never use block13 R32 cert-grade; use saga method with **single shared parcel projection frame** (`projectRing` + `projectRingInFrame`). Dual-centroid `projectRing` on both rings false-fails 0/12 on healthy store.
- Dry-run honestDeclines=0 vs apply honestDeclines=3746 on same cohort/SHA → extended parity: dry verifyPass ≠ apply promoted; sum reconciles via computePassNotPersisted (768).
- **Never run two promote applies concurrently** on same cohort.
- Unknown CLI flags on elgin batch silently ignored (fixed #276).
