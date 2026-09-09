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

# 67 parcels can never reach any state and the real fix is deferred on purpose

# CTX-STAMPFALL — 67 parcels can never reach any state, and the real fix is deferred on purpose

Repo: `hauska-factory`. Branch from `origin/main` **after** `f0fe15bb` (CTX-PARCELGATE,
PR #122, merged). You will edit the file it just changed; confirm that commit is in your
base before writing anything.

This is the last thing standing between Bastrop and Travis and a bake.

## The hole, established by reading the write paths

`parcel-r5-zoning` is the SOLE owner of the `zoningDistrict` rail. `parcel-record-fill`
says so in its own comment and deliberately refuses to upsert it, because doing so already
wiped `zoningDistrict` across Williamson and partially McLennan, Travis and Hays over
eight recurrences in one day. No other job in this repo touches `zoning_district`.

`parcel-r5-zoning` writes a `value` cell only inside its match path — only for a parcel
that matched a staged polygon.

So a parcel that matches no staged polygon but carries a real `txgio_parcel.zoning_district`:

- cannot reach `value`, because it matched nothing, and
- cannot reach `refused`, because CTX-PARCELGATE's condition 2 correctly excludes it, and
- therefore stays `unaccounted` permanently.

`publish-gate.js` requires `unaccountedCount === 0`. That population is **17 in Bastrop
and 50 in Travis**, both re-verified live on 2026-09-09.

Two prior closes referred to a "pending Factory re-bake" that would resolve them. **It does
not exist.** That was an inference, repeated, and the integration seat carried it forward
twice before reading the write paths. Do not go looking for it.

## Why those parcels have a district at all, which is the root

Their `txgio_parcel.zoning_district` was written by `stampCountyZoning()` in
`legacy-design-tools`, from **LDT's own zoning-layers registry** — a completely separate
registry from `hauska-engine`'s `zoning-staging` one. CTX-STAMP established that
separation on 2026-09-09 and correctly stopped rather than ship against the wrong table.

So two registries disagree about coverage. LDT's stamp covers these parcels; the engine's
staged layer does not. **That disagreement is the real defect**, and reconciling the two
registries is the correct fix.

The operator has ruled that reconciliation DEFERRED, and this lane implements the lighter
path with an explicit flag to come back. Do not attempt the reconciliation here.

## The fix

When a parcel matches no staged polygon **and** carries a real
`txgio_parcel.zoning_district`, write a `value` cell for it.

Constraints, and the first is the one that matters most:

1. **Its `source` must name the stamp, not the staging layer.** `ZONING_SOURCE` is the
   constant `"tx_zoning_district_staging"` and that value did not come from there. Using it
   would be a false provenance claim, which is the single thing this program's whole gate
   structure exists to prevent. Introduce a distinct source string that says what it is.

2. **Establish the stamp's currency before writing a value from it.** CTX-ELGIN re-verified
   all 17 still carry a real value today, but that is evidence of presence, not of
   currency. A stale stamp written as a current `value` is worse than an `unaccounted`
   cell. If you cannot establish a vintage for the stamp, say so plainly and state what
   you wrote instead — that is a legitimate outcome and it is better than a confident
   wrong one.

3. **Reuse CTX-PARCELGATE's `RESIDUE_HAS_REAL_ZONING_SQL`.** It already identifies exactly
   this population, per-parcel, with `EXISTS` aggregation rather than a flat join. One
   definition, two consumers: it decides both that a parcel is excluded from `refused` and
   that it is eligible for a stamp-sourced `value`. Two independent queries that must agree
   would drift.

4. **Do not change the residue arithmetic.** These parcels still match no polygon, so raw
   residue stays 36 Bastrop / 506 Travis and the guard keeps comparing raw. Do not touch
   `assertResidueWithinDeclaration` and do not change any ceiling.

## The revisit flag, which is a required deliverable

The operator asked for this explicitly. Follow the precedent set twice today: the flag
goes **in the code and is pinned by a dedicated test**, not only in a document.

It must name:

- what is deferred: reconciling `hauska-engine`'s `zoning-staging` registry with
  `legacy-design-tools`' `zoning-layers` registry, so a parcel's zoning coverage does not
  depend on which registry is asked;
- why it was deferred: to unblock the Central Texas bake;
- what this fallback costs: a `value` whose provenance is a second registry the staged
  layer disagrees with, which is honest but is not the same as coverage;
- what would trigger the revisit.

A comment nobody is required to read is not a flag. A test that fails if it is removed is.

## Verify by violating

In one run, with real parcel ids:

- a parcel matching no polygon and carrying a real stamp gets a `value` cell whose source
  names the stamp;
- a parcel matching no polygon and carrying no stamp still gets `refused`, unchanged;
- a parcel matching a staged polygon still gets `value` with `ZONING_SOURCE`, unchanged.

Confirm the guard still refuses when raw residue exceeds the ceiling. This lane must not
make any gate stop firing.

## The direct question, answer it as a yes or a no

After this change, plus CTX-SP staging Elgin's S-P code, plus Bastrop's ceiling re-derived
to 26: **does `parcel-r5-zoning` run to completion for Bastrop and does
`unaccountedCount` reach zero?** And separately for Travis, which needs only this change
since its ceiling is already written at 506.

Answer both plainly. If a fourth thing is missing, that is the finding and it outranks a
clean close, exactly as CTX-PARCELGATE's third-precondition answer did.

## What you must NOT do

Do not reconcile the two registries. That is the deferred work and the flag exists so it
is not lost.

Do not write to `hauska-engine` or `legacy-design-tools`. CTX-SP is live in hauska-engine
on the Elgin registry right now; if you believe your fix needs a change there, STOP and
report rather than reaching across.

Do not change any ceiling, do not touch `assertResidueWithinDeclaration`, do not pass
`--apply`, do not deploy, do not submit a Cloud Build, do not run any bake, publish or
walk. The integration seat rebuilds and runs the counties.

Do not write `not-applicable` on any parcel.

## Traps carried forward

`txgio_parcel` holds multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

A long-running query at near-zero CPU is STUCK, not working. Restrict by `city_key`,
pre-filter on the numeric bbox columns, set `connect_timeout` and `statement_timeout`, and
announce heavy scans before starting them.

`cli.mjs` has a code-only catch handler that swallows error detail; call
`runParcelR5Zoning` directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The source string you introduced and why it names what it names.
- The stamp's currency: what you established, how, or that you could not.
- Both direct answers, Bastrop and Travis, as a yes or a no.
- All three violation runs with real parcel ids.
- Where the revisit flag lives and which test pins it.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs the counties from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-stampfall_cp1.json
  CP2: _inbox/2026-09-09_ctx-stampfall_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-stampfall_close.json
