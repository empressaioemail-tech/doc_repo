---
id: adr_017_atom_access_control
title: ADR-017 — Atom access control
status: accepted-amended
amended_by: 19_the_instrument_contract
last_updated: 2026-08-22
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_015_actor_atoms, 08_tiered_access_model, 50_hauska_mcp_server, 60_eci_atomization]
owner: nick
---

# ADR-017 — Atom access control

> **AMENDED 2026-08-22 by [`19_the_instrument_contract.md`](../19_the_instrument_contract.md).** The five-value union below is retained as five points in a grid and is no longer the field. Access is now two orthogonal fields: **discoverability** (catalog-listed, unlisted, hidden) and **entitlement** (anyone-free, anyone-paid, named-parties, owner-only, platform-only). The single enum cannot express unlisted-and-purchasable, which is the ordinary case of sending one record to one party and having them pay for it without listing it publicly. It also conflated discoverability with entitlement, which are independent. Owner-issued grants extend the entitlement set the gate computes its ceiling against, and the gate itself still only removes. Where this ADR and 19 disagree, 19 wins.

## Status

Accepted 2026-05-16. Originated 2026-05-16 during the Q4/Q5/Q6 resolution session. Ratified 2026-05-16 during the Claude Code migration test session.

## Context

ADR-007 cross-stakeholder atom access covers construction-lifecycle data atoms scoped to properties (architect, reviewer, city manager, inspector, owner, builder, AHJ regulator tenants). Verbatim verification of ADR-007 in the originating session confirmed it does NOT cover:

- Public Layer 1 atoms (FEMA, USFWS, USGS, USDA, ICC code text, RRC public records) which are not property-scoped
- Public Layer 2 atoms (adjudication patterns, comparable project precedents) which are not property-scoped
- Enterprise customer tenants like Mox Living (multifamily operations, not a construction-lifecycle stakeholder)
- ECI internal atoms (Empressa-only, no external stakeholder relationship)
- Cross-tenant benchmarking opt-in

ADR-007 also defers conflict-of-interest controls to a firm-tenancy ADR (ADR-009, also queued) and leaves county-level recording integration to a separate integration surface ADR.

ECI atomization sprint cannot proceed cleanly without the full access matrix resolved, because ECI internal atoms need a "platform-internal" scope that ADR-007 doesn't model.

## Decision

Extend the atom contract per ADR-001 with a layered `accessPolicy` field rather than creating parallel access-control atoms.

Required scope types:
- `public-free` — Layer 1 public atoms readable by anyone (FEMA, USFWS, ICC code text, RRC, etc.)
- `public-paid` — Layer 2 atoms (adjudication patterns, comparable project precedents) gated by paid tier per 08_tiered_access_model.md
- `tenant-private` — atoms scoped to a single tenant (Bastrop atoms readable only by Bastrop and Hauska; Mox atoms readable only by Mox and Hauska)
- `tenant-shared` — atoms shared between explicit tenants with a shared-with list (cross-tenant benchmarking opt-in)
- `platform-internal` — atoms readable only by Empressa actors (ECI internal atoms)

Tenants are formalized as actor-record atoms per ADR-015 with `actorType: organization` and `tenantKind` field (`city | firm | enterprise-customer | internal | public`). Tenant assignment to a data atom is a relationship between the data atom and the actor-record atom representing the tenant.

Construction-lifecycle property-scoped atoms continue to follow ADR-007 stakeholder scopes (architect, reviewer, inspector, etc.) within the broader accessPolicy framing. ADR-007 is a refinement of ADR-017 for the construction-lifecycle domain, not superseded.

Enforcement happens at the atom contract validation layer and at the MCP server tools layer (search_atoms, get_atom filter results by requester scope). The tools layer enforcement is an operational commitment introduced by this ADR.

## Alternatives considered

**Parallel access-control atoms.** A separate access-control atom type that chains to data atoms and actor atoms. Rejected because it creates a parallel access-control graph that must stay in sync with the data graph; error-prone and adds query overhead.

**Access metadata sidecar tables outside the atom contract.** Database-level access control with caching. Rejected for v1 because it weakens the atom contract as the single source of truth and creates a migration tax for cross-deployment portability.

**Continue with ADR-007 scope only.** Rejected because the verified gap analysis shows ADR-007 doesn't cover the full matrix, and ECI atomization explicitly cannot proceed without platform-internal scope modeled.

## Consequences

Positive:
- Single coherent access model across all atom types and all tenant kinds.
- ECI atomization sprint unblocked.
- Mox enterprise tenant cleanly modeled (actor-record with tenantKind: enterprise-customer plus tenant-private accessPolicy on Mox atoms).
- Cross-tenant benchmarking has a defined opt-in path (tenant-shared with shared-with list).
- Layer 1 vs Layer 2 enforcement becomes contract-level rather than convention-level.

Negative:
- MCP server tools layer takes on access policy enforcement work.
- Atom contract version bump coordinates a non-trivial schema change.
- Query overhead at the tools layer needs measurement; if unacceptable, fall back to a cached enforcement layer per the reversal criteria.

## Open decisions

- Initial enforcement implementation (validation layer pattern, error type, audit logging on denied access). Implementation-level; specs at sprint scoping.
- Default accessPolicy for newly created atoms when not specified. Probably tenant-private with the creating actor's tenant as the scope; needs confirmation.
- Migration of existing atoms to add accessPolicy field at the contract bump. Either inferred from current ADR-007 scoping or batch-assigned with operator review.
- Performance budget for access enforcement at the MCP tools layer. Target latency budget TBD; should be specced when the MCP server tools layer reaches access-policy implementation.

## Reversal criteria

Revisit if accessPolicy as a contract field creates unmanageable query overhead at the MCP server tools layer, in which case fall back to access metadata sidecar tables with cached enforcement.

## References

- ADR-001 atom architecture (the contract this ADR extends)
- ADR-007 cross-stakeholder atom access (refinement of this ADR for construction-lifecycle property-scoped atoms)
- ADR-015 actor atoms (tenant entities are actor-record atoms)
- 08_tiered_access_model (Layer 1 vs Layer 2 the public-free and public-paid scopes implement)
- 50_hauska_mcp_server (consumer of access enforcement)
- 60_eci_atomization (consumer of platform-internal scope)
- Session origin: _sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md

## Revision history

- **2026-05-16 (origin):** drafted as ADR-017 scaffold during Q4/Q5/Q6 resolution session. Status proposed pending Nick's review and ratification.
- **2026-08-09 (verification, no change to the ruling):** the Decision section's five required scope types were checked against the live published contract and match exactly. `npm view @empressaio/atom-contract@latest` returns 1.15.0, and the shipped type declarations in that tarball read `accessPolicy: z.ZodEnum<["public-free", "public-paid", "platform-internal", "tenant-private", "tenant-shared"]>`. No amendment is owed here. Note for readers arriving from elsewhere in the doc set: the CLAUDE.md Sync A line describing this as a four-value union is the stale artifact, not this ADR, which listed all five from origin. The fifth value was carried into the published contract at 1.2.0. The package was also renamed from `@hauska/atom-contract` to `@empressaio/atom-contract` in the 2026-07-06 branding decision.
