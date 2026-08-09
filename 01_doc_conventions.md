---
id: 01_doc_conventions
title: Doc conventions — naming, frontmatter, write patterns, lifecycle
status: active
last_updated: 2026-08-08
applies_to: docs
---

# Doc conventions

Rules of the road for every file in this repo. If you're an agent working
in a repo and writing a session summary, you only need [Session summaries](#session-summaries)
and [Rollup process](#rollup-process). If you're rolling up sessions into
canonical docs, read everything.

## File naming

Canonical docs use the pattern `<NN>_<snake_case_title>.md` where:

- `NN` is a two-digit numeric prefix from the band table in
  [`00_README.md`](00_README.md). Use the lowest available number in the
  appropriate band.
- `snake_case_title` is short, lowercase, words separated by underscores.
  No hyphens. No version numbers in the filename (versioning lives in
  frontmatter).

Examples:

```
00_README.md
01_doc_conventions.md
10_ground_truth.md
20_agent_operating_rules.md
30_smartcity_os_state.md
```

### Sub-letters (`30a_`, `30b_`)

Use sub-letters when a sub-component is tightly coupled to a parent doc and
should sort adjacent to it:

```
42_smartcity_citizenconnect.md
42a_smartcity_citizenconnect_product_description.md
```

Don't use sub-letters for independent sibling topics — those get their own
numeric slot.

### Subdirectories

Most docs live at the root. Subdirectories are reserved for things that are
inherently a series:

```
_inbox/                cc-agent courier drop, planner-swept (see 20_agent_operating_rules.md HR-11)
_sessions/             append-only session summaries (see below)
_sessions/archived/    sessions older than 30 days
80_adrs/               architecture decision records, one file per ADR
90_runbooks/           operational runbooks
91_postmortems/        incident postmortems
```

The band number reserves the slot — `80_adrs/` IS the 80-band content,
`90_runbooks/` IS the 90-band content. Inside subdirectories, files don't
need numeric prefixes; they use a domain-appropriate naming pattern:

```
80_adrs/adr_001_monorepo_workspaces.md
80_adrs/adr_002_python_fastapi.md
90_runbooks/cloud_run_deploy.md
91_postmortems/2026-05-05_track_b_deploy_saga.md
```

## Frontmatter

Every canonical doc starts with frontmatter. Required fields:

```yaml
---
id: 10_ground_truth
title: Portfolio ground truth — 2026-05-05
status: active
last_updated: 2026-05-05
applies_to: portfolio
---
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Must match the filename without `.md` |
| `title` | yes | Human-readable |
| `status` | yes | `active` \| `draft` \| `superseded` \| `historical` |
| `last_updated` | yes | ISO date (`YYYY-MM-DD`) |
| `applies_to` | yes | `portfolio` \| `smartcity-os` \| `design-accelerator` \| `revit-connector` \| `hauska-sdk` \| `eci` \| `docs` |

Optional fields:

```yaml
supersedes: 13_agent_operating_rules     # id of doc this replaces
related: [10_ground_truth, 21_ai_first_dev_flow]
owner: planner                           # planner | nick | <agent-id>
```

### Status field semantics

| Value | Meaning |
|---|---|
| `active` | Current truth. In use. The default. |
| `draft` | Work in progress; may contain inaccuracies. Don't trust without verification. |
| `superseded` | Replaced by another doc; see `supersedes:` chain. Kept for audit. |
| `historical` | No longer current but preserved as record. Postmortems, dated recon snapshots, closed-out roadmaps. |

`status: active` combined with `last_updated:` older than ~60 days is the
staleness signal for periodic review.

## Cross-references

Use relative markdown links between docs:

```markdown
See [`10_ground_truth.md`](10_ground_truth.md) for current repo state.
The pattern is detailed in [the rollup section](#rollup-process).
ADR-007: [`80_adrs/adr_007_polygon_cdk.md`](80_adrs/adr_007_polygon_cdk.md).
```

Don't use absolute paths or `https://github.com/...` URLs for in-repo
references — those break when the repo gets cloned somewhere new.

## Versioning and supersession

Two ways docs change.

**In-place edits — the default, ~95% of changes.** Update content, bump
`last_updated`. No new file, no supersession chain. Use this for
incremental updates: a new fact, a corrected belief, a clarification.

**Supersession — for meaningful restructures.** Use when a doc gets
restructured enough that you want the prior shape preserved for audit
(like the agent operating rules v1 → v2 transition). Workflow:

1. Old file: change `status: active` → `status: superseded`. Leave
   `last_updated` alone — it should reflect when the doc was last accurate,
   not when it was retired.
2. New file: create at the next available numeric slot, or with a `-v2`
   suffix in the title-slug if you want it to sort adjacent. Set
   `supersedes:` in frontmatter to the old file's `id`.

When in doubt, edit. Doc proliferation is the enemy of usefulness.

## Session summaries

Every working session ends with a session summary appended to `_sessions/`.

Filename pattern:

```
_sessions/<YYYY-MM-DD>_<repo>_<agent>.md
```

Multiple same-day sessions from the same agent on the same repo append
`-01`, `-02`:

```
_sessions/2026-05-05_smartcity-os_cc-agent-1.md
_sessions/2026-05-05_smartcity-os_cc-agent-1-02.md
_sessions/2026-05-05_design-accelerator_planner.md
```

Allowed `repo` values: `smartcity-os` | `design-accelerator` |
`revit-connector` | `hauska-sdk` | `eci` | `docs` | `portfolio`.

Allowed `agent` values: `planner` | `cc-agent-1` through `cc-agent-4` |
`cursor-manual` | `replit-agent` | `nick`.

### Session summary frontmatter

```yaml
---
date: 2026-05-05
agent: cc-agent-1
repo: smartcity-os
session_type: recon          # recon | execute | review | planning
memory_graded: none          # required: none | [<slug>:HELPED|HARMED, ...]
rolled_up: false             # flips to true after rollup
rolled_up_into:              # optional: list of canonical doc ids
---
```

### Session summary body

```markdown
## What was done
Brief factual summary of what the session accomplished.

## What was learned (changes to ground truth)
What this session revealed about state that contradicts or extends current
canonical docs. This is the most important section — it's what drives the
rollup.

## What's still open
Open questions, incomplete probes, things to investigate next.

## Suggested canonical doc updates
Concrete patches: "10_ground_truth.md should add X under section Y."
"30_smartcity_os_state.md says Z but actual state is W." Be specific
enough that the rollup is mechanical.
```

Append-only. Don't edit a session summary after writing it — if you need
to correct something, write a new session summary that supersedes the
first.

## Rollup process

The planner (or Nick) periodically rolls session summaries into canonical
docs. Cadence: end-of-day for active workstreams; weekly for slow ones.

Steps:

1. List unrolled sessions — grep frontmatter for `rolled_up: false`, or
   inspect by date.
2. Read each session's "What was learned" and "Suggested canonical doc
   updates" sections.
3. For each verified finding, patch the relevant canonical doc(s). Bump
   `last_updated` on each patched doc.
4. Update each session's frontmatter: flip `rolled_up: true` and fill
   `rolled_up_into:` with the list of canonical doc ids that absorbed it.
5. Commit the rollup as a single PR titled `docs: rollup <date>` so the
   audit trail lands as one reviewable change.

### Handling contradictions

If two sessions disagree on a fact, neither rollup happens until the
contradiction is resolved. Common resolution: dispatch a follow-up recon
that produces verbatim verification artifacts (per agent operating rules
HR-1 and HR-8 in [`20_agent_operating_rules.md`](20_agent_operating_rules.md)).
Document the resolution in the next session summary.

## Archive after 30 days

Sessions older than 30 days move to `_sessions/archived/<YYYY-MM>/`. They
stay searchable but don't clutter the hot directory. Archive is a manual
move (or scripted later) — sessions don't expire from git history
regardless of where the file sits.

## When to add a new doc vs update an existing one

Add a new doc when the topic doesn't fit any existing doc's scope, when a
new product or sub-product enters scope, when an ADR is needed for a
settled architectural decision, or when a postmortem or runbook is
warranted for a specific incident or operation.

Update an existing doc when new facts extend or correct what's already
there, when a roadmap item completes or shifts, or when state of reality
changes for an already-tracked product.

When in doubt, update.
