---
id: 22_workstation_inventory
title: Workstation inventory
status: active
last_updated: 2026-05-06
applies_to: portfolio
related: [20_agent_operating_rules, 21_ai_first_dev_flow]
---

# Workstation inventory

Per-machine paths, tooling, and credential conventions. The fleet
operates differently per workstation; agents must verify which machine
they're on before assuming paths.

> **Status as of 2026-05-06:** Nick box gh auth complete with
> `gh auth setup-git` and credential username pinned. All four
> repos verified accessible. Cente box layout still pending
> verification.

## Workstations

### Nick box (primary)

Active workstation. Confirmed layout as of 2026-05-05.

**Working repos:**

- `P:\legacy-design-tools` (`empressaioemail-tech/legacy-design-tools`)
- `P:\empressaio_tech_smartcity_os` (`empressaioemail-tech/smartcity-os`)
- `P:\legacy-revit-sensor` (`empressaioemail-tech/legacy-revit-sensor`)
- `P:\doc_repo` (`empressaioemail-tech/doc_repo` â this docs repo)

All four verified accessible 2026-05-06 via `gh repo view --json
nameWithOwner,isPrivate,url`.

**Tooling:**

- `gcloud`: `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd`
- Active `gcloud` identity: `empressaioemail@gmail.com`
- No service account key on this box â interactive ADC via
  `gcloud auth login` and `gcloud auth application-default login`
- `psql`: not installed (use Neon Console or `node -e` with `pg` module
  for DB queries)
