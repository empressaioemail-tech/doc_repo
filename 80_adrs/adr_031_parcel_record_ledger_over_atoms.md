---
id: adr_031_parcel_record_ledger_over_atoms
title: "ADR-031 — The parcel record and the atom estate: ledger over claims"
status: accepted
last_updated: 2026-09-11
applies_to: portfolio
related: [adr_018_atom_contract_substrate_layer, adr_028_contract_cross_vertical_adoption, 19_the_instrument_contract, 28_mcp_first_product_design]
owner: nick
---

# ADR-031 — The parcel record and the atom estate: ledger over claims

## Status

Accepted 2026-09-03. Ratified by the operator in the 2026-09-01/02 parcel-record
planner session, in the conversation that produced
`_decisions/2026-09-02_step7_consumer_c_then_b.md`. The operator's framing that this
ADR canonizes: the record was intended as a tracking database, it became part of the
product, and the relationship between the two layers must be doctrine rather than
archaeology.

## Context

The parcel-record program built `parcel_record` and its cell and companion tables as
an accountability ledger: 981,405 parcels by 65 rails, every cell in exactly one
accounted state (`value`, `absent-verified`, `not-applicable`, `refused`,
`unaccounted`). It was created to kill the missing-column defect class, in which a
fact family nobody built is invisible and every gap analysis is structurally unable
to find the largest gaps.

Two things then happened that this ADR must reconcile with the atom canon. First,
the ledger's read side was promoted into the product: under the c-then-b decision the
report generators and, per rail behind a live publish gate, the main serve path read
record cells. The ledger became a serve source. Second, the six-county fills read
`cad_property` and the landings directly, bypassing the roll atoms, because those
atoms were measured hollow in three counties and fabricating in a fourth. Some record
cells therefore carry source provenance with no atom underneath, a deliberate
expedient that diverges from the model law's source to atom to serve flow.

The operator's own precedent names the organizing principle: a decentralized asset
layer was illegible until a centralized market organized it. Atoms are the
decentralized claims. The record is the centralized accounting.

## Decision

**1. Two layers, one doctrine.** The atom estate remains the claims and evidence
substrate and the commercial catalog: typed, access-controlled, sold through the
Hauska MCP server. The parcel record is the accountability and distribution layer:
the closed grid that knows what should exist, what has been looked at, and what may
serve. Atoms answer what we know. The record answers what we have accounted for.
Only the second is gateable, and serving reads only gated cells.

**2. The ledger is permanent, including after full atomization.** Atoms are an open
set; even absence-atoms (the ADR-028 verified-absence pair) cannot force an absence
claim to exist for every parcel and rail, so absence-of-an-atom is still not a
state. The record's closed grid is the denominator the publish gate evaluates. Once
every fact flows through atoms, record cells thin to state plus atom reference plus
provenance, and the grid remains.

**3. Expansion runs ledger-first, atoms-first.** For every new county or state: day
one instantiates the full grid, all rails honestly unaccounted, before any data
moves. Every subsequent fill runs source to conformant atom to cell citing the atom
(the F-16/F-18 conformant writer machinery exists for exactly this). The CTX
source-direct shortcut is prohibited in expansion territory.

**4. The CTX seam is documented and repairable, not repaired now.** The six-county
CAD-rail cells that cite sources directly are legitimate as shipped: their
provenance is complete, and atoms can later be minted underneath them and citations
repointed without changing any cell value. A named backfill card closes the seam on
our schedule. Until it closes, the divergence it creates between the app surface and
the atom catalog is a known, bounded debt.

**5. What the MCP server needs to map the record correctly.** (a) The closed rail
registry with per-rail access pairs as catalog metadata. (b) Consumption through the
same serve-layer reader the apps use, never raw store access, so the honesty
translation cannot fork between browser and agent. (c) The five states expressed in
tool schemas, with `absent-verified` returned as a first-class answer carrying its
basis. (d) Access pairs enforced at call time. (e) A stable identity crosswalk
between `place_key` and catalog `entity_id` ranges.

