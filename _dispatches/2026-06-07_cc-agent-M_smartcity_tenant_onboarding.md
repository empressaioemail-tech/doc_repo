---
id: 2026-06-07_cc-agent-M_smartcity_tenant_onboarding
title: Dispatch - SmartCity/Bastrop as city tenant on the gate + atom-backed context
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server + empressaio_tech_smartcity_os
kind: dispatch
status: QUEUED (do not fire - depends on cc-agent-M gate tenant resolution; coordinate with cc-agent-M clone ownership)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 31a_bastrop_maintenance_sprint, 07a_smartcity_product_positioning]
---

# SmartCity/Bastrop as a city tenant on the gate + atom-backed context

> **HOLD - QUEUED.** Do not fire until gate tenant resolution (the cc-agent-M step-1 dispatch) has landed, the M-Stabilize DB hold is clear (released 2026-06-06), and the operator clears SmartCity-on-spine. Fire-ready; sequencing is the gate. This dispatch touches two repos; confirm clone ownership before firing (SmartCity work may route to cc-agent-M's smartcity-os ownership). Verify identifiers against live source.

You are **cc-agent-M**, owner of the relevant repo(s) for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:54` - tenant-leg Task 2 (SmartCity-on-spine)
- `agent:cc-agent-M` - clone ownership across hauska-mcp-server and smartcity-os

## Read first (after atoms)

1. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - Task 2 (SmartCity-on-spine); guardrails
2. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) - Layer A; tenant as actor-record atom
3. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) - Phase 3 P3-4 atom-backed context (now unblocked)
4. [`07a_smartcity_product_positioning.md`](../07a_smartcity_product_positioning.md) - the product framing
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clones: `P:\hauska-mcp-server` and `P:\empressaio_tech_smartcity_os`
- Branch prefix: `tenant/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3` on each clone touched

## Scope

**In scope:**

- Recon first. Confirm SmartCity is an island (zero `@hauska/*` deps; own `tenant_id` schema, Bastrop = 2) and that gate tenant resolution has landed. Report verbatim.
- Provision SmartCity/Bastrop as a city tenant on the gate: an actor-record atom with `tenantKind: city`, a tenant-bound key, and `tenant-private` accessPolicy on Bastrop's atoms (adjudications, permit history, plan-review precedent) so they are readable only by Bastrop and Hauska.
- Wire 31a Phase 3 P3-4 (atom-backed context / Compass V4) to consume substrate atoms through the gate as the Bastrop city tenant rather than via SmartCity's island data path. Start read-only (search code atoms, parcel intelligence) before any write path.
- Reconcile SmartCity's existing `tenant_id` (storage, Layer B) with the gate tenant identity (the same Bastrop tenant at two layers per ADR-005).

**Out of scope:**

- The ambient capture extension build (follow-on product dispatch; waits on the tenant key).
- M-Stabilize WS-1 Neon migration (cc-agent-M M-Stabilize dispatch; this rides its exit state).
- Any pooling of Bastrop atoms into shared ground-truth beyond the noncompetitive code/regulatory layer.

## Acceptance criteria

- Bastrop resolves as a `city` tenant on the gate; Bastrop `tenant-private` atoms are not readable by any other tenant (isolation test).
- Atom-backed context reads substrate atoms through the gate as the Bastrop tenant; demonstrated on a real Bastrop query.
- Storage `tenant_id` and gate tenant identity reconciled (same Bastrop tenant, both layers).
- Guardrail honored: capture/consumption is deposit that sharpens Bastrop's own atoms, never extraction; partnership-first sovereignty intact.
- Tests: existing suites green plus the tenant isolation + atom-backed-context tests.
- PR(s) held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_smartcity-os_cc-agent-M_smartcity_tenant_onboarding.md`. Include atom refs touched, model used (if not default), PR URL(s) + branch SHA per repo, blockers verbatim.
