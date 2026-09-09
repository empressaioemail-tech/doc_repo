---
id: 2026-09-09_ctx_scalability_retrospective_PICKUP
title: CTX scalability retrospective — the six-runbook finding, and the pickup for the consolidation that replaces them
date: 2026-09-09
last_updated: 2026-09-09
status: PICKUP — parked deliberately until the six Central Texas counties are in production
owner: nick
seat: integration (doc_repo)
applies_to: portfolio
plan_rows: [P-124, F-11, F-13, F-14]
snapshot: doc_repo main abef090f, read 2026-09-09. Every claim below carries its source and date in the provenance table; claims sourced to fleet memory rather than to a file read in-session are marked and must be re-verified at pickup.
related:
  - 90_operations/OPS-2_county_onboarding_runbook.md
  - 90_operations/OPS-8_blocker_free_onboarding_model.md
  - 90_operations/OPS-11_invariant_register.md
  - 90_operations/OPS-19_factory_plan_of_record.md
  - 90_runbooks/factory_1_statewide_fabric.md
  - 90_runbooks/factory_1_5_acquisition_staging.md
  - 90_runbooks/factory_2_jurisdiction_depth.md
  - _sessions/2026-09-09_ctx_bake_run_claude_code.md
  - _inbox/2026-09-08_six_fact_families_reach_no_consumer_finding.md
  - _decisions/2026-09-01_every_parcel_starts_with_a_full_record.md
---

# CTX scalability retrospective

## What this is, and what it must not become

The operator opened a conversation on 2026-09-09 asking whether the path carved through
six Central Texas counties is scalable and duplicatable, and asked for a runbook for
onboarding the next county and the next state.

The answer that came back is that the runbook already exists six times, and that writing
a seventh is the predictable failure of that conversation. The operator agreed and set
the constraint this document exists to hold: **the output is ONE consolidated, refined,
finished artifact that supersedes the six, not a seventh document beside them.**

This file is not that artifact. It is the pickup for the deeper discussion that produces
it, parked on purpose until the six counties are in production. Anyone who opens this
file and starts writing a runbook has misread it.

## The finding that reframes everything else

Six attempts at the same artifact exist, five of them written inside a twenty-four day
window, each correct when written.

| Doc | Written | Status at this snapshot |
|---|---|---|
| `27d_county_onboarding_recipe_and_fleet_reliability.md` | by 2026-08-09 | superseded |
| `90_operations/OPS-2_county_onboarding_runbook.md` | 2026-08-02 | active, corrected once |
| `90_operations/OPS-8_blocker_free_onboarding_model.md` | 2026-08-03 | model, never armed |
| `90_runbooks/factory_onboarding_runbook.md` | 2026-08-04 | superseded seven days later |
| `factory_1` / `factory_1_5` / `factory_2` set | 2026-08-11 | active |
| `90_operations/OPS-19_factory_plan_of_record.md` | 2026-08-26 | active, 31 amendment rows |

None of them stopped the six counties from consuming ten CTX-named session records
between 2026-08-28 and 2026-09-09, with the bake still not through to production at this
snapshot. That is `ENFORCEMENT.md`'s own governing rule landing on the process that wrote
it: an artifact that exists, is correct, and does nothing.

The consolidation is therefore not an editing job. If the seventh artifact is prose, it
will join the six.

## The operator's hypothesis was wrong, and the correction is load-bearing

The conversation opened on the premise that atomization is where the extra work goes.

The 2026-09-09 session enumerates eleven blockers that had to be unwound in strict
order, each invisible until its predecessor cleared: a verify walk applying a bake-shape
predicate to a served payload; `situsState` a bare null because `cad_property` has no
such column; a street-local sampler that made any jurisdiction-varying rail sample
all-or-nothing; six more required leaves bare null; `classifyRequiredLeaf` silently
grading any unrecognised declared state as a populated value; a React render crash on the
new absence object; a zoning mirror projecting two of three earned states; a cortex
staging tag that never followed the production shift; `parcel-r5-zoning` holding a CLI
command and a Cloud Run guard and no Cloud Run job; a merged sweep with zero callers;
Elgin polygons never staged into the table the rail reads.

