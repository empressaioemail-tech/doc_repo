---
id: 2026-08-05_T3_adr028_publish_gate_verdict
title: ADR-028 publish gate verdict — npm publish HELD for 1.12.0
date: 2026-08-05
status: active
owner: nick
related: [2026-08-05_adr029_rails_rulings, adr_028_contract_cross_vertical_adoption, adr_029_building_footprint_and_utility_easement_rails]
---

# ADR-028 publish gate verdict

Master planner ruling sequenced ADR-029 contract bump **after ADR-028 fields land**. Before npm-publishing `@empressaio/atom-contract@1.12.0`, planner verified live npm lineage + repo changelog.

## Live npm (verified 2026-08-05)

| Field | Value |
|---|---|
| Latest published | **1.11.0** |
| Published versions | 1.8.0, 1.9.0, 1.10.0, 1.11.0 |

## ADR-028 six field groups — in published lineage?

ADR-028 (`80_adrs/adr_028_contract_cross_vertical_adoption.md`, status **proposed**) specifies ONE additive release carrying:

| # | Field group | In npm 1.8.0–1.11.0? | Evidence |
|---|---|---|---|
| 1 | `license` block (redistribute, display, derivedOk, …) | **NO** | No per-atom license schema in package src |
| 2 | Verified absence (`evaluated` + `provenanceScope[]`) at atom level | **NO** (global) | ADR-029 adds `SITE_LAYER_VERIFIED_ABSENCE_SCHEMA` locally only on site-layer kinds |
| 3 | Bitemporal (`validTo`, `knowledgeTime`) | **NO** | grep: zero matches in src |
| 4 | Typed outcome family | **NO** | no outcome*.ts |
| 5 | Instance-level `inputAtoms: AtomRef[]` | **NO** | reasoning-chain has `inputAtomRefs` on derived chains only — not ADR-028 instance lineage |
| 6 | PII flags (`containsPii`, `erasable`) | **NO** | grep: zero matches |

## Version numbering collision (important)

Published **1.8.0** (2026-07-23) is **NOT** ADR-028 adoption. Changelog describes reasoning-chain primitive, actor-record, license **obligation types** — a different release than ADR-028's cross-vertical per-atom field groups.

Subsequent minors (1.9.0 property kinds, 1.10.0 parcel-terrain, 1.11.0 road-node) also do **not** carry ADR-028.

## Verdict

**npm publish of 1.12.0 is HELD.**

ADR-028 cross-vertical field groups are **not** in the published lineage. Merging PR #11 (ADR-029 types on main) is authorized; **npm publish waits** until either:

1. ADR-028 fields ship in a dedicated minor (likely needs version renumbering discussion — 1.8.0 slot already consumed), **then** ADR-029 publishes; or
2. Master planner issues fresh ruling per decision record reversal criteria: "if ADR-028 sequencing stalls… bump may proceed as 1.9.0 without ADR-028 fields on a fresh master ruling."

## Interim engineering path

- Engine pins **local/file** `@empressaio/atom-contract@1.12.0` from merged main or path dependency until npm publish clears.
- Pilot apply at slot release uses local contract pin; publish is not blocking code merge.
