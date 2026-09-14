---
id: 2026-09-14_county_to_serving_WDLL
title: WDLL — county to serving, the one picture of the destination
date: 2026-09-14
status: durable card — the destination and its evidence; rulings marked where ruled
kind: WDLL
owner: nick
programs: [OPS-24]
plan_rows: [P-186 .. P-198, P-200 .. P-208]
last_updated: 2026-09-14 (A-153: the rail ceiling named; excluded split into three)
related:
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-14_county_to_serving_program_map.md
  - _inbox/2026-09-14_ops24_teardown_review.md
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
  - _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md
---

# WDLL — county to serving

> **One picture of the destination.** Written to be read instead of the six documents behind
> it. Where a thing is ruled it says so; where it is unverified it says that instead. Nothing
> here dispatches — OPS-24 holds the rows.

## The destination, in one paragraph

A county nobody has touched goes through **one pipeline** and comes out where a customer can
find it: a real address resolves, the rails we hold carry values with citations, the rails we
do not hold refuse and name why, a gate that is capable of failing has passed it, and a probe
proves all of that on the deployed surface rather than in a close file. The same pipeline,
unmodified, does the next county. When a county breaks it, the fix lands in the shared
pipeline and every county re-runs against it. **Nobody ever ships a county-local patch.**

## What is verified true right now

```
BURNET 48053        acquired, never instantiated
                    59,785 parcels + 2025 roll ON PRODUCTION (landing store)
                    parcel_record 48053 = 0            (factory store, measured)
                    address points = 0                 (one loader run from the
                                                        statewide StratMap set the
                                                        six counties already use)
                    borders TRAVIS and WILLIAMSON, not "the six"
                    Marble Falls: zoning layer verified-live, 261 features staged
                    other 6 places: searched-and-absent, evidenced 2026-08-12

THE GATE            fails open on TOTAL absence in THREE files, not two:
                      hauska-factory  src/lib/parcel-record-engine/publish-gate.js
                      hauska-engine   packages/engine-core/src/parcel-record/publish-gate.ts
                      hauska-factory  src/lib/publish-readiness-gate.mjs (evaluatePopulation)
                    partial absence refuses; total absence passes
                    isolated with a proposed fix 2026-09-13, NOT LANDED

WRITERS             SIX lease-less, not three (verified engine origin/main 14c7e850)
                    owner · land-use · flood-hazard · rail-corridor · rrc-pipeline
                    · special-district
                    narrower than first stated: flood cells serve today, so the
                    defect is RE-RUNS under the current lease

DEAD CONTROLS       SEVEN, not eight. computeTier1Envelope WITHDRAWN — its refusal
                    is ruled (R-2), not a defect. Do not "fix" it.

ASSUMPTION REGISTERS  three files in THREE DIFFERENT FORMATS. The "94 rows" figure
                    was a sum of three self-reports, never a count. Normalising the
                    format is step one of the pre-bake runner, not a footnote.

LAW 1 ARMING        probe-close-gate now derives its ranges from
                    _catalog/plan_registry.json and self-tests against drift.
                    Before today it stopped at P-167 while OPS-23 ran to P-174:
                    SIX closes (P-169..P-174) were graded by a human, not the hook.

ATOMS LEASE         atoms_writer_lease_v2 is PRIMARY KEY (scope_type, scope_id) —
                    already scoped, NOT one global mutex. The contention argument
                    for isolated stores does not survive. The real gap is one layer
                    deeper, in atom identity.
```

## The order, and why it is this order

**Ruled, and now evidence-backed rather than asserted.**

```
1. THE GATE           because a gate that passes an empty county makes every
                      downstream verdict meaningless, and because P-156's
                      per-city declaration FEEDS it — ship the declaration first
                      and it is born unable to fail.

2. BURNET, through the EXISTING pipeline, no new store
                      because the farm must be designed from what a real county
                      breaks, not from what we imagine it will break.

3. THE FARM, from what step 2 exposed
                      and a farm is the ENFORCEMENT MECHANISM FOR ONE PIPELINE,
                      not a place to run a second one. That means a manifest and
                      a merge gate. It does NOT mean an isolated store.
```

## Done looks like — per phase, with its instrument

