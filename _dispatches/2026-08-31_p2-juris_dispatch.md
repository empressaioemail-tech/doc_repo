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
repo: hauska-factory

# P2-JURIS containment resolved to a number P3 can consume

# Mission — P2-JURIS containment, resolved to a number P3 can consume

Plan row: F-01. Board: `_inbox/2026-08-31_p2_juris_partition_record.md`. Decision:
`_decisions/2026-08-31_p2_juris_totals_unmeasured.md`.

## What resolution means

P3 cannot be scoped until one six-county containment split exists, measured under
ONE declared method, with the 2026-08-30 baseline either reconciled to it or
discarded on a stated reason. Anything less leaves P3 stamping `not-applicable`
off a number that has already been contradicted.

Three sub-problems. B is first and may be answerable with no heavy scan.

## A. The instrument

Full-county containment emits for Caldwell (24,989 / 78s) and Bastrop (62,257 /
129s) and cancels at 180s for Hays (116,421), McLennan (114,255), the six-county
run, the Hays 30k slice, and probe6. Williamson (282,570) and Travis (380,918)
were never run.

Four cost mechanisms were proposed and all four lost, each a curve fitted through
two or three points. Do not offer a fifth fit.

| Dead mechanism | Killed by |
|---|---|
| parcels-linear (~1.37 ms/parcel) | predicted McLennan ~156s; it cancelled |
| city-count (parcels x roster touches) | Hays 13 vs McLennan 21; both cancelled |
| chunk-linear | confounded by a plan flip, re-opened, not retired |
| Austin vertex budget | real straddle, but only 3.56% of Hays parcels reach its bbox |

Settled and not to be re-derived: Bastrop and Caldwell emit on Hash Join. Hays-full
(EXPLAIN C) and McLennan cancel on that same shape, so the Hays-full cancel is
runtime, not a plan flip. The Hays 30k Nested Loop was a slice artefact:
`IN (SELECT ... LIMIT)` is opaque, estimated 1,841 against an actual 30,000.
Cost estimates here rest on a `rows=1` cardinality lie, and the cheaper-costed
plan is the one that cancelled.

Two instruments remain live. Neither is licensed as an answer:
- **Range-chunk.** `prop_id >= X AND prop_id < Y` is estimable where the LIMIT
  subquery was not, and should hold Hash Join. It carries no mechanism-backed
  prediction, so running it is an empirical cost-vs-parcels test at a fixed city
  set, not a confirmation.
- **Per-city bbox-reach x npoints.** This is the measurement that would actually
  name the product driving cost. It was offered and not licensed. It is licensed
  now.

## B. The method disagreement (do this first)

The board's P3 populations (357,269 not-applicable / 624,141 in-city / 981,410)
come from `_inbox/2026-08-30_ctx_w3_collect_amendments.md` lines 66-76. The 08-31
runs re-measured two of those six counties under the 1e-8 floor with ring
containment. Both disagree with the baseline, in opposite directions:

| County | 08-30 in-city | 08-31 in-city | Delta | Denominator |
|---|---|---|---|---|
| Bastrop 48021 | 12,318 | 11,992 | -326 | 62,257 both runs |
| Caldwell 48055 | 10,310 | 10,628 | +318 | 24,989 both runs |

Denominators agree exactly, so the parcel universe is identical and only the split
moved. The Bastrop -326 is documented as 320 slivers under 1e-8 plus 6 unnamed.
**The Caldwell +318 is documented nowhere and runs the opposite way.**

Two candidate mechanisms for the Caldwell delta, neither ruled out:
1. Floor application alone. Rejected as sufficient on its own, because the floor
   removes in-city hits and cannot add 318 of them.
2. Method change. The 08-30 doc says Caldwell is "a bbox-centre approximation
   because 48055 carries no parcel geometry." The 08-31 emit says 100% ring,
   `n_bbox_centre` 0. Those two statements contradict each other. Either geometry
   landed between the runs or one record misdescribes its own method.

Establish which. The 08-31 SQL is at `sql/p2-juris/` in the join worktree. **If the
08-30 method cannot be recovered from a tracked artifact, do not reconcile to it.
Declare the baseline unrecoverable and discard it**, and say so in the close, because
a reconciliation against an unrecoverable method is a fabricated agreement.

Direction matters and is the reason this is first: stamping `not-applicable` from
the 08-30 number would over-stamp Caldwell by 318 parcels that are in fact in-city.
That is the exact defect P3 is warned against, an unearned structural claim.

## C. The Bastrop 6

+326 in-city shift is 320 slivers under 1e-8 plus 6 unnamed. The leading CP1
mechanism is a ring leaving 48021 and hitting a city that does not intersect the
county polygon. It is unproven.

The probe that tests it is **unincorporated non-sliver Bastrop parcels against
cities in an adjacent county that do NOT intersect 48021**, same 1e-8 floor. That
is a different predicate, not a scoped re-run. Cities overlapping 48021 is the
wrong cut, and dropping equality against all 1,222 cities was already tried: same
62,257 parcels, ~100x the city side, 180s cancel. Equality is what makes Bastrop
tractable.

`49939` is a literal in the record, not an identity set, so a 326-vs-320 set-diff
is starved. If you want the 6 named you must emit the identity set.

The 6 do not gate the six-county split. Do not let them block A or B.

## Do not

- Do not raise `statement_timeout` above 180s.
- Do not adopt any split without a measured six-county emit under one declared method.
- Do not cut a chunk with `IN (SELECT ... LIMIT)`. It flips the plan.
- Do not use Neon MCP as the timed instrument. `-32001` is the HTTP client, not
  Postgres, and `SET LOCAL` read-only does not bind across MCP statements.
- Do not run psql from a laptop. Short-lived minted RO credential, read-only proven
  by violation (a durable `CREATE TABLE` must refuse) each session, credential
  cleared after each.
- Do not mint a write URI. Persist is not this card; it waits on the P2 job template.
- Do not treat `breadth_*` as a jurisdiction source. It is name-normalisation only.
- Do not give a CDP a `place_fips`.
- Do not run two heavy scans against one Neon concurrently.
- Do not offer a fifth cost fit through two or three points.
- Do not touch any repository other than the Factory join worktree.

## Known leave-behind

Sentinel `prop_id` `"0"` is live in `txgio_parcel` (surfaced by the Bastrop
`min(prop_id)` sampler). It is a persist-time problem, recorded here so it is not
re-found as new.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
(repo, branch, commit) in the first output. State the falsifier for each check
before running it. `leave_behind` named, `none` is valid. Subagents do not commit.
Verification does not delegate below the lane planner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_p2-juris_cp1.json
  CP2: _inbox/2026-08-31_p2-juris_cp2.json
  CLOSE: _inbox/2026-08-31_p2-juris_close.json
