# Audit programme handover

For the incoming master planner. Goal this folds into: SMARTSITE TO MARKET WITH TEXAS COMPLETE.
The audit was instrumental to that, not terminal.

Written 2026-08-20 ~21:05 UTC. Seat: Cursor Grok planner in `P:/doc_repo` (integration checkout), not `P:/seat-worktrees/property/doc_repo`. No git add, commit, push, or PR from this pass. No product-repo edits. No writes into `P:\doc_repo`.

---

## 0. INTERRUPTION RECOVERY (this message)

This handover request stopped any running sub-agents. At the moment it arrived, **no MP workers were in flight**. A1 through A4, B5 through B7, C10, and C12 had already returned. The earlier interrupt (B5 completion notification, ~19:50Z) is already captured in `_inbox/2026-08-20_mp_interrupt_recovery.md` (untracked in doc_repo).

Disposition of the MP fan (re-triage reason: this instruction wraps the programme and forbids product-repo edits; it does not resume the fan):

| worker | last worktree | captured this turn | disposition |
| --- | --- | --- | --- |
| A1 | `P:/tmp/mp-a1-accesspolicy` | `git status -sb`: branch `fix/w30-accesspolicy-no-default` at `2c3c52c`, tracking origin, **?? RETURN.md only**. Product diff is committed and pushed. | **recovered, not resumed.** PR #353 OPEN. CI conclusion is **not** `"success"`. |
| A2 | `P:/tmp/mp-a2-rename-control` | branch `ci/required-check-rename-guard` at `0f183d5`, **?? RETURN.md only**. | **recovered, not resumed.** PR #354 OPEN. Job `typecheck + test` conclusion `"SUCCESS"`; job `required check names` conclusion `"FAILURE"`. |
| A3 | `P:/tmp/mp-a3-s22-card` | branch `fix/s22-geometry-denominator` at `100b9c26`, **?? RETURN.md only**. | **recovered, not resumed.** PR #445 OPEN. Typecheck `"FAILURE"`. |
| A4 | `P:/tmp/mp-a4-landuse-orphan` | branch `fix/landuse-facet-key` at `1c1f5bf4`, **?? RETURN.md only**. | **recovered, not resumed.** PR #446 OPEN. Typecheck `"FAILURE"`. SQL unapplied. |
| B5/B6/B7 | `P:/tmp/mp-b-flood-chain` | branch `fix/flood-geo-failclosed` at `523abba`, tracking origin. Untracked: `RETURN.md`, `RETURN-B6.md`, `RETURN-B7.md`, `packages/engine-core/scripts/_b7-diff-tmp.mjs`. Product diff is committed and pushed. | **recovered, not resumed.** PR #355 OPEN. Job `typecheck + test` conclusion `"SUCCESS"`. `--apply` never run. 229 dry-run **not re-run** after first-write-wins (`523abba`). |
| C10 | no product worktree (read-only) | return lives only at `P:/tmp/mp-c10-return.md`. **Not in doc_repo.** | **recovered, not resumed.** Read-only complete. The return is a tmp file, same defect class as an unfiled measurement. |
| C12 | `P:/tmp/mp-c12-engine-ro` (detached read-only) | HEAD `d3f37949003fae5a99a82b62956352b7dcaa1022`. Original list extract `P:/tmp/mp-c12-original-list.md`. | **recovered, not resumed.** Read-only complete. |

Nothing owned by those workers was moved to deferred by the stop. Remaining items (CI-red PRs, unapplied SQL, stamp `--apply`, 229 re-dry-run, filing C10 into the estate) stay owned. They are not worker diffs that need a supervised code resume. They are planner/operator gates.

Limbo PRs: instruction was finish through CI conclusion STRING `"success"` or mark draft. **This pass is forbidden from git writes**, so nothing was converted to draft. States as of `gh pr view` this turn:

| PR | conclusion STRING `"success"`? | state |
| --- | --- | --- |
| hauska-engine #353 | **NO.** `typecheck + test` = `"FAILURE"` (TS2339 `atomDid` on `StoredAtomInstance` at `src/index.ts:153-154`) | OPEN, not draft |
| hauska-engine #354 | **NO.** `typecheck + test` = `"SUCCESS"`; `required check names` = `"FAILURE"` (`api_unreadable` HTTP 403, `Resource not accessible by integration`). Fixture `--expect-failure` did fire (`empty_required_contexts`). The live-API step cannot succeed on GITHUB_TOKEN. | OPEN, not draft |
| hauska-engine #355 | **partial.** The one reported check `typecheck + test` = `"SUCCESS"`. No second check-run on this PR. | OPEN, not draft. Closest to mergeable. Still not merged. |
| ldt #445 | **NO.** Typecheck `"FAILURE"` (`engine.ts:188-189` property on type `never`) | OPEN, not draft |
| ldt #446 | **NO.** Typecheck `"FAILURE"` (`joinIntegrityGate.test.ts:368,387` mock SQL typing) | OPEN, not draft |

---

## SNAPSHOT (live `git rev-parse` / `gh pr view` this turn)

Command family: `git -C <path> rev-parse HEAD`, `git -C <path> rev-parse --abbrev-ref HEAD`, `git -C <path> rev-parse origin/main`, `gh pr view N --json ...`.

### Repositories this programme touched (product edits or authoritative reads)

