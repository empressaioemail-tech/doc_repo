---
id: 2026-09-08_situsstate-bare-null-blocks-every-county_finding
title: baseFacts.situsState is a bare null on 312,169 parcels across all six counties, and it blocks every bake
date: 2026-09-08
last_updated: 2026-09-08
status: open
applies_to: legacy-design-tools
plan_rows: [P-124]
seat: integration (doc-repo-79)
severity: blocking
owner_needed: property seat (legacy-design-tools)
snapshot:
  hauska_factory: f2738e1
  ldt_pinned_sha: 65f924e86fd4060a439300ea51271ad8a56f9a44
  store: f06-staging-neondb (ep-gentle-star-appmbu2q)
  measured_at: 2026-09-08T18:30Z-19:05Z
related:
  - _inbox/2026-09-08_envelope-decline-flattened-to-null-on-serve_finding.md
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# The bake writes a bare null for situsState, and the new content grade found it

## What happened

With the verify walk corrected (hauska-factory `f2738e1`), the Caldwell staging walk went from
60 content failures out of 60 to **one**. `BP-MEANING-01` now passes 59 of 59. The single
remaining failure is real, and it is not a walk problem.

    parcel 48055:19512
      baseFacts.situsAddress   "821 PLUM ST"
      baseFacts.situsCity      "LOCKHART"
      baseFacts.situsZip       "78644"
      baseFacts.situsState      null        <-- fails BP-CONTENT-01

A complete Lockhart, Texas address whose state is a bare null. Not `absent-verified`, not
`not-applicable`, not `refused`. A null, which is none of the four states the grade admits.

**This is the gate working.** The refusal is correct and must not be relaxed.

## The write path, read rather than inferred

`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts` at the pinned SHA, line 555:

    situsAddress: input.situsAddress,
    situsCity:    claim.situsCity,
    situsState:   row?.situs_state ?? null,      <-- here
    situsZip:     claim.situsZip,

Every other situs field comes from the CAD claim. `situsState` alone comes from `row`, the
TxGIO parcel join. When that join misses, `?? null` silently supplies a bare null.

`cad_property` has **no `situs_state` column at all** (its situs columns are `situs_address`,
`situs_city`, `situs_zip`). So there is no CAD fallback and never was.

This is the fail-closed rule inverted: a default supplied for a field whose correct value was
not resolved. `ENFORCEMENT.md` names it exactly - "if you find yourself writing a fallback so
the code does not raise, stop."

## Scope: all six counties, and Bastrop is already in production

Measured against the staging store, tier1 rows:

    county        total      situsState null    of which a real street address exists
    Bastrop       77,799     31,866  (41.0%)    28,887
    Caldwell      48,649     23,891  (49.1%)     8,598
    Hays         173,050     44,803  (25.9%)    41,799
    McLennan     114,255      1,199  ( 1.0%)     1,199
    Travis       500,307    119,389  (23.9%)   117,854
    Williamson   602,050     91,021  (15.1%)    91,002
    -------------------------------------------------------
    TOTAL                   312,169             289,339

**No county is baked around this.** McLennan is the cleanest at 1.0%, and the walk's 61-parcel
sweep still has roughly even odds of drawing one. There is no honest route to a passing walk
for any county until the bake changes.

**Bastrop is live in production carrying 31,866 of these.** It passed its walks on 2026-08-28
and 2026-08-29 because `BP-CONTENT-01` did not exist yet - those walk bodies carry only
`BP-MEANING-01` and `BP-VERIFY-01`. The grade is new; the defect is not.

## Two populations, separated by real overlap

`{envelope is null}` is a strict SUBSET of `{situsState is null}`. Tested by member, not by
count, after the first attempt used the wrong JSON path (`facets.envelope`; `envelope` is
top level) and returned a vacuous 100 percent containment that had to be thrown out.

    county        state null   envelope null   both     state-only   envelope-only
    Caldwell        23,891        23,660      23,660       231            0
    Travis         119,389       119,389     119,389         0            0
    Williamson      91,021        91,021      91,021         0            0
    Bastrop         31,866        15,542      15,542    16,324            0

`envelope-only = 0` everywhere. The decomposition that explains it:

**(a) The TxGIO parcel join missed.** No row, so no polygon and no `situs_state`. Both fields
null. This is the whole of Travis and Williamson.

**(b) The join hit, and the TxGIO row's own `situs_state` is empty.** An envelope exists;
`situsState` does not. Bastrop 16,324, Caldwell 231, and zero in Travis and Williamson.

The two cases need different honest answers, which is why the distinction matters rather than
being trivia.

