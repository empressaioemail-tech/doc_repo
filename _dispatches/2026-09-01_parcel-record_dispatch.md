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

# PARCEL-RECORD dispatch

# Mission — build the parcel record: the shape, the template, and one county proven

## What this is

The operator has ruled that every parcel in all six counties carries a full record, filled
with data or honest absence, **before anything else moves**. Rebake is acceptable. Ruling:
`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`.

**This card is step 1 of 7: build the tables.** It does not fill them beyond one proving
county. Do not let it drift into acquisition.

## The shape

**Row: one parcel.** 981,405 across the six counties by containment. **Column: one rail we
intend to serve.** **Cell: exactly one accounted state.**

```
value            the value, with provenance: source and vintage
absent-verified  something LOOKED; a basis says where and why not
not-applicable   it structurally cannot exist for this parcel; a reason says why
refused          a named refusal
unaccounted      nothing has looked yet. Legitimate at rest. FATAL at publish.
```

Standing rule, `_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`: a record
is instantiated with its **complete** column set and is never partially shaped. Acquisition
changes a cell's state, never its existence.

**Make the column set closed and compiler-enforced where the shape can carry it.** A type
with no way to omit a cell has no trigger to be missing and no call site to be absent. The
gate is the backstop; the type is the mechanism.

## Scalar cells and companion tables

Some rails are one-to-many: wells, permits, easements, pipelines, setback rules, special
districts. **The cell still carries exactly one state**; the companion table carries the
rows.

A parcel with three wells has `wells = value` plus three companion rows. A parcel in an
unsourced permit jurisdiction has `permits = absent-verified` with a basis and zero
companion rows. **A parcel with zero permits at a SOURCED jurisdiction has `permits = value`
with an empty set** — and that is a different cell from the unsourced one. Get that
distinction into the type, not into a convention.

## The rail set: derive it, but lose nothing

Seed list from evidence and from the operator's naming. **Treat this as a floor, not a
specification** — derive the authoritative set from `Tier1FacetPayload`,
`Tier2EnvelopeFacet`, the rail register, and the `CAD-SERVE-RECONCILE` close, then add
anything below that is missing.

**CAD and identity** — apn, situs address / city / state / zip, landUse code + description +
source + vintage, acreage value + sqft + method, yearBuilt, and the cadRoll five:
marketValue, assessedValue, landValue, improvementValue, livingAreaSqft.

**Jurisdiction** — county, cityLimits, etjStatus.

**Zoning and envelope** — district, jurisdictionKey, zoning provenance, envelope status,
setbacks front/side/rear/corner, parcelAreaSqFt, buildableAreaSqFt, buildableAreaPct,
maxLotCoveragePct, maxHeightFt, maxFootprintSqFt, citationUrl, disclosure, edgeSignal.

**Companion-bearing rails** — setback rules, wells, pipelines, permits, easements, building
footprint, special districts including MUD and PUD, flood.

**Two facts to carry into the design.** MUD duplicates special-district: 1,888 MUD polygons
are already loaded in `tx_special_district`, so `mud` is the same subject built twice —
resolve it as one rail with a declaration, not two columns. And flood tier-2 holds 608,414
determinations that `mergeBakedBaseFacts` currently drops, so flood is a rail whose data
exists and does not reach a user.

**Owner is not a public column.** Owner names were stripped from `public-free` roll bodies
2026-09-01; `owner-fact` is the paid home. If owner appears at all it is gated, and it is
not part of the free record.

## Two states that are earned, and one that must never be forged

**`not-applicable` needs a structural reason.** Counties do not zone unincorporated land, so
zoning, setbacks, edges and envelope are `not-applicable` for the **370,289** unincorporated
parcels measured by containment — **not** the roadmap's 357,269, which is wrong by about
13,020 in the split. Outside that population it is an unearned absence.

**`absent-verified` needs a basis.** It is a claim that something looked.

**Never convert `unaccounted` to `absent-verified` to clear a gate.** That is a lie that
passes every check, and it is the single most likely way this build fails. Watch for
unaccounted counts falling without a matching acquisition landing.

## Durable and portable, because the second state is the point

The schema, the cell-state type, the companion pattern and the instantiation procedure are
a **reusable template** with a durable home. Say where you put it.

**Name anything hardcoded to Texas or to these six counties at build time.** `engine-core`
is already known not to be Texas-clean — 30 of 48 executable files are coupled — and
discovering the same in this template later costs a rebuild. Utah proved the premise ports
while normalisation does not.

## Do not build beside the dead ledger

A county-by-rail ledger exists and **its gating indicators are dead**: `hasWriter`,
`atomFamilyState` and `isPartial` are uniform across all 3,556 cells and nothing recomputes
it. This is a different grain, so it is not a duplicate — **but say what happens to the old
one.** Repoint consumers before retiring a store, never the reverse, and two ledgers where
one is dead and nobody says which is authoritative is worse than either.

## Prove it on one county, then stop

**Instantiate the full record for one county**, every parcel, every column, all cells
`unaccounted` except what the shape can establish structurally. Report the cell counts by
state.

Then **ingest what already exists for that one county** — step 2 of the ruling, scoped to
one county as a proof. Much of this data is present and merely unstamped, unmerged or
unserved. Report how many cells moved from `unaccounted` to a real state on existing data
alone, before any acquisition.

**That number is the finding of this card.** It sizes steps 2 through 4 for the other five
counties and it tells the operator how much of the perceived gap is acquisition versus
plumbing.

Do not acquire anything. Do not run the other five counties. Do not bake.

## Verify by violating

Before reporting the shape as working: **instantiate a parcel with a missing column and
confirm it cannot be constructed.** If it can, the type is not carrying the constraint and
the gate is doing work the compiler should do.

Then poison one cell to `unaccounted` on a county that was otherwise complete and confirm
the publish gate refuses. Both directions, on real data.

## Do not

- Do not fill beyond the one proving county.
- Do not acquire any new data on this card.
- Do not bake or publish.
- Do not convert `unaccounted` to `absent-verified`.
- Do not stamp `not-applicable` outside the 370,289 unincorporated population.
- Do not author the rail list only from this card; derive it and report what you added.
- Do not model MUD and special-district as two rails.
- Do not put owner on the free record.
- Do not hardcode Texas or these six counties without naming it.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived rail set and what you added
beyond the seed, the schema and where the durable template lives, the per-state cell counts
for the proving county before and after ingesting existing data, **how many cells moved on
existing data alone**, the Texas-coupling you found, the disposition of the county-rail
ledger, and both violation tests. Name what contradicted this card, or say plainly that
nothing did. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_parcel-record_cp1.json
  CP2: _inbox/2026-09-01_parcel-record_cp2.json
  CLOSE: _inbox/2026-09-01_parcel-record_close.json
