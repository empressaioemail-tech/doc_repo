## Mission — P-244 leg B: a declared wait is returned as an error

### The finding, measured on the live connector

P-240 made site-plan export asynchronous. The route now returns immediately with a job reference
instead of blocking past the client's abort. **But the MCP connector wraps that healthy, in-progress
state in an error envelope.** Measured 2026-09-16 on `export_instrument kind=siteplan` for
`48021:34049`, twice, same jobRef both times:

    {
      "raw": "Site Plan Export for 48021:34049 is still being generated
              (state: running, jobRef 5593f6a9-62bd-4405-9e4f-0108262b49b5).
              This is a declared wait, not a missing artifact -- retry this
              download in about 5000ms, or call refresh_parcel_site_plan_export
              again to wait for it to finish.",
      "status": "error",
      "reason": "upstream_error",
      "upstreamStatus": "unmeasured"
    }

**The envelope contradicts its own payload.** The message says, in its own words, *"This is a
declared wait, not a missing artifact."* The envelope says `status: error`, `reason:
upstream_error`, `upstreamStatus: unmeasured`. That is P-217's predicate exactly - a served payload
whose parts disagree.

### Why this matters more than it looks

**Every agent and every UI will read a healthy queued job as a failure.** An agent seeing
`status: error` will retry, give up, or tell a user the export broke - when the correct action is to
wait five seconds. P-240 fixed the timeout and this envelope re-introduces the same customer
experience one layer up: *the route reports a mechanism that did not happen.*

**P-240's own falsifier 4 required exactly this and it is the one that did not hold**: if a genuine
failure can still occur, the message must name the mechanism that actually happened.
`upstream_error` / `unmeasured` names neither a wait nor the real compose timeout (leg A).

### Three states, and they must not collapse

The job table carries `queued`, `running`, `ready` and `failed` (with an `error_class`). The
envelope must distinguish at least:

- **still working** (`queued` / `running`) - a declared wait, with the retry hint, and **not** an
  error;
- **done** (`ready`) - the artifact;
- **genuinely failed** (`failed`) - an error that names the real mechanism, carrying the job's
  `error_class` (for example `compose_timeout`) rather than a generic `upstream_error`.

`unmeasured` is wrong for all three: the state IS measured, it is sitting in the job row. **Absent,
zero and unmeasured are three different states**, and this envelope reports "unmeasured" for a
state that was measured.

### Repo

`hauska-mcp-server`. Serving `hauska-mcp-server-00098-rol` (P-237), deployed 2026-09-16. Cut from
`origin/main` after a fetch. **Also check whether `legacy-design-tools/artifacts/smartsite-mcp`
applies its own envelope on top** - the call the operator makes goes through the Smart Site
connector, and the envelope may be set in one or both. Trace the live call before editing; a
dispatch in this program has named the wrong repo more than once.

### Done looks like

A running job returns as a declared wait that no consumer would mistake for an error; a failed job
returns an error naming its real `error_class`; a ready job returns the artifact.

### Falsifiers, pre-register your answers before you run anything

1. **Produce all three states on the live path** and show each envelope. A fix demonstrated only on
   the happy path has not addressed the case that was reported.
2. **A failed job must carry its real `error_class`.** Use a job that genuinely fails - leg A's
   `compose_timeout` is a real one - and confirm the envelope names it rather than
   `upstream_error`.
3. **Enumerate every tool that can surface a job state**: flood-drainage and site-plan export at
   minimum, plus the poll-only tool P-240 added. A fix on one leaves the others lying.
4. **Delete your mapping and confirm a test goes red.**
5. If you find the envelope is set in the Smart Site server rather than here, say so and name the
   file. That is a result, and it may mean this leg belongs to a different repo.

### Known traps

- **Do not fix leg A here.** The compose timeout is hauska-engine's.
- **`hauska-mcp-server` auth is the `X-Hauska-Key` header, not Bearer**; a wrong header silently
  falls through to public rather than failing loudly.
- Gate enum is `public|codex|reporting|map`; legacy `cortex` normalises to `reporting`.
- **Read the job table to know the true state**, then check the envelope against it. The envelope
  is the thing under test, so it cannot also be the instrument.
- Read Cloud Run traffic BY FIELD, never a positional `--format=value`, and never trust
  `latestReadyRevisionName`.

### Do not

- **Do NOT edit anything in `legacy-design-tools`.** P-243 is executing in
  `legacy-design-tools/artifacts/smartsite-mcp` in the same window, and one repo has one writer.
  If you trace the envelope and find it is set there, **STOP, report the file and function, and
  close on that finding** - the integration seat will route the edit once P-243 releases the repo.
- Do not touch the engine's compose or its timeout (leg A).
- Do not make a wait look like success; it is not done yet.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Show the envelope for a running, a ready and a failed job, against the job row for each. Name every
tool you changed. State which repo actually sets the envelope. Declare `leave_behind` explicitly.
State your snapshot (repo, branch, commit).
