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

PLAN-ROW: P-225 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p225-setback-codification-census --seat <your-seat-id> --plan-row P-225 --dispatch _dispatches/2026-09-15_p225-setback-codification-census_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p225-setback-codification-census --seat <your-seat-id>

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


## Mission — P-225: which zoning districts have a codified setback row, and which draw nothing

### The finding you are acting on

Measured live on production 2026-09-15, Bastrop, by discrimination across six adjacent Old
Town parcels:

```
48021:34873  SF-1   POST buildable-envelope -> 200, real Polygon      envelope DRAWS
48021:34849  GC     -> 404 "No authoritative setback source covers this district"
48021:34833  GC     -> 404          48021:35017  GC  -> 404
48021:34769  GC     -> 404          48021:34825  MU  -> 404
```

An uncodified district returns `404 no-district` and **no buildable envelope is drawn at
all**. The customer sees an empty map with no explanation of why.

Cause, read in the write path rather than inferred from output:
`getSetbackTableForZoning` (lib/adapters/src/local/setbacks/index.ts) routes every known BDC
district to `bastrop-development-code`, which carries only SF-1/SF-2/SF-3/RR. `mapDistrict`
then falls through to `fallback-conservative`, and `resolveAuthoritativeSetbacks`
(artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts) returns null.

**The part that matters most.** The atom chain HOLDS usable GC setbacks — 20/5/20 from GIS
layer 23, served today by the facets route — and the resolver can never reach them, because
the atom candidate list is built AFTER the codified-table gate returns null. Capability
present, control order makes it unreachable. That is the documented Bastrop parcel-node class
repeating in a different file.

### What this row is

**A census, not a build.** Enumerate EVERY zoning district in EVERY city across the six
onboarded counties and record, per district, whether a codified setback row exists. The
point is to make the gap countable instead of discovered one parcel at a time by a customer.

For each district: the jurisdiction key it resolves to, the table it routes to, whether a row
exists, and — where no row exists — a disposition from exactly three: **acquire** (a real
codified source exists and should be added), **serve from the atom chain** (a usable
per-parcel value already exists and the gate order is what blocks it), or **ruled out of
scope** (with the reason).

### Done looks like

A per-district codified/uncodified census covering all six counties, each uncodified district
carrying one of the three dispositions, and the census naming the instrument that produced it
so it can be re-run. Plus a count: how many districts, and how many parcels behind them, are
currently unable to draw an envelope. The parcel count is the number that tells the operator
how much of the product is dark.

### Falsifiers, pre-register your answers before you run anything

1. If your census says a district is codified, pick one of its parcels and confirm the live
   derive returns a Polygon. If it 404s, your census is measuring the table and not the
   serve, and it is wrong.
2. If your census says a district is uncodified, confirm the live derive 404s for one of its
   parcels. If it draws, something else is resolving it and your model of the path is
   incomplete.
3. If the six counties' district lists come out suspiciously round, or a county returns zero
   uncodified districts, suspect your enumeration before believing it.

### Known traps

- **Do not fix this by widening a table.** Adding a setback row with a value you did not read
  from a real codified source is fabrication, and it converts an honest refusal into a
  confident wrong answer a customer can act on to their own detriment. NO setback value is
  invented in this row. NO setback value is changed in this row.
- **`district_name` matching takes the FIRST TOKEN.** `C-2 General Commercial` matches code
  `C-2`, never `GC`. Two districts that mean the same thing in prose are different codes to
  this resolver. Do not assume a semantic match is a resolver match.
- The setback resolver ranks date-first through `@empressaio/setback-corpus/resolve` (R-1,
  most-current-source-wins). A district can have a row and still resolve oddly. Record what
  you observe.
- Never pipe an enumeration through `tail`. It truncates silently and a zero reads as
  "nothing is wrong".

### Do not

- Do not change any setback value, add any table row, or edit any jurisdiction mapping.
- Do not reorder the resolver's gate. That is the fix, it is real, and it belongs to a
  follow-on row this census will scope — not to the census.
- Do not deploy. Merging to legacy-design-tools main does NOT auto-deploy (push builds an
  image only), but deploys are planner-owned regardless.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Close to `_inbox/` on doc_repo main and PUSH it, with the census as a committed artifact
rather than prose in the close. Declare `leave_behind` explicitly. State your snapshot
(repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p225-setback-codification-census_cp1.json
  CP2: _inbox/2026-09-15_p225-setback-codification-census_cp2.json
  CLOSE: _inbox/2026-09-15_p225-setback-codification-census_close.json
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
    "lane": "p225-setback-codification-census",
    "planRows": ["P-225"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
