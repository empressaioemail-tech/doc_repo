---
id: 2026-07-25_R0_2_zoning_stamp_from_atom_chain
title: Dispatch — R0.2 unstick live envelope (read baked district when GIS zoningCode absent)
status: active
date: 2026-07-25
applies_to: [legacy-design-tools]
planner: depth-engine planning agent
cites:
  - 27c WDLL 1 (live verify blocked)
related: [_inbox/2026-07-25_R0_1_verify_and_merge_checkin, _scratch/depth-engine-27c]
---

# R0.2 — live envelope unblock (zoning from atom-chain / facets)

## Why

R0 geometry is merged and serving (`cortex-api-00436-wuc` @ 100%). Live WDLL 1 still blocked:

```
POST .../buildable-envelope {"address":"714 Spring St, Bastrop, TX 78602"}
→ declined no-zoning-stamp; parcel.zoningCode null
GET .../place/node/48021:33512/facets → zoning.district "P-5"; envelope null
```

Root: derive path stamps district from GIS polygon `zoningCode` props only. Baked Tier-1 facets already carry `P-5` on the ledger. Decline is honest for empty GIS props but wrong when the spine already has a district.

## FLEET MEMORY (M0)

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Do not self-promote. Read scratch first.

## Scratch

```
GROUND-TRUTH (2026-07-25): R0 merged 63bd82eb; serving cortex-api-00436-wuc @ 100%; canary boot OK; polygon-clipping live.
GROUND-TRUTH: 714 Spring POST declines no-zoning-stamp; facets district P-5.
DEAD-END: esbuild conditions beyond ["workspace"] boot-crash.
```

## Required

In `brokeragePlaceBuildableEnvelope.ts` (and only as needed in derive helpers):

1. When GIS `parcel.zoningCode` is absent/blank, resolve district from the existing atom-chain / node-facets bake for that `parcel_node_id` (same source facets already serve). Provenance must say the district came from the baked chain, not from GIS props.
2. Do NOT invent a district when both GIS and bake lack one — keep `no-zoning-stamp` decline.
3. Do NOT weaken absent-zoning honesty for true absence.
4. Add a test: fixture/mock where GIS zoningCode null + bake district P-5 → derive proceeds (not declined no-zoning-stamp).
5. PR on green CI. Do not merge; planner verifies live on canary then shifts.

## Out of scope

R1 road nodes, R2 descriptor road-class tables, setbutton value re-transcription, broadening esbuild conditions.

## Planner verify

Canary POST 714 Spring returns a non-empty GeoJSON ring; planner checks containment/non-self-intersection via geometry gate (or inspect ring). Then shift.
