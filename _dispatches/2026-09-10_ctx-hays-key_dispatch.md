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

# Hays serves one parcel's money under another parcel's address

# CTX-HAYS-KEY — Hays serves one parcel's money under another parcel's address, and has since August

repo: legacy-design-tools

Operator ruling 2026-09-10: Hays 48209 is **out of the current CTX wave**. The other five
counties go to production without it. This lane owns Hays and is not on anyone's critical path.
Take the time to be right.

## What is measured, and verified twice by different instruments

Cross-vintage `prop_id` ZIP stability in `cad_property`, rows present at both 2025 and 2026:

    48453 Travis      333,937 paired    99.71% agree
    48055 Caldwell     24,549 paired    99.21% agree
    48209 Hays        126,808 paired    53.86% agree

CTX-B7 derived 99.73 / 99.21 / 53.86 from its own instrument; the integration seat reproduced
53.86 / 99.71 / 99.21 independently. The two agree.

**On the production store, right now:** of Hays tier-1 rows carrying a served `situsZip`,

    98,381  the served ZIP agrees with the declared 2026 roll row for that prop_id
    39,061  no 2026 roll row at all (1,874 of them still serve money)
    29,404  the served ZIP CONTRADICTS the declared roll row, and ALL 29,404 serve money

The same query against staging returns 29,472. This is not a staging artifact and it did not
arrive tonight: production has served it since the August bake.

CTX-B7 measured the same population from the other side and found those parcels serve another
parcel's `cadRoll` dollars, `yearBuilt`, legal description and exemption codes. Travis at 429
and Caldwell at 92 are the normal churn baseline of 0.28 to 0.80 percent. Hays at 45.4 percent
is roughly 160 times that.

A worked example found before any of this was measured: `48209:40138` resolves from the address
index as 100 Riverside Dr, San Marcos, and draws as 340 Windmill Way, Buda, carrying acreage
identical to four decimals with `48209:26199`. That payload holds owner and land use back with
"TxGIO prop_id does not join the CAD account" while serving the four money rails joined on that
same id.

## What the code already knows

`48209` is **already** in `LANDUSE_JOIN_DISABLED_FIPS_SEED`, for this same key failing between
CAD and TxGIO. That guard was never applied to CAD-to-CAD across vintages, which is the join
that produces the numbers above.

Hays' declared vintage is `{ taxYear: 2026, tier: "cad-export" }`. Its 2025 population is two
sources, `stratmap25-landparcels_48209_lp.zip` (116,421) and `hays-export2.zip` (55,695). Its
2026 roll is 134,606 rows against a 2025 total of 172,116, and CTX-HAYS already established
that the 172,116 comparator "was never a clean number to begin with".

## The question

**What acquisition makes a Hays parcel node's geometry, address and money describe the same
physical parcel?**

Name the candidate mechanisms and reject the ones you reject with evidence. At minimum, and
none of these is a recommendation:

- re-declare 48209's vintage, if some other vintage is internally coherent;
- re-acquire Hays with an explicit crosswalk between vintages, which is what
  `cad_property_vintage_crosswalk` exists for, noting CTX-RETIRE found it holds zero rows for
  Caldwell's dropouts and you should check what it holds for Hays before assuming;
- extend CTX-B7's same-parcel ZIP gate to the dollar path, which is the cheapest change and the
  one that touches live money;
- key Hays on something other than `prop_id`, if the source offers a stable identifier;
- serve nothing for the contaminated population until the key is fixed.

Establish **why** the key is unstable before choosing. A renumbering between roll years, two
different source conventions merged into one column, and a genuine parcel resplit all produce
a 46 percent disagreement and they do not have the same fix. Say which one it is, with
evidence, and say what would have told you it was one of the others.

## The second thing this lane owns

CTX-B2 established from source that `buildRecordRetirement` fires on absence from the declared
vintage with no check for any other vintage, and emits a basis asserting the account was
"split, merged, renumbered or removed". For roughly 37,813 Hays prop_ids that carry no CAD
appraisal signal at any tax year, that is a causal claim nothing verified. It passes every
existing check.

That was scoped as its own card, CTX-B5, and never ran. It is Hays-shaped, so it is yours.
Decide whether a record that was never on a roll can be distinguished at bake time from one
that left it, and note that Caldwell `48055:1` is a genuine retirement and must keep working
as your control.

## The disposition you do NOT make

**Whether to pull Hays back from production while this is fixed is the operator's call, not
yours.** Give him what he needs to make it: how many customer-visible parcels are wrong, what
a customer sees on one today, whether the wrongness is detectable from the payload itself, and
what pulling it back would cost in coverage.

Report it. Do not act on it.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. No
deploys, no Cloud Build, no Cloud Run job, no bake, publish or walk. The integration seat owns
every execution, and the other five counties are moving through production while you work.
Nothing you do may change their path.

If you conclude a change belongs in hauska-factory, say so precisely enough to dispatch and do
not make it.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the instability mechanism with its evidence and the mechanisms
you rejected; per-population counts for every disposition you propose; the retirement-basis
decision and its control run; the operator packet described above; violation runs for anything
you implement; and `leave_behind`. If the right answer is that Hays needs an acquisition this
repo cannot perform, that is a successful close. Push and open a PR only if you wrote code.
Report the PR number and head SHA, or state plainly that there is none and why.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-hays-key_cp1.json
  CP2: _inbox/2026-09-10_ctx-hays-key_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-hays-key_close.json
