---
id: 73_partnerships
title: Partnerships â formalized partnership state
status: active
last_updated: 2026-05-22 (Pflugerville and Cedar Park added to the General Code eCode360 row and an EncodePlus / GovOS aggregator row logged, per cc-agent-E's Sync 5 Tier 1 close recon. Prior 2026-05-21: Standards-body licensor partnerships section added.)
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 13_risk_register, 18_stakeholder_graph, 30_smartcity_os, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 70_bizops_overview, 71_pipeline, 74_commercial_agreements]
owner: nick
---

# Partnerships

> **Formal partnership state.** Operational counterpart to [`18_stakeholder_graph.md`](18_stakeholder_graph.md) (which is the relationship graph). This doc tracks which counterparties are formal Hauska partners under the partnership-first sourcing commitment, what the partnership terms look like, and what the partnership template should look like as the pattern scales.

## Partnership-first sourcing commitment

Per the [four structural commitments](../CLAUDE.md) (commitment #2): cities, counties, and firms are licensors with structural revenue share, not data sources to be scraped. Bastrop is the template. Every new jurisdiction onboarded under the public catalog stack should follow the Bastrop-shaped partnership pattern unless explicitly justified otherwise.

The partnership-preferred rule (per CLAUDE.md decision rules) reads: target partnership cities go through Sylvia, not scraping. Scraping is the fallback for jurisdictions that decline partnership; partnership is the default.

## Active partnerships

### Bastrop â pioneering city (template)

- **Status.** Active. Anchor customer (per [`30_smartcity_os.md`](30_smartcity_os.md)) and partnership template per the partnership-first sourcing commitment.
- **Primary contacts.** Sylvia Carrillo (city manager); Valerie. Per [`18_stakeholder_graph.md`](18_stakeholder_graph.md).
- **Narrative framing.** Per the user-memory `bastrop_pioneer_narrative`: frame Bastrop as the pioneering first city in a network, not as a data source feeding other cities. The narrative matters for both Bastrop-facing communication and the broader partnership pattern.
- **Revenue share.** Structural revenue share contemplated; specific terms gated on the Bastrop revenue-share contract operational pilot per [`14_pricing_framework.md`](14_pricing_framework.md) substrate-state subsection. First real money movement through this partnership gates Phase 3 of the SDK payment substrate.
- **Cross-jurisdictional surfacing.** Per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) and the pioneering-city framing, cross-jurisdictional surfacing of Bastrop atoms is opt-in by the source jurisdiction. Default scope is jurisdiction-local; network publish is a separate flag.

## Partnership template

Working draft of the pattern Bastrop establishes for future partnerships. Refined as more partnerships land.

