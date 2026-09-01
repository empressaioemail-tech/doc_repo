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

PLAN-ROW: F-15, F-06 (90_operations/OPS-19_factory_plan_of_record.md)
repo: legacy-design-tools

# LDT contract rename: legacy-design-tools moves from the vendored @hauska/atom-contract 1.6.0 tarball to @empressaio/atom-contract ^1.30.0 across six manifests and 73 import sites, dual pin first, package by package, old name retired by a CI check; property seat, fresh lane

---
id: 2026-08-27_ldt_contract_rename_WDLL
title: WDLL — LDT contract rename: legacy-design-tools moves from the vendored @hauska/atom-contract 1.6.0 tarball to the published @empressaio/atom-contract ^1.30.0, and the old name is retired by decline
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: legacy-design-tools (six package.json dependents, 73 import sites, four vendored tarballs); consumers of its serving process (cortex-api canary on close)
plan_row: F-15 (consumer half), F-06 (bakes typed against Track 2)
depends_on: @empressaio/atom-contract 1.30.0 on npm (F-15 closed partial 2026-08-27); the publish lane's LDT PR (conformant bake CLIs, serveGuards) merged first so this lane starts from that main
operator_go: 2026-08-27 ("give me the rename handoff prompt")
law: 80_adrs/adr_018_atom_contract_substrate_layer.md; _decisions/2026-07-04_branding_canon_hauska_substrate_only.md (the 2026-07-06 rename); _catalog/repo_intents.md (atom contract is @empressaio/atom-contract; the older name is frozen at 1.6.1 and appears in historical records only); ENFORCEMENT.md (retirement proven by decline; never widen a check; no fallbacks)
snapshot: legacy-design-tools origin/main b53a0571 · @hauska/atom-contract pinned by file: to vendor/hauska-atom-contract-1.6.0.tgz in artifacts/api-server, lib/engine-core, lib/knowledge-atoms, lib/portal-ui, and ^1.1.0 in lib/submission-classifier and scripts; vendor/ holds 1.2.0, 1.4.0, 1.5.0, 1.6.0 tarballs; 73 files import from @hauska/atom-contract; zero import from @empressaio/atom-contract · @empressaio/atom-contract 1.30.0 on npm with Track 2 types 2.1 to 2.12 · precedent: hauska-mcp-server dual-pinned @empressaio ^1.21.0 beside @hauska ^1.6.1 during its move
owner: property seat, a fresh lane (no sub-agents needed unless the codemod is fanned; then AGENT_CONTRACT section 1). Worktree registered ahead of creation: P:/seat-worktrees/property/legacy-design-tools-rename on seat/property-rename from origin/main, taken after the publish lane's LDT PR merges. Never the primary LDT worktree (P-85), legacy-design-tools-mcp (P-86), or legacy-design-tools-publish. Deploys planner-owned on the operator's go.
---

# WDLL: the LDT contract rename

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

The atom contract was renamed to `@empressaio/atom-contract` on 2026-07-06 and has shipped sixteen minors since, the last eight of which carry the Track 2 types the Factory is built on. `legacy-design-tools` never moved: it still installs a vendored `@hauska/atom-contract` 1.6.0 tarball in four packages and pins `^1.1.0` in two more, across 73 import sites. Everything LDT serves, and the Factory's publish bakes that live in LDT, is therefore typed against a contract eight months of decisions old. This card moves LDT to the current package and retires the old name so it cannot come back.

## Done looks like

Every LDT package depends on `@empressaio/atom-contract ^1.30.0` and none on `@hauska/atom-contract`; the four tarballs are gone from `vendor/`; a CI check fails if the old name reappears in any manifest or import; the conformant bake CLIs and `serveGuards` are typed against the Track 2 types (`AbsenceVerdict`, `AccessPair`, `ProvenanceClass`, `Derivation`) so the walk rule `BP-CONFORMANT-01` grades on types rather than shape strings; typecheck, tests, and the schema-fixture drift check are green; cortex-api is redeployed by canary on the operator's go and the product-surface smoke passes.

