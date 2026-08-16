---
id: atx_bulls_18_build_prd
title: Build PRD — the Bulls platform (MVP fires + full-vision scope, own repo)
status: draft
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
related: [atx_bulls_11_portal_spec, atx_bulls_02_athlete_twin_program, atx_bulls_14_cashflow_map, atx_bulls_15_financial_umbrella, atx_bulls_17_fan_standing_progression, atx_bulls_16_cashflow_adversarial_review]
purpose: The product requirements and build plan for the Bulls platform in its own repo - the minimum viable build that puts out today's fires (tryout signup+pay, VIP capture, and the tryout agility-capture console) and the phased path to the full Bulls vision. Positioned to Cody as the long-term player, fan, and vendor management platform. Detail lives in the referenced docs; this PRD is the build contract.
---

# Build PRD: the Bulls platform

## Positioning (as told to Cody, 2026-08-14)

This is the team's long-term **player, fan, and vendor management platform**. The MVP exists to put out two immediate fires and run tryout testing; everything after is phased on the same substrate. Nothing in the MVP is throwaway: a tryout applicant is a record in the same graph a founding member joins.

## Repo and architecture

1. **Own repo**, recommended name `franchise-platform` (org: empressaioemail-tech), built **factorable from day one**: all Bulls-specific content (brand tokens per doc 12, copy, fee amounts, ladder names) lives in a tenant config package; mechanism code is team-agnostic. The Bulls are tenant one; the AF1 template inherits the mechanism.
2. **Stack** (portfolio-consistent): TypeScript, Next.js (public flows, portal, staff console in one app), Postgres (Neon) + Drizzle, Stripe Connect + Stripe Tax, GCS for media (waiver PDFs, testing video), Vercel deploy, magic-link auth (passkey upgrade later), role flags (fan / applicant / player / staff / admin).
3. **Record shape** (UPDATED 2026-08-14 against live contract 1.22.0, build-session findings ratified): people and events are atom-shaped from day one using the contract directly where it ships the thing - `ActorRecordAtomInstance` for every participant class (identity; Bulls roles as a flag/edge layer on top, serving applicant-to-player continuity), `PostgresEventAnchoringService` mounted as THE append-only event history (measurements, consent changes, ledger transitions all write through it; standing-derived-from-events and append-never-overwrite are one mechanism), and `ObligationAtomInstance` + `ActorLicensingTerms` for the accrual/owed-to layer (the doc 14 metered-access loop was already typed in the contract; this platform is the first consumer wiring it). Athlete measurements: **fork ratified as option A** - a local `MeasurementProvenance` shape (measuredHow ladder, staff attribution, videoRef, measuredAt), honest about being an observation with method quality, NOT forced into `WidthedConfidence` (which would assert an unmeasured interval); built composable so real calibrated intervals from re-test data can attach at read later, per the contract's own asserted-snapshot-plus-overlay-at-read pattern. Contract ADR queued for the athlete-measurement atom family. Settlement ledger states (pending/cleared/paid/disputed) remain the platform's layer; obligation is the claim layer - composed, not conflated.
4. **Money topology** (ruled): Stripe Connect marketplace; the team is merchant of record and eats unrecoverable losses as main account holder; platform never custodies funds; ledger states pending/cleared/paid from the first transaction. Circle excluded from v1 (doc 16).

## PHASE 0 - MVP: put out today's fires

Three user-facing surfaces plus one admin view. Ships as soon as the secretary's list (items sent 2026-08-14) returns.

