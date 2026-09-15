---
decision_id: 2026-09-14_staff_identity_and_department_rbac
date: 2026-09-14
owner: nick
status: active
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified,
    _inbox/2026-09-14_g127-rbac_close.json,
    _inbox/2026-09-14_g126-tenant-isolation_close.json,
  ]
---

# Decision

Three rulings, made 2026-09-14, unblocking OPS-17 G-127.

**1. SmartCity admin provisions every staff account and issues the credentials.** No city IT, no
city-manager invites, no self-registration. A managed provider holds the credentials so we never
store password hashes for a government customer, but every user is created and every role assigned
by us through its admin API. *(AMENDED 2026-09-14, twice — see Ruling 1.)*

**2. The department roster is the nine lenses.** Not the city's directory, not the ~25
departments in Bastrop's budget. The product's own lens roster is the role vocabulary.

**3. The role is a claim on the identity; the enforcement code is one shared package** across
`smartcity-dashboards`, `plan-review` and `smart-files`.

Deny-by-default was not a ruling. It is the only option that fails closed and it stands.

## Context: what forced these

G-127 was dispatched to build department RBAC and came back **blocked, correctly**. The
investigation found something larger than the row:

**There is no per-staff identity anywhere in the portfolio.** `smartcity-dashboards` resolves
which *city* a request is for and never which *person*. `plan-review` and `smart-files` each
carry exactly one Bastrop persona — literally labelled "Development services staff" — that every
staff member of every department would share. The two routes serving PII-bearing data
(`/api/domains/:id`, `/api/city-domains`) are gated on city-tenant membership alone.

So a role layer had nothing to attach a role to. The lane stopped rather than building a
permissions model an agent had chosen, which is what its own mission told it to do.

**This also corrected a standing assumption.** "Ready to give staff logins" meant, in fact,
handing every department the same shared account. G-115's item-5 ruling accepted the persona-list
model "scoped to a small named set of invited Bastrop staff" — there was no set. There was one
persona.

## Ruling 1 — authentication, amended twice on the day it was made

**Final: SmartCity admin provisions every account and issues the credentials.**

### What it replaced, and why each fell

**First ruling: SSO against the city's own identity system.** Chosen on the offboarding
argument — the city disables one account and access ends everywhere without anyone telling us.

Reversed the same day by the operator: **"we should not be asking cities to configure
anything."** That is a product principle beyond this decision. If every city needs an IT project
to onboard, cost-per-jurisdiction blows up and the onboarding machine is not a machine. That is
commitment 3, not a preference. SSO requires the city to register an application on their side;
it is a configuration ask however it is framed.

**Second proposal: domain-restricted magic link with city-manager invites.** Zero city IT, but
still asked Sylvia to run an invite flow.

Reversed by the operator: **"we (smart city admin) need to control the users. we should set them
up and provide login creds."** Right for a reason the planner did not surface — an invite UI is
still a thing a customer has to learn and operate, and at pilot scale it buys nothing over us
just doing it.

### What we build

We create every account. We assign every role. We hand over the credentials. Self-registration
is off. The city does nothing.

**Use a managed provider's admin API rather than building auth.** "We control the users" does not
require "we store credentials." The provider holds password hashes, reset flows and MFA; we hold
the admin authority. This keeps the operator's control total and keeps us out of being a
credential custodian for a government customer in the dangerous sense.

**MFA is on.** These are government staff accounts reaching citizen names, phone numbers and
complaint addresses.

### What this costs, named rather than argued

**Offboarding becomes ours, and it is now a process rather than a property.** Under SSO it was
automatic and instant. Under this it depends on the city telling us and us acting. That needs a
named owner and a stated turnaround, or it will be discovered as a gap after a staff member
leaves. **This is the real cost of the ruling and it is accepted knowingly.**

**It does not scale past a few cities without becoming a job.** Fine at pilot scale, and it
should be revisited at a named threshold rather than when it hurts.

### Reconciliation: Sylvia sees, we control

The **People and access** lens — already in the nav, marked NOT BUILT — becomes the access
review surface: **read-only for the city manager, administered by us.** She can see who has
access to her city's data at any time without being asked to manage it. That answers the
legitimate half of the invite proposal without handing the customer an operational burden.

## Ruling 2 — the roster is the nine lenses

Operator ruling, against the planner's recommendation to take the roster from the city's
directory. Recorded as such.

The planner's case was that Bastrop's budget names ~25 departments and their directory maintains
them currently, so an authored roster goes stale. The operator's call is the nine lenses, which
is simpler, is the vocabulary the product already speaks, and does not make identity depend on a
city IT integration delivering a department attribute.

**Reversal criterion:** if a real Bastrop department cannot be served because its staff do not
map onto any lens, revisit. The likely candidates are Utility Billing, Municipal Court and City
Secretary, none of which has a lens today.

### Two things the nine-lens roster does not cover, resolved here rather than deferred

**Two of the nine are not departments.** Overview is the cross-department roll-up and Citizen is
public-facing. Neither is an org unit. So the department roles are the **seven** that are:
Development services, Finance, Public works, Parks, Police, Fire and EMS, Fleet. Overview is
visible to every staff role and **shows only the lanes that role is entitled to** — which is what
makes it a roll-up rather than a leak. Citizen is not role-gated at all.

**Somebody has to see across departments, and it is the customer who asked for this.** Sylvia
Carrillo is the city manager. The flood study request is itself cross-departmental. A pure
seven-department model cannot serve her.

So the role set is: **seven department roles, plus `city-manager` which sees all lanes, plus
`admin` which additionally reaches People and access.** Three tiers, not one flat list.

The Work and City lenses are not departments either and are ruled here: **Plan review** is gated
to Development services and city-manager; **Files** and **Records search** are cross-cutting and
visible to any staff role; **Assets** and **Connections** are visible to any staff role; **People
and access** is admin only.

## Ruling 3 — the role lives on the identity, enforcement lives in one package

The role is a **claim on the token**. The role belongs to the person, not to the product, so one
source serves all three products with no network hop and no "what happens when the authorization
service is down" question — which always resolves to fail-open under pressure.

A claim alone would leave three products each interpreting it, which drifts. So the enforcement
**primitives** — the guard, the typed refusal shape — live in ONE shared package consumed by all
three, with a **divergence test that fails when the implementations disagree**.

The precedent is in the portfolio and works: `web/sc-kit.css` is byte-identical across these
exact three repos, and its own header states that a repo which edits a token value has forked the
system. Same three repos, same discipline.

## Sequencing

Authentication blocks everything. Rulings 2 and 3 are decided but not buildable until a person
can be identified.

1. **G-132** — staff authentication. New row, blocks G-127.
2. **G-127** — department RBAC, now unblocked by these rulings, still gated on G-132.

## Structural commitment check

**Sell reasoning, not data.** A refusal is typed and states its basis; a staff member denied a
record learns that a record exists and that they are not entitled, never a silent empty list.

**Confidence is earned.** Not engaged.

**Cost per jurisdiction.** The nine-lens roster is the same in every city, so city two needs no
new role vocabulary. This is the ruling's main advantage over the directory approach and it is
real.

**Dual interface.** The role claim must reach the MCP surface too, or the door around the UI is
open. Named for G-127.

**Tenant sovereignty.** This is the layer above G-126's cross-tenant isolation, which closed
2026-09-14. One city's staff still cannot reach another city's data; this adds who within a city
reaches what.
