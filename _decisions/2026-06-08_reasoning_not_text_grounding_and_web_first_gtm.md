---
decision_id: 2026-06-08_reasoning_not_text_grounding_and_web_first_gtm
date: 2026-06-08
owner: Nick
status: active
refines: [2026-06-08_websearch_code_grounding_supersedes_interim_atoms, 2026-06-08_buy_not_build_cortex_cockpit]
related_canonical: [03a_positioning_framework, 09_post_saas_substrate_thesis, 04a_arrow_two_calibration_capture, 40i_cortex_dallas_e2e_grok_plan_review_sprint, 08_tiered_access_model, 00_current_state]
related_adr: [80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence]
related_dispatch: [_dispatches/2026-06-08_cc-agent-C_cortex_v2_reasoning_atom_grounding]
---

## Decision

Hauska stores reasoning, not code text. The Cortex code-grounding catalog is reasoning/citation/structure atoms, each carrying multiple source deeplinks per code reference plus edition, confidence, verification state, and (over time) arrow-two calibration. Verbatim code text is never hoarded as our catalog: it is displayed via license (ICC Code Connect, NFPA) or by deeplink at read-time, served from the authoritative source. Build this as Cortex v2 and launch web-first.

Operating model:

1. **Web-search-first, lazy-cached reasoning atoms.** Round 1 web-searches a code reference, reasons, and stores a reasoning atom (reference, edition, our finding/citation, confidence, verification state, and one or more source deeplinks) - not the full section text. Round 2 and after retrieve local atoms first and web-fill only the gaps. The corpus accretes from real usage, demand-driven, not pre-ingestion.

2. **Atoms get smarter with use.** A reasoning atom for a given code reference accumulates multiple source links (e.g. Municode, the ICC public viewer, UpCodes for the same FBC section) and accumulates arrow-two calibration from review outcomes. Redundant links harden retrieval and citation; calibration sharpens confidence. The asset compounds; the text never gets hoarded.

3. **The storage boundary is code-enforced.** Store reasoning plus, at most, the short snippet a finding actually quoted, plus the deeplinks. Never store full verbatim section text as a queryable catalog. Snippet length is capped and a test asserts no full-section persistence. This is the line that keeps us consistent with what the operator has told ICC and Cotality: we do not want mass files of their codes.

4. **Read-inline UX without hoarding.** The architect still reads the cited code in-app. The text is served by deeplink where we have no license, and by licensed display (ICC Code Connect / NFPA) where we do. This is experience-1's convenience with experience-2's data posture (see Context).

5. **GTM: web-first, partnerships follow.** Any architect anywhere uses Cortex day one - no jurisdiction onboarding required - which opens the launch to the operator's ~7k-architect community nationwide without ingesting the country first. Partnerships then follow for (a) licensed verbatim-text display and (b) proprietary city operational data (permit history, plan-review precedent, local interpretation) that no web search can source. Partnering is still preferred; it is just for display rights and proprietary data, not bulk code text.

## Position (capture)

The code-reasoning surface's value proposition compresses to one line, captured in [`03a_positioning_framework.md`](03a_positioning_framework.md): **the code tells you the rule; Hauska tells you what it means for your building, reconciled with every other code that applies.** The code text is commodity and authoritative-elsewhere. The reasoning - what the rule means in context, harmonized across every applicable code (the precedence/reconciliation engine, ADR-021), calibrated by outcome (arrow-two) - is the product and the moat. "Aligned with all the other applicable codes" is not a slogan; it is the most-stringent-governs / federal-preempts / local-overlay resolution the precedence engine already performs.

## Context

Two UI experiences exposed the fork. Cortex ingests full code text (click an atom, read the code) - convenient UX but the wrong data posture: it hoards mass verbatim model-code (commodity, ICC/NFPA-copyrighted, and off-message to the licensors the operator has told we do not want their files). The browser extension deeplinks to the code - the right data posture (sell reasoning, point at the source) with thinner UX. The resolution is neither pure form: the extension's data posture (link/license, do not hoard) with Cortex's read-inline UX, and our reasoning atoms layered on top and cached for retrieval.

