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

# PARCEL wave 2: remaining declared-ahead rails, scout then acquire

# Mission — PARCEL wave 2: remaining declared-ahead rails, scout then acquire

## Why

`_inbox/2026-09-02_parcel-scout-gis_close.json` scouted 6 of the 13 rails-v2
declared-ahead rails (`_decisions/2026-09-01_parcel_record_rails_v2_template.md`).
`_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md` (ACQUIRE-GIS wave 1) carded and
built 4 of those 6: `schoolDistrict`, `utilityService` (water/sewer), `overlayDistricts`
(12 cities), `agValuation` (Williamson). `treeProtection` (weak — Austin-only, an
incomplete permit-event log, not a parcel census) is out of scope for this wave by
operator instruction and stays scouted-but-uncarded. This wave picks up everything else
still open on the rails-v2 template: the 7 rails never scouted at all (`owner`,
`valueHistory`, `salesHistory`, `publicRecordRefs`, `ossf`, `mineralRights`,
`hoaDeedRestrictions`), the follow-ups the scout explicitly recommended but did not
complete (utilityService's electric sub-row, overlayDistricts' 5 unconfirmed cities,
agValuation's other 5 counties), and one already-cited, ready-to-acquire item
(`maxImperviousCoverPct`, Austin-only by operator instruction).

**This is not one uniform kind of work, and the mission is shaped accordingly — do not
treat every item below as a GIS-search task by default.** Two structural findings from
reading the rails-v2 template and this repo's own already-staged data, ahead of any new
scouting:

1. `publicRecordRefs` is **not a GIS acquisition target at all**. The rails-v2 decision
   already ruled its shape: "a companion whose rows POINT into the existing P-85 records
   store (records_request_jobs, clerk_portal_terms, the records-request artifacts store)
   ... a second record store would be the duplicate-subject defect." This rail's Step 1
   is reading that store's live shape in `legacy-design-tools` (migrations 0084+0086 per
   the decision) and confirming it, not searching for an external data source.
2. `owner` and `valueHistory` were checked live against `cad_property` before writing
   this mission (bounded 200-row sample, Williamson, `SELECT ... LIMIT 200` with a 15s
   statement timeout — not a full-table scan, which hung and was killed rather than left
   running against the shared production store). Result, split two ways:
   - **`valueHistory` is NOT already staged.** Every one of the 200 sampled rows carries
     `tax_year = 2026` — `cad_property` is a CURRENT-YEAR-ONLY table, not the "one row
     per tax year" history companion the rail wants. This rail genuinely needs external
     scouting (a CAD or third party that publishes prior-year value snapshots, or a
     decision to start capturing history going forward from this program's own future
     ingests — both are real options Phase 1 should surface, not assume).
   - **`owner` is substantially already staged.** `owner_name` was populated on 200/200
     sampled rows (100%), alongside `owner_mailing_address`. This is a real, usable
     source for a first-cut `owner` companion row (one row per parcel, sourced directly
     from `cad_property`) — but the rail's declared shape is "a companion (multiple
     parties)," and `owner_name` is a single text field (a CAD's own formatting, which
     may already concatenate co-owners as one string or may only ever carry one name —
     Phase 1 checks a live sample of the actual string content, not just presence).
     Paid-tier access-pair handling is new work regardless of source. This still needs
     the same cheap bounded check repeated for the other 5 program counties before
     assuming Williamson's shape is uniform — do not scout an external ownership source
     before confirming the existing column is actually insufficient, county by county.

## Scope — two phases, do not blur them

**Phase 1 — SCOUT (read-only, mirrors `_dispatches/2026-09-02_parcel-scout-gis_dispatch.md`'s
own discipline exactly: no purchases, no store writes, no credentialed portal, every claim
cited or explicitly marked secondary, a confirmed absence kept distinct from a read-path
failure).** Deliverable is a source inventory the next dispatch cards acquisitions from —
this phase does not itself acquire or write anything.

