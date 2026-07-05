---
id: 50_hauska_mcp_server
title: Hauska MCP Server — v1 sprint and product framing
status: active
last_updated: 2026-07-05 (PR #35 merged: the Track C four-gate 62-tool model — public/codex/reporting/map — is now LIVE on main; atom-contract read-conformance target is 1.6.1. Prior 2026-06-21 (Track C gate rework: four product gates public/codex/reporting/map, 62 tools, +atom_trace/atom_export/read_atom_calibration, atom-contract 1.5.0 conformance, migration 003, Cortex reframed to the reporting function package per the ADR-008 amendment. Earlier 2026-06-06: current-offer reconciliation note added linking 52/53; shipped surface is 46 tools, 11 public plus 4 Codex plus 31 Cortex per the 2026-06-06 recon; Business model "Layer 1 only" framing marked superseded by the product-gated tier model. Earlier 2026-05-20 (tool-surface correction per the code-verified 44_mcp_cortex_architecture_map.md: shipped surface is 40 tools, 5 public plus 4 Codex plus 31 Cortex, flat underscore names; the section's "14 new tools" scoping superseded. Earlier: Sprint 2 tool expansion section added; Cortex + Codex existing-product tools plus L1-L6 surface tools scoped per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md and _dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md; visibility-filter on list_jurisdictions per Lane Foundation v1.1.0))
applies_to: portfolio
related: [07_product_line_summary, 08_tiered_access_model, 11_roadmap, 11a_bastrop_live_roadmap, 13_risk_register, 14_pricing_framework, 25_atom_architecture_reference, 27_engine_evolution_plan, 29_mcp_surface_tier_model, 42_design_accelerator_program_plan, 48_codex_program_plan, 49_code_ingestion_pipeline, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out, adr_012_atom_export_format, adr_017_atom_access_control]
owner: nick
---

# Hauska MCP Server

> **Purpose.** Product framing and v1 sprint plan for the Hauska MCP
> Server — a public Model Context Protocol surface exposing Layer 1
> code-atom data to AI agents. Built on the Hauska Engine; branded in
> the Hauska commercial layer per [ADR-008](80_adrs/adr_008_engine_factor_out.md).
> The MCP server is the live-query complement to `.atompack` file
> distribution (per [ADR-012](80_adrs/adr_012_atom_export_format.md)).
>
> **Status posture.** Product framing + business model — canonical
> reference. **Active execution lives in
> [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md)** (combined
> sprint with the Code Ingestion Pipeline v1 ship), which executes the
> MCP server portion across four parallel streams in the new
> `hauska-mcp-server` repo. Phase 0 decisions consolidated with
> pipeline-side decisions in 51.
>
> **Current-offer reconciliation (2026-06-06; superseded 2026-07-05).** At
> the 2026-06-06 recon the shipped surface was
> 46 tools across three gated products (11 public, 4 Codex, 31 Cortex),
> verified from the live registry per the cross-repo recon
> ([`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md)).
> **As of PR #35 merged 2026-07-05 the shipped surface is 62 tools across
> four product gates (public/codex/reporting/map)**; the three-product
> `public/codex/cortex` split no longer holds ("Cortex" is the reporting
> function package per the ADR-008 amendment, not a gate value).
> The current offer, the built-but-not-offered gap, the Tier 1/Tier 2
> build-out, and the SDK completion plan that makes paid calls transact
> are captured in [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md);
> the SDK completion sprint is
> [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md).
> The "Layer 1 only" framing in the Business model section below is
> superseded; see the note there.
>
> **Gate rework (2026-06-21, Architecture-Homes Track C — merged to main via PR #35 on 2026-07-05, now LIVE).** The monolithic
> `cortex` product gate is split into four: `public` (catalog, anonymous
> Layer 1 free), `codex` (plan review), `reporting` (brief, encumbrances,
> place/workspace, L1-L6 deliverable composition, property intel), and
> `map` (parcel, drainage, topography, hazard, GIS assembly). Wire total is
> 62 tools. Three new tools land: `atom_trace` (public, proxies the engine
> trace), `atom_export` (reporting, returns the `DownloadableAtom` shape,
> accessPolicy-gated), and `read_atom_calibration` (reporting). Every read
> envelope validates against the `@hauska/atom-contract@1.6.1` conformance
> target (published 2026-07-05); no bare scalar confidence. Migration `003_api_keys_product_gate_split`
> migrates cortex keys to reporting and mints map keys separately; legacy
> `cortex` normalizes to `reporting` at read. The Codex product still spans
> the free public-catalog lookup and the paid codex review. Per
> [`_inbox/2026-06-21_hauska-mcp-server_cc-agent-M_arch-track-c-gate-rework.md`](_inbox/2026-06-21_hauska-mcp-server_cc-agent-M_arch-track-c-gate-rework.md)
> and the homes standard ([`_architecture_homes/03_mcp_gate_and_agent_surface.md`](_architecture_homes/03_mcp_gate_and_agent_surface.md)).
> "Cortex" here means the reporting function package, not a product, per the
> ADR-008 amendment.

## End state (v1 ship)

The Hauska MCP Server runs as a public production HTTP MCP endpoint
(probable domain `mcp.hauska.dev` or equivalent, Phase 0 decision). Any
MCP-capable agent (Claude Desktop, Claude Code, Cursor, custom agents
via the Anthropic SDK or any other MCP client) can:

1. Discover the server via Anthropic's MCP directory, `awesome-mcp-servers`
   listings, or direct config.
2. Call the published tool surface against atomized jurisdictions —
   Bastrop UDC + Grand County IRC at minimum.
3. Receive responses with full atom provenance per [ADR-001](80_adrs/adr_001_atom_architecture.md)
   — every answer cites a source atom by DID + CID + source document.

End state is the production endpoint shipped, listed, and serving real
agent traffic, with logging captured for both the training-data
pipeline and commercial-use monitoring.

Paid-tier scaffolding (auth, key issuance, rate-limit bands) ships in
the same v1 but only activates commercially if Phase 0 selects Scenario
B or C.

## Business model

Detailed analysis lives in the 2026-05-15 session conversation; this
section recapitulates for sprint planning. The MCP server's standalone
P&L is small relative to other product lines. Its strategic value is
distribution + substrate-ownership + PropTech embedder enablement.

### Three revenue scenarios

| Scenario | Y1 revenue | Y2 revenue | Cost | Decision criteria |
|---|---|---|---|---|
| **A. Free-only distribution channel** | $0 | $0–100K (inbound only) | ~$50K/yr | Cheapest. No BD. Justified by lead-flow to Codex/Cortex/SmartCity OS. |
| **B. Self-serve paid tier** | $30–150K | $100–400K | ~$60K/yr | Pays for itself. No BD. Doesn't move the company. |
| **C. Self-serve + dedicated BD for embedders** | $100–400K | $500K–2M | $200–300K/yr loaded | Real revenue line. Embedder sales cycle 6–18 months. |

### Recommended tier shape (pending Phase 0)

| Tier | Limit | Price | Audience |
|---|---|---|---|
| Free / public | 1K calls/day/IP, 10K/day/key | $0 | Anyone with an LLM client |
| Developer Pro | 50K calls/day | $99–199/mo | Indie devs, AI startups |
| Team | 500K calls/day | $999–1,999/mo | Small firms, agent companies |
| Embedder License | Unmetered; per-jurisdiction terms | $20K–200K+/yr | PropTech, code rewrite firms, outsourced plan review firms |

Cities, architects, and contractors are deliberately **not** an
MCP-server customer segment — they're steered to SmartCity OS, Cortex,
or Codex respectively.

> **Superseded 2026-06-06.** The original framing here said "the MCP
> server is Layer 1 only; Layer 2 paid atoms do not appear in the MCP
> tool surface, by design." That is now stale. The shipped server is a
> product-gated three-product platform per
> [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md): the
> anonymous and public-product tier stays Layer 1, and Layer 2 reasoning
> and product tools (Codex, Cortex, and the Tier 1 wraps in
> [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) §3a)
> sit behind a product key at Layer 2. What stays unexposed is the
> moat-bearing Layer 2 **atoms** (adjudication-records,
> per-reviewer-pattern, comparable-project-precedent per
> [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)), not all
> Layer 2 surface. The moat lives in those proprietary inference atoms
> and in the products that consume the engine, not in raw public
> substrate.

### Free tier attribution

All free-tier responses include attribution metadata
("Powered by Hauska Engine — `hauska.dev`"). Embedder License removes
the attribution requirement; lower paid tiers retain it. This is the
network-effect surface that compounds substrate ownership across every
agent integration.

### Commercial-use boundary

The free tier permits non-commercial use and small-scale commercial
use (typical threshold: under a stated MAU on the consuming product).
Commercial use over the threshold requires a paid tier. Enforcement is
operationally manual at v1 — Phase 4 dashboards surface candidates;
follow-up outreach converts them.

## Where this fits in the portfolio

- **Tier model.** Layer 1 live-query surface per [`08_tiered_access_model.md`](08_tiered_access_model.md).
  `.atompack` (per [ADR-012](80_adrs/adr_012_atom_export_format.md)) is
  the offline download; MCP server is the online tool-call. Complementary
  surfaces of the same Layer 1 substrate.
- **Strategic frame.** Operationalizes the "Bring-your-own-agent public
  API" open strategic question in [`11_roadmap.md`](11_roadmap.md).
  This sprint resolves it.
- **Risk register.** Tied to Risk 1 (BYO-agent public API). Posture per
  [`13_risk_register.md`](13_risk_register.md). Settled at Phase 0.
- **Brand placement.** Hauska commercial layer per [ADR-008](80_adrs/adr_008_engine_factor_out.md).
  "Hauska MCP Server" sits alongside Hauska SDK + Hauska Engine.
  Empressa product brands (Cortex, Codex, SmartCity OS) consume the
  same substrate but stay distinct.
- **Distribution play for substrate.** Every call surfaces "Powered by
  Hauska Engine" attribution; every agent integration is a network-effect
  surface. The "first city in a network" frame for Bastrop extends to
  "first public substrate" for the MCP server.
- **Hauska Inc. external developer motion.** Open strategic question in
  [`11_roadmap.md`](11_roadmap.md); MCP server is plausibly the anchor
  surface for that motion. Decision deferred but kept in scope.

## Repo placement and migration status

The Hauska MCP Server lives at [`https://github.com/empressaioemail-tech/hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server). Repo created and bootstrapped 2026-05-18 per [Decision 2026-05-18](_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md). Bootstrap commit `d00586b` on top of GitHub's initial commit imports the v1 starter framework: five tools scaffolded (`search_atoms`, `get_atom`, `query_jurisdiction`, `get_permit_requirements`, `list_jurisdictions`) via `@modelcontextprotocol/sdk`; Streamable HTTP transport; Express host; Zod validation; API-key auth stub; structured logging stub. The repo follows the same `empressaioemail-tech` org convention used for `hauska-sdk` and the planned `hauska-engine` per [ADR-008](80_adrs/adr_008_engine_factor_out.md); the repo migrates with the rest of the Hauska org content if the Hauska Inc. GitHub org migration completes per the P3 roadmap entry in ADR-008.

The MCP server depends on the atom contract directly via `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md), not transitively through the Hauska SDK. The SDK is consumed only for paid-tier surfaces that require VDA wrapping or revenue routing per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md). No backend connection yet; `hauska-client.ts` in the repo is an interface stub awaiting M2-C `@hauska/atom-contract` publication and atom-query-layer reachability per Sprint 51 Phase 1.

The local starter files previously at `doc_repo/MCP Server/` were deleted post-migration; the canonical starter now lives in the dedicated repo. The doc_repo `.gitignore` entry for `MCP Server/` is preserved as a guard against accidental recreation.

## Sprint phasing

> **Estimated wall clock: 4–6 weeks of execution after Phase 0 closes,
> assuming Sprint A.1 of [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md)
> has loaded Bastrop UDC corpus and Stream B Bump 1 has registered the
> code atoms. If those slip, Phase 1 slips with them.**

### Phase 0 — Decisions and scope freeze

**Owner:** Nick (decision); planner (capture).
**Effort:** S (1–3 days).
**Gates:** all subsequent phases.

Phase 0 resolves the open decisions blocking kickoff. Listed in
[Open decisions](#open-decisions) below.

**Exit:** All seven open decisions answered in writing in this doc;
sprint scope frozen at the resulting shape; any updates required to
[`08_tiered_access_model.md`](08_tiered_access_model.md), [`14_pricing_framework.md`](14_pricing_framework.md),
or [`13_risk_register.md`](13_risk_register.md) follow.

### Phase 1 — Backend coupling

**Owner:** cc-agent (engine team).
**Effort:** L (1–2 weeks).
**Gates:** Phase 2 and beyond.

Wire `hauska-client.ts` (mocked in the scaffold) to the real atom query
layer backing Cortex and Codex. Today that layer lives inside
`legacy-design-tools/artifacts/api-server/src/`; Stream A of
[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) is moving
it into `storage/` and `identity/` modules pre-factor-out.

**Two routes**, chosen in Phase 0:

- **Route A (fast):** Wrap existing `legacy-design-tools/artifacts/api-server`
  endpoints directly. No coordination with Stream A; fastest to v1;
  couples MCP server to api-server release cadence until factor-out.
  Recommended.
- **Route B (clean):** Wait for Stream A `storage/` module to expose a
  stable query interface; MCP server consumes that. Slower; matches
  ADR-008 endgame but compounds Stream A's own migration-gated timing.

**Dependencies:**

- Bastrop UDC + Grand County IRC corpus loaded in production. In flight
  per [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) Sprint
  A.1 (one-off load).
- Bump 1 code atoms (`code-section`, `code-definition`,
  `code-amendment`, `code-cross-reference`, `code-edition`,
  `jurisdiction-corpus`) registered in the atom contract (M2-C target
  `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md);
  currently staged as `@workspace/empressa-atom` in legacy-design-tools).
  In flight per Stream B of [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md).

**Exit:** All five tools return real Bastrop data against the dev
corpus (189 atoms minimum); MCP Inspector pass against local server;
Claude Desktop pass against local server.

### Phase 2 — Tool surface refinement

**Owner:** cc-agent.
**Effort:** S–M (3–5 days).
**Gates:** Phase 3.

Apply tool-surface trim per Phase 0 decision. Specific candidates per
the 2026-05-15 scaffold review:

- **`query_jurisdiction`** — drop the `parcel_id` / `address` path.
  Returning "zoning, setbacks, use restrictions, overlay districts" by
  parcel requires `parcel-record` + `constraint-overlay` atoms, which
  are Bump 2 atoms per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)
  and per [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md)
  Open question #1, sequencing is open. Keep
  zoning-section retrieval by jurisdiction only at v1.
