---
id: 2026-06-17_cc-agent-C_investor_radar_cotality_depth
title: cc-agent-C — investor radar Cotality depth, pencils-at-$X, capture-key, tiers, signup (legacy-design-tools)
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75i_investor_radar_prelaunch_sprint, 61_property_intelligence_master_plan, 08_tiered_access_model, _research/2026-06-06_cotality_api_surface_catalog]
supersedes: 2026-06-16_cc-agent-C_investor_deal_radar_backend (lead engine cut; scope re-issued)
blocked_on: none. The sealed EngineEnvelope is DONE and live (#72/#183) — task 3+ pour onto it directly. Task 11 (map-data consume) waits on cc-agent-E's layer-capability extraction + cc-agent-M gate exposure.
---

# cc-agent-C — investor radar backend (re-issued per the 2026-06-17 handoff)

Single owner of `legacy-design-tools`. Full governing spec: [`75i`](../75i_investor_radar_prelaunch_sprint.md). Read [`61`](../61_property_intelligence_master_plan.md), [`75g`](../75g_investor_deal_radar.md), [`08`](../08_tiered_access_model.md), [`77b`] + the Cotality catalog before executing. **The lead engine / inverted feed is CUT** — Cotality permits/propensity/owner-occupancy wire as underwriting depth on the viewed property, not a feed.

Model (HR-12): Grok Build 0.1 default.

**Before code:** enumerate the dependency set against live `main`; run the brokerage + adapter tests green first and after each task. cortex-api is actively deployed — land via PR, do NOT hand-deploy (G1 hotfix is live on `cortex-api-00182-mer`; the durable `cloud-run-deploy.yml --set-secrets` brokerage-key fix is task 1 here).

## Your tasks (75i numbering)

1. **Purge Regrid** from `lib/adapters/src/registry.ts` (drop `regridParcelsAdapter`/`regridZoningAdapter`) and `artifacts/api-server/src/lib/brokerageSiteContext.ts` (`brokerageSiteContextAdapters()`), plus the deploy runbook `REGRID_API_KEY` step. Cotality is the sole parcel/property spine. Also land the durable G1 brokerage-key `--set-secrets` fix.
3. **Wire Cotality investor depth onto the `/brief` path** via `brokerageSiteContextAdapters()` on the sealed envelope: parcel polygon (point to polygon), Property V2 (owner/sale/tax/AVM/comparables/transaction), rent AVM + rental trends, liens/mortgage/tax (**verify TX MUD/PID special-district assessments; surface if present, do not assume**), permits + propensity + owner-occupancy as depth, RiskMeter (flood depth at return periods, floodway, perils, replacement cost, foundation type — FEMA stays free baseline, no flood double-bill), SSURGO soils (shrink-swell) + geology + karst/sinkhole. Reuse the `cotalityClient` host + Basic-auth plumbing.
4. **Foreground reasoning** in `propertyBriefLaySummary.ts` + `brokerageBriefLlm.ts`: rehab-reality + can-I-add-a-unit cited to the adopted code set; precedence where available — **flag if precedence is still a prod no-op** (61 audit).
5. **"Pencils at $X"**: run the user's buy-box math over cited AVM/rent/insurance/rehab to return their break-even basis. Their math on our cited inputs, never our opinion of value (TX non-disclosure / not-an-appraisal).
6. **Investor verdict reframe** (deal / worth a look / dead) + buy-box tuning + per-user profile (`brokerage_user_profiles` migration, keyed by `ownerUserId`, tenant-private) + the running dialogue, keyed to the canonical Cotality parcel id.
7. **Universal parcel-key capture (backend)**: address resolves to a canonical Cotality parcel id = the join key for verdict/dialogue/profile; support select-to-analyze, auto-detect, manual paste; adapters are optional enrichment. Build the capture-and-key primitive generically (Mox reuses it).
8. **Signup + sign-in** server side (today sign-in only; the hosted `/api/auth/extension-login` page is bare — add signup + styling + reset).
9. **Tier enforcement at the gate**: Free / Pro / Max as accessPolicy + package entitlement, with a **metered depth allowance to protect Cotality COGS**. **The Max tier now includes the site map (task 11).**
10. **Opportunity Zones**: ingest the QOZ designated-tract set (CDFI Fund / HUD GeoJSON; the parcel's census-tract FIPS likely comes free from Cotality Property V2 — verify, else point-in-polygon against the tract layer). Surface a Parcel-package line: L1 free flag (in/out, tract, round), L2 reasoning (hold + capital-gains implications, cited). **Version the tract list** so OZ 1.0 swaps to 2.0 (designations open Jul 2026); label the round on the verdict. National layer, no per-jurisdiction warm.
   - **MUD/PID horizontal**: beyond the task-3 per-parcel verification, build the **TX Comptroller special-district registry ingest** so MUD/PID assessment exposure resolves broadly (per [`61a`](../61a_central_tx_coverage_program.md)); feeds the "what kills it" set.
11. **Map-data consume (Max)**: consume the gate-fronted layer capability that cc-agent-E + cc-agent-M expose (do not re-implement layer assembly cortex-side). Provide the parcel-keyed layer request and the reasoning overlays (verdicts/findings pinned to locations). The render component is the extension's; your half is serving the layers + reasoning through the seam with vintage + confidence on each layer. Gate by Max entitlement + tenant/product scope.

## Constraints

Reasoning, not raw Cotality fields. Never "value." Tenant-private profile never pools. Verbatim command output in the report.

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_investor_radar_cotality_depth_close.md` — migration number, new adapter keys, the MUD/PID finding, precedence status, verbatim test output.
