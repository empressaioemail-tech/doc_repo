---
id: 2026-09-08_smartsite_mcp_envfix_is_a_revision_stopgap_leavebehind
title: smartsite-mcp export env is a stopgap on one revision; a workflow deploy re-darks it
date: 2026-09-08
last_updated: 2026-09-08
status: open
applies_to: legacy-design-tools
plan_rows: [P-131]
seat: integration (doc-repo-79)
owner: integration seat (doc-repo-79) until P-131 merges
severity: live-hazard
snapshot:
  serving: smartsite-mcp-00101-yek
  tag: envfix
  verified_at: 2026-09-08T02:10Z
related:
  - _dispatches (P-131, committed a8844869)
---

# Do not deploy smartsite-mcp through the workflow until P-131 merges

## The hazard, first, because it is the operative part

Four env vars were restored **on a revision**, not in the workflow. The workflow writes env with
`--set-env-vars`, which is an authoritative REPLACE.

**Any workflow deploy of smartsite-mcp between now and P-131 landing wipes all four again and
re-darks all four export kinds — and it will look exactly like a clean deploy.**

Nothing fails. The deploy reports success, the service comes up healthy, and X-ray/dossier, site
plan, terrain and feasibility all silently stop working. The only signal is
`/health/dependencies` reporting `hauska_mcp: skipped`.

`envfix` on `smartsite-mcp-00101-yek` is a declared leave-behind. Owner: integration seat.
Retired when P-131's own deploy supersedes it.

## What was wrong, and for how long

All four export kinds were dark on production. Found by doc-repo-48 (MCP architecture thread) and
verified independently by this seat before and after:

    before   HAUSKA_MCP_BASE_URL, HAUSKA_MCP_SERVICE_KEY, HAUSKA_ENGINE_API_URL,
             HAUSKA_ENGINE_API_KEY -- all absent, plus both fallback names
             (ENGINE_API_URL, ENGINE_API_GATE_TOKEN), so the `??` chains had nothing to reach
             /health/dependencies -> hauska_mcp: state=skipped

    after    all four present, 13 env vars total, the 9 originals intact
             /health/dependencies -> hauska_mcp: state=ok, latency_ms 286, "HTTP 200"
             serving smartsite-mcp-00101-yek, tag envfix, 100 percent

The feasibility export was recorded live-verified end to end with a real generated PDF on
2026-09-04. The vars were gone by 2026-09-08 and nothing noticed in between. **Whatever removed
them was almost certainly a routine workflow deploy behaving exactly as designed.**

## Three traps banked fleet-wide, each confirmed at source

**1. This service pins traffic by revision NAME, not `latestRevision`.** Read from `spec.traffic`:

    [{"percent": 100, "revisionName": "smartsite-mcp-00101-yek"}, ...33 tag-only entries]

A plain `gcloud run deploy` would build a correct revision serving **zero percent**, and the fix
would read as done while changing nothing. Check `spec.traffic` before assuming an update serves.
This is the same family as the Cloud Run traffic trap already in fleet memory, one level deeper:
that one says a new revision is not the serving revision; this one says a new revision may not be
reachable at all.

**2. `PRODUCTION_HAUSKA_MCP_URL` in hauska-prod-497015 is NOT a URL.** It holds a Postgres
connection string for the `hauska_mcp` Neon database. Binding it by name into a var the code reads
as a base URL would have shipped a broken config **whose probe still reported ok**. Read the
value, never the name.

Note for this seat specifically: the publish lane's use of `PRODUCTION_HAUSKA_MCP_URL` is the
DATABASE use and is correct — `publish-gate-clients.mjs` opens it as the mcp store. Same secret,
two legitimate readings, and only one of them is a URL.

**3. The secret name and the code name differ.** The code reads `HAUSKA_MCP_SERVICE_KEY`; the
secret is `HAUSKA_MCP_KEY`. Bind, do not rename either side.

## The method that made the fix trustworthy

Worth copying rather than just the outcome: deploy tagged at 0 percent, verify on the tag URL,
then a **negative control** against the still-serving revision — the tagged URL said `ok` while
live `00099` still said `skipped`, which is what proves the tag genuinely routed rather than the
prober being generous. Then shift, then re-read traffic as JSON by field name.

Restored with `--update-env-vars` / `--update-secrets`, never `--set-*`, so `DATABASE_URL`,
`SERVICE_API_KEY` and `WORKOS_CLIENT_ID` were not touched.

## Open

P-131 (dispatch committed `a8844869`, lane branch `fix/p131-mcp-export-env` off `301bb75a`, property
seat) moves the four vars into the workflow file. Scope is ONE workflow file and explicitly not
`artifacts/smartsite-mcp/**`.

Until it merges, this hazard is live and owned here.

**Nothing counts this.** There is no check that would notice the four vars going missing again,
and the outage ran at least four days undetected. `/health/dependencies` reports it correctly and
nothing reads `/health/dependencies`. That is the same declared-but-uncounted shape already filed
for the narrative fallback reason on the same day — second instance, different service.
