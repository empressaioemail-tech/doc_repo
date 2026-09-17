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

PLAN-ROW: D-9 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: smartcity-os, smartcity-dashboards
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane do-migration-app-platform-configure --seat <your-seat-id> --plan-row D-9 --dispatch _dispatches/2026-09-17_do-migration-app-platform-configure_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane do-migration-app-platform-configure --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — D-9: configure the two DO Apps and complete the smartcity-api cutover

You launch no sub-agents (FAN-DEPTH 0). D-5 built and validated three droplets; this mission takes
the two App Platform apps the operator has already created via the DO-GitHub integration, gets each
building the right code, and completes the one cutover D-5 left undone: `smartcityos.io`.

### Where you start

Two DO Apps already exist, created 2026-09-17, auto-named by DigitalOcean: `dolphin-app` and
`walrus-app`, both in project `first-project`, region NYC1, one Web Service each. Which one tracks
`smartcity-os` and which tracks `smartcity-dashboards` was not recorded at creation time — determine
this yourself via `doctl apps list` / the `do-apps` MCP server before doing anything else, and do not
assume the names carry meaning.

Read D-5's close first: `_inbox/2026-09-17_do-migration-smartcity-fresh_close.json` (committed at
`14284eb7` on `seat/dispatch-planner` — fetch that branch if it is not in your worktree). It carries
the verified deployed commits, the droplets' current state, and a full `warningsForTheNextSession`
list you are bound by exactly as if it were part of this mission.

### The two known risks, verified at compile time (2026-09-17)

**The app tracking `smartcity-dashboards` is very likely running the wrong commit.** DO App
Platform's default behavior on GitHub connection is to deploy the tracked branch's current HEAD.
`origin/main` for `smartcity-dashboards` is at `f776b4b`; the commit D-5 verified against the live
GCP original is `96efa35`, which is BEHIND that HEAD. If this app auto-deployed on connection, it is
running unvalidated code. Do not treat "it built successfully" as validation — rebuild from the
correct commit and re-validate before anything else.

**The app tracking `smartcity-os` may be building the wrong component, and will likely show
unhealthy regardless.** `smartcity-os` contains two services — `smartcity-api` and
`smartcity-scraper` — App Platform needs explicit configuration (source directory, Dockerfile path)
to know which one this app builds; do not assume it guessed right. Separately, `Dockerfile.api`'s
`HEALTHCHECK` calls `curl`, which the `node:22-slim` base image does not ship — Docker (and App
Platform, which honours `HEALTHCHECK` unlike Cloud Run) will report this container unhealthy even
though `/api/health` answers correctly. This is cosmetic, not a real failure, but App Platform may
act on it (restart loops, routing the service as down) in ways plain Docker did not.

### What to build

1. Identify which app is which via the API/MCP tools, not by guessing from the animal names.
2. For the `smartcity-os` app: confirm which component it builds. If it is building `smartcity-api`,
   confirm the source path and Dockerfile point at `Dockerfile.api` specifically. Fix that
   Dockerfile's `HEALTHCHECK` (swap `curl` for a check the base image actually has, or install
   `curl` in the image) on a dedicated branch — do not touch `main`. Confirm the commit it deploys
   equals the D-5-verified `8bea7fa`, or the current verified-equivalent if `smartcity-os` has moved
   since (re-check `git log -1` on `origin/main` before assuming staleness still holds).
3. For the `smartcity-dashboards` app: this one needs to deploy `96efa35`, not `main` HEAD. The
   likely mechanism is a dedicated deploy branch created at that exact commit, with the app's
   autodeploy pointed at that branch instead of `main`, and autodeploy-on-push disabled so it does
   not silently drift forward. If DO's platform offers a cleaner way to pin a one-off commit without
   a dedicated branch, use that instead — state which mechanism you used and why.
4. Re-run the same validation methodology D-5 used (endpoint sweep, health compare) against each
   app's own DO-provided address, before touching any DNS. Every endpoint that matched on the
   droplets must still match on the App Platform apps.
5. Only once both are clean: attach `smartcityos.io` as a custom domain to whichever app serves
   `smartcity-api`. Lower the GoDaddy apex A/AAAA and `www` CNAME TTL a day ahead of the actual
   switch (governing rule 4, OPS-25) if that lead time is available in this session; otherwise flag
   the shortened lead time explicitly in your close rather than skipping the step. Update the GoDaddy
   records to what DO's App Platform domain-verification provides, verify DO issues a valid
   certificate, and watch both origins' logs during propagation.
6. Keep the GCP `smartcity-api` original running, unmodified, through a bake period before
   decommissioning it or the D-5 droplets. Do not delete the droplets in this same session even after
   the domain cutover succeeds — that is a follow-up once the bake period reads clean.

### Falsifiers, pre-register your answers first

1. Each App Platform app is confirmed building the intended repo/component from the intended commit,
   not an assumed one.
2. Every endpoint and health surface that matched on D-5's droplets still matches on the
   corresponding App Platform app.
3. After the `smartcityos.io` cutover, the GCP original is confirmed still running and receiving no
   real traffic (uptime checker only) via its own request logs — not assumed from the DNS change.
4. The healthcheck fix is verified by observing the container report healthy on the new base, not by
   reading the Dockerfile diff alone.

### Do not

- Touch `hauska-engine`, `hauska-factory`, `hauska-map`, `hauska-mcp-server`, or anything they own.
- Delete the D-5 droplets or the GCP originals in this session.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; files touched; which app maps to which repo/component and how you confirmed it; the
commit-pinning mechanism used for dashboards; the validation table per app; confirmation of the
GCP original's post-cutover traffic state; the four falsifiers with evidence. `status`:
`closed-partial` until the bake period is separately confirmed clean and the droplets/GCP originals
are formally decommissioned in a follow-up. `probe`: the validation artifact path(s). `subAgents`.
`leave_behind`: current traffic state of every DO resource (apps, droplets, GCP originals) so the
next session does not misjudge what is live.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_do-migration-app-platform-configure_cp1.json
  CP2: _inbox/2026-09-17_do-migration-app-platform-configure_cp2.json
  CLOSE: _inbox/2026-09-17_do-migration-app-platform-configure_close.json
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
    "lane": "do-migration-app-platform-configure",
    "planRows": ["D-9"],
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
