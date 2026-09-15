# MISSION — G-134: wire WorkOS and put real Bastrop staff on v2

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## This is the critical path for the soft launch

`_inbox/2026-09-15_bastrop_cutover_WDLL.md` names exactly one hard blocker on getting Bastrop
staff onto v2: **real per-person identity.** This row is it. Everything else on the phase-1 path is
small or already shipped.

Today **every department signs in as one shared persona** labelled "Development services staff."
That is not a login, it is a shared account: no audit trail, no offboarding, and no way to answer
*"who looked at that citizen's record."* For a government customer's system carrying citizen
names, phone numbers and complaint addresses, that is the thing that cannot ship soft.

## What already exists — do not rebuild it

G-132 CLOSED-PARTIAL 2026-09-14, deliberately stopping where an operator ruling was needed.
**Read `P:/seat-worktrees/govtech/doc_repo/_inbox/2026-09-14_g132-staff-auth_close.json` first.**
Its work is uncommitted in that seat's worktree — **land it rather than redoing it.**

- The verifier is built, tested and **provider-agnostic by construction** — standard OIDC
  discovery plus JWKS, so a compliant provider works with **zero code change**, configuration only.
- `src/staff-directory.mjs` carries `upsertStaffAccount` / `disableStaffAccount`.
- `GET /api/people-and-access` is built and tested.
- **812/812 tests passing** across the repos it touched.

## The ruling you are implementing

`_decisions/2026-09-14_staff_identity_and_department_rbac.md`, ruling 1, **amended twice on the
day it was made** — read the record, both reversals matter.

> **SmartCity admin provisions every account and issues the credentials.** No city IT, no
> city-manager invites, no self-registration. A managed provider holds the credentials so we never
> store password hashes for a government customer; every user is created and every role assigned
> by us through its admin API.

**Provider: WorkOS.** Operator ruling 2026-09-14.

**The city does nothing.** That is the test. If any part of your work requires an action by anyone
at Bastrop — IT, the city manager, or a staff member beyond signing in with credentials we handed
them — it fails the ruling. SSO was the first ruling and was reversed on *"we should not be asking
cities to configure anything."*

## Scope — the four gaps that block a soft launch

G-132 named five build gaps. **Four are yours. One is not.**

**GAP 1 — the provisioning client.** A `staff-admin-client.mjs` that actually calls WorkOS to
create users, assign MFA and issue credentials, feeding the existing
`upsertStaffAccount`/`disableStaffAccount`. Self-registration **off**. MFA **on**.

**GAP 4 — `smart-files` carries the verifier and no route consumes it.** The pattern to mirror is
already written: `plan-review`'s `src/actors.mjs` `staffEngagementRefusal` plus `src/server.mjs`
`resolveStaffCaller`. Mirror it; do not invent a second shape.

**GAP 5 — no sign-in UI, and no People and access lens.** Staff cannot sign in without the first.
The second is Sylvia's access-review surface — **read-only for the city manager, administered by
us** — and its read API already exists. Build sign-in first; the lens may follow in the same row.

**GAP 3 — offboarding is TTL-bounded, not instant**, in `plan-review` and `smart-files`, because
they share no revocation store with `smartcity-dashboards`.

**Gap 3 needs a judgement, so make it explicitly and state it.** Offboarding was the deciding
argument for this whole ruling, so "TTL-bounded" is not automatically acceptable. **Report the
actual TTL.** If it is minutes, say so and argue it is adequate for a soft launch with a small
named cohort. If it is hours, say that plainly — a disabled staff member holding a working session
for hours is not what the operator was promised. Either way the close states the number and the
verdict, and does not round it off.

**NOT YOURS — GAP 2.** `hauska-mcp-server` does not accept the staff bearer. That repo is
OPS-19/OPS-23 territory. Report it; do not touch it.

## THE SEQUENCING THAT PROTECTS LIVE STAFF

G-132 deliberately did **not** cut the `QA_PERSONAS` / `x-persona` mechanism, and its reasoning is
correct: cutting it before a real provider account exists **would take live Bastrop staff access
to zero with no replacement credential in hand.**

So the order is not negotiable:

1. WorkOS wired and provisioning working.
2. **Real accounts provisioned and verified signing in** — at least one real Bastrop staff member.
3. **Only then** retire the shared persona.

If you reach step 3 and step 2 has not been confirmed by a real person, **stop.** Leaving the
persona in place for another day is free; removing it early is an outage for a customer.

## Requirements

**One identity, three products.** A staff member signs in once and is the same person in
`smartcity-dashboards`, `plan-review` and `smart-files`. Three integrations is the failure this
row exists to avoid.

**Carry the `role` claim.** G-127 reads it. The vocabulary is the nine lenses; **you are not
building enforcement** — make the claim exist and be readable.

**A provisioned staff member with no lens role sees the Overview shell only**, with a typed
refusal naming the missing role. Operator ruling 2026-09-14. Fails closed, and stays visible so a
half-provisioned account is noticed.

**Fail closed.** No identity, unknown issuer, expired or malformed token: refuse. **Never fall
back to the shared persona** and never fall back to tenant-only resolution.

**Typed refusals.** A refused request says it was refused and why. A silent empty response is
indistinguishable from "no records."

## The anonymous path is load-bearing — verify both directions

`template-city` is public-free and must keep serving anonymously. An anonymous caller gets
fixtures on `template-city` and 401 on every `bastrop_tx` route. **Both halves must still be true
afterwards**, and you verify both — not only that signed-in users get in.

## A known verification wall

Three lanes have failed to verify authenticated `bastrop_tx` behaviour for want of a product key.
**G-133 is a live recon into why.** If you hit the same 401, cite G-133 and verify what you can
rather than burning the row chasing a credential — but note that **this row is the one that most
needs real authenticated verification**, so if G-133 has closed, read it first.

## Method

**Verify by violation, both directions.** Disable an account at WorkOS, confirm access ends in all
three products, confirm a live account still works. A control observed only permitting has not
been observed working.

Pre-register the falsifier before each check.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

**Never print secret VALUES.** Env var names only. This row handles credentials and that rule is
not decorative here.

Every verification command exit-bounded (`timeout 120 ...`).

## If something is not covered by the ruling, stop and say so

The mechanism and the provider are ruled. Pricing tier, where identities are stored, and what a
staff member without a lens role may reach are not all settled. **Name it and stop** rather than
choosing. An identity model chosen by an agent and discovered later is worse than a day of delay.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the offboarding violation test in both directions across all three products; **the actual
token TTL as a number and your verdict on whether it is adequate**; whether a real Bastrop staff
member signed in and was confirmed by a person; whether the shared persona was retired and if not
why not; the anonymous `template-city` path verified both directions; and confirmation that
nothing in your work requires an action by anyone at Bastrop.
