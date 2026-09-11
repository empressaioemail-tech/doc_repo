---
decision_id: 2026-09-11_ruling_b_reversed_polygon_only
date: 2026-09-11
owner: Nick (operator), recorded by the integration seat
status: active
supersedes: 2026-08-28_p91_o1_envelope_xray_must_refuse (geometry half only; the number half stands)
related_canonical:
  - _decisions/2026-08-28_p91_o1_envelope_xray_must_refuse
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
  - _decisions/2026-09-11_not_specified_semantics_and_no_approximation_state
  - 90_operations/OPS-23_surface_completion_program
---

## Decision

Ruling B (2026-08-28) is reversed for the drawing and kept for the number. The Property
Explorer map and the Smart Site MCP draw block both draw the modelled buildable envelope
polygon, from the same `place/buildable-envelope` call, carrying the disclosure that call
already returns, wherever a zoning district and a setback table exist for the parcel. The
buildable area figure and percent stay refused on every surface until a `buildable-envelope`
atom backs them, exactly as Ruling B and the OPS-21 no-approximation ruling require.

## Context

Ruling B made the X-ray and the panel refuse any envelope whose geometry came from live derive
and carried no envelope atom DID, so the two surfaces would agree with the MCP's refusal. Its
mechanism (`sheetEnvelopeIsAtomPathPending`, hauska-map commit `cca2964`) refuses the geometry
and the number together. The consequence, verified live 2026-09-11 on `48021:34049`: the
endpoint returns a real polygon on every inspect, the map throws it away, and the customer
promise "what you can build, drawn" is unmet on the web app while the site-plan PDF draws the
same inset from the engine's own adapter with no refuse rule. The operator: "we have setbacks
rendering on the site plan but not on the app interface."

## Structural commitment check

Sell reasoning, not data: the polygon carries the disclosure ("Estimated buildable area. Front
edge inferred from the situs-named street centerline. Not survey grade.") and the setback
citation; it is a cited claim about geometry, not a number pretending to be measured. Confidence
is earned: nothing here prints an unearned figure. Dual interface: both faces draw the same
polygon from the same call, which is the agreement Ruling B was protecting.

## Reasoning

Ruling B's stated reason was disagreement between surfaces, not the drawing itself. Its own
reversal criterion required the MCP to serve the same percent with the same provenance; a
polygon-only variant in which neither surface prints a percent was not considered. The
alternative, waiting for the envelope atom backfill, has five of nine program items not started
and 92.7 percent of Bastrop's existing envelope atoms already stale. A second mechanism that
would produce the same customer complaint is the entitlement gate in `ExplorerMap.handleEnvelope`
("Drawing is the X-ray"); it is real, it is separate, and it is left in place by this record.

## Reversal criteria

Reverse if the drawn polygon is shown to disagree with the engine's site-plan inset for the same
parcel by more than the setback tolerance on a parcel where both had the same setbacks, which
would mean the two implementations, not the two rulings, are the defect. Reverse also if a
customer relies on the drawing as survey grade despite the disclosure; then the disclosure, not
the drawing, is what gets rebuilt.

## Dependencies

OPS-23 P-153 implements it across the eleven files enumerated in the program's section 9. It
depends on P-151 for the shared resolver file. The entitlement gate is a separate product ruling
the operator owes and is not changed here.

## Counterparties

Internal. Studio X-ray, Smart Site web, and Smart Site MCP reviewers see the same polygon.
