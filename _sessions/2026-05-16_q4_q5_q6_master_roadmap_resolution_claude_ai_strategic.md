---
id: 2026-05-16_q4_q5_q6_master_roadmap_resolution
title: Strategic session — Q4/Q5/Q6 resolution + master roadmap consolidation approach
status: archived-session
date: 2026-05-16
agent: claude_ai_strategic
repo: doc_repo
session_type: strategic_decision
last_updated: 2026-05-16
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out, 11_roadmap, 27_engine_evolution_plan, 60_eci_atomization, 2026-05-15_catalog_roadmap_followon_q4_q5_q6_audit]
owner: nick
---

# Strategic session — Q4/Q5/Q6 resolution and master roadmap consolidation

Session run inside the new Empressa Strategic Core Project on claude.ai with skills active (premortem-check, source-required, decision-log refined this session). Resolved the four pending decisions left open by the prior catalog roadmap agent.

## Decisions

### Q4 actor atoms (ADR-015 scaffolded)

Adopt actor-record atom type with actorType field (person | agent | organization) and trustLevel enum (verified-human | verified-org | known-agent | unverified). For agent actors, additional fields agentVersion, producerSurface, principalActor. Actor-record is ADDITIVE to ADR-007 stakeholder tenant scopes, not subsuming. Lands as part of the ECI atomization sprint internal-atom bump.

Correction from prior dialogue: the doc_repo agent's earlier framing claimed ADR-007 mentioned person atoms implicitly. Verification of ADR-007 verbatim showed this is wrong. ADR-007 defines stakeholder TENANTS with access SCOPES; it does not define person atoms. Actor-record and tenant scopes are different abstractions that compose (an actor can be assigned a tenant scope).

Reversal criteria: revisit if the discriminator pattern produces materially worse downstream code than three sibling types during ECI sprint implementation.

### Q5 intent atoms (no new ADR for v1, deferred to ADR-016 in v2)

No new atom type for v1. Add a purpose field to procedure-execution atoms in ADR-013 with optional links to parent decision-record, sprint-item, or open-question atoms in the ECI internal registry. Run for one quarter post ECI atomization. If purpose fields consistently fill with structured content, promote to full intent-record atom type in ADR-016. If freeform, the field is sufficient.

Reversal criteria: revisit if purpose field analysis after the trial quarter shows clear structured patterns warranting a dedicated atom type, or if intent ever needs external addressability.

### Q6 trust and authorization atoms (ADR-017 scaffolded)

Extends the atom contract per ADR-001 with a layered accessPolicy field rather than creating parallel access-control atoms. Required scope types: public-free (Layer 1), public-paid (Layer 2), tenant-private, tenant-shared with explicit shared-with list, platform-internal. Tenants formalized as actor-record atoms with tenantKind field (city | firm | enterprise-customer | internal | public). ADR-017 sequenced after ADR-015 lands. Added as a dependency for ECI atomization sprint.

ADR-007 verbatim verification confirmed it covers ONLY construction-lifecycle data atoms scoped to properties. It does not cover Layer 1 public atoms, Layer 2 paid atoms not scoped to properties, enterprise customer tenants like Mox, ECI internal atoms, or cross-tenant benchmarking. The matrix gap analysis from the prior catalog roadmap agent dialogue holds.

Operational tradeoff acknowledged: MCP server tools layer must enforce access policy; ECI sprint takes on ADR-017 as a dependency.

Reversal criteria: revisit if accessPolicy as a contract field creates unmanageable query overhead at the MCP server tools layer.

### Master roadmap (extend 11_roadmap)

Extend 11_roadmap rather than create new 00_master_roadmap.md. Three additions: an "Active sprint exit criteria" mini-section, an "Open architectural questions" section mirroring "Open strategic questions" (with Q4, Q5, Q6 landing there alongside routing status), and a "Queued ADR work" section listing queued ADRs (005, 006, 009, 013, 014, 015, 016, 017) with status. Catalog roadmap input from 2026-05-15 noted as distributed-and-superseded by the canonical doc set.

Reversal criteria: revisit if 11_roadmap grows past the point where a top-level orientation snapshot becomes necessary.

## Verification findings

1. ADR-007 fetched verbatim this session via web_fetch on the public repo. The doc_repo agent's earlier paraphrase ("mentions person atoms implicitly") was incorrect. The actual model is stakeholder tenants with access scopes. Correction propagated into the Q4 decision design.

2. 27_engine_evolution_plan.md fetched verbatim. Codex-side new atoms listed (firm-tenant, firm-precedent, per-reviewer-learning, audit-trail-anchor, code-change-broadcast-event, version-drift-snapshot-diff, jurisdictional-precedent). DA-side new atoms listed (sheet-content-extraction, attached-document, detail-callout-spec, product-spec-reference, deliverable-letter, response-task). No explicit spec for adjudication-record atom found in 27 despite the atom being referenced in 08_tiered_access_model.md and prior catalog agent dialogue. Possible doc gap to surface for resolution.

## Operational asks for the doc_repo agent

1. Scaffold ADR-015 (actor-record atom) per the design captured above.
2. Scaffold ADR-017 (atom access control) per the design captured above.
3. Apply 11_roadmap extensions per Stage 2B below.
4. Update 60_eci_atomization.md to add ADR-015 and ADR-017 as sprint dependencies.
5. Surface the adjudication-record spec gap for resolution: either confirm where it is specced, or flag as a doc gap to address in a small followup.
6. Take a look at the Codex naming follow-up that was open from the prior catalog agent dialogue. Default per dialogue: skip sub-brand, describe building-code-lookup as MCP server tools. Operator has not confirmed or overridden. If still open, surface to Nick for one-line confirmation.

## Outstanding from this session

For Nick:
- Confirm Codex naming default (or override).
- Mox CEO meeting timing (gates pricing of remaining work).
- Merged Project instructions still need drafting (next session).
- IP attorney and Tech E&O insurance routing dates.

For doc_repo agent:
- Three ADR scaffolds (013 from prior session is still open per the prior dialogue; 015 and 017 added this session).
- 11_roadmap extensions per Stage 2B.
- 60_eci_atomization.md dependency update.
- Adjudication-record spec gap resolution.

## References

- ADR-007 (verified verbatim this session): https://github.com/empressaioemail-tech/doc_repo/blob/main/80_adrs/adr_007_cross_stakeholder_atom_access.md
- 27_engine_evolution_plan.md (verified verbatim this session): https://github.com/empressaioemail-tech/doc_repo/blob/main/27_engine_evolution_plan.md
- Prior session: _sessions/2026-05-15_catalog_roadmap_followon_q4_q5_q6_audit.md
- Prior session audit: _sessions/2026-05-15_doc_repo_audit_report.md
