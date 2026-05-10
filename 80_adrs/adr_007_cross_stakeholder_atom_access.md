---
id: adr_007_cross_stakeholder_atom_access
title: "ADR-007 — Cross-stakeholder atom access model"
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [adr_001_atom_architecture, 05_living_lineage_thesis, 25_atom_architecture_reference, 47_codex_plan_review, 30_smartcity_os, 40_design_accelerator]
---

# ADR-007 — Cross-stakeholder atom access model

## Status

**Accepted.** Originated 2026-05-10 during the plan review framing session. Establishes the access model that lets the living lineage thesis ([`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md)) operate across stakeholder surfaces.

![Hauska fabric overview](diagrams/fabric_overview.svg)

*The diagram above shows stakeholder surfaces interacting with the Hauska fabric, with atoms scoped to a real property whose lineage chain captures every event. This ADR settles how stakeholder tenants gain access to those property-scoped atoms.*

## Context

The portfolio's product surfaces serve different stakeholders in the construction lifecycle: architect (Design Accelerator), reviewer (Codex), city manager (SmartCity OS), and future surfaces for inspector, contractor/builder, owner/developer. Every surface reads and writes atoms. The atom contract per ADR-001 makes those atoms interoperable in principle. What ADR-001 does not settle is *how* access works when atoms span stakeholder boundaries.

The fabric framing requires that atoms cross tenant boundaries — an architect at Firm A submits to City B reviewed by Firm C. An inspector at City B verifies findings authored by Firm C against a property owned by Owner D. ADR-005 multitenancy was scoped against single-tenant SmartCity OS deployments; it does not address cross-stakeholder atom references.

Without a settled access model, two failure modes emerge:

1. **Each stakeholder tenant owns its own atoms.** Architect Firm A owns its submission atoms; reviewer Firm C creates separate finding atoms that reference (but cannot share state with) the submission. Cross-stakeholder data flow becomes integration work, not graph traversal. Lineage becomes an aggregation exercise instead of a structural property.
2. **A central tenant owns everything.** All atoms scoped to a property live in a property-tenant; stakeholders have query access. This collapses the lineage problem cleanly but raises the access-control problem (who can read what?) and the ownership problem (who owns the property-tenant?) without answering them.

This ADR settles both questions.

## Decision

**Real-world entities — typically the property/parcel for plan-review and construction-lifecycle atoms — own data-level atoms. Stakeholder tenants have *scoped access* to those atoms, not ownership.**

Concretely:

### Property as tenant of record

Every data-level atom in the construction-lifecycle domain is scoped to a real-world entity. For plan review, that is the property/parcel. The property is the atom's tenant of record; the chain of events anchored to that atom forms the property's lineage.

The property's tenant of record is held by the **current owner of the property**. Ownership change is itself an event in the chain, not a tenant migration. When the property is sold, tenant-of-record transfers from old owner to new owner; the chain stays.

### Stakeholder access scopes

Stakeholder tenants are granted access scopes determined by their relationship to the property:

- **Architect tenant** — read/write on submissions they authored; read on findings issued against their submissions; no access to other architects' submissions on the same property.
- **Reviewer tenant (firm or city)** — read/write on findings they authored; read on submissions submitted to them; read on prior findings they have continuity with (per firm precedent layer); no access to other reviewers' findings on the same property unless they share continuity.
- **City manager tenant** — read on all atoms scoped to properties within their jurisdiction; write on jurisdictional events (code adoption, permit issuance, ownership transfer recording).
- **Inspector tenant** — read/write on inspection events for properties they are assigned; read on findings the inspections gate against.
- **Owner tenant** — read on all atoms scoped to properties they currently own; access transfers on ownership change.
- **Builder/contractor tenant** — read/write scoped to the engagement they are executing on a property.
- **AHJ regulator tenant** — read on aggregate jurisdiction-level events; specific access to individual property atoms scoped to their regulatory authority.

### Cross-tenant references

Atoms reference other atoms across tenant boundaries via the atom contract's reference fields. References resolve via the contract; access depends on the requester's scope. A reviewer attempting to read a referenced submission atom either succeeds (their scope includes that submission) or receives a scope-denied error.

### Owner-of-record transfer mechanics

Ownership change is modeled as an `OwnershipTransferEvent` atom in the property's chain, written by the city manager tenant (the AHJ that records ownership) or by the platform mediating a closing. The new owner is granted tenant-of-record status; the prior owner's access either persists or is revoked depending on policy (see Open Decisions below).

### Conflict-of-interest controls

Firm tenants reviewing for City A and consulting for a developer must not leak findings across the engagement boundary. Specific COI mechanics are deferred to a firm-tenancy ADR (extending ADR-005 multitenancy). This ADR establishes the foundation: per-engagement metadata on every atom, and access scopes that filter by engagement.

### County-level recording integration

Establishing initial ownership and recording transfers requires integration with county recording systems. This is out of scope for this ADR; lives as a separate integration surface ADR.

## Alternatives considered

**Alternative 1 — Tenant-per-stakeholder model.** Each stakeholder tenant owns its own atoms; cross-stakeholder data flow is integration work. Rejected because it makes lineage an aggregation exercise instead of a structural property; the fabric thesis fails.

**Alternative 2 — Platform-as-tenant model.** All atoms live in a platform-owned tenant; stakeholders have query access. Rejected because it makes the platform vendor the durable custodian of the property's history, which contradicts the vendor-independent claim in the living lineage thesis.

**Alternative 3 — Owner-as-permanent-tenant model.** The original property owner permanently owns the chain; subsequent owners have read access but cannot write. Rejected because it breaks down at multi-decade timescales when owner #1 may not exist anymore (corporations dissolve, individuals die without clear successor). Tenant-of-record must be transferable.

## Consequences

**Positive:**

- Lineage is a structural property of the graph, not a feature of any product. Querying "what is this property's complete decision history" is graph traversal, not integration.
- Stakeholder access scales naturally: adding a new stakeholder surface is a matter of defining the scope, not redesigning ownership.
- Ownership transfer is uniform: every property-as-tenant follows the same transfer protocol regardless of which stakeholders touch it.
- Atom contract enforcement (ADR-001) extends naturally: the contract enforces access scope alongside identity, context, composition, and history.

**Negative:**

- Property-tenant lookup adds a layer of indirection compared to per-stakeholder tenants. Read latency on cross-stakeholder queries needs profiling at firm-tenant scale.
- Initial ownership establishment requires integration with county recording systems for properties without platform-mediated origination. This is a real ongoing integration cost.
- COI controls become more nuanced because access is cross-cutting (a firm reviewer's scope crosses many property-tenants).

**Neutral:**

- Property-tenant model fits naturally with web3 / decentralized property record patterns if those become the recording substrate. This ADR is agnostic on the recording integration; the model works whether recording is centralized (county systems), decentralized (blockchain anchoring), or hybrid.

## Open decisions

Specific open decisions tracked here for resolution in implementation:

- **Prior-owner access on transfer.** Revoke (privacy) vs. persist (transparency). Probably configurable per jurisdiction; default TBD.
- **How ownership is established initially.** County records integration vs. platform-provided assertion. May vary by jurisdiction; needs architectural treatment in the integration surface ADR.
- **Tenant-of-record for unbuilt parcels.** When a parcel exists on county records but has no improvements, who is tenant-of-record? Probably the recorded owner; needs confirmation.

## References

- [`adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract this ADR extends
- [`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md) — strategic frame this ADR makes operational
- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — atom architecture reference, particularly §3 (composition) and §4 (history)
- [`47_codex_plan_review.md`](../47_codex_plan_review.md) — primary consumer of this access model in the plan review surface
- [`30_smartcity_os.md`](../30_smartcity_os.md) — city manager tenant consumer
- ADR-005 multitenancy (queued for migration) — single-tenant multitenancy that this ADR extends to cross-stakeholder

## Revision history

- **2026-05-10 (origin):** drafted as ADR-007 during plan review framing session. Establishes property-as-tenant-of-record model with stakeholder scoped access. Companion to ADR-008 (engine factor-out) and ADR-001 (atom contract).
