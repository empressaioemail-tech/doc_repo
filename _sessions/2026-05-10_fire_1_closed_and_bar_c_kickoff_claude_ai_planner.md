---
id: 2026-05-10_fire_1_closed_and_bar_c_kickoff_claude_ai_planner
title: Fire 1 closed in production + Bar C scope kickoff + Replit dev DB postmortem
date: 2026-05-10
agent: claude-ai-planner
repo: doc_repo
session_type: sprint_execution
status: active
rolled_up: true
rolled_up_into: [10_ground_truth, 11_roadmap, 15_replit_neon_ownership_advisory, 13_risk_register, 91_postmortems/2026-05-07_replit_dev_db_wedged]
---

# Fire 1 closed in production + Bar C scope kickoff + Replit dev DB postmortem

## Inputs

- Prior session orientation report (doc_repo recon — repo structure, roadmap state, fires inventory)
- smartcity-os recon report (current branch state, auth bypass code verbatim, `.replit` verbatim, build path discovery)
- Replit support email thread spanning 2026-04-29 → 2026-05-07 with Bob's diagnostic + recipe (Zendesk ticket VLR91Y-M3XRE)

## Outputs

### Fire 1 (W1.C.4a auth bypass) — closed in production

- PR #6 opened against smartcity-os: `fix(auth): gate x-internal-ai bypass on loopback (Fire 1, W1.C.4a)`
- Single-file patch on `server/routes.ts:83`, +5/-1, mirrors `server/middleware/tenant.ts:57-62` loopback pattern verbatim
- Typecheck baseline held at 422 (no new errors)
- Squash-merged to origin/main as commit `5e9fca3`
- Cloud Build SUCCESS in 2:29, image digest `sha256:8e3290178eeb...`
- Canary deployed via runbook Example 1 pattern: Cloud Run revision `smartcity-api-00084-weg`, tag `w1-c-4a-auth-fix`, `--no-traffic`
- Canary smoke probes both returned HTTP/2 401 (with bypass header + control without)
- Traffic shifted atomically via `update-traffic --to-tags w1-c-4a-auth-fix=100`
- Production smoke probes (smartcityos.io) both returned HTTP/2 401 — Fire 1 closed
- Prior revision `smartcity-api-00082-pog` held in pool at 0% for instant rollback during obs window
- Backup tag `backup/post-fire-1-5e9fca3` push attempted from Cloud Shell (success status pending paste-back; if push failed due to missing GitHub creds, tag from Cursor agent on Nick box)

### Bar C scope locked

Bar C = fires + Phase 2 (Neon swap) + W1 dispatches per Nick's call. Sequence agreed:

1. Fire 1 ✅ (this session)
2. Stage 8 / Fire 4 (Repl detach) — Option B from Replit postmortem
3. Phase 1B prereqs (psql install + EMPRESSA_DATABASE_URL secret load on Nick box)
4. Phase 1B + 1C dispatches (legacy-design-tools — different repo)
5. Phase 2 added prereqs (post-merge.sh Neon guard, migration prefix collision resolution, gcloud SSL fix)
6. Phase 2A / 2B / 2C dispatches (smartcity-os Neon swap)
7. Fire 2 — held until Bastrop IT engaged for external rotations (Esri, Verkada, Calendar, VFD codes)
8. W1 spec authoring + W1 dispatches (post-Phase-2C)

### Replit dev DB postmortem decision

Replit support thread (Apr 29 → May 7) diagnosed wedged dev DB on workspace `SmartCityOSMain` (helium pod at ~30 GiB > 20 GiB cap, postmaster.pid lock failure with "Disk quota exceeded"). Three MyGov tables responsible for the bulk: `mygov_raw_records` (~20 GB), `mygov_raw_sync_pages` (~9.3 GB), `mygov_work_orders` (~1.2 GB). Cloud Run prod unaffected — smartcityos.io served by Cloud Run, not Repl autoscale.

**Decision: Option B — retire the Repl, do not apply Replit's recipe.** Rationale: Repl is functionally orphaned (Cloud Run is production), dev-DB wedge is an inadvertent safety preventing accidental Republish of 10 unreviewed local-Repl commits. Fixing it would create labor + risk without benefit; retiring it closes Fire 4. This is also the second consecutive Replit-platform incident (Track B saga 2026-05-05 + this 2026-04-29) — strengthens ADR-002 migration thesis. Full postmortem at `91_postmortems/2026-05-07_replit_dev_db_wedged.md`.

## Decisions

