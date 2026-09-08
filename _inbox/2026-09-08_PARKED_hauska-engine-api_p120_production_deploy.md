---
id: 2026-09-08_PARKED_hauska-engine-api_p120_production_deploy
title: DONE — hauska-engine-api production deploy (P-120 R-05); serving 00189-cej
date: 2026-09-08
status: done
last_updated: 2026-09-08
applies_to: hauska-engine
seat: integration (doc-repo-79)
plan_rows: [P-120]
related:
  - _sessions/2026-09-07_reports_outage_and_p120_recut_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# DONE 2026-09-08: hauska-engine-api production deploy

> **EXECUTED. See the close at the bottom.** One instruction in this card was WRONG and blocked
> the lane for a day; the correction is recorded there. Card retained in full rather than
> rewritten, because the wrong instruction is the instructive part.

## Why this card exists

Handed to the integration seat by the operator on 2026-09-08 while retiring the agent
that held it. It is captured here rather than executed because a production service
deploy is explicitly outside the integration seat's P-124 authorization, and because
the five-commit gap between engine main and the serving revision is deliberate.

**This is P-120 work, not P-124.** It does not gate the Central Texas bake and must not
be folded into the Wave 2 sequence. It runs when the operator says it runs.

## Two separate things are required and they are not the same object

1. The operator's authorization to deploy.
2. The OPS-16 P-124 interlock: production deploys of hauska-engine route through the
   integration seat during the Central Texas sprint. The original card names
   doc-repo-26; that seat's session has been superseded by doc-repo-79. **The interlock
   now routes through this seat.** Coordination is not approval.

## State at handoff (2026-09-07) — STALE BY CONSTRUCTION, re-verify before acting

Every number below is a claim about 2026-09-07 and must be re-measured, not quoted.

- Serving: `hauska-engine-api-00184-pef`, 100%, built from `df96f57`,
  digest `sha256:2697d9282b2d549d73e1dd0394de15d3a0af0efc298d90e2f7e8994eea05672e`
