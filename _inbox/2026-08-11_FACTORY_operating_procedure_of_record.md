---
id: 2026-08-11_FACTORY_operating_procedure_of_record
title: Factory operating procedure of record — run the existing machine, do not build a parallel one
date: 2026-08-11
status: operating procedure of record (read-only investigation; no factory run executed)
owner: planner
related:
  [
    90_runbooks/factory_onboarding_runbook,
    90_operations/OPS-WDLL_the_factory,
    90_operations/OPS-13_store_topology,
    _decisions/2026-08-02_operate_the_factory_never_rebuild_it,
    _decisions/2026-08-10_harvest_completeness_ruling,
    _inbox/2026-08-11_PLANNER_HANDOFF_finish_line,
    _inbox/2026-08-11_FACTORY_operating_procedure_of_record.json,
  ]
---

# Factory operating procedure of record

Standing ruling this serves: OPERATE THE FACTORY, DO NOT REBUILD IT. This document exists so the next backfill executor has a copy-paste command and no excuse to write a parallel wrapper. Machine-checkable companion: `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.json`.

## THE TWO FACTORIES

**Factory 1 — statewide fabric.** Acquires jurisdiction-free layers: parcel geometry, boundaries, roads, flood, soils, topo, CAD rolls, owner, wells, rail corridors, footprints, special districts. One source, one pass, blankets a state. Per-state cost is roughly constant regardless of county count — Texas has 254 counties and Rhode Island has 5, and the work is nearly the same shape. Input is a store-truth county enumeration plus a source layer. Output is property atoms in the atoms store, plus manifest cells the Command Center ledger reads. Slot required: the atoms bulk-writer slot, one per database.

**Factory 2 — jurisdiction backfill.** The proven county recipe and cert lane. Backfills what varies per jurisdiction: zoning districts, setback tables, code text, buildable envelopes. Two lanes — unzoned county (C1 through C7) and zoned city (Z1 through Z11) — gated by `onboard-preflight`, certified by area-sweep cert-grade, audited by the Warden. Cost scales with jurisdiction count. This is where the moat is, and the operator ruling is explicit: the jurisdiction factory is SOUND, do not fix it.

**The joint between them was the gap, and it is now closed.** `parcel-node` was the intended seam: the statewide factory writes parcel nodes with provenance, the jurisdiction factory consumes them. Nothing wrote them until 2026-08-09. The sweep completed 2026-08-11 at 13:27:52 UTC — 132 counties landed, halted null, 11,603,489 parcel-node atoms, 18,556,547 atoms total. The seam is built.

## THE FROZEN PROVEN ARTIFACT

`P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs` — 413 lines, still on disk, last modified 2026-08-10 11:22. This is the sweep driver of record. It is not a script someone wrote once; it is 132 counties of accumulated defense against specific failures, and every one of those defenses was paid for.

What it carries that a fresh driver would not: a dedup tripwire that halts when `atomsBuilt` approaches `features * 1.05` or tracks row count rather than feature count; ECONNRESET detection with up to two idempotent re-runs of the same county (8 fired across the sweep, all recovered); halt-and-exit on dry-run failure (exit 2), dedup tripwire (3), dry/apply mismatch (4), verify failures (5), orphan verdict (6), retries exhausted (7), apply failure (8); a transient retry for pnpm filter/spawn misses that does NOT count as a data defect; a manifest checkpoint every ten counties landed; and per-county `landed_<fips>.json` receipts alongside a single `progress.json`.

The `--batch=5000` flag is load-bearing and the code says why in a comment: verify cost is roughly CONSTANT per batch because the read scans the table regardless of how many ids it carries — measured 9,128 ms for 500 ids versus 9,296 ms for 5,000. A bigger batch amortizes that fixed cost across ten times more atoms, 55 to 538 atoms/sec. Do not lower it back to the 500 default.

**Invocation, verbatim:**

```
cd /p/hauska-engine && git fetch && git checkout main && git pull && git rev-parse HEAD
node P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs
```

The runner loads `.env` from its own directory (`DATABASE_URL`, `TXGIO_DATABASE_URL`, `PARCEL_NODE_PATH`), sets `PARCEL_NODE_PATH=1` itself, and hardcodes `ENGINE = "P:/hauska-engine"`. It resumes automatically: `progress.json` is read on start and every county in `landed[]` is skipped.

**Progress file format.** `progress.json` at the same directory: `{startedAt, landed[], failed[], econnresets[], attempted[], halted, checkpoints[], transients[], manifestBaseline, manifestFinal, updatedAt, completedAt}`. Each `landed[]` row carries countyFips, features, rows, atomsBuilt, atomsWritten, verified, resolved, absent, absentByKind, orphansRetired, dryWallMs, applyWallMs, applyAttempts, landedAt.

