---
decision_id: 2026-08-19_bp01_ldt_historical_prune_declaration
date: 2026-08-19
owner: operator
status: active
related_canonical:
  - _catalog/branch_declarations.json
  - _catalog/branch_bundles/ldt-bp01-152-2026-08-19.bundle
  - _decisions/2026-08-19_replit_agent_seat_decommissioned.md
  - 90_runbooks/90_enforcement_build_order.md
---

# BP-01 operator declaration: LDT historical merged locals

## Decision

Merged local branches in `P:/legacy-design-tools` with no worktree attached and tip date before 2026-08-01 are prune-safe, asserted by the operator as one bulk rule, not inferred by the scanner. The 16 August refs and `replit-incoming` are named holds. Deletion of the matching remainder proceeds only through armed HY-01.

## Context

HY-01 found 152 undeclared merged locals in legacy-design-tools with no worktree. Nobody owns LDT history: the producing seats are closed lanes and tip authors are merge and CI identities. Fail-closed exists to stop the scanner inferring ownership, not to stop a human asserting it. Merge kind, not era, is the loss cut: 66 ancestry plus 4 empty-diff lose nothing nameable on delete; 82 squash or cherry hold intermediate commit history only on the local ref. That history is bundled once rather than judged 82 times.

## Structural commitment check

Hauska spine: housekeeping of a product-repo working tree, not a thesis change. Tenant sovereignty: not implicated. Cost per jurisdiction: not implicated. Confidence: the bundle restore is the evidence that squash history survives delete.

## Reasoning

A bulk rule signed by the operator, with named criteria and a date, is a declaration. The reader applies named rows first, then the bulk rule, then undeclared. `replit-incoming` is excluded because its tip subject is "Published your App" and Replit seat retirement is a separate decision; sweeping it would retire a seat artifact inside a branch prune. August tips from 2026-08-01 through 2026-08-14 are recent enough to list individually and cheap enough to hold. The 65 worktree-attached LDT refs are out of scope; worktree attachment still blocks delete.

## Reversal criteria

Restore any deleted ref from `_catalog/branch_bundles/ldt-bp01-152-2026-08-19.bundle` if a named lane still needs the commit-level history. Flip the bulk rule off if a still-live LDT local with tip before 2026-08-01 was misclassified. Do not reverse by deleting the bundle first.

## Dependencies

Depends on HY-01 merge detection (ancestry or content-cherry against origin/main) and on gh PR check verifying. The Replit hold depends on `_decisions/2026-08-19_replit_agent_seat_decommissioned.md`. BP-02 worktree audit remains ahead of any further HY-01 reach growth.
