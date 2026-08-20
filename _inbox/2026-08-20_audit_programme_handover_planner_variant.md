# Audit Programme Handover — Analyst Seat

## Snapshot

**I hold no repositories and have run no git command.** Every SHA, count and file path below arrived in this conversation as a pasted seat return. I have re-checked none of them and cannot. Where a figure is a seat's report, it inherits that seat's confidence and its errors.

The seats that produced them: property, markets, systems, and the cockpit/trading seat. Their own returns carry their snapshots and those are the authoritative ones.

**What I am.** The analyst seat. I wrote the reference architecture and the diagnostic battery, adjudicated seat findings, wrote the doctrine, and dispatched the seats. I did not write code, run a query, or commit anything.

**Trees not re-checked since last read: all of them.** This is a transcript-derived document and it is the fourth instance of the class the estate's own decision names. It is being filed for exactly that reason.

---

## 1. ORIGIN

**The premise in the dispatch is subtly wrong and it will propagate if not corrected.**

The dispatch reads as friction *between* two applications. That is not what was described to me at the outset.

The operator's words, at the open: two instances of the same thesis, one in stock market data, one in property data, both independent. Friction in the pipeline of data sourcing and ingestion. The machine-readable process was solved; getting data organised, stored and fed into applications consistently was not.

**Two separate pipelines with the same disease. Not a shared store, not two writers, not divergent schemas across a boundary.**

- **Empressa Trading / markets substrate.** Repos `smart-markets` and `empressa-trading`. Stores: a Postgres atoms store on Neon, `ohlcv_bars`, `atom_outcomes` as the calibration ledger.
- **SmartSite / property substrate.** Repos `hauska-map`, `hauska-engine`, `legacy-design-tools`. Store: `atoms` and `document_ingest_atoms` on `hauska_mcp` at `cortex-prod`, which is a different database from `neondb` on the same host.

**What was in friction, as stated:** not any of the options listed in the dispatch. The stated friction was that each pipeline had been rebuilt per source rather than implemented once, so every new source negotiated its own path from raw bytes to atom.

**The refinement I was heading toward before the audit expanded.** A four-layer spine — acquisition, landing, canonicalisation, serving — with one source adapter contract every source implements, three-tier entity resolution ending in provisional nodes rather than guesses, and reconciliation by typed edge rather than overwrite. That is document 51.

**Is it still the right target?** Yes, and the audit changed the ordering rather than the target.

The architecture assumed a boundary that turned out not to exist. Write-time binding validation is absent at every layer in both substrates, confirmed against the live store: no primary key, unique constraint, foreign key or check on `entity_id` in either `atoms` or `document_ingest_atoms`, and no application-layer validation either. The store accepts any non-null string.

So the adapter contract sits downstream of a door that does not close. Build the boundary first, then the layering. That is the one change the audit makes to the original plan.

---

## 2. WHAT THE AUDIT PROGRAMME ACTUALLY IS

**In scope.** The write, resolution and scoring paths of both substrates. Every validity check in them, what each admits, and whether a second derivation exists to make it meaningful.

**Explicitly out.** The atom field contract itself, the edge type taxonomy, temporal validity semantics, the adaptive UI layer, calibration loop mechanics beyond the resolution feedback path, and per-source licensing as commercial instruments.

**Exit condition: none was ever declared, and that is my failure.** I never wrote one. Each return found something real and each finding generated the next dispatch. The programme was open-ended by omission rather than by design, and it ran until the operator stopped it. A new planner should treat the absence of an exit condition as the single most important process defect in this programme, above anything in the substrates.

**Lane and card IDs.**

Tests I defined, all in document 51:

| ID | What it is | Status |
|---|---|---|
| T-24 | Inert mechanism audit — dormant, starved, and starvation by environment | Partial. Markets ran it, found three dormant and one starved. Property has not run it. |
| T-25 | Admissibility enumeration — every check, its cheapest satisfier, its derivation state | Partial on both. See section 3. |
| T-26 | Test as lock — tests asserting values no authority recognises | Partial. Three confirmed instances across both substrates. |
| T-27 | Scorer contract — can an instrument emit with a required input missing | Property: fail, confirmed. Markets: absent, no completeness instrument exists. |
| T-20 | Write-time binding validation | Complete as a finding. Absent at every layer, both substrates, confirmed against live stores. |
| T-08 | Orphan census, stratified by atom class | Not started. Held behind T-25 on both substrates. |
| T-01 to T-23 | The wider battery | Property ran the code-reading block partially. Markets did not run it as such. |

