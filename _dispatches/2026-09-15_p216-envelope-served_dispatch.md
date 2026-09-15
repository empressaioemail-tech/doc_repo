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

PLAN-ROW: P-216 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p216-envelope-served --seat <your-seat-id> --plan-row P-216 --dispatch _dispatches/2026-09-15_p216-envelope-served_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p216-envelope-served --seat <your-seat-id>

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


## Mission — P-216: San Marcos is told its lots have no buildable area, from a figure R-2 refuses to publish

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

**This is the only open row where a customer can act on a wrong answer to their own detriment.
Treat it that way.**

### What a customer sees, measured live 2026-09-15

`GET https://smartsite.cloud/api/spine/property-atoms/48209%3A97658/facets` returns:

```json
"envelope": {
  "status": "no-buildable-area",
  "district": "SF-6",
  "setbacks": { "front_ft": 25, "side_ft": 5, "rear_ft": 20 },
  "buildableAreaPct": 0,
  "buildableAreaSqFt": 0,
  "emptyReason": "Setbacks consume the lot — no buildable area remains.",
  "approximate": true, "provisional": true,
  "disclosure": "Reader-composed axis override (parcel_record) applied to one or more
                 setback axes; other axes remain atom-chain-sourced."
}
"facetCoverage": { "envelope": true }
```

Four of four adjacent Sturgeon Dr parcels return this: 97650, 97651, 97652, 97658. A random
Hays sample of six returned three more zeros against three positive percentages (44.9, 49.8,
61.5), so it is widespread and not universal.

### Defect 1: we publish what our own ruling refuses

**R-2 refuses the envelope family** — `buildableAreaSqFt`, `buildableAreaPct`,
`envelopeStatus`, `envelopeDisclosure` read zero BY RULING. The MCP path honours that and
returns `refused / atom_path_pending`. **This path computes and serves it anyway**, and
`facetCoverage.envelope: true` claims coverage the ruling declines.

A fabricated zero is worse than an absence. A zero reads as a finding and enters whatever the
reader does next; an absence forces a decision.

### Defect 2, and it may be the worse one: the zero is probably WRONG

`48209:97658` is roughly 55 x 138 ft, 8,615 sq ft, with 25/5/20 setbacks. That leaves on the
order of 4,200 sq ft buildable. "Setbacks consume the lot" is not plausible for this parcel.

**HYPOTHESIS, not a finding — falsify it rather than confirming it.** The served ring has NINE
edges for a near-quadrilateral, five of them labelled `side`. If the computation insets every
edge labelled `side`, a long narrow lot collapses to zero. Read the write path. If the cause is
something else, that is the deliverable and you say so.

Whatever the cause: **a zero must be proven against geometry before it is served.** A
"no-buildable-area" verdict is a substantive negative claim about someone's property.

### Defect 3: the payload is a hybrid wearing one date

`snapshotAt` reads `2026-07-23`, 54 days stale — but the payload's own `disclosure` says some
setback axes come from `parcel_record` (written 2026-09-15) while others remain atom-chain. So
it is part September, part July, labelled July. This is what P-200's pre-registered falsifier 3
caught: the store write was real and the customer surface did not reflect it.

A hybrid payload carries the vintage of its NEWEST axis, or it declares the mix in a form a
reader can act on. One stale timestamp over mixed-age content is a label that lies.

### Defect 4: 35,365 values were written with unreadable provenance and no conflict row

Every setback cell P-200 wrote carries:

```json
{"value": 25, "source": "@empressaio/setback-corpus@1.1.0:san-marcos-tx",
 "dateBasis": "unreadable", "sourceDate": null, ...}
```

The 2026-09-11 setback-source ruling ("most current wins") states that **an unreadable source
date produces a CONFLICT ROW**. 35,365 values were written without one. The apply reconciled to
the row against its prediction, which is exactly why nobody read what the values said about
themselves — the integration seat included.

In scope for you: raise the conflict row the ruling requires, or establish with evidence that
`dateBasis: unreadable` here does not meet the ruling's trigger. Do not silently accept it.

### Sequencing, and it is not optional

**PR #691 is OPEN and UNMERGED in legacy-design-tools** (P-214's fix) and touches nearby
composition code. Coordinate with it: rebase onto it or state why you do not need to. Do not
merge it for another lane.

**A merge to legacy-design-tools main AUTO-DEPLOYS.** Nothing ships without the operator's go.

### Falsifiers, pre-register before you write anything

- If you suppress the envelope and the panel then shows nothing where a customer expects a
  finding, you have traded a wrong answer for a silent one. R-2's refusal must be VISIBLE as a
  declared refusal, not a blank.
- If you "fix" the zero by making the number positive without establishing why it was zero, you
  have changed a wrong number into a different wrong number.
- If your fixture passes on the pre-fix code, it does not test this.
- If the 44.9 / 49.8 / 61.5 parcels also stop serving a percentage, check whether that is
  correct under R-2 rather than assuming it is collateral.

### Do not

Change the setback corpus or any ruled table. Invent a buildable figure. Touch `smartcity-os`
or `smartcity-dashboards`. Deploy without the operator's go.

### Close

`_inbox/<date>_p216-envelope-served_close.json`, `planRows` `["P-216"]`, with: which code path
computes and serves the envelope, the cause of the zero with the rejected alternative, the
fixture failing before and passing after, a live re-read of all four Sturgeon Dr parcels, the
disposition of the hybrid vintage, and what you did about the unreadable `dateBasis`.
`leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Six lanes this week left doc_repo artifacts
stranded in a worktree where no instrument could see them.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p216-envelope-served_cp1.json
  CP2: _inbox/2026-09-15_p216-envelope-served_cp2.json
  CLOSE: _inbox/2026-09-15_p216-envelope-served_close.json
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
    "lane": "p216-envelope-served",
    "planRows": ["P-216"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
