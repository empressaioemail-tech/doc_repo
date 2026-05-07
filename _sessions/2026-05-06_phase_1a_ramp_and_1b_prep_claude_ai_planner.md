---
id: 2026-05-06_phase_1a_ramp_and_1b_prep_claude_ai_planner
title: Phase 1A traffic ramp closed + Phase 1B prereqs landed (partial)
date: 2026-05-06
agent: claude-ai-planner
repo: doc_repo
session_type: sprint_execution
status: active
rolled_up: true
rolled_up_into: [12_migration_sprint, 11_roadmap, cloud_run_canary_deploy]
---

# Phase 1A traffic ramp closed + Phase 1B prereqs landed (partial)

Continuation of `_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md`. Two parallel tracks queued at session start:
- **Track A (executed):** Phase 1A traffic ramp from verified canary to 100% production
- **Track B (deferred):** Phase 1B Stage 1 schema-only sync from Replit Neon to Empressa Neon

Track A closed cleanly. Track B unblocked-not-yet-executed (Empressa Neon project provisioned; workstation Postgres client + `EMPRESSA_DATABASE_URL` secret pending before Stage 1 dispatch can fire).

## TL;DR

- **Phase 1A traffic at 100% to `api-server-00003-wix`** via canary tag, both bare service URL and canary URL routing to the same revision. Backup tag `backup/post-1A-100traffic-api-server-00003-wix` landed on `legacy-design-tools` origin at source SHA `e4b15c1`.
- **Empressa Neon project provisioned** under empressaioemail@gmail.com on Empressa-org Scale tier. Project ID `shiny-snow-37459644`, branch `production`, autoscale 0.25 → 8 CU.
- **Track B blocked on workstation prep** — `psql`/`pg_dump` not installed; `EMPRESSA_DATABASE_URL` secret not yet loaded into Secret Manager. Consolidated dispatch prompt remains valid; re-fire after install + secret load.
- **Operational learnings on Cloud Run first-deploy traffic semantics** that contradict the canary runbook's "0%-traffic canary then ramp" framing — runbook updated this session with first-deploy callout.
- **Verified deployed source SHA via Artifact Registry image-tag lookup** after a SHA-conflation error in the dispatch prompt — verification pattern codified into the runbook this session.

## Inputs

- Handoff from `_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md` — Outstanding queue picked up
- doc_repo orientation report from courier agent (full `12_migration_sprint.md`, `11_roadmap.md`, `90_runbooks/cloud_run_canary_deploy.md`, ADR-001, runbook + ADR indices, recent session summaries, apparent-inconsistencies flag list)
- Cursor Claude Code agent recon report on api-server DB-touching GET endpoints
- Cursor Claude Code agent execution reports across Track A stages (auth handshake → A0 recon → A2 production probe → A3 git tag → A4 observation handoff)
- Nick browser-side actions: `gcloud auth login` as empressaioemail@gmail.com, Neon project provisioning + Empressa-org Scale-tier setup
- Two screenshots: Neon "Get started with Neon + AI" modal (`npx neonctl init` wizard), Neon project dashboard for `shiny-snow-37459644`

## Outputs

### Operational state changes

