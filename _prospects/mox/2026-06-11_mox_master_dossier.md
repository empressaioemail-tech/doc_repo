---
id: mox_master_dossier
title: Mox — consolidated dossier (everything we know, pulled forward)
status: active
last_updated: 2026-06-11
applies_to: mox_engagement
owner: nick
related: [_prospects/mox/mox_prospect_briefing, _prospects/mox/2026-06-07_mox_engagement_plan, _prospects/mox/mox_executive_summary_v2, _prospects/mox/2026-06-07_mox_operator_direction_parking, _prospects/mox/mox_prospect_project_instructions, _prospects/mox/collateral, 71_pipeline]
---

# Mox — consolidated dossier

> **What this is.** A single pull-forward of everything in the repo on the Mox account as of 2026-06-11: the briefing, the engagement plan, the executive summary, the collateral manifest, the operator parking note, the pipeline entry, and the project memory. Synthesis only, no new claims. Where two sources disagree, both are carried with provenance. Internal working doc, not a Mox deliverable; nothing here goes to Mox verbatim.

## 0. Canonical vision (refined) and status

**Pipeline status (71_pipeline.md, 00_current_state.md).** Post call-1, awaiting the CEO meeting. The Mox CEO meeting timing is the open gate per CLAUDE.md "What is open"; it reframes pilot urgency once it lands. Mox is the second-customer signal for SmartCity OS post-Bastrop and the validation case for the bring-your-own-agent / per-product MCP-surface tier model.

**The refined vision is canonical (operator-confirmed 2026-06-11).** The earlier fork is resolved in favor of the most recent iteration: the 2026-06-07 engagement plan plus the operator parking direction. Mox is a **scoped tenant on the shared Hauska substrate that consumes the Hauska SDK and the gated MCP as an external consumer**, the same way our own product apps will once the engines are decoupled. Mox is a forcing function and validation case for engine extraction (ADR-008, unfrozen 2026-06-06) and the Hauska SDK completion sprint (`53_*`). The engagement is built as the two-flywheel, scoped-tenant architecture in section 4, with surfaces in section 5 and the phasing in section 6 (engagement-plan phasing: prove on the owned book first).

**Where that leaves the 2026-05-13 briefing.** The briefing remains the source of truth for account facts — the people, the scale, the tech stack, the call-1 outcome, the pitch language, the production-vs-roadmap honesty, the risks and anti-patterns. What is superseded is its strategic framing that "lead Phase 1 with the accounting close" was the whole engagement thesis. Under the refined vision the accounting monthly-close-and-variance work is the likely first wedge *inside the Manage app*, on the owned book, after Phase 0 proves calibration; it is one surface of a scoped-tenant substrate build, not the engagement's organizing idea. Read Reading-A material in section 6 as wedge-selection guidance, not as the top-level plan.

## 1. The account

**Who.** Mox is a vertically integrated Austin-based multifamily operator, a 2024-era rebrand from "Internacional Realty." Three arms under one roof plus a JV:

- **Manage** — third-party property management for institutional and private owners; public headline metric "18 to 23% reduction in controllable line items."
- **Own / Invest** — majority and JV ownership positions; the capital side (acquisitions, asset management, disposition). (Briefing labels this arm "Own/Acquire"; the engagement plan labels it "Invest.")
- **Build (BLDR by Mox)** — construction and renovation arm for value-add repositioning, including third-party construction management. (Formerly labeled "Renovate" on their site.)
- **JV — Mox Impact Housing with Shepherd Equities** (also referenced as "Impact Living") — affordable / mixed-income partnerships with government agencies and non-profits; a different regulatory and reporting beast than the rest of the portfolio.

Mox also owns a payroll company that runs internal payroll for the org.

**Scale.** Two figures on record, both carried:

- Per Miguel on the 2026-05-13 call: ~300 employees, 45 locations across all five Texas markets, 12,000 units total rent roll. Average deal ~300 units (Citizen House Bergstrom, 414 units, October 2025, Austin near the Tesla Gigafactory / Oracle / ABIA, is atypically high).
- Per the 2026-06-07 engagement plan: roughly 40 communities and 10,447 residences operating now, with a larger all-time book indicating an active, churning third-party management business.

**Departments.** HR, Training, Marketing, Acquisitions, Accounting (VP to senior accounting to property accounting at ~1 per 10 to 12 locations to AP clerks, fully remote), plus an inside/outside leasing staff of 5 to 10 per site.

### Leadership and the people who matter

