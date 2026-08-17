---
id: 2026-08-17_smart_markets_pickup
title: Smart Markets — pickup state (instrument twin)
date: 2026-08-17
status: active
applies_to: portfolio
owner: nick
---

# Smart Markets pickup

Living pickup for the instrument-twin program. Kept here rather than inline in `_STATE.md` because that file is under heavy concurrent write by the OPS-17 G-61 lane and a read-modify-write there silently lost this block once on 2026-08-17. `_STATE.md` carries a one-line pointer to this file.

Baseline and rows: `_rd_disclosure_twin/08_build_scope.md` (32 rows, 9 amendments). Contract: `09_twin_read_contract.md` v0.1 approved.

## Named, provisioned, built

Name ruled **Smart Markets** (infra and product). Repo `empressaioemail-tech/smart-markets`, private. GCP `smart-markets-118998`, billing linked. Artifact Registry `us-east1-docker.pkg.dev/smart-markets-118998/smart-markets`. Runtime SA `smart-markets-run@` with **per-secret** `secretAccessor` only, project-level binding removed. Four empty secrets, zero versions. Vercel `smart-markets-app` `prj_mixa2jYuhHlKRRbM8I9B3E6PraOr` in team `empressaioemail-techs-projects`, **nothing deployed**. No database, by design, proven by `sqladmin` and `firestore` being `SERVICE_DISABLED`.

Smart Markets PR #1 open, unmerged, CI `success`, 70/70 tests. `packages/contract` compiler-enforces the doctrine: no not-built verdict, an empty array cannot stand in for an absence, the fund roster must be omitted rather than reported absent, a proxy cannot validate as a series, and confused-deputy forwarding is tested. Three golden fixtures committed behind a `z.literal(true)` synthetic label; `/GC` verified to carry no `issuerNodeId`, a `not-applicable` roster, and a populated room that simultaneously declares SEC disclosure not-applicable.

## Cockpit: merged and green

Cockpit `main` reconciled 2026-08-17 and now equals production reality; CI baseline is **zero**, so the merge standard is green. TW-24 (PR #329) and TW-25 (PR #330) both **merged**, main `f285b8c3`, CI `success`. Main carries the inbound service-caller leg and served identity resolution.

`COCKPIT_SERVICE_CALLER_SECRET` is written to the VM `.env` (62 to 63 lines, 64 hex chars, generated on-host so the value never transited a command, **no restart**, api and worker uptime unchanged). Smart Markets' matching `COCKPIT_SERVICE_API_KEY` secret is deliberately still empty and gets paired at deploy time.

**Production is unchanged.** The VM runs the pre-merge image and that secret is unread, so the service path is closed in production regardless of main.

## TW-31: code done, defect measured

PR **#331** open, unmerged, CI `success`, local 4438 passed / 0 failed. Migration **0058** makes `identifier_type` a real CHECK domain including `cik` — it was a bare `String(8)` with the enum only in a code comment. `NOT VALID`, so no row scan. **Not applied to production.**

Production dry run complete, read-only, `writesPerformed: 0` proven four ways and planner-reverified (`nodes=37407 edges=8500 identifier_index=167 max_id=168`, unchanged).

The defect, measured:

```
identifier_index      166 accn + 1 lei          (the identity index is empty)
security nodes        35,918
issuer nodes          1,323
issued_by edges       8,334      all unlabelled, none carrying a match method
guardrail violations  935 of 1,323 issuer nodes (71%)
                      holding 7,797 links = 93.6% of the graph
  unbounded-fanout      914   no SEC symbol at all, so no CIK and no bound
  exceeds-sec-bound      21   worst: iShares MSCI USA Size Factor ETF, 92 vs bound 2
  multi-cik-fanout       17   abrdn Physical Palladium spans FIVE distinct CIKs
  claiming a CIK          0
CIK coverage          2.99%  (1,075 of 35,918; 188 distinct CIKs of 8,021)
```

`lei` is `None` in SEC submissions for all seven cohort symbols, so `resolve_issuer`'s LEI backbone had no data and fuzzy name matching was the only available path rather than a shortcut. `issued_by` is **written only, never read**, so the defect is latent and TW-6 is what would activate it.

CIK coverage at 3% rather than the planner's ~25% estimate **empirically confirms the three-shapes thesis at graph scale**: of 34,843 unresolved, 13,419 are foreign by suffix and the 21,424 unsuffixed are dominated by futures, FX and crypto, which SEC's file structurally cannot cover.

## Open

**TW-32 (new).** `agrees: 0` in the dry run is structural, not measured: the rebuild reads expected issuers from `identifier_index` rows of type `cik`, of which production has zero, so the agreement branch is unreachable. The measurement is blocked on the fix it exists to validate. Fix is to derive expected-issuer from the crosswalk artifact.

**Collapsed-edge resolution.** Planner recommends a read-time trust filter on `match_method` (consumers read `cik-exact`, ignore `name-fuzzy`) rather than Core-DML closure of `valid_to`. Consequence: **TW-6 must read only `cik-exact` links.** An agent is implementing the filter plus a structural test on PR #331.

**Migration 0058 apply.** Sequenced after #331 merges, not before, so production never carries a constraint whose code is unmerged.

**Contribute-or-pay parameters** (rate, decay, calibration-modified rate, paid price, whether any cohort figure shows at Layer 1) — deliberately open until TW-29.

**Counsel.** Whether publishing aggregate declared intent carries a regulatory characterisation. It is not a held position, so it is not COT-shaped, and that novelty is why it is untested.

## Standing rules for this program

No backend deploy to the cockpit VM except from post-reconcile main, and only in a soak-safe window — a restart kills running jobs and must preserve both A/B arms. Do not read a SHA off that host: `/opt/empressa/.git` exists but its head is not what runs. Gate what you SERVE, never what PROVES you — `GET /spine/anchor/verify/{atom_id}` is anonymous by doctrine and pinned by a dependency-graph test. Smart Files is refined, never forked; Plan Review is its first consumer and any migration must be sequenced with the G-60/G-61 lane.
