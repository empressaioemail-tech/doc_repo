---
id: 2026-07-31_C6_map_visual_hierarchy_and_pedestrian_close
title: Session close — C6 Phase 0A polish + FEMA/road/pedestrian (hand back to master planner)
date: 2026-07-31
type: session_close
status: closed
owner: c6-map-seat
audience: master planning agent
related: [40_hauska_map_3d_implementation_brief, _STATE, 2026-07-31_pedestrian_way_distinction_note, 2026-07-31_hauska_map_phase0a_visual_hierarchy_WDLL]
---

# Session close — C6 map visual hierarchy + pedestrian distinction

Filed: 2026-07-31  
From: C6 map/PE seat (this thread)  
To: master planning agent  
Re: Phase 0A polish closed; FEMA + roads + pedestrian-way distinction live and operator-accepted

## 1. Conversation summary

This seat continued Phase 0A after the initial taxonomy/cold-open ship (#122–#124). Operator visual QA drove a short polish loop on PE only (planner-owned Vercel deploys; no engine warm/setback changes except a light additive road-node flag). FEMA NFHL severity paint was made honest from real zone fields. Roads went from bulky wireframe corridor to hairline-at-distance / soft band when close. Pedestrian ways (footway/path/…) were separated at the atom level via the engine’s existing front-ineligible denylist and rendered as a distinct off-by-default CONTEXT layer. Operator closed the thread after accepting the brighter footpath paint (#129).

## 2. Decisions reached (operator-ruled)

1. **FEMA severity ramp from real NFHL only** — floodway > SFHA A/AE/… > X/X500. No proximity fabrication. Owner: operator. Reversal: only if NFHL attribute model changes.
2. **Road paint = band without edge/centerline wireframe; hairline when zoomed out** — city overview must not chalk. Owner: operator. Reversal: product call for true centerline-only.
3. **Pedestrian ways stay in the road twin; render separately** — `isPedestrianWay` from shared `FRONT_INELIGIBLE_OSM_HIGHWAY_TAGS` / `PEDESTRIAN_OSM_HIGHWAY_TAGS`. Render filter ≠ data filter (setback-decouple standing). Owner: operator + master planner (dispatch). Reversal: ingest-filter pedestrians out of road-nodes (explicitly rejected this wave).
4. **Pedestrian overlay off by default**, distinct khaki hue, more delicate than streets. Visibility polish accepted as “solid looks great.” Owner: operator.
5. **Basemap Carto dashes = GROUND follow-up, not this wave** — dotted sidewalks on the raster are not our overlay. QA must not confuse them with spine data.

## 3. What shipped (live)

| PR | Repo | What |
|----|------|------|
| #122–#124 | hauska-map | Phase 0A taxonomy, presets, live-parcels line-only |
| #125 | hauska-map | Light FEMA fill; defined road edges (superseded for roads) |
| #126 | hauska-map | Road band-only; FEMA NFHL severity ramp |
| #127 | hauska-map | Road hairline at distance + softer opacity |
| #197 | hauska-engine | `isPedestrianWay` on emit + near-bbox enrichment |
| #128 | hauska-map | Street band vs delicate pedestrian layer (off by default) |
| #129 | hauska-map | Brighter/thicker pedestrian paint (operator accepted) |

**LIVE INFRA (verify before quoting)**
- PE: https://property-explorer-xi.vercel.app/ — tip `#129` / `2d0a3a5`, deploy `dpl_4vtPwHp6…`
- Retrieval: `hauska-retrieval-api-00030-x7r` @100% (pedestrian flag enrichment)
- Paint authority: `packages/map-renderer/src/map/layer-role-taxonomy.js`
- Pedestrian denylist source of truth: `@hauska-engine/atoms` `PEDESTRIAN_OSM_HIGHWAY_TAGS` (re-exported as engine `FRONT_INELIGIBLE_OSM_HIGHWAY_TAGS`)

## 4. Open / follow-ups (for master planner)

1. **GROUND basemap dashes** — mute Carto road/path casings or roads-free basemap so leftover dotted OSM footpaths are not mistaken for our data. File: `_inbox/2026-07-31_pedestrian_way_distinction_note.md`. Not started.
2. **PE #118 hazard still live** — merge-base predates flood overlay; careless resolve reverts flood. Rebase + take main’s `flood-map-overlay*` wholesale. Owning seat: BDC/setback.
3. **Operator R6 live block-QA** — still owed before downtown cert restore (broader than this seat).
4. **Corpus re-emit not required** — near-bbox enriches `isPedestrianWay`; PE also falls back to `osmHighwayTag`. New emits carry the flag natively.

## 5. Explicit non-changes (do not re-open)

- Frontage / depth-warm / setback eligibility logic unchanged (only shared helper refactor for the denylist).
- Overpass still pulls all `highway=*`; pedestrians remain twin geometry.
- FEMA paint locked operator-good.
- Road hairline→band locked operator-good (before pedestrian work).
- No engine setback-decouple relitigation.

## 6. Artifacts

- `_inbox/2026-07-31_hauska_map_phase0a_visual_hierarchy_WDLL.md` (graded earlier in arc)
- `_inbox/2026-07-31_pedestrian_way_distinction_note.md` (basemap GROUND follow-up flag)
- `40_hauska_map_3d_implementation_brief.md` — Phase 0A marked DONE earlier
- This close: `_sessions/2026-07-31_C6_map_visual_hierarchy_and_pedestrian_close.md`

## 7. Pickup one-liner for master planner

C6 map polish thread **CLOSED**. Phase 0A + FEMA NFHL severity + road hairline/band + pedestrian `isPedestrianWay` (engine #197) + distinct off-by-default khaki footpath overlay (#128/#129) are live on PE and operator-accepted. Next map item if prioritized: GROUND basemap dash mute. Do not touch frontage/setback when touching road render. PE #118 flood-revert hazard still standing.
