# CTX-FAMILIES — six fact families reach no consumer, and three of them are already built

Repo: `hauska-engine`.

This is the highest-return work available on this program right now, and it is the only
lane that makes the product answer MORE rather than answer honestly. It is blocked on no
county, no bake, and no other lane.

## The measurement, which you must reproduce before you trust it

`_inbox/2026-09-08_six_fact_families_reach_no_consumer_finding.md`, measured on serving
revision `hauska-engine-api-00193-xex` by two seats independently, invariant across
Bastrop, Caldwell, Williamson and Hays:

    utilities           failed-this-run
    dischargePoint      out-of-scope
    floodplainAcreage   failed-this-run
    firmPanel           failed-this-run
    soil                out-of-scope
    electricProvider    out-of-scope

`gasProvider` is also invariant at `blocked-at-source` but was RULED permanently
unacquirable on 2026-09-03. It is an honest declared absence and is NOT in scope. Do not
count it in any tally here; it looks identical from the instrument and has been
miscounted before.

**Production has moved since that measurement.** The serving revision is now
`hauska-engine-api-00198-cir`, digest `sha256:2af8119c`, built from engine `f2535f4` by
Cloud Build `7a11d9e6`. It went to 100 percent without a recorded traffic shift and the
integration seat has identified but not accounted for it. Re-run the `absentFields`
instrument against the CURRENT serving revision before doing anything. If the six are no
longer six, that is the finding and you report it instead of the mission.

## The two classes are different defects with different fixes

`out-of-scope` means the resolver is not reaching the route at all despite being
described as armed. That is the A-120 shape this program has now hit at three distinct
levels: merged with no caller, dispatchable with nowhere to execute, and reached-but-not-
routed. **soil, electricProvider, dischargePoint.**

`failed-this-run` means the resolver IS reached and is failing live. A working mechanism
with a broken input. **utilities, floodplainAcreage, firmPanel.** NFHL reads are failing
right now.

Do not report these as one number and do not fix them as one change.

`floodplainAcreage`, `firmPanel` and `soil` are three of the five fact families merged as
engine PR #404 on 2026-09-07. Built, tested, reaching nobody. Read that PR before you
write anything; the code is probably correct and the wiring is probably the whole defect.

## The work

1. Reproduce the classification against the current serving revision. Report agreement or
   disagreement with the four-county invariance above.

2. Wire the three `out-of-scope` families to the feasibility route. For each, state what
   the missing link actually was in one sentence, because the pattern across three
   instances is worth more than the three fixes.

3. Fix the three `failed-this-run` live reads. `floodplainAcreage` and `firmPanel` both
   read NFHL; establish whether that is one failure or two before fixing it as two.

4. For every family you touch, confirm it reaches a real parcel on a real route and
   produces a real value or an honest declared absence. A family that moves from
   `out-of-scope` to `failed-this-run` has not been fixed.

## The gate this lane is now measured against

The operator ruled on 2026-09-09 that the Feasibility report is a launch surface
alongside the map. That makes this lane a launch blocker, and it sets the target:

**Zero families in `out-of-scope` or `failed-this-run`.**

Those two classes mean either we have the answer and are not delivering it, or the
mechanism is broken. `blocked-at-source` and ruled absences are honest and are the
product working as designed. The target is not "thirteen values"; it is that every
absence a customer sees is a true one.

## The second finding in that document, which constrains how you report

Same revision, back to back: Caldwell resolved 8 absences across 10 cited sections in 12
pages; Williamson 13 absences, 9 sections, 8 pages; Hays the same as Williamson. A
Williamson report is a third shorter than a Caldwell one.

The lane that found the six families first reported them as route-level on the strength
of two counties agreeing, while the disproof was already sitting in its own smoke output.
Its own correction:

> "I did not have too little data. I had the disproof in hand and did not compare it."

Two counties agreeing is not evidence of invariance. When you claim any behaviour is
route-level rather than jurisdiction-varying, name the counties you compared and compare
the whole return, not the fields you already believed were route-level.

## Operator ruling you are implementing, 2026-09-09

The report's disclosure of what it could not answer goes in `absentFields`, surfaced to
the customer, rather than a separate banner. This carries one condition and it is yours
to honour: **a customer must never see "we could not determine this" for a family whose
resolver simply is not wired.** That is why the two broken classes must be empty before
that surfacing is trustworthy. If you surface `absentFields` while `out-of-scope` is
non-empty, the product lies politely.

## What you must NOT do

Do not deploy, do not shift traffic, do not run a Cloud Build. The integration seat owns
every execution and deploy on this program, including this one.

Do not write to legacy-design-tools, hauska-factory, or hauska-map.

Do not touch `gasProvider`.

Do not make a family "resolve" by widening a check or defaulting a value. A family with
no data refuses with its reason. Per `ENFORCEMENT.md`, degradation is permitted only when
declared.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- The `absentFields` classification per family, before and after, on a named revision.
- One sentence per `out-of-scope` family on what the missing link was.
- Whether the NFHL failures are one root cause or two, with evidence.
- The counties you compared for any invariance claim.
- `leave_behind`.
