---
id: OPS-18_canon_reconciliation_plan_of_record
title: OPS-18 — Canon reconciliation and governance plan of record
status: active
last_updated: 2026-08-20
applies_to: portfolio
owner: nick
related: [_blueprint/00_WDLL, 61_enforcement_doctrine, ENFORCEMENT, 51_ingestion_pipeline_reference, 90_runbooks/fleet_memory_practice, _catalog/plan_registry]
---

# OPS-18 — Canon reconciliation and governance plan of record

Third plan of record, row prefix `R`. `OPS-16` (`P`) is the Texas market. `OPS-17` (`G`) is
the govtech stack. This one is the operation governing itself.

## Why this is a plan of record and not a workstream

CLAUDE.md and AGENTS.md both say work that cannot name a plan row is not scoped. Until this
document existed, the programme designed to make rules bind could not name a row, so by the
operation's own standard it was unscoped. Worse, its dispatches would have had to travel by
hand-carry, which bypasses the canon gate entirely, because that gate fires on the Agent
tool and a prompt pasted into another agent never touches it.

Running the governance-repair programme through the governance bypass would have been the
defect it exists to fix. So it gets a plan, rows, and compiled dispatches like everything
else.

## The governing problem, in one line

The artifact exists and nothing feeds it or reads it.

Measured instances on 2026-08-20, all evidenced: the ingestion reference untracked and
diverged into two live bodies; ADR-028 partly shipped while marked proposed; fourteen atom
contract versions with no ADR; `atom_links` built, indexed and holding zero property edges;
ten shipped contract fields at zero in production; three ledger indicators constant across
all 3,556 cells; two launch criteria graded by those constants; tier2 flood retired with no
consumer repointed; the fleet memory promotion step never once executed; seven enforcement
scripts with no CI to run them; and a memory system audit that correctly diagnosed most of
this twelve days earlier and changed nothing.

## Baseline rows

| Row | Phase | Deliverable | Exit criterion | Status |
| --- | --- | --- | --- | --- |
| R-00 | Blueprint WDLL | `_blueprint/00_WDLL.md` | operator accepts the definition of done and the fifteen-item violation set | CLOSED `c6399e8` |
| R-01 | Canon reconciliation | `_blueprint/` and the mesh README | the blueprint correctly FAILS all fifteen violations, naming the rule each breaks; where it cannot fail one, that names a missing rule and is filed as an R-04 item | OPEN |
| R-02 | Doc catalog and quarantine | every doc classified; contradictions moved to `_quarantine/` | zero unclassified docs; every quarantined doc names the blueprint rule it contradicts; nothing deleted | OPEN |
| R-03 | Parts inventory | every part documented; dead and zombie parts quarantined | every running part has an owner, a purpose and a TERMINATION CONDITION; parts without one are quarantined | OPEN |
| R-04 | Governance gap analysis | the tooling register | every blueprint rule names a consumer, or is listed UNENFORCED with a build item against it | OPEN |
| R-05 | Adversarial review | refutation pass over R-01 to R-04 | every finding states a second mechanism and why it was rejected; the factory off-ramp gap resolved or filed | OPEN |
| R-06 | Build the governance tooling | hooks, CI jobs, types | each new control proven by violating it, never by watching it pass | OPEN |
| R-07 | Data audit | nodes, edges and atoms graded against the mesh | every atom family scored; unresolvable bindings COUNTED, never estimated | OPEN |
| R-08 | Data remediation plan | the fix plan | every defect class has an owner, a rule, and a control that would prevent recurrence | OPEN |

## Standing constraints on every row

No product code, no migrations, no store writes, and no new ADRs without an operator
ruling. Quarantine moves, it never deletes. No decision is reversed by an agent; where two
accepted decisions genuinely conflict, the conflict is filed for the operator.

Dispatches compile: `node scripts/dispatch.mjs --plan OPS-18 --lane <ID> --plan-row R-xx`.
Hand-assembled dispatches are blocked by design and the block is the system working.

Subagents do not commit. The planner commits, which forces reading the artifact.

## Work already landed under this plan before it existed

Recorded so the row history is honest rather than backdated. All 2026-08-20:

`492a452` filed the estate including the ingestion reference. `d6f87af` filed the production
store audit. `c6399e8` closed R-00. `ee4ea4a` built the missing Tier 1 memory store, wired
doc_repo's first CI, and retired the OPS residue. `2b3dc71` replaced a false-green workflow
with a ratchet after watching it run. `7f9f7e7` reconciled the two diverged copies of the
ingestion reference. `f3f3c3f` gave the memory promotion gate a trigger.

Those belong to R-00 and to preparatory work for R-01. They are not a claim that R-01 is
underway.

## Reversal criteria

Retire this plan when R-08 closes, or when an operator ruling folds the remaining rows into
`OPS-16` or `OPS-17`. Do not let it become a permanent third program. A governance plan that
outlives its own repair is the artifact class it was built to remove.
