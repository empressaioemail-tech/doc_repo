---
id: 2026-09-08_pdf-text-extraction-instrument_finding
title: The ffi ligature defect, and what it does to PDF content verification
date: 2026-09-08
status: open, for R-08 to act on
plan_row: P-120 (OPS-16)
owner: planner (doc_repo, integration seat)
snapshot: hauska-engine origin/main at 661f620b, read 2026-09-08 via `git show`/`git grep` against that ref. No PDF was rendered or extracted for this finding; the `oŬce` observation is the operator's, from a viewer.
related:
  - _dispatches/2026-09-08_r-08_dispatch.md
  - _inbox/2026-09-07_records-worker_fabricated-zero-guard-fails-open_finding.md
---

# The ffi ligature defect and the instrument that reads these PDFs

## The observation

A rendered Feasibility PDF shows `county tax oŬce`. The source string is plain
ASCII in `report-model.ts:168`:
`"Confirm special-district membership with the county tax office."` So the
corruption happens at render or extract time, never in storage. `Ŭ` is U+016C,
the signature of a ligature glyph index read back through a bad ToUnicode map.

## What narrows it to ffi specifically

The defect is NOT general to ligatures, and this is provable from assertions
that pass today.

`fi` and `fl` decode correctly. `feasibility.test.ts` and
`sheet-standard.test.ts` both assert strings containing them and both are green:
`"not on file"`, `"No flood-hazard-fact atom on file"`, `"D8 flow accumulation"`,
`"fixture label"`. If two-letter ligatures were mismapped, every one of those
would fail.

`office` is the one common English word in this corpus carrying `ffi`. So the
suspect is the three-letter ligature, not the font embed as a whole. That is a
much smaller fix than "the font is broken" and it should be confirmed before
anything is changed.

## The instrument problem, which is the larger half

The repo verifies PDF CONTENT by extracting text, and it does so through the
PDF's own ToUnicode CMap.

`pdf/__tests__/decode-pdf-text.ts` builds a glyph-to-unicode map by parsing the
document's `beginbfchar` blocks and inverting them, then remaps content-stream
glyph codes through it. Ten test files import that helper, covering every one of
the four products.

So the tests read text back through the same map that is suspected of producing
`oŬce`. Test and defect share the instrument. That does not make the tests
useless, but it means a passing content assertion is not independent evidence
about what the PDF says.

Two further facts about that helper:

It already carries a workaround for a known CMap defect. Its own comment notes
that "a handful of subset glyph codes map to U+0000 in one weight's CMap" and it
keeps the first non-null mapping so a real character is not clobbered. The
ToUnicode map is therefore already known to be imperfect, and the helper
compensates rather than reporting.

Its documented assumption is stale. The comment says the sheet embeds **Inter**.
Every one of the four renderers embeds **Barlow** (`Barlow-Regular`,
`Barlow-Medium`, `BarlowCondensed-Medium`, `BarlowCondensed-SemiBold`). Nothing
loads Inter. A helper documented for one font stack is being used against
another across every PDF test in the program.

## The assertion that stops one word short

`feasibility.test.ts:104` asserts `toContain("Confirm special-district membership")`.

That is the only assertion anywhere on that string, and it ends exactly one word
before `office`. The full sentence is never asserted.

Two mechanisms produce that, and this finding does not choose between them:

1. It was written short by chance. Short prefix assertions are ordinary.
2. Someone wrote the full sentence, found it did not match because `office`
   decoded as `oŬce`, and shortened the assertion until it passed.

Mechanism 2 would be the third instance in two days of a test pinning a defect
as a specification, after the records-worker `hays-erss` fail-open assertion and
the planner's own narrative-fallback test. It is checkable: read the commit that
introduced that line and see whether the string was shortened.

Do not report mechanism 2 as established without that read. Do not report
mechanism 1 either.

## What follows for the record

`git blame` the assertion. Then establish whether the PDF DISPLAYS wrong or only
EXTRACTS wrong, because the consequences differ:

- **Displays wrong**: a visible customer defect in one word, and content tests
  are broadly sound.
- **Extracts wrong only**: the PDF is fine for readers, and copy-paste, search
  and screen readers are broken. More importantly, every content claim this
  program has made by extraction rests on an instrument with a known-imperfect
  map and a stale font assumption.

P-124's evidence is NOT exposed. Confirmed by doc-repo-26: its verification was
SQL counts, code reads of write paths, `gh api` merge state, Cloud Run traffic
read by field name, image digests resolved to commits, and one source-tree diff
from a running image. No lane there verified anything by extracting PDF text.

P-120's own record is partly exposed. Claims about BYTE COUNTS, page counts and
`%PDF` magic numbers survive intact, including A-108's Feasibility export
verification and this session's live before/after on 48021:52726 and
48021:52727, which used HTTP status and JSON response fields only. Claims about
what a PDF SAID do not survive without re-verification.

Fix the instrument before the string. Fixing the string first would hide the
instrument failure while appearing to resolve it.
