## Mission — P-279: a tagged revision cannot outlive a security setting

You launch no sub-agents (FAN-DEPTH 0). You build the check and open ONE PR per repo you must
change. You do not merge, do not deploy, and you do not delete anyone's revision or tag.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` into NEW directories, branch
`ci/p279-tagged-revision-security`: `hauska-engine` (main `3809275f`) and `legacy-design-tools`
(main `7219b707`) at compile, plus `hauska-factory` (main `d2e6cb03`) only if a factory service
needs it. Register each clone under the property seat and remove the entries at close. P-318 holds
`hauska-map/.github/workflows/**`; do not touch that repo's workflows.

### The finding (row P-279)

Finding `fa9addb4`: 37 of 51 hauska-engine traffic tags pointed at revisions that lacked
`ENGINE_API_GATE_TOKEN`. The reports lane removed those tags under P-251 on 2026-09-16, and the
integration seat verified the instance closed (14 tags remained, all on token-carrying revisions; a
former tag URL returns 404; the service URL still answers `unauthorized`). **Removal fixed the
instance, not the class.**

The class is live again today, measured by the integration seat on 2026-09-17:
- `factory-control` carries tags `canary` (revision `00004-jin`) and `f04` (`00006-raz`) while
  serving `00010-hax`.
- `cortex-api` carries seventeen tags on old revisions (`smoke4`, `pooling-fix`, `g60`,
  `canary-min1`, `p527`, `p538`, `p539`, `p540`, `p541`, `p542`, `p543`, `dbfix`, `dbfix2`, `stg2`,
  `staging`, `keyrot`, `p249-f816c21`) alongside the serving revision.
Each of those tag URLs is reachable and runs whatever env its revision was created with.

### What to build

1. A post-deploy check that FAILS when any tagged revision of a service lacks an auth or secret
   variable that the SERVING revision carries. It runs for `hauska-engine-api`,
   `hauska-retrieval-api`, `hauska-mcp-server`, `cortex-api` and `smartsite-mcp`.
2. It reads Cloud Run by FIELD (JSON, by name), never a positional formatter: a blank column shifts
   every field after it, and that misread has already cost this operation a wrong serving-revision
   claim twice.
3. It names its own bypass in its header: a manual `gcloud run deploy --tag` outside the workflow,
   and any deploy path that does not call it.
4. Wire it into the deploy path of each service it covers (the workflow or cloudbuild that performs
   the deploy), so it runs where a deploy happens rather than on a human's memory.
5. Report today's live census per service: every tag, its revision, and which required variables
   that revision lacks. Do not delete anything; the operator decides what is removed.

### Falsifiers — pre-register your predictions before building

1. Against today's live state, the check FAILS for at least one service (name which, before you
   run it). If it passes everywhere, either the class is closed — prove that with the census — or
   the check is vacuous.
2. A fixture service whose tags all carry the serving variables PASSES.
3. Reverting the check's predicate makes case 1 pass (it is not a syntax-only guard).
4. The check refuses (not passes) when it cannot read a service's revisions.

### Do not

- Delete or repoint any tag or revision, or deploy.
- Merge.
- Touch hauska-map's workflows.
- Launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; the live
per-service tag census with the missing variables named; the falsifiers with evidence; the bypass
list. `status`: `closed-partial` until the integration seat merges and the check runs in a real
deploy. `probe`: `{"notApplicable": "deploy-path control; graded by its first real deploy run"}`.
`subAgents`. `leave_behind`.
