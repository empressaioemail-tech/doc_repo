CANON-PREAMBLE v664d6256

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
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

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: P-47 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# The zoning denominator

## Lane SS-W15 — The zoning denominator (P-47)

WORKING DIRECTORY: `/p/tmp/ss-w15-zoning-denominator` (branch `ss/w15-zoning-denominator`, off `origin/main` = `ea28ebb8`, which already carries lane SS-W13's merged refusal machinery). Remote `https://github.com/empressaioemail-tech/legacy-design-tools`. Scorers live at `artifacts/api-server/`.

### RUN THE FIRST TEST BEFORE YOU BUILD ANYTHING

Bastrop 48021 has **9,642 parcels carrying a `zoning_district`, of 63,357 total** — 15.22%. That is the number the ledger will read after the demotion.

The planner's hypothesis, offered as falsifiable and NOT as evidence: **15.22% is not a coverage failure, it is the wrong denominator.** Unincorporated Texas has no zoning authority, so there is nothing there to stamp. The incorporated share of a rural Texas county typically runs 15 to 25%, so 9,642 may be close to ALL of Bastrop's incorporated parcels — in which case Bastrop's zoning is genuinely near-complete and needs no remediation at all.

**Measure that first and report it before writing a scorer rule.** How many Bastrop parcels fall inside an incorporated city boundary in `tx_city_boundary`, and what share of THOSE carry a `zoning_district`. If the answer is near 100%, the remediation for Bastrop is nothing and the whole finding is a denominator defect. If it is not, we have learned something real. Either way the answer changes what gets built next, so do not build past it.

### Then: the denominator rule

A zoning coverage figure answers "of the parcels that SHOULD have zoning, how many do". Concretely:

- **Denominator**: parcels inside incorporated city boundaries, derived from `tx_city_boundary`.
- **Numerator**: those parcels carrying a `zoning_district`.
- **Everything outside a city boundary** is an ESTABLISHED ABSENCE with a named basis — "unincorporated, no zoning authority" — counted beside acquisition, never inside the fraction. Lane SS-W8 hit `mud 209/186` by counting absences inside; lane SS-W14 established the shape rule.

**THE TRAP, measured on six counties by lane SS-W13, do not walk into it.** The obvious shortcut — stamped parcels over parcels-carrying-a-`zoning_jurisdiction` — is a **tautology that returns exactly 100.00% for every wired county**, because the jurisdiction field is populated by the same stamp. The denominator must come from the boundary table. It must NEVER be derived from the stamp it measures.

Per DEV_PROCESS the counting rule travels with the figure. Lane SS-W12's capability (PR #438, OPEN, branch `ss/w12-scorer-harness`) makes a denominator spec REQUIRED, carrying both a machine kind and a prose counting rule. **Read that PR before you design.** This rule is meant to be declared into that capability, not built as another one-off scorer — the twelve-writers-three-scorers sprawl is exactly what P-47 exists to end. If #438 merges before you finish, rebase onto it; if it does not, write the rule so it lands cleanly on that contract and say so.

### The second half: what the console must then say

Only **23 city zoning layers are wired across 10 counties**, against **1,222 incorporated cities** in `tx_city_boundary`. So after this fix most counties are NOT MEASURABLE, which is different from measuring zero. SS-W13's `resolveStampFacetMeasurability` already refuses `no-zoning-column`, `no-wired-layer` and `stamp-not-rolled` and is merged on your base — build on it, do not duplicate it.

Operator ruling 4, accepted: **"measured, below bar" becomes its own class.** Today a county measured at 60% and a county never measured both render `not-yet`, and they are completely different states — one is a coverage gap, the other an instrument gap. This is the absent-covered versus absent-uncovered distinction already ruled for the parcel card, one level up. If the class needs a migration, coordinate with SS-W12 rather than shipping a second migration path.

### Rules

Push your branch immediately after the first commit. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Read-only against production databases; any write path proven by dry-run first, and `--apply` is not yours to run. Exit-bounded verification only: no watch, tail or serve left running. Keep the suite green.

### Report back

The Bastrop incorporated-parcel measurement FIRST, with its denominator and counting rule, and your verdict on the planner's hypothesis. Then the declared rule; what changes for the other 9 wired counties; how many counties become not-measurable and what the console shows for them; the PR URL; verbatim verification output.

---

## EVIDENCE DISCIPLINE (planner requirement)

Every number names WHICH OF THREE LAYERS it came from: WRITTEN (atoms in store), SCORED (`county_facet_coverage`), SERVED (what Smart Site shows a human). All three disagree independently, and on zoning they have disagreed in every direction: Travis is served and scored zero; Bastrop was scored 99.77% off a cell carrying its ENVELOPE facet's measurement, and measures 15.22%.

Every figure sourced from the ledger travels with its `computedAt`. Label each claim VERIFIED by you, INFERRED by you, or RELAYED from another lane. Do not restate another lane's magnitude as your own finding.

Find the cause, not a cause. The planner has been wrong repeatedly this week by stopping at the first mechanism that fit: footprints "not ingested" (they were, in 174 counties), then "the ledger is stale" (a recompute moves zero cells), then a flood vintage-fork strategy built on a rate whose denominator did not match its question. Lane SS-W13 found the zoning zeros had FOUR stacked causes. Assume yours has more than one until you have proven otherwise.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_ss-w15_cp1.json
  CP2: _inbox/2026-08-19_ss-w15_cp2.json
  CLOSE: _inbox/2026-08-19_ss-w15_close.json
