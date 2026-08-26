---
id: 2026-08-26_partitioned_lease_review_handoff
title: Handoff — county-partitioned atoms writer lease (proposal, not approved)
date: 2026-08-26
last_updated: 2026-08-26
status: active
plan_row: P-73
snapshot: P:/doc_repo main @ 9753b83 · integration seat
related:
  - 90_runbooks/AGENT_CONTRACT.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-25_texas_complete_master_board.md
  - _inbox/2026-08-25_texas_complete_wave_plan.md
  - _scratch/w5a-cad-owner-landuse.md
---

# Handoff: partitioned atoms writer lease

Filed: 2026-08-26
From: integration seat on `P:/doc_repo` `main` `9753b83` (Cursor session, not a planner seat)
To: review agent (second opinion) and operator (decide / do not implement)
Re: Should we partition the atoms bulk-writer lease by county so more than one `--apply` can run?

This is a proposal. No OPS-16 amendment. No WDLL approved. No engine DDL. Do not implement from this file. Do not take a second lease. Do not start a second `--apply`. W5-A holds the live global lease.

---

## Paste this to the review agent

You are a review agent. Second opinion only. Do not implement. Do not take the atoms lease. Do not start `--apply`. Do not rematerialize. Do not leftover. Do not write `_state/property`. Do not commit.

Read this file first: `P:/doc_repo/_inbox/2026-08-26_partitioned_lease_review_handoff.md`.

Then read the sources in section 6 in the order given. Open the canvases in section 5. They are outside git.

Return:

1. Verdict: support county-partitioned lease / support with changes / reject. One sentence why.
2. The strongest mechanism that would make this proposal wrong, and why you rejected or accepted it.
3. What you would cut from v1. What you would add before any DDL.
4. Whether AGENT_CONTRACT §3 can be amended this way without breaking A-012's fail-closed intent.
5. A recommended next operator move: file WDLL now, wait until W5-A releases, or refuse and keep one global slot.

State your snapshot (repo, branch, commit, seat). If you cannot complete seat identification, say so and stop.

---

## 1. Conversation summary

Texas-complete leftover farm is done (33/33 KEEP). The live write is W5-A: Factory 1 cad / owner / landuse atoms `--apply` from an isolated engine worktree. Kaufman `48257` family is written. Bexar `48029` cad apply has been in flight since 2026-08-26T04:18:30Z. Store already holds 703257 Bexar cad atoms. Close JSON is not flushed. One global DB lease (`lock_id = 1`, holder `W5A`) is the only legal writer.

The operator could not see the write in Cursor because the overnight was started with `Start-Process -WindowStyle Hidden`. A read-only monitor pane was attached later. That is a visibility defect, not a missing write.

The operator then asked whether the singular write slot can be bypassed. Texas still has a large Factory 1 remainder. National is in view but CTX / national is HELD. The integration seat answered: do not start a second `--apply` against today's lock. The throughput path is a named card that partitions the lease to match P-55 key space (`{fips}:{integer}`). Two counties do not share atom DIDs. The lease is still one global row.

The operator asked what it would take to set that up. The seat described v1 as county-only leases, fail-closed take / heartbeat / scope check inside `writePropertyAtomsBatch`, a divergence test, dual-accept cutover after W5-A releases, concurrency cap of 2 then 4. Rail-level partition (cad versus flood on the same county) was deferred because those rails share parcel-nodes and `applies-to` edges.

The operator asked for this handoff so a review agent can give a second opinion before anyone files a WDLL or touches DDL.

## 2. Decisions reached

No operator decision on the lease partition. The following are standing or already ruled in this thread. They are not the proposal.

1. **Do not start a second atoms `--apply` on the current global lease.** Reasoning: AGENT_CONTRACT §3 and A-012. A second writer tonight is the leftover-plus-apply / last-wins class. Owner: every seat. Reversal: only after a partitioned lease is live and the global row is retired by refuse, not by documentation.

2. **W5-A stays the custodian until it releases.** Reasoning: Bexar cad close JSON has not landed. Stealing `lock_id = 1` to prove a new table is a defect. Owner: integration overnight. Reversal: operator names a kill.

