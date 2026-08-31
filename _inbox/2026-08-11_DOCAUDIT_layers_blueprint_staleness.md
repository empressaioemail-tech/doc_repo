---
id: 2026-08-11_DOCAUDIT_layers_blueprint_staleness
title: DOC AUDIT — the five layers, the blueprint, staleness, atoms, and the launch gate
date: 2026-08-11
status: audit artifact (read-only pass; no canonical doc was edited)
owner: planner
machine_artifact: _inbox/2026-08-11_DOCAUDIT_layers_blueprint_staleness.json
---

# Doc audit — 2026-08-11

Read-only pass. Nothing was edited, nothing was committed. This enumerates what is stale and what the truth is. The machine-checkable version is the sibling JSON.

## THE HEADLINE FINDING

**There is no single coherent definition of done for this launch.** Five documents each hold a piece, none of them agree on the denominator, and the one that comes closest is not gradable. That is the most useful thing in this audit and everything else is downstream of it.

The second headline: **the geometry scorer has applied and the read-first doc does not know.** `_STATE.md` line 7 says the ledger reads 0.7689 percent and "the scorer is RUNNING and has not applied yet." Live at 2026-08-11T14:51Z it reads **4.914570002277076 percent, 142 satisfied cells of 3,556**. The number moved 6.4x. Every handoff and dispatch generated off `_STATE.md` since the apply carries the pre-apply figure.

Worth noting how that was caught: the per-rail breakdown supplied to this audit matched live exactly (geometry 141 satisfied / 113 not-yet; zoning 19 / 235) while the summary rollup did not. The cells were re-scored and read fresh; the summary was carried forward from prose. Two numbers that should agree and didn't.

## CONVENTION APPLIED TO STALENESS

Only present-tense state assertions are flagged. `_sessions/*` files and explicitly date-scoped paragraphs are historical records and were left alone — a session log correctly records what was true when written. `_STATE.md`'s section headed **LIVE NUMBERS** is flagged, because that heading is an unambiguous present-tense claim. Decision records are treated as rulings: their reasoning-as-of-date is historical, but a criterion stated in the imperative ("the gate is X") is present-tense and is flagged.

## 1. THE FIVE LAYERS

First correction: **it is six layers, L0 through L5**, per `_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md`. L5 (jurisdiction backfill — zoning, setbacks, code text) is where the moat lives and the five-layer framing drops it. The decision record defines the sequence; the live status table is maintained in `_STATE.md` lines 173-180, not in the decision.

| Layer | Decision doc claims | Truth | Agrees |
|---|---|---|---|
| L0 seam reconciliation | do first, nearly free | deferred to read time by later ruling; tile bucketing IS the spatial index | no |
| L1 city + county boundaries | absent entirely | **DONE, LIVE** — 1,222 city + 254 county polygons | no |
| L2 parcel geometry | 19 of 254 loaded | 196 of 254 acquired; 195 carry parcel-node atoms; **141 of 254 score satisfied** | no |
| L3 roads statewide | 7 hand-authored city scripts, needs statewide pass | still true — no statewide ingest, eng #293 DO-NOT-MERGE, six unblockers open | yes |
| L4 federal/state uniform | adapters exist, nothing persisted | **split**: NFHL loaded (198,178 rows); SSURGO no working bulk URL; topo AOI-scoped | no |
| L5 jurisdiction backfill | the moat, per-jurisdiction cost | barely started — zoning 19 of 254; F2 corpus blocked on an uncommitted scraper branch | yes |

**The L4 distinction that matters and that the docs blur:** NFHL data loaded does not mean the flood rail is satisfied. The flood rail has `hasWriter=true` and `atomFamilyState=present` and still reads `not-yet` on all 254 cells, because `flood-hazard-fact` has never been run statewide. This is exactly the OPS-7 "DATA LOADED vs SERVED TO PRODUCT" gap, and the launch gate itself falls into it (see GATE-R5).

### Where the current push contradicts a prior ruling

