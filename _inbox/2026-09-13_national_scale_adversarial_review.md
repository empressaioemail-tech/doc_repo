---
id: 2026-09-13_national_scale_adversarial_review
title: Adversarial review of the national-scale working notes
date: 2026-09-13
status: draft
kind: review
owner: nick
reviews: _inbox/2026-09-13_national_scale_working_notes.md
related: [29_scale_warm_architecture, 90_operations/OPS-19_factory_plan_of_record, 90_operations/OPS-21_serve_completion_program, 90_operations/OPS-22_spine_architecture_map, 90_operations/onboarding_defect_class_backlog, _catalog/tx_cad_source_registry.json, _catalog/county_contract_v0.json, _research/2026-09-12_cotality_reengagement_division_cogs_and_probe, _decisions/2026-09-11_ledger_as_serving_path_seven_steps]
---

# Adversarial review — national scale working notes

> Commissioned to BREAK the document, not to improve it. Read-only. No file other than
> this one was written. No external vendor API was called. No credential was read.

## Snapshot

`P:\doc_repo`, branch `main`, commit `9eef6a6c4a5c5c7e6baa363800257482b9a8a70d`
(2026-09-13, "decision(Hays): the node id is the parcel-map id and the declared 2026 roll
is the 8-26 export; P-182 dispatched (A-139)").

Two product repos read through `git show origin/main:<path>` after `git fetch`, never from
the working tree. `P:\hauska-factory` local HEAD is `3653f12 "Initial commit"` and was NOT
read; `origin/main` there is `97b9387` (2026-09-13). `P:\hauska-engine` local HEAD is
`8d8e880` (2026-08-12, detached) and was NOT read; `origin/main` there is `24d1f13`
(2026-09-13).

Files opened, in order: the working notes; `ENFORCEMENT.md`; `29_scale_warm_architecture.md`
(full); `_scratch/depth-engine-27c.md` (lines 40-75, 140-175);
`_inbox/2026-07-26_R4_4_verify_checkin.md`; `90_operations/OPS-22_spine_architecture_map.md`
(sections 1, 2, 3, 3a, 5); `90_operations/OPS-21_serve_completion_program.md` (sections
"Where it actually stands", "The debt nobody has audited", Phase 2H, row 3P-14);
`90_operations/onboarding_defect_class_backlog.md` (class register, all tables);
`90_operations/OPS-19_factory_plan_of_record.md` (rows A-017, F-10, log lines);
`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md` (full);
`_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md` (sections 1, 2, 5,
rail division table); `_catalog/tx_cad_source_registry.json` (all 35 rows, computed);
`_catalog/county_contract_v0.json` (header + column samples); `_catalog/vendor_testset_ctx.json`;
`_inbox/2026-09-02_gtm_pickup_card.md` (situs sentinel); and, at `origin/main`,
`hauska-factory:migrations/0007_parcel_record.sql`, `migrations/0002_conformant_l3.sql`,
`scripts/check-parcel-record-schema-drift.mjs`, `src/config/cad-declared-vintages.mjs`,
`hauska-engine:packages/engine-core/src/parcel-record/cell-state.ts`.

---

# FINDINGS

Ordered most severe first.

---

## F1 — CONFIRMED DEFECT. The re-bake economy is priced on a cohort roughly one thirteenth of a county, for one rail of sixty-five, by a model that was retuned 290x downward to clear its own hard-kill gate, against no invoice.

**The claim attacked.** Section 2: "From `29_scale_warm_architecture.md`: Bastrop depth cost
was ~$0.24-$5 per county"; "re-bake all of Texas (254) $60-$1,270"; "re-bake the country
(~3,144) $750-$15,700"; "**Bakes are not precious. They cost about a dollar.**"

**What I read at source.** Six separate defects compound here.

**(a) The cited document is superseded and does not contain a measurement.**
`29_scale_warm_architecture.md` line 5 carries `status: superseded`, and line 13 carries a
banner: "2026-08-09: superseded as plan of record by the CASCADE KEYSPACE SHARDING section
of `90_runbooks/factory_onboarding_runbook.md` ... per
`_decisions/2026-08-09_factory_spec_precedence_ruling.md`." The working notes cite it with
no staleness marker. ENFORCEMENT: "Do not write a correction into durable memory from a
source carrying a staleness marker." Worse, the figure appears there only as a parenthetical
recall inside a knobs bullet at line 57: "(Recall Bastrop depth cost was ~$0.24-5/county —
compute is cheap; the cap is bounded by infra/quota, not $.)" That is a proxy, not a record.
ENFORCEMENT: "Read the authoritative record, never a proxy for it." The same line also
carries "$200 compute/jurisdiction" as the governing budget, which the working notes do not
quote.

**(b) The actual origin, and what it measured.** `_scratch/depth-engine-27c.md:162`:
"GROUND-TRUTH (full pass offset=50 limit=4000): processed=**3604**, promoted=**2308** new,
verifyPass=2308, verifyFail=889, no-road-adjacency=404, already-promoted=3.
wallMsTotal=20816786 (~5.8h), msPerParcel=5773, extrapolatedJurisdictionUsd=**0.2441**."
Confirmed at `_inbox/2026-07-26_R4_4_verify_checkin.md:33`: "Cost (executor full place-type
pass): extrapolatedJurisdictionUsd approximately **$0.24**". This is the setback-depth
PROMOTION pass over a `--place-type-cohort --city-cohort` filtered set. It is one rail
family. It runs AFTER acquisition, after `txgio_parcel` geometry load, after zoning-fact
staging. None of those are in it.

**(c) The denominator is a zoning cohort, not a county — 13x to 20x.** Line 53 of the same
file: "wallMsTotal=2218047, msPerParcel=4425, usdPerParcel=0.000049,
extrapolatedJurisdictionUsd=**0.2844**, extrapolatedWallHours=7.09."

