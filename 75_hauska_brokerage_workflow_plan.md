---
id: 75_hauska_brokerage_workflow_plan
title: Hauska brokerage workflow plan — Matrix listing + SkySlope
status: draft
last_updated: 2026-05-26
applies_to: portfolio
related: [75a_hauska_brief_extension, 08_tiered_access_model, 09_post_saas_substrate_thesis, 14_pricing_framework, 16_commercialization_roadmap, 18_stakeholder_graph, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 40_design_accelerator, 46_smartcity_parcel_intelligence, 50_hauska_mcp_server, 71_pipeline, 73_partnerships, 74_commercial_agreements, _dispatches/2026-05-26_cc-agent-C_brokerage_brief_api]
owner: nick
---

# Hauska brokerage workflow plan — Matrix listing + SkySlope

> **Purpose.** Executive summary and execution plan for the brokerage GTM wedge: cited property intelligence inside the tools Texas agents already use (Unlock MLS / Matrix on the listing; SkySlope on the deal file). One product engine, two workflow latch points, one listing identity thread.
>
> **Status posture.** Draft for operator review. Does not supersede substrate v1 or Cortex prod QA priorities; sequences brokerage work after Cortex prod validation and defines what gets built in parallel vs queued.

## Executive summary

Brokerages will not adopt another standalone research app. Valerie Thompson (eXp, Austin) and peers live in **Unlock MLS / Matrix** when browsing listings and in **SkySlope** (or Dotloop) when assembling transactions. Hauska wins by meeting them in both places with the same artifact: a **Property Brief** (constraint flags, environmental layers, and Texas adopted-code citations where the corpus supports the city).

**Product name (working):** Hauska Property Brief.

**One-liner:** One click on the MLS listing; the same cited brief is already in the SkySlope file when the deal opens.

**Why us vs aggregators (e.g. ReadyPermit):** Breadth-at-national-scale is not the wedge. The wedge is **workflow-native delivery** (Matrix + SkySlope) plus **atomized municipal code reasoning** in Central Texas metros where the Hauska corpus is deep.

**Go-to-market:** Premium per brokerage pilot, priced per active deal or team cap. Design partner: Valerie / one regional office. Scale path: Unlock MLS subscriber-tool listing + SkySlope partner API.

**Engine reuse:** Cortex site-context briefing pipeline, Regrid/FEMA/USGS adapters, Hauska substrate `search_atoms` / `get_atom`, MCP auth/tier scaffolding, PDF export path (collateral sprint). Net-new work is workflow glue, brokerage tenancy, and partner integrations.

---

## Strategic lane

### What we are selling

Not "AI feasibility." Not "another MCP for Grok."

We are selling **defensible property intelligence at the moment of professional action**:

| Moment | Agent question | Hauska surface |
|--------|----------------|-----------------|
| Listing browse / showing prep | "What should I know about this lot before I write or show?" | **Matrix listing** — one-click brief |
| Deal assembly | "What goes in the file before option period?" | **SkySlope** — brief auto-uploaded to transaction folder |

### What we are not selling in v1

- National 50-state coverage claims
- CMA / MLS comps replacement
- Legal advice or approved disclosure language
- Standalone Deal Desk web app as primary UX
- Grok/Claude connector as onboarding requirement

### Structural commitments (check)

| Commitment | Posture |
|------------|---------|
| Sell reasoning, not data | Every brief: reasoning summary, source list, confidence, timestamp, run ID |
| Partnership-first | Federal/Regrid baselines OK; city permit/adjudication Layer 2 only via partnered cities |
| Cost per jurisdiction | Pilot limited to corpus-backed TX cities; honest "not in corpus" |
| MCP-first (substrate) | Brokerage product is workflow-native; MCP/Grok is Tier 2 add-on |

---

## Product definition

### Property Brief (single artifact)

**Inputs:** Street address and/or MLS listing ID; optional deal type (buyer DD, listing prep, investor screen).

**Outputs:**

