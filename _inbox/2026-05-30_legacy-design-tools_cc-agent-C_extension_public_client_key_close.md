---
date: 2026-05-30
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/extension-public-client-key
dispatch: 2026-05-30_cc-agent-C_extension_public_client_key_p0
---

# Close — Extension public client key (Chrome Web Store zero-config)

## PR

| Field | Value |
|-------|-------|
| URL | https://github.com/empressaioemail-tech/legacy-design-tools/pull/140 |
| SHA | `d4e2e5f` |
| Branch | `cortex/extension-public-client-key` |

**Do not merge without operator ack** — secret mint + mount required before store release.

## GCP secret (operator — value OOB only)

| Item | Value |
|------|-------|
| Secret Manager name | `BROKERAGE_EXTENSION_PUBLIC_KEY` |
| Status at close (code) | Secret shell created pre-merge |
| Status 2026-05-30 operator | **LIVE** — SM v2 mounted on `cortex-api-00119-laq`; prod smoke PASS |
| Cloud Run env | `BROKERAGE_EXTENSION_PUBLIC_KEY` (dedicated; separate from `BROKERAGE_DEV_API_KEY`) |

### Mint + mount (no key in git)

```powershell
# 1. Generate 48+ char secret locally; store only in Secret Manager + password manager.
gcloud secrets create BROKERAGE_EXTENSION_PUBLIC_KEY `
  --replication-policy=automatic `
  --project=legacy-design-tools-prod

# echo -n "<generated-key>" | gcloud secrets versions add BROKERAGE_EXTENSION_PUBLIC_KEY --data-file=- --project=legacy-design-tools-prod

# 2. Mount on cortex-api (after PR merge + deploy-canary)
gcloud run services update cortex-api `
  --region us-central1 `
  --project legacy-design-tools-prod `
  --update-secrets=BROKERAGE_EXTENSION_PUBLIC_KEY=BROKERAGE_EXTENSION_PUBLIC_KEY:latest
```

Deliver key value to Nick **out-of-band** (GCP console / 1Password). Extension build:

```powershell
cd P:\hauska-brief-extension
$env:HAUSKA_EXTENSION_PUBLIC_KEY = "<from Secret Manager>"
.\scripts\build-release.ps1
```

Full runbook: `legacy-design-tools/docs/deploy.md` § **Property Brief — extension public key**.

## Code delivered

| Area | Behavior |
|------|----------|
| `brokerageAuth.ts` | `extension_public` vs `dev` tier from `BROKERAGE_EXTENSION_PUBLIC_KEY` |
| `brokerageExtensionPublic.ts` | Rate limits, jurisdiction gate, `gtmPayloadWithClientTier`, `requireBrokerageDevClient` |
| `POST /brief` | Public: install ID required, rate limit, neon pilot only, no wallet/encumbrance/workspace upsert |
| `POST /research/chat` | Same jurisdiction + rate limits |
| Wallet / workspace / encumbrance | **403** `account_upgrade_required` for public tier |
| `GET /workspaces/shared/:token` | Still allowed (registered before dev-client middleware) |

### Rate limits (defaults)

| Env | Default |
|-----|---------|
| `BROKERAGE_EXTENSION_PUBLIC_BRIEFS_PER_DAY` | 5 / install |
| `BROKERAGE_EXTENSION_PUBLIC_RESEARCH_TURNS_PER_DAY` | 20 / install |
| `BROKERAGE_EXTENSION_PUBLIC_GLOBAL_BRIEFS_PER_DAY` | 10000 global |

Exceeded → **429** `rate_limit_exceeded` with clear message.

### Pilot jurisdictions (Layer 1)

`getPilotCoverageTier === "neon"` **or** warmed keys: `round_rock_tx`, `austin_tx`, `hutto_tx`, `georgetown_tx`, `new_braunfels_tx`, `leander_tx`.

## Smoke (prod — redact key)

```powershell
$PUBLIC_KEY = "<from Secret Manager>"
$headers = @{
  Authorization = "Bearer $PUBLIC_KEY"
  "X-Hauska-Install-Id" = [guid]::NewGuid().ToString()
  "Content-Type" = "application/json"
}

# Round Rock — expect 200
Invoke-RestMethod -Method POST `
  -Uri "https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/brief" `
  -Headers $headers `
  -Body '{"address":"1904 Heathwood Cir, Round Rock, TX 78664"}'

# Plano — expect 403 jurisdiction_not_available
Invoke-RestMethod -Method POST `
  -Uri "https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/brief" `
  -Headers $headers `
  -Body '{"address":"5800 Democracy Dr, Plano, TX 75024"}'
```

## Tests

- `brokerageExtensionPublic.test.ts` — Round Rock 200 + `meta.clientTier`, Plano 403, share 403 public / 201 dev, 429 limit, GTM payload helper
- `pnpm run typecheck` — green locally

## CI

| Typecheck | pass (after `d4e2e5f`) |
| Test | pass (after `d4e2e5f`) |

## Operator checklist

1. [x] Merge PR #140
2. [x] Create `BROKERAGE_EXTENSION_PUBLIC_KEY` SM v2; value in password manager (OOB)
3. [x] Mount secret + Grok + Regrid on `cortex-api` (revision `00119-laq`)
4. [x] Smoke Round Rock brief with public key only — prod **PASS**
5. [x] Extension `build-release.ps1` with same key
6. [ ] Chrome Web Store upload (after clean extension QA)
7. [ ] Disable SM secret v1 (junk version)
8. [ ] Workflow PR: bake brokerage secrets into `deploy-canary`

**Operator session close:** [`2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md`](2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md)
