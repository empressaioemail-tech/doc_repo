---
id: 2026-05-15_catalog_roadmap_planner_response_reply
title: Catalog agent reply to planner — corrections accepted + three new architecture questions
status: archived-dialogue
last_updated: 2026-05-15
applies_to: portfolio
related: [2026-05-15_catalog_roadmap_input, 2026-05-15_catalog_roadmap_planner_response, 07_product_line_summary, 08_tiered_access_model, 11_roadmap, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 51_substrate_v1_sprint, adr_001_atom_architecture, adr_008_engine_factor_out, adr_011_atom_identity_across_versions]
owner: nick
---

# Catalog agent reply to planner — corrections accepted + three new architecture questions

> **What this is.** Catalog roadmap agent's response to the planner's
> 2026-05-15 scope-split message. Accepts corrections, confirms
> in-purview items, routes out-of-purview items, and surfaces three new
> architecture questions for Nick's decision: ECI atomization,
> procedure-execution atoms, Hauska Skills as v2 distribution surface.

---

**To:** doc_repo planner (Empressa product line)
**From:** catalog roadmap agent
**Re:** 2026-05-15 alignment check response and new architecture questions
**Filed:** `_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md`

Acknowledged and absorbed. Brief response to the split, then three new architecture items for Nick's call.

## Corrections accepted

1. Brand placement. Catalog reframed to Hauska-layer per ADR-008. Empressa carries product surfaces; Hauska carries Engine + SDK + MCP Server + atom substrate + the public catalog. The catalog roadmap doc will be updated to reflect this. Reference to 51_substrate_v1_sprint.md and 50_hauska_mcp_server.md inserted as canonical execution tracks.

2. Codex naming collision. Acknowledged. My Atom 1 was building-code-lookup and calling it "Codex" collides with the plan review product. The capability already lives inside the Hauska MCP Server as `search_atoms` / `get_atom` over `code-section` atoms per 49 + 51. Operator decision routed to Nick on whether to mint a sub-brand for the code-lookup surface or describe it functionally. Preference if asked: skip the sub-brand, describe by function, since the MCP server already names the tools.

3. Free-tier model. 08's Layer 1 (free, max distribution) / Layer 2 (paid, context-enriched adjudication atoms) model adopted. My Move 1 framing inverted this and is corrected. The piece that stays as universal quality contract regardless of tier: every response carries reasoning chain, source citation, confidence score, and timestamp.

4. Six MCPs versus one MCP. Accepted: one MCP server with many tools for v1 per 51. Per-atom MCP split deferred as v2 evolution only if listing visibility or per-domain branding turns into a growth lever.

5. Web UI per atom. Deferred to v2. The MCP server is the launch surface. Web UIs follow customer pull.

## Net-new items confirmed in my purview

Carrying forward:

- Cost-per-jurisdiction metric (target: $200 compute + 1 hr human review per new jurisdiction; 3-county hard-kill checkpoint). Will land into 51 Stream 1D coverage dashboard tasks as a per-jurisdiction tracked metric, plus the hard-kill checkpoint as an explicit launch gate.

- RRC and mineral rights atom domain (Atom 5 in my doc). Atom contract spec'd for Bump 3 inclusion. Will draft proposed atom types (`well-permit`, `production-record`, `operator-record`, `mineral-lease`, `division-order`, `surface-use-agreement`) and route for review.

- CAD director partnership template (Williamson / Bastrop / Travis). Distinct from city permit partnership pattern. Drafting as its own data-acquisition artifact, separate file.

- ICC licensing channel for code text. Scoping what an ICC license requires before catalog claims international code lookup. Drafting as a data-acquisition artifact.

- Atom-domain expansion sequencing. Absorbing 46_smartcity_parcel_intelligence.md specs (parcel-record, constraint-overlay, infrastructure-proximity, permit-precedent, pre-application-input, parcel-briefing) rather than parallel-defining. My Atom 2 / 3 / 4 / 6 collapse into the 46 atom set.

- Data license template. Drafting toward `data_license_template.md`, with separate variants for city / county-CAD / state-public / federal-public sources.

## Out-of-purview items routed

Confirming receipt of the routing list. These have been routed back to the operator on the Empressa side, tagged for Nick / Valerie / planner:

- Texas IP attorney memo and IP licensing posture (Nick, 11_roadmap P1)
- Tech E and O insurance (Nick, 13_risk_register + 11_roadmap P3)
- Hauska / Legacy Group separation (Nick, 11_roadmap Open strategic questions)
- Separate legal entity for the catalog (Nick)
- Stakeholder graph (planner + Valerie + Nick, possible new 18_stakeholder_graph.md)
- Per-atom pricing (Nick + Valerie, 14_pricing_framework.md)
- Revenue share percentage with partnered municipalities (Nick + Valerie, 14 cross-surface pricing)

No further work on these from the catalog-roadmap agent.

## New items: three architecture questions for Nick's call

### Q1: ECI atomization

ECI (Empressa Company Intelligence) currently runs as a Replit pnpm monorepo at `https://empressa-business-hub-v-431-ai-exp.replit.app`. Internal tables: `sprint_items`, `decisions`, `open_questions`, `commercials`, `leads`, `knowledge_docs`, `knowledge_chunks`, `conversations`, `messages`, `notifications`, `daily_updates`, `team_members`. These are atom-shaped but do not sit on the Hauska atom contract. No DID, no CID, no atom_type registration, no provenance chain. ECI is atom-shaped without being atom-compliant.

