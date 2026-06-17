---
id: 2026-06-16_cc-agent-C_investor_deal_radar_backend
title: cc-agent-C — Investor Deal Radar backend (data wiring + investor verdicts + profile + lead engine)
date: 2026-06-16
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75g_investor_deal_radar, 61_property_intelligence_master_plan, 08_tiered_access_model, _research/2026-06-06_cotality_api_surface_catalog]
blocked_on: none for build (Wave 1+ run on local/CI). G1 prod-key durable fix is task 1 here, merged via PR; do NOT hand-deploy mid-sequence.
---

# cc-agent-C — Investor Deal Radar backend

> **SUPERSEDED 2026-06-17** by [`2026-06-17_cc-agent-C_investor_radar_cotality_depth.md`](2026-06-17_cc-agent-C_investor_radar_cotality_depth.md). The lead engine (Wave 4 below) is CUT; Cotality permits/propensity/owner-occupancy now wire as underwriting depth, not a feed. Execute the 2026-06-17 dispatch.

You are **cc-agent-C**, single owner of `legacy-design-tools` for this run. Product context: [`75g_investor_deal_radar.md`](../75g_investor_deal_radar.md). We are refocusing the Property Brief backend toward the real estate investor: an instant cited deal verdict, a per-user behavioral profile, and a lead engine.

## Model (HR-12)

Default **Grok Build 0.1**. Escalate to Claude only on a genuinely stuck integration seam.

## First, before writing code

Enumerate the full dependency set against live source. Do not trust this dispatch's line references; confirm each seam in the current `main` and your own CI. Run the existing brokerage + adapter tests green before you start, and after each task.

**Coordination warning.** cortex-api is being actively deployed today (four revisions cut within ~40 minutes, serving `cortex-api-00180-row` at time of writing). Do NOT hand-deploy or run ad-hoc `gcloud` against cortex-api mid-sequence. Land everything via PR; deploys go through the canary workflow on the operator's coordination.

## Task 1 (G1) — durable prod brokerage-key fix

`/api/brokerage/v1/brief` returns 503 `property_brief_api_unconfigured` in prod because the brokerage key env is absent on the live revision. Root cause: `.github/workflows/cloud-run-deploy.yml` sets secrets with `--set-secrets` (replace-all) and omits the brokerage key, so every deploy drops it.

- Add `BROKERAGE_EXTENSION_PUBLIC_KEY=BROKERAGE_EXTENSION_PUBLIC_KEY:latest` to the `--set-secrets` list (the secret already exists in Secret Manager). `loadBrokerageApiKeys()` (`artifacts/api-server/src/middlewares/brokerageAuth.ts`) unions it, which clears the 503.
- In the same `--set-env-vars` block, move `BRIEFING_LLM_MODE` off `mock` to its intended prod value (the live revision currently carries `anthropic`, hand-patched; bake it so deploys stop reverting to mock).
- Add the wallet defaults (`BROKERAGE_WALLET_START_BALANCE_CENTS` etc. per the deploy runbook) so a keyed call does not instant-402.
- Acceptance: a keyed `POST /api/brokerage/v1/brief` on the next canary returns 200 + `runId` + `laySummary.verdicts`, not 503.

## Task 2 (Wave 1) — wire the investor data layers

Extend the adapter set surfaced into the brief at `artifacts/api-server/src/lib/brokerageSiteContext.ts` (`brokerageSiteContextAdapters()`, today FEMA/USGS/EPA/Regrid only) to include the Cotality extended layers and the unwired endpoints. New adapters auto-surface in the brief `siteContext.layers`.

Wire, in priority order (catalog: [`_research/2026-06-06_cotality_api_surface_catalog.md`](../_research/2026-06-06_cotality_api_surface_catalog.md)):
1. Rent: `/avms/ram` (rent AVM) + `rental_trends` + rent propensity.
2. Lead-engine signals: `/building-permits`, propensity-to-sell / refinance scores, owner-occupancy (FraudPrequal).
3. Distress / pricing: `/liens`, `/mortgage`, `/tax-assessments`, `/comparables`.
4. Cost: HOA (`/home-owners-association`), roof condition + weather verification (Underwriting Center / WVS), the already-wired hazards + replacement cost.

Reuse the existing `cotalityClient` CLIP-join + `cotalityGetWithApp` plumbing in `lib/adapters/src/national/`. Honor the per-product host and Basic-auth shape already solved (memory: Property on `api1`, RiskMeter/SpatialTile on `api`).

## Task 3 (Wave 1) — reframe the verdict builder to the investor set

`artifacts/api-server/src/lib/propertyBriefLaySummary.ts::generateLaySummary()` today emits the consumer set (ADU, flood, soils, wetlands, major_restrictions, corpus_coverage). Reframe to the **investor verdict set**, each a derived, cited, confidence-scored, disclaimered verdict:

- add-a-unit / ADU, subdivide (zoning + lot)
- priced-right (AVM spread vs ask), cash-flow (rent vs the user's cap-rate floor)
- deal-killers (flood depth at return period / floodway / liens / HOA / easement)
- insurance cost (peril scores + first-floor-height + replacement cost)
- rehab code reality

Add a **headline deal verdict synthesizer**: deal / conditions / dead over the dimension verdicts, weighted by the user profile (Task 4). Keep `buildRulesLaySummary` as the deterministic fallback.

**Hard constraint (G2/G3).** Emit derived reasoning, never raw Cotality field passthrough. Phrase valuation as "estimated sale price / rent / worth," never "value." Carry the not-an-appraisal disclaimer. This is both the constitutional "sell reasoning not data" and the Texas legal-safe posture; the raw Cotality numbers stay server-side until the consumer-display license clears (G2).

## Task 4 (Wave 2) — per-user behavioral profile

No per-user profile table exists today (workspaces/brief-runs/wallets do). Create migration + table `brokerage_user_profiles` keyed by `ownerUserId` (the per-user session is reachable on `/brief` via `req.session.requestor.id`; see `artifacts/api-server/src/middlewares/brokerageAuth.ts` + the task #29 auth). Tenant-private, never pooled.

Columns: buy-box (geo, type, price), **strategy** (flip/hold/develop/wholesale), underwriting posture (spread tolerance, cap-rate floor, rehab budget, insurance ceiling), inferred thesis, blind spots, feed state, timestamps.

- Capture keep/reject and the dialogue into the profile + an arrow-two calibration deposit. Reuse `recordGtmEvent()` (`artifacts/api-server/src/lib/recordGtmEvent.ts`) and the calibration overlay.
- "Who you are" synthesis: generate the living thesis / buy-box / blind-spots from the running dialogue via the existing briefing LLM seam (`artifacts/api-server/src/lib/brokerageBriefLlm.ts`).
- Prove cross-user isolation in a test (tenant-A profile never returned to tenant-B).

## Task 5 (Wave 4) — lead engine

Territory + buy-box to candidate feed, ranked by propensity-to-sell + building-permits + owner-occupancy (wired in Task 2). New backend query + a feed endpoint under the brokerage path. This is the "new in your box" surface the extension consumes. Gated for public display on G2.

## Do NOT

- Pass raw Cotality fields to the client, or use the word "value" in any consumer-facing verdict.
- Pool any per-user profile signal into a shared or public number.
- Hand-deploy cortex-api mid-sequence.

## Report back

`P:/doc_repo/_inbox/2026-06-16_legacy-design-tools_cc-agent-C_investor_deal_radar_backend_close.md`. Include the migration number, the new adapter keys, verbatim test output, and any endpoint that returned no data on a real East Austin parcel.
