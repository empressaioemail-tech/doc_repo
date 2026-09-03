---
id: 2026-09-03_govtech_seat_writepath_handoff
title: Handoff — seat and write-path model, for workspace reset
status: active
last_updated: 2026-09-03
applies_to: portfolio
owner: nick
related:
  - _catalog/seat_register.json
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL
  - 61_enforcement_doctrine.md
---

# Handoff: seat and write-path model

Written because the operator flagged real seat/write-path confusion and is closing everything to reset. This is a from-scratch explanation, not a diff against prior context — read it cold.

## What a "seat" actually is

`_catalog/seat_register.json` is the single source of truth. It names, for every repo a session might touch, exactly one **worktree** (a filesystem path) and one **branch**, and assigns that pairing to an owning **seat** (`property`, `govtech`, `substrate`, `markets`, `systems`, `trading`, or `integration`). A seat is not a person or a session identity you choose — it's derived from *which worktree you're physically sitting in*. Open a Claude Code (or Cursor) window rooted at a registered worktree, and you are that seat for as long as that window is open. Nothing else determines it.

**Why this exists.** Multiple sessions run concurrently against the same repos. Without a registry, two sessions could both write to the same branch, or one session could silently corrupt another's in-flight work by editing a file it doesn't own. The registry plus a hook (`.claude/hooks/seat-worktree-gate.mjs` — reasoning in `62_seat_topology.md`) makes that a refused write instead of a silent collision.

## The `integration` seat, specifically

```json
"integration": {
  "name": "integration",
  "worktree": "P:/doc_repo",
  "branch": "main",
  "role": "doc_repo primary checkout and merge target. Not a planner seat. ...
    refuses writes into another seat's _state namespace from here."
}
```

This session (and this doc_repo window generally) is `integration`. It is the canonical doc_repo checkout — where OPS-16/OPS-17, decisions, ADRs, and canonical docs get committed — but it is **not** a product-owning seat and has no product code to build. Concretely:

- It CAN write: any canonical doc_repo file (`90_operations/`, `_decisions/`, `80_adrs/`, `_inbox/`, `_sessions/`, etc.) on branch `main`.
- It CANNOT write: `_state/<any-other-seat>/STATE.md`. The hook refuses it. This came up today — `_state/govtech/STATE.md` is over a week stale and this session could not refresh it, only flag it.
- It does NOT do product-repo build work directly. Product work gets **dispatched** — compiled via `node scripts/dispatch.mjs --plan <OPS-16|OPS-17> --lane <ID> --plan-row <row>` — and hand-carried (pasted in full) into a fresh session rooted at the *owning* seat's registered worktree for that repo.

## The govtech seat, specifically (what today's work actually touched)

Per the registry, govtech owns `smartcity-dashboards`, `plan-review`, `smart-files`, `icc-portal`. Today's dispatches (G-115 items 1 and 4) went to a govtech-registered `plan-review` worktree — verify the exact current path against `_catalog/seat_register.json`'s `govtech` block before opening a new window, since worktree paths get re-registered as work moves between cards (the same physical `plan-review` clone has carried several different feature branches across this program's life; the registry entry, not memory of an old path, is authoritative).

`_state/govtech/STATE.md` is that seat's own rolling pickup note. It can only be written from a session rooted in the govtech seat's *doc_repo* worktree (a separate registered entry from its product-repo worktrees — check the registry for the exact path; per today's finding it may need re-registering if it's not current). It has not been refreshed since 2026-08-25 and is a full session behind — a govtech-seat session should refresh it before doing new work, per `90_runbooks/current_state_protocol.md`.

## A likely source of the confusion

The registry (`_catalog/seat_register.json`) is large (900+ lines) and append-only — most entries are one-off, single-card worktrees registered for a specific finished task and never de-registered (the file's own convention is to retire by leaving the entry as history, not delete it). If you're opening windows against paths you remember rather than paths you just looked up in the current registry, you will very plausibly land in a stale or wrong worktree — the wrong branch, or a worktree that was already retired. **The fix is always: read the registry fresh, find the exact current entry for the repo and card you're working, open exactly that worktree.** Don't reuse a path from memory or from an old chat.

## Clean reset checklist

1. Close all open sessions/windows.
2. Read `_catalog/seat_register.json` fresh — don't trust cached knowledge of what's registered.
3. For each seat you want a session in, confirm its worktree exists on disk and is on the branch the registry says (`git -C <worktree> status` / `git -C <worktree> branch --show-current`).
4. If a worktree path in the registry no longer exists or is wrong, that's a real registry-drift bug — fix the registry entry (or ask the planner to) before opening a session there, rather than working around it.
5. Open new sessions one at a time, each rooted at exactly one registered worktree. Confirm each session declares its own seat correctly before it does any work (per `61_enforcement_doctrine.md`'s "Which seat are you" protocol — every session should self-identify, confirm its worktree/branch, and refuse to proceed if it can't).
6. For doc_repo work specifically (what this session was doing all day), that's the `integration` seat at `P:/doc_repo` on `main` — nothing to reconfigure there, it's a fixed, permanent entry.

## What's genuinely still open (don't lose this in the reset)

- **G-115** (`_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md`, OPS-17): items 1, 4, 5 closed today. Items 2 (a live matrix run under the real `bastrop_tx` persona), 3 (honest UDC coverage measurement), and 6 (a real staff go-live — the operator's own action) remain.
- **`_state/govtech/STATE.md`** needs a refresh from inside the govtech seat's own doc_repo worktree — not attempted from `integration`.
- **Smart Files** needs a `bastrop_tx` entry in its own `QA_PERSONAS` before a Bastrop-persona file upload works.
- **A substrate-seat finding, not yet routed as a dispatch:** `hauska-mcp-server`'s `list_jurisdictions`/`query_jurisdiction` report `accessPolicy: public-free` at the jurisdiction-rollup level for atoms whose individual `get_atom` calls refuse anonymous reads — two independently-derived signals disagree. Named in G-115's close, not fixed.
- Full session record: `_sessions/2026-09-02_govtech_wave1_close_and_bastrop_permitflow_start_claude_code.md`.
