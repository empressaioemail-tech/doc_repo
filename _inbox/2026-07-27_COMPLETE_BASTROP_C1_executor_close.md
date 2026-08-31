---
id: 2026-07-27_COMPLETE_BASTROP_C1_executor_close
title: COMPLETE-BASTROP C1 executor close — dual-table hash-lock + contract pin
date: 2026-07-27
status: executor-closed (planner grades WDLL 8/9)
owner: executor-C1
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 8,9
dispatch: 2026-07-27_COMPLETE_BASTROP_C1_hardening_cleanup
---

# C1 executor close — hash-lock + contract unvendor

Planner owns verification. This close does **not** claim WDLL MET.

## PRs

| Repo | PR | Commit |
|---|---|---|
| hauska-engine | https://github.com/empressaioemail-tech/hauska-engine/pull/151 | `ea79d58` |
| legacy-design-tools | https://github.com/empressaioemail-tech/legacy-design-tools/pull/359 | `f6360afe` |

## WDLL 8 — dual `bastrop-city-tx.json` (H1 / S-05)

### Meaningful diff (pasted)

**Parsed JSON leaf diff: 0.** District counts, numeric setback fields (`front_ft` / `rear_ft` / `side_ft` / `side_corner_ft` / coverage / height), and B3 provenance quotes are identical.

**Byte-size gap (19670 vs 19258) root cause:** Windows working-tree line endings, not content.

| Surface | Engine | LDT |
|---|---|---|
| Pre-C1 working-tree size (audit) | 19670 (CRLF) | 19258 (LF checkout) |
| Pre-C1 working-tree SHA256 | `76f01124…097c14` | `d54844cd…0cc3c` |
| Git blob (both repos, `cat-file -p`) | oid `b2b2799e…`, **19258 B LF**, SHA256 `d54844cd3711579323ceeb96481ade63f1967437a36adeac1c74140ad720cc3c` | **same oid / same SHA256** |

So: no depth/roadClass row advantage on either side; no numeric merge. Preferring either table as “source of truth” for **values** is a no-op — they already match. Locked the shared LF content hash.

**Value-diff conflict that blocked silent merge:** none. Numeric values did not differ; no B3 citation required; no invented merge.

### Sync / lock shipped

- Locked SHA256 (UTF-8 LF, no BOM): `d54844cd3711579323ceeb96481ade63f1967437a36adeac1c74140ad720cc3c`
- Vitest hash-lock (both repos; CRLF→LF normalize before hash):
  - `hauska-engine/packages/adapters/src/__tests__/bastropCityTxSetbackHashLock.test.ts`
  - `legacy-design-tools/lib/adapters/src/__tests__/bastropCityTxSetbackHashLock.test.ts`
- Engine `.gitattributes`: `packages/adapters/src/local/setbacks/*.json text eol=lf`
- LDT already has repo-wide `* text=auto eol=lf`

### Post-sync SHA256 proof

```
git cat-file -p HEAD:…/bastrop-city-tx.json  (both repos)
  oid:    b2b2799ef0a0d41efd8948d0bc4577f724cdfb0f
  bytes:  19258
  SHA256: d54844cd3711579323ceeb96481ade63f1967437a36adeac1c74140ad720cc3c
  CRLF:   false
```

Working-tree on Windows may still show CRLF for engine until a fresh checkout respects `.gitattributes`; vitest hashes LF-normalized bytes so CI stays honest.

### Vitest

```
hauska-engine adapters: bastropCityTxSetbackHashLock.test.ts  2 passed
LDT lib/adapters:       bastropCityTxSetbackHashLock.test.ts  2 passed
```

## WDLL 9 — contract pin + unvendor (H2 / S-08) + S-13 fixture label

### package.json pin

`@hauska-engine/atoms` dependencies:

```json
"@empressaio/atom-contract": "^1.11.0",
"@hauska-engine/atom-contract-pin": "workspace:*",
"zod": "^3.24.1"
```

Also bumped to `^1.11.0` (dedupe branded WidthedConfidence): `@hauska-engine/storage`, `@hauska-engine/engine-core`.

Dropped live `@hauska/atom-contract` from **atoms** dependencies. Remains only under `@hauska-engine/atom-contract-pin` (legacy re-export shim) — not a live atoms dep.

### property-instances.ts

- Removed “Vendored … until 1.10.0” comments / compatibility-only framing.
- Re-exports `createParcelTerrainModel`, `PARCEL_TERRAIN_DERIVATION_METHOD`, `TERRAIN_EXPORT_FORMATS`, contract terrain types from `@empressaio/atom-contract/property`.
- Keeps engine overlay for StoragePort persistence + site-plan formats (`dxf-site-plan` / `ifc-site-plan` / `pdf-site-plan`) not yet in contract enum.
- Workspace imports moved `@hauska/atom-contract/*` → `@empressaio/atom-contract/*`.

### S-13 / H4 fixture-only

`packages/storage/src/property-atom-proof.ts` header + sourceCitation strings marked **FIXTURE-ONLY**; RS is Hays gold proof, not live Bastrop Place Type / not a production serving path.

### Typecheck

```
pnpm --filter @hauska-engine/atoms typecheck    OK
pnpm --filter @hauska-engine/storage typecheck  OK
```

## Explicitly skipped (C2)

- Adapter honesty / `bastrop-tx.ts` comment scrub (H3 / S-06 / WDLL item 10) — not this dispatch.

## Executor note for planner

Items 8 and 9 are ready for adversarial verify against WDLL acceptance checks (CI hash equality + package.json pin / no vendor comment). Do not treat this close as MET.
