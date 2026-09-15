---
id: 2026-09-14_county_to_serving_program_map
title: County to serving — the whole program map, revised against live state 2026-09-14
date: 2026-09-14
status: draft — map only, NOT canon, NOT a plan of record
kind: working-card
owner: nick
revision: rev 2, incorporating nine corrections from the OPS-23 side 2026-09-14
related:
  - _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md
  - _inbox/2026-09-13_HANDOFF_national_program_package.md
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
---

# County to serving — the whole program map

> **rev 2.** Rev 1 was measured 2026-09-13 at engine `112bccb8`, hours before OPS-23 wave 5
> landed. Nine corrections applied from the OPS-23 side. **Two of them changed what this map
> tells someone to do**, and both are called out at the bottom.

```
                          FRESH COUNTY -> USER CAN USE IT
  ═══════════════════════════════════════════════════════════════════════════

  0  SOURCE RECON                                          [EXISTS]
     t6_cad_probe (254)  ·  texas_roster_v1 (1,223 places)
     tx-source-truth.mjs -> per-county picture
     ! no gate reads per-PLACE coverage. Thrall was known and invisible.
                                    |
  1  FARM PROVISION                                        [NOT BUILT]
     isolated store  ·  pin the pipeline
     THE PIN IS A FOUR-LINE MANIFEST, not one SHA:
         LDT · engine · factory · the two published packages
     closest thing that exists today: the factory's _LDT_SHA pin, CI-checked.
     step 13 compares the MANIFEST, never a single SHA.
                                    |
  2  PRE-BAKE AUDIT                                        [NOT BUILT]
     probe source against the 94 assumption rows -> GREEN / AMBER / RED
     ! largest unbuilt piece. Without it a farm is exploratory, not repeatable.
                                    |
  3  ACQUIRE                                               [EXISTS]
     StratMap  -> txgio_parcel       (L2: 162 pass, 89 never run)
     CAD roll  -> cad_property       (ArcGIS adapter covers 93% of endpoints)
     zoning    -> tx_zoning_staging  (per CITY, never per county)
     addresses -> txgio_address      ! 6 of 254 counties as of 2026-08-08 — VERIFY
     DECLARED-VINTAGE RULE (P-178): a county's declared roll is a DECISION,
       carrying a marker for accounts that fall off. NEVER an upsert that
       silently keeps notice values.
     ! geometry pass has 3 skip ceilings. land-use pass over the SAME file has none.
                                    |
  4  IDENTITY / BINDING                                    [PARTLY MEASURED]
     place_key {fips}:{prop_id}  --normalizeForJoin-->  parcelNodeId
     landing_parcel_jurisdiction (county -> city)
     TWO-NAMESPACE IDENTITY RULE now in OPS-21 law — applies here.
     collapse population MEASURED FOR 2 OF 6 COUNTIES:
       Hays  37,927 of 116,420 nodes bound to a different account by bare number
             H1/P-145 found · P-177 MCP path · P-180 record store · P-183 wave 6
       Williamson  P-184
       the other four: UNMEASURED
     ! 8 counties statewide flagged prop_id_bad_rate >= 0.25
                                    |
  5  RECORD INSTANTIATION                                  [EXISTS]
     parcel_record + 65 cells, all unaccounted
     18 rails -> not-applicable if unincorporated
                                    |
  6  RAIL FILL                                             [ONE REAL DEFECT]
     works: geometry, wells, pipelines, special districts, CAD scalars, flood
     ✗ owner / land-use / flood-hazard writers take NO LEASE and throw on first
       batch. NOTE: flood cells exist and SERVE today (Hays lots read Zone AO
       from the record), so these writers ran once. The defect is RE-RUNS under
       the current lease. Execution work sits with P-181's ranked list, step 9.
     ○ envelopeStatus / buildableArea / percent = value on 0 of 611,116
       REFUSED BY RULING (R-2), NOT A DEFECT. OPS-21 refuses the FIGURE until an
       envelope atom exists; the POLYGON draws (P-153). Do not "fix" this.
                                    |
  7  ATOMS                                                 [EXISTS, contended]
     atoms_writer_lease = ONE GLOBAL RESOURCE  <- what farms exist to solve
     ! batch returns pre-dedupe, inserts post-dedupe. N/N proves nothing.
     ! atoms are NOT county-partitioned the way parcel_record is — see holes.
                                    |
  8  COMPLETENESS CHECK                                    [NOT BUILT]
     two INDEPENDENTLY DERIVED counts must agree
     ! Harris: four checks sharing one upstream all agreed at 564,948
                                    |
  9  GATE                                                  [BROKEN — FIX FIRST]
     publish-gate-sched -> parcel_gate_verdict
     ✗ evaluateRailGate: ok:true on ZERO earned cells
     ✗ evaluatePopulation: EMPTY_DENOMINATOR skips every refusal
     >> TOTAL absence PASSES. PARTIAL absence REFUSES. <<
     ** P-156's per-city declaration (wave 6) FEEDS THIS GATE. If the gate passes
        an empty county, the declaration cannot fail either. The gate fix lands
        BEFORE any CTX bake, BEFORE any farm, and BEFORE P-156's Travis and
        Williamson rounds. **
                                    |
 10  PUBLISH                                               [EXISTS, hook-enforced]
     publish job -> place_layer_snapshots
     STAGING FIRST, then the IDENTICAL job on production — enforced by hook
     TRAFFIC-LEASE RULE (P-170) — enforced
     a farm publishing to its own store still obeys both at merge-back
                                    |
 11  SERVE                                                 [WORKING]
     cortex-api -> PE / smartsite.cloud, record path
     live 2026-09-14: 1109 Pecan serves 18 of 21 rails from the record;
       the 3 remaining are honest absences (agValuation and impervious cover have
       no Bastrop data; acreageSqft has no writer anywhere).
       Travis probe parcel serves 20 of 21.
     the rev-1 "contradicts in both directions" finding is RESOLVED:
       - setback contradiction gone — hauska-map's axis override removed, panel
         now matches record and MCP (probe artifact 2026-09-14_120659)
       - withheld record values were the six Hays record-overlay rails and five
         unslated allowlist siblings, both slated wave 5 (LDT #678, #684)
     ✗ STILL TRUE: every record-path payload prints facets.bakedAt and snapshotAt
       from the OLD atom-chain snapshot (Bastrop 2026-08-05, Travis 2026-07-24)
       while the cells behind it were written in September. Values right, LABEL
       LIES. The record path must carry the CELLS' own vintage. Rowed as F25.
       Small OPS-23 item, not a re-architecture.
                                    |
 12  VERIFY                                                [EXISTS]
     surface-probe.mjs + a real address
                                    |
 13  MERGE BACK                                            [NOT BUILT]
     merge gate: refuse unless the farm's four-line MANIFEST == upstream
     bypass to block: a direct write to the master store
```

