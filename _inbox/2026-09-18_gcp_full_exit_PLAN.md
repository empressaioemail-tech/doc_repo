---
id: 2026-09-18_gcp_full_exit_PLAN
title: GCP full exit to DigitalOcean, the plan
date: 2026-09-18
last_updated: 2026-09-18
status: proposed (operator review); rows carded in OPS-25 under A-8 on approval
kind: program plan
owner: nick
maintained_by: integration seat
programs: [OPS-25]
related:
  - _decisions/2026-09-18_gcp_full_exit_rulings.md (the five rulings this plan executes)
  - _inbox/2026-09-18_gcp_estate_EVIDENCE.md (every F-n cited below)
  - _inbox/2026-09-18_gcp_exit_TEXAS_COORDINATION.md (what this plan needs from the Texas scale-up planner)
  - scripts/infra/gcp-exit/README.md (the instruments every gate below names)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md (the plan of record; rows D-15 to D-35)
snapshot: estate measured 2026-09-18 10:45Z to 11:59Z (see the evidence file); doc_repo main e9a9064a
---

# GCP full exit to DigitalOcean

## 1. What done means

Every in-scope GCP project is shut down: all nine except `atx-bulls`, which stays on the billing
account and so keeps that account open. Nothing the exit leaves behind is silent. Done is graded
by instruments, not reports:

1. **Every workload is on DigitalOcean.** Each cutover has baked clean against its captured baseline, with error rate and latency no worse, and the GCP original has taken zero non-uptime requests on every hostname it answers through a window in which its callers were exercised (`callers.mjs`, rule 16).
2. **Nothing in source still points at GCP.** `code-refs.mjs` finds zero GCP hosts, libraries, runtime variables or deploy paths in code, config or deploy files across every active repo. A CI guard in each repo fails if one reappears.
3. **The bill agrees.** The GCP billing export shows zero cost for the eight projects for one full calendar month, and each project is deleted.
4. **Monitoring is at parity.** Every GCP uptime check, alert policy and log metric has a DigitalOcean or log-destination replacement, and each replacement has been proven by firing it once on purpose.
5. **No customer saw an outage.** No customer surface went dark during any cutover, and no customer had to reconfigure anything except where a client release was unavoidable (the extension and the Revit connector, D-26).

## 2. Three things the evidence changes

**Most of the money is a defect, not the platform.** About 96 percent of Cloud Run service spend
is idle canary revisions that serve 0 percent of traffic (F-1). A cleaned-up GCP costs roughly the
same as the DigitalOcean target (F-2 and §6). So the canary fix (D-19) is the largest single
saving on offer, and it is available now on either cloud. The exit still goes ahead as ruled; its
value is one provider, right-sized compute, lower latency to Neon, and the end of the canary-leak
failure class. This plan does not justify it with savings it will not produce.

**Hostname-first replaces leaf-to-root.** The call graph has loops, and every service has callers
that no env-var flip reaches: hardcoded code, Vercel functions, an installed Chrome extension, a
Revit add-in, and Stripe (F-5 to F-8). With a stable hostname in front of each service, every
cutover and every rollback becomes one DNS record, in any order.

**DigitalOcean's shape imposes four design constraints.**

- The App Platform edge reportedly cuts requests at 100 seconds, so long synchronous routes go (F-9, D-27).
- App Platform cannot trigger a job on demand, so the factory job plane goes to DOKS (F-10, F-18).
- There is no secrets manager, so secrets and config become code (D-21).
- A `nyc` app can reach only the `nyc1` VPC, and a VPC excludes a dedicated egress IP, so VPC and egress IP are chosen per app (rule 19).

## 3. Target architecture on DigitalOcean

**Region.** App Platform `nyc`; droplets, DOKS and the VPC in `nyc1`; Spaces in `nyc3`. Every
Neon store is on AWS us-east-1, except the SmartCity v1 store on us-east-2. D-17 measures the
database round trip from `nyc1` and from `ric1`. If `ric` is materially closer and hosts every
product used here, the region moves before the first substrate cutover, never after.

