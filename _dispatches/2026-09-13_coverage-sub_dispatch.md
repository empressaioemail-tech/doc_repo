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

PLAN-ROW: P-182 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo


## Mission — P-182 / COVERAGE-SUB: every city, town and postal place in the six onboarded counties, and what each is missing

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no write to any database, and no file written except your one output artifact.

### Why this row exists — the worked example

The operator searched `202 ELECTRA ST, THRALL, TX 76578` on the live `smartsite.cloud` surface on 2026-09-13. Thrall is an incorporated city inside Williamson County, which is one of our six onboarded counties. The brief refused on four rails and each refusal named a different real gap:

- LAND USE: "Not read: the county's parcel id does not match the appraisal record, so zoning is unavailable"
- LIVING AREA: `lookup-failed` — "No `cad_property` row at declared vintage for 48491:R007189"
- ZONING: "inside Thrall limits; **no zoning layer on file for Thrall**"
- SETBACKS: "no setback table covers this parcel's district"
- BUILDABLE: "Not stamped here"

The surface behaved correctly. It refused honestly and named why. The problem is that **nobody has ever enumerated which places inside an onboarded county have no coverage**, because county onboarding was treated as the unit of work. Thrall proves the unit is wrong.

Your job is that enumeration. Thrall MUST appear in your output as a row.

### The six counties

Bastrop 48021, Caldwell 48055, Hays 48209, McLennan 48309, Travis 48453, Williamson 48491.

### The roster — get this right or the rest is worthless

Enumerate every incorporated place, town and postal place in those six counties from an authoritative source. Candidates, in preference order: a Census/TIGER place-to-county roster if one is already in the repo or the factory store; `tx_city_boundary`, which OPS-22 section 2 records at **69 cities across these six**; and the city rosters inside `ZONING_LAYERS` and the ruled setback tables. State which roster you used and why. **A place that exists in the world and is absent from every roster we hold is itself a finding** — say so rather than quietly working from our own list, because working only from our own list is how Thrall stayed invisible.

### Per place, report

| column | question |
|---|---|
| place | name, county, FIPS if available |
| incorporated | city / town / CDP / postal-only |
| zoning layer on file | is there a zoning source for this place at all |
| in `ZONING_LAYERS` | is it wired in the LDT registry |
| ruled setback table | does one cover this place |
| parcels bound | does `landing_parcel_jurisdiction` bind parcels to it |
| live surface | what the deployed surface returns for ONE real address in it |

The live-surface column is optional if you cannot reach the surface read-only without credentials. If you cannot, say UNMEASURED for that column rather than inferring it from the registry.

### The baseline you must reproduce or contradict

OPS-22 section 2 records **69 cities across the six counties, 23 with a zoning endpoint**, split: Bastrop 3/3, Caldwell 3/3, Hays 5/11, Williamson 7/14, Travis 3/18, McLennan 2/20.

If your enumeration does not reproduce those numbers, **say so loudly and show both**. Do not silently report a different figure. A disagreement between your count and OPS-22 is a finding either way: either the doc is stale or your roster is wrong, and which one it is matters.

### Rules

1. Cite the source of every column. A column you could not establish is UNMEASURED, never a guess and never a default of "no".
2. "No coverage" and "not checked" are different states and must not collapse.
3. Rank the output so places with the LARGEST population or parcel count and NO zoning coverage come first — that is the list the operator will act on.
4. Do not acquire anything, do not wire anything, do not propose a build. This row enumerates.

### Bounded

Read-only, a few minutes per source. No repo-wide greps returning hundreds of hits. Every command must exit on its own. If a store query is needed, `FACTORY_DATABASE_URL_RO` is the read-only role; every statement must be a SELECT and carry a statement timeout.

### Output

`_inbox/2026-09-13_subcounty_coverage_audit.md` — snapshot header (what rosters and SHAs or store you read, and when), the per-place table, the reproduce-or-contradict verdict against the OPS-22 baseline, a ranked "largest places with no zoning coverage" list, and a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_coverage-sub_cp1.json
  CP2: _inbox/2026-09-13_coverage-sub_cp2.json
  CLOSE: _inbox/2026-09-13_coverage-sub_close.json
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
    "lane": "COVERAGE-SUB",
    "planRows": ["P-182"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
