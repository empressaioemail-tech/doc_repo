---
decision_id: 2026-08-11_texas_flush_launch_gate_amendment
id: 2026-08-11_texas_flush_launch_gate_amendment
title: Texas flush launch gate amendment — gradable denominator, all displayStates, ledger-native criteria
date: 2026-08-11
last_updated: 2026-08-21
status: active
owner: nick
amends: _decisions/2026-08-09_texas_flush_launch_gate
related_canonical: [_decisions/2026-08-09_texas_flush_launch_gate, _decisions/2026-08-09_launch_footprint_counties, _decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct, 90_operations/OPS-7_coverage_and_honesty_doctrine, 90_operations/OPS-11_invariant_register, 90_operations/OPS-12_instrument_inventory, 90_operations/OPS-14_texas_flush_game_plan, 90_operations/OPS-15_owner_and_rrc_rail_gap_analysis, 76j_smartsite_launch_readiness_program]
---

**Amends:** [`_decisions/2026-08-09_texas_flush_launch_gate.md`](_decisions/2026-08-09_texas_flush_launch_gate.md). The 2026-08-09 record remains authoritative for launch-vs-program intent and per-rail class split; this amendment patches criteria, denominator, displayState coverage, and gradable instruments only. The original doc should carry an `amended-by: 2026-08-11_texas_flush_launch_gate_amendment` pointer (planner-owned edit to the original).

# Texas flush launch gate amendment

Operator ruling 2026-08-11. The 2026-08-09 launch gate is correct in intent (measured-everywhere, not filled-everywhere) but not gradable as written: the rail split (R1, ruled 2026-08-10) moved the grid from 12 to 14 rails and 3,048 to 3,556 cells; criterion 3 named only `no-writer` and ignored `no-atom`; criterion 2 graded DATA LOADED (table loads) while the per-rail refinement grades SERVED TO PRODUCT (ledger displayState). OPS-15 line 187 predicted the denominator break the day before the split landed. This record amends the gate so every cell state has a defined terminal condition and every criterion names a pass/fail instrument.

## Decision

Amend `_decisions/2026-08-09_texas_flush_launch_gate.md` criteria and instruments as specified below. Do not relitigate measured-everywhere vs filled-everywhere or the per-rail uniform/depth split; both stand.

## Denominator rule (GATE-R1)

The launch gate denominator is derived from the rail declaration, never from a literal count in prose.

**Authoritative sources (independent; nothing currently asserts they agree):**

| Quantity | Source | Instrument |
|---|---|---|
| `totalRails` | `COUNTY_RAIL_DECLARATION.length` in `countyRailDimension.ts` (the TS constant) | `GET /api/county-ledger` → `summary.totalRails` |
| `totalCounties` | Texas roster (254 FIPS) | `GET /api/county-ledger` → `summary.totalCounties` |
| `totalCells` | `county_rail` dimension table rows (materialized by `countyRailRefreshCli`; scored by `readManifestGrid` CROSS JOIN) | `GET /api/county-ledger` → `summary.totalCells`; cross-check `SELECT COUNT(*) FROM county_rail` on neondb |

**Invariant (required, unenforced today):** `totalCells === totalCounties × totalRails`. After any declaration edit, run `countyRailRefreshCli` reconcile then redeploy cortex-api so the served denominator matches. A gate expressed as a cardinality of a dimension still being edited will rot; express it over the dimension ("every rail in `county_rail`"), never its number.

**Live baseline 2026-08-11:** 14 rails, 254 counties, 3,556 cells. R1 split: `rrc` → `rrc-wells` + `rrc-pipelines`; added `rail-corridor`; `mud` is rail 14.

## displayState terminal conditions (GATE-R2, GATE-R4)

Every ledger cell must reach a terminal state before launch. The gate covers all four pre-terminal displayStates plus satisfied substates.

