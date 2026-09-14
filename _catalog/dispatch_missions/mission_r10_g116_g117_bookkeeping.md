# MISSION — R-10: reconstruct the G-116 / G-117 governance record

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## The one rule that governs this entire mission

**You may record what was BUILT. You may not assert what was DECIDED.**

Three decision records are cited by shipped code and do not exist. You are going to create them,
and the thing you must not do is write them as though somebody made those decisions and you found
the minutes. Nobody did. You are reconstructing, from source, what the code shows was built and
what reasoning the code itself states — and every record you write says so in its own frontmatter
and its opening line. Ratification is the operator's, not yours and not mine.

A reconstructed record that reads like a ratified decision is worse than no record, because the
next agent will cite it as authority.

## What happened

Between roughly 2026-08-20 and 2026-09-04, real work shipped with no bookkeeping:

- **Fourteen PRs on `smartcity-os`** (#39 through #52) building a platform-internal seam for
  `smartcity-dashboards`. That repo is under ABSOLUTE NO-TOUCH in `_catalog/repo_intents.md`.
- **Ten deployed revisions on `smartcity-dashboards`** carrying tags `g116-mygov-live`,
  `g116-mygov-rest`, `g116-vendor-auth`, `g116-pipeline-nav-fix`, `g116-honest-tiles`,
  `g116-field-enrich`, `g116-cip-enrich`, `g117-property-map`, `g117-overlay-layers`,
  `g117-full-catalog`.
- **No plan row governs any of it.** OPS-17 stopped at G-115 until 2026-09-14.
- **Three cited decision records do not exist** in either doc_repo clone.

The work was real, careful and correct on substance. Two independent recons this session
confirmed it: no vendor table was copied into Dashboards Neon, tenant scoping refuses live in
both directions, and the prohibition on copying `mygov_permits` was turned into a control that
throws. What was skipped is the writing-down.

**The consequence is already observed.** An agent reading canon concludes no live permit feed
exists; an agent reading code concludes three authorizations exist. Both are wrong. That
contradiction produced a wrong load-bearing statement to the operator earlier today.

## Your sources, in priority order

1. `_inbox/2026-09-14_g52_mygov_v2_recon.md` — read this FIRST. A full read-only recon of the
   MyGov seam in `smartcity-dashboards`, already done, with quoted code and live probes.
2. `_inbox/2026-09-14_g52_planreview_intake_icc.md` — the plan-review and ICC recon.
3. `git log origin/main` and the PR bodies on `smartcity-os` (#39–#52) — use `gh pr view`.
4. `smartcity-dashboards` `origin/main` — especially `src/property-map.mjs`, whose header is an
   unusually complete statement of its own reasoning, and `src/property-map-catalog.mjs`.
5. `_catalog/repo_intents.md`, `_inbox/2026-08-17_g18_shell_homes.md`,
   `_decisions/2026-08-17_g63_feed_adapter_contract.md` — the rules this work ran against.

Read repos read-only, at `origin/main`, with `git -C <repo> show origin/main:<path>`. Working
trees are stale: `smartcity-dashboards` was 43 commits behind on 2026-09-14. **Do not write,
edit, commit or push in ANY product repository.** Your writes are doc_repo artefacts only, and
even in doc_repo **you do not commit** — you hand files back and the planner commits.

## Deliverables

### 1. Three reconstructed records

Write each to the path the code cites, so the citation resolves:

- `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`
- `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md`
- `_decisions/2026-09-04_leaflet_island_exception_property_map.md` — the Leaflet override cited
  by `property-map.mjs`'s header. If you find the code cites a different exact filename, use the
  cited one so the reference resolves, and note the discrepancy.

Each carries `status: reconstructed-awaiting-ratification` in its frontmatter, and opens with a
line stating plainly that it was reconstructed from source on 2026-09-14, that no operator
ruling of this date is on record, and that it is not authority until ratified.

Each should say: what was built, what the code's own stated reasoning was, what rules it ran
against and whether it satisfied them, what it did NOT do, and what an operator would need to
confirm to ratify it. Where the code states its own reasoning, quote it — `property-map.mjs`'s
header does this unusually well and should be quoted rather than paraphrased.

### 2. Retroactive plan rows

Draft OPS-17 rows covering the shipped surfaces, using the existing table's exact column shape
(`| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status |`).

**Do not edit `90_operations/OPS-17_govtech_stack_plan_of_record.md` directly.** Two sessions are
writing doc_repo main and IDs have collided twice in three days. Write your proposed rows to
`_inbox/2026-09-14_r10_proposed_ops17_rows.md` as ready-to-paste table lines, and say which ID
range you assumed. G-125 was the maximum at 2026-09-14 12:55; re-check immediately before you
write and say what you found.

Mark every retroactive row `SHIPPED, RECORDED RETROACTIVELY 2026-09-14` in its status, never
`CLOSED` — a row written after the fact was never graded by an instrument.

### 3. The G-52 correction

`OPS-17` G-52 still reads STILL BLOCKED on "a live MyGov feed/adapter grant on `template-city`
(NOT YET BUILT)". A live permit feed demonstrably exists and serves. What does NOT exist is the
engagement-from-permit bridge — `engagement` has zero hits in `smartcity-dashboards`.

Propose corrected row text in your handback. Do not edit the file.

### 4. The findings register

`_inbox/2026-09-14_r10_bookkeeping_close.md`: what you reconstructed, what you could NOT
reconstruct and why, and every additional undocumented thing you found. Expect more — you are
reading fourteen PRs nobody wrote down.

## Method

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched. "I grepped these patterns and found
nothing" is acceptable; a bare "there is no X" is not.

State the mechanism you believe explains an observation, THEN state a second mechanism that would
produce the same observation and why you rejected it.

Never print secret VALUES. Env var names only.

Every command exit-bounded (`timeout 120 ...`). Never run a command that waits for input.

Where you cannot tell whether something was intended or accidental, **say that** rather than
picking the flattering reading. "The code does X; whether that was intended is not recoverable
from source" is a complete and useful answer.

## Close

Write the register to `_inbox/2026-09-14_r10_bookkeeping_close.md` and the proposed rows to
`_inbox/2026-09-14_r10_proposed_ops17_rows.md`. Hand everything back; commit nothing.
