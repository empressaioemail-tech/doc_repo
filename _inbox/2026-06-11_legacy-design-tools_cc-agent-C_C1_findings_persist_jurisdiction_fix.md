# C1 findings persist + jurisdiction key synthesis — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/findings-persist-coverage-scope` (amendment to merged #171)  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/172  
**SHA:** `bc46f06`  
**Worktree:** `P:\ldt-cortex-findings-persist`

---

## Reproduced verbatim error (P0 — pre-fix canary)

engine-api request log (spine produced findings):

```
2026-06-11T05:49:15Z  POST /v1/findings/generate-orchestrated  200
```

cortex-api `cortex-api-00151-tax` finding-gen, Miami 404 Remodel_B (engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`):

```
05:50:23  finding generation: orchestrated pass completed
05:50:24  finding generation: row insert failed — continuing
05:50:24  finding generation: row insert failed — continuing
05:50:24  finding generation: completed
```

Row-insert error payload (both findings, verbatim):

```json
{"atomId":"finding:56c21164-cfb7-492e-98b1-6461e4c4ab3e:MQ92W0U17UDY4IZU",
 "err":{"message":"value.toISOString is not a function",
        "stack":"TypeError: value.toISOString is not a function\n  at PgTimestamp.mapToDriverValue (drizzle-orm/.../pg-core/columns/timestamp.ts:68:16)\n  ..."}}
```

San Marcos pre-fix (engagement `6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2`):

```
05:44:25  finding generation: no jurisdiction key resolved — skipping code retrieval
05:44:26  POST /v1/findings/generate-orchestrated  200
05:44:40  finding generation: completed     (0 findings; nothing retrieved to ground against)
```

---

## Fix locations

### P0 — rehydrate spine-returned timestamps to `Date` before persist (merged #171)

| File | Lines | What |
|------|-------|------|
| `artifacts/api-server/src/lib/engineSpineDeserialize.ts` | 1–48 | `rehydrateSpineFindingsResult` — `findings[].aiGeneratedAt` + `generatedAt` ISO→Date |
| `artifacts/api-server/src/lib/engineSpineRouting.ts` | 81, 105 | Both spine finding routes return rehydrated result |

### P1 — jurisdiction key synthesis scoped to finding path (#172 amendment)

| File | Lines | What |
|------|-------|------|
| `lib/codes/src/jurisdictions.ts` | 214–310 | `keyFromEngagement` restored registered-only; new `keyFromEngagementOrSynthesize` |
| `artifacts/api-server/src/routes/findings.ts` | 534 | Finding grounding uses `keyFromEngagementOrSynthesize` only |
| `lib/codes/src/webCodeFetch/reviewTargets.ts` | 55–95 | `TEXAS_WEB_FIRST_REVIEW_TARGETS` for synthesized unwarmed `_tx` keys only |
| `lib/coverage/src/resolveEngagementCoverage.ts` | 61 | Unchanged — still calls registered-only `keyFromEngagement` |

**Operator amendment satisfied:**
- `resolveEngagementCoverage.test.ts:41` — Pagosa Springs → `not_in_catalog` (unchanged)
- San Marcos finding path → `san_marcos_tx` via `keyFromEngagementOrSynthesize` (unit + route test)

---

## Local verification

```
pnpm run typecheck          # PASS
lib/codes jurisdictions.test.ts   # PASS (keyFromEngagement null for San Marcos; OrSynthesize → san_marcos_tx)
lib/coverage resolveEngagementCoverage.test.ts  # PASS (Pagosa → not_in_catalog)
```

---

## Acceptance runs (canary — BLOCKED pending deploy)

### P0 — Miami 404 Remodel_B (`15d1d314-...`)

**Status:** NOT RUN — requires canary image with #171+#172.

### P1 — San Marcos 613 Sturgeon_A (`6d9cd127-...`)

**Status:** NOT RUN — requires canary redeploy.

**Expected:** `jurisdictionKey: san_marcos_tx`, web supplement fires, findings persist with web-source provenance. Coverage for same engagement remains `not_in_catalog`.

---

## PR + SHA

| PR | Status | Notes |
|----|--------|-------|
| [#171](https://github.com/empressaioemail-tech/legacy-design-tools/pull/171) | **MERGED** | P0 + initial P1 (coverage leak) |
| [#172](https://github.com/empressaioemail-tech/legacy-design-tools/pull/172) | **OPEN** | Operator amendment — scope synthesis to finding path |

**HEAD SHA:** `bc46f06` — CI green (Typecheck ✅ Test ✅ Rubric ✅)

---

## Blockers (verbatim)

1. **#171 merged with coverage regression** — fixed in #172; operator must merge #172 before canary re-run.
2. **Canary acceptance not executable from agent workstation** — operator redeploy + HR-8 logs pending.

---

## Post-merge (operator)

Merge #172 → redeploy canary → re-run Miami (persist) + San Marcos (synthesize key + web-ground) → bake `ENGINE_SPINE_*` into `cloud-run-deploy.yml` → shift traffic.
