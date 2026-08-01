---
id: 2026-08-01_smartcity_category_masters_and_positioning
title: Session — SmartCity product line restructured into category masters + positioning framework
date: 2026-08-01
status: closed
owner: nick
agent: claude_code (planner)
related: [_smartcity_masters/00_README, 41_three_wedge_spine_strategy, 42_stub_thesis_national_twin_substrate, 30_smartcity_os, 07a_smartcity_product_positioning]
---

# SmartCity category masters and positioning framework

Strategy session. Restructured the SmartCity product line from five screen-defined products into three categories on one foundation, and produced the master document set that a design agent consumes to build collateral (Vertosoft, Forrest, website). Isolated in `_smartcity_masters/` as the reference set for the operator's coming doc reconciliation pass.

## Grounding read

Smart Site white papers (technical + market + positioning, 2026-07-31, `Master Collateral Folder/`); the spine capability inventory from the prior week (`_inbox/2026-07-27_bastrop_composition_inventory.md`, `_inbox/2026-07-29_mcp_audit_pe_stack_gap.md`, `_inbox/2026-07-29_next_gen_property_layer_positioning_summary.md`); SmartCity canon (30, 07a, 46, `_sales/03`); plan-review canon current and superseded (48 cortex-reporting spec, 75n ICC, versus 47 Codex and 33 stub); strategy frames 41, 42, and the 2026-07-31 municipal wedge frame — whose own stated next step was "bring in the SmartCity picture," which this session performed.

## The structure ratified

Everything is built from **smart sites**. A smart site is any addressable place, fully twinned; a smart city is a bunch of smart sites. It is the UNIT, not a product — cities buy access and may deepen. Operator correction mid-session: parcel intelligence is not a separate product, it is a city's access to its smart sites, and Bastrop's rebuild delivers the real thing rather than porting the old surface.

Three categories on one foundation:

**Dashboards** — a lens family keyed by audience and permission, not one product. Leads: city manager, development services, finance, citizen. CitizenConnect collapses into the citizen lens. The city-manager lens is the proof of the one-system claim, not the hero feature.

**Asset Management** — every physical asset a city tracks (water mains to sidewalks to vehicles) as a durable, access-controlled record. Delivered as a BUILD, not a module with v1/v2 staging, which is the honest description of work that is always an engagement. Tier order: record, then live state, then view. Operator swapped sensors above visualization — a city cares that the lift station reports a fault, not that it renders in 3D.

**Plan Review** — submittals pre-reviewed against the city's own adopted code before reaching intake staff. Sold on money and capacity: less review going to outside firms, more absorbed by existing staff. Current generation is the cortex-reporting F1-F7 spec plus ICC; the Codex 1a/1b generation is superseded.

**The foundation + Smart Files** — not a category. The foundation is never named externally and gets exactly one sentence: the way we capture and process data is the foundation for everything else to get built. **Smart Files** is the named customer-facing face, replacing a city's file system: search from one place, revise once and it is current everywhere, prior version still there.

## Decisions made

- **GovTitle RETIRED.** Marketed by SmartCity, never built, and the name drags in a deed-and-title expectation the capability does not serve. Described plainly; a name may be set once seen in practice. Do not reintroduce.
- **No aggregation-only dashboards.** If a city wants a screen rendering a feed they already have, they have one. Deliberate refusal of the easy land-and-expand motion; every dashboard engagement is therefore a data engagement.
- **Telemetry is atomized by default.** Operator correction to a planner over-hedge: the thing being read becomes a node, each reading becomes a record on it, source-agnostic. No per-source capability caveat applies — only whether a city grants access to a feed, which is a scoping fact, not a limit. Upgraded Tier 2 from a live gauge to permanent behavioural history.
- **Plan Review sells money and capacity, not calibration.** Operator correction to a planner miss: the keystone/adjudication-capture story is internal thesis, not buyer value, and must never be dressed as such. Its narrow honest customer expression is consistency that does not depend on who is at the desk.
- **No cycle-time or savings figures.** Mechanism and problem scale only. "Cut review cycles in half" explicitly barred — no measurement exists, and the peer network that is our distribution channel is exactly where an unsupported number would fail.
- **IPFS never said in marketing.** Ownership stated plainly ("your data is yours"). Substrate is built and running in the command center; IPFS is the rebuild target with prototypes run and CIDs already carried, so portability is structural but records are not distributed today. Collateral holds that line.
- **The learning loop is not sold.** Ambient capture and the plan-review write-back are one internal loop; 07a's "it learns your city" fourth surface demotes to a property of the foundation.
- **System first, program after.** A city buys a complete deployable system; deployment creates the foundation programs grow from. Dashboards is never described as phase one.
- **Fleet is both** an asset class and a dashboard lens.
- **Smart Files adopted** as the name, from the operator's own copy; fits the smart site / smart report family.

