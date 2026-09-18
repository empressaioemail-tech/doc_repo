# GCP exit instruments (OPS-25)

These are read-only instruments for the GCP-to-DigitalOcean exit. Every figure in
`_inbox/2026-09-18_gcp_estate_EVIDENCE.md` came from one of them. Every OPS-25 row grades its bake
or decommission with one of them, never with a shell one-liner (ENFORCEMENT: the instrument that
produced a claim is part of the claim).

On the fleet host, run them with `node --use-system-ca` because of the TLS-intercepting
middleware. Raw output goes to `$GCP_EXIT_OUT`, which defaults to `<tmp>/gcp-exit`.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Measured, and every self-test passed. |
| 2 | A self-test failed. Do not trust the output. |
| 3 | Inconclusive. No positive control was supplied or available, so a quiet result cannot be told apart from a blind query. **A 3 is never a pass.** |

Every self-test was run against a known violation on 2026-09-18 and failed as designed.

## The instruments

**`inventory.mjs`** answers what exists in each project. It uses Asset Inventory reduced to workloads, plus Cloud Scheduler read directly, because Asset Inventory does not index Scheduler.
- Self-test: a known service, a known VM and a known Scheduler job are present, and a nonexistent name is absent.

**`service-metrics.mjs`** gives requests, latency, instances, CPU, memory, billable hours and egress per service. It is the bake baseline and the input for DO sizing.
- Self-test: a service with an uptime check has requests, and a nonexistent service returns no series.

**`cost-by-revision.mjs`** gives derived cost per service, split between the serving revision and 0%-traffic revisions (the canary-tag leak). Prices are read live from the Billing Catalog.
- Self-test: every billed revision has a readable spec, and the total is nonzero.

**`jobs-cost.mjs`** gives job configuration and derived cost per Cloud Run Job. It is the DOKS sizing input for D-31.
- Deleted jobs are listed with their hours and left unpriced, and the total is then marked a lower bound.
- Self-test: at least one defined job is billed.

**`long-requests.mjs`** lists requests over N seconds by service and route. It is D-27's gate for the App Platform 100s edge.
- Self-test: a positive-control service (`CONTROL_SERVICE`) shows long requests. Without one the run exits 3.

**`callers.mjs`** shows who calls a service, on which hostname, with which user agent. It is the readiness gate for hostname-first and for every decommission.
- Self-test: a positive-control caller (`CONTROL=service:ua`) is seen. Without one the run exits 3.

**`secret-hosts.mjs`** reads the call-graph edges and database hosts that live in Secret Manager. It prints hostnames only.
- Self-test: postgres hosts parse, and a plain env var is not treated as a secret.

**`code-refs.mjs <clones-dir>`** finds GCP coupling in source: `run.app` hosts, GCS paths, GCP libraries, runtime variables and deploy paths. It is D-35's "none remain" gate.
- Self-test: a reference planted in a throwaway control repo is found and classed as code, and an impossible pattern finds nothing.

**`dns.mjs host...`** shows where each hostname points, via Cloudflare DNS-over-HTTPS.
- Self-test: `app.smartcityos.io` points at `dolphin-app`, and a nonsense name is NXDOMAIN.

**`do-read.mjs`** reports the DigitalOcean token's scope, the apps (with the commit each is running) and the droplets. It sends GET requests only.
- Self-test: apps are readable, and a nonexistent endpoint is not a 200.

## Rules the instruments encode

- **`gcloud` runs through a shell, so metacharacters are refused.** Any argument containing shell metacharacters is refused. Filters go through the REST APIs instead, because a shell-joined filter silently lost its quoting on 2026-09-18.
- **Carriage returns are stripped from all `gcloud` output.** A carriage return carried out of `$(gcloud ...)` under Git Bash emptied a service-account key listing that same day.
- **Secret values are never printed or written.** `secret-hosts.mjs` reduces every value to `scheme://host[:port]`.
- **Latency maxima from `service-metrics.mjs` are bucket bounds.** The "max p99" figures fall on histogram bucket edges, which is why different services can show identical maxima. Use `long-requests.mjs` for actual durations.
- **Instance counts include 0%-traffic tagged revisions.** Read `cost-by-revision.mjs` before treating an instance count as load.
