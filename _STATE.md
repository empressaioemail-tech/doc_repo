# _STATE — living program state (read this FIRST, every session)

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). This is live state a fresh agent picks up from. Update it as state changes; it is meant to be edited constantly. Last updated: 2026-07-28.

## THE ONE-LINE

Bastrop is APPROVABLE (mold gate passed 2026-07-27) and substantively built (depth 99.59%, sellable UI, legible console, recipe generalizes on Caldwell). Now in QA/polish + finishing PE reports. CTX/national fan-out HELD until QA-done + operator go. Everything else (Track C engine-panel, fidelity-v2 beyond topo, living-layer, marketplace) held/not-started.

## STANDING DECISIONS (these govern every dispatch — paste into fresh-agent handoffs)

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

## LIVE INFRA (serving revisions — verify before quoting; they churn)

- engine-api: `hauska-engine-api-00107-yuc` @100% (no-setback + 4Gi OOM-fix + bbox-guard). Project hauska-prod-497015. 4Gi is LIVE-SET only. Deploy = Cloud Build cloudbuild.engine-api.yaml → --no-traffic --tag → smoke → update-traffic.
- retrieval: `hauska-retrieval-api-00041-hed` @100% (or later). Project hauska-prod-497015.
- MCP: `hauska-mcp-server-00032-gzm` @100%.
- cortex-api: `cortex-api-00442-heq` @100% (Cotality-decommissioned envelope path). Project legacy-design-tools-prod.
- CC: `cmdcenter-blush.vercel.app`. PE: `property-explorer-xi.vercel.app`.

## WHAT IS DONE + LIVE-VERIFIED

- Depth engine (Bastrop 99.59% place-type), boundary primitive (temporal + adjacency), road-as-node, property-line-tags (26454/26454 honest).
- CC-A legible node/atom flow (but see QA-CC-PORT/BUG below — flow is thinner than the target + a timeout bug).
- Track B customer UI: road render, site-plan design pass, map/PDF vocab one-truth, viewport road network.
- Mold hardening (D1): zoning provenance backfilled (cites real AGOL), health monitors live (/health/spine/run), dual-table hash-lock, contract pin. Bastrop APPROVABLE.
- Topo fidelity: 1-ft LiDAR contours + hydrology + terrain export live (config-to-1m + Contour1Ft2017).
- No-setback export fix + Cotality-decommission (envelope 502 gone, honest 404).
- Recipe generalizes: Caldwell #2 (7 held / 1 new-baked). Recipe-proof track CLOSED.

## OPEN — ACTIVE (what a fresh agent picks up)

Blockers visible on the live PE app (screenshot 2026-07-28):
1. SITE-PLAN EXPORT still blocked — "needs an engine-api gate token (HAUSKA_ENGINE_API_KEY) / gate-front context not set or not accepted." The customer can't export a site plan. (Distinct from the no-setback fix which is about the CONTENT; this is the gate-token/auth on the PE→engine export path.)
2. HYDROLOGY DEGRADED — "Flow lines degraded — hydrology: HTTP 504." The hydrology flow layer times out.
3. LAND USE + ACREAGE not captured — inspect card shows "not verified here" for land use and acreage. Need to capture/surface both.

QA workstreams in flight / owed (register: `_inbox/2026-07-27_bastrop_qa_defect_register.md`):
- QA-CC-PORT (major): CC inspector flow is thinner than the Trading Control Tower target; faithful-port owed (reference: `/p/Empressa Trading` NodeGraphBrowser.tsx + AtomInspector.tsx). Branch qa/cc-inspector-port.
- QA-CC-BUG: CC node inspect on 48021:28286 times out 20s + TALLY STALE. Real defect.
- QA2.2: site-plan template-match (operator dropped a template; port design into pdf-lib). Branch qa/site-plan-template-match.
- More QA polish changes (operator flagged, not yet enumerated).

PE reports / functions (NEW — needs a plan):
- The customer app (PE) exposes ~3-4 reports; the spine can back ~15+ (brief, hazard, encumbrance, dossier, plan-review, deliverable letters). Audit: `_inbox/2026-07-27_app_vs_cc_report_audit.md`. DECISION OWED: which reports PE offers + is PE the unified report surface. This is a product+design+data program, not a QA ticket.

Public-data completeness (NEW — recon done):
- Only ingested ~4 of 26 county folders. Ungrabbed public layers: aerial imagery (2019-2024), hydrography (Creeks_Streams), address points, subdivisions, city water/utility CCN. Recon: `_inbox/2026-07-27_bastrop_public_data_completeness_recon.md`. Ingest-prioritization dispatch HELD pending report-set decision.

## HELD / NOT STARTED (by design — do not start without operator go)

- CTX / Hays / national county fan-out (until Bastrop QA-done + go).
- Track C: thin CC engine-control panel + "start county X" launch surface (last by design).
- Fidelity v2 beyond topo: true ROW, plats, easements, courthouse records (Vertosoft channel product — Bastrop gift-demonstrator, records-as-downloadable-docs).
- Living-layer sensing engines (zoning-change/annex/ownership/permit/subdivision — temporal atoms exist, sensors not built).
- Marketplace / write-back contract (vision).
- Bastrop infra-twinning (streetlights/traffic — city layer, likely needs city data handoff).

## KEY DOCS (the map)

- Program: 27_MASTER_WDLL, 27a (engines), 27c (road node), 27d (recipe), 27e (multi-track), 27f (Bastrop-through-v2 stack).
- Bastrop definition: `_inbox/2026-07-27_bastrop_composition_inventory.md` (what's IN Bastrop, verified against code).
- QA plan: `_inbox/2026-07-27_bastrop_qa_defect_register.md`.
- Reports: `_inbox/2026-07-27_app_vs_cc_report_audit.md` + `_inbox/2026-07-16_command_center_function_matrix_bizdev_handoff.md`.
- Strategy: `_decisions/2026-07-26_base_layer_connecting_tissue_thesis_and_tracks.md`, `_decisions/2026-07-27_county_records_channel_and_bastrop_demonstrator.md`.
- Last session: `_sessions/2026-07-27_bastrop_completion_multitrack_and_hardening_claude_code.md`.

## HOW TO USE THIS FILE

Fresh agent: read this + MEMORY.md FIRST, then the specific doc for your task. Update the OPEN and LIVE INFRA sections as you change state. This file is the pickup point — keep it true.
