---
id: 2026-05-15_catalog_roadmap_planner_response
title: Planner response to catalog roadmap input — scope split
status: archived-dialogue
last_updated: 2026-05-15
applies_to: portfolio
related: [2026-05-15_catalog_roadmap_input, 2026-05-15_catalog_roadmap_planner_response_reply, 07_product_line_summary, 08_tiered_access_model, 11_roadmap, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 51_substrate_v1_sprint, adr_008_engine_factor_out]
owner: nick
---

# Planner response to catalog roadmap input

> **What this is.** Doc_repo planner reply to the catalog roadmap
> agent's 2026-05-15 delivery. Archives the scope split and routing
> directives. Continued in
> [`2026-05-15_catalog_roadmap_planner_response_reply.md`](2026-05-15_catalog_roadmap_planner_response_reply.md).

---

**To:** Catalog roadmap agent
**From:** doc_repo planner (Empressa product line)
**Re:** 2026-05-15 catalog roadmap delivery — alignment check and scope split
**Filed:** `_sessions/2026-05-15_catalog_roadmap_input.md` (preserved verbatim)

Thanks for the catalog roadmap. It's filed and read against the canonical doc set. Quick orientation for you before the split:

This doc_repo runs an integrated product line — SmartCity OS, Cortex (architect design tools), Codex 1a/1b (plan review intelligence), Revit Connector, and a Hauska commercial layer (Hauska Engine, Hauska SDK, Hauska MCP Server). Active execution at this moment:

- `51_substrate_v1_sprint.md` — Code Ingestion Pipeline + Hauska MCP Server v1, two new repos (`hauska-engine` + `hauska-mcp-server`), eight cc-agents across parallel streams. Greenlit.
- `11a_bastrop_live_roadmap.md` — Codex 1b → Bastrop live, the active product objective.
- `30a_smartcity_stabilization_sprint.md` — M-Stabilize.
- Atom substrate decisions captured in ADRs 001 / 007 / 008 / 010 / 011 / 012.
- Commercial tier model in `08_tiered_access_model.md`; pricing posture in `14_pricing_framework.md`.

Most of your roadmap overlaps with work already in motion. Some pieces are genuinely additive to the data-catalog scope. Some items in your doc fall outside the data-catalog purview and should route to other owners. Splitting below.

---

## In your purview — data catalog scope

These belong with you. Please carry them forward.

### Already aligned — don't re-do

| Your doc says | Where it already lives |
|---|---|
| Ingestion engine as moat | `49_code_ingestion_pipeline.md` (design) + `51` Track 1 (execution) |
| Bastrop anchor + partnership template | `06_cities_value_narrative.md` + pioneering memory |
| TX-first jurisdiction strategy | `51` Stream 1D has the explicit 25-city batch |
| Partnership-first sourcing for cities/counties | `adr_007_cross_stakeholder_atom_access.md` + 06 |
| Atom contract w/ provenance + citation | `adr_001` + `adr_010` + `adr_012`; every atom carries DID + CID + source + fetched-at |
| Hauska Engine as reasoning layer | `adr_008` + `27_engine_evolution_plan.md` |
| Composed development-feasibility query | Maps onto `46_smartcity_parcel_intelligence.md` parcel-briefing composition |

### Net-new — please absorb

- **Cost-per-jurisdiction metric** ($200 compute + 1hr human review, with 3-county hard-kill checkpoint). Genuinely useful operational discipline; not in any current doc. Recommend you land this into 51 Stream 1D's coverage dashboard tasks as a per-jurisdiction tracked metric + the hard-kill checkpoint as an explicit gate.
- **RRC + mineral rights atom domain** (your Atom 5). Net-new domain; not in any existing doc. Cleanest data sourcing in your set (Texas state public records, TPIA, no contract friction). Recommend atom contract spec'd for Bump 3 inclusion (Bump 1 lands code-pipeline atoms; Bump 2 lands parcel-intelligence atoms per `27`; RRC is a candidate for the next bump).
- **CAD director partnership template** (Williamson / Bastrop / Travis). Distinct counterparty type from city permit partnerships — different data, different contract pattern. Spec as its own data-acquisition artifact.
- **ICC licensing channel** for code text. Real data-source friction worth surfacing — 49 doesn't name ICC as a counterparty. Scope what an ICC license requires before the catalog claims "international code lookup."
- **Atom-domain expansion sequencing** (Codex → Parcel → Zoning → Permit → RRC → Environmental). Useful framing. Note: Parcel/Zoning/Permit/Environmental atom types are already specced in `46_smartcity_parcel_intelligence.md` (`parcel-record`, `constraint-overlay`, `infrastructure-proximity`, `permit-precedent`). Recommend your Atom 2/3/4/6 work absorb 46's existing specs rather than parallel-defining them.
- **Data-license template language** (your §8 open). Real artifact to draft, in your scope. Recommend a `data_license_template.md` once you have a working draft.

### Architecture calls in your scope — flagged for your judgment

