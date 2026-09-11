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

PLAN-ROW: P-133 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

# PROGRAM CONTEXT — OPS-21 serve completion

You are working a lane of OPS-21. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

Every one of the 65 parcel-record rails reaches a real state with an instrument behind it, in
production, for the six Central Texas counties. **Not "acquire everything."** Values where we
have data, honest dispositions where we do not.

Counties: `48021` Bastrop, `48055` Caldwell, `48209` Hays, `48309` McLennan, `48453` Travis,
`48491` Williamson.

## The six cell states — this is the vocabulary, use no other

| state | means | requires |
|---|---|---|
| `value` | measured | instrument, scope, measuredAt |
| `absent-verified` | something looked and it is not there | a NAMED instrument and an explicit SCOPE |
| `not-applicable` | a ruling says this does not govern here | a decision-record pointer |
| `refused` | a real value exists upstream and the source cannot say which | instrument, scope |
| `unaccounted` | nobody has looked | nothing — it is the default |
| `available-on-request` | not acquired in bulk; fetched per parcel on demand. Nobody has asked for this one | a named, REACHABLE `requestPath` |

**`available-on-request` is NOT an absence claim.** It says nothing about whether the fact
exists. A `requestPath` that is not reachable is not this state — a dead path makes the cell
`unaccounted` or `refused`, never a promise the product cannot keep. Adding a rail to this
state is a ruling, never a lane's discretion. Ruled 2026-09-10.

**`unaccounted` is legitimate at rest and fatal at publish.** Both halves are load-bearing. If
it stops being fatal it becomes cover; if it stops being legitimate the pressure moves to
fabricating values.

**Never convert `unaccounted` to `absent-verified` to clear a gate.** `absent-verified` is a
claim that something looked. Writing it where nothing looked is a lie that passes every check.
A relabelling tripwire counts unaccounted falling without a matching acquisition landing.

**Where a real limit exists and the source cannot say which, the state is `refused`, not
`not-applicable`.** Default to the weaker state. `not-applicable` on an in-city parcel claims
the land is unzoned.

## Identity — get this wrong and every cell is wrong

```
place_key      "{county_fips}:{prop_id}"              RAW. This is what cells are keyed on.
parcelNodeId   "{county_fips}:{normalizeForJoin(prop_id)}"   NORMALIZED (engine side).
entity_id      "{parcelNodeId}:{suffix}"              atoms only.
```

`normalizeForJoin` strips leading zeros on all-digit tokens. **Write cells on the RAW
`place_key`. Do not normalize.** The divergence between the two is a known, unmeasured
conflation risk; do not widen it.

A parcel is not an account. `parcel_record`'s intended population is
`landing_parcel_jurisdiction`, not the `cad_property` account roll. N polygons can share one
`prop_id` and are folded to one atom by design.

## Stores

```
neondb      txgio_parcel, cad_property, parcel_record, parcel_record_cell,
            parcel_record_companion_row, parcel_gate_verdict,
            landing_parcel_jurisdiction, tx_* layers, permit_record
hauska_mcp  atoms
```

**Two databases on one Neon host. A SQL join across them cannot be written at all.** A query
against the wrong database returns a FALSE ABSENCE, not an error. Declare which store you
opened.

## Grading is not serving

`publish-gate-sched` writes verdicts to `parcel_gate_verdict`. `parcelRecordAllowlist.ts`
(LDT) requires BOTH code-owned slate membership AND a `pass` verdict before a rail serves from
the record, and the slate is **never** auto-derived from a passing verdict. Do not conflate
the two controls.

**CORRECTION 2026-09-10, found by the D5 lane, not by the planner.** An earlier version of
this preamble said "widening what is graded changes nothing a customer sees." That is true of
the LDT serve-side allowlist and **FALSE for hauska-factory's own publish gate**:
`publish-readiness-gate.mjs:359` defaults `requiredRails` to `DEFAULT_SCHED_RAIL_KEYS`, and
`bastrop-publish.mjs:407` calls `requirePreBakeReadiness` with no third argument, so it takes
that default. Widening that constant literally would block every publish for every county.