- **Patch shape for Fire 1**: mirror `tenant.ts:57-62` verbatim (`req.ip || req.socket?.remoteAddress`, three-string isLoopback predicate). Trust proxy = 1 set in `setupAuth()` confirmed in stage 1 recon. Code-level reasoning: loopback predicate matches in-process fetch() to localhost; external requests through Cloud Run GFE resolve to non-loopback IPs.
- **Fire 1 deploy via Cloud Shell** (not Cursor agent on Nick box): Nick box gcloud has SSL cert verify error (`unable to get local issuer certificate`). Cloud Shell sidesteps. Approach validated for future smartcity-api deploys until SSL is fixed on Nick box.
- **Replit Option B**: retire the Repl, neutralize `[deployment]` and `[postMerge]` blocks via PR, rename workspace, do NOT fix dev DB.
- **Fire 2 holds for Bastrop IT**: external rotations (Esri, Verkada, Calendar, VFD codes) require coordination with the city's IT contacts; not solo-executable. Internal-only items (Admin123! ×3, USER_RESET_EMAIL, POWERBI_REPORT_ID) could be split into a Fire 2a sub-dispatch but deferring all together until Bastrop IT is in the loop is cleaner.

## Lessons / patterns

- **Cloud Run revision counter skips are normal.** `00082` → `00084` (skipped `00083`) does not indicate a problem. Don't add halt criteria around clean increments in future deploy dispatches.
- **Pre-existing CI failures (Semgrep, Gitleaks) on PR #6 are non-blockers.** Semgrep flagged `server/routes/mygov.ts:268` GCP metadata server fetch (`http://metadata.google.internal/...`) as "insecure HTTP" — false positive (link-local HTTP-only by Google's design). Gitleaks flags Fire 2's plaintext secrets in committed `.replit`. Both fail on every PR; branch protection allows admin merge through them. Will auto-resolve once Semgrep gets `// nosemgrep:` annotation and Fire 2 lands.
- **Cloud Run canary deploy runbook (`90_runbooks/cloud_run_canary_deploy.md`) Example 1 pattern works exactly as written for smartcity-os.** The runbook's `cloudbuild-api.yaml` and `Dockerfile.api` references match the actual repo build path. Reusable for future smartcity-api deploys, including Phase 2B.
- **Cloud Shell as the deploy environment.** Authed by default with the Google account; no SSL cert issue; native gcloud + native git. Trade-off: needs `git clone` of source for builds. Pattern: `git clone` once, `git pull` on subsequent sessions, run `gcloud builds submit --config cloudbuild-api.yaml` from the repo root. This pattern is the workaround until Nick box gcloud SSL is fixed.

## Outstanding from this session

- **Fire 4 / Stage 8** — Repl detach. Three subtasks: `b67c333` triage (push local-Repl branch to GitHub for inspection via Replit web shell), `[deployment]` + `[postMerge]` block neutralization PR against smartcity-os, workspace rename in Replit. Recommend next session's first dispatch.
- **Phase 1B prereqs** — `winget install PostgreSQL.PostgreSQL` on Nick box, generate Empressa Neon connection string for `legacy-design-tools-prod` (project ID `shiny-snow-37459644`), load into GCP Secret Manager. Independent of Fire 4 — can run in parallel.
- **Backlog items accumulated** (added to 11_roadmap.md as P3):
  - `// nosemgrep:` annotation on `server/routes/mygov.ts:269` (GCP metadata server false positive — clears CI noise)
  - `server/routes/ai-assistant.ts:4212` stale `"x-internal-ai": "1"` header (broken internal call, separate fix)
  - `server/app.ts:85` CORS allowlist removal of `x-internal-ai` (defense-in-depth follow-up post-Fire-1)
  - Auth middleware not in vitest safety net — c4c559d covers 5 surfaces, this isn't one (highest-value test gap)
  - Audit production Neon for MyGov raw-records growth pattern (independent of Repl dev-DB issue, may be silently growing on prod)
- **Fire 1 obs window** — Cloud Run error rate, Compass AI internal-call paths, Bastrop user-side breakage. Rollback command on standby for next ~2h: `gcloud run services update-traffic smartcity-api --to-revisions smartcity-api-00082-pog=100`.

## References

- 10_ground_truth.md — Fire 1 / Fire 2 / Fire 4 / Fire 5 sections, smartcity-os Repl section, `.replit` description, current Cloud Run revision
- 11_roadmap.md — P0 Fire 1 / P0 Fire 2 / P2 Fire 4 / P1 W1 entries, P3 backlog additions
- 12_migration_sprint.md — Phase 1A verified, Phase 1B/1C/2A/2B/2C scope (unchanged this session)
- 90_runbooks/cloud_run_canary_deploy.md — Example 1 (executed verbatim)
- 91_postmortems/2026-05-07_replit_dev_db_wedged.md (NEW THIS SESSION)
- 80_adrs/adr_002_replit_neon_migration.md — Decision sections (referenced)
- 80_adrs/adr_003_replit_neon_tactical.md — to be flipped to superseded after Phase 2C completes
- Replit support ticket VLR91Y-M3XRE (Zendesk, Apr 29 → May 7)
