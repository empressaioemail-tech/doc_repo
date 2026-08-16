---
id: rd_dt_11_gtm_thoughts
title: GTM thoughts — running capture
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [rd_dt_08_build_scope, rd_dt_04_gtm_capture_plan, rd_dt_05_securities_pivot, _decisions/2026-08-15_digital_economies_session_rulings]
purpose: Running capture of go-to-market thinking for Smart Markets, logged as it occurs during the build rather than assembled afterward. Append-only. Operator input is recorded as given; planner commentary is separated and marked. This is not a plan; doc 04 is the (partly superseded) plan and any entry here that hardens into a decision gets its own record in _decisions/.
---

# GTM thoughts, running capture

## How this doc works

Append-only, newest entry at the bottom, each one dated. Operator input is recorded as given and is not edited to fit a thesis. Planner commentary sits under its own heading so the two never blur. Nothing here is a decision. When an entry hardens into one it moves to `_decisions/` with reversal criteria, and this doc keeps the thought that led there.

---

## 2026-08-16 — Traction first, because the window is finite

**Operator input.** One of the core business strategies here is to get as much traction as we can on what we are doing, because it is only a matter of time before the big players want to do their own version. We have a very unique setup and structure, one I am comfortable with, and we could sell it to them later.

**What this says, stated plainly.** Traction is the strategy rather than a consequence of the strategy. The clock is incumbent entry, not competitor entry, and it is assumed rather than hoped against. The asset being built is the structure itself. Selling to an incumbent is a live and acceptable outcome, not a fallback.

### Planner commentary

This reframes what the build is optimising for, and it is worth being explicit because the build decisions look different under it.

If the exit option is a sale to an incumbent, then the thing being sold is not the code. Incumbents can write code. What they cannot buy quickly is the part that only accrues with time: the calibration record, the evidence chains, the adapter know-how across authorities that each behave differently, and a corpus with provenance already attached. That is the same asymmetry canon already names as the moat, and it argues for treating those assets as the product rather than as exhaust from the product. It also argues for capturing them deliberately from the first cohort, because a calibration ledger that starts late cannot be backfilled.

There is a tension here worth tracking rather than resolving today. Doc 04's stage D is "become the standard," published openly, on the theory that the author of a standard becomes its reference implementation. A published standard with real adoption is genuine leverage in an acquisition conversation, because the acquirer is buying a position they cannot replicate by building. But a standard is not itself sellable, so the two strategies have to be run knowing which asset is the one changing hands: the standard creates the position, the operating machinery and the accrued record are what transfer. Getting that backwards would mean giving away the sellable part and keeping the unsellable part.

Traction as the primary metric also has a measurement consequence. If traction is the strategy, it needs an instrument, and "usage telemetry becomes the proof artifact" from doc 06 is currently a sentence rather than a mechanism. Whatever the metric is, agent calls, distinct instruments queried, issuers who claim a twin, it should be instrumented in the first release rather than reconstructed later, for the same reason the calibration ledger has to start early.

One open thread this raises and does not answer: incumbent entry is assumed, but nobody has written down who the specific incumbents are for the instrument-twin surface, or what the observable early signals of their entry would look like. That is worth a pass, because "it is only a matter of time" is more actionable with a named list and a set of tripwires than as a general expectation.

---

## 2026-08-16 — Contribute or pay, and where a barter is allowed to sit

**Operator input.** Contribute-or-pay is the right shape, to a certain extent, and we can fine-tune later.

**What was decided.** The Attention layer, the count of participants who have marked a band, is earned either by contributing your own declared levels or by paying. Every other layer keeps the existing tier model. Recorded with reasoning and reversal criteria in `_decisions/2026-08-16_contribute_or_pay_attention_layer.md`.

### Planner commentary

The GTM consequence worth holding on to is that this keeps traction and monetisation from fighting each other. A door gate would have traded discovery for corpus, which is the wrong trade for a strategy whose first entry in this doc says traction is the strategy. Putting the barter one layer in means the free surface stays as findable as it was, while the thing a competitor cannot clone is the thing that costs something.

It also changes what "traction" should be measured as. Under a free read-only funnel the metric is calls and distinct instruments. Under contribute-or-pay there is a second and better metric: the ratio of readers who become contributors. That number is the leading indicator of whether the Attention layer will ever be worth anything, and it is observable long before the layer ships. It should be instrumented with the write path in TW-27, not after.

One thread this leaves open and worth naming: nobody has asked counsel whether publishing aggregate declared intent carries a regulatory characterisation. It is not positioning data in the CFTC sense, because declared intent is not a held position, and that distinction is exactly what makes it novel and therefore untested. Not a blocker at R&D scale, but it belongs on the counsel agenda before the layer is public.
