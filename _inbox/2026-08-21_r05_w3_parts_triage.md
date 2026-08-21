---
id: 2026-08-21_r05_w3_parts_triage
title: R-05 W3 triage of R-03 parts output
status: draft
date: 2026-08-21
owner: integration
plan_row: R-05
related: [_inbox/2026-08-21_r03-parts_close.json, _catalog/parts_inventory.json, scripts/build-parts-inventory.mjs]
---

# R-05 W3: triage of R-03's actual output

Snapshot: `P:/doc_repo` on `main` at `d254467788c795c6f8fa5a9256ad6a074859b615`. Seat is integration. R-03 compiled the inventory at `4b174d1` in `P:/tmp/r03-parts` with probe window `2026-08-21T01:06:41Z` to `2026-08-21T02:15:00Z`. This pass did not re-probe production stores and did not invent LIVE. UNKNOWN stays UNKNOWN.

R-03's close listed ten parts with `terminationCondition: NONE`, fourteen ZOMBIE parts, and five UNASSIGNED gaps in `_catalog/seat_register.json`. The inventory matches those counts. Inventory `owningSeat: UNASSIGNED` is six parts covering five named gaps because `plan-review` and `plan-review-app` share one unowned repo.

## How status and NONE were derived

`scripts/build-parts-inventory.mjs` is a hand-authored catalog, not a probe loop. Status strings were typed per part. The extraStores block at the bottom applied a formula: county_manifest, county_rail, code_atoms, and reasoning_atoms got `terminationCondition: "NONE"`; onboarding_ledger_event got `Archive events older than N years with named job (N unset — effectively NONE)`. `isNoTermination` then collected those ten names. LIVE elsewhere in the file required a probe timestamp in `evidenceOfStatus` by the file's own counting rule; extraStores LIVE rows (county_manifest, county_rail, onboarding_ledger_event) carry OPS-13 residency text and `lastObservedRunning: UNKNOWN`. That is internal inconsistency, not a reclassification.

`isNoTermination` matches empty, the literal `NONE`, `when we decide`, `N unset`, and `effectively NONE`. It does not match `superseded`. That is why the ten-name list is an undercount.

## "When superseded" is NONE with extra words

A termination condition is executable only when it names who runs it, what trigger starts it, and what fails if it is skipped. "When superseded" names none of those. It is a status flip waiting for a narrator.

Three parts in the inventory carry that shape and are **not** in R-03's NONE list:

- `cert-grade-block13`: "area cert superseded by txgio-frame instrument." Successor is named. No executor, no trigger, no failing check.
- `multi-shapefile-zip-sweep`: "Wired into ingest preflight OR superseded by county geographic extent instrument." The first clause has an executor. The OR lets a prose claim of supersession satisfy the whole string. The named successor is ABSENT per OPS-12.
- `L16B-pipelines-runner` (ZOMBIE): "254/254 counties OR L16B superseded close with lease release." A close artifact is a real object, but "superseded close" is still a label. The checkable half is lease release.

`factory_onboarding_runbook` evidence says `status=superseded` and is **not** this defect. Its termination is "all citations migrated to the factory_1/1.5/2 trio AND file archived," which names a move and a leftover. Keep that one as written.

`neondb.smart_file_*` purpose says "superseded by independent module." The termination is a DROP with `information_schema` zero and county-ledger still 200. That half is executable. G-58b owns it.

R-06 should fail an inventory row whose termination matches `/superseded/i` unless a named executor and a failing check sit in the same string. Filing that detector is cheaper than re-litigating each row.

## Correction of R-03's own close

The close said the ten NONE parts were "quarantined not deleted." Quarantine is the right move for leftover names and parallel stores. It is the wrong move for the canonical atom graph, the Smart Files Neon, the county dimension tables, and two markets products whose status is UNKNOWN. R-03 named the gap. It then applied one disposition to ten unlike things. This triage splits them.

Dispositions used below: **keep** the running part and write a real off-ramp; **assign owner** into `seat_register.json`; **file as R-06 build item** when the fix is a hook, CI job, or type; **quarantine** means move the name into a retired/pending list, never delete the store or the file.

Plan rows are only `R-03 remainder`, `R-06`, `OPS-16`, `OPS-17`, or `operator`.

---

## NONE (10)

Canonical and dimension stores stay. Markets UNKNOWN stays UNKNOWN. The leftover code-atom parallel store is the one quarantine. Onboarding's "N unset" string is the detector exhibit; the table itself stays.

