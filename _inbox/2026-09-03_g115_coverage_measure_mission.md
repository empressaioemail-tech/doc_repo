---
id: 2026-09-03_g115_coverage_measure_mission
title: Mission — G-115 item 3 (honest UDC coverage measurement)
status: active
last_updated: 2026-09-03
applies_to: plan-review
owner: nick
related:
  - _inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-09-03_g115_matrix_verify_mission
  - _inbox/2026-09-03_g115-matrix-verify_close
---

# Mission: G-115 item 3 — honest UDC coverage measurement, stated not assumed

Start card: `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md`. Item 2 (MET, A-109) proved the mechanism reaches real Pass/Fail through the `bastrop_tx` tenant. This item measures, against a small sample of real or representative Bastrop submittal types, what fraction of a genuine review lands as real Pass/Fail versus typed absence — so adoption risk is a known, specific number before staff are asked to use this, not discovered after.

## What "done" means, and a correction found before running the sample

The WDLL's check text asks to report "the coverage ratio and the specific missing section numbers" — phrased as if the gap is sections not yet ingested. **Check the real chain data before assuming that shape.** Query `get_property_atom_chain` (anonymous-ok, `hauska-mcp-server`, tool `get_property_atom_chain`) for at least two real Bastrop parcels in different zoning districts and read the `zoning-fact` atom's `codeSectionRefs` in full, not just the two fields `mcp.mjs` happens to consume.

If (as a first pass on parcel `48021:34737` suggests) the real chain data references exactly two UDC sections and both are already in `CODE_BOOKS["BASTROP-UDC"]`, the "missing section numbers" framing is wrong — section-level coverage is 100%, not a gap. The real gap, if any, is more likely inside the `setback-rule` atom itself: it carries several real, already-fetched, ordinance-sourced numeric fields (check for `front`, `side`, `rear`, `sideInteriorFt`, `sideCornerFt`, `maxHeightFt`, `minLotSize` or equivalents) beyond the one (`front`) `adjudicateMinimumSetback` currently tests. Measure how many of those real fields are ever compared against anything, not how many sections exist.

Also check `src/store.mjs`'s `seedMatrix` (called from every route that runs a matrix) for whether `engagement.projectType` is ever passed into `matrixFromChain`'s options. If it is not, the WDLL's "N submittal types" framing needs a named correction too: coverage would not vary by declared submittal type at all, and the honest report is that invariance, demonstrated live (create real engagements with different `projectType` values on the same and different parcels, confirm the matrix shape is byte-identical), not a fabricated per-type breakdown.

## Steps

1. Query `get_property_atom_chain` directly (`POST https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp`, tool `get_property_atom_chain`, no key needed — this tool is anonymous-ok per A-094) for at least 2 real Bastrop parcels in different zoning districts. Record each parcel's district, full `codeSectionRefs`, and full `setback-rule` atom (every numeric field, not just the ones `mcp.mjs` reads) — including any `displayMeta`/second-source notes already present on the atom.
2. Confirm via source read (`src/store.mjs`, `src/server.mjs`'s `seedMatrix`) whether `projectType` reaches `matrixFromChain` at all.
3. Pick N=4 representative submittal types (e.g. new single-family residence, residential addition, accessory structure, commercial change of use) and actually run each through the live matrix — real engagements via the production BFF path, not a thought experiment — split across the two sampled parcels/districts. Record the section/determination/citation shape for each.
4. Report the coverage ratio at EVERY level that's true and load-bearing, not collapsed into one bare percentage: section-reference coverage, section-adjudication coverage, within-section dimension-adjudication coverage, and submittal-type invariance (or variance, if the source read in step 2 turns out wrong). Name every specific dimension/section involved, not just a count.
5. If the setback-rule atom's own second-source note reveals an unresolved data conflict on the dimension being adjudicated, name it explicitly — it bears directly on whether the one adjudicated dimension is even checked against the authoritative number.

## Scope boundary

This item measures; it does not build. Do not add adjudication logic for the newly-identified dimensions (side setbacks, rear, height, lot size) or wire a use-permissibility check for `14-02-008` — that is real, scoped follow-on work this item's own findings will motivate, not something to improvise inline. Do not touch `smartcity-os`. Do not start item 6 (depends on this item's result plus the operator's own action).

## Close

Report per the standing dispatch/close-artifact convention, with every coverage figure carrying its denominator explicitly (per `DEV_PROCESS.md`'s "coverage figures travel with their denominator" rule).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-03_g115-coverage-measure_cp1.json
  CP2: _inbox/2026-09-03_g115-coverage-measure_cp2.json
  CLOSE: _inbox/2026-09-03_g115-coverage-measure_close.json
