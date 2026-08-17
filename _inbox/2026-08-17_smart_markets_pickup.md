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

## TW-31: MERGED

PR **#331** MERGED 2026-08-17T14:28:47Z. Cockpit main is **`d7d56b2b`**, CI `success` (confirmed twice through Actions-API 404 flakiness; the legacy `/status` endpoint reports `pending` with `total_count: 0` because this repo is Actions-only, so that endpoint is a NON-SIGNAL here). Main now carries the crosswalk, migration 0058, the CIK-ranked resolver, and the read-time trust filter. Migration **0058** makes `identifier_type` a real CHECK domain including `cik` — it was a bare `String(8)` with the enum only in a code comment. `NOT VALID`, so no row scan. **Not applied to production.**

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


## Production writes done (TW-33, TW-34, TW-35) — and a live coupling

Three scoped production writes landed 2026-08-17, each behind a backup gate, each with expectations stated in advance, each planner-reverified.

```
                       start      now
nodes (total)         37,407   37,414    +7, ZERO deletions throughout
active securities      9,992    9,981    -11 (all merged, none deleted)
merge_links           25,926   25,937    +11, tagged venue_normalization_dedup
identifier_index         167      174    cik rows 0 -> 7
issuer nodes           1,323    1,330    +7, minted fresh, SEC registered names
cik-exact edges            0       10    3 sit on RETIRED nodes and are excluded
cik-exact SERVED           0        7
multi-node symbols        11        0
```

**THE COUPLING, and it is the most important line in this file.** Production DATA now depends on code merged as PR #333 (cockpit main `f3087daa`). Three `cik-exact` edges sit on retired nodes. Code WITHOUT the bound fix counts them against the per-CIK bound and refuses legitimate links; code WITHOUT the trust narrowing serves them and reports 10 trusted links instead of 7. It is latent only because the deployed image predates TW-31 entirely and nothing serving reads `issued_by`. **The next cockpit deploy must carry #333. Never deploy a cockpit image older than `f3087daa` from here on.**

The two halves are not separable: shipping the trust narrowing without the bound fix would make those orphans unreachable with nothing replacing them, which is information loss. The executor caught that when the planner proposed the narrowing alone.

Remaining 181 CIKs deliberately NOT applied. Re-measure that plan after #333 is deployed, because the bound fix changes the refusal count.

## Open

**TW-32 MERGED 2026-08-17T16:34:39Z, cockpit main now `786b35ad`** (was PR #332, CI `success` @ `a2f55232`, 4468 passed / 0 failed, `writesPerformed: 0` proven five ways.** Expected-issuer now derives from the crosswalk artifact rather than from the empty `identifier_index`. Re-measurement against the live graph, read-only, `identifier_index` cik rows still 0:

```
                before   after
agrees               0      44     (0 was structural, not measured)
disagrees          147     103
no_opinion        8187    8187
```

**THE HEADLINE IS NOT 44.** Only **15 of 188 in-scope CIKs** have an existing issuer node clean enough to designate; **173 are mint-required**. The legacy graph agrees with SEC's partition on ~30% of judgeable links and is structurally unusable for the other ~70%. The 40-row sample splits 28 `cik-has-no-clean-issuer-node` / 12 `cik-split-across-issuer-nodes`; ProShares Trust II and BANK OF MONTREAL each have their ticker family spread across FIVE issuer nodes.

A second defect was found and fixed while measuring: a reported `cohort_size: 99` against a SEC bound of 27. The executor tested the duplicate-nodes-per-ticker hypothesis FIRST and found it WRONG (only 11 symbols in the entire active master have more than one node); the real cause was its own missing status filter counting the 25,926 `merged` nodes. `links_skipped_not_active_securities: 0` proves the fix corrected a reporting artifact without moving the measurement.

A subtle and important test was added: **an AGREEING legacy link is still refused by the trust boundary**, so grouping-equivalence and trustworthiness cannot blur. Agreeing with SEC's partition is not the same as being trustworthy. `designate_expected_issuers()` is pure and adds no second read of `issued_by`, so the AST structural control still holds.

**RULED 2026-08-17: MINT FRESH for all 188, do not adopt.** Operator approved the planner recommendation. Consequence: 15 real issuers will carry two issuer nodes each - one legacy name-derived node that is permanently unreachable through the trust filter, and one new `cik-exact` node. That duplication is accepted deliberately: uniform provenance beats a tidier graph. No `--adopt` flag is to be built. Original framing follows.

**WAS OPEN — the adoptable 15.** Those CIKs already have a clean matching legacy node, yet `--apply` as written would mint a SECOND node for each, leaving two issuer nodes per real issuer. The executor deliberately did NOT add an `--adopt` flag, on the grounds that an unexercised write path is worse than an explicit open question. **Planner recommendation: MINT FRESH for all 188, do not adopt.** The trust filter makes the duplicate inert (only `cik-exact` is ever read, so the legacy node is unreachable); adoption would require trusting a name-derived match at exactly the moment we have established name-derived matches are ~70% structurally unusable, and 15 that look clean is evidence they are not obviously dirty rather than evidence they are right; minting keeps provenance UNIFORM (every cik-indexed issuer node has the same story: SEC, this date, cik-exact) instead of creating two classes of cik-indexed node; and the cost is 15 inert nodes out of 1,323.

**Collapsed-edge resolution — RULED AND SHIPPED.** Read-time trust filter, merged. `trusted_issuer_links()` admits `cik-exact` only; `lei-exact` is also excluded because exactly one `lei` row exists in the whole index, so that path is unexercised at any scale that would earn trust, and widening is an operator ruling pinned by test. `trusted_issuer_node_id()` returns `None` across the entire legacy cohort rather than falling back to fuzzy, and raises rather than picking a winner on two trusted issuers. An AST structural test fails if any code path reads `issued_by` outside the boundary, with TWO detectors, because a `select(Edge)` constraining no `Edge.type` returns issuer links without naming them. Legacy links untouched: closure is reachable only inside `allow_atom_backfill()`, since `immutability.py`'s PRIMARY `do_orm_execute` guard rejects Core UPDATE/DELETE too. **TW-6 must read only `cik-exact` links and render honest absence on empty, which for the whole legacy cohort is always.**

**Migration 0058 apply — NO SEPARATE STEP EXISTS.** Migrations are deploy-coupled by design: `docker compose ... exec -T cockpit-api alembic upgrade head` is a line inside both `scripts/_eq_deploy_remote.sh` and `scripts/deploy-cockpit-api-gcp.ps1`. 0058 applies automatically on the next deploy, inside a soak-safe window. Do not build a standalone apply path around it.

**Contribute-or-pay parameters** (rate, decay, calibration-modified rate, paid price, whether any cohort figure shows at Layer 1) — deliberately open until TW-29.

**Counsel.** Whether publishing aggregate declared intent carries a regulatory characterisation. It is not a held position, so it is not COT-shaped, and that novelty is why it is untested.

## Standing rules for this program

No backend deploy to the cockpit VM except from post-reconcile main, and only in a soak-safe window — a restart kills running jobs and must preserve both A/B arms. Do not read a SHA off that host: `/opt/empressa/.git` exists but its head is not what runs. Gate what you SERVE, never what PROVES you — `GET /spine/anchor/verify/{atom_id}` is anonymous by doctrine and pinned by a dependency-graph test. Smart Files is refined, never forked; Plan Review is its first consumer and any migration must be sequenced with the G-60/G-61 lane.
