CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-131 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Smart Site MCP export credentials must survive a deploy

## Mission — P-131: make the Smart Site MCP export credentials survive a deploy

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

Repo `empressaioemail-tech/legacy-design-tools`, property seat. Create a fresh
worktree/clone from `origin/main` on branch `fix/p131-mcp-export-env`. Declare the
commit you started from before you write anything.

### What happened, and why this is an outage fix rather than a feature

Four export kinds on the Smart Site MCP connector (X-ray/dossier, site plan, terrain,
feasibility study) were dark on production. Verified live 2026-09-08 from the service's
own dependency endpoint on serving revision `smartsite-mcp-00099-yix`:

    GET https://mcp.smartsite.cloud/health/dependencies
    {"service":"smartsite-mcp-dependencies","dependencies":{
      "hauska_mcp":{"state":"skipped","latency_ms":null,
      "detail":"HAUSKA_MCP_BASE_URL not configured"}}}

All six candidate env names were absent on the revision, both primary and fallback:
`HAUSKA_MCP_BASE_URL`, `HAUSKA_MCP_SERVICE_KEY`, `HAUSKA_ENGINE_API_URL`,
`HAUSKA_ENGINE_API_KEY`, `ENGINE_API_URL`, `ENGINE_API_GATE_TOKEN`. Confirmed
independently by two seats from separate reads.

The feasibility export was recorded as live-verified end to end with a real generated
PDF on 2026-09-04 (OPS-16 A-103 / P-119). It stopped working and nothing detected it.

ROOT CAUSE. `.github/workflows/cloud-run-deploy-smartsite-mcp.yml` writes environment
with `--set-env-vars` and `--set-secrets`, which are AUTHORITATIVE REPLACE. Any variable
set by hand in the console is erased by the next workflow deploy. The workflow's own list
does not carry the four export variables, so every deploy re-breaks exports. The same
file already carries a comment about this exact class of failure happening to
`DATABASE_URL`.

A STOPGAP IS ALREADY LIVE AND IS NOT THE FIX. The planner restored the four variables
with `gcloud run services update --update-env-vars/--update-secrets` (merge form, not
replace) and shifted traffic. Production now serves `smartsite-mcp-00101-yek`, tag
`envfix`, and `/health/dependencies` reports `hauska_mcp: state=ok, HTTP 200`. That
revision's env will be wiped by the next workflow deploy unless this card lands first.
Your job is to make the workflow produce the same env set that `00101-yek` carries now.

### The change

In `.github/workflows/cloud-run-deploy-smartsite-mcp.yml`, in the `deploy-canary` step
(around line 165):

Append to `--set-env-vars`:

    HAUSKA_MCP_BASE_URL=https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
    HAUSKA_ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app

Append to `--set-secrets`:

    HAUSKA_MCP_SERVICE_KEY=HAUSKA_MCP_KEY:latest
    HAUSKA_ENGINE_API_KEY=HAUSKA_ENGINE_API_KEY:latest

NOTE THE NAMING MISMATCH AND DO NOT "FIX" IT BY RENAMING. The code reads
`HAUSKA_MCP_SERVICE_KEY` (`artifacts/smartsite-mcp/src/hauska-client.ts`) and the Secret
Manager secret in `legacy-design-tools-prod` is named `HAUSKA_MCP_KEY`. Bind one to the
other in the flag, as written above. Renaming either side breaks a working binding.

Both URLs are plain env vars, not secrets. Neither is confidential and neither exists as
a secret in `legacy-design-tools-prod`. Do not invent a secret for them.

DO NOT USE `PRODUCTION_HAUSKA_MCP_URL` from `hauska-prod-497015`. Despite its name it
contains a Postgres connection string for the `hauska_mcp` Neon database, not a URL for
the MCP server. Using it would ship a silently broken config that still reports
`state: ok` on a probe.

### Scope boundary

This card changes ONE workflow file. It does not touch `artifacts/smartsite-mcp/**`, does
not add an export kind, and does not change `feasibility-export.ts`. Two follow-on
findings are filed separately and are NOT yours: `refresh_parcel_flood_drainage_export`
exists upstream and the connector has no kind for it, and the comment in
`feasibility-export.ts` claiming no upstream feasibility tool exists is now false
(`refresh_parcel_feasibility_export` is live on hauska-mcp-server). Leave both alone.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

1. `git diff` on the workflow file only. Confirm the diff is the four additions and
   nothing else, and that no existing entry in either flag was dropped. `--set-*` is
   authoritative replace, so a dropped entry is a new outage.
2. Open the PR. Merge on green CI, re-greened against the CURRENT base.
3. A PUSH DOES NOT DEPLOY. The push trigger builds and pushes the image only. After
   merge, run `workflow_dispatch` with action `deploy-canary` and pass the commit sha
   explicitly — `image_tag` defaults to `latest`, which resolves at deploy time and has
   already frozen the wrong digest in this fleet.
4. Verify on the CANARY TAG URL before shifting any traffic:

       curl -s https://canary---smartsite-mcp-tds7av26va-uc.a.run.app/health
       curl -s https://canary---smartsite-mcp-tds7av26va-uc.a.run.app/health/dependencies

   The first must report the revision you just deployed. The second must report
   `hauska_mcp` with `state` `ok` and an HTTP 200 detail. `skipped` means the flag
   did not take and the fix did not land.
5. NEGATIVE CONTROL, required, not optional. Before shifting, confirm the currently
   serving revision reports something DIFFERENT from the canary. A check observed only
   passing has not been observed working. If both URLs report identical bodies you are
   reading one revision twice and the tag did not route.
6. Shift traffic, then re-read `status.traffic` as JSON BY FIELD NAME. Never a positional
   `--format="value(a,b,c)"`; a blank field shifts every column after it. Never
   `latestReadyRevisionName`, which answers a different question than what serves.
7. Confirm the full env set on the newly serving revision by name and confirm all
   thirteen variables are present, not just the four you added. Specifically confirm
   `DATABASE_URL`, `SERVICE_API_KEY` and `WORKOS_CLIENT_ID` survived.

### Close

Declare `leave_behind` before closing. The `envfix` tag on `smartsite-mcp-00101-yek` is a
leave-behind if it still exists when you finish; name it and its owner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_mcp-env_cp1.json
  CP2: _inbox/2026-09-09_mcp-env_cp2.json
  CLOSE: _inbox/2026-09-09_mcp-env_close.json
