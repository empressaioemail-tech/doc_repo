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

PLAN-ROW: P-212 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p212-bastrop-false-retirement --seat <your-seat-id> --plan-row P-212 --dispatch _dispatches/2026-09-15_p212-bastrop-false-retirement_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p212-bastrop-false-retirement --seat <your-seat-id>

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


## Mission — P-212: 57,704 Bastrop parcels are marked retired and about 54,800 of them are live

You are a lane of OPS-24. SEVERITY-1. You do not spawn sub-agents. The integration seat
supervises you, reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What is true, measured, not reported

```
atoms, entity_type='parcel-node', jurisdiction_tenant='tx_48021'
    57,704 retired   4,690 active     = 92.5% retired

txgio_parcel, county_fips='48021'
    74,729 rows   0 null geom   62,257 DISTINCT prop_id

parcel-node atoms total 62,394  vs  62,257 distinct prop_ids  -- these MATCH
```

**Nothing is missing. The prop_ids are present and the geometry is intact. The comparison is
wrong.** The retirement status is set by a set-difference reconcile against the 2026-09-03
TxGIO reacquisition.

Containment, also measured: Hays, Caldwell, McLennan and Williamson hold **zero** retired
parcel-nodes; Travis holds 40; Ector holds 3,791. All six were reloaded on 2026-09-03, so the
reload alone did not cause this. The reconcile has only ever been run against Bastrop.

### Your fixtures, free, already verified against the county

Twenty retired parcel-nodes, drawn by `md5(entity_id)` so the window was not chosen
conveniently, queried against Bastrop County's own public cadastral FeatureServer:

```
LIVE AT THE COUNTY (19) -- these must NOT be retired:
  30544  58602  98624  42037  26132  70980  112357  51067  8736456
  29677  23036  26446  29203  8715489  123776  82068  61675  22509  34146

NOT FOUND AT THE COUNTY (1) -- your negative control:
  77293
```

`77293` is the most valuable id in this mission. A fix that un-retires all twenty is broken.
A correct fix keeps `77293` retired, or explains with evidence why it should not be.

Two of the live ids are seven digits (`8715489`, `8736456`) and two of the others are five.
`23036` returned three duplicate features from the county, which is a pre-existing
PROPID-GEOMETRY-NONUNIQUE instance and not your bug.

Endpoint, read-only, public, no auth:
`https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0/query?where=prop_id%20IN%20(...)&outFields=prop_id&returnGeometry=false&f=json`

### The order of work, and step 3 is where the trap is

**1. Read the write path.** `reconcileCountyParcelNodes` / `write-parcel-node-county.mjs`.
Find how the set-difference compares, and what makes a present prop_id read as absent.

A HYPOTHESIS, not a diagnosis, and you are expected to improve on it: PREBAKE-ENG's ENG-03
found an unfixed normalization divergence in this exact identity-continuity code
(`parcel-geometry-resolver.ts:176` needs the all-digit guard and one-digit floor that
`plan-county-parcel-nodes.ts`'s JS side already has). The mixed digit-widths above are
consistent with that. So is the 74,729-versus-62,257 duplicate spread. **If the write path says
something else, the write path wins and your finding is the deliverable.**

**2. Prove it by violation.** A fixture where the set-difference says absent and the county
says live must fail on the current code and pass after. Nineteen real ones are above.

**3. REGENERATE, DO NOT HAND-PATCH.** Do NOT write a bulk `UPDATE ... SET status='active'`.
That writes a value nobody re-derived, with no per-node record of why, and it is structurally
indistinguishable from the bad write that caused this. Repair the comparator, then **re-run the
repaired reconcile against Bastrop so the correct status falls out as a derived result**, with
a run id on every change. Our own rule: a recorded correction does not regenerate its artifact;
file the regeneration, never hand-patch.

**4. Verify by re-sampling.** Re-query the same twenty against the county after the re-run.
Expect the nineteen active and `77293` still retired.

### The guard that must exist before the re-run

The reconcile must not be able to flip an atom to retired without a live-CAD cross-check.
**The machinery already exists and is unreachable:** `parcelCurrencyFromBcadMap` is loaded in
the same batch script and sits AFTER the parcel-node gate in the loop, so it never runs once
the gate has declined. You are moving an existing capability to where it can fire, not building
a new one.

Nothing is on a schedule that would re-run this, so the freeze is a build item and not an
emergency. Do not let that make you casual: a human can run it, and running it as it stands
would reproduce this on the other five counties.

### Do not

Mass-UPDATE status. Touch the serve path — making it honour retirement is P-206 and it is
BLOCKED ON THIS ROW, because the serve path's blindness is currently the only thing keeping
92.5 percent of Bastrop visible and fixing it first would take the county dark. Un-retire
anything without the re-run producing it. Write to a repo you do not own. Deploy without the
operator's go.

Out of scope and flagged to nobody: `factory-conformant reap` runs every ten minutes carrying
a destructive verb and is unaudited. Look if it is cheap; do not chase it; do not assume it is
defective.

### Falsifiers, pre-register before you touch code

- If your fix un-retires `77293`, it is admitting everything rather than fixing the comparison.
- If the re-run leaves the count near 57,704, you repaired a comparator that was not the one
  making this decision.
- If the re-run flips ALL 57,704 to active, you have removed the retirement path rather than
  corrected it, and a genuinely gone parcel can no longer be retired.
- If you conclude Bastrop genuinely re-platformed its account space, explain why 19 of 20 old
  prop_ids still resolve at the county today.

### Close

`_inbox/<date>_p212-bastrop-false-retirement_close.json`, `planRows` `["P-212"]`, with: the
comparator defect named from the write path and the mechanism you rejected, the
violation-proof both directions, the re-run's run id and before/after counts, the twenty-id
re-sample, and the guard's new position. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Three lanes tonight left doc_repo artifacts
stranded in a worktree where no instrument could see them. If you cannot push, say so in your
handback rather than leaving them.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p212-bastrop-false-retirement_cp1.json
  CP2: _inbox/2026-09-15_p212-bastrop-false-retirement_cp2.json
  CLOSE: _inbox/2026-09-15_p212-bastrop-false-retirement_close.json
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
    "lane": "p212-bastrop-false-retirement",
    "planRows": ["P-212"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
