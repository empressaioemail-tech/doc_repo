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

PLAN-ROW: P-91 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Root-cause and fix the radius-search hang; a candidate cause the isolation did not name

# Mission — root-cause and fix the radius-search hang

`place/radius-search` is SHIPPED AND NON-FUNCTIONAL. Valid params hang until Cloud
Run kills the request at 300s. The MCP planner isolated it rigorously and did not
root-cause it, which was the right place to stop.

**This card carries a candidate root cause the isolation did not name. Verify it
against the live catalog before acting on it. It is a hypothesis from reading the
write path, not a measurement.**

## What is already established, do not re-derive

Route is reachable: `?lat=notanumber` returns HTTP 400 in 0.174s, so the router
resolves and the zod parse runs. Not auth: `street-search` returns hits with the
same Bearer token in the same session. Not a cold start: the 400 on the same route
is instant. Cloud Run's own log, read from the authoritative record:
`status=504 latency=300.000291573s`.

Two mechanisms were offered and neither was separable from outside: an unindexed
candidate scan, or a lock/connection wait. Both services currently run **UNPOOLED**
under the Neon mitigation, so connection behaviour is not in its normal
configuration and the lock/wait arm is confounded until that is cured.

## The candidate root cause

`artifacts/api-server/src/lib/txgioRadiusSearch.ts:222` builds one query:

```
SELECT county_fips, prop_id, situs_address, geometry, west_lng, south_lat, east_lng, north_lat
FROM txgio_parcel
WHERE county_fips IN (<list>) AND west_lng <= ? AND east_lng >= ?
                              AND south_lat <= ? AND north_lat >= ?
LIMIT <candidate ceiling + 1>
```

Three things about it, each verifiable:

**1. The county filter constrains nothing.** `texasCountyFipsList()`
(`txgioAddressNormalize.ts:682`) is `for (let n = 1; n <= 507; n += 2)`, which is
**all 254 Texas counties**. The only index on the table is
`txgio_parcel_prop_idx (county_fips, prop_id)`, and an IN list containing every
value of the leading column has zero selectivity. The one index that exists cannot
help this query.

**2. `txgio_parcel` has no bbox index, and four sibling tables do.** The schema
carries `tx_city_boundary_bbox_idx`, `tx_county_boundary_bbox_idx`,
`tx_fema_nfhl_flood_zone_bbox_idx` and `tx_utility_territory_staging_bbox_idx`, all
`btree (west_lng, south_lat, east_lng, north_lat)`. The exact index this query
needs exists on four smaller tables and is **absent from the largest one**.

**3. It selects `geometry`.** Every candidate row detoasts its ring.

**The size-independence CONFIRMS this rather than ruling it out, and that is the
part worth reading twice.** The defect card treats "50 ft hangs exactly as 500 ft"
as evidence against a volume explanation. Under a full scan it is the *predicted*
result: neither radius comes near the candidate ceiling, so `LIMIT` never
short-circuits, and both scan the entire table for the same cost. A geometry-volume
explanation about the *result set* is correctly rejected. The cost is in the
**scan**, not the result.

## Verify before you fix

**The above was read from `lib/db/src/__tests__/__fixtures__/schema.sql.template`,
which is a TEST FIXTURE and is known to drift from the live catalog in this repo.**
It is a proxy, not the authoritative record.

1. Query the **live catalog** (`pg_indexes` on the serving database) for every
   index on `txgio_parcel`. The template's claim of exactly one index is not
   evidence about production.
2. Run `EXPLAIN (ANALYZE, BUFFERS)` on the candidate query with the real
   parameters from the hung request (lat 30.10592, lng -97.32528, radiusFt 500).
   **Pre-registered falsifier: this should show a Seq Scan on `txgio_parcel` over
   millions of rows. If it shows an Index Scan, this hypothesis is WRONG and the
   lock/wait arm is back. Report that outcome as plainly as a confirmation.**
3. Sample `pg_stat_activity` while a request is hung, which the defect card names
   and nobody has run. It separates a scan (active, high buffer reads) from a wait
   (`wait_event_type` populated) and costs one probe.

Do all three before changing anything. If 2 and 3 disagree, 2 wins for a scan and 3
wins for a wait; if both are ambiguous, say so rather than picking.

## The fix, once confirmed

Two candidates. **Recommend one with reasoning; they are not exclusive.**

**A. Add the bbox index**, matching the four siblings exactly:
`btree (west_lng, south_lat, east_lng, north_lat)`. Smallest change, consistent
with existing convention, and the absence looks like an omission rather than a
decision. Note that four independent range predicates on separate columns use a
btree composite only on its leading column, so measure the improvement, do not
assume it.

**B. Narrow the county first.** A radius search at a lat/lng knows its county.
Resolve it against `tx_county_boundary` (which HAS its bbox index), then constrain
`county_fips` to the one or two counties that matter, which makes the existing
`(county_fips, prop_id)` index selective. Architecturally right: a 50-foot radius
in Bastrop should never consider Amarillo.

B is the better answer if A alone does not produce an index scan, and B is correct
regardless of A.

**Do not raise the Cloud Run timeout. Do not widen the candidate ceiling.** Both
convert a broken query into a slow one that still fails.

## Definition of done

`GET /place/radius-search?lat=30.10592&lng=-97.32528&radiusFt=500` returns a
correct body in a time you state, against the live service, with the plan attached.
A shipped-and-non-functional function becoming shipped-and-slow is not done.

Re-check `radiusFt=50` too: under the current mechanism both hang, and under a
correct fix both must return.

## Do not

- Do not raise the request timeout or the candidate ceiling.
- Do not read the schema template as the live catalog.
- Do not act on the index hypothesis before EXPLAIN confirms it.
- Do not add an index to a production table without a run record naming it.
- Do not touch the Neon pooling posture; that is a separate live incident.
- Do not touch any repo other than the registered LDT worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_radius-hang_cp1.json
  CP2: _inbox/2026-08-31_radius-hang_cp2.json
  CLOSE: _inbox/2026-08-31_radius-hang_close.json
