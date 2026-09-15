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

PLAN-ROW: P-179 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine


## Mission — P-179 ENGINE GATE TOKEN: the engine's bearer check is armed, then the door is closed

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you and reviews your CP1 design before any change, because this is a
credential and an IAM change. EVERY step that mints a secret, mounts it, or changes IAM STOPS
for the operator in the planner's thread; you prepare, you do not execute those steps until
the operator's go is quoted back to you.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`hauska-engine-p179-gate` (branch `fix/p179-engine-gate-token`) and `legacy-design-tools-p179-gate`
(branch `chore/p179-engine-gate-callers`), from `origin/main`; declare start commits.

### What is true today (F22; wave-4 Q5; overseer reads 2026-09-13)

- `hauska-engine-api` (hauska-prod-497015, us-central1): IAM `roles/run.invoker: allUsers`,
  ingress `all`, serving `hauska-engine-api-00215-niv`; env carries `GATE_CONTEXT_SIGNING_KEY`,
  `RETRIEVAL_API_URL`, `RETRIEVAL_API_KEY` and NO `ENGINE_API_GATE_TOKEN`, so the bearer check
  in the engine passes every caller (fleet memory: "engine-api gate headers are spoofable").
- No secret named `ENGINE_API_GATE_TOKEN` exists in Secret Manager in hauska-prod-497015 or in
  legacy-design-tools-prod. `cortex-api` carries `ENGINE_API_GATE_TOKEN` as a plain env var
  (value unread); `smartsite-mcp` carries none and now calls the engine directly (P-152 lane 5).
- The composer gate (hauska-engine #438) refuses public-free tiers and is real defence in depth
  for the two known callers; a caller who sets `x-hauska-access-tier` against the public URL
  is not stopped.
- Fleet rule: factory and cortex-consumed secrets are mirrored in BOTH projects or the next
  deploy fails on resolution (`factory-secrets-mirrored-two-projects`). Workflow deploys revert
  manually set env vars: the mount goes in the workflow, not by hand.

### What you build, in order

1. **CP1 design.** Read the engine's gate code and name exactly which routes the bearer check
   covers and which it does not (health may stay open); the header name the engine reads (never
   guess a credential header); the callers (cortex-api, smartsite-mcp, anything else that
   resolves `hauska-engine-api`'s URL: grep both repos and the Vercel BFF); the deploy workflows
   that must carry the mount; the rollout order that never leaves a caller without the token
   while the engine requires it (callers first, engine last). Pre-register the violation test.
2. **Prepare, then STOP.** The workflow and config changes as PRs (not merged): the engine
   mounts `ENGINE_API_GATE_TOKEN` from Secret Manager; cortex-api and smartsite-mcp read theirs
   from Secret Manager instead of a plain env var. Present to the operator through the planner:
   "mint `ENGINE_API_GATE_TOKEN` in hauska-prod-497015 and legacy-design-tools-prod (same
   value), grant the three services' runtime identities `secretAccessor`, merge the three PRs,
   deploy callers then engine." The operator mints the secret or gives the go for you to; the
   value is never printed, never pasted, never logged (explicit-placeholder convention).
3. **Execute on the go**, in the order designed, one traffic shift per service under the
   planner's leases; verify by violation live: a request without the token to a gated data
   route on the public URL returns 401; with the token, 200; cortex-api and smartsite-mcp
   reads of `48021:34049` unchanged before and after.
4. **The door.** As a separate step with its own go: remove `allUsers` from `roles/run.invoker`,
   grant the callers' service identities invoker, set ingress to internal-and-load-balancer if
   the callers' paths allow it (read how cortex-api and smartsite-mcp reach the engine before
   deciding; a Vercel-hosted caller cannot use internal ingress). Verify by violation:
   an unauthenticated call from outside returns 403 at the platform before the engine sees it.

### Falsifiers

- If a caller loses its reads at any point in the rollout, the order was wrong; roll the engine
  back first.
- If a token-less call still returns data after step 3, the check is not on that route.
- If the secret resolves in one project and not the other, the next deploy of the other fails.

### Out of scope

The tier model. The composer gate's semantics (lane 5's, done).

### Close

`_inbox/<date>_p179-gate_close.json`, `planRows` `["P-179"]`, with the CP1 design, the PRs and
merge SHAs with conclusion strings, the operator's quoted gos, the revisions by field, the IAM
policy before and after (members only, no values), and the violation reads. `leave_behind` is
required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_p179-gate_cp1.json
  CP2: _inbox/2026-09-13_p179-gate_cp2.json
  CLOSE: _inbox/2026-09-13_p179-gate_close.json
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
    "lane": "p179-gate",
    "planRows": ["P-179"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
