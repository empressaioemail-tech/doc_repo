CANON-PREAMBLE v49001500
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS CONFIGURED FLEET-WIDE, BUT DOCTL AUTH IS PER-SESSION (operator 2026-09-17, corrected 2026-09-17 per OPS-25 D-11's close) — the `do-apps`/`do-droplets` MCP servers are configured in the global Cursor config on the fleet machine with an agent token scoped to Droplets and Apps only (no account, database, or networking access), and that MCP config travels with any lane using this machine's Cursor. `doctl`'s own CLI auth does NOT reliably carry over to every lane's session (found unauthenticated in D-11's environment) — a lane needing `doctl` specifically, not just the MCP tools, should confirm with `doctl account get` and run `doctl auth init` itself if needed, rather than assume it is live. Do not ask the operator to reconfigure the MCP servers or token; do check `doctl` auth per-session.
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

PLAN-ROW: P-326 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p326-setback-residual-composition --seat <your-seat-id> --plan-row P-326 --dispatch _dispatches/2026-09-17_p326-setback-residual-composition_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p326-setback-residual-composition --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — P-326: classify the 58,339 parcels that refuse setbacks

You launch no sub-agents (FAN-DEPTH 0). **This lane writes NOTHING.** It is a read-only measurement
against the production factory store, taken under a heavy-scan lease. You open one PR carrying the
instrument and its tests; the numbers go in your close.

### Why this exists

The post-apply completeness re-grade (`_inbox/2026-09-17_six_county_completeness_post_apply.txt`,
run 2026-09-17T22:03:12Z) shows all five setback rails — `setbackFrontFt`, `setbackRearFt`,
`setbackSideFt`, `setbackCornerFt`, `setbackRules` — classed `must-pass` and refusing in every one
of the six counties:

| County | Parcels refusing |
|---|---|
| Travis 48453 | 33,883 |
| McLennan 48309 | 8,610 |
| Hays 48209 | 8,283 |
| Williamson 48491 | 5,299 |
| Bastrop 48021 | 1,313 |
| Caldwell 48055 | 951 |
| **Total** | **58,339** |

These are the **only customer-visible block** in the Phase 0 ledger: the other open rails are either
mid-cutover (the value serves by another path today) or deferred by ruling. A parcel in this set
gets a refusal where a customer expects a setback.

P-256 applied at exactly the A-199 ceilings and moved 219,472 parcels, so this residual is what its
gate **could not** move, not what it skipped. Every plan for the remaining setback work — including
how much of it P-300's jurisdiction-default row can carry — is guesswork until this set is
classified. **Travis alone is 58 percent of it and nobody has looked.**

### What to build

1. **Find the refusal's origin in code first.** Read the setback writer and the table router and
   establish what makes a cell refuse rather than resolve. Do not infer the classes from the output;
   derive them from the write path and then measure against it. Code reading outranks output
   measuring, and every real defect in this operation to date was found by reading a write path.
2. **Classify all 58,339 by the REASON they refuse**, per county and per city. Expect classes along
   the lines of: no table for the jurisdiction at all; a table exists but the parcel carries no
   district; the parcel's district is not in the table; the source was unreadable. Do not force the
   data into that list — if it wants a class you did not expect, name that class. Say which classes
   you derived from code and which the data forced.
3. **The counts must sum to 58,339 with no parcel in two classes**, and you assert that as an
   invariant rather than reporting it as an observation. If they do not sum, that gap is the finding
   and it leads your close.
4. **Count separately the share P-300's jurisdiction-default row could serve** — parcels in a
   jurisdiction with no district, where a single city-wide default line would resolve them — from
   the share that needs a real district table. This is the number that decides whether the remaining
   setback work is small or large, so it carries its own denominator and its own derivation.
5. **State your snapshot** in the output: the commit, the store, and the timestamp of the read. An
   instrument run against a stale tree returns confident wrong answers.

### Constraints

- **No writes.** SELECT only. Prove it: digest the population before and after your read and show
  the store unchanged, the way P-263's census did.
- Take the heavy-scan lease keyed on the store HOST before reading, and release it in a `finally`.
  A lease key that is not a real host is refused (P-307); one Neon endpoint is one key, pooler and
  direct spellings included.
- Do not take, renew or release a lease belonging to another seat, and do not use a live lease as a
  fixture.
- **Do not touch county 48491 in any store.** It was restored from a point-in-time branch on
  2026-09-17 after a publish retired the whole county. Reading it is fine; writing is not.
- Do not fix anything you find. If the write path has a defect, name it with its evidence and leave
  it. A separate lane owns the fix.

### Verify by violation

The instrument is a classifier, so the failure mode is a bucket that silently swallows everything.
Before trusting it: run it against a fixture whose parcels belong to a class you did NOT implement
and confirm it reports them as unclassified rather than assigning them to the nearest bucket. A
classifier that never returns "unclassified" is not a classifier. Pre-register what result would
prove your classification wrong before you run it.

If a count looks convenient — a round number, a clean split, one class holding almost everything —
treat it as a reason to distrust the instrument, not as a result.

### Close

Declare: your snapshot, the classes with the code you derived each from, the per-county and per-city
counts summing to 58,339, the P-300-servable share with its own derivation, the write-proof digests,
the unclassified bucket's contents, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_p326-setback-residual-composition_cp1.json
  CP2: _inbox/2026-09-17_p326-setback-residual-composition_cp2.json
  CLOSE: _inbox/2026-09-17_p326-setback-residual-composition_close.json
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
    "lane": "p326-setback-residual-composition",
    "planRows": ["P-326"],
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
