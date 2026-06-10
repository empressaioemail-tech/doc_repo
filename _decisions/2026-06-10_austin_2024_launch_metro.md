---
decision_id: 2026-06-10_austin_2024_launch_metro
date: 2026-06-10
owner: Nick
status: active
related_canonical: [58_gtm_readiness_sprint, 57_national_code_warming_sprint, 03a_positioning_framework, 80_adrs/adr_019_layered_code_substrate]
related_skill: [premortem-check, source-required]
related_inbox: [_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis]
---

## Decision

The Texas launch hero is **Austin at its in-force 2024 adopted code package.** After the driver section-extraction fix lands (the grounding mechanism), the first verified re-warm targets `austin_tx` at 2024 — IRC/IBC/IECC/IFC 2024 + **UMC/UPC 2024** (Austin uses the Uniform Mechanical/Plumbing codes, not the International IMC/IPC) + A117.1 + NEC 2023 (deeplink) + the statewide TAS 2012. Metro expansion (Houston, Dallas, San Antonio) follows Austin and is sequenced after the ICC cutover per the Texas-first plan.

Two coupled launch-gating builds fall out, both on the cc-agent-C lane, in order: (1) the **driver section-level HTML extraction fix** (flip `unverified-web-source → verified`; metro-agnostic; the grounding mechanism), then (2) the **Austin 2024 manifest uplift + verified re-warm** (the hero library).

## Context

B2 ([`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md)) established with live-store evidence: B1 persisted 725 atoms on `austin_tx` but 0 are verified-from-web (the driver fetched landing HTML, not section bodies); the Texas corpus is Layer-3 local ordinance only (no Layer-1 I-Code base — consistent with the web-first thesis, which places Layer 1 on the reasoning layer + deeplinks); and B1 used 2021 manifests while Austin is on 2024. Texas is not a single statewide edition (SECO 2015 energy floor; 2021 IECC not adopted statewide; TAS 2012 the state accessibility standard; IECC/A117.1 municipality-scoped). Adoption facts sourced per metro in B2 (Austin technical-codes page, SECO, TDLR).

## Reasoning

Austin is the Central-Texas anchor: the operator's base, the FB/architect community's likely center of gravity, and where the existing Layer-3 corpus concentrates (austin/hutto/georgetown/round_rock/bastrop/leander/new_braunfels are all Central TX). Launching the hero metro at the wrong edition (2021 when Austin enforces 2024) would violate the quality gate the moment an Austin architect ran a review — the wrong-edition refusal would fire and the coverage would read empty, or worse, mislead. Houston (the larger, 2021-aligned metro) was the faster path to verified-grounded, but it is not the launch community's home; Austin at the correct edition is the honest hero, and the extra work (2024 manifest authoring incl. the UMC/UPC wrinkle + TAS) is exactly the "make it right, no FB clock" posture. The driver fix is metro-agnostic and foundational, so it sequences first regardless.

## Reversal criteria

Switch the hero metro to Houston (or another 2021-aligned metro) if the launch community turns out to be centered outside Central Texas, or if the Austin-2024 manifest authoring proves materially harder than the driver fix + 2021 re-warm and a verified launch is time-sensitive. The driver-fix-first ordering does not reverse — it is the grounding mechanism for any metro/edition. The "Texas-first, geography expansion after ICC" frame is unchanged.

## Dependencies

Authors the driver section-extraction dispatch ([`_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md`](../_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md), FIRE-READY) and the Austin-2024 uplift+re-warm dispatch ([`_dispatches/2026-06-10_cc-agent-C_austin_2024_uplift_rewarm.md`](../_dispatches/2026-06-10_cc-agent-C_austin_2024_uplift_rewarm.md), QUEUED behind it). Updates [`58`](../58_gtm_readiness_sprint.md) (code-library lane: driver fix + Austin-2024 re-warm sequenced ahead of per-user auth + C1 on the cc-agent-C front). The Austin-2024 manifests land in `_catalog/codes/`.

## Counterparties

Internal. Adoption-fact sourcing per B2 (SECO/TDLR/city pages treated as authoritative; txenergycode.com flagged unreliable).
