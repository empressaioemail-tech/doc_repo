---
id: 2026-08-30_ctx_execute_plan_review
title: Review — CTX execute-waves plan and the operating board, graded
date: 2026-08-30
last_updated: 2026-08-30
status: finding
role: adversarial plan + board review (read-only; no fetch, apply, migrate, bake, deploy, commit)
reviews: _inbox/2026-08-30_ctx_execute_waves_WDLL.md, _inbox/2026-08-30_ctx_chew_next.md, canvases/factory-and-texas-complete.canvas.tsx
brief: _inbox/2026-08-30_ctx_execute_plan_review_handoff.md
plan_row: F-01, F-06, F-08, F-11, F-18, P-09, P-11, P-17
verdict: refuse the P0 grade; approve P1 to P8 as a schedule on five amendments before Click 2
snapshot: see Snapshot
---

# Review: CTX execute waves P0 to P8, and the board

Date: 2026-08-30  Reviewer: review agent  Status: finding

## Snapshot

| Subject | Ref read | Commit |
|---|---|---|
| `P:/doc_repo` | `main`, working tree AND `HEAD` read separately | `beb8c8b9748a84e97242129c9f586930f4b1fe47` |
| `P:/hauska-factory` | `origin/main` (fetched this session) | `7f41f52328ec40da0480d5eb65aad09ca3d4c3f9` |
| `P:/hauska-factory` | `origin/seat/property-ctx-walk-alias-schema` | 3 ahead / 0 behind main, unmerged |
| `P:/hauska-engine` | `origin/main` (fetched) | read by ref only |
| `P:/legacy-design-tools` | `origin/main` (fetched) | read by ref only |
| Canvas | `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx` | 1,656 lines, read in full |

Instruments: `git ls-files --error-unmatch`, `git show HEAD:<path>`, `git show <ref>:<path>`, `git grep <ref>`, `git rev-list --left-right --count`, `grep -rn`. No store connection, no GIS fetch, no gcloud, no job start, no commit. Where a claim needed live state I write UNMEASURED.

The doc_repo tree is dirty from several seats. **This review reads doc_repo twice: once as the working tree, once as `HEAD`.** That distinction produced the central finding, and no prior artifact in this thread made it.

---

## Verdict

**Refuse the P0 grade. Approve P0 to P8 as a schedule, on five amendments, before Click 2 is cut.**

The schedule itself is sound and is a real improvement on the card the prior review refused. Order, phase boundaries, exit-gate language, and the parallel/serial split are consistent across execute-waves, chew-next, parallel-waves and the canvas; the poison schedule is genuinely gone from every operating surface; zoning and roads have homes; the placeholder and envelopes-over-zero quarantines travel. That is real absorption and it should be said plainly.

What fails is narrower and it is exactly the thing the operator asked to be checked. **P0 was graded met against a working tree, not against the repository.** Every artifact the grade rests on is untracked, the OPS-1 correction the grade cites is uncommitted, and OPS-1 as committed still says both boundary tables have zero rows and no adapter. Read the way P0's own exit gate specifies — "a fresh agent reading only tracked canon" — P0 has not landed at all. It has been drafted.

Second: A1 was not absorbed, it was restated. Nothing anywhere names the split. And A1's third clause is the one Click 2 walks into.

---

## 1. P0 "met" — REFUSED, with file evidence

Execute-waves acceptance item 1 (line 86):

> **P0 landed.** OPS-1 no longer says city/county boundaries have zero rows. […] | check: a reader of OPS-1 + this card does not claim county-wide setbacks | grade: [met 2026-08-30: OPS-1 A12 correction; W3 apply list restated; execute-waves card filed]

The item's own first sentence is a testable claim about a named file. It is false.

### 1a. OPS-1 as committed still carries the line, verbatim

`git show HEAD:90_operations/OPS-1_texas_source_registry.md`:

```
46:> **CORRECTION 2026-08-08:** ... and city limits / county boundaries (zero rows
   anywhere, code confirms no adapter exists).
49:- CITY LIMITS: ... This is a SOURCE only: **no adapter, ingest script, or table
   exists; zero rows anywhere.** Confirmed independently by the engine's own code
   comment at `cascade-unzoned-envelope-decline.ts:62` ...
51:- COUNTY BOUNDARIES: NOT a dedicated TxGIO service; use Census TIGER. Same
   absence as city limits, zero rows, no adapter.
```

`git diff --stat 90_operations/OPS-1_texas_source_registry.md` → `1 file changed, 8 insertions(+), 6 deletions(-)`, and `git status --porcelain` → ` M `. The A12 correction exists **only in the working tree**. Falsifier 2 fires exactly as pre-registered: OPS-1 still contains an unstruck "zero rows / no adapter" line a fresh agent would cite.

