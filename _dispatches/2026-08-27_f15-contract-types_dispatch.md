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

PLAN-ROW: F-15 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-atom-contract

# F-15 contract types: the eight Track 2 types the Factory stages need, published from @empressaio/atom-contract as additive minor releases in stage order, each with a fixture and a test that fails on the violation it forbids; substrate seat, fresh lane

---
id: 2026-08-27_f15_contract_types_WDLL
title: WDLL — F-15 contract types: the eight Track 2 types the Factory stages need, published from @empressaio/atom-contract as additive minor releases in stage order, each with a fixture and a test that fails on the violation it forbids
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: hauska-atom-contract (publishes @empressaio/atom-contract); consumers hauska-factory (shims retired per release), hauska-engine, legacy-design-tools, hauska-mcp-server (pins ^1.x, must not break)
plan_row: F-15
depends_on: none; the request at _inbox/2026-08-27_f15_contract_types_request.md is this card's origin
operator_go: 2026-08-27 ("can we send this one to a fresh agent?")
law: 19_the_instrument_contract.md; _blueprint/10_model.md; 24_instrument_conformance_program.md Track 2; 80_adrs/adr_018_atom_contract_substrate_layer.md (the contract is Hauska substrate, peer to the SDK); 80_adrs/adr_028_contract_cross_vertical_adoption.md; 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md
snapshot: hauska-atom-contract main a3984e1 · npm @empressaio/atom-contract 1.22.0 published 2026-08-12, tags v1.19.0 to v1.22.0 · CI ci.yml, publish publish.yml (npm publish is autonomous) · src carries conformance/, testing/, property/, access-policy.types.test.ts, registry.ts · open PR #22 on seat/substrate "feat(identity): Lane G NodeId + accessPolicy emitter (1.21.0)", 1 ahead 3 behind main, that worktree 5 files dirty · the Factory's conformant writer runs on local shims under src/contract-shim/ with a CI check that fails the day the contract exports each type
owner: SUBSTRATE seat, a fresh lane. Worktree registered ahead of creation: P:/seat-worktrees/substrate/hauska-atom-contract-f15 on seat/substrate-f15 from origin/main. Never P:/seat-worktrees/substrate/hauska-atom-contract (seat/substrate, another lane's dirty work and PR #22). The property F-10 lane consumes each release by deleting a shim; the planner grades each release by reading npm and the fixture.
---

# WDLL: F-15 contract types

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

The conformant writer and every Factory stage after it are built against eight types the contract does not yet export. They run today on shims under `src/contract-shim/` in the Factory repository, each guarded by a CI check that fails the day the contract carries the type, so every release you publish retires a shim. The order below is the order the stages need them. A release is a published npm version with a fixture and a behavioural test; a merged PR is not a release.

## What exists (read, do not rebuild)

`src/` on main already carries `conformance/`, `testing/`, `property/`, a registry, and an `accessPolicy` type with its own test. PR #22 on `seat/substrate` carries a branded `NodeId` and an `accessPolicy` emitter from Lane G that were written for 1.21.0 and may or may not have shipped in it; read the PR and the published 1.22.0 tarball before writing 2.1, salvage what is there, and say in CP1 what shipped and what did not. The Factory's shim for each type is in `hauska-factory/src/contract-shim/`; match its shape where the shim is right and say where it is wrong, because the Factory lane will delete the shim the day you publish.

## Done looks like

Eight additive minor releases of `@empressaio/atom-contract`, in order, each exporting one type family, each with a conformance fixture under `src/conformance/` and a behavioural test that fails on the violation the type forbids, each recorded in `CHANGELOG.md` and by an amendment to ADR-028, none breaking a `^1.x` consumer (engine, LDT, MCP server compile and test green against the new version), and after each release the Factory lane's shim check goes red until it deletes that shim.

## Acceptance items

1. **Worktree, salvage, CP1.** Create `hauska-atom-contract-f15` from `origin/main`. Read PR #22 and the 1.22.0 tarball; list in CP1 which of the eight types already exist in any form, what shape the Factory's shims expect for each, and the release plan (version numbers in order). | check: CP1 with the per-type table | grade: [ ]

2. **2.1 branded `NodeId`** constructible only by `mint()` or a validating `parse()`; a raw string does not type-check as a node id; `parse` refuses the old `{fips}:{propId}` grammar as a node id and accepts it only as an alias key. Fixture plus a test that a string literal fails to compile (a type-level test) and that `parse("48021:34137")` refuses as a node id. | check: release published; fixture; failing-violation test | grade: [ ]

3. **2.10 alias as an atom** (`identity.alias` with a validity era, `validFrom`, `validTo` nullable) and lineage as edges (`mergedInto`, `dividedInto`, `unmerged`) with no lineage column on the node. Test: an alias without an era refuses; a node type with a `mergedInto` field does not compile. | check: release; fixture; tests | grade: [ ]

4. **2.2 provenance class** as a discriminated union with per-class required fields (the classes `19` names: Record, Derivation, Assertion, Absence, and any the model adds), so a class missing a required field does not compile and a runtime `parse` refuses it. | check: release; fixture per class; refusal test per missing field | grade: [ ]

5. **2.3 `derivesFrom` required on Derivation, absent on Record**, enforced by the type and by `parse`. Test: a Derivation without `derivesFrom` refuses; a Record with one refuses. | check: release; two refusal tests | grade: [ ]

6. **2.4 absence verdicts**: `absent-verified` requires a source that responded (source id plus response reference), `lookup-failed` requires the failure reference, `not-applicable` requires the rule that excludes; a bare verdict string does not compile. | check: release; three refusal tests | grade: [ ]

7. **2.8 supersession as an edge**; no `supersededBy` column exists to write; `SUPERSEDED_BY` is an edge type with `closedAt` on the prior window. Test: an atom type with a `supersededBy` field does not compile; a supersession without `closedAt` refuses. | check: release; tests | grade: [ ]

8. **2.11 selector predicate** as a closed discriminated union (spatial containment, set membership, equality, range, composition) with an exhaustive `match`; an unknown kind does not compile. Test: exhaustiveness (adding a kind without a handler fails the build); the Factory's four flood selectors (A, AE, AO, X) type-check against it. | check: release; tests; the flood fixture from `_inbox/2026-08-27_f16-f18-conformant_close.json` item 8 passes | grade: [ ]

9. **2.12 access as two fields**, `discoverability` and `entitlement`, alongside the existing `accessPolicy` string, which stays exported and mapped until F-10 migrates the column; neither field defaulted; `parse` refuses an atom carrying one without the other. The existing `access-policy.types.test.ts` stays green. | check: release; refusal test; existing test green | grade: [ ]

10. **Consumers do not break.** After each release, `hauska-engine`, `legacy-design-tools`, and `hauska-mcp-server` compile and test green against it on a branch that bumps the pin; report each result. A release that breaks a `^1.x` consumer is unpublished by a patch that restores compatibility, never by deleting the version. | check: three consumer CI runs per release cited by run id | grade: [ ]

11. **Records and handback.** Per release: version, tarball digest, fixture path, the test that fails on the violation, the CHANGELOG line, the ADR-028 amendment, and a note to the property F-10 lane naming the shim to delete. CP1 after item 1, CP2 after item 5, close at `_inbox/2026-08-27_f15-contract-types_close.json` with `leave_behind`. | check: artifacts; npm view per version | grade: [ ]

12. **Out of this card.** Any change to the Factory, engine, LDT, or MCP server code beyond the pin bump on a test branch; the `accessPolicy` column migration (F-10); the language-neutral spec (Phase 1 of the repo intent); anything that weakens a check to admit a value. | check: pathspec | grade: [ ]

## Do not

- Weaken a check to admit a value. Where a type can express the constraint, prefer the type over a runtime check.
- Publish a breaking change under a minor version, or delete a published version.
- Write into `P:/seat-worktrees/substrate/hauska-atom-contract` or onto `seat/substrate`; PR #22 is read, not continued.
- Ship a type the Factory shim contradicts without saying which is right and why.
- Report a release from a merged PR; `npm view` is the record.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_f15-contract-types_cp1.json
  CP2: _inbox/2026-08-27_f15-contract-types_cp2.json
  CLOSE: _inbox/2026-08-27_f15-contract-types_close.json
