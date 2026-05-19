---
id: 2026-05-19_cc-agent-C_replit_decouple
title: Dispatch — cc-agent-C legacy-design-tools (Replit decouple + Cloud Run cutover prep + Neon swap)
date: 2026-05-19
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 40_design_accelerator, 90_runbooks/cloud_run_canary_deploy, _sessions/2026-05-19_cortex_track_close_out_claude_code, CLAUDE.md]
---

# Lane C.2 — cc-agent-C dispatch (Replit decouple + Cloud Run cutover prep + Neon swap)

You are cc-agent-C continuing on the `legacy-design-tools` repo. Lane C.2 handles the infrastructure migration: legacy-design-tools production moves from Replit autoscale at `prompt-agent-accelerator.replit.app` to Cloud Run, and the Neon prod instance is swapped to a fresh prod-grade Neon instance.

This dispatch covers **preparation only**. The actual cutover (C.6) is a separate operator-led action sequenced after all of Lane A + Lane B + Lane C.1 + C.3 + C.4 land. Do not execute cutover within this dispatch; build the path so the operator can flip the switch when ready.

## Why this exists

The 2026-05-19 cortex track close-out surfaced a deferred IFC import bug whose investigation pointed at Replit-specific runtime quirks (env handling, autoscale lifecycle). The operator deferred bug investigation until post-cutover on the bet that a clean Cloud Run + fresh Neon environment surfaces the real root cause (or self-resolves the bug if it was Replit-induced).

Beyond the bug, decoupling from Replit removes the operator from a vendor's autoscale assumptions, regains direct ownership of the database, and aligns legacy-design-tools' production posture with the smartcity-os stack already on Cloud Run.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope including the deferred-IFC-bug stance.
3. [`40_design_accelerator.md`](../40_design_accelerator.md) lines 39-44 (production target — updated this sprint) and external services table.
4. [`_sessions/2026-05-19_cortex_track_close_out_claude_code.md`](../_sessions/2026-05-19_cortex_track_close_out_claude_code.md) §Phase 7 (Neon prod schema apply context; Phase 1A CI/CD scaffold reference).
5. [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) — canonical canary pattern for smartcity-os; legacy-design-tools cutover should follow the same pattern.
6. Operator decision 0.20 — when delivered, it names the Cloud Run target project, Neon instance specs, and domain disposition. Do not start C.2.3 (Neon provision) without this.

## Scope

### C.2.1 — Replit-specific code path audit

**Work.**

- Grep the codebase for `replit`, `REPL_`, `REPLIT_`, `process.env.REPL_*` references.
- Inspect package.json scripts and `.replit` file for Replit-specific config.
- Inspect runtime assumptions: file paths assuming Replit `/home/runner/...`, Replit-injected env vars, Replit secrets handling.
- Inspect build config: does the current build pipeline assume Replit's bundler? Are there Replit-specific bundling steps?

**Output.** A `_research/2026-05-19_replit_decouple_audit.md` doc in legacy-design-tools enumerating every Replit-specific code path with file/line refs and proposed removal plan per item.

**Test.** None at this phase — research only.

### C.2.2 — Remove Replit-specific code paths

Per the C.2.1 audit:

**Work.**

- Remove or generalize each Replit-specific code path. For env vars: switch to Cloud Run's env model. For file paths: parameterize. For build steps: replace with Cloud Run-compatible equivalent.
- The Phase 1A Cloud Run scaffold (build-and-push workflow + canary deploy workflow per the cortex track close-out Phase 7 reference) is already in place — confirm it still works post-removal.
- Update `.replit` file: leave in repo for git history but mark as superseded; do not delete (audit trail). Or delete if no operational reason to keep it; coordinate with planner.

**Test.** Build + typecheck + test workflows pass clean post-removal. Push a `--no-traffic` deploy to staging Cloud Run revision to verify the image runs.

### C.2.3 — New Neon prod instance provisioning

Gated on operator decision 0.20 (specs: region, plan tier, co-tenanted with hauska-engine stack vs separate).