**The denominator.** `_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md` line 73 states present-tense that the manifest denominator is "twelve rails ... across 254 counties." The R1 rail split was ruled 2026-08-09 and applied to production 2026-08-10, taking it to 14 rails and 3,556 cells. The layer-first decision was never amended.

**Three rail counts in one folder.** `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md` is titled and reasoned around thirteen rails ("all thirteen rails are REQUIRED"). Layer-first says twelve. The split made it fourteen. Nothing links them. A fresh agent has no way to tell which governs without reading `_STATE.md`.

**The heavy-scan slot.** Layer-first lists it as unresolved in its Open items. OPS-14 open decision 5 RULED it on 2026-08-09: one write slot per database, reads unrestricted, handoff via `_STATE.md`. The layer-first doc still presents it as open.

**The cost commitment.** Layer-first flags sub-200-dollars as unverified with one measured overrun. The launch-gate decision re-bases it onto depth work. OPS-11 carries it UNENFORCED. No doc reconciles the three into a current posture.

## 2. THE BLUEPRINT

**`90_operations/OPS-14_texas_flush_game_plan.md` is the blueprint of record and should be named canonical.** It is the only doc holding the gate, workstreams, factory structure, concurrency doctrine, parallelism map and dispatch model in one place, and it carries an adversarial-review stamp. But it is not a WDLL — it has no gradable done-card. It explicitly says "the gate is settled, do not relitigate here" and points at the decision record.

### The five competitors and why each falls short

| Doc | Holds | Why it is not the blueprint |
|---|---|---|
| `_decisions/2026-08-09_texas_flush_launch_gate.md` | the criteria | arithmetic one day out of date; five of six criteria not gradable as written |
| `90_operations/OPS-14_texas_flush_game_plan.md` | the program shape | **best candidate**; no gradable done-card |
| `90_operations/OPS-WDLL_the_factory.md` | a real done/broken/kill WDLL | scoped to the FACTORY at the JURISDICTION grain; written 2026-08-03 pre-pivot; status still says "Bastrop city, mid-warm". Answers "is one county done", never "is Texas done" |
| `_inbox/2026-08-09_W1_writers_program_WDLL.md` | 15 gradable acceptance items | **the only properly-shaped WDLL in the program**; one workstream only; wrong rail count; every grade box empty |
| `_STATE.md` | live state; the only doc agents actually read | unratified; CLAUDE.md does not mention it; its own LIVE NUMBERS section is wrong |

**Recommendation:** make OPS-14 canonical and give it the one thing it lacks — a DEFINITION OF DONE section restating the six amended gate criteria as gradable rows in the W1 WDLL's shape (claim | instrument | live reading | grade), each naming the query or endpoint that grades it. That single addition would make the launch gate readable in one place for the first time.

### OPS-14 stale claims

| Line | Claim | Truth | Sev |
|---|---|---|---|
| 20 | rail classification table enumerates TWELVE rails, rrc as one row, no rail-corridor | 14 live rails; the table cannot be applied to the live grid without a mapping the doc does not give | high |
| 40 | W1 "BUILD the missing writers (roads/frontage, footprints, easements, owner, RRC, MUD)" | four of six are BUILT and merged on engine origin/main; the bottleneck moved from build to apply | high |
| 73 | `@empressaio/atom-contract`, 1.15.0 at writing | **1.19.0** | med |
| 96 | "the parcel-node sweep (running)" as the active atoms lane | sweep COMPLETE 132/132; the atoms bulk-writer slot is FREE | high |
| 111 | pricing ladder of record Free/$20/$40/$75 | **superseded 2026-08-10** by the locked ladder (Free $0 / Solo $49 / Studio $129 / Team $299-for-10 / unlock $15-for-30-days); `_STATE.md` says the old figures "must not be quoted" | high |
| 128 | cleanup item 1: ratify `_STATE.md` or regenerate `00_current_state.md` | **still open, and now worse** — see the structural gap below | high |

## 3. STALENESS SWEEP

Grouped by class. Full line-level detail in the JSON.

### (a) Factually wrong present-tense claims — fix these

