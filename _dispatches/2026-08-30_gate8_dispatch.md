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

PLAN-ROW: F-08 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# Gate 8 smoke — the mold prerequisite; fails on production today

# Gate 8 — the smoke gate the mold requires and nobody built

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** This card is compiled from the plan of record and carries
the operator's go. Do not stall for permission you already have. If a step is
wrong, say so in the handback and do the rest.

**Verification must terminate.** Builds, typechecks, `vitest run`, or
background-start plus `curl` plus kill. Never `watch`, `serve`, or `tail -f`. The
headless browser must exit on its own path, including on failure.

**Read product code by ref.** Local checkouts sit on feature branches hundreds of
commits behind. Use `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, or job start.

## Why this card exists

`28_THE_BASTROP_MOLD_engine_build_spec.md` names eight recipe gates. Gate 8
(SMOKE) is recorded as **not mechanical** and is called an engine-build
prerequisite: "a fan-out without a real smoke gate re-creates the 3-day scan-fix
loop, the exact failure the program exists to prevent." P4 is a fan-out.

The full spec is `_inbox/2026-08-30_gate8_smoke_spec.md`. **Read it first — it is
the card.** It was written against live production and its assertions were run,
so this is a build, not a design.

## What is already proven

The mold's seed works with zero dependencies: Chrome `--headless=new` plus Node 24
global WebSocket. Verified live that `#panel=node-graph&county=48021&q=34137`
renders the CC node list unauthenticated, and `?parcelNodeId=48021:34137` renders
the PE inspect card.

**Three assertions fire on day one** against the reference county's gold parcel.
That is the proof this gate can fail, and it is the acceptance evidence:

1. `landUseFact.landUseCode: "A1"` / `state: "present"` sits in the same payload as
   `baseFacts.landUse: null`. **This never reaches the DOM** — PE renders A1 from
   the sibling fact — so a DOM-only gate misses it. It is caught only because the
   gate reads the wire as a second reader. Keep that second reader.
2. Wire carries `envelope.status: "ok"` and `buildableAreaSqFt: 9350`; the DOM
   renders "Buildable: Not stamped here", because `liveBuildablePct` reads
   `summary.buildableAreaPct`, a percent the facets envelope does not carry.
3. `boundaryEdgeFact.setback.provenance: "road-class-setback-table"` is serving on
   the gold front edge — the road-class-to-setback-value path the mold retired
   2026-07-29.

## Build order — a lane may stop after step 2 and still have a working gate

**Step 1. The bundle marker, because it does not exist.** The deployed 1.97 MB PE
bundle carries no `BUILD_SHA`, no `__BUILD*`, no 40-hex string, and neither vite
config defines one. Add the `define`, a **non-tree-shakeable**
`documentElement.dataset` write, and `--build-env HAUSKA_BUILD_SHA=$GITHUB_SHA` on
the CLI deploy. `'UNSTAMPED'` is a **hard fail**, never a skip. This alone closes
the trap that let PR #310 read as shipped while starved at the BFF.

**Step 2. The wire assertions.** No browser. The three defects above are all
wire-readable. A gate that stops here already fails today, which is the point.

**Step 3. The CDP walk.** Chrome `--headless=new --remote-debugging-port`,
`Page.navigate`, `Runtime.evaluate` on `innerText`, `Page.captureScreenshot`.

## Two traps that would make this gate vacuous — the spec names both

- **`parseHash` silently falls back to `DEFAULT_PANEL_ID`** on an unknown panel id,
  so a naive deep-link assertion passes forever after a rename. Assert
  hash-identity plus panel-root, and carry the canary run every invocation.
- **CI pins `node-version: 20`, which has no global `WebSocket`.** The gate 8 job
  pins 24. Without this the gate is dead on arrival and reports nothing.

## Non-negotiables

**Verdict vocabulary is `pass | fail | refused | pass-after-cold-start`. There is
no `skip`.** This is the direct answer to the LDT divergence test that skips in CI
and to `import_ledger`'s zero SELECTs — a control that can opt out of running is
not a control.

**Settle on a terminal state, never a sleep.** The spec's own first run read a
loading state as content because the poll predicate was "does the container
exist". Poll for a terminal-state predicate, require two identical consecutive
reads, and treat a timeout as `refused`, not `pass`.

**Answer the three-question gate in the handback**: what executes it, what
triggers it, what fails when violated, and **what bypasses it**. The spec already
names the laptop `vercel deploy` bypass as *not closed, only detectable* — keep
that honest rather than claiming closure.

## Scope boundary

Gate 8 is availability-and-truth **in the app**. It is not the scrub — S1-S14
measures the store. Do not duplicate: the gate catches a *specimen*, the scrub
measures the *population*. The spec states three honest misses (the 723 retired
edges, `DrawEdge.state`, schema-version fidelity); leave them missed rather than
stretching the gate to half-cover the scrub's ground.

## Also in scope, small: gate 7's cheapest honest version

Structural commitment #3 is under $200 compute plus one hour human review per
jurisdiction, and the mold records it as not measured in code. Do not build
telemetry. **Add one column and one check: refuse to close a county with no cost
record or a null `humanReviewMinutes`.** That fails closed on the unmeasured half
instead of passing on a fabricated zero, and it ships before any instrumentation
exists.

## Acceptance

The gate runs, and it **fails** on today's production for the three named reasons.
A run against a fixture with those three defects corrected passes. The bundle
marker is present on a fresh deploy and `'UNSTAMPED'` fails. The panel-id canary
fails when the panel is renamed. Both arms, every assertion.

## Do not

Deploy. Add a dependency beyond Chrome and Node 24. Design anything that requires
a human to read a dashboard — if it needs someone to notice, it is not a control,
and say so instead of shipping it. Report the gate working because it passed once.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-30_gate8_cp1.json
  CP2: _inbox/2026-08-30_gate8_cp2.json
  CLOSE: _inbox/2026-08-30_gate8_close.json
