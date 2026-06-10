---
decision_id: 2026-06-10_texas_coverage_demand_driven
date: 2026-06-10
owner: Nick
status: active
related_canonical: [57_national_code_warming_sprint, 58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 08_tiered_access_model, 14_pricing_framework, 80_adrs/adr_019_layered_code_substrate, _decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm]
related_skill: [premortem-check, catalog-thesis-check]
---

## Decision

Texas statewide coverage is made whole by the **demand-driven jurisdiction warm-up**, not a flat batch ingest. Concretely: (1) a prioritized **pre-warm** of a bounded Tier-1 set — the 7 major metros + the Central Texas cluster, with **San Marcos as priority #1** (live-customer jurisdiction, Central Texas, currently absent from every store); (2) the **user-warm coverage-escalation** ([`59`](../59_spine_moat_and_high_value_features.md) item 1) fills the long tail on first use — warm-what-we-can web-first, honest coverage report, team curation gates admission. We do **not** pre-ingest the ~1,500 Texas jurisdictions upfront. The enumeration + prioritization is a read-only recon ([`_dispatches/2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap.md`](../_dispatches/2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap.md)); the program is post-launch, with San Marcos and the recon pulled forward.

## Context

The operator asked to "get San Marcos (and all of Texas) ingested" and do a statewide gap analysis. B2 established the Texas corpus is Layer-3 local-ordinance only across 8 jurisdictions on the deployment Neon (34 engine keys total, 26 not on Neon), with only `austin_tx` warmed on the reasoning layer. San Marcos is absent from all stores, which surfaced on a live customer bid (146 S. Fredericksburg, a 3-story triplex — the Cortex chat correctly reported "San Marcos is not yet in the Cortex code corpus" and grounded it web-first on demand).

## Structural commitment check (pre-mortem 2026-06-10)

GREEN, conditional on the demand-driven framing. Sell-reasoning, confidence-earned, dual-interface, spine, and quality/sovereignty all green (web-first reasoning atoms, honest verification fallback, public code pools to public-tier, no user-supplied content into the shared corpus). **Cost per jurisdiction (load-bearing) is the hinge:** a flat batch of ~1,500 jurisdictions would be RED (≈$300k + ~1,500 review hours); the demand-driven model is GREEN because web-first warm compute is ~$1–2/jurisdiction (Austin warmed for $1.11) and the 1-hour human review is spent per-jurisdiction only when demand pulls it and it is curated for admission. Focus-queue yellow resolved by post-launch sequencing plus the two bounded pull-forwards (San Marcos, the recon).

## Reasoning

This is the literal payoff of the 2026-06-08 web-first / reasoning-not-text pivot: the whole point was to stop pre-ingesting the country and ground on demand, so "ingest all of Texas" as a batch would contradict the thesis we just committed to and blow the cost commitment. The jurisdiction warm-up the operator named IS the mechanism — the user-warm coverage-escalation (59 item 1) plus the per-jurisdiction cold-warm harness (the Austin-2024 pattern). San Marcos is pulled forward because it is a live-customer need and Central Texas (it should have been in the original pilot set), and it doubles as the first real proof of the on-demand jurisdiction warm. Note the live customer is NOT blocked on the pre-warm: the Cortex chat grounds San Marcos web-first on demand today; the pre-warm makes it instant and calibrated for the next San Marcos user.

## Reversal criteria

Revisit toward a bounded-batch posture only if a specific high-value motion needs a block of jurisdictions guaranteed-warm by a date (e.g. an enterprise tenant covering a region) — and even then, scope the batch to that region, never the state, and hold the cost envelope. Never revert to flat-batch-all-Texas; it breaks commitment 3. The demand-driven mechanism is the standing answer to "we can't pre-ingest everywhere."

## Dependencies

Authors the Texas statewide enumeration recon ([`_dispatches/2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap.md`](../_dispatches/2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap.md), FIRE-READY, parallel-safe). The pre-warm execution rides the cold-warm harness (the Austin-2024 dispatch pattern, per jurisdiction); the tail rides the user-warm coverage-escalation (59 item 1, the thin version queued in sprint 58). San Marcos warm is the priority-1 fill off the recon. Sequenced post-launch; San Marcos + recon pulled forward.

## Counterparties

Internal. Adoption-fact sourcing per the recon (SECO/TDLR/city pages authoritative).
