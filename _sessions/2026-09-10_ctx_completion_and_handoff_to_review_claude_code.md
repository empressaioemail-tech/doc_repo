---
id: 2026-09-10_ctx_completion_and_handoff_to_review
title: Session close — CTX completion arc, and the program handed to the review agent
date: 2026-09-10
last_updated: 2026-09-10
status: closed; program handed off, NOT complete
owner: nick
agent: claude_code (integration seat, doc_repo)
seat: integration
plan_rows: [P-124, P-120]
snapshot: doc_repo main e924cb5c. hauska-factory main 52c1b782. legacy-design-tools main 9873ff11. Live figures were read by field; lane figures are attributed.
related:
  - _inbox/2026-09-10_ctx_third_party_review.md
  - _decisions/2026-09-10_ctx_provenance_is_a_label_and_three_holds.md
  - _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md
  - _inbox/2026-09-09_ctx_scalability_retrospective_PICKUP.md
---

# Session close

Opened as a strategic conversation about whether the CTX process is scalable. Became the
execution session that took it as far as this seat could take it. Closes with the program
handed to the third-party review agent, at the operator's instruction, because that agent
reasoned better about the system than this seat did.

## The finding that matters most, and this seat did not find it

**The instrument that declares a county done guarantees a new defect class behind every
cleared one.**

The verify walk grades roughly 180 sampled parcels per county by one HTTP read each. It
short-circuits: a non-ok response fails the first rule and nothing behind it is graded. Its
list of required leaves is grown **by hand**, one leaf per lane. The divergence test between
the walk's list and the bake's list **skips in CI** for want of an LDT checkout.

So a leaf not yet on the list is invisible until someone adds it, a 422 hides every leaf
behind it, and 180 sampled parcels could never see 291,231 null acreage cells — which one
SQL over the store could have counted at any time since 2026-08-30.

The operator asked repeatedly how many passes this would take. The answer is that under this
instrument the number is unbounded, and no further fix ends it. A full-store census does.
This seat spent the day treating the pass count as its own analytical failure. It was
substantially an instrument that produces serial discovery by construction.

## What a customer is actually served, measured for the first time

Every prior customer read in this program was at free tier, where all four dollar fields are
gated. The review read the production connector at **paid depth**.

A paying customer opening a McLennan parcel is served present market, land and improvement
dollars labelled `source: cad_property` and `valueBasis: county-assessed` — byte-identical in
label to a Caldwell value that came from the appraisal district's own export. 311 Austin Ave,
Waco returns $6,506,490 presented as county-assessed. The StratMap origin appears only on
structural and owner facts, never on the value. The mechanism is two string constants; the
tier is loaded from `source_vintage` and dropped at one seam.

Two further customer-visible defects, both live: Travis serves a systematic **tenfold gap**
between its 2025 StratMap row and its 2026 CAD row on four of five parcels read, both present
with the same label. And Hays serves one parcel's label and acreage under another parcel's
address, on a payload that holds owner and land use back with "TxGIO prop_id does not join the
CAD account" while serving the four money rails joined on that same id.

The plural search surface refuses for all six counties because its index has no writer
anywhere.

## What was accomplished

Six defect classes found, named, measured and in five cases given a control: punctuation-only
situs (18,037 rows), a ceiling measured by one instrument and enforced by another, 67 parcels
that could reach no state at all, a missed earned-absence sibling (291,231 cells), a ruling
filed 2026-09-01 and never implemented because the type could not express the state it
required, and 0.8m of digitisation mismatch between two independently surveyed layers.

Production writes, all verified by field: 5,118 zoning cells with every predicted count exact
and the per-parcel gate holding; 244,669 impervious refusals with a cited ordinance basis;
school-district applied to three counties, 13 cells written as `value`.

McLennan passed a staging walk 182 of 182 — real, and the review established exactly what it
proves and what it does not.

Twenty-nine lanes compiled. Merges: `hauska-factory` #117 to #126, `legacy-design-tools` #647
to #649, `hauska-engine` #414 and #415.

## Four operator rulings, 2026-09-10

Filed at `_decisions/2026-09-10_ctx_provenance_is_a_label_and_three_holds.md`, recorded as
OPS-16 amendment **A-121**.

A1 provenance is a label, not an absence; the non-account absence state is rejected. A2 Hays
held. A3 Caldwell held. A4 the target restated as **Z7: tier-1 conformant serving on
production for the counties that clear, provenance-honest, content-walked, census-clean,
customer-probed**, with Z8 and the geometry waves staying in the row with owners rather than
claimed.

The operator added one thing the review did not: labelling is necessary and may not be
sufficient, because an honestly labelled figure that is wrong by an order of magnitude is
still wrong. The Travis tenfold gap is a separate, unowned blocker.

## This seat's error record

Kept because it is why the handoff is happening.

Seven wrong data-shape assumptions, each caught only by an error rather than by reading:
the wrong Dockerfile; a premature all-clear on an image that then existed; a Cloud Run
argument set that silently dropped `--gold`; `place_key` assumed as `node:<fips>:<prop_id>`
when `parcel_record_cell` uses `<fips>:<prop_id>`; `runs.created_at` which is `started_at`;
a gate verdict read mid-write and nearly reported as a partial failure; the same verdict
trusted as live when it is cached.

Four wrong dispatch premises, each corrected by the lane it was sent to. The worst: telling
CTX-HAYS-GATE that the geometry-only population "structurally cannot" cause the cadRoll
refusal, when 99.0 percent of it does.

Two wrong predictions. One job assigned to this seat at 09:00 and forgotten until 23:00.

The pattern is exact and worth carrying forward: **every dispatch where this seat asserted a
conclusion got corrected; every dispatch that named competing mechanisms and forbade picking
the first came back stronger than asked.** Conclusions do not belong in a lane's premise.

## State at close

    doc_repo             e924cb5c
    hauska-factory       52c1b782
    legacy-design-tools  9873ff11

    IN FLIGHT, hand-carried, not yet returned
      CTX-B1  legacy-design-tools  provenance-honest cadRoll, four paths + A3 situs half
      CTX-B2  hauska-factory       cadRoll vintage scope, tracer blind spot, pin
      CTX-B3  hauska-factory       the full-store census

    HELD BY RULING
      Hays      A2
      Caldwell  A3
      McLennan  operator hold pending the provenance fix; passes staging 182/182

    NOT DEPLOYED
      cortex-api      three pull requests behind main
      publish image   one pin behind
      engine-api      fact-families fix built, undeployed
      smartsite-mcp   four behind

    No production publish has run since 2026-09-08.

## Handed off

The program goes to the review agent with the operator's instruction that it reason and work
it through to the end. Its own Stage A to E sequence, with pre-registered falsifiers per step
and an eleven-item leave-behind, is at `_inbox/2026-09-10_ctx_third_party_review.md` sections
8 and 10. That document, not this one, is the plan.

The scalability retrospective remains parked at
`_inbox/2026-09-09_ctx_scalability_retrospective_PICKUP.md` behind an instrument-readable
trigger. Nothing in this session unparks it, and the census instrument is likely to be its
first concrete artifact when it does open.
