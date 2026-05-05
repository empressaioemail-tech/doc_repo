---
id: 41_revit_connector
title: Revit Connector
status: active
last_updated: 2026-05-05
applies_to: revit-connector
related: [10_ground_truth, 40_design_accelerator]
---

# Revit Connector

Companion C# Revit add-in for [Design Accelerator](40_design_accelerator.md).
Lives in its own GitHub repo (`legacy-revit-sensor`) with its own
release cadence, language stack (C# / .NET), and deployment model
(build = install via MSBuild). Single architect-facing surface inside
Revit.

This doc is the product home: identity, architecture, wire contract,
distribution. For *current* implementation state — origin/main HEAD,
sprint progress, recent recon findings — see
[`10_ground_truth.md`](10_ground_truth.md). The SaaS app the connector
talks to is documented in [`40_design_accelerator.md`](40_design_accelerator.md).

## What it is

C# Revit add-in. Loads when Revit starts, registers a ribbon panel,
exposes architect-triggered commands that extract Revit project data
and post it to Design Accelerator's `api-server`. Receives findings,
briefings, and renders back through the SaaS app's UI (separate
browser window) — the connector itself does not render any panels in
Revit beyond the ribbon.

Stays deliberately thin. No business logic in the add-in: extract
data, post to API, that's it. All design intelligence (compliance,
briefing, AI surfaces) lives in the api-server. Any "AI in Revit"
claim routes through API calls, not in-add-in code. This separation
is load-bearing — see [Strategic frames](#strategic-frames).

## Current scope vs aspirational

A frequent source of doc drift. Be honest about both:

**Current scope (origin/main as of 2026-05-05):**

- One ribbon panel: `Design Tools`, registered to the built-in
  Add-Ins tab
- Two buttons: `Send Snapshot`, `Configure`
- Four wire endpoints (see [Wire contract](#wire-contract))
- Settings at `%APPDATA%\Hauska\DesignTools\settings.json`
- Diagnostic log at `%APPDATA%\Hauska\DesignTools\ifc-export-errors.log`

**Aspirational (NOT in any repo today):**

- Six ribbon panels: Project / Site / Design / Review / Visualize /
  Co-pilot
- B1-B5 bidirectional taxonomy (also aspirational on the api-server
  side — see [`40_design_accelerator.md`](40_design_accelerator.md))
- Per-panel command sets

The aspirational structure is on the v1.0 path but not built. Don't
write specs against it as if it exists.

## Architecture

Single Visual Studio solution: `LegacyRevitSensor.sln`, three projects:

| Project | Target framework | Architecture | Role |
|---|---|---|---|
| `LegacyRevitSensor.Shared` | `net48` | x86/x64 (any) | Common types, JSON contracts, settings, HTTP clients |
| `LegacyRevitSensor.Revit2026` | `net8.0-windows` | x64 | Revit 2026 host bindings, source of truth for command code |
| `LegacyRevitSensor.Revit2024` | `net48` | x64 | Revit 2024 host bindings, re-uses Revit2026 sources via `<Compile Include="..\..." Link="..." />` |

Both Revit-version projects auto-deploy on build via the MSBuild target
`CopyAddinToRevit AfterTargets="Build"` to:

```
%APPDATA%\Autodesk\Revit\Addins\{2024|2026}\
```

Build = install. No separate installer. The Revit user's `%APPDATA%`
becomes the deployment surface — clean uninstall is `del` + Revit
restart.

Source-sharing across Revit versions is via `<Link>` references in
`Revit2024.csproj` rather than file duplication. `Revit2026` is the
authoritative source; `Revit2024` is a target-framework variant. Adding
a Revit 2025 (or 2027) project follows the same pattern: new csproj,
`<Link>` the Revit2026 sources, set the framework + Revit API HintPath.

## The A→B→C→D pipeline (`Send Snapshot`)

The architect's primary action is `Send Snapshot`. The command runs
this pipeline in order:

1. **A — Identity.** Extract `RevitProjectIdentity(ProjectName,
   RevitCentralGuid, RevitDocumentPath)` from the open Revit document.
   Code in `LegacyRevitSensor.Revit2026/Snapshot/RevitIdentityExtractor.cs:15-21`.
2. **B — Match engagement.** POST identity to
   `/api/engagements/match`. Server resolves which engagement the
   snapshot belongs to using GUID > path > name precedence (per A04.7
   transition).
3. **C — Snapshot create.** Build snapshot payload (sheets list, view
   metadata, BIM model link), POST to `/api/snapshots`. Receive
   snapshot ID.
4. **D — Sheet + IFC upload.** Per-sheet PDFs go to
   `/api/snapshots/{id}/sheets`. IFC export goes to
   `/api/snapshots/{id}/ifc`.

The `Send Snapshot` command implementation is in
`LegacyRevitSensor.Commands.SendSnapshotCommand` (~565 lines). The
`Configure` command is small (~55 lines): dialog for ReplitUrl + secret
+ APS credentials, persisted to settings.json.

## Wire contract

Every URL is `settings.ReplitUrl.TrimEnd('/') + <path>`, every request
bears the `x-snapshot-secret` header. Authentication is the single
shared secret — there is no per-architect auth on the wire today
(rotation needed in the migration sprint; tracked in
[`10_ground_truth.md`](10_ground_truth.md) Fire 2 for SmartCity OS, but
the same x-snapshot-secret pattern lives across both sides).

| Verb | Path | Body | Client |
|---|---|---|---|
| POST | `/api/engagements/match` | JSON `MatchRequest` | `EngagementMatchClient.cs:36` |
| POST | `/api/snapshots` | JSON `SnapshotPayload` | `SnapshotClient.cs:28` |
| POST | `/api/snapshots/{id}/sheets` | multipart | `SheetUploadClient.cs:36` |
| POST | `/api/snapshots/{id}/ifc` | multipart | `IfcUploadClient.cs:54` |

The server side of these endpoints lives in the api-server artifact of
`legacy-design-tools` — see
[`40_design_accelerator.md`](40_design_accelerator.md) Wire contract
section for the surface from the SaaS-app side.

## Identity and dedup (post-A04.7)

The pre-A04.7 footgun: dedup keyed on `ProjectInformation.Name`. Revit
"Save As" copies the project with the same name, causing snapshot
overwrite of unrelated engagements. Closed in commit `3499037`
(2026-04-29).

Post-A04.7 contract:

- Identity is a **triple**: `ProjectName`, `RevitCentralGuid`,
  `RevitDocumentPath`
- Server-side `/api/engagements/match` resolves identity using
  precedence: `RevitCentralGuid` > `RevitDocumentPath` > `ProjectName`
- Decision logic is server-side; the connector is dumb pipe. If the
  engagement-name display logic ever needs to update, the change
  happens in api-server and the connector inherits it on next request.

The engagement_match library on the connector side does not cache
match decisions across sessions — each `Send Snapshot` re-resolves.

## Distribution and operational reality

| Concern | Status |
|---|---|
| Installer | None. Build = install. |
| Code signing | None. Revit will warn about unsigned add-in on first load. |
| CI / automated tests | None. No `.github/` directory. |
| Test suite | None. No NUnit / xUnit / MSTest. |
| Validation | Manual click-through documented in `TESTING.md`. |
| Auto-update | None. Architects re-build to update. |
| Crash reporting | Diagnostic log at `%APPDATA%\Hauska\DesignTools\ifc-export-errors.log` (added in commit `ee83aa2`). |
| Telemetry | None. |

Operational gaps are real — at minimum CI, code signing, and an
auto-update mechanism should land before external pilots beyond
Empressa.

## Strategic frames

- **Stay thin.** The connector is a pipe between Revit and the
  api-server. No business logic in the add-in. If a feature is being
  built and the connector is doing more than data-extraction +
  HTTP-post, push the logic into api-server.
- **Server is source of truth.** Engagement names, dedup decisions,
  finding generation, briefing logic — all server-side. Connector
  receives, displays, posts. Inverting this creates two sources of
  truth and rapid drift.
- **Same engine, two sides.** Architects use Design Accelerator's
  incremental compliance check via this connector; reviewers use the
  same engine in full-pass mode via SmartCity OS. The connector's
  thinness is what allows the same engine to run cleanly on both
  sides.
- **One panel, two buttons (today).** Don't write specs that assume
  the six-panel structure exists. When a new command is needed,
  decide whether it belongs in Design Tools or whether a second panel
  is justified (most commands fit in Design Tools).

## Current state

For current state — origin/main HEAD, recent sprint commits, A04.7
verification, ribbon panel registration in source — see the Revit
Connector section of [`10_ground_truth.md`](10_ground_truth.md). That
doc is updated frequently as state changes; this product home stays
durable.

## Cross-references

- Portfolio ground truth: [`10_ground_truth.md`](10_ground_truth.md)
- The SaaS app the connector talks to:
  [`40_design_accelerator.md`](40_design_accelerator.md)
- Sister product (city side):
  [`30_smartcity_os.md`](30_smartcity_os.md)
- Agent operating rules:
  [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
- Sub-doc depth: `4X` if needed (likely not — connector is small)
