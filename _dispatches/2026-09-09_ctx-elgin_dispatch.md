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

# Three measurements of the same residue disagree and the ceiling was written from the wrong one

# CTX-ELGIN — three measurements of "the same" residue disagree, and the ceiling was written from the wrong one

Repo: `hauska-engine`, and only hauska-engine. The staged table
`tx_zoning_district_staging` is written ONLY from this repo
(`packages/engine-core/src/zoning-staging/`, `scripts/stage-tx-zoning-district.mjs`,
migration 0074). A prior dispatch pointed at `stampCountyZoning()` in
legacy-design-tools, which writes `txgio_parcel` in a different database from its own
registry, and that lane correctly STOPPED rather than ship a no-op diff. Do not repeat
that error.

## Why this blocks two launch counties

Bastrop and Travis both refuse the publish gate on the `zoningDistrict` rail. The sweep
that would resolve them, `factory-parcel-r5-zoning`, refused
`LAYER_GAP_RESIDUE_EXCEEDED` because the measured Elgin residue exceeds a declared
ceiling of 9 (48021) / 457 (48453).

The retiring planner's own written judgement, which is the actual root:

> The DECLARED_LAYER_GAP ceiling of 9/457 was written from CTX-ELGIN's numbers WITHOUT
> checking they described the same population the rail measures. That is the actual root
> of the Bastrop/Travis block. The ceiling is not wrong to refuse; the ceiling was wrong
> to be written.

The guard is behaving correctly. It is refusing a borrowed number. Do not adjust the
guard, and do not pick whichever number lets it pass.

## The three measurements, and they are probably three different quantities

    CTX-ELGIN   live probe, centroid-in-polygon against the live ArcGIS service   9 / 457
    CTX-STAGE2  join against the STAGED table, per-parcel EXISTS aggregation     48 / 525
    the rail    counts UNACCOUNTED CELLS, excluding parcels already carrying an
                earned state from a prior sweep                                  (its own)

Nobody has reconciled the three definitions. The retiring planner marked this
PROBABLY FALSE against the assumption they measure the same thing, and that assessment is
the most useful thing it left behind.

What CTX-STAGE2 already established, from `_inbox/2026-09-09_ctx-stage2_close.json`,
which you should read in full before starting:

- All 48 Bastrop residue parcels were re-tested with `ST_Covers` instead of
  `ST_Contains`. All 48 stayed unmatched. **Not a shared-edge artifact.**
- Of the 48, twenty are within 50m of an Elgin polygon and twenty-eight are beyond it.
  That split is the shape of a materially incomplete published layer, not a precision
  problem.
- This repo's `elgin-tx` registry entry (Bastrop side, FeatureServer/0) carries
  `verifiedAt = 2026-08-12` and has not been refreshed since. The Travis-side entry
  `elgin-tx-travis` (FeatureServer/1, 499 rows) was staged 2026-09-09 and is current.
- One concrete registry difference was found and it does NOT explain the gap: the engine
  registry's `elgin-tx` has no `layerWhere` filter where the LDT registry has
  `CITY_LIMIT = 'ELGIN'`. No filter means MORE polygons staged, so MORE coverage and
  FEWER unmatched. That is the opposite of the observed direction. Rejected, recorded.

## The decidable test, which is small

The staged Bastrop-side layer is roughly a month old and the probe read the live
service. So run the test that separates drift from real absence:

**Re-stage Elgin layer 0 from the live service, then re-measure with CTX-STAGE2's exact
counting rule.**

- If Bastrop residue falls toward 9, the disagreement was staging drift. The finding is
  that staged layers have no freshness rule, and that is worth more than the 39 parcels.
- If it stays near 48, the published layer genuinely does not cover them and 48 is the
  honest ceiling.

Either outcome unblocks Bastrop and Travis. Neither requires anyone to pick a number.

Use CTX-STAGE2's counting rule verbatim, including the per-parcel `EXISTS` aggregation.
Its first attempt flat-joined and produced `denom_with_geom` (4,044) EXCEEDING
`denom_incity` (3,749), an impossible number caught only because two figures that should
agree did not. `txgio_parcel` carries multiple geometry rows per `prop_id` (48021:
74,729 rows against 62,257 distinct prop_id). A flat join counts fragments as parcels.

## Then reconcile the definitions, which is the durable half

Write down, explicitly, what each of the three instruments counts: its population, its
predicate, and what it excludes. Then state which one the ceiling must be derived from.

The integration seat's position, which you should test rather than assume: **the ceiling
is derived from the staged table by the rail's own query, and the live probe's job is to
audit whether staging is current.** Two instruments, two jobs. If you find that wrong,
say so with evidence.

Do NOT write the ceiling into hauska-factory. That file
(`src/config/zoning-layer-completeness.mjs`) lives in another repo and another worktree.
Report the number and the derivation; the integration seat routes the write.

## Traps recorded from the lane that ran before you

- A long-running query at near-zero CPU is STUCK, not working. CTX-STAGE2 lost over an
  hour to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict
  by `city_key`, pre-filter on the numeric bbox columns both tables carry, and set
  `connect_timeout` and `statement_timeout`. Announce any heavy scan before you start it,
  per AGENT-CONTRACT section 4; the prior lane announced one only after the fact and
  recorded that as a process gap.
- The Factory store times out on six-county aggregate queries while a bake is running.
  Query one county at a time.

## Verify by violating

Before you trust your residue instrument, run it against a city this mission never
touches and confirm it can return a non-zero residue. CTX-STAGE2 used Pflugerville and
got 41 on a 3,000-parcel sample, labelled as a sample. An instrument observed only
returning the answer you wanted has not been observed working.

## What you must NOT do

Do not adjust `LAYER_GAP_RESIDUE_EXCEEDED` or any ceiling to make a gate pass.

Do not write `not-applicable` on any parcel to clear a count. `not-applicable` claims the
land is unzoned. A parcel probed and found uncovered earns `refused`, which is weaker and
honest. Watch for an unaccounted count falling without a matching acquisition landing;
that is relabelling.

Do not run any bake, publish, walk, Cloud Run job or Cloud Build, and do not deploy. The
integration seat owns every execution on this program.

Do not write to hauska-factory, legacy-design-tools, or hauska-map. Do not touch
`txgio_parcel` as a write; reading it for the spatial join is expected and is what
CTX-STAGE2 did.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- Residue per county before and after the re-stage, with the full counting rule.
- The drift-versus-real-absence verdict, stated plainly.
- The three definitions written out side by side, and which one the ceiling derives from.
- Your non-zero falsifier result on an untouched city.
- The true ceiling as a number, with its derivation, NOT written into any config.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-elgin_cp1.json
  CP2: _inbox/2026-09-09_ctx-elgin_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-elgin_close.json
