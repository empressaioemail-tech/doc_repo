---
id: 33a_smartcity_plan_review
title: SmartCity Plan Review — category master
status: active
last_updated: 2026-08-01
applies_to: smartcity
owner: nick
related: [30_smartcity_os, 31_smartcity_dashboards, 32_smartcity_asset_management, 48_cortex_reporting_plan_review_spec, 75n_icc_code_connect_catalog, 41_three_wedge_spine_strategy, 42_stub_thesis_national_twin_substrate, 47_codex_plan_review]
purpose: The category master for SmartCity Plan Review. Source of truth for what the category is, what it holds, what is real, how it is sold, and what may be said externally. Written to be consumed by a design agent producing collateral (Vertosoft, Forrest, website); the external-language and approved-claims sections are the only parts that may be printed market-facing.
---

# SmartCity Plan Review

One of four SmartCity categories. Peers: Dashboards, Asset Management, and the storage layer that underpins all three.

## How to use this document

This is a source-of-truth master, not collateral. A design agent producing a one-pager, a deck slide, or website copy draws from [External language](#external-language-what-may-be-said) and [Approved claims](#approved-claims-register), and from nothing else. Everything above those sections is internal reasoning that establishes why the external language is true. Sections marked INTERNAL ONLY must never appear in a market-facing artifact.

This category carries a licensed-content constraint the other two do not. Read [Licensed code content](#licensed-code-content-hard-constraint) before writing anything that displays or quotes a building code.

## Which plan review this is

INTERNAL ONLY — doc lineage, because three generations of plan-review documents exist in this repo and two of them mislead.

**Current.** `48_cortex_reporting_plan_review_spec.md` (2026-07-01) is the live surface spec: seven function surfaces F1 through F7, built white-label on the spine, with adjudication write-back as atoms. `75n_icc_code_connect_catalog.md` (2026-07-23) is the licensed-code track. `41_three_wedge_spine_strategy.md` (2026-07-31) establishes plan review as the keystone serving all three wedges.

**Superseded.** `47_codex_plan_review.md` (2026-05-16) — the Codex 1a/1b/three-surface architecture, host-tool-invited Bluebeam framing, and the sell-to-contractor-firms-first sequencing. Its corpus figures (479 code atoms across four sources) are long stale. `30_smartcity_os.md`'s M4-B / PLR-1..28 / SD-1..SD-8 / W1-W6 vocabulary and `33_smartcity_codex_1b_integration.md` (2026-05-11 stub) belong to the same superseded generation. `40i_cortex_dallas_e2e_grok_plan_review_sprint.md` describes an in-process cortex-api finding engine that does not call the spine at generation time — a sprint artifact, not the target architecture.

**What survives from doc 47.** The strategic insight, not the architecture: the reviewer is the highest-network-density stakeholder in the construction lifecycle, a growing share of city review is outsourced to contractor firms, and every finding is an atom that feeds the place's permanent record. Those remain true and load-bearing. The surface architecture, the Bluebeam-first wedge, and the sales sequencing do not.

## What the category is

Plan Review is how a city reviews what gets built, against its own adopted code, with every finding cited and every decision kept.

A submittal arrives. The system determines which code sections apply to that project on that place, and makes a determination against each one — passing, failing, uncertain, or unchecked — with the reasoning traceable to the code section it rests on. The reviewer accepts, edits, or overrides any determination, and their judgment is recorded with their reason. The result rolls into a comment letter in the reviewer's normal workflow.

Two things make it different from review software. Every finding cites the actual adopted code section rather than a generic rule, because the review runs against the city's own corpus. And every adjudication is kept — not as a log entry, but as part of the permanent record of that place, so the next review of the same place, or a similar question two years later, has it.

## The value: money and capacity

This is the buyer's reason and it leads every conversation and every piece of collateral.

**Cities pay outside firms to do their plan review.** Not because they want to, but because they cannot recruit or retain plans examiners. It is a budget line that runs well into the hundreds of thousands of dollars a year and beyond, for work the city would rather do itself.

**And review is the bottleneck everyone feels.** Cycle times stretch. Applicants resubmit. Staff answer the same code questions repeatedly. Developers complain, and the council hears about it.

**The mechanism is that submittals are pre-reviewed before they reach intake staff.** Work arrives already checked against the city's own adopted code, cited section by section, with what passes, what fails, and what needs a human eye already sorted. Staff time goes to judgment instead of first-pass error-catching.

That one mechanism moves both problems. Less work goes to outside firms because more of it can be absorbed in-house. And the examiners a city already has get further, because the mechanical pass is done before they open the file. Reduce the outsourcing spend, extend the capacity of existing staff — the same mechanism doing both, and most cities need both.

INTERNAL ONLY — honesty discipline on these claims. We have no measured cycle-time reduction and no verified customer spend figure. The order of magnitude for outsourced review (high hundreds of thousands to a million-plus annually) is operator knowledge of the market, not a customer result. Therefore: describe the mechanism and the size of the problem cities face; never state a savings figure, a percentage, or a cycle-time reduction as an achieved outcome. "Cut review cycles in half" is a claim we cannot yet support and must not print. The first city that measures it and disagrees would damage us in the peer network that is our entire distribution channel.

## Why the decisions being kept matters

INTERNAL ONLY — this is our thesis, not the buyer's value proposition. It must never lead, and it must never be dressed up as a customer benefit. The city's reason to buy is money and capacity, above.

Plan review is the only category where the city produces genuinely new knowledge. Dashboards render what exists. Asset Management records what is there. Plan review is a trained professional making a judgment call about how code applies to a specific place — and that judgment is exactly the thing that evaporates today, living in a PDF comment letter and in the reviewer's head until they retire.

Capturing adjudications as atoms is what makes the confidence commitment real. It is the earning loop named in structural commitment 2: outputs carry a confidence signal, and the system tightens that calibration with use. Adjudications are the use. This is why `41_three_wedge_spine_strategy.md` calls plan review the keystone — the convergence point where the municipal write-back calibrates the reasoning that makes every other wedge's answers trustworthy.

The tension named in doc 41 applies directly here: the city pulls toward "a better dashboard," which is warmer and easier, while the write-back is the harder move and the actual thesis. Both proceed. Only the write-back earns the calibration commitment and builds the network.

The customer-facing expression of this is narrow and honest: consistency that does not depend on who is at the desk, and the reasoning behind a decision still being there years later. That is real value and it is sayable. The calibration story is not.

## What it holds

**Applicability.** Given a project type and a place, which code sections apply. Derived from the place and the project rather than from a static checklist.

**Determination with reasoning.** A system determination per applicable section, traceable to the code section and the reasoning behind it. Uncertain and unchecked are first-class outcomes and are surfaced prominently; a section the system cannot judge says so rather than guessing.

**Reviewer adjudication.** The reviewer accepts, edits, or overrides. The override and its reason are captured, attributed, and timestamped. The reviewer's judgment governs; the system's determination is a starting position, not a verdict.

**Findings that accumulate.** A finding recorded in one review is retrievable against the same code section in a later one. Standard findings are reusable as templates. The library grows with use.

**The code, navigable in the flow.** The reviewer can move through the adopted corpus at section granularity without leaving the review.

**The place in context.** The parcel and its overlays — zoning, flood, setbacks — render alongside the review, so a drainage section can light up the drainage constraint on that specific place.

**The reasoning, openable.** Any determination can be opened to show what it rests on: the source, the derivation, the confidence and its basis, the citation, and when it was retrieved. No bare confidence numbers anywhere.

INTERNAL ONLY: these map to F1–F7 in `48_cortex_reporting_plan_review_spec.md` — queue, intake and triage, applicability matrix, adjudication, findings library, code library, and reasoning drill-through — plus the shared map renderer. That spec's acceptance criteria are the definition of done for each; do not restate its function labels externally.

## Licensed code content: hard constraint

INTERNAL ONLY. This constraint is contractual and binds every artifact, demo, and screenshot.

Model codes are licensed content, not public domain. Under the active ICC Code Connect PoC (`75n_icc_code_connect_catalog.md`), the 2018 International Building Code and the 2018 International Property Maintenance Code are enabled, credentials run through 2026-12-30, and the rules are:

Show the section identifier and heading alongside our own analysis. Subsection content may be displayed. Do not reproduce the full section body verbatim to an end user. Citations use the full canonical title — "2018 International Building Code Section 802.3" — never an abbreviation alone.

**The PoC license does not extend to customer-facing applications.** A demo must be arranged with ICC first; ICC then executes the SaaS agreement that permits customer-facing display. Until that is signed, ICC-derived atoms carry `platform-internal` at minimum and may not be pooled into any shared or public calibration asset.

Caching is permitted, but on license termination all stored copies must be destroyed — including vector databases and embeddings — with confirmation owed back to ICC. Provenance must stay traceable to book ID and section so a wind-down can identify and purge.

**Consequences for collateral.** No screenshot may show verbatim code body text from a licensed source. No demo of licensed content to a customer before the SaaS agreement. A city's own adopted local code is not subject to this constraint and is the safe demo material.

Open flag: the audit at `_inbox/2026-07-29_mcp_audit_pe_stack_gap.md` could not confirm that ICC-derived atoms are stamped with an ICC-specific access policy at ingest — the gating is generic. That is a live license-risk item, tracked in open items below.

## The buyer and the sale

**The buyer is the city manager**, consistent with the rest of the line. The reviewer is the daily user and the person whose experience decides whether it succeeds, but the purchase decision and the pain that motivates it sit with the manager.

**The pain to open with.** Two things, and every city feels both. The money going to outside review firms because plans examiners cannot be hired or kept. And the bottleneck — cycle times stretching, applicants resubmitting, staff answering the same code question over and over.

**The outcome to promise.** More review handled by the staff you already have, and submittals that arrive pre-checked so the queue moves. Described as the mechanism, never as a measured saving or a cycle-time percentage.

**Discovery questions that work.** How much of your review goes to an outside firm, and what does that cost you? How long is a submittal in the queue right now? When did you last try to hire a plans examiner? What is your resubmission rate?

**Serve the reviewer, do not replace them.** The reviewer's judgment governs. The system proposes, cites, and remembers; the reviewer decides. This is both true and the only framing that survives contact with a plans examiner, who will correctly reject anything that positions itself as reviewing in their place.

**Never claim to be the authority.** We run the review the city's own adopted code implies and cite it. We do not approve, permit, or certify. That is the city's act.

INTERNAL ONLY: doc 47's contractor-firm wedge (SAFEbuilt, Bureau Veritas, ICC Community Development Solutions) and its faster 1-3 month sales cycle remain a real opportunity and are out of scope for this category master, which covers the municipal buyer. If that channel is revived it needs its own framing pass, not a revival of the Bluebeam-invited architecture.

## Relationship to the other categories

**Dashboards.** The development services lens is where plan review surfaces day to day — what is in flight, what is stuck, where the backlog is. The city manager lens sees throughput. Plan review is the substance behind those views.

**Asset Management.** Both write to the same places. A review decision and an asset record attach to the same smart site, so the history of a place includes both what is there and what was decided about it.

**The storage layer.** Adjudications become atoms on places. That is the deposit that makes this category the keystone rather than another review tool.

## Competitive frame

A city will compare this to its permit-and-review software — the review module of whatever system it already runs — and to nothing at all, because the alternative for most small cities is a reviewer, a PDF, and a markup tool.

The frame is not feature-for-feature against a permit system. It is that ordinary review software routes and tracks a review; this one runs it against the city's own adopted code, cites every finding, and keeps every decision as part of the record of that place.

Do not attack any incumbent by name in customer-facing material.

## Constraint set for the peer-recommendation sentence

INTERNAL ONLY. Same rule set as the other categories — see `31_smartcity_dashboards.md` for the full constraints. The plan-review-specific note: the recommendable outcome here is almost certainly about *time and consistency* ("our reviews go out in days and they say the same thing every time") rather than about capture, because the capture benefit is invisible to the person experiencing it. The durability angle for this category is best expressed as the city keeping its own decisions, not as data capture.

## External language: what may be said

This section and the next are the only parts of this document that may be used in collateral.

**The one-liner.** Send less of your review out the door — submittals arrive pre-reviewed against your own code, cited section by section.

**The short description.** Plans are checked against your city's adopted code before they reach your intake staff. What passes, what fails, and what needs a human eye is already sorted, and every finding points at the section it comes from. Your reviewer accepts, edits, or overrides anything, and their decision is recorded with their reasoning. The comment letter comes out of the same flow. Your staff spend their time on judgment instead of catching the same errors over and over — which means more review handled in-house and a queue that moves.

**The three things to lead with.**

1. *Do more with the staff you have.* Submittals arrive pre-reviewed, so your examiners spend their time on judgment rather than first-pass error-catching — and less of your review has to go to an outside firm.
2. *Cited to your code, every time.* Findings point at the actual section of the code your city adopted, not a generic rule. Your reviewer accepts, edits, or overrides, and their judgment governs.
3. *Your decisions stay yours.* How your city has decided things becomes part of your record, so consistency does not depend on who is at the desk that day, and the reasoning is still there years later.

**How to describe the outcome.** More of the work stays in-house, submittals come in cleaner, and the queue moves. State this as what the system does. Never attach a savings figure, a percentage, or a cycle-time claim.

**Smart reports.** Plan review sits alongside the smart reports the platform produces — studies a city would otherwise commission or go without. Two are live today in the property surface: the smart site X-ray, the full read on a place, and the flood and drainage study, which answers what happens to a property in a heavy rain. The library grows, and reporting a city needs can be built. See the smart reports library artifact for the full story; do not enumerate report types beyond these two without checking it first.

**Language to avoid.** Never say digital twin, RWA, tokenization, on-chain, blockchain, atom, node, or substrate. Never say Codex, GovTitle, or Bluebeam. Never name a competitor. Never claim the system approves, permits, or certifies anything. Never show or quote verbatim body text from a licensed model code. Never imply review runs without a reviewer.

## Approved claims register

Every claim a design agent may print, with its source. A claim not in this table is not approved.

| Claim | May be stated as | Source |
|---|---|---|
| Submittals are pre-reviewed before reaching intake staff | Stated plainly as the mechanism | Operator framing 2026-08-01 |
| Less review needs to go to an outside firm | "handle more of your review in-house" — as what the mechanism enables, never as a measured saving | Operator framing 2026-08-01 |
| Existing staff get further | "do more with the staff you have" | Operator framing 2026-08-01 |
| Outsourced review is a large city cost | Usable as context for the problem cities face, NOT as our result and NOT with a customer's figure | Operator market knowledge 2026-08-01 |
| Two smart reports are live | "the smart site X-ray and the flood and drainage study" | Live in Property Explorer, operator-confirmed 2026-08-01 |
| Review runs against the city's own adopted code | Stated plainly | `48_cortex_reporting_plan_review_spec.md` |
| Every finding carries a code citation | Stated plainly | `48_cortex_reporting_plan_review_spec.md` F3/F6 |
| Reviewer accepts, edits, or overrides; their judgment governs | Stated plainly | `48_cortex_reporting_plan_review_spec.md` F4 |
| Override and reason are captured, attributed, timestamped | "recorded with their reasoning" | `48_cortex_reporting_plan_review_spec.md` F4 write contract |
| Uncertain and unchecked are surfaced, not guessed | "the system says when it cannot judge something" | `48_cortex_reporting_plan_review_spec.md` F3 |
| Findings accumulate and are reusable across reviews | Stated plainly | `48_cortex_reporting_plan_review_spec.md` F5 |
| Reasoning behind any determination can be opened | "open any finding and see what it rests on" | `48_cortex_reporting_plan_review_spec.md` F7 |
| Decisions become part of the property's record | Stated plainly | Storage layer; F4 atom write-back |
| Parcel context renders alongside the review | Stated plainly | `48_cortex_reporting_plan_review_spec.md` map integration |
| Licensed model codes are accessed through an authorized channel | "we work with the code publisher through an authorized data channel" — only after the SaaS agreement is signed | `75n_icc_code_connect_catalog.md` |
| Canonical code citation format | "2018 International Building Code Section X.X" — full title always | `75n_icc_code_connect_catalog.md` |

**Claims explicitly NOT approved.** Any cycle-time claim, including "cut review cycles in half" — we have no measurement and the first city to check would find us out. Any savings figure, percentage, or ROI number. Any customer's review spend, whether named or implied. Any claim that the system approves, permits, or certifies. Any claim of automated review without a reviewer. Any verbatim reproduction of licensed code body text in copy, screenshots, or demos. Any customer-facing display of licensed model-code content before the ICC SaaS agreement is signed. Any corpus size or jurisdiction-count figure without tracing it to live state first — every such number in the older docs is stale. Any Bastrop plan-review production claim without verifying current deployment state. Any named-competitor comparison.

## Open items

1. **ICC access-policy stamping.** The MCP audit could not confirm ICC-derived atoms carry an ICC-specific access policy at ingest; gating is generic (`_inbox/2026-07-29_mcp_audit_pe_stack_gap.md`). Live license-risk item — resolve before any licensed content reaches a customer-facing surface.
2. **ICC demo and SaaS agreement.** The demo unlocks customer-facing display. Until signed, licensed content stays platform-internal and cannot be shown to a customer (`75n_icc_code_connect_catalog.md`).
3. **Deployment state at Bastrop.** This master defines the category; what is live in Bastrop's plan review today must be verified against the running system before any proof claim is made in collateral.
4. **Superseded doc reconciliation.** `47_codex_plan_review.md`, `33_smartcity_codex_1b_integration.md`, and the M4-B/PLR/SD/W vocabulary in `30_smartcity_os.md` all describe the retired generation and should be retired by status flip per doc conventions.
5. **Contractor-firm channel.** Out of scope here; needs its own framing pass if revived, not a revival of the host-tool-invited architecture.
6. **Smart reports library.** A separate cross-category artifact, owed. Two reports are live in the property surface (smart site X-ray, flood and drainage study); Bastrop's SmartCity deployment carries a further set that becomes library material on rebuild. Do not enumerate beyond the two live ones until that artifact exists.
7. **Reports Center is marketed ahead of build.** In the deployed SmartCity code, the Reports Center lists 21 named reports whose download handler emits a fixed text template rather than generating anything, and `QUICK_REPORTS_GUIDE.md` in that repo documents six of them with illustrative KPI tables and claims PDF download the code does not produce. Same class of problem as the retired GovTitle name. Establish whether that guide has been shown to any city or channel partner, and decide its disposition in the rebuild. Recorded 2026-08-01; not a focus of this pass.
8. **Pricing.** Government pricing tiers remain an operator decision gating pricing collateral.

## Revision history

- 2026-08-01, origin. Category defined in strategy session: plan review as the category where the city produces new knowledge and where adjudications deposit back onto places; current generation fixed as the cortex-reporting F1–F7 spec plus ICC, with the Codex 1a/1b generation explicitly marked superseded; licensed-content constraint recorded as binding on all collateral; buyer is the city manager, reviewer is served and never replaced.
