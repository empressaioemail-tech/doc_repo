---
id: mox_prospect_briefing
title: Mox prospect briefing — comprehensive prep doc for team / external Claude project
status: active
last_updated: 2026-05-13
applies_to: portfolio
owner: nick
---

# Mox prospect briefing

> **Purpose.** Portable, self-contained briefing on the Mox account and on the Hauska / Empressa tech stack as it applies to Mox. Intended to be droppable into another Claude project so the rest of the team can prep for call #2 (discovery) without having to crawl the internal doc repo. Written 2026-05-13 immediately after call #1 (2026-05-13). Status posture: this is a working doc, not a deliverable to Mox; do not send to Mox verbatim.

## TL;DR

Mox is a vertically integrated Austin-based multifamily operator (manage / own / build, 300 employees, 45 locations, 12,000 units across all five Texas markets, Yardi-resident, in-house payroll co, remote accounting). L. Miguel Arce (CEO / majority owner) bought the **substrate** framing on call #1 — data rails, atoms, institutional knowledge that travels, agents watching agents, customer-owned data. He did **not** buy on a feature wedge. Next step is discovery call #2; he asked for his assistant plus point people to attend, wants to start at vision/objectives and walk down the org chart finding pain points.

**The play for Phase 1 is the manual-workflow surface he handed us on the call — accounting close first, on-site ops second, Yardi CRM / Marketing IQ wrapped third — not the civic intelligence stack that Hauska is more publicly known for. Civic (parcel intelligence, code ingestion, jurisdiction-aware AI) is Phase 2 expansion once the rail is producing.**

The strategic ambition is: become the data-rail and atom-substrate layer that sits underneath Mox's existing Yardi stack, capture institutional knowledge as `atoms` that travel across the 45-location footprint, and over time make Yardi itself a tab on the dashboard rather than the system of record. That is exactly what the engine evolution plan and the atom architecture in our repo already commit to — Mox is the first non-civic vertical it would land in.

---

## 1. The account

### Scale (per Miguel on the 2026-05-13 call)

- **~300 employees** across the company
- **45 locations** across all five Texas markets
- **12,000 units** total rent roll
- **Average deal size:** ~300 units (Citizen House Bergstrom, 414 units, October 2025 in Austin near the Tesla Gigafactory / Oracle / ABIA is recent and atypical-high)
- **Three vertical lines under one roof:**
  - **Manage** — third-party property management for institutional and private owners; public headline metric is "18–23% reduction in controllable line items"
  - **Own / Acquire** — majority and JV ownership positions
  - **Build (BLDR by Mox)** — construction and renovation arm for value-add repositioning, including third-party construction management
- **JV:** Mox Impact Housing with Shepherd Equities — affordable / mixed-income partnerships with government agencies and non-profits; different regulatory and reporting beast than the rest of the portfolio
- **Owns a payroll company** that handles internal payroll for the 300-person org
- **Departments:** HR, Training, Marketing, Acquisitions, Accounting (VP → senior accounting → property accounting at 1 per 10–12 locations → AP clerks, **fully remote**), plus an inside/outside leasing staff of 5–10 per site
- **Brand history:** Mox is a 2024-era rebrand from "Internacional Realty"

### Leadership and the people who matter for the build

- **L. Miguel Arce — CEO, majority owner.** Started as financial analyst 1998, CEO since 2014, majority owner since 2016. UTSA grad. NMHC member. Sits on PeakMade Student Housing exec board. Career involvement 40k+ units. Operator, not technologist. **Decision maker on this engagement.**
- **Sean — CFO.** Ex-Lynd, Big 4, CPA. Owns acquisitions, capitalization, asset management, investor relations. He is the ROI-math grader.
- **Andrea — Director.** Reports directly to Miguel. Stated mission: "finding efficiency opportunities not only within the Mox enterprise, but also residential communities we serve." **Most likely day-to-day champion.**
- **Sarah — Senior Analyst.** Owns PMS onboarding and "continuously improve efficiency using new technology and systems." She knows where the data actually lives. **Yardi insider.**
- **Beau — IT Manager.** 9 years in seat, MSP background, multifamily PM tech specialist. **Integration gatekeeper.** Befriend early.
- **Joe Goss — Managing Director, Central Texas acquisitions.** Deal sourcing, underwriting. Already AI-savvy per Miguel's framing.
- **Sammy — Marketing Manager** (since March 2024). Owns marketing surfaces; natural counterpart for Yardi Marketing IQ / CRM wrap work.

### Tech stack (confirmed on the call + public-facing inferences)

- **Yardi is the system of record.** "Used Yardi forever." Yardi Voyager or Breeze; consumer-facing layer is RentCafe. Yardi has an "ordering system" and "Marketing IQ" — Miguel acknowledges these are "clunky in spots."
- **Yardi CRM** is "getting out front with everybody" — meaning it's the user-visible surface most staff touch daily and where dissatisfaction is most acute.
- **About to move to another version of Yardi** ("they're going to set up a current version") — meaning there is a small upgrade window where wrap-vs-rebuild conversations are easier than usual.
- **Workflows are "as manual as manual can be."** Miguel's framing, not ours.
- **Acquisitions / BD team is "the most savvy with Claude" / "advancing on those types of shortcuts."** They use AI for investment packages, market analysis, production tasks. Leadership has flagged: don't lead Phase 1 there — they grade themselves.
- **Leadership awareness of AI:** Miguel told leadership "this isn't coming, it's here, and every month it feels different." They are intellectually bought-in; tactically deer-in-the-headlights. Miguel wants someone to "come in and tell stories about how you created efficiency... for more automation."

