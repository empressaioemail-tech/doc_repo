---
id: 2026-07-27_PROPERTY_LINE_TAGS_bastrop
title: Dispatch — Computed property-line-tags on Bastrop boundary edges
status: closed
date: 2026-07-27
applies_to: [hauska-engine, hauska-map]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [_inbox/2026-07-27_PROPERTY_LINE_TAGS_bastrop_WDLL.md]
cites: [WDLL 1-6]
closed_by: _inbox/2026-07-27_PROPERTY_LINE_TAGS_planner_verify_checkin.md
related:
  - _scratch/depth-engine-27c.md
  - _inbox/2026-07-27_bastrop_composition_inventory.md
---

# PROPERTY-LINE-TAGS — Bastrop (bounded add; does NOT touch depth)

You are the EXECUTOR. Build on branches from **current main**. Open PR(s) on green CI. Return a close with evidence + M0 scratch. Do NOT self-grade done. Planner verifies LIVE and owns M0 promotion. **CTX HELD. Do not run depth-warm promote. Do not open Hays/CTX.**

## FLEET MEMORY (M0)

Capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read scratch FIRST. Do NOT promote MEMORY.md yourself.

## Scratch context (start warm)

```
BOUNDARY PRIMITIVE (baked):
- property-boundary-edge atoms already store interior.edgeEndpoints [[lng,lat],[lng,lat]]
  + inwardNormal + role/adjacency/setback. Bastrop boundary_edges ≈ 26454.
- Compute path: boundary-primitive/compute.ts → persist → CC serves via
  /property-nodes/:id/boundary-edges and /nodes/:id
- CC AtomInspector ALREADY has propertyLineTags slot + "not a survey (GIS-approx)"
  pill — currently empty ("No property-line-tags… Amendment 2"). FILL THE ATOM FIELD.

PDF (Track B — already):
- formatGisBearing / formatPropertyLineTag in site-plan/pdf/annotation-placement.ts
- Honesty: "GIS-approximate from county parcel ring — not a boundary survey"
- REUSE this compute (extract shared helper if needed). Do NOT invent a second
  bearing formula that can drift from the PDF.

DEAD-END: presenting GIS tags as survey-grade (FAIL). Survey = courthouse/plat = v2 OUT.
DEAD-END: touching depth-warm promote / changing depth ratio for this work.
GOLD: 48021:28286 (near-rect ~60×137), 33512, 34785.
```

## What to build

1. **Shared GIS tag compute** from edge endpoints (WGS84 → local ENU or same projection PDF uses) → bearing DMS N/S _ E/W + distance feet. Prefer lifting `formatGisBearing` / length into a shared module consumed by boundary-primitive AND site-plan PDF.

2. **Atom field** on `BoundaryEdgeAtomInstance` / contract shape:
   ```
   propertyLineTags: {
     bearing: string;          // e.g. "N 12°34' E"
     distanceFeet: number;
     provenance: {
       kind: "gis-approximate";
       honesty: "GIS-approximate — not a survey";
       source: "county parcel ring / txgio";
     };
   }
   ```
   Or equivalent; honesty string must be machine-checkable.

3. **Emit on compute** in `computeBoundaryEdgeAtoms` (and any backfill script for existing Bastrop edges). Backfill Bastrop boundary edges that lack tags (gold parcels minimum; prefer full Bastrop edge set if cheap).

4. **Mechanical guards:**
   - Vitest: 28286-class near-rect opposite sides reciprocal bearings + distances match ring (±tol).
   - Vitest: honesty present; RED if output claims survey-grade without GIS-approx negation.
   - PDF continues to show honesty; prefer same helper so numbers match atoms.

5. **CC:** no UI invent if AtomInspector already reads `propertyLineTags` — verify the live field populates. Only touch map/CC if the field name needs wiring.

## Out of scope

- Depth-warm promote / depth ratio changes
- Survey / plat / courthouse extraction (v2)
- CTX / Hays / other counties (Bastrop only for this land; helper may be jurisdiction-agnostic)
- Weakening geometry / front-labeling gates

## Close deliverable

```markdown
## WDLL grades (self-proposed — planner verifies)
1–6 …

## Pasted tags (one gold parcel — all edges)
48021:_____ edge0 … edgeN

## PRs + SHAs
## Scratch LESSON / DEAD-END / GROUND-TRUTH / OPEN
```

## Done when

PR(s) green; close filed. You do NOT verify done — planner does.
