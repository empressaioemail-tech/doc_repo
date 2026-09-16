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

PLAN-ROW: P-237 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-mcp-server

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p237-metering-enforcement --seat <your-seat-id> --plan-row P-237 --dispatch _dispatches/2026-09-16_p237-metering-enforcement_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p237-metering-enforcement --seat <your-seat-id>

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


## Mission — P-237: make the metering ruling enforceable, and date the X-ray regression

### The ruling you are protecting, and the hole in it

**RULED (operator, 2026-09-15): accept that a genuinely hollow X-ray refresh consumes a meter
tick.** A tick costs nothing today, verified on deployed main: `handleSettledOveragePayment` has
**zero call sites**, so the outbound RevenueRouter is dormant, and `source-obligation-meter.ts:224`
sets `amountMinor` to a number only when `perReferenceRateMinor` is finite — today rows land
`amount_minor: null` with `graceTerms: "pending-rate"`.

**The trigger is the whole point and it is UNENFORCED: moving metering after the engine's verdict
must land BEFORE any real `perReferenceRateMinor` is set.** The moment a finite rate exists, those
rows stop being free and start being wrong — customers metered for a refusal.

The ruling says so in its own words: **"Someone remembers" is not a control.** You are building the
control.

### What you are building

**A CI check that FAILS when a finite `perReferenceRateMinor` can resolve while the metering order
is unchanged.** Not a warning. Not a log. A red build.

Answer the three-question gate explicitly in your close:

1. **What executes it?** A CI job or a test. Not a role, not "the operator reviews."
2. **What triggers it?** Name the event.
3. **What fails, and is that thing running today?** A merged, correct, undeployed check enforces
   nothing.
4. **What bypasses it?** The answer is rarely none. A CI grep is bypassed by anything not passing
   through CI; a rate set at runtime from config or a database row is bypassed by a source-code
   check entirely. **If the rate can be set without touching this repo, say so plainly** — that is
   the most important sentence in your close, and it may mean the check has to live somewhere else.

### Folded into this row, same repo, same surface

**(a) Date the X-ray regression.** Both ends are now bounded. The QA capture lists X-ray artifacts
for 1505 WATER ST and 1101 CHESTNUT ST dated **2026-09-08**; P-221 measured `export_instrument
kind=dossier` as unable to generate at all on the morning of **2026-09-15**; and the integration seat
generated a dossier for `48021:34137` through the live MCP path at approximately **21:45 that
evening**, after P-221 and P-234 deployed. So it broke after 09-08 and was repaired that night —
**and nobody named what broke it.** A defect repaired without a cause can recur, and this repair took
two fixes in two repos. Bisect the gate across that window.

**(b) `verdict_line` and `brief` are documented, accepted and ignored** in the MCP tool schema. This
row's own leave_behind already names it. It is the same vestigial-argument surface P-234 removed from
the gate, so the bisect will take you straight to it. **A parameter that is accepted and ignored is
its own honesty defect**: remove them, or make the description say they do nothing.

### Repo

`hauska-mcp-server`. Free as of 2026-09-15 — P-240's `#84` merged as `744d16c`. Cut from
`origin/main` after a fetch.

### Falsifiers, pre-register your answers before you run anything

1. **Verify the check by violating it.** Set a finite `perReferenceRateMinor` in a fixture with the
   metering order unchanged and confirm the build goes RED. A check observed only passing has not
   been observed working. **Paste the red.**
2. **Then confirm it passes on the current tree**, so you have not shipped something that blocks
   everything.
3. **Confirm the check is not vacuous.** A predicate built by string concatenation that compiles to
   an alternation with an empty branch matches every input and reports success — that exact failure
   happened in this program and went into a commit message. Include a not-vacuous case that proves
   the predicate can distinguish.
4. **The bisect must name a commit.** "Something between these dates" is not a result. If you cannot
   isolate one, say what you ruled out and what remains.
5. If you find the rate cannot be set from this repo at all, the row still closes — with that
   finding stated plainly, because it means the control belongs elsewhere and the ruling still has a
   hole.

### Known traps

- Read the authoritative record, never a proxy. Whether `handleSettledOveragePayment` has call sites
  is answered by enumerating them, not by inferring from a grep of a name.
- `hauska-mcp-server` auth is the `X-Hauska-Key` header, not Bearer; a wrong header silently falls
  through to public rather than failing loudly.
- Gate enum is `public|codex|reporting|map`; legacy `cortex` normalises to `reporting`.
- Serving revision is `hauska-mcp-server-00094-nis` as of 2026-09-15, plus whatever P-240's `744d16c`
  canary lands. Read Cloud Run traffic BY FIELD, never a positional `--format=value`, and never trust
  `latestReadyRevisionName`.

### Do not

- Do not reorder metering in this lane. The ruling explicitly declined to reorder it now; you are
  building the thing that forces it to happen at the right moment.
- Do not set a real `perReferenceRateMinor`.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Answer all four gate questions, including what bypasses the check. Paste the verbatim RED from the
violation and the green from the current tree. Name the commit the bisect isolated, or state what you
ruled out. Say what you did with `verdict_line` and `brief`. Declare `leave_behind` explicitly. State
your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p237-metering-enforcement_cp1.json
  CP2: _inbox/2026-09-16_p237-metering-enforcement_cp2.json
  CLOSE: _inbox/2026-09-16_p237-metering-enforcement_close.json
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
    "lane": "p237-metering-enforcement",
    "planRows": ["P-237"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