**The BOM trap.** `loadProgress()` calls `JSON.parse(readFileSync(path, "utf8"))` with no BOM strip. A PowerShell write puts a UTF-8 BOM on the file and the parse throws. Verified clean right now — `head -c 8` gives `7b0a 2020 2273 7461`, no EF BB BF — but if you hand-edit the file, write it from node, never `Set-Content`.

**The resume hole, still present in code.** The skip set is `landed ∪ halted.countyFips`. A county that halted but never landed is therefore silently skipped on resume. 48457 was exactly that case — a dry-run interrupted at the boundary — and resuming as written would have left a one-county hole in a 254-county fabric that no count-based gate would catch. The fix applied on 2026-08-09 was procedural, not code. Before any resume: back up `progress.json`, assert every county in `attempted[]` appears in `landed[]`, and clear the `halted` object so the county re-enters the queue at position 1.

## THE JURISDICTION ENTRY POINTS

Factory 2's mechanical entry points on `origin/main`, all under `P:/hauska-engine/packages/engine-core/scripts/`:

Gate: `scripts/onboard-preflight.mjs --fips=<fips>` (or the reporting wrapper `preflight-and-report.mjs --fips=<fips>`, which is fips-keyed, not row-keyed). Eight checks per registry row, PASS or a named DECLINE with a `defectClass`. A decline is not a blocker — run every rail that passed.

Unzoned county cascade:

```
PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms Neon> \
  pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- \
    --county=<fips> --cascade-absence-only [--dry-run] [--batch=500]
```

Mega-counties shard by keyspace with `--parcel-min` / `--parcel-max` / `--cascade-ids-out`, ranges computed by live SQL `ntile`, never fixed zero-padded numeric bounds. Bexar 48029 is forbidden from a solo full-county apply.

Warm, per city, hand-authored and still the operative pattern (the registry-driven single runner is NOT shipped):

```
tsx scripts/depth-warm-<city>-batch.mjs --city-cohort --force-overwrite --promote --limit=10000 [--dry-run]
```

Cert:

```
pnpm run cert-grade-and-report -- --grade-mode=unzoned --roster-from=file \
  --roster-file=<roster.txt> "--preflight-row-id=<rowId>"
```

`--preflight-row-id` drives URL threading; `--row-id` is attribution only. Passing only `--row-id` yields `cadastral-query-url-not-configured` on every parcel for any non-48021 county.

Warden: `pnpm run warden-sweep -- --fips=<fips> --cert-artifact=<cert>.json`. It files, it never fixes, and an import-guard test exists specifically to keep it from acquiring write capability by accident.

## WHICH FACTORY FOR THE MAP BACKFILL: FACTORY 1

The upcoming work — Q3 harvest take-list, Q4 address-to-parcel, Q5 CAMA structural data — is jurisdiction-free payload completeness over sources the factory already visits statewide. None of it needs a zoning district, a ratified setback table, an operator ratification gate, or a cert roster, and those four things are the entire reason Factory 2 exists.

Q3's Class A cluster (`GEO_ID` 158 counties, `BLOCK` 151, `MAP_ID` 147, `ABS_SUBDV_CD` 143, `TRACT_OR_LOT` 142) is parcel identity and plat lineage read out of `cad_property` and `txgio_parcel`. Q5 is a routing-precedence change so `bulk_primary: true` (set on exactly Dallas 48113 and Tarrant 48439, both currently at 0.0% sqft) actually routes to a CAMA export instead of silently falling back to StratMap. Q4 is a read-only normalization-and-index motion over `txgio_parcel.situs_address`, populated on 15,370,111 of 15,479,206 rows across 196 counties.

All three have the shape the parcel-node sweep just proved: enumerate counties from store truth, dry-run per county, verify counts explainably, apply per county, checkpoint the manifest. **Q3 and Q4 are ONE lane** — the Class A cluster is the same identity job address-to-parcel resolution needs, and dispatching them separately puts two lanes on the same tables for the same reason.

### The copy-paste invocation

The vehicle for Q3 and Q5 is the existing CAD roll writer. It already reads `cad_property` with store-truth county enumeration, carries no hardcoded county allowlist, emits `join-hold` absences for CROSSWALK_HOLD counties rather than promoting untrusted joins, and verifies by the `atom_did` primary key.

Single county, dry first, always:

```
CAD_PARCEL_ROLL_PATH=1 \
CORTEX_DATABASE_URL=<deployment Neon> \
DATABASE_URL=<atoms Neon, database hauska_mcp> \
  pnpm --filter @hauska-engine/engine-core run write-cad-parcel-roll-county -- \
    --county=48021 --out=P:/tmp/backfill_20260811/48021_dry.json --batch=5000
```

