---
decision_id: 2026-08-19_salvage_tw21_design_system_docs_preserved
date: 2026-08-19
owner: operator (preservation action by systems seat)
status: active
related_canonical:
  - _catalog/branch_declarations.json
  - _decisions/2026-08-19_salvage_tw21_design_system_docs_preserved.md
review_by: 2026-09-19
---

## Decision

Preserve `salvage/tw21-design-system-docs` on `empressaioemail-tech/smart-markets` without merging or deleting until the operator decides merge versus deliberate abandon.

## Context

The branch carries 2,941 insertions (`docs/design-system.html`, `docs/design-system.md`) salvaged from the TW-21 shared-clone collision. It existed only on an unmerged local branch and was one branch deletion from permanent loss. Preservation is independent of hygiene-control arming and does not require reading the content.

## Structural commitment check

Tenant data sovereignty: N/A (public design docs on product repo).
Cost per jurisdiction: N/A.
Dual interface / MCP-first: N/A.
Sell reasoning not data: N/A.

## Reasoning

Irreversible loss risk outranks merge/abandon timing. On 2026-08-19 the systems seat pushed the branch to `origin/salvage/tw21-design-system-docs` at commit `d85743d45f62a9c92d9c6c046e574a2e7d0e92bf`. Reachability confirmed from two refs: local branch `salvage/tw21-design-system-docs` and remote `origin/salvage/tw21-design-system-docs` (same SHA). Merge versus abandon is deferred; this record closes the open preservation question only.

## Reversal criteria

Revisit by **2026-09-19** (`review_by`) if neither merge nor abandon has been decided. Supersede this decision when either: (a) the two files land on `main` via an approved merge, or (b) the operator files an explicit abandon record after confirming the content is duplicated elsewhere or is no longer needed.

## Dependencies

Markets seat declaration in `_catalog/branch_declarations.json` (status `live`). TW-21 / Smart Markets design-system programme.

## Counterparties

Internal: markets substrate seat, doc_repo planner.
