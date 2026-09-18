# Scratch — OPS-17 SmartCity planner (design build + OPS-25 D-12..D-14, D-20)

Read this before re-deriving anything. Entries are Tier 2 (cheap, can be wrong); the planner gates promotion.

## GROUND-TRUTH (live-verified, with timestamp)

- 2026-09-18 ~14:40Z, doc_repo `P:\doc_repo` on `main` @ `247b0455`, read from outside this host (node `--use-system-ca`; plain node and `curl.exe` both die on the TLS-inspecting network with `fetch failed` / exit 35):
  - `smartcity-dashboards` `origin/main` = `7267c3f3e718cc751eef0ab5b2b0ccb0cb6a8a56`. Unchanged from the handoff snapshot. No `d13`/`d14`/`g161` branch exists on origin. Only lane branches present: `d12-crlf-on-main`, `g159-finance-bridge`, `g88-item3-class-gate`.
  - `smartcity-os` `origin/main` = `a400f7beb9b1e875584af9e1d99d1a373840d938`. Unchanged. `d9-api-8bea7fa` (the branch `walrus-app` builds from) still exists; no D-14 healthcheck fix on main.
  - `d14-d13-v1-reach` NOT LANDED. On `smartcityos.io` (served by walrus-app): G-159's four new routes (`/api/platform/opengov/budgets`, `/api/platform/opengov/chart-of-accounts`, `/api/platform/finance/permit-revenue/summary`) all return `200 text/html` (the SPA shell), identical to the fake-path control `/api/platform/xyz-nonexistent-control`; the existing-route control `/api/platform/mygov/permits` returns `401 JSON platform_internal_required`. Route absence is readable from outside with no key, using content-type as the discriminator.
  - `g161-never-default-a-city` NOT LANDED. At `smartcity-dashboards` `origin/main`, `src/server.mjs` still has six `|| "template-city"` fallbacks (lines 248, 394, 442, 499, 552, 580); `src/compose.mjs:7`, `src/staff-map.mjs:2`, `src/municode-calendar.mjs:282`, `src/run-municode-calendar.mjs:7` still carry the default.
  - `d13` NOT LANDED. The hardcoded GCP host `smartcity-api-7dyaiy7wha-uc.a.run.app` still appears at `origin/main` in `src/adapters.mjs` (6), `src/vendor-live.mjs` (5), `src/property-map.mjs` (2), `src/mygov-live.mjs` (1 + `DEFAULT_PLATFORM_BASE`), `src/mygov-permits.mjs` (1). Zero occurrences of `walrus-app` in `src/`.
  - `g135-mint` NOT LANDED, verified at the authoritative store: `gcloud secrets describe hauska-tenant-key-bastrop-tx-lane-verification --project=hauska-prod-497015` -> `NOT_FOUND`, authenticated as `empressaioemail@gmail.com`. `_catalog/credential_access_index.json` entry still reads `REQUESTED, NOT YET MINTED`. No `g135`/`mint` branch on `hauska-mcp-server`.
  - `app.smartcityos.io` (dolphin-app, DO) answers `/auth/sign-in` `500 signin_not_configured` (the DO marker) and `/api/lenses/finance/sources` keyless `404 unknown lens`. The GCP dashboards control answers `/auth/sign-in` `404 not found` and the same `404 unknown lens`. Both predate G-156, so production is still at `3d3ec62`.
  - `d12-main-uat` (deployed `53ade8a9`, G-159 STEP 2) still serves the demo default on the G-161 target routes: `/api/city-domains`, `/api/city-identity`, `/api/shell` all answer keyless `200 JSON`; only the finance route refuses keyless (`400 city_key_required`, G-159's fix). `?cityKey=bastrop_tx` 401, `?cityKey=no-such-city` 404, `?cityKey=template-city` 200, `?cityKey=%20%20` 404.
  - Probe instrument + artifact: `_inbox/2026-09-18_planner_verify_three_lanes.mjs` -> `_inbox/2026-09-18_planner_three_lane_verify.json`.
  - `node scripts/govtech/smartcity-tracker.mjs` exits 0: 18/18 self-tests, every tracked row agrees with its own close, 5 milestones M1 2/6, M2 3/6, M3 3/9, M4 4/6, M5 0/5.
  - `node scripts/lane-claim.mjs status` shows 7 STALE claims, none for the three in-flight lanes; the stale `d12-dashboards-do-cutover` (seat cente-vsc-d12, 15.8h) is still open.

## LESSON

- This seat cannot read `source_commit_hash` (no `doctl` token, no DO MCP), so D-14's verdict here is inferred from route absence plus the last committed read (`walrus-app` built from `d9-api-8bea7fa` @ `e783f351`). The lane that runs D-14 must read the hash back itself; an inference is not the authoritative record.
- `node -e` and `curl.exe` both fail on the TLS-inspecting network. Write the instrument as a file and run it with `node --use-system-ca`. Piping node output through `Select-Object -First N` kills the process before it writes its artifact.

## OPEN

- The three compiled dispatches (`g135-mint`, `d14-d13-v1-reach`, `g161-never-default-a-city`) are compiled and NOT sent, NOT landed. They wait on the operator hand-carry.
- The `dolphin-app` ship ruling (OPS-17 A-148) is not made; no amendment beyond A-148 exists. Ordering matters: shipping current `main` (`7267c3f`) needs no platform base because D-13 has not merged; if the ship happens as the D-13 lane's last step, the deploy must add the configured platform base or every feed fails closed.
