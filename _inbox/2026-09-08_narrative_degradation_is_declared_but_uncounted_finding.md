---
id: 2026-09-08_narrative_degradation_is_declared_but_uncounted_finding
title: The feasibility narrative degrades to skeleton with a declared reason that nothing counts
date: 2026-09-08
last_updated: 2026-09-08
status: open
applies_to: hauska-engine
plan_rows: [P-120]
seat: integration (doc-repo-79)
owner_needed: operator to route (engine-api is not the integration seat's repo)
severity: customer-facing-silent
snapshot:
  engine_api_serving: hauska-engine-api-00189-cej
  digest: sha256:a00b491729ddf632915c52d2a4a68f73b7132695b3ff1bd03ef5f39d4e2a7be1
  measured_at: 2026-09-08T22:30Z
related:
  - _inbox/2026-09-08_PARKED_hauska-engine-api_p120_production_deploy.md
---

# The narrative degrades with a reason, and nothing counts the reason

## The shape, stated precisely because the obvious framing is wrong

The feasibility export's narrative can fall back to the deterministic skeleton at request time.
When it does, the served atom carries `narrativeIsDeterministicSkeleton: true` and a
`narrativeFallbackReason` naming which of four things happened (`not-configured`, `http-error`,
`request-failed`, `no-cited-sections`).

**So this is NOT an undeclared degradation.** The reason is in the output, which is the half that
`ENFORCEMENT.md` actually requires: "degradation is permitted only when declared in the output."
That part is built and correct.

**What is missing is that nothing counts it.** No log line, no metric, no aggregate. A
degradation that is declared per-response and aggregated nowhere is invisible in exactly the way
an undeclared one is, because nobody reads one response at a time.

Getting this distinction right changes the fix. Scoped as "the narrative fails silently" it
invites adding a reason field that already exists. The actual work is a log line carrying the
reason and the sub-call duration, and something that counts them.

## How it surfaced

The r05 lane (doc-repo-55) deployed a 0%-traffic canary and smoked TWO counties instead of one,
on advice from this seat that a single parcel proves only that parcel. Result:

    canary  48021:52726 Bastrop    201  narrative LIVE, 15 cited, 12 pages
    canary  48055:20478 Caldwell   201  SKELETON, request-failed, 0 cited  (3 of 3 attempts)
    prod    48055:20478 Caldwell   201  narrative live, 7 cited, 17.0s

Bastrop passed. Bastrop is the operator's report parcel and would have been the one-parcel
choice. Traffic would have shifted, and the first anyone would have known is the operator opening
a Caldwell report and finding skeleton prose.

The cause was the lane's own: it widened `buildNarrativeFacts`, tripling the payload sent to
cortex-api's `/research/narrative-section` — an endpoint it does not own — which slowed
generation past the client's 20s timeout so the fetch threw. Fixed in `9460076` / PR #411, with
the wide payload moved to a separate in-process builder and the LDT-facing builder pinned by a
frozen-list assertion. That fix is not what this finding is about.

**`request-failed` being a throw rather than an HTTP status is what ruled out a body-size or
schema cap on the cortex-api side.** That is a real second derivation rather than the first
plausible story, and it is why the diagnosis can be trusted.

## Production is not currently degrading

Measured from this seat rather than taken on report, one parcel per county, against the
production base URL on the serving revision:

    48021:52726  Bastrop     201  21.3s  skeleton=false  reason=null  cited=10
    48055:20478  Caldwell    201  20.2s  skeleton=false  reason=null  cited=10
    48209:135570 Hays        201  25.1s  skeleton=false  reason=null  cited=7
    48309:176914 McLennan    201  41.0s  skeleton=false  reason=null  cited=9
    48491:76149  Williamson  201  22.5s  skeleton=false  reason=null  cited=9

So the regression was caught before traffic moved. This finding is about what would have happened
if it had not been.

## The latency envelope, which is the related open question

A 2x spread (20.2s to 41.0s) on the same code path with no failures. McLennan at 41s is the one
to watch. If the narrative sub-call scales with that spread, a 20s client timeout is not
comfortable, it is surviving — and the only latency currently observable is the whole request, so
nobody can distinguish a 3s narrative from an 18s one. An 18s narrative passes today and fails on
any slower day, and the failure will look like a data problem.

This is the same shape as the verify-walk sweep defect found the same day: a measurement that
cannot distinguish "fine" from "about to fail" reports the same thing in both states.

## What executes / triggers / fails

Per the three-question gate, for whoever takes this:

  executes  a log line in the narrative path carrying `narrativeFallbackReason` and the
            sub-call duration on BOTH success and failure, plus something that counts them
  triggers  every feasibility export request
  fails     nothing today, and that is the point -- a counter alone is not a control. If the
            fallback rate is meant to be near zero, something has to refuse or alert when it
            is not, or this is a dashboard nobody opens.
  bypasses  a fallback that happens before the log line is reached; and the counter itself
            being unmonitored, which is the failure mode this finding already describes one
            level up

## Open

Ownership. `engine-api` is hauska-engine and `cortex-api` is legacy-design-tools; the integration
seat owns neither, so this is filed and routed rather than fixed here. The r05 lane surfaced it
and deliberately did not fix it inside an unrelated change, which was the right call.

Whether the 20s client timeout is correct at all. Not measurable from outside; needs the sub-call
duration logged first, which is the same work item.

Whether any OTHER declared-but-uncounted degradation exists on this path. Not swept. The pattern
is "a field naming a fallback reason, with no aggregation", and it is worth grepping for once
rather than discovering one at a time.