**Work.**

- Provision the new Neon instance per operator specs.
- Apply the current schema from main (via `pnpm --filter @workspace/db run push` against the new instance's URL, mirroring the supervised non-force pattern from the 2026-05-19 Track B IFC apply per the post-merge.sh Neon guard).
- Verify schema parity: `to_regclass` checks for every expected table on the new instance.
- Capture connection string in GCP Secret Manager under the new naming convention.

**Test.** Schema parity check on new instance against current prod. Counts: all expected tables present and matching column shapes.

### C.2.4 — Data migration dry-run

**Work.**

- Snapshot current prod Neon (legacy-design-tools current instance) using `pg_dump` or Neon's native snapshot tooling.
- Restore snapshot to a temporary staging instance — NOT the new prod instance yet.
- Diff staging restore vs source: row counts per table, sample row content, referential integrity verification.
- Capture diff at `_research/2026-05-19_neon_migration_dry_run_diff.md`.
- Identify any drops, transformation steps, or special handling (e.g., sequence resets, materialized view rebuilds).

**Test.** Diff clean (or known-acceptable deltas documented). Dry-run is the rehearsal; production cutover replays it against the real new prod instance.

### C.2.5 — Cutover plan documented in `90_runbooks/`

**Work.**

- Author `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` covering:
  - Pre-cutover checklist (every Lane A, B, C dispatch closed; operator decisions 0.19 + 0.20 closed; staging Cloud Run revision verified; Neon dry-run clean).
  - Cutover steps (Neon snapshot → restore to new prod; Cloud Run traffic shift sequence; DNS / domain swap).
  - Verification probes (six-probe pattern from the BeWith iCal cutover; IFC retry against snapshot `1e01ae34-8062-4dd9-bbeb-f5219db035e4` per the deferred-bug verification gate).
  - Rollback path (Cloud Run traffic flip back; Neon stays bilateral until verification clears).
  - Decommission steps (Replit instance removed only after stable on Cloud Run for an operator-defined verification window).

**Test.** Runbook reads end-to-end as executable; operator can dry-run by reading.

## Critical dispatch-level note

**Do not execute the cutover within this dispatch.** This dispatch ends at C.2.5 — the runbook landed. Actual cutover is a separate operator-led action sequenced after all of Lane A + Lane B + Lane C.1 + C.3 + C.4 land. See sprint Stage 9 verification framing in the decision record.

## Test plan (cross-task)

Per-task as noted. Cross-task: at the end of C.2 work, verify that the legacy-design-tools build runs cleanly on a Cloud Run deploy (staging, no traffic shift), and that the new Neon prod instance accepts the schema cleanly. These two prove the cutover is mechanically ready.

## Dependencies

- **Gates this dispatch:** Lane C.1 closes (you've finished the quick wins); operator decision 0.20 (Cloud Run target + Neon specs) delivered before starting C.2.3.
- **Parallel-safe with:** Lane A (cc-agent-E) and Lane B (cc-agent-M). No code-path overlap.
- **C.2.3 + C.2.4 + C.2.5 are sequential** within this dispatch.
- **Cutover (C.6) gates on:** all of Lane A.1 + A.2 + B + C.1 + C.3 + C.4 closed; operator authorization at runbook trigger.

## Hand-off

Session summary documents all five sub-tasks; explicit "cutover ready / cutover not yet ready" state at close. Planner consumes the readiness signal and coordinates with operator on cutover-trigger timing.

After C.2 closes, your next dispatches in this terminal are [`2026-05-19_cc-agent-C_ui_4_and_engagement_detail_split.md`](2026-05-19_cc-agent-C_ui_4_and_engagement_detail_split.md) (Lane C.3) and [`2026-05-19_cc-agent-C_l_surface_ui.md`](2026-05-19_cc-agent-C_l_surface_ui.md) (Lane C.4). Sequence per planner — likely C.3 starts immediately, C.4 starts as Sync B fires per surface.
