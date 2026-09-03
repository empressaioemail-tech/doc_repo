---
decision_id: 2026-09-02_plan_review_leads_the_bastrop_push
date: 2026-09-02
owner: nick
status: active
related_canonical: [90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding, _decisions/2026-08-17_dashboards_ui_then_one_feed, _decisions/2026-08-17_g65_permitflow_kill, _decisions/2026-08-16_plan_review_is_smart_files_first_consumer, _inbox/2026-08-25_govtech_wave1_WDLL]
---

# Decision

Plan Review leads the next push (Bastrop cutover prep + Phase 1 polish), ahead of Dashboards and ICC-demo hardening.

## Context

Wave 1 (OPS-17 G-105 through G-110/G-113/G-114) closed today — Smart Files, Plan Review, and the ICC ledger mechanics are live on `template-city`. OPS-17's own lane table has never ranked Plan Review first: Lane A (Smart Files) is marked first, Lane C (Plan Review) and Lane D (ICC) run parallel to it, Lane B (SmartCity/Bastrop) is explicitly last. No existing doc rules Plan Review ahead of the other lanes for the next push — this decision is that ruling, made fresh, not a citation of prior canon.

A real, sourced doc survey found no prior "Plan Review first" ordering decision. The nearest match, `_decisions/2026-08-16_plan_review_is_smart_files_first_consumer.md` (OPS-17 A-027), rules Plan Review is Smart Files' first *consumer* — a build-sequencing fact between two lanes, not a priority ranking across all four surfaces. That is likely the source of the recollection this decision is replacing with an explicit ruling.

## Reasoning

Bastrop's own live, real pain point is specifically a Plan Review gap, not a Dashboards or Asset Management one. G-52 (Lane B's actual consumer-pass row — SmartCity initiating an engagement from a MyGov permit record) is blocked on G-51 (Plan Review's own standalone gate). PermitFlow, Bastrop's current in-app AI plan review, is the one legacy island explicitly ruled to die only "when plan-review-app is the reviewer they use" (`_decisions/2026-08-17_g65_permitflow_kill.md`) — distinct from Leaflet (dies when SmartSite is the staff map) and Compass (dies when the sidebar exists). Plan Review is the surface Bastrop staff actually touch today; it is the natural lead.

This decision also folds in a concrete scope addition ruled the same session: **getting the ICC-demo path (`https://icc-demo.vercel.app`) actually functioning belongs inside the Plan Review lane's scope for this push**, not a separate later card. See the OPS-17 A-105 correction filed alongside this decision — real, licensed ICC section content already exists (4,825 IBC 2018 atoms, live-retrievable via MCP, fetched 2026-07-06) but Plan Review's own code-lookup path never queries it. Wiring that path is real, scoped engineering work, not a data-acquisition blocker.

## Structural commitment check

- Sell reasoning, not data: unaffected — this is a sequencing call, not a product-shape change.
- Confidence earned, not asserted: the ICC content gap this decision folds in is exactly a case where the system was asserting absence it hadn't actually earned the right to assert (the real content existed and was never queried) — closing it directly serves this commitment.
- Cost per jurisdiction onboarded: unaffected.
- Dual interface: unaffected.

## Reversal criteria

Reverse if Bastrop's actual go-live blocker turns out to be Dashboards' consumer-pass wiring (G-52/G-13) rather than Plan Review's standalone completeness, once both are scoped in the same WDLL and compared directly.

## Dependencies

Depends on: Wave 1 close (OPS-17 A-104, today).
Feeds: the Bastrop-cutover-and-Phase-1-polish WDLL to be drafted next.
Does not reopen: OPS-17's Lane A/C/D parallel ordering for Wave 1, which is already closed and not being relitigated.