- **`get_permit_requirements`** — engine-level reasoning, not bare
  retrieval. Three options:
  1. Rename to `search_permit_atoms` (honest retrieval against
     permit-tagged code sections). Recommended.
  2. Move to paid tier (requires engine inference).
  3. Drop from v1 entirely.
- **`search_atoms`, `get_atom`, `list_jurisdictions`** — keep as-is;
  these are clean Layer 1 retrievals.

**Exit:** Tool surface matches Phase 0 decision; Zod schemas updated;
descriptions clean for LLM consumption; tool list documented.

### Sprint 2 tool expansion — Cortex + Codex tool surfaces plus L1-L6 surface tools

Added 2026-05-19 per [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md). Lane B dispatch: [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). **Shipped surface, code-verified 2026-05-20.** The full hauska-mcp-server tool surface is 40 tools: 5 public catalog (ungated), 4 Codex (product-gated), and 31 Cortex (product-gated), which is 35 product-gated plus 5 public. Registered tool names are flat with underscores (`codex_finding_generation`, `cortex_response_task_create`); the slash form used in the lists below (`codex/finding_generation`) is grouping shorthand only, since MCP has no namespace primitive. The "14 new tools" originally scoped here is superseded: the L-surface expanded to 24 tools across L1-L6, and Sprint Amendment 8 added 3 L3/L6 read tools. See [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md) for the code-verified architecture map.

