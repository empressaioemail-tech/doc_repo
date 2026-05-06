---
id: 2026-05-05_smartcity-os_recon
title: SmartCity OS â multi-agent recon
date: 2026-05-05
agent: cursor-claude-code (primary), replit-agent (probe), gcloud-cli, dig+curl
repo: smartcity-os
session_type: recon
rolled_up: true
rolled_up_into: [10_ground_truth, 30_smartcity_os]
---

# SmartCity OS â multi-agent recon

Coordinated multi-agent reconnaissance to establish ground truth on
the SmartCity OS production state and repo state after the 2026-05-03
Cloud Run cutover. Findings synthesized into
[`10_ground_truth.md`](../10_ground_truth.md) (SmartCity OS section)
and used to correct planner-belief items per that doc's "Planner-belief
corrections" section.

## Scope

The Claude.ai planner directed a multi-agent recon to answer:

- What is on origin/main right now (HEAD, recent merges, backup tags)?
- What is the current production deployment state (Cloud Run service,
  revision, traffic split, image, custom domain routing)?
- What does the repo's current code, schema, and test surface look like?
- Are there active production risks to surface (auth, secrets, schema)?
- Is the SmartCity OS Repl in or out of the production traffic path?

## Sources consulted

**Cursor Claude Code (primary, working in `p:\smartcity-os`):**
- `git log --oneline origin/main -10`, `git fetch --tags`, `git tag --list`
- `git ls-tree origin/main` and `git show origin/main:<path>` for
  schema files, route handlers, middleware, app boot path
- `npm run typecheck`, `npm test -- --run`, `npm ci --dry-run`
- `grep -rn "x-internal-ai" server/` and `grep -rn "trust proxy" server/`
- File reads: `server/routes.ts`, `server/middleware/tenant.ts`,
  `server/app.ts`, `server/index-cloud.ts`, `server/routes/ai-assistant.ts`,
  `shared/schema.ts`, `shared/permitflow-schema.ts`, `drizzle.config.ts`,
  `migrations/`, `scripts/post-merge.sh`, `.replit`

**Replit Agent (probe, in the smartcityos.io Repl):**
- `git status`, `git log`, `git rev-parse HEAD`, `git log origin/main..main`
- `.replit` file inspection
- Production Neon query via `PROD_DATABASE_URL` Replit secret

**GCloud CLI (Cloud Shell):**
- `gcloud run services list`, `gcloud run revisions list`
- `gcloud secrets list`, `gcloud storage ls`
- `gcloud projects describe smartcity-os-prod`

**DNS + HTTP verification (local):**
- `dig smartcityos.io`, `dig api.smartcityos.io` (where applicable)
- `curl -I https://smartcityos.io/`

## Findings â repo state

