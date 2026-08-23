---
decision_id: 2026-08-22_atom_layering_target_state
date: 2026-08-22
owner: planner
status: provisional
related_canonical:
  - 80_adrs/adr_018_atom_contract_substrate_layer
  - 80_adrs/adr_025_og_atom_ontology
  - 80_adrs/adr_017_atom_access_control
  - 80_adrs/adr_022_deal_twin_and_cross_application_capture
  - 01a_atom_conventions
  - _catalog/atoms_index
---

## Decision

Smart Files and the place-keyed atom families are one primitive on two axes, and the target state below is how they reconcile. Filed provisional: the target state is a planner ruling pending operator ratification, and the reconciliation work belongs to the property seat, which owns `smart-files`.

## Snapshot

doc_repo `main` @ `1470560`. Contract read is the published npm tarball `@empressaio/atom-contract@1.22.0`, extracted and read from `dist/*.d.ts`, not from documentation. `smart-files` read at `P:/smart-files` `main` @ `9159e3c`. `legacy-design-tools` and `hauska-mcp-server` read at their working checkouts on the same date.

One instrument correction is recorded because it produced a false negative during this pass. A repository-wide search issued against the MSYS path form `/p` returned "No files found" for a pattern that exists. The same pattern against `P:/smart-files` returned four files. Every negative result in this record was re-run against the `P:/` form after a known positive confirmed the instrument fires. Negatives taken only from the `/p` form are not reported here.

## Findings

The word atom currently names two different things at two layers of the contract, with two identity conventions, and a third convention in Smart Files. The root module defines `AtomRegistration`: an `entityType`, a `domain`, five render modes, a `contextSummary(entityId, scope)` resolver, a declared composition graph, and an event vocabulary. That is a renderable, agent-addressable entity type. The subpath modules define instance types such as `PropertyWorkspace` and `ParcelNode`, which are Zod-validated data shapes carrying `did`, `createdAt`, `updatedAt` and `accessPolicy`. The registration layer keys on `entityType` plus `entityId`. The instance layer keys on `did`. Smart Files keys on `entity_id` shaped `smartfile:<scopeType>:<scopeId>:<docSlug>`.

At 1.22.0 the contract exports the root plus eleven subpaths. `./property` carries sixteen type modules and is the largest by a wide margin. `./og` carries twelve, `./encumbrances` five, `./workspace` four, `./temporal` four, `./read-contract` four. The root carries actor-record, obligation and reasoning-chain. `./reasoning` ships an index and fixtures only.

ADR-025 already ratifies the rule that joins the two axes, and it is stronger than anything proposed in conversation. The pattern is overlay on a shared identifier: a public-record skeleton carries `public-free`, a tenant's enriched record is a separate `tenant-private` atom on the same identifier, and the ADR states that the overlay never enriches the public atom in place. The same pattern governs production streams, where regulator-sourced data is public and operator telemetry is tenant-private under one type and two policies enforced at the gate.

Smart Files does not consume the contract. The repository's only dependency is `pg`. The five-value `accessPolicy` union is reproduced as a literal SQL CHECK constraint in two migrations rather than imported. Identity, content-addressed versioning, provenance JSON and an absence-determination table carrying `absent-verified` and `lookup-failed` are all reimplemented in the contract's idiom without the contract. The database isolation is deliberate and declared in the migration comments; the vocabulary copy is a separate matter and is the defect.

The place-to-matter join in Smart Files is untyped. `smart_file_placements` carries `target_type` in folder, parcel, project, asset, permit and meeting, with a bare `target_id text`, no foreign key, and no reference to any node-identifier convention. A document placed on a parcel that does not exist stores cleanly and never resolves.

The contract's `./workspace` family has exactly one consumer, `artifacts/api-server/src/atoms/property-workspace.atom.ts` in legacy-design-tools. That file imports the frozen `@hauska/atom-contract` name rather than the current `@empressaio` name, declares itself shape-only until workspace database lookup ships, and declares three composition edges all marked `forwardRef: true`, which the registry skips at `validate()` and resolves to zero children at lookup. One of those edges names `place-layer-regrid`, after a data source that has been purged.

