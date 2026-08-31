---
id: 2026-07-31_pedestrian_way_distinction_note
title: Pedestrian-way distinction shipped + basemap-dash GROUND follow-up
status: active
date: 2026-07-31
applies_to: [hauska-engine, hauska-map]
owner: planner
---

# Pedestrian-way distinction (C6 follow-up)

## Shipped
- Engine: `isPedestrianWay` on road-node atoms from shared `PEDESTRIAN_OSM_HIGHWAY_TAGS` / `FRONT_INELIGIBLE_OSM_HIGHWAY_TAGS` (no second taxonomy; no re-ingest).
- Retrieval near-bbox enriches the flag for existing corpus.
- PE: street grey band excludes pedestrians; separate khaki dashed delicate layer `pedestrian-ways`, **off by default**.
- Frontage / warm / setback untouched (render filter ≠ data filter).

## FOLLOW-UP (not this wave) — GROUND basemap dashes
Operator-visible dotted sidewalks/footpaths on Carto/OSM **raster basemap** are GROUND-role, not our overlay. Mute basemap roads / roads-free basemap is a Phase 0A GROUND-paint follow-up. QA must not read leftover basemap dashes as "our data" after the pedestrian overlay ships.
