---
id: 61_enforcement_doctrine
title: Enforcement Doctrine, Declared Is Not Enforced
status: active
last_updated: 2026-08-20
applies_to: portfolio
related: [ENFORCEMENT, 51_ingestion_pipeline_reference, 90_enforcement_build_order, DEV_PROCESS, AGENT_CONTRACT]
owner: operator
canonical_path: 61_enforcement_doctrine.md
---

# Enforcement Doctrine

## Purpose

Three independent agent returns landed within one week: a markets substrate diagnostic, a property substrate scan, and a housekeeping and process audit. None had contact with the others. All three found the same defect at a different level of the stack.

This document names that defect once, states the operating law that follows from it, and defines the gate that every control, mechanism, and declaration must pass from here forward. It amends DEV_PROCESS and AGENT_CONTRACT and is intended to be implemented as machine readable rules across all agent platforms rather than read and remembered.

## The finding

**Declared is not enforced.** At every level of the stack, the same shape: an artifact exists, the artifact is correct, the artifact does nothing, and its existence answers the question "do we have this" affirmatively.

The numbers in this section are the 2026-08-19 returns, not a live dashboard. They establish the shape.

**Data level.** A validity check exists and can be satisfied by a value carrying no meaning. A concatenated separator is not null, 1,248,412 times. A tile centroid is a valid coordinate 227 metres from the parcel it answers for. A bare ticker is a string in a string column named node_id. An empty identifier list is a populated field. A defaulted asset class is a real value. Every one passes every check applied to it.

**Mechanism level.** A job exists, is correct, and never runs, or runs and cannot act. Three correctness mechanisms in the markets substrate are built, reviewed, and unarmed. A promotion job has an operator route and would promote nothing, because it gates on evidence never collected. Ninety eight tests run in no workflow. A tier1 store carries documentation stating it no longer authors confidence, and answers on every read.

**Process level.** A control exists as prose and does not execute. The measured base rate is the most important number in any of the three returns: hook shaped controls ran 1 for 1. Protocol step controls ran 0 for 3. An inbox sweep written in a README grew from 2,276 to 2,642 files. Session close grading ran 0 of 215 times. A ruling to delete a nested clone, written as a comment, left both clones in place.

In every instance the artifact passes review. A reviewer asking "do we handle this" is shown correct code, a ratified doctrine, or a named policy. That is why these survive: the thing that would detect them is the same thing that admitted them.

## The operating law

Any control that is not hook shaped is a wish.

This is not a preference. It is the measured behaviour of this operation at its current velocity, established at 1 for 1 against 0 for 3, and it applies recursively to the remedies for the problem it describes. A process fix written as a protocol step will fail at the rate protocol steps fail. The doctrine in this document is therefore only load bearing to the extent it is implemented as rules files, CI checks, scheduled jobs, and blocking fields.

Corollary for construction, applying at all three levels: **every check fails closed.** An unresolvable identity routes to adjudication rather than defaulting. An unassignable node type refuses rather than defaulting. An unread required denominator refuses to emit a score rather than emitting one. A retired path declines rather than answering. A check that can be satisfied by its own absence is not a check.

**Fail closed applies to outputs. Tooling fails loud.** This distinction is necessary or the doctrine reads as block everything, and a control that blocks legitimate work trains people to bypass it, which is worse than the control not existing.

Anything producing, serving, or scoring a value fails closed without exception. It refuses rather than emitting something unverified.

Developer tooling, hooks, and CI checks are different. A hook that cannot run and silently passes is the defect. A hook that cannot run, records that it could not, and lets the work proceed is acceptable only when something downstream counts those records and the count is visible. That is the acknowledgment pattern: the escape is permitted, it is never silent, and its population is a first class number that someone watches.

**A required justification that nobody varies is a ceremony, not a record.** Where an escape hatch demands a reason and accepts any string, the field fills with one string, and the log records that overrides happened without recording anything distinguishing them.

The instance: sixteen logged overrides, eleven of them in a single day, every reason string identical. That log also records neither which seat invoked it nor which file triggered the gate, so a considered override and a reflexive one are indistinguishable in the only place they were supposed to be distinguishable.

Three consequences. A mandatory reason field is a presence shaped requirement on a justification and constrains nothing unless something reads it. Before relying on a log to answer a question, read what the log actually records rather than what a log of that kind ought to record. And a rate remains visible even when the reasons are not, so count invocations per day before concluding a hatch is used sparingly.

The single rule covering both: **degradation is permitted only when declared in the output. Silent degradation is prohibited.** A degraded answer presented as a complete one is the governing defect. A degraded answer labelled as degraded is honest and often correct.

**This applies field by field, not only output by output.** Where two fields share a display frame and carry different truth conditions, the difference must be visible, or the honest field lends its credibility to the dishonest one.

