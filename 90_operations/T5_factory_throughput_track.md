---
id: T5_factory_throughput_track
title: T5 — Factory throughput track: sharding, #254 adoption, pending certs, Bexar (catch-up program)
status: superseded
last_updated: 2026-09-06
owner: nick
related: [CATCHUP_program_2026-08-05, 90_runbooks/factory_onboarding_runbook, onboarding_defect_class_backlog, 90_operations/OPS-19_factory_plan_of_record]
---

**Superseded 2026-09-06, confirmed via the compute-bottleneck investigation
(`_inbox/2026-09-06_ctx-wrapup-factory_compute-bottleneck-profile_close.json`).**
OPS-16 row A-042 (2026-08-27) made `OLD_SHAPE_FILL_FROZEN` permanent for exactly
the cascade/cert workflow this doc describes, and A-043 the same day re-homed
everything under `OPS-19_factory_plan_of_record` (F-10). This doc was never
updated to reflect either. Its "Bexar" thread is a different, older effort than
the 2026-09-05 `factory-bexar-edges` deploy-pipeline work — do not conflate the
two. Kept for historical record only; current work routes through OPS-19/F-10.

# T5 — Factory throughput

Mission: make the factory fast enough for mega-counties and close the pending Central TX certs. Code work is parallel; every data-run reserves the heavy-scan slot behind T1.

## Workstreams

1. KEYSPACE SHARDING FLAG (operator-ruled pre-Bexar): add range bounds to the cascade/bake pagination (e.g. --parcel-min/--parcel-max on the parcelNodeId keyspace) so N concurrent scanners split one county; summary must report per-shard counts and the union must equal a solo run (prove on a small county: run McLennan-sized county solo vs 4-shard and diff). Also raise the default --batch for county-scale runs per the measured pace data (200 default vs 500-1000 measured better). Bexar (48029, ~700k) runs ONLY via sharding, dry-run first, as its first production run.
2. ENGINE #254 ADOPTION: **MERGED** (`31aa37e`). Williamson amendment: **PR #261 MERGED** (`634a2a4`) — PARCELID string CAD fetch; main re-cert 20/20 confirmed.
3. PENDING CERTS, in order (each: CAD-probe-gated roster per the runbook Wave-1 addendum, cert 20/20 blockPass, Warden sweep with --cert-artifact, ledger POST):
   a. Comal 48091 (cascade already applied 76,525 exact),
   b. Williamson 48491 (apply first: dry-run predicted 157,937; needs heavy-scan slot; then cert — needs #254),
   c. Hays 48209 (cascade dry-run then apply then cert; layer live-verified in #251),
   d. Bell 48027 (cascade dry-run/apply/cert; gate clean post cost-fix),
   e. Bexar 48029 (**HELD** operator 2026-08-05: block13 7/7 on main + slot release after T1 WS1/Elgin → T3 pilot; Williamson gate cleared).
4. PROPAGATION COORDINATION: any county whose cascade lands here gets its stamp/atoms propagation posture checked against T1's pipeline-leg map before the cert is declared closed (the stamp-to-atoms lesson).

## Acceptance (master planner verifies live)

Sharding proven equal-to-solo on McLennan ntile diff (Bell naive-bounds miss disposed; runbook law); #254 + #261 merged; Comal/Hays/Bell/Williamson certified 20/20 (Williamson main-repro confirmed); Bexar held per operator slot/block13 gates; block13 7/7 must read clean on main before any further T5 data-runs; heavy-scan slot order T1 → T3 → Bexar.