**Public catalog tools (v1, unchanged):** `search_atoms`, `get_atom`, `list_jurisdictions`, `search_permit_atoms`, `query_jurisdiction`. **Filter update on `list_jurisdictions` per Sync A (v1.1.0 published 2026-05-19):** unauthenticated callers see only `accessPolicy === 'public-free'` `jurisdiction-corpus` atoms (Bastrop UDC, Grand County as of Sync 4.5); `accessPolicy === 'platform-internal'` callers (or the operator-internal scope) see all jurisdictions including partnership-pending ones (Smithville, Elgin, Bastrop County). Shape: cc-agent-AC chose **Path R — ADR-017 `accessPolicy` four-value union reuse** rather than a fresh `visibility` boolean. Wired onto AtomRegistration (type-level default), ContextSummary (per-instance override for the partnership-pending case), and AtomPromptDescription (normalized to `public-free` for downstream filters). Backward-compatible; `^1.0.0` consumers pick up automatically.

**Codex existing-product tools (Layer 2 paid, auth required, `codex/*` namespace):**

- `codex/finding_generation` — triggers engine full-pass mode against a submission; emits findings as atoms; returns finding atom IDs plus summary. Wraps existing plan-review `routes/findings.ts` POST endpoint.
- `codex/override_write` — writes an adjudication-state atom against a finding (accept / edit / reject + reviewer rationale). Wraps existing override endpoint.
- `codex/briefing_fetch` — returns a briefing atom for a given engagement.
- `codex/snapshot_ingest` — accepts a snapshot artifact (PDF + metadata) and triggers the ingest pipeline.