| Element | Bastrop instance | Generalized |
|---|---|---|
| **Anchor product** | SmartCity OS deployment | First product surface running in the partner's environment |
| **Source obligation** | Jurisdiction provides MyGov / permit / parcel / GIS data | Partner contributes the jurisdiction-specific source data |
| **Atomization rights** | Hauska atomizes; jurisdiction co-owns | Hauska atomizes; partner retains source-data ownership; atoms carry licensing metadata per the atom contract |
| **Revenue share** | Structural percentage on Layer 2 paid calls touching partner-sourced atoms | Same shape; specific percentages per partnership |
| **Network surfacing** | Opt-in per ADR-007 | Opt-in by default; partner controls cross-jurisdictional exposure |
| **Pioneering narrative** | Bastrop as first in a network | Each new partnership joins the network; not "another data source" |
| **Cost discipline** | Under 200 dollars compute + one hour human review per jurisdiction (CLAUDE.md commitment #3) | Same discipline; hard kill at three counties if not achievable |

## Pipeline of future partnerships

Sourced from [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) and [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md). These are jurisdictions on the target list; partnership status is not yet established.

| Jurisdiction | Source | Status |
|---|---|---|
| **Grand County** | [`51`](51_substrate_v1_sprint.md) | One-off + B.6 validation pass; Bastrop-equivalent unblocked posture; partnership terms TBD |
| **Texas-first 25-city list** | [`51`](51_substrate_v1_sprint.md) Stream 1D; Sync 5 expansion | Partnership-first sourcing per the template. Not gated on the Texas IP attorney memo: Sync 6 was retired 2026-05-19, and the layered substrate runs on the interim deep-link footing per [ADR-019](80_adrs/adr_019_layered_code_substrate.md). The memo is parallel bizops in [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md). |

## Publisher / aggregator partnerships

Distinct from jurisdiction partnerships above. Publisher partnerships unlock many jurisdictions per partnership because the publisher hosts the ordinance content for multiple cities. Strategic leverage: one partnership conversation opens N jurisdictions where N is the publisher's customer list.

| Publisher | Coverage | Status | Triggering finding |
|---|---|---|---|
| **General Code (eCode360)** | Smithville, Pflugerville, and Cedar Park (eCode360 instance IDs SM6484 / PF6442 / CE6271), plus many other small/mid-TX cities. Pflugerville and Cedar Park are confirmed eCode360-blocked Sync 5 Tier 1 cities per cc-agent-E's 2026-05-22 recon. | **Partnership target — pending outreach.** Surfaced 2026-05-19 per cc-agent-E's Smithville structural-blocker recon at [`_sessions/2026-05-19_smithville_ecode360_blocker_cc-agent-E.md`](_sessions/2026-05-19_smithville_ecode360_blocker_cc-agent-E.md). | Smithville code on eCode360 returns HTTP 403 for both ingest and browser user-agents (bot protection); robots.txt disallows `/documents/`, `/search`. Direct ingest violates published policy. General Code's eCode360 partner API is the substantive-access path. Per Commitment #2 (partnership-first sourcing), this is a partnership conversation. |
| **Municode** | Bastrop City, Elgin, Bastrop County (Subdivision Regs were direct-PDF instead), and most TX small-city ordinance pages. Currently scraped via the working `MunicodeHtmlAdapter` JSON mode. | **Not currently partnered.** Scraping the public HTML/JSON surface works today; no immediate friction. Worth a partnership conversation as the catalog scales — moves Municode from "tolerated scrape" to "structured aggregator partnership." Lower priority than General Code while scraping holds. | Coverage spans most active Sync 4.5 + Sync 5 jurisdictions; partnership shape mirrors the eCode360 framing once we have a working template. |
| **EncodePlus / GovOS** | Pflugerville and Cedar Park (both dual-published on eCode360 and EncodePlus); other TX cities likely. EncodePlus now operates under GovOS. | **Logged, lower priority.** A second access-blocked aggregator, surfaced by cc-agent-E's 2026-05-22 Pflugerville / Cedar Park recon. Not on the critical path: both affected cities are also on eCode360, so the General Code partnership unblocks them without a separate EncodePlus deal. Sized behind General Code. | EncodePlus robots.txt carries `Disallow: /regs/` for all user-agents, and `/regs/` is where all code content sits; the viewer also returned HTTP 403 on a live check. Direct ingest violates published policy, the same posture as eCode360. |

## Standards-body licensor partnerships (ICC, NFPA)

Distinct from the jurisdiction partnerships and the publisher / aggregator partnerships above. The International Code Council (ICC) and the National Fire Protection Association (NFPA) publish the model codes that sit underneath essentially every jurisdiction's building code: the ICC I-Codes (IRC, IBC, IFC, IMC, IPC, IFGC, IECC) and the NEC (NFPA 70). Per [`80_adrs/adr_019_layered_code_substrate.md`](80_adrs/adr_019_layered_code_substrate.md), this shared model-code base is Layer 1 of the layered code substrate. A licensing partnership with ICC and NFPA is the highest-leverage partnership available in the catalog. One ICC deal is the legally-clean base layer for every jurisdiction that adopts the I-Codes, and it moots the model-code copyright question.

This pitch surfaced 2026-05-21 in the strategic session acting on cc-agent-E's Hutto session findings. The framing below is scaffolded by the planner; the decision to pitch, and the pitch itself, is a Nick and bizops action.

| Standards body | Coverage | Status |
|---|---|---|
| **ICC (International Code Council)** | The I-Codes: IRC, IBC, IFC, IMC, IPC, IFGC, IECC. The Layer 1 model-code base under essentially every Texas jurisdiction and most US jurisdictions. | Prospective licensor partnership; pitch scaffolded, not yet decided. One deal legally clears the Layer 1 base for the whole catalog and moots the model-code copyright question. Nick and bizops decision. |
| **NFPA (National Fire Protection Association)** | NFPA 70 (the National Electrical Code) and adjacent NFPA standards. The Layer 1 model-code base for electrical and fire-adjacent provisions. | Prospective licensor partnership; pitch scaffolded, not yet decided. Identical deal shape to ICC. Nick and bizops decision. |

### Pitch framing

The problem the standards bodies have. Agents are becoming the primary consumers of building codes. ICC and NFPA bill humans, through per-seat Digital Codes Premium subscriptions and print sales, and capture nothing when an agent retrieves a code section. Agent retrieval is a large and growing channel that neither body can currently bill. UpCodes-style litigation is the standards bodies defending the human-subscription model against the unbundling, on contested legal ground.

The offer. Hauska is the metered agent-retrieval channel. The payment substrate meters every agent retrieval of code and routes a structural revenue share to the code's owner. ICC and NFPA become licensors with revenue share, the Bastrop partnership template applied to standards bodies. Hauska's "sell reasoning, not data" posture and verifiable provenance keep the standards body the citable source of truth rather than letting models paraphrase or hallucinate code.

The leverage. Cities onboard one jurisdiction at a time. One ICC deal clears the Layer 1 model-code base for the entire catalog, moots the model-code copyright question, and makes the layered substrate's upgrade from interim deep-link to licensed full-text hosting trivial. It is the single highest-leverage partnership in the catalog.

The counterparty view. A new revenue line on a channel ICC and NFPA cannot currently bill and that grows regardless. Alignment with the agent economy instead of litigation against it. Substrate-enforced revenue share, captured mechanically through the SDK rather than merely promised contractually. Retrieval analytics showing which codes, editions, and jurisdictions agents actually query, which is genuine intelligence for the standards bodies' own product and standards work.

Decoupling and risk. The layered code substrate proceeds now on the interim deep-link footing regardless of this pitch, per ADR-019. The pitch is upside, not a dependency, which protects Hauska from the slow standards-body sales cycle. ICC has been litigious and may initially read Hauska as another UpCodes. The framing must lead with "we pay you," not "we host your code." The revenue-share-first framing is the entire differentiator: UpCodes hosts free, Hauska pays. Standards-body revenue-share mechanics, as distinct from the city template, route to [`74_commercial_agreements.md`](74_commercial_agreements.md) and [`14_pricing_framework.md`](14_pricing_framework.md) when the deal shapes up. The deal is legal and corporate execution and routes to Nick.

Sequencing relative to General Code. The General Code (eCode360) track above is the adjacent, lower-altitude version of the same motion, a publisher aggregator, nearer-term and more tractable, unblocking the eCode360 jurisdiction bucket operationally. ICC and NFPA are the standards-body version at higher altitude and slower cycle, and they are the bodies whose copyright the Layer 1 base actually implicates. Run both; they are not mutually exclusive.

## Cross-references

- [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) â strategic foundation for the partnership-first commitment.
- [`14_pricing_framework.md`](14_pricing_framework.md) â revenue-share routing through the SDK payment substrate; Bastrop manual reconciliation pilot gates Phase 3.
- [`18_stakeholder_graph.md`](18_stakeholder_graph.md) â relationship graph; this doc carries operational partnership state, 18 carries the relationship topology.
- [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) â code-ingest pipeline depends on partnership-first sourcing for jurisdictions beyond Bastrop / Grand County.
- [`80_adrs/adr_019_layered_code_substrate.md`](80_adrs/adr_019_layered_code_substrate.md) - layered code substrate; the ICC and NFPA partnerships clear and upgrade its Layer 1 model-code base.
- [`74_commercial_agreements.md`](74_commercial_agreements.md) â revenue-share template lives there; this doc references the template, 74 owns it.
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) â cross-jurisdictional surfacing model.
- [`13_risk_register.md`](13_risk_register.md) â Risk 7 (regulatory posture vs TCEQ) ties to Sylvia conversations on the partnership-narrative arc.

