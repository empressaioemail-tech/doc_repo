---
id: OPS-22_spine_architecture_map
title: OPS-22 — Spine architecture map (identity, jurisdiction, write fan-in, read fan-out, control plane)
date: 2026-09-10
last_updated: 2026-09-10
status: active
owner: nick
applies_to: portfolio
related:
  - 90_operations/OPS-13_store_topology
  - 90_operations/OPS-21_serve_completion_program
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _catalog/county_contract_v0.json
snapshot: >
  Read read-only 2026-09-10 against origin/main of four repos:
  hauska-factory 63a606b, legacy-design-tools c43e2436 (main since moved to cebd041d;
  the L1 lane re-measured the slate there — see the correction in section 5),
  hauska-engine 15021ef,
  hauska-map fb41c05, plus smartcity-os 332a16c and plan-review 3615ee1.
  Every claim below cites the file it came from. Re-read before relying on a
  count; code moves and this page does not.
---

# OPS-22 — Spine architecture map

## What this is, and why it exists

OPS-13 documents the STORES. This documents the LAYERS between them: how a parcel is
identified, how a jurisdiction is bound to it, what writes, what reads, and what
controls the run. Before this page those five things lived only in the heads of whoever
last worked them, which is the condition ENFORCEMENT.md names when it says the planner
became the only joint.

Read this before designing anything that crosses a repo boundary.

```
  SOURCES     county GIS, CAD rolls, TxGIO/StratMap, Municode, FEMA NFHL,
              RRC, PUCT, TCEQ, city zoning layers, address points
       |
  ACQUIRE     Factory 1.5 — fetch, parse, normalise, stage into neondb
       |
  IDENTITY    prop_id / geo_id / feature_index / place_key /
       |      parcelNodeId / landing_parcel_jurisdiction / entity_id
       |
  ATOMS       hauska_mcp DB. The claims estate. Typed, access-controlled, the catalog.
       |
  RECORD      neondb. parcel_record, 981,405 x 65 rails, five states. The grid.
       |
  GATE        publish-gate-sched, hourly, per (county, rail) -> parcel_gate_verdict
       |
  SERVE       record-served where slated AND verdict=pass; legacy otherwise
       |
  SURFACES    PE/Smart Site, MCP connector, X-ray, Flood & Drainage, Feasibility,
              Command Center, Codex, Dashboards
       |
  COMMERCE    tiers, entitlement, Stripe, metering, SDK payment rail

  CROSSCUTTING: jurisdiction model, control plane, write fan-in, fleet
```

---

## 1. Identity

Seven identifier concepts. The chain, verified at source:

```
CAD source     prop_id        raw text; sometimes not an account at all
               geo_id         the alternate key for 8 high-bad-id counties (OPS-1)
GIS source     feature_index  a polygon. N polygons can share one prop_id
                    |
FACTORY        place_key      "{county_fips}:{prop_id}"            RAW
                    |
                    |  normalizeForJoin()   strip leading zeros on all-digit tokens
                    |                       (engine packages/atoms/src/fact-writer-ids.ts)
                    v
ENGINE         parcelNodeId   "{county_fips}:{normalized prop_id}"  NORMALIZED
                    |
ATOMS          entity_id      "{parcelNodeId}:{suffix}"   e.g. owner-fact ":{taxYear}"
               atom_did (PK)  "did:hauska:{entityType}:{entityId}"   canonical
               body.atomDid   "ownfact_<16hex>"                      short token
                    |
CATALOG        entity_id ranges — crosswalk to place_key NOT FORMALIZED (ADR-031 open)
```

**The undeclared seam.** `place_key` is raw and `parcelNodeId` is normalized, so the two
are the same shape modulo one transform. `src/jobs/owner-rail-collision-check.mjs`
(hauska-factory) flags this in its own header as an explicit ASSUMPTION: if `"27303"`
and `"027303"` are both real, distinct CAD rows, the join conflates them. **That
population has never been measured.**

