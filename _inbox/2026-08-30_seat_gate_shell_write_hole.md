---
id: 2026-08-30_seat_gate_shell_write_hole
title: SEAT-01 gate inspects git verbs in shell mode, so a shell-written file bypasses it
date: 2026-08-30
status: found, not fixed (thread scoped to MCP by the operator; routed for its own card)
plan_row: unassigned; enforcement tooling
control: scripts/enforcement/seat-worktree-gate.mjs
found_by: the M-4 lane, from the outside, after the gate blocked a legitimate Write
---

# What happened

The gate blocked a subagent's `Write` into `P:/tmp/legacy-design-tools-p91-stone` because `_catalog/seat_register.json` still pinned that worktree to `feat/p91-v3-map` while the lane was on `feat/p91-v3-multi`, a branch the planner had instructed it to cut and had not re-pinned. That block was a false positive caused by planner error, and the register is now corrected.

The lane then wrote the same file through the shell and it succeeded. It reported both halves rather than only the one that inconvenienced it.

# The finding

In shell mode the gate inspects one thing:

    const looksLikeGitWrite =
      /\bgit\b[^&|;]*?\b(add|commit|push|restore\s+--staged|rm\s+--cached)\b/i.test(command);

So `Write` and `Edit` are gated by path, and `Bash` is gated only for git write verbs. Every other way a shell mutates a path reaches the same state without passing through the control: a heredoc, `tee`, `>>`, `sed -i`, `cp`, `mv`, `node -e` with `writeFileSync`, or any script that does the same. The tool-shaped half of the control is armed and the shell-shaped half is absent for file writes.

The gate's own header lists what bypasses it: editors outside the agent harness, git GUI, and `core.hooksPath`. Shell file writes are not on that list, so the documented bypass set is also incomplete, which is the more dangerous half: a reader checking the control's scope would conclude paths are covered.

# Why it surfaced this way, and what that says

The friction surfaced the silence. A control that fires wrongly generates a complaint; a control that never fires generates nothing. The doctrine already says that where a scope defect surfaces through friction, go looking for the silent half. Here the silent half was found only because a false positive sent someone around the control, and the person who went around it said so.

The three-question gate's fourth question is the one this fails: what bypasses it. The honest answer for path protection was never none, and it was never written down.

# Not fixed here

The operator scoped this thread to the MCP app. A fix is a shell-write predicate over the same worktree-ownership check, which carries real false-positive risk (any command containing a redirect into an owned path, temp files, build output) and deserves its own card with its own violation proof rather than being bolted on inside a product wave. Two things a fix must do, so they are not rediscovered: name shell file writes in the header's bypass list even if the predicate lands narrow, and prove the new predicate by violation in both directions before it is trusted.

Interim, and it is weak on purpose because a remembered rule is not a control: a lane that finds itself blocked by SEAT-01 reports it rather than routing around it, and the planner fixes the register. That is exactly what happened here, which is the only reason this is a record rather than an incident.
