---
id: 2026-09-13_ops23_checkpoint_5
title: OPS-23 wave 5 — dispatch planner checkpoint (END OF WAVE; supersedes the mid-wave handoff of the same name)
date: 2026-09-14
status: wave closed-partial, all five rows closed-partial, planner replaced at wave end
---

# OPS-23 wave 5 checkpoint — END OF WAVE

**This file supersedes the mid-wave handoff that previously occupied this path** (the one written
when the operator switched models mid-wave). That handoff is preserved verbatim at
`_inbox/2026-09-13_ops23_checkpoint_5_midwave_handoff.md` — read it for the pre-resume lane state.
This file is the state from the resume to the wave close.

The successor session resumed all four paused lanes (paused by a simultaneous HTTP 429, not their
own bugs), replaced one that had stalled, ran every deploy's lease, ran every probe itself, and
closed the wave. Wave close: `_inbox/2026-09-13_ops23-wave5_close.json`. Wave CP2:
`_inbox/2026-09-13_ops23-wave5_cp2.json`.

## Snapshot

- doc_repo HEAD at the final probe: `ea3a7fd2` (branch `seat/dispatch-planner`).
- Final wave-wide probe: `_inbox/2026-09-14_014200_ops23-wave5_final_probe.json` — **PASS 4 / FAIL 6 / UNMEASURED 6**.
- Leases: `_catalog/leases/` holds only `README.md` (every shift released).
- No commits to doc_repo by the planner; every artifact is under `_inbox/` in the planner worktree.

## Row verdicts (all closed-partial; no row reaches PASS)

| Row | Lane | Status | Serving revision (by field) | What blocks PASS |
|---|---|---|---|---|
| P-152 | p152-siblings | closed-partial | `hauska-retrieval-api-00088-kom`, `cortex-api-00792-fup` | 48021:33223 — panel serves GC setbacks, MCP refuses (`SETBACK_ROUTER_NOT_A_DISTRICT`); GC needs a ruled table or a panel-side refusal |
| P-167 | p167-strings | closed-partial | `smartsite-mcp-00117-wiy` | three-surface string identity needs the operator's MCP connector |
| P-179 | p179-gate | closed-partial | `hauska-engine-api-00221-paw` (gate re-verified intact) | no probe row by design; predicate is the live 401 violation read (verified) |
| P-180 | p180-hays-cells | closed-partial | `cortex-api-00794-bij` | P-175 FAIL 0/5 — the `recordPoint` leg (record store `cityLimits.queryPoint`) |
| P-155 | p155-refresh | closed-partial | `hauska-engine-api-00221-paw`, `smartsite-mcp-00119-naf` | row predicate needs the operator's MCP connector + Reports click |

## The one consequential correction this session

**p180-hays-cells wrote `status: "closed"` while deferring its own R-4 P-175 probe to the planner.**
The planner ran it: **FAIL 0/5**. The lane's own pre-registered falsifier fired. Row status superseded
to `closed-partial` in `_inbox/2026-09-14_p180-hays-cells_rowverdict_adversarial.json`; the lane's
body of work (PRs, run ids, cell diffs, Williamson hold) is accepted.

The Hays write itself is verified good and live: `factory-parcel-record-fill-7d8vb` ran
`--county=48209 --apply` (succeeded, 23:54:33Z, 2,440,659 cells / 116,420 nodes) and the panel shows
the corrected identity (`97658` → `629 STURGEON DR, SAN MARCOS`, district SF-6; structural rails
present→absent). **What the write did NOT move is the `recordPoint` rail**: the panel's `recordPoint`
is the record store's `cityLimits.queryPoint` (`hauska-map` `recordPointFromCityLimitsFact`,
`fact-sheet-resolver.ts:2393`), still the colliding bare-number parcel's point (~34.8 km off). The
map/GIS ring is already correct. This needs a new row.

## The next three

