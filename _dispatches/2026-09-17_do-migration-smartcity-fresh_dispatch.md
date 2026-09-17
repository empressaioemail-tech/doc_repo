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

PLAN-ROW: D-5 (90_operations/OPS-25_cloud_infrastructure_and_cost_program.md)
repo: smartcity-os, smartcity-dashboards
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane do-migration-smartcity-fresh --seat <your-seat-id> --plan-row D-5 --dispatch _dispatches/2026-09-17_do-migration-smartcity-fresh_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane do-migration-smartcity-fresh --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.


## Mission — D-5: fresh-build migration of the SmartCity product line to DigitalOcean

You launch no sub-agents (FAN-DEPTH 0). This mission builds SmartCity's three services fresh on
DigitalOcean and validates them. The `smartcity-api` DNS cutover (GoDaddy) is the one step in this
mission that changes a live, customer-facing path — do it last, deliberately, with a bake period,
and do not touch it until the other two services are already proven on DO.

### Where you work

Two repos, both confirmed idle since 2026-09-15 at dispatch compile time — verify that is still true
before you start (`git log -1` on each `origin/main`), since staleness can end at any time and this
mission's whole premise is that neither repo is mid-flight:

- `smartcity-os` — source for `smartcity-api` and `smartcity-scraper` (GCP project `smartcity-os-prod`).
- `smartcity-dashboards` — its own repo, its own GCP project (`smartcity-dashboards`), its own Neon
  database. Does not import from or call into `smartcity-os`.

Fresh clone each from `origin` into your own worktree; register both under your seat; remove both
at close.

### What you are replacing, verified live at compile time (2026-09-17)

**smartcity-api** (`smartcity-os-prod`, `us-central1`, 1 vCPU / 1Gi, `minScale=1` / `maxScale=10`).
Serves `https://smartcityos.io` on a GoDaddy-hosted custom domain — nameservers
`ns55/ns56.domaincontrol.com`, apex A/AAAA records pointing at Google's custom-domain anycast IPs,
`www` a CNAME to `ghs.googlehosted.com`. Live request logs (2026-09-17) show real browser traffic
(hero images, JS bundles, an `/api/analytics/track` call) served from this SAME Cloud Run service —
it serves a built frontend bundle together with its API, not an API alone. Env vars: `DATABASE_URL`,
`ANTHROPIC_API_KEY`, `SAMSARA_API_TOKEN`, `FIRSTDUE_API_EMAIL`, `FIRSTDUE_API_PASSWORD`,
`OPENGOV_API_KEY`, `MYGOV_BASE_URL`, `RESEND_API_KEY`, `PIPEDRIVE_API_TOKEN`,
`OPENGOV_BNP_API_KEY`, `CALENDAR_API_KEY`, `PLATFORM_INTERNAL_API_KEY`. No internal caller found in
any of six other services' live env vars — but that was checked against six services, not against
every repo's source or any Vercel-hosted frontend; verify with your own log read before assuming.

**smartcity-scraper** (`smartcity-os-prod`, `us-central1`, image tag `wo-chunking-...`). Env vars:
`DATABASE_URL` (same Neon project as smartcity-api), `MYGOV_USERNAME`, `MYGOV_PASSWORD`,
`MYGOV_BASE_URL`, `NODE_ENV`. Zero Cloud Scheduler jobs exist in `smartcity-os-prod` (checked
2026-09-16) — find its actual trigger mechanism (manual, another service calling it, an external
cron) before assuming how it starts. Do not guess; read the source or the request logs.

**smartcity-dashboards** (`smartcity-dashboards` project, `us-east1`, 1 vCPU / 512Mi,
`maxScale=3`). Own Neon database (project `rapid-cake-58559543`, not shared with smartcity-os).
Calls OUT to `hauska-retrieval-api` (`HAUSKA_RETRIEVAL_URL`) and `hauska-mcp-server`
(`HAUSKA_MCP_URL`), plus `smart-files` — all three stay pointed at their current GCP addresses,
unchanged, for this mission. Its own inbound caller: `hauska-mcp-server`'s `DASHBOARDS_BACKEND_URL`
env var, authenticated with `DASHBOARDS_API_KEY` — this is the one env-var flip this mission makes
on a service outside the two repos above (`hauska-mcp-server` is its own repo, confirmed idle since
2026-09-16, not touched by either active lane claim).

