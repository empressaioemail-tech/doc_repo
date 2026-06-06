---
id: 2026-06-01_prophecy_embed_flow_diagram
title: Prophecy Gov embed flow — vendor diagram (SmartCity OS)
date: 2026-06-01
status: active
applies_to: smartcity-os
related: [_research/prophecy_integration_audit_2026-06-01.md in smartcity-os repo, 30a_smartcity_stabilization_sprint.md]
---

# Prophecy Gov embed flow — vendor diagram

> **Caption for email:** Current embed flow (Bastrop / SmartCity OS at `https://smartcityos.io/prophecy`). Main-domain allowlist is in place; failure occurs when unauthenticated `/chat` redirects into WorkOS OAuth, which blocks iframe embedding. Pop-out login in a new tab works today.

Evidence: read-only recon `_research/prophecy_integration_audit_2026-06-01.md` in `empressaioemail-tech/smartcity-os` (branch `recon/prophecy-integration-audit`, commit `2478a4e`).

---

## Diagram

### Path A — Iframe embed (broken today)

```mermaid
%%{init: {'theme': 'dark', 'sequence': {'actorMargin': 100, 'messageMargin': 45, 'noteMargin': 12}}}%%
sequenceDiagram
    autonumber
    participant U as User
    participant S as SmartCity OS<br/>iframe /prophecy
    participant P as prophecygov.com/chat
    participant W as api.workos.com
    participant A as auth.prophecygov.com

    U->>S: Open /prophecy tab
    S->>P: iframe src = /chat

    Note over P: Allowlist OK — smartcityos.io ✓

    P->>W: 307 redirect (no session)

    Note over W: Iframe blocked<br/>frame-ancestors: self ✗

    W->>A: OAuth UI (may redirect)

    Note over A: Iframe blocked<br/>replit / v0 / bolt.new only ✗

    A-->>S: BLOCKED

    Note over S: Broken page icon
```

| Step | Host | Status |
|------|------|--------|
| 1 | `prophecygov.com/chat` | Allowlist includes `smartcityos.io` (partial fix) |
| 2 | `api.workos.com` | Blocks all third-party iframes |
| 3 | `auth.prophecygov.com` | Allows dev platforms only, not SmartCity OS |

### Path B — Pop-out login (works today)

```mermaid
%%{init: {'theme': 'dark', 'sequence': {'actorMargin': 100, 'messageMargin': 45}}}%%
sequenceDiagram
    autonumber
    participant U as User
    participant S as SmartCity OS
    participant P as prophecygov.com/chat
    participant W as api.workos.com

    U->>S: Click Open Prophecy (new tab)
    S->>P: Top-level window (not iframe)
    P->>W: OAuth redirect
    W->>U: Login UI (top-level OK)
    U->>P: Session established

    Note over P: Chat loads ✓ — Bastrop TX
```

---

## Allowlist ask (for Prophecy / WorkOS)

| Domain / surface | Current state | Needed |
|---|---|---|
| `prophecygov.com` | `smartcityos.io` allowed ✓ | Also allow `www.smartcityos.io` |
| `auth.prophecygov.com` | Dev platforms only ✗ | Add `smartcityos.io` + `www.smartcityos.io` |
| `api.workos.com` (WorkOS AuthKit) | `frame-ancestors self` ✗ | Embedded-auth config for SmartCity OS parent frame, or confirm pop-out is the supported pattern |
| Auth cookies | `SameSite=Lax` | `SameSite=None; Secure` for iframe embed contexts (if iframe embed is a supported pattern) |

---

## Footnote

After top-level login, refreshing the iframe may still fail: `SameSite=Lax` cookies set on `prophecygov.com` often do not persist inside a cross-site iframe (`smartcityos.io` embedding `prophecygov.com`) under modern browser third-party cookie policies. Pop-out login remains reliable; in-iframe session persistence may require cookie policy changes from Prophecy even after `frame-ancestors` fixes.

---

## ASCII fallback (copy-paste if Mermaid does not render)

```
PATH A — IFRAME EMBED (BROKEN)
================================
User → smartcityos.io/prophecy (iframe)
     → prophecygov.com/chat          [frame-ancestors: smartcityos.io ✓]
     → 307 → api.workos.com          [frame-ancestors: self ✗ BLOCKED]
     → (may hit) auth.prophecygov.com [frame-ancestors: replit/v0/etc ✗]
     → broken page icon in iframe

PATH B — POP-OUT (WORKS)
========================
User → "Open Prophecy" (new tab, top-level)
     → prophecygov.com/chat → WorkOS OAuth → login ✓
     → Prophecy chat UI loads (Bastrop TX)
```
