# Enforcement Rules

Applies to every agent, every repo, every lane. Derived from `61_enforcement_doctrine.md`.

## The governing rule

An artifact that exists, is correct, and does nothing is the defect class this operation actually suffers from. It passes review, answers "do we have this" affirmatively, and enforces nothing. Before claiming any capability, control, or coverage exists, confirm it can fail.

## Fail closed, always

Never emit a value computed without a required input. Refuse instead.

Never default a field whose correct value is unknown. Route to adjudication or refuse.

Never write a binding, identifier, or type that was not explicitly resolved. A raw source key, a fallback string, or a caught exception's default is not a resolution.

Never satisfy a check with a sentinel. If a check can pass on an empty, concatenated, placeholder, or defaulted value, the check is wrong and reporting it is part of the task.

If you find yourself writing a fallback so the code does not raise, stop. The raise is the correct behaviour and the fallback is the defect.

Fail closed applies to outputs. Anything producing, serving, or scoring a value refuses rather than emitting something unverified.

Tooling fails loud instead. A hook or CI check that cannot run and silently passes is the defect. One that cannot run, records that it could not, and lets work proceed is acceptable only when something counts those records visibly.

The rule covering both: degradation is permitted only when declared in the output. Silent degradation is prohibited. A degraded answer presented as complete is the defect; a degraded answer labelled as degraded is honest.

A control whose scope is broader than its claim is a defect too, and a worse one than a narrow control. A hook that blocks work it was never meant to reach teaches the fleet to use the bypass flag. Over-broad and under-narrow are not opposite ends of one dial. Where a scope defect surfaces through friction, go looking for the silent half. A control that fails to fire produces no complaint. Nobody finds the miss from the outside.

## State changing operations leave a record

Every operation that mutates durable state emits a durable record naming the items acted on, the timestamp, and the invocation. A count is not a record. If the record cannot be written, the mutation does not run. Refusals of a state changing verb are recorded the same way, because a refuse that leaves no name is how an unattributed mutation becomes unanswerable.

## How to write a check that actually checks

A presence shaped check has one input. A meaning shaped check has two or more independently derived inputs and asks whether they agree. No sentinel can satisfy a consistency requirement across two separate derivations.

Independently derived means from different sources, not different fields. Two fields in the same payload from the same upstream are one derivation. A check comparing a declared status against content in that same payload is internal consistency, which looks meaning shaped and is not: one upstream fabricating both halves passes it. The test is whether one party acting alone could satisfy both sides. If yes, it is internal consistency, and it catches transcription errors rather than wrong sources.

Prefer: does the county code in this record's body match the county code parsed from its binding. Avoid: is this field non null.

Where a type can express the constraint, prefer the type over any check. A discriminated union the compiler enforces at every consumer has no trigger to be missing and no call site to be absent, which removes it from the dormant and starved categories entirely.

Where no second derivation exists, construct one rather than weakening the check. The cost of a meaning shaped check is that it needs a second source of truth. Pay it.

Before scoring a default or a check as remediable, enumerate its call sites. A default copied into its callers survives its own removal, and deleting the signature default reads as a fix while changing nothing.

## Absent, zero, and unmeasured are three different states

Never collapse them. A fabricated zero is worse than an absence, because a zero enters averages, percentages, and ratios without announcing that it was invented, while an absence forces a decision.

An unrepresentable state gets made representable, never encoded in a sentinel. Not zero, not empty string, not NaN, not a boolean default. If the type cannot express the state, the type is wrong.

## Admitting a known bad value

Widening a check to admit a value that does not satisfy its meaning is permitted only when a detector exists and something fails when the admitted value reaches a consumer that treats it as valid. Naming the defect is not sufficient. An exported detector that nothing calls in a gating position is a starved mechanism.

Where the admitted value is a different kind of thing rather than an edge case, split the type instead of widening the check.

## State your snapshot

Any audit, diagnostic, or measurement declares the commit, branch, or data snapshot it ran against, in its output. An instrument run against a stale tree returns confident wrong answers, and the check "does this file exist" passes on absence.

## Read the log you cite

Before relying on a log to answer a question, read what it records rather than what a log of that kind ought to record. A field that always contains the same string is a ceremony, not a justification. A mandatory reason is a presence shaped requirement on a justification and constrains nothing unless something reads it.

Instance 2026-08-20: `_catalog/dispatch_overrides.log` CLOSE_OVERRIDE, 16 rows, 11 in one day, every reason string identical (`CLOSE_OVERRIDE=1 on git push`), neither seat nor dirty file recorded. The populations the question needed were never distinguishable there. The rate is the finding: the hatch is not being used sparingly. Counting first was still right. The distinction the question wanted was never in the artifact. From the 2026-08-20 proof row onward the log writes `target=` and `cwd=`. The historical eleven stay a rate without reasons. Everything after them will carry both.

## The three question gate

Before adding any control, policy, mechanism, or check, answer in the output:

