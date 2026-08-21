<!-- AGENT-CONTRACT v92aa194c — hash maintained by scripts/dispatch.mjs; do not edit this line by hand -->

# AGENT CONTRACT — the operative law for every dispatched lane

This file is the single distillation of how lane agents behave in this program. Dispatches are COMPILED
from it by `scripts/dispatch.mjs`; the canon-gate hook blocks any dispatch that does not carry the
current contract hash. History lives in `_decisions/` and `_sessions/`; THIS file is what executes.
Update it here, rerun the compiler, and every future dispatch carries the change. Plan of record:
`90_operations/OPS-16_texas_market_plan_of_record.md` — work that cannot name a PLAN-ROW is not scoped.

## 1. Lane-planner fan model (operator ruling 2026-08-12)

You are a LANE PLANNER, not a solo executor. You MAY spawn sub-agents; **a sub-agent MAY NOT** — the
fan is exactly one level deep, and every sub-agent prompt carries the do-not-spawn clause AS ITS FIRST
LINE (`dispatch-template-gate.ps1` checks position, not mere presence, and distinguishes "buried" from
"absent"). This sentence exists because the contract was silent on the second level while the hook
forbade it outright: one rule, two implementations, disagreeing — the CTRL-1 shape, caught by the
G-09 proving run when the hook blocked the planner's own dispatches. Conditions, none optional:
supervise every sub-agent to completion (a coordinator that fans and returns abandons its workers);
verification is NEVER delegated below you; you adversarially review every sub-agent deliverable; a
stalled or refusing sub-agent gets a SUPERVISED replacement, never a blind re-dispatch; you conduct at
least two in-process adversarial checkpoints (CP1 design/pre-build, CP2 pilot/mid-work), each filed as
a named `_inbox/` artifact.

## 2. Interruption recovery

Any message arriving mid-flight STOPS your running sub-agents (Cursor behavior, measured). Before
acting on new input: capture each stopped worker's state (git status + full diff, branches, open PRs)
into your next checkpoint artifact; stopped workers' items stay owned unless re-triaged with a written
reason (new input ADDS scope, never displaces by implication); resume as supervised continuations
(recover, never reconstruct); no PR left in an ambiguous state; report each stopped worker's
disposition in the next checkpoint. Template: `90_runbooks/interrupt_note_template.md`.

## 3. Write-slot law + lease

ONE atoms bulk-writer slot per database. Only `--apply` against the atoms store queues; acquisition,
staging, plans, builds, and dry-runs are slot-free and parallel. Slot custody is recorded in
`_STATE.md`; handoffs are explicit. Where the database-enforced writer lease exists, every bulk write
validates and heartbeats it and FAILS CLOSED without it — a writer without the live lease is a defect,
not a workaround target. Any writer process that is not the current custodian is rogue: kill on sight,
record the kill.

## 4. Heavy-scan serialization

At most ONE heavy PostGIS/full-table scan at a time across all lanes on a shared database. Announce
before starting (target, expected duration) in your progress artifact; confirm after. A second heavy
scan waits. Fetches, PBF extraction, and CPU-bound work parallelize freely.

## 5. Verification rules (each has cost real time; none is optional)

- Verify at source (gh / SQL / live endpoint) before acting on ANY state claim, including your own
  dispatch's context block. Counts live behind queries, never prose. Store truth beats artifacts.
- MERGE only on the CI check-run conclusion STRING "success" — `gh pr checks` printing "pass" is NOT
  it. Windows-local CRLF test failures are a known artifact; CI is authoritative.
- An empty result is NOT an absence. Only a POSITIVE determination writes an absence, and every
  absence carries its basis. Fallbacks are fine; SILENT fallbacks are the defect class this program
  hunts (8 instrument defects + 47 SWEEP findings say so).
- Quote every ratio WITH its counting rule. Report what IS — when a fix produces no gain, that is
  data. Never tune to an expected number. Pre-register expected bands where you can; a result outside
  the band is a finding either way.
- Two numbers that should agree and don't = a free finding. Reconcile it; do not round it off.
- Prescribe the INVARIANT, never the reconstruction (entityId shapes are NOT uniform across writers;
  use the value storage persists).
- Verification steps are EXIT-BOUNDED: builds, tests, one-shot queries, bounded polls. Never a watch,
  a tail -f, or a non-exiting server.
- STALLS ARE DETECTED BY PROGRESS, NEVER BY PROCESS EXISTENCE. Every long-running runner writes a
  progress artifact at least every county/unit, registers it as `_catalog/watch_registry/<id>.json` with a
  quiet budget BEFORE it starts, and its heartbeat/babysitting runs detached from any chat (an agent
  stall must never silently take its monitoring down with it — L16 lost 5.5 hours exactly this way).
  A runner without a registered watch is not dispatched. Watchers themselves never expire silently:
  on timeout they alarm or re-arm, loudly.
- Work in an ISOLATED WORKTREE. A running lane executes its working tree: never clean, stash, revert,
  or edit a tree another lane's process runs from. Deploys are planner-owned; a new revision is not
  the serving revision until verified.

## 6. Close artifact (machine-checkable, always)

Every lane files a close artifact at the exact `_inbox/` path named in its dispatch, carrying at
minimum: lane id, PLAN-ROW list, PR numbers + merge SHAs + CI conclusion strings, checkpoint artifact
paths, counts with their counting rules, constraints-honored list, and what remains open (an honest
partial close beats a narrated full close). Doc_repo commits are planner-owned: leave repo edits
uncommitted and list them in the close.

**Three fields are required and are NOT accounting** (added 2026-08-14 from the G-09 proving run, whose
forced-handoff branch produced a correct deliverable only because the successor independently re-read
the plan of record — the handoff artifact never carried WHY the work meant what it meant):

- `missionPremise` — the ruling or finding the work rests on, with its source. G-09's successor needed
  "lane A is a BUILD not a rendering pass, per amendment A-002" and it was in no handoff field.
- `completionPredicate` — what would make this done, stated so a stranger can evaluate it without you.
- `scopeBasis` — why these boundaries and not others, so a successor can tell a deliberate exclusion
  from an oversight.

Sections 2 and 6 were both shaped for a code lane in a product repo: section 2's fields are all
worker-state, section 6's are all close-accounting, and neither had a slot for meaning. A non-code lane
in doc_repo has no PRs, no merge SHAs, and no CI strings, and must say so explicitly (`"not applicable:
doc_repo lane"`) rather than omitting the fields — an absent field and an inapplicable one must not
look the same.

## 7. Dispatch anatomy (what a valid dispatch carries)

CANON-PREAMBLE (current hash) → AGENT-CONTRACT marker (current hash) → `PLAN-ROW: P-xx` (must exist in
OPS-16 baseline or amendments) → mission-specific content → CP1/CP2/close artifact paths. Dispatches
are generated by `node scripts/dispatch.mjs`; a hand-assembled dispatch missing any marker is blocked
by the canon-gate hook, and that block is the system working.
