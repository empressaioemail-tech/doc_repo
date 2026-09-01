---
id: factory_1_statewide_fabric
title: Factory 1 — statewide fabric runbook (jurisdiction-free layers)
date: 2026-08-11
last_updated: 2026-08-12
status: active
owner: planner
applies_to: docs
related:
  [
    _inbox/2026-08-11_FACTORY_operating_procedure_of_record,
    90_runbooks/factory_1_5_acquisition_staging,
    90_runbooks/factory_2_jurisdiction_depth,
    90_runbooks/factory_onboarding_runbook,
    90_operations/OPS-13_store_topology,
    90_operations/OPS-1_texas_source_registry,
    90_operations/OPS-WDLL_the_factory,
    _decisions/2026-08-02_operate_the_factory_never_rebuild_it,
  ]
---

# Factory 1 — statewide fabric runbook

Standing ruling: **OPERATE THE FACTORY, DO NOT REBUILD IT.** This runbook is the canonical executor path for Factory 1. The operating procedure of record at [`_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`](../_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md) is the source of truth for operate-not-rebuild discipline, the frozen `run_sweep.mjs` driver, the BOM trap, the resume hole, and store topology facts. Promote from that document; do not paraphrase away its load-bearing details.

Machine-checkable companion: `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.json`.

## What Factory 1 is

**Factory 1 — statewide fabric.** Acquires jurisdiction-free layers: parcel geometry, boundaries, roads, flood, soils, topo, CAD rolls, owner, wells, rail corridors, footprints, special districts, terrain, RRC. One source, one pass, blankets a state. Per-state cost is roughly constant regardless of county count — Texas has 254 counties and Rhode Island has 5, and the work is nearly the same shape.

Input is a store-truth county enumeration plus a source layer already staged in the deployment store. Output is property atoms in the atoms store, plus manifest cells the Command Center ledger reads.

Slot required: the atoms bulk-writer slot, one per database. Never run two atoms-bulk-writers concurrently. Record the handoff in `_STATE.md` before starting.

Factory 1 does **not** touch jurisdiction depth: no zoning districts, no setback tables, no code text, no buildable envelopes. Those are Factory 2.

## The three-factory chain: 1 → 1.5 → 2

The seam between statewide fabric and jurisdiction backfill is no longer a direct Factory 1 → Factory 2 jump. The chain is:

```
Factory 1.5 (acquisition / staging)
        ↓  persists geometry + source payloads into txgio_parcel, cad_property, etc.
Factory 1   (statewide fabric — THIS RUNBOOK)
        ↓  writes parcel-node atoms + jurisdiction-free property atoms
Factory 2   (jurisdiction depth — zoning, setbacks, cert, warden)
```

**Factory 1.5** finds, fetches, parses, normalises, and persists payloads with vintage provenance. Network-bound, infinitely parallel, slot-free. Code lives in `legacy-design-tools/lib/cad-ingest`. Runbook: [`90_runbooks/factory_1_5_acquisition_staging.md`](factory_1_5_acquisition_staging.md).

**Factory 1** (this runbook) assumes geometry is **already staged** by Factory 1.5 in `txgio_parcel`. It drains staged counties from store truth and writes atoms. It does not acquire shapefiles or parse CAD exports.

**Factory 2** consumes parcel-node atoms and backfills what varies per jurisdiction. Runbook: [`90_runbooks/factory_2_jurisdiction_depth.md`](factory_2_jurisdiction_depth.md) (supersedes [`factory_onboarding_runbook.md`](factory_onboarding_runbook.md) for depth work).

### Portability note

`packages/engine-core/src` is **NOT Texas-clean**. A FIPS-literal grep (`48`/`TX`/`texas` outside comments) is the wrong cleanliness test: it misses production source-URL constants that couple the package as hard as a FIPS literal. Verified 2026-08-12 (C2): `GLOBAL_ML_TEXAS_ZIP_URL`, `ML_TEXAS_ZIP_ENTRY_NAME`, `GEOFABRIK_TEXAS_PBF_URL`, and `TEXAS_RRC_WELLS_LAYER` are live defaults; parcel SQL still names `txgio_parcel`; Bastrop/Central-TX pilot URLs and bboxes remain in road-intake and cert-grade paths. Atom *write mechanics* are largely state-agnostic once inputs exist, but the package as a whole does not port as-is.

