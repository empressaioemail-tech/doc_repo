---
id: 2026-09-08_PARKED_hauska-engine-api_p120_production_deploy
title: PARKED — hauska-engine-api production deploy (P-120 reports work)
date: 2026-09-08
status: parked-awaiting-operator
applies_to: hauska-engine
seat: integration (doc-repo-79)
plan_rows: [P-120]
related:
  - _sessions/2026-09-07_reports_outage_and_p120_recut_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# PARKED: hauska-engine-api production deploy

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
