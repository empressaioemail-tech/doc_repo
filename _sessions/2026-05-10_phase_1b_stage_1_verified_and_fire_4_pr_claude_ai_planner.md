---
id: 2026-05-10_phase_1b_stage_1_verified_and_fire_4_pr_claude_ai_planner
title: Phase 1B Stage 1 verified + Fire 4 PR merged + neon migration runbook
date: 2026-05-10
agent: claude-ai-planner
repo: doc_repo
session_type: sprint_execution
status: active
rolled_up: true
rolled_up_into: [10_ground_truth, 11_roadmap, 12_migration_sprint, 90_runbooks/neon_schema_migration_via_cloud_shell]
---

# Phase 1B Stage 1 verified + Fire 4 PR merged + neon migration runbook

PM session same day as `2026-05-10_fire_1_closed_and_bar_c_kickoff_claude_ai_planner.md`. Picks up from that session's handoff.

## Inputs

- Handoff doc from prior 2026-05-10 AM session
- Orientation report from doc_repo courier (full read of last session summary, postmortem, ground truth, roadmap, migration sprint, risk register, agent operating rules)
- Cloud Shell sessions for Phase 1B prereqs and Stage 1 execution
- Cursor agent recon + execution for Fire 4 PR (in P:\smartcity-os)

## Outputs

### Fire 4 PR opened, merged squashed

- Cursor agent dispatch on `P:\smartcity-os` opened PR #7: `chore(repl): neutralize .replit + scripts/post-merge.sh with loud-fail (Fire 4)`
- `.replit` `[deployment]` block: `build` and `run` replaced with `sh -c "echo 'retired...' && exit 1"` loud-fail variant (per postmortem operational close-out)
- `.replit` `[postMerge]` block: shape preserved (`path` + `timeoutMs`) since Replit's schema doesn't accept `run = [...]`; TOML comment block above explains retirement
- `scripts/post-merge.sh`: 13-line loud-fail header inserted after shebang; original 200 lines preserved below `=== ORIGINAL CONTENT BELOW ===` delimiter for Phase 3 Drizzle migrate adoption + P3 prod Neon MyGov growth audit reference
- Cursor agent recon caught 3 divergences from prompt assumptions: branch was `main` not `local-main` (postmortem text was aspirational), `[postMerge]` shape was `path`/`timeoutMs` not `run = [...]`, untracked scratch `.md` files in working tree
- PR #7 squash-merged by Nick from GitHub web UI
- Workspace rename to `SmartCityOSMain-retired-20260510` pending Nick UI action — Fire 4 fully closes after rename

### Phase 1B prereqs closed

