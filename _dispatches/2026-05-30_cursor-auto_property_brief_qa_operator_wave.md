---
id: 2026-05-30_cursor-auto_property_brief_qa_operator_wave
title: Dispatch — Property Brief QA operator wave (deploy + smoke + checklist)
date: 2026-05-30
agent: cursor-auto
repo: doc_repo
kind: dispatch
related: [2026-05-30_property_brief_qa_fix_wave_index, 90_runbooks/property_brief_cortex_deploy, 90_runbooks/property_brief_neon_warmup.ps1, 75b_brief_coverage_v0]
blocked_on: cc-agent-C PR merge + cortex-api deploy; extension-agent v0.6.4 build for final QA pass
---

# Operator wave — deploy, smoke, QA checklist

You are **cursor-auto** on `P:\doc_repo` and operator tooling. **No product feature code** in legacy-design-tools or hauska-brief-extension — runbooks, inbox artifacts, snapshot updates only.

## Model (HR-12)

**grok-code-fast-1** for scripts/checklists; escalate for deploy failures.

## Goal

Automate operator steps after agent PRs merge so Nick runs one checklist, not ad-hoc curls.

---

## Task 1 — Pre-deploy gate script

Create `90_runbooks/property_brief_qa_preflight.ps1`:

1. Read `BROKERAGE_DEV_API_KEY` + `DEPLOYMENT_DATABASE_URL` from GCP (reuse `_PropertyBriefGcloudHelpers.ps1`)
2. Hit `GET /api/brokerage/v1/wallet` with install header — expect 200
3. Hit `POST /api/brokerage/v1/brief` for `1904 Heathwood Cir, Round Rock, TX 78664`:
   - Assert `corpusStatus` in `in_corpus`, `partial`
   - Assert `workspaceId` present (after cc-agent-C ships)
   - Assert response JSON length under 500KB (slim check)
4. Exit non-zero with readable errors

Parameters: `-Auto`, `-BriefApiUrl`, `-RequireWorkspaceId`

---

## Task 2 — REGRID mount verification

Extend preflight or document in runbook:

```powershell
gcloud run services describe cortex-api --region us-central1 --format="yaml(spec.template.spec.containers[0].env)"
```

Assert `REGRID_API_KEY` mounted. If missing, print exact `gcloud run services update` command (no secret values in output).

Re-run brief smoke; log whether `regrid-parcel` layer status is `ok`.

---

## Task 3 — QA checklist artifact

Write `_inbox/2026-05-30_property_brief_manual_qa_checklist.md`:

| # | Step | Pass criteria |
|---|------|---------------|
| 1 | Load extension v0.6.4 unpacked | Version in manifest |
| 2 | Options: prod API URL + dev key | Preflight script green |
| 3 | Round Rock listing — Run brief | Verdicts not all UNKNOWN; no quota error |
| 4 | Listing panel | Narrative visible under At a glance |
| 5 | Deep research — ADU chip | Round Rock citations, not Bastrop |
| 6 | Share | Link copies; opens shared workspace read-only in incognito |
| 7 | Pflugerville listing | `no_match`; honest copy; no Bastrop ADU |
| 8 | Five briefs same session | No storage quota error |

Include test addresses and Zillow URL patterns from wave index.

---

## Task 4 — Post-deploy doc sync

After operator confirms deploy:

1. Bump `last_updated` on `75b_brief_coverage_v0.md` if not done by cc-agent-C
2. Regenerate `00_current_state.md` per `90_runbooks/current_state_protocol.md` — Property Brief QA wave status
3. File inbox close for this dispatch

---

## Task 5 — Optional: extension reload helper

One-liner doc in checklist: after loading unpacked v0.6.4, run `chrome://extensions` → Reload → refresh all Zillow tabs (fixes "Extension updated — refresh page").

---

## Out of scope

- Merging agent PRs (operator)
- Chrome Web Store publish
- Partner outreach (Pflugerville General Code)

---

## Acceptance criteria

- [ ] `property_brief_qa_preflight.ps1` runs green against prod post-deploy
- [ ] Manual QA checklist committed to `_inbox/`
- [ ] `00_current_state.md` reflects wave status
- [ ] Inbox close with verbatim preflight output

## Report back

`P:/doc_repo/_inbox/2026-05-30_doc_repo_cursor-auto_property_brief_qa_operator_wave_close.md`