- **L. Miguel Arce — CEO, majority owner, decision maker.** Financial analyst 1998, CEO since 2014, majority owner since 2016. UTSA grad, NMHC member, on the PeakMade Student Housing exec board, 40k+ units career involvement. Operator, not technologist. Buys outcomes.
- **Sean — CFO** (also owns acquisitions per the engagement plan). Ex-Lynd, Big 4, CPA. Owns capitalization, asset management, investor relations. The ROI-math grader.
- **Andrea — Director, reports to Miguel.** Mission: "finding efficiency opportunities not only within the Mox enterprise, but also residential communities we serve." Most likely day-to-day champion.
- **Sarah — Senior Analyst.** Owns PMS onboarding and continuous-improvement-via-new-technology. Knows where the data actually lives. Yardi insider.
- **Beau — IT Manager.** 9 years in seat, MSP background, multifamily PM tech specialist. Integration gatekeeper. Befriend early; win him with the sovereignty story.
- **Joe Goss — Managing Director, Central Texas acquisitions** (engagement plan also associates him with construction). Deal sourcing, underwriting. Already AI-savvy. Phase 2 friend, not Phase 1 wedge.
- **Sammy — Marketing Manager** (since March 2024). Counterpart for Yardi Marketing IQ / CRM wrap work.

### Tech stack

