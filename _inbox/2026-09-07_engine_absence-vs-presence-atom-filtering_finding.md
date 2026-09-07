---
id: 2026-09-07_engine_absence-vs-presence-atom-filtering_finding
title: composeFeasibilityModel read entityType alone as presence, fabricating facts from honest-absence atoms — fixed for four atom families, unaudited elsewhere
date: 2026-09-07
status: finding
owner: cente-67 (hauska-engine lane), filed by doc_repo planner (Reports + Courthouse Program, OPS-16 P-120)
plan_row: P-120, item 14
related:
  - _inbox/2026-09-07_reports_courthouse_program_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Absence-vs-presence atom filtering: a real fabrication bug, not a thinness complaint

## What was found

`composeFeasibilityModel` (hauska-engine, `packages/engine-core/src/site-plan/feasibility-model.ts`)
filtered candidate facts by `entityType` alone — e.g. `atoms.filter(a => a.entityType ===
"well-fact")` — without checking the atom's own `absence` field. Several atom families
persist an honest "checked, found nothing" row as a real, typed atom rather than omitting
a row entirely (correct behavior per `ADR-031`/the parcel-record-ledger discipline and the
"every record starts with its full shape" doctrine). Filtering on `entityType` alone reads
that honest-absence atom as a present fact.

**Concrete instance:** a well-fact atom recording "no well found on this parcel" was
displayed on a live Feasibility Study PDF as "Well 1: on file" — the exact opposite of
what the record says. This was raised in this program's QA pass as "well-record depth —
worth checking whether there's more detail," a data-thinness framing. It is not thinness.
It is a fabricated presence claim from an atom whose entire content is "this was checked
and nothing exists."

## Scope of the fix

Confirmed present in **four** atom families, not just wells: `well-fact`,
`special-district-fact`, `rrc-pipeline-fact`, `building-footprint`. Fixed for all four in
hauska-engine PR #398 (merged to main, squash), each with a regression test asserting an
absence-flagged atom of that type renders as an honest UNAVAILABLE state, never a
fabricated presence row.

## What is NOT yet known — the open question this finding exists to raise

`composeFeasibilityModel` was the consumer found and fixed because this program's QA pass
happened to be looking at Feasibility PDFs. **No audit has been done of other consumers of
these same four atom types** (or others with the same absence-vs-presence union shape)
elsewhere in the portfolio — PE's own fact rendering, the MCP-exposed atom chain, dashboards,
any other report or brief assembler. The failure mode (filter by type, ignore the
`absence`/decline discriminant) is exactly the class of bug that tends to be copy-pasted
across independent implementations of "read this atom family" — this program has already
found that pattern twice this week in the buildable-envelope vocabulary (three to five
independent copies, per the boundary-envelope atom program's own findings).

**Recommendation, not yet actioned:** a grep for `entityType ===` (or equivalent) filtering
on these four atom types — and ideally on every atom family carrying an `absence` variant —
across consumer repos, to check whether the same mistake exists elsewhere before assuming
this is contained to the one file that happened to get looked at.

## Reasoning

Filed because this is a correctness defect with real customer-facing consequences (a
customer reading "well on file" when none exists is materially misled, not just given a
thin report), it spans a failure class rather than one file, and the fix in one PR
description is not durable or discoverable the way a canonical finding is. Matches
ENFORCEMENT.md's standing rule: absent, zero, and unmeasured are three different states,
never collapse them — this bug was exactly that collapse, in the read path rather than the
write path.

## Status

Fixed for the four confirmed instances (hauska-engine PR #398, merged).

**hauska-engine itself checked, clean** (2026-09-07, cente-67): a bounded grep across
`hauska-engine` for both the literal `entityType === "well-fact"`-style comparison and a
broader string-literal search across all four atom types found no other live consumer
repeating the mistake. One consumer (`packages/storage/src/geom-bbox-index.ts`'s
building-footprint bbox indexer) is incidentally correct by construction — an absence atom
carries no `footprintGeometry` field, so it's naturally excluded without an explicit check.
Positive signal: `packages/retrieval/src/rail-scoring-spec/specs.ts` already documents the
absence discriminant correctly and explicitly for well-fact, so this looks like a genuine
one-off gap in newer code rather than a repeated institutional blind spot.

**Not checked, flagged as a real gap:** whether `rail-served.ts`'s actual executable
filtering logic (as opposed to the spec-level documentation confirmed correct above) gets
this right in practice — different surface (retrieval/statewide-audit), out of scope for
the lane that found this. Also not checked: `hauska-mcp-server` and `legacy-design-tools`,
different repos/seats, not chased into. The broader-portfolio audit remains open and
unassigned; this note narrows it rather than closes it.
