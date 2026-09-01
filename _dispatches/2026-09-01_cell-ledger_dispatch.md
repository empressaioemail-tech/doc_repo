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

PLAN-ROW: F-01 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-engine

# CELL-LEDGER dispatch

# Mission — the cell ledger: every parcel, every field, one accounted state, and a gate that refuses

## The operator's model, stated as a build

> "In my mental model it is a database built like a spreadsheet with all cells accounted
> for."

**Row: one parcel.** 981,405 across the six counties, from the containment totals.
**Column: one field in the declared serve shape.** **Cell: exactly one accounted state.**

```
value            the value, plus provenance
absent-verified  we looked; a basis says where and why not
not-applicable   it structurally cannot exist here; a reason says why
refused          a named refusal
--------------------------------------------------------------------
UNACCOUNTED      no state at all. THE DEFECT. Indistinguishable from never looking.
```

**The gate: a county cannot publish while any cell is UNACCOUNTED.** Not "every cell has a
value" — that is unreachable and chasing it produces fabricated values. Every cell has a
*state*.

## This enforces a standing rule, and the rule is stronger than the gate

Ruled 2026-09-01, `_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`:
**every parcel in every county is instantiated with the complete column set from the moment
it exists.** Acquisition changes a cell's state, never a cell's existence.

**A missing column is invisible; an unaccounted cell is countable.** That is why every gap
analysis in this program has been structurally incapable of finding the largest gaps —
permits were missing from the contract rather than from a parcel, so no count could show it.

So this ledger is not only a measurement. **Where the shape can carry the constraint, make
the column set closed and compiler-enforced so a cell cannot be missing at all**, and let
the gate be the backstop rather than the mechanism. A type with no way to omit a cell has no
trigger to be absent and no call site to be missed.

`unaccounted` is a legitimate state **at rest** and fatal **at publish**. Both halves are
load bearing: if it stops being fatal, it becomes cover.

## Do not build this beside the dead ledger

A county-by-rail ledger already exists and **its gating indicators are dead**: `hasWriter`,
`atomFamilyState` and `isPartial` are uniform across all 3,556 cells, so three tags can
never fire, and nothing recomputes it.

This ledger is a different grain — parcel by field, not county by rail — so it does not
duplicate it. **But say so explicitly, and say what happens to the old one.** If the new
gate makes it redundant, retirement is a decline plus a CI check that fails if it reappears,
and consumers get repointed before the store is retired, never the reverse. If it survives
for another purpose, name the purpose.

**Two ledgers where one is dead and nobody says which is authoritative is worse than
either.**

## The column set is derived, not authored

Take the declared shape from `origin/main`, not from this card:
`Tier1FacetPayload` (`baseFacts`, `baseFacts.cadRoll`, `zoning`, `envelope`,
`facetCoverage`, `provenance`), plus `Tier2EnvelopeFacet`, plus any field the
`CAD-SERVE-RECONCILE` close reports as served-and-undeclared.

**Add `permits` as a first-class column now**, ahead of its acquisition. A field that does
not exist cannot be honestly absent, and the operator has ruled permits is active work
rather than deferred. Until a jurisdiction is sourced, every parcel in it reads
`absent-verified` with a basis naming that jurisdiction as unsourced. That is a true
statement and it is visible; a missing column is neither.

Do the same for easements.

## Two states that are earned, not assumed

**`not-applicable` requires a structural reason.** Unincorporated land is genuinely not
zoned by its county, so zoning, setbacks, edges and envelope are `not-applicable` there —
370,289 parcels by the containment measurement, **not** the roadmap's 357,269, which is
wrong by about 13,020 in the split. Anything outside that population is not structural, and
stamping it so is an unearned absence.

**`absent-verified` requires a basis.** "We looked and it is not there" is a claim about an
act of looking. If nothing looked, the honest cell is UNACCOUNTED and the gate should fail.
**Do not convert UNACCOUNTED to `absent-verified` to make the gate pass.** That inverts the
whole instrument, and it is the single most likely way this build goes wrong.

## Known populations that must land in the right cell

- The five `#575` CAD value fields are **blank-no-state on all six golds** today. Those are
  UNACCOUNTED, not absent.
- `livingAreaSqft` is zero of 500,307 in Travis and zero of 114,255 in McLennan at source.
  Served with a source basis that is `absent-verified` and correct. Elsewhere it is
  Hays 54.3, Williamson 40.8, Caldwell 27.7, Bastrop 11.2 percent.
- `cityLimitsFact.status = unmeasured` and `etjStatus = unresolved` are **served pipeline
  words**, ruled out 2026-09-01. They are non-null, so they pass every presence-shaped
  count. They are UNACCOUNTED until converted.
- 188,103 **placeholder** `setback-rule` atoms; Hays and Williamson 100 percent placeholder.
  A setback derived from a placeholder is not a `value`.

## Verify the gate by violating it

**Before reporting the gate as working, poison a cell and watch a county fail to publish.**
Then repair it and watch the county pass. Both directions, on a real county.

A gate observed only passing has not been observed working, and this one will be trusted to
mean "ready for production" — so it gets the same treatment as any other control: name what
executes it, what triggers it, what fails when it is violated, and **what bypasses it**. The
answer to the last is rarely none. A publish path that does not consult the ledger is the
one to find now rather than after Wave R.

## Scale

Roughly 981,405 parcels by roughly 40 fields is on the order of 39 million cells. Both sides
are expressible in SQL, so **100 percent, materialised, per county** — no sampling. Wave R
is serial per county, so the gate must be answerable per county independently.

Report the cell counts by state per county. That table is the answer to "are we ready", and
it is the first honest completeness number this program will have.

## Do not

- Do not convert UNACCOUNTED to `absent-verified` to pass the gate.
- Do not stamp `not-applicable` outside the 370,289 unincorporated population.
- Do not count a placeholder-derived setback as a value.
- Do not author the column list by hand; derive it.
- Do not build beside the dead county-rail ledger without saying what happens to it.
- Do not report the gate as working until you have watched it fail.
- Do not fix any defect the ledger surfaces. This card builds the instrument.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived column set and its source,
the per-county cell counts by state, what executes and triggers the gate and what bypasses
it, the violation test in both directions, and the disposition of the county-rail ledger.
Name what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_cell-ledger_cp1.json
  CP2: _inbox/2026-09-01_cell-ledger_cp2.json
  CLOSE: _inbox/2026-09-01_cell-ledger_close.json
