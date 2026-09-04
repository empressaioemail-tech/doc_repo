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

PLAN-ROW: P-32 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# P-32 Feasibility Study — wave 1 (engine assembler)

## Mission: P-32 Feasibility Study — wave 1, engine-side assembler

Repo: `hauska-engine` only, primarily `packages/engine-core/src/site-plan/`. Isolated worktree from `origin/main`. This wave does not touch `hauska-map` (the PE leg, spec item 10, is wave 2 — it depends on this wave's item 4 and on the tier ruling, spec item 2, neither of which exist yet). Do not touch `hauska-mcp-server`.

**Source of truth: `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`.** This is the approved WDLL (amendments A1-A5, 2026-08-24) — 16 specced sections, 12 acceptance items. This mission carries only items 3-9 (the engine-side build) plus the two things that changed since that spec was written. Read the full spec before starting; this is a work-scoped excerpt, not a replacement.

### What changed since 2026-08-24 that this build must account for

1. **`render.ts` moved under P-90.** The assembler this spec calls "clone `dossier.ts`" (assembly architecture, spec §5 item 1) must be cloned from current `origin/main`, which now has `emitPdfSitePlan`'s `sheets: "drawing-only"` mode, the removed dead `CAPTURED` chip stub on the aerial header, and `liveViewUrl` threaded through both the dossier and flood-drainage content types. Use these, don't reintroduce what P-90 just removed.
2. **Section 10 (utilities) is less speculative.** A live `/api/who-serves` query path shipped 2026-08-25, returning CCN service territory with a mandatory honest "SERVICE-LETTER-REQUIRED" residual sentence when a commitment can't be asserted. Section 10 can read this now rather than shipping the fully speculative honest-absence-only version the spec assumed.

### Assembly architecture (spec §5, carried verbatim, decisive)

1. Engine-side sibling assembler, cloned from `dossier.ts` — not a rewrite. Tokens only from `template-tokens.ts`; primitives from `render.ts`'s shared export block; page numbers only through `buildFinePrint` + `SheetNumbering`; honest absence via chips + the `REASON` sentence map; no new color or type token.
2. Data access engine-side via `listPropertyAtomsByParcelNodeId()` and persisted artifacts — not the MCP property-atom-chain (3 of 16 entity types; widening it is substrate work this card must not silently absorb).
3. Narrative sections (spec §3 rows 2, 11) use the shipped Grok-first-with-deterministic-fallback pattern from the Property Brief generator. Every narrative sentence binds to a cited fact; ungrounded sentences are refused; fail closed to the deterministic skeleton when the LLM path is unavailable.
4. No report-run ledger inherited. Persist the artifact in the existing `parcel-terrain-model` artifacts map pattern.

### Section-by-section spec (spec §3 table — the 16 sections; this wave builds the model and assembler for all of them, sections 10-11 shipping their currently-honest-absence or query-time form)

Read the full table in the source spec. The load-bearing distinctions: sections 1,2,13,14,16 have no dedicated data field (composed/generated/superseded-by-design); sections 3-9,12,15 read sealed `ParcelFactSheet` data and persisted artifacts, `have` or `have (logic to build)` status; section 10 reads the live who-serves query path (see "what changed" above); section 11 ships the honest "not searched" shell + Smart Files mount, per the standing P-85 non-block.

### Acceptance items (spec §7, items 3-9 — this wave's actual scope)

3. **FeasibilityModel + section registry.** A model composed from the sealed `ParcelFactSheet`, persisted artifacts (site-plan set, flood JSON/PDF), and atom reads via `listPropertyAtomsByParcelNodeId()`; every section input carries an explicit honest-absence variant, matching `SitePlanModel`'s pattern. Check: unit-composable on a fixture with zero live calls; absent inputs produce typed absences, never defaults.
4. **Assembler emits the composed PDF** (sections 1-9, 13-15) in SHEET_STANDARD_v1 language: tokens only, `buildFinePrint` numbering, chips + REASON sentences for absences, one accent. Check: existing eleven styling regression tests pass unchanged; new assembler tests decode emitted bytes; a fixture with `countSitePlanSheets() > 3` numbers correctly.
5. **Superseded-run arbitration.** Given two runs of the same kind for one parcel where one failed, the composed document appends only the operative run and emits the data-quality note; the failed run is named as superseded. Verified by violation: a fixture that force-appends a failed run fails the test.
6. **Open-items table generation.** Every typed absence in the model emits exactly one prioritized row with a fixed-vocabulary action sentence; zero absences emits the "no open items" state, never an empty table. Check: a Whitetail-class fixture (no zoning, no setback rule, ETJ unresolved) reproduces the shape of Val's sheet 4.
7. **Narrative generator, grounded.** Verdict/bottom-line prose (section 2) via Grok-first with deterministic fallback; every sentence cites a model fact; the citation check is verified by violation (an injected uncited sentence fails); LLM unavailability yields the deterministic skeleton, not an error page. Check: fixture run with LLM disabled still emits a complete document.
8. **Utilities section, honest either way.** Reads the live who-serves query path (now shipped, see "what changed"): states the territory holder(s) + the SERVICE-LETTER-REQUIRED residual when it can't go further; the assembler must not block if that read fails, falling back to the fixed honest-absence sentence.
9. **HOA section shell + Smart Files mount.** Section renders "not searched" honestly with the mount affordance; when a user-mounted recorded doc exists, the synthesis is cite-or-decline over that document only. Check: no mounted doc yields the fixed sentence; a mounted CC&R fixture yields cited synthesis; an uncited synthesis sentence fails (same violation harness as item 7).

### Explicitly out of scope for this wave

Item 1 (plan row — already done, this dispatch). Item 2 (tier ruling — business decision, not this lane's to make; flag if the assembler needs a placement to build against, propose the spec's own default — composed = Studio — as a working assumption but do not treat it as ratified). Item 10 (PE leg, `hauska-map`, `pe-site-plan-export.ts?report=feasibility`, `ReportsTool` section) — wave 2, depends on this wave's item 4 landing plus item 2 being ruled. Item 11 (live probe on the deployed PE surface) — depends on item 10. Item 12 (close hygiene) — this wave's own close still applies to items 3-9 only. Section 11's full HOA/recorded-docs program (the P-85 reconciliation) — out of scope per the standing non-block; ship the shell only.

### Source

Full spec: `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`. Rulings: `_decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md`. Unfreeze: `_decisions/2026-09-03_p32_feasibility_unfrozen.md`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-04_p32-feasibility-wave1_cp1.json
  CP2: _inbox/2026-09-04_p32-feasibility-wave1_cp2.json
  CLOSE: _inbox/2026-09-04_p32-feasibility-wave1_close.json
