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

# Feed a starved gate, run Williamson and Travis, produce TOTALS

# Mission A6 — release a starved gate, run the last two counties, produce TOTALS

## Why this card exists

Four of six counties are licensed with real triples and their sum is 317,918.

| County | unincorporated / in-city / total | run |
|---|---|---|
| 48021 Bastrop | 50,264 / 11,992 / 62,256 | `85f984c2` |
| 48055 Caldwell | 14,361 / 10,627 / 24,988 | `1e2529a3` |
| 48209 Hays | 61,585 / 54,835 / 116,420 | `bdcf534f` |
| 48309 McLennan | 32,422 / 81,832 / 114,254 | `a62e3fce` |

Williamson execution `hcx7x` returned `failedCount=1`, exit 1, `textPayload
COUNTY_HELD`, landing 0. Travis never ran behind the same gate, so its sentinel is
unmeasured because it never executed.

**TOTALS has never existed. This card produces it, or names exactly which county
stopped it.**

## The gate is STARVED, not stale. That distinction is the card.

`src/jobs/p2-juris-containment.mjs`:

```
export const HELD_FIPS = Object.freeze(["48453", "48491"]);

export function requireReplayGate(county, replay) {
  if (!HELD_FIPS.includes(county)) return;
  const ok =
    replay?.matches?.["48021"] === true &&
    replay?.matches?.["48055"] === true &&
    replay?.complete?.["48209"] === true;
  if (!ok) refuse(COUNTY_HELD, ...);
}
```

Its logic is correct and its trigger fires. What it lacks is an input: `replay` is a
parameter somebody has to supply, and the three conditions it tests are **true in the
store right now** and are not reaching it. Correct logic, live trigger, starved input.

**Therefore the fix is to DERIVE `replay` from the store, and the two obvious fixes
are both wrong:**

- **Do not delete `HELD_FIPS` or return early for these counties.** That removes a
  control rather than feeding it, and it would let Travis run in future even if
  Bastrop's bind moved. Bastrop's bind has already moved once today, from `1dda40f7`
  to `85f984c2`.
- **Do not pass a literal** `{matches:{48021:true,48055:true},complete:{48209:true}}`.
  That is a hand-declared assertion standing in for a measurement, which is the defect
  class that has already produced `has_writer`, the portal permission column, and the
  CDP seed list on this program. A gate satisfied by a literal is satisfied by anyone
  who types one.

Derive it: 48021 and 48055 match `INTERACTIVE_PARTITIONS` **as read from the store by
`GROUP BY run_id`**, and 48209 has a succeeded run. Then the gate re-checks reality
every time and closes on its own when reality changes.

**First, identify the caller.** `requireReplayGate` is exported from
`p2-juris-containment.mjs` and a grep of `p2-juris.mjs` does not find it, yet the gate
demonstrably fired on `hcx7x`. Find where it is called and where `replay` comes from
before changing anything. Report the answer.

## Travis and Williamson have NO ORACLE. F1 must be redefined for them.

```
export const INTERACTIVE_PARTITIONS = Object.freeze({
  48021: { unincorporated: 50264, in_city: 11992, total: 62256 },
  48055: { unincorporated: 14361, in_city: 10627, total: 24988 },
});
```

`assertInteractiveMatch` returns `{ checked: false }` for anything absent. So for
48453 and 48491 there is **no triple to match and `PARTITION_MISMATCH` cannot fire**.

If you run these two under the F1 you used for Bastrop, **your primary falsifier is
silently disabled** and a wrong answer looks exactly like a right one. Hays and
McLennan already ran in that condition; do not repeat it without saying so.

**Define F1 for an oracle-less county before running it**, and state it in your output.
It must be something a wrong result could fail. Candidates, and you choose and justify:

- `unincorporated + in_city + unresolved == total`, and `total ==` the distinct
  `prop_id` denominator for that FIPS **excluding its measured sentinel**
- `unresolved == 0`
- ring versus bbox-centre profile stated, not assumed
- no CDP assigned a `place_fips`
- the in-city share is within a stated band of the roster expectation, with the band
  declared **before** the run and a breach reported rather than widened

A denominator identity is the strongest available: it is two independently derived
numbers, the job's own emit and a store count, and no sentinel satisfies both.

## Per county, before you execute

**Measure that county's sentinel.** Do not extrapolate. Bastrop's resolved
unincorporated, Caldwell's resolved **in-city** at Mustang Ridge 50200, Hays carried
375 rows on one unincorporated key. Travis's sentinel has never been measured because
Travis has never run.

**State the redefined F1 and F2.** F2 is unchanged and is not optional: a succeeded
termination with an **unaided exit**. Do not hand-cancel a hang and write a success
over it.

**Verify the image by digest.** Factory builds ship storage tarballs with no
`COMMIT_SHA`, so image-to-commit attribution there is inference. Report the digest.

**Williamson first.** It is 282,570 parcels against Travis at 380,918, and it already
has a failed execution to supersede.

## TOTALS

Only when all six have store binds does TOTALS become measured. Sum the six, show the
arithmetic, and name the licensing `run_id` per county **read from the store at close
by `GROUP BY run_id`**, not from any lane close. A close is a claim about a moment; a
bind is a fact with a timestamp, and Bastrop's moved once already today.

If a county fails, **TOTALS is UNMEASURED and you name that county.** A five-county
sum is not TOTALS.

## Do not

- Do not delete `HELD_FIPS` or bypass the gate; feed it.
- Do not pass a hand-written `replay` literal.
- Do not run these two without a stated, failable F1.
- Do not raise `statement_timeout` or change page size from 8,000.
- Do not absorb a sentinel to make a number match.
- Do not run a second heavy store operation. `neondb` and `hauska_mcp` share one
  compute, `ep-lucky-truth-apodo8hr`, group size 1 — measured, not assumed.
- Do not adopt 357,269 or any figure not produced by this job.
- Do not start the setback bake or lift `SETBACK_APPLY_HELD`.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. Report where `replay` is supplied
from and how you derived it. State the redefined F1 per county before executing.
Report TOTALS with its arithmetic and per-county `run_id`, or UNMEASURED with the
county named. `leave_behind` named. Subagents do not commit.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_a6-totals_cp1.json
  CP2: _inbox/2026-08-31_a6-totals_cp2.json
  CLOSE: _inbox/2026-08-31_a6-totals_close.json
