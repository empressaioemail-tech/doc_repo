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

PLAN-ROW: P-206 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p206-retirement-serve --seat <your-seat-id> --plan-row P-206 --dispatch _dispatches/2026-09-16_p206-retirement-serve_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p206-retirement-serve --seat <your-seat-id>

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


## Mission — P-206: an earned retirement serves as a bare `parcel_not_found`

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. A
second lane (P-241's ETJ acquisition build) may be running concurrently in this same repo,
scoped to `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/` — do not touch either path;
this row has no reason to.

### Why this row is dispatchable now — read this before assuming the blocker still applies

The row's own text says **"BLOCKED ON P-212: DO NOT DISPATCH THIS ROW FIRST"** — that block is
cleared. P-212 (the SEV-1 mass false retirement, 57,704 of 62,394 Bastrop parcel-nodes wrongly
marked retired) is resolved per OPS-16 A-178 (2026-09-16): 56,691 reactivated, verified three
independent ways. **This is not zero, though** — 57,704 minus 56,691 leaves roughly 1,013
parcel-nodes (about 1.8 percent of the county) still marked retired that this pass did not
reactivate. State this residual rate plainly in your close; it is the real remaining risk this
row's fix would expose (a serve path that finally honors retirement will show that ~1.8 percent
as retired too, correctly for most of them, possibly wrongly for some fraction still). This is
a much smaller blast radius than the 92.5 percent the row was originally blocked on, which is
why the row is now dispatchable — but "much smaller" is not "zero," so don't treat it as fully
resolved.

### The defect, as measured (row text, quoted)

`48209:84629` (Hays) at `get_smart_site` depth node returned `{"reason":"parcel_not_found",
"parcelExists":false}`, while the store holds an EARNED retirement for that node (`status:
retired, verdict: absent-verified, lastSeenTaxYear: 2025`, `asOf 2026-09-14T03:31:56Z`). The
vocabulary defines `parcel_not_found` as no record existing in coverage at all. `absent-
verified` is the highest-quality absence the vocabulary defines — a positive, checked claim
that the parcel does not carry a value — and the serve collapses it into "never had a record,"
which is a stronger and different claim than the data supports. This is the customer-facing
half of the same seam P-180 already fixed on the walk-grading side (merged `d249ba13`); the
walk grades a declined earned retirement correctly, and the serve still describes it wrongly.

### What I traced this session, so you don't re-derive it — and where I stopped

