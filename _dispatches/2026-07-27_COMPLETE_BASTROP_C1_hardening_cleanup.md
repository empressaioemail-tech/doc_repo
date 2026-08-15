---
id: 2026-07-27_COMPLETE_BASTROP_C1_hardening_cleanup
title: Dispatch C1 — Dual-table hash-lock + contract pin (S-05/S-08, H1/H2) GO
date: 2026-07-27
status: GO
owner: executor (hauska-engine + legacy-design-tools)
planner: adversarial-audit (CTX HELD — planner grades live)
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 8,9
audit: _inbox/2026-07-27_COMPLETE_BASTROP_hardening_audit.md Section C
---

# Dispatch C1 — Dual-table lock + contract unvendor — GO

Operator approved WDLL 2026-07-27. Engine vs LDT `bastrop-city-tx.json` differ (19670 vs 19258 B). Atoms package still `^1.9.0` with vendored parcel-terrain while npm is **1.11.0**. Adapter honesty (H3/S-06) is **C2 — not this dispatch**.

## Do (WDLL 8,9)

1. Diff both `bastrop-city-tx.json` files; pick single source of truth (prefer the depth/roadClass-complete table if one has it — paste diff). Sync the other. Add **CI hash-lock** (or publish one shared package) so they cannot diverge silently.
2. Bump `@hauska-engine/atoms` to `@empressaio/atom-contract` **>=1.10.0** (target 1.11.0). Delete vendored `parcel-terrain-model` alias and “until 1.10.0” comments. Drop unused `@hauska/atom-contract` live dep if safe.
3. Mark `property-atom-proof.ts` RS fixture as **fixture-only** (S-13 acceptance hygiene).

## Do NOT

- Change setback numeric values without B3 citation + planner review
- Silent merge without pasted diff
- Adapter comment scrub (that is C2)
- Self-grade WDLL

## Close artifact

`_inbox/2026-07-27_COMPLETE_BASTROP_C1_executor_close.md` with SHA256 match proof, package.json pin, PR URLs.