The instance: a rates board serving a current value alongside a prior and a delta. The current value is honestly current, since the board's subject is the present and it makes no historical claim. The delta is computed between two observations each taken at its current revision, so it is a comparison across revisions rather than the move anyone observed at the time. Both sit in the same row. Nothing distinguishes them, and a reader who correctly trusts the value has no reason to distrust the number beside it.

The remedy is the usual pair: either compute the degraded field so that it is not degraded, or mark it. What is not available is leaving a correct field to vouch for an incorrect neighbour.

A second failure shape belongs here, distinct from scope narrower than claim. A control whose scope is *broader* than its claim blocks work it was never meant to reach. A commit hook checking one repository's branch state while firing on commits to every repository was the live instance through 2026-08-20 (scoped that day to the repo the command mutates). It is more dangerous than a narrow control, because a narrow control fails to catch things while a broad one teaches the fleet to reach for the bypass flag. The leftover-commit matcher on the same hook is a different defect: same operation, incidental string content, opposite verdict. That one remains.

Over-broad and under-narrow are not opposite ends of one dial. Both had the same root: the hook read the process working directory rather than the target the command mutates. The over-reach was visible because it blocked work and two seats complained. The miss was invisible because a control that fails to fire produces no complaint from anyone. A command explicitly targeting doc_repo from elsewhere (git -C P:/doc_repo push) used to miss the dirty-tree gate entirely. **Where a scope defect surfaces through friction, go looking for the silent half.** Nobody finds the miss from the outside, because nothing is wrong from the outside.

The resolver that closed that hole still ends in process cwd. That is an accepted residual, not an unconsidered default. The first three steps (git -C, then cd, then tool working_directory or payload cwd) cover the cases where process cwd is wrong. When none of those are present, git itself runs in the tool's shell cwd, and the assumption is that hook-process cwd equals that shell cwd. Unknown target is collapsed into that default rather than represented as its own state. Fail-closed on unknown would block ordinary commits in any harness that omits cwd and train the bypass. Fail-open on unknown would recreate the silent miss. Process cwd is the least-wrong of three bad options, named as a default, not as a determination.

Corollary for mutation: **every state changing operation emits a durable record naming the items acted on, the timestamp, and the invocation.** A count is not a record. A report that says zero deleted while the refs are gone is the defect this clause exists to make unrepeatable. If the record cannot be written, the mutation does not run. Refusals of a state changing verb are recorded the same way, because a refuse that leaves no name is how an unattributed mutation becomes unanswerable.

Corollary for logs: **before relying on a log to answer a question, read what it records rather than what a log of that kind ought to record.** A field that always contains the same string is a ceremony, not a justification. A mandatory reason is a presence shaped requirement on a justification and constrains nothing unless something reads it.

Instance 2026-08-20, CLOSE_OVERRIDE in _catalog/dispatch_overrides.log. Sixteen rows, eleven in one day, every reason string identical (CLOSE_OVERRIDE=1 on git push). The log records neither the seat nor the dirty file. Two populations that were supposed to be distinguishable there never were. The question asked of the log was answered from what a bypass log ought to contain. The artifact had not been read. From the proof row onward the log writes target= and cwd=. The historical eleven cannot be split. Going forward, per-seat files under _catalog/override_logs/ are the append target.

Corollary for detection: **code reading outranks output measuring.** Across both substrates, every real defect surrendered to reading a write path and none to measuring data. This is structural. Measuring the output applies the same predicates that admitted the defect, so the instrument and the disease share a definition of valid. Where a code reading test and an output measuring test disagree, the code reading test is correct.

## The gate

Any declaration entering durable canon, any control added to process, and any mechanism merged to a repo must answer three questions in writing. A declaration that cannot answer all three is not ratified, is not a control, and does not count as coverage.

1. **What executes this?** A named script, hook, CI job, scheduled task, or blocking field. Not a role. Not a person. "The operator reviews" is not an executor.
2. **What triggers it?** A commit, a merge, a schedule, a close, a deploy. "When someone notices" is not a trigger.
3. **What fails when it is violated, and is the thing that fails running in production today?** A non zero exit, a blocked merge, a refused write, a failed close. If nothing fails, the control does not exist regardless of how it is documented. The second clause is not redundant. A control can be merged, correct, and answer the first two questions truthfully while enforcing nothing, because it is not deployed.
4. **What bypasses it?** Every control has a scope, and the claim is almost always stated at the scope of the intent rather than the scope of the enforcement. Name the paths that reach the same state without passing through the control.

Applied to the three levels: a data check that cannot fail a write is not a check. A mechanism with no trigger is not a capability. A policy with no executor is not a process.

### The fourth state, enforced in code and not in production

Between declared and enforced sits a state that answers the first three questions correctly and enforces nothing: merged, correct, armed, undeployed. The instance: a mandatory write boundary implemented as a model level listener that raises inside the flush, merged and sitting ahead of production for days. Every atom that substrate wrote in that window was unguarded, and a deployment gate as originally written would have passed it.