| repo | path used | branch | commit SHA | notes |
| --- | --- | --- | --- | --- |
| doc_repo | `P:/doc_repo` | `main` | `c2315137117d4dcab2d46d3682ab5e8c5134c2ee` | Integration checkout. Dirty with untracked files from this programme (listed in §4). **Not committed.** |
| hauska-engine origin/main | (remote, via worktrees) | `main` | `d3f37949003fae5a99a82b62956352b7dcaa1022` | Base of A1/A2/B. Unchanged. |
| hauska-engine A1 | `P:/tmp/mp-a1-accesspolicy` | `fix/w30-accesspolicy-no-default` | `2c3c52cdb99c3aa470e7abbf68ec03fd94001bee` | Pushed. PR #353. |
| hauska-engine A2 | `P:/tmp/mp-a2-rename-control` | `ci/required-check-rename-guard` | `0f183d54bb93b9f2d9478817a1b9086c6ffbbd69` | Pushed. PR #354. |
| hauska-engine B | `P:/tmp/mp-b-flood-chain` | `fix/flood-geo-failclosed` | `523abbab597594a71f47bf117bbb4293543af949` | Pushed. PR #355. Parent of identity commit is `3b221d0444affd6b31497fe4f95172b21ac15a65`. |
| hauska-engine C12 read | `P:/tmp/mp-c12-engine-ro` | detached | `d3f37949003fae5a99a82b62956352b7dcaa1022` | Read-only worktree. |
| legacy-design-tools origin/main | via A3/A4 worktrees | `main` | `1a55566b057f8db4b888d007009c7fcaf84031d7` | Base of A3/A4. |
| legacy-design-tools A3 | `P:/tmp/mp-a3-s22-card` | `fix/s22-geometry-denominator` | `100b9c26b83d25b5f88556ee77b9f12a77ba306d` | Pushed. PR #445. |
| legacy-design-tools A4 | `P:/tmp/mp-a4-landuse-orphan` | `fix/landuse-facet-key` | `1c1f5bf4484d597400573ff6f547f9e207882700` | Pushed. PR #446. |
| hauska-map origin/main | `git -C P:/hauska-map rev-parse origin/main` | `main` | `204789f81e46fb4fe4754e98bc11d52e703abc09` | **Read, never edited by this fan.** C10 also read it from `P:/tmp/ss-verify` (CLAIM: that path was not re-checked this turn). |

### Trees obtained this turn but NOT used for product work, and NOT re-read as source of truth since last session read

| path | branch | SHA | dirtiness | re-checked? |
| --- | --- | --- | --- | --- |
| `P:/hauska-engine` | detached HEAD | `8d8e8803550f6f7fdaae42c59a25c4a2d9acc71c` | other-seat tree; dispatch said do not use | SHA and status only. **Source not re-read.** |
| `P:/legacy-design-tools` | `feat/s1-instrument-hardening` | `10069854f5aa840cc94e6eadbd625c61d3e48010` | other-seat; dispatch forbade working here | SHA and branch only. **Source not re-read.** |
| `P:/hauska-map` working tree | `fix/p35-vercel-token-preflight` | `d3510a6fbfa883907897d66b942579da132b8358` | `M .github/workflows/property-explorer-sync-retrieval-key.yml` | **Not this programme.** Do not treat local HEAD as origin/main. origin/main SHA above **was** re-checked. Working-tree diff **not** reviewed. |
| `P:/seat-worktrees/property/hauska-engine` | `seat/property` | `8d8e8803550f6f7fdaae42c59a25c4a2d9acc71c` | SHA only | **Not re-read.** |
| `P:/seat-worktrees/property/legacy-design-tools` | `seat/property` | `10069854f5aa840cc94e6eadbd625c61d3e48010` | SHA only | **Not re-read.** |
| smart-markets, empressa-trading, hauska-mcp-server, smartcity-dashboards | n/a | n/a | n/a | **NOT re-checked this turn.** Markets T-25/T-26 SHAs below are from files, marked CLAIM until `git rev-parse`. |

DB (not re-queried this handover turn; last planner SELECT was earlier today): cortex-prod `fancy-fire-06136146`, host `ep-lucky-truth-apodo8hr`, user `neondb_owner`. `atoms` / `document_ingest_atoms` on **hauska_mcp**. `txgio_parcel` / `county_facet_coverage` / `place_layer_snapshots` on **neondb**. Wrong database returns zero or `relation does not exist` and reads as a stronger absence than truth. Source: `_inbox/2026-08-20_db_probe_five_answers.md`.

---

## 1. ORIGIN — the problem that started this

This chat did **not** begin with Nick narrating two applications. It began as a compiled dispatch titled `MASTER PLANNING AGENT — PROPERTY SUBSTRATE. THREE GROUPS.` (transcript first user message, 2026-08-20 ~19:36Z). The two-application origin is therefore **reconstructed**, not witnessed in this seat.

**CLAIM (would settle it):** Nick's original phrasing in an earlier session or a compiled OPS-16 dispatch that this seat did not open. Search of `_sessions/` and this transcript for "two applications" / "friction dealing with data" returned nothing. **DO NOT KNOW** the names Nick used on the day he asked.

What this seat understood, in its own words:

Nick was using **the same physical-world facts** (parcels, flood, land use, coverage) through **two product surfaces that do not share one store or one writer**, and the numbers did not agree. He asked for current-state so ingestion could be built or refined rather than guessed.

**Which two applications (as this programme actually touched them):**

1. **Property Explorer** (and the cortex-api / rail-scoring / coverage-ledger path that feeds it and Command Center). Repo: `legacy-design-tools`. Stores on **neondb**: `county_facet_coverage` (rail scores), `place_layer_snapshots` (tier2 bake, including flood facets), `txgio_parcel` (parcel rings), plus CAD tables. Serving: `cortex-api` Cloud Run. Live QA surface also includes `https://smartsite.cloud` (hauska-map / Vercel) which **reads** PE-shaped and bake-shaped data. hauska-map was **not edited**.

2. **Hauska Engine catalog / atom serving.** Repo: `hauska-engine` (writers + `packages/retrieval`). Store: **hauska_mcp.atoms** (`entity_type` includes `flood-hazard-fact`, `parcel-node`, land-use facts). Served through Hauska MCP / retrieval, not through `county_facet_coverage`.

Those are two applications in the product sense (PE / SmartSite customer UI versus Hauska atom catalog) **and** two databases. The friction is not one extra API. It is **two writers, similar names, different quantities, and a store one path can read that the other cannot**.

What specifically was in friction (verified this programme, not guessed):