*Pre-registered falsifier, stated before I did the arithmetic:* if the implied denominator
landed near 74,729 (Bastrop's geometry universe) or 62,257 (its zoning-facts node headline),
my denominator claim is wrong and the figure really is per-county.

Two independent derivations:

- dollars: `0.2844 / 0.000049` = **5,804 parcels**
- wall time: `7.09 h x 3.6e6 ms / 4425 ms per parcel` = **5,768 parcels**

Both land on `zoning_all` = **5,769**, the live SELECT pasted at
`_inbox/2026-07-26_R4_4_verify_checkin.md:20-28`. The two alternatives are eliminated by
arithmetic, not by preference: the processed cohort (500) would give $0.0245, and the
place-type universe (3,657) would give $0.179. Neither is 0.2844. The falsifier did not fire.

The document confirms it independently. `_scratch/depth-engine-27c.md`, LESSON (R4.4):
"`--place-type-cohort` filters SQL ... removes PDD `no-setback-row` from cohort denominator
noise; **extrapolation uses place-type count not all-zoning**." So the denominator is 5,769
before the flag and 3,657 after. Either way it is a ZONING cohort.

And the file already carries the warning the planner walked into.
`depth-engine-27c.md`, LESSON (PRE-2): "'~62,257 Bastrop parcels' is zoning-facts headline;
**full TxGIO geometry universe is 74,729**. Adjacency scale denom = geometry rows."

`74,729 / 5,769` = **12.95x**. `74,729 / 3,657` = **20.4x**. The cited number covers 4.9
percent to 7.7 percent of Bastrop's parcels, for one rail.

**(d) The cost MODEL was recalibrated 290x downward to clear a hard-kill gate.**
`90_operations/onboarding_defect_class_backlog.md:89`, BELL-COST-GATE-BREACH: "Bell 48027
re-gate: sample-cohort cost estimate **$333.19 >= $200 hard-kill** (cohortCount 163,519 —
estimate extrapolates per-parcel cost x cohort) | **CLEARED 2026-08-05** — engine #250
**recalibrated cost model** to bake/warm Neon heuristic (**0.25 CU x $0.16/hr +
$0.000002/atom-write**); **removed stale $2/1k-calls term**. Re-gate: **$1.15 PASS** (was
$333.34 DECLINE)."

Two things follow. First, `0.25 CU x $0.16/hr` = **$0.04 per hour of machine time** — which
is exactly the rate my (c) arithmetic implies (`0.000049 per parcel / 4.425 s per parcel` =
$0.0399/hr). The model and the figure agree, which confirms I read the right instrument.
Second, what it charges is Neon compute units and atom writes. It does **not** charge Cloud
Build or Cloud Run machine time — and `29_scale_warm_architecture.md:18` says the bake runs
on `E2_HIGHCPU_8` with a 2h timeout. A 5.8-hour run on an 8-vCPU box costing under a quarter
is not a compute price; it is a different quantity. **The removed `$2/1k-calls` term is the
external-source-fetch term.** A national acquisition is, structurally, external calls — and
the instrument that produced $0.24 has had that term deleted.

ENFORCEMENT, "Tests": "Never assert a value the system produces that no external authority
recognises. That converts a defect into a specification." The cost gate now passes because
the model changed, not because the bake got cheaper.

**(e) No invoice reconciliation exists.** I searched doc_repo for invoice, billing, actual
spend and cost reconciliation. There is no artifact anywhere reconciling any
`extrapolatedJurisdictionUsd` against a GCP or Neon bill. Every cost figure in this operation
is self-reported by the instrument being questioned.

**(f) The dominant cost is acquisition, and 217 of 254 Texas counties have none.**
`90_operations/OPS-19_factory_plan_of_record.md:138`: "**The 254-county distribution is the
finding of the day:** execute 25, idempotent 6, skip by class 6 ..., **no landing 217**
(`TX-LANDING-ABSENT`). The 8,021,862 landing rows cover 37 counties. Wave 1 as carded, the
CAD roll for all 254, cannot run from the store as landed; the executable set is 31
counties, and **217 need L1 acquisition first**." Ratified as A-017 at lines 92 and 101,
same doc: "the 217 `TX-LANDING-ABSENT` counties are **not loop defects**; they are absent
sources ... The **F-09 acquisition card** is compiled by the planner when CP3 closes."

So "re-bake all of Texas" is, for 86 percent of Texas, not a re-bake. It is an acquisition
the cited cost figure explicitly excludes. (Parcel GEOMETRY is separate and largely landed —
`OPS-16:34`, `txgio_parcel` 253/254 — but the 20-rail `cad` block is 37/254.)

**Second mechanism considered and rejected.** The $333 Bell figure could have been the wrong
one: a stale `$2/1k-calls` term that billed internal DB round-trips as external API calls
would genuinely over-count by two orders of magnitude, and $1.15 would then be the honest
number. That is plausible and I cannot eliminate it, because no invoice exists to adjudicate
it. I reject it as a *defence of the working notes* rather than as a possibility, for two
reasons. First, it does not touch (b) or (c): even a perfectly calibrated model applied to a
5,769-parcel zoning cohort on one rail does not produce a county bake cost. Second,
ENFORCEMENT's rule is directional here — a check retuned until it passes, with no external
authority consulted, is exactly the shape the doctrine names, and the burden is on the
number, not on the reviewer.

**Verdict: CONFIRMED DEFECT.** The working notes' own flagged weakness ("if the true figure
is 50x higher the re-bake economy still holds; if it is 5,000x higher it does not")
understates the problem in kind, not just degree. It is not one multiplier. It is a wrong
denominator (13-20x), times an unknown rail multiplier (1 of 65), plus an entirely absent
acquisition term for 217 of 254 counties, plus a cost model with the external-call term
deleted, plus F2's per-call vendor COGS. The correct statement is **UNMEASURED, with a floor
13-20x above the quoted figure and no established ceiling.**

**What it would take to settle it.** One county, end to end, from zero landing to gate pass,
with the GCP and Neon line items pulled from the actual bill for that window and reconciled
against `extrapolatedJurisdictionUsd`. Standing memory already says this: run ONE county
end-to-end before scoping waves.

---

## F2 — CONFIRMED DEFECT. The "free" national QA oracle is priced at $0.15 per call in the document the working notes cite for it, written the day before by the same planner, and it is not independently derived in the sense the doctrine requires.

**The claim attacked.** Section 5: "**A national QA oracle.** Cotality gives an independently
derived value for owner, assessed value and acreage nationally. Disagreement beyond a
threshold is a defect signal, **free**, everywhere, with no human review. This matters more
than the data: it is a genuine **meaning-shaped check**."

**What I read at source.**
`_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md`, listed in the
working notes' own `related` frontmatter:

- Section 5 heading, line 213: "**COGS model at fifteen cents per call.**" Line 215:
  "Working assumption, operator supplied: **$0.15 per call**. **The billing unit is unread
  and it is the single most load-bearing unknown in this document.**"
- Rail division table: `acreageAcres` **BUY**, `assessedValue` **BUY**, `owner` **BUY**
  ("Paid-tier rail; needs its own atom family"). These are precisely the three rails the
  working notes name as the free oracle.
- Bundle table line 230: "The record | 1 | $0.15 | situs, land use and description, acreage,
  year built, values, living area, legal, owner."
- Lines 305-308: "The commercial agreement **has not been read**. Retention and derivative
  rights, consumer [display licence] ... remains active and **gates public display of
  Cotality-sourced figures independent of price**."

Do the arithmetic the working notes did not. The document's own section 5 states Texas at
roughly 700M cells / 65 rails, about **10.8M parcels**. At $0.15 per parcel that is
**roughly $1.6M for Texas alone**, against the same document's "$60-$1,270 to re-bake all of
Texas." Nationally the figure is an order of magnitude worse. **The document prices the
nearly-free input (compute) and assigns zero to the input that dominates by three to four
orders of magnitude.** That inversion, not any single number, is the defect.

**On "meaning-shaped".** ENFORCEMENT: "Independently derived means from different sources,
not different fields ... The test is whether one party acting alone could satisfy both
sides." Cotality's owner, assessed-value and acreage records are aggregations of county CAD
rolls — the same upstream the factory reads. Where the CAD roll is wrong, both sides agree
and the check passes. The operation already has the worked example: `OPS-16:246` (A-121)
records "Travis serves a systematic **tenfold gap** between its 2025 StratMap and 2026 CAD
rows on four of five parcels read." A vendor carrying the same roll vintage would reproduce
the gap, not catch it. The check is meaning-shaped only against rails where the vendor's
upstream is genuinely different, and the document asserts it generally.

**Second mechanism considered and rejected.** The operator's 2026-09-11 meeting may have
produced pricing the research doc does not reflect — "pay per use, no deposit, no upfront
dataset purchase" (section 1) could conceivably include a free verification tier, and the
$0.15 is explicitly an assumption. Rejected as a defence: section 1 also states "The
commercial agreement has not been read," and the standing directive from
`_decisions/2026-07-13_cotality_swap_public_record_migration.md` is still in force (Cotality
extinguished, `00_current_state.md:153`). A word flagged in its own source as "the single
most load-bearing unknown in this document" cannot be rendered as "free" one day later in a
document whose central thesis is affordability. That is silent degradation, which ENFORCEMENT
prohibits outright; a labelled degradation would have been honest.

**Verdict: CONFIRMED DEFECT.**

**What it would take to settle it.** Read the commercial agreement: billing unit (per call
versus per record returned), any verification-tier carve-out, retention and derivative
rights, and whether a gating use counts as display under
`_decisions/2026-06-16_cotality_consumer_display_license_gate.md`.

---

## F3 — CONFIRMED DEFECT. Version keying is design intent ruled two days ago and unbuilt; and the version that WAS ruled is a different axis from the one the plan needs, so the query the plan promises would not run even after the build lands.

**The claim attacked.** Section 3: "The fix already exists in the ledger design: a cell is
state + atom reference + provenance + a cached rendering **keyed to atom version and
vocabulary version**. If that keying is real, merge is safe and remediation is a query."
Section 4 item 1: "VERSION EVERY ROW / pipeline version + vocabulary version on every cell
... 'which counties carry the vacuous-envelope bug?' becomes a query."

**What I read at source.**

`hauska-factory origin/main:migrations/0007_parcel_record.sql` lines 19-35 — the live cell
table, in full:

```sql
CREATE TABLE IF NOT EXISTS parcel_record_cell (
  place_key text NOT NULL REFERENCES parcel_record (place_key) ON DELETE CASCADE,
  rail_key text NOT NULL,
  cell_state jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (place_key, rail_key),
  CONSTRAINT parcel_record_cell_state_kind CHECK ( ... 'value','absent-verified',
    'not-applicable','refused','unaccounted' )
);
```

Four columns. No version of any kind. The file header pins it: "Provenance:
empressaioemail-tech/hauska-engine @ a38cbb2 / packages/engine-core/src/parcel-record/
schema.sql (verbatim; do not edit DDL below)", and `scripts/check-parcel-record-schema-drift.mjs`
enforces a sha256 match against the engine at the Dockerfile-pinned `ENGINE_SHA`, so the DDL
cannot have drifted silently.

The second mechanism a careful reader must check is that a version might live inside the
`cell_state` jsonb. It does not.
`hauska-engine origin/main:packages/engine-core/src/parcel-record/cell-state.ts` lines 8-18:

```ts
export interface CellProvenance { source: string; vintage: string; }
export type ScalarValueCell = CellProvenance & { kind: "value"; value: ... };
```

`vintage` is SOURCE vintage — which roll the value came from. It is not pipeline version and
not vocabulary version. **Conflating source vintage with pipeline version is the error.**

And the killer, lines 42-59: `ScalarAbsentVerifiedCell`, `ScalarNotApplicableCell`,
`ScalarRefusedCell` and `ScalarUnaccountedCell` are NOT intersected with `CellProvenance`.
`ScalarUnaccountedCell` is literally `{ kind: "unaccounted" }`. **A cell that did not produce
a value carries no source, no vintage, and no version at all.** The vacuous-envelope defect —
`computeTier1Envelope` declining on both branches — produces exactly those states. So the one
query section 4 promises ("which counties carry the vacuous-envelope bug?") is asking a
version key to discriminate among rows that, by type, hold no discriminator whatsoever.

The concept does exist in the factory, on other tables: `migrations/0002_conformant_l3.sql`
adds `logic_version text` to `candidates` and `resolution_atoms`. Not to cells.

On "already exists in the ledger design":
`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md:28-30` — "For every node and
rail the ledger holds one cell carrying the state, the atom reference, provenance, and
**(ruled tonight)** a cached rendering keyed to the atom version and the vocabulary version."
Ruled 2026-09-11. Two days before the working notes. Lines 45-49 make the status explicit:
"The seven steps, in dependency order, **are the program** ... Rows are in OPS-23 and OPS-16
A-129." A program is work not yet done. `OPS-23` rows P-161 to P-166 (`Dependencies` section,
line 104). None built.

