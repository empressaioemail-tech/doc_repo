---
id: 2026-08-18_TW-51_futures_symbol_form_aliasing_brief
title: TW-51 — one node per futures contract, both symbol forms as aliases
status: dispatch-ready
last_updated: 2026-08-18
applies_to: empressa-trading
owner: nick
authority: D-084 (alias-era backfill; form-collision pairs excluded and reported)
related:
  [
    _inbox/2026-08-18_TW-47_security_master_dedupe_brief.md,
    _inbox/2026-08-18_TW-47_dedupe_close.md,
  ]
---

# TW-51 — the futures split is already costing us, and dropping a form is the wrong fix

## The measurement

Against production, with the service key:

    GC   -> sec_01KXBTSZ4HNG0VRDXFZ8S11FHD
    /GC  -> sec_01KXPQ3H44YZQ8FB52HHTC8XJN
    CL   -> sec_01KX712ZQX3VF43FWWXZGETRTN
    /CL  -> sec_01KXPQ6XS4MJ1K4KWZJ4TNN71K

Two nodes per contract. TW-47 excluded these 21 form-collision pairs from its
merge rule and reported them, correctly, as an operator decision.

And the trading system keys on the slash form. Every one of the 11 instruments
in `app/data/futures_catalog.json` is slash-form:

    /GC /SI /CL /NG /RB /ZB /ZN /ZT /M6E /M6B (+1)

Zero bare forms.

## Why "drop the slash" is the wrong instinct

Retiring the slash form would retire the symbol every futures feed emits. It is
the live form, not the vestigial one.

But keeping two nodes is also wrong, and is already wrong today: data written
against one form is invisible from the other. Anything correlating a driver
series, a COT row, or a quote keyed `/CL` against a twin resolved from `CL`
joins nothing, silently.

The union passes the symbol through as given, so `/v0.1/twin/%2FGC` and
`/v0.1/twin/GC` address two different instruments right now.

## The fix

**One node per contract, both symbol forms as `identity.symbol` alias eras on
it.** This is the machinery D-084 just exercised at scale, 9,981 eras written
against a stated expectation of exactly 9,981.

Then:
- feeds keep emitting `/CL` with no upstream change
- `CL` resolves to the same node
- correlation keys on the NODE ID, which is stable across symbol changes by
  design; that is the entire reason the security master exists

## The one thing to establish before choosing a survivor

**Which node the historical data actually hangs off.** The slash form is what
the feeds emit and therefore the likely answer, but likely is not measured, and
"obviously the duplicates are live" is exactly the reasoning that produced the
retracted 24-duplicate count. Measure it. Then make the node the data is on the
survivor, and alias the other form onto it.

TW-44a established a related trap: identifier rows are read on the canonical id
only, so a merge that does not re-point them strands them invisibly. Decide
that deliberately for whichever direction the merge runs, and say which you chose.

## Shape of the run — as TW-47, which worked

- Dry run first; its output is the reviewable artifact. Per pair: both node ids,
  which is the survivor, what evidence chose it, which alias eras would be
  written, and what data is attached to each side.
- State expected counts before applying, re-verify after. TW-47's exactness
  (9,981 against 9,981) is the standard.
- Snapshot both sides; record the reversal. Never touch A/B arms, bot state,
  positions, stops, or the ledger. Serialize against the soak.
- Do not mint. Alias and merge only.
- Tag the cohort so it stays separable, as `tw47_backfill` did.

## Verification

    GET /securities/lookup?symbol=/CL   ->  node X
    GET /securities/lookup?symbol=CL    ->  node X   (the SAME id)
    GET /securities/node/X              ->  200, future, the contract's facts

Then from the union, anonymously:

    GET /v0.1/twin/%2FCL   and   GET /v0.1/twin/CL   ->  the same node id

Confirm across all 21 pairs, not a sample. TW-47's own retraction came from a
count that was never checked against the filter it assumed.
