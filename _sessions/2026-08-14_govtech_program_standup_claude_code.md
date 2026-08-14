---
id: 2026-08-14_govtech_program_standup
title: Govtech stack program stand-up — OPS-17, the dev process, and Layer 0
date: 2026-08-14
type: session
owner: nick
memory_graded: pending
related: [90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/DEV_PROCESS, 90_runbooks/AGENT_CONTRACT, AGENTS.md, _catalog/repo_map, _catalog/repo_cleanup_backlog]
---

# Govtech stack program stand-up

The thread opened as Bastrop / ICC / plan review and became a program stand-up: a plan of record, a
written dev process, three audit lanes, and Layer 0 closed. Lane A is compiled and ready to dispatch.

## What was built

**`90_operations/OPS-17_govtech_stack_plan_of_record.md`** — four lanes (A Smart Files, B
SmartCity/Bastrop, C Plan Review, D ICC) by five layers (Foundation, Measurement, Integrity, Depth,
Launch), the OPS-16 ladder generalized. Rows `G-xx`. Twelve amendments A-000..A-012. Six shared legs no
lane may stub privately. A seam table defining what consumes and deposits into what.

**`90_runbooks/DEV_PROCESS.md`** — how work is shaped and judged, hash-versioned and compiled into
every dispatch alongside AGENT_CONTRACT. Built from the audit closes rather than first principles;
every rule traced to an incident.

**`AGENTS.md`** — cross-tool entry point, a router with no rules of its own. Plus a fourth Cursor rule
putting AGENT_CONTRACT and DEV_PROCESS in `alwaysApply` scope, which previously reached only compiled
dispatches.

**`_catalog/repo_map.md`** and **`_catalog/repo_cleanup_backlog.md`** — 41 of 41 directories classified,
25 backlog items.

## Rulings

- **A twin is a node; a node is an ID full of atom facts; the ID can be a human, a building, a desk.**
  Provenance and access control on the twin is the essence of the company.
- **Sensors are Asset Management Tier 2**, not a fifth lane. Doc 32's tiers and the sensor cold/warm/live
  ladder are the same architecture at two altitudes.
- **Smart Files is a BUILD** (A-002, falsifying an assumption the planner carried from doc 34) and a
  **NEW atom family** (A-012). Sequenced first; three seams depend on it.
- **Doc 34's claims stay as written and get built true** (A-003) — the register is not softened.
- **Owners assigned** (A-012): nick plus a planning agent on all four lanes and all six shared legs.
- Command Center gets authoritative docs (G-19). Cert View to backlog.

## Layer 0 lanes

**G0 program zero** — doc sweep, staleness instrument, code audit, memory review, dev standards. Its
code audit falsified the Smart Files assumption. Its dev-standards pass found two fail-open controls.

**G0-B cartography** — 41/41 directories mapped. Two hazards on nobody's brief: a root `.vercel` link
that would have published the entire private repo, and nine `status: active` Smart Site masters
entirely untracked, existing on one machine. Both closed.

**G-09 proving run** — three deliberately-shaped sub-agents against the rulebook. Verdict: **holds as a
behavioral control, failed as a schema.** Every behavioral rule that could fire, fired. The close schema
was shaped for a build lane in a code repo, so all three agents had to invent conventions to file a
doc_repo close. Fixed: AGENT_CONTRACT 6 gained `missionPremise`, `completionPredicate`, `scopeBasis`.

## Control defects — three, two planner-caused

**CTRL-1**: the compiler and the canon-gate hook were two implementations of one rule; teaching the
compiler about `G-` rows and not the hook meant every OPS-17 dispatch passed PLAN-ROW validation
unvalidated. Fixed structurally with `_catalog/plan_registry.json` plus a divergence test.

**CTRL-2**: `Work in P:/smartcity-os` passed open on the absolute-no-touch repo while three other
phrasings blocked.

**CTRL-3**: with CTRL-1 fixed, `G-9999` still passed — because the amendment DOCUMENTING the CTRL-1 bug
quoted `G-9999` in its prose, and both consumers matched a mention as a grant. Fail-opens stacked two
deep; the second was invisible until the first closed.

