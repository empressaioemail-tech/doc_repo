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

PLAN-ROW: P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Hays lost a fifth of its accounts between vintages and nobody has read the acquisition record

# CTX-HAYS — Hays lost a fifth of its accounts between vintages, and nobody has read the acquisition record

Repo: `legacy-design-tools`. The CAD ingest and the `cad_property` store are authored
here (`lib/cad-ingest/`, `lib/db/`), NOT in hauska-engine and NOT in hauska-factory.
The factory only reads `cad_property`; it has no write path to it. A prior dispatch in
this fleet routed CAD ingest to hauska-engine and the lane correctly re-based to here.
Do not repeat that.

## The finding, and it is blocking a launch county

Measured 2026-09-09 against `f06-staging-neondb` and filed at
`_inbox/2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md`:

    county       rolls held                       current vintage   direction
    Bastrop      2025 = 77,799                    2025  77,799      single vintage
    Caldwell     2025 = 24,989   2026 = 48,382    2026  48,382      GREW
    Hays         2025 = 172,116  2026 = 134,606   2026  134,606     SHRANK 21.8%
    McLennan     2025 = 114,255                   2025  114,255     single vintage
    Travis       2025 = 380,918  2026 = 492,848   2026  492,848     GREW
    Williamson   2025 = 282,570  2026 = 319,480   2026  319,480     GREW

Hays is the only county whose current roll is smaller than its prior one. 37,510
accounts present in 2025 and absent in 2026, against a shrinking base. Caldwell's real
churn population, the one CTX-RETIRE was built for, is 267 on a roll that grew, which
is the shape genuine splits and merges take.

The Hays staging bake refuses `CADROLL_RENULLED` at a 22.22 percent dollar-miss rate
against a 2 percent ceiling. The gate is correct and must not be relaxed: letting Hays
through would publish 38,444 parcels carrying no market, assessed, land or improvement
value onto a customer surface, silently. **Do not touch `MAX_MISS_RATE`.**

Operator ruling 2026-09-09: **re-acquire the 2026 roll.** Baking from 2025 with a
vintage marker was considered and rejected as worse.

## What you must establish BEFORE re-acquiring, because it forks the answer

Nobody has read the acquisition-side record. Two mechanisms produce this same
observation and they need different responses. Determine which, with evidence:

**Mechanism A, ours.** The 2026 ingest ran and did not complete: a truncated download,
one of the multi-file drop's files missing or partial, a parse that dropped rows
silently, a filter, or a run that died partway and was never retried.

**Mechanism B, theirs.** Hays CAD published a partial or restructured 2026 export and
134,606 is faithfully what the source contains.

These are not interchangeable. Under A you re-acquire and the problem disappears. Under
B, re-acquiring changes nothing, and the county needs an operator ruling about serving a
county whose own appraisal district has not published a complete current roll. Reporting
A when it is B costs a day; reporting B when it is A costs the county.

Relevant shape from `lib/cad-ingest/src/counties.ts`: Hays is `format: "orion"` (Tyler
Orion PropertyDataExport), bulk page `https://hayscad.com/data-downloads/`, published as
quoted-CSV `.txt` drops with record types 1/2/3/5 in SEPARATE files
(Property/Owner/Land/ImpSegment). The record-1 Property file is the account population.
A multi-file drop where one file is short is exactly the shape that produces this
finding, and it is the first thing to check.

Note that Williamson is also `orion` and it grew, so the format alone does not explain
it. Do not stop at "Orion is flaky."

## The work

1. Read the acquisition record for Hays 2026. Find what ran, when, with what source
   vintage, and what it reported. Name the table or log you read; do not infer it from
   the shape of `cad_property`. Reading the store to guess at the ingest is reading a
   proxy for the authoritative record.

2. Count the source. Fetch the current Hays 2026 drop and count distinct accounts in the
   record-1 Property file BEFORE parsing into anything. That number against 134,606 and
   against 172,116 settles A versus B on its own.

3. Report the fork with evidence, then act:
   - If A: re-acquire, apply, and re-measure `cad_property` for 48209 tax_year 2026.
     Target is a roll that is not smaller than 2025 without a named reason.
   - If B: STOP. Do not fabricate, do not backfill from 2025, do not widen anything.
     Write the finding and hand back for an operator ruling.

4. Whichever branch: state whether any OTHER county has a partial vintage that happens
   not to be the current one. Caldwell's 2025 at 24,989 against a 48,382 roll is exactly
   that shape and is harmless today only because 2026 is the vintage being read. That is
   a latent instance of the same defect and it should be counted, not left to surface
   later.

## Pre-registered falsifier, required before you run anything

State, in CP1, what result would prove your hypothesis wrong. If the answer is that no
result would, you do not have a check. Specifically: name the count you expect from the
source file and what you will conclude if it comes back at 134,606 rather than ~172,000.

## What you must NOT do

Do not relax `MAX_MISS_RATE` or any gate threshold. The gate found a real data problem
and no code change should paper over it.

Do not bake, publish, run a walk, or deploy anything. Do not run any Cloud Run job or
Cloud Build. The integration seat owns every execution on this program.

Do not write to hauska-factory, hauska-engine, or hauska-map.

Do not backfill 2026 from 2025 rows under any circumstances. An account that is not on
the current roll is `absent`, and writing a 2025 value into a 2026 vintage is the
fabrication this program's whole gate structure exists to prevent.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- The authoritative acquisition record you read, named, with the literal query or path.
- The source-side account count with its counting rule, and the A-versus-B verdict.
- If you re-acquired: before and after counts for 48209 by tax_year, live.
- The other-counties partial-vintage sweep from item 4.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-hays_cp1.json
  CP2: _inbox/2026-09-09_ctx-hays_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-hays_close.json
