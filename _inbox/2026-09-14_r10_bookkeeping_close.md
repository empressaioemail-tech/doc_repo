---
title: R-10 close — the G-116 / G-117 governance record was written, then stranded on an unmerged local branch
date: 2026-09-14
plan_row: R-10
plan: OPS-18
lane: r10-bookkeeping
status: complete, with the mission premise corrected
kind: findings-register
repo: doc_repo
owner: nick
---

# R-10 findings register

## Snapshot

Wrote in `P:/doc_repo`, branch `main`, commit `94c5ad5f` (2026-09-14 13:04:36 -0500). Re-read the
plan of record at 2026-09-14 13:25:27 CDT. Nothing was committed.

Product repos were read at `origin/main` only, never the working tree, via
`git -C <repo> show origin/main:<path>`. Both remote-tracking refs were verified equal to the live
GitHub tips before any read: `smartcity-dashboards` `86487fa962173d5bd5deb5258b500e4e6b7d4e4f`,
`smartcity-os` `332a16c9b2600ff62a4bbeef387358bea3c29594`, each matching
`gh api repos/.../commits/main --jq .sha` exactly. No fetch was needed and none was run. Nothing was
written, edited, committed or pushed in any product repository.

Second doc_repo clone `C:/Users/cente/doc_repo` read at `d07fd452`.

---

## The headline: the mission's premise is false, and the truth is worse

The dispatch says three cited decision records "do not exist" and instructs me to reconstruct them
from source while never asserting what was decided.

**All three exist.** They are complete, operator-owned decision records carrying the operator's own
verbatim quoted reasoning. They were written on 2026-09-03 and 2026-09-04, on the day the work
shipped. They sit on `seat/govtech` — a branch that was **never merged to `main` and never pushed to
`origin`**. It exists on one local disk in `P:/doc_repo` and nowhere else on earth.

This is not a bookkeeping failure. The bookkeeping was done, and done well. It is a **delivery**
failure, and the artefact that failed is a git branch.

### How I found it, and why the prior recon did not

The prior recon (`_inbox/2026-09-14_g52_mygov_v2_recon.md` §9) checked both clones' working trees,
enumerated every `_decisions` file dated 2026-09-03 and 2026-09-04, and ran filename searches. All
correct, all negative. It then said so explicitly, under "What I could not determine and why":

> "I did not search either clone's git history for a deleted or never-committed file... Absent from
> both working trees is what I verified; never authored is a stronger claim I am not making."

That restraint is the reason this was recoverable. The recon named the exact gap it had left, and the
gap was the whole answer. The instrument that closed it:

```
git log --all --pretty=format:'%h %ad %s' --date=short --name-only --diff-filter=ADRM \
  -- '_decisions/*platform_read*' '_decisions/*bastrop_tx*' '_decisions/*dashboards_pack*' \
     '_decisions/*leaflet*' '_decisions/2026-09-03_*' '_decisions/2026-09-04_*'
```

`--all` is the load-bearing flag. Every prior search was scoped to `HEAD` or the filesystem.

### The three records, located

| Cited path | Introducing commit | Position | Reachable from `main`? |
|---|---|---|---|
| `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md` | `24bc5b52` 2026-09-03 | `seat/govtech~18` | **NO** |
| `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md` | `7ff630ca` 2026-09-03 | `seat/govtech~21` | **NO** |
| `_decisions/2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md` | `607e12eb` 2026-09-04 | `seat/govtech~5` | **NO** |

`git merge-base --is-ancestor` returns non-zero for all three against `main`.
`git branch -a --contains` returns exactly one ref for each: `seat/govtech`.
`git ls-remote --heads origin` has **no govtech ref at all**.

### Mechanisms considered and rejected

**Rejected: these are agent drafts the operator never ratified**, which would make "reconstructed"
the honest label after all. Rejected on content. Each carries `owner: nick`, `status: active`,
reversal criteria, dependencies, and a structural-commitment check. Two carry a first-person operator
quote in the operator's own register and idiom — the Leaflet record quotes *"at the time of creating
that rule i underestimated what the map lift would actually cost in terms of effort and simultaneously
i am launching smartsite soon so i dont want to rush into work that could hinder that."* A draft
awaiting ratification does not quote the ratifier. Amendment A-129 on the same branch narrates the
operator un-parking both lanes on these decisions, and the code citing them shipped and deployed
within hours.

