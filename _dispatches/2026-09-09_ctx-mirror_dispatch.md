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

# The zoningSource mirror drops the refused state

## Mission - the zoningSource mirror projects two of three earned states, and drops the third

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. This is a small, sharply-scoped change to a function you already own.

### Your seat and worktree

You are the **property seat**. `legacy-design-tools` is yours. The function is
`zoningSourceMirror` / `attachVerdictLayersToFacets` in
`artifacts/api-server/src/lib/structuralFactToFacetsWire.ts`, added by CTX-LEAVES in PR #644
(`301bb75a`).

Register your worktree in `_catalog/seat_register.json` before your first git write, with **BOTH**
`path` and `worktree` set. `git pull` immediately before editing it, add it by explicit pathspec,
never `git add -A`. The gate reads the register from disk BEFORE your command runs, so switch
branches first, then update the register.

Declare your snapshot in your first output: repository, branch, commit.

### What is blocked

The last thing between six Central Texas counties and production. Everything else is done: the
bake-side leaves are earned, the readiness gate passes, the walk's jurisdiction cohort runs, and
the Factory's zoningDistrict rail is FULLY earned for Caldwell -- 14,401 not-applicable, 10,038
value, 549 refused, and ZERO unaccounted.

The mirror is what carries that earned state onto the served payload. It carries two of the three.

### The defect, measured on a live canary

`cortex-api-00753-feg` (built from `301bb75a`, deployed at 0 percent, tag `canary`) against the
Caldwell jurisdiction cohort, 25 parcels across 9 jurisdictions:

    parcel_record says          serve emits                        walk grade
    not-applicable              {state:"absent", absence:{kind:"not-applicable", reason:...}}   PASSES
    value (a real district)     the layer URL string                                            PASSES
    refused                     {status:"absent", ..., verdict:"stamp-missing"}                 FAILS

Concretely, and verified in both stores:

    48055:103436  parcel_record_cell zoningDistrict = refused
                  reason "no tx_zoning_district_staging base layer exists for Mustang Ridge yet"
                  served zoning.verdict = "stamp-missing"

Same for 48055:103539 and 48055:103540. Ten of the cohort's 25 parcels fail on exactly this.

So the mirror already knows how to project an earned absence -- it does it correctly for
`not-applicable`, including nesting the reason where the grader can find it. It just does not have
the `refused` branch.

### Why `stamp-missing` is not an acceptable answer

`stamp-missing` is not one of `value | absent-verified | not-applicable | refused`, so
`BP-CONTENT-01` refuses it, correctly. It is `unaccounted` wearing a different word.

Worse, it USED to pass. Until 2026-09-09 the factory-side `classifyRequiredLeaf` returned
`{state:"value", ok:true}` for any object carrying an unrecognised verdict, so every one of these
graded as a POPULATED ZONING DISTRICT. CTX-LEAVES measured that and recorded it: 25 of 25 rails
graded `value` while 3 were actually absences. That hole is now closed (hauska-factory `7bf4ee1`),
which is why the mirror gap is visible at all.

Do not "fix" this by teaching the factory grader to accept `stamp-missing`. That would reopen the
hole and it is not yours to open.

### What to do

**1. Read the mirror and establish why `refused` falls through.** State it before changing
anything. The likely shape is that the branch list covers the city-limits absence and the
parcel_record `ZoningFactAbsent`, and that a parcel_record cell whose kind is `refused` matches
neither, so it lands on a default that emits the raw upstream verdict.

**2. Project `refused` the way `not-applicable` is already projected.** Carry the rail's own
reason through -- the reason is real and specific ("no tx_zoning_district_staging base layer
exists for Mustang Ridge yet") and it is what makes the refusal honest rather than a shrug. The
grader reads a nested absence's basis from `absence.reason`, so putting it there is what a passing
shape looks like.

**3. Check the other kinds while you are in there, but do NOT invent states.** If the rail can
also emit something you have no branch for, name it in your close rather than mapping it to the
nearest thing that passes.

### What you must NOT do

**Do not map `refused` to `not-applicable`.** They are different claims. `not-applicable` says the
land is not zoned; `refused` says we have no layer and decline to assert either way. Collapsing
them would make 549 Caldwell parcels claim to be unzoned when nobody knows.

**Do not emit `absent-verified`** for these. Nothing verified an absence; the layer does not exist.

**Do not touch the factory-side grader, `REQUIRED_TIER1_FACET_PATHS`, or any threshold.**

**Do not deploy.** The integration seat holds `cortex-api-00753-feg` at 0 percent specifically so
there is ONE cortex-api change to verify rather than two. Build, test, merge, and report; the
deploy and the traffic shift are sequenced on the other side.

**Do not re-bake anything.**

### Verify by violating

Unit-level: a parcel_record cell of kind `refused` must produce a served shape that
`classifyRequiredLeaf` grades `{state:"refused", ok:true}`, and the same fixture with the reason
removed must still FAIL. Import the factory grader if you can reach it, or reproduce it verbatim
and say which you did -- CTX-LEAVES imported it rather than reimplementing, which is better.

End to end, and this is the one that matters: after your change is built, the Caldwell
jurisdiction cohort graded against a canary must go from 10 zoning failures to 0. Report the
before and after counts, not a pass/fail.

### Report

CP1 after you have read the mirror and can state why `refused` falls through, before implementing.

Close with: the diff, the unit violation results, the cohort before/after, whether you found any
other unhandled rail kind, and a `leave_behind` block.

If `refused` cannot be projected honestly for some subset, say which and why rather than mapping
it to something that passes. Six counties are waiting on this, and a false green here ships a
wrong claim about 549 parcels in one county alone.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-mirror_cp1.json
  CP2: _inbox/2026-09-09_ctx-mirror_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-mirror_close.json