3. **Manifest cells stay 667/3556 until W6 `--live` GET.** Reasoning: atoms in the store are not a cell. Rematerialize is refused. Owner: W6 when named. Reversal: none from this proposal.

4. **Hidden start was wrong for operator monitor.** Reasoning: the operator's evidence is the Cursor terminal. Next overnight runs in a Cursor shell. Owner: integration. Reversal: none.

5. **National apply is not in scope.** Reasoning: CTX / national HELD until Bastrop QA-done plus operator go (`_STATE.md` standing decisions). Owner: operator. Reversal: standing decision lift.

## 3. The proposal (what, why, v1 shape)

### What

Amend the atoms bulk-writer lease from one row per database to one live row per `(database, county_fips)`, plus one `GLOBAL` scope for writers that cannot name a county.

Two `--apply` processes become legal only when their lease scopes are disjoint. A batch that contains a DID whose FIPS is not the holder's county refuses before `INSERT INTO atoms`. Kill-on-rogue becomes: no live row, expired row, or scope mismatch.

### Why

The slot exists to stop two writers from last-wins on the same keys. It is not a throughput goal. Leftover `cad_property` already parallelizes because it is slot-free. W5-A is the slotted path. Texas remaining Factory 1 work is mostly that path. One 703k-county apply already occupies the only slot for many hours. Serializing 200-plus remaining cad/owner/landuse counties at that rate is the Texas bottleneck. National is a later question and is still HELD.

P-55 already partitions the key space by county. The lock does not. That mismatch is the proposal: make the lock match the keys.

### Why county, not rail, for v1

Cad, owner, and landuse on the same county write different `entityType`s but share parcel-node identity and `applies-to` edges. Parallel those on one FIPS and you can race the graph even if atom DIDs differ by type. County partition lets Collin cad and Bexar cad run together. Same-county rails stay serial until a later card proves they do not share write rows.

### Why not "just start four writers"

Today `takeWriterLease` upserts `lock_id = 1`. A second take either steals on expiry / same holder or throws `ATOMS_WRITER_LEASE_HELD_BY_OTHER`. `writePropertyAtomsBatch` only heartbeats that row. It does not inspect `entityId`. Four processes on one lock is four processes on one lock.

### What the proposal is not

Not a second writer tonight. Not leftover or CAMA. Not P-09 footprint apply (engine main still bbox; also takes the heavy-scan slot). Not COVER / Harris PBF. Not W5-B flood or W5-C mud from this card. Not a CTX / national lift. Not raising the memory pin. Not rematerialize. Not changing Manifest DATA by narration.

### Proposed v1 build order (only after operator go plus approved WDLL)

1. OPS-16 amendment to A-012 ruling 0, and AGENT_CONTRACT §3 hash bump: one live lease per `(database, county_fips)` or `GLOBAL`.
2. Additive migration on `hauska_mcp`. Do not drop `lock_id = 1` while W5-A holds it. New PK `(scope_kind, scope_id)` with `county` + 5-digit FIPS or `global` + `GLOBAL`.
3. `assertAndHeartbeatWriterLease` receives the batch, parses FIPS from every `entityId` / `atomDid` via the existing P-55 helper, refuses mixed-county batches and out-of-scope FIPS, heartbeats that scope row. Control lives in the batch path, not only the CLI.
4. CLI: `take --holder=W5A --county=48029`. Every `write-*-county.mjs` takes its county and refuses `--apply` without it.
5. Dual-accept for one deploy: live `lock_id = 1` **or** matching county row. Cutover after W5-A releases. Retirement is a refuse on the old single-row take plus a CI test that it cannot satisfy a county write.
6. Supervisor fans at most 2 counties, then 4 after connection-pool measurement. One Cursor-visible terminal per apply. One watch per holder. First proof: two small declared-vintage counties, not Bexar plus Collin.
7. Heavy PostGIS scan stays one at a time (AGENT_CONTRACT §4). Unchanged.

### Three-question gate (enforcement.mdc)