### What to build

1. Stand up `smartcity-api` and `smartcity-scraper` on DigitalOcean (App Platform recommended for
   `smartcity-api` specifically, since it serves a combined frontend+API bundle and App Platform
   handles custom-domain TLS the way Cloud Run's domain mapping already does; a Droplet is fine for
   `smartcity-scraper`, which has no public traffic).
2. Stand up `smartcity-dashboards` on DigitalOcean the same way (App Platform, matching its current
   Cloud Run shape).
3. Replicate each service's secrets from live GCP Secret Manager values (`gcloud secrets versions
   access latest --secret=<name> --project=<project>`) — never paste a secret value into any file
   this lane commits.
4. Deploy each service from the exact commit currently deployed on GCP (read it from
   `gcloud run services describe ... --format="value(spec.template.spec.containers[0].image)"`
   before you branch).
5. Smoke-test each DO deployment directly against its own address: for smartcity-dashboards and
   smartcity-scraper, confirm boot, database connectivity, and at least one real request per exposed
   endpoint matches the GCP original field-for-field. For smartcity-api, do the same AND confirm the
   served frontend bundle (assets, `/api/analytics/track`) behaves identically before touching DNS.
6. Cut over smartcity-dashboards first: once its DO deployment is validated, update
   `hauska-mcp-server`'s `DASHBOARDS_BACKEND_URL` to the new address and redeploy just that service
   (a config-only redeploy). Watch error rate for a bake window before calling this row's
   dashboards leg done.
7. Cut over smartcity-scraper next, by whatever mechanism actually triggers it (found in step on
   its trigger above) — repoint that trigger, not a guess at one.
8. Cut over smartcity-api last, and only after the other two are proven: lower the GoDaddy TTL on
   `smartcityos.io`'s apex A/AAAA records and the `www` CNAME a day ahead of the actual switch, add
   the custom domain in DO App Platform, verify DO issues a valid cert, then update the GoDaddy
   records to DO's provided targets. Watch both origins' logs during propagation. Keep the Cloud Run
   original running, unmodified, through a bake period before decommission — revert the GoDaddy
   records if anything regresses.

### Falsifiers, pre-register your answers first

1. Each DO deployment serves identical responses to its GCP original on real data, for every
   endpoint tested.
2. Every secret resolves on the DO side with no fallback, default, or empty-string substitution.
3. `smartcity-dashboards`'s calls to `hauska-retrieval-api`, `hauska-mcp-server`, and `smart-files`
   still work unchanged after its own move to DO — those three URLs are not touched by this mission.
4. After the `smartcityos.io` DNS cutover, the GCP `smartcity-api` original is still running,
   unmodified, reachable at its `*.run.app` URL, and receiving no real traffic (only the uptime
   checker) — confirmed by its own request logs, not assumed from the DNS change alone.
5. `smartcity-os` and `smartcity-dashboards` remain unmerged-into by any other lane during this
   mission — re-check `git log -1` on both repos' `origin/main` immediately before your DNS cutover
   step; if either has moved, stop and report before proceeding.

### Do not

- Touch `hauska-engine`, `hauska-factory`, `hauska-map`, or any service or database they own.
- Cut the `smartcityos.io` DNS over before smartcity-dashboards and smartcity-scraper are both
  proven and cut over.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; files touched; each DO deployment's address; the validation table per service (count
tested, matched, diverged); the five falsifiers with evidence; confirmation of what did and did not
get DNS-cut-over and what remains a bake-period watch item. `status`: `closed-partial` until the
`smartcityos.io` bake period reads clean and the GCP original is formally decommissioned in a
follow-up. `probe`: the validation artifact path. `subAgents`. `leave_behind`: name every DO
resource created and its current traffic state (live, bake-period parallel, or not-yet-cut-over) so
the next session does not stand up a duplicate or make a wrong assumption about what is serving
production.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-17_do-migration-smartcity-fresh_cp1.json
  CP2: _inbox/2026-09-17_do-migration-smartcity-fresh_cp2.json
  CLOSE: _inbox/2026-09-17_do-migration-smartcity-fresh_close.json
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
    "lane": "do-migration-smartcity-fresh",
    "planRows": ["D-5"],
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
