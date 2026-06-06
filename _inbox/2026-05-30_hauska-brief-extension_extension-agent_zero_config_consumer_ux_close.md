---
id: 2026-05-30_hauska-brief-extension_extension-agent_zero_config_consumer_ux_close
title: Close — Zero-config consumer UX v0.6.5 (extension-agent)
date: 2026-05-30
agent: extension-agent
repo: hauska-brief-extension
kind: inbox-close
related: [2026-05-30_extension-agent_zero_config_consumer_ux, 2026-05-29_cc-agent-C_extension_public_client_key]
---

# Extension-agent close — zero-config consumer UX v0.6.5

## Branch / SHA

- **Branch:** `extension/zero-config-consumer-v065`
- **SHA:** `1cfc943197e1662bc864cf661fa9c7bff88ea9c9`
- **Manifest:** `0.6.5`
- **Build:** `node scripts/build.mjs` — green
- **Tests:** `npm test` — green (brief-storage + consumer-tier)

## PR

- **Repo:** https://github.com/empressaioemail-tech/hauska-brief-extension
- **PR #1:** https://github.com/empressaioemail-tech/hauska-brief-extension/pull/1 (`extension/zero-config-consumer-v065` → `main`)
- **Main @ v0.6.4:** `e4fadf0` (QA fix wave merged to `main` on initial push)

## Shipped

### P0

1. **Zero-config API** — `ensureInstallDefaults()` on background module load + `onStartup`. `effectiveBriefApiUrl()` falls back to `PROD_BRIEF_API_URL`. `isApiConfigured()` true with baked public key only.
2. **Single consent** — Listing welcome only (terms required, graph default off, **Continue**). Options: Privacy section with graph toggle only after terms accepted; ToS/Privacy links. Share modal graph toggle removed → **Privacy settings** link.
3. **Public tier** — `consumer-tier.js`: hide Share + wallet when `hasPublicClientKey() && !user hauskaKey`. No "Add Hauska key" errors on public path.
4. **Options restructure** — Default: How it works + Privacy + version. Advanced collapsed for team overrides + test connection.

### P1

5. **Error audit** — Tier-aware messages in `intel-panel.js`, `research-app.js`, `background/index.js`. Dev unpack: *"Internal build not configured — contact Hauska or use Advanced settings."*

### Tests

- `isApiConfigured()` true with empty user key + mocked `HAUSKA_EXTENSION_PUBLIC_KEY`
- `canShowShareButton()` false on public-only; true with operator override key

## Manual QA checklist (operator)

| # | Check | Expected |
|---|-------|----------|
| 1 | Fresh install / clear storage, reload | No options visit required when public key baked |
| 2 | Listing welcome | Only consent surface; graph unchecked by default |
| 3 | Options main view | No terms checkbox; Privacy graph only after terms |
| 4 | Share modal | No graph toggle; Privacy settings link works |
| 5 | Public tier (no user key) | Share hidden; wallet hidden; no key errors |
| 6 | Advanced override key | Share + wallet visible; share works as v0.6.4 |

## Operator handoff

```powershell
# After cc-agent-C provides BROKERAGE_EXTENSION_PUBLIC_KEY:
cd P:\hauska-brief-extension
git checkout extension/zero-config-consumer-v065
$env:HAUSKA_EXTENSION_PUBLIC_KEY = "<from cc-agent-C close — never commit>"
.\scripts\build-release.ps1
# chrome://extensions → Reload → test Round Rock with no options changes
```

Internal QA interim (dev key bake):

```powershell
cd P:\hauska-brief-extension
node scripts/build.mjs
# Options → Advanced → paste BROKERAGE_DEV_API_KEY as override
# chrome://extensions → Reload → refresh Zillow tabs
```

## Depends on

Full store zero-config path needs **cc-agent-C** public key on prod + `build-release.ps1` bake. UX and tier logic ship in this PR regardless.