The conflation this corrects: "the corpus is the moat" muddled two corpora. The code-text corpus is commodity, copyrighted, and a liability dressed as an asset. The reasoning corpus - findings, citations, precedence resolutions, outcomes, calibration - is ours, copyright-clean, and compounds with use via arrow-two. The thesis (09, sell reasoning not data) and the positioning roots (03a: calibration + sovereignty) are served by storing the second and never hoarding the first.

## Structural commitment check

Pre-mortem run 2026-06-08 via the premortem-check skill. All seven green. Sell-reasoning (1, load-bearing): green+, the purest expression - store reasoning, deeplink/license the text, instantiating the calibration root. Partnership-first (2, load-bearing): green, web-search of public/model code is product-baseline outside the refusal scope, partnerships preferred for proprietary data + licensed display, no city locked out, and the 7k-architect surface is the wide calibration/demand engine of 03a's participation model. Cost-per-jurisdiction (3, load-bearing): green++, national reach at near-zero per-jurisdiction onboarding is the commitment realized. Dual-interface (4): green. Spine rule (5): green, reasoning + calibration is the spine. Focus-queue (6): green, on the active Cortex anchor and it retires the pre-ingest-the-tail posture. Quality-gate (7): green, multi-source + edition + confidence + timestamp + verification state, with arrow-two calibration. One enforced condition (sell-reasoning-adjacent): the storage boundary is code-enforced - reasoning + short snippet + multi-deeplink, never full verbatim section text - or v2 drifts into the hoarding it exists to avoid.

## Reasoning

The reasoning is the only defensible, on-thesis, copyright-clean, compounding asset; the text is none of those. Web-first lazy-cache threads every needle at once: latency (round 2 is local retrieval), open-ended retrieval (reasoning atoms are searchable without storing full text), cost-per-jurisdiction (near zero for the tail), and moat (it is the reasoning, which is ours and sharpens with use). It also unlocks a launch the operator already has distribution for - 7k architects nationwide - which pre-ingestion structurally blocks. Building v2 is faster than the pending manual Cortex deploy, so it is not a detour from GTM; it is the GTM.

## Reversal criteria

Reverse the web-first default for a given jurisdiction only when a partnership makes deep curation worth it (the monetized core still gets curated structure - still metadata + reasoning, not hoarded text). Reverse the no-verbatim-storage boundary never; if full-text display is needed, that is licensed display (Code Connect/NFPA), not catalog storage. Reverse the GTM sequence only if web-grounding reliability on the live Miami proof proves too low to put in front of architects - in which case fix grounding before launch, do not fall back to pre-ingesting the country.

## Dependencies

Builds on the merged Miami chain (PR #150, `658dbe9`) and the v1 web-search fallback (PR #151, held - merge first). v2 = extend the v1 fallback to persist reasoning atoms (multi-deeplink, no verbatim text), retrieve-first on round 2, and surface read-inline text by deeplink/license. Arrow-two calibration (04a, Phase 2/3) is the layer that makes the atoms sharpen with use - sequenced but not blocking. The keystone validation remains the live whole-review on engagement 404 Remodel_B. Dispatch: [`_dispatches/2026-06-08_cc-agent-C_cortex_v2_reasoning_atom_grounding.md`](../_dispatches/2026-06-08_cc-agent-C_cortex_v2_reasoning_atom_grounding.md).

## Counterparties

Internal direction. Serves the Cortex product line and the planned 7k-architect community launch. ICC and NFPA are display-license counterparties (not bulk-data); cities are proprietary-operational-data and revenue-share counterparties. No counterparty commitment is made here beyond the posture the operator has already stated to ICC and Cotality.
