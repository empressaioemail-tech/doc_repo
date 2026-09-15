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

PLAN-ROW: P-227 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p227-standalone-vs-composed --seat <your-seat-id> --plan-row P-227 --dispatch _dispatches/2026-09-15_p227-standalone-vs-composed_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p227-standalone-vs-composed --seat <your-seat-id>

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


## Mission — P-227: the composed report is right and the standalone route is wrong, on three reports at once

**THIS IS A DIAGNOSTIC LANE. Its deliverable is a RULING, not a fix.** Do not change
behaviour in this pass. If you find the fix while reading, name it and stop.

### The finding you are acting on

Measured on production 2026-09-15, operator QA capture
(`_inbox/2026-09-15_reports_scope_handoff.md`, raw log `_inbox/2026-09-15_qa_capture_log.md`):

```
                composed inside feasibility        standalone
site plan       correct identity                   asserts a record-miss that did not happen   (P-222 D3)
flood           renders, stamped FD-48453-289990   times out                                   (QA-01/QA-03)
x-ray           n/a                                pipeline_output_absent, 422                 (P-221)
feasibility     the composer itself, 13 pages ready
```

Flood's two halves are the same parcel (`48453:289990`, 2407 PRINCETON DR, Travis) in the
same session: the standalone route timed out while the composed flood figure rendered as
sheet 1 of a ready feasibility study. So the model runs.

**P-222 documented this shape for site plan and read it as that report's bug. Connecting
flood and x-ray to it is the reason this row exists.** Your job is to establish whether that
connection is real.

### The question, and it is a real question

**One cause, or three that rhyme?** Card the answer, do not assume it. There are two live
hypotheses and they predict different fixes.

**H1 — one cause: the composer resolves inputs the standalone routes do not.** If true,
P-221 and P-222 D3 become symptoms of this row rather than independent rows, and one fix
retires all three.

**H2 — three that rhyme, and flood is NOT the same mechanism.** There is a DOCUMENTED,
closely-matching prior you must test before accepting H1:

> `hauska-engine-api POST /v1/property-nodes/<id>/feasibility-export/refresh` returned 201
> after **85 to 154 s** for Travis parcels. PE's `FEASIBILITY_ENGINE_TIMEOUT_MS = 55_000`
> (`pe-feasibility-export-handler.ts:61`, Vercel maxDuration 60) and smartsite-mcp's
> `REFRESH_TIMEOUT_MS = 55_000` (`feasibility-export.ts:16`) **abort first**. The download
> endpoint then serves the finished PDF in 0.2 s. The app string "engine timed out, usually a
> cold start" **names the wrong mechanism**. The engine had run every time.

QA-01's string is *"Drainage study timed out — the model run (DEM fetch + hydrology) can take
up to a minute on a cold start."* That is the same wrong-mechanism shape, on a Travis parcel,
and QA-03 independently proves the model completes. **If flood is a synchronous route whose
engine outruns a client abort, it is a timeout defect, not an input-resolution defect, and
folding it into H1 would be wrong.** P-155 already fixed that class for feasibility with an
async refresh plus poll-download; if flood is the same class the fix is to port that pattern,
which is a different row from P-221 and P-222.

Do not resolve this by preferring the tidier story. Resolve it by reading.

### How to discriminate — read code, do not measure outputs

**Do NOT start by generating more reports.** Every one of these already passed whatever check
the standalone route runs, so measuring output applies the very predicate that admitted the
defect. Output measuring is how this operation certified broken things before.

1. **Read the engine's request log for a standalone drainage run BEFORE touching the engine.**
   If the engine returns 2xx after the client has gone, H2 is live for flood and you are
   done with that leg. Read the request's own log line, not `latestReadyRevisionName` and not
   a proxy for it.
2. **Read the composer's input-resolution path against one standalone route's, in the same
   sitting.** Name the file and function on each side. State which resolver, adapter and
   vintage each one calls. If they call the same resolver, H1's mechanism is not
   input-resolution and you must say so.
3. **Rule the second mechanism in or out EXPLICITLY, do not skip it.** The standalone routes
   may read a different adapter or vintage than the composer. There is a documented instance
   of exactly this class: the PE panel reads hauska-map's own atom chain rather than cortex,
   so a record-served cutover reaches MCP and never reaches the browser. Rule it out by
   reading which resolver each route calls, and say which.

### Constraints that bound any fix you propose

- **P-221's refusal is CORRECT in form and must not be weakened.** Declining to emit a hollow
  report is the behaviour we want. The bug is that it has to, not that it does.
- **P-119 is the framing.** Solo is exactly "Property X-ray and Flood & Drainage". QA-01 and
  QA-02 are BOTH of Solo's deliverables, so the entry SKU currently ships neither. This is
  one product failure, not two loose defects.
- **A derived X-ray must not leak Studio content into a Solo SKU.** X-ray is Solo, feasibility
  is Studio. That constrains any "simplified feasibility study" shape and the operator's 3-4
  sheet target.
- **QA-02 is NOT new work and is NOT yours to build.** P-120 rowed "redefine X-Ray as a subset
  view of the Feasibility model rather than a separately-derived assembler" on 2026-09-07 and
  it has sat. If your ruling bears on why it stalled, say so. Do not re-decide it.

### Known traps

- **Read the authoritative record, never a proxy.** The revision that served a request is on
  that request's log line. The image a revision runs is its digest, not the tag requested.
- **A 200 is not a success.** A parked domain returns 200; a Vercel SPA fallback returns the
  index page as `text/html` with 200 for a missing asset. Check served content, not status.
- **A cold start is a real thing and also a real alibi.** One probe returning a failure on a
  0-traffic revision proves nothing; retry before concluding.
- **Never pipe an enumeration through `tail`.** It truncates silently and a zero reads as
  "nothing is wrong".

### Done looks like

A written ruling that says ONE CAUSE or SEVERAL, with the file and function on each side that
establishes it — not an output diff. Plus: either the row id that covers the standalone flood
generate-failure, or a statement that this row absorbs it. Plus: the second mechanism
explicitly ruled in or out. Plus: a proposed sequence for QA-02 that respects P-221's blocker.

### Falsifiers, pre-register your answers before you run anything

1. If the engine log shows a standalone drainage run returning 2xx after the client aborted,
   H1 is WRONG for flood and you must say so even though H1 is the tidier story.
2. If the composer and the standalone route call the SAME resolver with the same vintage, then
   input resolution is not the cause and H1 needs a different mechanism or must be abandoned.
3. If you find yourself concluding "one cause" without a file and function for each of the
   three symptoms, you have pattern-matched rather than read.

### Do not

- Do not fix anything. This lane rules; a later lane builds.
- Do not weaken P-221's refusal.
- Do not deploy. hauska-engine has NO deploy workflow; a merge there ships nothing.
- Do not write to any production store.
- Do not re-decide P-120.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Close to `_inbox/` on doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if
the answer is `none`. State your snapshot (repo, branch, commit) in the close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p227-standalone-vs-composed_cp1.json
  CP2: _inbox/2026-09-15_p227-standalone-vs-composed_cp2.json
  CLOSE: _inbox/2026-09-15_p227-standalone-vs-composed_close.json
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
    "lane": "p227-standalone-vs-composed",
    "planRows": ["P-227"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