This is the most invisible variant of the general defect. Unlike a dormant job it has a trigger. Unlike prose it has teeth. The artifact is genuinely correct and genuinely inert, and code review, design review, and the gate itself all pass it.

Enforcement: a scheduled script comparing what is deployed against what HEAD holds, per control. Two requirements the earlier text omitted, both established in practice by the markets implementation.

**The deployed commit must be attested, not read.** A single source for what production is running is presence shaped and satisfiable by the cheapest wrong value, which on a build VM is a git directory that does not correspond to the running image. Two parties: the running process reporting its own version, and the image or revision label answering independently of anything the process says. Agreement passes, disagreement is a finding, neither available refuses, and a lone derivation resolves but is labelled presence shaped rather than counted as corroboration.

Note that two derivations sharing a common stamping point degrade to internal consistency silently. Where both are stamped from one build argument, a future pipeline change that stamps only one converts the check without anyone editing it. Record the coordination point rather than assuming it away, and re-verify independence whenever the deploy path changes.

**Ask presence at revision, not introduction commit.** Resolving the commit that introduced a control is archaeology that rebase and squash break. The answerable question is whether the control's anchor exists in the deployed tree and whether its content matches HEAD.

Hook shaped, scheduled rather than triggered on deploy, since the condition being detected is nobody deploying and a gate firing on deploy cannot fire during the window it exists to catch.

This generalises the retirement sequencing rule to the creation side. Repoint consumers first then retire the store is a deploy ordering constraint on removal. Merge the guard, then deploy it, and until you do it guards nothing is the same constraint on addition.

### Advisory, where the verdict binds nothing

A sixth state, and the one that invalidates the largest number of controls at once. The control runs. It produces the correct verdict. Nothing consumes the verdict.

The instance that established this state: an estate was found with branch protection enabled on no repository, which made every continuous integration check in it advisory. The encoding guard, the self testing gate, the test suites, every grep, and every continuous integration row in a control table all executed, reported accurately, and blocked nothing. Under gate question three the honest answer for every one of them was that nothing fails.

This is distinct from dormant, starved, undeployed, scope narrow, and scope broad. Those describe a control that does not run, runs on nothing, is not live, covers too little, or reaches too far. This one runs correctly and is simply not wired to a consequence. It is the most invisible of the six, because the check goes green or red and every reader treats the signal as though it gated something.

The recursive instance is worth noting, because it shows the shape is general rather than a continuous integration quirk. The property substrate is adding a containment stamp to flood atoms, and every consumer reads the zone field without looking at the stamp. The stamp will be correct, present, and advisory, for exactly the same reason.

**Diagnostics emitted into unread channels are the same state.** A failure logged at a level below the production threshold has been recorded and not reported. The signal fires, the code is correct, and nothing receives it. In one substrate every vendor fetch failure logs at debug, invisible at the running log level, with no alert, so the only surviving symptom is a mislabelled reason string in a job result nobody reads unless they already suspect something.

That is worse than no logging, because the presence of a log statement answers the question "is this observable" affirmatively while the answer is no. When auditing observability, check the emitted level against the configured threshold rather than the presence of the call.

Two properties make this state unusual. It is a single fix that converts an entire class at once, since enabling branch protection makes every existing check binding simultaneously. And it is the only one of the six where the remedy can immediately block all work, so it is sequenced rather than switched: enable protection with the checks that currently pass reliably as required, and add the rest as they stabilise. A protection rule that blocks every merge on day one produces the bypass habit the doctrine exists to prevent.

**Protection is not one setting and should not be adopted as one.** It separates into parts with different costs. Preventing force push and branch deletion protects history, breaks no workflow, and is pure gain wherever it is available. Requiring status checks makes existing checks binding and is the part that converts the sixth state. Requiring pull request review changes how people work and is the part that can block a legitimate path on day one.

The split matters most where a repository's failure mode differs from a product repository's. A document repository's risk is not that bad code merges, it is that canon is lost or silently rewritten, so history protection is the load bearing part and required review may be the wrong tool. Choose the parts against the failure mode rather than adopting the bundle.

### Rulings that depend on a current state carry their reopening condition

A classification can be correct when made and wrong later, without anything having gone wrong in between. The state it depended on simply changed. Left in prose, it becomes a zombie classification: correct at the time, stale now, and nobody knows to revisit it.

The instance: a data layer is classified as carrying records rather than derivations, which is correct while it serves no values, since nothing computed means nothing derived. The moment a value path lands, a computed series carrying an actual number is a derivation and the classification is wrong. Nobody would be at fault and nothing would alert.

Two requirements. State the reopening condition in the artifact rather than in a document, because a document does not enforce. And where the condition is expressible in a type, make the stale state unrepresentable rather than merely noted: if a value bearing series and the record classification are mutually exclusive at the type level, the compiler forces reclassification the moment the value arrives, and no one has to remember. That is the type over check preference applied to a decision rather than to data.