Not one is atomization. Every one is plumbing or instrumentation.

The atom contract has been doing its job, and doing it by refusing. On 2026-08-03 an
executor stopped mid-dispatch rather than mint setback-rule atoms, because the contract
required numeric dimensions and had no absence shape, so a decline would have been
indistinguishable downstream from a real zero-setback rule. On 2026-09-09 the CTX-STAMP
lane read the function it was pointed at, found it wrote a different table in a different
database, and stopped rather than ship a no-op. Both refusals cost time and both were
correct.

**What is actually expensive is that the verification layer was built after the pipeline,
reactively, one defect at a time.** The clearest single piece of evidence: Caldwell
reached production on a walk that drew sixty street-local parcels, all sixty clean, in a
county where 38,442 would have failed. The gate passed because the instrument could not
fail.

## The cost commitment's kill switch is armed on the half that did not break

Structural commitment three is under 200 dollars compute plus one hour human review per
jurisdiction, hard kill at three counties if not achievable.

The compute half is measured and clears by orders of magnitude. `OPS-2` records roughly
0.34 dollars compute for 6,972 Bastrop parcels. `factory_1_statewide_fabric.md` line 246
instructs that it not be re-measured.

The human half has never been measured at all. `OPS-11` grades SC-3 as UNENFORCED as a
mechanism and explains precisely why: the cost step is a runbook instruction an operator
executes, not a gate that blocks a warm.

The program is at six counties, well past the three-county hard-kill checkpoint, and the
checkpoint never fired because the dimension that blew out is the one with no instrument
on it. This is not a scaling problem that went unnoticed. It is a kill trigger armed on
the cheap half.

## What worked, and must survive the consolidation

Hook-shaped controls. The recorded score is hook-shaped 1-for-1 against protocol-step
0-for-3, which is why `authoritative-read.mjs` was armed after prose failed three times.
On 2026-09-09 the rail gate correctly refused Bastrop on 26 parcels, the planner's own
`LAYER_GAP_RESIDUE_EXCEEDED` guard caught it borrowing numbers across pipelines, and a
test whose premise had expired caught itself.

Refusal over fabrication, consistently, including when it cost time.

Compiled dispatches over hand-assembled ones, with the canon gate blocking what is not
compiled.

Area-sweep over parcel-sample, bought at the price of a revoked Bastrop certification in
July 2026.

## What did not work

Prose runbooks, six for six.

Parallel waves before one end-to-end proof. The mechanism was already written down on
2026-08-08: five L2 acquisition blockers surfaced one at a time, each invisible until the
previous cleared, and one county run end to end would have found all five in one pass.
The 2026-09-09 session is the same failure with eleven items, thirty-two days later.

Hand-authored per-county state that does not survive iteration. `TXGIO_COUNTIES` is both
the gate and the loaded-record, so a county that has loaded still reports unloaded. Logged
STILL OPEN with the note that a manual registry step per county does not survive 235
iterations.

The planner as the only joint. `ENFORCEMENT.md` carries its own operational note that
planner error rate rises sharply late in a long session, and four of the eleven blockers
on 2026-09-09 were planner-introduced, three sharing one root: assuming a shape instead of
reading it.

## The second-state answer

Measured 2026-08-12 and held in fleet memory rather than in a file read this session, so
re-verify before acting.

Thirty of forty-eight executable acquisition files are Texas-coupled on an executable-file
counting rule. `assertTexasWgs84Bbox` throws on any non-Texas coordinate and is called per
feature, so a second state fails closed on its first row. `WHERE STATE='48'` is hardcoded
in the boundary service.

