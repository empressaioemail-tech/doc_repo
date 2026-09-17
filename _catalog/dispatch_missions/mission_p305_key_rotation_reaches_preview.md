## Mission — P-305: a rotated key cannot silently miss an environment

You launch no sub-agents (FAN-DEPTH 0). You build a doc_repo instrument and a runbook change, both
left uncommitted for the integration seat, plus a `hauska-map` PR if a code check belongs there. You
do not rotate, add or remove any secret or Vercel variable, and you do not deploy.

### Where you work

Your own doc_repo seat worktree (never `P:/doc_repo`), and a fresh `hauska-map` clone under
`P:/tmp/` into a NEW directory if needed (branch `feat/p305-key-drift-check`, main `93f832b6` at
compile). Register any product clone under the property seat and remove the entry at close.

### The finding (A-205, measured 2026-09-17)

- P-251 rotated the engine key (Secret Manager `HAUSKA_ENGINE_API_KEY`, project
  `hauska-prod-497015`). Its sixth consumer, Vercel project `property-explorer`, was fixed in
  Production only.
- The Preview environment's `HAUSKA_RETRIEVAL_API_KEY` stayed stale, so every Property Explorer
  preview answered its panel read with
  `{"error":"retrieval_auth_failed","message":"Property atom chain retrieval returned HTTP 401 ..."}`.
- Nothing noticed until a staging proof needed a preview. The integration seat replaced the
  Preview value at 13:37Z, and a plain preview's panel read then returned 200.
- `vercel env pull` returns sensitive values empty, so values cannot be compared by pulling them.
- Related: P-276's drift check (`scripts/check-staging-secret-drift.mjs` in hauska-factory) solves
  the same class for Cloud Run staging secrets.

### What to build

1. **An instrument** (`scripts/check-preview-key-drift.mjs` in doc_repo, or a hauska-map CI or
   post-deploy step if that is the better home) that fails when a preview's service-to-service
   calls return 401. For example: given a preview URL, call its panel route for a known parcel and
   fail on `retrieval_auth_failed` or any 401-shaped error. Include a self-test with a recorded
   401 body and a recorded 200 body. It never prints a key.
2. **The rotation runbook change:** find the key-rotation runbook in doc_repo (search `_inbox`,
   `90_runbooks` and P-251's close) and add the rule that every environment of every consumer
   (Production, Preview, Development) is rotated, with the instrument as its closing check. If no
   runbook exists, write the smallest one and say so.
3. **An inventory:** every Vercel project in the team and every Cloud Run service that holds a
   copy of `HAUSKA_ENGINE_API_KEY`, `SERVICE_API_KEY` or `CORTEX_SERVICE_API_KEY`, by environment,
   read by variable name only.

### Falsifiers, pre-register your answers first

1. The instrument's self-test fails on the recorded 401 body and passes on the 200 body.
2. Run against the current preview `https://property-explorer-jmvakhksg-empressaioemail-techs-projects.vercel.app`
   (deployed by the integration seat 2026-09-17 after the Preview key fix; do not deploy one
   yourself), it passes.
3. The inventory names every place the three keys live, or says which listings it could not read.

### Do not

- Change any secret or Vercel variable, deploy, or merge.
- Print any secret value.
- Launch sub-agents.

### Close

Snapshot; files touched; any PR with every CI check's literal conclusion string; the inventory;
the falsifiers with evidence. `status`: `closed-partial` until the integration seat commits the
instrument and runbook and the check runs once for real. `probe`: `{"notApplicable": "control
lane; graded by the check's first real run"}`. `subAgents`. `leave_behind`.