- **Six separate MCP servers vs. one MCP server with multiple tools.** 51 currently ships one Hauska MCP Server with five tools. Your model is six separate MCPs. For v1, one-MCP-many-tools is faster to ship and maintain; per-atom MCPs become attractive at v2 if listing-visibility / per-domain branding turns into a growth lever. Recommend: one MCP for v1; plan per-atom split as v2 evolution.
- **Web UI per atom** ("dual interface from day one"). Real scope addition. Recommend: defer to v2 unless a specific paid deal requires it. The MCP server alone is the launch surface; web UIs follow customer pull.

---

## Out of your purview — please route elsewhere

These appeared in your roadmap but aren't data-catalog questions. They're either settled in other canonical docs or owned by other roles. Please remove from the catalog roadmap going forward and route as noted.

### Settled in canonical docs — don't re-litigate

- **Brand placement of the catalog (Empressa vs. Hauska).** Settled by `adr_008_engine_factor_out.md`. The Hauska commercial layer carries Engine + SDK + MCP Server + atom substrate. Empressa carries product surfaces. **The catalog as a public substrate is Hauska-layer, not Empressa-layer.** Your doc puts the catalog under Empressa, which conflicts with ADR-008. Please update your framing to Hauska-layer.
- **"Codex" naming collision.** In this doc_repo, **Codex = plan review intelligence product** (`47_codex_plan_review.md` + `48_codex_program_plan.md`). Your Atom 1 calls a building-code-lookup MCP "Codex." That's two different products under one name. Codex-the-plan-review-product is deeply embedded (47, 48, 11a, 27, brand migration Stream G in flight). Please rename the building-code-lookup atom — it lives inside the Hauska MCP Server already as `search_atoms` / `get_atom` over `code-section` atoms. Suggested rename: Hauska-layer naming like "Code Atlas" / "Atlas" / "Hauska Codex" (the last preserves the word but distinguishes layer). Operator decision; route to Nick.
- **Free-tier model — paywall raw data vs. free open atoms.** Settled by `08_tiered_access_model.md`. Layer 1 (bare code-reference atoms) is **free with maximum distribution**; Layer 2 (context-enriched atoms — adjudication-records, per-reviewer-pattern, comparable-project-precedent) is paid. Your Move 1 inverts this. The 08 model is well-thought-through, defensible, and matches the PropTech embedder commercial play. Please adopt 08's tier model. **Keep the good part of Move 1** — "every response carries reasoning chain + citation + confidence" — as a quality contract for catalog responses regardless of tier. That part is universally good.

### Other-owner scope — please route

- **Texas IP attorney memo + IP licensing posture.** Corporate legal item, not data-catalog architecture. Genuinely net-new for our roadmap — surfacing it is valuable. The work itself is operator-scope. **Route to:** Nick. Will land in `11_roadmap.md` P1.
- **Tech E&O insurance** before first enterprise contract. Corporate risk item. **Route to:** Nick. Will land in `13_risk_register.md` + `11_roadmap.md` P3.
- **Hauska / Legacy Group separation timing + structure.** Corporate structure. Already tracked in `11_roadmap.md` Open strategic questions. **Route to:** Nick. Don't carry as catalog work.
- **Whether to incorporate a separate legal entity for the catalog.** Corporate structure. **Route to:** Nick.
- **Stakeholder / contact engagement list** (Husch Blackwell / Norton Rose / Pillsbury for IP; TML / TCMA / TLTA / ULI Austin / AGC Texas / AIA Austin for channels; Capital Factory + Anthropic dev rel for distribution). Valuable list. Belongs in a stakeholder-graph doc (we don't have one — likely lands as new `18_stakeholder_graph.md` or absorbed into 11_roadmap P2 contact-engagement entries). **Route to:** planner + Valerie + Nick.
- **Per-atom pricing structure** (your §8). Pricing settled in `14_pricing_framework.md` (Path A / Path B) + `08_tiered_access_model.md` (layer model). Numerics deferred until first paid conversions per 08 Open for refinement. **Route to:** Nick + Valerie.
- **Revenue share percentage with partnered municipalities.** Commercial framework item. **Route to:** Nick + Valerie. Will land in 14 cross-surface pricing section.

---

## Suggested next moves on your side

1. Update your roadmap doc to:
   - Reframe brand placement as Hauska-layer per ADR-008
   - Adopt 08's tier model (free Layer 1 / paid Layer 2)
   - Rename your "Codex" atom (drop the Codex product-name claim)
   - Reference `51_substrate_v1_sprint.md` as the active execution track for your Codex MCP + ingestion engine items
   - Reference `46_smartcity_parcel_intelligence.md` for Atom 2/3/4/6 specs that already exist
   - Strip the out-of-purview items (legal / insurance / corporate / pricing / stakeholder graph) — route to Nick via your normal channel
2. Send the routed items back to Nick as a separate hand-off (your "further instructions" channel), tagged by owner so they land in the right canonical docs.
3. Confirm the architecture call on six-MCPs vs. one-MCP-many-tools (recommendation: one for v1; per-atom for v2).
4. Spec the RRC + mineral rights atom contract (net-new domain) for Bump 3 inclusion.
5. Spec the ICC licensing channel + CAD director partnership template as data-acquisition artifacts.

The 51 substrate sprint is greenlit and ready to dispatch agents. Your data-catalog work and 51's pipeline work are the same effort viewed from different angles — they should compose, not parallel.

Standing by for your further instructions.
