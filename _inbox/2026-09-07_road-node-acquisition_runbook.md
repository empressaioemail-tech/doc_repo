---
id: 2026-09-07_road-node-acquisition_runbook
title: Road-node acquisition runbook — Travis 48453 and Williamson 48491
date: 2026-09-07
status: ready
applies_to: P-124
plan_row: P-124
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _sessions/2026-09-07_ctx_completion_sprint_claude_code
---

# Road-node acquisition runbook

Produced by CTX-E (`cente-93`) at P-124 close from a code read of
`write-road-node-county.mjs`, the worker README and its `requirements.txt`, plus two
local read-only environment checks. Nothing in it was executed. The MD5 resolution in
the PBF section was performed by the integration seat and is the one fact CTX-E flagged
as an open gap.

Road-node atoms are the hard input to boundary-edge role labelling. Williamson and
Travis have zero, which is why A-111 originally ruled boundary edges five of six.
A-115 amended that to six of six with acquisition folded in, so this is the job that
unblocks the remaining two counties.

This is a RUN, not a build. The writer is general and county-parameterised, and it is
confirmed to be the mechanism behind existing coverage: Hays' 40,987 and McLennan's
28,787 atoms both carry `sourceAdapter` exactly `road-intake-osm-geofabrik-pbf`, which
is this script's own emitted tag.

## Command sequence, one county

Dry run is the default. No flag is needed to get it, and it writes nothing.

    cd packages/engine-core
    ROAD_NODE_COUNTY_PATH=1 \
    CORTEX_DATABASE_URL=<cortex/neondb URL> \
    DATABASE_URL=<atoms/hauska_mcp URL, DIRECT host> \
      pnpm run write-road-node-county -- \
        --county=48453 \
        --pbf=P:/tmp/statewide-roads/texas-latest.osm.pbf

That prints a JSON summary carrying `mode: "dry-run"` with predicted `atomsBuilt`,
plan and reconcile figures. Read it before applying.

Then apply:

    ROAD_NODE_COUNTY_PATH=1 PROPERTY_ATOM_PATH=1 ROAD_PBF_APPLY=1 \
    CORTEX_DATABASE_URL=<same> \
    DATABASE_URL=<same> \
      pnpm run write-road-node-county -- \
        --county=48453 \
        --pbf=P:/tmp/statewide-roads/texas-latest.osm.pbf \
        --apply

Swap `--county=48453` for `48491` to do Williamson. Nothing else changes.

`--list-counties` needs no other flags and prints the `tx_county_boundary` roster, which
is worth running once to confirm a FIPS exists before spending a four-minute extraction
pass on it.

**Apply is gated behind three separate environment variables**, not one:
`ROAD_NODE_COUNTY_PATH`, `PROPERTY_ATOM_PATH` and `ROAD_PBF_APPLY`. Setting two of the
three produces a named FATAL rather than a silent no-op, which is the correct fail-closed
behaviour, but the resulting error can read like an unrelated failure if it is skimmed.

## Stores and credentials

Two different databases and two different variables. Established by reading the code.

`CORTEX_DATABASE_URL`, falling back to `TXGIO_DATABASE_URL` and then `DATABASE_URL`,
reads `tx_county_boundary` only.

`DATABASE_URL` or `SUBSTRATE_DATABASE_URL`, resolved through `resolveSubstrateDatabaseUrl`,
is the atoms store on `hauska_mcp` and is what `--apply` writes to. This is the same
resolver every other writer used during P-124.

**`--apply` explicitly refuses any URL containing `-pooler.`** A direct Neon host is
required. The `ATOMS_DATABASE_URL` secret in GCP Secret Manager under project
`hauska-prod-497015` was checked and contains no `-pooler.` substring, so it is already
the right shape and no new secret is needed. This matters because a pooler-style
connection string is the default shape most Neon dashboards hand out, so a fresh session
is likely to reach for the wrong one first.

## The PBF, and which copy to use

Pass `--pbf=<path>`, or set `ROADS_PBF_PATH`. One or the other is required unless you are
using `--skip-extract --ndjson=<precomputed>`.

**There are two local copies with the same filename and they are not the same file.**
The script hardcodes `PINNED_MD5 = 4dd27afd6bc1c654f9b9635b709cf424` and verifies whatever
path you pass against it with a local `hashlib.md5()` read. There is no network fetch;
`--pbf-url` is a provenance string in the report, not something it downloads.

Resolved by the integration seat, 2026-09-07:

    P:/tmp/statewide-roads/texas-latest.osm.pbf   713,163,541 bytes   md5 4dd27afd6bc1c654f9b9635b709cf424   USE THIS ONE
    P:/tmp/pbf/texas-latest.osm.pbf               713,825,447 bytes   md5 9b280bdf97a7d3f5546a57fa5ae07b27   does not match, do not use

An earlier draft of amendment A-115 cited the `P:/tmp/pbf/` copy. That was wrong and is
corrected here and in the row. Passing it fails closed with a loud MD5 mismatch rather
than silently, so the cost is a wasted run rather than bad data, but there is no reason
to pay it.

## Toolchain

Python, resolved as any of `python`, `python3`, or `$ROADS_PBF_PYTHON`, plus `pyosmium`.
`requirements.txt` pins `osmium>=4.0.0,<5.0.0`.

