---
id: 2026-07-16_map_data_sourcing_rulings
title: Map data sourcing — operator rulings R1/R2/R3 (rent-heat, OZ vintage, motivated-seller)
status: active
last_updated: 2026-07-16
applies_to: legacy-design-tools, cortex-tiles, hauska-brief-extension
related: [2026-07-16_map_data_sourcing_spec, 2026-07-16_map_data_gaps_pickup_list]
owner: nick
---

# Map data sourcing rulings — R1/R2/R3 (operator, 2026-07-16)

Resolved during the "amazing map" program after a research pass verified public vs commercial data availability for rent and motivated-seller signals. The Cotality eval agreement (7/6) AI-clause (Closed-Secure-System only, no public/end-user map layers) is the constraint that forced these rulings.

## R1 — Rent-heat disposition: SHIP HONEST PUBLIC AREA-LAYER NOW; per-parcel is operator-gated commercial

Research verdict (confirmed): there is NO usable PUBLIC-record source for a per-parcel or per-property market rent. All public sources are area averages or regulatory ceilings, not property-level market rent:
- ACS median gross rent (table B25064): free, tract-reliable (block-group has large MOE), measures in-place gross rent (lagged, below market asking). Honest as a tract choropleth.
- HUD Small Area FMR: free, ZIP-level for Austin-Round Rock-Georgetown (Travis/Williamson/Hays/Bastrop/Caldwell), but is a voucher payment ceiling (40th-pct), NOT market rent.

RULING: ship rent-heat as a PUBLIC area choropleth (ACS tract + optional SAFMR ZIP overlay) NOW, with an explicit "area estimate, not property-level market rent" disclosure + source citation (same provenance discipline as the websearch fallback). Painting a parcel with an area average without that disclosure would be misleading (commitment #1 violation).

Per-parcel / market-asking rent-heat requires a COMMERCIAL provider. Lead candidate RentCast (only provider whose public terms disclaim attribution + frame open use-cases; $74-449/mo), HelloData second, Zillow ZORI free-but-commercial-embed-unverified. ALL THREE redistribution terms are UNVERIFIED — the same clause-trap Cotality sprung.

OPERATOR-OWNED (like the Cotality keys): Nick confirms the RentCast (or alternate) written redistribution/derived-display license himself. Planner gates NO build on it and never ships a commercial-rent layer to any public surface until Nick gives the written-terms go. Cotality-derived rent caching stays gated. Do NOT launch a per-parcel commercial rent layer on an unverified term.

## R2 — OZ vintage: REFRESH NOW

Pull the fresh CDFI Opportunity Zone shapefile now as the baseline (free one-time federal download); do not gate on a drift check. Ship OZ composite (item 4) on the refreshed layer.

## R3 — Motivated-seller: BUILD ON PUBLIC (transparent weighted-sum, no Cotality propensity)

Research verdict (confirmed): every high-value motivated-seller signal is genuine Texas public record, acquirable via the uniform public-record process (CAD + county tax office + county clerk) — no relationship/special access:
- Pre-foreclosure Notice of (Substitute) Trustee's Sale (highest value; county clerk; 21-day posting).
- Tax delinquency (easiest; TX Property Tax Code Ch. 33 requires published delinquent tax roll; some counties post CSV directly).
- Absentee owner (mailing != situs) + length-of-ownership/tenure (from CAD already held).
- Probate/estate (public, name-keyed, harder match), lis pendens/tax liens (recorded).
- Weak links: code violations (PIA per-jurisdiction — defer), vacancy (not cleanly public — skip).

RULING: build motivated-seller as a TRANSPARENT documented weighted-sum over these live public signals, with cited provenance per signal, asserted-with-verification-state until calibration exists (arrow two). Sequence by access difficulty: tax-delinquency -> absentee/tenure -> pre-foreclosure -> liens -> probate. Explicitly design the score to NOT depend on any proprietary propensity model. Cotality "Propensity to List" and any bought propensity score stay OUT (eval clause + it's the black-box the public weighted-sum replaces, more defensibly per commitment #1/#2).

Non-Cotality aggregators (PropertyRadar, PropStream) bundle these same public signals; useful only as a build-vs-buy benchmark — the signals are public and sourced directly. Their redistribution terms are unverified; not needed.

## Net effect on the program
- Motivated-seller composite (sourcing Wave 2 item 7): UNBLOCKED — build on public.
- OZ composite (item 4): build on refreshed CDFI layer.
- Rent-heat: honest public area-layer proceeds; commercial per-parcel is operator-gated, off the surface until Nick clears vendor terms.