**Placement.** Sized from measured 30-day utilisation (evidence §3), not from Cloud Run settings.
Several of those settings were far above use (`cortex-api` sits at 1.2 of 8 GiB).

| Workload | DigitalOcean shape | Size and count | Hostname | Why |
|---|---|---|---|---|
| hauska-retrieval-api | App Platform service | dedicated 1 vCPU / 2 GiB, autoscale 1 to 3 | retrieval.hauska.dev | CPU p99 reaches 0.81 of 1 vCPU; 365k requests per 30 days; autoscaling needs a dedicated size |
| hauska-engine-api | App Platform service | dedicated 2 vCPU / 4 GiB, autoscale 1 to 3 | engine.hauska.dev | CPU p99 reaches 0.89 of 2 vCPU; Property Explorer map-assembly bursts |
| cortex-api | App Platform service, VPC-attached (reaches Overpass) | dedicated 2 vCPU / 4 GiB, autoscale 1 to 3 | api.smartsite.cloud | memory p99 at most 1.2 GiB; CPU p99 reaches 0.51 of 2 vCPU |
| records-request-worker | internal component of the cortex app, or an App Platform worker polling the records queue (decided by D-17 P2) | shared 1 vCPU / 2 GiB | none | rare (77 requests per 30 days) and long (up to 200 seconds) |
| hauska-mcp-server | App Platform service | shared 1 vCPU / 1 GiB, 2 instances | mcp.hauska.dev | light load; two instances because paying clients use it |
| smartsite-mcp | App Platform service | shared 1 vCPU / 1 GiB, 2 instances | mcp.smartsite.cloud (exists) | Claude connectors |
| smartcity-api (walrus-app) | App Platform service | shared 1 vCPU / 2 GiB, 2 instances | smartcityos.io (exists) | p99 memory reached 0.85 of the current 1 GiB (F-4) |
| smartcity-dashboards (dolphin-app) | App Platform service | as is | app.smartcityos.io (exists) | |
| smart-files | App Platform service | shared 1 vCPU / 1 GiB | files.smartcityos.io (proposed) | 60 requests a day |
| plan-review | App Platform service | shared 1 vCPU / 1 GiB | planreview.smartcityos.io (proposed) | a queue polled by its app |
| smart-markets-api | retire, or App Platform shared 1 vCPU / 0.5 GiB | | markets.empressa.pro if kept | zero requests in the last 7 days (D-33) |
| factory-control | DOKS Deployment | system pool | factory.hauska.dev | launches Jobs in-cluster with no external credential |
| 43 factory, engine and LDT jobs | DOKS Jobs and CronJobs on a jobs pool that scales 0 to N | 16 GiB nodes | none | on-demand launch, per-execution identity, 10-minute cron |
| Overpass | droplet, VPC-only | sized by D-24's import (CPU use today is 0.3 percent) | none | rebuilt from `infra/overpass`, not copied |
| smartcity scraper | existing droplet, plus Caddy TLS and local cron | s-2vcpu-4gb | scraper.smartcityos.io (proposed) | keeps a public IP the MyGov and Municode WAFs accept (rule 7) |
| trading bot | droplet with a Reserved IP | markets seat decides | api.empressa.pro (exists) | broker allowlists |
| cockpit-pg | DigitalOcean Managed Postgres in the bot's datacenter, or Neon | markets seat decides | | |
| buckets | Spaces nyc3 with the CDN | $5 a month base | tiles.smartsite.cloud (proposed) | about 13 GiB of real data |

The naming is proposed, not ratified, and it is flagged. The rule applied: Hauska substrate lives
under `hauska.dev` and product surfaces under their own domains. `cortex-api` gets
`api.smartsite.cloud` because Property Explorer is its dominant caller, although under ADR-008 it
is the reporting package, not a SmartSite product. The operator confirms or renames every
proposed name in D-16.