## The two corrections that change what someone does

**A ruling was drawn as a defect.** Rev 1 listed `envelopeStatus` at 0 of 611,116 alongside
genuine breakage. It is refused **by ruling (R-2)**: OPS-21 withholds buildable area, percent
and envelope status until an envelope atom exists, while the polygon draws under P-153. Drawn
as a defect, this map would have sent someone to fix a decision. That is the more dangerous
error of the two, because the fix would have looked like progress.

**The gate fix was sequenced after the thing that depends on it.** P-156's per-city
declaration in wave 6 feeds the publish gate. A gate that passes a county with zero earned
cells cannot fail on a declaration either, so shipping the declaration first would produce a
control that is born dead. **The gate fix precedes any CTX bake, any farm, and P-156's Travis
and Williamson rounds.** This is now the most load-bearing sequencing statement on the page.

## Holes that remain after rev 2

**The merge is four merges, not one.** `parcel_record` and `parcel_record_cell` are
county-prefixed and concatenate cleanly. Atoms are not: one global store, `atom_did` as
identity, 111M rows, its own writer lease. A farm minting atoms locally needs a real
reconciliation, not a concatenation. Unexamined.

**The proof currently lives outside the farm.** Stages 0-8 happen inside a farm. The gate,
publish, serve and probe are production machinery. So a farm's final proof requires reaching
production, which inverts the isolation it exists for. **The open design question for
prototype one: does a farm carry its own gate, publish and serve, or hand a verified dataset
to the production pipeline and get judged there?**

**A user may not be able to search a fresh county.** The Find box resolves through address
points, and `txgio_address` held 6 of 254 counties on 2026-08-08: Bexar, Travis, Williamson,
Hays, Bastrop, Caldwell. Burnet is not among them. Five weeks stale and must be re-verified,
but if it holds, address-point ingest is a stage-3 prerequisite nobody had on the list.

**No teardown or rollback path** for a farm that merged and was wrong.

**Per-place coverage has no rollup and no gate.** The data exists in three places. Thrall was
enumerated on 2026-08-12 and still invisible to every human and every gate.

## Relationship to OPS-23

Nothing here contradicts OPS-23. This map describes the same seams from the county-onboarding
side rather than the serving side. Where the two touch, OPS-23's live state is authoritative
and this map defers to it: rev 1's step-11 finding was true at `112bccb8` and false within
hours of wave 5 landing, which is the general hazard of measuring a moving program.
