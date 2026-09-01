# P-91 items 2–5 scratch (property / legacy-design-tools-p91-wire)

PLAN-ROW: P-91. Worktree `P:/seat-worktrees/property/legacy-design-tools-p91-wire` branch `fix/p91-batch-stub` @ `f4710c69`.

## LESSON

Situs compose belongs on the list payload, not a client display patch. Stored `", ,"` on `48021:25420` is a punctuation-only join of empty CAD components. `composeSitusLabel` drops separator-only tokens and falls back to the node id with `situs: "unknown"`. Cortex GET `/saved-properties` and MCP `stripSavedPropertiesForExternal` both apply it.

## GROUND-TRUTH

2026-08-28: stub rails are `situs`, `zoning`, `landUse`, `flood`, `drainage`, `envelope`. Each cell is one of `present | absent-verified | unknown | refused | unread`. Drainage is unread on stub because the drainage producer is not fetched. `atom-miss` maps to `unknown`. `absent-verified` only from pipeline present-outside or `:sd:outside`.

## OPEN

Single-id default (no `depth`) still POSTs `{ parcelNodeId }` with no depth field so existing Connect prompts stay on today's brief+draw. Array default is stub. hop1/subgraph refuse `not_implemented` at MCP and cortex. Cap 50 refuses; no silent truncate.

leave_behind: none for this lane (no deploy, no ninth tool, no create_screen).
