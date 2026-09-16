---
id: 2026-09-16_farm_architecture_draft
title: Farm architecture — the system as it stands, where it breaks, and the options for a farm
date: 2026-09-16
status: DRAFT for review. Nothing here is decided. The farm-architecture research lane (L-D) measures what this cannot, and the final teardown attacks it.
kind: architecture-draft
owner: nick
audience: the operator, then the lanes that research and build the farm
parent: _inbox/2026-09-16_texas_scaleup_program_scope.md
snapshot: |
  Read 2026-09-16 from origin/main of hauska-engine (2d85fee), hauska-factory (bfb7303),
  legacy-design-tools (ba39b4f5) and hauska-map (f7fbcbf), and from the stores read-only.
  - Factory store: 107 GB; parcel_record_cell 26 GB.
  - Atoms store (hauska_mcp): 203 GB, about 102 million atoms, 1.4 million buildable-envelope
    atoms.
  - Store facts not re-read today carry their memory entry's date.
---

# Farm architecture — draft

## 1. The system as it stands

```
SOURCES, all public record
  TxGIO StratMap parcels and address points . county CAD exports and APIs
  city zoning GIS . ordinance text (municode, eCode360, American Legal, city PDFs)
  FEMA NFHL . TIGER and OSM roads . RRC . TEA . PUCT and TCEQ . USGS
  Cotality: MCP eval channel only (contract promised; nothing served until then)
        |
        |  LDT loaders (cad-ingest), factory acquire-* jobs
        v
LANDING, production neondb in the cortex-prod Neon project (staging on branches)
  txgio_parcel . txgio_address . cad_property . tx_zoning_district_staging
  landing_parcel_jurisdiction . tx_* layers
  place_layer_snapshots  <-- the tier-1 BAKE, a third copy the surfaces read
        |
        |  factory jobs on Cloud Run, us-east4
        |  (seed, parcel-record-fill, parcel-* writers, hourly publish-gate-sched,
        |   county-parameterised publish, verify-walk)
        v
FACTORY STORE, Neon "withered-surf", us-east-1, small compute, 107 GB
  parcel_record 981,405 . parcel_record_cell 63.8M (26 GB) . parcel_gate_verdict
  runs and run_events . verify_walks . publish_runs . leases
        |
        |  engine jobs (breadth bake, depth-warm, boundary primitive, fact writers)
        |  under atoms_writer_lease_v2, keyed by county; measured 67-149 atoms/s
        v
ATOMS STORE, hauska_mcp in cortex-prod, 203 GB, about 102M atoms
  parcel-node . zoning-fact . setback-rule . buildable-envelope (1.4M)
  property-boundary-edge . road-node . building-footprint . owner, land-use and fact families
        |
        v
SERVING
  hauska-engine retrieval-api: the one ruled reader; parcel-record slate, 152 entries
  cortex-api (LDT api-server): /research/brief, /place/node/:id/facets,
      /place/buildable-envelope (a live derive that DEFERS to the envelope atom)
  hauska-map property-explorer adapter: per rail, "record", "legacy-transitional"
      or atom-chain
  smartsite-mcp (LDT) . hauska-mcp-server (exports) . hauska-engine-api (PDFs)
        |
        v
SURFACES: smartsite.cloud map and panel . Claude connector . PDFs
```

## 2. Where the "single source of truth" is not yet true

The 2026-09-11 ruling says the ledger is the serving path and atoms are canonical: a cell is
accounting, and it points at its atom. Measured today, that is not what runs.

- **A cell carries no atom pointer.** The map adapter's own per-rail state reads
  `atomBacked: false` on every rail sampled. P-163 and P-164 are the unbuilt rows.
- **The envelope has two writers that disagree.**
  - The ledger's setback cells were written in September.
  - The envelope atoms come from the July breadth bake, and the live derive defers to them.
  - 490,185 of those atoms say "no buildable area". About 362,600 of them mean "unzoned" or
    "not onboarded", and about 123,700 are unexplained zeros.
  - Wherever the ledger now holds setbacks and the atom still says zero, the envelope is
    declined.
- **Three copies are read by surfaces:** the ledger, the atoms, and the tier-1 bake
  (`place_layer_snapshots`). A write to one is invisible through the others until something
  re-bakes (P-230).
