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

PLAN-ROW: F-06, F-02, F-01, F-08 (90_operations/OPS-19_factory_plan_of_record.md)
repo: legacy-design-tools + hauska-engine + hauska-factory + hauska-map (property seat)

# Five parallel items that never touch the store: CAD fields, wells collapse, alias SQL, C4 deploy, C3 build

# Mission — five parallel items, none blocked by containment

Williamson and Travis own the store. **Nothing in this card needs it.** All five items
are code, commit, or deploy, and they run alongside the containment work.

Four repos, one seat. Open a registered worktree per repo; do not work two items in one
checkout.

Ordered by deadline, not by size. **Item 1 has a hard deadline and the others do not.**

---

## 1. CAD-FIELDS-TWIN — land it before Wave R, and fix the zero defect first

Branch `feat/p91-cad-fields-twin` on the LDT worktree, **code-done and uncommitted**.
Five CAD value fields onto the twin, 48/48 tests, both falsifier arms, multi-county.

**The deadline is the point.** New fields reach the twin only after a bake, and the
standing ruling is one more production bake, Wave R, then no re-bake. Merged before it,
these ride a bake already happening. Missed, they wait for one the operator has ruled
against.

**BEFORE you commit it, fix a defect the planner introduced.** `positiveDollarOrNull`
turns a stored `0` into absent. Measurement says that is wrong: Bastrop carries
**26,553 improvement values at a real stored zero**, and vacant land genuinely has $0 of
improvements. Turning those into absent says "we do not know" where we do know.

That collapses zero into absent, which is the three-states rule broken in the other
direction. The card that produced it said "never serve 0", meaning do not fabricate a
zero for a missing value; it was reasonably read as reject all zeros.

**Three states, and probably per field:**

```
key absent            -> absent, with a basis
key present, value 0  -> ZERO, a real value
key present, positive -> the value
```

Judge per field and say why. A `$0 land value` looks like missing data. A `$0
improvement value` looks like a vacant lot. A `$0 assessed value` may be a real
exemption. Do not apply one rule to all four because it is tidier.

Then commit by explicit pathspec, PR, green on the CI conclusion **string**, merge.

## 2. Wells collapse — the fix, not an apply

The 2,087 gap is diagnosed and it is **merged rows, not lost rows**: 12,079 present
hits collapse to 9,992 unique `(parcelKey, wellKey)`, and 9,992 + 56,921 = 66,913
written against 69,000 planned. **The writer cannot represent more than one well on a
parcel.** That is a data-model limit, and it would have recurred silently on all five
remaining counties.

The patch already written and uncommitted adds per-chunk `plannedIn`/`writtenOut` and a
`CHUNK_PK_COLLAPSE` refuse. Land it, and decide the model question: does a parcel with
three wells get three atoms under distinct keys, or one atom carrying three wells?
**Recommend one with reasoning.** The refuse is correct either way, because a silent
collapse is worse than a stop.

Second finding to keep: the writer recorded only totals, so **a count was standing in
for a record.**

**Do not apply wells to any county on this card.** Hays, McLennan, Travis and
Williamson stay held.

## 3. Alias regen — commit the product SQL

The factory-side alias work is uncommitted. Land `sql/p2-juris/_alias_seed.sql` and
`sql/p2-juris/04_alias_reconcile.sql` **only**; three CRLF-only dirties
(`03_all_county_fips.sql`, `_roster_six_touch.sql`, `_file_side_counts.json`) were
restored and must not be swept in. Confirm before committing.

The seed itself is already correct in doc_repo: exactly four rows changed, `certain`
holds at 33, needs-human 99 to 95, and the pin now matches the committed blob at
`7e5ac620…` (LF, not the CRLF `d3f6d340…`).

Still open and yours to recommend: whether the generator's permanent home is
`sql/p2-juris/` next to its only executable consumer, or the doc_repo rescue copy at
`scripts/alias-seed/` stands. Either way **replace the hardcoded `SCR` scratchpad
constant** with a path relative to the file.

## 4. C4 — deploy PE and prove it on the live gold

hauska-map #322 is **merged and not deployed**. A live GET of `48021:34137` still
returns `buildableAreaPct` **absent** with `buildableAreaSqFt 9350` and
`acreage.sqft 16673` both present.

**hauska-map does not auto-deploy on merge.** It needs a CLI deploy per app, and
Property Explorer is its own app with its own root directory. A Vercel CLI exit code of
255 does not mean the deploy failed — **judge by the live alias and the bundle, not the
exit code.**

**Done is the live GET**, not the deploy: that gold must return `56.1`
(9350 / 16673 × 100). Then re-run Gate 8 dayOne C4 on the deployed gold and watch it
move from fail to pass on an inhabited body.

**Do not close C4 on the PR.** A merged PR is not customer-done, and this one has
already proved it.

## 5. C3 second derivation — BUILD it, do not run it

C3 is confirmed weaker than carded: it passes an agreeing-and-wrong payload **and** a
present-but-disagreeing one (`A1` vs `PDD`). It never compares the two values. It fails
only the null/non-null pair and the present-versus-absent `rowState`. It is a null-shape
check, not a consistency check.

The real fix is a genuine second derivation: **CAD landUse at source against the served
`landUseFact.landUseCode`** — two independently derived inputs rather than two fields
from one payload.

**Build it and do not run it.** The comparison needs a store read, and the store belongs
to containment. Same compression that worked for the P5 families and the F-11 writer:
build against the shape, run when the store frees.

The presence-shaped label (Factory #47) stays. It is honest and it is not the fix.

---

## Serialization

None of these need the store. **Item 5 must not run its comparison**, and item 2 must
not apply. If any item finds it needs a store read to proceed, stop and report rather
than taking the store from containment.

## Do not

- Do not apply wells to any county.
- Do not run C3's comparison.
- Do not sweep the CRLF-only dirties into the alias commit.
- Do not close C4 on a merged PR, or judge a Vercel deploy by its exit code.
- Do not let item 1 miss Wave R.
- Do not work two items in one checkout.
- Do not commit in doc_repo; the planner holds those.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot per repo in the first output. State the falsifier for each item before running
it. For item 1, state the per-field zero decision and its reasoning. For item 2,
recommend the data-model shape. For item 3, recommend the generator home. `leave_behind`
named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_parallel-five_cp1.json
  CP2: _inbox/2026-09-01_parallel-five_cp2.json
  CLOSE: _inbox/2026-09-01_parallel-five_close.json
