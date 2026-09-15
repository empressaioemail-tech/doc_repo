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

PLAN-ROW: P-217 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p217-payload-coherence --seat <your-seat-id> --plan-row P-217 --dispatch _dispatches/2026-09-15_p217-payload-coherence_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p217-payload-coherence --seat <your-seat-id>

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


## Mission — P-217: a served payload whose parts contradict each other refuses, instead of picking a half

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### DO NOT START UNTIL P-216 HAS CLOSED

P-216 is in the same repo and edits the same composition path. Two lanes in one composer is how
work gets swept. Check `_catalog/lane_claims.json` before claiming; if `p216-envelope-served`
is held, stop and say so rather than working around it.

### Why this is one control and not seven rows

Seven instances measured in two days, each on a different rail or a different reader:

```
1  brief says land use ABSENT (join-hold) while draw.attrs prints C1, same response
   -> P-207, FIXED and deployed
2  brief setbacks-envelope PRESENT 30/10/30/20 while the envelope overlay in the SAME
   response reads refused / atom_path_pending
   -> P-214 defect 2, root-caused, NOT FIXED -- this is your live fixture
3  stub depth reports envelope PRESENT; depth-node reports it refused. Same parcel,
   same moment, two readers
4  parcel_gate_verdict reports owner and landUseCode PASS at 0 unaccounted on all six
   counties while the serve returns a LANDUSE_JOIN_HOLD absence  -> F27
5  the panel evaluates "expected 5ft for role side" against a served sideFt: 10  -> P-214
6  a card prints "the county's parcel id does not match the appraisal record, so zoning
   is unavailable" and then prints "ZONING SF-6" two rows below it
   -> operator screenshot 2026-09-15
7  the store holds September setback cells while the serve labels the payload July
   -> P-216
```

**These are not seven bugs. Nothing checks that a served answer agrees with itself before it
reaches a customer.** Instance 2's own root cause proves the two halves were never going to
agree on their own: the baked-facets route unconditionally nulls `facets.envelope` at bake time
and the MCP JSON has no equivalent of the web panel's client-side live-derive augment.

### Build a REFUSAL, not a detector

Canon, 2026-09-15: this operation has a long record of building detectors later found dormant,
starved, or vacuous — including a drift self-test that was passing while blind to the exact
drift it existed to catch. A refusal that fires beats a report nobody reads.

So: a response whose sections make opposite claims about the same rail **fails to serve**, and
says which two parts disagreed. Not a warning field. Not a log line.

### Answer the three-question gate in your close

1. What executes it? 2. What triggers it? 3. What fails, and is that running in production?
4. What bypasses it — name the paths that reach a customer without passing through.

### THE HONEST LIMIT, and you must state it rather than oversell the control

This is **internal consistency within one payload**. Our own doctrine warns that this looks
meaning-shaped and is not: one upstream fabricating both halves satisfies it, because a single
party can satisfy both sides. It catches CONTRADICTION. It does not catch a wrong source that
agrees with itself.

Say that in the close. A control described as stronger than it is becomes the reason nobody
builds the stronger one.

### Done looks like

A refusal that fires on instance 2, which is unfixed and therefore live today, proven by
violation on a fixture built from a real parcel. And a demonstration that a coherent payload
still serves — a refusal that blocks everything is worse than the defect.

### Falsifiers, pre-register before you write anything

- If your fixture passes on the pre-fix code, it does not test this.
- If the refusal fires on a payload whose parts legitimately differ (a rail absent in one
  section and simply not carried in another is NOT a contradiction), your predicate is too
  broad and it will teach the fleet to bypass it.
- If it cannot fire on instance 2 as it exists today, you built it against a hypothetical.
- If you find yourself listing rails by hand to compare, ask whether the type can express the
  constraint instead. A compiler-enforced discriminated union has no trigger to be missing.

### Do not

Fix any of the seven instances — this row builds the control, the instances have their own
rows. Touch `smartcity-os` or `smartcity-dashboards`. Deploy without the operator's go; a merge
to legacy-design-tools main AUTO-DEPLOYS.

### Close

`_inbox/<date>_p217-payload-coherence_close.json`, `planRows` `["P-217"]`, with: the
three-question gate answered including bypasses, the violation proof both directions, the
fixture, and the honest-limit statement in your own words. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.**

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p217-payload-coherence_cp1.json
  CP2: _inbox/2026-09-15_p217-payload-coherence_cp2.json
  CLOSE: _inbox/2026-09-15_p217-payload-coherence_close.json
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
    "lane": "p217-payload-coherence",
    "planRows": ["P-217"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
