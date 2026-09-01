---
decision_id: 2026-08-31_claude_sync_card_and_connected_signal
date: 2026-08-31
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
  - _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
  - 28_mcp_first_product_design.md
---

## Decision

The Smart Site workbench card "Use in your AI" becomes **Claude Sync**: Claude only, two states, and a real connected signal underneath it.

Three operator rulings on 2026-08-31.

One, cut every vendor other than Claude, on the rail card and in Settings both. ChatGPT, Cursor and Copilot rows are removed from the product surface.

Two, the card has two states. An account with no Claude connection sees the setup instructions and nothing else. An account with one sees a Sync button that pushes the open property into a new Claude chat. The flip between them is driven by a fact the server records, not by a local flag the browser sets about itself.

Three, the share link stays on the card, below a divider. Operator reasoning: a share link hands a property to someone else, Claude Sync expands the account holder's own toolset. Different jobs, both wanted, and the share block here mirrors the Share bubble's stored state rather than minting a second link.

The rail glyph becomes the Claude mark in Claude orange on the existing grey bubble, carried as a new reserved-hue token `--ss-claude`.

## Context

The card shipped 2026-08-28 as a four-vendor sheet with a share-mint block on top and a per-vendor Connect drawer. It reads as a directory of things you might do rather than one thing you do. The operator asked for the narrowing and for the two-state behaviour in the same message.

Underneath the ask sat a question the product could not answer. The Smart Site MCP server validated a bearer, resolved the caller to a real Smart Site user, and discarded that fact on every call. Nothing in the system recorded that a connector had ever been added. "Is Claude connected" was therefore not a knowable state, and the card had nothing honest to switch on.

Three options were put to the operator. Build the verified signal. Ship a local self-declared flag. Ship local now and replace it later. The operator chose the verified signal.

Alternatives considered and rejected: a `localStorage` "I connected it" flag set after the user copies the address (rejected as a check that cannot fail, per-browser, and wrong in the expensive direction, since a false positive hands the user a Sync button that opens a Claude which cannot answer); polling WorkOS for active authorisations (rejected as an unverified vendor capability when the handshake we already receive carries the answer).

## Structural commitment check

Sell reasoning, not data: unchanged. The card ships no facts about a property.

Confidence is earned: this is the commitment the decision turns on. A connection is asserted only where an authenticated client named itself to us, and the card presents "last seen", never "last used", because a handshake is not a tool call.

Cost per jurisdiction: not touched.

Dual interface: this is the UI half of an MCP-first product, which is the shape `28_mcp_first_product_design.md` describes.

Brand: Empressa / Smart Site surface against the Smart Site product MCP at `mcp.smartsite.cloud`. Not Hauska catalog.

## Reasoning

**Why the handshake and not a heartbeat.** `initialize` is the only JSON-RPC message that carries `clientInfo`, and a host sends it the instant a custom connector finishes its OAuth approval. Recording it means the card flips when the user finishes setup rather than when they later remember to ask Claude something. No new endpoint, no polling, no extra round trip.

**Why an unnamed client writes nothing.** A row in `pe_ai_connections` flips a card to a Sync button. A row created from an initialize with no resolvable `clientInfo.name` would render a working-looking control for a connection nobody made. Absent and unnamed stay absent; the user sees setup instructions, which cost them one click and mislead them about nothing.

**Why every failure renders setup.** Signed out, 404, 500, offline and connected-to-nothing are five different facts and the client keeps them apart, but all five paint the setup panel. That is the fail-closed direction for this control.

**Why the client name is stored raw and classified on read.** What counts as "Claude" is a judgement about vendor strings and is the thing most likely to change when a host renames its client. Normalising at write time would destroy the only evidence of what the client actually called itself.

**Why Sync copies before it opens.** Anthropic documents prefill for the `claude://` desktop scheme only. The browser form `https://claude.ai/new?q=` is undocumented and prefill on web chat was reported removed in October 2025. So Sync puts the prompt on the clipboard first and then opens a chat, and the confirmation says both. The clipboard is the half that is certain. This is a declared degradation, not a silent one.

**What cutting Cursor does and does not do.** Nothing server side was removed. Cursor Connect still works against the same OAuth server for anyone who already added it. What is gone is the only place in the product that tells a new user the address for it. That was put to the operator as a consequence and ruled on, not absorbed as a side effect.

## Reversal criteria

Reverse the vendor cut if a Cursor or ChatGPT connect becomes a named sales requirement; the row shape and the shared-constant wiring survive in `CLAUDE_SYNC_VENDORS`, so restoring a vendor is an array entry, not a rebuild.

Revise the Claude classifier if a Claude host announces a `clientInfo.name` that does not begin with "claude". The raw `connections` array is served alongside the classified answer precisely so this is diagnosable from outside: a read returning `claude: null` with a non-empty `connections` is the signature, and the fix is the predicate.

Reconsider the clipboard-first Sync if the web `?q=` prefill is observed working; the clipboard step then becomes belt-and-braces and the confirmation copy quietens. That is a copy change, not a redesign.

Revisit storing only on `initialize` if "last seen" proves too coarse to be useful, in which case a session-id to client mapping is the next cheapest step, not a write on every tool call.

## Dependencies

Migration `0090_pe_ai_connections.sql` must be applied to the deployment database before the `/api/property-explorer/v1/ai-connections` read can return anything but an error. Until the smartsite-mcp revision carrying the recorder is serving, every account reads as not connected, which is the correct degraded state rather than a wrong one.

The Claude Sync card is inert without both halves. The client half alone renders permanent setup instructions, which is a safe partial deploy and not a broken one.
