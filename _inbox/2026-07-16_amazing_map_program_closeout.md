---
id: 2026-07-16_amazing_map_program_closeout
title: Amazing Map program — closeout list (deploys done, operator items, open flip)
status: active
last_updated: 2026-07-16
applies_to: hauska-engine, legacy-design-tools, hauska-mcp-server, hauska-map, hauska-brief-extension
related: [2026-07-16_map_data_sourcing_rulings, 2026-07-16_map_data_gaps_pickup_list, 2026-07-15_parcel_mesh_ifc_build_complete_handoff]
owner: nick
---

# Amazing Map program — closeout list

Consolidated record of the three-track "amazing map" program (mesh/IFC + map-data completeness + research-fix) plus the folded-in sourcing track. Merges + A2 deploy complete and planner-verified. This list is the operator's remaining deliberate items and the open decisions.

## Shipped (merged + deployed, planner-verified)
- Mesh/IFC chain: engine #97, ldt #272 (mesh + IFC + Dockerfile deps + regrid-parcel removal), mcp #42 (generate_parcel_terrain_model), map #29 (tile). All merged.
- Sourcing: #273 federal cache, #274 rent public area-layer (commitment-#1 disclosure enforced), #275 SSURGO tile push. #271 (Track B cortex-tiles federal layers) reconciled from published-but-unmerged drift.
- Brief: map stack (#10-13 collapsed via #15) + research-fix #14.
- cortex-tiles 0.1.10 published to npm (SubsurfaceTile SSURGO push).
- A2 DEPLOY complete: engine-api 00057-gic @100%, cortex-api 00331-luf (migration 0056 applied), mcp-server map42 @100% (by_gate.map 6->7, generate_parcel_terrain_model LIVE), command-center Vercel READY.

## OPEN — deliberate operator decisions

### AUTH-GATE ENFORCE FLIP (deferred, operator-run when ready)
The `ENGINE_API_GATE_TOKEN` enforce lane: flip the engine bearer gate from OFF to enforced. It is a SEPARATE security workstream, deliberately NOT part of the mesh/IFC feature deploy (the 07-15 handoff only required not interleaving it with the engine deploy). The A2 engine deploy was image-only and touched no gate config; the gate behaves exactly as before (401 gate_front_context_required unchanged). Run this deliberately when the security posture change is intended — it is not a feature-deploy step and has its own NO-GO procedure. Not run by the planner.

## OPERATOR data-pull / config queue (none block anything shipped)
- CENSUS_API_KEY on cortex-api Cloud Run (project 1062716564162) -> activates real rent values in the #274 area-layer. Until set, the layer renders tract polygons with medianGrossRent:null + operatorDataPullRequired flag + the mandatory "area estimate" disclosure (never a fabricated number). Signup https://api.census.gov/data/key_signup.html. Optional ACS_RENT_VINTAGE. HUD SAFMR ZIP overlay deferred (needs a HUD USER token).
- OZ national GCS publish: the bundled OZ file carries the real Central-TX wedge (68 tracts); full national (8765 tracts) hydrates from GCS via ingest-opportunity-zones.mjs -> GCS. Operator publish job.
- Motivated-seller signal ingests (4, each modeled + auto-lighting when its store lands): pre-foreclosure NOS, tax-delinquency roll, lis-pendens/liens, probate. Absentee is live today from cad_property.
- CENSUS/rent + OZ + seller ingests are all public-record/free per the R1/R3 rulings.
- R1 commercial rent-heat (per-parcel): OPERATOR-OWNED. Nick confirms RentCast (lead) or alternate written redistribution/derived-display terms before any commercial rent layer ships. Planner gates no build on it; commercial rent stays off the surface until cleared.

## SECURITY — storage exposure: gated-retrieval route BUILT (#286); residual on /storage/objects flagged
- ORIGINAL EXPOSURE: `GET /api/storage/objects/*path` is UNAUTHENTICATED (dead commented replit-auth ACL; this api-server has NO session/passport auth to hook). Streams any `uploads/<uuid>` object anonymously to anyone who knows the UUID. Pre-existing (2026-05-01 Replit scaffold).
- RESOLVED for terrain (PR #286, gated-terrain-retrieval): NEW gated route `GET /api/brokerage/v1/place/:placeKey/site-topography/{mesh,ifc}` behind the brokerage gate (requireBrokerageAuthOrServiceToken, 401 on bad key). Authorization BY CONSTRUCTION: caller passes only placeKey; the route resolves the engagement, derives the object path from that engagement's meshRef/ifcRef, streams only that object — no caller-supplied UUID, so arbitrary-object access is impossible. Terrain download + 3D viewer consume THIS, not the ungated route.
- RESIDUAL (flagged, operator-aware): `/storage/objects` itself was HARDENED (flat uploads/<entity> only, traversal-proof, dead ACL removed) but NOT hard-gated — its only callers are browser <img>/<a> GETs (plan-review avatars, encumbrance PDF viewer) that can't attach a header credential, so gating would break them with no fallback. So any `uploads/<uuid>` is STILL anonymously readable by someone who knows the UUID (opaque, non-enumerable, now traversal-proof = smaller risk, non-zero). FULL fix = migrate avatars + encumbrance-PDF serving to short-lived signed URLs (signObjectEntityGetUrl), THEN delete the open route — a separate build touching plan-review, scoped as follow-up (the agent correctly did not break the browser flows). Operator decision on urgency of fully closing it.

## 503 resolution — FULLY RESOLVED (three distinct causes, all fixed)
The brief/terrain 503s turned out to be THREE separate things, found in sequence by smoke-gating live rather than trusting inference:
1. Terrain-route deterministic 503 = `mcpPlaceEngagement` inserted `engagements` without `owner_user_id` (0038 made it NOT NULL) -> 23502. FIXED by PR #280 (SERVICE_PLACE_OWNER_USER_ID = "service:mcp-place" sentinel; no users FK so a string is safe). This had been breaking the MCP-place path for anonymous callers on prod since 0038.
2. Terrain CPU contention (heavy pysheds/ifc/mesh authoring on the brief-serving container) = FIXED by the async terrain job (PR #279): refresh returns 202 + a job worker authors off the request path + the mesh nested-loop moved to a worker_thread. Migration 0057_terrain_generation_jobs.
3. Cold-start 503s = min-instances=0 meant requests hitting a cold/recycling instance 503'd during the ~10-15s boot (confirmed: "Server listening"/STARTUP probe events coincided exactly with the 503s; warm requests returned 202/200). FIXED by setting min-instances 0->1 (config-only, concurrency stays 80). This is the surgical evidence-grounded version of the earlier reverted concurrency=8 guess.
Deployed: cortex-api revision 00336-jir @100% (both code fixes), min-instances=1. Verified live: terrain refresh 202, brief 200, zero 23502. Brief async side merged (#17 = A4 parcel-terrain + async poll; #16 closed). Planner note: my first two diagnoses (concurrency, then CPU-contention-only) were partial/wrong; the deploy-agent smoke against live found the real deterministic bug. Lesson reinforced: smoke against live + halt at the gate beats inference.

## Superseded tuning note (cortex-api concurrency)
- During QA the brief endpoint + the new site-topography/terrain route intermittently 503'd (5x 200 / 4x 503 in a clustered ~90s burst under QA load; the deploy itself was healthy — 200s at 20-30s prove the feature works). Root cause: cortex-api ran at containerConcurrency=80 with no warm instance; heavy 20-30s brief work now shares instances with CPU-bound terrain (pysheds + ifcopenshell) authoring, so several concurrent heavy requests on one cold instance starved and timed out ("malformed response / connection error" -> 503). Resources were already 8Gi/2CPU (not under-provisioned). FIX APPLIED (config-only, same image, reversible): concurrency 80 -> 8, min-instances 0 -> 1 (warm). Verify briefs + terrain stop 503'ing under QA; if terrain (heavy IFC authoring) still times out, the deeper fix is to move terrain/mesh authoring OFF the synchronous request path (async job + poll) rather than raise timeout — flagged for later. USGS 3DEP upstream outages will still surface as an honest terrain 503 (upstream, not ours).

## Infra fix worth doing
- hauska-map Vercel git auto-deploy did NOT fire on the #29 merge (planner deployed manually via vercel --prod). Check the cmdcenter project's git connection so future map merges deploy automatically.

## Open PR (sourcing track)
- #276 (OZ + buildable-envelope + constraint-density + motivated-seller, 4 composites on one branch): Test job RED on head 839d81bb; handed back to the sourcing agent to diagnose+fix. Independent of everything shipped; blocks nothing. Merges on green.

## Remaining program build (planner, in progress)
- A3: cortex-client parcel-terrain-model capability -> publish -> command-center consumes (surfaces the now-live MCP tool in the tile registry).
- A4: Brief click-parcel -> generate_parcel_terrain_model -> GLB/IFC download in the map card (operator-QA surface).
