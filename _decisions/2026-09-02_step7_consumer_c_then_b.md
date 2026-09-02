---
decision_id: 2026-09-02_step7_consumer_c_then_b
date: 2026-09-02
owner: Nick
status: active
related_canonical:
  - _inbox/2026-09-02_step7_consumer_scoping.md
  - _inbox/2026-09-02_parcel_program_review.md
  - _decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md
---

## Decision

The parcel record gets its consumer as C then B: the two GTM-live report generators
(X-ray, Flood and Drainage) read parcel_record directly and immediately; behind that,
the serve layer gains one parcel-record reader with a rail-scoped allowlist, and slate
1 (cityLimits/jurisdiction, flood zone + floodway, wells, specialDistricts,
valueHistory) cuts over rail by rail, each cutover carrying its old-path retirement in
the same card. The publish gate goes live as a scheduled, rail-scoped evaluation whose
REFUSE verdicts the allowlist consumes visibly. Dollar rails enter no slate until
PARCEL-S6-COLLISION closes — a hard requirement. Option A (full repoint) remains the
destination after slates prove out.

## Context

The step-5 review found the record had zero consumers and the gate was dormant; the
scoping packet priced three options and the operator ruled "c and b" in-session
2026-09-02. Option A first was rejected because it maximizes time-to-first-consumer,
the exact defect the review named.

## Structural commitment check

Sell reasoning, not data: strengthened — the C reports ship the reconciled flood rule
with citations and floodway detail. Confidence earned: the gate's verdicts become live
controls with a consumer, not dormant code. Cost per jurisdiction: no acquisition in
this decision. MCP-first: unaffected; the record serves existing surfaces.

## Reasoning

C creates a real consumer inside one card with zero risk to the current serve path,
and exercises the record end to end on the two reports GTM actually markets. B makes
the gate live the only honest way — with a consumer for REFUSE (a refused rail-county
keeps its old path, visibly) — and the per-rail cutover with same-card retirement is
the ENFORCEMENT retirement rule applied as designed. Reports read per-parcel (cheap);
only the gate scheduler reads county-wide, and the cell-ledger close's measured loader
cost (101.5s smallest county) forces it to stream per rail rather than materialize.
Gate wiring default: an engine CLI entrypoint the Factory job shells out to, matching
the existing job pattern.

## Reversal criteria

If slate-1 cutovers surface serve-quality regressions the gate did not catch, pause B
at the current slate and fix the gate's predicate before the next rail — never widen
the allowlist past a failing verdict. If the C reports cannot render honest absence
without product harm, that is a product finding for GTM, not a reason to fabricate.

## Dependencies

Depends on: the filled record, the live-verified gate loader (cell-ledger close), S6
for any dollar rail. Feeds: option A, the retirement of the legacy per-rail serve
paths, and the second-state template.

## Counterparties

Internal: property seat implements; GTM consumes the C reports; the operator rules on
slate 2.