1. What executes this? `writePropertyAtomsBatch` on every slice, plus CLI take. Not a person.
2. What triggers it? Each batch upsert.
3. What fails when violated, and is it running in production? Today: `ATOMS_WRITER_LEASE_NOT_HELD` / `HELD_BY_OTHER` on the global row. After the card: those plus `ATOMS_WRITER_LEASE_SCOPE_MISMATCH`, with a CI fixture that inserts the mismatch and asserts zero `INSERT INTO atoms`.
4. What bypasses it? Any write to `atoms` that skips that function: raw SQL, a new helper, `writePropertyAtomsBatchLegacy` if it stays reachable. The WDLL must enumerate call sites.

### Required tests (verify by violating)

- No holder env: refuse, zero insert. Already exists.
- Holder without live row: refuse, zero insert. Already exists.
- Lease `48021`, atom `48257:1`: refuse, zero insert. New.
- Two leases `48021` and `48257`, two atoms, both insert, zero DID overlap. Divergence test. New.
- Mixed-county batch under one lease: refuse. New.
- Old `lock_id = 1` take after retirement: refuse. New.

## 4. Open questions for the review agent

1. **Is county the right first partition?** Why open: rail partition would unlock cad plus flood on one machine, which is the other Texas remainder (92 flood not-yet, 45 mud). Routing: review agent. Next: say whether same-county graph race is real in `writeAtomLinks` / parcel-node upsert, or overstated.

2. **Does `GLOBAL` become a hatch?** Why open: any writer that cannot or will not name a FIPS keeps the old single slot. A sloppy CLI default to `GLOBAL` restores one lock. Routing: review agent. Next: name the writers that truly cannot be county-scoped (ICC ingest, document blobs, any statewide sweep).

3. **Is dual-accept during cutover a silent bypass?** Why open: if both `lock_id = 1` and a county row satisfy `writePropertyAtomsBatch`, a forgotten global holder plus a county holder is two writers again. Routing: review agent. Next: propose a cutover that cannot admit that pair, or accept a one-deploy window with an explicit detector.

4. **What concurrency cap is honest on `hauska_mcp`?** Why open: Neon / pooler / `max` connections were not measured this session. Routing: property seat after a named card. Next: do not write "8 lanes" into a WDLL without a measurement.

5. **Does this belong on OPS-16 as a new P-row or as an A-012 amendment only?** Why open: no dispatch without a plan row. Integration did not allocate a row. Routing: planner / operator. Next: do not compile a dispatch until a row exists.

6. **Should the first parallel proof wait until the overnight queue drains?** Why open: W5-A is live. Implementation during a held global lease is how people steal the slot to "test." Routing: operator. Integration recommendation: wait for release, then two small counties.

## 5. Canvases (operator boards, outside git)

Open these. They are the working boards. SNAPSHOT restamped 2026-08-26T11:13Z for W5-A in flight. Manifest DATA cells were **not** changed (still last GET 667/3556).

| Board | Path | What it is for this review |
| --- | --- | --- |
| Master | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\texas-complete-master.canvas.tsx` | Checkpoint. W5-CAD is `in-flight`. W5-FLOOD / W5-MUD / W6-GET still named-only. Honest ceiling 1527 if W5 only. |
| Write-path | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-facts-write-path.canvas.tsx` | Ingest order. Atoms slot shown as W5A. Wave table: W5 in flight, W6 after each family. |
| Manifest | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\county-manifest.canvas.tsx` | Rail freshness. GET still 667/3556 on purpose. Do not treat store writes as cell moves. |
| Factory health | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-health.canvas.tsx` | Which write may move a cell. Factory 1 `--apply` is the live write. Factory 2 is out. |
| Deficit | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx` | Hop/field gaps. M05 / M10 / M11 are why W5 exists. P-80 Travis join is a different card. |
| Recalibration | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx` | PE / design leftover. Lease partition is not this board. Do not start atoms `--apply` from here. |

Tracked companion (in git): `_inbox/2026-08-25_texas_complete_master_board.md`.

## 6. Where to look (read order)

Read in this order. Do not re-derive the lease from memory.

