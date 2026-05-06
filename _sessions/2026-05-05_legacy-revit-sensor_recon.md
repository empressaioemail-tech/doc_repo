---
id: 2026-05-05_legacy-revit-sensor_recon
title: legacy-revit-sensor â Cursor Claude Code recon
date: 2026-05-05
agent: cursor-claude-code
repo: legacy-revit-sensor
session_type: recon
rolled_up: true
rolled_up_into: [10_ground_truth, 41_revit_connector]
---

# legacy-revit-sensor â Cursor Claude Code recon

Single-agent reconnaissance to establish ground truth on the C# Revit
add-in repo state. Smaller scope than the SmartCity OS or
legacy-design-tools recons â no Cloud infrastructure, no Replit Repl,
no production deploy surface. The connector is a single Visual Studio
solution distributed via build-equals-install MSBuild target.

Findings synthesized into [`10_ground_truth.md`](../10_ground_truth.md)
(Revit Connector section) and used to flag the "six ribbon panels" /
"B1-B5 taxonomy" memory items as aspirational rather than built. Full
product-home documentation lives in
[`41_revit_connector.md`](../41_revit_connector.md).

## Scope

- What is on origin/main right now (HEAD, PRs merged, branches)?
- What does the solution structure look like (projects, target
  frameworks, distribution model)?
- Is the A04.7 engagement-identity dedup fix actually merged? (mirror
  of the legacy-design-tools side)
- What does the wire contract look like (endpoints, headers, clients)?
- Does the "six ribbon panels" / "B1-B5 taxonomy" memory match what's
  in source?
- Is there any test coverage or CI?

## Sources consulted

**Cursor Claude Code (working in `p:\legacy-revit-sensor`):**
- `git log --oneline origin/main -10`, `git branch -a`, `git tag`
- `git ls-tree origin/main` and `git show origin/main:<path>`
- File reads: `LegacyRevitSensor.sln`, all three project `.csproj`
  files (`LegacyRevitSensor.Shared`, `LegacyRevitSensor.Revit2026`,
  `LegacyRevitSensor.Revit2024`),
  `LegacyRevitSensor.Revit2026/Snapshot/RevitIdentityExtractor.cs`,
  `LegacyRevitSensor.Revit2026/Commands/SendSnapshotCommand.cs`,
  `LegacyRevitSensor.Revit2026/Commands/ConfigureCommand.cs`, all
  four wire clients (`EngagementMatchClient.cs`, `SnapshotClient.cs`,
  `SheetUploadClient.cs`, `IfcUploadClient.cs`),
  `LegacyRevitSensor.Revit2026/UI/RibbonPanelInstaller.cs` (or
  equivalent ribbon registration),
  `TESTING.md`
- `find . -name "*.csproj" -o -name "*.sln"` to enumerate projects
- `find .github -type f` to check CI presence

## Findings â repo state

- **Origin/main HEAD:** `ee83aa2` ("Sprint A05 â IFC export 3D-view
  resolution + diagnostic logging + transaction safety", PR #2).
- **PRs merged:** two â #1 (Phase D) and #2 (Sprint A05 â 3D-view +
  log + transaction).
- **Active branches:** `main` plus one additional remote branch
  `sprint-a05-ifc-3dview-fix` (purpose unclear; may be a follow-on
  or alternate path beyond `ee83aa2`).
- **Tags:** none.

## Findings â solution structure

`LegacyRevitSensor.sln` with three projects:

