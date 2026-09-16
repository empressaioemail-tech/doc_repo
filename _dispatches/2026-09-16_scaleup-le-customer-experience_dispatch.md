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

PLAN-ROW: P-197 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane scaleup-le-customer-experience --seat <your-seat-id> --plan-row P-197 --dispatch _dispatches/2026-09-16_scaleup-le-customer-experience_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane scaleup-le-customer-experience --seat <your-seat-id>

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


## Mission — L-E CUSTOMER EXPERIENCE: what a customer actually sees, city by city, across the six counties

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store. Surface reads only.

### Why this exists

The operator, 2026-09-16: *"the most important thing is we have the customer experience showing
like it needs to be."* Two examples from the same day show how far it can drift while every gate
passes:

- **203 E Oxford Dr** showed "Travis County", the street line and "SF-S".
  - Nothing said Pflugerville, although the ledger holds `situsCity` PFLUGERVILLE,
    `situsZip` 78660, `cityLimits` Pflugerville and `zoningJurisdictionKey` pflugerville-tx.
- **5292 Hartson, Kyle** (district PC R2, a planned community):
  - the MCP returned `envelope: "absent-verified"`;
  - the map said "Setbacks pending re-warm from city per-parcel record ... pre-layer-23
    sources", which is Bastrop wording on a Kyle lot.

### Step 1: write the spec before you grade anything

`_inbox/<date>_scaleup-le_card_spec.md`: what the property card, the MCP answer and the PDF
**must** show for a parcel. Derive it from the Smart Site design of record and the standing
rulings, and cite each:

- envelope drawn and figure refused (2026-09-11);
- most-current source wins, with a conflict row (2026-09-11);
- the PUD message (A-164);
- salesHistory unavailable (P-209);
- tier gating;
- honest refusals that name what is missing.

At minimum it covers:

- the full address with city and ZIP;
- the county;
- zoning **with its governing jurisdiction**;
- setbacks with citation and vintage;
- the envelope, drawn or declined, with the specific true reason;
- flood;
- land use;
- lot size;
- year built;
- the refused and gated fields;
- how an unincorporated parcel reads;
- how an uncovered county reads.

### Step 2: choose fixtures deterministically

Choose per wired city in the six counties, plus the unincorporated remainder of each county. The
city list is in `_inbox/2026-09-16_setback_parcel_grain_results.txt`. Select from the factory
store (read-only) by a stated rule, for example the lowest `md5(place_key)` in each bucket. Where
a city has them, include:

- a codified district with setbacks;
- a district miss;
- a no-table city parcel;
- a PUD or planned community;
- a parcel whose envelope draws;
- one whose envelope is declined;
- a corner lot;
- a curved frontage;
- a vacant lot.

**The fixture list is itself a deliverable.** It becomes the per-city surface probe (P-197).

### Step 3: read every fixture on every surface

| Surface | What to read | Where the account is not entitled |
|---|---|---|
| Map | `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`; `POST .../api/spine/cortex/api/brokerage/v1/place/buildable-envelope`; what the card renders | n/a |
| MCP | `get_smart_site` at depth node and stub, if your session has the Smart Site connector | The operator's account is paid Solo. Owner and valuation refusals are correct, and site-plan export needs an unlock. If you have no connector, mark the MCP leg UNMEASURED. |
| PDF | a PDF export | UNMEASURED, with the reason, where the account is not entitled |

**Grade each fixture against the spec, field by field.**

### Step 4: roll up

**Per city:** the scorecard, meaning fields right and fields wrong. **The defect list:** each
defect with its count across fixtures and the code location that produces it. Where two surfaces
disagree on the same parcel, that is a P-217 instance; list it.

### Falsifiers

Pre-register your answers before you run anything.

1. Your spec must fail the Pflugerville card on the missing city, and fail the Kyle PC R2 card on
   both the MCP state and the map wording. If it does not, the spec is too weak.
2. **At least one city must score well.** If none does, check your reading of the map payload
   against a Bastrop parcel the operator has confirmed looks right, such as 1109 Pecan.
3. Every defect names the file that produces it. Where you cannot find the file, the defect is
   still listed, marked "source not located".

### Close

**Report.** `_inbox/<date>_scaleup-le_customer_experience_report.md`, with the spec, the fixture
set, the per-city scorecards and the defect list.

**Close JSON.** `_inbox/<date>_scaleup-le-customer-experience_close.json`, carrying:

- `planRows` `["P-197"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_scaleup-le-customer-experience_cp1.json
  CP2: _inbox/2026-09-16_scaleup-le-customer-experience_cp2.json
  CLOSE: _inbox/2026-09-16_scaleup-le-customer-experience_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/seat-worktrees/dispatch-planner/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "scaleup-le-customer-experience",
    "planRows": ["P-197"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
