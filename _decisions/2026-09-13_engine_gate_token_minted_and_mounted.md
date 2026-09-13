---
id: 2026-09-13_engine_gate_token_minted_and_mounted
title: ENGINE_API_GATE_TOKEN is minted in both GCP projects and mounted on hauska-engine-api; the public-invoker removal is a separate go
date: 2026-09-13
last_updated: 2026-09-13
status: active
owner: nick
decided_by: nick (operator), 2026-09-13, "token approved"
plan_rows: [P-179, P-152]
related:
  - 90_operations/OPS-23_surface_completion_program.md (F22)
  - _catalog/dispatch_missions/mission_p179_engine_gate_token.md
  - _inbox/2026-09-13_ops23-wave4_close.json (operatorOwedItems Q5)
---

## Decision

The operator approves minting `ENGINE_API_GATE_TOKEN` in Secret Manager in hauska-prod-497015
(for `hauska-engine-api`) and legacy-design-tools-prod (for `cortex-api` and `smartsite-mcp`),
with one value, granting the three services' runtime identities `secretAccessor`, mounting it on
`hauska-engine-api` through its deploy workflow, and switching the two callers from a plain env
var to the Secret Manager reference, in the order callers first, engine last, one traffic shift
per service under a lease. The token value is never printed, pasted or logged.

## What this does not yet approve

Removing `allUsers` from `roles/run.invoker` on `hauska-engine-api` and changing its ingress is
the mission's step 4 and takes its own go once the callers' network paths are read; it is not
covered by this record.

## Why

F22: the engine's Cloud Run service is invocable by anyone with ingress `all`, and because no
gate-token secret exists in either project the engine's bearer check passes every caller. The
composer-level tier gate shipped in wave 4 protects the two known callers and not a caller who
sets the access-tier header against the public URL.

## Reversal criteria

Reversed if a legitimate caller cannot reach the engine after the mount (the rollout order is
wrong; roll the engine back first), or if the secret fails to resolve in one project at the next
deploy (mint it there too; the two-project mirror rule).
