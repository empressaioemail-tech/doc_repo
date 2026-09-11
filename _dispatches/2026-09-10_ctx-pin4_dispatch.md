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
repo: hauska-factory


# CTX-PIN4 — the gate did its job, and the pin comment stopped keeping up

Repo: `hauska-factory`. Three items. The bump is one line again. Items 2 and 3 are why
this lane exists rather than another one-line chore PR.

## What happened, established before you start

`hauska-factory` main is RED on the `ldt-pin-staleness` workflow (check-run name `check`),
and has been since `2026-09-10T20:30:05Z`. It is red for a real reason and the gate is
correct. Do not weaken it.

The proof that this is LDT-side movement and not any factory merge is a same-commit
pass/fail pair on `63a606b1`:

    34500572096  63a606b1  success  push      2026-09-10T16:12:02Z
    34526748288  63a606b1  failure  schedule  2026-09-10T20:30:05Z

Identical factory commit, opposite results, because LDT main moved underneath it. The
scheduled run is the thing that caught it, which is the design working as CTX-PIN2 built
it. Two factory merges have landed on top of the red since (`51115b6f`, `c9ebad7d`), and
neither caused it. The OPS-21 S1 seat had to run its own forensics to establish that its
merge was innocent. That tax is the cost of leaving this red and is the reason this is not
a low-priority cleanup.

## Item 1 — the pin

`cloudbuild.publish.yaml` pins `_LDT_SHA: 591f5efe`. LDT main is
`cebd041d7ddf102f29ab60eeb9feb04946888125`. Two commits between:

