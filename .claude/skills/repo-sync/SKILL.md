---
name: repo-sync
description: "Produce a markdown document formatted to drop into the canonical doc set. Use this skill when producing a canonical doc that needs frontmatter, naming, and structure correct per the doc conventions. Especially useful when scaffolding a new ADR. Trigger on phrases like 'make this a canonical doc', 'draft this as an ADR', 'file this in the doc set', 'sync this to the repo'."
---

# Repo Sync

Formats a strategic output as a canonical doc per the conventions in `01_doc_conventions.md`. Primarily a reference for ADR scaffolding and band conventions, since canonical doc production is the default mode for Claude Code in this repo.

## When this triggers

When producing a new canonical doc (especially an ADR) and you want to verify frontmatter, naming, and section conventions match the existing doc set.

## What this checks

### Frontmatter

```
---
id: NN_short_slug                    # matches filename without .md
title: [Full descriptive title]
status: draft | active | superseded | historical
last_updated: YYYY-MM-DD
applies_to: portfolio | smartcity-os | design-accelerator | revit-connector | hauska-sdk | eci | docs
related: [list of related canonical doc ids]   # optional
supersedes: <id>                                # optional
superseded_by: <id>                             # optional
owner: nick | planner                           # optional
---
```

### Band conventions (verify in `00_README.md` if uncertain)

- 00 band: README, current state, doc conventions
- 10 band: ground truth, roadmap, risk register, pricing, stakeholder graph, leading indicators
- 20 band: agent operating rules, AI-first dev flow, workstation, dev setup, atom reference and upgrade
- 27, 28: engine evolution, MCP-first product design
- 30 band: SmartCity OS, sprints
- 40 band: Design Accelerator, Cortex, Revit Connector, Codex (47 plan review, 48 program plan), parcel intelligence (46)
- 49, 50, 51: code ingestion pipeline, Hauska MCP Server, substrate v1 sprint
- 60 band: ECI atomization
- 70 band: bizops (proposed, not yet created)
- 80_adrs/: ADR files, named `adr_NNN_short_slug.md`
- 90_runbooks/: operational runbooks
- 91_postmortems/: incident postmortems
- `_sessions/`: session summaries
- `_decisions/`: decision log records

When creating a new doc, pick the appropriate band and the next available number. ADR numbering continues sequentially; for the current ADR list and next free slots, list `80_adrs/` directly rather than relying on this skill (which would rot). Band table is in [`00_README.md`](../../../00_README.md).

## ADR format

```
---
id: adr_NNN_short_slug
title: "ADR-NNN — [short title]"
status: proposed | accepted | superseded
last_updated: YYYY-MM-DD
applies_to: portfolio
related: [list]
owner: nick
---

# ADR-NNN — [Title]

## Status

[Proposed | Accepted | etc.] with date and session origin.

## Context

What problem are we solving and why now.

## Decision

What we are doing. Concrete and specific.

## Alternatives considered

What we considered and why we did not choose them.

## Consequences

Positive, negative, neutral. Costs we are accepting.

## Open decisions

Items deferred for implementation. Distinguishes architectural commitment from mechanism choice.

## Reversal criteria

Conditions under which this ADR would be revisited.

## References

Related ADRs, canonical docs, session origin.

## Revision history

- **YYYY-MM-DD (origin):** [summary]
```

## Conventions

- No em dashes or en dashes
- Reference other canonical docs by their id and title or file path
- Lowercase snake_case filenames
- Date format YYYY-MM-DD
- The structural commitments and decision rules from CLAUDE.md apply to the doc itself, not just the content; a doc that violates them should be revised before filing

## What this skill does not do

Does not file the document automatically. The operator reviews via plan mode before commit.

Does not invent canonical conventions not observed in the existing doc set. If unsure, read the most recent doc at the relevant band before producing.

End of skill.