On the machine P-124 ran on there is no per-worktree `.venv`, and `pyosmium 4.3.1` is
importable from the global Python 3.14.0 install, so it works without the venv step. A
fresh machine has neither. The worker's own README setup is:

    cd artifacts/roads-pbf-worker
    python -m venv .venv
    .venv/Scripts/pip install -r requirements.txt

The venv is optional; a global `pip install osmium` also satisfies it.

## Where to run it

The hauska-engine repo, from any worktree with `node_modules` installed at
`packages/engine-core`. The script imports from `../src/road-intake` and `../src/road-node`
through tsx, so there is no build step.

`P:/tmp/ctx-e-edges` already has hauska-engine checked out and installed, but it is
registered to CTX-E rather than to a road-node lane. Reusing it or cutting a fresh
worktree is a planner decision, not a lane one.

**If a new worktree is cut, register it in `_catalog/seat_register.json` with BOTH a
`path` and a `worktree` field.** The seat gate keys ownership on `repo.path`; an entry
carrying only `worktree` resolves to an empty repoPath, collides with every other such
entry, and causes the gate to refuse every git write with `product_index_foreign`. That
defect was introduced and repaired during P-124 and would otherwise recur.

## Cost

Extraction is a fixed per-run cost independent of county size, because the worker streams
the entire statewide PBF every time and filters to the target boundary. Measured from a
prior Bastrop run: 11,649,356 ways scanned, 4,028,297 highway ways, 217.95 seconds,
23,954 kept.

So budget roughly four minutes of extraction per county, then a variable apply scaling
with how many ways fall inside that county.

## Verify from the store, not from the writer

    SELECT count(*)
    FROM atoms
    WHERE entity_type = 'road-node'
      AND body->>'countyFips' = '48453'
      AND coalesce(body->>'status', 'active') = 'active';

Existing coverage from this exact writer, for shape: Caldwell 13,790, Hays 40,987,
McLennan 28,787. Travis contains Austin and Williamson contains Round Rock, Georgetown
and Cedar Park, all denser networks than any of those three, so expect meaningfully
higher. No measured figure exists for either county; do not predict one.

## What fails on a fresh machine that did not fail here

No venv and no `pyosmium`. Fails at the Python spawn with a clear stderr tail rather
than silently.

The pooler-URL refusal, which is only discoverable by reading the code.

The two-PBF-files problem, now resolved above but which cost a real investigation.

The three separate apply gates rather than one, where setting two of three produces a
FATAL that can be misread as a different failure.

## One risk carried, not resolved

Because the road path is not lease-gated, it has no self-heartbeat equivalent to the
protection that covers boundary-edge writes across a long run. Whether a long apply needs
its own guard against the Tuesday 05:00 to 06:00 UTC Neon maintenance window is unestablished
and should be settled before a run that could cross it.

---

## ADDENDUM — dry runs executed 2026-09-08 (integration seat, doc-repo-79)

Both counties dry-run against the MD5-verified `P:/tmp/statewide-roads/` copy, from a
dedicated worktree `P:/tmp/ctx-w2-roadnode` on `feat/ctx-w2-roadnode` at hauska-engine
`661f620b`. Dry run is the default; nothing was written and `atomsWritten` is 0 in both.

| County | plannedIds / atomsBuilt | priorActive | orphans | errors | wall |
| --- | --- | --- | --- | --- | --- |
| 48453 Travis | 218,345 | 0 | 0 | 0 | 35.9 min |
| 48491 Williamson | 115,287 | 0 | 0 | 0 | 15.4 min |

`priorActive: 0` on both confirms at source what A-111 asserted: neither county carries
any road-node atom today. CTX-E declined to predict a count and was right to; both land
far above the Hays 40,987 / McLennan 28,787 shape, Travis by better than five times.

### Three corrections to this runbook, found by running it

**`--list-counties` DOES require `ROAD_NODE_COUNTY_PATH=1`.** The runbook says it "needs
no other flags". Without the env var it exits `FATAL: ROAD_NODE_COUNTY_PATH=1 required
(guards against accidental invocation)`. Harmless, fails closed and loudly, but the
documented invocation does not work as written.

**The four-minute extraction budget is wrong for dense counties.** It is presented as a
fixed per-run cost because the worker streams the whole statewide PBF every time, and the
scan half genuinely is fixed. But the plan/build half scales with kept ways, and total
wall was 36 minutes for Travis and 15 for Williamson against the ~4 minutes measured on
Bastrop. Budget by county density, not by the constant.

**Both `tx_county_boundary` rows exist**, re-confirmed live via `--list-counties`: 48453
and 48491 both present, alongside 48021.

### What has NOT been done

No `--apply` has run for either county. The apply is still gated behind all three of
`ROAD_NODE_COUNTY_PATH`, `PROPERTY_ATOM_PATH` and `ROAD_PBF_APPLY`, and was deliberately
held rather than run concurrently with CTX-E's Hays boundary-edge write, which was still
in flight against the same atoms store on a path that carries no lease. The risk there is
contention, not corruption.

The maintenance-window question this runbook carries as its one unresolved risk is still
unresolved. It should be settled before an apply that could cross 05:00-06:00 UTC; both
measured wall times are short enough to schedule clear of it entirely, which is the
cheaper answer than establishing whether the road path survives a drop.