- **Origin/main HEAD:** `a08d9bb` ("chore(deps): sync package-lock.json
  with package.json").
- **Recent merge sequence (most recent first):** `a08d9bb` â `602f0d8`
  (Prophecy nav) â `6a97220` (Cloud Run cutover commit) â `c4c559d`
  (vitest safety net) â `3016ae0` (release/2026-04-29 prophecy + focus
  metrics merge).
- **Backup tags on origin:** `backup/p0-6-cutover-pre-20260503-201715`
  at `6a97220`; `backup/p0-followup-prophecy-pre-20260503-235103` at
  `a08d9bb`.
- **Active branches:** `main`, `release/2026-04-29-prophecy-and-focus-metrics`,
  `backup/2026-04-29-replit-local-main`, `ci/dast-issues-write-permission`,
  `compass-ai-sprint`.
- **No commit, tag, or markdown reference to "stage 8", "replit detach",
  or "24h watch"** â Phase 0 Stage 8 closure has no codified evidence.
  Either skipped or done without a record.

**Test/lint/typecheck baseline:**
- typecheck: 422 errors (carried as known baseline; new errors only
  acceptable in PR-modified files)
- vitest: 18 passed / 18 total across 5 files
- lockfile: drift detected via `npm ci --dry-run` despite the recent
  `#5` sync PR (`bufferutil` missing in lockfile, `@emnapi/runtime`
  present in lockfile but not resolved)

## Findings â schema and migrations

- TS schema in `shared/schema.ts` (95 KB) plus
  `shared/permitflow-schema.ts` (19 KB).
- `drizzle.config.ts` reads `process.env.DATABASE_URL`.
- **NO journaled migrations folder** (`lib/db/drizzle/` absent).
- Hand-rolled SQL in `migrations/` with **prefix collisions** (two
  `0003_*` files, two `0004_*` files).
- Only `db:push` npm script â no `migrate`, no `generate`.
- `scripts/post-merge.sh` is hooked via `.replit` `[postMerge]` (not
  git/husky). Uses idempotent `CREATE â¦ IF NOT EXISTS` DDL with
  `[ -n "$DATABASE_URL" ]` guard, exits 0 on error. Does NOT call
  `drizzle-kit push --force`. Safer than the legacy-design-tools
  equivalent.

## Findings â auth and middleware

The auth bypass at `server/routes.ts:83` is verbatim:

```typescript
if (req.headers['x-internal-ai'] === 'smartcity-ctx') return next();
```

No loopback gate. Trivially exploitable from external clients. Compare
`server/middleware/tenant.ts:55-62` which gates the same header on
loopback (but only for setting `tenantId`, not for auth).

Sites using `x-internal-ai`:

```
server/app.ts:85                     CORS allowedHeaders
server/middleware/tenant.ts:59       loopback-gated tenantId set
server/routes.ts:83                  UNGUARDED auth bypass â the bug
server/routes/ai-assistant.ts:395    sender, "smartcity-ctx"
server/routes/ai-assistant.ts:4212   sender, "1" â STALE, no gate match
server/routes/calendar.ts:18         loopback-gated
server/routes/mygov.ts:5974          sender
server/routes/overview.ts:1134       sender
server/routes/reports.ts:130         sender
server/routes/reports.ts:658         sender
```

`app.set('trust proxy', ...)` is set in
`server/replit_integrations/auth/{googleAuth.ts:114, replitAuth.ts:65}`.
Whether either path executes in the cloud-run boot binary
(`server/index-cloud.ts`) is **not yet traced** â relevant to how
`req.ip` resolves under Cloud Run's GFE. Open question.

**Compass system prompt** lives at
`server/routes/ai-assistant.ts:1005` (marker `// COMPASS SYSTEM PROMPT
â edit here for prompt changes`). Earlier planner memory said line
905 â corrected.

## Findings â local build vs deployed bundle

- Locally-built bundle: `index-BsfNEJYB.js`.
- Earlier planner memory referenced `index-BI7HSHku.js` â at minimum
  stale; corrected.

## Appendix A â Replit Agent probe (Repl drift state)

Findings:

- **Repl HEAD:** `5ca51cd`. Local main is **10 commits ahead of
  origin/main, 0 behind**. None of the 10 commits have been pushed.
- Among the 10: nine are Replit auto-checkpoints (`Saved your
  changesâ¦`, `Saved progressâ¦`, screenshot uploads, troubleshooting
  docs). One (`b67c333`, "Fix issue preventing users from publishing
  updates") may be a real fix that needs preservation.
- **Repl's view of `origin/main` is at `3016ae0`** â 4 commits behind
  GitHub's actual HEAD (`a08d9bb`). Either the most recent fetch was
  a no-op or the ref pointer didn't update during the recent fetch
  attempt. Replit Agent reliability for git-state introspection is
  limited (one probe hit a fetch lock, the other had partial git
  output).
- `.replit` still declares `[deployment]` block (`deploymentTarget =
  "autoscale"`, `build = ["npm", "run", "build"]`, `run = ["node",
  "dist/index.mjs"]`). The Repl is still capable of being
  autoscale-deployed if anyone clicks Redeploy.
- Repl runtime `DATABASE_URL` resolves to `helium` (Replit-managed
  local Postgres `heliumdb`), NOT to Neon. The Neon prod connection
  is exposed via `PROD_DATABASE_URL` Replit secret.
- `VITE_API_URL` in `.replit` `[userenv.shared]`:
  `https://smartcity-api-494195107606.us-central1.run.app` (Cloud Run,
  project-number-style URL).
- `.replit` `[userenv.shared]` contains plaintext production secrets
  committed to git â verbatim list of compromised values is in
  [`10_ground_truth.md`](../10_ground_truth.md) Fire 2.

Production Neon schema state on prod Neon (queried via
`PROD_DATABASE_URL`):

- 106 public tables â Bastrop municipal data
- `engagements` and `code_atoms` tables do NOT exist on this DB; those
  live on legacy-design-tools' Neon

## Appendix B â GCloud asset listing (Cloud Shell)

- **Project:** `smartcity-os-prod`
- **Project number:** `494195107606`
- **Default region:** `us-central1`

**Cloud Run services:**
- `smartcity-api`. Latest revision `smartcity-api-00082-pog` at 100%
  traffic, tag `p0-followup-prophecy`. Revision `smartcity-api-00080-men`
  at 0% traffic, tag `p0-3-canary` (leftover canary). Image
  `us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest`.
  Service URL `https://smartcity-api-7dyaiy7wha-uc.a.run.app`.
- `smartcity-scraper`. Revisions through `00037-zfm` plus a
  `wo-chunking` revision. Cron-driven MyGov scraping role.

**Secrets in Secret Manager (23 entries):**
- Production: `smartcity-DATABASE_URL` (v1+v2), `smartcity-ANTHROPIC_API_KEY`
  (v1+v2+v3), `smartcity-POWERBI_*`, `smartcity-SAMSARA_*`,
  `smartcity-MYGOV_*`, `smartcity-OPENGOV_*`, `smartcity-GOTO_*`,
  `smartcity-FIRSTDUE_*`, `smartcity-VFD_*`,
  `smartcity-CREDENTIAL_ENCRYPTION_KEY`, `smartcity-SESSION_SECRET`
- Staging: `smartcity-staging-DATABASE_URL` and several other
  `smartcity-staging-*` entries

The `smartcity-staging-*` set implies a staging environment exists;
whether it currently runs is unconfirmed (open question).

**Storage buckets:**
- `run-sources-smartcity-os-prod-us-central1` (Cloud Build sources)
- `smartcity-os-prod_cloudbuild` (Cloud Build artifacts)

## Appendix C â DNS + HTTP verification

- `dig smartcityos.io` â `216.239.32.0/24` (Google anycast)
- Custom domain routes to Cloud Run via domain mapping
- `curl -I https://smartcityos.io/` headers consistent with Cloud Run
  serving; `last-modified: 2026-05-03 23:24:48 UTC` (matches
  post-cutover Prophecy follow-up)

Conclusion: `smartcityos.io` traffic path runs through Cloud Run, NOT
Replit. Earlier planner memory said "live on Replit" â corrected.

## Where the findings landed

- Planner-belief corrections (Cloud Run vs Replit, Stage 8 status, DB
  region, atom counts, Compass prompt line, bundle name, lockfile
  drift) â [`10_ground_truth.md`](../10_ground_truth.md) Planner-belief
  corrections section
- Active fires (auth bypass, plaintext secrets, Repl drift,
  cross-region hop) â [`10_ground_truth.md`](../10_ground_truth.md)
  Active fires section, ranked
- Production state (Cloud Run revision, traffic split, image, secrets,
  scraper service) â [`10_ground_truth.md`](../10_ground_truth.md)
  SmartCity OS Production subsection
- Repo state (HEAD, branches, tests, schema, post-merge.sh) â
  [`10_ground_truth.md`](../10_ground_truth.md) SmartCity OS Repository
  subsection
- Repl-orphan state â [`10_ground_truth.md`](../10_ground_truth.md)
  SmartCity OS Replit Repl subsection

## Open questions surfaced (not closed in this recon)

- Does `app.set('trust proxy', ...)` actually execute in the
  cloud-run boot path (`server/index-cloud.ts`)?
- Is the `smartcity-staging-*` Secret Manager set backing an actual
  running staging environment?
- Does the unpushed Repl commit `b67c333` ("Fix issue preventing
  users from publishing updates") need preservation, or is it a
  no-op auto-checkpoint?