| Phase | Done is | Instrument | Not done is |
|---|---|---|---|
| **Gate** | an empty county REFUSES with a named code, in all three files, and Bastrop reads unchanged | violation test both directions | "the fix is merged" |
| **Registers** | one format across three files; every row machine-readable | a count that reconciles | a number nobody counted |
| **Pre-bake** | given a county, GREEN/AMBER/RED naming the violated assumption | checked-in, self-testing, not-vacuous case | a prose list |
| **Acquire** | Burnet's address points loaded; roll declared with a marker for accounts that fall off | loader run + declared-vintage rule (P-178) | an upsert that silently keeps notice values |
| **Identity** | Burnet's CAD-to-GIS join measured, not assumed | join-rate query | the 4-of-6 counties still unmeasured |
| **Instantiate + fill** | 59,785 parcels carry the full 65-rail shape; six writers can re-run | cell counts by kind | "the job exited 0" |
| **Completeness** | two INDEPENDENTLY DERIVED counts agree within a declared bound | the second derivation | four checks sharing one upstream, as Harris had |
| **Serve** | record path carries the CELLS' vintage, not the old snapshot's | F25 | values right, label lying |
| **Probe** | a Marble Falls address returns district + setbacks + envelope, cited; a Bertram address says no zoning layer on file for Bertram | `surface-probe.mjs` with an OPS-24 predicate | a close file asserting it |
| **Farm** | a four-line manifest (LDT, engine, factory, two packages) the merge gate compares | merge refused on manifest mismatch | an isolated store nobody needed |

## The rail ceiling, added 2026-09-14 (A-153, P-202)

**A county finished by this program answers 31 to 41 rails out of 65, and the gate will call
it done.** That sentence belongs in done-looks-like because without it "Burnet is done" reads
as "Burnet answers everything", and it does not.

Measured across the six counties already in the ledger: Travis 41 rails passing of 65, Bastrop
38, Williamson 37, McLennan 37, Caldwell 36, Hays 31. In Hays, every one of the 32 excluded
rails has zero value cells and every one of the 33 non-excluded rails has values, with no
exception either way. The gate removes a rail with no writer from its own denominator, so the
county passes and the largest gap never surfaces.

**Read the thirteen stages and note what is not among them: not one stage creates a rail.**
Stage 6 runs writers that already exist under a lease. Nothing in this program builds a writer
for a rail that has none. So OPS-24 executed perfectly moves a county to the ceiling and not
past it. That is the pipeline-makes-correct-not-capable ruling, and it is a property of the
program rather than a defect in it.

The other half of the work is therefore a different program with different economics. A
per-county pipeline costs the same for every county and cannot raise the ceiling; a rail built
once applies to all 254. Onboarding a seventh county at today's ceiling buys eight more empty
rails, not fewer. That program is P-203, and the eight rails with no source anywhere are
`easements`, `hoaDeedRestrictions`, `mineralRights`, `ossf`, `permits`, `salesHistory`,
`terrain` and `treeProtection`.

Not a gap and not to be "fixed": the envelope family (`buildableAreaSqFt`, `buildableAreaPct`,
`envelopeStatus`, `envelopeDisclosure`) reads zero BY RULING R-2. Nine further rails are
mid-cutover rather than missing, serving by another path while their ledger cell is empty
(P-204). Those three conditions are one word, `excluded`, today; splitting them is P-201.


## The one sentence that defines success

**A customer types a Marble Falls address into `smartsite.cloud` and gets an answer; types a
Bertram address and gets an honest refusal that names what is missing; and a gate that was
capable of failing passed both.**

Everything above is in service of that sentence. If a stage cannot be traced to it, it is not
in this program.

## Deferred on purpose — do not scope-creep these in

Row-version stamping on `parcel_record_cell`. The merge gate itself. Isolated farm stores,
which the atoms-lease finding showed were solving a contention problem that does not exist as
stated. Zoning acquisition for Burnet's six absent towns, which are evidenced absences and
correct behaviour, not gaps.

## Owed rulings, none of them mine to make

1. **Two sessions are writing doc_repo main from one checkout.** This has collided twice in
   three days: four IDs on 2026-09-13, one amendment by three minutes on 2026-09-14. The
   standing preference on record is one standing doc_repo session with everything else
   task-scoped. **Which session stays standing is the operator's call**, and a peer cannot
   grant or revoke it. The durable fix is not vigilance: row allocation should be a claim
   against `_catalog/plan_registry.json` with a gate refusing any commit that introduces a
   duplicate ID — the same shape as the close-gate fix that just landed.
2. **Whether the three gate files are twins or drift.** P-195 settles it; until then nobody
   should assume fixing one fixes the others.
3. **Whether the six ungated closes (P-169..P-174) get re-run** through the now-correct gate.
   The fix stops recurrence; it does not re-examine what already passed.
4. **Whether the atoms writer lease is per county or per farm** — named open in OPS-24.

## What changed this week, and what it cost to learn

The plan moved from "how do we go faster" to "nothing we measure is trustworthy yet," and then
to "the fabric layer can start regardless." Throughput was never the bottleneck: 177 counties
in two days is already on record. The bottleneck is that controls report success without being
able to fail, and that has now been found in the gate, in the close hook, in a CI test, in a
starvation guard, in a coverage flag, and in a zoning resolver.

Three numbers that reached canon this week were never counted or were counted wrong: "94
assumption rows" (a sum of self-reports), "three lease-less writers" (six), and "two gate
files" (three). Each was corrected by someone reading source rather than prose. **That is the
method the program should run on, and the cost of not running on it is visible in every
correction above.**
