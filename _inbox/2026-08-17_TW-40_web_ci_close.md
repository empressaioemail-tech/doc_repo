---
title: TW-40 close — apps/web test harness and frontend CI gate
date: 2026-08-17
status: complete
row: TW-40
repo: empressaioemail-tech/smart-markets
branch: tw40/web-ci
pr: 4
last_updated: 2026-08-17
---

# TW-40 close: the human surface now has a gate that can fail

Branch `tw40/web-ci`, PR #4, commit `e530fb3`, CI conclusion `success`. Not merged. The planner merges after review, and this one merges before TW-21 so the UI branch rebases onto a repo that already fails closed.

## The gap, as verified before changing anything

`.github/workflows/ci.yml` on `origin/main` ran a `build-test` job (typecheck, lint, format:check, `npm test`) and a `structural-gates` job whose only frontend check was a grep proving `apps/web/src` calls no upstream. `apps/web/package.json` had no `test` script at all, and the root `npm test` is `npm run test --workspaces --if-present`, so the web surface was skipped silently rather than failing loudly. The web build was not run in CI in any job. A type error or a shell that throws on mount shipped green.

## What landed

Five files, 1,220 insertions, 2 deletions.

A vitest harness for `apps/web`: `vitest`, `@testing-library/react`, `@testing-library/dom`, and `jsdom` as devDependencies, a `"test": "vitest run"` script, and a new `apps/web/vitest.config.ts` carrying the react plugin and the jsdom environment. Kept separate from `vite.config.ts` so dev/build config and test config move independently.

One smoke test at `apps/web/src/__tests__/smoke.test.tsx`, two cases: the shell mounts at the default route, and the shell mounts on an instrument route. Both assert only that mounting does not throw and that something entered the container. `fetch` is stubbed so the suite never depends on a running union layer and never reaches the network from CI.

Two CI steps in the existing `build-test` job.

## ci.yml diff

```diff
diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index ec85e86..bd5ca83 100644
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -34,6 +34,19 @@ jobs:
       - name: Test
         run: npm test
 
+      # Named explicitly rather than left to the root `npm test`, which runs
+      # `--workspaces --if-present` and would silently skip the web surface
+      # if its test script were ever removed. A gate that can be disabled by
+      # deleting a line is not a gate.
+      - name: Web tests
+        run: npm run test --workspace @smart-markets/web
+
+      # The web build runs `tsc --noEmit` before `vite build`, so this gates
+      # the surface's types and its bundle in one step. Until this existed,
+      # apps/web could break and CI stayed green.
+      - name: Web build
+        run: npm run build --workspace @smart-markets/web
+
   # Fail-closed gates on the two rules a reviewer cannot see in a diff.
   structural-gates:
     runs-on: ubuntu-latest
```

The web test step is named explicitly rather than left to the root sweep on purpose. `--if-present` means a future edit that drops the `test` script from `apps/web/package.json` would turn the gate off with no CI signal. Naming the workspace makes that removal fail loudly.

## apps/web/package.json diff

```diff
@@ -8,6 +8,7 @@
     "dev": "vite",
     "build": "tsc --noEmit -p tsconfig.json && vite build",
     "typecheck": "tsc --noEmit -p tsconfig.json",
+    "test": "vitest run",
     "preview": "vite preview"
   },
@@ -16,10 +17,14 @@
   "devDependencies": {
+    "@testing-library/dom": "^10.4.0",
+    "@testing-library/react": "^16.0.1",
     "@types/react": "^18.3.12",
     "@types/react-dom": "^18.3.1",
     "@vitejs/plugin-react": "^4.3.3",
+    "jsdom": "^25.0.1",
     "typescript": "^5.6.0",
-    "vite": "^5.4.10"
+    "vite": "^5.4.10",
+    "vitest": "^2.1.5"
   }
```

## Proof the gate fails closed

Demonstrated by removal, twice, once per new step. Both breakages were reverted before the commit and neither is in the branch.

Breakage one, a type error: `documentUrl` in `apps/web/src/client.ts` changed from returning `string` to returning `number`. Raw output of `npm run build --workspace @smart-markets/web`:

