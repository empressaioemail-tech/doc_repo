---
id: 2026-08-25_review_canvas_texas_gaps
title: Canvas vs WDLL vs live truth — honesty gap review
date: 2026-08-25
status: active
authority_snapshot: doc_repo origin/main 11763c0; cortex-api-00584-gaf @100% LDT 46e1a5a1; PE #222 9224a73; manifest dump 2026-08-25T04:13:26Z 667/3556
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _scratch/parcel-facts-write-path.md
---

# Canvas vs WDLL vs live truth — honesty gap review

Medium-thoroughness audit. Canvases are stamped `2026-08-25T13:05Z` as a family. Live ground-truth in `_scratch/parcel-facts-write-path.md` at `2026-08-25T14:16Z` supersedes that stamp on every conflict below.

## Authority used for this review

| Claim | Source |
| --- | --- |
| doc_repo | origin/main `11763c0` |
| Cortex serving | `cortex-api-00584-gaf` @100%, image `46e1a5a1` (LDT #478) |
| PE serving | #222 `9224a73`, chips + P-74 live on smartsite.cloud |
| P-77 item 7 | met `_inbox/2026-08-25_p77_honest_miss_close.json` |
| P-25 Wave 4 | SKIP per `_inbox/2026-08-25_p25_repair_or_skip.md`; routing pin `ready:false` |
| Tarrant store | +91,931 vs 2026-08-14 baseline; classified, not repaired |
| Manifest | GET dump `2026-08-25T04:13:26Z`, 667/3556; cad/owner/landuse 13 present / 241 not-yet |
| Held rows | P-80, P-09, COVER, P-79 |

---

## 1. Per canvas — stale SNAPSHOT and table cells (quoted lies)

### parcel-facts-write-path.canvas.tsx

**SNAPSHOT string (family lie):**

> `2026-08-25T13:05Z · P-78 merged · P-25 Wave 4 IN FLIGHT · 00581-kuh`

Three of four clauses are wrong: Wave 4 is SKIP not IN FLIGHT; serving revision is `00584-gaf` not `00581-kuh`; timestamp is pre-P-77-close and pre-operator STOP.

**Callout title:**

> `P-78 merged. Wave 4 CAMA reload in flight.`

**Callout body:**

> `P-25 Wave 4 IN FLIGHT: Dallas 48113 + Tarrant 48439 CAMA reload post-P-78.`

> `Cortex cortex-api-00581-kuh @100%`

> `PE #221 @ 730720a`

PE chips shipped on #222. Cortex is `00584-gaf`. Wave 4 was killed and ruled SKIP.

**Stats row:**

> `9 / 14` WDLL items met

> `in flight` — P-25 Wave 4 CAMA

> `667 / 3556` Manifest cells

Count is accidentally close but built from wrong per-item grades (see section 2).

**UsageBar caption:**

> `9 met · 1 in flight · 4 held`

Should be 9 met · 5 open (or 4 open + 1 SKIP), not 1 in flight.

**Waves table, Wave 4 CAMA tee:**

> `IN FLIGHT`

**WDLL grades table:**

| Item | Canvas grade | Lie |
| --- | --- | --- |
| 7 P-77 honest miss | `held` — `A-027. Serve lookup-failed still owed` | WDLL met `2026-08-25T14:14:55Z` on `00584-gaf` |
| 8 P-78 authority | `met` | WDLL grade `[ ]` open; violation test not filed |
| 9 P-78 leftover fields | `met` | WDLL grade `[ ]` open; dry-run artifact not filed |
| 10 P-25 Dallas/Tarrant | `in flight` — `Wave 4 CAMA reload 48113 + 48439 post-P-78` | SKIP; off-path partial loads; Tarrant +91931 unrepaired |

**Leave-behind table:**

> `P-25 Dallas/Tarrant CAMA reload` — `Wave 4 IN FLIGHT post-P-78`

**Footer close artifact:**

> `Serving digest matched Artifact Registry tag (not latest).`

Still names `00581-kuh` era; latest honest miss close is on `00584-gaf`.

---

### factory-health.canvas.tsx

**SNAPSHOT:**

> `2026-08-25T13:05Z · Manifest 667/3556 · P-78 merged · 00581-kuh @ minScale=1`

Serving revision wrong. Manifest count may still be numerically true but dump age is hours stale; labeling it operational without refresh is misleading.

**Live pin callout:**

> `Cortex cortex-api-00581-kuh @100%, minScale=1`

> `PE #221 search-bar desync on smartsite.cloud`

Both superseded (#222 chips; #221 was search-bar only).

**Factory 1.5 table, cad_property:**

> `P-25 CAMA reload in flight.`

**Three factories table, Factory 1.5:**

> `P-25 Wave 4 IN FLIGHT (Dallas/Tarrant). Then P-79`

Wave 4 SKIP. P-79 still held.

**Output view, cad / owner / landuse rail:**

> `P-25 Wave 4 IN FLIGHT then atom apply`

**Gate view, "This hour" callout:**

> `P-25 Wave 4 IN FLIGHT: Dallas 48113 + Tarrant 48439 CAMA reload post-P-78.`

> `cortex-api-00581-kuh @100% minScale=1`

**Do-not-start table:**

> `Dallas/Tarrant CAMA without P-78` — `Wave 4 in flight; routing pin still ready:false.`

Should read SKIP / do not restart, not in flight.

---

### county-manifest.canvas.tsx

**Program snapshot line:**

> `Program snapshot 2026-08-25T13:05Z: P-78 merged; P-25 Dallas/Tarrant CAMA reload IN FLIGHT`

**Callout "Program state 2026-08-25":**

> `P-25 Wave 4 IN FLIGHT for Dallas 48113 + Tarrant 48439 CAMA reload.`

**Watch counties footnote:**

> `Tarrant 89.45 not-yet: P-25 CAMA reload IN FLIGHT post-P-78`

Tarrant store was mutated off-path (+91931). Manifest cells unchanged until scorers run, but "IN FLIGHT" invites another reload.

**Blind to grid table:**

> `P-25 Wave 4 IN FLIGHT` — `Store reload post-P-78. cad rail is atom/scorer.`

**DATA block:** `fetchedAt: 2026-08-25T04:13:26.609Z`, `freshness: "FRESH"`. Counts (667/3556, cad 13/241) match live authority. The lie is program-state prose and FRESH label hours after the operator STOP, not necessarily the cell arithmetic.

---

### parcel-public-facts-deficit.canvas.tsx

**SNAPSHOT:**

> `2026-08-25T13:05Z · P-78 merged · 00581-kuh · PE UI wiring IN FLIGHT`

PE chip UI shipped on #222. Serving revision wrong.

**Callout "P-75 / P-76 cortex gold":**

> `Serving cortex-api-00581-kuh @100% minScale=1`

> `PE UI wiring for inspect chips is IN FLIGHT (leave_behind).`

Both stale post-#222 close.

**Callout "P-78 merged · P-25 Wave 4 in flight":**

> `P-25 Dallas 48113 + Tarrant 48439 CAMA reload post-P-78.`

**County-tier rows T48113 / T48439:**

> `loaded; P-25 reload IN FLIGHT`

> `Wave 4 CAMA post-P-78 merge`

**Roadmap fit table:**

> `P-78 then P-25` — `P-78 merged; P-25 IN FLIGHT`

---

### recalibration-and-design-systems.canvas.tsx

**SNAPSHOT:**

> `2026-08-25T13:05Z · 00581-kuh @ minScale=1 · P-78 merged · PE #221 live`

**Serving callout:**

> `Cortex cortex-api-00581-kuh @100%, minScale=1`

**leave_behind callout:**

> `item: P-25 Wave 4 CAMA Dallas/Tarrant · write-path · IN FLIGHT.`

> `item: PE inspect chip UI · backend live on cortex · plan_row: P-75 / P-76.`

Chips UI done on #222. Wave 4 SKIP.

**Lane 3 card:**

> `P-25 Wave 4 IN FLIGHT. Manifest dump FRESH 667/3556.`

**Lane 3 table Wave 3+:**

> `P-78 merged. P-25 Wave 4 IN FLIGHT (Dallas/Tarrant).`

**P-77 row (partial truth):**

> `Measure live 10/1/0/0. Serve half HELD.`

Serve half is met; only the canvas family has not restamped.

**Footer:**

> `P-25 Wave 4 in flight.`

**SHIPPED table still lists P-75/P-76 on 00581-kuh** — historically true at ship time; misleading as current serving pin without noting 00584-gaf for P-77.

---

## 2. WDLL items — actually open vs canvas claiming met

| # | Item | WDLL grade (authority) | Canvas grade | Verdict |
| --- | --- | --- | --- | --- |
| 1 | P-73 map | met | met | OK |
| 2 | OPS-16 rows | met | met | OK |
| 3 | P-74 situs sentinel | `[ ]` open | held | OK (both open/held) |
| 4 | P-75 who-serves | met 05:12Z | met | OK |
| 5 | P-76 city limits | met 05:12Z | met | OK |
| 6 | P-77 measure | met 02:08Z | met | OK |
| 7 | P-77 honest miss | **met 14:14Z** on `00584-gaf` | **held** | **Canvas lie** |
| 8 | P-78 authority | **`[ ]` open** | **met** | **Canvas lie** |
| 9 | P-78 leftover fields | **`[ ]` open** | **met** | **Canvas lie** |
| 10 | P-25 Dallas/Tarrant | **`[ ]` open** (SKIP decision) | **in flight** | **Canvas lie** |
| 11 | No silent scope | met | met | OK |
| 12 | Close hygiene | **`[ ]` open** | open | OK |
| 13 | County Manifest | met 04:08Z | met | OK (instrument met; dump refresh is hygiene) |
| 14 | Two-track pin | met 04:40Z | met | OK |

**Still actually open:** 3, 8, 9, 10, 12.

**Recently closed but canvas not updated:** 7 (and PE chip UI from #222, not a WDLL item but repeated as IN FLIGHT across canvases).

**Canvas false met count:** marks 8 and 9 met while WDLL leaves them blank. Marks 7 held while WDLL closed it. The headline `9 / 14` matches WDLL met count by accident, not by honest per-item grading.

**Item 10 nuance:** WDLL still shows `[ ]`. Operator ruled SKIP with off-path partial Dallas load and Tarrant +919931 damage documented in scratch. Item 10 needs a WDLL amendment (SKIP with evidence), not an "in flight" canvas state.

---

## 3. What "canvases reading full" can honestly mean

**Can mean:**

- All five canvases restamped to a single authority snapshot (serving revision, wave states, WDLL grades).
- Manifest DATA refreshed via `node scripts/county-manifest-canvas-dump.mjs --live` and pasted into canvas constants; `computedAt` on canvas matches dump file.
- Program-state prose matches routing pin and scratch GROUND-TRUTH.
- Cross-links between canvases agree on who-serves / city-limits not being rails.

**Cannot mean:**

- 3556/3556 Manifest cells satisfied.
- cad / owner / landuse 254/254 present.
- "Texas completeness" at 100%.

**667/3556 (22.56%) is not a factory failure** when:

- Five rails (roads, footprint, easement, rrc-wells, envelope) are 254 not-yet by routing pin (`ready:false` on P-25, P-09, P-17).
- cad / owner / landuse at 13 present / 241 not-yet matches the pin: atom apply has not run for most counties and Wave 4 CAMA reload is SKIP.
- Geometry 253 + flood 162 + mud 134 present are the honest satisfied-present rails for this program stage.

Honest read: Manifest canvas shows **ledger freshness and rail-shaped gaps**, not program completion. A dump refresh without rematerialize is the correct refresh semantics (WDLL item 13).

---

## 4. What "Texas truly done" cannot mean this month

**Cannot mean (later factory / held rows):**

| Scope | Why not this month |
| --- | --- |
| 3556/3556 Manifest cells | Requires statewide atom apply on cad, footprint, roads, easement, wells, envelope |
| 10.67M footprint atoms (P-09) | Slot held; engine main still bbox writer (A-004); routing pin `ready:false` |
| Roads COVER (P-17 / A-022) | Parked; Harris PBF wrote 0 atoms; A-017 backfill not QA gate |
| P-80 Travis ~51% join fix | Wave 6; measure done, fix not started |
| P-79 REST harvest | Writer absent; Wave 5 |
| P-25 statewide CAMA | Dallas/Tarrant SKIP; Bexar/Collin/Denton Wave 6; Tarrant store damage unrepaired |
| Full cad rail 254 counties | 241 not-yet by pin; 13-county apply is current honest state |
| ETJ statewide | No layer; P-76 ships unresolved only |
| Factory 2 depth (SB08, zoning 253 not-yet) | Out of write-path map |

**Honest "Texas done" slice for THIS program (write-path WDLL items 1–14):**

Close items 3, 8, 9, 10 (with amendment if 10 stays SKIP), and 12 with filed evidence. That is:

- P-74 situs sentinel on isolated PE tree (partially addressed by #222; WDLL 3 still wants explicit grade).
- P-78 authority violation test green in cad-ingest (item 8).
- P-78 leftover StratMap fields: parser + one-county dry-run artifact (item 9).
- P-25: either repair Tarrant baseline and re-scope Dallas/Tarrant with operator go, or amend WDLL to record SKIP and leave store cleanup as leave_behind (item 10).
- Program close hygiene: leave_behind, thesis parity if applicable (item 12).

**Not required for this program close:**

- Manifest majority fill.
- Footprint drain.
- Travis join fix (P-80).
- REST harvest (P-79).
- COVER roads.

Those belong to later factory waves per game plan Wave 5–6 and factory operating instructions.

---

## 5. Bug-risk list if canvases are not restamped

| Risk | Stale string that triggers it | Likely bad action |
| --- | --- | --- |
| **Wave 4 CAMA restart** | `P-25 Wave 4 IN FLIGHT` (all five canvases) | Operator or implementing agent reruns Dallas/Tarrant cad-ingest despite SKIP ruling and routing pin `ready:false` |
| **Tarrant damage ignored** | Tarrant watch "IN FLIGHT" without +91931 | Treats corrupted baseline as in-progress reload instead of classified repair |
| **Wrong cortex deploy target** | `00581-kuh` everywhere | Probes and closes filed against superseded revision; misses regressions on `00584-gaf` |
| **P-77 serve re-opened** | Item 7 `held` on write-path canvas | Duplicate LDT work for lookup-failed already merged #478 |
| **P-78 false done** | Items 8–9 `met` on write-path canvas | CAMA or stratmap-landuse re-run before authority test and dry-run exist |
| **PE chips re-wired** | `PE UI wiring IN FLIGHT` (deficit, recalibration, write-path) | Second PR on hauska-map for chips already on #222 |
| **Manifest rematerialize** | Stale "IN FLIGHT" + impatience with 22% | Agent rematerializes ledger to "move cells" after store upsert (forbidden; cells move on scorer apply) |
| **Factory 1 apply early** | factory-health "P-25 IN FLIGHT then atom apply" | Atoms `--apply` on cad rail while pin says `ready:false` |
| **Item 12 never filed** | Canvas shows 9 met, program feels done | Close without leave_behind, parity ledger, or P-25 SKIP amendment |
| **Two-track collapse** | Recalibration Lane 3 still says IN FLIGHT CAMA | Recalibration agent starts ingest from wrong board despite union pin |

**Highest severity:** Wave 4 IN FLIGHT + `00581-kuh` serving pin. Together they contradict scratch, routing pin, and WDLL on the two decisions most likely to cause another off-path ingest.

---

## Recommended restamp minimum (implementing agent owns canvas edits)

1. Family SNAPSHOT: `2026-08-25T14:16Z · P-77 closed · P-25 SKIP · 00584-gaf · PE #222`
2. Write-path WDLL table: 7 met, 8/9/10 open, 12 open; usage bar 9 met · 5 open (or 4 open + 1 SKIP after amendment).
3. Remove every `IN FLIGHT` string for P-25; replace with `SKIP (operator 2026-08-25)` and cite `_inbox/2026-08-25_p25_repair_or_skip.md`.
4. PE chips: `met #222` not IN FLIGHT.
5. Manifest DATA: rerun dump script; update `fetchedAt` / `computedAt`; keep 667/3556 if unchanged.
6. factory-health / county-manifest: cad rail next legal write = held per pin, not Wave 4.

---

## Summary

The canvas family is internally consistent with itself at `13:05Z` but **externally false** against WDLL, scratch, and live serving as of `14:16Z`. The dominant lie class is **P-25 Wave 4 IN FLIGHT** (should be SKIP) and **00581-kuh** (should be **00584-gaf**). Secondary lies: WDLL items **7 held** (met), **8–9 met** (open), **10 in flight** (open/SKIP). Manifest **667/3556** is numerically honest for the 04:13Z dump and is **not** evidence of factory failure. **Texas done** for this program means closing WDLL items 3, 8, 9, 10, 12, not filling the Manifest grid.
