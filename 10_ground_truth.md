---
id: 10_ground_truth
title: Portfolio ground truth
status: active
last_updated: 2026-05-05
applies_to: portfolio
---

# Portfolio ground truth

Current state of the active software portfolio: SmartCity OS, Design
Accelerator (legacy-design-tools), and the Revit Connector
(legacy-revit-sensor). Rebuilt from a multi-repo recon on 2026-05-05 after
several months of accumulated drift between project knowledge and reality.
Patched in-place going forward; restructure with supersession only when the
shape of the doc itself has to change.

> ⚠️ **Update cadence — read this before you read anything else.** This
> doc is going to move fast. The next week will resolve fires, push
> through the Cloud Run + Empressa Neon migration, and close out sprint
> dispatches at a clip that will blow past large portions of what's
> written here. Treat in-place edits as the default, not the exception.
> Bump `last_updated` on every edit, however small. When a section's
> facts change materially (a fire closes, a recon resolves, a sprint
> ships) update inline immediately rather than waiting for end-of-day
> rollup. The point of this doc is to reflect *now*, not *yesterday*.

## How this was produced

Three concurrent Cursor Claude Code agent recons (one per active repo), two
Replit Agent probes (one per active Repl), one GCloud asset-listing pull,
and one DNS + HTTP-headers check against `smartcityos.io`. Every claim
below is backed by verbatim command output from those recons. The recon
reports themselves should be backfilled into `_sessions/2026-05-05_*` files
when this doc lands, completing the audit trail.

## SmartCity OS

GitHub: `empressaioemail-tech/smartcity-os`. Local clone: `p:\smartcity-os`.

### Production

Live on Google Cloud Run since the 2026-05-03 cutover. Project
`smartcity-os-prod`, region `us-central1`. Cutover window: 2026-05-03
~5:50 PM MDT.

| Surface | Value |
|---|---|
| API service | `smartcity-api` |
| Latest revision | `smartcity-api-00082-pog` (tag `p0-followup-prophecy`) |
| Traffic | 100% on `00082-pog`; 0% on `00080-men` (leftover canary tag `p0-3-canary`) |
| Image | `us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest` |
| Service URL | `https://smartcity-api-7dyaiy7wha-uc.a.run.app` |
| Custom domain | `smartcityos.io` → Google anycast `216.239.32.0/24` → Cloud Run domain mapping (confirmed via `dig` + curl headers) |
| Bundle (last built locally) | `index-BsfNEJYB.js` |
| Last-modified header | `2026-05-03 23:24:48 UTC` (matches post-cutover Prophecy follow-up) |

A second service `smartcity-scraper` exists in the same project with
revisions through `00037-zfm` plus a `wo-chunking` revision. Role:
cron-driven MyGov scraping. Cloud Scheduler `attempt_deadline` caps at
1800s; long-running scrapers may report `DEADLINE_EXCEEDED` cosmetically
while continuing server-side.

23 secrets in Secret Manager including production + staging variants for
ANTHROPIC, DATABASE_URL, OPENGOV, SAMSARA, SESSION_SECRET. The `staging-*`
set implies a staging environment exists; whether it currently runs is
unconfirmed.

### Repository

