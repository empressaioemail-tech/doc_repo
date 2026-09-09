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

# A missed sibling, a ruling never implemented, and one row that should not exist

# CTX-LEAVES2 — a missed sibling, a ruling never implemented, and one row that should not exist

Repo: `legacy-design-tools`. Three defects, three different shapes. CTX-ACREAGE diagnosed
all of them with live evidence and named each fix location; you are implementing, not
re-deriving. Read `_inbox/2026-09-09_ctx-acreage_close.json` in full first, especially
`whereTheFixesLive`.

**Do not fix these as one change and do not report them as one number.** Two lanes on this
program have already had to be corrected for exactly that.

## Defect 1 — `baseFacts.acreage` is a bare null on 291,231 cells

The largest of the three by a wide margin: **291,231 of 1,516,110 baked cells** across the
six Central Texas counties, counted with a stated rule and two independent predicate
controls. McLennan alone is at zero, which is consistent with McLennan being the one county
that passed its walk today.

Root cause is a **missed sibling**. `nodeFacetTier1Assemble.ts:328-330` writes a bare null
when there is no parcel ring and no usable CAD `land_acres`. On 2026-09-08 CTX-LEAVES built
earned-absence machinery for four leaves — `situsCity`, `situsZip`, `landUse`,
`landUseSource` — and `baseFacts.acreage` was never added to
`BAKE_OWNED_REQUIRED_LEAF_PATHS` (currently lines 470-475).

Extend the **same** machinery to it. When the ring is absent and
`conformantAcreageFromClaim(claim.landAcres)` returns null, write an earned absence rather
than a bare null, and add `baseFacts.acreage` to `BAKE_OWNED_REQUIRED_LEAF_PATHS` so
`assertRequiredLeafStatesEarned` enforces it going forward.

CTX-ACREAGE suggests `absent-verified`, reasoning that both the ring and the claim source
were genuinely checked and found unusable, which is a real positive determination rather
than a shrug. **Test that reasoning rather than inheriting it.** `absent-verified` is a
claim that something looked; per `ENFORCEMENT.md` it requires a verified-absence pair, and
writing it where nothing looked is a lie that passes every check. If the pair is not
genuinely present, `refused` is the honest state and you say so.

Do not add other leaves to the enforced set opportunistically. If you find more missed
siblings, name them in the close; adding them silently changes what the gate refuses.

## Defect 2 — a ruling that was made and never implemented

`verdictLayerServe.ts`'s `zoningVerdictFromCityLimits` returns `verdict: 'unmeasured'` at
two branches: the `cityLimits.status === 'unmeasured'` terminal branch, and the
unincorporated-with-undeclared-doctrine branch. `unmeasured` is not one of the four states
the leaf contract permits, so every such parcel fails `BP-CONTENT-01`.

The underlying cause is a deliberate, documented collapse of every `parcel_record` refusal
into a three-state `CityLimitsFact` type with no refusal variant. For Williamson's gold the
root is literally that **no `parcel_record` row exists** — part of the known instantiation
gap, structurally present in five of six counties.

**`_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` already ruled that this
exact leak must convert to `refused` at serve.** It was never implemented at this call
site. That is a decision that exists, is correct, and does nothing — the defect class this
whole operation is built to catch — and closing it is the point of this item.

Implement it at that specific site: convert `verdict: 'unmeasured'` to `verdict: 'refused'`
where it is assembled onto the `LayerAbsenceWire`, carrying the authority, `scopeSearched`
and basis fields already computed. **Never `absent-verified`** — nothing verified an
absence here; a missing `parcel_record` row is an unmeasured state and `refused` is what
honestly names it.

Keep the internal Doc-19 `LayerAbsenceVerdict` vocabulary unchanged for other internal
consumers. The conversion belongs at the serve boundary the four-state contract reads, which
is what the decision itself instructs.

`provenance.zoningSource` mirrors `zoning`'s verdict verbatim and inherits this fix. It is
not a fourth defect and must not be counted as one.

## Defect 3 — one row that is not a parcel

`48491:PRIVATE ROAD` — a literal string where a `prop_id` belongs, returning HTTP 400.
CTX-ACREAGE confirmed it a lineage artifact of the StratMap "leftover farm" family, verified
at both the landing and live-serving stores, one row, no collision. It rejected the graft
hypothesis and the walk-parsing-bug hypothesis with direct queries, and proved
`landing-import.mjs` is a byte-for-byte verbatim copy, ruling that path out with evidence.

Two parts, and the second matters more than the first:

**(a)** A data correction removing or re-classifying that single `cad_property` /
`landing_cad_property` row as a non-parcel StratMap feature rather than a taxable account.

**(b)** A `prop_id` validation guard rejecting non-numeric / non-R-prefixed values before
they reach `cad_property`, so a re-run of the StratMap ingest cannot reintroduce the class.

CTX-ACREAGE could not locate the adapter that produced the row on current `origin/main`
under `lib/cad-ingest` and reported that at the evidence level rather than guessing a file.
It may be a historical one-off matching the 2026-08-25 P-78 "leftover farm" pass. **Finding
it is part of your work.** If it genuinely does not exist in the tree, say so and put the
guard at the boundary that does exist — but establish that rather than assuming it.

Do not write the guard so permissively that it admits the value it exists to reject. Prove
it refuses `PRIVATE ROAD` specifically.

## Verify by violating

Each defect separately, both directions, exit codes read from the process not a pipe:

- a parcel with no ring and no usable `land_acres` earns its acreage absence; a parcel with
  a real acreage still bakes an unchanged `value`;
- a parcel whose `parcel_record` row is missing serves `refused` on `zoning`, and one with
  a real zoning verdict is unchanged;
- the `prop_id` guard rejects `PRIVATE ROAD` and admits a real id.

Confirm the 1.5M healthy cells bake identically. A diff that changes output for parcels
that already satisfy the contract is a regression, not a fix.

## What you must NOT do

Do not widen `BP-CONTENT-01`, add `unmeasured` to the permitted state set, or touch the
jurisdiction cohort sampler. All three live in `hauska-factory` and all three are correct;
CTX-ACREAGE changed none of them and neither do you.

Do not write `absent-verified` anywhere the verified-absence pair is not genuinely present.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the publish image from your merged main and runs the counties.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`.

## Close contract

Standard lane close JSON, plus:

- The absence state you chose for acreage and the evidence that its verified-absence pair
  is or is not genuinely present.
- Any further missed siblings found, named but not silently added.
- Confirmation that the `unmeasured` conversion is at the serve boundary only, with the
  internal vocabulary intact.
- Whether the StratMap adapter exists in the tree, and where the guard went.
- All violation runs, both directions, per defect.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs Williamson, which is the
county these three were found on.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-leaves2_cp1.json
  CP2: _inbox/2026-09-09_ctx-leaves2_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-leaves2_close.json
