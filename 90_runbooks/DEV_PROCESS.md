<!-- DEV-PROCESS vae9ea662 — hash maintained by scripts/dispatch.mjs; do not edit this line by hand -->

# DEV PROCESS — how we work

The companion to `90_runbooks/AGENT_CONTRACT.md`. The contract governs how a lane AGENT behaves.
This file governs how WORK IS SHAPED before an agent ever sees it, and how a result is judged after.
Both compile into every dispatch and both are hash-versioned; update here, rerun the compiler, and
every future dispatch carries the change.

**Every rule below is traced to an incident.** Nothing here is a preference. If a rule has no incident
attached, it does not belong in this file — it belongs in a style guide nobody reads.

## 0. The measured base rate — the reason this file exists

In this repo, **hook-shaped controls run 1-for-1 and protocol-step controls run 0-for-3.** The
session-close grading rung ran 0 of 215 sessions and was deleted rather than repaired. The `_inbox`
sweep instruction in `_inbox/README.md:62` has never run in twelve weeks.

Consequence, and it is the governing rule of this document: **a control that depends on someone
remembering is not a control.** When you find yourself writing "the agent should remember to X",
stop and write a script, a hook, or a required artifact field instead. If it cannot be mechanized,
say so explicitly and accept that it will not happen reliably.

## 1. Rules for numbers

**1.1 A coverage figure travels with its denominator or it does not ship.**
*Incident:* G0 reported "366 violations". It had scanned 852 of 1,955 markdown files — 43.6%. G0 did
publish its exclusion list, in both the script and its close; the headline simply travelled without
it and the planner propagated it into the next brief. The failure was not concealment. It was a
number that read like full coverage escaping its rule.

**1.2 Every ratio carries its counting rule inline, at the point of use.**
Not in an appendix, not in the script, not in the close's methodology section. Next to the number.
*Incident:* "26 of 47" drifted for three sessions because its method was unstated.

**1.3 Measure the class you are reporting; never derive it by subtraction.**
*Incident:* twice in one lane, `untracked` was derived as `fs − tracked`, so deliberately gitignored
confidential PDFs read as omissions. Two independent sub-agents caught the same planner error.
The adopted rule: **four measured values** — `fs` (`find -type f`), `tracked` (`git ls-files`),
`untracked` (`git ls-files --others --exclude-standard`), `ignored`
(`git ls-files --others --ignored --exclude-standard`). Never three plus a subtraction.
The identity `fs = tracked + untracked + ignored` must hold, and where it cannot — files inside a
nested foreign clone are invisible to the parent git entirely — say so rather than forcing it.

**1.4 Two numbers that should agree and do not is a free finding.** Reconcile it; never round it off.
Numbers that disagree are the cheapest defects available, and they are found by reconciliation rather
than by usage.

**1.5 State the environment or state the extrapolation factor.**
*Incident:* a write benchmark on a throwaway empty schema measured the CODE; the same code on the
production table measured the SYSTEM. They were 3.9x apart, and a 63x headline was really ~16x.

**1.6 A count taken over a moving target carries its snapshot caveat.**
*Incident:* `_inbox` measured 2,620 / 2,621 / 2,623 / 2,626 within a single session because concurrent
work was writing into it.

## 2. Rules for instruments

**2.1 An instrument's exclusion set is part of its contract and must be stated where its output is read.**
*Incident:* `scripts/doc-staleness.mjs` silently excludes `_decisions`, `_catalog`, and `_research` —
so the decision set and the entire control plane are unwatched by the instrument built to watch the
repo. Found by a sub-agent, not by the instrument's author.

**2.2 A gating indicator is tested for its ability to FIRE before it is trusted.**
*Incident:* a flood verdict predicate silently passed every case for a night because its own safety
string matched the writer's help text. *Incident:* the STALE pill was deliberately backdate-tested
before being relied on. A test that cannot fail for the right reason is a defect, not a test.

**2.3 Prove the negative case on the real exit code, not on a pipe's exit code.**
*Incident:* `node … | tail -2; echo $?` reported 0 for a command that had correctly exited 1. The
gate looked broken-open when it was working, and the reverse is equally possible.

**2.4 Paired controls need a divergence test, not two careful edits.**
*Incident (CTRL-1):* the compiler and the canon-gate hook were two implementations of one rule. The
planner taught the compiler about `G-` rows and never touched the hook, so **every OPS-17 dispatch
passed PLAN-ROW validation unvalidated**. The fix was not a patch to both — it was
`_catalog/plan_registry.json` as a single source of truth plus
`scripts/plan-registry-divergence.test.mjs`, which failed on its first run against a real leftover.
**Rule: when one rule has two implementations, the divergence test IS the control. Adding a plan means
editing one data file, never two code paths.**

**2.5 Fixing one fail-open can expose another. Re-run the whole negative suite after any control fix.**
*Incident (CTRL-3):* with CTRL-1 fixed, `G-9999` still passed — because both consumers scanned an
amendment row for a bare token, and the amendment DOCUMENTING the CTRL-1 bug quoted `G-9999` in its
prose. Writing the defect report granted the defective row dispatch authority. Fail-opens were stacked
two deep, and the second was invisible until the first was closed.

**2.6 A source file that is parsed by a tool has a character set, and it is a hard constraint.**
*Incident:* three em dashes in `canon-gate.ps1` broke PowerShell 5.1's ANSI parse from that line
onward, **silently disabling the entire hook**. Detected only because every negative-test case
returned exit 1 instead of the expected 0 or 2. The repo's no-em-dash convention has teeth in hook
source, not just in prose.