**Verdict: CONFIRMED DEFECT, on two counts.** It is design intent, not code — the working
notes' own section 8 flags this correctly, so credit where due. But sections 3 and 4 then
proceed to build the merge-safety argument on it anyway, and section 4's framing quietly
substitutes "pipeline version" for the ruled "atom version." Those are different axes. An
atom version tracks supersession of a claim; a pipeline version would track which engine
build produced it. Nothing in the ruled design records the latter, and the defect class the
plan is aimed at lives in cells that have no atom at all.

**Second mechanism considered and rejected.** `updated_at` could serve as a de facto pipeline
version — bake timestamps cluster by deploy, so "which counties were baked before the
envelope fix" is answerable by date. I reject it as sufficient: `updated_at` defaults to
`now()` on write and is per-cell, so any later partial re-write (a single rail healpass, a
stamp propagation, the `--force-repromote` path) moves it without changing the producing code
version. It answers "when was this touched", never "by what". It is a proxy, and ENFORCEMENT
names reading a proxy for the authoritative record as its own failure class.

**What it would take to settle it.** A migration adding an explicit producing-code version to
the cell type — on ALL five states, not only `value` — plus a writer that populates it, plus
a read that fails when it is absent. Until then, "merge is safe" is UNMEASURED and
"remediation is a query" is false.

