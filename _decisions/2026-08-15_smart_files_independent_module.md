---
decision_id: 2026-08-15_smart_files_independent_module
date: 2026-08-15
owner: nick
status: active
related_canonical: [_decisions/2026-08-15_smart_files_module_identity, _decisions/2026-08-15_file_set_edges_not_identity, _decisions/2026-08-15_capability_mount_composition, _smartsite_masters/05_smart_site_product_walkthrough, _smartsite_masters/07_smart_site_faq_bizdev, _smartcity_masters/34_smartcity_smart_files_and_foundation, 90_operations/OPS-17_govtech_stack_plan_of_record, _inbox/2026-08-15_a_wdll_cc_done_l15, _inbox/2026-08-15_a_wdll_smart_files_isolation]
---

# Decision

Smart Files is an Empressa product with its own repo and its own database. SmartSite is one consumer. Today's live SmartSite save, draw, and share is a get-by mechanism and is not Smart Files. The knit (Joe, 123 Main, his data room, the public property read) happens only in the SmartSite application layer. Product status: `_decisions/2026-08-15_smart_files_is_a_product.md`.

## Context

G-56 was built as tables and routes on cortex-prod and cortex-api, plus a Command Center panel. That treated a first-iteration code location (A-013) as the product home and parked a filing system on the same database and serving process as county ledger and CAD. Operator correction 2026-08-15: that is the wrong home, and it risks the Texas property-spine ingest (L26 / SmartSite public database).

Live SmartSite already lets a user draw, save properties, and share a place (`_smartsite_masters/05_smart_site_product_walkthrough.md`). Those saves are not atoms. Smart Files is the evolution: the same product shape (my drawings on my place) implemented as file-shaped atoms, nodes, and edges in a private store. Command Center's map is the operator harness for the spine renderer. It is not the analog. SmartSite's map is the visual interface for the public property spine and may share a repo with that renderer. Smart Files must not.

## Structural commitment check

- Sell reasoning, not data: a user's drawing is their evidence in their room. A flood fact stays a public or public-paid spine atom. They do not share a table.
- Tenant sovereignty (I5): private file atoms never pool into the public SmartSite database. Isolation is wiring (separate DSN, separate role, separate migrate), not a comment.
- Dual interface: the module ships MCP tools plus an embed any consumer can mount. SmartSite is the first product consumer. Joe Smith down the street can be another. Command Center may mount later as an embed test, not as home.
- MCP v1: one Hauska MCP server. Tools call the files service. No second MCP server.

## Reasoning

A filing system you can sell a la carte cannot live inside the property-spine API. If the only way to get a data room is to take Texas flood atoms, the module is not a module. SmartSite already states the trust rule: public information is public; attached documents stay private and never pool (`_smartsite_masters/07_smart_site_faq_bizdev.md`). Today's share link carries analysis and drawings as product state, not as file atoms. Building Smart Files on cortex-prod would make that rule a promise instead of a partition.

The important scene is application-layer composition. SmartSite reads the public spine for the place. It mounts Smart Files for Joe's room about that place. Edges can point at a parcel-node id. The files service never holds the atoms DSN. The L26 writer never holds the files DSN. Complementary in the UI. Physically separate in storage.

Default accessPolicy for new file atoms is tenant-private (profile-private). Site-plan export derived from public records is not a Smart File. A drawing the user puts in their room is.

## Reversal criteria

Reverse the own-repo requirement only if a named consumer cannot mount a package or service from a second repo and that blocker is accepted in writing. Reverse the own-database requirement only if a threat model shows a shared Postgres with zero overlapping roles and migrate jobs is as strong as a separate project; do not reverse because it is faster to keep using cortex-prod. Reverse "today's SmartSite save is not Smart Files" only after a live probe shows those saves are file-shaped atoms with CID, accessPolicy, and placements in the files store.

## Dependencies

Supersedes A-013 on home (LDT remains a prototype location, not the store). Identity, three-table split, and edges-not-identity stay (`_decisions/2026-08-15_smart_files_module_identity.md`, `_decisions/2026-08-15_file_set_edges_not_identity.md`). OPS-17 amendment A-017 records the home change. A-018 inserts G-58 and records the mount-composition companion (`_decisions/2026-08-15_capability_mount_composition.md`). G-56 on Cortex is a disposable UX prototype; no further Smart Files writes to cortex-prod; do not drop 0078-0081 during L26. G-11 tenancy is enforced on the files database. L26 / OPS-16 is a different track and must not see this repo's migrate or deploy.

## Counterparties

Internal: operator, Lane A planner. Consumers: SmartSite (first product), later SmartCity and a la carte. Not a Vertosoft close (G-53).