`neondb.code_atoms` is IDLE in the inventory, not ZOMBIE. extraStores stamped `consumers: "NONE until utility rail writer"` because every IDLE extra store got that sentinel. That is not a consumer trace. I do not promote it to ZOMBIE on a sentinel. Quarantine the name as a parallel store whose canon successor is `hauska_mcp.atoms`. Do not DROP in this pass.

`neondb.reasoning_atoms` and `hauska_mcp.document_blobs` stay UNKNOWN. Size on disk is not a serve-path consumer.

| name | current status | recommended disposition | owner | plan_row | one-line reason |
| --- | --- | --- | --- | --- | --- |
| empressa-trading-cockpit | UNKNOWN | keep | markets | R-03 remainder | Markets already owns; write an executable off-ramp; do not invent LIVE; markets HTTP probe still owed. |
| hauska_mcp.atoms | LIVE | keep | property | R-03 remainder | Canonical served graph; termination is "named successor with divergence test and consumer count zero," not quarantine of 100M rows. |
| smart-files-neon | LIVE | keep | property | R-03 remainder | Live tenant-private DB; copy the smart-files service off-ramp (exclusive mounts, G-58b complete) onto the store row. |
| smart-markets | UNKNOWN | keep | markets | R-03 remainder | Same as cockpit: owned, unprobed, NONE; keep UNKNOWN; write the off-ramp later. |
| hauska_mcp.document_blobs | UNKNOWN | keep | property | R-03 remainder | Catalog enumeration only; row count and consumers untraced; UNKNOWN is the honest state. |
| neondb.county_manifest | LIVE | keep | property | R-03 remainder | 254-row dimension; off-ramp is Texas program retired or a named successor dimension with divergence test, not NONE. |
| neondb.county_rail | LIVE | keep | property | R-03 remainder | 14-rail declaration table; dies when COUNTY_RAIL_DECLARATION dies, which `countyRailRefreshCli` already mutates. |
| neondb.onboarding_ledger_event | LIVE | keep | property | R-06 | Store stays; "N unset — effectively NONE" is the detector exhibit; R-06 must fail that shape, then R-03 remainder sets N and names the archive job. |
| neondb.code_atoms | IDLE | quarantine | property | R-03 remainder | Parallel leftover (~53MB, canon points at hauska_mcp); extraStores consumer string is a sentinel; do not DROP until a consumer trace exists. |
| neondb.reasoning_atoms | UNKNOWN | keep | property | R-03 remainder | ~10MB sweep 2026-08-08; consumers unknown; do not round UNKNOWN to IDLE, DORMANT, or ZOMBIE. |

---

## ZOMBIE (14)

ZOMBIE here means a named part whose serve path, file, or process is gone or never consumed, while residue (rows, citations, tmp logs, or a successor that nothing reads) remains. Absence and starvation look identical from outside. For each row: the mechanism R-03 used, a second mechanism that would produce the same observation, and why the second was rejected. I did not probe production stores. Where the second mechanism is "LIVE on an unprobed path," rejection is that R-03's evidence is a write-path or git observation, not that I re-ran the serve path.

### Stores

**neondb.place_layer_snapshots (tier2 flood subset).** Mechanism: cortex-api `1113c649` (2026-08-19) retired the flood serve path; 608k tier2 flood rows remain; no flood consumer. This is blueprint V9 (retire without repoint). Second: IDLE, because non-flood tier2 facets are still served from the same table. Rejected for the flood subset: evidence names the retirement SHA and "NONE for flood." DORMANT would mean the serve path still exists and is unscheduled; the path was deleted. LIVE-unprobed (PE still reading the old facet) was not re-checked here and is not claimed. Quarantine the flood payload until the successor is on the serve path; do not delete SS-W11 evidence.

**hauska_mcp.atoms (flood-hazard-fact subset).** Mechanism: writer live, ~13.5M estimated rows, no serve-path consumer; adjudication harness only. Starved successor, not a dead writer. Second: IDLE, because `write-flood-hazard-fact-county` exists and is IDLE. Rejected for the store: the atoms are present and unread on L4, which is starvation of the reader, not an idle job. DORMANT would mean no trigger; the writer trigger exists. LIVE-unprobed (some PE path already reads flood-hazard-fact) would require a serve-path probe this pass forbade. Keep the store. Wire PE/cortex/brief. Do not quarantine the intended successor.