---

## F4 — CONFIRMED DEFECT. The novelty registry already exists, already recorded Hays as novel a month before Hays bit, and is dormant. The combinatorics the document calls "unknown" are computable from the repo today, and the tuple as specified would false-refuse counties for a defect class already structurally cleared.

**The claim attacked.** Section 4 item 3: "FAIL CLOSED ON NOVELTY ... registry of every seen
combination: { CAD vendor, GIS platform, projection, id scheme, zoning shape } / a NEW
combination REFUSES to bake and queues for class adjudication. ** this is the control that
would have caught Hays. **" And section 8: "Whether novelty gating refuses a workable share
of counties or nearly all of them. **Unknown until the recon exists.**"

**What I read at source.** `_catalog/tx_cad_source_registry.json`. It is the registry. Its
`_schema.row_required_fields` is: `jurisdiction_key, state_code, fips, name, cog_region,
tranche, service_url, layer_id, prop_id_field, format, vintage, auth_posture, adapter_kind,
vendor_pattern, probe_evidence_path, verified_at, confidence`, plus a stated
`four_point_probe_rule`. That is the working notes' tuple, already fielded, with a probe
protocol, for **35 counties** (CAPCOG 11 + AACOG 11 + NCTCOG 13).

### The combinatorics, computed from those 35 rows

| field | distribution |
|---|---|
| `vendor_pattern` | bis-consultants 21, unknown 5, county-run 3, honest-absent 2, hays-no-public-rest 1, county-run-agol 1, dcad-bulk-only 1, none 1 |
| `format` | arcgis_rest 30, honest_absent 4, bulk_export 1 |
| `auth_posture` | public_anonymous 29, absent 4, bulk_only 2 |
| `prop_id_field` | prop_id 16, prop_id_text 7, PROP_ID 3, Prop_ID 2, null 4, PropertyID 1, PropID 1, pid 1 |
| `layer_id` | 0 x28, 1, 4, 40, null x4 |

Distinct `{vendor_pattern, format, auth_posture, prop_id_field, layer_id}` tuples:
**15 over 35 counties.** Two tuples cover 21 counties (60 percent); **13 of the 15 are
singletons.**

So the answer to the document's own open question is measurable and is: novelty gating does
NOT refuse nearly 100 percent, but the first-seen rate on the measured sample is **43
percent**, with a pure singleton tail. And that is a LOWER bound, because the working notes'
tuple adds two axes I could not compute (projection, zoning shape) and zoning shape is
per-CITY — 23 endpoints across 69 cities in six counties, which multiplies the tail.

### The tuple would false-refuse on a defect class already cleared

`prop_id_field` takes three values that differ only by capitalisation: `prop_id` (16),
`PROP_ID` (3), `Prop_ID` (2). Case variance was closed as a structural class:
`90_operations/onboarding_defect_class_backlog.md:74`, CAD-PROPID-FIELD-CASING: "Engine #246:
case-insensitive property-key match in `fetchBcadParcelRings`; both casings unit-tested;
BCAD/Guadalupe byte-identical | **CLEARED (structural — any cased-field county now works)**."
A registry keyed on the raw field string refuses **5 of 35 measured counties** for a novelty
the pipeline demonstrably handles. That is the ceremony the review brief asked about, made
concrete: a gate that blocks correct work teaches the fleet to use the bypass flag, which
ENFORCEMENT names explicitly as a worse defect than a narrow control.

### "This is the control that would have caught Hays" is falsified by the registry's own row

```
{"fips":"48209","name":"Hays","vendor_pattern":"hays-no-public-rest",
 "format":"honest_absent","prop_id_field":null,"layer_id":null,
 "probe_status":"honestly_absent","verified_at":"2026-08-09T19:27:28.773050+00:00",
 "confidence":"medium",
 "notes":"E2 gap-fill 2026-08-09: no authoritative CAD parcel REST on maps.co.hays.tx.us; StratMap fallback"}
```

Hays' novelty was probed, named as its own vendor pattern, marked `honestly_absent`, and
graded `confidence: medium` on **2026-08-09**. The chimera bit anyway. The HEAD commit of this
repo, today, is still ruling on it: "decision(Hays): the node id is the parcel-map id and the
declared 2026 roll is the 8-26 export; P-182 dispatched." **The registry existed, the novelty
was in it, and it changed nothing.**

Williamson is the same shape: `prop_id_field: "PropertyID"`, `vendor_pattern: "unknown"`,
`confidence: "high"`, `verified_at: 2026-08-05`. The "second numeric scheme" the working notes
list as a defect was a registered field value five weeks before it cost the calendar.

### The three-question gate, answered

1. **What executes it?** Nothing. Across `hauska-engine origin/main` there are **zero**
   references to `tx_cad_source_registry` / `cad_source_registry`. In
   `hauska-factory origin/main` there is exactly one: `src/config/cad-declared-vintages.mjs`
   — and it reads only `declared_reader_vintages.by_fips`, not the vendor rows. Its own
   header: "this is a **COPY**, not a reference ... **Update this file by hand** when a
   county's declared vintage flips." Fifteen counties, hand-maintained.
2. **What triggers it?** Nothing. No bake, gate, or job reads the novelty fields.
3. **What fails when it is violated?** Nothing — Hays is the proof by violation, already run
   for us by production.
4. **What bypasses it?** Every path. The file lives in doc_repo; the bakes run as Cloud Run
   jobs in `hauska-factory` / `legacy-design-tools` containers that have no doc_repo
   checkout. ENFORCEMENT, "Scope": "A nested clone is never a valid read path."

By the doctrine's own taxonomy the registry is **DORMANT** (exists, correct, no trigger) —
"worse than absent, because absent is visible." The working notes propose adding rows to it.

**Incidental, found while checking.** `_catalog/t6_vendor_pattern_library.json` is **not valid
JSON** — it fails to parse at line 184 ("Expected ',' or ']' after array element"). Anything
that claims to consume it either does not, or swallows the error.

**Second mechanism considered and rejected.** The registry might have been built after Hays
was baked, making the "would have caught it" claim about a future state rather than a past
one. Rejected on dates: `verified_at` on the Hays row is 2026-08-09; Hays was certified 20/20
on 2026-08-05 (`onboarding_defect_class_backlog.md:92`, HAYS-CERT-CLOSED) and the identity
work is still open on 2026-09-13. The registry row predates the entire window in which the
chimera was diagnosed and is still unread by anything. The counterexample holds.

**Verdict: CONFIRMED DEFECT.** The mechanism is not missing; it is unfed and ungated, which is
the defect class ENFORCEMENT opens with. Building a second one changes nothing. **Arming the
existing one is a smaller and strictly better proposal than the one on the page**, and the
page does not know the existing one is there.

