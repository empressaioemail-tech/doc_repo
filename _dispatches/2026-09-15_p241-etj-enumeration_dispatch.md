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

PLAN-ROW: P-241 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: read-only diagnostic (no product repo writes)

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p241-etj-enumeration --seat <your-seat-id> --plan-row P-241 --dispatch _dispatches/2026-09-15_p241-etj-enumeration_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p241-etj-enumeration --seat <your-seat-id>

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


## Mission — P-241: enumerate the published ETJ and city-limits layers, and name who owns the staging path

### THIS LANE IS READ-ONLY. You write no code in any product repo.

You produce a written enumeration and a repo attribution. You do not promote the toggle, you do
not stage a layer, you do not touch `report-model.ts`. A build lane follows from what you return.

Two reasons this is scoped that way, and both are real. The staging path most likely lands in
hauska-engine, where **P-240 is executing in the same window**, so a build here would collide. And
**a dispatch in this program has stated the wrong repo twice in two days**, both times caught only
by someone tracing the live call. You are the one tracing it.

### What is already established, so you do not re-derive it

**The toggle exists and is correctly dark.** hauska-map, `packages/map-renderer/src/layer-registry.js`:

    key: "etj", label: "Extraterritorial jurisdiction", group: "regulatory",
    live: false, fuelGated: true, pending: true,
    emptyBasis: "Declared pending and fuel-gated - no source wired in map-renderer.
                 Turning this on draws nothing anywhere."

It is absent from the consumer panel because `apps/property-explorer/src/browse/consumer-layers.ts`
`consumerKnownLayers()` admits a row only when `entry.live` is true or the key is one of thirteen
named exceptions. `etj` is neither. It is NOT in `CONSUMER_EXCLUDED_LAYERS`, so nothing hides it
deliberately, it simply never qualifies. **Flipping `live` is a one-word change and the wrong one
while no source exists**, because the `emptyBasis` says what happens next.

**`LayersControl.tsx` already renders source-less rows honestly**, with a basis line and the
checkbox deliberately left operable, on the stated rule that "a toggle that turns on nothing should
say so ... the point is disclosure, not concealment."

**Both rails are hardcoded today.** OPS-23 F19 records `report-model.ts:791-796` setting city limits
AND ETJ to `unresolved` for every parcel, and `pdf/feasibility.ts:194-197` printing the literal
sentence "no city-limits or ETJ boundary source is wired for this county yet, so annexation status
is unverified" on every PDF in every county.

**Austin publishes both, and the integration seat measured it 2026-09-15, anonymously, no token:**
org `0L95CJ0VTaxqcmED`, `BOUNDARIES_jurisdictions/FeatureServer/0`, wkid 2277, **388 polygons**
being 270 `AUSTIN 2 MILE ETJ`, 24 `AUSTIN 5 MILE ETJ`, 4 `AUSTIN ETJ AG DEVELOPMENT AGREEMENT`,
26 FULL-purpose and 64 LIMITED-purpose. Re-verify it yourself rather than inheriting it; that is
one query and it is the anchor for everything else you conclude.

### What you are answering

1. **Which cities in the current footprint publish an ETJ layer, and which do not.** Austin is
   confirmed yes. Bastrop, Elgin, the Hays cities and every other wired city are UNCHECKED. For
   each: the service URL, the geometry type, the spatial reference, the feature count, and the
   attribute that carries the ETJ distinction. For each miss, say whether the city has an ArcGIS
   presence at all or none was found, because those are different facts.
2. **Does the same layer carry city limits.** Austin's does, which is why one acquisition may close
   two rails. Check whether that holds for the others, because it changes the value of each.
3. **Who owns the staging path.** Name the repo, the directory and the existing registry a
   jurisdiction layer would be added to, by tracing an EXISTING boundary layer end to end from
   acquisition to what the report reads. Do not reason from directory names.
4. **What it would take to unwire F19's two hardcoded `unresolved` values** for a county where a
   source exists. Name the files and functions. Do not change them.

### The ruling you are NOT making

`OPS-1` line 54 says: "ETJ - NO statewide layer; derive from city-limits + Local Gov Code §42.021,
or per-city GIS." A-027 recorded P-76 as honestly scoped with **"no fabricated buffer."** Whether a
§42.021 population-keyed derivation is a legitimate derived boundary or that refused buffer is an
OPERATOR ruling and it is not yours. The integration seat has recommended it be DEFERRED, because
per-city GIS is live for Austin.

**Two things to carry into your report, not to decide.** Austin's four AG-development-agreement
polygons show its real ETJ is carved by agreement rather than by the formula, which is evidence
against a derivation. And there is an UNVERIFIED claim on the card that SB 2038 (2023) created ETJ
release by petition; if true, a derived ETJ is the fabricated buffer P-76 already refused. **If you
can verify that from a primary source cheaply, do, and say so with the citation. If you cannot,
leave it flagged as unverified. Do not repeat it as fact.**

### Falsifiers, pre-register your answers before you run anything

1. **Every "no ETJ layer" finding must distinguish three states**: the city publishes nothing, the
   city publishes a portal you could not query, and you did not look. Collapsing those is the exact
   defect ENFORCEMENT names as absent-versus-unmeasured.
2. **Re-measure Austin yourself.** If your counts differ from the 388 above, your instrument or the
   seat's is wrong and that must be resolved before anything downstream trusts either.
3. **Your repo attribution must come from tracing an existing layer's live path**, not from reading
   a directory listing. State the file and function chain you followed.
4. If you conclude the enumeration cannot be completed for some city, name the city and the reason.
   A bounded honest gap is a result; a silent omission is not.

### Known traps

- The atoms store is on Neon database `hauska_mcp`; a query against the wrong database returns a
  FALSE ABSENCE indistinguishable from a real one.
- Never pipe an enumeration through `tail`. It drops rows and a zero reads as "nothing is wrong."
- ArcGIS `resultRecordCount` caps silently. Check `exceededTransferLimit` before reporting a count.
- `P:/hauska-map` and other local clones may be stale. Read `origin/main` after an explicit fetch.

### Do not

- Do not write code in any product repo. This lane is read-only.
- Do not promote the `etj` registry row.
- Do not stage, acquire or bake any layer.
- Do not rule on §42.021.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Return the enumeration as a table, the repo attribution with its trace, and the file-and-function
list for the F19 unwiring. State plainly which cities you could not resolve and why. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p241-etj-enumeration_cp1.json
  CP2: _inbox/2026-09-15_p241-etj-enumeration_cp2.json
  CLOSE: _inbox/2026-09-15_p241-etj-enumeration_close.json
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
    "lane": "p241-etj-enumeration",
    "planRows": ["P-241"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
