---
id: 2026-06-07_cc-agent-C_arrow2_phase3_calibration
title: Dispatch - arrow-two Phase 3 calibration computation
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED (do not fire - depends on arrow-two Phase 2 landing first)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, 03_structural_constitution_and_drift_guard, 03a_positioning_framework]
---

# Arrow-two Phase 3 calibration computation

> **HOLD - QUEUED.** Do not fire until arrow-two Phase 2 (outcome capture) has landed; Phase 3 needs captured outcomes to compute against. Fire-ready; sequencing is the gate. Verify identifiers against live source before firing.

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:54` - tenant-leg sequence; this is step 4 (final)
- `product:cortex` - calibration runs over cortex-api findings + the evidence ledger

## Read first (after atoms)

1. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) - Phase 3 spec; calibration defined
2. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - Sequence step 4; guardrails
3. [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md) - invariant I3 (confidence earned, not asserted), the invariant this satisfies
4. [`03a_positioning_framework.md`](../03a_positioning_framework.md) - calibration grade feeds the pricing tiers
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `tenant/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Confirm the Phase 1 ledger and Phase 2 outcome capture are both present and tenant-partitioned on `jurisdictionTenant`. Report verbatim.
- Build calibration computation: compare stated confidence (on the finding) to observed frequency (from captured outcomes), per tenant, and tighten the match with use. Surface a calibration grade per tenant / per jurisdiction.
- Keep the computation tenant-partitioned: a tenant's calibration is computed from its own outcomes; no cross-tenant pooling.
- Surface the grade so it can feed the calibration-grade pricing tiers (positioning framework) without exposing the rail to the buyer (I7).

**Out of scope:**

- Writing confidence back onto the code-section atoms (corpus is rebuilt-immutable; calibration lives on the finding / ledger projection per Phase 0 findings).
- Pricing-tier wiring itself (positioning / SDK territory).
- Any cross-tenant benchmarking surface.

## Acceptance criteria

- Calibration computed per tenant from that tenant's captured outcomes; demonstrated on a seeded two-tenant fixture with no cross-tenant pooling.
- Calibration grade surfaced and readable by the consuming surfaces; the rail stays quiet at the buyer-facing layer.
- Satisfies I3: stated confidence now has a path to being checked against observed frequency.
- Tests: existing suite green plus calibration computation tests.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_arrow2_phase3_calibration.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
