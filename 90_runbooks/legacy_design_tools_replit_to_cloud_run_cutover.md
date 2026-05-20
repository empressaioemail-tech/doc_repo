---
id: legacy_design_tools_replit_to_cloud_run_cutover
title: legacy-design-tools Replit to Cloud Run cutover runbook
status: active
last_updated: 2026-05-19
applies_to: design-accelerator
related: [00_current_state, 40_design_accelerator, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/agent_workspace_hygiene, 91_postmortems/2026-05-19_calendar_tenant_id_silent_outage, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, _dispatches/2026-05-19_cc-agent-C_replit_decouple]
---

# legacy-design-tools Replit to Cloud Run cutover

> **Operational runbook.** Executes the legacy-design-tools production cutover from Replit autoscale to Cloud Run with a fresh Neon prod instance. Operator-driven, multi-stage, with explicit pause gates. Proceed past a gate only on an explicit go.

This runbook is the canonical placement of cc-agent-C's C.2.5 draft from Lane C.2 of the 2026-05-19 combined Cortex/Codex sprint. The working draft lived at `legacy-design-tools/_research/2026-05-19_c_2_5_cutover_runbook_draft.md` per the workspace-hygiene rule that cross-repo writes route through the planner. Relocated to this path with canonical frontmatter and minor enhancements to the verification pattern. See [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) Sprint Amendment 4 for the Decision 0.20 production-domain correction context.

## Cutover model

- **Compute:** Replit autoscale at `prompt-agent-accelerator.replit.app` becomes Cloud Run `cortex-api` (smartcity-os GCP project, `us-central1`).
- **Data:** current Replit-side Neon becomes new `cortex-prod` Neon (Scale tier, `us-central1`, separate Neon project from hauska-engine substrate).
- **Domain:** `cortex.empressa.io` points at `cortex-api`. The old `prompt-agent-accelerator.replit.app` URL is retired, not redirected, since `*.replit.app` is Replit-owned DNS and cannot be CNAME-swapped (Decision 0.20 Amendment 4).
- **Fallback:** the Replit instance plus its Neon stay live and untouched through the verification window. Rollback is a traffic / DNS flip back to the still-live Replit serving path. Replit-side Neon was never modified during the cutover (Stages 1-5).

## Stage 0. Pre-cutover gate (HARD checklist)

Do not start Stage 1 until every box is checked.

- [ ] **All blocking lanes closed.** Per the sprint decision record's cutover dependency, Lane A.1 and A.2 closed, Lane B closed, Lane C.1 closed, Lane C.3 closed, Lane C.4 closed. Decisions 0.19 and 0.20 closed.
- [ ] **C.2.3 done.** `cortex-api` GCP substrate provisioned in the smartcity-os project. `cortex-prod` Neon (Scale tier with pgvector) exists with `main` schema applied. All four C.2.3 parity checks (per the legacy-design-tools `_research/2026-05-19_c_2_3_neon_provisioning.md` doc) pass. Secret Manager seeded with rotated values.
- [ ] **C.2.4 done.** Migration dry-run completed against a staging instance. Diff doc clean, or deltas documented as known-acceptable. Special-handling list finalized (per legacy-design-tools `_research/2026-05-19_c_2_4_migration_dry_run.md`).
- [ ] **Staging Cloud Run revision verified.** A `--no-traffic` `deploy-canary` workflow run of `cortex-api` ran clean. `https://canary---<host>/api/healthz` returns 200.
- [ ] **`cortex.empressa.io` is ready** (the hard domain gate per Decision 0.20 Amendment 4):
  - [ ] DNS record for `cortex.empressa.io` exists and resolves.
  - [ ] Mapped to the `cortex-api` Cloud Run service via `gcloud beta run domain-mappings create --service=cortex-api --domain=cortex.empressa.io --region=us-central1`. Mapping reports `Ready`.
  - [ ] TLS certificate for `cortex.empressa.io` is provisioned and valid. Confirm with `curl -sI https://cortex.empressa.io/api/healthz` (TLS negotiates cleanly).
  - [ ] `PUBLIC_BASE_URL=https://cortex.empressa.io` is set on the `cortex-api` service env.
- [ ] **L-surface bearer-auth env vars set** (added per Sprint Amendment 8; required for MCP↔legacy bearer path to work):
  - [ ] `SERVICE_API_KEY` set on the `cortex-api` Cloud Run service. Value must equal the MCP server's `LEGACY_BACKEND_API_KEY` — the L-routes' bearer middleware validates against this; mismatch returns 401 on every L-surface MCP tool call. Production fail-closed: if `SERVICE_API_KEY` is unset, `getServiceApiKey()` throws at startup.
  - [ ] `LEGACY_BACKEND_API_KEY` on the Hauska MCP Server Cloud Run service matches the value above.