- `gh` CLI: install + auth status pending â see [Outstanding](#outstanding)
- Cursor: 4 Claude Code agents + 1 manual session per workspace

**Git auth pattern:** Currently HTTPS remotes with GitHub CLI
credential helper. As of 2026-05-06: `gh auth setup-git` complete
(wires git auth to GitHub CLI credentials), and global credential
username pinned to `empressaioemail-tech` via:

```
git config --global credential.https://github.com.username empressaioemail-tech
```

This eliminates per-repo Git Credential Manager account-picker
prompts that were the prior friction. SSH remotes migration
deferred â current setup is good enough for the agent fleet.

**Browser:** Comet for browser-manual ops. Claude.ai planner runs in
this browser as a separate tab.

### Cente box (secondary)

Layout per memory; verify when next on the machine. Treat the values
below as TBD until confirmed.

**Tooling (per memory):**

- `gcloud`: `C:\Users\cente\google-cloud-sdk\bin\gcloud.cmd`
- Service account key: `C:\Users\cente\google-cloud-sdk\smartcity-agent-key.json`
- `psql`: not installed
- Working repo paths and `doc_repo` location: not yet confirmed; assume
  not the same as Nick box until verified

The path divergence between the two boxes is real friction. Devcontainers
or Codespaces will eventually solve this; deferred.

## Common tooling references

### gcloud authentication

Two commands, both needed for full local automation:

```
gcloud auth login                              # user identity for CLI
gcloud auth application-default login          # ADC for SDKs and tools
gcloud config set project smartcity-os-prod    # default project
gcloud config set compute/region us-central1   # default region
```

ADC writes to `%APPDATA%\gcloud\application_default_credentials.json` on
Windows. Google client libraries pick it up automatically â once it's
run, env-var-based credential plumbing is no longer needed for most
tools.

For canonical deploys: use **Cloud Shell from the GCP Console**, not
local `gcloud`. Cloud Shell is pre-authenticated, always current, and
avoids the per-workstation install drift between Nick box and cente box.
The deploy pattern in [`90_runbooks/`](90_runbooks/) (when written)
assumes Cloud Shell.

### Service account key (cente box only)

`C:\Users\cente\google-cloud-sdk\smartcity-agent-key.json`. Used for
CI-style non-interactive invocations. Should be rotated on a rolling
basis â no fixed schedule yet. When rotating: generate new key in IAM,
update file in place, revoke old key. Track in
[Outstanding](#outstanding).

### gh CLI authentication

Required for `gh pr create` from Cursor Claude Code agents. Status
as of 2026-05-06: complete on Nick box. Setup performed:

```
gh auth login              # GitHub.com, HTTPS, browser auth
gh auth setup-git          # wires git auth to gh credentials
git config --global credential.https://github.com.username empressaioemail-tech
gh auth status             # confirmed Active account: true for empressaioemail-tech
```

Without `gh` authenticated, agents fall back to manual PR creation
in the GitHub UI â friction Nick had earlier. Setup above resolves
it.

### Git auth pattern (Nick box, in flight)

**Current state:** HTTPS remotes plus Git Credential Manager prompts
asking which GitHub account to use, fires per repo. Slow; agent ops
hit it constantly.

**Target state:** SSH remotes so the prompt never fires. Equivalent to
how Nick's laptop already works.

Migration steps per repo:

```
git remote set-url origin git@github.com:empressaioemail-tech/<repo>.git
```

Verify SSH key is on the GitHub account first
(`https://github.com/settings/keys`). If staying on HTTPS for any
reason, pin GCM to one account:

```
git config --global credential.https://github.com.username empressaioemail-tech
```

Recommended path: SSH remotes + `gh auth login` (HTTPS or SSH; match
the choice for consistency).

## MCP server config

Cursor Claude Code reads MCP server config from a Cursor user-storage
path (varies by version; check Cursor's MCP docs for current location).
Each MCP server entry tells Cursor which tools to expose to agents.

**Currently configured:** none beyond Cursor defaults.

**Deferred wiring** (see [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md)
"What's coming next"):

- **Anthropic GitHub MCP** â gives Cursor agents read tools for GitHub
  repos including `doc_repo`. Land this once the seed doc set is stable.
- **Neon MCP** (post-Empressa-Neon migration) â schema introspection,
  branch ops, migration apply. Don't wire until migration completes;
  the Replit-managed Neons can't be accessed by an MCP that uses Neon
  Console auth.

When wiring: prefer per-workspace install over global so each Cursor
workspace gets only the MCPs it needs. The Cursor MCP config supports
both scopes.

## Doc_repo sibling clone pattern

Each workstation needs `doc_repo` cloned alongside the working repos so
Cursor Claude Code agents can read canonical docs at `..\doc_repo\` and
write session summaries to `..\doc_repo\_sessions\`.

One-time setup per workstation:

```
cd p:\           # or wherever the working repos live on this box
git clone git@github.com:empressaioemail-tech/doc_repo.git
# OR https://github.com/empressaioemail-tech/doc_repo.git
```

Per-session conventions:

- `git pull` in `doc_repo` at start of each working session (planner
  may have rolled up changes)
- Session summary append at end (per [`01_doc_conventions.md`](01_doc_conventions.md))
- Commit + push session summaries when wrapping; rollups happen
  separately

## Outstanding

Setup work pending across workstations. Each item should be closed
before assuming the workflow is fully wired. **Resolved 2026-05-06**
items struck through.

- ~~SSH remotes migration on Nick box â closes the GCM credential picker friction~~ â superseded 2026-05-06 by `gh auth setup-git` + `credential.username` pinning. SSH migration deferred indefinitely; current pattern works.
- ~~`gh auth login` on Nick box~~ â done 2026-05-06.
- **Cente box layout confirmation** â verify paths, install `doc_repo`, set up `gcloud` ADC, install `gh`, run `gh auth setup-git`. Pending until next on cente box.
- **Service account key rotation on cente box** â no fixed schedule; track in case it ages out
- **Anthropic GitHub MCP wiring** â once the seed doc set is stable
- **Cente box `gh` install + auth** â symmetric to Nick box
- **Devcontainer / Codespaces evaluation** â deferred until after the Cloud Run + Empressa Neon migration sprint completes; that sprint changes enough about the dev surface that devcontainer scope shifts

## What this document is NOT

Not the rules â see
[`20_agent_operating_rules.md`](20_agent_operating_rules.md). Not the
fleet structure â see
[`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md). Not credentials
themselves â those live in 1Password / Replit Secrets / GCP Secret
Manager, never in this repo.
