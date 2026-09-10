---
date: 2026-09-10
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
snapshot: doc_repo main, opened at e1dc8009, committed at 94d93f3d on top of the CTX thread's 28b4c0e6. Integration seat, P:/doc_repo, branch main. Read-only against P:/Empressa Trading (no commits, no branch).
---

# Scaling diagnosis, the positioning it forced, and the county contract

Operator opened on a notes file (`P:\tmp\smartsite revisit notes.txt`, 33 KB of
clips from several agents) asking why the county onboarding process is not
scalable and what to do about it. The session ran diagnosis, then a positioning
conversation the diagnosis forced, then produced and committed one artifact.

Ran alongside the live CTX completion thread throughout. Zero interaction with it,
zero write collision. That thread landed CTX-B6 (`28b4c0e6`) mid-session and this
seat noticed only when staging.

## What was done

**Diagnosis, grounded at source rather than accepted from the notes.** Verified
three claims the notes carried and corrected two numbers that did not survive
tracing. Six runbooks in twenty-four days confirmed. `OPS-8` confirmed real,
correct, and never armed since 2026-08-03. `OPS-11:81` confirmed grading SC-3
`UNENFORCED as a mechanism`.

**Measured the dispatch payload.** `_dispatches/2026-09-10_ctx-b6_dispatch.md` is
15,546 bytes; its mission is 5,317. The remaining ~10 KB is canon preamble
(8,405), agent contract (7,629 hashed) and dev process (15,983 hashed). The
preamble regenerated from `_STATE.md` is dominated by 2026-08-17 SmartCity
Dashboards rulings (PermitFlow kill, Compass sheet chrome, G-64 lane C staff path)
that a CTX county lane reads in full and cannot use.

**Measured seat topology.** `_catalog/seat_register.json` carries 212 registered
worktree entries. 200 belong to one seat, `property`, spanning four repos.

**Produced and committed the county contract** (`94d93f3d`): 68 columns, six
instantiated records, a fail-closed cell writer, and a dated seed.

## What was learned (changes to ground truth)

