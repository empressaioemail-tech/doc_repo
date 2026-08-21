## Mission — master planner: consolidate the R-lane returns, resolve them, adversarially review, file ONE report

You are the MASTER PLANNER for this pass. You fan your own agents, you troubleshoot, you
adversarially review everything including your own conclusions, and you produce a single
consolidated report. You commit to doc_repo yourself under the discipline in the last section.

Five lanes ran in parallel on 2026-08-20/21. Four returned. Their work is real and mostly
good, and three of their findings corrected the planner. **Nothing is being rejected.** Your
job is to land it, reconcile what disagrees, finish the halves that were deliberately
deferred, and say in one document what is actually true.

---

## WHERE EVERYTHING PHYSICALLY IS. None of it is committed.

    R-01 blueprint   WROTE DIRECTLY INTO P:/doc_repo
                     _blueprint/{00_README,10_model,20_pipeline,30_lifecycle,
                                 40_rule_register,50_grading}.md, diagrams/
                     _scratch/r01_blueprint.md
                     (00_WDLL.md is COMMITTED at c6399e8 and is the grading standard)

    R-02 census      P:/tmp/r02-census @ 4b174d1 (also copied into P:/doc_repo)
                     _catalog/doc_census.{json,md}, scripts/doc-census.mjs,
                     _scratch/r02_census.md, _inbox/2026-08-21_r02-doc-census_{cp1,cp2,close}.json

    R-03 parts       P:/tmp/r03-parts @ 4b174d1
                     _catalog/parts_inventory.{json,md}, scripts/build-parts-inventory.mjs,
                     _scratch/r03_parts.md, _inbox/2026-08-21_r03-parts_{cp1,cp2,close}.json

    R-04 controls    P:/tmp/r04-controls @ 4b174d1
                     _catalog/tooling_register.{json,md}, _scratch/r04_controls.md,
                     _inbox/2026-08-21_r04-controls_{cp1,cp2,close}.json
                     ALSO modified tracked files _catalog/canon_divergence.md and
                     _catalog/repo_intents_checks.json. Establish whether those are side
                     effects of RUNNING a control (canon-divergence writes a file) or scope
                     creep, and say which.

    R-09 gate repair P:/seat-worktrees/property/legacy-design-tools on seat/property.
                     STILL RUNNING as of 2026-08-21T01:15Z. Commits 3f05a72d and merge
                     6fea02c5. Mid-flight scratch at _scratch/r09_gate_repair.md.

**Losing a throwaway worktree loses uncommitted work. Preserve first, analyse second.** That
ordering is not optional; it has cost this operation four filed incidents.

---

## ALREADY VERIFIED BY THE PLANNER — do not re-derive

Three lane claims contradicted the planner. All three held. Two were the planner's error.

1. **SEAT-01 had never fired.** `.cursor/hooks/seat-gate.mjs` imported `../scripts/...`, which
   from `.cursor/hooks/` resolves to `.cursor/scripts/...`. Registered on shell and write, it
   threw ERR_MODULE_NOT_FOUND every invocation and exited 0. Fixed at `8c386a9`, then narrowed
   at `5e9385a` because the armed version was over-scoped and refused writes to non-repo
   scratch. **Consequence for you: worktree discipline is now genuinely enforced.** Register a
   worktree in `_catalog/seat_register.json` BEFORE writing from it. Registering afterwards
   does not cure a write already made.

2. **`cited-untracked` was misread by the planner.** The baseline said 1,108 hits of real debt.
   In a CLEAN checkout it is **2, both the literal string `.git/` matched out of prose**. Real
   canon defect: zero. The integration-tree figure measures the planner's own untracked files.

3. **The memory promotion gate fired**, backlog 64 to 67. Three lesson files triaged into
   `_catalog/memory_promotion_log.jsonl`; M-003 is in `MEMORY.md`.

**A warning about verification, from three of the planner's own failures today.** A regex built
by shell string concatenation compiled to an alternation with an empty branch and matched every
input. A hash comparison ran against a path that did not exist and reported MISSING for every
marker. A seat-gate violation test used an MSYS path Windows node cannot resolve, so git
failed, a fallback produced the expected deny, and the bug was recorded as proof the fix
worked. All three shared one shape: **the check returned the answer that was wanted, so it was
not interrogated.** Assume your instruments carry one like it and go looking.

