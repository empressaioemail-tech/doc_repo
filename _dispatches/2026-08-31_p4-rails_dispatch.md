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

PLAN-ROW: F-18 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# P4 rails — wells and footprint on five, flood shape conversion; setbacks explicitly out

# P4 — wells, footprint, flood. The three rails that are not held.

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Bounded SQL with a named `statement_timeout`,
builds, `vitest run`, or a job execution you read to completion. Never a watch.
**A timed-out query is `unmeasured`, never 0.** Fabricating a zero here is the
worst available outcome.

**Read product code by ref.** `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, or migration. Job executions
are planner-run.

## Scope — three rails only

This card is **wells, footprint, and flood**. It is explicitly **not** setbacks,
edges or envelope: those are held until LDT #560 lands and Gate 8's C7 is re-read,
because C7 is a retired `road-class-setback-table` derivation still serving and P4
would propagate it. Do not touch them here.

Gate 8 exists and `dayOne` is the key P4 reads. C3/C4/C7 being red is the
instrument working, not a blocker for these three.

## What is actually owed — the counts are measured, do not re-derive

| Rail | Work | Scope |
|---|---|---|
| RRC wells | apply | **five counties.** Caldwell already has **53,841** `well-fact` (2026-08-16) |
| Footprint | apply | **five counties.** Caldwell already has **35,269** `building-footprint` |
| Flood | **shape conversion, not coverage** | `flood-hazard-fact` is **already applied on all six**, 981,620 atoms. 48021 has 4 selectors, not "62,254 derivations" |

**Three claims in the older inventory are wrong and must not be re-adopted:**
Caldwell is not a zero for wells or footprint; flood is not a coverage owe; and
**no FIPS has zero wells** (2,548 / 10,654 / 24 / 458 / 801 / 1,162), so the
"zero-FIPS writes coverage-absence and stops" branch is dead code, not a path.

Confirm each count before acting on it. If your measurement disagrees materially
with the numbers above, **your predicate is wrong, not the corpus** — say so
rather than adopting a new number.

## Wiring you must check before you run anything

The writers read `neondb`, not the Factory L2 copy. `landing_tx_rrc_well`,
`landing_tx_building_footprint` and `landing_tx_fema_nfhl_flood_zone` were
measured to have **one reference each across all three repos — the spec that
writes them, and zero readers.** Meanwhile `fetch-wells-staged.ts` reads bare
`FROM tx_rrc_well`, `staged-footprint-join.ts` reads `tx_building_footprint`, and
`postgis-flood-plan.ts` reads `tx_fema_nfhl_flood_zone`.

So **collect-complete for these rails is a count of the table the writer actually
reads**, not of the L2 copy. Do not "verify" against a table nothing consumes.

## Job discipline — the traps are named because they have fired here

1. **Every run names its county and the job refuses without one.** P1-FACTORY
   landed refuse-on-missing-county; use it. `factory-conformant` previously
   defaulted to 48021.
2. **Cloud Run args are `--name=value`.** A reader that parses only the spaced
   form runs on defaults and reports success. **Read the resolved run scope back
   off the execution log**, not off the invocation you typed.
3. **One writer per `(store, entity_type, county_fips)`. One heavy scan per
   database.** Serialize the heavy scans — footprint waits for the RRC scan to
   release.
4. **Do not re-run `landing-import`.** Its landing tables carry
   `BEFORE UPDATE OR DELETE → LANDING_IMMUTABLE` triggers and it counts the whole
   table, so a second run yields 2x and then fails permanently. C-count already
   ran 2026-08-26/27 with nine clean two-counts.
5. **`applyMigrations` reads `migrations/` only.** Nothing here applies a
   migration.

## Five-field record per rail, or the writer does not start

A rail may atomize only when a record names all five: **source** (the table the
writer reads), **scope** (which of the six, never 254), **two-count** (source and
result, each timestamped — `0=0` is vacuous unless a coverage-absence row is also
written), **vintage**, and **run id** (a Factory run, not a laptop). P1-FACTORY
landed `SELECT FROM import_ledger` before `startRun` — that is the gate; do not
route around it.

## Acceptance — both directions, and on the served path

- Per-FIPS atom counts before and after, for each of the three rails, reconciling
  to the measured numbers above.
- **A known-well parcel shows the atom on a live brief; Pine stays
  `absent-verified` if RRC genuinely has no well there.** An empty rail on a
  parcel that has data is the failure this rail exists to prevent.
- Gate 8's wire assertions run against the served body after the apply and do not
  regress. C3/C4/C7 stay as they are — if any of them *moves*, something else
  moved and you say so rather than accepting a greener board.
- A deliberately omitted `--county` refuses, observed.
- Any query that times out is reported `unmeasured` with its timeout named.

## Do not

Touch setbacks, edges or envelope. `SELECT tx_rrc_well` from PE — P-50 stands, the
atom is the surface. Copy any landing table into `place_layer_snapshots`. Re-run
`landing-import`. Re-download wells, footprint, flood or CAD. Treat a zero atom
count as collected, or a timeout as a zero. Apply a migration. Start Wave R.
Restart `scllr`, F-09, F-10 254, or Harris PBF. Adopt a new count that disagrees
with the measured table above.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_p4-rails_cp1.json
  CP2: _inbox/2026-08-31_p4-rails_cp2.json
  CLOSE: _inbox/2026-08-31_p4-rails_close.json