Origin/main HEAD: `a08d9bb` ("chore(deps): sync package-lock.json with
package.json (#5)"). Recent merge sequence (most recent first):
`a08d9bb` → `602f0d8` (Prophecy nav) → `6a97220` (Cloud Run cutover
commit) → `c4c559d` (vitest safety net) → `3016ae0` (release/2026-04-29
prophecy + focus metrics merge).

Backup tags on origin: `backup/p0-6-cutover-pre-20260503-201715` at
`6a97220`, `backup/p0-followup-prophecy-pre-20260503-235103` at `a08d9bb`.
No commit, tag, or markdown doc references "stage 8", "replit detach", or
"24h watch" — Phase 0 Stage 8 closure has no codified evidence (see
[Outstanding](#outstanding-smartcity-os)).

Active branches: `main`, `release/2026-04-29-prophecy-and-focus-metrics`,
`backup/2026-04-29-replit-local-main`, `ci/dast-issues-write-permission`,
`compass-ai-sprint`.

Test/lint/typecheck baseline:

- typecheck: 422 errors (carried as known baseline; new errors only
  acceptable in PR-modified files)
- vitest: 18 passed / 18 total across 5 files
- lockfile: drift detected via `npm ci --dry-run` despite the #5 sync PR
  (`bufferutil` missing in lockfile, `@emnapi/runtime` present in lockfile
  but not resolved)

Schema management: TS schema in `shared/schema.ts` (95 KB) plus
`shared/permitflow-schema.ts` (19 KB). `drizzle.config.ts` reads
`process.env.DATABASE_URL`. NO journaled migrations folder
(`lib/db/drizzle/` absent). Hand-rolled SQL in `migrations/` with prefix
collisions (two `0003_*` files, two `0004_*` files). Only `db:push` npm
script; no migrate, no generate.

`scripts/post-merge.sh` is hooked via `.replit` `[postMerge]` (not
git/husky). Uses idempotent `CREATE … IF NOT EXISTS` DDL with
`[ -n "$DATABASE_URL" ]` guard, exits 0 on error. Does NOT call
`drizzle-kit push --force`. Safer than the legacy-design-tools equivalent.

The auth bypass at `server/routes.ts:83` is verbatim:

```typescript
if (req.headers['x-internal-ai'] === 'smartcity-ctx') return next();
```

No loopback gate. Trivially exploitable from external clients. Compare
`server/middleware/tenant.ts:55-62` which does gate on loopback (but only
for setting `tenantId`, not for auth). Sites using `x-internal-ai`:

```
server/app.ts:85                     CORS allowedHeaders
server/middleware/tenant.ts:59       loopback-gated tenantId set
server/routes.ts:83                  UNGUARDED auth bypass — the bug
server/routes/ai-assistant.ts:395    sender, "smartcity-ctx"
server/routes/ai-assistant.ts:4212   sender, "1" — STALE value, doesn't match any gate
server/routes/calendar.ts:18         loopback-gated
server/routes/mygov.ts:5974          sender
server/routes/overview.ts:1134       sender
server/routes/reports.ts:130         sender
server/routes/reports.ts:658         sender
```

`app.set('trust proxy', ...)` is set in
`server/replit_integrations/auth/{googleAuth.ts:114, replitAuth.ts:65}`.
Whether either path executes in the cloud-run boot binary
(`server/index-cloud.ts`) is not yet traced — relevant to how `req.ip`
resolves under Cloud Run's GFE.

Compass system prompt: `server/routes/ai-assistant.ts:1005` (marker
`// COMPASS SYSTEM PROMPT — edit here for prompt changes`).

### Database

Production Neon: `ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech`
(region `us-west-2`). Replit-managed (Nick has no Neon Console access;
credential lives in Replit Secret `PROD_DATABASE_URL` and in GCP Secret
Manager `smartcity-DATABASE_URL`).

Schema state on prod Neon (queried via `PROD_DATABASE_URL` from the
SmartCity Repl):

- 106 public tables — Bastrop municipal data (mygov_permits, etc.)
- `engagements` and `code_atoms` tables do NOT exist on this DB; those
  live on legacy-design-tools' Neon

Cross-region hop on every query — Cloud Run in `us-central1`, Neon in
`us-west-2`. Belongs in the migration sprint scope.

### Replit Repl (functionally orphaned)

The `smartcityos.io` traffic path runs entirely through Cloud Run,
confirmed via DNS resolution and HTTP-headers check. The Replit Repl is no
longer in production traffic but has not been formally retired:

- Repl HEAD: `5ca51cd`. Local main is **10 commits ahead of origin/main,
  0 behind**. None of the 10 commits have been pushed.
- Among the 10: nine are Replit auto-checkpoints (`Saved your changes…`,
  `Saved progress…`, screenshot uploads, troubleshooting docs). One
  (`b67c333`, "Fix issue preventing users from publishing updates") may be
  a real fix that needs preservation.
- Repl's view of `origin/main` is at `3016ae0` — **4 commits behind**
  GitHub's actual HEAD (`a08d9bb`). Either the most recent fetch was a
  no-op, or the ref pointer didn't update during the recent fetch attempt.
- `.replit` still declares `[deployment]` block (`deploymentTarget =
  "autoscale"`, `build = ["npm", "run", "build"]`, `run = ["node",
  "dist/index.js"]`). The Repl is still capable of being autoscale-deployed
  if anyone clicks Redeploy.
- Repl runtime `DATABASE_URL` resolves to `helium` (Replit-managed local
  Postgres `heliumdb`), NOT to Neon. The Neon prod connection is exposed
  via `PROD_DATABASE_URL`.
- `VITE_API_URL` in `.replit` `[userenv.shared]`:
  `https://smartcity-api-494195107606.us-central1.run.app` (Cloud Run,
  project-number-style URL).
- `.replit` `[userenv.shared]` contains plaintext production secrets
  committed to git — see [Active fires](#active-fires).

Phase 0 Stage 8 (Replit detach) has no codified evidence; either skipped
or done without a record. The `.replit` deployment block being present
means a Stage 8 is still owed — even if just symbolic, to remove the
loaded-gun risk that someone clicks Redeploy and ships 10 unreviewed
commits.

### Outstanding (smartcity-os)

- Auth bypass on `server/routes.ts:83` — fix is scoped, ready to dispatch
  (Fire 1)
- Plaintext secrets in `.replit` — rotate + remove from git (Fire 2)
- Repl drift cleanup (Fire 4): cherry-pick `b67c333` if needed, discard
  checkpoints, neutralize `[deployment]` block
- Neon migration to Empressa-owned account (Phase 1 work item; pair with
  Cloud Run hardening sprint)
- Cross-region hop fix: provision new Empressa Neon in `us-central1`
- typecheck baseline drive to zero (Phase 1 Wave 1.2)
- Migration prefix collisions in `migrations/`
- Lockfile drift root cause investigation
- W1.A.6-9 forensics dispatches (calendar event visibility, Power BI
  accuracy, police units / Spireon, daily health-watch email)
- W1.C.1/2/3 implementation dispatches (Prophecy layout, CSP frame-src,
  OpenGov BNP hardening)

## Design Accelerator (legacy-design-tools)

GitHub: `empressaioemail-tech/legacy-design-tools`. Local clone:
`p:\legacy-design-tools`.

### Production

Replit autoscale at `prompt-agent-accelerator.replit.app`. Migration to
Cloud Run + GitHub Actions CI is pending — see
[Active fires](#active-fires) and
[Outstanding](#outstanding-design-accelerator).

- Architect surface: `https://prompt-agent-accelerator.replit.app/`
- Reviewer surface: `https://prompt-agent-accelerator.replit.app/plan-review/`

Active prod test projects (per memory, partially verified): Alexander 404
Miami (5225 Collins Ave, Miami Beach FL), Musgrave Residence, Seguin
Residence, Balsley, Dart Frog. Of these, Seguin and Musgrave are confirmed
in `lib/db/src/seed.ts`; Balsley is a test stand-in name; Alexander 404
Miami and Dart Frog don't appear in source and may be live-DB-only.

`x-snapshot-secret` is a single shared header secret across the eight
snapshot/IFC/match endpoints. Value committed in `.replit`
`[userenv.shared]` — needs rotation in the migration sprint.

### Repository

Origin/main HEAD: `99a6a022` ("fix(api-server): resolve web-ifc wasm dir
via entry point"). Working tree clean modulo `.generated` artifact and
untracked agent-tool directories.

Recent merge sequence (most recent first):

- `99a6a02` — web-ifc wasm dir fix (post-saga)
- `db0cccd` — vite.config.ts PORT/BASE_PATH patches (Track B saga fix)
- `b1d7cf4` — explicit `[deployment.build]` step in `.replit`
  (Track B saga fix)
- `cc034c9`, `25e0b0e` — Track B server IFC ingest (PRs #16, #15)
- `1ca2e8f` (2026-04-29) — A04.7 engagement-identity fix

Track B saga aftermath verified: all four `vite.config.ts` patches landed
(`design-tools`, `plan-review`, `qa`, `mockup-sandbox` — all use the
`resolvePort(command)` helper that throws on serve-only). `.replit`
`[deployment.build]` block is in place. Track B route
`POST /api/snapshots/:id/ifc` is live at
`artifacts/api-server/src/routes/snapshots.ts:989`.

A04.7 engagement-identity fix landed: adds `revit_central_guid` and
`revit_document_path` columns to `engagements`, drops UNIQUE on
`name_lower`, new `POST /api/engagements/match` resolves snapshot intent
with GUID > path > name precedence. Server is now source of truth for
engagement names post-A04.7.

Test/lint/typecheck baseline:

- typecheck: 0 errors across all artifacts and scripts
- tests: failures are environment-driven (no local Postgres / no
  `TEST_DATABASE_URL` set) — all sampled failures trace to
  `ECONNREFUSED ::1:5432` or "TEST_DATABASE_URL must be set"
- lockfile: in sync (`pnpm install --frozen-lockfile` clean)

Schema source of truth: 39 files in `lib/db/src/schema/`. Drizzle config
points at `lib/db/src/schema/index.ts`. Journaled migrations in
`lib/db/drizzle/` (9 files, `0000`-`0008`) but these are RECORDS, not
auto-applied — `drizzle-kit push` doesn't consume them. Drift detection
via `lib/db/src/__tests__/__fixtures__/schema.sql.template` + `pg_dump`
diffs in `check-fixture-drift.sh`.

Domain atom registry: 19 atoms in
`artifacts/api-server/src/atoms/registry.ts:162-230` (sheet, engagement,
snapshot, submission, intent, briefing-source, parcel-briefing,
neighboring-context, materializable-element, briefing-divergence,
bim-model, reviewer-annotation, reviewer-request, viewpoint-render,
render-output, finding, communication-event, decision-event,
submission-classification).

Code atoms (legal corpus, separate concept from domain atoms): 479 on
helium dev DB — Grand County Land Use 215, Bastrop Muni Code 189, Grand
County IWUIC 61, Grand County IRC R301.2.1 14. Production Neon count not
yet verified. Earlier "264 atoms" claim was a stale UI-audit snapshot.

`scripts/post-merge.sh` runs `pnpm install --frozen-lockfile && pnpm
--filter @workspace/db run push-force` plus two backfill scripts. **NO
Neon-target guard.** `push-force` invokes
`drizzle-kit push --force --config ./drizzle.config.ts`, bypassing
interactive confirmation. Behavior depends on what `DATABASE_URL` resolves
to in the `[postMerge]` runtime context.

### Database

Deployment Neon: `ep-little-base-amyyxjca.c-5.us-east-1.aws.neon.tech`
(region `us-east-1`). Replit-managed (Nick has no Neon Console access;
credential lives in Replit Secret `DEPLOYMENT_DATABASE_URL`).

Schema state on helium dev DB (queried via `DATABASE_URL`):

- 36 public tables
- `materializable_elements` present (with A04.7 columns
  `revit_central_guid`, `revit_document_path`)
- `snapshot_ifc_files` MISSING — Track B IFC schema not applied to dev DB
- `code_atoms`: 479 rows, breakdown above

Schema state on deployment Neon: not directly probed in the recent recon
(probe used `DATABASE_URL` = helium, not `DEPLOYMENT_DATABASE_URL` = Neon).
Track B's `track-b-ifc-ingest.sql` was applied to deployment Neon during
the 2026-05-04 saga via Replit Agent.

### Replit Repl

Repl HEAD: `3784660` — diverges from origin/main `99a6a022`. Direction
(ahead/behind/forked) unverified due to a stale `git fetch` lock during
the recent probe. Same drift pattern as SmartCity OS Repl, smaller commit
count.

`DATABASE_URL` → helium (`heliumdb`, PG 16.10).
`DEPLOYMENT_DATABASE_URL` → Neon prod. The `[postMerge]` hook has no
`[postMerge.env]` override, so its runtime `DATABASE_URL` resolves by
Replit's deploy-context conventions — not determinable from on-disk
config alone.

### Outstanding (design-accelerator)

- post-merge.sh Neon guard (Fire 3 — verify on origin/main GitHub web UI;
  if absent, ship one-file PR)
- Cloud Run + GitHub Actions migration sprint (post-saga commitment)
- Empressa Neon migration paired with Cloud Run sprint
- `x-snapshot-secret` rotation in migration sprint cutover
- Resolve Repl drift if any commits matter beyond auto-checkpoints
- Sprint taxonomy mismatch: planner memory uses A01-A06 vocabulary that
  doesn't match repo (which uses DA-PI-*, V1-*, Sprint A-D, AIR-*, PLR-*).
  Update memory to match repo convention.
- Live engagement list and prod code_atoms count via SELECT against
  deployment Neon

## Revit Connector (legacy-revit-sensor)

GitHub: `empressaioemail-tech/legacy-revit-sensor`. Local clone:
`p:\legacy-revit-sensor`.

### Repository

Origin/main HEAD: `ee83aa2` ("Sprint A05 — IFC export 3D-view resolution +
diagnostic logging + transaction safety", PR #2). Two PRs merged (#1 Phase
D, #2 3D-view + log + transaction). One additional remote branch:
`sprint-a05-ifc-3dview-fix`.

Solution: `LegacyRevitSensor.sln` with three projects:

- `LegacyRevitSensor.Shared` — `net48`, `UseWindowsForms=true`, single
  PackageReference (`System.Text.Json 8.0.5`)
- `LegacyRevitSensor.Revit2026` — `net8.0-windows`, x64, hardcoded
  RevitAPI HintPath at `C:\Program Files\Autodesk\Revit 2026\`
- `LegacyRevitSensor.Revit2024` — `net48`, x64, re-uses Revit2026 sources
  via `<Compile Include="..\..." Link="..." />`

Both Revit-version projects auto-deploy on build via MSBuild target
`CopyAddinToRevit AfterTargets="Build"` to
`%APPDATA%\Autodesk\Revit\Addins\{2024|2026}\`. Build = install pattern;
no separate installer.

Single ribbon panel: `Design Tools` (registered to the built-in Add-Ins
tab) with two buttons:

- `Send Snapshot` — `LegacyRevitSensor.Commands.SendSnapshotCommand`
  (~565 lines, full A→B→C→D pipeline)
- `Configure` — `LegacyRevitSensor.Commands.ConfigureCommand` (~55 lines,
  dialog + settings save)

There is **no** "six panels" structure (Project / Site / Design / Review /
Visualize / Co-pilot) — that vocabulary doesn't exist in this repo.
**No** B1-B5 taxonomy in any source file.

A04.7 engagement-identity dedup fix is merged (commit `3499037`). Dedup
key construction at `LegacyRevitSensor.Revit2026/Snapshot/RevitIdentityExtractor.cs:15-21`
produces `RevitProjectIdentity(ProjectName, RevitCentralGuid,
RevitDocumentPath)`. Decision logic moved server-side to
`POST /api/engagements/match` per A04.7 transition. The
`ProjectInformation.Name` footgun is closed; `ProjectName` is one input
among three, GUID-precedent.

Wire contract — every URL is `settings.ReplitUrl.TrimEnd('/') + <path>`,
every request bears `x-snapshot-secret`:

| Verb | Path | Body | Client |
|---|---|---|---|
| POST | `/api/engagements/match` | JSON `MatchRequest` | `EngagementMatchClient.cs:36` |
| POST | `/api/snapshots` | JSON `SnapshotPayload` | `SnapshotClient.cs:28` |
| POST | `/api/snapshots/{id}/sheets` | multipart | `SheetUploadClient.cs:36` |
| POST | `/api/snapshots/{id}/ifc` | multipart | `IfcUploadClient.cs:54` |

Settings stored at `%APPDATA%\Hauska\DesignTools\settings.json`.
Diagnostic log at `%APPDATA%\Hauska\DesignTools\ifc-export-errors.log`
(path defined in `IfcExporter.cs` per `ee83aa2` — earlier commits don't
have this).

Test coverage: none. No NUnit/xUnit, no CI config (`.github/` absent).
Validation is documented as manual Revit click-through in `TESTING.md`.

### Outstanding (revit-connector)

- Decide where B1-B5 taxonomy belongs if it's still a v1.0 requirement
  (server-side classification in api-server is the natural home, since the
  wire payload doesn't carry taxonomy)
- Open second branch `sprint-a05-ifc-3dview-fix` — purpose unclear, may be
  a follow-on or alternate path beyond `ee83aa2`
- No automated tests / CI — long-term gap

## Active fires

Ranked by current exposure as of 2026-05-05.

### Fire 1 — Auth bypass live on SmartCity OS production

`server/routes.ts:83` accepts `x-internal-ai: smartcity-ctx` as
authentication for any external caller. Trivially exploitable from
anywhere on the public internet. Cloud Run revision `00082-pog` (currently
serving 100% traffic at `smartcityos.io`) contains the unfixed code.

Fix is scoped (single-file patch + possible 1-line trust-proxy add in
`server/app.ts`), tested pattern (mirrors the existing loopback gate in
`server/middleware/tenant.ts:55-62`). No longer gated on Phase 0 Stage 8
since Stage 8 was never codified.

### Fire 2 — Plaintext secrets in SmartCity OS `.replit` committed to git

`.replit` `[userenv.shared]` contains, verbatim:

- `ADMIN_RESET_PASSWORD = "Admin123!"`
- `USER_RESET_PASSWORD = "Admin123!"`
- `BASTROP_BOOTSTRAP_PASSWORD = "Admin123!"`
- `ARCGIS_CLIENT_SECRET` (full value)
- `VERKADA_API_KEY` (full value)
- `CALENDAR_API_KEY` (full value)
- All six `VFD_CODE_*` codes
- `USER_RESET_EMAIL = "jsaldivar@cityofbastrop.org"` (PII — Bastrop
  employee)
- `SPIREON_USERNAME` (username, not password — lower severity)

The `Admin123!` literal is independently bad: any password reset operation
produces that exact string. Repo privacy unknown; assume compromised.

Mitigation: rotate all listed secrets, change bootstrap-password
mechanism to generate-on-first-run, remove `[userenv.shared]` plaintext
from current `.replit` (not from git history — that's a separate cleanup
with merge implications).

### Fire 3 — legacy-design-tools `post-merge.sh` runs `drizzle-kit push --force` with no Neon guard

Every merge to main re-arms a schema-wipe-against-prod risk if the
`[postMerge]` runtime context resolves `DATABASE_URL` to deployment Neon
rather than helium. The Replit Agent reported a "Task #526 (Neon guard) is
now MERGED" but the on-disk script still doesn't show a guard, and the
Repl's local main lags origin (`3784660` vs `99a6a022`).

Mitigation: verify directly via GitHub web UI at
`https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/scripts/post-merge.sh`.
If a guard is present, Fire 3 is closed. If not, ship a one-file PR.

### Fire 4 — SmartCity OS Repl drift (10 unpushed commits, autoscale still armed)

Demoted from "loaded gun" to "cleanup debt" because `smartcityos.io` is
unambiguously on Cloud Run (not the Repl). The Repl can deploy to its own
URL but no production traffic is exposed. Risk remaining: the unpushed
`b67c333` ("Fix issue preventing users from publishing updates") may be a
real fix that needs preservation before Repl cleanup.

Mitigation: triage the 10 commits, cherry-pick anything functional onto a
feature branch, push, discard remainder, neutralize `[deployment]` block
in `.replit`.

### Fire 5 — Cross-region DB hop on SmartCity OS

Cloud Run is in `us-central1`; production Neon is in `us-west-2`. Every
query crosses a region. Real but not urgent. Add to migration sprint
scope: provision the new Empressa Neon in `us-central1` to colocate.

## Planner-belief corrections

Memory entries and current Claude.ai project knowledge contained these
stale or wrong items as of 2026-05-05. Update accordingly:

- SmartCity OS is NOT live on Replit. Live on Cloud Run since 2026-05-03
  cutover. The Replit Repl is functionally orphaned but not formally
  retired.
- Phase 0 Stage 8 (Replit detach) has no codified evidence; either
  skipped or done without a record. No commit, tag, or markdown
  reference.
- The "264 atoms" figure was a UI-audit snapshot. Live count on
  legacy-design-tools' helium dev DB is 479. Production count needs a
  SELECT to confirm.
- Domain-event atoms (19, in api-server `registry.ts`) and code-atoms
  (legal corpus, populated by ingest pipelines) are different concepts.
  Both real, not the same thing.
- The "six ribbon panels" (Project / Site / Design / Review / Visualize /
  Co-pilot) and "B1-B5 taxonomy" are aspirational. Neither exists in any
  of the three active repos. The actual Revit add-in has one panel
  ("Design Tools") with two buttons.
- A01-A06 sprint taxonomy is wrong for legacy-design-tools. The repo uses
  DA-PI-*, V1-*, Sprint A-D, AIR-*, PLR-*. Only A04.7 lines up with
  planner memory.
- `engagements` and `code_atoms` tables live on legacy-design-tools' Neon,
  not on SmartCity OS's. Entirely separate schemas — SmartCity OS Neon has
  106 public tables of Bastrop municipal data; design-tools has the
  architect/engagement universe.
- SmartCity OS Neon endpoint region: `us-west-2` (full host:
  `ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech`). Earlier memory
  had no region info.
- Compass system prompt is at `server/routes/ai-assistant.ts:1005`, not
  905.
- Bundle name from current local build is `index-BsfNEJYB.js`. Earlier
  memory's `index-BI7HSHku.js` is at minimum stale.
- Test engagements partial confirmation: Seguin and Musgrave (correct
  spelling, not "Muskgrave") are in `seed.ts`. Balsley is a test stand-in
  name. Alexander 404 Miami and Dart Frog don't appear in source — need
  a SELECT against deployment Neon to confirm whether they're live there.
- Replit Agent reliability for git-state introspection is limited (one
  probe hit a fetch lock, the other had partial git output). Reinforces
  v2 agent rule HR-2 (Replit Agent for repl-local ops only) and HR-8
  (verbatim verification artifacts required).

## Open questions / could-not-probe

- Production `code_atoms` count and breakdown (deployment Neon — needs
  SELECT)
- Production active engagements list on legacy-design-tools (deployment
  Neon — needs SELECT)
- Whether Track B's `snapshot_ifc_files` schema is actually applied to
  deployment Neon (deployment Neon — needs `to_regclass` check)
- Whether `[postMerge]` hook on legacy-design-tools resolves
  `DATABASE_URL` to helium or Neon at runtime
- Open PRs across all three repos (`gh` CLI was unauthenticated in every
  recon environment)
- Whether the unpushed `b67c333` commit on SmartCity OS Repl needs
  preservation
- The Stage 8 closure narrative — was it skipped or done without a
  record?
- `smartcity-staging-*` Secret Manager entries — is there an actual
  staging environment running, what's it for?
- The `Task #526 / #527` references in the legacy-design-tools Replit
  Agent's report — actual task tracker state TBD
- `app.set('trust proxy', ...)` execution path in
  `server/index-cloud.ts` (relevant to W1.C.4a auth fix design)

## What this supersedes

When this doc lands, the following entries in current Claude.ai project
knowledge become superseded or partially replaced:

- `01_current_state_ground_truth.md` — Cloud Run vs Replit, Stage 8
  status, DB region, atom counts
- `03_state_of_reality.md` — multiple corrections per
  [Planner-belief corrections](#planner-belief-corrections)
- `04_strategic_conversation_record.md` — needs additions for Stage 8
  fictional finding, auth bypass live on prod, plaintext secrets
  discovery
- `11_roadmap.md` — Phase 0 not actually closed; W1.C dispatch un-gated
  since Stage 8 was fictional
- `12_deployment_rules.md` — needs canonical Cloud Run pattern (build →
  no-traffic canary → smoke → traffic shift → backup tag → 1h watch)
- `13_agent_operating_rules.md` — superseded by v2 (lands as
  `20_agent_operating_rules.md`)
- `STATE-OF-REALITY-UPDATE-2026-04-29.md` and other dated forensics —
  superseded by this synthesis; move worth-preserving items to
  `91_postmortems/`
