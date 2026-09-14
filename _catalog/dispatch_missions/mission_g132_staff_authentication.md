# MISSION — G-132: staff authentication, a person not a persona

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## What is true today, verified

No product in this portfolio can identify an individual.

`smartcity-dashboards` resolves which **city** a request is for and never which **person**.
`plan-review` and `smart-files` each carry exactly ONE Bastrop persona, literally labelled
"Development services staff", that every staff member of every department would share. The two
routes serving PII-bearing data (`/api/domains/:id`, `/api/city-domains`) are gated on city-tenant
membership alone.

That was established by G-127, which returned **blocked** rather than building a role layer with
nothing to attach a role to. Read `_inbox/2026-09-14_g127-rbac_close.json` first — it has the
source lines.

**Consequence the operator needs delivered, not just built:** "give Bastrop staff logins"
currently means handing every department one shared account. This row is what makes that
sentence true.

## The ruling you are implementing

`_decisions/2026-09-14_staff_identity_and_department_rbac.md`, ruling 1:

> A managed provider (WorkOS or Clerk class), configured **SSO-first against the city's own
> identity system**, with magic link as the fallback for anyone without a city account.

**The deciding argument was offboarding, and it is your acceptance test.** A staff member leaves,
the city disables their account, and access ends across all three products immediately without
anyone telling us. Under our own accounts somebody has to remember, three times. For a customer
whose data carries citizen names and phone numbers in free-text fields, that is the control.

Do not substitute a different mechanism because it is faster to stand up. If you believe the
ruling is wrong, say so in your close and stop — do not quietly build the easier thing.

## Scope

**In:** the identity layer for `smartcity-dashboards`, `plan-review` and `smart-files` — one
identity across all three, not three integrations.

**Out:** the role model and department gating (G-127, blocked on this row). Cross-tenant
isolation (G-126, closed — do not re-open it). The persona lists themselves, beyond what must
change to accept a real identity.

## What it must do

**One identity, three products.** A staff member signs in once and is the same person in all
three. If your design produces three separate integrations, stop and report — that is the thing
this row exists to avoid.

**Carry a `role` claim.** G-127 reads it. The role vocabulary is the nine lenses per ruling 2;
you are not defining roles here, but the claim must exist and be readable so G-127 is not blocked
again on the shape of the token.

**Reach the MCP surface.** If identity stops at the UI, the door around it is open. Establish
how the MCP path receives the same identity and say so, or name it as an explicit gap with its
consequence stated.

**Fail closed.** No identity, an unknown issuer, an expired or malformed token: refuse. Never
fall back to the shared persona, and never fall back to a tenant-only resolution — that is the
exact state this row is removing.

**Typed refusals.** A refused request states that it was refused and why. A silent empty
response is indistinguishable from "no records", which this operation's doctrine forbids.

## The anonymous path is load-bearing — do not break it

`template-city` is public-free and must keep serving anonymously. An anonymous caller currently
gets fixtures on `template-city` and 401 on every `bastrop_tx` route, and both halves must still
be true after this lands. **Verify both directions**, not just that signed-in users can get in.

There is also existing anonymous data in the products. Do not orphan it: establish what exists
under the current anonymous or shared-persona path and what happens to it when real identities
arrive. If a claim flow is needed, name it — do not silently strand records nobody can reach any
more.

## Snapshot

Three repos: `smartcity-dashboards`, `plan-review`, `smart-files`. Local checkouts have been
badly stale this week — `smartcity-dashboards` was 43 commits behind on 2026-09-14. Fetch each
and work from current `origin/main`. Declare repository, branch and commit SHA for each in your
first output line. Work on your own branch in your own worktree, per repo.

## The calendar dependency — raise it early, do not sit on it

SSO requires **Bastrop IT to configure their side**. That is a dependency on the customer, not on
us, and it is likely the long pole on this whole row.

**Establish what they need from us and report it in CP1, not at close.** What their IdP is
(Microsoft Entra and Google Workspace are both common in Texas municipalities — find out rather
than assume), what metadata or redirect URIs they must register, and who at the city does it. The
operator can start that conversation in parallel with your build, but only if you surface the
requirement early.

If SSO cannot be configured in a useful timeframe, the magic-link fallback is the path to a real
per-person identity meanwhile — build so that switching to SSO later does not re-issue everyone's
identity.

## Method

**Verify by violation, both directions.** Disable an upstream account and confirm access ends in
all three products; confirm a valid account still works. A control observed only permitting has
not been observed working.

Pre-register the falsifier before each check.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

**Never print secret VALUES.** Env var names only. This row handles credentials; that rule is not
decorative here.

Every verification command exit-bounded (`timeout 120 ...`).

## If this needs an operator ruling, stop and say so

The mechanism is ruled. The provider choice within that class, and anything about cost, is not.
If you hit a decision the ruling does not cover — pricing tier, where identities are stored, what
happens to a staff member who is in the directory but has no lens role — **name it and stop**
rather than choosing. An identity model chosen by an agent and discovered later is worse than a
day of delay.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the offboarding violation test in both directions across all three products; what Bastrop
IT must do and who does it; how the MCP surface receives identity or why it does not; the
anonymous `template-city` path verified still working; and what happened to any pre-existing
anonymous or shared-persona data.
