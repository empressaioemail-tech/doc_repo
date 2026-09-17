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
