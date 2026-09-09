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
repo: hauska-engine

# Stage Elgin's Travis-side zoning polygons (supersedes CTX-STAMP)

## Mission - stage Elgin's Travis-side zoning polygons in hauska-engine

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. This mission supersedes CTX-STAMP, which was misscoped by the
integration seat and correctly refused. Read the correction below before anything else so you do
not repeat the wrong path.

### What the previous dispatch got wrong, so you do not follow it

CTX-STAMP named `stampCountyZoning()` in legacy-design-tools as the writer for
`tx_zoning_district_staging`. **It is not.** That function writes `txgio_parcel`, in a different
database, from a different registry, and has no code path to the staging table at all. The
integration seat took that pointer from a comment inside hauska-factory's `parcel-r5-zoning.mjs`
and did not verify what actually writes the table. The CTX-STAMP lane read the function, grepped
the repo, checked the connection, and stopped rather than ship a no-op diff. That was correct.

Verified since, by code search across both repos: `tx_zoning_district_staging` is written ONLY by
**hauska-engine** --

    packages/engine-core/scripts/stage-tx-zoning-district.mjs   (the writer)
    packages/engine-core/scripts/migrations/0074_tx_zoning_district_staging.sql
    packages/engine-core/src/zoning-staging/                    (its city registry)
    packages/engine-core/scripts/drain-tx-zoning-district-staging.mjs

legacy-design-tools only READS the table, in `structuralFactToFacetsWire.ts`. Two registries
exist for zoning layers, one per repo, and CTX-ELGIN extended the LDT one. This mission is about
the OTHER one.

### Your seat and worktree

**hauska-engine.** Open a worktree for it and register it in `_catalog/seat_register.json` with
**BOTH** `path` and `worktree` set to the same value before your first git write, or the
seat-worktree-gate refuses you with `product_index_foreign`. `git pull` immediately before editing
that file, add it by explicit pathspec, never `git add -A`. The gate reads the register from disk
BEFORE your command runs, so switch branches first, then update the register.

Declare your snapshot in your first output: repository, branch, commit.

### The measurement that is already done, so you do not redo it

CTX-STAMP measured this live and it is the reason this mission exists:

    tx_zoning_district_staging, Elgin
      Bastrop side (48021)   3,220 rows staged
      Travis side  (48453)   ZERO rows, under any key
    Staged for Travis at all: Austin, Lakeway, Pflugerville. Elgin is absent entirely.

hauska-engine's own zoning-staging registry has one Elgin entry (the Bastrop-side layer 0) and no
Travis-side entry. That is the gap.

Re-confirm the zero yourself before writing anything -- a measurement you did not take is a
measurement you cannot defend -- but do not re-derive the whole picture.

### What is blocked

Bastrop (48021) and Travis (48453), the last two of six Central Texas counties. The other four
are clean. `parcel-r5-zoning` joins parcels against `tx_zoning_district_staging WHERE layer_role
= 'base'`, so with Elgin's Travis side staged nowhere, every in-city Elgin parcel on that side is
unmatched and the rail stays `unaccounted`, which the publish gate refuses.

### What to do

**1. Confirm the gap in the engine registry.** Read `packages/engine-core/src/zoning-staging/`
and state what Elgin entries exist today. If a Travis-side entry already exists, STOP and report
-- the problem is then elsewhere and this mission is misscoped, exactly as the last one was.

**2. Add the Travis-side entry.** The live layer is Elgin_Zoning FeatureServer **layer 1**, about
500 features, `CITY_LIMIT='ELGIN'` on 499 of them and blank on one. CTX-ELGIN established that
against the live service:

    https://services3.arcgis.com/wdTkTU0MdZbNBEZy/arcgis/rest/services/Elgin_Zoning/FeatureServer/1
    Zone_Code domain, both layers: R-1 / R-2 / R-3 / A(->R-4) / C-1 / C-2 / C-3 / I

Match whatever shape the existing Elgin (layer 0) entry uses in THIS repo's registry, including
its code-domain handling -- the `A -> R-4` mapping is a real ordinance divergence (the LDC names
the multifamily district R-4; the GIS stamps `A`), not a typo to normalise away.

**3. Stage it.** `stage-tx-zoning-district.mjs`, dry-run first, then apply. Report rows written.

**4. Re-measure and report the residue, per county.** This is the deliverable the integration
seat is waiting on:

    for 48021 and 48453 separately: how many in-city Elgin parcels match NO staged base polygon

Report numerator AND denominator both times. Those numbers become a declared ceiling in
hauska-factory; do NOT edit that repo.

**5. Say whether your residue matches CTX-ELGIN's live point-in-polygon probe** (9 Bastrop, 457
Travis). If it does, two independent methods agree and the declaration is sound. If it does NOT,
report the disagreement rather than reconciling it by picking the smaller number -- a mismatch
between the probe and the rail is itself the finding, and the integration seat needs it before
writing any ceiling. **This is the single most likely thing to go wrong and the most important
thing to report honestly.**

### AUTHORIZED, explicitly, because both are normally reserved

**Live traffic against the Elgin ArcGIS FeatureServer**, that endpoint only, for this mission.
Use `returnCountOnly` for counts, page with `resultOffset`, do not hammer it, do not fan out to
other jurisdictions.

**A live write to `CORTEX_DATABASE_URL`** (direct host, never a `-pooler` host) to stage the
polygons. This is a staging-table insert on the bake path, authorized by the operator as part of
the six-county run.

Nothing else is lifted. No other endpoint, no other table, no service deploy.

### What you must NOT do

**Do not touch `txgio_parcel`.** That is the other pipeline and CTX-ELGIN already did its half.
A diff there moves the rail's residue by zero, which is precisely why the last lane stopped.

**Do not widen a layer's WHERE clause to manufacture coverage.** If Elgin publishes no polygon
for a parcel, that parcel is residue and the residue is the answer.

**Do not declare Elgin complete anywhere.** Its layer is materially incomplete; the residue earns
`refused`, never `not-applicable`.

**Do not edit hauska-factory or legacy-design-tools.** Report numbers.

**Do not run `parcel-r5-zoning`, any bake, or any deploy.**

### Verify by violating

After staging, confirm the residue query can still report a NON-zero for a city you have not
touched. A residue number that only ever reads zero is not measuring residue.

And confirm the denominator did not move between your before and after. If in-city parcel counts
changed, you altered what is being counted rather than what is covered, and the comparison is
void.

### Report

CP1 after step 1, stating what the engine registry holds for Elgin today. That single result
either confirms this mission or ends it, and the last lane's CP1 is what saved a day of wrong
work.

Close with: the registry diff, rows staged by layer, the re-measured residue per county with
denominators, whether it agrees with 9 and 457, and a `leave_behind` block.

If the residue cannot be brought near the probed numbers, say so plainly and do NOT close green.
Two counties are waiting, and a ceiling written from a green-but-wrong report would sweep
`refused` over parcels nobody has looked at -- which is the exact thing the guard that produced
this mission exists to prevent.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-stage2_cp1.json
  CP2: _inbox/2026-09-09_ctx-stage2_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-stage2_close.json