**Vintage is part of identity on some rails and the two systems disagree.**
`owner-fact`'s `entity_id` embeds `taxYear`. Factory's `parcel-owner.mjs` takes the
LATEST `cad_property.tax_year`; the engine uses a per-county DECLARED year via
`resolveDeclaredCadVintage`, engine-internal and not exposed to Factory. Factory's owner
cell does not record which year it reflects.

**Two atom_did forms** exist and `cp2-refute.test.ts` exists specifically so they are
never conflated.

**Atoms are joined by range, not LIKE.** `entity_id >= place_key || ':' AND entity_id <
place_key || ';'`, because `LIKE pk || ':%'` does not use the index.

**Account is not feature.** The parcel-node planner folds every `txgio_parcel` feature
sharing one `prop_id` into ONE atom by design (`foldedExtraFeatures`). The geometry
scorer's denominator counted DISTINCT `feature_index`, an account-numerator over a
feature-denominator, so nine counties at 94.1–94.99 percent are fully written and
mis-scored. Fix the denominator, never the writer.

**Open rulings** (all three block a second state, none needs a build):

1. Does `place_key` normalize to match `parcelNodeId`, or does `parcelNodeId` stop?
2. Which CAD tax year is authoritative — latest, or the per-county declared year?
3. Does the `place_key` ↔ `entity_id` crosswalk become a contract type, and who owns it?

---

## 2. Jurisdiction

```
county (FIPS)
  |
  +-- landing_parcel_jurisdiction     PK (county_fips, prop_id)
  |     disposition: unincorporated | in-city | unresolved     THREE values
  |     method:      covers-v1 | intersection-v1               TWO methods
  |     place_fips, city_name
  |
  +-- tx_city_boundary        69 cities across the six CTX counties
  +-- tx_city_overlay         +-- tx_school_district
  +-- tx_special_district     +-- tx_puct_ccn (utility CCN)
  +-- tx_austin_watershed     +-- tx_edwards_recharge_zone
  +-- tx_zoning_district_staging      23 of 69 cities carry an endpoint
```

**ETJ is not a disposition.** The enum is three values and ETJ is not one. `etjStatus` is
a separate rail. A parcel in an ETJ binds as `unincorporated` while carrying ETJ on a rail
nothing gates on.

**Two binding methods split the six counties.** Williamson and Travis are `covers-v1`;
Bastrop, Caldwell, Hays and McLennan are `intersection-v1`. They must never be averaged
across method versions, which means the six are not one population.

**Unincorporated collapses 18 rails.** `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS`
(hauska-factory `src/lib/parcel-record-engine/rail-keys.js`) writes `not-applicable` on 17
zoning-envelope rails plus `setbackRules` at row-creation time. It is frozen at its v1
members with an explicit code comment warning against deriving it from the group, because
the two v2 rails would silently join and become not-applicable where that is false.

**Only city membership is a primary-key binding.** School district, special district, MUD,
watershed and utility CCN are companion rails, so overlapping authority is modelled as a
list rather than a structure.

**City count by county:** Bastrop 3, Caldwell 3, Hays 11, Williamson 14, Travis 18,
McLennan 20. Cities with a zoning endpoint: 3/3, 3/3, 5/11, 7/14, 3/18, 2/20.

---

## 3. The rail set

`src/lib/parcel-record-engine/rail-keys.js` (hauska-factory) is the closed set, derived
and not hand-authored. v1 was 52 rails; v2 is **65**, per
`_decisions/2026-09-01_parcel_record_rails_v2_template.md`.

```
cad             20    apn, situs*, landUse*, acreage*, values, yearBuilt,
                      livingAreaSqft, legalDescription, exemptionCodes
zoning-envelope 19    zoningDistrict/JurisdictionKey/Provenance, envelopeStatus,
                      4 setbacks, parcelAreaSqFt, buildableArea x2, maxLotCoverage,
                      maxHeight, maxFootprint, citationUrl, envelopeDisclosure,
                      edgeSignal, maxImperviousCoverPct, treeProtection
companion       18    setbackRules, wells, pipelines, permits, easements,
                      buildingFootprint, specialDistricts, flood, owner,
                      valueHistory, salesHistory, publicRecordRefs, ossf,
                      utilityService, agValuation, mineralRights,
                      hoaDeedRestrictions, overlayDistricts
jurisdiction     4    countyFips, cityLimits, etjStatus, schoolDistrict
spine            4    parcelGeometry, roads, terrain, railCorridor
```

