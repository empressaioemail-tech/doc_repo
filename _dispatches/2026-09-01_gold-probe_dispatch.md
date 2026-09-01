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
repo: hauska-factory

# GOLD-PROBE dispatch

# Mission — click a parcel and prove the CAD and landUse data is complete

## The operator's ask, and the one word that needs defining

> "The result I am expecting is to click a parcel and see accurate and complete CAD and
> landUse data. Complete being the key word."

**Complete does not mean every field carries a value, and building it that way would make
the system worse.** Four of the six golds expect a refusal or an absence as the *correct*
output. `48021:8720522` is a PDD whose setbacks are honestly refused — it sits in the
3,747 roster and that refusal is the right answer, not a miss. Unincorporated land is not
zoned by its county, so `not-applicable` is the truth there. A probe that scores those as
failures either fails forever or creates pressure to fabricate values, which is the defect
class this whole operation exists to prevent.

**Complete means no field is silently missing.** Every CAD and landUse field on the parcel
resolves to exactly one of four states, and carries what that state requires:

| state | requires |
|---|---|
| `value` | the value, plus provenance: source and timestamp |
| `absent-verified` | a **basis** — we looked, it is not there |
| `not-applicable` | a **reason** — it structurally cannot exist here |
| `refused` | a **named refusal** |

**A blank with no state is the defect.** It is indistinguishable from "we never looked",
and that indistinguishability is the whole problem. That is what this probe exists to
find, and it is a question that can actually be answered.

## Extend the walk. Do not build a new script.

Gate 8 dayOne already exists and already emits live probe artifacts against deployed golds
(for example `_inbox/2026-08-31_gate8_live_1437_48021.json`, and the C4 close test was
"re-run Gate 8 dayOne C4 on the deployed gold"). **A-021 already gates production on a
passed walk.**

**A new standalone script would be a fifth dormant mechanism** — correct, passing, and
gating nothing. Find where dayOne lives, extend its grade set there, and say where it
lives in your close. Property owns factory, engine, map and LDT, so wherever it is, it is
yours.

If you conclude it genuinely cannot be extended and must be new, **say why before writing
it**, and name what will execute it, what triggers it, and what fails when it fails.

## Run it against PRODUCTION first, today

Not at P6. Now, against prod as it stands.

A staging walk with no baseline tells you "these six look right"; it cannot tell you "these
six changed the way we intended." **Today's production run is the before picture**, and it
also answers the operator's question immediately: it shows what a click on those parcels
actually returns right now.

Expect it to fail. That is the point. A first run that passes everything means the probe
is not looking hard enough.

## The six golds and their expected outcomes

| parcel | expected |
|---|---|
| `48021:34137` | landUse present and **not null-as-absent** |
| `48021:8720522` | PDD, setbacks **refused** — the refusal is correct output |
| `48209:135570` | `joined-situs` **or** honest `gate-blocked` |
| `48491:76149` | never `joined` |
| `48453:493738` | honest `no-row` |
| `48453:231086` | `stamp-missing` for Austin |

## Defects already known to exist. If the probe does not catch these, it is not working.

Use them as your known-violation set — the probe must fail on each, today, before you
trust a pass anywhere.

- **`"A1 — A1"`** minted inside PE by `description: landUseLabel ?? landUseCode`, a
  defaulted field then rendered again as a second datum.
- **`inspectHighLevelLabel` returns the literal string `"Zone"`** for `landUse`.
- **`yearBuilt`** occurs twice repo-wide, both type declarations, **never assigned**. Where
  it does render it must render with its source, because CAD 2021 disagrees with listing
  2022 on Driftwood and a bare number puts two contradicting figures on one screen.
- **Situs sentinels** that pass a non-null test: `", ,"` and `", TX 78660"`, plus `0,0`
  coordinates.
- **Grey box scope**: keyed on a per-row `absent-uncovered` state but printed as "in this
  area". The "setbacks" half of that string is true; do not fix the string as one unit.
- **`buildableAreaPct`** was absent while `buildableAreaSqFt` and `acreage.sqft` were both
  present. Derivable-but-absent is its own failure.

## The CAD field set

Cover the roll fields including the five CAD value fields that landed in LDT `#575`
(`1d19eb90`). Those reach the twin only through a bake, so **check whether they are served
yet and report the answer** rather than assuming either way — the merge was the
precondition, not the outcome.

Judge zero per field, not uniformly. A `$0` improvement value on vacant land is a real
value; 26,553 Bastrop parcels carry one. A `$0` land value looks like missing data. Do not
collapse zero into absent, and do not fabricate a zero for a missing value — those are
opposite errors and both are wrong.

## Output shape

**A per-parcel, per-field table showing the state of every field, not a pass/fail boolean.**
The operator wants to see it. A boolean cannot show that a field is blank-with-no-state,
which is the finding this whole card is for.

Emit it as a durable artifact under `_inbox/`, and make it re-runnable against staging
unchanged so P6 is a diff rather than a fresh judgement.

## Do not

- Do not score an honest refusal or a labelled absence as a failure.
- Do not build a standalone script without first showing the walk cannot be extended.
- Do not fabricate, default, or backfill any value to make a probe pass.
- Do not fix the defects you find on this card. Find and report them; fixing is a separate
  card and mixing them means neither is reviewable.
- Do not write to any store. This is a read-and-report card.
- Do not treat a merged PR as evidence a field is served.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report where dayOne lives and how you extended it, the per-parcel
per-field state table for all six golds against production, which of the known defects the
probe caught and which it missed, whether the `#575` CAD value fields are served yet, and
what a click on `48021:34137` actually returns today. Name what contradicted this card, or
say plainly that nothing did. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_gold-probe_cp1.json
  CP2: _inbox/2026-09-01_gold-probe_cp2.json
  CLOSE: _inbox/2026-09-01_gold-probe_close.json
