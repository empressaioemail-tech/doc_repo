## Mission — R-01 canon reconciliation, produce the master blueprint

Read `_blueprint/00_WDLL.md` first and in full. It defines done for this row. You are graded
against its seven criteria, not against your own sense of completeness. If you cannot meet a
criterion, say so against that criterion by name rather than producing something adjacent.

Snapshot: doc_repo `54970f3`, branch main. Re-verify with `git rev-parse HEAD` before you
start and declare what you actually got, because this tree moved four times in one hour on
2026-08-20.

### What you are building

`_blueprint/` per the structure in the WDLL: `00_README.md` (the mesh), `10_model.md`,
`20_pipeline.md`, `30_lifecycle.md`, `40_rule_register.md`, `50_grading.md`, `diagrams/`.

### The three things most likely to go wrong, and how

**One. You will treat this as a design exercise. It is a wiring exercise.** Almost nothing
here is missing. The store audit at `_inbox/2026-08-20_store_audit_atom_graph.md` found
`atom_links` built, correctly shaped, indexed four ways, holding 33,066 rows and zero
property edges. It found ten shipped atom-contract fields at zero in production. The
enforcement scripts existed for weeks with no CI. If your blueprint reads as a proposal for
things to build, you have written the wrong document. It should read as a statement of what
correct is, plus a register of which parts of it currently have an executor.

**Two. You will index only markdown.** D1 requires the published
`@empressaio/atom-contract` type surface in the mesh. It is at 1.22.0 on npm, it is not a
document, and it is the only artifact in this estate that refuses to compile, which makes it
the most authoritative thing here. Fetch it (`npm pack @empressaio/atom-contract@1.22.0`)
and read the `.d.ts` surface. Rule explicitly where it disagrees with an ADR. Note that
1.9.0 through 1.22.0 have no ADR at all and `./property`, `./reasoning` and `./testing` are
undocumented subpaths.

**Three. You will resolve the four-way model conflict by picking the nicest wording.** D2
requires a ruling with reasons, on each of the four framings, stating adopted, adopted in
part, or superseded. The disagreement decides where the volatile half of a relation lives.
That is not cosmetic: it is the question that produced 20,844,039 special-district rows
against 13,717,341 parcels. Silence on any of the four is a fail.

### The criterion that decides whether this worked

D4. Take each of V1 through V15 and demonstrate the blueprint FAILS it, naming the rule id,
the section carrying it, and the sentence that fails it. Write the demonstration down.

Where the blueprint cannot fail a violation, do not adjust the blueprint to make it fail.
Record it as a MISSING RULE and file it as an R-04 build item. V10, the factory with no
off-ramp, is expected to land there.

Note the shape of that set before you start: only V2, V4, V6 and V13 are wrong values. The
other eleven are correct artifacts that nothing feeds, nothing reads, or nothing can fail
against. A blueprint tuned to catch bad data will miss two thirds of the list.

### Rules of method

Enumerate the catalog; do not infer structure from the shape of somebody else's query. On
2026-08-20 the planner asserted no link table existed by inferring it from an orphan query.
`atom_links` had been in production the whole time. Distrust your own negative results most.

Absence and starvation look identical from outside and have opposite fixes. Before reporting
anything as missing, check whether it exists and is empty. In this estate, empty is the more
likely answer.

Verify by violating. A check observed only passing has not been observed working. On
2026-08-20 a verification regex compiled to an alternation with an empty branch, matched
every input, and reported success into a commit message.

For every finding, state the second mechanism that would produce the same observation and
why you rejected it.

Pre-register at least two ways your own output could be wrong before you start, and report
the results of those checks whether or not they were favourable.

### Scope fence

No product code. No migrations. No store writes. No new ADRs. No changes to OPS-16 or
OPS-17. Nothing is moved or deleted in this row; quarantine is R-02. No decision is
reversed: where two accepted decisions genuinely conflict, file the conflict for the
operator rather than picking a winner.

### Return

Write `_blueprint/` files in the working tree and leave them uncommitted. Do not `git add`,
commit, push, or open a PR. The planner commits, because that forces reading the artifact.

Return a close naming: the commit you worked at, which of D1 through D7 you met, the D4
demonstration table, every violation you could NOT make the blueprint fail with its proposed
missing rule, and a Tier 2 scratch block at `_scratch/r01_blueprint.md` using LESSON,
DEAD-END, GROUND-TRUTH with timestamps, and OPEN.

End with a `leave_behind:` block. `none` is a valid and cheap answer; the declaration is
required regardless.
