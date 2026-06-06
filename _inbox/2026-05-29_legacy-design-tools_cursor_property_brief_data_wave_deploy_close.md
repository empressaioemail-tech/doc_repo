---
date: 2026-05-29
agent: cursor-auto
repo: legacy-design-tools
topic: property_brief_data_wave_deploy_smoke
status: deployed_prod
---

# Close — Property Brief data wave deploy + smoke (2026-05-29)

Cursor operator session on `cente` workstation. Runbook: [`90_runbooks/property_brief_data_wave.ps1`](../90_runbooks/property_brief_data_wave.ps1).

## Merged to `main`

| PR | Title | Merge SHA | Notes |
|----|-------|-----------|-------|
| [#137](https://github.com/empressaioemail-tech/legacy-design-tools/pull/137) | Property Brief data wave (federal + retrieval + encumbrance) | `a44701a` | Integration branch `cortex/property-brief-data-wave` |
| [#135](https://github.com/empressaioemail-tech/legacy-design-tools/pull/135) | GTM Track C: place API + MCP observation | `e086836` | Rebased post-#137; migration renumbered to **0032** |

### #137 stack (shipped in prod image `a44701a`)

- **PB-003** federal site context — `cortex/brief-federal-site-context` (`3e0b8d7`)
- **PB-301 + ADU tuning** — `cortex/encumbrance-r4` (`61299bc`); includes ADU retrieval polish (retrieval branch was empty at main)
- **Fixture** — `0031_encumbrances_brokerage_scope.sql` + schema fixture refresh (`2618ff3`)

### #135 follow-ups (merged; not yet redeployed)

- Place API: `/place/resolve`, `/place/:placeKey/layers`, `/place/:placeKey/dossier`
- GTM MCP observation + digest aggregates
- Migration **`0032_gtm_mcp_observation.sql`** (encumbrance keeps **0031**)
- Rebase conflict resolved: all of `/coverage`, `/place`, encumbrance `/workspaces` routes retained

## Deploy (prod cortex-api)

Runbook phases executed:

1. `property_brief_data_wave.ps1 -MergeBranches -CreatePr` → PR #137
2. CI green after fixture fix
3. `-MergePr -Deploy -UseGcloudKey` → merge + canary (first attempt failed: image not built yet)
4. Retry after `build-and-push` on main merge: `property_brief_cortex_deploy.ps1 -ImageTag a44701af -BrokerageKey <recovered from revision cortex-api-00066-7hq>`
5. Pipeline: deploy-canary → **run-migrations (0031)** → shift-traffic → Grok/env patch → smoke

**Serving revision after deploy:** `cortex-api-00069-6nw`  
**Prod URL:** `https://cortex-api-tds7av26va-uc.a.run.app`

### Deploy quirks logged

- **Image timing:** `deploy-canary` must wait for push-triggered `build-and-push` (~3 min after merge to `main`).
- **`-UseGcloudKey` fragility:** failed canary resets Cloud Run template to mock-only (no inline `BROKERAGE_DEV_API_KEY`). Recovery: read key from last good serving revision or pass `-BrokerageKey` explicitly.

## Prod smoke checklist

| Address | Check | Result |
|---------|-------|--------|
| 1400 Destin Dr, Round Rock, TX 78664 | `in_corpus` | **PASS** (`corpusStatus: in_corpus`, 5 citations) |
| | Citations | **PASS** |
| | Regrid parcel in site context | **FAIL** — `REGRID_API_KEY` not mounted on Cloud Run |
| 251 Cool Water Dr, Bastrop, TX 78602 | ADU starter → code citations | **FAIL** on `/research/chat` (generic “no info”; `sources: 0`). Brief POST **does** retrieve ADU citation from code corpus. |
| 101 Colorado St, Austin, TX 78701 | `in_corpus` | **PASS** |
| | Federal layers (USGS + EPA) | **PASS** (`usgs-ned-elevation: ok`, `epa-ejscreen-blockgroup: ok`) |

Brief acceptance (Bastrop): `laySummary` present, federal layers ok, `meta.encumbranceUploadCta` present.

## Operator next steps

1. **Mount `REGRID_API_KEY`** on `cortex-api` (secret + env) — unblocks Regrid parcel/zoning on all addresses.
2. **Redeploy + migrate 0032** when GTM Track C should go live: merge SHA `e086836`, `run-migrations`, then deploy-canary (or full data-wave deploy script with new image tag).
3. **Bastrop ADU research chat** — brief retrieval finds ADU atoms; `/research/chat` with `starterPromptId: adu` does not surface them. Follow-up on chat retrieval path.
4. **Neon warmup** (optional, not run this session): `property_brief_neon_warmup.ps1 -Auto -Jurisdiction round_rock_tx` per runbook.
5. **Coverage endpoint drift:** `/coverage` still lists `round_rock_tx` / `austin_tx` as `engine_only` while briefs return `in_corpus` — reconcile atom counts vs warmed Neon.

## Local WIP (not merged)

Uncommitted on `P:\legacy-design-tools` (`cortex/property-brief-data-wave` branch tip stale vs `main`):

- Extension public client tier (`brokerageExtensionPublic.ts`, `brokerageAuth.ts` tier routing)
- Related route/auth test file

Separate PR when ready. Inbox stub already exists: [`2026-05-29_legacy-design-tools_cc-agent-C_extension_public_client_key_close.md`](2026-05-29_legacy-design-tools_cc-agent-C_extension_public_client_key_close.md) (pre-close).

## Prior per-dispatch closes (pre-merge)

These remain valid as **build** reports; prod ship is this file + #137/#135 merges above:

- [`2026-05-29_legacy-design-tools_cc-agent-C_brief_federal_site_context_close.md`](2026-05-29_legacy-design-tools_cc-agent-C_brief_federal_site_context_close.md)
- [`2026-05-29_legacy-design-tools_cc-agent-C_brief_encumbrance_upload_close.md`](2026-05-29_legacy-design-tools_cc-agent-C_brief_encumbrance_upload_close.md)
- [`2026-05-29_legacy-design-tools_cc-agent-C_brief_retrieval_regrid_polish_close.md`](2026-05-29_legacy-design-tools_cc-agent-C_brief_retrieval_regrid_polish_close.md)
- [`2026-05-28_legacy-design-tools_cc-agent-C_gtm_engine_observation_place_api_close.md`](2026-05-28_legacy-design-tools_cc-agent-C_gtm_engine_observation_place_api_close.md) — superseded for merge status by #135 @ `e086836`
