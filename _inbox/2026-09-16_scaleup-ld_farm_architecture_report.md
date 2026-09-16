---
id: 2026-09-16_scaleup-ld_farm_architecture_report
title: Farm architecture -- corrected map, measured capacity, and the option evaluation against code
date: 2026-09-16
status: FINAL for this lane. Read-only research; nothing here changes a store, a job, or a secret.
kind: architecture-report
lane: scaleup-ld-farm-architecture
planRows: [P-187, P-198]
parent: _inbox/2026-09-16_farm_architecture_draft.md
cp1: _inbox/2026-09-16_scaleup-ld-farm-architecture_cp1.json
cp2: _inbox/2026-09-16_scaleup-ld-farm-architecture_cp2.json
snapshot: |
  Live reads, 2026-09-16, this session:
  - gcloud: hauska-prod-497015 and legacy-design-tools-prod (run jobs/services, Secret Manager list),
    account empressaioemail@gmail.com.
  - Neon API (console.neon.tech/api/v2) via NEON_API_KEY, already in Secret Manager, read-only GET calls.
  - Factory store (FACTORY_DATABASE_URL) and atoms store (ATOMS_DATABASE_URL): schema introspection and
    bounded SELECTs, no unindexed full scans.
  - Code: origin/main via `git show`/`git grep`, never a working tree -- two of the four repos
    (hauska-engine, legacy-design-tools) had moved past the draft's 2026-09-16-cited snapshot by the time
    this lane read them (hauska-engine eb42ff2 vs draft's 2d85fee; legacy-design-tools 70113a14 vs draft's
    ba39b4f5); hauska-factory (bfb7303) and hauska-map (f7fbcbf) were unchanged.
---

# Farm architecture -- corrected map, measured capacity, option evaluation

## 0. How to read this report

Every number below either names the live call that produced it (a `gcloud ... describe`, a Neon API
path, a SQL query against a named table) or is marked **UNMEASURED** with what would be needed. Nothing
is carried forward from the draft's memory citations without being independently re-sourced or explicitly
flagged as not re-sourced this session. Falsifier 3 (every capacity number names its source) is scored in
the close JSON.

---

## 1. Corrected architecture map

### 1.1 What the draft got right, unchanged

The four-hop shape (sources -> landing -> factory store -> atoms store -> serving) is correct. The
factory store size (107 GB) and the atoms count (~102M, ~1.4M buildable-envelope) are correct, and are
independently re-confirmed below by a different method than the draft used (live `pg_class`/`pg_stats`
queries today, not a snapshot read).

### 1.2 What is corrected or added

**All Cloud Run compute lives in ONE GCP project, not scattered per-repo.** `gcloud run jobs list
--project=hauska-prod-497015` returns 40 jobs -- every `factory-*` job, `hauska-engine-atoms-writer`,
`hauska-engine-depth-warm-remint`, `hauska-engine-footprint-retag`, and `ldt-cad-ingest` all live in the
same project, region us-east4. `gcloud run services list` in that project shows `factory-control`,
`hauska-engine-api`, `hauska-mcp-server`, `hauska-retrieval-api`. A second project,
`legacy-design-tools-prod`, hosts only `cortex-api`, `smartsite-mcp`, `records-request-worker` (services)
and one job (`pe-overpass-tip-smoke`). The draft's diagram implies a looser per-repo topology; in fact
there are exactly two GCP projects in the writer/serving path, and the factory jobs and the engine's
atoms-writer jobs share one project's IAM, quota and Cloud Scheduler.

**The atoms store and the landing store are the same Neon PROJECT, not just the same environment
label.** `cortex-prod` (Neon project id `fancy-fire-06136146`, aws-us-east-1) has a `production` branch
that is read through TWO separate secrets -- `PRODUCTION_NEONDB_URL` (the LDT/cortex landing database,
`neondb`) and `PRODUCTION_HAUSKA_MCP_URL` (the atoms database, `hauska_mcp`) -- but both point into the
same Neon project and, on `main`, the same primary branch's compute. The factory store is a genuinely
separate Neon project (`hauska-factory`, id `withered-surf-26870298`, aws-us-east-1). So there are
**two** Neon projects in the write/serve path, not three logically-separate stores with three separate
blast radii; two of the draft's "three copies" (atoms, and half of "the ledger" -- the landing tables the
ledger is built from) already share infrastructure today.

