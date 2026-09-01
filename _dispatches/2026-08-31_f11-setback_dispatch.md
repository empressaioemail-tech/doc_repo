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

PLAN-ROW: F-11 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-engine

# F-11 retire road-class-setback and quarantine the placeholder cohort — releases P4's setback hold

# F-11 — retire the setback values that no dimensional record supports

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Bounded SQL with a named `statement_timeout`,
builds, `vitest run`. A timed-out query is `unmeasured`, never 0.

**Read product code by ref.** `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, migration, or job start.

## Why this card exists, and what it unblocks

P4's setback / edge / envelope half is **held** on exactly one finding. Gate 8's
day-one assertions found `boundaryEdgeFact.setback.provenance:
"road-class-setback-table"` serving live on the Bastrop gold front edge. The mold
retired that path on 2026-07-29 — gate 3 is explicit that "roads identify WHICH
edge is front; they do not supply setback VALUES," and gate 4 requires setbacks
from "the jurisdiction's authoritative **per-parcel** dimensional record."

P4 lands setback tables and recomputes envelopes on top of setbacks. Minting on a
retired derivation propagates it. **This card is what releases that hold**; wells,
footprint and flood are already moving and are not affected.

## Two bad provenances, one shape

Both are a setback value whose source is not a dimensional record. Handle them
together — a card that fixes one leaves the other serving.

**1. `road-class-setback-table`** — a road class inflated into a setback value.
Retired by the mold 2026-07-29 and still on the wire.

**2. `storage-port-proof/phase-1a`** — the placeholder cohort. **188,103 of
346,676 `setback-rule` atoms**, and **Hays (34,454) and Williamson (124,499) are
100% placeholder.** Real sources are Bastrop 7,534 (2,315 layer-23 per-parcel),
Lockhart 337, Austin 150,702; McLennan has zero.

A related third, in scope because it is the same defect one derivation
downstream: **McLennan carries 65,814 envelopes derived from 0 setback rules.** An
envelope with no rule beneath it is a computed value with no input.

## Retirement order — consumers first, store second

ENFORCEMENT is explicit and the reverse order is what turns an invisible defect
into a visible regression:

1. **Enumerate the consumers.** Every read path that treats a `setback-rule` atom
   or `boundaryEdgeFact.setback` as authoritative. At minimum the bake's envelope
   compute, the draw's setback panel, and the depth-warm edge writer's gate. Name
   them all before changing any.
2. **Repoint or refuse each consumer.** A consumer that can no longer source a
   value refuses with the basis named — it does not fall back, and it does not
   substitute a road class.
3. **Then retire the derivation.** Not before.
4. **Prove retirement by decline.** ENFORCEMENT: "Retirement is proven by decline,
   never by documentation. A retired path returns a decline or 404 and **a CI check
   fails if it reappears.**" Add that check. A comment saying the path is retired
   is not a retirement.

## The existing atoms are the hard part — do not delete them

There are three populations and they get three different dispositions. Collapsing
them is the defect this whole program has been cleaning up.

| Population | Disposition | Why |
|---|---|---|
| Value from a real dimensional record (Bastrop layer 23, Lockhart, Austin) | **`value`**, keep | Sourced. Untouched by this card |
| Value from `road-class-setback-table` | **`refused`**, basis names the retired derivation | The payload positively contradicts it — a road class is not a setback |
| Value from `storage-port-proof/phase-1a` | **`unknown`**, basis names the placeholder | Nobody looked. `refused` would overclaim; `absent-verified` would be a lie |

**Do not delete a row to make a rail look clean.** Deleting converts a wrong value
into an absence, and absent / zero / unmeasured are three different states. Mark
them; let the serve path decide.

**Do not re-derive a setback from a road class to "fill" a refused row.** That is
the retired path wearing a new name.

## Measure before and after, per FIPS

Report `setback-rule` atom counts per county split by provenance, before and after.
The starting numbers above are from 2026-08-30 and are the reconcile target — a
material divergence means your predicate is wrong, not that the corpus changed.
Use an indexed `(entity_type, entity_id)` predicate; never an unanchored `LIKE`,
one already timed out at 90 s on this store.

## Acceptance — both directions

- A fixture edge whose only setback source is `road-class-setback-table` emits
  `refused`, and one backed by a real dimensional record still emits `value`. Both
  observed.
- A placeholder-provenance row emits `unknown`, not `absent-verified`.
- The CI check **fails** when `road-class-setback-table` is reintroduced, and
  passes on a clean tree. Run it against a deliberate reintroduction before
  reporting it working.
- The Bastrop gold front edge no longer serves the retired provenance, and gate 8's
  C7 assertion goes green **without C3 or C4 being touched** — if fixing this
  changes them, something else moved and you should say so.
- McLennan's 65,814 envelopes over zero rules are either refused or their rule
  source is named. Not silently recomputed.

## Do not

Delete atoms. Re-derive setbacks from road class or road adjacency. Invent PDD or
overlay scalars — the mold has PDD honestly declining and that is correct
behaviour, not a gap. Widen a check to admit a placeholder. Retire the store
before the consumers are repointed. Report retirement from a comment rather than a
decline. Start P4's setback half from this card — it releases the hold, it does
not run the mint.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_f11-setback_cp1.json
  CP2: _inbox/2026-08-31_f11-setback_cp2.json
  CLOSE: _inbox/2026-08-31_f11-setback_close.json
