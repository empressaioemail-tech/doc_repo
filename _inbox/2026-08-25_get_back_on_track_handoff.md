---
id: 2026-08-25_get_back_on_track_handoff
title: Handoff — stop P-25 dual reload; close honestly; ship PE leftovers
date: 2026-08-25
status: filed
plan_row: P-25
from: integration planner
to: the in-flight property planner
---

# Get back on track

Paste everything below the line into the in-flight planner session.

---

STOP. You are off the write-path.

P-78 [LDT #477](https://github.com/empressaioemail-tech/legacy-design-tools/pull/477) `72cffc8` is merged. That was the gate. What you opened next is a dual Dallas + Tarrant CAMA **reload** of counties that already landed 2026-08-14 (Dallas 806,563 / Tarrant 883,954). You announced both at the same second (`13:16:49Z`). Tarrant already failed: TLS `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on tad.org, then the loader correctly refused StratMap fallback. The routing pin still says last-wins and `ready:false` on P-25. You started the load anyway.

Dallas cad is already Manifest-present 99.91. L17 vintage flips are still held (key-space divergence). A reload will not move Manifest, will not flip L17, and will not bind Travis `48453:280238`. A-017 still says CAMA is backfill, not a QA gate.

#221 is search-bar + facets retry, not chips. Its WDLL said do not wire chips. No chips PR is open or merged on hauska-map. Do not call that leftover done.

## Do this now

1. Kill any in-flight cad-ingest against 48113 or 48439. Do not start the other county. Do not retry tad.org open-fetch.
2. Do not `git add` all. Do not raise the memory pin. Do not `--apply` atoms. Do not rematerialize.
3. One-line status in `_scratch/parcel-facts-write-path.md`: whether Dallas wrote any Wave-4 rows. If UNMEASURED, say UNMEASURED.

## Then run this wave only (three tracks, then stop)

Fan one level. First line of every sub-agent: `DO NOT SPAWN SUB-AGENTS`. They do not commit. You read every diff.

### Track 1 — P-25 honesty, not more ingest

Prefer skip. Reload a county only if you can name a last-wins wipe on a specific parcel (StratMap legal present, then CAMA null legal, then legal gone). If you cannot name one, do not reload.

If you do reload: one county, local `--file=` only (Dallas extract-first directory, or the 2026-08-14 cached Tarrant zip). Never live tad.org. After the write, live P-78 probe: CAMA null legal must not wipe existing legal. Quote row counts against `_inbox/2026-08-14_P25_full_loads_reconcile.md`. Do not flip L17.

### Track 2 — customer leftovers (this is the real bite)

Isolated hauska-map tree from `origin/main`. Not `fix/pe-pricing-a2`. Not the property-seat PE checkout.

- Who-serves + city-limits chips on inspect (P-75 / P-76 leftover). Backend is live on `cortex-api-00581-kuh`. PE UI is not.
- P-74 situs sentinel: trimmed `, TX` is absent. Fall through to `txgio_parcel.situs_address`. Gold `48021:34137` still prints `908 PINE`. One Travis title walk.

Open one PR. Close on live gold, not CI.

### Track 3 — instruments

Update `_inbox/2026-08-24_factory_routing_pin.json` so the cad/owner defect is no longer "P-78 last-wins still the writer." Keep P-25 / P-09 / roads `ready:false` until the live merge probe exists. Re-run `node scripts/factory-routing-readiness.mjs --check`. Manifest `--live` only if you need freshness. Do not invent a who-serves rail.

## Do not start

Travis CAMA. P-79 REST writer. P-09 footprint. COVER / Harris PBF. Factory 1 `--apply`. Factory 2 warm. A second metro fetch. Memory pin raise. Re-merge #475 / #476 / #477 / #221.

## Done looks like

1. No Wave-4 CAMA process running.
2. Either a named repair-or-skip note for Dallas/Tarrant, or one county measured against the 2026-08-14 baseline plus a live P-78 probe.
3. PE chips + P-74 on a branch or PR, gold probed.
4. Routing pin updated. P-25 still `ready:false`.
5. Close names leave_behind. Sub-agents did not commit.

Read `_inbox/2026-08-25_factory_operating_instructions.md` if you drifted off P-55 identity. Atom writes still use `parcel-write-identity.ts` / `atom_did IN` / `applies-to`. This wave should not mint atoms.