**TW-xx** are markets lane rows: TW-63, 64, 66, 67, 68, 69, 70, 72, 73, 74 merged. A later markets pass reports thirteen lanes and fourteen merged rows with different identifiers.

**MP fan A1-A4 / B5-B7 / C10 / C12: DO NOT KNOW.** Those are property's internal fan identifiers, created after I dispatched the seat with fan-out authority. I never saw their definitions. Only the property seat's own artifacts can enumerate them. **What would settle it:** the property seat's close artifacts under `_inbox/`.

---

## 3. DID T-25 FINISH

**No. Neither substrate. Not close on property.**

**What it set out to enumerate.** Every validity check in the write, resolution and scoring paths of both substrates, with five columns per row: location, predicate, cheapest satisfier, whether that value is semantically valid, and which of four derivation states applies.

**The denominator does not exist, and this matters more than the counts.** T-25 has no total. It enumerates checks that were found; it has no measure of checks that exist. There was never a denominator and no seat ever claimed one.

**Worse, and stated in document 51 as a known structural blind spot:** T-25 enumerates checks that exist and asks what they admit. A check that does not exist has no row. So the method finds weak checks by construction and finds *missing* checks only when a reader happens to notice an absence. Three of the largest findings in the estate — the unguarded append boundary, the missing database constraint, a geocode query with no country filter — surfaced because a seat remarked on them, not because the enumeration reached them.

**Property counts,** from the seat's own position statements:

- 48 distinct verified checks at the eighth position statement, plus W-29 and W-30 filed later. Call it ~50.
- Three hold. Only one of those carries a second derivation. The other two refuse rather than default but cannot evidence a source is right. **Quoting "three hold" flat overstates two of them.**
- Rows 1–30 are marked provisional by default, not by finding: the seat that inherited them did not audit the prior seat's method on input types and refused to imply it had.
- Four rows remained provisional against schemas nobody had opened.
- Two rows flagged, not filed: W-12 (resolved later) and S-21.

**Markets counts,** from the final report:

- 185 rows classified, zero genuinely absent.
- **513 was not one number.** It summed two predicates. Corrected replacement is 321–427.
- **The scope finding outranks the count:** the file list reached 16.7% of the predicate's tree-wide reach. So the corrected range is itself over a fraction of the tree.

**The 44-row handover set.** CLAIM, and I cannot verify it. The markets final report describes thirteen lanes and 185 rows classified, which suggests the 44 were worked, but it does not say so in those terms and does not map lane output back onto the handover's row identifiers. **What would settle it:** compare `_sessions/2026-08-20_t25_enumeration_handover.md` row identifiers against the 185 classified rows in commit `d38067cf`.

**The "also remaining, not started" items:**

- **54 can-fabricate rows.** Traced to module level, not classified to derivation state. Then a later pass split them further: ~26 genuinely can-fabricate, 14 definitional and not defects, 5 refusals, 58 immune by categorical score. Whether the ~26 were classified afterward: **DO NOT KNOW.**
- **Dead-guard diagnostic.** Markets reports a dead-guard scan landed at `10dc0a71`. Scope unknown to me. **CLAIM.**
- **Seasonality question.** The trace established `fetch_daily` → `history.py:44` → `daily_closes` → seasonality, with `history.py` guarding `time` and never `close`. Whether seasonality output reaches a registered claim: **never established. Open.**
- **IV surface path.** **DO NOT KNOW.** Never surfaced in anything I received.

**packages/retrieval, S-25 through S-182.** Property's seat reported it untouched and unskimmed, zero rows, repeatedly and in identical wording eight times. The C12 finding that the list was never filed: **DO NOT KNOW**, that identifier never reached me. If a 157-row list existed and was never filed, that is a fourth instance of the exists-nowhere-durable class and it is the most likely place for the largest remaining unenumerated surface.

**Unfinished and not in either named document, that I know of:**

- The field-driven inversion. For each field carrying a claim, what validates it, with "nothing" as a valid row. This closes T-25's blind spot and was scoped separately and never started.
- Instrument audits. Markets' AST instrument had one audit which found one false-positive class; other shapes in the same family are unaudited. Property's graph walker has never been audited.
- T-08 on both substrates.
- The per-family key grammar. Property established there is no `parcel-node` table and that an unresolved-binding query cannot size orphaning without a per-family key grammar that does not exist. **That grammar is the prerequisite for the binding constraint and it is not scoped anywhere.**

---

## 4. THE OPEN WORK RIGHT NOW

**I cannot answer this section.** I hold no worktree, have run no `git status`, and have no visibility into any seat's uncommitted diff.

**What I know secondhand, all CLAIM:**

