---
id: 62_seat_topology
title: Seat Topology and Write Authority
status: draft
last_updated: 2026-08-20
applies_to: portfolio
related: [61_enforcement_doctrine, enforcement_vehicles]
owner: systems agent
---

# Seat Topology and Write Authority

## Purpose

Multiple planning seats operate concurrently, each fanning subagents. Three concurrent write events occurred in one day in one repository, two of which could have destroyed work. This document defines the topology that makes that structurally impossible rather than a matter of care.

The design constraint is that the operator must not be a bottleneck. Every rule below is chosen so that seats self serve and escalation is reserved for genuine cross seat conflict.

## The root cause this replaces

The incidents were not merge failures. Git handles concurrent writers well. They were shared checkout failures: several processes staging into one index. A staged artifact belonging to one seat was nearly swept into another's commit. A file was clobbered between write and add. Neither is fixable by discipline, and both disappear once each seat holds its own index.

## Three layers

**Operator.** Authorises deploys and irreversible actions, holds credentials, adjudicates cross seat conflict. Not in the commit path.

**Planner seats.** Own repositories, hold a worktree and a branch, commit, and review subagent output before committing it.

**Subagents.** Produce artifacts and hand them back. They do not touch git.

## The rules

**Only planners commit.** This is the rule that makes fan out safe. Five subagents under a planner add zero writers, so concurrency does not scale with parallelism. It also forces the review: a planner must read an artifact to commit it, and a subagent reporting success is a claim.

**One worktree and one branch per seat.** `git worktree add` gives each seat its own checkout and index against the same object store. Index collisions become impossible rather than unlikely. Two worktrees cannot share a branch, which is why the branch follows from the worktree.

**Merge to main is self service.** Each seat merges its own branch. Gating merges on the operator makes the operator the bottleneck the moment three seats run concurrently. GitHub branch protection is the merge gate. Stage 1 landed 2026-08-20; current state is in `_inbox/2026-08-20_branch_protection_close.json`, not in this sentence.

**Product repositories are exclusive.** One seat writes to a repository. Where two seats need one repository, either split by path with the split declared, or name one owner and have the other request changes. Unowned is how index collisions return.

**Shared files get one writer.** A file appended to by several seats is the hardest coordination problem available and it caused every incident. Convert to a directory with one file per seat, and generate any combined view rather than maintaining it. This applies to state documents, override logs, and anything else with many appending writers.

**Cross seat findings route through the operator.** Not seat to seat. A seat that disagrees with another seat's closed finding reports both readings with evidence and lets the operator route it. This has already worked once, on a control ownership contradiction between two seats.

**Shared canon has a single owning seat.** Where two seats must edit one document, accept conflicts and adjudicate. A merge conflict on doctrine is a request for a human decision about which version is right, which is correct behaviour rather than friction.

## The seat register

Every seat is declared in `_catalog/seat_register.json` before it operates. Adding a seat is filling a form, not a design exercise.

Per seat, six fields:

```
seat            short stable name
repos           product repositories owned exclusively
worktree        absolute path to this seat's checkout
branch          this seat's branch, one only
namespace       its directory under _state/ and its _inbox/ prefix
authority       what it may do without asking
```

The register is the input to any control that needs to know what a seat is, including the branch prune, which must treat every registered seat branch as live. Extra worktrees that are not seats (`otherWorktrees` in the register) are named so they are not "unregistered" by accident. They are not writer seats. SEAT-01 refuses writes from them.

## Dual-home documents

Numbered-band and `90_runbooks/` files are canon. Matching names under `OPS/` are dispatch-package pointers. Edit the canon path. A second body at the OPS path is a defect. 62, 90, and 91 follow this. 61 follows this.

## Uncommitted estate

Seat worktrees materialise the commit. They do not carry integration untracked files. That is the topology working. It also means the uncommitted estate is invisible from `git status` in a seat worktree.

Query it from any seat: `node scripts/hygiene/untracked-estate.mjs`. That script runs `git status` against the integration checkout named in the register. Default output is counts. Pass `--full` for porcelain lines. It does not copy files into seat worktrees.

Remaining many-writer files this pass did not split: OPS-16 and OPS-17 amendment tables (dispatch.mjs still reads those files; splitting them without changing the compiler is a starved split). `_catalog/thesis_parity_ledger.md` stays planner-owned for the table; new findings may still append there until a findings directory has a write path. Flagged, not split.

Anything a tracked document cites must itself be tracked. `scripts/enforcement/cited-untracked.mjs` fails when a tracked file names a path that exists on disk and is not in git. That is how a clone is prevented from missing the doctrine a vehicle claims to be derived from.

## Session bootstrap

A fresh seat, at session start, in this order:

1. Identify itself from the register. If its seat is not registered, it registers before working.
2. Confirm it is in its own worktree on its own branch. If not, it stops and says so rather than working in another seat's checkout.
3. Load `ENFORCEMENT.md`, which arrives through `CLAUDE.md` or the Cursor rules file depending on harness.
4. Declare its snapshot in its first output.

A seat that cannot complete steps one through three reports that rather than proceeding, because a seat operating outside the topology is exactly the condition this document exists to prevent.

## What still requires the operator

Deploys to production. Irreversible deletions. Credentials. Cross seat adjudication. Authorising a claim that has failed its own test twice.

Everything else is self service.

## What this does not solve

Two seats editing genuinely shared canon will conflict, and that is intended. A conflict there is information.

Subagents can still produce wrong artifacts, and the planner reviewing them is the only control on that. Nothing structural prevents a planner from accepting a subagent's report without reading it.

Harness coverage remains partial. Seats running on harnesses that load neither vehicle file are unreached by the rules layer entirely, and the honest position is to name that set rather than assume the fleet is covered.

## Revision history

2026-08-20, topology finish: extra worktrees named in the register, dual-home pointers, uncommitted-estate query, cited-untracked control.

2026-08-20, drafted following three concurrent write events in one repository in one day, two of which could have destroyed work. Establishes three layers, the only planners commit rule, worktree and branch isolation, and the seat register.