| Doc | Line | Stale | True |
|---|---|---|---|
| `_STATE.md` | 7 | 0.7689%, 89 satisfied, scorer not applied | **4.9146%, 142 satisfied, applied** |
| `_STATE.md` | 11 | "all 12 rails with writers" | 14 rails (file contradicts its own lines 108 and 126) |
| `_STATE.md` | 157 | 0.897%, 89 of 3,048 | 4.9146%, 142 of 3,556 |
| `_STATE.md` | 186 | LIVE NUMBERS: 0.0395%, 12 rails, 3,048 cells, no-atom 1524 / no-writer 1016 / not-yet 489 / satisfied-present 19 | 4.9146%, 14 rails, 3,556 cells, no-atom 1016 / no-writer 762 / not-yet 1618 / satisfied-present 160 |
| `_STATE.md` | 190 | contract 1.14.0; engine registers 7 property types | contract **1.19.0**; engine registers **14** |
| launch gate | 22 | 12 rails / 3,048 cells | 14 / 3,556 |
| launch gate | 34 | 8 of 12 rails cannot produce a satisfied cell | 7 of 14 |
| layer-first | 30 | 19 of 254 counties with geometry | 196 acquired / 141 scored satisfied |
| layer-first | 44 | L1 "absent entirely" | DONE, 1,222 + 254 polygons |
| layer-first | 73 | twelve rails | 14 |
| county-shape-13 | 14, 58 | thirteen rails required / remaining twelve | 14 / remaining 13 |
| OPS-13 | 153, 155, 174 | twelve declared rails; four with a writer; 3,048 cells; ceiling near one third | fourteen rails; **seven** with a writer; 3,556 cells; ceiling near one half |
| OPS-14 | 73, 111 | contract 1.15.0; retired pricing ladder | 1.19.0; locked ladder |
| W1 WDLL | 9, 26 | 12 rails in the done-statement and acceptance item 14 | 14 |
| OPS-15 | 191 | R1 and R4 presented as rulings owed | R1 RULED YES and LIVE 2026-08-10; R4 resolved structurally in the contract schema |
| `25_atom_architecture_reference.md` | 3, 24, 811 | `@hauska/atom-contract`; staged as `@workspace/empressa-atom`; "planned v1.0.0" | `@empressaio/atom-contract`; migration completed 2026-05-22; published 1.19.0 with 11 subpaths |

### (b) Stale but harmless

`90_operations/OPS-7_coverage_and_honesty_doctrine.md` lines 32-34 carry a date-stamped worked example (12 rails, 3,048 cells, 0.2134 percent, 79 counties / 796,046 atoms). It is arguably historical. It is flagged anyway because it is the *worked example inside the doctrine doc agents read to learn how to quote numbers* — a stale example teaches a stale number. The rule itself is correct and load-bearing. Best fix: genericize to placeholders so it stops rotting.

`_catalog/atoms_index.md` is 76 days stale on fleet and sprint rows. Not wrong about the property spine — it never claimed to cover it.

CLAUDE.md's dated "Substrate v1 status as of 2026-05-19" and "Ground-truth reconciliation 2026-06-06" paragraphs are explicitly date-scoped and the doc itself instructs readers to trace counts to live state. **Not flagged for correction** under the stated convention — but OPS-14 cleanup item 2 (move them to a historical record; CLAUDE.md keeps rules and pointers) is still the right fix.

### (c) Structural gaps — no doc covers these

**The read-first doc is the wrong doc.** CLAUDE.md names `00_current_state.md` as read-first. It was touched 2026-08-10 so it *looks* current, and it contains nothing about the launch gate, the rail split, the sweep, the ledger, or the layer-first sequence. `_STATE.md` is the de facto read-first doc for this program, says so in its own first line, and CLAUDE.md does not mention it. An agent following the prescribed reading order gets a doc that is fresh, accurate, and about a completely different program. **That is worse than a stale doc, because staleness is detectable by date and this is not.**

**Nothing enumerates the registered property atom families.** `PROPERTY_ENTITY_TYPES` has 14 members on engine origin/main and no canonical doc lists them.

