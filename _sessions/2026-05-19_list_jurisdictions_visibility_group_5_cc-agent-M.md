---
id: 2026-05-19_list_jurisdictions_visibility_group_5_cc-agent-M
title: Session — hauska-mcp-server Lane B Group 5 (list_jurisdictions visibility filter; atom-contract v1.1.0 pick-up)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 5 of the 2026-05-19 Cortex/Codex sprint per [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](../_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). Implements Path A from the sprint pre-mortem: partnership-pending jurisdictions (Smithville, Elgin, Bastrop County) ingest as internal-tier and stay hidden from the public catalog. Shipped on feature branch `feat/list-jurisdictions-visibility`; PR open at [empressaioemail-tech/hauska-mcp-server#4](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/4). Single commit `4c76346` on top of PR #3's squash-merge `b2e224e`.

**Lane Foundation v1.1.0 picked up.** Bumped `@hauska/atom-contract` from `^1.0.0` to `^1.1.0` in [`package.json`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/list-jurisdictions-visibility/package.json). cc-agent-AC took **Path R** per their `hauska-atom-contract` repo commit `6b2c497 feat: v1.1.0 wire ADR-017 accessPolicy into AtomRegistration + ContextSummary` — they reused the existing ADR-017 `accessPolicy` field rather than adding a new `visibility` field per the dispatch's Path R / Path N decision tree.

**Wire-type mirror updated.** [`src/hauska-client.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/list-jurisdictions-visibility/src/hauska-client.ts) `JurisdictionStatusSnapshot` interface now carries `accessPolicy?: AccessPolicy` mirroring the engine's `packages/storage/src/port.ts:60` shape. The field is optional on the wire and absent rows default to `'public-free'` per the engine docstring; this preserves backward compatibility with pre-1.1.0 engine builds that don't surface the field.

**Filter logic.** [`src/tools.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/list-jurisdictions-visibility/src/tools.ts) `list_jurisdictions` handler now filters the response based on the caller's `tier`:

- `free_anonymous` → only jurisdictions with `accessPolicy === 'public-free'` or absent (treated as public-free).
- Any authenticated tier (`free`, `developer_pro`, `team`, `embedder`) → all jurisdictions including `platform-internal`.

`'public-paid'` is explicitly NOT visible to public callers; the "paid" half is the gate even though the name contains "public". The filter is the simplest defensible rule that matches the dispatch wording ("unauthenticated callers see only public-tier; show all for platform-internal callers"). Logging on the tool call now surfaces both the post-filter `count` and the `total_count` plus `filtered_out` delta so operator-side dashboards can see how often public callers hit the filter.

**Tests.** 86/86 pass (78 prior + 8 new in [`tests/list-jurisdictions-visibility.test.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/list-jurisdictions-visibility/tests/list-jurisdictions-visibility.test.ts) covering: the `AccessPolicy` import path resolves; `hauskaClient.listJurisdictions` passes `accessPolicy` through unchanged; absent-field default; public-caller filter; authenticated-caller pass-through; `public-paid` not-visible-to-public rule; the dispatch's Sync 4.5 scenario — Bastrop UDC + Grand County visible publicly, three partnership-pending hidden). `tsc --noEmit` clean.

## What was learned

Two things worth carrying forward.

**Path R fold-in is a one-line dep bump plus a wire-type addition.** cc-agent-AC's choice of Path R (reuse ADR-017 `accessPolicy`) made consumer-side work trivial. If Path N (new `visibility` field) had won, the consumer-side type would have grown a second axis on every jurisdiction-corpus consumer and Codex/Cortex catalog consumers would have needed to reason about two partition fields. The "reuse existing scaffolding" choice paid for itself at the consumer layer in a way that's worth flagging when future contract-level decisions face a similar fork.

**The filter rule has a quiet contract decision baked in.** Treating "any authenticated tier" as "platform-internal-eligible" is broader than the literal ADR-017 framing. A `free`-tier key (registered but not paying) sees `platform-internal` jurisdictions today. That's the simplest defensible rule that matches the dispatch wording, but it means partnership-pending jurisdictions are visible to anyone who registers a free key, not just operator-team members. If Sylvia's partnership-confirmation workflow needs stricter gating (e.g., "only operator-team keys see partnership-pending"), the right shape would be a new tier value or a separate column on `api_keys`. Flagging for planner review before public-tier signups go live; not urgent because the partnership-pending jurisdictions still go through ingest as platform-internal regardless of MCP filter behavior, and the partnership outreach is parallel-bizops not sprint-gated per Decision 0.19 amendment.

## What's still open

Group 5 follow-ups:

- **Manual end-to-end probe.** Run the MCP server in dev mode against a real hauska-engine instance with a Sync 4.5 corpus loaded; verify the unauthenticated probe returns 2 jurisdictions and the authenticated probe returns 5. Defer to Group 4 verification scope once Sync 4.5 lands fully (Bastrop UDC fired per cc-agent-E's `0ad25f6`; the three partnership-pending jurisdictions still pending per `_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`).
- **Free-tier-key gating decision.** Flag above on whether `free` tier should see partnership-pending. Not a sprint blocker.

Other Group work per the dispatch:

- **Group 3 (L1-L6 surface tools).** Gates per Sync B from Lane A.2 atom-shape locks (cc-agent-E). Lane A.2 has not started yet; cc-agent-E is currently working off Lane Foundation v1.1.0 on Lane A.1 (Sync 4.5 jurisdictions).
- **Group 4 (cross-client verification).** Gates on Groups 1+2+3+5 landing.

## Suggested canonical doc updates

Three light updates:

- [`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries). Prepend a line pointing at this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion. Update the "Filter update on `list_jurisdictions` per Lane Foundation v1.1.0" line to reflect the landed shape: cc-agent-AC chose Path R (ADR-017 `accessPolicy` reuse, no new field); consumer-side filter is wired via PR #4 with the conservative "any authenticated tier sees all" interpretation.
- [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points. Sync A fires officially with Lane Foundation v1.1.0 publish + this consumer-side pick-up.

## Commit batch

One commit lands this session close, two repos touched:

- `hauska-mcp-server` `feat/list-jurisdictions-visibility` `4c76346`: `feat(group-5): list_jurisdictions visibility filter (atom-contract v1.1.0)`. Pushed; PR #4 open at [empressaioemail-tech/hauska-mcp-server#4](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/4).
- `doc_repo` `main`: this session summary.

Sync points consumed this session: **Sync A** (Lane Foundation v1.1.0). Sync B(L1-L6) per surface remains pending — gates Group 3.
