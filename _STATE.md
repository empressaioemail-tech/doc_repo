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

- engine-api: `hauska-engine-api-00126-dip` @100% (Sheet Standard v1.3 + #172 export-consumes-boundary-primitive: one envelope truth, uniform-min + vertex-count fork DELETED, header=drawing, attach plausibility, ingest fixture-guard, street-label fallback; envelope-canary repointed). Prior: `00123-muk` (hydrology floor #164 + /nodes #165 + aerial page #166/#167/#168; 4Gi/300s preserved; envelope-canary tag repointed). Project hauska-prod-497015. 4Gi is LIVE-SET only. Deploy = Cloud Build cloudbuild.engine-api.yaml → --no-traffic --tag → smoke → update-traffic. RESIDUAL: cold start can exceed the PE fn 60s cap once (observed on the traffic shift); consider min-instances=1 (operator cost call).
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
- B2 (drawings+aerial with site plan) DONE + LIVE-VERIFIED: #166 (aerial page 3) + #167 (1024px cap) + #168 (cached-LOD resolution floor 0.33 merc-units/px — the REAL constraint: Esri export 500s finer than level 19 ≈ 0.3 units/px, found by live bisection; pixel count alone was a red herring). Gold-parcel smoke on serving revision: refresh 201 with aerialImageryEmbedded:true, 3-page 508KB PDF, embedded 238x263 aerial extracted + visually confirmed (201 Maynard St). Honest-unavailable panel verified working when the fetch fails.
- Deploy notes: retrieval-api = `gcloud run deploy hauska-retrieval-api --source .` from engine root (env preserved when flags omitted; canary tag + smoke + shift); MCP = cloudbuild-mcp.yaml; migration apply = packages/storage/scripts/apply-migration.mjs w/ DATABASE_URL from Secret Manager (check script covers new migration file).

(The 2026-07-28 spec's QA/PORT cluster items A-G + B2 are ALL RESOLVED — see the block above. Spec kept at `_inbox/2026-07-28_pe_cc_qa_and_reports_spec.md` for history.)

QA register status (register: `_inbox/2026-07-27_bastrop_qa_defect_register.md`):
- QA-CC-PORT: SHIPPED (#94 CC nav/linkage + #165 /nodes endpoint; live-verified with screenshots). Residual polish only if operator flags it.
- QA-CC-BUG: inspect-timeout FIXED (migration 008 indexes; gold-parcel detail 195ms live, was 20s-timeout). Tally freshness: live tally loads (~20-45s cold on the stats query); artifact fallback + STALE banner remain the honest degrade — not reworked, flag if operator wants the stats query made fast.
- QA2.2 (site-plan template-match): WAS ALREADY DONE — PR #159 squash-merged 2026-07-27 (cf7e700); the ledger's "in-flight branch" read was the squash-merge false-stranded signal (branch showed unmerged commits; `gh pr view` showed MERGED). Remote branch deleted 2026-07-28 to stop the false signal. Verify PR state via gh, not branch commits.
- More QA polish changes: operator resuming QA 2026-07-28; findings incoming.
- SETBACK HOLISTIC DIAGNOSIS (2026-07-28 evening, planner + 2 recons + live-atom probes): data chain is RIGHT (descriptor + setback atoms carry front:15 + side/rear not_specified honestly); the site-plan EXPORT ran its own pre-primitive per-edge geometry (vertex-count branch: n==4 geometric front guess, n!=4 uniform-min FABRICATION of side/rear from the front value) + false-degenerate gates on jog edges + a header regex fallback printing a warm number over a degenerate drawing. A FABRICATED FIXTURE ROAD (48021:road:123456789 "Spring Street", seeded by a pilot ingest defaulting to fixture against live DB) was IN THE PRODUCTION STORE poisoning frontage/front-edge anchors — planner DELETED it (verified 0 remaining; other Spring Streets are real). Master review caught the first fix attempt hardening the old per-edge path — STOPPED; re-dispatched as fix/export-consumes-boundary-primitive (export routes through the boundary primitive; one truth by construction; reconciliation gate). Build-to-line RULING ratified: not_specified side/rear = zero inset + provisional label (in mold). ACREAGE: store+cortex endpoint are 100% complete (live-verified); the card's "not verified here" is the ATOM-PATH card flow hardcoding coverage false (atom-chain-to-facets.ts) — fix in the W14 UX cluster.
- SETBACK CLUSTER RESOLVED (2026-07-29 early AM): #172 merged+deployed (engine 00126) — export consumes the boundary primitive (reconciliation gate: one computation); LIVE-VERIFIED on all four evidence parcels: 34177 false-collapse GONE (real 15,414 SF envelope, header==drawing, PECAN/PINE STREET labels back), 34737 map==export (19,907 vs atom 19,906, front-only on the primitive front edge). Old-heuristic wrong-front-edge defect (14,629 vs 13,632 on 4-edge rings) also killed. RESIDUAL (honest): export vs elder promoted-atom areas can skew by data vintage (34177: 15,414 now vs 16,046 promoted 07-26) — converges on next depth-warm re-promote since both read the same primitive; ALSO the stored front-edge ROLE for 34177 faces Pine (not Pecan situs) — per-parcel role adjudication is a primitive-data question, now uniform across all surfaces. W14 UX cluster (#95) MERGED+DEPLOYED to PE prod: unified toolset, transient chips (honesty states persist as layer-row dots), true layer toggles incl. zoning-fill unbind, personas removed, brief docked top-center, atom-path base-facts merge LIVE-VERIFIED (34729 card now serves A1 + 0.263 ac). W13 finding: facet store 100% acreage-complete; card gap was the atom-path hardcode (fixed in #95).
- SHEET STANDARD v1.0 SHIPPED (2026-07-28 evening): operator's binding 20-rule site-plan renderer standard (design pack at P:\tmp\Siteplan style template design (1)) implemented as engine PR #169 (+2831/-888; Barlow fonts replace Inter; new deps pngjs/@types/pngjs; duotone aerial; collision cascade + draw-once MarkRegistry; checklist-as-tests on gold+degenerate fixtures; standard committed in-repo at engine-core/src/site-plan/pdf/SHEET_STANDARD_v1.html). Live-verified on rev 00117 (gold parcel, 3-page PDF rendered + graded). REFINEMENT ROUND 1 (operator finding: text crowding rules page-wide) shipped as #170 / Standard v1.1: §21 VERTICAL RHYTHM — metrics-driven lineBox() from fontkit (13px body: rule→cap 13.3px, was ~2.9px; baseline→rule 12.0px, transcribed from the operator's mock: space-2 pads + lh 1.6), applied to all text-against-rule placements on all 3 sheets; NUMERIC rhythm gate (result.rhythm seam + vertical-rhythm.test.ts — raster golden-diff skipped: no pure-JS rasterizer without native canvas); §11 fixes (flood machine string → plain sentence w/ detail in provenance only + isCleanReasonSentence now rejects colons; setbacks cell → one grey qualifier). Live-verified on rev 00120 on the operator's OWN screenshot parcel 48021:34769 w/ address (rhythm correct, qualifier correct, flood resolved zone X live). FORMATTING/RHYTHM APPROVED by operator. REFINEMENT ROUND 2 (#171 / Standard v1.2, operator-directed): context layers GEOMETRICALLY CLIPPED to the drawing frame (bleed gate: every mark bbox ⊆ frame, tested on gold+dense+synthetic-wide-context; gate also caught+fixed an uncapped degenerate-callout size), road labels NAMED STREETS ONLY (machine road-IDs a forbidden test string; unnamed roads draw unlabeled), aerial NATURAL COLOR (duotone+pngjs removed; §20 rewritten; paper outlines kept), header meta never prints raw FIPS. Live-verified on rev 00123 on the operator's bleed parcel 48021:47719 (806 Pine St): sheet 1 fully framed, PECAN/PINE STREET labels only, county name in meta; sheet 3 natural imagery, overlay legible. OPERATOR TESTING NEXT.

PE reports / functions (NEW — needs a plan):
- The customer app (PE) exposes ~3-4 reports; the spine can back ~15+ (brief, hazard, encumbrance, dossier, plan-review, deliverable letters). Audit: `_inbox/2026-07-27_app_vs_cc_report_audit.md`. DECISION OWED: which reports PE offers + is PE the unified report surface. This is a product+design+data program, not a QA ticket.

Public-data completeness (NEW — recon done):
- Only ingested ~4 of 26 county folders. Ungrabbed public layers: aerial imagery (2019-2024), hydrography (Creeks_Streams), address points, subdivisions, city water/utility CCN. Recon: `_inbox/2026-07-27_bastrop_public_data_completeness_recon.md`. Ingest-prioritization dispatch HELD pending report-set decision.

## PE WORKBENCH BUILD (started 2026-07-29, spec: _inbox/2026-07-29_pe_workbench_concept_spec.md)

ALL FOUR WAVES SHIPPED + DEPLOYED SAME-DAY (PRs #100 chassis / #101 verdict+reports / #102 chat / #103 properties+share; live-verified on prod):
- Chassis: top-right bubble cluster + ONE shared dock, per-property persistent tool state (pe:workbench:tool-state:v1, latest-10 cap), honest coming/select-first states. Pinned API: WorkbenchToolDef + useDockToolState + WorkbenchHostActions (types.ts docstring).
- Brief leads with a deterministic VERDICT LINE (red flags lead; "no red flags" only when all four facts present+clean; absences never earn it). Reports bubble took site-plan+terrain exports off the card.
- AI CHAT (extension flow port, recon-grounded): verbatim starter chips + id remap, areaContext.subject + visibleParcels eligibility anchor, last-8 history, numbered-citation chips → IN-THREAD expansion + freshness badge (client-side, no fetch), 401/402/400/5xx honest; proxy allowlist +api/brokerage/v1/research/chat (session Bearer; extension's install-id wedge NOT ported). NOTE: {{atom:}} markup is DEPRECATED corpus-wide — chips derive from citations+brief inlineRefs (the spec's markup assumption was stale).
- My Properties (cortex saved-properties routes surfaced; allowlist TIGHTENED to exact/one-segment; the card's old Save button was DEAD — now unified through one save flow) + SHARE: HMAC-signed 30-day single-parcel token (PE_SHARE_SECRET minted in Vercel prod 2026-07-29 — first mint was a PS5.1 zero-byte trap, caught+replaced), no-account /share#<token> view serving verdict+cited brief (anonymous owner-stripped snapshot projection, buildR1Brief parity-pinned) + site-plan/terrain DOWNLOAD-ONLY; expired≠invalid distinct 403s. Live checks: garbage token 403, unauth mint 401, five tools in bundle.
- DEFERRED (unchanged): extension-as-funnel, county-records-docs, broader report-set decision, atom-seeded starter chips.
- OWED: operator's signed-in live pass (chat round-trip, save/reopen, mint+open a share link).
- POLISH + DOSSIER EXPANSION (2026-07-29, operator-directed, all six suggestions greenlit): #104 polish (saved-reopen FLIES the map — also fixed the search parcel-path's identical latent no-fly bug; chat SELF-SOURCES property context from facets, brief no longer a prerequisite; dock scrolls w/ pinned header instead of clipping). #105 DOSSIER core (master→detail+back in the one dock; drawings saved as GeoJSON + redrawn via new MapToolsController getDrawings/setDossierOverlay seams; Save-chat-to-property w/ labeled AI summary via one extra chat call; exports auto-attach; notes 4k; snapshot size discipline — no blobs; ", ," label fallback fixed). #106 COMPARE dock tool (two saved properties side-by-side cited facts, verdict composer reused, law-compliant one-dock). #107 PINS+STATUS (server-truth star pins w/ save-time coords + status accent colors, LAYERS toggle, pin-click reopen; researching/offer/passed chips + >5-entries filter). All merged+deployed+bundle-verified 2026-07-29.
- IN FLIGHT: WB7a cortex share-dossier service-key route (ldt PR at CI; then cortex deploy + PE share-view leg renders drawings/chat-summary/notes) + WB7b engine dossier-PDF export (Standard-styled cover/brief/summary/notes + appended site-plan sheets; then engine deploy + MCP tool + PE Reports leg). Follow-up flagged: freeform tags.
- R1 PAYWALL SHIPPED + LIVE (2026-07-29 eve, per the LOCKED plan 0165d55): cortex #363 (pe_property_unlocks + pe_chat_message_counts migration 0063 APPLIED via workflow train; property-scoped server gates on brief/chat; signed-in free counter 3/property atomic; summary=paid never counted; dev-unlock stub at /entitlement/dev-unlock — planner aliased the PE-pinned path; NO Stripe) + PE #110 (usePropertyEntitlement proactive hook w/ client-soft feature-detect; unified two-choice unlock flow $15-property/$99-sale-$149-Pro from one pricing config; per-bubble lock states; terrain Pro-only; share folded; chat meter + wall; old Pro-hardcoded copy gone, absence-tested). Cortex 00444-xak @100%; PE deployed; anon shape verified live; signed-in matrix server-test-pinned (23 tests incl. exactly-3 concurrency). OWED: operator signed-in pass of the line. LIVE-PAYMENTS wave (Stripe one-time + webhook → createPePropertyUnlock) is the isolated follow-on.
- HYDROGRAPHY SWAP DONE + LIVE-VERIFIED (2026-07-29, spec addendum aa24c98): engine #175 county hydrography slot (registry-driven, Bastrop Creeks_Streams MapServer — NO FeatureServer/NO pagination quirks coded around, live-probed) + PE #108 layer swap ("Hydrography" replaces the D8 customer layer; D8 stays engine-side as report input) + #109 BFF CONSOLIDATION (pe-map-layers dispatches topography/hydrology/hydrography — the #108 deploy FAILED on the Vercel Hobby 12-function cap; now 11 functions, one slot reserved for the Flood&Drainage report BFF; gotcha in mold). Engine 00129-how @100%; end-to-end: PE prod serves Piney Creek + county streams in 660ms. NEXT (queued behind WB7b's document pattern): H3 engine Flood&Drainage Standard-styled report document (catchment/zones/rainfall-ponding/flow, public-paid) + H4 PE report bubble (run-in-dock, sharp viz, PDF export) — the FIRST paid report bubble, pattern-setter.

## HELD / NOT STARTED (by design — do not start without operator go)

- CTX / Hays / national county fan-out (until Bastrop QA-done + go).
- Track C: thin CC engine-control panel + "start county X" launch surface (last by design).
- Fidelity v2 beyond topo: true ROW, plats, easements, courthouse records (Vertosoft channel product — Bastrop gift-demonstrator, records-as-downloadable-docs).
- Living-layer sensing engines (zoning-change/annex/ownership/permit/subdivision — temporal atoms exist, sensors not built).
- Marketplace / write-back contract (vision).
- Bastrop infra-twinning (streetlights/traffic — city layer, likely needs city data handoff).

## THE MOLD (engine-build prerequisite — keep it current as QA continues)

`28_THE_BASTROP_MOLD_engine_build_spec.md` = the specification the CTX/national engine build reads. What a complete county contains + every baked decision/gotcha the engine must replicate. LIVING doc: any agent that fixes/builds a COUNTY-GENERAL thing must add the lesson to it (capture protocol at the doc's end). When the operator returns to build the fan-out engine, this doc + _STATE.md + MEMORY.md are the input — no archaeology.

## KEY DOCS (the map)

- Program: 27_MASTER_WDLL, 27a (engines), 27c (road node), 27d (recipe), 27e (multi-track), 27f (Bastrop-through-v2 stack).
- Bastrop definition: `_inbox/2026-07-27_bastrop_composition_inventory.md` (what's IN Bastrop, verified against code).
- QA plan: `_inbox/2026-07-27_bastrop_qa_defect_register.md`.
- Reports: `_inbox/2026-07-27_app_vs_cc_report_audit.md` + `_inbox/2026-07-16_command_center_function_matrix_bizdev_handoff.md`.
- Strategy: `_decisions/2026-07-26_base_layer_connecting_tissue_thesis_and_tracks.md`, `_decisions/2026-07-27_county_records_channel_and_bastrop_demonstrator.md`.
- Last session: `_sessions/2026-07-27_bastrop_completion_multitrack_and_hardening_claude_code.md`.

## HOW TO USE THIS FILE

Fresh agent: read this + MEMORY.md FIRST, then the specific doc for your task. Update the OPEN and LIVE INFRA sections as you change state. This file is the pickup point — keep it true.

## MCP + ICC thread (2026-07-29 — audits in flight)

The strategic frame: PE made the property-intelligence stack HUMAN-consumable; MCP makes the SAME stack AGENT-consumable + discoverable + metered. ICC is the first licensed SOURCE and the worked example / demo account for the metering model. MCP + ICC share one root: the metered-citation pipe (inbound = what we owe ICC per reference; outbound = what agents pay us per call; both fire on one atom's provenance).

OPERATOR RULINGS (2026-07-29):
- ICC = an ON/OFF SWITCH. ON = demo mode (show ICC "here's how it works in the app" + "here's how we meter/pay on the backend" — likely a Command Center ICC usage/account screen where ICC logs in and sees usage). OFF = default, so PE commercializes/launches WITHOUT ICC (respects the license: ICC content is NOT customer-facing until the SaaS agreement is signed post-demo; accessPolicy platform-internal until then). The switch elegantly solves the license constraint AND enables the demo.
- MCP VISUAL OFFERING: agents should get VISUAL answers. Achievable-today = return a RENDERED map/site-plan IMAGE (MCP supports image content; ChatGPT/Claude render inline) alongside the cited data — reuses the renderer we built; nobody's property-MCP does this well = the outstanding offering. Frontier (design toward, not v1) = a LIVE INTERACTIVE embedded map (OpenAI Apps SDK / MCP-UI — emerging, platform-specific). Lead with the image (universal), layer interactive as platforms mature.

IN FLIGHT (read-only audits): MCP tool-surface-vs-PE-stack gap audit; ICC actual-live-state + license-compliance verification (agent said done, unverified). Results pending.

## THE NEXT MAJOR PROGRAM (after PE lands) — the fan-out engine / national onboarding

DO NOT LOSE THIS. The single largest roadmap item: build the ENGINE that fans agents to onboard the rest of the nation — CTX first, then all of TX, then national. It has been correctly HELD on ONE gate: "wait until the Bastrop PE build is complete so we fan from a PROVEN, COMPLETE reference county." That gate is about to clear (the 2026-07-29 PE coordinated session is the last piece of Bastrop-market-ready).

STATUS: gated-and-ready, NOT behind.
- The mold is defined + adversarially hardened: `28_THE_BASTROP_MOLD_engine_build_spec.md`.
- The recipe generalizes: Caldwell #2 (7/8 gates carried).
- Bastrop is the proof, now essentially complete.

ENGINE-BUILD PREREQUISITES (from the mold's own review — do before/with the fan-out):
- Build the PHANTOM GATES: recipe gate 7 (TALLY+COST) and gate 8 (SMOKE/end-to-end-live-availability) are PROSE not mechanical today — a fan-out without a real smoke gate = the scan-fix trap at national scale. Build them fail-closed first.
- Harden M0 cc-agent-REACH so county-lane agents start warm (standing decisions travel in the recipe dispatch).

SEQUENCE: PE lands (human + agent MCP-v1) -> THEN the fan-out engine (CTX -> TX -> national) becomes the next major program. This is what makes the positioning ("the national property-intelligence layer") TRUE at scale, not just for Bastrop. It runs in parallel with / ahead of the MCP-scale and ICC-plan-review threads.
