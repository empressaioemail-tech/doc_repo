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

# Six required tier1 leaves are bare nulls; one is an absent key

## Mission - six required tier1 leaves are bare nulls, and one of them is an absent key

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. Everything you need is here. Do not re-derive the numbers below -
re-MEASURE them, which is different.

### Your seat and worktree

You are the **property seat**. `legacy-design-tools` is yours. The write path is
`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts`.

Register your worktree in `_catalog/seat_register.json` before your first git write, with **BOTH**
`path` and `worktree` set. An entry carrying only `worktree` resolves to an empty repoPath and
the gate refuses every git write with `product_index_foreign`. `git pull` immediately before you
edit that file, add it by explicit pathspec, never `git add -A`. The gate compares your CURRENT
branch to the REGISTERED one, and it reads the register from disk BEFORE your command runs - so
switch branches first, then update the register, or the gate blocks the very commit that would
fix it.

Declare your snapshot in your first output: repository, branch, commit.

### This is the same defect you already fixed once

You fixed `baseFacts.situsState` today (PR #642, `c6b55a28`) by deriving it from `countyFips`
instead of taking `row?.situs_state ?? null` off the TxGIO join. That was correct and it worked.

It was not one leaf. It was one INSTANCE of a pattern, and the pattern is all over this file:

    situsState: row?.situs_state ?? null          <- you fixed this
    landUse:    code ? { ... } : null             <- same shape, line ~457
    situsCity:  strOrNull(claim.situsCity)        <- same shape
    situsZip:   strOrNull(claim.situsZip)

A required leaf is being handed a bare `null` whenever its input is missing. `BP-CONTENT-01`
requires every required leaf to classify as one of `value | absent-verified | not-applicable |
refused`, and states plainly that a present key holding null is none of those. So every one of
these fails the walk, for every parcel where the input is absent.

### How these surfaced, which matters for how you treat them

They were invisible until today. The verify walk's sweep was street-local, so it drew ~60
parcels from one street and any rail varying by jurisdiction was sampled all-or-nothing. A
jurisdiction-stratified cohort was added to the walk (hauska-factory `e84862d`) and, on Caldwell,
the street sweep passed 60 of 60 while the new cohort failed 16 of 25 - surfacing all six leaves
below in a single run.

So: these are not new breakage. They are long-standing and were never measurable. Do not look for
a recent regression; there isn't one.

### The measurement, staging tier1, 2026-09-08

`n` = bare null. `a` = key ABSENT entirely.

    leaf                        Bastrop     Caldwell        Hays    McLennan      Travis  Williamson
    provenance.zoningSource     68243/0    38442/63  116905/768  58345/1165    267076/0    486218/0
    provenance.landUseSource    62087/0     16925/0     42387/0     23183/0    500307/0     91021/0
    baseFacts.landUse           62087/0     16925/0     42387/0     23183/0    500307/0     91021/0
    baseFacts.situsCity         19013/0     15334/0      4308/0      2325/0    363797/0    293146/0
    baseFacts.situsZip        3404/16104    15465/63    5436/768   1182/1165     31429/0    293192/0
    baseFacts.situsState        31866/0        63/0     44803/0      1165/0    119389/0     91021/0

Three things to read off that table before you touch anything:

**`landUse` and `landUseSource` are identical in every county.** Same population, to the parcel.
They travel together and are one fix, not two.

**Travis `landUse` is 500,307, which is EVERY Travis parcel.** A leaf that is null for 100 percent
of a county is not the same finding as one that is null for 40 percent. It may be the same fix
and it may be a Travis CAD ingest gap wearing the same costume. Establish which before you treat
it as covered by this mission; if it is a different cause, say so and scope it separately.

**`situsState` is already fixed** - Caldwell dropped from 23,891 to 63 because it was re-baked
with your fix. The other counties still show the old numbers because they have not been re-baked
yet. Nothing to do there; it is in the table so you can see the fix working and so you do not
double-fix it.

**Caldwell's 63 recurs across three leaves** (`zoningSource` absent 63, `situsZip` absent 63,
`situsState` null 63). One cohort of 63 rows behaving differently from the rest of a re-baked
county is a real question - most likely tier1 rows the re-bake did not touch. Worth one query
before you assume.

