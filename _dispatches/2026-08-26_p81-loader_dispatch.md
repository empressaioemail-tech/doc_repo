CANON-PREAMBLE v27e09aa2

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FRO

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-81, P-82, P-83, P-84 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# Option A on the existing write path (OPS-19 F-02): P-81 harness, P-82-lite plus BP-WRITE-01, P-83 scoped lease, P-84 run ledger; Bexar resume only, no new county on the old shape

---
id: 2026-08-26_cloud_loader_WDLL
title: WDLL — Option A on the existing write path (P-81 harness, P-82-lite plus BP-WRITE-01, P-83 scoped lease, P-84 run ledger; OPS-19 F-02)
date: 2026-08-26
last_updated: 2026-08-26
status: draft
applies_to: hauska-engine, legacy-design-tools, hauska-factory
plan_row: P-81, P-82, P-83, P-84
parent_plan_row: F-02 (90_operations/OPS-19_factory_plan_of_record.md)
operator_go: 2026-08-26 option A ruled ("fix the path, freeze new fills on it; finish Bexar's resume on the current shape; every new fill waits for the conformant writer"); card text pending operator read
parent_wdll: _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
design: _inbox/2026-08-26_cloud_loader_design.md (read its review amendments section first) and _inbox/2026-08-26_factory_program_design.md
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md
review: _inbox/2026-08-26_p81-review_close.json
supersedes: _inbox/2026-08-26_partitioned_lease_review_handoff.md
depends_on:
  - _inbox/2026-08-26_factory_phase_a_WDLL.md (F-00 repo, F-01 store, F-03 control core)
  - _blueprint/40_rule_register.md (BP-WRITE-01, BP-KEY-SENTINEL-01, BP-EDGE-01, BP-DID-01)
  - 51_ingestion_pipeline_reference.md §remediation step 1
  - _inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md
  - 90_operations/OPS-13_store_topology.md
snapshot: P:/doc_repo main 9753b830a8e929ba1b59e625a2c60e50712ebcc0 · hauska-engine cfa18bc · legacy-design-tools origin/main 46e1a5a1 · Bexar 48029 cad 660,000 of 703,257 rewritten (verified 2026-08-26T13:42Z)
owner: property seat. Deploys planner-owned per standing decision.
---

# WDLL: option A on the existing write path

Date: 2026-08-26  Status: draft  Operator approval: option A ruled; card text pending read

This is 51 §remediation step 1 applied to the live writer: stop the orphan population growing (BP-WRITE-01), remove the round-trip loop that made the path run at 21 atoms/s, bind the lease to a process and to the data it writes, record every run, and finish the one county already mid-rewrite. It is not a fill program. After Bexar, this path writes no new county; the Texas remainder, Harris and Dallas included, waits for the conformant stage E writer (OPS-19 F-15, F-16, F-18). The brief's numbers are the planner's; reporting one wrong is a successful outcome.

## Done looks like

`writePropertyAtomsBatch` refuses a node binding that is not canonical grammar and a sentinel inside a key, writes all of a batch's `applies-to` links in one statement, runs under a process-bound scoped lease locked inside each chunk transaction, and records every run and refusal in the Factory run ledger. Bexar 48029 cad completes its rewrite from an edge-presence read (43,257 atoms remaining), verifies against the writer's own counts, and its cell moves by bounded materialise. The real-table rate from `us-east4` is measured and recorded. No `--apply` runs from the PC. No county other than Bexar is written on this path, and a work list containing one refuses with `OLD_SHAPE_FILL_FROZEN`.

## Acceptance items

### P-82-lite write path plus BP-WRITE-01 (hauska-engine)

1. **Write boundary refuses bare keys and sentinels.** A `parcelNodeId` or `entityId` that is not `{fips}:{integer}` (plus the declared discriminators) refuses `NON_CANONICAL_BINDING` before any `INSERT`; `:outside`, `:primary` and any sentinel token inside a key refuse `KEY_SENTINEL`; `body.atomDid` in a different namespace from the column refuses `DID_NAMESPACE`. Verified by violation for each. Bexar's existing keys pass. | check: three refuse fixtures plus a Bexar-row pass fixture | grade: [ ]

