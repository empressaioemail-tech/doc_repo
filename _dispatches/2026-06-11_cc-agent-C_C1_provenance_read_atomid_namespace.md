---
id: 2026-06-11_cc-agent-C_C1_provenance_read_atomid_namespace
title: Dispatch — C1 flip-blocker, provenance read 500 (reasoning-atom id passed into UUID code_atoms query)
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — findings-on-spine read-path blocker (findings persist but GET /findings 500s)
related: [58_gtm_readiness_sprint, _dispatches/2026-06-11_cc-agent-C_C1_findings_persist_and_jurisdiction_keysynth, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate_complete]
---

# C1 flip-blocker — provenance read 500 on reasoning-atom citations

> Third integration gap caught by live canary verification (2026-06-11). The findings-on-spine WRITE path is fully fixed (#171 date-insert, #172 jurisdiction key synthesis scoped): San Marcos 613 Sturgeon_A (submission #2600) now persists 2 findings through the spine. But the READ path 500s — `GET /api/submissions/:id/findings` fails to hydrate the provenance envelope (#169, moat #3) whenever a finding cites a reasoning atom. Findings persist but the user sees "Could not load findings for this submission." This blocks the traffic shift.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main` (carries #169/#171/#172). Branch prefix `cortex/`. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. HR-8 verbatim artifacts.

## Verbatim error (live canary `cortex-api-00153-jag`, San Marcos #2600)

```
07:36:25  list submission findings failed
  ERR: Failed query: select "code_atoms"."id", "code_atoms"."edition", "code_atoms"."source_url",
       "code_atoms"."fetched_at", "code_atom_sources"."source_name"
       from "code_atoms" inner join "code_atom_sources" on "code_atom_sources"."id" = "code_atoms"."source_id"
       where "code_atoms"."id" in ($1)
  params: reasoning:irc-2021:irc-r301-2-1
  PG: invalid input syntax for type uuid: "reasoning:irc-2021:irc-r301-2-1"
  at hydrateProvenanceSources (artifacts/api-server/src/lib/provenanceEnvelope.ts:65)
07:36:25  request errored — GET /api/submissions/7b9c4dcf-4d90-4bf1-8459-4c899d472600/findings  500
```

## Root cause

`hydrateProvenanceSources(atomIds)` (`artifacts/api-server/src/lib/provenanceEnvelope.ts:60-86`) runs two queries against the **same unpartitioned `atomIds` list**:
- `code_atoms.id IN (atomIds)` (`:65-75`) — `code_atoms.id` is a **UUID** column.
- `reasoning_atoms.id IN (atomIds)` (`:77-86`) — `reasoning_atoms.id` is a **namespaced string** (e.g. `reasoning:irc-2021:irc-r301-2-1`).

Corpus citations are UUIDs; reasoning citations are `reasoning:*` strings. Passing a `reasoning:*` id into the UUID-typed `code_atoms.id IN (...)` makes Postgres reject the cast → the whole read 500s. Web-first grounded findings cite reasoning atoms, so this fires on exactly the launch case. (Same UUID-vs-reasoning-id namespace split handled for the calibration overlay in #158 `canonicalOverlayAtomKey` — reuse that partition logic if it fits.)

## Fix

Partition `atomIds` by id shape before the two queries in `hydrateProvenanceSources`:
- `corpusAtomIds` = ids that are valid UUIDs → the `code_atoms` query.
- `reasoningAtomIds` = ids prefixed `reasoning:` (or any non-UUID) → the `reasoning_atoms` query.
- Guard each query so an **empty** partition is skipped (do not call `inArray` with `[]`).

Never pass a non-UUID id into the `code_atoms.id` clause. This shared helper backs all three architect-facing surfaces (`buildProvenanceFromFindingRow`, `buildProvenanceFromBriefing`, `buildProvenanceFromCodeAtom`), so fixing it here covers findings + briefing + code-atom reads.

## Acceptance

- `GET /api/submissions/:id/findings` for San Marcos 613 Sturgeon_A (engagement `6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2`, submission `7b9c4dcf-...-2600`) returns **200** with the 2 findings + a populated provenance envelope (reasoning citations hydrate from `reasoning_atoms` with `unverified-web-source` state; any corpus citations hydrate from `code_atoms` as `verified`). No `list submission findings failed`.
- A finding that mixes corpus (UUID) + reasoning (`reasoning:*`) citations hydrates **both** without error — add a unit test for the partition.
- Lineage atomIds preserved end to end (HARD).
- Typecheck + tests green; PR held for operator merge; HR-8 verbatim artifacts.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_C1_provenance_read_atomid_namespace_fix.md`: the fix location (file:line), the partition logic, the unit-test output, the post-deploy 200 read for #2600 verbatim, PR URL + SHA, blockers.

## Post-merge (planner / operator)

Merge → canary redeploy (re-apply `ENGINE_SPINE_*` + gate-token secret, the line-204 clobber) → re-run Miami + San Marcos: findings persist AND load. Then bake `ENGINE_SPINE_*` into `cloud-run-deploy.yml` → shift traffic → flip briefing/hydrology/topography one at a time.
