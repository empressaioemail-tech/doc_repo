CANON-PREAMBLE v6c68a963

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

---

# Seat: property

# Property seat state

Preserved from _STATE.md at the 2026-08-20 topology split. Write this file, not the generated combined view. Duplicate branch-protection paragraphs from the concurrent double write were removed; the surviving record is `_state/systems/STATE.md`. The Smart Markets block moved to `_state/markets/STATE.md`.

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-20. Property namespace. Restructured from _STATE.md; branch protection lives in _state/systems/STATE.md.**

**LANE B 2026-08-19 (waves 1 and 2 SHIPPED): TEMPLATE CITY BUILD IS RUNNING.** Read `_inbox/2026-08-19_template_city_lens_build_sheet.md` and OPS-17 rows **A-073 to A-079**. **THE CORRECTION THAT OPENED THIS: the G-18 register's `Not built` meant THIS SURFACE DOES NOT EXIST YET, and three agent handoffs hardened it into THIS SURFACE IS MEANT TO BE EMPTY.** Rulings: honest absence is now about SOURCES per region, not screens; the department roster matches live and GROWS; demo data on every lens with one `Demo` chip. Dashboards main **`1b271c8c3dc7bf361c09f00a095cc8e9022a6946`**, serving **`smartcity-dashboards-00025-mam` @100%**, suite **320/320**. Kit main **`17eccfade057c0f8a835b8731be834cd4b828166`**, vocabulary **143**, components **86**, Design project **482** files. **Registry: 11 domains, 10 carrying on `template-city`, 0 of 11 on `empty-city`; `patrol-vehicles` stays the single `ungranted` region on purpose** — granting everything deletes the state that proves ruling 1. Footer now carries two claims: `0 of 10 sources granted` beside `6 of 10 demonstrated with fixture records`. Connections register split to **70 rows / 5 addenda**. **WAVE 3 SHIPPED 2026-08-20** under OPS-17 rows **A-080 to A-084**. Every department lens now renders its domain. Conformance instrument is live and is the reason wave 3 grew: 92 scans over 23 surfaces DERIVED from route definitions (the hand-built list of 16 was 30% short), 0 unwaived nodes, 132 adjudicated, bound stated as JUDGED not CONTAINED. Vertosoft handoff bundle assembled at `P:/tmp/VPAT/vertosoft_handoff_2026-08-20/` (tagged PDFs + CSV, verified against an untagged control). Heads and serving revisions are in the L1/L2 closes, not restated here. **OPEN and dispatchable: G-103 shared tagged-PDF render service, G-104 SmartSite title + glyph fix.** Both compile through `scripts/dispatch.mjs`; a fabricated row refuses. The eleven domains reach no pixel; all fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`, so lens rendering merges one at a time. **Open, operator-owed:** Parks and Court are NOT expressible on the seam (four gate points, pinned to go red if a vendorless path appears) and four build-sheet lenses have no vendor — W2DEPT-F2; the register's disposition column is still hand-declared and can drift; the Design picker walk is STILL unrun. Closes `_inbox/2026-08-19_w2ds_close.json`, `_w2dept_close.json`, `_w2fix_close.json`.