Where the condition is not expressible in a type, it is a scheduled check with a named trigger, not a comment.

### Two values, and only one is described by the six states

A control has an evidentiary value and a protective value, and they are separable. The six states above describe protective value only. Collapsing them loses the half that still holds.

When a guard is deliberately broken and a test fails, that is an epistemic act: the guard has been shown load bearing, and the finding is true whether or not anything blocks a merge. What is advisory is whether that test will stop a future regression from landing. A runtime guard that refuses writes today refuses them regardless of whether continuous integration is binding; what is advisory is the guarantee that it stays correct, since a change removing it merges on red as easily as on green.

So a control in any of the six states may still have produced real evidence, and reporting it as flatly advisory discards that. Report both: evidence, valid as of the moment it was gathered, and protection, in whichever of the six states applies.

The qualification is that evidentiary value is time bound. It does not decay to false, but it goes stale, and a test that passed once tells you about the code at that moment rather than at this one.

### Scope narrower than claim

A fifth category, distinct from dormant, starved, and undeployed. The control runs, fails correctly, and covers less than its name implies.

Append only enforcement bound to ORM session events is bypassed by a raw connection, which rewrote a live row in an experiment. A CI grep is bypassed by anything not passing through CI. A rules file is bypassed by any agent harness that does not load it, which includes this document's own primary implementation vehicle.

Question four exists to surface this. The answer is rarely none, and stating the real scope is more useful than claiming coverage.

**A control with the wrong scope predicate is usually both too broad and too narrow at once.** These are not opposite ends of one dial, and finding one should prompt a search for the other.

The instance: a gate reading the process working directory rather than the target a command actually mutates. It fired on commits to every repository while a document repository sat dirty, which is the over reach anyone would notice. It also missed entirely the case of a command explicitly targeting that same repository from elsewhere, which nobody noticed until the scope fix, because a control that fails to fire produces no complaint.

Fixing the predicate closed both. The over reach was visible because it blocked work; the miss was invisible because it blocked nothing. Where a scope defect surfaces through friction, look for the silent half.

**And a control verified by violation generates events indistinguishable from the ones being counted.** The proof run added a row to the override log it was measuring. Note such rows and exclude them explicitly, or the instrument's own use inflates its subject.

**The same question applies to remediations, and it is asked less often.** Where a defect is tolerated because something downstream corrects it, the corrector's coverage must be measured against the writer's coverage rather than assumed to match.

The instance: a fabricated value written on one path is overwritten by a periodic re-fetch from a second vendor. The correction is real. It also requires that the second vendor be configured, that it cover the symbol at that grain, that the record already have history, and that the bad value be less than two days old. The writer is subject to none of those conditions. So the set where the defect heals is smaller than the set where it is written, and the residue persists indefinitely while everyone believes the exposure is temporary.

Temporary and low stakes are different properties. State the conditions under which a mitigation holds, and treat the complement as an unmitigated population that nobody is counting.

### A control that changes state records what it changed

A count is not a record. A control reporting how many things it acted on, without naming them and when, cannot be audited on the only action that matters.

This bites hardest on destructive controls, where the outcome is indistinguishable from the same outcome produced by something else entirely. If 135 references are gone and no run recorded deleting them, the correct outcome has been achieved and the control has not been shown to have achieved it. Attribution by elimination is not attribution, and a control credited with work it may not have done is assumed working rather than observed working.

Requirement: every state changing operation emits a durable record naming the specific items acted on, the timestamp, and the invocation that performed it. Where an outcome is observed with no matching record, that is a finding about the control's audit trail rather than a question about the outcome.

The competing mechanism worth naming in advance, because it is the one an internal analysis will miss: something outside the control did it. An investigation that considers only mechanisms internal to the control will conclude the control acted, since every other candidate it examined has been ruled out.

### A build step can invalidate a control's premise

A control can be correct at the source level and defeated by a transformation applied afterward. Nothing edits the control, nothing reports an error, and the control's own logic still reads as sound.

The instance: a module guards its entrypoint by comparing the resolved path of the running script against the resolved path of the module itself, so it executes only when invoked directly. Bundling folds every module into one output file. Inside the bundle both values resolve to the same path, the comparison returns true, the entrypoint runs with no arguments, and the process exits before the server binds. The guard is correct. Its premise, that a module retains its own identity, is false after bundling.

The general form: any control whose logic depends on a property of the pre build artifact must be verified against the post build artifact. Source level review cannot see this class, because the defect is introduced after review.

Two consequences. Where one such guard exists, the whole class is latent, so sweep for siblings rather than fixing the instance. And the verification must exercise the deployed artifact, not the repository: a boot smoke test against the built container found this in twenty six seconds where no amount of reading the source would have.

### Parallel implementation, and the shared site that is not there

