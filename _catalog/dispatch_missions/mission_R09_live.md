You MUST NOT spawn sub-agents. Do not commit. Do not git add/commit/push. Do not write product repos. Do not touch P:/legacy-design-tools (dirty, forbidden). Do not mint absence atoms. Do not run --apply.

Plan row R-09. Seat: you may use gcloud from this machine. Operator approved traffic then recompute 2026-08-21 (`_decisions/2026-08-21_r09_traffic_then_recompute.md`).

## Sequence. Do not reorder.

0. Snapshot. `gcloud run services describe cortex-api --project=legacy-design-tools-prod --region=us-central1 --format=json`. Read `status.traffic[].revisionName` and `status.traffic[].percent` BY NAME from JSON, never `--format=value(...)`. Read `cortex-api-00525-bev` container image digest from `gcloud run revisions describe cortex-api-00525-bev --format=json`. Expected digest `sha256:fb022229b5b2d59a7d56d549e1e01f8cb6d51ce40299fdda7806b4d1694a2141`. If digest differs, STOP and report. Do not shift traffic onto an unverified image.

1. Shift 100% to 00525-bev. No split. Leave 00524-pit unused. Confirm with another JSON describe that 00525-bev is 100 and 00522-row is 0.

2. GET `https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger`. Confirm `computedAt` is still `2026-08-21T12:48:59.242Z` (or whatever step 0 GET showed). Confirm hasWriter still constant. If computedAt already moved, STOP: someone else recomputed.

3. POST non-dry recompute from the SERVING url, not the canary url:
   `POST https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger/recompute?probe=skip`
   Body `{}`. Auth: Bearer from secret SERVICE_API_KEY in project legacy-design-tools-prod if you can read it; if you cannot, STOP and say so. Do NOT omit probe=skip (full probe 504s at 300s as the residual). A 504 is NOT a failure. The transaction can land after the client is cut. Poll GET until `computedAt` changes or 10 minutes elapse.

4. On the new snapshot, name cells:
   - 48001:easement hasWriter (expect not the old constant true)
   - 48001:geometry atomFamilyState
   - one zoning cell isPartial
   Count how many cells are not (hasWriter true AND atomFamilyState present AND isPartial false). Quote the counting rule. Denominator is summary.totalCells from the payload.

5. Write `_inbox/2026-08-21_r09-live_close.json` with traffic JSON excerpts (revisionName, percent, image digest), before/after computedAt, named cells, whether DC-4/DC-5 can fail on this snapshot (they count displayState no-atom/no-writer; say what those counts are; do not fold indeterminate into them).

## Pre-registered falsifiers

- Positional gcloud formatter
- Recompute before 100% on 00525-bev
- Treating 504 as failed recompute without reading computedAt
- Shifting traffic if digest is not the pinned one

## Return

The close JSON path. Serving revision and percent. Digest. computedAt before and after. The three named cells. DC-4 and DC-5 counts. If you could not auth, stop after step 0 and file that.
