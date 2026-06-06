---
date: 2026-05-30
agent: operator (cente) + cursor-auto session log
repos:
  - legacy-design-tools
  - hauska-brief-extension
topic: property_brief_extension_public_prod_deploy_operator_close
status: prod_live_extension_qa_pending
workstation: cente
gcp_project: legacy-design-tools-prod
related:
  - 2026-05-30_property_brief_extension_public_deploy_session_handoff.md
  - 2026-05-30_legacy-design-tools_cc-agent-C_extension_public_client_key_close.md
  - 2026-05-30_property_brief_qa_fix_wave_index.md
transcripts:
  - ../80_meetings/transcripts/2026-05-forest_forrest_consulting_call_otter.txt
  - ../80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt
---

# Operator close — Property Brief extension public tier prod deploy (2026-05-29/30)

Session log for operator deploy of PR #140 stack to `cortex-api` prod, extension release build, prod smoke, and strategic transcript archive. **API deploy lane complete.** **Chrome extension consumer QA not yet signed off.**

---

## Executive summary

| Lane | Status |
|------|--------|
| Code merged (#138, #139, #140) | **Done** |
| Secret `BROKERAGE_EXTENSION_PUBLIC_KEY` v2 in SM | **Done** (v1 junk — disable when convenient) |
| Cloud Run prod revision with public + dev + Grok + Regrid | **Done** — `cortex-api-00119-laq` |
| Traffic 100% on good revision | **Done** — `gcloud run services update-traffic --to-tags=canary=100` |
| Prod smoke (public key, Round Rock) | **PASS** |
| Canary smoke (Plano negative) | **PASS** (403 `jurisdiction_not_available`) |
| Extension `build-release.ps1` | **Done** — public key injected |
| Extension manual QA (Zillow, zero-config) | **Pending** — QuotaBytes + override-key confusion |
| Workflow fix (deploy-canary includes brokerage secrets) | **Not done** — manual gcloud patch required after each deploy-canary |

---

## Merged code (main)

| PR | Title | Notes |
|----|-------|-------|
| [#138](https://github.com/empressaioemail-tech/legacy-design-tools/pull/138) | Brief API slim + workspaceId | Strips layer payloads for extension |
| [#139](https://github.com/empressaioemail-tech/legacy-design-tools/pull/139) | brief-coverage.html lazy load | Cloud Run boot fix |
| [#140](https://github.com/empressaioemail-tech/legacy-design-tools/pull/140) | Extension public client key | Merge SHA `a17b38ae` |

---

## Prod Cloud Run (final)

| Field | Value |
|-------|-------|
| Service | `cortex-api` |
| Region | `us-central1` |
| Prod URL | `https://cortex-api-tds7av26va-uc.a.run.app` |
| **Serving revision** | `cortex-api-00119-laq` (100%) |
| Image | `apps/cortex-api@sha256:e7df2b6c…` (post-#140) |

### Env / secrets on serving revision

| Name | Source |
|------|--------|
| `BROKERAGE_EXTENSION_PUBLIC_KEY` | Secret Manager `latest` (v2, 56 chars) |
| `BROKERAGE_DEV_API_KEY` | Plain env (from old `00073-57r`) |
| `REGRID_API_KEY` | Secret Manager |
| `XAI_API_KEY` | Secret Manager |
| `BRIEFING_LLM_MODE` | `grok` |
| `BROKERAGE_WALLET_*` | Config env vars |
| `CANARY_SECRET_ROLL` | `20260529v5` (operator bump marker) |

**Secret name only in git.** Key value in password manager + SM v2 — operator confirmed stored OOB.

---

## Operator deploy timeline (lessons)

### Problem pattern

GitHub **`deploy-canary`** (workflow #167, #170) runs baseline template only — **no brokerage secrets**, `BRIEFING_LLM_MODE=mock`. Operator repeatedly ran `deploy-canary` thinking it was promote; canary tag moved to broken revisions (`00112`, `00114`, `00118`).

### Recovery pattern (canonical)

```powershell
# 1. Patch canary (PowerShell on cente — NOT Cloud Shell bash)
$devKey = (
  gcloud run revisions describe cortex-api-00116-vih `
    --region=us-central1 --project=legacy-design-tools-prod --format=json |
  ConvertFrom-Json
).spec.containers[0].env | Where-Object { $_.name -eq "BROKERAGE_DEV_API_KEY" } |
  Select-Object -ExpandProperty value

gcloud run services update cortex-api `
  --region=us-central1 --project=legacy-design-tools-prod `
  --no-traffic --tag=canary `
  --update-secrets=BROKERAGE_EXTENSION_PUBLIC_KEY=BROKERAGE_EXTENSION_PUBLIC_KEY:latest,REGRID_API_KEY=REGRID_API_KEY:latest,XAI_API_KEY=XAI_API_KEY:latest `
  --update-env-vars=BRIEFING_LLM_MODE=grok,BROKERAGE_WALLET_START_BALANCE_CENTS=1000,BROKERAGE_WALLET_BYPASS=false,BROKERAGE_TOP_UP_INCREMENT_CENTS=500,BROKERAGE_COMPUTE_COST_CENTS=100,BROKERAGE_DEV_API_KEY=$devKey,CANARY_SECRET_ROLL=<version>

# 2. Smoke canary → 401 no-auth; Round Rock 200 extension_public

# 3. Promote
gcloud run services update-traffic cortex-api `
  --region=us-central1 --project=legacy-design-tools-prod `
  --to-tags=canary=100
```

### Secret v1 pitfall

First SM version was ~2 chars (whitespace). Cloud Run mounted but app saw empty key → **503** `property_brief_api_unconfigured`. Fix: add v2 via file write (no trailing newline), roll new revision.

### Shell discipline

| Shell | Use |
|-------|-----|
| **Windows PowerShell** | All `gcloud.cmd` + backtick continuations |
| **Cloud Shell bash** | Different syntax — do not paste PowerShell |
| **GitHub Actions** | `shift-traffic` only — not `deploy-canary` for promote |

---

## Smoke results (confirmed 2026-05-30)

### Prod (default URL, public key from SM)

```
POST https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/brief
Address: 1904 Heathwood Cir, Round Rock, TX 78664

jurisdiction:  round_rock_tx
clientTier:      extension_public
```

### Canary / negative

```
Address: 5800 Legacy Dr, Plano, TX 75024
→ 403 jurisdiction_not_available, clientTier: extension_public
```

### Known gap (not blocking auth)

Regrid parcel/zoning layers: `no-coverage` from archive on Round Rock smokes → lay summary “zoning not available.”

---

## Extension (hauska-brief-extension)

| Item | Status |
|------|--------|
| Release build | `.\scripts\build-release.ps1` with `HAUSKA_EXTENSION_PUBLIC_KEY` from SM — **OK** |
| Key baked into | `dist/background.js`, `src/content/content-bundle.js`, etc. |
| Load path | Unpacked from `P:\hauska-brief-extension` (repo root) |
| Options override | User had dev key filled during 401 window — **clear for consumer QA** |

### QA issues observed (not closed)

| Issue | Mitigation |
|-------|------------|
| `QuotaBytes quota exceeded` | Remove extension + reinstall OR `chrome.storage.local.clear()` |
| Override key appears required | Leave Advanced key blank; baked public key used |
| “Building reasoning summary…” | Refresh Zillow after extension reload |

### Follow-up code (next session)

- Slim `reasoningSummary` / `laySummary` in `src/lib/brief-storage.js`
- Options copy: “Leave blank for Chrome Web Store builds”

---

## Transcripts archived

| Meeting | Path |
|---------|------|
| Forrest — consulting / jurisdiction GTM | `doc_repo/80_meetings/transcripts/2026-05-forest_forrest_consulting_call_otter.txt` |
| ICC — Ed Saler API licensing / POC | `doc_repo/80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt` |

Strategic synthesis: see [`2026-05-30_property_brief_extension_public_deploy_session_handoff.md`](2026-05-30_property_brief_extension_public_deploy_session_handoff.md) §6–7 (ICC, Cotality, Forrest).

---

## Operator checklist (final)

- [x] Merge #138, #139, #140
- [x] Create `BROKERAGE_EXTENSION_PUBLIC_KEY` SM v2
- [x] Mount secrets + Grok on canary revision
- [x] Canary smoke Round Rock + Plano
- [x] `update-traffic --to-tags=canary=100`
- [x] Prod smoke public tier
- [x] Extension release build
- [x] Archive transcripts to doc_repo
- [x] Store public key OOB (password manager)
- [ ] Disable SM secret v1
- [ ] Clean extension QA (zero-config, no QuotaBytes)
- [ ] Workflow PR: brokerage secrets on deploy-canary
- [ ] Chrome Web Store upload (after QA pass)

---

## Pickup (next session)

1. Open [`2026-05-30_property_brief_extension_public_deploy_session_handoff.md`](2026-05-30_property_brief_extension_public_deploy_session_handoff.md)
2. Extension QA §5B (clean install, no override key)
3. Regrid no-coverage debug
4. Cotality / ICC research spikes per handoff §11

---

*Logged 2026-05-30. Prod live on `00119-laq`. Extension public tier verified via API; consumer Chrome QA remains open.*
