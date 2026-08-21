## Mission — R-03: parts inventory, and the termination condition

You are a PLANNER. You fan workers, you adversarially review what they hand back, and you
assemble the result yourself. You do not commit.

### The question this row exists to answer

The operator can start a factory and has no defined way to end one. That observation
generalises: **this operation knows how to create parts and does not know how to retire
them.** So the inventory is not a list of what exists. It is a list of what exists together
with what would ever stop it.

Every part gets a TERMINATION CONDITION. A part without one is not a finding to soften, it is
the finding, and it is quarantined in R-02's sense: named, not deleted.

### Work in your own worktree

`git worktree add --detach P:/tmp/r03-parts P:/doc_repo`. Four lanes run against this repo
simultaneously. Declare the commit you got.

**Read-only against every product repository.** Product repos have one owning seat and you
are not it. Read them, never write them. `_catalog/seat_register.json` says who owns what.

### What counts as a part

Anything that runs, serves, stores, or scores. At minimum, and this list is a floor not a
ceiling:

Factories and writers: the statewide fabric factory, the jurisdiction depth factory, Factory
1.5, every `write-*-county` writer, every scorer CLI.

Deployed services: cortex-api, engine-api, hauska-mcp-server, smartcity-dashboards,
smart-files, icc-portal, the Vercel apps (property-explorer / SmartSite, command-center /
cmdcenter, hauska-map), plan-review.

Instruments and consoles: the County Manifest / county-ledger, Command Center, the serving
sweep, the cert frame, the coverage ledger.

Stores: `hauska_mcp.atoms`, `atom_links`, `neondb.txgio_parcel`, `place_layer_snapshots`,
`county_facet_coverage`, `knowledge_atoms`, the tx_* staging tables, and any store you find
that nothing named.

Controls: the eight in `.github/enforcement-baseline.json`, the hooks in `.claude/hooks/`,
`.cursor/hooks/`.

Background jobs, leases, heartbeats, and detached runners. `_STATE.md` names several.

### Per part, these fields, none omitted

    name
    kind                factory | service | instrument | store | control | job | app
    repo / path
    owningSeat          from _catalog/seat_register.json, or UNASSIGNED
    purpose             one sentence, what it is FOR
    status              LIVE | IDLE | DORMANT | ZOMBIE | UNKNOWN
    evidenceOfStatus    how you established it, with a timestamp
    consumers           what reads or depends on it
    terminationCondition   what would make this correctly stop existing
    successorIfRetired  what takes over, or NONE
    lastObservedRunning  timestamp + how observed

**ZOMBIE has a specific meaning here**: it runs, or could run, and nothing consumes its
output. That is different from DORMANT, which has no trigger. Both differ from IDLE, which is
deliberately paused. Do not collapse them. The estate already contains a worked example:
`tier2` flood was retired correctly and no consumer was repointed, so the successor serves
nothing while the predecessor is gone.

### Status must be established, never assumed

A part named in a doc is not a running part. `_STATE.md` records a scoreboard loop PID as
dead and a lease PID as live; both are claims about a moment. Establish LIVE by a live probe
with a timestamp: an HTTP request, a `gcloud run services describe`, a process check, a query.
State the probe.

`code-done != customer-done` is a standing decision here. A merged PR is not a running part.

### Fan discipline

Split by KIND, not by repo, so two workers never write the same row and each develops a feel
for one class.

Adversarially review every return. When a worker says a service is LIVE, ask for the probe and
its timestamp. When a worker offers a termination condition, ask what would execute it: a
termination condition that reads "when we decide to" is NONE with extra words, and should be
recorded as NONE.

Workers do not spawn workers. Workers do not commit. You do not commit.

### Scope fence

No product code. No deploys. No writes to any store. No migrations. Read-only everywhere
outside your own doc_repo worktree.

If you find a running part that looks wrong or dangerous, you record it. You do not stop it.

### Return

`_catalog/parts_inventory.json` and `_catalog/parts_inventory.md`, uncommitted in your
worktree, plus a close naming: the commit you worked at, the count by kind and by status, and
**the list of parts with no termination condition**, which is the row's actual output.

Also name explicitly: any part you could not establish a status for, and why. UNKNOWN is an
honest answer and must never be rounded to LIVE or to DORMANT.

Tier 2 scratch to `_scratch/r03_parts.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
