# WDLL — P-60b: buildable-envelope inset gate fix + frontage labeling

status: operator-approved (verbal go 2026-08-23 ~21:55 CT, "go, spawn subs and manage it through completion")
plan_row: P-60 (setback correctness follow-on, card b)
repo: legacy-design-tools, branch feat/setback-geometry-unified-derive @ 15df5a56
forensic basis: P:/tmp/simsbrook_forensics/ and P:/tmp/inset_audit/ (2026-08-23), parcel 48453:280239

## Observable end state

A parcel whose setbacks do not consume it never reports `no-buildable-area`. Simsbrook
(48453:280239) serves a buildable wedge of approximately 3,074 sq ft (front 25 ft applied
along the entire segmented frontage curve). A geometry-validation failure is reported as a
validation decline, never as "setbacks exceed the lot."

## Acceptance items (execution order, dependencies named)

1. In `geometry.ts`, `insetIsDegenerate` and `geometryCorrectnessGate` no longer call
   `ringHasSelfTouch` / `perEdgeOffsetPlausible` as rejection grounds. Replacement is a
   conservation check from clip outputs already in hand: (a) area(inset ∩ forbidden strips)
   < ε, (b) |area(parcel) − area(forbidden ∪ within parcel) − area(inset)| < ε. Verified by
   violation: an unclipped (raw parcel) ring injected as the "inset" fails the check.
2. `emptyReason` is split: consume-lot wording ("setbacks exceed the lot") is emitted only
   when the boolean clip itself returns empty; any gate rejection returns a distinct
   validation-decline status/reason on the wire. Checkable by forcing a gate failure in a
   test and asserting the reason string.
3. Contiguous near-collinear edges (turn angle below threshold) are grouped before labeling
   so a digitized frontage curve takes `front` as one edge. Checkable: Simsbrook local run
   labels edges 0–6 all front-25, buildable ≈3,074 sq ft (±5%) against
   `P:/tmp/simsbrook_forensics/truth_envelope_ring.json`.
4. Tests added with GIS-realistic rings: many-collinear-vertex rectangle (30 pts), chamfered
   corner (short edge), segmented curved frontage, clockwise input ring. All pass; the
   pre-fix code demonstrably fails at least the collinear-vertex case (regression proof).
5. Corner trust gate requires the second street to adjoin the parcel edge (distance bound
   tightened from 45 m blanket to actual adjacency tolerance), depends on item 3 landing
   first so frontage grouping does not shift edge indices under it. Simsbrook may lose the
   side_corner 15 (Dashwood Creek is 142 ft away, non-adjoining); acceptance is the note no
   longer claims a resolved corner there.
6. Post-deploy live re-grade: cortex probe on 48453:280239 returns a wedge (~3,074 sq ft) and
   PE inspect shows it; 48021:34073 (Bastrop, prior "honest-empty" grade) re-probed and
   re-graded with the new reason wire; grades recorded in the close.

## Close grading (2026-08-24T03:50Z, same card re-graded item by item)

1. **MET.** `ringHasSelfTouch`/`perEdgeOffsetPlausible` deleted; conservation gate
   (strip-exclusion + area decomposition vs dominant remainder, ε = max(0.5 m², 0.5%))
   in both `classifyInset` and `geometryCorrectnessGate`. Verified by violation:
   parcel-ring-as-inset fails both grounds (test in geometry.test.ts).
2. **MET.** `emptyKind` (`invalid-input`/`consumed`/`validation-failed`) on props and
   wire; route emits `no-buildable-area` only on `consumed`, else
   `geometry-validation-failed`. Forced-gate-failure test asserts the reason split.
   PE verified to treat the unknown status as honest decline (buildable-envelope.js L206).
3. **MET.** Grouping at 20° joint / 45° cumulative; asserted 1:1 expansion
   (`expandGroupLabelsToEdges` throws on misalignment, 5 violation tests). Simsbrook
   local: edges 0–6 all front-25, live derive 3,074.1 sqft — matches
   `truth_envelope_ring.json` to 0.1 sqft (well inside ±5%).
4. **MET.** 30-collinear-vertex rect, chamfered corner, 8-segment curve, real
   Simsbrook ring (raw-CW, exercises CCW path) all added; 3 regression tests proven
   FAILING on parent commit `15df5a56` with the false consume-lot verdict. One
   caveat recorded honestly: the chamfer case passed pre-fix (old 0.95 skip exempted
   it); the probe false-fire class is covered by the collinear-vertex case instead.
5. **MET.** `CORNER_ADJOIN_MAX_M=25` on corner resolver, possible-corner wording, and
   road-class attach (same-primitive sweep); genuine corner at 12 m still resolves,
   35 m non-adjoining rejected. Simsbrook note carries no corner claim; confidence
   0.90 (fabricated-corner cap gone).
6. **MET (API); operator visual owed.** Live post-shift: cortex + PE proxy serve
   280239 ok 3,074 sqft/45.4% ringPts=21; 34073 ok 3,511 sqft/38.9% ringPts=6
   (prior "honest-empty" grade re-graded FALSE NEGATIVE); 34137 unchanged ringPts=5
   (no regression). Serving revision `cortex-api-00562-siv` @100%, traffic read by
   JSON field name. Map-paint visual QA remains with the operator.

Suite: 94/94, tsc clean. PR [#468](https://github.com/empressaioemail-tech/legacy-design-tools/pull/468), merge `5299bb9d`.

## Leave-behind

- item: pre-existing baked-facets envelopes with area but ringVerts=0 fail
  `scripts/product-surface-smoke.mjs` envelope.sanity (34073/34785/34017) —
  not introduced by this card, surfaced during its verification
  owner: property seat
  plan_row: P-60 backlog (bake rings or teach instrument the baked/live split)
- item: `_probe_setback_unify.mjs` deploy-snapshot line reads stale cortex sha
  owner: property seat
  plan_row: P-60 backlog
- item: forensic artifacts P:/tmp/simsbrook_forensics/, P:/tmp/inset_audit/
  (reference material, not durable state)
  owner: property seat
  plan_row: none (disposable)
