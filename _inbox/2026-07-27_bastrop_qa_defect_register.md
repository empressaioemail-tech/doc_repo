---
id: 2026-07-27_bastrop_qa_defect_register
title: Bastrop QA defect + scope register — the Stage-3 market-ready quality pass (living plan)
date: 2026-07-27
status: active (the QA track's living plan; ranked; fixable-now vs needs-v2-build separated)
owner: nick
planner: qa (CTX HELD)
verified: live health-board (/health/spine/run) + code read against origin/main tips (map f386190, ldt 556f297f, engine 5b6f465)
related: [27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory, 2026-07-27_COMPLETE_BASTROP_hardening_audit, 75j_property_explorer_destination_ledger]
purpose: The ranked, evidence-backed defect+scope list across the six QA areas, separating "fixable now" (polish/fix on data that exists) from "needs a v2 build" (missing data / ingest), so sub-agent waves can be planned against a measurable target rather than a vibe.
---

# Bastrop QA defect + scope register

The hardening gate (D1) passed 2026-07-27: Bastrop is APPROVABLE (sound, honest, correct, provenanced; commitment #1 green — zoning-fact now cites the real AGOL layer). This register is the SECOND bar: Bastrop-DONE = sound PLUS beautiful, legible, professional, genuinely useful. QA is the gap, judged by looking at live output, never by mechanical grades.

Method note: the customer map / PDF / CC canvas cannot be pixel-inspected from this environment (sandbox has no shell egress; WebFetch renders markdown not canvas; gated endpoints 401). So this register is built from (a) LIVE population-level ground truth via the B1 health board, and (b) exact code-level rendering audit against origin/main. Per-parcel visual verification across many parcels is the ACCEPTANCE step on each fix (operator-in-the-loop looking), not the audit step. Where a fix lands, it is verified by viewing the live surface across multiple different-data parcels before it is graded MET.

## DEPLOY STATUS (2026-07-27, all five merged + deployed)

| QA | Surface | Deployed | Verified |
|---|---|---|---|
| QA1 road feather | PE prod `property-explorer-xi` | YES (Vercel Ready) | operator visual look owed |
| QA2 site-plan craft | engine-api `00095-hak` @100% | YES (canary shifted) | craft shipped; **QA2.2 template-match owed** (operator dropped a template) |
| QA3 CC majors | CC prod `cmdcenter-blush` | YES (Vercel Ready) | panels LIVE on prod keys; **node inspect TIMES OUT (20s) — QA-CC-BUG**; **inspector flow wrong — QA-CC-PORT owed** |
| QA4 overpass | retrieval `00041-hed` @100% | YES | live probe clean; migration 007 CONFIRMED applied (schema_migrations + constraint) |
| QA5 bearing parity | on main (test-only) | n/a | origin/main imports shared module + guard |

Deploy notes: engine-api deploys = Cloud Build (`cloudbuild.engine-api.yaml` builds `:latest`) then `gcloud run deploy --image --no-traffic --tag` + smoke + `update-traffic`. retrieval + Vercel apps already covered. Detour cost: 3 hygiene commits (#82/#83/#84) chasing non-fatal Vercel type warnings misread as a deploy block; PE was Ready throughout. Pre-existing BFF type bugs filed at `_inbox/2026-07-27_pe_api_bff_type_debt.md`.

## NEW WORKSTREAMS (operator input 2026-07-27 post-deploy)

- **QA-CC-PORT (major):** the CC node/atom inspector flow is WRONG. Operator's model = the Empressa Trading Control Tower (`empressa-cockpit-admin.vercel.app`; source `/p/Empressa Trading` repo `empressa-trading`, `apps/cockpit/admin/src/control/panels/NodeGraphBrowser.tsx` + `AtomInspector.tsx`). Target flow: BROWSE node list (filters node_type/asset_class/status/resolution_status/q, paginated) → click node → detail (field grid + identifiers + edges_in/out + atom_counts_by_family pills + merge-chain) → click family → atoms inline (paginated) → atom inspector (claim + JSON body + confidence n/width/basis never-bare + provenance/citation + bitemporal + access/license + TIME TRAVEL live/as-of + lineage/supersession chain) with the STATE LEGEND as a first-class right rail. CC-A was supposed to port this; it shipped a thinner hash-input version, and QA3 collapsed the StateLegend — RECONSIDER that collapse (reference keeps it visible as the decoder ring). This is a faithful-port job against real reference source, not a screenshot reverse-engineer.
- **QA-CC-BUG:** live CC Node & Graph inspect on `48021:28286` "timed out after 20000ms" + TALLY STALE (prod, keys work). Real defect — the property node inspect path is timing out. Run down separately from the port.
- **QA2.2 (site-plan template-match):** operator dropped a professional HTML/SVG template at `_inbox/2026-07-27_qa2_site_plan_craft_samples/Siteplan style template design/` (`Site Plan Template.dc.html` + `Site Plan Template v1 (3 options).dc.html` + `ds-industry.css`, Barlow fonts). DECISION: port the template DESIGN into the existing pdf-lib engine (embed Barlow TTF; header/stat-cluster, SVG-style drawing w/ edge bearing tags, accent setback labels, legend swatches, graphic scale bar, honesty footer) — NOT switch to HTML→PDF. QA2 craft ships now; this is the follow-up design pass.

## IN FLIGHT (2 builders dispatched 2026-07-27, operator said "do the work with sub-agents + deploy everything")

- **CC inspector port + timeout** → branch `qa/cc-inspector-port` (hauska-map). Faithful port of the Trading Control Tower flow (`/p/Empressa Trading` NodeGraphBrowser+AtomInspector) into CC, wired to spine endpoints (honest-empty where spine lacks a list/merge-chain/lineage/as-of endpoint), State Legend kept VISIBLE (un-collapse the QA3 collapse), + fix the 20s node-inspect timeout on 48021:28286. Preview will show DEGRADED (no keys) — verify live on prod after merge.
- **QA2.2 template-match** → branch `qa/site-plan-template-match` (hauska-engine). Port the template design into pdf-lib, embed Barlow, `_v2` sample PDFs written to the samples dir for comparison.

Planner (this seat) verifies both live, then deploys: hauska-map = Vercel prod (repo-root link=cmdcenter for CC; `apps/property-explorer` link for PE); hauska-engine site-plan = engine-api Cloud Build → `gcloud run deploy --image --no-traffic --tag` → smoke → update-traffic. No builder self-grades.

## The three buckets

- **BUCKET A — fixable now** (styling / layout / craft on data that already exists and serves). No new data, no ingest, no hardening-file collision. These can be dispatched immediately.
- **BUCKET B — design-then-build** (needs a spec before a fixer; the data mostly exists but the surface must be designed: report suite, render-what-exists study layers, non-drawing-parcel UX).
- **BUCKET C — NOT a QA fix; a deferred fidelity-v2 build** (missing data / ingest). Flagged so it cannot masquerade as rendering polish. The LiDAR/topo/hydrology ingest lives here.

## LIVE ground truth (health board, /health/spine/run @ 2026-07-27T16:24Z)

Population-level, not gold parcels. All firing unless noted: parcels 74,729; boundary-edges 26,454; depth-warm 3,642 (`depth-warm-promoted-v1`); zoning-agol firing (574 features, PlaceTypeClass); rule-setback resolves P-5 front=15ft on 48021:33512; reasoning-chain complete (zoningFact+setbackRule+buildableEnvelope). Two honest findings fell out of the board itself:
- **osm-overpass DEAD, alert=true** (HTTP 504). Roads still serve today via county-roadway (11,351) + streets-surveyed-2016 (1,307), so this is masked — but it is a live single-source-fragility signal, not a non-event. Register item QA-BEHAV-2.
- **S-14 bake lag = 444** (txgio zd 6213 vs tier1 zoning_present 5769). Accepted in writing per the hardening audit; monitored live. Not a QA fix; noted.

No silent-wrong-answers surfaced at population level. Per-parcel behavior verification (city + county, many parcels, anti-fixture) is QA-BEHAV-1, pending the gated-endpoint key / operator-in-the-loop.

---

## RANKED REGISTER

### AREA 1 — ROAD RENDERING (styling; data is sound) — BUCKET A

The "heavy/doubled/overlapping blue bands" are literally three stacked opaque fixed-pixel lines per road, drawn ON TOP of parcels, with zero zoom-scaling. All confirmed against origin/main in `hauska-map`.

| # | Defect | Evidence (file:line) | Fix |
|---|---|---|---|
| RD-1 | Doubled band: centerline (2.5px) + 2 ROW edges (1.5px each) = 3 stacked opaque strokes per road | `road-overlay.ts:81-107` | Collapse to a single cased line; drop ROW edges or gate to zoom >=18 |
| RD-2 | Zero zoom-scaling: every width is a fixed pixel constant; roads render full 2.5px at z14 (most zoomed-out, most crowded) | `road-overlay.ts:90,104`; renderer choke point `overlay-render.js:193-215,204` | Convert widths to `["interpolate",["linear"],["zoom"],...]` |
| RD-3 | Z-ORDER bug: roads paint ABOVE parcels (no `beforeId`), re-added above on every pan/zoom | `overlay-render.js:198`; parcels `parcel-tiles.js:159,175,187` | Pass `beforeId` so roads draw beneath parcel line/fill; roads obscuring parcels is a render-order defect, not a data one |
| RD-4 | Heavy saturated blues + high opacity (0.85-0.95) so roads dominate | `road-overlay.ts:12-13` (`#1a5f9e`,`#3b82b0`) | Desaturate to low-contrast grey-blue; drop opacity ~0.7 |
| RD-5 | No road on/off or opacity control (roads not in LAYER_REGISTRY, pushed unconditionally) | `layer-registry.js:23-92`; `road-overlay.ts:92,106` hard `visible:true` | Register road layer; honor visibleLayers/opacity in chrome |
| RD-6 | Intersections stack (no dedup/merge of coincident geometry) → "blobs" | `road-overlay.ts:52-78` | Largely resolved by RD-1/RD-4 (thin+low-opacity); true fix merges coincident segments |
| RD-7 | No shared map-style token module; road color/width/opacity scattered inline | `road-overlay.ts`, `overlay-render.js`, `live-gis.ts` | Introduce `mapTokens.ts` / single road-style module |

Single-builder shape: one fixer, targets `road-overlay.ts:81-107` + `overlay-render.js:193-215` (the one choke point for zoom-expr + beforeId across all overlay lines). Promote a styling regression test (RD-2/RD-3 go red on pre-fix code). Zero hardening collision.

### AREA 2 — PE MAP APP UI (customer's primary surface) — BUCKET A (+ some B)

MapLibre GL via `@hauska/map-renderer`. Roads are Area 1. Remaining PE-map surface:
- QA-PE-1 [A]: Parcel legibility once roads recede — parcel strokes are fixed 1.1-1.4px, fill-opacity 0.14-0.32, no zoom-scaling (`parcel-tiles.js:46-95`, `live-gis.ts:183-195`). Verify parcels read cleanly at every zoom after the road z-order fix.
- QA-PE-2 [A]: FEMA flood overlay IS rendered on the map (`ExplorerMap.tsx:162,258,610`) — QA is "does it render well / legibly," part of the study story (Area 3) but the surface exists.
- QA-PE-3 [B]: Full customer-surface UX audit (InspectCard, layer control discoverability, mobile/PWA, honest-decline copy) — needs an operator-in-the-loop looking pass across many parcels; this is where the "premium product not debug view" bar is judged. Decompose after the road/parcel styling lands so the audit isn't dominated by the road noise.
- QA-PE-4 [B]: Non-drawing-parcel UX (Flagged Risk A) — at the true ceiling ~13% of parcels (honest-irregular + no-road) show NO envelope. What does the customer SEE and what can they DO? Engineering-honest != customer-ready. Needs a small design spec.

### AREA 3 — SITE-PLAN EXPORT + REPORTS + STUDY RENDERING

**3a. Site-plan PDF craft — BUCKET A** (`hauska-engine`, pdf-lib, `render.ts:308`). Bones are good (parcel-primary fit + street clipping IN; provenance panel strong). Craft is weak:

| # | Defect | Evidence | Fix |
|---|---|---|---|
| SP-1 | Collision engine SILENTLY gives up — after 12 iterations draws the label overlapping anyway | `annotation-placement.ts:149-155` | Add fallback: leader line, shrink, or drop; never silent-overlap |
| SP-2 | Fixed font sizes (7pt) vs geometry-scaled drawing → small parcels overlap by construction | `render.ts:154,165,119,176`; `layout.ts:284,312` | Scale font to parcel draw-scale, or leader-line small parcels |
| SP-3 | Two disjoint label passes (tags outward / setbacks inward) don't share `placed[]` | `layout.ts:278` vs `:319` | Single shared collision set across both label classes |
| SP-4 | Collision boxes estimated (`0.52*len`) not measured (pdf-lib `widthOfTextAtSize` available) | `annotation-placement.ts:90-92` | Use real measured widths |
| SP-5 | Street/contour/elevation/footer labels bypass collision entirely (fixed offsets) | `render.ts:110-122,172,176` | Route through the collision engine |
| SP-6 | Crude north arrow (bare line + "N", no arrowhead/rose) | `render.ts:183-184` | Proper north-arrow graphic |
| SP-7 | Crude scale bar (line + text, no ticks/graphic divisions/imperial) | `render.ts:185-192` | Graphic scale bar with ticks + 0/mid/max + feet |
| SP-8 | 3-word inline legend, no swatches / line-style key (dashed-setback vs solid-property) | `render.ts:33-36` | Real legend with swatches |
| SP-MISSING [B] | No sheet border/neatline; no bordered title block (scale/date/drawn-by/sheet#/rev); no on-drawing lot-area callout; no leader lines | — | Design additions (spec then build) |

**3b. Other reports (the report suite) — BUCKET B.** Design work, not a fix. Each report held to the same professional bar as the site-plan sheet. Scope: which reports (buildable-summary, constraints, flood, terrain, three-persona variants), what each contains, shared design language. Needs a design spec before any fixer.

**3c. STUDY RENDERING (topo + hydrology) — SPLIT: B (render-what-exists) and C (the ingest).** This is the honest gap and the register holds the line hard.
- Reality (traced in code): terrain today is an EXPORT-ONLY feature — download GLB/IFC/DXF-3dface/DXF-contour from USGS **3DEP ~10m** (`TerrainExportSection.tsx`; `parcel-terrain.ts`; source cite literally "USGS 3DEP", confidence asserted). There is **NO topo/contour/slope map LAYER** on the customer map at all. FEMA flood IS a rendered map overlay. LandXML TIN is explicitly deferred.
- CC structural tell: Site Analysis already has empty/thin tile slots named `['map','topography','drainage','hydrology','subsurface']` (`presets.ts`). The slots exist; the study surfaces behind them are thin/absent.
- **QA-STUDY-1 [BUCKET B, render-what-exists]:** add a topo/contour map layer from the 3DEP data already exported + polish the existing FEMA flood overlay. Renders honestly at ~10m; does NOT pretend to be survey-grade. Real, buildable-now improvement.
- **QA-STUDY-2 [BUCKET C, v2 ingest — NOT a QA fix]:** 1-ft contours + LiDAR + real hydrology (flow/drainage) depth. Recon-found, NOT ingested. No rendering polish converts 10m into 1-ft. This is its own big fidelity-v2 build item, flagged, owner-less until the operator schedules it. The current visible "study" output being road lines rather than topo is BECAUSE topo has no map-render path — QA-STUDY-1 gives it one at honest fidelity; QA-STUDY-2 gives it real depth.

### AREA 4 — BASTROP PARCEL BEHAVIOR VERIFICATION (city + county) — cross-cutting ground truth

- QA-BEHAV-1: Click through MANY real Bastrop city + county parcels (not golds — anti-fixture), confirm envelope/setbacks/roads/tags render correctly OR honest-decline, no silent wrong answers. Population-level ground truth is GREEN via the health board; per-parcel visual pass is the acceptance step, needs the gated-endpoint key or operator-in-the-loop. This is the method that validates the whole inventory, not a single defect.
- QA-BEHAV-2 → **QA4 GO** (2026-07-27): osm-overpass DEAD/alerting was masked by county-roadway; now a real fix — fallback + honest degraded (no silent zero roads) + retry/backoff + probe semantics. Dispatch: [`_dispatches/2026-07-27_QA4_overpass_honest_fallback.md`](../_dispatches/2026-07-27_QA4_overpass_honest_fallback.md). Coordinate with B1 probe (extend, do not collide).

### AREA 5 — COMMAND CENTER (major adjustments) — BUCKET A/B

Operator direction: audit-and-propose, lean node-atom-flow legibility. Audit found legibility issues AND two bigger structural ones. Ranked worst-first (`hauska-map/apps/command-center`, origin/main):

| # | Adjustment | Severity | Evidence | Note |
|---|---|---|---|---|
| CC-1 | Reclaim 504px fixed side chrome — StateLegend (296px, reference-only glossary, non-collapsible) + NavRail (208px) always-on | MAJOR | `StateLegend.tsx:5-8` ("explains state, does not show it"); `NavRail.tsx:69` | Collapse StateLegend to a drawer; give width to inspector/map. Biggest usability win. |
| CC-2 | Node & Graph buries the walk under a 12-column stats table (horizontal-scroll spreadsheet) — the flagship CC-A feature is below the fold | MAJOR | `NodeGraph.tsx:729-779` | Promote NodeInspect to top; move/collapse the Central-TX tally |
| CC-3 | Design-token system split — undefined `--color-background-tertiary` (4 refs render transparent); LiveMapTile runs on `--h-*` fallback-hex; design-tokens imported only inside SpacePanel not the shell | MAJOR | `SpacePanel.tsx:721,814`; `LiveMapTile.tsx:100-115`; `main.tsx:19` | One namespace, defined once, imported at root |
| CC-4 | Type scale too flat and too small (9.5-11px everywhere; one 14px node name) | MEDIUM | `primitives.tsx:24-31,71`; `NodeGraph.tsx:235`; `AtomInspector.tsx:138` | Real type scale; lift atom-id/caption floor off 9.5px |
| CC-5 | Breadcrumb shows one hop, not the traversal (no node>family>atom trail) | MEDIUM | `NodeGraph.tsx:681-689`; `AtomInspector.tsx:642-643` | Render the full walk trail |
| CC-6 | Map is a cramped 1/5 grid cell in an already-narrowed column | MEDIUM | `presets.ts` 3x2; `SpacePanel.tsx:750-762` | First-class/expanded map default (touches Track-C map-swap; coordinate) |
| CC-7 | Four inconsistent card/container idioms (NodeGraph rows / tally table / SpineHealth grid / SpacePanel tiles) | MEDIUM | as cited | Standardize one card primitive |
| CC-8 | Two atom-row renderers; raw truncated JSON in cells; stale NavRail group comment; hand-rolled buttons | MINOR | `NodeGraph.tsx:182-243` vs `AtomInspector.tsx:151-180`; `SpineHealth.tsx:64`; `NavRail.tsx:3-4` | Hygiene |

Cleanest recent work: the B1 Spine Health panel is correctly integrated (shared Panel/registry/probe), not bolted on. Its only nits are shared with the rest of the console.

Coordination: CC-6 (first-class map) overlaps the separately-HELD Track-C thin-engine-panel + map-swap. CC health-board is B1's (merged). My CC work is quality/layout on what exists; flag Track-C-shaped items, don't collide.

### AREA 6 — bearing parity → **QA5 GO** (2026-07-27)

- **PARITY RISK on branch `pr-151-c1`:** it DELETES the shared-module import and re-inlines a full copy of the bearing/tag formula into `annotation-placement.ts`. If merged, PDF bearings and atom bearings come from two independent copies. origin/main is correctly unified (thin re-export from `geometry/gis-property-line-tags.ts`). **QA5** restores/keeps the single shared formula and promotes a mechanical parity guard so the fork cannot reappear. Dispatch: [`_dispatches/2026-07-27_QA5_bearing_parity_restore.md`](../_dispatches/2026-07-27_QA5_bearing_parity_restore.md).

---

## Dispatch shape (fewer agents, tighter contracts)

Ready-now BUCKET A waves (no design spec, no collision):
1. ROAD-STYLING fixer — Area 1 (RD-1..RD-7); one builder; `road-overlay.ts` + `overlay-render.js`; styling regression test promoted. → **QA1**
2. SITE-PLAN-CRAFT fixer — Area 3a (SP-1..SP-8); one builder; `annotation-placement.ts` + `render.ts` + `layout.ts`; label-non-overlap test promoted. → **QA2**
3. CC-STRUCTURE fixer — CC-1/CC-2/CC-3 (the three MAJORs); one builder; then a CC-legibility pass (CC-4..CC-8). → **QA3**
4. **QA4 GO** — Overpass honest fallback (`hauska-engine`); dispatch `_dispatches/2026-07-27_QA4_overpass_honest_fallback.md`. Self-contained; coordinate B1 probe only.
5. **QA5 GO** — Bearing parity restore (`hauska-engine`); dispatch `_dispatches/2026-07-27_QA5_bearing_parity_restore.md`. Self-contained.

BUCKET B (design-then-build; spec first):
4. Report-suite design spec (3b), study render-what-exists spec (QA-STUDY-1 + FEMA polish), non-drawing-parcel UX spec (QA-PE-4).

BUCKET C (flag, don't build under QA):
5. LiDAR/1-ft-contour/hydrology ingest (QA-STUDY-2) — its own fidelity-v2 item, operator-scheduled.

Every fix: builder does NOT self-grade; planner verifies live across multiple different-data parcels before MET; promote to a mechanical guard where possible (styling regression, label-non-overlap, parcel-behavior smoke).
