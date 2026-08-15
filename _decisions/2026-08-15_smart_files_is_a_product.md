---
decision_id: 2026-08-15_smart_files_is_a_product
date: 2026-08-15
owner: nick
status: active
related_canonical: [_decisions/2026-08-15_smart_files_independent_module, _decisions/2026-08-15_capability_mount_composition, _decisions/2026-08-15_rwa_mount_not_create, _smartcity_masters/34_smartcity_smart_files_and_foundation, 90_operations/OPS-17_govtech_stack_plan_of_record, 80_adrs/adr_008_engine_factor_out, 28_mcp_first_product_design]
---

# Decision

Smart Files is an Empressa product. It is not Hauska substrate, and it is not "only a module other products mount." It has its own repo, its own database, and its own service because it is a product that other products and actors also mount.

## Context

The planner's 2026-08-15 thesis check treated "sold as a product brand" as a yellow. Operator correction the same day: Smart Files is a product. That matches G-53 (sellable at the set price) and doc 34 (Smart Files is the named face). The error was collapsing isolation (own repo, own DB, mountable) into "therefore not a product." Isolation is how the product is housed. It is not a demotion.

## Structural commitment check

- Brand (ADR-008): aligned. Empressa product surface, peer to SmartSite, SmartCity, Codex, Radar. Hauska remains the atom contract, SDK, engine, and MCP gate that the product consumes. The repo name `smart-files` (not `hauska-smart-files`) is the correct name under this ruling.
- Dual interface (28): aligned. The product ships MCP tools plus a UI other surfaces can mount. G-58 already has both. A product that is MCP-only or UI-only would be a later defect, not this ruling.
- MCP v1 (51): aligned. One Hauska MCP server. Smart Files tools retarget at the product's service. The product does not stand up a second MCP server.
- Sell reasoning, not data: the product sells a contestable file room (evidence, CID, accessPolicy), not a blob dump.
- Isolation stands: own repo, own Neon, own GCP/Cloud Run. Being a product does not put it back on cortex-prod.

## Reasoning

A product can be mounted. SmartSite mounts Smart Files. A city, a title company, a builder, an agent, or an RWA operator can mount it too. That is composition, not a reason to hide the brand. Calling it "a module, not a product" would fight G-53, fight the a-la-carte Joe Smith sell, and fight the name on the GitHub remote the operator just created.

Wiring language may still say "module" when it means "own process, own DSN, mountable." Commercial and brand language says product.

## Reversal criteria

Reverse only if the operator later places Smart Files under Hauska substrate in writing and retires the G-53 sale. Do not reverse because SmartSite or SmartCity also show files. Do not use this ruling to put Smart Files back on cortex-prod or to skip the isolation card.

## Dependencies

Corrects the thesis-yellow in `_decisions/2026-08-15_capability_mount_composition.md`. Does not reverse `_decisions/2026-08-15_smart_files_independent_module.md` (own repo, own DB). Does not reverse `_decisions/2026-08-15_rwa_mount_not_create.md` (we still do not mint RWAs). G-58 acceptance items do not change. G-53 remains customer-done.

## Counterparties

Internal: operator, Lane A planner. Buyers: a la carte, SmartSite users, SmartCity / Bastrop (G-53), later title / builder / agent / RWA operators as mounts of this product.