Then the same line with `--apply` appended and `--out=..._apply.json`. Dry-run is the default; `--apply` writes. Flags available: `--county`, `--apply`, `--batch`, `--limit`, `--out`, `--tax-year`, `--list-counties`.

For the multi-county sweep, **copy `run_sweep.mjs` to a new output directory and change three strings — the output dir, the queue file, and the CLI script name in the `runCli` args array.** Its input, not its code. Keep `--batch=5000`, keep every halt tripwire, keep the progress format.

Success looks like: `atomsWritten === atomsBuilt === verified` per county, `verifyFailures` empty, `orphanVerdict.ok === true`, exit code 0, a `landed_<fips>.json` written, and the manifest checkpoint moving. Anything else halts by design — read `progress.halted`, do not restart blind.

### Sequencing note

The five queued rail applies (owner, well, rail-corridor, footprint, special-district) were blocked on the atoms bulk-writer slot that the sweep just released. Owner is operator-ruled pre-launch-gate scope across 15 CAD counties. Wells returned zero present atoms on both Dallas and Bexar dry-runs — honest, but it means that rail lights up almost nothing today. Sequence by coverage gained, not by build order, and run ONE county of each rail first.

## DO NOT REBUILD — the specific wrappers an agent will be tempted to create

**Do not write a new sweep driver.** Run `run_sweep.mjs` with three strings changed. A fresh driver reproduces none of the halt tripwires, the idempotent ECONNRESET retry, the dedup guard, the resume skip-set or the manifest checkpointing, and each omission is a silent one-county hole.

**Do not author `write-harvest-fields-county.mjs`, `write-cama-county.mjs`, or any new `*-county` writer for Q3 or Q5.** `write-cad-parcel-roll-county.mjs` already does the hard parts. Q3 extends its payload; Q5 changes its source routing. Both are edits inside one existing writer.

**Do not build a geocoder for Q4.** Photon keeps the address-to-coordinate path. Q4 resolves address to `county:prop_id` against parcels we already own. The same normalization function must run at write and at read, with a test pinning that identity — the 2026-07-29 situs failure was exactly a stored form and a query form disagreeing about a comma, and it cost a 3,156-parcel restamp plus a 3,605-parcel re-promote.

**Do not author a new cert harness.** The graders take `--roster-from=file`. Widen the roster, never fork the grader. `bastrop-district-cert-grade.mjs` is a retired stub that exits 2 precisely to stop this.

**Do not author a new per-city warm runner.** Copy the nearest `depth-warm-<city>-batch.mjs` and change its inputs, or escalate the OPS-9 S4 consolidation as a flagged deviation.

**Do not create a parallel progress or ledger format.** The resume logic reads the existing shape.

**Do not re-measure cost per jurisdiction.** Settled well under $200 by operator ruling.

**Do not retry the index hypothesis on the verify read.** `atoms_property_parcel_node_idx` excludes `parcel-node` and uses `text_pattern_ops`, which does not serve `= ANY`. Every measured alternative lost: `enable_seqscan=off` 39/sec, `unnest()` JOIN 57/sec, 100 serial single lookups 20/sec against a roughly 49 ms Neon round-trip floor. The fix was verify-by-primary-key plus the batch size, and it is merged.

**If a frozen artifact genuinely cannot be extended,** the dispatch must carry an explicit block reading `DEVIATION: bypassing <frozen artifact path> because <one-line reason>, operator-approved` before any new file is written. Absent that block the executor operates the named artifact. A new artifact without approval is a reject at verify and gets redone against the frozen one.

### The precedent, so the trap has a name

Phase C's task was to START the existing factory and TEST it with Bastrop. The engines were already proven on Block-13 at 7/7, frozen and quarantined. Instead the fleet re-built the cohort selector and wrote a new cert harness beside the proven one, then debugged its own machinery through three STOP cycles. Operator, verbatim: *"we were supposed to be getting the factory started and tested with bastrop not building a new factory."*

The correction proved the rebuild was the cause. Under the generalized `block13-cert-grade` — one artifact widened by a `--roster-from` parameter, not two that must agree — Block-13 still graded 7/7 and the prior "28 SF-1 fails" collapsed to 3 genuine findings. Roughly 23 of the 28 were cohort and harness artifacts of the divergent wrapper mis-feeding the machine. Every "finding" had been a wrapper-versus-proven divergence, not a data discovery.

The root cause was not an agent going off-track. Memory, instructions and a frozen template were all present and it still happened, because none of them was a mechanism that fails closed on divergence. "Operate the template" was prose, and prose gets interpreted-away under progress pressure. `64_recursive_loop/04_instantiations.md` had documented the identical gap a month earlier and it was never built.

The legitimate counter-case, so this does not over-apply: the eCode360 scraper adapter WAS correctly rebuilt from surviving proof artifacts, because the original code was never pushed and was genuinely lost. Rebuild is right when no frozen artifact survives. It is wrong when one does.

