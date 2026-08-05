---
id: T5_factory_throughput_track
title: T5 — Factory throughput track: sharding, #254 adoption, pending certs, Bexar (catch-up program)
status: active
owner: nick
related: [CATCHUP_program_2026-08-05, 90_runbooks/factory_onboarding_runbook, onboarding_defect_class_backlog]
---

# T5 — Factory throughput

Mission: make the factory fast enough for mega-counties and close the pending Central TX certs. Code work is parallel; every data-run reserves the heavy-scan slot behind T1.

## Workstreams

1. KEYSPACE SHARDING FLAG (operator-ruled pre-Bexar): add range bounds to the cascade/bake pagination (e.g. --parcel-min/--parcel-max on the parcelNodeId keyspace) so N concurrent scanners split one county; summary must report per-shard counts and the union must equal a solo run (prove on a small county: run McLennan-sized county solo vs 4-shard and diff). Also raise the default --batch for county-scale runs per the measured pace data (200 default vs 500-1000 measured better). Bexar (48029, ~700k) runs ONLY via sharding, dry-run first, as its first production run.
2. ENGINE #254 ADOPTION: the parked DFW session's PR (Kaufman/Ellis registry rows + railPerParcel.propIdField threading through fetchBcadParcelRings/cert grading) is REQUIRED for Williamson (PropertyID) and Bexar (PropID) certs. Review it as your own: rebase on main, verify tests, gate on the conclusion string, merge. Its Kaufman/Ellis rows ride along (harmless; the DFW lane itself stays parked).
3. PENDING CERTS, in order (each: CAD-probe-gated roster per the runbook Wave-1 addendum, cert 20/20 blockPass, Warden sweep with --cert-artifact, ledger POST):
   a. Comal 48091 (cascade already applied 76,525 exact),
   b. Williamson 48491 (apply first: dry-run predicted 157,937; needs heavy-scan slot; then cert — needs #254),
   c. Hays 48209 (cascade dry-run then apply then cert; layer live-verified in #251),
   d. Bell 48027 (cascade dry-run/apply/cert; gate clean post cost-fix),
   e. Bexar 48029 (sharded dry-run, review, sharded apply, cert — needs #254).
4. PROPAGATION COORDINATION: any county whose cascade lands here gets its stamp/atoms propagation posture checked against T1's pipeline-leg map before the cert is declared closed (the stamp-to-atoms lesson).

## Acceptance (master planner verifies live)

Sharding proven equal-to-solo on a diff test and documented in the runbook; #254 merged green; Comal/Williamson/Hays/Bell certified 20/20 with Warden sweeps and ledger rows; Bexar dry-run + apply exact-match via shards and certified; every apply matched its dry-run; block13 held throughout; heavy-scan slot discipline observed (log reservations in the program doc's claim notes); queue rows flipped.