**Rejected: the branch was merged and later reverted.** `--diff-filter=ADRM` across all refs shows one
`A` per file and no `D` anywhere; and the branch tip is not an ancestor of `main` at all, so nothing
from it was ever merged.

### Why I did not reconstruct anything

The mission's governing rule is "you may record what was BUILT, you may not assert what was DECIDED,"
and its stated reason is that a reconstructed record reading like a ratified one is worse than no
record because the next agent cites it as authority.

Once the originals were found, writing reconstructions would have violated that rule from the other
direction: it would have replaced the operator's actual words with mine, and stamped
`reconstructed-awaiting-ratification` on three decisions that were genuinely ratified — downgrading
real authority into a draft, and doing it in a file that would then outrank the real one because the
real one is invisible. Recovery is the act that satisfies the rule. Reconstruction would have defeated
it.

---

## What I did instead: recovered six records, byte-identically

Extracted verbatim from `seat/govtech` into `_decisions/` in the working tree. **Uncommitted** —
doc_repo commits are planner-owned.

| File | Blob | Verdict |
|---|---|---|
| `2026-09-03_smartcity_os_platform_read_authorization.md` | `f67edc185f35` | IDENTICAL |
| `2026-09-03_bastrop_tx_dashboards_pack_ratified.md` | `1dbeeec7797d` | IDENTICAL |
| `2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md` | `3a2e66e81799` | IDENTICAL |
| `2026-09-04_systems_linking_is_the_thesis.md` | `fcf6d7e79514` | IDENTICAL |
| `2026-09-04_compass_rework_starts_parallel_to_plan_review.md` | `151a80463fbd` | IDENTICAL |
| `2026-09-04_smart_files_search_wave_scope.md` | `d17d15cc0de0` | IDENTICAL |

Not one byte was altered, including the frontmatter. `status: active` was left as written, because it
is accurate.

**The identity check was verified by violation**, not by observing it pass. I appended a single byte
to a copy of the Leaflet record and re-hashed: `3a2e66e817992a58cbaa3fe08fdfea7c0eaf993e` versus
`767a017eae45f1eed5bef3a05e68f619aef4e0d8`. The check fires on a one-byte difference, so the six
IDENTICAL verdicts mean something.

Three of the six were cited by shipped code and are the mission's deliverable. The other three
(`systems_linking_is_the_thesis`, `compass_rework_starts_parallel_to_plan_review`,
`smart_files_search_wave_scope`) carry no code citation but are equally real, equally operator-owned,
and equally one disk failure from gone. `systems_linking_is_the_thesis` in particular records a
**priority reversal** — the native map downgraded from active priority, "make these systems function
together" named as the actual thesis — that nothing on `main` reflects. Drop any of the three if the
planner prefers a narrower commit; I judged leaving a found operator decision stranded to be the worse
error.

### The filename discrepancy

The dispatch proposed `_decisions/2026-09-04_leaflet_island_exception_property_map.md`. **The real
filename is `_decisions/2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md`.** I used the real
one.

The code never cites a filename for this record. It is cited **four times** and every one is a
date-plus-directory reference:

- `src/property-map.mjs:49` — "the dated 2026-09-04 operator decision record in doc_repo's `_decisions/` directory"
- `src/compose.mjs:252` — "the 2026-09-04 operator decision (dated record in doc_repo's `_decisions/` directory)"
- `src/server.test.mjs:743` — same phrasing
- `src/shape.test.mjs:62` — same phrasing, **plus a quoted title**: *"No Leaflet island overridden for [the] Bastrop map"*

That quoted title matches the recovered filename slug exactly. It is the only filename-shaped evidence
in the code, and it points at the real record. The other two records *are* cited by exact filename
(`src/adapters.mjs:840`, `src/city-pack.mjs:99`, `src/adapters.mjs:917`) and both filenames resolve
against the recovered files exactly.

