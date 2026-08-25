---
id: 2026-08-25_review_bastrop_48021_leftover
title: Adversarial review — P-78 Bastrop 48021 leftover (Texas fill #2)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 0a2c7c4; serving LDT 46e1a5a1; PE smartsite.cloud
---

# Review: Bastrop 48021 leftover

Apply is real. 48021 only. Packet PASSed the gate. L17 stays 2025 / cad-export. Do not roll back year or acres. Do not flip L17. Gold living area is a hold.

## Answers to the review asks

Bastrop was not the named county-2. The handoff left FIPS open. Path A on a CAPCOG county whose leftover year equals L17 is a legal pick, and it is the only pick that can prove inspect enrichment. Gold 48021 was the riskiest legal pick. The first apply ran on `feat/s1-instrument-hardening` and that risk landed on the regression parcel. KEEP the leftover fill. Do not treat 48021 as a planned FIPS.

Gold `48021:34137` live 2026-08-25T16:20Z on smartsite.cloud: `structuralFact.yearBuilt=1910`, `taxYear=2025`, `tier=cad-export`, `sourceVintage=tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48021_lp`. Year is on the inspect wire. The card does not render year built (`_inbox/2026-08-24_inspect_hop_diagram.md`). Situs still `908 PINE`. City limits still incorporated Bastrop. Land use still A1.

Gold `structuralFact.livingAreaSqft` is now `null`. The same hop and the Travis diagnosis named gold living area **2800** as the live `cad_property` path. That is a gold regression. Mechanism: first apply hard-nulled year / acres / sqft; repair COALESCE had a null CAMA side and StratMap does not restore sqft. Rejected alternative: 2800 was bake-only. The hop says living area is live from `cad_property`.

Wrong-branch incident is accepted as real and is required on any close. The two apply logs do not record git SHA. They are the same CLI (`--county=48021`, structured vintage, 63357 / 62257 / 1100 dupes). The incident evidence is the after-JSON note plus the gold sqft wipe. The gate did not pin writer SHA, so it could not have refused the first tree.

## Accept

- Packet `_inbox/2026-08-25_p78_announce_bastrop_48021_packet.json` re-graded this session: `--check --packet` PASS, derived Path A, leftoverN=77073.
- Census query has no `tax_year =` filter. Leftover year equals declared year, so one 2025 row satisfies both required years. Packet claims Bastrop has only 2025. Independent store re-count not run here.
- Structured vintage stamped. `--allow-stratmap-fallback` absent. Logs are 48021 only.
- Before 77073 / 40597 / 63129 → after 77799 / 49546 / 63855. year and acres net-positive vs original before.
- Prop_id `0` keys = 1, named not success.
- Scope locks held after the repair: no Dallas / Tarrant, no L17 flip, no atoms `--apply`, no rematerialize. Caldwell census file not re-queried; no second-FIPS log.

## Reject or hold

### 1. n rose 726. County grain is Path A. Key grain is mixed.

Path A means same PK in-place. 726 new 2025 keys are inserts at the leftover year. That is allowed by the spec (StratMap re-run does not open a new tax_year integer). Do not call the whole apply a pure in-place merge. Amend the announce to Path A update plus 726 new keys @ 2025.

### 2. Writer SHA was not a gate input.

First apply on `feat/s1-instrument-hardening` (pre–P-78 merge; `landuse.ts` still hard-nulls). Store briefly 8706 / 1598. Repair on detached `46e1a5a1` same session. Close cards must name both logs: `_inbox/2026-08-25_p78_bastrop_48021_apply.log` (bad) and `_inbox/2026-08-25_p78_bastrop_48021_apply_repair.log` (authoritative). Next packet must carry `ldtSha` equal to serving merge `46e1a5a1`. A missing or other SHA is a refuse. This gate does not have that field today.

### 3. Gold living area 2800 → null.

Do not invent a sqft restore. Do not DELETE Bastrop 2025. Restore is a later card that needs the CAMA export or a named backup of `cad_property.living_area_sqft` for 48021. Until then inspect Living area on gold is absent.

### 4. yearBuilt 1910 is not proven CAMA-preserved.

After the wipe, StratMap first-valid-year can fill 1910. CAMA-wins cannot preserve a value that is already null. Treat 1910 as leftover fill on the declared-year row, not as proof CAMA year survived.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto another year. Atoms `--apply`. Rematerialize. Dallas / Tarrant CAMA. Rewrite Caldwell 24989. Start county 3 before the SHA pin is in the gate.

## leave_behind

- Amend announce: Path A plus 726 inserts @ 2025. Name both apply logs and the hardening-branch incident on the close.
- Pin `ldtSha` on the apply gate. Fixture: packet with SHA ≠ `46e1a5a1` fails. Verify by violation.
- Gold 34137 living_area restore: later card, CAMA or backup, not this leftover writer.
- County 3 is not this card.
