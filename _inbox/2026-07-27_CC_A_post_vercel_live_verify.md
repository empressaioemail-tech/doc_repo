---
id: 2026-07-27_CC_A_post_vercel_live_verify
title: CC-A post-Vercel live verify — Amendment 1 walk MET
status: checkin
date: 2026-07-27
applies_to: hauska-map/apps/command-center
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: nick
related:
  - 2026-07-27_CC_A_all_units_planner_rollup
---

# CC-A post-Vercel live verify

Deploy: production `cmdcenter` → https://cmdcenter-blush.vercel.app from
hauska-map main `91c6268` (worktree deploy; bundle `index-BTKuoNXu.js`).
Retrieval already live: `hauska-retrieval-api-00033-wom` @ 100%.

Planner live walk 2026-07-27 ~13:36–13:40Z (cache-bust `?v=cca2`…`cca4`).

## Amendment 1 walk (WDLL 2) — MET

On Node & Graph, gold `48021:28286`:

1. Parcel card: structured (not raw-JSON primary); clickable edges
   `boundary:0–3` with role / adjacency / setback labels.
2. Click `boundary:2` → card with ROLE front, ADJACENCY ROW, SETBACK 15′,
   NEIGHBOR 35671, FACING_ROAD `48021:road:123456789`, plus
   "GIS-approx edge geometry — not a survey."
3. Edge buttons: `out → faces-road · 48021:road:123456789` and
   `out → adjacent-parcel · 48021:35671`.
4. Click road → `road-node 1` family pill; click neighbor → parcel
   `48021:35671` with five boundary edges + family pills
   (property-boundary-edge 5 / envelope / setback / zoning).

## WDLL 3–5 — MET

- Family pills → NodeAtoms list (8 atoms on 35671; 1 boundary-edge on
  `…:boundary:2`).
- Atom inspector on
  `did:hauska:property-boundary-edge:48021:28286:boundary:2`:
  CONFIDENCE object `{n:0, width:0.22, basis:seed}`; provenance;
  bitemporal; BOUNDARY PRIMITIVE role/adjacency/setback/interior;
  hash carries `return=node-graph&node=…`.
- `← back to node` restores `#panel=node-graph&node=…` (also verified
  zoning-fact on 35671).

## WDLL 6 — MET (unchanged)

API walk already graded; still live under BFF.

## WDLL 7–9 — MET / honest-DEGRADED

| Item | Observation |
|---|---|
| 7 Map | Site Analysis: MapLibre + Fixture layers chrome (shared PE path); not CARTO-only fork copy. |
| 8 Parcel Trace | Nav badge **LIVE**. Resolve 1101 Colorado → placeKey + honest-0 atoms. |
| 9 Revenue Meter | Nav **DEGRADED**. Panel: `platform_internal_required` / 403; named fix path; never lying LIVE. |

## WDLL 1, 10 — MET

Structured cards for parcel / boundary-edge / road; badges mechanical
(LIVE vs DEGRADED). Property-line-tags not shipped (Amendment 2 optional);
survey disclaimer present on boundary card.

## Quirks (non-blocking)

- Hash sometimes rewrites `lat=null&lng=null` while `node=` still appends.
- Tally / inspect can take ~20–25s on cold load.
- Hard reload / `?v=` needed once after deploy (CDN cache).