**Nothing states the built-but-unapplied condition as a program state.** Five rails are merged with zero coverage. OPS-14 still describes them as unbuilt. `_STATE.md` line 100 names it in passing ("we are building faster than we can apply") but no doc treats it as the program's current bottleneck, which it is.

## 4. ATOMS ALIGNMENT

**Aligned and confirmed:**

- `accessPolicy` is the five-value union in published 1.19.0 (`dist/registration.d.ts:48`): `public-free | public-paid | platform-internal | tenant-private | tenant-shared`. Matches CLAUDE.md and `01a_atom_conventions.md` exactly.
- `ATOM_CONFORMANCE_TARGET_VERSION` is literally `"1.5.0"` in the published tarball. Both atom docs are correct to say 1.5.0.
- `owner-fact` privacy posture is **structural, not documentary**: `dist/property/owner-fact.js:53-57` rejects any policy other than `public-paid`. `parcel-node` symmetrically pins `public-free`. `_STATE.md` line 140's claim is independently confirmed.

**Mismatches:**

1. **Package name.** `25_atom_architecture_reference.md` is `status: active`, titled `@hauska/atom-contract`, and uses the retired name in 12+ places including the package-surface spec. CLAUDE.md says that name "appears in historical records only" — this doc is not a historical record, it is the named authority.

2. **Two conformance targets are undocumented.** The contract also declares `REASONING_CONFORMANCE_TARGET_VERSION = "1.8.0"` and `PROPERTY_CONFORMANCE_TARGET_VERSION = "1.15.0"`. **The property target is the one that governs the county rails** and no canonical doc mentions it. An agent told "the conformance target is 1.5.0" validates property atoms against the wrong target.

3. **`road-node` is published, paid for, and unregistered.** Contract 1.19.0 ships a complete `road-node` family — schema, classification enum, ROW provenance, attach points — exported from `./property`. The engine's `PROPERTY_ENTITY_TYPES` does **not** include it. The roads rail is `no-writer` on 254/254 and is the largest uniform gap after geometry. Whatever the roads *ingest* problem is, the atom shape is not part of it, and no doc records that it already exists.

4. **The rail declaration contradicts the contract.** ldt `origin/main` declares `atomFamilyState: "missing"` for `rrc-wells`, `rrc-pipelines`, `rail-corridor` and `mud`. Contract 1.19.0 publishes `well-fact`, `rail-corridor-fact` and `special-district-fact`, and the engine registers all three. **Three of those four declarations are false**, so up to 762 cells render `no-atom` when the family exists — the console tells the operator work is unstarted when it is built-but-unapplied. Given that honest absence is the product, a ledger under-reporting its own state is the same defect class as one over-reporting. Only `rrc-pipelines` is genuinely missing.

5. Cosmetic: the doc-comment above `PropertyEntityType` says "All eleven" against a fourteen-member union.

## 5. LAUNCH GATE RECONCILIATION

### The criteria exactly as ruled

1. L2 parcel geometry at 254 of 254 counties, with the coastal-short and Donley exceptions resolved or ruled honestly absent.
2. Statewide-uniform layers live: roads, NFHL flood (done 2026-08-09), building footprints (ML-derived default per ADR-029).
3. All 12 rails have writers, so every one of the 3,048 ledger cells resolves to data or disclosed honest absence with provenance. No cell left in `no-writer`.
4. Cert frame reconciled to the Geometry Law (cert lane grades the raw txgio ring; block13 fixture re-dumped; certs re-earned in the true frame).
5. 76j capacity items done: rate-limit store, load test, capacity doc, domain and branding.

Per-rail refinement, same day: statewide-uniform rails must reach satisfied everywhere with no `not-yet` left; jurisdiction-depth rails gate on writer-live plus honestly displayed `not-yet` everywhere, with satisfied required in the launch-footprint counties.

### Distance to satisfied, measured against the live ledger