1. What executes this? A script, hook, CI job, scheduled task, or blocking field. Not a role, not a person, not "the operator reviews."
2. What triggers it? A commit, merge, schedule, close, or deploy. Not "when someone notices."
3. What fails when it is violated, and is the thing that fails running in production today? A non zero exit, blocked merge, refused write, or failed close. A control that is merged, correct, and undeployed enforces nothing.
4. What bypasses it? Name the paths that reach the same state without passing through the control. The answer is rarely none. An ORM listener is bypassed by a raw connection. A CI grep is bypassed by anything not passing through CI. A rules file is bypassed by any harness that does not load it.

If any answer is that a human remembers, it is not a control. Say so rather than shipping it.

## Verify a check by violating it

Before reporting any check, audit, or guard as working, run it against a known violation and confirm it fails. A check observed only passing has not been observed working.

If an output looks convenient, that is a reason to distrust the instrument, not a result.

A control verified by violation generates events indistinguishable from the ones being counted. Note and exclude them explicitly.

## Code reading outranks output measuring

Every real defect in this operation to date was found by reading a write path. None were found by measuring output. Measuring output applies the same predicates that admitted the defect.

When a code reading finding and an output measuring finding disagree, the code reading finding is correct.

When output looks clean, do not report health. Report that the output is unmeasured until the write path check has been read.

## Retirement

Repoint consumers first, then retire the store. Reverse order turns an invisible defect into a visible regression.

Retirement is proven by decline, never by documentation. A retired path returns a decline or 404 and a CI check fails if it reappears. Where a parallel store persists temporarily, a divergence test runs between old and new and fails on disagreement.

Any change that says read from X instead of Y must carry a retirement item for Y in the same card. Splitting them across lanes requires an explicit amendment naming the orphan.

## Mechanisms must be armed and fed

Before reporting a mechanism as built, confirm three things: it exists, it has a trigger, and its gating precondition is actually populated.

Dormant means no trigger. Starved means it has a trigger and correct logic but its input is never supplied, so it runs and does nothing. Both report as success. Both are worse than absent, because absent is visible.

Test suites are mechanisms. A suite that runs in no workflow is dormant.

## Tests

Never assert a value the system produces that no external authority recognises. That converts a defect into a specification and makes the fix read as a regression.

When writing a test for existing behaviour, verify the expected value against the source authority, not against current output.

## Lane close

Every lane finish declares its leave behind before it can close:

    leave_behind: none
    
or

    leave_behind:
      - item: [branch, store, doc, parallel project, adapter]
        owner: [name]
        plan_row: [id or backlog id]

"None" is a valid and cheap answer. The declaration is required regardless.

## Reporting findings

State the mechanism you believe explains an observation, then state a second mechanism that would produce the same observation and why you rejected it. Stopping at the first plausible explanation is the documented recurring error in this operation.

Do not write a correction into durable memory from a source carrying a staleness marker.

Do not declare a defect class closed by grepping for a type when the property is semantic.

## Scope

Product code lives in product repos. doc_repo holds decisions, closes, and canon. A nested clone is never a valid read path.

Anything cited by tracked canon must itself be tracked. Cited and untracked is the worst state.

## Which seat are you

At session start, before any work:

Identify your seat from `_catalog/seat_register.json`. If your seat is not registered, register it before working.

Confirm you are in your own worktree on your own branch. If you are in another seat's checkout, stop and say so. Do not work around it.

Declare your snapshot in your first output: repository, branch, commit.

If you cannot complete these, report that rather than proceeding.

The control that makes this fail rather than being remembered is `scripts/enforcement/seat-worktree-gate.mjs`. Reasoning: `62_seat_topology.md`.

## Subagents do not commit

If you fan work to subagents, they produce artifacts and hand them back. You commit. They do not touch git.

This is what makes fanning safe: five subagents add zero writers. It is also what makes review real, because you have to read an artifact to commit it.

When a subagent reports something done, read the diff. When it reports something verified, ask what it violated to establish that. A subagent will not audit itself unprompted, and a report of success is a claim.

## Stay in your own repositories

Product repositories have one owning seat. Do not write to a repository you do not own. If you need a change there, request it from the owning seat.

Where a file is appended to by several seats, write to your own file under your namespace rather than to the shared one. If only a shared file exists, say so rather than writing into it.

## Commit by explicit pathspec

Never add all. Two seats have nearly swept each other's staged work into unrelated commits by that reflex, and a commit whose message describes one change and whose diff is mostly another misdescribes itself.

Before committing, verify the content is staged rather than the paths. A file can change between your write and your add.

## Merge your own branch

Merge to main is self service. You do not need authorisation to merge your own work.

You do need it for: deploys to production, irreversible deletions, anything requiring credentials, and any claim that has already failed its own test twice.

## When you disagree with another seat

Report both readings with the evidence for each and let the operator route it. Do not adjudicate another seat's closed finding yourself, and do not investigate a control you do not own.

Probing a control to learn when it lets you through is bypass hunting when you are the one being blocked. It is the standard method when you own the control.
