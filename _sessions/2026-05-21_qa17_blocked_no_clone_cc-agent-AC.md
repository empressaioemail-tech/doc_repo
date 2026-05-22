---
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
session_type: recon
rolled_up: true
rolled_up_into: [00_current_state, 2026-05-21_cc-agent-AC_qa17_cortex_substrate_integration]
---

> Filed by the doc_repo planner from the cc-agent-AC `_inbox/` courier
> drop per HR-11. cc-agent-AC correctly hit the QA-17 dispatch's
> workspace-ownership stop-and-surface trigger and did no work.
> Resolution: the QA-17 dispatch has been amended with an explicit
> workspace-provisioning step — cc-agent-AC clones its own
> `legacy-design-tools` at `P:\ldt-ac-qa17` and branches `qa-17/*` from
> `origin/main`. The Cortex product key (point 3) is an outstanding Nick
> action, now tracked in `00_current_state.md`. The secondary
> observation (point in the note) is a non-issue: cc-agent-C's close-out
> was couriered to `_sessions/2026-05-21_cortex_qa_close_out_cc-agent-C.md`
> at commit 807526b; the `_research/` copy is cc-agent-C's own retained
> copy, not a stranded courier.

# QA-17 cannot start — workspace premise is false on disk

**Status: BLOCKED. Surfacing to the planner per the QA-17 dispatch's
Workspace-ownership clause and HR-11. No QA-17 work performed. Nothing
changed in any repo.**

## The blocker

The QA-17 dispatch and the activating instruction both state cc-agent-AC
works from a **dedicated `legacy-design-tools` clone, separate from
cc-agent-C's**. That clone does not exist.

There is exactly one current `legacy-design-tools` working tree on disk,
`P:\legacy-design-tools`, and it is **cc-agent-C's** tree:

- It is checked out on `qa-22/site-context-reliability` — cc-agent-C's
  QA-22 Part 1 branch (the next task assigned to cc-agent-C per
  `00_current_state.md` §4).
- Its working tree carries cc-agent-C's uncommitted scratch, including
  `_research/2026-05-21_qa_close_out_cc-agent-C.md`.

The dispatch's Workspace-ownership clause is explicit: *"If you enter a
working directory and see another agent's uncommitted changes, stop and
surface to the planner."* That trigger fired. I stopped.

All other `legacy-design-tools`-family directories on `P:\` are stale
worktrees from the May 2–6 sprints (`ldt-*`), the most recent being
`ldt-c3-reclassify` (2026-05-19). None is a fresh 2026-05-21 clone for
cc-agent-AC.

## Verbatim evidence (HR-8 / HR-1)

`P:\legacy-design-tools`:

```
$ git remote -v
origin  https://github.com/empressaioemail-tech/legacy-design-tools (fetch)
origin  https://github.com/empressaioemail-tech/legacy-design-tools (push)

$ git status --short --branch
## qa-22/site-context-reliability
?? .claude/
?? .cursor/
?? RECON_2026-05-18_codex.md
?? _research/2026-05-20_stash0.patch
?? _research/2026-05-20_working_tree_forensics.md
?? _research/2026-05-21_qa04_session_close.md
?? _research/2026-05-21_qa_close_out_cc-agent-C.md
?? debug.log
?? pr-body.md

$ git rev-parse HEAD origin/main
26603c60c16c6abb2a19aeb0131a122d01a44f72
26603c60c16c6abb2a19aeb0131a122d01a44f72

$ git log --oneline origin/main -5
26603c6 feat(documents): engagement-scoped client document upload (QA-18) (#62)
623b75e fix(chat): auto-scroll the in-app chat panel while streaming (QA-19) (#61)
6cf6ff4 fix(chat): flag ungrounded code answers for uncovered jurisdictions (QA-23) (#60)
0468e3c fix(ifc): isolate IFC parse in a worker_threads worker (QA-16) (#59)
0239fcd Merge pull request #58 from empressaioemail-tech/fix/qa-04-cortex-api-memory

$ git branch -a | grep -i qa-17
(no output — no qa-17/* branch local or remote)

$ git diff --stat
(no output — no tracked changes; the qa-22 branch sits exactly at origin/main)

$ gh pr list --state open
19  chore: gitignore local agent scratch + triage + replit bundle  OPEN  2026-05-06
17  Track C — IFC viewer + PL-01 layout/copy fix                    OPEN  2026-05-05
12  feat(briefing): auto-fire on engagement.created                 OPEN  2026-05-02
```

No QA-17 branch, no QA-17 PR, no cc-agent-AC-authored PR. The three open
PRs are all stale (May 2–6) and unrelated to QA-17.

## What I did NOT do, and why

- **Did not start QA-17 in `P:\legacy-design-tools`.** Two agents in one
  working tree is the exact coordination-failure class HR-1/HR-2 and the
  operating rules exist to prevent, and it would collide head-on with
  cc-agent-C's active QA-22 work — violating the dispatch's "keep file
  overlap at zero."
- **Did not switch the branch or create `qa-17/*` here.** cc-agent-C is
  mid-flight on `qa-22/site-context-reliability`; checking out another
  branch in its tree would disrupt cc-agent-C's working state.
- **Did not self-provision a fresh clone and proceed.** The dispatch's
  instruction for this exact situation is "stop and surface," not
  "improvise." QA-17 is operator-supervised and additionally needs
  operator coordination to mint a Cortex product key; proceeding solo on
  an un-provisioned workspace is not the call to make unilaterally.

## What the planner needs to decide

1. **Provision cc-agent-AC's clone**, or explicitly authorize me to
   `git clone` a fresh `legacy-design-tools` into a dedicated directory
   (suggest `P:\ldt-ac-qa17`) and branch `qa-17/*` from `origin/main`
   (`26603c6`). Once that exists with zero shared files, QA-17 can run.
2. **Confirm QA-22 ↔ QA-17 file-overlap is genuinely zero.** The
   dispatch scopes cc-agent-C to `chat.ts` / IFC / upload and cc-agent-AC
   to the cortex-api substrate client + the Code Library page. cc-agent-C
   is now on `qa-22/site-context-reliability` (site-context). Confirm
   site-context work does not also touch the Code Library page before
   both run in parallel.
3. **Cortex product key.** QA-17 needs an authenticated Cortex product
   key (MCP admin key-issuance endpoint) to see the three
   platform-internal jurisdictions. That requires operator coordination
   regardless of clone provisioning — flag it now so it is not a
   mid-task stall.

## Secondary observation (verify, not a hard claim)

cc-agent-C's tree carries `_research/2026-05-21_qa_close_out_cc-agent-C.md`
untracked, and the doc-repo `_inbox/` currently holds only `README.md`.
The `00_current_state.md` watch list already notes cc-agent-C previously
drafted into `legacy-design-tools/_research/` instead of `_inbox/`. The
QA close-out content does appear to be reflected in `00_current_state.md`
§5 already, so this may be a non-issue — but worth a glance to confirm
cc-agent-C's close-out was couriered, not just left in `_research/`.

## Re-entry state for cc-agent-AC

Dispatch read and understood. Ready to execute QA-17 the moment a
dedicated clone exists. No durable in-repo copy of this note was
committed because cc-agent-AC has no own `legacy-design-tools` clone yet;
per `_inbox/README.md` §5 the `_inbox/` drop is the one required
artifact and is not blocked on that.
