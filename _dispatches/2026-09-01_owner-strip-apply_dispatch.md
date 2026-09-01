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

# OWNER-STRIP-APPLY dispatch

# Mission — strip owner fields against a target that is moving, and find out why it moves

## Supersedes the 2026-08-31 target

The previous card refused to apply because live exposure no longer matched its
measurement, and that refusal was correct. Measured 2026-09-01 at 13:24Z against the
2026-08-31 numbers:

| county | 2026-08-31 `ownerName` | live `ownerName` | delta |
|---|---|---|---|
| 48021 Bastrop | 77,078 | 77,073 | -5 |
| 48055 Caldwell | 48,384 | 48,382 | -2 |
| 48309 McLennan | 113,384 | 113,360 | -24 |
| 48209 Hays | 29 | **0** | -29 |
| 48453 Travis | 3 | **0** | -3 |
| 48491 Williamson | 7 | **0** | -7 |

A second count without the `public-free` filter returned the same numbers, so those rows
are not sitting under a different access policy. Hays, Travis and Williamson are now
**absent**, not unmeasured, and that distinction is the whole point of this exercise.

## The method changes: measure, then strip what you measured

Do not compare against any number in this card. Numbers here are context, not a target.

1. **Measure at apply time.** Take the population immediately before you strip, per county.
2. **Strip exactly the set you measured**, chunked, resuming from the ledger.
3. **Require zero after**, all six counties.

The falsifier is no longer "does it match a prior measurement." It is: **the set you
measured is the set you stripped, and after the run all six counties return zero.** A
count that drifts between your measurement and your strip is a finding, not a failure —
report the drift and the count that actually got stripped.

## Answer why it is moving, and do not assume you already know

The leading explanation is that engine `#371` merged at `05:52:30Z` and stops new writes
of `ownerName` and `ownerMailingAddress` onto `cad-parcel-roll`, so atoms rewritten since
then land without owner fields and the pool erodes on its own. That would make the drift
benign and self-limiting.

**State a second mechanism and why you rejected it.** Something else deleting or rewriting
those bodies is a different situation entirely, and one that a strip would mask rather
than fix. Candidates worth distinguishing rather than assuming: a bake or re-write path
that drops the fields as a side effect, a county re-ingest, an atom-version rotation, or a
deletion. **If the mechanism is not `#371`, stop and report** — that is a different card.

The distinguishing evidence is cheap: if `#371` explains it, the rows that lost owner
fields were rewritten after `05:52:30Z` and their bodies are otherwise intact.

## What is being removed, and what is not

`ownerName` and `ownerMailingAddress` out of `cad-parcel-roll` bodies in `hauska_mcp`.
Nothing else, ever.

**No data is lost.** `cad_property` stays the source of record and is untouched;
`owner-fact` stays the paid home and is untouched. This removes a duplicate from an atom
whose `public-free` policy was never right for it. Say that in the close, because
"mutate production bodies" reads worse than what this is.

## Method discipline

**Dry run first, always**, and report the dry-run counts per county before applying.

**Run row first.** No mutation without one. The previous card wrote no factory run row
because nothing mutated, which was correct.

**A count is not a record.** Every chunk emits a durable record naming the predicate, the
range acted on, the row count and the timestamp, so the set is re-derivable.

**The one that matters most:** a body that carried no owner field before must be
byte-identical after. A strip that rewrites untouched rows is a different operation from
the one authorised. Spot-check a body before and after and confirm only the two keys
differ.

## Store landmines that will bite this card

Three, all found on 2026-09-01, each of which returns a confident wrong answer:

- Factory `runs.status` is **`success`**, not `succeeded`. Filtering on the English word
  returns zero rows.
- `landing.method` is `ring` on every persist row **including `covers-v1`**, so grouping
  the store by method erases method version.
- A county's **latest** factory success may be a `persist:false` measure run rather than
  the run that wrote the data. McLennan's latest is `1e5d4ae5`; its persist run is
  `a62e3fce`.

## Then close the exposure properly

`#371` stops new writes; this card removes the existing pool. **Neither alone closes it**,
so the close names both this run id and `e3e1485ee39535d1819d438221063dd6eb9b955e`.

Add the regression test the previous card specified and never reached: an anonymous
`get_atom` on a `cad-parcel-roll` DID returns a body with **no owner keys**. Without it
the next writer that adds an owner field to a `public-free` atom reproduces this silently.

## Do not

- Do not compare against the numbers in this card; measure at apply time.
- Do not proceed if the mechanism is not `#371`. Stop and report.
- Do not apply without a clean dry run.
- Do not touch `owner-fact`, `cad_property`, or any other field on the roll atom.
- Do not add an MCP field stripper; the ruling rejected it and the policy is the protection.
- Do not skip a county because its count is small. Zero is the falsifier on all six.
- Do not run into a Tuesday 05:00-06:00 UTC Neon maintenance window.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report the apply-time measurement, the set actually stripped, any
drift between them, the per-county after-counts, the mechanism for the erosion and the
second mechanism you rejected, this run id and `#371`'s merge SHA. Name what contradicted
this card, or say plainly that nothing did. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_owner-strip-apply_cp1.json
  CP2: _inbox/2026-09-01_owner-strip-apply_cp2.json
  CLOSE: _inbox/2026-09-01_owner-strip-apply_close.json
