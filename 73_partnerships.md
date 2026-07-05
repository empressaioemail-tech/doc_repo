---
id: 73_partnerships
title: Partnerships â formalized partnership state
status: active
last_updated: 2026-07-05 (Regrid-purged scrub: brief/public-records baseline is Cotality, sole spine since 2026-06-17. Prior 2026-06-09 (partnership-first sourcing retired, reframed to customer/design-partner + content-licensing posture; prior 2026-05-29 Property Brief outreach wave + backlog cross-link. Prior 2026-05-26 Sync 5 TX-metros batch: McAllen confirmed eCode360 added to General Code row; 7 metro-suburb cities + Edinburg added to publisher-TBD bucket with Fort Worth flagged as the strategic anchor for the FW metro. Earlier 2026-05-22: Sync 5 Tier 2 central-Texas recon — Kyle, Buda, Liberty Hill, Bee Cave to General Code, American Legal Publishing logged. Prior 2026-05-22: Pflugerville and Cedar Park added to General Code, EncodePlus / GovOS logged. Prior 2026-05-21: Standards-body licensor partnerships section added.))
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 13_risk_register, 18_stakeholder_graph, 30_smartcity_os, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 70_bizops_overview, 71_pipeline, 74_commercial_agreements]
owner: nick
---

# Partnerships

> **Formal partnership state.** Operational counterpart to [`18_stakeholder_graph.md`](18_stakeholder_graph.md) (which is the relationship graph). This doc tracks which counterparties are formal Hauska partners under the partnership-first sourcing commitment, what the partnership terms look like, and what the partnership template should look like as the pattern scales.

## Partnership posture (partnership-first sourcing RETIRED 2026-06-09)

> **Amendment note.** Partnership-first sourcing was retired as a structural commitment 2026-06-09 ([`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`](_decisions/2026-06-09_retire_partnership_first_amend_constitution.md)), superseded by the web-first reasoning pivot: the moat is the calibrated public-code reasoning corpus, not city operational data sourced under revenue share. This doc no longer tracks "cities as licensors." It tracks three distinct relationship types, only the first of which was retired: (1) **cities as SmartCity OS customers and design partners** (Bastrop), not data-sourcing licensors; (2) **ICC / NFPA standards-body content licensing** (display license for code text; the enhance phase) — alive and distinct; (3) the **SDK rail that routes revenue to paid source actors** — a commercial mechanism whose city rationale is gone but which survives for content/firm models. The value-returns-to-contributors thesis survives, re-grounded as tenant data sovereignty plus calibration deposits (I5/I6).

Cities are reached through Sylvia as SmartCity OS customer and design-partner relationships, not as data-sourcing licensing. Public code is grounded web-first; no city partnership is required to onboard a jurisdiction's model code.

## Active partnerships

### Bastrop â pioneering city (template)

