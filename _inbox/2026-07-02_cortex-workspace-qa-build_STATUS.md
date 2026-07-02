---
id: inbox/2026-07-02_cortex-workspace-qa-build_STATUS
title: Cortex Workspace QA build — live status (autonomous, phased)
status: active
last_updated: 2026-07-02
---

# Cortex Workspace QA build — live status

Follow-on to the Shared Surface Sprint. Operator walked the deployed workspace, filed a QA list
+ strategic direction. Decisions (2026-07-02): Phase 1 then Phase 2; files on GCS now (VDA/IPFS
later); read empressa-trading directly for layout-v2 parity. Same autonomous process as the sprint
(lead agent per track, adversarial review, canary deploys; planner merges + verifies).

Governing rule: every function returns a real result or an HONEST degraded state — never a hard 500
(commitment #1). One shared active-parcel context; address-search AND map-click both set it.

## Phase 1 — make it all work (RUNNING)

| Track | Repo / service | Status | Scope |
|-------|----------------|--------|-------|
| T1 engine fixes | hauska-engine / engine-api | RUNNING | Property Brief no-500 fallback + ANTHROPIC key mount; Hydrology pysheds in worker; Subsurface USDA TLS; ICC contract verify/wire; Precedence prod gate |
| T2+T3 workspace | legacy-design-tools / cortex-api | RUNNING | shared active-parcel context; address search + map-click select + map-click->summary; finish shell tiles (Findings Library, Local Setbacks, Document Parsing, Product Spec); render Hazard; wire Topography/Drainage; honest status labels |
| T4 map overlays | hauska-map / npm | CODE MERGED (PR #3, ed63541); PUBLISH PENDING NPM_TOKEN | setOverlays + overlays prop wired (reviewer 15/15, idempotent add/remove); v0.1.1; publish-on-tag workflow added. To publish once NPM_TOKEN set: `git tag map-renderer-v0.1.1 ed63541 && git push origin map-renderer-v0.1.1`. Then bump cortex cortex-tiles to ^0.1.1 + pass overlays in MapTile (small follow-up). |
| Scout | empressa-trading (read-only) | RUNNING | document admin panel + edit/view fuse-together + docking UX + layout persistence for Phase 2 |

Phase-1 deploy safety: T1 -> engine-api, T2/T3 -> cortex-api, T4 -> npm — three distinct targets, no
canary races. Map-overlay end-to-end draw is gated on T4 publishing 0.1.1 + a cortex bump (small follow-up).

## Phase 2 — the experience layer (QUEUED, after Phase 1 verified)

- Layout v2: edit/view fuse-together, functions-drawer snap + reflow, non-card/list render, server-persisted shareable spaces (adapt empressa-trading admin + edit-mode).
- New functions: Dataroom/Files tile (GCS, from IP counsel deck); Module Map surface (what each tile does + persona per module); absorb trading-app admin components into the spine console (operator/admin surface; distinct from the product workspace).

## Operator items

- Set `NPM_TOKEN` Actions secret on hauska-map so CI can publish map-renderer 0.1.1 (and future):
  `gh secret set NPM_TOKEN --repo empressaioemail-tech/hauska-map` (paste token at prompt).
- ANTHROPIC_API_KEY on engine-api: T1 mounts it if a Secret Manager secret already exists in
  hauska-prod-497015; if not, the brief still works via graceful fallback and the key becomes an
  operator add. T1's close report will say which.

## Not-in-this-wave (honest scoping)

~13 PLANNED tiles (stormwater, cut-fill, solar, viewshed, climate risk, insurance, pro-forma,
deal-score, motivated-seller, rehab, permit-AHJ-precedent, code-change-broadcast, jurisdiction-
comparison) need real engine/data capability that doesn't exist yet. These are a prioritized
roadmap, not this wave. Phase 1 makes every LIVE/PARTIAL tile actually work first.

## Spine command center

Back online at localhost:5174 (hauska-map vite). Role decided: operator/admin console (spine
inspector + trading-app admin components in Phase 2), distinct from the product cortex workspace
(localhost:19592). Tile composition stays in compose_workspace; not duplicated in the spine console.
