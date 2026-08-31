---
id: 2026-08-15_a_wdll_cc_done_l15
title: WDLL — Smart Files Layer 1.5 Command Center done (data room)
status: approved
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [90_operations/OPS-17_govtech_stack_plan_of_record, _smartcity_masters/34_smartcity_smart_files_and_foundation, _decisions/2026-08-15_smart_files_module_identity, _decisions/2026-08-15_smart_files_independent_module, _decisions/2026-08-15_vision_data_room_and_sdk, _decisions/2026-08-15_icc_first_sdk_customer, _decisions/2026-08-15_file_set_edges_not_identity, portfolio_thesis/03_three_questions_data_room_and_sdk, _thought_leadership/04_positioning_narrative, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_017_atom_access_control, 28_mcp_first_product_design, 90_operations/OPS-6_command_center_engine_console]
---

# WDLL: Smart Files Layer 1.5 — Command Center done

Date: 2026-08-15  Status: approved
Operator approval: 2026-08-15 (rulings 1-4). Ruling 1 as corrected: files are one atom type; folder membership is edges.
Plan row: G-56 (OPS-17 amendment A-016)
Repos: hauska-mcp-server (tools), legacy-design-tools (store serving path), hauska-map/apps/command-center (panel)
This card does not reopen G-14. G-14 stays foundation-closed. This card does not close G-53. Customer-done waits on Lane B SmartCity / Bastrop.

## Done looks like

Nick opens Command Center, opens the Smart Files module, and is inside a data room. Folders are twin nodes. Files are file-shaped atoms (documents with attachments), not every atom on the node. Other atom types exist and stay typed. An atom appears in a folder via an edge, not because its entityId is the folder. One file-atom can sit in more than one folder because it has more than one `placed-on` edge; identity does not change. Opening a file shows the file (PDF when the atom carries a document version) and a sidebar of the data behind it: entityId, accessPolicy, source, computedAt, servedAt, STALE, versions, edges. A PDF is not a parallel object; it travels with the atom it belongs to. The folder has a record pane for non-file atoms on that node (reuse Atom Inspector). The same operations work from Hauska MCP tools, not only from the panel. AccessPolicy is enforced on every list and read. The room has enough seed content to contest; it is not the Bastrop corpus and it is not a Vertosoft sale.

That is the internal mechanic already written in doc 34, and it is questions 1 and 2 of the Empressa mountain (`_thought_leadership/04_positioning_narrative.md`): who am I dealing with, and what is this thing, really. The SDK is question 3 and is not this card. Mapping: `portfolio_thesis/03_three_questions_data_room_and_sdk.md`. External language stays doc 34 (search, revise once, it is yours). Never say atom, node, graph, token, or SDK on a customer surface.

## Four rulings that freeze this card

Do not start build until these are operator-ratified. Planner recommendation is in parentheses.

1. **File set.** CONFIRMED 2026-08-15, corrected. Not every atom is a file. File-shaped atoms (documents with attachments) are the file list. Other types stay typed and do not render as files. Folder membership is edges (ADR-010), not identity (ADR-001). `smart_file_placements` is the first `placed-on` edge. One atom, many folders = multiple edges, same entityId. Decision `_decisions/2026-08-15_file_set_edges_not_identity.md`.
2. **Folder set.** CONFIRMED 2026-08-15. First tree is jurisdiction, tenant, site. Parcel-as-site is the first nested folder. Human, building, desk, asset, and station wait on the rest of G-10.
3. **SDK subset.** CONFIRMED 2026-08-15. CC-done carries ADR-017 accessPolicy on every list/read, product-key gate, and dual interface (MCP + CC). It does not carry Circle payment, VDA wrapping, or take-rate routing. First real SDK customer is ICC (`_decisions/2026-08-15_icc_first_sdk_customer.md`). G-11 tenancy remains after this card, before tenant-private corpus.
4. **Module name in CC.** CONFIRMED 2026-08-15. Panel id `smart-files`, data-room UX. Do not name a second product. Compass is not this sidebar. Reuse Atom Inspector for the folder record pane and for provenance.

## Acceptance items

1. **Serving binary matches the live schema.** cortex-api canary of LDT main `015b15d6246ea6af12b6b25daa69eae8a75fc61b` (full 40-char SHA), smoked at 0 percent including `GET /api/county-ledger`, then shifted. Image already sits in Artifact Registry tagged that SHA and `latest`.
   | check: `gcloud run services describe cortex-api` serving revision image tag is the 40-char SHA. `/healthz` 200. county-ledger 200 with computedAt.
   | grade: [ ] | depends on: nothing (blocks 2)
   | note: this is the missing deploy from the L1 wave. It does not by itself make the module contestable.

2. **MCP tools are the serving path.** One Hauska MCP server gains Smart Files tools: list folders for a scope, list files in a folder (file-shaped atoms reached by `placed-on` edges, never by reconstructing entityId), read file (atom plus attachment stream), list edges/placements for an atom. No new MCP server. Tools enforce accessPolicy at the tools layer (ADR-017). Typed absence is a first-class payload, never a silent empty list.
   | check: live MCP initialize + tool calls against the serving MCP revision, timestamped. Anonymous caller refused on a tenant-private seed atom. Operator/product key reads platform-internal seed atoms.
   | grade: [ ] | depends on: 1
   | WDLL dual-interface: 28_mcp_first_product_design.md. CC is the second surface of these tools.

