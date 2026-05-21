---
date: 2026-05-20
agent: cc-agent-E
repo: hauska-engine
session_type: execute
rolled_up: false
---

# Hutto TX UDC ingest — HUTTO.1 gate + reshaped HUTTO.2-5

## What was done

The Hutto TX prioritized one-off ingest dispatch ran in full. HUTTO.1 (platform verification) found a split the provisional decision record did not anticipate, the operator authorized a reshape, and HUTTO.2 through HUTTO.5 then executed against the reshaped scope. Shipped as [`hauska-engine` PR #15](https://github.com/empressaioemail-tech/hauska-engine/pull/15) on branch `stream-1d/hutto-udc-ingest`.

### HUTTO.1 — platform verification

The City of Hutto publishes two codes on two sources. The general Code of Ordinances is on eCode360 (General Code) at https://ecode360.com/HU6354, current through Ordinance O-2026-003 (2026-02-19). A programmatic GET returned HTTP 403 Forbidden: the Smithville pattern, access-blocked. The legacy Franklin Legal link on the city site now 301-redirects to generalcode.com, so both publisher paths converge on General Code. The Unified Development Code, by contrast, is Chapter 16 of the Code of Ordinances but is hosted separately as a freely downloadable born-digital PDF on the city website (11.4 MB, 362 pages, Revised March 2024). The UDC is the zoning and development code, the highest-value code for Codex plan review, and it is programmatically ingestable.

The gate as written was binary (Municode, ingest; eCode360, stop). The operator chose the reshape: ingest the UDC now via Path PDF, route the eCode360 general code to the bizops General Code partnership track.

### HUTTO.2 — UDC ingest

The B3-tuned raw-PDF normalizer recognized nothing in Hutto's numbering (it parsed 1 section from 362 pages). Hutto numbers sections decimal-dotted and mixed case (`10.101`, `10.303.2`, down to six-level `10.203.7.3.2.1`), with no `SEC.` prefix and the chapter label only in a per-page running header. This is a third heading convention after Bastrop B3 and Bastrop County, so the session built a new B.2 capability: a `decimal-numbered` heading convention in the raw-PDF normalizer, opt-in via `PdfNormalizeOptions.headingConvention`, with the default caps-prefixed convention left untouched. The normalizer skips front matter and per-chapter mini-tables-of-contents; `path-pdf-ingest` dedup now keeps the richest section per entityId so a mini-TOC line cannot starve the real body heading of rule text.

Ingest result: 1716 `code-section` atoms, 188 `code-cross-reference` atoms, 1 `code-edition` atom, 1 `jurisdiction-corpus` atom, 1905 atom links. 0 `code-definition` atoms: the raw-PDF path does not emit definition blocks, consistent with the Bastrop B3 precedent; Hutto's `10.202.2 Definitions` content is carried as that section's body text. 0 `code-amendment` atoms: out of scope for this ingest. The `jurisdiction-corpus` atom DID is `did:hauska:jurisdiction-corpus:hutto_tx`; the edition DID is `did:hauska:code-edition:hutto_tx/hutto-udc-march-2024`.

### HUTTO.3 — Path A access tagging

Every Hutto atom is tagged `accessPolicy: platform-internal` (Hutto partnership-pending), consistent with the Elgin and Bastrop County precedent. None are `public-free`. The tag flips to `public-free` on partnership close.

### HUTTO.4 — eval harness

27 curated queries spanning all ten internal chapters of the UDC. B.4 eval scores: 1.0 top-3 retrieval, 1.0 section-number retrievability, 1.0 cross-reference resolution. Passes the 90 / 100 / 95 quality bar. Hutto UDC is declared loaded. This matches the Bastrop UDC, Bastrop County and Elgin results (all 1.0 / 1.0 / 1.0).

### HUTTO.5 — cost checkpoint

Compute: the UDC is a born-digital PDF, so the ingest path is local pdfjs text extraction plus atomization with no LLM, OCR, or embedding spend. The only external cost is the PDF download (about 45 MB of egress across the probe and ingest runs). Effective metered compute cost is near zero, far under the 200-dollar envelope. Human review: curated-query authoring, extraction spot-check, and one query-tuning iteration, under one hour of reviewer-equivalent time. The session also spent engineering effort building the `decimal-numbered` B.2 convention, but that is a one-time capability investment that amortizes across every future decimal-numbered jurisdiction, not a per-jurisdiction marginal cost. Verdict: well within the 200-dollar-compute and one-hour-review envelope. No cost-rule escalation.

## What was learned (changes to ground truth)

Hutto did not match the decision record's Municode-or-eCode360 binary. The reality is a split: general code on eCode360 (blocked), UDC as a free city-hosted PDF (ingestable). The reshaped dispatch handled it.

Hutto's UDC numbers provisions to six levels deep, producing 1716 section atoms from a 362-page code. This is far more than Bastrop B3 (181) or Elgin (210), but it is granularity of numbering, not over-extraction: Hutto gives every individual requirement its own `10.x.x.x.x.x` number, where other codes would leave those as unnumbered subsections. Each is independently retrievable, which is good for plan-review citation.

The corpus is in-memory (the Postgres-backed StoragePort is a later sprint); Hutto is "loaded" in the same sense as Bastrop B3 and Elgin, namely a committed, eval-passing, reproducible ingest command.

## What's still open

Three items for the planner, none an agent-lane call.

1. The eCode360 general Code of Ordinances. Route to the bizops General Code partnership-API track in `73_partnerships.md`, alongside Smithville. One partnership covers both the eCode360 code and legacy Franklin Legal content, since General Code owns both, and it unblocks the entire eCode360 bucket (a large share of Texas cities), not just Hutto.

2. Layered code substrate. The operator proposed, and it is the right architecture, decomposing a municipal code into three layers: a shared model-code base (IRC, IBC, IFC, IMC, IPC, IFGC, IECC, NEC by edition, roughly 30 to 40 documents covering essentially every Texas city), a per-jurisdiction amendment overlay, and the bespoke local code (zoning/UDC plus local ordinance chapters). This closes the two open-design items in `49_code_ingestion_pipeline.md` (cross-jurisdictional code reuse, custom-amendment handling) and reshapes the cost model: ingest the base once, and each new city is a cheap amendment-plus-zoning ingest sourced through partnership referrals. The legal exposure on the model-code bodies (ICC and NFPA copyright; Veeck v. SBCCI favorable in the 5th Circuit; ICC v. UpCodes contested) is exactly what the pending IP attorney memo gates, so the memo's scope should be extended to cover hosting model-code text of Texas-adopted editions. An interim that sidesteps most of the exposure and fits the sell-reasoning-not-data commitment: deep-link the base text to ICC and NFPA free viewers, host only the amendment overlay and the reasoning. Recommend the planner open a decision record or ADR for the layered substrate.

3. ICC commercial-layer pitch. The operator's framing: pitch the Hauska commercial layer to the ICC itself, as the substrate that lets the ICC get paid when agents retrieve their code. This turns the model-code copyright problem from a blocker into a partnership: the ICC becomes a licensor with revenue share (the partnership-first template, the same shape as the city and General Code tracks), and the payment substrate meters agent retrieval. Worth routing to bizops alongside the General Code track and folding into the IP-memo framing, since a licensing partnership with the ICC moots the copyright question entirely.

The UDC's draft replacement (a new UDC and Engineering Criteria Manual are in public review) will supersede the March 2024 adopted edition on adoption; B.5 version tracking should expect a near-term Hutto UDC edition change.

## Suggested canonical doc updates

- `_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`: flip `status: provisional` to `active`, scope narrowed to the UDC. Record that the UDC ingested and passed eval, and that the eCode360 general code routes to the General Code partnership track.
- `49_code_ingestion_pipeline.md`: add Hutto, TX UDC to coverage (1716 atoms, Path PDF, eval 1.0 / 1.0 / 1.0, `platform-internal`). Note the `decimal-numbered` B.2 convention now exists. The layered-substrate proposal bears on the two open-design items here.
- `51_substrate_v1_sprint.md`: note Hutto UDC loaded as a prioritized one-off; corpus total rises by 1716 section atoms.
- `73_partnerships.md`: add Hutto, TX to the General Code partnership-API track alongside Smithville (covers the eCode360 general code). Note the operator's ICC commercial-layer pitch as a prospective licensor partnership.
- `43_cortex_qa_backlog.md`: QA-10 (add Hutto) closed for the UDC; the general code remains pending the partnership.
