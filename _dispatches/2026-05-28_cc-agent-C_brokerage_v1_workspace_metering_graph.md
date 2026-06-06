---
id: 2026-05-28_cc-agent-C_brokerage_v1_workspace_metering_graph
title: Dispatch — Brokerage V1 workspace collaboration, paywall-wallet, and admin graph baseline
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, _decisions/2026-05-28_brokerage_v1_expanded_scope]
---

# Brokerage V1 product surface completion (3b, 3d, 3e)

You are `cc-agent-C` shipping V1 behavior in `legacy-design-tools`.

## Scope

In scope:

1. **3b Workspace + collaboration**
   - Persist property workspaces (`recent`, `open`, `reopen`).
   - Attachments: links, images, PDFs, notes.
   - Share workspace to collaborator; collaborator can open full payload.
   - Keep backlink to source listing URL.

2. **3d Paywall + wallet**
   - Enforce read-vs-compute policy:
     - Read existing workspace always allowed.
     - Net-new compute (`POST /api/brokerage/v1/brief`, `POST /api/brokerage/v1/research/chat`) blocked at zero balance.
   - Wallet ledger with `$5` top-up increments.
   - Auto-refill behavior when balance reaches zero.
   - Failure states: top-up failed -> compute blocked, read still allowed.

3. **3e Admin graph baseline**
   - Internal admin endpoint/page for:
     - usage dots by browser session geography
     - share edges between users
   - Consent-aware graph visibility:
     - only graph users/edges when `graphOptIn=true`.

Out of scope:
- SkySlope partner integration.
- Marketplace listings.
- Non-brokerage product changes.

## Implementation notes

- Reuse existing brokerage API namespace: `/api/brokerage/v1/*`.
- Keep backward compatibility for extension v0.4.x contracts.
- Add minimal migrations for workspace, attachments, shares, wallet ledger, and graph events if absent.
- Avoid embedding billing keys in extension. Server-side only.

## Acceptance criteria

- [ ] `GET recent workspaces` returns latest researched properties with listing URL.
- [ ] `GET workspace/:id` restores prior brief/research context.
- [ ] Attachment CRUD works for link/image/pdf/note.
- [ ] Share flow allows collaborator read of full workspace package.
- [ ] Zero balance blocks net-new brief/chat with clear error code; read endpoints still succeed.
- [ ] Wallet top-up supports `$5` increments and auto-refill path.
- [ ] Admin graph endpoint/page returns consent-filtered nodes and edges.
- [ ] Tests green + typecheck green.

## Report back

Write inbox close file:

`P:/doc_repo/_inbox/2026-05-28_legacy-design-tools_cc-agent-C_brokerage_v1_workspace_metering_graph_close.md`

Include PR links, SHAs, migrations, test output, and any unresolved blockers.