| Project | Target framework | Architecture | Role |
|---|---|---|---|
| `LegacyRevitSensor.Shared` | `net48`, `UseWindowsForms=true` | x86/x64 (any) | Common types, JSON contracts, settings, HTTP clients. Single PackageReference: `System.Text.Json 8.0.5`. |
| `LegacyRevitSensor.Revit2026` | `net8.0-windows` | x64 | Revit 2026 host bindings, source of truth for command code. Hardcoded RevitAPI HintPath at `C:\Program Files\Autodesk\Revit 2026\`. |
| `LegacyRevitSensor.Revit2024` | `net48` | x64 | Revit 2024 host bindings. **Re-uses Revit2026 sources via `<Compile Include="..\..." Link="..." />`.** Adding Revit 2025 or 2027 follows the same pattern. |

Both Revit-version projects auto-deploy on build via MSBuild target
`CopyAddinToRevit AfterTargets="Build"` to:

```
%APPDATA%\Autodesk\Revit\Addins\{2024|2026}\
```

**Build = install.** No separate installer. Clean uninstall is `del`
+ Revit restart.

## Findings â ribbon panel structure (memory correction)

**Single ribbon panel:** `Design Tools`, registered to the built-in
Add-Ins tab, with two buttons:

- `Send Snapshot` â `LegacyRevitSensor.Commands.SendSnapshotCommand`
  (~565 lines, full AâBâCâD pipeline)
- `Configure` â `LegacyRevitSensor.Commands.ConfigureCommand` (~55
  lines, dialog + settings save)

**There is no "six panels" structure** (Project / Site / Design /
Review / Visualize / Co-pilot) anywhere in the source. That vocabulary
exists in planner memory but does not exist in the repo. Aspirational
on the v1.0 path; not built.

**No B1-B5 taxonomy in any source file.** Same status â aspirational.

## Findings â A04.7 dedup fix verified

A04.7 engagement-identity dedup fix is merged at commit `3499037`.

Dedup key construction at
`LegacyRevitSensor.Revit2026/Snapshot/RevitIdentityExtractor.cs:15-21`
produces:

```csharp
RevitProjectIdentity(
    ProjectName,
    RevitCentralGuid,
    RevitDocumentPath
)
```

Decision logic moved server-side to `POST /api/engagements/match`
per the A04.7 transition. The `ProjectInformation.Name` footgun is
closed; `ProjectName` is one input among three, with GUID-precedent
on the server side.

## Findings â wire contract

Every URL is `settings.ReplitUrl.TrimEnd('/') + <path>`, every
request bears `x-snapshot-secret`:

| Verb | Path | Body | Client |
|---|---|---|---|
| POST | `/api/engagements/match` | JSON `MatchRequest` | `EngagementMatchClient.cs:36` |
| POST | `/api/snapshots` | JSON `SnapshotPayload` | `SnapshotClient.cs:28` |
| POST | `/api/snapshots/{id}/sheets` | multipart | `SheetUploadClient.cs:36` |
| POST | `/api/snapshots/{id}/ifc` | multipart | `IfcUploadClient.cs:54` |

Authentication is the single shared `x-snapshot-secret` value across
all four endpoints. Rotation needed in the migration sprint.

## Findings â settings and runtime artifacts

- Settings persisted at `%APPDATA%\Hauska\DesignTools\settings.json`.
- Diagnostic log at `%APPDATA%\Hauska\DesignTools\ifc-export-errors.log`
  (path defined in `IfcExporter.cs` per `ee83aa2` â earlier commits
  don't have this).

## Findings â operational gaps

| Concern | State |
|---|---|
| Installer | None. Build = install. |
| Code signing | None. Revit will warn about unsigned add-in on first load. |
| CI / automated tests | None. No `.github/` directory. |
| Test suite | None. No NUnit / xUnit / MSTest. |
| Validation | Manual click-through documented in `TESTING.md`. |
| Auto-update | None. Architects re-build to update. |
| Crash reporting | Diagnostic log only. |
| Telemetry | None. |

## Where the findings landed

- Planner-belief corrections ("six ribbon panels" and "B1-B5
  taxonomy" flagged as aspirational not built) â
  [`10_ground_truth.md`](../10_ground_truth.md) Planner-belief
  corrections section
- Repo state (HEAD `ee83aa2`, PRs merged, solution structure, A04.7
  verification, wire contract) â
  [`10_ground_truth.md`](../10_ground_truth.md) Revit Connector
  section
- Strategic frame ("stay thin", "server is source of truth", "one
  panel today vs six aspirational") â
  [`41_revit_connector.md`](../41_revit_connector.md) Current scope
  vs aspirational subsection and Strategic frames

## Open questions surfaced (not closed in this recon)

- Purpose of the additional remote branch `sprint-a05-ifc-3dview-fix`
  beyond `ee83aa2` â follow-on, alternate path, or stale?
- Where will B1-B5 taxonomy live in the codebase if/when v1.0 builds
  it? (`api-server` server-side classification is the natural home;
  decision pending â see
  [`41_revit_connector.md`](../41_revit_connector.md) Outstanding)
- Long-term operational gaps (CI, code signing, auto-update) â when
  do these become blocking?
