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

# Tear apart the integration seats thesis for getting CTX to production

# CTX-TEARDOWN — tear apart the integration seat's thesis for getting CTX to production

**You are an adversarial reviewer. Your job is to break the argument below, not to help
build it.** A close that says "this looks right" is a failed close. If the thesis survives
you, it survives because you could not break it, not because you agreed with it.

Read-only. No repo writes, no deploys, no job runs. Your output is a verdict and a list of
defects in the reasoning.

## Calibrate on the author first

The integration seat wrote this thesis. Its measured error record for 2026-09-09/10, kept
because it should change how much weight you give any unsupported claim below:

- **Seven wrong data-shape assumptions**, each corrected only by hitting an error: the
  wrong Dockerfile for an engine-api build; a premature all-clear on an image that then
  existed; an incomplete Cloud Run argument set that silently dropped `--gold`; `place_key`
  assumed as `node:<fips>:<prop_id>` when `parcel_record_cell` uses `<fips>:<prop_id>`;
  `runs.created_at` which is `started_at`; a `parcel_gate_verdict` read taken mid-write and
  nearly reported as a partial failure; a gate verdict trusted as live when it is cached.
- **Four wrong dispatch premises**, each corrected by the lane it was sent to: `69de8fe6`
  declared urgent when it never reached the bake; the Elgin ceiling declared derivable from
  a staged table with no live consumer; CTX-SP pointed at the wrong spatial predicate; and
  worst, CTX-HAYS-GATE told that the geometry-only population "structurally cannot" cause
  the cadRoll refusal when **99.0 percent of it does**.
- **Two wrong predictions**: that the situs fix would clear Caldwell as a side effect, and
  that the zoning apply would move ~532 cells rather than 5,118.
- **One job assigned to itself at 09:00 and forgotten until 23:00.**

The common shape is reasoning from what a thing appears to be rather than reading it.
**Assume that shape is present somewhere in the thesis below and find it.**

## The thesis, stated so it can be attacked

### T1. Six counties are blocked by four remaining things, not six

    Bastrop      acreage class in the walk (fix merged, needs rebuild + re-run)
                 non-account population 62,257 (80% of county) — disposition unruled
    Travis       acreage class (same rebuild)
    Williamson   acreage class AND the unmeasured class — TWO different actions
    McLennan     passes 182/182 staging; HELD on the non-account question
    Caldwell     48055:1 serve-guard 422; needs a re-bake per CTX-SENTINEL
    Hays         cadRoll post-condition; fix named (tax-year scoping), not implemented

**Attack this first:** the seat has been wrong about "what is left" at every checkpoint
today. Each time it declared a county one step away, a second thing appeared behind the
first. Find the reason to expect that again rather than accepting the list.

### T2. Williamson needs a cortex-api deploy, not just a bake rebuild

CTX-PIN2 found only one of CTX-LEAVES2's three fixes reaches the bake's 26-module graph.
The acreage fix is in it; the `unmeasured`-to-`refused` fix and the prop_id guard are
grep-confirmed outside it, in LDT's live-serve and CAD-ingest code.

**Attack:** is a cortex-api deploy actually sufficient for the `unmeasured` half? Nobody has
traced that path end to end. The seat is asserting it from the negative finding.

### T3. The non-account population is the largest open question and it is about the product

176,512 of 1,187,370 rows across the six counties, concentrated entirely in Bastrop (62,257,
80 percent) and McLennan (114,255, **100 percent**). One family: StratMap source plus zero
CAD signal. 159,243 of them carry a normal-looking address and were invisible to every prior
lane because all of them looked for punctuation.

These rows carry land, market and improvement values sourced from **TxGIO/StratMap rather
than from the appraisal district's own export.**

**Attack hardest here.** Specifically:

- Is "zero CAD signal" the right frame at all, or is this a provenance-labelling question
  wearing an absence costume?
- McLennan is the county the seat called "the first one through" on a 182/182 walk **and**
  is 100 percent this population. Are those two facts compatible? If the walk grades content
  and the whole county is non-account geometry, what exactly did the walk verify?
- What is a customer actually being told today about a valuation on one of those parcels?
  The seat has NOT checked this. It is the question that matters most and it is unmeasured.
- CTX-SENTINEL recommends a declared non-account state mirroring `recordRetirement`. Is
  that honest, or does it convert a provenance problem into an absence problem and lose
  information?

### T4. The pipeline is now correct rather than capable, and that gap is not closing

Fleet memory records that of thirteen things a customer can ask a parcel, eight refuse, and
that eight of those refusals are independent of jurisdiction coverage. Today's work made the
product more honest, not more capable.

**Attack:** is that still true after today, or has it changed? CTX-FAMILIES wired six fact
families to the feasibility route. Nobody has re-measured the refusal count since.

### T5. What "production" requires, in the seat's view

1. Rebuild publish on the new pin; re-run Bastrop and Travis; both should clear the acreage
   class.
2. Deploy cortex-api; re-run Williamson.
3. Rule the non-account disposition; re-bake Caldwell; re-run.
4. Implement tax-year scoping on `CADROLL_EXPECTATION_SQL`; re-run Hays.
5. Promote all six from staging to production.

**Attack the sequencing and the omissions.** What is missing from this list? What in it is
optimistic? Which step has an unstated dependency? The seat believes step 5 is mechanical
and has never done it for a county that passed the corrected walk.

### T6. The claim the seat is least sure of

That the six defect classes found today are the whole set. Every one was invisible until the
one in front of it cleared. **The seat has no basis for believing the sixth is the last, and
states that explicitly.**

**Attack:** is there a structural reason to expect a seventh? Where would it live? What has
never been graded at all?

## What you must do

1. **Verify T1 through T6 against source and live state**, not against this document. Every
   number here traces to a lane close in `_inbox/2026-09-09_*` or `_inbox/2026-09-10_*`.
   Read the closes, not the summaries.
2. **Rank the defects in the reasoning** by how much they would cost if acted on.
3. **Name what the thesis omits.** The seat's error record shows it misses things by
   reasoning from shape; find the thing it has not thought to look at.
4. **Give a verdict on T5**: is that sequence sufficient to reach production, and if not,
   what is the real sequence?
5. **Answer T3's customer question if you can do it read-only.** What does a customer see
   today for a McLennan parcel? That is the single highest-value unmeasured fact.

## What you must NOT do

Do not fix anything. Do not write to any repo. Do not deploy, build, or run any job.

Do not accept a claim because it carries a number. Several numbers in this program have been
correct measurements of the wrong population — the 22.22 percent Hays figure, the 71 percent
sampled miss rate, the 48-versus-26 residue. Ask what population each number describes.

Do not stop at the first defect you find. The documented recurring failure here is stopping
at the first plausible explanation.

## Close contract

A verdict document, not a lane close JSON. It must contain:

- A ranked list of defects in the thesis, each with the evidence that establishes it.
- What the thesis omits entirely.
- Your own answer to T5: the real sequence to production.
- Your answer to T3's customer question, or a statement that it cannot be answered
  read-only and what it would take.
- Explicitly: which of T1 to T6 survived you, and why each survivor survived.
- `leave_behind`.

If you find nothing wrong, say so plainly and say what you checked — but be aware that the
prior probability of that is low, given the record above.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-teardown_cp1.json
  CP2: _inbox/2026-09-10_ctx-teardown_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-teardown_close.json
