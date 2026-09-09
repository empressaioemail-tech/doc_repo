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

# One number measured with the right instrument unblocks both counties

# CTX-CEILING — one number, measured with the right instrument, unblocks both counties

Repo: `hauska-factory`. Branch from `origin/main` after `5800d4a8` (CTX-STAMPFALL,
PR #123, merged). Small, single-purpose lane.

## Where the program stands

Every other precondition is done:

    CTX-SP          merged (hauska-engine PR #415). Elgin's S-P district is mapped and
                    staged; all ten previously-unmatched Bastrop parcels now match,
                    including 14457, 12830 and 60891.
    CTX-PARCELGATE  merged (f0fe15bb, PR #122). The write is per-parcel eligible;
                    Travis's ceiling is written at 506, decomposed 456 + 50.
    CTX-STAMPFALL   merged (5800d4a8, PR #123). A residual parcel carrying a real
                    txgio_parcel.zoning_district now earns a value cell from a distinct
                    STAMP_SOURCE, so the 17 Bastrop / 50 Travis population can leave
                    `unaccounted`.

One thing remains. **Bastrop's declared ceiling is still 9 and its live raw residue is
26.** `assertResidueWithinDeclaration` refuses, and because CTX-ZONESCOPE correctly made
Elgin one grouped city across both counties, that refusal fails the whole job — so it
blocks Travis too, even though Travis is otherwise structurally complete.

CTX-PARCELGATE deliberately held Bastrop's ceiling rather than write it before S-P landed,
recording both candidates in `bastropCeilingPending`. S-P has now landed. This lane writes
it.

## Measure with the rail's own instrument, and only that one

**This is the crux and a prior lane was sent at the wrong instrument by a defective
dispatch.** CTX-SP was told to use CTX-STAGE2's counting rule verbatim, which uses
`ST_Contains(polygon, ST_PointOnSurface(parcel))` — point-in-polygon. It reported 48
before and 48 after, an unexplained non-movement it flagged honestly as a free finding.

The rail does not use that predicate. It uses best-overlap `ST_Covers` / `ST_Intersects`
with a 1e-8 floor and a bbox-centre fallback, ranked, against the union of the city's
staged base layers. Those are different questions and their answers were never comparable.

So: derive the ceiling from `runParcelR5Zoning`'s own dry run, calling it directly rather
than through `cli.mjs`, whose code-only catch handler swallows the detail. Do not import a
number from any prior close, including CTX-STAMPFALL's 26. **Re-measure it yourself and
report agreement or disagreement.**

If your number is not 26, that is the finding and you stop rather than write it.

## What to write

Bastrop's ceiling, as the validated raw residue **with its decomposition recorded
alongside it**, matching the shape CTX-PARCELGATE used for Travis. Each class carries its
own count and its own counting rule. A bare number regresses this to what it was and is
the reason the ceiling was wrong in the first place.

The expected decomposition, which you verify rather than assume:

    9   genuinely uncovered   (CTX-ELGIN's original set, re-verified twice since)
    17  staleness             (carry a real txgio_parcel.zoning_district;
                               now resolvable to `value` via CTX-STAMPFALL's STAMP_SOURCE)
    0   S-P                   (was 10; CTX-SP staged the district, they now match)
    --
    26

If S-P parcels still appear in your residue, CTX-SP's staging did not take effect on the
rail's predicate and that outranks writing anything.

## Why a larger ceiling is safe now, and you must prove it

A ceiling of 26 no longer means "26 parcels are uncovered." It means "26 parcels fall
outside the staged layer, of which 9 are genuinely uncovered." That is a weaker claim and
it is only safe because CTX-PARCELGATE's per-parcel gate separates counting from writing.

Prove that separation still holds at the larger ceiling, in one run, with real parcel ids:

- a staleness-class parcel receives no `refused` write and does receive a `value` cell
  sourced from `STAMP_SOURCE`;
- a genuinely-uncovered parcel receives `refused`;
- the guard still refuses when raw residue exceeds the ceiling.

CTX-PARCELGATE did exactly this for Travis with `500816` and `227351`. Do the Bastrop
equivalent.

## The direct question

State as a plain yes or no, for each county separately: **does `parcel-r5-zoning` run to
completion, and does `unaccountedCount` reach zero?**

CTX-PARCELGATE answered this honestly enough to surface a precondition nobody had, and
CTX-STAMPFALL did the same. If a fifth thing is missing, say so. That outranks a clean
close.

## What you must NOT do

Do not touch `assertResidueWithinDeclaration`. The guard is correct and has caught two
borrowed numbers.

Do not change Travis's ceiling. It is written at 506 and verified.

Do not write `not-applicable` on any parcel, and do not add an exception mechanism of any
kind.

Do not pass `--apply`. Dry runs only. Do not deploy, submit a Cloud Build, or run any
bake, publish or walk. The integration seat runs the counties.

Do not write to `hauska-engine` or `legacy-design-tools`.

## The open discrepancy, recorded so you do not inherit it as a task

CTX-SP's 48-before / 48-after under the point-in-polygon rule is unexplained, and it
proved its own marginal effect was exactly +10 matches, which should have moved that
number. The leading explanation is that the two instruments count different populations
and the marginal proof was against its own matched set. **It is not yours to resolve.** It
does not block, because the guard reads the rail's number and that one moved as predicted.
Note it in your close if your own measurement sheds light on it; do not chase it.

## Close contract

Standard lane close JSON, plus:

- Your own dry-run residue for Bastrop, with the rail's counting rule stated, and whether
  it agrees with 26.
- The decomposition as written into the declaration, class by class.
- All three violation runs with real Bastrop parcel ids.
- Both direct answers, yes or no.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs both counties from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-ceiling_cp1.json
  CP2: _inbox/2026-09-09_ctx-ceiling_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-ceiling_close.json
