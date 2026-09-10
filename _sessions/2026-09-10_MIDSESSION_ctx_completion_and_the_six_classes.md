---
id: 2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes
title: MIDSESSION — CTX completion: six defect classes, twenty-six lanes, and one county through
date: 2026-09-10
last_updated: 2026-09-10
status: midsession capture, session still live
owner: nick
agent: claude_code (integration seat, doc_repo)
seat: integration
plan_rows: [P-124, P-120]
snapshot: doc_repo main c250103e. hauska-factory main 52c1b782. legacy-design-tools main 9873ff11. hauska-engine main carries PR #414 and #415. Every production figure below was read live by field; figures attributed to a lane close are marked as such.
related:
  - _inbox/2026-09-09_ctx_planner_retirement_close.json
  - _inbox/2026-09-09_ctx_scalability_retrospective_PICKUP.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# MIDSESSION capture

Session opened as a strategic conversation about whether the CTX process is scalable, and
became the execution session that finished it. Both halves are captured; the strategic half
is already filed separately as a pickup and is not repeated here.

## What was inherited

A long-running CTX planner was retired at the operator's instruction. Its close
(`_inbox/2026-09-09_ctx_planner_retirement_close.json`) is the best handover this fleet has
produced: it named eleven blockers, listed eleven claims it believed but had not measured,
and wrote down what existed only in its own head.

Two of its load-bearing claims turned out to be wrong, and both were repeated by this seat
before being caught. Bastrop's 16,104 stale rows were said to need "nothing but a re-bake";
they needed a fix to a bake that skipped them on every run. And a "pending Factory re-bake"
was named as the resolution for 67 staleness parcels; no such job exists.

## The six defect classes

None of these were known at session start. Each was invisible until the one in front of it
cleared, which is the serial-discovery shape the morning's retrospective named.