**Two more findings from the last hour, both live, both yours to resolve.**
`.claude/hooks/dispatch-template-gate.ps1` globs `_dispatches/` and requires a canon marker on
anything written there, so it refused a MISSION INPUT, which has no marker by definition
because the compiler adds it. And it is registered on the Write tool only: five mission files
reached `_dispatches/` via `cp` in Bash and were never inspected. Same shape as the canon gate
firing only on the Agent tool. A control scoped to one tool is bypassed by every other tool
that reaches the same state.

---

## THE WORK. Roughly this order; you own the sequencing.

### 1. Preserve, then land

Get every lane artifact into the estate. **Explicit pathspecs.** On 2026-08-20 a
`git add _scratch/` staged 528 files and 208,108 lines of scraped HTML, and a
`git add _dispatches/` swept 25 unrelated lane files. Both were caught only by reading
`git diff --cached --stat` before committing. Do that, every time.

`_scratch/` is gitignored except top-level `.md`. Respect it; do not commit probe dumps.

### 2. Resolve three disagreements. At most one number in each is right.

**Duplicate ids: planner 20, R-02 says 7, R-04 says 8.** Establish the true count and, more
usefully, the true CLASSIFICATION. A pointer pair is benign; two live diverged bodies is the
defect that produced the `51_ingestion_pipeline_reference` incident, where the same `id` and
frontmatter sat on two different bodies and the planner committed one calling it "the spec."

**R-02 contradicts itself.** Its close says 1,998 files with 702 at consumer NONE. Its scratch
says "two `.claude/skills/*.md` are the only true consumer NONE in a 2,406-file estate."
Different denominators, irreconcilable conclusions. One is a different question answered under
the same label. Find which, and state what the census actually measured.

**`hasFrontmatter`: planner 365, doc-staleness 319, census 321.** Three instruments, one
question, three answers.

### 3. Grade R-01 against its own standard. Nobody has.

`_blueprint/00_WDLL.md` defines D1-D7 and violations V1-V15. Grade criterion by criterion and
**be willing to fail it.**

**D4 decides whether the blueprint is a north star or an artifact.** For each of V1-V15: does
the blueprint identify it as failing, naming the rule id, the section carrying it, and the
sentence that fails it? Where it cannot, that is a MISSING RULE to file, not a defect to hide.
V10 (a factory can be started, none can be ended) is expected to land there.

Note the shape first: only V2, V4, V6 and V13 are wrong VALUES. The other eleven are correct
artifacts that nothing feeds, nothing reads, or nothing can fail against. A blueprint tuned to
catch bad data passes four and misses eleven.

**D1 specifically:** does the mesh classify the published `@empressaio/atom-contract` type
surface at 1.22.0? It is not a document and it is the only artifact here that refuses to
compile, which makes it the most authoritative thing in the estate.

**D2 specifically:** does `10_model.md` rule on EACH of the four framings (77, ADR-001+010,
ADR-020, 51) as adopted / adopted in part / superseded? Silence on any is a fail.

### 4. Finish the two deferred halves. Both were blocked on the blueprint, which now exists.

**R-02 second half, quarantine.** Documents contradicting the blueprint move to `_quarantine/`
naming the rule contradicted. **Move, never delete.**

**R-04 second half.** Map blueprint rules onto the control register: every rule names a
consumer, or is listed UNENFORCED with a build item against it.

### 5. Work the R-04 build items

Confirmed live: the canon gate fires on the Agent tool, so a hand-carried prompt never touches
it; the M4 check has the compiler write a hash marker into `AGENT_CONTRACT.md` and the gate
read that same marker back out of the same file, so one party satisfies both sides; the
dirty-tree close gate blocked a push whose own command was committing the file it complained
about; `seat-register` is FALSE-GREEN in the baseline; doc_repo main has no required status
checks; plus the two dispatch-template-gate findings above.

