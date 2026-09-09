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

# 18037 rows are silently dropped by every bake and re-running cannot reach them

# CTX-SITUS-SKIP — 18,037 rows are silently dropped by every bake, forever, and re-running cannot reach them

Repo: `legacy-design-tools`. This is the largest single blocker on the CTX board.

## The defect, already located precisely

CTX-PROV closed 2026-09-09. Read `_inbox/2026-09-09_ctx-prov_close.json` in full first,
especially `step3_mechanism` and `step4_population`. It did the diagnosis; you are fixing.

In `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts`, the per-row bake loop
(roughly lines 336-345 at `3885efad`):

    if (rollAbsent) { situs = situsForRetiredBake(body) }
    else {
      const { situs: s, refuse: refuseSitus } = situsForBake(body);
      if (refuseSitus) { skippedBadSitus += 1; continue }
      situs = s;
    }

`situsForBake` calls `assertSitusNotPunctuationOnly` (`serveGuards.ts`,
`PUNCTUATION_ONLY_RE = /^[\s,.\-;:'"`]+$/`). When it throws, `situsForBake` returns
`{ situs: null, refuse: true }` and the `continue` fires **before any database write**.

So an on-roll account whose CAD claim carries a punctuation-only situs is never written.
Its snapshot stays frozen on whatever pre-conformant shape it last held, across every
future bake run for that county, indefinitely. A re-bake does not reach it. It is not a
staleness problem that time or another run will clear.

## The population, measured live by full-table scan

    Bastrop    48021   16,104 of  77,799   20.7%
    McLennan   48309    1,165 of 114,255    1.02%
    Hays       48209      768 of 173,050    0.44%
    Caldwell   48055        0 of  48,649    0%
    Travis     48453        0 of 500,307    0%
    Williamson 48491        0 of 602,050    0%
                        -------
                         18,037

Not a sample. Predicate control: the query matched 1,516,110 rows overall, so a broken
`WHERE` reporting a false absence is ruled out.

## The asymmetry is a required question, not a footnote

Travis and Williamson are the two largest counties and both sit at exactly zero. Bastrop
sits at 20.7 percent. That is not a plausible difference in how real appraisal districts
record addresses; it points at a source or parser difference.

**Establish why before you fix anything.** Specifically:

- Are the affected rows disproportionately from one `source_file` lineage? Hays' own
  investigation on 2026-09-09 established that `cad_property` carries StratMap
  land-parcel rows alongside genuine CAD exports, and that StratMap overwrote
  `source_file` in place on some rows. If punctuation-only situs correlates with
  non-CAD-sourced rows, the right fix may differ by lineage and the whole framing changes.
- Does the CAD format matter? Bastrop, Caldwell and Travis are `pacs`; Hays and
  Williamson are `orion`. Bastrop and Travis share a format and sit at 20.7 and 0. So
  format alone does not explain it either. Say what does.

If you find the population is not what it appears to be, that is the finding and it
outranks the fix.

## The fix, and the shape it must NOT take

**Do not relax `PUNCTUATION_ONLY_RE`.** Do not weaken or bypass
`assertSitusNotPunctuationOnly`. Do not touch the serve guard. That guard exists because
this program was serving `", ,"` as an address, and it is correct. The guard is not the
bug.

**The bug is the response to it.** A bad situs is a fact about one leaf. The bake answers
it by discarding the entire row, which loses every other correct fact that row carries and
does so silently.

The honest shape is that a row with an unusable situs is **written with an earned absence
on the situs leaf**, carrying its basis, not skipped. There is already precedent in the
same function: `situsForRetiredBake` exists for the `rollAbsent` branch, added by
CTX-RETIRE. Mirror that discipline.

Constraints on the absence:

- It must satisfy `BP-CONTENT-01`'s four-state contract and pass `isEarnedLeafAbsence`,
  not be a bare null. A null situs is what caused a different blocker earlier today.
- Its basis must name the real reason, something a reader can act on, not a code.
- Never fabricate or infer a situs. Not from the parcel geometry, not from a neighbour,
  not from a ZIP centroid.
- `situsCity` and `situsZip` are separate leaves with their own states. Establish whether
  they are independently available when `situsAddress` is unusable, and do not blanket
  them absent if they are not.

**Do not silently count and move on.** `skippedBadSitus` is currently a counter that
increments and is, as far as this program can tell, never surfaced anywhere that would
have caught 16,104 rows. Whatever you do, the outcome must be countable and visible.

## What changes for customers, which you must state

Those 18,037 rows currently serve a stale pre-conformant snapshot. After a fix and a
re-bake they will serve a current row with a declared absence where the address was.

That is the correct trade — honest absence beats a stale value presented as current — and
it is a visible change on a launch surface. Say plainly in your close what a customer sees
before and after for one real parcel, by example, so nobody discovers it from a support
ticket.

## Verify by violating

Show the bake writing a row for a punctuation-only-situs account where it previously
skipped, and show that a genuinely malformed absence marker is still rejected. Both runs
pasted, exit codes from the process not a pipe.

Confirm rows with a normal situs bake **identically** to today. A diff that changes output
for the 1.5 million healthy rows is a regression, not a fix.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the publish image from your merged main and runs the counties.

Do not write to hauska-factory, hauska-engine or hauska-map. `BP-CONFORMANT-01` and
`BP-CONTENT-01` live in hauska-factory and are not wrong; do not ask for them to be
changed.

Do not touch `MAX_MISS_RATE` or any gate threshold.

Two concurrent lanes are editing hauska-factory's `verify-walk.mjs` right now
(CTX-WALKRULE, CTX-ZONESCOPE). You are in a different repo and should not encounter them,
but if your fix appears to require a hauska-factory change, STOP and report rather than
reaching across.

## Close contract

Standard lane close JSON, plus:

- Why Bastrop is 20.7 percent and Travis and Williamson are zero, with evidence.
- Whether the affected rows correlate with a `source_file` lineage.
- The absence shape you wrote and how it satisfies `isEarnedLeafAbsence`.
- The disposition of `situsCity` and `situsZip` independently of `situsAddress`.
- Where the skip is now countable and visible.
- Before and after for one real parcel, as a customer would see it.
- Proof that normal-situs rows bake unchanged.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs the counties from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-situs-skip_cp1.json
  CP2: _inbox/2026-09-09_ctx-situs-skip_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-situs-skip_close.json
