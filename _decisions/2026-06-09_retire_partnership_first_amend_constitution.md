---
decision_id: 2026-06-09_retire_partnership_first_amend_constitution
date: 2026-06-09
owner: Nick
status: active
supersedes: [2026-05-23_partnership_first_scoping]
refines: [2026-06-08_reasoning_not_text_grounding_and_web_first_gtm]
related_canonical: [CLAUDE, 03_structural_constitution_and_drift_guard, 04_roadmap_alignment_audit, 09_post_saas_substrate_thesis, 73_partnerships, 72a_capital_raise_positioning, HAUSKA_INVESTOR_BRIEF, 57_national_code_warming_sprint, 04a_arrow_two_calibration_capture]
related_adr: [80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_008_engine_factor_out]
related_skill: [premortem-check, catalog-thesis-check]
---

## Decision

Retire **partnership-first sourcing** as a structural commitment and as constitutional invariant I8. It is superseded by the 2026-06-08 reasoning-not-text / web-first pivot: the moat moved from city operational data to the public-code reasoning corpus, the warmed corpus is web-first public model code, and the cities-as-licensors-with-revenue-share sourcing ethic is no longer expressed by the build. Carrying a commitment the build does not honor is a honesty liability, and the commitment kept surfacing as friction against the actual architecture (most recently as the load-bearing sovereignty-split complexity in the national code-warming review, and originally narrowed in `_decisions/2026-05-23_partnership_first_scoping.md`).

Three structural moves, made together so the constitution stays internally consistent:

1. **Delete partnership-first sourcing** as structural commitment #2 (CLAUDE.md) and retire invariant **I8** (cities are partners/licensors, cost recoupment) in `03`. Bastrop reframes from data-sourcing licensor to **SmartCity OS customer and design partner**; the pioneering-first-city narrative survives as a customer story, not a sourcing one.

2. **Re-found tenant data sovereignty** as an enterprise customer-trust and security commitment, not a sourcing ethic. A tenant's private data and adjudications stay isolated to that tenant and never pool into a shared or public asset (`tenant-private` accessPolicy, ADR-005/ADR-017). Public-code calibration may pool freely from anonymous and public-tier signal. This re-grounds invariant **I5** (value returns to contributors) on the tenant rather than the city, and is the customer-trust line Mox and every enterprise tenant depend on. It is gated on the tenancy/auth build (task #29 + the tenant leg); Cortex does not enforce isolation today (anonymous default tenant), so the commitment names the requirement and its path, not a present-tense guarantee.

3. **Promote calibration** to structural commitment #2 (taking the load-bearing slot partnership-first vacated): **confidence is earned, not asserted** (invariant I3, the arrow-two build). At launch calibration is sparse, so the commitment is that the earning loop exists and is live (the adjudication-to-atom evidence ledger is merged), with confidence falling back to an asserted baseline carrying provenance and verification, never a bare or unearned number presented as earned.

The two roots in invariant **I1** (calibration and sovereignty) are unchanged. Sovereignty is a root, not the partnership commitment; this amendment retires one *sourcing expression* of the sovereignty root and re-expresses it as tenant data sovereignty. Invariant **I9** (displacement, not acquisition, against the extractive incumbent) stands on its own and is kept, with its textual dependency on "per partnership-first sourcing" removed.

The four structural commitments become: (1) sell reasoning not data, (2) confidence is earned not asserted, (3) cost per jurisdiction onboarded, (4) dual interface. Load-bearing set: 1, 2, 3.

## Context

Run through premortem-check 2026-06-09: green, conditional on the tenant-isolation re-founding landing in the same amendment (so no window exists where held city operational data sits unprotected between the old guardrail being removed and the new one taking effect). The condition is met by move 2 above. The root cause of the commitment "always surfacing" was identified as the premortem-check skill itself hard-coding partnership-first as load-bearing commitment #2; the skill is updated in this amendment, without which the deletion would be cosmetic.

## Reasoning

The 2026-05-23 scoping decision already narrowed partnership-first to city operational data + substrate ingest and carved out all public-records and federal sourcing for Cortex. The web-first reasoning pivot shrank the remaining scope to near zero, because the warmed corpus is public model code, not operational city data. The one genuinely protective function inside the commitment, do not pool a tenant's private operational data into a shared or public asset, is preserved intact by the re-founded tenant-sovereignty commitment. What is retired is the cities-as-licensors revenue-share sourcing ethic, which was aspirational (no signed revenue-share agreement exists) and unexercised. Retiring it is honesty-positive and dissolves the hardest part of the calibration design (public-code calibration may pool freely once there is no partner judgment to protect; only tenant-private data stays isolated).

## Reversal criteria

Re-instate partnership-first sourcing (and I8) if a city operational-data licensing line with substrate-enforced revenue share becomes a live commercial motion, for instance if a city signs a revenue-share agreement for its permit/plan-review operational data, or if the Hauska SDK revenue-routing implementation lands in a form that makes substrate-enforced revenue share to source counterparties practical and a partner city contracts on it. Reverse the tenant-sovereignty re-founding never while any enterprise tenant (Mox, SmartCity tenants) is on the platform; it is a customer-trust floor. Reverse the calibration promotion never; it is the core trust claim (I3, change condition none).

## Dependencies

This amendment edits: `CLAUDE.md` (four commitments + the partnership-preferred decision rule), `03_structural_constitution_and_drift_guard.md` (retire I8, re-ground I5, keep/clean I9, I1 note), `.claude/skills/premortem-check/SKILL.md` (commitment #2 + load-bearing list + example), and status-flips `_decisions/2026-05-23_partnership_first_scoping.md` to superseded. Propagation to canonical docs that express the retired commitment follows as a tracked sweep: `09_post_saas_substrate_thesis`, `73_partnerships`, `72a_capital_raise_positioning`, `HAUSKA_INVESTOR_BRIEF`, `04_roadmap_alignment_audit`, `00d_portfolio_roadmap_reference`, `14_pricing_framework`, `08_tiered_access_model`, `18_stakeholder_graph`, `HAUSKA_COMMERCIALIZATION_VISION`, `52`/`76d`/`16` GTM. The sovereignty-split language in `57_national_code_warming_sprint`, `04a_arrow_two_calibration_capture`, and `_decisions/2026-06-09_codewarm_arrow_two_combined` simplifies from "no partner-judgment pooling" to "tenant-private isolation"; that edit is handed to the session that owns those in-flight docs.

## Counterparties

Internal. No external counterparty notification required. Bastrop is unaffected operationally (it remains a SmartCity OS customer and design partner). No partner city was ever on a signed revenue-share sourcing agreement, so no commitment to a counterparty is broken.