2. **Links are one statement per batch.** `writeAtomLinks` inserts all links of a batch in one multi-row `INSERT ... ON CONFLICT (from_atom_did, to_atom_did, link_type) DO NOTHING`; the per-link loop is gone; `writePropertyAtomsBatch` stays the shared path for every caller. | check: a 5,000-atom batch issues fewer than 10 statements to `atom_links`, counted by a query-logging double | grade: [ ]

3. **Differential identity holds** for atoms and links on the W1 fixture set. | check: `property-atom-batch-differential.test.ts` extended to links | grade: [ ]

4. **The edge cannot be omitted, independently derived.** Expected link count per batch from atom bodies (`parcelNodeId` non-null and not county-coverage); links written must equal it; a batch whose writer skipped the helper fails `STARVED_EDGE`. Both directions. | check: fixture pair | grade: [ ]

5. **Verify is two-derivation.** Atoms readable back equals the count the writer built; stored `content_hash` equals the client hash for every atom; links equal item 4. A corrupted row and a dropped row each fail the run, record `failed`, exit non-zero on the real exit, and enqueue no score. | check: three fault fixtures | grade: [ ]

6. **Per-leg timing** (`plan_ms`, `upsert_ms`, `links_ms`, `verify_ms`, `rtt_ms`) in every run record. | check: non-null on the Bexar run | grade: [ ]

