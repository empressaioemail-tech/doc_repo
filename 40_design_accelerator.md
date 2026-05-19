---
id: 40_design_accelerator
title: Design Accelerator
status: active
last_updated: 2026-05-19 (production target shifting from Replit autoscale to Cloud Run per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md and _dispatches/2026-05-19_cc-agent-C_replit_decouple.md; rendering + image-to-BIM + image-to-CAD descoped to 41_advanced_capture_features.md)
applies_to: design-accelerator
related: [10_ground_truth, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 30_smartcity_os, 40a_customer_zero_observations_arena_roja_2026_05_06, 41_advanced_capture_features, 41_revit_connector, _decisions/2026-05-19_sync_4_5_and_cortex_sprint]
---

# Design Accelerator

SaaS product for architects mid-design in Revit. Pre-launch; Empressa is
customer zero. Pilot workload: two adjacent residential lots in Spanish
Valley near Moab, Utah (Grand County jurisdiction).

This doc is the product home: identity, surface, architecture,
customer-zero context, strategic positioning. For *current*
implementation state — repository HEAD, deployment, fires, recent recon
findings — see [`10_ground_truth.md`](10_ground_truth.md). For sub-product
depth, see the `4X` docs as they land. The companion Revit add-in is
covered in [`41_revit_connector.md`](41_revit_connector.md).

## What it is

Architect-facing intelligence layer that wraps Revit. The architect
designs in Revit as they always have; Design Accelerator hydrates a
parcel briefing (zoning, code, neighboring context, hazards), surfaces
client-comment workflows, runs incremental code-compliance checks, and
generates client-facing visuals. Output flows back into the architect's
Revit session via a companion Revit add-in.

The strategic frame is the same atom-graph thesis as SmartCity OS — see
[`30_smartcity_os.md`](30_smartcity_os.md). Design Accelerator's atoms
(engagement, snapshot, briefing, finding, render output, etc.) live in
the same conceptual graph as SmartCity OS's atoms but are physically
stored in a separate Postgres database scoped to the architect side of
the workflow.

Production target today: Replit autoscale at
`prompt-agent-accelerator.replit.app`. **Migration to Cloud Run + fresh
Neon prod instance is in flight per the 2026-05-19 combined sprint** —
see [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md)
and the Lane C.2 dispatch at [`_dispatches/2026-05-19_cc-agent-C_replit_decouple.md`](_dispatches/2026-05-19_cc-agent-C_replit_decouple.md).
Phase 1A CI/CD scaffold (build-and-push workflow + canary deploy
workflow) already exists per the 2026-05-19 cortex-track close-out;
cutover is sequenced after all of Lane A + Lane B + Lane C.1 + C.3 +
C.4 close. Backing services post-cutover: Cloud Run (production
target), fresh prod-grade Neon PostgreSQL with pgvector
(Empressa-owned, operator-specced region/plan in Decision 0.20),
Anthropic API for AI surfaces, APS (Autodesk Platform Services) on the
paid tier for Revit cloud operations.

## Customer-zero: Empressa pilot

Empressa is the only customer today. The pilot is two adjacent
residential lots in Spanish Valley near Moab, Utah, in Grand County
jurisdiction. Grand County's IRC residential code is the first
code-ontology target.

Customer-zero status is deliberate: every product friction surfaces
internally before reaching external architects. External pilot
expansion is downstream of v1.0 GA; v1.0 requirements are tracked in the
roadmap (deferred doc).

## Active test projects

Five projects are referenced in current dispatches as the active
architect-side AI plan review prod test set:

| Project | Type | Jurisdiction | Source / verification |
|---|---|---|---|
| Alexander 404 Miami | Commercial condo remodel (5225 Collins Ave, Miami Beach FL) | Miami Beach | Memory; not in `seed.ts`; needs `SELECT` against deployment Neon |
| Musgrave Residence | Residential | Moab / Grand County | Confirmed in `lib/db/src/seed.ts` |
| Seguin Residence | Residential | Moab / Grand County | Confirmed in `lib/db/src/seed.ts` |
| Balsley | Residential | TBD | Test stand-in name; verification needed |
| Dart Frog | Commercial | TBD | Memory; not in `seed.ts`; needs `SELECT` |

