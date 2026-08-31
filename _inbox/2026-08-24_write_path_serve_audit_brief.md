---
id: 2026-08-24_write_path_serve_audit_brief
title: Write-path serve audit — inspect + envelope + viewport layers
status: dispatched
date: 2026-08-24
plan_row: P-58
owner: audit agent (read-only); planner commits
---

# Write-path serve audit

Not another "is serving ok?" pass. Agents keep measuring store presence and HTTP 200. Operator visual 2026-08-24 proves that is not customer-done.

## Snapshot to declare

doc_repo `main` @ `476cca2`. PE live `smartsite.cloud` hauska-map `5dda5cb` (#203). Cortex `cortex-api-00569-maw` @100% (LDT `1fd6233d`). Property STATE last written 2026-08-23T18:35Z is stale vs later P-60 deploys. Read `_scratch/setback-serve-wave.md` first.

## Scope

Inspect card fields + buildable-envelope POST + viewport layers that paint on a click.

Parcels (minimum):

| Parcel | Why |
| --- | --- |
| `48021:34137` | gold Bastrop |
| `48021:34073` | Jefferson recovered envelope |
| `48021:35772` | Wainee; honest not-stamped setbacks |
| `48453:280239` | Simsbrook; wedge works |
| `48453:280210` | Dashwood; card scalars, wedge miss |
| one Pflugerville neighbor of Simsbrook | "setbacks everywhere" fail |

## What done looks like

A file-based instrument plus a matrix. For each field on each parcel: store row, atom, BFF facet, live derive, what the card rendered, what the map painted. The instrument fails when a field is store-present and card-absent, or atom-present and envelope-404.

Code reading outranks a 200. Read the write path (`envelopeRequestBody`, facets BFF, cortex place/buildable-envelope, live-gis overlays) before trusting a probe.

## Do not

- Start a new statewide harvest
- Write product code
- Commit
- Collapse absent / zero / unmeasured
- Quote CLAUDE.md corpus counts as live

## Output

`_inbox/2026-08-24_write_path_serve_audit.md` plus any instrument under `_scratch/` that self-tests both directions.

Cite P-58 (code-read matrix) and Lane 3 field-mapping (feasibility A3). This is the serve half of that mapping pass.
