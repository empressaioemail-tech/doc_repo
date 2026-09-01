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

PLAN-ROW: F-01 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-engine

# CAD-SERVE-RECONCILE dispatch

# Mission — every CAD field we hold, against every field we are about to serve, per county

## The question

For each of the six CTX counties: **what does CAD actually have, what will production
actually serve, and what is the gap?** The gap has to be closed before Wave R, so it has to
be named first.

This is read-only. It measures and reports. **It fixes nothing.**

## Why per county, and why derived rather than listed

`livingAreaSqft` is the worked example and the reason this card exists. Measured
2026-09-01: Hays 54.3 percent of parcels, Williamson 40.8, Caldwell 27.7, Bastrop 11.2,
and **McLennan and Travis exactly zero** of 114,255 and 500,307. A single global number
would have read as "about a third covered" and hidden two counties with nothing at all.

**Enumerate the field set from the catalog, never from a list somebody remembers.** Query
`information_schema.columns` for the CAD tables and enumerate the distinct keys actually
present in the atom bodies. A hand-written field list finds only the fields whoever wrote
it already knew about, and the fields nobody remembers are exactly the ones this card
exists to surface.

## Four cells, and one of them is an alarm

For every field, in every county, place it in exactly one cell:

| | served | not served |
|---|---|---|
| **has data at source** | fine | **THE GAP** — data we hold and do not ship |
| **no data at source** | **ALARM** | honest absence, if it is labelled |

**The bottom-left cell is the one to look hardest at.** A field appearing on the served
surface with no source behind it is either legitimately derived — in which case its
provenance must say so and name its inputs — or it is defaulted, inherited, or invented. A
`0` or an empty string that was never measured is the defect class this operation keeps
finding, and it will look like coverage in every count.

**The top-right cell is the operator's question.** Fields we already hold and are about to
not ship.

**The bottom-right cell is only acceptable if labelled.** No data and no state is
blank-no-state, which the gold probe already found on the five `#575` CAD value fields. No
data with `absent-verified` and a basis is correct and needs no fix.

## Method: both sides in SQL, 100 percent, then a live spot check

**Source side.** Per county, per field: rows, distinct parcels, non-null, and — for numeric
fields — how many are stored zeros. **Do not collapse zero into absent.** Bastrop carries
26,553 real `$0` improvement values on vacant land, and `living_area_sqft` has no stored
zeros at all. Those are different fields with different truths and one rule for both is
wrong.

**Serve side.** Measure what production will actually serve, which is the bake output, not
the code. Establish where the served shape lives — the twin bodies, node facets, whatever
the bake writes — and enumerate the keys actually present per county. **Say in your close
which store and table you measured and how you established it is the one Wave R publishes.**

**Then spot-check the six golds live**, because a bake row and a rendered card are not the
same thing. Today `inspectHighLevelLabel` returns `Land use` in current source while the
**shipped bundle still carries the `Zone` fallback**, and `buildableAreaPct` 56.1 sits on
the wire while the card prints `Buildable Not stamped here`. Source-fixed, bake-correct and
bundle-stale are three different states and only the last one is what a user sees.

If a field is present in the bake and absent on the rendered card, that is a serve-path
finding and it belongs in this report.

## A fifth thing to look for: pipeline words leaking onto the wire

GOLD-PROBE found `cityLimitsFact.status = unmeasured` served on `48491:76149` and
`48453:493738`, with basis "no usable parcel query point", and `etjStatus: unresolved`
leaking on **all six golds**.

Those are not "we have not looked." **The bake looked, found no usable query point, and
then put its own internal word on the wire.** `unmeasured` and `unresolved` are pipeline
states; the serve contract has four states and neither is one of them. Ruled 2026-09-01:
the serve path never emits a pipeline state word — it converts to `absent-verified` with
that basis, or it refuses the facet.

**So check every served field for state-word leakage, not just for presence.** A field
carrying `unmeasured`, `unresolved`, `pending`, `unknown`, or any other internal token is
a defect even though it is non-null and will pass every presence-shaped count. Report each
one with the field, the counties, and the basis the bake had available.

This is distinct from the four cells above: the field is served and has data at source, and
it is still wrong.

## Sampling

**100 percent for anything expressible in SQL.** Both sides are, so both should be.

For the live spot check, **area sweep, not random.** Random sampling certified a broken
Bastrop once. Take the six golds plus every parcel in one chosen block per county, and
force in the hard classes: refused-roster parcels, gate-blocked, no-row, PDD, five- and
seven-digit ids, two-tax-year parcels, and unincorporated.

## What to report

**A per-county, per-field table with the four-cell placement**, plus the source population
and the served population for each. That table is the deliverable and the gap is whatever
sits in the top-right and bottom-left cells.

Rank the gap. A field with data in all six counties that ships in none is worth more than
one with 11 percent coverage in a single county, and the operator needs to see which is
which rather than a flat list.

**Name which gaps are source gaps and which are pipeline gaps.** Travis living area is a
CAD acquisition problem; a field we hold everywhere and never serve is a bake or serve
problem. They go on different cards and conflating them wastes a lane.

## Store discipline

`cortex-prod` holds `hauska_mcp` and `neondb` on one compute. Take the store token, run one
heavy operation at a time, and do not run inside a Tuesday 05:00 to 06:00 UTC Neon
maintenance window.

Landmines that return confident wrong answers: the atoms store is database **`hauska_mcp`**,
not `neondb`; factory `runs.status` is `success`, not `succeeded`; `landing.method` is
`ring` on every persist row including `covers-v1`; a county's latest factory success may be
a `persist:false` measure run; and **`jurisdiction_tenant` is not a FIPS scope** — 72
`cad-parcel-roll` atoms carry a bare-FIPS or foreign-county tenant, so scope by half-open
`entity_id` FIPS ranges as in `_inbox/2026-09-01_owner-rowcount_table.json`.

## Do not

- Do not fix any gap you find. Finding and fixing are separate cards.
- Do not write, bake, stamp, or backfill anything.
- Do not hand-write the field list; derive it from the catalog and from the bodies.
- Do not collapse stored zeros into absent, and do not fabricate a zero for a missing value.
- Do not report a served field from code; measure the bake output and the rendered card.
- Do not random-sample the live check.
- Do not scope by `jurisdiction_tenant`.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived field list and how you
derived it, which store and table you measured as the serve side and how you established it
is what Wave R publishes, the per-county per-field four-cell table, the ranked gap split
into source gaps and pipeline gaps, and any field served with no source behind it. Name
what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_cad-serve-reconcile_cp1.json
  CP2: _inbox/2026-09-01_cad-serve-reconcile_cp2.json
  CLOSE: _inbox/2026-09-01_cad-serve-reconcile_close.json
