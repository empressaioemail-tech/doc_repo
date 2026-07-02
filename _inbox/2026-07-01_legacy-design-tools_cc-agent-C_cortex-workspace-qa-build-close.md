---
title: Cortex workspace QA build close — cc-agent-C
date: 2026-07-01
agent: cc-agent-C
status: complete
---

## Deployed revision
cortex-api-00263-roq

## What shipped
- **Wave 0:** PR #209 already merged (map tile URL fallback, confidence NaN guard, save-space localStorage) — verified live before Wave 1.
- **Wave 1:** Grid fills container height; resize handles track colFr/rowFr with container-relative drag; delete (×) on saved custom workspace chips (`be8d8082`).
- **Wave 2:** Intake & Upload tile; BFF routes for engagement create, document presign/complete, submission create; queue refresh wiring; Plan Review preset includes intake + queue (`45392a82`).
- **Wave 3:** BFF letter GET/generate routes; editable letter tile with regenerate/copy/download (`45392a82` + letter eligibility fix `f7d08dd2`).

## Verification results

### Live prod (`https://cortex-api-tds7av26va-uc.a.run.app`)

```
[x] /api/healthz → 200 {"status":"ok"}
STATUS:200
{"status":"ok"}

[x] /api/plan-review/queue → array of engagements
STATUS:200
[{"id":"c7c57c7e-76b5-43eb-9979-1729509e022e","engagementId":"cc2e0a30-412a-46b8-b680-38ebfbed5d4a","engagementName":"146 S Fredricksburg","status":"pending","reportRunState":null,"openFindingCount":2,"daysInQueue":15},...]

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a → engagement object
STATUS:200
{"id":"cc2e0a30-412a-46b8-b680-38ebfbed5d4a","name":"146 S Fredricksburg","jurisdiction":"San Marcos, TX","address":"146 S Fredricksburg San Marcos TX, 78666","apn":null,"applicantName":"Alex Fanning","latitude":29.870836,"longitude":-97.949578,"reportResults":{}}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/letter → { draft, generatedAt }
STATUS:200
{"draft":null,"generatedAt":null}
```

### Canary smoke (pre-shift)
```
CANARY STATUS:200
{"status":"ok"}
https://canary---cortex-api-tds7av26va-uc.a.run.app/api/healthz
```

### Deploy sequence executed
1. Push to main triggered build (`28554520954` — success)
2. `deploy-canary` → revision `cortex-api-00263-roq` (`28554669876`)
3. `run-migrations` (`28554749074` — success)
4. Canary healthz 200
5. `shift-traffic` → 100% `cortex-api-00263-roq` (`28554790603` — smoke-probe passed)

### Local (`localhost:19592/codex-reviewer-qa/`)
Not run on this workstation (dev server not started). Code review + adversarial sub-agents GREEN on Wave 1; Wave 2+3 GREEN after D1 letter eligibility fix.

```
[ ] Grid fills container height in all presets (no stacking at top) — code shipped, not browser-verified
[ ] Resize handles sit at actual cell boundary — code shipped, not browser-verified
[ ] Drag updates grid without glitch — code shipped, not browser-verified
[ ] Map tile loads — Wave 0 shipped (#209), not browser-verified
[ ] Confidence values show as percentage or "—" — Wave 0 shipped (#209), not browser-verified
[ ] Save space → name prompt → chip appears in SpaceBar — Wave 0 shipped (#209), not browser-verified
[ ] Delete (×) on saved chip — Wave 1 shipped, not browser-verified
[ ] Intake tile: fill form + upload PDF → engagement in queue — shipped, not browser-verified
[ ] Select engagement → Compliance Run/Topography/Drainage receive context — BFF unscoped reads (#207/#208), not browser-verified
[ ] Letter tile: draft generates, textarea editable, copy works — shipped, not browser-verified
```

## Remaining issues / deferred
- Letter drafts stored in-process (`planReviewLetterDrafts` Map) — survive only until instance restart; textarea edits not persisted server-side across reload.
- No automated tests for new Wave 2/3 BFF routes (create/upload/submission/letter).
- Partial upload failure leaves orphan engagement without queue entry (no transaction rollback).
- BFF presign has no upload size cap (unlike `sheetContent` 413 guard).
- Plan Review preset now has 5 tiles on layout `6` — one grid cell may be empty; overflow bar handles >4 tiles only.

## Rollback handle
cortex-api-00254-tad (`--to-revisions cortex-api-00254-tad=100`)
