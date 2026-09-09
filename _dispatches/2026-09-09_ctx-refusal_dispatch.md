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

# The ceiling is confirmed correct and the rail still refuses against it

# CTX-REFUSAL — the ceiling is confirmed correct and the rail still refuses against it

Repo: `hauska-factory`. This is the read CTX-ELGIN could not reach, and it is the last
thing between Bastrop and Travis and a bake.

## What is already settled, so you do not re-litigate it

CTX-ELGIN closed 2026-09-09 (`_inbox/2026-09-09_ctx-elgin_close.json`). Read it first.
It established, with evidence:

- **The ceiling of 9 (48021) / 457 (48453) is correct.** It is the only measurement taken
  against both the rail's own population and the rail's actual data path,
  `txgio_parcel.zoning_district`.
- **The staged table is not the basis.** `tx_zoning_district_staging` has no live
  production consumer for Elgin at all: `join-zoning-district-to-parcels.mjs` is
  Lockhart-only by its own docstring and `drain.ts` is an explicit stub for a future
  Factory 2 writer. The integration seat proposed deriving the ceiling from that table
  and was wrong; the lane disproved it by reading the consumers.
- **A re-stage did not help.** Bastrop residue moved 48 to 58, AWAY from the probe's 9,
  not toward it. Not staging drift.
- **The instrument is validated.** The falsifier reproduced CTX-STAGE2's Pflugerville
  numbers exactly, 2,959 / 41, from a second independent lane.

Do not re-run the re-stage. Do not re-derive the ceiling from the staged table. Both have
been done and both answers are in that close.

## The question this lane exists to answer

`factory-parcel-r5-zoning` refused `LAYER_GAP_RESIDUE_EXCEEDED` on the Bastrop dry run
(execution `dppvg`) because its measured residue exceeded the declared ceiling of 9.

The ceiling is now confirmed correct. So one of these is true and you must determine
which, with evidence, rather than settling on the first that fits:

**Mechanism A.** The rail's residue measurement counts a different population than the
probe that produced 9. Both could be correct about different questions. The rail counts
UNACCOUNTED CELLS, which excludes parcels already carrying an earned state from a prior
sweep; the probe point-in-polygoned a parcel population. Those are not the same set and
nobody has written down the difference.

**Mechanism B.** The rail's measurement is right and the underlying data moved since the
probe, so the true current residue really is above 9.

**Mechanism C.** The rail's own query has a defect. It has never been read by anyone
outside this repo.

State the mechanism you believe, then state a second that would produce the same
observation and why you rejected it. Stopping at the first plausible explanation is the
documented recurring error in this operation.

## The work

1. Read `factory-parcel-r5-zoning`'s residue query and the `LAYER_GAP_RESIDUE_EXCEEDED`
   guard. Write down its exact population, predicate and exclusions. This is the artifact
   nobody has produced.

2. Put that definition side by side with CTX-ELGIN's probe definition and CTX-STAGE2's
   staged-join definition, both of which are written out in their closes. Three
   definitions, one table. Say plainly which of the three the ceiling in
   `src/config/zoning-layer-completeness.mjs` is being compared against, and whether that
   comparison is apples to apples.

3. Re-run the rail's own dry run for Bastrop 48021 and report its measured residue as a
   number, alongside the ceiling it is compared to. Dry run only. Do NOT pass `--apply`.

4. Resolve the mechanism. If the ceiling and the measurement are comparing different
   populations, the fix is to make them comparable, and you propose that fix rather than
   changing a number.

## The second item, which is a real data gap CTX-ELGIN found

Eleven live Elgin polygons carry `Zone_Code='S-P'`, a genuine Elgin zoning district that
this program's registry never mapped. Nine of those polygons geometrically cover ten of
the fifty-eight residue parcels.

So the residue decomposes: ten parcels are a WRONG CODE MAP, and forty-eight are zero
live coverage. Those are different defects. A parcel sitting inside a real district we
failed to map is not an uncovered parcel and must never be served as one.

Establish whether the same class exists for any other staged city. An unmapped code in
one city's registry is a bug; unmapped codes across several is a missing validation, and
the fix is different.

Report it. The registry itself is in hauska-engine, not this repo, so you do not fix the
mapping here.

## Hard prohibitions

**Do not change the ceiling to make the gate pass.** The guard refusing is correct
behaviour and it has already caught one borrowed number. If your conclusion is that the
ceiling should change, that is a recommendation with a derivation, handed back, not a
commit.

**Do not write `not-applicable` on any parcel to clear a count.** `not-applicable` claims
the land is unzoned. A parcel probed and found uncovered earns `refused`, which is weaker
and honest. Watch for an unaccounted count falling without a matching acquisition
landing; that is relabelling and it is the tripwire named in
`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

**Do not pass `--apply` to anything.** Dry runs only.

**Do not deploy, submit a Cloud Build, or run a bake, publish or walk.** The integration
seat owns every execution on this program. A dry run of the r5-zoning rail is the one
execution this lane may perform, and it writes nothing.

Do not write to hauska-engine, legacy-design-tools or hauska-map.

## Trap recorded from the lanes before you

A long-running query at near-zero CPU is STUCK, not working; CTX-STAGE2 lost over an hour
to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set `connect_timeout`
and `statement_timeout`, and announce any heavy scan before you start it per
AGENT-CONTRACT section 4.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Use per-parcel `EXISTS` aggregation, never a flat join. A flat join
already produced an impossible number in this program once.

## Close contract

Standard lane close JSON, plus:

- The rail's residue definition written out: population, predicate, exclusions.
- The three definitions side by side and the apples-to-apples verdict.
- The dry-run measured residue and the ceiling it was compared against, as numbers.
- Your mechanism, the second mechanism you rejected, and why.
- The S-P decomposition and whether the unmapped-code class appears in other cities.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-refusal_cp1.json
  CP2: _inbox/2026-09-09_ctx-refusal_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-refusal_close.json