## Amendment 2026-09-11 — the end state becomes the program

Operator ruling 2026-09-11, `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`.
Decisions 1 through 5 stand. What changes is that Decision 2's end state ("record cells
thin to state plus atom reference plus provenance, and the grid remains") stops being a
destination and becomes the plan of record, and Decision 4's bounded debt stops being
tolerated and gets a backfill row.

**A1. Atoms are canonical; a cell is accounting, never a copy.** In Doc 19's terms: a node
carries no facts; an atom is one claim from one authority at one time; an edge is an atom
whose value is a node. A cell holds the state, the atom reference, provenance, and a
**cached rendering** keyed to the atom version and the vocabulary version (ruled 2026-09-11;
not a second source of truth, because a rendering cannot be served stale without its key
mismatching). A cell that holds a value with no atom behind it is the seam this amendment
retires.

**A2. One reader, in the substrate.** Decision 5(b) made concrete: the reader that walks
gated cells and dereferences atoms lives in the Hauska retrieval service
(`hauska-engine/services/retrieval-api`, which today reads the substrate and cortex stores
and gains a read-only factory role), below both cortex and the Hauska MCP server. Cortex,
smartsite-mcp, the engine reports, Property Explorer and the Hauska MCP tools consume it.
An unslated rail refuses with its cell state; it does not fall to a legacy path, and each
cutover carries the retirement of the path it replaces.

