---
title: Parallelism design proposal — safe-by-construction writes for statewide fabric
date: 2026-08-08
status: proposal
author: design-analyst (read-only session)
related: [90_operations/CATCHUP_program_2026-08-05, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_PROBE_from_scratch_feasibility.json, _inbox/2026-08-08_PROBE_profile_hot_path.json, 90_runbooks/factory_onboarding_runbook]
---

# Parallelism design proposal

Read-only analysis, 2026-08-08. Proposes a concurrency model that replaces planner-enforced heavy-scan slot discipline with structural isolation, without deleting the safety rationale that produced the slot rule.

## Executive summary

**Recommended unit of isolation:** **`county_fips` for L2 `txgio_parcel` ingest** (PK prefix is disjoint); **`parcelNodeId` lexicographic keyspace range within a county** for atoms heavy scans (cascade, warm, bake) — the pattern already proven on McLennan 48309. County alone is necessary but not sufficient on atoms when two jobs share a FIPS (Bastrop city + Elgin city + county-wide cascade all write `48021:*`).

**Defensible 235-county wall-clock (L2 geometry load only):** **not claimable from existing measurements.** Per-county StratMap→`txgio_parcel` load duration is not instrumented in any artifact read for this proposal. With **8 parallel county workers** and a **hypothetical** 45-minute median county load (mid-size ~50k parcels — **assumption, not measured**), expect **ceil(235/8) × 45 min ≈ 22 hours** ingest wall-clock before tile bake. Add **≥30% buffer** for mega-counties (Harris sharded), Donley gap, and Neon write variance → **~29–36 hours** under that unverified median.

**Defensible warm-compute wall-clock for remaining parcel fabric** (not L2 ingest): at **`141.975 ms/parcel` compute-only** (`_inbox/2026-08-08_PROBE_from_scratch_feasibility.json:13`), **write path excluded**, over **~8.74M distinct parcels** (= roster `13,360,496` minus loaded-nineteen `4,617,181` per fabric analysis):

```
8,743,315 × 0.141975 s = 1,240,467 s = 344.6 h serial
344.6 h / 8 parallel county-disjoint workers ≈ 43.1 h (1.8 days)
344.6 h / 11 workers ≈ 31.3 h
```

Apply/write-then-verify is **unmeasured**; adversarial review (`_inbox/2026-08-08_BLUEPRINT_adversarial_review.md:32`) estimates it could **2–3×** the compute leg. Under 8-way parallelism with a 2× write multiplier: **~86 hours (~3.6 days)** warm compute+write — still not L2 ingest, still not L5 zoning/certs.

---

## 0. Problem statement and failure evidence

### The slot rule (why it exists)

`90_operations/CATCHUP_program_2026-08-05.md:32`:

> HEAVY-SCAN SLOT: one heavy scan/bake on the atoms Neon at a time.

The layer-first sequence names this as an open contradiction (`_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md:83–84`).

### The actual failure mode (2026-08-07)

Not “concurrency is bad.” **Two writers on the same cohort.**

| Evidence | Source |
|---|---|
| Dry `verifyPass` 2438 vs apply 1670; pair VOID | `_inbox/2026-08-07_T1_bastrop_cohort_apply_ABORT.md:14–21` |
| Second `--city-cohort --force-overwrite --promote` killed mid-run | `_inbox/2026-08-07_T1_bastrop_cohort_apply_ABORT.md:34–36` |
| Partial store: 1670 promoted + 3746 honestDeclines before abort | `_inbox/2026-08-07_T1_bastrop_cohort_apply_ABORT.md:29–31` |
| Extended parity reconciles 768 as `computePassNotPersisted`, not headline nondeterminism | `_inbox/2026-08-08_T1_dry_apply_reconciliation.md:39–44` |

