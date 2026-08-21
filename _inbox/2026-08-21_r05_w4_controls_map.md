---
id: 2026-08-21_r05_w4_controls_map
title: R-05 W4 — blueprint rules onto control register; cited-untracked spec
status: active
last_updated: 2026-08-21
plan_row: R-05
lane: R05-W4
snapshot: P:/doc_repo main d254467788c795c6f8fa5a9256ad6a074859b615
seat: integration
related: [_blueprint/40_rule_register, _catalog/tooling_register, _inbox/2026-08-21_r04-controls_close]
---

# R-05 W4 — map blueprint rules onto the control register

Worker artifact. No commits. No patches applied. No baselineExit changed. No product-repo writes. Planner applies the cited-untracked matcher and proves it by violation.

Snapshot: `P:/doc_repo` on `main` at `d254467788c795c6f8fa5a9256ad6a074859b615`. Seat integration. Inputs read: `_blueprint/40_rule_register.md`, `_catalog/tooling_register.json` and `.md`, `_inbox/2026-08-21_r04-controls_close.json`, `_scratch/r04_controls.md`, `_scratch/r05_preserve/r04_tracked_side_effects.diff`, `scripts/canon-divergence.mjs` write path, `scripts/enforcement/cited-untracked.mjs` full, `.github/enforcement-baseline.json` cited-untracked row, `90_runbooks/agent_workspace_hygiene.md`, `_catalog/repo_map.md`, `scripts/enforcement/ci-baseline.mjs` ratchet compare.

Optional patch (unapplied): `_inbox/2026-08-21_r05_w4_cited_untracked.patch`.

## 1. R-04 tracked diffs: confirm the planner provisional

**Verdict: CONFIRM.** The two tracked files are a side effect of running `scripts/canon-divergence.mjs` from the R-04 worktree. They are not scope creep. **Do not land them.**

The preserved diff changes `_catalog/canon_divergence.md` and `_catalog/repo_intents_checks.json`. The write path produces both, in one invocation, with the exact shapes in that diff.

`renderReport` writes the markdown and interpolates the checks path as an absolute filesystem path:

```
lines.push(`checks: ${args.checks.replace(/\\/g, '/')}`);
```

Default `args.checks` is `resolve(join(scriptDir, '..', '_catalog', 'repo_intents_checks.json'))`. From worktree `P:/tmp/r04-controls` that becomes `P:/tmp/r04-controls/_catalog/repo_intents_checks.json`. That string is what leaked into tracked frontmatter. The rest of the markdown (new `last_updated`, `Fetch=yes`, updated commit counts) is the same renderer.

`stampLastVerified` then rewrites the checks JSON when `args.stamp` is true (the default) and `args.checks === resolve(DEFAULT_CHECKS)`. In a worktree, `DEFAULT_CHECKS` is that worktree's copy, so the equality holds. Stamps fire for `active`/`factory` repo-level rows with commits, and for `zero-new-work`/`no-touch`/`retiring` rows with zero commits. That matches the date flips in the diff (legacy-design-tools factory, nested clocks, hauska-* active, smartcity-os no-touch). The array wrapping is `JSON.stringify(data, null, 2)`, not a hand edit.

**Do not land** because the generated markdown is worktree-contaminated. A stranger clone does not contain `P:/tmp/r04-controls/`. Landing it would make canon claim a path that only existed on one machine for one lane.

Second mechanism that would produce the same two-file diff: R-04 hand-edited the census notes and pretty-printed JSON. Rejected. A hand edit would not independently reconstruct (a) the `checks:` absolute-path frontmatter the renderer always writes, (b) the stamp policy that updates exactly the OK active/factory and quiet no-touch rows, and (c) a full-file `JSON.stringify` rewrite. Those three are one function (`main`) in `scripts/canon-divergence.mjs`.

Related: `M2-DIVERGENCE-REFRESH` is registered ENFORCED and never blocks. Read of `_STATE.md` when the report is older than 12 hours also invokes this writer. R-04 may have hit it by reading `_STATE.md` rather than by an explicit census run. Same control, same leak. Still do not land.

If a fresh report is wanted later, re-run from `P:/doc_repo` with `--out` pointed at `_inbox/` and `--no-stamp`, or wait for the R-06 check-only mode. Do not copy the r04-controls artifacts onto main.

## 2. Blueprint rule to control register

R-04 exit criterion for this half: every blueprint rule names a consumer that exists in the tooling register, or is listed UNENFORCED with a build item. A named consumer that is DORMANT or STARVED is not ENFORCED. `three-layer-audit.mjs` is not a row in `_catalog/tooling_register.json`. Product-annex mentions (LDT SS-W16, `ac-type-accessPolicy`) are noted where they look like a match and rejected where they enforce a different sentence.

