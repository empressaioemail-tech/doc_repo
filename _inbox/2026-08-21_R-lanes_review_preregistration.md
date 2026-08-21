---
id: 2026-08-21_r_lanes_review_preregistration
title: Pre-registered predictions for the five OPS-18 lane returns
status: active
last_updated: 2026-08-21
applies_to: portfolio
owner: nick
related: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _blueprint/00_WDLL]
---

# Pre-registration — what I expect the five lanes to get wrong

Written and committed at doc_repo `4b174d1`, **before any lane has returned**. Filed rather
than said in chat, because a prediction that can be adjusted after the fact is not a
prediction, and this programme has documented that shape twice already.

The point is not to be right. A wrong prediction is more informative than a vague one, and
the honest outcome to record is the score, including misses. If a lane returns something I
did not anticipate at all, that is the most useful result available and it says my model of
the failure modes is thinner than I think.

## Why pre-register a review at all

Every instrument this programme produced exhibited the defect class it was built to measure,
reliably, and the only thing that ever caught it was the author auditing their own tool under
the same rules applied to the subject. I am about to review five returns. Without a
pre-registered band I will grade them against my impression after reading, which is the
adjudication equivalent of measuring output with the predicate that admitted the defect.

## R-01 blueprint

1. **It produces a design document rather than a wiring register.** The mission says this is a
   wiring exercise three separate ways and I still expect proposals for things to build.
2. **D1 will index only markdown.** The published `@empressaio/atom-contract` type surface is
   the one artifact here that refuses to compile and therefore the most authoritative thing in
   the estate. I expect it to be treated as implementation, not canon, and left out of the mesh.
3. **D2 will be answered by synthesis rather than by ruling.** A single coherent model stated
   without saying, for each of the four framings, adopted / adopted in part / superseded and
   why. Silence on any of the four is a fail and I expect at least one silence.
4. **D4 will be uneven.** The four wrong-value violations (V2, V4, V6, V13) will get crisp
   demonstrations. The starvation ones (V1, V8, V11) will get prose that asserts the blueprint
   would catch them without naming the rule id and the failing sentence.

## R-02 doc census

1. **The `consumer` field will be too generous.** Documents will be graded CITED or ROUTED
   that are actually NONE. NONE is the expected answer across most of the estate and reads as
   a failure to an agent trying to be useful.
2. **HOOK and CI will be established by grep rather than by reading loaders**, despite the
   mission forbidding it, because enumerating loaders is slower and a grep hit feels like proof.
3. **It will quietly adopt my numbers.** I gave 1,108 and 365 and 20. If its own method
   produces something different I expect reconciliation to my figure rather than both numbers
   reported with their methods.

## R-03 parts inventory

1. **Termination conditions will be NONE wearing prose.** "When superseded" and "when no
   longer needed" have no executor. I named that trap in the mission and still expect several.
2. **UNKNOWN will get rounded.** Parts that are hard to probe will land as LIVE or DORMANT on
   inference rather than being left honestly unmeasured.
3. **The inventory will miss the parts nobody names.** Background jobs, leases, heartbeats and
   detached runners. `_STATE.md` mentions several in passing and they are the likeliest zombies
   precisely because no document owns them.

## R-04 control census

1. **`bypass` will read "none" on at least two controls.** It is the highest-value field and
   the hardest to fill, and "none" is almost always wrong.
2. **`derivationClass` will be inflated.** Checks whose two sides come from one artifact will
   be graded two-independent-sources.
3. **The enumeration will not reach past the directories I listed.** I gave it a list, which
   makes the list a ceiling. The measure of the pass is whether it finds a control I did not name.

## R-09 gate repair, the one I most expect to go wrong

1. **It will report success without making an indicator fire.** It will read the write path,
   conclude the field could take another value, and present that as the result. The done
   condition is a firing with a live payload and a cell id. This is the single most likely
   failure in the whole set and it is the exact shape of the 5,714-of-5,714 harness.
2. **It will conflate the three mechanisms.** Hand-declared, erased in transit, and starved
   have different fixes, and the evidence for each lives in a different place.
3. **Scope creep.** `railCapabilities` scoring against 254, the Bastrop zoning cell carrying
   the envelope measurement, the absent recompute route. All three are fenced as context and
   all three are more satisfying to fix than the actual row.

## Cross-cutting, any lane

Any lane may report a clean result on a population it could not have measured. The
distinguishing question for every return: what could this pass NOT have found, and is that
list stated? An unread path is work remaining; an unobservable population is a permanent
limit. A return that does not separate them reads as nearly complete when part of it is
unmeasurable by construction.

## How this gets scored

When the returns land I record, per prediction: FIRED, DID NOT FIRE, or NOT APPLICABLE, with
the evidence. Misses are recorded as misses. The score goes in the review close, not here, so
this file stays a prediction rather than becoming a result.