Worth naming as a process point: a citation written as "the dated record in that directory" cannot be
mechanically resolved or checked. Three of the four Leaflet citations are unverifiable by any tool. The
fourth is only resolvable because somebody happened to quote the title.

---

## The full stranded inventory

`seat/govtech` is **26 commits** ahead of `main`, **23 files** changed, spanning 2026-09-03 to
2026-09-04. It is the *only* branch in this clone that is both meaningfully ahead of `main` and absent
from `origin`.

| Branch | Commits not on `main` | On `origin`? | Last commit |
|---|---|---|---|
| **`seat/govtech`** | **26** | **NO** | **2026-09-04** |
| `seat/dispatch-planner` | 21 | yes | 2026-09-14 |
| every other local branch | 0 | — | — |

`seat/dispatch-planner` is 21 ahead but is pushed, so it is backed up and merely in flight. `seat/govtech`
is the singular case. It is ten days old.

### What is on it

**Six decision records** — recovered above.

**OPS-17, +36 lines: amendments A-109 through A-134.** `main`'s OPS-17 amendment sequence stops at
**A-108**. Twenty-six amendments are stranded, and they are the detailed narrative of the entire
G-115/G-116/G-117 arc: the operator's authorization to cross the no-touch line (A-114), the credential
transfer (A-113), each deploy with its revision name and traffic verification, five real bugs found on
the operator's own QA passes (A-120, A-121), the Smart Files "no search at all" finding (A-126), and
the G-117 closes (A-131, A-133). The PR bodies cite A-111; the decision records cite A-113 and A-125.
**Every one of those citations is currently unresolvable on `main`.**

**Two dispatches, six checkpoint/close JSONs, two mission files, two scoping docs** —
`_dispatches/2026-09-03_g115-coverage-measure_dispatch.md`,
`_dispatches/2026-09-03_g115-matrix-verify_dispatch.md`, the matching cp1/cp2/close JSONs,
`_inbox/2026-09-03_g116-bastrop-dashboards-pack_close.json`,
`_inbox/2026-09-04_dashboards_map_architecture_scoping.md`,
`_inbox/2026-09-04_smart_files_search_and_linking_scoping.md`.

**Two state files, substantially rewritten** — `_STATE.md` (+76/-41) and `_state/govtech/STATE.md`
(+75/-40). The govtech STATE on the branch carries the real record-count ground truth that exists
nowhere on `main`: permits 312, work-orders 174, inspections 2015, code-violations 1495,
business-licenses 72, Samsara 75 vehicles, Spireon 24 units, Power BI 14 capital projects.

### The amendment-numbering trap

**Do not issue A-135 from `main`.** `main` stops at A-108 and the branch runs A-109..A-134. Any new
amendment written on `main` today takes a number the branch already uses, and recovering the branch
afterwards produces a duplicate-ID collision that cannot be resolved by reading either file. The
sequence must be reconciled as one act, before the next OPS-17 amendment is written. This is the most
time-sensitive item in this register, because it gets harder every session and today's session already
added six G-rows to `main`.

---

## What was genuinely never written: the G-116 and G-117 table rows

This is the one part of the dispatch's premise that holds, and it is sharper than stated.

The G-116 and G-117 **table rows** do not exist in **any ref**. Not on `main`, and **not on
`seat/govtech` either** — the branch's own OPS-17 also stops at G-115. I compared the full G-row ID
inventory of both versions with `comm` and there are no branch-only rows.

So amendment **A-111** reads "**G-116 ADDED (approved)**" while sitting in a document whose table has
no G-116 row. The amendment and the table it amends disagree, on the branch itself. The row was
approved, narrated, built, deployed, closed and amended eleven more times — and never typed.

`main` now has a **four-ID hole at G-116, G-117, G-118, G-119** (verified by per-ID row count: 0,0,0,0,
then G-120..G-125 each 1, G-126 zero). Proposed rows filling G-116 and G-117 are in
`_inbox/2026-09-14_r10_proposed_ops17_rows.md`. G-118 and G-119 are cited by nothing I found; whether
they were skipped deliberately or by drift is not recoverable from source.

