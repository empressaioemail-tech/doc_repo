---
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.13
dispatch: 2026-06-17_extension-agent_brief_failure_state_and_attachment_upload
status: verified on prod — commit 7ec2098+ → v0.6.13
---

# Close — brief failure terminal state + PB-301 attachment presign (v0.6.13)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.13** |
| **Prod API** | `https://cortex-api-tds7av26va-uc.a.run.app` (cc-agent-C national-baseline live) |
| **Branch** | `extension/unified-signin-v067` |

## Post-deploy prod verification (2026-06-17)

### Brief scenarios (`node scripts/verify-national-baseline.mjs`)

| Address | Expected | Prod result |
|---------|----------|-------------|
| **17003 Simsbrook Dr, Pflugerville, TX 78660** | 200 + websearch banner | **PASS** — `localCodeSource=websearch`, `coverage.degraded=true`, reason: *Local code from web search — unverified, web-scraped*, 2 web-scraped sections, 4 site layers |
| **1600 Broadway, Denver, CO 80202** | 200 baseline + websearch (not error) | **PASS** — `jurisdiction=denver_co`, `localCodeSource=websearch`, `coverage.degraded=true`, 4 site layers |
| **1311 Chestnut St, Bastrop, TX 78602** | Cited corpus, no web banner | **PASS** — `localCodeSource=corpus`, `coverage.degraded=false`, `webSectionCount=0` |

Extension UI (research/research.html): on success, `#chat-inner` loading shell is replaced by brief content + amber `hauska-websearch-banner` when `briefHasWebsearchLayer()` is true. Failure path shows terminal **Brief failed** + **Try again** (no infinite spinner).

**Screen capture (operator):** Reload unpacked v0.6.13 → Pflugerville address → capture chat showing amber banner + investor brief sections (API confirms payload; attach PNG to this report).

### Attachment presign (PB-301, public tier)

| Step | Endpoint | Result |
|------|----------|--------|
| Presign | `POST /api/brokerage/v1/workspaces/encumbrances/request-upload-url` | **200** — `uploadURL` on `storage.googleapis.com` |
| PUT bytes | GCS presigned URL | **200** — file bytes go to GCS, **not** cortex-api |
| Complete | `POST .../encumbrances/complete-upload` | **500** on minimal smoke PDF (`encumbrance_upload_failed` — PDF extract); real CC&R PDF required for instrument row |
| List | `GET .../encumbrances?workspaceDid=` | **403** on extension_public (dev-client gate); extension shows rows from **complete-upload 201** response + `encumbrancesToAttachmentRows()` |

Extension: `+ Add` → file picker → inline progress in ATTACHMENTS rail; on 201 complete, doc appears without needing list GET.

## Full prod checklist (`node scripts/verify-prod-live.mjs`)

| Control | Pass | Detail |
|---------|------|--------|
| GET /coverage | PASS | 37 jurisdictions |
| POST /gtm/consent | PASS | consent recorded |
| Run full brief (Bastrop) | PASS | `jurisdiction=bastrop_tx` |
| **Pflugerville brief** | **PASS** | `localCodeSource=websearch degraded=true` |
| **Attachment presign** | **PASS** | `objectPath=/objects/uploads/…` |
| 5 investor chips (pre-brief) | PASS | same `/brief` path |
| 5 chips post-brief | PASS | client scroll / deep research |
| Deep research composer | PASS | Grok reply |
| Deep research page open | PASS | no stale guard |
| Keep / Pass | PASS | 401 → local stats fallback |
| Share | PASS | hidden public tier |
| Max site map | PASS | tier_required hidden |
| Sign up / Sign in | PASS | HTTP 200 |
| Sign out when signed in | PASS | `syncPanelChrome` |
| Research address form | PASS | RUN_BRIEF → /brief |

## Bug fixes shipped

### Bug 1 — spinner on failure

- `showBriefFailedTerminal()` replaces loading shell; never leaves "Building property brief…" running after error.
- Degraded success: `websearchDisclosureBannerHtml()` + per-section `sectionWebsearchDisclosureHtml()` from EngineEnvelope / section provenance.

### Bug 2 — PB-301 upload

- `src/lib/encumbrance-upload-api.js` — presign → GCS PUT → complete per cc-agent-C contract.
- All three stubs removed in `research-app.js`; inline progress/errors in attachments rail.

## Files

- `src/research/research-app.js`
- `src/lib/envelope-confidence.js`
- `src/lib/encumbrance-upload-api.js`
- `src/lib/brief-engine.js`
- `src/lib/site-context-render.js`
- `research/research.css`
- `scripts/verify-prod-live.mjs`
- `scripts/verify-national-baseline.mjs`
- `manifest.json`, `package.json` → 0.6.13

## QA reload

```powershell
cd p:\hauska-brief-extension
node scripts/build.mjs
# chrome://extensions → Reload Hauska Property Brief
# research/research.html → addresses above
node scripts/verify-prod-live.mjs
node scripts/verify-national-baseline.mjs
```
