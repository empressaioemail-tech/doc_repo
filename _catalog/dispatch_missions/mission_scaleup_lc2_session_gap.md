## Mission — L-C2 SESSION GAP: read the 61 session files the blocker register never covered

**Read-only lane.** You are the dispatch planner executing this lane YOURSELF. **You spawn no
sub-agents at any depth.** The previous blocker-history lane spawned workers against its
instruction, and one stalled; that is exactly how these 61 files went unread. You write no product
code and change no store.

### Your seat and first commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`. Your research wave commit `ec2e0ee8` is already merged into main, so
this is a fast-forward:

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

**If the fast-forward fails, STOP and report. Do not reset, rebase or discard anything.** Declare
the commit you are on in your first output.

### Why this exists

The operator wants a complete reconciliation of every blocker hit while bringing the six counties
online, so Burnet, Bell and Milam hit none of them twice.

The register exists: `_inbox/2026-09-16_scaleup-lc_blocker_register.json`, with 361 instances in
18 classes plus candidates. Its own close says the `_sessions/` window **2026-08-21 through
2026-09-13 was never swept file by file**. The operator approved closing that gap before the
final teardown (A-180).

### The files: every one, no sampling

Every file in `_sessions/` whose name sorts from `2026-08-21` up to, but not including,
`2026-09-14`. That is **61 files at doc_repo main 48bca6cd** (list them yourself with
`ls _sessions | awk '$0 >= "2026-08-21" && $0 < "2026-09-14"'` and state the count you get).

The last batch the previous lane delivered covered 2026-09-13 onward. The 2026-09-13 files may
therefore already be partly represented: **check each finding against the register before adding
it.**

### What you produce

1. **An addendum to the register**,
   `_inbox/<date>_scaleup-lc2_blocker_register_addendum.json`, in the SAME schema as the existing
   register. One entry per NEW instance, carrying:
   - date;
   - county and city;
   - stage;
   - symptom;
   - root cause with file and SHA;
   - class (C1 to C18, or a named candidate);
   - how found;
   - fix status **with evidence confirmed at source** (a PR, a commit, and whether it deployed);
   - recurrence control;
   - cost where stated;
   - `sourceSession`, the file you read it in.

   An instance already in the register is not duplicated. List it in `alreadyRegistered` with the
   existing entry's id.
2. **A per-file ledger,** `_inbox/<date>_scaleup-lc2_session_ledger.json`. One row per file:
   - the path;
   - whether it was read in full;
   - the number of instances found;
   - the number already registered;
   - the number new.

   **A file listed as read in full with zero instances must say why** (for example, "design-only
   session", or "no blocker described").
3. **An updated class table and unfixed list**,
   `_inbox/<date>_scaleup-lc2_class_table_delta.md`: the class counts after the addendum, and
   every new instance that would hit Burnet, Bell or Milam.

### Rules

- **Exhaust the question.** Read every file to the end. A file you could not finish is recorded
  as not finished, never as read.
- **Confirm "fixed" at source.** Where a session says something was fixed, check the PR or commit
  and whether it deployed. A session saying "fixed" is a claim, not evidence.
- **The seventh-class trap.** When several sessions repeat one claim, find the original source.
  Repetition is not independence.

### Falsifiers

Pre-register your answers before you run anything.

1. The per-file ledger has exactly as many rows as the file count you listed. A missing row is a
   failure.
2. At least one instance in the addendum is marked `fixed-undeployed` or `fixed-unverified` after
   your source check. If none is, say how you checked.
3. **Not vacuous:** at least three files are recorded as zero-instance with a stated reason, or
   you explain why every file in a 61-file window described a blocker.

### Close

**Close JSON.** `_inbox/<date>_scaleup-lc2-session-gap_close.json`, carrying:

- `planRows` `["P-188"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.

**Committing.** Commit to your seat branch with explicit pathspecs, each git verb in its own call,
and push. **Your reply lists every path and the pushed commit SHA.**
