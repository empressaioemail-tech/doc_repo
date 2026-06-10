---
id: 2026-06-10_cc-agent-C_cortex_per_user_auth
title: Dispatch — Cortex per-user auth + isolation (task #29 self-serve auth, Phase 2)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — interleave on the cc-agent-C front during the A2 (engine-core lift) wait
related: [58_gtm_readiness_sprint, _decisions/2026-06-08_cortex_7k_launch_phased_demo_first, 80_adrs/adr_005_multitenancy, 54_tenant_leg_sprint, 20_agent_operating_rules]
---

# Cortex per-user auth + isolation (the 7k self-serve leg)

> The real auth + per-user isolation build the 7k-architect self-serve launch needs (Phase 2 of the phased 7k launch, [`_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md`](../_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md)). Adjacent lane in sprint 58, separable from the lift topology and launch-gating. **This is DISTINCT from the gate-tenancy #29 already shipped:** that was gate-side `jurisdiction_tenant` resolution for Mox/SmartCity; this is product-side per-USER auth + ownership isolation inside Cortex (cortex-api / the BFF side of the seam). Sequence it on the cc-agent-C front during the wait for the engine-core lift (A2), so the cuts (C1-C3) start against a launch-ready surface.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only on failure after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Read first

1. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the launch gate this is part of
2. [`_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md`](../_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md) — the hard finding (Cortex has NO user auth, NO isolation; `GET /engagements` returns the whole DB; CORS open; no rate limit) and the phase split
3. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) — the tenancy model; keep per-user isolation consistent with it
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (main clone). Branch prefix: `cortex/`.
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`.

## Verified starting facts (from the 2026-06-08 recon; re-verify against live source first)

- Session pins every prod request to anonymous `{audience:user, tenantId:default}`.
- Core tables (engagements/submissions/findings/snapshots/sheets) have no owner/tenant column.
- `GET /engagements` ignores the request and returns the whole DB to any caller.
- CORS is open; there is no rate limiting.
- The QA-30/31-removed architect-audience render auth gate is the canary; restoring it is part of this leg.

## Scope (sequence; multiple PRs expected)

1. **Recon (read-only, report first).** Confirm the auth/session surface against live source; enumerate every route that reads or writes engagement-owned data without an ownership predicate; confirm the render auth gate's removed state. Report before building.
2. **Login/signup + identity.** Stand up per-user identity (the auth mechanism per the repo's existing patterns; do not invent a new provider without flagging). Sessions resolve to a real user, not anonymous default.
3. **Ownership columns + backfill.** Add owner (and tenant where applicable, consistent with ADR-005) columns to the engagement-owned tables; backfill existing rows to a migration owner; migration on the one legacy-design-tools clone, never concurrent with other in-flight migrations (coordinate the migration number).
4. **Per-route ownership predicates.** Every read/write of engagement-owned data filters by the authenticated owner. `GET /engagements` (and siblings) returns only the caller's data. Cross-user isolation test proves user-A data is not returned to user-B (mirror the gate's `tenant-isolation.test.ts` rigor).
5. **Metering + rate-limit.** Per-user metering hooks (for the self-serve tier) and rate limiting on the public surface. Keep the calibration grade / rev-share rail quiet (I7) — metering is a usage count, not a buyer-facing confidence signal.
6. **Restore the render auth gate.** Re-instate the QA-30/31-removed architect-audience auth gate (the open security item from the cockpit decision; mnml render activation depends on it).

## Acceptance criteria

- Recon report filed: the ungated routes enumerated; the render-gate state confirmed.
- Real per-user identity; sessions no longer resolve to anonymous default.
- Ownership columns + backfill landed (migration number coordinated, not concurrent).
- Every engagement-owned route filters by owner; `GET /engagements` returns only the caller's data; cross-user isolation test passes.
- Metering + rate-limit live; render auth gate restored.
- Rail-quiet: no calibration grade / rev-share in buyer-facing output.
- CI green. PRs held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_cortex_per_user_auth.md`: recon (ungated routes, render-gate state), PR URLs + SHAs, the isolation-test output verbatim, migration number used, and blockers verbatim.