Blueprint claimed ENFORCED = 1 (BP-MEANING-01). W4 ENFORCED-by-register = 0. The 24 rules in `_blueprint/40_rule_register.md` (BP-FACTORY-01 is in the pipeline table; the V10 block is the same rule, not a 25th):

| rule id | current consumer (blueprint) | matching control id | status | build item |
| --- | --- | --- | --- | --- |
| BP-KEY-01 | NONE | NONE | UNENFORCED | R-06 mint canonical parcel keys at resolution; do not label STARVED until a writer exists |
| BP-PARCEL-KEY-01 | NONE | NONE | UNENFORCED | R-06 normalize `{fips}:{integer}` before bind/join |
| BP-KEY-SENTINEL-01 | NONE | NONE | UNENFORCED | R-06 refuse sentinels inside primary identity keys |
| BP-DID-01 | NONE | NONE | UNENFORCED | R-06 body.atomDid equals column atom_did |
| BP-ADAPT-01 | per-writer scripts (partial) | NONE | UNENFORCED | R-06 adapter-boundary gate on ingest writers |
| BP-RESOLVE-01 | NONE | NONE | UNENFORCED | R-06 refuse silent entity_type default |
| BP-LAND-01 | acquisition scripts | NONE | UNENFORCED | R-06 honor manifest retention class on landing |
| BP-FACTORY-01 | NONE | NONE | UNENFORCED | R-06 factory termination + lease-release record (R-03 already counted terminationCondition NONE) |
| BP-EDGE-01 | NONE (atom_links table exists) | NONE | STARVED | R-07 count applies-to property edges; R-06 CI that the count can be non-zero; R-08 writers emit edges |
| BP-WRITE-01 | storage port (intended) | NONE | DORMANT (unverified; product unread) | R-06 confirm the port exists then wire refuse-on-noncanonical into bulk apply. If the port was never written, this is UNENFORCED |
| BP-FLOOD-01 | NONE (tier2 retired) | NONE | UNENFORCED | R-06 geometry-intersection assignment. SS-W16 is not this rule (see adversarial) |
| BP-LANDUSE-01 | NONE | NONE | UNENFORCED | R-06 refuse overlay of land-use-fact and landuse rail counts |
| BP-ADDRESS-01 | NONE | NONE | UNENFORCED | R-06 reject punctuation-only / empty-token situsAddress |
| BP-RECON-01 | NONE | NONE | UNENFORCED | R-06 recon job that emits conflict. Blueprint STARVED is a mislabel: probe-only is no executor |
| BP-ABSENCE-01 | NONE (verifiedAbsence type shipped) | NONE | STARVED | R-06 fail-closed write without evaluated + provenanceScope; R-07 count population |
| BP-MEANING-01 | `three-layer-audit.mjs` (county body vs binding) | NONE (not in register) | DORMANT | R-06 add a register row; wire a trigger or keep DORMANT honestly. Not ENFORCED |
| BP-ACCESS-01 | packages/retrieval index.ts (the default is the defect) | NONE (`ac-type-accessPolicy` is the wrong check) | UNENFORCED | Product retrieval: refuse omitted accessPolicy. Not this pass. File R-06 pointing at LDT, no product write here |
| BP-LICENSE-01 | NONE | NONE | UNENFORCED | R-06 MCP gate intersects accessPolicy and license. Blueprint STARVED is a mislabel until the gate reads license |
| BP-SERVE-01 | NONE | NONE (SS-W16 is a specific subset, no stable register id) | UNENFORCED | R-06 general retirement-repoint. Register SS-W16 as its own row for the flood-not-served path only |
| BP-SERVE-02 | product repos (partial) | NONE | UNENFORCED | R-06 serve Layer 4 only |
| BP-LEDGER-01 | county_ledger_snapshot materialize | gate-grade (DORMANT, does not test variance) | STARVED | **R-09** (already the row). Do not treat gate-grade as the control for this sentence |
| BP-BITEMP-01 | NONE | NONE | UNENFORCED | R-06 optional ADR-cite gate, or leave as governance UNENFORCED with this row as the build item |
| BP-ENF-01 | NONE | NONE (register has the fields; nothing fails when a new control omits them) | UNENFORCED | R-06 schema check on tooling_register.json requiring executor, trigger, failure, bypass |
| BP-VERIFY-01 | CI workflows (partial) | hy-proof-by-violation (DORMANT); CI-ENFORCEMENT-RATCHET does not violate | DORMANT | R-06 wire proof-by-violation into CI. cited-untracked graduation below is one instance of this rule, not the whole rule |

