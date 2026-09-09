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

# A multi-layer city is tested against the wrong county's layer

# CTX-ZONESCOPE — a multi-layer city is tested against the wrong county's layer

Repo: `hauska-factory`. This is the last code blocker between Bastrop and Travis and a
bake.

## The defect, already found and reproduced

CTX-REFUSAL closed 2026-09-09. Read `_inbox/2026-09-09_ctx-refusal_close.json` in full
first, especially `mechanismResolved` and `proposedFixes_notApplied`. It did the
diagnostic work; you are implementing, not re-deriving.

`loadInScopeCities` (`IN_SCOPE_CITIES_SQL`) returns one row per `(place_fips, city_key)`.
Elgin has two live, correctly-staged base layers under two different keys:

    elgin-tx          FeatureServer/0   Bastrop side   3,209 polygons
    elgin-tx-travis   FeatureServer/1   Travis side      499 polygons  (staged by CTX-STAGE2)

`processCity`'s population query (`CITY_ALL_PARCELS_SQL`) scopes by `place_fips` alone —
the whole city, both counties — and never intersects with the county that particular
`city_key` row's own layer actually covers. So every Travis Elgin parcel is tested against
a Bastrop-side layer that structurally cannot cover it, and vice versa.

Verified live by that lane, reproduced identically twice:

    matched against ONLY the Bastrop-side layer:  Bastrop residue 36 (real)   Travis 1,680 (spurious)
    matched against ONLY the Travis-side layer:   Travis residue 507 (real)   Bastrop 3,288 (spurious)

There is also an ORDER BY tie hazard: `assertResidueWithinDeclaration` throws on the first
county in insertion order, so only one of the two ever reports.

## Fix 1, and the recommended shape

Two options were named. **Take (b) unless you find a reason not to, and say so if you do.**

(a) Intersect each `city_key` row's parcel population with the specific `county_fips` its
own staged layer actually falls in.

(b) Collapse a multi-layer city to ONE `processCity` pass per `place_fips`, against the
UNION of all its layers' zone polygons. Recommended because `buildZoningCells` already
records `sourceUrl` per matched parcel from whichever zone row matched, so per-layer
provenance survives a union without separate passes. It also removes the ORDER BY tie
hazard, since there is then exactly one pass per city rather than two racing to throw.

Whichever you take, confirm per-layer provenance actually survives it by reading a matched
cell's recorded `sourceUrl`, not by assuming the mechanism the close describes.

## Fix 2, the ceiling, and the discipline it needs

`DECLARED_LAYER_GAP.Elgin.expectedResidue` is 9 Bastrop / 457 Travis. Those came from
CTX-ELGIN's live probe, which is a different predicate from the rail's own. The rail's
own corrected numbers are 36 and 507.

**Do not simply write 36 and 507 into the config.** That would repeat the exact error that
created this situation: a number derived by one instrument written as a ceiling enforced
by another, which is the root the retired planner named in its own handover.

The required work, and it is the point of this lane:

1. Land Fix 1 first, then re-run the rail's dry run per county and capture its own
   numbers.
2. Individually control-validate the DELTA parcels — 27 in Bastrop (36 minus 9), 50 in
   Travis (507 minus 457) — the same way CTX-ELGIN validated its original 9 and 457. That
   means probing each one against the live published layers and establishing that it is
   genuinely uncovered, not a victim of a second defect.
3. Only then propose the ceiling, with its derivation and the validation evidence.

If any delta parcel turns out to be covered by a layer we hold, the residue is wrong again
and the ceiling is not ready. Report that rather than rounding it away.

## The S-P class, which is part of this

CTX-ELGIN found 11 live Elgin polygons carrying `Zone_Code='S-P'`, a genuine Elgin
district this program's registry never mapped, 9 of which geometrically cover 10 residue
parcels. A parcel sitting inside a real district we failed to map is not an uncovered
parcel and must never be served as one, nor counted in a ceiling as though it were.

The registry itself lives in hauska-engine, so you do not fix the mapping here. But those
10 parcels must not be inside whatever ceiling you propose, and your close must say
whether they are or are not, with the count.

CTX-REFUSAL confirmed Elgin is the only current multi-layer city in the staged table but
did not complete a live audit of whether the unmapped-code class exists elsewhere. If a
cheap check exists, run it; if not, say it is unrun rather than implying it is clear.

## Hard prohibitions

**Do not raise or edit the ceiling to make a gate pass.** The guard refusing is correct
behaviour and has already caught one borrowed number. A ceiling change is a proposal with
a derivation, handed back, unless steps 1 to 3 above are complete and the evidence is in
your close.

**Do not write `not-applicable` on any parcel to clear a count.** `not-applicable` claims
the land is unzoned; a parcel probed and found uncovered earns `refused`. Watch for an
unaccounted count falling without an acquisition landing — that is relabelling, and the
tripwire is in `_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

Do not pass `--apply` to the rail. Dry runs only.

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat rebuilds and runs the counties.

Do not write to hauska-engine, legacy-design-tools or hauska-map.

## Traps recorded from three lanes before you

A long-running query at near-zero CPU is STUCK, not working; over an hour was lost to a
residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set
`connect_timeout` and `statement_timeout`, and announce heavy scans before starting them.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join. A flat join already
produced an impossible number in this program once.

`cli.mjs` has a code-only catch handler that swallows error detail. CTX-REFUSAL had to call
`runParcelR5Zoning` directly to see the full error. Do the same rather than debugging
blind.

## Close contract

Standard lane close JSON, plus:

- Which fix shape you took and why, and the read of a matched cell's `sourceUrl` proving
  per-layer provenance survived.
- Per-county dry-run residue after the fix, with the counting rule.
- The delta-parcel control validation: how many probed, how many confirmed genuinely
  uncovered, how many were not.
- Whether the 10 S-P parcels are inside your proposed ceiling, with the count.
- The proposed ceiling with its full derivation, NOT written into config unless steps 1
  to 3 are complete.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-zonescope_cp1.json
  CP2: _inbox/2026-09-09_ctx-zonescope_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-zonescope_close.json
