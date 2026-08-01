---
id: 2026-08-01_PE_qa_round3_and_mobile_dispatch
title: PE QA round 3 (OZ layer, brief-export standardization, citation richness, chat-input wrap) + MOBILE pass dispatch
date: 2026-08-01
status: dispatch (3 fleets: A OZ-wiring, B brief-export+citation+chat-input, C mobile)
owner: nick
related: [2026-08-01_PE_ui_polish_qa_batch, 2026-08-01_pe_chat_sessions_feature_spec, 40_hauska_map_3d_implementation_brief]
purpose: Round-3 operator QA on live PE (property-explorer-xi) + tee up the held MOBILE responsive pass as its own fleet. Diagnoses done by planner before dispatch (below); fleets execute in isolated worktrees, verification never delegated.
---

# PE QA round 3 + MOBILE dispatch

Operator re-QA of live PE. Round-2 wins CONFIRMED landing: X-ray PDF header correct, chat [n] citations rendering, roads visible. Five new items + tee up mobile.

## PLANNER DIAGNOSES (done before dispatch — scope is grounded, not guessed)

1. OPPORTUNITY ZONE LAYER populates nothing. Root cause: `layer-registry.js:52` registers `opportunity-zone-tract` as `live: true` with paint in `hauska-map-style.js:85`, but there is NO data source wired for it — nothing in `live-gis.ts` fetches OZ tract geometry (flood/zoning do; OZ does not). It is a designed-but-unwired layer: toggle + color exist, no geometry feeds it. FIX = wire a real OZ tract source. OZ tracts are FEDERALLY DESIGNATED public Census tracts (CDFI Fund Qualified Opportunity Zone list, ~8,700 tracts nationally; Census tract polygons via TIGER/Line). This is genuine PUBLIC data — NOT a Cotality/relationship path (honor no-special-data-access + Cotality-extinguished standing decisions).

2. BRIEF EXPORT is off-standard. Root cause: two different export renderers exist. (a) The X-ray sheet-standard PDF (engine `packages/engine-core/src/site-plan/pdf/dossier.ts`, "SMART SITE X-RAY · SHEET N OF M", verdict-first, the format ALL property reports use). (b) A SEPARATE ported "Alder" HTML print path (`apps/property-explorer/src/browse/brief-print-html.ts`, header "Property Intel Brief", its own layout + citation appendix, loads into hidden iframe + window.print). The Property Brief export uses (b) — off-standard. FIX = the brief export must follow the SAME format + export rules as the rest of the reports (route through / match the X-ray sheet standard; agent determines cheaper of route-through-engine vs bring-Alder-to-parity, but INTENT = one export standard).