**Cortex existing-product tools (Layer 2 paid, auth required, `cortex/*` namespace):**

- `cortex/ifc_ingest` — accepts an IFC file; triggers ingest at `lib/ifcIngest.ts`; emits a `bim-model` atom symmetric with Push-to-Revit.
- `cortex/bim_model_query` — queries a `bim-model` atom for downstream consumers.
- `cortex/snapshot_register` — registers a snapshot against an engagement.
- `cortex/briefing_emit` — generates a parcel briefing for a given engagement.

**Cortex L-surface tools (Layer 2 paid, auth required, `cortex/*` namespace; gated per Sync B from Lane A.2 atom-shape locks):**

- `cortex/response_task_*` (L1) — response-task atom lifecycle: create, update state, list per engagement, link to finding.
- `cortex/sheet_content_extraction_*` (L2) — sheet OCR + annotation extraction trigger; fetch extracted content; list attached documents.
- `cortex/deliverable_letter_*` (L3) — draft, update, finalize a deliverable letter.
- `cortex/detail_callout_spec_*` (L4) — define a detail callout spec, list per engagement, mark push-status.
- `cortex/product_spec_reference_*` (L5) — add a product-spec reference, refresh ESR status, list per engagement.
- `cortex/deliverable_letter_render` (L6) — render a deliverable-letter atom into DOCX/PDF.

