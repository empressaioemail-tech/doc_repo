# Falsifier — G-142 Citizen lens design

**Lane:** g142-citizen-lens · **Plan row:** G-142 · **Filed:** 2026-09-18

A falsifier is not a caveat. It is the observation that would show this design wrong, stated so that
somebody who did not build it can go and look.

---

## Falsifier 1 (primary): the word this design chose may itself be a promise

The design replaces the shipped `None on file` with **`Not read`** on the grounds that `None on file`
states a zero about a resident on a lens that does not know who is reading.

**The falsifier: `Not read` can be read as `not read YET`.**

If a resident reads `Not read` and understands *someone will read this shortly*, then the design has
not removed the collapse — it has moved it, from *"you have nothing"* to *"you are in a queue"*. Both
are claims about a resident. One is a zero, the other is a promise, and the second is arguably worse
because it is a promise the product cannot keep: the lens has no identity, so there is no queue to be
in and never will be.

This is not a hypothetical. The four regions are drawn on a board whose other three regions read
`Not connected`, `Not built` and `Not registered`. `Not read` sitting beside them reads as *the same
kind of not, one step earlier* — which is exactly the confusion the design exists to prevent.

**What would settle it:** put `Main.dc.html` in front of somebody who is not on this program and ask
what `Not read` means for *their* address. If they say *"it hasn't been looked at yet"*, the word has
failed and the basis line underneath it is not doing the work the design claims.

**Why it is not fixed here:** the honest fixes are a sixth state word — a vocabulary change to the
atom contract, which this lane has no standing to make — or wording that names the reason
(`No record can be read here`), which is longer than a state word and would have to be tested against
the product's five-word set. The design ships the closest shipped word and carries the distinction in
the basis, and this is filed as the thing most likely to be wrong.

---

## Falsifier 2: the product may already mean something by `None on file`

The design treats `None on file` as a defect because the product's badge vocabulary, declared in
`src/ui.test.mjs`, is exactly `Empty / Not built / Not read / Preview / Not connected` and does not
contain it.

**The falsifier:** the pill is in a `.sc-quiet` span in the `Your requests` panel, and the vocabulary
in `ui.test.mjs` may be the vocabulary of *region* badges rather than the vocabulary of every quiet
pill on the page. If that is the case, `None on file` is inside a second, narrower vocabulary and is
not a defect at all — and this design's headline finding dissolves into a category error.

**Status of the evidence, honestly:** this lane found no comment, no test and no constant that
declares a quiet-pill vocabulary separate from the badge vocabulary. `check.mjs` asserts the pill is
outside the DECLARED set, which is all it can assert. It does not assert that no second set exists.
The finding is stated as *the shipped page prints a word the declared vocabulary does not carry*, and
not as *the product is wrong*.

---

## Falsifier 3: a registered citizen domain collapses the spine

The whole design rests on `DOMAIN_REGISTRY` carrying 0 of 11 entries for `citizen`, measured by
importing the module at `7487d7c0`.

**The falsifier:** one entry with `lensId: "citizen"`. Then the primary distance is not `no region
registered` but `no source connected` — the ordinary late-grant case, indistinguishable from Parks or
Public works — and the four-distances spine is wrong, not merely incomplete.

This is planted in `violate.mjs` as the `premise` case and the instrument aborts with exit 2 rather
than reporting the stale verdict. That is the correct behaviour and it is also the reason the
falsifier is cheap to apply: the moment the premise moves, the check stops speaking instead of
speaking wrongly.

---

## Falsifier 4: the fixture board is the board that matters, and it is badged

`Filled.dc.html` is badged DEMO FIXTURE in three places and its rows are labelled as fixture rows.
The dispatch requires this and the discipline is right.

**The falsifier:** a reader who opens only that board sees a lens with a measured 1 and a measured 0
and concludes the Citizen lens carries data. The badge is chrome in the top bar; a screenshot crops
chrome. If the boards travel as images — and design boards in this program do — then three badges in
the document do not survive a crop, and the fixture board becomes a lie by framing rather than by
content.

**Partly mitigated, not settled:** every fixture row carries its own marker, so a cropped board still
carries at least one. Whether that is enough is a judgement for whoever ratifies this design, not a
claim this lane can make.

---

## What would NOT falsify it (named so the noise is excluded)

- A new lens appearing in the nav. The design is about `citizen`; other surfaces moving is not a
  contradiction.
- The twelve-tile grid reappearing on a *different* lens. `check.mjs` refuses a tile in THIS folder
  only, which is its scope.
- `bastrop_tx` gaining a citizen-facing feed. That is the `no source connected` state arriving, which
  the design already draws and the instrument already anticipates.
- The design being rejected for style. That is not this artefact's claim.
