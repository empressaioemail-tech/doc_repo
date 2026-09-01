# Gate 8 — the smoke gate the mold requires and nobody built

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** This card is compiled from the plan of record and carries
the operator's go. Do not stall for permission you already have. If a step is
wrong, say so in the handback and do the rest.

**Verification must terminate.** Builds, typechecks, `vitest run`, or
background-start plus `curl` plus kill. Never `watch`, `serve`, or `tail -f`. The
headless browser must exit on its own path, including on failure.

**Read product code by ref.** Local checkouts sit on feature branches hundreds of
commits behind. Use `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, or job start.

## Why this card exists

`28_THE_BASTROP_MOLD_engine_build_spec.md` names eight recipe gates. Gate 8
(SMOKE) is recorded as **not mechanical** and is called an engine-build
prerequisite: "a fan-out without a real smoke gate re-creates the 3-day scan-fix
loop, the exact failure the program exists to prevent." P4 is a fan-out.

The full spec is `_inbox/2026-08-30_gate8_smoke_spec.md`. **Read it first — it is
the card.** It was written against live production and its assertions were run,
so this is a build, not a design.

## What is already proven

The mold's seed works with zero dependencies: Chrome `--headless=new` plus Node 24
global WebSocket. Verified live that `#panel=node-graph&county=48021&q=34137`
renders the CC node list unauthenticated, and `?parcelNodeId=48021:34137` renders
the PE inspect card.

**Three assertions fire on day one** against the reference county's gold parcel.
That is the proof this gate can fail, and it is the acceptance evidence:

1. `landUseFact.landUseCode: "A1"` / `state: "present"` sits in the same payload as
   `baseFacts.landUse: null`. **This never reaches the DOM** — PE renders A1 from
   the sibling fact — so a DOM-only gate misses it. It is caught only because the
   gate reads the wire as a second reader. Keep that second reader.
2. Wire carries `envelope.status: "ok"` and `buildableAreaSqFt: 9350`; the DOM
   renders "Buildable: Not stamped here", because `liveBuildablePct` reads
   `summary.buildableAreaPct`, a percent the facets envelope does not carry.
3. `boundaryEdgeFact.setback.provenance: "road-class-setback-table"` is serving on
   the gold front edge — the road-class-to-setback-value path the mold retired
   2026-07-29.

## Build order — a lane may stop after step 2 and still have a working gate

**Step 1. The bundle marker, because it does not exist.** The deployed 1.97 MB PE
bundle carries no `BUILD_SHA`, no `__BUILD*`, no 40-hex string, and neither vite
config defines one. Add the `define`, a **non-tree-shakeable**
`documentElement.dataset` write, and `--build-env HAUSKA_BUILD_SHA=$GITHUB_SHA` on
the CLI deploy. `'UNSTAMPED'` is a **hard fail**, never a skip. This alone closes
the trap that let PR #310 read as shipped while starved at the BFF.

**Step 2. The wire assertions.** No browser. The three defects above are all
wire-readable. A gate that stops here already fails today, which is the point.

**Step 3. The CDP walk.** Chrome `--headless=new --remote-debugging-port`,
`Page.navigate`, `Runtime.evaluate` on `innerText`, `Page.captureScreenshot`.

## Two traps that would make this gate vacuous — the spec names both

- **`parseHash` silently falls back to `DEFAULT_PANEL_ID`** on an unknown panel id,
  so a naive deep-link assertion passes forever after a rename. Assert
  hash-identity plus panel-root, and carry the canary run every invocation.
- **CI pins `node-version: 20`, which has no global `WebSocket`.** The gate 8 job
  pins 24. Without this the gate is dead on arrival and reports nothing.

## Non-negotiables

**Verdict vocabulary is `pass | fail | refused | pass-after-cold-start`. There is
no `skip`.** This is the direct answer to the LDT divergence test that skips in CI
and to `import_ledger`'s zero SELECTs — a control that can opt out of running is
not a control.

**Settle on a terminal state, never a sleep.** The spec's own first run read a
loading state as content because the poll predicate was "does the container
exist". Poll for a terminal-state predicate, require two identical consecutive
reads, and treat a timeout as `refused`, not `pass`.

**Answer the three-question gate in the handback**: what executes it, what
triggers it, what fails when violated, and **what bypasses it**. The spec already
names the laptop `vercel deploy` bypass as *not closed, only detectable* — keep
that honest rather than claiming closure.

## Scope boundary

Gate 8 is availability-and-truth **in the app**. It is not the scrub — S1-S14
measures the store. Do not duplicate: the gate catches a *specimen*, the scrub
measures the *population*. The spec states three honest misses (the 723 retired
edges, `DrawEdge.state`, schema-version fidelity); leave them missed rather than
stretching the gate to half-cover the scrub's ground.

## Also in scope, small: gate 7's cheapest honest version

Structural commitment #3 is under $200 compute plus one hour human review per
jurisdiction, and the mold records it as not measured in code. Do not build
telemetry. **Add one column and one check: refuse to close a county with no cost
record or a null `humanReviewMinutes`.** That fails closed on the unmeasured half
instead of passing on a fabricated zero, and it ships before any instrumentation
exists.

## Acceptance

The gate runs, and it **fails** on today's production for the three named reasons.
A run against a fixture with those three defects corrected passes. The bundle
marker is present on a fresh deploy and `'UNSTAMPED'` fails. The panel-id canary
fails when the panel is renamed. Both arms, every assertion.

## Do not

Deploy. Add a dependency beyond Chrome and Node 24. Design anything that requires
a human to read a dashboard — if it needs someone to notice, it is not a control,
and say so instead of shipping it. Report the gate working because it passed once.
