---
id: 2026-05-29_cc-agent-C_extension_public_client_key
title: Dispatch — Extension public client key (zero-config Chrome Web Store)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
priority: P0
related: [75a_hauska_brief_extension, 08_tiered_access_model, 14_pricing_framework, 2026-05-30_cc-agent-C_extension_public_client_key_p0]
blocked_on: none
superseded_by: 2026-05-30_cc-agent-C_extension_public_client_key_p0
---

# Extension public client key — zero-config public install

**Goal:** Chrome Web Store users run Property Brief with **no API key entry**. Extension ships an embedded public client credential; cortex-api rate-limits by `X-Hauska-Install-Id`.

**Extension side (done v0.6.0):** `resolveHauskaKey()` falls back to `__HAUSKA_EXTENSION_PUBLIC_KEY__` baked at build via `HAUSKA_EXTENSION_PUBLIC_KEY` env. User flow: install → open listing → accept terms in panel → Run brief.

## Server work (cc-agent-C)

1. Mint dedicated key `BROKERAGE_EXTENSION_PUBLIC_KEY` (separate from `BROKERAGE_DEV_API_KEY`).
2. Add to `BROKERAGE_API_KEYS` on cortex-api prod revision.
3. Rate limits (suggested v1):
   - Per `X-Hauska-Install-Id`: 5 briefs/day, 20 research chat turns/day
   - Global ceiling on key to prevent scrape abuse
4. Layer 1 only: public-free jurisdictions; no wallet/share paid surfaces without account upgrade later.
5. Log `extension_public` tier in GTM events for conversion tracking.

## Operator release build

```powershell
cd P:\hauska-brief-extension
$env:HAUSKA_EXTENSION_PUBLIC_KEY = "<key from step 1>"
.\scripts\build-release.ps1
```

Zip + Chrome Web Store upload. **Never commit the key to git.**

## Interim pilot

Until dedicated key ships, operator may bake existing dev key for internal testers only — not for public store.

## Acceptance

- [ ] `POST /api/brokerage/v1/brief` works with extension public key + install ID only
- [ ] Rate limit returns 429 with clear message when exceeded
- [ ] Dev operator key unchanged for cc-agent workflows
