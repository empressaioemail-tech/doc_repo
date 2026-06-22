---
id: 2026-06-21_aec-cortex_cc-agent-R_arch-scaffold-and-boundary
title: cc-agent-R — AEC-cortex scaffold and cortex-api reporting boundary
date: 2026-06-21
agent: cc-agent-R
repo: AEC-cortex + doc_repo boundary map
dispatch: architecture_homes phase 1 track B/D
status: complete — operator creates GitHub remote, then push
model: Grok Build 0.1
---

# AEC-cortex scaffold and reporting-vs-architect boundary — cc-agent-R report

## Scope

Architecture-Homes phase 1, cleanup/scaffold only. No logic moves. Confirms `cortex-api` as the reporting function package (not a product). Scaffolds `P:\AEC-cortex` as the architect Surface repo. Records MCP-first ship intent per ADR-028 slot ([`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md); formal ADR-028 filing is phase 2 doc scrub).

## Standard read

- [`_architecture_homes/00_overview.md`](../_architecture_homes/00_overview.md)
- [`_architecture_homes/01_homes_and_topology.md`](../_architecture_homes/01_homes_and_topology.md)
- [`_decisions/2026-06-21_adr008_cortex_reframe_override.md`](../_decisions/2026-06-21_adr008_cortex_reframe_override.md)

## cortex-api boundary (confirmed)

**cortex-api is the reporting function package.** It composes spine reasoning, map layer manifests, and cited atoms into reports; persists report runs; provides product glue for Surfaces that need reporting. It is **not** a product surface and must not be marketed or documented as "the Cortex product."

| Role | cortex-api owns |
|---|---|
| Report composition | Orchestrate spine + map manifest + atoms → narrative + citations + layer manifest |
| Report run persistence | `brokerage_brief_runs`, briefing generation runs, deliverable run records |
| Product glue BFF | Service-auth paths the MCP gate calls (wallet, metering hooks, extension public key) |
| L1–L6 **composition** | API routes that generate/persist deliverable atoms (response-task through deliverable-letter-render) |
| Brokerage / radar backend (interim) | `/api/brokerage/v1/*` until `radar` Surface extracts |

**cortex-api does not own:** architect cockpit UX, mnml render workbench, engagement shell navigation, Revit snapshot UI, or direct agent catalog access (that is the gate).

Deployment name stays `cortex-api` on Cloud Run (`legacy-design-tools/artifacts/api-server`). Repo path stays `legacy-design-tools` until the function package is physically extracted; the **semantic** home is FUNCTION PACKAGES per architecture homes.

## Recommendation confirmed (pending ADR-008 amendment lock)

| Concern | Home | Rationale |
|---|---|---|
| L1–L6 deliverable **composition** (generate letter, extract sheets, persist atoms) | **cortex-api (reporting)** | Reporting function; same seam as brief pipeline and MCP `reporting` gate tools |
| L1–L6 **UX** (tabs, wizards, completeness chrome, export buttons) | **AEC-cortex** | Human architect surface |
| mnml.ai render kickoff, studio workbench, render previews | **AEC-cortex** | Design-accelerator "renders" per override decision |
| Layer manifest in a report | **cortex-api** produces; **hauska-map** renders | Manifest contract in architecture homes § map-to-reporting |
| Findings / briefing / hydrology **reasoning** | **hauska-engine** (lift per sprint 56) | Already sequencing out of cortex-api |
| Plan review reviewer UI | **codex** Surface | `artifacts/plan-review` is a Codex window, not architect home |

## legacy-design-tools decomposition map

Source monolith: `P:\legacy-design-tools` (`empressaioemail-tech/legacy-design-tools`). Decomposition through-line per [`01_homes_and_topology.md`](../_architecture_homes/01_homes_and_topology.md).

### Artifacts

| Artifact | Future home | Notes |
|---|---|---|
| `artifacts/api-server` | **cortex-api** (reporting function package) | Cloud Run `cortex-api`; thins as reasoning lifts |
| `artifacts/design-tools` | **AEC-cortex** (`apps/web`) | Full architect cockpit |
| `artifacts/plan-review` | **codex** | Architect-side Codex window; not AEC-cortex product roadmap |
| `artifacts/qa` | **transitional** in legacy or split to owning Surface CI | Internal only |
| `artifacts/mockup-sandbox` | **kill or keep internal** in AEC-cortex dev | Spike work |
| `artifacts/codex-reviewer-qa` | **codex** | QA harness for plan review |

### api-server routes → future home

**Stays cortex-api (reporting / glue)**

| Route module | Function |
|---|---|
| `brokerageBrief.ts`, `brokeragePlace.ts`, `brokerageMapData.ts` | Property brief + place dossier reporting |
| `brokerageEncumbrances.ts`, `brokerageWorkspace.ts`, `brokerageProfile.ts` | Workspace-scoped reporting / investor paths |
| `brokerageBilling*.ts`, `brokerageWalletRoute.ts`, `brokerageEntitlementRoute.ts` | Metering glue (until SDK wire completes) |
| `brokerageGtm.ts`, `brokerageCoverage.ts`, `brokerageAdminGraph.ts` | GTM / ops reporting glue |
| `parcelBriefings.ts`, `briefingSources.ts`, `generateLayers.ts` | Engagement briefing reports + layer manifest emission |
| `responseTasks.ts`, `sheetContent.ts`, `deliverableLetters.ts` | L1–L3 composition |
| `detailCalloutSpecs.ts`, `productSpecReferences.ts` | L4–L5 composition |
| `deliverableLetterRenders.ts` | L6 composition (DOCX/PDF render atoms) |
| `packages.ts`, `packages.logic.ts`, `packages.hydration.ts` | Deliverable package composition for reports |
| `encumbrances.ts` (engagement path) | Encumbrance brief composition |
| `siteTopography.ts`, `siteDrainage.ts` | **Interim** — spatial reasoning lifts to spine/map; reporting keeps manifest references |
| `auth.ts`, `session.ts`, `me.ts` | Shared auth glue until tenancy standard lands |

**Moves to AEC-cortex (architect surface / studio)**

| Route module | Function |
|---|---|
| `renders.ts`, `render-tools.ts` | mnml.ai render kickoff, polling, studio credits |
| `bimModels.ts` | BIM model upload UX backing (viewer in design-tools) |
| `collateral.ts`, `canva.ts` | Client materials / collateral integrations |
| `notifications.ts` | Architect inbox notifications |
| `chat.ts`, `chatAgentTools.ts` | In-app architect agent chat (UI-facing) |
| `workspaceSettings.ts` | Workspace branding UX |
| `intake.ts` | Client comment intake UX |

**Lifts to hauska-engine (spine, sprint 56)**

| Lib / route | Function |
|---|---|
| `lib/finding-engine`, `lib/engine-core`, `lib/calibration-engines` | Reasoning + calibration |
| `findings.ts`, `findingsRuns.ts`, `findingsEvidenceLedger.ts`, `findingsCalibrationOverlay.ts` | Finding generation persistence (engine-api) |
| `cannedFindings.ts` | Engine-adjacent |

**Already hauska-map / spatial function package**

| Lib / route | Function |
|---|---|
| `lib/map-embed` | Embedded renderer contract (migrates with hauska-map) |
| `brokerageGis*.ts`, `brokeragePlaceHydrology.ts` | GIS layer fetch (map gate tools) |

**Codex surface / plan-review function**

| Route module | Function |
|---|---|
| `submissions.ts`, `reviewerAnnotations.ts`, `submissionComments.ts`, `submissionEvents.ts` | Plan review workflow |
| `reviewers.ts`, `reviewerRequests.ts`, `decisions.ts`, `communications.ts` | Reviewer ops |
| `snapshots.ts`, `sheets.ts`, `match.ts` | Revit/snapshot ingest (shared seam; gate + codex tools) |

**Other Surfaces (extract later)**

| Route / consumer | Future Surface |
|---|---|
| `brokerageBrief` extension paths | `hauska-brief-extension` (already separate repo) |
| Investor deal radar backend | `radar` (NEW Surface, track D) |

### Shared libs

| Package | Future home |
|---|---|
| `lib/atoms-l-surface` | **cortex-api** for composition schemas; types consumed by AEC-cortex via gate read-contract |
| `lib/portal-ui` | Split: read-contract chrome → shared npm; findings UI → codex or AEC-cortex by audience |
| `lib/db` | Split by domain: report runs → cortex-api; engagement UX tables → AEC-cortex; shared migration coordination required |
| `lib/api-zod` | Split generated types per consumer repo |

### design-tools UI → AEC-cortex

Migrate `artifacts/design-tools` wholesale into `AEC-cortex/apps/web`. Key engagement views per `engagementViews.ts`:

| View / tab | AEC-cortex ownership |
|---|---|
| Site (`site`, `site-context`, `property-intel`) | UX; data via gate `reporting` + `map` |
| Model (`snapshots`, `sheets`, `model-3d`) | UX; snapshot ingest via gate `codex` |
| Review (`run-plan-review`, `findings`, `response-tasks`, `deliverable-letters`) | UX; composition via gate `reporting` / review via `codex` |
| Deliver (`detail-callouts`, `product-specs`, `client-materials`, `packages`) | UX |
| Studio (`renders`) | UX + render vendor integration |
| Workspace, Inbox, Dashboard, Settings | UX |

## AEC-cortex scaffold

**Path:** `P:\AEC-cortex`  
**Git:** initialized, root commit `9ef4edb` on `master`  
**Remote:** operator creates `empressaioemail-tech/AEC-cortex` (or chosen name), then agent pushes.

### Layout

```
P:\AEC-cortex/
  README.md
  package.json
  pnpm-workspace.yaml
  apps/web/                 # architect cockpit (migrates from design-tools)
  packages/gate-client/     # MCP consumer facades (scaffold stub)
  docs/
    mcp-ship-intent.md      # ADR-028 recorded ship plan
    gate-consumer-contract.md
```

### Verification (verbatim)

```
cd P:\AEC-cortex
pnpm install
pnpm typecheck   → packages/gate-client + apps/web Done
pnpm test        → passWithNoTests, exit 0
git log -1 --oneline
9ef4edb chore: AEC-cortex Surface scaffold (architecture-homes phase 1)
```

## MCP-first plan (recorded ship intent)

Full doc: `P:\AEC-cortex\docs\mcp-ship-intent.md`

**Principle:** Net-new Surface ships MCP-first; human UI second ([`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md)).

**Consumption model:** AEC-cortex calls only `hauska-mcp-server`. Gate classes used:

| Gate | Use |
|---|---|
| `public` | Catalog atoms, jurisdiction query, atom trace (planned) |
| `reporting` | Briefs, deliverable composition, encumbrances, report run reads |
| `map` | Parcel polygon, drainage, topography, GIS composites for manifest slots |
| `codex` | Snapshot ingest, finding generation, briefing fetch for plan review |

**Ship target:** Phase 3 (post audit + doc scrub). Phase 1 is scaffold + boundary only.

**Checklist (gate-client):** Streamable HTTP MCP client, product facades, read-contract parsing, layer-manifest embed with hauska-map, no direct spine/cortex-api in production paths.

**Naming debt:** Legacy MCP tools still use `cortex/*` namespace. Gate rework renames product gate to `reporting`. ADR-008 amendment resolves two-"Cortex" overlap (cortex-api function vs AEC-cortex Surface).

## Operator actions

1. Create GitHub remote for `AEC-cortex`.
2. Agent (or operator): `git remote add origin …` && `git push -u origin master` from `P:\AEC-cortex`.
3. Phase 2: ADR-008 amendment locks L1–L6 composition = reporting recommendation.
4. Phase 3: migrate `design-tools` artifact; wire `gate-client`; no new direct cortex-api calls from UI.

## Out of scope (this dispatch)

- Physical code moves from `legacy-design-tools`
- Gate-class rework implementation (Track C)
- ADR-008 amendment text (phase 2 doc scrub)
- `radar` Surface scaffold (separate track D dispatch)

## Reversal watch

Per override decision: reverse the split if deliverable composition cannot separate cleanly from architect UX, or if "Cortex" as reporting function name causes more market confusion than the old product brand. Re-evaluate at phase 2 before amendment locks.
