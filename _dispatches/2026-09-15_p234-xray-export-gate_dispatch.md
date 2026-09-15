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

PLAN-ROW: P-234 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-mcp-server

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p234-xray-export-gate --seat <your-seat-id> --plan-row P-234 --dispatch _dispatches/2026-09-15_p234-xray-export-gate_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p234-xray-export-gate --seat <your-seat-id>

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


## Mission — P-234: the X-ray gate refuses before the engine is ever asked

### The finding you are acting on

P-221 rebuilt the X-ray as a subset of the feasibility model, exactly as P-120 ruled. It was
merged (#450, `4237c0b`), and the integration seat BUILT AND DEPLOYED it: Cloud Build
`ec9f434b` SUCCESS, digest `sha256:ce50efea…8ea0`, serving revision `hauska-engine-api-00228-zat`
at 100 percent, read by field. All four of P-221's pre-registered falsifiers were confirmed at
the code level, including the strongest form — `verdictLine` and `brief` were DELETED from the
options type and from the route's zod schema, so no code path can assemble them from caller
input even by mistake.

**And `export_instrument kind=dossier` on `48021:34049` still returns the byte-identical
refusal it returned before the fix:**

```
{"error":"pipeline_output_absent",
 "message":"X-ray cannot be generated: the verdict and cited brief facts were not produced...",
 "missing":["verdict","brief_facts"],
 "upstreamBodyStatus":422,
 "upstreamStatus":"unmeasured"}
```

**The refusal never reaches the engine.** Measured by the integration seat: `hauska-engine-api`
logged ZERO dossier or X-ray requests in the hour around the call, and a full 20-minute sweep
of ALL engine traffic shows only `/health` and two `site-plan-export/refresh` calls. The tell
was in the payload the whole time — **`upstreamStatus: "unmeasured"` literally says the caller
never measured upstream** — and it was read past on the first pass.

The connector routed the call to **hauska-mcp-server** (`/mcp` at 18:16:07Z, project
hauska-prod-497015). `pipeline_output_absent` appears in exactly two repos: hauska-engine's own
route, which P-221 fixed, and **`hauska-mcp-server/src/xray-export-gate.ts`** — a file named
for precisely this job, in a repo no lane has touched.

**METHOD NOTE, and do not skip it:** that file was located by GitHub code search, which is
**NOT exhaustive** — the same query returned zero matches for legacy-design-tools, which may
well be a false negative. **Confirm by reading the repo before treating `xray-export-gate.ts`
as the sole emitter.** If a second emitter exists, find it now rather than after a fix that
only half-works.

### Done looks like

`export_instrument kind=dossier` produces a real file for a parcel whose brief facts are
present. The gate either asks the engine and reports what the engine actually says, or it
declines naming an artifact that is GENUINELY missing **and** an action available on the
surface the caller is actually using.

### The two constraints that bound any fix

**1. Do NOT weaken the hollow-report refusal.** P-221 preserved it deliberately and P-221's own
row is explicit: declining to emit a hollow report is the behaviour we want, and the bug is
that it has to. After your change the refusal must still fire when the inputs are genuinely
absent. It becomes unreachable in the normal case; it is never removed.

**2. The remedy text is itself a defect.** "Open the property brief and try again" is a WEB APP
instruction with no connector equivalent, and opening the brief did not help. A refusal that
names an action the caller cannot take is a dead end wearing a helpful face. Any refusal this
path can still emit must name an action available on the surface the caller is on.

### Falsifiers, pre-register your answers before you run anything

1. **Confirm the current refusal is emitted WITHOUT an engine call, by reading the code**, not
   by inferring it from the log evidence above. If the gate does call the engine on some path,
   the mechanism is different from what this row assumes and you must say so.
2. **Construct a parcel whose verdict or brief facts are genuinely absent and confirm the
   refusal STILL fires after your change.** If it does not, you removed the guard rather than
   making it unreachable, and this row is failed regardless of how well the happy path works.
3. **Search the repo yourself for other emitters of `pipeline_output_absent` and of the same
   refusal shape.** If `xray-export-gate.ts` is not the only one, a fix there alone will look
   like it worked on your test parcel and still fail elsewhere.
4. If `kind=dossier` starts producing a file but its content disagrees with the feasibility
   study for the same parcel, P-221's subset relationship has been broken downstream and the
   row is not done.

### Known traps

- **hauska-mcp-server is its own repo and its own Cloud Run service** in project
  `hauska-prod-497015`. It is NOT legacy-design-tools and NOT the `smartsite-mcp` service in
  `legacy-design-tools-prod`. Confirm which service actually serves `export_instrument` before
  editing; both exist and both answer `/mcp`.
- **Check whether the deployed revision is current.** A merge there may ship nothing — no repo
  in this portfolio auto-deploys on merge, verified three times on 2026-09-15. Read the serving
  revision by field and say what it is.
- `upstreamStatus: "unmeasured"` is a real signal, not boilerplate. Wherever it is set, that is
  a place the code KNOWS it did not consult upstream. Use it.

### Do not

- Do not weaken the hollow-report refusal.
- Do not edit hauska-engine. P-221's engine-side work is correct and deployed; the defect is
  not there.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name the service and the deployed revision you measured against, and state whether
`xray-export-gate.ts` was the only emitter. Close to `_inbox/` on doc_repo main and PUSH it.
Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p234-xray-export-gate_cp1.json
  CP2: _inbox/2026-09-15_p234-xray-export-gate_cp2.json
  CLOSE: _inbox/2026-09-15_p234-xray-export-gate_close.json
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
    "lane": "p234-xray-export-gate",
    "planRows": ["P-234"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
