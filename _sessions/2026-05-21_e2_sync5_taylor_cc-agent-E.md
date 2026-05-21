---
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
---

# Lane E E2 — Sync 5 Tier 1: Taylor LDC shipped (Path PDF), discovery correction

## What was done

Taylor LDC ingested, eval-passing, merged. `hauska-engine` PR #21 (`9cc287a`).
497 `code-section` atoms across six chapters, eval 1.0/1.0/1.0 against
the B.4 bar (32 curated queries). Tagged `platform-internal` (Path A).

Taylor required a source reclassification: it did NOT ship "the Round
Rock way." The Tier 1 discovery recorded Taylor as Municode Path C (Ch
21 + Appendix C). Reading the actual content showed that wrong —
Chapter 21 is adoption-by-reference only (Sec. 21-1 adopts the "Taylor
Made Land Development Code," Exhibit A to Ord. 2024-41); Appendix C was
repealed. The substantive code is a 239-page born-digital PDF on
taylortx.gov. Taylor is a Path PDF city.

New capability: a `chapter-decimal` raw-PDF heading convention
(standalone `CHAPTER N` headings + chapter-scoped decimal sections),
the generalization the `decimal-numbered` code comment anticipated. 6
conformance tests, plus a measurement-unit guard.

## What was learned

The Tier 1 discovery's "ready" verdicts are TOC-heading scans, not
content reads, and are unreliable. Taylor was the false positive.
Going forward, a top-level chapter's actual section content must be
read before a city is classified Path C. Georgetown, Pflugerville,
Cedar Park classifications are now suspect.

## What's open

- The bare-numbered-section `entityId` disambiguation fix, then a clean
  Leander re-ingest (deterministic in-repo, no external dependency).
- Georgetown — Path PDF investigation (likely the same adoption-by-
  reference shape as Taylor).
- Pflugerville / Cedar Park discovery.
- `build-corpus-snapshot` refresh + retrieval-api redeploy is batched;
  Round Rock and Taylor are both merged-but-not-deployed.
- E1 Layer 1 priority once ICC API access is confirmed.