**0.1 Tryout flow** (`/tryouts`): event info (date, location, requirements from item 4) → applicant form (their current form's fields, item 1) → waiver presented and e-signed (their waiver text, item 2; signed copy stored as PDF with timestamp + IP) → Stripe payment of the fee (amount + refund rule, item 3; Stripe Tax configured) → confirmation email (to applicant; notification to item-8 addresses). Record created: `applicant` with source, waiver ref, payment ref.

**0.2 Fan/VIP claim** (`/join`): email + name, one tap → account with member number, Day One era badge, consent to contact → confirmation email. Import of the existing list (item 6) with **original signup dates honored** on era badges. Replaces the current form; website guy wires both CTAs to these two links.

**0.3 Tryout capture console** (staff-only, phone-first, the piece that makes tryout day work):
- Staff login → applicant lookup (name/number search, or roster list for the day, or check-in QR from the confirmation email).
- **Consent check-in gate**: per-data-class consent (performance / video) confirmed on the athlete's own phone at check-in, before any capture. No consent state, no capture - enforced, not procedural. (CUBI paperwork remains a counsel item; the mechanism ships regardless.)
- **A1 entry form per applicant**, matching the delivered protocol: 10/20-yd splits, flying 10, pro agility 5-10-5, 3-cone, vertical, broad, med-ball throw, strength entries, 300-yd shuttle, position-specific sheet - each field with a **measured-how selector (GATE-TIMED / HAND-TIMED / VIDEO / SELF-REPORTED)** and per-entry staff attribution. Unentered fields read "not yet tested," never blank.
- **Video attach** per rep: phone camera upload against the measurement (GCS), background-tolerant on field wifi.
- Re-test appends, never overwrites (event history from day one).
- Works as an installable PWA; degraded-connectivity tolerance is a requirement, not a nicety (field conditions).
- Applicant→player continuity: an applicant who makes the roster keeps the same record; tryout measurements become the opening entries of their player twin.

**0.4 Admin view** (secretary-grade, deliberately simple): list/search applicants and fans, see payment + waiver status, export CSV, resend confirmations, mark refunds per the stated rule. Notification routing per item 8.

**MVP acceptance**: a player signs up, signs, pays, and appears in admin within a minute; a fan claims and gets their numbered, era-badged confirmation; on tryout day a staff phone pulls up any applicant and records a gate-timed 10-yd split with video in under 30 seconds; the secretary exports everything to CSV without help. Banned-vocabulary scan passes on all public copy.

**Explicitly OUT of MVP** (phased below): founding pass sales, memberships, shop, standing, votes, player-facing portal, splits beyond the simple tryout-fee flow, any token anything.

## PHASE 1 - money and membership (opens the founding drop)

Founding Pass purchase with deterministic numbering + reserved block; annual membership; seat deposits (segregated per doc 16); connected accounts for players created (dormant - accrual ledgers exist, payout activation config-gated pending the league answer); the split engine with per-stream differentiated fees (doc 14 table as revised by the Cody terms conversation); refund/chargeback clawback across splits; obligations-calendar and 13-week cash view for the team (doc 16 items 2, the CFO-boring load-bearers).

## PHASE 2 - roster and content (timed to the A1 clock)

Public roster with verified player cards (provenance badges as tappable explainers); player detail with progression views; content items with gating rings (public/member/premium); player class v1-lite (My Twin, My Consents, My Earnings ledger - visible even while payouts are gated); testing-day content pipeline (capture console output → member content).

## PHASE 3 - shop and supply chain

Merch shop on the supplier reality (Cody's supplier info, requested 2026-08-14): takeover recommended (one cart, member pricing) with make-or-buy per SKU (POD vs stocked per doc 16 F10); drops engine with member-early windows and caps; numbered items recorded to accounts; player-linked SKUs with SKU-level splits (activation of the player share follows the league answer); returns clawing back across splits.

## PHASE 4 - standing, votes, season features

Doc 17 standing system (derived ranks, era + honors, purchase-weight cap, published rules); votes; perk register enforcement in admin; share cards; event check-in attendance rail (scan/ticketing integration deferred to the venue answer); sponsor surfaces (graph inventory, testing-day presented-by) with sponsor billing on the rail.

## PHASE 5 - the umbrella (team financial OS + league stubs)

Vendor payees and payables visibility; ledger-of-record layer for off-platform flows (tickets, concessions) per doc 16 F7; league-reporting exports (assessments visibility, good-standing pack); dormant league rails engineered per the stub ruling (assessment/distribution rail shapes, sub-token attestation feed endpoints - built dark, documented, awaiting the AF1 conversation).

## Dependencies and gates

| Item | Gates |
|---|---|
| Secretary list returns (form, waiver, fee, events, Stripe invite, list export, logos, notification emails, entity name) | Phase 0 build start |
| Merch supplier info (requested) | Phase 3 make-or-buy design |
| Cody decision meeting (splits, cap/price/transferability, platform terms, portal home) | Phase 1 |
| League sub-agreements read | player-payout activation; merch-takeover finality; league-rail stubs' shape |
| Strength-staff A1 review | protocol freeze before first administration (tryouts count) |
| Counsel: CUBI consent instrument; pass terms | capture at tryouts proceeds with mechanical consent; counsel confirms the instrument |
| Venue/ticketing answer | attendance rail, deposits application, phase 5 completeness |
| Build-team assignment (operator) | everything; the spec set (docs 11, 12, 14, 16, 17, this PRD) is sufficient to start |

## Risks called out (from doc 16, applied to this plan)

Tryout-day capture is a live-fire deadline with hardware reality (phones, wifi, gate timers) - run one full dry-run testing session with staff before the real day. The waiver and consent mechanics must be right the first time (minors excluded; adults only per league norms - confirm). Stripe account setup done via team invite, never credentials. The fee flow is the first real transaction on the rails - watch the first chargeback as the loss-ruling's first test case.