No row is `ok`. Zero rules are ENFORCED by a register control that is armed, fed, and scoped to that sentence.

## 3. Cited-untracked cheap fix (specify only)

### Mechanism of the clean-tree hits

`extractCandidates` takes backtick and markdown-link strings. `looksLikeRepoPath` accepts `.git/` because the character class includes `.` and `/`. `existsSync(join(root, '.git/'))` is true on every clone. `isInGit('.git')` is false because `git ls-files` does not list `.git`. The control's stated defect is "a clone is missing what canon claims." A clone is not missing `.git/`. The matcher is wrong, not the prose.

Tracked backtick citations of this class, read in this session:

- `90_runbooks/agent_workspace_hygiene.md`: `` `.git/objects/` `` and `` `.git/` ``
- `_catalog/repo_map.md`: `` `.git/` `` (grep exclusion list)

Planner knownDebt says clean checkout is 2 hits, both the string `.git/`. Code also matches `.git/objects/` in the same hygiene file, which would be a third hit of the same class. Second mechanism for "2 not 3": unique-by-target collapsing `.git/` only, or a worktree where `.git` is a gitdir file and `.git/objects` does not exist as a path under the worktree. Planner must print the hit list on a **clean** tree at apply time and not trust 2 versus 3. The prefix skip below covers both.

Do not add `.git` as a raw `startsWith('.git')` allow. That would also skip `.github/`, which is tracked canon and a real citation surface.

### Patch (unapplied)

File: `_inbox/2026-08-21_r05_w4_cited_untracked.patch`. Matcher only. It does not touch `.github/enforcement-baseline.json`. Applying it does not raise or lower any baselineExit.

What it does: in `looksLikeRepoPath`, after the hash-skip, normalize slashes and trailing slash, then `return false` when `norm === '.git'` or `norm.startsWith('.git/')`.

### Prove by violation (planner; after apply; on a clean tree)

The integration working tree is the wrong instrument. That is the original planner misread (knownDebt). GitHub Actions clones the commit. Local proof must look like CI: a clean worktree, or `git worktree add` of the post-patch commit with no extra untracked files that tracked canon cites.

Do not run the graduation measurement against the dirty integration tree. `scan()` only reads tracked citers, but it flags untracked **targets** that exist on disk. Hundreds of `_inbox/` citations will still exit 2 on a dirty tree after this matcher fix. That is the real defect class firing, not a `.git/` false positive.

Sequence:

1. Apply the patch to `scripts/enforcement/cited-untracked.mjs` only. Do not edit the baseline yet.

2. Clean-tree pass (`.git/` prose no longer hits). From a clean checkout of the patched commit:

   `node scripts/enforcement/cited-untracked.mjs`

   Expect exit 0 and `"hits": []`. Confirm the JSON contains neither `90_runbooks/agent_workspace_hygiene.md` nor `_catalog/repo_map.md`. If it does, the skip is wrong; stop; do not touch baselineExit.

3. Inject a tracked citer of a real untracked path. Observe fail:

   ```
   printf 'untracked target\n' > _inbox/_r05_cu_target.txt
   printf 'See `_inbox/_r05_cu_target.txt`.\n' > _inbox/_r05_cu_citer.md
   git add -- _inbox/_r05_cu_citer.md
   node scripts/enforcement/cited-untracked.mjs
   ```

   Expect exit 2 and a hit `{ citer: "_inbox/_r05_cu_citer.md", target: "_inbox/_r05_cu_target.txt" }`. If exit 0, the control is broken; stop; do not touch baselineExit.

4. Restore. Observe pass:

   ```
   git reset HEAD -- _inbox/_r05_cu_citer.md
   rm -f _inbox/_r05_cu_citer.md _inbox/_r05_cu_target.txt
   node scripts/enforcement/cited-untracked.mjs
   ```

   Expect exit 0 and empty hits again.

5. Packaged equivalent: `node scripts/enforcement/cited-untracked.mjs --self-test` must still pass. `--self-test` only asserts the fixture is among hits; it can pass on a dirty tree. Steps 2 and 4 are the clean-tree proofs. Step 3 is the violation. `--self-test` is not a substitute for 2 and 4.

6. Only after 2, 3, and 4 hold, **lower** (never raise) cited-untracked in `.github/enforcement-baseline.json`: `baselineExit` 2 to 0, `tier` REPORTING to BLOCKING, set `violationVerified` to this proof, rewrite `knownDebt` to empty or to "none; matcher skips .git metadata". Leave every other control's `baselineExit` unchanged.