3. **Seed data room exists on cortex-prod.** At least two folders (two different nodes), at least three file-shaped atoms, at least one file-atom with `placed-on` edges to two folders (same entityId in both), at least one PDF-bearing smart-file document, at least one non-file atom on a folder that appears in the record pane and does NOT appear in the file list, at least one typed absence. accessPolicy `platform-internal`. Not G-44. Not a customer corpus.
   | check: SQL against cortex-prod `smart_file_*` plus the atom/placement read the MCP tools use. Counts travel with the counting rule. Timestamped.
   | grade: [ ] | depends on: 1
   | constraint: do not steal the atoms bulk-writer slot. Seed writes are named, small, and announced.

4. **Command Center module is live.** `cmdcenter-blush.vercel.app` has a non-stub panel, hash-routed (same pattern as `#panel=county-manifest`), labeled Smart Files. Folder tree on the left. File list in the center. Opening a file shows preview plus sidebar. Vercel deploy is planner-owned; Vercel does not auto-deploy on merge.
   | check: live URL screenshot-grade: folder names are node ids or their display labels; file rows are file-shaped atoms only; the multi-edged file-atom appears in both folders with the same entityId; the seeded non-file atom is in the record pane, not the file list.
   | grade: [ ] | depends on: 2, 3
   | home: `hauska-map/apps/command-center`. `P:\smartcity-os` is never opened.

5. **PDF travels with the atom.** Preview is fetched through the atom read (CID / version row), not a parallel unsigned blob URL that can 200 after the atom is gone or 404 while the atom exists. Revise-once still holds: a new version is current in every folder the document is placed in; the prior version remains openable from the sidebar.
   | check: live probe, both directions. Atom exists => preview 200. After a version replace, both folders show the new bytes and the sidebar still lists the old version. Absence or missing version is typed, not a broken img.
   | grade: [ ] | depends on: 4

6. **Sidebar is the data behind the file.** Visible without leaving the file: entityId, accessPolicy, source, computedAt, servedAt, STALE indicator, version list, placement list. STALE is proven able to fire by a backdate test on the live panel (same class as county-manifest).
   | check: live panel backdate; banner or stamp fires; restore; screenshot-grade.
   | grade: [ ] | depends on: 4

7. **RBAC probe on the live room.** Anonymous or wrong product key cannot list or open tenant-private seed content (401/403, not empty). Operator path with a valid key reads platform-internal. MCP tools and the CC panel produce the same deny/allow on the same atom. This is not G-11 city-staff RBAC and not Bastrop-authenticated vs public.
   | check: three live calls, timestamped: anon, bad key, operator key. Same three via MCP.
   | grade: [ ] | depends on: 2, 4

8. **G-19 is not this card.** Authoritative Command Center docs remain G-19 (OPEN). This card may add a pointer from the CC canonical doc to the data-room panel once G-19 exists; it does not substitute for G-19.
   | check: this close does not mark G-19 closed.
   | grade: [ ] | depends on: nothing

9. **Honest close.** Close artifact names serving SHAs (cortex-api, MCP, CC Vercel), live MCP probes, live CC URL, seed counts with rule, RBAC probe, and remaining open (G-10 remainder, G-11, G-20, G-44, G-53, A-013 promotion). Does not claim customer-done. Does not claim doc 34 collateral may ship.
   | check: `_inbox/2026-08-15_a_cc_done_close.json` plus this card graded.
   | grade: [ ] | depends on: 4, 5, 6, 7

## Out of scope

G-20 coverage count. G-44 Bastrop document capture. G-53 Vertosoft sale and approved-claims collateral. Lane B SmartCity OS (absolute no-touch). Lane C Plan Review CC module. Lane D ICC. G-11 full tenancy/auth. Circle / VDA / take-rate. Compass intelligence sidebar. Human / building / desk / asset / station folder classes (rest of G-10). Texas flush / OPS-16. Cleaning the dirty LDT checkout.

## Proposed OPS-17 amendment (A-016, not applied until this card is approved)

Insert a Layer 1.5 section between Layer 1 and Layer 2.

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status |
|----|---|-----------|--------|---------------------|------------|--------|
| G-56 | 1.5 | Lane A: Command Center data room. Folders are nodes, files are atoms, PDF travels with the atom, accessPolicy on every read, MCP tools plus CC panel | A, all lanes (CC is the operator console) | This WDLL, graded by live MCP probes and a live CC URL, never a merged PR | G-14 | OPEN |

G-53 remains customer-done and stays blocked on G-34 + G-44. Add G-56 as an additional blocker so a sale cannot precede an operator-visible room. G-19 stays the CC docs row. G-50 remains the first SDK-customer row (ICC public-paid). Do not add SDK payment work to G-56.

## Amendments

- 2026-08-15: ruling 3 confirmed by operator vision document and ICC-first-SDK decision.
- 2026-08-15: rulings 2 and 4 confirmed (folder set = A-015 scopes + parcel-as-site; panel id `smart-files`).
- 2026-08-15: ruling 1 confirmed as corrected. Files are one atom type. Folder membership is edges, not identity. Decision `_decisions/2026-08-15_file_set_edges_not_identity.md`. Card frozen.
- 2026-08-15: HOME CORRECTION. Smart Files is an independent module (own repo, own database). SmartSite is one consumer. Today's PE save/draw/share is a get-by and is not this card. G-56-on-Cortex is a disposable UX prototype. No further Smart Files migrations or seed writes on cortex-prod. Do not bake seed blobs into cortex-api. Do not drop 0078-0081 during L26. Decision `_decisions/2026-08-15_smart_files_independent_module.md`. Reason: filing system must be physically unable to touch the public property spine.

## Finish card (graded at close)

(not yet)