1. **Operator legs (unblocks P-155 and P-167).** The operator holds the Smart Site MCP connector
   (`get_smart_site`, `export_instrument`). P-155: call `export_instrument` kind=feasibility for
   `48021:34049` twice ~1 min apart (and once >15 min after a prior ready job), paste the two
   `/CreationDate` values + sha256 prefixes — they must differ. P-167: `get_smart_site` depth=node for
   `48453:113408` and `48453:474034`, confirm the envelope overlay `reasonDisplayText` is the
   humanized sentence, then re-probe.
2. **New row: crosswalk the record store's `cityLimits.queryPoint`** for Hays (48209) at least; then
   `surface-probe.mjs --rows P-175` should move off FAIL. This is what keeps P-175/P-180 open.
3. **Rule on the P-175 label leg for vacant lots** — 97651/97652/97653/97657 have no house number on
   the CAD roll, so `^<houseNumber> <street>` can never match even with a correct situs. Widen it or
   rule that only house-numbered lots can satisfy it.

Then: Williamson (48491) as its own row (held — the blocked-fips branch would erase ~282,565
currently-good cells); the 48021:33223 GC district-table decision; and the leave_behinds in the wave
close (canary hygiene, the engine-api missing CI deploy workflow, the stuck feasibility job rows).

## Errors log (this wave)

Full detail in `_inbox/2026-09-13_ops23-wave5_cp2.json` `errorsLog`:

- **E1 — seat TLS (recurring, 3 lanes re-discovered).** Node `fetch` on this Windows/AVG-TLS host
  fails TLS unless run as `node --use-system-ca` / `NODE_OPTIONS=--use-system-ca`; without it every
  probe leg reads `fetch failed` and the artifact is vacuous. Fold it into the dispatch template.
- **E2 — "merge = deploy" is false for every service.** `cortex-api` and `smartsite-mcp` need
  `workflow_dispatch` (`deploy-canary --no-traffic`, then `shift-traffic`); `hauska-engine-api` has no
  CI deploy workflow at all (P-155 hand-built the image and ran `gcloud run deploy`/`update-traffic`).
- **E3 — p180 closed while deferring its own predicate** (see above).
- **E4 — duplicate concurrent P-155 session (resolved).** The "duplicate" was the stalled
  predecessor p155 session, which resumed late and completed after the wave close. It reconciled
  `_inbox/2026-09-13_p155-refresh_close.json` in place (still valid, still `closed-partial`, still
  citing the successor's non-vacuous probe) and left a TLS-vacuous probe
  (`_inbox/2026-09-14_012832_surface_probe.json`, facets `http 0`) which is now **named in the wave
  close so it is not read as a result**; the valid one is
  `_inbox/2026-09-14_012807_surface_probe.json`. Both smartsite shifts landed on the identical #682
  image, so no customer-visible divergence. It also left a 0%-traffic `smartsite-mcp-00121-vef`
  canary. Hazard worth a guard: "one lane per row / one shift per service" is not enforceable
  against a session that cannot see the other session's lease file.
- **E5 — the wave-2 passive-wait stall recurred.** p155-refresh's predecessor read files at 18:40 and
  stopped; it had already merged #441 but never deployed or closed. Replaced under supervision.
- **E6 — `scripts/ops23-lane-status.mjs`** still has no ROWS entries for P-179/P-180/P-155.

## Instruments a successor must run with

```
cd P:/seat-worktrees/dispatch-planner/doc_repo
$env:NODE_OPTIONS="--use-system-ca"     # REQUIRED on this seat; without it the probe is vacuous
node scripts/surface-probe.mjs --rows P-152,P-155,P-167,P-175 \
  --observations _inbox/2026-09-14_ops23-wave5_combined_observations.json --allow-unmeasured
```

The combined observations file merges the p152-siblings MCP leg and the p167-strings three-surface/
vocab leg (disjoint per-parcel fields; `_vocab` carried). P-175 needs no observations.
