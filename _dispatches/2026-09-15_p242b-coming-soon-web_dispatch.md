CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-242 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p242b-coming-soon-web --seat <your-seat-id> --plan-row P-242 --dispatch _dispatches/2026-09-15_p242b-coming-soon-web_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p242b-coming-soon-web --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-24 county to serving

You are working a lane of OPS-24. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

A county goes from "not in the product" to "a customer types a real address in that county
and the card, the MCP and the PDF agree, and every value carries its source and vintage"
through ONE pipeline of thirteen stages, each with a predicate that can fail and an instrument
that measures it, at a cost the kill test can read. Not "acquire everything". Not a farm
before one county has run end to end through the pipeline that exists.

## Six laws

1. **The customer predicate is the definition of done.** `scripts/surface-probe.mjs` with a
   real address in the county is the finish line for every stage, not stage 12's private
   check. A stage that cannot be traced to a change in what the probe reads is not on this
   program. ARMED 2026-09-14 on the enforcement side: `probe-close-gate.mjs` gates every
   OPS-24 row and prints the predicate debt on each close until `surface-probe.mjs` carries
   the stage's row (P-197); a close with neither an artifact nor a declared
   `probe.notApplicable` (read-only reviews only) is refused.
2. **The gate is fixed before anything trusts it.** The publish gate today passes TOTAL
   absence and refuses PARTIAL absence (P-181, dead-controls ranking, entry 1). Nothing that
   reads a gate verdict, the per-place declaration, the completeness check, a farm's merge, is
   built or run against the gate until stage 9 lands and is proven by violation on an empty
   county.
3. **One county end to end before any farm.** Burnet runs stages 3 through 12 through the
   existing pipeline first. The farm (stages 1 and 13) is designed from what that run breaks.
   The fleet has learned twice that blockers surface serially; a wave finds them slower than
   one county does.
4. **Three operator stop points, and only three:** a new credential or secret mount, a write
   to a production serving store, a ruling. Everything else runs unattended and leaves a
   record naming what it touched.
5. **Every stage meters itself.** Compute dollars and operator minutes per county per stage
   go on the stage's run record, so commitment 3 (under 200 dollars and one hour per county)
   can fire as a kill, not a slogan.
6. **Nothing is measured once and published as state.** A number on this program's card
   names its SHA and its date. OPS-23's live card is authoritative where the two programs
   touch (serving, identity, the ledger).

## Identity and vintage, inherited as law

The OPS-21 identity paragraph applies: `place_key` is the parcel-map id; in a two-namespace
county the account joins only through the published crosswalk; never by bare number. The
P-178 vintage rule applies: a county's declared roll is a decision with a marker for accounts
that fall off, never an upsert that keeps notice values silently.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — P-242b: record request goes coming-soon on the web surface, disabled and labelled

### The ruling you are implementing

Operator ruling 2026-09-15, recorded at
`_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`:

1. **All surfaces.** Web and MCP connector both.
2. **Disabled AND labelled**, not labelled alone.
3. **MCP tools stay listed and return a declared coming-soon refusal**, not removed from the catalog.

**This lane is the WEB half only.** The MCP half is a separate lane in `legacy-design-tools`, which
is occupied right now by P-242's disclosure lane. Do not touch `artifacts/smartsite-mcp`.

### Why it is coming-soon, so you scope it correctly

The flow runs to completion and delivers nothing a customer can read. P-223 measured
`records_request_jobs` at 42 rows; the operator's own account owns two, **both `status=needs-human`,
both completed, both with zero artifacts.** This is not a mislabelled UI. Scope accordingly: the
goal is that a customer cannot start a flow that will not deliver, and is told why.

### Repo and the real paths

`hauska-map`. The mechanism already exists. **Verified against `origin/main` by the planner, and
note the paths are app-relative in the source note but repo-relative here:**

    apps/property-explorer/src/lib/pricing.ts                      (comingSoon: "Coming soon")
    apps/property-explorer/src/workbench/Workbench.tsx             (`${tool.label} · coming soon`)
    apps/property-explorer/src/workbench/tools/ReportsTool.tsx     ("Coming soon")
    apps/property-explorer/src/workbench/tools/reports-catalog.ts  ({ text: "Coming soon", color: MUTED })

`ReportsTool.tsx` line 1 carries the standing rule verbatim: **"Coming soon is not on the purchase
surface."** That rule is why labelled-alone is not the ask, and it is already canon in this file.

### Done looks like

Record request reads as coming-soon and **cannot be purchased or started** from the web app. The
label and the disablement land together; neither alone satisfies this row.

### Falsifiers, pre-register your answers before you run anything

1. **Try to buy it.** Drive the purchase path end to end as a customer and confirm it refuses. A
   greyed control that a direct route, a deep link, or a keyboard path still reaches is a label, not
   a disablement, and this row already rejected labels.
2. **Enumerate every entry point to the flow before you change one.** Tool tile, reports catalog
   row, any deep link, any CTA elsewhere in the workbench. A fix on one entry with three left open
   is the call-site defect class this program keeps finding. Name the full set in your close.
3. **Confirm the tool did not vanish.** The operator ruled for disclosure, not concealment: the
   customer should see record request labelled coming-soon, not find it missing. If your change
   removes it from view, that is the wrong half of the ruling.
4. **Do not let it read as an error or a lock.** Coming-soon is neither a failure nor an upgrade
   prompt. If the disabled state renders through an error or entitlement-refusal component, it will
   read as "you cannot afford this" or "something broke", both of which are false.
5. If you find record request is already unreachable from some surface, say so rather than adding a
   second mechanism on top. An honest no-op on that path is a result.

### Known traps

- **A claim in the upstream reconciliation did not survive verification, so do not inherit its
  siblings.** That doc cited a `LayersControl.tsx` disclosure mechanism as existing; the P-241 lane
  found **no such mechanism in current code**. Verify any pattern you intend to reuse actually
  exists at `origin/main` before you build on it.
- `P:/hauska-map` may be stale. Read `origin/main` after an explicit fetch, and cut your worktree
  from `origin/main`.
- **hauska-map does NOT auto-deploy.** Vercel ships by CLI from the repo root of a clean clone at
  `origin/main`, per app. Merged is not shipped; say so plainly in your close.
- `Age:` cannot tell you which build is serving. Use asset existence against the live alias: the
  live build returns `application/javascript` for its own `/assets/index-*.js`, every other build
  falls through to the SPA handler as `text/html` **with HTTP 200**.

### Do not

- Do not touch `artifacts/smartsite-mcp` or anything in `legacy-design-tools`. Another lane owns it.
- Do not change tier boundaries, pricing, or entitlement policy. Coming-soon is not an upgrade gate.
- Do not remove record request from view.
- Do not set or imply a return date. None was decided.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name every entry point you enumerated and what each does now. State how you proved the purchase
path refuses, including the direct or deep-link route if one exists. Confirm the tool is still
visible and reads as coming-soon rather than as an error or a lock. Declare `leave_behind`
explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p242b-coming-soon-web_cp1.json
  CP2: _inbox/2026-09-15_p242b-coming-soon-web_cp2.json
  CLOSE: _inbox/2026-09-15_p242b-coming-soon-web_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in p:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p242b-coming-soon-web",
    "planRows": ["P-242"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
