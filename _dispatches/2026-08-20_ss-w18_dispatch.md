CANON-PREAMBLE v664d6256

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
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

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: P-47 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# cortex-api does not boot

## Lane SS-W18 — cortex-api does not boot (P-47)

WORKING DIRECTORY: `/p/tmp/ss-w18-boot-fix` (branch `ss/w18-boot-fix`, off `origin/main` = `5688aa31`). Remote `https://github.com/empressaioemail-tech/legacy-design-tools`. cortex-api lives at `artifacts/api-server/`.

READ FIRST: `P:/tmp/data fix/61_enforcement_doctrine.md` and `P:/tmp/data fix/enforcement.mdc`. Operating law for this lane, not background.

### The defect, traced at source by the planner

A canary deploy of `5688aa31` failed. Cloud Run: *"The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout."* Production is unaffected — the canary is 0% traffic by design, and `/api/county-ledger` and `/api/healthz` both return 200 on the serving revision from 2026-08-16.

The chain, verified at `5688aa31`:

```
routes/index.ts:59     import { countyRailScoreRouter } from "./countyRailScore"   <- BOOT GRAPH
routes/index.ts:135    router.use("/county-ledger", countyRailScoreRouter)
routes/countyRailScore.ts   imports lib/railScoring/{engine,registry}
lib/railScoring/engine.ts   imports "../../countyCoverageScoreCli"     <- A CLI
countyCoverageScoreCli.ts:115   import { argv } from "node:process"
countyCoverageScoreCli.ts:183   process.exit(1)
```

The container starts, the CLI module evaluates during import, and the process exits before Express listens.

**THIS EXACT FAILURE IS DOCUMENTED IN THE FILE NEXT DOOR.** Read the header of `artifacts/api-server/src/lib/nodeFacetTier2Constants.ts`. It exists specifically because *"a misfire ran the bake at server boot and `process.exit(1)`'d before the server could listen"*, and its fix was to extract pure constants so the read route never imports the CLI. The scorer capability reintroduced the same shape through a different import.

**Every merge to this repo since 2026-08-16 has been unbootable and nobody knew**, because CI runs typecheck and vitest and never starts the process. Four green CI runs, correct verdicts, consuming nothing that would catch this.

### What you build

**1. The fix, following the precedent already in this repo.** Extract `classifyFacet`, `resolveStampFacetMeasurability`, `sourcePresentForStampFacet` and their types into a pure module — no `argv`, no `pg`, no `main`, no side effects at import. The CLI and the rail-scoring engine both import that module. This is the same move `nodeFacetTier2Constants.ts` made and for the same reason; mirror its header so the next person understands why the file exists.

Note the CLI is also imported by `countyFloodScoreCli.ts:23` and `countyGeometryScoreCli.ts:110`. Those are CLIs importing a CLI, which is not a boot problem, but they are call sites and the standing rule is to enumerate call sites before scoring a fix as complete.

**2. A boot smoke test in CI.** Start the server, wait for the port, kill it. Its absence is the reason four merges shipped unbootable.

**YOU HAVE A PERFECT KNOWN VIOLATION AND YOU MUST USE IT.** `origin/main` at `5688aa31` is broken right now. Run your new boot test against unfixed main FIRST and show it failing, then apply the fix and show it passing. A check observed only passing has not been observed working, and this is the rare case where the violation is already sitting in production main rather than needing to be simulated.

**3. A CI grep forbidding route-graph modules from importing anything matching `*Cli.ts`.** This is the structural form of a rule that currently exists only as a comment in one file's header. Prose does not enforce.

Both controls are TOOLING, so they FAIL LOUD rather than fail closed: a check that cannot run and silently passes is the defect. Give each a distinguishable did-not-run outcome that is recorded, not swallowed.

### The four-question gate, answered in your close for each control

What executes it. What triggers it. What fails when it is violated, **and is the thing that fails running in production today** — note that this repo's `main` is NOT branch-protected, so CI blocks nothing and the honest answer for both controls is currently that nothing fails. Say so. And what bypasses it: name the paths reaching the same state without passing through the control. For the import grep, a re-export through an intermediate module is the obvious one.

### Rules

Push immediately after the first commit. PR against main. DO NOT MERGE, DO NOT DEPLOY — the planner owns both, and a deploy is blocked on this lane.

Exit-bounded verification only; a boot test that leaves a server running is itself a defect. Declare the commit you ran against in every output. For every finding state the second mechanism that would produce the same observation and why you rejected it.

### Report back

Proof the boot test FAILS on unfixed `5688aa31` and passes after the fix, pasted verbatim; the pure-module extraction with its call sites enumerated; the import grep with its bypasses named; all four gate questions per control; the PR URL; anything contradicting this briefing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-20_ss-w18_cp1.json
  CP2: _inbox/2026-08-20_ss-w18_cp2.json
  CLOSE: _inbox/2026-08-20_ss-w18_close.json
