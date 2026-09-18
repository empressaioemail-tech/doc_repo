---
id: 2026-09-18_gcp_estate_EVIDENCE
title: GCP estate, measured, for the full exit to DigitalOcean
date: 2026-09-18
last_updated: 2026-09-18
status: evidence (point in time; re-run the instruments before relying on any figure)
kind: evidence
owner: nick
maintained_by: integration seat
programs: [OPS-25]
related:
  - _inbox/2026-09-18_gcp_full_exit_PLAN.md (the plan this evidence supports)
  - _decisions/2026-09-18_gcp_full_exit_rulings.md
  - scripts/infra/gcp-exit/README.md (the instruments; every figure below names one)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md
snapshot: GCP read live 2026-09-18 10:45Z to 11:59Z as empressaioemail@gmail.com; DigitalOcean read 11:10Z and 11:58Z with the fleet Apps/Droplets token; org repos shallow-cloned at their main 2026-09-18 ~11:25Z (hauska-engine 72d72c0, legacy-design-tools 25d1782, hauska-factory 85d63e8, hauska-mcp-server 10451ee, hauska-map cfe2319, smartcity-dashboards fd8562c, smartcity-os 92c73e3, plan-review 99c156b, smart-files 6d71bf3, smart-markets 7d0bfc6, empressa-trading 1eaeb65, hauska-brief-extension 526f5f2, legacy-revit-sensor 541bf33); doc_repo main e9a9064a
---

# GCP estate, measured

This is what the exit has to move, measured on 2026-09-18, with the instrument that produced each
figure. It is a snapshot. Every number here goes stale, and the factory estate changed during the
read itself: a 43rd job appeared between 10:45Z and 11:30Z. Re-run the instrument before quoting.

## 1. What exists

Instrument: `inventory.mjs`. Nine projects answer `gcloud projects list`. `smart-markets-118998`
is not in the console's recent list. `atx-bulls` holds one bucket and is out of scope.

| Project | Workloads | Other |
|---|---|---|
| hauska-prod-497015 | Cloud Run services `hauska-engine-api`, `hauska-retrieval-api`, `hauska-mcp-server` (all us-central1), `factory-control` (us-east4); 43 Cloud Run Jobs (us-east4); 2 Scheduler jobs | 6 buckets, 3 Artifact Registry repos, 40 secrets, 6 alert policies, 3 uptime checks, 3 log-based metrics |
| legacy-design-tools-prod | `cortex-api`, `smartsite-mcp`, `records-request-worker` (us-central1); job `pe-overpass-tip-smoke`; VM `overpass-tx-01`; VPC connector `cortex-connector`; 1 Scheduler job | domain mapping `mcp.smartsite.cloud`; Workload Identity pool `github-actions`; 6 buckets; 60 secrets |
| smartcity-os-prod | `smartcity-api`, `smartcity-scraper` (rollback originals); 10 Scheduler jobs that now call the DO scraper droplet | stale domain mappings `smartcityos.io`, `www`; 48 secrets; **the uptime check and alert for `cortex-api`** |
| smartcity-dashboards | `smartcity-dashboards` (rollback original) | 30 secrets |
| plan-review-505715 | `plan-review` | 4 secrets |
| smart-files-505619 | `smart-files` | 3 secrets |
| smart-markets-118998 | `smart-markets-api` | 4 secrets |
| empressa-trading-prod | VM `empressa-bot` (static IP `35.245.249.243`, which `api.empressa.pro` resolves to); Cloud SQL `cockpit-pg` | 2 buckets; IAP enabled; 1 uptime check |

No project enables Vertex, Gemini, Vision, Document AI, Maps, BigQuery workloads, Pub/Sub topics,
Cloud Functions, Firestore or Cloud Tasks. Asset Inventory does not index Scheduler jobs, so
`inventory.mjs` reads them directly (ten known jobs were missing from the asset search).

## 2. Where the money goes

Instrument: `cost-by-revision.mjs`, which is derived rather than billed. It takes billable
instance-seconds per revision and multiplies them by that revision's own CPU, memory and billing
mode, priced at live Billing Catalog SKUs. No billing export exists, so no bill line was read.