Ratchet behaviour (`scripts/enforcement/ci-baseline.mjs`): `actual < baselineExit` is IMPROVED and does **not** fail the job. It prints that you must tighten the baseline or the ratchet silently re-admits the defect. So a matcher-only apply on CI is green with a stale baseline 2. That is why step 6 exists. Skipping step 6 leaves the control REPORTING with a lie in the pin. Doing step 6 before steps 2 to 4 would pin BLOCKING on an unproven matcher.

Do not raise cited-untracked `baselineExit`. Do not raise doc-staleness, seat-register, or any other pin to make a local dirty-tree run look like known debt.

## 4. Cheap and safe this pass versus filed not fixed

### Cheap and safe (planner applies after this spec)

One item: the cited-untracked matcher skip for `.git` metadata, proven by violation on a clean tree, then lower that one `baselineExit` to 0 and move that one row to BLOCKING. W4 did not apply it.

### Filed, not fixed this pass

Never raise a baselineExit to green a run. Never land the R-04 generated pair.

| item | owner | plan row | why not this pass |
| --- | --- | --- | --- |
| Do not land `_catalog/canon_divergence.md` / `repo_intents_checks.json` from r04-controls | planner | R-04 close | worktree path leak; regenerate later from P:/doc_repo |
| canon-divergence `--check-only` (stop mutating tracked files; stop fail-open-as-PASS) | systems | R-06 | writer change; needs its own violation proof; required before that control can BLOCK |
| seat-gate.mjs import `../scripts` resolves to `.cursor/scripts` | systems | R-06 | SEAT-01 DORMANT in hooks; CLI path works |
| seat-register FALSE-GREEN in enforcement-baseline (library, no `main()`, vacuous exit 0) | systems | R-06 | extract a validation script; do not raise its baselineExit |
| Wire SEAT-01 into CI ratchet | systems | R-06 | depends on the import fix and a real `main()` |
| Canon gate M3/M4/M5 Agent-tool only; hand-carried Write / paste never touches it | systems | R-06 | design change; dominant historical bypass |
| M4 hashes AGENT_CONTRACT.md and reads the marker back from the same file | systems | R-06 | internal-consistency; one party both sides |
| DIRTY-STATE-PUSH blocked a push whose own command was committing the file it named | systems | R-06 | hook logic; not a one-line skip |
| `.claude/hooks/dispatch-template-gate.ps1` globs `_dispatches/` and refused a MISSION INPUT (no marker by definition); Write-tool only so `cp` bypasses | systems | R-06 | OVER-SCOPED plus bypass; tightening scope without a violation pair will teach the fleet DISPATCH_OVERRIDE |
| doc_repo main has no required status checks (Stage 1; CI advisory) | operator + systems | R-06 Stage 2 | GitHub protection; not a script patch |
| Duplicate frontmatter id check (8 pairs at R-04 snapshot) | systems | R-06 | new control; prove by injecting a duplicate |
| C-00 ignores OPS/enforcement.mdc | systems | R-06 | third vehicle |
| Graduate doc-staleness to BLOCKING | docs + systems | R-06 | not cheap: 1223 vocab + 155 gating stale at 4b174d1 |
| Per-lesson memory promotion triage | systems | R-06 | file-level pin is knownScopeLimit |
| Add `three-layer-audit.mjs` as a register row and decide its trigger | property + systems | R-06 | R-04 census missed the only blueprint-claimed ENFORCED consumer |
| Register LDT SS-W16 as a stable id; do not widen it to BP-FLOOD-01 | property + systems | R-06 | product annex mention only |
| BP-KEY-01, BP-PARCEL-KEY-01, BP-KEY-SENTINEL-01, BP-DID-01, BP-ADAPT-01, BP-RESOLVE-01, BP-LAND-01, BP-ADDRESS-01, BP-LANDUSE-01, BP-SERVE-02, BP-BITEMP-01, BP-ENF-01 | property / engine / systems per rule | R-06 | no consumer |
| BP-FACTORY-01 factory off-ramp | systems + factory owner | R-06 | R-03 already filed terminationCondition NONE |
| BP-WRITE-01 storage port refuse | property (product unread here) | R-06 | DORMANT or absent; confirm in product repo in a later row |
| BP-ACCESS-01 omit-default refuse | LDT / property | R-06 (product code) | no product writes this pass |
| BP-LICENSE-01 intersection at MCP gate | MCP / engine | R-06 | gate does not read license today |
| BP-FLOOD-01 geometry assignment | property | R-06 / R-08 | assignment path, not serve-path |
| BP-RECON-01 conflict emit | property | R-06 | build a recon job; do not call probe-only STARVED |
| BP-ABSENCE-01 verified pair | engine + property | R-06 write gate; R-07 count | type exists, pair unfed |
| BP-EDGE-01 applies-to property edges | engine + property | R-07 count, R-08 writers, R-06 non-zero gate | table exists, edges empty |
| BP-SERVE-01 general retirement repoint | property | R-06 | SS-W16 covers one retired flood path only |
| BP-LEDGER-01 indicator variance | property | **R-09** | already a plan row; gate-grade is DORMANT and does not test variance |
| BP-VERIFY-01 as estate practice (hy-proof-by-violation into CI) | systems | R-06 | cited-untracked graduation is one instance, not the rule |
| Protect smart-files and smartcity-dashboards merges | operator + those seats | R-06 | product annex; not doc_repo |

