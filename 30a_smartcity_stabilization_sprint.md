---
id: 30a_smartcity_stabilization_sprint
title: SmartCity OS Stabilization Sprint — platform-ready foundation
status: active
last_updated: 2026-05-11
applies_to: smartcity-os
related: [30_smartcity_os, 33_smartcity_codex_1b_integration, 10_ground_truth, 11_roadmap, 12_migration_sprint, 13_risk_register, 15_replit_neon_ownership_advisory, 27_engine_evolution_plan, 42_design_accelerator_program_plan, 48_codex_program_plan, 90_runbooks/neon_schema_migration_via_cloud_shell, 91_postmortems/2026-05-07_replit_dev_db_wedged, adr_002_replit_neon_migration]
---

# SmartCity OS Stabilization Sprint — platform-ready foundation

> **Working sprint plan.** Edit in place as work executes; flip
> sub-phase status values as items complete. Status board is the
> source of truth for sprint progress. Exit condition: all done
> criteria checked off, retrospective committed in `_sessions/`,
> this doc's `status` flipped to `superseded` with `superseded_by:`
> pointing to the retrospective.

## Why this sprint

SmartCity OS is live on Cloud Run (since 2026-05-03 cutover) but
carries accumulated debt across migration, security, schema, and
multi-tenancy verification. Each item individually is small-to-medium;
collectively they prevent confident build-out of new features, new
cities, Codex 1b, Bastrop property intelligence, and other tenancy
expansions. This sprint closes the door on the Replit-managed era
and hands forward a platform stable enough that the next phase of
work is additive feature build, not firefighting.

The sprint folds in:

- **Phase 2 of `12_migration_sprint.md`** (Empressa Neon swap) as
  the spine workstream
- **W1 sprint** (seven previously-unspecified items — specs authored
  in §WS-2 below) as a parallel workstream
- **Security and code hygiene debt** (x-internal-ai removal × 2,
  vitest gap, Semgrep, Fire 2 internal items) as a parallel sweep
- **ADR-005 migration** (multitenancy contract canonicalization)
  plus a schema-framework decision (ADR-006, Drizzle migrate
  adoption) as the multi-tenancy and forward-tooling foundation

### Out of scope, intentionally

Enabled BY this sprint but downstream of it:

- Codex 1b standalone activation (P3; gated on ADR-008 engine
  factor-out, which itself gates on Phase 2C closure). Receiving
  surface on the SmartCity OS side is stubbed at
  `33_smartcity_codex_1b_integration.md`; see §"Cross-track
  interfaces" below.
- Bastrop property intelligence enhancement (P3)
- Jarrell onboarding + city-to-city architecture (M9, P3)
- Compass system prompt refactoring (P3 — may roll in opportunistically
  if WS-4 has bandwidth, but not promised)