## Artifacts

`_smartcity_masters/` — isolated from the numbered canon so the reconciliation has a fixed point to correct against. README carries the authority statement (where these and any other doc disagree, these win), the fifteen session rulings verbatim for agents without this context, and the reconciliation debt list.

- `00_README.md` — index, authority, rulings, owed, debt
- `31_smartcity_dashboards.md`
- `32_smartcity_asset_management.md`
- `33a_smartcity_plan_review.md`
- `34_smartcity_smart_files_and_foundation.md`
- `35_smartcity_positioning_framework.md`

Each master fences INTERNAL ONLY sections and carries an approved-claims register with sources, so a design agent can only draw printable language and cannot reach unsupported claims.

Positioning framework: two-altitude rule governing; three-beat pitch with fixed order (pain opens, verb structure is the middle, their city closes); four uncontested claims including the refusal; consolidated never-say list; per-audience altitude; and the generation method for the peer-recommendation line (seven constraints, per-category notes, and the test — would a city manager say this to a peer about their own city, unprompted, six months after deployment). The line itself is left open, deliberately: naming ahead of practice is how GovTitle happened.

## Findings surfaced

**The doc set had no enumeration of SmartCity report outputs.** A code-level sweep of the deployed repo found roughly 26 distinct report deliverables across four families. Two findings from it matter beyond the reports question: the Reports Center's 21 named reports have a download handler that emits a fixed text template rather than generating anything, and the repo's `QUICK_REPORTS_GUIDE.md` documents six of them with illustrative KPI tables while claiming PDF download the code does not produce. Same class of problem as the retired GovTitle — marketed ahead of build. Disposition owed; operator directed no further work on the reports library this session.

**The spec'd parcel briefing in `46_smartcity_parcel_intelligence.md` is not what shipped.** The live Property Intelligence Report is thinner, with none of the flood, drainage, soils, or habitat reasoning the spec describes — and the spec is closer to what the smart site X-ray already does properly on the spine. Do not conflate them in the rebuild.

## Reconciliation debt created

Docs that now contradict the masters, listed with what is wrong in `_smartcity_masters/00_README.md`: `07a_smartcity_product_positioning.md`, `_sales/03_smartcity_os.md`, `30_smartcity_os.md`, `47_codex_plan_review.md`, `33_smartcity_codex_1b_integration.md`, `46_smartcity_parcel_intelligence.md`, and the deployed `QUICK_REPORTS_GUIDE.md`.

## Owed

1. The peer-recommendation line — generate candidates against doc 35's constraints.
2. Smart reports — mentioned only, deliberately not defined. Two live in the property surface (smart site X-ray, flood and drainage study); Bastrop's deployment carries more that become library material on rebuild.
3. Government pricing tiers — operator decision gating every pricing-bearing artifact.

## Caveat carried forward

Plan Review was rewritten mid-session after the operator's value-prop correction and did not get the same fresh-eyes pass as the other three masters. Flagged for re-read before it is used to weight other docs.

## Commits

- `b3d39af` — four category masters + README, isolated reference set
- `27c0667` — positioning framework (doc 35) + README index/owed update

Pushed to `origin/main`; verified zero divergence.