### Public AI philosophy signal (LinkedIn)

Miguel reshared a Venterra Realty LinkedIn post about AI in property management. His amplified takeaway: **integration is everything; tools that require a workflow overhaul for marginal gains aren't worth it; AI should streamline, not replace personal connections.**

Treat that as a literal product brief. Pitches that lead with rip-and-replace lose. Pitches that lead with wrap-existing-Yardi-and-light-up-the-atom-substrate win.

---

## 2. Call #1 outcome — what landed, what didn't, next ask

### What landed

Miguel re-spoke the architecture back to us in his own words during the call. Direct paraphrase of what he accepted without pushback:

- **Don't rip and replace.** Connect first, drive efficiency first. He pointed to his own situation: "dozens of different softwares; you don't rip and replace that, it's a rug pull, doesn't do anything."
- **Data rails as substrate.** "We connect your systems, put it on one set, kind of like a rail for data, like we have payment rails. What we do is we build documentation and data rails and then enhance it with AI." He bought this metaphor and used it back.
- **Atoms as institutional knowledge that travels.** Pitched as: building 35 unit 401 has a problem in Miami; building somewhere else with similar unit has a similar problem; "the system is going to know we just fixed this somewhere else." Miguel: "every everything compounds over time. Your whole institution, knowledge bank — that's what's different about us than just an off the shelf AI platform."
- **Multi-agent watching.** "AI watching other AI watching other AI. We're not only are you working with it, it's being looked at through five other different lenses."
- **Customer-owned data (IPFS framing).** Pitched as: data leaves with the platform today, that's the biggest single problem; with us, "we put it in a thing, it's called IPF[S], we give you the data in a fashion that you could say I want to store it on Google, I want to store it on Amazon, I want to store it in my local basement, right? You have control of your information." Miguel did **not** push back on this. Expect Beau to.
- **Yardi as eventually-a-tab.** Pitched as: "Yardi will just be a tab on a dashboard at some point, and if the day comes you're ready to lose Yardi, that's what it is. But the very first thing that needs to happen is to put you on a unified database and start capturing company intelligence." Miguel echoed this: "call it the MOX dashboard."

### What did NOT land (because we didn't lead with it)

- **Civic intelligence wedge** (parcel intelligence, code ingestion, jurisdiction-aware AI) — barely came up. Only as analogy ("here's a city-manager contract that goes from 6 weeks to 3 days"). Hold this for Phase 2 reveal.
- **Specific feature pitches** — no "leasing AI," no "renewal pricing engine," no "maintenance ticket triage." We did not pitch features; we pitched substrate. That was deliberate and correct given Miguel's stated philosophy.
- **Commercial frame** — not discussed in detail. He nodded at "consultation is definitely the way." Subscription vs. retainer vs. outcomes-tied was not negotiated.

### The next ask

Miguel explicitly invited the next step. Verbatim: "Shoot me your email, I'm going to connect this with my assistant, maybe a couple of other point people for us to have another call. You might have to recap more of this, and then we can further qualify both sides of it — our current opportunity, problem, challenge, whatever, and then versus then also the solutions."

Shape: in-person or recorded discovery, start at top (vision / objectives), walk down org chart finding pain points.

---

## 3. Our tech — what's real, what's roadmap, what to pitch

This section is the part the team most needs grounded. The Hauska / Empressa stack has a clean public story but a more complicated production reality. Pitch from what's real; reveal roadmap as expansion.

### Foundational thesis (positioning)

From the internal `05_living_lineage_thesis.md`, which is the strategic foundation underneath every product surface:

> A real property — a parcel, a building, a piece of land — is the durable thing. It outlasts every architect, reviewer, inspector, contractor, permitting clerk, city manager, owner, and software vendor that has ever touched it. The software industry has historically inverted this relationship: applications own data; properties are records inside applications. When the application is replaced, the data is exported (poorly), migrated (partially), or lost.

The thesis claim: **a property's complete decision lineage is a first-class data asset in its own right, distinct from any application that touches it.** Three load-bearing properties:

1. **Property as first-class entity.** The property is the durable atom; software vendors are consumers.
2. **Living, not retrospective.** Every interaction during the property's life is captured as a structured event in real time, not reconstructed from PDFs and email later.
3. **Verifiable, portable, vendor-independent.** The lineage is cryptographically anchored, content-addressed, and host-swappable.

For Mox: the equivalent claim is **every Mox property has a 50-year lineage that should outlast Yardi, AppFolio, the next PMS, and the next-next PMS.** That's the story. Their data — every variance approved, every comp, every renewal decision, every vendor swap, every resident interaction — should be theirs forever and travel with the asset, not leave with the PMS vendor.

