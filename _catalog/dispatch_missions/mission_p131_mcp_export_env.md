## Mission — P-131: make the Smart Site MCP export credentials survive a deploy

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

Repo `empressaioemail-tech/legacy-design-tools`, property seat. Create a fresh
worktree/clone from `origin/main` on branch `fix/p131-mcp-export-env`. Declare the
commit you started from before you write anything.

### What happened, and why this is an outage fix rather than a feature

Four export kinds on the Smart Site MCP connector (X-ray/dossier, site plan, terrain,
feasibility study) were dark on production. Verified live 2026-09-08 from the service's
own dependency endpoint on serving revision `smartsite-mcp-00099-yix`:

    GET https://mcp.smartsite.cloud/health/dependencies
    {"service":"smartsite-mcp-dependencies","dependencies":{
      "hauska_mcp":{"state":"skipped","latency_ms":null,
      "detail":"HAUSKA_MCP_BASE_URL not configured"}}}

All six candidate env names were absent on the revision, both primary and fallback:
`HAUSKA_MCP_BASE_URL`, `HAUSKA_MCP_SERVICE_KEY`, `HAUSKA_ENGINE_API_URL`,
`HAUSKA_ENGINE_API_KEY`, `ENGINE_API_URL`, `ENGINE_API_GATE_TOKEN`. Confirmed
independently by two seats from separate reads.

The feasibility export was recorded as live-verified end to end with a real generated
PDF on 2026-09-04 (OPS-16 A-103 / P-119). It stopped working and nothing detected it.

ROOT CAUSE. `.github/workflows/cloud-run-deploy-smartsite-mcp.yml` writes environment
with `--set-env-vars` and `--set-secrets`, which are AUTHORITATIVE REPLACE. Any variable
set by hand in the console is erased by the next workflow deploy. The workflow's own list
does not carry the four export variables, so every deploy re-breaks exports. The same
file already carries a comment about this exact class of failure happening to
`DATABASE_URL`.

A STOPGAP IS ALREADY LIVE AND IS NOT THE FIX. The planner restored the four variables
with `gcloud run services update --update-env-vars/--update-secrets` (merge form, not
replace) and shifted traffic. Production now serves `smartsite-mcp-00101-yek`, tag
`envfix`, and `/health/dependencies` reports `hauska_mcp: state=ok, HTTP 200`. That
revision's env will be wiped by the next workflow deploy unless this card lands first.
Your job is to make the workflow produce the same env set that `00101-yek` carries now.

### The change

In `.github/workflows/cloud-run-deploy-smartsite-mcp.yml`, in the `deploy-canary` step
(around line 165):

Append to `--set-env-vars`:

    HAUSKA_MCP_BASE_URL=https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
    HAUSKA_ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app

Append to `--set-secrets`:

    HAUSKA_MCP_SERVICE_KEY=HAUSKA_MCP_KEY:latest
    HAUSKA_ENGINE_API_KEY=HAUSKA_ENGINE_API_KEY:latest

NOTE THE NAMING MISMATCH AND DO NOT "FIX" IT BY RENAMING. The code reads
`HAUSKA_MCP_SERVICE_KEY` (`artifacts/smartsite-mcp/src/hauska-client.ts`) and the Secret
Manager secret in `legacy-design-tools-prod` is named `HAUSKA_MCP_KEY`. Bind one to the
other in the flag, as written above. Renaming either side breaks a working binding.

Both URLs are plain env vars, not secrets. Neither is confidential and neither exists as
a secret in `legacy-design-tools-prod`. Do not invent a secret for them.

DO NOT USE `PRODUCTION_HAUSKA_MCP_URL` from `hauska-prod-497015`. Despite its name it
contains a Postgres connection string for the `hauska_mcp` Neon database, not a URL for
the MCP server. Using it would ship a silently broken config that still reports
`state: ok` on a probe.

### Scope boundary

This card changes ONE workflow file. It does not touch `artifacts/smartsite-mcp/**`, does
not add an export kind, and does not change `feasibility-export.ts`. Two follow-on
findings are filed separately and are NOT yours: `refresh_parcel_flood_drainage_export`
exists upstream and the connector has no kind for it, and the comment in
`feasibility-export.ts` claiming no upstream feasibility tool exists is now false
(`refresh_parcel_feasibility_export` is live on hauska-mcp-server). Leave both alone.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

1. `git diff` on the workflow file only. Confirm the diff is the four additions and
   nothing else, and that no existing entry in either flag was dropped. `--set-*` is
   authoritative replace, so a dropped entry is a new outage.
2. Open the PR. Merge on green CI, re-greened against the CURRENT base.
3. A PUSH DOES NOT DEPLOY. The push trigger builds and pushes the image only. After
   merge, run `workflow_dispatch` with action `deploy-canary` and pass the commit sha
   explicitly — `image_tag` defaults to `latest`, which resolves at deploy time and has
   already frozen the wrong digest in this fleet.
4. Verify on the CANARY TAG URL before shifting any traffic:

       curl -s https://canary---smartsite-mcp-tds7av26va-uc.a.run.app/health
       curl -s https://canary---smartsite-mcp-tds7av26va-uc.a.run.app/health/dependencies

   The first must report the revision you just deployed. The second must report
   `hauska_mcp` with `state` `ok` and an HTTP 200 detail. `skipped` means the flag
   did not take and the fix did not land.
5. NEGATIVE CONTROL, required, not optional. Before shifting, confirm the currently
   serving revision reports something DIFFERENT from the canary. A check observed only
   passing has not been observed working. If both URLs report identical bodies you are
   reading one revision twice and the tag did not route.
6. Shift traffic, then re-read `status.traffic` as JSON BY FIELD NAME. Never a positional
   `--format="value(a,b,c)"`; a blank field shifts every column after it. Never
   `latestReadyRevisionName`, which answers a different question than what serves.
7. Confirm the full env set on the newly serving revision by name and confirm all
   thirteen variables are present, not just the four you added. Specifically confirm
   `DATABASE_URL`, `SERVICE_API_KEY` and `WORKOS_CLIENT_ID` survived.

### Close

Declare `leave_behind` before closing. The `envfix` tag on `smartsite-mcp-00101-yek` is a
leave-behind if it still exists when you finish; name it and its owner.