---

## The G-52 correction

Full proposed row text is in the proposed-rows file. The substance:

`G-52`'s blocker is stated as one condition and is actually two, fused. "A live MyGov feed/adapter
grant on `template-city` (NOT YET BUILT)" is now **false** — the feed exists, is deployed, and serves
312 real Bastrop permits. `grantedAdapters` is not `[]`; `BASTROP_TX` carries seven grants
(`src/city-pack.mjs` lines 127-134). What remains **true** is that nothing initiates a plan-review
engagement from a permit record: `engagement` has **zero hits** in `smartcity-dashboards` on
`origin/main`, and the served surface still reads "Reviews, Submittals against this parcel, Not
connected" (`web/index.html:484`).

One thing the row got structurally wrong from the start, which I did not expect to find: it required
the feed on **`template-city`**, and `template-city` is *incapable* of holding one. `assertCityPackShape`
throws `"a pack that generates fixtures grants no adapter"` (`src/city-pack.mjs:373`) — a demo pack
cannot carry a real grant, by design, to close the G-74 identity collapse. The row's own precondition
was never satisfiable as written. Whether that was noticed when the row was drafted is not recoverable
from source.

---

## Additional undocumented findings

**1. `_catalog/repo_intents.md` does not record the authorized exception.** Its `smartcity-os` row
(line 74) still reads ABSOLUTE NO-TOUCH with no mention of the narrow platform-read authorization. This
is wrong in **both** directions: an agent reading it concludes the fourteen shipped PRs were
unauthorized, and an agent authorized to work there has no statement of the exception's boundary. The
authorization's own text is precise about that boundary — *"Does not reopen: the general
absolute-no-touch rule for `smartcity-os`, which stands for every OTHER kind of change — this decision
authorizes exactly one endpoint, not open season on that repo."* Proposed addition to that row's third
cell, for the planner:

> Narrow exception, 2026-09-03: platform-internal, key-gated, read-only endpoints for
> `smartcity-dashboards` are authorized per
> `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`. That authorization covers read
> endpoints under `/api/platform/*` and nothing else; every other kind of change stays ABSOLUTE
> NO-TOUCH. A second engagement was authorized 2026-09-14 for the G-122 incident specifically.

**2. All fourteen `smartcity-os` PRs came through PRs — no direct-to-main pushes.** I enumerated every
commit on `origin/main` since 2026-08-20: exactly fourteen, each a squash merge carrying its PR number,
matching #39 through #52. The no-touch line was crossed under authorization and under review, not
quietly.

**3. `G-122`'s third hypothesis is five months old and is not part of this seam.** The incident row
names `0e5c41e` (flipping `DEFAULT_TENANT_ID` 1→2) alongside `d2d3648` (#40) and `332a16c` (#52) as
"top hypotheses," which reads as three peers from the same work. `0e5c41e` is dated **2026-04-05** and
is not among PRs #39-#52. That does not clear it — when it reached *production* is a deploy question,
not a commit-date question, and I did not check the deploy history. But it is not part of the fourteen-PR
seam and should not be triaged as though it were.

**4. The PR record is markedly better than the plan record, and PR #49 is the standout.** These
fourteen PR bodies are unusually good: each names what it reused rather than re-derived and why, states
residuals honestly, and reports `tsc` error counts diffed rather than assumed (410 before, 410 after,
repeatedly). PR #49 found the "No Leaflet island" conflict mid-build and **stopped**, opening the route
half and surfacing the conflict for a product decision rather than working around it. The operator then
ruled, and the build resumed. That is the control behaving exactly as designed. It is recorded in a PR
body and an unmerged branch, and nowhere a future agent will look.

**5. A real code defect, inherited from the prior recon and independently confirmed as unfixed.**
`mapRealPermitRecord` **stamps** `pack.cityKey` onto every row from the real feed rather than checking
the row's own city. The fixture path has the equivalent check and it fires (`src/domains.test.mjs:328`
throws `/returned a record for other-city on pack probe-city/`). This is a paired control with one half
armed on generated data and the other absent on real data — latent only because SmartCity OS serves one
tenant today. It survives on `origin/main`. Owner is the `smartcity-dashboards` seat; it is not mine to
fix and I did not touch it.