- The systems audit reported staged count 0 across doc_repo and every seat worktree, so no seat's index entry can be swept.
- It reported 2,098 untracked files on the integration checkout `P:/doc_repo`, invisible from seat worktrees.
- It reported `legacy-design-tools` primary checkout at 63 dirty on `feat/s1-instrument-hardening`, and `hauska-engine` detached HEAD with 5 dirty.
- It reported two worktrees not in the seat register: `parcel-terrain-model-4c7a9e2f` and `doc-repo-l23-gate-grade`.
- The markets seat reported nine lanes run concurrently on one machine, which corrupted at least two lanes' test measurements.
- A dangling commit `f65ffc1c` in `empressa-trading` holds ten scratch files from a reset `add -A`, recoverable only from that object.

**Where losing a worktree loses work: DO NOT KNOW, and this is the most dangerous gap in this document.** The supervision note in the dispatch that produced this handover is correct that a stopped worker's uncommitted diff may be the only copy. I have no way to enumerate those. **What would settle it:** each seat running `git status` and `git diff` in its own worktree and filing the output, which is what the supervision note instructs.

---

## 5. WHAT BEARS ON SMARTSITE + TEXAS COMPLETE

### Defects that make a launched product report wrong numbers to a paying customer

This is the category the dispatch correctly separates and it is the largest one.

**The geometry coverage ledger.** 254 rows — one per Texas county, confirmed by query, correcting the 253 everyone including me repeated for weeks — produced by `B2_cp2_geometry_scorer_apply.mjs`, which was never committed to any of the four repositories. Zero commits add it, zero touch it, across all refs, and it was not in the branch bundle either. Its counting rule survives only inside a string parsed by a verify script. **Every geometry coverage figure in the ledger is unreproducible and unauditable.** `registry.ts` asserted the denominator was reconstructible from checked-in source, which is false and is why nobody looked.

**Scorer key orphaning.** `land-use` (19 rows) and `landuse` (254 rows) both live. 19 rows are stranded right now.

**Collapsed states across the scoring path.** `honestCoveragePct: 0` with `source: null` on six rails across all 254 counties — a scored zero indistinguishable from never measured. `hasWriter: true` on 3,556 of 3,556 cells, hand-declared. `maxCountiesReachable: 1` on `rrc-wells` contradicting its own `sourceBasis`, true reach 254. `areaShare: 0` asserting none of a parcel lies in a zone the same record lists.

**Address coverage.** Situs reports 99.3% populated; real street coverage is 89.90% of 13,071,975. 1,248,412 parcels count as populated with no street, because `", ,"` and `", TX 78660"` pass a non-null test. Gillespie stores road references in the city column, which passes non-null, non-blank and alphanumeric.

**Flood determinations.** 37,331 disagreements across 533,867 comparisons between stores. **36,723 of those are one store naming a hazard zone while the other says outside it** — in or out of a Special Flood Hazard Area, not a subtype quibble. The AO/AE framing everyone including me repeated accounts for 129. The atom's own hazard flag fails open: an equality test against three literals returns `false` for anything else, including a schema change, and `false` is a valid boolean that no schema catches.

### Defects that block the market launch

**Write-time binding validation, absent at every layer.** The store accepts any non-null string as a binding, provided the `(entity_type, entity_id)` pair is unused. Nothing anywhere asks whether a binding resolves to a node. This blocks because every coverage number, every parcel read and every atom count sits on bindings nothing validated.

**The append path drops silently.** A malformed candidate returns null rather than raising, so it leaves no error and no record. **The atom count itself cannot be reconciled** — there is no way to compare atoms attempted against atoms written, so every denominator in the estate silently excludes its own failures.

**Texas is not complete and the number is now known.** 4,354,603 parcels statewide have no geometry — 26.5%. That is the unmeasurable population before anything is stamped. "Texas complete" needs defining against that number before it can be claimed.

### Defects that are real and can wait

- The tier2 retirement. The live exposure was closed in production; what remains is the writer and readers, which produce no customer-facing wrong answer while unread.
- Stage 2 required checks. Everything still runs and reports; nothing blocks. It is the largest enforcement gain available and it blocks no launch.
- The T-25 remainder and `packages/retrieval`. A map for later.
- Markets entirely. It is a different product and shares no store with SmartSite.

### The flood corpus apply chain

**Beside the critical path, and its gate is on it.**

Stamping 254 counties is a corpus operation that can run after launch. What sits on the path is narrower: the fail-open hazard flag, and the consumer repoint so a reader sees a determination only where containment is verified. Without those, SmartSite serves hazard determinations it cannot stand behind.

