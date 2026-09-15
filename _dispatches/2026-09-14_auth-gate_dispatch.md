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

PLAN-ROW: P-199 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools


## Mission — P-199 / AUTH-GATE: name the cause, fix only the unambiguous one

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

**This row is a DIAGNOSIS. Three mutually exclusive causes produce three different fixes, and
picking the wrong one is worse than waiting.** You have conditional fix authority, defined
below, and it applies to exactly one of the three.

### The observation

Operator, 2026-09-14, two screenshots. An **incognito** session at
`smartsite.cloud/?via=empressa` opens **1006 HILL ST, BASTROP, TX 78602** (APN `34841`,
Bastrop County) and, after clicking **"More facts"**, reads the entire brief with no
authentication:

```
zoning MU · setbacks F 15 / S 5 / R 15 · buildable · special district · pipeline
well · footprint · boundary · city limits · who-serves · school district
utility service · overlay districts · agValuation · maxImperviousCover
```

Operator intent: **the brief should require sign-in.**

### The clue that should shape your whole approach

**Two gates are visible and only one fires.**

- **Owner** and **tax-assessed value** ARE gated: "Owner data is on Studio. Upgrade to see
  who owns this parcel."
- The **sign-in** gate fires only on the deep-research **tool**, not on the brief.

So the gating machinery exists and works. **The question is not "why is there no gate." It is
"why does the working gate cover exactly two fields and nothing else."** Answer that and the
cause usually falls out.

### Phase 1 — one minute, do this before anything else

Incognito load of the test parcel **with** `?via=empressa` and **without** it. Compare what
the brief serves in each.

`?via=empressa` is a PromoteKit affiliate param, and **p185 deployed PromoteKit to BOTH the PE
site and cortex-api on 2026-09-14**, the same day as the observation. If behaviour differs
between the two loads, this is a fresh regression from today's deploy, the cause is settled,
and you should stop investigating and go to the fix.

If behaviour is identical, hypothesis 1 is eliminated. Say so explicitly and continue.

### Phase 2 — read the policy, not the UI

Read the `accessPolicy` on the atoms actually backing the served fields: zoning, setbacks,
who-serves, utility service, overlay districts.

**`accessPolicy` gates a WHOLE ATOM, never a field.** If those atoms carry `public-free`, then
**the surface is correctly serving what the policy says** and the defect is upstream in the
policy rather than in the UI. This matters enormously for the fix: a gate added at the surface
would leave every other consumer still serving the same body, the **MCP catalog tools
included**, because returning the body whole is their job by design.

### Phase 3 — find the working mechanism

Determine exactly how owner and tax-assessed value come to be gated when the rest are not.
That path is the working example. Name the mechanism, name where it is applied, and name why
it does not extend to the other fields.

### Fix authority — CONDITIONAL, read carefully

**Fix ONLY if phase 1 shows a regression introduced by p185.** That case is unambiguous: a
deploy landed today and changed behaviour, and restoring it is repair.

**If the cause is (2) an atom-policy question or (3) a tier-width question, STOP and hand
back with the cause named.** An atom-policy change and a pricing ruling are both outside this
lane. Reporting the cause precisely IS the deliverable in those two cases and is worth more
than a fix that papers over it.

**Never fix this by adding a field stripper at the surface.** Protection that lives downstream
of the policy only covers the consumers that implement it. If a field must be gated, the
correct fix is to move it to a correctly-policied atom — and that is not this row.

### Proportion — state it, do not assume it

Texas property records are public, and the brief already serves owner free from `cad_property`
on other paths. So this class is usually **paid-tier integrity rather than a privacy breach**.
Your close must say which one this is. It changes the urgency and it changes who owns the fix.

### Related, already established — do not re-derive

`accessPolicy` is atom-level, not field-level. MCP catalog tools (`get_atom`,
`get_property_atom_chain`, `atom_trace`, `atom_export`) return bodies whole with no field
strip. `engine-api` gate headers are spoofable and are not the enforcement point. An auth
deploy needs the anonymous path and the claim flow together, or it strands existing anonymous
work.

### Bounded and out of scope

Read-mostly. No atom-policy change. No tier or pricing decision. **No write to `smartcity-os`
or `smartcity-dashboards`** — both are another lane's, and `smartcity-os` is under an absolute
no-touch. No deploy without the operator's explicit go. Every command must exit on its own.

### Close

A close naming **exactly one** of the three causes, carrying the evidence that eliminated the
other two, plus the phase-3 answer on why owner and tax-assessed value are gated and the rest
are not. If you fixed under the conditional authority, say what changed and how you proved it
by violation: the same incognito load must now refuse.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_auth-gate_cp1.json
  CP2: _inbox/2026-09-14_auth-gate_cp2.json
  CLOSE: _inbox/2026-09-14_auth-gate_close.json
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
    "lane": "AUTH-GATE",
    "planRows": ["P-199"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
