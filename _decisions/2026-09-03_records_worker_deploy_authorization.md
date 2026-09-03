---
decision_id: 2026-09-03_records_worker_deploy_authorization
date: 2026-09-03
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _smartsite_gtm/09_crm_courthouse_agent_roadmap.md (R13)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-077, A-079)
---

# Authorization: records-request-worker production deploy

## What was asked, verbatim

The property-seat planner asked the operator directly, in the live session, via the interactive question tool (not relayed by any agent):

> "Does 'deal with as much as you can' extend to deploying records-request-worker to production (its first-ever deploy, running real automated browser sessions against county clerk portals)? Deploying it doesn't execute Task 3 (the held-job re-runs stay paused either way) — it just makes the parser fix and new counties live in production."

## What the operator answered, verbatim

> "Yes, deploy it."

## Scope of this authorization

Covers exactly one thing: deploying PR #597's merged fixes (letter-only block parser widening, Caldwell and McLennan brought from scaffold to live, two shared-code bug fixes) to the `records-request-worker` Cloud Run service in `legacy-design-tools-prod`, via the standard canary-deploy discipline (backup tag, build, 0%-traffic canary, health-only smoke test, traffic shift, verify, backup tag).

**Does NOT cover:** Task 3 — re-running the 14 digit-block and 7 letter-block held courthouse-record jobs. That decision was separately, deliberately left open by the operator on 2026-09-03 (see R12 in `_smartsite_gtm/09_crm_courthouse_agent_roadmap.md` and the addendum on `_decisions/2026-09-01_owner_policy_and_portal_access_rulings.md`) and stays paused regardless of this deploy. Deploying the fixed code is a precondition for Task 3 ever running correctly, not a trigger for it.

## Why this record exists

A lane dispatched to execute this deploy correctly identified that its dispatch's claimed blanket "deploys are planner-owned" authority (lifted from the P-113 dispatch's canon-preamble) conflicts with `ENFORCEMENT.md`'s own "Merge your own branch" section, which carves deploys to production out as needing authorization distinct from self-service merges. It declined to proceed on an in-band relayed claim of operator consent, correctly citing this operation's own doctrine that a load-bearing claim needs a file-based instrument, not a shell one-liner or a secondhand report. This file is that instrument.