### 1b. Every artifact the grade cites is untracked

`git ls-files --error-unmatch`, one file per line:

```
UNTRACKED _inbox/2026-08-30_ctx_execute_waves_WDLL.md
UNTRACKED _inbox/2026-08-30_ctx_chew_next.md
UNTRACKED _inbox/2026-08-30_ctx_parallel_waves.md
UNTRACKED _inbox/2026-08-30_ctx_w3_collect_WDLL.md
UNTRACKED _inbox/2026-08-30_ctx_w3_collect_review.md
UNTRACKED _inbox/2026-08-30_ctx_w3_collect_amendments.md
UNTRACKED _inbox/2026-08-30_ctx_road_to_prod_accurate.md
UNTRACKED _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md
TRACKED   _inbox/2026-08-30_ctx_facts_complete_WDLL.md
UNTRACKED _decisions/2026-08-30_ctx_complete_or_absent.md
```

The A-028 decision is untracked. The operating card is untracked. The measured owe table is untracked. The 72 exists in no tracked file. And the one tracked file, `facts_complete_WDLL.md`, names five of the untracked ones in its `depends_on`.

ENFORCEMENT, Scope: *"Anything cited by tracked canon must itself be tracked. Cited and untracked is the worst state."* That is the present state, and it is the state P0 exists to end.

### 1c. Run P0's own exit gate and it fails

Road-to-prod P0 exit gate: *"a fresh agent reading only tracked canon reaches the same owe table. Test it by handing the corrected docs to an agent with no session context and asking what is owed. If it answers county-wide setbacks, P0 failed."*

That test was never run. It was graded on artifacts filed. Run it as specified and a fresh agent reading only tracked canon gets: OPS-1 at HEAD (boundaries impossible), `_inbox/2026-08-08_STATEWIDE_layer_inventory.md` (tracked — confirmed), and `facts_complete_WDLL.md` pointing at seven files that are not in the repository. It reaches neither the measured owe table nor the 72 nor the not-applicable ruling, because none of them are readable. It is likelier to conclude the work is impossible than to owe county-wide setbacks — a worse outcome than the one the gate names.

### 1d. A12 is half-done even in the working tree — falsifier 3

OPS-1 line 15 (doctrine note, applies to the whole doc) and line 46 both route the reader to `_inbox/2026-08-08_STATEWIDE_layer_inventory.md` as the store-truth reconciliation. That file is **tracked** and carries, uncorrected:

```
line 30: | County boundaries | Yes (Census TIGER candidate) | **No adapter found** | No | No |
         Same code comment confirms "no ... TIGER source anywhere"
line 29: | City / jurisdiction boundaries (TxGIO City_Boundaries) | Yes | **No adapter found** | No | No |
line 96: - **Explicit code evidence of absence**: ... "(verified: no city_limits /
         incorporated_place / TIGER source anywhere in [the codebase])" ...
         This is a **pure candidate**, not partially built.
```

So even after OPS-1 is committed, OPS-1's own cited authority still says the opposite. A12 named "OPS-1 lines 49 and 51." The correction has to reach the file OPS-1 sends the reader to, or the false impossibility survives one hop away.

### 1e. The P0 item that would have caught this was deleted

Road-to-prod P0 has five items. Item 5: *"Track the program. Nine artifacts, A-026, and a card H GRADE LOG row exist only in a dirty worktree."* Execute-waves P0 (line 65) carries four: OPS-1, owe table, 72 cities, rename. `grep -niE "track the program|dirty worktree"` over execute-waves and chew-next: **ABSENT from both.** The item naming the exact defect was dropped in the restamp, and the phase was then graded met.

**P0 grade: refused.** It is close to met and cheap to actually meet — commit the artifacts and extend A12 to the 08-08 inventory. But it is not met, and item 1 must go back to `[ ]`.

---

## 2. A1 to A12 absorption

Absorbed = present in an operating card as an instruction someone could execute or fail. Restated-only = appears in the review/amendments and nowhere an executor reads. Contradicted = a live file says the opposite.

