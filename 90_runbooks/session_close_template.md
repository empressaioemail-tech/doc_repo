---
id: session_close_template
title: Session-close courier prompt template
status: active
last_updated: 2026-05-23
applies_to: portfolio
related: [20_agent_operating_rules, 01_doc_conventions, 01a_atom_conventions, current_state_protocol]
---

# Session-close courier prompt template

> **Purpose.** Used by the Claude.ai planner at ~90% context window to
> hand off a session cleanly. The planner fills in the template's
> placeholders with this session's specifics, produces a finished
> courier prompt, and gives that prompt to Nick to run in his
> `P:\doc_repo` Cursor agent. The doc_repo agent commits the session
> summary and any canonical doc updates, ensuring the next planner
> conversation can orient cleanly via the standard courier pattern.

## When the planner uses this

Per the custom instructions Session protocol:

- Triggered at ~90% context window, OR
- Triggered when Nick says "wrap up" or signals end of session, OR
- Triggered when the planner has produced enough work that committing
  it as a batch makes sense even if context isn't yet exhausted

The planner notifies Nick first ("approaching context limits, here's
the session-close prompt"), then produces the filled-in prompt below.

## Inputs the planner gathers before filling in

Before generating the prompt, the planner determines:

1. **Session date** — today, ISO format (YYYY-MM-DD)
2. **Session topic** — short identifier (e.g., `phase_1a_kickoff`,
   `sprint_planning`, `biz_ops_setup`, `sylvia_proposal_response`).
   Used in filename: `_sessions/<date>_<topic>_<agent>.md`
3. **Session summary content** — what was decided, what was produced,
   what's still open. Include **atom refs touched** (per
   [`01a_atom_conventions.md`](../01a_atom_conventions.md)) and **model
   used** if the session logged Grok vs Claude escalation. The planner
   drafts this in markdown; it becomes the body of the session summary file.
4. **Canonical doc updates** — every existing doc that needs an edit:
   file path, what changes (specific lines / sections / frontmatter),
   why. Including `last_updated` bumps even when the substantive
   change is small.
5. **New docs produced this session** — full content of any new files
   that need to be committed (with target paths and frontmatter).
6. **Current-state snapshot regeneration** — updated `00_current_state.md`
   content per [`current_state_protocol.md`](current_state_protocol.md).
   May be "no change this session" for purely tactical sessions; still
   bump `last_updated` regardless.