**DRAIN STATUS 2026-08-17: L26 IDLE, QA/LAUNCH ON CURRENT MAP.** Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md` first. Decision `_decisions/2026-08-17_qa_launch_current_map.md`. GTM `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. 15-min scoreboard loop PID 85672 **dead**. Lease **L26** heartbeat PID **22096** still live (expires ~21:53

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: P-54 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# SERVE P-54 ownerFact scout then cortex

You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT Harris PBF. You MUST NOT mint absence. You MUST NOT flip `texas-rrc` or `mud-pid` to live. You MUST NOT write hauska-map. You MUST NOT occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools. You MUST NOT occupy P:/hauska-engine. You MUST NOT start P-52 rail. P-52 rail stays parked until contamination scout.

Plan row P-54. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/serve-p54 branch serve-p54 tracking origin/main. Create it if missing. Doc_repo writes: your _inbox JSON only. Do not paste a live ownerName or mailing address into those files. Redact PII.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 7 (P-54 owner). This lane is scout then cortex only. PE copy is planner follow-on. Pattern: `artifacts/api-server/src/lib/landUseFactRead.ts` (same CAD-year key family) and `artifacts/api-server/src/lib/boundaryEdgeFactRead.ts` (latest sibling field, LDT PR 456, serving). S7: `_inbox/2026-08-21_s2-family-scout_close.json` owner-fact HOLD-not-this-surface (anonymous inspect never shows owner; facets route strips owner-shaped keys). Q8 owner bind is UNMEASURED. Do not invent a percent.

## Mission

This card is scout then cortex read for S7 owner-fact only. PE copy is planner follow-on.

S7 is identified-session inspect only. Anonymous browse and anonymous inspect never render owner. Fabricated owner is never acceptable. Fail if identified is a CAD-roll bake (`cad-parcel-roll` / `cad_property` / `place_layer_snapshots`) presented as the atom.

The public cortex facets URL is currently GET-able with no credential. If you emit `ownerFact` on that anonymous GET, anonymous already sees owner before PE copies anything. The identified gate belongs on cortex, not only on PE.

### Scout (CP1, before any product edit)

Read the writer first. Do not occupy `P:/hauska-engine`. Prefer `P:/hauska-engine-worktrees/ident-p55` or `cover-p17-roads`: `packages/atoms/src/owner-fact-writer.ts` and `write-owner-fact-county.mjs` (railEngineBinding owner rail). Store-audit sample (2026-08-20, PII redacted) was `entity_id=48021:30985:2025` `access_policy=public-paid` `source_adapter=cad-property-owner-v1`. Audit grammar for this family is `{fips}:{prop_id}:{taxYear}`, same shape as `land-use-fact` and `cad-parcel-roll`. Confirm against the writer. Do not assume the audit row is gold.

Name both halves of the serve: what you query, and how it attaches to a parcel. Quote the writer-derived key and the SQL. Point SELECT or a bounded year/prefix-range. Never heap COUNT(*). Never treat the tax-year token as a parcel id. Never SELECT `cad-parcel-roll` / bake / `cad_property` as this field.

Name one live parcel that has a store hit. Prefer gold `48021:34137`. If gold has no `owner-fact`, say so and name the substitute you actually hit (audit historically used `48021:30985:2025`). Quote `entity_id`, `entity_type`, `taxYear` or equivalent body field, and `access_policy`. Redact `ownerName` / mailing. Confirmatory: a second parcel or a typed miss.

Name the identified vs anonymous gate from existing code. Facets already strips owner-shaped keys (`brokerageNodeFacets.ts`). Product-key gates exist elsewhere. Quote the mechanism you will reuse. Do not invent Clerk, Stripe, or a new identity system. If no identified signal exists on this route, STOP and file. Do not invent identity. leave_behind then is planner names the identified caller before PE.

If you cannot name a hit, STOP and file. Do not invent a fixture that the store does not have. Do not copy a CAD-roll owner name onto a miss.

### Cortex

Add a NEW sibling field on the cortex JSON ROOT, parallel to `boundaryEdgeFact`. Freeze the field name in CP1 (`ownerFact` unless the existing facets route already reserved another). Inspect later will prefer that field.

Anonymous (no identified signal): no owner body. Omit `ownerFact`, or return a typed refusal that names `source=owner-fact` with no `ownerName`, no mailing, no other PII. Identified: present from `owner-fact` only, or honest miss `code=atom-miss` that names the atom.

Never SELECT owner values from bake / `place_layer_snapshots` / `cad_property` / `cad-parcel-roll` / GIS `ParcelCardData.owner` for this field. `ATOMS_DATABASE_URL` only. Unconfigured: `atoms-store-not-configured`.

Present: `state` present|absent|refused, `source=owner-fact`, `boundAs`, `tried`, `entityId`, operator-visible non-PII fields the writer actually stores (`taxYear`). PII fields only on the identified path. Do not invent an owner. Zero hits on identified: typed refusal `code=atom-miss`.

Dual grammar on the parcel prefix plus tax-year only if the writer keys that way. Do not copy special-district `:sd:` picker. Do not copy pipeline `ANY(bare parcel)` (that misses `:{taxYear}`). Do not copy edge `:boundary:` prefix-range unless the writer uses it (it should not). Closest pattern is `landUseFactRead`.

Tests that fail if snapshots / CAD / `cad-parcel-roll` / GIS owner are served as this field. Tests that fail if an anonymous caller receives `ownerName` or mailing. Tests that pass on a fixture atom whose entity_id is `{parcel}:{taxYear}` for an identified caller. A boot-proof that the facets route wires the new field. A paired anonymous vs identified fixture.

L17: refuse probes use lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, scout parcel, entity_id (no PII), bind SQL, field name, identified-gate quote, CAD-roll is not the atom, what you will violate. CP2 after tests. CLOSE quotes files, tests, fixture, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy cortex-api; then a PE card with paired anonymous vs identified live probes. WDLL item 7 is not met until those paired smartsite.cloud probes. PE is not this lane. Do not start P-52.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-22_serve-p54_cp1.json
  CP2: _inbox/2026-08-22_serve-p54_cp2.json
  CLOSE: _inbox/2026-08-22_serve-p54_close.json
