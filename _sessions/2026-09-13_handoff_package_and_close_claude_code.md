---
date: 2026-09-13
agent: planner
repo: docs
session_type: planning
memory_graded: [dispatches-are-compiled-not-authored:HELPED, canon-gate-hook-is-live:HELPED, doc-repo-concurrent-commit-hazard:HELPED, text-search-cannot-answer-structural-questions:HELPED, city-roster-has-no-county-link:HARMED]
rolled_up: false
supersedes: _sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md (append-only; that capture stands, this continues it)
snapshot: >
  doc_repo main, integration seat, P:/doc_repo. Committed ea3a7fd2 (35 files, 10,971
  insertions). origin/main moved SEVEN times during this session from other seats in the
  same physical tree: 3070515a -> 6d84cb5c (mine) -> 933f68b8 -> 9eef6a6c -> 33b7f27d ->
  b155471f -> c2d5cda0 -> ea3a7fd2 (mine). Product repos read at origin/main without
  checkout: legacy-design-tools 31d181c2, hauska-engine 112bccb8, hauska-factory 97b93877.
  Factory store read read-only via FACTORY_DATABASE_URL_RO.
---

# The handoff package, four lane returns, and two planner incidents

## What was done

Continues `_sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md`. Four
compiled read-only lanes returned (three assumption registers plus the sub-county coverage
audit), their headline claims were verified at source by this seat rather than relayed, the
L0 dead-controls card was written, a row-ID collision with a concurrent seat was resolved, a
planner error damaged and restored fourteen other-seat files, everything was committed as
`ea3a7fd2`, and the handoff package was assembled.

## What was learned (changes to ground truth)

**Eight controls run, report success, and cannot fail.** All verified at source at declared
SHAs, ranked with a proposed fix each in `_inbox/2026-09-13_dead_controls_ranked_fixes.md`.
The two that matter most are the same defect in two repos: `evaluateRailGate` returns
`ok:true` on zero earned cells, and `evaluatePopulation` gates every ratio refusal on
`code === "OK"` so `EMPTY_DENOMINATOR` skips all of them. **Total absence passes while
partial absence refuses.** An empty county earns 65 clean `excluded` verdicts and a passing
readiness gate, which is precisely the state of the 217 `TX-LANDING-ABSENT` counties.

**Three engine rails cannot write at all.** `write-owner-fact-county.mjs`,
`write-land-use-fact-county.mjs` and `write-flood-hazard-fact-county.mjs` carry zero
mentions of "lease" and call `writePropertyAtomsBatch(slice)`, which throws
`LeaseRequiredError` without one (`pg-storage.ts:305-307`). Owner, land use and flood hazard.

**`envelopeStatus` holds a value on 0 of 611,116 incorporated parcels.** Measured directly
against the factory store by this seat. That is `computeTier1Envelope`'s vacuity at
population scale.

**A verified figure I had reported was weaker than I said.**
`property-atom-batch-write.ts:98` inserts `rows` (post-dedupe) and returns `out`
(pre-dedupe, pushed once per instance). A clean `N/N written and verified` is therefore
consistent with any number of silent collapses, Harris's 1,523,640 included. The number is
real; it does not prove what I claimed.

**P-182 contradicted its own premise, which is why it was worth running.** I opened it
saying nobody had enumerated sub-county coverage. The enumeration exists in three places:
`_catalog/texas_roster_v1.json` (1,223 places, Thrall carrying `"searched-and-absent"`
probed 2026-08-12), 448,245 store refusals on `zoningJurisdictionKey` naming places
verbatim, and OPS-22 section 2. **The defect is a missing rollup and gate, not missing
data.** My own memory carried the exact 69/23 figure and I did not connect it, which is why
`city-roster-has-no-county-link` is graded HARMED.

**OPS-22 section 2 reproduced exactly, and confirmed independently.** 69 cities, 23 with an
endpoint, split 3/3, 3/3, 5/11, 7/14, 3/18, 2/20. The 23 the T6 roster probed in August and
the 23 the Factory store binds parcels to in September are the same 23, zero difference.
That is a genuine two-derivation agreement, the first this week. **But only 17 are wired in
`ZONING_LAYERS`**, and six cities have staged zoning, bound parcels, and neither a wiring
nor a setback table.