**6. The served source register still declares six live feeds "Not connected."**
`src/shell-homes.mjs:127` and `web/index.html:1475`. The product understates itself to a Bastrop staff
member looking at a feed that is working. Inherited from the prior recon, confirmed present on
`origin/main`.

**7. The ten deployed revisions, verified live today.** Read from the Cloud Run traffic JSON **by field
name**, never a positional formatter: seven `g116-*` tags and three `g117-*` tags, exactly matching the
dispatch's list. `g117-full-catalog` on `smartcity-dashboards-00062-ful` serves `percent=100`;
`latestReadyRevisionName` agrees. Forty revisions exist on the service in total.

---

## What I could not reconstruct, and why

**Why the branch was never pushed or merged.** Not recoverable from source. It could be a session that
ended without its close step, a seat whose push was never part of its routine, or a deliberate hold. The
branch's final commit is a normal work commit, not a "parking" commit, which weakly favours an
interrupted close over a deliberate hold — but that is an inference from commit shape, not evidence, and
I am not asserting it.

**Whether the G-116/G-117 rows were skipped deliberately or by drift.** The amendments say the rows
were added when they were not. Whichever it was, it is not visible in what the branch recorded.

**Whether today's session deliberately reserved G-116..G-119.** It started at G-120, and `G-124` cites
`G-117` as if it exists. Consistent with deliberate reservation, also consistent with knowing the
numbers were spoken for without checking the table. Not recoverable from the file.

**Whether the second clone ever held this work.** `C:/Users/cente/doc_repo` at `d07fd452` has neither
the files nor any history of them — I ran the same `--all` history search there and it returned nothing.
The clones have independent histories, so this is real absence in that clone, not a mirror of the first
finding.

**Whether the upstream `/api/platform/mygov/*` handlers are tenant-scoped server-side.** The prior
recon's highest-value open question. I read the fourteen PR bodies, which state `tenant_id=2` filtering
for work-orders and "tenant-scoped set" for inspections and code-violations, but I did not read the
handler source and the PR body is the author's claim, not the code. Still open.

**Whether the recovered records are byte-identical to what the operator approved.** I verified they are
byte-identical to what is in the branch. Whether the branch content matches what was said in the room
is outside source.

---

## Recommended order of operations for the planner

1. **Push `seat/govtech` to `origin` before anything else.** Twenty-six commits of operator decisions
   and program history exist on one disk. This is one command and it removes the loss risk entirely,
   independently of any merge decision.
2. **Reconcile the amendment sequence before writing any new OPS-17 amendment.** `main` is at A-108,
   the branch runs A-109..A-134. Every session that passes makes this worse.
3. Commit the six recovered decision records (or merge the branch, which brings them plus the
   amendments and state files in their original commits — strictly better provenance than my
   extraction).
4. Paste the G-116/G-117 rows and the corrected G-52 row.
5. Update `_catalog/repo_intents.md`'s `smartcity-os` row with the exception.
6. Route the `mapRealPermitRecord` stamping defect to the `smartcity-dashboards` seat.

---

## leave_behind

