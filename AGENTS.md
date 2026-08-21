# AGENTS.md — entry point for every agent, every tool

This is a ROUTER, not a rulebook. It exists so that any agent — Claude Code, Cursor, Codex, Copilot,
or a hand-carried lane planner — enters through the same door and reads the same authoritative files.

**It deliberately contains no rules of its own.** Copies drift: a shadow copy of the ratified SmartCity
masters sat in this repo saying government pricing was an open decision while the authoritative set
said SET, with prices already submitted as MSRP. Read the sources below; do not restate them here.

## Read in this order, before substantive work

1. **`_STATE.md`** — living program state. Where things are RIGHT NOW, and the standing decisions that
   govern every dispatch. Always first.
2. **The plan of record for your program** — `90_operations/OPS-16_…` (Texas market, rows `P-xx`) or
   `90_operations/OPS-17_…` (govtech stack, rows `G-xx`). Registered in `_catalog/plan_registry.json`.
   **Work that cannot name a plan row is not scoped.**
3. **`90_runbooks/AGENT_CONTRACT.md`** — the operative law for lane behavior: the fan model, interruption
   recovery, the write-slot law, heavy-scan serialization, verification rules, and the close schema.
4. **`90_runbooks/DEV_PROCESS.md`** — how work is SHAPED and how a result is JUDGED. Counting rules,
   instrument rules, dispatch rules, durable-state rules. Every rule in it is traced to an incident.
5. **`ENFORCEMENT.md`** — the fail-closed rules that bind every agent in every repo: fail closed,
   state your snapshot, verify a check by violating it, subagents do not commit, stay in your own
   repositories, commit by explicit pathspec. Claude Code imports it via `@ENFORCEMENT.md` in
   `CLAUDE.md`; Cursor loads the regenerated copy at `.cursor/rules/enforcement.mdc`. **If you are
   neither, read `ENFORCEMENT.md` directly — nothing loads it for you.**
6. **`90_runbooks/fleet_memory_practice.md`** — how build knowledge is captured and promoted. Write
   Tier 2 entries to `_scratch/<workstream>.md` as you work (LESSON, DEAD-END, GROUND-TRUTH with a
   timestamp, OPEN). Read the scratch file for your workstream BEFORE re-deriving anything. Never
   promote to `MEMORY.md` yourself; return the lesson in your close and the planner gates it.
7. **`CLAUDE.md`** — portfolio constitution: entities, brands, the four structural commitments, what is
   settled, what is out of scope. Loaded automatically by Claude Code and by Cursor (it carries
   `alwaysApply` frontmatter).
8. **`_catalog/repo_map.md`** — what every directory in this repo is, who owns it, and whether it is in
   scope. Read it before wandering; this repo holds several programs.

Topic-specific canon: `01_doc_conventions.md` (frontmatter, naming, retirement),
`_catalog/repo_intents.md` (what each repo IS and is NOT — includes no-touch rulings),
`_smartcity_masters/` and `_smartsite_masters/` (the approved-claims registers that bind anything
customer-facing).

## The three rules that decide whether your work counts

Stated here only because they gate everything else; the detail lives in the files above.

- **No dispatch without a plan row.** Dispatches are COMPILED — `node scripts/dispatch.mjs --plan <ID>
  --lane <ID> --plan-row <row>` — never hand-assembled. The canon-gate hook blocks anything missing the
  compiled markers, and that block is the system working.
- **Verify at source.** Counts live behind queries, never behind prose — including the counts in your
  own dispatch's context block. Reporting that a planner's figure is wrong is a successful outcome.
- **Instruments over narration.** A status changed by narration is a defect. Measured base rate in this
  repo: hook-shaped controls run 1-for-1, prose-shaped controls run 0-for-3.

## Where things get written

Close artifacts and checkpoints go to the exact `_inbox/` path your dispatch names. Decisions go to
`_decisions/`. Session records go to `_sessions/`. **Doc_repo commits are planner-owned** — leave your
edits uncommitted and list them in your close.
