---
id: 2026-07-17_digital_design_center_direction
title: digital-design-center (Envision base) — source-agnostic mapping layer, spine-consumer direction and build scope
status: draft
date: 2026-07-17
last_reframe: 2026-07-18 (source-agnostic mapping layer; Revit is the first adapter, not the product)
applies_to: digital-design-center (new repo), cortex-tiles, cortex-client, map-renderer, hauska-mcp-server, atom-contract, legacy-revit-sensor
related: [2026-07-16_brief_spine_consumer_direction, 80_adrs/adr_024_shared_surface_package_architecture, _architecture_homes/shared_surface_principle, 48_cortex_reporting_function_dashboard_spec, 55_spine_data_intelligence_stack, 40_design_accelerator, 41_revit_connector]
owner: nick
---

# digital-design-center — direction (DRAFT for operator review)

## What this is

A net-new Empressa product, `digital-design-center`: a design-lifecycle platform for architects working with their clients. One continuous surface carries a project from design through material selection through plan review to cited deliverables. The client sits in a dialed real-time 3D visualization experience; the architect drives; and underneath, the parcel, the codes, the materials, and the plan review all resolve to provenanced spine atoms.

Delivery form (operator-ruled 2026-07-17): a standard web app, fed by a drafting-platform connector. The architect pushes a plan and subsequent updates from their drafting software into the app; clients review, comment, and annotate in the web app; findings and redlines flow back. This is deliberately the exercise that builds out our plan-review tooling for real, not just a client viewer.

The base is Chris's Envision app (`clindenmayer1/envision-testing`, deployed at `envision-4tq.pages.dev`) — a React 18.3 + Vite + Three.js (react-three-fiber / drei) kitchen finish-and-fixture configurator with a strong real-time render, curated designer packages, a selection tracker, a project-schedule dashboard, AND a full governed design system (tiered tokens `--envision-t1/t2/t3-*`, `component-registry.json`, `page-recipes.json`, governance `CLAUDE.md`). Envision provides the client-facing selection surface, the 3D craft, and the design-system discipline. Chris authors the shell (operator-ruled 2026-07-17). The spine provides the intelligence, the material catalog, the plan review, and the deliverable output. The platform is the marriage of the two.

## The architecture: a source-agnostic mapping layer (operator-ruled 2026-07-18)

This product is NOT a Revit integration. It is a source-agnostic mapping layer that normalizes any drafting platform into one identical Envision user experience. Revit is the first input, not the product. Additional connectors follow over time: SketchUp, ArchiCAD, 3D AutoCAD, and SoftPlan (residential design CAD, a strong fit for the builder and remodeler audience). None is privileged. Do not let this become a best-Revit-integration exercise.

The architecture has three parts:

1. A canonical target model, exposed through a `TargetingProvider` seam. Every source resolves to the same set of canonical roles (walls, floors, countertops, cabinets, fixtures, and so on). Downstream, the render, the annotation store, and the plan-review surface see only the canonical model, never a platform's native shape.

2. Per-source adapters. Each adapter maps its platform's best native signal onto the canonical roles. Adapters are the only place platform specifics live. Adding a drafting platform is writing an adapter, never touching the shell or the render.

3. A degradation and guided-mapping fallback tier. When a model carries no usable semantics, detect that and drop into a fast guided-mapping UI: tap this surface, tell us what it is. This is critical for the social-group go-to-market, where users will not tag their models correctly or set export flags right. Robustness under bad input is a first-class requirement, not a nicety.

The UX-consistency property is the point: Chris's experience stays identical regardless of the source software. That guarantee is provided by the seam, not by any single adapter. Protecting Chris's started experience is core to the design. An adapter can be weak or a source can be semantically bare, and the fallback tier absorbs it without changing what Chris and the client see.

Targeting is hybrid per adapter: infer the canonical role from the platform's best native signal, and honor an explicit `TargetRole` tag when the author provides one. IFC is the semantic source of truth for the Revit and ArchiCAD adapters. The Revit Category, read via `Pset_ProductRequirements`, is the primary reliable signal; countertops are the hard case and need author tagging. An arbitrary architect-produced GLB carries no reliable semantics, so the layer never targets off a bare GLB; it routes such a model to the guided-mapping tier instead.

