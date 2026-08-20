---
decision_id: 2026-08-20_61_enforcement_doctrine_canonical_path
date: 2026-08-20
owner: systems
status: active
related_canonical: [61_enforcement_doctrine.md, OPS/61_enforcement_doctrine.md, ENFORCEMENT.md, 62_seat_topology.md]
---

## Decision

Numbered-band `61_enforcement_doctrine.md` is the canonical doctrine. `OPS/61_enforcement_doctrine.md` is a dispatch-package pointer with no second body.

## Context

Two copies existed. The OPS copy was longer (2026-08-19) and held unique GATE sections. The numbered-band copy was shorter (2026-08-20) and held revisions 3 through 6, including the log corollary and the ruling that open questions were closed. Choosing one by deleting the other would have dropped unique law. Both files were untracked, so a clone citing ENFORCEMENT.md would not have the doctrine at all.

## Structural commitment check

Hauska spine: enforcement is estate control, not a product surface. Cost per jurisdiction: not applicable. Dual interface: not applicable. Tenant sovereignty: not applicable.

## Reasoning

Dual-home documents follow one pattern: numbered-band or `90_runbooks/` is canon; `OPS/` is the pointer used when a dispatch package needs a stable path. That is already how 62, 90, and 91 work. Reconciling rather than preferring keeps the GATE sections and the dated operating-law in one file. Tracking that file is what makes the clone have the doctrine ENFORCEMENT.md claims to be derived from.

## Reversal criteria

Reopen only if a dispatch consumer must carry a full body under OPS and the compiler cannot follow a pointer. In that case copy from numbered-band into OPS as a generated artifact, not as a second edited original. Do not silently restore a second body.

## Dependencies

C-00 vehicles derive from ENFORCEMENT.md. Cited-untracked (`scripts/enforcement/cited-untracked.mjs`) fails if a tracked file names this path and the path is not in git.

## Counterparties

Internal. Systems owns the file. Every seat loads ENFORCEMENT.md.