Utah proves the Factory 1 premise: UGRC publishes a genuine statewide parcel product,
1,592,583 features across all 29 counties, confirmed by County groupBy and four-corner
probes. But `uniformProduct` is false. It is a county-steward merge, not one schema.
**The acquisition motion ports. The normalisation motion does not.** Texas normalisation
reuse must not be budgeted when sizing a second state.

`OPS-19`'s own definition of done already requires one Utah county from discovery to
visible on production. Those are rows F-13 and F-14 and neither has a status transition in
the grade log at this snapshot.

## What the consolidated artifact should be

Not a document. Three things, in this order, offered as the opening proposal for the
deeper discussion rather than as a settled design.

**A county profile record.** Machine-readable, one row per county, instantiated with its
complete column set the day the county enters the roster: parcel authority and vintage,
CAD roll with join key and bad-id rate, city roster with each city's zoning endpoint and
completeness declaration, projection, and every rail known absent-verified with its scope.
Everything currently discovered by hand per county becomes a field that starts
`unaccounted`. This is the 2026-09-01 ruling that a record is instantiated with its full
column set and acquisition changes a cell's state rather than its existence, applied one
level up: to counties instead of parcels. A missing column is invisible; an unaccounted
cell is countable. Today every county's unknowns are invisible until a lane trips over
them in sequence, which is exactly the serial-discovery failure above.

**A preflight that refuses** to start a county whose profile has an unaccounted field on a
rail the run needs. `OPS-8` designed this on 2026-08-03 and it was never armed;
`gateWarmCohort` is reported present in one of four runners. Existing, correct, doing
nothing, for the third time in this document.

**One county run end to end as a single instrumented pass with human hours counted**,
before any wave. That number is the missing instrument for SC-3's second half. Until it
exists, scalable is an opinion.

The runbook is the output of that run, not its input. Writing it first documents an unrun
process.

## The fork, still open

Two paths were put to the operator on 2026-09-09 and neither was chosen, because the
conversation turned to shipping the six.

The first is to finish CTX on the current hand-carried path and only then instrument
county seven. Lowest risk to work in flight; the profile record gets designed against six
counties of evidence.

The second is to build the profile record and arm the preflight first, then put Bastrop
and Travis through the armed path as the proof. Slower to a finished CTX, but the first
county through the new path is one already known cold, which is a better test than a fresh
county.

The planner leaned to the second, narrowly, on the grounds that the evidence being waited
for is already written down across ten session records and 121 OPS-16 amendment ids, and
this operation has historically been better at collecting that evidence than at acting on
it. The argument against is that Bastrop and Travis were both blocked on one live lane and
re-routing them onto an unbuilt gate adds a dependency to nearly-finished work.

**Subsequent events have weakened the second path.** The operator has since ruled the
Feasibility report a launch surface alongside the map, which puts capability work
(`out-of-scope` and `failed-this-run` fact families) and drainage precompute on the
critical path. Re-deciding this fork at pickup, against the state of the program then
rather than the state on 2026-09-09, is the correct move.

## The separation that must not be lost

Finishing the onboarding path does not make the product more capable.

The 2026-08-31 tally, thirteen things a customer can ask a parcel with eight refusing, is
**superseded** as an instrument. The `absentFields` classifier, live on
`hauska-engine-api-00193-xex` and measured 2026-09-08, classifies per parcel every fact
family the report could not fill and why: `out-of-scope` (merged, correct, unreached),
`failed-this-run` (reached and failing), `blocked-at-source` (no data), and ruled absences.
The why determines the cost, which the old count could not express.

Onboarding cost per county and what a county can answer are two roadmaps. A perfect
runbook moves only the first. Several refusals are independent of jurisdiction coverage
entirely, so breadth multiplies refusals rather than reducing them.

## Provenance, so the pickup can trust or re-verify each claim