**Apps are separate per service, not grouped.** A separate app keeps per-service deploy, canary
and rollback, which rules 9 and 13 depend on. The exception, decided by D-17: if internal routing
between components of one app proves private, free of the edge timeout, and independent of other
components' deploys, then `hauska-engine-api` and `hauska-retrieval-api` (the hot path) may share
an app.

**Config and secrets are code (D-21).** Each repo carries its app spec and deploys it through a
GitHub Actions workflow run by hand (`workflow_dispatch`). The workflow fills secrets from GitHub
environment secrets, deploys, and fails if the running commit (`source_commit_hash`) is not the
intended one (rule 13). Deploy-on-push stays off. On DOKS, secrets are Kubernetes Secrets, and the
factory's staging rotation writes them in-cluster instead of to Secret Manager. A registry file
lists which repos hold each shared key, and a fingerprint check fails when the holders disagree.
That removes the key-drift class the fleet has hit repeatedly.

**Observability (D-22).** Detection has three parts:
- DigitalOcean Uptime checks on each functional health endpoint, which must return non-2xx whenever the service is functionally down, so a status-only check means something. The checks also alert on SSL expiry, which closes OPS-25 open item 4.
- App Platform alerts on CPU, RAM, restarts, p95 duration, and deploy, domain and scale failures.
- One log-forwarding destination that computes the error-rate and MCP latency alerts App Platform lacks (F-18).

## 4. Invariants every row obeys

- **One variable per cutover.** Compute moves are config-only. Code changes land beforehand as their own rows (D-25, D-27). Storage moves last (ruling 2).
- **The GCP original stays untouched through the bake** (rule 3), and rollback is one DNS record.
- **No synchronous request longer than 90 seconds on App Platform** (rule 15).
- **Decommission is graded by the host census** (rule 16), with a positive control, because a caller that fires only on a human action is invisible in a quiet window (D-13).
- **Every row that touches a Texas-program repo runs inside an agreed window** (rule 20).
- **Every created canary, UAT app, probe or tag is removed in the same row, or declared as its leave-behind** (rule 18).
- **Statuses re-grade only by instrument** (rule 5), using `scripts/infra/gcp-exit/`.

## 5. Sequence

```
PHASE 0  coordinate + prepare     D-15 Texas coordination   D-16 operator prereqs   D-17 platform probes
         (no production change)   D-18 baselines            D-19 canary-leak fix (cost, coordinate)
                                        |
PHASE 1  SmartCity finish         D-12 bake  D-13  D-14  ->  D-20 SmartCity decommission bundle
                                        |
PHASE 2  DO foundations           D-21 config-as-code + secrets   D-22 observability
         (no customer traffic)    D-23 DOKS job plane (staging parity)   D-24 Overpass droplet
                                        |
PHASE 3  hostnames first (GCP)    D-25 hostnames + every caller repointed   D-26 external clients
         (zero behaviour change)  D-27 no request over 90s
                                        |
PHASE 4  service cutovers         D-28 smart-files  D-29 plan-review  D-3 retrieval  D-4 engine
         (DNS flips, one at a     D-6 cortex (+worker, heartbeat, Overpass)  D-30 smartsite-mcp
          time, each baked)       D-7 hauska-mcp-server
                                        |
PHASE 5  job plane cutover        D-31 factory/engine/LDT jobs to DOKS in batches  (the factory freeze)
PHASE 6  markets (parallel)       D-32 trading bot + cockpit-pg   D-33 smart-markets retire-or-move
PHASE 7  storage final cut        D-34 GCS to Spaces
PHASE 8  shutdown                 D-35 retire every GCP path, delete projects, CI guards, bill at zero
```

