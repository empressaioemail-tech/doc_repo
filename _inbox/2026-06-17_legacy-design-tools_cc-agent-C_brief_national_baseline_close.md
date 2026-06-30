---
id: 2026-06-17_legacy-design-tools_cc-agent-C_brief_national_baseline_close
title: cc-agent-C — brief national baseline (no jurisdiction 403) + encumbrance presign close
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-17_cc-agent-C_brief_national_baseline_no_jurisdiction_gate
---

# Close — brief never 403 on jurisdiction + PB-301 presign

## What changed (code)

| Area | Change |
|---|---|
| Jurisdiction gate | Removed `assertExtensionPublicJurisdictionAllowed` hard-403 from `POST /brief` and research-chat replay path (`brokerageBrief.ts`). Brief always builds; tier cap stays on `assertExtensionPublicBriefAllowed` (429). |
| Local code layer | New `resolveBriefLocalCodeLayer` (`brokerageBriefLocalCode.ts`): warmed corpus retrieval → `supplementCodeSectionsWithReasoningGrounding` (existing chat web-first path) when no hits. |
| Coverage honesty | Response carries `coverage{degraded, reason}`, `localCodeSource`, per-section `provenance` + `coverage`; `provenance.coverage` on EngineEnvelope-shaped brief provenance. Web-scraped disclosure: **"Local code from web search — unverified, web-scraped"**. |
| Geocode/key | Brief uses `keyFromEngagementOrSynthesize` (city/state + address). Pflugerville → `pflugerville_tx`. `reviewWebTargetsForJurisdiction` now serves stock IRC web-first targets for **any** synthesized unwarmed key (not only `_tx`). |
| PB-301 presign | `POST …/encumbrances/request-upload-url` + `POST …/encumbrances/complete-upload` on brokerage workspace router — **extension_public** allowed (presign routes mounted before `requireBrokerageDevClient`). Brief `meta.encumbranceUploadCta` for public tier points at presign paths. |
| Docs | `docs/property-brief-extension-encumbrances.md` updated with presign contract. |

**No new DB migration.**

## Geocode/key fix

`keyFromEngagement` (synthesize off) returned `null` for Pflugerville because the city is not in `ENGINE_CORPUS_JURISDICTION_KEYS` / `JURISDICTIONS`. Brief now calls `keyFromEngagementOrSynthesize`, which maps:

- `jurisdictionCity: "Pflugerville", jurisdictionState: "TX"` → `pflugerville_tx`
- Address `17003 Simsbrook Dr, Pflugerville, TX 78660` → `pflugerville_tx` (address parse fallback)

Unit test added in `lib/codes/src/jurisdictions.test.ts`.

## Live QA — BEFORE (prod `cortex-api`, 2026-06-17, pre-deploy)

### Pflugerville (was launch blocker)

```http
POST https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/brief
Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>
X-Hauska-Install-Id: cc-agent-C-live-qa-20260617
Content-Type: application/json

{"address":"17003 Simsbrook Dr, Pflugerville, TX 78660"}
```

**Response HTTP 403:**

```json
{
  "error": "jurisdiction_not_available",
  "message": "This address is outside the free Property Brief pilot. Create an account for full coverage.",
  "clientTier": "extension_public",
  "jurisdiction": null
}
```

### Outside Central TX (Denver)

```http
POST https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/brief
… same auth …

{"address":"1600 Broadway, Denver, CO 80202"}
```

**Response HTTP 403** (same `jurisdiction_not_available` / `jurisdiction: null` class — gated before build).

## PR / merge

- **PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/191
- **Branch:** `fix/brief-national-baseline-no-jurisdiction-gate` → merged to `main`
- **Commit:** `eea0fe40516c8dca6e8ad91aa31bb4ce213a0042` (`eea0fe40`)
- **Image:** `us-central1-docker.pkg.dev/.../apps/cortex-api:eea0fe40516c8dca6e8ad91aa31bb4ce213a0042` (+ `latest`)

## Deploy (cortex-api canary sequence, 2026-06-18)

| Step | Workflow run | Result |
|---|---|---|
| `build-and-push` (push to main) | `27729869220` | success |
| `deploy-canary` (`image_tag=eea0fe40`) | `27729979668` | **failed** — short SHA not in registry (tags are full `github.sha`) |
| `deploy-canary` (`image_tag=latest`) | `27730012553` | success → revision **`cortex-api-00192-zan`** |
| Canary smoke (a/b/c/d) | local `scripts/_brief-national-baseline-smoke.mjs` | **all pass** |
| `shift-traffic` | `27730092100` | success — 100% → `cortex-api-00192-zan` |

- **Migrations:** skipped (no new migration)
- **Secrets:** unchanged (`--set-secrets` as-is)
- **Canary URL (pre-shift):** `https://canary---cortex-api-tds7av26va-uc.a.run.app`
- **Prod URL:** `https://cortex-api-tds7av26va-uc.a.run.app`