**The trading repo holds a working, domain-generic calibration engine, and on
three types it is AHEAD of the atom contract.** Read read-only at
`P:/Empressa Trading`. `apps/cockpit/backend/app/spine/` is ~6,000 lines carrying
`atom_context.py`, `calibration.py`, `outcomes.py`, `lineage.py`, `conflict.py`,
`immutability.py`, `store.py`, `serve.py`, and `anchoring/{canonical,seal}.py`.
`calibration.py`'s own docstring: "Calibration is GENERIC over `(claim_type,
worker)` — never hardcoded to trading claim-types", Beta-Binomial posterior with
credible width, `MIN_N = 8` and a declared baseline below it, and "INVARIANT A:
GLOBAL reads only public + consented signal", which is the tenant-sovereignty rule
in another body.

It is a PARALLEL Python implementation, not a consumer of
`@empressaio/atom-contract`, and the vocabularies have diverged. `accessPolicy` is
four values there (`public|paid|internal|private`) against the contract's five.
And three types exist there with NO counterpart in the contract at all:
`ConfidenceBasis` (`asserted|backtest|live`), `OutcomeLabel`
(`right|wrong|edited|partial|dismissed|declined`) and `OutcomeDeclineBasis`
(including `grader_abstained`). Those are exactly the asserted-versus-earned
distinction structural commitment two demands, and the outcome half of the
calibration loop. The property side has no outcome model.

Commit subjects on that repo are the same doctrine in a second language:
"Delete the lossy fetch wrappers; a vendor outage must not look like an empty
answer" (`506fdf76`), "make grader abstention expressible in the evidence ledger"
(`5ba6a398`), "dead-guard reachability scan - can any caller produce the trigger?"
(`10dc0a71`).

**Fleet memory reaches lanes as a protocol, never as content.** `scripts/dispatch.mjs`
stamps `FLEET-MEMORY v<hash>` from `90_runbooks/fleet_memory_practice.md`, and the
M0 block it emits instructs the lane to CAPTURE lessons and return them. It hands
the lane nothing already known. The ~100 entries in the planner's `MEMORY.md` reach
one reader. This is the mechanism behind the operator's "memory is only capturing
10 percent" and it is more specific than that: the dispatch carries the memory
protocol and not the memory.

**The lane close corpus is NOT machine-harvestable.** Measured before building an
extractor: 644 close JSONs in `_inbox`, 639 parseable, and only **57 carry a
FIPS-keyed object at all**, under at least 24 different parent keys
(`queueVerifiedPreWrite` 28, `keep` 25, `byCounty` 6, `perCounty` 4, plus 20
one-offs). The closes were never written to a schema. An extractor over that corpus
would have returned a plausible answer per county. The planned harvester was
abandoned on this measurement and replaced with explicit instrumented writes.

**23 of 69 cities in the six CTX counties carry a zoning layer endpoint.** Read live
from `_catalog/texas_roster_v1.json`: Bastrop 3/3, Caldwell 3/3, Hays 5/11,
Williamson 7/14, **Travis 3/18, McLennan 2/20**. This is the best available
explanation for why zoning kept blocking: the county-level work was largely done and
the city-level work was never enumerated, so each missing city surfaced one at a
time as a parcel matching no polygon. No claim is made that those 46 cities are
unzoned or unwired; the claim is that nobody knows, and the not-knowing was
invisible until now.

**The six CTX counties hold 69 cities, not 72.** Live roster read supersedes the
figure in fleet memory `city-roster-has-no-county-link`.

**The "thirteen questions, eight refuse" tally is superseded AND does not
reconcile.** OPS-16 A-060 (2026-08-31) covers thirteen MCP companion-app ledger
functions, not the thirteen fact families in `feasibility.ts:782-794`; the
2026-09-10 third-party review flags the two being conflated. A-060's own text names
eleven refusing families against a stated count of eight and never names the five
that answer. The 2026-09-09 retrospective declares the tally superseded as an
instrument by the `absentFields` classifier. **The customer-visible refusal count is
unmeasured today** and should not be quoted in either direction until probed.

**`ask_the_map` owes a ruling, not a build.** OPS-16 A-053 carries "Q3 `ask_the_map`
retirement ruling" as unbuilt v3 work; A-051 carries it as P-92 row R3, still
`not_ready`. `request_records`/`check_request` are a real build gated on P-85 item
4, with the remaining blockers graded "engineering and small" in A-060.
Owner data absent from `get_smart_site` at any depth is a deliberate P-119/A-103
gate, not a gap.

**A-074's "exports are web-only" is superseded.** P-110 landed 2026-09-05 as LDT
#613/#614 and the live `export_instrument` contract describes the two-hop path.
The SDK-metering double-charge A-074 raised is a commercial item this session could
not confirm as ruled.

## What's still open

**Three inferred columns and one candidate**, all operator calls:
`county.entered_roster_at`, `cost.new_columns_added`, `publish.customer_probe_run`,
and whether a `boundary.digitisation_tolerance` column goes in as a sixty-ninth.
Cutting one is a one-line edit plus a re-run; records regenerate and preserve
written cells.

**Rail scope is uninstantiated by refusal.** No authoritative rail roster is
readable from doc_repo (`_catalog/t3_rails_registry_rows_proposed.json` is a
jurisdiction registry, status `proposed-unfrozen`, not rails). The list lives in
hauska-engine `PROPERTY_ENTITY_TYPES`, legacy-design-tools `countyRailDimension.ts`
and the live county-ledger endpoint. 12 columns x 6 counties stay uninstantiated
rather than fabricate the denominator.

**`cost.human_minutes_measured` is unaccounted for all six counties.** SC-3's
unmeasured half. It stays visible rather than estimated, and county seven is where
it gets its first number.

**The contract's own boundary, recorded as a pre-registered falsifier.** Scored
against the eleven blockers of 2026-09-09 before being shown to the operator: nine
caught at preflight, one partial (the zoningSource mirror projecting two of three
states), and one clean miss — the `InspectCard.tsx` render crash, which is
application code no county column can express. Against the six defect classes of
the same night: five caught, one clean miss (county-line digitisation, 13 parcels,
0.8 m).

**Nothing consumes the contract yet.** No preflight query, no derived leaf list, no
schema generation. Deliberate: the perishable half was extracting columns from six
counties of evidence while warm.

**Forward fix for the close corpus, NOT applied.** Lane closes should carry a
`contractCells` block. That is a dispatch-template change for the NEXT dispatch and
was deliberately not applied mid-flight.

## Suggested canonical doc updates

None applied this session. Candidates, for the operator to route:

1. **`MEMORY.md` / `city-roster-has-no-county-link`** — 72 cities for the six CTX
   counties is stale; live read says 69. Correct the memory, keep the fix note.
2. **OPS-16** — an amendment row for the county contract, naming the four-list
   derivation problem it exists to close and the rail-roster refusal. Held pending
   operator routing; this seat did not write to the plan of record.
3. **A new memory** for the trading-spine finding, since it changes what the atom
   contract should carry and is not derivable from either repo alone.
4. **`ask_the_map`** — the retirement ruling is owed and is the operator's, not a
   lane's. Recommendation on record: retire it from the connector catalog and keep
   the capability as a `codeRefs` rail inside `get_smart_site` (P-92 F9).
5. **Session-type vocabulary inconsistency**, flagged not fixed:
   `01_doc_conventions.md` allows `recon | execute | review | planning`; the
   adjacent real files use `execution`. This file follows practice. Recommend
   amending the convention to match rather than editing the files.

`00_current_state.md` deliberately not touched. It is a pointer doc with concurrent
writers and nothing in this session changes the serving snapshot.

## Appendix: the operator's thirteen problems, scored against what shipped

Added at operator request before commit, mapping the session's output back to the
opening ask rather than to what the session found interesting.

The problems, as stated in the opening message and `P:\tmp\smartsite revisit notes.txt`:

1. One-pass onboard: point agents at a county, city or state and have the data be correct first pass.
2. Why so many data discrepancies, and how do we protect against them.
3. Cut a clean path for new counties and cities to be onramped.
4. Messy data.
5. Incomplete processes for authenticating and clearing the data.
6. Agents on different tracks making wrong calls for lack of context; memory capturing ~10 percent.
7. A governing runbook and architecture diagrams, on localhost, so operator and agents read the same thing.
8. Why is the planner the weakest link.
9. How do we fix the seam.
10. What is the verification machine and why is it unique.
11. What is so special about the process that it took this long.
12. How do we curate a dataset so this stops happening.
13. Review everything flagged during the bake process.

Scored: **two answered (10, 11), four made countable (2, 3, 8, 12), six designed and
unbuilt (1, 5, 6, 7, 9, plus the protection half of 2), one not addressed at all (4),
and one SKIPPED (13).**

**The contract currently enforces nothing.** Nothing reads it, no gate refuses on it.
That is `ENFORCEMENT.md`'s governing rule landing on this session's own output. The
difference from the six prose runbooks is that it is data, so a consumer is possible;
that difference is real and is not yet discharged.

**Item 13 was a direct ask and was skipped.** The notes name three open findings the
operator explicitly flagged as not his to close — the ffi/ToUnicode instrument, the
fabricated-zero guard, and cortex-api's `envelope: null` — and the 2026-09-10
third-party review carries an eleven-item leave-behind list with owners in its section
10. Neither was worked. Both are open.

### The OPS-1 collision, which is the most important open decision from this session

Problem 5 is under-served and the reason is a collision nobody declared. There IS a
designed process for authenticating and clearing a source: OPS-2 STAGE 0 (author the
registry row, adversarial review, freeze) reading OPS-1 as the source registry. It fails
not because it is absent but because it is hand-authored per county and does not survive
iteration — the `TXGIO_COUNTIES` finding, where the gate and the loaded-record are the
same field so a loaded county still reports unloaded.

`_catalog/county_contract_v0.json` partially subsumes the registry row without saying so.
Either the contract becomes its superset and OPS-1 / STAGE 0 retire into it, or a fifth
copy of one declaration has just been created. Per the retirement rule in `ENFORCEMENT.md`,
a change that says read from X instead of Y carries a retirement item for Y in the same
card. That item does not exist and is owed.

### Three fixes the session surfaced that were not in the original eight-row stack

**City onboarding is its own motion.** 501 of 777 instantiated cells are city-scope and
472 are unaccounted; 46 of 69 cities carry no zoning layer endpoint. The program is
organised around counties and the actual unit of zoning work is the city. Every wave to
date has been sized in counties, which is why zoning kept surprising. This is a reframe,
not a column.

**Lane closes need a `contractCells` block.** One line in the dispatch template turns
every future close into a contract input. Applies to the next dispatch, never to work in
flight.

**Three atom-contract types are missing** that the trading spine already has:
`ConfidenceBasis`, `OutcomeLabel`, `OutcomeDeclineBasis`. See the ground-truth section
above.

### Recommended next, on discharge-per-hour rather than on design elegance

Problem 6. Put the county record and its declared seams into the dispatch and scope the
preamble by program, so a factory lane stops reading 2026-08-17 SmartCity Dashboards
rulings. It is a `scripts/dispatch.mjs` change, touches nothing in flight, is measurable
the day it ships, and it attacks the complaint the operator actually opened with. The
preflight, the census and the console are all cold-buildable and none of them needed six
counties of warm evidence, so the sequencing argument that put the contract first is now
discharged.
