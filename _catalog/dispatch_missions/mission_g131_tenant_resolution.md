# MISSION — G-131: one rule, three implementations, and a magic number that already moved

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## What G-126 found, read-only, and did not fix

`PLATFORM_INTERNAL_API_KEY` **binds to no tenant at all.** It is ONE shared bearer secret gating
all twelve `/api/platform/*` routes uniformly. It authenticates a caller; it says nothing about
which city that caller may read.

Behind it, tenant resolution takes **three different shapes**:

- **Five routes** do a robust name-based lookup.
- **`property-intel/summary`** uses a **bare numeric literal**, and **it feeds a real SQL filter.**
- **Five vendor routes** have no tenant concept whatsoever.

Three implementations of one rule, in a live multi-tenant application.

## Why the literal is the sharp end, not the elegant end

That numeric literal **has already been silently bumped once by an unrelated commit** — `0e5c41e`,
2026-04-05, *"manager-load uses work_order_managers roster, DEFAULT_TENANT_ID 1→2"*. A value that
decides which city's rows a SQL filter returns, changed as a side effect of a change about
something else.

It did not cause harm because the upstream has one tenant. **That is luck, not design.** The same
class of edit can move it again tomorrow, and the failure mode is a live customer seeing a
different city's data, or none.

**Prioritise the literal.** The three-way convergence is the more satisfying fix and the less
urgent one.

## THIS IS LIVE PRODUCTION NOW — the posture changed since the row was written

The operator ruled a **soft launch** on 2026-09-15: Bastrop staff work in v2 while **v1 keeps
running behind it as the data backend** (`_inbox/2026-09-15_bastrop_cutover_WDLL.md`).

So `smartcity-os` is not a legacy system awaiting retirement. **It is permanent infrastructure
serving a real customer**, and changes there carry customer risk rather than hygiene risk.

G-122 just demonstrated exactly how connected this surface is: a **one-line** fix in a shared
parcel-lookup query repaired both the v1 staff route and v2's platform routes at once. The blast
radius of anything you touch here is both products.

## Authorisation and the seat boundary

`smartcity-os` is under ABSOLUTE NO-TOUCH in `_catalog/repo_intents.md`, with a **narrow recorded
exception** for platform-internal read endpoints and two later operator-authorised engagements.
That file now records the exception and its boundary — read it.

This row is authorised for the tenant-resolution defect and nothing else. **Anything else you find
gets reported, not fixed.**

## What to establish before you change anything

**1. What each of the twelve routes actually resolves.** Name them in three groups with the file
and line. G-126 counted five, one and five — **verify that count rather than inheriting it**, and
say if it is wrong.

**2. What the literal's correct value is derived from**, and whether a derivation exists anywhere
in the codebase already. If the name-based lookup the other five routes use can serve this route,
the fix is to use it rather than to invent a fourth thing.

**3. What the five tenant-blind vendor routes actually return.** No tenant concept may mean they
are genuinely single-tenant upstream (Samsara, Spireon, FirstDue, PowerBI, GoTo are vendor
integrations that may have no per-city dimension at all), or it may mean the dimension exists and
is being ignored. **Those are very different findings** and the second is a leak waiting for a
second city.

## What to deliver

**The literal replaced by a resolved binding** — the same mechanism the name-based routes use, not
a fourth implementation.

**Either one resolution path, or a divergence test that fails when the implementations disagree.**
Convergence is better. If convergence is not safe to do in one pass on live production — a
defensible position — then the test is the deliverable, and it must be **proven able to fire** by
making two implementations disagree in a fixture and watching it go red.

**A stated answer on the vendor routes:** genuinely dimensionless, or ignoring a dimension.

**Do NOT change the key's own shape.** Binding `PLATFORM_INTERNAL_API_KEY` to a tenant is a
larger design decision touching every consumer, and v2 reads all twelve routes with it. Name what
it would take; do not do it here.

## Method

**Verify by violation.** A request naming a second tenant is refused or correctly scoped, not
silently served the first tenant's rows. A resolution observed only returning Bastrop has not been
observed resolving.

**Pre-register the falsifier** before each check. State what result would prove the fix inert.

**ENUMERATE BEFORE ASSERTING ABSENCE.** Say what you searched. And note the lesson from G-133:
three lanes enumerated correctly and their boundary was the seat boundary — so **say which repos
and seats your enumeration covered and which it did not.**

**Read the authoritative record, never a proxy.** Cloud Run traffic by JSON field name, never a
positional `value()` formatter.

Never print secret VALUES. Env var names only.

Every verification command exit-bounded (`timeout 120 ...`).

## Coordinate

G-122 closed 2026-09-15 and touched the shared parcel-lookup query in this repo. **Read its close
first** (`_inbox/2026-09-14_g122-v1-regression_close.json`) — it names related-but-out-of-scope
findings that may overlap yours.

If another lane is live on `smartcity-os` when you start, do not both edit the auth or resolution
path.

## Out of scope

Binding the platform key to a tenant. The v1 session-cookie gate (working as designed, G-133).
Credential distribution (G-135). The external-schema fragility (G-136). RBAC (G-127).

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**. **Smoke every
one of the twelve platform routes before shifting** — v2 reads all of them and a regression here
takes both products down.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the twelve routes in their three groups with file and line, and whether G-126's count of
5/1/5 held; what the literal was replaced with; the violation test showing a second tenant is
refused or correctly scoped; whether you converged or built the divergence test, and if the latter,
the evidence it can fire; the plain answer on the vendor routes; and what your enumeration covered
and did not.
