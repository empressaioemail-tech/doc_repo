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

PLAN-ROW: P-246 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p246-value-history-tier-gate --seat <your-seat-id> --plan-row P-246 --dispatch _dispatches/2026-09-16_p246-value-history-tier-gate_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p246-value-history-tier-gate --seat <your-seat-id>

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


## Mission — P-246: the valuation gate covers the current-value rails and not the history rail

### The finding, measured live on the customer connector

On 2026-09-16 the operator moved the test account to paid Solo (P-245). The server confirms it: every
refusal on that account now carries `"subscriptionTier":"solo"`. The first `get_smart_site` read on
that account, `48021:34137` (908 PINE, Bastrop) at depth `node`, served by `smartsite-mcp-00124-bub`,
returned this in ONE response:

    onRecord.cadRoll.marketValue      {"state":"refused","code":"studio-gated",
                                       "reason":"County tax-assessed valuation (market/land/
                                       improvement/assessed value) is Studio or Team only.
                                       Anonymous, free, Solo, unlock, and identified-only
                                       callers receive no dollar value."}
    (same refusal on assessedValue, landValue, improvementValue, and on the same four keys in draw.attrs)

    valueHistoryFact.entries[0]       {"taxYear":2025,"marketValue":511345,"assessedValue":null,
                                       "landValue":106715,"improvementValue":404630,
                                       "viaCrosswalk":false}

**The response refuses a Solo caller the dollar value and then hands it over one field later.** The
2025 entry is the current roll year, so these are the exact numbers the refusal withholds. This is a
paid-tier gate that is bypassed on the same wire, and it is also P-217's predicate: a served payload
whose parts disagree.

### What the integration seat read, so you do not re-derive it

Read against `legacy-design-tools` `origin/main` at `ba39b4f5`.

- `artifacts/api-server/src/routes/propertyExplorer.ts`, `assembleNodeBriefBody`: the four dollar
  rails on `onRecord` go through `serializeTwinOnRecord(..., grantsCadRollValuation)`, and `ownerFact`
  is only loaded when `grantsCadRollValuation` is true. **`loadValueHistoryFactForServe(parcelNodeId)`
  is called unconditionally and `valueHistoryFact` is placed on the response unchanged.** The
  parity-audit comment (2026-09-07, D1) that added it says "same loader, reused rather than
  re-derived", and it did not carry the gate across.
- `artifacts/api-server/src/routes/brokerageNodeFacets.ts`, the facets route, also serves
  `valueHistoryFact`. Its `sanitizeNodeFacetPayload` strips owner-shaped keys only.
- `artifacts/smartsite-mcp/src/tool-honesty.ts:544`, the P-220 owner strip, says in its own doc that
  "`valueHistoryFact` and every valuation rail survive." That was deliberate for owner scope, so the
  MCP layer currently trusts upstream for valuation, and upstream does not gate this rail.
- The PE web app (`hauska-map` `origin/main` `f7fbcbff`) has no `valueHistory` reference under
  `apps/property-explorer/src`, so the browser does not RENDER it. Whether the facets route's JSON
  reaches a sub-Studio browser session is for you to establish, not assumed either way.

### The ruling in force

`propertyExplorer.ts`'s own doc for `grantsCadRollValuation`: Studio or Team, OR an active Property
Unlock for this specific parcel, "widened 2026-09-05, Solo stays excluded, confirmed deliberate"
(OPS-16 A-103 item 5 and A-104). The rails-v2 template
(`_decisions/2026-09-01_parcel_record_rails_v2_template.md`) makes `valueHistory` a companion of the
same dollar kinds by tax year and names no separate access pair for it. **No ruling makes value
history public.**

Default for this lane, and reversible by a later operator ruling: **gate every dollar key on every
entry with the same predicate.** Keep `taxYear`, `viaCrosswalk` and the entry itself, and replace
each dollar key with a typed `studio-gated` refusal per field, the convention `serializeTwinOnRecord`
already follows. If you find a ruling that makes prior-year values public, STOP and report it rather
than gating.

### Done looks like

For a caller where `grantsCadRollValuation` is false, no CAD dollar value reaches the wire on any
surface that caller can reach. Every dollar key in `valueHistoryFact` is a typed per-field refusal on
BOTH routes, with the entries and their tax years intact. For a granted caller (Studio, Team, or an
active unlock on that parcel) nothing changes. The smartsite-mcp composer carries a defense-in-depth
strip for these keys, mirroring P-220's posture, so a future upstream regression does not reach an
agent.

### Falsifiers, pre-register your answers before you run anything

1. **Both directions, at the level where entitlement is resolved.** A Solo fixture, a free fixture, a
   Studio fixture and a Property-Unlock-on-this-parcel fixture, each asserted. **The suite's default
   fixture is Studio-tier (P-245), which is how P-220 survived; do not inherit it.** Name the fixture
   each assertion uses.
2. **Delete the gate and confirm a test goes RED with a real dollar value visible in the failure.**
   Do it on the api-server gate and on the smartsite-mcp strip separately; each must fail on its own.
3. **Enumerate every served surface that carries a CAD dollar value and is reachable by a sub-Studio
   caller**, and state gated or not with evidence for each. At minimum: `get_smart_site` at node depth,
   single and batch; the facets route; `run_report`; `export_instrument kind=dossier` (the X-ray is
   Solo-accessible, so check whether its sheets print valuation); `find_parcels` (an ordered filter on
   a gated dollar rail leaks the value by bisection even if the value is never printed);
   `agValuationFact` where slated; `salesHistory` if served. A fix on one surface leaves the others
   lying.
4. **Batch reads.** P-220's leave-behind says a batch `get_smart_site` read checks account-wide tier
   only, not per-parcel unlock. Confirm `valueHistoryFact` in batch mode behaves the same way as
   `onRecord` does, and say which way that is.
5. **The live check is the planner's, after deploy**, on the operator's Solo account against
   `48021:34137`. Hand over the exact call and the exact expected fields. Do not report the row closed
   on fixtures alone.

### Known traps

- **`legacy-design-tools` does NOT auto-deploy.** Push runs build-and-push only; the workflow is
  NAMED "Cloud Run Deploy" and shows deploy jobs skipped. Merged is not shipped.
- The root `tsc --build` is vacuous (`files: []`); use `pnpm run typecheck`. api-server tests are not
  green locally; compare against a main baseline, and treat CI as authoritative.
- Read Cloud Run traffic BY FIELD, never a positional `--format=value`, and never trust
  `latestReadyRevisionName`.
- The vocabulary block riding on every call is P-243's, not yours.

### Do not

- **Do not start until P-243 has released `legacy-design-tools`.** One repo, one writer.
- Do not change tier boundaries: `canRunStudioReport`, `grantsOwnerCoGatedFields` and
  `subscriptionTierGrantsStudio` stay byte-identical, and you add no new tier check. Reuse the
  predicate that exists.
- Do not delete `valueHistoryFact` or its entries. A bare delete is silent degradation; the state is a
  typed refusal.
- Do not touch owner handling (P-220, shipped).
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Show the `valueHistoryFact` block for `48021:34137` under the Solo and the Studio fixture, before and
after. List every surface from falsifier 3 with its verdict and evidence. Name every file changed.
Give the planner the exact live check. Declare `leave_behind` explicitly. State your snapshot (repo,
branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p246-value-history-tier-gate_cp1.json
  CP2: _inbox/2026-09-16_p246-value-history-tier-gate_cp2.json
  CLOSE: _inbox/2026-09-16_p246-value-history-tier-gate_close.json
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
    "lane": "p246-value-history-tier-gate",
    "planRows": ["P-246"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
