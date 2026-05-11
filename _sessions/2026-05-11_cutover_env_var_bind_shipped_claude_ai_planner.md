---
id: 2026-05-11_cutover_env_var_bind_shipped
title: Session — 2026-05-11 cutover env var bind shipped (planner session 2 of 2)
date: 2026-05-11
agent: claude_ai_planner
repo: doc_repo
session_type: planning
---

# Session — 2026-05-11 cutover env var bind shipped

Second planner session of 2026-05-11. Picked up from the post-A.8/A.6/A.7-ship handoff and executed the cutover env-var bind that was flagged as session-one's discovery.

## Inputs

- Handoff doc from prior 2026-05-11 session (session 1 of 2 — A.8/A.6/A.7 ship + env-var audit)
- Targeted courier readout of `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`
- Targeted courier readout of `90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`
- Nick's `smartcity_secrets` txt file: 24 vars sourced from Replit's old vault, all pre-rotation, all known-good-pre-cutover
- Three screenshots of Replit secret panel (Spireon ×6, Power BI ×5)

## Outputs

- 18 secrets bound to Cloud Run smartcity-api via gcloud Secret Manager with `smartcity-` prefix convention
- New revision `smartcity-api-00085-pvd`, 100% traffic on LATEST
- MYGOV pre-existing Secret Manager debris remediated (v3 version-adds + IAM grants)
- Verified live via Cloud Run logs: Spireon (21 vehicles, authenticated), OpenGov BNP (healthy, cache warm), MyGov (12,240 permits)
- Bind script template (`bind_smartcity_secrets.sh`) captured in new runbook
- New runbook: `90_runbooks/cutover_env_var_bind_procedure.md`

## Decisions

- **Skip 6 already-bound vars** (POWERBI×5 + OPENGOV_API_KEY). These were currently working per audit; overwriting with Replit values would risk breaking known-good state for marginal upside. Nick removed them from `smartcity_secrets` before execute.
- **Bundle Track A (11 silent drops) + Track B Spireon (6 vars) in one dispatch.** Per Nick's answer that Replit values worked pre-cutover, Spireon Track B doesn't actually require waiting on Solera — the rotation-pending classification was conservative. Bind worked; if Solera does eventually rotate, swap is trivial.
- **Defer OPENGOV_TRANSPARENCY_KEY.** Nick couldn't locate the value in Replit's vault. Integration `/opengov` transparency tables stays dark until value is found via vendor portal lookup.
- **Defer AI_INTEGRATIONS_* code rename.** Separate surface (TypeScript in smartcity-os, not config), different review path, ~10 LoC. Drafted as next-session work.
- **Cloud Shell execution path, not Nick-box gcloud.** The Phase 2A gcloud SSL prereq on Nick's box is still unresolved, and Cloud Shell upload + script + script execution gave clean isolation: secret values never touched a Cursor agent context or this conversation.
- **For MYGOV pre-existing debris: version-add Nick's values as v3 + grant IAM, then main bind.** Existing v1/v2 from 2026-04-04/05 had unknown provenance. Version-add preserves rollback path (v1/v2 remain in history) while putting known-good values as `:latest`.
- **No version-add to the 2 EXISTS in the main script run.** The script's existing-secret skip-guard is correct for the general case; the MYGOV special-case was handled manually before invoking `--execute`.

## Lessons / patterns

