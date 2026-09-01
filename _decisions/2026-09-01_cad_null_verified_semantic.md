---
decision_id: 2026-09-01_cad_null_verified_semantic
date: 2026-09-01
owner: Nick
status: active
related_canonical:
  - _inbox/2026-09-01_parcel_gap_ledger.md
  - _decisions/2026-09-01_parcel_record_rails_v2_template.md
---

## Decision

`ingestCadOntoRecords` gains a cad-null-verified emission: when the ingest has matched a
parcel to its authoritative latest CAD row and a scalar CAD field is null (or blank) on
that row, the cell becomes `absent-verified` with the CAD row itself as the basis
(county, prop_id, tax year, vintage). A join miss never triggers it; join-starved cells
stay `unaccounted`.

## Context

The gap ledger sized the class per rail per county. Without this semantic,
McLennan-shaped counties refuse publish forever: assessed and living are null at the CAD
authority on every landing row, which is a real look with a real basis, not an unlooked
gap. The alternative rejected was leaving the class unaccounted, which makes the publish
gate score honesty about the source as planner debt.

## Structural commitment check

This is not the forbidden conversion: "never convert unaccounted to absent-verified to
clear a gate" prohibits relabelling without evidence. Here the evidence is the matched
CAD row, the emission lives in the module as a typed path with the basis recorded, and
the conversion is impossible where the join did not match. The Williamson improvement
class is the explicit negative case: those values exist under a different CAD key, the
join has not matched the value-bearing row, and the class stays unaccounted until the
R1 crosswalk lands.

Adjudication note 2026-09-01 (R6 close): the live Williamson identity join DOES match
the R-prefix CAD row at rate 1.0, so the matched-row letter of this scoping would fire
there while the values sit on sibling numeric accounts. The intent phrase governs: the
matched row is not the VALUE-BEARING row, and until the R1 crosswalk exists the module
cannot tell. Enforced by execution sequencing, not a module special-case: R6B defers the
48491 dual-key dollar rails until R1B closes (addendum on the R6B card). The module's
structural scoping and its b/b2 fixtures stand as merged (engine #376, a38cbb2).

## Reasoning

Absent-verified requires "something looked; a basis says where and why not." The CAD
roll is the authority for CAD fields and its null is the authority's answer. Encoding
the look as a module emission (never a backfill job) keeps the three-way distinction
mechanical: value = the row had a value; absent-verified = the row existed and did not;
unaccounted = no matched row has been read. The re-ingest that applies it is idempotent
and re-runnable, so a wrong scoping is recoverable by narrowing the emission and
re-running.

## Reversal criteria

Reverse if the emission is ever observed firing on a join miss (that is the exact
defect the scoping exists to prevent; one confirmed instance quarantines the semantic
and the re-ingest). Narrow if a county is found where CAD nulls are systematically
transcription gaps rather than authority answers (evidence: a second authoritative
source holding values where CAD is null at scale).

## Dependencies

Depends on: the filled record and the gap ledger sizing. Feeds: PARCEL-R6 (module),
PARCEL-R6B (re-ingest), the publish gate's path to a non-refusing county.

## Counterparties

Internal: property seat implements; the publish gate and gap ledger consume.
