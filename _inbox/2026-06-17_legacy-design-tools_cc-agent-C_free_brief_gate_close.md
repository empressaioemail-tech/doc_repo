---
id: 2026-06-17_legacy-design-tools_cc-agent-C_free_brief_gate_close
title: cc-agent-C — wire free-brief tier into brief gate close
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-17_cc-agent-C_wire_free_brief_tier_into_gate
---

# Close — free brief tier wired into brief gate

## Gate change

**Root cause:** `brokerageEntitlement.ts` existed with `getEntitlementSnapshot` / `assertBriefComputeEntitled`, but `POST /brief` never called it for `extension_public` installs (rate-limit only). Dev-client path checked `insufficient_balance`, which never matched the entitlement layer's `paywall_hit` response.

**Fix (PR #192, merge `a368f970`):**

1. `enforceBriefComputeGate()` in `brokerageBrief.ts` — runs **after** extension_public rate limit, **before** brief build:
   - `proActive` → allow, no wallet debit
   - `freeBriefsRemaining > 0` → allow + atomic `free_briefs_used` increment + ledger `free_brief` event (no wallet debit)
   - cap exhausted + not Pro → **402 `upgrade_required`** (`upgradeCta: pro_subscription`), **not** `insufficient_balance`
2. Brief **200** responses include `entitlement: { freeBriefsRemaining, freeBriefsCap, proActive }`
3. **`GET /api/brokerage/v1/entitlement`** — extension_public readable (no dev-client gate); returns snapshot + `freeBriefsUsed` + `balanceCents`
4. Migration **`0042_brokerage_entitlements.sql`** — `free_briefs_used` + subscription columns on `brokerage_wallets`

**Cap:** `BROKERAGE_FREE_BRIEFS_CAP` default **3** (env-overridable, no redeploy).

**No-lockout:** Gate blocks new brief compute only; saved briefs / profile read paths unchanged.

## PR / deploy

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/192 |
| Commit | `a368f97042e997c754996be4cdbb3f5f2153bcb8` |
| build-and-push | run `27731484320` |
| deploy-canary | run `27731592274` |
| run-migrations (`0042`) | run `27731648161` |
| canary smoke | pass (`scripts/_free-brief-tier-smoke.mjs`) |
| shift-traffic | run `27731690073` |

### Serving revision + rollback

| | Revision |
|---|---|
| **Now serving (100%)** | **`cortex-api-00194-diw`** |
| **Rollback handle** | **`cortex-api-00192-zan`** |

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" -f action=rollback -f rollback_revision=cortex-api-00192-zan
```

`ENGINE_API_URL` unchanged: `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app` (stable engine host).

## Entitlement snapshot shape (extension contract)

### On brief 200 (`entitlement` field)

```json
{
  "freeBriefsRemaining": 2,
  "freeBriefsCap": 3,
  "proActive": false
}
```

### `GET /api/brokerage/v1/entitlement`

Auth: same as brief (`Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>` + `X-Hauska-Install-Id`).

```json
{
  "freeBriefsRemaining": 3,
  "freeBriefsCap": 3,
  "proActive": false,
  "freeBriefsUsed": 0,
  "balanceCents": 0
}
```

### Cap exhausted (brief #4)

```json
{
  "error": "upgrade_required",
  "message": "Free briefs used for this install. Upgrade to Hauska Pro for unlimited Property Briefs.",
  "upgradeCta": "pro_subscription",
  "freeBriefsUsed": 3,
  "freeBriefsCap": 3,
  "freeBriefsRemaining": 0,
  "balanceCents": 0,
  "proActive": false
}
```

HTTP **402** — not `insufficient_balance`.

## Live smoke (canary + prod, fresh install, balance 0)

Install: `cc-agent-C-free-tier-1781747821500` (new `X-Hauska-Install-Id` per run).

| Brief # | HTTP | `entitlement.freeBriefsRemaining` | Notes |
|---|---|---|---|
| GET /entitlement | 200 | 3 (cap 3) | `balanceCents: 0` |
| 1 | 200 | 2 | Bastrop brief, no wallet debit |
| 2 | 200 | 1 | |
| 3 | 200 | 0 | |
| 4 | 402 | — | `error: upgrade_required` |

Verbatim brief #1 entitlement tail:

```json
"entitlement": {"freeBriefsRemaining":2,"freeBriefsCap":3,"proActive":false}
```

Verbatim brief #4:

```json
{"error":"upgrade_required","message":"Free briefs used for this install. Upgrade to Hauska Pro for unlimited Property Briefs.","upgradeCta":"pro_subscription","freeBriefsUsed":3,"freeBriefsCap":3,"freeBriefsRemaining":0,"balanceCents":0,"proActive":false}
```

Full capture: `legacy-design-tools/scripts/_free-brief-tier-smoke-canary-output.txt`

## Extension handoff

extension-agent should read `entitlement` from brief 200 or poll `GET /entitlement` on panel load — show **"N free briefs remaining"** while `freeBriefsRemaining > 0`; on `upgrade_required`, show Pro upgrade CTA (not $5 wallet top-up). See `P:\doc_repo\_dispatches\2026-06-17_extension-agent_zillow_address_and_free_briefs_cta.md`.
