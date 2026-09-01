---
id: 2026-08-26_cloud_loader_design
title: Atoms county loader — design (Factory 1 drain off the laptop, onto Cloud Run Jobs)
date: 2026-08-26
last_updated: 2026-08-26
status: draft
applies_to: hauska-engine, legacy-design-tools
plan_row: P-81, P-82, P-83, P-84 (Texas drain rows; parent OPS-19 F-02)
parent: _inbox/2026-08-26_factory_program_design.md
review: _inbox/2026-08-26_p81-review_close.json
owner: property seat (hauska-engine, legacy-design-tools); planner deploys
snapshot: P:/doc_repo main @ 9753b83 · engine cfa18bc (= origin/main) · LDT origin/main 46e1a5a1 · integration seat
related:
  - _decisions/2026-08-26_ingest_freeze_and_cloud_loader.md
  - _inbox/2026-08-26_cloud_loader_WDLL.md
  - _inbox/2026-08-26_partitioned_lease_review_handoff.md
  - _inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md
  - _inbox/2026-08-25_factory_operating_instructions.md
  - 90_operations/OPS-13_store_topology.md
  - 90_runbooks/AGENT_CONTRACT.md
  - 27a_jurisdiction_factory_engine_spec.md
---

# Atoms county loader

## Review amendments, 2026-08-26 (read these before the sections below)

The adversarial review (`_inbox/2026-08-26_p81-review_close.json`) refuted six load-bearing parts of this design. All six are accepted and the sections below are read with these corrections; the loader is now the fabric station of the Factory (`_inbox/2026-08-26_factory_program_design.md`, OPS-19 F-02).

1. **Sequence.** Batched multi-row `atom_links` on the existing `writePropertyAtomsBatch` first (P-82-lite), job-wrapped, measured against the real `atoms` table from `us-east4`. Stage-and-merge (section 4) only if that measurement shows the merge phase is the bound. The W1 2,961/s figure was an empty throwaway table; the only real-table band on record is L4's 950 to 1,319/s, pre-#356.
2. **Stage table and verify (F1).** No `UNLOGGED` tables on Neon (not persisted across compute restart). Verify compares staged and merged counts to the writer's own `atoms_built` and per-chunk row counts; `hash_match = staged` alone passes on an empty stage and is not a check.
3. **Starved edge (F2).** Expected link count is derived from the atom body (`parcelNodeId` non-null and not county-coverage) or a rail declaration, never from the same stage column the writer fills.
4. **W5-A state (F3).** Bexar 48029 cad stopped at 660,000 of 703,257 with the lease released and no close JSON; 43,257 atoms remain on the 2026-08-12 shape with zero edges. It is the resume proof. Plan mode classifies cells as load, score-only, or edge-rewrite.
5. **Manifest move (F4).** The county-ledger GET serves a snapshot; scoring writes `county_facet_coverage` only. A bounded per-cell materialize replaces the full-grid recompute; the Factory store owns the manifest (F-05).
6. **Batch path not retired (F5).** `writePropertyAtomsBatch` stays the shared path for roads, parcel-node, footprint, and the bake; it gains lease v2 and batched links.
7. **Holds (F6).** No `holds.json`. Holds are rows in the Factory store, imported once from the routing pin, with a CI divergence test until the pin is retired; which rail holds lift for the drain is an operator amendment.
8. **Lease fencing, timeouts, dedupe, order.** Lease row locked `FOR UPDATE` inside each chunk transaction with the heartbeat in it; explicit `--task-timeout` and `--max-retries=0`; dedupe last-wins expressed before merge; lease type and run ledger land before the write function that requires them.

The operator ruling this answers (2026-08-26): stop the laptop ingest, re-engineer the Factory 1 drain so it runs on a cloud job that can be switched on and left running, and make it something that is never silently wrong. Two objectives carry equal weight: finish Texas, and have the machine that finishes any state.

"Fail proof" in this operation's vocabulary is not "never fails." It is: fails closed on every unverified value, leaves a durable record of every mutation and every refusal, and every control has been shown to fire on a known violation before it is trusted. That is what this design builds and what the WDLL grades.

