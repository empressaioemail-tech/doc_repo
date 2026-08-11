---
title: Dispatch pack — Phase 0 (clean state) + Phase 1 (truth and declaration)
date: 2026-08-11
status: active-dispatch-pack
owner: doc_repo planner
purpose: Copy-paste dispatch blocks for Cursor native planning agents. Each block is self-contained. The recipient is a PLANNING agent that spawns workers, adversarially reviews their work, applies fixes, then reports.
---

# Dispatch pack — Phase 0 + Phase 1

**How to use.** Each `### DISPATCH` block below is copy-paste ready. Hand one block to one Cursor planning agent. Blocks marked PARALLEL may all run at once. Blocks marked SERIAL must complete in the order given.

**Recipient model.** Every block addresses a PLANNING agent, not a worker. The planning agent spawns its own workers, adversarially reviews their output at two checkpoints, applies fixes itself, and only then writes the close artifact.

**Slot discipline.** No block in Phase 0 or Phase 1 takes the atoms bulk-writer slot. Any block that would write to the atoms table is Phase 3 and is not in this pack.

---

## PHASE 0 — clean state (SERIAL, blocks everything else)

### DISPATCH P0.1 — cherry-pick the parcel-node verify fix onto main

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: every command must terminate on its own. Use git, gh (never `gh run watch`
or `--watch`), grep, and one-shot builds/tests. No dev server, no tail -f, no watch.

