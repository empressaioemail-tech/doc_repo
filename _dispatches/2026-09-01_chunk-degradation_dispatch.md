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

# Why Williamson's chunks stretch: name the mechanism before Travis

# Mission — why do Williamson's chunks stretch? Deep dive, one hour.

## The phenomenon

Execution `factory-p2-juris-hzkqk`, run `fb490620`, Williamson 48491, on image
`sha256:9e417502`. Started `2026-09-01T01:51:18Z`.

**Seven chunks of 8,000 rows in ~1h56m. 56,000 of 282,570. And the chunks are
stretching: early ones 1–2 minutes, recent ones 13–28 minutes.** `unresolved` is 0 on
every chunk. Split so far 35,980 in-city and 20,020 unincorporated. Last chunk write
`03:42:04Z`.

At that pace it needs 8–10 more hours against a `max_duration_s` of 21600 and a
maintenance restart at 05:00 UTC. **It will not finish.** That is already decided and
is not your problem. Your problem is *why*.

## Why this matters beyond this run

Travis is 380,918 parcels and is next. If this degradation is a property of the county
rather than of this run, Travis is worse and the current design cannot complete it
either. **The degradation is the finding, not the failure.** The 57P01 connection
problem is fixed; this is a different and more interesting one.

## The comparison set, so you do not re-derive it

| county | rows | chunks | wall | per chunk |
|---|---|---|---|---|
| 48055 Caldwell | 24,988 | 4 | 1m14s | ~19s |
| 48021 Bastrop | 62,256 | 8 | 1m58s | ~15s |
| 48209 Hays | 116,420 | 15 | 14m16s | ~57s |
| 48309 McLennan | 114,254 | ~14 | 29m58s | ~128s |
| 48491 Williamson | 282,570 | 7 so far | 1h56m+ | **~16 min, rising** |

Williamson's per-chunk cost is roughly **8–15x Hays** on the same page size. Hays chunk
wall times were 52.0 56.3 51.1 62.5 61.0 58.1 53.7 51.6 40.2 42.1 92.9 82.4 49.9 48.0
36.4 — noisy but **flat**, not rising. Williamson is the first county to show a trend.

## Read this prior work first. Do not re-derive it.

`_inbox/2026-08-31_p2_juris_partition_record.md` and the memory
`postgis-zone-major-not-point-major`. Four cost mechanisms were already proposed on this
card and **all four lost**:

- **parcels-linear** — predicted McLennan at 156s; it cancelled
- **city-count** — Hays 13 cities vs McLennan 21; both cancelled
- **chunk-linear** — confounded by a planner flip, re-opened, never settled
- **Austin vertex budget** — a real straddle, but only **3.56%** of Hays parcels reach
  its bbox, so vertex count was not per-parcel cost *for Hays*

Do not re-run those. But note the fourth was rejected **for Hays specifically**, on the
grounds that few parcels reached Austin's bbox. Williamson's geography is different:
Round Rock, Georgetown, Cedar Park, Leander, Hutto and Taylor, 17 roster touches, and
64% of its parcels in-city. A mechanism that fails on a county where 3.56% of parcels
reach one big polygon is not thereby refuted on a county where most parcels sit inside
one.

Also known: `cities_ok` npoints measured Hays at 9.29x Bastrop's vertices, Austin alone
at 32,811. And the standing PostGIS finding is that this work is **vertex-volume
dominated, not row-count dominated** — grid indexing failed for exactly that reason.

## The data you need is on the store that is NOT busy

**`run_events` for run `fb490620` lives on the hauska-factory control store**
(`withered-surf-26870298`), a different project and a different compute from cortex-prod.
Reading it does not contend with the running job. Each chunk record should carry its
range, row count and wall time.

**DO NOT read cortex-prod while `hzkqk` is running.** No `landing_parcel_jurisdiction`
scans, no city-polygon queries, no `txgio_parcel`. If a question can only be answered
there, mark it PENDING-STORE-READ and say what you would run.

**Do not cancel or interfere with `hzkqk`.** It is producing your data.

## The leading hypothesis, and it is yours to kill

**Cost tracks in-city work, not row count.** An in-city parcel requires ring containment
against a city polygon; an unincorporated one is refused cheaply once it misses every
bbox. So a chunk of 8,000 mostly-in-city parcels near Round Rock is a different unit of
work from 8,000 rural parcels, and the design treats them as the same.

**Test it directly:** correlate per-chunk `wallMs` against per-chunk in-city count. If
the slow chunks are the in-city-heavy ones, the mechanism is named.

**Pre-register the falsifier before you look:** if slow chunks look like fast chunks on
in-city ratio, this hypothesis is dead and the cause is something accumulating in the
process — connection state, memory, a growing in-memory structure, a query plan that
degrades as the landing table fills. Say so plainly rather than salvaging it.

**And state a second mechanism regardless**, with why you rejected it. Candidates worth
considering rather than assuming: `prop_id` ranges correlating with geography so later
chunks are systematically denser; the landing table growing under its own writes; a plan
flip partway through; per-chunk overhead that is constant while useful work shrinks.

**Do not fit a curve through seven points.** Four mechanisms already died on this card
doing exactly that. A trend in seven samples is a reason to look for a mechanism, not a
law.

## What a good answer looks like

The mechanism, named, with the measurement that supports it and the second mechanism
you rejected and why.

**Whether it predicts Travis.** Travis is 380,918 parcels and Austin's polygon is the
32,811-vertex one already measured. If your mechanism is right, say what it predicts for
Travis *before* anyone runs it.

**The fix shape.** If cost tracks in-city work, a uniform 8,000-row page is the wrong
unit and the answer is chunking by estimated cost rather than by row count — but say
what you would actually use as the cost proxy, and how it is computed cheaply.

**And a note on cross-run resume.** Completed chunks are keyed by `run.id`, so a failed
run loses all its work; `fb490620`'s 56,000 rows will not be licensed. If chunking is
being redesigned anyway, say whether resume across runs belongs in the same change.

## Timing

There is a decision at roughly **04:50 UTC** on whether to terminate `hzkqk` cleanly
before the 05:00 maintenance restart. **Report by 04:40 if you can**, even if the answer
is partial. A partial answer in time is worth more than a complete one after the
decision.

## Do not

- Do not read cortex-prod. Do not cancel or interfere with `hzkqk`.
- Do not re-run the four dead mechanisms.
- Do not fit a curve through seven points and call it a law.
- Do not propose raising `max_duration_s` or the page size without a mechanism.
- Do not write to any store. This is a read-and-diagnose card.
- Do not touch any repository other than a registered read-only checkout.

## Close

Report the mechanism with its measurement, the rejected alternative, the Travis
prediction, the fix shape and its cost proxy. Anything you could not establish is
UNMEASURED or PENDING-STORE-READ, never a guess. Declare snapshot in the first output.
Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_chunk-degradation_cp1.json
  CP2: _inbox/2026-09-01_chunk-degradation_cp2.json
  CLOSE: _inbox/2026-09-01_chunk-degradation_close.json
