---
id: 20_agent_operating_rules
title: Agent operating rules
status: active
last_updated: 2026-05-05
applies_to: portfolio
supersedes: 13_agent_operating_rules
---

# Agent operating rules

**Audience:** Every agent operating against any Empressa / Legacy Group /
Hauska codebase. Cursor Claude Code, Replit Agent, Cursor manual,
Claude.ai planner. The Claude.ai planner enforces these rules across all
subordinate agents.

**Scope:** Applies across `legacy-design-tools`, `smartcity-os`,
`legacy-revit-sensor`, `hauska-sdk`, ECI, and all future Empressa
products.

This is v2. The earlier v1 lived in pre-docs-repo project knowledge as
`13_agent_operating_rules.md` and is superseded — see [Versioning](#versioning).

## Why this document exists

On 2026-05-05 a deploy that should have taken 30 minutes consumed 12
hours and ~50 planner turns. Three failure categories surfaced, each
addressable at the rules layer:

1. Tool abstraction failures — Replit's local-main-vs-origin drift,
   Replit-managed Neon, schema management split between TS and
   hand-rolled SQL.
2. Agent coordination failures — contradictory recon, lost commits,
   velocity-without-verification.
3. Verification gaps — no immediate post-deploy probes, no CI guards on
   critical paths.

These rules target categories 2 and 3 directly. Category 1 is being
addressed via infrastructure migration (Cloud Run + Empressa-owned Neon)
on a separate sprint.

## Hard rules — never violate

### HR-1: GitHub web UI is the source of truth for repo state

When agents disagree on what's on a branch — what files exist, what
commits have merged, what a PR contains — **the GitHub web UI is the
tiebreaker.** Not `git log` output from any agent. Not local checkouts.
Not Replit's view.

**Operationalization:**

- Whenever any recon claims "X is on origin/main" or "Y file does not
  exist," include verbatim `git log --oneline origin/main` output and
  `git ls-tree origin/main <path>` output in the same response, no
  exceptions.
- The Claude.ai planner asks for screenshot of GitHub commits page at
  the first sign of agent contradiction on git state.
- Treat all agent `git` output as supporting evidence, not primary
  evidence.

### HR-2: "Committed" is not "pushed to origin"

Replit Agent in particular makes "Checkpoint" commits that live only in
the Repl's local git database. These do not reach origin/main without an
explicit push.

**Operationalization:**

- Every code-change prompt must end with: "Push to origin/main when
  complete and report the SHA on origin." Not "commit and report" —
  explicitly push.
- After any agent reports completion, verify origin state from outside
  the agent: GitHub web UI, or a different agent fetching from origin.
- Replit Agent is reserved for in-IDE exploration and Repl-local
  operations. Code changes that need to ship route through Cursor Claude
  Code agents working against local clones.

### HR-3: Deploy success ≠ feature live

A green deploy means the deploy pipeline ran. It does NOT mean:

- The new bundle was actually rebuilt
- The new bundle is what's serving traffic
- The new endpoint is reachable
- The new schema applied
- The end-to-end flow works

**Operationalization:**

- Every server-side deploy of new functionality is followed by a curl
  probe in the same chat turn. Not "user will smoke test later." Now,
  by the agent.
- For schema changes: run a 4-boolean existence check immediately after
  the migration apply.
- For new endpoints: curl returns expected response shape (JSON, not
  "Cannot GET").
- Until the probe returns expected output, treat the work as "in
  progress," not "done."

### HR-4: Schema source of truth is the Drizzle TS schema, not hand-rolled SQL

Hand-rolled SQL files in `lib/db/scripts/` are operational tools, not
authoritative schemas. The TS schema in `lib/db/src/schema/` (or
`shared/schema.ts` in SmartCity OS) is what all tooling — drizzle-kit,
type generation, queries — sees.

**Operationalization:**

- New schema changes go to the TS schema first.
- Hand-rolled SQL exists only as a one-time migration runner; once
  applied, retire the SQL or move it to `lib/db/scripts/historical/`
  with a README explaining "TS schema is the spec; this file is for
  archaeology."
- Schema reconciliation against any environment uses `drizzle-kit push`
  (eventually `drizzle-kit migrate` once journaled migrations are
  adopted) — never both `psql script.sql` AND drizzle, ever.

### HR-5: No `drizzle-kit push --force` in any auto-triggered hook

Any hook that runs on merge, push, or deploy and contains `push-force`
is a foot-gun. The flag bypasses destructive-change confirmations. In
an auto-trigger context with no human present, that means columns get
silently dropped from production whenever the TS schema goes backward.

**Operationalization:**

- `scripts/post-merge.sh` and any equivalent hook must use `push` (not
  `--force`), OR must have an explicit DB-target guard (refuse to run
  against production-suffixed `DATABASE_URL` values).
- Production-target schema changes go through a supervised drizzle
  push, not an automated one.
- See [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md)
  for the specific failure that motivated this rule.

### HR-6: Verify environment variable bindings before destructive operations

`DATABASE_URL` in interactive shell ≠ `DATABASE_URL` in postMerge hook
≠ `DATABASE_URL` at deploy time. Replit (and other tools) bind env vars
by context.

**Operationalization:**

- Before any DB-mutating operation, an agent must echo the resolved
  env var (with credentials redacted) and confirm it matches the
  intended target.
- If running against production, prompt human for confirmation. Never
  silently apply.
- If the operation is in an auto-triggered hook, the hook must include
  explicit guards (see HR-5).

### HR-7: No three-failure rule

If three deploys in a row fail for distinct reasons, stop deploying.
Convene the planner agent, identify whether the tooling itself is
fighting the work, and decide whether to continue patching or to escalate
to infrastructure migration.

**Operationalization:**

- The Track B saga had exactly this pattern (stale bundle → local main
  detached → build scope too wide). After the third failure the planner
  should have flagged it as a tooling-fighting-us moment and paused for
  assessment instead of patching the next layer.
- Tracking metric: distinct-cause deploy failures within 4 hours.

### HR-8: Recon prompts must include verification artifacts in the same response

A recon report saying "5 commits, 17 files, 11 tests" is unverifiable.
A recon report saying "git log: <verbatim output>; ls-tree: <verbatim
output>" is checkable.

**Operationalization:**

- Recon prompt template includes: "report verbatim output of
  `git log --oneline origin/main -10`, `git ls-tree origin/main <path>`,
  and `git show origin/main:<path>` for any file the recon depends on."
- Without this, the next agent can't audit; we end up trusting prior
  recon and compounding errors.

### HR-9: Don't sequence dependent sprints on agent completion reports

Track C was built against a contract Track B claimed to expose. Track
B's contract didn't actually exist on production until ~12 hours after
the Track C work began. The Track C agent's time was wasted because the
dependency was assumed-shipped, not verified-shipped.

**Operationalization:**

- Cross-track dependencies require production verification of the
  dependency before downstream work begins.
- Production verification = curl probe + DB inspection (whatever proves
  the contract is live), not an agent's "merged successfully" report.
- A merged PR that hasn't been smoke-tested in production is "code
  change," not "shipped feature."

### HR-10: Sync local Replit main to origin/main BEFORE every deploy

Replit's deploy reads from local main. Local main drifts from
origin/main via "Published your App" auto-checkpoint commits. Every
deploy ritual must include explicit re-sync.

**Operationalization (until Cloud Run migration completes for legacy-design-tools):**

- Pre-deploy command block (inline, every time, not in a runbook the
  user is expected to remember):
  ```bash
  cd ~/workspace
  git fetch origin --prune
  git reset --hard origin/main
  git log --oneline -3   # confirm top SHA matches expected
  ```
- Only AFTER this output is verified does the user click Redeploy.
- The Claude.ai planner inlines this command block in every "click
  Redeploy" instruction.

This rule is moot for SmartCity OS (Cloud Run; no Replit deploys in
production traffic path) but the Repl drift it warns about persists —
see [`10_ground_truth.md`](10_ground_truth.md) on the SmartCity OS
Repl's 10 unpushed commits.

## Soft rules — strong defaults, can be overridden with reason

### SR-1: Default to Cursor Claude Code agents for code changes that need to ship

**Reasoning:** Cursor agents work against local clones with reliable
origin push. Replit Agent's checkpoint flow is unreliable for "shipped"
outcomes.

**Override condition:** Replit Agent IS the right tool for changes that
only need to land on the Repl (config edits, dev-only changes, runtime
log inspection, DB queries via secrets). Use it deliberately for those.

### SR-2: Single-prompt-per-sprint, agent dispatches inline

**Reasoning:** Planning agent prompts go to downstream agents in
ready-to-paste fenced markdown blocks (Copy button works). One
self-contained prompt per dispatch beats a multi-turn back-and-forth.

**Override condition:** Genuinely multi-stage operations (recon → human
approve → execute → report) where the human approval is load-bearing.
In those, multiple prompts are correct.

### SR-3: Recon-only first when the action is ambiguous

**Reasoning:** Patching speculatively wastes more cycles than recon
does. The Track B saga had multiple speculative patches that were
correct in shape but applied before the actual cause was known.

**Override condition:** Truly bounded operations (a typo fix, a
dependency bump) where the action is obvious and reversible. Recon adds
friction without value.

### SR-4: Capture lessons in a postmortem within the same session

**Reasoning:** A postmortem written next week loses the granular
context. Same-day capture preserves what actually happened, not what
we remember.

**Override condition:** None. Even small bugs deserve a paragraph in a
session-log; production disasters deserve a full postmortem in
[`91_postmortems/`](91_postmortems/).

## Multi-agent coordination patterns

### Agent role taxonomy

| Agent | Role | Trust profile |
|---|---|---|
| Claude.ai planner | Architecture, planning, prompt generation, cross-agent coordination | Authoritative on strategy; deliberately non-executing |
| Cursor Claude Code (4 instances) | Backend, SDK, GCP, code changes | Trusted for code that needs to ship; verifiable via origin push |
| Cursor manual | Human-in-loop fixes | Trusted; slow; reserved for ambiguous changes |
| Replit Agent | In-IDE exploration, Repl-local ops, runtime log/DB access via secrets | Trusted for scoped Repl operations; NOT for shipping code; NOT for declaring origin/main state |

The Claude.ai planner is responsible for routing work to the right
agent type. Wrong-routing is a planner error.

### Verification chains

When an agent reports a result, a verification chain triggers IF the
result has shipping consequences:

- Code change → push to origin → second agent or human verifies on
  GitHub web UI
- Deploy → build log inspection + curl probe → second verification or
  runtime log check
- Schema change → drizzle push (or migration) → 4-boolean verification
  query
- Production data → query result paste → second-look at edge cases
  (NULL columns, row counts)

Each step is cheap. Skipping any step compounds risk.

### Contradiction resolution

When two agents give conflicting reports on the same fact:

1. Both reports are now suspect.
2. Drop to first-principles check against the actual underlying server
   (GitHub web UI for repo, Replit shell for Repl, Neon SQL editor for
   DB).
3. Resolve before proceeding with any state change.

The Track B saga had three contradiction events; in each, the
resolution path was the same (manual check against the server).
Codifying this saves the second hour of pingponging.

## Schema management discipline

Until the Cloud Run + Empressa Neon migration sprint completes for
legacy-design-tools, schema changes follow this protocol:

1. Edit the TS schema first.
2. Run unit tests + type checks against the change.
3. Commit + open PR.
4. PR review + merge to main. (`scripts/post-merge.sh` Neon guard
   ensures the merge doesn't auto-wipe production schema. As of
   2026-05-05 this guard is not yet in place — see Fire 3 in
   [`10_ground_truth.md`](10_ground_truth.md).)
5. After deploy lands (or before — schema changes are independent of
   bundle deploys for additive changes): manually run
   `DATABASE_URL=$DEPLOYMENT_DATABASE_URL pnpm --filter @workspace/db
   run push` against Neon. NOT push-force. With human-in-loop for any
   prompts.
6. Verify schema matches expectations via SQL existence/column queries.
7. Smoke test the feature end-to-end via prod curl/Revit/whatever
   surfaces it.

Once Drizzle migrations (`generate` + `migrate`) replace `push`, this
protocol updates to: "migration is journaled in `lib/db/drizzle/`,
applied via CI on deploy, never reverted unless explicitly migrated
down."

For SmartCity OS, the equivalent protocol uses the safer
`scripts/post-merge.sh` already in place (idempotent DDL, no
push-force). Hand-rolled SQL in `migrations/` is currently the
operational path; same migration to journaled drizzle migrations is
desired but lower priority since the existing pattern is not
catastrophic the way push-force is.

## Process changes for the Claude.ai planner specifically

These are auditable on the planner, not just on subordinate agents:

### PC-1: When two agents contradict on hard facts, drop to manual verification IMMEDIATELY

Not "let me get a third opinion." Not "let me re-prompt agent A."
Manual verification against the actual server.

### PC-2: When deploy fails for the third distinct reason in 4 hours, stop and escalate

Three distinct failures = the tool is fighting us. Stop patching and
assess.

### PC-3: When a multi-step operation has a state-change step (DB, deploy), include verification primitives in the SAME turn as the action

Not "click Redeploy" — "click Redeploy AND curl this URL and tell me
the response." The verification belongs to the action, not the next
turn.

### PC-4: Curl probe a new endpoint within the same chat turn that the deploy succeeds

Same as HR-3 from the planner side.

### PC-5: Document lessons within the session

Postmortem same day. Runbook updates same day. Memory items same day.
Don't defer.

## What this document does NOT solve

Several real problems are NOT addressed by rules and require
infrastructure work:

1. Replit's deploy abstraction (local main drift, "Published your App"
   checkpoints, opaque post-deploy state)
2. Replit-managed Neon ownership (no console access, no DDL audit
   visibility, no team auth)
3. The lack of journaled schema migrations on legacy-design-tools
   (drizzle push is the wrong long-term tool)
4. CI gaps that allow integration-time bugs (web-ifc init, build env
   var requirements) to escape into production

These belong to the upcoming sprint: Cloud Run migration + Empressa
Neon migration + Drizzle migrate adoption + GitHub Actions CI
hardening. Estimated 2.5 dev-days; covered in:

- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md)
- [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md)
- [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md)

This rules document operates within the constraints of current tooling.
The infrastructure sprint moves us out of those constraints.

## Versioning

- **v1** lived in pre-docs-repo Claude.ai project knowledge as
  `13_agent_operating_rules.md`. Superseded.
- **v2 (this document, 2026-05-05).** Adds hard rules HR-1 through
  HR-10, soft rules SR-1 through SR-4, multi-agent coordination
  patterns, schema management discipline, process changes for the
  planner. Frontmatter `supersedes:` field formalizes the chain.

Future revisions should add a delta section, not rewrite from scratch.
The history of why specific rules exist is load-bearing — a rule
without context becomes a rule that gets ignored when it's
inconvenient.
