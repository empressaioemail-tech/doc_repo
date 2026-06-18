---
id: 2026-06-17_brief_national_baseline_websearch_coverage
title: Decision — the brief never gates on jurisdiction; Central TX served by engine, everywhere else by labeled websearch
date: 2026-06-17
status: active
owner: nick
kind: decision
related: [61a_central_tx_coverage_program, 75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint, 08_tiered_access_model]
---

# Decision: national-baseline coverage with a labeled websearch fallback

## Decision

The Property Brief / investor deal radar never refuses a brief on jurisdiction. The prior `EXTENSION_PUBLIC_PILOT_JURISDICTION_KEYS` allowlist (~12 cities, a hard 403 outside it) is removed as a gate. Coverage is three always-returned layers:

1. National baseline fires on every parcel via geocode (FEMA flood and floodway, USGS soils, geology, karst, topography, EPA, opportunity zones, MUD and PID; Cotality on its existing G2 posture).
2. All of Central Texas is served by the warmed engine atoms (verified, cited) for the local code and zoning layer.
3. Outside Central Texas, or any local layer not yet warmed, the brief falls back to a live websearch and returns the result carrying a disclosure that the data is web-scraped and unverified, with provenance and a low or asserted confidence. It reuses the web-first grounding already built for chat, not a second path.

The "create an account or upgrade" framing belongs to the tier gate (the free-brief cap), never to jurisdiction availability.

## Context

Found in live QA on 2026-06-17: a brief on a Pflugerville address returned a 403 `jurisdiction_not_available`, and the same gate killed any address outside the curated pilot. This contradicted the national-layer baseline reframe ([`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint`](2026-06-17_central_tx_coverage_proactive_within_footprint.md)). The operator directed the allowlist be removed entirely and replaced with the websearch fallback.

## Reasoning and implications

The brief-build path already degraded gracefully on a null jurisdiction and the national layers already fire on lat and lon, so the 403 gate was the only thing blocking a useful brief. Removing it makes the radar fire on any address, which is the core requirement for the landing-to-install-to-working-app flow.

The web-scraped disclosure is not cosmetic. It is the structural-commitment-one guardrail: web-sourced content ships only labeled, with provenance and a low or asserted confidence, never as bare or verified data. Confidence on the websearch path renders at 0.35 asserted, consistent with commitment two (confidence is earned, falls back to an asserted baseline carrying provenance).

Shipped live the same day: the gate removal, the local-code resolver with the websearch fallback, geocode and key resolution so real cities resolve, and the EngineEnvelope `coverage{degraded, reason}` carrying the honest source per section. Serving revision at decision time reached `cortex-api-00194-diw` then `00197-hex`. Verified live: a Pflugerville brief returns 200 with `localCodeSource: websearch` and the disclosure; Bastrop returns cited corpus code with no banner; an out-of-state address returns baseline plus websearch, not a 403.

## Reversal criteria

- If the labeled websearch tier produces enough low-quality answers that it erodes trust in the cited Central Texas product, narrow the fallback (for example, baseline-only with an explicit "local rules not covered" rather than a websearch read) rather than restore a hard allowlist.
- If the Cotality consumer-display license (G2) forces the Cotality-derived layers off the public path, keep the non-Cotality baseline and the websearch local layer; only the Cotality layers gate.

## Status

Active. Live on prod. Supersedes the pilot-allowlist behavior. Captured in [[brief-coverage-websearch-fallback]] memory and to be reflected in [`61a`](../61a_central_tx_coverage_program.md) and [`75i`](../75i_investor_radar_prelaunch_sprint.md).
