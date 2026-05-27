---
id: 76_empressa_wedge_90d_operating_plan
title: Empressa wedge — 90-day operating plan ($500M base)
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, 76a_operator_autonomous_loops, 72_hauska_inc_operations, 74_commercial_agreements, 13_risk_register, 16_commercialization_roadmap, _decisions/2026-05-26_empressa_wedge_operating_commitments, 90_runbooks/diagrams/self_healing_loop.mermaid, 90_runbooks/diagrams/gtm_loop.mermaid]
owner: nick
---

# Empressa wedge — 90-day operating plan ($500M base)

> **Purpose.** Executable scaffold for the first 90 days on top of deploying the Property Brief wedge (extension + `cortex-api` brokerage routes). Combines product deploy, legal protections up front, skeleton human crew, and two operator loops (maintenance + GTM) scoped to what can run in this window. The five-year **$500M ARR** outcome is the **base plan**, not a stretch scenario.
>
> **Operator loops.** Pattern and 90-day phasing: [`76a_operator_autonomous_loops.md`](76a_operator_autonomous_loops.md). Diagrams: [`90_runbooks/diagrams/self_healing_loop.mermaid`](90_runbooks/diagrams/self_healing_loop.mermaid), [`90_runbooks/diagrams/gtm_loop.mermaid`](90_runbooks/diagrams/gtm_loop.mermaid).
>
> **Wedge spec.** Extension and API contracts: [`75a_hauska_brief_extension.md`](75a_hauska_brief_extension.md). Matrix + SkySlope GTM: [`75_hauska_brokerage_workflow_plan.md`](75_hauska_brokerage_workflow_plan.md).

## Executive summary

**Product:** One Empressa browser wedge (Property Brief today) on Hauska substrate: cited code + parcel layers + server-side Grok, upsell doors to Cortex, Codex, SmartCity OS, and future institutional data products.

**90-day outcome:** Prod wedge with parcel layers, legal stack live, first paid pilot, consent-backed event graph, both operator loops running in **minimum viable** form, path to **~$1M ARR run-rate** entering year 2.

**Humans (90 days):** Nick + 1 eng lead (or contract) + fractional counsel + cc-agent fleet. Target **7–9 FTE equivalent** by end of year 1 including legal spend, not 7–9 full hires in 90 days.

## Five-year base plan (reverse engineered)

| Year | ARR | FTE | Wedge | Other revenue |
|------|-----|-----|-------|----------------|
| 1 | ~$1M | 7–9 | Pilots + 2.5K paid Home/Pro | Vertical pilots minimal |
| 2 | ~$10M | 13–17 | 15K paid, FL/AZ | Institutional pilots, Cortex/Codex attach |
| 3 | ~$55M | 24–30 | 80K paid, 8 states | Transaction pilot, 15 institutional |
| 4 | ~$175M | 40–48 | 20 states, CA material | Data licensing scale |
| 5 | ~$500M | 50–60 | ~$130M wedge | ~$170M vertical + ~$130M data + ~$70M transaction |

Capital assumption: **$80–100M** through end of year 2. Geographic: TX depth year 1; FL/AZ by month 9 year 1; CA year 3.

## What ships in 90 days (wedge product)

This plan assumes **deploy is not optional**; operator loops sit on top of a working prod path.

| Track | Days 1–14 | Days 15–45 | Days 46–75 | Days 76–90 |
|-------|-----------|------------|------------|------------|
| **API** | Deploy migration 0026, Grok, brokerage key; parcel layers dispatch | PDF v0, paste-URL/Matrix path, disclaimer audit block | Stripe tiers + per-user auth; intent event export | Cortex upsell deep link from brief |
| **Extension** | v0.4.3 prod URLs; parcel UI | Valerie design session; copy | Share card v0 (agent); consent at install | Investor card + referral unlock |
| **Corpus** | bastrop + cedar_hill smoke | 10 TX metros eval-passing | 15 TX metros | FL/AZ scaffold decision |
| **GTM** | Coverage page | Pilot one-pager; SkySlope apply | 50 investors + 1 paid pilot | 2nd brokerage in pipeline |
| **Legal** | ToS + privacy + disclaimers | Pilot agreement; E&O application | E&O bound; share terms; graph consent | IP memo; institutional term sheet v0 |
| **Loops** | Observation schemas + maintenance triage on cortex-api | GTM log + consent fields; steward daily digest (manual) | GTM triage + Tier 0 workers | Tier 1 bounded auto; weekly KPI report |

