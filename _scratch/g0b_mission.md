## Mission — G0-B: repo cartography

You are the CARTOGRAPHY lane planner. Your predecessor (G0, close at `_inbox/2026-08-14_g0_close.json`)
audited **root `.md` files plus `_smartcity_masters/` only** and reported "366 violations". This repo has
roughly **37 top-level directories and ~4,900 files**. About 35 directories and ~4,700 files were never
examined. The 366 figure is therefore scoped to a slice while reading like full coverage — a
counting-rule failure, and the first thing your own work must not repeat.

Four build lanes are about to be dispatched into this repo. Right now no artifact anywhere says what
this repo CONTAINS or what each folder is FOR. Four agents would each hit `_inbox/` (2,620 files, no
index) and build four different mental models. Preventing that is your job.

**You produce a MAP, not a cleanup.** Catalog first. Do not mutate, retire, move, or delete anything.
The map tells us which sweeps are even safe to run; a pass that both maps and mutates ~4,900 files is
one where a mistake is hard to unwind.

Read `90_operations/OPS-17_govtech_stack_plan_of_record.md` first. Its inherited spine constraints bind
your deliverables — especially constraint 9 (instruments are build items) and the rule that every ratio
travels with its counting rule.

### The deliverable

`_catalog/repo_map.md` — a durable canonical artifact with frontmatter per `01_doc_conventions.md`, NOT
a session report. It must survive as the thing a future agent reads to orient. One row per top-level
directory, at minimum:

| Directory | What it is | Purpose (why it exists) | Owner | State | Program scope | File count | Notes |

- **State**: `active` | `archive` | `dead` | `unknown`. Use `unknown` honestly rather than guessing —
  an honest unknown is a work item; a wrong guess is a landmine.
- **Program scope**: `in-scope-OPS-17` | `out-of-scope` | `other-program` | `needs-ruling`.
  **Out-of-scope is a valid and required classification.** The operator explicitly needs to know what
  still needs cleanup in FUTURE sessions. Unmentioned is not acceptable; unmapped is the failure state
  this task exists to end.
- Go one level deeper wherever a directory holds materially different things (`_prospects/` holds
  distinct prospects; `_verticals/`, `_projects/` likewise).

### Known targets — verified by the planner 2026-08-14, re-verify counts yourself

- `_inbox/` **2,620 files** — over half the repo. The courier channel; nothing prunes it. Every lane
  close artifact lives here, so it is simultaneously the highest-value cleanup target and the most
  dangerous. **Count and characterize it; do NOT propose retirements file-by-file.** Propose a
  retention RULE (by age, by close-state, by naming pattern) for the operator to rule on.
- `_scratch/` 499, `_dispatches/` 326, `_sessions/` 227, `_prospects/` 208, `_decisions/` 103.
- `hauska-mcp-server/` **186 files** and `tmpbrief-l3-spine-consume/` **189 files** — these appear to be
  **product code and a temp clone living inside the doc repo**. If confirmed, that is a repo-intent
  violation against `_catalog/repo_intents.md` that nobody has flagged. **Report it; do not fix it.**
- **Empressa Command Center** — the control center for the spine — has **no top-level home**. It is
  scattered across `_inbox/` and root docs. Locate everything about it and say where it actually lives.
- `_prospects/atx_bulls/` — a platform recently built; confirm what is here and its state.
- `_thought_leadership/` and `_thoughtbank/` — an active ideation thread. Characterize, do not judge.
- `_temp/`, `_projects/`, `_verticals/`, `system-overview-site/`, `_rd_digital_economies/`,
  `_calibrated_spine_roadmap/`, `_land_records/`, `64_recursive_loop/`, `24_adaptive_ui/` — unclassified.

### Rules on your own work

- **Every count carries its counting rule.** State what you counted (files? `.md` only? tracked vs
  untracked?) and over what path. This is the direct fix for the 366 figure.
- **Two numbers that should agree and do not is a free finding.** Reconcile; do not round off.
- **Verify at source.** `git ls-files` and the filesystem disagree wherever things are untracked — that
  disagreement is itself a finding worth reporting.
- **Flag structural violations; do not remediate them.** Product code in the doc repo, temp clones,
  anything contradicting `_catalog/repo_intents.md` — these are operator rulings.
- Read-only on every product repo. Write only `_catalog/repo_map.md`, your checkpoint/close artifacts,
  and any instrument you build under `scripts/`.
- Leave doc_repo edits UNCOMMITTED and list them in the close; doc_repo commits are planner-owned.
- An honest partial map beats a narrated complete one. If you cannot classify something, say
  `unknown` and list what would resolve it.

### Second deliverable — the cleanup backlog

`_catalog/repo_cleanup_backlog.md`: everything found that needs attention but is NOT in scope now.
One row per item with a proposed disposition and a rough size. This is the artifact the operator asked
for — "I need to know what still needs cleaned up for future sessions." It is a queue, not a plan.

### Explicitly out of scope

Executing any sweep or retirement. Fixing the `hauska-mcp-server/` or temp-clone placement. Ruling on
`_inbox/` retention (propose the rule; the operator rules). Any lane build work. Any work belonging to
another program running in another chat — if you find it, name it in the close and leave it alone.

### One thing your predecessor did well — repeat it

G0 pushed back on its own dispatch brief where the brief was wrong at source: it was told 33a ruled on
five docs; at source 33a ruled on three, so it routed the other two to the operator rather than
guessing. **The numbers in this brief are the planner's and may be wrong too.** Check them. Reporting
that a planner figure is wrong is a successful outcome, not a complication.
