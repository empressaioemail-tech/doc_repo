---
decision_id: 2026-08-15_capability_mount_composition
date: 2026-08-15
owner: nick
status: active
related_canonical: [_decisions/2026-08-15_smart_files_independent_module, _decisions/2026-08-15_rwa_mount_not_create, _inbox/2026-08-15_a_wdll_smart_files_isolation, 90_operations/OPS-17_govtech_stack_plan_of_record, _smartsite_masters/05_smart_site_product_walkthrough, _smartcity_masters/34_smartcity_smart_files_and_foundation, 28_mcp_first_product_design, 51_substrate_v1_sprint, 80_adrs/adr_008_engine_factor_out]
---

# Decision

Capabilities mount into one interface. They do not merge into one database or one serving process. The long-term product is the composition: digital twin, Smart Files, SmartSite public context, closing documents, and tokenization of real estate if that later proves to be a real mount. A buyer, seller, title company, city, builder, or agent each gets a different mount set over the same modules.

## Context

Operator approved the Smart Files isolation card on 2026-08-15 and, in the same ruling, named the larger shape that isolation exists to serve. Isolation without this ruling reads as "take files off Cortex." Isolation with this ruling reads as "build the first mountable module so later modules can join the same way."

The Bastrop example is operator-attributed, not a live-probe claim in this record: the city already mounts its information on the Smart Site, and a third party that joins mounts into the same place. That is the pattern. It is not a claim that `P:\smartcity-os` already implements the isolated-module wiring, and that repo stays absolute no-touch.

Tokenization is named as a possible future mount. The commercial rule is in `_decisions/2026-08-15_rwa_mount_not_create.md`: we are not RWA creators. RWA operators mount onto our provenance, Smart Files, and map. That is not a G-58 acceptance item.

## Structural commitment check

- Sell reasoning, not data: the mounted interface sells a contestable transfer (evidence, citations, accessPolicy on every read). It does not sell a blob dump of Texas atoms plus someone's drawings.
- Tenant sovereignty (I5): each party's private room stays in the files module (default tenant-private). Public SmartSite context stays on the property spine. Closing documents, if they arrive, are another private mount, not a pool into the public catalog.
- Dual interface (28): a mount is MCP tools plus an embed the application layer can attach. UI-only composition is not a mount.
- MCP v1 (51): one Hauska MCP server, many tools. Mounting a module retargets tools at that module's service. It does not stand up a second MCP server.
- Brand (ADR-008 / branding canon): Smart Files is an Empressa product (`_decisions/2026-08-15_smart_files_is_a_product.md`). Hauska names the substrate it consumes (atom contract, accessPolicy, CID, MCP gate). SmartSite, SmartCity, and later title / builder / agent surfaces mount this product. They do not demote it. The repo is `empressaioemail-tech/smart-files`.
- Catalog thesis: aligned as an Empressa product with isolated housing. Yellow if tokenization is treated as scoped work, or if we sell ourselves as an RWA issuer. The earlier yellow ("do not sell Smart Files as a product brand") is withdrawn. The planner invented it; the operator corrected it.

## Reasoning

A real-property transfer is not one product. It is a set of capabilities that have to appear together for a specific actor. The public spine answers what is true about the place. Smart Files answers what this party attached about the place. A digital twin answers the live or modeled physical object. Closing documents answer the instrument set. An RWA operator, if they mount later, brings their own asset representation. We do not mint it.

If those capabilities share a database so they can "appear together," they are not modules. They cannot be sold a la carte, and a Texas ingest writer can touch a title company's private room. The composition belongs in the application layer: SmartSite for the site buyer, SmartCity for the city, a later title or builder surface for those actors. Each surface mounts the modules it is allowed to see.

Bastrop, as the operator described it, is already this idea at the product level: city information mounts on the Smart Site, and a joining third party mounts into the same interface. Isolation of Smart Files is how that idea becomes wiring instead of a Cortex data room.

G-58 builds only the files module and one consumer mount (SmartSite). Later cards add later mounts. This decision is the filter those cards pass through: module plus mount, never monolith.

## Reversal criteria

Reverse "composition is mount, not merge" only if a named consumer cannot attach a second service or package and that blocker is accepted in writing. Reverse the actor list (title, city, builder, agent, buyer, seller, RWA operator) only if a later positioning narrative supersedes this record. Do not treat an RWA mint as in-scope unless `_decisions/2026-08-15_rwa_mount_not_create.md` is reversed. Do not use this decision to expand G-58 acceptance items.

## Dependencies

Depends on `_decisions/2026-08-15_smart_files_independent_module.md` (own repo, own DB, SmartSite is one consumer). Isolation WDLL `_inbox/2026-08-15_a_wdll_smart_files_isolation.md` is the first execution of this shape. OPS-17 A-018 inserts G-58. Does not reopen G-14. Does not close G-56 or G-53. Does not touch L26.

## Counterparties

Internal: operator, Lane A planner. First consumer: SmartSite. Later consumers named by the operator: city, title company, builder, real-estate agent, buyer, seller, RWA operator (mount, not create). Not a Vertosoft close. Not an RWA issuer.
