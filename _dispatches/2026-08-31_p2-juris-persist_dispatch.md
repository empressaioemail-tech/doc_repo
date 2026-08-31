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

# Containment as a chunked ledgered job; the 180s ceiling was the instrument, not the work

# Mission — containment as a chunked job, because the ceiling was the instrument

## Why this card exists

Six heavy scans ran on P2-JURIS. Bastrop and Caldwell emitted. Every Hays attempt
cancelled at every scope tried: full 01 (217s), a 30k slice (218s, confounded by a
plan flip), and the bbox-only 06 (180s ceiling). Four cost mechanisms were proposed
and all four lost. The scout then completed in **2,147 ms** and proved that
enumerating 116,420 Hays keys is cheap, which rules out prop_id scanning without
naming what is expensive.

The lane stopped correctly rather than taking a seventh scan. **The 180s ceiling is
a property of an interactive psql session, not of the work.** Williamson is 2.4x
Hays and Travis 3.3x, so the interactive path could never have reached six counties
even with a perfect Hays run.

This card moves containment onto the P2 job template. That is not raising the
timeout, which stays forbidden. It is the conformant design every other Factory
writer already uses: chunk, ledger, resume, one run row per chunk.

**The cost driver stays un-named, and that is now acceptable** rather than
blocking, because a job does not need to finish inside a statement timeout.

## What already exists — build into it, do not rebuild

Factory #40 `dfe1e247` shipped the scaffold and it is a **refusing stub**:

- `src/jobs/p2-juris.mjs` (127 lines). Guards already built and tested:
  `COUNTY_REQUIRED` / `COUNTY_UNKNOWN`, `RUN_ROW_REQUIRED`, `LAPTOP_WRITE_FROZEN`,
  `WRITER_NOT_ALLOWLISTED`, `WRITER_ALLOWLIST_CAD_ONLY`, `PERSIST_SPEC_SHAPE`,
  `PERSIST_NOT_THIS_CARD`. Its own header states it "does not execute the persist."
- `src/jobs/p2-juris-persist-spec.mjs` (98 lines). `executeContainmentPersist` is
  the seam this card fills. `planCountyPersist` and `PERSIST_SPEC_FIXTURE` exist.
- `src/control/writer-allowlist.mjs`, `src/control/runs.mjs` (`startRun`),
  `src/control/leases.mjs`.
- `src/lib/publish-bake-chunks.mjs` — chunking already exists. **Reuse it.** Do not
  write a second chunker.
- `test/p2-job.test.mjs` (278 lines).

Retire `PERSIST_NOT_THIS_CARD` as part of this card. It is now this card, and a
refuse code that no longer describes reality is a lie the next agent will trust.

## The method is declared and closed

Join-rewrite 01: county equality, `1e-8` floor, jsonb rings. Do not re-derive it,
do not re-open it, and do not reconcile to **357,269** — the 2026-08-30 baseline was
discarded as unrecoverable and that is settled.

Chunk by `prop_id >= X AND prop_id < Y`. A range is estimable where
`IN (SELECT ... LIMIT)` was not; the LIMIT subquery estimated 1,841 against an
actual 30,000 and flipped the planner to Nested Loop. **Never cut a chunk with a
LIMIT subquery.**

Derive bounds per county with the scout, which is proven cheap. For Hays it
returned `lo=100002 hi=159378 county_distinct=116420 chunk_verified=40000` in 2.1s.

## The falsifier, and it is built in

Bastrop and Caldwell were measured interactively under this exact method:

| county | unincorporated | in_city | total |
|---|---|---|---|
| 48021 Bastrop | 50,265 | 11,992 | 62,257 |
| 48055 Caldwell | 14,361 | 10,628 | 24,989 |

**Run those two counties through the job first and require an exact match.** That
is a meaning-shaped check: two independently derived computations, an interactive
query and a chunked job, of the same quantity. If they disagree, the job is wrong
and the disagreement is the finding. Do not tune the job until it matches; diagnose
why it differs.

State this falsifier before running it. A job that produces new numbers for these
two counties has failed, however plausible the numbers look.

## Sentinel prop_id `0`

Scout returned `county_distinct` 116,420 against a Hays parcel count of 116,421.
The difference is the sentinel `prop_id` `'0'` live in `txgio_parcel`. **Handle it
explicitly**: exclude it with a named, recorded reason, or refuse on it. Do not let
it be silently absent from a denominator. A row that disappears between two counts
without being named is how a fabricated total starts.

## What to build

1. Fill `executeContainmentPersist`. Per county: derive bounds, chunk by prop_id
   range, run containment per chunk, write per-parcel disposition.
2. **One `run_event` per chunk**, per the F-20 stage-and-merge design. A count is
   not a record: name the range, the row count, and the wall time.
3. **Resume from the ledger.** A failed chunk resumes; it does not restart the
   county. This is the property the interactive path could never have.
4. Record per-chunk wall time. Over six counties that yields the cost-vs-size data
   six interactive scans failed to produce. **It is data, not a law.** Do not fit a
   curve to it, do not derive a width rule, and do not let a completed chunk license
   a chunk size.
5. TOTALS falls out as a sum over chunks. It becomes measured when all six counties
   complete, and not before.

The output P3 needs is the **per-parcel disposition**, not the aggregate. The
aggregate was only ever a scoping figure.

## Do not

- Do not raise `statement_timeout`. The fix is chunking, not patience.
- Do not persist from a laptop. `LAPTOP_WRITE_FROZEN` exists; keep it armed.
- Do not start without a run row.
- Do not give a CDP a `place_fips`.
- Do not treat `breadth_*` as a jurisdiction source.
- Do not adopt 357,269 or any figure not produced by this job.
- Do not run two writers on the same `(store, entity_type, county_fips)`.
- Do not run Travis or Williamson until Bastrop and Caldwell match exactly and Hays
  completes.
- Do not touch any repository other than the registered Factory worktree you open.

## One check, report the answer

`src/control/writer-allowlist.mjs` (Factory, #40) and
`packages/engine-core/scripts/atoms-writer-allowlist.mjs` (engine, PR #367) are two
allowlists in two repos. They may be correctly separate layers, a job-level gate and
a spawn-level gate, or they may be one rule implemented twice, which is the CTRL-1
shape that already bit this operation once when the compiler and the gate drifted.
Read both and say which. Do not merge or refactor them on this card.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it. `leave_behind` named, `none` is valid. Subagents do not
commit. Verification does not delegate below the lane planner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_p2-juris-persist_cp1.json
  CP2: _inbox/2026-08-31_p2-juris-persist_cp2.json
  CLOSE: _inbox/2026-08-31_p2-juris-persist_close.json
