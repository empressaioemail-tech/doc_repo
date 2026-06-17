# cc-agent-C close — Track 1 finish (coordinated canary verify → shift) (2026-06-16)

**Agent:** cc-agent-C (coordinated by single planner agent)  
**PR:** #183 merged — engine envelope honesty passthrough + presign uploads  
**Prod revision after shift:** `cortex-api-00174-rug` @ **100%** (supersedes prior close note's `00173-tet` canary-only state)

---

## STEP 1 — Cross-repo honesty proof (PASS)

**Config verified:** cortex canary `00174-rug` has `ENGINE_API_URL=https://envelope-canary---hauska-engine-api-h7gvu7rgcq-uc.a.run.app` (all five `ENGINE_SPINE_*=1`).

**404 Remodel_B keystone (Miami PDF vision path): FAIL** — puppeteer Chrome launch timeout on Cloud Run *before* engine-api is called (mislabeled `engine_api_unknown`). Stack from prod log:

```
TimeoutError: Timed out after 30000 ms while waiting for the WS endpoint URL to appear in stdout!
    at ChromeLauncher.launch (.../puppeteer-core/.../BrowserLauncher.ts:251:15)
    at async renderPdfPagesToPng (.../pdfPageRenderer.ts:59:19)
    at async gatherPlanSetVisionImages (.../planSetVision.ts:51:19)
```

**San Marcos Revit-sheet path (no PDF puppeteer): PASS** — authenticated plan review on canary proves #72 emit → #183 consume.

```
POST /api/submissions/dd5f2573-8917-4b64-ae5d-47a5e97b1eca/findings/generate
HTTP 202
{"generationId":"f83c1d82-a013-48fc-bb92-6cbfb6fc4ba2","state":"pending"}

GET .../findings/status (terminal)
HTTP 200
{
  "generationId": "f83c1d82-a013-48fc-bb92-6cbfb6fc4ba2",
  "state": "completed",
  "completedAt": "2026-06-16T20:58:58.095Z",
  "engineHonesty": {
    "confidence": { "value": 0.35, "kind": "asserted" },
    "dataVintage": "2026-06-11T17:44:52.688Z",
    "coverage": {
      "degraded": true,
      "reason": "partial: precedence not reconciled (no multi-standard topic overlap)"
    },
    "source": {
      "adapter": "finding-engine:anthropic",
      "citationIds": [
        "b07c7180-8922-4576-a66f-d73493a711a8",
        "de6465e3-99ae-427e-bc4b-d068212f55b1",
        "90667fd3-7cca-48fb-8ee3-fc7217a37eb8",
        "reasoning:irc-2021:irc-r301-1",
        "reasoning:irc-2021:irc-r301-2-1"
      ]
    }
  }
}
```

Not conservative fallback (`degraded:false` + `dataVintage:null` + `adapter:engine-api`).

---

## STEP 3 — Shift sequence (executed)

1. **engine-api** shifted first → `hauska-engine-api-00006-lap` @ 100% (planner agent, gcloud).
2. **cortex-api** `run-migrations` → GH Actions run `27647784065`:

```
migrate-prod: connected to ***ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb
migrate-prod: 41 migration file(s) in lib/db/drizzle/
migrate-prod: 41 migration(s) already tracked as applied
migrate-prod: pending migrations:
  (none — DB is at the head)
```

3. **cortex-api** `shift-traffic` → GH Actions run `27647853717` (healthz smoke green).

**Post-shift leak guard:**

```
curl.exe -sk https://cortex-api-tds7av26va-uc.a.run.app/api/engagements
[]
```

**Traffic:**

```
status:
  latestReadyRevisionName: cortex-api-00174-rug
  traffic:
  - percent: 100
    revisionName: cortex-api-00174-rug
```

---

## STEP 4 — Deploy-gated smokes on shifted prod

| Smoke | Result | Raw |
|-------|--------|-----|
| `CLASSIFICATION_LLM_MODE=anthropic` | **PASS** | `AIR_FINDING_LLM_MODE=anthropic`, `BRIEFING_LLM_MODE=anthropic`, `CLASSIFICATION_LLM_MODE=anthropic`; no `*_LLM_MODE=mock` (MNML/DXF mock expected) |
| `GET /api/engagements` unauth | **PASS** | `[]` |
| retrieval `/healthz/` db=up | **PASS** | see E close note |
| Cotality San Marcos flip | **FAIL** | `cotality:property` → upstream geocode HTTP 404 (not 401; demo keys valid until 2026-07-06) |
| Large PDF presign (>4 MiB) | **FAIL** | `HTTP 500 {"error":"presign_failed"}` — SA lacks `iam.serviceAccounts.signBlob` |
| 404 Remodel_B keystone | **FAIL** | puppeteer WS timeout (same root cause as STEP 1 Miami path) |

Cotality outcome excerpt:

```json
{
  "adapterKey": "cotality:property",
  "status": "failed",
  "error": {
    "code": "upstream-error",
    "message": "Cotality property-geocode responded HTTP 404. Use Force refresh to retry."
  }
}
```

---

## HR-13 local test (verbatim)

```
pnpm --filter @workspace/engine-core test -- src/__tests__/envelope.test.ts

 ✓ src/__tests__/envelope.test.ts (4 tests)

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

---

## Open residues (honest)

1. **Puppeteer PDF vision on Cloud Run** blocks Miami 404 Remodel_B keystone (and any engagement with attached PDF plan sets). Fix: Cloud Run Chrome launch args (`--disable-dev-shm-usage`) and/or graceful fallback when vision render fails (do not mislabel as `engine_api_unknown`).
2. **GCS presign IAM** — grant `roles/iam.serviceAccountTokenCreator` to cortex runtime SA for attached-documents presign path.
3. **Cotality geocode 404** on San Marcos parcel — investigate address/coords vs Cotality property-geocode API (not key expiry).
4. **ENGINE_API_URL hygiene** — live revision still points at `envelope-canary---` tag URL; functionally OK after E shift but next deploy should bake default `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`.

## Rollback handles

- cortex-api: `gcloud run services update-traffic cortex-api --to-revisions cortex-api-00171-wek=100 --region=us-central1 --project=legacy-design-tools-prod`
- engine-api: `gcloud run services update-traffic hauska-engine-api --to-revisions hauska-engine-api-00004-xpl=100 --region=us-central1 --project=hauska-prod-497015`
