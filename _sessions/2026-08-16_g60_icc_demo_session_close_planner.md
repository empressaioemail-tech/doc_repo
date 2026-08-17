---
id: 2026-08-16_g60_icc_demo_session_close_planner
title: Session close — G-60 ICC-demo stop
date: 2026-08-16
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: G-60 ICC-demo stop

## What was done

Closed the G-60 demo path and stopped.

Operator named the portal **ICC-demo**. Vercel alias https://icc-demo.vercel.app now points at project `icc-portal-app` (also https://icc-portal-app.vercel.app). Unauthed `/activity` 401. Gate copy is licensed-IP access, separate domain.

Operator marked WDLL 13 done. Live re-probe: unauthed `/applicant` HTML 200; BFF no token 400; bogus token 404 `share_not_found`; reviewer-minted share `i8dyXw…` (created 2026-08-17T00:20:48Z by `icc-demo/reviewer`) GET 200 `host=plan-review` `store=smart-files` `role=applicant` folder `folder:tenant:icc-demo:plan-review-48021-28286` files include operator `01_executive_summary.md`. Engagement A In Review. Planner POSTed zero files or shares.

Smart Files QA UI had hidden icc-demo rooms after ICC-demo was pulled off that site. Store was intact. Restored icc-demo personas on https://smart-files-app.vercel.app `dpl_8rLUZ2rQtP8YqEpXzcJcyDn9aeRh`. Joe/Acme Closing room and Jane QA room still list. icc-demo 28286 has `01_executive_summary.md`. 27303 has `00_README.md`. No DELETE.

A-032 (ICC as a plan-review tab) stays reversed. Plan review cites. Smart Files stores files. ICC-demo is the access door.

L26 / ICC store UPDATE / F4 ingest / G-58b DROP held per operator. No `--apply`. No second writer.

## What was learned (changes to ground truth)

Gluing ICC-demo onto plan-review `/icc/activity` was the same miss as sending the applicant to `smart-files-app`: the citing product is not the IP-access door, and the files QA app is not the review room.

Taking icc-demo off the Smart Files persona dropdown hid live rooms. The store still had them. Restore personas. Do not DELETE.

Local `P:\icc-portal\web\.vercel\project.json` may still name project `web`. Production project is `icc-portal-app`. Confirm before the next deploy.

`MEMORY.md` is named by the read-state-first rule and is missing. Do not invent it.

## What's still open

Held with L26: WDLL 7 (pending override DID / no store ingest), 18 (ICC atoms still `public-free` 4966), 19 (actor fields on activity, not on store atoms), G-58b DROP, IPMC populate.

Held product: G-50 SaaS / public-paid / Circle, G-52 applicant portal, Bluebeam, visual design, PE ICC citations, apex DNS beyond `icc-demo.vercel.app`.

Uncommitted outside this close: `P:\smart-files` `src/actors.mjs` + `web/` persona restore (already live on Vercel). Dirty LDT and dirty hauska-map untouched.

## Suggested canonical doc updates

Applied this close: `_STATE.md`, `00_current_state.md`, OPS-17 A-034, WDLL item 13, pickup, scratch, repo_intents icc-portal row, thesis_parity ICC-demo host, decisions for separate portal and joint done line.
