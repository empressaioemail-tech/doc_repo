---
id: 2026-05-30_cc-agent-C_extension_public_client_key_p0
title: Dispatch — Extension public client key P0 (zero-config store path)
date: 2026-05-30
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
priority: P0
related: [2026-05-29_cc-agent-C_extension_public_client_key, 2026-05-30_extension-agent_zero_config_consumer_ux, 08_tiered_access_model, 14_pricing_framework]
blocked_on: none
supersedes_notes: Expands 2026-05-29 dispatch with P0 priority and prod deploy steps post #139
---

# Extension public client key — P0 (blocks consumer zero-config)

You are **cc-agent-C** on `legacy-design-tools` / cortex-api.

**Context:** Prod deploy complete (`4e949bb` + env patch + REGRID). Operator QA blocked on manual `BROKERAGE_DEV_API_KEY` entry in extension options. Chrome Web Store path requires **embedded public credential** rate-limited by `X-Hauska-Install-Id`. Extension code ready (`resolveHauskaKey()` → `__HAUSKA_EXTENSION_PUBLIC_KEY__` at build time). Server mint + mount is the gap.

**Parallel:** extension-agent ships v0.6.5 single-consent UX ([`2026-05-30_extension-agent_zero_config_consumer_ux.md`](2026-05-30_extension-agent_zero_config_consumer_ux.md)). Unblocked for internal QA if operator bakes dev key via `build-release.ps1` — **not** for public store.

## Model (HR-12)

**Grok Build 0.1**

## Read first

1. [`artifacts/api-server/src/lib/brokerageExtensionPublic.ts`](../../legacy-design-tools/artifacts/api-server/src/lib/brokerageExtensionPublic.ts) — rate limits, `requireBrokerageDevClient`
2. [`artifacts/api-server/src/middlewares/brokerageAuth.ts`](../../legacy-design-tools/artifacts/api-server/src/middlewares/brokerageAuth.ts) — `BROKERAGE_API_KEYS`, `isExtensionPublicClient`
3. [`2026-05-29_cc-agent-C_extension_public_client_key.md`](2026-05-29_cc-agent-C_extension_public_client_key.md) — original spec
4. [`docs/deploy.md`](../../legacy-design-tools/docs/deploy.md) — Cloud Run env section

## Workspace

- Branch: `cortex/extension-public-client-key`
- Do not merge without operator ack (key handling)

---

## Task 1 — Mint dedicated public key

Generate cryptographically random key (48+ chars). **Separate from `BROKERAGE_DEV_API_KEY`.**

Store in GCP Secret Manager:

```text
Secret name: BROKERAGE_EXTENSION_PUBLIC_KEY
```

Document operator mount — **never commit key value to git**.

Add to cortex-api env as part of `BROKERAGE_API_KEYS` comma-separated list OR dedicated env var wired in `brokerageAuth.ts` (follow existing pattern for dev key).

Verify `isExtensionPublicClient(req)` returns true for requests bearing this key.

---

## Task 2 — Prod Cloud Run mount

Operator-ready commands in close file (redact key in inbox — reference Secret Manager only):

```bash
gcloud run services update cortex-api \
  --region us-central1 \
  --project legacy-design-tools-prod \
  --update-secrets=BROKERAGE_EXTENSION_PUBLIC_KEY=BROKERAGE_EXTENSION_PUBLIC_KEY:latest

# Merge into BROKERAGE_API_KEYS env (exact flag depends on current deploy shape — document in close)
gcloud run services update-traffic cortex-api --region us-central1 --to-latest
```

---

## Task 3 — Rate limits (verify / tune)

Existing code in `brokerageExtensionPublic.ts`:

| Limit | Default env | Suggested v1 |
|-------|-------------|--------------|
| Briefs per install / day | `BROKERAGE_EXTENSION_PUBLIC_BRIEFS_PER_DAY` | 5 |
| Research turns / install / day | `BROKERAGE_EXTENSION_PUBLIC_RESEARCH_TURNS_PER_DAY` | 20 |
| Global briefs / day | `BROKERAGE_EXTENSION_PUBLIC_GLOBAL_BRIEFS_PER_DAY` | 10000 |

Confirm wired on `POST /brief` and `POST /research/chat`. Return **429** with clear message (existing helpers).

---

## Task 4 — Tier gating (verify)

Public key installs:

| Route | Expected |
|-------|----------|
| `POST /brief` | Layer 1 neon pilot jurisdictions only (`assertExtensionPublicJurisdictionAllowed`) |
| `POST /research/chat` | Same + rate limit |
| `GET /workspaces/*`, share, wallet | **403** `account_upgrade_required` via `requireBrokerageDevClient` |
| `GET /coverage` | Public (no auth) |

Add integration test if missing: public key brief on `round_rock_tx` → 200; share → 403.

---

## Task 5 — GTM telemetry

Ensure `gtmPayloadWithClientTier` tags `clientTier: extension_public` on brief_started / brief_completed for public key requests.

---

## Task 6 — Operator release instructions

Close file must include **Secret Manager secret name** and mount steps only — key value delivered to Nick out-of-band (password manager / GCP console), not in git inbox body.

Extension operator build:

```powershell
cd P:\hauska-brief-extension
$env:HAUSKA_EXTENSION_PUBLIC_KEY = "<operator sets from Secret Manager>"
.\scripts\build-release.ps1
```

---

## Out of scope

- Extension UX (extension-agent v0.6.5)
- Stripe account upgrade
- Lifting share/wallet for public tier

---

## Acceptance criteria

- [ ] Public key in Secret Manager + mounted on prod cortex-api
- [ ] `POST /brief` with public key + `X-Hauska-Install-Id` only → 200 on Round Rock address
- [ ] `POST /brief` on non-neon jurisdiction → 403 with clear message
- [ ] Rate limit → 429 with clear message
- [ ] `POST /workspaces/:id/share` with public key → 403
- [ ] Dev operator key unchanged and unlimited (no regression)
- [ ] Tests + typecheck green

## Report back

`P:/doc_repo/_inbox/2026-05-30_legacy-design-tools_cc-agent-C_extension_public_client_key_close.md`

Include PR URL, SHA, smoke curl commands (key redacted as `$PUBLIC_KEY`), env var names only.
