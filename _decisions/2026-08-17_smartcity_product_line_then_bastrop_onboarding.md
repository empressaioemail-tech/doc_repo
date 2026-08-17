---
decision_id: 2026-08-17_smartcity_product_line_then_bastrop_onboarding
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g18_smartcity_inventory,
    _inbox/2026-08-17_g18_smartcity_inventory_WDLL,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _inbox/2026-08-17_g13_consumer_contract_WDLL,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-15_capability_mount_composition,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    _smartcity_masters/35_smartcity_positioning_framework,
    28_mcp_first_product_design,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# Decision

SmartCity is developed as the product line (Dashboards, Asset Management, Plan Review) mounting Hauska spine, SmartSite, and Smart Files. Bastrop is city one of the onboarding machine, not a unique codebase. Live `smartcity-os` / `tenant_id=2` stays no-touch until a named cutover WDLL. G-18 as-found inventory stands. The product dispositions in this record replace G-18 keep/kill as the build plan.

## Context

G-18 closed 2026-08-17 as a read-only keep / mount / kill of serving Bastrop (`smartcity-api-00118-qox` @100% tag `lane4`). That card graded what is live. The operator then ruled the product: template Dashboards and migrate Bastrop onto it; kill PermitFlow in its entirety; CitizenConnect is the citizen dashboard lens; Parcel Intelligence hosts on SmartSite; Digital Twin is replaced by Asset Management; Compass is reworked entirely; vendor feeds become a templated adapter, not products. Destination: modules (internally: categories and mounts) that interact with spine, SmartSite, and Smart Files, with Bastrop as the first onboarding trial.

G-18 keep of PermitFlow and kill of CitizenConnect-as-SKU were operational grades of the live city. They are not the product line. Mixing those jobs is how a later agent clones wallpaper and calls it a template.

## Structural commitment check

- Sell reasoning, not data: Dashboards sell lenses over records with provenance. They do not sell a screen that only renders a vendor feed (doc 31 refusal).
- Confidence is earned, not asserted: feed adapters write records with source and timestamp. Live Bastrop morning-brief vs city-snapshot disagreement (340 vs 12599 permits; 64 vs 0 overdue) stays a G-21 honesty item, not a number to round off in the template.
- Cost per jurisdiction: Bastrop cutover is the first trial of the onboarding machine. Cloning `smartcity-os` per city fails this commitment.
- Dual interface (28): each category ships MCP plus UI. G-13 rules the consumer contract once. No second Hauska MCP server (51).
- Tenant sovereignty (I5 / ADR-017): city-private ops stay tenant-private. Unauth morning-brief / city-snapshot publishing live Bastrop work orders is a leak, not Layer 1.
- Brand (ADR-008): SmartCity / Dashboards / Plan Review / Smart Files are Empressa. Spine, atom contract, MCP gate are Hauska. SmartSite is the map mount.
- Catalog thesis: aligned on destination. Conflict if CitizenConnect is sold as a fifth SKU (never-say list, doc 35). Conflict if a Samsara or MyGov "module" is sold as aggregation-only. Partial until G-13 closes and each category has an MCP ship date.

## Reasoning

Live Bastrop is a welded city app: vendor wallpaper, scraped copies, PermitFlow as an in-app reviewer, Leaflet island, Compass as a chatbot over silos, CitizenConnect payments as `setTimeout` theater, Digital Twin as marketing copy. Doc 31 already refuses aggregation-only dashboards. Doc 32 already replaces digital twin with Asset Management and calls AM a build, not a module. Doc 33a already names plan review as the function, which is now Lane C on `plan-review-app-ten.vercel.app`. Doc 34 already names Compass as a sidebar over readable records, not shipped. Capability-mount composition (`_decisions/2026-08-15_capability_mount_composition.md`) already says stores do not merge.

The product-line sequence is therefore: freeze the consumer contract (G-13), freeze the Dashboards template (G-61), then cut Bastrop over. PermitFlow dies after Lane C is the staff path, not before. Leaflet dies after G-45, not before. Compass-as-chatbot dies after the sidebar exists, not before. Feeds land through one adapter contract that writes records. Pipedrive stays out.

