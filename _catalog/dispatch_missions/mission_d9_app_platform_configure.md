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
