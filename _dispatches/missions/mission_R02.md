## Mission — R-02 (first half): the doc consumer census

You are a PLANNER. You fan workers, you adversarially review what they hand back, and you
assemble the result yourself. You do not commit.

### Scope fence, read this before anything

This row has two halves and you are running only the first. **The census is independent of
the blueprint. The quarantine is not.** R-01 is producing the blueprint in parallel with you;
until it lands, nothing can be declared to contradict it.

So: classify and measure. **Move nothing. Delete nothing. Quarantine nothing.** If you find a
document that plainly contradicts another, record the pair and the contradiction as data. The
ruling is not yours.

### Work in your own worktree

`git worktree add --detach P:/tmp/r02-census P:/doc_repo` and work there. Four lanes are in
flight against this repo simultaneously and the tree moved four times in one hour on
2026-08-20. Declare the commit you got.

### What you produce

`_catalog/doc_census.json` and a human-readable `_catalog/doc_census.md`, in your worktree,
uncommitted.

One row per markdown file in doc_repo. For each:

    path
    id                  from frontmatter, or null
    title               from frontmatter, or null
    status              from frontmatter, or null
    lastUpdated         from frontmatter, or null
    hasFrontmatter      boolean
    tracked             boolean, from git ls-files
    citedBy             paths of tracked files that link to or name this one
    citesUntracked      paths this file cites that are NOT tracked
    idCollision         other paths claiming the same id
    consumer            THE POINT OF THIS EXERCISE, see below

### The consumer field is the deliverable, not the row count

For every document, name what READS it. Not who should. What does.

    HOOK        a .claude/hooks or .cursor/hooks entry loads or checks it
    CI          a workflow or a script in a workflow reads it
    HARNESS     loaded automatically into an agent context (CLAUDE.md, AGENTS.md,
                .cursor/rules/*.mdc, anything imported by those)
    COMPILER    scripts/dispatch.mjs or another generator reads it
    ROUTED      a HARNESS document names it in a read-first list, so an agent is told to
                open it. Weaker than HOOK; record it as its own value, never as CI.
    CITED       other documents link to it and nothing executes on it
    NONE        nothing found

`NONE` is a legitimate and expected answer for most of the estate and is the finding, not a
failure. Do not inflate a document to CITED because it feels important.

Establish HOOK, CI, COMPILER and HARNESS by reading the loader, never by inference. Grep for
a filename that finds nothing is not proof of NONE; enumerate the loaders and read each one.

### Known measurements to reconcile against, not to trust

Live on 2026-08-20 at doc_repo `e1fdc92`: `scripts/enforcement/cited-untracked.mjs` exits 2
with **1,108** hits. `scripts/doc-staleness.mjs` exits 1 and reports **365** files with no
frontmatter. Twenty distinct `id` values are claimed by two or more files.

If your census disagrees with any of those, that is a result and you report both numbers with
the method that produced each. Do not quietly adopt mine. One of the twenty duplicate ids was
two live diverged bodies of the ingestion reference and it was found by accident.

### Fan discipline

Split by directory, not by question, so two workers never write the same row. Give each
worker its own worktree.

Adversarially review every worker return before you accept it. When a worker reports a
document has consumer NONE, ask which loaders it enumerated. When it reports CI, ask which
workflow file and which line. A subagent will not audit itself unprompted and a report of
success is a claim.

Workers do not spawn workers. Workers do not commit. You do not commit.

### Method

Enumerate the catalog; never infer structure from the shape of a query. On 2026-08-20 the
planner asserted a link table did not exist by inferring it from someone else's orphan query.
The table had 33,066 rows the whole time.

Absence and starvation look identical from outside and have opposite fixes. Before reporting
a document as unread, check whether a loader names it and is itself unloaded.

Pre-register at least two ways your census could be wrong before you start, and report those
checks whether or not they were favourable.

### Return

`_catalog/doc_census.json` + `.md` uncommitted in your worktree, plus a close naming: the
commit you worked at, total files, the distribution across consumer values, the twenty
duplicate ids with whether each pair is a pointer pair or two live bodies, and the three
documents you think are most dangerous to leave at consumer NONE, with why.

Tier 2 scratch to `_scratch/r02_census.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.