1. **`owner`** — confirmed live for Williamson (200-row sample): `owner_name`/
   `owner_mailing_address` are populated on 100% of sampled rows. Extend the same cheap,
   bounded (`LIMIT 200`, never a full-table scan) check to the other 5 program counties;
   inspect a live sample of the actual `owner_name` string content to determine whether
   it already encodes multiple co-owners (e.g. "SMITH JOHN & JANE") or is reliably
   single-party. Only search externally (a CAD's own ownership-history export, a
   title/deed-records API) if the existing column is confirmed insufficient for the
   companion shape the rail wants in a given county — the default recommendation for the
   next dispatch, absent a contrary finding, is a write job reading `cad_property`
   directly, no new external acquisition.
2. **`valueHistory`** — confirmed live for Williamson (200-row sample): `cad_property`
   is current-year-only (`tax_year = 2026` on all 200 sampled rows), not a history table.
   This rail needs a real acquisition decision, not a wiring job: scout whether any of
   the 6 CADs publish prior-year value rolls/snapshots as a bulk export or API (WCAD's
   own Socrata portal, used for `agValuation` this session, is a plausible first place to
   check — it may carry other historical datasets beyond the land/ag one already used),
   and separately report whether "start capturing history from this program's own future
   ingests, going forward only" is the realistic fallback if no backward-looking source
   exists anywhere.
