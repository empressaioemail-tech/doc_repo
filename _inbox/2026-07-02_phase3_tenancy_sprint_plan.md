---
id: inbox/2026-07-02_phase3_tenancy_sprint_plan
title: Phase 3 tenancy sprint plan (draft for operator review)
status: draft
date: 2026-07-02
related: [54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_022_deal_twin_and_cross_application_capture, 77_place_graph_strategy, _research/2026-07-02_ai_native_and_twin_review]
---

# Phase 3 tenancy sprint plan (draft for review)

Scoping only. No execution until the operator approves. This extends `54_tenant_leg_sprint` (whose step 2 is the queued tenant-private write primitive) with the concrete critical path the deep review (DR-2) named. On approval this folds into `54`.

## Why this is the spine of the twin

The multi-investor digital twin is N private tenants depositing private intelligence onto a shared property node, the private layer never pooling. That is exactly the `tenant-private` partition. Today the partition resolves WHO the tenant is (the gate key column, `jurisdiction_tenant`, merged via #29) and isolates the 8 corpus-read tools, but it does NOT isolate WHAT a tenant does across the ~40 reasoning and workspace tools (they forward tenant headers and trust cortex-api to self-enforce, and cortex-api reaches engine-api ungated), and there is no tenant-private write or owned-collection primitive. Every downstream promise (private deal books, per-investor atom collections, Mox's private flywheel) consumes that one unbuilt primitive. This is security-critical: a gap here is a cross-tenant data leak, so it is planned, reviewed, and load-tested, never rushed.

## The critical path (execution order, dependencies named, no time estimates)

### Track T1 — Gate as the single reasoning chokepoint
Make the Hauska MCP gate the one place tenant identity is resolved and enforced for the reasoning surface, not just corpus reads. The gate resolves the tenant from the product key, stamps a verified, gate-signed tenant context, and forwards it; cortex-api and engine-api trust it because it is gate-signed and stop constructing or trusting an unverified forwarded context. Close the direct cortex-api to engine-api ungated path so no reasoning bypasses the gate. Acceptance: every reasoning/workspace tool resolves the same enforced tenant; there is exactly one enforcement surface; a request with tenant A's key cannot read or compute over tenant B's private atoms.
Depends on: nothing new (the primitive and key column exist). This is the foundation for T2 and T3.

### Track T2 — Tenant-private write and owned-collection primitive (54 step 2)
Build the semantics for a tenant to create and own private atom collections: scoped writes that stamp `tenant-private` accessPolicy and the owning tenant at mint time; owned-collection grouping (a tenant's private overlay on a shared node); read/list scoped to the owner at the gate. This is the literal mechanism for "each investor's private atoms attached to the same property node." Ties to the document-ingest work (Phase 2): user-uploaded documents mint tenant-private atoms into the caller's owned collection.
Depends on: T1 (writes enforce at the same gate chokepoint).

### Track T3 — Second real tenant + zero-cross-leak load test (ADR-005 Layer B)
Onboard one real second tenant (SmartCity or Bastrop) alongside the existing anonymous/default, and run the ADR-005 Layer B isolation load test: concurrent traffic from two tenants, assert zero cross-leak on both reads and the new writes, under load. Prod is anonymous-default today, so isolation has never been proven against two live tenants; this is the proof gate before the twin vision can be sold.
Depends on: T1 + T2.

## Supporting (parallelizable, not on the critical path)

- Identity/auth: settle how a user resolves to a tenant (the extension already authenticates; the trading app uses Clerk). Needed for per-USER (not just per-tenant-org) private collections; scope it against the existing auth so it composes.
- Ops hardening for 100-tenant load (DR-2): product BFF max-instances 10 / min-instances 0, ~20 secrets pinned to `:latest`, single Neon with per-request calibration-ledger reads. Raise the ceilings and pin secret versions before real multi-tenant load, not after.
- Node aggregator + twin lifecycle (DR-3): the property node as a first-class aggregator (place graph `77`), three strata by reference, the ADR-022 lifecycle extended into owned/operating. This is the data-model layer that rides on T1-T3; write the digital-twin lifecycle ADR alongside T2.

## Out of scope for this sprint

- Live IoT sensor stream atoms (their own small ADR when the first operational-twin sensor use case is real).
- The twin-creator hosted-twin persona (park until Mox proves the private operational overlay).
- Calibration fuel (the M1 backtest) — tracked on the calibrated-spine roadmap, not here; the loop machinery is already live.

## Risk / reversal

The load-bearing risk is a cross-tenant leak. Mitigation: T1 before any write primitive; the Layer B zero-cross-leak load test (T3) is a hard gate before onboarding real private data; the sovereignty rule (tenant-private never pools into public calibration) is already enforced in the calibration loop and must be re-asserted in T2's write path. If T3 finds any leak, halt onboarding and fix before proceeding — do not soften the test.