```
leave_behind:
  - item: branch seat/govtech — 26 commits, local-only in P:/doc_repo, never pushed to origin,
          never merged to main; carries 6 operator decision records, OPS-17 amendments A-109
          through A-134, 2 dispatches, 6 checkpoint/close JSONs, 2 mission files, 2 scoping docs,
          and both state files. Single point of failure.
    owner: nick
    plan_row: R-10 (recovery owed; push first, merge second)
  - item: OPS-17 amendment sequence forked — main at A-108, seat/govtech at A-134. A new
          amendment written on main collides with the branch.
    owner: nick
    plan_row: R-10
  - item: six recovered decision records sitting uncommitted in P:/doc_repo/_decisions/
    owner: nick (planner commits; this lane does not)
    plan_row: R-10
  - item: G-116 / G-117 table rows never written in any ref; proposed text filed
    owner: nick
    plan_row: R-10
  - item: G-52 row states a blocker that was satisfied 2026-09-03; corrected text filed
    owner: nick
    plan_row: G-52
  - item: _catalog/repo_intents.md smartcity-os row records no exception to ABSOLUTE NO-TOUCH
    owner: nick
    plan_row: R-10
  - item: mapRealPermitRecord stamps pack.cityKey on real-feed rows without checking the row's
          own city; the fixture path has that check and it fires
    owner: smartcity-dashboards seat
    plan_row: backlog
  - item: shell-homes.mjs source register declares six live feeds "Not connected"
    owner: smartcity-dashboards seat
    plan_row: backlog
  - item: upstream /api/platform/mygov/* server-side tenant scoping still unread in smartcity-os
    owner: smartcity-os owning seat
    plan_row: backlog
```

---

## Fleet memory

**GROUND-TRUTH 2026-09-14.** `P:/doc_repo` branch `seat/govtech` = `aa5acd91`, 26 commits not on
`main`, absent from `origin`. Carries `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`
(`24bc5b52`), `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md` (`7ff630ca`),
`_decisions/2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md` (`607e12eb`), plus OPS-17
amendments A-109..A-134.

**GROUND-TRUTH 2026-09-14.** OPS-17 on `main` (`94c5ad5f`): G-rows max G-125, four-ID hole at
G-116..G-119, amendments max A-108. `seat/govtech`'s OPS-17: G-rows max G-115, amendments max A-134.

**GROUND-TRUTH 2026-09-14.** `smartcity-dashboards` Cloud Run: ten g116/g117-tagged revisions;
`smartcity-dashboards-00062-ful` tagged `g117-full-catalog` at `percent=100`; 40 revisions total.
`smartcity-os` `origin/main` `332a16c9`, fourteen commits since 2026-08-20, all PR squash merges
(#39-#52), zero direct-to-main.

**LESSON.** A file absent from both working trees of both clones can still be fully present in git
history. `git log --all --diff-filter=ADRM -- '<path glob>'` is the instrument; `--all` is the
load-bearing flag. Three prior searches concluded "does not exist" from `HEAD`-scoped and
filesystem-scoped checks. Before writing a record to replace a missing one, search all refs — the cost
is one command and the failure mode is overwriting an operator's own words with a paraphrase.

**LESSON.** "The dated record in that directory" is not a citation. Three of the four Leaflet
references are mechanically unresolvable; the only reason the record was identifiable is that
`shape.test.mjs` happened to quote its title. A citation a tool cannot resolve cannot be checked, and
an unresolvable citation to a stranded file is indistinguishable from an invented one.

**LESSON.** An amendment saying a row was ADDED is not evidence the row exists. A-111 says "G-116
ADDED (approved)" in a document whose table has no G-116 row, on the same branch. Check the table.

**DEAD-END.** `gcloud ... --format=json 2>&1 | python` fails with `JSONDecodeError: Expecting value:
line 1 column 1` because an `InsecureRequestWarning` on stderr is merged ahead of the JSON. Redirect
stderr separately (`> out.json 2>/dev/null`). The traceback looks like the resource has no such field,
so it invites a false absence.

**DEAD-END.** Windows-native Python cannot open MSYS bash `/tmp` paths — `FileNotFoundError`, which
reads as "the file was never written" when the write in fact succeeded. Write to the scratchpad and
pass the Windows-form path to any native tool.

**OPEN.** Push and reconcile `seat/govtech`. Until then the operator's decision record for
G-115/G-116/G-117 is one disk failure from gone, and the OPS-17 amendment sequence is forked at A-108
with a collision arriving on the next amendment written on `main`.

**OPEN.** Read `smartcity-os`'s `/api/platform/mygov/*` handlers to establish whether
`PLATFORM_INTERNAL_API_KEY` is server-side bound to `tenant_id=2`. Inherited unresolved from the prior
recon; the PR bodies assert it, the code has not been read.