**One correction to the B5/B6/B7 plan.** Bastrop has 5 multi-part parcels of 74,729. A Bastrop-only gate would almost entirely miss the multi-part failure mode, where a centroid answers for one fragment of a parcel with no statement that the others exist. **The gate needs a second, high-multi-part county or it does not test what it was built to test.**

The 229 Bastrop gate is sound for the concave-parcel mode: 229 of 5,750 carry a query point outside their own parcel, median 15.3m out, 40 flipping hazard class. **First-write-wins ring store convention: DO NOT KNOW.** Never reached me.

### Two-application friction not written down anywhere

**There was never any.** The two applications share no store, no writer and no schema. The friction was within each pipeline independently.

That is not written down anywhere and it is load-bearing, because a planner told "friction across two applications" will look for an integration problem that does not exist and may build a reconciliation layer between two systems that were never connected.

---

## 6. WHAT I WOULD DO NEXT AND WHAT I WOULD STOP

### The next three, in order

**One. Fix the universe mass-delist, today.** `app/universe/sync.py` set every symbol outside the macro roots inactive and closed its alias eras from a single vendor outage, and returned `available: True`. A durable destructive mutation from a fabricated empty, reported as success. It is markets rather than SmartSite, but it is a live irreversible write and it outranks scheduling. Also establish whether it has already fired.

**Two. The flood serving gate.** Fix the fail-open hazard flag as a parsed enum where an unrecognised value raises. Repoint consumers to read the containment stamp rather than only the zone. Three display states, never collapsed: contained serves, not-contained suppresses because we know the point is wrong, unmeasurable suppresses with the reason stated. Size all three before it lands; you already know one is 26.5%.

**Three. Close the append boundary.** Application layer first, since the database half cannot be built as specified — there is no `parcel-node` table to reference and a foreign key has nothing to point at. It becomes a self-referential check, or it waits on the per-family key grammar, which nobody has scoped.

### What to stop, and what is lost

**Stop the T-25 enumeration on both substrates.**

**What is lost, specifically, and it is not nothing.** You lose the map of where else garbage can enter. Concretely: `packages/retrieval` is entirely unread on the property side and is a write path; the field-driven inversion that would find *missing* checks rather than weak ones was never started; and both instruments that produced the counts are under-audited, so the numbers you keep are candidates.

The practical consequence is that the next defect of this class will be found the way these were — by accident, or by somebody reading a write path for an unrelated reason. Two of the three most serious findings in this programme surfaced exactly that way. Stopping means accepting that discovery rate.

I still think stopping is right. The findings that matter for launch are known, and the enumeration's marginal return has been falling while its context cost has not.

**Also stop:** the S-21 re-derivation until after launch. It fixes an unauditable number rather than a wrong one, and it is a corpus job.

### What I would have done differently in the last 36 hours

**Declared an exit condition on day one.** Every one of these findings was real, which is exactly why the programme never stopped. Without a stated exit, "each finding generates the next dispatch" runs until an operator intervenes, and that is what happened.

**Said stop and ship, unprompted.** I never did. The operator did.

**Not dispatched nine concurrent lanes on one machine.** That corrupted at least two lanes' test measurements and cost one of them two wrong diagnoses — the seat named this itself, and I gave the fan-out authority without a concurrency limit.

**Verified my own claims before writing them into canon.** Seven of my assertions were falsified by seats reading the source: a note I ordered deleted from a summary of it, a function I told a seat to check on the strength of its name, a property of a log I had not read, a two-instance observation I called the strongest finding of the programme, a check name that does not exist and would have jammed every pull request in the estate, an ordering I inferred from paste order, and a query I specified badly that produced a 46-million figure that meant nothing. **Every one is the governing defect arriving in the analyst rather than the substrate.**

---

## 7. THINGS THE NEXT PLANNER WILL GET WRONG

### Stale or superseded numbers

| Number | Reality | Where it may still appear |
|---|---|---|
| 253 geometry rows | **254.** One per county. The 253 belonged to a different rail. | Anywhere before 2026-08-20 |
| 513 markets rows | **321–427.** Summed two predicates. And covered 16.7% of tree-wide reach. | The markets handover |
| AO-versus-AE flood disagreement | **129 of 37,331.** 36,723 are in-or-out of a hazard area. | Carried memory, dispatches |
| 28 point-value keys | **51.** The 28 was a different dict. | The markets handover |
| "Calibration magnitude is fiction" | **False.** Point value and quantity cancel exactly. No repair owed. | The markets handover |
| 46,486,592 unresolved bindings | **Artifact.** Query I specified badly, conflates key-shape mismatch with orphaning. | This conversation |
| R-7 as highest-value item | **Wrong.** Columns are `double precision`; the kill path required `numeric`. | Property canon before c0b5f5b |
| "tier2 covers Texas" | **10 counties.** FEMA snapshot rows are 176 coordinate cells not joinable to a parcel. | Everywhere |
| "eight commits behind production" | Was thirteen, now deployed. Stripped from doc 90 in the current package. | Older copies of 90 |
| "three checks hold" | Three refuse rather than default. **One** carries a second derivation. | Property position statements |

