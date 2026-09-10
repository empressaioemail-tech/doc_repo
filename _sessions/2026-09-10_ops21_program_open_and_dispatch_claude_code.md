---
date: 2026-09-10
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
supersedes: none
snapshot: >
  doc_repo main, opened at 94d93f3d, committed through b7b2d4ee. Integration seat,
  P:/doc_repo, branch main. Read-only across hauska-factory 63a606b, legacy-design-tools
  (main moved c43e2436 -> cebd041d mid-session), hauska-engine 15021ef, hauska-map fb41c05,
  smartcity-os 332a16c, plan-review 3615ee1.
---

# OPS-21 opened, seven lanes dispatched, and three planner errors in my own dispatches

Second session record for 2026-09-10. The first
(`2026-09-10_county_contract_and_scaling_diagnosis_claude_code.md`) covers the scaling
diagnosis and the county contract. This one covers the OPS-21 serve-completion program:
root cause, plan, dispatch, and what went wrong dispatching it.

## PROPOSED RULE — log this for permanence

**Named in-session, to be made a mechanism rather than a habit.** Three of seven OPS-21
dispatches carried the same defect class. That is a rate, not three incidents, and the
common cause is that I compiled seven lanes from a mental model of where things live and
verified repo residency for none of them.

### The rule, in two halves

**Half 1 — EXISTENCE. Every repo-scoped identifier a mission names must be confirmed to
exist in the repo the dispatch names.** File paths, symbols, tables, constants. A mission
naming a symbol absent from its own repo is refused at compile.

**Half 2 — BLAST RADIUS. Every symbol a mission instructs a lane to CHANGE must have its
consumers enumerated at compile, and the mission's own claim about scope must match that
count.** Not just "does it exist" but "how many things read it, and did the mission say so."

Half 1 is presence-shaped and catches the S3 class. Half 2 is meaning-shaped — two
independently derived inputs, the mission's asserted scope and the repo's actual consumer
count, asked whether they agree — and it is the half that catches D5 and D6.

### The three-question gate, answered

1. **What executes it:** a preflight in `scripts/dispatch.mjs`, before the dispatch file is
   written. Extract backtick-quoted identifiers and explicit paths from the mission and the
   program preamble; `git grep` each against the named repo at `origin/main`; for any symbol
   the mission says to change, count consumers and compare to the mission's stated scope.
2. **What triggers it:** every dispatch compile. Same place the PLAN-ROW check already runs.
3. **What fails:** non-zero exit, no dispatch file written. Same failure mode as an
   unknown PLAN-ROW, which already works.
4. **What bypasses it:** an identifier not in backticks and not path-shaped; a symbol
   present in the repo but meaning something different; a mission that names no symbols at
   all. **Half 1 is presence-shaped and cannot fix that — stated here so the residual is
   declared rather than discovered.** A mission with no named symbols passes vacuously and
   should probably be refused on that ground alone.

### The three instances, for the record

**S3 / P-134 — wrong repo.** `computeTier1Envelope` exists in ZERO files in hauska-engine
and six in legacy-design-tools (`artifacts/api-server/src/lib/nodeFacetBakeTier1.ts:92`).
Compiled with `--repo hauska-engine`. Identical shape to CTX-STAMP on 2026-09-09, which was
dispatched at the wrong repo, read the function it was pointed at, found it wrote a
different table in a different database, and stopped. That lane caught it; this one should
not have had to. Repointed, re-registered, recompiled (`b7b2d4ee`).

**D6 / P-141 — under-scoped by a factor of three.** Cell-state consumers measured at ~55
files in hauska-factory, ~82 in legacy-design-tools, ~14 in hauska-engine. A six-value union
was dispatched to one repo. Corrected in-flight to ENUMERATE AND STOP; sibling lanes get
compiled from its inventory.

**D5 / P-136 — a cross-consumer claim verified on one side.** The dispatch's STANDING FACTS
asserted "widening what is graded changes nothing a customer sees." True of the LDT
serve-side allowlist. **False for hauska-factory's own publish gate**, which imports
`DEFAULT_SCHED_RAIL_KEYS` and uses it as the DEFAULT `requiredRails` for
`requirePreBakeReadiness` — and `bastrop-publish.mjs:407` calls that with no third argument.
Widening it literally would have blocked every publish for every county. **The lane caught
this, put it to the operator, and was right.** One constant, two controls, one of them read.

## What was done

**Root-caused why setbacks and envelope never land**, verified at source. Two correct
decisions by two owners forming a gap with no owner: `computeTier1Envelope` has two return
branches and BOTH are `status:"declined"` — it is called, executes, returns a well-formed
object, passes every test, and is structurally incapable of returning a value on any branch.
Its disclosure defers to the atom chain; the atom chain needs buildable-envelope atoms;
`write-setback-city.mjs:95` throws `SETBACK_APPLY_HELD` on `--apply` (commit `c344345`, a
card-scope boundary no later card lifted) and has no live parcel loader at all.

**Filed OPS-22** (`90_operations/OPS-22_spine_architecture_map.md`), the spine architecture
map: identity, jurisdiction, the 65-rail closed set, write fan-in, read fan-out, control
plane. Records that the atoms-store binding lives in `cloudbuild.property-atom-bake.yaml` —
invisible to both repos that needed it, which is why a lane could not establish it.