Phases 0 to 2, and D-28 and D-29, touch no Texas-program runtime. They are the natural work before
the pause. Phases 3 to 5 need agreed windows (§8).

## 6. Cost, stated plainly

| | Per month |
|---|---|
| GCP today, derived from the last 7 days | about $3,800 of Cloud Run services, plus about $450 of VMs and SQL, plus about $73 of jobs |
| GCP with the canary leak fixed (D-19) | about $850 to $950 |
| DigitalOcean target, from the §3 sizes at API list prices | about $750 to $1,000, before Managed Postgres (from $15, size unverified) and the log destination |

The target breaks down as:
- **Apps:** about $480 to $600. Autoscaled services count at one to two instances.
- **Droplets:** about $96 to $116.
- **DOKS:** about $65 to $125, of which about $24 is the system pool.
- **Spaces:** $5.

Every figure here is derived. From D-16 onward, money is graded against bill lines on both sides.

## 7. The rows

Owner is the seat that executes. "Window" is the freeze class from §8. Every gate names its
instrument and a falsifier.

| Row | Title | Owner | Window | Depends | Gate (instrument) |
|---|---|---|---|---|---|
| D-15 | Coordinate with the Texas planner; agree windows and row ownership | integration, Texas planner, operator | none | none | a written agreement in `_inbox/` naming windows W1 to W4 and which rows move to OPS-16 |
| D-16 | Operator prerequisites | operator | none | none | a token scope matrix read by `do-read.mjs` showing the needed scopes as 200; the billing export dataset exists; names ratified |
| D-17 | Platform probes and a shape decision record | DO lane | none | D-16 token | nine probes, each with a stated falsifier (below) |
| D-18 | Baselines captured per service | integration | none | none | `service-metrics`, `callers`, `long-requests` and `cost-by-revision` outputs committed with a snapshot line |
| D-19 | Stop the canary-tag leak | property and substrate via the Texas planner | W1 | none | for every min-instances service, the serving revision carries at least 80 percent of billable time for 7 days (`cost-by-revision`); a stale tag left deliberately on staging is refused |
| D-20 | SmartCity decommission bundle | SmartCity lanes | none | D-12, D-13, D-14 | host census zero on every host through a bake in which a lens was opened; then both projects shut down |
| D-21 | Config and secrets as code on DigitalOcean | per repo | none, then W1 | D-16 | a deploy reads back `source_commit_hash` equal to the intended commit; a console edit is overwritten by the next deploy (violation test); the key-fingerprint drift check fails on a planted mismatch |
| D-22 | Observability parity | integration and seats | none | D-16 | every GCP check and alert mapped one to one; each replacement fired once on purpose |
| D-23 | DOKS job plane, staging parity | property via the Texas planner | none (staging only) | D-16, D-17 | the same job run on both planes against staging produces row-identical outputs; each run record carries the new execution identity |
| D-24 | Overpass droplet | property | none | D-16, D-17 | `smoke.sh` passes; a fixed bbox set returns identical ways from GCP and DigitalOcean; the port is unreachable from outside the VPC (violation probe) |
| D-25 | Stable hostnames and every caller repointed | per repo seats | W1 | D-16 names | `callers.mjs`: zero non-uptime requests on `*.run.app` for 7 days, with a per-caller positive control on the new host; `code-refs.mjs`: zero `run.app` hosts in code, config or deploy files |
| D-26 | External registrations and installed clients | operator and seats | none | D-25 | Stripe and Samsara send to the hostname; the extension and Revit releases ship; `callers.mjs` shows the old-version tail on `run.app` fall to zero, or to an operator-accepted residue |
| D-27 | No synchronous request over 90 seconds | property and SmartCity via the Texas planner | W1 | none | `long-requests.mjs OVER=90`: zero since deploy T, while the same query over the 7 days before T still shows the known routes (the positive control) |
| D-28 | smart-files to DigitalOcean | govtech | none | D-21, D-22, G-155 closed | bake against the D-18 baseline; host census zero |
| D-29 | plan-review to DigitalOcean | govtech | none | D-28, G-150 closed | same |
| D-3 | hauska-retrieval-api to DigitalOcean (recompiled) | property | W2 | D-21, D-22, D-25, D-27 | same, plus payload parity on a fixed request set (rule 11) |
| D-4 | hauska-engine-api to DigitalOcean | property | W2 | D-3 | same |
| D-6 | cortex-api to DigitalOcean, with the records worker, the heartbeat and the Overpass switch | property | W2 | D-4, D-23, D-24, D-26 | same, plus Stripe webhooks arriving on DigitalOcean and the heartbeat running from DOKS |
| D-30 | smartsite-mcp to DigitalOcean | property (the LDT MCP worktree) | W2 | D-6 | same, plus the `Claude-User` success rate no worse |
| D-7 | hauska-mcp-server to DigitalOcean | substrate | W2 | D-3, D-4, D-6, D-26 | same |
| D-31 | Job plane cutover in batches | property via the Texas planner | W3 | D-23, D-6 | per batch: the first DOKS production run matches the last GCP run on a comparison sample, and GCP job cost falls to zero for migrated jobs (`jobs-cost`) |
| D-32 | Trading bot and cockpit-pg | markets | markets' own window | D-16, D-22 | the cockpit health endpoint answers from DigitalOcean; the database row counts match at cutover; the broker accepts the Reserved IP |
| D-33 | smart-markets-api, retire or move | markets | none | D-28 | a recorded retirement, or a baked move |
| D-34 | GCS to Spaces | per repo seats | W4 per bucket | every Phase 4 row, D-31, D-32 | per bucket: checksums match, the stored-URI rewrite count equals the copy count, the fallback log reads zero, and GCS `request_count` is zero for 14 days |
| D-35 | Retire every GCP path; shut down projects | integration and seats | none | everything | `code-refs.mjs` zero, with a CI guard that fails on a planted reference; the billing export at zero for a full month; the projects deleted |