- ADR-008 engine factor-out work (sibling agent's territory; this
  sprint's Phase 2C closure is its unblock)
- Fire 2 external rotations (Esri / Verkada / Calendar / VFD codes —
  held for Bastrop IT engagement; sprint covers internal items only)

## Cross-track interfaces

This sprint runs in parallel with the Codex/Cortex track (Hauska
Engine evolution, Design Accelerator program, Codex program). Three
sister docs landed in the same window as `30a`:

- `27_engine_evolution_plan.md` — Hauska Engine evolution. Intersects
  WS-4 schema/multi-tenancy work because the engine consumes
  tenant-scoped atoms; ADR-005 (this sprint's WS-4 unblock) is a
  required input to the engine's tenancy story.
- `42_design_accelerator_program_plan.md` — sister product program
  plan. Independent of this sprint's tactical work but shares the
  Hauska Engine and ADR-001 atom contract.
- `48_codex_program_plan.md` — Codex program plan. Codex Phase 4
  ships Codex 1b into the SmartCity OS Plan Review surface; lands
  on top of this sprint's exit state.

**Decision — M4-B → Codex 1b receiving surface (Option A).** New
canonical doc `33_smartcity_codex_1b_integration.md` carved as a
**stub** in this commit. The stub claims the slot, enumerates what
the full integration spec needs to cover, and lists dependencies on
this sprint's exit state plus the Codex track's Phase 3 readiness.
Full spec is deferred to a post-stabilization coordination session —
both sides need to reach their respective exit states before
interface details can be pinned down. The SmartCity-internal M4-B /
PLR-1..28 / SD-1..8 / W1-6 vocabulary remains canonical SmartCity OS
territory per the 2026-05-10 Codex housekeeping pass; per-item
cross-mapping to CDX-* lands in `33` when authored.

Rationale for (a) over (b) or (c): slot 33 was already mentally
reserved for this cross-mapping per the 2026-05-10 Codex session's
deferral; keeps `30_smartcity_os.md` as the product home without
bloating it into a detailed integration spec; gives the Codex track
a concrete target to point at for Phase 4 even before the full spec
exists.

**Test isolation footgun — cross-track ownership.** The
legacy-design-tools test isolation footgun (4 timestamped
`test_<unix_timestamp>_<8hex>` schemas on production-shared Neon —
same shape as the MyGov raw-records growth pattern this sprint's
WS-4 audits on the SmartCity OS side) is owned by the Codex/Cortex
track audit, not this sprint. WS-4's MyGov raw-records audit covers
the SmartCity OS half of that footgun shape; the legacy-design-tools
half lives on the sister track.

## Done criteria

The sprint exits when these are verified:

1. **On Empressa Neon end-to-end.** SmartCity OS production data
   path has zero remaining Replit-managed Neon dependencies. Cloud
   Run service `smartcity-api` points to Empressa-owned Neon project,
   not Replit-managed. Old DB remains as fallback only during the
   rollback window, no longer source of truth.
2. **All Fires closed.** Fire 1 ✅ (closed 2026-05-10). Fire 2 has
   internal items mitigated and Bastrop IT engagement initiated for
   externals. Fire 4 fully closed (PR #7 merged AND Replit workspace
   renamed).
3. **Code-side security debt cleared.** `x-internal-ai` removed from
   `server/routes/ai-assistant.ts:4212` and `server/app.ts:85` CORS
   allowlist. Auth middleware vitest coverage gap closed (regression
   test that fails closed if loopback predicate breaks). Semgrep
   finding on `mygov.ts:269` annotated with rationale or resolved.
4. **Schema hygiene baseline.** Migration prefix collisions resolved
   with production application order preserved per
   `migrations/meta/_journal.json`. `mygov_work_orders` deduplicated.
   Schema migration framework decided (Drizzle migrate per ADR-006)
   and adopted — `migrations/` directory and tooling reflect the
   decision.
5. **Multi-tenancy invariants verified.** ADR-005 migrated from
   pre-docs-repo source and canonical at
   `80_adrs/adr_005_smartcity_multitenancy.md`. Every tenant-scoped
   table verified to have `tenant_id NOT NULL` + FK + index per
   ADR-005. Smoke test demonstrates tenant isolation under load (no
   cross-tenant data leakage on production-shape queries).
6. ✅ **W1 sprint complete.** All seven W1 items (W1.A.6–9 forensics +
   W1.C.1–3 implementation) shipped with verifications captured. Met
   2026-05-11. A.6/A.8 rotation work continues post-sprint as A.6.b/A.8.b
   (Bastrop IT + vendor coordination required).
7. **CI clean baseline.** `typecheck` errors at zero or annotated as
   known-blocked-on-X with named follow-up. Semgrep + Gitleaks green
   or annotated. Lockfile drift root cause identified (resolved or
   tracked).

## Phase status board

| Phase | Workstream | Description | Owner | Status | Started | Completed | Notes |
|---|---|---|---|---|---|---|---|
| 0 | Foundation | Cross-cutting prereqs (clone refresh, doc clone-path fix, ADR-005 migration, gcloud SSL, quota headroom) | mixed | pending | — | — | Gate to WS-1 Phase 2A |
| 2A.0 | WS-1 | Phase 2A prereqs (post-merge.sh verification, migration prefix collisions, gcloud SSL) | cc-agent-1 + Nick | pending | — | — | gcloud SSL is Nick-only |
| 2A | WS-1 | Phase 2A schema sync (Cloud Shell, smartcity-os → Empressa Neon) | cc-agent-1 | pending | — | — | Mirrors neon migration runbook pattern |
| 2B | WS-1 | Phase 2B data-only sync | cc-agent-1 + Nick | pending | — | — | Needs low-traffic window |
| 2C | WS-1 | Phase 2C cutover + 24h obs | cc-agent-1 + Nick | pending | — | — | Backup tag + instant rollback ready |
| 3 | WS-1 | Drizzle migrate adoption (closes `12_migration_sprint.md` Phase 3) | cc-agent-1 | pending | — | — | Post-Phase-2C; ADR-006 |
| W1.A | WS-2 | W1.A.6–9 forensics dispatches (4 items, parallel-eligible) | cc-agent-1/2/3/4 | verified | 2026-05-11 | 2026-05-11 | All four shipped; A.6/A.8 rotation partial (A.6.b/A.8.b post-sprint) |
| W1.C | WS-2 | W1.C.1–3 implementation dispatches (3 items) | cc-agent-2 | verified | 2026-05-11 | 2026-05-11 | PRs #8/#9/#10 squash-merged to smartcity-os main |
| Sec | WS-3 | Security sweep + auth middleware vitest + Fire 2 internal items | cc-agent-3 | pending | — | — | 5–6 small items, bundleable |
| Sch | WS-4 | ADR-005 migration + multi-tenancy verification + schema hygiene | cc-agent-4 | pending | — | — | ADR-005 unblock first |
| Final | All | Done criteria validation + doc updates + retrospective | planner | pending | — | — | Sprint exit |

Status values: `pending` / `active` / `verified` / `rolled_back` /
`superseded`.

## Cross-cutting prerequisites

Must clear before WS-1 Phase 2A executes; several also unblock other
workstreams.

- [ ] **smartcity-os local clone refresh on Nick box.** Current state:
  branch `chore/fire-4-replit-deployment-neutralization` checked out;
  local `origin/main` HEAD is `5e9fca3`, missing `602f599` (Fire 4
  squash merge). Run `git fetch origin --prune && git checkout main
  && git pull --ff-only` on `P:\empressaio_tech_smartcity_os`.
  Owner: Nick. Size: S.
- [ ] **Doc clone-path correction.** `10_ground_truth.md` and
  `21_ai_first_dev_flow.md` reference `P:\smartcity-os`; actual is
  `P:\empressaio_tech_smartcity_os` (matches GitHub repo name).
  Update doc references; don't rename clone. Owner: planner (folded
  into the session-close commit that lands this sprint plan).
  Size: S.
- [ ] **ADR-005 migration from pre-docs-repo.** Source: pre-docs-repo
  `45_smartcity_multitenancy_spec.md`. Target:
  `80_adrs/adr_005_smartcity_multitenancy.md`. Unblocks multi-tenancy
  verification (done criterion 5) and WS-4's invariant audit. If
  pre-docs-repo source isn't accessible to the doc_repo agent,
  escalate to Nick; do not block WS-1 — proceed with migration spine
  and address WS-4 once source is available. Owner: cc-agent-4 OR
  Nick + planner. Size: M.
- [ ] **gcloud SSL fix on Nick box.** Currently broken (`unable to
  get local issuer certificate`); Cloud Shell is the workaround.
  Resolves it so WS-1 doesn't need Cloud Shell for every Secret
  Manager and deploy operation. Owner: Nick. Size: S. Tracked also
  under WS-1 Phase 2A prereqs.
- [ ] **Empressa Neon quota headroom check.** Per
  `91_postmortems/2026-05-07_replit_dev_db_wedged.md`, MyGov scraper
  tables (`mygov_raw_records` ~20 GB, `mygov_raw_sync_pages`
  ~9.3 GB, `mygov_work_orders` ~1.2 GB) drove the Replit Neon wedge.
  Verify Empressa Neon target tier has headroom for these plus
  12-month growth projection. Owner: cc-agent-1 (folded into Phase
  2A recon). Size: S.

## WS-1 — Migration spine

**Goal.** Move smartcity-os production data path off Replit-managed
Neon onto Empressa-owned Neon in `us-central1` (closes Fire 5
cross-region hop). Adopt Drizzle migrate as forward schema framework.
Linear sequencing within this workstream; runs parallel to WS-2/3/4.

**Estimated effort.** 2–3 weeks calendar with one agent dedicated.
Phase 2B/2C bottleneck on scheduled low-traffic windows.

**Pattern.** Mirror `90_runbooks/neon_schema_migration_via_cloud_shell.md`
with smartcity-os adaptations from that runbook's "Phase 2A
adaptations (smartcity-os)" section. ~106 public tables; tenant_id
integrity critical; region change to `us-central1`; do NOT re-run
the neutralized `scripts/post-merge.sh` migration logic.

### Phase 2A prereqs (cc-agent-1)

- [ ] **`scripts/post-merge.sh` Neon guard verification.** Script was
  neutralized in PR #7 (Fire 4 close); original 200 lines preserved
  below the `=== ORIGINAL CONTENT BELOW ===` delimiter. Read
  original; verify the three migration blocks (mygov_fees index, AI
  tables, MyGov schema-sync) are either (a) already idempotent and
  harmless to skip, or (b) need explicit Drizzle migrate handling
  during framework adoption (Phase 3). Produce 1-page findings doc.
  Rollback: N/A (read-only).
- [ ] **Migration prefix collision resolution.** Files: `0003_curious_hammerhead.sql`
  (Drizzle, `after_action_summaries`), `0003_mygov_schema_sync.sql`
  (hand-authored, MyGov), `0004_enrichment_expanded_columns.sql`
  (hand-authored, MyGov enrichment), `0004_premium_gambit.sql`
  (Drizzle, `ai_feedback`). Recon MUST read `migrations/meta/_journal.json`
  first to determine actual production application order. Rename
  preserving that order; update `_journal.json`. Coordinate with
  Phase 2A schema sync to ensure renamed files match what's applied
  in production. Rollback: revert rename commit, restore `_journal.json`.
- [ ] **gcloud SSL fix on Nick box** (cross-cutting). Owner: Nick.

**Success criteria.** All three cleared. Phase 2A can proceed with
deterministic migration ordering and working local gcloud.

### Phase 2A — schema-only sync (cc-agent-1)

Mirror Phase 1B Stage 1 worked example from neon migration runbook,
with smartcity-os adaptations:

- [ ] Cloud Shell environment setup; project switch to `smartcity-os-prod`;
  fetch source `DATABASE_URL` from Secret Manager; fetch new Empressa
  Neon target connection string.
- [ ] Recon: both-sides table count, extension list, tenant_id
  presence audit.
- [ ] Schema dump: `pg_dump --schema-only --no-owner --no-acl -N 'test_*'
  -N '_system' "$SOURCE_URL" > schema.sql`. Sanity-check via grep
  patterns (expect ~106 public tables).
- [ ] Restore to Empressa Neon target: `psql -v ON_ERROR_STOP=1
  "$TARGET_URL" < schema.sql`.
- [ ] Parity verification: paired loop counting tables / columns /
  indexes / constraints / extensions on both sides. Specifically:
  count of `tenant_id` columns must match exactly; flag any table
  missing tenant_id that exists in the multi-tenancy-required set
  per ADR-005 (if ADR-005 has landed; if not, use pre-docs-repo
  reference).
- [ ] `mygov_work_orders` deduplication: if schema has duplicate
  definition artifacts, resolve to single canonical definition during
  sync. Document the resolution.

**Rollback.** Drop Empressa Neon target DB; re-run from clean target.

**Success criteria.** 1:1 parity ex-test-schemas; all multi-tenant
tables have correct tenant_id schema; extensions match; recorded in
dispatch report.

### Phase 2B — data sync (cc-agent-1 + Nick window)

- [ ] Low-traffic window scheduled by Nick (weekend overnight US
  Central recommended).
- [ ] Data-only `pg_dump` from source → restore to target.
- [ ] Row count parity on every non-`test_*` non-`_system` table.
- [ ] Sample query equivalence: 5–10 representative queries return
  identical results on both sides.
- [ ] Backup tag on source DB before any further writes.

**Rollback.** Truncate target tables; re-run data sync from source.

**Success criteria.** Row count parity exact; sample queries match;
target ready for cutover.

### Phase 2C — cutover + 24h obs (cc-agent-1 + Nick)

- [ ] Update `DATABASE_URL` secret on `smartcity-os-prod` GCP project
  (new version pointing to Empressa Neon).
- [ ] Deploy via canary runbook (`90_runbooks/cloud_run_canary_deploy.md`
  Example 1 pattern): `--no-traffic` initial deploy referencing new
  secret version, smoke probes, atomic `update-traffic` to canary tag.
- [ ] 24h observation: error rate, Compass AI internal-call paths,
  MyGov scraper success, healthz status, p50/p95/p99 latency.
- [ ] Hold prior revision at 0% for instant rollback.
- [ ] Backup tag `backup/post-phase-2c-<sha>` on smartcity-os.

**Rollback.** Revert `DATABASE_URL` secret to prior version; update
Cloud Run traffic to prior revision; investigate root cause before
retry.

**Success criteria.** 24h obs clean (no spike vs baseline); rollback
exercised in dry-run at least once before cutover OR documented
explicitly as un-exercised with rationale.

### Phase 3 — Drizzle migrate adoption (cc-agent-1)

Closes `12_migration_sprint.md` Phase 3.

- [ ] **ADR-006 drafted** at `80_adrs/adr_006_schema_migration_framework.md`
  (slot 006 currently open). Captures: Drizzle migrate vs alternatives,
  rationale, integration with existing `migrations/` directory,
  handling of historical hand-authored migrations, CI integration.
- [ ] Repo wiring: `drizzle.config.ts` update if needed; migration
  scripts in `package.json`; CI hook on `migrate` command.
- [ ] Migration history reconciliation: import existing applied
  migrations into Drizzle migrate's tracking OR document why history
  starts fresh from current state.
- [ ] One trivial test migration through the new flow to verify
  end-to-end (add+drop a no-op column on a low-traffic table).

**Rollback.** Revert ADR-006; revert config; existing manual flow
remains.

**Success criteria.** ADR-006 landed; CI green on migrate command;
test migration applied and rolled back successfully.

## WS-2 — W1 sprint

**Goal.** Ship all seven previously-unspecified W1 items. Forensics
items (W1.A.6–9) produce findings docs; implementation items
(W1.C.1–3) produce code changes verified in production.

**Estimated effort.** 1.5–2 weeks calendar with one agent. Forensics
batch first (mostly parallel-eligible); implementation batch second.

**Pattern.** Per-item dispatch prompts following recon → execute →
report stage gates (HR-5). Each item's success criteria embedded in
the spec below.

### W1.A.6 — Calendar event visibility (forensics)

**Status:** ✅ verified 2026-05-11 — findings doc shipped (smartcity-os `f3c06f1`); CALENDAR_API_KEY removed from `.replit` at HEAD (`01fa14e`); rotation partial — A.6.b post-sprint follow-on covers dual-key middleware, Cloud Shell rotation, 14-day `.ics` re-key window. **Implementation merged 2026-05-11 (PR #12, squash `86a90ff`)** — F-1 public read-only `/api/calendar/events/public`, F-3 parseDate TZ fix, F-4 VTIMEZONE block, F-5 Municode await+timeout, F-6 boot probe + status endpoint extension. Deployed in revision `smartcity-api-00084-vhr`. F-2 board schedule reconciliation still blocked on Bastrop city clerk authoritative schedule. A.6.b CALENDAR_API_KEY bind for env-keyed partner subscriptions still gated on F-7/F-8 dual-key middleware (now bundled with broader cutover env-var rebind cluster — see Status tracking).

**Problem.** Calendar events from the BeWith / Google Calendar
integration aren't reliably visible in the SmartCity OS UI where
expected. Symptom shape and reproduction conditions captured in
recon.

**Files / context.** `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` in
smartcity-os repo root; `CALENDAR_API_KEY` secret (currently in
`.replit`, Fire 2 internal — handle rotation as part of this
dispatch); any `server/routes/calendar*` or `server/services/calendar*`
paths; UI components rendering calendar data.

**Recon scope.** Data flow source → store → API → UI for calendar
events. Reproduce visibility gap: which events drop at which stage?
Audit OAuth scope and refresh-token handling. Check timezone handling
end-to-end (events stored UTC, rendered local?).

**Output.** Findings doc at `_research/w1_a_6_calendar_event_visibility.md`
with reproduction steps, root cause hypotheses ranked by evidence,
recommended fix list with estimated sizes.

**Success criteria.** Findings doc committed; root cause(s) named
with evidence; fix list scoped and prioritized.

### W1.A.7 — Power BI accuracy (forensics)

**Status:** ✅ verified 2026-05-11 — findings doc shipped (smartcity-os `6d020d4`); 11 divergences cataloged with recommended-fixes-as-separate-table pattern. **Strategic call resolved 2026-05-11 — Option B (OS reads PBI's published visuals directly). Scoping doc shipped (PR #13, squash `04b296e`) at smartcity-os `_research/w1_a_7_pbi_option_b_scoping.md`.** Option A retired. Phase 1 implementation gated on five open questions in scoping doc §8: Bastrop PBI workspace visual inventory (Monday Bastrop ask), ProjectDetailCard treatment, RLS posture, executive-overview / AI-assistant consumer disposition (Phase 2 gate), filter-chip → bookmark wiring.

**Problem.** Power BI dashboards display numbers that diverge from
SmartCity OS source-of-truth queries. Specific divergences captured
in recon.

**Files / context.** `EXECUTIVE_DASHBOARD_GUIDE.md`,
`EXECUTIVE_DASHBOARD_AND_CITIZEN_PORTAL.md`; `POWERBI_REPORT_ID`
secret; Power BI ETL or refresh job code paths; source tables driving
the dashboard (likely MyGov-related).

**Recon scope.** Identify which metrics diverge and by how much.
Trace each divergent metric back through ETL. Categorize divergence:
stale refresh, ETL logic bug, source data quality, or Power BI-side
calculation. Audit refresh cadence and trigger reliability.

**Output.** Findings doc at `_research/w1_a_7_power_bi_accuracy.md`
with metric-by-metric divergence table, root cause categorization,
recommended fixes.

**Success criteria.** Findings doc committed; every named divergence
has a root cause and a recommended fix.

### W1.A.8 — Police units / Spireon (forensics)

**Status:** ✅ verified 2026-05-11 — findings doc shipped (smartcity-os `ad0cbf7`); `.replit` plaintext and `SPIREON_API_TROUBLESHOOTING.md` token UUID + password-length hint redacted at HEAD (`93e4da5`); rotation partial — A.8.b post-sprint follow-on covers SPIREON_TOKEN via Solera Tier-2 (most urgent), SPIREON_USERNAME + SPIREON_PASSWORD rotation, Cloud Run cutover, git-history scrub coordination with A.6.b. **Implementation merged 2026-05-11 (PR #11, squash `5b9815e`)** — F-2 mapDepartment reorder, F-3 active flag + inactive UI label, F-4 retry + LKG fallback, F-8 disappearance log. Deployed in revision `smartcity-api-00084-vhr`. **User-visible value restored 2026-05-11 session 2** — Spireon credentials (TOKEN, USERNAME, PASSWORD + ACCOUNT_NAME, NSPIRE_ID, SYSDEVX_ID) re-bound to Cloud Run via revision `smartcity-api-00085-pvd`; integration verified live (21 vehicles, NSpire authenticated). Vendor rotation via Solera Tier-2 still available as future swap if needed.

**Problem.** Police unit tracking via Spireon GPS integration is
incomplete or unreliable. Symptom shape TBD in recon.

**Files / context.** `SPIREON_USERNAME` secret (username only —
password handling TBD); Spireon API integration code paths
(`server/services/spireon*` or similar); police-unit-specific
UI/data paths.

**Recon scope.** Catalog which Spireon-tracked units are visible vs.
missing in SmartCity OS. Audit Spireon API auth flow (Fire 2 internal:
`SPIREON_USERNAME` plaintext in `.replit` — rotate as part of this
dispatch). Identify update cadence and staleness. Reproduce
missing-unit scenario.

**Output.** Findings doc at `_research/w1_a_8_police_units_spireon.md`
with unit catalog (tracked vs not), auth audit, freshness analysis,
fix list.

**Success criteria.** Findings doc committed; missing-unit pattern
characterized; fix list includes secret rotation if applicable.

### W1.A.9 — Daily health-watch email (forensics + design)

**Status:** ✅ verified 2026-05-11 — findings + design doc shipped (smartcity-os `5d126d0`); implementation deferred per 30a explicit scope (~7.5h V1 follow-on).

**Problem.** No daily summary of SmartCity OS system health currently
exists (or exists but is unreliable / unread). Need: design a daily
email surfacing Cloud Run service status, scraper success/failure
counts, Empressa Neon DB connection health, key metric deltas vs
previous day.

**Files / context.** Any existing email-sending infrastructure
(SendGrid, AWS SES, Gmail API?) — recon to identify; existing
healthz endpoints / monitoring data sources; Cloud Scheduler patterns
from `smartcity-scraper` service.

**Recon scope.** Audit existing email infrastructure (if any) and
recommend reuse or new provider. Catalog health signals worth
surfacing daily (proposal seed: Cloud Run service status, scraper
success rate, MyGov record growth delta, Power BI refresh status,
error rate p95). Design email layout and delivery cadence (recommend
7 AM US Central; primary recipient TBD with Nick).

**Output.** Findings doc at `_research/w1_a_9_health_watch_email.md`
with infrastructure audit, signal list, email design mockup, delivery
mechanism recommendation. Implementation is follow-on dispatch out
of scope for the forensics phase.

**Success criteria.** Findings doc committed; signal list complete;
delivery mechanism decided (build vs. adopt).

### W1.C.1 — Prophecy layout (implementation)

**Status:** ✅ verified 2026-05-11 — PR #10 squash-merged to smartcity-os main. Reframed mid-stream from viewport/layout fix to design-system alignment per Nick's actual symptom ("doesn't follow look and feel"). Replit Agent design.md authored as parallel artifact (`_research/w1_c_1_prophecy_design_spec.md`); pending clean-tree commit to smartcity-os.

**Problem.** Prophecy was added to `SmartCityLayout` top navigation
in PR #4 (commit `602f0d8`). Layout issue exists — exact shape per
Nick's prior context. Confirm with Nick before dispatch fires.

**Files / context.** `client/src/layouts/SmartCityLayout*` (top
nav component); `client/src/pages/Prophecy*` or similar Prophecy
page components; responsive/breakpoint CSS or Tailwind config.

**Implementation scope.** Recon: reproduce the layout issue; capture
screenshots/measurements. Fix: adjust layout (likely flex/grid or
breakpoint tweak). Verify across viewport sizes (mobile, tablet,
desktop, wide).

**Output.** PR against smartcity-os fixing the layout, with
before/after screenshots in PR description.

**Success criteria.** Layout issue resolved across viewports;
vitest + typecheck pass; PR merged.

### W1.C.2 — CSP frame-src (implementation)

**Status:** ✅ verified 2026-05-11 — PR #9 squash-merged to smartcity-os main (`8402e66`). Bundled with WS-3 `x-internal-ai` CORS removal on `server/app.ts` (single PR per coordination note). PR-body framing rewritten mid-stream after Prophecy iframe blockage identified as third-party-side (their `frame-ancestors` policy); our CSP fix is precondition, not complete solution — allowlist coordination with Prophecy in progress.

**Problem.** Content Security Policy `frame-src` directive needs
configuration for embedded content (likely Power BI, ArcGIS map
embeds, Verkada video feeds). Current state TBD in recon.

**Files / context.** `server/app.ts` (CSP header setting — coordinate
with WS-3 x-internal-ai removal on same file); `helmet` config or
equivalent CSP middleware; list of legitimate embed origins.

**Implementation scope.** Recon: current CSP frame-src state;
identify legitimate embed origins; identify any current breakage
caused by missing/wrong config. Fix: explicit allowlist of frame-src
origins (no wildcard; per-origin). Verify: embeds work in dev +
staging; Mozilla Observatory (or equivalent) score improves.

**Output.** PR against smartcity-os updating CSP frame-src, with
allowlist rationale in PR description.

**Success criteria.** Embeds function correctly; CSP scan score
improves; no wildcard origins; PR merged. **Coordinate with WS-3
edits to `server/app.ts`** — bundle into one PR or sequence cleanly.

### W1.C.3 — OpenGov BNP hardening (implementation)

**Status:** ✅ verified 2026-05-11 — PR #8 squash-merged to smartcity-os main (`281126a`). Exponential backoff, circuit breaker, structured logging, rate-limit respect; synthetic failure injection tests pass per success criteria.

**Problem.** OpenGov integration's BNP endpoint (acronym TBD —
likely Building / Bid / Budget / Notice / Permit) needs hardening.
Failure modes TBD in recon.

**Files / context.** `OPENGOV` secrets in Secret Manager (production
+ staging variants); OpenGov integration code paths
(`server/services/opengov*` or similar); existing retry / rate-limit
/ error-handling patterns to mirror.

**Implementation scope.** Recon: identify the specific OpenGov BNP
integration point; catalog failure modes (auth, timeout, rate limit,
schema mismatch). Hardening: exponential backoff retries on
transient failures; circuit breaker on persistent failures;
structured error logging; rate limit respect. Verify: synthetic
failure injection (mock 429 / 500 / timeout) and observe correct
behavior.

**Output.** PR against smartcity-os with hardening; before/after
failure-mode behavior documented in PR.

**Success criteria.** Hardened integration; tests covering each
failure mode pass; PR merged.

## WS-3 — Security sweep + code hygiene

**Goal.** Clear code-side security debt and close Fire 1's
regression window with a vitest that fails closed.

**Estimated effort.** 3–5 days calendar with one agent. Mostly
small PRs; bundleable into one or two combined dispatches.

### Items

- [ ] **Remove stale `x-internal-ai: 1` header** at
  `server/routes/ai-assistant.ts:4212`. Relic of the pre-Fire-1
  trust pattern; the header is no longer trusted for auth, so emitting
  it is dead code that could mislead reviewers. Replace with
  appropriate auth pattern or remove if call is intra-process.
- [ ] **Remove `x-internal-ai` from CORS allowlist** at
  `server/app.ts:85`. With Fire 1 fixed, the header is no longer a
  trusted auth signal; allowing it in CORS exposes it for cross-origin
  reflection without value. **Coordinate with W1.C.2** CSP work on
  same file (single PR OK).
- [ ] **Close auth middleware vitest coverage gap.** Add vitest that
  fails closed if `server/middleware/tenant.ts:57-62` loopback
  predicate regresses (the predicate `server/routes.ts:83` mirrors
  per PR #6). Test must verify: (a) non-loopback request with
  `x-internal-ai` header → 401; (b) loopback request with header →
  expected internal response; (c) header alone never authenticates
  external requests.
- [ ] **Semgrep `nosemgrep` annotation** at `mygov.ts:269`. Confirm
  finding and rationale in recon. Add `// nosemgrep:` comment with
  finding ID and one-line rationale.
- [ ] **Fire 2 internal items:**
  - Replace `Admin123!` literals (three uses:
    `ADMIN_RESET_PASSWORD`, `USER_RESET_PASSWORD`,
    `BASTROP_BOOTSTRAP_PASSWORD`) with generate-on-first-run
    mechanism. New users get a random bootstrap password
    (16+ chars, mixed) printed once to operator log; subsequent
    runs use the persisted hash.
  - Audit `POWERBI_REPORT_ID`: true secret or public identifier? If
    public, move out of secrets. If private, ensure only in Secret
    Manager (not `.replit`).
  - `USER_RESET_EMAIL = "jsaldivar@cityofbastrop.org"` is PII; move
    to a tenant-keyed config table or environment-specific Secret
    Manager value; remove from `.replit`.

**Rollback per item.** Standard PR revert.

**Success criteria.** All items shipped; vitest fails closed on Fire
1 regression; `.replit` no longer contains plaintext secrets or PII
(external rotations still held under Fire 2 deferred work).

## WS-4 — Schema, multi-tenancy, framework

**Goal.** Land the multi-tenancy contract (ADR-005), verify
invariants end-to-end, and complete schema hygiene baseline.

**Estimated effort.** 1–2 weeks calendar with one agent. Some items
coordinate with WS-1 (`mygov_work_orders` dedup in Phase 2A;
multi-tenancy verification post-Phase-2C).

### Items

- [ ] **ADR-005 migration from pre-docs-repo.** Source: pre-docs-repo
  `45_smartcity_multitenancy_spec.md`. Target:
  `80_adrs/adr_005_smartcity_multitenancy.md`. Apply
  `02_doc_migration_plan.md` patterns. If source content has evolved
  since the original draft, surface the deltas. Cross-reference
  ADR-007 (which extends ADR-005 to cross-stakeholder) and ADR-001
  (atom contract). **Unblocks done criterion 5.**
- [ ] **MyGov raw-records growth audit on production Empressa Neon.**
  Read-only forensics. Per
  `91_postmortems/2026-05-07_replit_dev_db_wedged.md`, three tables
  drove the Replit dev DB wedge (`mygov_raw_records`,
  `mygov_raw_sync_pages`, `mygov_work_orders`). Audit current
  production growth rate; identify retention policy gaps; recommend
  TTL / archival / partitioning if growth is unbounded. Output:
  `_research/ws4_mygov_raw_records_growth.md`. Same forensics shape
  as the legacy-design-tools test-isolation footgun audit owned by
  the Codex/Cortex track — coordinate findings if patterns rhyme,
  but the two audits run independently.
- [ ] **`mygov_work_orders` schema dedup.** Folded into Phase 2A
  schema sync (WS-1 coordination point). If `mygov_work_orders` has
  duplicate / drifted definitions across migration files, resolve
  during Phase 2A schema generation. Document the canonical
  definition.
- [ ] **Multi-tenancy invariant verification end-to-end.** Post
  Phase 2C cutover. Verifies done criterion 5:
  - Schema audit: every table identified by ADR-005 as tenant-scoped
    has `tenant_id INT NOT NULL`, FK to tenants table, index on
    tenant_id (or composite leading with tenant_id).
  - Query audit: spot-check 10–20 representative production queries
    for tenant_id propagation (no queries return rows from multiple
    tenants without explicit join logic).
  - Load smoke test: synthetic two-tenant test producing concurrent
    writes; verify zero cross-tenant data leakage in reads.
  - Output: `_research/ws4_multi_tenancy_verification.md` with audit
    results and remediation list (if any).
- [ ] **`typecheck` baseline → zero (or annotated).** Run `tsc` /
  `vitest typecheck` on current state; enumerate errors; fix
  trivial-to-fix items or annotate known-blocked with named follow-up
  P3. Output: zero typecheck errors OR a doc enumerating remaining
  and gating their resolution.
- [ ] **Lockfile drift root cause** (P3 from roadmap). Audit
  `package-lock.json` vs `package.json` consistency; identify drift
  source (manual edits or merge artifacts); document or resolve.
- [ ] **ADR-006 schema migration framework.** See WS-1 Phase 3 —
  same ADR. Coordinate authorship: WS-4 may draft the ADR while
  WS-1 implements adoption.

**Rollback.** Per item; ADR-005 migration is doc-only, no production
impact.

**Success criteria.** ADR-005 canonical; multi-tenancy invariants
verified and documented; raw-records growth understood; typecheck
clean or known-annotated; ADR-006 landed.

## Pure-Nick parallel items

Run alongside the workstreams; not agent-dispatchable.

- [ ] **Replit workspace rename** → `SmartCityOSMain-retired-20260510`.
  Fully closes Fire 4. Sub-minute UI action.
- [ ] **gcloud SSL fix on Nick box.** Cross-cutting prereq.
- [ ] **Phase 2B/2C window scheduling.** Both need low-traffic
  windows; can share or split.
- [ ] **Bastrop IT engagement** for Fire 2 external rotations
  (Esri, Verkada, Calendar API, VFD codes). Initiate during sprint;
  external rotations land within sprint window if Bastrop IT
  responsive, otherwise externals slip to follow-on.
- [ ] **smartcity-os local clone refresh** (`git fetch origin && git
  checkout main && git pull --ff-only` on
  `P:\empressaio_tech_smartcity_os`).

## Verification protocol (cross-phase)

After each sub-phase completes, before flipping status to `verified`:

- Verbatim `git log --oneline -3` of affected repo's `origin/main`
  pasted in dispatch report (HR-8 verbatim verification artifacts).
- Schema sync: parity check output (table/col/idx/constraint counts)
  pasted verbatim.
- Data sync: row count parity output pasted verbatim.
- Cloud Run cutover: `gcloud run revisions list --service=...
  --format='table(...)'` output pasted verbatim showing traffic
  split.
- CI work: green build URL pasted verbatim.
- ADR migrations: frontmatter of the new doc pasted verbatim.

## Rollback / abort criteria

Sprint-level triggers that pause work for planner re-scope:

- Phase 2C cutover produces 24h obs failure (error rate spike >2x
  baseline; latency p95 spike >50%; scraper failures): rollback per
  Phase 2C rollback steps; planner reconvenes for retry vs. scope
  adjustment.
- ADR-005 migration reveals multi-tenancy invariants the current
  schema doesn't satisfy: pause WS-4 verification; planner decides
  remediation scope (in-sprint vs. follow-on).
- Bastrop IT engagement reveals external dependency that gates more
  of this sprint than anticipated: re-scope Fire 2 inclusion.
- Any dispatch produces unexpected scope creep (>2x estimated
  effort): agent reports to planner; planner re-prioritizes.

## Discipline cross-references

From `20_agent_operating_rules.md`:

- HR-5: recon → execute → report stage gates on every dispatch
- HR-8: verbatim verification artifacts (no summarization)
- HR-9: stop and report on unexpected state, don't paper over
- SR-1: prefer bundling small related changes to minimize PR overhead
- PC-2: planner generates prompts; agents execute; Nick greenlights
  fires

## Status tracking

Newest-first dated log. Each entry: date, sub-phase, status change,
SHA / artifact reference.

- **2026-05-11 (session 2 — cutover env-var bind shipped):** Cutover env-var bind executed via Cloud Shell. 18 vars bound to Cloud Run smartcity-api via revision `smartcity-api-00085-pvd` (10 of 11 Track A silent-drops + 6 Spireon Track B + 2 OpenGov family additions). MYGOV pre-existing Secret Manager debris discovered (v1/v2 from 2026-04-04, never wired to Cloud Run, no IAM); remediated via v3 version-add + IAM grant. Spireon verified live (21 vehicles, NSpire authenticated); MyGov verified live (12,240 permits); OpenGov BNP healthy. A.8 user-visible value restored. New bind-procedure runbook landed: `90_runbooks/cutover_env_var_bind_procedure.md`. Outstanding: `OPENGOV_TRANSPARENCY_KEY` (Replit-vault lookup failed; vendor-portal lookup deferred), Track B remainder (Verkada/ESRI/VFD/Calendar via Bastrop Monday vendor coordination), AI_INTEGRATIONS_* code rename. Revision-suffix contradiction (`00084-vhr` vs `00084-weg`) surfaced and queued for investigation next session. Session summary: `_sessions/2026-05-11_cutover_env_var_bind_shipped_claude_ai_planner.md`.
- **2026-05-11 (W1 implementation follow-ons + cutover env-var gap):** W1.A.6 / W1.A.7 / W1.A.8 implementation follow-ons shipped — smartcity-os PRs #11 (A.8 batch, squash `5b9815e`), #12 (A.6 batch, squash `86a90ff`), #13 (A.7 Option B scoping, squash `04b296e`). All three deployed to Cloud Run revision `smartcity-api-00084-vhr` (image digest `sha256:a53cd036...`). Per-item status lines updated above. **New work cluster surfaced — Cutover env-var rebind.** Post-deploy verification of A.8 surfaced 30+ env vars referenced in code but not bound in Cloud Run; full inventory at `90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`, analysis at `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`. Cluster bundles A.6.b + A.8.b + 11-var silent-drop restore + 13-var rotation-pending restore + AI_INTEGRATIONS_* code rename. P1 next-session work, two-track (immediate silent-drop / rotation-pending as vendor responses arrive). Session summary: `_sessions/2026-05-11_smartcity_a8_a6_a7_ship_and_env_audit_claude_ai_planner.md`.
- **2026-05-11 (WS-2 exit):** All seven W1 items verified. Phase
  board rows W1.A and W1.C flipped to `verified`. Done criterion #6
  met. Smartcity-os PRs #8 (W1.C.3 OpenGov BNP hardening), #9 (W1.C.2
  CSP + bundled WS-3 x-internal-ai CORS removal), #10 (W1.C.1 Prophecy
  design-system alignment) all squash-merged. Forensics findings docs
  (A.6 calendar, A.7 Power BI, A.8 Spireon, A.9 health-watch email)
  shipped to smartcity-os `_research/`. A.6 and A.8 plaintext-at-HEAD
  removal landed in `.replit` + `SPIREON_API_TROUBLESHOOTING.md`;
  rotation work continues post-sprint as A.6.b / A.8.b. Session
  summary: `_sessions/2026-05-11_w1_sprint_ws2_exit_claude_ai_planner.md`.
- **2026-05-11:** Audit pass finalized. Cross-track interfaces
  documented; `33_smartcity_codex_1b_integration.md` stub created
  as Codex 1b receiving surface (Option A). Sister-doc cross-refs
  added (27, 42, 48). All workstreams remain `pending`.
- **2026-05-10:** Sprint scoped and committed. All workstreams in
  `pending`. Cross-cutting prereqs identified; ADR-005 migration
  flagged as Wave 1 dependency.

## References

- `30_smartcity_os.md` — product home (parent doc)
- `33_smartcity_codex_1b_integration.md` — Codex 1b receiving surface
  (stub; full spec deferred to post-sprint coordination)
- `27_engine_evolution_plan.md` — Hauska Engine evolution; intersects
  WS-4 schema/multi-tenancy via tenant-scoped atom consumption
- `42_design_accelerator_program_plan.md` — sister product program
- `48_codex_program_plan.md` — Codex program; Phase 4 lands on this
  sprint's exit state
- `12_migration_sprint.md` — Phase 2A–C definitions; this sprint
  executes that phase as WS-1
- `10_ground_truth.md` — production state, fires, current revisions
- `11_roadmap.md` — backlog this sprint draws from
- `13_risk_register.md` — Risk 11 retires post-Phase-2C
- `15_replit_neon_ownership_advisory.md` — context for why Phase 2
  exists
- `90_runbooks/neon_schema_migration_via_cloud_shell.md` — pattern
  WS-1 follows
- `91_postmortems/2026-05-07_replit_dev_db_wedged.md` — failure mode
  WS-1 must guard against
- `90_runbooks/cloud_run_canary_deploy.md` — pattern Phase 2C follows
- `80_adrs/adr_002_replit_neon_migration.md` — strategic basis for
  the migration
- `80_adrs/adr_007_cross_stakeholder_atom_access.md` — extends
  ADR-005; WS-4 verifies ADR-005 baseline before ADR-007 work
  proceeds
- Legacy-design-tools test isolation footgun audit — owned by the
  Codex/Cortex track, not this sprint (the SmartCity OS side of the
  same footgun shape is WS-4's MyGov raw-records audit)
- `_sessions/2026-05-11_smartcity_stabilization_sprint_finalized_claude_ai_planner.md`
  — session that finalized this sprint plan

## Revision history

- **2026-05-11 (W1 implementation follow-ons + cutover env-var gap):** Per-item status lines for W1.A.6 / W1.A.7 / W1.A.8 updated with PR merge + deploy reference (PRs #11 / #12 / #13 to smartcity-os; revision `smartcity-api-00084-vhr`). Status tracking entry added for the implementation batch + cutover env-var rebind cluster. Sprint remains `active`; M-Stabilize done criteria unchanged.
- **2026-05-11 (WS-2 exit):** Phase board W1.A + W1.C flipped to
  `verified`. Per-item status lines added to W1.A.6/A.7/A.8/A.9 and
  W1.C.1/C.2/C.3 sub-sections. Done criterion #6 marked met. Status
  tracking log entry added. Sprint remains `active`; WS-1, WS-3
  remaining items, and WS-4 still pending.
- **2026-05-11:** Audit pass — Cross-track interfaces section added
  (sister docs 27/42/48 cross-referenced); M4-B → Codex 1b receiving
  surface decision noted (Option A: new stub doc
  `33_smartcity_codex_1b_integration.md`); test isolation cross-track
  ownership noted in WS-4 item and References. Frontmatter `related`
  extended. `last_updated` bumped.
- **2026-05-10 (origin):** Sprint plan drafted. Sub-letter `30a`
  under `30_smartcity_os.md` per `01_doc_conventions.md`
  sub-component convention. Four workstreams: WS-1 migration spine,
  WS-2 W1 sprint (specs authored inline), WS-3 security + code
  hygiene, WS-4 schema + multi-tenancy + framework. Seven done
  criteria. Phase status board pending across the board.
