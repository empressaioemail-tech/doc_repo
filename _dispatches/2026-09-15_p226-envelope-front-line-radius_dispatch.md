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

PLAN-ROW: P-226 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p226-envelope-front-line-radius --seat <your-seat-id> --plan-row P-226 --dispatch _dispatches/2026-09-15_p226-envelope-front-line-radius_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p226-envelope-front-line-radius --seat <your-seat-id>

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


## Mission — P-226: the buildable envelope draws its front setback line into the street on curved frontages

### The finding you are acting on

Operator-reported from live `smartsite.cloud`, 2026-09-15, on a radius-street parcel: the
front line of the drawn buildable envelope lands ON or INSIDE the street frontage rather than
offset from the true front property line by the district's front setback. The rendered
envelope reads as extending into the right of way.

**Named parcel to work from: `48453:289990`, 2407 PRINCETON DR, Travis.** Princeton Drive
curves at that lot, and the envelope draws there today (the operator's screenshot shows the
amber inset and a front edge running along the frontage).

**A documented prior of the same geometry class, in the same county:** 2026-08-24,
17005 Simsbrook / `48453:280239`, where "a curved frontage digitized as several near-collinear
chords" made the server's derive emit an inset ring carrying zero-width out-and-back
excursions at each chord junction. That produced `stripRingSpikes` in
`apps/property-explorer/src/browse/envelope-overlay.ts`, which is a DRAW-TIME ONLY
compensation whose own comment is explicit: "The verbatim server geometry still flows to the
node store / export paths untouched."

So there is already one known case of curved frontage breaking this geometry, and the existing
remedy deliberately does not touch the source.

### FIRST TASK, and it decides who owns the fix: draw-time or write-time

**Do not start by editing the overlay.** Establish where the defect lives.

The inset polygon the map draws comes from the SERVER — the live derive
(`POST /brokerage/v1/place/buildable-envelope`, `labelEdges+derive`). `normalizeEnvelope`
reads the geometry the server produced; the client's only geometry work is `stripRingSpikes`
at draw time. So the bad front edge is plausibly computed server-side, in hauska-engine.

**There is a clean discriminator available and you should use it first.** The PDF export path
consumes the VERBATIM server geometry with no spike stripping, while the map applies
`stripRingSpikes`. Therefore:

- Generate a site plan for `48453:289990` and inspect its drawn front edge.
- **If the PDF shows the same front-line-into-the-street defect, the defect is WRITE-TIME**
  (server geometry), and it lives in hauska-engine's
  `packages/engine-core/src/geometry` / the edge-role labelling P-216's own leave_behind
  already named as an unreformed write-time defect.
- **If the PDF is correct and only the map is wrong, the defect is DRAW-TIME** and it is yours.

(The site plan for a straight-street parcel, `48021:34049`, renders a clean rectangular
envelope with correct offsets — decoded from the PDF 2026-09-15 — so you have a known-good
comparison of the same renderer on a non-curved frontage.)

**IF IT IS WRITE-TIME, STOP AND HAND BACK.** hauska-engine is claimed by another lane right
now (`p221-xray-feasibility-subset`). Do not write to it. Report the finding with the file and
function you believe owns it, and the integration seat will sequence it. A correct diagnosis
handed back is a complete result for this row.

### Done looks like

Either:

**(a) Draw-time, and fixed here.** On `48453:289990` the drawn front edge is offset from the
frontage by the district's front setback and never crosses it, proven by a fixture built from
that parcel's REAL ring that fails before the fix and passes after. Plus a second curved-
frontage parcel confirming it is not a one-parcel patch.

Or:

**(b) Write-time, and diagnosed here.** The file and function that computes the front-edge
inset is named, the reason the front edge lands on the frontage is stated, and the row hands
off to hauska-engine with the evidence. No hauska-map code is changed to hide a server defect.

**The row does NOT close by fixing the symptom at whichever layer is cheaper to touch.** Say
which layer owns it and act accordingly.

### A dormant mechanism you will find, and must not wire up by reflex

`insetParcelBySetbacks` in `envelope-overlay.ts` is exported, unit-tested, and **called from
nowhere in production** — its only references are its own test file. Its module comment
describes it as the fallback used "when the server gave setbacks + a real parcel ring but no
inset polygon." It is dead code.

It also computes a **uniform** inset — front, side and rear averaged into one distance. That
is explicitly an approximation for the visual. **Do not wire it up as the fix for this row.**
A uniform inset cannot produce a correct front setback by construction, so using it here would
replace a wrong line with a differently wrong line. If you conclude it should be deleted or
revived, say so as a finding; that is a separate decision.

### Falsifiers, pre-register your answers before you run anything

1. If the PDF for `48453:289990` shows the SAME defect as the map, the defect is not in the
   overlay and any fix you make in hauska-map is masking, not fixing. Say so.
2. If your fix makes the front edge correct on the named parcel but you cannot produce a
   second curved-frontage parcel where it is also correct, you have fitted to one ring.
3. If the drawn envelope's AREA changes as a side effect, check it against what the facets
   route serves for the same parcel. A geometry fix that silently moves a published figure is
   a new served-answer-contradicts-itself instance.
4. If the front edge becomes correct by moving the whole envelope inward uniformly, you have
   applied the uniform-inset approximation and not fixed the per-edge computation.

### Known traps

- **The envelope draw is entitlement-gated.** `handleEnvelope` computes
  `mayDraw = snap != null && isEntitled(snap)` and calls `setEnvelopeOverlays([])` when false.
  If nothing draws during your testing, confirm entitlement before concluding the geometry is
  broken.
- **hauska-map does NOT auto-deploy.** Vercel CLI from the REPO ROOT (the project's Root
  Directory is already `apps/property-explorer`, so deploying from inside it fails), from a
  clean clone at origin/main. The local `P:/hauska-map` checkout is hundreds of commits behind
  on a feature branch and must not be used.
- **Verify on the MAP, not the API.** The API read healthy for the entire duration of the
  2026-09-15 outage while the map was blank.

### Do not

- Do not write to hauska-engine. It is claimed.
- Do not wire up `insetParcelBySetbacks`.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State plainly whether the defect is draw-time or write-time and what established it. Name the
parcels you verified on the map. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p226-envelope-front-line-radius_cp1.json
  CP2: _inbox/2026-09-15_p226-envelope-front-line-radius_cp2.json
  CLOSE: _inbox/2026-09-15_p226-envelope-front-line-radius_close.json
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
    "lane": "p226-envelope-front-line-radius",
    "planRows": ["P-226"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
