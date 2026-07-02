---
id: sessions/2026-07-02_cortex_qa_phase2_deepreview
title: Session — Cortex workspace QA Phase 1, Phase 2 experience + file-to-atom, and the deep review
status: complete
date: 2026-07-02
agent: claude_code (doc_repo planner, master orchestrator)
related: [_inbox/2026-07-02_cortex-workspace-qa-build_STATUS, _research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-02_phase3_tenancy_sprint_plan, _dispatches/2026-07-02_next-planning-agent-handoff, 80_adrs/adr_024_shared_surface_package_architecture]
---

# Cortex workspace QA build, Phase 2, and the deep review

Continuation of the same session that ran the Shared Surface Sprint. The operator walked the deployed cortex workspace, filed a QA list plus strategic direction, and authorized the same autonomous multi-agent process. This session ran two phases of build plus a deep architecture review, all merged and live in production.

## Phase 1 — QA fixes (make it all work)

Four tracks on three services, no deploy races.

Engine degradation fixes (hauska-engine PR #77, hauska-engine-api-00014-26f). Property Brief 500 killed (200 live; anthropic to grok to mock graceful degrade; ANTHROPIC and XAI secrets already existed and were mounted, no operator secret owed). Subsurface SSURGO now returns an honest upstream-error instead of a raw ECONNRESET. Hydrology pysheds installs and loads but hits a DEM-format bug, so it degrades honestly to native-D8 (a DEM to GeoTIFF wrap is the quality follow-up). ICC is operator-gated (adapter built against an assumed OpenAPI contract; needs the real spec). Precedence was confirmed already live on the current revision (the operator screenshot was a stale revision).

Workspace context and tiles (legacy-design-tools PR #220, cortex-api-00279-boj). One shared active-parcel authority (EngagementProvider / useActiveParcel) read by every address-scoped tile, set three ways: the intake-queue row, a new address search (new BFF route POST /plan-review/geocode, verified live), and map-click (which also surfaces a compact Property Brief summary). Property Brief takes an address and renders; Hazard renders properly; four shell tiles built (Findings Library, Local Setbacks, Document Parsing, Product Spec); Topography and Drainage wired; ten dishonest live-stub tiles downgraded to partial.

Map overlays (hauska-map PR #3, @hauska/map-renderer@0.1.1 code-merged). setOverlays plus the FloatingMap overlays prop so spatial overlays draw. Publishing 0.1.1 is gated on the operator setting NPM_TOKEN; the cortex consumer bump is one line once published.

## Phase 2 — experience layer plus file-to-atom

Five tracks. All merged and live.

Spine admin console (hauska-map PR #4, 678517d). The trading app Control Tower skeleton lifted into the spine command center: 3-column ControlCenterLayout, PanelRegistry, hash routing, three panels wired live (Atom Inspector via MCP with the never-bare confidence block, Run Monitor, Surface and Gate), five stubbed. E1-E7 console unregressed.

Shell experience (legacy-design-tools PR #221, cortex-api-00281-joy). Prominent HeaderSearchBar (the front door); edit/view fuse-together (.ts-seamless, mount-once portal, FloatingTileLayer dock-back plus template reflow); grid or list layout; server-persisted shareable spaces (saved_workspace_spaces, migration 0049, keyed tenant_id plus owner_user_id so it becomes tenant-private via a non-destructive WHERE-tightening); persona-mapped Module Map reading the live registry.

File-to-atom (hauska-engine PR #78, then durability PR #79, hauska-engine-api-00029-buy). The unstructured-to-atom document-ingest stream to the deep-review design: point-to by default (sourceDocumentCid), embed-with for small text, asserted-baseline confidence, idempotent, never-500 honest degrade. The marketplace firewall is verified live: a private-tier caller requesting public-paid is clamped to tenant-private on both blob and atom. Durability shipped as a persistent DocumentIngestStore (Postgres document_blobs plus document_ingest_atoms, migration 004; GCS blob bucket) with restart-durable idempotency proven live. Finding: the engine had no prior Postgres atom persistence to reuse (code atoms are in-memory snapshot) and no GCS wiring, so document-ingest atoms are the first durably-persisted atom family in the spine.

Dataroom tile (legacy-design-tools PR #222, cortex-api-00284-zuq, migration 0050). Upload a file (reusing the existing presign path), extract atoms via a BFF proxy to the engine ingest endpoint, and render them as cited, confidence-graded chips linked to the source blob. Firewall confirmed at the proxy (no accessPolicy sent, explicit tenant-private tier).

## Deep review and Phase 3 plan

Three read-only analyst passes plus a synthesis (_research/2026-07-02_ai_native_and_twin_review.md). Verdict: the AI-native claim is substantially earned on the read path and the earning loop (the calibration loop is live but unfueled); the gaps are builds not redesigns. The load-bearing outputs: the unstructured-to-atom design (point-to plus embed-with, the split doubling as the sell-reasoning-not-raw-data firewall), the tenancy critical path (tenancy is enforced on the corpus-read half but not the reasoning half, and there is no tenant-private write primitive), and the twin as ~90 percent composition (node aggregator by reference plus three strata plus the ADR-022 lifecycle). The twin-creator persona resolves to pursue-as-embedder / park-as-hosted-twin (let Mox prove it first). The Phase 3 tenancy sprint plan is drafted for operator review at _inbox/2026-07-02_phase3_tenancy_sprint_plan.md.

## Process notes and hazards

The orchestration model is captured for the next planner in _dispatches/2026-07-02_next-planning-agent-handoff.md. One hazard bit this session: fresh tmp clones under p:\tmp\phase2 were recycled mid-build; the P2-spine and P2-shell builds both hit it, and no work was lost only because of an insurance checkpoint (push the branch right after the first commit) and a rebuild. The recovery for P2-spine briefly used the operator's persistent P:\hauska-map clone, which was then restored to clean main. The pattern is now hardened (session-unique tmp paths, push-early) and recorded to memory.

## Operator-gated and follow-ups

Operator-gated: NPM_TOKEN (map overlays draw), the ICC OpenAPI spec (real I-Code ingest), and a read of the Phase 3 tenancy plan before any tenancy build. Quality follow-ups: hydrology DEM to GeoTIFF; pin Docker wheels; the cosmetic dead degradedReason on the now-live hydrology tile; wire ENGINE_API_GATE_TOKEN (folds into the Phase 3 gate work); the broader spine atom persistence (code atoms still in-memory) is a separate storage-migration sprint.

## Verification and a local-vs-prod note

Final repo tips: hauska-map 678517d, legacy-design-tools c6ba01f, hauska-mcp-server 080eb01, hauska-engine 7e15710. Live: cortex-api-00284-zuq, hauska-engine-api-00029-buy, hauska-mcp-server-00008-mcr. IMPORTANT operational note: the operator's local dev servers (for example localhost:19592 for the cortex workspace) run from local clones that lag main and sit on feature branches; production and origin/main are the source of truth. Verifying a deploy against a stale local dev server shows old code. Sync the local clone (checkout main, pull, pnpm install, restart) or use the production URL.
