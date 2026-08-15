---
id: 2026-08-09_W1_writers_program_dispatch_pack
title: W1 writers program — dispatch pack (D0–D3)
date: 2026-08-09
status: active
owner: nick
program: OPS-14 W1
authorization: Nick 2026-08-09
---

# W1 writers program dispatch pack

Hand-carried briefs for Cursor-native executor agents. Planner verifies at source; never accepts sub summary without independent SQL + serve probe.

**Preamble:** paste from `_catalog/DISPATCH_PREAMBLE.md` (CANON-PREAMBLE v0f465c77).

**Slot rule:** one bulk writer per database. At dispatch time the atoms slot is HELD by parcel-node sweep — see `_inbox/2026-08-09_W1_D0_slot_gate_status.md`. D1 RUN stages start only after D0 closes.

---

## D0 — SLOT GATE + SCORER (planner-owned, in progress)

**Status:** HELD on sweep. See status artifact above.

**Executor brief (post-stability only):**

```
NO NESTING — do not dispatch subs.

CANON-PREAMBLE v0f465c77
ROLE: D0 scorer executor. Repo: P:\legacy-design-tools only.

PRECONDITION: Two identical parcel-node counts 10 minutes apart (artifact in _inbox).

1. Fingerprint direct host (strip -pooler) on DATABASE_URL + DEPLOYMENT_DATABASE_URL.
2. curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger → save as P:/tmp/w1_d0_ledger_before.json (skip if planner already captured).
3. tsx artifacts/api-server/src/countyGeometryScoreCli.ts --all --dry-run
   Review summary; exit must be 0.
4. ADVERSARIAL CHECKPOINT 1 (independent reviewer sub — NOT you):
   Pre-register: for 3 counties (48261 Kenedy, 48021 Bastrop, one mid-coverage), expected atom/feature ratio bands from independent SQL on both stores.
   Attack dry-run JSON vs pre-registered expectations; below-threshold counties must be not-yet, never satisfied-present.
5. tsx artifacts/api-server/src/countyGeometryScoreCli.ts --all (apply)
6. curl ledger again → P:/tmp/w1_d0_ledger_after.json; paste before/after summary JSON verbatim in close artifact.
7. ADVERSARIAL CHECKPOINT 2: reviewer SQL on county_facet_coverage facet=geometry + one live ledger GET.

CLOSE: _inbox/2026-08-09_W1_D0_geometry_scorer_CLOSE.md with reviewer artifacts attached.
```

---

## D1 — RUN three existing writers statewide

Scripts (engine main, #291 merged):

| Family | Script | Source join | accessPolicy at mint |
|---|---|---|---|
| cad-parcel-roll | `write-cad-parcel-roll-county.mjs` | `cad_property` (15 counties today) | **public-free** (`cad-parcel-roll-writer.ts`) |
| land-use-fact | `write-land-use-fact-county.mjs` | txgio × cad_property | **public-free** |
| flood-hazard-fact | `write-flood-hazard-fact-county.mjs` | txgio × tx_fema_nfhl_flood_zone (198,178 rows statewide) | **public-free** |

Env guards: `CAD_PARCEL_ROLL_PATH=1` / `LAND_USE_FACT_PATH=1` / `FLOOD_HAZARD_FACT_PATH=1`. Atoms writes: `DATABASE_URL` → hauska_mcp direct host. Reads: `CORTEX_DATABASE_URL` → neondb.

**Per-family executor brief (three parallel subs allowed; planner HOLDs until all three close):**

```
NO NESTING — do not dispatch subs.

CANON-PREAMBLE v0f465c77
ROLE: D1-<FAMILY> statewide writer executor. Repo: P:\hauska-engine.

PRECONDITION: D0 close artifact exists; atoms bulk slot released in _STATE.md.

(a) Record accessPolicy in close artifact (table above — flag operator if proposing change from public-free).

(b) Dry-run ONE county with data:
    - cad: pick a cad_property county (e.g. 48055)
    - land-use: same or adjacent
    - flood: 48261 or any county with NFHL overlap
    Exercise honest-absence: pick ONE county with empty zone / no CAD row; confirm typed absence atoms, not silent zero rows.

(c) ADVERSARIAL CHECKPOINT 1 (independent reviewer):
    Pre-register source SQL counts vs writer dry-run plan counts BEFORE reading writer output.
    Different frame: reviewer runs own SQL on cad_property / tx_fema_nfhl_flood_zone / txgio_parcel, not writer tests.

(d) Tranche waves (--apply, concurrency 1-2, direct host fingerprint):
    - cad: 15 counties with cad_property rows
    - flood: all counties with geometry (join statewide NFHL)
    - land-use: counties with cad_property join
    Cost checkpoint per tranche in close artifact.

(e) ADVERSARIAL CHECKPOINT 2: independent SQL on atoms + live serve probe (retrieval or cortex facet).

(f) countyCoverageScoreCli + countyRailRefreshCli so ledger reflects new families.

CLOSE: _inbox/2026-08-09_W1_D1_<family>_CLOSE.md — counts by county, absence distribution, ledger delta, both reviewer artifacts.
```

---

## D2 — BUILD footprints + easements writers

**Do NOT build:** roads writer (F5 blocked), owner writer (accessPolicy ruling pending).

**Starting point:** `feat/t3-ingest-site-layers` on hauska-engine (adapters/site-layers + `ingest-site-layers.mjs`). Refactor to match #291 county-writer pattern:

- `write-building-footprint-county.mjs` — default `ml-global-building-footprints`, `sourceTier=ml-derived`, `accessPolicy=public-free` (ADR-029 ruling #3)
- `write-utility-easement-county.mjs` — honest-absence-heavy; present-data exceptions: McLennan CAD linework (48309), City of Bastrop municipal polygons

Spec: `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`

**Executor brief (BUILD only — no statewide apply until D1 slot pattern clear):**

```
NO NESTING — do not dispatch subs.

CANON-PREAMBLE v0f465c77
ROLE: D2-<footprint|easement> writer builder. Repo: P:\hauska-engine.

1. Branch from main; port/adapt feat/t3-ingest-site-layers adapters into engine-core/src/<family>/ mirroring cad-parcel-roll layout (plan-*, *-atoms.ts, script).
2. Write-then-verify on stored bytes (same pattern as #291 writers).
3. Dry-run CLI with --county=48021 and --county=48309 (easement present exception).
4. Unit tests for honest-absence paths (county with no source → coverage absence atom, not zero rows).
5. ADVERSARIAL CHECKPOINT 1 before any apply PR: reviewer pre-registers expected counts from source probes in _inbox T3 recon docs.

NO statewide --apply in this lane. Merge on CI SUCCESS only.

CLOSE: _inbox/2026-08-09_W1_D2_<family>_BUILD.md + PR link.
```

---

## D3 — JOINT E2E PROBE (after D1 lands)

```
NO NESTING.

PRECONDITION: D1 close artifacts for all three families.

For each family: one full write → read → serve trace on a real parcel through cortex/retrieval to customer surface. Paste verbatim request/response bodies in _inbox/2026-08-09_W1_D3_e2e_<family>.md.

Factory-joint acceptance per OPS-14 W1.
```

---

## Planner cadence

- Poll D0 stability every 10 min until gate clears.
- D2 BUILD may run in parallel (no atoms slot for code-only).
- D1 and D3 serialize on atoms slot + D1 completion.
- Update `_STATE.md` OPEN section when D0 releases slot.
