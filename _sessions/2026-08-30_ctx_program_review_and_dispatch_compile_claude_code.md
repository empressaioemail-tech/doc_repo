---
date: 2026-08-30
agent: planner
repo: docs
session_type: review
memory_graded: [city-roster-has-no-county-link:HARMED, postgis-zone-major-not-point-major:HELPED, merge-only-on-green-ci:HELPED, doc-repo-concurrent-commit-hazard:HELPED]
rolled_up: false
---

## What was done

Adversarial review of the Central Texas facts/collect program, then compiled the
work that came out of it. Eleven review subagents across six threads; none
committed; every artifact read before it landed.

Produced and pushed: the consolidated schedule and test regime
(`_inbox/2026-08-30_ctx_consolidated_execution_plan.md`, the authoritative card),
four review artifacts, the A1-A12 amendments, the gate-8 spec, the alias seed
(`_catalog/2026-08-30_breadth_place_alias_seed.json`), the unincorporated ruling,
the P2-JURIS run record, and **six compiled dispatches** (P1-FACTORY, P1-LDT,
Gate 8, P2-JURIS, P2b-serve, F-11 engine, F-11 LDT).

Also armed `.claude/hooks/authoritative-read.mjs` — the read-the-authoritative-
record rule had been prose in ENFORCEMENT since 2026-08-21 and failed twice in
this session; it is now a warn-only hook with seven documented-instance rules,
self-tested in both directions.

P0 landed and pushed: both boundary lies corrected, the whole program tracked,
the three-state split propagated, the 0005 split specified.

## What was learned (changes to ground truth)

**The recurring defect is one shape, found five times.** A disposition vocabulary
exists at the section level and is unreachable at the leaf: `baseFacts.landUse`
null beside a live A1 atom; flood `present` with empty citations; `DrawEdge.state`
typed as a literal with one inhabitant; `parcelDrawFromReads` dropping
`sourceVintage` so `absent-verified` is unreachable on three overlays; a layer
manifest empty by construction. **Fix it as a type, not a check** — ENFORCEMENT's
own preference, and #558's typecheck failure proved it works.

**Controls that exist and cannot fail were the dominant finding.** `BP-CONTENT-01`
accepts null and its self-test asserts an all-null payload passes; PR #310 merged
and starved at the BFF; the LDT divergence test skips in CI; `import_ledger` had
zero SELECTs; the collect gate named a file no job image contains. This repo's
own DEV_PROCESS records prose controls at 0-for-3 and hooks at 1-for-1, and that
held all session.

**The owe table was over-scoped roughly 6x.** Setbacks, edges and envelope are
city facts (mold line 36, gate 4); 357,269 of 981,410 parcels are unincorporated
and can never hold a setback; 99.65% of Bastrop's edge parcels sit inside a city.
Edges owed are ~154,841, not county-wide. The six counties hold **72** cities, not
the 9 the plan named.

**Two writers, not one.** `depth-warm/emit-boundary-edges-from-warm.ts:120`
hardcodes `parcelNeighborPropId: null`; `boundary-primitive/compute.ts:226` writes
it unconditionally. P4 mints via depth-warm and therefore does not scale the 90.55%
neighbour defect, which is entirely legacy fixture data.

**A measured falsifier beat a plausible rule.** The proposed
`adjacencyKind ∈ {ROW,alley} ⇒ neighbour NULL` invariant was **refused**: 99.56%
of those 2,039 pairs touch at exactly 0.0 ft and it would have nulled ~300 true
ids. Alleys are *more* valid than ROW (35.92% vs 12.07%), so splitting by kind
does not rescue it.

**Four of my own load-bearing claims were wrong, all the same way** — reading the
convenient artifact instead of the authoritative one: "P4 multiplies the defect
41x" (wrong writer), "A12 is absorbed" (working tree, not HEAD), "826,569 are
unincorporated" (three populations conflated — would have fabricated a structural
claim on 469,300 in-city parcels), "containment re-derives in 1.3 s" (that was the
city-to-county roster join, not parcel containment). Three were caught by other
agents or a measurement, not by re-reading my conclusion.

## What's still open

- **P4 wells / footprint / flood** — GO on Gate 8 `dayOne`, unblocked, **no
  compiled dispatch**. Planner-owned. Being compiled now.
- **P2-JURIS TOTALS: UNMEASURED.** Merged `01` could never run (a literal `1/0` in
  a CASE inside an aggregate target list evaluates regardless of the condition);
  fixed on `7bd21de` / PR #42. With that neutralised the join exceeds its own 180s
  bound — `EXPLAIN` shows a Nested Loop over two CTE scans, ~846M comparisons,
  cost 1.06e10, no index reachable. **The plan is the next gate, not a green run.**
- **P4 setbacks / edges / envelope: HOLD** until LDT #560 lands and Gate 8 C7 is
  re-read. The engine half (#366, merged 80fb9069) is correct but insufficient —
  `boundaryEdgeFactRead.ts:379` copies `lead.setback` with no provenance
  inspection anywhere on the serve path.
- **0005b unapplied.** No bake-migrate job exists; `applyMigrations` reads
  `migrations/` only. Next act is a job against `STAGING_/PRODUCTION_NEONDB_URL`.
- `p1-ldt` / `p1-edges` DrawEdge leftovers — not empty, do not close or merge,
  cut a fresh tree.
- Map is deployed with `dataset.hauskaBuild=bb02f3b…`; customer-done still needs a
  live brief, not the stamp alone.
- Wave R, seed, scllr, F-09, F-10 254, P-80, Harris PBF: parked.

## Suggested canonical doc updates

- `00_current_state.md` — CTX section should point at
  `_inbox/2026-08-30_ctx_consolidated_execution_plan.md` as the authoritative
  schedule and note Band C / Band 1 are retired as schedules.
- `CLAUDE.md` ground-truth paragraph — the store figure is stale: `hauska_mcp` was
  measured this session at **111,241,840 reltuples / 192 GB**, against the
  100,025,152 / 131 GB currently recorded.
- `28_THE_BASTROP_MOLD_engine_build_spec.md` — gates 7 and 8 are still recorded as
  not mechanical. Gate 8 now has a built spec that fails on production
  (`_inbox/2026-08-30_gate8_smoke_spec.md`); gate 7's cheapest honest version is
  one column plus one check (refuse to close a county with no cost record or a
  null `humanReviewMinutes`).
- `61_enforcement_doctrine.md` / `ENFORCEMENT.md` — the leaf-disposition defect
  (five instances) deserves naming as its own class alongside dormant and starved.
