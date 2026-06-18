# cc-agent-C close — Central TX deepen (building-code adoption layer)

**Date:** 2026-06-17  
**Agent:** cc-agent-C (Cursor)  
**Program:** [`61a_central_tx_coverage_program.md`](../61a_central_tx_coverage_program.md)  
**Repo:** `legacy-design-tools` @ `feat/codewarm-wedge-cities-neon`  
**Target:** Deployment Neon (`DEPLOYMENT_DATABASE_URL` via GCP Secret Manager, workstation `cente`)

---

## Executive summary

Layer 1/2 (adopted I-Codes + local amendments) reasoning deepen is **shipped as tooling + adoption manifests** and **executed for Austin** on deployment Neon. **San Antonio deepen is in flight** (direct run, ~$200 budget). Remaining Tier-A cities are queued behind it via `deepen-central-tx-batch.ps1`. **Class B Municode onboards** (Waco, Temple, San Marcos, Seguin, Cibolo, Belton, Universal City) remain blocked on Layer 3 onboard before reasoning deepen.

**ICC contract:** landed, but **no `ICC_CODE_CONNECT_*` secrets** in `legacy-design-tools-prod` GCP Secret Manager yet — IFC/IPMC still depend on UpCodes HTML + partial ICC HTML; full authoritative IFC/IPMC unlock awaits secret wiring.

---

## Per-jurisdiction verified-rate table (before → after)

| Priority | Jurisdiction | Adopted package (confirmed) | Reasoning atoms | Verified % before | Verified % after | Cost (USD) | Status |
|---:|---|---|---|---:|---:|---:|---|
| 1 | **Austin** | IRC/IBC/IECC/IFC **2024** + UMC/UPC **2024** + A117.1 + NEC deeplink + TAS 2012 | 1,281 | **38.6%** (495/1281) | **33.2%** (425/1281) | **$2.73** | Deepened — see regression note |
| 2 | **San Antonio** | IRC/IBC/IFC **2024** + IECC **2021** + IMC/IPC/IFGC 2021 | 13 (partial) | 0% | *(in flight)* | *(est. ≤$200)* | Deepen running |
| 3 | Round Rock | IRC/IBC/IECC/IFC 2024 + IMC/IPC/IFGC 2021 | 0 | 0% | — | — | Queued |
| 4 | Georgetown | same 2024 corridor package | 0 | 0% | — | — | Queued |
| 5 | Hutto | same | 0 | 0% | — | — | Queued |
| 6 | Leander | same | 0 | 0% | — | — | Queued |
| 7 | New Braunfels | same | 0 | 0% | — | — | Queued |
| 8 | Dripping Springs | same | 0 | 0% | — | — | Queued |
| 9 | Killeen | IRC/IBC/IECC/IFC **2021** package | 0 | 0% | — | — | Queued |
| 10 | Schertz | 2021 package | 0 | 0% | — | — | Queued |
| 11 | Boerne | 2021 package | 0 | 0% | — | — | Queued |
| — | **Class B** (7 cities) | *(not configured — L3 Municode onboard first)* | 0 | 0% | — | — | **Blocked** |

**SECO statewide floors** (all configured jurisdictions): 2015 IRC Ch.11 residential, 2015 IECC commercial, TAS 2012.

### Austin family highlights (after deepen)

| Family | Verified rate after | Notes |
|---|---:|---|
| IBC 2024 | 33.7% | In-force commercial core |
| IFC 2024 | 50.5% | Partial ICC HTML path |
| IRC 2024 | 29.1% | Residential rehab / ADU reasoning |
| UMC 2024 | **17.5%** | Chapter-page driver still weak |
| UPC 2024 | **23.9%** | Chapter-page driver still weak |
| A117.1 2017 | **6.5%** | Regression from re-warm upsert |
| IFC 2021 / IPMC 2021 | 0% / 0% | Stale 2021 tail + ICC-gated |
| NEC / NFPA | 100% | Deeplink-only |
| TAS 2012 | 81.8% | Mostly deeplink |

### Austin regression note

Re-deepen **clobbered previously verified A117.1 atoms** (80.4% → 6.5%) because codewarm upsert overwrites `verificationState` on re-fetch failure. **Follow-up:** skip downgrade when existing atom is `verified` and new fetch is unverified (preserve verified corpus).

UMC/UPC re-warm logged **0% verified on fetched rows** despite new bare-numeric section extractor — UpCodes chapter-page HTML still does not match driver expectations; needs dedicated UMC/UPC chapter driver (queued deepener).

---

## ICC-gated content still needed