These projects span Bastrop, Moab, and Miami Beach jurisdictions —
deliberate breadth to stress the code-ontology layer across multiple
codes (Grand County IRC, Bastrop UDC, Florida-specific codes for Miami
Beach).

The verification gap (some projects in source, some not) is tracked in
[`10_ground_truth.md`](10_ground_truth.md) Open questions.

## Surface (artifact apps)

Repository: `legacy-design-tools`. Replit pnpm monorepo with these
artifact apps under `artifacts/`:

| Artifact | Purpose | Surface URL |
|---|---|---|
| `api-server` | Express 5 backend, all atom logic, AI surfaces | (consumed by other artifacts; no direct URL) |
| `design-tools` | Architect-facing UI (briefings, client comments, render previews) | `/` |
| `plan-review` | Architect-side window into Codex (Hauska Engine in incremental mode); not its own product roadmap. See [`47_codex_plan_review.md`](47_codex_plan_review.md) for the canonical reviewer product. | `/plan-review/` |
| `qa` | Internal QA / data-inspection surface | `/qa/` |
| `mockup-sandbox` | Design exploration / spike work | `/mockup/` |

The `design-tools` and `plan-review` artifacts are the load-bearing
ones. `qa` and `mockup-sandbox` exist for internal velocity.

## The Revit add-in relationship

Architect interaction with Revit happens through **legacy-revit-sensor**,
a companion C# Revit add-in repo. The add-in talks to `api-server` via
four endpoints, all bearing the `x-snapshot-secret` header. Full
documentation lives in [`41_revit_connector.md`](41_revit_connector.md).

The separation matters: the SaaS app and the Revit add-in have different
release cadences (npm-based pnpm versus C# auto-deploy via MSBuild
target), different test surfaces, and different deployment targets.
Treating them as one product collapses important seams.

Wire contract surface (cross-ref to
[`41_revit_connector.md`](41_revit_connector.md) for full detail):

- `POST /api/engagements/match` — resolves which engagement a snapshot
  belongs to (GUID > path > name precedence per A04.7)
- `POST /api/snapshots` — creates a snapshot record
- `POST /api/snapshots/{id}/sheets` — multipart sheet upload
- `POST /api/snapshots/{id}/ifc` — multipart IFC upload (Track B)

## Architecture

### Atom graph (architect-side)

Same atom-graph thesis as SmartCity OS but with a different live atom
set. 19 domain atoms registered in
`artifacts/api-server/src/atoms/registry.ts` as of 2026-05-05: sheet,
engagement, snapshot, submission, intent, briefing-source,
parcel-briefing, neighboring-context, materializable-element,
briefing-divergence, bim-model, reviewer-annotation, reviewer-request,
viewpoint-render, render-output, finding, communication-event,
decision-event, submission-classification.

**Bump 1 atom-production fixes** (planned alongside the contract bump per [`27`](27_engine_evolution_plan.md) §Contract version bump):

- **`bim-model` produced symmetrically on IFC ingest.** Today the atom is produced only on Push-to-Revit per `bimModels.ts`; IFC ingest writes `materializable-element` rows and a glTF bundle but does not produce a `bim-model` atom. The UI BIM viewport consequently has nothing to render after an IFC upload — surfaces as "IFC ingest doesn't work in the UI." Bump 1 plan: IFC ingest produces `bim-model` symmetrically, so as-built (IFC) and to-be-built (Push-to-Revit) are peer producers of the same atom type. Surfaced 2026-05-18 plan-review engine recon §6.
- **Open: materializable-element re-ingest semantics.** Current behavior at `ifcIngest.ts:260-314` is delete-prior-rows then re-insert, which breaks ADR-001 atom history per the 2026-05-18 engine recon §57. Resolution path (append + supersede chain per ADR-011) is open and will land as a follow-on; not gating Bump 1.

Code atoms (legal corpus — distinct concept from domain atoms) are
populated by ingest pipelines from jurisdiction code documents. As of
2026-05-05, the helium dev DB has 479 code atoms across four sources:

