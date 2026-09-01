---
id: 2026-07-23_pe_no_honest_empty_setbacks_WDLL_amendment
title: WDLL amendment — populate setback tables (no honest-empty target)
status: approved
date: 2026-07-23
applies_to: legacy-design-tools
related: [2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment, 2026-07-21_property_explorer_v1_sprint_WDLL]
owner: nick
---

# WDLL amendment — no honest-empty setbacks

Date: 2026-07-23  
Status: approved (operator: keep going until done; no QA until planner done; goal = no honest-empty — make the tables, execute, track)  
Amends: items 43–44 of `_inbox/2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment.md`

## Reason

Operator raised the bar from "populated OR honest-empty" to **populate tables everywhere possible**, rebake, and track until done. QA waits until planner declares done.

## Done looks like

Every Central-TX PE jurisdictionKey that currently serves an empty setback table (or declines `setback-table-pending` for common GIS codes) has a **populated, citation-backed** district table for the common scalar case. Conditional ordinance rules that the envelope cannot evaluate are recorded in the table `note` and omitted as extra districts — they do **not** leave the whole city empty. City of Bastrop B3 Place Types P-1…P-5 have explicit rows. City parcels resolve to the city table (not county Public/Institutional). Affected counties are rebaked; live probes show envelopes or a specific unmapped-code decline — not blanket `setback-table-pending` for those cities.

## Acceptance items (additive)

51. Convert honest-empty tables to populated: `austin-tx`, `bastrop-city-tx`, `liberty-hill-tx`, `lockhart-tx`, `taylor-tx`, `san-antonio-tx` — citation + provenance per district | check: each JSON has ≥1 district with front/side/rear; inventory doc updated | grade: [ ]
52. Bastrop city parcels with P-1…P-5 use `bastrop-city-tx` (or equivalent) table rows — not county `bastrop-tx` Public/Institutional | check: live `48021:47728` / `48021:33512` no longer `setback-table-pending`; districtNote references B3 place type | grade: [ ]
53. Rebake tier1 (and roads where useful) for counties touched by new tables; file before/after envelope status aggregates | check: bake logs + STATUS progress table | grade: [ ]
54. Progress tracker updated continuously in `_inbox/2026-07-21_property_explorer_v1_sprint_STATUS.md` until 51–53 met or only hard partnership holds remain | check: STATUS section | grade: [ ]

## Hard holds (only if source truly unreachable)

- eCode360 cities where no public PDF/Municode mirror exists after best-effort fetch — list in STATUS with URL attempted; do not invent numbers.
- Comal remains WDLL item 11 (no fabricated coverage).

## Amendments log

- 2026-07-23: items 51–54 — operator: no honest-empty; make tables; execute; track; no QA until done.
- 2026-07-23 (planning feedback): 51–53 graded met for **table population** only. Envelope confidence is a separate unfinished bar (Overpass remount + absent-zoning invent honesty). Stop hard-hold deepen until atomization. Atom family → hauska-engine (hold cortex). See `_decisions/2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups.md`.
