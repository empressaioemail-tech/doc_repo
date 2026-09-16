CANON-PREAMBLE v3a99388a
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM (operator 2026-09-16, _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. Regrid also dead.
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

PLAN-ROW: P-200, P-201, P-202, P-203, P-204, P-205, P-206, P-207, P-208, P-209, P-210, P-211, P-212, P-213 (90_operations/OPS-16_texas_market_plan_of_record.md)

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p200-213-reverify --seat <your-seat-id> --plan-row P-200 --dispatch _dispatches/2026-09-16_p200-213-reverify_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p200-213-reverify --seat <your-seat-id>

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


## Mission — P-200 through P-213: re-verify the largest unverified blind spot

This is a READ-ONLY investigation. Do not write code, do not open a PR, do not
commit anything (you cannot commit to doc_repo regardless — subagents do not
commit). Produce a report.

### Do NOT spawn sub-agents

You are the deepest worker. This mission also does not use lane-claim: it is
an internal read-only research task run by the integration seat's own
sub-agent, not a hand-carried lane to an external seat, and it mutates
nothing, so there is no collision to arbitrate. Skip the lane-claim step.

### Why this task exists

`90_operations/OPS-16_texas_market_plan_of_record.md` rows P-200 through
P-213 were all added 2026-09-14/09-15 during a fast-moving investigation
sprint. The operator's own durable card
(`_inbox/2026-09-15_reports_and_envelope_WDLL.md`) records, verbatim: "P-200
through P-213. OPS-24 rails, the `excluded` taxonomy, the capability roadmap,
the SEV-1 mass false retirement (P-212) and the blast-radius refusal (P-213,
which P-236's lane recorded as still unbuilt). **The 2026-09-15 session did
not verify any of these and did not guess. Re-establishing this block is its
own task and is the largest blind spot on the board.**" Nothing since then
has re-checked them either. Your job is to close that gap: read what each row
claimed, then verify the CURRENT live state independently, and report the
delta.

### Discipline for this task specifically

This operation's `ENFORCEMENT.md` (doc_repo root) already binds you via the
canon preamble above; the parts most load-bearing for THIS task:

- Read the authoritative record, never a proxy for it. If you read a
  database, confirm `current_database()`, the project, the region.
- Code reading outranks output measuring. When they disagree, trust the code
  read, report both, say why.
- State your snapshot for every repo (commit/branch) and every live probe
  (timestamp).
- Never fabricate a "verified" from a stale artifact. "Unmeasured" or "not
  independently confirmed" is a correct and expected answer for some of these
  14 rows — say so rather than guess.
- A convenient result that confirms the first hypothesis you tried is a
  reason to distrust the instrument, not a result.
- No privileged data access, no destructive commands. Read: `git
  log`/`show`/`diff` against fresh `origin/main` clones (local checkouts
  under `P:/hauska-engine`, `P:/hauska-factory`, `P:/hauska-map` are
  known-stale per multiple recorded incidents — do not trust them), `gh` read
  commands, `gcloud ... describe/list` read commands, and read-only SQL only
  if credentials are already available in this environment. If a read needs
  a credential you don't have, say so and move on.

### Where to read from

- `90_operations/OPS-16_texas_market_plan_of_record.md` — rows P-200 through
  P-213 are your primary source for what was CLAIMED. They are long single
  lines; use a tool/offset that won't truncate them.
- `90_operations/OPS-24_county_to_serving_program.md` — the nearby program.
  Its own `last_updated` is 2026-09-14, predating P-212 and P-213 (both
  2026-09-15) — treat it as background, not current truth. Its
  `plan_rows: P-186 through P-198` are a DIFFERENT, earlier range; P-200 to
  P-213 are later findings layered on top, not that program's own rows.
- `_inbox/2026-09-14_county_to_serving_program_map.md` and
  `_inbox/2026-09-13_dead_controls_ranked_fixes.md` — supporting context;
  check dates before trusting anything in them as current.
- `_inbox/2026-09-15_reports_and_envelope_WDLL.md` — read in full for
  adjacent context (rulings, the three recurring failure patterns it
  documents, measurement notes); several apply directly here.
- Repos referenced across the 14 rows: `hauska-factory`, `hauska-engine`,
  `legacy-design-tools` (incl. `smartsite-mcp`), `doc_repo` itself. Clone
  fresh from `origin/main` for any code read.

### The 14 rows and what each needs

For each row: state what it claimed (one or two sentences), then what you
independently re-verified NOW, then the delta (resolved / worse / unchanged /
superseded-by-later-work / could-not-verify-and-why).

- **P-200** — Hays rail catch-up: nine rails claimed to already work in five
  counties, excluded only in Hays, not a build. Re-check the current
  exclusion state for Hays vs the other five counties on those specific
  rails.
- **P-201** — `excluded` claimed to conflate three distinct states in the
  hauska-factory publish gate. Check whether this has been disambiguated in
  the gate's code since, or is still conflated.
- **P-202** — OPS-24 claimed to have no stage that creates a rail; its
  done-looks-like was said to need correcting. Check the current OPS-24
  doc's done-looks-like section (section 1) against this claim.
- **P-203** — The capability roadmap: eight rails (`easements`,
  `hoaDeedRestrictions`, `mineralRights`, `ossf`, `permits`, `salesHistory`,
  `terrain`, and one more — read the full row) claimed to have no source
  anywhere, scaling per-rail not per-county. Check current sourcing state for
  each of the eight.
- **P-204** — Mid-cutover rails: gold parcel `48209:97658` claimed to show an
  empty ledger cell while the value serves by another path. Re-read that
  exact parcel on the current serving path if reachable read-only; otherwise
  check the code path for whether this bug class still exists.
- **P-205** — An un-onboarded county (Killeen 76541 was the measured case)
  claimed to return `no-hit`, falsely implying the system looked. Check
  current behavior for that address if you can probe the live customer
  surface read-only; otherwise check the code path.
- **P-206** — A provenanced retirement claimed to be served as
  `parcel_not_found` with `parcelExists:false` for `48209:84629`. Re-check.
- **P-207** — A single `get_smart_site` payload for `48209:97658` claimed to
  contradict itself on whether land use is on record. Re-check.
- **P-208** — The depth-warm re-mint job claimed to be a no-op that would
  report success (measured via `hauska-engine-depth-warm-remint-7gjxg`, dry
  leg, exit 0, `wouldWrite: []`). Check whether this job still no-ops, and
  specifically whether it would still silently report success if it did.
- **P-209** — Operator ruling 2026-09-14: `salesHistory` marked Unavailable
  in Texas, rail kept for a future non-Texas launch. Check whether the
  product actually SAYS "unavailable" wherever this rail would otherwise
  appear.
- **P-210** — Multiple subsystems (read the full row for which) claimed to
  disagree on what "covered" means for a county/city, blocking three other
  rows. Check whether the ruling this row calls for has been made since
  (search `_decisions/` for anything dated after 2026-09-14 on this).
- **P-211** — The "six-county circle-back": whatever P-200's Hays-first
  sequencing left behind for the other five counties. Read the full row for
  the enumerated remainder and check current state of each item.
- **P-212** — SEVERITY-1, highest priority in this set: 61,536
  hauska-engine parcel-nodes claimed mass-falsely-retired; calls for
  re-verifying them against live county cadastral services AND stopping the
  reconcile process that produced the false retirements. This may be the
  SAME incident as `ENFORCEMENT.md`'s "Instance 2026-09-15, Bastrop 48021"
  story (57,704 of 62,394 parcel-nodes) or a second one — read that section
  and determine which. Check: (a) was the reconcile process actually
  stopped, (b) has any portion of the 61,536 been re-verified against live
  county data, (c) is a fix merged, and if so is it deployed and does the
  live parcel-node count/status reflect it.
- **P-213** — Blast-radius refusal, now canon in `ENFORCEMENT.md`: a writer
  that would flip a destructive status on a large share of a population
  should refuse and write nothing. The WDLL says P-236's lane recorded this
  as "still unbuilt" as of 2026-09-15. Check hauska-factory and hauska-engine
  writer code NOW for whether any such refusal threshold exists in the write
  paths touching parcel-node or similar mass-status fields, and whether it is
  ARMED per ENFORCEMENT's three-question-gate (what executes it, what
  triggers it, what fails when violated — a control that is merged, correct
  and undeployed enforces nothing). Treat "still unbuilt" as the default
  hypothesis to disprove, not confirm by assumption.

### Report format

One entry per row, in the order above: CLAIMED (from the OPS-16 row) /
VERIFIED NOW (your independent check, with snapshot/timestamp) / DELTA
(resolved, worse, unchanged, superseded, or could-not-verify-and-why). Close
with a short synthesis: which of the four named clusters (OPS-24 rails, the
`excluded` taxonomy, the capability roadmap, P-212/P-213) is in the worst
state right now, and what the single highest-leverage next action is. Keep
prose tight — this becomes a doc_repo amendment row, not a document in
itself. Flag anything you find that looks like a NEW defect beyond what these
rows already named — do not chase it down, just name it for the planner.

### Close

Return your full report in your final message. There is no CP1/CP2/close
JSON for this mission — it is not a build lane and nothing needs a
probe-close-gate artifact. State your snapshot (doc_repo commit, and every
product-repo commit you read) at the top of your report.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p200-213-reverify_cp1.json
  CP2: _inbox/2026-09-16_p200-213-reverify_cp2.json
  CLOSE: _inbox/2026-09-16_p200-213-reverify_close.json
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
    "lane": "p200-213-reverify",
    "planRows": ["P-200", "P-201", "P-202", "P-203", "P-204", "P-205", "P-206", "P-207", "P-208", "P-209", "P-210", "P-211", "P-212", "P-213"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
