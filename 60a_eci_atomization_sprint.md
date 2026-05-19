---
id: 60a_eci_atomization_sprint
title: ECI atomization sprint — kickoff plan
status: active
last_updated: 2026-05-19 (P1 + P2 confirmed staying queued during combined Cortex/Codex sprint per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md; cc-agent allocation decision deferred until after sprint Lanes close)
applies_to: portfolio
related: [60_eci_atomization, adr_001_atom_architecture, adr_013_procedure_execution_atoms, adr_015_actor_atoms, adr_017_atom_access_control, adr_018_atom_contract_substrate_layer, 25_atom_architecture_reference, 26_atom_upgrade_guide, 27_engine_evolution_plan, 29_mcp_surface_tier_model, 50_hauska_mcp_server, 51_substrate_v1_sprint, _decisions/2026-05-18_eci_registry_naming, _decisions/2026-05-19_sync_4_5_and_cortex_sprint]
owner: nick
---

# ECI atomization sprint — kickoff plan

> **Purpose.** Executable sprint plan for the ECI atomization work spec'd in [`60_eci_atomization.md`](60_eci_atomization.md). Settles the package-naming and repo-placement decisions deferred to kickoff by [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md); enumerates the twelve v1 atom types; phases the work into four stages with explicit M2-C sync points; names the dispatch target and cross-repo coordination.
>
> **Status posture.** Active execution plan. P0 (decisions) closes this session. P1 (minimum-viable registry) and P2 (backfill) are pre-M2-C feasible against the workspace-private contract at `legacy-design-tools/lib/empressa-atom/`. P3 (M2-C sync plus internal MCP wiring) gates on cc-agent-2 shipping `packages/atoms/` in Stream 1B of [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md), which triggers planner-coordinated Bump 1 atom contract publication as `@hauska/atom-contract@1.0.0`.

## Decisions ratified this session

Per [`_decisions/2026-05-18_eci_registry_naming.md`](_decisions/2026-05-18_eci_registry_naming.md):

1. **Package name `@empressaio/atom-internal`** (canonical; ratifies existing canon at [`60_eci_atomization.md`](60_eci_atomization.md) Routing decisions, CLAUDE.md identity section, [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md) Neutral section). Empressa namespace is structurally correct (Empressa-internal product memory); `-internal` suffix parallels `@hauska/atom-contract`'s substrate-package-plus-role-suffix shape.
2. **Dedicated repo `empressaioemail-tech/empressa-atom-internal`**. Mirrors the 2026-05-18 hauska-mcp-server precedent. Validates the `@hauska/atom-contract` published-consumer story from day one. Cheapest moment is now (no production consumers).

## Atom-type inventory (v1: twelve atom types)

Per [`60_eci_atomization.md`](60_eci_atomization.md) §ECI current state plus ADR-013 (procedure-execution), ADR-015 (actor-record subsumes prior `person` framing), ADR-017 (`accessPolicy` field):

| Atom type | Source of truth today | Net-new? | accessPolicy |
|---|---|---|---|
| `actor-record` | ECI `team_members` plus [`18_stakeholder_graph.md`](18_stakeholder_graph.md) | Refactor of pre-ADR-015 `person` framing | platform-internal |
| `procedure-execution` | none (net-new per ADR-013) | Yes | platform-internal (some tenant-private) |
| `decision-record` | [`_decisions/*.md`](_decisions/) plus ECI `decisions` table | No | platform-internal |
| `sprint-item` | ECI `sprint_items` plus canonical-doc phase checklists | No | platform-internal |
| `open-question` | ECI `open_questions` plus canonical-doc Open-decisions sections | No | platform-internal |
| `commercial-record` | [`74_commercial_agreements.md`](74_commercial_agreements.md) plus ECI `commercials` | No | tenant-private (PII) |
| `lead-record` | [`18_stakeholder_graph.md`](18_stakeholder_graph.md) plus [`71_pipeline.md`](71_pipeline.md) plus ECI `leads` | No | tenant-private (PII) |
| `knowledge-document` | ECI `knowledge_docs` (doc_repo ingest deferred) | No | platform-internal |
| `knowledge-chunk` | ECI `knowledge_chunks` | No | platform-internal |
| `conversation-record` | ECI `conversations` (messages stay composition) | No | tenant-private (PII) |
| `meeting-extraction` | none (net-new) | Yes | tenant-private (PII) |
| `daily-update` | ECI `daily_updates` | No | platform-internal |

