---
id: 2026-09-13_share_the_most_current_setback_resolver
title: The most-current setback resolver is shared through the setback corpus package
date: 2026-09-13
last_updated: 2026-09-13
status: active
owner: nick
decided_by: nick (operator), 2026-09-13, "sharing resolver approved"; mechanism chosen by the integration seat
plan_rows: [P-154, P-152, P-156]
related:
  - _inbox/2026-09-12_p154-most-current_close.json
  - _decisions/2026-09-11_setback_source_most_current_wins.md
  - _catalog/dispatch_missions/mission_p154_share_resolver.md
---

## Decision

The most-current setback resolver built under P-154 (`resolveMostCurrentSetback` and its date
readers, today at hauska-engine `packages/adapters/src/local/setbacks/most-current-setback-resolver.ts`,
322 lines, unit-tested against its own falsifier) becomes a subpath export of
`@empressaio/setback-corpus` (`./resolve`, version 1.2.0) and every setback producer consumes it
from there: hauska-engine's adapters and `bastrop-per-parcel-record.ts`, hauska-factory's
`setback-table-router.mjs` and the S1 cell writer, and legacy-design-tools'
`authoritativeSetbackSource.ts`, which stops ranking tier-first. The engine's local copy is
retired by decline: a test fails if the old path is importable.

## Why this mechanism

The P-154 lane could not share the resolver because `@hauska-engine/adapters` is private and
unpublished (404 on npm) and no corpus worktree was granted that wave. The corpus package is
already a dependency of hauska-engine (`^1.1.0`) and hauska-factory (`^1.1.0`); it is the
single published source of setback tables (`_catalog/repo_intents.md`), so the rule that picks
among sources belongs beside the tables it picks among. Publishing the engine's adapters
package would create a second published home for setback law. legacy-design-tools does not yet
depend on the corpus and adds the dependency; the vendored table JSON stays until P-156 rows it.

## Consequences

- One resolver, one package, three consumers; a divergence test between LDT's answer and the
  engine's for `48021:34049` and `48021:33223` fails on disagreement (ENFORCEMENT: parallel
  stores need a divergence test).
- The Bastrop setback cells are re-run through the factory job (staging, then production) so
  the record-served rails carry the most-current values before P-152 lane 4 slates the
  remaining rails.
- P-154's predicate becomes measurable: panel, endpoint, MCP and PDF print identical setbacks
  and a source date for `48021:34049`, or all four print the conflict row.

## Reversal criteria

Reversed if the corpus package cannot carry a runtime module without breaking its consumers'
build conditions (the LDT esbuild `["workspace"]` condition is the known hazard), or if the
operator rules that setback law and setback selection must live in different packages. Either
returns the resolver to the engine and reopens the publish question.