## 3. Rules for dispatching work

**3.1 No dispatch without a plan row.** Enforced by `scripts/dispatch.mjs` and the canon-gate hook,
both reading `_catalog/plan_registry.json`. A hand-assembled dispatch is blocked by design, and that
block is the system working.

**3.2 The brief's numbers are the planner's, and the planner is often wrong. Say so in the brief.**
*Incident:* the G0 brief asserted that doc 33a ruled on five documents. At source it ruled on three;
one was called superseded in prose but deliberately excluded from the retirement item, and one
appeared nowhere in 33a at all. The lane planner checked and routed both to the operator instead of
guessing. **Every brief states explicitly that reporting a planner figure as wrong is a successful
outcome.** A brief that projects false confidence gets believed.

**3.3 Name what is out of scope, not just what is in scope.**
*Incident:* G0's mandate did not exclude the other 35 directories — it simply did not mention them,
and 4,700 files went unexamined while the close read as complete. "Unmentioned" is the failure state;
"out of scope" is a valid and required classification.

**3.4 Catalog before mutating when the blast radius is large.**
A pass that both maps and mutates thousands of files is one where a mistake is hard to unwind. The map
tells you which sweeps are even safe.

**3.5 Every lane carries a frozen acceptance card, written at dispatch and never edited.**
The lane's own definition of done, in its own words. Drift becomes visible by comparison. From the
Smart Site v0 practice.

**3.6 Every lane and shared leg has a named owner before dispatch.** "Unassigned" is a blocking state,
not a default. A shared dependency with no owner becomes nobody's.

## 4. Rules for verification

**4.1 Verify at source, including your own dispatch's context block.** Counts live behind queries,
never behind prose. Store truth beats artifacts. This applies to a planner reading a lane's close as
much as to a lane reading a brief: **a report is a claim until the reader has run the check.**

**4.2 Verification never delegates downward.** A lane planner verifies its sub-agents; the operator's
planner verifies the lane. Nobody verifies themselves as the final word.

**4.3 An empty result is not an absence.** Only a positive determination writes an absence, and every
absence carries its basis. Silent fallbacks are the defect class this program hunts.

**4.4 Code-done is not customer-done.** A grade is a live probe on the deployed surface, never a merged
PR. A new revision is not the serving revision until verified.

**4.5 Report what IS. When a fix produces no gain, that is data.** Never tune to an expected number.
Pre-register expected bands where possible; a result outside the band is a finding either way.

## 5. Rules for artifacts

**5.1 A close artifact is machine-checkable and lands at the exact path the dispatch named.** Minimum
contents are specified in AGENT_CONTRACT section 6.

**5.2 An honest partial close beats a narrated full close.** Say what remains open. A close that
claims completeness it does not have costs more than the work it skipped.

**5.3 Findings that are not in scope go to a durable backlog, not into prose.**
`_catalog/repo_cleanup_backlog.md` is the worked example: one row per item, with evidence, proposed
disposition, and rough size.

**5.4 Propose; do not unilaterally remediate.** Structural violations, retirements, and deletions are
operator rulings. *Incident:* a ruling to delete a stale clone has sat in `.gitignore:12-13` verbatim
and unexecuted — but the correct response was still to ask, because the clone is of a
business-critical repo and nobody had read it.

**5.5 Back up anything untracked before removing it.** Git history cannot recover what git never had.

## 6. Rules for durable state

**6.1 A guardrail that does not survive a clone is not a guardrail.**
*Incident:* nine `status: active` masters governing the customer-facing product — two carrying the
binding approved-claims registers and never-say lists — were entirely untracked, matching no ignore
rule. They existed on one machine. Nothing errored; the guardrail was simply absent, silently.

**6.2 One authoritative copy. A duplicate is a future contradiction.**
*Incident:* a shadow copy of the ratified masters differed in five of six files and said government
pricing was "an operator decision" while the authoritative set said SET, with prices already submitted
as MSRP. An agent reading the stale copy would have told a prospect the wrong thing.

**6.3 Correct live state resting on something not durable is a defect, even when it works today.**
*Incident:* the K5 statewide-tiles change was uncommitted on an already-merged branch; production was
correct, but any redeploy from a clean checkout would have silently reverted it.
*Incident:* a retrieval key hand-synced in two places drifted twice, breaking MCP once and PE once.

**6.4 Ask what would PUBLISH or what would VANISH — not only what someone thought to ask about.**
*Incident:* the two highest-severity findings of the cartography lane were on nobody's brief: a root
`.vercel` link that would have published the entire private repo, and nine masters that would vanish
on a fresh clone. Neither was a doc-staleness problem, which is all the mandate had asked about.
**Standing check for any audit: what here could be published that must not be, and what here would be
lost if this machine died?**

## 7. What this file does not cover

Lane agent behavior (AGENT_CONTRACT). Program scope and rows (the plan of record). Doc conventions
(`01_doc_conventions.md`). External claims discipline (the masters' approved-claims registers).

## Revision history

- v0, 2026-08-14. Built from the G0 and G0-B closes rather than from first principles. Every rule
  traced to an incident from those two lanes, the control-plane fixes (CTRL-1/2/3), or the measured
  base rate. Rules with no incident attached were deliberately excluded.
