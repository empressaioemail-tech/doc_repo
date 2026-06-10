---
id: 2026-06-07_cc-agent-C_gate_front_seam_and_arrow2_phase2
title: Dispatch - gate-front seam generalization + arrow-two Phase 2 outcome capture
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: READY - cc-agent-M step 1 (gate tenant resolution) merged #29; tenant context the seam carries is live. The next legacy-design-tools run; feeds arrow-two Phase 3 and 56 step 5.
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 54_tenant_leg_sprint, 80_adrs/adr_008_engine_factor_out, _decisions/2026-06-07_adr008_gate_front_seam_scoping, 04a_arrow_two_calibration_capture]
---

# Gate-front seam generalization + arrow-two Phase 2 outcome capture

> **READY (2026-06-09).** cc-agent-M step 1 (gate tenant resolution) is merged (#29); the seam carries the tenant context the gate resolves. This is the next legacy-design-tools (cc-agent-C) run: part A the gate-front seam (54 step 2, feeds 56 step 5), part B arrow-two Phase 2 outcome capture (54 step 3, feeds Phase 3). Verify identifiers against live source before firing.

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:54` - tenant-leg sequence; this dispatch is steps 2 and 3
- `product:cortex` - the engines being gate-fronted live in cortex-api

## Read first (after atoms)

1. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - Sequence steps 2 and 3; guardrails
2. [`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](../_decisions/2026-06-07_adr008_gate_front_seam_scoping.md) - seam vs repo factor-out; build the seam, not the extraction
3. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) - Phase 2 outcome-observation spec; Phase 0/1 findings
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `tenant/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope, part A (gate-front seam, step 2):**

- Recon first. Read `artifacts/api-server/src/middlewares/brokerageServiceAuth.ts` (the PR #144 brief service-seam: `requireBrokerageAuthOrServiceToken`, `Authorization: Bearer <SERVICE_API_KEY>`, sets `req.serviceAuth.tenantId`). Report the verbatim seam shape.
- Generalize the seam so the MCP gate reaches the property/parcel and plan-review engine entry points (brief, site-drainage, site-topography, encumbrances, finding generation) on the same service-auth path, carrying the resolved tenant through. Engines stay workspace packages; this is a seam, not a repo move.
- Do NOT factor the engines into hauska-engine. That stays on its M-Stabilize Phase 2C gate per the scoping decision.

**In scope, part B (arrow-two Phase 2, step 3):**

- Read `artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts` (the merged Phase 1 ledger, partitioned on `jurisdictionTenant` via `cortexJurisdictionKey`). Report verbatim.
- Build outcome-observation capture: a path to record the eventual real-world outcome (permit approved, variance granted, plan-review comment resolved) against the finding whose accuracy it tests. Tenant-partitioned on the same `jurisdictionTenant` key as Phase 1. Append-only, consistent with the `atom_events` convention.
- Do NOT build Phase 3 calibration computation (separate dispatch, depends on this).

**Out of scope:**

- The MCP gate-side tenant resolution (cc-agent-M).
- Any atom-confidence write-back to the code corpus (the corpus is rebuilt-immutable per Phase 0 findings).
- Engine repo factor-out.

## Acceptance criteria

- Seam: the MCP gate can reach the named engine entry points on the service path, carrying tenant; the brief path continues to work; the extension-public install-id path is unchanged.
- Phase 2: an outcome record attaches to a finding and is tenant-partitioned on `jurisdictionTenant`; append-only; no schema change to the immutable corpus.
- Guardrail honored: capture is deposit (sharpens the tenant's own atoms), partitioned so a tenant's outcomes are never pooled.
- Tests: existing suite green plus seam coverage and Phase 2 capture tests.
- PR(s) held for operator merge (do not merge). Bundle or split per SR-1, your call documented.
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_gate_front_seam_and_arrow2_phase2.md`. Include atom refs touched, model used (if not default), PR URL(s) + branch SHA, blockers verbatim.
