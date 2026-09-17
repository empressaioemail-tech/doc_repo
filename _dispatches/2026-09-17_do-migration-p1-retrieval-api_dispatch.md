CANON-PREAMBLE v6302c07c
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS LIVE FLEET-WIDE (operator 2026-09-17) — doctl and the DigitalOcean MCP servers (`do-apps`, `do-droplets`) are configured in the global Cursor config on the fleet machine, authenticated with an agent token scoped to Droplets and Apps only (no account, database, or networking access). Any lane doing DigitalOcean provisioning or migration work has this available without further setup; do not ask the operator to configure it again.
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

PLAN-ROW: D-3 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: hauska-engine
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane do-migration-p1-retrieval-api --seat <your-seat-id> --plan-row D-3 --dispatch _dispatches/2026-09-17_do-migration-p1-retrieval-api_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane do-migration-p1-retrieval-api --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — D-3: Phase 1 pilot, stand up hauska-retrieval-api on DigitalOcean

You launch no sub-agents (FAN-DEPTH 0). This mission provisions and validates the DO replacement
and reports readiness. It does not flip production traffic — that is a separate, explicit step the
operator authorizes after reading your CP2, because it changes a live dependency's backend.

### Where you work

`hauska-engine`, fresh clone from `origin` under your own worktree. Register it under your seat and
remove the entry at close. Do not build in another lane's checkout.

### What you are replacing, verified live at compile time (2026-09-17)

- Source GCP service: `hauska-retrieval-api`, project `hauska-prod-497015`, region `us-central1`,
  1 vCPU / 1Gi memory, `minScale=1` / `maxScale=20`. Public URL:
  `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`.
- Its environment (names only; pull live values from GCP Secret Manager, do not hardcode or paste
  secret values into any file this lane commits): `DATABASE_URL`, `CORTEX_DATABASE_URL`,
  `FACTORY_DATABASE_URL_RO`, `RETRIEVAL_API_KEY`. All four are Neon or Neon-adjacent connection
  strings and an API key — none of them are GCP-specific, so none of them change when compute moves.
- Its only known caller in the verified call graph: `hauska-mcp-server` (`hauska-prod-497015`), via
  the env var `HAUSKA_BACKEND_URL`. No other service among hauska-mcp-server, cortex-api, or
  smartcity-dashboards references this service's URL in their live deployed env vars (checked
  2026-09-17). This does not prove no other caller exists — it was not checked against every repo's
  source or against any Vercel-hosted frontend. If your own investigation finds another caller,
  stop and report it before proceeding past CP1; do not assume the list above is exhaustive.
- DO tooling is already live fleet-wide: `doctl` and the `do-apps`/`do-droplets` MCP servers are
  configured with a token scoped to Droplets and Apps only. Do not re-provision either.

### What to build

1. Stand up `hauska-retrieval-api` on a DO Droplet sized to match the source (1 vCPU / 1GB minimum;
   size up only if the app's own resource profile under smoke-test load requires it, and say so if
   you do).
2. Replicate the four secrets above into the Droplet's environment via your own read of GCP Secret
   Manager's current values (`gcloud secrets versions access latest --secret=<name>
   --project=hauska-prod-497015`) — never via this dispatch, which does not carry them.
3. Deploy the same application code the GCP revision is currently running (read the deployed
   image/commit from `gcloud run services describe hauska-retrieval-api --project=hauska-prod-497015
   --region=us-central1` before you branch, so you are not deploying a stale or ahead-of-main build).
4. Smoke-test the DO deployment directly against its own address: confirm it boots, connects to all
   three databases, and serves at least one real, representative read request per endpoint the
   service exposes, with output compared byte-for-byte or field-for-field against the same request
   made to the GCP original in the same session.
5. Run a short parallel-validation window (not a multi-day bake — that is a follow-up step after
   this dispatch closes): send a batch of real or replayed read requests to both origins and diff
   the responses; report count tested, count matched, and every divergence found, not just a summary
   verdict.
6. Do NOT touch `hauska-mcp-server`'s `HAUSKA_BACKEND_URL` or redeploy it. That is the actual traffic
   cutover and it is explicitly out of this mission's scope.

### Falsifiers, pre-register your answers first

1. The DO deployment serves the same response shape and values as the GCP original for every
   endpoint tested, on real (not synthetic-only) data.
2. All four secrets resolve correctly on the DO side with no fallback, default, or empty-string
   substitution anywhere in the deployment.
3. The GCP original is untouched — no config, scale, or traffic change on `hauska-retrieval-api` in
   `hauska-prod-497015` — verified by re-describing it at the end of your session and diffing against
   the start-of-session describe.
4. If any divergence between the two origins is found, it is named with the specific request and
   response difference, not asserted as "minor" or waved off.

### Do not

- Flip `HAUSKA_BACKEND_URL` on hauska-mcp-server, or redeploy hauska-mcp-server, for any reason.
- Modify, scale, or decommission the GCP original.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; files touched; the DO deployment's address and how to reach it; the parallel-validation
table (count tested, matched, diverged, with every divergence detailed); the four falsifiers with
evidence; confirmation the GCP original is unchanged. `status`: `closed-partial` — this row is not
`closed` until the operator has read this close and separately authorized the traffic cutover as its
own step. `probe`: the parallel-validation artifact path. `subAgents`. `leave_behind`: name the DO
Droplet/App as a live, running, not-yet-serving-production resource so the next session knows it
exists and does not stand up a duplicate.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_do-migration-p1-retrieval-api_cp1.json
  CP2: _inbox/2026-09-17_do-migration-p1-retrieval-api_cp2.json
  CLOSE: _inbox/2026-09-17_do-migration-p1-retrieval-api_close.json
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
    "lane": "do-migration-p1-retrieval-api",
    "planRows": ["D-3"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