`messages` and `notifications` stay non-atoms per cardinality discipline per [`60_eci_atomization.md`](60_eci_atomization.md) Cross-cutting design choices. Every atom carries the standard ADR-001 four-layer contract (identity, context interface, composition, history) plus ADR-017 `accessPolicy` plus actor-link fields (`actorId`, `principalActorId`) per ADR-015. ECI atoms never carry `public-free` or `public-paid` access policy (only platform-internal or tenant-private), so the ECI internal MCP read surface (recommendation `mcp.internal.hauska.dev` per [`60_eci_atomization.md`](60_eci_atomization.md) Open questions) is non-commercial per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md).

## Phases

### P0 — Decisions (this session)

Confirm package name; decide repo placement; file decision record; produce 60a sprint plan. **Exit:** this session ships per the 2026-05-18 ECI kickoff commit.

### P1 — Minimum-viable registry (pre-M2-C feasible)

**Dispatch target.** Single cc-agent allocation (TBD). **Status update 2026-05-19:** P1 stays queued during the combined Cortex/Codex sprint per [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md). cc-agent-AC, cc-agent-E, cc-agent-M, cc-agent-C are all allocated to that sprint's lanes; ECI P1 dispatch waits until sprint lanes close (or until operator names a fifth cc-agent for the ECI work earlier, which the sprint plan does not currently require). Substrate-side prereqs already cleared: `@hauska/atom-contract@1.0.0` on npm (Sync 1, 2026-05-19); engine `packages/atoms/` shipped per cc-agent-E commit `5049961`. So P1 is technically unblocked — just queued behind capacity.

**Work.**

