---
id: 2026-07-28_pe_cc_qa_and_reports_spec
title: PE + CC QA + property-brief-in-PE + drawings-export + CC linkage — spec for a fresh planner
date: 2026-07-28
status: spec (for a fresh planning agent to execute planner-manages-subs)
owner: nick
related: [_STATE.md, 2026-07-27_bastrop_qa_defect_register, 2026-07-27_app_vs_cc_report_audit, 27f_bastrop_through_v2_program]
note: operator PAUSED adding new CC complexity — this spec is polish/fix/port + the brief-into-PE, NOT new CC functions. The broader report/function build stays HELD.
---

# PE + CC QA + brief-in-PE + drawings-export + CC linkage

Operator findings 2026-07-28, from live PE + CC. This is the next planner's work: polish/fix/port, planner-manages-subs, verify live, deploys planner-owned, standing decisions travel in every sub-dispatch. NO new CC complexity (operator paused that); the wider report/function program stays HELD.

## A. PROPERTY BRIEF INTO PE (the flagship — port + scrub)

CURRENT (broken): PE's "Property Intel brief" renders as raw JSON/markdown (zoning/setbacks/flood/land-use objects dumped). Screenshots 2026-07-28. The CONTAINER in PE is fine; the CONTENT is wrong.
TARGET: port the real ("Alder") property brief renderer — it lives in legacy-design-tools (`artifacts/api-server/src/lib/briefingHtml.ts` + `briefingPdf.ts` + `routes/parcelBriefings.ts`). Put THAT brief into PE's existing brief container.
REQUIREMENTS:
- SCRUB + VERIFY the brief reads and functions correctly (it's being ported across apps — verify every section reads the right atoms, no dead fields, no fabrication).
- More COMPREHENSIVE + LAYMAN-contextualized (not raw JSON — human-readable prose + cited facts, the "sell reasoning not data" format: value + source + confidence + timestamp, rendered nicely).
- Formatted to look NICE (professional, not a data dump).
- CLOSE the brief (dismiss the panel) + EXPORT to PDF when done.
Verify live on multiple Bastrop parcels (a zoned one + an unzoned/no-stamp one — see item D).

## B. SITE-PLAN EXPORT — still blocked + add drawings/aerial

TWO parts:
1. FIX THE BLOCK (open in _STATE): "Site-plan export needs an engine-api gate token (HAUSKA_ENGINE_API_KEY) / gate-front context not set or not accepted." The customer CANNOT export a site plan. This is the PE→engine export auth path — the gate token/gate-front context isn't wired on PE prod. Diagnose + fix so export works. (Deploys planner-owned.)
2. ADD: export the DRAWINGS + AERIAL VIEW WITH the site plan. Operator wants the aerial imagery + the drawn overlays (parcel, envelope, roads, contours) exportable together with the site-plan sheet, not just the vector site plan. (Aerial imagery is now available — see the public-data recon; Esri/Maxar is the current basemap.)

## C. CC MAP LINKAGE — the new map lost the old map's binding

DEFECT: in CC, the new map does NOT link everything together like the old one did. When you click a property on the map, it should POINT ALL OTHER COMPONENTS to that property (the Node & Graph, inspect, atoms — all should focus the clicked parcel). This is the map→node binding that F1/CC-A was supposed to preserve and the new map dropped.
FIX: clicking a parcel on the CC map opens/focuses the Node & Graph to that property node (and any other bound panels). Bidirectional with item D's node→map.

## D. CC NAVIGATION — county → roster → node → atoms → atom, with back-nav

Operator's target CC flow (this is the QA-CC-PORT already in the register, stated concretely):
- Click a COUNTY → the county OPENS → see its ROADS + PARCEL NODES.
- SEARCH by multiple identifiers (address, APN/prop_id, node_id, road, etc.).
- Click a NODE → it opens → shows ALL its ATOMS.
- Click an ATOM → it opens (full inspector: claim + confidence n/width/basis + provenance + bitemporal + lineage).
- BACK-NAV button → step all the way back to the main screen (the county list).
- Plus item C: click a parcel on the map → Node & Graph opens to that parcel's node.
NOTE: this is the faithful port of the Trading Control Tower flow (reference: `/p/Empressa Trading` NodeGraphBrowser.tsx + AtomInspector.tsx) — already scoped as QA-CC-PORT in the register. The spine currently serves NO node-list endpoint (GET /nodes, /property-nodes 404 — visible in the CC "browse by id, honest-empty" state), so the county→roster→node browse likely needs a spine LIST endpoint added (same stranded-data pattern as CC-A boundary edges: the data exists, no list route to browse it). Diagnose: does the county-roster/node-browse need a new retrieval list endpoint?

## E. THE "9% ZONED" LABEL — honest, but reads alarming

CONFIRMED CORRECT (not a bug): Bastrop shows 9.27% zoned = 5,769 zoning-facts-with-district / 62,257 nodes. Per memory `zoning-coverage-is-wired-city-not-data`: most of Bastrop COUNTY is unincorporated = legitimately unzoned (TX counties don't zone unincorporated land; only cities zone). So ~90% unzoned is TRUE. BUT the CC label "9.27% ZONED" without context reads like a failure.
FIX (labeling, not the number): distinguish CITY-zoned vs COUNTY-unincorporated so the number is honest AND not alarming (e.g. "9.27% zoned — mostly unincorporated county land, legitimately unzoned" or split city/county denominators). Do NOT change the number; fix the framing.

## F. HYDROLOGY DEGRADED — possibly a topo-swap byproduct

DEFECT (open in _STATE): "Flow lines degraded — hydrology: HTTP 504." OPERATOR HYPOTHESIS: this may be a byproduct of swapping out the topo (config-to-1m + 1-ft contours changed the DEM the hydrology D8 flow derives from). DIAGNOSE: did the topo fidelity change (finer DEM / different resolution / bbox cap) break or time-out the hydrology flow computation? The D8 hydrology reads the DEM — a finer/larger DEM could blow the 504. Fix so hydrology computes again (may need bbox/resolution tuning on the hydrology path to match the new topo).

## G. LAND USE + ACREAGE (from _STATE)

The inspect card shows "not verified here" for land use and acreage. BUT the brief screenshot shows land-use IS available (code A1, cad-roll, "Single-family residential"). So land-use exists in the brief atoms but isn't surfaced on the INSPECT CARD. Acreage likewise should be derivable/available. Surface both on the inspect card (land use from the cad-roll atom already present; acreage from the parcel geometry or the appraisal roll).

## ADJACENT-PARCEL INCONSISTENCY (operator noted)

Screenshots show one parcel with zoning+setback info and its neighbor with "no zoning stamp here / not verified." This is the honest wired-city-stamp gap (some parcels stamped, adjacent ones not). Not necessarily a bug — but VERIFY it's honest-absence (the neighbor genuinely lacks a zoning stamp) vs a stamping gap that should be filled. Tie to item E's framing.

## WHAT IS HELD (do NOT build — operator paused CC complexity)

- No NEW CC functions/panels beyond fixing the navigation/linkage above.
- The broader PE-reports program (which of the ~15 spine functions PE offers, unified-surface decision) stays HELD pending an operator product decision (audit: `_inbox/2026-07-27_app_vs_cc_report_audit.md`). The property BRIEF (item A) is the ONE report being added now.
- Public-data ingest (imagery/hydrography/address/subdivisions) HELD pending the reports decision.
- CTX / national fan-out HELD.

## EXECUTION

Fresh PLANNER manages sub-agents (planner plans/dispatches/verifies-live/owns-deploys; never sub-agent self-grade). Every sub-dispatch EMBEDS the standing-decisions block (from _STATE.md). Verify every fix by viewing the LIVE surface across multiple different-data parcels. Update _STATE.md as state changes. Suggested order: A (brief — flagship) + B1 (unblock export) can run early; C+D+map-linkage is the CC-navigation cluster (faithful port + list endpoint); E/G are quick labeling/surface fixes; F (hydrology) is a diagnose-then-fix. CTX HELD throughout.