Access is written on every row. `owner` carries `OWNER_RAIL_ACCESS`; every other rail is
`PUBLIC_RAIL_ACCESS`. `owner-fact` is the one property atom whose contract schema pins
`accessPolicy: "public-paid"` and rejects anything else.

---

## 3a. Stores — CORRECTED 2026-09-11, and OPS-13 does not cover this

OPS-13 (2026-08-09) records ONE Neon endpoint with TWO databases. True of the cortex and atoms
stores, and **it does not cover the Factory control store, which is a third, on a different
host.** Two OPS-21 lanes hit this independently (S1 and S2), each re-verifying live.

```
HOST ep-lucky-truth-apodo8hr      (PRODUCTION_NEONDB_URL, and atoms)
  db hauska_mcp   atoms
  db neondb       txgio_parcel, cad_property, landing_parcel_jurisdiction

HOST ep-round-base-au0jofwp       (FACTORY_DATABASE_URL)
  db neondb       parcel_record, parcel_record_cell, parcel_record_companion_row

NOT ESTABLISHED — do not assume either host
                  parcel_gate_verdict, tx_* layers, permit_record
```

The three unresolved entries were carried in the old single bucket and neither lane actually
resolved their host. **They are listed unresolved on purpose rather than silently assigned to
the more likely one.** A lane that needs one resolves it live and reports which host answered,
so this block gains a line instead of a guess.

**The same-name `neondb` on both hosts is the trap.** A connection string that looks right, a
database name that looks right, and a query against the wrong host returns a FALSE ABSENCE,
not an error. Declare which HOST and which database you opened, not just the database.

`parcel-record-fill.mjs:13-14` states the split outright: "That table is NOT on the Factory
control store." **A SQL JOIN between `parcel_record_cell` and any cortex table cannot
execute** — which is why S2 joins in application code, and why two predicates in
`scripts/plan-progress.mjs` were structurally un-runnable until a lane found it.

---

## 4. Write fan-in

```
LDT      nodeFacetBakeTier1            \
         nodeFacetBakeTier1Conformant   |  FOUR bake CLIs, not two
         nodeFacetBakeTier2             |
         nodeFacetBakeTier2Conformant  /
         parcelsPmtilesBake              (tiles)

FACTORY  ~14 parcel-* and acquire-* jobs, each its own cloudbuild + Cloud Run job
         parcel-record-fill              (instantiates the grid)

ENGINE   12 write-*-county CLIs -> ONE Cloud Run job (factory-atoms-cad).
         Its allowlist (scripts/atoms-writer-allowlist.mjs) admits FIVE:
           cad-parcel-roll, well-fact, building-footprint,
           utility-easement, setback-city
         SEVEN writers are built, tested and unreachable by the only runner:
           flood-hazard-fact, land-use-fact, owner-fact, parcel-node,
           rail-corridor-fact, road-node, rrc-pipeline-fact, special-district-fact

ALSO     StratMap bulk reloads (replaced every parcel row 2026-09-03)
         manual zoning stamps
```

**The atoms store binding lives in neither codebase.** `owner-rail-collision-check.mjs`
records that Factory and Engine share no connection string, project id or env-var alias,
so a lane could not establish whether they read the same atoms store. The answer is in a
third place: `cloudbuild.property-atom-bake.yaml` (hauska-engine) sets
`SUBSTRATE_DATABASE_URL="$DATABASE_URL"` from `hauska-prod-497015/DATABASE_URL`, which is
`hauska_mcp`. **They are the same store.** Recorded here because it was invisible to both
repos that needed it.

---

## 5. Read fan-out

