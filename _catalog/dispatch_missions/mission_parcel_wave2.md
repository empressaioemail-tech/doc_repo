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
