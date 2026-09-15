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

PLAN-ROW: P-214 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p214-panel-conflict-render --seat <your-seat-id> --plan-row P-214 --dispatch _dispatches/2026-09-15_p214-panel-conflict-render_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p214-panel-conflict-render --seat <your-seat-id>

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


## Mission — P-214: P-154's conflict disclosure is real and is rendered as a developer diff

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What a customer sees right now

Live `smartsite.cloud`, Bastrop parcel `48021:8723767`, under **"More facts"**:

```
edge 1: R32 35.02831192164916ft != expected 5ft for role side;
edge 4: R32 53.60964475445567ft != expected 25ft for role rear
```

Internal edge index, internal role token, an unrounded 14-decimal float, and assertion syntax,
on a customer surface, on the design-partner county that is also the surface probe's anchor.

### Established before you start, so you do not re-derive it

**YOU ALREADY KNOW WHAT THIS IS. Do not spend a lane discovering it.** The string is
**P-154's R-1 conflict row**, shipped by legacy-design-tools `803cd0d5` (PR #688,
2026-09-14T14:34:27Z), "feat(mcp): print the R-1 conflict row in get_smart_site (P-154, OPS-23
wave 6; A-148)". The operator confirms Bastrop rendered correctly earlier the same day, which
brackets the change to that deploy.

**So the INTENT is correct and ratified.** A-148 established that Bastrop's current zoning layer
says 30/10/30/20 in the ordinance text and 25/5/25 in stale numeric shortcut columns that were
never refreshed, and the operator's ruling was that our card must say so. "expected 5ft for role
side" is that stale numeric side value. **This row does not remove the disclosure. It fixes how
the disclosure is rendered.** Deleting it would undo a ratified decision.

**Correction to an earlier planner claim, recorded so you do not inherit it:** this seat first
wrote that the string was panel-generated because it is absent from the `get_smart_site`
depth-node payload. That inference was wrong. The PE panel reads its own adapter, so absence
from the MCP payload proves nothing about what the panel's own path serves. Establish where the
string is composed before you change anything, and say which file emits it.

### THE PART THAT IS NOT A FORMATTING BUG, and it decides this mission

The panel's numbers disagree with the record we serve:

```
panel says          "expected 5ft for role side"
served brief says    sideFt: 10        (setbacks-envelope section, disposition present)
served setbackRules  SF-1, bastrop-development-code, effective 2026-04-14, with citation

panel says          "edge 1 ... 35.02831192164916ft"
served edge 1        distanceFeet 121.99991662273543, role side, setback state ABSENT
                     ("No parcel or ROW adjacency mapped for this edge")
```

So the panel is evaluating against a setback source that disagrees with `setbackRulesFact`, and
against edge measurements that are not the served ones. **A fix that rounds the float, renames
the token, or hides the string would bury a real conflict between two sources and leave the
customer with a confident wrong number instead of an ugly right one.** That is the failure mode
this mission exists to prevent.

Find what `R32` is and where the panel's "expected" values and edge lengths come from. Name
both sources. If the panel's source turns out to be correct and the served record wrong, that is
a bigger finding and you escalate rather than continuing.

### THE PARCEL YOU WERE SHOWN IS THE WRONG HALF OF A SPLIT NODE — read this before you scope

Measured live 2026-09-15, stub depth:

```
48021:60981    label "1009 PECAN ST , BASTROP, TX 78602"   situs present  landUse present   envelope present
48021:8723767  label "TX"                                   situs present  landUse unknown   envelope present
```

`find_parcel` for "1009 Pecan St, Bastrop" returns **60981**, not 8723767. These are two nodes
for what is plausibly one lot: a CAD-style 5-digit node carrying the address and land use, and a
7-digit node carrying neither.

**`8723767`'s situs reports `present` while its value is the bare state token "TX".** That is a
SENTINEL counted as a populated value, the recorded situs class. The panel's "No street address
on the county record" is the panel being MORE honest than the record. Do not "fix" the panel to
print "TX".

**And the envelope disagrees ACROSS READ PATHS on one parcel:** stub depth reports `envelope:
present` for 8723767 while depth-node reports the overlay `refused / atom_path_pending`. That is
a third reader disagreeing, on top of the brief-versus-overlay disagreement below.

IN SCOPE for you: the stub-versus-node envelope disagreement, because it is the same coherence
defect as the rest of this row.

OUT OF SCOPE, carded separately as P-215 — do NOT chase it: the 5-digit/7-digit node split, the
situs sentinel, and which node is canonical. That is an identity problem in the same namespace
family as P-212's mass false retirement, and it needs the crosswalk, not the panel.

### Two further defects in the same payload, same parcel

**Same self-contradiction class as P-207, different rail.** The brief's `setbacks-envelope`
section reads `present` with 30/10/30/20 while the `envelope` overlay in the SAME response
reads `refused`, `atom_path_pending`, "Buildable envelope not computed." One response, two
opposite claims about whether an envelope exists.

**F25 vintage lie.** The UI prints "as of 2026-08-08" while the payload's `bakedAt` is
2026-09-10. Values from one date, label from another.

Fix all three or say why one is out of scope. Do not fix the visible one and leave the other
two, which is how this parcel came to carry three at once.

### Done looks like

No customer-facing string contains an internal identifier, an unrounded float, or assertion
syntax — proven by a fixture built from THIS parcel that fails on current code and passes
after. And the panel's setback source either agrees with the served `setbackRulesFact`, or the
disagreement is surfaced as a **declared conflict in prose naming both sources and their
vintages**, never as a diff.

A declared conflict is an acceptable and preferred outcome. We already have a ruling that a
card must admit when sources disagree; this is that, done properly.

### Falsifiers, pre-register before you write anything

- If your fixture passes on the pre-fix code, it does not test this defect.
- If you make the string DISAPPEAR, you have undone a ratified disclosure (A-148). The conflict
  is real and the customer is entitled to know about it. Only its rendering is in scope.
- If you make the panel agree with the record by adopting the record's numbers WITHOUT checking
  which is right, you have chosen the convenient source rather than the correct one.
- If the envelope overlay and the brief section still disagree after your change, you fixed the
  rendering and not the coherence.

### Do not

Remove the conflict disclosure — A-148 ratified it and only its RENDERING is in scope. Change
the bake or any setback table; the conflict is real and correcting the city's stale columns is
not this lane's job. Invent a setback value for any parcel. Touch `smartcity-os` or
`smartcity-dashboards`. Deploy without the operator's go — note that a merge to
legacy-design-tools main AUTO-DEPLOYS, which is how this reached production in the first place.

### Close

`_inbox/<date>_p214-panel-raw-assertion_close.json`, `planRows` `["P-214"]`, with: what `R32`
is and both sources named with vintages, which source is correct and how you determined it, the
fixture failing before and passing after, a live read of `48021:8723767` showing the customer
string, and the disposition of all three defects. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Three lanes this week left doc_repo
artifacts stranded in a worktree where no instrument could see them. If you cannot push, say so
in your handback rather than leaving them.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p214-panel-conflict-render_cp1.json
  CP2: _inbox/2026-09-15_p214-panel-conflict-render_cp2.json
  CLOSE: _inbox/2026-09-15_p214-panel-conflict-render_close.json
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
    "lane": "p214-panel-conflict-render",
    "planRows": ["P-214"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