7. **Post-commit verifications** — specific items the doc_repo agent
   should check after pushing to confirm the changes landed correctly
   (e.g., "confirm `11_roadmap.md` Phase 1A item now shows status
   `verified` and `last_updated: 2026-05-06`").

If any of these are unclear, ask Nick before generating the prompt
rather than guessing. The session-close is the audit trail; better
to land it right than fast.

## The template

The planner copies the fenced block below, replaces `{{...}}`
placeholders with this session's specifics, and presents the
finished prompt to Nick.

````markdown
# Session close: {{SESSION_DATE}} planner session — {{SESSION_TOPIC}}

You are a Cursor Claude Code agent working in `P:\doc_repo` on branch `main`.

## Context

A Claude.ai planner session is wrapping up. Your job: commit a session summary, apply the canonical doc updates listed below, write any new docs listed, regenerate the current-state snapshot, push to origin, and verify the changes landed.

## Stage 1 — RECON (read-only)

```bash
cd P:\doc_repo
git fetch origin --prune
git status
git log --oneline origin/main -5
```

Report verbatim. Confirm:
- Working tree is clean (no unrelated staged or modified files)
- `origin/main` HEAD matches your local `main` (no unexpected drift since the planner's anchor)

If working tree is dirty, **stop and report** — the planner expects to start from a clean slate.

PAUSE. Wait for "go" before any changes.

## Stage 2 — EXECUTE (after "go")

### 2A. Create the session summary file

Path: `_sessions/{{SESSION_DATE}}_{{SESSION_TOPIC}}_claude_ai_planner.md`

Content:

```markdown
{{SESSION_SUMMARY_CONTENT}}
```

The session summary frontmatter must include `id`, `title`, `date`, `agent`, `repo`, `session_type`. If the session's substantive work has been or will be rolled up into other canonical docs, include `rolled_up: true` and `rolled_up_into: [...]`.

### 2B. Apply canonical doc updates

The following existing docs need edits. For each, the change is described; apply exactly what's listed and nothing else.

{{CANONICAL_DOC_UPDATES}}

For every edited canonical doc, also bump `last_updated:` in its frontmatter to `{{SESSION_DATE}}` if the edit is substantive. Trivial edits (typos) don't require the bump.

### 2C. Add new docs produced this session

The following new docs need to be written at the paths listed:

{{NEW_DOCS}}

Each new doc should include frontmatter (`id`, `title`, `status`, `last_updated`, `applies_to`, optional `related` / `supersedes` / `superseded_by`). Use the content provided exactly; don't reformat or "improve."

### 2C-bis. Grade the fleet memory (fired / helped / harmed + trap-recurrence)

The fleet's L3 retirement rung (per `64_recursive_loop/04_instantiations`): a memory or rule that is never graded against outcome can silently rot into a HARMFUL un-retired memory (e.g. the three-gate MCP enum asserted a month after the four-gate rework). Selection pressure on the memory set is what keeps it honest. At session close, the planner records two things — cheap, and the prerequisite for every L3 memory behavior:

1. FIRED / HELPED / HARMED — a one-line stamp per memory or standing rule that actually influenced this session:
   - `FIRED` — it came up and was applied.
   - `HELPED` — it prevented a mistake or saved rediscovery (name the mistake avoided).
   - `HARMED` — it was wrong, stale, or misleading and cost the session something (name the cost). A HARMED memory is RETIRED or corrected same-session (delete/fix the memory file + its MEMORY.md line), never left to rot.
   A memory that neither helped nor harmed and keeps not-firing is a candidate for retirement (it may be dead weight).

2. TRAP-RECURRENCE QUESTION — "did any recorded trap class recur this session, and which memory should have prevented it?" If a trap recurred, either the memory didn't reach the seat that needed it (a cc-agent-reach gap — embed it in the dispatch) or the memory was wrong (correct it). A recurred trap with an existing memory is a HARMED-memory signal.

Record these in the session summary (Stage 2A). This is a protocol step, not a build — but it is the selection pressure that makes the memory system L3 instead of an ever-growing pile of unverified prose.

### 2D. Regenerate current-state snapshot

Per [`current_state_protocol.md`](current_state_protocol.md), every session close regenerates `00_current_state.md` with the post-session state. The planner provides the new snapshot content; write it to `00_current_state.md`, overwriting prior content. Keep it under ~150 body lines per the protocol.

{{CURRENT_STATE_SNAPSHOT}}

If the session's work didn't materially change the snapshot (e.g., a small tactical session that didn't move any fires, sprints, ADRs, or agent assignments), the planner may pass `{{CURRENT_STATE_SNAPSHOT}}` = "no change this session" and Stage 2D is a no-op. Bump `last_updated` in the snapshot frontmatter to reflect the session date regardless.

### 2E. Verify before commit

```bash
git status
git diff --stat
```

Report verbatim. Confirm:
- All listed canonical docs show as modified
- All listed new docs show as untracked / added
- `00_current_state.md` shows as modified (or untracked if first-time creation)
- No unexpected modifications to other files
- Diff stats are roughly the size you'd expect from the changes

If anything looks off (unexpected files modified, diff too big or too small), **stop and report** — don't commit until clean.

PAUSE. Wait for "go" before commit.

## Stage 3 — COMMIT + PUSH (after "go")

```bash
git add {{LIST_OF_PATHS}}
git commit -m "{{COMMIT_MESSAGE}}"
git push origin main
git fetch origin --prune
git log --oneline origin/main -3
```

Report the new SHA on `origin/main`.

## Stage 4 — POST-COMMIT VERIFICATION

After push, verify the specific items the planner flagged. For each item below, run the listed check and report verbatim output:

{{POST_COMMIT_VERIFICATIONS}}

Confirm each one passes. If any fails, **stop and report** — the planner needs to know before declaring the session closed.

## Hard limits

- **Do NOT modify any file not listed in 2B, 2C, or 2D.** No "while I'm here" cleanups, formatting passes, or unrelated edits.
- **Do NOT alter content of session summary or new docs** beyond exact placement at the specified paths. The planner authored them; you're the courier.
- **Do NOT use `git push --force`** or rebase. Normal commit on a clean tree.
- **Do NOT proceed past a stage gate** if recon / verify shows unexpected state.
- **Do NOT combine this commit with other unrelated work.** This commit is exclusively the session close.

## Output format

End each stage with:

```
STAGE N COMPLETE — awaiting go
```

Verbatim command output above the marker.

End-of-task signal: `SESSION CLOSE SHIPPED — pushed to origin/main as <sha>` after Stage 4 verifications pass.
````

## Notes for the planner

### Filling in `{{SESSION_SUMMARY_CONTENT}}`

The session summary should follow the pattern established by previous summaries in `_sessions/` (e.g., `2026-05-05_doc_repo_planner.md`, `2026-05-06_doc_repo_planner.md`). Sections typically include:

- **Inputs** — what the planner had to work with (orientation report, attached docs, prior decisions)
- **Atoms resolved** — named atom refs read or updated this session (`sprint:40e`, `current-state:portfolio`, etc.)
- **Model** — Grok variant used, or Claude if escalated (optional when default Grok)
- **Outputs** — docs landed, decisions made, prompts drafted
- **Decisions** — capture every binary call made in the session with reasoning
- **Lessons / patterns** — anything established that should propagate forward
- **Outstanding from this session** — what's handed forward to the next session
- **References** — links to canonical docs touched

Verbatim quotes from the planner's output are appropriate where the wording matters; summarization is fine for narrative context.

### Filling in `{{CANONICAL_DOC_UPDATES}}`

For each doc, format as:

```
- **`<file path>`** — <description of change>
  - <specific edit 1: which line / section / frontmatter field>
  - <specific edit 2>
  - Bump `last_updated: {{SESSION_DATE}}`
```

If a single doc has multiple substantive changes, list them as separate sub-bullets so the agent can verify each landed. If the change is a frontmatter `status` flip (e.g., to `superseded`), include the new `superseded_by` value.

### Filling in `{{NEW_DOCS}}`

For each new doc:

```
- **`<target path>`** — <one-line description>

  ```markdown
  <full doc content including frontmatter>
  ```
```

Keep the markdown for new doc content INSIDE the courier prompt. The doc_repo agent extracts and writes it as-is. Don't reference "see attached" — there is no attached.

### Filling in `{{CURRENT_STATE_SNAPSHOT}}`

The snapshot follows the six-section structure in `current_state_protocol.md`: active fires, in-flight sprints, open ADRs, agent fleet assignments, recent session summaries, cross-cutting watch list. Length target 80–120 body lines. References canonical docs rather than duplicating them.

Update from the prior snapshot rather than rewriting from scratch — drift the relevant sections, leave the rest alone. If a section's content didn't change, it's still required (don't omit; the snapshot is a fixed-shape doc).

If the session was tactical and didn't materially change the snapshot, pass "no change this session" as the placeholder value. The doc_repo agent will leave the snapshot untouched but still bump `last_updated`.

### Filling in `{{POST_COMMIT_VERIFICATIONS}}`

Examples of useful verifications:

- `grep "status: superseded" 80_adrs/adr_003_replit_neon_tactical.md` → expect match
- `grep -c "^- \[x\]" 11_roadmap.md` → expect count >= prior count + N
- `head -10 _sessions/{{SESSION_DATE}}_{{SESSION_TOPIC}}_claude_ai_planner.md` → expect frontmatter present
- `git log --oneline -1` → expect commit message matches

These are sanity checks, not exhaustive validation. Pick 3-6 that catch the most likely failure modes (file didn't get written, frontmatter malformed, status didn't flip, item count didn't increase).

### Filling in `{{COMMIT_MESSAGE}}`

Format: `<type>(<scope>): <summary>`

Examples:
- `docs: 2026-05-06 session close (sprint kickoff prompts, biz ops repo skeleton)`
- `docs: 2026-05-08 session close (Phase 1A verified, Fire 1 closed, runbook updates)`

One commit per session-close. Don't try to combine multiple sessions.

### Edge cases

- **Session produced no canonical doc changes.** Some sessions are pure
  exploration / decision-making with no doc edits. In that case, the
  session summary IS the deliverable. Stages 2B and 2C would be empty;
  the prompt should explicitly state "no canonical updates this
  session" and the agent commits only the session summary + snapshot
  bump.
- **Session produced too many canonical doc changes for one
  commit.** If the session touched 8+ canonical docs across unrelated
  scopes, consider splitting into two session-close prompts (one per
  scope). The audit trail benefits from focused commits.
- **Planner is uncertain about a placeholder value.** Ask Nick rather
  than guessing. The session close is the place where uncertainty
  becomes permanent record; better to clarify than commit a
  misleading summary.

## Revision history

- **2026-05-23:** Session summary inputs require atom refs touched and
  optional Grok model logging per HR-12 / Phase 2 Grok migration.
- **2026-05-11:** Stage 2D added for current-state snapshot regeneration
  per [`current_state_protocol.md`](current_state_protocol.md). Prior
  Stage 2D (verify before commit) renumbered to 2E. New
  `{{CURRENT_STATE_SNAPSHOT}}` placeholder. "No change this session"
  no-op path documented for tactical sessions.
- **2026-05-06 (origin):** template drafted. Lives in
  `90_runbooks/session_close_template.md`. Project knowledge sync
  (manual or future MCP) makes it readable by the planner; it can
  also be pasted into a conversation if the planner can't access
  it directly.