### Day-14 gate

10 internal briefs on real addresses with code + parcel + research chat. No external demo without ToS and disclaimer.

### Day-45 gate

Valerie: 5 live listings, 4/5 "would use weekly." Brokerage intro scheduled.

### Day-75 gate

≥1 paid pilot signed; E&O bound; ≥500 briefs total; share cards only if consent live.

### Day-90 gate

$80K+ ARR run-rate **or** $150K signed pipeline; institutional design partner engaged; both loops producing steward digests.

## Legal and protections (up front)

Not deferred to year 2. Gates per [`_decisions/2026-05-26_empressa_wedge_operating_commitments.md`](_decisions/2026-05-26_empressa_wedge_operating_commitments.md).

| Item | Deadline |
|------|----------|
| ToS + Privacy Policy published | Day 30 |
| Product disclaimers (API, extension, PDF) | Day 14 |
| Brokerage pilot agreement template | Day 45 |
| E&O bound (data provider + AI) | Day 60 |
| Graph/share consent UI + share page terms | Day 46 (before share cards) |
| IP / data-licensing memo (TX counsel) | Day 90 interim acceptable |

Year 1 legal spend band: **$40–80K** (counsel retainer, E&O, templates). See [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) Property Brief gates.

## Human crew (year 1 base)

| Function | Y1 FTE |
|----------|--------|
| Founder / CEO | 1 |
| Engineering + platform | 2–3 |
| Product + design | 0–1 |
| GTM | 1 |
| Legal / compliance (fractional) | 0.5–1 |
| **Total** | **7–9** |

First W2 compliance hire: **$10M ARR or first institutional contract**, whichever is first.

## Pricing (unified ladder)

Brokerage pilots map to **Team** annual prepay, not a separate SKU.

| Tier | Price | 90-day status |
|------|-------|----------------|
| Free | $0, 5 briefs/mo | Metering by day 60 |
| Home | $20/mo | Stripe by day 60 |
| Pro | $40/mo | Agent + investor seed |
| Team | $75/seat/mo | Pilot = Team prepay |
| Enterprise | Custom | Institutional term sheet day 76–90 |

## Upsell landing zones (extension → portfolio)

| Signal | Destination |
|--------|-------------|
| High complexity / export | Cortex |
| Code / submittal language | Codex |
| Municipal badge / city domain | SmartCity OS |
| API volume | Hauska MCP |
| Aggregated activity (Y2+) | Deal-flow intelligence |

## Kill criteria (90 days)

- Pause external sales: wrong jurisdiction twice in one week on in-corpus city.
- Pause investor seed: no Stripe path and cost >$2/brief.
- Pause share/graph: consent or share terms not live.
- Pause FL/AZ scaffold: fewer than 10 TX cities eval-passing by day 60.

## Related docs

- [`76a_operator_autonomous_loops.md`](76a_operator_autonomous_loops.md)
- [`75_hauska_brokerage_workflow_plan.md`](75_hauska_brokerage_workflow_plan.md)
- [`75a_hauska_brief_extension.md`](75a_hauska_brief_extension.md)
- [`74_commercial_agreements.md`](74_commercial_agreements.md)

## Revision history

| Date | Change |
|------|--------|
| 2026-05-26 | Initial 90-day operating plan: $500M base, legal up front, operator loops cross-ref |
