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
| M-003 | A read probe must require the PRODUCTION shape, not the shape of the tree it runs in. A dev worktree with a colocated sibling repo derives different values than Cloud Run, which has none, so a probe that passes locally can be starved where it actually runs | prose | `manifestReadProbeOptions requireEngineRoot`, R-09 | `_scratch/r09_gate_repair.md` 2026-08-21 | no |
| M-004 | A close artifact's `commit` field is NOT the PR HEAD. Compare them before merging; a divergence is a live-agent signal even when CI reads success, and merging on the close SHA merges a tree CI never graded | prose | R-05 w5; LDT PR 447 | `_scratch/r05_w5.md` 2026-08-21 | no |
| M-005 | A frontmatter or fence detector requiring a literal `---` newline counts every CRLF and UTF-8-BOM file as unfenced. Two honest instruments then report different totals for the same tree and neither is wrong about what it measured | prose | R-05 w2 | `_scratch/r05_w2.md` 2026-08-21 | no |
| M-006 | Deploying a canary by a floating tag (`image_tag=latest`) freezes whatever digest the tag pointed at when the REVISION was created. A build finishing seconds later moves the tag and the revision keeps the old digest. Pin the SHA, and verify the digest ON THE CREATED REVISION, not the tag you asked for | prose | R-09 finish; cortex-api 00524-pit vs 00525-bev | `_scratch/r09_finish.md` 2026-08-21 | no |

Six rows. All prose, all unenforced. M-001 and M-002 were promoted before this file existed
and are recorded retroactively so the count is honest rather than flattering. M-003 is the
first entry to arrive through the gate: the backlog grew past its pin on 2026-08-21 when three
lanes wrote lessons, the build failed, and triage happened because the build failed. That is
the loop closing for the first time since the practice was written.

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
