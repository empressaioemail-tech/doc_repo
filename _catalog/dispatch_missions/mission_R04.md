## Mission — R-04 (first half): the control census

You are a PLANNER. You fan workers, you adversarially review what they hand back, and you
assemble the result yourself. You do not commit.

### Scope fence

This row has two halves and you run only the first. The second half maps blueprint rules onto
controls, and the blueprint does not exist yet: R-01 is producing it in parallel with you.

So you are answering one question: **what controls exist in this operation, and what does
each actually enforce?** You start from the controls, not from the rules. When the blueprint
lands, the two halves join.

**Build nothing.** If you find a gap, you file it. A control invented mid-census cannot have
been observed working.

### Work in your own worktree

`git worktree add --detach P:/tmp/r04-controls P:/doc_repo`. Four lanes run against this repo
simultaneously. Declare the commit you got. Read-only against product repositories.

### Per control, these fields, none omitted

    id                stable, citable
    name
    location          exact path
    statement         what it enforces, one sentence, imperative
    consumer          the script, hook, CI job, type, or blocking field that EXECUTES it
    trigger           the commit, merge, write, deploy, schedule, or tool call that fires it
    failure           what actually fails when it is violated
    bypass            every path that reaches the same state without passing through it
    violationVerified date + what was injected, or null
    derivationClass   two-independent-sources | source-vs-our-derivation |
                      internal-consistency | presence-shaped
    status            ENFORCED | UNENFORCED | DORMANT | STARVED | OVER-SCOPED | FALSE-GREEN

### The two fields that carry the weight

**bypass.** The answer is rarely none. An ORM listener is bypassed by a raw connection. A CI
grep is bypassed by anything not passing through CI. A rules file is bypassed by any harness
that does not load it. **Worked example you must reproduce and extend:** `canon-gate.ps1`
fires on `$toolName -eq 'Agent'` for its PLAN-ROW check, so a dispatch pasted into another
agent by hand never touches it. Most dispatches in this operation's history travelled that
way. That is the honest scope of the hook, not a bug in it, and it belongs in the register.

**derivationClass.** A check whose two sides come from one artifact is internal consistency
and catches transcription errors, not wrong sources. **Worked example you must reproduce:**
the canon gate's M4 contract check. `scripts/dispatch.mjs` hashes the AGENT_CONTRACT body and
writes a marker into that same file; `canon-gate.ps1` then reads the marker back out of that
same file and compares it to the dispatch. One party satisfies both sides. On 2026-08-20 the
marker was found stale at `v7b714e95` against a body hashing to `v92aa194c`, meaning the
contract had been edited and the gate had been validating against text that had moved.

### Where the controls are

`.claude/hooks/` (seven files, five registered in `.claude/settings.json`, two are `_`-prefixed
helpers). `.cursor/hooks/`. `.cursor/rules/*.mdc`. `scripts/enforcement/` (eight scripts).
`scripts/` (dispatch, canon-divergence, doc-staleness, gate-grade, plan-registry-divergence,
stall-watchdog, product-surface-smoke, hygiene/, state/). `.github/workflows/enforcement.yml`
and `.github/enforcement-baseline.json`. Branch protection settings on each repo. Type-level
controls in `@empressaio/atom-contract` (a discriminated union the compiler enforces IS a
control and belongs in this register). Workflows in the six product repos that have them.

Enumerate by reading directories and settings files. A grep that finds nothing is not proof.

### Nine items already filed against this row

Carry these in and confirm or refute each rather than rediscovering them:

1. No duplicate-`id` check exists; 20 ids are claimed by 2+ files
2. `cited-untracked` pinned at exit 2, 1,108 hits, needs graduation to blocking
3. `doc-staleness` pinned at exit 1, needs graduation
4. C-00 compares two vehicles; a third existed until 2026-08-20 and was invisible to it
5. `canon-divergence` writes a file, so it needs a check-only mode before it can block
6. `seat-register` passes but has never been violation-verified
7. The memory promotion gate counts files, not individual lessons
8. The M4 internal-consistency problem above
9. The canon gate hand-carry bypass above

### Fan discipline

Split by control LOCATION so two workers never write the same row.

Adversarially review every return. When a worker reports a control ENFORCED, ask what it saw
fail. When a worker reports bypass NONE, push back hard: that answer is almost always wrong
and is the single most valuable field in the register. When a worker reports
`violationVerified`, ask what was injected and what the exit code was.

Workers do not spawn workers. Workers do not commit. You do not commit.

### Method

Verify by violating where it is safe and read-only to do so. Where violating a control would
touch production, a deploy, or a store, DO NOT violate it: record `violationVerified: null`
and file the verification as a build item. Never violate a control on a live surface to prove
a point.

For every finding, state the second mechanism that would produce the same observation and why
you rejected it.

Pre-register at least two ways your census could be wrong before you start.

### Return

`_catalog/tooling_register.json` and `_catalog/tooling_register.md`, uncommitted in your
worktree, plus a close naming: the commit you worked at, counts by status and by
derivationClass, **every control whose bypass field is non-empty**, and every control you
found that nothing in this mission named, which is the measure of whether the enumeration
reached further than the brief.

Tier 2 scratch to `_scratch/r04_controls.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
