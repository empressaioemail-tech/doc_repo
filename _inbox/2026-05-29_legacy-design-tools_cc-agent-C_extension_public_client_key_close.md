---
id: 2026-05-29_legacy-design-tools_cc-agent-C_extension_public_client_key_close
title: Close — Extension public client key (zero-config Chrome Web Store)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/property-brief-data-wave
dispatch: _dispatches/2026-05-29_cc-agent-C_extension_public_client_key.md
related: [75a_hauska_brief_extension, 08_tiered_access_model, 14_pricing_framework]
---

# Extension public client key — cc-agent-C close

## Summary

Server-side `extension_public` tier implemented in **legacy-design-tools** (uncommitted on `cortex/property-brief-data-wave`). Extension v0.6.0 release path fixed in **hauska-brief-extension** so baked keys reach the service worker. **Operator deploy + key mint still pending** on cortex-api prod.

## Delivered — cortex-api (`legacy-design-tools`)

| Item | Status |
|------|--------|
| `BROKERAGE_EXTENSION_PUBLIC_KEY` auth + `req.brokerageAuth.tier` | Done (code) |
| Per-install rate limits: 5 briefs/day, 20 research turns/day | Done (code) |
| Global brief ceiling (default 10k/day, env-tunable) | Done (code) |
| Layer 1 gate: `neon` jurisdictions only for public tier | Done (code) |
| Block wallet / encumbrance / share-create for public tier | Done (code) |
| GTM `payload.clientTier: "extension_public"` on brief/research events | Done (code) |
| Dev operator key unchanged (`tier: "dev"`) | Done (code + test) |
| Tests `brokerageExtensionPublic.test.ts` | Done (needs `DATABASE_URL`) |
| `docs/deploy.md` env table | Done |

### Files

- `artifacts/api-server/src/middlewares/brokerageAuth.ts`
- `artifacts/api-server/src/lib/brokerageExtensionPublic.ts` *(new)*
- `artifacts/api-server/src/routes/brokerageBrief.ts`
- `artifacts/api-server/src/routes/brokerageWalletRoute.ts`
- `artifacts/api-server/src/routes/brokerageEncumbrances.ts`
- `artifacts/api-server/src/routes/brokerageWorkspace.ts`
- `artifacts/api-server/src/__tests__/brokerageExtensionPublic.test.ts` *(new)*
- `docs/deploy.md`

### Env vars (operator)

| Variable | Default | Purpose |
|----------|---------|---------|
| `BROKERAGE_EXTENSION_PUBLIC_KEY` | — | Dedicated store client key; enables `extension_public` tier |
| `BROKERAGE_API_KEYS` | — | Must include public key so Cloud Run accepts Bearer auth |
| `BROKERAGE_EXTENSION_PUBLIC_BRIEFS_PER_DAY` | `5` | Per `X-Hauska-Install-Id` |
| `BROKERAGE_EXTENSION_PUBLIC_RESEARCH_TURNS_PER_DAY` | `20` | Per install |
| `BROKERAGE_EXTENSION_PUBLIC_GLOBAL_BRIEFS_PER_DAY` | `10000` | Anti-scrape global ceiling |

## Delivered — extension (`P:\hauska-brief-extension`)

Extension v0.6.0 already had `resolveHauskaKey()` → `__HAUSKA_EXTENSION_PUBLIC_KEY__` via `scripts/build-release.ps1`. **Bug fixed:** manifest loaded unbundled `src/background/index.js`, so release builds never injected the key into the service worker.

| Fix | File |
|-----|------|
| Service worker → bundled dist | `manifest.json` → `dist/background.js` |
| Options page → bundled dist | `options/options.html` → `dist/options.js` |
| Store/interim build docs | `README.md` |

## Not done (operator)

1. **Mint** dedicated `BROKERAGE_EXTENSION_PUBLIC_KEY` (≠ `BROKERAGE_DEV_API_KEY`).
2. **Deploy** server changes to cortex-api; set env:
   - `BROKERAGE_EXTENSION_PUBLIC_KEY=<minted>`
   - `BROKERAGE_API_KEYS=<minted>` (append if list exists)
3. **Release build:**
   ```powershell
   cd P:\hauska-brief-extension
   $env:HAUSKA_EXTENSION_PUBLIC_KEY = "<same minted key>"
   .\scripts\build-release.ps1
   ```
4. Reload unpacked → Zillow `/homedetails/` → accept terms → Run brief (no key field).

**Interim internal pilot:** bake existing `BROKERAGE_DEV_API_KEY` into `HAUSKA_EXTENSION_PUBLIC_KEY` for unpacked testing only. Requests stay **dev tier** until step 1–2 ship. **Do not** upload that CRX to the public store.

### Prod recon (2026-05-29)

- cortex-api has `BROKERAGE_DEV_API_KEY` set.
- `BROKERAGE_EXTENSION_PUBLIC_KEY` **not** on prod revision yet.
- Server code **not** merged/deployed yet.

## Acceptance

| Criterion | Status |
|-----------|--------|
| `POST /api/brokerage/v1/brief` with public key + install ID only | Code + test; pending prod deploy |
| Rate limit 429 with clear message | Code + test; pending prod deploy |
| Dev operator key unchanged | Code + test |

## Tests run (local)

```
pnpm exec tsc -p artifacts/api-server --noEmit   # green
# vitest brokerageExtensionPublic.test.ts — blocked without DATABASE_URL in env
```

## PR / merge

Commit server changes on `cortex/property-brief-data-wave` (or split to dedicated branch), merge → deploy cortex-api → mint key → extension release build.
