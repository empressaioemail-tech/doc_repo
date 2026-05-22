---
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-E `_inbox/` courier
> drop per HR-11. PR #22 verified **MERGED** via `gh pr view 22`
> (`state: MERGED`, merge commit `fb349b6`). PR #23 — the drop was
> written with #23 "open, CI green expected"; state has since advanced:
> `gh pr view 23` shows `state: MERGED` (mergedAt 2026-05-22T03:28:43Z),
> CI run `26266713482` (`ci` / `typecheck + test`) `conclusion:
> SUCCESS`. Both PRs are merged. Not a 43 or 11_roadmap item, and
> `49_code_ingestion_pipeline.md` tracks the pipeline at architecture
> grain, not per-city, so only `00_current_state.md` rolled. The drop's
> trailing stray `EOF` line (a heredoc artifact) was dropped on filing.

# Lane E E2 — Sync 5 Tier 1: disambiguation fix + Leander shipped

## Status

E2 break-point. Tier 1 city 3 of 6 (Leander) is ingested, eval-passing,
and on a merge-ready PR. The bare-numbered-section disambiguation the
prior session flagged as Leander's blocker is built and merged. Two
further Municode-pipeline defects surfaced during the Leander
re-ingest and are fixed in the same work. Both PRs:

- **PR #22 — merged.** `feat(atoms): bare-numbered section entityId
  disambiguation`.
- **PR #23 — open, CI green expected.** `feat(corpus): Sync 5 Tier 1 —
  Leander Subdivision + Zoning ingest (Path C)`.

## PR #22 — bare-numbered section entityId disambiguation

Leander adopts its substantive code as ordinance exhibits: Chapter 10
"Subdivision Regulation" → Exhibit A, Chapter 14 "Zoning" → Exhibit A,
each with Articles whose sections are bare-numbered and restart per
article. `Sec. 1.` exists under Article I, II, III … of both exhibits.
The atomizer keyed sections `<tenant>/<edition>/<num>`, so every bare
`Sec. 1.` computed the same entityId and the storage write silently
kept one — dropping the rest.

The atomizer now pre-scans for sections whose bare entityId collides
across ≥2 distinct `sourceAnchor`s and re-keys each by its containing
chapter/article path, derived from the `sourceAnchor` (a Municode TOC
`Doc.Id`). **Zero blast radius**: a self-scoping section number
(decimal or chapter-hyphenated — Round Rock `2-13`, Hutto `10.101`,
Taylor `4.2.3`) never forms a collision group, so its entityId is
byte-identical to the pre-fix output. Collision-triggered, not
unconditional, so a non-colliding bare integer keeps its plain id —
Leander's entityId scheme is therefore mixed (colliding sections
prefixed, non-colliding bare), which is correct but inelegant; a fully
consistent scheme would be a follow-up if the planner wants it.

## PR #23 — Leander ingest + two Municode-pipeline fixes

Path C ingest of Leander's Subdivision + Zoning regulations (clientId
2988). **185 code-section atoms, 0 collisions, 0 dropped content.**
Eval 1.0 / 1.0 / 1.0 across 29 curated queries — passes the B.4 bar.
Tagged `platform-internal` (Path A, non-partnered).

Re-ingesting Leander cleanly exposed two pipeline defects, both fixed:

1. **Per-leaf Municode fetching does not scale.** Municode's
   `CodesContent` endpoint returns every Doc in the leaf's *containing
   article*, so a flat per-section walk of a large code (~550 leaf TOC
   nodes for Leander) fires hundreds of redundant requests. They
   throttle out and **silently drop the tail articles** — an
   intermittent, incomplete ingest that wasted several debug cycles
   before the pattern was clear. The walker now groups leaves by
   `ParentId` and skips a leaf once its Id appears in an already-fetched
   sibling's Docs: ~one request per article, with an uncovered/failed
   leaf still fetched in turn so a transient drop self-heals. This is a
   general Path C improvement — every Municode city ingests faster and
   more reliably; atom output is unchanged (same Doc union).

2. **Single-digit section numbers lost the search anchor boost.** The
   storage tokenizer dropped single-character tokens as noise,
   including a lone digit, so Leander's bare `1.`-`9.` section numbers
   never became query tokens and the section-number boost could never
   fire for them. `tokenize` now keeps a lone digit. Round Rock /
   Taylor / Hutto unaffected (multi-character section numbers).

## Tier 1 ladder status

| City | Source | Status |
|---|---|---|
| Round Rock | Municode Path C | shipped (PR #20) |
| Taylor | Path PDF (city-hosted LDC) | shipped (PR #21) |
| Leander | Municode Path C (exhibit ordinances) | shipped (PR #23) |
| Georgetown | Title 17 UDC, `children=false` on TOC | Path PDF investigation pending |
| Pflugerville | not on Municode | eCode360 / city-site discovery pending |
| Cedar Park | not on Municode | eCode360 / city-site discovery pending |

## Next

- Georgetown UDC — Path PDF investigation (likely the same
  adoption-by-reference shape Taylor turned out to be).
- Pflugerville / Cedar Park discovery; route any eCode360-blocked city
  to the General Code partnership track.
- **`build-corpus-snapshot` refresh + retrieval-api redeploy** — now
  owed for THREE merged-but-undeployed cities (Round Rock, Taylor,
  Leander). The live catalog still serves the original 5 jurisdictions.
  This is the batched refresh the dispatch §2 calls for; several Tier 1
  cities have now landed, so it is due.
- E1 Layer 1 becomes priority once the operator confirms ICC API access.

## Notes

- Snapshot not regenerated in PR #23 — per the dispatch the refresh is
  a batched step.
- The Municode non-determinism (run-to-run variance in returned data)
  is real; the per-parent-fetch + self-healing fallback in PR #23 is
  what makes the ingest reliable despite it.
- Durable in-repo record: PRs #22 and #23 and their descriptions. This
  is the courier copy per HR-11.
