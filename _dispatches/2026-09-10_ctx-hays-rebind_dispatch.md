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

# Bind Hays geometry to the parcel it belongs to

# CTX-HAYS-REBIND — bind Hays geometry to the parcel it belongs to

repo: legacy-design-tools

Operator ruling 2026-09-10: fix Hays without discarding the ~92,000 correct records. This is a
rebind, not a withdrawal. Every parcel keeps its money and gets its own geometry.

## What CTX-HAYS-KEY established, and you should re-derive rather than trust

The Hays key was never unstable. Two different published identifiers occupy one column.

TxGIO publishes Hays parcels under the county's **QuickRefID** with the leading `R` stripped.
`cad_property` is keyed on the county's **PropertyID**. The 2026-08-25 P-78 StratMap merge
upserted TxGIO-keyed rows on `(county_fips, prop_id, tax_year)` with `situsAddress`,
`situsCity`, `situsZip` and `ownerName` in `COALESCE_FIELDS`, so wherever the two bare-numeric
namespaces collided the incoming row's address and owner overwrote the real account's.
`assessed_value` survived only because the StratMap adapter hardcodes it null.

Worked example: Hays CAD account **40138** carries QuickRefID **R26199**, and `txgio_parcel`
prop_id 26199 is that parcel. That is why `48209:40138` resolves as a San Marcos address and
draws a Buda polygon.

Discriminating evidence: all **116,421 of 116,421** Hays 2025 rows carry TxGIO's situs
byte-identically, where Caldwell's known-good join agrees on **15 of 24,722**. A hundred percent
is a copy, not an agreement. Renumbering was ruled out (rows P-78 never touched agree 99.95%)
and resplit was ruled out (99.37% are still on the current roll). Williamson has the identical
two-namespace structure and zero contamination because its namespaces are lexically disjoint.

## What is already in the store, verified by the integration seat

    txgio_parcel  48209   131,734 rows   geo_id populated on 130,246   115,533 distinct
    txgio_parcel  48209   sample: prop_id 26199 -> geo_id 11-2520-0000-03100-2
    cad_property          columns are prop_id and property_use_code ONLY

So the join target exists and is populated. The appraisal-side key does not exist in the store
because the Orion parser reads PropertyID and drops PropertyNumber and QuickRefID, which the
source publishes in adjacent columns.

CTX-HAYS-KEY reports that keying PropertyNumber to `geo_id` gives 94.35% situs agreement and is
collision-free, and that PropertyNumber and the QuickRefID stem select the same parcel on
115,035 rows and a different one on zero. Today's key is right 0.07% of the time. **Re-derive
those numbers.** They decide the build.

## The trap that would look like success

Re-declaring Hays to tax year 2025 scores **0.012%** owner agreement against 2026, which blocks,
and **over 99%** against the contaminated 2025, which would write `pass` and lift the gate now
holding Hays shut. Do not take that path, and if you find yourself reaching for a vintage change
to make a number go green, stop.

## What to build

Enough to rebind Hays geometry to the correct parcel:

- a column on `cad_property` for the property number, with a migration;
- the parser change that stops discarding it;
- the join change so Hays binds geometry on that key rather than prop_id to prop_id.

Say whether the source file is still available to re-parse or whether re-acquisition is needed.
CTX-HAYS established that `hayscad.com` returns 200 to a plain request carrying a browser
User-Agent and 403 with none; that is a bot block, not the credential trap the standing
decisions warn about.

**Scope the change to Hays or make it general, and justify which.** Williamson has the same
two-namespace structure with no contamination, so a general change alters a county that is
currently correct. That is a real risk and it is your call to argue, not to assume.

## Two things you inherit

**CTX-B5 exists and was never merged.** Registered worktree, a substantive CP1, roughly 1,083
uncommitted insertions, on a base two merges stale. Its subject is the retirement basis:
`buildRecordRetirement` fires on absence from the declared vintage with no check for any other
vintage, and emits a basis asserting the account was "split, merged, renumbered or removed" for
roughly 37,813 Hays prop_ids that were never on a roll. Read that work before rewriting it. Take
what is right, rebase what survives, and say plainly what you discarded and why.

**Caldwell `48055:1` is not a genuine retirement.** CTX-HAYS-KEY found it is roughly 120
unattributed StratMap polygons on a placeholder key, and that four prior artifacts cite it as a
control for the *meaning* of retirement when it only ever validated the *branch*. Do not inherit
that citation. If you need a meaning-level control, find a real one and name it.

## Verify by violating

Account 40138 must bind the polygon of QuickRefID R26199's parcel, and must fail to before your
change. Name the real prop_ids you use. A county that is currently correct, Williamson, must be
provably unchanged if your change reaches it.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. No deploys,
no Cloud Build, no Cloud Run job, no bake, publish or walk. The integration seat owns every
execution. Five other counties are moving to production while you work and nothing you do may
touch their path.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the re-derived crosswalk numbers and whether they match
CTX-HAYS-KEY's; whether the source is re-parseable or needs re-acquisition; the Hays-only versus
general decision with its argument; what you took from CTX-B5 and what you discarded; violation
runs with real prop_ids including the Williamson no-change proof; and `leave_behind`. Push and
open a PR. Do not merge. Report the PR number and head SHA.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-hays-rebind_cp1.json
  CP2: _inbox/2026-09-10_ctx-hays-rebind_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-hays-rebind_close.json