Texas coupling is denser still in acquisition (Factory 1.5). Measured 2026-08-12 (C2) under an executable-body rule (comments stripped; production `*.ts` under `lib/cad-ingest/src`, tests/fixtures excluded): **30 of 48** files carry Texas hosts, FIPS, asserts, or StratMap/TxGIO identifiers. Inclusive token scan (comments counted) yields **36/48** (U1). The older **26/47** figure is retired — it undercounted and did not state a method. Hard blockers include `assertTexasWgs84Bbox` in `txgio/parse.ts` and `WHERE STATE='48'` in `boundary/service.ts`. A new state starts at Factory 1.5 *and* must parameterize the engine-core source-URL defaults above.

## Prerequisites — read before touching anything

1. [`90_operations/OPS-13_store_topology.md`](../90_operations/OPS-13_store_topology.md) — which store holds which truth. **This doc overrides the onboarding runbook on store facts.**
2. [`_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`](../_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md) — full operating procedure of record.
3. `_STATE.md` — confirm the atoms bulk-writer slot is free before any apply. **Record the slot handoff** in `_STATE.md` OPEN/LIVE INFRA before starting a sweep or multi-county apply; release it in the close artifact when the lane finishes.
4. Checkout `origin/main` on `P:/hauska-engine` and record the 40-char SHA in the run artifact before anything else. The sweep driver hardcodes `ENGINE = "P:/hauska-engine"` and inherits whatever that tree is checked out to.

### Store topology summary (from OPS-13)

There is ONE Neon endpoint and TWO databases on it. A cross-database join between `atoms` and `txgio_parcel` is impossible; writers page one store and look up in the other.

| Env var | Database | Holds |
|---|---|---|
| `DATABASE_URL` | `hauska_mcp` | `atoms` |
| `CORTEX_DATABASE_URL` | `neondb` | parcels, CAD, manifest, flood, ledger |
| `DEPLOYMENT_DATABASE_URL` | `neondb` | same store as CORTEX (byte-identical) |
| `TXGIO_DATABASE_URL` | `neondb` | same store again, engine-side name |

`CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are byte-identical. Only the `DATABASE_URL` versus everything-else split is real.

## Step 0 — confirm Factory 1.5 output exists

Before any Factory 1 write, verify the target county has rows in `txgio_parcel`:

```sql
SELECT county_fips, count(*), count(DISTINCT feature_index)
FROM txgio_parcel
WHERE county_fips = '<fips>'
GROUP BY 1;
```

If the county is absent, stop. Run Factory 1.5 acquisition first. Factory 1 cannot invent geometry.

List all staged counties from store truth (same query the writer uses):

```
PARCEL_NODE_PATH=1 \
TXGIO_DATABASE_URL=<deployment Neon> \
DATABASE_URL=<atoms Neon, database hauska_mcp> \
  pnpm --filter @hauska-engine/engine-core run write-parcel-node-county -- \
    --list-counties
```

There is deliberately NO hardcoded county allowlist. If a county has rows, the CLI can write its atoms.

## Step 1 — parcel-node seam (Rail 1)

The `parcel-node` atom is the seam between statewide fabric and jurisdiction depth. Factory 1.5 loads parcel geometry into `txgio_parcel`; this step writes `parcel-node` atoms so Factory 2's warm preflight gate and the County Manifest can see them.

**Writer:** `P:/hauska-engine/packages/engine-core/scripts/write-parcel-node-county.mjs`

**Two separate databases** (mixing them up produces `relation "txgio_parcel" does not exist` in prod):

- `TXGIO_DATABASE_URL` — deployment Neon carrying `txgio_parcel`. READ ONLY in this CLI.
- `DATABASE_URL` — atoms Neon (`hauska_mcp`). The only store this CLI writes, and only under `--apply`.

**Single county, dry first, always:**

```
PARCEL_NODE_PATH=1 \
TXGIO_DATABASE_URL=<deployment Neon> \
DATABASE_URL=<atoms Neon, database hauska_mcp> \
  pnpm --filter @hauska-engine/engine-core run write-parcel-node-county -- \
    --county=48261 --out=P:/tmp/backfill_<date>/48261_dry.json --batch=5000