The estate's dominant habit is building a second implementation beside an existing one rather than using it. Duplicate stores, forked harnesses, a bake path beside the atom path, and at the smallest scale six sibling modules each carrying its own copy of the same helper names with divergent bodies.

The last one carries a trap for whoever scopes the fix. A defect appearing in several modules under one function name invites the conclusion that it lives in a shared helper and can be corrected once. Where no shared module exists, that is not available, and the fix is a per module reconciliation whose cost is a multiple of what was scoped.

**Verify the shared site exists before scoping a shared fix.** Same name in several places is evidence of copying, not of sharing, and the two have opposite implications for effort.

The replication is also rarely uniform. In the observed case one defect appeared in three of six modules, a second in one of six, and a third in five of six but consequentially in fewer. **Verify per module rather than assuming a pattern propagates evenly, since the count is what the reconciliation is scoped against.**

**And count reachable copies, not defined ones.** A helper defined in six modules is not necessarily live in six. In the observed case, of three definitions of one geometry function only one was reached: a second was imported by its writer and never invoked, and a third was not imported at all. Two of the three entries in the replication table admitted nothing. Defined, imported and invoked are three different facts, and a reconciliation scoped against definitions is scoped against the wrong number.

The inverse also holds and is the harder case. Where two copies have diverged, neither is necessarily the correct one. In the same instance, one copy deduplicated a closing vertex and the other did not, biasing every well formed ring; on multi part geometry the first silently answered for one part and the second returned nothing. Reconciling onto either copy alone imports the other's defect. Diverged copies require a third implementation derived from what each got right, not a winner.

### A verification step that checks the wrong fields

A write followed by a read back proves the write happened. It does not prove the value is correct, and where the fields compared are chosen by convenience rather than by risk, the verification increments a success count over exactly the value most likely to be wrong.

The instance: a hazard atom is written and verified against its schema, its node binding and its outcome status. The hazard zone, the hazard flag and the access policy are never compared. So a manufactured hazard determination passes verification and is recorded as verified, while sibling writers carrying no hazard determination do check their access policy.

Two rules. A verification compares the fields carrying the claim, not the fields that are easy to compare. And where several writers share a verification pattern, the one carrying the highest consequence should check more than its siblings rather than fewer; if it checks less, that is the finding.

### The default path is lossier than the available one

A capability is built correctly, and a convenience layer in front of it discards the part that made it correct. Everyone calls the convenience layer. The correct implementation exists, is reachable, and is not reached.

This is distinct from parallel implementation, where a second thing is built beside the first and both exist to be counted. Here there is one implementation and one lossy accessor, so nothing looks duplicated and every audit finds the right code present.

Two instances, same shape at different granularities. A capture function accepts an optional list of input identifiers that would record lineage, and no caller supplies it. A provider fetch returns a payload paired with a reason distinguishing four failure modes, and a one line wrapper returns only the payload; three call sites use the full version and twenty four use the wrapper.

The test is a call site ratio. For any function with a rich variant and a convenient one, count both. A convenience path used many times more often than the full path is the signal, and the ratio is cheap to compute across a codebase.

The cause is ergonomic rather than ignorant, which is why exhortation does not fix it. The rich version returns something the caller must destructure and handle; the convenient one returns a value. The lossy path wins because it is easier, every time, for everyone.

So the remedy is the type over check preference applied to an interface: delete the lossy accessor rather than deprecating it, and let the callers migrate under compiler pressure. A deprecated convenience wrapper collects a twenty fifth caller next month. A deleted one cannot.

### An isolation control can foreclose the second party

Some controls narrow the meaning shaped column by construction rather than by any gap in the world. A rule forbidding third party calls, a tenant boundary, an air gap, an egress restriction: each removes access to the party that could corroborate a relayed value.

The instance: a continuous integration gate forbids one layer from calling original publishers, so for every relayed claim the only witness that could evidence the source being right is unreachable by policy. In one substrate this accounts for 111 of 139 contract checks. Those rows read as none exists and are not a data gap.

The distinction matters because the remedies differ entirely. A genuine none exists row is a purchase. A foreclosed row is a control decision, and no amount of buying data changes it.

**Enumerate which controls have this property in advance**, rather than discovering it row by row when an enumeration comes back mostly empty.

Three escapes, in increasing order of what they cost.

**Recompute.** Where the source declares its formula and its inputs, recompute its assertion from its own declared inputs and compare. Their computation against ours, two parties, no second call. This is the cheapest escape and it requires only that the source be self describing.

**Verify at the layer where the call is legal.** An isolation rule usually binds one layer, not the system. Where an inner layer already calls the publisher legitimately, move the verification there and pass the comparison result outward as an adjudication rather than passing the claim. The outer layer then consumes a verdict, which is a different artifact from a claim and does not require it to make the forbidden call. Relaxing the rule is not the only option and is rarely the right first one.