- `c43e2436` CTX-HAYS-REBIND (LDT PR #653), binds Hays geometry to the parcel the county's
  own identifiers name;
- `cebd041d` CTX-HAYS-BACKFILL (LDT PR #654), the two-column backfill plus the check that
  was blind until a mutation run said so.

The gate's own output names ten changed files inside the bake's module graph, including
`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts`,
`artifacts/api-server/src/lib/nodeFacetTier1ParcelJoin.ts`,
`lib/cad-ingest/src/ingest.ts`, `lib/cad-ingest/src/p78Merge.ts`,
`lib/cad-ingest/src/orion/parser.ts`, `lib/cad-ingest/src/pacs/parser.ts`,
`lib/cad-ingest/src/types.ts` and `lib/db/src/schema/cadProperty.ts`.

Bump to `cebd041d`. Before you do:

1. Confirm LDT main is still exactly `cebd041d`, before pinning and again at close. If it
   has moved, STOP and report rather than pinning to a SHA nobody named. Never pin to
   `main`.
2. Re-run `scripts/bake-module-graph.mjs` at the new pin. Report the module count, the
   unresolved count, and whether the module SET changed. The previous two pins both read
   26 modules and 0 unresolved with a byte-identical set. This range adds
   `joinIntegrityGate.ts` and `joinNormalize.ts` on the LDT side, so a set delta here is
   plausible and is exactly the kind of thing the comment must record. Reproduce the
   tracer against the OLD pin first and confirm it returns the known result before you
   trust it on the new one, the way CTX-PIN2 did.
3. Write the pin comment. See Item 2 first, because the comment is the item.

## Item 2 — the provenance comment stopped being written, and the file now lies

CTX-PIN and CTX-PIN2 each landed a pin bump with a comment block in the file's established
style saying what was picked up, why, and whether it was traced to the bake. The last two
bumps did not:

    63a606b1  #131  chore(publish): bump _LDT_SHA to 591f5efe (P-124/CTX-B6 and CTX-B7)
    83c98f97  #130  chore(publish): bump _LDT_SHA to fa7b9b67 (P-124/CTX-B1 ...)

Both diffs are a single changed line. No comment block was added by either. The effect is
that the last comment block in the file, which is CTX-PIN2's and ends "and for where the
check runs", sits directly above a value it does not describe. A reader tracing what LDT
content is in the publish image gets `9873ff11` and CTX-PIN2's reasoning, when the value is
two bumps further on at `591f5efe`. That is a false provenance label sitting on the
authoritative record, which is the same defect class CTX-PIN2's own mission called out on
`cloudbuild.parcel-r5-zoning.yaml` and declined to fix in a gating lane.

Restore the record. Your comment block covers the whole undocumented range, not only your
own bump: what `fa7b9b67` (CTX-B1), `9ae49246` (CTX-B6) and `591f5efe` (CTX-B7) picked up,
then what this bump picks up. Where you cannot establish whether the tracer was ever run
for #130 or #131, say that it was not established rather than implying it was. An honest
gap is the point; a confident sentence covering an unrun tracer is the thing to avoid.

Then answer the question this raises, in your close: what makes the next bump carry a
comment? The staleness gate is armed and works. The comment convention is held by a person
remembering, which `ENFORCEMENT.md` says is not a control. Either propose a mechanism (a
CI check that the `_LDT_SHA` diff hunk is accompanied by an added comment line is one
candidate, and it is cheap) or state plainly that this stays unenforced and why that is
acceptable. Do not build an over-broad version that fires on unrelated edits to the file.

## Item 3 — the bump cadence is the finding, not the trigger set

DO NOT re-derive why this workflow is main-only. It is already answered, deliberately and
at length, in `.github/workflows/ldt-pin-staleness.yml`'s own header comment: it is
kept out of `ci.yml` on purpose, because `ci.yml`'s `on: push: branches: ["**"]` plus
`pull_request` would make LDT's independent drift block every unrelated lane's every push
and PR, and a permanently red gate is a dead gate. It runs on push to main, on a
`0 */6 * * *` schedule, and on `workflow_dispatch` for whoever is about to dispatch a
publish build. Read that comment before forming a view. The reasoning is canon, not a gap.

The real finding is the rate. `cloudbuild.publish.yaml`'s `_LDT_SHA` has been bumped SIX
times in the thirty-eight hours between `2026-09-09T02:25Z` and `2026-09-10T16:11Z`:

    2026-09-09T02:25Z  e2b6c869  #113  -> 301bb75a
    2026-09-09T15:45Z  0c4c1ea6  #118  -> 3885efad
    2026-09-09T20:14Z  f8293d53  #125  -> 7a739849
    2026-09-10T02:25Z  b9ca9b4a  #127  -> 9873ff11
    2026-09-10T05:11Z  83c98f97  #130  -> fa7b9b67
    2026-09-10T16:11Z  63a606b1  #131  -> 591f5efe

Yours is the seventh. Every one is a hand-carried lane or a chore PR, and the gate has gone
red at least twice today: the scheduled run at `15:57:23Z` failed on `83c98f97` before
`#131` re-greened it at `16:11`, and the `20:30:05Z` run failed on `63a606b1` and is the
current red. Detection is also slower than the cron implies. GitHub delivers this schedule
late by a varying two and a half to five hours in observed runs (`10:48:32Z`, `15:57:23Z`,
`20:30:05Z` against nominal 06:00, 12:00, 18:00), so worst-case drift latency is closer to
eleven hours than to six.

So the question to answer in your close is not about triggers. It is whether a pin that
needs bumping roughly every six hours during an active LDT arc should be hand-bumped at
all, and if it should, what makes the seventh, eighth and ninth bumps carry their comment
when the fifth and sixth did not. State a recommendation. Do not build the automation in
this lane; a pin that auto-follows LDT main would delete the deliberate-lag property the
gate exists to protect, and that tradeoff deserves its own ruling rather than a lane's
improvisation.

## Verify by violating

Show the staleness check FAILING at the current pin against `cebd041d`, then PASSING at
the new pin. Exit codes read from the process, not from a pipe. Paste both literally.

If you add the comment-presence check, it must be shown rejecting a value-only bump and
admitting a bump that carries a comment, on real or constructed fixtures.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds from your merged main.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Do not weaken, disable, or add a bypass to the staleness gate. If you believe it is wrong,
report that with evidence instead of changing it.

Do not bump `cloudbuild.parcel-r5-zoning.yaml`'s `_LDT_SHA`. Still out of scope, still a
false label rather than a stale dependency.

## Close contract

Standard lane close JSON, plus:

- Literal `gh api` output confirming LDT main at pin time and at close.
- Tracer output at the old pin and the new pin, with the module count, unresolved count,
  and set delta stated.
- Both violation runs for the staleness check, and any for the comment check.
- Your answer on what enforces the next comment.
- Confirmation that `check` is green on main after merge, read as the check-run conclusion
  string, not as an exit code.
- `leave_behind`.

Report the merge commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-pin4_cp1.json
  CP2: _inbox/2026-09-10_ctx-pin4_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-pin4_close.json
