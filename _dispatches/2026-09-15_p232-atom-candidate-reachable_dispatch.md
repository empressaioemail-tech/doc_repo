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

PLAN-ROW: P-232 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p232-atom-candidate-reachable --seat <your-seat-id> --plan-row P-232 --dispatch _dispatches/2026-09-15_p232-atom-candidate-reachable_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p232-atom-candidate-reachable --seat <your-seat-id>

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


## Mission — P-232: six districts already have usable setbacks and the gate order makes them unreachable

### The finding you are acting on

P-225's census (`_inbox/2026-09-15_p225_census.json`) established that of Bastrop's 16 live
zoning district codes, **all six uncodified ones are BDC conditional codes whose scalars
already exist on GIS layer 23 and are served today by the facets route** — GC, MU and their
siblings. They cover **3,825 parcels in the demo county**.

**No acquisition is required. The data is already in the system and being served on another
route.** What blocks it is control ORDER.

In `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`,
`resolveAuthoritativeSetbacks` does this:

```
const table = getSetbackTableForZoning(jurisdictionKey, districtCode);
if (!table?.districts.length) return null;
const mapped = mapDistrict(table, districtCode);
if (!mapped || mapped.kind === "fallback-conservative") return null;   // <-- returns here

const candidates = [codifiedCandidate(table, mapped)];
const atomC = args.atomRule ? atomCandidate(args.atomRule) : null;      // <-- never reached
if (atomC) candidates.push(atomC);
```

`args.atomRule` is already passed in by the caller. The atom candidate is constructed AFTER
the codified-table gate, so when the table has no row the function returns null before the
atom rule is ever looked at. **The capability is present and the control order makes it
unreachable** — the same class as the Bastrop parcel-node instance recorded in
ENFORCEMENT.md, where a live county check sat after the gate that had already declined.

Customer-visible consequence, measured 2026-09-15: `POST /brokerage/v1/place/buildable-envelope`
returns `404 no-district` with reason "No authoritative setback source covers this district"
for a GC parcel, and no buildable envelope is drawn at all — an empty map with no explanation.
An SF-1 parcel on the same street returns a real Polygon.

### Done looks like

Where the codified table has no usable row for a district **but the atom chain carries a
usable dated setback rule**, the resolver serves the atom candidate — with its own provenance,
source label and date — instead of returning null. R-1 date-first ranking still applies to the
candidate set; you are making the atom candidate REACHABLE, not making it win by default.

Proof: a Bastrop GC parcel returns a real polygon from the live derive where it returns
`404 no-district` today. **Verify on the MAP, not the API.** The API and the map are different
read paths and the API looked healthy the whole time the map was blank on 2026-09-15.

### The line you must not cross

**A district with no usable candidate on EITHER side must still refuse.** This row makes an
existing value reachable; it does not manufacture one. If the codified table has no row and
the atom chain has no usable rule, `404 no-district` is the correct answer and must survive.

Do not widen a setback table. Do not invent a value. Do not lower the bar for what counts as
a "usable" atom rule in order to make more parcels draw — an unusable rule that draws a
polygon is worse than an honest refusal, because a customer can build on it.

### Falsifiers, pre-register your answers before you run anything

1. **Pick a district with no codified row AND no usable atom rule and confirm it STILL returns
   `404 no-district`.** If everything now draws, you removed the gate rather than reordering
   it, and this row is failed regardless of how many parcels light up.
2. Take a district that HAS a codified row and confirm its served setbacks are unchanged. If a
   codified district starts serving atom-chain values, you inverted the precedence instead of
   extending the candidate list.
3. Confirm the served GC values match what the facets route already serves for the same parcel
   (20/5/20 on the parcel measured in P-225). If the two routes disagree, you have created a
   new instance of the served-answer-contradicts-itself class rather than closing one.
4. If the parcel count that starts drawing is materially different from the census's 3,825,
   suspect your change's scope before believing the number.

### Known traps

- `district_name` matching takes the FIRST TOKEN. `C-2 General Commercial` matches code `C-2`,
  never `GC`. Two districts that mean the same thing in prose are different codes here.
- The resolver ranks date-first through `@empressaio/setback-corpus/resolve` (R-1,
  most-current-source-wins), with authority tier breaking ties only when dates are equal or
  unreadable. An atom rule with an unreadable date does not automatically lose — read the
  resolver rather than assuming.
- `conflict` is already part of this function's return shape. If a codified row and an atom
  rule disagree, disclose it the way the existing code does; do not silently pick.
- legacy-design-tools does NOT auto-deploy. A merge there builds an image only; the deploy is a
  deliberate workflow_dispatch canary plus a traffic shift, owned by the integration seat.

### Do not

- Do not change, add or remove any setback VALUE or table row.
- Do not touch `getSetbackTableForZoning`'s jurisdiction routing. The routing is correct; the
  candidate ordering is the defect.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State the parcel you verified on the map and what it drew. Close to `_inbox/` on doc_repo main
and PUSH it. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p232-atom-candidate-reachable_cp1.json
  CP2: _inbox/2026-09-15_p232-atom-candidate-reachable_cp2.json
  CLOSE: _inbox/2026-09-15_p232-atom-candidate-reachable_close.json
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
    "lane": "p232-atom-candidate-reachable",
    "planRows": ["P-232"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