**Relax the control.** Last, and only with the reason the control exists stated and weighed, since it was presumably built for a reason that still holds.

### Documented workarounds outlive their reasons

A comment asserting that a workaround is required because of a live constraint is a claim about the present, and it goes stale the way any declaration does. Two headers in the same repository asserted workarounds necessary due to an import chain that had ceased to have that property.

This is retirement in prose pointed forward rather than backward: not a thing declared dead that still answers, but a constraint declared live that no longer binds. Both cause the same harm, which is a reader trusting the text over the system. When a constraint is removed, record the removal where the workaround is, or delete the workaround with it.

**And the prose is not always the stale half.** Where a declaration exists in both a human readable note and a machine readable field, the two drift independently and either can be the wrong one.

The instance: a scoring rule carried a prose note that correctly named a missing producer, correctly warned that live values would not reproduce under a stated condition, and correctly routed the question onward. Beside it, a structured field declared a denominator that the rule's own live rows did not embody. The prose warned and the field misled, so every consumer reading programmatically got the false half and only a human reading the note got the true one.

Two consequences. Do not assume the structured declaration is authoritative because it is machine readable; check which half the evidence supports. And before deleting a claim as false, read the claim rather than a summary of it, because a note that documents a known gap is evidence about that gap, and removing it destroys the trail.

**The root cause of that divergence is worth naming separately, because a rule already existed for it.** The declared denominator and the computed denominator were two implementations of one rule with nothing binding them: three call sites copied the declaration into a provenance string while a fourth module implemented the query independently. Paired implementations require a divergence test, which the process documentation already said and no lane built. Where two implementations of one rule exist without a test that fails on disagreement, they will disagree, and the disagreement will surface as a correct looking field.

### Verify a check by violating it

Before reporting any check as working, run it against a known violation and confirm it fails. A check that has only ever been observed passing has not been observed working.

**Apply the same rule to a fix, and it tests the test suite rather than the fix.** After correcting a defect, reintroduce it and confirm a test fails. If the suite stays green, the defect was never covered, and the fix is untested regardless of how many tests pass.

The instance: a one predicate correction to a gate, with fifty tests green before and after. Reinstating the original defect left all fifty green, because every test injected the intermediate value directly into the consumer and none exercised the producer where the defect lived. The suite tested the half that was never wrong.

That is the diagnostic worth carrying. A suite that cannot fail on the reintroduced defect is not a suite for that defect, and the usual signature is tests that construct the intermediate state by hand rather than running the code that produces it. Coverage numbers do not distinguish the two.

**And the violation must be reintroduced in the environment the suite actually runs in.** It passes locally is not evidence about continuous integration, and a defect that reproduces in one environment and not the other is exactly the class where local verification is worthless.

The instance: a fix asserted as verified twice from local runs, on a defect that only manifested under a shallow checkout. What settled it was building the failing environment deliberately, cloning at depth one, confirming the wrong behaviour reproduced there, and running the suite in that state.

Proving a suite can fail somewhere is not proving it fails where it runs.

### The commit record is subject to the same rule

A commit whose message describes one change and whose diff is mostly another is declared against actual, in the record intended to explain the work.

The mechanism is almost always an add all. In one instance roughly ten thousand seven hundred lines of enumeration scratch, including an error log, entered a single predicate commit. In another, a second seat's staged artifact was nearly swept into an unrelated commit by the same reflex, and survived only because the author committed by pathspec.

Commit by explicit path. The habit costs seconds and it is the only thing standing between a shared index and a record that misdescribes itself.

The property agent nearly filed a wrong finding when a command substitution returned empty, causing a history query to run without its path filter and report every commit as touching the guarded file. It was caught because the output was too convenient, which is not a control. Feeding the check a deliberate violation is.

## Corroboration integrity, a correction to this document's own evidence

This document opens by stating that three independent agent returns found the same defect without contact. That claim was true when written and has since been weakened by the process that produced the later revisions, and the weakening was caused by the analyst rather than by the agents.

The first return from each substrate was independent. Everything after that was not. Findings were relayed between substrates deliberately, and each subsequent return was produced by an agent that had read the other's work. Confirmations drawn from those later returns are partly an echo rather than corroboration, and at least one agent flagged the risk directly.

The competing mechanism, stated as this document's own second candidate rule requires: two substrates found the same defect independently, or one analyst told both substrates the same thing and then counted the reply as agreement. Both are consistent with the observed returns from revision four onward.

What survives the correction: the first return from each substrate, produced before either had seen this document or the other's findings, contained the presence over meaning defect, the inert mechanism defect, and the hook shaped base rate respectively. Those three are independent and they are the load bearing evidence. The later cross confirmations are useful for building a shared vocabulary and are not additional evidence.

Standing rule from this: where a finding is claimed as corroborated across sources, state whether those sources were in contact and through whom. Relay is contamination, it is often the correct thing to do anyway, and it must be declared rather than counted.

