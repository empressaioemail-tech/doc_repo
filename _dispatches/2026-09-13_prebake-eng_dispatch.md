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

PLAN-ROW: P-181 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine


## Mission — P-181 / PREBAKE-ENG: what does the hauska-engine atom write path believe about its input?

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no network, no database, and no file written except your one output artifact.

### What an assumption register is

An assumption is something the CODE BELIEVES ABOUT ITS INPUT that could be false for some county. The purpose is to predict what breaks when a county is processed, BEFORE processing it, so 254 counties do not each teach the same lesson serially.

### Snapshot discipline

`P:\hauska-engine` local checkout is STALE. Read `origin/main` only:

```
cd /p/hauska-engine && git rev-parse origin/main    # declare this SHA
cd /p/hauska-engine && git show origin/main:<path>
```

`git fetch origin` is permitted. Nothing else git-wise. It was `112bccb` at dispatch; report what you actually read.

### What to read

- `packages/atoms/src/fact-writer-ids.ts`, especially `normalizeForJoin()`
- `packages/atoms/src/write-boundary.ts` and its tests
- the parcel-node planner and writer (`parcel-node`, `parcelNodeId`, `foldedExtraFeatures`)
- the atoms writer lease: `atoms_writer_lease`, heartbeat, `ATOMS_WRITER_LEASE_NOT_HELD`
- `writePropertyAtomsBatch` and the writer allowlist
- `resolveDeclaredCadVintage`
- the owner-fact, land-use-fact and flood-hazard-fact writers
- `services/retrieval-api` reader, where it makes input assumptions

### Verified context — do not re-derive, DO verify whether still true at your SHA

**The identity seam.** `place_key` is `"{county_fips}:{prop_id}"` RAW; `parcelNodeId` is `"{county_fips}:{normalized prop_id}"` where `normalizeForJoin()` strips leading zeros on all-digit tokens. A factory job's own header flags this as an explicit ASSUMPTION: if `"27303"` and `"027303"` are both real distinct CAD rows, the join conflates them, and **that population has never been measured.**

**Account is not feature.** The parcel-node planner folds every `txgio_parcel` feature sharing one prop_id into ONE atom by design (`foldedExtraFeatures`). Tarrant has 28,665 prop_ids mapping to more than one distinct feature; one Tarrant prop_id carries 532 rows across 111 distinct owner names.

**Vintage disagreement.** Factory takes the LATEST `cad_property.tax_year`; the engine uses a per-county DECLARED year via `resolveDeclaredCadVintage`, engine-internal and not exposed to Factory. Factory's owner cell does not record which year it reflects.

**A real incident to check the code against.** Harris parcel-node apply spent 58 minutes in its plan phase, the writer lease expired, and the apply wrote 0 atoms with `ATOMS_WRITER_LEASE_NOT_HELD`, because the CLI heartbeats only inside `writePropertyAtomsBatch` and the plan phase had none. The retry with a 4-hour TTL landed 1,523,640/1,523,640 verified.

A claim above that is now FIXED is a valuable finding, not a failure. Say so and cite the line.

### Row format

```
ID: ENG-01
BELIEF: <what the code assumes, one sentence>
WHERE: <path>:<line> in <function>   (quote the 1-3 decisive lines)
FAILURE MODE: silent-wrong-value | silent-collapse | silent-skip | loud-throw | lease-loss | timeout
GUARDED: none | partial | fail-closed — by what, at what line
KNOWN VIOLATORS: <counties, or "none known">
PRE-RUN DETECTABLE: yes/no — if yes, EXACTLY what query or probe reveals the violation before any atom is written
CONFIDENCE: read-at-source | inferred
```

### Rules

1. **Silent failures rank first.** A loud throw is already safe.
2. **Cite only lines you opened.** Anything else is `CONFIDENCE: inferred` with the reason.
3. **Scale assumptions count as rows.** Anything that loops in application code over county-sized cardinality belongs here: Harris is roughly 1.5M parcels and killed several such paths.
4. **A guard that cannot fire is your most valuable finding** — no call site, unreachable branch, a vacuous default. Show the call sites.
5. **`normalizeForJoin` gets its own careful row.** State precisely what input makes it collapse two distinct real parcels into one, and name the exact query against `cad_property` that would measure how large that population actually is. Nobody has ever run it.

### Bounded

A few minutes per file. Aim for 12 to 25 solid rows. On large files read exports and function tops rather than every line. No repo-wide greps returning hundreds of hits. Every command must exit on its own.

### Output

`_inbox/2026-09-13_assumption_register_engine.md` — snapshot header (repo, the `origin/main` SHA you read, the files you actually opened), then the rows, then a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_prebake-eng_cp1.json
  CP2: _inbox/2026-09-13_prebake-eng_cp2.json
  CLOSE: _inbox/2026-09-13_prebake-eng_close.json
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
    "lane": "PREBAKE-ENG",
    "planRows": ["P-181"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