| displayState | Meaning at launch | Terminal condition |
|---|---|---|
| `no-atom` | Atom family not registered for this rail, or family registered but no cell-level satisfied path exists | **Resolved:** atom family registered on the property spine (`atomFamilyState: present` or `partial` with writer path) **and** cell reaches a satisfied displayState (`satisfied-present`, `satisfied-absent`, or `satisfied-partial` with provenance per OPS-7). For statewide-uniform rails where the underlying phenomenon is geographically sparse (wells, pipelines, rail corridors, MUD districts), honest absence is the expected terminal state for most counties; minting provenanced absence atoms is launch-gate work, not post-launch deferral. |
| `no-writer` | Rail declared but no writer pipeline exists | **Resolved:** `hasWriter: true` on the cell (writer merged and registered on the rail declaration). Cell may still read `not-yet` until the writer runs; `no-writer` itself must be zero at launch. |
| `not-yet` | Writer exists; cell not yet scored to satisfied | **Uniform rails:** must become satisfied (`satisfied-present` or `satisfied-absent`; `satisfied-partial` only with explicit partial doctrine and provenance). Zero `not-yet` on uniform rails at launch. **Depth rails:** outside the launch footprint, `not-yet` is allowed only when `hasWriter: true` and the cell honestly reflects un-warmed or un-acquired depth (OPS-7 NOT-ONBOARDED disclosed at jurisdiction level where applicable). Inside the launch footprint (28 counties per `_decisions/2026-08-09_launch_footprint_counties.md`), depth rails must reach satisfied. |
| `satisfied-present` | Data verified and served | **Keep.** Provenance required (source, accessPolicy, confidence, timestamp per INV-19). |
| `satisfied-absent` | Honest absence verified with evidence | **Keep.** First-class satisfied state per OPS-7 and INV-17. Unincorporated-unzoned land, counties with no wells, no rail corridor, no MUD district: absence with provenance is the product, not a gap. |
| `satisfied-partial` | Partial coverage with doctrine | **Keep** where partial doctrine applies; must carry provenance and must not mask silent gaps. Rollup-eligible satisfied counts exclude partial unless doctrine explicitly includes them (ledger distinguishes `satisfiedPresentCells` from rollup `satisfiedCells`). |

**Progress instrument, not gate criterion (GATE-R6):** `texasCompletenessPct` in the county-ledger summary is a progress headline only. It moves when satisfied cells increase and when the denominator changes (e.g. R1 split). It is not a launch gate criterion. Launch passes or fails on cell-level displayState rules above, never on a completeness percentage threshold.

## Per-rail refinement (preserved from 2026-08-09; denominator updated)

Classification follows the live `county_rail` dimension. OPS-14 rail table is advisory; the declaration constant wins.

**Statewide-uniform (satisfied everywhere — data or honest absence, zero `not-yet`):**

`geometry`, `roads`, `flood`, `footprint`, `rrc-wells`, `rrc-pipelines`, `rail-corridor`, `mud`

**Jurisdiction-depth (writer-live + honest `not-yet` allowed outside footprint; satisfied required in launch-footprint counties):**

`cad`, `owner`, `zoning`, `envelope`, `landuse`, `easement`

Footprint enumeration: 28 counties in `_decisions/2026-08-09_launch_footprint_counties.md`. Footprint is sequencing order for depth factories, not a scope boundary for the standing program.

## Owner rail (GATE-R3; OPS-15 R3 resolution)

`owner` is a jurisdiction-depth rail (ratified OPS-14 decision 4). Launch gate reading:

- **Inside launch footprint:** satisfied where CAD attribute data exists and the owner writer has run (`satisfied-present` with `public-paid` access policy and default-hidden posture per OPS-15 R4 when ruled). Where no CAD acquisition path exists for a footprint county, the cell reaches **`satisfied-absent`** via honest absence (no owner atom served; disclosed provenance that no public CAD owner path exists for that county). Fabricated owner data is never acceptable.
- **Outside launch footprint:** writer-live with honest `not-yet` or `satisfied-absent` where CAD is absent; same honest-absence path as footprint shortfall.
- Owner is launch-gate scope: the gate cannot close with `owner` permanently in `no-atom`. Wave 1 (owner atom family + writer) is launch-critical, not post-launch optional.

## Amended launch criteria

The five criteria from the 2026-08-09 gate stand in structure; items 2 and 3 are restated; items 1 and 3 gain displayState and denominator coverage.

