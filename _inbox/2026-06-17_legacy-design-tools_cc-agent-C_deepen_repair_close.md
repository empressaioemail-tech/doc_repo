# cc-agent-C close — safe deepen rebuild + regression repair

**Date:** 2026-06-17  
**Branch:** `feat/codewarm-wedge-cities-neon`  
**Batch status:** **PAUSED** (`deepen-central-tx-batch.ps1` requires `-AllowBatch` after merge)

---

## Process fix (safe by construction)

| # | Control | Implementation |
|---|---------|----------------|
| 1 | Verified high-water mark | `mergeVerificationState` + `verifyBeforePromote` in `upsertReasoningAtomFromWebFetch` |
| 2 | Skip verified atoms | `incrementalDeepen` → `verified-skipped` in `runCodewarmBatch` |
| 3 | Verify-before-promote | Failed re-fetch returns existing row unchanged |
| 4 | Run-level gate | `snapshotReasoningVerification` + auto-`rollbackReasoningVerification` if after < preDeepen floor |
| 5 | Gap-only deepen | `deepenManifests` per jurisdiction (UMC/UPC, IFC, A117, TAS for Austin) |

---

## Damage repair audit

| Jurisdiction | Pre-deepen | Regressed | After repair | Restored atoms | Meets baseline |
|---|---:|---:|---:|---:|---|
| **austin_tx** | **38.6%** (495/1281) | 33.9% | **45.5%** (583/1281) | 151 | **YES** |
| **san_antonio_tx** | 0% | 0% | 0% | 0 | YES |

### Austin family repair (key regressions)

| Family | Pre-deepen | Regressed | After repair |
|---|---:|---:|---:|
| A117.1 2017 | **80.4%** (37/46) | 0% → 6.5% | **80.4%** (37/46) |
| IBC 2024 | **66.3%** (65/98) | 33.7% | **66.3%** (65/98) |
| IRC 2024 | 31.6% | 30.8% | **31.6%** |

Repair method: `restoreGroundedReasoningAtoms` — re-promote atoms with any `sources[].verified === true` (verified-source high-water mark). No pre-deepen DB snapshot existed; source-link evidence was sufficient.

San Antonio deepen ($3.81 run) added atoms but remained 0% verified — no regression below 0% baseline.

---

## Resume gate

1. Merge `feat/codewarm-wedge-cities-neon` (safe deepen + coverage tier fix)
2. `.\scripts\deepen-central-tx-batch.ps1 -AllowBatch -StartAt san_antonio_tx`
3. Use gap `deepenManifests` only — never `--full-package` on warmed jurisdictions

---

## Commands

```powershell
# Repair (completed)
pnpm exec tsx repair-deepen-regression.mjs

# Safe deepen (single jurisdiction)
pnpm exec tsx deepen-central-tx-jurisdiction.mjs austin_tx --budget-cap 200

# Batch (blocked until -AllowBatch after merge)
.\scripts\deepen-central-tx-batch.ps1 -AllowBatch -StartAt round_rock_tx
```
