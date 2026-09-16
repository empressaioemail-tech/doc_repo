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

PLAN-ROW: P-210 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p210-coverage-endpoint --seat <your-seat-id> --plan-row P-210 --dispatch _dispatches/2026-09-16_p210-coverage-endpoint_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p210-coverage-endpoint --seat <your-seat-id>

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


## Mission — P-210: build the coverage-check endpoint P-205's fail-closed refusal is blocked on

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`hauska-engine`, `services/retrieval-api`. No worktree exists yet for this lane. Clone fresh
from `origin/main`, cut your own branch, and declare the commit you started from before you
write anything. This lane runs after this session's `hauska-engine-api` deploy (P-213/P-238)
has settled — do not start until that is confirmed serving, since you are working in the same
repo and want a clean base.

### The ruling that unblocks this row

Operator, 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`,
ruling 2: **"Covered" means what actually serves the customer — the serving path is canonical.
The search index and the ledger are inputs to that answer, not rival definitions of it.**

This resolves the fork P-210 was carded to name (A-154, 2026-09-14): three candidate meanings
of "covered" disagreed — the search index (`txgio_parcel`/`txgio_address`, broad), the Factory
ledger (`parcel_record`/`parcel_gate_verdict`, six counties as of last measurement), and the
serving path (baked snapshots, demonstrably broader than six, never enumerated). Evidence that
made the serving path the right answer: `48029:109766` (San Antonio, Bexar County, 48029)
returns situs/zoning/flood all PRESENT through `get_smart_site`, while Bexar is in NEITHER the
ledger NOR the gate-verdict table. A customer already gets a real, earned answer there; calling
that "uncovered" would be false, and calling it "covered" via the ledger is impossible since it
has no ledger row at all.

### The exact contract you are building, in full, from the lane that named this dependency

`_inbox/2026-09-14_p205-coverage-refusal_CONTRACT.md` (written by the `p205-coverage-refusal`
lane specifically for this follow-on). Read it in full before you write code; it is short and
answers most of the questions you will otherwise have to re-derive. Summary, but read the
source document for the parts elided here:

**Endpoint:** `GET /parcel-record-gate-verdict/coverage/check?city=<CITY>&state=<ST>&zip=<ZIP>`

Sibling to the existing `app.get("/parcel-record-gate-verdict/:countyFips/:railKey", ...)` at
`services/retrieval-api/src/server.ts:441-476` — read that handler for this service's
conventions (factory-store-not-configured → 503 with `errorClass`, read-failed → 503 with
`errorClass`, `c.json(...)`). **Route-ordering trap:** confirm your new literal
`/coverage/check` segment does not get shadowed by, or itself shadow, the existing
`:countyFips/:railKey` dynamic segment — Hono matches by registration order and the existing
route's `countyFips` param is regex-constrained to `\d{5}`, so `"coverage"` should fail that
constraint and fall through, but verify this with a real request rather than assuming from
reading the regex.

**Response — exactly one of three shapes:**

```jsonc
{ "status": "covered" }
{ "status": "not-covered", "countyFips": "48027", "countyName": "Bell", "state": "TX" }
{ "status": "indeterminate", "reason": "human-readable, logged verbatim by the caller" }
```

`not-covered` MUST carry all three of `countyFips`/`countyName`/`state` — the LDT-side client
already built (`placeCoverageSource.ts`) treats a `not-covered` body missing any of the three as
`indeterminate` rather than guessing, so an incomplete `not-covered` is silently downgraded, not
rejected loudly. Match that contract exactly; the consumer side is already merged (LDT PR #690)
and will not change for you.

**Auth/base-URL convention:** same as `fetchGateVerdict`/`fetchParcelRecord`
(`parcelRecordReaderClient.ts` on the LDT side) — `HAUSKA_RETRIEVAL_API_URL`/
`RETRIEVAL_API_URL`/`BRIEF_RETRIEVAL_API_URL` for base, `Authorization: Bearer
<HAUSKA_RETRIEVAL_API_KEY/RETRIEVAL_API_KEY/BRIEF_RETRIEVAL_API_KEY>`.

**Freshness:** cacheable. Ledger/serving-path membership changes only on a Factory publish, not
a high-frequency event. A short-TTL cache (a few minutes) is correct; do not over-engineer
freshness here.

### The actual hard part, not fully specified by the contract — this is your real work

The contract tells you the shape; it does not tell you the query, because nobody has ever
enumerated the serving path. The ledger (`parcel_record`/`parcel_gate_verdict`) is NOT the
answer per the ruling above — it undercounts (Bexar serves and is absent from it). The raw
`txgio_parcel`/`txgio_address` index is NOT the answer either — it overcounts (a row existing
in the index does not mean any rail can return an earned fact; that is exactly the bug P-205
was dispatched to fix, reproduced live on Bell/Killeen 76541: parses to TX, hits the 254-county
index, finds nothing, falls through to a bare no-hit).

Your job is to find or build the real signal: **given a county, can the serving path — whatever
actually assembles `get_smart_site`'s response — return at least one earned (non-refused,
non-absent-because-no-source) fact for a parcel in it.** Trace what actually produces the Bexar
card (situs/zoning/flood present) to find that mechanism; it is not the same code path as the
ledger gate. Read before you guess. If the true answer turns out to require a live probe rather
than a static membership query (i.e., "covered" is provable only per-parcel, not per-county in
the abstract), say so plainly in your close rather than forcing a county-level answer the data
does not support — an honest `indeterminate` beats a confident wrong `covered`.

### Fail-closed discipline — this is a hard operator constraint, not a suggestion

**Unconditional. There is no code path that reaches `covered` or `not-covered` without an
explicit, well-formed, positive verdict.** A timeout, a 5xx, a malformed body, an unreachable
DB, a query you are not confident in — every one of these is `indeterminate`, never a guess in
either direction. The LDT-side consumer (already built, already tested with 7 violation cases
in `placeCoverageSource.test.ts`/`txgioAddressResolveCoverage.test.ts`) treats YOUR
`indeterminate` as `coverage_check_unavailable` and your `covered`/`not-covered` as ground
truth it will act on directly. If you are not certain your query answer is correct, your
endpoint's job is to say so, not to have an opinion.

### Falsifiers, pre-register your answers before you run anything

1. **Bexar, 48029.** Query your endpoint for a Bexar locality. Given the ruling, this should
   resolve `covered` (the serving path answers for it) even though it is absent from both the
   ledger and would need to be checked against whatever the real serving mechanism is — prove
   this with your actual built query, not by asserting the ruling implies it.
2. **Bell/Killeen, 76541.** Query for this locality. Per the ruling and P-205's own live
   reproduction, this should resolve `not-covered` with `countyFips: "48027"`, `countyName:
   "Bell"`, `state: "TX"` — or, if your traced serving-path signal genuinely cannot support a
   county-level answer for Bell specifically, `indeterminate` with a real reason, never a
   guessed `covered` or a guessed `not-covered` without the three required fields.
3. **Kill the DB / time out the query / feed a malformed locality.** Prove each independently
   resolves `indeterminate`, never crashes the endpoint into a 500 with no body, never falls
   through to a default `covered`.
4. **One of the six onboarded counties (e.g., Travis, Bastrop).** Confirm these still resolve
   `covered` under your new query — this row must not make an already-serving county look
   uncovered.

### Known traps

- Do not build this against the ledger and call it done. That reproduces exactly the undercount
  the ruling rejected (Bexar would read `not-covered` while actively serving).
- Do not build this against the raw index and call it done. That reproduces exactly the P-205
  bug this whole chain exists to fix (Bell would read `covered` and then answer nothing).
- The vocabulary follow-on (`coverage_check_unavailable`/`county_out_of_coverage` entries in
  `@empressaio/atom-contract/display`) is explicitly a separate, unowned lane against
  `hauska-atom-contract` per the CONTRACT document's own final section. Do not build it here;
  name it in your close as still open if it still is.
- **Deploy timing is an operator decision, not yours.** The CONTRACT document is explicit:
  until this endpoint exists AND is correctly configured, deploying the already-merged LDT side
  (PR #690, merged not deployed) makes every zero-hit `find_parcel` query anywhere in Texas —
  including inside the six onboarded counties — return `coverage_check_unavailable` instead of
  today's plain `no-hit`. That is the intended fail-closed behavior once both sides are live,
  but sequencing when it goes live is explicitly not this lane's call.

### Do not

- Do not touch `legacy-design-tools`. The consumer side is already built, merged, and its
  contract with you is fixed — do not renegotiate the response shape unilaterally.
- Do not touch `hauska-atom-contract` / the display vocabulary.
- Do not deploy. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact query/mechanism you traced or built
for "does the serving path answer for this county" and why you believe it matches the ruled
definition rather than the ledger or the raw index. Paste all four falsifier results with real
responses. State plainly whether "covered" turned out to be a clean per-county predicate or
something narrower (per-parcel, or requiring a live probe) — this is exactly the kind of finding
this row exists to surface, and an honest "it's not as clean as the ruling implied" is a better
close than a forced clean answer. Declare `leave_behind` explicitly, including the vocabulary
follow-on and the deploy-timing decision if either is still open.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p210-coverage-endpoint_cp1.json
  CP2: _inbox/2026-09-16_p210-coverage-endpoint_cp2.json
  CLOSE: _inbox/2026-09-16_p210-coverage-endpoint_close.json
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
    "lane": "p210-coverage-endpoint",
    "planRows": ["P-210"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
