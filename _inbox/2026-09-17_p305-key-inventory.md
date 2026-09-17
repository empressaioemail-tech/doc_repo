---
id: 2026-09-17_p305-key-inventory
title: P-305 key-consumer inventory — every Vercel project and Cloud Run resource holding the three service keys, by environment, by name
date: 2026-09-17
last_updated: 2026-09-17
status: filed
kind: inventory
owner: nick
maintained_by: p305-key-drift lane
plan_row: P-305
snapshot: read 2026-09-17T15:15:58Z by scripts/inventory-key-consumers.mjs (this repo, uncommitted) — Vercel as empressaioemail-tech (CLI identity), GCP as empressaioemail@gmail.com; 29 Vercel projects listed across all pages, 50 Cloud Run resources scanned (7 services + 43 jobs) across hauska-prod-497015 and legacy-design-tools-prod; 0 unreachable
related:
  - 90_runbooks/key_rotation_all_environments.md (the runbook this inventory feeds)
  - scripts/inventory-key-consumers.mjs (the reproducer; --selftest needs no network)
  - scripts/check-preview-key-drift.mjs (the closing check)
  - _decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md (P-251; the sixth-consumer correction)
  - _inbox/2026-09-17_p305-key-inventory.json (the machine-readable report this file reads)
---

# P-305 key-consumer inventory

**The predicate is three NAMES:** `HAUSKA_ENGINE_API_KEY`, `SERVICE_API_KEY`, `CORTEX_SERVICE_API_KEY`.
Every row below was read from the resource's own configuration, by variable name; no secret value was
read, returned or printed. A hit is an env var whose name is one of those three, or a
`secretKeyRef` whose secret name is.

## Counting rules (with their denominators)

| Population | Count | Method |
|---|---|---|
| Vercel projects in team `empressaioemail-techs-projects` | **29** | `vercel project ls --format json`, every page followed (`--next`) |
| Vercel projects whose env list could not be read | **0** | one `vercel env ls --format json` per project |
| Cloud Run resources scanned (services + jobs) | **50** | `gcloud run {services,jobs} list` + `describe --format=json`, both projects |
| Resources whose config could not be read | **0** | — |
| Vercel env entries matching the three names | **5** | `env[].key ∈ ` the three names |
| Cloud Run env entries matching the three names | **11** | `env[].name` or `env[].valueFrom.secretKeyRef.name` |
| Vercel env entries matching the two KNOWN ALIASES (outside the predicate) | **7** | reported separately, see below |
| Cloud Run env entries matching the aliases (outside the predicate) | **3** | reported separately |

Two numbers that should agree and do not, reconciled rather than rounded: the earlier
`_decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md` names **five** consuming Cloud Run
services; this read finds the same five plus `records-request-worker` (which holds `SERVICE_API_KEY`),
out of **seven** services scanned across both projects — the seventh, `factory-control`, sits in
`us-east4` and holds none of the five names. The difference is a wider predicate: the decision counted
consumers of `HAUSKA_ENGINE_API_KEY`, this counts the three names. The decision's "six consumers"
correction is confirmed: the sixth is Vercel, and this inventory is the first listing that structurally
could see it.

## A. Vercel projects holding one of the three names

| Project | Variable | Environments it exists in | Type | Last updated |
|---|---|---|---|---|
| `property-explorer` | `HAUSKA_ENGINE_API_KEY` | production | sensitive | 2026-07-24T03:16:42Z |
| `property-explorer` | `CORTEX_SERVICE_API_KEY` | production, **preview** | sensitive | 2026-07-21T12:07:20Z / `:22Z` |
| `property-explorer-staging` | `CORTEX_SERVICE_API_KEY` | production | sensitive | 2026-08-27T18:55:43Z |
| `cmdcenter` | `CORTEX_SERVICE_API_KEY` | production | sensitive | 2026-07-05T16:06:39Z |

26 of the 29 projects hold none of the three names: `smartcity-bastrop-demo`, `hauska-map-ui-qa`,
`plan-review-app`, `smart-files-app`, `smart-site-factory`, `empressa-overview`, `hauska-map-records`,
`hauska-map-lookup-perf`, `empressa-cockpit`, `icc-portal-app`, `smart-markets-app`, `og-twin`,
`atx-bulls`, `atx-bulls-portal`, `property-explorer-xi`, `hauska-map-auth-esm`, `dist`, `property-brief`,
`lane-a4c-panel`, `frontend`, `empressa-mobile`, `empressa-cockpit-admin`, `doc_repo`,
`system-overview-site`, `command-center`, `icc-demo`. **`command-center` and `cmdcenter` are two
different projects** — the same name collision that produced the 2026-08-10 "hauska-map was linked to
cmdcenter" trap (`_STATE.md`, 2026-08-10).

## B. Vercel projects holding a KNOWN ALIAS — outside the three-name predicate, and the vector A-205 actually ran through

The same value is carried under other names, and the names are not uniform across surfaces. These are
**not** predicate hits; they are listed because the P-251 miss and the 2026-08-10 outage both ran
through them, and a rotation that only walks the three names would leave every row below stale.