**F-1. About 96 percent of Cloud Run service spend is revisions that serve 0 percent of traffic.**
Every tagged revision of a service with minimum instances keeps a warm instance for as long as the
tag exists.

| Service | 30-day derived cost | Of which 0%-traffic revisions |
|---|---|---|
| cortex-api | $1,043 | $1,040 |
| hauska-engine-api | $874 | $872 |
| smartcity-api | $227 | $219 |
| smartsite-mcp | $193 | $189 |
| hauska-mcp-server | $109 | $108 |
| smartcity-scraper | $73 | $0 |
| hauska-retrieval-api | $61 | $60 |
| **Total, 30 days** | **about $2,580** | **about $2,490** |

The last 7 days come to about $891, a run rate near $3,800 a month, which matches the $3,000 to
$4,000 run rate OPS-25 projected from the bill. `smartsite-mcp` carries 33 tags and averaged
30.5 warm instances while serving about 256 requests a day.

The mechanism was confirmed by a natural experiment. The P-251 lane removed 37
`hauska-engine-api` tags at about 16:53Z on 2026-09-16. Revisions `00154` to `00159` billed
exactly 125 of 168 hours in a window ending 2026-09-18 11:25Z, which puts their billing stop about
42.5 hours before the window closed, at the moment the tags came off.

The second mechanism considered was a metric double count. It was rejected because the hours sit
on individual revisions at exactly one full week each, and because the ported script, re-pricing
from live SKUs, reproduced the scratch figure to the dollar.

Other lines, from Billing Catalog list prices:

| Item | Monthly cost |
|---|---|
| Cloud Run Jobs (instrument `jobs-cost.mjs`) | about $73 per 30 days, of which `factory-publish-gate-sched` is $44. This is a lower bound: 9 jobs deleted during the window (4.4 hours) are left unpriced rather than guessed |
| `overpass-tx-01` (e2-standard-8, us-central1) | about $196, before a 30 GB boot disk and 200 GB data disk |
| `empressa-bot` (e2-standard-4, us-east4) | about $110, before an 80 GB disk and the static IP |
| `cockpit-pg` (db-custom-2-8192, zonal, us-east4) | about $108, before storage and PITR logs |

**F-2. A cleaned-up GCP would cost about $850 to $950 a month.** That means one warm instance per
always-on service, plus the VMs, Cloud SQL and the jobs. The DigitalOcean target in the plan (§6)
falls in the same range, so most of the money is saved by fixing F-1, which either cloud can do.

## 3. What each workload actually uses

Instruments: `service-metrics.mjs` (30 days), and Compute and Cloud SQL metrics (30 days).
Instance counts are inflated by F-1.

| Service | Requests, 30 days (2xx / 4xx / 5xx) | CPU p99, hourly max | Memory p99, hourly max | Egress, 30 days |
|---|---|---|---|---|
| hauska-retrieval-api | 364,635 / 508 / 1,927 | 0.81 of 1 vCPU | 0.34 of 1 GiB | 21.5 GiB |
| cortex-api | 248,447 / 18,506 / 1,730 | 0.51 of 2 vCPU | 0.15 of 8 GiB | 82.4 GiB |
| hauska-engine-api | 134,597 / 4,323 / 7 | 0.89 of 2 vCPU | 0.50 of 4 GiB | 52.8 GiB |
| smartcity-api | 104,878 / 3,904 / 518 | 0.66 of 1 vCPU | **0.85 of 1 GiB** | 4.1 GiB |
| hauska-mcp-server | 25,514 / 44 / 3,979 | 0.29 of 1 vCPU | 0.30 of 512 MiB | 0.9 GiB |
| smart-files | 9,535 / 477 / 0 | 0.14 | 0.26 | 0.02 GiB |
| plan-review | 8,684 / 52 / 32 | 0.16 | 0.25 | 0.04 GiB |
| smartcity-dashboards (GCP) | 6,029 / 288 / 2 | 0.17 | 0.29 | 0.4 GiB |
| smartsite-mcp | 3,590 / 2,007 / 0 | 0.47 | 0.31 of 512 MiB | 0.07 GiB |
| smartcity-scraper (GCP) | 2,286 / 4 / 314 | 0.36 of 2 vCPU | 0.62 of 4 GiB | 19.6 GiB |
| factory-control | 320 / 147 / 1 | 0.13 | 0.20 | 0 |
| records-request-worker | 34 / 30 / 13 | 0.39 of 2 vCPU | 0.14 of 4 GiB | 0.01 GiB |
| smart-markets-api | 33 / 0 / 15 (zero in the last 7 days) | 0.16 | 0.21 | 0 |