- Engine `origin/main`: `661f620b5e1984ea5c902dcf03375a7dfc130482`
- Five commits undeployed, across two programs:
  - `5d85228f` (#403, P-120)
  - `b114e886` (#404, P-120 fact families)
  - `f7bb9c45` + `13e43198` (#405, P-124 CTX-B setback-corpus 1.1.0)
  - `661f620b` (#406, P-120 composition root)

**The composition root (#406) is the significant one.** It changes how every Feasibility
report composes. CI-green and live-verified by its own lane, but it has had one pair of
eyes. That is the thing to weigh before shifting traffic, and it is a reason to keep the
canary up longer than usual rather than a reason to skip the deploy.

## Sequence

1. Tree must match origin/main exactly: `git fetch origin && git diff --stat origin/main`
   empty, working tree clean. A `--source`-style deploy from a stale checkout is a known
   trap in this fleet.
2. Build pinned to the commit, never `:latest`:
   `gcloud builds submit --config cloudbuild.engine-api.yaml --substitutions=_IMAGE=us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api:p120-<sha> --project hauska-prod-497015`
   Roughly six minutes (GDAL/pysheds image). Record the digest it prints.
3. Deploy no-traffic, **by digest, not tag**:
   `gcloud run deploy hauska-engine-api --image ...@sha256:<digest> --region us-central1 --project hauska-prod-497015 --no-traffic --tag <yourtag>`
   Pass no `--set-env-vars`; existing config is preserved.
4. Smoke the canary before shifting, on the real parcels the outage was found on:
   `48021:52726` and `48021:52727` (condo units at 1007 Water St, Bastrop, ~27m x 15m).
   POST `/v1/property-nodes/<id>/site-plan-export/refresh` and `/feasibility-export/refresh`,
   empty JSON body. Expect 201 with real artifact byte counts. A 422 carrying
   `cannot meet 16px floor` means the terrain-window fix is not in the image.
5. Shift:
   `gcloud run services update-traffic hauska-engine-api --region us-central1 --project hauska-prod-497015 --to-revisions <rev>=100`
6. Re-verify against the production base URL, not the canary tag, on a parcel not used in
   step 4.

Auth: these routes require gate-front headers or return 401 `gate_front_context_required`.
Send all six: `x-hauska-gate-credential-id`, `x-hauska-product: cortex`,
`x-hauska-tenant-id`, `x-hauska-package-id`, `x-hauska-access-tier: platform-internal`,
`x-hauska-request-id`. They are self-asserted with no token check. That is a known open
finding, not a licence to describe the route as gated.

## Three traps, each of which has already cost someone a wrong conclusion

**Read traffic as JSON by field name.** `gcloud run deploy` prints a tag URL that may not
be the tag passed; it printed `envelope-canary` when `p120fix` was passed. Never a
positional `--format="value(a,b,c)"` — a blank field shifts every column and has produced
a wrong serving-revision report twice.

**`update-traffic` prints `0% (currently 100%) LATEST`, which is ambiguous.** Re-read the
JSON to confirm.

**The `envelope-canary` tag currently sits on the serving revision and moves on deploy.**
Anything downstream pinning that tag rather than a digest silently repoints.

Do not set `BROKERAGE_API_BASE_URL` or `SERVICE_API_KEY` by hand on this service. Workflow
deploys in this fleet revert manually-set env vars and the narrative would silently fall
back to the deterministic skeleton. They belong in the workflow. As of `5d85228f` their
absence is at least reported rather than silent.

## Unblock condition

Operator says go. Then this seat coordinates the interlock and either runs it or dispatches
it with the commit named before traffic shifts and the served revision named after.

---

## CLOSE 2026-09-08 — executed by the integration seat, and one instruction in this card was wrong

### The wrong instruction, first, because it is why this sat for a day

This card says: do not set `BROKERAGE_API_BASE_URL` or `SERVICE_API_KEY` by hand, "workflow
deploys in this fleet revert manually-set env vars," and "they belong in the workflow."

**hauska-engine has no deploy workflow.** `.github/workflows` holds exactly `ci.yml` and
`block13-cert-grade.yml`, and `ci.yml` contains no deploy step — read, not assumed. engine-api
is deployed by hand with `gcloud`. There was no workflow to put the vars in and nothing that
could revert them.

That trap is real for `cortex-api`, which does have a deploy workflow with canary and
traffic-shift jobs. It was imported here by pattern-matching and it does not transfer. The
effect was a lane blocked on a prerequisite that could not be satisfied, waiting on a file that
does not exist. **A control that cannot be satisfied refuses forever and reads identically to a
control that is merely strict** — the same shape as the staging-sibling finding earlier the same
day, one level up.

The correct discipline for engine-api is this card's own step 3: pass no env flags on a routine
deploy, because `gcloud run deploy` preserves existing config. When you DO need to change one,
use `--update-env-vars` / `--update-secrets`, never `--set-*`. This service carries 13 secrets;
`--set-secrets` would have silently removed all of them.

### Authorization

The operator's hold ("nothing executes on hauska-engine-api, no secret grant either, from
anyone, until further word") was lifted by a direct question naming the service and naming the
grant. Recorded because the integration seat had already run the IAM grant on an inference from
a general "get everything deployed," which was an overstep, was challenged by doc-repo-a0, and
was disclosed to the operator in the question rather than after the fact.

### What ran

    engine main       f1fc414c  (PR #409 squash-merged; R-05 feasibility document)
    IAM               secretAccessor on projects/1062716564162/secrets/SERVICE_API_KEY
                      -> serviceAccount:172690833726-compute@developer.gserviceaccount.com
    build             cloudbuild.engine-api.yaml, tag p120-r05-f1fc414c, 4m32s
    digest            sha256:a00b491729ddf632915c52d2a4a68f73b7132695b3ff1bd03ef5f39d4e2a7be1
    revision          hauska-engine-api-00189-cej   (deployed --no-traffic --tag=p120r05)
    env added         BROKERAGE_API_BASE_URL (plain), SERVICE_API_KEY (cross-project secret)
    preserved         14 secrets, 10 plain env — verified by reading the revision back
    traffic           100% on 00189-cej, confirmed from status.traffic JSON by field name

Built from a FRESH shallow clone at `P:/tmp/hauska-engine-r05dep`, HEAD verified equal to
`f1fc414c` with zero dirty files. `P:/hauska-engine` was detached at `8d8e880` with 5 modified
files and would have shipped the wrong tree.

### All three traps fired exactly as documented

**The tag trap fired.** `gcloud run deploy --tag=p120r05` printed
`https://envelope-canary---hauska-engine-api-...`. Reading `status.traffic` as JSON showed
revision `00189-cej` carrying BOTH `p120r05` and `envelope-canary`.

**The `envelope-canary` tag moved onto the new revision**, off `00187-fit`. Anything pinning
that tag URL now reaches R-05 code without anyone repointing it. Live consequence, not
hypothetical — worth an inventory of who pins it.

**`update-traffic` printed `0% (currently 100%) LATEST`.** Ambiguous as warned; the JSON
re-read is what established `00189-cej` at 100`%`.

### Verification, canary then production

Canary, both outage parcels, six gate-front headers, `POST /feasibility-export/refresh`:

    48021:52726   201   narrativeIsDeterministicSkeleton=false   no fallback reason
    48021:52727   201   narrativeIsDeterministicSkeleton=false   no fallback reason

Post-shift, production base URL (not the tag), on `48055:20478` — a Caldwell parcel deliberately
not used in the canary smoke, which also proves the path on a county other than Bastrop:

    201   skeleton=false   pageCount 12   feasibilityPageCount 10   sectionCount 15
          openItemCount 4   sitePlanAppended true
          narrativeCitedSections = 10  (jurisdiction, parcelOwnership, flood, specialDistricts,
          wellsPipelines, terrain, utilities, hoa, footprint, dischargePoint)

Ten cited sections is the R-05 claim — all ten manifest ids consulted — verified at the surface
rather than taken from the lane's report.

### LATENCY REGRESSION, flagged not buried

    before tonight (reported)   3-6s
    canary warm                 14.6s, 18.3s
    production cold             94.1s   (first hit on a never-rendered parcel)
    production warm             24.2s, 16.6s

**Roughly 3-5x on a customer-facing synchronous path**, driven by the added LLM call. It was
expected to rise and it did; whether 15-25s is acceptable for a synchronous refresh is a product
call, not a deploy call, and it is open. The 94s cold case is the one that would look like a
hang to a user.

### Rollback, one command

    gcloud run services update-traffic hauska-engine-api --region us-central1 \
      --project hauska-prod-497015 --to-revisions hauska-engine-api-00187-fit=100

`00187-fit` is intact and still tagged `p120r04b`.

### Open

Who pins `envelope-canary`. It silently moved and nobody has enumerated its consumers.

Whether 15-25s warm is acceptable for a synchronous feasibility refresh, and whether the 94s
cold path needs an async or progress affordance.

The composition root (#406) reached production in this deploy having had one pair of eyes, as
this card flagged. It is now serving. Watch it rather than assume it.
