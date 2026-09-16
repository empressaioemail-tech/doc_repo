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

PLAN-ROW: P-244 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p244a-siteplan-compose-timeout --seat <your-seat-id> --plan-row P-244 --dispatch _dispatches/2026-09-16_p244a-siteplan-compose-timeout_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p244a-siteplan-compose-timeout --seat <your-seat-id>

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


## Mission — P-244 leg A: the standalone site-plan compose fails on its own at ~116 seconds

### The finding, measured on the authoritative record

P-240 ported site-plan export onto an async job pattern and deployed it. **Within two minutes it
exposed a defect the old synchronous path had been hiding.** Read directly from the job table,
not from tool output:

    site_plan_export_jobs  48021:34049
      queued     2026-09-16 00:49:10.784
      started    2026-09-16 00:49:10.848
      failed     2026-09-16 00:51:06.907   error_class = compose_timeout
      elapsed    ~116 s

**`compose_timeout` is a CLASSIFIER, not a ceiling P-240 introduced.** In `parcel-terrain.ts` it is
`if (/timed out|timeout/i.test(message)) return "compose_timeout"`. P-240's own stall ceilings are
5 minutes for flood and **8 minutes for site plan**, nowhere near 116 seconds. So something inside
the compose threw its own timeout at roughly 116 s - which sits exactly inside the 56.8 to 115.9 s
band A-162 measured before the port.

**This defect has always existed.** The client aborted at 55,000 ms first, so every report of it
named a cold start. It is the third time a string on these routes named a mechanism that did not
happen, and the first time the system recorded the true one.

### READ THIS BEFORE SCOPING — the scope was corrected by the operator

**This is NOT "customers cannot get a site plan."** The operator: *"I've actually never had a
problem getting a site plan."* He is right. `feasibility_export_jobs` holds 9 rows, **all `ready`,
zero failed**, and one of them is **`48021:34049` - the same parcel - completing at 19:55:15** on
2026-09-15, hours before its standalone export failed.

**So the COMPOSED path works and the STANDALONE route fails, on the same parcel.** Site plans reach
customers as SP- sheets inside a Feasibility Study. The broken route is standalone
`export_instrument kind=siteplan`, whose only consumer is the MCP connector. **Agent-surface
severity.** Scope it that way.

### The question that actually matters

**Why does the standalone compose time out when the composed one, on the same parcel, does not?**
Do not assume. P-227 established by code read that the engine is SYMMETRIC on this leg - both routes
call `composeSitePlanModelForParcel`, whose own doc says "Caller-supplied only" - and P-231 was split
out because the standalone CALLER sends a descriptor the composed path supplies correctly. **That
makes P-231's descriptor defect a live candidate cause for this timeout** (a malformed or missing
descriptor sending the compose down a slow or retrying path), and it is the first thing to rule in
or out. It is not the only candidate; name the one you find.

### Repo

`hauska-engine`. Serving `hauska-engine-api-00236-few` (P-222), deployed 2026-09-16. Cut from
`origin/main` after a fetch — the local `P:/hauska-engine` checkout has been 181 commits behind and
dirty.

### Done looks like

A standalone site-plan export reaches `ready` and the artifact downloads through the connector, on
a parcel where it currently fails.

### Falsifiers, pre-register your answers before you run anything

1. **Find the thing that throws "timeout" and name it with file and function.** A fix that raises a
   limit without naming what was slow has not found the defect.
2. **Explain the composed-versus-standalone difference on the SAME parcel.** If your explanation
   would make the composed path fail too, it is the wrong explanation - the composed path
   completes.
3. **Rule P-231's descriptor in or out explicitly.** If the standalone caller's descriptor is the
   cause, say so, and note that P-231 and this leg are then one fix.
4. **Do NOT fix this by raising the timeout.** A compose that takes 116 s and is given 300 s is still
   a compose that takes 116 s. If the work is genuinely that slow and legitimate, say so with the
   measurement and propose what should change; do not silently widen a ceiling.
5. **Verify on the authoritative record**: the `site_plan_export_jobs` row reaching `ready`, plus the
   artifact downloading. Not a 200. Not a 202.
6. If the timeout originates outside hauska-engine, the row still closes with that named. An honest
   attribution is a result.

### Known traps

- **Read the job table, not the tool output.** The MCP tool currently wraps a healthy in-progress
  job in `status: error` (that is leg B, not yours) and will mislead you about state.
- The atoms store is on Neon database `hauska_mcp`; the job tables are on the engine's own
  `DATABASE_URL`. A query against the wrong one returns a false absence.
- **Do not assume Cloud Run CPU starvation.** The jobs are detached in-process
  (`void runSitePlanExportJob(...)`) and the revision has no `cpu-throttling=false` annotation, so it
  looks plausible - **it was hypothesised by the planner and REFUTED**: the job ran a full 116 s and
  failed with a classified error, so it had CPU throughout. Do not re-raise it without new evidence.
- **hauska-engine has NO deploy workflow at all.** A merge ships nothing and nothing says so.
- PDFs use Identity-H CID fonts; drawn text is not greppable. Decode via the ToUnicode CMap.

### Do not

- Do not raise a timeout to make the symptom disappear.
- Do not touch leg B (hauska-mcp-server's error envelope).
- Do not change the composed feasibility path; it works.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name what throws the timeout, with file and function. Explain the composed-versus-standalone
difference on `48021:34049`. State whether P-231's descriptor is the cause. Show the job row reaching
`ready`. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p244a-siteplan-compose-timeout_cp1.json
  CP2: _inbox/2026-09-16_p244a-siteplan-compose-timeout_cp2.json
  CLOSE: _inbox/2026-09-16_p244a-siteplan-compose-timeout_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p244a-siteplan-compose-timeout",
    "planRows": ["P-244"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
