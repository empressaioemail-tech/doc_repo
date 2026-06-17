---
id: 2026-06-17_cc-agent-E_coverage_driver_quality_and_warm
title: cc-agent-E — building-code driver-quality fix, batched verification, proof-wave warm (hauska-engine)
date: 2026-06-17
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [61a_central_tx_coverage_program, 61_property_intelligence_master_plan, 75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint]
blocked_on: none. Seam seal is DONE (#72/#183 live). This is now cc-agent-E's FIRST task; E order is this (driver-quality + warm) -> map-capability extraction.
---

# cc-agent-E — coverage: driver-quality fix + batched verification + proof wave

> **RE-ROUTED 2026-06-17.** Step-0 recon (close: `_inbox/2026-06-17_hauska-engine_cc-agent-E_coverage_driver_quality_close.md`) found the cold-warm harness lives in **legacy-design-tools** (`lib/codewarm`, `lib/codes/src/webCodeFetch`), NOT hauska-engine, and the keystone was already shipped by cc-agent-C on 2026-06-10 (#163 section-HTML extraction, #164 Austin 2024 uplift; Austin 0% -> ~35% web-verified, ~$2.55). **All coverage warm work moves to cc-agent-C / legacy-design-tools** (deepeners via the existing `2026-06-10_cc-agent-C_austin_verified_rate_deepeners` dispatch, plus the new batched edition-verification workflow and the proof wave). cc-agent-E does NOT execute this; E proceeds to the map layer-capability extraction. Kept for the record.

Governing program: [`61a`](../61a_central_tx_coverage_program.md). This is the coverage half of the engine's Wave 3, pulled into a named program because the investor radar's cited code reasoning (75i task 4) depends on it. **First confirm the cold-warm harness lives in hauska-engine** (the prior coverage recons came from cc-agent-C/legacy-design-tools); if it lives in legacy-design-tools, flag it back to the planner before proceeding so routing is corrected.

Model (HR-12): Grok Build 0.1 default.

## The work

1. **Driver-quality fix (keystone).** Fix the UpCodes section-HTML extraction so warmed building-code (Layer 1/2) atoms verify against real section bodies. Acceptance: Austin's ~552 unverified reasoning atoms flip to verified; log the re-warm cost (should be ~$1-2). This is launch-gating for Austin and the prerequisite for every other warm.
2. **Austin 2024 edition uplift.** Re-warm Austin onto the in-force 2024 I-Codes (currently warmed on 2021). Correct the flagship edition drift.
3. **Batched edition-verification workflow.** Build the pass that checks adopted I-Code edition + local amendments systematically against ICC (creds landing ~this week) and the SECO statewide floors (residential 2015 IRC Ch.11, commercial 2015 IECC, accessibility 2012 TAS), so per-jurisdiction human review is batchable, not 40 deep reviews. This is what keeps the wide warm inside the cost commitment (#3).
4. **Proof wave** (validates the workflow on what we already hold / have config-ready): San Marcos (config-ready, live customer), San Antonio (engine L3, adoption verified), Williamson corridor (Round Rock / Georgetown / Hutto / Leander, on Neon). Each stays under $200 + 1hr.

Tier A county fan-out follows the proof wave and is a separate dispatch off [`61a`](../61a_central_tx_coverage_program.md), gated on the platform-recon result (planner-run) that resolves Municode-warmable vs partnership-gated cities.

## Constraints

Each jurisdiction under $200 compute + 1 hour review (commitment #3). Verbatim command output in the report. Warmed atoms carry source + confidence + vintage (the sealed envelope).

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-engine_cc-agent-E_coverage_driver_quality_close.md` — the driver-quality fix, Austin verified-atom count before/after, the batched-verification workflow, the proof-wave warm results with per-jurisdiction cost, verbatim test output.
