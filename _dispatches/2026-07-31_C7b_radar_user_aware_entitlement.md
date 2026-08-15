---
id: 2026-07-31_C7b_radar_user_aware_entitlement
title: Dispatch — C7b Radar user-aware entitlement
date: 2026-07-31
agent: cc-agent-C
repo: legacy-design-tools (cortex-api / api-server)
kind: dispatch
status: MERGED — CI green 2026-07-31; deploy + live verify WDLL 8–11 owed (planner)
wdll: _inbox/2026-07-31_C7_re_apps_chip_ux_and_radar_entitlement_WDLL.md
wdll_items: [8, 9, 10, 11]
related: [_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth, 75i_investor_radar_prelaunch_sprint]
parallel_with: _dispatches/2026-07-31_C7a_re_apps_inline_atom_chip_ux
excludes: [hauska-map, hauska-engine]
---

# C7b — Radar user-aware entitlement

You are **cc-agent-C** on `legacy-design-tools`. **Build + verify only — deploys are planner-owned.** Extension client header shape likely stays unchanged; server must resolve by session user.

## STANDING DECISIONS (verbatim — govern every action)

Deploys/commits PLANNER-OWNED; executors build+verify, never deploy.

CODE-DONE ≠ CUSTOMER-DONE: verify on the deployed surface, not a merged PR or self-report.

MERGE ONLY ON GREEN CI (verify on the ACTUAL head SHA — compare headRefOid, not a stale run).

Verify identifiers/paths against LIVE source before dispatching a fix; enumerate a fix's full dependency set from code.

Stage EXPLICIT paths (shared clone carries other agents' dirty files); never git add -A.

Also: Cotality is EXTINGUISHED. No privileged data. Tenant private data never pools. CTX/national HELD.

---

## MEMORY PASTE (fresh agents do not get fleet memory)

### radar-entitlement-install-id-not-user-aware

Radar / Brief extension entitlement and workspace history **partially** strand on `install_id`. `brokerage_wallets` PK is per install; Stripe checkout binds subscription to request install. **However**, `resolveEntitlementSnapshot()` (merged 2026-06) already aggregates Pro/Max across `brokerage_install_claims` for signed-in users on `GET /entitlement`, map-data Max gate, `/workspaces/recent`, and paid compute bypass. **Still install-keyed:** `POST /brief` adapter tier (missing `entitlementTier` — Max Cotality depth lost on fresh install), workspace `GET /:id` / open / share / attachments (install filter only), free-brief wallet debit on request install, billing checkout/portal. Symptom: signed-in Max user on a **new** browser install sees Free tier on brief depth and cannot reopen workspaces listed in `/recent`. Fix: signed-in → resolve via user claims + `resolveEntitlementSnapshot`; anonymous → `install_id` only. Tests: `brokerageUserEntitlement.test.ts`.

### standalone-deep-dive-portal-direction (alignment only — do not build)

Web-app-first onboarding (`_inbox/2026-07-20_map_first_shell_and_web_app_first_onboarding.md`) makes user-aware identity load-bearing. C7b is the entitlement/history leg; do not build the standalone portal here. Couples to future paywall/Stripe user grain — note shared primitives, do not duplicate entitlement logic.

---

## Read first

1. `_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md` — claims + `claimInstallHistoryForUser`
2. `artifacts/api-server/src/lib/brokerageEntitlement.ts` — `resolveEntitlementSnapshot`
3. `artifacts/api-server/src/__tests__/brokerageUserEntitlement.test.ts` — intended cross-install behavior
4. `artifacts/api-server/src/routes/brokerageMapData.ts` — **reference** user-aware tier wiring

---

## Recon resolution seam (verified 2026-07-31)

| Seam | File | Signed-in today | Gap |
|------|------|-----------------|-----|
| Entitlement read | `brokerageEntitlement.ts` → `resolveEntitlementSnapshot` | Merged across claims | OK |
| Brief adapter tier | `brokerageBrief.ts` ~L670 `resolveInvestorPackageTier` | **No** `entitlementTier` | Max depth install-keyed |
| Map Max | `brokerageMapData.ts` | Uses snapshot | OK (reference) |
| Workspace list | `brokerageWorkspace.ts` `GET /recent` | User + claims | OK |
| Workspace by id | `brokerageWorkspace.ts` `GET /:id`, open, share | Install filter only | History strand |
| Compute debit | `brokerageWallet.ts` | Paid bypass via snapshot; free debits request install | Optional Phase B |
| Client | `hauska-brief-extension/src/lib/brokerage-api.js` | Sends install + session JWT | Server-side fix sufficient |

**Primary bug (brief):**

```typescript
// brokerageBrief.ts — MISSING entitlementTier (compare brokerageMapData.ts)
const packageTier = resolveInvestorPackageTier({
  brokerageAuthTier: req.brokerageAuth?.tier ?? null,
  profileTier: packageTierFromProfile(profileRow),
});
```

**Correct pattern (map-data):** call `resolveEntitlementSnapshot(req)` → `entitlementPackageTier(snapshot)` → pass as `entitlementTier`.

---

## Build scope (WDLL items 8–10)

### C7b-A — Brief Max tier (item 8) — **highest ROI**

1. In `brokerageBrief.ts` `POST /brief`, mirror map-data: resolve snapshot, pass `entitlementTier` into `resolveInvestorPackageTier`.
2. Extend `brokerageUserEntitlement.test.ts`: Max only on claimed install A, request install B, session user → brief response includes Max-tier adapter behavior (assert package tier or a Max-only field in response/fixture).

### C7b-B — Workspace ACL (item 9)

3. Add `workspaceAccessibleToCaller()` mirroring `briefRunAccessibleToCaller` in `brokerageInstallClaim.ts`.
4. Apply on `GET /workspaces/:id`, attachments, share read paths, and `POST /open` lookup-by-listing.
5. Allow when `ownerUserId` matches OR workspace `installId` ∈ `listClaimedInstallIdsForUser`.
6. Test: create workspace on install A, claim user, request with install B → `GET /:id` 200.

### C7b-C — Optional (defer unless trivial)

7. Free-brief counter: debit primary subscribed install from merged snapshot instead of resetting on every new install. **Not required for WDLL close** if operator accepts free-tier edge case.

### Explicit defer

- Stripe checkout user grain / wallet schema migration
- GTM `install_id` analytics keys
- PE paywall (`pe_property_unlocks`) — different surface

---

## Shared primitive for C7a coordination

- `resolveEntitlementSnapshot(req)` is the single read path — C7a pro mode does not need client entitlement changes if server gates are correct.
- `authenticatedBrokerageUserId(req)` + session Bearer in `brokerageAuth.ts` — already used by extension after sign-in.

---

## Verification

- `pnpm --filter @workspace/api-server test -- brokerageUserEntitlement` (+ new cases) green on PR head SHA.
- Local or staging: two install IDs, one user, Max on wallet A only → entitlement + brief tier from install B.
- Planner live probe post-deploy on `cortex-api-00446-zij` successor revision (WDLL item 11).

Write close to `_inbox/2026-07-31_C7b_radar_user_aware_entitlement_close.md`: seam diagram, test output verbatim, PR URL + head SHA, staged paths list.

**Planner** owns merge, cortex-api deploy, cross-install live verification with signed-in extension session.