CLOSE ARTIFACT (required, machine-checkable): write exactly
  P:\doc_repo\_inbox\2026-08-11_P0-1_verify_fix_to_main_close.json
{"runAt":"<ISO8601>","branchCreated":"...","commitCherryPicked":"81344ec","filesChanged":["..."],
 "prNumber":<int>,"ciConclusionString":"...","merged":true|false,"mainHeadAfter":"...",
 "atomDidInPresentOnMain":true|false,"cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The parcel-node write-then-verify PRIMARY KEY fix is NOT on hauska-engine origin/main. It is
safe on `origin/fix/verify-by-atom-did` at commit 81344ec, but no PR was ever opened and main does not
carry it. The four SIBLING writers got the identical fix via PRs #303/#304, so MAIN LOOKS FIXED. It is
not. Verified by the planner 2026-08-11:
  git -C P:/hauska-engine show origin/main:packages/engine-core/scripts/write-parcel-node-county.mjs | grep -c "atom_did IN"
  -> 0
Without this, the next sweep re-runs the write-then-verify as a full-table seq scan: measured 229,382 ms
vs 373 ms per 5,000-id batch on the live 16.2M-row / 29 GB atoms table.

DO EXACTLY THIS:
1. `git -C P:/hauska-engine fetch origin`. Record `git rev-parse origin/main`.
2. Create a NEW branch FROM origin/main. Do NOT push `sweep/fast-write` and do NOT fast-forward it over
   main — it is 4 commits BEHIND main and its diff-vs-main spuriously shows a 151-line deletion of
   packages/atoms/src/__tests__/cp2-refute.test.ts. That deletion is a stale-base artifact, NOT part of
   the commit. Confirm with `git show --stat 81344ec` — it must touch exactly ONE file,
   packages/engine-core/scripts/write-parcel-node-county.mjs, +24/-5.
3. Cherry-pick 81344ec onto the new branch. Resolve nothing silently; if a conflict appears, STOP and
   report it rather than guessing.
4. Verify locally: the file must contain `WHERE atom_did IN` and must contain ZERO occurrences of
   `body->>'atomDid' IN`. Run `pnpm -w typecheck` (exit-bounded).
5. Open a PR. Read CI with `gh pr checks <n>` (NOT --watch). MERGE ONLY IF the conclusion STRING is
   "success" — never a green-looking UI, never a zero exit code.
6. After merge, re-verify on origin/main: the grep for `atom_did IN` must now return >= 1.

CP1 (before merge): pre-register the expected diff — exactly one file, +24/-5, and the two grep counts
you expect after merge. CP2 (after merge): measure and compare to CP1; explain any difference rather
than restating the expectation. A CP2 that merely repeats CP1 is a failed checkpoint.

ADVERSARIAL: assume the cherry-pick silently brought extra changes. Diff the merged main against the
pre-merge main and confirm ONLY the intended file moved. Report what you checked, not what you assume.
```

---

### DISPATCH P0.2 — return working trees to a sane base

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: git and grep only, all exit-bounded. No watch, no server.

RUN THIS ONLY AFTER P0.1 HAS MERGED.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P0-2_working_trees_close.json
{"runAt":"...","repos":[{"path":"...","branchBefore":"...","branchAfter":"...","behindBefore":<int>,
 "behindAfter":<int>,"dirtyRealBefore":<int>,"dirtyRealAfter":<int>,"phantomCrlfCount":<int>}],
 "cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. Two checkouts are on stale/divergent bases and every build lane that starts in them starts
wrong.

1. P:\hauska-engine is on `sweep/fast-write`, ahead 1 / behind 4. After P0.1 merged, its one unique
   commit is on main. Checkout main and pull. Confirm `git status -sb` reads clean against origin/main.

2. P:\legacy-design-tools main is 19 commits BEHIND origin/main. `git pull`.
   CRITICAL — DO NOT COMMIT THE APPARENT DIRT FIRST. The tree LOOKS like it holds lost work
   (lib/cad-ingest gdal.ts +276/-65, a +91 test, two STAGED migration SQLs). It is an ILLUSION: local
   main is diffing against a 19-commit-old fossil. Verify before touching anything:
     git -C P:/legacy-design-tools diff --stat origin/main -- <each file>   # expect EMPTY
     git -C P:/legacy-design-tools ls-tree origin/main <migration paths>    # expect BOTH present
   Committing these would recreate the exact migration collision that upstream 45cf0e8b was written to
   prevent. Pull; do not commit.

3. CRLF phantom-dirty: for every remaining dirty file in any repo, run `git diff --stat -- <file>`. If
   the diff is empty or whitespace-only it is autocrlf noise. Do NOT commit it to "clean up". Count and
   report them; change nothing.

CP1: pre-register, per repo, the expected branch/behind/dirty numbers after the operation. CP2: measure
and explain deltas. If a number differs from CP1, investigate before writing the artifact.

ADVERSARIAL: after pulling ldt, confirm nothing was lost — compare the working-tree content of the
three "dirty" files against origin/main byte-for-byte and state the result explicitly.
```

---

## PHASE 1 — truth and declaration (ALL PARALLEL after Phase 0)

### DISPATCH P1.1 — fix the depth-rail satisfaction predicate

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot SQL, one-shot curl, git, grep, exit-bounded test runs. No watch,
no dev server. You may READ any database. You may NOT write to the atoms table (bulk-writer slot).

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-1_depth_predicate_close.json
{"runAt":"...","predicateBefore":"...","predicateAfter":"...","file":"file:line",
 "zoningSatisfiedBefore":19,"zoningSatisfiedAfter":<int>,"perCountyAfter":[{"fips":"...","pct":<float>,"state":"..."}],
 "otherRailsAffected":[{"rail":"...","before":<int>,"after":<int>}],
 "prNumber":<int>,"ciConclusionString":"...","merged":true|false,"cp1":{...},"cp2":{...},
 "adversarialFindings":["..."]}

MISSION. The county ledger reports 19 satisfied zoning cells. Only ONE is real. Verified live by the
planner 2026-08-11 from GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger :
  zoning satisfied-present = 19
  of those, honestCoveragePct == 0.00 with source null and lastVerifiedAt null = 15 counties
  partial: 48491 Williamson 33.98%, 48091 Colorado 25.82%, 48209 Hays 3.61%
  genuinely satisfied: 48021 Bastrop 99.77% (isPartial=false, source=deterministic)
Cause: zoning satisfaction is driven by `atomFamilyState == 'present'` — ONE zoning atom anywhere in a
county flips the whole county green. That predicate is defensible for statewide-uniform rails and WRONG
for jurisdiction-DEPTH rails (zoning, cad, envelope, landuse, owner).

FIX. Depth-rail cells must gate on COVERAGE against the rail threshold, not on atom-family presence.
Find the predicate (start in legacy-design-tools `artifacts/api-server/src/routes/countyLedger.ts` and
`lib/db/src/schema/countyRailDimension.ts`; the rail declaration carries a `kind` field — use it or add
an explicit rail CLASS rather than hardcoding a list of rail keys). Statewide-uniform rail behavior must
not change.

HONEST-ABSENCE IS NOT A REGRESSION. Large parts of Texas are unincorporated and legitimately have NO
zoning. Such a county must be able to reach satisfied as a PROVENANCED HONEST ABSENCE — never as 95%
coverage of something that does not exist, and never as a bare green cell with nothing behind it. If the
absence path does not exist for depth rails, say so explicitly in the artifact; do not fabricate one.

EXPECT THE NUMBER TO GO DOWN. Zoning satisfied will drop from 19 toward 1. THAT IS THE POINT — you are
removing a false claim, not creating a regression. Do not tune the fix to preserve 19. Report what IS.

CP1 (before merge): pre-register the exact post-fix satisfied count per depth rail and name every county
you expect to change state, from the live ledger data. CP2 (after deploy): measure live and reconcile
every difference from CP1 individually. "Close enough" is a failed checkpoint.

ADVERSARIAL: prove you did not change statewide-uniform rail behavior — geometry must still read 141
satisfied-present / 113 not-yet after your change. If it moved, your predicate is too broad.

Merge only on CI conclusion string "success". After merge the cortex-api deploy is planner-owned — the
Artifact Registry tags are FULL 40-char SHAs (`git rev-parse origin/main`); an 8-char prefix fails with
"Image not found" and burns a run. New revision != serving; verify the serving revision after shifting
traffic.
```

---

### DISPATCH P1.2 — fix the geometry rail denominator (worth 9 cells)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot SQL, one-shot curl, git, grep, exit-bounded tests. No watch, no
server. READ any database; do NOT write to the atoms table.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-2_geometry_denominator_close.json
{"runAt":"...","denominatorBefore":"...","denominatorAfter":"...","file":"file:line",
 "countiesPromoted":[{"fips":"...","name":"...","pctBefore":<float>,"pctAfter":<float>}],
 "geometrySatisfiedBefore":141,"geometrySatisfiedAfter":<int>,
 "ectorExcluded":true,"cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The geometry rail divides an ACCOUNT-cardinality numerator by a FEATURE-cardinality
denominator. The parcel-node planner deliberately folds every txgio_parcel feature sharing one prop_id
into ONE atom (`packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:445-455`,
`foldedExtraFeatures`) per the account-identity ruling — Tarrant `A 36-1` is 133 leasehold accounts on
ONE polygon. The scorer's denominator is `count(DISTINCT feature_index)`. So any county where an account
spans multiple features CAN NEVER REACH 100%, however complete its data.

Planner-verified 2026-08-11 — `foldedExtraFeatures` equals the coverage shortfall TO THE ROW in all ten:
  48095 Concho    8,034 feat / 7,629 atoms / 94.96% / short 405   = folded 405
  48061 Cameron 185,062 / 175,676 / 94.93% / short 9,386 = folded 9,386
  48315 Marion 19,841 / 18,821 / 94.86% / short 1,020 = folded 1,020
  48459 Upshur 30,293 / 28,723 / 94.82% / short 1,570 = folded 1,570
  48149 Fayette 23,882 / 22,642 / 94.81% / short 1,240 = folded 1,240
  48287 Lee 16,090 / 15,236 / 94.69% / short 854 = folded 854
  48265 Kerr 36,913 / 34,939 / 94.65% / short 1,974 = folded 1,974
  48481 Wharton 31,888 / 30,162 / 94.59% / short 1,726 = folded 1,726
  48013 Atascosa 36,791 / 34,707 / 94.34% / short 2,084 = folded 2,084
  48137 Edwards 9,948 / 9,369 / 94.18% / short 579 = folded 579
`atoms + shortfall == features` closes exactly in all ten. These counties are FULLY WRITTEN AND
MIS-SCORED. The ledger currently UNDERSTATES real coverage.

FIX — IN THE SCORER, NEVER IN THE WRITER. Changing the writer to one-atom-per-feature would break the
account-identity ruling and is FORBIDDEN. Change the geometry denominator to features ACCOUNTED FOR by
written atoms: `count(distinct feature_index) - foldedExtraFeatures`, equivalently
`count(distinct usable prop_id) + count(keyless features)` — which is the planner's own `wouldWriteTotal`.
The planner ALREADY computes and returns this (`counts.foldedExtraFeatures`, lines 132 and 452-453) and
the writer already emits it in its summary. It needs PERSISTING and USING, not computing.

EXCLUDE ECTOR 48135. It is a DIFFERENT defect and this fix must not paper over it: Ector's
txgio_parcel.prop_id is not an account id at all — values are numeric quantities ('0.00000000' x2,974,
'1576.00000000' x1,618), an acreage/value column mis-mapped into the prop_id slot at ingest. 75,891
features / 75,464 distinct geo_id / only 3,791 distinct prop_id -> 3,791 atoms -> 5.00%. Route it to the
separate Ector re-key lane. Do NOT let the denominator change make Ector look satisfied.

Note also: `isUsableKeyToken` (plan-county-parcel-nodes.ts:142-149) tests `/^0+$/` on the trimmed string,
which does NOT match "0.00000000" — the decimal defeats it. Report this; fixing it belongs to the Ector
lane, not here.

CP1: pre-register exactly which counties promote to satisfied and the expected new geometry satisfied
count. CP2: measure live and reconcile each. Expect +9 (the band) — if you get more, find out which
county you did not predict and explain it before writing the artifact.

ADVERSARIAL: confirm no county DROPS state as a result. A denominator that shrinks can only raise a
percentage; if any county fell, your change did something else too.
```

---

### DISPATCH P1.3 — derive hasWriter and add a coverage-capability probe (the structural fix)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot SQL/curl, git, grep, exit-bounded tests. No watch, no server.
Do NOT write to the atoms table.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-3_derived_haswriter_close.json
{"runAt":"...","hasWriterNowDerivedFrom":"...","capabilityProbe":{"implemented":true|false,"file":"file:line","semantics":"..."},
 "railStateChanges":[{"rail":"...","before":"...","after":"...","reason":"..."}],
 "cellsMovedOutOfNoAtom":<int>,"cellsMovedOutOfNoWriter":<int>,
 "prNumber":<int>,"ciConclusionString":"...","merged":true|false,"cp1":{...},"cp2":{...},
 "adversarialFindings":["..."]}

MISSION — THE STRUCTURAL FIX. `county_rail.has_writer` and `atomFamilyState` are HAND-DECLARED columns,
not derived from code. Migration 0068:20-26 says so outright: updating the column "does not create an
atom or wire a writer." `countyLedger.ts:198` gives `has_writer=false` ABSOLUTE precedence, so a stale
declaration silently overrides real engine state across all 254 cells of a rail.

Verified drift 2026-08-11, IN BOTH DIRECTIONS:
- `rail-corridor` declares atomFamilyState "missing" / hasWriter false. Reality: `rail-corridor-fact` IS
  registered in PROPERTY_ENTITY_TYPES on engine origin/main, has a working writer
  (`write-rail-corridor-fact-county.mjs`) carrying the verify fix at :308, and demonstrated non-zero
  present yield on TWO counties (Bastrop 21 near, Dallas 16 near per 200-parcel sample). 254 cells are
  reported as unstarted work that is actually built-but-unapplied.
- `footprint` declares no-writer — RIGHT about the outcome, WRONG about the reason. Seeded at contract
  v1.12.0/unpublished, never refreshed after the writer shipped.

THE DEEPER PROBLEM THIS MUST SOLVE: nothing distinguishes REGISTERED from CAN-PRODUCE-COVERAGE. All five
2026-08 rails are registered, so a manifest driven off registration alone shows five green rails when one
covers a single county (well-fact's source was a Harris-only mirror, 0.92% of Texas), one cannot finish a
metro county (footprint is O(footprints x parcels)), and one cannot verify its own writes
(special-district has no readback at all).

BUILD TWO THINGS:
1. DERIVE `hasWriter` from engine truth — the rail's atom type being present in PROPERTY_ENTITY_TYPES at
   origin/main AND a writer script existing for it. Never a hand-edited boolean.
2. A COVERAGE-CAPABILITY PROBE: for each rail, the maximum number of Texas counties its SOURCE could
   light. Well-fact on the old source = 1. Owner-fact = 15 (bounded by cad_property). Rail-corridor = 196
   (bounded by txgio_parcel). Surface it so a rail cannot read as ready when its source covers one county.

DO NOT FLIP footprint's hasWriter TO TRUE AS A COSMETIC FIX. That swaps an honest red for a dishonest
green. The honest state is atomFamilyState=present + hasWriter=true + 0% coverage, which renders
`not-yet`. Getting this distinction right is the whole point of the dispatch.

FAIL CLOSED. This repo's measured base rate: hook-shaped controls that fail closed work 1-for-1;
protocol-step-shaped controls 0-for-3. If the derivation cannot determine a rail's state, it must produce
the PESSIMISTIC state and say why — never an optimistic default. A control that cannot fail is not a
control.

CP1: pre-register every rail whose declared state you expect to change and the exact cell-count delta.
CP2: measure live and reconcile individually.

ADVERSARIAL: for each rail you move OUT of no-atom/no-writer, prove the writer actually exists and is
registered — cite file:line on origin/main. A rail moved on the strength of the declaration alone is
exactly the defect you were sent to fix.

Merge on CI string "success". cortex-api deploy is planner-owned; use the full 40-char SHA; verify the
SERVING revision after traffic shift.
```

---

### DISPATCH P1.4 — resolve the MUD rail (254 cells, ruling not build)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot SQL/curl, git, grep. No watch, no server. Do NOT write to the atoms
table. This dispatch produces a RECOMMENDATION plus a declaration change — it does not run a writer.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-4_mud_rail_resolution_close.json
{"runAt":"...","sameUniverse":true|false,"tceqVsComptrollerEvidence":"...",
 "recommendation":"subcategorize-inside-special-district"|"keep-separate-rail"|"retire-mud-rail",
 "reasoning":"...","cellsResolved":<int>,"declarationChange":"...","prNumber":<int>,
 "ciConclusionString":"...","cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The `mud` rail (ordinal 14) is NOT unbuilt — it appears to be the SAME SUBJECT as
`special-district-fact`, built twice under two names. Verified 2026-08-11:

Declaration says: displayName "MUD / special districts", atomFamilyState "missing", hasWriter false,
atomFamilyRef null, declaredSource "TX Comptroller special-district registry", notes "W4 HELD".

Reality: `tx_special_district` is ALREADY LOADED with 2,775 polygons from TCEQ WaterDistricts, byType =
MUD 1888, WCID 250, MMD 197, FWSD 84, SUD 82, OTH 74, DD 45, LID 35, WID 33, ID 29, RA 29, ND 23, RD 2,
SWCD 1, GCD 1, MD 1, NYD 1. `special-district-fact` is registered in PROPERTY_ENTITY_TYPES with a working
county writer and demonstrated dry-run yield (Harris 1,523,291 in-district; Bastrop 10,932).

THE R1 SPLIT RULE GOVERNS: split where SOURCE and GEOMETRY differ; SUBCATEGORIZE via atom body fields
where only the ATTRIBUTE differs. MUD is a TCEQ district TYPE value — an attribute of the same polygon
source — which argues it belongs INSIDE the special-district cell, not as its own rail.

ESTABLISH BEFORE RECOMMENDING — do not assume they are the same universe:
1. The declaration names the COMPTROLLER registry; the loaded table came from TCEQ. Are these the same
   universe of districts? Evidence that they may NOT reconcile: the Comptroller tax-rate join matched
   ZERO rows (`rateEnrichedCount: 0` on both dry-run counties). Determine whether the Comptroller
   registry carries districts TCEQ does not (or vice versa), and quantify.
2. If TCEQ is a strict superset for tax-relevant districts, recommend subcategorize-and-retire. If the
   Comptroller carries a materially different set, recommend keeping a distinct rail and say what it
   would need.

THEN: implement the declaration change for whichever path you recommend, so the 254 `no-atom` cells stop
misreporting. If you recommend retiring the rail, the denominator drops 3,556 -> 3,302 and EVERY
completeness figure changes — say so explicitly in the artifact and make sure `COUNTY_RAIL_COUNT`
derivation handles it (it is `COUNTY_RAIL_DECLARATION.length`, so it follows automatically — verify).

CAUTION: `totalRails` reads the TS constant while `totalCells` counts rows from a SQL CROSS JOIN on the
`county_rail` TABLE. They are independent sources. After any declaration change you MUST run
`countyRailRefreshCli` or the two will disagree and the rollup will divide by a rail count the numerator
cannot reach. Nothing asserts `totalCells === totalCounties * totalRails` — consider adding that
assertion as part of this work.

CP1: pre-register the recommendation and expected cell/denominator deltas BEFORE running the reconcile
queries. CP2: state whether the evidence CONFIRMED or REFUTED your CP1 recommendation. A CP2 that never
had the chance to refute CP1 is a failed checkpoint.

ADVERSARIAL: argue the OPPOSITE case in writing before settling. If MUD stays a separate rail, what
would justify it? Record that argument and why you rejected it.
```

---

### DISPATCH P1.5 — port the special-district readback verify

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: git, grep, exit-bounded typecheck/tests, and a DRY-RUN only. You may NOT run
`--apply`; the atoms bulk-writer slot is not yours. No watch, no server.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-5_special_district_verify_close.json
{"runAt":"...","verifyBefore":"...","verifyAfter":"...","file":"file:line",
 "atomDidInPresent":true|false,"siblingTemplateUsed":"...","dryRunCounty":"...","dryRunResult":{...},
 "prNumber":<int>,"ciConclusionString":"...","merged":true|false,"cp1":{...},"cp2":{...},
 "adversarialFindings":["..."]}

MISSION. `packages/engine-core/scripts/write-special-district-fact-county.mjs` is the ONLY county fact
writer with NO STORE READBACK. Verified by the planner 2026-08-11 on engine origin/main: grepping
`atom_did IN` returns hits at owner-fact:383, well-fact:307, rail-corridor-fact:308,
building-footprint:347 — and ZERO in special-district. What its apply path does at :302-307 is:

    await handle.storage.writePropertyAtomsBatch(slice);
    for (const atom of slice) {
      const verdict = verifyStoredSpecialDistrictFactAtom(atom, {...});   // `atom` = the IN-MEMORY object
      if (!verdict.ok) summary.verifyFailures += 1;
    }

`verifyStoredSpecialDistrictFactAtom` only runs SPECIAL_DISTRICT_FACT_SCHEMA.safeParse plus field
comparisons on the value passed in — it never opens a connection. So `verifyFailures` is STRUCTURALLY
INCAPABLE of detecting a failed write. This is more dangerous than the old broken `body->>'atomDid'`
form: that one was slow but REAL; this one is fast and FICTIONAL. It was silently missed by the PK-fix
sweep (PRs #303/#304), and special-district is the LARGEST planned apply of the five rails (6,312,715
planned atoms on Harris alone).

FIX. Port the readback block from a sibling — `write-owner-fact-county.mjs:375-406` is the cleanest
template. Look rows up by the PRIMARY KEY `atom_did`, NEVER by the `body->>'atomDid'` jsonb expression:
no index serves the expression, so every batch seq-scans the whole atoms table (measured 229,382 ms vs
373 ms per 5,000-id batch at 16.2M rows).

PRESCRIBE THE INVARIANT, NOT THE RECONSTRUCTION. Use the value storage actually persists (the same value
that goes into the `entity_id` column). Do NOT rebuild the did from parts — `entityId` shape is NOT
uniform across writers (owner-fact is `${parcelNodeId}:${taxYear}`, well-fact is
`${parcelNodeId}:${wellKey}`, building-footprint is `${parcelNodeId}:footprint:${footprintId}`, and
rail-corridor-fact has no entityIdOf helper at all). A prior brief made this exact mistake and would have
matched zero rows.

VERIFY WITHOUT APPLYING: run a DRY-RUN on one county and confirm the code path compiles and the verify
block is reachable. Run `pnpm -w typecheck`. Verify the merge with tsc AND a test-FILE count, never a
green pass total — a file that fails to transform contributes zero tests while the suite still reports
everything else passing.

CP1: pre-register the exact diff shape and the grep counts you expect after the change. CP2: measure and
reconcile.

ADVERSARIAL: prove the new verify can actually FAIL. Construct or describe a concrete case where an atom
is not readable back and show the code would catch it. A verify that cannot fail is what you are
replacing — do not ship another one.
```

---

### DISPATCH P1.6 — amend the launch gate to be gradable

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot curl, git, grep, read. No watch, no server. This is a DOC dispatch —
you write canonical docs in P:\doc_repo. You may NOT change code and may NOT change any rail declaration.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P1-6_gate_amendment_close.json
{"runAt":"...","amendmentPath":"...","criteriaBefore":[...],"criteriaAfter":[...],
 "denominatorRule":"...","gradableCard":"...","docsUpdated":[{"path":"...","change":"..."}],
 "staleClaimsCorrected":[{"path":"...","line":<int>,"was":"...","now":"..."}],
 "cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The launch gate (`_decisions/2026-08-09_texas_flush_launch_gate.md`) is not gradable as written.
Operator ruling 2026-08-11: it must cover ALL cells, ALL rails, and EVERY state a cell can be in. "12 is
not the benchmark anymore."

What is wrong today, verified live by the planner 2026-08-11:
- The gate says "all 12 rails" and "3,048 ledger cells". Live is 14 rails / 3,556 cells. The R1 rail
  split (rrc -> rrc-wells + rrc-pipelines, plus rail-corridor, mud to ordinal 14) landed AFTER the gate
  was written, so the gate does not mention four of the rails it must govern.
- Criterion 3 says "No cell left in `no-writer`" (762 cells today) but NEVER MENTIONS `no-atom`
  (1,016 more). Live distribution: not-yet 1,618 / no-writer 762 / no-atom 1,016 / satisfied 160.
  1,778 of 3,556 cells — exactly half the grid — sit in states the gate does not address.
- OPS-15 line 187 PREDICTED this denominator break in writing the day before it happened. The split was
  ruled anyway (correctly) and the gate was never amended.

WRITE THE AMENDMENT as a new decision record in `_decisions/` (do not silently edit the 2026-08-09 doc;
follow the repo convention — supersede/amend explicitly and link both ways). It must:
1. Derive the denominator from the rail declaration, never a literal, so it can never go stale this way
   again. State the invariant `totalCells === totalCounties * totalRails` and note that nothing currently
   asserts it (totalRails reads the TS constant; totalCells counts county_rail table rows — independent
   sources that can silently disagree).
2. Cover every displayState: satisfied, not-yet, no-writer, no-atom. Say what each must become.
3. Preserve the ruled per-rail refinement: statewide-uniform rails must reach satisfied everywhere (data
   or honest absence); jurisdiction-DEPTH rails gate on writer-live plus honest not-yet everywhere, with
   satisfied required only in the launch-footprint counties.
4. Keep honest absence as a first-class satisfied state with provenance. Large parts of Texas are
   unincorporated and legitimately unzoned; a county with no zoning authority reaches satisfied by
   disclosed absence, never by fabricated coverage.
5. Produce a GRADABLE DONE-CARD: numbered acceptance items each with an explicit pass/fail instrument
   (the live ledger endpoint, a named query). No item may be gradable only by opinion.

ALSO CORRECT THESE VERIFIED STALE CLAIMS (present-tense assertions only — session logs and _sessions/
files are HISTORICAL RECORDS and must NOT be "corrected"):
- OPS-1 says 19/254 counties loaded; live txgio_parcel is 196.
- OPS-14:86 claims "The W5 WDLL carries the template worksheet." It does not — acceptance item 9 has an
  empty grade box and no worksheet or UT/NM/CO/AZ recon note exists.
- The same verify fix is described as both 56x and 575x in different docs. The measured figure is
  229,382 ms -> 373 ms per 5,000-id batch at 16.2M rows.
- `_STATE.md` conflates 132 swept counties with 196 store counties.
- Five doc comments in ldt `countyLedger.ts` (lines 28, 279, 481, 491) and
  `countyRailDimension.ts:340` still say 12 or 13 rails. Report them; do NOT edit code in this dispatch.

CP1: pre-register the criteria list and the done-card item count before drafting. CP2: verify every
acceptance item is gradable by naming its instrument; any item without one fails the checkpoint and must
be rewritten.

ADVERSARIAL: take your own done-card and try to certify the gate as PASSED today using only the live
ledger. Every place you cannot get a definitive yes/no is an ungradable item — fix it before closing.
```

---

## Notes for the operator

- **Phase 0 is serial and blocks everything.** P0.1 then P0.2.
- **All six Phase 1 blocks run in parallel** once Phase 0 lands. They touch different files; P1.1, P1.2,
  P1.3 and P1.4 all end in a cortex-api deploy, so coordinate the deploy step — or let them merge
  independently and do ONE deploy after the last merge (preferred; fewer canary runs).
- **P1.4 may change the denominator** (3,556 -> 3,302 if MUD retires). If it does, P1.6's amendment must
  reflect the final number — sequence P1.6's close AFTER P1.4's recommendation is known.
- **Phase 2 (acquisition) and Phase 3 (writes) are drafted separately** once these land.
