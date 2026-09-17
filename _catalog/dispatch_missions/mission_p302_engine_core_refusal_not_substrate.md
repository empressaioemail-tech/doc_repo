## Mission — P-302: engine-core's site-plan reader shows a declared refusal, never the baked value

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not
deploy `hauska-engine-api`; the integration seat does.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p302-site-plan-refusal`. Declare the start commit (engine main `3e6bbe95` at compile, which
carries P-297's reader, PR #465). Register the clone under the property seat and remove the entry
at close. Another engine lane (P-275) works on the parcel-node review CLI; stay out of it, and out
of `services/retrieval-api/`, which P-297 just changed.

### The finding (P-297 engine close, `_inbox/2026-09-16_p297-cell-serve-engine_close.json`)

- `packages/engine-core/src/site-plan/parcel-record-reader-client.ts` reads the `/record`
  response's `serve` field in five places (lines 127, 182, 208, 260, 303 at `b8ae82f`), then
  switches on `cell.kind`. Its locally mirrored `ParcelRecordRail`/`ParcelRecordResponse` types
  (lines 33 to 50) do not carry P-297's new `refusal` field.
- For a refused or unaccounted cell the helper returns `undefined`, and callers fall back to the
  CAD-roll substrate: `report-model.ts` lines 612 to 617 and 634 to 639 (`?? cadRoll?.<field>`),
  with further reads at 707, 854, 945 and 1147; `resolve-export-setback.ts` 302 to 305;
  `author.ts` 469; `feasibility-author.ts` 14.
- That fallback is the shape the 2026-09-16 ruling retires
  (`_decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md`, OPS-24 law 7): for a
  slated rail the legacy or baked value is never the answer, and a refusal carries its reason.
  It predates P-297; P-297 did not introduce it.

### The rule to implement (the same one both readers now hold)

For a slated rail: a `value` cell is the value; `absent-verified` and `not-applicable` are the
stated absence with its reason; `refused`, `unaccounted`, a missing cell or an unreadable one is a
declared refusal carrying `refusal.code` and `refusal.reason` from the response. An unslated rail
(`serve === "legacy-transitional"`) keeps its current path, including the substrate. The shared
fixture is `services/retrieval-api/src/__fixtures__/cell-serve-rule.json`; read it and do not
edit it.

### What to build

1. The client's mirrored types carry `refusal`, and the helper returns a typed three-way result
   (value, stated absence, declared refusal) instead of `undefined`, so a caller cannot mistake
   "refused" for "nothing here".
2. Every listed caller renders a declared refusal as a refusal with its reason on the site plan,
   the report model, the export setback resolver and the feasibility author. The `?? cadRoll`
   fallback runs only for an unslated rail. List every other caller you find.
3. Name each engine-api surface whose output changes (routes, PDF sections, report fields), with
   one example parcel state per surface, so the integration seat knows what to probe after the
   deploy.
4. Tests in both directions for each caller: a refused cell on a slated rail shows the refusal and
   not the substrate value; an unslated rail still shows the substrate.

### Falsifiers, pre-register your answers first

1. A slated rail with an `unaccounted` cell and a substrate value renders the refusal with its
   reason, and the substrate value does not appear anywhere in the output (test).
2. An unslated rail still renders the substrate value (test).
3. Restoring the `?? cadRoll` fallback on a slated rail fails a test.

### Do not

- Deploy, merge, or write any store.
- Edit the shared fixture, `services/retrieval-api/`, or the P-275 files, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the caller list;
the surfaces that change, with example states; the falsifiers with evidence. `status`:
`closed-partial` until engine-api is deployed and one example per surface is observed. `probe`:
`{"notApplicable": "build lane; graded on the deployed engine-api surfaces"}`. `subAgents`.
`leave_behind`.
