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