| # | Amendment | Grade | Evidence |
|---|---|---|---|
| A1 | Split 0005: drop four false seeds, `probed_at` NOT NULL on absence, retarget alias DDL at bake `neondb` | **restated-only** | `grep -rn "probed_at"` across all seven cards + the canvas: **zero hits** (only `_catalog/texas_roster_v1.json`, the amendments, and the brief). No card names the replacement for 0005. See §4. |
| A2 | Scope every rail to `place_fips`; unincorporated → `not-applicable` | absorbed | execute-waves P3 row + item 5; canvas `CTX_WAVES` P3 and `CTX_LANES` P3; rail inventory line 55. But see §5 falsifier 8 — no writer, no store. |
| A3 | Write the city number 72, enumerated from `texas_roster_v1` with an area threshold; restore `all_county_fips` | **partial** | "72" appears in five files. `grep -niE "texas_roster_v1\|area threshold\|ST_Intersects\|all_county_fips\|enumerat"` over the six cards: **zero hits.** The number travels; the enumeration, the threshold, and the `city_manifest` repair do not, and none is named as a remaining hole. |
| A4 | Correct the owe table | absorbed | execute-waves "Measured owe" table lines 30 to 44: five-county wells and footprint, flood as shape conversion, McLennan 48,441 stamped, zero-FIPS branch dead, C-count done. Matches the amendments row for row. |
| A5 | Setbacks are a landing job of four existing artifacts | absorbed, **and contradicted in a live file** | execute-waves line 37 and rail inventory item 2 say land the four then probe the other 68. `_inbox/2026-08-30_ctx_w3_collect_WDLL.md:53` still defines collect-complete as "Austin / Kyle / Georgetown / Round Rock / Waco are absence rows unless a four-point probe finds a dimensional layer" — the exact false-absence framing A1/A5 exist to kill, restated in prose in a live card. Rail inventory item 2's check ("Austin/Kyle/Georgetown/Round Rock are **sourced**, not absence") directly contradicts it. |
| A6 | Do not re-run `landing-import` until county-scoped and delta-counting | **partial** | The refuse is in five files. The repair is in none: road-to-prod P2.1 carries "county-scope, delta-count, add indexes, deploy it as a job"; execute-waves P2 (line 67) carries "One job template. Writer allowlist. F-11 writer. Easement writer. Store split. Alias." The precondition the Do-not names is owned by no phase, so it can never be satisfied. |
| A7 | Make the gate readable — routing pin; give `import_ledger` a SELECT | **partial** | "Routing-pin holds" is in P1 on all three order files, and item 2's "Held rail refuses a job" is a real failing check. `import_ledger` in a gating position: zero mentions in any card. And the old gate survives — see §5 falsifier 9. |
| A8 | Fix or delete the vintage field | absorbed | execute-waves P1 row: "Vintage or delete." |
| A9 | Every job refuses on a missing county; parse `--name=value` | **partial** | Narrowed to F-18 in P1 and to "one writer" in the P2 exit gate. "Every job" and the `--name=value` parse rule appear nowhere. The canvas DONOT (line 226) covers F-18 only. |
| A10 | Give zoning stamps and roads a home | absorbed | execute-waves lines 41 to 42 (zoning → F-11 + bake; roads → parked P-17/F-10), chew-next line 56, canvas `R-ZONE` and `R-ROADS` residue rows. This one is clean. |
| A11 | Quarantine the 188,103 placeholder cohort | absorbed | execute-waves P4 row line 70 and item 6; chew-next Click 5; canvas `CTX_WAVES` P4. Both numbers travel. |
| A12 | Fix OPS-1 lines 49/51 | **partial** | Correction written (working tree only, see §1a) and not extended to the tracked file OPS-1 cites (§1d). |

Absorbed 5 (A2, A4, A8, A10, A11), partial 5 (A3, A6, A7, A9, A12), restated-only 1 (A1), contradicted-in-a-live-file 1 (A5, in the collect WDLL).

---

## 3. Road-to-prod's six failure modes

| # | Failure mode | Still permitted? |
|---|---|---|
| 1 | Publishing before P5 | **Closed.** execute-waves Do-not line 122; canvas DONOT line 228; parallel-waves P5 refuse "Publish"; facts-complete Do-not line 96. Four surfaces. |
| 2 | Treating a merged PR as done | **Closed.** execute-waves line 123, chew-next line 34, parallel-waves P2b and P8, canvas DONOT line 229 and `R-WORDS`. |
| 3 | Re-running `landing-import` before P2 fixes it | **Closed as a refuse, open as a dead end.** Forbidden everywhere. But no phase owns the repair (A6), so the rail is permanently frozen with no owner. Not a damage risk; a stranded-work risk. |
| 4 | Applying 0005 as drafted | **Half-closed.** The refuse is on every surface. The replacement is on none, and 0005 is unchanged at source. See §4 — this is the Click 2 hazard. |
| 5 | Naming coverage where the honest answer is `not-applicable` | **Closed in the owe table, open in the serve path.** The table is corrected; P3 has no writer and no store (§5 falsifier 8). |
| 6 | Any absence written without a probe | **Text-closed, mechanism-absent.** "Write an absence without a probe" is a Do-not in execute-waves and chew-next. Nothing refuses one. A1's `probed_at` NOT NULL was the mechanism that would have made it fail, and it is the clause that vanished. |

---

## 4. The Click 2 hazard: A1 clause 3, verified at source

This is the finding that most directly bears on the next click. Click 2 is P1 + **alias seed** + P2b.