The MCP server carries no reference to Smart Files under any of its names. Neither legacy-design-tools nor hauska-map references the service. The only consumer located is the repository's own `web/` application, while migration 003 refers to restoring "PE mount queries" for a consumer that was not found.

The net state is the enforcement doctrine's central defect class, in mirror image. The surface that holds real documents, versions, folders, shares, blobs and absence determinations is not on the contract and is not enumerated by any gate. The registration that is on the contract holds no data, points at a purged source, and returns empty compositions silently. Both report as present. Neither enforces anything.

The store enumeration by entity type was not run. It requires credentials against `hauska_mcp` and is owed by the substrate seat or the operator. No claim about store contents appears in this record.

## The way it should be

One contract, one identifier discipline, two axes, one dial.

The first axis is subject. A place-keyed atom answers what is true of a location and is derived from an external authority. A matter-keyed atom is a container owned by a tenant that references places, holds their own documents, and carries their own work. `./property` is the first. `./workspace` and Smart Files are the second. They are peers under one contract, not a substrate and a satellite.

The second axis is authority, and it must be represented in the type rather than inferred from access policy. An atom derived from an external authority can be independently re-derived and its confidence can be calibrated against outcome. An atom asserted by its owner has exactly one source and no independent derivation exists. These are different kinds of thing, and the enforcement rule that a different kind of thing gets a split type rather than a widened check applies directly. Access policy is orthogonal to authority and must never be read as a proxy for it: a tenant-private determination derived from public record and a published record asserted by its owner are both ordinary and both must be representable.

Identity is one convention. Every atom instance carries a `did` under the node-prefix discipline of ADR-011. Smart Files documents receive a registered prefix and their existing `smartfile:` string becomes the derivation input to that identifier rather than the identifier itself. The registration layer keeps `entityType` plus `entityId` because it addresses types rather than instances, and the mapping between the two is stated once in the contract rather than implied at each surface.

Enumerations are imported, never copied. The `accessPolicy` union has one definition, in the contract. A SQL CHECK constraint holding a hand-copied list is generated from the contract or it does not exist. Where a database constraint is required, the generator runs in CI and the build fails when the copy and the source disagree.

The place-to-matter join is typed. A placement targeting a parcel references a parcel node identifier, and a placement that cannot resolve its target is refused at write rather than stored and discovered later.

The dial is real or it is not claimed. A Smart Files document at `public-paid` is enumerable and callable through the gate, is metered, and routes payment to its owner. Until a gate reads that column for these documents, the column is a starved mechanism and no positioning document may describe the dial in the present tense.

Overlay is the composition rule, per ADR-025. Public skeleton and tenant enrichment share an identifier and never merge in place.

## Handoff

`smart-files` is owned by the property seat. This planner does not write into it. The reconciliation is a lane request against the property seat, compiled through `scripts/dispatch.mjs` with a plan row, and it carries four items in this order: register the Smart Files node prefix and adopt `did`; replace both hand-copied `accessPolicy` CHECK constraints with a generated constraint plus a CI equality test that fails on drift; type the placement target against the parcel node identifier and refuse unresolvable writes; and establish whether any gate enumerates `smart_file_documents`, reporting the answer rather than assuming it.

Two questions are owed back rather than assumed. Which surface is the "PE mount" that migration 003 restores, given that neither legacy-design-tools nor hauska-map references the service. And whether the shape-only `property-workspace` registration in legacy-design-tools is to be fed or retired, given that its composition names a purged source and its only edges are forward references that resolve to nothing.

## Reversal criteria

Reverse the single-contract ruling if the store enumeration shows that Smart Files documents are already served through a path this pass did not find, in which case the finding is a discovery failure and the target state is restated against what exists. Reverse the typed-placement item if a placement legitimately targets things outside the node-identifier space, in which case the target type is split rather than the check widened.

## Hygiene note

ADR-022, status accepted, describes Cotality as the live server of tax, lien, mortgage, permit and owner data and rejects a capture tier as redundant with it. Cotality is extinguished. A fresh agent reading that ADR as accepted canon will route to a dead source. The ADR needs a superseding note.
