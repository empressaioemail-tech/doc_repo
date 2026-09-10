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

# A customer is told a StratMap figure came from the appraisal district

# CTX-B1 — a customer is told a StratMap figure came from the appraisal district

Repo: `legacy-design-tools`. This is the customer-facing defect of the whole program and
the operator ruled on it tonight.

## What a customer is served today, measured

Read on the production Smart Site MCP connector at **paid depth** on 2026-09-10 by the
third-party review (`_inbox/2026-09-10_ctx_third_party_review.md` section 3). Every prior
customer read in this program was at free tier, where all four dollar fields are gated, so
these are the first measurements of a paying customer's view.

    48309:184293  311 Austin Ave, Waco     market 6,506,490   source cad_property
                                                              valueBasis county-assessed
    48309:168429  100 Washington Ave, Waco market 27,845,140  same
    48055:32541   308 W San Antonio        market 1,884,580   same, and GENUINE CAD export

The McLennan values are StratMap-redistributed. The Caldwell one came from the appraisal
district's own export. **They are byte-identical in label.** StratMap origin appears only on
the structural fact's tier and on owner/land-use source vintage, never on the value.

The MCP tool description names the block "CAD-roll market/assessed/land/improvement value".
The web UI labels the row "McLennan County appraisal roll" and the module comment calls it
"A REAL, SOURCED FIGURE FROM THE COUNTY APPRAISAL DISTRICT".

The mechanism is two string constants. `cadRollValue.ts:13,16` define
`CAD_PROPERTY_SOURCE = "cad_property"` and `COUNTY_ASSESSED_VALUE_BASIS = "county-assessed"`;
`bakedDollar` (130-142) stamps them on every dollar. The roll loader reads `source_vintage`
(`joinIntegrityGate.ts:386`) and the slice type it hands the bake **has no field for it**
(`cadRollValue.ts:226-236`). The live overlay path does the same and discards the Factory
cell's `cellSource` (`cadRollFactFromParcelRecord.ts:60-97`, `parcelRecordCellRead.ts:251`).

**The tier is loaded and dropped at one seam.**

## Operator rulings you are implementing, 2026-09-10

**A1. Provenance is a label, not an absence.** Every served dollar carries the roll tier and
the source vintage it came from, and `valueBasis` is **derived from the tier** rather than
asserted by a constant. The declared non-account absence state is REJECTED — it would delete
values a customer can legitimately use if labelled, across all of McLennan.

**A3, the part that lives here.** A retired payload must bake `facets.base.situsAddress`
null, **or** the serve guard must exempt an earned retirement. Caldwell's `48055:1` still
returned 422 after last night's re-bake on the fixed pin, so the situs fix did not reach it.
Pick one of the two and say why.

## The design constraint that binds you

`cad_property.source_file` and `source_vintage` are **overwritten unconditionally** by the
merge's `ON CONFLICT` clause (`p78Merge.ts`, established by CTX-HAYS-SPLIT). On any county
applied more than once at one tax year, that column is the **last writer, not the lineage.**

So the tier must be derived from the declared vintage **together with a field StratMap
structurally cannot populate.** CTX-HAYS-SPLIT used `assessed_value IS NOT NULL` to recover
244 genuine CAD rows from under an overwritten StratMap tag; that is the known-good
discriminator. **Do not read the tier off `source_file`.**

## Paths that must all carry it

The review names four and they are not one change:

1. the bake path (`cadRollValue.ts`, `bakedDollar`);
2. the live overlay path (`cadRollFactFromParcelRecord.ts`, which discards `cellSource`);
3. the wire (`artifacts/smartsite-mcp/src/constants.ts:21`, `tool-honesty.ts:521-560`);
4. the UI label (`fact-sheet-resolver.ts:289-298`, `tax-valuation-paint.ts:24-31`).

A fix that reaches the bake and not the wire changes nothing a customer sees. **State which
of the four you reached and prove each one.**

## Verify by violating

**A StratMap-tier row must not serialise with `valueBasis: county-assessed`.** That is the
required test and it must be observed failing before it passes.

Also confirm a genuine CAD-export row still serialises unchanged — Caldwell `48055:32541` is
the known-good control from the measurement above.

## The thing this fix does NOT resolve, and you must not imply it does

The review found that **Travis serves a systematic tenfold gap** between its 2025
StratMap-derived row and its 2026 CAD row: 7,946,041 then 79,460,410; 8,612,027 then
86,153,487. Both present, same label. One of the two is wrong by an order of magnitude and
which is not decidable read-only.

Labelling makes the provenance honest. **It does not make a 10x-wrong number right.** The
operator has flagged that gap as a separate blocker. If your labelling work surfaces
anything about which side is wrong, report it; do not attempt to fix it here and do not
write a close implying the label change addresses it.

## What you must NOT do

Do not implement a non-account absence state. It was ruled against tonight.

Do not weaken any serve guard.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat owns every execution and deploy.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`.

## Close contract

Standard lane close JSON, plus:

- Which of the four paths you reached, each proven separately.
- The discriminator you used to derive the tier, and why it survives the `ON CONFLICT`
  overwrite.
- Which A3 option you took for the retired-situs case and why.
- The violation runs: StratMap row refusing `county-assessed`, CAD row unchanged.
- Anything you learned about the Travis 10x gap, reported not fixed.
- `leave_behind`.

Report the merge commit. The integration seat pins the factory to it and rebuilds.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-b1_cp1.json
  CP2: _inbox/2026-09-10_ctx-b1_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-b1_close.json
