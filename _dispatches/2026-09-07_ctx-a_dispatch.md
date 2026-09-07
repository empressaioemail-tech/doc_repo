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

# CTX-A dispatch

# CTX-A — zoning spine: land band1, then re-stamp all six counties

## Why this is the critical path

On 2026-09-03 a StratMap reload replaced every parcel row in all six Central Texas counties
and dropped the derived zoning stamp. `txgio_parcel.zoning_district` is now SQL NULL on
1,516,110 parcels across Bastrop 48021, Caldwell 48055, Hays 48209, McLennan 48309,
Travis 48453 and Williamson 48491. Not a sentinel, not empty string. All NULL.

Verified live by the integration seat: Caldwell returns 32,781 parcels / 0 stamped /
last ingest 2026-09-03, while Comal 48091, which was NOT reloaded, returns 114,430 parcels /
28,305 stamped / last ingest 2026-07-14 on the same column and the same predicate. Comal is
your control. It must stay 28,305 and must not be touched.

Nothing downstream can recover this. The bake reads the column verbatim; it has no
point-in-polygon capability and legacy-design-tools contains ZERO references to
`tx_zoning_district_staging`. The 582,442 baked snapshot rows that still carry a real zoning
district are the only surviving copy of the derived value, and the bake lane that wrote them
has no monotonic guard, so a bake before a re-stamp would overwrite the last copy with nulls.

Everything in this sprint is gated on you.

## Step 1 — land `feat/zoning-band1` FIRST. Do not merge it.

Commit `e3733e40`, 2026-09-02, one file: `lib/cad-ingest/src/txgio/zoning-layers.ts`.
No PR was ever opened. It is 1 ahead and **111 behind** main.

It wires six cities into ZONING_LAYERS that are absent from main. Verified by fetching both
blobs and grepping, with controls: Smithville 0 on main / 6 on branch, Luling 0/3,
Martindale 0/3, Woodcreek 0/4, Lakeway 0/3, Robinson 0/3; and as proof the grep works,
Elgin 11/9 and Bastrop 8/9.

That Elgin control is why you must NOT merge. Main has 11 Elgin references and the branch has
9, because the branch predates Elgin work that landed after it. A merge would regress Elgin.
Rebase the single commit onto current main, or cherry-pick it, and re-verify all six cities
present AND Elgin still at its main count before you open a PR.

The six cities' polygons are already staged and sitting unused: Smithville 91, Luling 140,
Martindale 17, Woodcreek 3,165, Lakeway 749, Robinson 6,340. That is 10,502 polygons that
have never produced a stamp.

## Step 2 — dry-run the stamp

Entry point is the zoning-stamp CLI in `lib/cad-ingest` (`zoning-cli.ts`). Find its real flag
surface by reading the arg parser, not by guessing.

Dry-run per county and report, before applying anything: how many parcels the run would stamp,
against which city layers, and how that compares to the staged polygon counts. The staging
side is clean, so a surprising number is your bug, not the data's: 23 city layers and 93,785
district polygons across the six counties, zero nulls, zero empties, zero sentinel district
codes, confirmed by direct query.

## Step 3 — apply, all six

This is a production write over roughly 1.5 million parcels. It is state-changing, so it
leaves a durable record naming the counties, the timestamp and the invocation. If you cannot
write that record, do not run it.

Neon maintenance is Tuesday 05:00 to 06:00 UTC on both stores and is enforced as a refusal
elsewhere in this fleet. Do not have a long run in flight across it.

## Step 4 — verify, and verify by violation

Per-county stamped counts, reconciled against the staged polygon coverage for that county's
wired cities. A county that should be partially stamped and comes back fully stamped is as
wrong as zero.

Then the violation test, which is the part that proves the instrument: confirm a parcel
OUTSIDE every wired city polygon remains unstamped. A stamp run that stamps everything is
indistinguishable from a correct one if you only count non-nulls.

And confirm Comal 48091 is still 28,305 and untouched.

## Acceptance

All six counties return non-zero stamped counts reconciling to their wired-city polygon
coverage; the six band1 cities appear among the stamped jurisdictions; an out-of-city parcel
is still NULL; Comal unchanged; a durable run record exists naming counties, timestamp and
invocation.

## Do not

Do not run any bake. Do not touch `lib/adapters/src/local/setbacks/` — CTX-B owns it.
Do not touch `artifacts/api-server` cad-roll paths — CTX-C owns those.

## Standing rules for this lane

Repo: legacy-design-tools. Worktree: the checkout you already hold. Branch: your current branch. Work ONLY there. If you are in another
seat's checkout, stop and say so; do not work around it.

You commit your own repo. You do not touch doc_repo. If you fan to subagents they hand you
artifacts and you commit; they never touch git.

Program is P-124, the Central Texas completion sprint. Lane CTX-A. Coordination seat is
doc-repo-26 (integration). Report to it, not to another lane.

DEPLOY RULE, binding: production deploys of legacy-design-tools and hauska-engine route
through doc-repo-26 during this sprint and every deploy names its commit. Six lanes land to
those two mains and a deploy ships whatever is there. Do not shift traffic on your own.

Anything you find that is real and outside your scope: report it, do not fix it. Another lane
probably owns it.

Every claim you return names its instrument. A merged PR is not a deployed change and a
deployed change is not a serving one; only `git merge-base --is-ancestor <merge-commit>
<served-commit>` proves a fix is in what serves. Read Cloud Run traffic from JSON by field
name, never a positional --format=value(), because a blank field shifts every column.

If a check returns the answer you expected, interrogate the instrument before believing it.
Pre-register what result would prove your check wrong. If no result would, it is not a check.

## Close

Declare `leave_behind` in your close, even if the answer is `none`. It is required regardless.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-07_ctx-a_cp1.json
  CP2: _inbox/2026-09-07_ctx-a_cp2.json
  CLOSE: _inbox/2026-09-07_ctx-a_close.json