`parcelExists`/`reason` on a `get_smart_site` miss are **pass-through fields**, not computed
locally: `artifacts/smartsite-mcp/src/mcp-app.ts:2617-2636` (`missRowsFrom`) reads
`rec.parcelExists`/`rec.reason` directly off an already-fetched upstream JSON body (`rec`) and
does no existence check of its own — `parcelExists === false` just widens the `missClass`
classification, it never originates the claim. **`parcelExists` does not appear anywhere in
`artifacts/api-server` (zero grep hits)** — so whatever upstream call actually produces
`{"reason":"parcel_not_found","parcelExists":false}` for a `get_smart_site` node-depth call is
NOT the PE brief route I also checked (`propertyExplorer.ts`'s `sendBriefMiss`, lines 772-798,
which returns a different shape — `error: "parcel_not_found"` with no `parcelExists` field at
all, and is the PE web app's own miss path, probably unrelated to this row's evidence). **I did
not find the real originating function before handing this off — trace it yourself, live,
before assuming a fix location.** Start from `get_smart_site`'s node-depth handler in
`artifacts/smartsite-mcp/src/tools.ts` and follow its actual upstream call for a single-node
miss; the retirement vocabulary in the row's evidence (`status: retired, verdict: absent-
verified`) reads like Factory/ledger terms, so the real source may be a call into
`hauska-engine`'s `retrieval-api` (`parcelRecordReaderClient.ts`-style client) rather than
`api-server` at all — confirm, don't assume.

### The second mechanism the row already names — test before fixing

`48209:84629` is an **account-keyed** node; the serve path may be **parcel-keyed**. The row
warns `parcelExists:false` may be true at the parcel layer while the retirement lives at the
account layer — the ruled Hays crosswalk pattern (account attributes only through the published
crosswalk, never a bare-number join — `_decisions/2026-09-13` era ruling, referenced elsewhere
as "Hays node id is the parcel-map id"). **Test this before writing any fix.** If the account/
parcel layering genuinely makes today's question malformed, the row's own predicate accepts
that as a valid outcome: "a node with an earned retirement serves a declared retirement state
with its vintage, **or the account/parcel layering is shown to make the question malformed.**"

### Predicate (quoted from the row, do not weaken it)

"A node with an earned retirement serves a declared retirement state with its vintage, or the
account/parcel layering is shown to make the question malformed."

### Falsifiers, pre-register your answers before you run anything

1. **Re-measure `48209:84629` live**, exactly as the row did, and confirm the defect still
   reproduces on current `origin/main` before writing any fix — do not trust the row's
   2026-09-14 measurement as still current.
2. **Trace the real call chain** for that miss end to end (falsifier, not optional): name the
   exact function that first sets `parcelExists`/`reason` on the response body, in which repo.
3. **The account/parcel layering test.** Query the same node both ways (by its account-keyed id
   and by whatever the crosswalk resolves it to at the parcel layer, if they differ) and show
   whether the retirement claim changes depending on which key is used. This is the row's own
   named risk, not optional due diligence.
4. **A genuine `parcel_not_found` (a node that really has no record anywhere) must still read
   as `parcel_not_found`.** Your fix must not turn every miss into a retirement claim — find or
   construct a real never-existed node and confirm it still resolves honestly.
5. **The residual ~1.8 percent.** Pick a handful of still-retired Bastrop nodes from the P-212
   close's own unreactivated set (57,704 minus the 56,691 reactivated) and check whether your
   fix would now present any of them as a confident "retired" claim that is itself still wrong.
   If so, say so plainly — this row does not get to inherit P-212's residual error silently.

### Known traps

- Do not assume the fix belongs in `legacy-design-tools` just because the row's title says
  "legacy-design-tools serve path" — that was true of the ORIGINAL miss route the row's author
  had in mind, but I could not confirm it traces there for the actual `get_smart_site` call.
  If your trace lands in `hauska-engine`, say so and scope the fix there instead of forcing it
  into this repo.
- `absent-verified` is Factory/ledger vocabulary (see the atom-contract's `VerificationState`
  and the "ledger is the serving path" canon). If the real source of truth for this claim is the
  ledger and not whatever `api-server` currently queries, the honest fix may be a read-path
  change (consult the ledger) rather than a copy/vocabulary change on the existing miss.
- Do not conflate this with P-204 (mid-cutover rails) or P-201 (gate-verdict three-state split)
  — those are hauska-factory publish-gate concerns; this row is about what the MCP/serve layer
  tells a customer about ONE already-identified node, a different layer entirely.

### Do not

- Do not touch `lib/cad-ingest/src/boundary/` or `lib/db/src/schema/` — a concurrent lane owns
  the ETJ acquisition build there.
- Do not deploy. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact function and repo where
`parcelExists`/`reason` actually originate for a `get_smart_site` node miss — this alone is a
real finding even if you get no further. State plainly which predicate branch you satisfied
(the fix, or "the question is malformed") and why. Paste all five falsifier results with real
data, including the account/parcel layering test and the residual-1.8-percent check. Declare
`leave_behind` explicitly.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p206-retirement-serve_cp1.json
  CP2: _inbox/2026-09-16_p206-retirement-serve_cp2.json
  CLOSE: _inbox/2026-09-16_p206-retirement-serve_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in p:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p206-retirement-serve",
    "planRows": ["P-206"],
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
