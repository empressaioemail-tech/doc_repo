---
id: 2026-09-13_hays_node_identity_is_the_parcel_map_id
title: In a two-namespace county the node id is the parcel-map id; the appraisal account is an attribute joined through the crosswalk
date: 2026-09-13
last_updated: 2026-09-13
status: active
owner: nick
decided_by: nick (operator), 2026-09-13, "A is fine"
plan_rows: [P-177, P-161, P-124, P-145]
related:
  - _inbox/2026-09-13_p175_overseer_review.md
  - _inbox/2026-09-10_ctx-hays-key_close.json
  - _catalog/dispatch_missions/mission_p177_hays_account_attributes.md
  - _catalog/program_preambles/OPS-21.md
---

## Decision

Where a county publishes two identifier spaces for one parcel (Hays: `txgio_parcel.prop_id`
is the QuickRefID R-stem, `cad_property.prop_id` is the appraisal PropertyID; Williamson has
the same structure with lexically disjoint numbering), the Smart Site node id and the ledger
`place_key` stay `{county_fips}:{parcel-map prop_id}`. The appraisal account is an ATTRIBUTE
of that node, reached only through the county's published crosswalk (`txgio_parcel.geo_id` =
`cad_property.property_number`, corroborated by the `quick_ref_id` stem). No attribute of a
node is ever joined to `cad_property` by the bare number. The account number is shown on the
card as the account, never as the node id. Option B (minting nodes on the account number and
re-keying the cells) is REJECTED.

## Why

The parcel-map id is the geometry's own id and the ledger's key in all six Central Texas
counties; for four of them the two numbers coincide, so this rule changes nothing there. Option
B would change every Hays URL and saved screen, force a ledger migration, and reach Williamson
too. The customer-facing defect (one parcel's polygon under another account's label and
dollars) is a join defect, not an identity defect, and P-177 removes it by routing the join
through the crosswalk.

## Consequences

- P-177 is the executing row; its predicate (all five Sturgeon addresses PASS; CTX-HAYS-KEY's
  contradiction count 0) is the proof.
- The hollow account-keyed snapshots P-175 wrote (`48209:84639` and siblings) are retired by
  decline, not adopted.
- OPS-21's identity law gains this paragraph; P-161 carries the crosswalk type into the atom
  contract (a `parcel-account-crosswalk` shape with both identifiers and the corroboration).
- A gate-blocked county whose crosswalk has no account for a node serves an honest absence
  (`no-crosswalk-account`), never the colliding account.

## Reversal criteria

Reversed if a county is found whose parcel map does not publish a stable id at all, so the
account number is the only durable key; or if the operator later rules that customer-facing
ids must be appraisal account numbers for records requests. Either reopens option B as a
migration with redirects, never an in-place re-key.
