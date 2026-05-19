---
id: cc_agent_node_tls_workaround
title: Node TLS workaround on Nick's Windows workstation for cc-agent npm installs
status: active
last_updated: 2026-05-19
applies_to: agent-ops
related: [00_current_state, _sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC]
---

# Node TLS workaround on Nick's Windows workstation

## Symptom

`npm install` (or any npm operation that fetches against `registry.npmjs.org`) fails with:

```
UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

Surfaced independently by cc-agent-E, cc-agent-M, and cc-agent-AC during 2026-05-18 substrate v1 work — three confirmations across three repos.

## Cause

Default Node TLS layer on this Windows box does not load the Windows system certificate store. Node ships its own CA bundle that does not include whatever cert chain resolves `registry.npmjs.org` on this network. State is environmental, not in any tracked config file.

## Workaround

Set `NODE_OPTIONS="--use-system-ca"` before running npm. This tells Node to load the Windows system CA store (which holds whatever cert chain the machine trusts).

```powershell
# PowerShell
$env:NODE_OPTIONS = "--use-system-ca"
npm install
```

```bash
# bash (Git Bash or WSL)
NODE_OPTIONS="--use-system-ca" npm install
```

Set in a single command:

```bash
NODE_OPTIONS="--use-system-ca" pnpm install --frozen-lockfile
```

## What does NOT work

`NODE_TLS_REJECT_UNAUTHORIZED=0` does NOT help. npm's own TLS layer (`make-fetch-happen`) ignores the env var. Don't waste time on it.

## Persistence

For a single shell session, export the env var as above. For permanent persistence on Nick's Windows box, add to user environment variables:

1. Win+R → `sysdm.cpl` → Advanced → Environment Variables
2. Under "User variables for nick", New
3. Variable name: `NODE_OPTIONS`
4. Variable value: `--use-system-ca`
5. Restart any open terminals to pick up the change

## When to use

Any cc-agent dispatch that runs `npm install`, `pnpm install`, `npm publish`, `npm pack`, or any other npm operation against the public registry on this workstation. Until a deeper Windows CA-bundle staleness fix is investigated and applied, this workaround is load-bearing.

## When NOT to use

CI runners (GitHub Actions Linux) do not have this issue. The workaround is workstation-specific. Do not add `NODE_OPTIONS=--use-system-ca` to repo-level config that would propagate into CI.

## Related work

A deeper investigation of Windows CA-bundle staleness on this machine is open. cc-agent-AC flagged it in [`_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md`](../_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md) §What was learned. Not urgent — the workaround is one env var and works reliably. Schedule the root-cause fix when the substrate v1 sprint clears.