**The general lesson, which is this program's whole subject:** one constant, two controls,
and the planner read one of them. Before you change any shared constant, enumerate its
consumers — `git grep` the symbol across the repo — and check that your mission's stated
blast radius matches what you find. If it does not, stop and report rather than proceeding on
the mission's word. A grading denominator and a policy floor can be the same identifier.

## Jurisdiction

`landing_parcel_jurisdiction.disposition` is three values: `unincorporated`, `in-city`,
`unresolved`. **ETJ is not one of them** — `etjStatus` is a separate rail.

`UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable` on 18 rails at row
creation for unincorporated parcels. **Do not touch those cells.** Most zoning-envelope work
is in-city only, which is a much smaller population than the county count suggests.

The six counties hold 69 cities; 23 carry a zoning layer endpoint. Two binding methods are in
play (`covers-v1`, `intersection-v1`) and must never be averaged across versions.

## The defect class this program exists to close

**Vacuous write paths.** Dormant means no trigger. Starved means a trigger and correct logic
with an input never supplied. **Vacuous means it runs perfectly, every test passes, and it
cannot succeed on any branch.** Nothing in this fleet detects the third.

The instance: `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has two return branches
and both are `status:"declined"`. Six weeks of "setbacks keep coming up short" is that one
function. Before reporting a rail blocked on data, read its write path and check whether a
value is reachable at all.

## Hard prohibitions

- **Bastrop MyGov is off limits.** `smartcity-os` `tenant_id=2` carries 658 active permits and
  full inspection, violation and work-order data. It is a city customer's internal feed.
  Tenant sovereignty and NO PRIVILEGED DATA both forbid it populating a public parcel rail.
  The join will look like free coverage. It is not.
- **Do not hand-author a rail list.** The closed set is
  `src/lib/parcel-record-engine/rail-keys.js`, 65 rails, derived not hand-authored. A
  hand-maintained denominator is the defect class this program exists to close.
- **Do not lift `SETBACK_APPLY_HELD`** or route through the setback atom writer. Out of scope
  by operator decision; cells are written from the ruled table.
- **Stay in your own repository.** Read across repos freely; write only where your lane says.

## Completion is a predicate, not a close file

Your lane's row in OPS-21 carries a completion predicate that is a query, not a paragraph.
`node scripts/plan-progress.mjs --sql` in doc_repo prints them. **A lane is done when its
predicate says so.** Reporting done against any other instrument is the failure this program
was opened to fix — the publish gate graded 17 of 65 rails, so an agent could honestly pass a
question nobody asked.

State your snapshot: repository, branch, commit. Verify by violation before reporting any
check as working.


# MISSION - OPS-21 S2: envelope cell writer (P-133)

## What you are building
A hauska-factory rail job that fills the eight buildable-envelope cells in `parcel_record`,
per county per city, for in-city parcels:

    parcelAreaSqFt   buildableAreaSqFt   buildableAreaPct   envelopeStatus
    envelopeDisclosure   maxHeightFt   maxLotCoveragePct   maxFootprintSqFt

S1 (P-132) is MERGED and RUN. Setback cells exist. You consume them.

## WHAT S1 LEARNED - read this, it corrects the dispatch you would otherwise have got

S1 corrected its own dispatch premise twice. Both corrections apply to you.

**1. `@hauska-engine/adapters` is NOT what the live route uses, and neither is importable.**
The live production route (`legacy-design-tools` `brokeragePlaceBuildableEnvelope.ts` ->
`authoritativeSetbackSource.ts`) calls `@workspace/adapters`, legacy-design-tools' OWN local
package - a separate, already-diverged fork (3-arg signature vs 2) in a different repo. Both
are private workspace packages and neither can be imported from hauska-factory.

**Use `@empressaio/setback-corpus`** - the actual published single source of truth, which
NEITHER repo has repointed onto yet and which is MORE complete than either local copy (29
jurisdictions). S1 vendored its routing logic as a faithful port with file/line citations.
Do the same rather than inventing a second approach, and cite S1's port.

**2. Fifteen cities, not seven.** The dispatch that went to S1 named 7 CTX cities with ruled
tables. The corpus carries 29 jurisdictions, 15 with real in-city populations across the five
in-scope counties. S1 processed 64 cities, 15 with a ruled table.

## STANDING FACTS

- **IN-CITY ONLY.** `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable`
  on these rails at row creation for unincorporated parcels. Do not touch those cells.
- **HAYS (48209) IS EXCLUDED.** P-145 has not landed. Filling Hays cells on a broken key
  writes wrong values faster. S1 excluded it; you exclude it. Five counties: 48021, 48055,
  48309, 48453, 48491.
- **Your hard dependency is `zoningDistrict`, and it is not yours.** S1's residual is exactly
  3,376 parcels x 5 rails, every one blocked because its `zoningDistrict` cell is not yet
  `value` or `refused`. That rail is owned by `parcel-r5-zoning.mjs`, a different job the S1
  dispatch never named. You will hit the same wall on the same parcels. Do not fix that rail;
  defer those parcels and report the count.
- **Dry-run gotcha S1 paid for:** a ruled city's dry-run preview must READ `zoningDistrict`
  from the FACTORY store (unlike `parcel-r5-zoning.mjs`, whose inputs are cortex-only), so the
  factory connection has to be open even when `apply=false`. S1 caught this locally before
  deploy. Open it unconditionally.
- **Geometry Law.** `txgio_parcel` is THE truth frame the envelope is constructed from,
  verified against, and served on. BCAD is a divergence-reporting instrument only; it never
  silently substitutes as the working ring
  (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`).