**0005 is unchanged.** `git show origin/seat/property-ctx-walk-alias-schema:migrations/0005_ctx_alias_setback_easement.sql`:

- `landing_cad_txgio_alias` DDL at lines 5 to 30
- `INSERT INTO landing_setback_registry` at line 74, with `('austin_city_tx','48453','Austin','absence',NULL,...)` at line 81 and the same shape for Kyle (84), Georgetown (86), Round Rock (88), Waco (90)
- `grep -c "'absence'"` → **8**. `grep -c "probed_at"` → **0**.

All four cities are still registered on LDT `origin/main`: `lib/adapters/src/local/setbacks/index.ts` lines 82, 92, 102, 103 map `austin-tx`, `kyle-tx`, `georgetown-tx`, `round-rock-tx` into `SETBACK_TABLES`. The seeds are still false.

**The alias table and the false seeds are in the same migration file.** There is no split, in code or in any plan sentence. Applying the alias DDL as it exists means applying the four false absences.

**And the store target is genuinely broken.** `applyMigrations()` → `connectFactory` → `REQUIRED_ENV = ["FACTORY_DATABASE_URL"]`, so 0005 creates `landing_cad_txgio_alias` on the Factory control store. The job that writes it resolves elsewhere — `src/lib/cad-txgio-alias-persist.mjs:252` calls `resolveTargetStores(env, target)` and inserts into `stores.DATABASE_URL`, and its own docstring says *"--apply writes landing to the target neondb (where the bake reads)."*

Rival considered and rejected at source: could `resolveTargetStores` ever return the Factory store? `src/lib/publish-target-env.mjs:21-30` — `TARGET_VARS` has exactly two targets, `staging` → `STAGING_NEONDB_URL` and `production` → `PRODUCTION_NEONDB_URL`. `FACTORY_DATABASE_URL` is unreachable from that function. The table is created on one store and written on another; the first `--apply` insert errors. A1 clause 3 was correct and nothing has changed.

**Brief open question 5, answered: the plan does not pick.** Neither execute-waves, chew-next, parallel-waves, the rail inventory, nor the canvas says which store the alias lands on. Chew-next's Click 2 exit for the alias lane is *"Seed file exists. Bastrop's seven spellings map to `place_fips`. Self-test on two spellings."* — a file, no store, no consumer. That may keep Click 2 from erroring, but it delivers the defect class this whole thread is about: an artifact that exists, is correct, and is read by nothing. Pick the store before the lane starts, not after the seed file is built.

---

## 5. The twenty falsifiers, scored

