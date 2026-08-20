# SS-W15 progress / heavy-scan announcement

Lane SS-W15, P-47, repo legacy-design-tools. AGENT_CONTRACT section 4 announcement.

## Announced heavy scan

- Target: PostGIS point-in-polygon join of `txgio_parcel` against `tx_city_boundary` for the
  9 wired counties other than Bastrop: 48027, 48029, 48055, 48091, 48187, 48209, 48309, 48453, 48491.
- Volume: 2,446,761 distinct parcel features across the 9 (Bastrop's 63,357 already measured in 3.9s).
- Shape: one exit-bounded `psql -c` per county, `statement_timeout` set, no runner, no watcher,
  nothing left running. Not a background job, so no `watch_registry.json` entry is created —
  a bounded query is not a long-running runner.
- Read-only. No write, no `--apply`.
- Announced 2026-08-19 before starting. Completion is confirmed in the CP2 artifact.

## Status log

- CP1 filed: `_inbox/2026-08-19_ss-w15_cp1.json`. Bastrop first test complete before any build.
- Heavy scan: ANNOUNCED, then RUN, then CONFIRMED COMPLETE (see CP2 for the results table).