## Retirement

Retirement is where this defect is most visible, because retirement produces no artifact and is therefore purely declarative by default. It is not a separate problem, it is the purest instance of the general one.

Two rules, both enforceable.

**Repoint consumers first, then retire the store.** Reverse order converts an invisible defect into a visible regression. This is now a DEV_PROCESS clause, not a lane specific lesson.

**Retirement is proven by decline, not by documentation.** A retired path returns a decline or a 404. A CI check fails if the path reappears. Where a parallel store must persist temporarily, a divergence test runs between old and new and fails on disagreement. Documentation that a path is retired, absent these, is the tier1 envelope case: correct prose over a live store, and consumers cannot tell it is dead.

**Paired retirement.** Any migration item that says read from X instead of Y carries a retirement item for Y in the same card, with its own acceptance criteria. Splitting them across lanes requires an amendment naming the orphan. This alone would have caught the tier1 envelope, migrated in July and answering in August.

## Amendments to the housekeeping audit recommendations

The housekeeping return proposed seven remedies, lettered A through G. Five are adopted as written or nearly so. Two are rejected in their proposed form, on the grounds of the audit's own measured base rate.

**Adopted.** Retirement as a first class lane with plan rows, since plan rows are gated and therefore hook shaped. Retired in instrument rather than in prose, covering decline responses, CI greps, divergence tests, and lifecycle fields. Mechanised branch pruning, nested clone detection, and the publish and vanish check as a machine parseable close field. The explore and ship repo boundary, in its pre commit hook form. Repoint before retire as a DEV_PROCESS clause.

**Rejected as proposed, reshaped.** The mandatory leave behind section on WDLL finish cards is a protocol step and will run at the rate protocol steps run. Reshape: a machine parseable required field that blocks close, with an explicit "none" being a valid and cheap answer. The value is in the block, not in the section.

Backlog items graduating or expiring is likewise a protocol step, requiring a human to remember to expire things, which is the failure mode being fixed. Reshape: a scheduled job that flips any P0 or P1 item older than fourteen days without a plan row to expired, automatically, and posts the list. The policy does not need to be followed if the job does it.

**One addition not in the audit.** The audit frames the diagnosis as create being first class and retire being a footnote. That is accurate but narrower than the evidence supports. The unread denominator in the new scorer, the ninety eight tests in no workflow, and the anti zombie doctrine itself are all creation side instances of the same defect. The problem is not that retirement specifically lacks mechanism; it is that nothing in the system distinguishes declared from enforced in either direction. Retirement is simply where the gap is most conspicuous because there is no artifact to inspect.

## Implementation

Doctrine that requires reading will not survive contact with velocity. This document is implemented as follows and is not considered live until each item exists.

1. An agent rules file, platform agnostic, dropped into every repo and loaded by every agent type regardless of harness. This carries the fail closed rules, the three question gate, the retirement sequencing, and the code reading precedence.
2. CI checks per repo: no retired path returns a body, no nested clone under doc_repo, no test asserting an unrecognised authority value, delete branch on merge with a weekly prune that reports.
3. A blocking close field on every lane finish card carrying the leave behind declaration.
4. A scheduled expiry job over the cleanup backlog.
5. The diagnostic battery in 51_ingestion_pipeline_reference run against both substrates, with T-25, T-26, and T-27 run before any output measuring test.

## Sequencing

The first move is not cleaning everything. It is proving the doctrine once, on the highest severity items already diagnosed, in a single card that carries both the migration and the retirement.

Ordering constraint that supersedes convenience: where an accidental condition is the only thing keeping a wrong safety determination off a customer surface, the wrong instrument is retired before any deploy that could disturb that condition, not after. An accident is not a control, and a safety claim outranks a completeness number.


## Open questions

_all ruled 2026-08-19 — see _decisions/2026-08-19_enforcement_open_questions_ruled.md_

## What this doctrine actually buys

One module in the estate was written after this document existed. It produced the only two checks in thirty enumerated rows that hold, and it is worth stating plainly what it did and did not achieve, because the difference is the point.

Three things were done differently. Its lane was instructed to fail closed and to carry a required denominator field holding both a machine readable kind and a prose counting rule, which is why its checks refuse rather than default. It pre-registered five verification bands before running, and one of those bands predicted a defect in its own output, which then fired and was fixed. And it was reviewed adversarially at source rather than accepted on a green build.

It still shipped two defects. A required field that nothing read, and an entrypoint guard that took a service down when bundled.

**So the doctrine does not produce clean code. It produces code whose defects are of a different kind.** A required field nobody wired is found by the next reader within hours. A sentinel silently satisfying a hazard check survived years and 253 canonical rows.

That is the claim to carry, and it is narrower than it sounds in one respect worth being honest about. The comparison is confounded: the newer module was built during a period of maximum scrutiny, by a lane under explicit instruction, and read immediately afterwards by people looking hard. A defect *count* comparison against code written over years under normal conditions proves nothing.

