---
id: 2026-05-27_place_graph_tx_crg_minerals_claude_code
title: Session — Place graph strategy, competitive landscape, TX CRG + minerals
date: 2026-05-27
agent: planner (claude_code)
repo: doc_repo
session_type: strategic
rolled_up: false
related: [77_place_graph_strategy, 77a_txcrg_crm_and_brokerage_ops, 09_post_saas_substrate_thesis, 75_hauska_brokerage_workflow_plan, 49b_encumbrance_ingestion_pipeline, _sessions/2026-05-15_catalog_roadmap_input]
---

## TL;DR

Recalibrated portfolio strategy around a **country-scale place graph** (not jurisdiction-count catalog). Filed [`77_place_graph_strategy.md`](../77_place_graph_strategy.md) and [`77a_txcrg_crm_and_brokerage_ops.md`](../77a_txcrg_crm_and_brokerage_ops.md). Incorporated operator conversation on **Texas Commercial Realty Group (TX CRG)** CRM, **mineral deeds / O&G leases** on legal description, **data-center** surface+mineral buyers, and **O&G land-admin** as a future landing pad.

## Strategic recalibration (agreed direction)

One paragraph distilled for execution:

Stop racing on jurisdiction count or consumer feasibility PDFs. Ship the **place graph**: Regrid-backed parcel identity, cited layers (ICC L1 + municipal law + federal physical), MCP `place_dossier` with metering, ICC/GC integrator deals. Texas ingest = plane A factory; success = **places with complete layers**. Bastrop operational precedent is the wedge competitors lack.

## Operator conversation captured (TX CRG + minerals)

**Source:** Voice conversation (principal operator ~85%; Nick ~15%). Participants referenced: Ron Brown, Herbert Melton (partners).

### TX CRG CRM

- TX CRG needs CRM; Google Ads leads to shared email; leads lost without tracking  
- Want: lead → prospect → client → contract with dates (close, option, indefeasibility)  
- Salesforce explored; too heavy for current admin capacity  
- Principal uses **Access + Outlook** (RE + O&G contact DBs); partners lack shared system  
- Want: **Google address research → push into CRM** as seller/buyer; automated nurture (holidays, etc.)  
- Parallel to Hauska extension vision: type address in Google → attach intelligence → CRM  

### Minerals and legal description

- **Legal description** (CAD meets & bounds, plat lot/block) is the driver—not street address alone  
- **High-level** county clerk index: mineral deeds (conveyance), O&G leases (mineral owner signal)—not full title run sheet  
- Coverage caveats: online pools vary (e.g. Montgomery back to patent; many counties ~1964+ electronic); gaps require manual verification  
- Texas **dominant mineral estate**; surface waivers (ingress/egress) for development (e.g. Crosby 37 ac, 350 apartments, same surface/mineral owner)  
- **Data centers:** buyers seeking ~8,000 ac surface **and** minerals for on-site generation (methane/waste gas value)—new buyer class  

### O&G horizon

- Land side: title patent-to-present, leases, division orders; PE shortcuts vs proper diligence  
- Production tracking, methane, saltwater disposal, refined vs upstream—**land admin** is the known wedge for operator  
- Natural landing pad: **O&G platform** (replacement for land-admin tooling), not the same as architect Cortex  
- Catalog Atom 5 (RRC + mineral rights) from 2026-05-15 roadmap input remains valid Bump-3+ horizon  

### Airspace and replatting

- 1,000 ac replatted to 300 lots: legal description hierarchy (parent survey vs child lots)  
- Airspace rights queued until surface/legal graph stable  

## Competitive analysis (summary)

| Archetype | Examples | Gap vs place graph |
|-----------|----------|-------------------|
| AI site reports | Buildability, Atria, Aino | Reports not graph; weak effective code |
| Zoning API | Zoneomics, Gridics | Zoning not L1+L2+L3 code composition |
| Code + AI | UpCodes (800k users, Copilot, 2026 Specs) | No parcel graph; no public API |
| Permits | Shovels | Not normative law |
| CRE warehouse | LightBox, Cherre | Data not reasoning-first |
| AEC workflow | Autodesk Forma + Zoneomics ext | Walled garden |

**Hauska white space:** place node + effective rule + procedure-execution + MCP + licensor rev-share + mineral index + city precedent.

## Canonical docs produced

| Doc | Action |
|-----|--------|
| [`77_place_graph_strategy.md`](../77_place_graph_strategy.md) | **New** — north star, planes, vertical estates, milestones, sequencing |
| [`77a_txcrg_crm_and_brokerage_ops.md`](../77a_txcrg_crm_and_brokerage_ops.md) | **New** — TX CRG CRM wedge |
| [`00_README.md`](../00_README.md) | Band 70-79 line updated for 77/77a |
| This session | Filed |

## Suggested follow-ups (not done)

- Amend [`09_post_saas_substrate_thesis.md`](../09_post_saas_substrate_thesis.md) with one paragraph pointer to 77  
- [`18_stakeholder_graph.md`](../18_stakeholder_graph.md): add TX CRG, Ron Brown, Herbert Melton if names confirmed  
- ADR scaffold: `legal-description` as first-class place anchor; mineral index as substrate vs product-only  
- ICC / General Code meeting briefs aligned to graph + metering asks  
- `_decisions/2026-05-27_place_graph_north_star.md` if operator wants decision record  

## Rollup status

Pending operator review of 77/77a. No change to `00_current_state.md` this session (strategic filing only).
