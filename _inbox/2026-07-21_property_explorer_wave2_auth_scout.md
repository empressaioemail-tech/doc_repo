---
id: 2026-07-21_property_explorer_wave2_auth_scout
title: Property Explorer Wave 2 auth scout — native OIDC (no Clerk)
status: active
date: 2026-07-21
applies_to: hauska-map (property-explorer), legacy-design-tools (cortex-api session/entitlement)
related: [2026-07-21_property_explorer_v1_sprint_WDLL, 2026-07-21_property_explorer_v1_sprint_STATUS, 54_tenant_leg_sprint]
owner: nick
---

# Wave 2 auth scout

Read-only scout at hauska-map `7a5d978` + LDT `5ceda60`. Google continue is a stub (`SignUpCard.tsx`); anonymous browse via service-key spine proxy is real.

## Ruling-aligned approach

Native Google + Microsoft Entra OIDC Authorization Code + PKCE on Vercel BFF routes (`/api/auth/{provider}/start|callback|session|logout`). No Clerk. No Auth.js (Vite SPA + small proxy, not Next). Callback → Cortex session-exchange → HttpOnly cookie; Cortex owns user/tenant/entitlement. Deep routes must NOT use `CORTEX_SERVICE_API_KEY` proxy (service caller can resolve as max).

Reuse signed-session shape: `artifacts/api-server/src/middlewares/session.ts`, `sessionToken.ts`. Do not copy brokerage profile default-`pro` tier.

## PR sequence (WDLL 12–16)

1. LDT: identity/session-exchange + PE user/entitlement schema + tenant-scoped saved-property routes + isolation tests (13, 15)
2. hauska-map: Google + Microsoft PKCE BFF + cookie + cold-open wiring (12, 13, 16)
3. hauska-map: split anonymous browse proxy vs authenticated deep proxy (13, 14)
4. LDT + hauska-map: deep-route tier gate + free/paid fixtures + live probes (14, 15)
5. doc_repo: secrets hold list + deploy verification (16, 37–39)

Secrets: see STATUS hold list.