Internally call them categories and mounts, not a procurement module suite. Asset Management is a build. Dashboards is a complete system a city buys, never phase one of a platform.

## Product dispositions (build plan)

These overlay G-18 as-found. They do not rewrite the probe table.

| Name | G-18 as-found | Build plan |
|---|---|---|
| Operations Dashboard | keep live wallpaper | Template the doc 31 lens family (city manager, development services, finance, citizen) over records. Migrate Bastrop onto that template. Do not clone the live MyGov/Samsara wallpaper. |
| PermitFlow / in-app AI Plan Review | keep live path; mount Lane C later | Kill as a product. Cutover: staff stay on `/permitflow/*` until plan-review-app is the staff path, then PermitFlow and `pf_documents` go away. Do not start G-52 as a PermitFlow feature. G-52 is MyGov record in, review function out, no duplicated logic. |
| CitizenConnect | kill as a product | Dashboard category, citizen lens (doc 31). Keep the capability. Do not sell the name CitizenConnect (never-say). Payments stay unclaimed until built. |
| Parcel Intelligence | keep now; mount G-45 | Host on SmartSite. Own WDLL. Do not build a third parcel stack. Do not cut Leaflet until the SmartSite mount is the staff map. |
| Digital Twin / 3D | kill as a product | Replaced by Asset Management. Do not relabel `blockchain_assets` as AM. G-24 stays zero until a named ingest. Samsara fleet copies are not Tier 1 nodes. |
| Compass | keep welded assistant | Rework entirely to doc 34 sidebar over readable records. Live chatbot stays until the rework is the staff assistant. Do not claim the sidebar shipped. |
| Vendor feeds | keep most; kill Pipedrive as city feed | Templated adapters that write records (ingest, provenance, accessPolicy). Not sellable products. Same contract for MyGov, Samsara, OpenGov, Esri, municode, FirstDue, Verkada, and the rest. Pipedrive stays CRM, not a city feed. |
| City-owned assets (G-24) | do not fill | Unchanged. Zero remains zero until a named AM ingest. |

## Next cards

1. **G-13** (shared leg): consumer contract shape, once, for spine / SmartSite / Smart Files. WDLL draft `_inbox/2026-08-17_g13_consumer_contract_WDLL.md`. Operator approval required before the ruling session.
2. **G-61** (new, A-035): Dashboards product template. WDLL draft `_inbox/2026-08-17_g61_dashboards_template_WDLL.md`. Operator approval required before build. Blocked on G-13. Live Bastrop unchanged on this row.

G-21 honesty remains OPEN on the G-18 rows and does not block the template. Later named WDLLs, not this decision: PermitFlow cutover after G-51 is the staff path; Compass rework; G-45 SmartSite parcel; feed adapter contract; Bastrop tenant cutover.

## Reversal criteria

Reverse "product line then Bastrop cutover" only if the operator accepts rewriting `P:\smartcity-os` in place as the product. Reverse PermitFlow kill only if Lane C is cancelled or ruled not the city reviewer. Reverse citizen-lens placement only if doc 31 is amended. Reverse "feeds are adapters" only if doc 31's aggregation-only refusal is withdrawn. Do not treat this decision as permission to deploy, to cut `/permitflow/*`, or to fill G-24.

## Dependencies

Depends on G-18 inventory (as-found). Depends on capability-mount composition. Unblocks G-61. G-42 (Bastrop lenses) stays blocked on G-11 and G-21; this decision does not skip tenancy. G-52 stays blocked on G-51 and G-13. G-60 STOP and L26 writer slot unchanged. `P:\smartcity-os` remains absolute no-touch.

## Counterparties

Internal: operator, Lane B planner. First onboarding city: Bastrop. Mount targets already live: SmartSite (`smartsite.cloud`), Smart Files (`smart-files-padrd77ava-ue.a.run.app`), plan review (`plan-review-app-ten.vercel.app`). Not a Vertosoft close. Not a G-11 session. Not a deploy.