Yardi is the system of record ("used Yardi forever"); Voyager or Breeze, consumer-facing layer is RentCafe. Yardi has an "ordering system" and "Marketing IQ," acknowledged as "clunky in spots." Yardi CRM is "getting out front with everybody," the user-visible surface staff touch daily and where dissatisfaction is most acute. They are about to move to a current version of Yardi, opening a small upgrade window where wrap-vs-rebuild conversations are easier than usual. Workflows are "as manual as manual can be" (Miguel's framing). The acquisitions / BD team is "the most savvy with Claude," using AI for investment packages, market analysis, production tasks.

### AI philosophy signal

Miguel reshared a Venterra Realty LinkedIn post on AI in property management. Amplified takeaway: integration is everything; tools that require a workflow overhaul for marginal gains aren't worth it; AI should streamline, not replace personal connections. Treat as a literal product brief: rip-and-replace pitches lose; wrap-existing-Yardi-and-light-up-the-substrate pitches win.

## 2. Call 1 outcome (2026-05-13)

### What landed

Miguel re-spoke the architecture back in his own words, accepted without pushback:

- **Don't rip and replace.** "Dozens of different softwares; you don't rip and replace that, it's a rug pull, doesn't do anything."
- **Data rails as substrate.** "We connect your systems, put it on one set, kind of like a rail for data, like we have payment rails." He bought the metaphor and used it back.
- **Atoms as institutional knowledge that travels.** The unit-401-fixed-in-Miami-applies-elsewhere story. "Everything compounds over time. Your whole institution, knowledge bank, that's what's different about us than just an off-the-shelf AI platform."
- **Multi-agent watching.** "AI watching other AI watching other AI... it's being looked at through five other different lenses."
- **Customer-owned data (IPFS framing).** Data should leave with the customer, not the vendor; stored where they choose (Google, Amazon, local). Miguel did not push back. Expect Beau to.
- **Yardi as eventually-a-tab.** "Yardi will just be a tab on a dashboard at some point... the very first thing is to put you on a unified database and start capturing company intelligence." Miguel: "call it the MOX dashboard."

### What did not land (because we didn't lead with it)

The civic intelligence wedge (parcel intelligence, code ingestion, jurisdiction-aware AI) barely came up, only as analogy. No specific feature pitches; we pitched substrate, deliberately. Commercial frame not negotiated in detail; he nodded at "consultation is definitely the way."

### Next ask

Miguel invited the next step: send email, he connects his assistant plus a couple of point people for another call to qualify both sides (their opportunity/problem/challenge versus our solutions). Shape: in-person or recorded discovery, start at vision/objectives, walk down the org chart finding pain points, Andrea and Sarah co-driving.

## 3. The thesis we are selling

**Foundational positioning** (`05_living_lineage_thesis.md`): a real property is the durable thing; it outlasts every vendor that touches it. A property's complete decision lineage is a first-class data asset distinct from any application. For Mox: every Mox property has a 50-year lineage that should outlast Yardi and the next two PMSes; their data should be theirs forever and travel with the asset.

**The Mox-facing thesis** (engagement plan + exec summary): Mox already produces the operating data, but today it is scattered across Yardi, email, broker decks, and disconnected tools, and most of it is lost after use. We capture that work as it happens, turn it into intelligence Mox owns, and feed it back into the next decision so it gets less wrong over time. We are NOT selling a leasing chatbot, a maintenance-triage bot, or "AI for property management."

**Atom architecture** (the substrate that landed): an atom is the smallest addressable entity, carrying identity (typed entity + stable ID + content-addressed CID + DID), a context interface (`contextSummary(scope)` making it AI-readable by default), composition (which other atoms it contains/references), and history (semantic memory + hash-chained signed event chain). Five rendering modes required at registration; contract is compile-time enforced. For Mox: every unit, building, lease, work order, vendor invoice, resident, inspection, ownership transfer, capex item is an atom that carries its own AI-readable self-description, travels across the footprint, and compounds in value.

**Storage substrate** (ADR-010/011/012): atom-graph over IPFS with Postgres as index and access-control; DID + IPNS identity across versions; `.atom` / `.atompack` export as downloadable, self-rendering, signed containers. This is the technical realization of the data-sovereignty pitch Miguel accepted.

## 4. Architecture approach (engagement plan, 2026-06-07)

Mox is a scoped tenant on the shared Hauska substrate, not a fork. The same gate code runs, on Mox's private store.

- **Two flywheels, split by competitive sensitivity.** A private operating flywheel for Manage and Invest, sovereign, never pooled, where the moat is calibration depth on Mox's own outcomes. A shared ground-truth flywheel for the noncompetitive code and regulatory layer that BLDR and Invest parcel intelligence draw on, which sharpens because the wider network feeds it too.
- **Mox MCP** exposes shared Hauska tools (search code atoms, parcel intelligence, pre-submission review) plus Mox-specific tools (log to project, draft in Mox voice, screen a deal against the portfolio). Makes Mox AI-native and not locked to any single model.
- **Three surfaces over one core:** a dashboard for executives, department apps for deep work, and an ambient browser extension as the universal low-friction capture layer riding across the systems Mox already uses, with no per-system integration to build.
- **The deposit loop is the calibration mechanism.** A human confirm/edit/reject at the point of work is the contribution that calibrates the core. Capture is assist-first, so the assist earns the right to capture.

### Substrate readiness mapping (planner analysis)

Half of Mox rides existing Hauska engines; half is net-new:

- **BLDR** (code intelligence, pre-submission plan review, cited accept/edit/reject) rides the Codex product (4 MCP tools) plus the plan-review/finding engine and the public code corpus. Closest to ready; the BLDR mockup is the Codex reviewer re-skinned.
- **Invest, parcel half** (zoning, flood, parcel polygon, code risk) rides the public place tools (`resolve_place`, `get_place_dossier`, `get_place_layers`) plus the property/parcel engine (FEMA, USGS, EPA, Regrid, Cotality). Ready-ish; Cotality depth pending the credential fix.
- **Invest, underwriting half** (underwrite vs operating actuals, predictive twin) and **Manage** (close, variance, invoice coding, churn) are net-new, Mox-private, built on the tenant store.
- **Command center** is a read/aggregation layer over the tenant store, not an engine.
- **Ambient extension** is the `hauska-brief-extension` pattern generalized across Yardi/Gmail/LoopNet/AHJ.
- **Mox MCP** is a scoped-tenant instance of the Hauska MCP gate plus Mox-specific tools (Tier-2 skill/execution-atom territory, ADR-013/014, tenant-scoped).

**The scoped-tenant pattern.** Mox, SmartCity OS, and the brokerage extension are three instances of one pattern: a scoped tenant with custom surfaces on the shared gated spine, under the same theology (calibration + sovereignty, the deposit loop, the gate). SmartCity OS is currently an island; bringing it onto the spine is the same work as onboarding Mox.

**Dependency chain Mox forces:** ADR-005 multitenancy (scoped per-tenant private store, tenant `accessPolicy` at the gate; today the gate gates by product, not tenant); ADR-008 engine extraction (gate-front the property/parcel and plan-review engines); arrow two (the deposit loop and the tenant-partitioned evidence ledger). Mox and SmartCity are the forcing functions that turn these three from roadmap into load-bearing.

**Two flywheels = the accessPolicy partition.** Private operating flywheel (Manage/Invest) is `tenant-private`, never pooled. Shared ground-truth (code/regulatory, BLDR + Invest-parcel) is `public-free`/`public-paid`/`tenant-shared`. The architecture is the substrate architecture; the missing piece is enforcement, not design.

## 5. Product surfaces and collateral (built, not wired to Mox data)

Representation collateral is built and in the operator's hands; none is wired to Mox data. All numbers shown are placeholders, not Mox actuals. Charcoal/white, Mox brand, real Mox logo. Filed under `_prospects/mox/collateral/` (HTML source lives with the operator; only the manifest README is in-repo).

| File | Surface | What it shows | Persona |
|---|---|---|---|
| `mox_01_command.html` | Command center | Portfolio read across 40 communities + 3 arms; "needs your call" action inbox; "what the core learned this week"; Ask Mox rail | Miguel (CEO) |
| `mox_02_extension.html` | Ambient browser extension | Follows the user across Gmail/Yardi/LoopNet/AHJ; assist-in-the-moment (pull vendor history, summarize, draft reply); capture-as-byproduct | universal |
| `mox_03_manage.html` | Manage app | Monthly close + variance, auto-drafted commentary, pre-coded invoices, exception review, churn signal | Andrea (property accounting) |
| `mox_04_invest.html` | Invest app | Underwrite vs operating reality, owned-asset actuals vs underwrite, parcel intelligence, predictive twin, pipeline | Sean (CFO/acquisitions) |
| `mox_05_build.html` | BLDR app | Multi-jurisdiction code intelligence + pre-submission plan review with cited findings, scope + subcontractor history | Joe Goss (construction) |
| `mox_06_flywheel_diagrams.html` | Flywheel diagrams | The mechanic; private vs shared (gate routes deposits); why it compounds (arms feed each other) | — |

Also produced: `Mox_Intelligence_Overview.pptx` (walkthrough deck) and `mox_executive_summary_v2.md` (business-impact exec summary).

**Six product surfaces to build** (engagement plan): command center, Manage app, Invest app, BLDR app, ambient extension, Mox MCP.

## 6. Phasing

Two phasings are on record. The **engagement-plan phasing is canonical** (the refined vision, section 0); the exec-summary phasing is the Mox-facing narrative version of the same shape, and the briefing wedge order below is wedge-selection guidance for what ships first inside the Manage app, not a competing top-level plan.

**Engagement-plan phasing (2026-06-07, substrate-tenant framing) — canonical:**

- **Phase 0 — prove on the owned book.** Stand up the data core for a single owned community, wire capture, prove calibration against real outcomes. Gate: results are real and history is trustworthy. Nothing points outward until this passes.
- **Phase 1 — surfaces and capture.** Ship the command center, three arm apps, and the ambient extension over Mox's private store through the scoped-tenant MCP. Get assist-first capture and the deposit loop working in real workflows.
- **Phase 2 — calibration loops live.** Add outcome fields to every confidence assertion, wire verdict capture, calibrate against actuals, turn on cross-line compounding (Manage feeds Invest feeds BLDR).
- **Phase 3 — point the proof outward.** The 10x horizon, sequenced only after the loop is proven on the owned book.

**Exec-summary phasing (Mox-facing, 2026-05-15):** Discovery (4 to 6 weeks, org map + first wedges + year-one roadmap) → Months 1 to 3 (unified data layer, MOX dashboard live, first wedge most likely monthly close) → Months 3 to 6 (first Build-side capability, most likely multi-jurisdiction code intelligence + pre-submission review) → Months 6 to 12 (parallel build-out across Manage/Own/Build) → Year 2+ (the flywheel takes over). Each phase ships a sandbox each department can touch.

### Phase 1 wedge order (briefing, Reading A)

Order matters. Do NOT lead with acquisitions (Joe's team will grade us).

1. **Monthly close & variance for accounting — the demo that wins Sean.** Largest manual surface, fully remote, clean before/after metric, automatic CFO visibility. Atoms: `gl-account`, `gl-transaction`, `vendor-invoice`, `property-rollup`, `variance-commentary`. Ties to Mox's public "18 to 23% reduction in controllable line items" claim.
2. **On-site GM / leasing workflow — the demo that wins Andrea.** 5 to 10 people × 45 sites doing similar work differently; institutional-knowledge bleed. Atoms: `resident`, `lease`, `work-order`, `tour-event`, `application-event`, `vendor-contact`, inspections.
3. **Wrap Yardi Marketing IQ + CRM — the demo that wins Sammy and leasing teams.** Don't rebuild; wrap. Capture what they produce, normalize on the rail, surface the answers they should give. Atoms: `marketing-campaign`, `lead`, `tour-event`, `application-event`, `cohort-attribution`.

## 7. 10x horizon and Phase 2+ reveals (kept in pocket)

**10x horizon (engagement plan, not committed):** capital engine (live verifiable track record lowering cost of capital); mandate engine (owner-facing proof surface that wins/retains third-party management mandates); doors-per-head (operations handle routine cases so a person oversees exceptions across a far larger portfolio, marginal cost per door toward zero); risk & insurance engine (operating data into lower premiums or a captive). Separate strategic note: the largest version is to productize the platform for other operators (Mox as anchor and first proof point), which carries a real arming-competitors tension and belongs in its own conversation.

**Phase 2+ reveals (briefing):** parcel intelligence for Joe Goss (acquisitions deal-screening copilot: APN in, ownership network + entitlements + FEMA + opportunity zone + LIHTC + school-district risk out; `46_smartcity_parcel_intelligence.md`); code ingestion for BLDR (pre-development feasibility, Impact Housing JV compliance reporting; `49_code_ingestion_pipeline.md`); atom packs as a sellable artifact (`.atompack` exports that make Mox a Hauska distributor as a side effect; ADR-012); cross-jurisdictional submarket truth reports as white-label LP revenue (Mox bills the LP, we bill Mox; `08_tiered_access_model.md`).

## 8. Pitch frame

**Use these (from call 1):** "Substrate, not feature." "Atoms, not records." "Data rails, not data lake" (Miguel said it back). "You own your data; we hand you the keys." "Yardi becomes a tab" / "MOX dashboard." "Multi-agent watching agents" (sparingly; lands with Miguel, spooks finance/IT).

**Audience matching:** substrate + atoms-that-travel + data-rails for Miguel; verifiable/auditable/cryptographic-chain + clean before/after metrics for Sean; data-sovereignty + content-addressed + you-can-swap-us-out for Beau. Drop the "five lenses" framing in front of finance and IT.

**Avoid:** "AI for property management" (sounds like EliseAI/Funnel/Travtus); "replace your PMS" (Miguel's red line); "train your team on AI"; "workflow automation platform" (Zapier/n8n framing); "vector database / embeddings / RAG" (Miguel doesn't care; Beau only after trust).

## 9. Commercial framing

Not negotiated on call 1. Most likely shape given Miguel's "consultation is the way" and operator mindset:

- **Discovery / scoping retainer** — fixed fee, 4 to 6 weeks; deliverables = atom catalog draft, Yardi-ingestion technical scope, accounting-close demo storyboard, 90-day pilot plan. The natural ask out of call 2. Range floated: $50k to $150k. Mox is enterprise/well-funded, so Path B (price honestly) is more defensible than the Bastrop $1M Path A anchor.
- **Phase 1 pilot** — one wedge (accounting close most likely), one geography (Austin metro ~10 properties), 90 days, outcomes-tied (close-cycle days, AP exception rate, variance-commentary auto-coverage). Fixed pilot fee + outcome bonus.
- **Phase 1 ramp** — extend to all 45 locations on the chosen wedge; recurring revenue starts. Per-property subscription + per-seat dashboard + outcomes-tied close cycle.
- **Phase 2 expansion** — additional wedges; paid integrated-workflow tier per `08_tiered_access_model.md`.
- **Revenue-share / markup on Mox's LP-side white-label** — the upside lever; converts the conversation from cost-center to margin-add.

Sean grades in basis points and IRR: anchor pricing to outcome multiples, not seat counts. Engagement-plan commercial note: the substrate-consuming half (BLDR, parcel intel, calibration, tenancy, decoupling) is spine and earns cycles regardless of Mox; the net-new ops-finance half should be scoped and priced as a design-partner or custom build, not absorbed silently as spine work.

## 10. Structural commitments and guardrails

- **Sovereignty.** The private operating flywheel is never pooled. Only the noncompetitive code/regulatory layer flows into shared ground truth. (This is the tenant-data-sovereignty expression of the constitution; Mox is the enterprise tenant the requirement is built for.)
- **Calibration.** Every confidence assertion carries outcome capture. Do not ship confidence not calibrated against outcomes.
- **Capture is scoped, owned, role-gated per ADR-007.** It captures the work, not the worker; never a keystroke monitor.
- **Mox is a scoped MCP tenant on the shared substrate, not a fork.**

## 11. Open questions

**Engagement-plan opens:** (1) which arm and community is the Phase 0 proof site — route Miguel/Sean; (2) Yardi access model and scope (read level, which entities) — route Mox ops/IT; (3) real figures to replace illustrative placeholders — route Mox; (4) internal owner for each surface + stakeholder confirmations — route Mox; (5) commercial structure (design-partner vs custom build, economics) — route operator + TX startup attorney; (6) the private-vs-shared boundary in writing — route operator + Mox; (7) doc slot — RESOLVED 2026-06-07 (`_prospects/mox/`).

**Briefing opens — sales:** day-to-day champion (best guess Andrea primary, Beau gatekeeper, Sarah data-layer); discovery retainer number; multifamily exclusivity (Texas? multifamily? global?); IP ownership of the multifamily atom catalog (the big one — productizable to every other operator).

**Briefing opens — technical:** Yardi version and module mix (Sarah owns); upgrade-window timing; where data physically lives today; existing AI footprint (EliseAI/Funnel?); Impact Housing JV data governance (PII, government partners); what "MOX dashboard" means concretely.

**Briefing opens — strategic:** is Mox a one-off lighthouse account or the first instantiation of a productized Hauska multifamily vertical; how the engagement interacts with Bastrop/SmartCity capacity.

## 12. Risks and anti-patterns

**Risks:** we're a civic/AEC vendor walking into multifamily (mitigate: be transparent, frame as first vertical instantiation with the architecture moat from day one, price as founder-build not retail SaaS); Joe's team will grade us if we lead acquisitions; Beau can rightly slow us if not sold on sovereignty; Sean will ask hard realized-vs-claimed-savings math; Yardi version migration timing could collide with discovery; the multi-agent framing spooks finance/IT.

**Anti-patterns:** don't pitch "Powered by Hauska Engine" to Mox until they buy in; don't promise IPFS/DID/`.atompack` as shipping today (accepted ADRs, not built); don't show civic/Bastrop case studies as proof (different vertical/buyer); don't let Mox see internal product names (SmartCity OS, Cortex, Codex, Revit Connector); don't commit to a Phase 1 pilot timeline in call 2 (retainer-then-scope first).

## 13. Production-vs-roadmap honesty (carry into any Mox-facing claim)

Pitch the architecture (atoms, data rails, atom packs, customer-owned lineage), real conceptually and production at the contract layer, plus a delivery commitment on the substrate (IPFS / DID / export) built during the engagement. Mox is not paying for a prototype; they're paying for the first vertical instantiation and getting the moat from day one. Per the briefing status table, in production: atom contract, the code corpus, SmartCity OS (Bastrop), Cortex (limited). Committed-not-built at the time of the briefing: IPFS storage, DID layer, `.atom`/`.atompack` export, parcel-intelligence surface, code-ingestion tooling. (For current ground-truth corpus and tooling figures, reconcile against `_research/2026-06-06_cross_repo_recon.md` and `00_current_state.md` before quoting any number externally; the briefing's 2026-05-13 figures are point-in-time.)

## 14. Source index

- `_prospects/mox/mox_prospect_briefing.md` (2026-05-13) — the comprehensive briefing; account, call-1, tech state, civic-to-multifamily mapping, wedges, pitch, commercial, risks.
- `_prospects/mox/mox_executive_summary_v2.md` (2026-05-15) — Mox-facing business-impact summary.
- `_prospects/mox/mox_prospect_project_instructions.md` (2026-05-14) — paste-ready custom instructions for the team Claude project.
- `_prospects/mox/2026-06-07_mox_engagement_plan.md` — substrate-tenant engagement plan + phasing + substrate-readiness mapping.
- `_prospects/mox/2026-06-07_mox_operator_direction_parking.md` — operator seed (Mox as SDK-consuming external tenant; the unreconciled Reading B).
- `_prospects/mox/collateral/README.md` — collateral manifest (six HTML mockups + deck + exec summary).
- `71_pipeline.md` — Prospect entry (status, gate, pipeline relevance).
- `memory/mox_prospect.md` — project memory (decision maker, scale, call-1, wedge selection).

## Revision history

- 2026-06-11, created by consolidating all in-repo Mox sources into one dossier per operator request. Synthesis only.
- 2026-06-11, operator confirmed the refined vision (scoped SDK-consuming tenant on the shared substrate, per the 2026-06-07 engagement plan + parking direction) is canonical. Folded the prior Reading-A / Reading-B fork: the engagement-plan architecture and phasing are canonical; the 2026-05-13 briefing is retained as account-fact context with the accounting-close-first wedge demoted to first-wedge-inside-Manage rather than the engagement thesis.
