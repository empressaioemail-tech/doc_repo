---
id: 2026-06-10_legacy-design-tools_cc-agent-C_C2_extension_cut_and_unified_signin
title: cc-agent-C — C2 extension gate cut + unified sign-in
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools + hauska-brief-extension
kind: report
dispatch: 2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin
status: PR-ready — held for operator merge; commits not pushed
model: Grok Build 0.1
---

# C2 — extension gate cut + unified sign-in

## Alien HEAD refusal (main clone)

Main `P:\legacy-design-tools` was **not** used — alien branch `codewarm/austin-2024-uplift-rewarm` with submodule dirt.

**Verbatim `git status` (main clone):**

```
On branch codewarm/austin-2024-uplift-rewarm
Your branch is based on 'origin/codewarm/austin-2024-uplift-rewarm', but the upstream is gone.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
```

**Verbatim `git log -3` (main clone):**

```
5b8df55 feat(codes): Austin 2024 driver slugs + IECC RE/CE chapter paths
3f307ca Merge pull request #163 from empressaioemail-tech/codewarm/driver-section-extraction
77f2a90 fix(codes): fetch section-level HTML for web-code verification
```

Work executed in clean worktree `P:\ldt-cortex-c2-extension` on branch `cortex/c2-extension-cut-and-signin` from **`origin/main` @ `b1575ef`** (PR #167 / task #29 per-user-auth merged).

---

## PR #29 merge confirmed

```
b1575ef Merge pull request #167 from empressaioemail-tech/cortex/per-user-auth
```

Server-side C2 prerequisites present on base: `GET /api/auth/extension-login`, session Bearer on `brokerageAuth` tier `user`, `claimInstallHistoryForUser`, `brokerage-anonymous-history-no-pool.test.ts`.

---

## Cut state — brokerage reasoning via gate (flagged)

| Item | State |
|---|---|
| Feature flag | `BROKERAGE_BRIEF_VIA_GATE=true` → code retrieval uses substrate spine (`BRIEF_CODE_RETRIEVAL=gate`) |
| Substrate client | `lib/codes/src/briefRetrievalSubstrate.ts` → retrieval-api `GET /search` with bearer + optional `x-hauska-jurisdiction-tenant` |
| Fallback | Empty substrate / HTTP error → Neon `@workspace/codes` (reversible) |
| Lineage | `citations[].atomDid` unchanged; `retrievalMode: substrate-gate` on spine hits |
| engine-api `/v1/briefing/generate` | **Not cut here** — engine-api prod still scaffold; brokerage LLM summary stays local `brokerageBriefLlm` until C1 engine cut lands |

**Env (operator deploy):**

| Variable | Role |
|---|---|
| `BROKERAGE_BRIEF_VIA_GATE` | `true` enables gate-path retrieval for extension brief |
| `BRIEF_RETRIEVAL_API_URL` / `HAUSKA_BACKEND_URL` | retrieval-api base (gate-wired substrate) |
| `BRIEF_RETRIEVAL_API_KEY` / `HAUSKA_ENGINE_API_KEY` | Bearer for `/search` |

---

## Unified sign-in — end-to-end (extension client built)

| Step | Implementation |
|---|---|
| 1 | `chrome.identity.launchWebAuthFlow` → `{cortex-api}/api/auth/extension-login?redirect_uri=...&install_id=...` |
| 2 | Hosted login (same credentials as Cortex web) |
| 3 | Redirect `#token=<signed-session>` |
| 4 | Store in `chrome.storage.local` (`hauskaSessionToken`) |
| 5 | Authenticated calls send `Authorization: Bearer <session>` (replaces embedded public key) |
| 6 | Anonymous wedge unchanged: public key + install-id when signed out |

**Extension repo:** `P:\hauska-brief-extension` branch `extension/unified-signin-v067` (clean from `extension/zero-config-consumer-v065`, prior dirty state stashed as `pre-C2-stash`).

**UI:** Panel + options “Sign in with Hauska”; `identity` permission in manifest v0.6.7.

**V1 unlocks on sign-in:** workspace upsert for user tier, share button, wallet/research paths use session Bearer.

---

## Anonymous-history-no-pool

Pre-existing test on base (not modified): `brokerage-anonymous-history-no-pool.test.ts` — install claim PK on `install_id`; user-B cannot reclaim.

C2 adds `ownerUserId` on brief run insert + workspace upsert when `brokerageAuth.tier === "user"`.

---

## Provenance envelope (rail-quiet)

Extension brief `POST /api/brokerage/v1/brief` response now includes `provenance`:

```json
{
  "lineage": { "atomIds": ["…"] },
  "sources": [{ "atomId", "sourceUrl", "edition", "retrievedAt", "verificationState" }],
  "reasoningChain": { "rule": "municipal-code-retrieval", "precedence": null, "projectFacts": ["jurisdiction:…"] },
  "confidence": 0.85,
  "timestamp": "…",
  "edition": "…",
  "spineViaGate": true
}
```

No `calibrationGrade` / rev-share fields (I7 rail-quiet).

---

## Verification artifacts (HR-8)

### Typecheck

```
cd P:\ldt-cortex-c2-extension && pnpm exec tsc --build
exit 0
```

### Unit tests (verbatim)

```
lib/codes — vitest run briefRetrievalSubstrate.test.ts
 ✓ 2 passed

artifacts/api-server — vitest run brokerageProvenanceEnvelope.test.ts
 ✓ 1 passed

artifacts/api-server — vitest run brokerageSpineGate.test.ts
 ✓ 2 passed
```

### Extension build

```
cd P:\hauska-brief-extension && node scripts/build.mjs
built dist/ + content-bundle, panel-bundle, popup, research-bundle
```

### Integration / E2E (operator)

- Sign in on extension with Cortex web account → same user id on both surfaces
- Run anonymous brief (signed out) → still works with public key
- Sign in → prior install-id history attaches via `claimInstallHistoryForUser`
- Deploy with `BROKERAGE_BRIEF_VIA_GATE=true` + retrieval URL wired → `provenance.spineViaGate: true` on brief

---

## PR / merge (held)

| Repo | Branch | Base SHA | Status |
|---|---|---|---|
| legacy-design-tools | `cortex/c2-extension-cut-and-signin` | `b1575ef` | Uncommitted — operator commit + push |
| hauska-brief-extension | `extension/unified-signin-v067` | `1cfc943` | Uncommitted — operator commit + push |

PR URLs: create after push via GitHub UI (no `gh` on workstation).

---

## Blockers / notes

1. **C1 not merged** — full engine-api briefing/findings cut is separate; C2 gate cut scopes to brokerage **code retrieval** through substrate retrieval-api behind flag.
2. **DB integration tests** — `brokerage-anonymous-history-no-pool` / `brokerageBrief` integration require `DATABASE_URL` locally (not run on workstation).
3. **Operator E2E** — `launchWebAuthFlow` requires loaded unpacked extension with `identity` permission against cortex-api with PR #167 deployed + migration `0038`.

---

## Extension-client assignment

**Executed in this session** — `hauska-brief-extension` clone owned; branch `extension/unified-signin-v067` ready for operator review. No separate assignee needed unless operator prefers split PR ownership.
