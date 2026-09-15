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

`_decisions/2026-09-14_staff_identity_and_department_rbac.md`, ruling 1, **amended twice on the
day it was made**. Read the record, not a summary — both reversals matter and the reasoning is
load-bearing.

> **SmartCity admin provisions every staff account and issues the credentials.** No city IT, no
> city-manager invites, no self-registration. A managed provider holds the credentials so we never
> store password hashes for a government customer, but every user is created and every role
> assigned by us through its admin API.

**What was tried and rejected, so you do not re-propose either.** SSO against the city's identity
system was the first ruling and was reversed on the principle *"we should not be asking cities to
configure anything"* — SSO requires them to register an application, which is a configuration ask
however it is framed, and it breaks the cost-per-jurisdiction commitment. Domain-restricted magic
link with city-manager invites was the second proposal and was reversed because an invite UI is
still a thing a customer has to learn and operate.

**The city does nothing.** That is the test. If any part of your design requires an action by
anyone at Bastrop — IT, the city manager, or a staff member beyond signing in with credentials we
gave them — it fails the ruling.

## What to build

**Use a managed provider's admin API. Do not build auth.** "We control the users" does not mean
"we store credentials." The provider holds password hashes, reset flows and MFA; we hold the
admin authority. Turn self-registration OFF — every account exists because we created it.

**MFA on.** These accounts reach citizen names, phone numbers and complaint addresses.

**One identity, three products.** A staff member signs in once and is the same person in
`smartcity-dashboards`, `plan-review` and `smart-files`. If your design produces three
integrations, stop and report — avoiding that is why this is one row.

**Carry a `role` claim.** G-127 reads it. The vocabulary is the nine lenses per ruling 2; you are
not defining roles here, but the claim must exist and be readable so G-127 is not blocked a second
time on the shape of the token.

**Reach the MCP surface.** If identity stops at the UI, the door around it is open. Establish how
the MCP path receives the same identity, or name it as an explicit gap with its consequence
stated.

**Fail closed.** No identity, unknown issuer, expired or malformed token: refuse. Never fall back
to the shared persona and never fall back to tenant-only resolution — that is the exact state this
row removes.

**Typed refusals.** A refused request says it was refused and why. A silent empty response is
indistinguishable from "no records".

## Two operational obligations the ruling creates — build the surface for them

The ruling accepts a known cost knowingly, and your job is to make it operable rather than to
re-argue it.

**Offboarding is now OURS.** Under SSO it was automatic. Under this, the city tells us someone
left and we act. That needs a real path: a documented way to disable an account and an instrument
that shows it took effect across all three products. **Verify by violation** — disable an account,
confirm access ends in all three, confirm a live account still works.

**Sylvia must be able to SEE who has access without managing it.** The **People and access** lens
already exists in the nav marked NOT BUILT. Make it the access review surface: **read-only for the
city manager, administered by us.** She sees everyone with access to her city's data at any time.
This is the reconciliation the ruling names explicitly; it is in scope.

## The anonymous path is load-bearing — do not break it

`template-city` is public-free and must keep serving anonymously. An anonymous caller currently
gets fixtures on `template-city` and 401 on every `bastrop_tx` route. **Both halves must still be
true afterwards, and you verify both**, not just that signed-in users get in.

Establish what data exists under the current anonymous or shared-persona path and what happens to
it when real identities arrive. If a claim flow is needed, name it — do not silently strand
records nobody can reach any more.

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
happens to a staff member we provision who maps to no lens role — **name it and stop**
rather than choosing. An identity model chosen by an agent and discovered later is worse than a
day of delay.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the offboarding violation test in both directions across all three products; the
documented path for disabling an account and the instrument that shows it took effect; how the
MCP surface receives identity or why it does not; the anonymous `template-city` path verified
still working in both directions; what happened to any pre-existing anonymous or shared-persona
data; and confirmation that NOTHING in your design requires an action by anyone at Bastrop.