Geometry Law rule 8 reaffirms store-truth sizing (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md:28`).

---

## 1. What exists already (keyspace sharding)

### Scope: cascade-absence-only on `bake-property-atom-county.mjs` only

Sharding is **not** generalized to depth-warm, zoning bake, or `txgio_parcel` ingest.

| Capability | Location | Behavior |
|---|---|---|
| CLI flags `--parcel-min` / `--parcel-max` | `P:\hauska-engine\packages\engine-core\scripts\bake-property-atom-county.mjs:49–53, 169–176` | Lexicographic inclusive bounds on `body->>'parcelNodeId'` |
| `deriveShardId(min,max)` | same file `:248–253` | `"full"` if unbounded; else `` `${lo}..${hi}` `` |
| `cascadeKeyspaceBoundsSql` | same file `:259–263` | `AND body->>'parcelNodeId' >= min` / `<= max` |
| `--cascade-absence-only` scan loop | same file `:778–791` | Keyset pagination + bounds ANDed into WHERE |
| Summary JSON `shardId`, `parcelMin`, `parcelMax` | same file `:714–722, 736–738` | Emitted on start/done events |
| Default `--batch=500` | runbook `:448`; script parseArgs `:24` in test mirror | `pageSize = min(batch, 500)` at `:742` |
| Vitest pins | `bake-property-atom-county-cascade-sharding.test.ts:103–139` | Arg parse, SQL fragment, summary fields |

### Bounds derivation (McLennan proof)

Runbook `:424–440` — **live SQL `ntile(4)` on distinct `parcelNodeId`**, never zero-padded numeric suffixes (Bell counterexample: `48027:5` sorts after `48027:249999999`).

Proof artifact: `_inbox/2026-08-05_mclennan_sharding_diff_proof.json` — solo `scanned=114255` = sum of four shards; `unionEqualsSolo.verdict: PASS`.

### Storage write concurrency inside one process

`pg-storage.ts:312–362` — `writePropertyAtomsBatch` upserts with **`CONCURRENCY = 32`** parallel INSERTs per batch. This is **in-process** parallelism on one writer; it does not make two processes safe on overlapping keys.

`bake-property-atom-county.mjs:339` — `createPgStorage({ maxConnections: 8 })` for cascade mode.

### What depth-warm does NOT have

Grep of `depth-warm*.mjs`: **no** `parcel-min`, `parcelMax`, or `shardId`. Cohort selection is by city bbox, explicit parcel ID list, or open county query (`depth-warm-bastrop-batch.mjs:323–436`).

### Generalization verdict

| Target | County-parallel | Within-county keyspace shard |
|---|---|---|
| L2 `txgio_parcel` ingest | **Ready** — PK `(county_fips, tile_key, feature_index)` | Possible but unnecessary for most counties; Harris needs ingest shard plan separately (`_catalog/texas_roster_v1.json` harris-sharding-required) |
| `--cascade-absence-only` | **Ready** — prefix `48021:` disjoint from `48029:` | **Proven** (McLennan) |
| Depth warm / promote | **Partial** — different counties OK | **Required** for mega-county; **not implemented** |
| Zoning-fact county bake | **Partial** — same FIPS city overlap risk | Needs same flags as cascade |

---

## 2. Unit of isolation

### Three candidate units evaluated

| Unit | Disjoint write sets? | Evidence |
|---|---|---|
| **County (`county_fips`)** | **Yes for `txgio_parcel`** | PK includes `county_fips` (`_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md:61–62`). 235 absent counties write disjoint key prefixes. |
| **Tile range** | **No for atoms** | Atoms keyed by `parcelNodeId`, not `tile_key`. Tile is a storage artifact for `txgio_parcel` only. |
| **`parcelNodeId` keyspace range** | **Yes when ranges partition the scanned set** | McLennan proof; bounds are lexicographic on `{fips}:{prop_id}` strings. |

### Tile seams do not break county isolation

Fabric analysis (`_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md:446–471`): **0 of 334,638** tile-spanning features have differing geometry hash. Duplication is byte-identical replication; `DISTINCT ON (county_fips, feature_index)` is mechanical (`:551–557`). Cross-county tile keys can repeat (global `g0.02:lng,lat` grid) but PK includes `county_fips`, so concurrent county loads do not collide on the same row.

### Where county isolation fails (atoms)

All of these share **`48021:*`** keyspace:

- Bastrop **city** cohort warm (`--city-cohort`)
- Elgin city warm (same FIPS, different parcels)
- County-wide cascade / zoning bake
- Concurrent duplicate Bastrop warm (the 2026-08-07 abort)

**Road atoms** are scoped by `body->>'countyFips'` (`depth-warm-bastrop-batch.mjs:354–359`). Statewide road twin ingest (L3) will need either county-scoped writes or immutable road IDs with county partitioning; **cross-county road geometry overlap at borders is unexamined** in this session.

### Recommendation

**Two-tier isolation model:**

1. **Tier A — County lease (default):** one active heavy writer per `(database_target, county_fips)` for ingest and for any job that scans `LIKE '{fips}:%'` on atoms.
2. **Tier B — Keyspace shard lease (mega-county or explicit sub-county jobs):** partition `[parcel_min, parcel_max]` within a county; union must equal solo before apply (runbook `:443–444`).

**City cohort jobs** must register a **named parcel set** (roster hash or explicit min/max covering exactly that set), not rely on county lease alone.

---

## 3. The lock — queryable reservation design

### Design goals

1. **Safe by construction** — overlapping ranges cannot both hold `active` status.
2. **Observable** — Command Center renders holder, queue, heartbeat, shard bounds.
3. **Provable before write** — engine refuses heavy apply without a matching active lease (migration end state).
4. **Survives planner context loss** — replaces convention documented in `_scratch/command_center_manifest_mockup.html:1159`.

### Tables (cortex Neon — same DB as `onboarding_ledger_event`)

CC already reads cortex Neon for ledger (`factory_onboarding_runbook.md:293–295`). New tables are ingest-side metadata; no atoms schema change required for v1.

#### `fabric_run`

| Column | Type | Notes |
|---|---|---|
| `run_id` | `uuid` PK | Client-generated |
| `database_target` | `text` | `'atoms'` \| `'txgio'` |
| `job_kind` | `text` | `l2_parcel_ingest`, `cascade_absence`, `depth_warm`, `zoning_bake`, `boundary_primitive`, … |
| `county_fips` | `char(5)` | Required |
| `city_segment` | `text` | Nullable; e.g. `elgin_tx` when job is city-scoped |
| `engine_sha` | `char(40)` | Required for apply legs |
| `dry_run` | `boolean` | |
| `started_at` | `timestamptz` | |
| `finished_at` | `timestamptz` | |
| `artifact_path` | `text` | `_inbox/...` |
| `holder_pid` | `text` | Optional host/process |
| `status` | `text` | `running` \| `completed` \| `failed` \| `aborted` |

#### `fabric_keyspace_lease`

| Column | Type | Notes |
|---|---|---|
| `lease_id` | `uuid` PK | |
| `run_id` | `uuid` FK → `fabric_run` | |
| `database_target` | `text` | |
| `county_fips` | `char(5)` | |
| `range_min` | `text` NOT NULL | `'48021:'` or `'48309:139674'`; use county prefix alone for full-county |
| `range_max` | `text` NOT NULL | `'48021:\xFFFF'` sentinel for open upper bound |
| `shard_id` | `text` | Mirrors `deriveShardId` (`bake-property-atom-county.mjs:248–253`) |
| `status` | `text` | `queued` \| `active` \| `released` \| `expired` \| `aborted` |
| `acquired_at` | `timestamptz` | |
| `heartbeat_at` | `timestamptz` | Updated every N minutes by runner |
| `expires_at` | `timestamptz` | `acquired_at + lease_ttl` |
| `queue_position` | `int` | Optional ordering |

**Overlap exclusion (the safety core):**

```sql
-- No two active leases on the same database may overlap in keyspace within a county.
CREATE UNIQUE INDEX fabric_keyspace_lease_no_overlap
ON fabric_keyspace_lease (database_target, county_fips, range_min, range_max)
WHERE status = 'active';
-- Insufficient alone — need range overlap check. Use acquire function below.
```

**Acquire function (serializable transaction):**

```sql
-- fabric_acquire_lease(database_target, county_fips, range_min, range_max, run_id, ttl_minutes)
-- 1. SELECT ... FOR UPDATE on overlapping active leases:
--    status = 'active'
--    AND range_min <= proposed_max
--    AND range_max >= proposed_min
-- 2. If any row: INSERT queue row status='queued', return {acquired: false, queue_position}
-- 3. Else: INSERT status='active', expires_at = now() + ttl, return {acquired: true, lease_id}
```

**Release:** `fabric_release_lease(lease_id)` → `status='released'`, `fabric_run.finished_at` set.

**Stale lock:** background sweep (or acquire-side) sets `status='expired'` when `heartbeat_at < now() - interval '15 minutes'` OR `expires_at < now()`. Expired lease requires operator acknowledgment before re-run on same range (cf. Bastrop partial apply).

**Prove-before-write (engine gate):**

At apply entry, runner passes `--lease-id=<uuid>`. Engine queries:

```sql
SELECT lease_id, range_min, range_max, engine_sha
FROM fabric_keyspace_lease l
JOIN fabric_run r USING (run_id)
WHERE lease_id = $1
  AND status = 'active'
  AND heartbeat_at > now() - interval '15 minutes'
  AND r.engine_sha = $ENGINE_SHA;
```

Then **every write batch** must only touch parcels inside `[range_min, range_max]` — enforced by reusing `cascadeKeyspaceBoundsSql` pattern on scans and asserting batch parcel IDs ⊆ range before `writePropertyAtomsBatch`.

**Fail-closed invariant (Geometry-Law style):**

> **I-LEASE-1:** No apply-mode property-atom write may proceed without a live lease row whose bounds contain every `parcelNodeId` in the batch. Violation aborts with event `fabric.lease.boundary_breach`.

### Command Center rendering

Extend County Ledger / new **Fabric Ops** panel:

| Widget | Source |
|---|---|
| Active leases table | `fabric_keyspace_lease WHERE status='active'` — county, shard_id, range, job_kind, heartbeat age |
| Queue | `status='queued' ORDER BY queue_position, acquired_at` |
| Slot contradiction banner | If active lease count > 0 AND legacy planner slot says open — surface conflict |
| Per-run drilldown | Join `fabric_run` → artifact_path → batch JSON counters |
| 48h target vs capacity | Show `parallelism_in_use`, `median_county_duration` (once measured), `remaining_counties` |

Mockup already specifies needed fields (`command_center_manifest_mockup.html:1157–1160`): `holds_heavy_slot`, `items_done`, `heartbeat_at`.

---

## 4. The ceiling — how many concurrent writers?

### Measured connection limits (live SELECT, 2026-08-08)

**Atoms Neon** (`hauska-prod-497015` / `DATABASE_URL`):

```sql
SHOW max_connections;  -- 901
SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();  -- 4 (idle)
SELECT setting FROM pg_settings WHERE name = 'max_connections';  -- 901
```

**TxGIO Neon** (`legacy-design-tools-prod` / `DEPLOYMENT_DATABASE_URL`):

```sql
SHOW max_connections;  -- 901
SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();  -- 4 (idle)
pg_database_size: 24 GB; pg_total_relation_size('txgio_parcel'): 5937 MB
```

**Connections are not the binding constraint at 8–16 workers.** At 4 connections per process × 16 workers = 64 ≪ 901.

### Per-process pool settings (engine code)

| Script | Atoms pool `max` | TxGIO pool `max` | Citation |
|---|---|---|---|
| `depth-warm-bastrop-batch.mjs` | 4 | 2 | `:288–297` |
| `bake-property-atom-county.mjs` (cascade) | 8 (via createPgStorage) | N/A | `:339` |
| `writePropertyAtomsBatch` internal | 32 concurrent upserts | — | `pg-storage.ts:313–314` |

### Likely binding constraints (ordered)

1. **WAL / disk write throughput** on bulk `txgio_parcel` ingest — table already 5.9 GB for 19 counties; 235 counties ≈ **4× row growth** if median county smaller than loaded metros, **>10×** if extrapolating metro density (`_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md:86` warns ~60M row-scale vs 13.36M distinct parcels).
2. **Row-level lock contention on `atoms`** when ranges overlap — eliminated by lease, not by connection count.
3. **Neon compute CPU** during promote storms — 32× internal upsert concurrency × N workers.
4. **Single-process IPFS pin latency** in `writePropertyAtomsBatch` (`pg-storage.ts:292–295`) — serial pin per atom before upsert.

### Recommended initial parallelism (conservative)

| Workload | DB | Initial concurrent workers | Rationale |
|---|---|---:|---|
| L2 StratMap → `txgio_parcel` | txgio | **8** | County-disjoint; measure p95 insert latency |
| Cascade / breadth bake | atoms | **4** | Proven shard math; leave headroom for WAL |
| Depth warm apply | atoms | **2–4** | Heavy read+write+IPFS; same-county city jobs stay serial |
| Mega-county (Bexar, Harris) | atoms | **4 shards × 1 worker** | Runbook Bexar rule (`factory_onboarding_runbook.md:399–452`) |

### Experiment to run (not executed here)

**Ramp test:** For txgio, run instrumented ingest on 8 counties sized {small, medium, large} at parallelism P = 1, 2, 4, 8, 16. Record: wall time, `pg_stat_database` blks_write, connection wait, error rate. Stop when p95 county duration ceases to improve or WAL flush latency spikes.

**Atoms write test:** Single county, 4 non-overlapping NTILE shards, parallel apply with leases; verify union-equals-solo on counters + spot-check 100 parcel IDs.

---

## 5. Failure semantics

### Shard / county failure mid-run

| Scope | State after failure | Recovery |
|---|---|---|
| One keyspace shard (others complete) | County **partial** — some `parcelNodeId`s updated | Re-run **only failed shard** after lease re-acquire; union counters must match solo dry-run |
| Whole county ingest | County absent or half-loaded in `txgio_parcel` | Delete county rows + re-ingest, or idempotent upsert if ingest script supports it |
| Overlapping writers (lease bypass) | **Partial cohort mutation** — Bastrop 2026-08-07 class | VOID pair; store-truth roster before re-run (`Geometry Law 8`) |

### Dry/apply extended parity under sharding

**Per-shard counters** emitted in batch JSON with `shardId`, `parcelMin`, `parcelMax` (already on cascade `:714–722`).

**County-level reconciliation** (required before county close):

```
solo_dry.verifyPass == SUM(shard_apply.promoted)
                    + SUM(shard_apply.writeThenVerifyRefused)
                    + SUM(shard_apply.promoteGateRefused)
                    + SUM(shard_apply.computeOutcomeChanged)
                    + SUM(shard_apply.skippedIdempotent)
```

Each term **independently counted in batch JSON** — never as a residual.

### Fixing the empty `computePassNotPersisted` mistake

Runbook `:120–126` defines `computePassNotPersisted` as the residual between dry `verifyPass` and apply `promoted`. That is **diagnostically valid as a reconciliation check** but **must not be the only emitted bucket** (`_inbox/2026-08-08_T1_dry_apply_reconciliation.md:57` tooling gap).

**Required explicit counters on every apply leg:**

| Counter | Meaning |
|---|---|
| `promoted` | Write survived read-back |
| `writeThenVerifyRefused` | `EnvelopeWriteThenVerifyMismatchError` |
| `promoteGateRefused` | `EnvelopeGroundTruthPromoteDeclineError` |
| `computeOutcomeChanged` | verifyPass on dry, verifyFail on apply (same SHA) |
| `skippedIdempotent` | No-op by idempotency guard |
| `honestDeclines` | Named decline writes |

**Identity to enforce:**

```
dry.verifyPass == promoted + writeThenVerifyRefused + promoteGateRefused
                 + computeOutcomeChanged + skippedIdempotent
```

If `computePassNotPersisted` is reported, it must equal the sum of the refusal buckets and **each bucket must be non-zero only with parcel-level evidence** on dispute.

### Concurrent duplicate detection

**I-SINGLE-WRITER-1:** For any `(database_target, county_fips, range_min, range_max)`, at most one `active` lease. Enforced by acquire function, not planner memory.

---

## 6. Recommendation — concrete design and migration

### Invariants (each with enforcing check)

| ID | Invariant | Enforcer |
|---|---|---|
| I-LEASE-1 | Writes only within leased `[range_min, range_max]` | Engine pre-batch guard; abort `fabric.lease.boundary_breach` |
| I-LEASE-2 | No overlapping active leases | `fabric_acquire_lease` serializable overlap query |
| I-SHARDS-UNION-1 | `SUM(shard.scanned) == solo.scanned` before sharded apply | CI/script gate on `_inbox/*_sharding_diff_proof.json` pattern |
| I-SHARDS-UNION-2 | `union(shard.cascadeIds) == solo.cascadeIds` set equality | Same diff proof (McLennan template) |
| I-STORE-TRUTH-1 | Cohort size from live store at execution | Pre-run SELECT roster; Geometry Law 8 |
| I-SHA-PIN-1 | Dry/apply same `engine_sha` | Batch JSON field; VOID on mismatch (runbook `:270`) |
| I-PARITY-EXPLICIT-1 | Dry/apply parity uses named buckets, not residual-only | Batch JSON schema test |

### Migration path (three phases)

**Phase 0 — Instrument (no behavior change):**

- Create `fabric_run` + `fabric_keyspace_lease` on cortex Neon.
- Runners **POST** lease rows in `queued` → `active` manually; planner still verbally holds slot.
- CC panel reads tables.

**Phase 1 — Dual enforcement:**

- CATCHUP rule 1 amended: “one heavy scan **or an active atoms lease**”; overlapping leases forbidden.
- Engine warns if apply runs without `--lease-id`.
- Kill-check script queries `fabric_keyspace_lease WHERE status='active' AND database_target='atoms'`.

**Phase 2 — Fail-closed:**

- Apply mode **requires** valid lease (exit non-zero otherwise).
- Extend `--parcel-min/max` to depth-warm and zoning bake scripts (same SQL helper extracted from `bake-property-atom-county.mjs:259–263`).
- Retire planner slot convention; queue becomes `fabric_keyspace_lease.status='queued'`.

**Phase 3 — L2 fan-out:**

- County ingest worker pool on txgio with county leases.
- Nightly L0 seam reconciliation job per county after ingest (`DISTINCT ON` from fabric analysis).

### What stays serial

- **Two apply writers on overlapping keyspace** — forever forbidden.
- **Same-county city warm without disjoint parcel sets** — Bastrop + Elgin cannot parallel until ranges partition (Elgin ⊂ 48021:* but disjoint from Bastrop city bbox set — verify with roster hash, do not assume).

---

## 7. Throughput math

### Inputs (sourced)

| Input | Value | Source |
|---|---|---|
| Bulk compute | **141.975 ms/parcel** | `_inbox/2026-08-08_PROBE_from_scratch_feasibility.json:13` |
| Write path | **Excluded** | same file `:1198`, probe blockers |
| Loaded nineteen distinct parcels | **4,617,181** | `_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md:14` |
| Roster statewide parcels | **13,360,496** | `_catalog/texas_roster_v1.json` / `_inbox/2026-08-08_COUNTY_SHAPE_decision_sheet.md:14` |
| Remaining counties | **235** | `_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md:26` |
| User metro-density extrapolation | **~60M rows** | 4.6M/19×254 — **row-scale, not distinct parcels**; fabric warns 1.2× row inflation (`_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md:106–110`) |

### A. L2 parcel geometry ingest (235 counties)

**Cannot defend a single number.** No StratMap→`txgio_parcel` wall-time per county in artifacts. DFW nine counties were already loaded before 2026-08-05 verify (`_inbox/2026-08-05_dfw_tile_refresh_live_verify.md:80`); no ingest duration recorded.

**Illustrative only (explicit assumption):**

```
Assume median county load = 45 min (UNMEASURED placeholder)
Parallelism P = 8 county-disjoint workers on txgio
Wall ≈ ceil(235 / 8) × 45 min = 30 × 45 min = 22.5 h
Add 30% for variance → ~29 h
```

Harris (~1.5M parcels, east shard only in StratMap) requires **ingest sharding**, not one county lease (`_inbox/2026-08-05_T6_ingest_wave_plan.md:67–69`).

### B. Warm / envelope compute (remaining fabric, compute-only)

Remaining distinct parcels:

```
13,360,496 − 4,617,181 = 8,743,315
8,743,315 × 0.141975 s = 1,240,467 s = 344.6 h serial
```

| Parallel workers | Compute-only wall |
|---:|---:|
| 1 | 344.6 h (14.4 days) |
| 8 | 43.1 h (1.8 days) |
| 11 | 31.3 h (1.3 days) |
| 16 | 21.5 h |

**Not included:** write-then-verify, zoning bake, cascade, certs, L3–L5 rails.

### C. If using ~60M row-scale (user caveat)

```
60,000,000 × 0.141975 s = 8,518,500 s = 2,366 h serial (98.6 days)
÷ 8 workers ≈ 296 h (12.3 days) compute-only
```

Prefer **13.36M distinct** for planning; 60M is storage-row upper bound if rural counties match metro tile duplication (unlikely — fabric `:205` shows inverse density correlation).

### D. Full program realism

Layer-first L2 alone does not warm envelopes. A **235-county “loaded” milestone** is achievable in **~1–2 days** with 8-way county ingest **if** median load ≤45 min (unverified). A **235-county “warmed and cert-ready” milestone** is **weeks to months** at measured compute rates, before write path and L5 jurisdiction work.

---

## WHAT BREAKS THIS

1. **Same-FIPS city overlap** — County lease alone does not stop Bastrop+Elgin concurrent warm; city jobs need roster-hash leases or min/max bounds verified disjoint.
2. **Lexicographic shard gaps** — Naive numeric suffix bounds (Bell) skip parcels; production must use NTILE on live IDs (runbook `:424–425`).
3. **Harris / mega-county ingest** — County unit fails; ingest and atoms both need sub-county sharding with union proof.
4. **Lease TTL vs long runs** — McLennan solo cascade dry-run **54 min** (`mclennan_sharding_diff_proof.json:10` `wallMs:3244619`); Bexar/Harris multi-hour. TTL must exceed worst shard or heartbeat must renew.
5. **IPFS pin serialism** — 32-wide Postgres upserts still pin sequentially; atoms write throughput may not scale linearly with worker count.
6. **Cross-database workflows** — L2 on txgio then warm on atoms requires **two lease targets**; a county “loaded” on txgio without atoms awareness can still race if old warm job runs.
7. **Partial apply recovery** — Bastrop proved partial mutation + extended parity confusion; expired lease + auto-retry without store-truth roster re-query repeats damage.
8. **`atom_did` upsert races** — Last writer wins on `ON CONFLICT (atom_did)` (`pg-storage.ts:348`); overlapping ranges produce torn envelope/edge atoms, not necessarily SQL errors.
9. **Road twin L3** — Border roads may be shared across counties; county-only isolation untested for `road-node` writes.
10. **Donley / no-StratMap gap** — 235 ≠ uniform; one county blocks “254/254 L2 complete.”

---

## WHAT I COULD NOT DETERMINE

1. **Per-county StratMap→`txgio_parcel` ingest duration** — no timed run in doc_repo artifacts; L2 wall-clock math uses an explicit placeholder.
2. **Bulk apply write-then-verify ms/parcel** — probes are dry-run / compute-only (`PROBE_from_scratch_feasibility.json:1198`).
3. **Neon CPU saturation point** — connection headroom is 901; WAL/CPU cliff requires the ramp experiment in §4.
4. **Safe parallelism for `writePropertyAtomsBatch` IPFS** — pin service throughput unknown.
5. **Cross-county road geometry overlap** for L3 statewide pass.
6. **Whether `btree_gist` text-range exclusion** is available on cortex Neon for a native PostgreSQL overlap constraint (design uses acquire-function overlap query instead).
7. **Exact remaining parcel count** — roster `13,360,496` vs store `4,617,181` de-duplicated uses different counting methods; 8.74M remainder is approximate.
8. **Tile bake / PMTiles regeneration wall-clock** for statewide fabric after L2 — DFW bake 79 min for 19 counties (`_inbox/2026-08-05_dfw_tile_refresh_live_verify.md:37`) does not scale linearly (not computed here).

---

## Primary citations index

| Claim | Citation |
|---|---|
| Heavy-scan slot rule | `90_operations/CATCHUP_program_2026-08-05.md:32` |
| Two-writer abort | `_inbox/2026-08-07_T1_bastrop_cohort_apply_ABORT.md:34–36` |
| Sharding flags + SQL | `P:\hauska-engine\packages\engine-core\scripts\bake-property-atom-county.mjs:248–263, 714–791` |
| McLennan union proof | `_inbox/2026-08-05_mclennan_sharding_diff_proof.json:55–69` |
| Tile seam safety | `_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md:446–471` |
| 141.975 ms/parcel | `_inbox/2026-08-08_PROBE_from_scratch_feasibility.json:13` |
| Pool max 4/2 | `depth-warm-bastrop-batch.mjs:288–297` |
| max_connections 901 | Live SQL atoms + txgio Neon 2026-08-08 |
| Extended parity buckets | `90_runbooks/factory_onboarding_runbook.md:120–126`, `_inbox/2026-08-08_T1_dry_apply_reconciliation.md:57` |
| CC slot registry gap | `_scratch/command_center_manifest_mockup.html:1157–1160` |