**neondb.txgio_address.** Mechanism: 1.69M rows over 6 counties; SS-W5 said nothing in production reads it. Second: DORMANT, data waiting for a situs read path that was never built. That second is close. ZOMBIE is still the better label because the termination itself is an OR between "wire situs" and "retire when cad-parcel-roll serves situs," which is how a leftover sits until someone narrates supersession. LIVE-unprobed rejected without a new serve-path read. Quarantine the name until OPS-16 rules wire-or-drop.

**neondb.smart_file_* (cortex-prod legacy).** Mechanism: G-56 prototype on the wrong database; MCP/LDT retargeted to smart-files Neon; seed count 0; G-58b DROP still OPEN. Second: DORMANT, because the DROP job exists as G-58b and is waiting on L26 quiet (starved trigger, empty tables). Rejected as a reason to un-ZOMBIE: zero rows with leftover schema after a named successor is the retired-not-dropped class. Absence of rows is not absence of the defect. Quarantine; OPS-17 G-58b drops.

### Missing CLIs and uncommitted scorers

**countyLedgerMaterializeCli** and **countyFloodScoreCli.** Mechanism: both present at deployed image `19da3b1b` (#425), absent from LDT HEAD `10069854` (`git cat-file` fatal 2026-08-21). Snapshot still served from the 2026-08-14 materialize. Second for materialize: SS-W7 HTTP recompute already replaced the CLI (LIVE-unprobed successor). Rejected: successor is marked partial, and this pass did not probe POST recompute. Second for flood scorer: IDLE because scoring is paused. Rejected: the file is gone, so there is no job to idle. Keep both names on the inventory; restore the file or finish the replacement under OPS-16. Do not quarantine a materializer the ledger still needs.

**countyRailScoreCli.** Mechanism: never shipped; A-020 plus grep empty on LDT/engine HEAD. Second: this is ABSENT, not ZOMBIE. R-03 stretched ZOMBIE to mean "named in docs, not in the repo." DORMANT and IDLE require a file. LIVE-unprobed is impossible for a missing scorer. Keep the ZOMBIE label as R-03's class, and treat the work as P-47 (OPS-16), not as a quarantine of a capability gap.

**B2_cp2_geometry_scorer_apply.mjs**, **score_cad_rails_fast.mjs**, **l16-score-mud.mjs.** Mechanism: never committed; they produced live `county_facet_coverage` rows (geometry 253/254, CAD rails, mud). Second: `countyGeometryScoreCli` (or another standing CLI) wrote those rows and the one-off names are false attribution. Rejected by A-020 / 65_t25: standing scorers do not cover those rails, and verify scripts match the one-off names by regex only. The rows are LIVE orphans. The scripts are absent. Quarantine the names. Rescore under OPS-16 P-47 (mud also P-05).

**wave4_reproject_orchestrator.mjs.** Mechanism: Factory 1.5 runbook F1-10 names a path that `git cat-file origin/main` cannot resolve. Second: the 57-county reproject already finished ad-hoc, so the orchestrator is a leftover citation (DORMANT doc, not a dead job). Possible, and the close itself says "orchestrator may have been ad-hoc." Quarantine the name; amend the runbook. That is OPS-16 factory-1.5 remainder, not a restore.

### Tmp runners

**L26-lease-heartbeat-detached.** Mechanism: `_STATE` claimed PID 22096 live; `Get-Process` empty; heartbeat log last line 2026-08-18T01:06:47Z. Second: IDLE, because `atoms-writer-lease.mjs` is tracked and IDLE. That second describes the standing script, not this detached process. DORMANT: lease still held in the database with no heartbeat (starved). LIVE-unprobed: the process ran on another machine. Rejected as a reason to un-ZOMBIE the detached job: the cited PID is dead on the box that owned `P:/tmp/l26_flood_drain_20260815/`. The probe is local-PID only. File OPS-16 to `release --holder=L26` or prove a foreign holder. Do not quarantine a lease that may still be held.

**L16B-pipelines-runner.** Mechanism: tmp serial runner, log mtime 2026-08-15T04:22:37Z, watch paused, hung at 48039 (19/254), `_STATE` IN_FLIGHT stale. Second: IDLE, because `write-rrc-pipeline-fact-county` on engine main is IDLE. That second is the standing writer. This tmp runner is dead. "L16B superseded close with lease release" is NONE with extra words. Quarantine the tmp name. Leave the standing writer IDLE under OPS-16.

**SS-W9-served-sweep.** Mechanism: overnight tmp audit, `served14_progress.json` mtime 2026-08-19T16:25:33-05:00, no node process. Second: DORMANT, same as `serving-sweep.mjs` (exists, no CI trigger). Difference: SS-W9 is a one-shot work root; `serving-sweep.mjs` is the standing instrument and is already DORMANT, not in this table. LIVE-unprobed rejected on no process plus mtime. Quarantine the tmp root. Do not resurrect SS-W9; feed P-43 through the standing sweep.

| name | current status | recommended disposition | owner | plan_row | one-line reason |
| --- | --- | --- | --- | --- | --- |
| neondb.place_layer_snapshots (tier2 flood subset) | ZOMBIE | quarantine | property | OPS-16 | Retired serve path, 608k flood rows remain; keep as SS-W11 evidence until flood-hazard-fact is on L4. |
| hauska_mcp.atoms (flood-hazard-fact subset) | ZOMBIE | keep | property | OPS-16 | Intended successor, starved reader not dead writer; wire PE/cortex/brief; do not quarantine the good store. |
| neondb.txgio_address | ZOMBIE | quarantine | property | OPS-16 | 6-county load, SS-W5 no production reader; wire situs or DROP with coverage proof. |
| neondb.smart_file_* (cortex-prod legacy) | ZOMBIE | quarantine | property | OPS-17 | Empty schema after retarget; G-58b DROP when L26 quiet; information_schema zero is the grade. |
| countyLedgerMaterializeCli | ZOMBIE | keep | property | OPS-16 | File gone from HEAD, snapshot still served; restore CLI or finish HTTP recompute with parity. |
| countyRailScoreCli | ZOMBIE | keep | property | OPS-16 | Never shipped (P-47); absence labelled ZOMBIE; do not quarantine a capability gap. |
| B2_cp2_geometry_scorer_apply.mjs | ZOMBIE | quarantine | property | OPS-16 | Never committed; produced orphan geometry rows; replace via standing scorer or delete-and-rescore. |
| wave4_reproject_orchestrator.mjs | ZOMBIE | quarantine | property | OPS-16 | Runbook names a missing path; amend F1-10; do not restore an ad-hoc orchestrator. |
| L26-lease-heartbeat-detached | ZOMBIE | keep | property | OPS-16 | Cited PID dead, lease may still be held; release `--holder=L26` or prove a foreign holder. |
| countyFloodScoreCli | ZOMBIE | keep | property | OPS-16 | Same LDT HEAD regression as materialize; restore or fold flood into P-47. |
| score_cad_rails_fast.mjs | ZOMBIE | quarantine | property | OPS-16 | Uncommitted A1 producer; rescored only via P-47. |
| l16-score-mud.mjs | ZOMBIE | quarantine | property | OPS-16 | Uncommitted L16 producer; P-05/P-47 standing scorer or explicit drop of mud rail. |
| L16B-pipelines-runner | ZOMBIE | quarantine | property | OPS-16 | Tmp hung runner; "superseded close" is NONE with extra words; standing pipeline writer stays IDLE. |
| SS-W9-served-sweep | ZOMBIE | quarantine | property | OPS-16 | Tmp overnight job; standing path is DORMANT `serving-sweep.mjs` under P-43. |

---

## UNASSIGNED (urgent)

`_catalog/seat_register.json` gives exclusive `repos[]` to property (legacy-design-tools, hauska-engine, hauska-map, smartcity-dashboards, smart-files) and markets (smart-markets, empressa-trading). systems and trading own no product repo. hauska-mcp-server, plan-review, icc-portal, and smartcity-os are live production surfaces with no exclusive worktree in that file. `mcp.hauska.dev-dns` is a DNS alias, not a git repo; the close bundled it as the fifth gap.

SEAT-01 was dormant because `.cursor/hooks/seat-gate.mjs` imported a missing path, threw `ERR_MODULE_NOT_FOUND`, and exited 0. Fixed at `8c386a9`, then narrowed at `5e9385a`. `evaluate` in `scripts/enforcement/seat-worktree-gate.mjs` refuses an unlisted worktree as `unregistered_worktree`. `ownerOfRepoPath` only hits `kind === 'seat-product'`. Consequence now that the gate fires:

- An agent in `P:/hauska-mcp-server` (or plan-review, icc-portal, smartcity-os) is refused. Harness writes stop.
- Native git, GUI, and `SEAT_GATE_OVERRIDE=1` still write. Shared checkout on `P:/<repo>` is the original collision class. Unowned plus override is how two seats share one index again.
- Leaving them unassigned is not a safety feature except accidentally for smartcity-os no-touch, and even there the bypasses remain.

Assign the four git repos to **property**. Property's authority is already "Property substrate and Empressa property/govtech surfaces." MCP is the Hauska gate consumed by engine, retrieval, dashboards, PE, plan-review, and icc-portal. Plan-review and icc-portal are OPS-17 Lane C/D housing (G-60). smartcity-os is the live Bastrop island; repo_intents is ABSOLUTE NO-TOUCH until a named cutover WDLL. Assigning property without a mechanical no-touch would let the owning seat write the island. Operator stamps `noTouch` (or equivalent) in the register; R-06 makes SEAT-01 refuse writes even from the owner.

Do not put `mcp.hauska.dev-dns` in `seats[].repos[]`. Owner is the operator (credentials, registrar). Status stays DORMANT (NXDOMAIN 2026-08-21T01:06:41Z). Its "termination" is actually a start condition (register the alias and prove HTTP 200). Direct `*.run.app` is already the de facto successor.

`plan-review-neon` is listed `owningSeat: property` because extraStores defaults property. The service and app are UNASSIGNED. That split is a compiler bug, not a topology ruling. Once plan-review is assigned, the store owner matches.

systems does not write product repos. markets does not own govtech or MCP. operator confirms the register edit; systems is the shared-canon writer for `seat_register.json` after that ruling. plan_row is **operator** because this is topology, not an OPS-16/17 product card and not an R-06 hook (the hook already fires; the input is empty).

| name | current status | recommended disposition | owner | plan_row | one-line reason |
| --- | --- | --- | --- | --- | --- |
| hauska-mcp-server | LIVE | assign owner | property | operator | Live gate on run.app; unlisted worktree now refuses harness writes and leaves native git as the collision path. |
| plan-review | LIVE | assign owner | property | operator | G-60 isolated housing, no register row; service and app are one repo; extraStores already pinned the Neon to property by accident. |
| plan-review-app | LIVE | assign owner | property | operator | Same unowned repo as plan-review; Dashboards mounts it (G-64); assign with the service, not as a second seat. |
| icc-portal | LIVE | assign owner | property | operator | Live ICC demo at icc-demo.vercel.app; OPS-17 product with no exclusive worktree. |
| smartcity-os | LIVE | assign owner | property | operator | Live Bastrop island; assign so SEAT-01 has an owner, plus noTouch so the owner cannot write until the named cutover WDLL. |
| mcp.hauska.dev-dns | DORMANT | assign owner | operator | operator | NXDOMAIN; not a git repo; registrar/DNS is operator; do not stuff it into `repos[]`. |

R-06 companion, not a substitute for the assignment: fail CI when `parts_inventory.json` has `kind` in `{service,app}` and `status: LIVE` and `owningSeat: UNASSIGNED`. Prove it by inserting a fake LIVE UNASSIGNED app and watching the job exit non-zero. Second R-06: `noTouch` on a register repo refuses writes from the owning seat. Prove it against a smartcity-os pathspec.

---

## R-06 build items this triage files (not a fourth population)

1. NONE detector must treat `/superseded/i` without a named executor as NONE. Violate with a fixture row whose termination is "when superseded by X."
2. LIVE service/app plus `owningSeat: UNASSIGNED` fails CI. Violate with a fixture part.
3. extraStores must not stamp `consumers: "NONE until utility rail writer"` on every IDLE store. That sentinel is how `neondb.code_atoms` got a fake consumer story.
4. Register `noTouch` (or equivalent) refuses owner writes. This is how smartcity-os no-touch survives a clone of the register.

R-03 remainder is writing real termination strings for the kept NONE stores and the markets UNKNOWN pair, after the detector exists so the next compile cannot emit NONE-with-extra-words.

## What this pass could not have found

Unread paths: live PE/cortex/brief flood serve path after `1113c649`; POST recompute for county-ledger; whether L26 lease is still held in the database; whether any production reader hits `document_blobs` or `reasoning_atoms`; markets HTTP for cockpit and smart-markets.

Unobservable by construction: DNS registrar state beyond NXDOMAIN; any writer on a machine other than the box R-03 `Get-Process`'d; consumers that exist only in deployed images not present on LDT HEAD.

Those are remaining work, not implied health.