| Code family | Jurisdictions affected | Current state | Unblock |
|---|---|---|---|
| **IFC** (2021 tail + partial 2024) | All Tier-A with fire code in package | Austin IFC 2024 @ 50.5%; IFC 2021 @ 0% | ICC Code Connect secrets + `icc` driver body fetch |
| **IPMC** | Cities on 2021 package (Killeen, Schertz, Boerne, SA IMC/IPC tail) | Austin IPMC 2021 @ 0% | Same |
| **IFC/IPMC HTML** | San Antonio, corridor 2024 | `lib/codewarm/src/targets.ts` now prefers `icc` before `upcodes` for IFC/IPMC | Secrets + driver smoke |

GCP check (`gcloud secrets list --project=legacy-design-tools-prod --filter="name:ICC"`): **no ICC secrets present**.

---

## Code delivered (uncommitted on branch)

| Path | Purpose |
|---|---|
| `scripts/centralTxAdoption.mjs` | Per-jurisdiction adopted manifest lists (61a batched edition verification) |
| `scripts/deepen-central-tx-jurisdiction.mjs` | Single-jurisdiction deepen + before/after report |
| `scripts/deepen-central-tx-batch.ps1` | Priority-queue batch orchestrator ($200/jurisdiction cap) |
| `scripts/report-verified-rates.mjs` | Verified-rate reporter (`buildVerifiedRateReport` export) |
| `lib/codewarm/src/targets.ts` | IFC/IPMC: `icc` driver before `upcodes` |
| `lib/codes/src/webCodeFetch/extract.ts` | UMC/UPC bare `401.2 Title` heading pattern |

**Harness fix:** removed `spawnSync` nested-pnpm deadlock in deepen script (stdout pipe stall under `Tee-Object`).

**Related (prior dispatch, same branch):** `artifacts/api-server/src/lib/brokeragePilotCoverage.ts` — `neon` tier when `code_atoms` OR `reasoning_atoms` > 0; drops `regrid`, sets `icc: active`.

---

## Commands run

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\cente\google-cloud-sdk\smartcity-agent-key.json"
$env:DATABASE_URL = (gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project=legacy-design-tools-prod)
$env:NODE_OPTIONS = "--use-system-ca"
$env:CODEWARM_CATALOG_DIR = "P:\doc_repo\_catalog\codes"

# Baseline verified rates (all priority jurisdictions)
pnpm --filter @workspace/scripts exec tsx report-verified-rates.mjs

# Austin deepen (priority 1)
pnpm --filter @workspace/scripts exec tsx deepen-central-tx-jurisdiction.mjs austin_tx --budget-cap 200

# San Antonio deepen (priority 2, in flight after harness fix)
pnpm --filter @workspace/scripts exec tsx deepen-central-tx-jurisdiction.mjs san_antonio_tx --budget-cap 200