Lane B implementation is complete: all 40 tools shipped on hauska-mcp-server main. The code-verified surface is recorded in [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md).

### Phase 3 — Auth, rate limiting, key issuance

**Owner:** cc-agent.
**Effort:** M (1 week).
**Gates:** Phase 5.

- Replace in-memory rate-limit bucket in [auth.ts](MCP%20Server/files%20(6)/auth.ts)
  with Redis/Upstash for production multi-instance correctness.
- API key issuance flow. Manual at v1: admin-only endpoint behind
  bootstrap key to mint per-tier keys.
- Free-tier IP-based rate limiting with bypass for registered keys.
- Four tier bands enforced (Free / Developer Pro / Team / Embedder).
- Key hashing in logs (don't log raw keys).

**Exit:** Four tier bands enforced; key issuance documented in a
runbook under [`90_runbooks/`](90_runbooks/); manual admin operations
work end-to-end against a staging deploy.

### Phase 4 — Logging and observability

**Owner:** cc-agent.
**Effort:** M (3–5 days).
**Gates:** Phase 5.

Logging destination chosen per Phase 0. Default candidate: Postgres
index per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md) for
substrate joins, plus hot-tier blob storage (GCS) for raw request /
response payloads. Coordinates with ADR-010's Postgres choice so MCP
traffic data can be joined to atom-graph data.

Capture per request:
- Method, params, IP, key (hashed), tier
- Response status, atom IDs returned, latency
- Tool called, jurisdiction queried

Aggregate dashboards:
- Calls/day by tool, jurisdiction, tier
- Top jurisdictions queried
- Error rate
- Commercial-use detection: high-volume free-tier IPs surface for BD
  outreach

**Exit:** Logs flowing to chosen destination; dashboard visible to Nick
+ planner; one week of internal testing traffic captured and queryable.

### Phase 5 — Deploy to production

**Owner:** cc-agent.
**Effort:** M (3–5 days).
**Gates:** Phase 6.