```
parcel_record --(code-owned slate AND gate verdict='pass')--> RECORD-SERVED
                                                               18 rails
                                                               94 (county,rail) pairs
                                                               of 390 possible

everything else -> LEGACY:  atom chain (retrieval-api)
                            baked node-facets snapshot
                            cortex fallback route (envelope-null by design)
                            engine-api feasibility route
```

`parcelRecordAllowlist.ts` (LDT) has three states and fails **closed**:

- `record` — serves from `parcel_record`. Requires BOTH slate membership AND a `pass`
  verdict. Never auto-derived from a passing verdict alone.
- `legacy` — the default for anything unslated, regardless of verdict, and the result of
  ANY failure to determine one.
- `refused` — slated but the gate said no. Behaves like legacy at the serve layer but is a
  distinct, visible state, so an attempted-and-refused cutover is not indistinguishable
  from one nobody tried.

**Live slate, 18 rails / 94 pairs:** agValuation 2, maxImperviousCoverPct 1,
setbackFrontFt 6, specialDistricts 5, wells 5, and cityLimits, flood, schoolDistrict,
utilityService, overlayDistricts, valueHistory, zoningDistrict, marketValue,
assessedValue, landValue, improvementValue, livingAreaSqft, yearBuilt at 6 each.

**CORRECTED 2026-09-10 by the OPS-21 L1 lane.** This section first said 94 pairs and
`setbackFrontFt 3`. Measured directly out of `PARCEL_RECORD_SLATE` at LDT `cebd041d`: **97
distinct pairs**, zero duplicates, with `setbackFrontFt` slated on all six counties. The
file's own module doc at lines 181-183 states it. A per-rail count in a program doc must be
re-derived from the literal source array, never trusted as arithmetic.

**The gate's denominator is 17, not 65.** `DEFAULT_SCHED_RAIL_KEYS`
(`src/jobs/publish-gate-sched.mjs`) is SLATE_1 (5) + SLATE_1B (2) + SLATE_1C (1) +
SLATE_1D (7) + LANDUSE_OWNER (2). **Forty-eight rails are never graded**, so canon's
"unaccounted is fatal at publish" is written and not enforced for three quarters of the
grid. This is OPS-21 lane D5.

---

## 6. Control plane

`hauska-factory/src/control/`:

```
runs + termination    BP-FACTORY-01: a job with no termination record fails its own close
claims                Postgres-native transactional claim-and-verify
leases                older random-token exclusion, no relation to a real execution identity
holds / queues        routing pins, queue depth
reaper                F-03, sweeps every in-flight row
writer-allowlist      which writers may write
plan / cloudrun-jobs / collect-complete
```

Known hole, named in ADR-031's open decisions: `claims` is wired into
`parcel-record-fill.mjs` only. `conformant.mjs`, `f10-cad-loop.mjs`, `p2-juris.mjs` and
`restamp-access.mjs` still rely on `leases`.

---

## 7. The defect class this map exists to kill

Every expensive defect of 2026-08 and 2026-09 was a **cross-repo invariant with per-repo
ownership**: the bake writes what the walk reads; the engine holds the registry while the
Factory holds the ceiling; LDT writes `cad_property` and the Factory reads it; the pin is
one line in two repos. No seat could see both halves, so the halves drifted and someone
found out downstream.

The purest instance, found 2026-09-10 and the origin of OPS-21:
`computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has two return branches and **both
are `status:"declined"`**. It is called, it executes, it returns a well-formed object,
every test passes, and it is structurally incapable of returning a value on any branch.
Meanwhile `write-setback-city.mjs:95` refuses `--apply` with `SETBACK_APPLY_HELD`, a
card-scope boundary from commit `c344345` that no later card lifted. Two correct decisions
by two owners; between them the setback and envelope rails lost every path to a value, and
nothing in the system could detect it.

**The general control is a non-vacuity test on every write path: prove that for at least
one real input it produces a value.** Not that it runs. That it can succeed. OPS-21 lane
S3 builds the first one.
