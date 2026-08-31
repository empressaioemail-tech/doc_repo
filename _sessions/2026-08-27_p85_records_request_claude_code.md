---
date: 2026-08-27
topic: P-85 Records Request deploy, entitlements, status canvas
agent: claude_code (cursor)
plan_row: P-85
---

# Session: P-85 Records Request — deploy and status close

## Summary

Continued P-85 from a stale canvas (2026-08-26T23:54Z). Deployed the Playwright worker to Cloud Run, wired cortex `RECORDS_REQUEST_WORKER_URL`, registered reachability scaffold recipes for all five CAPCOG counties plus McLennan, drained stuck queued jobs (Bastrop complete, Williamson 403), fixed dev-account report entitlements (dev_role + PE deploy), and produced an updated status canvas plus handoff for the next agent.

## Decisions / actions (no new ADRs)

- Worker deployed manually via Cloud Build (local Docker unavailable); Playwright pinned 1.59.1 to match base image
- dev_role granted prod for `empressaioemail@gmail.com` and `dev@smartcityos.io`
- REC report gate aligned with property-tier (not Studio-only) for operator testing; production Studio gate (item 13) still open

## Shipped / verified

| Artifact | Evidence |
|----------|----------|
| records-request-worker | rev `00002-nzx`, image `p85-v2` |
| cortex RECORDS_REQUEST_WORKER_URL | env set on cortex-api |
| Bastrop jobs | 2× complete (bastrop-aumentum scaffold) |
| Williamson job | failed portal-unreachable HTTP 403 |
| smartsite.cloud | `dpl_68wKekUURW8GL8oKY3GbChRkpYMC` |
| LDT PR | #482 open |
| hauska-map PR | #228 open |

## Open (next session)

1. Merge #482, #228
2. Item 5 recipe depth (search, not reachability); Williamson 403
3. Items 6–10 product pipeline
4. Item 11 email provider
5. Item 13 Stripe Studio price ids
6. Item 15 graded sample

## Docs touched

- `_inbox/2026-08-27_p85_records_request_status_canvas.md` (new)
- `_inbox/2026-08-27_p85_records_request_handoff.md` (new)
- `_scratch/p85-easements.md` (ground-truth updates)
- `_state/property/STATE.md` (P-85 block added)

## Atom refs

None.

## Model

Cursor agent (Composer).