**F-3. The VMs and the database are heavily oversized.**

- **`overpass-tx-01`:** mean CPU 0.3 percent, peak 0.8 percent of 8 vCPU.
- **`empressa-bot`:** mean CPU 5 percent of 4 vCPU.
- **`cockpit-pg`:** 8 percent CPU, memory about 50 percent of 8 GB, 19 to 21 GB of data, 26 to 31 connections.

No memory agent runs on either VM, so their memory use is unmeasured.

**F-4. `walrus-app` (the SmartCity v1 on DO) runs on a 1 GiB instance.** The same service's
p99 memory on GCP reached 0.85 of 1 GiB.

**Databases.** Instrument: `secret-hosts.mjs`. Every store is Neon on AWS **us-east-1**, except
the SmartCity v1 database on **us-east-2**. Cloud Run today runs in us-central1 (Iowa).

## 4. Who calls what

Instruments: live service config, `secret-hosts.mjs`, `code-refs.mjs`, and `callers.mjs` (7 days).

**F-5. `hauska-retrieval-api` has far more callers than D-3's dispatch lists.** The dispatch states
that no service among `hauska-mcp-server`, `cortex-api` and `smartcity-dashboards` references it
in live env vars. Read live:

- **Env vars:** `hauska-mcp-server` (`HAUSKA_BACKEND_URL`), `hauska-engine-api` (`RETRIEVAL_API_URL`), and `smartcity-dashboards` on GCP and on DO (`HAUSKA_RETRIEVAL_URL`).
- **A secret:** `cortex-api` (`BRIEF_RETRIEVAL_API_URL`).
- **Hardcoded in code:** four `legacy-design-tools` api-server files (`fetchPropertyAtomChain.ts`, `spineZoningDistrict.ts`, `parcelRecordReaderClient.ts`, `placeCoverageSource.ts`) and three `hauska-map` files (`api/spine.ts`, `apps/property-explorer/api/spine.ts`, `pe-property-atoms.ts`).

The dispatch's own stop-and-report clause would probably have caught this, but it has to be
recompiled.

**F-6. The call graph has loops, so strict leaf-to-root ordering (OPS-25 rule 2) cannot hold.**
`hauska-engine-api` and `cortex-api` call each other (`BROKERAGE_API_BASE_URL`, `ENGINE_API_URL`).
`hauska-mcp-server` and `plan-review` also call each other.

Edges read from live env and secrets:

```
hauska-mcp-server -> retrieval, engine, cortex, smart-files, plan-review, dolphin-app (DO)
smartsite-mcp     -> cortex, hauska-mcp-server, engine
cortex-api        -> engine, retrieval (secret + 4 code files), plan-review,
                     records-request-worker, overpass 10.128.0.2 (VPC connector)
engine-api        -> retrieval, cortex
records-worker    -> cortex (vision-read, notify)
plan-review       -> smart-files, hauska-mcp-server (and a hardcoded default in src/mcp.mjs)
dashboards        -> retrieval, hauska-mcp-server, smart-files, GCP smartcity-api (D-13)
walrus-app (DO)   -> GCP smartcity-scraper (hardcoded SCRAPER_SERVICE_URL, mygov.ts:524)
smart-markets-api -> smart-files (secret), api.empressa.pro (secret)
retrieval-api, smart-files -> their databases only (leaves)
```

**F-7. Callers outside GCP that a GCP-side read cannot see.**