**1. Punctuation-only situs.** 18,037 rows across three counties, Bastrop 16,104 of 77,799.
The conformant bake `continue`d past an on-roll account whose CAD situs was punctuation
only, before any database write, so those rows stayed frozen on a pre-conformant snapshot
across every future run. A re-bake could not reach them. Fixed as an earned absence
(LDT #648). 100 percent of the affected rows correlate to StratMap lineage.

**2. Ceiling measured by one instrument, enforced by another.** `DECLARED_LAYER_GAP` for
Elgin was written from a live point-in-polygon probe and enforced against the rail's own
best-overlap predicate. Two different questions. Resolved by deriving the ceiling from the
rail itself (26 Bastrop, 506 Travis) with its decomposition recorded.

**3. Parcels that could reach no state at all.** 17 Bastrop and 50 Travis parcels matched
no staged polygon, so `parcel-r5-zoning` could not write `value`, and the new per-parcel
gate correctly excluded them from `refused`. Permanently `unaccounted` against a publish
gate requiring zero. Root: `hauska-engine`'s `zoning-staging` and LDT's `zoning-layers`
registries cover different parcel sets for the same city. Fixed with a stamp-sourced
`value` carrying its own `STAMP_SOURCE`; the registry reconciliation is deferred with a
test-pinned flag.

**4. A missed sibling.** `baseFacts.acreage` was a bare null on **291,231 of 1,516,110**
baked cells. CTX-LEAVES built earned-absence machinery for four leaves on 2026-09-08 and
acreage was never added to the enforced set. McLennan alone was at zero, which is exactly
why McLennan is the county that passed.

**5. A ruling filed and never implemented.**
`_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` required `unmeasured` to
convert to `refused` at serve. It was never implemented at `verdictLayerServe.ts`. CI then
revealed why it may never have been: **`LayerAbsenceVerdict` did not have `"refused"` as a
valid member.** The type could not express the state the decision required. A second
unimplemented instance of the same ruling was found and left named.

**6. Sub-metre digitisation mismatch.** 13 parcels held two counties at the publish gate on
`schoolDistrict`. Not degenerate geometry, which was this seat's leading hypothesis and was
wrong. `tx_school_district` and `tx_county_boundary` are independently digitised and their
shared edges miss by 0.8 to 0.9 metres; a strict `ST_Intersects` against the county ring
excluded districts that were physically adjacent. Bastrop `11585`'s centroid sits 25.5m
outside its own county's ring while Manor ISD, the correct answer, is 0.79m from it.

## What reached production

All read live by field, not from a close.

    zoning rail apply     5,118 cells, two counties, every predicted count exact
                          Bastrop    9 refused + 17 stamp-sourced value
                          Travis   456 refused + 50 stamp-sourced + 1,174 newly matched
                          zero refused written over the staleness class in either county
                          stamp values carry legacy-design-tools:txgio_parcel, NOT the
                          staging layer -- provenance separation held under production write

    impervious apply      Travis 244,669 written refused with a cited ordinance basis
                          scanned 380,917 = 22,139 value + 114,109 n/a + 244,669 refused
                          maxImperviousCoverPct moved refuse to pass 0

    school-district       applied to Bastrop, McLennan, Travis; gate refresh in flight

    McLennan              walk 4db2a33f, pass=182 fail=0, staging
                          the first county ever to pass a walk that grades content

## Twenty-six lanes

26 CTX dispatches compiled, 25 closed. Merges: `hauska-factory` #117 through #126,
`legacy-design-tools` #647, #648, #649, `hauska-engine` #414 and #415.

Every lane refused to smooth over something. A partial list, because the pattern matters
more than any single result: CTX-STAMP stopped rather than ship a no-op against the wrong
repo. CTX-SP rejected a search-engine answer about a zoning district and mapped it to its
own identity rather than a neighbour. CTX-PARCELGATE surfaced a third precondition nobody
had asked about and answered "no" to a question it could have answered "yes" to.
CTX-LEAVES2 tested the absence state it was handed and overturned it across 291,231 cells.
CTX-PIN validated its own tracer against a known answer before trusting it. CTX-SCHOOL
demolished this seat's leading hypothesis and found a thirteenth parcel nobody had counted.

## This seat's own error record

Kept because the pattern is the finding, not any single item.

Six wrong data-shape assumptions: the root Dockerfile for engine-api; a premature all-clear
on an image that then existed; an incomplete Cloud Run argument set that dropped `--gold`
and `--skip-pmtiles`; `place_key` assumed as `node:<fips>:<prop_id>` when
`parcel_record_cell` uses `<fips>:<prop_id>`; a `runs.created_at` column that is
`started_at`; a `parcel_gate_verdict` read taken mid-write and nearly reported as a partial
failure.

Three wrong dispatch premises, each corrected by the lane it was sent to: `69de8fe6`
declared urgent when it never reached the bake; the ceiling declared derivable from a
staged table with no live consumer; CTX-SP pointed at the wrong spatial predicate.

Two wrong predictions: that CTX-SITUS-SKIP would clear Caldwell as a side effect, and that
the rail apply would move ~532 cells rather than 5,118.

One job assigned to this seat at 09:00 and forgotten until 23:00: the Travis impervious
re-run, which had been blocking that county all day.

The common shape is reasoning from what a thing appears to be instead of reading it. It is
the same habit the retired planner named in its own handover, inherited within the hour.

## Open, with honest status

    CTX-PIN2        in flight. _LDT_SHA to 9873ff11 plus a module-graph staleness check.
                    FOUR counties held behind it. Second time today this seam blocked the
                    same counties; the first cost Caldwell and McLennan a failed run.

    Caldwell 48055:1  NO LANE. Serve-guard 422 on a parcel that is not a well-formed
                    account -- 203 txgio_parcel features share prop_id '1'. Same family as
                    48491:PRIVATE ROAD. Needs the population measured before it can be
                    scoped as a ruling or a lane.

    Hays            NOT RUN tonight. Its CADROLL_RENULLED failing set is unread by anyone.
                    The geometry-only population was established as structurally incapable
                    of causing it, so the actual cause is unknown rather than pending.

    HOIST_CITIES_SQL  carries the identical guard CTX-SCHOOL removed from the school rail.
                    No evidence it is broken; CTX-SCHOOL correctly declined to generalise.
                    But it determines in-city versus out-of-city, which drives the whole
                    zoning doctrine, and a sub-metre miss there would be silent.

    WATER SUPPLY RURAL  the operator ruled `not-applicable`; the code writes `refused`; it
                    was applied as `refused` on 244,669 parcels on the operator's go. Needs
                    filing against the revisit flag already pinned in code.

    LDT leftovers   the PRIVATE ROAD correction script (written, not run against
                    cortex-prod), hauska-factory's landing_cad_property follow-up, and
                    cityLimitsFact.status/etjStatus as a second open instance of the
                    2026-09-01 decision.

## What is NOT claimed

No county has reached production tonight. McLennan passes staging and was deliberately held
rather than promoted while its siblings were still exposing new classes.

Williamson received its first content grade in its history tonight. Whether clearing the
acreage class leaves it clean or exposes the next layer is unknown, and every county so far
has had a second thing behind the first.

The `_LDT_SHA` on `cloudbuild.parcel-r5-zoning.yaml` is three commits stale. It was
established to be a false provenance label rather than a stale dependency -- the plain
`Dockerfile` never fetches LDT -- and was deliberately not bumped in a lane gating four
counties.
