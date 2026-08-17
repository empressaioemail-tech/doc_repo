---
decision_id: 2026-08-17_g65_permitflow_kill
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g65_permitflow_kill_WDLL,
    _decisions/2026-08-17_g64_lane_c_staff_path,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/33a_smartcity_plan_review,
    28_mcp_first_product_design,
  ]
---

# Decision

After G-64 is graded, Lane B next card is OPS-17 **G-65**: PermitFlow is dead as a product. The staff reviewer is plan-review-app. Live `smartcity-os` `/permitflow/*` and `pf_documents` stay until a named Bastrop cutover WDLL. This card does not deploy the city.

## Context

Operator approved the G-65 WDLL 2026-08-17. G-64 CLOSED 2026-08-17 (`_inbox/2026-08-17_g64_close.json`). Implementation may grade.

The overlay kill is "as a product," not "take Bastrop staff off the air today." G-18 listed `/permitflow/*` on the do-not-touch list because it is the live staff path. G-64 is what replaces it on the Dashboards product. G-65 is the paired control: Dashboards has zero PermitFlow, the city island remains on purpose.

Alternatives considered: delete `/permitflow/*` on `smartcityos.io` this card (violates no-touch; staff lose their reviewer). DROP `pf_*` (destructive, no backup WDLL). Treat G-64's zero `permitflow` strings as the kill (code-done; G-65 exists so the product statement is graded after the mount exists). Start G-52 as a PermitFlow feature (forbidden).

## Structural commitment check

- Sell reasoning, not data: aligned. Killing a duplicate in-app reviewer is required once Lane C is the function.
- Dual interface (28): aligned. Review stays on plan-review-app plus existing MCP. No PermitFlow MCP.
- Tenant sovereignty: aligned. Do not publish live Bastrop permit queues as Layer 1.
- Catalog thesis: aligned. Conflict if Dashboards grows a PermitFlow clone. Partial until the live city island is cut on cutover.

## Reasoning

G-45 did not cut Leaflet. G-65 does not cut PermitFlow on the city. Both islands die when Bastrop migrates onto the template, not when the template learns the mount.

The instrument is: after G-64, Dashboards development-services is the staff review entry; served Dashboards has zero `permitflow`; live city bundle still has PermitFlow (paired control). `pf_documents` is not DROPped.

## Reversal criteria

Reverse "do not cut live `/permitflow/*`" only if the operator names a city deploy and accepts Bastrop staff moving to plan-review-app the same day. Reverse "PermitFlow is dead as a product" only if Lane C is cancelled. Do not use this record to DROP city tables or to start G-52.

## Dependencies

Blocked on G-64 graded (CLEARED 2026-08-17). Unblocks nothing on G-52, G-33, G-42, or Bastrop cutover. Live `P:\smartcity-os` remains no-touch. L26 untouched. G-60 STOP stands.

## Counterparties

Internal: operator, Lane B planner. Live city: Bastrop `tenant_id=2`. Not a Vertosoft close.