### Law and plan

1. `90_runbooks/AGENT_CONTRACT.md` section 3 (write-slot + lease) and section 4 (one heavy scan).
2. `90_runbooks/DEV_PROCESS.md` (instruments, paired controls, clone-surviving guards).
3. `ENFORCEMENT.md` (fail closed, three-question gate, verify by violating, call-site enumeration, retirement by decline).
4. `90_operations/OPS-16_texas_market_plan_of_record.md` row **A-012** ruling 0 (DB-enforced writer lease approved).
5. `_state/shared/STANDING_DECISIONS.md` and `_STATE.md` header: CTX / national HELD; deploys planner-owned; no privileged data.

### Factory and Texas-complete context

6. `_inbox/2026-08-25_factory_operating_instructions.md` (P-55 grammar, one `--apply`, what is `ready:false`).
7. `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` hard constraints and wave table (atoms slot vs leftover slot-free).
8. `_inbox/2026-08-24_parcel_facts_write_path_WDLL.md` (acceptance items any new write card must cite).
9. `_inbox/2026-08-25_texas_complete_wave_plan.md`.
10. `_inbox/2026-08-25_texas_complete_master_board.md` (live now + wave table).
11. `_inbox/2026-08-25_w5a_overnight_queue.md` and `P:/tmp/w5a_48257_20260825/queue.json` (what is actually queued; refuse set).
12. `_scratch/w5a-cad-owner-landuse.md` (live PIDs, hidden-start lesson).

### The live lock (engine worktree, property-owned code)

Isolated tree used by W5-A (do not commit here; do not switch it):
`P:/hauska-engine-worktrees/w5a-cad-owner-landuse` at `cfa18bc`.

13. `packages/storage/migrations/009_atoms_bulk_writer_lease.sql` (single-row table, `lock_id = 1`).
14. `packages/storage/src/atoms-writer-lease.ts` (take / heartbeat / release; no county field).
15. `packages/storage/src/pg-storage.ts` `writePropertyAtomsBatch` (heartbeat then upsert; `assertCanonicalParcelEntityId` already runs per instance).
16. `packages/storage/src/__tests__/atoms-writer-lease.test.ts` (current fail-closed fixtures).
17. `packages/storage/scripts/atoms-writer-lease.mjs` (CLI).
18. `packages/atoms/src/parcel-write-identity.ts` (P-55; why FIPS is on every DID).

County `--apply` call sites that all go through `writePropertyAtomsBatch` (enumerate, do not assume this list is complete):

- `packages/engine-core/scripts/write-cad-parcel-roll-county.mjs`
- `packages/engine-core/scripts/write-owner-fact-county.mjs`
- `packages/engine-core/scripts/write-land-use-fact-county.mjs`
- `packages/engine-core/scripts/write-flood-hazard-fact-county.mjs`
- `packages/engine-core/scripts/write-special-district-fact-county.mjs`
- `packages/engine-core/scripts/write-parcel-node-county.mjs`
- `packages/engine-core/scripts/write-building-footprint-county.mjs`
- `packages/engine-core/scripts/write-well-fact-county.mjs`
- `packages/engine-core/scripts/write-rrc-pipeline-fact-county.mjs`
- `packages/engine-core/scripts/write-rail-corridor-fact-county.mjs`
- `packages/engine-core/scripts/write-utility-easement-county.mjs`
- `packages/engine-core/scripts/bake-property-atom-county.mjs`

Also read `writePropertyAtomsBatchLegacy` in `packages/storage/src/property-atom-batch-write.ts` and say whether it is a bypass.

### Store fact

19. `_inbox/2026-08-20_store_audit_atom_graph.md` (table `atoms_bulk_writer_lease` lives on `hauska_mcp`).

### Live overnight (do not kill)

20. Cursor terminal titled **Visible W5-A Cursor terminal monitor** (read-only).
21. `P:/tmp/w5a_48257_20260825/overnight.log`
22. `P:/tmp/w5a_48257_20260825/overnight.mjs` (`windowsHide: true`, `spawnSync`, log idle until child exit).
23. Watch registry: `_catalog/watch_registry/w5a-lease.json`, `w5a-apply.json`, `w5a-overnight.json`.

