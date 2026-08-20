# Watch registry (one file per watch)

Each watch is `_catalog/watch_registry/<id>.json` with `{id, path, maxQuietMin, note, paused?}`.

`scripts/stall-watchdog.mjs` globs this directory. `_catalog/watch_registry.json` is a retired many-writer file and is not read.

A runner without a file here is not dispatched (`90_runbooks/AGENT_CONTRACT.md` section 5).