- **Cloud Run service `api-server` in `legacy-design-tools-prod`** — single traffic entry: `{percent: 100, latestRevision: true, revisionName: api-server-00003-wix, tag: canary}`. Both `https://canary---api-server-tds7av26va-uc.a.run.app` and `https://api-server-tds7av26va-uc.a.run.app` serve the same revision identically.
- **Source-SHA backup tag on `legacy-design-tools` origin:** `backup/post-1A-100traffic-api-server-00003-wix` → `e4b15c1ee3995cce1877d536ae5cb6ac2713a59a` (PR #24 SNAPSHOT_SECRET mount, the commit that built the deployed image per Artifact Registry digest-to-source mapping).
- **Empressa Neon resources:**
  - Org: `Empressa` on Scale tier
  - Project: `legacy-design-tools-prod` (Neon project ID `shiny-snow-37459644`)
  - Branch: `production` (default)
  - Compute: autoscale 0.25 → 8 CU, primary active
  - Account: `empressaioemail@gmail.com`
- **gcloud workstation auth:** Active account on Nick's box switched from `smartcity-agent@smartcity-os-prod.iam.gserviceaccount.com` (service account) to `empressaioemail@gmail.com` (user account). Default project set to `legacy-design-tools-prod`, region `us-central1`.

### Doc repo additions

- This session summary

### Canonical doc updates landed in this session-close commit

- **`12_migration_sprint.md`** — Phase 1A row Notes column flipped from "Traffic ramp pending" to current state; Phase 1B row Notes column populated with Empressa Neon provisioning state; cross-cutting prereqs flipped for the Empressa Neon account; status tracking entry added; `last_updated` bumped.
- **`11_roadmap.md`** — P1 Phase 1 progress annotation extended with PM-session state; `last_updated` bumped.
- **`90_runbooks/cloud_run_canary_deploy.md`** — first-deploy callout added (auto-100%-to-LATEST behavior); "Verifying deployed source SHA via Artifact Registry" section added; `last_updated` bumped.
- **`_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md`** — `rolled_up_into:` paths corrected to bare doc IDs; References section truncation completed.

## Decisions made in session

- **Path 3 (parallel Track A + Track B) chosen** at session start. Track A executed; Track B blocked on workstation prep.
- **Account ownership on Neon: empressaioemail@gmail.com.** Same email as the GitHub org `empressaioemail-tech`. Canonical for the Empressa portfolio.
- **Tier on Neon: Scale (Empressa org).** Nick picked "highest tier"; Scale is premium but amortizes across the portfolio when SmartCity OS migrates in Phase 2. No downshift recommended; flagged for awareness.
- **Vault for connection strings: GCP Secret Manager.** Consistent with Phase 1A `DEPLOYMENT_DATABASE_URL` pattern. Defers the broader credentials-vault decision (1Password etc.) which remains a separate cross-cutting prereq.
- **Skip Neon AI features (`neonctl init` wizard, Neon MCP server).** Neither is load-bearing for the migration. MCP could be useful later for agent-driven branch management; defer to a separate small task.
- **Skip Stage A1 (`update-traffic --to-tags canary=100`).** Cloud Run first-deploy semantics meant canary was already at 100%; the command would have been a no-op. Stage A0 describe output is the canonical state record.
- **Tag source SHA `e4b15c1`, not `fdae4e0`.** Planner mistake in the dispatch prompt: hardcoded the doc_repo HEAD instead of the legacy-design-tools deployed source SHA. Agent caught it via Artifact Registry image-digest-to-source mapping.

## Lessons / patterns established

- **Cloud Run first-deploy traffic semantics differ from service-update semantics.** `--no-traffic --tag=canary` on first deploy auto-routes 100% to LATEST with the tag, not 0% with the canary URL only. The runbook's "0%-then-ramp" pattern doesn't apply on first deploy. Codified into the runbook this session.
- **Don't hardcode SHAs in dispatch prompts.** Hardcoded SHAs go stale or get conflated across repos (planner conflated doc_repo HEAD with legacy-design-tools deployed SHA). Right pattern: have the agent verify the deployed source SHA at execution time via Artifact Registry image-digest-to-source-tag lookup. Codified into the runbook this session.
- **Runbook field-shape expectations should come from real response inspection.** Recon agent extracted the inner array variable name `suiteSummaries` but missed the `{suites: ...}` response wrapping. Probe-shape assumptions in dispatch prompts need to be verified against actual JSON output, not handler-internal naming.
- **`/api/healthz` is static — does not touch the DB pool.** Static healthz endpoints are not useful as canary smoke probes. Phase 1B-and-beyond canaries should use DB-touching probes (`/api/qa/suites`, `/api/qa/autopilot`) to verify pool reachability. Worth a `docs/deploy.md` callout in `legacy-design-tools` (separate PR, future task).
- **Routes layout in `legacy-design-tools` is `artifacts/api-server/src/routes/`** (pnpm workspace `artifacts/*` pattern), not `apps/api-server/src/routes/`. Prior dispatches assumed the wrong path; future dispatches should use the correct one.
- **gcloud workstation account confusion is operational debt with a real fix.** Nick's box defaults to a service account scoped to a different project; switching for cross-project work is annoying-but-necessary. Solution: gcloud configurations (one per `{user, project}` pair). Hand off to a separate workstation-hygiene task.
- **Agent halt-and-flag on prompt bugs is correct behavior.** Multiple agent flags this session (auth-on-wrong-account refusal, `fdae4e0` SHA conflation catch, qa/suites shape drift, canary-already-100% finding) were all real and required planner-side correction. Pattern: agents catching prompt bugs should be normal, not exceptional.

## Outstanding from this session (handed forward)

### Track B / Phase 1B Stage 1 unblock — three small blockers
- Install Postgres client on Nick's workstation: `winget install PostgreSQL.PostgreSQL`
- Optional: install jq: `winget install jqlang.jq` (node -e fallback already proven to work)
- Capture Empressa Neon `production` branch connection string from Neon console → load into Secret Manager:
  `echo -n "<paste>" | gcloud secrets create EMPRESSA_DATABASE_URL --data-file=- --replication-policy=automatic --project=legacy-design-tools-prod`
- Then re-fire the consolidated dispatch prompt. Stage 0 will pass cleanly; Track A skips (already complete); Track B executes B0 → B1 → pause → B2 → pause → B3.

### Phase 1A 1-hour observation window
Started after Stage A4. Nick to monitor with the printed probe commands. Investigate if `suites.length` drifts off 5, latency creeps significantly, or 5xx/panics/DB-pool errors appear in `gcloud run services logs read api-server --limit 50 --region us-central1`.

### gcloud configurations refactor (workstation hygiene)
Set up two gcloud configurations on Nick's box: `smartcity` (SA + smartcity-os-prod) and `empressa` (user + legacy-design-tools-prod). Switch with `gcloud config configurations activate <name>`. Eliminates the SA-confusion footgun. Small task.

### `docs/deploy.md` update in legacy-design-tools (not doc_repo)
Note that `/api/healthz` is static (does not touch DB pool); recommend DB-touching probes for canary smoke. Future PR to `legacy-design-tools`.

### Items inherited from prior Phase 1A complete session, still open
Phase 1B Stage 1 (this session unblocked-not-executed); Phase 1C cutover; Phase 2 (SmartCity OS Empressa Neon swap, closes Fire 5); Phase 3 (Drizzle migrate adoption); frontend hosting decision; Fire 3 (`post-merge.sh` Neon-guard browser verification); SESSION_SECRET cleanup; conditional validator footgun docs callout; Revit Connector ↔ `BIM_MODEL_SHARED_SECRET` sync; Puppeteer service split; GCS bucket data sync; schema drift sweep; `snapshot-auto-briefing.test.ts` flake; `pr-checks.yml` puppeteer install step; gcloud account-switch documentation (subsumed by configurations refactor above).

## Side captures for future sprint scoping

No new side captures this session. The customer-zero observations and mnml integration upgrade items from the prior Phase 1A complete summary remain unchanged and queued.

## References

- `_sessions/2026-05-06_phase_1a_complete_claude_ai_planner.md` — predecessor session, Phase 1A canary verification through 100% via single-day execution
- `12_migration_sprint.md` — Phase 1A row notes flipped, Sub-phase 1B notes added, status tracking entry, prereq flip, `last_updated` bump
- `11_roadmap.md` — P1 Phase 1 progress annotation extended
- `90_runbooks/cloud_run_canary_deploy.md` — first-deploy callout + Artifact Registry source-SHA verification pattern added (substantive runbook update)
- ADR-001 atom-graph contract — load-bearing portfolio-wide; no edits this session
- `20_agent_operating_rules.md` — HR-7 (no three-failure rule), HR-8 (verbatim verification artifacts), SR-3 (recon-only first when ambiguous), and PC-1 (drop to manual verification when contradiction surfaces) all earned their place this session; no edits
