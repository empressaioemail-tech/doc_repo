---
id: 72b_capital_readiness_audit
title: Capital readiness audit — the pre-diligence checklist
status: active
last_updated: 2026-06-15
applies_to: portfolio
owner: nick
related: [72a_capital_raise_positioning, HAUSKA_INVESTOR_BRIEF, 61_property_intelligence_master_plan, 00d_portfolio_roadmap_reference, 53a_noncustodial_settlement_rail, 00_current_state]
---

# Capital readiness audit

> **What this is.** The tracked, owner-tagged pre-diligence checklist. It promotes the [`72a`](72a_capital_raise_positioning.md) "gaps to close before going to market" section into a live audit, one row per gap, each with verified current state, what closes it, an owner, and a status. It exists so the gaps are managed to closure rather than restated in narrative. [`72a`](72a_capital_raise_positioning.md) remains the source of truth for story and [`HAUSKA_INVESTOR_BRIEF.md`](HAUSKA_INVESTOR_BRIEF.md) for verified state; this doc does not restate either, it tracks the gaps between current state and a defensible data room.
>
> **Verification basis.** Status claims trace to the live cross-repo recons ([`_research/2026-06-09_cross_repo_recon.md`](_research/2026-06-09_cross_repo_recon.md), [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md)) and to live gh, gcloud, and endpoint checks run 2026-06-15. Where a row states a number it carries the verified figure, never a bare headline.
>
> **Premortem.** Filing this checklist cleared premortem-check green: it strengthens commitments 1 (sell reasoning) and 2 (confidence earned) by tracking the honest gaps rather than asserting readiness, tracks the unmeasured cost-per-jurisdiction as an open gap rather than claiming it, and serves the Hauska spine as diligence prep. No load-bearing yellow.

## The checklist

| # | Diligence gap | Current state (verified) | What closes it | Owner | Status |
|---|---|---|---|---|---|
| 1 | Verifiable-output provability + collateral resync | Provability is closed: the engine cut is live in prod and the Miami keystone ran a real web-grounded cited finding. Residual is finding QUALITY, not provability. But `72a` and `HAUSKA_INVESTOR_BRIEF.md` still carry the 2026-05-26 snapshot framing and the obsolete "not provable / ships mock" gap. | Rewrite both to current state; the rule is the two must agree before any external share. | planner | OPEN (resync owed) |
| 2 | Cortex auth and data isolation | Anonymous-owner isolation fix (PR #180) merged green 2026-06-15, NOT deployed. Prod is `cortex-api-00169-jep`; unauthenticated `GET /api/engagements` returns 58 real engagements (verified live 2026-06-15). The exposure is live. | Deploy #180 (own canary, apply migration 0039, verify unauth denies on the canary URL, shift). | cc-agent-C + Nick | FIX MERGED, DEPLOY PENDING (live exposure) |
| 3 | Public-vs-internal corpus split as an external-framing gate | 34 jurisdictions / 21,126 atoms in the committed snapshot, of which only 2 are public-free (about 478 atoms, Bastrop and Grand County) and 32 are platform-internal. | Name it a standing requirement that the public-vs-internal split travels with every external corpus number; never ship the bare headline. | planner | OPEN (named here) |
| 4 | Sourcing posture of the 32 platform-internal jurisdictions | The cross-repo recon did not establish how the 32 platform-internal jurisdictions were sourced; it cannot currently be asserted. This is the data-room long pole and a provenance question diligence will ask. | Per-jurisdiction provenance documentation before the data room opens. | Nick + planner | NOT STARTED |
| 5 | Measured cost-per-jurisdiction across more than one city | A cleared target and a decision rule (under 200 dollars compute plus one hour review), not a measured result. The physical-world archetype asks for the measured number. | Instrument and measure the cost across two or more onboarding events. | Nick + cc-agent-E | NOT STARTED |
| 6 | First paid metered call through the rail | No external customer has paid for a metered call. The gate is live (`hauska-mcp-server-00007-njc`, 57 tools) but no external consumer has transacted. This is the traction proof the agentic-infrastructure archetype probes. | One external caller pays one metered Layer-2 call end to end including settlement. | cc-agent-M + Nick | NOT STARTED |
| 7 | Payment substrate honesty (custody) | The crypto verify-only primitive is the right shape. The fiat Circle path is now built but custodial by construction (collect to a Hauska wallet, then disburse), and the revenue router takes a cut from the gross. That is money-transmitter and broker shape. See [`53a`](53a_noncustodial_settlement_rail.md). | The verify-only re-architecture in `53a` (party-to-party settlement, separate technology fee) plus a counsel pass. | SDK / cc-agent-E + counsel | SPEC'd (`53a`) |
| 8 | Regulatory and liability posture | The IP attorney memo and Tech E&O insurance routing have not closed. | Route the memo and bind E&O. | Nick | PARALLEL BIZOPS, DATA-ROOM LINE ONLY |
| 9 | Narrative consolidation (four commitments + tier model) | Competing versions live in canon: partnership-first still appears in the `72a` gaps four; the two-versus-three tier articulation differs across docs; an external-draft set names the atom design properties as the four. | Lock one version of each, propagate to every external-facing doc, retire the variants. Gated on the tier-model call. | planner | QUEUED (tier-model decision owed) |
| 10 | MCP gate live external-call verification | The gate is live with 57 tools registered, but the live external-call path was not independently verified in the recon, and the #26 GTM collateral shipped a stale "46-tool surface" line. | External smoke of one real gated call; correct the collateral tool count to 57. | cc-agent-M | OPEN |

## The one row that is not a gate

Row 8 (regulatory and liability posture) is a parallel bizops track and a data-room line item. It is explicitly not a critical-path gate, not a Sync blocker, and not a downstream dependency for any build. It travels into the data room as a disclosed line, and it is routed to Nick. Do not let it appear in any sequence as a blocker.

## How to read status

OPEN means the gap is named and owned but not yet closed. NOT STARTED means no work has begun and there is real lead time (rows 4, 5, 6 are the genuine pre-raise lead-time items). DEPLOY PENDING (row 2) is the one live exposure and the highest-priority close. QUEUED (row 9) waits on a single operator decision. The cross-domain four-layer thesis (one substrate proven across building, city, and well twins) is a narrative asset that strengthens this audit but is tracked as a roadmap deliverable in [`00_current_state.md`](00_current_state.md), not a gap here.

## Cross-references

- [`72a_capital_raise_positioning.md`](72a_capital_raise_positioning.md) - the story layer; this doc tracks the gaps it names.
- [`HAUSKA_INVESTOR_BRIEF.md`](HAUSKA_INVESTOR_BRIEF.md) - the verified-state snapshot; resync owed per row 1.
- [`53a_noncustodial_settlement_rail.md`](53a_noncustodial_settlement_rail.md) - the custody re-architecture that closes row 7.
- [`61_property_intelligence_master_plan.md`](61_property_intelligence_master_plan.md) - the engine build; row 2 deploy completes its Wave 0.

## Revision history

- **2026-06-15 (origin):** Filed as the tracked pre-diligence checklist promoting the `72a` gaps section. Ten rows, owner-tagged, statuses verified against live gh/gcloud/endpoint checks (the auth leak live on `00169-jep`, #180 merged-not-deployed, corpus split 2-public/32-internal, gate at 57 tools, no paid metered call). Regulatory posture (row 8) explicitly scoped as data-room line only, never a critical-path gate. Premortem-cleared green; source-required satisfied via the cited recons and live checks.