- Grand County Land Use: 215
- Bastrop Muni Code: 189
- Grand County IWUIC: 61
- Grand County IRC R301.2.1: 14

Production count needs verification against deployment Neon — see
[`10_ground_truth.md`](10_ground_truth.md) Open questions.

### Hauska Engine — the "same engine" principle

Compliance checking, parcel briefing generation, and code retrieval are
implemented in **one codebase** consumed by two surfaces:

- **AI Plan Review (SmartCity OS, reviewer-side)** runs the engine in
  full-pass mode (30–120s reviewer-grade analysis).
- **Design Accelerator (architect-side)** runs the same engine in
  incremental mode (under 5s, mid-design).

Rules and code ontology written once benefit both products. Architects
get the same compliance interpretation reviewers will apply — no
"surprise" findings at submission time.

**Mode distinction is currently aspirational** per the 2026-05-18 plan-review engine recon at [`_sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR.md`](_sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR.md). One `generateFindings` code path serves both surfaces today; budget-aware mode separation (incremental sub-second vs. full-pass minutes) is design-fresh in `hauska-engine` per cc-agent-E side-intel, not a port from the legacy engine. The same recon also surfaced that **every analytical surface is pure-LLM with no structural rules pass** — a structural rules layer for setbacks, heights, lot coverage, egress widths against parsed BIM geometry is also design-fresh in `hauska-engine`, not present in legacy. The shared engine is named **Hauska Engine** and is being factored into its own repo `hauska-engine` in the `empressaioemail-tech` org, gated on migration sprint Phase 2C closure. Naming, repo placement, and timing are settled in [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md). The architect-side `plan-review` artifact mirrors what Codex reviewers see; the spec previously titled `51_design_accelerator_parcel_intelligence.md` in pre-docs-repo project knowledge migrates to docs repo as part of Hauska Engine factor-out work.

### Inverted Pyramid methodology

Institutional knowledge is built first; the 3D model is optional and
last. This inverts how most BIM-first workflows work and reflects the
customer-zero discovery that architects (especially residential) spend
most early-design time NOT in 3D — they're researching parcels, zoning,
neighboring context, client preferences. Design Accelerator front-loads
that work; Revit modeling becomes the last-mile rather than the starting
point.

### Bidirectional taxonomy (B1-B5)

