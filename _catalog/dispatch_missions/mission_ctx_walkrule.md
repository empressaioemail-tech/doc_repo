# CTX-WALKRULE — the bake writes a retirement the walk has no rule to read

Repo: `hauska-factory`.

## Why this exists, stated plainly

This is the integration seat's omission, not a lane's. CTX-RETIRE closed on 2026-09-09
having built `recordRetirement` into the LDT bake, and its close handed the integration
seat a six-rule walk implementation under the key `walkGradingRuleProposal`. The
integration seat then rebuilt and pinned the publish image so the bake writes
`recordRetirement`, and never implemented the walk side.

Measured consequence, live: Caldwell staging walk `716c7ad0` at `pass=85 fail=1`, the
survivor being `48055:1` returning HTTP 422. The prediction that the rebuild would clear
it was wrong for this reason.

So the current state is a mechanism that is built, correct, and unreached, which is the
defect class this whole program exists to stop.

## The six rules, from CTX-RETIRE verbatim

Read `_inbox/2026-09-09_ctx-retire_close.json` key `walkGradingRuleProposal` in full
before implementing. Do not work from this summary alone. Summarised here only so you
know the shape:

1. Read `payload.recordRetirement`. Apply `isEarnedRecordRetirement`, exported from
   `nodeFacetBakeTier1Conformant.ts`, rather than a bare truthy check. Same completeness
   discipline as `isEarnedLeafAbsence`.
2. A row where `isEarnedRecordRetirement` is true grades as its own class, `RETIRED`.
   Never a `BP-CONTENT-01` failure, never silently dropped from any denominator. Report
   `retiredCount` alongside `servedCount`, each with its counting rule stated inline.
3. `BP-CONFORMANT-01` is UNCHANGED. A retired row must still carry
   `facetSchemaVersion === 'node-facets-tier1-conformant-v1'`. This is not a new
   tolerance; it is the existing rule finally being satisfiable for this population.
4. `BP-CONTENT-01` is UNCHANGED at the leaf level. No new tolerance there either.
5. Any coverage or completeness metric computed over a county must EXCLUDE retired rows
   from its denominator, or report retired-versus-live as an explicitly separate split.
   Folding a retired account's necessarily-absent facets into a live coverage denominator
   manufactures a false coverage gap.
6. Prove the recognition check can REJECT a malformed marker before trusting it. A
   payload carrying `recordRetirement: {status:'retired'}` with required fields missing
   must NOT grade `RETIRED`. `isEarnedRecordRetirement` already implements that
   rejection; the walk's suite must exercise it.

Rules 3 and 4 are the ones that matter most and they are both instructions NOT to widen
anything. If your diff loosens either check, you have implemented the wrong thing.

## The 422, which you must diagnose rather than assume

`48055:1` currently returns HTTP 422 to the walk. Two mechanisms produce that and they
need different fixes:

**A.** The retirement is being written and served, and the walk has no rule for it, so it
grades a legitimately retired parcel as a failure. Rule 2 fixes it.

**B.** Something else refuses this parcel entirely and the retirement never reached it.
Historically 422 on this program has meant `ACCESS_NOT_DEFAULTED` at the serve guard.

Determine which, with evidence, before implementing. State the mechanism you chose and
the one you rejected. If it is B, rule 2 will not clear this parcel and reporting it as
fixed would be false.

There is a third thing you should know about this specific parcel and it may matter:
CTX-RETIRE found that `48055:1` is not a well-formed single account at all. `txgio_parcel`
holds 203 distinct features sharing `prop_id = '1'`, and 227 sharing `'0'`, almost
certainly sentinel or bucket ids from the `stratmap25-landparcels` ingest rather than a
real CAD account identity. If this parcel is not an account, then whether it should be
graded at all is a legitimate question, and answering it is in scope. Do not make it pass
by excluding it silently; if it should be excluded, that is a named class with a counting
rule.

## The sampler, which you must not touch

The jurisdiction cohort samples `prop_id` ascending, which biases toward low-numbered and
therefore old or degenerate parcels. That is WHY `48055:1` keeps surfacing. It was
deliberately left unchanged by the retired planner, on the grounds that adjusting a
sampler to avoid a failure it correctly found is sampling around the problem. That
judgement stands. Do not change the sampler.

## Verify by violating

Show the new grading failing before it passes, both runs pasted literally, exit codes read
from the process rather than from a pipe. Rule 6 is exactly this and it is not optional.

Additionally: confirm a row WITHOUT `recordRetirement` still grades exactly as it does
today. A change that alters grading for live rows is out of scope and is a regression.

## What you must NOT do

Do not widen `BP-CONFORMANT-01` or `BP-CONTENT-01`.

Do not exclude any parcel from a denominator without naming the class and its counting
rule.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the image from your merged main and runs the counties.

Do not write to legacy-design-tools, hauska-engine or hauska-map. `isEarnedRecordRetirement`
lives in LDT and reaches this repo through the pinned `_LDT_SHA`, currently `3885efad`.
Import it; do not reimplement it.

Do not touch `cloudbuild.publish.yaml`'s pin.

## Close contract

Standard lane close JSON, plus:

- The 422 mechanism, the one you rejected, and the evidence.
- The disposition of `48055:1` specifically, including whether it should be graded at all.
- Both runs of the rule-6 malformed-marker check.
- Proof that non-retired rows grade unchanged.
- `retiredCount` and `servedCount` counting rules as you implemented them.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs Caldwell from it.