| # | Falsifier | Score | Instrument |
|---|---|---|---|
| 1 | Poison schedule still live | **hold** | `grep -rniE "apply 0005\|0005 applied\|re-run landing-import\|Band C\|Band 1 apply\|Start together after this card is approved\|Zero FIPS gets coverage-absence\|county-wide setback\|owe setbacks on the six"` over `_inbox/2026-08-30_ctx*.md` (60+ hits) and the canvas. Every hit is a Do-not, a refuse column, an amendment note, or a review citation. Checked each column header: `parallel_waves.md:34` "Apply 0005 seeds. Six-county well/footprint apply." is under **Refuse**; `chew_next.md:60` is under "Do not pull". Zero imperatives. The grep is non-vacuous (it returned hits). |
| 2 | P0 met is ceremonial | **FAIL** | `git show HEAD:90_operations/OPS-1...` lines 46/49/51 (§1a). Fires on the first disjunct, and independently on the third via the collect WDLL (§2 A5). |
| 3 | A12 only half-done | **FAIL** | `_inbox/2026-08-08_STATEWIDE_layer_inventory.md` lines 29-30, 94-98, tracked, uncorrected, and cited by OPS-1 lines 15 and 46 (§1d). |
| 4 | 72 named as a number only | **FAIL** | `grep -niE "texas_roster_v1\|area threshold\|ST_Intersects\|all_county_fips\|enumerat"` over the six cards → zero hits. 72 appears in five files, is enumerated in none, the roster query is not a named P0 hole, and the Coupland area threshold that decides whether the answer is 71, 72 or 73 travels nowhere. |
| 5 | City selection still inverted | **hold** | `grep -rniE "cedar park\|leander\|taylor"`. The old 9-city set is gone; setbacks are now "four artifacts + probe the other 68 of 72". Cedar Park survives only as an **easement** layer (execute-waves line 40, collect WDLL 54), which is its legitimate role. Taylor appears only as a Williamson gold. Note, not a fail: Leander's 27,397 and Taylor's 8,145 staged zoning districts are named in no card. |
| 6 | Four-state contract absent | **partial FAIL** | execute-waves line 26 carries all four words with "each with its proof". `grep -niE "asOf\|basis"` over execute-waves → **zero hits**. The accuracy rules (`asOf` at evaluation time, `basis` differing between parcels, the forbidden-sentinel list) reach the card only by the reference "S1–S13" in the P5 row. The four words travel; the rules that make them falsifiable do not. |
| 7 | Critical-path drift | **partial FAIL** | Built the four-way phase table (§6). The three order files agree. Two drifts: amendments Phase 0 puts A2 as canon-with-no-code first, while execute-waves/road-to-prod make P3 a served phase after the alias seed starts — an escalation, defensible, undeclared. And "after P2 alias **seed starts**" is not a state anything can check; a lane starting is not observable. P3's unincorporated absence is a city-polygon join that needs no `breadth_*` alias, so the dependency is both spurious for that half and insufficient if any city-keyed absence is written. The card does not separate the halves. |
| 8 | P3 overclaims | **FAIL** | execute-waves P3 (line 69) + item 5: repo named on the canvas (`CTX_LANES` P3 = "LDT / Factory"), serve path named (live Caldwell rural brief). **No writer, no store.** Rail inventory "missing tables" 3 still leaves it as a choice: "manifest cell or a small `rail_absence` table". The prior review established `rail_absence` does not exist in any repo and 0005 does not create it — confirmed unchanged: `git grep rail_absence` on Factory `origin/main` returns nothing. chew-next calls it "Click 4 (cheap, huge)". Cheap and unserved is the original defect class. |
| 9 | Gate still unreadable | **partial FAIL** | "Routing-pin holds" is in P1 on all three order files and item 2 "Held rail refuses a job" is a genuine failing check — that half is absorbed. But `import_ledger` gets no SELECT in any card, and the old gate is still live: `_inbox/2026-08-30_ctx_w3_collect_WDLL.md:61` still reads *"A rail may atomize only when a file in `_inbox/` names all five"*, contradicted by its own item 7 at line 101 ("readable by the job image (not a doc_repo `_inbox/` file)"). Two sentences in one live card give opposite instructions. |
| 10 | Writer job still assumed | **hold** | Rail inventory line 62 states it flatly: "Writer job must exist (allowlist); today `atoms-writer-job.mjs` is CAD-only." Confirmed at source: engine `origin/main` `packages/engine-core/scripts/atoms-writer-job.mjs:48` still hardcodes `"scripts/write-cad-parcel-roll-county.mjs"`. execute-waves P4 "starts: after P2 writers + P3" and the P2 exit gate "One writer other than CAD runs as a job" both read correctly as "jobs do not exist until P2". Click 5 cannot be read as "schedule the existing jobs". |
| 11 | 0005 split unspecified | **FAIL** | §4. `probed_at` zero hits in every card and the canvas; 0005 unchanged at source; store target unpicked. |
| 12 | Placeholder + derived-without-input dropped from P5 | **hold** | `grep -nE "188,103\|65,814"` → both in execute-waves P4 (line 70) and item 6, chew-next Click 5, canvas `CTX_WAVES` P4. Not canvas-only, not review-only. |
| 13 | Zoning stamps and roads homeless | **hold** | execute-waves lines 41-42 and 59, chew-next line 56, canvas `R-ZONE` / `R-ROADS`. A10 clean on all three surfaces. |
| 14 | Canvas leftover schedule | **hold** | `grep -nE "Band C\|Band 1\|Band 0"` over the canvas → **zero hits**. All three damaging actions are in `DONOT`: line 224 (0005), 225 (landing-import), 226 (F-18 missing county), plus 227 (county-wide owe), 228 (publish before P5), 229 (#310). `C-count` appears once as a `CTX_LANES` row whose `starts` is "done 2026-08-26/27" and whose `waits` is "do not re-run" — a record with a refuse, not a schedule. "six-county" → zero hits. The board is clean here; this is the best-absorbed part of the restamp. |
| 15 | Number drift | **hold**, with a caveat | Checked 154,841 / 826,569 / 624,141 / 158,573 / 981,410 / 53,841 / 35,269 / 981,620 / 188,103 / 65,814 / 48,441 / 534,700 across five docs and the canvas. No contradictory value found anywhere. Caveat per the brief's rule 6: these are **copied, not verified**. Their only source is the amendments file, and the operating card's own heading is "Measured owe (**do not re-derive**)" — a load-bearing number set with no named instrument and an explicit instruction not to re-check it. The canvas omits the 981,410 denominator entirely while showing 826,569 as a tile. |
| 16 | Absence without a probe still scheduled | **hold in text, mechanism absent** | No live instruction writes `kind='absence'`. P3's unincorporated `not-applicable` cites the mold (counties do not zone) as its second derivation — legitimate. But the enforcement A1 specified (`probed_at` NOT NULL) is gone, so the Do-not is a sentence. Same shape as falsifier 6. |
| 17 | Publish-before-P5 still reachable | **hold** | facts-complete Do-not line 96 ("Start Wave R before execute-waves P5 and P6 pass"), execute-waves Do-not lines 122 and 125, canvas DONOT 228, `CTX_WAVES` P7 rebake "one publish. Do not start yet." No path from Click 2 language, "this bake", or the facts-complete title reaches Wave R after a W1 merge. |
| 18 | #310 or a PR treated as customer-done | **hold** | execute-waves line 123 and P2b exit; chew-next line 34; parallel-waves P2b and P8 refuses; canvas DONOT 229, `R-WORDS`, `PE-LABEL`, `F-06` note ("Factory #37 and LDT #554 are PRs, not an image"). |
| 19 | Walk cannot fail, plan trusts it anyway | **hold, marginal** | P1's item 2 check is "Walk rejects all-null … violation run + pass run filed" — that gate cannot be satisfied without replacing the predicate. `hasKeyPath` is named by string in execute-waves line 59 and chew-next line 56 as the precondition for Factory #37 walk grades. Marginal because P1's row itself says only "Walk four-state"; naming the predicate in the acceptance item would remove the ambiguity. |
| 20 | Do-not only in one file | **FAIL** | The collect WDLL is still in `_inbox/`, is still `status: amended` rather than superseded, and carries two live sentences that no other card would produce: line 53 (Austin/Kyle/Georgetown/Round Rock as absence rows — §2 A5) and line 61 (the `_inbox/` gate — falsifier 9). A fresh agent will open it; its frontmatter `operator_go` correctly redirects, but its body still specifies the two refused things. |

Score: hold 11, fail 6 (2, 3, 4, 8, 11, 20), partial-fail 3 (6, 7, 9), plus falsifier 16 held in text with the mechanism absent. Zero not-applicable. **No falsifier went unrun.**

---

## 6. Order across the four surfaces

| Phase | execute-waves | chew-next | road-to-prod | canvas `CTX_WAVES` / `CTX_LANES` |
|---|---|---|---|---|
| P0 | now, docs | Click 1, done | first, no code | "now (docs)" / "this session" |
| P1 | after P0, with P2b | Click 2 lane 1 | after P0 | "with P2b" / "next go" |
| P2 alias | "after P1 start", top of P2 | Click 2 lane 2 | "start at the top of P2" | "alias now" / "next go (long pole)" |
| P2 job | after P1 refuse exists | Click 3 | P2 | "after P1 refuse exists" |
| P2b | after P0 | Click 2 lane 3 | parallel, gates customer-done | "never blocks Wave R" / "next go" |
| P3 | after P2 alias seed starts | Click 4 | after P2 | "after alias seed starts" |
| P4 | after P2 writers + P3 | Click 5 | after P3 | "serialize heavy scans" |
| P5–P8 | serial | Clicks 6-8 | serial | serial |

The four agree. The only cross-authority divergence is the amendments' Phase 0 (A2 as canon, no code, first) versus P3 as a served phase after the alias seed — an undeclared escalation, not a contradiction. Critical path is identical in execute-waves (line 51), road-to-prod (line 292) and the canvas footer text (line 764), and all three omit P3 from it consistently.

**Single operating card:** `_inbox/2026-08-30_ctx_execute_waves_WDLL.md`. Every other file names it as such — chew-next line 14, parallel-waves line 15, collect WDLL line 19 and `operator_go`, facts-complete line 29, canvas lines 734, 892, 1651. That question is settled and needs no amendment.

---

## 7. Execute-waves acceptance items 1 to 10, graded for whether they can fail

| # | Item | Grade | Why |
|---|---|---|---|
| 1 | P0 landed | **contradiction** | Graded met; false against `HEAD` (§1). Must return to `[ ]`. |
| 2 | P1 controls fail both ways | **gate-complete** | "Walk rejects all-null. Held rail refuses a job. Missing county refuses F-18" with check "violation run + pass run filed". Three named violations, both directions, filed artifact. The strongest item on the card. |
| 3 | P2 one non-CAD writer job | **gate-complete** | "Cloud Run execution on a named FIPS, refuse on omitted county." Two observable outcomes, one of them a refusal. |
| 4 | Alias table started | **partial** | "row count > 0 and a self-test on two spellings" is gradeable and can fail. But "row count" in **which store** is unanswered (§4), and "seed file exists" and "row count" are different artifacts. Name the store. |
| 5 | P3 served | **hole** | "check: live Caldwell rural brief" is a real probe, but no writer and no store produce the rows it would read (falsifier 8). The check can only be run after unnamed work. |
| 6 | P4 rails apply-or-absence | **partial** | "five-field record per rail; P4 job refuses without it" is the right shape — but where the record lives is unresolved and the collect WDLL still says `_inbox/` (falsifier 9). A refusal keyed to an unlocatable artifact cannot be built. |
| 7 | P5 scrub both directions | **gate-complete** | "poison fails, gold passes, every family." Both directions, all thirteen. |
| 8 | P6 six staging pass | **gate-complete** | "walkVerdict pass + empty body diff." The determinism diff is a genuine two-derivation check. |
| 9 | P7 Wave R | **partial** | "six production close lines" is countable; "GRADE LOG. Golds as parent item 9" delegates to facts-complete item 9, which does carry the golds and the refusal fixtures. Complete by reference, thin standing alone. |
| 10 | P8 prove | **partial** | "post-R JSON + bundle marker on PE" is checkable. "Scrub scheduled" has no check — road-to-prod P8.4 says without it P5 certifies a moment, and the schedule's existence is asserted, not tested. |

**4 gate-complete (2, 3, 7, 8), 4 partial (4, 6, 9, 10), 1 hole (5), 1 contradiction (1).**

Against the parent card the prior review scored **0 gate-complete / 3 partial / 7 no-gate**, this card is **substantially better**: it has four items that name a violation and a pass and could be run tomorrow, where the parent had none. That is the clearest evidence the review was absorbed rather than merely acknowledged. The remaining weakness is concentrated exactly where A1, A3 and A7 were left partial — items 4, 5 and 6, all three downstream of a store or an artifact location the plan declines to pick.

---

## 8. Canvas versus cards

The board is in better shape than the cards on the poison list and worse on freshness.

Matches: every load-bearing number (154,841 / 826,569 / 53,841 / 35,269 / 981,620 / 188,103 / 65,814 / 534,700) matches the operating card. `CTX_WAVES` P0-P8 matches the card's phase table. `CTX_LANES` matches chew-next's Click 2 and 3. `DONOT` carries all three damaging actions plus county-wide owe, publish-before-P5 and #310. Zero Band C / Band 1 / Band 0. Critical path line 764 matches line 51 of the card.

Mismatches, in severity order:

1. **`probed_at` and the 0005 split are absent from the board too** (zero hits). The board says "No 0005 absence seed" on `CTX_LANES` P4-setback (line 519) — one third of A1, and the third that is not Click 2's problem.
2. **F-10 CP3 criterion 5 asserts a running job.** Line 1199: `["5", "EXECUTING", "factory-f10-cad-loop-scllr since 05:58:01Z ..."]` with tone "warning". This contradicts the `F-10` row ("IDLE as a 254 loop"), the overview card ("scllr is not running"), `LEFT` item `A010` ("IDLE. Nothing executing"), and every "Do not restart scllr" on the board. A stale cell asserting an execution is exactly the kind of thing a fresh agent quotes.
3. **`F-18` carries `status: "done"`** (line 85) while `DONOT` line 226 and every card forbid running it until it refuses a missing county. A reader filtering the F view by status sees a finished row for a rail under an active refuse. Add the refuse to the note.
4. **The denominator is missing.** The Land view shows 826,569 as a tile with no 981,410 anywhere on the board (`grep` → 0 hits). An absolute presented without its denominator is the "84%" problem in reverse.
5. **`SNAPSHOT` and footer say "P0 NOW"** and the overview pill reads "P0 now", consistent with the card — but consistent with a P0 that is not committed. Once §1 is fixed the board is correct; today the board asserts a landed P0 the repository does not contain.

No mismatch found in the Land view Do-not set, the residue `next` column, `LEFT`, or the wave table. Falsifier 14 held on every clause.

---

## 9. Amendments required before Click 2

**B1. Commit the program, then re-grade item 1.** Eight `_inbox/` artifacts and `_decisions/2026-08-30_ctx_complete_or_absent.md` are untracked; OPS-1's A12 correction is uncommitted. Reason: P0's exit gate is defined over tracked canon, the A-028 decision the whole schedule rests on is not in the repository, and a tracked file already cites five untracked ones. This is the cheapest amendment on the list and the one that makes every other grade meaningful.

**B2. Extend A12 to `_inbox/2026-08-08_STATEWIDE_layer_inventory.md`.** OPS-1 lines 15 and 46 route the reader there for store truth and it still says "No adapter found" for both boundary tables and calls city limits "a pure candidate, not partially built." Reason: correcting the citation and not the cited leaves the false impossibility one hop away, which is the failure mode A12 was written to end.

**B3. Pick the alias store and say what replaces 0005, in the operating card, before the alias lane starts.** Name all three of A1's clauses: the four seeds dropped, `probed_at` NOT NULL on absence rows, and the DDL target. Reason: verified at source — 0005 creates `landing_cad_txgio_alias` on `FACTORY_DATABASE_URL` while `cad-txgio-alias-persist.mjs:252` inserts into `resolveTargetStores(...).DATABASE_URL`, which `TARGET_VARS` restricts to `STAGING_NEONDB_URL` / `PRODUCTION_NEONDB_URL`. The table and its writer are on stores that cannot be the same. Click 2 starts this lane.

**B4. Supersede the collect WDLL, or strike its two live sentences.** Line 53 defines collect-complete with the four false absence rows; line 61 defines the gate as a file in `_inbox/`. Both are the exact things the review refused, both are contradicted by that card's own later items, and the card is still `status: amended` in the inbox a fresh agent reads. Flip it to `superseded` with a one-line pointer, or strike the two sentences.

**B5. Give P3 a store and a writer, or re-label it.** It is called cheap and huge and converts 826,569 parcels; it has a serve-path probe and no producer, and `rail_absence` exists in no repo. Reason: "cheap and unserved" is the defect class this thread exists to end, and P3 is currently the largest instance of it in the plan.

Two smaller items, not blocking Click 2 but owed before P4: give `landing-import`'s repair a phase (A6 currently names a precondition no phase produces), and put the four-state **proof rules** — `asOf` at evaluation time, `basis` varying per parcel — into the card's "Done looks like" rather than leaving them to an S1–S13 reference.

---

## 10. What I violated looking for a miss

Per the brief's closing instruction, and because a review that only agrees is not a review.

**Pre-registered, then run.** (a) *P0 will fail only on collect-WDLL residue* — the residue is real (B4) but P0 failed on something I did not predict, tracking and the committed OPS-1, which is worse than my prediction. (b) *The canvas will still carry Band C somewhere* — it does not; `grep -nE "Band C|Band 1|Band 0"` returns zero. I was wrong and the board earns that. (c) *The three order files will disagree* — they do not; the four-way table in §6 is consistent. I built the table expecting a finding and did not get one. (d) *`probed_at` will appear in at least one card* — it appears in none; I confirmed the grep was not vacuous by checking it returns hits in `texas_roster_v1.json` and the amendments before trusting the zero.

**Rivals considered and rejected at source.** For the alias split, the rival was that `resolveTargetStores` might return the Factory store under some target; rejected by reading `TARGET_VARS` (`publish-target-env.mjs:21-30`), which enumerates two targets and neither reads `FACTORY_DATABASE_URL`. For the untracked finding, the rival was that the files might be staged rather than absent; rejected by two independent instruments — `git ls-files --error-unmatch` per file, and `git show HEAD:` on OPS-1 returning the old text, which is a different derivation of the same fact. For the poison list, the rival was that a hit under a "Refuse" column header might still read as an instruction; I checked each hit's column header rather than the line alone, per the brief.

**What would have counted as a miss and did not occur.** If I had graded P0 met on the planner's citation without running `git ls-files`, or accepted "Do not apply 0005" as absorption of A1 without grepping `probed_at` and reading 0005 at the ref, or scored falsifier 14 fail on the `C-count` lane row without reading its `starts` and `waits` columns. The first of those is the one that nearly happened: the working-tree OPS-1 reads correctly, and reading only the working tree would have produced "P0 met, confirmed."

**Not done.** No fetch, no `--apply`, no migrate, no bake, no publish, no deploy, no job start, no store connection, no commit, no push. No edit to any plan, the canvas, OPS-1, `_STATE.md`, or MEMORY.md. No subagent. The only file written is this one.

**UNMEASURED.** Whether `import_ledger` actually holds the nine clean two-counts dated 2026-08-26/27 — that is a live store read the verification clause forbids; every card states it and none cites a query output. Whether `city_manifest.payload` still lacks `all_county_fips`. Whether the six measured owe figures reproduce; the operating card forbids re-deriving them and names no instrument.

---

```
leave_behind:
  - item: _inbox/2026-08-08_STATEWIDE_layer_inventory.md still asserts both boundary tables have no adapter and zero rows, and OPS-1 cites it as store truth
    owner: integration
    plan_row: F-01 (A12 completion)
  - item: landing-import repair (county scope, delta count, indexes on 0001_init.sql, deployed job) is a precondition named in five Do-nots and owned by no phase
    owner: planner
    plan_row: F-01
  - item: rail_absence store choice for P3 — manifest cell or table; exists in no repo today
    owner: property
    plan_row: F-06
  - item: the 72 cities are a number in five files and an enumeration in none; roster query and ST_Intersects area threshold (Coupland phantom) unwritten
    owner: property
    plan_row: F-11
  - item: canvas F-10 CP3 criterion 5 cell asserts factory-f10-cad-loop-scllr EXECUTING, contradicting four other places on the same board
    owner: integration
    plan_row: F-10 (board hygiene)
  - item: measured-owe figures carry no named instrument and the card forbids re-derivation
    owner: planner
    plan_row: F-01
```