**Filed OPS-21** (`90_operations/OPS-21_serve_completion_program.md`), four phases, fourteen
rows (OPS-16 A-122, P-132..P-145). Phase 2S added at operator prompt: the ledger AS the
serve path had never had a plan row anywhere despite being the declared destination in
ADR-031 and the c-then-b decision. A destination with no rows is a sentence.

**Built the anti-drift mechanism** (`scripts/plan-progress.mjs`). Every lane's completion is
a query against `parcel_record`, not a paragraph. Self-tests nine checks including
non-vacuity; refuses with exit 2 rather than reporting a false zero without credentials.

**Operator ruled a sixth cell state**, `available-on-request`
(`_decisions/2026-09-10_available_on_request_sixth_cell_state.md`), over the planner's
recommendation to overload `not-applicable`. Operator's reasoning: a state needing a
footnote to be read correctly will eventually be read incorrectly. That is the better call.

**Built a program-scoped preamble.** Measured first: the shared standing-decisions preamble
is 8,293 bytes, of which 5,605 (68 percent) is SmartCity Dashboards G-row state shipped into
every factory lane; only 547 bytes are genuinely fleet-wide.
`_catalog/program_preambles/OPS-21.md` is 6KB of actual program law. `dispatch.mjs` gains
`--program-preamble`, ADDITIVE ONLY so the canon-gate hash is untouched and compiler/gate
cannot diverge. Dispatch composition went 34 percent lane-relevant with zero program context
to 46 percent with 6,023 bytes of it.

## What was learned (changes to ground truth)

**The publish gate grades 17 of 65 rails.** `DEFAULT_SCHED_RAIL_KEYS` = SLATE_1(5) +
SLATE_1B(2) + SLATE_1C(1) + SLATE_1D(7) + LANDUSE_OWNER(2). Canon says `unaccounted` is
fatal at publish; that is enforced for 17 rails and 48 are never asked. This is the
mechanism behind "agents think they are done when they are not" — the denominator was 17.

**And that same constant is the publish pre-bake floor.** Found by the D5 lane, not by me.
Widening it is NOT free in this repo.

**Ledger-serving is further along than the docs say:** 18 rails, 94 of 390 (county, rail)
pairs. And **not one of those 94 cutovers has had its old serve path verified retired**,
against the c-then-b requirement that each carries its retirement in the same card.

**The permit corpus exists and is already serving.** `permit_record`: austin_tx ~2.36M rows
(1921 to present), san_antonio_tx ~487K (2020-07 to present), acquired 2026-06-21 through
the uniform public-record process, consumed by the `permits:record` Property Brief adapter —
and the `permits` rail is `unaccounted`. Joins on `address_normalized`, not a parcel key;
`tcad_id` is stored for a future verified id-join and unused because the correspondence is
unverified.

**Bastrop MyGov is off limits and it will look like free coverage.** `smartcity-os`
`tenant_id=2` carries 658 active permits plus inspections, violations, work orders, fees,
licences and contractors. It is a city customer's internal feed; tenant sovereignty and NO
PRIVILEGED DATA both forbid it populating a public parcel rail. Operator confirmed.

**Mineral rights conflates two things.** RRC gives wells and pipelines (their own rails).
Mineral ownership is deed records, and `packages/og-title/` in hauska-engine is a real
title-chain subsystem — 643 of 646 runsheet rows parsed, 476 instruments scoped, proven on
one Winkler County tract — at method v0 with a placeholder WI computation, graded
UNGRADEABLE-YET because the answer key's OCR is unreadable.

**`P:/hauska-factory` is a stale clone**, 246 commits behind at "Initial commit" with only a
README. Five of seven lanes would have opened it and found an empty repo.

## What's still open

**The rule above needs to become a mechanism.** It is prose in this file today, which is
exactly the condition it exists to fix. It has no row.

**H1 must not measure yet.** LDT main moved twice mid-session with Hays identity work from a
parallel thread — CTX-HAYS-REBIND (#653) added `cad_property.quick_ref_id` and
`property_number`; CTX-HAYS-BACKFILL (#654) is filling them. H1's ground truth is changing
underneath it, and CTX-HAYS-BACKFILL's own commit body carries an open operator question
about whether the 8-26-2026 drop is Hays' declared 2026 roll. H1 was held in-flight.

**D6's sibling lanes** (LDT and engine halves) are not compiled and depend on its inventory.

**The shared preamble prune** — moving 15 SmartCity bullets out of
`_state/shared/STANDING_DECISIONS.md` — is not done. It touches a file with concurrent
writers and stays a deliberate card.

**The four remaining missions have not been re-read** for the same defect class found in
S3, D5 and D6.

## Suggested canonical doc updates

1. **A plan row for the dispatch preflight rule.** It is the highest-value item in this file
   and it is currently prose.
2. **`_catalog/program_preambles/OPS-21.md`** — correct the "changes nothing a customer
   sees" line, which is false for hauska-factory's own publish gate. Three other lanes carry
   it.
3. **OPS-22 section 7** should carry the D5 instance: a cross-consumer claim verified on one
   side of a seam is the same class as a cross-repo invariant, and it happened inside one
   repo.
4. **A row for the shared-preamble prune**, with the 8,293 / 5,605 / 547 measurement in it.