```
> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

src/client.ts(88,5): error TS2322: Type 'string' is not assignable to type 'number'.
src/views/InstrumentView.tsx(93,20): error TS2322: Type 'number' is not assignable to type 'string'.
npm error Lifecycle script `build` failed with error:
npm error code 2
npm error workspace @smart-markets/web@0.1.0
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json && vite build
EXIT=2
```

Note the second error: the type change propagated into a view the smoke test never asserts on, which is the point of gating the build rather than only the test.

Breakage two, a shell that throws on mount: a `throw new Error(...)` inserted at the top of `App()` in `apps/web/src/App.tsx`. Raw output of `npm run test --workspace @smart-markets/web`:

```
 x src/__tests__/smoke.test.tsx (2 tests | 2 failed)
   x the app shell mounts without throwing 18ms
     -> TEMPORARY fail-closed proof: the shell throws on mount
   x the app shell mounts on an instrument route without throwing 2ms
     -> TEMPORARY fail-closed proof: the shell throws on mount

------- Failed Tests 2 -------

 FAIL  src/__tests__/smoke.test.tsx > the app shell mounts without throwing
 FAIL  src/__tests__/smoke.test.tsx > the app shell mounts on an instrument route without throwing
Error: TEMPORARY fail-closed proof: the shell throws on mount
 -> App src/App.tsx:17:9
     16| export function App() {
     17|   throw new Error("TEMPORARY fail-closed proof: the shell throws on mo...
       |         ^

 Test Files  1 failed (1)
      Tests  2 failed (2)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error workspace @smart-markets/web@0.1.0
EXIT=1
```

## Passing output on the committed tree

`npm run test --workspace @smart-markets/web`:

```
> @smart-markets/web@0.1.0 test
> vitest run

 RUN  v2.1.9 P:/smart-markets/apps/web

 + src/__tests__/smoke.test.tsx (2 tests) 22ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Duration  1.06s
EXIT=0
```

`npm run build --workspace @smart-markets/web`:

```
> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
transforming...
+ 60 modules transformed.
dist/index.html                   0.40 kB | gzip:  0.26 kB
dist/assets/index-BUl2UyVj.css    2.08 kB | gzip:  0.82 kB
dist/assets/index-CSlhvmBy.js   214.56 kB | gzip: 63.63 kB | map: 656.49 kB
+ built in 551ms
EXIT=0
```

`npm run lint`:

```
> smart-markets@0.1.0 lint
> eslint .

EXIT=0
```

`npm run format:check`:

```
> smart-markets@0.1.0 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
EXIT=0
```

Root `npm test` picks the new suite up through the workspace sweep as well: 39 node:test assertions across contract and api pass, then the web suite runs and passes.

CI on the pushed branch, run 32095170861:

```
{"conclusion":"success","displayTitle":"TW-40: give the human surface a gate that can fail","headSha":"e530fb3b507dcf078a3856b72d5ac66ba1e7358b","status":"completed"}
```

Both new steps appear green in the run log alongside the pre-existing ones: `Test`, `Web tests`, `Web build`, and all four structural gates.

## Scope confirmation

Files changed between `origin/main` and `origin/tw40/web-ci`:

```
 .github/workflows/ci.yml              |   13 +
 apps/web/package.json                 |    7 +-
 apps/web/src/__tests__/smoke.test.tsx |   54 ++
 apps/web/vitest.config.ts             |   18 +
 package-lock.json                     | 1130 ++++++++++++++++++++++++++++++++-
 5 files changed, 1220 insertions(+), 2 deletions(-)
```

Files touched under `apps/web/src`, in full:

```
apps/web/src/__tests__/smoke.test.tsx
```

Nothing in `packages/contract`, nothing in `apps/api`, no root config beyond the lockfile, no other `apps/web/src` file. `App.tsx`, `client.ts`, `styles.css`, `views/**`, and `components/**` are byte-identical to `origin/main` on the branch; the two files touched during the fail-closed proof were restored before staging and the diff above confirms they carry no change.

Nothing was deployed. No vercel, no gcloud, no docker command was run. `origin/main` is unchanged at `eb8d172`. PR #4 is open and unmerged. PR #3 (TW-19) was not touched.

