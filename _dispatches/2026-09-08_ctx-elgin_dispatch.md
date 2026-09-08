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

# Elgin zoning layer holds Bastrop at 26 and Travis at 1,680

## Mission - Elgin's zoning layer holds Bastrop at 26 parcels and Travis at 1,680

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. Everything you need is here. Do not go hunting through other threads,
and do not re-derive any of the numbers below - re-MEASURE them, which is different.

### Your seat and worktree

You are the **property seat**. `legacy-design-tools` is yours (`P:/legacy-design-tools`,
canonical worktree `P:/seat-worktrees/property/legacy-design-tools`). The zoning layer registry
lives at `lib/cad-ingest/src/txgio/zoning-layers.ts` in that repo.

Register your worktree in `_catalog/seat_register.json` before your first git write or the
seat-worktree-gate refuses you, and set **BOTH** `path` and `worktree` to the same value. An
entry carrying only `worktree` resolves to an empty repoPath and the gate refuses every git
write with `product_index_foreign`. That defect has been introduced three times this week.

`_catalog/seat_register.json` is a last-writer-wins shared blob with no per-seat namespace and
several doc_repo threads are live. `git pull` immediately before you edit it, `git add` it by
explicit pathspec, never `git add -A`. The gate compares your CURRENT branch to the REGISTERED
branch, so if you switch branches, update the registration in the same motion - and note the
ordering trap: switch the branch FIRST, then update the register, because the gate reads the
register file from disk before your command runs and will otherwise block the very commit that
would fix it.

Declare your snapshot in your first output: repository, branch, commit.

### What is blocked and why it matters

The P-124 pre-bake readiness gate refuses two of six Central Texas counties, on one rail:

    Bastrop  48021   zoningDistrict     26 parcels unaccounted
    Travis   48453   zoningDistrict  1,680 parcels unaccounted

Caldwell is already through to production. Hays, McLennan and Williamson are READY and are being
baked now. These two are the remainder, and they are blocked on your repo.

`unaccounted` is legitimate at rest and fatal at publish. That is deliberate and it is working.
The gate is not the problem and must not be adjusted.

### What is already established, so you do not redo it

Bastrop's 26 are ALL in Elgin. Verified: all 26 exist in `cad_property`, all 26 have a row in
`landing_parcel_jurisdiction` with `city_name='Elgin'`, `place_fips='23044'`,
`disposition='in-city'`, and all 26 carry `cityLimits = value` in `parcel_record_cell`. They are
real, in-city parcels. They are not orphans and not a key-shape artifact.

Elgin overall: 3,749 parcels in the landing table, of which **3,723 carry a real zoning district
value and 26 do not**. Both groups share the same `recorded_at` window (2026-09-03T08:20:53Z to
08:21:20Z), so this is not a late-arrival gap. The 26 sit inside city limits and outside every
polygon the staged layer contains.

The hauska-factory declaration `src/config/zoning-layer-completeness.mjs` explicitly HOLDS Elgin
rather than declaring it complete, and predicts exactly this:

    cellPct 68.73, arealPct 56.82, layerVintage "arcgis-live:elgin-tx:2026-08-14"
    "layer is materially incomplete ... Its unmatched parcels are not verifiably unzoned.
     Holds Bastrop county at 26 and Travis county at 1,680 until the layer is re-acquired."

### THE LEAD, and it is a good one

`lib/cad-ingest/src/txgio/zoning-layers.ts`, the `"elgin-tx"` entry, says in its own comment:

    Elgin_Zoning FeatureServer layer 0 covers the Bastrop-county-side cohort
    (CITY_LIMIT='ELGIN', ~3,220 parcels); the SAME FeatureServer's layer 1
    (~500 parcels, fips 48453 Travis-county-side sliver) is a NAMED FOLLOW-ON,
    out of this pass - not wired here.

    layerUrl:    .../Elgin_Zoning/FeatureServer/0
    layerWhere:  "CITY_LIMIT = 'ELGIN'"

So the incompleteness is not mysterious. There are two candidate mechanisms and they are not the
same fix:

**(a) Layer 1 was never wired.** That is a named, known follow-on and it is the obvious
explanation for Travis's 1,680 Travis-county-side parcels.

**(b) The layerWhere filter drops polygons that exist.** If some polygons carry a null,
differently-cased, or differently-spelled CITY_LIMIT value, the ingest never sees them even
though the layer holds them. That is the better candidate for Bastrop's 26, which are
Bastrop-county-side and should already be inside layer 0's remit.

Do not assume it is one of these. Establish which, with a count, before changing anything. It may
be both, and it may be neither - the 56.82 percent areal figure is large enough that a third
cause is possible.

### Live traffic against city GIS is AUTHORIZED for this mission