**The surface contradicts the record in both directions while declaring `readPath: "record"`.**
Beverly Hills `48309:161056`: record refuses `zoningDistrict`, surface serves `R-2` with
`facetCoverage.zoning: true`. Smithville `48021:103265`: record holds `SF-1`, surface serves
it and sets coverage false in the same payload. All 88 probes carry July or August `bakedAt`
against cells written 2026-09-02 to 09-10. **This belongs to OPS-23 and was found here.**

**McGregor is worse than Thrall** — an incorporated McLennan city in the roster that appears
in no store vocabulary at all. **Hays' setback rail was never written**: 54,835 of 54,835
incorporated parcels unaccounted despite four wired cities with four ruled tables.

**Four of the assumptions I fed the lanes as verified context were stale**, and each lane
corrected me at source: `mergeBakedBaseFacts` does not exist in LDT; the factory gate already
grades all 65 rails with the 17 surviving as a fail-closed floor; `write-setback-city.mjs`
does not exist and `setbackFrontFt` does have a live writer; `railCapabilities` has zero
occurrences in the factory repo. No factory cell writer is vacuous — the vacuity is in the
gates.

## Two planner incidents, both recorded rather than smoothed

**Row-ID collision.** I allocated A-137/A-138/P-177/P-178 by grepping the max row while a
concurrent seat allocated the same IDs for OPS-23 and Hays work and committed first.
Renumbered mine to A-145/A-146/P-181/P-182 and renamed the mission files to match. `A-136`
remains duplicated (mine committed 2026-09-12, theirs 2026-09-13) and is left for an operator
ruling, since renumbering a committed row breaks references. **The structural problem is that
row allocation has no mechanism; any number is a guess that can collide within minutes.**

**I globbed across a shared tree.** The renumber script matched `_inbox/2026-09-13_*` and
`_dispatches/2026-09-13_*` and blind-replaced `P-177 -> P-181`. Forty-five files changed;
**fourteen belonged to other seats** and had their committed references rewritten backwards.
All were tracked, all restored byte-exact with `git checkout --`, no data lost. The lesson is
that I verified the PATHS a script would touch by pattern and not the CONTENT it would change.
A glob is a predicate and I did not test it against a known-bad input before running it on a
tree with five other writers.

**The pattern across both, and across this whole session:** every ad-hoc instrument built
under time pressure returned a plausible wrong answer (the shell classifier that called Harris
absent, the 217 landing-versus-source misread, the glob). Both instruments written as files
with self-tests held. ENFORCEMENT already says this; I demonstrated it three more times.

**The canon gate refused three dispatch attempts and was right every time:** missing contract
markers, a paraphrased rather than verbatim FLEET MEMORY block ("the hash marker is not the
install"), and a no-nesting clause present but not on the first line. No override used.

## What is still open

P-176 Cotality bake-off: compiled, never dispatched, needs no contract. The four package gaps:
no federal-tier card, no rails-v3 card, no ICC-adoption-table card, no row-level dependency map.
The Bell cost-gate recalibration, which satisfied commitment #3's hard kill by retuning the
instrument and deleting the external-call term. The duplicate `A-136`. Everything in the
"NOT measured" section of the handoff.

## Suggested canonical doc updates

Done this session: `00_current_state.md` line 163 corrected from a blanket "Cotality
extinguished" to name the live MCP eval channel, `last_updated` bumped to 2026-09-13.

Still owed: `MEMORY.md`'s Cotality one-liner and `cotality-hit-means-decommission-not-credential`
carry the same blanket claim and will mislead an index scan exactly as the 2026-08-08
resurfacing did, in the opposite direction. `25b_monetization_provenance_storage_stack.md`
should carry the accrual-trigger asymmetry and point at ADR-032. `OPS-1_texas_source_registry.md`
should point at `_catalog/tx_source_truth.json` and record that 219 of 254 probes were never
transformed into registry rows. OPS-17 `G-17` should note it is now load-bearing for two
sources.

## Handoff

`_inbox/2026-09-13_HANDOFF_national_program_package.md` is the entry point: read-in-this-order
manifest, what is measured versus not, the eight dead controls in one table, the three plan
rows, the four gaps, the cross-program seams, and eight rules drawn from the mistakes made
getting here.
