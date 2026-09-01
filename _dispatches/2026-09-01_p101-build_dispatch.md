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

PLAN-ROW: P-101 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Implement the ladder re-cut (gates and copy)

---
id: 2026-08-31_p101_ladder_build_WDLL
title: WDLL — P-101: implement the ladder re-cut (gates and copy, seats split out)
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: legacy-design-tools (api-server routes, smartsite-mcp), hauska-map (property-explorer pricing surface)
plan_row: P-101
depends_on: _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md and its 2026-08-31 amendment, _inbox/2026-09-01_p101-scope_close.json
operator_go: 2026-08-31 (calls 1 and 2 ruled)
snapshot: scoped read-only against legacy-design-tools 26068a1e and hauska-map 8740558d
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-101 ladder build

Date: 2026-08-31  Status: open

Implements the ruled re-cut: Solo answers one parcel, Studio works a list. Prices do not change. Studio two seats is NOT in this card; it is P-102.

Do not re-derive the scope. `_inbox/2026-09-01_p101-scope_close.json` is the inventory and it corrected two claims in the ruling itself. Read it and the decision's amendment before starting.

## Operator rulings that bind this card

**Call 1, ruled 2026-08-31.** Gate `create_screen` and `add_to_screen`. Leave `list_screens` OPEN. The panel must still mount for a free connector user, so the connector keeps the top-of-funnel role the connector ruling assigned it, and a free user meets an upgrade prompt in context rather than meeting nothing. Nothing real is given away, because `list_screens` on a free account returns an empty list. The job Studio sells is building the list, not reading one you could never create.

**Call 2, ruled 2026-08-31.** Studio two seats is split out to P-102 and is not in this card. It is four coordinated server changes plus an unresolved Stripe product question, sitting behind a 409, with a unit test pinning the current behaviour. Bundling makes the fast half wait on the slow half, and two seats is the weakest line in the re-cut. The pitch is "Solo answers one parcel, Studio works a list", not "Studio gets a second seat".

## Done looks like

A free connector user can still open the Smart Site panel and see an empty screen list, and is refused with a stated reason the moment they try to create one or add to one. A Studio or Team user is not refused. The pricing surface renders four groups, one of which names the records package, and Studio is no longer badged "The packet". Every one of those statements is proven by a test that has been shown to fail when the behaviour is removed.

## Acceptance items

1. **Gate at the route, never as a fourth predicate.** The gate lives on the api-server screens routes. `POST /property-explorer/v1/screens` (`propertyExplorer.ts:546`) and `POST /property-explorer/v1/screens/:screenId/rows` (`:624`) gain a Studio gate in the second middleware position. `GET /screens` (`:574`) and `GET /screens/:screenId` (`:596`) do NOT, per call 1. There is no existing Studio middleware; one is created. It must call the api-server's own `subscriptionTierGrantsStudio`, never a new copy. | check: fail-then-pass per route; a free caller is refused on the two POSTs and served on the two GETs | grade: [ ]

2. **The MCP does not grow a parallel gate.** `create_screen` and `add_to_screen` inherit the route refusal. This works because the trusted-service path carries `X-PE-User-Id` and `resolvePeEntitlement` reads the real tier from `pe_user_entitlements` (`peServiceUserId.ts:28-39`); the tier is never taken from a header. The shipped precedent is `get_smart_site`, which has no local gate and is enforced upstream. If the lane concludes a local MCP refusal envelope is required for refusal quality, it STOPS and reports rather than adding one, because that is the connector-is-a-door ruling's territory. | check: no new `canRun*` call site in `tools.ts`; the refusal reaches the connector | grade: [ ]

3. **The three-copy finding is named, and not made worse.** `subscriptionTierGrantsStudio` exists three times: `peEntitlement.ts:52`, `smartsite-mcp/src/entitlement.ts:27`, `hauska-map entitlementClient.ts:90`. This card MUST NOT add a fourth. It is not required to fix the three, but it reports whether its change makes drift more or less likely. The existing test named "matches api-server predicate" (`smartsite-mcp/tests/entitlement.test.ts:101`) is internal consistency, not a divergence test: it asserts hardcoded booleans against its own local copy and the only occurrence of "api-server" in it is its own title. Do not cite it as coverage. | check: count of definitions before and after is 3 and 3 | grade: [ ]

4. **The gate must be falsifiable, which today it is not.** `smartsite-mcp/tests/tools.test.ts:23-29` defaults every caller to `subscriptionTier: "studio"`, so adding a gate to the screen tools produces ZERO failures in the current suite. Add free-tier cases per gated tool, in the both-directions shape already at `tools.test.ts:501-576`: free is refused AND `expect(mockCortexFetch).not.toHaveBeenCalled()`, Studio is allowed and reaches cortex. A gate that no test can fail is not shipped. | check: new tests fail when the gate is removed | grade: [ ]