Querying the Elgin ArcGIS FeatureServer is normally reserved to the operator. It is authorized
here, for this endpoint, for this mission. Be a good citizen: use returnCountOnly for counts,
page with resultOffset, do not hammer it, and do not fan out to other jurisdictions' services on
your own initiative.

Nothing else about that reservation is lifted. No other government endpoint, no other city.

### What to do

**1. Measure the live layer before touching code.** For BOTH layer 0 and layer 1: total feature
count, count matching the current filter, and the distinct values of CITY_LIMIT with their
counts. That last one is the money query - if there are features whose CITY_LIMIT is null, or
'Elgin', or 'ELGIN ETJ', you have found mechanism (b) and the fix is a filter change rather than
an acquisition.

**2. Establish whether the live layer covers the 26.** The parcels are listed at the end of this
dispatch. Point-in-polygon them against what the live service actually returns. This is the
question the whole mission turns on: does Elgin's zoning layer, as it exists today, have an
answer for these parcels or not?

**3a. If the layer DOES cover them** - the defect is in our ingest (filter, layer selection, or
both). Fix it in `zoning-layers.ts`, re-run the zoning stamp for `elgin-tx`, dry-run first, and
re-measure. Wire layer 1 in the same pass if it is the Travis half, but keep the two changes
separately reviewable, because they are different claims about different cohorts.

**3b. If the layer genuinely DOES NOT cover them** - stop. That is a real-world gap in Elgin's
published GIS and it is not something you can fix in code. Report it with the evidence. The
honest options at that point are an operator conversation with the city, or a ruling that those
parcels carry a declared `refused` naming the layer gap - and that ruling is the OPERATOR'S, not
yours and not mine.

**4. Update the completeness declaration ONLY if the new measurement earns it.** That file lives
in hauska-factory (`src/config/zoning-layer-completeness.mjs`), which is NOT your repo. Do not
edit it. Report the new cellPct and arealPct to the integration seat (doc-repo-79) and it will
make that change, or not, based on what you measured.

### What you must NOT do

**Do not declare Elgin complete to clear the gate.** On a layer covering 56.82 percent of the
city's area, "no polygon here" cannot honestly mean "this parcel is unzoned." Declaring it
complete would convert a measurement gap into a false statement about the world, and it would do
so for 26 parcels in Bastrop and 1,680 in Travis simultaneously.

**Do not write `absent-verified` on the unmatched parcels.** That is a claim that something
looked and confirmed no zoning exists. Nothing looked. This is a standing ruling in this
operation and it is not reopenable.

**Do not write `refused` on them either, on your own authority.** `refused` is an earned state
and it may well turn out to be the right answer - but choosing it BECAUSE it clears the gate is
the same move as lowering the threshold, wearing better clothes. It needs the operator's ruling,
per 3b.

**Do not touch the readiness gate, the rail gate, DEFAULT_SCHED_RAIL_KEYS, or any threshold.**
If you believe the gate is wrong, say so with evidence and stop.

**Do not re-bake any county.** The bake sequence is the integration seat's and is running now.

**Do not deploy any service.** This is an ingest and config change; the deploy, if one is needed,
is separate and is the operator's.

### Verify by violating

Before reporting the fix as working: re-run the coverage measurement and confirm the count of
unmatched in-city Elgin parcels actually moves from 26 toward 0 - and confirm the instrument can
still report a non-zero, by running it against a city you have NOT fixed. A coverage number that
only ever reads 0 is not measuring coverage.

Also confirm you have not moved the number by changing what counts as "in-city." If the
denominator moved, you did not fix coverage, you redefined it. State both numerator and
denominator, before and after, in the same table.

### Report

CP1 after step 1, with the live counts and the distinct CITY_LIMIT values. That single result
probably decides the whole mission, so do not batch it into the close.

Close with: which mechanism it was, the diff, before/after numerator and denominator, the
point-in-polygon result for the 26, the new cellPct and arealPct for the integration seat, and a
`leave_behind` block.

If you cannot make the 26 resolve, say so plainly and do NOT close green. A mission that reports
success while Bastrop still refuses is worse than one that reports the gap, because the next
person will trust it.

### The 26 Bastrop parcels

    48021:108218  48021:115146  48021:115734  48021:117364  48021:11779
    48021:11958   48021:12043   48021:12965   48021:13058   48021:13151
    48021:133717  48021:14560   48021:15249   48021:15534   48021:15540
    48021:15657   48021:57003   48021:61258   48021:64562   48021:72637
    48021:77689   48021:84565   48021:84566   48021:8715709 48021:88089
    48021:99528

Travis's 1,680 are not enumerated here; derive them the same way once Bastrop's mechanism is
established, since they are very likely the layer-1 half and a different fix.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-08_ctx-elgin_cp1.json
  CP2: _inbox/2026-09-08_ctx-elgin_cp2.json
  CLOSE: _inbox/2026-09-08_ctx-elgin_close.json
