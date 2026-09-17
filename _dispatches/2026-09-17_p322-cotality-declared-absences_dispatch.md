CANON-PREAMBLE v0d6978dd
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS LIVE FLEET-WIDE (operator 2026-09-17) — doctl and the DigitalOcean MCP servers (`do-apps`, `do-droplets`) are configured in the global Cursor config on the fleet machine, authenticated with an agent token scoped to Droplets and Apps only (no account, database, or networking access). Any lane doing DigitalOcean provisioning or migration work has this available without further setup; do not ask the operator to configure it again.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v378cd643 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-322 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p322-cotality-declared-absences --seat <your-seat-id> --plan-row P-322 --dispatch _dispatches/2026-09-17_p322-cotality-declared-absences_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p322-cotality-declared-absences --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — P-322: the rails that wanted Cotality ship as declared absences

You launch no sub-agents (FAN-DEPTH 0). You may read every repo; you write only where this mission
says. You open a PR per repo you change and hand any doc_repo change back as a diff in your close.
You do not merge or deploy, and you write to no store.

### The ruling (OPS-16 A-212, operator, 2026-09-17)

Cotality is about two weeks out. Nothing waits on it. Every rail that wanted Cotality ships as a
DECLARED absence: `unaccounted` at rest, labelled where a customer reads it, never fabricated and
never a silent hole. Nothing is relabelled `absent-verified` to clear a gate. A degraded answer
labelled as degraded is honest; a degraded answer presented as complete is the defect.

### What is known, and what you must establish

Known: P-267 names `agValuation` as Texas-wide with no source in four of the six counties
(Bastrop, Caldwell, Hays, McLennan), about 318,000 cells held honestly `unaccounted`, with a
never-run not-applicable sweep that WOULD write the false state if it ever ran. P-253 gives the
rail the state `vendor-pending` in those counties. P-283 is the contract read and is deferred.

Not known, and your first job: whether `agValuation` is the ONLY Cotality-dependent rail. Do not
assume it is. Enumerate by reading the writers and the rail declarations, not by grepping for the
vendor's name — the property is semantic and a rail can depend on a vendor without naming one.

### What to build

1. **The enumeration.** Every rail whose source is Cotality or which has no source pending
   Cotality, with its current cell state per county and the count. State the instrument that
   produced each number and the snapshot it ran against. If a rail's dependency is ambiguous, say
   so and name both readings rather than picking one.
2. **Prove nothing was relabelled.** For every rail in the enumeration, query in both directions:
   no cell is `absent-verified` where nothing looked, and the `unaccounted` counts have not fallen
   without a matching acquisition landing. A falling unaccounted count with no acquisition is
   relabelling and it looks like progress. Report the counts, not a verdict.
3. **The declared absence reaches a customer.** For each rail, a customer reading the surface must
   get: what the rail is, that it is not yet sourced, and what would fill it. Establish first what
   each surface does TODAY for these cells (panel, MCP, the feasibility export and its PDF) — a
   rail that already declares itself needs no change, and saying so is a result. Change only what
   is silent. Name the exact string you ship and where it renders.
4. **The sweep cannot run by accident.** P-267's not-applicable sweep would write a false state
   across about 318,000 cells. Confirm whether it can still be invoked, and if it can, make it
   refuse rather than relying on nobody running it. This overlaps P-320's blast-radius refusal
   (in flight in `hauska-factory`); if P-320's shared threshold has landed, use it rather than
   building a second one, and say which you found.
5. **The Phase 0 exit text.** Hand back a diff for OPS-16 and the roadmap restating the exit
   criteria without Cotality, with the Cotality-dependent rails counted as declared absences
   rather than as gaps. You do not commit it.

### Verify by violation

- Plant a cell that is `absent-verified` where nothing looked and show your check catches it.
- Plant a silent cell on a surface you changed and show it now renders the declared absence.
- A check you have only seen pass has not been observed working. Show both directions for each.

### Constraints

- No store writes. No deploys. No merges.
- County 48491 is being restored from a point-in-time branch; do not touch it in any store.
- If you find that a rail's real blocker is not Cotality, that is a finding and it goes in the
  close under its own heading. Do not fold it into the Cotality story.

### Close

Declare: the enumeration with instruments and snapshots, the relabelling check in both directions,
what each surface did before and after, the sweep's status, the PR numbers, the doc_repo diff, and
`leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_p322-cotality-declared-absences_cp1.json
  CP2: _inbox/2026-09-17_p322-cotality-declared-absences_cp2.json
  CLOSE: _inbox/2026-09-17_p322-cotality-declared-absences_close.json
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
    "lane": "p322-cotality-declared-absences",
    "planRows": ["P-322"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