## This supersedes the "second defect" in the envelope finding

`_inbox/2026-09-08_envelope-decline-flattened-to-null-on-serve_finding.md` recorded the bare-null
envelope population as its own separate defect. It is not separate. It is case (a) of this one,
seen through a different field. One root cause, two symptoms, and the envelope counts in that
finding are the join-miss counts.

## A third, much smaller defect in the same field

Six parcels across the six counties carry a served `situsState` that is not `TX`: Caldwell
`ST` x3, `TE` x1, `TN` x1, and McLennan `TN` x1. `ST` and `TE` are not states at all. These are
TxGIO source values passed through unvalidated.

Six is a rounding error and is reported as six. It matters only because it shows the field is a
raw passthrough with no check, and because it argues for the fix below.

## Recommended fix, for the owning seat to weigh

**Derive `situsState` from `countyFips` rather than from the TxGIO join.** The situs is the
property's physical location, which is inside the county by definition, and the county FIPS
prefix `48` **is** the state. This is not an inference from missing data; it is the same order
of certainty as `countyName`, which the bake already derives this way.

It resolves both null populations and the six wrong values in one change, and it removes a
dependency on a join that has no business supplying a fact it does not own.

Mark the provenance derived rather than sourced, so the change is visible and no later reader
mistakes it for a CAD field.

**If the owning seat rejects the derivation**, the fallback is a declared absence per case:
`absent-verified` for (b), since the TxGIO row was consulted and carried nothing, and a named
`refused` for (a), since no TxGIO row existed to consult.

### Why the 2026-09-05 join-miss ruling does not reach this

`_decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md` is active and rules that a
genuine join-miss against `cad_property` emits `absent-verified` rather than staying
`unaccounted` forever. Read quickly it looks like it authorizes `absent-verified` for case (a)
here. It does not, and the reason is worth stating because the next reader will hit the same
apparent collision.

That ruling is scoped to a `cad_property` join in hauska-engine's `ingest-existing.ts`, keyed
county+propId across every tax year. Its argument is that the query genuinely looked, so a miss
is a confirmed absence of the row - and **CAD is the authority for the facts CAD carries**.

`situsState` fails that test on both halves. It is a different join (TxGIO, not `cad_property`,
which has no `situs_state` column at all), and TxGIO is not the authority for what state a Texas
parcel sits in. A TxGIO miss establishes "this system holds no TxGIO polygon record for this
parcel" - a fact about our store, not about the world. The situs state of a Caldwell County
property is TX whether or not TxGIO has a row.

`absent-verified` is a claim that the fact does not exist. Asserting it here would say a
Lockhart parcel has no situs state, which is false. The 09-05 ruling holds exactly where
absence-of-row means absence-of-fact; this is not that.

The 09-05 ruling's own reversal criterion anticipates a neighbouring case - a population whose
miss means something other than genuine absence gets a population-scoped guard rather than the
blanket reversal. Its author declined to extend it uncritically, and this is the kind of
population it had in mind.

This also sharpens why derivation is the recommendation rather than a shortcut. The value is not
unknown. It is resolvable exactly, from a field already on the record. Both `absent-verified`
and `refused` assert we cannot know something we can, which makes them the LESS honest answers
here, not the more cautious ones.

**What must not happen at all** is removing `baseFacts.situsState` from the required paths, or
admitting null as a fifth state. The leaf is required on the bake side too and the served value
is genuinely missing.

## What this blocks

P-124's staging-then-production sequence, for all six counties, at the walk. Nothing downstream
of the walk has been reached.

Not blocked and already proven: the population gate, the rail gate, the cadRoll post-condition,
`BP-MEANING-01` (59/59), and `BP-VERIFY-01`.

## Open

The LDT change itself. Not mine to make - integration seat owns no product repo. Dispatch
compiled for the property seat.

Whether Bastrop's live production rows get re-baked or left, once the fix lands. Operator call,
and it is the reason this is filed as blocking rather than routine.

## Swept, and it is only this one leaf

The same-shaped question was asked rather than left open. The TxGIO join `row` is read in
exactly three places in that file:

    555:  situsState:            row?.situs_state ?? null          <-- required leaf, bare null reaches it
    568:  zoningDistrictRaw:     row?.zoning_district ?? null
    569:  zoningJurisdictionRaw: row?.zoning_jurisdiction ?? null

The two zoning reads feed the `zoning` facet, which is also a required leaf but wraps them in a
declared shape instead of passing the null through - confirmed empirically, since `zoning`
graded clean on all 61 sweep parcels in the same walk where `situsState` failed.

So one leaf, one line. The fix is correspondingly small.
