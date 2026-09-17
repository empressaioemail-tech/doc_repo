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

PLAN-ROW: D-10 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: smartcity-os
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane do-migration-scraper-trigger-auth --seat <your-seat-id> --plan-row D-10 --dispatch _dispatches/2026-09-17_do-migration-scraper-trigger-auth_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane do-migration-scraper-trigger-auth --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — D-10: switch the scraper's trigger from OIDC to a shared secret

You launch no sub-agents (FAN-DEPTH 0). D-5 built and validated `smartcity-scraper` on a DO droplet
(`159.89.190.154`, bound to `127.0.0.1:8080` deliberately, not publicly reachable) but could not
repoint its trigger, because Google Cloud Scheduler's OIDC identity tokens cannot authenticate to a
non-Google endpoint. This mission changes the auth mechanism, not the scheduler.

### Where you start

Ten ENABLED Cloud Scheduler jobs exist in `smartcity-os-prod`/`us-central1`, all POSTing to
`smartcity-scraper` with OIDC identity tokens (verified 2026-09-17; the dispatch that preceded D-5
wrongly claimed zero jobs — the check omitted `--location`, which `gcloud scheduler jobs list`
requires). List them yourself before assuming the count or targets are unchanged.

`smartcity-scraper`'s current GCP deployment is PRIVATE (`run.invoker` limited to specific service
accounts) — its sync routes carry no application-level auth of their own, relying entirely on the
platform-level invoker restriction. The DO droplet is a plain HTTP server with no such platform-level
gate, which is exactly why it was left bound to loopback rather than exposed.

### What to build

1. Add application-level auth to `smartcity-scraper`'s sync routes: a shared-secret header the
   scraper validates on every request (a new secret, not a repurposed one), refusing any request
   without the correct value. This must exist and be enforced BEFORE the droplet's port is opened to
   the public internet — do not expose :8080 first and secure it second.
2. Reconfigure the ten Cloud Scheduler jobs' HTTP targets to send that shared-secret header instead
   of relying on OIDC, pointed at the DO droplet's public address once step 1 is live. Cloud Scheduler
   itself stays on GCP — this migration's cost target is Cloud Run compute, not Cloud Scheduler,
   which is a trivial line item.
3. Verify each job fires correctly against the new target: trigger one manually, confirm the scraper
   accepts it, confirm a request with a wrong or missing header is refused.
4. Only after all ten are confirmed working against the new auth and target, decide whether to leave
   the GCP `smartcity-scraper` service running as a bake-period fallback or decommission it — do not
   decommission it in this same session regardless.

### Falsifiers, pre-register your answers first

1. A request to the DO scraper without the shared-secret header is refused.
2. A request with the correct header succeeds and behaves identically to the current GCP behavior.
3. All ten Cloud Scheduler jobs, triggered for real (not simulated), reach the DO scraper and
   complete successfully.
4. The GCP `smartcity-scraper` service is untouched and still running at the end of this mission.

### Do not

- Expose the DO droplet's port before the shared-secret check is live and enforced.
- Decommission the GCP `smartcity-scraper` service.
- Reuse an existing secret for this new header — mint a dedicated one.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; files touched; the auth mechanism added and where it's enforced; per-job verification
results for all ten Scheduler jobs; the four falsifiers with evidence. `status`: `closed-partial`
until a bake period confirms stability and the GCP original is formally decommissioned in a
follow-up. `probe`: the verification artifact path. `subAgents`. `leave_behind`: whether the GCP
scraper is still live and what would need to change to fully retire it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_do-migration-scraper-trigger-auth_cp1.json
  CP2: _inbox/2026-09-17_do-migration-scraper-trigger-auth_cp2.json
  CLOSE: _inbox/2026-09-17_do-migration-scraper-trigger-auth_close.json
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
    "lane": "do-migration-scraper-trigger-auth",
    "planRows": ["D-10"],
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
