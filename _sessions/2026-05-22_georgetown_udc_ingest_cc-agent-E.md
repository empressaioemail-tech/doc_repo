---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

# Lane E E2 — Sync 5 Tier 1: Georgetown UDC shipped (Path C)

## Status

E2 break-point. Tier 1 city 4 of 6 (Georgetown) is ingested,
eval-passing, on a merge-ready PR. **hauska-engine PR #27**
(`feat(corpus): Sync 5 Tier 1 — Georgetown UDC ingest (Path C /
Municode)`), branched fresh from `main`, CI green expected.

This resumes Sync 5 Tier 1 after the ICC Code Connect prebuild
(PRs #24 merged, #25/#26 open — a separate Layer 1 stack, no
interaction with this Layer 0/3 jurisdictional ingest).

## What shipped

Path C live ingest of the City of Georgetown Unified Development Code
from the Municode JSON API. **658 `code-section` atoms** across the
UDC's 16 chapters, **156 in-corpus cross-references** (all resolved).
Eval **1.0 / 1.0 / 1.0** across 30 curated queries — passes the B.4
quality bar (90% top-3 / 100% section-number / 95% cross-reference).
Tagged `platform-internal` per Path A (non-partnered).

## Source reclassification — a false NEGATIVE

The Tier 1 discovery (and the Round Rock / Leander session notes)
flagged Georgetown for a "Path PDF investigation like Hutto" because
the Code of Ordinances' `Title 17 UDC` TOC node is `children=false`.
That was wrong. Georgetown publishes its UDC as a **separate,
fully-structured Municode code product**: Municode clientId `12078`
carries two products — `Code of Ordinances` (productId 13578) and a
distinct `Unified Development Code` (productId 13943, Supplement 15).
Georgetown is a clean **Path C** city; no PDF anywhere.

This is the converse of the Taylor false positive (looked Path C, was
Path PDF). **The lesson compounds:** the Tier 1 discovery's
TOC-heading scans are unreliable in *both* directions. A `children=false`
node is not proof the content is hosted externally — it can mean the
content is a sibling Municode product. Verify the source content before
classifying, for false negatives as much as false positives.

## New capability — multi-product Municode clientId selection

The `MunicodeHtmlAdapter` JSON walker hardcoded `codes[0]`. That is
correct for the common single-product city but is the *Code of
Ordinances* for Georgetown — walking it would have ingested the wrong
code entirely. The adapter gains an optional `productNameFilter` regex
that picks the `ClientContent.codes[]` entry by `productName`; **unset
preserves byte-identical `codes[0]` behavior** for every existing city
(Bastrop, Elgin, Round Rock, Leander). Threaded through
`PathCIngestOptions`, with an optional `libraryCodePath` so the
canonical `sourceUrl` points at `/codes/unified_development_code`
rather than the hardcoded `code_of_ordinances`. Two conformance tests
cover the default and the filtered selection.

This is a general Path C improvement: any future TX city that splits
its development code into a standalone Municode product is now
ingestable without further adapter work.

## Scope note

The ingest covers the 16 substantive `Chapter N` units (General
Provisions through Definitions). The same-TOC-level non-normative
front/back matter — preamble, supplement-history table, Appendix A
(federal standards for occupied sites), code-comparative table — is
excluded by the chapter filter, consistent with the other Path C
cities scoping to their development chapters.

## Tier 1 ladder status

| City | Source | Status |
|---|---|---|
| Round Rock | Municode Path C | shipped (PR #20) |
| Taylor | Path PDF (city-hosted LDC) | shipped (PR #21) |
| Leander | Municode Path C (exhibit ordinances) | shipped (PR #23) |
| Georgetown | Municode Path C (separate UDC product) | shipped (PR #27) |
| Pflugerville | not on Municode | eCode360 / city-site discovery pending |
| Cedar Park | not on Municode | eCode360 / city-site discovery pending |

## Next

- Pflugerville / Cedar Park discovery; route any eCode360-blocked city
  to the General Code partnership track.
- **`build-corpus-snapshot` refresh + retrieval-api redeploy** — now
  owed for **FOUR** merged-but-undeployed Sync 5 cities (Round Rock,
  Taylor, Leander, Georgetown). The live catalog still serves the
  original 5 jurisdictions. Georgetown is wired into the
  `build-corpus-snapshot` UNITS array, so the batched refresh will
  pick it up.
- ICC Layer 1 corpus ingest remains gated on the operator's Code
  Connect credentials (meeting this week per the prebuild dispatch).

## Notes

- Snapshot not regenerated in PR #27 — per the dispatch the refresh is
  a batched step.
- Georgetown's UDC numbers headings two ways — top-level units as
  `SECTION N.NN` and leaf provisions as `Sec. N.NN.NNN`; both atomize
  to independently retrievable `code-section` atoms. Section numbers
  are decimal-dotted and self-scoping, so no entityId collisions (the
  PR #22 bare-numbered disambiguation does not fire here).
- Durable in-repo record: PR #27 and its description. This is the
  courier copy per HR-11.

---

*Filed from `_inbox/` by the planner sweep, 2026-05-22. Findings rolled into `00_current_state.md` (cc-agent-E fleet status, corpus-refresh watch item). Operator actions surfaced: PR #27 awaits merge; the build-corpus-snapshot refresh + retrieval-api redeploy is now owed for four cities.*
