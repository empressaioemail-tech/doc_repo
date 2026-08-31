---
decision_id: 2026-08-20_structural_questions_get_structural_instruments
date: 2026-08-20
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-19_systems_fleet_inventory.json
  - scripts/hygiene/worktree-audit.mjs
  - scripts/hygiene/branch-safety.mjs
  - 61_enforcement_doctrine.md
---

# Structural questions get structural instruments

## Decision

Any question about reachability, ownership, or identity is answered by an instrument that traverses the structure, not by a pattern that matches text. A text search over a structural property is a presence-shaped predicate over a meaning-shaped question. It can only tell you a string occurred.

## Context

The property seat established this from three wrong answers in one session: a graph walker discriminated a live defect from a comment describing one where two greps could not. The same class of error is on record from earlier in the week: inferring seat identity from a branch naming prefix. Operator close card 2026-08-20 applied the rule to the worktree audit, the declaration reader, and anything the registry eventually does.

## Structural commitment check

Hauska spine: measurement honesty. Confidence is earned: a coverage claim that a grep cannot fail is unearned. Tenant sovereignty: not implicated. Cost per jurisdiction: not implicated.

## Reasoning

Independently derived inputs are required for a meaning-shaped check. Path existence, `git worktree list`, and the declaration reader (named rows then bulk rules) are traversals. A grep for a host name, a seat prefix, or a defect string is one derivation: the text is present or it is not. That predicate cannot tell a live worktree from a comment, a local path from a string that looks like one, or a declared seat from a branch that happens to contain a hex suffix.

HY-04 therefore classifies each worktree by `fs.existsSync` and UNC prefix (`hostClassForPath`). Off-host and missing paths are unmeasured, not stale. Unmeasured protects under the second-signal rule. The declaration reader already traverses schema rather than grepping branch names. Future registry work follows the same rule.

## Reversal criteria

Reverse only if a structural walk is shown to be unreachable for a given question and a second independently derived input exists that is not text occurrence. Do not reverse because a grep is faster.

## Dependencies

HY-04 locality confirmation `_inbox/2026-08-20_systems_worktree_locality.json`. Fleet inventory unknown column (off-host actors). BP-02 must consume hostClass; it is not started from the systems hygiene close.

## Counterparties

Internal: systems seat, property seat, markets seat, operator.
