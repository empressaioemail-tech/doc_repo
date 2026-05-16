---
id: adr_015_actor_atoms
title: ADR-015 — Actor atoms
status: accepted
last_updated: 2026-05-16
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_013_procedure_execution_atoms, adr_017_atom_access_control, 60_eci_atomization]
owner: nick
---

# ADR-015 — Actor atoms

## Status

Accepted 2026-05-16. Originated 2026-05-16 during the Q4/Q5/Q6 resolution session in the Empressa Strategic Core Project. Ratified 2026-05-16 during the Claude Code migration test session.

## Context

Skill atoms have ownership, execution atoms have agent_identity in metadata, data atoms have source attribution. There is no first-class actor representation in the atom contract.

ECI atomization surfaces this immediately because team_members are actors (Nick decides, Valerie commercials, Kendra schedules, Dev contributes). The same applies to AI agents (Claude Code, Cursor, doc_repo Cursor agent, claude.ai strategic agent), municipal stakeholders (Sylvia, Bastrop city manager), and external counterparties (Mox CEO, CAD directors, ICC).

ADR-007 defines stakeholder TENANTS with access SCOPES on property-scoped atoms. ADR-007 does not define actors. Actors and tenant scopes are different abstractions that compose: an actor (a specific entity) can be granted a tenant scope (an access role).

Without actor atoms the substrate can answer "what happened" but not cleanly "who has authority over this decision," "which agent ran which procedure under whose direction," or "who is the counterparty in this commercial atom."

## Decision

Introduce `actor-record` atom type. Single atom type with discriminator field rather than sibling types for person, agent, organization.

Required fields:
- `actorId` (DID per ADR-011 identity scheme)
- `actorType`: enum of `person | agent | organization`
- `displayName`
- `trustLevel`: enum of `verified-human | verified-org | known-agent | unverified`

Conditional fields (when actorType is agent):
- `agentVersion`
- `producerSurface` (the product or codebase that produced this agent)
- `principalActor` (the human or organization actor on whose direction this agent operates, when applicable)

Conditional fields (when actorType is organization):
- `tenantKind`: enum of `city | firm | enterprise-customer | internal | public` (links to ADR-017 access control)
- `jurisdictionalScope` (when tenantKind is city)

Relationship to ADR-007:
- Actor-record is additive. ADR-007 stakeholder tenant scopes (architect tenant, reviewer tenant, etc.) remain as access roles that can be granted to actors.
- Existing implicit references to architects, reviewers, inspectors, owners as roles within ADR-007 stay as scopes. The actor identity within those roles is now first-class via actor-record.
- Procedure-execution atoms (ADR-013) chain to actor-record atoms rather than carrying opaque agent_identity metadata.

## Alternatives considered

**Three sibling types (person, agent, organization).** Cleaner schema separation but more join logic in queries and more registry surface area. Rejected for v1; revisit if discriminator pattern produces materially worse downstream code.

**No new atom type, extend existing metadata.** Adding actor fields directly to procedure-execution and data atoms without a dedicated actor type. Rejected because it prevents querying "what did Nick do across all projects this quarter" or "what has the doc_repo Cursor agent produced" as graph traversal; would force scan and aggregate patterns instead.

## Consequences

Positive:
- Source attribution becomes first-class.
- Procedure-execution audit chains terminate at identified actors, not opaque metadata.
- Foundation for ADR-017 access control (tenant assignment via actor-record).
- ECI internal team members are atomized cleanly.

Negative:
- Registry surface area increases by one atom type.
- Existing specs (adjudication-record, finding metadata, decision-event) need refactor passes to reference actor-record where they currently carry actor fields.
- Coordination cost on the atom contract version bump that introduces actor-record.

Neutral:
- Trust level field is enum-shaped today; may need extension to graded trust scoring later, which a future ADR can address without breaking the v1 schema.

## Open decisions

- Discriminator pattern vs sibling types is settled for v1 but flagged for review during ECI sprint implementation if patterns surface that warrant separation.
- Pseudonymous actors (when an actor exists in the graph but identity is not yet established, e.g. an inbound counterparty before introduction) — treatment TBD. Likely actorType: organization with trustLevel: unverified plus a placeholder marker, but needs spec.
- Actor merge protocol when two actor-records turn out to represent the same entity (deduplication). Out of scope for v1; flagged for ADR-018 or later.

## References

- ADR-001 atom architecture (the contract this ADR extends)
- ADR-007 cross-stakeholder atom access (stakeholder tenant scopes; actor-record is additive)
- ADR-013 procedure-execution atoms (will chain to actor-record)
- ADR-017 atom access control (uses actor-record for tenant assignment)
- 60_eci_atomization (consumer of actor-record for ECI internal team_members)
- Session origin: _sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md

## Revision history

- **2026-05-16 (origin):** drafted as ADR-015 scaffold during Q4/Q5/Q6 resolution session. Status proposed pending Nick's review and ratification.
