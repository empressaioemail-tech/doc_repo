---
decision_id: 2026-08-17_g64_lane_c_staff_path
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g64_lane_c_staff_path_WDLL,
    _decisions/2026-08-17_g65_permitflow_kill,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_g45_smartsite_staff_map,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/33a_smartcity_plan_review,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# Decision

After G-45 close, Lane B next card is OPS-17 **G-64**: the Dashboards development-services lens mounts Lane C plan-review-app as the staff reviewer. Live `smartcity-os` `/permitflow/*` is not cut. G-51 is not re-litigated. G-52 is not started.

## Context

The product-line overlay said PermitFlow dies after Lane C is the staff path, not before. G-18 already observed G-51 true on the C host (`https://plan-review-app-ten.vercel.app`) while live Bastrop still ships PermitFlow (`permitflow=160` in the city bundle). G-60 CLOSED_ON_DEMO_PATH. G-45 closed the staff map as a SmartSite embed without cutting live Leaflet.

Operator approved the G-64 WDLL 2026-08-17. Verification of that approval cleared; this record is active. Implementation may start.

As-found 2026-08-17 on Dashboards `00006-vfk`: GET `/` is the G-45 city-manager SmartSite embed. Served `app.js` has zero `permitflow` and zero `plan-review`. HTML has Lead lenses. Plan-review-app GET `/` is a persona gate (icc-demo reviewer / observer / applicant). Plan-review Cloud Run GET `/` returns `{ok:true,service:plan-review}`. City CSP still cannot frame that host.

Alternatives considered: close G-51 against doc 48 F1-F7 on this card (wrong size; G-60 already graded the demo path). Start G-52 MyGov-record-in (overlay forbade it). Cut live `/permitflow/*` first (takes Bastrop staff off the air; G-18 do-not-touch). Clone a reviewer into Dashboards (third review stack; G-13 forbidden).

## Structural commitment check

- Sell reasoning, not data: aligned. Staff review is the Lane C function over records, not a PermitFlow wallpaper.
- Dual interface (28): aligned. UI embed plus existing Hauska MCP Codex / plan-review tools. No UI-only clone.
- MCP v1 (51): aligned. No second MCP. No new tool name unless compose lacks a plan-review URL field.
- Brand (ADR-008): aligned. Plan Review and Dashboards are Empressa. Spine stays Hauska.
- Catalog thesis: aligned on the mount. Partial until live PermitFlow is cut on a later named WDLL. Conflict if this card copies `pf_documents` into Dashboards Neon or ships PermitFlow as the product reviewer.

## Reasoning

Doc 31 says Plan Review feeds the development-services lens. G-13 already named the later mount: plan-review Cloud Run / Vercel over HTTP or embed, same caller split as SmartSite. G-45 proved the embed pattern on GET `/` for the map. G-64 is that pattern for review, on `?lens=development-services`, without regressing G-45.

The icc-demo persona gate stays. This card mounts the host. It does not mint a Bastrop reviewer and does not treat icc-demo as city tenancy.

## Reversal criteria

Reverse "staff reviewer is plan-review-app" only if G-13 names a different live review host. Reverse "do not cut live PermitFlow" only if the operator accepts rewriting `P:\smartcity-os` routes on this card. Do not use this record to start G-52, resume G-60 residuals, fill G-24, or claim G-51 CLOSED in OPS-17.

## Dependencies

Depends on G-13 mount contract, G-45 embed pattern, G-60 demo host live. Unblocks G-65 product kill (still not a live city cut). Does not unblock G-52. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched. G-60 STOP stands.

## Counterparties

Internal: operator, Lane B planner. Review host: plan-review-app on Vercel, API on plan-review Cloud Run. First onboarding city: Bastrop, later. Not ICC SaaS. Not live ingest.