3. PDF FILENAME still "dossier". The download is `48021_34121_dossier.pdf`. Header already renamed to X-RAY (#200); the FILENAME symbol was not. FIX = filename → `..._smart_site_xray.pdf` (or `..._xray.pdf`). Symbol/string rename in the download-name path.

4. CITATION FORMATTING + LINKBACK broken + zoning data too THIN. Two parts. (a) The chat/brief citation `[1] Zoned_Parcels (bastrop-city-tx)` has a formatting + linkback issue (raw source-table name shown; link may not resolve). FIX = clean citation display (human label not raw table name) + working linkback to the source. (b) BIGGER: the chat answers "the available sources don't contain the specific GC zoning district use regulations" — the zoning atom is THIN (district code only, not the use table / permitted-conditional-prohibited uses / dimensional standards). Operator: "all of our data should be very rich and useful." FIX/INVESTIGATE = is the GC use-regulation data present in the corpus but not retrieved, or genuinely not ingested? If ingested-but-not-retrieved = retrieval fix (backend). If not ingested = a data-op (ingest the Bastrop UDC use tables into zoning atoms). Agent reports which; do NOT fabricate use rules. (Bastrop UDC IS in the corpus — 181/193 atoms — so this is likely a richness/retrieval gap, not a missing-source gap.)

5. CHAT INPUT does not wrap/expand. The user input field is single-line; long input overflows and the user can't see everything they type. FIX = the chat input becomes a wrapping, auto-expanding textarea (grows with content up to a cap, then scrolls). Standard chatbot input ergonomics.

## FLEET A — Opportunity Zone data wiring (hauska-map, isolated worktree)
Wire real OZ tract geometry so the layer populates. Source = public CDFI Qualified Opportunity Zone designated Census tracts + TIGER/Line tract polygons (NO Cotality, NO Regrid, NO relationship data — must work for any jurisdiction via uniform public record). Follow the flood/zoning source pattern (`live-gis.ts` fetch → geojson → styled fill). Bastrop-area OZ tracts as the first proof (confirm which Bastrop tracts are designated OZs). Deliver: OZ layer renders real designated tracts on the map; toggle works; cited + dated like every other layer (source: CDFI OZ list + Census vintage). PR base main, CI green.

## FLEET B — brief export standardization + citation richness + chat input (PE + possible backend, isolated worktree)
1. Brief export → X-ray sheet standard (item 2): one export format/rules across all reports. Route the Property Brief through the same sheet standard as dossier.ts, OR bring brief-print-html to full parity (header, layout, filename, citation format). Agent picks the cheaper true-parity path and reports it.
2. Export FILENAME → smart-site-xray (item 3): kill "dossier" in the download filename.
3. Citation formatting + linkback (item 4a): human-readable citation labels (not `Zoned_Parcels (bastrop-city-tx)` raw) + working linkback to source.
4. Zoning data RICHNESS (item 4b): investigate whether GC (and all district) USE regulations + dimensional standards are in the corpus. If present-but-not-retrieved → fix retrieval so the chat/brief return the full use table cited. If not ingested → REPORT it as a data-op (do NOT fabricate use rules); scope the ingest. Every zoning answer should be RICH: district, permitted/conditional/prohibited uses, dimensional standards, all cited.
5. Chat input WRAP/EXPAND (item 5): input → auto-growing wrapping textarea (cap + scroll), Enter-to-send / Shift-Enter newline preserved.
PR(s) base main, CI green on head SHA. Note any cortex-api/engine backend touch (coordinated cross-repo).

## FLEET C — MOBILE responsive pass (hauska-map, isolated worktree, OWN workstream)
The held mobile pass, now dispatched. Problem (operator): the map works on mobile, but searching a property / using controls makes the panels OVERLAP — "just a mess." NOT a quick paint fix — a real responsive-design pass. Scope:
- Panel z-stacking + single-panel-at-a-time on mobile (the subject card, search, AI chat, report panels must NOT overlap; one primary panel at a time with a way to switch, or a mobile drawer/sheet pattern).
- Control repositioning for small viewports (zoom/north, layers, bubbles must not collide with panels or each other).
- The chat sessions feature (new #138) + expandable report panels must work on mobile.
- Mobile-viewport test loop (a responsive test at phone widths, e.g. 390px).
Deliver: a clean mobile experience — search a property, open the X-ray, use chat, toggle layers, all without overlap. PR base main, CI green. This is desktop-first-preserving (do not regress desktop). Operator will QA mobile only after this solid pass.

## DISCIPLINE (all fleets)
Isolated worktree off origin/main (this repo has many active worktrees — do NOT edit the shared clone tree; collision hazard — see the round-2 Fleet1/Fleet2 collision postmortem). Stage explicit paths. Build + tsc + tests green; PR base main; CI green on the HEAD SHA (not a stale run). Deploys are PLANNER-OWNED — do NOT merge or deploy. Standing decisions travel: no-special-data-access (all data via uniform public record), Cotality-extinguished (never route to/fix Cotality; OZ + any parcel data via public county/federal source), tenant-private stays private, area-not-sample for any cert claim. No timeframe estimates. Report cross-repo backend touches.

## PLANNER LEGS (after fleets hand back)
Merge each on green (verify head SHA); handle any data-op Fleet B surfaces (zoning richness ingest) as a planner data-op; deploy PE (Vercel CLI, new-timestamp + bundle marker) + any backend (Cloud Run canary); operator re-QA. Update this doc with shipped SHAs.

## SHIPPED 2026-08-01 — ALL 4 PRS MERGED + DEPLOYED (backend-first)
Merge order handled the ONE real collision (ExplorerMap.tsx shared by #141 OZ + #139 mobile; #140 shared nothing):
- #140 (brief export X-ray-standard + citation labels + chat textarea) merged FIRST clean, no overlap. main→71dc1a8.
- #141 (OZ layer) rebased onto new main (5d176426), CI green on rebased SHA, merged. main→c90deb1. OZ code verified on main (51 Opportunity refs in ExplorerMap).
- #139 (mobile) rebased onto main-with-#141 (2d24b8c9), CI green, VERIFIED rebased branch preserved #141's OZ code (51 refs) AND added mobile (28 refs) in the shared ExplorerMap.tsx — clean 3-way merge, NOT a silent revert. merged last. main→99f91503.
- ldt #369 (district-aware zoning retrieval + section labels + sourceUrl citations) — confirmed at-tip (behind_by:0) on top of already-merged #368 (jurisdictionKey canonicalize); no migration; merged. ldt main→75780e33.

DEPLOYS (backend BEFORE PE per agent note, so zoning richness + linkback work on first live hit):
- cortex-api: workflow_dispatch canary deploy (cloud-run-deploy.yml) → new rev cortex-api-00452 (prod was 00450) → canary smoke HTTP 200 (health+root) → shift-traffic dispatch → 100% to 00452 + workflow's own prod /api/healthz smoke passed. Prod cortex-api health HTTP 200. No migration (#369 retrieval/label only).
- PE: Vercel prod deploy from detached origin/main (99f91503, all 3 PR markers verified in tree) → property-explorer-gv2ghistr READY Production → alias property-explorer-xi.vercel.app repointed (from 2h-old n9uzpdz85). Live: app root HTTP 200 (Age 0); OZ BFF route POST /api/pe-map-layers?layer=opportunity-zone deployed (GET→405 method_not_allowed = route present+wired, not 404).

TRAFFIC-TRAP AVOIDED: cortex-api canary deploy leaves prod on OLD rev at 100% until an explicit shift-traffic dispatch — did the shift + verified 100% on 00452, not just "latestReady".

ZONING RICHNESS FINDING (Fleet B): retrieval-fix, NOT a missing-corpus data-op. GC use data IS ingested (atom bastrop_tx-bdc-2026-adopted/14-02-003 has intent + typical uses + dimensional standards). Chat said "no use regulations" due to generic query + key mismatch (both now fixed via #368+#369). HONEST NOTE for operator QA: Bastrop BDC uses a "Typical Uses" + dimensional-chart format, NOT a permitted/conditional/prohibited matrix (that's how Bastrop's code is structured) — so live GC answers return rich cited "typical uses + dimensional standards per BDC §14.02.003," not a P/C/P table. Not a gap to fabricate around.

OPERATOR RE-QA OWED (round 4): OZ tracts render (green fill, cited CDFI+TIGER) at zoom≥11 over Bastrop; brief Export now = X-ray sheet PDF with _smart_site_xray.pdf filename; citation labels humanized + linkback; GC chat/brief returns rich cited use+dimensional content; chat input wraps/expands; MOBILE (search a property, open X-ray, use chat, toggle layers — no overlap at phone widths).
