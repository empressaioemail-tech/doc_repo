---
id: 2026-08-15_smart_files_module_identity
title: Smart Files is a spine module; entityId is scope-keyed, not FIPS-only
date: 2026-08-15
status: active
applies_to: portfolio
owner: nick
decider: nick
supersedes: 2026-08-15_smart_files_entity_id_shape
related: [90_operations/OPS-17_govtech_stack_plan_of_record, _architecture_homes/01_homes_and_topology, _smartcity_masters/34_smartcity_smart_files_and_foundation, 80_adrs/adr_017_atom_access_control]
---

# Smart Files module identity

## Decision

Smart Files is a function-package module on the spine, not a city-only store inside SmartCity OS. The document node class declares its entityId as:

```
smartfile:<scopeType>:<scopeId>:<docSlug>
```

`scopeType` is a closed set: `jurisdiction`, `tenant`, `site`. One row in `smart_file_documents` per declared entityId, forever. This is lane A's half of OPS-17 G-10 (S-6). The extend-versus-supersede question remains A-012 (NEW family). The three-table split remains A-014 (KEEP).

Examples the builder must accept:

- `smartfile:jurisdiction:48021:udc` (city / county file)
- `smartfile:tenant:mox:unit-turn-sop` (Mox or any tenant a la carte)
- `smartfile:site:parcel:48021:R12345:geotech` (`scopeId` may itself contain colons)

The parser is last-segment-is-slug: prefix, scopeType, then `scopeId = segments.slice(2, -1).join(':')`, then `docSlug`. A three-segment leftover of the superseded FIPS shape (`smartfile:48021:udc`) returns null. Never reconstruct from parts.

## Context

`_decisions/2026-08-15_smart_files_entity_id_shape.md` declared `smartfile:<jurisdictionFips>:<docSlug>` the same morning G-14 merged. That shape is correct for a city file and wrong for the module. Smart Files is sold inside a SmartCity deployment (Vertosoft SCOS-FILE-DEP, not optional there) and also a la carte across Smart Site, Mox/custom, and standalone. A FIPS-only key cannot address a tenant SOP or a site geotech report.

The reject-parcel-as-document-key and reject-CID-as-document-key rulings in the superseded record still hold. Parcel association remains a PLACEMENT, never identity. CID remains on the VERSION row.

Home: types and tables currently live in `legacy-design-tools` as the first iteration (A-013). That is an implementation location, not the product home. **Superseded on home 2026-08-15:** own repo and own database; LDT/cortex-prod is prototype only (`_decisions/2026-08-15_smart_files_independent_module.md`). The module is consumed by surfaces; it is not a SmartCity monolith feature. Promotion to `@empressaio/atom-contract` is still the named A-013 step. G-34 has closed, which fired that criterion, but this identity reversal means the shape is not settled until this record's builder/parser is in code. Do not promote the FIPS shape. Do not treat G-53 ($25,000 sale) as the module's definition of done.

## Structural commitment check

- Sell reasoning, not data: the store still carries source, computedAt, servedAt, accessPolicy.
- Confidence earned, not asserted: unchanged; this is identity, not a confidence claim.
- Cost per jurisdiction: empty tables (0078/0079 unapplied) make the key change cheap. Apply after the key is right.
- Dual interface: L1 is the store. MCP/UI retrofit is not this decision.

## Reasoning

A module key has to name the scope the document belongs to, then the document inside that scope. Jurisdiction is one scope type, not the only one. Making `scopeId` the remainder-join (rather than a single colon-free token) is what lets a site document key by an existing parcel-node id without inventing a second identifier. The old three-segment form is rejected rather than aliased so a silent dual-key era cannot start.

`jurisdiction_fips` stays as a nullable denormalized column, populated only when `scopeType === jurisdiction` (value equals `scopeId`). Tenant and site rows leave it null. Unique identity is `entity_id`; a second unique on `(scope_type, scope_id, doc_slug)` is required so the parts cannot disagree with the stored string.

## Reversal criteria

Reverse the closed `scopeType` set if a fourth scope is required by a real consumer (for example a named workspace that is neither tenant nor site) rather than by speculation. Association to a parcel, asset, or engagement remains a placement, not a new scopeType.

Reverse last-segment-is-slug if `docSlug` itself must contain colons. The mitigation short of reversal is that slugs stay the existing `^[a-z0-9][a-z0-9._-]*$` class.

Do not reverse back to FIPS-only because city documents are the first corpus. City documents are `scopeType=jurisdiction`. That is a population, not the key.

## Dependencies

G-14 apply waits on this shape landing in schema (new migration 0080; do not rewrite merged 0078). G-44 corpus capture waits on this shape. A-013 promotion waits on this shape. Lane B/C consume the module; they do not own it.
