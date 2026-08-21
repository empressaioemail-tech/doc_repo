# MEMORY.md — fleet Tier 1 durable memory

The promotion target named by `90_runbooks/fleet_memory_practice.md` and by
`.cursor/rules/fleet-memory.mdc` rule 4. It did not exist until 2026-08-20. Tier 2 capture
had been running for months into a gate whose destination was never built, which is why
nothing has ever been promoted.

**This file is fleet-visible and version controlled.** That is the whole point of it. The
planner's Claude Code auto-memory at `C:\Users\cente\.claude\projects\p--doc-repo\memory\`
is a different store: it is private to one seat, invisible to every Cursor agent, and not in
git. It is a useful planner notebook. It is not fleet memory and must never be cited as
though the fleet can read it.

## The two tiers

Tier 2 is `_scratch/<workstream>.md`. Cheap, allowed to be wrong, four entry kinds: LESSON,
DEAD-END, GROUND-TRUTH (invalid without a timestamp), OPEN. Agents write it freely and read
it before re-deriving anything by archaeology.

Tier 1 is this file plus the mechanical guards it points at. Durable, verified, and reached
only through planner review. An agent never self-promotes. That firewall is deliberate and
is not up for negotiation by an agent that thinks its lesson is obviously right.

## Promotion, in order of preference

**A mechanical guard beats prose every time.** A failing test, a CI check, a fail-closed
gate. Prose rots and cannot be violated loudly. A lesson about concave geometry promotes to
a failing test on a concave fixture, never to a note saying "use a real offset library."

**Prose only where a guard is impossible**: a process gotcha, an operator ruling, an external
constraint. It gets a row below and it says plainly that it is unenforced.

Procedure: the agent leaves the LESSON in its scratch file and returns it in its close. The
planner reviews, decides guard-versus-prose, lands the durable form, and records the row
here with a link back to the scratch origin so provenance survives.

## Promoted entries

| id | lesson | form | where it lives | scratch origin | enforced |
|---|---|---|---|---|---|
| M-001 | Deploys are planner owned; the agent deploys and fixes failed deploys and never escalates one to the operator | prose | `90_runbooks/fleet_memory_practice.md` standing scope rules; `_STATE.md` STANDING DECISIONS | 2026-07-27 CC-A and Track B mis-routes | no |
| M-002 | The strongest promotion is a mechanical guard, and a guard is only as good as its fixture coverage; test the positive space, not only the negative | prose | `90_runbooks/fleet_memory_practice.md` standing scope rules | R0 geometry gate, parcel 28286 | no |

Two rows. Both prose, both unenforced, both promoted before this file existed and recorded
here retroactively so the count is honest rather than flattering.

## What this file must not become

A second copy of `_STATE.md`. State is what is true now and moves constantly. Memory is what
was learned and should not move. If a row here needs updating because the world changed, it
was state wearing a lesson's clothes and it belongs in `_STATE.md`.

A dumping ground for un-promoted Tier 2. A LESSON that has not been reviewed stays in
`_scratch/`. The value of this file is entirely that everything in it passed a gate.

A place to record a lesson learned by an agent about itself. Those go in `_scratch/` and
usually die there correctly.

## Known state of the loop, stated plainly

The promotion gate has a specification, an owner, and no trigger. The L3 grading rung in
`90_runbooks/session_close_template.md` section 2C-bis has been executed zero times in 215
session summaries: grepping `_sessions/` for `HARMED` returns nothing. Of 312 dispatches, 18
carry a standing-decisions block and zero carry the fleet-memory block that
`fleet_memory_practice.md` requires verbatim in every sprint dispatch. Source:
`_inbox/2026-08-08_MEMORY_system_audit.md`, still accurate on 2026-08-20.

So this file existing does not close the loop. It removes the excuse that there was nowhere
to promote to. The trigger is the remaining work and it is tracked as a build item, not as
an intention.
