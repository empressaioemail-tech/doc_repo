# Plan Review — the reasoner path

**Artifact:** https://claude.ai/artifact/WZoV7QPhBYyntZRdUjns5D
**Ruling:** operator, 2026-09-15 — plan review is a COMPANION product, not a plan review
system. No markup, no batch stamping, no measurement tools, no document workflow.
**Relation to `_design/plan-review/`:** that folder is the earlier pass (queue, console,
Dashboards embed) and stands. This one goes deep on the reasoning and its output.
**Decision:** RATIFIED 2026-09-15, `_decisions/2026-09-15_design_ratification_pass.md`.
**Status:** RATIFIED 2026-09-15. Not dispatched. Which of the three plan-review designs a city
is shown is a separate call and is still owed.

Five artboards: console, one finding's derivation, coverage, the correction notice, cycle 2.

## The market frame this was drawn against

The category (Avolve/ProjectDox, DigEplan, GeoCivix, Bluebeam) is a document workflow
product: intake, route to parallel reviewers, mark up, compare versions, batch stamp, track
cycles. The reviewer brings the code knowledge.

**CodeComply.Ai launched March 2026, is embedded in CivicPlus (850+ local governments) and
is endorsed on TXShare**, the Texas cooperative purchasing program. Per its own marketing it
does ICC/NFPA/ADA/FHA plus local amendments, automated checks with markup, and version
comparison. That is vendor copy, not verified capability. We are not early to AI plan review
and we cannot out-distribute that channel.

What its published material does not carry is any accuracy figure, confidence metric or
liability posture. That is the flank, and it is what this design is built on.

## Corrected 2026-09-15, and the correction is the important part

**The first draft's thesis was false.** It asserted that no proposed dimension exists in the
service, so Pass and Fail were unreachable and the viewer was what unlocked them. The code
says the opposite and says it plainly:

- `web/app.js:462` — a live intake field, "Proposed front setback (ft), if known"
- posts `proposedSetbackFrontFt`; `store.mjs` persists `proposed_setback_front_ft`
- `mcp.mjs:308` feeds it to `adjudicateMinimumSetback` as `proposedFt`
- `adjudication.mjs:19` — *"adjudicateSetback() genuinely reaches Pass AND Fail given real
  inputs (see the test file for both cases)"*

The planner quoted from that same comment block while claiming the reverse, having taken a
sentence about the ATOM CHAIN and generalised it to the whole service. The result was a
satisfying insight, so it was not interrogated.

**The corrected thesis is narrower and better.** The one proposed value that exists is a
number a human typed on a form: no source, no sheet, no location. That is the bottom rung of
the provenance ladder these artboards draw. The viewer does not unlock the determination, it
upgrades the input from an assertion to a reading.

Also corrected: five adjudications were shown that have no code path (one adjudicator exists,
for the front setback, and the screen now badges every other rule `NO ADJUDICATOR`);
permitted use was shown as Pass when source sets `adjudicated: null`, so it is Unchecked;
`Uncertain` was shown as machine-derived when no code path emits it and it requires a named
reviewer override with a written reason; the book title "Bastrop Development Code" does not
exist in source (it is "City of Bastrop Building Block B3"); section numbers used dots where
source uses dashes; section `14-02-005` does not exist and was cited six times including in
an issued letter; and the design paraphrased IBC on the same canvas as a panel promising it
would never paraphrase a code it is not licensed to quote (`IBC2018P6.quotable === false`).

The site plan was redrawn: it had the front setback on the side away from the street and four
labelled gaps at four different scales. It is now one scale, 4.8 px per foot, which is exactly
1" = 20' at 96dpi, and every gap is within a tenth of a foot of its label.

## The moves that survived

**Provenance over reachability.** The console's primary action is Capture a dimension, and the
Reasoning artboard shows the input flagged as lowest-provenance because it came from a form.

**A finding with no section shows no citation.** The UDC book holds exactly two sections; a
section outside it returns a typed absence that deliberately carries no citation field. And
finding 6 is blocked from the letter for the same reason — `buildCitation` throws without an
edition, a book and a section. A reviewer's confidence is not a citation.

**Two axes of absence, never added together.** Our corpus could not supply the rule (the four
`ABSENCE_KINDS`), versus the section is fine and no adjudicator exists. Different owners,
different fixes. Plus a third row the taxonomy cannot describe: a whole-chain failure is one
finding about us, never twelve about the code.

**The letter is the product, and its counts tie.** 1 correction + 1 escalation + 10 not
evaluated + 1 held back = 13. An escalation prints under its own heading and asks nothing of
the applicant.

**Cycle 2 carries the case that justifies the two axes.** The applicant supplied a value and
the determination did not move, because what was missing was our adjudicator, not their data.

## Pinned, deliberately

Parallel department review. It is the category's core value proposition and it is not designed
here. Next argument to have.

## Regenerate

    node gen.mjs