Fix what is cheap and safe, file what is not. **Every control you touch or add is proven by
violating it**, and the violation goes in the report. Never RAISE a `baselineExit` to turn a
red build green.

Cheapest win available: fix the `cited-untracked` matcher so a prose mention of `.git/` is not
a citation, drop its baseline to 0, move it to BLOCKING.

### 6. R-03's actual output

Ten parts have `terminationCondition: NONE`, fourteen are ZOMBIE, five repos are UNASSIGNED in
`seat_register.json`. Triage each. "When superseded" has no executor and is NONE with extra
words. **The UNASSIGNED repos are the urgent half:** an unowned repo is a write collision
waiting to happen now that SEAT-01 actually fires.

### 7. R-09

**Check whether it has closed before touching anything in `legacy-design-tools`.** If it is
still live, leave it alone and say so: a second agent in that worktree is a collision the gate
will NOT catch, because it checks worktree and branch and does not prevent two occupants.

If closed: review against its mission. Its done condition is a FIRING with a live payload and a
cell id, not a reading of the write path. Its scratch carries an OPEN: a deploy plus POST
recompute is needed before a live GET reflects the repair, and the default GET still serves a
2026-08-14 snapshot. **Deploys are planner-owned and yours, never escalated to the operator.**
Production traffic shifts are not: canary with `--no-traffic`, smoke, report.

### 8. The adversarial pass. This is R-05 and it is the point.

Everything above, including your own conclusions, gets refuted rather than confirmed.

For every finding: state the mechanism you believe explains it, then a second mechanism that
would produce the same observation and why you rejected it. Stopping at the first plausible
explanation is the documented recurring error here.

Where a lane reports something verified, ask what it violated to establish that. Where it
reports an absence, ask which catalog it enumerated rather than grepped. **Absence and
starvation look identical from outside and have opposite fixes; in this estate, empty is the
more likely answer.**

---

## THE CONSOLIDATED REPORT. One document. This is the deliverable.

`_inbox/2026-08-21_R-lanes_consolidated_report.md`, written for an operator who has read no
lane return. Prose over bullets. It carries:

**What is now true** as one reconciled picture, not five lane summaries. Where lanes disagreed,
the resolved number and how you resolved it.

**The R-01 grade**, D1-D7, with the D4 table across all fifteen violations and the missing
rules that fell out.

**What was fixed**, each with its violation proof.

**What is filed and not fixed**, each with an owner and a plan row.

**What this pass could NOT have found.** An unread path is work remaining; an unobservable
population is a permanent limit. Conflating them makes a report read as nearly complete when
part of it is unmeasurable by construction. State the second list explicitly.

**Where you think the planner or a lane is still wrong**, including on things already
corrected. Reporting that a planner figure is wrong is a successful outcome here.

**Your answer on OPS-18's reversal criterion.** The plan says retire at R-08 or fold remaining
rows into OPS-16 or OPS-17, and warns that a governance plan outliving its own repair becomes
the artifact class it was built to remove. R-04 is the natural point to ask whether the
remaining rows still earn their place. Answer it.

Update `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` row statuses, and file
decision records for anything ruled.

---

## Discipline

**Fan freely, but you own the fan.** A coordinator that spawns workers and returns abandons
them. Workers do not spawn workers. Workers do not commit.

**You commit to doc_repo**, only under this discipline: `git log -1` and `git fetch` before
staging, because this tree moved four times in one hour on 2026-08-20 and repeatedly since;
explicit pathspecs only; read `git diff --cached --stat` before every commit; one commit per
coherent unit, with a message saying what was verified and how.

**Read-only in any product repository whose seat you do not hold.** `P:/legacy-design-tools` is
dirty on `feat/s1-instrument-hardening` with 63 files: never clean, stash, or commit from it.

**No store writes. No migrations. No `--apply`. No traffic shifts. Nothing is deleted;
quarantine moves.**

If CI goes red, that is the system working. Fix the cause. Do not raise a pin, do not add
`continue-on-error`, and do not use `CLOSE_OVERRIDE` without recording why in the report.

Close with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
