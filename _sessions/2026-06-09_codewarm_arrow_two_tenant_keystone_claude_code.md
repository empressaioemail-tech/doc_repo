---
id: 2026-06-09_codewarm_arrow_two_tenant_keystone_claude_code
title: Session — national code-warming + arrow-two closed end-to-end + tenant keystone
date: 2026-06-09
kind: session
applies_to: portfolio
related: [57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, 54_tenant_leg_sprint, 56_engine_extraction_sprint, 80_adrs/adr_005_multitenancy, 58_gtm_readiness_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _decisions/2026-06-09_retire_partnership_first_amend_constitution, _decisions/2026-06-09_briefing_source_non_deposit]
---

# Session summary

## Arc

Began from "we decided web-first code search, building atoms then enhancing with ICC — find it." That surfaced the 2026-06-08 web-first reasoning-atom decisions (already shipped to prod). The operator then asked to fan out agents to warm all building codes. That became the national code-warming sprint, which was folded together with arrow-two calibration into one clean-base build, course-corrected twice on placement, and then driven all the way to arrow-two closed end-to-end plus the tenant keystone.

## What shipped (all merged 2026-06-09/10)

- **National code-warming sprint** ([`57`](../57_national_code_warming_sprint.md)) + combined decision ([`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](../_decisions/2026-06-09_codewarm_arrow_two_combined.md)). Six curated reference manifests (~640 sections) in [`_catalog/codes/`](../_catalog/codes/). Placement settled: the reasoning corpus + ledger + calibration overlay are spine substrate (engine-core cargo), not a Cortex feature.
- **Partnership-first RETIRED** (amendment `b046f48`, other session); structural commitment #2 is now confidence-is-earned (calibration); the sovereignty root survives as tenant data sovereignty.
- **Cold-warm harness #157** (migration `0036`, `asserted_confidence`/`calibrated_confidence` split + `source_set_version`/`calibration_stale` + calibration-preserving UPSERT).
- **P0b canonical atom-id key #158** (`lib/codes` `canonicalOverlayAtomKey`; the overlay no longer silently misses).
- **Lineage audit** found the gate was arrow-one-only for the Codex finding path → the four-part closure (P0b/P0a/P2/briefing-decision).
- **P0a+P2 gate-citation-lineage #30 (gate) + #159 (cortex companion)**: arrow-two deposits through the gate (`overrideCount:1`), tenant-scoped + rail-quiet + key-space consistent.
- **Tenant leg step 1 #29**: the gate enforces tenant isolation (`jurisdiction_tenant` on AuthContext, five-value accessPolicy post-fetch, isolation test passes, ~11 ns/check). **ADR-005 ratified (accepted).**
- **Gate-front seam + arrow-2 Phase 2 #160**: the seam carries tenant to the engine entry points; `finding.outcome.recorded` outcome capture.
- **legacy-client tenant headers #31**: gate→engine cross-tenant enforcement live end-to-end.
- **Arrow-two Phase 3 (`a431e8e`)**: migration `0037` `atom_calibration_overlay` over both stores; new `lib/engine-core/` package; tenant-sovereignty partitions (public/tenant-private/tenant-shared, no-pool fixtures pass); cold-start fallback; source-set-drift invalidation; attribution coverage; rail-quiet. **I3 closed — confidence is earned.**
- **briefing-emit provenance fix #28**; briefing-source decided non-deposit for launch ([`_decisions/2026-06-09_briefing_source_non_deposit.md`](../_decisions/2026-06-09_briefing_source_non_deposit.md)).

## Course-corrections worth remembering

- Caught an over-claim of mine ("calibration lives in Cortex") that conflated placement with exposure; corrected to spine-substrate-served-through-the-gate. Memory: [[check-substrate-placement-against-decoupling]].
- Walked back an atom-contract over-correction on P0b: `lib/codes` is the right home; the gate reads canonical stored citations, it does not import the key function.
- The decoupling-bite analysis: the first P0a+P0b suggestion was necessary-but-insufficient; the full deposit-loop closure is P0b+P0a+P2+briefing-decision, sequenced ahead of 56 step 5.

## State at close

Arrow-two CLOSED end-to-end (Phase 1 ledger, Phase 2 outcomes, Phase 3 calibration, P0a/P2 gate-deposit, P0b key — all merged). Tenant isolation live end-to-end (#29 + #160 + #31). Deploy done, gate wired, harness merged. The cold-warm RUNS over the manifests are still to fire (national first pass). The engine lift (56 steps 3-6) is now genuinely unblocked (deploy done, gate wired, cortex-api static after Phase 3).

## Next — the GTM-readiness sprint (next planning session, with the operator)

Scaffolded at [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md). Two coupled efforts:
1. **Engine extraction / lift** (56 steps 3-6), done app-by-app as the QA vehicle (Cortex → extension → SmartCity/Bastrop), so each app is QA'd in its final topology. Plus the per-user-auth lane (Cortex self-serve, task #29 auth) and product polish.
2. **Code-library maximization** for the FB-group launch: fire the cold-warm runs (first pass), a coverage gap analysis (have vs need), and a background enhancement loop (multi-link accretion + arrow-two calibration accrual + gap-fill) so launch-day lookups hit a deep, calibrated library.

Deploy reminders: hauska-mcp-server migration `004` (tenant resolution) on next deploy; key rotations (`BROKERAGE_DEV_API_KEY` + others) parked.
