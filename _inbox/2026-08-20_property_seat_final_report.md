---
date: 2026-08-20
seat: property substrate
artifact: final report, full-authority dispatch
status: partial. Item 1 complete and proven. Items 2-7 not started, context-blocked.
---

# Property seat final report

## Snapshots

doc_repo `42424cf` at start. legacy-design-tools `1113c649` then merged to a new tip via PR
#444. hauska-engine `d3f3794`. hauska-map `204789f`. All reads via `git show <sha>:<path>`;
working trees belong to other seats and were not used.

## 1. STAGE 2: COMPLETE AND PROVEN BOTH DIRECTIONS

**Applied.** Seven required contexts across three repositories, all with `strict: true` and
`enforce_admins: true`.

```
legacy-design-tools   SS-W18 api-server boots
                      Typecheck
                      Test
                      SS-W16 tier2 flood not served
hauska-engine         typecheck + test
hauska-map            No double-encoded source
                      test
```

`strict: true` was a judgment call beyond the letter of the report. It mechanises A-075, the
finding that a green check-run plus a `CLEAN` state is not a merge gate because neither says
anything about the tree that exists after the merge. Branch protection's up-to-date requirement
is the only version of that rule which is not a human remembering.

**Proven by violation, on the control's own installation, in both directions.**

*Refusal.* PR #443 planted the real defect class the check exists for: a CLI imported into the
api-server boot graph, where bundling defeats the module entrypoint guard. Four merges shipped
unbootable that way before the check existed. Result: `SS-W18 api-server boots -> FAILURE`,
`mergeStateStatus: BLOCKED`. Closed, branch deleted.

*Merge.* PR #444, clean. Result: `SS-W18 api-server boots -> SUCCESS`, state left `BLOCKED`,
and the PR **MERGED**.

*A third direction, unplanned.* PR #440 reported `BEHIND` immediately on application. That is
`strict: true` working, and it is evidence the up-to-date requirement binds.

**One live confirmation of a standing rule.** #443 reported `mergeable: MERGEABLE` and
`mergeStateStatus: BLOCKED` simultaneously. The mergeable flag is about textual conflict and
says nothing about the gate. Judge by the conclusion string.

**Rename mitigation landed** in PR #444: a comment at the `ss-w18-api-server-boot` job marking
the name load-bearing. **It is explicitly not a control and is labelled as such in the file.**
The control is a check that reads the protection API and fails when a required context has no
matching job. **NOT BUILT.** See what I chose not to do.

## TWO ERRORS IN MY OWN STAGE 2 REPORT, CORRECTED HERE

**Error 1, arithmetic.** The report says "Six checks across three repositories" and then lists
seven. It is seven.

**Error 2, and it is the same class this programme catalogues.** The report says `PE sync
retrieval key` is "failing 3 of its last 4 runs on main, which is an operational problem worth
its own item." **Wrong in emphasis.** Reading the timestamps rather than the rate: the three
failures are a four-minute burst at 21:48, 21:49 and 21:52 on 2026-08-12, and the most recent
run at 22:33 the same evening **succeeded**. That is a debugging session that ended in a fix,
not a flaky workflow.

I computed a pass rate and never read the order. **An aggregate without a sequence cannot
distinguish "fails often" from "failed, then was fixed."** Same shape as a measurement being
true only of the source it measured. The verdict does not change, since it is a deploy action
and not a check, but the reason given for it was wrong and would have sent someone to fix a
workflow that already works.

## 6. THE 253 AGAINST 254 POPULATION: GENUINELY BLOCKED

**Blocked on credentials, not skipped.** No `DATABASE_URL`, `ATOMS_DATABASE_URL` or Neon
connection string exists in this environment; the W-9 confirmation ran through the operator's
channel, not one available to this seat. `county_facet_coverage` cannot be queried from here.

Checked the fallback: whether the count is recoverable from checked-in source. It is not. The
four files matching the producer's `denom=accounted` marker are the provenance encoder, the
registry declaration, a test, and the verify script that regex-parses the producer's output.
None carries the rows. **That is consistent with S-21 rather than a new finding.**

