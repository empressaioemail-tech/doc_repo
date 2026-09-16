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

PLAN-ROW: P-242 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p242c-records-mcp --seat <your-seat-id> --plan-row P-242 --dispatch _dispatches/2026-09-16_p242c-records-mcp_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p242c-records-mcp --seat <your-seat-id>

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
that measures it, at a cost the kill test can read. Not "acquire everything". The sequence is
ruled (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`,
scope `_inbox/2026-09-16_texas_scaleup_program_scope.md`):

1. **Phase 0:** the six onboarded counties complete and verified.
2. **Phase 1:** Burnet with its cities as the first county through the farm, with the farm built
   and refined during that run.
3. **Phase 2:** Bell and Milam through the farm in parallel.
4. **Then** the rest of Texas.

## Six laws

1. **The customer predicate is the definition of done.** `scripts/surface-probe.mjs` with a
   real address in the county is the finish line for every stage, not stage 12's private
   check. A stage that cannot be traced to a change in what the probe reads is not on this
   program. ARMED 2026-09-14 on the enforcement side: `probe-close-gate.mjs` gates every
   OPS-24 row and prints the predicate debt on each close until `surface-probe.mjs` carries
   the stage's row (P-197); a close with neither an artifact nor a declared
   `probe.notApplicable` (read-only reviews only) is refused.
2. **The gate is fixed before anything trusts it.**
   - **Fixed:** P-195 closed the ZERO-ROW case. A county with no cells refuses
     (`RAIL_NEVER_FILLED`, `BAKE_POPULATION_UNMEASURED`).
   - **Still open (A-179):** the ZERO-EARNED case. `evaluatePublishGate` reads a county whose
     cells exist but are all `unaccounted` as every rail "declared ahead" and passes it, and
     that is exactly what a freshly instantiated county looks like.
   - **Therefore P-201 lands, proven by violation on an instantiated, unfilled county, before
     any new county's verdict is trusted.**
3. **One county at a time until the farm is proven** (rewritten 2026-09-16 to the operator's
   sequence).
   - Burnet is the first county through the farm. The farm's machinery (manifest, pre-bake
     audit, completeness check, stage meter, merge gate) is built and refined during that run,
     and every defect Burnet finds is fixed upstream, never in the county.
   - Burnet runs on the shared stores with full stage telemetry (A-180).
   - Bell and Milam then run in parallel. Whether they need isolated stores is decided from
     Burnet's measured stage records, not in advance.
   - The fleet has learned twice that blockers surface serially; one county finds them faster
     than a wave does.
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

## Out of scope until after Phase 2 (A-177)

The road-node pass: a TIGER cross-check, a street-name dictionary, classification rules, and the
`roads` and `edgeSignal` ledger rails. Study road data only where it blocks envelope or footprint
rendering, and say exactly where.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — P-242c: record request goes coming-soon on the MCP surface, plus the wrong export copy

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. The
web half (P-242b, hauska-map PR #406) already merged 2026-09-16 — do not touch `hauska-map`.

### The ruling you are implementing

Operator ruling 2026-09-15, `_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`:

1. **All surfaces**, web and MCP connector both.
2. **Disabled AND labelled**, not labelled alone.
3. **The MCP tools stay listed and return a declared coming-soon refusal.** Not removed from
   the catalog — an agent told coming-soon has a fact; an agent that finds the tool absent
   guesses.

### What is already built, verified against `origin/main` this session — read before you touch anything

`artifacts/smartsite-mcp/src/tools.ts:796-824` (`registerTools`) already has the exact
mechanism the ruling asks for, proven live today for two other tools: every registered tool
carries a `readiness` field in `artifacts/smartsite-mcp/src/constants.ts`, and
`registerTools`'s handler wrapper checks `tool.readiness === "blocked"` **before** dispatching
to any case handler, short-circuiting to:

```json
{"status":"not_ready","tool":"<name>","reason":"<blockedReason>","message":"<name> is not available on Smart Site MCP yet."}
```

(`notReadyMessage()`, `tools.ts:241-248`, returned with `isError: true`.) `request_records`
and `check_request` (`constants.ts:38-53`) are **already** `readiness: "blocked"` with
`blockedReason: "P-85 item 4"` and a description that already reads "Not available until
Records Request is live on production." Those two tools already satisfy this ruling. Verify
this stays true (it may have drifted since this read) and do not re-touch them unless you find
otherwise.

**What is NOT yet coming-soon:** `list_purchased_records` and `read_purchased_record`
(`constants.ts:54-67`) are `readiness: "live"`. They gate only on entitlement
(`canRunStudioReport`, checked inside `listPurchasedRecords`/`readPurchasedRecord` in
`artifacts/smartsite-mcp/src/recordsExtraction.ts:359-428`), which means a Studio+ caller
today reaches the real handler and gets real (near-always-empty, per P-223's 42-row/zero-
artifact measurement) query results — not a coming-soon refusal. This is the actual gap this
row closes.

### The refusal-copy defect, also named in this row (A-171 residue)

When an ungranted caller hits `list_purchased_records`/`read_purchased_record` today, the
entitlement gate returns `upgradeRequiredResult(entitlement)`, which resolves to
`refuseStudioReport()`'s message in `artifacts/smartsite-mcp/src/entitlement.ts:139-149`:
**"Studio or Team subscription, or a 30-day property unlock on this parcel, is required for
this export."** These two tools do not export anything — they read previously-purchased,
already-extracted text. The word "export" is wrong on this path; it was copied from the
site-plan/terrain export gate this string was written for. Write a distinct, accurate
message for this gate (do not just delete the word "export" — say what the tool actually is:
reading a purchased record). **This copy fix stands on its own regardless of the blocked-flip
below**, because once you flip readiness to "blocked" the entitlement gate becomes unreachable
dead code for these two tools — fix the copy anyway, so it is correct on the day this row
reverses and the entitlement check runs again.

### Predicate

1. `list_purchased_records` and `read_purchased_record` flip to `readiness: "blocked"` in
   `constants.ts`, each with a `description` stating unavailability (mirror
   `request_records`'s wording) and a `blockedReason`. Use `"P-242"` (this ruling's row), not
   `request_records`'s `"P-85 item 4"` — a different, more recent governing decision, and a
   future reader should trace to the right one.
2. Every call to either tool, at any entitlement tier, returns the declared `not_ready`
   envelope — proven by a test that calls each with a Studio-tier fixture (today's one
   passing case) and confirms it now declines instead of running the query.
3. Both tools remain in `SMARTSITE_MCP_TOOLS` / the served tool catalog — list the catalog
   (or the equivalent test) and show both names present.
4. `refuseStudioReport()`'s "required for this export" message is no longer reachable from
   `listPurchasedRecords`/`readPurchasedRecord`'s own gate path, and the gate's own
   (now-dead-while-blocked) copy is corrected to not claim "export."

### Falsifiers, pre-register your answers before you run anything

1. **Call `list_purchased_records` and `read_purchased_record` as a Studio-tier caller** (the
   one path that reaches the real handler today) and confirm both now decline with the
   declared envelope instead of running the DB query. This is the actual behavior change; a
   Studio caller not exercised is not proof.
2. **Confirm neither tool disappeared from the tool list.** List `SMARTSITE_MCP_TOOLS` (or
   whatever the server actually advertises) before and after; both names must still appear.
3. **Confirm `request_records`/`check_request` are unaffected** — you are not touching their
   `blockedReason`, and their existing behavior is not this row's to change.
4. **Try to find a second entry point** into a purchased-record read that bypasses the tool
   dispatcher's `readiness` check (a direct function call from another tool's handler, a REST
   route in this same service, anything reachable that calls `listPurchasedRecords`/
   `readPurchasedRecord` without going through `registerTools`'s gate). Name what you find.

### Known traps

- `readiness === "blocked"` is checked once, generically, for every tool — do not build a
  second, parallel coming-soon mechanism specific to these two tools. Reuse what
  `request_records` already proves works.
- `isError: true` on the not_ready envelope may read as an error rather than a declared
  refusal, in tension with this codebase's own stated philosophy elsewhere ("a refusal is a
  declared answer, not an error" — `find_parcel`'s own description in `constants.ts`). This is
  pre-existing behavior on `request_records`/`check_request`, not something this row asks you
  to fix. Note it in your close if you think it is a real defect; do not silently change it for
  all four tools without flagging that you widened scope.
- Do not touch `hauska-map` / `apps/property-explorer`. P-242b already shipped that half.
- Do not set or imply a return date for records request. None was decided.
- Do not change tier boundaries or entitlement policy elsewhere in this file. Coming-soon is
  not an upgrade gate.

### Do not

- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact diff to `constants.ts` and the new/
corrected message text. Paste the test output proving a Studio-tier call to each tool now
declines. Confirm the tool catalog still lists both names. Declare `leave_behind` explicitly —
`none` is a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p242c-records-mcp_cp1.json
  CP2: _inbox/2026-09-16_p242c-records-mcp_cp2.json
  CLOSE: _inbox/2026-09-16_p242c-records-mcp_close.json
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
    "lane": "p242c-records-mcp",
    "planRows": ["P-242"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