Also: three em dashes in `canon-gate.ps1` broke PowerShell 5.1's ANSI parse and **silently disabled the
entire hook**, caught only because negative tests existed.

## Corrections to the planner's own work

- DEV_PROCESS 1.1 cited "852 of 1,955 (43.6%)". **852 appears zero times in the source**; the G0 close
  reads "366/846", so 43.3%. The rule written to stop a number escaping its counting rule did exactly
  that with its own illustrative figure. Corrected here and in A-008.
- A-002 said the attachments table has 9 columns. It has **8**. Re-counted at source; the BUILD verdict
  is unaffected.
- Four contradicting rules resolved: `premortem-check` (retired 2026-07-13, still instructed in three
  places and still installed — skill removed), the nesting memory (scope-narrowed: it governs executors,
  not lane planners), "you do not dispatch external agents", and the planning-altitude rule.
- WDLL vs "acceptance card" reconciled to WDLL by usage: 293 files against 4.

## THE BROKERAGE ISSUE — captured for later revisit

**Operator asked this be recorded properly. Full record: `_catalog/repo_cleanup_backlog.md` item 25.**

The operator ruled the brokerage CONCEPT irrelevant — an early framing that did not survive. Verified
at source what the NAME still reaches in `legacy-design-tools` (counting rule: `git ls-files | grep -i
brokerage`, tracked files only, main):

- **126 tracked files** (72 non-test source, 54 tests)
- **8 database tables**: `brokerage_workspaces`, `brokerage_workspace_attachments`,
  `brokerage_workspace_shares`, `brokerage_brief_runs`, `brokerage_install_claims`,
  `brokerage_user_profiles`, `brokerage_wallets`, `brokerage_wallet_ledger`
- **54 NON-brokerage files import brokerage modules**, including `app.ts`, `index.ts`, the atom
  registry, `spineZoningDistrict.ts`, `encumbranceService.ts`, `cadPropertyLookup.ts`

**The name is dead; the code under it is the property reasoning substrate.** It covers federal and
composite GIS layer ingestion, parcel keying, brief generation and its atoms, **metering (the ICC money
path)**, entitlement, and provenance envelopes. None of that is about real-estate agents.

`brokerage_workspaces` holds **142 live rows**: dead concept, live data.

**Two known live items sit inside that surface and should be resolved WITH the rename, not separately:**
the **0.74 motivated-seller fixture** in `brokerageGisCompositeLayers.ts` (`_STATE.md` Q13 — the honesty
work written to retire it was reviewed clean and never merged, so the synthetic value still serves), and
**`brokerage_install_claims`**, which the Radar entitlement ruling says must become user-aware rather
than install-keyed.

**Disposition:** backlog item 25, P1, LARGE, its own focused lane sequenced after lane A ships.
Explicitly NOT part of lane A — the schema cannot carry Smart Files regardless, so extending means
rebuilding anyway, and an in-place rename across 54 dependents would compete with lane A's real work.
Table renames need migrations plus a compatibility window; module renames are mechanical but must land
atomically with DEV_PROCESS 2.4 divergence discipline. Name should be ruled by the catalog-thesis check
first, drawn from Smart Site's property-substrate vocabulary.

## Open

- Lane A dispatch compiled at `_dispatches/2026-08-14_a_dispatch.md`, not yet hand-carried.
- Lanes B, C, D not dispatched. Lane C carries a dead Cotality dependency (G-16); lane D carries a live
  ICC accessPolicy license exposure (G-30, verified present on engine main).
- OR-2 (40i and 11a disposition) and OR-4 (ADR status vocabulary) still owed.
- Backlog row 22 fails open — names the wrong file for the band table.
- Twelve G-09 proposed diffs PD-1..PD-12; six applied, the rest carried.
- Two in-repo clones untouched by operator ruling: `hauska-mcp-server/` and `tmpbrief-l3-spine-consume/`.
