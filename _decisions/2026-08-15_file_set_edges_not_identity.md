---
decision_id: 2026-08-15_file_set_edges_not_identity
date: 2026-08-15
owner: nick
status: active
related_canonical: [_inbox/2026-08-15_a_wdll_cc_done_l15, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, _decisions/2026-08-15_smart_files_module_identity, _smartcity_masters/34_smartcity_smart_files_and_foundation]
---

# Decision

Not every atom is a file. File-shaped atoms (documents with attachments) are one type among many. An atom appears in a folder via an edge, not because its entityId is the folder. Identity is what the atom is (ADR-001). Edges are where it shows up and what it relates to (ADR-010). `smart_file_placements` is the first typed `placed-on` edge for the file family.

## Context

WDLL ruling 1 was drafted as "files in a folder are every atom on that node" and then as "identity-shaped facts vs placement-shaped documents." Operator pushback 2026-08-15: identity is the wrong join for folder membership; that is what edges are for. And yes, there need to be different atom types; not every atom is a file. Doc 34 already says files are atoms with attachments, not that every atom is a file. ADR-010 already names `applies-to` (finding applies-to parcel) as a link type. The L1 three-table split already separated document identity from placements. The defect was treating parcel-keyed fact atoms (entityId equals the node) as doctrine rather than as an implied edge the writers have not yet made explicit.

## Structural commitment check

- Sell reasoning, not data: a flood-hazard fact stays a fact atom. It does not become a fake file so a data room can list it.
- Dual interface: MCP lists files by traversing `placed-on` (and later other link types). It does not reconstruct folder membership from entityId parts (OPS-17 constraint 6).

## Reasoning

ADR-001 identity (`entityType`, `entityId`, `cid`) answers what this record is. ADR-010 traversal answers how records relate. A node is an ID full of atom facts because of edges into that ID, not because every fact's primary key is the folder name. One atom in many folders is multiple edges, same identity. That is already true for Smart Files placements and is the same mechanic ADR-010 uses for `applies-to`. Collapsing membership into identity forces a second relationship model the moment a fact must appear on two twins (a person and a parcel, a document and a site). Edges already are that model.

CC-done implements the file list from placement edges. Other atom types on the node belong in the record pane, reached by their own edges. Parcel-keyed property facts that today imply `applies-to` via entityId may show in that pane as implied edges for 1.5. That implication is a FINDING, not the frozen model. Do not rewrite owner-fact writers in this wave.

## Reversal criteria

Reverse "file list is file-shaped atoms only" if operator later wants a catalog browser in this panel, which would be a different WDLL (and would conflict with catalog-level web UI deferred). Reverse "membership is edges" only if a new ADR retires ADR-010 traversal as the relationship primitive.

## Dependencies

Freezes WDLL ruling 1 on `_inbox/2026-08-15_a_wdll_cc_done_l15.md`. Does not require emitting explicit `applies-to` edges from existing property writers before CC-done. Does not promote placements into `@empressaio/atom-contract` in this wave (A-013 still named).

## Counterparties

Internal: operator, Lane A planner.