## Acceptance items

1. **Inventory before any edit.** From `origin/main` after the publish lane's LDT PR: every import site (73 at the snapshot) by file, package, and imported symbol; every symbol classified as identical in 1.30.0, renamed, removed, or stricter; the six manifests; the four tarballs; anything that reads the tarball path at build time. Filed as CP1. No code before the table. | check: CP1 table with counts that sum to the grep | grade: [ ]

2. **Dual pin, no behaviour change.** One PR that adds `@empressaio/atom-contract ^1.30.0` beside the existing pin in all six manifests, changes no import, and is green on CI. This is the MCP server precedent and it proves the install path before any type moves. | check: PR merged on the conclusion string SUCCESS; `pnpm ls` shows both | grade: [ ]

3. **Migrate imports package by package.** For each of the six packages, one PR moves its imports to `@empressaio/atom-contract`: identical symbols by codemod; renamed symbols by their new name; removed or stricter symbols adapted at the call site to the 1.30.0 semantics and never by a local shim, an `any` cast, a widened check, or a fallback. Where 1.30.0 refuses a value 1.6.0 accepted, the call site refuses too and the refusal is a named test. Order: `lib/knowledge-atoms`, `lib/engine-core`, `lib/submission-classifier`, `scripts`, `lib/portal-ui`, `artifacts/api-server` last because it is the serving process. | check: six merged PRs; each green on typecheck, tests, and `test:fixture:drift`; refusal tests named | grade: [ ]

4. **The publish bakes and the serve guards type against Track 2.** `nodeFacetBakeTier1ConformantCli`, `nodeFacetBakeTier2ConformantCli`, and `serveGuards` import `AbsenceVerdict`, `AccessPair`, `ProvenanceClass`, and `Derivation` from the contract; `BP-CONFORMANT-01` in the walk checks the contract type, not a `shape` string; the two-field access check refuses an atom missing either field by the contract's own `parse`. | check: types imported; a fixture with a string-only verdict fails typecheck; the walk rule reads the type | grade: [ ]

5. **Retire the old name by decline.** Remove the `@hauska/atom-contract` pins and delete the four tarballs from `vendor/`; add a CI check that greps every `package.json` and every `.ts`, `.tsx`, `.mjs` for `@hauska/atom-contract` and fails on any hit; prove it by violation (a branch that re-adds one import must go red). | check: tarballs gone; CI check exists and was seen failing | grade: [ ]

6. **Deploy and smoke.** cortex-api built from the merged main and deployed by canary at zero traffic, smoked (`/api/healthz`, the county-ledger GET, facets for gold `48021:34137`), shifted on the operator's go, `node scripts/product-surface-smoke.mjs` run and its result filed whatever it is (the three pre-existing `envelope.sanity` fails are known). | check: revision by digest; smoke artifact | grade: [ ]

7. **Close.** `_inbox/2026-08-27_ldt-contract-rename_close.json` with the inventory, the six PRs, the symbol classification with its adaptations, the CI check, the serving revision, `leave_behind`. | check: artifact | grade: [ ]

8. **Out of this card.** Any change to the contract itself (substrate); the Factory repository; the atoms-store column migration for two-field access (F-10); P-85 and P-86 code paths beyond the import lines they contain. | check: pathspec | grade: [ ]

## Do not

- Write a shim, an `any` cast, or a fallback to make a 1.30.0 type accept a 1.6.0 value. The call site adapts or refuses.
- Change behaviour in the dual-pin PR.
- Delete the tarballs before the last import moves (repoint first, then retire).
- Merge on red typecheck, tests, or fixture drift.
- Touch the other three LDT worktrees or their branches.
- Deploy without the operator's go; the serving process is production.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_ldt-contract-rename_cp1.json
  CP2: _inbox/2026-08-27_ldt-contract-rename_cp2.json
  CLOSE: _inbox/2026-08-27_ldt-contract-rename_close.json
