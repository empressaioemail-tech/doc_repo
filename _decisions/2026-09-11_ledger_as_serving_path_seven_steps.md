---
decision_id: 2026-09-11_ledger_as_serving_path_seven_steps
date: 2026-09-11
owner: Nick (operator), recorded by the integration seat
status: active
related_canonical:
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - 19_the_instrument_contract
  - 90_operations/OPS-23_surface_completion_program
  - 90_operations/OPS-22_spine_architecture_map
  - _decisions/2026-09-02_step7_consumer_c_then_b
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
  - _decisions/2026-09-11_ruling_b_reversed_polygon_only
---

## Decision

The ledger becomes the serving path and the single normalizer for every surface, and the whole
system runs on atoms, in the sense Doc 19 gives those words. Ruled 2026-09-11 with the operator's
own framing: "reports, Smart Site MCP and the web app should read from the ledger so all the
information is complete, and the Hauska layer should supply all the information to the ledger in
the form of nodes, edges and atoms."

1. **Atoms are canonical.** Every fact, including every relationship, is an atom hanging off a
   node (Doc 19: a node carries no facts; an atom is one claim from one authority at one time;
   an edge is an atom whose value is a node).
2. **A cell is accounting, never a copy.** For every node and rail the ledger holds one cell
   carrying the state, the atom reference, provenance, and (ruled tonight) a **cached
   rendering** keyed to the atom version and the vocabulary version. A cell that holds a value
   with no atom behind it is the debt ADR-031 Decision 4 blessed, and this decision retires it
   by backfill rather than by tolerance.
3. **One reader, in the substrate.** The reader walks gated cells, dereferences atoms, and
   returns them with access pairs enforced. It lives in the Hauska retrieval service, below
   both cortex and the Hauska MCP server, so agents and apps consume the same read (ADR-031
   5(b) made concrete). Cortex, smartsite-mcp, the engine reports, Property Explorer and the
   Hauska MCP tools are its consumers. Unslated rails refuse with the cell state; they do not
   fall to a legacy path.
4. **One writer discipline.** The conformant writer mints the atom, sets the cell pointer, and
   writes the rendering in one transaction. Every factory cell job routes through it; every
   engine writer is reachable by the runner.
5. **One vocabulary.** The human face of an atom is produced by one versioned module that both
   the writer and the reader import, shipped as a subpath of the atom-contract package, which
   retires the two-copy parity lock between Property Explorer and the engine.

The seven steps, in dependency order, are the program: nodes and the crosswalk as a contract
type; the rail-to-atom map for all 65 rails; the one writer; the backfill that mints atoms from
existing gated cells and repoints them with values unchanged; the one reader with the refuse
default and retirement of the legacy read paths; edges as first-class atoms; succession. Rows
are in OPS-23 and OPS-16 A-129.

## Context

On 2026-09-11 the integration seat traced one Bastrop parcel through production and found five
producers of setbacks, six read paths, a map that refuses a polygon its own endpoint returns, a
PDF with two buildable figures, and a Travis panel that renders three of fourteen facts. Every
one is a symptom of reading around the ledger. OPS-21 had just finished making the ledger fully
graded and record-served at cortex, and the operator's reaction was that the workarounds "seem
to just be creating more scabs". The c-then-b decision already named the full repoint as "the
destination after slates prove out"; OPS-21 Phase 2S recorded that the destination "has never
had a plan row anywhere". This decision gives it rows.

## Structural commitment check

Sell reasoning, not data: the atom is the unit that carries the reasoning chain, provenance
class, confidence basis and access pair; serving atoms through cells means every surface serves
that, not a copied scalar. Confidence is earned: the calibration loop attaches to atoms and
outcomes, and a reader that dereferences atoms is where a calibrated confidence can replace an
asserted one without touching the surfaces. Cost per jurisdiction: unchanged by this decision;
acquisition is the same work under any architecture. Dual interface: one reader, two faces, one
vocabulary.

## Reasoning

An alternative considered tonight and rejected: cells as canonical with atoms projected from
them. It would have made divergence impossible by construction and it would have been cheaper
this quarter. Rejected because it inverts the thesis: the catalog would become a view of a
product table, and edges, supersession and calibration would have to be re-invented on cells.
The projection idea survives only as the mechanism of step 4, the one-time backfill that mints
atoms from cells that already carry value, provenance and scope.

A second alternative, keeping the reader in cortex: rejected because the Hauska MCP catalog
must read the same cells with the same access enforcement, and cortex is a product backend that
should not hold a factory-store credential.

The cached rendering was weighed against a thin cell that dereferences on every read.
Dereferencing 65 atoms per parcel from a store measured at 192 GB on every inspect is not a
free read, and the baked snapshot exists today for exactly that reason. A rendering keyed to the
atom version and the vocabulary version is not a second source of truth: it cannot be served
stale without the key mismatching.

## Reversal criteria

Reverse the reader location if the retrieval service cannot hold a read-only role on the
factory store without violating the seat and credential rules, in which case the reader moves
to the factory's control plane, never to cortex. Reverse the cached rendering if a rendering is
ever observed served with a matching key and a different atom, which would mean the key is
wrong, and the fix is the key, never removing the cache. Reverse the whole decision only if a
second state shows the atoms-first writer cannot meet the cost-per-jurisdiction commitment
after the writer discipline is in place; then narrow the rail set, never reopen source-direct
cells.

## Dependencies

OPS-23 rows P-161 to P-166 (the seven steps; step 5 is the existing P-152 re-scoped). P-151
and P-153 proceed unchanged. The boundary/envelope atom program's unstarted items fold into
steps 4 and 7. L4 stays owed until no gated cell holds a value without an atom, then it is
retired as unnecessary.

## Counterparties

Internal. The substrate seat owns the retrieval service and the atom-contract package; the
property seat owns the consumers; the factory owns the writer and the backfill.