**1. Parcel geometry fabric.** Every county's `geometry` rail cell is `satisfied-present` or `satisfied-absent` (coastal-short and Donley exceptions resolved or ruled honestly absent). Not "196 counties in `txgio_parcel`" alone; the ledger geometry rail is the grade.

**2. Statewide-uniform layers — ledger-native (GATE-R5).** Each statewide-uniform rail listed above reads satisfied on all 254 counties via the county ledger. Criterion 2 does **not** pass because an underlying table loaded (e.g. NFHL rows in store while `flood` rail still `not-yet`). OPS-7 three-states rule: only SERVED TO PRODUCT (ledger satisfied displayState) counts. Table load is prerequisite work, not gate satisfaction.

**3. All rails measured — no structural blockers.** For every row in `county_rail` × every county in the Texas roster: zero cells in `no-atom`; zero cells in `no-writer`. Remaining work shows as `not-yet` (depth, outside footprint) or progresses to satisfied. Denominator is `summary.totalCells` from the live ledger, not a hardcoded 3,556 or 14.

**3e. Unmeasured is a third state (added 2026-08-21, R-07).** Cells stamped `derivation-indeterminate` or otherwise overlay-indeterminate are not `no-atom` and not `no-writer`. They must be 0 at launch. Graded by DC-14. Do not fold them into DC-4 or DC-5. Cite `_decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct.md`. The R-07 dispatch labeled this draft DC-9. Existing DC-9 (satisfied cells carry provenance) is unchanged, so the new card is DC-14.

**4. Cert frame reconciled.** Cert lane grades the raw txgio ring per Geometry Law; block13 fixture re-dumped; certs re-earned in the true frame. OPS-11 invariant register: no UNENFORCED invariant on the correctness path blocking launch (cert-frame amendment cleared).

**5. 76j capacity and branding.** Rate-limit store, load test, capacity doc, domain and branding per `76j_smartsite_launch_readiness_program.md`. Branding aligns to Smart Site product naming (not Hauska on customer-facing Stripe surfaces).

## Structural commitment check

- **Sell reasoning, not data:** satisfied-absent cells carry provenance; launch on measured-everywhere is honest per parcel.
- **Confidence is earned:** launch does not require filled depth; it requires disclosed verification state.
- **Cost per jurisdiction:** unchanged; depth backfill remains post-launch program work.
- **Dual interface:** gate read from API and SQL instruments, MCP consumption follows ledger truth.

Premortem: no yellow on the amendment itself; the risk is certifying via `texasCompletenessPct` or table-load proxies, which this amendment explicitly forbids.

## Reasoning

Half the live grid (1,778 of 3,556 cells on 2026-08-11) sat in `no-atom` or `no-writer`, states the original criterion 3 never named. A gate that closes by ignoring unnamed states is the "certified a broken Bastrop" failure at program scale (OPS-15 line 187). Splitting RRC and adding rail-corridor was correct for honesty; leaving the gate at 12×254 was incorrect for operability. Restating criterion 2 against the ledger aligns the gate with OPS-7 and the per-rail refinement already ruled 2026-08-09. Explicitly demoting `texasCompletenessPct` prevents the console headline from being mistaken for distance-to-launch when the denominator moves.

## Reversal criteria

Same as the 2026-08-09 gate: reverse to stricter if honest-absence at launch density breaks conversion or trust, or if a legal/partner constraint requires filled data before public sale. Reverse to looser only by explicit operator ruling. Reverse this amendment if a mechanical invariant check on `totalCells === totalCounties × totalRails` is added and proves the derivation rule redundant in practice (unlikely; keep the rule even if enforced).

## Dependencies

- `_decisions/2026-08-09_texas_flush_launch_gate.md` (base intent)
- `_decisions/2026-08-09_launch_footprint_counties.md` (depth satisfied geography)
- `90_operations/OPS-7_coverage_and_honesty_doctrine.md` (honest absence, three states)
- `90_operations/OPS-15_owner_and_rrc_rail_gap_analysis.md` (R1 split, owner scope)
- `countyRailRefreshCli` + cortex-api deploy after declaration edits