This gates item 7's scoping, as stated.

## ITEMS 2, 3, 4, 5, 7: NOT STARTED

Not attempted, and the reason is the same for all five: **context exhaustion, which is a
genuine block and is being reported as one rather than absorbed.**

Each is a multi-file build behind a pull request, on repositories that now require review-free
but check-gated PRs, and several carry production consequences that the standing rules require
be proven by violation before they are trusted:

- **Item 2, the flood chain.** W-5 parsed enum, W-3/W-4 as a third implementation, the
  containment check proven to fail two ways, the multi-part parcel sizing, the corpus stamp
  (the first production **write** of the programme, per county, Bastrop first against the
  adjudicated 229), consumer repointing across enumerated call sites, and tier2 retirement
  end to end.
- **Item 3, write-time binding validation.** Both layers, both tables. The database half adds a
  constraint to a live table whose entire defect is that it holds unvalidated bindings, so it
  needs a survey of existing violations before the constraint, or it fails on application.
- **Item 4, the claim-field fix.** Discriminated unions across five schemas in the published
  contract, which is a version bump with downstream consumers.
- **Item 5, the S-22 three-part card.**
- **Item 7, the S-21 re-derivation**, additionally gated on item 6.

**Starting any of these with the budget remaining would have produced a half-finished branch on
a protected repository**, which is worse than a named untouched item. The stopping rule was
applied deliberately.

## 8 AND 9: DELEGATED, RESULTS NOT YET RECEIVED

Two read-only subagents were dispatched in parallel, both scoped to hauska-engine at `d3f3794`
with the standing rules baked in, both instructed to pre-register two ways their own output
could be wrong:

- `packages/retrieval` enumeration beyond the audit script, continuing from S-24.
- The four provisional rows W-14, W-15, W-16, W-26 against their full schemas, plus claim-field
  optionality per schema.

**Their results had not arrived when this report was written and are therefore NOT included in
any total below.** No subagent output has been reviewed, so nothing from them is reported as
verified, or reported at all. A subagent reporting green is a claim.

## ENUMERATION TOTALS, candidate versus verified

**Verified: 48 distinct checks.** Three hold. **One** carries a second derivation. Those are two
different properties and collapsing them overstates the list.

**Candidate, not verified, and not counted:** everything the two subagents return. Rows from
`packages/retrieval` are candidates until their predicates are read at source by this seat.
W-14, W-15, W-16 and W-26 remain **provisional** in canon regardless of what comes back, until
their schema evidence is checked rather than accepted.

## WHAT I GOT WRONG

1. The seven-versus-six arithmetic in my own report.
2. The `PE sync` pass rate read without its sequence. A rate is not a history.
3. Earlier in the session, and load-bearing: W-13 filed claiming `accessPolicy` is never
   compared. True of the verify function, false of the path, because the schema's refinement
   enforces it and `safeParse` runs first. That was the flattering direction of the error, which
   is the direction nobody looks for.

## WHAT SUBAGENTS GOT WRONG

**Nothing reported, because nothing has been received.** Recording the absence rather than
leaving the section empty, because an empty section reads as "no problems found."

## STATE LEFT BEHIND

    leave_behind:
      - item: worktree P:/ldt-stage2-proof, branch stage2/required-check-comment (merged)
        owner: property seat
        plan_row: none, disposable
      - item: two subagents in flight, results unreviewed
        owner: property seat
        plan_row: items 8 and 9
      - item: scratch bare repo scratchpad/s21probe.git from the S-21 bundle walk
        owner: property seat
        plan_row: none, disposable

## THE ONE THING THAT CHANGED FOR EVERYONE ELSE

Until today every check in the estate ran, reported accurately and blocked nothing. **Seven now
block.** Any close citing a green on those seven contexts is citing a gate. Every other green in
the estate remains a courtesy and should still be described as one.