Render-stack decision (recorded so the doc of record matches the build): the layer parses IFC with raw `web-ifc` (the framework-agnostic WASM parser) rather than `@thatopen/components`. ThatOpen requires `three >=0.182`, which would break Chris's `three@0.169` render; `web-ifc` keeps the parser independent of the render version and protects the started experience.

Go-to-market framing that drives these choices: the operator (Nick) is the architect and the dogfood user, and the go-to-market is dropping the app into social-media groups that have a real audience, for instant traction if the thing is built right. That is exactly why the degradation and guided-mapping robustness matters. A group user with a messy, untagged model still gets a working experience.

## Reuse and dogfood posture (operator, 2026-07-18)

Reuse Chris's repo rather than greenfield — the render and the governed design system are real, hard-won value not worth rebuilding. Structural adjustment: transfer/fork it into the org (`empressaioemail-tech/digital-design-center`) as its production home; do not build the commercial product in a personally-owned repo named `-testing`.

Nick is the architect (dogfood build, same posture as ECI being the internal instance). This closes the "is there a real user" strategic question: the workflow designed for is Nick's own drafting-to-client-review loop, and success is measured by whether it makes that loop real, hardens the tile library as a cold consumer, and produces the material-atom family — all substrate-positive regardless of external adoption. The wider go-to-market is dropping the app into social-media groups with real audiences, which is why the source-agnostic mapping layer and its guided-mapping fallback are load-bearing: a group user with an untagged model from any drafting platform still lands in the same working experience. Chris's IP assignment on the transferred repo still routes to Nick to settle (legal/corporate, out of scope for the strategic session).

