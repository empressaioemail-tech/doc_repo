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

PLAN-ROW: P-98 (90_operations/OPS-16_texas_market_plan_of_record.md)

# P-98b: one billing-interval vocabulary, month/year, end to end

# Mission: close the P-98b billing-interval vocabulary split

## The defect

PR #574 on `empressaioemail-tech/legacy-design-tools` (branch `feat/p98b-account-entitlement`) fails CI with three assertions, all one root cause:

- `src/__tests__/pe-property-entitlement.test.ts:298` — AssertionError: Expected "month", Received "monthly"
- `src/lib/peEntitlement.responseBody.unit.test.ts:136` — Expected "month", Received "monthly"
- `src/lib/peEntitlement.responseBody.unit.test.ts:181` — Expected "year", Received "annual"

Established by the planner at source. Do not re-derive:

The server uses `month` / `year` end to end and deliberately so. `lib/db/drizzle/0092_pe_billing_interval.sql` carries `CHECK (billing_interval IS NULL OR billing_interval IN ('month','year'))` and its comment states the grammar mirrors Stripe's `month` / `year` recurring intervals. The type `PeBillingInterval` is `"month" | "year"`. `peBillingIntervalForPriceId` at `artifacts/api-server/src/lib/pePaywallStripe.ts:177` returns `isMonthly ? "month" : "year"`.

The sibling CLIENT lane on `empressaioemail-tech/hauska-map` (branch `feat/p98b-account-entitlement-client`, commit `04e0a75`, pushed but no PR opened) built its contract as `billingInterval: 'monthly'|'annual'|null` and gates the annual-upgrade rung on `if (e.billingInterval !== "monthly") return null;` in `apps/property-explorer/src/lib/nextAction.ts`.

So a translation layer somewhere on the server response path maps `month` to `monthly` and `year` to `annual` to match the client, while the server's own tests were written against Stripe's vocabulary.

## The ruling you implement

One vocabulary end to end: `month` / `year`, Stripe's own. No translation layer. Do not relitigate this. The rationale is that a silent mapping between two vocabularies for the same subject is the exact defect class this operation has already been bitten by, when a legacy access-policy pair had to be re-stamped out of 6.3 million rows.

The DB, the type, the wire, and the client all speak `month` / `year`.

## Tasks

1. Find the translation. In the legacy-design-tools worktree at `P:/seat-worktrees/property/legacy-design-tools-p98` (branch `feat/p98b-account-entitlement`), locate exactly where `month`/`year` becomes `monthly`/`annual` on the response path. Read `artifacts/api-server/src/lib/peEntitlement.ts` and the response-body builders. Report the file:line.

2. Remove it. The wire carries `month` / `year` / `null`. Do not widen a check to admit both. Do not add an alias. Delete the mapping.

3. Verify the tests express the source authority. The three failing assertions expect `month`/`year`, which is correct, so they should go green without editing them. If any test still expects `monthly`/`annual`, that test is wrong and gets corrected, but say so explicitly rather than quietly changing it.

4. Run the suite. In `artifacts/api-server`: `npx vitest run src/lib/peEntitlement.responseBody.unit.test.ts` and `npx tsc --noEmit -p tsconfig.json`. The DB-backed `pe-property-entitlement.test.ts` needs DATABASE_URL and will fail at import locally; report that as unmeasured-here rather than claiming it passes. Report exact counts before and after.

5. Fix the client half. In the hauska-map worktree at `P:/seat-worktrees/property/hauska-map-nextaction` (branch `feat/p98b-account-entitlement-client`): change the union to `'month'|'year'|null` and the nextAction gate from `!== "monthly"` to `!== "month"`. Update every test, fixture, and wire-body literal carrying the old strings. Start from `apps/property-explorer/src/lib/accountEntitlementClient.ts`, `apps/property-explorer/src/lib/nextAction.ts`, `apps/property-explorer/src/lib/account-entitlement-client.test.ts`, `apps/property-explorer/src/browse/settings-plan-rows.test.tsx`, `apps/property-explorer/src/browse/settings-next-action.test.tsx`. Grep the whole app for `monthly` and `annual` to catch any you were not told about, and report anything that is NOT billing-interval. There is unrelated annual PRICING copy which must NOT be touched.

6. Run the client suite. `npx vitest run` in `apps/property-explorer`. The baseline before the P-98b client work was 2194 tests. Report before and after counts.

7. Verify by violation, both directions. Break the gate (`!== "month"` to `=== "month"`) and confirm tests go red; restore and confirm green. Paste the verbatim failure text. A check observed only passing has not been observed working.

## Bounds

Do not touch `usePropertyEntitlement.ts` or `entitlementClient.ts` in hauska-map. The client lane deliberately left them alone and a test pins that.

Absent, zero, and unmeasured are three different states. A `null` interval must never be treated as monthly; that is the entire point of the column.

Every negative claim carries the command that produced it.

## Report back

File:line of the translation you removed. The full list of files changed in each repo with a one-line reason each. Before and after test counts for both suites with the exact command. The verbatim red output from the violation test in step 7. Anything that contradicts this brief. And explicitly, anything you chose not to change and why.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p98b-vocab_cp1.json
  CP2: _inbox/2026-09-01_p98b-vocab_cp2.json
  CLOSE: _inbox/2026-09-01_p98b-vocab_close.json