5. **Invert the two tests that pin the defect, never delete them.** `propertyExplorerScreensStubs.test.ts:47-61` mocks the paid gate to 402 with a comment declaring a gate on these routes "is a defect". `propertyExplorerScreensLookup.test.ts:36-48` mocks `resolvePeEntitlement` to return undefined, so any in-handler tier read throws. Both are rewritten to assert the NEW behaviour and shown failing on the old. Adding a pass-through to the mock so the file goes green is refused: that converts a defect-pinning test into a test that checks nothing. | check: both files fail before the gate lands and pass after | grade: [ ]

6. **The pricing regroup is a CODE change, not a config edit.** `PricingModal.tsx:61-65` hand-writes the three groups as a literal array with hardcoded testids, and nothing anywhere iterates `PE_PRICING.groups`. Editing only `pricing.ts` ships a fourth group that renders nowhere while the existing modal test still passes. Both files change. Four groups render: Answer this parcel, Work a list of them (screens, owner data, records), Hand it off (site plan CAD, terrain), Work as a firm. | check: a rendered-output assertion on the new group, not a config assertion | grade: [ ]

7. **The records row is named for the shipped label.** Call it "Records request", matching `reports-catalog.ts:128-140`, not `dossier`. The two surfaces mean different things by `dossier`: on the MCP it is a Studio export kind, on PE it is the X-ray report engine (`reports-catalog.ts:91`) and is not studio-gated. Naming the row after the export kind would inherit that ambiguity into the price list. | check: the row label matches the workbench label | grade: [ ]

8. **The badge assertion must not go vacuous.** `pricing-modal.test.tsx:70` is `expect(html).toContain(PE_PRICING.studio.badge)`. If the badge is emptied to `""` rather than replaced, `toContain("")` passes on anything. It becomes a positive assertion on the new badge string plus a negative on `"The packet"`. | check: the test fails if the badge is emptied | grade: [ ]

9. **The free-user panel still mounts.** `create_screen` and `list_screens` are two of three `APP_HOST_TOOLS` (`mcp-app.ts:28-32`) that attach the panel resource. With call 1 applied, `list_screens` keeps the panel reachable for a free user. Prove it: a free-tier connector call to `list_screens` returns 200 with an empty list and the panel `_meta.ui` attached. | check: fail-then-pass; a free caller is not left with zero panel entry points | grade: [ ]

10. **The dead control gets an upgrade path.** `mcp-app.ts:627` renders "Add to screen" on every row unconditionally, and `mcp-app.ts` has no entitlement input at all. Either the button reflects entitlement, or the refusal renders in the panel using the existing `upgrade_required` path at `mcp-app.ts:2282-2286`. `UPGRADE_TO_OPEN` ("Upgrade to open this parcel", `mcp-app.ts:307`) is about a parcel and needs a sibling string for a screen; it is not reused verbatim. | check: a free user clicking it meets a stated reason, not a bare failure | grade: [ ]

11. **Stale marketing copy is corrected in the same card.** `ClaudeSyncTool.tsx:405` `CLAUDE_CAN_DO` promises every connected user "Screen a pasted list" and "Keep a screen" with no tier qualifier. Its own file header says a card naming a capability the product cannot deliver is a promise it cannot keep. Those rows are qualified or removed. | check: the existing guard test still passes and the copy no longer over-promises for free | grade: [ ]

12. **Prospect is doc-only here.** "Prospect" appears in zero shipped surfaces in either repo. If a monitoring row is added to the comparison table, `cells.comingSoon` is the mechanism and it currently has zero consumers, so it is a live dormant mechanism this card may feed. If a coming-soon row is added, check it against the three tests that assert "Coming soon" stays off the purchase surface (`reports-catalog.test.ts:17-28`, `claude-sync-tool.test.tsx:133`, `lock-matrix.test.tsx:360`) rather than discovering them in CI. | check: either no row and it is stated, or a row plus those three re-checked | grade: [ ]

13. **Verify by violation, both directions, verbatim.** Every check above is shown failing on a deliberate violation and passing on restore, with the failure text quoted. A check observed only passing has not been observed working. | check: the close carries both directions per item | grade: [ ]

## Explicitly not this card

Studio two seats, which is P-102. The three-copy consolidation of `subscriptionTierGrantsStudio`, which is named in item 3 but not fixed here. The site plan CAD sold-versus-enforced divergence (`pricing.ts:167-171` sells it Studio-only, the PE workbench catalog carries no `studioGated` flag on `SITEPLAN`, `SPPDF`, `SPDXF`, `SPIFC`), which predates this ruling and is routed as its own item. The retired-price seam retirement, which is P-103. Prices, which are locked and untouched.

## Leave behind

Declared at close per the contract, `none` being a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p101-build_cp1.json
  CP2: _inbox/2026-09-01_p101-build_cp2.json
  CLOSE: _inbox/2026-09-01_p101-build_close.json