- **Two setback registries** (the setback corpus, and the engine's jurisdiction descriptors).
  **Two edge labellers** (the engine's depth-warm one, and LDT's live one).
- **The situs family is still served from the cortex path.** The ledger holds "PFLUGERVILLE
  78660" for 203 E Oxford Dr, and the card shows a bare street line and "Travis County".

**What a single source of truth requires.** One read over the ledger answers, for any parcel and
each of its 65 rails:

- the cell state;
- whether and from where it serves;
- the atom behind it, and whether the two agree.

That read does not exist today. The ledger-truth research lane (L-A) builds it as an instrument
first, so the gap can be counted before it is designed away.

## 3. Bottlenecks, with evidence

| # | Bottleneck | Evidence | Matters for |
|---|---|---|---|
| 1 | Factory store compute is small | 2026-08-28: every read, including primary-key reads, timed out at 60 to 90 s while one county writer ran | parallel farms |
| 2 | Atoms write path has a per-atom floor | Measured 67.4 and 149.0 atoms/s after the link-batching fix (memory, 2026-08-27) | any county with millions of atoms |
| 3 | Heavy-scan serialisation | The agent contract serialises heavy scans fleet-wide | parallel farms, re-mints |
| 4 | Publish is serial per county | Staging then production, with a verify walk each | throughput |
| 5 | People | Operator go points; integration-seat fix absorption | the real limit on parallel farms |
| 6 | Unindexed atom families | Some families have no county-bounded index; ad hoc scans over 102M rows are unsafe | instruments and the completeness check |

**Unmeasured, and needed before choosing:**

- Neon compute sizes and autoscaling caps per project.
- Branch limits and storage growth per branch.
- Per-stage wall-clock. No county was ever metered.

## 4. Options for a farm

| Option | What it is | Isolation | Throughput | Merge | Risk |
|---|---|---|---|---|---|
| **A. Shared stores, county-scoped** | today's stores; farms write their county's rows | data only | bottlenecks 1 to 3 remain; two farms contend | publish as today | parallel farms slow each other and production reads |
| **B. Neon branch per farm** | a factory branch and an atoms branch per county, each with its own compute | data **and** compute | each farm has its own compute | publish from the branch through staging to production, under the manifest gate | atom identity on merge (P-193), row versions, branch cleanup (the 2026-08-28 incident), secrets per branch |
| **C. Separate Neon project per farm** | full isolation | strongest | best | cross-project export and import | highest ops cost; a second copy of every loader's config |
| **D. Shared stores, redesigned write path** | bulk COPY into staging tables, set-based merge, larger computes | data only | removes bottleneck 2 | publish as today | still contends on 1 and 3 |

**Leaning, not decided: B for isolation plus D's bulk write path for speed.** A farm is a branch
pair with its own compute, loaded in bulk, and merged by a set-based publish through staging.

That changes the 2026-09-14 teardown's conclusion ("isolated stores are not needed") for a
specific reason. The teardown looked at the atoms **lease**, which is scoped per county. It did
not look at **compute contention** (bottleneck 1) or **write throughput** (bottleneck 2). Both are
real. The farm-architecture lane (L-D) must measure them before this is chosen.

## 5. The farm pipeline mapped onto that architecture

| Stage | Where it runs | Writes to | Gate or instrument | Operator stop |
|---|---|---|---|---|
| 0 Recon and places | doc_repo catalog; live source probes | roster, per-place declaration | tx-source-truth; declaration loader | none |
| 1 Manifest | farm record | manifest (LDT, engine, factory, two packages) | stage records must carry it | none |
| 2 **Pre-bake (bake) audit** | read-only against the county's sources | audit report | normalised register runner: GREEN, AMBER or RED with the assumption named | RED |
| 3 Acquire | loaders, into the farm's landing branch | parcels, roll (declared vintage), address points, zoning layers, ordinance tables, road nodes (OSM, TIGER, county roadway), ag valuation | loader run records; source-exhaustion log for every "not found" | new credential |
| 3b Vendor (Cotality) | vendor stage, capped | vendor atoms, fetch-path meter | bulk-call refusal; rights envelope | contract terms |
| 4 Identity | farm factory branch | crosswalk | join-rate instrument (H1 generalised) | none |
| 5 Instantiate | farm factory branch | 65-rail full shape | census | none |
| 6 Rail fill | farm factory branch | cells | writers under lease, run records | none |
| 6b Depth (envelope family) | farm atoms branch | setback-rule, boundary-edge, envelope atoms; `edgeSignal` | one labeller; ground truth P1 to P3; false-zero guard | none |
| 7 Atoms | farm atoms branch, bulk | atoms plus cell pointers | read-back by county | none |
| 8 Completeness | farm branches | none | two independently derived parcel counts | none |
| 9 Gate | farm factory branch | verdicts | P-195, P-201 split, false-earned guard (six-county-completeness generalised) | none |
| 10 Publish | branch to staging to production | serving stores | lease; verify walk; retract-by-run-id | production write |
| 11 Customer probe and meter | surfaces | probe artifact; stage record | surface-probe county legs | none |
| 12 Merge | production | row versions | manifest equals upstream | none |

**Every stage writes one stage record** with:

- the manifest;
- start and end times;
- counts in and out;
- operator minutes and dollars;
- every defect found, with its class, fixture and upstream fix.

That record is the speed baseline, and the blocker-history lane (L-C) supplies the class list
the defects are filed against.

## 6. Questions the farm-architecture lane (L-D) must answer before this is chosen

1. **Neon.** For the factory and cortex-prod projects: compute size, autoscaling caps, branch
   count limit, storage growth for a branch of a 203 GB store, and branch compute cost behaviour.
2. **Merging a branch.** Can a set-based publish move one county's cells and atoms from a branch
   to production without an identity collision (P-193) and without a long lock?
3. **Throughput.** What is the measured atoms write rate on a bulk path compared with today's, and
   on which store?
4. **Serving copies.** Which of the three copies (ledger, atoms, bake) must a farm write for a
   customer to see the county? Can the bake copy be retired (P-230) rather than farmed?
5. **The Bastrop-named publish job.** It is county-parameterised in practice. What else in the
   pipeline still carries a county literal a farm would trip on?