### The honest state for each leaf, and they are NOT the same answer

This is the part that needs judgement rather than a sweep. Getting it wrong in the generous
direction is the failure mode.

**`landUse` + `landUseSource`.** The 2026-09-05 join-miss ruling
(`_decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md`) DOES reach this one, and
landUseCode is literally its motivating case. CAD is the authority for CAD facts, the ingest
query is scoped across every tax year, so a miss is a confirmed absence of the row.
`absent-verified` is honest here.

**`situsCity`, `situsZip`.** From the CAD claim. When the claim was consulted and carried
nothing, `absent-verified` is honest by the same argument. Note that `situsZip` has an ABSENT-KEY
population (Bastrop 16,104) as well as a null one - see below, they are not the same bug.

**`provenance.zoningSource` - DIFFERENT, and this is the one to get right.** The 09-05 ruling
does NOT reach it, for the same reason it did not reach `situsState`: absence-of-row means
absence-of-fact only when the source OWNS the fact, and a zoning layer does not own whether a
parcel is zoned. More importantly:

> `provenance.zoningSource` must MIRROR the `zoningDistrict` rail's already-earned cell state,
> not be decided independently.

The Factory already computes that rail honestly - `value` where a district was stamped,
`not-applicable` for genuinely unzoned unincorporated land, `refused` where a city's layer is
declared incomplete (Elgin). If this leaf invents its own answer, the same question gets two
answers that can disagree, and a served payload that contradicts its own rail is worse than one
that admits it does not know. Derive it from the rail.

### What must NOT happen

**Do not write `absent-verified` for `zoningSource` where a city layer is incomplete.** Elgin is
declared HELD precisely because its unmatched parcels are not verifiably unzoned. Writing
absent-verified there is the lie that passes every check, and it is already a standing ruling.

**Do not remove any leaf from `REQUIRED_TIER1_FACET_PATHS`** and do not admit `null` as a fifth
state. Both make the walk pass by lowering the floor.

**Do not touch the anti-zombie envelope strip.** `facets.envelope` is permanently null on the
serve BY DESIGN, and the factory-side walk now FAILS a non-null envelope as a resurfaced zombie.

**Do not deploy anything.** Build and merge only.

**Do not re-bake any county.** The bake sequence is the integration seat's.

### The absent-key population is a separate, worse bug

`situsZip` is missing ENTIRELY on 16,104 Bastrop rows, 1,165 McLennan, 768 Hays - and
`zoningSource` likewise on the same-sized cohorts. A missing key is worse than a null: null is
countable and a missing key is invisible, which is the whole argument behind the
every-record-starts-with-its-full-shape ruling. Whatever the state turns out to be, the KEY must
always be present. Treat this as its own fix even if it shares a root cause.

### Verify by violating

For each leaf, bake one parcel in the populated case and one in the absent case, and confirm the
absent case now classifies as a four-state rather than null. Then confirm the check can still
fail: feed a payload with that leaf null and confirm `BP-CONTENT-01` still refuses it. A check
observed only passing has not been observed working.

Then run the falsifier that actually matters here: re-grade the Caldwell jurisdiction cohort (9
jurisdictions, 25 parcels, including the unincorporated bucket) and report pass/fail per leaf. It
failed 16 of 25 before this work. If it passes 25 of 25 afterwards, say so with the numbers. If
some still fail, name which and why rather than reporting partial success as success.

### Report

CP1 after you have read the write path and decided the per-leaf states, BEFORE implementing -
the `zoningSource` decision especially, since it is the one where a defensible-looking wrong
answer is available.

Close with: the diff, per-leaf before/after counts for all six counties, the Travis `landUse`
100-percent determination, the Caldwell-63 explanation, the violation results, and a
`leave_behind` block.

If any leaf cannot be resolved honestly, say so plainly and do NOT close green. Six counties are
blocked behind this and a false green costs more than an honest gap.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-08_ctx-leaves_cp1.json
  CP2: _inbox/2026-09-08_ctx-leaves_cp2.json
  CLOSE: _inbox/2026-09-08_ctx-leaves_close.json
