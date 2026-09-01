---
id: 2026-08-24_cp2_sheet_seal
title: CP2 — planner review of Agent A + Agent B
date: 2026-08-24
plan_row: P-60
---

# CP2

Read diffs on `P:/tmp/hauska-map-sheet-seal`. Re-ran tests. 192 passed.

Agent A: declined + matching placeKey seals `kind: sheet` / `not-derived`. Unplaceable no longer sets `env.status=error`. `envelopeStateFromSheet` maps not-derived to idle, not error. GIS/envelope hops bounded at 4s.

Agent B: `inspectAsSoonAsIdKnown` calls inspectInPlace before awaiting setSubject. Miss/unplaceable still leave previous subject.

Violation: old unplaceable → facets-load-error. New helper `showsFacetsLoadError` false for unplaceable, true for failed.

Ready to commit / PR / deploy.