Deploy to the host chosen in Phase 0. Default: Cloud Run, matching
SmartCity OS posture and the gcloud tooling already in flight per
[`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md).

- Domain: `mcp.hauska.dev` or equivalent (Phase 0 decision).
- TLS via managed cert.
- Health endpoint already in scaffold (`/health`).
- Cloud Run autoscale; min-instances=1 to avoid cold-start hits on the
  first agent call.
- Same cutover env-var procedure as SmartCity OS per
  [`90_runbooks/cutover_env_var_bind_procedure.md`](90_runbooks/cutover_env_var_bind_procedure.md)
  to avoid the silent-drop bucket from the 2026-05-03 lesson.

**Exit:** Public endpoint serving; health green; first external test
call from a non-localhost agent succeeds.

### Phase 6 — Documentation and cross-client testing

**Owner:** planner + cc-agent.
**Effort:** M (1 week).
**Gates:** Phase 7.

- Public docs site (small static site on same domain or subdomain):
  schema reference, example queries, attribution requirements, free vs
  paid tier definitions, ToS, commercial-use boundary.
- MCP Inspector pass (the official Anthropic tool).
- Claude Desktop pass.
- Claude Code pass.
- Cursor pass (verify MCP integration state at that point).
- Custom Anthropic SDK agent pass (representative third-party shape).

**Exit:** All five clients verified end-to-end; docs published; example
agent code published as a public GitHub gist or repo.

### Phase 7 — Public launch

**Owner:** Nick + planner.
**Effort:** M (3–5 days work; 1–2 weeks calendar).
**Gates:** sprint exit.

- Anthropic MCP directory submission.
- `awesome-mcp-servers` GitHub PR.
- HackerNews / ProductHunt launch coordination.
- Brief launch blog post on `hauska.dev` (or equivalent).
- Coordinated social posts.
- Press / industry outreach (PropTech publications, AEC tech press).

**Exit:** Listed in MCP directory; one external call from a
non-Hauska-team agent recorded in production logs.

### Phase 8 — Self-serve paid tier (conditional)

**Owner:** cc-agent + Nick.
**Effort:** L (1–2 weeks).
**Conditional on:** Phase 0 choosing Scenario B or C.

- Circle (USDC-native) metered billing for Developer Pro / Team tiers. The v1 fiat rail is Circle, switched off the Stripe Connect placeholder 2026-05-21 (`_decisions/2026-05-21_fiat_rail_circle.md`); metering-to-payment design per `_architecture_homes/03_mcp_gate_and_agent_surface.md`. (Phase-1 Track C metering design referenced Stripe; corrected to Circle.)
- Self-serve signup flow → automated key issuance.
- Billing dashboard.
- Plan upgrade / downgrade.
- Usage metering hooked to billing.

**Exit:** A non-Hauska user can self-serve sign up and pay for a Pro
plan; key works against the rate-limited tier; first paid signup
recorded.

### Phase 9 — BD enablement materials (conditional)

**Owner:** Nick + BD person (if hired).
**Effort:** M (1 week active; calendar TBD).
**Conditional on:** Phase 0 choosing Scenario C.

- PropTech embedder pitch deck.
- Per-jurisdiction pricing sheet.
- Contract template for Embedder License tier.
- Initial outreach list (priority order, indicative):
  - **PropTech embedders.** Yardi, Tyler, Accela, CompStak, Crexi,
    Reonomy, AppFolio
  - **Code rewrite firms.** Code Studio, ZoneCo, Camiros
  - **Outsourced plan review firms.** SAFEbuilt, Bureau Veritas, NV5,
    Charles Abbott

**Exit:** First outreach sent; one warm conversation in flight.

## Open decisions

Seven Phase 0 decisions. All resolved per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close (2026-05-18) and the prior 2026-05-16 Scenario B decision. Combined record at [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md).

1. **Revenue model.** ~~Scenario A / B / C (see [Business model](#business-model)).~~ **Resolved 2026-05-16: Scenario B (self-serve paid tier).** Decision record at [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](_decisions/2026-05-16_hauska_mcp_server_scenario_b.md). Four-tier shape (Free / Developer Pro / Team / Embedder License) confirmed in [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md). Phase 8 (self-serve paid tier infrastructure) moves from conditional to in-scope; Phase 9 (BD enablement materials) remains conditional and out of scope for Scenario B.
2. **BD ownership** (if Scenario C). ~~Nick / Valerie / new hire / hold-for-now.~~ **Resolved 2026-05-18: N/A under Scenario B; revisit only if Scenario C ever activates.** Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.
3. **Hosting target.** ~~Cloud Run / Vercel / Cloudflare Workers.~~ **Resolved 2026-05-18: Cloud Run.** Matches SmartCity OS operational posture; gcloud tooling and runbooks already in flight per [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md). Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.
4. **Tool surface trim.** ~~Drop `query_jurisdiction` parcel path? Drop, rename, or paid-tier `get_permit_requirements`?~~ **Resolved 2026-05-18: drop parcel path; rename `get_permit_requirements` to `search_permit_atoms`.** Parcel atoms are Bump 2 per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Stream B and [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md) open question #1; `search_permit_atoms` is the honest Layer 1 retrieval shape. Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.
5. **Logging destination.** ~~Postgres (coordinated with ADR-010) / GCS+BigQuery / Snowflake / hybrid.~~ **Resolved 2026-05-18: Postgres index per ADR-010 + GCS raw payloads.** Joins MCP traffic data to atom-graph data per ADR-010. Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.
6. **Backend coupling route.** ~~Route A (wrap api-server now) vs Route B (wait for Stream A factor-out).~~ **Resolved 2026-05-18: Route A.** `hauska-engine` is bootstrapped net-new in [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md); MCP server wraps its retrieval-api directly; no legacy api-server wait needed. Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.
7. **Key issuance.** ~~Manual at v1, automate at Phase 8 / day one automation.~~ **Resolved 2026-05-18: Manual at v1 via admin endpoint behind bootstrap key; auto-issuance lands at Phase 8.** Per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close.

## Dependencies (external to this sprint)

- **Sprint A.1 of [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md)** —
  Bastrop UDC + Grand County IRC one-off corpus load. Phase 1 cannot
  complete without it. Coordination via 11a Track A planner thread.
- **Stream B Bump 1 of [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)** —
  code atom types registered. Tools return these atoms.
- **Stream A `storage/` module** (only if Route B chosen for Phase 1).
- **M-Stabilize completion is NOT a hard dep** — MCP server can wrap
  legacy-design-tools api-server while migration is in flight. Factor-out
  per [ADR-008](80_adrs/adr_008_engine_factor_out.md) improves the
  architecture but doesn't gate v1.

## Risks

1. **Phase 1 backend dependency slips.** If Bastrop corpus load slides
   or Bump 1 isn't ready, Phase 1 stalls. **Mitigation:** Route A
   (api-server wrap) compresses dependency; pre-Phase-1 dev work can
   use mocked client against the existing 189-atom Bastrop dev corpus
   to derisk integration.
2. **Scenario C requires hire that isn't sourced.** No BD person
   identified today. **Mitigation:** launch as Scenario A or B; escalate
   to C when first embedder inbound conversation surfaces.
3. **PropTech embedder sales cycle slower than Y1 projection.** Standard
   6–18 month enterprise cycles; Y1 closes may push to Y2.
   **Mitigation:** honest projection; don't budget against Y1 embedder
   revenue.
4. **Commercial-use enforcement is operationally manual.** Detecting
   high-volume free-tier users and converting them requires someone
   watching logs. **Mitigation:** Phase 4 dashboards surface candidates;
   Nick or BD person triages weekly.
5. **MCP protocol churn.** Streamable HTTP (2025-03-26) is the current
   transport. Spec evolves. **Mitigation:** pin SDK version; reassess
   transport at v2 (per scaffold README).
6. **Municode / eCode360 ship competing MCP servers.** Probable.
   **Mitigation:** context-layer differentiation (Layer 2 paid atoms)
   lives in Codex 1b — MCP server itself stays Layer 1, the moat lives
   in the products that consume MCP server's output.
7. **Regulator / jurisdiction pushback.** Some cities may object to
   programmatic access to their code. Code is public; risk is low but
   non-zero. **Mitigation:** opt-out mechanism for jurisdictions if
   requested; document in ToS.
8. **LLM provider eats the niche.** Anthropic could partner with
   Municode directly. **Mitigation:** atom contract + provenance + city
   relationships are the durable substrate; raw text retrieval is not
   the moat.

## What's deliberately absent from v1

- **Layer 2 paid atoms** (adjudication-records, per-reviewer-pattern,
  comparable-project-precedent). These belong only inside Codex 1b.
  Surfacing them via MCP would undermine the moat.
- **OAuth 2.1.** Header API keys are sufficient for v1. OAuth lands in
  v2 per MCP roadmap.
- **Resources / Prompts MCP primitives.** Only Tools in v1. Resources
  and Prompts are additive in v2.
- **Multi-jurisdiction beyond Bastrop + Grand County.** v1 ships the
  two jurisdictions in the dev registry. The Code Ingestion Pipeline
  ([`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md))
  produces additional jurisdictions; each new jurisdiction onboards via
  the pipeline, not the MCP server.
