---
decision_id: 2026-08-24_pe_chat_labeled_websearch_backup
date: 2026-08-24
owner: operator
status: active
related_canonical:
  - _decisions/2026-06-17_brief_national_baseline_websearch_coverage.md
  - _decisions/2026-06-08_websearch_code_grounding_supersedes_interim_atoms.md
  - 08_tiered_access_model.md
  - _inbox/2026-08-24_phase_close_live_qa_WDLL.md
---

## Decision

When Smart Site AI chat cannot answer from the corpus, it runs a labeled web-search of trusted civic sources and cites that answer as a web-search backup. It does not stop at "not in the current data" or "check the ISD yourself" when an official public page can be fetched and attributed.

## Context

Live QA 2026-08-24 on 906 Chestnut. Chat refused school assignment and GC ADU / additional unit / subdivision rules as missing from current sources, then pointed the user at BISD or city staff. The brief already has a labeled web-search fallback (2026-06-17). PE chat did not use it. The operator asked for web-search from trusted sources as a backup to corpus data, cited as such.

## Structural commitment check

Sell reasoning, not data: aligned. Web text is not hosted as a catalog atom. Citation id is `websearch:` (or equivalent), disclosure required.

Confidence is earned: aligned. Web-search path is asserted with provenance and timestamp, never shown as earned corpus.

Cost per jurisdiction: aligned. On-demand fetch, no new county ingest.

MCP-first: partial. This is the existing UI-first PE chat path. No new MCP server.

## Reasoning

Honest corpus-miss is correct. Stopping there when the official ISD or city page exists is a product hole, not a virtue. The 2026-06-17 brief rule already forbids presenting web-scraped content as verified data. Reuse that path and allowlist. Do not invent a second scraper. Do not pull ICC body.

Trusted sources for this card: official independent school district sites, TEA, city and county official domains. Not blogs, not aggregators, not licensed code viewers.

## Reversal criteria

If labeled web-search produces enough wrong school or zoning answers that it erodes the cited corpus product, narrow to "official lookup link only" rather than restore a hard refuse. If a source require-login or ToS-blocks fetch, that domain drops from the allowlist; the answer becomes a named link, not a paraphrase.

## Dependencies

Existing brief / chat web-search grounding. PE citation chip must distinguish web-search from atom. ICC hold list unchanged.