## Divergence flagged for review

The dispatch instructed me to read the existing vitest setup in `packages/contract` and `apps/api` and mirror it. There is no vitest setup in this repo. Both of those workspaces test on `node --import tsx --test tests/*.test.ts`, and neither has a vitest dependency or config. The instruction rested on a premise that is not true of the tree.

I took the explicit build directive over the mirroring instruction and installed vitest, because `node:test` has no DOM and the web surface is the only workspace that renders. React Testing Library needs a DOM environment; bolting jsdom onto `node:test` by hand would be a bespoke harness nobody else in the ecosystem runs. The cost is real and should be reviewed rather than absorbed silently: smart-markets now has two test runners. Nothing in this change asks contract or api to migrate, and they remain on `node:test`.

## Coordination note for TW-21

The smoke test holds exactly one contract with the surface: `apps/web/src/App.tsx` exports a component named `App`. That is the same contract `main.tsx` already depends on. It asserts nothing about components, class names, copy, or DOM structure, so a full redesign underneath it should pass unchanged. If TW-21 renames or restructures the export, this test breaks, and that break is correct rather than incidental.

The harness is now in place for TW-21's own tests. Any file matching `src/**/*.test.ts` or `src/**/*.test.tsx` is picked up automatically, so their absence-block, omitted-row, partial-layer, and proxy tests need no config change. Note that `apps/web/tsconfig.json` includes `src/**/*`, so every test file is typechecked by the `Web build` step as well as executed by the `Web tests` step.

## Incident: two agents shared one working tree

This is the one thing worth carrying past the row.

`P:/smart-markets` is a single clone and the TW-21 agent was operating in it at the same time I was. At 22:15:53, while my `HEAD` was on `tw40/web-ci` and my work was uncommitted in that tree, the TW-21 agent ran a commit in the same directory. Its design-system docs commit `d85743d` landed on my branch, not theirs. `git reflog` shows the sequence plainly: checkout from `tw21/human-surface` to `tw40/web-ci`, then a commit of `docs/design-system.md` and `docs/design-system.html` on top of it.

I caught it because a `git diff --stat origin/main` showed 2,941 insertions in `docs/` that I had not authored. I created a local ref `salvage/tw21-design-system-docs` at `d85743d` to guarantee their work could not be lost, then ran `git reset --mixed origin/main` to take the foreign commit off my branch while leaving my own uncommitted changes and their files intact on disk. I then staged explicit paths only, never `git add -A`, so `docs/` stayed out of my commit.

The TW-21 agent has since moved to its own worktree at `P:/smart-markets-worktrees/tw21-human-surface` and re-committed the same content as `2bf434d`. I verified the trees are identical (`7c0a3c5549d1925bca989fc149b5dde137adf209` on both), so nothing was lost. The salvage ref is now redundant; I attempted to delete it and the permission system denied the branch deletion, so it remains as a harmless local-only ref in `P:/smart-markets`. Someone with the permission can run `git branch -D salvage/tw21-design-system-docs` at leisure.

The structural lesson is the same one the doc_repo concurrent-commit hazard already records, now confirmed in a second repo: parallel lane agents must each get a `git worktree`, never a shared clone. The TW-19 agent had one from the start and was never at risk. Two of three lanes in this repo shared a tree and a commit crossed branches within minutes. Had I not checked, PR #4 would have carried another lane's design system into a CI-plumbing review, and had the TW-21 agent checked out their branch mid-run, my uncommitted harness would have travelled with them.

## What I could not do

Nothing in the assignment was left undone. Three items are worth naming as boundaries rather than gaps.

I did not delete the redundant `salvage/tw21-design-system-docs` local ref; the permission system denied `git branch -D`. It is local-only and holds a tree already preserved on `tw21/human-surface`.

I did not merge PR #4, per instruction. It is green and awaiting planner review.

I did not add `@testing-library/jest-dom`. Its matchers would have made the smoke test read better, but every one of them asserts on DOM shape, which is exactly what this test is forbidden to do. TW-21 can add it when it writes tests that assert on rendered meaning.
