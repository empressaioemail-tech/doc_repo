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
repo: legacy-design-tools

# One population two lineages and a ruling waiting on the difference

# CTX-HAYS-SPLIT — one population, two lineages, and a ruling waiting on the difference

Repo: `legacy-design-tools`. Reuse the registered, clean worktree
`P:/seat-worktrees/property/legacy-design-tools-ctx-hays` on branch
`fix/ctx-hays-2026-cad-reacquire`.

This is a read-only measurement. It is expected to produce no code diff. If you find
yourself writing an implementation, you have misread the mission.

## Why this exists

CTX-HAYS closed 2026-09-09 and resolved the Hays question decisively: mechanism B, the
county's own appraisal district has never published a 2026 roll larger than about
134,600 accounts, confirmed by three independent source counts five months apart across
two export schemas with a spread of fifteen rows. Read
`_inbox/2026-09-09_ctx-hays_close.json` and
`_inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md` first. That work
is sound and you are not re-doing it.

It ends by handing the operator a ruling: does Hays launch on its true smaller 2026
population, with the roughly 37,510 absent accounts handled by CTX-RETIRE's
`recordRetirement` declared-absence mechanism.

**That handback contains an internal inconsistency and the ruling should not be made on
it as written.**

The same finding establishes that `cad_property` tax_year 2025 for 48209 has TWO source
lineages:

    hays-export2.zip                       55,695 rows   genuine CAD export
    stratmap25-landparcels_48209_lp.zip   116,421 rows   non-CAD parcel geometry,
                                                         applied 2026-08-25 as a
                                                         coverage fallback because the
                                                         real CAD export was short

The close then describes the whole absent population as "real 2025-vintage accounts
absent from the current 2026 roll." The word "lineage" appears zero times in the close.
That population was never split.

## Why the split is load-bearing rather than pedantic

`recordRetirement` asserts a specific thing: **an account that was on a roll has left
it.** That is true and honest for a genuine CAD dropout.

It is a category error for a StratMap geometry row that was never on any CAD roll. Writing
a retirement for one of those claims a retirement that never happened. It would be a
fabricated claim that passes every existing check, which is precisely the failure class
`ENFORCEMENT.md` exists to prevent, and it would be written at scale onto a launch county.

The two populations need different honest states. A CAD dropout is retired. A parcel we
hold geometry for and never held an appraisal account for is a different absence
entirely, and naming it is part of this lane's output.

## The work

1. Split the absent population by `source_file`. For 48209, the set of `prop_id` present
   at tax_year 2025 and absent at tax_year 2026, grouped by the `source_file` that
   produced the 2025 row. Report the counts with the full counting rule.

2. Report the overlap explicitly. A `prop_id` may appear under both lineages if StratMap
   overwrote `source_file` on rows that were already genuine CAD accounts. The finding
   notes 116,421 rows were touched of which 40,870 were net new, which means roughly
   75,551 existing rows had their `source_file` rewritten. **If `source_file` was
   overwritten in place, then `source_file` alone cannot distinguish the two populations
   and you must say so rather than reporting a split it cannot support.** Establish
   whether a genuine CAD account can still be identified after that overwrite, and by
   what field if so. This is the crux of the lane and it may be the finding.

3. For each resulting population, state the honest absence state it should carry and why,
   in one sentence each. You are recommending, not implementing.

4. Verify by violating: run the same split against a county with a single clean lineage
   (Bastrop 48021 holds only tax_year 2025 from one source) and confirm your instrument
   returns what a single-lineage county should return. An instrument that has only been
   run where you expect a split has not been shown to distinguish anything.

## Pre-register your falsifier

Before you run the split, state what result would show the two lineages are NOT
separable, and what you will conclude if that is the result. "The split is impossible
after the overwrite" is a legitimate and useful outcome, and reporting it is a success,
not a failure.

## What you must NOT do

Do not write `recordRetirement`, or any absence state, onto any parcel. This lane
measures and recommends.

Do not re-acquire, do not backfill, do not touch `MAX_MISS_RATE` or any gate threshold.

Do not bake, publish, walk, deploy, submit a Cloud Build, or run a Cloud Run job.

Do not write to hauska-factory, hauska-engine or hauska-map.

Do not manufacture a code diff to satisfy a general "you write code" expectation. The
previous lane in this worktree correctly shipped nothing and said so; do the same if
that is the honest outcome.

## Close contract

Standard lane close JSON, plus:

- The split counts by lineage with the full counting rule, or a plain statement that the
  lineages are not separable and the evidence for that.
- Whether `source_file` was overwritten in place, established from the data.
- The recommended honest state per population, one sentence each.
- The single-lineage control result.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.

The operator rules on Hays from this artifact. Write it so that a person who has not read
any of the preceding closes can act on it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-hays-split_cp1.json
  CP2: _inbox/2026-09-09_ctx-hays-split_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-hays-split_close.json
