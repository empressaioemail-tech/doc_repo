# parcel-node writer sweep 2026-08-09

## GROUND-TRUTH
- 2026-08-09T15:21Z store size: geometry counties=195 rows=13,877,175 features=12,186,772; parcel-node counties=63 atoms=542,689 (active 542,688); delta=132.
- Manifest baseline texasCompletenessPct=0.2133771830027867 satisfiedCells=38/3048. Kenedy geometry rail: satisfied-present 98.33% source=parcel-node-atom-count.
- Atoms DB: hauska_mcp @ ep-lucky-truth (direct, not pooler), transaction_read_only=off.
- TxGIO DB: neondb same host (DEPLOYMENT_DATABASE_URL stripped), txgio_parcel present. READ ONLY by this lane.

## LESSON
- Node fetch to cortex-api Run URL fails UNABLE_TO_VERIFY_LEAF_SIGNATURE on this host; use curl.exe for manifest checkpoints.
- gcloud stderr warnings + PowerShell ErrorAction Stop abort secret fetch; use cmd /c or Continue.

## OPEN
- Sweep runner at P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs; **81 counties remain** (48465 apply in flight 2026-08-09T20:23Z).
- W1 D0 slot gate: polls T0=1536463 → T1=1536963 → T2=T3=**1597819** / 114 counties (T2/T3 ~2min apart, NOT 10min gate); **48021 Bastrop atoms=0** (mint queued first after stability).
- ldt **0072/0073 APPLIED** 2026-08-09T20:22Z — artifact `_inbox/2026-08-09_W1_ldt_migrations_0072_0073_APPLY.md`.
- D2 adversarial CP1: `_inbox/2026-08-09_W1_D2_adversarial_checkpoint1.md` — split PRs footprint/easement; no statewide apply.
- Slot chain owner: planner (no parallel D1 seats).

## DEAD-END
- None yet this session.
