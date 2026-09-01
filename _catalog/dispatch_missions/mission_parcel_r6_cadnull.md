# Mission — R6: the cad-null-verified emission in the engine module

Spec: `_decisions/2026-09-01_cad_null_verified_semantic.md` (the operator ruling; read it
in full) plus gap ledger section 9. Engine-only, `packages/engine-core/src/parcel-record/`.

`ingestCadOntoRecords` gains a typed emission: matched latest CAD row + null/blank scalar
CAD field -> `absent-verified` with basis `{source: cad_property, countyFips, propId,
taxYear, vintage}`. A JOIN MISS NEVER FIRES IT — join-starved cells stay unaccounted; the
scoping must be structural (the emission only reachable from the matched-row branch), not
a runtime check that can be bypassed. $0 semantics unchanged (value 0). living_area 0
stays unaccounted (module's existing >0 rule) — do not widen it on this card.

Tests: (a) matched row + null field -> absent-verified with the full basis; (b) no
matched row -> unaccounted, and construct the Williamson-shaped fixture (value exists
under a different key) proving it CANNOT fire; (c) blank-string field behaves as null;
(d) re-ingest idempotency: value -> stays value, absent-verified -> stays absent-verified
on identical input; (e) existing suite green. PR on its own branch, merge on green
(conclusion string, current base), report the merge SHA — R6B pins it. schema.sql
untouched. No store writes.
