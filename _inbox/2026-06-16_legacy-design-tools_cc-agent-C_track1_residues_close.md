# cc-agent-C close — Track 1 residues (presign IAM, puppeteer fallback, Cotality diagnose) (2026-06-16)

**Agent:** cc-agent-C (planner session)  
**PR:** [#184](https://github.com/empressaioemail-tech/legacy-design-tools/pull/184) merged — Cloud Run PDF render args + honest plan-set vision degradation  
**Prod revision after shift:** `cortex-api-00177-vew` @ **100%**  
**Rollback handles (unchanged):** cortex → `00171-wek`; engine → `00004-xpl`

---

## 1. Presign IAM — PASS (no deploy)

**Runtime SA (from live revision):** `api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com`

```
gcloud iam service-accounts add-iam-policy-binding api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com \
  --member="serviceAccount:api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --project legacy-design-tools-prod
```

**>4 MiB presign e2e smoke (verbatim):**

```
===== PRESIGN HTTP 200 =====
{"uploadURL":"https://storage.googleapis.com/legacy-design-tools-prod-objects/.private/uploads/5d58b42a-6bf0-4536-93e3-2dc1f36c7404?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=api-server-runtime%40legacy-design-tools-prod.iam.gserviceaccount.com%2F20260616%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260616T213305Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=191060059a86f7fea6b3b5fd103da763a05e3e40f7433d3326dc5b88e9564e9e72b6f1e021e90cb97b39b00c55941f85b8468fc0bfb93e129654e7e518fe84d615e99f65774d142344c2eefa17dead7481392830c56ddf3f7f8c1f42473f2ee52090caaa69aae07c48be9320e7982d1c18c014d0de2206821f654e95ba1059f6b5926a510b87ffa59cee9d0ee2ded45875c1ee5e1cae77cc3fec542e956d256202d0ed1c6feda0c47cc3d58c1ed8c15bc0082de8904d555945ba5d78ddc711344195e45b6fc24bde981300ef884322eab622243a86dce750adf757d1853ac17ed6b762e7eb62194f461dd0a7874811e9bd28efe3eeeff966435093261b6ae3a8","objectPath":"/objects/uploads/5d58b42a-6bf0-4536-93e3-2dc1f36c7404","metadata":{"name":"smoke-large-plan.pdf","size":5242880,"contentType":"application/pdf"}}

===== GCS PUT HTTP 200 =====
(empty)
```

Large-upload wedge path unblocked. (`complete-upload` returns `pdf_extract_failed` on synthetic filler bytes — expected; presign + signed PUT is the operational gate.)

---

## 2. Puppeteer + URL-bake — DEPLOYED + SHIFTED

**Code (#184):**
- `pdfPageRenderer.ts`: Cloud Run Chrome args (`--no-sandbox`, `--disable-dev-shm-usage`, `--single-process`, `--no-zygote`, etc.) + `puppeteer.executablePath()`
- `findings.ts`: try/catch around `gatherPlanSetVisionImages`; merge honest `coverage.degraded` via `mergePlanSetVisionDegradation`; no `engine_api_unknown` mislabel on vision failures
- `cloud-run-deploy.yml`: stable `ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app` (already baked; confirmed on `00177-vew`)

**Deploy:** GH `27649845657` deploy-canary → `cortex-api-00177-vew` (canary tag)  
**Shift:** GH `27650033419` shift-traffic → `00177-vew` @ 100%

### 404 Remodel_B keystone on canary (verbatim)

```
POST /api/submissions/ba5b5ae5-468c-40df-90b2-7c04b88ccef4/findings/generate
HTTP 202
{"generationId":"3915c0bc-b4c8-42c2-a40e-2720587844ce","state":"pending"}

GET .../findings/status (terminal)
HTTP 200
{
  "generationId": "3915c0bc-b4c8-42c2-a40e-2720587844ce",
  "state": "completed",
  "completedAt": "2026-06-16T21:41:32.379Z",
  "error": null,
  "invalidCitationCount": 0,
  "engineHonesty": {
    "confidence": { "value": 0.1, "kind": "asserted" },
    "dataVintage": "2026-06-11T17:33:19.222Z",
    "coverage": {
      "degraded": true,
      "reason": "partial: precedence not reconciled (no multi-standard topic overlap); plan-set vision unavailable: PDF render failed (Chrome launch)"
    },
    "source": {
      "adapter": "finding-engine:anthropic",
      "citationIds": [
        "431fedc3-ed58-4678-878e-142496c7525a",
        "3a058a35-66de-4722-a9f1-f082fe2dc7d7",
        "a7068ce8-580e-4c5a-b1e1-af4848de10d6",
        "reasoning:fbc-2023:fbc-m601-6",
        "reasoning:fbc-2023:fbc-m-ch-4",
        "reasoning:fbc-2023:fbcb-1405-4",
        "reasoning:fbceb-2023:fbceb-601-2",
        "reasoning:nec-2017:nec-art-220",
        "reasoning:nec-2017:nec-art-408"
      ]
    }
  }
}
PASS: engineHonesty fields appear populated from E-shaped envelope
```

**Outcome:** Run **completes** with real cited findings (not `engine_api_unknown` crash). Chrome launch still fails on Cloud Run despite args patch — honest degradation path fires correctly. **Follow-up:** diagnose Chrome binary/runtime on `00177-vew` (puppeteer install path, missing shared libs, or Cloud Run memory/cpu for headless).

---

## 3. Cotality geocode 404 — ROOT CAUSE (diagnose only, no fix applied)

**Symptom:** `cotality:property` layer run reports `property-geocode HTTP 404` for San Marcos engagement.

**Live probes (Property token mints HTTP 200 at `api1.cotality.com`):**

```
===== San Marcos — current adapter query (lat/lon/address) on api.cotality.com =====
URL: https://api.cotality.com/v2/properties/search/geocode?lat=29.870188&lon=-97.927538&...
HTTP: 404
(body empty)

===== San Marcos — catalog query on api1.cotality.com =====
URL: https://api1.cotality.com/v2/properties/search/geocode?streetAddress=613+Sturgeon+Dr&city=San+Marcos&state=TX&bestMatch=true
HTTP: 200
{"metadata":{"pageNumber":1,"pageSize":1,"totalRecords":1,"totalPages":1},"items":[{"clip":"8031593485",...}]}

===== Austin — catalog query on api1.cotality.com =====
HTTP: 404
{"properties":[],"messages":[{"messageType":"error","message":"Clip not found"}]}
(coverage miss for test address — not a routing bug)
```

**Root cause (two compounding bugs in `cotalityClient.ts`, not San Marcos coverage):**

| Issue | Current code | Correct |
|-------|--------------|---------|
| **(a) Wrong API host** | `COTALITY_PROPERTY_BASE_URL_DEFAULT = https://api.cotality.com/v2/properties` | Property data calls must hit **`https://api1.cotality.com/v2/properties`** (token already on api1 per vendor confirm; data host was never moved) |
| **(b) Wrong query params** | `lat`, `lon`, `latitude`, `longitude`, `address`, `fullAddress` | Catalog/doc flow: `streetAddress`, `city`, `state`, `bestMatch=true` |

Calling `api.cotality.com` returns blank HTTP 404 for all addresses. Same path on `api1.cotality.com` with catalog params returns HTTP 200 + CLIP for San Marcos.

**Proposed fix (not applied):**
1. Change default `COTALITY_PROPERTY_BASE_URL_DEFAULT` to `https://api1.cotality.com/v2/properties` (or set `COTALITY_PROPERTY_BASE_URL` env on cortex-api).
2. Update `resolveCotalityClip` to parse structured address components (or accept them from engagement parcel fields) and call geocode with `streetAddress`/`city`/`state`/`bestMatch=true`.
3. Map HTTP 404 with `"Clip not found"` body to `no-coverage` (coverage gap), distinct from blank 404 (routing bug).

---

## Production state

| Service | Revision | Traffic | Notes |
|---------|----------|---------|-------|
| cortex-api | `00177-vew` | 100% | Stable `ENGINE_API_URL`; #184 puppeteer + vision fallback |
| hauska-engine-api | `00006-lap` | 100% | Unchanged from Track 1 finish |
