---
decision_id: 2026-09-05_cad_join_miss_becomes_absent_verified
date: 2026-09-05
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-09-05_ledger_serving_audit
  - _decisions/2026-09-05_landuse_earned_absence_contract
---

## Decision

In hauska-engine's parcel-record ingest code (`ingest-existing.ts`, vendored into
hauska-factory as `ingest-existing.js`), a genuine join-miss against `cad_property`
— no row for that county+propId across every tax year the ingest query observed —
now emits `absent-verified`, reversing the current invariant that a join miss
must stay `unaccounted` forever.

## Context

Surfaced during the 2026-09-05 ledger serving audit (Wave 3, item 3): a parcel
with zero matched `cad_property` row gets no write for ~15 CAD-scalar fields,
`landUseCode` among them, directly blocking a clean fill-state answer for
sprint item 20 (landUse, operator-prioritized: "a lot of the function of the
platform rides on this data field"). The Factory lane found and flagged this
rather than forcing a fix, for two reasons: the file is compiled/vendored from
hauska-engine (`ENGINE_PIN.json`: "do not edit these .js files by hand"), and
the codebase carries a currently-tested invariant asserting the opposite
("a join miss must never reach absent-verified," with its own falsifier test)
— reversing a deliberate, tested design decision, not fixing an oversight.

## Structural commitment check

Confidence is earned, not asserted (commitment 2): `unaccounted` is meant to be
a work-queue state ("not yet processed"), not a permanent resting state for
something that can never resolve. A propId with zero rows across every tax
year ever ingested for that county is not "unprocessed" — it has been
processed, repeatedly, and confirmed absent. Leaving it `unaccounted` forever
misrepresents a settled fact as a pending one.

## Reasoning

The ingest query (`CAD_ROWS_SQL`) is `DISTINCT ON (prop_id) ... WHERE
county_fips = $1 AND prop_id::text = ANY($2) ORDER BY prop_id, tax_year DESC`
— scoped to the exact propIds requested, across all tax years present in
`cad_property` for that county. A miss under this query is not "this run
didn't check" — it is "no row exists for this propId in any tax year this
system has ever ingested for this county." That is a confirmed absence by the
same standard this operation already applies everywhere else (`ENFORCEMENT.md`:
"absent, zero, and unmeasured are three different states... never collapse
them"; the whole ledger audit this ruling comes out of exists because
several rails were found silently collapsing "haven't resolved this" into
"unaccounted forever," which reads identically to a customer as a bug). The
2026-08-30 remainder review's own §3.1 defect (landUse "present-presented-as-
absent") is the mirror image of this one — a value that exists reported as
absent; this is an absence that exists reported as unprocessed. Same family
of bug, opposite direction.

## Reversal criteria

If a real, identified population of parcels exists whose `parcel_record`
identity is sourced from something other than `cad_property` (e.g., a
geometry-only or non-CAD source with propIds that structurally cannot key-match
this join), such that a "miss" for that population means a key-format mismatch
rather than a genuine absence — this ruling does not apply to that population,
and the fix needs a population-scoped guard rather than a blanket reversal.
Not investigated as part of this ruling; if the implementing Engine-lane work
finds such a population, stop and re-scope rather than applying the reversal
uniformly.

## Dependencies

Unblocks a clean landUseCode fill-state answer for OPS-19b item 20. Depends on
nothing else in this sprint. The actual fix belongs in hauska-engine's
TypeScript source (`packages/engine-core/src/parcel-record/ingest-existing.ts`)
followed by a re-vendor/re-pin into hauska-factory (`ENGINE_PIN.json`) — not a
hand-edit of the compiled `.js`, which this ruling does not authorize.

## Counterparties

Internal: Engine lane (implements), Factory lane (found and flagged, consumes
the re-vendored output for item 20), operator (ruling).
