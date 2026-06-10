---
id: 2026-06-10_engine_lift_built_and_deployed_claude_code
title: Session — engine lift built + deployed, Austin hero library, unified auth, wedge dogfooding, the cut flipping
date: 2026-06-10
kind: session
applies_to: portfolio
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 59_spine_moat_and_high_value_features, 57_national_code_warming_sprint, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, _decisions/2026-06-10_gtm_readiness_plan, _decisions/2026-06-10_precedence_hero_path_s1_prelaunch, _decisions/2026-06-10_austin_2024_launch_metro, _decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed, _decisions/2026-06-10_texas_coverage_demand_driven]
---

# Session summary

## Arc

Began as a GTM-readiness planning session (flesh out 58) and became an end-to-end build session driven live: the engine extraction was built and deployed, the Austin hero library warmed and verified, unified auth built (and a lockout regression caught + fixed), the web-first wedge unblocked through real dogfooding on a live customer bid, and the Cortex cut merged and staged for flip. ~15 agent dispatches fired and reported, ~30 dispatches authored, five decision records logged, all committed across many small session-close-style commits.

## What shipped (merged, legacy-design-tools unless noted)

- **Engine lift (ADR-008) — built + deployed.** Adapters #69, reasoning engines + engine-api endpoints #70, calibration overlay I/O (Topology A) #71 (all hauska-engine). **engine-api DEPLOYED** to Cloud Run (`hauska-engine-api-00003-vjx`, anthropic finding mode, pysheds baked, gate-front-seam enforced). **C1 Cortex cut #169** (spine client + per-engine flags default-OFF + findings cut + S1 precedence production wire + provenance envelope helper). **C2 extension cut + unified sign-in #170.**
- **Code library.** Harness fix #162; section-extraction driver #163 (flips unverified→verified, 0→73% sample); **Austin 2024 hero library #164** (7 manifests at the correct adopted package incl. UMC/UPC 2024 + TAS 2012; web-verified 0→~35%; IECC fixed 0→32%, IFC 51%).
- **Auth.** task #29 per-user auth + unified identity #167; **auth lockout regression fix #168** (anonymous→migration-owner restores demo access; isolation + no-pool tests pass in CI; minimal sign-in affordance).
- **Wedge (dogfooding the live San Marcos triplex bid).** Intake/chat wedge fixes #165 (pre-Revit chat + multi-attach + Opus-4.8 image vision); artifact-UX #166 (auto-nav to artifact + letter document view + scroll fix + Download PDF/Print).
- **Migrations 0036/0037/0038 applied** to the deployment Neon.

## Decisions logged

- [`2026-06-10_gtm_readiness_plan`](../_decisions/2026-06-10_gtm_readiness_plan.md) — the five GTM forks (SmartCity follows, user-warm thin, provenance rides-the-cut, bg-loop deferred, Texas-first).
- [`2026-06-10_precedence_hero_path_s1_prelaunch`](../_decisions/2026-06-10_precedence_hero_path_s1_prelaunch.md) — S1 (precedence into production) promoted to pre-launch soft-gate (reconciliation is a hero GTM line).
- [`2026-06-10_austin_2024_launch_metro`](../_decisions/2026-06-10_austin_2024_launch_metro.md) — Austin @ 2024 is the launch hero (UMC/UPC + TAS wrinkle).
- [`2026-06-10_permit_ahj_precedent_connector_recon_seed`](../_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md) — permit/AHJ connector (recon cleared BUILD, family-first, post-C4).
- [`2026-06-10_texas_coverage_demand_driven`](../_decisions/2026-06-10_texas_coverage_demand_driven.md) — Texas made whole by demand-driven warm-up, NOT flat batch.

## Ideas surfaced this session worth NOT losing (the under-captured set)

