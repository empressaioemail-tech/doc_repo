# `cell-serve-rule.json` cites `@1.3.0` — adjudication: it MUST NOT change

Lane `p299-engine-corpus-and-slate`, dispatch `_dispatches/2026-09-17_p299-engine-corpus-and-slate_dispatch.md`,
Part 1's last bullet: *"Update `services/retrieval-api/src/__fixtures__/cell-serve-rule.json` where it cites
`@1.3.0` sources, or say why it must not change."*

**Ruling: it must not change. Evidence below; measured 2026-09-17, read-only.**

## 1. It is not this repo's file. It is the same git object in two repos.

```
engine  HEAD:services/retrieval-api/src/__fixtures__/cell-serve-rule.json        540499a765a16514ff71a755e1dec90835d487b6
LDT     f5fd0946:artifacts/api-server/src/lib/__fixtures__/cell-serve-rule.json   540499a765a16514ff71a755e1dec90835d487b6
```

Identical blob hash, 8169 bytes each, 11 rows, identical `_ruleId` (`cell-serve-rule-v1`) and identical
`pinnedRowNames` (verified by parse-and-compare, both directions). Editing the engine's copy forks that blob,
which is the one thing the file exists to prevent: its own `_purpose` calls it *"the contract between the LDT
half and the hauska-engine half of P-297: both readers consume the same rows, so they cannot disagree about
what a cell state means."* The dispatch also forbids touching LDT, so the two copies could not be moved
together from this lane.

The engine's own test says so in words: `parcel-record-reader.ts` and
`src/__tests__/cell-serve-rule.test.ts` both document that the fixture *"is a byte-identical copy of
legacy-design-tools' own copy (LDT PR #710) … **The engine's copy is NOT edited: it is a copy.**"*

## 2. The `source` string is cell DATA, not a dependency pin — and the reader never reads it.

`source` names the corpus version the *cell was minted against*. Audit of every
`@empressaio/setback-corpus@<version>` occurrence in the repo (excluding `node_modules` and the lockfile):

| site | value | what it is |
|---|---|---|
| `services/retrieval-api/src/__fixtures__/cell-serve-rule.json:41,70` | `@1.3.0` | a cell's own provenance claim, in the shared fixture |
| `services/retrieval-api/src/__tests__/ledger-serving-measure.test.ts:41` | `@1.1.0` | a real factory-store cell, quoted verbatim ("read live 2026-09-16, 48209:100226") |
| `packages/engine-core/src/depth-warm/__tests__/remint-preview.test.ts:12,112` | `@1.2.0` | prose in a docstring/comment |
| `RUNBOOK.depth-warm-remint.md:270` | `@1.2.0` | prose in a runbook |

The only *pins* in this repo are `packages/adapters/package.json` and `pnpm-lock.yaml` (moved to exact
`1.4.0` in this lane). `grep` over `services/retrieval-api/src/parcel-record-reader.ts` for `source` finds
one doc comment and no code: the reader serves `cell_state` verbatim and never branches on `source`.
So rewriting `1.3.0` → `1.4.0` would change no behaviour, break the byte-identity with LDT, and — worse —
state something false: that a cell minted under 1.3.0 cites the newest corpus.

`ledger-serving-measure.test.ts` is the precedent that settles the direction of travel: that copy is a
*live-captured* row and keeps its `@1.1.0` for exactly this reason.

## 3. Changing it would delete coverage the lane is supposed to preserve.

The fixture is the only place the engine asserts that a cell whose `source` names an *older* corpus version
is still served as the cell's own claim after the pin moves. That is the version-skew case P-297 exists for
("the county verdict is not the serve switch"; the cell is the answer). Relabelling it to `1.4.0` would make
the fixture assert "every cell cites the current corpus", which no live store guarantees.

## Also checked, no change needed

`services/retrieval-api/corpus/snapshot.json` contains `1.3.0` only as Bastrop code **section numbers**
(`bastrop_tx/bastrop-b3-code-april-2025/1-3-002` style ids and "Section 1.3.002" text), not corpus versions.
`grep -c '@empressaio/setback-corpus@'` over `services/retrieval-api` returns only the four sites above.