## Revision history

- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Bastrop pioneering-city instance documented; partnership template draft populated from the Bastrop instance; pipeline of future partnerships imported from 49 / 51 sources.
- **2026-05-21 (standards-body partnerships):** Standards-body licensor partnerships section added. ICC and NFPA recorded as prospective model-code licensor partnerships, with the pitch framing scaffolded for Nick and bizops. Surfaced in the 2026-05-21 strategic session acting on cc-agent-E's Hutto findings; tied to the layered code substrate per ADR-019.
- **2026-05-21 (IP-memo gate cleanup):** Texas-first city list row de-gated. The Texas IP attorney memo is no longer recorded as a gate on Stream 1D ingestion: Sync 6 was retired 2026-05-19 and the memo is parallel bizops in `72_hauska_inc_operations.md`. Roadmap catch-up refresh; matches `11_roadmap.md`, `18_stakeholder_graph.md`, and `13_risk_register.md` the same session.
- **2026-05-22 (Sync 5 Tier 1 close):** Pflugerville and Cedar Park added to the General Code (eCode360) row as confirmed eCode360-blocked cities; a second publisher-aggregator, EncodePlus / GovOS, logged as a lower-priority partnership candidate behind General Code. Filed by the planner inbox sweep from cc-agent-E's Pflugerville / Cedar Park recon.
