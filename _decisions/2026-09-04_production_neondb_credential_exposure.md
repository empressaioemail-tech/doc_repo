---
id: 2026-09-04_production_neondb_credential_exposure
title: PRODUCTION_NEONDB_URL exposed in a lane-planner session transcript — contained, rotation recommended
status: active
last_updated: 2026-09-04
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - 90_runbooks/seat_loop
---

# Decision: PRODUCTION_NEONDB_URL exposure — disclosure, scope, and rotation recommendation

## What happened

During the CTX pipeline wrap-up sprint (`OPS-19b`), the Factory lane (property seat,
`hauska-factory`, session `cente-56`) was fetching `PRODUCTION_NEONDB_URL` per the
documented pattern in `90_runbooks/seat_loop.md` (`gcloud secrets versions access latest
--secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015`, captured into a shell
variable). One capture attempt failed silently: a stderr deprecation-warning line merged
into the captured value via `2>&1`, and the lane's own sanity check correctly rejected the
resulting malformed string — no bad value was used at that point.

While debugging why the capture failed, the lane re-ran the identical `gcloud` command
without redirecting or capturing output, to see the raw error text directly. That
unfiltered re-run printed the full connection string — including the `neondb_owner`
role's plaintext password — directly into the lane's own tool output.

**This document does not, and must never, reproduce that value.**

## Scope, as disclosed and not independently re-verifiable beyond the disclosure itself

- Confined to that one session's own transcript.
- Never written to a file, never echoed a second time, never sent to any peer session,
  the integration seat, or any external service.
- Every subsequent secret fetch in that session used a properly silent, filtered capture.
- The lane disclosed this proactively and immediately, without being asked, as part of
  its own end-of-work report.

This containment claim rests on the reporting session's own account; the integration seat
has no independent means to verify a negative (that the value was never persisted or
transmitted elsewhere). Treat the claim as credible given the lane's demonstrated
disclosure discipline, not as independently proven.

## Why this is a portfolio-scoped credential, not a Factory-scoped one

`PRODUCTION_NEONDB_URL` is documented in `90_runbooks/seat_loop.md` as the `cortex-prod:
hauska_mcp + neondb` connection string. It is consumed by cortex-api, the hauska-mcp
server, and any lane reading against that store — not scoped to `hauska-factory`. A
rotation is therefore not a narrow, single-repo action: every live Secret Manager
reference across every deployed service needs enumerating before the primary's
`neondb_owner` password changes, or a consumer silently breaks at its next
`:latest`-resolving deploy (a failure pattern this portfolio has hit before with other
secrets).

## Not the cause of the concurrent read-replica auth failure

The Factory lane separately reported (same session, `OPS-19b` item 6) that the newly
created Neon read replica rejects the same, freshly and correctly fetched credentials
that authenticate cleanly against the primary. The lane explicitly flagged that this is
a distinct issue — a freshly fetched, uncorrupted copy of the password failed against
the new endpoint specifically, consistent with a Neon-side replica-provisioning problem,
not a consequence of this exposure. Recorded separately in `OPS-19b` as a blocked item,
not folded into this incident.

## Recommendation

Rotate `neondb_owner`'s password, as its own scoped, coordinated card: enumerate every
Secret Manager reference to `PRODUCTION_NEONDB_URL` across every deployed service first,
rotate, then update and redeploy each consumer so none is left holding a stale cached
value. Not an emergency-tonight action given the containment claim above, but not
indefinite either — a live, human-visible credential that has left the properly-piped
path once should not sit unrotated indefinitely.

## Reversal criteria

Superseded when the rotation actually executes (record the rotation and its
consumer-enumeration list in a follow-up entry here or in `OPS-19b`), or if further
investigation contradicts the containment claim above (in which case this becomes an
active-incident escalation, not a closed disclosure record).
