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

PLAN-ROW: P-235 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p235-envelope-front-line-writetime --seat <your-seat-id> --plan-row P-235 --dispatch _dispatches/2026-09-15_p235-envelope-front-line-writetime_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p235-envelope-front-line-writetime --seat <your-seat-id>

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


## Mission — P-235: fix the envelope front line on curved frontages, at the write path

### What P-226 already established, so you do not re-derive it

P-226 ran as a read-only diagnostic and answered the ownership question. **Do not re-open it.**

- The defect is **write-time**, not draw-time.
- It lives in **legacy-design-tools**, `artifacts/api-server/src/lib/buildableEnvelope/
  {derive,geometry,edgeLabeling}.ts` — **not** hauska-engine. P-226 traced the live call
  (`fetchBuildableEnvelope` → `POST {cortex}/brokerage/v1/place/buildable-envelope`) and found
  the implementation entirely in this repo, a different function from hauska-engine's
  similarly-named `labelEdgesFromRoads`. That correction is the second time in two days a
  dispatch's stated repo was wrong, and both were caught by tracing the call.
- `insetParcelBySetbacks` in hauska-map is **confirmed dead code** and was deliberately left
  untouched. It computes a UNIFORM inset (front, side, rear averaged), so it cannot produce a
  correct front setback by construction. **Do not wire it up.**

### The candidate cause — named by P-226, explicitly UNVERIFIED

`geometry.ts`'s per-edge rectangle-strip union (`buildForbiddenStrips`) has **no mitred or
rounded join at ring vertices**, so it can UNDER-COVER the forbidden area at each convex joint
of a multi-chord curved frontage. That is a plausible mechanism for a front line that hugs the
street across a whole curve, and it is distinct from the already-fixed single-spike case that
produced `stripRingSpikes`.

**Confirm or refute this by reading the union construction BEFORE you edit anything.** P-226
did not verify it and said so. If it is wrong, say so and name what is actually happening — a
fix built on an unverified mechanism is a guess that passes its own test.

### The symptom, and the parcel

Operator-reported on a radius-street parcel: the front line of the drawn envelope lands on or
inside the street frontage rather than offset from the true front property line, so the
envelope reads as extending into the right of way. Work from `48453:289990`
(2407 PRINCETON DR, Travis), where Princeton Drive curves.

A documented prior of the same geometry class, same county: 2026-08-24,
17005 Simsbrook / `48453:280239` — a curved frontage digitized as near-collinear chords made
the derive emit zero-width out-and-back excursions. That produced `stripRingSpikes`, a
DRAW-TIME compensation whose own comment states the verbatim server geometry still flows to
the export paths untouched. **You are fixing the source that compensation was hiding.**

### Done looks like

On the named radius-street parcel the drawn front edge is offset from the frontage by the
district's front setback and never crosses it. A straight-frontage parcel is unchanged. A
second, independently chosen curved-frontage parcel is also correct.

### Falsifiers, pre-register your answers before you run anything

1. **A fixture built from the named parcel's REAL ring that FAILS before your change and
   PASSES after.** Not a synthetic ring shaped to your hypothesis — the real one.
2. **A straight-frontage parcel must be unchanged.** If straight lots move, you altered the
   general inset rather than the joint behaviour.
3. **A second curved-frontage parcel must also be correct.** If only the named one works, you
   fitted to one ring.
4. **If the drawn envelope's AREA changes as a side effect, check it against what the facets
   route serves for the same parcel.** A geometry fix that silently moves a published figure
   creates a new served-answer-contradicts-itself instance, which is the class P-232 just
   closed. Disclose or reconcile; do not let the two drift.
5. If you conclude the `buildForbiddenStrips` mechanism was wrong, the row still closes — with
   the real mechanism named. An honest refutation is a result.

### Known traps

- **Verify on the MAP, not the API.** The API read healthy for the entire 2026-09-15 outage
  while the map was blank. The PDF export path also consumes the verbatim server geometry with
  no spike stripping, so it is a second useful witness.
- **This repo does NOT auto-deploy.** A merge builds an image only; the deploy is a deliberate
  `workflow_dispatch` canary with the FULL 40-char sha then `shift-traffic`, owned by the
  integration seat.
- `stripRingSpikes` exists at draw time and only DELETES zero-width reversal spikes — it never
  moves or adds a vertex. Do not assume it is masking your fix; do not change it.
- One pre-existing, unrelated gap found by P-232 and NOT fixed: `derive.ts` does not read
  `max_lot_coverage_pct`'s own `not_specified` provenance, affecting real codified Bastrop rows
  today. If you are in `derive.ts` anyway, note it; do not silently fold it in.

### Do not

- Do not change any setback VALUE, table row, or jurisdiction routing.
- Do not wire up `insetParcelBySetbacks`.
- Do not edit hauska-engine or hauska-map.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State whether `buildForbiddenStrips` was the mechanism, with the read that establishes it.
Name the parcels you verified and what they drew. Close to `_inbox/` on doc_repo main and PUSH
it. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p235-envelope-front-line-writetime_cp1.json
  CP2: _inbox/2026-09-15_p235-envelope-front-line-writetime_cp2.json
  CLOSE: _inbox/2026-09-15_p235-envelope-front-line-writetime_close.json
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
    "lane": "p235-envelope-front-line-writetime",
    "planRows": ["P-235"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