**"Staging" already is a Neon branch pair -- singular, reused, not farmed.** `cortex-prod` has 9 branches:
`production` (primary) plus 8 non-default. Exactly two of the eight -- `f06-staging-neondb` and
`f06-staging-hauska_mcp` -- are the live, reused staging pair the publish job's `STAGING_NEONDB_URL` /
`STAGING_HAUSKA_MCP_URL` secrets point at; both were last **reset in place** (Neon `delete_timeline` +
`create_branch` under the same name, not a fresh branch) at 2026-09-14T15:02:37Z, and again roughly 80
minutes earlier the same day. The other **six** non-default branches are stray (detailed in Section 3).
**The factory store (`withered-surf`) has exactly one branch, ever** ("main") -- it has never been
branched. This is a correction to the draft's Option B description ("a factory branch and an atoms
branch per county"): the atoms/landing half of that pattern already exists in embryo (singular, reused);
the factory-store half does not exist at all.

**The factory store already grew a read replica.** Two Neon endpoints exist on `withered-surf`: one
`read_write` (autoscaling 0.25-8 CU) and one dedicated `read_only` (autoscaling 2-8 CU). Secret Manager
shows `FACTORY_DATABASE_URL_RO` (created 2026-09-02) and `FACTORY_DATABASE_URL_REPLICA` (created
2026-09-04) alongside the original `FACTORY_DATABASE_URL` -- both created days after the draft-cited
2026-08-28 read-timeout incident. This is a partial, already-shipped mitigation for bottleneck #1 that
the draft's diagram and bottleneck table do not show. (Which application code actually uses the `_RO` /
`_REPLICA` secrets was not traced in this session -- flagged as open.)