- **`computeTier1Envelope` is the vacuous function this whole program was opened over.** It
  returns `declined` on BOTH branches and cannot produce a value. Do NOT try to make it work
  and do not route through it. You write cells.
- **`place_key` is RAW** `{county_fips}:{prop_id}`. Do not normalize.
- Cells live in `parcel_record_cell` in `neondb`. Atoms are a different database; no join.

## A LIVE DEFECT S1 FOUND THAT YOU MUST NOT PROPAGATE

`legacy-design-tools`' local `round-rock-tx.json` - what its live production route serves
today - **disagrees with the published `@empressaio/setback-corpus`** on `side_corner_ft` for
EVERY district, and on SF-3's `side_ft`/`rear_ft`. SF-1 side_corner: LDT 5 ft vs corpus 30 ft.
SF-3: LDT side 5 / rear 10 vs corpus side 12 / rear 15.

S1 served the corpus numbers for Round Rock's 27,330 value-state parcels. **Your envelope
areas for those parcels will be computed from the corpus setbacks, which may differ from what
the live map shows today.** That is a known, recorded, cross-repo inconsistency (OPS-21
register). Do not "reconcile" it by switching sources. Use the corpus, and report every city
where your inputs differ from LDT's local table so the divergence set is countable.

## Completion predicate
`unaccounted` count for the eight envelope rails on in-city parcels in the five in-scope
counties equals 0, with deferred parcels (those blocked on `zoningDistrict`) reported
separately and arithmetically reconciled against the denominator - S1's close is the format
to copy: value + absent-verified + refused + deferred == denominator, exact, no remainder.

`node scripts/plan-progress.mjs --sql` in doc_repo for the exact query. Note the S2 predicate
covers all six counties; Hays will stay 100 percent unaccounted and that is correct.

## Out of scope
Setback cells (S1, done). The gate and the slate (S4/P-135 - your cells do not serve until
that lands, and that is expected). Hays. `parcel-r5-zoning`. Fixing `computeTier1Envelope`.
Reconciling the Round Rock table divergence.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_ops21-s2_cp1.json
  CP2: _inbox/2026-09-11_ops21-s2_cp2.json
  CLOSE: _inbox/2026-09-11_ops21-s2_close.json
