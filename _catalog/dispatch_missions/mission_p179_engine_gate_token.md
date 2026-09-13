## Mission — P-179 ENGINE GATE TOKEN: the engine's bearer check is armed, then the door is closed

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you and reviews your CP1 design before any change, because this is a
credential and an IAM change. EVERY step that mints a secret, mounts it, or changes IAM STOPS
for the operator in the planner's thread; you prepare, you do not execute those steps until
the operator's go is quoted back to you.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`hauska-engine-p179-gate` (branch `fix/p179-engine-gate-token`) and `legacy-design-tools-p179-gate`
(branch `chore/p179-engine-gate-callers`), from `origin/main`; declare start commits.

### What is true today (F22; wave-4 Q5; overseer reads 2026-09-13)

- `hauska-engine-api` (hauska-prod-497015, us-central1): IAM `roles/run.invoker: allUsers`,
  ingress `all`, serving `hauska-engine-api-00215-niv`; env carries `GATE_CONTEXT_SIGNING_KEY`,
  `RETRIEVAL_API_URL`, `RETRIEVAL_API_KEY` and NO `ENGINE_API_GATE_TOKEN`, so the bearer check
  in the engine passes every caller (fleet memory: "engine-api gate headers are spoofable").
- No secret named `ENGINE_API_GATE_TOKEN` exists in Secret Manager in hauska-prod-497015 or in
  legacy-design-tools-prod. `cortex-api` carries `ENGINE_API_GATE_TOKEN` as a plain env var
  (value unread); `smartsite-mcp` carries none and now calls the engine directly (P-152 lane 5).
- The composer gate (hauska-engine #438) refuses public-free tiers and is real defence in depth
  for the two known callers; a caller who sets `x-hauska-access-tier` against the public URL
  is not stopped.
- Fleet rule: factory and cortex-consumed secrets are mirrored in BOTH projects or the next
  deploy fails on resolution (`factory-secrets-mirrored-two-projects`). Workflow deploys revert
  manually set env vars: the mount goes in the workflow, not by hand.

### What you build, in order

1. **CP1 design.** Read the engine's gate code and name exactly which routes the bearer check
   covers and which it does not (health may stay open); the header name the engine reads (never
   guess a credential header); the callers (cortex-api, smartsite-mcp, anything else that
   resolves `hauska-engine-api`'s URL: grep both repos and the Vercel BFF); the deploy workflows
   that must carry the mount; the rollout order that never leaves a caller without the token
   while the engine requires it (callers first, engine last). Pre-register the violation test.
2. **Prepare, then STOP.** The workflow and config changes as PRs (not merged): the engine
   mounts `ENGINE_API_GATE_TOKEN` from Secret Manager; cortex-api and smartsite-mcp read theirs
   from Secret Manager instead of a plain env var. Present to the operator through the planner:
   "mint `ENGINE_API_GATE_TOKEN` in hauska-prod-497015 and legacy-design-tools-prod (same
   value), grant the three services' runtime identities `secretAccessor`, merge the three PRs,
   deploy callers then engine." The operator mints the secret or gives the go for you to; the
   value is never printed, never pasted, never logged (explicit-placeholder convention).
3. **Execute on the go**, in the order designed, one traffic shift per service under the
   planner's leases; verify by violation live: a request without the token to a gated data
   route on the public URL returns 401; with the token, 200; cortex-api and smartsite-mcp
   reads of `48021:34049` unchanged before and after.
4. **The door.** As a separate step with its own go: remove `allUsers` from `roles/run.invoker`,
   grant the callers' service identities invoker, set ingress to internal-and-load-balancer if
   the callers' paths allow it (read how cortex-api and smartsite-mcp reach the engine before
   deciding; a Vercel-hosted caller cannot use internal ingress). Verify by violation:
   an unauthenticated call from outside returns 403 at the platform before the engine sees it.

### Falsifiers

- If a caller loses its reads at any point in the rollout, the order was wrong; roll the engine
  back first.
- If a token-less call still returns data after step 3, the check is not on that route.
- If the secret resolves in one project and not the other, the next deploy of the other fails.

### Out of scope

The tier model. The composer gate's semantics (lane 5's, done).

### Close

`_inbox/<date>_p179-gate_close.json`, `planRows` `["P-179"]`, with the CP1 design, the PRs and
merge SHAs with conclusion strings, the operator's quoted gos, the revisions by field, the IAM
policy before and after (members only, no values), and the violation reads. `leave_behind` is
required.