---

## F5 — CONFIRMED DEFECT. "Detectably wrong and cheap to redo" does not close, because a re-bake does not reach the customer. Twenty-four percent of the grid is record-served, four read paths are live, ninety-four cutovers have shipped, and not one legacy path has been verified retired.

**The claim attacked.** Section 2: a bake "has to be (a) DETECTABLY wrong, and (b) CHEAP to
redo. Those are much easier engineering problems than 'correct on the first pass.'"
Section 3: "merge is safe and remediation is a query."

**What I read at source.** `90_operations/OPS-21_serve_completion_program.md:144`: "**18
rails, 97 of 390 possible (county, rail) pairs, roughly 24 percent of the grid.**" Lines
153-155: "Everything else falls to `legacy` by the allowlist's own fail-closed default. **Four
read paths remain live simultaneously:** the atom chain, the baked node-facets snapshot, the
cortex fallback route, and the engine-api feasibility route."

Then, "The debt nobody has audited", lines 158-168: "**Ninety-four cutovers have shipped.
Nobody has verified that a single legacy path has actually been retired.** If none has, then
every rail is being served by a record reader with a live legacy path still standing behind
it, and ENFORCEMENT's own rule is being violated ninety-four times."

This is fatal to the re-bake thesis in a way the working notes never touch. Re-baking rewrites
`parcel_record`. If 76 percent of the grid never reaches the record reader, and the 24 percent
that does still has a live second implementation behind it, then re-baking corrects the store
and not the product. "Cheap to redo" is only a virtue if redoing changes what the customer
sees.

**Second mechanism considered and rejected.** The legacy paths might in practice be
unreachable — dead code that nothing routes to, making the audit a formality. I reject it
because OPS-21 explicitly names them as *live* read paths in the fan-out diagram, with
`parcelRecordAllowlist.ts` returning `legacy` as "the default for anything unslated,
**regardless of verdict**" (`OPS-22:270`). That is not dead code; it is the default branch.
And the audit lane L1 exists precisely because nobody knows — which makes the state UNMEASURED,
and an unmeasured second implementation cannot be assumed absent. ENFORCEMENT: "When output
looks clean, do not report health."

**Verdict: CONFIRMED DEFECT** — a first-order omission from a document whose central mechanism
is cheap re-baking.

**What it would take to settle it.** OPS-21 lane L1, which is read-only, retires nothing,
"needs nothing from any other lane", and by its own doc "runs immediately and in parallel with
Phase 1."

---

## F6 — CONFIRMED DEFECT. The source-variance / pipeline dichotomy is false for at least three of the five items on the left, and the defect class consuming the calendar right now is on neither side of the ledger and has no axis in the novelty tuple.

**The claim attacked.** Section 1's two-column split, "~5 defects / recon catches these"
versus "~6 defects / only a bake catches these", and the conclusion "**AND THESE ATE THE
CALENDAR**" applied only to the right column.

### Three of the five left-column items are source-property times our-transform interactions

**Williamson, "dollars on a second numeric scheme -> prefix strip mis-joins."** The prefix
strip is ours. `OPS-22:78-82`: "`place_key` "{county_fips}:{prop_id}" RAW ->
`normalizeForJoin()` strip leading zeros on all-digit tokens (engine
`packages/atoms/src/fact-writer-ids.ts`) -> `parcelNodeId` NORMALIZED." A read-only probe of
Williamson's FeatureServer returns `PropertyID` and reveals nothing about what our normalizer
does with it. Registered 2026-08-05 (F4), bit anyway.

**"8 counties: prop_id is not an account, need geo_id."** `OPS-22:92-96`: "**The undeclared
seam.** `place_key` is raw and `parcelNodeId` is normalized ... `owner-rail-collision-check.mjs`
flags this in its own header as an explicit ASSUMPTION: if `"27303"` and `"027303"` are both
real, distinct CAD rows, the join conflates them. **That population has never been measured.**"
Classifying an explicitly unmeasured population as "recon catches these" collapses *unmeasured*
into *source*, which is the exact three-state collapse ENFORCEMENT prohibits.

