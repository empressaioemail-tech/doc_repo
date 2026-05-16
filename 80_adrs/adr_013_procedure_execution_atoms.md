---
id: adr_013_procedure_execution_atoms
title: ADR-013 — Procedure-execution atoms
status: proposed
last_updated: 2026-05-16
applies_to: portfolio
related: [adr_001_atom_architecture, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_014_skill_behavior_atoms, adr_015_actor_atoms, adr_016_intent_atoms, adr_017_atom_access_control, 08_tiered_access_model, 51_substrate_v1_sprint, 60_eci_atomization]
owner: nick
---

# ADR-013 — Procedure-execution atoms

## Status

Proposed. Originated 2026-05-15 during the catalog roadmap dialogue (Q2 option C decision). Carries the `purpose` field rider per Q5 decision 2026-05-16. Scaffolded 2026-05-16 during the alignment session.

## Context

Codex 1b reviewer surfaces produce findings, adjudications, and decisions. DA produces designs and submittals. ECI ingest pipelines produce daily-update, meeting-extraction, and other internal atoms. The Hauska MCP Server forwards atom queries. Across all these, agents (Claude Code, Cursor, doc_repo, claude.ai strategic, Replit Agent, custom SDK agents) and human-driven workflows produce or modify atoms.

The atom contract today captures provenance (CID per ADR-010, DID per ADR-011, source-adapter metadata per ADR-001). What it doesn't capture as first-class is the *execution context* — which procedure ran, on what inputs, producing what outputs, under whose direction, at what time. Procedure-execution context is currently scattered: agent_identity fields, source-attribution fields, ad-hoc timestamps.

The Q2 decision 2026-05-15 (catalog roadmap dialogue) committed to option C: procedure-execution atoms as audit/provenance for any agent action that materially produces or modifies Hauska atoms. The Q5 decision 2026-05-16 added a `purpose` field for capturing strategic intent until usage data justifies promoting intent to its own atom type per ADR-016.

## Decision

Introduce `procedure-execution` atom type. One atom per qualifying execution. Discipline gate: only executions that materially produce or modify atoms qualify. Ephemeral LLM reasoning passes that don't materialize atoms do NOT qualify.

Required fields:
- `executionId` (DID per ADR-011)
- `executionCid` (CID per ADR-010)
- `skillVersion` — identifier for the procedure that produced this execution. Free-text for v1; chains to a future `skill-record` atom per ADR-014 when v2 public Hauska Skills activate.
- `actorId` — link to `actor-record` per ADR-015 (the actor that ran this execution)
- `principalActorId` — link to actor-record (when applicable, the actor on whose direction this ran; for `actorType: agent`, this is typically the human or organization directing the agent)
- `startedAt`, `finishedAt` — execution time window
- `inputAtomCids[]` — atoms consumed as input (typed link `derives-from` per ADR-010)
- `outputAtomCids[]` — atoms produced or modified (typed link `produced-by`)
- `runMetadata` — structured execution context (tool versions, environment, parameters)
- `purpose` — optional free-text capturing strategic intent of this run; may carry optional links to parent `decision-record`, `sprint-item`, or `open-question` atoms per the Q5 2026-05-16 decision. Purpose field is the v1 stopgap; promotes to a dedicated `intent-record` atom type per ADR-016 if usage patterns justify.
- `outcome` — `success | partial | failed`
- `accessPolicy` — per ADR-017 (typically `tenant-private` or `platform-internal`; some procedure-executions on public atoms may carry `public-paid`)
- Standard ADR-001 four layers (identity, context interface, composition, history)

Discipline gates:
- Only executions that materially produced or modified Hauska atoms qualify
- LLM reasoning that didn't result in atom changes is logged but not atomized
- Read-only retrievals (MCP `search_atoms` call) typically don't qualify; if a retrieval triggers a derivative atom (e.g., a daily-update aggregation) the aggregation is the procedure-execution, not the underlying retrievals
- Implementation enforces this gate at atom-creation time via a Hauska SDK helper, not as a post-hoc filter

Producer surfaces:
- Codex 1b reviewer-side adjudications (one procedure-execution per finding adjudication event)
- Codex 1a / Cortex / DA compliance pass and design generation runs (one per material output)
- ECI ingest pipelines (transcript ingest, daily synthesis, lead-record creation)
- Hauska MCP Server tool calls that materialize derivative atoms (not per read-only query)
- Custom SDK agents that respect the discipline gate

Consumers:
- ECI internal MCP read surface (operator queries for "what did Nick / Valerie / cc-agent-N do this week")
- Codex web companion (drill-down on a finding's adjudication history)
- Training-data export per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) Stream 2C
- Future audit-trail-anchor surfaces per ADR-006 when audit-trail anchoring lands

