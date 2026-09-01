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

PLAN-ROW: P-104 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Studio export gate unenforced on the web: site plan CAD and terrain

---
id: 2026-08-31_p104_studio_export_gate_leak_WDLL
title: WDLL — P-104: Studio export gate is unenforced on the web; Solo gets CAD and terrain
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: hauska-map (property-explorer BFF + workbench catalog), legacy-design-tools (entitlement contract)
plan_row: P-104
depends_on: _inbox/2026-09-01_p101-scope_close.json risk 4, _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md
operator_go: 2026-08-31 ("fix site plan cad to what it should be")
snapshot: verified read-only against hauska-map 8740558d and legacy-design-tools 26068a1e
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-104 the Studio export gate is unenforced on the web

Date: 2026-08-31  Status: open

The operator asked to fix site plan CAD "to what it should be". What it should be is Studio. Establishing that turned a suspected display inconsistency into a live revenue leak on two of Studio's four differentiators.

## What is actually true

**The web export gate admits Solo.** `apps/property-explorer/api/_lib/pe-site-plan-export-core.ts:430` is `if (input.entitlement.tier !== 'paid')` then 402. A Solo subscriber is `paid`. Solo therefore passes and receives site plan CAD.

**Terrain has the same gate.** The same file at :395-396 says "Same public-paid entitlement tier as terrain export — no new tier this wave." Terrain is equally unenforced on the web; its `studioGated: true` drives only `ReportsTool.tsx:300`, a client lock. A direct call skips it.

**The BFF cannot express Studio at all.** `apps/property-explorer/api/_lib/pe-entitlement.ts:3` declares `export type PeEntitlementTier = 'free' | 'paid'`. `git grep -nic "studio\|subscriptionTier" origin/main -- apps/property-explorer/api` exits 1: zero occurrences anywhere under the BFF.

**Site plan lacks even the cosmetic lock.** Every `engine: "terrain"` catalog entry carries `studioGated: true` (TERRAIN, TERGLB, TERIFC, TERDXF). Every `engine: "site-plan"` entry carries none (SITEPLAN, SPPDF, SPDXF, SPIFC). Four entries.

**Two comments assert the opposite, and both are wrong.** `artifacts/api-server/src/lib/peEntitlement.ts:29-30` and `artifacts/api-server/src/routes/propertyExplorer.ts:276-277` both state that the PE BFF gates Studio-only surfaces, naming CAD, terrain and owner data, on studio-or-team and never on bare tier. The server does supply `subscriptionTier` on `/entitlement`. The BFF never reads it.

**The MCP does enforce it.** `STUDIO_EXPORT_KINDS = ["siteplan","terrain","dossier"]` refuses a Solo caller at `tools.ts:851`. So the same capability is correctly gated on the connector and open on the web.

That last point is worth stating plainly because it inverts an assumption: the connector, which was ruled a free door, is the surface enforcing Studio correctly. The workbench is the leaky one.

## Why this is the worst shape in the doctrine

This is not an absent control. It is a control that is documented as working, has its input supplied, has a plausible-looking client artifact (`studioGated`), and enforces nothing. It passes review, answers "do we gate CAD" affirmatively, and cannot fail. Two independent comments would have satisfied any reader who checked by reading rather than by violating.

## Done looks like

A Solo subscriber calling the site plan export endpoint directly, with a valid session, is refused with a stated reason. So is the same call for terrain. A Studio or Team subscriber is served. Both statements are proven by a test shown failing when the gate is removed, and by a live probe on the deployed host, not by a source diff.

## Acceptance items

1. **The server computes the predicate; consumers do not re-implement it.** `/property-explorer/v1/entitlement` gains a computed boolean (`studioGranted`) derived from `subscriptionTierGrantsStudio` server-side. The BFF consumes the answer. Do NOT add a studio predicate to the BFF: three copies of `subscriptionTierGrantsStudio` already exist (`peEntitlement.ts:52`, `smartsite-mcp/entitlement.ts:27`, `entitlementClient.ts:90`) and a fourth in the BFF is the defect this card should not deepen. | check: definition count is 3 before and 3 after | grade: [ ]

2. **The BFF type is widened so the state is representable.** `PeEntitlementTier = 'free' | 'paid'` cannot express Studio, which is why the gate could not be written. Carry `studioGranted` through `PeEntitlementResult` and `PeEntitlementDetail`. An unrepresentable state gets made representable, never encoded in a sentinel. | check: `tsc` clean; the type carries the field | grade: [ ]

3. **Site plan export requires Studio.** `pe-site-plan-export-core.ts:430` requires `studioGranted`, not bare `paid`. A Solo caller gets 402 with a reason naming Studio, distinguishable from the free-tier 402. | check: fail-then-pass with a Solo fixture and a Studio fixture | grade: [ ]

4. **Terrain export requires Studio.** Same change, same file family. Do not fix site plan and leave terrain, which would make the leak harder to see rather than smaller. | check: fail-then-pass, Solo and Studio fixtures | grade: [ ]

5. **The dossier export path is checked, not assumed.** `dossier` is a Studio export kind on the MCP but on PE is the X-ray report engine (`reports-catalog.ts:91`), which is a Solo capability. Establish which the PE dossier export actually is before gating it, and state the answer. Gating the X-ray to Studio would be a regression that takes a Solo capability away. | check: the finding, with file:line, and the gate applied or explicitly not applied | grade: [ ]

6. **The four site-plan catalog entries get `studioGated: true`.** SITEPLAN, SPPDF, SPDXF, SPIFC. This is the UI half and it is NOT the fix; it is honesty in the surface once the server actually refuses. Landing this alone would be the defect this card exists to remove. | check: the four entries carry the flag and the locked UI renders | grade: [ ]

7. **Correct the two false comments in the same card.** `peEntitlement.ts:29-30` and `propertyExplorer.ts:276-277` describe a BFF gate that did not exist. Once items 1 to 4 land they become true; if any item is deferred, the comment is corrected to say what is actually enforced. A comment that describes an intended state as a present one is how this defect survived. | check: the comments match the shipped behaviour | grade: [ ]

8. **Prove by violation and on the deployed surface.** Every gate is shown refusing a Solo session and serving a Studio session, with verbatim output, plus a live probe against the deployed host with the deployment id recorded. Code-done is not customer-done. | check: both directions per gate, plus the live probe | grade: [ ]

9. **Report the exposure honestly.** State how long the leak has been live if it can be established from git history, and whether any Solo account actually exercised it. If that cannot be measured, say unmeasured rather than implying zero. Absent, zero, and unmeasured are three different states. | check: the statement, with its instrument or its absence named | grade: [ ]

## Explicitly not this card

Consolidating the three copies of `subscriptionTierGrantsStudio`, which is named but not fixed here. Owner data, which IS correctly enforced server-side at `brokerageNodeFacets.ts:210-215`. The screens gate, which is P-101. Studio seats, which is P-102. The retired-price seam, which is P-103. Any pricing change.

## Leave behind

Declared at close per the contract, `none` being a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p104-studiogate_cp1.json
  CP2: _inbox/2026-09-01_p104-studiogate_cp2.json
  CLOSE: _inbox/2026-09-01_p104-studiogate_close.json