- **Status.** Active. Anchor SmartCity OS customer (per [`30_smartcity_os.md`](30_smartcity_os.md)) and design partner. (No longer framed as a sourcing "template" since partnership-first was retired 2026-06-09; Bastrop is a customer and the reviewer-zero design partner for calibration, not a data-sourcing licensor.)
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
| **General Code (eCode360)** | Smithville, Pflugerville, Cedar Park, the central-Texas eCode360 cities Kyle, Buda, Liberty Hill, Bee Cave (instance IDs SM6484 / PF6442 / CE6271 / KY6871 / BU6262 / LI6389 / 40277793), McAllen TX (RGV, instance ID MC6775; confirmed eCode360 per cc-agent-E's 2026-05-23 TX-metros recon), plus many other small/mid-TX cities. Confirmed eCode360-blocked Sync 5 Tier 1, Tier 2, and TX-metros cities; the largest single access-blocked bucket in the Texas ingest. | **Outreach scheduled 2026-05-30 (Nick).** One-pager: [`90_runbooks/partner_outreach_brief_wave.md`](90_runbooks/partner_outreach_brief_wave.md) §1. Backlog item PB-101 in [`75c_property_brief_data_backlog.md`](75c_property_brief_data_backlog.md). | Smithville code on eCode360 returns HTTP 403 for both ingest and browser user-agents (bot protection); robots.txt disallows `/documents/`, `/search`. Direct ingest violates published policy. General Code's eCode360 partner API is the substantive-access path. Per Commitment #2 (partnership-first sourcing), this is a partnership conversation. |
| **Municode** | Bastrop City, Elgin, Bastrop County (Subdivision Regs were direct-PDF instead), and most TX small-city ordinance pages. Currently scraped via the working `MunicodeHtmlAdapter` JSON mode. | **Not currently partnered.** Scraping the public HTML/JSON surface works today; no immediate friction. Worth a partnership conversation as the catalog scales — moves Municode from "tolerated scrape" to "structured aggregator partnership." Lower priority than General Code while scraping holds. | Coverage spans most active Sync 4.5 + Sync 5 jurisdictions; partnership shape mirrors the eCode360 framing once we have a working template. |
| **EncodePlus / GovOS** | Pflugerville and Cedar Park (both dual-published on eCode360 and EncodePlus); other TX cities likely. EncodePlus now operates under GovOS. | **Logged, lower priority.** A second access-blocked aggregator, surfaced by cc-agent-E's 2026-05-22 Pflugerville / Cedar Park recon. Not on the critical path: both affected cities are also on eCode360, so the General Code partnership unblocks them without a separate EncodePlus deal. Sized behind General Code. | EncodePlus robots.txt carries `Disallow: /regs/` for all user-agents, and `/regs/` is where all code content sits; the viewer also returned HTTP 403 on a live check. Direct ingest violates published policy, the same posture as eCode360. |
| **American Legal Publishing** | Harker Heights (`codelibrary.amlegal.com`); other TX cities likely. | **Logged, lower priority.** A fourth publisher platform (after Municode, eCode360, and EncodePlus), the third non-Municode aggregator. Surfaced by cc-agent-E's 2026-05-22 Sync 5 Tier 2 central-Texas recon. Access posture not yet investigated (cost discipline); presumed partnership-track alongside General Code, sized behind it. | Harker Heights' development code is on American Legal Publishing rather than Municode. Worth a bizops note alongside the General Code track as the central-Texas ingest scales. |

### Publisher-TBD bucket (Sync 5 TX-metros, 2026-05-23)

cc-agent-E's TX-metros batch found seven additional cities off Municode whose publisher platform is not yet identified (cost-disciplined NO-RESULT on Municode `/Clients/name`; no further publisher recon this session). Filed here for bizops follow-up. **Fort Worth is the strategic anchor of this bucket** — without it, the FW metro catalog in Sync 5 is limited to four sub-50k suburbs (Crowley / Saginaw / Watauga / Keller). Partnership outreach to Fort Worth via Sylvia is the highest-leverage next step in the publisher track.

| City | Metro | Notes |
|---|---|---|
| **Fort Worth, TX** | FW metro | **Strategic anchor.** Publisher TBD. High-leverage partnership target. |
| **Dallas, TX** | DFW metro | eCode360 per Sprint 51; city proper partnership-track only (cc-agent-E-N 2026-05-26). Suburbs on Municode remain fair game. |
| Arlington, TX | FW metro | Publisher TBD. Large city. |
| Mansfield, TX | FW metro | Publisher TBD. |
| Burleson, TX | FW metro | Publisher TBD. |
| North Richland Hills, TX | FW metro | Publisher TBD. |
| Irving, TX | DFW metro | Municode `/Clients/name` NO-RESULT (cc-agent-E-N 2026-05-26). Publisher TBD. |
| Garland, TX | DFW metro | Municode NO-RESULT (cc-agent-E-N 2026-05-26). Publisher TBD. |
| Frisco, TX | DFW metro | Municode NO-RESULT (cc-agent-E-N 2026-05-26). Publisher TBD. |
| Carrollton, TX | DFW metro | Municode NO-RESULT (cc-agent-E-N 2026-05-26). Publisher TBD. |
| Harlingen, TX | RGV | Publisher TBD. |
| Horizon City, TX | El Paso area | Publisher TBD. |
| **Edinburg, TX** | RGV | Different shape — Municode "TITLE XV - LAND USAGE" carries only 3 chapters (150, 151, 154 — no Zoning / Subdivision). Full UDC appears off-Municode; partnership-track recon owed for the missing UDC portion. |
| **Texas City, TX** | Houston / upper coast | Municode `/Clients/name` NO-RESULT (cc-agent-E-H 2026-05-26). Publisher TBD. |
| **Beaumont, TX** | Upper Gulf Coast | Municode NO-RESULT (cc-agent-E-H 2026-05-26). Publisher TBD. |
| **Harris County, TX** | Houston metro | Municode NO-RESULT (cc-agent-E-H 2026-05-26). County code; publisher TBD. |
| **Houston, TX** | Houston metro | City proper expected eCode360 per Sprint 51; Municode clientId 2679 exists but partnership-track for full dev code (cc-agent-E-H 2026-05-26 recon). |

This bucket joins the prior "roughly eleven small central-Texas towns off Municode with publishers not yet identified" later-recon bucket from the 2026-05-22 Tier 2 history entry. A consolidated publisher-recon pass across both buckets is a separable bizops or cc-agent-E discovery dispatch.

## County recorder and title encumbrance partnerships (recorded restrictions)

Distinct from municipal code publishers and from Cortex public-records baselines (now Cotality; Regrid purged 2026-06-17). Governs **private recorded instruments** per [ADR-020](80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md) and ingest tracks R1–R3 in [`49b_encumbrance_ingestion_pipeline.md`](49b_encumbrance_ingestion_pipeline.md). Access is via county-clerk MOU or SFTP, not national scrape — an access-methodology necessity (recorded instruments are gated by the clerk), not the retired partnership-first sourcing ethic (retired 2026-06-09).

| Counterparty class | Examples | Status | Notes |
|---|---|---|---|
| **County clerk / official records** | Bastrop County, Dallas County (Cedar Hill engagements) | **Prospective.** Phase 4+ | MOU + API or bulk SFTP for instrument PDFs by APN. A data-access MOU, not a revenue-share-to-source licensor relationship (the Bastrop "partnership template / revenue share" framing was retired 2026-06-09). |
| **Title insurance underwriters / plants** | Stewart, First American, Fidelity National | **Prospective.** Phase 5+ | Per [`18_stakeholder_graph.md`](18_stakeholder_graph.md) P3. Enterprise catalog + `.atompack` for subdivision corpora. |
| **HOA / management companies** | Per-subdivision | **Prospective.** Phase 2–3 | CC&R + design guidelines; recorded vs advisory split in ADR-020. |

**Phase 1 does not require these partnerships.** Customer upload (track R4) is the default until R1 is signed.

## Standards-body content licensing (ICC, NFPA)

> **Survives the partnership-first retirement, reclassified (2026-06-09, [`_decisions/2026-06-09_icc_nfpa_licensing_and_sdk_rail_survive.md`](_decisions/2026-06-09_icc_nfpa_licensing_and_sdk_rail_survive.md)).** This is content/display IP licensing, not the retired city sourcing ethic and NOT the Bastrop template. ICC/NFPA own the copyrighted code text; Hauska needs a license to show it as full-text (the alternative is deeplink). Hauska is the payer / metered channel; the standards body is the content owner. Commercial structure (flat fee vs metered per-retrieval share) is TBD in the negotiation, not pre-settled. It reinforces sell-reasoning-not-data: licensed display is the legal full-text path, deeplink the interim, verbatim never hoarded.

Distinct from the jurisdiction relationships and the publisher / aggregator partnerships above. The International Code Council (ICC) and the National Fire Protection Association (NFPA) publish the model codes that sit underneath essentially every jurisdiction's building code: the ICC I-Codes (IRC, IBC, IFC, IMC, IPC, IFGC, IECC) and the NEC (NFPA 70). Per [`80_adrs/adr_019_layered_code_substrate.md`](80_adrs/adr_019_layered_code_substrate.md), this shared model-code base is Layer 1 of the layered code substrate. A licensing partnership with ICC and NFPA is the highest-leverage partnership available in the catalog. One ICC deal is the legally-clean base layer for every jurisdiction that adopts the I-Codes, and it moots the model-code copyright question.

This pitch surfaced 2026-05-21 in the strategic session acting on cc-agent-E's Hutto session findings. The framing below is scaffolded by the planner; the decision to pitch, and the pitch itself, is a Nick and bizops action.

| Standards body | Coverage | Status |
|---|---|---|
| **ICC (International Code Council)** | The I-Codes: IRC, IBC, IFC, IMC, IPC, IFGC, IECC. The Layer 1 model-code base under essentially every Texas jurisdiction and most US jurisdictions. | Prospective licensor partnership; pitch scaffolded, not yet decided. One deal legally clears the Layer 1 base for the whole catalog and moots the model-code copyright question. Nick and bizops decision. |
| **NFPA (National Fire Protection Association)** | NFPA 70 (the National Electrical Code) and adjacent NFPA standards. The Layer 1 model-code base for electrical and fire-adjacent provisions. | Prospective licensor partnership; pitch scaffolded, not yet decided. Identical deal shape to ICC. Nick and bizops decision. |

### Pitch framing

The problem the standards bodies have. Agents are becoming the primary consumers of building codes. ICC and NFPA bill humans, through per-seat Digital Codes Premium subscriptions and print sales, and capture nothing when an agent retrieves a code section. Agent retrieval is a large and growing channel that neither body can currently bill. UpCodes-style litigation is the standards bodies defending the human-subscription model against the unbundling, on contested legal ground.

The offer. Hauska is the metered agent-retrieval channel for licensed code text. The commercial structure is TBD in the negotiation (a flat content-license fee, or the payment substrate metering retrieval and routing a share to the code's owner). ICC and NFPA are content licensors, not the retired city sourcing template. Hauska's "sell reasoning, not data" posture and verifiable provenance keep the standards body the citable source of truth rather than letting models paraphrase or hallucinate code.

The leverage. Cities onboard one jurisdiction at a time. One ICC deal clears the Layer 1 model-code base for the entire catalog, moots the model-code copyright question, and makes the layered substrate's upgrade from interim deep-link to licensed full-text hosting trivial. It is the single highest-leverage partnership in the catalog.

The counterparty view. A new revenue line on a channel ICC and NFPA cannot currently bill and that grows regardless. Alignment with the agent economy instead of litigation against it. If the deal carries a metered-share structure, revenue routing through the SDK is the designed mechanism (the rail is built; the routing/split layer is unbuilt, so until it ships the share is contractually promised, not substrate-enforced). Retrieval analytics showing which codes, editions, and jurisdictions agents actually query, which is genuine intelligence for the standards bodies' own product and standards work.

Decoupling and risk. The layered code substrate proceeds now on the interim deep-link footing regardless of this pitch, per ADR-019. The pitch is upside, not a dependency, which protects Hauska from the slow standards-body sales cycle. ICC has been litigious and may initially read Hauska as another UpCodes. The framing must lead with "we pay you," not "we host your code." The revenue-share-first framing is the entire differentiator: UpCodes hosts free, Hauska pays. Standards-body revenue-share mechanics, as distinct from the city template, route to [`74_commercial_agreements.md`](74_commercial_agreements.md) and [`14_pricing_framework.md`](14_pricing_framework.md) when the deal shapes up. The deal is legal and corporate execution and routes to Nick.

Sequencing relative to General Code. The General Code (eCode360) track above is the adjacent, lower-altitude version of the same motion, a publisher aggregator, nearer-term and more tractable, unblocking the eCode360 jurisdiction bucket operationally. ICC and NFPA are the standards-body version at higher altitude and slower cycle, and they are the bodies whose copyright the Layer 1 base actually implicates. Run both; they are not mutually exclusive.

## Property Brief place-node enrichment (MOU rule)

Governs partner city and county MOUs for the Property Brief / place graph wave per [`_dispatches/2026-05-28_central-tx-property-brief-scope.md`](_dispatches/2026-05-28_central-tx-property-brief-scope.md) wave 0e.

When a jurisdiction signs an MOU for operational enrichment (GIS layers, permit history, local overlays), that data enters **only** through the `property-workspace` place node as Plane E or Plane B enrichment APIs. There is no parallel brief code path, no second retrieval stack, and no bypass of the atom composition model (`property-workspace` → `place-layer-*` + `brief-run` + `code-section` citations).

| Rule | Detail |
|---|---|
| **Enrichment target** | `property-workspace` place node only |
| **Brief baseline** | FEMA + Cotality national public-records baseline (Regrid purged 2026-06-17, Cotality is the sole spine; out of scope for city operational-data MOU) |
| **Partner GIS example** | Bastrop city GIS on **Generate Layers** only; not a separate Brief adapter fork |
| **Dallas city proper** | Blocked (`dallas\|tx`) until AmLegal / eCode360 partnership; Dallas County and Municode suburbs remain fair game |
| **Revenue share** | Same structural shape as city partnership template; Layer 2 on paid enrichment atoms |

Planner and cc-agent-C must refuse feature requests that add a jurisdiction-specific brief branch outside the place node.

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

- **2026-05-28 (Property Brief place-node MOU rule):** Section added for wave 0e. City/county MOUs route enrichment through `property-workspace` place node only; Brief baseline stays FEMA + Regrid; Bastrop GIS on Generate Layers only; Dallas city blocked.
- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Bastrop pioneering-city instance documented; partnership template draft populated from the Bastrop instance; pipeline of future partnerships imported from 49 / 51 sources.
- **2026-05-21 (standards-body partnerships):** Standards-body licensor partnerships section added. ICC and NFPA recorded as prospective model-code licensor partnerships, with the pitch framing scaffolded for Nick and bizops. Surfaced in the 2026-05-21 strategic session acting on cc-agent-E's Hutto findings; tied to the layered code substrate per ADR-019.
- **2026-05-21 (IP-memo gate cleanup):** Texas-first city list row de-gated. The Texas IP attorney memo is no longer recorded as a gate on Stream 1D ingestion: Sync 6 was retired 2026-05-19 and the memo is parallel bizops in `72_hauska_inc_operations.md`. Roadmap catch-up refresh; matches `11_roadmap.md`, `18_stakeholder_graph.md`, and `13_risk_register.md` the same session.
- **2026-05-22 (Sync 5 Tier 1 close):** Pflugerville and Cedar Park added to the General Code (eCode360) row as confirmed eCode360-blocked cities; a second publisher-aggregator, EncodePlus / GovOS, logged as a lower-priority partnership candidate behind General Code. Filed by the planner inbox sweep from cc-agent-E's Pflugerville / Cedar Park recon.
- **2026-05-22 (Sync 5 Tier 2 central-Texas recon):** Kyle, Buda, Liberty Hill, and Bee Cave added to the General Code (eCode360) row as confirmed eCode360-blocked central-Texas cities; American Legal Publishing logged as a fourth publisher platform after a Harker Heights finding. cc-agent-E's Tier 2 recon also flagged roughly eleven small central-Texas towns off Municode with publishers not yet identified — a later-recon bucket. Filed by the planner inbox sweep.
- **2026-05-23 (Sync 5 TX-metros batch):** McAllen TX (instance ID MC6775) added to the General Code (eCode360) row as confirmed eCode360-blocked (the only publisher-verified city in this batch). Seven additional cities (Fort Worth, Arlington, Mansfield, Burleson, North Richland Hills, Harlingen, Horizon City) + Edinburg added to a new publisher-TBD bucket below the publisher table; Fort Worth flagged as the strategic anchor of the FW metro (without Fort Worth, the FW metro catalog is limited to four sub-50k suburbs). Edinburg has a different shape — Municode covers only 3 of its chapters, full UDC appears off-Municode, partnership-track recon owed for the missing UDC portion. Filed by the planner inbox sweep from cc-agent-E's TX-metros batch session.