- Duplicate-looking facet keys that are **not** the same measurement: `land-use` (19 counties) vs `landuse` (254) vs writer key `landuse-cad-join` (0 rows). Live `neondb` SELECT this session. 15 of 19 overlapping FIPS disagree on pct. Overlay forbidden. Source: `_scratch/property_master_plan.md` GROUND-TRUTH and `_inbox/2026-08-20_a4_landuse_orphaning.md` (untracked).
- Two flood stores on two databases: bake `place_layer_snapshots` `adapter_key='node-facets:tier2'` vs atoms `entity_type='flood-hazard-fact'`. Joinable on parcel id. 37,331 disagreements across 10 counties; **36,723 are zone-versus-X**, not AO-versus-AE (129). Source: `_inbox/2026-08-20_db_probe_five_answers.md` Q5; C10 at `P:/tmp/mp-c10-return.md`.
- Wrong-database zeros. Querying `atoms` on neondb raises `relation "atoms" does not exist`. That is a stronger false absence than an empty table.
- Serving default: missing `accessPolicy` becomes `"public-free"` on property and road chains (W-30).

What ingestion refinement this seat was heading toward **before** the MP fan expanded: fail-closed flood geo (W-5/W-3/W-4), store-gated sample-point containment, a Bastrop-gated corpus stamp, honest rail denominators (S-22), and stopping the land-use key orphaning. That is a **honesty and apply-gate** refinement, not a new statewide ingest.

**Is that still the right target?** Partly. The audit **changed the fix**, it did not cancel it.

- Keep fail-closed flood **write** and store-gated containment. Those are still the right code.
- Do **not** treat the bake as parcel flood truth, and do **not** "reconcile AO vs AE". The mass defect is tile-centre sampling. Source: `P:/tmp/mp-c10-return.md`.
- Do **not** overlay `land-use` onto `landuse`. They measure different things (CAD join vs atom-count). Source: planner SELECT, A4.
- Do **not** treat SS-W17's 229 as cadastral ground truth. It licenses a first-key-wins convention. Source: untracked `_decisions/2026-08-20_flood_stamp_229_licenses_ssw17_convention.md`.
- Stamp `--apply` is **not** the Texas-complete coverage job. Coverage already has flood atoms. Stamp apply is an honesty backfill for sample points outside the ring.

---

## 2. WHAT THE AUDIT PROGRAMME ACTUALLY IS

There are **two programmes that share the label T-25**. Collapsing them is how a reader will get the next 36 hours wrong.

### 2a. Property substrate (this seat)

**In:** checks that EXIST on the property write, resolution, and scoring paths. Filed as `65_t25_admissibility_enumeration.md`. Then a fix/verify fan (A1-A4, B5-B7, C10, C12) off the highest-value rows (W-30, S-22, land-use orphaning, W-3/W-4/W-5, containment, stamp dry-run, bake-vs-atom, retrieval candidates).

**Explicitly out:** production writes (stamp `--apply`, land-use SQL apply, UPDATE/INSERT/DELETE/DDL). Nested coordinators. Working in dirty `P:/legacy-design-tools` or detached `P:/hauska-engine`. CTX / national (standing HELD). A second atoms writer. Reconstructing an unfiled S-25..S-182 table and promoting the reconstruction into the verified 48.

**Exit condition as this seat understood it:** the MP dispatch asked for **one operator report** (SHA+PR vs prepared vs blocked; what was violated; numbers with queries; what subagents got wrong). That single report was **never filed as one artifact** before this handover. There is no declared "T-25 = 100% of retrieval" exit. Canon itself says a check that does not exist has no row, and `packages/retrieval` was named remaining/untouched.

If none was declared beyond "report back for operator verification": **none was declared as a completion gate for the whole enumeration.** The MP fan had per-item gates (229, no `--apply`, violate-to-prove). Those are item exits, not programme exits.

### 2b. Markets substrate (other seat; this seat did not work it)

Session `_sessions/2026-08-20_t25_enumeration_handover.md` (`applies_to: empressa-trading, smart-markets`). 513 CANDIDATE. T-26 session `_sessions/2026-08-20_t26_markets_substrate_claude_code.md`. T-27 artifacts in `_inbox/2026-08-20_t27_*` are **markets** (delist / security-master futures), not property scorers.

### Lane / card IDs

| ID | what it was | status |
| --- | --- | --- |
| Property T-25 | Enumerate existing checks; cheapest satisfier; valid?; derivation state. Canon: 48 distinct verified. Three hold. One has a second derivation. | **partial.** 48 filed. Retrieval named remaining. Candidate S-25..S-182 never entered the 48. |
| Markets T-25 | Same method on cockpit/smart-markets. 513 candidates, 93 read, 44 remaining. | **partial** (other seat). This seat did not touch it. |
| Property T-26 | "Test as lock": tests asserting values no authority recognises. Named in `51_ingestion_pipeline_reference.md`. 2026-08-19 changelog claims "T-25 through T-27 returns from both substrates". | **DO NOT KNOW** whether a property T-26 close exists. This MP session did **not** run it. No `_inbox/*t26*property*` found. Markets T-26 has thirteen lane closes. |
| Markets T-26 | Thirteen lanes, fourteen merged rows, one layer earned. Session record exists. | **complete as that session defined it** (CLAIM: verify against those PRs; this seat did not `git rev-parse` those repos). |
| Property T-27 | Scorer contract: missing required input must refuse to emit. Named in `51_ingestion`. S-22 (geometry denominator) is the property instance this fan **did** touch. | **partial / not started as a named T-27 card.** A3 is one scorer-contract fix, CI-red, unmerged. Full T-27 over every completeness instrument: **not started by this fan.** |
| Markets T-27 | Delist / security-master forensic (`_inbox/2026-08-20_t27_*`). | Other seat. **not this programme.** |
| A1 | W-30 omit missing accessPolicy on property/road chains. | **partial.** Code on PR #353. CI `"FAILURE"`. `listJurisdictions` default left on purpose. |
| A2 | CI job fails when a required check-run name has no matching workflow job. | **partial.** PR #354. Control is **starved in CI** by GITHUB_TOKEN 403. Job is **not** itself a required check. leave_behind: ldt and hauska-map copies not built. |
| A3 | S-22 three-part card (retire declared geometry denominator, meaning-shaped test, divergence test). | **partial.** PR #445. Typecheck `"FAILURE"`. |
| A4 | land-use / landuse orphaning. Prepare SQL, do not apply. | **partial.** PR #446. Typecheck `"FAILURE"`. Live rows unchanged. Overlay forbidden. |
| B5 | W-5 SFHA enum raise; W-3/W-4 third centroid impl; bbox fallback removed. | **code complete on branch, unmerged.** On #355. |
| B6 | Containment reads parcel store, not the atom. | **code complete on branch, unmerged.** On #355. `--from-plan` does not re-run containment (leave_behind). |
| B7 | Corpus stamp dry-run only. Bastrop 229 gate. Second county Brewster 48043. | **dry-run complete. Apply blocked.** 229 MISS (271) on `3b221d0`. First-write-wins landed in `523abba`. **229 not re-measured after that commit.** |
| C10 | Bake vs atom flood, zone-versus-X, NFHL at parcel vs tile. | **read-only complete.** Return **not in the estate** (`P:/tmp/mp-c10-return.md` only). |
| C12 | Verify 157 retrieval candidates against a filed list. | **complete as a finding that the list was unfiled.** 0 of 157 in the 48. 71 sampled / 87 unmeasured. |

