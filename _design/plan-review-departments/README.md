# Plan Review — parallel department review

**Artifact:** https://claude.ai/artifact/SMY4zWUK14XcgUGxAQgBFV
**Continues:** `_design/plan-review-reasoner/` — same product, same finding numbering, same
three real citations. That folder pinned parallel review; this is the argument.
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. **G-144 STILL BLOCKS THE BUILD:** the role-gate amendment is DEFERRED, so departments other than Development services cannot reach the surface. **No longer blocked as a question:** the
role-gate amendment was DEFERRED 2026-09-15 with a trigger,
`_decisions/2026-09-15_plan_review_role_gate_deferred.md`. This design may be shown. It cannot be
built until the gate is amended, which is owed before launch.

Five artboards: routing, one department's scope, the board, a department conflict, the
consolidated notice.

## It needs a ruling amended, and that is the first thing to decide

`_decisions/2026-09-14_staff_identity_and_department_rbac.md` gates **plan review to
Development services and city-manager**. Parallel review requires Fire and EMS, Public works
and Parks to reach that surface. As ruled, none of this can be built.

**Proposed amendment, using the ruling's own logic:** a department reaches plan review only
through its own scope — its findings, its coverage, its sign-off — never the whole submittal.
That is precisely what the ruling says makes Overview *"a roll-up rather than a leak"*. The
roster stays the nine lenses and no department is invented.

## Source state

`P:\plan-review` now declares **DEPARTMENT_ROLES** in `src/staff-identity.mjs`. The seven role ids
this design proposes are the roster the product already carries. Personas are `orgId/userId` with
roles reviewer, observer, applicant and staff. Re-read at `plan-review` `origin/main` `99c156ba`
on 2026-09-18: the department model this canvas was drawn against did not exist then and exists
now, so the roster below is the product's rather than a proposal. The rest of the position holds —
discipline, routing and sign-off still return nothing across `src/` and `web/`. Everything else
on these artboards is proposed.

The roster is fixed by the ruling to the nine lenses, so the seven department roles are
Development services, Finance, Public works, Parks, Police, Fire and EMS, Fleet. No
"Engineering", which Bastrop's budget has and the product does not.

## The moves

**We do not route. We scope.** Which departments receive a submittal is the city's decision
and its workflow system's job; that is what being a companion means in practice. What a
finding *belongs to* is decided by the section it cites, through a map the city declares once
— auditable and consistent, not inferred per submittal. A section absent from that map does
not default to Development services.

**Unrouted has two causes and they are not the same.** Zero departments claim the section, or
two do. Both are refusals to guess.

**Coverage is per department, because a gap is not shared.** Development services has four
cited rules on this submittal; Public works has zero, and the product says so to their face
rather than implying coverage. A single coverage figure across the application would let a
strong department's corpus hide a weak one's gap, which is the most dangerous number this
product could print.

**Two departments are two authorities.** `Uncertain` was reserved for two code editions
disagreeing; a department disagreeing with a department is the same shape. The refusals are
the design: not the stricter number (stricter is not a synonym for correct, and it teaches
every department that claiming higher wins), not the claim that carries a citation (our corpus
is no authority on which department governs the right of way), not both numbers sent to the
applicant.

**The board is about the application, never the people.** It shows where work is sitting and
for how long. It does not rank staff, count individual throughput, or name who has not opened
something. Handing a government customer a productivity leaderboard is a different product
with a different politics and we are not shipping it by accident. Three states that look alike
and are not: not opened, reviewed and found nothing, and we produce nothing for them.

**One notice, four departments, and it will not issue** while two of them have not opened the
submittal. Not evaluated is broken out by department. 8 + 2 + 2 + 0 + 1 = 13.

## Conventions this folder holds to

Department is a **second channel** — a dot and a name. Determination stays the badge. One
element never carries both.

## Pinned

Everything the reasoner canvas pinned: the viewer, dimension capture, and every adjudicator
except the front setback.

## Regenerate

    node gen.mjs
