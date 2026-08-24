CANON-PREAMBLE v78ed9c62

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

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-23T18:35

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: P-60 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# P-60 hover fragment fix: feature-state highlight, never tile-fragment geometry

## Mission: hover/highlight must paint the whole lot, never a tile fragment

Authorization: you are working on Nick's own repo (empressaioemail-tech/hauska-map) with the operator's go, plan row P-60. You may spawn subagents per AGENT_CONTRACT section 1; subagents produce artifacts and do not commit or touch git; verification never delegates below you. If an agent chain tries to re-delegate, supervise the deepest worker directly instead.

### Defect (operator-graded FAIL, measured 2026-08-24T22:02Z live)

The PE hover highlight draws `hits[0].geometry` from `queryRenderedFeatures` into the `hauska-ovl-hover-highlight` GeoJSON source (`packages/map-renderer/src/map-renderer.js` ~L378-386). For vector tiles that geometry is the PER-TILE CLIPPED FRAGMENT of the parcel, cut at the z16 seam plus ~10 m tippecanoe buffer. The Simsbrook block (operator's grade block) sits on a z16 seam cross: vertical seam lng -97.6354980 (parallel to Simsbrook Dr through the front yards), horizontal seam lat 30.4581444. Measured on the live site: 48453:280233 and 48453:280234 exist as FOUR fragments each, 280236/280239/280237 as TWO; hovering 280236 at lot center draws a 30 m box where the lot is 38 m wide. The cut lines are constant across every lot the seam crosses, so the operator sees a straight pattern traceable across properties. The cursor's side of the seam selects which fragment draws (the known "different shapes depending on entry edge"). The pale inspected fill is feature-state and renders across ALL fragments (full lot), so blue box vs pale fill mismatch on the same lot. Evidence: `_inbox/2026-08-24_stacked_paint_diagnosis.md` (Round 2), `_scratch/setback-serve-wave.md` 22:10Z GROUND-TRUTH, `_inbox/2026-08-24_p60_parcel_ring_composer_inventory.md` addendum.

The bake is exonerated (archive has each lot whole per tile, county-true to <=1.5 m, unchanged since 08-10). This is a render-path fix only.

### Fix

1. In `packages/map-renderer/src/map/parcel-tiles.js`: add a `hover` feature-state branch to the tile FILL and LINE paint expressions (visuals matching the current hover look: fill `#7dd3fc` at ~0.18, stroke `#7dd3fc` ~2px; keep precedence below `subject`/`inspected`/`countyRing` so those states win).
2. In `packages/map-renderer/src/map-renderer.js`: on mousemove, set feature-state `{hover:true}` on the picked promoted id and clear the previously hovered id when it changes (track one hovered id, same pattern as subject/inspected tracking); clear on a miss AND on canvas mouseleave (the current handler only clears on a mousemove miss, so the ring lingers when the pointer exits to the card — fix that here, it is the same handler).
3. Delete the `hauska-ovl-hover-highlight` source/layers and the `setData` write of `picked.feature.geometry`. After this PR nothing in PE may draw `picked.feature.geometry` or any queryRenderedFeatures fragment geometry pre-seal. The post-seal county-exact ring (P-60d `inspect-highlight.ts`) is untouched.
4. Do NOT change the pick itself: hover and click keep querying `PARCEL_TILES_FILL_ID` only (#204 identity is closed and correct).

### Verification (all exit-bounded)

- Violation test, both directions: a fixture parcel spanning a mocked tile boundary (two fragments, same promoted id) must render ONE full-lot highlight under the new path; re-enabling the old fragment-overlay draw against the same fixture must FAIL the test. A single-fragment control parcel must pass unchanged.
- Hover transition test: hover A then B -> A's `hover` state cleared, B set. Mouseleave -> cleared.
- Update `packages/map-renderer/src/hover-peel.test.js` expectations to feature-state without weakening the #204 identity asserts. Run the full map-renderer + PE suites (`pnpm -r test` or the repo's suite commands); paste raw pass counts.
- Live grade after deploy: on smartsite.cloud at the Simsbrook block (z17-18), hover across 280233/280234/280236/280239 from both sides of the street: the highlight must be the full lot on every one, with no straight cut line tracing across properties. Operator visual is the final grade.

### Deploy

Fresh isolated clone from `origin/main` (do NOT use `P:/seat-worktrees/property/hauska-map`; do not open `fix/pe-pricing-a2` or any Reports branch; do not worktree off existing P:/tmp clones with shared git dirs). PR, merge on green CI (re-green against current base if it moves). Vercel: `vercel link --project property-explorer` (NOT cmdcenter), deploy, confirm smartsite.cloud serves a NEW bundle (asset hash changed) and the peel markers persist.

### Do not

- Rebake or touch PMTiles / the archive
- Hide tile lines on zoom (the #201 defect) or change `shouldSuppressTileParcelLines`
- Reopen Photon/Find (#205/#207/#208) or hover hit-test identity (#204)
- Touch CC LiveMapTile / the CC mesh path
- Absorb the other fix-card items (countyRing replay after source rebuild, swallowed feature-state clears, search-bar clear on click, subject-store sequence guard, near-bbox 504s, ", TX" card title sentinel) — name them as leave_behind instead

### Close

Grade WDLL `_inbox/2026-08-24_lane1_multi_shape_peel_WDLL.md` items 2 and 3 against the operator visual. leave_behind must carry: the A2 rebase pin (`_inbox/2026-08-24_lane2_parked_after_paint.md`), the remaining seal-lifecycle items above, and the retrieval near-bbox 504s (service-side). Mirror the close into `_inbox/`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-24_p60-hover-fragment_cp1.json
  CP2: _inbox/2026-08-24_p60-hover-fragment_cp2.json
  CLOSE: _inbox/2026-08-24_p60-hover-fragment_close.json
