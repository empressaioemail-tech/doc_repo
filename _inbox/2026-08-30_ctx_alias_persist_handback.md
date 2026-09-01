---
id: 2026-08-30_ctx_alias_persist_handback
title: Handback — CTX alias persist (W1 consume, refuse, two-count, slot)
date: 2026-08-30
status: handback
plan_row: F-10, F-16, F-06
parent: _inbox/2026-08-30_ctx_w1_alias_WDLL.md items 4, 6, 7, 8 (item 3 shape only)
cards:
  - _inbox/2026-08-30_ctx_w1_alias_WDLL.md
depends_on:
  - _decisions/2026-08-30_ctx_cad_txgio_alias.md
  - _inbox/2026-08-30_ctx_w0_residue_recount.json
seat: property
worktree: P:/seat-worktrees/property/hauska-factory-ctx-publish
repo: P:/hauska-factory
branch: seat/property-ctx-walk-alias-schema
snapshot: HEAD 701b9d5e (feat walk S5 roster); parent 6ecc021 schema only; uncommitted persist diff; no commit
owner: property-seat executor produced the diff; planner reviews and commits
---

# CTX alias persist handback

Date: 2026-08-30  Seat: property  Status: diff ready, uncommitted

Planner commits. This seat did not commit, push, open a PR, apply migration 0005, run persist against live stores, bake, publish, or run laptop `--apply`.

## Snapshot

- Worktree: `P:/seat-worktrees/property/hauska-factory-ctx-publish`
- Branch: `seat/property-ctx-walk-alias-schema`
- HEAD: `701b9d5e28bcbe4de8b1487d3acc9d905d1f6a60` (S5 feed; parent `6ecc021` has alias/setback/easement schema only)
- Tree on arrival was clean. Diff is this lane only.

## Job and FIPS lock (item 8)

Job name: `alias-persist` (`src/jobs/alias-persist.mjs`, CLI `factory alias-persist`).

Lock: one writer per `(hauska_mcp, identity.alias, county_fips)`. Constant `ALIAS_WRITER_LOCK`. Another recorded `identity.alias` writer on that FIPS refuses `ALIAS_WRITER_HELD` (fixture: F-16 resolve on 48209).

`--apply` is the only write path. It refuses unless `FACTORY_ALIAS_PERSIST_GO=1` and a run row already exists. This job does not call `startRun`. Default is dry-run. Laptop `--apply` without those two is a refuse fixture (`ALIAS_PERSIST_GO_REQUIRED` / `RUN_ROW_REQUIRED`). Landing writes go to neondb (`CORTEX_DATABASE_URL`); atoms to `hauska_mcp` (`DATABASE_URL`). Tests use fakes. The two stores are never joined in one SQL.

## Files changed

Modified:

- `src/cli.mjs` — `alias-persist` command
- `src/lib/cad-txgio-alias.mjs` — comment only (persist lives in the job)

Added:

- `src/lib/cad-txgio-alias-persist.mjs` — classify, persist, apply gate, writer slot, landing INSERT SQL
- `src/lib/cad-txgio-alias-snapshot.mjs` — card H parser/filter; `CARD_H_SNAPSHOT_SQL`; measured floors as comments only (Hays 130663, Williamson 511029 from the 13:48:33Z recount)
- `src/lib/cad-txgio-alias-counts.mjs` — two-count instrument + seed-leak + self-test
- `src/jobs/alias-persist.mjs` — thin CLI
- `scripts/alias-two-count.mjs` — file-based instrument (`--self-test`)
- `test/alias-persist.test.mjs`
- `fixtures/alias-persist/w1-bind.json` — one W1 emit bind
- `fixtures/alias-persist/taylor-refuse.json` — Taylor `48491:76149` gate-blocked
- `fixtures/alias-persist/card-h-snapshots.json` — joined-situs becomes a bind; gate-blocked does not

## Cards graded

`_inbox/2026-08-30_ctx_w1_alias_WDLL.md`:

| Item | Grade | Evidence |
|---|---|---|
| 1 Landing schema | already met | not relitigated |
| 2 Alias atom shape | already met | not relitigated |
| 3 Card H backfill | shape only | parser + `--source=card-h-snapshots`; live run not executed |
| 4 W1 bind consume | met as code | fixture bind becomes one landing row and one `identity.alias` body; A-022 reuse; no LDT atoms writer |
| 5 Bake reads alias | already met | LDT other worktree; not touched |
| 6 No alias on refuse | met | gate-blocked, owner disagree, punctuation-only situs, cannot-bind write zero; Taylor 48491:76149 has zero landing |
| 7 Two-count | met | pass n>0; landing 2 vs atoms 1 fails; 48209/48491 `joined` fails; `joined-situs` is not a leak; 0=0 is vacuous |
| 8 Slot and handback | met | job `alias-persist`; lock `(hauska_mcp, identity.alias, county_fips)` |

