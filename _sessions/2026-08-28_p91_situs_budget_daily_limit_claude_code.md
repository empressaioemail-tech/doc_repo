---
id: 2026-08-28_p91_situs_budget_daily_limit
title: P-91 #526 situs-search budget, daily-limit bake, Rainmaker re-probe
date: 2026-08-28
agent: claude_code
repo: docs
session_type: execute
plan_row: P-91
memory_graded: [M-001:HELPED]
rolled_up: false
---

# Session: P-91 situs-search budget, cortex daily-limit bake, Rainmaker live

## What was done

The cancelled Test on LDT #526 run `33199771284` was a slow runner, not a hung budget file. Re-queue Test conclusion was the string `success` (~11m34s). #526 squash-merged `5e5d1d95`. The first serving claim after that merge (`00635-qux`) was stale: traffic is pinned. The operator had already shifted `cortex-api-00389-phv` at 100 percent, same digest as the #526 image, with a manual `CORTEX_USER_DAILY_API_LIMIT=50000`.

The workflow bake was still `10000`. `--set-env-vars` is authoritative-replace, so the next canary would lock the operator out again. LDT #530 squash-merged `b28de09c`: bake raised to `50000`, `ci-cortex-daily-limit-50000` fails if `10000` returns or if `--set-env-vars` is missing `50000`. Violated locally before trust (10000 copy fires; comment-only 50000 refuses). Test conclusion `success`.

A later main canary on `ee27845e` produced `cortex-api-00643-rib` with the 50000 bake. Shift `33209942592` conclusion `success`. Serving read from `status.traffic[]`: `00643-rib` at 100 percent. `latestReady` is staging `00644-soz` at 0 percent and was not shifted. Serving env `CORTEX_USER_DAILY_API_LIMIT=50000`. Digest `sha256:59a4696f…`.

Rainmaker re-probe on that serving pair: Cv and Cove both 200 under 3 s to `48021:8720522`. Pine St/Street still gold `48021:34137`. `abbreviation_works` fired. `o4_not_closed` did not. WDLL item 27 graded met on the pair. Miss-honesty half ungraded because this pair is a hit.

## What was learned (changes to ground truth)

A cancelled mid-suite job is not a hang when files are still completing and the suspected file is absent from the log. Merge on the Test conclusion string. Do not change a PR for a hang that did not happen.

Traffic on cortex-api is pinned. A deploy does not move serving and neither does a `services update`. Read `status.traffic[].revisionName` and `percent` by field name before asserting serving. `latestReady` can be a staging revision with 0 percent.

`--set-env-vars` replaces the whole env map. A manual 50000 is a stopgap. The bake is the durable number. A serving claim that does not name the revision it read is stale the moment someone else shifts.

The five new budget unit tests cannot add ten minutes to CI. Heavy api-server files on a contended runner can.

## What's still open

1. LDT #527 Typecheck and Test FAILURE. Separate CI fix.
2. Item 27 miss-honesty: still needs a live query that returns empty under 25 s.
3. Workflow still bakes `--min-instances=0`. Serving `00643-rib` has no minScale annotation.
4. After any later cortex-api shift or redeploy, re-read `status.traffic[]` and confirm `CORTEX_USER_DAILY_API_LIMIT=50000` on the serving revision. Do not shift staging `00644-soz`.

leave_behind: none from this thread. The four opens are other cards or standing deploy discipline.

## Suggested canonical doc updates

Already applied this session: `90_operations/T4_cross_service_limiter_posture.md` (50000 bake, serving-from-traffic check), `90_operations/OPS-9_scale_ops_specs_pack.md` (same number), `_decisions/2026-08-28_cortex_daily_limit_50000.md`, `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md` items 27 and 30, `_inbox/2026-08-28_p91_o7_rainmaker_reprobe.md`.

Promotion candidate (planner-gated, not self-promoted): LESSON in `_scratch/smartsite-ai-connector.md` that `--set-env-vars` is authoritative-replace and serving is read from traffic. The mechanical half already landed as `ci-cortex-daily-limit-50000`.
