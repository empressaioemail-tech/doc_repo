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

## Phase 1 — make it all work (COMPLETE 2026-07-02)

Precedence: already resolved on the live revision (PRECEDENCE_ENGINE_PRODUCTION=1 on cortex-api-00279-boj; tile `live`, real cited reconciliation, 86/86 tests) — the operator screenshot was from an older revision; no change/redeploy needed. Gated residuals to operator: NPM_TOKEN (publishes map-renderer 0.1.1 -> overlays draw via a one-line cortex bump); ICC OpenAPI spec (adapter built vs assumed contract). Quality follow-ups: hydrology DEM->GeoTIFF (works degraded now); pin Docker wheels; cosmetic dead degradedReason on the now-live hydrology tile.


| Track | Repo / service | Status | Scope |
|-------|----------------|--------|-------|
| T1 engine fixes | hauska-engine / engine-api | COMPLETE — merged (PR #77, 5b4fa29); hauska-engine-api-00014-26f @100% | Property Brief 500 FIXED (200 live; anthropic->grok->mock; ANTHROPIC+XAI secrets already existed, mounted — no operator secret owed). Subsurface SSURGO FIXED (honest upstream-error, no raw ECONNRESET). Hydrology pysheds installs+loads but hits a DEM-format bug -> degrades honestly to native-D8 (200); DEM->GeoTIFF wrap is a quality follow-up. ICC OPERATOR-GATED (built vs assumed OpenAPI; needs real ICC spec). Precedence CORTEX-SIDE (productionWire.ts in cortex-api) -> handed off to a cortex follow-up. Non-blocking: pin Dockerfile wheels. |
| T2+T3 workspace | legacy-design-tools / cortex-api | COMPLETE — merged (PR #220, 6535958); cortex-api-00279-boj @100% | shared active-parcel (EngagementProvider/useActiveParcel); 3 setters (queue row, new POST /plan-review/geocode address search — live-verified, map-click onParcelSelect->compact PropertyBrief summary); Property Brief address input + degraded-tolerant render; Hazard renders (raw behind toggle); 4 shell tiles built (Findings Library, Local Setbacks, Document Parsing, Product Spec); Topo/Drainage summaries + overlay push; 10 live-but-stub -> partial (honest). Reviewer fixed 1 HIGH (address-search parcel override). Overlays draw with a single 0.1.1 dep bump (prop + toMapOverlays already in place). |
| T4 map overlays | hauska-map / npm | CODE MERGED (PR #3, ed63541); PUBLISH PENDING NPM_TOKEN | setOverlays + overlays prop wired (reviewer 15/15, idempotent add/remove); v0.1.1; publish-on-tag workflow added. To publish once NPM_TOKEN set: `git tag map-renderer-v0.1.1 ed63541 && git push origin map-renderer-v0.1.1`. Then bump cortex cortex-tiles to ^0.1.1 + pass overlays in MapTile (small follow-up). |
| Scout | empressa-trading (read-only) | RUNNING | document admin panel + edit/view fuse-together + docking UX + layout persistence for Phase 2 |

Phase-1 deploy safety: T1 -> engine-api, T2/T3 -> cortex-api, T4 -> npm — three distinct targets, no
canary races. Map-overlay end-to-end draw is gated on T4 publishing 0.1.1 + a cortex bump (small follow-up).

## Phase 2 — the experience layer (RUNNING 2026-07-02)

| Track | Repo | Status | Scope |
|-------|------|--------|-------|
| P2-shell | legacy-design-tools / cortex-api | RUNNING | prominent header search + autocomplete; edit/view fuse-together (.fs-seamless); dock-back + template reflow; non-card list/report layout; server-persisted shareable spaces (tenant-private-ready schema); Module Map surface (tile + persona) |
| P2-spine | hauska-map (console 5174) | RUNNING | lift trading-app admin Control Tower skeleton (ControlCenterLayout + PanelRegistry) into the spine console; wire 2-3 panels live (atoms/runs/calibration) vs our APIs; rest stubbed |
| Dataroom + file->atom | legacy-design-tools + hauska-engine | DEFERRED to post-deep-review | Dataroom/Files tile (GCS) + the engine unstructured->atom ingestion. Built to the shape the deep review recommends (embed-with-atom vs atom-points-to-blob), not guessed. |

## Deep review (RUNNING 2026-07-02) — feeds Phase 3 shape

3 read-only analyst agents -> planner synthesizes into _research/2026-07-02_ai_native_and_twin_review.md:
- DR-1 AI-native audit: atoms/MCP/semantic-retrieval/agent-write-back/**unstructured->atom design**/VDA/eval.
- DR-2 architecture-at-scale: tenancy-auth gap (critical path), spine<->BFF decoupling, calibration loop, cost/caching, failure modes.
- DR-3 twin/node/customer: node-as-aggregator + tenant-private overlays; **private operational data (utility/3D-BIM/IoT sensors) as atoms**; the **digital-twin-creator customer persona** (pursue/park/shape).

## Phase 3 (tenancy + twin) — shaped by the deep review, not yet built

- Auth/tenancy build (per-user, tenant-private isolation) — the critical path.
- Property node as first-class aggregator; digital-twin lifecycle (resolve -> public base -> engagement -> private operational overlays -> bitemporal versioning).
- Per-investor private atom collections on shared nodes.
- Twin-creator customer persona (if the review says pursue).

## Running pickup / backlog (reconcile later)

Operator-gated: (1) set NPM_TOKEN on hauska-map -> map overlays draw (step-by-step given); (2) bring ICC OpenAPI spec -> real I-Code ingest (step-by-step given).
Quality follow-ups (work degraded now): hydrology DEM->GeoTIFF; pin Docker wheels; remove cosmetic dead degradedReason on hydrology tile.
Design/canonical: write the digital-twin lifecycle ADR; refine the twin with private-operational-data + twin-creator persona (deep review).
Not this wave: ~13 PLANNED tiles (stormwater, cut-fill, solar, viewshed, climate-risk, insurance, pro-forma, deal-score, motivated-seller, rehab, permit-AHJ-precedent, code-change-broadcast, jurisdiction-comparison).
Map overlays end-to-end: publish 0.1.1 (needs NPM_TOKEN) + one-line cortex bump.

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