## 1. What was measured, and what it rules out

Measured 2026-08-26 on the live W5-A Bexar 48029 cad apply (engine `cfa18bc`), read-only instruments in the session scratchpad (`lease_sampler.mjs`, `probe2.mjs`, `rtt.mjs`; to be promoted to `scripts/` with this card):

| Fact | Value | Instrument |
|---|---|---|
| Batch cadence | 5,000 atoms every 234 to 235 s = 21.3 atoms/s | lease row heartbeat with the 60 min TTL signature |
| Historical | 20 atoms/s on Kaufman cad, owner, landuse | `apply.log` wall times |
| Round trip to Neon | 44 ms p50 from the operator's PC | 10x `SELECT 1` on the direct host |
| Writer's statement | `INSERT INTO atom_links ... VALUES ($1 ...` single row | `pg_stat_activity` pid 3428 |
| Origin | `writeAtomLinks` loop entered `writePropertyAtomsBatch` in `29ab77c` (#356, 2026-08-22) | `git log -S` |
| What the benchmark measured | `upsertPropertyAtomRowsMulti` only (no links, no lease, no verify) | `benchmark-property-atom-write.mjs:79` |

5,000 sequential link inserts at 44 ms is 220 of the 235 s. The atoms upsert, verify readback, and heartbeat are the other 15 s. Every throughput number on record (W1 2,961/s, L4 950 to 1,319/s) predates #356.

This rules out the county-partitioned lease as the next move: it would parallelize writers that are 94 percent idle on network, and it multiplies a lease that is holder-string-scoped (two processes with the same `ATOMS_WRITER_LEASE_HOLDER` both pass `assertAndHeartbeatWriterLease`). It does not rule out scoped leases as the national-scale shape; section 5 builds them properly.

Second mechanism considered for the 21/s and rejected: DB-side contention from the concurrent `countAtoms()` full-heap scans observed from a pooled client. Rejected because the writer connection is `idle, wait_event=Client` between statements and the RTT arithmetic accounts for the batch to within seconds. That scan is still a defect (section 9).

A counting error also surfaced: "store already holds 703,257 Bexar cad atoms" counted rows from the 2026-08-12 tranche that the apply was rewriting. Progress is `count(*) WHERE updated_at >= run start`, never a bare count. The run ledger below makes that the only progress number that exists.

## 2. Shape

```
operator: gcloud run jobs execute atoms-county-loader --region us-east4 --args=--mode=continue
                     |
        Cloud Run Job (us-east4, image pinned by digest, engine SHA in every record)
                     |
     task 0..N-1  (one county per task; --parallelism P, P starts at 2)
                     |
   for rail in declared order (cad, owner, landuse, flood, mud, rrc-wells, rrc-pipelines, rail-corridor, easement):
      1. plan      read staged source (neondb, pooled) -> classify present / honest-absent / hold
      2. lease     take scope (entity_type, fips) in hauska_mcp; heavy-scan scope for PostGIS plan phases
      3. stage     page source (keyset, bounded memory) -> build atoms -> COPY into atoms_stage_<run>
      4. merge     chunked set-based INSERT ... SELECT FROM stage ON CONFLICT DO UPDATE, links in the same statement
      5. verify    set-based: stage.content_hash = atoms.content_hash for every row; link count; 1% body sample
      6. record    atoms_load_runs row at every phase; refusals recorded too
      7. score     enqueue score_request (fips, rail, run_id); LDT scorer job drains it -> county_facet_coverage
                     |
   Manifest GET shows the cell satisfied, citing run_id. No human in the loop.
```

Region: `us-east4` (Ashburn). Neon is `aws us-east-1` (N. Virginia). Expected round trip 1 to 3 ms, versus 44 ms from the PC and roughly 25 to 35 ms from `us-central1` where the serving services run today. The job prints its measured RTT into its run record so this expectation is checked on the first execution, not assumed.

## 3. Work list is derived, never typed

The job's `plan` mode derives `(county, rail)` cells from the store and writes `work_list.json` carrying its snapshot:

1. `county_facet_coverage` cell for `(fips, rail)` is not `satisfied-present` or `satisfied-absent`, per `readManifestGridFromPool` semantics (LDT `lib/db/src/manifestGridRead.ts`).
2. The rail's staged source has rows for the county (per-rail presence query, e.g. `cad_property` at declared vintage for cad, owner, landuse; `tx_fema_nfhl_flood_zone` for flood; `tx_special_district` for mud).
3. The cell is not in `holds.json`, a checked-in file in hauska-engine that mirrors the doc_repo routing pin (`_inbox/2026-08-24_factory_routing_pin.json`): P-09 footprint (engine main still bbox), COVER roads (A-017, A-022), P-25 CAMA (source side), Travis 48453 `CROSSWALK_HOLD`, Hays 48209 `LANDUSE_JOIN_HOLD`, Williamson 48491. A held cell is recorded as `refused: hold:<reason>` in the run ledger, not skipped silently.

An explicit `--counties=48029,48085` narrows the list; it never widens past the holds. The parcel-node rail (geometry, 253/254 satisfied) is out of v1 because its writer carries reconcile and retire semantics (S1/S2) that the stage-and-merge path does not yet express; it is named as the first v2 rail.

Current remainder from the 2026-08-25 GET (667/3556): cad 241, owner 241, landuse 241, flood 92, mud 45, rrc-wells 254, rrc-pipelines 253, rail-corridor 253, easement 254 not-yet. Footprint 254 and roads 254 are held. Zoning and envelope are Factory 2 and not this loader.

## 4. Write path (P-82)

Replaces the client loop in `writePropertyAtomsBatch` for bulk loads. The existing single-row `writePropertyAtom` stays for warm-time writes and is enumerated as a non-bulk path.

**Stage.** Per run, `CREATE UNLOGGED TABLE atoms_stage_<run_id> (chunk_id int, atom_did, cid, content_hash, entity_type, entity_id, jurisdiction_tenant, source_adapter, source_url, fetched_at, body jsonb, access_policy, parcel_node_did text NULL)`. Rows arrive by `COPY ... FROM STDIN` (postgres.js `sql.copy` writable stream), page by page as the source is read with keyset pagination. Memory is bounded by page size; the county is never held in RAM (Bexar cad holds 1.9 GB today; Harris would not fit).

**Merge.** Per `chunk_id` (25,000 rows), one transaction:

```sql
INSERT INTO atoms (atom_did, cid, content_hash, entity_type, entity_id, jurisdiction_tenant,
                   section_number, subsection_path, source_adapter, source_url, fetched_at, body, access_policy)
SELECT atom_did, cid, content_hash, entity_type, entity_id, jurisdiction_tenant,
       NULL, NULL, source_adapter, source_url, fetched_at, body, access_policy
FROM atoms_stage_<run> WHERE chunk_id = $1
ON CONFLICT (atom_did) DO UPDATE SET
  cid = EXCLUDED.cid, content_hash = EXCLUDED.content_hash, entity_type = EXCLUDED.entity_type,
  entity_id = EXCLUDED.entity_id, jurisdiction_tenant = EXCLUDED.jurisdiction_tenant,
  source_adapter = EXCLUDED.source_adapter, source_url = EXCLUDED.source_url,
  fetched_at = EXCLUDED.fetched_at, body = EXCLUDED.body, access_policy = EXCLUDED.access_policy,
  updated_at = now();

INSERT INTO atom_links (from_atom_did, to_atom_did, link_type, context)
SELECT atom_did, parcel_node_did, 'applies-to', NULL
FROM atoms_stage_<run> WHERE chunk_id = $1 AND parcel_node_did IS NOT NULL
ON CONFLICT (from_atom_did, to_atom_did, link_type) DO NOTHING;
```

The `DO UPDATE` column list is byte-identical to `PROPERTY_ATOM_BATCH_ON_CONFLICT` today, so the W1 differential-identity test carries over. The `applies-to` edge is derived from stage columns the builder filled with the P-55 helper; a writer that skips the helper produces a NULL `parcel_node_did` and the WDLL's starved-edge check (links written = stage rows with a parcel node) fails the run. That closes the bypass the factory instructions name ("a Factory 1 apply that skips the helper mints the old shape").

Chunks are idempotent and resumable: a rerun of the same `run_id` re-merges only chunks not marked `merged` in the run ledger.

**Verify.** Set-based, two independent derivations: the client computed `content_hash` before staging; the store holds what it wrote.

```sql
SELECT count(*) FILTER (WHERE a.content_hash = s.content_hash) AS hash_match,
       count(*) AS staged
FROM atoms_stage_<run> s LEFT JOIN atoms a USING (atom_did);
-- must be equal; links: count(atom_links) for staged from_atom_dids must equal count(stage.parcel_node_did IS NOT NULL)
```

Plus a 1 percent random sample re-read as bodies and passed through the existing rail predicate (`verifyStoredCadParcelRollAtom` and siblings), so the semantic check survives. Any mismatch: run `FAILED`, recorded, non-zero task exit, no score request. The run does not "mostly succeed."

**Session.** Direct host, never the pooler (OPS-13 rule; the job fingerprints its host into the run record and refuses `-pooler`). `synchronous_commit = off` on the loader session is permitted because every chunk is idempotent and re-runnable; it is declared in the run record.

**Timing.** Every phase writes `ms` into the run record (`plan_ms`, `stage_ms`, `merge_ms`, `verify_ms`). The next regression is visible in the record, not inferred from a heartbeat signature. The benchmark script is retargeted to the real path (stage, merge, links, verify, lease) on a throwaway county against the real table, and its output states the snapshot.

Expected result, stated so it can be wrong: a Bexar-sized rail (703k) in under 15 minutes end to end from `us-east4`. If the merge phase alone exceeds 200 atoms/s on the real 160 GB table, the DB-bound rate is lower than assumed and the next lever is section 8, not more parallelism.

## 5. Scoped lease v2 (P-83)

The current lease (`009_atoms_bulk_writer_lease.sql`) is one row, holder is an env string, and a detached 8 minute heartbeat keeps it alive whether or not the writer is. Three defects: two processes with the same holder both pass; liveness is a ceremony; scope is the whole store.

New table, additive migration `011_atoms_writer_lease_v2.sql`:

```
atoms_writer_lease_v2 (
  scope_type   text NOT NULL CHECK (scope_type IN ('write','heavy-scan')),
  scope_id     text NOT NULL,           -- write: '<entity_type>:<fips>'; heavy-scan: '<database>'
  holder_token uuid NOT NULL,           -- minted by take, returned once, never in env
  holder_label text NOT NULL,           -- e.g. 'atoms-county-loader/exec-abc/task-3'
  run_id       text NOT NULL REFERENCES atoms_load_runs(run_id),
  taken_at, heartbeat, expires timestamptz NOT NULL,
  stolen_from  text NULL,
  PRIMARY KEY (scope_type, scope_id)
)
```

Rules:

1. Scope for a bulk write is `(entity_type, county_fips)`, which is exactly the store's key space (`atoms_entity_composite_unique`). Two disjoint scopes write concurrently; the same scope refuses with `HELD_BY_OTHER`. No `GLOBAL` scope exists. A writer that cannot name a county and an entity type is refused; parcel-keyed types all carry FIPS (P-55).
2. `take` returns a `HeldLease` object carrying the token. `writeStagedAtoms(lease: HeldLease, ...)` requires that type; there is no env-var path. This is the "prefer the type over the check" rule.
3. Before every chunk, the DB checks two derivations against each other: the lease scope, and the staged data (`SELECT count(*) FROM stage WHERE entity_type <> $type OR split_part(entity_id, ':', 1) <> $fips` must be 0). A mixed or out-of-scope stage refuses with `SCOPE_MISMATCH` before any `INSERT`.
4. Heartbeat is issued by the writer process itself, on a timer and per chunk, TTL 15 minutes. A dead writer's lease expires. A take on an expired row succeeds and records `stolen_from`. No advisory locks: the 2026-08-21 incident shows an advisory lock orphaned by a Cloud Run timeout blocks the fleet with no expiry.
5. Heavy PostGIS plan phases (flood, special-district, footprint later) take `heavy-scan:neondb` first. AGENT_CONTRACT section 4 becomes a control rather than an announce protocol.
6. Retirement of v1 by refuse: `takeWriterLease` throws `ATOMS_WRITER_LEASE_V1_RETIRED`; a CI test asserts a v1 take cannot satisfy a v2 write. The `lock_id = 1` table is dropped in a later migration once the refuse has been live for one cycle. No dual-accept window: the cutover lands after W5-A has released, which is now.

Proposed AGENT_CONTRACT section 3 text (lands with P-83; the compiler re-hashes):

> ONE atoms bulk-writer per (database, entity_type, county_fips) scope, and ONE heavy-scan scope per database. Only `--apply` against the atoms store takes a write scope; acquisition, staging, plans, builds, and dry-runs are slot-free and parallel, except heavy PostGIS plan phases, which take the heavy-scan scope. Scope custody is recorded in `atoms_writer_lease_v2` and every run in `atoms_load_runs`. A write without a live scoped lease, or whose staged rows fall outside its scope, FAILS CLOSED. Any writer that is not the recorded holder of its scope is rogue: kill on sight, record the kill.

This preserves A-012's intent (DB-enforced, fail closed) and tightens it (process-bound token, scope check on data).

## 6. Run ledger (P-84)

`atoms_load_runs` in `hauska_mcp`, one row per `(run_id)` where a run is one `(county, rail)` attempt:

```
run_id, job_execution, task_index, county_fips, rail, entity_type,
engine_sha, image_digest, db_host_fingerprint, rtt_ms,
mode ('dry'|'apply'), phase ('planned'|'staged'|'merged'|'verified'|'scored'|'failed'|'refused'),
refusal_reason, source_rows, atoms_built, present, absent_by_kind jsonb,
chunks_total, chunks_merged, atoms_upserted, links_upserted,
verify_hash_match, verify_hash_total, verify_sample_ok, verify_sample_n,
plan_ms, stage_ms, merge_ms, verify_ms, cpu_seconds, est_cost_usd,
started_at, finished_at, error
```

The row is written before the first mutation and updated at every phase. Refusals (hold, scope mismatch, lease held) are rows. If the row cannot be written, the run does not start. This is the "state changing operations leave a record" rule made mechanical, and it is the only progress instrument: `atoms-loader status` reads this table; nobody counts atoms by hand.

**Ledger move.** After `verified`, the loader inserts `score_requests (fips, rail, run_id, requested_at)` in `neondb`. A second Cloud Run Job in legacy-design-tools, `county-rail-score-drain`, on a Cloud Scheduler trigger every 10 minutes, runs `countyRailScoreCli.ts --rail=<rail> --county=<fips> --apply` for each pending request, stamps `scored_at`, and the loader marks the run `scored`. Per-cell scoring is bounded (one county, one entity type, index-backed), which is why it does not repeat the in-request recompute failure of 2026-08-21. The Manifest GET then shows the cell, citing `countyRailScoreCli` and the `run_id`. A pending request older than 30 minutes is a visible alarm in `status`, not a silent starvation.

**Close artifact.** `atoms-loader export --run <id>` writes the run row as JSON; the doc_repo close copies it into `_inbox/` so what canon cites is tracked.

## 7. Operating it

- Start: `gcloud run jobs execute atoms-county-loader --region us-east4 --args="--mode=continue,--parallelism-hint=2"`. `continue` takes the next N counties from the derived work list until it is empty. A Cloud Scheduler trigger can execute it hourly; an execution that finds no work exits 0 with a `no-work` record.
- Watch: `atoms-loader status` (table of live runs, phase, rate, ETA from measured rate, pending score requests, held cells). Cloud Logging carries the same records. A CC panel over `atoms_load_runs` is the later surface.
- Stop: `gcloud run jobs executions cancel`. Leases expire in 15 minutes; a rerun resumes at the first unmerged chunk.
- Nothing runs on the operator's PC. The `write-*-county.mjs --apply` scripts refuse without a `HeldLease`, and a `HeldLease` requires a `run_id`, and a `run_id` is created by the harness. Break-glass is a documented manual run row, recorded like any other.

Parallelism starts at 2 across counties. It is raised only on a measurement of the merge phase rate at 2 versus 1 on the real table (Neon compute size is unmeasured; `max_connections = 901` is the only proxy). Same-county rails run serially within a task in v1; they are row-disjoint (distinct `entity_type`, link inserts are `DO NOTHING`, no fact writer touches parcel-node rows), so a later card may run them concurrently on measurement.

## 8. What comes after (named, not started)

- **Declarative partitioning of `atoms` by county.** The atom-preserving answer to national scale: per-county index maintenance, `DROP PARTITION` retirement, and lock grain equal to storage grain. Its own ADR; not Texas.
- **Parcel-node rail on the loader** with stage-and-reconcile (S2 retire step as a set difference against the stage).
- **Neon read replica for plan phases**, so heavy PostGIS scans stop contending with serving.
- **Acquisition automation** (StratMap, NFHL, CAMA fetch and stage). This design is the drain; the supply side is LDT-owned and the next program.

## 9. Defects found alongside, not in this program

- `PgStorage.countAtoms()` runs `SELECT COUNT(*) FROM atoms` (160 GB heap) and its `LayeredStorage` caller says it serves `/healthz`. Observed as multi-minute scans from a pooled client, up to three concurrent, on 2026-08-26. An unannounced heavy scan under section 4; substrate seat card. A health check must use `pg_class.reltuples` or a bounded probe.
- The serving services in `us-central1` pay roughly 30 ms per query to Neon in `us-east-1`. Not this card; noted for the serving path.

## 10. Bypass enumeration (what reaches `atoms` without this path)

Read from engine `cfa18bc`, `grep` for mutation verbs outside tests:

| Path | Kind | Disposition |
|---|---|---|
| `pg-storage.ts:166, 226` single-row `writeAtom` / `writePropertyAtom` | warm-time single writes | Not bulk. Stays. Enumerated; a CI grep fails if a loop over it appears in a `write-*-county` script. |
| `property-atom-batch-write.ts:164` `upsertPropertyAtomRowsMulti` | current bulk path | Retired by refuse in P-82 once the stage path is live; `writePropertyAtomsBatchLegacy` stays test-only. |
| `load-snapshot-into-pg.mjs:109, 166` raw `INSERT` | snapshot bootstrap | Requires a `HeldLease` for scope `snapshot:<db>` or is deleted; decided in P-83. |
| `bake-property-atom-county.mjs:1039`, `backfill-*.mjs`, `restamp-*.mjs`, `migrate-*.mjs` `UPDATE atoms` | one-off repair scripts | Enumerated in the WDLL; each either takes a scope or is marked archived. |
| Raw SQL from any shell | always possible | Not preventable by code; the run ledger plus `updated_at` audit query (rows updated outside any run window) is the detector, run by `status --audit`. |

## 11. Three-question gate

1. What executes it: the Cloud Run Job image, `writeStagedAtoms`, the DB scope check, the score-drain job. Not a person.
2. What triggers it: every chunk (lease and scope), every phase (record), every verified run (score request), Cloud Scheduler (drain).
3. What fails: `SCOPE_MISMATCH`, `HELD_BY_OTHER`, `LEASE_NOT_HELD`, verify mismatch, all with non-zero task exit and a `failed` or `refused` row; is it in production: only after the P-81 first proof, and the WDLL grades each by violation.
4. What bypasses it: section 10.

leave_behind: none from this document; it proposes, it does not mutate.
