---
decision_id: 2026-09-12_footprint_merge_421_count_before_acquiring
date: 2026-09-12
owner: Nick (operator); recorded by the integration seat
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-132, P-158, P-171)
  - _inbox/2026-09-11_p158-footprint_close.json
  - _inbox/2026-09-11_ops23_wave1_verify_p158.md
---

## Decision

The dispatch planner merges hauska-engine PR #421 (the staged-footprint absence label split
into three evidenced causes). Before anyone buys or loads a second footprint source, one
direct count of `tx_building_footprint` rows inside Bastrop city limits, and within 200 m of
the anchor parcel `48021:34049`, on the cortex store, decides whether the anchor absence is a
load gap in the staged layer or a coverage gap in the source. The unexplained 2026-09-07
production write is rowed for audit (P-171) and not chased by the footprint lane.

## Context

The P-158 lane found that finding F8 was stale on the day it was written (atoms for Bastrop
and Travis were minted 2026-09-07), that the nearest staged footprint to a downtown Bastrop
house built in 1906 is 1,615 m away, and that 85.7 percent of a 3,000-parcel Bastrop sample
has no candidate footprint in its envelope. The lane called that a source coverage gap.

## Reasoning

Microsoft's Texas building footprints run to roughly ten million polygons; a county seat's
downtown with no footprint inside 1.6 km reads as a partial load of the staged layer, not as
the source lacking the town. The second mechanism, a genuine source gap, is not ruled out and
is exactly what the count decides. Buying a second source before the count would pay for a
problem that may be a load. The label split is independent of either answer and correct on
its own; merging it now means the next writer run labels absences honestly.

## Reversal criteria

If the count shows the staged layer dense inside Bastrop city limits and still no polygon
within 200 m of the anchor parcel, the source gap is real and a second-source acquisition row
is opened; the label split stays either way.