3D scope for v1: interior/room-scale (reuse Chris's render as-is); whole-building/site 3D and terrain-siting are deferred to a later phase once the Revit IFC push loop exists to place a real building. This de-risks the GLB/IFC/three.js coordinate-frame integration, which is a genuine multi-day problem, not a mesh call.

## Adversarial-review corrections (2026-07-18)

An adversarial review of the plan produced eight findings. The load-bearing corrections, folded into the sequence below:

1. Tenancy schema cannot be deferred. Every project/annotation/comment row carries `firm_id` + `client_id` from Phase 1, even under the anonymous default tenant. Only the auth-enforcement flip is deferred (Phase 6). Deferring the tenant KEY (not just the flip) would make Phase 6 a data migration under live commingled client data — the orphaning trap in prior memory. Non-negotiable.
2. It is not "Plan Review" until I-Codes land. With only zoning/setback/municipal codes ingested (ICC creds pending), the client-facing surface is named "Zoning & Site Compliance," and every verdict carries a scope manifest naming which code families were consulted and which were NOT (the same disclosure pattern the Brief uses for web-fallback coverage). Calling a zoning check "plan review" manufactures false confidence and violates commitments #1/#2. The full plan-review engine (codex gate) is honest only for what is ingested.
3. Repo transfer + IP assignment + the "does Envision-the-configurator die into this or fork and diverge" decision are prerequisites BEFORE Phase 0, not a Phase 0 sub-bullet. Routes to Nick.
4. The Revit connector "repoint" is a transport + auth + packaging rewrite, not a URL change. Phase 2 needs a signed, installable, authed connector speaking the new `/plan-review` + `cortex/ifc_ingest` contract — most of Phase 5's foundations pulled forward. The connector is also where firm/tenant is stamped, so it depends on correction 1.
5. Material atoms v1 = a sourced, cited spec catalog (manufacturer cut sheets + provenance + confidence), not a schema line. The compliance-flag-to-code-atom auto-check is a post-ICC capability, NOT a v1 claim; a compliance boolean with no code atom to reconcile against is asserted, not earned. Sourcing (where faucet/tile/cabinet specs come from) is a named program, not a "thin catalog." Pricing/lead-time stay app-side (Chris already has `src/three/pricing.ts`); v1 material selection is honestly a styling+spec picker, not a budget tool.
6. `@empressaio/document-viewer@0.1.0` is a PDF viewer (sole runtime dep `pdfjs-dist`), NOT the unified 2D/3D annotation store the shared-surface spec describes. The annotation/comment persistence + version-reanchoring layer is NET-NEW build in Phase 4, not "surface an existing tile." Version-reanchoring matters: every architect plan-update push can orphan client annotations unless designed for.
7. Terrain-siting cut from Phase 1 (see 3D scope above); Phase 0's map-extraction work shrinks accordingly. Decide `map-renderer` scope/ownership (Hauska substrate vs Empressa product) before publishing — a renderer smells like substrate; publishing under `@empressaio` may be a brand-placement error to check against the catalog thesis.
8. Verified cold-consumer seams (live npm, 2026-07-18): `@empressaio/map-renderer` unpublished (only old `@hauska/map-renderer@0.1.2`); `cortex-tiles@0.1.11` still depends on old-scope `@hauska/map-renderer` and on `three@^0.128` while Chris's app is `three@^0.169` (major skew). These are library fixes this cold consumer forces.

## Build status (2026-07-18)

The `TargetingProvider` seam plus the SketchUp adapter (Stage 2a) is BUILT and VERIFIED — logic and visual confirmation — in a local clone. SketchUp went first deliberately: proving the seam against a non-Revit source first is what keeps this from collapsing into a best-Revit-integration exercise. The first IFC adapter (Revit/ArchiCAD, `web-ifc` parser, Revit Category via `Pset_ProductRequirements`) is the next increment. Nothing is committed to a real repo yet, pending the operator's repo-transfer and IP prerequisite (see prerequisite below). The work lives in the local clone until that clears.

## Why this is worth doing beyond the app itself

Standing up a genuinely independent second product consumer of the tile library is a robustness test the portfolio has not yet run. The command center is the operator's own backend test bench. The Brief is a known quantity and the reason the library exists. This app is the first cold consumer: an app that was not built alongside the library, does not share its assumptions, and will hit every seam that is secretly command-center-local. Every such seam that surfaces here is a library fix that makes the substrate more shippable. Treat "what broke when a clean app consumed the library" as a first-class output, fed back into the library and the spine. This is simultaneously a market product and a forcing function on the substrate.

## The lifecycle, restated

Design to material selection to code and plan review to cited deliverables, in one surface.

The client picks in the 3D visualizer. The architect drives design decisions. Every material is a real catalog atom. Every choice is checkable against real jurisdictional code and setback data. Plan review runs against the same sited model the client is looking at, not in a separate session weeks later. The whole session emits cited, timestamped deliverables.

The connector closes the loop the plan-review spine was built for. The architect authors in their drafting platform and pushes a plan (and updates) into the app. Whatever the source, the adapter resolves it to the canonical target model, so the same normalized model that drives the 3D review view is the artifact the plan-review engine reasons over — the client is not looking at a different thing than the reviewer. For the IFC-backed sources (Revit, ArchiCAD) the shared artifact is IFC itself, with `cortex/ifc_ingest` + `cortex/bim_model_query` Live over it; for semantically-bare sources the guided-mapping tier produces the same canonical model. AI findings, architect redlines, and client comments all land in one annotation store (the `DocumentViewerTile` unified 2D/3D model, keyed by author and by canonical element coordinate). The output is a cited, annotated plan set.

## Home decision (operator-ruled 2026-07-17)

New net-new repo. New Empressa product slot. Not a retrofit of AEC-cortex.

AEC-cortex is reference-only. It was an early architect-surface scaffold with a correct typed gate seam, later reworked by Chris on the component library, and is now outdated relative to the tile-library work. Per `_catalog/repo_intents.md`: "Parked; do not build on the current scaffold." Some workflows were started there; they are mined for reference, not retrofitted. The clean slate is deliberate: it gives an honest test of library consumption by an outside app and of the spine's readiness to ship a product, without inheriting a stale scaffold's assumptions.

Envision is the starting point for the shell and 3D/UX craft. Tiles come straight out of the published library (`@empressaio/*`). AEC-cortex's `docs/mcp-ship-intent.md` and `docs/gate-consumer-contract.md` are useful reference for the gate-consumer contract and the agent-use-case table.

## Consumer contract (inherited, not invented)

This app follows the same spine-consumer contract the Brief is proving and that `shared_surface_principle.md` / ADR-024 define:

- Same-origin spine proxy speaking the `/plan-review` contract (the proven `/api/spine/cortex` pattern), the standard for every tile-consuming app.
- `createCortexClient({ baseUrl, getToken })` typed client; auth injected in the app, never in a tile.
- Library tiles rendered under the app's own `--h-*` design tokens, so Envision's look-and-feel is preserved.
- Render modes: `full` / `card` / `inline` / `raw`. The `raw` headless escape hatch is the key seam for Chris's custom 3D UI: a tile fetches, manages state, enforces atom-contract compliance, and hands data to a custom render, so spine data can drive the 3D surface without wearing the library's default chrome.
- `compose_workspace` (reporting gate) for AI-assembled tile layouts from architect intent.

## What the app CONSUMES vs OWNS

CONSUMES from the library and spine (Live or built today unless flagged):
- Site context sited in 3D: `generate_parcel_terrain_model` (map gate, LIVE) returns a georeferenced GLB/IFC parcel terrain mesh. Envision already renders GLB, so the design sits on the real parcel, not a void.
- Map / spatial: the standalone live map tile (see foundational dependency below).
- Site atoms: topography, drainage, hazard profile, setbacks/zoning (`TopographyTile`, `DrainageTile`, `HazardProfileTile`, `LocalSetbacksTile`). Encumbrances tile (liens, deed restrictions, CC&Rs).
- Building code: cited code-section atoms for Central-TX jurisdictions; `search_permit_atoms`.
- Plan review: codex gate (`finding_generation`, `override_write`, plan review), IFC ingest + BIM model query (for the IFC-backed adapters), sheet extraction, detail callouts, findings library. The `DocumentViewerTile` already carries a unified 2D/3D annotation model that handles element coordinates and human-vs-AI authorship, plus a court-admissible annotated-plan-set export pipeline.
- Deliverables: reporting gate L1 to L6 composition; persisted report runs.
- Property brief report (`PropertyBriefTile`).

OWNS (app-specific, stays in the new repo):
- The 3D visualization experience (Chris's craft: real-time render, lighting studio, curated packages, finish/fixture swapping).
- The client-facing selection UX and the selection tracker.
- The project-schedule dashboard (bound to real deliverable runs, not display data).
- Look-and-feel via `--h-*` token overrides.
- The client-legible plan-review UX: verdict cards / traffic-light summaries on top of the reviewer-grade findings engine (the "laySummary" pattern the Brief already uses for consumers), so a client can read a review a plan reviewer produced.
- Auth and (eventually) firm/client tenancy at the app boundary.

## The material-product atom family (net-new, the durable asset)

There is no material or product catalog atom family in the spine today. The nearest surfaces are ICC-ES product verification lookup and product-data document parsing — verification and extraction, not a browsable catalog. Chris's finishes today are hand-authored GLBs and named swatches in his bundle. Making materials first-class atoms is the biggest net-new spine build and the durable asset of this effort.

Operator ruling 2026-07-17: v1 is SPEC AND COMPLIANCE ONLY. No pricing, no lead-time. Commercial fields deferred to a later version.

Proposed v1 `material-product` atom shape (spec-and-compliance):
- identity (material/product id, name, category: cabinet-door, countertop, backsplash, faucet, hardware, flooring, paint, fixture)
- manufacturer / line / model
- specification (dimensions, composition, finish, performance attributes)
- finish descriptors (color, sheen, texture) — the swatch/render inputs
- code and compliance flags (e.g. ADA clearance, slip resistance, fire rating, VOC/emissions) — the fields that let a material be checked against code atoms
- asset reference (GLB/PBR/texture asset for the 3D surface)
- the standard read-contract confidence object (calibrated/asserted/consequence, provenance) and accessPolicy — inherited from the atom contract

Why spec-and-compliance is the right v1 half: it is the half that feeds plan review. A faucet atom carrying an ADA-clearance flag can be checked against the code atom that requires it. Materials-as-atoms plus code-as-atoms in the same corpus is what makes selection-level compliance checks possible. Pricing/lead-time make it a commercial/selections-sheet asset but pull toward maintaining supplier data; deferred.

This is a contract change (atom-contract), the most load-bearing thing to get right. The atom shape lands before the thin catalog behind it; Envision's swatches/GLBs then resolve from atoms instead of hand-authored bundles.

## Foundational library dependency (surfaces immediately for a cold consumer)

The live map capability is trapped command-center-local (`LiveMapTile.tsx` + `liveGis.ts` in hauska-map) while the published `MapTile` in `@empressaio/cortex-tiles` is fixture-only. A clean consumer pulling `MapTile` from npm gets fixtures, not a real map. Promoting the live map tile into the published library (a ratified-but-unbuilt direction in the Brief doc) is therefore a hard dependency of this app, not a nice-to-have. This app is the second forcing function for that fix.

Related library-state facts verified against live npm (2026-07-17):
- Published `@empressaio/*`: cortex-tiles 0.1.11, cortex-client 0.1.3, tile-shell 0.2.0, design-tokens 0.1.0, document-viewer 0.1.0.
- `@empressaio/map-renderer` is NOT published. The map renderer exists only under the old scope `@hauska/map-renderer` (0.1.2). A clean consumer would have to pull the renderer from the old scope while everything else is the new scope. The rename is incomplete for the spatial package; publishing `@empressaio/map-renderer` is a pre-req to a coherent consumer install.
- `@hauska/atom-contract` published at 1.6.1 (accessPolicy declared, unenforced).

## The connector layer (Revit is the first adapter, not the product)

The architect's push channel into the app is a drafting-platform connector. Revit is the first one built, because Nick drafts in Revit and there is an existing sensor to repoint, but the connector is one adapter behind the `TargetingProvider` seam, not the product. SketchUp, ArchiCAD, 3D AutoCAD, and SoftPlan follow as additional adapters, each resolving its platform's native signal to the same canonical target model. Each new source is an adapter; the shell, the render, and the plan-review surface never change.

The existing Revit sensor is thin and shipped-but-minimal: `legacy-revit-sensor` today is one ribbon panel with two buttons (Send Snapshot / Configure), a snapshot pipeline that posts identity plus per-sheet PDF plus IFC to the old Design Accelerator api-server, and no installer, no code signing, no CI, no tests. Its intent line is "keep functional; must survive/repoint when the architect app is rebuilt."

For the Revit adapter, IFC is the semantic source of truth. Targeting is hybrid: infer the canonical role from the Revit Category (read via `Pset_ProductRequirements`, the primary reliable signal) and honor an explicit `TargetRole` tag when the author sets one. Countertops are the known hard case and need author tagging. A bare architect-produced GLB carries no reliable semantics, so the adapter never targets off it; such a model routes to the guided-mapping fallback tier. IFC is parsed with raw `web-ifc` (WASM) so the parser stays independent of Chris's `three@0.169` render.

Operator direction 2026-07-17: this is the exercise to build out plan-review tooling for real. Recommended sequencing (planner call, for operator confirm): repoint the existing Revit sensor at the new app's spine proxy first to get the push loop working end-to-end (plan and updates into `digital-design-center`, review in the web app), then expand the connector as its own track once the review UX is landing — new panels for push-plan, push-update, and surface-client-comments-back-in-the-drafting-tool, plus a proper installer / signing / CI. This gets a working loop early without gold-plating the connector before the review surface exists. Additional-platform adapters (SketchUp already proven at the seam, ArchiCAD/AutoCAD/SoftPlan queued) are their own increments once the Revit path and the review surface are solid.

The IFC-backed connectors post IFC as the shared artifact: `cortex/ifc_ingest` and `cortex/bim_model_query` (Live) let the plan-review engine reason over the same model the client reviews in 3D. Client comments and architect redlines join AI findings in the single `DocumentViewerTile` annotation store (2D page coords and 3D canonical element coords, distinguished by author). The annotated-plan-set export pipeline turns the reviewed model into a cited deliverable.

## Honest constraints (shape sequencing; do not oversell)

- Full I-Code family (IBC / IECC / A117.1 / ADA / FHA / NFPA) is NOT ingested yet (ICC Code Connect adapter built, credentials pending). Code-aware review is real today for zoning / setback / municipal-code checks across ~34-35 Central-TX jurisdictions, and steps up sharply when ICC lands. Do not present full-building-code plan review as present-tense.
- Tenant/owner isolation is declared but unenforced (anonymous default tenant; gated on the tenant leg, sprint 54). An architect-and-client platform is inherently multi-tenant: Firm A must not see Firm B; the client sees only their project. Enforced tenancy becomes critical-path the moment this goes past demo with more than one firm.
- MV3-specific blockers from the Brief (map-worker CSP seam) are not app-blockers here if this ships as a standard web app rather than an extension. Confirm delivery form (web app assumed).
- Precedence/reconciliation ("most-stringent-governs") is latent, not a callable pass. Cited single-source code checks are honest; automated multi-code reconciliation is not there yet.
- MCP gate reachability (`mcp.hauska.dev/mcp`, `X-Hauska-Key`) is documented-live in the Brief's ENDPOINTS.md; verify live at build (sandbox egress could not reach the host).

## Reprioritization (operator, 2026-07-18)

Order of importance for this build, operator-ruled: (1) a source model through the mapping layer to a faithful working interior render surface, with Revit as the first adapter; (2) plan review in-app; (3) site context. Site context is explicitly the LEAST important this round — a large simplification, since much of the earlier plan's front-loaded complexity (map-renderer publishing, terrain-siting, site tiles) was in service of #3. It moves to the back.

Governing principle: well-built and tested over speed; do not bite off too much out of the gate. Each round is a well-built, tested increment before the next begins.

Consequence: the material-product atom family (a sourced-catalog program, the biggest net-new build) also moves LATER. It remains the strategic durable asset, but it does not belong in the first increments. Material selection keeps running on Chris's existing hardcoded swatches until then. Round 1 barely touches the spine; the cold-consumer library test mostly begins in Round 2 when tiles first load.

## Build sequence (reprioritized; increment order; no timeframes)

Prerequisite (routes to Nick, before Round 1): repo transfer to org + Chris IP assignment + decision on whether Envision-the-configurator dies into this or forks and diverges.

Round 1 — source model through the mapping layer to a faithful interior render (operator #1; render source = architect's REAL geometry, not the demo kitchen; Revit is the first adapter). Scope is ONLY this, fully built and tested, before plan review. The work:
- The `TargetingProvider` seam plus the SketchUp adapter (Stage 2a) is already built and verified in the local clone; the first IFC adapter (Revit/ArchiCAD, `web-ifc` parser, Revit Category via `Pset_ProductRequirements`, hybrid infer-plus-`TargetRole`) is the next increment. Building the IFC adapter against the same seam that SketchUp already exercises is what keeps this source-agnostic rather than a best-Revit-integration.
- The guided-mapping fallback tier: detect a semantically-bare model (a raw GLB, an untagged export) and drop into the tap-a-surface mapping UI. Load-bearing for the social-group go-to-market, where models will not be tagged correctly.
- Revit connector made real for the render path: signed, installable, authed (desktop C# add-in key-provisioning solved), pushing the architect's model in an ingestable form (IFC/GLB) with faithful geometry, materials, and units. Revit IFC export is lossy/config-dependent; export fidelity is the core engineering, not the transport.
- Decouple Chris's scene from the single hardcoded `envision_kitchen_clean_test.glb`: cameras, lighting, and material-swap logic currently assume that one model. Rendering arbitrary pushed geometry, resolved through the seam so the experience is identical across sources, is a contained refactor in his shell.
- Project/model store carries `firm_id` + `client_id` from row one (kept from the adversarial pass; nearly free now, a migration later). No enforcement flip yet.
- Minimal spine involvement by design. No tiles, no map-renderer, no site data this round.
Done = push a real model (Revit first, and the seam already proven on SketchUp) and see it render faithfully as an interior in the app, on your machine, tested.

Round 2 — Plan review in-app (operator #2). On top of the working pushed model:
- Surface the codex plan-review engine, honestly scoped to ingested codes. Name the client-facing surface "Zoning & Site Compliance"; attach a scope manifest to every verdict (codes consulted / NOT consulted). This is the first round tiles/spine-proxy enter (`/plan-review`, `createCortexClient`, `--h-*` mapped onto Chris's `--envision-t2-*`) — the cold-consumer library seams surface here (unpublished `@empressaio/map-renderer`, old-scope dep in `cortex-tiles`, `three` 0.128-vs-0.169 skew).
- Build the NET-NEW annotation + comment persistence layer (2D page coords + 3D canonical element coords, author-keyed, tenant-scoped, version-reanchoring on plan-update push). `document-viewer@0.1.0` is only a PDF renderer (verified: sole dep `pdfjs-dist`), so this is real build, not "surface an existing tile."
- Client-legible verdict cards + client comment/annotate on the pushed model; architect redlines + AI findings + client comments in one store.
Done = push a plan, get honestly-scoped compliance findings, and have architect + client annotate/comment on the model together, tested.

Round 3 — Site context (operator #3, least important). Only after 1 and 2 are well-built and tested:
- Publish `@empressaio/map-renderer` (after deciding its scope/ownership — a renderer smells like Hauska substrate, check against the catalog thesis); resolve the old-scope dep. Site tiles as DATA (parcel, setbacks, property brief). Terrain-siting / whole-building 3D deferred further still.
Done = the pushed design carries real parcel/setback/brief context.

Later increments (after the three rounds are solid; each its own well-built slice):
- Material atoms: define the `material-product` family (spec + compliance-flag, no pricing/lead-time), a sourced+cited catalog with a named sourcing pipe; resolve Chris's `MaterialSwatch`/`MaterialCard` + `content-models.json` from atoms; app-side pricing untouched. Compliance flags asserted-with-provenance; auto-reconciliation against code atoms is post-ICC.
- Connector expansion: push-update version panels, comments + findings back in the drafting tool, CI + auto-update on the Revit adapter; then additional adapters (SketchUp seam already proven, then ArchiCAD / 3D AutoCAD / SoftPlan) as their own well-built slices, each landing behind the same `TargetingProvider` seam.
- Lifecycle close + tenancy enforcement: L1 to L6 deliverables (cited selections docs, compliance summaries, annotated findings letters); bind schedule to real runs; flip tenant enforcement on (schema already present from Round 1).

Post-ICC (gated on ICC creds, not our schedule): rename "Zoning & Site Compliance" toward true "Plan Review" as I-Code families ingest; enable material-compliance auto-reconciliation against code atoms.

Cross-cutting: capture every seam that broke for the cold consumer and feed it back to the library/spine. Verification never delegated. Each round fully built and tested before the next.

## Surfaces needing design consideration

Adapting Chris's existing components (interior v1): `SceneCanvas`/`KitchenScene` (becomes the annotation canvas; whole-building/terrain deferred), `Overview` (project-level entry, role-aware), `RightRail`/`ConfiguratorSection`/`OptionSwatch`/`OptionCard` (atom-backed compliance chips without breaking "material data is not a token"), `MaterialSwatch`/`MaterialCard` + `content-models.json` (atom seam), `TopBar`/`ViewSwitcher` (new lifecycle-stage modes: Design / Site / Compliance / Deliverables), schedule/selection tracker (bind to real runs). Net-new surfaces (most design work): the Compliance/annotation pane, the client-vs-architect role split, the source-model push/version-status surface (source-agnostic, the Revit adapter first), and the guided-mapping fallback UI for semantically-bare models.

## Resolved decisions (operator, 2026-07-17)

1. Delivery form: standard web app fed by a drafting-platform connector, Revit first (architect pushes plans/updates; clients review/comment/annotate). Framed as the plan-review-tooling buildout.
2. Product / repo name: `digital-design-center`.
3. Chris authors the shell.
4. Demo targets: Central-TX and Moab-related addresses, driven from the source model by address. Not a blocker; matches spine coverage.
5. Architecture (operator, 2026-07-18): source-agnostic mapping layer, Revit is the first adapter not the product; `TargetingProvider` seam guarantees identical UX across sources; `web-ifc` parser over `@thatopen/components` to protect Chris's `three@0.169` render.

## Open items (planner call, for operator confirm)

- Revit-connector approach: repoint-first vs full-rebuild. Planner recommends repoint-first, then expand as a track (see the connector-layer section).
- Adapter order after Revit: SketchUp is already proven at the seam; confirm the sequence for ArchiCAD / 3D AutoCAD / SoftPlan (SoftPlan is the builder/remodeler-audience fit and may earn priority for the social-group go-to-market).
- Tenancy timing: when firm/client isolation must be enforced (past single-firm demo). Named as critical-path-on-multi-firm, not day-one.
