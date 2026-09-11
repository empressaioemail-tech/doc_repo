# OPS-21-S2 (P-133) — CP1 addendum: buildableArea design overruled

CP1 (`2026-09-11_ops21-s2_cp1.json`) proposed writing `buildableAreaSqFt`/`buildableAreaPct`/
`envelopeStatus`/`envelopeDisclosure` as disclosed, low-confidence `value` cells via a faithful
port of legacy-design-tools' shape-only edge-labeling tier (`geometry.ts` + `edgeLabeling.ts`).

**doc-repo-4a objected, in-flight, before any code was written for that pair.** Two independently
verified citations:

- `scripts/plan-progress.mjs`'s own D1/`landUseDescription` comment (already read by this lane
  before the objection arrived, not taken on the peer's word): a value that exists in reality but
  whose lookup/input is missing must stay `unaccounted`, never `absent-verified` — D1 was
  forbidden from writing even the weaker state. `buildableAreaSqFt` is structurally identical
  (the missing input is road-frontage/OSM edge data, not the area fact itself), so a `value` cell
  fails the same test *a fortiori*.
- `doc_repo/ENFORCEMENT.md` lines 67-68 ("Watch for unaccounted counts falling without a matching
  acquisition landing — that is relabelling") and line 78 ("Widening a check to admit a value that
  does not satisfy its meaning is permitted only when a detector exists and something fails when
  the admitted value reaches a consumer that treats it as valid... An exported detector that
  nothing calls in a gating position is a starved mechanism") — both quoted verbatim, confirmed by
  this lane against the live file.
- Additional, correct catch: `envelopeStatus`/`envelopeDisclosure` are independently-counted
  `ENVELOPE_RAILS` members in `plan-progress.mjs`, not inert metadata beside the value — so the
  shape-only design would have filled 4 of 8 rails on a guessed front edge, not 2.

**Adopted.** This lane does not write `buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`,
or `envelopeDisclosure` at all — no code path in `parcel-envelope-cells.mjs` touches those four
rail keys. They remain `unaccounted`, which is the honest, default, at-rest state per the six-state
vocabulary. Not porting `geometry.ts`/`edgeLabeling.ts` either, since there is nowhere to land
their output right now; citation preserved here for whoever builds the real road-aware writer once
OSM/road-frontage acquisition exists: legacy-design-tools `artifacts/api-server/src/lib/
buildableEnvelope/{geometry.ts,edgeLabeling.ts}` at `cebd041d7ddf102f29ab60eeb9feb04946888125`.

Proposed (not yet landed by this lane, to avoid colliding with doc-repo-4a's own concurrent edits
to this program's canon) register row for `90_operations/OPS-21_serve_completion_program.md`'s
Phase 3P table:

| 3P-14 | `buildableAreaSqFt`/`buildableAreaPct`/`envelopeStatus`/`envelopeDisclosure` have no road-frontage input. The only tested inset engine (envelope-saga, 2026-08-07) needs OSM-derived edge labeling; this job has no acquisition for it. A shape-only guess was proposed and correctly overruled (OPS-21-S2 CP1 + doc-repo-4a's objection, 2026-09-11) | ENFORCEMENT: unrepresentable state made representable, not sentinel-encoded; ruling on a new "computed by approximation, required input absent" state is pending with the operator | **OSM/road-frontage data being acquired**, or the operator ruling on the approximation-state question resolving either way | property |

**Revised scope for this lane, effective now:** `parcelAreaSqFt` (real geometry, ST_Area via the
established `ST_MakeValid(ST_Union(...)) GROUP BY prop_id` pattern `parcel-max-impervious-
cover.mjs` already uses — no new geometry port needed, since this rail was never the disputed
one), `maxHeightFt` + `maxLotCoveragePct` (direct corpus district lookups reusing S1's own
`getSetbackTableForZoning`/`mapDistrict`, `not_specified`-gated), `maxFootprintSqFt` (derived:
`parcelAreaSqFt x maxLotCoveragePct / 100`, only when both inputs are `value`). This lane's own
completion reconciliation will report the buildableArea-pair residual as its own named class,
separate from the zoningDistrict-blocked deferred class the dispatch anticipated.