```

Then the same line with `--apply` appended and `--out=..._apply.json`. Dry-run is the default; `--apply` writes. Flags: `--county`, `--apply`, `--batch`, `--limit`, `--out`, `--list-counties`.

Dry-run PREDICTS the apply. Compare numbers; they must match exactly.

Success per county: `atomsWritten === atomsBuilt === verified`, `verifyFailures` empty, orphan verdict ok. Verify reads stored bytes by primary key (`WHERE atom_did IN ...`), never by jsonb expression. Measured 2026-08-11: ~575x faster than jsonb seq-scan on 16.2M rows.

**Do not lower `--batch` back to 500.** Verify cost is roughly constant per batch because the read scans the table regardless of batch size — measured 9,128 ms for 500 ids versus 9,296 ms for 5,000. A bigger batch amortizes fixed cost across ten times more atoms.

### Multi-county sweep — the frozen proven artifact

For statewide parcel-node backfill, use the sweep driver of record:

`P:/hauska-engine/packages/engine-core/scripts/sweep/run_sweep.mjs` — versioned in engine-core (#307); 132 counties of accumulated defense against specific failures.

What it carries that a fresh driver would not: dedup tripwire (halts when `atomsBuilt` approaches `features * 1.05`); ECONNRESET detection with up to two idempotent re-runs; halt-and-exit on dry-run failure (exit 2), dedup tripwire (3), dry/apply mismatch (4), verify failures (5), orphan verdict (6), retries exhausted (7), apply failure (8); transient retry for pnpm filter/spawn misses; manifest checkpoint every ten counties; per-county `landed_<fips>.json` receipts plus `progress.json`.

**Invocation, verbatim:**

```
cd P:/hauska-engine && git fetch && git checkout main && git pull && git rev-parse HEAD
node packages/engine-core/scripts/sweep/run_sweep.mjs \
  --out-dir=P:/tmp/parcel_node_sweep_<date> \
  --engine-path=P:/hauska-engine
```

The runner loads `.env` from `--out-dir`. Required keys: `DATABASE_URL` (atoms, `hauska_mcp`), `TXGIO_DATABASE_URL` (deployment Neon, `neondb`), `PARCEL_NODE_PATH=1`. Copy `.env` from a prior sweep close artifact or assemble from Secret Manager per OPS-13; never commit secrets. Record the 40-char engine SHA in the close artifact.

The runner sets `PARCEL_NODE_PATH=1` itself. It resumes automatically: `progress.json` under `--out-dir` is read on start and every county in `landed[]` is skipped.

**Texas sweep queue (CP2 — what the runbook must name):** the 2026-08-09 sweep drained a **132-county queue file** co-located with the driver (`P:/tmp/parcel_node_sweep_20260809/`), not every county in `txgio_parcel`. Store truth afterward held **196** counties with geometry; the sweep landed **132** new counties in that queue. The other 64 counties either already had parcel-node atoms from earlier wave work or were never in the queue file. For a new state or a full re-drain: build the queue from a two-store diff (counties in `txgio_parcel` minus counties with `parcel-node` atoms — see Factory 1.5 handoff SQL), write one FIPS per line, and point the copied driver at that file (third string change in `runCli`).

**Artifact directory:** Before a production sweep, create a dated directory under `P:/tmp/` for `--out-dir` (`.env`, `sizing.json`, `progress.json`, per-county receipts). The driver is versioned at `packages/engine-core/scripts/sweep/run_sweep.mjs`; pin the engine SHA in the close artifact. Do not rewrite the driver from memory.

**Progress file format.** `progress.json` at the same directory:

`{startedAt, landed[], failed[], econnresets[], attempted[], halted, checkpoints[], transients[], manifestBaseline, manifestFinal, updatedAt, completedAt}`

Each `landed[]` row carries countyFips, features, rows, atomsBuilt, atomsWritten, verified, resolved, absent, absentByKind, orphansRetired, dryWallMs, applyWallMs, applyAttempts, landedAt.

**The BOM trap (fixed in #307).** Versioned `run_sweep.mjs` strips UTF-8 BOM on `progress.json` read via `stripBom()` in `run-sweep-lib.mjs`. If you hand-edit progress outside the runner, write from node without BOM, never `Set-Content`.

**The resume hole (fixed in #307).** Skip set is **`landed` only**; `halted` is a resume pointer (county moves to queue front when not landed), not an exclusion. Adversarial test: `packages/engine-core/scripts/sweep/__tests__/run-sweep-resume.test.ts`. Before any resume on a pre-#307 progress file: back up `progress.json`, assert every county in `attempted[]` appears in `landed[]`, or clear `halted` manually.

For a new rail sweep (Q3 harvest, Q5 CAMA routing, etc.), invoke `run_sweep.mjs` with a new `--out-dir`, a new `sizing.json` queue, and `--cli-script=<writer-name>`. Keep `--batch=5000`, keep every halt tripwire, keep the progress format.

**Texas sweep close (2026-08-11):** 132 counties landed, halted null, 11,603,489 parcel-node atoms, 18,556,547 atoms total. The seam is built.

## Step 2 — jurisdiction-free payload rails

After parcel-node atoms exist, apply the remaining statewide rails. Each rail is a county-scoped writer under `P:/hauska-engine/packages/engine-core/scripts/`. All follow the same shape: enumerate counties from store truth, dry-run per county, verify counts explainably, apply per county, checkpoint the manifest.

The vehicle for Q3 (Class A harvest fields) and Q5 (CAMA routing) is the existing CAD roll writer:

```
CAD_PARCEL_ROLL_PATH=1 \
CORTEX_DATABASE_URL=<deployment Neon> \
DATABASE_URL=<atoms Neon, database hauska_mcp> \
  pnpm --filter @hauska-engine/engine-core run write-cad-parcel-roll-county -- \
    --county=48021 --out=P:/tmp/backfill_20260811/48021_dry.json --batch=5000
