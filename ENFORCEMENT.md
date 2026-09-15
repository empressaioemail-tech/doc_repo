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

## A mass state change refuses before it lands

A writer that would flip a destructive status on a large share of a population refuses, writes nothing, and says what it would have done. The threshold is a declared number, not a judgement call, and crossing it requires explicit authorisation rather than a warning nobody reads.

This is not the same rule as leaving a record. A record tells you what happened after it happened. Twelve days of correct records would not have helped here, because nobody was reading them.

Instance 2026-09-15, Bastrop 48021. A parcel-node reconcile marked **57,704 of 62,394 parcel-node atoms retired, 92.5 percent of the county**. Nineteen of twenty randomly sampled retirements were live at the county's own public cadastral service. The prop_ids were present the whole time: `txgio_parcel` held 62,257 distinct ids for Bastrop with zero null geometry, against 62,394 atoms. Nothing was missing. The comparison was wrong.

Four controls should have caught it and each failed differently, which is why this instance is worth keeping:

The retirement decision was **presence shaped**. A set-difference against one upstream let a single source decide both what exists now and therefore what is gone. The second, independently derived source existed in the same script — `parcelCurrencyFromBcadMap`, a live county check — and sat AFTER the gate in the loop, so it never ran once the gate had declined. **The capability was present and the control order made it unreachable.** Before trusting an ordered pipeline, ask what the later stages can no longer see.

Nothing refused the write. A job that retires 92.5 percent of a county should not need to know what went wrong in order to stop; the share alone is disqualifying. A blast-radius refusal is generic, protects every writer, and is the control that would have stopped this at write time with no knowledge of the defect.

Nobody watched the derived aggregate. Retired-share per county is one number and it moved from approximately zero to 92.5 in a single run.

**And it produced no customer symptom, which is why it survived twelve days.** The serve path never consults parcel-node status, so the corruption was invisible. That blindness is itself a defect, and it was also the only thing preventing the county from going dark — so the obvious fix, making the serve honour retirement, would have converted a silent defect into an outage. A defect with no symptom needs a deliberate instrument, because nothing else will find it. This one was found by accident, by a lane chasing a single parcel for an unrelated row.

Prefer a refusal to a detector. This operation has a long record of building detectors that were later found dormant, starved, or vacuous. A refusal that fires beats a report nobody reads, and when only one is affordable, build the refusal.

## How to write a check that actually checks

A presence shaped check has one input. A meaning shaped check has two or more independently derived inputs and asks whether they agree. No sentinel can satisfy a consistency requirement across two separate derivations.

Independently derived means from different sources, not different fields. Two fields in the same payload from the same upstream are one derivation. A check comparing a declared status against content in that same payload is internal consistency, which looks meaning shaped and is not: one upstream fabricating both halves passes it. The test is whether one party acting alone could satisfy both sides. If yes, it is internal consistency, and it catches transcription errors rather than wrong sources.

Prefer: does the county code in this record's body match the county code parsed from its binding. Avoid: is this field non null.

Where a type can express the constraint, prefer the type over any check. A discriminated union the compiler enforces at every consumer has no trigger to be missing and no call site to be absent, which removes it from the dormant and starved categories entirely.

Where no second derivation exists, construct one rather than weakening the check. The cost of a meaning shaped check is that it needs a second source of truth. Pay it.

Before scoring a default or a check as remediable, enumerate its call sites. A default copied into its callers survives its own removal, and deleting the signature default reads as a fix while changing nothing.

## Every record starts with its full shape

Ruled 2026-09-01, `_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`.

A record is instantiated with its complete column set from the moment it exists.
Acquisition changes a cell's STATE, never a cell's EXISTENCE. A record is never partially
shaped; it is fully shaped and mostly unaccounted, and it fills in.

**A missing column is invisible. An unaccounted cell is countable.** Where a field appears
only once something writes it, a field nobody built an acquisition path for is
indistinguishable from one that does not apply and from one nobody thought of. Every gap
analysis is then structurally incapable of finding the largest gaps, because it can only
see the fields that already exist.

`unaccounted` is legitimate at rest and fatal at publish. Both halves are load bearing. If
it stops being fatal it becomes cover, and if it stops being legitimate the pressure moves
to fabricating values.

Never convert `unaccounted` to `absent-verified` to clear a gate. `absent-verified` is a
claim that something looked; writing it where nothing looked is a lie that passes every
check. Watch for unaccounted counts falling without a matching acquisition landing — that
is relabelling, and it looks like progress.

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

## The instrument that produced a claim is part of the claim

Added 2026-08-21 after the planner made ten wrong load-bearing statements in one session. Every one was an ad hoc instrument built in a shell, under context pressure, whose failure mode was to return a plausible answer. Not one was caught by re-reading the conclusion; they were caught by a lane, by a seat, or by a control. The four rules below each kill a specific instance and are stated with it.

**A load-bearing claim needs a file-based instrument that has been shown to fail.** If a statement reaches the operator or a commit message, it is not verified by a shell one-liner. The instrument lives in a file and self-tests in both directions before it is trusted. Instance: a plan-row predicate built by shell string concatenation lost its backslashes and compiled to `^|s*R-99s*|`, an alternation with an empty branch that matches every input. It reported the negative case passing and that went into a commit message. The one verification that session which did not fail was the one written as a file with four self-test fixtures, including an explicit not-vacuous case.

**Never read multi-field CLI output through a positional formatter.** `--format="value(a,b,c)"` aligns by semicolons and a blank field shifts every column after it. Use JSON and read fields by name. Instance: `gcloud run services describe --format="value(status.traffic[].revisionName,status.traffic[].percent)"` returned `...00522-row;...00524-pit` against `;;;100;`, which reads as 100 percent on the last revision and means 100 percent on the fourth. The planner reported the wrong serving revision to the operator twice on that one misread, while claiming to have checked the traffic split.

**Read the authoritative record, never a proxy for it.** *(Armed 2026-08-30 as a hook: `.claude/hooks/authoritative-read.mjs`, rules and self-tests in `scripts/enforcement/authoritative-read.mjs`. It WARNS, never blocks, and fires only on documented instances. This paragraph stood as prose from 2026-08-21 and did not bind: on 2026-08-30 the planner read a working tree and called an uncommitted fix landed, and read a coverage count instead of the writer a job actually calls. Prose controls here are 0-for-3; hooks are 1-for-1.)* The revision that served a request is on that request's log line, not in `latestReadyRevisionName`. The image a revision runs is its digest, not the tag that was requested. Whether a table exists is in the catalog, not in the shape of somebody else's query. Instances: a canary deployed with `image_tag=latest` froze a digest seven seconds before the intended image was pushed, so a dry-run against it read as an overlay no-op when it was running older code; and a link table holding 33,066 rows was declared absent because its absence was inferred from an orphan query rather than by enumerating tables.

**Pre-register the falsifier for your own checks, not only for other agents' work.** The same session pre-registered sixteen predictions against five lane returns, scored them honestly, and lost most of them, which was the correct outcome. Not one of the planner's own verifications got the same treatment, and that is exactly where the failures were. Before running a check, state what result would prove it wrong. If no result would, it is not a check.

The common shape across all ten: **the check returned the answer that was expected, so it was not interrogated.** A convenient result is a reason to distrust the instrument, not a result. That sentence already appears above this section; it did not bind, because it was a maxim rather than a procedure. These four are procedures.

**And one operational note that is not a rule.** The planner's error rate rose sharply in the last third of a very long session. Verification-heavy work degrades with context depth. The correct response is to checkpoint and hand off, not to push through. Relying on downstream lanes to catch a planner's confident claims is not a control.

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
