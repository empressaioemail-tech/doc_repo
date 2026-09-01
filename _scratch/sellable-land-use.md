# scratch: sellable land-use pair (s7/s8 pickup)

Tier 2. Pickup from `_sessions/2026-08-21_sellable_heartbeat_atom_serve_planner.md`.

## GROUND-TRUTH

- GROUND-TRUTH (2026-08-21T22:35Z pickup): integration seat, `P:/doc_repo` main `83081da`. LDT PR 450 OPEN `a1e23cfd` mergeStateStatus BLOCKED. Required checks: Typecheck SUCCESS, Test FAILURE, SS-W16 SUCCESS, SS-W18 SUCCESS. L17 ci-vintage-predicate FAILURE is NOT required (`gh api .../branches/main/protection` required: SS-W18, Typecheck, Test, SS-W16). hauska-map PR 176 CLEAN all SUCCESS including required `test` (CC). Isolated worktrees `P:/legacy-design-tools-worktrees/s7-land-use-inspect` and `P:/hauska-map-worktrees/s8-land-use-surface`. Did not occupy property seat checkouts.
- GROUND-TRUTH (2026-08-21T21:42:05Z CI): Test job 96915825264 `1 failed | 2482 passed`. Fail is `users.test.ts > session middleware — auto-upsert profile > backfills a default profile` expected length 1 got 0 after a 50ms wait. Land-use files are in the 247 passed files, not the fail.
- GROUND-TRUTH (2026-08-21T21:27:39Z CI): L17 fail string is `./artifacts/api-server/src/lib/landUseFactRead.test.ts` because colocated `*.test.ts` is outside glob `!**/__tests__/**` and the probe SQL is literal `FROM cad_property`. Production `landUseFactRead.ts` does not match that regex.

## LESSON

- LESSON: LDT required Test can fail on `users.test.ts` fire-and-forget 50ms even when the PR's own files pass. Do not treat a red Test as a land-use regression until the failed file is named.
- LESSON: L17 allowlist `**/__tests__/**` misses colocated `src/lib/*.test.ts`. A refusal-probe SQL `FROM cad_property` in a test is enough to fail L17. L17 is not a merge gate.

## GROUND-TRUTH

- GROUND-TRUTH (2026-08-21T22:56:03Z): live SmartSite gold `landUseFact.state=present` `source=land-use-fact` `landUseCode=A1` bound `48021:34137:2025`. Padded gold matches. Lockhart pair both A1 bound `:2026`. X-Vercel-Cache MISS Age 0. Painted `inspect-landuse` `data-state=present` text `A1 — A1`. Serving cortex `00531-fus` @100% digest `sha256:3534e0b6`. PE `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc`. Before PE deploy the same GET had no `landUseFact`.
- GROUND-TRUTH (2026-08-21T22:45:35Z): LDT PR 450 Test SUCCESS after 12289206. Fail on a1e23cfd was `users.test.ts` 50ms fire-and-forget, not land-use files. L17 SUCCESS after colocated-test SQL rephrase. L17 is not a required check.

## LESSON

- LESSON: LDT required Test can fail on `users.test.ts` fire-and-forget 50ms even when the PR's own files pass. Name the failed file before treating a red Test as a product regression.
- LESSON: L17 allowlist `**/__tests__/**` misses colocated `src/lib/*.test.ts`. A refusal-probe SQL `FROM cad_property` is enough to fail L17. L17 is not a merge gate.

## DEAD-END

- DEAD-END: treating PR 450 Test red as a land-use GET failure. 247 files passed; the one fail was users auto-upsert.

## OPEN

- OPEN: County Manifest empty cells unchanged after this pair. Expected. Eight HOLDs stay HOLD.