## Counterparties

Internal: planner (grades gate), writers program (W1), fabric completion (W2), integrity (W3), launch readiness (W4). External: none; gate is internal operability.

---

## GRADABLE DONE-CARD

Each item is pass/fail via the named instrument only. Grade the deployed production county ledger unless a item specifies otherwise. A item graded by narration or doc assertion fails.

**DC-1. Denominator coherence.** `summary.totalCells === summary.totalCounties × summary.totalRails` on `GET /api/county-ledger`. Cross-check: `SELECT COUNT(*) AS rail_rows FROM county_rail` equals `summary.totalRails` (instrument corrected by operator ruling 2026-08-14, OPS-16 A-016: `county_rail` holds the RAIL dimension and cells materialize via the `readManifestGrid` CROSS JOIN, per this card's own architecture note — the original cross-check against `totalCells` contradicted it and could never pass). Cross-check: `COUNTY_RAIL_DECLARATION.length` (declaration source, `countyRailDimension.ts`) equals `summary.totalRails`. **Fail** if any pair disagrees or the multiplication does not hold.

**DC-2. Geometry fabric (criterion 1).** On `GET /api/county-ledger`, filter `manifestCells` where `railKey === "geometry"`. **Pass:** every cell has `displayState` in (`satisfied-present`, `satisfied-absent`), OR `displayState === "satisfied-present"` with `isPartial === true`, `honestCoveragePct` non-null, and `verifiedByInstrument` non-null (partial with provenance). Count of geometry cells equals `summary.totalCounties`. **Fail:** any `not-yet`, `no-writer`, or `no-atom`; or any `satisfied-present` with `isPartial === true` missing `verifiedByInstrument`.

**DC-3. Statewide-uniform rails satisfied everywhere (criterion 2).** Uniform rail keys: `geometry`, `roads`, `flood`, `footprint`, `rrc-wells`, `rrc-pipelines`, `rail-corridor`, `mud`. For each key, filter `manifestCells` where `railKey` matches. **Pass:** zero cells with `displayState === "not-yet"`; zero `no-writer`; zero `no-atom`; every cell in (`satisfied-present`, `satisfied-absent`, or doctrine-allowed `satisfied-partial`). **Instrument:** same GET; one pass/fail per rail key (8 sub-checks, all must pass).

**DC-4. No `no-atom` cells (criterion 3a).** `GET /api/county-ledger` → count cells where `displayState === "no-atom"`. **Pass:** 0. **Fail:** any positive count.

**DC-5. No `no-writer` cells (criterion 3b).** Same endpoint → count cells where `displayState === "no-writer"`. **Pass:** 0. **Fail:** any positive count.

**DC-6. Depth rails — footprint satisfied (criterion 3c + per-rail split).** Depth rail keys: `cad`, `owner`, `zoning`, `envelope`, `landuse`, `easement`. Footprint FIPS list from `_decisions/2026-08-09_launch_footprint_counties.md` (28 counties). For each depth rail × each footprint county, filter `manifestCells`. **Pass:** every cell `displayState` in (`satisfied-present`, `satisfied-absent`, doctrine-allowed `satisfied-partial`). **Fail:** any `not-yet`, `no-writer`, or `no-atom` inside footprint.

**DC-7. Depth rails — outside footprint writer-live (criterion 3d).** For depth rails × counties not in footprint list, filter cells where `displayState === "not-yet"`. **Pass:** every such cell has `hasWriter === true`. **Fail:** any `not-yet` with `hasWriter === false`, or any `no-writer` / `no-atom`.

**DC-8. Owner rail footprint rule (OPS-15 R3).** Subset of DC-6 for `railKey === "owner"` only, with explicit honest-absence allowance: footprint county with no CAD path may read `satisfied-absent` with non-null provenance fields on the cell. **Pass:** no footprint owner cell in `no-atom`, `no-writer`, or `not-yet`. **Fail:** any footprint owner cell stuck pre-satisfied.

**DC-9. Satisfied cells carry provenance (OPS-7 / INV-19).** On `GET /api/county-ledger`, for every cell where `displayState` matches `^satisfied-`, assert at least one of (`verifiedByInstrument`, `source`, `absenceBasis`) is non-null. **Pass:** count of violations = 0. **Fail:** any satisfied cell with all three null. **Instrument:** full `manifestCells` parse; no sampling, no serve probe required.

**DC-10. Cert frame reconciled (criterion 4).** Three mechanical sub-checks, all must pass: **(a)** W3 close artifact JSON exists at a path declared in `_STATE.md` OPEN section and records `block13.passCount === block13.totalCount` (7/7 at time of ruling); **(b)** `gh run list -R empressaioemail-tech/hauska-engine --workflow block13-cert-grade --limit 1 --json conclusion` returns `"success"` on the commit tagged in that artifact; **(c)** OPS-11 cert-frame amendment paragraph (Geometry Law reconciliation) carries status `cleared` or equivalent closed marker, verifiable by grep `cert.frame|cert-frame|Geometry Law` in `90_operations/OPS-11_invariant_register.md` plus a dated W3 session close under `_sessions/` naming block13 re-earn. **Fail:** any sub-check missing or negative.

**DC-11. 76j capacity and branding (criterion 5).** Five mechanical sub-checks on deployed production, all must pass: **(a)** `GET https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/health` (the MCP server — the service that carries the rate limiter; instrument re-pointed from cortex-api by operator ruling 2026-08-13, OPS-16 A-012: cortex has no limiter and the original instrument could never pass) returns JSON with `dependencies.rate_limit_store.state === "ok"` and `memory_fallback === false`; **(b)** load-test artifact file exists at path named in `76j_smartsite_launch_readiness_program.md` Workstream C (or `_inbox/` 76j close record) with dated run output; **(c)** capacity doc path in 76j program exists and `last_updated` is on or before gate-close date; **(d)** `curl -sI https://smartsite.cloud` returns HTTP 200 or 301 to Vercel (domain attached); **(e)** Stripe products API or dashboard export shows zero customer-facing product names containing `Hauska Pro` (Smart Site ladder names only). **Instrument:** one-shot curl/gh/file-exists per sub-check; **Fail:** any sub-check fails.

**DC-12. `texasCompletenessPct` excluded from gate (GATE-R6).** **Pass:** gate close artifact explicitly records completeness pct as informational only; no done-card item uses `texasCompletenessPct` threshold as pass/fail. **Fail:** any gate grade derived from completeness percentage alone. **Instrument:** this done-card itself; launch sign-off template must not include a completeness threshold.

**DC-13. Progress headline recorded at close.** At gate close, paste live `summary` block from `GET /api/county-ledger` (totalRails, totalCounties, totalCells, displayState counts, texasCompletenessPct) into session close artifact for drift audit. **Pass:** verbatim snapshot attached. **Instrument:** curl/httpie one-shot to production county-ledger endpoint.

**DC-14. Unmeasured / `derivation-indeterminate` / overlay-indeterminate cells must be 0 at launch.** (R-07 draft. Dispatch R-07 called this DC-9. Existing DC-9 provenance is unchanged. DC-4 still counts `displayState === "no-atom"` only. DC-5 still counts `displayState === "no-writer"` only.) On `GET /api/county-ledger`, count cells where `displayState === "derivation-indeterminate"` or where the served overlay records the cell as unmeasured / overlay-indeterminate (hasWriter or atomFamilyState carrying an indeterminate stamp). **Pass:** 0. **Fail:** any positive count. Do not fold these cells into DC-4 or DC-5. Cite `_decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct.md`. Until the `RAIL_ENGINE_BINDINGS` wire converts unmeasured to measured, this card is the honest gate. **Instrument:** same GET; full `manifestCells` parse; no sampling.

---

**Done-card summary:** 14 numbered acceptance items (DC-1 through DC-14). Primary instruments: `GET /api/county-ledger` (DC-1 through DC-9, DC-13, DC-14), `SELECT COUNT(*) FROM county_rail` (DC-1 cross-check), OPS-11 register + engine CI block13 (DC-10), 76j WDLL artifacts + Stripe probe (DC-11), gate close template review (DC-12).