### Dormant, starved, over-scoped or unwired controls

| Control | State | Path |
|---|---|---|
| Deploy gate runtime attestation | **Starved, permanently.** `api.empressa.pro/version` returns `build_sha: null`, so it returns "cannot attest" every run. Fails honestly, can never succeed. | cockpit deploy gate |
| Deploy gate staleness check | **Starved by environment.** Needs deep history, CI checkouts are shallow. Answers `unverifiable` on every CI run. | same |
| `branch-guard.ps1` literal matcher | **Over-scoped.** Matches the word `commit` in a command string. `git log --grep=commit` is blocked. `git branch -D leftover` permitted, `git branch -D leftover-commit` refused. Has an explicit fail-open path. | `.claude/hooks/branch-guard.ps1:69-70` |
| `apply_corporate_action` | **Dormant.** One backfill caller, no trigger. | markets |
| `universe_sync` | **Dormant.** Registered job kind, absent from scheduler. | markets |
| Promotion gate / `resolver_backfill` | **Starved.** Gates on external identifiers no node carries. Never promoted anything. | markets |
| `record_input_lineage` | **Starved at the argument level.** The parameter that would activate it is never supplied. | markets capture path |
| `/api/serving-sweep` | **Starved.** Migration 0082 not run. | cockpit |
| Score route | **Starved.** `ATOMS_DATABASE_URL` absent from the workflow. | cockpit |
| Back-stamp boundary | **Scope-narrow.** Session-scoped listener; raw connection inserts bypass it. | markets |
| Flood write-then-verify | **Checks the wrong fields.** Compares schema, binding and outcome. Never compares the hazard zone or flag. | property |
| `registry.test.ts:77-78` | **Presence-shaped.** `kind` truthy, `basis.length > 10`. Blind to the class it sits beside. | legacy-design-tools |
| C-00 vehicle check | **Internal consistency only.** One agent edits both files and it passes. | doc_repo |

### Where a doc says done and it is not

- **`OPS/91_branch_protection_runbook.md` still speaks as if protection is off.** It is on, Stage 1, six repos.
- **`_STATE.md` carried "Stage 2 OPEN" forward after a commit had already recorded "Stage 2 applied."** Systems flagged the contradiction rather than silently rewriting it. Unresolved as of their audit.
- **Two divergent copies of `61_enforcement_doctrine.md`,** root at 173 lines dated 2026-08-20 and OPS at 363 lines dated 2026-08-19, **both untracked in git.** Every document citing it cites something a fresh clone does not contain. The OPS copy is the complete one.
- **`90` and `91` are dual-written** into `90_runbooks/` and `OPS/` and have already diverged.
- **The branch-protection close JSON and the Stage 1 decision are cited by tracked documents and are themselves untracked.**

### Standing rulings from these sessions that may not be in `_decisions/`

I ruled these in dispatch prose. Whether any seat filed them: **DO NOT KNOW.**

- Old geometry rows are **retired, not superseded.** No reconciliation against them; there is nothing to reconcile against.
- The no-third-party gate **stays as it is.** Verification moves one layer down and the verdict passes outward. Zero rows genuinely require the publisher at the union layer.
- Advisory rows on the deploy gate **ship red, not pre-acknowledged.** Acknowledgment is for gaps that persist, not gaps about to close.
- A declining grader **produces a fourth label with a stated basis**, not no row. No row collapses into the grader never having run.
- Only planners commit; **subagents never touch git.**
- Merge to main is **self-service**; the operator gates deploys, deletions and credentials only.
- `empressa-trading` ownership between markets and trading was **never resolved.** It is the one genuine repo overlap.

---

## What I would tell the next planner in one paragraph

The audit found real things and it never had a stopping rule, which is why it ran this long. The three findings that matter for SmartSite are that no boundary validates what enters the atom store, that a quarter of Texas parcels have no geometry so "complete" needs defining, and that the geometry coverage ledger reports numbers nobody can reproduce because the scorer that made them was never committed. Everything else is either a wrong number that can be fixed after launch or a map of where to look later. The single most useful thing you can do that I did not is write down what "done" means before starting anything.
