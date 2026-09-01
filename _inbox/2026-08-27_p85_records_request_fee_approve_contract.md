---
id: 2026-08-27_p85_records_request_fee_approve_contract
title: P-85 W1 lane 0 — Records Request county fee approve/decline wire contract
date: 2026-08-27
status: active
plan_row: P-85
wdll_items: "6, 12"
---

# Fee approve / decline API contract (frozen W1)

## Routes (PE bridge, authenticated)

Base: `/api/property-explorer/v1/records-request`

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/:jobId/approve-purchase` | User approves projected county image fees; job resumes acquisition |
| `POST` | `/:jobId/decline-purchase` | User declines fees; job completes header-only |

Both require PE session (`requirePeAuthenticated`). Job must belong to requesting `userId`.

## Eligible job statuses

| Action | Allowed `records_request_jobs.status` |
|--------|--------------------------------------|
| approve | `awaiting-purchase-approval`, `needs-human` |
| decline | `awaiting-purchase-approval`, `needs-human` |

Additional guard: `scope_searched.acquisition.pendingPurchaseCount > 0` OR `scope_searched.awaitingPurchaseApproval === true` OR `error_code === 'awaiting-purchase-approval'`.

## Approve — server behavior

1. Validate job + user ownership + eligible status.
2. Merge `request_payload`: `{ purchaseApproved: true, purchaseApprovedAt: ISO8601 }`.
3. Set `status = 'queued'`, clear `error_code` / `error_message`, clear `completed_at`.
4. `POST RECORDS_REQUEST_WORKER_URL` with `{ jobId }`.
5. Response **202**:

```json
{
  "jobId": "uuid",
  "jobStatus": "queued",
  "status": "accepted",
  "purchaseApproved": true
}
```

## Decline — server behavior

1. Validate job + user + eligible status.
2. Merge `scope_searched`: `{ acquisitionDeclined: true, finishReason: "header-only" }` (preserve indexHits).
3. Set `status = 'complete'`, clear errors, set `completed_at = now()`.
4. Response **200**:

```json
{
  "jobId": "uuid",
  "jobStatus": "complete",
  "status": "complete",
  "finishReason": "header-only"
}
```

## Worker resume (lane 1C)

When `request_payload.purchaseApproved === true` and `scope_searched.indexHits` present:

- Skip index search; run acquisition-only on stored hits (must include `detailUrl` in scope).
- `acquireIndexHits({ purchaseApproved: true })` — purchase walls route to human clerk, not re-pause.

## PE client

- `approveRecordsPurchase(jobId)` → POST approve route
- `declineRecordsPurchase(jobId)` → POST decline route
- Map `awaiting-purchase-approval` and purchase-pause `needs-human` → phase `paused-fees`
- Show `projectedPurchaseCostCents` from `scopeSearched` when present

## Out of scope (W1)

- Stripe pass-through charge at approve (lane 7 billing — later)
- Bot-driven county checkout (human clerk after approve for v1)
