---
id: 2026-08-04_elgin_setback_table_ratified
title: Decision — Elgin setback table RATIFIED, with two display directives (governing-district routing; details in the X-ray)
date: 2026-08-04
status: active
owner: nick
related: [_sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code, 90_operations/onboarding_defect_class_backlog]
---

# Elgin setback table ratified

## Decision

The operator ratified `elgin-development-code.json` (8 districts, per-field atom-DID + verbatim-quote provenance, not_specified honesty on conditional cells) after reviewing sample rows (R-1 clean scalars, C-2 conditional). Registration in SETBACK_TABLES un-comments via the ratification PR; the table may serve.

Two directives attach to the ratification, operator verbatim intent:

1. **Conditional cells route users to the governing answer.** In the commercial instance, if C-1 governs (adjacency), show the setbacks from and cite the C-1 table — or if that gets messy, at minimum cite the governing table. "We want users to get the answers they came for." Implementation: the ratification PR adds machine-readable `governed_by` fields to conditional cells; the display work (PE inspect/X-ray rendering of governed-district values with citations) is a named product item.

2. **Minimums display as modeled; details spell out in the X-ray.** The one-vs-two-story side-yard split and corner-case values stay modeled as minimums in the scalar (consistent with Bastrop), and the fuller rule text (already carried in per-field provenance notes) must render in the X-ray/detail surface.

## Why

The table's honesty discipline (no invented scalars, verbatim quotes, not_specified over guesses) was verified planner-side against the corpus; the operator's directives close the gap between honest data and useful answers — a not_specified cell is honest but unhelpful alone; the governing rule is known and citable, so route to it.

## Reversal criteria

De-register the table (re-comment SETBACK_TABLES) if a served Elgin scalar is found to misstate the code on verification against the adopted text — same standard as any setback table.
