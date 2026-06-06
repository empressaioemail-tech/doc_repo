---
id: 2026-05-29_cc-agent-C_brief_retrieval_regrid_polish
title: Dispatch — Property Brief retrieval + Regrid prompt polish (PB-005, PB-006, ADU)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75c_property_brief_data_backlog, 2026-05-28_central-tx-property-brief-scope, 2026-05-28_dispatch-A_ldt_place-graph-brief]
blocked_on: PR #134 merged on main (2de10040); optional after federal-layers PR to reduce merge conflicts
---

# Property Brief — retrieval, Regrid, Bastrop ADU polish

You are **cc-agent-C** on `legacy-design-tools`.

**Backlog:** [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) **PB-005**, **PB-006**, plus Bastrop ADU depth (operator pilot feedback 2026-05-29).

## Model (HR-12)

Default: **Grok Build 0.1**.

## Branch

`cortex/brief-retrieval-regrid-polish` from **`main`** @ merge of PR #134 (`2de10040` or newer).

**Do not** share a worktree with `cortex/brief-federal-site-context` or `cortex/encumbrance-r4` agents.

## PB-006 — Richer Regrid in snapshots

1. Ensure full Premium Regrid payload is stored in `place_layer_snapshots` (already written on fetch; verify).
2. Extend `formatSiteContextForLlm` / brief prompt assembly to surface zoning, land use, owner, APN, `ll_uuid` beyond three-line summary.
3. Map parcel fields into `atoms.placeLayers` / `inlineRefs` parcel ref when Regrid ok.

## PB-005 — `BRIEF_CODE_RETRIEVAL=mcp`

1. Wire `@workspace/codes` `retrieveAtomsForQuestion` to call substrate MCP/search when `BRIEF_CODE_RETRIEVAL=mcp` (document in `lib/codes/src/retrieval.ts`).
2. Jurisdiction slug = `jurisdiction_key` (e.g. `bastrop_tx`, `round_rock_tx`).
3. Fall back to neon with warn log on MCP failure (keep current behavior).
4. Unit test with mocked MCP client.

Handoff doc: `hauska-engine/services/retrieval-api/docs/brief-code-retrieval-mcp.md`.

## Bastrop ADU + research chat depth

Operator saw: `in_corpus` but chat says "code sections do not include ADU rules."

1. Audit `brokerageBrief.ts` code query templates — ensure ADU-oriented `retrieveAtomsForQuestion` queries fire (not only generic five queries).
2. Pass **retrieved section text/snippets** into research chat context (not only atom DIDs).
3. Raise useful `atoms.inlineRefs` for top code hits (max 3) on `/brief`.
4. Add test: Bastrop fixture address returns ≥1 citation whose snippet mentions accessory / ADU / secondary unit (or document corpus gap in close report).

## Out of scope

- Neon load (cc-agent-E / operator)
- Federal adapters (separate dispatch PB-003)
- Encumbrance upload (PB-301)
- Paywall

## Acceptance

- [ ] Regrid ok → LLM site context includes zoning + APN (or explicit fields list in close report).
- [ ] `BRIEF_CODE_RETRIEVAL=mcp` path tested with mock; neon default unchanged.
- [ ] Bastrop smoke: `/brief` `citations[]` non-empty; ADU starter prompt gets non-generic reply in integration test or documented gap.
- [ ] PR held for operator merge.

## Report back

`P:/doc_repo/_inbox/2026-05-29_legacy-design-tools_cc-agent-C_brief_retrieval_regrid_polish_close.md`
