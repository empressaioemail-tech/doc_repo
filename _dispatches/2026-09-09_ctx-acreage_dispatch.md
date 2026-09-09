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
repo: hauska-factory

# The first county graded by the corrected walk failed on a class nobody has measured

# CTX-ACREAGE — the first county graded by the corrected walk failed on a class nobody has measured

Repo: `hauska-factory` for the diagnosis. The fix may not live there; establishing where
it does live is part of the mission.

## The measurement

Williamson staging walk `198fbb56`, 2026-09-09T22:30:50Z, on publish image
`sha256:65fde738` (jobs gen 33/34, `_LDT_SHA 7a739849`), rail applied earlier the same
hour:

    pass = 322    fail = 8

Seven of the eight carry the identical reason:

    3 required leaf(s) fail the four-state contract:
      baseFacts.acreage is null; null is not value|absent-verified|not-applicable|refused;
      zoning declares verdict="unmeasured" which is not one of ...

    48491:76149  76153  76155  76226  365365  77381  73073

The eighth is different:

    48491:PRIVATE ROAD   HTTP 400

## Why this matters more than eight parcels

Williamson touches **none** of the four defect classes this program spent 2026-09-09
resolving. Zero punctuation-only situs rows out of 602,050 (measured by CTX-PROV), no S-P
class, no staleness population, no ceiling in play. It was chosen as the first read
precisely because a failure there could not be blamed on a county's data.

It also had never been graded on content. Its last passing walk, 2026-08-30, carried only
`BP-MEANING-01` and `BP-VERIFY-01`; `BP-CONTENT-01` did not exist. **So this is the first
honest grade Williamson has ever received, and eight parcels is a floor, not a ceiling,
until the population is counted.**

## Three questions, and they are three different defects

Do not treat these as one number or fix them as one change. Two prior lanes on this
program reported distinct classes as a single figure and had to be corrected.

**1. Null `baseFacts.acreage`.** A bare null where the four-state contract requires
`value`, `absent-verified`, `not-applicable` or `refused`. Count the population across all
six counties (48021, 48055, 48209, 48309, 48453, 48491) with a stated counting rule and a
predicate control proving the query can return a non-zero answer for a population you did
not target. Then find the write path that produces it. A bare null is what blocked every
county earlier today in a different leaf, and the fix then was an earned absence, not a
default.

**2. `zoning` declaring `verdict="unmeasured"`.** This is the more interesting one. The
rail's own vocabulary is `value` / `not-applicable` / `refused`, and CTX-CEILING accounted
every Williamson zoning cell hours before this walk. So something is emitting a state the
contract does not recognise.

That is the same shape as `classifyRequiredLeaf` silently passing any unrecognised
declared state as populated, which was fixed this morning — the fix made the walk *refuse*
an uninterpretable state rather than accept it, so this failure may be that fix working
correctly and exposing a producer nobody had seen. **Establish where `unmeasured`
originates and whether it reaches other counties.** If the walk is now correctly refusing
something that was always wrong, say so plainly; that is a good outcome badly disguised.

**3. `48491:PRIVATE ROAD`.** That is a literal string where a `prop_id` belongs, and it
returns HTTP 400. Establish whether it is a lineage artifact or a live id-handling bug.

Relevant prior art you should read rather than rediscover: Caldwell's `48055:1` turned out
to share a `prop_id` with 203 distinct `txgio_parcel` features and 227 share `'0'`, almost
certainly sentinel or bucket ids from the `stratmap25-landparcels` ingest
(`_inbox/2026-09-09_ctx-retire_close.json`). CTX-HAYS-SPLIT then established that StratMap
rows were grafted into `cad_property` and overwrote `source_file` in place
(`_inbox/2026-09-09_ctx-hays-split_close.json`). `PRIVATE ROAD` looks like the same family.
**It is a hypothesis and you must test it, not assume it.** State the second mechanism you
rejected.

## Do not make the walk pass

The walk is correct to fail all eight. Do not widen `BP-CONTENT-01`, do not add
`unmeasured` to the permitted state set, and do not filter any parcel out of the cohort.
The jurisdiction cohort samples `prop_id` ascending, which biases toward low-numbered and
degenerate parcels; two prior lanes deliberately refused to tune that, on the grounds that
adjusting a sampler to avoid a failure it correctly found is sampling around the problem.
That judgement stands.

If a parcel genuinely should not be graded, that is a named class with a counting rule and
a written justification, never a filter.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any bake, publish, walk or Cloud Run job. The
integration seat owns every execution. Reading a served payload over HTTP is not an
execution and is expected.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`. If the fix belongs
in one of them, report it with enough precision that a dispatch can be compiled from your
close without a second diagnostic pass — CTX-PROV did exactly that and it saved a full
lane.

Do not touch `cloudbuild.publish.yaml`'s pin or any ceiling.

## Traps carried forward, all paid for today

`parcel_record_cell.place_key` is `<fips>:<prop_id>`, NOT `node:<fips>:<prop_id>`. The
integration seat assumed the latter and got six rows of `n=1` that could have been mistaken
for an answer. `place_layer_snapshots.place_key` IS `node:<fips>:<prop_id>`. Two tables,
two shapes.

Unscoped scans on `parcel_record_cell` time out. Scope by `place_key` prefix or by
`updated_at`, and set `statement_timeout`.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

`cli.mjs` has a code-only catch handler that discards error detail; call the job function
directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The null-acreage population across all six counties, counting rule stated, with the
  predicate control.
- Where `unmeasured` originates, whether it reaches other counties, and whether the walk
  refusing it is the fix working correctly.
- The `PRIVATE ROAD` verdict, the mechanism you chose, and the one you rejected.
- If the fix is elsewhere: where, precisely enough to dispatch.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-acreage_cp1.json
  CP2: _inbox/2026-09-09_ctx-acreage_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-acreage_close.json
