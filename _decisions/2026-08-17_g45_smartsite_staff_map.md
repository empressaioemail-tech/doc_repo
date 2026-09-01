---
decision_id: 2026-08-17_g45_smartsite_staff_map
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g45_smartsite_staff_map_WDLL,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g11_city_pack_tenancy,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# Decision

After G-11 close, Lane B next card is OPS-17 **G-45**: the Dashboards staff map is the SmartSite embed of gold Bastrop parcel `48021:34137`. Leaflet on live `smartcity-os` is not cut. Operator approved the G-45 WDLL 2026-08-17. Implementation may start.

## Context

G-11 closed 2026-08-17 as city-pack tenancy sequencing. Overlay `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md` already said Parcel Intelligence hosts on SmartSite and Leaflet dies after G-45, not before. G-13 already named the application mount: embed `smartsite.cloud/?parcelNodeId=`. G-61 already returns that URL from compose.

Live as-found 2026-08-17 on Dashboards `00005-m5t`: GET `/` leaves the iframe `about:blank`. After Compose, the iframe loads `https://smartsite.cloud/?parcelNodeId=48021%3A34137` and PE bundle `index-Dt-8jbWe.js` renders 908 PINE. The mount works. The G-45 instrument (Bastrop map renders, verified on the deployed surface) fails because a grader does not see the map on GET `/`. Operator 2026-08-17: wdll approved. Verification of that approval cleared; this record is active.

Alternatives considered: cut Leaflet on `smartcityos.io` this card (violates no-touch and the overlay "do not cut Leaflet first"). Clone PE into Dashboards (third parcel stack; G-13 forbidden). Treat the compose JSON URL as the grade (code-done, not customer-done). Rewrite hauska-map (embed is not blocked).

## Structural commitment check

- Sell reasoning, not data: aligned. The staff map is the SmartSite parcel surface over public-record spine, not a vendor GIS wallpaper.
- Dual interface (28): aligned. UI embed plus existing MCP `dashboards_compose_city_manager`. No UI-only mount.
- MCP v1 (51): aligned. No second MCP. No new tool name unless compose `smartsite.url` diverges from the iframe.
- Brand (ADR-008): aligned. Dashboards and SmartSite are Empressa. Spine stays Hauska.
- Catalog thesis: aligned. Partial until live Bastrop Leaflet is cut on a later named cutover WDLL. Conflict if this card clones parcels into Dashboards Neon or ships Leaflet as the product map.

## Reasoning

Doc 31 says the map is the same map. Live Bastrop is a Leaflet island that cannot reach `smartsite.cloud` (G-18 CSP probe). The product-line path is: make Dashboards staff map the SmartSite embed first, then later cut the city island. G-61 shipped the wire. G-45 ships the customer-visible default.

Gold `48021:34137` is already the compose control parcel. Auto-loading it on GET `/` is the instrument. Query override keeps the same page a probe for other nodes. Files-room `unavailable` on unauth template-city is G-62/G-11 honesty, not a G-45 fail.

## Reversal criteria

Reverse "staff map is SmartSite embed" only if G-13 names a different live map host. Reverse "do not cut live Leaflet" only if the operator accepts rewriting `P:\smartcity-os` CSP and bundle on this card. Reverse the gold parcel only if a later pin replaces `48021:34137` as the compose control. Do not use this record to delete `/permitflow/*`, fill G-24, or claim Bastrop cutover.

## Dependencies

Depends on G-13 embed contract, G-61 compose mount, G-11 sequencing closed. Unblocks later Leaflet-cutover language on a named Bastrop cutover WDLL. Does not unblock G-33 or G-42. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched.

## Counterparties

Internal: operator, Lane B planner. Map host: SmartSite / Property Explorer on `smartsite.cloud`. First onboarding city: Bastrop, as a public-record parcel on the template, not as `tenant_id=2`. Not a Vertosoft close. Not live ingest.

## Closed

G-45 CLOSED 2026-08-17 on the serving path. Dashboards `smartcity-dashboards-00006-vfk` @100%. PR **#5** squash `3080f4024651c0d53a74c307873cc85fab84b41b`. CI run **32052778257** check-run `test` conclusion `success`. Live GET `/` auto-loads 908 PINE with no Compose click. MCP `00082-mat` tag g11 unchanged. City `00118-qox` Leaflet uncut. Close `_inbox/2026-08-17_g45_close.json`. This record stays active as the staff-map ruling; do not use it to delete live Leaflet.
