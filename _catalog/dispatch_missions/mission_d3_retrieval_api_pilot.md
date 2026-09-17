## Mission — D-3: Phase 1 pilot, stand up hauska-retrieval-api on DigitalOcean

You launch no sub-agents (FAN-DEPTH 0). This mission provisions and validates the DO replacement
and reports readiness. It does not flip production traffic — that is a separate, explicit step the
operator authorizes after reading your CP2, because it changes a live dependency's backend.

### Where you work

`hauska-engine`, fresh clone from `origin` under your own worktree. Register it under your seat and
remove the entry at close. Do not build in another lane's checkout.

### What you are replacing, verified live at compile time (2026-09-17)

- Source GCP service: `hauska-retrieval-api`, project `hauska-prod-497015`, region `us-central1`,
  1 vCPU / 1Gi memory, `minScale=1` / `maxScale=20`. Public URL:
  `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`.
- Its environment (names only; pull live values from GCP Secret Manager, do not hardcode or paste
  secret values into any file this lane commits): `DATABASE_URL`, `CORTEX_DATABASE_URL`,
  `FACTORY_DATABASE_URL_RO`, `RETRIEVAL_API_KEY`. All four are Neon or Neon-adjacent connection
  strings and an API key — none of them are GCP-specific, so none of them change when compute moves.
- Its only known caller in the verified call graph: `hauska-mcp-server` (`hauska-prod-497015`), via
  the env var `HAUSKA_BACKEND_URL`. No other service among hauska-mcp-server, cortex-api, or
  smartcity-dashboards references this service's URL in their live deployed env vars (checked
  2026-09-17). This does not prove no other caller exists — it was not checked against every repo's
  source or against any Vercel-hosted frontend. If your own investigation finds another caller,
  stop and report it before proceeding past CP1; do not assume the list above is exhaustive.
- DO tooling is already live fleet-wide: `doctl` and the `do-apps`/`do-droplets` MCP servers are
  configured with a token scoped to Droplets and Apps only. Do not re-provision either.

### What to build

1. Stand up `hauska-retrieval-api` on a DO Droplet sized to match the source (1 vCPU / 1GB minimum;
   size up only if the app's own resource profile under smoke-test load requires it, and say so if
   you do).
2. Replicate the four secrets above into the Droplet's environment via your own read of GCP Secret
   Manager's current values (`gcloud secrets versions access latest --secret=<name>
   --project=hauska-prod-497015`) — never via this dispatch, which does not carry them.
3. Deploy the same application code the GCP revision is currently running (read the deployed
   image/commit from `gcloud run services describe hauska-retrieval-api --project=hauska-prod-497015
   --region=us-central1` before you branch, so you are not deploying a stale or ahead-of-main build).
4. Smoke-test the DO deployment directly against its own address: confirm it boots, connects to all
   three databases, and serves at least one real, representative read request per endpoint the
   service exposes, with output compared byte-for-byte or field-for-field against the same request
   made to the GCP original in the same session.
5. Run a short parallel-validation window (not a multi-day bake — that is a follow-up step after
   this dispatch closes): send a batch of real or replayed read requests to both origins and diff
   the responses; report count tested, count matched, and every divergence found, not just a summary
   verdict.
6. Do NOT touch `hauska-mcp-server`'s `HAUSKA_BACKEND_URL` or redeploy it. That is the actual traffic
   cutover and it is explicitly out of this mission's scope.

### Falsifiers, pre-register your answers first

1. The DO deployment serves the same response shape and values as the GCP original for every
   endpoint tested, on real (not synthetic-only) data.
2. All four secrets resolve correctly on the DO side with no fallback, default, or empty-string
   substitution anywhere in the deployment.
3. The GCP original is untouched — no config, scale, or traffic change on `hauska-retrieval-api` in
   `hauska-prod-497015` — verified by re-describing it at the end of your session and diffing against
   the start-of-session describe.
4. If any divergence between the two origins is found, it is named with the specific request and
   response difference, not asserted as "minor" or waved off.

### Do not

- Flip `HAUSKA_BACKEND_URL` on hauska-mcp-server, or redeploy hauska-mcp-server, for any reason.
- Modify, scale, or decommission the GCP original.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; files touched; the DO deployment's address and how to reach it; the parallel-validation
table (count tested, matched, diverged, with every divergence detailed); the four falsifiers with
evidence; confirmation the GCP original is unchanged. `status`: `closed-partial` — this row is not
`closed` until the operator has read this close and separately authorized the traffic cutover as its
own step. `probe`: the parallel-validation artifact path. `subAgents`. `leave_behind`: name the DO
Droplet/App as a live, running, not-yet-serving-production resource so the next session knows it
exists and does not stand up a duplicate.