### Row specifications

**D-15, coordinate with the Texas planner.** Hand-carry
`_inbox/2026-09-18_gcp_exit_TEXAS_COORDINATION.md`. The output is a signed-off agreement recording
four things:
- the windows W1 to W4 and their triggers;
- which rows the Texas program would rather own as OPS-16 rows (D-19, D-23, D-27 and D-31 touch its code);
- the canary-leak action and its timing;
- the precise definition of "clean pause" for W3.

No other exit row that touches a Texas repo starts before this.

**D-16, operator prerequisites.**
1. A migration token scoped for apps, droplets, VPC, Kubernetes, registry, Spaces keys, firewalls, monitoring and uptime, databases, reserved IPs, load balancers and certificates. It carries no domains scope (rule 12 stands).
2. The droplet limit read and raised if needed. The fleet token cannot read the account.
3. The DigitalOcean GitHub connection widened (ruled).
4. The GCP billing export to BigQuery enabled now. It only records forward, so every day of delay is a day of bake with no bill lines.
5. Alert destinations (Slack or email).
6. Hostnames ratified (§3).
7. Who owns GCP project `1160337742`, which holds the SmartCity Google sign-in client (F-14).
8. Who holds the `smartcity-agent` key.
9. Access to the Stripe and Samsara webhook settings.
10. The broker IP allowlist question for the trading bot.

