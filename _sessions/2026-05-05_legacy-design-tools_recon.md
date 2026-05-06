---
id: 2026-05-05_legacy-design-tools_recon
title: legacy-design-tools â multi-agent recon
date: 2026-05-05
agent: cursor-claude-code (primary), replit-agent (probe)
repo: legacy-design-tools
session_type: recon
rolled_up: true
rolled_up_into: [10_ground_truth, 40_design_accelerator]
---

# legacy-design-tools â multi-agent recon

Coordinated multi-agent reconnaissance to establish ground truth on
the Design Accelerator monorepo state in the wake of the 2026-05-04
Track B deploy saga and the 2026-05-04 production unlock work.
Findings synthesized into [`10_ground_truth.md`](../10_ground_truth.md)
(Design Accelerator section) and used to correct planner-belief
items per that doc.

## Scope

- What is on origin/main right now (HEAD, recent merges)?
- Did the Track B saga fixes actually land on origin?
- Did the A04.7 engagement-identity fix actually merge?
- What does the test/lint/typecheck baseline look like?
- What is the schema management story (TS, journaled migrations,
  hand-rolled SQL)?
- What is the atom registry state (domain atoms + code atoms)?
- Is `post-merge.sh` running `drizzle-kit push --force` against prod
  Neon without a guard? (Fire 3 verification.)

## Sources consulted

**Cursor Claude Code (primary, working in `p:\legacy-design-tools`):**
- `git log --oneline origin/main -10`, `git fetch --tags`, `git diff
  origin/main..main`
- `git ls-tree origin/main` and `git show origin/main:<path>` for
  schema files, atom registry, route handlers, vite configs
- `pnpm install --frozen-lockfile`, `pnpm run typecheck`, `pnpm test`
- File reads: `scripts/post-merge.sh`, all four
  `artifacts/*/vite.config.ts`, `.replit`,
  `lib/db/src/schema/index.ts`, `artifacts/api-server/src/atoms/registry.ts`,
  `artifacts/api-server/src/routes/snapshots.ts`,
  `lib/db/src/seed.ts`, `drizzle.config.ts`
- DB query via local `DATABASE_URL` (helium dev DB)

**Replit Agent (probe, in the Design Accelerator Repl):**
- `git status`, `git log`, `git rev-parse HEAD`
- Local `DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` resolution
- `.replit` file inspection (focus on `[postMerge]` block)

## Findings â repo state