3. **`salesHistory`** — genuinely unscouted. Texas is a non-disclosure state (the rails-v2
   decision already rules a sale row's price field must itself carry absent-verified) —
   scout for whatever sales/deed-transfer data exists at all per county (MLS is not
   public-record-acquirable; look for county clerk deed-transfer indexes, CAD-published
   sales-ratio files, or a similar public mechanism), and report plainly if none exists
   for a given county rather than forcing a weak source.
4. **`publicRecordRefs`** — not a search task (see Why, above). Read the live P-85 records
   store shape in `legacy-design-tools` (migrations 0084+0086, `records_request_jobs`,
   `clerk_portal_terms`) and report exactly what a pointer row into it would need to carry
   to satisfy this rail's companion shape.
5. **`ossf`** (on-site sewage facility / septic feasibility) — scout per-county OSSF
   permit/soil-suitability data (TCEQ's own program, or county-level health department
   permit records where OSSF authority is delegated — most of the 6 program counties
   likely have delegated authority per TCEQ's standard model, verify live).
6. **`mineralRights`** — scout severance-instrument availability (county clerk real
   property records / instrument indexes per county — this is a title-records search, not
   a GIS layer; report whether any county publishes a searchable, citable index at all).
7. **`hoaDeedRestrictions`** — scout HOA CC&R / deed-restriction availability (likely the
   weakest of the 7: report honestly if no centrally-published, citable source exists per
   county, rather than forcing a low-confidence secondary source).
8. **utilityService electric sub-row** — re-verify the HIFLD REST endpoint
   (`maps.nccs.nasa.gov/mapping/rest/services/hifld_open/energy/FeatureServer/26`) live
   from this session's own network path (the prior scout hit a DNS failure specific to its
   own environment); also check for a `hifld-geoplatform.hub.arcgis.com` mirror, which the
   prior scout flagged as likely existing but never located.
9. **overlayDistricts, the 5 unconfirmed cities** (Lockhart, Robinson, Elgin, Dripping
   Springs, Liberty Hill) — one more direct-fetch pass per city; a Lockhart GIS coordinator
   contact was found by the prior scout (Christine Banda, 512-398-3461) if a live fetch
   still fails to surface a layer.
10. **agValuation, the other 5 program counties** (Travis, Bastrop, Caldwell, McLennan,
    Hays) — Travis needs its bulk "Certified Data Export" flat file checked for populated
    ag status (the live ArcGIS layer's ag-shaped fields were not confirmed populated);
    Bastrop needs its plausible bulk-export path verified; Caldwell/McLennan/Hays need a
    fresh live check per the prior scout's specific blockers (Caldwell/Bastrop parcel
    layers exist but carry no ag attribute; McLennan has no open-data endpoint found at
    all; Hays's downloads page returned a live 403, possibly a bot-block not a real wall).

**Phase 2 — ACQUIRE (direct — this item is already scouted, cited, and live-verifiable;
build it the same way ACQUIRE-GIS wave 1 built its four rails, no further scouting
needed).**

11. **`maxImperviousCoverPct`, Austin ONLY** (operator instruction: scope to Austin for
    now even though the rail is declared statewide — every other jurisdiction the prior
    scout checked is administered per-permit with no GIS layer at all). Zone
    classification: City of Austin watershed regulation ArcGIS layer
    (`https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_watershed_regulation_areas/FeatureServer/0`,
    field `WATERSHED_DEVELOPMENT_TYPE`) plus the Edwards Aquifer Recharge/Contributing
    Zone (TCEQ, Austin mirror confirmed live at
    `https://data.austintexas.gov/Locations-and-Maps/Edwards-Aquifer-Recharge-Zone/ahuv-whai`).
    The percent-limit number itself is NOT a GIS attribute on either layer — it lives in
    Austin LDC Chapter 25-8 text. This rail needs a small, explicit, hand-built
    zone-to-percent crosswalk table (cited to the LDC section for each zone value) shipped
    alongside the spatial join, not a bare zone-classification write. Scalar rail, cell
    carries the resolved percent plus the zone classification and the crosswalk's own
    citation.

## Landmines

- Do not scout `owner`/`valueHistory` externally before checking `cad_property`'s own
  live shape — this is the single highest-leverage check in this wave and skipping it
  risks carding an acquisition for data already sitting in this program's own store.
- `publicRecordRefs` never grows a second record store. If the P-85 store's live shape
  cannot carry what this rail needs, the finding is "the implementing card stops and
  reports" (per the rails-v2 decision's own reversal criteria), not "build a parallel
  store."
- Every "not found" finding distinguishes a confirmed absence from a read-path failure
  (403/404/DNS), exactly as the prior scout's own inventory did — a fetcher block is not
  evidence data doesn't exist.
- `salesHistory`: Texas's non-disclosure posture means a real, well-sourced answer may
  still be "no public sale price exists for most transactions" — report that as the
  finding, do not weaken the source to manufacture a price field.
- `mineralRights`/`hoaDeedRestrictions`: these are title/records-search problems, not
  GIS-search problems. A weak or no-source finding for either is a legitimate, expected
  outcome, not evidence of an incomplete scout.
- `maxImperviousCoverPct`: the Austin-only scope is deliberate and operator-set for this
  wave, not a discovery to re-litigate — do not attempt to widen it to other
  jurisdictions in this pass.
- Follow Factory store discipline (`90_runbooks/factory_1_5_acquisition_staging.md`
  S1/S2/S6 in spirit): resolve the direct host (no `-pooler`) before any write; Phase 1
  performs no writes at all; Phase 2's dry-run must predict apply before any real run.

## Verify (meaning-shaped, after Phase 1)

- Every claim in the Phase 1 inventory carries a live-fetched citation, or is explicitly
  marked as a secondary-source claim not independently verified — no unmarked claim
  ships.
- The `owner`/`valueHistory`-in-`cad_property` question is answered with an actual query
  result (row counts, distinct-tax-year counts per county), not an assumption either way.
- `publicRecordRefs`'s P-85 store shape check cites the actual live migration/table
  columns read, not a description from memory.
- Per rail, the inventory states plainly: strong / partial / weak / none, mirroring the
  prior scout's own verdict vocabulary, so the next dispatch can card directly from it.

## Close

`_inbox/<date>_parcel-wave2_close.json` (Phase 1): the source inventory (mirroring
`_inbox/2026-09-02_parcel-scout-gis_inventory.md`'s shape), per-item verdict, citation
proof, `whatContradictedTheCard` (mandatory — in particular, whether `owner`/
`valueHistory` needed external scouting at all), `leave_behind` naming anything still
unconfirmed after this pass, plus scratch block (LESSON / DEAD-END / GROUND-TRUTH /
OPEN). Phase 2 (`maxImperviousCoverPct` Austin acquire) closes separately once built,
following ACQUIRE-GIS wave 1's own close shape.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-03_parcel-wave2_cp1.json
  CP2: _inbox/2026-09-03_parcel-wave2_cp2.json
  CLOSE: _inbox/2026-09-03_parcel-wave2_close.json
