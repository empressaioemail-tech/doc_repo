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

PLAN-ROW: P-242 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p242-records-disclosure --seat <your-seat-id> --plan-row P-242 --dispatch _dispatches/2026-09-15_p242-records-disclosure_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p242-records-disclosure --seat <your-seat-id>

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


## Mission — P-242: close the records disclosure and prove the tier gate can fail

### Scope, and what is deliberately held back

This row has two halves. **You are building the half that is not contingent on anything.**

The coming-soon surface change (which surfaces, and whether it means disabled, labelled or both)
is an OPERATOR RULING that has not been made. **Do not implement it, do not label anything
coming-soon, do not remove anything from the purchase surface in this lane.** A second dispatch
follows once the ruling lands.

**What you are doing is unconditional and the row says so: fix the error envelope, and test the
tier gate in the failing direction.** Neither depends on the ruling. Both are open today.

### The finding you are acting on

P-223 was opened 2026-09-15 as SEV-1 and then measured the same day. The measurement refuted most
of it and the severity dropped. **Two things survived, and they are yours.**

**(1) A bad `artifactId` returns a raw unhandled Postgres error.** Instead of the documented
`refused` / `artifact_not_found` envelope, the caller receives the query text verbatim, disclosing
`records_request_artifacts` table and column names. Exposure is bounded and you should not overstate
it: unauthenticated `POST https://mcp.smartsite.cloud/mcp` returns 401, so this is an
authenticated-caller disclosure, not a public one. It is still a defect, and it is still a schema
leak to anyone with a key.

**(2) The tier gate is UNTESTED in the failing direction.** The measurement could not supply a
genuinely sub-Studio account, so nobody has ever seen the gate refuse. **A gate observed only
allowing has not been observed working.** That is ENFORCEMENT's verify-by-violation rule, and this
is a live instance of it: the control may be correct, may be dormant, and nothing currently
distinguishes those two.

### Repo

`legacy-design-tools`, `artifacts/smartsite-mcp` plus the records serve layer. **Not
hauska-mcp-server** — the Smart Site MCP server lives in LDT, per the seat register and P-87. Trace
the live call before you edit, because a dispatch in this program has named the wrong repo twice in
two days and both were caught only by tracing.

The three tools in scope are `request_records`, `list_purchased_records` and
`read_purchased_record`.

### Done looks like

A bad `artifactId` returns the documented refusal envelope with a reason, and no database schema
text reaches the caller on any path. The tier gate is demonstrated refusing a sub-Studio caller, by
a test that fails if the gate is removed.

### Falsifiers, pre-register your answers before you run anything

1. **Prove the gate by violation.** Construct the sub-Studio case the earlier measurement could not
   and show the refusal. If a real account cannot be created, build the test at the level where the
   entitlement is resolved and assert the refusal there, then say plainly that the live account path
   remains unexercised. **Do not report the gate as working on the strength of it allowing a Studio
   caller.** That is the exact shape this program keeps finding dormant.
2. **Delete the gate and confirm the test goes red.** A test that passes with the control removed is
   testing nothing.
3. **Enumerate every path that can produce a raw driver error**, not just the one `artifactId` case
   that was reported. A fix that catches one call site and leaves three is the defect class
   ENFORCEMENT names: before scoring a default or a check as remediable, enumerate its call sites.
4. **Confirm no schema text survives anywhere in the refusal**, including in a nested `cause`, a
   log line the caller can read back, or a stack. Grep the served payload for the table name.
5. If you find the tier gate genuinely does fire and the earlier row was pessimistic, the row still
   closes, with the evidence. An honest refutation is a result.

### Known traps

- **Do not weaken the refusal to make it uniform.** Declining with a reason is correct behaviour;
  the defect is the shape of the message, not the refusal.
- **`artifactId` values that do not parse and ones that parse but do not exist are different
  states** and should not collapse to one message if the caller is entitled to know the difference.
  Decide deliberately and say which you chose.
- LDT's root `tsc --build` is VACUOUS (`files: []`). Use `pnpm run typecheck`.
- esbuild conditions in this repo stay `["workspace"]`. Broadening them boot-crashes pg ESM.
- api-server tests are not fully green locally. Baseline-compare against main before treating a
  failure as yours; CI is authoritative.
- **This repo does NOT auto-deploy.** Push runs build-and-push only; the workflow is NAMED "Cloud
  Run Deploy" and reports success while all four deploy jobs show skipped. Merged is not shipped.

### Do not

- Do not implement coming-soon, in any form, on any surface. That ruling is not made.
- Do not change tier boundaries or entitlement policy. You are proving the existing gate, not
  redesigning it.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spread into the purchased-records product flow beyond the two defects named here.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Paste the verbatim before-and-after of the bad-`artifactId` response. State how you proved the tier
gate refuses, and what you deleted to prove the test can fail. Name every call site you enumerated
and which ones could emit a raw driver error. If the live sub-Studio account path remains
unexercised, say so in those words. Declare `leave_behind` explicitly. State your snapshot (repo,
branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p242-records-disclosure_cp1.json
  CP2: _inbox/2026-09-15_p242-records-disclosure_cp2.json
  CLOSE: _inbox/2026-09-15_p242-records-disclosure_close.json
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
    "lane": "p242-records-disclosure",
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
