# MISSION - OPS-21 R1: not_specified remediation, three populations three ways (P-146)

## The one sentence that governs this lane

**547,657 cells carry the flag. Roughly 234,000 of them are CORRECT and must not move.** A
lane that remediates the flag population instead of the defect population flips a quarter of a
million right answers into wrong ones, which is worse than the defect it set out to fix.

If you find yourself writing a query scoped to "cells written absent-verified under
`ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED`", stop. That is the flag population.

## Operator ruling you are implementing

`_decisions/2026-09-11_not_specified_semantics_and_no_approximation_state.md`, Ruling 1.
Evidence and the per-(jurisdiction, field) classification table:
`_inbox/2026-09-11_corpus_not_specified_audit.md`. OPS-21-S2's own per-district live cell
counts, derived independently and matching exactly:
`_inbox/2026-09-11_ops21-s2_close.json`.

| Class | Slots | What you do |
|---|---|---|
| `SENTINEL_UNIFORM` | 225 | **NOTHING.** `absent-verified` is correct. ~234,000 cells. Do not touch them, do not re-write them with better provenance, do not "confirm" them |
| `REAL_VALUE_FLAGGED` | 72 | Write `value` from the transcribed corpus value |
| `SENTINEL_SUSPECT_IN_MIXED_GROUP` | 32 | Write `refused` — NOT `absent-verified`, NOT `value` |

**`refused` is correct for the 32 and the reasoning matters:** a real limit may exist and the
source cannot say which. That is that state's definition. Do not improve on it.

## STANDING FACTS

- **Scope by (jurisdiction, FIELD). NEVER by jurisdiction.** A city is routinely a placeholder
  on one field and a transcription on the other — `san-antonio-tx`, `cedar-park-tx`,
  `pflugerville-tx` and `liberty-hill-tx` all are. A city-scoped remediation will be wrong.
- **Re-run S2's own resolver, do not write a second one.** `factory parcel-envelope-cells
  --apply` with corrected flag classification. Its writes are already gated never to regress an
  earned cell, so a corrected re-run moves only cells still sitting `absent-verified`.
- **Live codes do not map one-to-one onto corpus district labels.** Liberty Hill's live `I-1`
  and `I1` both resolve to a single corpus district by prefix match. Use
  `envelope-corpus-lookup.mjs` against the per-district table, **not** a direct code join. A
  naive join undercounts — S2 says so explicitly.
- **Two jurisdictions are NOT YET RESOLVED** in the audit: `taylor-tx` maxLotCoveragePct and
  `lockhart-tx` on both fields. Finish them with the lookup above and report the counts; do not
  infer them from the city's other field.
- **Hays (48209) is excluded.** P-145 has not landed.
- **The four rails S2 deferred (3P-14) stay untouched.** Ruled 2026-09-11: no approximation
  state, the trigger is the road-frontage acquisition. Do not revisit.
- Three stores, two named `neondb`. `parcel_record_cell` is on `FACTORY_DATABASE_URL`
  (`ep-round-base-au0jofwp`); the cortex tables are on a different host. No SQL join across them.

## YOUR LANE CARRIES A RETIREMENT ITEM - this is not optional

The classification table you build in hauska-factory is a **workaround for a defect that lives
in the corpus.** Storing `999` for height and `100` for coverage as placeholders is what
ENFORCEMENT prohibits outright. You are compensating for it downstream because the corpus is a
separate repo with its own owner and the cells need unblocking now.

Per the ENFORCEMENT retirement rule, a change that says "read it this way instead" carries a
retirement item for the old way in the same card. Yours is **3P-15**: when the corpus stops
storing sentinels and stops flagging transcribed values, this table retires. State that in your
close, name where the table lives so a future lane can find and delete it, and do not let it
become permanent by silence.

## Completion predicate

Not "fewer absent-verified cells." Three separate counts, each reconciled:

1. `REAL_VALUE_FLAGGED` cells now `value`, count matching the audit's per-district table.
2. `SENTINEL_SUSPECT_IN_MIXED_GROUP` cells now `refused`, count matching.
3. **`SENTINEL_UNIFORM` cells UNCHANGED — measure this and prove it.** A before/after count on
   that population that does not match exactly is a failed lane, not a rounding difference.

Plus `taylor-tx` and `lockhart-tx` resolved and counted.

## Out of scope
Editing the corpus repo. The four 3P-14 rails. Hays. Writing a second resolver. Adjudicating
the 32 against actual ordinances — they get `refused` and stay countable for a later pass.
