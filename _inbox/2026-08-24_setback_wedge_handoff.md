---
title: Handoff — setback wedge perf + visualization
status: active
date: 2026-08-24
from: integration planner session 2026-08-23
to: property seat (hauska-map + legacy-design-tools)
related:
  - _inbox/2026-08-23_setback_geometry_unification_WDLL.md
  - _inbox/2026-08-23_setback_geometry_unification_close.json
  - _scratch/setback-serve-wave.md
  - _scratch/_probe_setback_unify.mjs
---

# Handoff: setback wedge — perf + Simsbrook visualization

Filed: 2026-08-24  
From: integration planner (`P:/doc_repo`)  
To: property seat lane planner  
Re: SmartSite inspect slow + setback map visual missing on some parcels

## 1. Conversation summary

Option C setback geometry unification shipped and WDLL-closed: map wedge must come from cortex `labelEdges+derive`, not depth-warm facet geojson. Cortex [#467](https://github.com/empressaioemail-tech/legacy-design-tools/pull/467) and PE [#196](https://github.com/empressaioemail-tech/hauska-map/pull/196) merged and deployed. Live API probes passed for three regression parcels.

Operator then reported **no visible setback wedge** on smartsite.cloud and **very slow** "Reading this parcel…" on inspect. Investigation found PE #196 regressed the browser path: `buildable-envelope.js` sent `parcel_node_id`, cortex rejects it with **400 invalid_body**, so live derive never patched geojson onto the sheet. Card could still show warm **buildable %** from scalars while the map drew nothing.

Hotfix [#197](https://github.com/empressaioemail-tech/hauska-map/pull/197) merged and deployed (`b74cca1`, `dpl_4JRGkvaTVdhBeNmEQYdfekbSHqrg`). Post-deploy proxy: 908 Pine derive returns geometry; parcel_node_id in body still 400s (expected until cortex schema updated).

Operator pushback on Simsbrook: setbacks on card but "no amber fill" is not a product answer. Derive returns `no-buildable-area` (setbacks 25/7.5/20 consume the ~0.15 ac lot). Amber **fill** is correct to withhold; **setback lines or consumed-lot outline** are not optional when scalars are present.

## 2. Decisions reached

1. **WDLL Option C remains closed** — unified derive path is correct; customer-done blocked on map UX + perf, not on reverting Option C.
2. **`parcel_node_id` on POST is deferred** — PE must not send until LDT accepts it (proven 400 today).
3. **Next work is a new card under P-60**, not a silent WDLL amendment: (a) single derive per resolve, (b) drawable setback geometry for `no-buildable-area` when scalars exist.

## 3. Open questions

1. **What to draw when buildable area is zero but setbacks are known?** Per-edge offset lines from `labelEdges` output vs dashed full-parcel outline vs both. Route to property + operator taste on 48453:280239 live.
2. **Is Simsbrook `no-buildable-area` geometrically correct?** Probe says ringPts=0 with Pflugerville codified scalars. If wrong, fix is cortex derive, not PE overlay.
3. **Should card hide buildable % when live derive has no geometry?** Today warm % can disagree with map (honesty defect).

## 4. Artifacts

| Path | Purpose |
| --- | --- |
| `_inbox/2026-08-23_setback_geometry_unification_close.json` | WDLL close (deploy id amend **uncommitted**) |
| `_scratch/setback-serve-wave.md` | Tier-2 continuity + LESSON on parcel_node_id 400 |
| `_scratch/_probe_setback_unify.mjs` | Live probe script |
| `_sessions/2026-08-23_setback_geometry_unify_planner.md` | This session summary |

## 5. Live ground truth (2026-08-24)

| Parcel | PE proxy derive | Expected map |
| --- | --- | --- |
| `48021:34137` | `ok`, geo, BDC 30/10/30 | Amber inset wedge |
| `48021:34073` | `no-buildable-area` | Dashed outline or setback lines, not amber fill |
| `48453:280239` | `no-buildable-area` (use `17005 Simsbrook, Pflugerville TX` or coords) | Same; operator wants visible setback effect |

Timing (single pass, smartsite.cloud): facets ~700ms, derive ~400ms, gis-layer ~300ms; **resolver calls derive twice serially** today.

## 6. Paste prompt for next agent

```
READ FIRST: P:/doc_repo/_inbox/2026-08-24_setback_wedge_handoff.md, _scratch/setback-serve-wave.md, _STATE.md.

You are property seat. Worktrees: P:/seat-worktrees/property/hauska-map (main @ b74cca1), P:/seat-worktrees/property/legacy-design-tools (main @ 8c6d304f). Plan row P-60.

PICKUP: Post-#197 wedge hotfix is deployed but operator reports (1) inspect still slow — "Reading this parcel…" — and (2) Simsbrook has setback scalars on card but no satisfactory map visualization; "no amber fill" alone is not acceptable when setbacks exist.

ROOT CAUSES (verified):
- fact-sheet-resolver.ts calls fetchBuildableEnvelope TWICE per resolve (resolveGeometry + patchFacetsEnvelopeFromLive), serial after facets + gis-layer probe (~1.5–2.5s+).
- no-buildable-area parcels: derive returns ringPts=0; envelope-overlay only draws amber for ok or dashed full parcel if clickedParcelGeomRef is set; search path may not pass geom before onEnvelope.
- parcel_node_id still 400 on cortex POST — do not re-enable in PE until LDT schema lands.

TASKS (order):
1. Dedupe to ONE live derive per resolve; reuse result for geometry seed + facet patch. Target: card unblocks faster.
2. For consumed / no-buildable-area WITH setbacks: draw honest setback visualization (per-edge lines or setbackConsumedOverlay with parcel ring from sheet geometry, not only clickedParcelGeomRef).
3. Live-verify on smartsite.cloud after deploy: 48021:34137 (amber wedge), 48453:280239 (setback viz + card copy), 48021:34633 or 700 Hill (load time).
4. Optional LDT follow-up: accept parcel_node_id on POST; fix geocode_miss on full Simsbrook address.

Do not re-open Option C WDLL. File close amend to doc_repo when done. Deploy PE yourself; cortex only if LDT change.
```