- **Cryptographic audit-trail-anchor.** Gated on Stream E SDK gap
  closure per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md).
  Atom provenance in v1 responses includes content hash + source adapter
  + fetched-at, which is sufficient for the "verified ground truth"
  claim without the full chain.
- **Cities / architects / contractors as paying MCP customers.** Steered
  to SmartCity OS / Cortex / Codex respectively.
- **Anonymous-aggregate adjudication patterns** ("most jurisdictions
  interpret § X this way"). Flagged as a possible free-tier paid-tier
  teaser in [`08_tiered_access_model.md`](08_tiered_access_model.md)
  Open for refinement; not in v1.

## Cross-references

- [`07_product_line_summary.md`](07_product_line_summary.md) — product
  line context; MCP server is the public Hauska-layer surface
- [`08_tiered_access_model.md`](08_tiered_access_model.md) — tier model
  this sprint operationalizes
- [`11_roadmap.md`](11_roadmap.md) — portfolio roadmap; this sprint
  resolves the "Bring-your-own-agent public API" open strategic question
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — Sprint
  A.1 corpus load this sprint depends on
- [`13_risk_register.md`](13_risk_register.md) — Risk 1 (BYO-agent
  public API)
- [`14_pricing_framework.md`](14_pricing_framework.md) — pricing posture
  (Path A vs Path B); embedder deals are Path B candidates
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — Stream B
  Bump 1 atoms this sprint surfaces; Stream A storage module for Route B
- [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) — the
  width-moat pipeline producing free-tier substrate this MCP exposes
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md)
  — atom contract MCP responses honor
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md)
  — access scopes; MCP enforces Layer 1 only
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
  — brand placement; MCP server is Hauska-layer