7. **Benchmark on the real table from `us-east4`.** `writePropertyAtomsBatch` end to end (lease, upsert, links, verify) on a throwaway county with its snapshot stated. Pre-registered prediction: at least 300 atoms/s against the only real-table band on record (L4 950 to 1,319/s, pre-#356). Below 150 atoms/s the database is the bound and the conformant writer (F-18 stage-and-merge shape) opens with that number in hand. | check: benchmark JSON with snapshot | grade: [ ]

### P-83 scoped lease v2 (hauska-engine)

8. **Scope `(entity_type, county_fips)`; no GLOBAL; token-bound `HeldLease`; no env-var holder path.** | check: type signature; runtime negative | grade: [ ]

9. **Scope check on data, in the DB, inside the transaction.** Lease row locked `FOR UPDATE WHERE holder_token = $t AND expires > now()` per batch; `SCOPE_MISMATCH` on any atom outside the scope before any `INSERT`; an expired lease inside a slow batch refuses at the lock. | check: fixtures both directions plus an expiry-race fixture | grade: [ ]

10. **Disjoint scopes concurrent; same scope refuses; same label different token refuses.** | check: concurrent test on two small scopes with zero DID overlap | grade: [ ]

11. **Liveness is the writer's.** Heartbeat from the writing process on a dedicated connection plus per batch; TTL 15 min; steal after expiry records `stolen_from`; no advisory locks. | check: kill-and-retake; grep for `pg_advisory` returns nothing | grade: [ ]

12. **Heavy-scan scope** for PostGIS plan phases; second concurrent heavy plan waits or refuses, recorded. | check: concurrent plan test | grade: [ ]

13. **v1 retired by refuse.** `takeWriterLease` throws `ATOMS_WRITER_LEASE_V1_RETIRED`; CI asserts a v1 take cannot satisfy a v2 write. | check: test plus CLI exit | grade: [ ]

14. **AGENT_CONTRACT section 3 amended** with OPS-19 rule 7 wording; compiler re-hashes. | check: marker diff | grade: [ ]

15. **Bypass enumeration disposed**, including `writeAtoms` loops in `pipeline-runner/runner.ts` and corpus `edition-history/ingest.ts`, the `UPDATE atoms` repair scripts, and `load-snapshot-into-pg.mjs`; `status --audit` reports serving-store rows with `updated_at` outside any run window. | check: table in close; audit output | grade: [ ]

### P-84 run ledger and scoring (hauska-factory, legacy-design-tools)

16. **Every run and refusal is a row with a termination record** (max duration, success exit, failure exit, lease release); a run cannot start without its row; a job that exits without a termination record fails its own close. | check: refuse fixtures; ledger-connection fault; missing-termination fixture | grade: [ ]

17. **Progress has one instrument.** `factory status` from `runs`; no bare `count(*)` on `atoms` anywhere in the Factory. Bexar reads 660,000 rewritten, 43,257 pending, from an edge-presence read. | check: grep and runtime; status output | grade: [ ]

18. **Scoring is a job with its own env contract.** `countyRailScoreCli.ts --rail --county --apply` with `ATOMS_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` set explicitly (no gcloud fallback in the image); its advisory lock bounded per county and released on exit; rrc-wells dropped from this card or its registry reach fixed first. | check: job spec; exit 2 negative; rrc-wells decision recorded | grade: [ ]

19. **The cell moves by bounded materialise** within 30 min of a verified run; the full-grid recompute is unreachable from the Factory; a pending score older than 30 min is an alarm. | check: cell move on Bexar; alarm test with the scheduler disabled | grade: [ ]

20. **Cost recorded** per run against commitment 3. | check: run rows | grade: [ ]

### P-81 harness (hauska-factory, GCP hauska-prod-497015)

21. **Image and job pinned**; explicit `--task-timeout` and `--max-retries=0`; `engine_sha` and `image_digest` on every run; `--expect-engine-sha` mismatch refuses. | check: `gcloud run jobs describe` JSON read by field; refuse test | grade: [ ]

22. **RTT measured**; prediction under 5 ms. | check: run record | grade: [ ]

23. **Work list derived; holds are rows; old-shape fill frozen.** `factory plan --state=48 --path=existing` returns Bexar 48029 cad only; any other county on the existing path refuses `OLD_SHAPE_FILL_FROZEN` and records the refusal; holds imported once from the routing pin with `docRepoHead` and a CI divergence test until the pin is retired. | check: plan output; refuse rows | grade: [ ]

24. **Secrets in the job definition; missing env refuses.** | check: job YAML; refuse test | grade: [ ]

25. **Nothing runs on the PC.** `write-*-county.mjs --apply` without a `HeldLease` refuses; a `HeldLease` requires a `run_id`; `overnight.mjs` and `_w5a_detached_heartbeat.mjs` retired in the runbook. | check: local `--apply` refuse | grade: [ ]

### Proof

26. **Bexar resume.** `48029` cad completes from the edge-presence read: 43,257 atoms rewritten with edges, verify per item 5, cell moved; no atom rewritten twice without cause recorded; the run's termination record present. | check: run rows; store counts before and after with timestamps | grade: [ ]

27. **Out of this card.** Harris 48201, Dallas 48113 and the Texas remainder (held to the conformant writer, OPS-19 F-15, F-16, F-18); publish (F-06), staging (F-07), verify walk (F-08), acquisition manifests (F-09), depth (F-11), discovery (F-13), `countAtoms()` health scan (substrate seat), P-09, COVER, P-25. Named so unmentioned is not the failure state. | check: pathspec on close; `notStarted` list | grade: [ ]

## Do not

- Write any county other than Bexar 48029 on this path. `OLD_SHAPE_FILL_FROZEN` is the control, not a note.
- Use the v1 lease for anything. It is retired by item 13.
- Add `GLOBAL` scope, an env-var holder, a dual-accept window, or an advisory lock in the loader.
- Create `UNLOGGED` tables on Neon.
- Count atoms by hand as progress.
- Run the full-grid Manifest recompute.
- Run any `--apply` from `P:/` once item 25 lands.

## Amendments

- 2026-08-26: card rewritten after the adversarial review; first draft superseded in place.
- 2026-08-26 (later): re-scoped to option A: BP-WRITE-01 added as item 1; Harris, Dallas and the Texas remainder moved out to the conformant writer; `OLD_SHAPE_FILL_FROZEN` added as item 23; parent OPS-19 F-02.

## Finish card (graded at close)

1. (graded at close)

leave_behind: (declared at close)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-26_p81-loader_cp1.json
  CP2: _inbox/2026-08-26_p81-loader_cp2.json
  CLOSE: _inbox/2026-08-26_p81-loader_close.json
