---
title: P-78 announce — Bastrop 48021 stratmap-landuse leftover (Texas fill #2)
date: 2026-08-25
status: amended
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_bastrop_48021_packet.json
review: _inbox/2026-08-25_review_bastrop_48021_leftover.md
close: _inbox/2026-08-25_p78_bastrop_48021_leftover_close.json
---

# Announce: Bastrop 48021 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48021** Bastrop |
| Path | **A** — in-place update on existing 2025 PKs **plus 726 new keys @ 2025** (not a pure in-place merge) |
| County grain | Path A (leftover year 2025 had n=77073 before apply) |
| Key grain | Mixed: 62,257 upserted; n 77073 → 77799 (+726 inserts at same tax_year) |
| Declared L17 | **2025 / cad-export** (no flip) |
| Inspect read set | **Yes** — leftover year matches declared vintage |
| Source | TxGIO StratMap 202503 zip (network fetch) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48021_lp` |
| Authoritative writer SHA | **`46e1a5a1`** (origin/main serving merge) |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| Gate | `_inbox/2026-08-25_p78_announce_bastrop_48021_packet.json` PASS (pre-SHA pin) |

## Apply logs

| Log | Tree | Status |
| --- | --- | --- |
| `_inbox/2026-08-25_p78_bastrop_48021_apply.log` | `feat/s1-instrument-hardening` (pre–P-78 merge) | **Bad run** — hard-nulled year/acres; store briefly yb=8706 / la=1598 |
| `_inbox/2026-08-25_p78_bastrop_48021_apply_repair.log` | Detached **`46e1a5a1`** | **Authoritative** — 62,257 upserted; final store counts below |

Logs do not record git SHA. Incident evidence: after-JSON note, gold sqft wipe, review `_inbox/2026-08-25_review_bastrop_48021_leftover.md`.

## Store measure (KEEP)

Before → after @ tax_year 2025: **77073 / 40597 / 63129** → **77799 / 49546 / 63855** (n / year_built / land_acres). Net-positive on year and acres vs original before. Prop_id `"0"` keys = 1 (not leftover success).

**KEEP** the leftover year and acres fill. Do not DELETE 2025 rows. Do not roll back.

## Gold hold (do not restore this card)

Live gold `48021:34137` probe: `_inbox/2026-08-25_p78_bastrop_48021_gold_34137_probe.json`

- `structuralFact.yearBuilt` = **1910** (StratMap leftover on declared-year row; not proof CAMA year survived wipe)
- `structuralFact.livingAreaSqft` = **null** (was **2800** on live cad_property path — gold regression)
- Situs still `908 PINE`. City limits still incorporated Bastrop. Land use still A1.

**HOLD** gold living area. Restore is a later card (CAMA export or named backup). Do not invent 2800.

## Scope locks

- **One county only:** 48021
- **No** `--allow-stratmap-fallback`
- **No** 48113 / 48439 / second FIPS
- **No** L17 flip
- **No** atoms `--apply` / rematerialize / P-25 CAMA
- **No** county 3 until gate pins `ldtSha`

Not the named county-2 FIPS in the handoff. Legal Path A pick that proved inspect enrichment; gold parcel was the risk surface.
