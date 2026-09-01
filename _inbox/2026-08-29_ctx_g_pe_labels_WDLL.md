---
id: 2026-08-29_ctx_g_pe_labels_WDLL
title: WDLL — CTX card G: Property Explorer names stamp-missing and unmeasured
date: 2026-08-29
last_updated: 2026-08-29
status: approved
applies_to: hauska-map (apps/property-explorer/src/lib/layer-absence.ts and its callers)
plan_row: F-06
depends_on: card F (wire already emits the two verdicts), 2026-08-29_ctx_quality_WDLL item 2
operator_go: 2026-08-29
snapshot: hauska-map origin/main; PE isLayerAbsenceWire closed set is absent-verified | lookup-failed | not-applicable; stamp-missing and unmeasured fall through to "no zoning stamp here" / "Zoning not verified"
owner: planner-run subagent in P:/seat-worktrees/property/hauska-map-ctx-labels on seat/property-ctx-labels from origin/main. Produces the diff and tests. Does not commit, push, or deploy.
---

# CTX card G: the brief names the two states the wire already emits

Date: 2026-08-29  Status: approved

## Done looks like

A baked zoning wire with `verdict: stamp-missing` is accepted by `isLayerAbsenceWire` and the inspect / brief label is `stamp-missing` (or a named phrase that is not "no zoning stamp here" and not "Zoning not verified"). A wire with `verdict: unmeasured` is accepted and labeled `unmeasured` (same rule). The three existing verdicts still pass their fixtures. No Factory write. No bake.

## Acceptance items

1. **Closed set grows by two.** `LayerAbsenceVerdict` and `LAYER_ABSENCE_VERDICTS` in `apps/property-explorer/src/lib/layer-absence.ts` include `stamp-missing` and `unmeasured`. A fixture that is a well-formed absence wire with each new verdict is accepted by `isLayerAbsenceWire`. The same fixture with `verdict: bogus` still fails. Those two fixtures fail on origin/main and pass on the branch. | check: the two fail-then-pass tests | grade: [met 2026-08-29 planner: fail-then-pass on ed87e69 then e9e9581; 42 passed re-run]

2. **Labels do not collapse.** `zoningLayerToCardFacet` / brief path for a `stamp-missing` wire does not emit "no zoning stamp here" or "Zoning not verified". Same for `unmeasured`. Existing "no zoning stamp here" fixtures for the old decline path still pass. | check: layer-absence.test.ts plus the existing baked-facets / brief tests that name the old string | grade: [met 2026-08-29 planner: stamp-missing and unmeasured are the label; QA-3 decline unchanged]

3. **Handback.** Diff summary; test output for the files touched; `leave_behind`. No commit, push, deploy. | check: handback | grade: [met 2026-08-29; planner committed e9e9581 after review]

## Do not

- Commit, push, open a PR, or deploy. The planner does those.
- Touch Factory, LDT, or the bake.
- Import the SmartCity kit.
- Redesign the brief. This is the closed set and the label, not a chrome restyle.