B1-B5 is a planned bidirectional code-tagging taxonomy that lets
findings flow in either direction (architect-to-reviewer,
reviewer-to-architect) with consistent semantics. **As of 2026-05-05,
the B1-B5 taxonomy does not exist in any repo** — it's aspirational. B1
is required for v1.0. Decision pending: where does B1-B5 classification
live in the codebase (server-side in `api-server` is the natural home
since the Revit add-in wire payload doesn't carry taxonomy).

## External services

Load-bearing third-party services:

| Service | Purpose | Notes |
|---|---|---|
| Anthropic API | Briefing generation, client-comment summarization, finding generation, sheet OCR via Claude vision | Sonnet 4.5 for analytical surfaces; Haiku for classification. Every analytical surface routes a single prompt to Anthropic (no rules-engine fallback today) per the 2026-05-18 plan-review engine recon. |
| APS (Autodesk Platform Services) | Future: Revit cloud operations, IFC translation, sheet PDFs, Design Automation for L4 Revit content push | Empressa has full APS access available. **Not currently integrated in code** — zero APS imports in the api-server or any UI artifact per the 2026-05-18 Cortex UI recon. Integration is the gap, not access. |
| mnml.ai | Photorealistic exterior rendering from massing models | Wired server-side via `routes/renders.ts`; gated by `RENDERS_PROD_ENABLED` env flag. **Sprint scope descoped to [`41_advanced_capture_features.md`](41_advanced_capture_features.md)** per the 2026-05-19 combined sprint decision; integration depth (pose control, material fidelity, lighting consistency) deferred until activation gate clears. Existing code stays env-gated and available for ad-hoc use; descope is sprint-scope, not feature removal. |
| Leaflet 2D + Three.js GLB viewer | Geospatial visualization (Leaflet); BIM glTF preview (Three.js) | The actual 3D / spatial stack in `legacy-design-tools` design-tools artifact. **Supersedes prior CesiumJS framing** — Cesium was never wired in any artifact per the 2026-05-18 Cortex UI recon. If true Cesium scene work returns, treat as net-new. |
| Neon (pgvector) | Embeddings store for code atom retrieval | Replit-managed; migration pending. Retrieval today is top-K vector + lexical fallback per [`27`](27_engine_evolution_plan.md); hybrid graph traversal per ADR-010 is design-fresh in `hauska-engine`. |

## Pilot wave plan (Moab projects)

The Moab residential projects drive a wave-based v1.0 plan:

- **W0** — foundation, ribbon panel structure, Revit integration baseline
- **W1** — Grand County parcel briefing + 3DEP elevation import
- **W2** — neighboring context model + mnml.ai client render (rendering portion descoped to [`41_advanced_capture_features.md`](41_advanced_capture_features.md) per 2026-05-19 sprint; neighboring-context portion stays in this wave)
- **W3** — client comments panel, two-way comment flow

Detailed wave breakdown lives in roadmap (deferred). Sprint vocabulary
in the legacy-design-tools repo uses `DA-PI-*`, `V1-*`, `Sprint A-D`,
`AIR-*`, `PLR-*` — not `A01-A06` as planner memory previously had it.
Repo vocabulary is canonical.

## Strategic frames worth carrying forward

- **Customer-zero is Empressa.** Pilot on real Moab projects before
  external sales. Friction surfaces internally first. Dated field notes:
  [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md).
- **Atom-graph-first.** Same as SmartCity OS — every feature extends
  the graph or gets reworked.
- **Same engine, two surfaces.** The compliance checker is one
  codebase, two consumers (full-pass for reviewers, incremental for
  architects). Rules written once benefit both.
- **Inverted Pyramid.** Institutional knowledge first; 3D model last.
  Front-load parcel research, neighboring context, code retrieval —
  Revit modeling is last-mile.
- **B1-B5 taxonomy is aspirational, not built.** v1.0 needs B1; the
  others can wait. Don't pretend the structure exists.
- **Architect-side and reviewer-side products use the same engine.**
  The architect sees what the reviewer will see; the reviewer sees
  what the architect saw. No "surprise" findings.

## MCP surface tier model

Cortex MCP retrofit queued at or after launch per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) sequencing recommendation (Phase 5 in the post-Sprint-51 sequence). Tier ruling per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md): per-seat subscription default with per-firm enterprise option for larger firms; bundled call quota per seat per month covering within-firm-tenant calls; cross-jurisdictional Layer 2 metered as overage with revenue share to source cities; cross-firm precedent opt-in only (deviates from principle 2's default-cross-tenant-meters posture due to design-IP sensitivity). Revit add-in calls use the same metering as direct MCP calls per the Revit Connector ruling in 29. Specific seat price and bundled call quota deferred to first Cortex paid conversions.

> **Naming note.** Per 2026-05-16 brand consolidation, Cortex is the new name superseding "Design Accelerator" in product framing. This doc's title and id retain the legacy slug pending the 27 Stream G brand migration; the product the doc describes is Cortex.

## Current state

For current state — origin/main HEAD, deployment URL, schema state,
active fires (post-merge.sh Neon guard, x-snapshot-secret rotation), and
recent recon findings — see the Design Accelerator section of
[`10_ground_truth.md`](10_ground_truth.md). That doc is updated
frequently as state changes; this product home stays durable.

## Cross-references

- Portfolio ground truth: [`10_ground_truth.md`](10_ground_truth.md)
- Sister product (city side): [`30_smartcity_os.md`](30_smartcity_os.md)
- Companion Revit add-in: [`41_revit_connector.md`](41_revit_connector.md)
- Reviewer-side product (shares engine):
  [`47_codex_plan_review.md`](47_codex_plan_review.md)
- Strategic foundation:
  [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md)
- Engine factor-out:
  [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
- Cross-stakeholder atom access:
  [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md)
- Agent operating rules: [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
- Sub-product depth: `4X` docs (TBD)
- Atom architecture ADR: `80_adrs/adr_001_atom_architecture.md` when
  that lands
- Roadmap (deferred): when a roadmap doc lands, link from here
