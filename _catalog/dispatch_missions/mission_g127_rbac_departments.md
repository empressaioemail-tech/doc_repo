# MISSION — G-127: RBAC by department

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## SEQUENCING — read this before anything else

**This row is blocked on G-126 and must not start until G-126 has closed.**

G-126 fixes three cross-tenant leaks: one city's data reaching another city. This row is a
different layer — different *departments within one city* seeing different things. Building
role separation on top of a surface that still leaks across tenants produces a control that
looks like it works and does not.

If G-126 is not closed when you pick this up, stop and say so.

## What the operator asked for

Bastrop staff are getting logins. Development services, Public works, Police, Fire and EMS,
Fleet and Finance each have staff, and they should not all see each other's operational data by
default.

Two facts make this sharper than a normal permissions build, and both are verified:

**Work order free-text fields carry citizen names and personal phone numbers**, verbatim from
the v1 capture: `DEBORAH MOORE, PH#737-762-6252`, `CONTACT LISA BOE - CONTACT#: 504-401-1765`,
`REBECCA GARNER-LOZOYA - CONTACT#: 916-620-8091`.

**Code enforcement rows carry officer names and complaint addresses**, and business licence
applications carry citizen-authored grievances and payment histories.

So this is not only "who sees which dashboard". It is which staff member sees which resident's
name and phone number, in a system a city is accountable for.

## What this replaces

`plan-review` `src/actors.mjs` carries a hardcoded persona list. The operator's G-115 item-5
ruling accepted it explicitly as a pilot measure "scoped to a small named set of invited Bastrop
staff", with real tenancy and auth "separately tracked, revisited before any wider rollout".

**RBAC is what replaces that model, not what supplements it.** A department role layer bolted
onto a hardcoded persona list inherits every weakness of the list.

## Establish before you design

**Read the surfaces first.** `smartcity-dashboards` has fifteen destinations, six of which
carry department-scoped operational data; `plan-review` has its own persona model; `smart-files`
has `QA_PERSONAS` and a known gap — G-115's leave-behind records that Smart Files needs a
matching `bastrop_tx` entry before a Bastrop-persona file upload works. **Three products share
this problem.** Say whether the role model belongs in one place all three consume, or in each,
and defend the answer. Three drifting implementations of one rule is the failure mode this
operation keeps hitting.

**Ask what the departments actually are.** Do not infer the roster from the lens list. The lens
list is a product decision; the department roster is Bastrop's org chart, and they differ. If
you cannot establish the real roster, say so and build against a named provisional list rather
than a guessed one.

**Establish the default.** Deny-by-default with grants, or allow-by-default with restrictions.
Only the first fails closed. If you propose the second, justify it explicitly — the standing
posture here is that a control which cannot refuse is not a control.

## Design constraints

**Fail closed.** An unknown role, an unrecognised department, a missing claim: refuse. Never
default to the broadest view, and never default to the narrowest silently either — a refusal
states its basis.

**Refusals are typed, never blank.** A staff member denied a record sees that a record exists
and that they are not entitled to it, with a named reason. A silent empty list is
indistinguishable from "no records", and that ambiguity is exactly what this operation's
enforcement doctrine forbids.

**The type carries the constraint where it can.** A discriminated union the compiler enforces
at every consumer has no trigger to be missing and no call site to be absent. Prefer that over
a runtime check that something must remember to call.

**One enforcement point per product surface.** If the same rule is implemented in a route guard
and again in a renderer, they will drift. Where two implementations are unavoidable, write the
divergence test that fails when they disagree.

## The three-question gate — answer these in your close

1. **What executes this?** A middleware, a query filter, a type. Not "the operator reviews".
2. **What triggers it?** Every request, every render, compile time.
3. **What fails when it is violated, and is that thing running in production?**
4. **What bypasses it?** Name the paths that reach the same data without passing the control —
   a raw query, an export route, an MCP tool, a cached response, a log line. The answer is
   rarely none.

## Method

Verify by violation in both directions: a department persona is refused another department's
records, and still succeeds on its own. Pre-register the falsifier before each check.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the
same observation and why you rejected it.

Never print secret VALUES. Env var names only. Every command exit-bounded (`timeout 120 ...`).

## Out of scope

Cross-tenant isolation (G-126 — must already be closed). The v1 regression (G-122). Anything in
`smartcity-os` beyond reading.

## Close

If the right answer is that this needs an operator ruling before it can be built — on the
department roster, on where the role model lives, on deny-versus-allow — **say that and stop**,
rather than picking one and building it. A permissions model chosen by an agent and discovered
later by the operator is worse than a day of delay.

Write your close to `_inbox/2026-09-14_g127_rbac_close.json`, including the four gate answers
above and the full bypass enumeration.