### Serving revision + rollback

| | Revision |
|---|---|
| **Now serving (100%)** | `cortex-api-00192-zan` |
| **Rollback handle** | `cortex-api-00189-nal` |

Rollback: `gh workflow run "Cloud Run Deploy (cortex-api)" -f action=rollback -f rollback_revision=cortex-api-00189-nal`

### ENGINE_API_URL (verified on `cortex-api-00192-zan`)

```
ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app
```

Stable engine host — not a canary tag. Baked in workflow `--set-env-vars`; confirmed via `gcloud run revisions describe cortex-api-00192-zan`.

## Canary smoke (pre-shift) — all pass

| # | Case | HTTP | Key assertions |
|---|---|---|---|
| a | Pflugerville `17003 Simsbrook Dr…` | 200 | `jurisdiction: pflugerville_tx`, FEMA+OZ layers, `coverage.degraded: true`, web-scraped disclosure, `localCodeSource: websearch`, `provenance.confidence: 0.35` |
| b | Denver `1600 Broadway…` | 200 | `jurisdiction: denver_co`, baseline layers, degraded web-scraped disclosure (not 403) |
| c | Bastrop `1311 Chestnut St…` | 200 | `localCodeSource: corpus`, `coverage.degraded: false`, Municode corpus hits, **no** web-scraped banner |
| d | Presign `…/encumbrances/request-upload-url` | 200 | `uploadURL` + `objectPath` returned (not 403) |

## Live QA — AFTER (prod post-shift, 2026-06-18)

Auth: `Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>` + `X-Hauska-Install-Id`.

### a) Pflugerville — HTTP 200 (verbatim)

See `legacy-design-tools/scripts/_brief-national-baseline-after-prod.txt` line 11 (full JSON). Key fields:

- `jurisdiction: "pflugerville_tx"`
- `localCodeSource: "websearch"`
- `coverage: { "degraded": true, "reason": "Local code from web search — unverified, web-scraped" }`
- `provenance.confidence: 0.35`
- `siteContext.layers`: fema-nfhl-flood-zone (ok), opportunity-zone (ok)
- `meta.disclaimer`: `"Local code from web search — unverified, web-scraped. Not legal advice — verify with city staff."`

### b) Denver — HTTP 200 (verbatim)

See `legacy-design-tools/scripts/_brief-national-baseline-after-prod.txt` line 13 (full JSON). Key fields:

- `jurisdiction: "denver_co"`
- `localCodeSource: "websearch"`
- `coverage.degraded: true` + web-scraped reason
- National baseline layers populated; **no** `jurisdiction_not_available`

### c) Bastrop — HTTP 200 (verbatim)

See `legacy-design-tools/scripts/_brief-national-baseline-after-prod.txt` line 15 (full JSON). Key fields:

- `jurisdiction: "bastrop_tx"`
- `localCodeSource: "corpus"`
- `coverage.degraded: false`
- Corpus hits with Municode `sourceUrl`; `meta.disclaimer` has **no** web-scraped prefix

## Attachment presign contract (handed to extension-agent)

See `docs/property-brief-extension-encumbrances.md`. Summary:

| Step | Method | Path |
|---|---|---|
| Presign | `POST` | `/api/brokerage/v1/workspaces/encumbrances/request-upload-url` |
| Upload | `PUT` | `<uploadURL>` from presign response |
| Complete | `POST` | `/api/brokerage/v1/workspaces/encumbrances/complete-upload` |

**Auth:** `Authorization: Bearer <BROKERAGE_EXTENSION_PUBLIC_KEY>` + `X-Hauska-Install-Id` (same as `/brief`).

**Presign body:** `{ workspaceDid, name, size, contentType: "application/pdf" }` — max **25 MiB**.

**Presign response:** `{ uploadURL, objectPath, workspaceDid, metadata }`.

**Complete body:** `{ workspaceDid, objectPath, name, size, contentType: "application/pdf" }`.

**Complete response:** `201` + `{ workspaceDid, listingKey, instruments[], clauses[] }`.

**Tenancy:** `accessPolicy: tenant-private`; rows keyed by `installId` + `listingKey` — never pooled.

Brief CTA for extension_public (`meta.encumbranceUploadCta`): `requestPath`, `completePath`, `maxBytes: 26214400`, `contentType: "application/pdf"`.

## Tests / CI

- `lib/codes` — `jurisdictions.test.ts`, `webCodeFetch.test.ts` (expanded unwarmed-key web targets) — **pass**
- `artifacts/api-server` — `typecheck` — **pass**
- Route integration tests (`brokerageExtensionPublic`, `brokerageEncumbrances`) require `DATABASE_URL` (not set on this workstation); updated test expectations in repo.

## G2 boundary

Unchanged: non-Cotality national baseline (FEMA, OZ, MUD/PID, USGS) fires on geocode for all addresses. Cotality-derived layers remain on existing `packageTier` / investor depth posture — no new public Cotality exposure.
