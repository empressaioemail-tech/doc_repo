---
id: 2026-08-27_p85_records_request_handoff
title: Handoff — P-85 Records Request (fresh agent)
date: 2026-08-27
status: active
plan_row: P-85
---

# Handoff: P-85 Records Request

**Filed:** 2026-08-27  
**From:** doc_repo planner session (P-85 deploy + entitlements + status)  
**To:** Fresh lane agent (property seat)  
**Re:** Continue P-85 after plumbing deploy; recipe depth and product pipeline remain

---

## Copy-paste prompt for fresh agent

```
You are the property-seat lane agent for P-85 Records Request (OPS-16 plan row P-85).

READ FIRST (in order):
1. P:/doc_repo/_STATE.md
2. P:/doc_repo/_inbox/2026-08-27_p85_records_request_status_canvas.md  ← current truth
3. P:/doc_repo/_inbox/2026-08-26_p85_central_texas_easements_WDLL.md   ← acceptance items
4. P:/doc_repo/_scratch/p85-easements.md                                 ← ground-truth log

REPOS (do not cross-write):
- Backend: P:/seat-worktrees/property/legacy-design-tools (cortex-api + worker)
- Frontend: P:/seat-worktrees/property/hauska-map-records (smartsite / property-explorer)

WHAT IS DONE (prod, 2026-08-27):
- Migrations 0084 applied; #479, #480, #225 merged
- records-request-worker Cloud Run live (image p85-v2); RECORDS_REQUEST_WORKER_URL on cortex
- All 6 county portals registered with reachability scaffold recipes (entry page only)
- Bastrop jobs complete in prod; Williamson TylerHost failed HTTP 403
- smartsite REC UI + live job status; dev_role on empressaioemail@gmail.com + dev@smartcityos.io

OPEN PRs — MERGE FIRST:
- legacy-design-tools #482 (worker recipes + deploy workflow env)
- hauska-map #228 (devRole studio grant + honest records status)

YOUR MISSION — in order:
1. Merge #482 and #228 if CI green
2. WDLL item 5: Real portal search (not reachability only)
   - Fix Williamson: try williamson-publicsearch default or harden Tyler 403
   - Operator-run reachability proofs: Travis, Hays, Caldwell
   - Tyler login + search proof on Williamson + Hays
3. WDLL item 6: Acquire instruments (download / purchase / capture / human) — see canvas for definition
4. Then items 7–10 pipeline (vision, classify, geometry, verdicts)
5. Item 11 email provider (operator must pick)
6. Item 13 Stripe Studio price ids for Free/Solo gate (separate from dev_role bypass)
7. Item 15 ten graded runs + close artifact

RULES:
- No dispatch without plan row P-85
- Deploys planner-owned; you prepare PRs, operator/planner deploys
- Fail closed; verify checks by violation
- Update _scratch/p85-easements.md as you work (GROUND-TRUTH with timestamps)
- Subagents do not commit; you commit by explicit pathspec

TEST PARCEL: 905 Pecan St, Bastrop — APN 34161, county 48021 (48021:… parcelNodeId via spine-deep)
```

---

## Context for recipient

### Decisions still binding

- Six counties permitted for automated search (incl. McLennan)
- Records Request = all recorded documents, not easements-only
- Studio product tier per original ruling; dev_role is operator test bypass
- Never acquire images around a paywall

### Live blockers

1. **Williamson TylerHost HTTP 403** on disclaimer step
2. **#482 / #228** not merged to main yet

### What item 6 means (next product milestone)

After search returns instrument hits, the worker must honestly acquire each document: free download, portal purchase (cost on run), screen capture, or human queue. No bypass.

### Operator accounts

- `empressaioemail@gmail.com` — ran Bastrop records jobs; dev_role granted
- `dev@smartcityos.io` — dev_role granted

Hard refresh smartsite.cloud after entitlement changes.

---

## Artifacts from this session

| File | Purpose |
|------|---------|
| `_inbox/2026-08-27_p85_records_request_status_canvas.md` | Updated dashboard |
| `_inbox/2026-08-27_p85_records_request_handoff.md` | This file |
| `_sessions/2026-08-27_p85_records_request_claude_code.md` | Session close |
| `_scratch/p85-easements.md` | Tier-2 continuity |

---

## Leave behind

| Item | Owner | Plan row |
|------|-------|----------|
| Merge LDT #482 | property seat / operator | P-85 |
| Merge hauska-map #228 | property seat / operator | P-85 |
| Williamson recipe 403 | property seat | P-85 item 5 |
| Email provider choice | operator | P-85 item 11 |
| Stripe Studio price ids | pricing lane / operator | P-85 item 13 |
