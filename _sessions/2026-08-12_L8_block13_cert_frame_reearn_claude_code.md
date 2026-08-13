---
id: 2026-08-12_L8_block13_cert_frame_reearn
title: Session close — L8 / P-18 DC-10 cert frame reconciled; block13 re-earn in raw txgio frame
date: 2026-08-12
type: session_summary
participants: [nick, cursor_grok_lane_planner_L8]
memory_graded: none
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-11_invariant_register, 90_operations/OPS-5_cert_standard, _decisions/2026-08-11_texas_flush_launch_gate_amendment, _inbox/2026-08-12_W3_cert_frame_close.json, _inbox/2026-08-12_L8_cert_frame_close.json]
---

# Session close 2026-08-12 — L8 block13 cert-frame re-earn (DC-10 / P-18)

## What this session did

Graded DC-10 (cert frame reconciled) exactly as written. As-found: all three sub-checks FAIL (no W3 close path in `_STATE.md` OPEN; no `block13-cert-grade` workflow; OPS-11 amendment still narrated VIOLATED IN CERT with no CLEARED marker and no dated session naming block13 re-earn).

Closed the gaps without touching L1/L2/L5 writer files or taking the atoms slot:

1. Verified engine main already grades block13 on raw `txgio_parcel` (PR #292 / `1f2a6e2`) with fixture re-dump (`fb1a632`).
2. Re-earned live block13 in that frame: **7/7** CERT-RESTORE ELIGIBLE at 2026-08-12T22:50:01Z (`_inbox/2026-08-12_L8_block13_live_grade.json`).
3. Added named CI workflow `block13-cert-grade` plus source-shape pin test; engine PR **#327** squash-merged @ `b2a8706`. Main push run **31649369819** conclusion **success**.
4. Marked OPS-11 cert-frame amendment **CLEARED / CLOSED 2026-08-12**.
5. Filed W3 close at `_inbox/2026-08-12_W3_cert_frame_close.json` and declared that path in `_STATE.md` OPEN.

## block13 re-earn (named for DC-10(c))

Live mechanical grade on the BLOCK13 roster (7 parcels, area exhibit not curated-sample expand): `passCount === totalCount === 7`. Offline CI fixture (txgio-dumped rings) 8/8 on the merge commit. This session is the dated `_sessions/` close that names the block13 re-earn.

## State at close

- DC-10: PASS after re-grade (see `_inbox/2026-08-12_L8_cp2_dc10_regrade.json`).
- Engine tip carrying the named workflow: `b2a870666d6730b666f6f8ce6b39f39a70dce19d`.
- Remaining outside DC-10: G2b 188-parcel roles freshness cohort; OPS-5 operator R6 for broader city area-sweep.