## 5. Adversarial notes (second mechanism per mapping class)

**ENFORCED by existence of a named file.** BP-MEANING-01 names `three-layer-audit.mjs`. SS-W9 ran it and it threw on county disagreement, which proves the check can fail. That is not a trigger on ingest, merge, or CI. R-04 DORMANT definition is "no trigger." Counting it ENFORCED because the script exists is the artifact-that-does-nothing class. Rejected. Status DORMANT, control id NONE in the register. Second mechanism for the blueprint ENFORCED label: R-01 copied the 51_ingestion_pipeline_reference "template instance" sentence. Rejected as register mapping; the reference describes a shape, not a live gate.

**Wrong product control, right-looking name.** `ac-type-accessPolicy` is a Zod union of allowed values. BP-ACCESS-01 is "do not default omitted accessPolicy to public-free." A typed default still emits public-free. The retrieval `index.ts` default is the defect. Rejected as a match.

**SS-W16 as BP-FLOOD-01.** SS-W16 is "tier2 flood is not served." BP-FLOOD-01 is "assign flood by parcel geometry, not tile centroid." Serving-not-retired is BP-SERVE-01's flood instance. Assignment is unenforced. Rejected.

**SS-W16 as BP-SERVE-01 ENFORCED.** It enforces one retired store on one repo with a required check. The rule is "repoint all L4 consumers when a fact store retires." One instance is not the general rule. Status remains UNENFORCED for the sentence; file a separate register row for SS-W16.

**gate-grade as BP-LEDGER-01.** gate-grade is DORMANT (manual) and grades cells; it does not require `hasWriter` / `atomFamilyState` to take more than one value. Constants still cannot go red. R-09 exists because of that. Rejected.

**STARVED versus UNENFORCED.** Absence and starvation look identical from outside. STARVED requires an executor. W4 kept STARVED only where an executor is already known from the 2026-08-20 store audit or a shipped type: atom_links (BP-EDGE-01), verifiedAbsence type (BP-ABSENCE-01), county_ledger_snapshot materialize (BP-LEDGER-01). Blueprint STARVED on BP-KEY-01, BP-RECON-01, and BP-LICENSE-01 has consumer NONE or "probe-only" / "column only." Those are UNENFORCED. Second mechanism: "the store is empty so it must be starved." Rejected for those three; empty with no writer is UNENFORCED.

**BP-WRITE-01 DORMANT.** Blueprint says storage port intended. This lane did not open product repos. Second mechanism: the port was never written (UNENFORCED). Cannot distinguish without reading the port. Filed as DORMANT-unverified, not counted ENFORCED.

**R-04 register STARVED count 0.** That was a census of doc_repo controls, not of blueprint product rules. It does not contradict product-side starvation. Do not import "STARVED 0" into this mapping.

**cited-untracked 1176 hits as canon debt.** Already corrected in knownDebt: dirty tree. Second mechanism after the matcher fix: remaining non-zero on the integration tree still looks like matcher failure. Rejected if the extra hits are tracked citers of real untracked `_inbox/` paths. CI clone is the measurement that licenses BLOCKING.

**Raising baselineExit as "honest pinning."** The instruction is never raise. Pinning a dirtier exit turns new debt into known debt. cited-untracked moves the other way: lower after the matcher is proven.

## 6. Leave behind

```
leave_behind:
- item: _inbox/2026-08-21_r05_w4_controls_map.md (this file)
  owner: planner
  plan_row: R-05
- item: _inbox/2026-08-21_r05_w4_cited_untracked.patch (unapplied matcher)
  owner: planner
  plan_row: R-05
- item: R-04 tracked canon_divergence.md + repo_intents_checks.json (do not land)
  owner: planner
  plan_row: R-04
- item: cited-untracked apply + prove-by-violation + lower baselineExit 2 to 0 + BLOCKING
  owner: planner
  plan_row: R-05 then ratchet pin
```
