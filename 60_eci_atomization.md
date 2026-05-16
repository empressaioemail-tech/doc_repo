---
id: 60_eci_atomization
title: ECI atomization — internal atom types draft against ADR-001
status: draft
last_updated: 2026-05-15
applies_to: portfolio
related: [11_roadmap, 25_atom_architecture_reference, 27_engine_evolution_plan, 50_hauska_mcp_server, 51_substrate_v1_sprint, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions]
owner: nick
---

# ECI atomization

> **Purpose.** Draft spec of internal atom types for ECI (Empressa
> Company Intelligence), the internal dogfooding / coordination app.
> ECI is atom-shaped today but not atom-compliant — internal tables
> (`sprint_items`, `decisions`, `open_questions`, etc.) have no DID,
> no CID, no registry, no provenance chain. This doc settles the atom
> contract for those types so that when the ECI atomization sprint
> kicks off (post-[`51`](51_substrate_v1_sprint.md) v1 ship), the
> design is done.
>
> **Status posture.** Draft, no-code. Spec'd against
> [ADR-001](80_adrs/adr_001_atom_architecture.md) atom contract,
> [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) access
> scopes, [ADR-010](80_adrs/adr_010_atom_graph_traversal.md) link
> taxonomy, [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md)
> DID + chain semantics. Implementation deferred to the future ECI
> atomization sprint (likely `60a_eci_atomization_sprint.md` when
> scoped). Routing decisions on registry placement, bump timing, and
> sprint scoping captured in [§Routing decisions](#routing-decisions)
> below — settled 2026-05-15 per Nick's call on Q1.

## Why atomize ECI

Confirmed per Nick's 2026-05-15 Q1 decision. Briefly:

1. **Dogfooding the Hauska atom contract.** ECI becomes the internal
   instance of the engine + atom substrate. "Empressa uses what it
   sells" is real architectural validation against a non-jurisdictional
   domain.
2. **Internal company state as first-class atoms.** Decisions, open
   questions, commercials, leads become queryable with the same
   provenance + composition + history semantics as code-section atoms.
3. **MCP server as internal-read surface.** Operator-side Claude
   conversations read ECI state through the same MCP surface external
   customers will use post-[`51`](51_substrate_v1_sprint.md) launch.
   No new surface to build.
4. **Compounding intelligence loop.** Decisions, open questions, and
   commercials become precedent for future decisions, questions, and
   commercials — same pattern as Codex 1b adjudication-context atoms.
5. **Data portability.** ECI lives on Replit today; atomization
   decouples company state from any single hosting substrate.

## Routing decisions (per Nick, 2026-05-15)

- **Registry placement.** Separate `@empressaio/atom-internal`
  package consuming the same atom contract as
  `@empressaio/atom` but with its own type registry. Keeps internal
  company-state types out of the external substrate; external
  consumers (PropTech embedders) shouldn't have to ignore
  `sprint-item` and `daily-update` types.
- **Bump.** Own bump on `@empressaio/atom-internal`. Decoupled from
  Bump 1 / 2 / 3 on `@empressaio/atom` — different package, different
  coordination set, much lighter coordination tax.
- **Sprint placement.** Own sprint, post-[`51`](51_substrate_v1_sprint.md)
  v1 ship. Likely `60a_eci_atomization_sprint.md` when scoped. Scope:
  ECI atom contract alignment + Hauska Engine wiring + Hauska MCP
  Server as internal-read surface.
- **This doc.** Spec only — no code. Settles design before the sprint
  kicks off; gives a concrete artifact to reference when ECI sprint
  comes up for prioritization.

## ECI current state — table → atom mapping

ECI's existing Replit pnpm monorepo carries these tables. Each row is
the current table, the proposed atom type, and the atomization
disposition.

| ECI table | Proposed atom | Atomization disposition |
|---|---|---|
| `sprint_items` | `sprint-item` | Atomize. Each row is an addressable unit of in-flight work. |
| `decisions` | `decision-record` | Atomize. Decisions are the precedent substrate; the moat of the dogfooding loop. |
| `open_questions` | `open-question` | Atomize. Resolves into `decision-record` via chain (per ADR-011) when answered. |
| `commercials` | `commercial-record` | Atomize. Per-deal commercial state; composes with `lead-record` and `decision-record`. |
| `leads` | `lead-record` | Atomize. Each lead is durable across sales-cycle state changes. |
| `knowledge_docs` | `knowledge-document` | Atomize. Composition target for `knowledge-chunk`. |
| `knowledge_chunks` | `knowledge-chunk` | Atomize. Composed by `knowledge-document`; addressable individually for retrieval. |
| `conversations` | `conversation-record` | Atomize. Each conversation is durable; messages are composition. |
| `messages` | (composition of `conversation-record`) | **Do not atomize individually.** Per-message atoms blow cardinality; messages live as composition under the conversation. |
| `notifications` | (ephemeral) | **Do not atomize.** Notifications are runtime UX state, not durable substrate. |
| `daily_updates` | `daily-update` | Atomize. Daily synthesis of state; high-value retrieval target. |
| `team_members` | `person` (shared with ADR-007 person atom) | Atomize using the existing `person` shape per ADR-007 — same atom type, just an internal-tenant scope. |

Additional types proposed by the catalog agent that don't map to an
existing table but should land in the registry for forward
compatibility:

| Atom | Purpose |
|---|---|
| `meeting-extraction` | LLM-extracted structured summary of a meeting (transcripts, decisions surfaced, action items, attendees). Producer: transcript ingest pipeline. Consumer: `decision-record`, `open-question`, `commercial-record` (decisions / questions / commercials surfaced from meetings link back via `derives-from`). |

## Atom specs (per ADR-001 four-layer contract)

Each atom carries the standard four-layer contract per ADR-001
(identity / context interface / composition / history) plus the
substrate semantics per ADR-010 (CID, link taxonomy) and ADR-011 (DID,
chain). Specs below cover only the type-specific extension fields and
links; the layered contract is assumed.

### `sprint-item`

- **Purpose.** Addressable unit of in-flight work; the atom-shape of
  the current ECI `sprint_items` table.
- **Producer.** ECI sprint authoring surface (operator / planner
  writes a sprint item).
- **Consumer.** ECI sprint dashboard; future MCP server tool
  `list_sprint_items` (internal-only); `daily-update` aggregation.
- **Key fields.** `title`, `description`, `status`
  (`backlog | in-flight | done | dropped`), `assigneeDid` (→ `person`),
  `priorityTier` (P0–P3 per 11_roadmap convention), `parentSprintDid`,
  `linkedRoadmapDocRef` (e.g., `11_roadmap.md#p1`), `createdAt`,
  `lastUpdatedAt`.
- **Links (outbound).**
  - `assigned-to` → `person`
  - `derives-from` → `decision-record` (when a sprint item operationalizes
    a decision)
  - `blocks` / `blocked-by` → other `sprint-item` (per ADR-010 link
    taxonomy)
  - `closes` → `open-question` (when shipping the item answers a
    question)
- **Links (inbound).**
  - `informs` ← `daily-update` (when an update references this item)
- **Scope.** Internal tenant only. Owner: ECI internal tenant.
- **History.** Status changes are events in the chain per ADR-001. A
  dropped sprint item retains its history.

### `decision-record`

- **Purpose.** Captures a decision the operator (or team) has made,
  with reasoning + alternatives + outcome. The high-value substrate
  for the compounding-intelligence loop.
- **Producer.** ECI decision-log surface; meeting-extraction pipeline.
- **Consumer.** Future MCP server tool `search_decisions` (internal);
  precedent retrieval for `open-question` resolution; `commercial-record`
  composition (decisions about deals).
- **Key fields.** `decisionTitle`, `decisionContext` (what triggered
  it), `decisionReasoning` (the "why"; the substantive content),
  `alternativesConsidered[]`, `outcome` (`provisional | committed | reversed`),
  `decidedBy` (→ `person`), `decidedAt`, `revisitWhen` (optional
  trigger condition for revisiting the decision).
- **Links (outbound).**
  - `decided-by` → `person`
  - `resolves` → `open-question`
  - `derives-from` → prior `decision-record` (when this decision
    supersedes / revises an earlier one)
  - `references` → `knowledge-document`, `meeting-extraction`,
    `conversation-record`
- **Links (inbound).**
  - `precedent-of` ← future `decision-record` (similar decisions cite
    this one as precedent — the compounding moat)
  - `informs` ← `sprint-item` (when a sprint item operationalizes
    this decision)
- **Scope.** Internal tenant. Future consideration: some decisions
  may be publish-eligible (case studies, public commitments); add
  `scopeFlags` analogous to ADR-007 patterns when needed.
- **History.** Decision revisions are chain events; a `reversed`
  decision retains its history.

### `open-question`

- **Purpose.** Addressable unresolved question that needs an answer
  or decision. The discipline forcing-function for "name the question
  before solving it."
- **Producer.** ECI question-log surface; meeting-extraction pipeline.
- **Consumer.** Future MCP server tool `list_open_questions`;
  `daily-update` aggregation; `decision-record` resolution path.
- **Key fields.** `questionText`, `questionContext`, `dependsOn[]`
  (what needs to be true to answer), `assigneeDid` (→ `person`),
  `urgencyTier`, `askedAt`, `targetResolveBy` (optional).
- **Links (outbound).**
  - `assigned-to` → `person`
  - `depends-on` → other `open-question`, `sprint-item`, or
    `decision-record` (the dependency surface)
- **Links (inbound).**
  - `resolved-by` ← `decision-record` (when answered)
  - `closes` ← `sprint-item` (when shipping answers it)
- **Scope.** Internal tenant.
- **History.** Status transitions (`open → in-discussion → resolved`)
  are chain events.

### `commercial-record`

- **Purpose.** Per-deal commercial state — opportunity, stage,
  contract value, key terms, owner.
- **Producer.** ECI commercial-pipeline surface; lead-conversion
  events.
- **Consumer.** Future MCP server tool `search_commercials` (internal);
  Valerie-side dashboards; `decision-record` composition (decisions
  about specific deals).
- **Key fields.** `dealTitle`, `counterpartyLeadDid` (→ `lead-record`),
  `stage` (`discovery | proposal | negotiation | closed-won | closed-lost`),
  `tcv` (total contract value), `acv` (annual contract value),
  `closeProbability`, `expectedCloseDate`, `ownerDid` (→ `person`),
  `nextAction`, `productSurfaces[]` (which Empressa surfaces are in
  scope — SmartCity OS / Cortex / Codex 1a / Codex 1b / MCP Server
  Embedder License / Revit Connector).
- **Links (outbound).**
  - `counterparty` → `lead-record`
  - `owned-by` → `person`
  - `references` → `decision-record` (decisions tied to this deal)
- **Scope.** Internal tenant. Counterparty PII is sensitive — `lead-record`
  scope controls cascade here.

### `lead-record`

- **Purpose.** Durable record of an external contact / organization
  Empressa is in conversation with. Distinct from `commercial-record`
  (which is per-deal) — a lead can produce multiple commercial records
  over time.
- **Producer.** ECI lead-intake surface; manual entry; future ingest
  from external CRMs.
- **Consumer.** Future MCP server tool `search_leads` (internal);
  Valerie-side dashboards; `commercial-record` composition target;
  stakeholder-graph cross-references.
- **Key fields.** `leadName` (person or organization), `leadType`
  (`person | org`), `organization` (if person), `role`, `email`,
  `phone`, `firstContactAt`, `relationshipStatus` (`cold | warm | engaged | partner | dormant`),
  `primaryProductInterest[]`, `sourceChannel` (how they entered the
  graph — Sylvia intro, inbound, conference, etc.), `notes`.
- **Links (outbound).**
  - `affiliated-with` → other `lead-record` (org affiliation when
    `leadType=person`)
- **Links (inbound).**
  - `counterparty` ← `commercial-record`
- **Scope.** Internal tenant. PII-sensitive per ADR-001 `piiFields`;
  scope-filtered.
- **Cross-reference.** Should cross-link to
  [`18_stakeholder_graph.md`](18_stakeholder_graph.md) entries (the
  doc-side mirror of the same relationship graph). Long-term: the
  stakeholder graph doc may be replaced by querying lead-record atoms
  via MCP.

### `knowledge-document` and `knowledge-chunk`

- **Purpose.** Atomized internal knowledge artifacts (Notion-style
  docs, meeting notes, research outputs). `knowledge-document` is
  the document-level atom; `knowledge-chunk` is the retrieval-grain
  atom underneath.
- **Producer.** ECI knowledge ingest surface (paste a doc, attach a
  file); meeting-extraction pipeline.
- **Consumer.** Future MCP server tool `search_knowledge` (internal);
  retrieval grounding for any operator-side Claude conversation.
- **Key fields (`knowledge-document`).** `title`, `source`
  (where this came from — manual, transcript, ingest), `authorDid` (→
  `person` if known), `tags[]`, `ingestedAt`.
- **Key fields (`knowledge-chunk`).** `parentDocumentDid`, `chunkIndex`,
  `chunkText`, `embeddingId` (pointer into vector index), `pageRef`
  (when applicable).
- **Links.** Document composed-of chunks per ADR-010 composition.
  Chunks reference parent document via `composed-by`.
- **Scope.** Internal tenant default; per-document override possible
  for genuinely public knowledge.

### `conversation-record`

- **Purpose.** Durable record of an operator ↔ AI agent conversation.
  Messages are composition under the conversation, not individual
  atoms (cardinality control).
- **Producer.** ECI conversation surface; future MCP server agent
  interactions.
- **Consumer.** Future MCP server tool `search_conversations`
  (internal); cross-conversation pattern aggregation; training-data
  export per [`51`](51_substrate_v1_sprint.md) Stream 2C.
- **Key fields.** `conversationTitle` (LLM-summarized), `surface`
  (`eci-internal | claude-desktop-mcp | claude-code-mcp | other`),
  `participantDids[]` (→ `person` for the operator side),
  `messages[]` (composition payload, not individual atoms),
  `startedAt`, `endedAt`, `topicTags[]` (LLM-extracted).
- **Links (outbound).**
  - `participants` → `person`
  - `references` → any atom the conversation cited (links surfaced
    via LLM-extraction pass)
- **Links (inbound).**
  - `derives-from` ← `decision-record`, `open-question`,
    `meeting-extraction` (when those atoms surface from the
    conversation)
- **Scope.** Internal tenant; PII-sensitive (operator + counterparty
  identities).

### `daily-update`

- **Purpose.** Daily synthesis atom — what changed, what's in flight,
  what closed, what's blocked. The dashboard-grade rollup.
- **Producer.** ECI daily-synthesis pipeline (LLM aggregates the
  day's `sprint-item`, `decision-record`, `commercial-record`, and
  `conversation-record` deltas).
- **Consumer.** Future MCP server tool `get_daily_update` (internal);
  Nick's morning check-in surface.
- **Key fields.** `date`, `summaryProse`, `itemsShipped[]`,
  `itemsBlocked[]`, `decisionsNew[]`, `questionsOpened[]`,
  `commercialsAdvanced[]`, `aggregationVersion`.
- **Links.** Cites every atom that changed that day (`derives-from`).
- **Scope.** Internal tenant.

### `meeting-extraction`

- **Purpose.** LLM-extracted structured summary of a meeting
  (transcript-driven). The bridge between unstructured meeting state
  and the durable atom graph.
- **Producer.** Transcript ingest pipeline (Gong / Zoom / Otter /
  manual paste → LLM extraction).
- **Consumer.** `decision-record`, `open-question`, `commercial-record`
  (each derives-from the meeting where it surfaced).
- **Key fields.** `meetingTitle`, `attendeeDids[]` (→ `person`), `meetingAt`,
  `transcriptRef` (CID of full transcript stored separately),
  `decisionsSurfaced[]`, `questionsRaised[]`, `actionItems[]`,
  `commercialUpdates[]`.
- **Links.** Heavy outbound — every atom this extraction produced
  links back via `derives-from`.
- **Scope.** Internal tenant. Some meetings may have external
  participants whose PII needs careful handling.

## Cross-cutting design choices

- **Tenant model.** All ECI atoms default to the internal-tenant
  scope (per ADR-007 stakeholder access pattern; ECI is its own
  "stakeholder tenant"). Specific atoms (e.g., `decision-record` for
  publishable commitments) may carry per-atom `scopeFlags` to allow
  external read.
- **PII handling.** Per ADR-001 `piiFields`. `person`, `lead-record`,
  `commercial-record`, `conversation-record`, `meeting-extraction`
  carry PII; scope-filtered.
- **Cardinality discipline.** Atomize the durable substrate; don't
  atomize the runtime ephemera. `messages` are composition under
  `conversation-record`, not individual atoms. `notifications` are
  runtime UX, not atoms.
- **Procedure-execution interaction.** ECI ingest passes (transcript
  → meeting-extraction; daily synthesis → daily-update) will produce
  `procedure-execution` atoms per the Q2 ADR-013 (when that lands).
  Pre-spec the producer pattern so ECI's pipelines emit these from
  day one of the atomization sprint.
- **Composition with stakeholder graph.**
  [`18_stakeholder_graph.md`](18_stakeholder_graph.md) is the
  doc-side mirror of `lead-record` + `person` atoms. Long-term
  consideration: the doc may be replaced by querying lead-record
  atoms via the internal MCP server tool surface. Don't deprecate
  the doc yet — atoms are post-51-sprint; the doc is now.
- **Knowledge document overlap with doc_repo.** This doc_repo itself
  is knowledge documents. Eventual question: do canonical docs (07,
  08, 11, 27, 49, 50, 51, etc.) get represented as
  `knowledge-document` atoms in ECI for retrieval purposes? Probably
  yes — gives operator-side Claude conversations live retrieval over
  the doc_repo via MCP. Spec the ingest path; defer activation to the
  ECI sprint.

## Open questions

Items deferred to the future ECI atomization sprint scoping:

- **ECI sprint slot.** Likely `60a_eci_atomization_sprint.md`;
  confirm when sprint is scoped.
- **Aggregation cadence for `daily-update`** (real-time vs scheduled).
- **Vector index for `knowledge-chunk`** — share infrastructure with
  `hauska-engine` Stream 1C's pgvector setup, or separate instance?
- **MCP server tool surface for internal-only atoms** — separate MCP
  endpoint for internal vs. shared endpoint with auth-gated internal
  tools? Recommendation: separate endpoint (`mcp.internal.hauska.dev`
  or similar); avoids tool-surface pollution for external agents.
- **`person` atom shape** — ADR-007 references a `person` atom for
  reviewer / city-manager / architect tenants. ECI's `team_members`
  table uses the same shape but at internal-tenant scope. Confirm
  same atom type with scope-flag distinction, not parallel types.
- **Public-publishable decisions.** Some decisions (case studies,
  public commitments) may want to publish to network. Add
  `scopeFlags` shape analogous to ADR-007 patterns; defer to sprint.
- **Audit-trail-anchor for internal decisions.** Some
  `decision-record` atoms may eventually want cryptographic anchoring
  (per ADR-006 deferred decision). Forward-compatible; no immediate
  action.
- **Migration path from existing Replit DB.** Existing rows in
  `decisions`, `sprint_items`, etc. need to atomize without losing
  history. Spec a one-shot migration step at sprint start.

## Cross-references

- [`adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md)
  — atom contract this doc operates against
- [`adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md)
  — tenant access pattern; ECI is internal-tenant
- [`adr_010_atom_graph_traversal.md`](80_adrs/adr_010_atom_graph_traversal.md)
  — link taxonomy
- [`adr_011_atom_identity_across_versions.md`](80_adrs/adr_011_atom_identity_across_versions.md)
  — DID + chain semantics
- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md)
  — atom architecture reference; existing 19 domain atoms
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)
  — engine streams; Stream B Bump 1/2/3 for external atoms (ECI
  bumps are independent on `@empressaio/atom-internal`)
- [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md)
  — MCP server that hosts the internal-read surface
- [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md)
  — substrate sprint this is gated behind
- [`18_stakeholder_graph.md`](18_stakeholder_graph.md)
  — doc-side mirror of `lead-record` + `person` atoms
- [`_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md`](_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md)
  — origin (Q1 from catalog roadmap agent)

## Revision history

- **2026-05-15 (origin).** Draft spec'd from catalog roadmap agent's
  Q1 proposal + Nick's routing decisions (separate
  `@empressaio/atom-internal` registry, own bump, own sprint
  post-51). No code; doc only. Settles the atom contract for ECI's
  internal data types so the future ECI atomization sprint starts
  with the design done.
