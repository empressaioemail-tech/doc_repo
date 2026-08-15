---
id: 2026-08-15_smart_files_entity_id_shape
title: Smart Files entityId shape — jurisdiction-scoped, not parcel-keyed and not CID-keyed
date: 2026-08-15
status: active
applies_to: portfolio
owner: nick
decider: nick
related: [90_operations/OPS-17_govtech_stack_plan_of_record, _smartcity_masters/34_smartcity_smart_files_and_foundation, 80_adrs/adr_017_atom_access_control, _inbox/2026-08-15_a_close.json]
---

# Smart Files entityId shape

## Decision

The Smart Files document node class declares its entityId as:

```
smartfile:<jurisdictionFips>:<docSlug>
```

Jurisdiction-scoped. One row in `smart_file_documents` per declared entityId, forever. This closes
lane A's half of OPS-17 G-10 (S-6), which after amendment A-012 was the entityId declaration only —
the extend-versus-supersede question was already ruled.

## Context

Inherited spine constraint 6 states that entityId shapes are NOT uniform across families by design,
that a shape must be DECLARED rather than reconstructed from parts, and that a wrong reconstruction
silently matches zero rows and looks like an honest absence. Lane A therefore had to declare a shape
before writing schema, not discover one afterward.

Two obvious candidates were rejected for concrete reasons.

**Not parcel-keyed.** Most city documents have no parcel. An ordinance, a council packet, a budget, a
comprehensive plan, and an interlocal agreement are all jurisdiction-level records. Forcing a
parcel-keyed shape would either fabricate a parcel association or leave the majority of a city's file
system unaddressable.

**Not CID-keyed.** A content identifier changes on every revision. A CID-keyed entityId would make each
revision mint a NEW document, which defeats the family: the doc 34 approved claim is "revise once,
current everywhere, and what it was before is still there", and that requires a stable document
identity across revisions. Content addressing still exists in the design, at the VERSION layer where it
belongs, not at the identity layer.

## The three-table shape this implies

The identity decision forces the schema, rather than the reverse:

- `smart_file_documents` — identity. One row per entityId, forever.
- `smart_file_versions` — content, append-only. Prior versions stay retrievable.
- `smart_file_placements` — location, many-to-many.

Placements reference the DOCUMENT, never a version. That is the load-bearing consequence:
revise-once-current-everywhere falls out of the schema structurally, instead of requiring a
per-placement fan-out on every revision that could partially fail and leave placements disagreeing.
The approved claim becomes a property of the structure rather than something procedural discipline has
to maintain.

## Consequences

The Smart Files family is a genuinely new node class alongside the parcel-keyed property families, per
constraint 6. Any consumer resolving a Smart Files document uses the value storage persists and never
rebuilds the string from parts.

Lane B (SmartCity/Bastrop) consumes this shape when it consumes Smart Files; lane C's plan-review
document handling rides the same family.

`jurisdictionFips` scopes documents to a jurisdiction, which is also the natural boundary for the
tenant-private access posture lane B's Bastrop layer depends on. accessPolicy remains a property of the
record, resolved at read time per ADR-017.

## Reversal criteria

Reverse if a material class of city documents proves to be genuinely sub-jurisdictional in identity
rather than merely in association — that is, if documents routinely need to be distinguished by
something narrower than jurisdiction plus slug and the slug cannot carry it. Association to a parcel,
an asset, or an engagement is expected and is modeled as a relationship, not as identity; that case is
NOT a reversal trigger.

Also reverse if `docSlug` proves unstable in practice (a city renaming a document breaking identity).
The mitigation short of reversal is that the slug is assigned once and is not derived from a mutable
title.
