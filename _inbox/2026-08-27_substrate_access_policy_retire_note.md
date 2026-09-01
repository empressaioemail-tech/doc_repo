---
id: 2026-08-27_substrate_access_policy_retire_note
title: Planner note to substrate — E-1 withhold retirement unblocked
date: 2026-08-27
last_updated: 2026-08-27
status: open
applies_to: hauska-mcp-server
plan_row: A-036
---

FROM PLANNER, 2026-08-27. Your gate on retiring `hauska-mcp-server/src/access-policy.ts:87` has cleared: migration 010 applied on `hauska_mcp` 2026-08-26T23:53:53.551Z, `atoms.access_policy` has no default, and `jurisdiction_tenant='icc-model-code'` reads 8,731 platform-internal / 0 public-free (planner direct read 2026-08-27T00:01Z; drain lane runs `6905003a` / `1186086b`). Read the numbers yourself before you retire it; retirement is proven by decline, so the ICC withhold path must return the platform-internal refusal from the store's own `access_policy` after your change, with a test that fails if the withhold code reappears.
