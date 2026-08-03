---
id: 2026-08-03_atoms_citations_deep_dive_and_key_desync_fix
title: Session — Atoms/citations deep dive; silent cortex→retrieval 401 found and fixed live
date: 2026-08-03
status: closed
owner: nick
agent: claude_code (planner + 3 sonnet readers)
related: [_research/2026-08-03_atoms_citations_authoritative_sources_deep_dive, 43_cortex_qa_backlog, 00_current_state]
---

# Atoms, citations, authoritative sources — deep dive + live fix

Same-day continuation of the handoff-execution session. Operator caught PE chat answering a Bastrop SF-1 ADU question with hard numbers, no chips, and a "not in current sources" claim, and asked for a deep dive on atoms, citations, and authoritative sources.

## Method

Three parallel read-only Sonnet audits (hauska-engine atom inventory; hauska-map PE chip surfaces; legacy-design-tools cortex chat pipeline), cross-checked against each other, with every load-bearing claim planner-verified by live probes (retrieval `/search` with the service key, Cloud Run env/secret comparison). One reader's open question (does PE send `presentationMode: "pro"`?) was answered by another (hardcoded pro, LOCK 2026-07-29), which ruled out the consumer-mode mechanism and pointed at zero-atom retrieval; the planner then probed the cortex→retrieval auth pair directly and confirmed a live 401.

## Found and fixed

Key desync: cortex-api's `BRIEF_RETRIEVAL_API_KEY` (59-char) no longer matched retrieval-api's `RETRIEVAL_API_KEY` (40-char) after the out-of-band `--source` redeploy. Silent 401 → `degradedReasons` → zero atoms → citationless answers. Fixed live: secret version 2 (sanity-probed 200 pre-write), cortex-api pinned to explicit secret version, revision `cortex-api-00292-cbb` smoke-tested via tag then shifted to 100%. Second occurrence of the key-rotation-on-source-deploy class; second proof for the fail-loud caller-contract lane.

## Structural findings (full detail in the research doc)

The corpus had every answer (BDC 2026 fully atomized incl. district requirements and permitted-use table; planner-probed). Citations are a regex parse of `[n]` markers with no structured atoms-used signal; confidence is a marker-survival proxy; the subject-parcel constraints channel is structurally uncitable; `zoning-fact` has no `sourceCodeAtomRef` edge to its district's code text; the inspect-card facets payload carries no atom DIDs; `/search` mixes superseded editions with no flag; county subdivision regs sit in a separate platform-internal tenant. Ranked 9-item fix list filed in the research doc; QA-37 updated with root cause and residue.

## Owed

- Operator: visual confirm that a Bastrop PRO chat turn now renders atom chips; ruling on consumer-mode citation posture (fix-list item 9).
- Build backlog: fix-list items 2 through 8 (fail-loud, graph edge, card DIDs, citable parcel facts, deterministic citations, edition filter, county-tenant routing).
