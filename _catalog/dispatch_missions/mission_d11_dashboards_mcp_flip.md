## Mission — D-11: flip hauska-mcp-server's DASHBOARDS_BACKEND_URL

You launch no sub-agents (FAN-DEPTH 0). This is a single config change and redeploy on one service,
gated on D-9 landing first.

### Before you do anything

Confirm D-9 has actually cut `smartcity-dashboards` over to a live, validated DigitalOcean address —
read its close, do not proceed on the assumption that it has. Confirm `hauska-mcp-server`'s repo is
still idle (`git log -1` on `origin/main`) and that no lane claim currently touches it — re-check
fresh, do not rely on the 2026-09-16/17 readings in OPS-25, since time has passed and this repo
belongs to the Hauska substrate where other work moves independently of this program.

### Where you work

`hauska-mcp-server`, fresh clone from `origin`, your own worktree, registered under your seat and
removed at close.

### What to build

1. Update the `DASHBOARDS_BACKEND_URL` environment variable to the new DigitalOcean address D-9
   produced.
2. Redeploy `hauska-mcp-server` — a config-only change, no code touched.
3. Verify: a real call through `hauska-mcp-server` that reaches the dashboards backend returns the
   same result it did before the flip. Watch error rate for a short window post-deploy.
4. If anything regresses, revert `DASHBOARDS_BACKEND_URL` to the GCP address and redeploy again —
   the GCP `smartcity-dashboards` original should still be running per D-9's own bake-period
   discipline, so this is a clean rollback, not a scramble.

### Falsifiers, pre-register your answers first

1. A live call through `hauska-mcp-server` to the dashboards backend returns the same result
   before and after the flip.
2. Error rate on `hauska-mcp-server` in the post-deploy window matches its pre-deploy baseline.
3. The GCP `smartcity-dashboards` original is untouched by this mission.

### Do not

- Touch anything in `hauska-mcp-server` beyond this one environment variable.
- Proceed if D-9's dashboards cutover is not confirmed live first.
- Commit any secret value to any file, dispatch, or close artifact.
- Launch sub-agents.

### Close

Snapshot; the old and new `DASHBOARDS_BACKEND_URL` values (the new one only, never restate a secret
if the URL itself carries one); the verification call's result; the three falsifiers with evidence.
`status`: `closed` if the flip holds clean through your verification window, `closed-partial` with a
named reason otherwise. `probe`: the verification artifact path. `subAgents`. `leave_behind`: none,
or name what remains if you had to roll back.