**A3. One writer discipline.** The conformant writer (Decision 3's F-16/F-18 machinery)
mints the atom, sets the cell pointer and writes the rendering in one transaction. Every
factory cell job routes through it. Every engine writer is reachable by the runner.

**A4. One vocabulary.** The human face of an atom is one versioned module both writer and
reader import, shipped as a subpath of the atom-contract package.

**A5. The seven steps** (rows in OPS-23 and OPS-16 A-129): nodes and the crosswalk as a
contract type; the rail-to-atom map for all 65 rails; the one writer; the backfill that
mints atoms from existing gated cells with values unchanged (Decision 4's own repair, now
scheduled, for every rail rather than one family); the one reader with the refuse default
and retirement; edges as first-class atoms; succession. The boundary/envelope atom program
opened 2026-09-06 folds into steps 4 and 7. The L4 divergence tripwire stays owed until no
gated cell holds a value without an atom, and is then retired as unnecessary.

**Reconsidered and rejected again.** Cells as canonical with atoms projected from them was
weighed on 2026-09-11 because it makes divergence impossible by construction and is
cheaper this quarter. Rejected: it inverts the thesis (the catalog becomes a view of a
product table) and forces edges, supersession and calibration to be re-invented on cells.
The projection survives only as the mechanism of step 4.

## Alternatives considered

**Record-first, atoms only where evidence demands.** Cheapest continuation of the
CTX expedient. Rejected: the catalog and the product would permanently diverge, and
the Hauska thesis requires that the catalog is the product.

**Atoms-only, absence expressed as absence-atoms, no ledger.** Rejected on
structure: an open set cannot self-account. Nothing forces an absence claim per
parcel and rail, so the missing-column defect returns wearing atom clothing.

**Full repoint before any consumer.** Rejected by the c-then-b decision: it
maximizes time-to-first-consumer, the exact defect the step-5 review named.

## Consequences

Positive: honest absence becomes a durable, provenanced, sellable answer; one serve
translation feeds two faces per the dual-interface principle; the publish gate is a
real control with a consumer for its refusals; expansion territory has a build order
with a reason.

Negative: two shapes to maintain until cells thin to pointers; the CTX backfill is
real deferred work; the cell grid is large (roughly 64M rows for six counties) and
grows with every rail and county by construction.

Neutral: rails migrate to record-served individually behind gate verdicts, so the
atom-served and record-served paths coexist for as long as the slates take.

## Open decisions

**Closed 2026-09-11 by the amendment above:** the CTX atom-backfill card timing and scope
(step 4, all rails); formalizing the place_key to entity_id crosswalk as a contract type
(step 1). **Still open:** the policy for minting verified-absence atoms under
absent-verified cells versus leaving absence ledger-only (the ADR-028 verified-absence pair
exists; whether step 4 mints them is a ruling owed before step 4 runs on absence cells).
Growth of the gate verdict store into the catalog surface.

**Named scope item for that card (2026-09-05):** the F-01 item 5 queue-claim mechanism
(Postgres-native `claims` table, transactional claim-and-verify) is wired into
`hauska-factory`'s `parcel-record-fill.mjs` only. Four other call sites still rely
solely on the old `leases` table's random-token exclusion, which has no relationship
to a Cloud Run execution's real identity: `conformant.mjs`, `f10-cad-loop.mjs`,
`p2-juris.mjs`, `restamp-access.mjs`. Operator ruling 2026-09-05: does not affect
current functionality, not urgent standalone, but must be scoped and closed together
with the CTX atom-backfill card rather than left to drift — noted here specifically
so it is not overlooked when that card opens.

**The CTX atom-backfill card is now open, narrowly (2026-09-06).** A pilot
(`_inbox/2026-09-06_ctx-wrapup-engine_boundary-envelope-pilot_close.json`) scoped it
to exactly one rail-family — `property-boundary-edge`/`buildable-envelope` — as its
own program, not a statewide or all-rail atomization pass
(`_decisions/2026-09-06_boundary_envelope_atom_program_scope.md`). Operator's own
call, deliberate: get one rail-family fully working — including a real parcel
succession/refresh mechanism and a shared reader across both consuming apps, neither
of which exist today — before generalizing, since both are reusable infrastructure
that makes every later rail-family cheaper. **The remaining ~63 rails' atomization
is explicitly NOT scoped by this card and stays a separate, future decision** —
this note exists so a future reader does not assume boundary/envelope's program
implies the rest is coming next by default, or forget that the question is still
open. Open sub-question for whichever card picks up the next rail-family: does the
succession/refresh mechanism and the shared-reader principle generalize unchanged,
or does each rail-family need its own version of both.

## Reversal criteria

If maintaining the grid at multi-state scale proves untenable (measured, not
assumed), revisit the cell-per-rail representation, never the accountability
requirement. If the serve layer's record reads are ever observed diverging from the
atom catalog for a fact both carry, the backfill stops being deferrable and becomes
the next card. If a second state demonstrates the conformant atoms-first flow cannot
meet the cost-per-jurisdiction commitment, narrow the rail set per the parent
ruling rather than reopening the source-direct shortcut.

## References

`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`,
`_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`,
`_decisions/2026-09-01_parcel_record_rails_v2_template.md`,
`_decisions/2026-09-02_step7_consumer_c_then_b.md`,
`_inbox/2026-09-01_parcel_gap_ledger.md`,
`_inbox/2026-09-02_parcel_program_review.md`, `19_the_instrument_contract.md`,
ADR-018, ADR-028. Session origin: the 2026-09-01/02 parcel-record planner session.

## Revision history

- **2026-09-03 (parcel-record planner session):** Initial acceptance.
- **2026-09-06 (integration seat):** Recorded the CTX atom-backfill card's opening,
  narrowly scoped to `property-boundary-edge`/`buildable-envelope` per the
  2026-09-05/06 pilot; explicitly noted the remaining rails stay a separate,
  deferred decision.
- **2026-09-11 (operator ruling, integration seat):** Amendment: the end state becomes
  the program. Atoms canonical, cells as accounting with a cached rendering, one reader in
  the substrate retrieval service, one writer discipline, one vocabulary, seven steps as
  rows. Supersedes the 2026-09-06 narrow scope: the backfill is all rails.
  `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`.
