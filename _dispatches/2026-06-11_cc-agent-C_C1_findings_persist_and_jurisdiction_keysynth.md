---
id: 2026-06-11_cc-agent-C_C1_findings_persist_and_jurisdiction_keysynth
title: Dispatch — C1 flip-blocker, findings-on-spine date-insert fix + web-first jurisdiction key synthesis
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — P0 is the findings-on-spine traffic-shift blocker
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate_complete, 20_agent_operating_rules]
---

# C1 flip-blocker — findings persist on spine + web-first jurisdiction key synthesis

> Surfaced by live canary verification of the findings-on-spine cut (#169) on 2026-06-11. The cut WORKS end to end at the engine: `POST /v1/findings/generate-orchestrated -> 200`, real findings generated. Two defects stop a grounded finding from reaching the user. P0 (date-insert) blocks the traffic shift for every jurisdiction. P1 (jurisdiction key synthesis) is the web-first promise for unwarmed cities. The cut is reversible behind the per-engine flags; both flags are already live on the cortex-api canary (`00151-tax`, no traffic).

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Use a worktree off `origin/main` (main carries #169). Branch prefix `cortex/`. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. HR-1/2/3/8/11 apply.

## Evidence (verbatim, from the live canary run)

engine-api request log (the spine produced findings):
```
2026-06-11T05:49:15Z  POST /v1/findings/generate-orchestrated  200
```

cortex-api `cortex-api-00151-tax` finding-gen, Miami 404 Remodel_B (engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`):
```
05:50:23  finding generation: orchestrated pass completed
05:50:24  finding generation: row insert failed — continuing
05:50:24  finding generation: row insert failed — continuing
05:50:24  finding generation: completed
```

The row-insert error payload (both findings, verbatim):
```json
{"atomId":"finding:56c21164-cfb7-492e-98b1-6461e4c4ab3e:MQ92W0U17UDY4IZU",
 "err":{"message":"value.toISOString is not a function",
        "stack":"TypeError: value.toISOString is not a function\n  at PgTimestamp.mapToDriverValue (drizzle-orm/.../pg-core/columns/timestamp.ts:68:16)\n  ..."}}
```

San Marcos (613 Sturgeon_A, engagement `6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2`, full address `613 Sturgeon Dr, San Marcos, TX 78666`):
```
05:44:25  finding generation: no jurisdiction key resolved — skipping code retrieval
05:44:26  POST /v1/findings/generate-orchestrated  200
05:44:40  finding generation: completed     (0 findings; nothing retrieved to ground against)
```

## P0 (flip-blocker) — rehydrate spine-returned timestamps to Date before insert

**Root cause.** When findings came from the in-process local engine, timestamp fields were JS `Date` objects. The cut now fetches findings from engine-api over HTTP, so those fields arrive as **ISO-8601 strings** in the JSON response. The persist path (`persistFinding`, called in the loop at `artifacts/api-server/src/routes/findings.ts:1024-1034`) hands the finding straight to a drizzle `timestamp` column, whose `mapToDriverValue` calls `value.toISOString()` — which throws on a string. Every finding is dropped; 0 persisted.

**Fix.** At the #169 spine-client response-deserialization boundary (the code that maps engine-api's JSON findings response into the `EngineFinding`/`ef` objects that `generateOrchestratedFindings`/`generateFindings` return when the spine flags are on), coerce **every** date-typed field back to `Date` so the spine `ef` matches the local-engine in-process contract and `persistFinding` stays path-agnostic. Prime suspect field: `aiGeneratedAt` (typed `string` on the API-finding shape at `findings.ts:236`, but a `Date` column in the DB). **Do not patch only `aiGeneratedAt`** — sweep the full finding shape (and nested provenance `sources[].retrievedAt`, `evaluatedAt`, any draft/run timestamps) and rehydrate each. Prefer fixing at the deserialization boundary over patching `persistFinding`, so all downstream consumers (events, SSE, provenance) get real Dates.

**Acceptance (P0).**
- Re-run plan review on Miami 404 Remodel_B (`15d1d314-...`) through the spine: findings **persist (>0)**, no `row insert failed` line in logs.
- `citations[].atomId` lineage intact end to end (HARD — a cut that drops lineage is a regression).
- Paste the verbatim cortex-api log for the run plus one persisted finding row's `atomId`.

## P1 — web-first jurisdiction key synthesis (so unwarmed cities ground on demand)

**Root cause.** `keyFromEngagement(...)` at `findings.ts:519` returns no key for an arbitrary city, and BOTH corpus retrieval (`if (jurisdictionKey)` at `:579`) and the web-first reasoning-grounding supplement (`supplementCodeSectionsWithReasoningGrounding` at `:620`, inside the same block) are gated on a resolved key. So an unwarmed city (San Marcos) skips retrieval AND web-grounding entirely and produces ungrounded/zero findings — which contradicts the UI banner ("not in the corpus yet — findings will be web-grounded from authoritative sources on demand").

**Fix.** `keyFromEngagement` synthesizes a normalized key (slug `city_state`, e.g. `san_marcos_tx`) from `jurisdictionCity` + state even when the city is not in the recognized/warmed set, so the retrieval+grounding block runs and the **web-first supplement fires on the synthesized key**. Warmed-corpus retrieval (`retrieveAtomsForQuestion`) may legitimately return `[]` for an unwarmed key — that is fine; the web-first reasoning-grounding supplement is what must still fire. Keep the genuine no-key path only when there is no resolvable city/state at all.

**Honesty boundary (hard).** Web-grounded findings carry `web-source`/unverified verification state in the provenance envelope — never marked corpus-verified. No verbatim code-text storage (deeplink/licensed-display only). No cross-layer (zoning/CC&R) claims.

**Acceptance (P1).**
- Re-run on 613 Sturgeon_A (San Marcos, `6d9cd127-...`): log shows a **resolved jurisdiction key** (not "skipping code retrieval"), the web-first supplement fires, and findings persist with web-source provenance.
- Paste the verbatim log.

## AMENDMENT — coverage-resolver regression in PR #171 (operator decision 2026-06-11)

PR #171 (`f7e74f3`) is otherwise good (P0 deserialize fix is complete and minimal — `aiGeneratedAt` is the only engine-sourced timestamp column the insert writes, and the helper covers it). **But it must not merge as-is:** the P1 synthesis leaked into the coverage resolver. `resolveEngagementCoverage` (`lib/coverage/src/resolveEngagementCoverage.ts:61`) calls `keyFromEngagement` directly, so now **every geocodeable city synthesizes a cortex key**, the `!cortexJurisdictionKey && !substrateJurisdictionKey` branch (`:76`) is unreachable, and uncataloged jurisdictions fall through to `warming` (`:111`) instead of `not_in_catalog`. Failing test: `lib/coverage/src/__tests__/resolveEngagementCoverage.test.ts:41` (expected `not_in_catalog`, got `warming`). This also silently swaps the honest FE banner ("web-grounded from authoritative sources on demand") for the misleading "Warming code corpus…" copy.

**Operator decision: scope synthesis to the finding path only.** Amend #171:
- `keyFromEngagement` (or the coverage call site) must stay **registered-only** for coverage resolution, so `resolveEngagementCoverage` returns `not_in_catalog` for genuinely uncataloged jurisdictions and the existing "web-grounded on demand" banner is preserved. Add a separate synthesize-enabled entry point (e.g. `keyFromEngagementOrSynthesize`, or a `{ synthesize: true }` option) used ONLY by the finding-generation grounding path.
- `resolveEngagementCoverage.test.ts:41` must pass **unchanged** (`not_in_catalog`).
- Re-confirm the P1 acceptance still holds: San Marcos finding path resolves the synthesized `san_marcos_tx` key and web-grounds, while coverage for the same engagement still reads `not_in_catalog`.

The full web-first coverage reframe (replace `warming`/`not_in_catalog` with an explicit "web-grounded on demand" status + honest banner copy + QA-23 guardrail mapping) is a SEPARATE queued UX dispatch, not this one.

## Explicitly NOT in scope (operator-deferred 2026-06-11)

Do not touch these in this dispatch — they were considered and held: (a) wiring the **plan-set classification LLM off mock** (`classification LLM client wired in mock mode`); (b) the **honest empty-state** UX (insufficient-content / unresolved-jurisdiction messaging instead of silent 0); (c) the **grok-vs-anthropic finding-LLM** default (the log warns `anthropic is legacy — prefer grok`, but all finding-quality work to date is anthropic + Opus vision, so it is a deliberate A/B, not a blind flip). Leave the existing behavior untouched for all three.

## Constraints

- Per-engine spine flags stay default-OFF in code (the canary already carries them in env). The cut stays reversible.
- Worktree off `origin/main`; do not disturb the `codewarm/austin-2024-uplift-rewarm` working clone state.
- CI green; PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_C1_findings_persist_jurisdiction_fix.md`: the reproduced verbatim error, the exact fix locations (file:line), the two acceptance runs' verbatim logs, PR URL + SHA, and blockers verbatim.

## Post-merge (planner / operator, not this agent)

After merge + canary redeploy: re-run Miami on the canary to confirm persist, then bake `ENGINE_SPINE_*` into `cloud-run-deploy.yml` (durable, beats the line-204 clobber), THEN shift traffic 0->100, THEN flip briefing/hydrology/topography one at a time.
