---
date: 2026-08-16
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: G-60 files UI and applicant view (A-031)

## What was done

Operator ruled that Smart Files function lives as part of plan review: load a file in plan review, Smart Files is the backend store, plan review has its own UI, and there is an applicant view. Planner should not have seeded Smart Files writes.

Decision `_decisions/2026-08-16_plan_review_owns_files_ui.md`. OPS-17 A-031. WDLL A-010. Share host reversed from `smart-files-app` to `plan-review-app-ten.vercel.app/applicant?token=`. Intake does not create folders. Share without an uploaded file returns 409.

Plan-review origin `5952846` serving `plan-review-00010-cey` @100% tag `g60f`. UI `dpl_5rjkGcE44C2FFLVhDHE7C8BUbGr5`. Live probes: `GET /` 200, applicant room no token 400, bogus token `share_not_found`, unauthed `/applicant` 200, unauthed `/icc/activity` 401. Planner POSTed zero new files or shares this wave. Existing `site-plan-sheet.txt` and `mcp-g60-probe.txt` left in place.

## What was learned (changes to ground truth)

A-027 still holds (store). A-009/A-030 share-to-QA-app UX does not. Sending the applicant to `smart-files-app` makes plan review not the product. Planner POSTs into the files store are premature residue, not demo setup. Applicant view is a token room on plan-review, not G-52 MyGov and not a full applicant portal.

## What's still open

WDLL item 13 partial: token-room list after a reviewer share is still owed. Do not mint that token from the planner. Residuals: ICC store UPDATE, F4 pending DID, G-58b DROP, L26 holds `--apply`. Next: elevate the ICC portal on plan-review the same way (plan-review owns the UI, activity table is the store, do not seed writes, do not send ICC to Command Center).

## Suggested canonical doc updates

Already applied this session: `_STATE.md` LIVE INFRA pins, OPS-17 G-60 row + A-031, WDLL item 13 re-grade, pickup, `_scratch/icc_demo.md`.
