---
decision_id: 2026-08-26_ingest_freeze_and_cloud_loader
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - _inbox/2026-08-26_cloud_loader_design.md
  - _inbox/2026-08-26_cloud_loader_WDLL.md
  - _inbox/2026-08-26_partitioned_lease_review_handoff.md
  - _inbox/2026-08-25_factory_operating_instructions.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_runbooks/AGENT_CONTRACT.md
---

# Decision

Factory 1 atoms ingest from the operator's PC is **frozen** as of 2026-08-26. W5-A finishes Bexar 48029 cad (writer left to complete; queue runner killed by operator instruction), then the W5A lease is released and no further `--apply` runs from `P:/`. The atoms drain is re-engineered as a Cloud Run Job in `us-east4` per `_inbox/2026-08-26_cloud_loader_design.md`, carded as OPS-16 rows P-81 (harness), P-82 (set-based write path), P-83 (scoped lease v2), P-84 (run ledger and Manifest move). The county-partitioned lease proposed in the 2026-08-26 handoff is **rejected as the next move** and re-specified inside P-83.

## Context

The operator asked whether the single atoms writer slot could be bypassed for throughput. The measurement answered a different question: the live apply runs at 21 atoms/s because `writePropertyAtomsBatch` issues one `INSERT INTO atom_links` per atom at a 44 ms round trip from the PC to Neon, a loop introduced by engine #356 on 2026-08-22 and never benchmarked (every rate on record predates it, and the benchmark exercises the upsert helper alone). Partitioning the lease would have parallelized idle time. The operator then ruled: stop, re-engineer, move it off the PC, make it something that is switched on and trusted. Two objectives with equal weight: finish Texas, and build the machine that finishes any state.

## Structural commitment check

- Sell reasoning, not data: unchanged; every atom still carries provenance and hash, now verified set-based against the store.
- Confidence is earned: the run ledger makes every load a recorded, verifiable event; progress is `atoms_load_runs`, never a hand count.
- Cost per jurisdiction: the run record carries `cpu_seconds` and `est_cost_usd`; commitment 3 is graded per county in the close.
- Dual interface: not affected.
- Tenant sovereignty: not affected; `access_policy` is written from the atom and still refuses on absence (#361).

## Reasoning

The prior expedite attempts (W1 multi-row upsert, the 2026-08-05 six-lane contention, the 2026-08-09 planner slot take, the L16b hang, the hidden W5-A windows) each added concurrency or custody before the single path was understood, and each was caught by a human re-establishing ground truth. The operator's own 2026-08-05 rule is batch-tune before concurrency. This decision applies it: fix the path (stage, chunked merge, server-side edges, set-based verify), bind the lease to a process and to the data it writes, record every run, and only then parallelize on a measurement. Running the job next to the database removes the round trip that dominated, removes the hidden-window class, and makes the loader something a scheduler can execute.

The alternative that produces the same throughput observation and was rejected: keep the laptop writer, batch only the links, and partition the lease. It reaches Texas but rebuilds the drift one level up: still an env-string holder, still a detached heartbeat, still a hand-typed queue, still no run record, still on one PC.

## Reversal criteria

- The P-82 benchmark (WDLL item 9) shows the merge phase under 200 atoms/s on the real table from `us-east4`. Then the database, not the path, is the bound; the next card is `atoms` partitioning and this program pauses at the first proof rather than running Texas on it.
- The first proof (item 27) cannot reach `scored` on two small counties within one operator session after two honest attempts. Then the harness is re-scoped before any wider run.
- The operator names a return to laptop applies for a specific emergency; that is a recorded break-glass run row, not a reversal of this decision.

## Dependencies

Depends on: W5-A stopped (verified 2026-08-26T13:42Z: lease released, Bexar cad at 660,000 of 703,257 with 43,257 atoms still on the old shape; not completed, and the remainder is the resume proof); engine `cfa18bc` as the base; LDT `origin/main` `46e1a5a1` scorer (`countyRailScoreCli.ts`) for the Manifest move; GCP project `hauska-prod-497015` for the job; Secret Manager entries already used by `cloudbuild.property-atom-bake.yaml`.

Unblocks: Texas remainder on cad, owner, landuse, flood, mud, rrc-wells, rrc-pipelines, rail-corridor, easement without operator sequencing; a national loader that takes a state's staged sources and a holds file.

Does not unblock: P-09 footprint (engine main still bbox), COVER roads, P-25 CAMA, Factory 2 zoning, CTX / national data acquisition (still HELD), the `countAtoms()` health-check scan (substrate seat card), table partitioning (own ADR).
