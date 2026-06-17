---
id: 2026-06-17_investor_radar_v1_coverage_and_deploys
title: Session — investor radar v1 lock, Central TX coverage program, deploys, consent fix, extension QA
date: 2026-06-17
type: session
applies_to: portfolio
related: [75i_investor_radar_prelaunch_sprint, 61a_central_tx_coverage_program, 75g_investor_deal_radar, _decisions/2026-06-17_investor_radar_scope_cuts, _decisions/2026-06-17_map_extraction_shared_capability, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint]
---

# Session — investor radar v1 execution, coverage program, deploys, consent fix

Long working session: this chat became the coordinating planner after the first agent was retired. Two arcs ran in parallel, the investor deal radar v1 (scope lock -> build -> deploy -> live QA) and the Central TX coverage program, with several prod deploys driven directly.

## Decisions locked (filed)

- **Radar v1 scope** ([`75i`](../75i_investor_radar_prelaunch_sprint.md)): lead engine CUT, provider frozen to Cotality, **tiered package bundles** (Free / Pro / Max) over flat $49, **pencils-at-$X** in v1, **Opportunity Zones** in v1 (national L1 flag + L2 reasoning, versioned for OZ 1.0->2.0), **universal parcel-key capture**, signup. Positioning = compounding judgment (not speed); brand = ownable (claude design delivered `hauska.css`, editorial palette + radar mark).
- **Map extracted to a shared cross-app capability** ([`_decisions/2026-06-17_map_extraction_shared_capability.md`](../_decisions/2026-06-17_map_extraction_shared_capability.md)): layer-data assembly lifted to a gate-fronted spine capability (cc-agent-E `00008-qaw`) + a shared render component, consumed by Cortex/extension/SmartCity/Mox. Max-tier. Binding pre-mortem constraints: Max value is cited reasoning rendered spatially (not raw geometry, commitment #1); layers ride the sealed envelope; tenant/product entitlement at the gate (proven by cc-agent-M's cross-tenant denial test).
- **Coverage: proactive within the wedge footprint** ([`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md`](../_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md)), amending the 2026-06-10 demand-driven call. National-layer baseline fires on every parcel regardless of code coverage; the code/zoning layer is incremental, never a gate; "no zoning" is itself a signal. Three work classes: Class A flip engine_only->neon (cheap), Class B onboard net-new Municode cities, deepen Layer 1/2 verified on top. Denominator: ~40-50 deal-volume Tier-A cities, not ~120 incorporated places.

## Deploys driven this session (all verified live)

- cortex-api **radar backend** (#185 Cotality depth + #186 map BFF/Max consume): resolved the #186 merge conflict (3 files to branch side), `BROKERAGE_DEV_API_KEY` dropped from `--set-secrets` (phantom secret blocked deploy-canary), federal-data Docker fix (#188, tsx-not-in-build -> ship fixtures + runtime GCS path). Serving revisions reached `cortex-api-00185-nom` then `00187-ray`.
- engine-api **map-layers wave-3** (`hauska-engine-api-00008-qaw`, deploy via `services/engine-api/Dockerfile`); wave-3 layers verified `ok` on an Austin parcel.
- cortex-api **GTM consent fix** (#189): `/gtm/consent` now accepts the anonymous public extension key; verified live (`POST /gtm/consent` with `X-Hauska-Key` -> **200**). Rollback handle `cortex-api-00187-ray`.

## Consent/auth saga (closed)

Root cause was layered: extension `apiAuthHeaders` dropped `X-Hauska-Key` when signed in; GTM calls needed brokerage-key auth (not the user JWT); the build kept shipping keyless; and the backend `/gtm/consent` rejected the public key (mounted behind the service-token middleware). Fixed across both sides: extension uses `brokerageKeyHeaders` for GTM + consent is a local-gate-first best-effort call; backend mounts GTM before the service-token gate. Consent now records on prod.

## Open / handed off (see handoff)

- **Extension comprehensive wiring + QA pass** (extension-agent): the panel reskin/reframe shipped visually but interactions were under-wired; bugs found in live QA (auth buttons not hiding when signed in, the wallet gate blocking the first brief, Deep research stuck on a refresh banner). v0.6.11 wired the chips/research but issues remain. The extension auth fixes made this session are **uncommitted** in the extension working tree — extension-agent must commit them. Also: commit the public key as a default in `public-client.js` so plain builds stop shipping keyless.
- **Free-brief tier** (cc-agent-C backend): the wallet/metering must grant the first few full briefs free before requiring a top-up (free tier per `08`/`75i`), not gate on shot one.
- **Coverage deepen GATE** (cc-agent-C): the Austin deepen REGRESSED verified rate (38.6% -> 33.2%) because the re-warm upsert downgrades verified atoms on failed re-fetch. Fix-and-pause dispatched; no more deepening until the no-downgrade fix lands.
- **Operator items:** wire ICC `ICC_CODE_CONNECT_*` secrets into GCP (unblocks IFC/IPMC from 0%); the **General Code partnership** (13-city eCode360 unblock); the Vercel landing + public Web Store listing; push G2 Cotality consumer-display license; Stripe (consumer subscription) + Pipedrive (CRM) account setup.

## Memories saved

`icc-contract-unblocks-icodes`, `cc-agent-m-no-doc-repo-access`, `cortex-api-canary-deploy-and-set-secrets`, `engine-api-deploy-method`.