- **Audit-doc gap: code-references vs Secret Manager state.** The audit runbook (`90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`) classified MYGOV_USERNAME/PASSWORD as "unbound", because it checked which env names code reads vs which are referenced in the Cloud Run service spec. It did NOT enumerate existing Secret Manager secrets. As a result, the audit missed that both secrets already existed (created 2026-04-04, updated 2026-04-05, never wired to Cloud Run). Future env-var audits must also run `gcloud secrets list --filter="name~smartcity-"` and reconcile against expected inventory.
- **Bind procedure pattern (dry-run gate + per-var IAM + bulk Cloud Run update) worked cleanly.** Captured in the new runbook. Pattern is reusable for future cutovers, secret rotations, or new-integration onboarding.
- **Two-signal verification was blocked by 401 on `/api/spireon/health` (anonymous curl).** Cloud Run logs were the workaround and gave better signal than the health endpoint would have — actual init messages, vehicle counts, authentication confirmation. Logs-based verification should be in the default toolkit for any auth-protected integration.
- **Unresolved revision-suffix contradiction across docs.** Session 1's handoff at end of 2026-05-11 named yesterday's deploy `smartcity-api-00084-vhr`. Today's `gcloud run services describe` showed `smartcity-api-00084-weg` tagged with `w1-c-4a-auth-fix` and serving 0% traffic. The 2026-05-11 deploy drift postmortem labels `00084-weg` as the May-10 W1.C.4a auth-fix revision that was stranded at 100% via the `w1-c-4a-auth-fix` tag, then unpinned via `--to-latest`. Cloud Run revision suffixes are unique per revision number, so at least one of these three references is wrong. No resolution attempted this session — establishing ground truth requires a full `gcloud run revisions list --service=smartcity-api --region=us-central1 --limit=30 --format="table(name,active,creationTimestamp)"` and reconciliation against the deploy-event narratives in session 1's summary and the deploy drift postmortem. Until that's done, no historical doc rewriting. Lesson: HR-8 verbatim discipline applies to handoff drafting too — paste `gcloud` output rather than narrate revision suffixes from memory.
- **`smartcity_secrets.txt` extension after Cloud Shell upload.** Drag-drop and UI upload preserve the source filename including extension. Either rename post-upload or use the full path in subsequent commands. Trivial but cost a turn this session.
- **Cleanup discipline: `shred -u` on the secrets file in Cloud Shell.** Cloud Shell home dirs persist across sessions; values would otherwise stay accessible. Captured in the bind procedure runbook.

## Outstanding from this session

- **OPENGOV_TRANSPARENCY_KEY** — still missing. `/opengov` transparency tables remain dark. Vendor-portal lookup next time Nick is in OpenGov admin.
- **AI_INTEGRATIONS_* code rename** — queued. ~10 LoC in `server/lib/anthropic.ts`, `server/replit_integrations/{image,audio}/client.ts`. Two options per audit runbook: rename code to read `ANTHROPIC_API_KEY` direct (drops Replit-era prefix), or add the prefixed names to Cloud Run env. Lean is rename code.
- **SAMSARA_API_TOKEN ↔ smartcity-SAMSARA_API_KEY naming normalization** — pending. Functionally fine, lexically confusing.
- **smartcity-NODE_ENV and smartcity-MYGOV_BASE_URL move-out-of-Secret-Manager** — pending. Postmortem prescription; not yet executed.
- **Power BI showing "off" despite bound secrets** — Nick flagged this for next session. Specific widget/page surfacing the "off" status needs identification, then endpoint/status logic trace.
- **Calendar dashboard "day of events" treatment** — Nick wants events shown rather than dropped on the main dashboard calendar. Next-session frontend work.
- **Manual UI probes for the remaining 14 vars** — Google OAuth, Resend transactional, admin reset, Pipedrive sync, USER_RESET_* — not yet verified beyond log presence. Nick can verify async; if any are broken, surfaces in next session.
- **Workspace hygiene runbook** — still at incident #4 with no runbook yet. Promoted to next-up but not landed.
- **Cutover env-var audit runbook** (forward-looking checklist for future cutovers) — pending; this session's MYGOV debris finding is good source material.

## References

- Bind script: see `90_runbooks/cutover_env_var_bind_procedure.md`
- Revision: `smartcity-api-00085-pvd` (deployed 2026-05-11)
- Image digest: not captured this session (Cloud Run handled rebuild as part of `--update-secrets`)
- Verified integrations: Spireon `/api/spireon/health 200 :: connected:true`, OpenGov `/api/opengov/health 200 :: healthy`, MyGov `/api/mygov/permits 200 :: 12240 permits`