**"Travis/Caldwell situs is a bare street line."** Wrong mechanism and wrong counties.
`_inbox/2026-09-02_gtm_pickup_card.md:52`: "**The situs sentinel.** 16,113 Bastrop parcels
carry `", ,"` as an address. A naive non-null metric reports 96.2 percent situs coverage
against 74.7 percent real. **Bastrop-specific; Travis and Williamson are 0.0.**" A
concatenation of empty components written by our writer is a fabricated sentinel — the
canonical right-column defect, and the one ENFORCEMENT names by shape ("Never satisfy a check
with a sentinel ... empty, concatenated, placeholder, or defaulted"). I confirmed it
independently in `_catalog/vendor_testset_ctx.json`, where four of ten sampled Bastrop parcels
carry `"situs": ", ,"` verbatim.

The consequence is not cosmetic. The document's sequencing rests on recon catching five of
eleven at zero blast radius. On this reading the number a read-only recon would have caught
unaided is closer to one or two (Elgin's separate FeatureServer; vendor and platform
identity). **The rest need our transform in the loop to be visible.**

### The omitted class: vintage and identity churn, which has no axis in the proposed tuple

The tuple is `{CAD vendor, GIS platform, projection, id scheme, zoning shape}`. Every axis is
STRUCTURAL. There is no TIME axis. Yet:

- `onboarding_defect_class_backlog.md:75` **CAD-COHORT-VINTAGE-DRIFT — OPEN**: parcels in our
  roster with "zero features in the live Caldwell CAD layer."
- `OPS-21` Phase 2H: Hays, "**30.5 percent of parcel ids gone and 19.5 percent drifted across
  the 2026-09-03 reload**"; "The StratMap graft: 116,421 geometry rows padded into
  `cad_property` with `source_file` overwritten in place"; "the cadRoll gate is **not
  vintage-scoped**, so 37,813 rows can only clear by claiming they left a roll they were never
  on." `OPS-16` A-118 resolved the contested magnitude and left A-115's orphaning consequence
  standing.
- `OPS-16:246` (A-121): "Travis serves a systematic **tenfold gap** between its 2025 StratMap
  and 2026 CAD rows on four of five parcels read, and that gap is a **SEPARATE unowned
  blocker**."
- `OPS-19:138` skip-by-class list: "Travis join, Hays landuse, Ector keyKind, situs sentinels,
  **Dallas and Tarrant vintages**."
- The declared-vintage map is fifteen counties, hand-edited in three places (doc_repo catalog
  -> LDT `vintage.ts` -> factory mirror), guarded by a CI drift check.
- The HEAD commit of this repo, today, is a vintage ruling.

**This is the class eating the calendar right now, and it appears on neither side of section
1's ledger.** It also inverts the re-bake thesis: re-baking is the operation that EXPOSES roll
churn, because a bake against a newer roll orphans the prior snapshots. "Bakes are not
precious, re-bake freely" and A-115's accepted orphaning consequence are in direct tension,
and the document does not notice.

### Other classes the backlog carries and the working notes omit

`ADAPTER-NEEDED` (eCode360 bucket, Smithville / Pflugerville — OPEN);
`PROPID-GEOMETRY-NONUNIQUE` (two geometries under one prop_id — RULED, follow-up OPEN);
`STAMP-CENTROID-PRECISION` (a numerical-stability bug invalidating "**every pre-#386
whole-county stamp run (all ZONING_LAYERS cities)**", roster dry-run done, per-city applies
QUEUED); `EDGE-ROLE-MISJUDGED` (flag lots, live-verify pending);
`CERT-VS-SERVE-EDGE-MISMATCH` and `DRY-APPLY-PARITY-DRIFT`; `MIXED-VINTAGE-NEIGHBOR` (OPEN).
The register carries roughly 33 named classes. The working notes carry eleven.

**Second mechanism considered and rejected.** The eleven could be a deliberate, representative
sample rather than an inventory — the document is working notes, not an audit, and says so. I
accept that framing for the list and reject it for the conclusion. The document does not merely
list; it COUNTS (~5 versus ~6), divides, and derives its sequencing from the ratio ("AND THESE
ATE THE CALENDAR"). A ratio computed over a sample that omits the currently-open classes and
the currently-active class is an instrument, and ENFORCEMENT makes the instrument part of the
claim.

**Verdict: CONFIRMED DEFECT.**

---

## F7 — CONFIRMED DEFECT. "Adversarial-first ordering" directly contradicts OPS-21 Phase 2H, a document the working notes name in their own frontmatter.

**The claim attacked.** Section 4 item 4: "bake the five WEIRDEST counties from the recon, not
the five easiest. if the pipeline survives the strangest input in the state, the remaining 249
are downhill."

**What I read at source.** `OPS-21`, Phase 2H: "**Hays is not one-sixth of the same job. It is
the identity-damaged county** ... **Lane H1 — Hays identity reconciliation must land before
Hays receives any Phase 1 or Phase 2 fill. Filling cells on a broken key writes wrong values
faster. This is the one place the program deliberately serialises rather than parallelises.**"

Applied to Texas today, "bake the five weirdest" means baking Hays first. The plan of record
forbids exactly that, in the plan the working notes cite, for the reason the working notes
themselves supply elsewhere (the chimera produces "a confident wrong answer that passed every
check").

**Second mechanism considered and rejected.** The two might be reconcilable: bake the weirdest
counties into STAGING, never to serving, per section 4 item 2 — staging absorbs the wrongness
and H1's prohibition is about production fill. That is a real reading and it is the best
defence of the page. I reject it as stated because section 4's four items are presented as
independent principles, not as a composed rule, and item 4's stated payoff is "the remaining
249 are downhill" — a claim about the pipeline being PROVEN, which a staging run on a broken
key cannot deliver. On a damaged identity the staging result is not a weaker signal; it is an
uninterpretable one. The composition would need to be written down, and it is not.

**Verdict: CONFIRMED DEFECT** as written. Repairable by composing items 2 and 4 explicitly, and
by carving identity-damaged counties out of "weirdest first."

---

## F8 — The six-county numbers verify exactly. The test they are proposed for does not.

**The claim attacked.** Section 7: "69 cities, 23 with a zoning endpoint, split Bastrop 3/3,
Caldwell 3/3, Hays 5/11, Williamson 7/14, Travis 3/18, McLennan 2/20 (`OPS-22` section 2). Run
the prober against those six FIRST. If it does not reproduce those numbers, the prober is wrong
... **A not-vacuous test for the instrument itself, at zero cost.**"

**What I read at source.** `OPS-22` section 2, lines 152-153, verbatim: "**City count by
county:** Bastrop 3, Caldwell 3, Hays 11, Williamson 14, Travis 18, McLennan 20. Cities with a
zoning endpoint: 3/3, 3/3, 5/11, 7/14, 3/18, 2/20." And the diagram at lines 131-133:
"`tx_city_boundary` 69 cities across the six CTX counties"; "`tx_zoning_district_staging` 23 of
69 cities carry an endpoint."

Arithmetic checks: 3+3+11+14+18+20 = 69. 3+3+5+7+3+2 = 23. **Transcribed correctly, cited
correctly. CLAIM SURVIVES on the numbers.**

**The test is internal consistency wearing a meaning-shaped costume. CONFIRMED DEFECT on
sufficiency.** The 23 comes from `tx_zoning_district_staging` — a table of what WE have already
staged. It is our ingest history, not a fact about Texas. ENFORCEMENT: "The test is whether one
party acting alone could satisfy both sides. If yes, it is internal consistency, and it catches
transcription errors rather than wrong sources." One party — our own ingest — produced both
sides.

The failure mode is not neutral, it is **anti-calibrated**. A city with a public zoning endpoint
we never found is a 0 in the fixture and a 1 in an honest prober. The prober would then "fail"
the gate for being RIGHT, and the version that passes is the one that reproduces our blind spot.
Standing memory says the same thing from the other direction: zoning coverage is wired-city, not
data; a low percentage is a stamp gap, not an absence.

Two further problems with the fixture as a gate:

- `OPS-22:140-142`: "**Two binding methods split the six counties.** Williamson and Travis are
  `covers-v1`; Bastrop, Caldwell, Hays and McLennan are `intersection-v1`. **They must never be
  averaged across method versions, which means the six are not one population.**" The fixture
  treats them as one.
- `OPS-22:287-289`, two sections later, is a warning written about this exact move: "This
  section first said 94 pairs and `setbackFrontFt 3`. Measured directly out of
  `PARCEL_RECORD_SLATE` ... **97 distinct pairs** ... **A per-rail count in a program doc must
  be re-derived from the literal source array, never trusted as arithmetic.**" The city counts
  are per-jurisdiction counts in a program doc, trusted as arithmetic.

**Does reproducing the six prove anything about the other 248?** No, and the F4 data says why:
21 of 35 probed counties are one vendor pattern, and the six CTX counties sit inside the two
dominant tuples plus Hays. A prober tuned on CAPCOG reproduces CAPCOG. The 13 singleton tuples
— `dcad-bulk-only`, `county-run-agol`, `bulk_export`, `layer_id: 40`, `pid` — are where it will
be wrong, and none of them is in the fixture.

**Second mechanism considered and rejected.** The fixture might be intended as a smoke test
(does the prober run, parse, and produce plausible shapes) rather than a correctness gate. That
would be a legitimate and useful thing. I reject it as the document's meaning because the
document states the consequence in gate terms: "If it does not reproduce those numbers, the
prober is wrong and **nothing it says about the other 248 counties can be trusted**." That is a
gate, and it is the wrong kind of gate.

**What it would take to settle it.** Construct the second derivation instead of weakening the
check, per ENFORCEMENT: hand-verify the zoning-endpoint status of a random sample of the 46
cities currently recorded as having none, against each city's own site. If any turn out to have
one, the fixture is falsified as ground truth and is honestly re-labelled as a regression
baseline — still useful, just not a correctness oracle.

---

## F9 — "Finish the repair before fanning" — the strongest case against it, which the document asks for and does not make.

The document's section 9 question 3 asks whether this is "the planner being conservative with
someone else's calendar." Steelmanning the other side, as commissioned:

**1. The rule conflates three operations with three different blast radii.** RECON is read-only.
ACQUISITION writes to immutable landing and touches no serving path. BAKE/PROMOTE writes serving
state. Only the third has the risk the argument is about. The document concedes recon and then
applies a single "must land first" to everything downstream of it.

**2. Acquisition is the longest pole, is strictly upstream of the repair, and is blocked by it
for no reason.** `OPS-19` A-017: 217 of 254 Texas counties are `TX-LANDING-ABSENT` and "need L1
acquisition first"; the F-09 acquisition card "is compiled by the planner **when CP3 closes**,
not before." Acquisition depends on nothing in OPS-21 or OPS-23. Fanning it now costs the
operator nothing he can lose and buys back the one thing he cannot: lead time on 217 counties'
sources. **The working notes contain no acquisition lane at all** — their sequence is recon ->
staging ledger -> bake 5 weirdest -> fan. That is the single largest omission in the sequencing
section.

**3. The repair has no stated terminal condition, and the plan of record says so.** `OPS-16`
A-121, operator-ruled 2026-09-10: "**Structural finding that outranks all four:** the walk
grades ~180 sampled parcels, short-circuits on a non-ok response, and grows its required-leaf
list by hand one leaf per lane with the walk-vs-bake divergence test skipping in CI — so **one
new defect class behind every cleared one is guaranteed by construction and no further fix ends
it.**" A precondition that is structurally non-terminating is not a sequencing rule; it is a
veto. OPS-21 Phase 1 stands at 24 percent of the grid; OPS-23's seven steps were ruled two days
ago and are unbuilt; the county contract is a draft "not consumed by anything."

**4. The operation's own record says defects are found by running, not by planning.** Every row
in the defect-class backlog is dated to a gate run, a cert run, or a live query. The 217-county
landing gap surfaced from a dry-run distribution (`4j6pr`), not from analysis. Standing memory:
L2 blockers surfaced serially; area-sweep, not parcel-sample. The instrument that produces the
next defect class is a run.

**5. `unaccounted` is legitimate at rest, and instantiating nationally is nearly free.**
`_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`, quoted in ENFORCEMENT: "A
missing column is invisible. An unaccounted cell is countable ... Every gap analysis is then
structurally incapable of finding the largest gaps." The working notes dismiss parcel-grain
national instantiation as "~700M cells for data we do not have" and propose a county-grain
ledger instead. That dismissal is in tension with the standing ruling, which the working notes
never cite.

**Where the conservative reading wins, stated fairly.** OPS-21's H1 ruling is correct and
specific: "Filling cells on a broken key writes wrong values faster." That is an argument against
baking-to-serving on identity-damaged counties. It is not an argument against acquiring sources,
instantiating records, or probing.

**The rule the evidence actually supports, replacing a single serial order:** recon and L1
acquisition fan now, unblocked; record instantiation at national grain fans now (`unaccounted`
is the honest state and makes the gap countable); bake-to-staging fans once the novelty registry
is ARMED rather than merely populated; bake-to-serving waits on identity per H1 and on the L1
retirement audit per F5. Four gates, not one.

**Verdict on the document's formulation: PLAUSIBLE BUT TOO COARSE.** It is not pure conservatism
— H1 is real — but as written it blocks work that has no dependency on the repair, and its
precondition has no terminal condition.

---

## F10 — CLAIM SURVIVES. "Gate grades 17 of 65 rails" is correct, and I nearly mis-scored it.

Recorded because the near-miss is the point. OPS-21:144 and OPS-22:281 both say **18 rails** (97
and 94 pairs respectively — themselves one day apart and disagreeing, worth a line of its own).
I had the working notes flagged as off-by-one until I read further. `OPS-22:293-294`: "**The
gate's denominator is 17, not 65.** `DEFAULT_SCHED_RAIL_KEYS` (`src/jobs/publish-gate-sched.mjs`)
is SLATE_1 (5) + SLATE_1B (2) + SLATE_1C (1) + SLATE_1D (7) + LANDUSE_OWNER (2). **Forty-eight
rails are never graded.**"

18 is the SERVE slate; 17 is the GATE. The working notes have it right and cite the right
mechanism. **CLAIM SURVIVES.**

The omission is the consequence, which OPS-22 states in the same sentence and the working notes
drop: "so canon's '**unaccounted is fatal at publish**' is written and not enforced for three
quarters of the [grid]." Everything section 4 proposes — version keys, staging, novelty refusal
— is scaffolding above a publish gate that grades 17 of 65 rails. A version key on a cell nothing
grades gates nothing.

Two other small claims verified and surviving: `place_key` cannot collide across counties — the
`parcel_record` DDL carries `CONSTRAINT parcel_record_place_key_shape CHECK (place_key =
county_fips || ':' || prop_id)`, so the county prefix is enforced at the database, not merely by
convention. And the two arithmetic figures are right: 981,405 x 65 = 63,791,325 ("63.8M"), and
254 x 65 = 16,510 ("~16,500").

---

# WHAT THE DOCUMENT DOES NOT CONTAIN

Ordered by how much it would change the plan.

**1. Acquisition, as a lane or as a cost.** 217 of 254 Texas counties have no CAD landing
(`OPS-19` A-017). The sequencing diagram goes recon -> staging ledger -> bake -> fan with no
acquisition step, and the cost model prices only the step after acquisition. This is the largest
omission on the page and it is in a doc the page does not cite.

**2. `_catalog/county_contract_v0.json` — the artifact section 5 proposes building, drafted
three days ago.** Its own stated purpose: "The single declaration from which a county's profile
record, the preflight gate, the bake's output list, the grader's required-leaf list and the rail
gate's unaccounted set are all DERIVED. Today those are four hand-grown lists and the gaps
between them are where every expensive defect of 2026-08 and 2026-09 lived." It carries scopes
(`county` / `rail` / `city`), the six cell states including `available-on-request`, state rules
including a relabelling tripwire, and per-column `basis: evidenced | inferred` with the
instruction "Review the inferred ones hardest." Status: "**DRAFT - not ratified, not consumed by
anything.**" It is cited in `OPS-22`'s own frontmatter. Section 5 says only that "The County
Manifest and `railCapabilities` are the existing half-built version of this." The nearer, newer,
better-shaped artifact is unmentioned.

**3. That re-baking does not reach the customer.** F5. Four read paths live, 94 cutovers, zero
verified retirements.

**4. Vintage and identity churn as a first-class axis.** F6. No time axis in the novelty tuple,
no vintage row in the defect ledger, and it is what today's HEAD commit is about.

**5. The human half of commitment #3.** The standing commitment is "$200 compute **plus one hour
human review** per new jurisdiction" (CLAUDE.md; echoed at `29_scale_warm_architecture.md:57`).
At 3,144 counties the human half is roughly 3,144 hours, about 1.5 person-years, and it dominates
the compute term by whatever the compute term turns out to be. The page prices compute and is
silent on review. "no human review" appears once, as an asserted property of the Cotality oracle
(F2), not as a budget.

**6. Wall-clock as a resource distinct from dollars.** The source run is 3,604 parcels in 5.8
hours, 5,773 ms per parcel, on one machine. `29_scale_warm_architecture.md:18` names the acute
case: "Bexar (~700k parcels) on one 8-CPU box." The document collapses compute dollars,
wall-clock and human hours into the single word "cost" and then concludes bakes are not precious.
Dollars may be cheap while wall-clock is the binding constraint; the page cannot distinguish
them.

**7. Store scale at national volume.** CLAUDE.md records 111,241,840 rows over 192 GB on
2026-08-31, up roughly 11.2M rows and 61 GB in eleven days, with an explicit instruction to
re-measure rather than quote. The decision the page leans on for merge safety names store scale
as its own motivating constraint (`_decisions/2026-09-11_...:86-87`: "Dereferencing 65 atoms per
parcel from a store measured at 192 GB on every inspect is not a free read"). The page proposes
adding a version key to every cell and re-baking 3,144 counties and never connects the two.
Applying the page's own Texas arithmetic nationally gives a cell count an order of magnitude
above the Texas figure it already calls too large — a figure the page computes for Texas, uses to
reject parcel-grain, and then does not compute for the country it is planning.

**8. `OPS-22` section 1's three open identity rulings, which that document says "block a second
state."** Verbatim: "(1) Does `place_key` normalize to match `parcelNodeId`, or does
`parcelNodeId` stop? (2) Which CAD tax year is authoritative — latest, or the per-county declared
year? (3) Does the `place_key` <-> `entity_id` crosswalk become a contract type, and who owns
it?" Ruling 2 is the vintage axis of F6. Ruling 1 is the unmeasured `"27303"` / `"027303"`
conflation. **All three are cheap — "none needs a build" — and all three gate exactly the
national expansion this page is about.** The page cites OPS-22 for its city counts and not for
its blockers.

**9. Downstream consumers and caches of a re-bake.** Baked node-facets snapshots, the cortex
cached county-gis layer, PMTiles, the PE panel's own adapter. Standing memory records that
record-served cutovers reach MCP and never the browser, and that the cortex cached county-gis
layer has holes the county itself does not. A re-bake that does not invalidate those leaves the
store corrected and the surfaces stale — the opposite of "remediation is a query."

**10. Licensing and tenant exposure of a national store.** If the QA oracle is a licensed
per-call feed, a national store gated on it inherits retention and derivative-rights questions
that `_research/2026-09-12_...:305-308` says are unread, and
`_decisions/2026-06-16_cotality_consumer_display_license_gate.md` is live. CLAUDE.md's
tenant-sovereignty commitment and `accessPolicy` enforcement are portfolio law and appear nowhere
on the page.

**11. Who owns the fan, and the seat topology.** ENFORCEMENT: product repositories have one
owning seat; subagents do not commit; a coordinator that fans and returns abandons its workers;
the integration seat owns no product repo. A 254-county fan is a fleet-topology question before
it is an engineering one, and the page has no line on it.

**12. What "refuses to bake" does operationally.** Section 4 item 3 says a new combination
"REFUSES to bake and queues for class adjudication." Nothing on the page says what drains that
queue, at what rate, or what happens when 13 singleton tuples (F4) arrive in one wave. An
adjudication queue with no drain is a stall disguised as a control.

---

# CLOSING

Thirteen load-bearing claims were identified on the page and taken to source.

**Seven CONFIRMED DEFECT:** the re-bake economy (F1 — wrong denominator by 13-20x, one rail of
65, superseded and proxy citation, a cost model retuned 290x to clear its own gate, unreconciled
against any bill, acquisition absent); the "free" QA oracle (F2 — priced at $0.15 per call in its
own cited source, licence gate live and unread, not independently derived); version keying (F3 —
absent from DDL and from the type, and the ruled axis is not the axis the plan needs); novelty
gating (F4 — the registry exists, is dormant, already recorded Hays, and would false-refuse on a
cleared class); the re-bake loop not reaching the customer (F5); the defect dichotomy (F6 — three
of five misclassified, and the active class on neither side); adversarial-first ordering (F7 —
contradicts a doc in its own frontmatter).

**Five CLAIM SURVIVES:** the 69/23 city counts and all six splits, transcribed and cited
correctly (F8 — though the test built on them is internal consistency, which is its own confirmed
defect); the gate's 17-of-65 denominator, which I nearly mis-scored (F10); the `place_key`
no-collision property, enforced by a database CHECK constraint; the two cell-count arithmetics;
and the page's own central honest claim, that nobody has measured the marginal cost of a county
through a finished pipeline — I searched and found no such measurement either, and F1(d)-(e)
strengthen it rather than weaken it.

**One UNMEASURED:** the true cost of a full county bake. I can establish a floor 13-20x above the
quoted figure on the denominator alone, and name four further multipliers (rail count,
acquisition, external-call term, vendor COGS), but I cannot measure it from this repo. The honest
statement is a floor with no established ceiling.

The document's own section 8 self-assessment is directionally right and materially incomplete: it
flags the depth-cost weakness, the version-keying uncertainty, and the unmeasured marginal cost.
It does not flag that the cost instrument was retuned to pass, that the QA oracle is priced in
its own source, that the novelty registry already exists and is dormant, that 86 percent of Texas
has no landing, or that re-baking does not reach the customer.

The single most useful correction is smaller than the page's proposal, not larger: **arm
`_catalog/tx_cad_source_registry.json` and ratify `_catalog/county_contract_v0.json`.** Both
exist. Neither has a trigger. Building parallel versions of dormant mechanisms is the defect class
ENFORCEMENT opens with.

`leave_behind: none` — read-only review, one artifact, no branch, no store, no parallel project.
