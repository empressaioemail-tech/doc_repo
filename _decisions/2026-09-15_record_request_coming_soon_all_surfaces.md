---
id: 2026-09-15_record_request_coming_soon_all_surfaces
title: Record request goes coming-soon on all surfaces, disabled and labelled, with MCP tools listed and declaring
date: 2026-09-15
status: active
kind: decision
owner: nick
decided_by: operator
plan_row: P-242
supersedes: none
related: [90_operations/OPS-16_texas_market_plan_of_record, _inbox/2026-09-15_qa_reconciliation_since_reports_scope]
---

# Record request is coming-soon on all surfaces

## The decision

Operator ruling, 2026-09-15, on the scope fork P-242 left open.

1. **All surfaces.** The Property Explorer web app and the MCP connector both.
2. **Disabled and labelled**, not labelled alone.
3. **The MCP tools stay listed and return a declared coming-soon refusal.** They are not removed
   from the catalog.

## Why

The flow runs to completion and delivers nothing a customer can read. P-223 measured
`records_request_jobs` at 42 rows; the operator's own account owns two, both `status=needs-human`,
both completed, **both with zero artifacts**. That is a product that is not ready, not a UI that is
mislabelled, so the label belongs on every surface rather than only the one a person looks at.

Labelled-alone was never really available. `ReportsTool.tsx` line 1 already carries the standing
rule verbatim: **"Coming soon is not on the purchase surface."** A label that leaves the purchase
path live violates canon that already exists.

Web-only was the tempting half-measure and it fails on its own terms. The open disclosure defect
(a bad `artifactId` returning a raw Postgres error naming `records_request_artifacts` and its
columns) lives on the MCP path. Marking the web surface unready while leaving `request_records`,
`list_purchased_records` and `read_purchased_record` reachable changes the sign on the door without
changing the door.

**Point 3 is the part that is not obvious, and it follows this repo's own posture rather than the
reflex.** The reflex is to unregister a tool that does nothing. `LayersControl.tsx` already rules
the other way for the equivalent case, leaving a dead toggle operable because *"a toggle that turns
on nothing should say so ... the point is disclosure, not concealment."* An agent that calls a
listed tool and is told coming-soon has been given a fact. An agent that finds the tool absent
guesses, retries, or reports the capability as missing entirely. Listed-and-declaring is the honest
shape and it matches how this product treats every other unavailable thing.

## What this does not decide

It does not decide when record request returns, and it sets no date.

It does not close the disclosure defect or the untested tier gate. Those were never contingent on
this ruling and are already dispatched as P-242's first lane; **the error envelope gets fixed
regardless of who can reach it**, because a refusal that leaks schema is wrong even when the only
callers are internal.

It does not answer P-223's open product question about whether a `needs-human` job with zero
artifacts should be visible to the user who requested it. Coming-soon defers that question rather
than resolving it; it returns when the flow does.

## Reversal criteria

Reverse when the flow produces a readable artifact end to end for a real request. Concretely: a
`records_request_jobs` row reaching a terminal state with **at least one artifact the requester can
open**, demonstrated on a real parcel, not a fixture.

Reverse earlier and partially if the MCP path alone becomes deliverable while the web UX is still
unready. That is the one case where the surfaces legitimately diverge, and it is the mirror of the
argument rejected here: it would be justified by the flow working for agents, not by the flow being
unnoticed by people.

Revisit point 3 if a listed-but-declining tool measurably degrades agent behaviour, for example by
agents retrying it in a loop or presenting coming-soon to an end user as an error. Disclosure is the
default; it is not worth defending against evidence that it misleads.