- **Vercel functions.** Property Explorer and Command Center (`hauska-map`) call `cortex-api`, `hauska-engine-api` (18,030 map-layer assembles in 7 days from about 600 Vercel IPs), `hauska-retrieval-api` and `hauska-mcp-server`. `plan-review-app` and `icc-portal-app` call `plan-review`. A QA UI polls `smart-files`, and `smart-markets-app` rewrites to `smart-markets-api` in `vercel.json`.
- **Claude connectors.** `smartsite-mcp` takes 1,283 `Claude-User` requests in 7 days through `mcp.smartsite.cloud`.
- **Stripe.** Stripe posts webhooks to `cortex-api` `/api/brokerage/v1/billing` (12 in 30 days, the last on 2026-09-16).
- **Clients customers install.** `hauska-brief-extension` 0.6.33 hardcodes the `cortex-api` and `hauska-mcp-server` `run.app` hosts in its bundles. Its `https://*/*` host permission means a new hostname needs no manifest change, but it does need a Chrome Web Store release. `legacy-revit-sensor` `Settings.cs` hardcodes the `cortex-api` `run.app` host.
- **Samsara.** A comment in `smartcity-os` names a GCP webhook URL, but no webhook traffic appears in 30 days of logs. The registration itself is unread.
- **Stale DNS.** Since 06:00Z, GCP `smartcity-api` has still taken a few requests on `smartcityos.io` and `www`, a day after DNS moved to DO. Clients with stale resolvers reach the GCP domain mapping.

**F-8. D-13 names two dashboards files, and the hardcoded GCP `smartcity-api` host appears in five.**

- Named by D-13: `vendor-live.mjs`, `mygov-live.mjs`.
- Also default to it: `mygov-permits.mjs` and `property-map.mjs` (the property-intel summary and layers).
- `adapters.mjs` shows the host to users as the `sourceUrl` of each feed.

The walrus-app side has the same shape: `smartcity-os` `server/routes/mygov.ts` hardcodes the GCP scraper URL (F-6).

## 5. Behaviour that constrains the DigitalOcean shape

**F-9. Some synchronous requests run longer than 100 seconds.** Instrument: `long-requests.mjs`,
over 7 days. DigitalOcean App Platform reportedly cuts HTTP at 100 seconds at its edge. The
requests over 90 seconds in the last 7 days:

| Service | Route | Duration | Status | Caller |
|---|---|---|---|---|
| hauska-engine-api | feasibility-export refresh | up to 154s | 201 | `node` |
| hauska-engine-api | flood-drainage refresh | up to 191s | 201 | `node` and `curl` |
| hauska-engine-api | site-plan-export refresh | up to 116s | 201 | `hauska-mcp-server` |
| cortex-api | street-search | up to 300s | 504 timeouts | |
| hauska-retrieval-api | `/stats` | 120s | 502 | |
| smartcity-api | `/api/ai/proactive-insight` | 3600s | 504 | |

Over 30 days, `hauska-retrieval-api`'s near-bbox and atom-chain routes ran thousands of requests
past 100 seconds, with 504s at 300 seconds, but none after 2026-09-06. Both MCP servers show no
long-held requests.

**F-10. The factory's control plane is built on the Cloud Run Jobs API.**

- `src/control/cloudrun-jobs.mjs` launches and tracks executions through the Cloud Run v2 API.
- `runs.mjs` and `heavy-lease.mjs` key run identity and leases to `CLOUD_RUN_JOB` and `CLOUD_RUN_EXECUTION`.
- 16 `cloudbuild*.yaml` files define the jobs.
- `secret-rotation.mjs` writes rotated Neon URLs into Secret Manager, which the publish job reads back at `:latest`.
- No job shards across tasks: every job is one task, with timeouts up to 24 hours and sizes up to 4 vCPU and 16 GiB.
- `factory-conformant` runs every 10 minutes. `factory-publish-gate-sched` runs hourly.

**F-11. Code-level GCP coupling.** Instrument: `code-refs.mjs`.