## Tests run and the violation each proved

Command: `node --test test/alias-landing-schema.test.mjs test/alias-persist.test.mjs` in the worktree. Result: 13 pass, 0 fail. Snapshot: HEAD `701b9d5e`.

Instrument self-test also via `node scripts/alias-two-count.mjs --self-test` (exit 0).

1. **Item 4 fixture bind** — violated by a missing landing or atom. Pass: `fixtures/alias-persist/w1-bind.json` parses to landing `(48209, 135570, txgio-hays-135570)` and atom subject `48209:135570` value `txgio-hays-135570` method `cad-roll-address-join`. Dry-run writes zero.
2. **A-022 reuse** — violated by inserting a second row when the open-era binding is unchanged. Pass: `reused=1`, would-write 0. Changed `txgio_id` writes a new era.
3. **Laptop `--apply`** — violated by `--apply` without `FACTORY_ALIAS_PERSIST_GO=1` (`ALIAS_PERSIST_GO_REQUIRED`) and by GO=1 with no run row (`RUN_ROW_REQUIRED`). Pass: GO=1 plus existing run row plus fakes writes one landing and one atom.
4. **Item 6 refuse** — violated if Taylor `48491:76149` or owner-false / null / `, ,` / `cannot_bind` reached INSERT. Pass: each writes zero landing and zero atoms. `assertOwnersAgree(false)` still throws `ALIAS_OWNERS_REFUSED` on the landing parser; classify keeps refuse records off INSERT.
5. **Item 3 parser** — violated if a gate-blocked card H row became a bind, or a joined-situs row with cad prop + TxGIO key on `provenance.parcelJoin` did not. Pass: one bind, one skip.
6. **Item 7 pass** — landing 2 and atoms 2, n>0, equal.
7. **Item 7 not-vacuous disagree** — landing 2, atoms 1 throws `ALIAS_COUNT_DISAGREE`. 0=0 throws `ALIAS_COUNT_VACUOUS` (not a pass).
8. **Item 7 seed leak** — `48209` or `48491` `parcelJoin.state === joined` throws `SEED_LEAK`. `joined-situs` on those FIPS, and `joined` on 48021, do not.
9. **Item 8 lock** — F-16 resolve recorded on `(hauska_mcp, identity.alias, 48209)` throws `ALIAS_WRITER_HELD`. Empty registry on that FIPS passes.

## Card H live note (item 3)

The parser requires the TxGIO key on `provenance.parcelJoin` (`txgio_id` / `txgioId`). It does not invent one from address or from `prop_id`. Card H payloads on the wire may omit that field (card H basis strings named the situs match, not the TxGIO key). Those rows parse to null (cannot-bind), not an invented alias. The planner's live backfill must either pass a dump that already carries the key or amend the extract. Measured floors stay `--expected-count=48209:130663 --expected-count=48491:511029`.

## What this lane did NOT do

- Commit, push, open a PR
- Apply migration 0005
- Connect to Neon or `hauska_mcp`
- Laptop `--apply`
- Wave R / bake / publish / deploy
- Touch LDT or hauska-map
- Lift the seed or join 48209/48491 on `prop_id`
- Invent P-80 `geo_id`
- Mint a canonical id from the TxGIO key
- Two `identity.alias` writers on one FIPS

## leave_behind

```
leave_behind:
- item: item 3 live card H backfill run (joined-situs on the six publishRunIds; floors 48209:130663 and 48491:511029)
  owner: planner
  plan_row: F-10 / F-16
  card: _inbox/2026-08-30_ctx_w1_alias_WDLL.md item 3
- item: apply migration 0005 to the Factory neondb store (landing_cad_txgio_alias)
  owner: planner
  plan_row: F-01 / F-10
- item: two-count instrument on live stores (open-era landing vs identity.alias atoms per FIPS)
  owner: planner
  plan_row: F-10 / F-16
  card: _inbox/2026-08-30_ctx_w1_alias_WDLL.md item 7
- item: Wave R pin (does not start until items 3 and 7 pass on live counts)
  owner: planner
  plan_row: F-06
  card: _inbox/2026-08-30_ctx_facts_complete_WDLL.md item 9
- item: live card H rows may omit parcelJoin.txgio_id; extract must be amended or a W1 bind dump used before backfill can meet the floors
  owner: planner
  plan_row: F-10
```
