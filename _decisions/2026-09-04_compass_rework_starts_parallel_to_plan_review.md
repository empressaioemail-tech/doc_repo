---
decision_id: 2026-09-04_compass_rework_starts_parallel_to_plan_review
date: 2026-09-04
owner: nick
status: active
related_canonical: [_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding, _decisions/2026-09-02_plan_review_leads_the_bastrop_push, 30c_smartcity_platform_ia, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

The 2026-09-02 ruling that Plan Review leads the Bastrop push, with Compass's rework not yet started, is **relaxed for right now**. Compass's next-generation build (the atom-backed sidebar rework already specified in `30c_smartcity_platform_ia.md` §6 — not a port of `smartcity-os`'s existing chat-panel Compass) starts now, running as a parallel lane alongside Plan Review and the rest of the Bastrop cutover work, not queued behind it.

## Context

`_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md` scoped Compass's rework as a structural rework (chat panel → atom-backed sidebar over readable records), explicitly deferred, with the old `smartcity-os` chatbot kept alive in the meantime — "do not claim the sidebar shipped." `_decisions/2026-09-02_plan_review_leads_the_bastrop_push.md` then set Plan Review as the lead priority, with Compass named as work that "hasn't started" and dies "when the sidebar exists" — not yet.

Operator's own words today: "this new compass is just that, the next generation of compass. we are going to work on multiple lanes simultaneously as this is just as much a creative process as an engineering one so we will relax the plan review ruling for right this second because it has to jive with the overall framework of the platform."

## Reasoning

Two things changed since the 2026-09-02 ruling: (1) the Bastrop data cutover (G-116) is now substantially complete — 10 real domains live, real auth live, a field-enrichment pass against production done — so the original reason to keep everything funneled through one lead lane is weaker than it was; (2) the operator is explicit that Compass's design has platform-wide implications ("has to jibe with the overall framework of the platform") that benefit from starting now rather than waiting, and that the work is as much a creative/design process as an engineering one, which argues for giving it real, current attention rather than treating it as a strictly sequential follow-on.

## Scope for the Compass rework, as given today

Operator's explicit priority, in order:
1. **Smart Files context-awareness first, and done well.** The stated sales anchor is: a city buys in by moving its existing documents into Smart Files, and Compass's value is that the AI then has complete context over them. This is the first real capability to nail, not a later add-on.
2. **Then keep building outward** to awareness of every other facet of the platform's data (the real domains G-116 already wired up: permits, work orders, inspections, fleet, patrol, etc.) — explicitly sequenced after Smart Files, not simultaneous with it on day one.

This is a scope/sequencing instruction, not yet a technical design — the atom-backed sidebar architecture from `30c_smartcity_platform_ia.md` still governs the UI/chrome shape; this decision only changes when the work starts and what gets built first once it does.

## Structural commitment check

- Sell reasoning, not data: the entire premise (get your files into Smart Files, then the AI has context) sells the value of the underlying record, matching this program's own repeated stance elsewhere.
- Confidence earned, not asserted: the atom-language honesty rules from `30c_smartcity_platform_ia.md` (citation chips, never bare confidence) carry forward unchanged into this build; this decision does not relax them.
- Cost per jurisdiction onboarded: unaffected directly, though a real Smart-Files-aware Compass strengthens the "move your files here" pitch this decision itself names.
- Dual interface: unaffected.

## Reversal criteria

Revert to strict Plan-Review-first sequencing if parallel lanes prove to fragment attention rather than compound it (measured, not assumed) — the operator's own words frame this as a "right now" relaxation, not a permanent reordering.

## Dependencies

Depends on: G-116's substantial completion (real data + real auth), which is why "everything funnels through Plan Review" no longer holds as tightly as it did on 2026-09-02.
Feeds: the first real Compass build increment (Smart Files context-awareness), not yet started as of this decision.
Does not reopen: the atom-backed-sidebar architectural direction itself (unchanged), or the instruction not to claim the rework shipped before it's real.
