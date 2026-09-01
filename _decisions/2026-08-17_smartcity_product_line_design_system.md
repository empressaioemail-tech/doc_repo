---
decision_id: 2026-08-17_smartcity_product_line_design_system
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _smartcity_masters/00_README,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    _inbox/2026-08-17_claude_design_prompt_1_design_system,
    _inbox/2026-08-17_claude_design_prompt_2_platform,
    _decisions/2026-08-17_smartcity_visual_law,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# Decision

One Empressa design system governs SmartCity Dashboards, Smart Files, Plan Review, and future Asset Management. It is the product-line visual law, not a Dashboards theme that other surfaces may ignore. The same tokens file is stored in each product repo (`smartcity-dashboards`, `smart-files`, `plan-review`, and the future AM repo). Divergence is a defect.

## Context

Operator 2026-08-17: the Claude Design system being built must cover SmartCity, Smart Files, Plan Review, and future Asset Management. The four category masters already name these as one line (Dashboards, Plan Review, Asset Management, storage layer with Smart Files as the customer face). The first prompt had treated Files and AM as "later mounts." That would produce a Dashboards kit and three forks.

Alternatives considered: Dashboards-only system with per-repo skins (repeats PermitFlow nested chrome). Hauska-branded system (wrong layer; ADR-008). Include SmartSite / Property Explorer in the same kit (not named this ruling; map embed region is in-system, the PE product is not).

## Structural commitment check

- Dual interface: this is the human door. MCP stays Hauska and is not restyled.
- Tenant sovereignty: permission and audience are visible in the system (accessPolicy as UI, not a skin per product).
- Sell reasoning, not data: Plan Review reasoning panel and honest-empty states are system components, not Dashboards extras.
- Brand: Empressa product surfaces. Hauska has no product chrome in this kit.

## Reasoning

If each repo invents tokens, staff will see four products that disagree, which is the failure mode of the live Bastrop weld (SmartCityLayout plus PermitFlow slate plus Compass Inter). One system lets Dashboards compose Plan Review and Files as functions without an iframe looking like a foreign site. Asset Management is unbuilt (G-24 zero); putting its record/attachment components in the kit now is cheaper than a third visual language when AM housing starts.

## Reversal criteria

Reverse if the operator names SmartSite / ICC-demo / Command Center as in-kit, or if a category is sold as a visually independent SKU that must not share chrome. Reverse "AM in the kit now" only if AM is killed as a category.

## Dependencies

Depends on category masters 31/32/33a/34. Governs Claude Design prompt 1 and prompt 2 (all four products). G-66, Plan Review UI, Smart Files UI, and any AM housing WDLL cite this kit. The kit is copied into those repos; it is not restyled per repo. Does not start AM ingest. Does not restyle Hauska.

## Counterparties

Internal: operator, Lane B, Lane A (Smart Files), Lane C (Plan Review). Not Vertosoft collateral (external language still comes from the masters).
