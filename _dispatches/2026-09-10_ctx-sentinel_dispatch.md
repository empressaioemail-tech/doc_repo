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

# A family of rows that are not parcels and nobody has counted them

# CTX-SENTINEL — a family of rows that are not parcels, and nobody has counted them

Repo: `legacy-design-tools`. **Measurement lane. A code diff is not expected and shipping
nothing is a valid close.** Two prior lanes in this fleet correctly committed nothing and
said so; do the same if that is the honest outcome.

## Why this exists

Caldwell's staging walk has failed on one parcel through every run today:
`48055:1`, HTTP 422, `SITUS_PUNCTUATION_ONLY`, refused at the serve guard before any
payload exists. CTX-WALKRULE diagnosed it precisely and stated its own fix could not clear
it. A later prediction that CTX-SITUS-SKIP would clear it as a side effect was wrong: the
bake changed, the serve guard did not.

Along the way, three separate lanes found pieces of what looks like one family and none was
scoped to count it:

- **CTX-RETIRE:** `txgio_parcel` holds **203 distinct features sharing `prop_id` `'1'`** in
  Caldwell, and **227 sharing `'0'`**. Almost certainly sentinel or bucket ids from the
  `stratmap25-landparcels` ingest rather than real CAD account identities. It also found
  that `48055:1`'s served acreage (195.2 from a shoelace over whichever of the 203 features
  the join picked first) does not match the 7.025 the dispatch had stated.
- **CTX-ACREAGE:** `48491:PRIVATE ROAD` — a literal string where a `prop_id` belongs,
  returning HTTP 400. Confirmed a lineage artifact at both the landing and serving stores,
  with the graft and walk-parsing hypotheses rejected by direct query.
- **CTX-HAYS-SPLIT:** StratMap rows were grafted into `cad_property` and **overwrote
  `source_file` in place** on roughly 75,551 existing rows, so lineage is not reliably
  readable from that column alone. It recovered genuine CAD rows from under the StratMap tag
  using `assessed_value IS NOT NULL`.

Each of those is a single instance reported honestly. **Nobody has asked how many there
are.**

## The question

**What is the population of rows in the six Central Texas counties that are not
well-formed parcel accounts?** Counted, with a stated counting rule and a predicate control
proving the query can return a non-zero answer for a population you did not target.

Candidate members of the family, and you must establish whether they are actually one family
or several:

- a `prop_id` that is not a numeric or R-prefixed account identifier at all
  (`PRIVATE ROAD` is the known case);
- a `prop_id` shared by many `txgio_parcel` features, which is a bucket id rather than a
  parcel (`'1'` at 203, `'0'` at 227 in Caldwell);
- a row whose situs is punctuation-only **and** which has no other CAD signal;
- rows whose `source_file` says StratMap and which carry no `assessed_value`,
  `exemption_codes` or `living_area_sqft` — the shape CTX-HAYS-SPLIT used to separate
  38,060 geometry-only rows from 384 genuine CAD accounts in Hays.

**Do not assume these are one class.** State which criteria co-occur and which are
independent. If they turn out to be three unrelated populations, that is the finding and it
is more useful than a single number.

## Then, and only then, the disposition question

For whatever population you find, what is the honest treatment? You are recommending, not
implementing.

The options this fleet has already established, so you argue against real alternatives:

- **A declared non-account state.** These rows are in the store because we hold geometry for
  them, not because an appraisal district ever assessed them. That is a legitimate permanent
  condition, not a gap.
- **`recordRetirement`.** Already ruled inappropriate for the Hays geometry-only population,
  because it asserts an account left a roll and these were never on one. The same reasoning
  probably applies here; confirm or refute it rather than inheriting it.
- **Exclusion from the walk cohort.** **Argue this one carefully.** Two lanes deliberately
  refused to tune the ascending-`prop_id` sampler on the grounds that adjusting a sampler to
  avoid a failure it correctly found is sampling around the problem. If your recommendation
  is exclusion, it must be a named class with a counting rule and a written justification,
  never a filter, and you must say why it is not the same mistake.
- **Data correction.** CTX-LEAVES2 wrote but did not run a correction script for the single
  `PRIVATE ROAD` row. If the population is small and genuinely erroneous, that may
  generalise; if it is large, it almost certainly does not.

## The serve-guard question, which is separate

`48055:1` fails at `refusePayloadAtServe` / `assertSitusNotPunctuationOnly`, throwing before
`snapshot` is produced, so the handler returns 422 and no body exists for the walk to grade.

That guard is correct — it exists because this program was serving `", ,"` as an address.
The question is not whether to weaken it. The question is **what a customer should see when
they request a parcel that is not an account**, and whether a bare 422 is the honest answer
or whether it should be a declared refusal with a reason, as the layer-absence contract does
elsewhere.

There is prior art: `_inbox/2026-09-03_pe_refusal_contract_split.md` names a legibility gap
between the Doc-19 layer-absence chip contract and the bare `atom-miss` refusal used by
several fact reads. This may be the same gap at the parcel level. Read that finding and say
whether it is the same class.

## What you must NOT do

Do not weaken `PUNCTUATION_ONLY_RE`, `assertSitusNotPunctuationOnly`, or any serve guard.

Do not write, delete or correct any row. This lane measures.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. A
read-only query and an HTTP read of a served payload are expected and are not executions.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`. If the fix belongs in
one, report it precisely enough to dispatch.

## Traps carried forward, all paid for today

`parcel_record_cell.place_key` is `<fips>:<prop_id>`. `place_layer_snapshots.place_key` is
`node:<fips>:<prop_id>`. Two tables, two shapes.

`runs` has `started_at`, not `created_at`.

`parcel_gate_verdict` carries an `evaluated_at` and is a **cached** evaluation. A verdict
read during a write is meaningless; check the timestamp.

Unscoped scans on `parcel_record_cell` time out. Scope by prefix, `rail_key` or
`updated_at`, and set `statement_timeout`.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

`source_file` was overwritten in place by the StratMap graft, so it is not a reliable
lineage field on its own.

## Close contract

Standard lane close JSON, plus:

- The population, per county and total, with counting rule and predicate control.
- Whether the candidate criteria are one family or several, with the co-occurrence evidence.
- Your recommended disposition, with the alternatives you rejected and why.
- Whether the 422 legibility question is the same class as the 2026-09-03 refusal-contract
  split.
- If a fix is warranted: where, precisely enough to dispatch.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-sentinel_cp1.json
  CP2: _inbox/2026-09-10_ctx-sentinel_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-sentinel_close.json