| # | State | Distance |
|---|---|---|
| 1 | NOT MET | 196 of 254 acquired (58 absent); geometry rail satisfied at **141/254** (113 short). Of the 113, **54 already carry nonzero coverage below the 95 threshold** — threshold misses, not absent data; 59 carry zero. Named exceptions open: 8 coastal short counties, Bosque re-run, Donley 404 |
| 2 | **1 of 3** | NFHL loaded but flood rail `not-yet` 254/254 (writer never run statewide). Roads: zero ingest, #293 CI FAILURE + DO-NOT-MERGE, six unblockers open. Footprints: writer unbuilt, `no-writer` 254/254 |
| 3 | NOT MET **and mis-specified** | 762 cells `no-writer` (roads, footprint, easement). A further **1,016 `no-atom`** (rrc-wells, rrc-pipelines, rail-corridor, mud) — a state the criterion never names. **1,778 of 3,556 cells, exactly half the grid**, cannot resolve to a provenanced answer. Denominator also off by 508 |
| 4 | NOT MET | cert-frame reconciliation is W3 off cleanup B2; no re-earn close artifact found. The county-extent instrument (OPS-12's top missing instrument, a named dependency of the L2 finish waves) is not wired |
| 5 | PARTIAL | 76j Workstream A shipped 2026-08-05 with a residual operator E2E. Rate-limit store: MCP Upstash db **dead**, memory fallback active. Load test / capacity doc: no artifact found. **Branding FAILING** — Stripe reads "Hauska Pro" |
| uniform | NOT MET | **1,891 of 2,032 cells short.** geometry 141/254; roads, flood, footprint, rrc-wells, rrc-pipelines, mud, rail-corridor all **0/254** |
| depth | NOT MET | **149 of 168 footprint cells short.** zoning **19/28** (best placed, gap 9); cad, owner, envelope, landuse, easement all 0/28. Five of six depth rails are writer-live; easement alone is `no-writer` |

### Rulings owed — these block grading the program

**GATE-R1 (high) — the denominator is wrong in the gate itself.** Criterion 3 says 12 rails / 3,048 cells. The split was ruled the *day after* the gate and applied the day after that: 14 / 3,556. **OPS-15 line 187 predicted this in writing**: "Adding rails immediately before a launch gate defined as all rails with writers makes the gate harder by definition." The warning was recorded, the split ruled correctly for honesty, and the gate never amended. Lesson worth keeping: a gate expressed as a *count* of a dimension still being edited will rot; express it over the dimension ("every rail in `county_rail`"), never its cardinality.

**GATE-R2 (high) — the `no-atom` state is unaddressed.** Criterion 3 says "no cell left in `no-writer`" and never mentions `no-atom`, where 1,016 cells sit. Read literally, a rail could satisfy the gate by having no atom family at all, because a cell with no family never reaches `no-writer`. Restate over the union, or exempt the four rails explicitly.

**GATE-R3 (high) — the owner rail ceiling.** The operator's suspicion, checked. `owner` is classified jurisdiction-depth (ratified as OPS-14 decision 4), so under the per-rail split it owes satisfied in the 28 footprint counties, not 254 — that resolves the *literal* impossibility. **But the underlying ceiling is real and unresolved:** `cad_property` holds owner data for 15 counties. This audit did not establish how many of the 28 footprint counties are among those 15; if fewer than 28, the depth gate is *also* unsatisfiable without new CAD acquisition. Enumerate the overlap, then either fund the gap or rule the shortfall honest-absence-satisfied. **OPS-15 R3 asked exactly this question and it was never answered.**

**GATE-R4 (high) — "statewide-uniform" is asserted for rails whose data is not uniform.** Four uniform-classed rails are `no-atom` on all 254: rrc-wells, rrc-pipelines, rail-corridor, mud. Wells and pipelines exist only where oil and gas exists; rail corridors only where track exists; MUDs only where districts were created. "Satisfied everywhere, no `not-yet` left" therefore means minting roughly **1,016 honest-absence atoms** — real engineering producing zero customer-visible data. Confirm that is intended launch-gate work, or reclassify the four as post-launch.

**GATE-R5 (high) — criterion 2 conflates DATA LOADED with RAIL SATISFIED.** It marks NFHL "done" because the table loaded; the flood rail reads `not-yet` on all 254. By OPS-7's own three-states rule, criterion 2 grades state 2 while the per-rail refinement grades state 3. **The gate marks as met something its own named instrument says is unmet.** Restate criterion 2 against the ledger.

**GATE-R6 (med) — no criterion names the headline number.** The gate is defined entirely on cell states, deliberately, so honest absence counts. Coherent. But it means `texasCompletenessPct` — the console number, the number every session log leads with, the number that just moved 6.4x — has **no role in the gate**. State explicitly that it is a progress instrument and not a gate criterion, so nobody mistakes 4.9 percent for distance-to-launch.

## 6. PRIORITIZED DOC EDITS

**Priority 1 — do these first**

1. `_STATE.md` lines 7, 11, 100, 157, 186, 190 — correct to live values. Line 7 is the first thing every agent reads and it says the scorer has not applied when it has.
2. `_decisions/2026-08-09_texas_flush_launch_gate.md` — add a dated AMENDMENT (do not rewrite a decision record): 14 rails / 3,556 cells; extend criterion 3 over `no-atom`; restate criterion 2 against the ledger; record GATE-R1 through R6 as owed.
3. `90_operations/OPS-14_texas_flush_game_plan.md` — v3. Rebuild the rail table on the 14 live keys; move the four merged writers into a new "BUILT, ZERO COVERAGE, AWAITING APPLY" state; retire the "sweep running" concurrency premise; contract 1.19.0; locked pricing ladder; **add the gradable DEFINITION OF DONE section**.

**Priority 2**

4. `90_operations/OPS-13_store_topology.md` — replace the twelve-row rail table with the live fourteen; four writers to seven; ceiling one third to one half; flag the `atomFamilyState` contradiction.
5. `_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md` — dated amendment for L0/L1/L2, the denominator, and the now-ruled heavy-scan slot. **The layer sequence itself is sound and needs no change** — only the ground-truth table.
6. `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md` — supersede note. Cheapest of the three rail-count fixes.
7. `25_atom_architecture_reference.md` — rename to `@empressaio/atom-contract`; retire the staging claim; publish the real 1.19.0 surface; add the reasoning and property conformance targets; list the 14 property entity types.
8. `CLAUDE.md` — add `_STATE.md` to Read first and say which governs which program. This is OPS-14 cleanup item 1, still open, and it is why an agent can read the whole prescribed list and never learn the Texas flush exists.

**Priority 3**

9. `90_operations/OPS-7_coverage_and_honesty_doctrine.md` — genericize the worked example to placeholders.
10. `_inbox/2026-08-09_W1_writers_program_WDLL.md` — 12 to 14; **grade items 1 and 2 as met**. It is a frozen card with an amendments section built for this, and every box is still empty.
11. `90_operations/OPS-15_owner_and_rrc_rail_gap_analysis.md` — flip the status off PARKED; R1 ruled and live, R4 resolved structurally; R2 and R3 genuinely open (R3 is now GATE-R3).

**Priority 4 — routed out of doc_repo**

12. hauska-engine `packages/atoms/src/property-instances.ts` — the "All eleven" comment against a fourteen-member union.

## 7. ADVERSARIAL NOTES

**Two stale ldt checkouts still declare 12 rails.** `P:/legacy-design-tools` is 19 commits behind `origin/main`. Six ldt checkouts exist on this machine. Any agent dispatched against a stale tree reads a 12-rail declaration and produces work against the wrong denominator — which is plausibly how several of the stale numbers in these docs were generated. The stale-clone rewind trap in its rail-count costume.

**The one external-facing risk is filed in a lane labelled "do not stop for these."** Q11 is "batched by design" and contains G1: the Stripe product reads "Hauska Pro". Hauska is substrate-only; the product brand is Smart Site. Launch-gate criterion 5 explicitly includes branding. A hard gate is sitting inside a batch whose label instructs agents to defer it. The finish-line handoff flags this correctly; the register it lives in does not.

**The blueprint's own cleanup lane found the worst doc problem two days ago and it is still open.** OPS-14 item 1. See the structural gap in section 3(c).