| Claim | Source | Re-verify at pickup? |
|---|---|---|
| Six runbooks, dates and statuses | frontmatter read in-session | no |
| Ten CTX-named session records 08-28 to 09-09 | `ls _sessions/` in-session | no |
| Eleven blockers, Caldwell 60 of 38,442 | `_sessions/2026-09-09_ctx_bake_run_claude_code.md` | no |
| 0.34 dollars compute for 6,972 parcels | `OPS-2` cost gate section | figure is 2026-08-02 vintage |
| SC-3 UNENFORCED as a mechanism | `OPS-11` Tier 2 table | yes, if a gate has since been armed |
| OPS-16 121 unique amendment ids, 124 rows | grep in-session, counting rule stated | no |
| OPS-19 31 amendment rows, highest A-030 | grep in-session | no |
| F-13 / F-14 no grade-log transition | grep of OPS-19 grade log | yes |
| 30 of 48 acquisition files Texas-coupled | fleet memory, measured 2026-08-12 | **yes** |
| Utah 1,592,583 features, 29 counties, uniformProduct false | fleet memory, probed 2026-08-12 | **yes** |
| `gateWarmCohort` in 1 of 4 runners | fleet memory | **yes** |
| `TXGIO_COUNTIES` gate-equals-record still open | fleet memory, 2026-08-08 | **yes** |
| hook 1-for-1 vs protocol-step 0-for-3 | fleet memory plus `ENFORCEMENT.md` | no |
| `absentFields` supersedes the 13/8 tally | `_inbox/2026-09-08_six_fact_families_reach_no_consumer_finding.md` | no |

Two figures stated in the originating conversation were wrong and are corrected here:
OPS-19 was described as carrying 42 amendments (it carries 31 rows, highest A-030), and
OPS-16 as 120 amendments (121 unique ids across 124 rows, counting rows that begin with an
amendment id at line start).

## This conversation was already parked once, and drifted

Found while filing this document, and it changes how the park should be enforced.

`90_operations/QUEUE_parked_work_index.md` already carries a row dated 2026-08-05:

> DISCUSSION (post-verdict): HOLISTIC PROCESS REVIEW — not bug-fixing but "are we using
> the best setup, can we make it better, what are we missing." Candidate threads: pipeline
> architecture, instrumentation coverage (what else has no Warden-class check), testing
> strategy (area-sweep certs vs samples), fleet/session model (planner+executor
> coordination cost), data-store topology, tooling, and what an outside architecture
> review would flag. AGENDA ITEM after the verdict review; deserves its own session.

That is the same conversation the operator opened on 2026-09-09, parked thirty-five days
earlier with an agenda that anticipated most of what this document found, and never held.
Its trigger was "after the verdict review," which is a soft condition nobody owns.

The lesson transfers directly to this park. A trigger phrased as a moment in someone's
judgment is not a trigger. The pickup condition below is written as a state that can be
read from an instrument, and it should be re-read as such rather than as a feeling that
the counties are done.

## Pickup conditions

Open this file when all six Central Texas counties are serving in production through the
corrected pipeline, and not before. The consolidation is explicitly parked behind that.

The condition is instrument-readable, not judgment-readable: six of six counties with a
passed production verify walk on the post-`BP-CONTENT-01` grader. Anything short of that
is not the trigger, and the drifted 2026-08-05 row above is what happens when the trigger
is softer than that.

At pickup, in order: re-verify the four memory-sourced rows above; re-decide the fork
against the program's state at that time; then design the county profile record's column
set as the first concrete artifact, because it is the thing the preflight and the
instrumented run both depend on.

The deliverable is one artifact that supersedes the six by status flip, per the
retire-via-status-flip convention. Not a seventh.

```
leave_behind:
  - item: the six-runbook consolidation, parked behind CTX production
    owner: nick
    plan_row: P-124 (unparks on CTX close); needs its own row at pickup
  - item: SC-3 human-hours instrument, never built
    owner: nick
    plan_row: backlog
  - item: four memory-sourced claims requiring re-verification (see provenance table)
    owner: integration
    plan_row: backlog
```