1. **Constraint layer** — FEMA flood, EPA/EJScreen (with mirror disclosure where applicable), parcel/zoning baseline (Regrid), USGS and related federal layers per Cortex adapters.
2. **Code layer** — Adopted code sections for 3 to 5 standard questions (ADU, pool, STR, major addition, setbacks) **only when** `jurisdiction_key` is in corpus; otherwise explicit gap.
3. **Reasoning summary** — Plain-language synthesis with citations to atoms and adapter sources.
4. **Audit block** — Run metadata for brokerage compliance (who, when, corpus version, tool version).

**Delivery formats:**

- PDF (brokerage logo on enterprise tier)
- Share link (read-only, expiring)
- SkySlope document upload (binary)
- Matrix: click → panel or download (phase-dependent)

### Identity thread

One **`listing_key`** (MLS # + originating system `unlock` + normalized address) ties:

- Matrix brief runs
- SkySlope file attachments
- Amendment watch subscriptions (city-level)

Same property, same history, no re-entry.

---

## Architecture (one engine, two surfaces)

```text
                    ┌─────────────────────────────────┐
                    │     Hauska Property Brief API    │
                    │  (briefing + code Q + PDF + audit) │
                    └───────────────┬─────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
   │ Matrix latch │        │ SkySlope     │        │ MLS Grid /   │
   │ (extension → │        │ webhook +    │        │ Trestle      │
   │  partner)    │        │ doc upload   │        │ (listing ID) │
   └──────────────┘        └──────────────┘        └──────────────┘
```

**Repos / owners (initial):**

| Component | Likely home | Notes |
|-----------|-------------|-------|
| Brief API + tenancy | New service or `legacy-design-tools` route namespace | Reuse `@workspace/briefing-engine` |
| SkySlope connector | New small service or `hauska-mcp-server` adjacency | OAuth + webhooks + upload |
| Matrix extension | **`P:\hauska-brief-extension`** (pilot v0.4.1) | Chrome MV3; see [`75a_hauska_brief_extension.md`](75a_hauska_brief_extension.md) |
| Brokerage admin | Web app on Cloud Run | Slug, seats, usage, branding |

---

## Surface A — Unlock MLS / Matrix (listing)

### Context

Central Texas agents use **Unlock MLS** ([unlockmls.com](https://www.unlockmls.com)), powered by **Matrix**. Valerie's listing links are Matrix listing detail pages with her name as listing agent. Unlock lists partner tools (RPR, Remine, My Flood Status, etc.) at [unlockmls.com/unlocktools](https://www.unlockmls.com/unlocktools).

### Target UX

Agent opens listing in Matrix → **Hauska Property Brief** control visible → one click → brief ready in under 90 seconds (panel, download, or both).

### Delivery phases

| Phase | What | Timeline | Pilot fit |
|-------|------|----------|-----------|
| **A0** | Paste Matrix URL or address at `brief.hauska.dev` | 1 to 2 weeks | Valerie demo |
| **A1** | Chrome extension: detect Matrix listing detail, inject button, parse MLS#/address | 3 to 5 weeks | Brokerage pilot |
| **A2** | Unlock MLS **subscriber tool** partner application + native launch | 3 to 6 months | Scale |

**A0 acceptance:** Valerie pastes 3 live listing links; receives branded PDF without installing anything.

**A1 acceptance:** Extension works on Unlock Matrix listing URLs; 90% parse success on address/MLS#; button visible on detail view.

**A2 acceptance:** Listed on unlockmls.com/unlocktools; launch path documented in Matrix help; Unlock-approved.

### Data for Matrix

| Source | Use |
|--------|-----|
| DOM parse (extension) | Address, MLS #, list price, status from page |
| MLS Grid / Trestle (brokerage-licensed) | Authoritative listing key, geo, county |
| Hauska corpus | Code layer by `jurisdiction_key` |

### Partnership path

1. Operator outreach to Unlock MLS partnerships (parallel to A1).
2. Position: "cited constraint + adopted code brief on the listing" (complements RPR valuation, My Flood Status).
3. Legal: data use, display, disclaimer, E&O posture review before enterprise claims.

---

## Surface B — SkySlope (transaction file)

### Context

SkySlope provides a **Partner API** ([forms.skyslope.com/partner/api/docs](https://forms.skyslope.com/partner/api/docs)): OAuth, create/update files, **upload document to file**, webhooks. Onboarding requires partner program (order form, sandbox, credentials).

### Target UX

Brokerage connects SkySlope once (admin OAuth). When a transaction file is created or property address is saved, Hauska runs a brief in the background and **uploads PDF to the file folder**. Agent opens the file they were already building and finds **Hauska Property Brief.pdf** without a separate login.

### Delivery phases

| Phase | What | Timeline | Pilot fit |
|-------|------|----------|-----------|
| **B0** | Email/BCC or manual "attach to file ID" for demo | 1 week | Fake SkySlope UX in sales |
| **B1** | Webhook on file create / address update → brief → `Upload Document to File` | 6 to 10 weeks | Brokerage pilot |
| **B2** | Checklist item + template slot + brokerage branding | +4 weeks | Premium tier |

**B1 acceptance:** New SkySlope file with Cedar Hill (or pilot metro) address receives Hauska PDF within 2 minutes; document visible on file refresh.

**Threading with Matrix:** If brief was run from Matrix on same `listing_key`, SkySlope upload notes "Brief also available from listing run on [date]" to avoid duplicate compute (optional v1.1).

### Partnership path

1. Apply to SkySlope API partner program immediately (long pole).
2. Pilot brokerage confirms SkySlope vs Dotloop; build one TMS first.
3. Dotloop v2: `LOOP_CREATED` webhook per [Dotloop public API](https://dotloop.github.io/public-api/) if second brokerage requires it.

---

## Unified pilot — "Hauska for [Brokerage]"

### ICP

Regional brokerage or eXp office cluster in **Central Texas** (Williamson, Travis, Bastrop belt, Cedar Hill corridor). Buyer-heavy team or small investor desk. Uses **Unlock MLS + SkySlope**.

### Design partner

Valerie Thompson (eXp) — design partner for A0/A1 UX and copy; not proof of brokerage-scale GTM alone.

### Pilot offer (30 days)

| Element | Terms |
|---------|-------|
| Fee | $2,500 to $5,000 flat |
| Included | 40 Property Briefs, brokerage logo PDF, 6-city corpus coverage map |
| Success metrics | ≥25 briefs on real deals; ≥70% agents say they would use Matrix button weekly; ≥50% TCs notice SkySlope auto-doc |
| Exit | Per-deal pricing decision ($49 to $79/brief) or team monthly ($499+/mo) |

### Geography (honest)

Ship only cities with eval-passing corpus. Publish live coverage list on admin portal. Example pilot metros: Cedar Hill, Round Rock, Georgetown, Bastrop, Hutto, Austin (as corpus allows). **No silent failure** outside list.

### Sales narrative (brokerage managing broker)

> "Your agents already live in Matrix and SkySlope. Hauska puts a cited constraint and code brief on the listing when they're shopping the property, and in the SkySlope file when the deal opens. Same report, no extra app, built for Texas adopted code where we have the city corpus."

---

## Build plan

### Prerequisites (do not skip)

| Gate | Owner | Why |
|------|-------|-----|
| Cortex prod QA clean on pilot address | Nick + cc-agent-C | Brief engine trust |
| Corpus deploy for pilot cities | cc-agent-E + operator merge | Code layer |
| `brief.hauska.dev` or subdomain + TLS | cc-agent-M / operator | Pilot hosting |

### Phase 0 — Brief API + manual pilot (weeks 1 to 3)

**Goal:** Valerie and first brokerage see magic without MLS or SkySlope contracts.

| # | Deliverable | Owner | Status |
|---|-------------|-------|--------|
| 0.1 | `POST /api/brokerage/v1/brief` — address in, JSON (+ PDF later) | cc-agent-C | **Dispatched** [`_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md`](_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md) |
| 0.1b | `POST /api/brokerage/v1/brief/summarize` — Grok reasoning on atom set | cc-agent-C | Same dispatch |
| 0.1c | `POST /api/brokerage/v1/research/chat` — follow-up Q&A with citations | cc-agent-C | Same dispatch (feeds deep research page) |
| 0.2 | Brokerage tenant model (slug, API key, usage counter) | cc-agent-C | v1: `BROKERAGE_DEV_API_KEY` env |
| 0.3 | 5 code question templates per pilot city | planner + engine | **Done in extension** (`CODE_QUERIES`); server must mirror |
| 0.4 | PDF template (Hauska + optional brokerage logo) | cc-agent-C | Queued after 0.1 |
| 0.5 | Public coverage page (`/coverage`) | planner | Open |
| 0.6 | Paste-URL page: parse Matrix link pattern for address/MLS# | cc-agent-C | Open |

**Exit:** 10 successful briefs on real Valerie listings; PDF quality approved by Nick.

**Extension today:** MCP path works locally; point `briefApiUrl` at cortex-api when 0.1 ships.

### Phase 1 — Matrix extension (weeks 3 to 7)

| # | Deliverable | Owner | Status |
|---|-------------|-------|--------|
| 1.1 | Chrome extension MV3 — listing URL detection (Zillow, Redfin, Matrix) | extension pilot | **Done** v0.4.1 |
| 1.2 | Content script: extract address + MLS # | extension pilot | **Done** |
| 1.3 | Panel + deep research; call Brief API when `briefApiUrl` set | extension pilot | **UI done**; API pending 0.1 |
| 1.4 | Extension install guide for pilot brokerage | Valerie + planner | Open |

**Exit:** 5 agents use extension on live listings for 2 weeks.

**Canonical extension doc:** [`75a_hauska_brief_extension.md`](75a_hauska_brief_extension.md)

### Phase 2 — SkySlope connector (weeks 4 to 12, parallel after partner sandbox)

| # | Deliverable | Owner |
|---|-------------|-------|
| 2.1 | SkySlope partner application submitted | Nick |
| 2.2 | OAuth connect flow (brokerage admin) | cc-agent-M or new |
| 2.3 | Webhook receiver: file created / address updated | |
| 2.4 | Brief job queue + `Upload Document to File` | |
| 2.5 | Pilot brokerage E2E on 10 new files | |

**Exit:** PDF appears in SkySlope without agent action on ≥8/10 test files.

### Phase 3 — Stickiness (weeks 8 to 14)

| # | Deliverable | Owner |
|---|-------------|-------|
| 3.1 | Brief history by `listing_key` in admin | |
| 3.2 | City amendment watch (re-run brief alert) | |
| 3.3 | Brokerage playbook rules (5 configurable flags) | |
| 3.4 | Compliance export CSV (runs per deal) | |

### Phase 4 — Partnership scale (months 4 to 9)

| # | Deliverable | Owner |
|---|-------------|-------|
| 4.1 | Unlock MLS subscriber tool listing | Nick + partnerships |
| 4.2 | SkySlope marketplace / partner listing | |
| 4.3 | MLS Grid feed for listing-key authority | Bizops + engineering |
| 4.4 | Tier 2: Grok follow-up chat on same brief | cc-agent-C | **Pulled forward** — `/research/chat` in Phase 0 dispatch; MCP Tier-2 tool optional later |

---

## Commercial model

### Pricing (pilot → scale)

| Tier | Price | Includes |
|------|-------|----------|
| Pilot | $2.5k to $5k / 30 days | 40 briefs, extension, SkySlope if ready |
| Team | $499/mo + $49/brief over 20 | 6 cities watch, 20 briefs, logo PDF |
| Brokerage | $2.5k to $8k/mo | Unlimited agents, SkySlope auto-upload, playbook, compliance export |

Layer 1 code in brief is substrate marketing; **brief itself is Layer 3** workflow product per `08_tiered_access_model.md`.

### Upsell (custom in-house)

| Upsell | Indicative | Trigger |
|--------|------------|---------|
| Branded PDF + disclosure layout | $5k to $15k one-time | Pilot conversion |
| SkySlope template + checklist integration | $10k to $25k | TC adoption |
| MLS Grid enterprise feed | $25k to $75k | Multi-office |
| Custom playbook workshop | $10k + retainer | Investor/luxury teams |
| Consumer site embed | Embedder annual | Brokerage marketing |

---

## Dependencies and sequencing vs portfolio

| Workstream | Relationship |
|------------|--------------|
| Cortex prod QA | **Blocks** brief quality claims |
| Sync 5 / corpus depth | **Defines** pilot city list |
| `mcp.hauska.dev` commercial | Parallel; brokerage product uses Brief API not public MCP |
| Cortex site-context 2D | **Feeds** constraint layer quality |
| ECI / ADR-019 project memory | Out of scope v1 |
| 46 SmartCity parcel intelligence | Complementary; city-facing, not brokerage |

**Focus queue rule:** Brokerage Phase 0 to 1 runs **after** Cortex prod QA gate clears; SkySlope Phase 2 runs in parallel once partner sandbox exists. Do not displace Sync 5 or substrate launch without operator kill/queue call.

---

## Risks and mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| SkySlope partner approval slow | High | Extension + paste URL sell pilot; Dotloop alt |
| Unlock native integration slow | Medium | Chrome extension is full pilot UX |
| Brief wrong for city not in corpus | High | Hard coverage gate + UI disclaimer |
| E&O / "legal advice" perception | High | Decision-support copy; audit trail; broker legal review in pilot contract |
| ReadyPermit parity on marketing | Medium | Workflow-native + TX code depth positioning |
| Extension breaks on Matrix UI update | Medium | URL + fallback paste page |
| Compute cost per brief | Medium | Cache by parcel hash 24h; cap pilot volume |

---

## Success metrics

### Pilot (30 days)

- 25+ briefs on non-test addresses
- ≥3 agents repeat use without prompting
- NPS-style: "would pay $49/deal" ≥60% yes
- SkySlope: auto-doc on ≥70% of new buyer files (if B1 live)

### 6-month

- 2 paying brokerages on Team or Brokerage tier
- Unlock or SkySlope partnership at least in sandbox/listed
- <5% brief regenerate rate due to quality complaints
- ≥1 custom upsell signed ($10k+)

---

## Open decisions (operator)

| # | Decision | Options | Default if no call |
|---|----------|---------|-------------------|
| D1 | Pilot TMS | SkySlope only vs Dotloop branch | SkySlope; ask Valerie brokerage stack |
| D2 | Brand name | Hauska Property Brief vs co-brand | Hauska Property Brief |
| D3 | First pilot brokerage | Valerie office vs separate regional | Separate regional + Valerie design partner |
| D4 | Extension vs web-only pilot | Extension required vs paste URL only | Extension for wow; paste URL week 1 |
| D5 | Legal review before pilot contract | Yes vs defer | Yes before paid pilot |
| D6 | New repo vs cortex-api namespace | `hauska-brokerage` service vs routes on cortex-api | Routes on cortex-api v1; extract when load warrants |

---

## Immediate next steps (next 14 days)

1. **Nick:** Confirm pilot brokerage SkySlope vs Dotloop; submit SkySlope partner inquiry.
2. **Nick:** Get 3 redacted Matrix listing URLs from Valerie for parser spec.
3. **Planner:** File decision record if lane approved (`_decisions/2026-05-26_brokerage_matrix_skyslope_lane.md`).
4. **cc-agent-C (after QA gate):** Phase 0 Brief API + paste-URL page dispatch.
5. **Valerie:** 30-min design partner session: button label, PDF sections, disclaimer copy.
6. **Partnerships:** Draft Unlock MLS introductory email (subscriber tool, not code ingest).

---

## Related docs

- [`18_stakeholder_graph.md`](18_stakeholder_graph.md) — Valerie Thompson, brokerage channel
- [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md) — city-side parcel briefing (complementary)
- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex briefing engine origin
- [`71_pipeline.md`](71_pipeline.md) — add brokerage pilot row when operator greenlights
- [`73_partnerships.md`](73_partnerships.md) — Unlock MLS, General Code tracks; add SkySlope row
- [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) — Tier 2 MCP follow-on, not v1 wedge

---

## Revision history

| Date | Change |
|------|--------|
| 2026-05-26 | Initial draft — executive summary and phased plan (Matrix + SkySlope) from brokerage strategy session |