The defect *kind* comparison survives the confounding, because it is a property of the artifacts rather than of when they were made. An unwired required field is visible to anyone who reads the code path. A cheapest satisfier is invisible until someone thinks to ask what the check admits. Those are different observability properties and they do not depend on who was watching.

**The practice most worth extracting is the pre-registration.** Naming, before producing work, the specific ways that work is expected to be wrong, and then checking each one. It is the second mechanism rule applied forward rather than backward, it costs a few minutes, and in the one observed instance it caught a real defect in its author's own output before anyone else saw it.

**The second practice is auditing your own instrument under the rules you are applying to the subject.** It is the only thing that caught anything in this programme's own tooling.

Four defects appeared in one measurement instrument over two days, and each was a shape the instrument existed to find: a single source attestation, a trigger starved by the condition it detects, a conflation of two propositions that were false together, and a check whose precondition its runtime never supplies. Two more instruments produced their own: text searches answering structural questions wrongly three times, and a syntax tree rule producing two distinct false positive classes.

Every one was found by the author turning the criteria inward. External review found none of them first. Continuous integration caught two, but only after the author had already declared them verified, and only because its environment differed from the author's by accident rather than by design.

That last point is the one to hold, because it is easy to read as an argument that external checks work. The external check was downstream of a declaration that was already wrong, so what failed was the verification, not the check. A verification asserted before the check that could falsify it has run is a claim.

The consequence for any count this programme produced: no number should be quoted before the instrument that produced it has had one pass under its own criteria. Where an instrument has had none, its output is a list of candidates rather than a measurement.

**And note what the two genuine external catches actually were.** Continuous integration found two defects the author had already declared verified, and it found them because its clone depth differed from the author's environment. Nobody designed that difference as a check. Separately, a background search begun and forgotten confirmed a negative its author could not have shaped, because they did not know it was still running.

Both real, both load bearing, and both unarranged. That is not a system for finding anything. It is luck that happened to hold twice, and the honest reading is that this programme's external detection rate is close to zero once accidents are excluded.

Which sharpens what the self audit practice is for. It is not a supplement to review. On this evidence it is the primary mechanism, and review is what catches the residue afterwards.

## Revision history

2026-08-20, revision 7. Dual copies reconciled. Numbered-band 61_enforcement_doctrine.md is canon. OPS/61_enforcement_doctrine.md is a pointer. Unique gate sections from the OPS copy (sixth state, reopening condition, evidentiary vs protective value, build-step premise, parallel implementation, wrong-field verification, lossy default path, isolation foreclosure, documented workarounds, commit-by-pathspec, what this doctrine actually buys) enter this file. Unique dated operating-law from the root copy (hook-scope residual, mutation corollary, log corollary, revisions 3 through 6) is kept. Open questions remain ruled 2026-08-19.

2026-08-20, revision 6 following the hook scope fix. Over-broad and under-narrow named as the same root with a silent half. Resolver fallback to process cwd named as an accepted residual. Verify-by-violating contamination: proof events are indistinguishable from counted ones and must be excluded by name. CLOSE_OVERRIDE prospectively writes target and cwd.

2026-08-20, revision 5 following the CLOSE_OVERRIDE count. Added the log corollary: read what a log records rather than what a log of that kind ought to record. Instance: 16 CLOSE_OVERRIDE rows, 11 in one day, identical reason strings, neither seat nor dirty file recorded. Rate is the finding.

2026-08-20, revision 4 following the HY-01 BP-01 deletion attribution. Added the mutation corollary: every state changing operation emits a durable record naming the items acted on, the timestamp, and the invocation. A count is not a record.

2026-08-19, revision 3 following operator ruling on four open questions. Fourth-state gate sharpened to two-party attestation with presence shaped labelling for lone derivations; introduction commit archaeology replaced with deployed-tree anchor plus content match at HEAD; shared stamping point caveat added. Verify-by-violating unified with removal-as-proof for T-24.

2026-08-19, revision 2 following returns from both substrate agents. Added the fourth state, enforced in code and not in production, and sharpened gate question three to require that the failing thing be live. Added gate question four on bypass scope, following an append only control enforced at the ORM and bypassed by a raw connection. Added the verify by violating rule. Added the corroboration integrity correction, downgrading cross substrate confirmations from revision four onward to echo rather than independent evidence, following a flag from the property agent.

2026-08-19, drafted from cross reading three independent agent returns: markets substrate diagnostic, property substrate scan, housekeeping and process audit. Establishes declared is not enforced as the unified finding across data, mechanism, and process levels. Establishes the hook shaped operating law from the measured 1 for 1 against 0 for 3 base rate. Defines the three question gate. Adopts five housekeeping remedies, reshapes two on base rate grounds, and adds the observation that the defect is not retirement specific.