- [ ] **L5 ICC-ES URL template set** (added per Sprint Amendment 8; operator-tunable per PR #51 note 5):
  - [ ] `ICC_ES_REPORT_URL_TEMPLATE` env var set on `cortex-api`. Default template format documented in legacy-design-tools `lib/icc-es/`. L5 `product-spec-reference` refresh uses this; status parser returns `null` rather than guessing when the URL doesn't resolve.
- [ ] **Backup tag** on `origin/main` of legacy-design-tools: `git tag backup/pre-cutover-$(date +%Y%m%d) origin/main && git push origin --tags`.
- [ ] **Operator availability.** A verification window is scheduled. The operator can watch logs and roll back for its duration.
- [ ] **gcloud account** is the smartcity-os admin account, not the workstation-default smartcity service account.
- [ ] **psql and pg_dump clients installed** on the operator workstation (Phase-1B prereq gating Stage 1 / Stage 2 commands).

**GATE 0.** Operator go to begin the cutover.

## Stage 1. Quiesce + final data snapshot

The C.2.4 dry-run rehearsed this. Stage 1 runs it in production-mode against the current Replit-side Neon, producing the snapshot loaded into `cortex-prod` in Stage 2.

1. **Reduce write churn.** legacy-design-tools has no formal maintenance mode. Minimize in-flight writes by avoiding briefing / finding / IFC runs during the window. If practical, briefly pause the Replit instance's background sweepers. A short write-quiet window keeps the snapshot consistent and avoids the C.2.4 known-acceptable drift on append-heavy tables.
2. **Snapshot the current prod Neon** against the direct (non-pooler) endpoint:

   ```bash
   pg_dump "$REPLIT_NEON_DIRECT_URL" --format=custom \
     --no-owner --no-privileges \
     --file=/tmp/cortex-cutover/prod.dump
   ```

3. **Capture source row counts** per table for the post-load diff (per C.2.4 procedure section 4b).

**GATE 1.** Snapshot captured plus counts recorded. Operator go.

## Stage 2. Load data into cortex-prod

1. `cortex-prod` already has the `main` schema (per C.2.3 step B3). For a clean data load, restore into the schema-only instance:

   ```bash
   psql "$CORTEX_PROD_DIRECT_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;"  # idempotent
   pg_restore --dbname="$CORTEX_PROD_DIRECT_URL" \
     --no-owner --no-privileges --jobs=4 --exit-on-error \
     --data-only \
     /tmp/cortex-cutover/prod.dump
   ```

   The `--data-only` flag works because the schema is already present from C.2.3 and rows load into it. If a constraint-ordering error surfaces, fall back to a full restore into a freshly-reset `cortex-prod` database. The C.2.4 dry-run determines which path is needed and the special-handling list records it.
2. **Apply special handling** from the C.2.4 procedure section 5 list. `REFRESH MATERIALIZED VIEW` for any materialized views. Sequence-position fixes if any.
3. **Post-load parity diff.** Re-run the C.2.4 section 4 procedure (row counts, FK integrity, content md5 sample) source-versus-`cortex-prod`. Must be clean.

**GATE 2.** `cortex-prod` data parity verified. Operator go.

## Stage 3. Deploy + traffic shift to cortex-api

`cortex-prod` now has schema plus data. `DEPLOYMENT_DATABASE_URL` on the `cortex-api` service env points at it.

1. **Deploy the cutover revision.** Trigger `deploy-canary` (workflow_dispatch) with the `main`-SHA image tag. It creates a new `cortex-api` revision tagged `canary` at 0% default traffic.
2. **Smoke the canary tag URL** with no production traffic yet:

   ```bash
   curl -s -o /dev/null -w '%{http_code}' https://canary---<host>/api/healthz
   ```

   Expect 200.
3. **Traffic shift**, per the smartcity-os canary pattern at [`90_runbooks/cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md). Staged, with the Stage 4 probes between each step:

   ```bash
   gcloud run services update-traffic cortex-api --region=us-central1 \
     --to-revisions=<new-rev>=10
   # observe + Stage 4 probes. If clean:
   gcloud run services update-traffic cortex-api --region=us-central1 \
     --to-revisions=<new-rev>=50
   # observe + Stage 4 probes. If clean:
   gcloud run services update-traffic cortex-api --region=us-central1 \
     --to-revisions=<new-rev>=100
   ```

4. The `cortex.empressa.io` domain mapping already points at `cortex-api` (per Stage 0). Once traffic is 100% on the new revision, `https://cortex.empressa.io` serves the cutover build end-to-end.

**GATE 3.** 100% traffic on the cutover revision. Operator go to verification.

## Stage 4. Six-probe verification

Run after each traffic step in Stage 3, and a full pass at 100%. Any probe failure halts and triggers rollback per Stage 6.

Pattern modeled on the BeWith iCal cutover six-probe matrix at [`91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md`](../91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md) Resolution section. The lineage is the same: positive functional verification plus state-verification plus invariant-preservation, adapted to this cutover's specific invariants (compute substrate, database substrate, SPA serve path, object storage, write integrity, deferred-bug verification gate) rather than the iCal-feed authentication invariants the BeWith probes verified.

1. **Probe 1. API liveness.** `GET https://cortex.empressa.io/api/healthz` returns 200.
2. **Probe 2. DB read path.** `GET /api/engagements` returns 200 with the engagement list. Proves `cortex-api` to `cortex-prod` Neon connectivity end-to-end.
3. **Probe 3. SPA serving.** `GET https://cortex.empressa.io/` returns the design-tools index.html. `GET /plan-review/` and `GET /qa/` return their index.html. One deep client-side route under each (for example `/engagements/test-id`) returns the index.html for client-side routing. Proves PR #39's `mountSpaStatic` path.
4. **Probe 4. Object storage.** Exercise an object read by loading an engagement with a stored sheet or GLB. Asset resolves. Proves PR #38's Cloud Run ADC path plus signed URLs. Confirms the runtime service account's `signBlob` self-grant.
5. **Probe 5. Write path.** A low-risk write commits to `cortex-prod`. Create a test engagement, or a reviewer action. Verify the write lands in the new Neon, not the Replit-side Neon.
6. **Probe 6. Deferred IFC import bug gate.** Re-run the IFC import that the 2026-05-19 cortex-track close-out deferred to post-cutover. Re-ingest IFC against snapshot `1e01ae34-8062-4dd9-bbeb-f5219db035e4`. The bet behind deferring this bug was that a clean Cloud Run plus fresh Neon environment either surfaces the real root cause or self-resolves a Replit-environment-induced symptom. Record the outcome:
   - Import succeeds. The bug was Replit-environment-induced. Close it.
   - Import still fails. The bug is real and environment-independent. File it with the now-clean Cloud Run logs (better diagnostics than Replit autoscale gave). Does NOT block the cutover. The import path was already broken pre-cutover; cutover does not regress it.

**GATE 4.** All six probes pass. Probe 6 may pass or be documented-as-real-and-now-debuggable. Operator go to the verification window.

## Stage 5. Verification window

Hold for an operator-defined window (suggest 24 to 48 hours of real usage minimum) with `cortex-api` at 100%.

The Replit instance plus its Neon stay live and untouched. The rollback path stays open the entire window per the "bilateral until verification clears" principle.

Active monitoring during the window:

- Cloud Run logs for error spikes (filter `severity>=ERROR` on the `cortex-api` service).
- The `cortex-api-runtime` service account audit log for permission denials.
- Latency regressions versus the Replit baseline. If you have a synthetic monitor or load probe, watch p95 / p99.
- Object storage failures. The signed-URL path is new; watch for 403s or expired-signature errors.
- Any partner subscriber breakage. External subscribers to legacy-design-tools URLs (if any) hit the dead `prompt-agent-accelerator.replit.app` after DNS retirement. Catalog any such reports for follow-up communication.

**GATE 5.** Verification window elapsed clean. Operator go to decommission.

## Stage 6. Rollback (if any gate fails)

Rollback is fast and non-destructive while the Replit side is still live.

1. **Traffic.** Flip Cloud Run traffic back to the last-good revision:

   ```bash
   gcloud run services update-traffic cortex-api --region=us-central1 \
     --to-revisions=<previous-rev>=100
   ```

   If the issue is `cortex-api`-wide rather than revision-specific, repoint `cortex.empressa.io`'s DNS or temporarily use the still-live Replit instance as the serving path.
2. **Data.** The Replit-side Neon was never modified. It stayed live and authoritative through Stages 1 to 5 per the bilateral-until-verification-clears principle. Rolling back compute automatically rolls back to it. Any writes that landed on `cortex-prod` during the failed window are forward-only. If rollback happens, reconcile or discard them per the operator's call. The verification window is deliberately short to keep this set small.
3. Diagnose from Cloud Run logs. Fix forward. Re-attempt from the appropriate stage.

## Stage 7. Decommission (post-verification, operator-gated)

Only after GATE 5.

1. **Retire the Replit platform config.** Folded from C.2.2 PR6 (audit items T1.3, T1.4, T2.3, T2.5, T3.4). These execute at decommission, not before, because they configure the live Replit fallback which must stay functional through Stage 5. As one commit:
   - Delete `.replit`, `replit.nix`, `replit.md`, `artifacts/api-server/.replit-artifact/`.
   - Remove the `scripts/post-merge.sh` Replit `[postMerge]` trigger coupling. The script's schema-apply plus backfills are superseded (backfills are one-shot idempotent and have already run; schema apply is now a deliberate operator step per the Fire 3 Neon-guard pattern at [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](../91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md)). Delete `post-merge.sh` or strip it to a no-op. It has no off-Replit trigger.
   - The `SNAPSHOT_SECRET` plaintext dies with `.replit`. Confirm the rotated value lives only in Secret Manager (per C.2.3 procedure section B6). Carry-forward: audit could not find a runtime consumer for `SNAPSHOT_SECRET` (flagged by cc-agent-C); confirm whether to retain in Secret Manager or remove entirely.
2. **Stop / delete the Replit deployment** `prompt-agent-accelerator.replit.app`. The URL stops resolving (expected per Decision 0.20 Amendment 4 since no redirect is possible for a `*.replit.app` subdomain).
3. **Replit-side Neon.** Keep as a cold backup for an operator-defined retention period. Then delete.
4. **`docs/deploy.md` rewrite** in legacy-design-tools (audit T1.6). Update for `cortex-api` in the smartcity-os project, the `cortex-prod` Neon, and the single-service SPA static-serve. May be done earlier; it is documentation, not a live-environment dependency.
5. **Post-cutover code cleanup** as a fast-follow PR in legacy-design-tools. Drop the `K_SERVICE`-gated Replit branches in `objectStorage.ts` (the sidecar path) now that no environment needs them. Drop `REPLIT_SIDECAR_ENDPOINT`.

**GATE 7.** Decommission complete. Lane C.2 plus the cutover close. Update [`00_current_state.md`](../00_current_state.md) and [`40_design_accelerator.md`](../40_design_accelerator.md) to reflect production-on-Cloud-Run state.

## Open items to confirm before this runbook is executed

These are operator-side carry-forward items cc-agent-C surfaced during draft authoring. Each needs a decision or confirmation before Stage 0 gates clear.

- **Object-storage bucket strategy** (per C.2.3 procedure section A6). Two options: reuse the existing GCS bucket (no object-byte migration; lighter cutover) versus a new bucket (cleaner separation; needs a `gcloud storage rsync` step added to Stage 2). Confirm bucket ownership. Operator decision.
- **`--data-only` versus full restore** at Stage 2. The C.2.4 dry-run determines which restore path is clean. Lock the choice in the special-handling list before Stage 0.
- **Materialized views** (per C.2.4 procedure section 5). If the dry-run finds any, add the explicit `REFRESH MATERIALIZED VIEW` calls to Stage 2.
- **`SNAPSHOT_SECRET` rotation** before Secret Manager seeding (per Stage 7 step 1). cc-agent-C's audit could not find a runtime consumer; confirm whether the secret is dead-weight (remove) or has a consumer the audit missed (rotate to a fresh value and seed). Either way, do not seed the committed plaintext value to Secret Manager.

## Cross-references

- [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint decision record including Sprint Amendments 4 (Decision 0.20 Replit-DNS impossibility correction) and 5 (workspace-hygiene rule that routed this runbook through the planner).
- [`_dispatches/2026-05-19_cc-agent-C_replit_decouple.md`](../_dispatches/2026-05-19_cc-agent-C_replit_decouple.md) — Lane C.2 dispatch.
- [`90_runbooks/cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md) — canonical canary deploy pattern this cutover follows.
- [`90_runbooks/agent_workspace_hygiene.md`](agent_workspace_hygiene.md) — workspace-hygiene runbook explaining why C.2.5 drafted in legacy-design-tools and the planner relocated it here.
- [`91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md`](../91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md) — BeWith iCal cutover postmortem; Resolution section carries the original six-probe verification matrix that Stage 4 here adapts.
- [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](../91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md) — drift / traffic-pin postmortem informing the post-merge.sh decommission step.
- [`40_design_accelerator.md`](../40_design_accelerator.md) — production target documentation; update after GATE 7 to reflect Cloud Run state.
- legacy-design-tools `_research/2026-05-19_c_2_3_neon_provisioning.md` — operational recipe for Neon provisioning (legacy-design-tools-local).
- legacy-design-tools `_research/2026-05-19_c_2_4_migration_dry_run.md` — operational recipe for the migration dry-run (legacy-design-tools-local).
- legacy-design-tools `_research/2026-05-19_replit_decouple_audit.md` — pre-removal audit doc (legacy-design-tools-local).
