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

# A real Elgin district exists that our registry never mapped

# CTX-SP — a real Elgin district exists that our registry never mapped, and ten parcels are about to be called unzoned because of it

Repo: `hauska-engine`, and only hauska-engine. The zoning-staging registry lives at
`packages/engine-core/src/zoning-staging/registry.ts` and `tx_zoning_district_staging` is
written only from this repo (`scripts/stage-tx-zoning-district.mjs`, migration 0074). A
prior dispatch pointed a lane at `legacy-design-tools` for this table and that lane
correctly stopped rather than ship a no-op against `txgio_parcel`. Do not repeat it.

## The finding, established twice by two independent lanes

CTX-ELGIN found it on 2026-09-09 and CTX-ZONESCOPE re-verified it live the same day with
an independent re-fetch and its own PostGIS containment test:

**Eleven live polygons in Elgin's published zoning layer carry `Zone_Code = 'S-P'`, a
genuine Elgin zoning district. This repo's `codeDomainMap` for `elgin-tx` excludes it, so
those polygons were never staged at all.** Nine of the eleven geometrically cover ten
Bastrop parcels:

    12948, 111348, 14457, 124619, 12830, 8712013, 60891, 11364, 85259, 14535

Seven of the ten already carry a real `zoning_district` in `txgio_parcel` through some
other mechanism. **Three do not: `14457`, `12830`, `60891`.**

## Why this is urgent rather than tidy

CTX-PARCELGATE built a per-parcel write gate in `hauska-factory` and then measured what
happens to those three. Because the S-P polygons were never staged, the parcels match no
polygon in the union — structurally, by construction — and because they carry no real
district elsewhere, they pass both gate conditions. **They become eligible for a `refused`
layer-gap cell, indistinguishable from a genuinely uncovered parcel.**

A `refused` cell on them asserts we probed and found no zoning coverage. The land under
them is zoned. That is a wrong statement about a customer-facing parcel, not an honest
absence, and it is exactly the failure this program's gate structure exists to prevent.

That lane reported it as an unresolved correctness gap rather than adding an exception
list, which was correct. This lane closes it at the source.

## The work

1. Establish what `S-P` actually is in Elgin's ordinance, from Elgin's own published
   material, and what it should map to in this program's district vocabulary. **Do not
   guess and do not invent a mapping.** `S-P` commonly denotes a special-purpose or
   site-plan district; whether it has a legitimate equivalent in our vocabulary is a real
   question with a real answer, and the answer might be that it has none.

   If it has no honest equivalent, say so. A district that exists and has no mapping is a
   finding, and the right outcome is then a named, staged district code that carries its
   own identity rather than being forced into a neighbouring one. Forcing a wrong mapping
   would be worse than the current gap, because it would serve a confident wrong district
   instead of a confident wrong absence.

2. Add the mapping to the `codeDomainMap` for Elgin. Note there are now **two** registry
   entries — `elgin-tx` (FeatureServer/0, Bastrop side) and `elgin-tx-travis`
   (FeatureServer/1, Travis side, added by CTX-STAGE2 on 2026-09-09). Establish whether
   `S-P` appears on both layers before deciding whether both entries need it. CTX-STAGE2
   recorded the Travis-side code domain as `A, C-1, C-2, C-3, R-1, R-3` with no `S-P`
   observed, so the honest answer may be that only the Bastrop-side entry needs it.

3. Re-stage the affected layer or layers, dry run first, then apply against
   `CORTEX_DATABASE_URL` on the direct host. Verify the write is confined to its own
   `city_key` partition by reading back the untouched partition's row count, exactly as
   CTX-STAGE2 did when it confirmed `elgin-tx` stayed at 3,220 rows byte-for-byte.

4. Re-measure. Report, per county, the Bastrop residue against the union of Elgin's staged
   base layers, using CTX-STAGE2's counting rule verbatim including its per-parcel
   `EXISTS` aggregation. The expected direction is that Bastrop's raw residue drops from
   36 toward 26 as the ten S-P parcels begin matching a real polygon.

   **Report what you measure, not what is expected.** CTX-STAGE2 expected a re-stage to
   move Bastrop's residue toward 9 and it moved to 58 instead, and reporting that
   disagreement plainly was the most useful thing that lane produced.

5. Confirm, by id, that all ten named parcels now match, and that the three unresolved
   ones specifically resolve to a real district rather than remaining residue.

## Verify by violating

Before you trust the re-measure, run the same instrument against a city this mission never
touches and confirm it can still return a non-zero residue. CTX-STAGE2 used Pflugerville
and got 41 on a labelled 3,000-parcel sample; CTX-ZONESCOPE reproduced that figure exactly
from an independent implementation. An instrument observed only returning the answer you
wanted has not been observed working.

## What you must NOT do

Do not invent a district mapping to make ten parcels match. A wrong district served
confidently is worse than an honest gap.

Do not touch `txgio_parcel` as a write. Reading it for the spatial join is expected and is
what CTX-STAGE2 did.

Do not run `parcel-r5-zoning`, any bake, publish, walk, Cloud Run job or Cloud Build, and
do not deploy. The integration seat owns every execution on this program.

Do not write to `hauska-factory`, `legacy-design-tools` or `hauska-map`. The ceiling and
the per-parcel gate live in hauska-factory and are being changed there concurrently by
CTX-PARCELGATE; you report your residue number and that lane consumes it.

## Traps carried forward from four lanes

A long-running query at near-zero CPU is STUCK, not working. CTX-STAGE2 lost over an hour
to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set
`connect_timeout` and `statement_timeout`, and announce any heavy scan before starting it
per AGENT-CONTRACT section 4 rather than after.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join. A flat join already
produced an impossible number in this program once, caught only because two figures that
should have agreed did not.

The registry entry type carries singular `layerUrl`, `layerId` and `parentCountyFips`
fields and the registry is a plain object literal, so a duplicate key silently overwrites
rather than merging. CTX-STAGE2 hit this and had to add a new key.

## Close contract

Standard lane close JSON, plus:

- What `S-P` is, from Elgin's own material, with the source, and the mapping you chose or
  the reason none is honest.
- Whether `S-P` appears on one layer or both, with evidence.
- Dry run then apply counts, and the untouched-partition read-back proving scope.
- Per-county residue before and after, with the full counting rule.
- All ten parcels by id with their post-stage disposition, and the three unresolved ones
  called out specifically.
- Your non-zero falsifier result on an untouched city.
- `leave_behind`.

Report the numbers. CTX-PARCELGATE is waiting on your post-stage Bastrop residue before it
writes any ceiling, and it has been told to write nothing until this lands.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-sp_cp1.json
  CP2: _inbox/2026-09-09_ctx-sp_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-sp_close.json
