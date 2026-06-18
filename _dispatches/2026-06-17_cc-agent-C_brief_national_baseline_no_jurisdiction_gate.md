---
id: 2026-06-17_cc-agent-C_brief_national_baseline_no_jurisdiction_gate
title: cc-agent-C — brief must never 403 on jurisdiction (national-baseline-fires-everywhere) + attachment presign endpoint
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
priority: HIGH — ahead of the Stripe/Pipedrive connectors; pairs with the free-brief tier (same route)
related: [61a_central_tx_coverage_program, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint, 75i_investor_radar_prelaunch_sprint]
---

# cc-agent-C — brief: national baseline fires on every parcel (kill the jurisdiction 403)

Found in live QA: a brief on `17003 Simsbrook Dr, Pflugerville, TX 78660` returns **403 `jurisdiction_not_available`** ("outside the free Property Brief pilot"), jurisdiction `null`. This directly violates the national-layer baseline decision ([`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md`](../_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md)): every parcel gets the national baseline; the local code/zoning layer is incremental, never a gate; "no zoning" is itself a signal.

This is the single biggest launch blocker for the GOAL — the radar must fire on any address, not just the ~12 pilot cities.

## The gate (verified)

- `artifacts/api-server/src/routes/brokerageBrief.ts:522-533` — for `extensionPublic`, calls `assertExtensionPublicJurisdictionAllowed(jurisdictionKey)` and hard-403s **before building anything**. Duplicated on the async/streaming path at `:974-986`.
- `artifacts/api-server/src/lib/brokerageExtensionPublic.ts:144-170` — the allowlist: null key → "outside the pilot" (Pflugerville hit this); `blocked_partnership` tier → "municipal code not yet available"; only `neon`/pilot-list pass.
- **But the brief-build path already degrades gracefully:** the national layers fire on `geocode.lat/lon` independent of jurisdiction (`brokerageBrief.ts:584, 604, 818`), and `:544 if (!jurisdictionKey)` builds empty municipal-code sections. The brief WILL produce a real result with a null jurisdiction — the 403 is the only thing stopping it.

## Coverage model (operator decision 2026-06-17 — there is NO allowlist)

The brief NEVER refuses on jurisdiction. The `EXTENSION_PUBLIC_PILOT_JURISDICTION_KEYS` allowlist is killed as a gate. Three layers, always returned:

- **National baseline** — fires on every parcel via geocode lat/lon (FEMA flood/floodway, USGS soils/geology/karst, topography, EPA, OZ, MUD/PID; Cotality on its existing posture).
- **All of Central Texas** — local code/zoning served from the warmed engine atoms (verified, cited) where we have them.
- **Outside Central TX, or any local layer not yet warmed** — fall back to **websearch** and return results **with a disclosure that the data is web-scraped and unverified**, carrying provenance + low/asserted confidence. Never ship web-scraped data as bare or verified (commitment #1). Reuse the web-first grounding already built for chat ([`2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding`](2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding.md)) — do not build a second websearch path.

## Fix

1. **Remove the hard-403 jurisdiction gate** at `brokerageBrief.ts:522-533` and `:974-986`. The brief always builds; the national baseline fires on geocode; the local layer resolves per the coverage model above.
2. **Carry the source/confidence in the EngineEnvelope** `coverage{degraded, reason}` + per-section provenance so the extension can render the right banner:
   - warmed Central TX atoms → cited, verified/asserted confidence, no disclosure.
   - websearch fallback (outside footprint, or unwarmed/eCode360-blocked city like Pflugerville/Kyle/Buda/Cedar Park) → `degraded: true, reason: "Local code from web search — unverified, web-scraped"`, low/asserted confidence, the web-scraped disclosure attached to those sections.
3. **Move the "create an account / upgrade" framing to the TIER gate** (the free-brief cap), never to jurisdiction. Jurisdiction availability must never be the reason a brief is refused or downgraded to nothing.
4. **Fix the geocode/key resolution.** `17003 Simsbrook Dr, Pflugerville, TX 78660` resolved to a **null jurisdictionKey** — a real Austin-metro city should resolve so it picks the right path (warmed atoms vs websearch). Check `geocodeAddress` (returns city/state?) and `keyFromEngagement` (maps "Pflugerville, TX" → `pflugerville_tx`?). Where a key is genuinely unknown, still serve baseline + websearch.

## G2 / Cotality boundary (do not regress)

Serving the baseline on arbitrary parcels is dev-pilot per the G2 decision (Cotality consumer-display license gates **public launch**, not dev). The **non-Cotality** public baseline (FEMA, OZ, MUD/PID, USGS) always fires. The **Cotality-derived** layers stay on the same posture they already have on pilot cities — do not newly expose Cotality display in a way the G2 gate wouldn't cover; if anything, key the Cotality layers off the same entitlement so the launch flip is one switch.

## Attachment presign endpoint (PB-301, pairs with the extension fix)

The extension's CC&R/HOA document upload is stubbed ("coming soon"). The Cortex/plan-review presign upload already works (runtime SA `api-server-runtime` has `serviceAccountTokenCreator`). Expose / confirm a presign-upload endpoint usable by the brokerage/extension-public tier and give extension-agent the exact contract (URL, request shape, returned upload URL, object path, size/type limits). Uploaded docs attach to the user's property profile and are **tenant-private** (never pooled).

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_brief_national_baseline_close.md` — verbatim before/after of a live `POST /api/brokerage/v1/brief` on the Pflugerville address (must go 403 → 200 with the national baseline populated and the local-code layer served via websearch carrying the web-scraped/unverified disclosure + low confidence); a second live brief on an address OUTSIDE Central TX (confirm it returns baseline + websearch with disclosure, not a 403); the geocode/key resolution fix; and the attachment presign contract handed to extension-agent.
