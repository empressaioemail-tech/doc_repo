---
id: 2026-06-07_cc-agent-E_engine_lift_adapters
title: Dispatch - engine lift step 3, adapters into the spine
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: QUEUED - FIRE WHEN M-STABILIZE 2C CLEARS (first lift; cleanest, fewest deps)
related: [00_current_state, 20_agent_operating_rules, 56_engine_extraction_sprint, _decisions/2026-06-07_full_engine_extraction_and_data_packages, 80_adrs/adr_008_engine_factor_out]
---

# Engine lift step 3 - adapters into the spine

> **QUEUED.** Fire when M-Stabilize Phase 2C cutover lands clean (that closes the extraction gate). This is the first and cleanest lift - the site-context + subsurface adapters are self-contained data-fetch with the fewest dependencies. Pairs with the cortex-api consume dispatch (cc-agent-C). Verify identifiers against live source before firing.

You are **cc-agent-E**, the single owner of `hauska-engine` for this run.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only if Grok fails after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:56` - engine extraction (this is step 3, adapters)
- `decision:2026-06-07_full_engine_extraction_and_data_packages`

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) - what-moves table, sequence
2. The `packages/adapters` skeleton landed by PR #67
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine` (use a worktree if the primary is dirty)
- Branch prefix: `engine/`
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon: read `legacy-design-tools/lib/adapters` (federal/national/state/local incl. the merged subsurface set) and the adapter contract; report it verbatim. Read the `packages/adapters` skeleton.
- Port the adapter code into `hauska-engine/packages/adapters` as a versioned package (`@hauska-engine/adapters` or per the repo's naming), preserving the adapter contract, the cache pattern, and the neutral-no-coverage behavior. Behavior-parity tests must pass.
- Expose the adapters through the engine surface so `engine-api` (and, in step 4, engine-core) can call them.
- Do NOT modify cortex-api in this dispatch - the cortex-api cutover to consume the package is the paired cc-agent-C dispatch.

**Out of scope:**

- Lifting briefing/finding/hydrology/decomposition/precedence (step 4, separate dispatch).
- cortex-api changes.
- Deploy.

## Acceptance criteria

- `packages/adapters` carries the full adapter set with behavior-parity tests green (report verbatim).
- The adapter contract + cache + no-coverage semantics preserved.
- Package builds + typechecks in the workspace; CI green.
- PR held for operator merge.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-engine_cc-agent-E_engine_lift_adapters.md`. Atom refs, model, PR URL + SHA, blockers verbatim.