```

Then the same line with `--apply` appended and `--out=..._apply.json`. Flags: `--county`, `--apply`, `--batch`, `--limit`, `--out`, `--tax-year`, `--list-counties`.

Q3 and Q4 are ONE lane — the Class A cluster is the same identity job address-to-parcel resolution needs. Dispatching them separately puts two lanes on the same tables for the same reason.

### Sequencing note

The five queued rail applies (owner, well, rail-corridor, footprint, special-district) share the atoms bulk-writer slot. Sequence by coverage gained, not by build order, and run ONE county of each rail first.

**Known gaps before apply:**

- `write-special-district-fact-county.mjs` does not verify stored bytes at all — fix before its apply (see operating procedure adversarial section).
- Four rails (owner-fact, well-fact, rail-corridor-fact, building-footprint) have never completed a real round-trip. One county, read the artifact, then proceed.

## What Factory 1 is NOT (scope guard)

The upcoming map backfill work — Q3 harvest take-list, Q4 address-to-parcel, Q5 CAMA structural data — is jurisdiction-free payload completeness over sources the factory already visits statewide. None of it needs a zoning district, a ratified setback table, an operator ratification gate, or a cert roster. Those four things are the entire reason Factory 2 exists.

Q3 will not deliver structural data and must not claim to. `YEAR_BUILT` appears in 9 of 176 probed counties; `living_area_sqft` sits at 10.5% statewide with major metros at 0.0%. That data lives in CAMA bulk exports (Q5's separate routing motion).

For jurisdiction entry points, see [`90_runbooks/factory_2_jurisdiction_depth.md`](factory_2_jurisdiction_depth.md).

## DO NOT REBUILD

Absent an explicit `DEVIATION: bypassing <frozen artifact path> because <one-line reason>, operator-approved` block in the dispatch, operate the named artifact. A new artifact without approval is a reject at verify and gets redone against the frozen one.

**Do not write a new sweep driver.** Run `run_sweep.mjs` with `--cli-script` and queue changed. A fresh driver reproduces none of the halt tripwires, the idempotent ECONNRESET retry, the dedup guard, the resume skip-set, or the manifest checkpointing. Each omission is a silent one-county hole.

### Wave 4 reprojection sweep (Factory 1.5 handoff — txgio_parcel)

For the 57-county Web Mercator (202505 vintage) cohort (`ingest_safe_today=false` in the county source matrix), use the versioned Wave 4 orchestrator:

`P:/hauska-engine/packages/engine-core/scripts/sweep/wave4_reproject_orchestrator.mjs`

Worker: `wave4_reproject_worker.mjs` (same directory). Close builder: `wave4_reproject_build_close.mjs`.

**Invocation, verbatim:**

```
cd P:/hauska-engine && git fetch && git checkout main && git pull && git rev-parse HEAD
node packages/engine-core/scripts/sweep/wave4_reproject_orchestrator.mjs \
  --out-dir=P:/tmp/wave4_reproject_<date> \
  --ingest-repo-path=P:/legacy-design-tools \
  --matrix-path=P:/doc_repo/_inbox/2026-08-08_SWEEP_county_source_matrix.json