- **Cortex connector candidate backlog** (from the parallel connector dig). Beyond the permit/AHJ connector we picked, the dig surfaced several unplanned candidates for the residential-designer audience, captured now in [`59`](../59_spine_moat_and_high_value_features.md) (Connector candidates section): HOA/CC&R (kills residential designs but honesty-gated — 58 says CC&R cross-layer is unbuilt and must not be marketed), utility/service-territory (septic-vs-sewer, tap fees), energy/climate-zone (NREL PVWatts, ASHRAE/IECC climate zone, SECO), WUI/wildfire trigger. Deferred from the planned set: Shovels permits, MLS, FAA/airspace.
- **Unified identity across Cortex web + the browser extension** — one cortex-api account, both surfaces; cut-independent; extension `launchWebAuthFlow` built in C2; coordinating-planner handoff filed at [`_dispatches/2026-06-10_planner-handoff_unified-auth-coordination.md`](../_dispatches/2026-06-10_planner-handoff_unified-auth-coordination.md).
- **Open question — grok vs anthropic for findings.** engine-api defaults to grok; cortex-api runs anthropic. To flip topology-only we set engine-api to anthropic. Whether findings should run grok or anthropic long-term is an unsettled quality question (all finding-quality work to date is anthropic + Opus-4.8 vision).
- **Open task — bake the engine-spine flags into the deploy workflow.** `update-env-vars` flips them for verification, but the deploy workflow re-sets env on every deploy (the line-204 clobber class), so a durable flip needs the flags in the workflow env block.
- **Permit/AHJ = arrow-two's deepest signal** (permit approved/denied is the Phase-2 ground truth, 04a/59-5b); pairs with the SmartCity Bastrop ingest at C4.

## Deploy state at close

- **cortex-api:** `00146-xul` serving 100% (#163–170 live, engine-spine flags OFF → still local engines). **`00148-moj` canary at 0%** (findings-flip staged: `ENGINE_API_URL` + `ENGINE_SPINE_FINDINGS=1` + `ENGINE_API_GATE_TOKEN`; reachable at the canary URL for verification).
- **engine-api:** LIVE `00003-vjx` (anthropic mode).
- **gate (hauska-mcp-server):** unchanged (retrieval-wired; needs migration 004 + engine-api wiring for external-agent reasoning — a fast-follow, NOT a C1 blocker).
- Migrations 0036/0037/0038 applied; `SESSION_SECRET` bound.

## State at close — the cut is merged, flipping, not yet live

C1 (Cortex cut) and C2 (extension cut) are merged but **dormant behind default-off flags**. The findings-flip is staged as a 0% canary for keystone verification. C3 (thin cortex-api / remove the local engine code) is correctly **NOT done** — it is the one-way door and waits until the flipped engines are verified stable in prod.

## What's next (ordered)

1. **Verify the findings-flip on the canary URL** (run a real San Marcos review there → confirm real grounded findings from the spine, lineage + calibration deposit intact, latency OK) → then `shift-traffic`.
2. **Flip briefing → hydrology → topography** one at a time, verifying each; **bake the flags into the deploy workflow** for durability.
3. **C3** — remove the dead local engine code once the flipped engines run clean.
4. **Thin user-warm path** — the one launch-gate item never built (coverage report + honest pill + manual escalation; dispatch queued).
5. **Fast-follow / non-blocking:** gate wiring for external agents (cc-agent-M) + migration 004; engine-api Dockerfile tsx fix on main; verified-rate deepeners (UMC/UPC + TAS); San Marcos + Texas Tier-1 pre-warm; S2 precedence gate tool.

## External dependencies / not touched (by design)

ICC creds (the standing lever for IFC/IPMC verification + licensed tier + first paid surface; external). Not touched: SmartCity-on-spine (C4, post-launch), the permit-connector build (post-C4), the deeper moat builders (real-outcome capture, as-of-time, atom-graph, execution atoms — roadmap), Mox, bizops.

## Live customer thread

The whole wedge/letter dogfooding was driven by a real bid: Hector Martinez, 146 S. Fredericksburg St., San Marcos TX — a 3-story student-housing building; the load-bearing question was occupancy classification → fire-sprinkler determination (IBC 903.2.8 / NFPA 13R vs the Texas IRC R313 amendment). The wedge + letter fixes are live for it; the canary is where findings-on-spine would be tested.
