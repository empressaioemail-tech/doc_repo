---
id: 2026-09-13_HANDOFF_national_program_package
title: HANDOFF — the national program package, entry point and manifest
date: 2026-09-13
status: handoff — package is complete and committed; NOTHING in it is ratified
kind: handoff
owner: nick
audience: the next planning agent, merging this with lanes already in flight
plan_rows: [P-176, P-181, P-182]
commit: ea3a7fd2
---

# HANDOFF — the national program package

> **You are being handed a THOUGHT TRACK, not a plan of record.** Three plan rows exist
> (P-176, P-181, P-182) and two of them are already closed. Everything else on this page is
> analysis, and the operator has deliberately ratified none of it. Do not treat any section
> as a ruling. Where something IS ruled, the ruling is cited.

## Read in this order

| # | Artifact | What it is | Status |
|---|---|---|---|
| 1 | `_inbox/2026-09-13_national_program_framework_WDLL.md` | **Start here.** Six layers in dependency order, the whole thought track | draft |
| 2 | `_inbox/2026-09-13_dead_controls_ranked_fixes.md` | L0. Eight controls that cannot fail, ranked, fix proposed each | findings verified, fixes proposed |
| 3 | `_inbox/2026-09-13_assumption_register_ldt.md` | 38 rows, LDT `31d181c2` | closed |
| 4 | `_inbox/2026-09-13_assumption_register_engine.md` | 27 rows, engine `112bccb8` | closed |
| 5 | `_inbox/2026-09-13_assumption_register_factory.md` | 29 rows + completeness inventory, factory `97b93877` | closed |
| 6 | `_inbox/2026-09-13_subcounty_coverage_audit.md` | Places, not counties. Contradicted its own premise | closed-partial |
| 7 | `_inbox/2026-09-13_tx_source_inventory_and_acquisition_process.md` | Texas source picture + the acquisition process it implies | draft |
| 8 | `_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md` | The 65-rail division, COGS model, live probe | active |
| 9 | `80_adrs/adr_032_third_party_source_rights_envelope.md` | Cotality + ICC in one pipeline | **proposed, not accepted** |
| 10 | `_inbox/2026-09-13_national_scale_working_notes.md` **with** `..._adversarial_review.md` | **Read as a PAIR.** The notes are wrong in seven confirmed ways | superseded, kept on purpose |

Items 11 and 12 are instruments, not reading: `scripts/tx-cad-source-inventory.mjs` and
`scripts/tx-source-truth.mjs`, both self-testing with not-vacuous cases, emitting
`_catalog/tx_cad_source_inventory.json` and `_catalog/tx_source_truth.json`. Re-run them
rather than quoting their numbers.

## The thesis in four sentences

Throughput was never the bottleneck and the number proving it was already in the repo:
`OPS-14` records the wave machinery acquiring **177 counties in two days**, and says in the
same sentence that its count-based gates could not see the Harris truncation. What is
unsolved is trust. Eight controls run, report success, and are structurally incapable of
failing, so no statement of the form "county X passed" currently carries information about
whether county X contains anything. Everything else in this program sits on top of that.

## What is MEASURED (re-runnable, cite freely)

```
Texas CAD source      176 rest-reachable · 19 unproven · 58 absent · 1 unmeasured-network
Endpoint platform     182 of 195 on services*.arcgis.com  ->  ONE adapter covers 93%
Parcels at source     9,198,711 countable
Geometry at source    195 stratmap-available · 47 CAD-absent BUT geometry-available
Geometry ingest run   162 pass · 3 fail (48213, 48291, 48499) · 89 NEVER RUN
Envelope              envelopeStatus = value on 0 of 611,116 incorporated parcels
Cities, six counties  69 total · 23 with an endpoint · only 17 wired · reproduced twice
Harris                1,523,640 parcel-node atoms, but see the caveat below
```

## What is NOT measured (do not cite as fact)

The Cotality billing unit. Whether Cotality's fields are accurate (that is P-176). Whether
the 19 unproven endpoints are reachable. Whether `landing_parcel_jurisdiction` is itself
short — the read-only role cannot see it. CDP, unincorporated and postal-place coverage —
the only roster in reach holds incorporated cities. Any cost figure whatsoever (see below).

**And one caveat that matters:** `writePropertyAtomsBatch` returns the pre-dedupe array
while inserting the post-dedupe one, so a clean `N/N written and verified` is consistent
with any number of silent collapses. The Harris figure above is real but does not prove
what it appears to prove.

## The eight dead controls, in one table

| Control | Repo | Why it cannot fail |
|---|---|---|
| `evaluateRailGate` | factory | `ok:true` on **zero** earned cells — an empty county passes 65/65 |
| `evaluatePopulation` | factory | every ratio refusal gated on `code === "OK"`; `EMPTY_DENOMINATOR` skips all |
| `assertEdgesNotStarved` | engine | compares a computation against itself, before the transaction |
| 3 rails with no lease | engine | owner-fact, land-use-fact, flood-hazard-fact throw on first batch |
| `computeTier1Envelope` | LDT | both return branches `declined` — 0 of 611,116 confirms it |
| `facetCoverage.baseFacts` | LDT | uses the join key as evidence the join worked |
| `resolveZoningJurisdiction` | LDT | two consecutive branches return the same expression |
| `pin-divergence.test.mjs` | factory | asserts a sha256 is 64 characters long |

