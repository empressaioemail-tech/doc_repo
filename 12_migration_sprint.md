---
id: 12_migration_sprint
title: Migration sprint â Cloud Run + Empressa Neon + Drizzle migrate
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [10_ground_truth, 11_roadmap, 15_replit_neon_ownership_advisory, 23_dev_setup_assessment, adr_002_replit_neon_migration, adr_003_replit_neon_tactical, 2026-05-05_track_b_deploy_saga, replit_deploy]
---

# Migration sprint â Cloud Run + Empressa Neon + Drizzle migrate

> **Working sprint plan.** Edit in place as items ship. Check items
> off, fill in actual SHAs / dates / observations. The sprint plan is
> the working artifact; surrounding narrative stays minimal so the
> checklist stays scannable.
>
> When all three phases complete and the 24-hour Phase 3 observation
> passes, this doc moves to `status: superseded` with a closeout
> footnote pointing at the postmortem (which lands as
> `91_postmortems/<date>_migration_sprint.md`).
>
> **Why surgical 3-phase split, not lumped:** the Track B saga
> ([`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md))
> taught that compound deploys hide their own failure modes. Each
> phase below introduces ONE production change at a time with a
> verification window between. Total elapsed ~3 dev-days vs ~2.5
> lumped â the half-day premium buys failure-mode containment,
> especially around SmartCity OS's live Bastrop users.

## Phase status board

| Phase | Sub-phase | Description | Owner | Status | Started | Completed | Notes |
|---|---|---|---|---|---|---|---|
| 1 | 1A | legacy-design-tools api-server: Cloud Run + GHA CI + container, deploy with OLD Replit Neon, verify (frontends remain on Replit autoscale pending separate phase) | Nick + agent | verified | 2026-05-06 | 2026-05-06 | PRs #18, #20, #21, #22, #24 + fix/cloud-run-first-deploy-and-auth-flags merged. Revision `api-server-00003-wix` tagged canary, `/api/healthz` HTTP 200. Traffic at 100% via canary tag (auto-promoted to LATEST per Cloud Run first-deploy semantics). Backup tag `backup/post-1A-100traffic-api-server-00003-wix` at `e4b15c1` on origin. |
| 1 | 1B | legacy-design-tools: Empressa Neon provisioning + schema sync (parallel-eligible with 1A) | Nick + agent | verified | 2026-05-10 | 2026-05-10 | Schema-only pg_dump from Replit-managed Neon (ep-little-base-amyyxjca, PG 16.12) → Empressa Neon (ep-dry-queen-aq0yxp05-pooler, PG 17.8) via Cloud Shell. Excluded test_* schemas (4 integration test artifacts) + _system (Replit-managed migration tracking). 36 tables / 419 cols / 98 idx / 104 constraints (36 PK + 37 FK + 5 u + 26 c); plpgsql + vector 0.8.0 ext parity. Tooling: pg_dump/psql 16.13 in Cloud Shell. EMPRESSA_DATABASE_URL secret v1 on legacy-design-tools-prod. |
| 1 | 1C | legacy-design-tools: data sync + cutover from Replit Neon to Empressa Neon | Nick + agent | pending | â | â | â |
| 2 | 2A | SmartCity OS: Empressa Neon provisioning (us-central1) + schema sync | Nick + agent | pending | â | â | â |
| 2 | 2B | SmartCity OS: data sync + cutover at low-traffic window | Nick + agent | pending | â | â | â |
| 2 | 2C | SmartCity OS: 24h observation + decommission Replit-managed Neon | Nick | pending | â | â | â |
| 3 | 3A | Drizzle migrate baseline generation (both apps) | Nick + agent | pending | â | â | â |
| 3 | 3B | Drizzle migrate adopted in CI for both apps | Nick + agent | pending | â | â | â |
| 3 | 3C | Retire push-force / hand-rolled SQL paths | Nick + agent | pending | â | â | â |

Status values: `pending` / `active` / `verified` / `rolled_back` /
`superseded`.

## Deferred items

Items deliberately scoped out of this sprint, captured here so they
don't get lost in chat:

- **Frontend hosting decision** â `design-tools`, `plan-review`,
  `mockup-sandbox` artifacts in the legacy-design-tools monorepo.
  Deferred from Phase 1A. Queued for separate phase scoping. Owner:
  Nick + planner.

## Cross-cutting prerequisites

These must be in place before any phase starts. Some are already
queued separately in [`11_roadmap.md`](11_roadmap.md):

- [x] **Empressa Neon Pro account created** under a Legacy Group /
      Empressa email (2026-05-06; account empressaioemail@gmail.com
      on Empressa-org Scale tier â exceeds the Pro tier the prereq
      named). See
      [`adr_004_future_neon_provisioning.md`](80_adrs/adr_004_future_neon_provisioning.md).
- [ ] **Empressa credentials vault decision made** (1Password or
      alternative). New Neon credentials land here, not in `.replit`
      or repo files. See [`11_roadmap.md`](11_roadmap.md) P2 entry.
- [x] **`gh auth login` complete on Nick box** (2026-05-06, with
      `workflow` scope per `gh auth refresh -h github.com -s workflow`
      â the default scope set does NOT include `workflow`, blocked
      first push of `.github/workflows/` files). Required for
      agent-opened PRs across the sprint. See
      [`22_workstation_inventory.md`](22_workstation_inventory.md).
- [x] **GCP project decision for legacy-design-tools** â new project
      `legacy-design-tools-prod` created 2026-05-06. Keeps blast
      radius separate; aligns with the "each product owns its own
      infrastructure" pattern (ADR-004); simplifies IAM.
- [x] **Backup tags on origin/main** â
      `backup/pre-migration-sprint-20260506` at `b135955` on
      legacy-design-tools origin (2026-05-06). SmartCity OS backup
      tag pending until Phase 2 prep.
- [x] **`iamcredentials.googleapis.com` enabled on
      `legacy-design-tools-prod`** â required for WIF auth from GHA;
      silent failure mode if missing (first build-and-push run
      surfaced this gap). Now in deploy.md prereqs explicitly.

### Phase 2 added prereqs (scoped 2026-05-10)

- [ ] post-merge.sh Neon guard verification on smartcity-os — scripts/post-merge.sh was neutralized in PR #7 (Fire 4 close-out, 2026-05-10 PM); the original 200 lines are preserved below the loud-fail delimiter for reference. Before Phase 2A swaps the underlying Neon, verify the (now-neutralized) script's three migration blocks (mygov_fees index, AI tables, MyGov schema-sync) are consistent with the future Drizzle migrate adoption path and the new Empressa Neon target. Owner: Nick + planner · S
- [ ] Migration prefix collisions on smartcity-os — two `0003_*` and two `0004_*` filenames in `migrations/` (per `10_ground_truth.md`). Resolve before Phase 2A schema sync so the dumped schema reflects deterministic migration ordering. Owner: agent · S · ref: 10_ground_truth.md
- [ ] gcloud SSL fix on Nick box — Cloud Shell has been the workaround for Fire 1 deploy, Phase 1B prereqs (Secret Manager), and Phase 1B Stage 1 (psql/pg_dump). Fix Nick box's gcloud SSL cert chain (`unable to get local issuer certificate`) so future deploys + ad-hoc Secret Manager work doesn't require Cloud Shell every time. Owner: Nick · S

## Phase 1 â legacy-design-tools full migration

**Goal:** legacy-design-tools serves production from Cloud Run +
GitHub Actions CI, against an Empressa-owned Neon database. Replit
deploys retired from the production traffic path.

**Why first:** legacy-design-tools is pre-launch (no live customer
users beyond Empressa internal). Risk tolerance is highest; the
right place to develop the migration playbook before applying
lessons to SmartCity OS.

**Estimated:** 1.5 dev-days execution + 24h observation.

### Sub-phase 1A â Cloud Run + GHA CI, deploy against OLD Replit Neon

**Why this first:** Introduces the new deploy infrastructure
without changing the database. If Cloud Run + container + GHA
breaks, the database is unaffected and rollback is to keep using
Replit's deploy. Verification window before any data changes.

- [ ] GCP project provisioned (per cross-cutting prerequisite)
- [ ] Artifact Registry repository created in chosen GCP project
- [ ] **Dockerfile** for `artifacts/api-server` written and verified
      builds locally
- [ ] **GitHub Actions workflow** drafted: PR CI (typecheck, test,
      lockfile) + main deploy (build container, push to AR,
      `gcloud run deploy`)
- [ ] **GCP Secret Manager entries** for legacy-design-tools (mirror
      the SmartCity OS pattern):
      - [ ] `legacy-design-tools-DATABASE_URL` (initially set to
            existing Replit-managed Neon URL; rotates in 1C)
      - [ ] `legacy-design-tools-x-snapshot-secret`
      - [ ] Other secrets currently in `.replit` `[userenv.shared]`
            that are needed at runtime
- [ ] **Cloud Run service provisioned** with traffic at 0% on the
      first deploy (canary tag pattern per
      [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md)
      diagnostic principles)
- [ ] **Smoke probe** of canary tag URL: GET / returns expected
      shape; POST /api/snapshots/:id/ifc returns 401 on missing
      secret; /api/engagements/match returns 401 on missing secret
- [ ] **Traffic shift to 100%** on Cloud Run canary tag
- [ ] **Custom domain mapping** if `prompt-agent-accelerator.replit.app`
      is being preserved; or new domain decision if migrating off
- [ ] **24h observation**: error rates, latency, app behavior â match
      Replit baseline
- [ ] **Replit deploy retired** from autoscale config (see
      [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md))
- [ ] **Backup tag** `backup/post-1A-<YYYYMMDD>` at the deployed SHA

**Sub-phase 1A rollback:** Revert Cloud Run to Replit autoscale by
flipping `[deployment]` block back on in `.replit`, sync local main,
redeploy. Cloud Run service stays provisioned but receives 0%
traffic.

**Sub-phase 1A success criteria:**
- All 4 wire endpoints reachable via Cloud Run URL with correct
  authentication behavior
- 24h observation shows error rates and latency at or better than
  Replit baseline
- No customer-facing breakage observed

### Sub-phase 1B â Empressa Neon provisioning + schema sync

**Parallel-eligible with 1A.** Database setup doesn't touch
production until 1C cutover; can run while Cloud Run work is in
progress.

- [ ] **Empressa Neon project created**: `legacy-design-tools-prod`
      in `us-east-1` (matches current Replit-managed Neon region; no
      reason to change for this app)
- [ ] **Connection string** stored in Empressa credentials vault
      (NOT pasted into chat, NOT committed to any repo)
- [ ] **Schema-only `pg_dump`** from Replit-managed Neon
      (`ep-little-base-amyyxjca`):
      ```bash
      pg_dump --schema-only --no-owner --no-acl \
        "$REPLIT_DEPLOYMENT_DATABASE_URL" > schema.sql
      ```
- [ ] **Schema restore to Empressa Neon**:
      ```bash
      psql "$EMPRESSA_NEON_URL" -f schema.sql
      ```
- [ ] **Schema parity verification** (`\d+` on every table; row
      count differences expected, schema differences not)
- [ ] **Extension parity check** â pgvector, others â extensions
      present on Empressa Neon match Replit-managed
- [ ] **Test query suite** against Empressa Neon empty schema
      (queries that should succeed on empty tables work; queries that
      depend on data fail expected)

**Sub-phase 1B rollback:** Empressa Neon project stays provisioned
but unused. No production impact since the connection string isn't
wired anywhere yet.

### Sub-phase 1C â Data sync + cutover

**Prerequisites:** 1A verified (Cloud Run path stable), 1B verified
(schema parity confirmed).

- [ ] **Schedule low-traffic window** for cutover
- [ ] **Data-only `pg_dump`** from Replit-managed Neon at the
      window:
      ```bash
      pg_dump --data-only --no-owner --no-acl \
        "$REPLIT_DEPLOYMENT_DATABASE_URL" > data.sql
      ```
- [ ] **Data restore to Empressa Neon**:
      ```bash
      psql "$EMPRESSA_NEON_URL" -f data.sql
      ```
- [ ] **Row count parity verification** between source and
      destination (every table, exact match expected)
- [ ] **Update GCP Secret Manager** entry
      `legacy-design-tools-DATABASE_URL` to Empressa Neon URL
- [ ] **Roll Cloud Run service** to pick up new secret (new revision
      with same image, different env)
- [ ] **Smoke probe** post-cutover (~5 min after traffic shift)
- [ ] **24h observation**: error rates, latency, no rows being
      written to BOTH databases
- [ ] **Decommission decision**: delete Replit-managed Neon project
      (may require Replit support) OR leave empty + auto-paused
      (cost ~$0). Document choice.
- [ ] **Backup tag** `backup/post-1C-<YYYYMMDD>` at deployed SHA

**Sub-phase 1C rollback:** Revert
`legacy-design-tools-DATABASE_URL` Secret Manager value to the
Replit-managed Neon URL; roll Cloud Run service. Fast revert. The
24h observation window is exactly when this matters.

**Sub-phase 1C success criteria:**
- Application reads/writes to Empressa Neon with parity to source
- Row counts match between source and destination
- 24h observation passes
- Replit-managed Neon decommission decision documented

### Phase 1 closeout

- [ ] All sub-phases verified
- [ ] Phase status board updated
- [ ] Lessons captured for Phase 2 (any deviation from plan is a
      lesson)
- [ ] Phase 2 prerequisites confirmed before kickoff

## Phase 2 â SmartCity OS Empressa Neon swap

**Goal:** SmartCity OS reads/writes against an Empressa-owned Neon
database in `us-central1` (closes Fire 5 cross-region hop). Cloud
Run service unchanged; only the connection string changes.

**Why second:** SmartCity OS is live with Bastrop users. Risk
tolerance is lowest. Phase 1 develops the migration playbook;
Phase 2 applies the verified pattern with one variable changed.
Cloud Run is already in place â only the DB swap remains.

**Estimated:** 0.5 dev-days execution + 24h observation.

### Sub-phase 2A â Empressa Neon provisioning + schema sync

- [ ] **Empressa Neon project created**: `smartcity-os-prod` in
      **`us-central1`** (deliberate region change to colocate with
      Cloud Run and close Fire 5)
- [ ] **Connection string** stored in Empressa credentials vault
- [ ] **Schema-only `pg_dump`** from Replit-managed Neon
      (`ep-floral-sound-afocvkct`)
- [ ] **Schema restore** to Empressa Neon
- [ ] **Schema parity verification** â particular attention to:
      - `tenant_id` column on every atomic table (multitenancy
        invariant)
      - 106 public tables per
        [`10_ground_truth.md`](10_ground_truth.md)
      - Hand-rolled SQL prefix-collision migrations resolved
        consistently in target
- [ ] **Extension parity check**

**Sub-phase 2A rollback:** Empressa Neon project unused; no
production impact.

### Sub-phase 2B â Data sync + cutover

**Prerequisites:** 2A verified (schema parity confirmed). Phase 1
fully verified (cutover playbook proven).

- [ ] **Schedule low-traffic window** for cutover (Bastrop is in
      US/Central; pick a window that minimizes city-staff active
      hours)
- [ ] **Tenant-data verification before cutover** â confirm
      `tenant_id = 2` (Bastrop production) and `tenant_id = 1`
      (demo) data both present in source
- [ ] **Data-only `pg_dump`** from Replit-managed Neon
- [ ] **Data restore** to Empressa Neon
- [ ] **Row count parity verification** by tenant_id (Bastrop and
      demo tenants both intact)
- [ ] **Tenant integrity check**: no row in destination has
      `tenant_id = NULL` or unexpected tenant_ids
- [ ] **Update GCP Secret Manager** entry `smartcity-DATABASE_URL`
      (production version) to Empressa Neon URL
- [ ] **Roll Cloud Run `smartcity-api` service** to pick up new
      secret
- [ ] **Smoke probe** post-cutover:
      - `curl -sI https://smartcityos.io/api/healthz` returns 401
        (auth still expected)
      - Authenticated probe of a Bastrop-tenant endpoint
        (read-only) returns expected shape
- [ ] **Roll `smartcity-scraper` service** to pick up new secret if
      it shares the connection
- [ ] **Backup tag** `backup/post-2B-<YYYYMMDD>` at deployed SHA

**Sub-phase 2B rollback:** Revert `smartcity-DATABASE_URL` Secret
Manager value to the Replit-managed Neon URL; roll Cloud Run
services. The atomic nature of the secret update means rollback is
a single config change.

### Sub-phase 2C â Observation + decommission

- [ ] **24h observation window** with extra attention given
      Bastrop's live usage:
      - Error rates per tenant (Bastrop tenant_id=2 priority)
      - Latency improvement expected (us-west-2 â us-central1
        co-location)
      - No rows being written to BOTH databases
- [ ] **Bastrop sanity check** â Sylvia or Jaime confirms
      day-to-day app behavior unchanged (without disclosing the
      migration; their experience should be invisible)
- [ ] **Decommission Replit-managed Neon** for SmartCity OS (or
      leave auto-paused; document choice)
- [ ] **Backup tag** `backup/post-2C-<YYYYMMDD>`

**Sub-phase 2C success criteria:**
- 24h observation passes
- Latency at-or-better than baseline (cross-region hop closed)
- No tenant data integrity issues
- Bastrop usage unchanged from user perspective

### Phase 2 closeout

- [ ] All sub-phases verified
- [ ] Phase status board updated
- [ ] **ADR-003 (`adr_003_replit_neon_tactical.md`) status flips to
      `superseded`** with `superseded_by:
      adr_002_replit_neon_migration` â the tactical workaround
      formally retires
- [ ] **Phase 2C closure unblocks engine factor-out** per [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md). The factor-out is sequenced after Phase 2C closes; reference the ADR for naming, repo placement, and downstream sprint scoping.
- [ ] Update [`10_ground_truth.md`](10_ground_truth.md) Fire 5
      (cross-region hop) status â closes
- [ ] Phase 3 prerequisites confirmed

## Phase 3 â Drizzle migrate adoption

**Goal:** Both apps run journaled Drizzle migrations through CI on
deploy. Replace `drizzle-kit push` (legacy-design-tools) and
hand-rolled SQL in `migrations/` (SmartCity OS) with versioned,
journaled migrations.

**Why third:** Process change, not infrastructure. Lower risk than
Phases 1-2; can be done after the moves settle. Each app gets its
own apply pass since the existing migration patterns differ.

**Estimated:** 1 dev-day execution + verification.

### Sub-phase 3A â Drizzle migrate baseline generation (both apps)

- [ ] **legacy-design-tools** baseline:
      - [ ] Run `drizzle-kit generate` against current schema state
            on Empressa Neon
      - [ ] Verify generated migration file matches the live schema
            (no diff against destination)
      - [ ] Commit baseline migration to repo (`lib/db/drizzle/`)
- [ ] **SmartCity OS** baseline:
      - [ ] Move existing `migrations/` SQL files to
            `migrations/historical/` with a README
      - [ ] Run `drizzle-kit generate` against current schema state
            on Empressa Neon
      - [ ] Verify generated migration file matches the live schema
      - [ ] Commit baseline migration to repo (`migrations/drizzle/`
            or similar â pick a path)

**Sub-phase 3A rollback:** Baseline migrations sit in repo unused.
No production impact.

### Sub-phase 3B â CI integration

- [ ] **legacy-design-tools** GitHub Actions workflow:
      - [ ] Add `pnpm --filter @workspace/db drizzle-kit migrate`
            step on deploy
      - [ ] Verify workflow runs against Empressa Neon (not against
            Replit-managed; the swap is done by this point)
      - [ ] Test by adding an idempotent no-op migration and
            observing CI applies it
- [ ] **SmartCity OS** GitHub Actions workflow (separate from
      Phase 1's; SmartCity OS already has Cloud Run, but CI for
      schema migrations may not exist yet):
      - [ ] Decide CI provider â GitHub Actions parallel to
            legacy-design-tools is the natural choice
      - [ ] Add `drizzle-kit migrate` step
      - [ ] Test with idempotent no-op migration

**Sub-phase 3B rollback:** Remove the migrate step from CI; manual
migrations resume via the path in
[`adr_003_replit_neon_tactical.md`](80_adrs/adr_003_replit_neon_tactical.md)
(but adapted for Empressa Neon â `psql` direct, since console
access exists now).

### Sub-phase 3C â Retire push-force / hand-rolled SQL paths

- [ ] **legacy-design-tools** `scripts/post-merge.sh`:
      - [ ] Remove `pnpm --filter @workspace/db run push-force` line
      - [ ] If the post-merge.sh has other useful side-effects, keep
            them; if it's only push-force, remove the file and the
            `[postMerge]` hook in `.replit`
      - [ ] Update `package.json` to drop the `push-force` script
- [ ] **SmartCity OS** `scripts/post-merge.sh`:
      - [ ] Audit current idempotent DDL â any operations now
            redundant with journaled migrations get removed
      - [ ] Migration prefix collisions (two `0003_*`, two `0004_*`)
            either resolved during 3A baseline or moved to
            `historical/`
- [ ] **Update [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
      HR-5** â current rule prohibits `drizzle-kit push --force` in
      auto-triggered hooks. After Phase 3, rule simplifies to "no
      `push` or `push-force` in any auto-triggered hook; migrations
      are journaled and CI-applied." Update wording.
- [ ] **Update
      [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md)** â
      schema-management section reflects journaled migrations as
      the live pattern.

**Sub-phase 3C rollback:** Restore the previous post-merge.sh /
hand-rolled SQL paths from git history. Roll forward by re-running
3A + 3B if the issue is fixable.

### Phase 3 closeout

- [ ] All sub-phases verified
- [ ] **Migration sprint complete** â three phases shipped, all
      verified
- [ ] **This doc moves to `status: superseded`** with closeout
      footnote
- [ ] **Closeout postmortem** drafted as
      `91_postmortems/<date>_migration_sprint.md` capturing actuals
      vs estimates, surprises, lessons applicable to future
      migrations

## Verification protocol (cross-phase)

Every sub-phase ends with:

1. **Verification queries** that prove the change took effect (not
   just that the deploy succeeded). Pasted verbatim per HR-8.
2. **Smoke probes** against expected response shapes per HR-3.
3. **24-hour observation** for sub-phases that touch production
   data. No exceptions for "I'm sure it's fine."
4. **Backup tag** at the verified SHA for fast rollback if a later
   phase exposes a hidden issue.

## Rollback / abort criteria

Sprint-level abort triggers (any one stops the sprint, planner
assesses before continuing):

- **Three deploy failures in 4 hours** for distinct reasons (HR-7).
  Stop and assess; the tooling may be fighting the work.
- **Phase 1A reveals a Cloud Run + container incompatibility** that
  isn't quickly resolvable (the Track B saga had three stacked bugs
  â same risk shape if it appears here).
- **Schema parity check fails** between source and destination
  Neon at the schema-sync step. Fix the Empressa Neon project
  configuration before proceeding.
- **Row count mismatch** at the data-sync step. Investigate before
  cutover.
- **Latency regression** post-cutover that doesn't recover within
  the 24h window.
- **Bastrop disruption signal** during Phase 2 â Sylvia or Jaime
  reporting unusual app behavior. Roll back, regroup.

Each sub-phase has its own scoped rollback above. Sprint-level
abort uses individual rollbacks plus halt-and-assess at the
appropriate stage gate.

## Discipline cross-references

This sprint operates under
[`20_agent_operating_rules.md`](20_agent_operating_rules.md).
Particularly relevant rules:

- **HR-1** GitHub web UI as ground truth â for repo state during
  Phase 1A's GHA workflow setup
- **HR-2** committed != pushed â every code change in this sprint
  pushes to origin/main with explicit verification
- **HR-3** deploy success != feature live â every deploy gets a
  curl probe in the same chat turn
- **HR-6** verify env-var bindings before destructive ops â every
  Neon connection change has a redacted-credential echo before
  apply
- **HR-7** three failures in 4 hours = stop â see abort criteria
  above
- **HR-8** verbatim verification artifacts â every recon report
  pastes raw command output
- **HR-10** Replit local main sync â applies until Phase 1A
  completes and Replit deploy retires for legacy-design-tools

## Status tracking

Edits to this section log progress. Newest at top. Format: date â
phase â note.

- *2026-05-06 (PM) â Phase 1A traffic ramp closed. Canary tag at
  100% to api-server-00003-wix, both bare service URL and canary
  URL routing identically. Backup tag
  `backup/post-1A-100traffic-api-server-00003-wix` at `e4b15c1` on
  `legacy-design-tools` origin. Empressa Neon project provisioned
  for Phase 1B (project ID `shiny-snow-37459644`, Scale tier);
  workstation Postgres client + `EMPRESSA_DATABASE_URL` secret load
  pending. See
  [`_sessions/2026-05-06_phase_1a_ramp_and_1b_prep_claude_ai_planner.md`](_sessions/2026-05-06_phase_1a_ramp_and_1b_prep_claude_ai_planner.md).*
- *2026-05-06 â Phase 1A **verified**. PR #24 mounted
  `SNAPSHOT_SECRET` (one-line workflow fix unblocking the boot
  validator at `lib/snapshotSecret.ts:14-17`). Canary revision
  `api-server-00003-wix` reachable at
  `https://canary---api-server-tds7av26va-uc.a.run.app`,
  `/api/healthz` HTTP 200, all boot validators clear. Traffic ramp
  (10% â 50% â 100%) pending. See
  [`_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md`](_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md).*
- *2026-05-06 â Phase 1A active. Scaffold + first-deploy workflow
  fixes + cascading test fixes shipped via PRs #18, #20, #21, #22 +
  `fix/cloud-run-first-deploy-and-auth-flags`. GCP infrastructure
  stood up in `legacy-design-tools-prod` (5 APIs, AR repo, 2 SAs,
  WIF, 14 Secret Manager entries, GCS bucket, 4 GHA repo secrets).
  Backup tag at `b135955`. Canary smoke verification pending. See
  [`_sessions/2026-05-06_phase_1a_kickoff_claude_ai_planner.md`](_sessions/2026-05-06_phase_1a_kickoff_claude_ai_planner.md).*
- *2026-05-06 â sprint plan drafted; awaiting cross-cutting
  prerequisites before Phase 1A kickoff.*

## References

- [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md) â discovery, four risks, original migration plan
- [`80_adrs/adr_002_replit_neon_migration.md`](80_adrs/adr_002_replit_neon_migration.md) â the migration commitment this sprint executes
- [`80_adrs/adr_003_replit_neon_tactical.md`](80_adrs/adr_003_replit_neon_tactical.md) â tactical workaround that retires when Phase 2 closes
- [`80_adrs/adr_004_future_neon_provisioning.md`](80_adrs/adr_004_future_neon_provisioning.md) â forward-looking commitment for new products
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md) â the saga that surfaced the ownership problem and informed the split-not-lump structure
- [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md) â current deploy mechanics (retires for legacy-design-tools at Phase 1A close)
- [`23_dev_setup_assessment.md`](23_dev_setup_assessment.md) â Layer 2 strategic context for this sprint
- [`11_roadmap.md`](11_roadmap.md) â P1 entries tracking this sprint at the portfolio level
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) â engine factor-out gated on this sprint's Phase 2C

## Revision history

- **2026-05-06 (origin):** sprint plan drafted as `12_migration_sprint.md`.
  3-phase structure (legacy-design-tools full migration â SmartCity OS
  Neon swap â Drizzle migrate adoption) supersedes the original
  lumped 5-step plan in
  [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md).
  Cross-cutting prerequisites enumerated. Phase 1 split into 1A/1B/1C
  to land Cloud Run before Neon swap (per Track B saga lesson).
  Verification + rollback protocols per sub-phase. Status board at top
  for at-a-glance tracking.