**The publish and writer pipelines are hard-capped at exactly two named targets, in code, in both
repos.** `hauska-factory/src/lib/publish-target-env.mjs`: `PUBLISH_TARGETS = Object.freeze(["staging",
"production"])`, each bound to one fixed secret-name pair; `assertKnownTarget` throws `TARGET_UNKNOWN` for
anything else. `hauska-engine/packages/engine-core/scripts/writer-target-env.mjs` mirrors this exactly
(`WRITER_TARGETS`, same two names, same two secret-name pairs; its own comment: "Mirrors hauska-factory's
publish-target-env.mjs exactly"). This is not in the draft at all, and it is the single most consequential
correction in this report -- see Section 4.

**`parcel_record_cell` has no version column and no atom pointer, confirmed on live data, not just from
the map adapter's defaults.** Schema: `place_key, rail_key, cell_state jsonb, updated_at` -- four columns,
nothing else. Sampled rows for real Bastrop parcels (`48021:51563`) carry `cell_state` bodies like
`{"kind": "value", ..., "source": "tx_school_district", "vintage": "..."}` or, where the store is named,
`"source": "hauska_mcp.atoms"` as a **string label**, never an `atom_did`. This independently corroborates
the draft's "a cell carries no atom pointer" claim from schema + live data, a different angle than the
draft's map-adapter reading.

**`atom_did` is not county-prefixed (P-193), and the actual collision-safety mechanism is `entity_id`,
not the DID shape.** Sampled: `did:hauska:well-fact:48179:862:none` -- county fips is a middle segment.
The unique constraint on `atoms` is `atoms_entity_composite_unique (entity_type, entity_id)`, and
`entity_id` itself already carries county fips (`"48179:862:none"`). Cross-farm merge safety therefore
depends on every writer setting `entity_id` correctly, not on anything the DID scheme enforces structurally.

---

## 2. Capacity table (every figure sourced)

| Item | Value | Source |
|---|---|---|
| Factory store (Neon project `hauska-factory`, id `withered-surf-26870298`) logical size | 115,075,653,632 bytes = 107.16 GB | Neon API `GET /projects` `synthetic_storage_size` |
| Factory store region / provisioner | aws-us-east-1, pg18 | Neon API `GET /projects` |
| Factory store autoscaling (read-write endpoint) | 0.25-8 CU, suspend_timeout -1 (never auto-suspends) | Neon API `GET /projects/{id}/endpoints` |
| Factory store autoscaling (read-only endpoint) | 2-8 CU, suspend_timeout -1 | Neon API `GET /projects/{id}/endpoints` (this endpoint post-dates the 2026-08-28 incident) |
| Factory store branch count | 1 ("main"; never branched) | Neon API `GET /projects/{id}/branches` |
| cortex-prod (Neon project id `fancy-fire-06136146`) production branch logical size | 309,126,742,016 bytes = 287.9 GB | Neon API `GET /projects/{id}/branches` |
| cortex-prod branch count | 9 (1 production + 8 non-default; 2 live-reused staging, 6 stray) | Neon API `GET /projects/{id}/branches` |
| cortex-prod production endpoint autoscaling | rw 0.25-8 CU (suspend -1, always on); ro 2-8 CU (suspend 300s, idle since 2026-09-11) | Neon API `GET /projects/{id}/endpoints` |
| Org plan tier | `scale` | Neon API `GET /users/me/organizations` |
| Org-wide per-branch logical size cap | 17,592,186,044,416 bytes = 16 TiB | Neon API `GET /projects/{id}` `branch_logical_size_limit_bytes` (same value on both projects; an account-level default, not farm-specific) |
| Branch **count** limit (org/plan ceiling) | **UNMEASURED** | No read endpoint queried returned an explicit cap (`quota` field is `null` on both projects' detail response); determining the true ceiling would require either Neon's plan documentation (not an API response) or an actual branch-creation test (a write, out of scope for a read-only lane) |
| atoms table (`atoms`, inside `hauska_mcp` db) row count | 102,349,856 | live `pg_class.reltuples` estimate, `ATOMS_DATABASE_URL`, today |
| atoms table total size (table + indexes) | 199 GB | live `pg_total_relation_size`, `ATOMS_DATABASE_URL`, today |
| buildable-envelope share of atoms | 1.36167% -> ~1,393,700 rows | live `pg_stats.most_common_vals/freqs` on `entity_type` (no table scan), cross-checked against the draft's independently-sourced "1.4 million" |
| `parcel_record_cell` row count / size | 76,055,440 est. rows / 26 GB | live `pg_class`, `FACTORY_DATABASE_URL`, today |
| `landing_txgio_parcel` | 15,070,086 rows / 31 GB | live `pg_class`, today |
| `landing_tx_building_footprint` | 9,800,527 rows / 15 GB | live `pg_class`, today |
| `write_stage_atoms` (identity staging) | 6,547,951 rows / 9.4 GB | live `pg_class`, today |
| `atom_links` | 6,967,513 rows / 4.5 GB | live `pg_class`, `ATOMS_DATABASE_URL`, today |
| `parcel_record` | 981,267 rows / 160 MB | live `pg_class`, today (draft cited 981,405 two days earlier -- consistent with normal drift, not a discrepancy) |
| County-bounded atom indexes | Exist ONLY for `parcel-node` and `road-node` entity types (`atoms_parcel_node_county_idx`, `atoms_road_county_fips_idx`, both partial on `body->>'countyFips'`). `buildable-envelope`, `setback-rule`, `zoning-fact`, `parcel-terrain-model` share one `parcelNodeId`-only lookup index, not county-bounded. | live `pg_indexes`, `ATOMS_DATABASE_URL`, today -- confirms draft bottleneck #6 |
| stage-e-conformant throughput (identity/edge resolution, factory store) | ~667 rows/s (1,204,100 rows over 1805s between two consecutive `rate` events, 2026-08-28 11:10-11:40) | live `run_events` where `kind='rate'`, joined to `runs.phase='stage-e-conformant'` |
| restamp-access throughput (identity.alias restamp) | ~2,000 rows/s (5,000-row batches at ~2.5s cadence) | live `run_events` where `kind='restamp-batch'`, 2026-08-28 12:43 |
| p2-juris-containment throughput (jurisdiction containment) | ~4,400-7,300 rows/s (8,000 rows in 1.1-2.1s, three samples) | live `run_events` where `kind='measure'`, 2026-09-01 |
| Tier-1 bake page throughput (`place_layer_snapshots`) | ~65-82 props/s scanned per page (8,159 written of 8,000 in 97.8s in one sample; write yield highly variable, 215-8,159 written per identically-sized page) | live `run_events` where `kind='bake-page'`, 2026-09-14 |
| `parcel-envelope-cells` / `parcel-setback-cells` row throughput | **UNMEASURED** -- `counts` and `cost` are NULL on all 14 sampled runs (2026-09-10 through 2026-09-15); zero `run_events` rows exist for either phase | live `runs`/`run_events` query, today -- this is itself a finding, not just a gap in this session's access |
| `parcel-envelope-cells` / `parcel-setback-cells` wall-clock | Recoverable: 2.4s to 1,102.1s across the 14 sampled runs (high variance, likely scope-size-dependent) | live join of `runs.started_at` to `termination_records.recorded_at` on `run_id`, today |
| Atoms bulk-writer throughput (draft's cited 67.4 / 149.0 atoms/s) | **UNMEASURED-IN-SESSION** -- `atoms_writer_lease_v2` / `atoms_writer_lease_history` carry `taken_at`/`released_at` but no row-count column, so a rate cannot be re-derived from them; only 4 completed lease holds exist in the history table at all (all 2026-09-12 through 2026-09-15, each 39s-90s, each a single `(entity_type, county_fips)` scope) | live `atoms_writer_lease_history`, `ATOMS_DATABASE_URL`, today. The figure is not disputed, only not independently re-sourceable from any table this session could read -- reported per falsifier 3 rather than carried forward from memory |

---

## 3. Contention incidents

| Incident | Status as measured today | Source |
|---|---|---|
| 2026-08-28 factory-store read timeouts (60-90s on primary-key reads under one county writer) | Not independently re-triggered (by design -- this is a read-only lane and re-triggering it would be a live incident, not a measurement). Corroborated indirectly: `FACTORY_DATABASE_URL_RO` (2026-09-02) and `FACTORY_DATABASE_URL_REPLICA` (2026-09-04) secrets, and a dedicated 2-8 CU read-only Neon endpoint on `withered-surf`, all appeared within a week of the incident date. | Secret Manager `list` (creation dates), Neon API endpoints |
| **Stray Neon branches -- live today, not historical.** Six non-default branches in `cortex-prod`, none ever deleted (`delete_branch` appears zero times in the last 100 operations), oldest named `f06-staging-hauska_mcp-planner-20260828T142734Z` -- its own name timestamps the 2026-08-28 incident. Each carries 260-309 GB logical size (near-full copies of production). Several show `last_active` **today** (2026-09-16T12:46-13:07Z), meaning something still touches them. | LIVE, UNRESOLVED as of this report | Neon API `branches`/`endpoints`/`operations`, today |
| Atoms writer lease contention | Only 4 completed holds exist in `atoms_writer_lease_history` in total (table appears to date to the store's 2026-08-26 creation), most recent 2026-09-15T02:52 (49s, scope `parcel-node:48021`). `atoms_writer_lease_v2` currently holds 0 rows (no active writer right now). No evidence of contended/stolen leases in the sampled history (`stolen_from` column present but not populated in the 4 rows read). | LOW ACTIVITY, as measured -- does not itself show contention; may reflect that most atom-writing paths (e.g. `factory-atoms-cad`) bypass the v2 lease via a fixed `ATOMS_DATABASE_URL` connection rather than acquiring a scoped lease -- not traced further this session | live `atoms_writer_lease_v2`/`atoms_writer_lease_history` |
| "Harris writer lease" (named in dispatch prose) | **NOT independently located this session.** No lease-history row or run record referencing Harris County (48201) was found in the queries run. Reported as inherited from the dispatch text, unverified here. | n/a |
| Heavy-scan serialization | Confirmed as AGENT_CONTRACT section 4 policy (doc_repo, read this session). No live contention incident was independently observed -- this lane avoided triggering one by using `pg_class`/`pg_stats` instead of full scans throughout. | `90_runbooks/AGENT_CONTRACT.md` |
| Rate limits (named in dispatch prose) | **NOT independently located this session** as a specific incident; `rate_limit_counters` table exists in the atoms store schema but its contents were not sampled. | schema listing only |
| Cloud Scheduler cadence (context for contention) | `factory-conformant-reap` every 10 minutes; `factory-publish-gate-sched-hourly` on the hour. No scheduler entry exists for `bastrop-publish`, `verify-walk`, `parcel-setback-cells` or `parcel-envelope-cells` -- those are execute-on-demand, not cron. | `gcloud scheduler jobs list --project=hauska-prod-497015 --location=us-east4` |

---

## 4. Option evaluation, tested against code

**The frozen target enum is the load-bearing fact for this whole section.** `PUBLISH_TARGETS` and
`WRITER_TARGETS` are each `Object.freeze(["staging", "production"])` in their respective repos, and each
target name resolves to exactly one hardcoded pair of Secret Manager secret names
(`STAGING_NEONDB_URL`/`STAGING_HAUSKA_MCP_URL` vs `PRODUCTION_*`). `assertKnownTarget` /
`assertKnownWriterTarget` throw `TARGET_UNKNOWN` for any other string. This is true **today**, at
`origin/main`, in both `hauska-factory/src/lib/publish-target-env.mjs` and
`hauska-engine/packages/engine-core/scripts/writer-target-env.mjs`.

**Falsifier 2, walked step by step: "two counties publish in the same hour."**

1. A Bell-farm execution and a Milam-farm execution both call `factory-bastrop-publish --target=staging
   --county=<fips>` (the job/CLI name stays "bastrop-publish" per its own header comment, which is
   self-documented as pending a rename and does not block the county argument).
2. Each execution's `resolveTargetStores(env, "staging")` resolves the **same two secret names**
   (`STAGING_NEONDB_URL`, `STAGING_HAUSKA_MCP_URL`) -- but Cloud Run job executions already support
   per-execution `--update-env-vars` overrides (confirmed by the job's own header comment describing this
   exact mechanism for `OPERATOR_PUBLISH_GO`/`PRODUCTION_SITE_URL`, and confirmed structurally: an
   execution's env is set at invocation time, never via `gcloud run jobs update`). So in principle two
   concurrent executions COULD each be given different override values for `STAGING_NEONDB_URL`, pointing
   at two different farm branches, without one execution's env leaking into the other's container.
3. BUT every execution also opens `FACTORY_DATABASE_URL` -- a single, fixed, non-target-scoped secret --
   for its bookkeeping (`runs`, `publish_runs`, `leases`). That store is genuinely shared. The bookkeeping
   itself tolerates two counties concurrently: `publish_runs` is keyed by `(county_fips, target)`, and
   `leases` is scoped by `(entity_type, county_fips)` -- Bell and Milam write **distinct** rows there, no
   collision.
4. So the actual finding is narrower than "will collide": **the bookkeeping/identity layer already
   tolerates two counties publishing in the same hour, on shared stores, today (Option A).** What does
   NOT yet exist is a way for two counties to each have their OWN isolated staging compute/branch under
   a distinct **name** -- because "staging" is one name pointing at one secret pair pointing at one branch
   pair. Two farms can share the one door serially, or one of them must not be called "staging" at all,
   which requires the code change described above, in both `publish-target-env.mjs` and
   `writer-target-env.mjs` (plus corresponding Secret Manager entries, itself a "new secret mount" --
   one of the program's three named operator stop points).

| Option | Isolation | Merge mechanics (from code) | Throughput | Failure/rollback | Operational hazard, measured |
|---|---|---|---|---|---|
| **A. Shared stores, county-scoped** | Data only. Works exactly as today; no code change. | `publish_runs`/`leases` already partition cleanly by `(county_fips, target)` -- confirmed safe for concurrent counties. | Bottlenecks 1-3 remain; the factory store's own read-replica addition shows compute contention is real enough that a mitigation was already needed even for ONE county's traffic. `parcel-envelope-cells`/`parcel-setback-cells` (rail-fill + depth) currently report zero throughput telemetry, so contention there is literally invisible today. | No retract-by-run-id anywhere in either repo (confirmed absent by `git grep`). A bad farm run on shared stores has no row-level undo. | None beyond what exists today. |
| **B. Neon branch pair per farm** | Data AND compute, per the atoms/landing half; the factory-store half does not exist as a pattern yet (only 1 branch, ever). | Requires generalizing `PUBLISH_TARGETS`/`WRITER_TARGETS` beyond 2 values (code change, both repos) plus a corresponding factory-store branch each farm can bulk-load into and publish from -- net-new plumbing, not present today. Atom-merge identity is safe BY CONSTRUCTION (entity_id embeds county fips, composite unique constraint) regardless of which branch produced the row. | Each farm gets its own compute (0.25-8 CU per branch, same org-wide ceiling as today -- no evidence a per-branch CU cap differs from the project default). | Same retract-by-run-id gap as A, PARTIALLY mitigated: a bad run confined to its own branch can be discarded by abandoning the branch before merge; a bad run already merged into production has the identical gap as every other option. | **Confirmed live and unresolved**: 6 stray branches in `cortex-prod` today, oldest from 2026-08-28, several still showing compute activity today. A farm-per-branch policy adopted without first building branch lifecycle/cleanup would reproduce this pattern at N times the rate. |
| **C. Separate Neon project per farm** | Strongest, confirmed structurally (a separate project has its own quota, its own secrets, its own autoscaling ceiling independent of the others). | Same target-enum code change needed as B, PLUS each farm needs its own full secret set and Cloud Run job deployment (or heavy parameterization of the existing jobs) -- doubles the surface the "no new county is written on the old shape" (OPS-19 rule 8) discipline has to hold across. | Best, by construction -- no shared compute at all. | Same retract-by-run-id gap. Merge is now cross-project export/import, not a branch operation -- a genuinely different (and unbuilt) code path from anything in either repo today. | Highest ops cost, confirmed by this session's own secret inventory: 9 distinct Neon-DSN-bearing secrets already exist for TWO Neon projects; N farm projects would multiply that. |
| **D. Shared stores, bulk write path** | Data only; orthogonal to A/B/C. | No target-enum change needed; the merge mechanics are whatever the isolation option provides. | Directly addresses the two live-measured low points: the tier-1 bake's ~65-82 props/s page-scan rate, and the entirely uninstrumented envelope/setback-cell writers. Complements any of A/B/C. | No change to retract-by-run-id. | None beyond what exists today; does not touch the branch-cleanup hazard. |

---

## 5. Recommended architecture, with the three preconditions this session's evidence adds

**Direction: B (branch pair) + D (bulk path) -- the same direction as the draft's lean, but not yet
actionable as written**, because three preconditions surfaced in code and in live infrastructure that the
draft did not have evidence for:

1. **Generalize the target model first.** `PUBLISH_TARGETS` / `WRITER_TARGETS` must stop being a frozen
   `["staging", "production"]` pair before a second concurrently-running farm can exist under its own
   name rather than serializing through the one "staging" door. This is a code change in both
   `hauska-factory/src/lib/publish-target-env.mjs` and `hauska-engine/packages/engine-core/scripts/writer-target-env.mjs`,
   plus new Secret Manager entries per farm-scoped target (a "new secret mount" -- one of the program's
   three named operator stop points).
2. **Build branch lifecycle/cleanup before farm-per-branch ships.** Six branches from the 2026-08-27/28
   period are still alive, still sized near-full, and some are still active today. A farm architecture
   that creates a branch pair per county without first closing this loop will make the existing,
   unresolved hazard worse in direct proportion to farm count.
3. **Instrument `parcel-envelope-cells` and `parcel-setback-cells` before claiming "Bell and Milam beat
   Burnet" is measurable.** These are exactly the rail-fill and depth stages a farm runs repeatedly, and
   today they write zero counts/cost telemetry (wall-clock is recoverable; rows and dollars are not).

### 5.1 Stage placement (store/writer/gate/operator-stop, corrected where this session has live evidence)

| Stage | Store (as measured) | Writer (Cloud Run job, confirmed via `gcloud run jobs describe`) | Gate / instrument | Operator stop |
|---|---|---|---|---|
| Recon / manifest | doc_repo catalog; no dedicated store found | n/a | n/a | none |
| Pre-bake audit | reads sources live | n/a (no dedicated Cloud Run job found under this name) | `requirePreBakeReadiness` (confirmed present in `bastrop-publish.mjs` imports, runs pre-write) | RED per dispatch law |
| Acquire | landing tables in cortex-prod `neondb` | `factory-acquire-ag-valuation`, `-austin-watershed`, `-edwards-recharge-zone`, `-overlay-districts`, `-school-district`, `-utility-ccn`, `-wcad-owner`, `ldt-cad-ingest` (all confirmed live jobs) | loader run records in `runs` (confirmed schema) | new credential |
| Vendor (Cotality) | not found as a distinct Cloud Run job in this project | n/a -- capped per canon preamble | n/a | contract terms |
| Identity | factory store, `write_stage_atoms`/`write_stage_edges` (confirmed tables, 9.4 GB / 1.4 GB) | `factory-p2-juris`, restamp-access phase (confirmed run_events) | join-rate instrument -- throughput sampled this session (p2-juris-containment ~4,400-7,300 rows/s) | none |
| Instantiate / rail fill | factory store, `parcel_record`/`parcel_record_cell` (confirmed 981K / 76M rows) | `factory-parcel-record-fill`, `factory-parcel-r4-companions`, `-r5-zoning`, `-owner`, `-school-district`, `-utility-service`, `-overlay-districts`, `-ag-valuation`, `-max-impervious-cover`, `-building-footprint-reconcile` (all confirmed live jobs) | run records exist; counts/cost populated for some (not verified exhaustively) | none |
| Depth (envelope family) | factory store writes cells; atoms store (via `hauska-engine-atoms-writer`, `hauska-engine-depth-warm-remint`) writes the envelope/setback/boundary atoms | `factory-parcel-setback-cells`, `factory-parcel-envelope-cells`, `hauska-engine-depth-warm-remint` (confirmed live jobs) | **UNMEASURED for the two factory-side jobs**: zero counts/cost/run_events on 14 sampled runs | none |
| Atoms | atoms store (`hauska_mcp`, 199 GB, 102.3M rows, confirmed live) | `hauska-engine-atoms-writer`, `factory-atoms-cad` (confirmed live jobs; the latter bypasses the target model, reading `ATOMS_DATABASE_URL`/`SOURCE_DATABASE_URL` directly) | `atoms_writer_lease_v2` scoped `(entity_type, county_fips)`, confirmed exercised (4 holds in history, all recent, all clean releases) | none |
| Completeness | factory store | not independently isolated as its own job in this session's inventory | `county_facet_coverage`/`city_facet_coverage` tables exist (confirmed schema) | none |
| Gate | factory store | `factory-publish-gate-sched` (confirmed live, hourly cron) | `parcel_gate_verdict` table (391 rows, confirmed); P-236 population-collapse refusal (`requireCountyCoverageFloor`, confirmed live code, added 2026-09-15) | none |
| Publish | cortex-prod staging branch pair -> production branch | `factory-bastrop-publish` (confirmed county-parameterized in practice; `--target`/`--county` args) | `requireStagingSibling`, `requireCadRollPostcondition`, `requireCountyCoverageFloor` (all confirmed present) | production write |
| Customer probe and meter | surfaces (`hauska-retrieval-api`, `cortex-api`, `hauska-mcp-server`) | n/a | `scripts/surface-probe.mjs` (doc_repo) | none |
| Merge | production | n/a today beyond the publish job itself | manifest vs upstream (not independently verified this session) | none |

---

## 6. Speed-record specification (Q6)

| Measure | Captured automatically today? | Mechanism, as measured | What still needs a person |
|---|---|---|---|
| Wall-clock | **Yes, already, for every job type sampled** -- including the two under-instrumented ones | `runs.started_at` joined to `termination_records.recorded_at` on `run_id` (confirmed working: e.g. one `parcel-setback-cells` run measured 1,102.1s, one `parcel-envelope-cells` run measured 855.7s) | nothing |
| Rows in / out, dollars | Not for `parcel-envelope-cells`/`parcel-setback-cells` (NULL on all 14 sampled runs). Populated for at least some other jobs (`runs.counts`/`runs.cost` jsonb columns exist and are used, e.g. `factory-dollar-fields-patch`'s `counts` carries a full summary object) -- not exhaustively audited across all 40 job types this session. | `runs.counts`, `runs.cost` jsonb columns already exist in the schema; the gap is that two specific job families do not populate them, not a missing column | populating counts/cost in the two under-instrumented job families is a code change, not a person, but verifying the fix landed needs a person to re-sample after |
| Operator minutes | **No** -- no operator-time column found anywhere in `runs`, `termination_records`, or `publish_runs` | n/a | needs a person to log, or an inferred proxy from gaps between operator-triggered executions (imprecise) |
| Fixes needed / re-runs | Partially inferable: `runs.status` (`succeeded`/`crashed`/`refused`) and `refuse_code` allow counting re-runs per `(phase, county)` by grouping | `runs` table schema (confirmed) | "a person diagnosed and patched code" is not captured anywhere found; `defects`/`defect_events` tables exist in the factory schema referencing `_blueprint/40_rule_register.md` rule classes (V1 borrowed-keys, V2 tier2-flood-centroid, V3 access-policy-default sampled) -- these look like a static rule-class register in the 3 rows sampled, not confirmed to carry per-run defect instances; **not exhaustively sampled this session, flagged as promising further work** |
| Dollars (compute cost) | Same as rows/dollars above -- `runs.cost` column exists, unpopulated for the two rail-fill/depth job families | n/a | needs code to populate, then a person or a scheduled query to correlate against Neon/Cloud Run billing if per-run cost attribution beyond the `runs.cost` column is wanted |

---

## 7. Hardcoded-literal list

| Literal | Where | Blocks a farm? | Confirmed |
|---|---|---|---|
| `CONSTRAINT_SEARCH_COUNTIES = ["48021","48055","48209","48309","48453","48491"]` | `legacy-design-tools/artifacts/api-server/src/lib/parcelConstraintSearch.ts:55` | **Yes -- hard REFUSAL**, not silent: a non-listed county's constraint-search request is explicitly refused with a message naming the six in-scope counties. Burnet (48053), Bell (48027), Milam (48331) all absent. | git grep on origin/main, today |
| `ALL_SIX_COUNTIES` (test-only alias of the same six) | `legacy-design-tools/artifacts/api-server/src/lib/parcelRecordAllowlist.test.ts` | Test fixture only, not production code | git grep on origin/main |
| `PUBLISH_TARGETS = ["staging","production"]` / `WRITER_TARGETS = ["staging","production"]` | `hauska-factory/src/lib/publish-target-env.mjs`, `hauska-engine/packages/engine-core/scripts/writer-target-env.mjs` | **Yes -- the structural blocker for parallel farms** (see Section 4). Not a county literal; an environment-name literal. | git show on origin/main, today |
| CLI command `bastrop-publish` / Cloud Run job `factory-bastrop-publish` / file `src/jobs/bastrop-publish.mjs` / `reaper.mjs` allowlist entry `"bastrop-publish": ["factory-bastrop-publish"]` | `hauska-factory/src/cli.mjs`, `src/control/reaper.mjs` | **No -- naming only**, self-documented in the file's own header comment as pending "a rename card"; `--county=<fips>` is validated against the full 254-county Texas roster and every internal behavior is county-scoped. | git show on origin/main, today |
| `TX_COUNTY_FIPS_SET` / `TX_COUNTY_FIPS` (254 entries) | `hauska-factory/src/data/tx-county-fips.mjs` | **No -- checked and cleared.** Burnet 48053, Bell 48027, Milam 48331 all present. | git show on origin/main, today |
| `zoning-layer-completeness.mjs`'s per-city completeness registry (hand-entered `cellPct`/`arealPct`/`layerVintage` per city, e.g. `Bastrop: { cityKey: "bastrop-tx", cellPct: 99.24, ... }`) | `hauska-factory/src/config/zoning-layer-completeness.mjs` | **Structural, not a bug**: every new city needs a hand-authored entry; nothing generates these. A farm county's cities must be added by hand before completeness can be measured for them. | git show on origin/main, today |
| `acquire-overlay-districts.mjs`'s hand-scouted per-city ArcGIS URLs (Bastrop, Kyle, Cedar Park, Pflugerville, Hutto, Taylor only) | `hauska-factory/src/jobs/acquire-overlay-districts.mjs` | **Structural, not a bug**: acquisition sources are inherently hand-curated per jurisdiction; a farm county needs new entries authored by hand, same as any new city today. | git show on origin/main, today |
| `SIX_COUNTIES` / `zoningLayerRegistry`-style literal in `hauska-map` or `hauska-engine` | Searched (`git grep` on origin/main in both repos) | **Not found** -- negative result. The dispatch's named starting points (`SIX_COUNTIES`, `CONSTRAINT_SEARCH_COUNTIES`) turned out to both resolve to the one LDT array; no analog was found elsewhere in the two repos searched. Caveat: targeted grep, not an exhaustive registry-name search. | git grep on origin/main, today |

---

## 8. What this session could not establish

- The draft's specific atoms-writer throughput figures (67.4 / 149.0 atoms/s) could not be independently
  re-derived from any table this session had read access to.
- The "Harris writer lease" and generic "rate limit" contention incidents named in the dispatch's prose
  were not independently located.
- Which application code paths actually use `FACTORY_DATABASE_URL_RO` / `FACTORY_DATABASE_URL_REPLICA`
  was not traced.
- Whether `defects`/`defect_events` carry per-run instances (useful for the speed-record's "fixes needed"
  column) or only a static rule-class register was not resolved from the 3 sampled rows.
- Neon's actual branch-count ceiling for the `scale` plan was not returned by any read endpoint queried.
- `county_ledger_published` and the completeness/gate tables' live contents were enumerated by schema but
  not sampled for content depth.

These are named rather than guessed at, per the verification rules in AGENT_CONTRACT section 5.
