---
decision_id: 2026-09-03_p89_leftover_fixed_gate_cleared
date: 2026-09-03
owner: Nick (go-ahead), planner (execution)
status: active
related_canonical:
  - _inbox/2026-09-03_p89_leftover_fix_close.json
  - _inbox/2026-09-03_p89_gate_reverify_close.json
  - _decisions/2026-09-03_p90_approved_gate_still_open.md
  - _dispatches/2026-09-03_p90-engine-honesty_dispatch.md
---

## Decision

P-90 item 1's gate is CLEARED. P-89 is customer-done in full as of this decision. P-90 (engine PDF honesty, `hauska-engine`) may now compile and start.

## Context

Earlier the same session, the planner re-verified P-89 against the operator's approval-to-dispatch instruction and found it NOT customer-done: `isStoredDossierArtifactHollow(undefined)` returned `false` (not hollow) for a stored-artifact record that does not exist at all, a fail-open default on an unknown value (`_inbox/2026-09-03_p89_gate_reverify_close.json`). `_decisions/2026-09-03_p90_approved_gate_still_open.md` recorded P-90 as approved but not started, pending that leftover.

The operator responded "yes do what you need to to get it done." The planner took that, combined with the standing CANON-PREAMBLE line "DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator," as authorization to execute the leftover fix end to end rather than only drafting a dispatch for a separate lane.

## What was done

One-line fail-closed fix in `hauska-mcp-server/src/xray-export-gate.ts` (`isStoredDossierArtifactHollow`), plus a regression test, in an isolated worktree off `origin/main`. Full local suite 538/538 pass, `tsc --noEmit` clean. PR #80 opened, all five CI check-runs read `SUCCESS` at source (not `gh pr checks`' "pass" string), squash-merged (`3497f388c358326ac11e6040f1bb4aba650b71e0`). Built and deployed via `cloudbuild-mcp.yaml` from a clean post-merge checkout; the new revision (`hauska-mcp-server-00056-9pr`) landed at 0% traffic because this service's traffic spec pins by revision name rather than `latestRevision: true` — deploys here do not auto-promote. Tagged the new revision for canary verification, proved the fix on a live before/after pair (parcel `48029:105129`: unnamed 404 on the pre-fix serving revision, clean `422 pipeline_output_absent` on the fixed revision), then promoted it to 100% production traffic and re-confirmed the clean refuse on the production base URL. Full detail, all commands, and the three probe artifacts are in `_inbox/2026-09-03_p89_leftover_fix_close.json`.

## Reasoning

`_decisions/2026-09-03_p90_approved_gate_still_open.md`'s reversal criteria named exactly this: the leftover lands and is itself live-verified on the serving revision, not merged. Both conditions are now met, satisfying P-90's own binary gate text ("Starts only after P-89 customer-done: a live refuse on the serving Hauska MCP revision") with no severity carve-out needed.

## Reversal criteria

Revisit if a future live probe finds the undefined-record refuse no longer firing on the then-serving revision (regression), or if the operator rules that this leftover-fix execution should have been dispatched to a separate lane rather than run inline by the planner.

## Dependencies

P-90 (property seat, `hauska-engine`) dispatch (`_dispatches/2026-09-03_p90-engine-honesty_dispatch.md`) is unblocked and may now compile past its item-1 gate check.

## Counterparties

Internal: Nick (go-ahead), substrate seat (the fix landed in `hauska-mcp-server`, substrate's repo, executed here by the planner rather than dispatched), property seat (P-90, next to start).