SS-W16, SS-W17, F-0, S-21: prior property-seat work that this fan consumed, not re-run as cards. S-21 is RETIRED (not found by traversal). F-0 is the "handover only in a transcript" incident.

---

## 3. DID T-25 FINISH — the direct question

**No. Do not reassure. There are two T-25s. Neither is finished.**

### 3a. Property T-25 (`65_t25_admissibility_enumeration.md`)

What it set out to enumerate: every validity check in the property substrate's write, resolution, and scoring paths that **exists**, with cheapest satisfier and whether that value is semantically valid. It does **not** enumerate missing checks.

Denominator as filed: **48 distinct verified checks.** Not "rows 1 to 46" (numbering collision: SS-W16 rows 1-2 duplicate R-3 and the tier2 prose). Source: `65_t25_admissibility_enumeration.md` lines 13 and 57-59. File `last_updated: 2026-08-20`. Snapshots **in that file** still list ldt `1113c649`, which is **stale** versus origin/main `1a55566b` measured this turn.

| bucket | count | meaning |
| --- | --- | --- |
| VERIFIED (in the 48) | 48 | Filed in canon. Three hold. One has a second derivation. |
| CANDIDATE retrieval S-25..S-182 | 158 original S-ids (S-25 through S-182 inclusive) | **Never filed as a table in doc_repo.** Commit `e6de1eb` named the range and filed W-30 only (+40 lines). Source: `_inbox/2026-08-20_c12_retrieval_candidate_rows.md`. |
| Of those, treated as one verified check | W-30 = S-73 and S-74 | In the 48. A1 is the fix, unmerged, CI-red. |
| Remainder after W-30 | 157 (if one check) or 156 (if two sites) | Canon used 157. C12 stated both arithmetics rather than collapsing them. |
| C12 sampled unique S-ids | 71 | None ghosts. 0 enter the 48. |
| C12 unmeasured | 87 | 158 − 71. Not a survive count. |
| UNREAD in the original 48's named remainder (`packages/retrieval` beyond `three-layer-audit.mjs`) | the 87 plus anything C12 did not reconstruct | Still unread as **verified rows**. |

The 44-row handover set in `_sessions/2026-08-20_t25_enumeration_handover.md` is **markets**, not property. This seat has **not worked any of those 44 rows**. Status: **not started here.**

| markets remaining item | this seat |
| --- | --- |
| 44-row set (`futures_reference.py` 15, `resolver.py` 13, remainder 16) | **not started.** No evidence in this transcript of those files being opened. |
| 54 can-fabricate rows (read, not classified to derivation state) | **not started here.** |
| dead-guard diagnostic | **not started here.** |
| seasonality output reaching a registered claim | **not started here.** |
| IV surface path `routers/market.py:597` | **not started here.** |

