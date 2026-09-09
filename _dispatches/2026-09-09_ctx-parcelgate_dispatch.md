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

# The guard counts per city, the population is per parcel

# CTX-PARCELGATE — the guard counts per city, the population is per parcel

Repo: `hauska-factory`. Branch from `origin/main` **after** `b55d76e9` (CTX-ZONESCOPE,
PR #121), which is already merged. You will be editing the same file it changed, so
confirm your base contains it before writing anything.

This is the last code blocker between Bastrop and Travis and a bake.

## What is already settled

CTX-ZONESCOPE closed 2026-09-09. Read `_inbox/2026-09-09_ctx-zonescope_close.json` in
full, especially `proposedCeiling_NOT_written` and `deltaParcelControlValidation`. Its
Fix 1 is merged. Do not redo it.

Established, with live evidence and a second independent predicate plus a positive
control:

    Bastrop 48021   raw residue 36   of which  9 genuinely uncovered
    Travis  48453   raw residue 506  of which 456 genuinely uncovered

The remainder decomposes into named classes, not noise:

- **Staleness.** Parcels already carrying a real `zoning_district` in `txgio_parcel`
  through some other mechanism. A pending re-bake resolves these to `value`. CTX-ELGIN's
  17-parcel Bastrop staleness list was re-verified live and all 17 still carry a real
  value. CTX-ZONESCOPE additionally found a Travis staleness class of 50.
- **S-P.** Ten Bastrop parcels geometrically covered by a real, live Elgin `S-P` polygon
  that this program's registry never mapped. Re-verified live today. Seven of the ten
  already carry a real `zoning_district` by another mechanism; three do not.
- **Genuinely uncovered.** 9 Bastrop, 456 Travis.

## The defect

`assertResidueWithinDeclaration` compares the FULL RAW per-county residue against the
declared ceiling. `buildLayerGapCells` is gated by `isDeclaredLayerGap(cityName)`, a
per-CITY boolean. So once `apply=true` runs, every residual parcel of a declared-gap city
becomes a `refused` cell candidate — staleness, S-P and genuinely uncovered alike —
subject only to the gated UPDATE's "currently unaccounted" clause.

Writing `refused` over a parcel that a re-bake would correctly resolve to `value` is a
wrong statement about that parcel, and it is the class this program's whole gate structure
exists to prevent.

## The operator's ruling, 2026-09-09

**Take the lighter fix and flag it for revisit after the bake.**

Keep `assertResidueWithinDeclaration`. Do not remove or weaken the guard. Do not
re-architect the ceiling. Make the WRITE per-parcel eligible, so a `refused` cell is
written only for a parcel individually established as uncovered.

The fuller question — whether a per-county residue ceiling is the right instrument at all
— is deliberately deferred. It is not solved by this lane and must not be quietly solved
by it either.

## The per-parcel gate

A parcel earns a `refused` layer-gap cell only if, at write time:

1. It matched no polygon in the union of its city's staged base layers, and
2. It does not already carry a real `zoning_district` in `txgio_parcel`.

Condition 2 is what stops a `refused` being written over the staleness class. Both
conditions are in-store and cheap.

**The three unresolved S-P parcels are the honest hard case and you must not paper over
them.** Seven of the ten are caught by condition 2. The other three are geometrically
inside a real district we failed to map, so they are neither uncovered nor resolvable
here — the registry that would map `S-P` lives in `hauska-engine`, out of this repo.

Do NOT invent an exception list for them. The `DECLARED_LAYER_GAP` ruling shipped
deliberately without an exception mechanism, on the grounds that an exception is reusable
on parcels nobody measured, and that reasoning still holds.

Measure what actually happens to those three under your gate and report it plainly. If
they end up `unaccounted`, say so and say what that does to the publish gate, which is
zero-tolerance (`publish-gate.js`: `ok: unaccountedCount === 0`). If that means Bastrop
still cannot publish without an engine-side registry fix, **that is the finding and it is
more valuable than a clean close.** Name it; do not engineer around it.

## The revisit flag

Per the operator, and following the impervious-cover precedent from earlier today: the
flag goes in the code and is pinned by a test, not only in a document.

It must name what is deferred (the per-county ceiling instrument itself), why it was
deferred (to unblock the bake), and what would trigger the revisit. A comment nobody is
required to read is not a flag.

## Verify by violating

Show the gate refusing to write a `refused` cell for a staleness-class parcel, and writing
one for a genuinely-uncovered parcel, in the same run. Both outcomes from real parcels
named by id, not fixtures alone.

Confirm the guard still refuses when the raw residue exceeds the ceiling. This lane must
not make the gate stop firing; it makes the write more precise while the guard keeps its
current behaviour.

## Hard prohibitions

Do not change any ceiling number. Not 9, not 36, not 456, not 506.

Do not write `not-applicable` on any parcel. `not-applicable` claims the land is unzoned;
a parcel probed and found uncovered earns `refused`. Watch for an unaccounted count
falling without an acquisition landing — that is relabelling, and the tripwire is in
`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

Do not pass `--apply` to the rail. Dry runs only.

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat rebuilds and runs the counties.

Do not write to hauska-engine, legacy-design-tools or hauska-map. The `S-P` registry fix
belongs in hauska-engine and is not yours.

`CTX-SITUS-SKIP` is live in legacy-design-tools on a related root cause (punctuation-only
situs). You should not encounter it; if you believe your fix requires an LDT change, STOP
and report rather than reaching across.

## Traps carried forward from four lanes

`txgio_parcel` holds multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

A long-running query at near-zero CPU is STUCK, not working. Restrict by `city_key`,
pre-filter on the numeric bbox columns, set `connect_timeout` and `statement_timeout`, and
announce heavy scans before starting them.

`cli.mjs` has a code-only catch handler that swallows error detail; call
`runParcelR5Zoning` directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The per-parcel gate as implemented, and how each of the three classes fares under it,
  by count.
- The disposition of the three unresolved S-P parcels, and what it does to the publish
  gate.
- Whether Bastrop can publish after this change, stated as a yes or a no with the reason.
- Both violation runs, by real parcel id.
- Where the revisit flag lives and which test pins it.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs the counties from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-parcelgate_cp1.json
  CP2: _inbox/2026-09-09_ctx-parcelgate_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-parcelgate_close.json