- Bootstrap `empressaioemail-tech/empressa-atom-internal` (TypeScript, pnpm, lint, typecheck, CI; pattern matches hauska-mcp-server bootstrap).
- Dev-time dependency on `@hauska/atom-contract` via path-pin `file:../legacy-design-tools/lib/empressa-atom` (the contract's workspace-private staging location); swap to npm publication at P3.
- Register all twelve atom types using the contract's typed `register()` signature. The signature rejects widened entityType, forces defaultMode membership in supportedModes, and forces ContextSummary completeness (the same shape verified in the 2026-05-18 atom contract Hauska namespace session recon).
- Zod schemas per atom; `@ts-expect-error` smoke tests assert type-enforced rejection.
- Render-mode stubs per ADR-001 five modes (inline, compact, card, expanded, focus); focus polish-grade per ADR-012.
- Apply ADR-017 accessPolicy at register-time (platform-internal default; tenant-private for PII atoms).
- Apply ADR-015 actor-record linking (`actorId` and `principalActorId` field validation on every atom).
- Apply ADR-013 procedure-execution chain pattern with v1 purpose-field rider (per the Q5 stopgap; intent atoms ADR-016 stays deferred).
- Conformance test suite: each atom round-trips through `register()` to `contextSummary()` to composition resolution.

**Exit.** All twelve atom types pass the conformance suite. CI green. Workspace-private contract dependency wired. Access-policy enforcement covered by tests.

### P2 — Backfill (pre-M2-C feasible)

**Work.**

- One-shot migration: [`_decisions/`](_decisions/) Markdown files ingest as `decision-record` atoms. Provenance chain points back to the source markdown CID.
- One-shot migration: [`_sessions/`](_sessions/) Markdown files ingest as compositions of references plus extracted `sprint-item` and `open-question` atoms where summaries name them explicitly.
- ECI Replit DB dump migration: `sprint_items`, `decisions`, `open_questions`, `commercials`, `leads`, `knowledge_docs`, `knowledge_chunks`, `conversations`, `daily_updates`, `team_members`.
- `actor-record` seeding for Nick, cc-agents (1 through 4), cursor-manual, replit-agent, strategic stakeholders from [`18_stakeholder_graph.md`](18_stakeholder_graph.md).

**Exit.** Backfill counts within tolerance. Provenance chains intact. Canonical-doc-to-atom links resolve.

### P3 — M2-C sync plus internal MCP wiring (post-M2-C required)

**Dispatch.** ECI cc-agent (registry side) coordinates with cc-agent-2 (Stream 1B in substrate v1; publishes `packages/atoms/`) plus planner (Bump 1 cross-repo coordinator publishing `@hauska/atom-contract@1.0.0`).

**Work.**

- Swap `@empressaio/atom-internal` dependency from `file:../legacy-design-tools/lib/empressa-atom` path-pin to published `@hauska/atom-contract@1.0.0`.
- Smoke test parity: every registration that worked against the workspace-private contract works against the published one.
- Wire ECI atoms to internal MCP endpoint per [`60_eci_atomization.md`](60_eci_atomization.md) Open questions recommendation (separate endpoint `mcp.internal.hauska.dev`). Codebase decision (reuse hauska-mcp-server with separate-tenant config vs separate codebase) deferred to P3 scoping; not gating P1 or P2.
- Internal MCP tools surface: `search_decisions`, `list_sprint_items`, `list_open_questions`, `search_commercials`, `search_leads`, `search_knowledge`, `search_conversations`, `get_daily_update`, `list_procedure_executions`. Every tool authenticates against ADR-017 `platform-internal` scope.

**Exit.** Registry pinned to published contract. Internal MCP endpoint live (staging at minimum). One operator-side query (e.g., "list decision-records from last 7 days") returns correctly via the internal MCP.

## M2-C sync points

| Phase | Pre-M2-C feasible | M2-C-gated | Critical-path dependency |
|---|---|---|---|
| P0 decisions | Yes (this session) | No | — |
| P1 minimum-viable registry | Yes (via workspace-private contract path-pin) | No | — |
| P2 backfill | Yes (operates on the P1 registry) | No | — |
| P3 M2-C sync plus internal MCP wiring | No | **Yes** | cc-agent-2 ships `hauska-engine/packages/atoms/` (Stream 1B) plus planner publishes `@hauska/atom-contract@1.0.0` |

Cross-repo coordination at P3:

- **legacy-design-tools** (M2-C extraction owner). Planner-coordinated cross-repo PR publishes `@hauska/atom-contract@1.0.0`. ECI registry consumes via npm dependency post-publication.
- **hauska-mcp-server** (substrate v1 Track 2 work owned by cc-agents 1 through 4). ECI internal MCP is internal-not-exposed per CLAUDE.md What-is-settled. The internal endpoint codebase decision (separate codebase vs reuse hauska-mcp-server with separate-tenant config) is a P3 design decision, not a P1 or P2 blocker.
- **doc_repo** (this repo). Absorbs ECI atom artifacts via the established [`_decisions/`](_decisions/), [`_sessions/`](_sessions/), and (new this session) [`_dispatches/`](_dispatches/) patterns. P2 backfill ingests this repo's content; doc files remain canonical (atoms are downstream representation, not the source of truth).

## What's deliberately deferred to v2 or later

- **ADR-016 intent atoms.** Deferred per CLAUDE.md What-is-settled. The v1 purpose-field rider on procedure-execution covers v1 intent semantics. Promote to a dedicated `intent-record` atom type if usage patterns justify.
- **doc_repo knowledge-document ingest.** Per [`60_eci_atomization.md`](60_eci_atomization.md) Cross-cutting design choices eventual consideration. Spec the ingest path; defer activation to post-P3.
- **Cryptographic anchoring for decision-record atoms.** Per ADR-006 deferred decision and [`60_eci_atomization.md`](60_eci_atomization.md) Open questions audit-trail-anchor item. Forward-compatible; no immediate action.
- **Public-publishable decisions.** Some `decision-record` atoms may want `scopeFlags` to allow external read (case studies, public commitments). Defer to post-P3.

## Cross-references

- [`60_eci_atomization.md`](60_eci_atomization.md) — spec this plan executes against.
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — four-layer contract.
- [`80_adrs/adr_013_procedure_execution_atoms.md`](80_adrs/adr_013_procedure_execution_atoms.md) — procedure-execution semantics plus v1 purpose-field rider.
- [`80_adrs/adr_015_actor_atoms.md`](80_adrs/adr_015_actor_atoms.md) — actor-record (subsumes prior `person` framing).
- [`80_adrs/adr_017_atom_access_control.md`](80_adrs/adr_017_atom_access_control.md) — `accessPolicy` field semantics.
- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](80_adrs/adr_018_atom_contract_substrate_layer.md) — substrate layer placement; M2-C extraction target `@hauska/atom-contract`.
- [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) — substrate v1 sprint that publishes `@hauska/atom-contract@1.0.0` at the Bump 1 sync gate.
- [`_decisions/2026-05-18_eci_registry_naming.md`](_decisions/2026-05-18_eci_registry_naming.md) — companion decision record.
- [`_sessions/2026-05-18_eci_sprint_kickoff_claude_code.md`](_sessions/2026-05-18_eci_sprint_kickoff_claude_code.md) — session origin.

## Revision history

- **2026-05-18 (origin).** Drafted during the ECI atomization sprint kickoff session. Decisions ratified: `@empressaio/atom-internal` confirmed as package name; dedicated repo `empressaioemail-tech/empressa-atom-internal`. Twelve-atom-type inventory enumerated. Four-phase structure (P0 decisions through P3 M2-C sync plus internal MCP) with explicit pre-M2-C feasibility analysis. Critical-path dependency: cc-agent-2's Stream 1B `packages/atoms/` plus planner-coordinated Bump 1 publishes `@hauska/atom-contract@1.0.0`, which gates P3.
