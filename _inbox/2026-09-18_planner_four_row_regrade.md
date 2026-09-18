---
id: 2026-09-18_planner_four_row_regrade
title: Four SmartCity rows moved, read at source (D-14, D-13, G-161, and the D-12 pin)
status: evidence
owner: integration (SmartCity planning seat)
last_updated: 2026-09-18
related: [_inbox/2026-09-15_roadmap_reconciliation, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_operations/OPS-25_cloud_infrastructure_and_cost_program]
---

# Four rows moved, and the reads that say so

Snapshot: `doc_repo` `main` at `c5eb6666`. Probes run from this worktree with
`node --use-system-ca`; the app records read through the `do-apps` MCP, which runs server side. That
matters here, because the raw `*.ondigitalocean.app` hostnames reset the connection from this host
(`ECONNRESET`, reproduced across sessions) while the MCP can read the app specs normally.

Every cell below is a named field or a live response, not a lane's report. No lane close, CP1 or CP2
for either of the two in-flight lanes exists in this worktree at this snapshot.

| Row | Verdict | The authoritative record |
|---|---|---|
| D-14 | **LANDED** | `walrus-app` deployment `e243db0a-b5ed-4f4c-bb8c-74261ab97b2d` is ACTIVE, deployed 2026-09-18T15:41:52Z, `cause: manual`, and the service now builds from branch `main` where it built from the side branch `d9-api-8bea7fa`. `services[0].source_commit_hash` = `1f0262f15f8d1898a6c32826ec2e45407518e29e`, which IS `smartcity-os` `origin/main` HEAD read independently by `git rev-parse`. Live on `smartcityos.io`: `/api/opengov/budgets`, `/api/opengov/chart-of-accounts` and `/api/finance/permit-revenue/summary` all answer `401 platform_internal_required`, while the fake-path control `xyz-nonexistent` answers the 200 SPA shell. A real route answers; a nonexistent one falls through to the shell, and those are two independent derivations |
| D-13 | **LANDED on the dashboards side** | `smartcity-dashboards` `origin/main` `7487d7c0` carries `src/platform-base.mjs`: one configured base (`SMARTCITY_V1_PLATFORM_BASE`) decides where every feed goes, the per-feed `DEFAULT_PLATFORM_BASE` and `MYGOV_PLATFORM_BASE` defaults are gone, and an unset base REFUSES carrying a named basis rather than silently dropping a feed. The old GCP dashboards host `52ecsl5mvq` appears nowhere in `src/` or `web/`; the only surviving `run.app` strings are `.env.example`, `infra.md` and test fixtures. `d12-main-uat`'s configured env sets the base to `https://walrus-app-kzog6.ondigitalocean.app` |
| G-161 | **LANDED** | `src/server.mjs` at `7487d7c0` carries six `G-161. Was \|\| "template-city"` sites, plus the module-level default and the `url.searchParams.get("cityKey")` default, each with a comment naming the old literal. Live on `d12-main-uat` at `7487d7c0`: `/api/city-domains`, `/api/city-identity`, `/api/shell` and `/api/lenses/finance/sources` all answer `400 city_key_required` keyless, where the 15:09Z read answered 200 with the demo city. Naming `template-city` explicitly still answers 200, `no-such-city` 404, `bastrop_tx` 401: the refusal is scoped to the unnamed case and every other cell still behaves |
| D-12 (the pin) | **observed, not regraded** | `d12-main-uat` deployment `605515ef-69e7-41a7-bac3-33a79ee45387` is ACTIVE at 2026-09-18T16:04:10Z, builds from branch `main`, `source_commit_hash` = `7487d7c0` = dashboards `origin/main` HEAD. Whatever D-12 is graded, the app no longer builds from a pin |

## The ship has NOT happened, and its precondition is now a named thing

`dolphin-app`, which is `app.smartcityos.io` in production, serves
`3d3ec62abb1f74b01fef561ece11139825be3baa` from deployment `ded9afcb-b23a-467d-ac81-e581aedf15be`,
ACTIVE since 2026-09-18T00:27:55Z with `cause: MAINTENANCE` and the previous build reused. The live
tell agrees: the finance route answers `404 unknown lens` in production where `d12-main-uat` answers
`400 city_key_required`.

**And `dolphin-app`'s configured env carries no `SMARTCITY_V1_PLATFORM_BASE`.** At `7487d7c0` an unset
base is a refusal with a named basis, not a silent default. So shipping `main` to `dolphin-app` without
setting that variable in the same deploy would move every v1 platform feed from serving to refusing.
The ship is a two-part change and the variable is part of it, which is what the roadmap already says and
is now checkable rather than remembered.

## What this does not establish

- Neither lane has filed a close in this worktree. These are planner reads on the deployed surfaces and
  on the repos' remote heads, so the rows move; the lanes' own acceptance items and leave-behinds do not.
- The two deploys are `cause: manual` under the operator's DigitalOcean account. The planner did not
  perform them and cannot say which hand did, only that they happened and what they serve.
- G-161's row reaches beyond the dashboards. This read covers the dashboards routes and the source that
  carries the fix; it does not re-run whatever MCP-side cell that row also owns.
- D-13's deploy path is read through `d12-main-uat`, and production runs a different, older commit. A
  dashboards change can be landed in `main` and in UAT and still be unshipped, which is exactly the
  state production is in.