# Remaining Tier-A queue (after San Antonio completes)
.\scripts\deepen-central-tx-batch.ps1 -StartAt round_rock_tx -BudgetCap 200
```

---

## Verbatim command output

### 1) Baseline — `report-verified-rates.mjs` (2026-06-17T22:26:28Z)

```
{
  "generatedAt": "2026-06-17T22:26:28.957Z",
  "jurisdictions": [
    {
      "key": "austin_tx",
      "label": "Austin, TX",
      "adoptedEditions": "IRC/IBC/IECC/IFC 2024 + UMC/UPC 2024 + A117.1 + NEC 2023 deeplink + TAS 2012",
      "secFloors": "SECO 2015 IRC Ch.11 res / 2015 IECC commercial; TAS 2012",
      "total": 1281,
      "verified": 495,
      "verifiedRate": 38.6,
      "iccGatedUnverified": 186,
      "status": "deepened"
    },
    {
      "key": "san_antonio_tx",
      "total": 0,
      "verified": 0,
      "verifiedRate": 0,
      "status": "no_reasoning_atoms"
    },
    {
      "key": "round_rock_tx",
      "total": 0,
      "verified": 0,
      "verifiedRate": 0,
      "status": "no_reasoning_atoms"
    }
    /* ... georgetown_tx, hutto_tx, leander_tx, new_braunfels_tx, dripping_springs_tx,
         killeen_tx, schertz_tx, boerne_tx — all 0 reasoning atoms;
         Class B waco/temple/san_marcos/seguin/cibolo/belton/universal_city — not configured */
  ]
}
```

Full JSON: `p:\legacy-design-tools\scripts\_verified-rates-baseline.json`

### 2) Austin deepen summary — `deepen-central-tx-jurisdiction.mjs austin_tx` (log: `scripts\_deepen-austin_tx-20260617-172651.log`)

```
{
  "ok": true,
  "jurisdictionKey": "austin_tx",
  "adoptedEditions": "IRC/IBC/IECC/IFC 2024 + UMC/UPC 2024 + A117.1 + NEC 2023 deeplink + TAS 2012",
  "totalWarmed": 463,
  "totalErrors": 0,
  "totalFetchCount": 1363,
  "totalEstimatedCostUsd": 2.7260000000000018,
  "manifestResults": [
    { "manifest": "manifest_irc_2024.yaml", "warmedCount": 115, "fetchCount": 355, "estimatedCostUsd": 0.71 },
    { "manifest": "manifest_ibc_2024.yaml", "warmedCount": 52, "fetchCount": 151, "estimatedCostUsd": 0.302 },
    { "manifest": "manifest_iecc_2024.yaml", "warmedCount": 100, "fetchCount": 338, "estimatedCostUsd": 0.676 },
    { "manifest": "manifest_ifc_2024.yaml", "warmedCount": 88, "fetchCount": 309, "estimatedCostUsd": 0.618 },
    { "manifest": "manifest_umc_upc_2024.yaml", "warmedCount": 82, "fetchCount": 164, "estimatedCostUsd": 0.328 },
    { "manifest": "manifest_accessibility_austin_2024.yaml", "warmedCount": 22, "fetchCount": 42, "estimatedCostUsd": 0.084 },
    { "manifest": "manifest_tas_2012.yaml", "warmedCount": 4, "fetchCount": 4, "estimatedCostUsd": 0.008 }
  ]
}
=== AFTER (verified rates) ===
{
  "key": "austin_tx",
  "total": 1281,
  "verified": 425,
  "verifiedRate": 33.2,
  "iccGatedUnverified": 187,
  "status": "deepened"
}
```

Elapsed: **658s** (~11 min). Exit code **0**.

### 3) San Antonio deepen (in flight — `scripts\_deepen-san_antonio_tx-20260617-224800.log`)

```
=== BEFORE (verified rates) ===
{
  "key": "san_antonio_tx",
  "adoptedEditions": "IRC/IBC/IFC 2024 + IECC 2021 (excluded from 2024 cycle)",
  "total": 13,
  "verified": 0,
  "verifiedRate": 0,
  "families": [{ "family": "ADA", "total": 13, "verified": 0, "verifiedRate": 0 }],
  "status": "shallow"
}
{
  "phase": "deepen-start",
  "jurisdictionKey": "san_antonio_tx",
  "manifestCount": 6,
  "budgetCap": 200
}
```

*(13 atoms are residue from an earlier aborted warm using wrong `--edition 2021` package; full adoption-aware deepen replaces them.)*

---

## Class B — blocked on Layer 3

These cities are **not** in `ENGINE_CORPUS_JURISDICTION_KEYS` / have no `code_atoms` on Neon. Reasoning deepen is **deferred** until Municode L3 onboard completes (separate capture dispatch):

- `waco_tx` (145k — highest leverage)
- `temple_tx`
- `san_marcos_tx` (config-ready, live customer)
- `seguin_tx`, `cibolo_tx`, `belton_tx`, `universal_city_tx`

Add adoption entries to `centralTxAdoption.mjs` after L3 onboard.

---

## Acceptance / next steps

| Item | Owner | State |
|---|---|---|
| Commit deepen tooling + driver fixes on `feat/codewarm-wedge-cities-neon` (or new branch) | cc-agent-C | **Ready** |
| Merge + deploy coverage tier fix (`brokeragePilotCoverage.ts`) | orchestrator | PR pending |
| Complete San Antonio → corridor batch deepen | cc-agent-C | **In flight** |
| Wire ICC Code Connect secrets to GCP + smoke IFC/IPMC | ops + cc-agent-C | **Blocked on secrets** |
| Codewarm upsert: preserve verified on failed re-fetch | cc-agent-C | **Queued** |
| UMC/UPC dedicated chapter-page driver | cc-agent-C | **Queued** |
| Class B Municode L3 onboard | separate capture dispatch | **Not started** |

---

## Log artifacts

| File | Content |
|---|---|
| `scripts/_verified-rates-baseline.json` | Pre-deepen rates all jurisdictions |
| `scripts/_deepen-austin_tx-20260617-172651.log` | Full Austin deepen verbatim |
| `scripts/_codewarm-austin_tx-2024.log` | Prior Austin 2024 warm ($2.55) |
| `scripts/_deepen-san_antonio_tx-*.log` | San Antonio deepen (when complete) |
