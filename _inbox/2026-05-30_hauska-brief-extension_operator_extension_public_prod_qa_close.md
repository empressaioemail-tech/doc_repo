---
date: 2026-05-30
agent: operator (cente)
repo: hauska-brief-extension
topic: extension_public_prod_build_qa_status
status: build_done_qa_pending
related:
  - 2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md
---

# Close — Extension public prod build (operator)

## Build

| Field | Value |
|-------|-------|
| Path | `P:\hauska-brief-extension` |
| Command | `$env:HAUSKA_EXTENSION_PUBLIC_KEY = <from SM>` → `.\scripts\build-release.ps1` |
| Output | `public client key: injected` |
| API URL (options default) | `https://cortex-api-tds7av26va-uc.a.run.app` |

## Prod API verified (same key as build)

Round Rock brief via prod URL returns `extension_public` — extension should work **without** options override.

## QA not signed off

| Test | Result |
|------|--------|
| Zero-config brief on Zillow | **Fail** — user used override key; QuotaBytes on stale storage |
| Plano block | Not re-tested in extension after prod promote |
| Share (public tier) | Expected 403 / hidden — not verified |

## Next session

1. Remove extension → load unpacked fresh
2. Clear override API key in options
3. Round Rock listing smoke
4. Plano or Pflugerville negative

See LDT operator close: `2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md`
