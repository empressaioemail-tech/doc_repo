---
id: 2026-09-13_engine_gate_token_minted_and_mounted
title: The engine gate is armed from the key its callers already send; no new secret is minted this wave; the public-invoker removal is a separate go
date: 2026-09-13
last_updated: 2026-09-13
status: active, AMENDED 2026-09-13 (option 1: no new secret minted)
owner: nick
decided_by: nick (operator), 2026-09-13, "token approved"
plan_rows: [P-179, P-152]
related:
  - 90_operations/OPS-23_surface_completion_program.md (F22)
  - _catalog/dispatch_missions/mission_p179_engine_gate_token.md
  - _inbox/2026-09-13_ops23-wave4_close.json (operatorOwedItems Q5)
---

## AMENDMENT 2026-09-13 (operator: "agreed")

The p179-gate lane's CP1 found FOUR live callers that already send a key to the engine, not the two the original text counted: cortex-api, smartsite-mcp, hauska-mcp-server and the Property Explorer BFF on Vercel. Minting a new dedicated token would have required switching all four before arming the engine or two of them go dark. The operator agreed with the overseer's recommendation of option 1: mount `ENGINE_API_GATE_TOKEN` on `hauska-engine-api` FROM THE EXISTING `HAUSKA_ENGINE_API_KEY` secret, after the lane confirms from code that all four callers send that key in the header the engine's check reads; verify by violation (401 without the key on a gated route on the public URL; reads of `48021:34049` through all four callers unchanged). No new secret is minted this wave. A dedicated, independently rotatable token is a later row once every caller reads its key from Secret Manager. The IAM step (removing `allUsers` invoker) still takes its own go. The text below is the original approval, superseded on the minting point only.

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
