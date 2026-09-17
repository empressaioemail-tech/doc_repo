## Mission — P-322: the rails that wanted Cotality ship as declared absences

You launch no sub-agents (FAN-DEPTH 0). You may read every repo; you write only where this mission
says. You open a PR per repo you change and hand any doc_repo change back as a diff in your close.
You do not merge or deploy, and you write to no store.

### The ruling (OPS-16 A-212, operator, 2026-09-17)

Cotality is about two weeks out. Nothing waits on it. Every rail that wanted Cotality ships as a
DECLARED absence: `unaccounted` at rest, labelled where a customer reads it, never fabricated and
never a silent hole. Nothing is relabelled `absent-verified` to clear a gate. A degraded answer
labelled as degraded is honest; a degraded answer presented as complete is the defect.

### What is known, and what you must establish

Known: P-267 names `agValuation` as Texas-wide with no source in four of the six counties
(Bastrop, Caldwell, Hays, McLennan), about 318,000 cells held honestly `unaccounted`, with a
never-run not-applicable sweep that WOULD write the false state if it ever ran. P-253 gives the
rail the state `vendor-pending` in those counties. P-283 is the contract read and is deferred.

Not known, and your first job: whether `agValuation` is the ONLY Cotality-dependent rail. Do not
assume it is. Enumerate by reading the writers and the rail declarations, not by grepping for the
vendor's name — the property is semantic and a rail can depend on a vendor without naming one.

### What to build

1. **The enumeration.** Every rail whose source is Cotality or which has no source pending
   Cotality, with its current cell state per county and the count. State the instrument that
   produced each number and the snapshot it ran against. If a rail's dependency is ambiguous, say
   so and name both readings rather than picking one.
2. **Prove nothing was relabelled.** For every rail in the enumeration, query in both directions:
   no cell is `absent-verified` where nothing looked, and the `unaccounted` counts have not fallen
   without a matching acquisition landing. A falling unaccounted count with no acquisition is
   relabelling and it looks like progress. Report the counts, not a verdict.
3. **The declared absence reaches a customer.** For each rail, a customer reading the surface must
   get: what the rail is, that it is not yet sourced, and what would fill it. Establish first what
   each surface does TODAY for these cells (panel, MCP, the feasibility export and its PDF) — a
   rail that already declares itself needs no change, and saying so is a result. Change only what
   is silent. Name the exact string you ship and where it renders.
4. **The sweep cannot run by accident.** P-267's not-applicable sweep would write a false state
   across about 318,000 cells. Confirm whether it can still be invoked, and if it can, make it
   refuse rather than relying on nobody running it. This overlaps P-320's blast-radius refusal
   (in flight in `hauska-factory`); if P-320's shared threshold has landed, use it rather than
   building a second one, and say which you found.
5. **The Phase 0 exit text.** Hand back a diff for OPS-16 and the roadmap restating the exit
   criteria without Cotality, with the Cotality-dependent rails counted as declared absences
   rather than as gaps. You do not commit it.

### Verify by violation

- Plant a cell that is `absent-verified` where nothing looked and show your check catches it.
- Plant a silent cell on a surface you changed and show it now renders the declared absence.
- A check you have only seen pass has not been observed working. Show both directions for each.

### Constraints

- No store writes. No deploys. No merges.
- County 48491 is being restored from a point-in-time branch; do not touch it in any store.
- If you find that a rail's real blocker is not Cotality, that is a finding and it goes in the
  close under its own heading. Do not fold it into the Cotality story.

### Close

Declare: the enumeration with instruments and snapshots, the relabelling check in both directions,
what each surface did before and after, the sweep's status, the PR numbers, the doc_repo diff, and
`leave_behind`.