## 7. Live snapshot the reviewer must not invent

Integration seat. `P:/doc_repo` `main` `9753b83`. Not a planner seat.

| Item | Value | Instrument |
| --- | --- | --- |
| Lease holder | W5A | overnight queue + heartbeat PID 21624 |
| Engine tree | `P:/hauska-engine-worktrees/w5a-cad-owner-landuse` `cfa18bc` | queue.json |
| Kaufman 48257 | cad/owner/landuse done 93291 | overnight.log `family.done` 04:15:31Z; apply JSONs in tmp |
| Bexar 48029 cad dry | 703257 built, hold false | `48029_cad_dry.json` |
| Bexar 48029 cad apply | started 04:18:30Z; JSON absent; writer PID 41260 ~1.9 GB | overnight.log + monitor + store count earlier this session 703257 |
| Next after Bexar family | Collin 48085, Comal 48091, Denton 48121, Guadalupe 48187 | queue.json |
| Refuse | Dallas, Tarrant, Travis HOLD, Hays HOLD, Williamson, Bastrop, Caldwell | queue.json |
| Manifest GET | 667/3556, computedAt 2026-08-25T23:40:18.231Z, rematerialized false | `_inbox/2026-08-25_family_canvas_pin.json` |
| Memory pin | 49 / 49 (parent applied, uncommitted) | `.github/memory-backlog-pin.json` |
| P-80 | carded, not implemented; 280238 cannot-bind on prop_id | `_inbox/2026-08-25_p80_travis_join_WDLL.md` |

If the monitor shows the writer dead and `48029_cad_apply.json` present, believe the files, not this paragraph.

## 8. Artifacts produced this thread (uncommitted unless noted)

| Artifact | Purpose |
| --- | --- |
| This file | Review handoff |
| `_inbox/2026-08-25_texas_complete_master_board.md` | Companion restamped for W5-A live |
| `_scratch/w5a-cad-owner-landuse.md` | Tier 2 live PIDs and lessons |
| Six canvases under `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\` | Operator boards; outside git |
| `P:/tmp/w5a_48257_20260825/cursor_monitor.ps1` | Read-only Cursor evidence |
| W8 pin 56→49, routing pin, W5-A inbox JSON | Separate; do not sweep into a lease commit |

No WDLL for the partitioned lease exists. Do not treat this handoff as one.

## 9. Stakeholder updates

- **Operator (Nick):** decide after the review: file WDLL, wait for W5-A release, or refuse. Do not ask property to start DDL from this prose.
- **Property seat:** owns `hauska-engine`. If the card is named, they implement. They do not take the live W5A lease to experiment.
- **Planner:** if go, allocate an OPS-16 row (amendment to A-012 and/or a new P-row). Compile dispatch via `node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row <row>`. No hand-assembled dispatch.
- **Sylvia / customers / PE:** none. This is not a surface change.

## 10. Context the next session must inherit

- One atoms `--apply` is in flight. Slot is not free.
- Proposal is county-partitioned lease. Not approved.
- Reviewer reads sources in section 6 and canvases in section 5, then answers the paste block.
- Integration recommendation (not a ruling): support the card; wait for W5-A to release; file WDLL before any migration; first proof two small counties; keep same-county rails serial; keep §4 heavy-scan serialization; do not lift CTX / national.

## 11. Integration recommendation (so the reviewer can disagree with a stated view)

Support county-partitioned leases as the Texas scale path. Reject a second writer on the current table. Reject rail partition in v1 until `writeAtomLinks` / parcel-node races are tested. Reject implementing during the live Bexar apply. Reject treating Manifest 667/3556 as stale-wrong because atoms moved; it is stale-honest until W6.

The alternative that produces the same observation ("we need more throughput") and is rejected: raise batch size and buy a bigger machine. That shortens one county. It does not let Collin start while Bexar holds the only lock.

leave_behind: this proposal unapproved; W5-A still live; no engine DDL.