- `psql 18.3` + `pg_dump 18.3` (EnterpriseDB build 18.3-3) installed on Nick box at `C:\Program Files\PostgreSQL\18\bin\` via `winget install PostgreSQL.PostgreSQL.18 --source winget`. PATH update on user PATH.
- Empressa Neon connection string generated for `legacy-design-tools-prod` (project ID `shiny-snow-37459644`, branch `production`, pooled endpoint, length 146 chars)
- `EMPRESSA_DATABASE_URL` secret v1 created on `legacy-design-tools-prod` GCP project (labels: `phase=1b`, `app=legacy-design-tools`, `source=empressa-neon`)
- Connectivity verified: `SELECT version()` → PostgreSQL 17.8 on Empressa Neon

### Phase 1B Stage 1 verified

- Source: `ep-little-base-amyyxjca.c-5.us-east-1.aws.neon.tech` (Replit-managed, PG 16.12, 192 MB)
- Target: `ep-dry-queen-aq0yxp05-pooler.c-8.us-east-1.aws.neon.tech` (Empressa-owned, PG 17.8, was empty)
- Source recon revealed 6 schemas: `public` (36 tables — production), `_system` (1 table = `replit_database_migrations_v1` — Replit-managed migration tracking), and 4 `test_<unix_timestamp>_<8hex>` schemas (each mirroring public minus 1 table; integration test isolation artifacts created 2026-05-03 ~13:55–14:05 UTC)
- Schema-only `pg_dump --no-owner --no-acl -N 'test_*' -N '_system'` → 1800-line / 57009-byte schema.sql
- Restore via `psql -v ON_ERROR_STOP=1 -f schema.sql` to target — exit 0, stderr empty
- Full parity verified: 36 tables, 419 columns, 98 indexes, 104 constraints (36 PK + 37 FK + 5 unique + 26 check), plpgsql 1.0 + vector 0.8.0 extensions
- Sample `\d` inspections confirmed structural integrity on `atom_events` (chain_hash uniqueness for atom-graph contract per ADR-001), `users` (disciplines CHECK allowlist), `submissions` (7 reverse-FK references from dependent tables)

## Decisions

- **Cloud Shell as the migration work environment** — gcloud SSL on Nick box still broken (Fire 1 deploy used Cloud Shell as workaround; same pattern applies for all Phase 1B/1C/2 GCP work). Cloud Shell auth is automatic, Secret Manager access is one command, connection strings stay in env vars, psql/pg_dump preinstalled. Pattern: explicit `gcloud config set project` at top of every block (sessions don't persist project state).
- **Excluded `test_*` schemas from Phase 1B Stage 1 dump** — 4 timestamped schemas mirroring public are integration test artifacts, not production. They'll re-create themselves on next test run. Migrating cruft to a fresh Empressa Neon project would mirror ~140 redundant table definitions.
- **Excluded `_system` schema from Phase 1B Stage 1 dump** — discovered after first dump showed `_system.replit_database_migrations_v1` in the table list. That's Replit-platform bookkeeping, not application-managed. Carrying it forward to an Empressa-owned Neon would be vestigial cruft and contradicts ADR-002's whole thesis (decouple from Replit-platform-coupled artifacts).
- **`[postMerge]` shape preserved over `run = [...]` rewrite** — Replit's TOML schema for `[postMerge]` accepts `path` + `timeoutMs`, not the `run = [...]` inline array form used in `[deployment]`. Rewriting to `run = [...]` risked a parse error (silent wrong behavior) rather than the loud-fail we want. Resolution: keep block shape, neutralize the script it points at; add a TOML comment block above explaining the retirement so anyone reading `.replit` linearly sees the notice.
- **`scripts/post-merge.sh` loud-fail with original-preserved-below pattern** — 13-line header (retirement notice + early `exit 1`) inserted after shebang; original 200 lines preserved verbatim below `=== ORIGINAL CONTENT BELOW ===` delimiter. Rationale: future Phase 3 Drizzle migrate adoption may want to port the migration logic; P3 prod Neon MyGov growth audit may want to inspect the same sync logic. Git history is fine but inline preservation is friendlier; `exit 1` guarantees nothing below the delimiter executes.
- **Phase 2 added prereqs folded into 12_migration_sprint.md** — previous courier flagged that the post-merge.sh Neon guard / migration prefix collision / gcloud SSL fix items lived only in 11_roadmap.md P3 and the prior session summary's Bar C sequence, not in the migration sprint doc. Folded in this session-close as a "Phase 2 added prereqs" sub-section under cross-cutting prereqs.
- **Captured Cloud Shell + Secret Manager + Neon migration pattern as runbook** at `90_runbooks/neon_schema_migration_via_cloud_shell.md`. Phase 2A (smartcity-os) reuses with documented adaptations (tenant_id integrity, us-central1 region, larger schema, prefix collision prereq, neutralized post-merge.sh).

## Lessons / patterns

- **Recon stage continues to earn its keep.** Cursor agent's Stage 1 recon caught the `local-main` vs `main` branch name (postmortem text was aspirational), the `[postMerge]` schema mismatch (would have failed differently), and the `_system` schema being Replit-managed. None of these would have surfaced from the orientation alone — the recon is where ground truth refines plan.
- **Cloud Shell sessions don't persist project state.** Every Cloud Shell block needs `gcloud config set project <project>` at the top, even if a previous session set it. Cost of forgetting: cascading NOT_FOUND errors that look like auth issues but are actually wrong-project errors.
- **psql pager triggers on multi-row results.** Cloud Shell's default PAGER is `less`; multi-row recon queries get truncated with `(END)` prompt. Mitigation: `export PSQL_PAGER=cat` at top of session + `-P pager=off` on every psql invocation.
- **Cross-version dump 16→17 is fine.** pg_dump 16.13 client reading PG 16.12 source and producing SQL restored on PG 17.8 target needed zero special flags; this is the supported direction.
- **Test schema isolation pattern observed.** Production-shared Neon serving as both production and integration test target is a footgun shape similar to MyGov raw-records on Replit dev DB (root cause of 2026-05-07 wedge). Tests writing to schema-per-test against the production connection means schema count grows unbounded with test runs. New P3 backlog item raised.

## Outstanding from this session

- **Replit workspace rename** — Fire 4 fully closes after `SmartCityOSMain` → `SmartCityOSMain-retired-20260510` UI action (not yet done at session-close)
- **Phase 1B Stage 2 / Phase 1C scheduling** — data sync + cutover + 24h obs is its own session, needs low-traffic window
- **Phase 2A prereqs** — folded into 12_migration_sprint.md this session-close; pickup at next session
- **Fire 2** — still held for Bastrop IT engagement; no progress this session
- **Fire 1 obs window** — closed clean; revision `00082-pog` still in pool at 0% (fine to delete via `gcloud run revisions delete` whenever)
- **gcloud SSL on Nick box** — still broken; Cloud Shell remains the workaround for all GCP work. Tracked as Phase 2 added prereq.

## References

- 10_ground_truth.md — Fire 4 update (PR #7 merged), Repository / HEAD section bump
- 11_roadmap.md — P1 Phase 1 progress, P2 Fire 4 update, P3 backlog new entry on test isolation
- 12_migration_sprint.md — Phase 1B status board flip to verified, Phase 2 added prereqs sub-section
- 90_runbooks/neon_schema_migration_via_cloud_shell.md (NEW THIS SESSION)
- _sessions/2026-05-10_fire_1_closed_and_bar_c_kickoff_claude_ai_planner.md (prior session, AM)
- 91_postmortems/2026-05-07_replit_dev_db_wedged.md — Fire 4 closure operational steps executed
- 80_adrs/adr_002_replit_neon_migration.md — strengthened by Phase 1B Stage 1 success
- smartcity-os PR #7 — https://github.com/empressaioemail-tech/smartcity-os/pull/7