Slot: Bump 2 alongside adjudication-context atoms and parcel-intelligence atoms. Bump 2 carries hard dependencies on ADR-015 (actor-record) and ADR-017 (accessPolicy).

## Alternatives considered

**Option A — Procedures out of scope.** Atoms cover data only; execution context stays in opaque metadata. Rejected per Q2 2026-05-15 decision because audit + training-data + ECI dogfooding all depend on first-class execution capture.

**Option B — Both procedure-record and procedure-execution atoms in scope.** Procedure-record captures the skill itself plus procedure-execution captures each run. Rejected for v1 because procedure-record bloats the contract with metadata about reusable procedures that hasn't shipped yet. Deferred to ADR-014 (skill / behavior atoms) when v2 public Hauska Skills activate.

**Option C — procedure-execution only (this decision).** Audit-shaped: every meaningful run produces an atom; skills themselves are out-of-scope until v2.

## Consequences

Positive:
- Audit graph terminates at identified actors (per ADR-015) doing identified procedures.
- Training-data export per 51 Stream 2C has clean atom-shaped records of every meaningful execution.
- ECI dogfooding loop closes: every meaningful agent action produces an atom feeding the internal MCP.
- Foundation for ADR-006 audit-trail-anchor when that lands.
- Purpose field per Q5 produces structured intent data over the one-quarter trial period, informing whether ADR-016 promotes intent to its own atom type.

Negative:
- Atom volume grows. Even with discipline gates, MCP server tool calls plus ECI ingest plus reviewer adjudications generate many procedure-execution atoms. Index pressure on Postgres needs measurement.
- Discipline gate enforcement adds complexity at every producer surface. Atom-creation code paths need to reliably flag "this materially modified an atom."
- Replication / portability cost grows with atom volume.

Neutral:
- Purpose field per Q5 may produce structured patterns that justify promoting intent to its own atom type later (ADR-016).
- skillVersion is free-text for v1; tightens to chain links when ADR-014 lands.

## Open decisions

- Discipline gate enforcement pattern. Hauska SDK helper, framework convention, or audit-time validation? Probably library-level helper; sprint-scoping work.
- Retention policy for procedure-execution atoms. Probably indefinite retention for archival audit value; balance against storage cost. Explicit check against escheatment / regulatory retention requirements per ADR-017.
- Cardinality budget. Aggregation-only vs every materializing call. Discipline gate above says aggregation-only; needs implementation confirmation.
- Granularity of `skillVersion` field. Free-text for v1; chains to skill-record atoms when ADR-014 v2 activates.
- Purpose field structure refinement. Free-text per Q5 v1 stopgap. If usage shows clear patterns (parent-intent, scope, owner), promote to structured fields or full intent-record atom type per ADR-016.
- Read-vs-write boundary at MCP server tools layer. Some read-heavy patterns (cross-jurisdictional precedent aggregation) may want to atomize as procedure-execution; clarification needed.

## Reversal criteria

Revisit if atom volume, index pressure, or replication cost from procedure-execution atoms blocks the substrate at scale. Fallback: tighten the discipline gate further, or move procedure-execution to a cold-tier store with hot-tier index pointers.

## References

- [`adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract this ADR extends
- [`adr_010_atom_graph_traversal.md`](adr_010_atom_graph_traversal.md) — typed link taxonomy used here (`derives-from`, `produced-by`)
- [`adr_011_atom_identity_across_versions.md`](adr_011_atom_identity_across_versions.md) — DID + CID identity
- ADR-014 skill / behavior atoms — queued v2 ADR; will chain skillVersion field to skill-record atoms
- [`adr_015_actor_atoms.md`](adr_015_actor_atoms.md) — chains actorId and principalActorId
- ADR-016 intent atoms — deferred v2 candidate; promotes purpose field if usage justifies
- [`adr_017_atom_access_control.md`](adr_017_atom_access_control.md) — accessPolicy enforcement on procedure-execution reads
- [`../51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — training-data export consumer (Stream 2C)
- [`../60_eci_atomization.md`](../60_eci_atomization.md) — consumer for ECI ingest pipeline procedure-executions
- [`../08_tiered_access_model.md`](../08_tiered_access_model.md) — Layer 2 paid tier
- Origin (Q2 decision): [`../_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md`](../_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md)
- Origin (Q5 purpose field rider): [`../_sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md`](../_sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md)

## Revision history

- **2026-05-16 (origin):** drafted as ADR-013 scaffold during the 2026-05-16 alignment session. Combines Q2 decision (2026-05-15 catalog roadmap dialogue option C, audit-shape only) and Q5 purpose-field rider (2026-05-16 Q4/Q5/Q6 resolution session). Status proposed pending Nick's review and ratification.
