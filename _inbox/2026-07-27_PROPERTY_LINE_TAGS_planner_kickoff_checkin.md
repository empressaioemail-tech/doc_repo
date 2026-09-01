---
id: 2026-07-27_PROPERTY_LINE_TAGS_planner_kickoff_checkin
title: Check-in — PROPERTY-LINE-TAGS kickoff (Bastrop; depth untouched; CTX HELD)
status: check-in
date: 2026-07-27
planner: depth-engine planning agent
---

# PROPERTY-LINE-TAGS kickoff

Bounded add on the boundary primitive. Does **not** touch depth. CTX HELD.

## Gap (verified)

- Boundary edges store `interior.edgeEndpoints` but **no** `propertyLineTags` yet (`boundary-instances.ts`).
- CC AtomInspector already renders `propertyLineTags` + "not a survey (GIS-approx)" pill when present — currently empty.
- Site-plan PDF already computes GIS bearing+distance at render via `formatGisBearing` / honesty line — **reuse**, do not fork.

## Gold verify set (planner after land)

`48021:28286`, `48021:33512`, `48021:34785` — paste tags for one parcel; opposite-side ~parallel on 28286; honesty on CC + PDF.

## Artifacts

- WDLL: `_inbox/2026-07-27_PROPERTY_LINE_TAGS_bastrop_WDLL.md`
- Dispatch: `_dispatches/2026-07-27_PROPERTY_LINE_TAGS_bastrop.md`
