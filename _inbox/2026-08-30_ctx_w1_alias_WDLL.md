---
id: 2026-08-30_ctx_w1_alias_WDLL
title: WDLL — CTX CAD to TxGIO alias persist (T1.1 reconciliation product)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: hauska-factory (landing + identity.alias writer), legacy-design-tools (bake reads alias first)
plan_row: F-10, F-16, F-06
depends_on: _decisions/2026-08-30_ctx_cad_txgio_alias.md, _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md, 19_the_instrument_contract.md Identity, 24_instrument_conformance_program.md T1.1 T1.5, OPS-19 A-022 A-026 A-029
operator_go: 2026-08-30 (yes to persist successful situs binds as aliases; next bake reads the alias)
snapshot: integration P:/doc_repo main 62aefa4; card H joined-situs Hays 130663 / Williamson 511029; seed unlifted
owner: property-seat subagent produces the diffs; planner commits and runs the persist job; Wave R does not start until backfill counts match
---

# CTX CAD to TxGIO alias persist

Date: 2026-08-30  Status: approved

A successful situs bind is an identity fact. It does not live only inside a snapshot. This card is the map. W1 recovery still finds new binds. This card stores them and the card H binds already on the wire.

## Done looks like

Every `joined-situs` row on the six has a landing row and an `identity.alias` atom: subject the CAD node `{fips}:{prop_id}`, value the TxGIO natural key the owner gate accepted, authority `ownersAgree`, method `cad-roll-address-join`, `validFrom` / `knowledgeAt` set, access the public pair. Wave R bake hits that alias first and does not re-situs a still-valid era. `gate-blocked` and cannot-bind write no alias. 48209 and 48491 still refuse a `prop_id` join. Landing count equals alias-atom count per FIPS.

## Acceptance items

1. **Landing schema.** Factory landing `landing_cad_txgio_alias` (name may match an existing table if one already has these columns; do not invent a second). Required columns: `county_fips`, `cad_prop_id`, `txgio_id`, `situs_key`, `owners_agree` (true only), `as_of`, `method` (`cad-roll-address-join`), `publish_run_id` or recovery run id. Unique on `(county_fips, cad_prop_id)` for the open era. No row with `owners_agree` false. | check: migration plus a fixture that refuses a false or null owner gate | grade: [met — schema only; migration 0005 not applied]

2. **Alias atom.** `identity.alias` per doc 19: subject CAD node, value TxGIO key, authority, provenance class, valid time, knowledge time, access. Not a field on the node. Not `externalKeys` only. Replay reuses the earliest era when the binding is unchanged (A-022). | check: fail-then-pass; a row missing clocks or authority refuses | grade: [met — writer shape only; no persist]

3. **Card H backfill.** Persist every production `joined-situs` on the six card H `publishRunId`s before Wave R. Measured floor: Hays 130,663 and Williamson 511,029 from the 13:48:33Z recount. Other FIPS contribute only if they already have `joined-situs`. A backfill that writes zero on a FIPS that the recount named fails. | check: landing count and alias-atom count vs recount, snapshot (host, commit, time) | grade: [shape only — parser in 866c38b; live run planner; card H may omit parcelJoin.txgio_id]

4. **W1 new binds.** After W1 recovery, each new `joined-situs` writes the same landing plus alias. W1 LDT does not write atoms. It emits the bind record the persist job consumes, or the persist job re-reads recovery output. | check: one fixture bind appears in landing and as an atom; W1 PR does not open an atoms writer | grade: [met as code — factory 866c38b; live apply still planner]

5. **Bake reads alias first.** Conformant tier 1: if an open alias exists for `(county_fips, cad_prop_id)` at `knowledgeAt`, join from that TxGIO key and set `parcelJoin.state` `joined-situs` with source `cad-txgio-alias`. Situs plus `ownersAgree` runs only when no open alias exists. A blocked-FIPS `prop_id` hit is still unused. | check: fail-then-pass; alias hit skips situs fetch; missing alias still recovers or refuses | grade: [met — LDT c7685e6a READ only; persist still owed]

6. **No alias on refuse.** `gate-blocked`, owner disagree, punctuation-only situs, and cannot-bind write T1.5 `lookup-failed` or keep `gate-blocked`. They do not write landing or alias. Taylor 48491:76149 has no alias. | check: poisoned refuse fixture has zero landing rows | grade: [met — Taylor and refuse kinds write zero]

7. **Two-count meaning check.** Per FIPS, landing open-era rows equal `identity.alias` atoms whose value is a TxGIO key with method `cad-roll-address-join`. A FIPS where they disagree fails the card. Seed leak still fails the wave (any 48209/48491 `parcelJoin.state: joined`). | check: file-based count instrument, both directions, including a not-vacuous disagree fixture | grade: [met as instrument — live two-count still planner]

8. **Slot and handback.** One writer per `(hauska_mcp, identity.alias, county_fips)`. Do not run this job on a FIPS while F-16 resolve is writing the same entity. Diff by file; no laptop `--apply`; no Wave R until items 3 and 7 pass. | check: handback names the job and the FIPS lock | grade: [met — job alias-persist; lock named; handback filed]

## Do not

- Lift the seed or join 48209 / 48491 on `prop_id`.
- Write an alias from address match without `ownersAgree`.
- Invent `geo_id` as the TxGIO key (P-80).
- Treat snapshot `joined-situs` as the map once this card exists.
- Mint a canonical id from the TxGIO key.
- Run two `identity.alias` writers on the same FIPS.
---