Plus three factory failure modes writing `absent-verified`, an *earned* kind, where nothing
looked.

**Five already have a violation fixture:** an empty county for the two gates, Thrall for
`facetCoverage`, a known-failed join for the starvation guard, a moved pin for the CI test.
That matters because ENFORCEMENT requires verifying a check by violating it, and
manufacturing the violation is usually the expensive part.

## The three open plan rows

**P-176 — Cotality bake-off. COMPILED, NEVER DISPATCHED.** Sixty parcels at
`_catalog/vendor_testset_ctx.json`, dispatch at `_dispatches/2026-09-12_ctx-bakeoff_dispatch.md`.
Needs no contract: the eval agreement permits internal evaluation and the MCP channel is
live. Three pre-registered falsifiers, including one stating that zero disagreements means
the instrument is wrong. 180 calls against a documented-but-unmeasured 100/day ceiling, so
run it county by county. **This is the highest-value unstarted thing in the package.**

**P-181 — assumption registers. CLOSED.** 94 rows across three repos.

**P-182 — sub-county coverage audit. CLOSED-PARTIAL.** CDPs and postal places unenumerated;
`landing_parcel_jurisdiction` unread.

## The four gaps in this package

1. **The federal tier has no card.** Terrain, flood, roads, footprints, boundaries, soils,
   pipelines — uniform in fifty states, zero per-county work, no dependency on anything in
   this package. It is the only layer that can start today and it is described only as a
   section inside the framework card. **Card this first if you card anything.**
2. **Rails v3 has no card.** Described as promote-to-rail plus companion-with-declared-manifest,
   county-grain staging not parcel-grain, families split by tier not source. Collides with
   OPS-21 D5 — verify D5's landed state before planning against either rail count.
3. **The ICC adoption table has no card.** Jurisdiction to code family to edition to effective
   date. Plan-review deliberately refuses to infer it. Without it ICC content is a library,
   not an answer.
4. **No row-level dependency map.** The framework card gives layer dependencies. Nobody has
   mapped which specific in-flight OPS-21 and OPS-23 rows block which parts of this.

## Cross-program seams you will hit

**G-17** (hard-reference obligation detection, currently allowlist-and-regex) is now
load-bearing for **two** sources rather than one. It gates both Cotality metering and ICC
metering. G-23 (rates null everywhere) and G-111 (substrate reader) sit alongside it.

**OPS-23** owns the serving path. The coverage audit found the surface contradicting the
record **in both directions** while declaring `readPath: "record"`, with all 88 probed
payloads carrying July or August `bakedAt` against cells written in September. That belongs
to OPS-23, not to this package, but it was found here.

**OPS-21** owns the setback and envelope writers. The 0-of-611,116 envelope figure is that
program's problem measured at population scale.

## Two operator items, neither carded

**The Bell cost-gate recalibration.** `onboarding_defect_class_backlog.md` records
BELL-COST-GATE-BREACH declining at $333.34 against commitment #3's $200 hard kill, then
cleared at $1.15 by recalibrating the cost model with the `$2/1k-calls` external-call term
removed. The hard kill was satisfied by retuning the instrument, and the deleted term is
what a national acquisition consists of.

**A duplicate row ID.** `A-136` exists twice: mine committed 2026-09-12, another seat's
allocated 2026-09-13. Renumbering a committed row breaks references, so this wants a ruling
rather than a unilateral fix.

## Sequencing, noted not ruled

**Bell 48027 and Milam 48331**, with their cities, are the first two counties through the
revised pipeline once it is shaped, chosen because they connect geographically to the
existing six. Bell is known ground: 165,574 parcels, certified 20/20 on 2026-08-05.

## Rules that will save you the mistakes this session made

1. **Build from code at a declared SHA, never from defect history.** Four of ten known
   assumptions were already fixed and failing closed. Planning from the historical list
   would have re-fixed solved problems.
2. **`TX-LANDING-ABSENT` means not ingested, never no source.** A 217 figure was misread
   that way and it inverted an entire plan.
3. **A single field can lie about a whole county.** Harris was classified absent from
   `service_url: null` while the same artifact held DNS failures from the probe network.
4. **The enumeration usually already exists.** P-182 was opened to build a list that was
   already in a 1,223-place roster, in 448,245 store refusals, and in OPS-22. **The recurring
   defect in this repo is a missing rollup, not missing data.** Search before you card.
5. **A check whose input shares an upstream with what it checks cannot detect truncation.**
   Harris: dry, apply, apply2 and SQL all agreed at 564,948 on the same truncated read.
6. **No cost estimates.** Operator ruling 2026-09-13. The prior economics traced to a depth
   pass over ~5,769 parcels of a 74,729-parcel county.
7. **Dispatches are compiled, never hand-assembled.** The canon gate refused three attempts
   this session and was right every time. No override was used, and none should be.
8. **Never glob across a shared tree.** A renumber script in this session rewrote 14 files
   belonging to other seats. All were tracked and restored byte-exact, but the near-miss is
   the lesson: verify the CONTENT a script will change, not the paths it will touch.

## What the next planner should do first

Card the federal tier. It has no dependencies, no ruling required, no contract, and it is the
only thing here that turns into national coverage without solving anything else first.

Then dispatch P-176, because it is already compiled and its channel is already live.

Then decide whether the eight dead controls are one row or eight, because until they can
fail, nothing measured downstream of them means anything — including the numbers in this
handoff.
