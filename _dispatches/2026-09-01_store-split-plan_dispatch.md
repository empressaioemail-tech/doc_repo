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

PLAN-ROW: F-03, F-01 (90_operations/OPS-19_factory_plan_of_record.md)
repo: doc_repo

# Plan the production store split; produce the binding inventory and the reversal, change nothing

# Mission — plan the production store split. Do not execute it.

## What this card produces

A migration plan, a binding inventory, a breakage analysis and a reversal plan for
separating `neondb` and `hauska_mcp` onto their own computes in production.

**This card changes nothing.** It does not create, delete or reconfigure a branch or
endpoint, does not move a database, and does not touch a secret. Its output is a
document an operator can approve or reject, with the failure modes named.

**Nothing here executes during the Central Texas program.** The current arrangement
is slow and safe on a live production store.

## Why the split

Both databases sit on one compute:

```
project  fancy-fire-06136146  (cortex-prod, org Empressa, plan Scale)
branch   production = br-crimson-feather-aphfmy91  (default, created 2026-05-20)
compute  ep-lucky-truth-apodo8hr   .25 <-> 8 CU   suspend_timeout 0
```

So every operation against either database contends for one machine. The concrete
cost, observed 2026-08-31: lane A3 was a **pure read-only measurement** and had to
wait behind lane A1's containment write purely on compute share. That is measurement
queuing behind writing, and it is the shape that has slowed this program repeatedly.

Sizing is **not** the problem and this card does not propose scaling.
`.25 <-> 8 CU` autoscaling on a Scale plan already gives headroom, and the operations
log shows the production endpoint has no lifecycle events at all over three days.

## The precedent is already in the project

Staging **already separates them**:

```
f06-staging-neondb-1787860807438                  br-super-cloud-ap4ied3j        2026-08-27
f06-staging-hauska_mcp-planner-20260828T142734Z   br-billowing-queen-ap6npmua    2026-08-28
```

Both `.25 <-> 8 CU`, both idle. So this is applying an existing pattern to production,
not inventing an architecture. **Read how those were created and what binds them
before proposing anything for production.**

## The work

### 1. The binding inventory. This is the card.

**Enumerate everything that resolves to the production endpoint today.** For each,
name the file or the secret and what it would need to become after a split:

- every secret in every GCP project and every GitHub environment, by field name, not
  by tag
- every Cloud Run service and job template, and every workflow file that sets one
- every worktree `.env` shape and every CI env block
- the console, the MCP server, the engine, LDT, hauska-map
- anything reading `DATABASE_URL`, `SUBSTRATE_DATABASE_URL`, `CORTEX_DATABASE_URL`,
  `ATOMS_DATABASE_URL`, `STAGING_*` or a pooled variant

**A consumer you did not enumerate is the one that breaks.** The precedent is on the
record: A-022's branch cleanup checked hosts against one project's secrets only, missed
that LDT staging still bound `STAGING_ATOMS_DATABASE_URL` v4 to the deleted branch, and
produced a ten-minute outage plus two re-walks. **The trap surfaced only at the next
deploy that re-resolved `:latest`.** A binding can look dead and be live until
something redeploys.

### 2. What actually moves

Say precisely which database moves and which stays, and why. Moving `hauska_mcp`
(atoms, serve-heavy) off the primary is not the same decision as moving `neondb`
(landing, write-heavy), and the two have different consumers and different risk.

Name the mechanism: a new branch, a read replica, a separate project. Neon read
replicas and branches have different semantics for writes, lag and cost. **Do not
assume a branch is the answer because staging used one** — staging branches are cut
for isolation, not for load separation.

### 3. Breakage analysis

For each consumer, what breaks at the moment of the switch and what breaks later. Two
classes and they are not the same:

- **Immediate**: something that reads the endpoint on the next request
- **Deferred**: something that resolves a secret at deploy time and will not notice
  until it redeploys. These are the dangerous ones because the change looks clean for
  days.

Also name what a split makes **impossible**: any query that joins across the two
databases today. Find out whether any exists. If one does, the split is a bigger
change than it looks and that is a finding.

### 4. Reversal plan

Written before the change, not after. What is the exact sequence to put it back, how
long does it take, and what is lost if it is reversed after writes have landed on the
new compute. **A migration without a rehearsed reversal is a one-way door presented
as a two-way one.**

### 5. Cost and latency, measured not assumed

Report the current spend shape: 1,849 CU-hrs and 1,244 GB of network transfer since
Aug 1, against 311 GB of storage. Say what a second compute does to each.

While you are in there, note that Neon runs on **AWS us-east-1** and the Cloud Run
jobs run on **GCP us-east4**, so every query crosses providers, and a prior
measurement recorded roughly 1,077 ms round trip from `us-east4` to a Factory store.
**Chunked jobs are round-trip heavy by design**, so co-location may be worth more than
compute separation. Say which you would do first and why. That is a real finding even
though it is outside this card's title.

## Falsifier for your own plan

State, before you write the recommendation, **what evidence would make you recommend
against the split.** If no result would, it is advocacy rather than analysis.

Candidates: a cross-database join exists; the consumer count is large enough that the
deferred-breakage surface outweighs the contention; co-location would deliver more for
less; or the contention is smaller than assumed once measured rather than inferred.

## Do not

- Do not create, delete or reconfigure any branch, endpoint or project.
- Do not move a database.
- Do not change a secret, a workflow or a job template.
- Do not run a heavy store operation. Management-plane reads via the Neon CLI are
  fine; SQL is not, and a containment job may be live.
- Do not propose scaling; it is already `.25 <-> 8 CU` and that is not the problem.
- Do not schedule any of this inside the Central Texas program.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State your own falsifier before writing the
recommendation. Deliver the binding inventory as a table with a named owner per
consumer. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_store-split-plan_cp1.json
  CP2: _inbox/2026-09-01_store-split-plan_cp2.json
  CLOSE: _inbox/2026-09-01_store-split-plan_close.json