**D-17, platform probes.** One throwaway app, one droplet in `nyc1` and one in `ric1`, and a
small DOKS cluster, all deleted at the row's close (rule 18). Each probe has a falsifier:
- **P1:** does a request over 100 seconds die at the edge, for plain HTTP and for streamable HTTP/SSE? Falsified if a 150-second request completes.
- **P2:** do component-to-component calls inside one app avoid the edge and its timeout?
- **P3:** does deploying one component restart the others?
- **P4:** can a VPC-attached app be reached privately from another app or from DOKS?
- **P5:** the round trip to Neon us-east-1 and us-east-2 from `nyc1` and from `ric1`.
- **P6:** a DOKS Job launched through the API and a CronJob every 10 minutes. The pool scales to zero after, and the image pulls from DOCR and from GHCR.
- **P7:** a static egress path (NAT gateway) for DOKS, and whether it is available.
- **P8:** the GCS S3-interoperability API with an HMAC key, for our reads, writes, lists and presigned URLs.
- **P9:** reachability from DigitalOcean to every third-party host the services and factory call, tested with a control host (rule 7).

The output is a decision record choosing: grouping, the records-worker shape, the region, the
registry, the egress design, and the storage path for D-34.

**D-19, stop the canary-tag leak.** Remove the 0%-traffic tags that hold warm instances on the
six min-instances services (`hauska-engine-api`, `hauska-mcp-server`, `hauska-retrieval-api`,
`cortex-api`, `smartsite-mcp`, `smartcity-api`). Change each repo's canary procedure so a tag is removed after the
traffic shift. Extend P-279's post-deploy step with a refusal: fail the deploy when a 0%-traffic
tagged revision holds a minimum instance. Coordinated with the Texas planner, because the tags sit
on its services and P-279 is its row.

**D-20, the SmartCity decommission bundle.** After D-12's bake (staff on `app.smartcityos.io`),
D-13 and D-14:
1. walrus-app reads `SCRAPER_SERVICE_URL` from config, not the hardcoded GCP host (F-8), and is resized to 2 GiB with 2 instances (F-4).
2. GCP hosts are cleaned out of the CORS and CSP lists in `server/app.ts`.
3. Health checks go on walrus-app and dolphin-app.
4. The scraper droplet: the 10 Scheduler jobs become local cron with `flock` serialisation, trigger routes bind to localhost, and Caddy serves TLS on the one route walrus-app calls. This closes OPS-25 open items 2 and 3 without moving the WAF-accepted IP.
5. DigitalOcean Uptime and SSL-expiry checks go on `smartcityos.io` and `app.smartcityos.io`, closing open item 4.
6. `cortex-api`'s uptime check and alert move out of `smartcity-os-prod` first (F-13).
7. DigitalOcean leftovers are deleted: `d12-main-uat`, `d5-capability-probe`, `d5-smartcity-dashboards` and `d5-smartcity-api` (F-16).
8. When the host census reads zero through a bake in which a lens was opened, the GCP services, domain mappings, Scheduler jobs and the `smartcity-agent` key (once its holder is found) are deleted, and `smartcity-os-prod` and `smartcity-dashboards` are shut down.

**D-21, config and secrets as code.** Pilot it on walrus-app and dolphin-app, which today are
configured in the console. Then make it the only deploy path for every app a later row creates.
Retire the Secret Manager to Vercel key sync workflow and its service-account key (F-12, F-14).

**D-22, observability parity.** Map each of these to its replacement: the 6 uptime checks, the 9
alert policies and the 3 log metrics. Decide the log destination. Fix the `api.empressa.pro`
uptime path now (F-13, owned by markets). Fire each replacement once on purpose.