```

Place `TXGIO_DATABASE_URL` in `--out-dir/.env` before launch. The orchestrator sets `DATABASE_URL` from it and `NODE_OPTIONS=--use-system-ca` (required on Windows for TxGIO HTTPS). Concurrency defaults to `BATCH_SIZE=2` (txgio_parcel write cap). Donley 48129 is excluded (404 at source). Texas close 2026-08-11: `_inbox/2026-08-11_P2-2_wave4_reprojection_close.json`.

**Do not author `write-harvest-fields-county.mjs`, `write-cama-county.mjs`, or any new `*-county` writer for Q3 or Q5.** `write-cad-parcel-roll-county.mjs` already does the hard parts. Q3 extends its payload; Q5 changes its source routing. Both are edits inside one existing writer.

**Do not build a geocoder for Q4.** Photon keeps the address-to-coordinate path. Q4 resolves address to `county:prop_id` against parcels we already own. The same normalization function must run at write and at read, with a test pinning that identity.

**Do not author a new cert harness.** The graders take `--roster-from=file`. Widen the roster, never fork the grader. `bastrop-district-cert-grade.mjs` is a retired stub that exits 2 precisely to stop this.

**Do not author a new per-city warm runner.** Use `depth-warm-city-batch.mjs --row-id=<RegistryRowId>` (engine #287). Legacy `depth-warm-*-batch.mjs` stubs exit 2. Escalate OPS-9 S4 only with a flagged DEVIATION block.

**Do not create a parallel progress or ledger format.** The resume logic reads the existing shape.

**Do not re-measure cost per jurisdiction.** Settled well under $200 by operator ruling for Factory 2; Factory 1 cost is per-state and roughly constant.

**Do not retry the index hypothesis on the verify read.** The fix was verify-by-primary-key plus batch size, and it is merged.

### The precedent

Phase C's task was to START the existing factory and TEST it with Bastrop. Instead the fleet re-built the cohort selector and wrote a new cert harness beside the proven one, then debugged its own machinery through three STOP cycles. Operator, verbatim: *"we were supposed to be getting the factory started and tested with bastrop not building a new factory."*

The correction proved the rebuild was the cause. Under the generalised `block13-cert-grade` — one artifact widened by a `--roster-from` parameter — Block-13 still graded 7/7 and the prior "28 SF-1 fails" collapsed to 3 genuine findings. Roughly 23 of the 28 were cohort and harness artifacts.

Rebuild is right when no frozen artifact survives. It is wrong when one does.

## Adversarial checklist (before the next run)

From the operating procedure of record. Fix or verify each item; do not assume this runbook's status claims are current without a branch, PR, or close artifact.

1. **Tree pointer.** `P:/hauska-engine` must be on `origin/main` with SHA recorded. A branch behind main wrote at 47 atoms/sec for an unknown period during the Texas sweep.
2. **Verify-by-primary-key fix IS merged** on `origin/main` (PR #304). Eight of nine county writers carry it; `write-special-district-fact-county.mjs` does not.
3. **Bulk-writer slot.** One writer per database. Record handoff in `_STATE.md`.
4. **Index audit (Q7).** Eleven indexes on 18.5M rows / 29 GB. Run before multi-rail applies.
5. **Store topology.** Never assume CORTEX and DEPLOYMENT differ. See OPS-13.
6. **Harvest inventory numbers disagree.** Query `_catalog/source_field_inventory.json`; quote neither conflicting headline count.

## Success criteria

Per county, per rail:

- Dry-run and apply counts match exactly.
- `atomsWritten === atomsBuilt === verified`.
- `verifyFailures` empty.
- `orphanVerdict.ok === true`.
- Exit code 0.
- `landed_<fips>.json` written (sweep) or `--out` artifact saved (single county).
- Manifest checkpoint moved.

Anything else halts by design — read `progress.halted`, do not restart blind.

## GRADABLE ACCEPTANCE (Texas Factory 1)

Each item is pass/fail via the named instrument only. Grade against the deployed store and `origin/main` engine tree unless noted. Narration fails the item.

**F1-1. Versioned sweep driver on main.** **Pass:** `git cat-file -e origin/main:packages/engine-core/scripts/sweep/run_sweep.mjs` exits 0. **Fail:** path absent on main. **Instrument:** git one-liner.

**F1-2. Resume hole closed.** **Pass:** `cd P:/hauska-engine/packages/engine-core && pnpm exec vitest run scripts/sweep/__tests__/run-sweep-resume.test.ts` exits 0 with 6/6 assertions green. **Fail:** any failing assertion or wrong test path. **Instrument:** vitest from engine-core package (no DB required).

**F1-3. BOM strip on progress read.** **Pass:** `rg "stripBom" packages/engine-core/scripts/sweep/run-sweep-lib.mjs` matches and `loadProgress` in `run_sweep.mjs` calls `JSON.parse(stripBom(raw))`. **Fail:** missing strip on progress path. **Instrument:** ripgrep + read.

**F1-4. Staged geometry gate (Step 0).** **Pass:** for target `<fips>`, SQL on deployment Neon `SELECT count(*) FROM txgio_parcel WHERE county_fips='<fips>'` returns `> 0` before any Factory 1 write. **Fail:** zero rows. **Instrument:** one-shot psql.

**F1-5. Single-county dry/apply parity.** **Pass:** for one county dry then apply artifacts, `atomsBuilt === atomsWritten === verified` and `verifyFailures` empty in both JSON summaries. **Fail:** any mismatch or non-empty verifyFailures. **Instrument:** compare `--out` JSON files from `write-parcel-node-county`.

**F1-6. Verify-by-primary-key.** **Pass:** `rg "atom_did IN" packages/engine-core/scripts/write-parcel-node-county.mjs` matches verify path; no `body->>'parcelNodeId' IN` in verify block. **Fail:** jsonb expression verify. **Instrument:** ripgrep.

**F1-7. Batch default 5000.** **Pass:** `rg "--batch=5000" packages/engine-core/scripts/sweep/run_sweep.mjs` matches `runCli` spawn args. **Fail:** default batch below 5000 without documented deviation. **Instrument:** ripgrep.

**F1-8. Engine SHA pinned before sweep.** **Pass:** close artifact or `progress.json` `startedAt` block records 40-char `git rev-parse HEAD` from `P:/hauska-engine` on `origin/main` at sweep start. **Fail:** missing SHA or branch not main. **Instrument:** artifact field or `git rev-parse HEAD` paste in runner log header.

**F1-9. Bulk-writer slot handoff.** **Pass:** `_STATE.md` OPEN section names the active atoms bulk writer (or explicitly records slot free) immediately before multi-county apply. **Fail:** concurrent applies with no handoff line. **Instrument:** grep `_STATE.md` for bulk-writer / slot within 24h of apply timestamp.

**F1-10. Versioned Wave 4 orchestrator exists.** **Pass:** `Test-Path P:/hauska-engine/packages/engine-core/scripts/sweep/wave4_reproject_orchestrator.mjs` (PowerShell) or equivalent file exists at that path after wave4 PR merge. **Fail:** path missing. **Instrument:** file existence check.

**F1-11. `--list-counties` store-truth roster.** **Pass:** `PARCEL_NODE_PATH=1 TXGIO_DATABASE_URL=<neondb> DATABASE_URL=<hauska_mcp> pnpm --filter @hauska-engine/engine-core run write-parcel-node-county -- --list-counties` exits 0 and prints every FIPS with rows in `txgio_parcel`. **Fail:** exit non-zero or hardcoded allowlist in output. **Instrument:** CLI one-shot (read-only).

**F1-12. Orphan verdict on apply.** **Pass:** apply artifact `orphanVerdict.ok === true`. **Fail:** `ok === false` or field absent on apply leg. **Instrument:** apply `--out` JSON parse.

**F1-13. Manifest checkpoint cadence.** **Pass:** `progress.json` `checkpoints[]` length increases by 1 per 10 counties landed during sweep (or final checkpoint present when sweep completes). **Fail:** sweep >10 counties with zero checkpoints. **Instrument:** parse `progress.json` checkpoints array length vs `landed.length`.

`gradable: true` for Texas parcel-node and Wave 4 orchestration paths. Utah or net-new state onboarding remains `gradable: false` until Factory 1.5 portability blockers clear.

## Related runbooks and docs

| Doc | Role |
|---|---|
| [`factory_1_5_acquisition_staging.md`](factory_1_5_acquisition_staging.md) | Upstream: stage geometry and source payloads |
| [`factory_2_jurisdiction_depth.md`](factory_2_jurisdiction_depth.md) | Downstream: zoning, setbacks, cert, warden |
| [`factory_onboarding_runbook.md`](factory_onboarding_runbook.md) | Legacy Factory 2 path (being superseded) |
| [`OPS-13_store_topology.md`](../90_operations/OPS-13_store_topology.md) | Store facts, pooler hazard, table residency |
| [`OPS-1_texas_source_registry.md`](../90_operations/OPS-1_texas_source_registry.md) | Texas source inventory (Factory 1.5) |
| [`_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`](../_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md) | Source of truth for operate-not-rebuild |