- **Origin/main HEAD:** `99a6a022` ("fix(api-server): resolve web-ifc
  wasm dir via entry point").
- Working tree clean modulo `.generated` artifact and untracked
  agent-tool directories.
- **Recent merge sequence (most recent first):**
  - `99a6a02` â web-ifc wasm dir fix (post-saga)
  - `db0cccd` â vite.config.ts PORT/BASE_PATH patches (Track B saga
    fix)
  - `b1d7cf4` â explicit `[deployment.build]` step in `.replit`
    (Track B saga fix)
  - `cc034c9`, `25e0b0e` â Track B server IFC ingest (PRs #16, #15)
  - `1ca2e8f` (2026-04-29) â A04.7 engagement-identity fix

## Findings â Track B saga aftermath verified on origin

- All four `vite.config.ts` files (`design-tools`, `plan-review`,
  `qa`, `mockup-sandbox`) use the `resolvePort(command)` helper that
  throws on serve-only â confirming the saga fix landed.
- `.replit` `[deployment.build]` block is in place per `b1d7cf4`.
- Track B route `POST /api/snapshots/:id/ifc` is live at
  `artifacts/api-server/src/routes/snapshots.ts:989`.

## Findings â A04.7 engagement-identity fix verified

Commit `1ca2e8f` (2026-04-29) on origin/main:

- Adds `revit_central_guid` and `revit_document_path` columns to
  `engagements`
- Drops UNIQUE on `name_lower` (was the dedup-by-name footgun)
- Adds `POST /api/engagements/match` endpoint that resolves snapshot
  intent with **GUID > path > name** precedence
- Server is now source of truth for engagement names post-A04.7

Mirror commit on legacy-revit-sensor at `3499037` (covered in the
revit-sensor session summary).

## Findings â test / lint / typecheck baseline

- typecheck: **0 errors** across all artifacts and scripts
- tests: failures are environment-driven (no local Postgres or no
  `TEST_DATABASE_URL` set) â all sampled failures trace to
  `ECONNREFUSED ::1:5432` or "TEST_DATABASE_URL must be set"
- lockfile: in sync (`pnpm install --frozen-lockfile` clean)

## Findings â schema management

- Schema source of truth: 39 files in `lib/db/src/schema/`. Drizzle
  config points at `lib/db/src/schema/index.ts`.
- Journaled migrations in `lib/db/drizzle/` (9 files, `0000`-`0008`)
  â these are RECORDS, not auto-applied; `drizzle-kit push` doesn't
  consume them.
- Drift detection via `lib/db/src/__tests__/__fixtures__/schema.sql.template`
  + `pg_dump` diffs in `check-fixture-drift.sh`.

## Findings â `post-merge.sh` (Fire 3 verification)

`scripts/post-merge.sh` runs:
1. `pnpm install --frozen-lockfile`
2. `pnpm --filter @workspace/db run push-force`
3. Two backfill scripts

**`push-force` invokes `drizzle-kit push --force --config ./drizzle.config.ts`,
bypassing interactive confirmation.**

**No `DATABASE_URL` target guard observed in the on-disk script.**
Behavior depends on what `DATABASE_URL` resolves to in the
`[postMerge]` runtime context. Replit Agent reported a "Task #526
(Neon guard) is now MERGED" claim earlier, but the on-disk script does
NOT show a guard. Verification on GitHub web UI explicitly required â
recon did not have authenticated `gh` access.

## Findings â atom registry

**Domain atom registry:** 19 atoms in
`artifacts/api-server/src/atoms/registry.ts:162-230`:

sheet, engagement, snapshot, submission, intent, briefing-source,
parcel-briefing, neighboring-context, materializable-element,
briefing-divergence, bim-model, reviewer-annotation, reviewer-request,
viewpoint-render, render-output, finding, communication-event,
decision-event, submission-classification.

**Code atoms (legal corpus, separate concept from domain atoms):**
**479** on helium dev DB. Breakdown:
- Grand County Land Use: 215
- Bastrop Muni Code: 189
- Grand County IWUIC: 61
- Grand County IRC R301.2.1: 14

Production Neon count not directly probed in this recon (probe used
local `DATABASE_URL` = helium, not `DEPLOYMENT_DATABASE_URL` = Neon).

Earlier planner memory had "264 atoms" â that was a stale UI-audit
snapshot; the actual current count is 479.

## Findings â seed data (active test engagements partial verification)

`lib/db/src/seed.ts` confirms presence of:
- Seguin Residence
- Musgrave Residence (correct spelling â "Muskgrave" in earlier
  memory was a typo)

Earlier-memory references to additional engagements (Alexander 404
Miami, Balsley, Dart Frog) do NOT appear in seed source. They may
exist as live-DB-only entries; needs `SELECT` against deployment
Neon to verify. Open question.

## Findings â sprint vocabulary correction

- Earlier planner memory used "A01-A06" sprint taxonomy.
- Repo actually uses: `DA-PI-*`, `V1-*`, `Sprint A-D`, `AIR-*`,
  `PLR-*`. Only `A04.7` matches across both vocabularies.
- Repo vocabulary is canonical; planner memory updated.

## Appendix A â Replit Agent probe (Repl drift state)

Findings:

- **Repl HEAD:** `3784660` â diverges from origin/main `99a6a022`.
  Direction (ahead/behind/forked) unverified due to a stale `git
  fetch` lock during the recent probe.
- Same drift pattern as the SmartCity OS Repl, smaller commit count.
- `DATABASE_URL` â helium (`heliumdb`, PG 16.10) at runtime.
- `DEPLOYMENT_DATABASE_URL` â Neon prod
  (`ep-little-base-amyyxjca.c-5.us-east-1.aws.neon.tech`).
- The `[postMerge]` hook has no `[postMerge.env]` override. Its
  runtime `DATABASE_URL` resolves by Replit's deploy-context
  conventions â not determinable from on-disk config alone. This is
  the open question that makes Fire 3 still active.

## Where the findings landed

- Planner-belief corrections (atom count 479 not 264, sprint
  vocabulary, engagement spelling, regional Neon endpoint) â
  [`10_ground_truth.md`](../10_ground_truth.md) Planner-belief
  corrections section
- Active fires (post-merge.sh push-force without verified guard) â
  [`10_ground_truth.md`](../10_ground_truth.md) Active fires section
  (Fire 3)
- Repo state (HEAD, recent merges, Track B saga aftermath, A04.7
  verification, schema management) â
  [`10_ground_truth.md`](../10_ground_truth.md) Design Accelerator
  Repository subsection
- Atom registry findings (19 domain atoms, 479 code atoms) â
  [`40_design_accelerator.md`](../40_design_accelerator.md)
  Architecture section

## Open questions surfaced (not closed in this recon)

- Production code-atom count and breakdown on deployment Neon
  (helium has 479; prod count needs SELECT)
- Production active engagements list on deployment Neon (Alexander
  404 Miami, Balsley, Dart Frog presence)
- Is Track B's `snapshot_ifc_files` schema actually applied to
  deployment Neon? (probe used helium, not Neon)
- Does `[postMerge]` hook resolve `DATABASE_URL` to helium or Neon
  at runtime? Pivotal for Fire 3 closure
- `post-merge.sh` Neon-guard verification on GitHub web UI (Replit
  Agent claim vs on-disk script)
