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

- engine-api: `hauska-engine-api-00109-nur` @100% (hydrology 10m floor #164; 4Gi/300s preserved; envelope-canary tag repointed). Project hauska-prod-497015. 4Gi is LIVE-SET only. Deploy = Cloud Build cloudbuild.engine-api.yaml → --no-traffic --tag → smoke → update-traffic.
- retrieval: `hauska-retrieval-api-00043-lay` @100% (GET /nodes roster #165; migration 008 indexes applied+verified on substrate Neon). Project hauska-prod-497015.
- MCP: `hauska-mcp-server-00033-khs` @100% (site-plan/terrain 50s/45s timeouts #52).
- cortex-api: `cortex-api-00442-heq` @100% (Cotality-decommissioned envelope path). Project legacy-design-tools-prod.
- CC: `cmdcenter-blush.vercel.app` (CC-nav #94 live). PE: `property-explorer-xi.vercel.app` (brief #93 + honest-timeout #92 + inspect-card #91 live). NOTE: Vercel does NOT auto-deploy on merge — deploy via CLI from repo root with `vercel link --yes --project <property-explorer|cmdcenter>` then `vercel deploy --prod` (runbook _inbox/2026-07-21).

## WHAT IS DONE + LIVE-VERIFIED

- Depth engine (Bastrop 99.59% place-type), boundary primitive (temporal + adjacency), road-as-node, property-line-tags (26454/26454 honest).
- CC-A legible node/atom flow (but see QA-CC-PORT/BUG below — flow is thinner than the target + a timeout bug).
- Track B customer UI: road render, site-plan design pass, map/PDF vocab one-truth, viewport road network.
- Mold hardening (D1): zoning provenance backfilled (cites real AGOL), health monitors live (/health/spine/run), dual-table hash-lock, contract pin. Bastrop APPROVABLE.
- Topo fidelity: 1-ft LiDAR contours + hydrology + terrain export live (config-to-1m + Contour1Ft2017).
- No-setback export fix + Cotality-decommission (envelope 502 gone, honest 404).
- Recipe generalizes: Caldwell #2 (7 held / 1 new-baked). Recipe-proof track CLOSED.

## OPEN — ACTIVE (what a fresh agent picks up)

2026-07-28 QA cluster RESOLVED (all merged + deployed + live-verified same day; verification evidence in _sessions/2026-07-28):
- B1 EXPORT: FIXED. MCP timeout 30s→50s deployed (rev 00033-khs); live MCP download of gold-parcel PDF = 200 in 5.8s (591KB real PDF). PE honest-timeout classes live. Residual: customer-click confirm by operator (needs signed-in paid session).
- F HYDROLOGY: FIXED + live-verified on PE prod, same bbox: 40.6s/1379 channels → 6.3s/169 channels, status ok. Worst-case cold start can still exceed 60s once; UI degrades honestly and recovers.
- G INSPECT CARD: deployed; live facets payload confirmed carrying landUse (A1 cad-roll) + acreage (0.1886 shoelace-wgs84) on 48021:28286; deriver now renders present values with provenance captions. Visual confirm owed by operator.
- C+D CC NAV: /nodes live-verified end-to-end THROUGH the CC proxy (q=28286 finds gold parcel in 2.3s; roads roster with display names; gold-parcel detail 195ms — was 20s-timeout). CC bundle carries nav action + list + label changes. Flow-level UI walk owed (browser).
- A BRIEF: deployed (bundle markers verified). Rendered-brief visual + PDF-export confirm owed by operator (needs paid session).
- E LABEL: deployed in CC bundle ("unincorporated" framing live).

Original blocker notes (superseded, kept for context):
1. SITE-PLAN EXPORT block — NOT auth. Root cause (live-verified): MCP engine-api-client DEFAULT_TIMEOUT_MS=30s; warm refresh measured 23.2s live, cold exceeds 30s → abort → "Engine API unreachable … requires engine-api" → PE classifyEngineFailure pattern-matches that string into the GATE class → misleading "needs an engine-api gate token" message. PE prod env + deploy are fine (prod at main tip w/ #88+#90; MCP_PRODUCT_KEY etc. all set; both services share GATE_CONTEXT_SIGNING_KEY secret; engine gate mode defaults to log). Fix in flight: MCP timeout 50s + PE honest-timeout classification (branches fix/siteplan-engine-timeout on hauska-mcp-server, fix/pe-export-honest-timeout on hauska-map).
2. HYDROLOGY 504 — operator hypothesis CONFIRMED: default DEM went to 1m (usgs3dep.ts), hydrology-flow slot reuses the shared raster plan (fetches 1m it doesn't need), accumulationThreshold fixed at 50 cells regardless of resolution, pysheds worker budget 120s vs PE Vercel fn cap 60s → upstream 504. Fix in flight: hydrology-specific 10m resolution floor + resolution-scaled threshold (branch fix/hydrology-resolution-floor on hauska-engine).
3. LAND USE + ACREAGE — data IS in the fetched baked payload; deriveBakedCardModel suppresses present values when facetCoverage flag is false; live branch has no acreage row at all. Fix in flight (branch fix/pe-inspect-landuse-acreage).

DISPATCH STATE 2026-07-28 (planner session, six executor agents in parallel worktrees; planner merges on green CI, deploys, live-verifies):
- W1 fix/siteplan-engine-timeout (mcp) + fix/pe-export-honest-timeout (map) — B1 export unblock.
- W2 feat/retrieval-node-list (engine) — GET /nodes list endpoint + jsonb expression indexes migration (also hardens gold-parcel inspect timeout). Contract pinned in dispatch; planner must APPLY MIGRATION to substrate Neon (hauska_mcp) before live-verify (merged ≠ applied).
- W3 qa/cc-nav-linkage (map/CC) — map-click→focus Node&Graph, real node list + multi-id search + back-nav (Trading port), getJson timeout alignment, 9.27%-zoned label reframe. Feature-detects /nodes (honest-empty fallback if endpoint not deployed yet).
- W4 fix/hydrology-resolution-floor (engine) — hydrology 10m floor + threshold scaling.
- W5 fix/pe-inspect-landuse-acreage (map/PE) — inspect-card land use + acreage surfacing.
- W6 feat/pe-brief-alder-render (map/PE) — FLAGSHIP: Alder-style brief renderer replacing raw-JSON dump (4-section R1 contract from cortex propertyExplorer.ts buildR1Brief), close + print-CSS PDF export, no fabrication (field→payload scrub table in PR).
- B2 (drawings+aerial with site plan) MERGED (#166, engine): aerial-context page 3 in the site-plan PDF — Esri World Imagery (3857 static export, PNG-signature guard, 8s bound) + exact-inverse-transform vector overlay + attribution + always-emit honest-unavailable panel; artifact records aerialImageryEmbedded/UnavailableReason. Engine redeploy for it in flight at session close (image aerial-e73334f → canary → smoke → shift).
- Deploy notes: retrieval-api = `gcloud run deploy hauska-retrieval-api --source .` from engine root (env preserved when flags omitted; canary tag + smoke + shift); MCP = cloudbuild-mcp.yaml; migration apply = packages/storage/scripts/apply-migration.mjs w/ DATABASE_URL from Secret Manager (check script covers new migration file).

NEW QA/PORT cluster (2026-07-28, spec: `_inbox/2026-07-28_pe_cc_qa_and_reports_spec.md`):
- PROPERTY BRIEF INTO PE: PE brief shows raw JSON; port the real "Alder" brief renderer (legacy-design-tools briefingHtml.ts/briefingPdf.ts/parcelBriefings.ts) into PE's container; comprehensive + layman + nice + close/export-PDF. Scrub + verify.
- SITE-PLAN EXPORT still blocked (gate token / gate-front context on PE→engine) + ADD drawings+aerial export with the site plan.
- CC MAP LINKAGE: new map lost the old bind — click parcel on map must focus Node&Graph + all bound panels to that node.
- CC NAV: county→open→roads+parcel-nodes→search-by-many-ids→click-node→atoms→click-atom→inspector→BACK-NAV to county list. (= QA-CC-PORT; likely needs a spine node-LIST endpoint — /nodes 404 today, stranded-data pattern.)
- "9% ZONED" label: CONFIRMED correct (Bastrop county mostly unincorporated = legitimately unzoned) but reads alarming — fix the LABELING (city-zoned vs county-unincorporated), not the number.
- HYDROLOGY 504: operator hypothesis = topo-swap byproduct (finer DEM broke D8 flow). Diagnose + fix.
- LAND USE + ACREAGE: exist in brief atoms (land-use A1/cad-roll) but not on the inspect card — surface both.

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
