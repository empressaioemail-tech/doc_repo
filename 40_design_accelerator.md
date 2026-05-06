---
id: 40_design_accelerator
title: Design Accelerator
status: active
last_updated: 2026-05-06
applies_to: design-accelerator
related: [10_ground_truth, 30_smartcity_os, 40a_customer_zero_observations_arena_roja_2026_05_06, 41_revit_connector]
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
`prompt-agent-accelerator.replit.app`. Migration to Cloud Run + GitHub
Actions CI is on the post-saga commitment list. Backing services: Neon
PostgreSQL with pgvector (Replit-managed today, Empressa-owned
post-migration), Anthropic API for AI surfaces, APS (Autodesk Platform
Services) on the paid tier for Revit cloud operations.

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
| `plan-review` | Reviewer-side AI plan review UI (architect-side mirror of city-side product) | `/plan-review/` |
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

Code atoms (legal corpus — distinct concept from domain atoms) are
populated by ingest pipelines from jurisdiction code documents. As of
2026-05-05, the helium dev DB has 479 code atoms across four sources:

- Grand County Land Use: 215
- Bastrop Muni Code: 189
- Grand County IWUIC: 61
- Grand County IRC R301.2.1: 14

Production count needs verification against deployment Neon — see
[`10_ground_truth.md`](10_ground_truth.md) Open questions.

### Briefing engine — the "same engine" principle

Compliance checking, parcel briefing generation, and code retrieval are
implemented in **one codebase** consumed by two surfaces:

- **AI Plan Review (SmartCity OS, reviewer-side)** runs the engine in
  full-pass mode (30–120s reviewer-grade analysis).
- **Design Accelerator (architect-side)** runs the same engine in
  incremental mode (under 5s, mid-design).

Rules and code ontology written once benefit both products. Architects
get the same compliance interpretation reviewers will apply — no
"surprise" findings at submission time. The shared engine is being
factored into a separate service tentatively named `legacy-bim-service`;
specific repo location is in flight. Spec exists as
`51_design_accelerator_parcel_intelligence.md` in pre-docs-repo project
knowledge; migrate to docs repo when the engine factoring concretizes.

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
| Anthropic API | Briefing generation, client-comment summarization, finding generation | Sonnet for complex writing, Haiku for classification |
| APS (Autodesk Platform Services) | Revit cloud operations, IFC translation, sheet PDFs | Paid tier active. Model Derivative + AEC Data Model APIs load-bearing. Design Automation API elevated to near-term priority (enables Claude-as-designer via MCP) |
| mnml.ai | Photorealistic exterior rendering from massing models | Used in W2 wave for client deliverables |
| CesiumJS | Geospatial visualization, neighboring-context display | In-browser only; no server-side dependency |
| Neon (pgvector) | Embeddings store for code atom retrieval | Replit-managed; migration pending |

## Pilot wave plan (Moab projects)

The Moab residential projects drive a wave-based v1.0 plan:

- **W0** — foundation, ribbon panel structure, Revit integration baseline
- **W1** — Grand County parcel briefing + 3DEP elevation import
- **W2** — neighboring context model + mnml.ai client render
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
- Agent operating rules: [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
- Sub-product depth: `4X` docs (TBD)
- Atom architecture ADR: `80_adrs/adr_001_atom_architecture.md` when
  that lands
- Roadmap (deferred): when a roadmap doc lands, link from here