T-26 markets session claims some of that ground moved under T-26 (including a dead-guard reachability scan, PR #360). **CLAIM.** This seat did not re-read those merges. Settling it: read `_sessions/2026-08-20_t26_markets_substrate_claude_code.md` against `git log` on those repos.

### packages/retrieval S-25 through S-182 after C12

Disposition: **unfiled original, sampled archaeology, zero promotions.**

- Original table: Claude transcript session `f6fb1037-ab85-4d20-87c2-e17ff773a9dd`, agent `aaae06f9fbadca8b4`. Extract at `P:/tmp/mp-c12-original-list.md` (tmp, not estate).
- Decision (untracked file, not committed): `_decisions/2026-08-20_unfiled_measurement_is_not_in_the_estate.md`. Reconstructing the list and then verifying the reconstruction would launder the miss.
- Structural remarks C12 did verify at source (not row promotions): `CellMeasurement.measured` is a caller boolean; `--check-registry` is opt-in and invoked by no workflow; `tally.ts` has no sentinel defaults (dispatch prediction false); `duplicate-subject/classify.ts` `?? 0` collapses null vs 0.

### Unfinished items **not** already written into `65_t25` or the markets T-25 handover

These are from the MP fan and the property seat handover amendment. They are unfinished and they are **not** those two files' remaining lists:

1. C10 return not in doc_repo (`P:/tmp/mp-c10-return.md`). Tile-versus-parcel is the flood serving defect. Losing tmp loses the sample table.
2. B7 229 not re-run after `523abba` first-write-wins. Apply still blocked.
3. Population identity assertion is on the branch (`523abba`); Brewster dry-run that exposed the hole was on `3b221d0` and was not re-run.
4. A1/A3/A4/A2 CI failures. PRs open, not merged.
5. A4 prepare SQL unapplied. Live `land-use` 19 rows still in `county_facet_coverage`.
6. `listJurisdictions` `?? "public-free"` left in place (A1 scoped it out).
7. A2 not replicated to ldt / hauska-map. A2 live-API step 403 in Actions.
8. `--from-plan` skips containment (B6 leave_behind).
9. Property T-26 / full T-27 over every scorer: not run by this fan.
10. Per-family key grammar for orphan sizing (Q3). There is no `parcel-node` table.
11. Writer comment "Outside mapped zones = PRESENT inSFHA=false" stale vs live planner (C10). Unfixed.
12. Operator report item 1-6 from the MP dispatch: never consolidated into one filed report. This handover is the substitute.

---

## 4. THE OPEN WORK RIGHT NOW

`git status --porcelain` this turn on each MP worktree. Product commits are on origin. Untracked files are the only uncommitted copies.

| worktree | repo | branch | HEAD SHA | pushed? | PR? | what it contains | only copy if worktree dies? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P:/tmp/mp-a1-accesspolicy` | hauska-engine | `fix/w30-accesspolicy-no-default` | `2c3c52cdb99c3aa470e7abbf68ec03fd94001bee` | yes | #353 OPEN | W-30 omit default. Untracked `RETURN.md`. | Product: **no** (on origin). RETURN.md: **yes** unless copied to `_inbox` (not present). |
| `P:/tmp/mp-a2-rename-control` | hauska-engine | `ci/required-check-rename-guard` | `0f183d54bb93b9f2d9478817a1b9086c6ffbbd69` | yes | #354 OPEN | Rename-guard CI. Untracked `RETURN.md`. | Product: no. RETURN.md: **yes**. |
| `P:/tmp/mp-a3-s22-card` | legacy-design-tools | `fix/s22-geometry-denominator` | `100b9c26b83d25b5f88556ee77b9f12a77ba306d` | yes | #445 OPEN | S-22 card. Untracked `RETURN.md`. | Product: no. RETURN.md: **yes**. |
| `P:/tmp/mp-a4-landuse-orphan` | legacy-design-tools | `fix/landuse-facet-key` | `1c1f5bf4484d597400573ff6f547f9e207882700` | yes | #446 OPEN | Writer key pin + prepare SQL. Untracked `RETURN.md`. | Product: no. RETURN.md: **yes**. SQL is in the commit. Live DB still unmigrated. |
| `P:/tmp/mp-b-flood-chain` | hauska-engine | `fix/flood-geo-failclosed` | `523abbab597594a71f47bf117bbb4293543af949` | yes | #355 OPEN | B5+B6+identity+first-write-wins. Untracked RETURN* and `_b7-diff-tmp.mjs`. | Product: no. RETURN files and `_b7-diff-tmp.mjs`: **yes**. Copies of B6/B7 prose exist untracked in doc_repo `_inbox/` (see below). |
| `P:/tmp/mp-c12-engine-ro` | hauska-engine | detached | `d3f37949003fae5a99a82b62956352b7dcaa1022` | n/a | none | Read-only snapshot. | Safe to delete **after** C12 inbox file is committed. |
| `P:/tmp/mp-c10-return.md` | (file, not a git repo) | n/a | n/a | no | none | Full C10 adjudication. | **YES. Losing this file loses the only copy of C10.** Not in doc_repo. |
| `P:/tmp/mp-c12-original-list.md` | file | n/a | n/a | no | none | Transcript extract of S-25..S-182 | **YES** as the working extract. Decision says do not promote a reconstruction into canon. Still: losing tmp loses the extract. |
| `P:/tmp/mp-b7-48021.ndjson` and `P:/tmp/mp-b7-48021-diff.json` | files | n/a | n/a | no | none | Dry-run refused keys, extra-42 set | **CLAIM they still exist; not re-listed this turn.** B7 return says they were written. **Re-check before deleting tmp.** |

doc_repo untracked files produced by this programme (planner-owned; **do not commit from a lane**; this pass did not commit):

- `_decisions/2026-08-20_flood_plan_population_identity.md`
- `_decisions/2026-08-20_flood_stamp_229_licenses_ssw17_convention.md`
- `_decisions/2026-08-20_unfiled_measurement_is_not_in_the_estate.md`
- `_inbox/2026-08-20_a4_landuse_orphaning.md`
- `_inbox/2026-08-20_b6_parcel_store_containment.md`
- `_inbox/2026-08-20_b7_stamp_dry_run.md`
- `_inbox/2026-08-20_c12_retrieval_candidate_rows.md`
- `_inbox/2026-08-20_mp_interrupt_recovery.md`
- `_scratch/property_master_plan.md`

Those are in the doc_repo working tree. They are **not** on origin until the planner commits. A hard reset of the integration tree loses them. They are the estate copies of B6/B7/C12/A4; C10 is **not** among them.

Flag: **losing `P:/tmp` loses C10, the S-25 extract, B7 NDJSON, and worker RETURN.md files.** Losing the five `mp-*` git worktrees does **not** lose the product commits (they are on origin).

---

## 5. WHAT THE AUDIT FOUND THAT BEARS ON SMARTSITE + TEXAS COMPLETE

Filter: ingestion and serving path. Nothing else.

### Defects that block the market launch

"Block" here means: a paying SmartSite user in Texas cannot be told the product is complete and honest **or** a standing launch rule is already HELD.

1. **Code-done is not customer-done.** Standing: L26 idle, QA on current map, CTX/national HELD, live probe on `https://smartsite.cloud`. Source: `_state/property/STATE.md` DRAIN STATUS. This audit did not run that live QA. **CLAIM** that map QA is still the launch gate. Settling it: operator visual QA on serving SmartSite, not a merged PR.
2. **Bake flood on the PE / SmartSite facet path is the wrong point.** Bake queries FEMA at a 0.005-degree tile centre and stamps that zone on every parcel in the tile. Displacement in the C10 sample: 137 m to 319 m. Atom matches NFHL at `ST_PointOnSurface`. If SmartSite (or PE) shows the bake overlay as the parcel's flood zone, **Texas-complete flood on that surface is a tile, not a parcel.** That blocks an honest flood claim on the bake-fed UI. It does **not** block "atoms exist for 84/84 counties" as a drain headline. Source: `P:/tmp/mp-c10-return.md`.
3. **W-30 still on origin/main.** Missing `accessPolicy` served as `public-free` on property and road chains. Tenant-sovereignty commitment. Fix is unmerged and CI-red. Blocks any claim that serving enforces ADR-017 on those chains.
4. **Land-use numbers on the coverage ledger are two measurements under two keys.** A dashboard or GTM sentence that mixes `land-use` and `landuse` reports a fake completeness (19 vs 254) or a fake rate (Comal 0.00 vs 99.68). Launch copy that quotes a single land-use coverage figure without naming the key is already false.

### Defects that are real but do NOT block launch

1. **Flood stamp `--apply` / the 229 gate / first-write-wins.** Atoms already exist. Stamp apply re-classifies sample-point-outside-parcel. It does not create Texas. It waits on operator authorisation and a re-dry-run after `523abba`. Why it can wait: launch QA is on the current map; standing decision is QA-on-current, not a new statewide write.
2. **A2 rename-guard.** Process control. Does not change a customer number. Starved in Actions by 403 anyway.
3. **S-22 geometry denominator retirement.** Honest card on a scorer declaration. Geometry rail is already 254/254 (probe Q2). The defect is a lying `denominator` field vs executed query, not missing Texas geometry rows. Can wait behind CI-red #445 if launch is map QA.
4. **Unfiled S-25..S-182 remainder (87 unmeasured).** Cheap serving defaults may remain. They are not a coverage hole. They are a lying-number hole if they fire on a customer path. Prioritise serving-path rows if any later pass files the list; do not finish the unread 87 as a launch prerequisite.
5. **Brewster MultiPolygon / 26.5% null-geom statewide.** Real unmeasurable population (`4,354,603` null geom of `16,428,786` txgio_parcel rows, probe Q4). Declaring those "no flood" would be a launch lie. Declaring them unmeasured is honest and can ship. Do not wait for a statewide stamp of null-geom.
6. **A2 leave_behind (ldt, hauska-map copies of the rename control).** Fleet hygiene. Not GTM.

### Defects that make a launched product REPORT WRONG NUMBERS to a paying customer

This is the category that matters most.

1. **Bake flood vs parcel flood (tile centre).** Customer sees AE/A/AO because their parcel's tile centre is in the SFHA, while the parcel point is X (or the inverse). Mass: 36,723 of 37,331 disagreements in the 10-county both-stores join. AO/AE (129) is the same mechanism. **If the UI reads bake, the number is wrong.** If the UI reads atoms, C10's sample says the atom matched NFHL at the parcel. n=9 Bastrop, labelled small and honest. Source: `P:/tmp/mp-c10-return.md` plus probe Q5 sizes (Q5 sizes were **relayed** by C10, not re-derived).
2. **`land-use` vs `landuse` overlay.** Same county, different pct, different writer semantics. Overlay was forbidden this session because it would publish the wrong rate as a migration "fix".
3. **W-30 `public-free` default.** Wrong access class, not a flood zone, still a customer-facing lie about who may see the atom.
4. **W-5 fail-open SFHA** (on origin/main until #355 merges). Unrecognised SFHA encoding reads FALSE; overlapping zones lose SFHA preference and return array order. C10 rejected this as the cause of the 37k bake/atom mass. It remains a write-path way to stamp the wrong in/out flag **on the atom** when encodings or overlaps appear. After merge, still unapplied to the corpus until stamp `--apply`.
5. **S-22 declared geometry denominator.** A machine-readable field that does not match the executed denominator. A customer-facing score that cites that field cites the wrong basis. Rows themselves are 254/254.
6. **`CellMeasurement.measured` as a caller boolean.** A serving sweep can present unmeasured as measured. Invented zeros. C12. Not sized in production.
7. **Geometry 253 vs 254.** The 253 figure is a different rail's old count, inherited into S-21 records. Quoting 253 Texas counties for geometry is a wrong completeness number. Probe Q2: geometry is 254/254. Source: `_inbox/2026-08-20_db_probe_five_answers.md`.
8. **46 million "orphans".** A badly specified query. Must not be quoted. Probe Q3.

### Flood corpus apply chain (B5/B6/B7, 229 Bastrop gate, first-write-wins)

**Beside the Texas-complete critical path, not on it.**

Texas-complete in the drain sense (atoms written, rails scored) does not wait on `--apply`. The stamp is an honesty backfill for the SS-W17 population (first 6,000 DISTINCT ON `feature_index` rows, 138 unusable, 112 duplicate, 5,750 plannable, 229 not-contained **under first-key-wins**). 229 of 5,750 is not 229 of 74,729 Bastrop parcels and is not county-complete.

First-write-wins makes the stamper consistent with SS-W17. It does **not** prove which `feature_index` is the parcel when `prop_id` duplicates. If that convention is wrong, every stamped county moves together.

Apply gate still owed: Bastrop `--limit=6000` dry-run with identity equation **and** `notContained===229` **after** `523abba`. That dry-run was **not** done this turn.

### Two-application friction not written down anywhere until this file

Written in tmp here; not previously in a tracked committed doc as a two-app origin:

- This seat never heard Nick name the two apps. The operational pair is **PE/coverage/bake on neondb** versus **engine atoms on hauska_mcp**, with SmartSite as a consumer that can be pointed at either.
- hauska-map does **not** write the tier2 bake. LDT `nodeFacetBakeTier2Cli.ts` does. C10. That split is easy to miss if someone assumes "SmartSite repo owns flood on the map".
- `evaluateJoinIntegrity({ facet: "land-use" })` is a **label**, not the ledger key. The writer already upserts `landuse-cad-join`. The 19 `land-use` rows are stranded leftovers, not the live writer. A4. "Repoint the writer" was the wrong diagnosis of current code.
- Wrong-database zeros as a **product** failure mode: an agent or intern querying the "obvious" database reports Texas-empty.

---

## 6. WHAT YOU WOULD DO NEXT AND WHAT YOU WOULD STOP

Opinion, not a menu.

### Next three things, in order, for SmartSite to market with Texas complete

1. **Pick the flood source SmartSite actually serves, on the live URL, then stop serving the other as parcel truth.** If it is bake, that is a launch-blocking wrong number (tile, not parcel). If it is atoms, C10's sample supports parcel-level NFHL agreement and the bake overlay must not be labelled as the parcel zone. This is a live probe on `https://smartsite.cloud` plus the code read of the client, not another 37k SQL join. Code-done ≠ customer-done. Do not merge flood PRs as a substitute for this probe.

2. **Do not overlay land-use keys. Do not quote a single land-use coverage number.** Pin copy and UI to one named key. Leave the 19 `land-use` rows until an operator-authorised delete after n=0, and only after CI on #446 is actually `"success"`. Fix the Typecheck on #446/#445/#353 before calling those "landed".

3. **Hold stamp `--apply`. Hold CTX/national. Run operator map QA on the current serving revision.** Merge #355 only after you accept that 229 is a convention license and after a new dry-run on `523abba` prints 229. That is honesty work **beside** GTM, scheduled after the live flood-source call.

### What part of the audit programme to STOP now, and what is lost

**Stop finishing unread retrieval S-rows as a census, and stop treating markets T-25's 44 rows as this property planner's job.**

Loss, specifically:

- The 87 unsampled S-ids may contain more serving defaults of the W-30 / S-76 shape. Stopping means those stay unverified. A later customer-facing retrieval bug of that class will look new. It will not be new. It will be unread.
- Markets 44 + 54 can-fabricate + dead-guard + seasonality + IV surface stay with the markets seat. If this planner "finishes T-25" by reading cockpit Python, Texas SmartSite does not move and those rows still need their own owner. The loss of **not** doing them here is zero for SmartSite and 100% for anyone who thought one T-25 remained.

**Stop expanding T-25 into T-26/T-27 on property as a prerequisite to GTM.** Loss: tests that lock in fake FEMA codes, and scorers that emit numbers without a denominator, can remain. A3 already targeted the loud geometry case. A full T-27 would find more. Launch can proceed with **named** unmeasured rails (envelope 19, flood coverage ledger 177/254) rather than a complete scorer-contract census.

**Do not stop:** filing C10 into the estate, the live SmartSite flood-source probe, and not overlaying land-use.

### What I would have done differently in the last 36 hours

Filed the S-25..S-182 table **in the same commit that named the range**, or refused to name the range. C12 spent its budget proving an absence.

Counted duplicate-key skips and printed the population identity **in the first Bastrop dry-run**, instead of discovering the Brewster hole in prose.

Re-run Bastrop 229 immediately after first-write-wins, in the same worktree, before opening the identity as a second commit. The current state is "convention fix on the branch, gate not re-measured".

Kept C10 out of `P:/tmp` only. Same defect class as C12. This handover is the fourth instance the 2026-08-20 decision named, unless this file is planner-committed.

Not opened four PRs into Typecheck-red. A1's `atomDid` error at `:153` looks adjacent to the accessPolicy edit; A3's `never` looks like the retirement narrowed a union too far; A4's test mocks are the PR's own tests. Violate-to-prove locally included `tsc` on the package that CI typechecks.

---

## 7. THINGS THE NEXT PLANNER WILL GET WRONG

### Stale or superseded numbers in doc_repo files

| number / claim | where it still lives | superseded by |
| --- | --- | --- |
| geometry population 253 | property seat handover **body**; inherited S-21 records; some drain prose | Probe Q2: **254/254**. Amendment block at top of `_inbox/2026-08-20_property_seat_handover_s21_rederivation.md` is the truth. |
| R-7 / centroid guard starved (bbox `numeric`) | handover body; formerly "highest-value" in 65_t25 candidate prose | Probe Q1: columns are `double precision`. **No action.** |
| 46,486,592 unresolved / orphans | handover body item 3 | Probe Q3: bad query. Per-family key grammar does not exist. |
| AO vs AE as the flood disagreement | conversational residue; SS-W11 citations | Probe Q5: **36,723 zone-versus-X**; AO/AE = 129. |
| 47 distinct verified checks | property handover "DONE" paragraph | Canon: **48**. |
| ldt snapshot `1113c649` | `65_t25` snapshots table | origin/main this turn: `1a55566b`. |
| planner scratch snapshot `4fa70bb` | `_scratch/property_master_plan.md` | doc_repo HEAD this turn: `c2315137`. |
| B7 PR SHA `3b221d0` | B7 return header; scratch B6 line | PR #355 HEAD: `523abba`. |
| SS-W17 229 as which feature is the parcel | easy misread of the close | Decision: licenses first-key-wins convention. |
| land-use 19 and landuse 254 as one rail with stranded writes from the **current** writer | A4 dispatch text | Current upsert key is `landuse-cad-join` (0 rows). 19 `land-use` rows are leftovers. |
| CLAUDE.md Sync 4.5 corpus 698 atoms / 4 jurisdictions | CLAUDE.md historical block | CLAUDE.md later recon: 34 jurisdictions / 21,126 atoms. Still easy to quote the first paragraph. |
| flood 84/84 including Harris | `_state/property/STATE.md` drain | Probe: facet `flood` **177 of 254**. Those are different objects (atom drain vs coverage ledger). Quoting one as the other is the two-app bug again. |
| T-25 remaining 44 | markets handover | Not property. Property remainder is retrieval candidates + MP CI/apply. |

### Dormant, starved, over-scoped, or unwired controls (with paths)

| control | path | what's wrong |
| --- | --- | --- |
| `--check-registry` exit-1 divergence | hauska-engine `packages/retrieval` (opt-in CLI) | **Dormant.** No workflow passes it. C12. |
| `CellMeasurement.measured` | hauska-engine retrieval CellMeasurement | **Starved / caller-asserted.** Flagship unmeasured-is-not-zero rests on a boolean nothing derives. |
| A2 `required check names` | hauska-engine `.github/workflows/ci.yml` job; `scripts/ci/assert-required-check-names.mjs` | **Starved in the environment it runs in.** GITHUB_TOKEN 403 on protection API. Job **not** in required contexts (`typecheck + test` only). A failing run does not block merge. leave_behind: not on ldt or hauska-map. |
| Branch protection "required checks" as merge gate | ldt, engine, map | Stage 2 is live (dispatch). A2 still: decoy job with the right `name:` is the cheapest satisfier. **CLAIM** ldt required names remain the four listed in the dispatch; not re-fetched this turn. |
| `assertRailLedgerRowFixture` | ldt A4 tests | **Test-only.** Table still accepts `land-use`. |
| `--from-plan` containment | engine flood writer | **Bypasses** B6. Does not re-run store-gated check. |
| well-fact `geometryCentroid` | engine well-fact | **Imported, never called** (B5 scope note). special-district not imported. Only flood's is invoked. |
| `--apply` default false | `write-flood-hazard-fact-county.mjs` | Armed as a dry-run default. **Not a launch gate.** Easy to think "stamper exists therefore corpus is stamped". |
| classify.ts `?? 0` | `packages/retrieval` `duplicate-subject/classify.ts` | Collapses null and 0 sample-point distance. |
| listJurisdictions `?? "public-free"` | `packages/retrieval/src/index.ts` ~`:666` | Left in place. Docblock says intentional for jurisdiction snapshots. Over-scope risk if a later fix "removes all public-free defaults". |

### Docs that say done when it is not

- MP items "COMPLETED" in a todo list ≠ merged ≠ CI `"success"` ≠ applied to production DB.
- `65_t25` "paths completed" for flood-hazard-fact geo: **code on a branch**, not origin/main, not stamped.
- Property handover "F-0 closed properly" / "47 checks": the 48th and W-30 filing happened; retrieval still candidate.
- T-26 session "what merged" is **markets**. It does not close property T-26.
- `_state/property/STATE.md` still carries L16B in flight, L24 in flight, L26 idle, template-city, G-103/G-104. Those paragraphs collide if read as one "now". Drain status 2026-08-17 vs audit 2026-08-20: **do not take L16B "IN_FLIGHT" as live without a new lease read.** This seat did **not** re-verify the atoms slot.
- A2 RETURN: "GitHub-Actions-on-a-branch: not claimed" then CI ran and 403'd. The return is stale on that sentence.

### Standing decisions / operator rulings from these sessions **not** in committed `_decisions/`

Files exist **untracked** in the integration tree. Until the planner commits them they are the same class as a transcript:

- `_decisions/2026-08-20_unfiled_measurement_is_not_in_the_estate.md`
- `_decisions/2026-08-20_flood_stamp_229_licenses_ssw17_convention.md`
- `_decisions/2026-08-20_flood_plan_population_identity.md`

Operator calls this seat treated as binding, **not** in those files as separate records:

- No production writes (dispatch hard stop). Already in the dispatch text.
- Overlay of `land-use` onto `landuse` **forbidden** (planner, A4). Not a `_decisions/` file of its own.
- B5 bbox fallback removed by planner, not left as a named default.
- QA on current map / CTX HELD: already in standing decisions / `_STATE.md` (committed programme, not this session).

---

## Planner file list (you commit; this seat did not)

Estate copies waiting in `P:/doc_repo` untracked: the three decisions, A4/B6/B7/C12 inbox files, interrupt recovery, scratch. **Also copy `P:/tmp/mp-c10-return.md` into `_inbox/` before tmp is cleaned.** This handover is `P:/tmp/audit_programme_handover.md` only.

leave_behind: none from a closed lane; the programme is being folded, not closed.

---

## Commands this snapshot came from (verbatim family)

```
git -C P:/doc_repo rev-parse --abbrev-ref HEAD
git -C P:/doc_repo rev-parse HEAD
git -C P:/hauska-engine rev-parse origin/main
git -C P:/tmp/mp-b-flood-chain rev-parse HEAD
git -C P:/tmp/mp-a1-accesspolicy rev-parse HEAD
git -C P:/tmp/mp-a2-rename-control rev-parse HEAD
git -C P:/tmp/mp-a3-s22-card rev-parse HEAD
git -C P:/tmp/mp-a4-landuse-orphan rev-parse HEAD
git -C P:/hauska-map rev-parse HEAD
git -C P:/hauska-map rev-parse origin/main
git -C P:/tmp/mp-a4-landuse-orphan rev-parse origin/main
git -C P:/hauska-engine rev-parse HEAD
git -C P:/legacy-design-tools rev-parse HEAD
git -C P:/tmp/mp-c12-engine-ro rev-parse HEAD
git -C P:/seat-worktrees/property/hauska-engine rev-parse HEAD
git -C P:/seat-worktrees/property/legacy-design-tools rev-parse HEAD
gh pr view 353|354|355 --repo empressaioemail-tech/hauska-engine --json number,title,state,isDraft,headRefOid,statusCheckRollup,url
gh pr view 445|446 --repo empressaioemail-tech/legacy-design-tools --json number,title,state,isDraft,headRefOid,statusCheckRollup,url
```

Neon counts in this file are **not** re-queried this turn. They cite `_inbox/2026-08-20_db_probe_five_answers.md` and earlier planner SELECTs recorded in `_scratch/property_master_plan.md`.