**D-23, DOKS job plane.**
- A cluster in the `nyc1` VPC, with a system pool and a jobs pool that scales 0 to N on 16 GiB nodes.
- `factory-control` runs as a Deployment.
- A Kubernetes Jobs adapter sits behind `cloudrun-jobs.mjs`'s interface.
- `runs.mjs` and `heavy-lease.mjs` get a new host type whose identity is the Job's uid. A run record must name its execution, or the write refuses.
- CronJobs replace the two factory Scheduler jobs and the `cortex-api` heartbeat (which runs every 10 minutes, below App Platform's 15-minute floor).
- `secret-rotation.mjs` writes a Kubernetes Secret.
- Staging only. The gate is output parity against GCP on the same staging inputs.

**D-24, Overpass droplet.** Built from `legacy-design-tools/infra/overpass` on the pinned image,
bound to its VPC IP, with a DigitalOcean cloud firewall: VPC ingress only, SSH from the operator
only, and no RDP (F-14). Parity on a fixed bbox set.

**D-25, hostnames first.** For each service:
1. The operator creates the record (rule 12), and a Cloud Run domain mapping serves it on GCP. Confirm that domain mapping is supported in `us-east4` for `factory-control`, or use a load balancer.
2. Repoint every caller in one row per owning repo:
   - the `cloudbuild-mcp.yaml` substitutions;
   - the LDT workflow env;
   - the engine env and the cortex secret;
   - the hardcoded files listed in F-5 to F-8;
   - every Vercel production environment (the blind spot in evidence §8);
   - scripts and uptime checks.
3. Graded per service by the host census with a positive control per known caller class.

This row edits Texas repos, so it runs in W1.

**D-26, external registrations and installed clients.**
- The Stripe webhook endpoint moves to `api.smartsite.cloud`. The old endpoint stays until the census reads zero.
- Samsara is checked, and moved if it is registered.
- A brief extension release carries the hostnames. Chrome auto-updates, and the old-version tail is measured on `run.app`.
- A Revit connector release makes the base URL configurable and defaults it to the hostname.
- Paying MCP clients are told about `mcp.hauska.dev`, which is D-7's original step.

**D-27, no request over 90 seconds.**
- The engine refresh endpoints (flood-drainage, feasibility-export, site-plan-export, dossier-export) return 202 and are polled. Memory already records that clients time out at 55 seconds.
- `cortex-api` street-search and gis-layer are bounded under 90 seconds with a reasoned refusal.
- `hauska-retrieval-api` `/stats` is bounded.
- `smartcity-api` `/api/ai/proactive-insight` is bounded.
- Callers (Property Explorer, `hauska-mcp-server`) poll.

**Phase 4 cutover rows** (D-28, D-29, D-3, D-4, D-6, D-30, D-7) share one procedure:
1. Build from the committed spec (D-21) at the size in §3. The interim GCS access, where the service needs it, is a scoped service-account key in the app's encrypted env, recorded as a leave-behind for D-34.
2. Check payload parity against GCP on a fixed request set, classifying payload and framing separately (rule 11).
3. Lower the TTL a day ahead (rule 4).
4. The operator flips the CNAME.
5. Bake against the D-18 baseline with synthetic probes and the log destination.
6. The GCP original stays untouched until the census reads zero.

D-3's existing dispatch and mission are recompiled first. Its caller list is wrong (F-5).
D-6 also:
- moves the records worker in the shape D-17 chose;
- moves the heartbeat to a DOKS CronJob;
- switches `OVERPASS_URL` to the D-24 droplet;
- confirms Stripe webhooks arrive on DigitalOcean.

**D-31, job plane cutover.** Batches run from idempotent, read-only jobs to writers, then the
publish and gate jobs last. Each batch runs in a W3 window: no factory run in flight, the gate
trigger paused, no heavy-scan lease held. A GCP job definition stays, disabled, until its batch
bakes. Acquisition jobs' third-party hosts are tested from the DOKS egress first (rule 7, D-17 P9).
The factory's Cloud Build files are replaced by manifests and an image build to the chosen
registry.

**D-32, trading.**
- The bot moves to a droplet with a Reserved IP registered with the broker before cutover.
- `cockpit-pg` goes to Managed Postgres in the same datacenter (point-in-time recovery on) or to Neon; markets decides. `cloud-sql-proxy` is removed.
- `api.empressa.pro` is cut over by DNS.
- The cloud firewall allows SSH from the operator only, and no RDP.
- The cutover runs outside market hours. The SEC bucket waits for D-34.

**D-34, GCS to Spaces.**
- **One S3-compatible storage adapter per repo**, with endpoint and credentials in config: `hauska-engine`, `hauska-mcp-server`, `legacy-design-tools` (including `objectAcl.ts` semantics), `hauska-factory` and `empressa-trading`.
- **Copy and rewrite.** Data is copied with per-object checksums. The `gs://` URIs stored in databases are rewritten as a recorded migration that refuses if the rewritten count differs from the copied count.
- **Tiles.** `hauska-map-tiles` moves behind a tiles hostname: DigitalOcean DNS delegation of one subdomain for automatic certificates, an uploaded certificate, or an App Platform static proxy. The operator chooses.
- **Dual-read period.** Reads go to Spaces, with a logged GCS fallback that must reach zero.
- **Retirement.** The GCS buckets go read-only, then are deleted.

**D-35, shutdown.**
1. **Order:** `smartcity-dashboards` and `smartcity-os-prod` (already done in D-20), `smart-files`, `plan-review`, `smart-markets`, `empressa-trading-prod`, `legacy-design-tools-prod`, then `hauska-prod-497015` last.
2. **Remove every GCP deploy path:** the Workload Identity pool, Cloud Build files, GitHub workflows and service-account keys.
3. **Export first.** Export from Cloud Logging whatever evidence is still needed before a project is deleted.
4. **Delete.** Deletion leaves a 30-day recovery window, which is the final rollback.
5. **Guard.** Add the `code-refs.mjs` CI guard in each repo.
6. **Grade by the bill.** The billing export reads zero for a full month.

## 8. Freeze windows proposed to the Texas planner

The ruling says the exit waits for a clean pause. Most of it does not need the Texas program
stopped, only specific windows.

| Window | What is frozen | Used by |
|---|---|---|
| none | nothing | Phases 0 to 2, and D-28, D-29, D-33 |
| **W1** (light) | ordinary lanes that edit Texas repos, scheduled through the Texas queue like any other lane | D-19, D-21 for Texas repos, D-25, D-27 |
| **W2** (per service) | no deploys to the one service being cut over, from its DNS flip through its bake | D-3, D-4, D-6, D-30, D-7 |
| **W3** (the factory freeze) | no factory run in flight, the gate trigger paused, no heavy-scan lease, for each D-31 batch switch | D-31 |
| **W4** (per bucket) | no writes to the bucket during its copy and switch | D-34 |

**The only true pause is W3.** Its natural slot is a Texas phase boundary: after the Phase 0 exit
and before the Burnet run, or after Phase 1.

## 9. Corrections to existing OPS-25 content (carded in A-8)

- **D-3's compiled dispatch and mission are wrong about callers** (F-5). Recompile before firing.
- **D-13's scope names two of the five dashboards files** (F-8).
- **Rule 2's leaf-to-root order cannot hold** on a call graph with loops (F-6). Replaced by hostname-first.
- **Rule 8 is widened** by ruling 5.
- **The first arc's definition of done is extended to the full exit.**
- **D-4, D-6 and D-7 become DNS cutovers behind D-25's hostnames.**
- **D-8's cost model should take its numbers from the evidence file**, not from the 2026-09-17 estimate.

## 10. What is still open, with recommendations

| Question | Recommendation |
|---|---|
| Hostname names | the §3 proposal |
| Region | `nyc` unless D-17 P5 says otherwise |
| Log destination | one SaaS that gives logs, uptime and alerting, over running OpenSearch ourselves; decide in D-22 |
| Secrets source of truth | GitHub environment secrets plus the fingerprint drift check, and no new vendor |
| cockpit-pg target | Managed Postgres in the bot's datacenter, for latency and point-in-time recovery; markets decides |
| smart-markets-api | retire, unless markets names a live user |
| Records-worker shape | decided by D-17 P2 |
| Tiles certificate | decided in D-34 |

Also open, and not ours to decide: who owns GCP project `1160337742`.