### Atom architecture (the substrate that landed on the call)

From `25_atom_architecture_reference.md` and `adr_001_atom_architecture.md`. **An atom is the smallest addressable entity the system knows about,** carrying four mandatory layers:

1. **Identity** — typed entity (`permit`, `vehicle`, `work-order`, `parcel`, `person`, etc.) + stable ID + content-addressed CID + DID for identity-across-time
2. **Context interface** — a structured self-description method (`contextSummary(scope)`) every atom exposes; returns prose + typed fields + key metrics + related atoms + provenance tier. This is how atoms make themselves AI-readable by default.
3. **Composition** — a declaration of which other atom types this atom contains or references (a permit composes a parcel + applicant + findings + reviews; a work-order composes a vehicle + asset + assignee)
4. **History** — two layers: semantic entity memory (human-readable prose the system has learned) + cryptographic event chain (append-only, hash-chained, signed via `@hauska-sdk/core.EventAnchoringService`)

Atoms come in two flavors: **data-level** (refer to real-world entities — parcels, vehicles, permits, people; get VDA backing + signed history + portability) and **app-level** (workflow containers — sprint boards, briefings; same shape, no cryptographic anchoring).

Five rendering modes (`inline` / `compact` / `card` / `expanded` / `focus`) are required at registration time. The contract is **compile-time enforced** — an atom that doesn't implement `contextSummary` correctly doesn't compile.

**For Mox, translate as:** every unit, building, lease, work order, vendor invoice, resident, inspection, ownership transfer, capex item — each is an atom in the registry. Each carries its own AI-readable self-description. Each travels across the 45-location footprint. Each compounds in value as Mox staff interact with it. The atom registry is what makes Sylvia-fixes-401-in-Miami-applies-to-401-in-Texas literally true at the data layer.

### Atom graph and storage (ADR-010, ADR-011, ADR-012)

The substrate decisions made in the 2026-05-12 strategy session, which are exactly what landed on the Miguel call:

- **ADR-010 — atom-graph traversal over IPFS.** Atoms form a content-addressed graph stored over IPFS. Postgres serves as the index and access-control layer. Cities (or in Mox's case, Mox itself) may pin atoms to their own IPFS infrastructure — the platform pins to Google Cloud as the default; same atom, multiple pins, content-addressed, swappable.
- **ADR-011 — DID + IPNS identity across versions.** Atom CIDs change when content changes; DIDs give identity-across-time. A unit's DID is permanent; the CID changes every time the unit's atom updates.
- **ADR-012 — `.atom` and `.atompack` export format.** Atoms are downloadable as standalone zip-format containers (`.atom` for a single atom; `.atompack` for collections like a jurisdiction's full code). Each carries a self-rendering `view.html`, an LLM-readable `atom.json`, an `llm-context.md` paste-into-any-chatbot bootstrap, plus signature proofs. **Distribution becomes branding.**

This is the technical realization of the data-sovereignty pitch Miguel accepted on the call. Mox can pin its property lineage to its own infrastructure. Mox can download a `.atompack` of every atom about Citizen House Bergstrom and drop it into Claude / ChatGPT / whatever they choose. The atom keeps working without our platform alive.

### Products (current public framing)

From `07_product_line_summary.md`:

- **SmartCity OS** — operational platform for city managers, planners, inspectors. **In production today** running Bastrop's operations on Google Cloud Run (`smartcityos.io`). Replaces the patchwork of GIS + permit software + spreadsheets + email.
- **Cortex** — AI-assisted design for architects/engineers; jurisdiction's code as a live design partner. In active development (formerly "Design Accelerator"); used today on real projects (Musgrave Residence, Seguin, others). Renaming pass in flight.
- **Codex** — plan review intelligence. Two surfaces: **Codex 1b** (city-side reviewer) and **Codex 1a** (contractor pre-submission). Codex 1b in Phase 1 build per `48_codex_program_plan.md`; 1a deferred to Phase 5+.
- **Revit Connector** — Cortex's intelligence inside the Revit tool architects already use. Building today as a .NET add-in for Revit 2024 + 2026.
- **Hauska Engine** — the engine under Cortex and Codex. Currently lives inside the `legacy-design-tools` repo; factor-out to a standalone `hauska-engine` repo is committed in ADR-008 but gated on SmartCity OS stabilization sprint.
- **Code Ingestion Pipeline** — designed in `49_code_ingestion_pipeline.md`; tooling buildout starts after Bastrop Sprint A.1. Turns "atomizing the next jurisdiction's code" from a sprint into a pipeline run.

**Brand pattern: products are branded forward (SmartCity OS, Cortex, Codex). The engine is acknowledged as the substrate — "Powered by Hauska Engine."**

### What's actually in production vs. roadmap (be honest about this)

| Capability | Status | Notes |
|---|---|---|
| Atom architecture contract | **Production** | 19 domain atoms registered in api-server registry; contract enforced at compile time |
| Code corpus (atomized municipal code) | **Production** | 479 atoms across Grand County Land Use (215) + Bastrop Muni Code (189) + Grand County IWUIC (61) + Grand County IRC (14) |
| SmartCity OS (Bastrop) | **Production** | Live on Cloud Run since 2026-05-03; MyGov permits (12,240), OpenGov BNP, Spireon vehicles (21), Power BI dashboards live |
| Design Accelerator / Cortex | **Production (limited)** | Live on Replit; real projects in active use; brand migration to "Cortex" in flight |
| Revit Connector | **Production (limited)** | Building + auto-deploying as .NET add-in; A04.7 engagement-identity fix landed; no automated tests yet |
| Atom registry expansion (code-section, code-definition, etc.) | **Designed, Bump 1 in flight** | Sprint A.1 in `11a_bastrop_live_roadmap.md` is shipping these |
| Code Ingestion Pipeline | **Design active, tooling not built** | B.1–B.6 sprint structure spec'd in `49_code_ingestion_pipeline.md`; starts post-A.1 |
| Parcel Intelligence | **Design active, surface not built** | `46_smartcity_parcel_intelligence.md` specs the capability; sequencing vs. Bastrop-live open |
| IPFS storage substrate (ADR-010) | **Committed, not built** | Today atoms live in Postgres; IPFS pinning + Postgres-index layer is the target architecture |
| DID + IPNS identity (ADR-011) | **Committed, not built** | Same — committed in ADR; implementation pending |
| `.atom` / `.atompack` export format (ADR-012) | **Committed, not built** | Renderer obligation per atom type, but the exporter itself not built |
| Adjudication-context atoms (institutional-knowledge capture) | **Designed, capture starts with Bastrop-live** | Sprint A.1 day-one capture per `27_engine_evolution_plan.md` |
| Hauska Engine factor-out | **Gated** | Gated on SmartCity OS stabilization Phase 2C closure |

**Implication for Mox conversation:** what we sell Miguel is the *architecture* (atoms, data rails, atom packs, customer-owned lineage), which is real conceptually and production at the contract layer, plus a *delivery commitment* on the substrate (IPFS / DID / export) that we build during the Mox engagement. We are honest that the property-management vertical is a net-new application of the engine; we are honest that the substrate pieces are being built; we are emphatic that Mox is not paying for our prototype — they're paying for the first vertical instantiation and getting the architectural moat from day one.

---

## 4. Vertical mapping — how the architecture transfers from civic to multifamily

The Hauska tech was built for the civic / AEC stack: parcels, permits, codes, plan reviews, inspectors, architects. Mox is a different vertical. The architecture transfers cleanly, but the **atom catalog** is new.

### Direct atom mappings (civic → multifamily)

| Civic atom type | Mox equivalent | Notes |
|---|---|---|
| `parcel-record` | `parcel-record` (same name; expanded composition) | Every Mox-managed property is a parcel; same DID-anchored structure |
| `permit` | `lease`, `renewal`, `work-order` | The "submittal that gets adjudicated" pattern maps directly to leasing and maintenance |
| `finding` (plan review) | `inspection-finding`, `move-out-finding`, `unit-condition-finding` | Same shape: typed, citable, adjudicable |
| `code-section` | `lease-policy-section`, `house-rule`, `ada-compliance-section`, `fair-housing-section` | Mox has its own internal code corpus (operating policies, lease templates, vendor SOPs) that becomes a `policy-section` atom set |
| `person` | `resident`, `applicant`, `staff`, `vendor-contact` | Same atom with scoped views per relationship |
| `vehicle` | `vendor-truck`, `service-vehicle` (less load-bearing for Mox) | Limited applicability |
| `inspection` | `unit-inspection`, `move-in-inspection`, `move-out-inspection`, `routine-inspection` | Same |
| `adjudication-record` | `decision-record` (variance approval, exception, comp credit, fee waiver) | The compounding-context atoms are the moat for Mox the same way they are for cities |

### New atom types for multifamily

Atoms Hauska doesn't have today that Mox needs:

- `unit` — a leasable unit; composes one parcel + many leases over time
- `lease` — a tenancy agreement; composes a unit + applicant + dates + terms + rent schedule
- `rent-schedule` — atom representing pricing over time per unit
- `work-order` (already in civic registry; redefines for property maintenance)
- `vendor-invoice` — AP atom; composes a vendor + GL coding + property
- `gl-account` and `gl-transaction` — accounting atoms (these are what compound for the close-and-variance demo)
- `variance-commentary` — the prose accountants write each month explaining why an account moved; **this is the highest-leverage atom for the Phase 1 demo**
- `comp-record` — a comp draw for an acquisition or refi; composes a parcel + rent comp + sale comp
- `tour-event`, `application-event`, `lease-event`, `move-in-event`, `move-out-event` — the lifecycle event chain for a unit

### What stays the same across verticals

- Contract enforcement (compile-time `AtomRegistration`)
- Context interface pattern (`contextSummary(scope)`)
- Five rendering modes per atom type
- Hash-chained event history per data-level atom
- IPFS storage + Postgres index + DID identity
- `.atom` / `.atompack` export
- Scoped access per ADR-007 (tenant-of-record patterns map directly — property owner is tenant, manager + residents + vendors are scoped readers/writers)

### What we'd commit to building in a Mox engagement

A Mox-specific **atom catalog** (the list of registered atom types for the multifamily vertical), a Yardi-to-atom ingestion layer that captures everything from Yardi into the atom substrate without changing Yardi, and the multi-agent workflow layer over it. The atom contract and engine itself don't fork — Mox extends the registry, not the engine.

---

## 5. Phase 1 wedges — what to lead in the next call

Order matters. These are the three places we lead, in this order. **Do not lead with acquisitions.** Joe's team is already AI-savvy and will grade us. We earn the right to expand into acquisitions in Phase 2.

### Wedge 1 — Monthly close & variance for accounting (the demo that wins Sean)

**Why this first.** It is the largest manual-labor surface in Mox (VP + senior accountants + property accountants 1-per-10-locations + AP clerks), it is fully remote (atom-substrate's "context that travels" thesis is most viscerally needed here), monthly close has a clean before/after metric, and CFO visibility is automatic — Sean cannot ignore a 3-day close vs. a 2-week close.

**The play:**

- Atoms: `gl-account`, `gl-transaction`, `vendor-invoice`, `property-rollup`, `variance-commentary`
- Compounding context: when property accountant A in Austin codes a Comcast invoice the same way property accountant B in San Antonio does, the system learns Mox's coding pattern. When accountant C in Houston gets a new Comcast invoice, the atom proposes the coding pre-filled with reasoning. AP clerks get vendor anomaly flags pre-surfaced. VP of accounting gets a roll-up that explains itself instead of waiting for variance commentary to be written 45 times.
- Tied directly to Mox's externally-marketed claim: **"18–23% reduction in controllable line items."** Whatever they're doing today to deliver that claim, our system makes the *next* monthly close that produces that number self-explaining and self-improving.

**Why Sean buys it:** the demo is mockable in a week, defensible in a quarter, and metric-clean. He gets to brag to LPs that close went from N days to N/3.

### Wedge 2 — On-site GM / leasing workflow (the demo that wins Andrea)

**Why second.** 5–10 people per site × 45 sites doing similar work differently is the place institutional knowledge bleed is most acute. This is Miguel's stated "MOX-energy, we don't treat people like numbers" lever — the atom substrate is what makes that brand promise survive scale.

**The play:**

- Atoms: `resident`, `lease`, `work-order`, `tour-event`, `application-event`, `vendor-contact`, `routine-inspection`, `move-out-inspection`
- Compounding context: "How did the Citizen House Bergstrom team handle this in Q3" surfaces to the team at a different asset facing the same situation. Nick's Unit 401 story from the pitch, lived inside Mox's actual footprint.
- Adaptive surface: each site's GM gets a daily atom-surfaced briefing — what's overdue, who's churning, what comp risks just hit nearby, which residents are likely to renew vs. churn — drawn from the same registry.

**Why Andrea buys it:** her mandate is "finding efficiency opportunities... within the Mox enterprise and the residential communities we serve." This is that mandate, implemented.

### Wedge 3 — Wrap Yardi Marketing IQ + CRM (the demo that wins Sammy and the leasing teams)

**Why third.** Miguel literally pointed at this in the call. "Clunky in certain spots... CRM is really getting out front with everybody."

**The play:**

- Don't rebuild Yardi Marketing IQ or CRM. **Wrap them.** Capture what they produce, normalize on the data rail, surface the answers they should give but don't.
- Atoms: `marketing-campaign`, `lead`, `tour-event`, `application-event`, `cohort-attribution`. The CRM stays where it is; the atom layer is what the team interacts with.
- Quick visible wins in weeks, not months — leasing teams see better data faster, marketing sees attribution that previously took analyst time, Sammy gets a story to tell.

**Why Sammy / leasing teams buy it:** they get a tool they actually want to use that doesn't require them to give up Yardi.

---

## 6. Phase 2+ reveals — what we keep in our pocket for later

These are real Hauska differentiators that **do not lead** the Mox conversation, but become natural expansion conversations once the data rail is producing in Phase 1.

### Parcel Intelligence (Joe Goss expansion)

`46_smartcity_parcel_intelligence.md` specs a structured AI-produced briefing on what a parcel can support, what constraints apply, and what the city's approval path will look like. Data sources: FEMA floodplain, USFWS wetlands + endangered species, USGS elevation/slope, USDA soils, TCEQ aquifer zones (Texas-specific), city zoning, city infrastructure proximity, city permit history.

**For Joe Goss:** acquisitions deal-screening copilot. Drop an APN, get back: ownership network of adjacent parcels (assemblage plays), entitlements, permits filed in the half-mile, FEMA, opportunity zone overlap, LIHTC eligibility flags, school district risk. Status: capability designed, surface not built. Phase 2 conversation.

### Code Ingestion Pipeline (BLDR expansion)

`49_code_ingestion_pipeline.md` specs a pipeline that takes any jurisdiction's municipal code in (PDF, Municode HTML, eCode360 API, raw) and produces a queryable atomized corpus out. New atom types: `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus`.

**For BLDR:** pre-development feasibility. Drop a parcel APN, get back zoning use table, FAR, parking minimum, setback, affordability density bonus eligibility. Also the same engine that powers Impact Housing JV compliance reporting — affordable housing programs have heavy reporting burden against actual ordinances.

Status: design active, tooling buildout post-Bastrop A.1. Phase 2+ conversation.

### Atom packs as a sellable artifact (`adr_012`)

`.atompack` exports let Mox bundle "everything we know about Citizen House Bergstrom" and ship it to a buyer in due diligence, to an LP in a quarterly report, to an underwriter in a refi package. **This is the wedge that makes Mox a Hauska distributor as a side effect of using us** — every `.atompack` they send out is branded with both marks and carries `llm-context.md` so the recipient drops it into their own AI and the pack works.

Status: ADR-012 accepts the format shape; renderer per atom type is real engineering work that lands as each atom type gets its `focus` render mode.

### Cross-jurisdictional submarket truth reports (white-label revenue)

`08_tiered_access_model.md` outlines a tiered access model — bare reference free, context-enriched paid, integrated workflow paid. Mox-as-third-party-property-manager can white-label a "submarket truth report" per asset to its institutional LPs. Mox bills the LP, we bill Mox. Turns Hauska tech into a Mox revenue line, which converts the buying conversation from cost-center to margin-add.

Status: business model defined; needs first paid civic conversion to set market reference price. Phase 2+ conversation.

---

## 7. The pitch frame for call #2

Drawn from what landed on call #1. Use these phrasings or close variants:

- **"Substrate, not feature."** "We don't sell you a leasing chatbot or a maintenance triage bot. We sell you the layer underneath your existing Yardi stack that captures everything your 300 people do, makes it AI-readable, makes it travel across 45 locations, and gives you a moat that compounds every month."
- **"Atoms, not records."** "A unit in your database is a row. A unit in our system is an atom — it has identity, it has a self-description any AI can read, it carries its own decision history, and it travels with the property forever. Yardi rows go away when you leave Yardi. Atoms don't."
- **"Data rails, not data lake."** Miguel said this back to us. Use it. "Payment rails carry money predictably and verifiably between any two parties. Data rails carry your institutional knowledge predictably and verifiably between any two systems — Yardi today, whatever's next tomorrow, your LP's audit firm next quarter."
- **"You own your data; we hand you the keys."** "When you stop paying us, you keep your atoms. They're content-addressed, signed, exportable. You can store them on Google, Amazon, or your own server. We are a custodian of your infrastructure, not a hostage-taker of your data."
- **"Yardi becomes a tab."** Don't say "Yardi goes away." Miguel's framing — "MOX dashboard" with Yardi as one source — is what landed.
- **"Multi-agent watching agents."** Use sparingly; Miguel found it credible but it sits in tension with "explainable to Sean." When in front of Sean, drop this and emphasize verifiable / auditable / cryptographic chain.

### Phrasings to avoid

- "AI for property management" — sounds like EliseAI / Funnel / Travtus. We are not that.
- "Replace your PMS" — Miguel's red line.
- "Train your team on AI" — Miguel told us his BD team is already advanced; the rest are learning. Don't sell training.
- "Workflow automation platform" — generic enterprise-software framing. We are not Zapier / n8n.
- "Vector database / embeddings / RAG" — Miguel doesn't care; Beau might appreciate technical depth but only after he trusts us.

---

## 8. Commercial framing

Not negotiated on call #1. Most likely shape based on Miguel's "consultation is the way" remark and Mox's operator-mindset:

- **Discovery / scoping retainer** — fixed fee, 4–6 weeks, deliverables = atom catalog draft, Yardi-ingestion technical scope, accounting close demo storyboard, 90-day pilot plan. Funds an in-depth org-chart-down discovery. **This is the natural ask coming out of call #2.**
- **Phase 1 pilot** — one wedge (accounting close most likely), one geography (Austin metro = ~10 properties most likely), 90-day timeframe. Outcomes-tied: close-cycle days, AP exception rate, variance-commentary auto-coverage. Pricing: fixed pilot fee + outcome bonus.
- **Phase 1 ramp** — extend to all 45 locations on the chosen wedge. Recurring revenue starts here. Most likely shape: per-property subscription on the atom-substrate layer + per-seat for the dashboard surface + outcomes-tied for the close cycle.
- **Phase 2 expansion** — additional wedges (on-site ops, marketing wrap, then parcel intelligence for acquisitions). Tier per `08_tiered_access_model.md`: paid integrated-workflow tier.
- **Revenue-share or markup on Mox's LP-side white-label** — when Mox white-labels submarket reports to LPs, we participate in the revenue. This is the upside lever; Mox makes ~3% margin on a management fee, but every LP report they sell is incremental.

Sean is the grader. He thinks in basis points and IRR. The framing for him is: "what does this do to the controllable-line-item reduction claim you already make publicly, and what does it do to the NOI lift you sell to LPs on the next acquisition." Anchor pricing to outcome multiples, not seat counts.

---

## 9. Call #2 preparation — concrete actions before the meeting

Miguel told us exactly how he wants to be sold: start at vision/objectives, walk down the org chart, find pain points. He's inviting a textbook discovery, but he's putting us in the driver's seat. Three concrete prep moves:

### Pre-meeting send (to his assistant, ~48 hours before)

A **one-page agenda**, not a deck. Sections:

1. Vision check — confirm Miguel's stated 12-month / 36-month objectives for the company
2. Department walk — Accounting → Operations (on-site GMs) → Marketing/CRM → Acquisitions → BLDR → Impact Housing JV → HR / Training / Payroll. ~15 min per dept; identify top friction at each. Andrea + Sarah co-drive.
3. Tech context — Yardi version, upcoming Yardi upgrade window, current AI usage (BD team, anything else), data governance posture, IT constraints (Beau)
4. Phase 1 pilot framing — confirm wedge selection; confirm 90-day timeframe; confirm success metric
5. Commercial frame — retainer vs. outcomes-tied; IP / data sovereignty Q&A; what happens if Mox stops paying

Tone: agenda is collaborative discovery, not a sales pitch deck. He told us he wants to be in the room while we figure it out together.

### One-slide bring

Single diagram: **"The rail."** Yardi + RentCafe + Marketing IQ + CRM + payroll → data rail → atom store → agent layer → wraps existing workflows. Label it "MOX dashboard" in Miguel's own framing. Show one example of an atom card (e.g., a unit's render in `card` mode) so it's a concrete artifact, not just an arrow diagram.

### One storyboard bring

**The property accountant's Monday morning, before and after.** Six panels:

1. Before (today): opens 4 systems, reconciles a vendor invoice batch against GL coding, writes variance commentary for 8 properties, sends emails to AP clerks chasing missing data
2. After: opens one dashboard, reviews atom-surfaced anomalies (3 vendor invoices flagged with pre-suggested coding + reasoning), accepts/edits/rejects each (`adjudication-record` atom written per click — building the compounding institutional knowledge), variance commentary draft is pre-written from prior months' patterns
3. The compounding signal: third month in, anomaly flag rate drops because the system has learned Mox's coding patterns. By month six, accountant is reviewing exceptions, not coding line by line.

Mockable in PowerPoint; doesn't require any of the actual product to exist. Sells the substrate by showing what an atom-mediated workflow feels like.

---

## 10. Open questions for the team

Things we should resolve before call #2 (some are sales judgment, some are technical scoping):

### Sales / commercial

- **Who's the day-to-day champion?** Best guess: Andrea (efficiency mandate) as primary, Beau (IT integration) as gatekeeper, Sarah (Yardi insider) as data-layer expert. Confirm in call #2.
- **What's the right discovery retainer number?** First-deal anchor matters. Civic-side anchor is the Bastrop $1M conversation (Path A per `14_pricing_framework.md`). Mox is enterprise / well-funded, not municipal — Path B framing (price honestly) is more defensible. Range: $50k–$150k for a 4–6 week discovery + scoping retainer.
- **Are we exclusive in multifamily?** If we sign Mox as our first multifamily vertical partner, do they want exclusivity in Texas? In multifamily? Globally? This affects pricing materially and intersects with the `08_tiered_access_model.md` four consultant sub-segments.
- **IP ownership.** Does Mox own the atom catalog we build for multifamily? Do we? Joint? This is the big one — multifamily atoms built for Mox are a productizable IP we could license to every other multifamily operator. Mox might reasonably want a piece of that, or might reasonably want exclusivity to suppress it. Negotiate carefully.

### Technical

- **Yardi version and module mix.** Voyager vs. Breeze, which modules they actually use. Drives ingestion scope. Sarah owns the answer.
- **Yardi upcoming upgrade window.** Miguel mentioned they're moving to a new version. Time-box the discovery so we're scoped before the upgrade, not racing it.
- **Where does the data physically live today?** Yardi-hosted cloud? Mox-hosted Yardi instance? On-prem? Affects integration model and IPFS-pinning conversation.
- **What's the existing AI footprint?** Are they paying EliseAI / Funnel / anything else today? If so, are those happy or unhappy customers? Replacement vs. coexistence.
- **Impact Housing JV data governance.** Government partners care about PII handling. ADR-007's cross-stakeholder atom-access scopes already specify this, but the JV is a meaningfully different regulatory layer that needs its own audit answer.
- **What does "MOX dashboard" mean concretely to Miguel?** Single web app? Mobile? Embedded in Yardi as an iframe? Brand and UX choices are different per answer.

### Strategic

- **What's Phase 0 for Hauska on this engagement?** Mox is our first non-civic vertical. Do we want to:
  1. Treat it as a one-off lighthouse account that produces case studies for similar operators (Greystar, Mill Creek, Camden), or
  2. Treat it as the first instantiation of a Hauska multifamily vertical we'll productize?
  Both work; they imply different IP terms, different team allocation, different pricing.
- **How does the Mox engagement interact with Bastrop?** SmartCity OS stabilization sprint (`30a`) is consuming the team this month. Engine evolution work in `27_engine_evolution_plan.md` is in flight. Adding a Mox discovery retainer on top is doable; adding Mox Phase 1 pilot work without rebalancing is not. Be honest internally about capacity before we commit to Mox timeline.

---

## 11. Risks and anti-patterns

### Risks

- **We're a civic / AEC vendor walking into multifamily.** Mox can hear "they're learning on us" and disengage. Mitigation: be transparent about it, frame as "first vertical instantiation with the architecture moat from day one," price accordingly (Mox isn't paying full retail for a productized SaaS — they're getting the founder build).
- **Joe Goss's acquisitions team is already AI-savvy.** They will grade us in real time on call #2 if we lead acquisitions. Don't lead acquisitions. They become a friendly internal champion later, not the Phase 1 wedge.
- **Beau is the integration gatekeeper.** If we don't sell him on the architecture sovereignty story (you keep your data, you can swap us out, atoms are content-addressed), he will rightly slow us down. Bring a one-paragraph IT-buyer answer to call #2.
- **Sean is the ROI grader.** He will ask hard math questions about realized vs. claimed savings. Don't bring vague numbers. The accounting-close demo is what answers him.
- **Yardi version migration timing.** They mentioned moving to a new version. If our discovery retainer collides with their PMS upgrade, we'll lose them or have to pause. Time-box accordingly.
- **The "5 different lenses" multi-agent pitch is right for Miguel but spooks finance/IT.** Sequence: lead with substrate to Miguel; lead with verifiability + audit chain to Sean and Beau; reserve multi-agent framing for technical depth conversations only.

### Anti-patterns (do not do these)

- Do not pitch "Powered by Hauska Engine" externally to Mox until they buy in. The brand pattern is for the eventual product line, not for the discovery conversation. The conversation is with **Mox**, not with **Hauska's product strategy**.
- Do not promise IPFS / DID / `.atompack` as shipping today. They are accepted ADRs, not built code. Frame as "the architecture we commit to delivering, with you as the first vertical."
- Do not show our Bastrop / civic case studies as proof. Different vertical, different buyer. Mox doesn't care about plan review. Develop multifamily-shaped storyboards.
- Do not let Mox see our internal civic-side names (SmartCity OS, Cortex, Codex, Revit Connector). Those are sibling products in our portfolio, not what we're selling Mox. The Mox product, if it productizes, gets its own name.
- Do not commit to a Phase 1 pilot timeline in call #2. The retainer-then-scope sequence is correct. Pilot commitment comes out of the scoping work, not out of the second sales call.

---

## 12. Reference — internal docs this briefing pulls from

For team members with access to the Hauska doc repo, these are the canonical sources used to ground this briefing:

- `05_living_lineage_thesis.md` — strategic foundation; property as durable first-class entity
- `06_cities_value_narrative.md` — cities-facing application of the thesis (for vocabulary)
- `07_product_line_summary.md` — product line as currently public (SmartCity OS / Cortex / Codex / Revit Connector / Hauska Engine / Code Ingestion Pipeline)
- `08_tiered_access_model.md` — commercial structure (free / paid context / paid integrated)
- `10_ground_truth.md` — what's actually in production right now; honest delta vs. roadmap claims
- `14_pricing_framework.md` — Path A vs. Path B (tighten scope vs. price honestly)
- `25_atom_architecture_reference.md` — full atom contract spec (identity / context / composition / history; five rendering modes; AI gateway pattern)
- `27_engine_evolution_plan.md` — engine evolution + atom registry expansion + compounding-context atoms (the most recent strategic thinking; Bump 1 in flight)
- `46_smartcity_parcel_intelligence.md` — parcel intelligence capability spec (Phase 2 reveal for Mox)
- `49_code_ingestion_pipeline.md` — code ingestion pipeline design (Phase 2+ reveal for Mox)
- `adr_001_atom_architecture.md` — atom contract ADR
- `adr_007_cross_stakeholder_atom_access.md` — access scopes across tenants
- `adr_010_atom_graph_traversal.md` — IPFS storage + Postgres index + hybrid retrieval
- `adr_011_atom_identity_across_versions.md` — DID + IPNS identity layer
- `adr_012_atom_export_format.md` — `.atom` and `.atompack` export format

Memory pointers maintained in this repo's `memory/MEMORY.md`:

- `mox_prospect.md` — running project memory on the Mox account (decision maker, scale, call-1 outcome, Phase 1 wedge selection)

---

## Revision history

- **2026-05-13 (origin):** Drafted same-day as call #1 with Miguel Arce. Captures account profile, call outcome, the pitch that landed (atom substrate + data rails), tech-stack honest state (what's production vs. roadmap), vertical mapping civic → multifamily, Phase 1 wedge ordering (accounting close → on-site ops → Yardi wrap), Phase 2 reveal sequencing (parcel intel, code ingestion, atom packs, white-label LP reports), call #2 prep deliverables (agenda, one-slide rail diagram, accountant-Monday storyboard), open questions, risks, and anti-patterns. Portable to another Claude project. Do not send to Mox verbatim.
