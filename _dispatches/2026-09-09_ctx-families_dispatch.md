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

PLAN-ROW: P-120, P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# Six fact families reach no consumer and three of them are already built

# CTX-FAMILIES — six fact families reach no consumer, and three of them are already built

Repo: `hauska-engine`.

This is the highest-return work available on this program right now, and it is the only
lane that makes the product answer MORE rather than answer honestly. It is blocked on no
county, no bake, and no other lane.

## The measurement, which you must reproduce before you trust it

`_inbox/2026-09-08_six_fact_families_reach_no_consumer_finding.md`, measured on serving
revision `hauska-engine-api-00193-xex` by two seats independently, invariant across
Bastrop, Caldwell, Williamson and Hays:

    utilities           failed-this-run
    dischargePoint      out-of-scope
    floodplainAcreage   failed-this-run
    firmPanel           failed-this-run
    soil                out-of-scope
    electricProvider    out-of-scope

`gasProvider` is also invariant at `blocked-at-source` but was RULED permanently
unacquirable on 2026-09-03. It is an honest declared absence and is NOT in scope. Do not
count it in any tally here; it looks identical from the instrument and has been
miscounted before.

**Production has moved since that measurement.** The serving revision is now
`hauska-engine-api-00198-cir`, digest `sha256:2af8119c`, built from engine `f2535f4` by
Cloud Build `7a11d9e6`. It went to 100 percent without a recorded traffic shift and the
integration seat has identified but not accounted for it. Re-run the `absentFields`
instrument against the CURRENT serving revision before doing anything. If the six are no
longer six, that is the finding and you report it instead of the mission.

## The two classes are different defects with different fixes

`out-of-scope` means the resolver is not reaching the route at all despite being
described as armed. That is the A-120 shape this program has now hit at three distinct
levels: merged with no caller, dispatchable with nowhere to execute, and reached-but-not-
routed. **soil, electricProvider, dischargePoint.**

`failed-this-run` means the resolver IS reached and is failing live. A working mechanism
with a broken input. **utilities, floodplainAcreage, firmPanel.** NFHL reads are failing
right now.

Do not report these as one number and do not fix them as one change.

`floodplainAcreage`, `firmPanel` and `soil` are three of the five fact families merged as
engine PR #404 on 2026-09-07. Built, tested, reaching nobody. Read that PR before you
write anything; the code is probably correct and the wiring is probably the whole defect.

## The work

1. Reproduce the classification against the current serving revision. Report agreement or
   disagreement with the four-county invariance above.

2. Wire the three `out-of-scope` families to the feasibility route. For each, state what
   the missing link actually was in one sentence, because the pattern across three
   instances is worth more than the three fixes.

3. Fix the three `failed-this-run` live reads. `floodplainAcreage` and `firmPanel` both
   read NFHL; establish whether that is one failure or two before fixing it as two.

4. For every family you touch, confirm it reaches a real parcel on a real route and
   produces a real value or an honest declared absence. A family that moves from
   `out-of-scope` to `failed-this-run` has not been fixed.

## The gate this lane is now measured against

The operator ruled on 2026-09-09 that the Feasibility report is a launch surface
alongside the map. That makes this lane a launch blocker, and it sets the target:

**Zero families in `out-of-scope` or `failed-this-run`.**

Those two classes mean either we have the answer and are not delivering it, or the
mechanism is broken. `blocked-at-source` and ruled absences are honest and are the
product working as designed. The target is not "thirteen values"; it is that every
absence a customer sees is a true one.

## The second finding in that document, which constrains how you report

Same revision, back to back: Caldwell resolved 8 absences across 10 cited sections in 12
pages; Williamson 13 absences, 9 sections, 8 pages; Hays the same as Williamson. A
Williamson report is a third shorter than a Caldwell one.

The lane that found the six families first reported them as route-level on the strength
of two counties agreeing, while the disproof was already sitting in its own smoke output.
Its own correction:

> "I did not have too little data. I had the disproof in hand and did not compare it."

Two counties agreeing is not evidence of invariance. When you claim any behaviour is
route-level rather than jurisdiction-varying, name the counties you compared and compare
the whole return, not the fields you already believed were route-level.

## Operator ruling you are implementing, 2026-09-09

The report's disclosure of what it could not answer goes in `absentFields`, surfaced to
the customer, rather than a separate banner. This carries one condition and it is yours
to honour: **a customer must never see "we could not determine this" for a family whose
resolver simply is not wired.** That is why the two broken classes must be empty before
that surfacing is trustworthy. If you surface `absentFields` while `out-of-scope` is
non-empty, the product lies politely.

## What you must NOT do

Do not deploy, do not shift traffic, do not run a Cloud Build. The integration seat owns
every execution and deploy on this program, including this one.

Do not write to legacy-design-tools, hauska-factory, or hauska-map.

Do not touch `gasProvider`.

Do not make a family "resolve" by widening a check or defaulting a value. A family with
no data refuses with its reason. Per `ENFORCEMENT.md`, degradation is permitted only when
declared.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- The `absentFields` classification per family, before and after, on a named revision.
- One sentence per `out-of-scope` family on what the missing link was.
- Whether the NFHL failures are one root cause or two, with evidence.
- The counties you compared for any invariance claim.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-families_cp1.json
  CP2: _inbox/2026-09-09_ctx-families_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-families_close.json
