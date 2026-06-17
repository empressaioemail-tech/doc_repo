---
id: 2026-06-17_cc-agent-C_central_tx_coverage_warm_and_onboard
title: cc-agent-C — Central TX coverage: warm (Class A) + onboard (Class B) + coverage-metadata cleanup
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [61a_central_tx_coverage_program, 75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint]
supersedes: the 2026-06-17 chat warming prompt; the re-routed 2026-06-17_cc-agent-E_coverage_driver_quality_and_warm
---

# cc-agent-C — Central TX coverage: warm + onboard

Single owner of `legacy-design-tools` (the `lib/codewarm` cold-warm harness + the deployment Neon). Governing program: [`61a`](../61a_central_tx_coverage_program.md). Cost rule: each jurisdiction under $200 compute + 1 hr review (commitment #3). No hand-deploy; land via PR / the warm pipeline.

Model (HR-12): Grok Build 0.1 default.

**Framing (do not regress this):** the national-layer baseline (FEMA flood/floodway, USGS soils/geology/karst, topography, EPA, the Cotality stack, OZ, MUD/PID) already fires on every parcel, warmed or not. This dispatch adds the **incremental local-code/zoning layer**; it does not gate whether the radar is useful anywhere. Do not pre-onboard the sub-2k no-zoning tail.

## Class A — flip `engine_only` -> `neon` (cheap, no re-fetch), wedge-first

Load atoms we already hold into the deployment Neon so `/brief` retrieves local code. Order:
1. **Austin** — also re-warm to the in-force **2024** edition (it's on 2021).
2. **San Antonio**.
3. **Williamson corridor** — Round Rock, Georgetown, Hutto, Leander.
4. New Braunfels, Schertz, Dripping Springs, Killeen, Boerne, Lockhart, Manor, Lago Vista, Wimberley, Elgin, Taylor, Converse, Live Oak, Copperas Cove.

Verify each flips to `neon` on `/api/brokerage/v1/coverage` and a brief returns local code.

## Class B — onboard net-new Municode cities (full ingest + eval)

Not in the corpus today; Municode-hosted, no partnership needed:
**Waco, Temple, San Marcos** (config-ready, live customer — prioritize), **Seguin, Cibolo, Belton, Universal City**.
Each: ingest -> eval -> load to Neon -> verify `neon` on coverage. Cost-gated per jurisdiction.

## Coverage-endpoint metadata cleanup

The `/coverage` response still advertises `"regrid":"premium"` (Regrid is purged) and `"icc":"pending_credentials"` (the ICC contract landed). Drop the regrid layer reference; flip `icc`.

## NOT in scope (route elsewhere)

- **eCode360 / General Code cities** (Kyle, Buda, Pflugerville, Cedar Park + 9): blocked on the **General Code partnership** (operator/bizops, [`73`](../73_partnerships.md)), not engineering.
- **American Legal:** Harker Heights (partnership track).
- **Sub-2k / no-zoning tail:** Tier-B demand-driven; do not pre-onboard.
- **Permit/AHJ + HOA:** the separate horizontals per [`61a`](../61a_central_tx_coverage_program.md).

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_central_tx_coverage_close.md` — which jurisdictions flipped (Class A) and onboarded (Class B), per-jurisdiction cost, the coverage-endpoint before/after, the regrid/icc metadata change, verbatim command output.