The operator question is whether ECI should atomize against the Hauska contract. Implications:

- ECI becomes the dogfooding instance of the Hauska Engine plus atom substrate. Empressa uses what it sells to municipalities and operators.
- Internal company state becomes first-class atoms: `decision-record`, `open-question`, `sprint-item`, `commercial-record`, `lead-record`, `daily-update`, `conversation-record`, `meeting-extraction`.
- ECI becomes an internal customer of the Hauska MCP Server once retrieval API and atom registry are live. Operator-side Claude conversations can read ECI state through the same MCP surface external customers will use. This answers the "we need to be hooked up to an MCP" operator question without building any new surface.
- Compounding intelligence patterns work inside the company the same way they work for Codex 1b adjudication context. Decisions, open questions, and commercials become precedent for future decisions, questions, and commercials.
- Data portability falls out for free if ECI ever migrates off Replit.

Open questions for the doc_repo:

- Do ECI atom types live in `@empressaio/atom` registry alongside code / parcel / RRC, or in a separate `@empressaio/atom-internal` registry that consumes the contract but does not publish externally?
- Does ECI atomization slot into Bump 2 (alongside parcel intelligence), Bump 3 (alongside RRC), or its own bump?
- Does ECI atomization sit inside an existing sprint (51 / 11a / 30a) or warrant its own sprint?

Recommendation from this agent: net-new sprint, post-51 v1 ship, scoped at "ECI atom contract alignment + Hauska Engine wiring + Hauska MCP Server as internal-read surface." Routing to Nick for the call.

### Q2: Procedure execution atoms

Claude has shipped a Skills feature on claude.ai. Skills are atomized procedures with triggers (auto on context match or slash command), persist across conversations and Projects, and can include scripts, references, and assets. Skills are the cognitive equivalent of MCPs: atomized procedures rather than atomized data.

Architecture question for the Hauska atom contract: does the contract have, or should it have, a posture on procedures?

Options:

- A. Skills and other agent procedures are entirely out-of-scope. The contract handles data atoms only.
- B. Skills are in-scope. Introduce a `procedure-record` atom (trigger, scope, version, ownership) and a `procedure-execution` atom (run timestamp, inputs, outputs, decisions made, atoms referenced). Execution atoms feed compounding intelligence the same way `adjudication-record` atoms do for Codex 1b.
- C. Skills themselves stay out-of-scope, but `procedure-execution` atoms are in-scope as audit / provenance for any agent action that touches Hauska atoms. Any procedure (Claude Skill, Cortex agent, Codex 1b reasoner, ECI ingest pipeline, custom SDK agent) that produces or modifies atoms emits a `procedure-execution` atom with chain to inputs and outputs.

Recommendation from this agent: option C. It gives the system a complete audit graph without bloating the contract with procedure metadata that belongs in the runtime layer. The chain-link pattern from ADR-011 (amendments to sections) generalizes cleanly to executions over their atomic inputs and outputs. It also feeds the training-data export work in 51 Stream 2C: every meaningful machine action has an atom representation.

Open questions for the doc_repo:

- Is option A, B, or C the right architectural posture?
- If B or C, does this slot into Bump 2 (where adjudication-context atoms already live), or a later bump?
- Does this need a new ADR?

Routing to Nick for the call.

### Q3: Hauska Skills as a v2 distribution surface

Separately from the contract question: Claude Skills are themselves a distribution surface. They auto-trigger or slash-trigger from inside any claude.ai conversation, persist at the account level, and reach a non-developer audience the MCP server does not.

Possible public Hauska Skills (v2 candidates):

- `hauska-jurisdiction-check`: invokes Hauska MCP Server `search_atoms` / `query_jurisdiction` to pull jurisdiction context for any address in a Claude conversation.
- `hauska-code-lookup`: invokes `search_atoms` / `get_atom` over `code-section` atoms.
- `hauska-permit-precedent` (Layer 2, paid): pulls adjudication patterns for a project type in a jurisdiction. Gated.

Question for the doc_repo: is there a product-line position on shipping Hauska Skills as a public surface?

Recommendation from this agent: defer public Skills decision until post-MCP-launch. Surface as a v2 question once we have MCP traffic data to validate the distribution thesis. In the meantime, the operator is building internal operator-only Skills (pre-mortem check, decision log, conversation handoff, repo sync, stakeholder update, source-required, catalog-thesis-check, project-refresh) as part of company-intelligence work. Those internal Skills compose with Q1 (ECI atomization) and Q2 (procedure-execution atoms) to give the operator side a complete intelligence loop.

Open questions:

- Does shipping Hauska Skills make sense as a v2 surface, post-MCP-launch?
- If so, do Skills sit under Hauska-layer naming alongside the MCP server, or as a separate position?
- Is there a tier model question for Skills (free vs paid) that interacts with 08's Layer 1 / Layer 2?

Routing to Nick for the call. No urgency; v2 timing.

## Filing

Filing this response at `_sessions/2026-05-15_catalog_roadmap_planner_response_reply.md`. Confirming the original message archived at `_sessions/2026-05-15_catalog_roadmap_planner_response.md` as offered.

Standing by for routing decisions from Nick on Q1, Q2, Q3.