## ADVERSARIAL — what must be fixed or checked before the next run

**The runner is safe; its tree pointer is not.** `P:/hauska-engine` currently sits on branch `sweep/fast-write`, ahead 1 and BEHIND 4 of `origin/main`, with untracked scratch files. `run_sweep.mjs` hardcodes `ENGINE = "P:/hauska-engine"` and inherits whatever that tree is checked out to. This exact trap already cost the program once: the sweep tree sat on `fix/buildable-zero-inset-envelope`, which predated the W1 write-path merge, and wrote at the old 47 atoms/sec for an unknown period before anyone noticed. Checkout main and record the 40-char SHA in the run artifact before anything else.

**The verify-by-primary-key fix IS merged — the artifact does not predate it.** `write-parcel-node-county.mjs` reads `WHERE atom_did IN ${handle.sql(dids)}`, carrying this comment:

> LOOK ROWS UP BY THE PRIMARY KEY, never by a jsonb expression. `body->>'parcelNodeId' IN (...)` is an expression predicate that no index serves for a large array, so Postgres seq-scans the WHOLE atoms table once per batch. Measured 2026-08-11 on the live table at 16.2M rows: 229,382 ms per 5,000-id batch (22 atoms/sec) versus 373 ms by atom_did (~13,405 atoms/sec) — **~575x** over the jsonb seq-scan path.

Note the real factor is **575x, not the 56x** the task framing assumed. Local commit `81344ec` (2026-08-11 07:23:29 -0500), on `origin/main` as `34c94ff` (PR #304). Eight of the nine county writers carry it.

**One writer does not verify stored bytes at all — fix before its apply.** `write-special-district-fact-county.mjs` is the only one of the nine with zero `atom_did IN` occurrences. Its apply loop calls `verifyStoredSpecialDistrictFactAtom(atom, ...)` on the in-memory object it just constructed. There is no SELECT, no read-back, no `storedByDid` map. It cannot fail, so `summary.verifyFailures` is structurally always 0 for this rail. That defeats the Geometry Law rule that verification reads the STORED BYTES, and it makes the planner handoff's own instruction — "watch `verifyFailures` on the first apply" — vacuous for exactly the rail where watching matters. The fix is the four-line pattern already present in the other eight writers.

**Four rails have never completed a real round-trip.** owner-fact, well-fact, rail-corridor-fact and building-footprint have zero rows. Their did-derivation was proven by mechanism plus sibling evidence plus a unit test, never by observing a write followed by a read. A systematic "atom not readable back" on first apply means the derivation is wrong, not that data is corrupt. One county, read the artifact, then proceed.

**Eleven indexes on 18.5M rows / 29 GB.** Two were added during the verify fix (`atoms_parcel_node_lookup_idx` 122 MB, `atoms_parcel_node_county_idx` 61 MB). Every index is maintained on every insert and the backfill is about to write several rails' worth. The Q7 index audit is worth running BEFORE the applies, and it must judge the two new indexes, not only the original nine. Q7 is NOT dispatched despite an earlier state file saying otherwise.

**Two of our own numbers disagree on the harvest inventory.** `_STATE.md` cites `_catalog/source_field_inventory.json` at 1,330 entries; the report says 1,434 field rows across 11 sources. Query the file, quote neither.

**Q3 will not deliver structural data and must not claim to.** `YEAR_BUILT` appears in 9 of 176 probed counties, `IMPRVMAINAREA` in 2 of 176. `living_area_sqft` sits at 10.5% statewide with Bexar, Dallas, Tarrant, Travis, Collin and Denton all at 0.0%, roughly 3.3M parcels. That data lives in CAMA bulk exports, which is Q5's separate routing motion.

**Store topology, because a wrong assumption here costs a run.** `CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are byte-identical: md5 `9aca0b98ed20d75ac0fbab387b5173e8`, 124 bytes each, both resolving to database `neondb` on `ep-lucky-truth-apodo8hr-pooler`. `txgio_parcel` lives in both names simultaneously. The only real split is `DATABASE_URL`, database `hauska_mcp`, which holds `atoms`. A cross-database join between atoms and txgio_parcel is impossible; the writers page one store and look up in the other. `OPS-13_store_topology.md` overrides the onboarding runbook on store facts.

**One bulk-writer slot per database.** The five rail applies were blocked on exactly this slot and the sweep just released it. Record the handoff in `_STATE.md` before starting, and never run two atoms-bulk-writers concurrently.

**A status is a claim, including every status in this document.** Q6 and Q7 were recorded as dispatched when no agent had ever been handed them — the brief was written and that was counted as dispatch. Before acting on any status here, check for a branch, a PR, or a close artifact.
