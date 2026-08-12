# SWEEP: silent-fallback / instrument-not-data audit

**Run:** 2026-08-12T21:45:00Z  
**Close artifact:** `_inbox/2026-08-12_SWEEP_silent_fallback_audit.json`  
**Slot:** A2 holds atoms bulk-writer — this lane was read-only. No `--apply`. No atom writes. W2 owns symnum; not duplicated.

## Verdict

The eight prior defects are one recurring shape: a lookup that failed silently became a confident answer. This sweep found the same shape still live across all three repos. The twelve county writers' verify-by-PK row is healthy. The sick surfaces are classifiers, fetchers, ledger probes, and hardcoded family lists. No production fix met the one-line fail-closed bar without colliding W2 or A2; the inventory and CI patterns are the deliverable.

## CP1 (pre-registered before workers)

| Field | Value |
|---|---|
| Expected findings | 15–25 |
| Highest density expect | legacy-design-tools (instrument layer) |
| Second | hauska-engine |
| Third | hauska-mcp-server |
| Rationale | Writers recently got Group A/B verify fixes; last three pre-registered suspects were wrong; confidence is manufactured in probes/scorers |

## CP2 (measured + reconcile)

| Field | Value |
|---|---|
| Accepted findings | 46 numbered + 1 reference specimen (REF-4) ≈ 54 with subordinate notes |
| Highest density measured | hauska-engine classifiers/fetchers (well, special-district parcel probe, flood Zone-X-by-omission, rail NET) |
| Second | LDT rail derivation + scorer/test theater |
| Third | MCP hardcoded families + deny-as-miss + invented confidence |

**Reconcile:** Count was underestimated. Density expect was wrong on the primary: LDT was not densest for `wouldShipWrongClaim`. Partial confirm: the writer verify row is healthy (all twelve use `atom_did IN`, zero `body->>'atomDid' IN`). The sick engine surface is silent classifiers, not verify. MCP denser than expected. Dispatch said eleven writers; origin/main has twelve (`road-node`, `rrc-pipeline` extra; no zoning/setback/envelope county CLI).

## Repos

| Repo | origin/main SHA | files scanned |
|---|---|---:|
| hauska-engine | `44a1072` (worker pin `127f1db`; #320 landed after; re-verified) | 38 |
| legacy-design-tools | `48c4eb89` | 28 |
| hauska-mcp-server | `b5f26de` | 24 |

## Task 1 — twelve county writers (uniform)

Every writer on origin/main:

- `hasVerifyReadback: true`
- `verifyByPrimaryKey: true` (`WHERE atom_did IN`)
- zero remaining `body->>'atomDid' IN` on the verify SQL

Silent defaults and unproven guards vary by rail (see JSON `writersSwept`). Worst silent-default carriers: well-fact, special-district (parcel bbox probe), flood (Zone X by omission), rail-corridor (NET → active/spur), road-node (empty hits → in-county), rrc-pipeline (null dedupe key `"|"`.

## Task 2 — guard reachability

| Guard | Proven? | Notes |
|---|---|---|
| Paid-tier verify (owner) | yes | A1 standard: mutate public-free → reject |
| Paid-tier CLI refuse | no | Needs unit test without `--apply` |
| PII reduction | yes | Reduction, not throw |
| owner-withheld never inferred | yes | Planner tests; CLI never passes withheldKeys |
| WGS84 bbox | yes | Zoning-staging only — not on 12 writers |
| tier-satisfied | yes | Zoning-staging only |
| warm preflight | yes | depth-warm batch only — not parcel-node county CLI |
| PATH env gates | no | Spawn without `*_PATH=1` |
| PostGIS refuse / well leak / SD table-missing | no | Describe-only proofs in JSON |
| Road collision | yes | Unit tested |
| LDT refresh indeterminate refuse | yes | When real existsSync used |
| LDT read-path indeterminate overlay | weak | SF-21 pretends engine files exist |
| Cotality canWarm | fires wrong | SF-30 — extinguished Cotality still gates warm |

## Highest-severity live specimens (not the original eight alone)

1. **SF-REF-4** (open, W2): `symnum.ts` bare `return "producing"` / `return "oil"`.
2. **SF-1**: `if (!res.ok) break` in well fetch — partial layer as complete.
3. **SF-6**: special-district membership from parcel **bbox midpoint** PIP (districts do carry geometry; probe point does not).
4. **SF-9**: flood Zone X by omission when NFHL load is partial.
5. **SF-10**: rail `mapNetToStatus`/`mapNetToClass` → active/spur (same family as REF-4).
6. **SF-21**: LDT read path `includes("/hauska-engine/") return true` — missing engine looks like writer present.
7. **SF-20**: `hasWriter` still filesystem probe vs merged-git (E1 residual; `resolveLdtRoot(cwd)` fixed).
8. **SF-36**: MCP four-type DID regex (specimen #8) still on main.
9. **SF-41 / SF-42**: access-deny as "No atom found"; invented confidence 0.75/0.95.
10. **SF-30**: Cotality warm gate still live after Cotality extinguished.

## Task 3 — CI-enforceable patterns (hook-shaped)

Protocol steps are 0-for-3 in this program. Propose fail-the-build greps (full list in JSON):

- Engine: bare `return "(producing|oil|active|spur)"`; `if (!res.ok) break`; `body->>'atomDid' IN`; bbox-midpoint centroid; `process.cwd()` in writer modules; truncated without throw.
- LDT: fake `includes("/hauska-engine/") return true`; mock allowlists; `sourcePresent: cov.*Pct > 0`; `Math.min(100, (atomCount`; Cotality `canWarm`; hand `hasWriter:` in `countyRailDimension.ts`.
- MCP: hardcoded `did:hauska:(?:` unions; dual `@hauska`+`@empressaio`; gate-map vs `server.tool(` remainder; `"No atom found"` inside `!assertAtomReadable`.

## Adversarial (planner-owned)

Workers did not review themselves. Key corrections:

- SF-6 mechanism restated (parcel bbox midpoint, not missing district geometry).
- Writer count 12 not 11.
- Engine SHA drift re-checked after #320.
- `gateWarmCohort` not in LDT; Cotality harness is the warm defect there.
- MCP 3-jurisdiction enum kept at med (possible intentional scope).

**Method cannot see:** multi-line ternaries, early returns, default params, Zod `.default()`/`.catch()` in dependency packages, runtime distributions, Python workers, hauska-map / cortex-api, unread MCP catch swarms. Estimated uncounted residue 25–50. A claim of full coverage would be the ninth defect.

## Fixes

None applied. Candidates that look one-line either collide W2 (well-fact halt / symnum family), collide A2 (writer slot), or require rewriting tests that currently lock the defect (flood Zone-X, rail NET, geometry clamp). Next lanes should pick from CI patterns first (hook controls), then REF-4/W2, then SF-1/SF-6/SF-10/SF-21/SF-36/SF-41 as separate dispatches with their own WDLLs.