- [`80_adrs/adr_012_atom_export_format.md`](80_adrs/adr_012_atom_export_format.md)
  — `.atompack` is the offline complement to MCP's live-query surface
- Repo: [`https://github.com/empressaioemail-tech/hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server)
  — created and bootstrapped 2026-05-18 (bootstrap commit `d00586b`) per
  [Decision 2026-05-18](_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md).

## Revision history

- **2026-05-18 (Phase 0 close).** Decisions 2 through 7 resolved per [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) Phase 0 close (combined record at [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md)). All seven Phase 0 decisions now resolved (decision 1 was resolved prior 2026-05-16 as Scenario B). Stream-level dispatch across Phases 1 through 9 unblocked. `hauska.dev` registration remains a pre-launch action item per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) Domains section.
- **2026-05-18 (post-session-close).** MCP server repo created and bootstrapped at [`https://github.com/empressaioemail-tech/hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server) (bootstrap commit `d00586b`). Five tools scaffolded; Streamable HTTP transport; Express host; Zod validation; auth and logging stubs. Local starter files at `doc_repo/MCP Server/` deleted; `.gitignore` entry preserved as guard. Repo-placement section flipped from "migrating" to "lives at"; scaffold-location pointer in Cross-references replaced with the live repo URL. Companion to the same-day rename of the atom-contract M2-C target to `@hauska/atom-contract` in `legacy-design-tools/lib/empressa-atom/README.md` (PR #25, squash-merged to main).
- **2026-05-18.** Repo-placement section added per [Decision 2026-05-18](_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md): MCP server starter migrates from `doc_repo/MCP Server/` to dedicated `empressaioemail-tech/hauska-mcp-server` repo. Bump 1 atom-package reference updated to `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md). Scaffold-location pointer updated to note migration in flight; will be replaced with new repo URL once Nick creates the repo.
- **2026-05-16.** Phase 0 decision #1 (revenue model) resolved as Scenario B (self-serve paid tier) during the 2026-05-16 per-product MCP surface tier model session. Decision record at [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](_decisions/2026-05-16_hauska_mcp_server_scenario_b.md); tier model context in [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md). Open decisions list reduced from seven to six. Phase 8 (self-serve paid tier) moves from conditional to in-scope.
- **2026-05-15 (origin).** Sprint drafted from MCP server scaffold
  review + business model analysis session. Phase 0 decisions explicit;
  Phase 1–9 sprint structure laid out; three-scenario business model
  carried over from conversation; tier shape proposed for Phase 0
  confirmation. Resolves the "Bring-your-own-agent public API" open
  strategic question from [`11_roadmap.md`](11_roadmap.md) into an
  active sprint.
