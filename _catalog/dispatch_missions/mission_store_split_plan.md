# Mission — plan the production store split. Do not execute it.

## What this card produces

A migration plan, a binding inventory, a breakage analysis and a reversal plan for
separating `neondb` and `hauska_mcp` onto their own computes in production.

**This card changes nothing.** It does not create, delete or reconfigure a branch or
endpoint, does not move a database, and does not touch a secret. Its output is a
document an operator can approve or reject, with the failure modes named.

**Nothing here executes during the Central Texas program.** The current arrangement
is slow and safe on a live production store.

## Why the split

Both databases sit on one compute:

```
project  fancy-fire-06136146  (cortex-prod, org Empressa, plan Scale)
branch   production = br-crimson-feather-aphfmy91  (default, created 2026-05-20)
compute  ep-lucky-truth-apodo8hr   .25 <-> 8 CU   suspend_timeout 0
```

So every operation against either database contends for one machine. The concrete
cost, observed 2026-08-31: lane A3 was a **pure read-only measurement** and had to
wait behind lane A1's containment write purely on compute share. That is measurement
queuing behind writing, and it is the shape that has slowed this program repeatedly.

Sizing is **not** the problem and this card does not propose scaling.
`.25 <-> 8 CU` autoscaling on a Scale plan already gives headroom, and the operations
log shows the production endpoint has no lifecycle events at all over three days.

## The precedent is already in the project

Staging **already separates them**:

```
f06-staging-neondb-1787860807438                  br-super-cloud-ap4ied3j        2026-08-27
f06-staging-hauska_mcp-planner-20260828T142734Z   br-billowing-queen-ap6npmua    2026-08-28
```

Both `.25 <-> 8 CU`, both idle. So this is applying an existing pattern to production,
not inventing an architecture. **Read how those were created and what binds them
before proposing anything for production.**

## The work

### 1. The binding inventory. This is the card.

**Enumerate everything that resolves to the production endpoint today.** For each,
name the file or the secret and what it would need to become after a split:

- every secret in every GCP project and every GitHub environment, by field name, not
  by tag
- every Cloud Run service and job template, and every workflow file that sets one
- every worktree `.env` shape and every CI env block
- the console, the MCP server, the engine, LDT, hauska-map
- anything reading `DATABASE_URL`, `SUBSTRATE_DATABASE_URL`, `CORTEX_DATABASE_URL`,
  `ATOMS_DATABASE_URL`, `STAGING_*` or a pooled variant

**A consumer you did not enumerate is the one that breaks.** The precedent is on the
record: A-022's branch cleanup checked hosts against one project's secrets only, missed
that LDT staging still bound `STAGING_ATOMS_DATABASE_URL` v4 to the deleted branch, and
produced a ten-minute outage plus two re-walks. **The trap surfaced only at the next
deploy that re-resolved `:latest`.** A binding can look dead and be live until
something redeploys.

### 2. What actually moves

Say precisely which database moves and which stays, and why. Moving `hauska_mcp`
(atoms, serve-heavy) off the primary is not the same decision as moving `neondb`
(landing, write-heavy), and the two have different consumers and different risk.

Name the mechanism: a new branch, a read replica, a separate project. Neon read
replicas and branches have different semantics for writes, lag and cost. **Do not
assume a branch is the answer because staging used one** — staging branches are cut
for isolation, not for load separation.

### 3. Breakage analysis

For each consumer, what breaks at the moment of the switch and what breaks later. Two
classes and they are not the same:

- **Immediate**: something that reads the endpoint on the next request
- **Deferred**: something that resolves a secret at deploy time and will not notice
  until it redeploys. These are the dangerous ones because the change looks clean for
  days.

Also name what a split makes **impossible**: any query that joins across the two
databases today. Find out whether any exists. If one does, the split is a bigger
change than it looks and that is a finding.

### 4. Reversal plan

Written before the change, not after. What is the exact sequence to put it back, how
long does it take, and what is lost if it is reversed after writes have landed on the
new compute. **A migration without a rehearsed reversal is a one-way door presented
as a two-way one.**

### 5. Cost and latency, measured not assumed

Report the current spend shape: 1,849 CU-hrs and 1,244 GB of network transfer since
Aug 1, against 311 GB of storage. Say what a second compute does to each.

While you are in there, note that Neon runs on **AWS us-east-1** and the Cloud Run
jobs run on **GCP us-east4**, so every query crosses providers, and a prior
measurement recorded roughly 1,077 ms round trip from `us-east4` to a Factory store.
**Chunked jobs are round-trip heavy by design**, so co-location may be worth more than
compute separation. Say which you would do first and why. That is a real finding even
though it is outside this card's title.

## Falsifier for your own plan

State, before you write the recommendation, **what evidence would make you recommend
against the split.** If no result would, it is advocacy rather than analysis.

Candidates: a cross-database join exists; the consumer count is large enough that the
deferred-breakage surface outweighs the contention; co-location would deliver more for
less; or the contention is smaller than assumed once measured rather than inferred.

## Do not

- Do not create, delete or reconfigure any branch, endpoint or project.
- Do not move a database.
- Do not change a secret, a workflow or a job template.
- Do not run a heavy store operation. Management-plane reads via the Neon CLI are
  fine; SQL is not, and a containment job may be live.
- Do not propose scaling; it is already `.25 <-> 8 CU` and that is not the problem.
- Do not schedule any of this inside the Central Texas program.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State your own falsifier before writing the
recommendation. Deliver the binding inventory as a table with a named owner per
consumer. `leave_behind` named. Subagents do not commit.