| Project | Variable | Environments | Last updated |
|---|---|---|---|
| `property-explorer` | `HAUSKA_RETRIEVAL_API_KEY` | **preview**, production | preview `2026-09-17T13:38:30Z` (the A-205 fix), production `2026-09-16T18:28:51Z` |
| `property-explorer` | `RETRIEVAL_API_KEY` | production | 2026-09-16T18:28:53Z |
| `command-center` | `RETRIEVAL_API_KEY` | preview, production | 2026-07-26T12:48:09Z |
| `cmdcenter` | `RETRIEVAL_API_KEY` | production | 2026-08-10T11:23:12Z |
| `icc-demo` | `RETRIEVAL_API_KEY` | production | 2026-07-05T23:17:37Z |

`property-explorer` alone carries the value under **three variables and two names in two
environments** — exactly the shape that let Preview drift: the sync workflow writes
`HAUSKA_RETRIEVAL_API_KEY` and `RETRIEVAL_API_KEY` into **production** only.

## C. Cloud Run resources holding one of the three names (both projects)

| Project | Kind | Resource | Env var | Value comes from | Matched by |
|---|---|---|---|---|---|
| hauska-prod-497015 | service | `hauska-engine-api` | `SERVICE_API_KEY` | secret `SERVI-6ed27a67-abc8-11f1-9b46-c4bde517b9f8` | env-var name |
| hauska-prod-497015 | service | `hauska-engine-api` | `RETRIEVAL_API_KEY` | secret `HAUSKA_ENGINE_API_KEY` | secret name |
| hauska-prod-497015 | service | `hauska-engine-api` | `ENGINE_API_GATE_TOKEN` | secret `HAUSKA_ENGINE_API_KEY` | secret name |
| hauska-prod-497015 | service | `hauska-mcp-server` | `HAUSKA_ENGINE_API_KEY` | secret `HAUSKA_ENGINE_API_KEY` | env-var name |
| hauska-prod-497015 | service | `hauska-retrieval-api` | `RETRIEVAL_API_KEY` | secret `HAUSKA_ENGINE_API_KEY` | secret name |
| legacy-design-tools-prod | service | `cortex-api` | `SERVICE_API_KEY` | secret `SERVICE_API_KEY` | env-var name |
| legacy-design-tools-prod | service | `cortex-api` | `ENGINE_API_GATE_TOKEN` | secret `HAUSKA_ENGINE_API_KEY` | secret name |
| legacy-design-tools-prod | service | `cortex-api` | `RETRIEVAL_API_KEY` | secret `HAUSKA_ENGINE_API_KEY` | secret name |
| legacy-design-tools-prod | service | `records-request-worker` | `SERVICE_API_KEY` | secret `SERVICE_API_KEY` | env-var name |
| legacy-design-tools-prod | service | `smartsite-mcp` | `SERVICE_API_KEY` | secret `SERVICE_API_KEY` | env-var name |
| legacy-design-tools-prod | service | `smartsite-mcp` | `HAUSKA_ENGINE_API_KEY` | secret `HAUSKA_ENGINE_API_KEY` | env-var name |

Plus the aliases (again outside the predicate): `hauska-engine-api`, `hauska-retrieval-api` and
`cortex-api` each carry `RETRIEVAL_API_KEY` from the `HAUSKA_ENGINE_API_KEY` secret. **No Cloud Run
resource in either project holds `CORTEX_SERVICE_API_KEY`.** Zero of the 43 Cloud Run **jobs** hold any
of the five names — the factory jobs mount database URLs, not service keys.

## Findings this inventory produced (not asked for, stated anyway)

1. **`property-explorer` production holds `HAUSKA_ENGINE_API_KEY` (2026-07-24) and
   `CORTEX_SERVICE_API_KEY` (2026-07-21), and `cmdcenter` production holds `CORTEX_SERVICE_API_KEY`
   (2026-07-05) — all three predate P-251's 2026-09-16 rotation.** By construction those three copies
   were **not** rotated, and nothing noticed, exactly as A-205 describes for Preview. That they are
   stale is not visible from any surface today because the code reads the retrieval aliases; the
   staleness is only visible from this listing. **A rotation keyed on the three names would have to
   decide for each whether the copied value must match** — it is a decision, not a mechanical rule.
2. **`hauska-engine-api`'s `SERVICE_API_KEY` resolves from Secret Manager secret
   `SERVI-6ed27a67-abc8-11f1-9b46-c4bde517b9f8`** — a secret object whose NAME does not carry the
   variable's name. A rotation keyed on names sees the env var and would have to follow the ref to
   find the object; a scan of secrets by name would miss it entirely. This inventory reports the ref,
   not an assumption about the object's provenance (not established by this read).
3. **`CORTEX_SERVICE_API_KEY` exists only in Vercel; the Cloud Run side of the same value is
   `cortex-api`'s `SERVICE_API_KEY`.** The two names must hold the same value for PE's cortex calls to
   authenticate. A name-keyed listing cannot see that they are one value, so the runbook states the
   pairing explicitly rather than hoping the reader infers it.

## Gaps — stated, not omitted

Out of reach of both listings, and therefore out of reach of the runbook's "every environment of every
consumer" unless named: local workstation `.env` files; GitHub Actions secrets in every product repo;
Replit env; Cloud Build substitutions and Cloud Scheduler headers; Vercel projects outside
`empressaioemail-techs-projects`; and any copy of a predicate key's VALUE held under a variable name
outside the five names this report tracks.

## What this file is not

It is not a rotation. It reads nothing secret and changes nothing. Its verdict that "0 resources could
not be read" is a statement about this run at `2026-09-17T15:15:58Z` only (DEV_PROCESS 1.6).
