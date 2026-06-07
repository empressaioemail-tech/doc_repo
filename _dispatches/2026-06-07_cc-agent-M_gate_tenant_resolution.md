---
id: 2026-06-07_cc-agent-M_gate_tenant_resolution
title: Dispatch - gate tenant resolution + accessPolicy enforcement (ADR-005 Layer A)
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: QUEUED (do not fire - hold for operator sequencing vs deploy + M-Stabilize WS-1)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control]
---

# Gate tenant resolution + accessPolicy enforcement (ADR-005 Layer A)

> **HOLD - QUEUED.** Do not fire until the operator clears the tenant leg against the deferred deploy and M-Stabilize WS-1. This dispatch is fire-ready; sequencing is the gate. Verify identifiers against live source before firing.

You are **cc-agent-M**, the single owner of `hauska-mcp-server` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation in your session summary. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:54` - tenant-leg sequence and where this step sits (it is step 1, load-bearing)
- `decision:2026-06-07_adr008_gate_front_seam_scoping` - companion seam move on the cortex-api side

## Read first (after atoms)

1. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) - Sequence step 1; guardrails
2. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) - Layer A decision in full
3. [`80_adrs/adr_017_atom_access_control.md`](../80_adrs/adr_017_atom_access_control.md) - the accessPolicy field being enforced
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-mcp-server`
- Branch prefix: `tenant/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Confirm against live source: `src/auth.ts` resolves `X-Hauska-Key` to `product` with no tenant field on `AuthContext`; `src/tools.ts` treats `accessPolicy` as public-free engine-side. Report the verbatim resolution logic and the api-keys schema before changing anything.
- Add a tenant binding to the api-keys record (column or join to an actor-record atom representing the tenant; your call, documented in the PR per ADR-005 open decision).
- Carry the resolved tenant on `AuthContext` alongside `product`.
- Enforce `accessPolicy` in the tool handlers (`search_atoms`, `get_atom`, and the reasoning tools): `public-free` to anyone; `public-paid` by paid tier; `tenant-private` only to the owning tenant + Hauska; `tenant-shared` to the shared-with list; `platform-internal` to Empressa actors only. Denied reads return empty or 403 per tool, with audit logging on denial.
- Default policy for atoms with no accessPolicy: treat as `tenant-private` to the creating tenant where a tenant is resolvable; otherwise public-free for the existing public corpus (do not regress the anonymous public path).
- Preserve current behavior for the anonymous public path (no key) and the 401 on malformed/unknown key.

**Out of scope:**

- The cortex-api gate-front seam (cc-agent-C, separate dispatch).
- SmartCity tenant onboarding (separate dispatch, depends on this).
- Any change to the atom contract package (the five-value union already ships).
- Per-call billing/metering wiring (SDK seam, separate).

## Acceptance criteria

- Tenant resolves on `AuthContext` from the key; verbatim before/after of the resolution path in the report.
- accessPolicy enforced in the named tool handlers; a `tenant-private` atom owned by tenant A is not returned to tenant B (test demonstrates isolation), is returned to tenant A, and is returned to Hauska/internal.
- Anonymous public path and 401-on-bad-key behavior unchanged (regression test).
- Latency overhead of enforcement measured and reported against the current baseline (ADR-005 open decision input).
- Tests: the repo's existing suite green plus the new isolation + regression tests.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-mcp-server_cc-agent-M_gate_tenant_resolution.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, latency measurement verbatim, blockers verbatim.
