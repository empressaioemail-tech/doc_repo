---
id: 2026-09-16_engine_api_key_rotation_and_tag_cleanup
title: HAUSKA_ENGINE_API_KEY rotated and 37 dead revision tags removed, one decision
date: 2026-09-16
status: active
kind: decision
owner: nick
decided_by: operator
plan_row: P-251
related: [_inbox/2026-09-16_engine_api_tag_url_gate_bypass_finding.md, _inbox/2026-08-27_engine_api_gate_bypass_finding.md, 90_operations/OPS-16_texas_market_plan_of_record]
---

# HAUSKA_ENGINE_API_KEY rotation and revision-tag cleanup

## The decision

Operator, 2026-09-16, integration session: fold two open items into one decision and execute
both. Not two separate judgment calls — one exposure surface, two closing actions.

1. **Remove the 37 dead `hauska-engine-api` revision tags** that predate the 2026-08-27 gate
   fix and never received `ENGINE_API_GATE_TOKEN`, closing the header-only bypass the
   2026-09-16 finding measured live.
2. **Rotate `HAUSKA_ENGINE_API_KEY`** end to end across both GCP projects and all five
   consuming services, because the value was printed to this session's own tool output on
   2026-09-15 while verifying P-244a (refused by the service's own gate before use, but the
   value itself was exposed in a transcript this seat does not control after the fact).

## Why one decision, not two

Both items are the same exposure surface from two different angles. The tag finding shows the
key doesn't even need to be the vector — 37 revisions accepted a spoofed header with no token
check at all. The exposure finding shows the token value itself may no longer be secret. Tag
removal closes the structural hole; rotation closes the credential hole. Doing one without the
other leaves half the surface open: rotating alone doesn't help while 37 revisions skip the
check entirely, and closing the tags alone doesn't help if the real token is already known.

## What was measured before acting

- Tag finding (`_inbox/2026-09-16_engine_api_tag_url_gate_bypass_finding.md`, `fa9addb4`):
  37 of 51 traffic tags on `hauska-engine-api` (`hauska-prod-497015`) pointed at revisions
  created before 2026-09-13T23:12Z, none carrying `ENGINE_API_GATE_TOKEN`. Verified by field:
  service URL answered `401 unauthorized` to a junk bearer; all 37 tag URLs answered `401
  gate_front_context_required` (the header-shape check only, not the token check) to no
  credential at all — a real, live-confirmed discriminator, not an inference from revision
  creation timestamps alone.
- `HAUSKA_ENGINE_API_KEY` is a genuinely separate secret object in each project (not a single
  cross-project resource): `hauska-prod-497015` carries 2 enabled versions (created
  2026-05-21T15:18 and 15:54), `legacy-design-tools-prod` carries 1 (created 2026-06-11).
  Both currently resolve `:latest` to the same underlying value — confirmed by the fact that
  cross-project auth (cortex-api and smartsite-mcp, in `legacy-design-tools-prod`, calling
  `hauska-engine-api` and `hauska-retrieval-api`, in `hauska-prod-497015`) works today.
- Five services consume it, mapped by field (`gcloud run services describe`, not assumed from
  workflow YAML): `hauska-engine-api` (`ENGINE_API_GATE_TOKEN`, `RETRIEVAL_API_KEY`),
  `hauska-mcp-server` (`HAUSKA_ENGINE_API_KEY`), `hauska-retrieval-api` (`RETRIEVAL_API_KEY`) —
  all three in `hauska-prod-497015`; `cortex-api` (`ENGINE_API_GATE_TOKEN`,
  `RETRIEVAL_API_KEY`), `smartsite-mcp` (`HAUSKA_ENGINE_API_KEY`) — both in
  `legacy-design-tools-prod`. All five reference `HAUSKA_ENGINE_API_KEY:latest`, meaning a new
  version only takes effect on a NEW revision of each service — an already-serving revision has
  the resolved version baked in permanently and will not pick up a new value without a fresh
  deploy.

## Execution order, and why

1. Tags removed first (done, reversible, zero traffic risk, closes the open door immediately
   regardless of what the token rotation does).
2. Mint one new value, add as a new version to both projects' `HAUSKA_ENGINE_API_KEY` secrets
   (keeps the mirror in sync, matching this portfolio's existing "Factory secrets mirrored in
   two GCP projects" pattern).
3. Redeploy all five services to a new revision that resolves the new `:latest` value, canary
   first (0% traffic) on each, smoke-tested, then shifted to 100% — in quick succession across
   all five to minimize the window where one service's serving revision expects the new value
   while another still sends the old one on a cross-service call.
4. Verify a real cross-service call succeeds end to end post-shift (not just each service's own
   health check) before touching the old versions.
5. Disable (never destroy in this pass) the old version in both projects. Disable is reversible;
   destroy is not, and nothing in this decision requires destroying it today.

## Reversal criteria

If any service fails to boot or fails a real cross-service auth check after its shift, roll
that service's traffic back to its prior revision immediately and do not disable the old secret
version until every service is confirmed on the new value. If disabling the old version breaks
something not caught in step 4, re-enable it immediately — disable is a single reversible
`gcloud secrets versions disable` call away from undone.

## Correction, 2026-09-16, same day: a sixth consumer was missed

"Five services consume it" above was wrong. `hauska-map`'s `property-explorer` Vercel
deployment holds its own synced copy of the same value, outside GCP entirely, as Vercel
production env vars `HAUSKA_RETRIEVAL_API_KEY` and `RETRIEVAL_API_KEY`
(`.github/workflows/property-explorer-sync-retrieval-key.yml`, whose own header states the
rotation path in full: "add SM version → redeploy retrieval-api → redeploy MCP → run this
workflow"). That workflow was never run as part of this rotation, because the discovery
process (`gcloud run services describe` across two GCP projects) structurally could not see a
Vercel-hosted consumer.

**Consequence, found by a downstream lane (P-230), not by this seat's own verification**:
`GET /api/spine/property-atoms/{id}/facets` on `property-explorer` returned `503
retrieval_auth_failed` project-wide from shortly after the rotation until fixed. **Fixed same
day**: `property-explorer-sync-retrieval-key.yml` run via `workflow_dispatch`
(`hauska-map` run `35134588299`); it pulled the current secret version, authoritative-replaced
both Vercel env vars, and redeployed `property-explorer` to production. Verified directly:
`GET /api/spine/property-atoms/48021:34137/facets` now returns `200` with a full real payload
(re-checked outside the workflow's own run, not trusting its self-report alone). The workflow's
own built-in live-verify step still reports failure, but on an unrelated, pre-existing
assertion (`readPath` expected `atom-chain-warm`, got `record`) that traces to P-230's bake-
staleness finding (`bakedAt` on this exact parcel is six days old), not to authentication —
confirmed by reading the actual HTTP status and body, not the workflow's pass/fail alone.

**What this changes about the decision above:** "five consuming services" should read six.
Any future credential rotation touching `HAUSKA_ENGINE_API_KEY` must include this Vercel sync
workflow as a required step, not an optional one — the discovery method used here (`gcloud run
services describe`) cannot find non-GCP consumers by construction, so a rotation checklist
needs an explicit non-GCP consumer step, not just a wider GCP scan.