- **GCS clients:**
  - `hauska-engine` (doc-ingest and terrain stores);
  - `hauska-mcp-server` (`gcs-writer.ts` into `mcp-logs`);
  - `legacy-design-tools` (`objectAcl.ts`, `objectStorage.ts`, the cad-ingest download and CLI, and permit adapters that read `gs://hauska-calibration-raw`, a URI also written into `permitRecord`'s schema and migration 0055);
  - `empressa-trading` (`sec_documents_sync.py` into `gs://empressa-sec`).
- **Secret Manager API:** `hauska-factory`.
- **Cloud Run runtime variables:** `hauska-factory`, `hauska-engine`, `legacy-design-tools` (`smartsite-mcp` `health.ts`, `objectStorage.ts`).
- **Stored `gs://` URIs** in databases need a recorded rewrite at the storage cut.

**F-12. Deploy paths into GCP.** Each one is replaced and then retired:
- `legacy-design-tools`: `cloud-run-deploy.yml` builds on push and deploys by manual dispatch; `cloud-run-deploy-smartsite-mcp.yml`; and `neon-pooler-canary.yml`, which reads a Secret Manager value. All authenticate with Workload Identity.
- **Cloud Build files:** `hauska-engine` (6), `hauska-factory` (16), `hauska-mcp-server` (1), `smartcity-os` (2), `legacy-design-tools` (3).
- `hauska-map` `property-explorer-sync-retrieval-key.yml` copies a key from Secret Manager into Vercel, using a service-account JSON key (`hauska-pe-key-sync`).
- `smart-markets` `deploy.yml`; `empressa-trading` `sec-bulk-sync.yml` and `deploy-cockpit-api-gcp.ps1`.

**F-13. Monitoring that has to be rebuilt before anything is deleted.**
- **Uptime checks:** `hauska-mcp-server` `/healthz`, `hauska-retrieval-api` `/healthz` and `/health/search`, `cortex-api` `/api/health/ready`, `smartcity-api` `/api/health`, and `api.empressa.pro`.
- **Alert policies:** 9, on uptime, error rate and latency, plus the "stale-revision traffic drift" alert.
- **Log-based metrics:** 3 MCP metrics, built from structured logs.
- **`cortex-api`'s monitoring lives in `smartcity-os-prod`.** Deleting that project silently removes it.
- **The `api.empressa.pro` uptime check probes the literal path `/C:/Program Files/Git/health`.** This is the recorded Git Bash path-mangling trap: the check was created from Git Bash. It has been measuring nothing, and so has the alert built on it.

**F-14. Credentials and identity outside the nine projects.**
- **User-managed service-account keys:**
  - `hauska-pe-key-sync@hauska-prod-497015` (two keys, held as `GCP_SA_KEY_HAUSKA_PROD` in `hauska-map`'s GitHub secrets);
  - `smartcity-agent@smartcity-os-prod` (one key, created 2026-04-12; **its holder is unknown**).
- **The SmartCity Google sign-in client (`smartcity-GOOGLE_CLIENT_ID`) belongs to GCP project number `1160337742`.** That is not one of the nine projects, and this account cannot see it. Deleting our projects does not break sign-in, and our exit cannot reach it.
- **Firewalls:** both VMs allow SSH and RDP from `0.0.0.0/0` under GCP's default rules. Overpass port 8080 is limited to the connector range.

**F-15. Storage.** Instrument: bucket metrics and IAM.
- **About 13 GiB of real data:**
  - `hauska-map-tiles`: 4.3 GiB, **public**, 82,851 API requests in 30 days, CORS on. Read by the Property Explorer config, the extension bundles and the `smartsite-mcp` app from `storage.googleapis.com/hauska-map-tiles`.
  - `terrain-exports`: 1.7 GiB.
  - `hauska-calibration-raw`: 1.6 GiB.
  - `empressa-sec`: 1.6 GiB.
  - `cad-ingest-drops`: 1.1 GiB.
  - `legacy-design-tools-prod-objects`: 0.2 GiB.
  - `mcp-logs`: 3,778 small objects.
  - Also: `doc-ingest-blobs`, `cortex-api-objects-prod` (empty) and `empressa-trading-backups` (Nearline).
- **About 26 GiB of Cloud Build and source-upload buckets** that do not migrate.

## 6. The DigitalOcean side

Instruments: `do-read.mjs`, and the DigitalOcean documentation read on 2026-09-18.

**F-16. Estate.**
- **Apps:** four. Production: `walrus-app` (`smartcityos.io`, builds from side branch `d9-api-8bea7fa`, so D-14 applies) and `dolphin-app` (`app.smartcityos.io`, main). Leftovers: `d12-main-uat` (professional tier) and `d5-capability-probe`.
- **Droplets:** three. Production: `d5-smartcity-scraper` (nyc3). Leftovers: `d5-smartcity-dashboards` (nyc3) and `d5-smartcity-api` (**sfo3**).
- **VPCs:** three defaults (nyc1, nyc3, sfo3).
- **No app has a health check, a VPC, autoscaling or a dedicated egress IP.**

**F-17. Token scope.** The fleet token reads apps, droplets, VPCs, regions, sizes and snapshots. It
is refused (403) on account, projects, monitoring, uptime, databases, registry, reserved IPs,
firewalls, load balancers, domains, certificates, volumes, CDN, Spaces keys, Kubernetes and
billing.

**F-18. Platform facts that shape the design.**

- **The 100-second edge timeout** is community-reported for all apps. DigitalOcean documents the 100-second ceiling only for PHP apps. Unverified for our workloads until the D-17 probe.
- **VPC reach is limited to one datacenter.** A `nyc` app attaches only to `nyc1` VPCs, but the scraper and the D-5 droplets are in `nyc3`.
- **VPC access and dedicated egress IPs cannot be combined** on one app. A dedicated egress IP is two static IPs per app, and a paid feature.
- **Internal routing** is `http://component:port` inside one app. Whether internal traffic avoids the edge, and whether apps can reach each other privately, is undocumented.
- **Scheduled jobs:** at least 15 minutes apart. No API triggers a job on demand; list, get, cancel and logs only.
- **No secrets manager**, only encrypted per-app environment variables.
- **App alerts** cover CPU, RAM, restarts, request rate, p95 duration, and deploy, domain and scale events, by email or Slack. **There is no HTTP error-rate alert.**
- **Uptime checks** cover HTTP(S) and ICMP, latency and SSL expiry, by email or Slack.
- **DOKS:** free control plane (HA is $40 a month), worker nodes billed per second at Droplet prices, node pools that scale to zero.
- **Spaces:** $5 a month for 250 GiB and 1 TiB of transfer, CDN included. A custom CDN hostname gets an automatic certificate only on DigitalOcean DNS; otherwise the certificate is uploaded by hand.
- **Managed Postgres** starts at $15 a month; the size needed is unverified.
- **App Platform prices** (from the API):

| Size | Price per month |
|---|---|
| shared 1 vCPU / 1 GiB | $12 |
| shared 1 vCPU / 2 GiB | $25 |
| shared 2 vCPU / 4 GiB | $50 |
| dedicated 1 vCPU / 2 GiB | $39 |
| dedicated 2 vCPU / 4 GiB | $78 |
| dedicated 2 vCPU / 8 GiB | $98 |

Autoscaling requires a dedicated size.

## 7. DNS

Instrument: `dns.mjs`.

| Domain | Where its DNS is hosted | Records that matter |
|---|---|---|
| `smartcityos.io`, `smartsite.cloud`, `hauska.dev`, `empressa.io`, `empressa.pro` | GoDaddy (`domaincontrol.com`) | `mcp.smartsite.cloud` points at GCP (`ghs.googlehosted.com`); `api.empressa.pro` points at the trading VM's static IP; `mcp.hauska.dev`, `api.hauska.dev` and `pay.hauska.dev` do not exist (NXDOMAIN) |
| `hauska.io` | Cloudflare | none |

`cortex.empressa.io` does not resolve, yet 22 source files cite it. All of them use it only as a
User-Agent contact string sent to third parties.

## 8. Blind spots, stated

- **Vercel production environment values were not read.** The CLI's stored credential expired on 2026-07-04 and the instrument did not work around how the CLI refreshes it. Code defaults are mapped (F-7). The Vercel side of every caller repoint is graded by `callers.mjs` host counts instead.
- **Third-party dashboards were not read:** the Stripe and Samsara webhook registrations, broker IP allowlists for the trading bot, and who holds the `smartcity-agent` key.
- **Not measured:** DigitalOcean account limits (droplet limit, billing), Artifact Registry sizes, memory and disk use on the VMs, and whether `smart-markets-api` is live as a product.
- **Egress reachability** from DigitalOcean to every third-party host the services and factory call (OPS-25 rule 7) is untested, beyond what walrus-app already exercises.
