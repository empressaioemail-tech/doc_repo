---
id: 2026-09-19_a231_merges_etj_deploys_RECORD
title: The landed wave merged, P-359's migration and ETJ re-ingest applied, Property Explorer deployed, record
date: 2026-09-19
last_updated: 2026-09-19
status: in progress. Merged P-270 (both), P-340 (both), P-367; P-366 (#726) held (red CI); P-339 (#728) re-running CI. 0104 applied and the ETJ re-ingested (verified against the lane's prediction). Property Explorer deployed. cortex-api deploy next.
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-270, P-339, P-340, P-359, P-366, P-367]
snapshot: hauska-map 55613fad; legacy-design-tools 824bd21e (after #729); hauska-factory ab7618cb; cortex store ep-lucky-truth-apodo8hr/neondb; doc_repo 1f7ceddd plus uncommitted seat edits
authority: the operator's go of 2026-09-19 on the commit and the list ("then you can do what you need to with these agents that landed and move on with the rest of your list")
---

# The landed wave, 2026-09-19

## 1. Merges

Every merge is a squash with `--match-head-commit` at the reviewed head, green against the base it
merged into (a PR behind main was updated and re-greened first).

| Row | PR | Merge commit | Review notes |
|---|---|---|---|
| P-270 city half | map #426 | `9752c024` | the card's address line; no type change to the zoning facet |
| P-270 city half | LDT #727 | `ea66ef6d` | the city-limits read only when the roll declares the city absent |
| P-340 | map #427 | `55613fad` | updated onto #426 without conflict; the card resolves through `@empressaio/setback-corpus/resolve` (`^1.4.0`, lockfile 1.4.0); the four vendored table files retired |
| P-340 | LDT #729 | `824bd21e` | updated onto #727; `fetchPropertyAtomChain.ts` only gains the wire's own `sideCornerFt` spelling |
| P-367 | factory #190 | `ab7618cb` | updated onto #189; the router change is a behaviour-preserving refactor (one producer of the date vocabulary); the release records every moved cell in `run_events` chunks BEFORE the UPDATE, a failed insert aborts the page, and a run with no id refuses |

**Held: P-366 (LDT #726).** Its CI is red: `Typecheck` fails on the PR's own new test
(`spineZoningDistrict.test.ts:226`, TS2352), and `Test` fails three: two 20 s timeouts
(`txgioAddressResolve.integration.test.ts` "returns null for a genuinely nonexistent address",
`txgioParcelStore.integration.test.ts` "issues exactly ONE extra statement per response") and
`canva-route.test.ts`. The type error is the lane's. The two timeouts are either P-375's CI Postgres
limit or a real consequence of #726 re-enabling the atom-chain credential fallback (a read path dead
in production), which could put a network call on exactly those paths. It goes back to the P-366
lane; P-372, P-373 and P-374 stay held behind it.

**Re-running: P-339 (LDT #728).** After its first update its `Test` failed in
`lib/submission-classifier` (`upsert.test.ts`, a 10 s timeout inside `withTestSchema`), a package the
PR does not touch: the P-375 class. Re-run once and recorded as a P-375 instance; then updated onto
#729's merge, so it re-runs again.

## 2. P-359: migration 0104 and the ETJ re-ingest

**The gate.** LDT main carries P-359's reader, which refuses every `underived` ring. So 0104 and the
re-ingest precede any cortex-api deploy.

- **The pending set, read first.** Production `_schema_migrations` (column `name`): 103 applied,
  last `0103_txgio_parcel_zoning_district_interim.sql`; the repo holds 104 files. Exactly 0104
  pending. The migration workflow reads `DEPLOYMENT_DATABASE_URL_DIRECT` (legacy-design-tools-prod);
  compared by host and database only (credentials never printed) with `PRODUCTION_NEONDB_URL`: both
  `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech / neondb`.
- **Applied** by the `run-migrations` workflow (run `35442307163`, LDT `ea66ef6d`, conclusion
  `success`), and verified at the data: `0104_tx_etj_served_geometry.sql` applied 12:15:31Z; all
  355 rings `underived`, none with a served geometry. The deployed cortex-api does not read these
  columns, so nothing a customer sees changed.
- **Re-ingest** from a fresh LDT clone at `ea66ef6d` (`pnpm install --frozen-lockfile`),
  `lib/cad-ingest`: `tsx src/boundary/etjCli.ts --dry-run` (32 s, 20 publishers, 355 rings parsed,
  nothing written), then the real run (12:18:04Z to 12:21:18Z, 355 inserted, `tx_etj_source` 23
  register rows).
- **Verified at the data against the lane's own prediction** (`P:/tmp/p359-evidence/dryrun_derive_final.txt`,
  the shipped pass's verdicts on 2026-09-18):

  | served_status | Predicted | Measured | With served geometry | With derivation record |
  |---|---|---|---|---|
  | verbatim | 330 | 330 | 0 | 330 |
  | repaired | 8 | 8 | 8 | 8 |
  | derived | 2 (Georgetown, Leander) | 2 (`georgetown-tx:9644`, `leander-tx:7305`) | 2 | 2 |
  | excluded | 15 | 15 | 0 | 15 |
  | withheld / underived | 0 / 0 | 0 / 0 | | |

- **Finding: an ETJ ring's id is the publisher's feature id, and it is not stable.** The six excluded
  Austin rings carry different ids than in the lane's run (`austin-tx:292, 294, 314, 382, 385, 386`
  against `288, 290, 291, 302, 367, 370`). Three have byte-identical published areas (the same rings,
  re-numbered by the publisher); three moved slightly (for example 194,439,161.8 to 194,382,789.4 m²:
  Austin edited them since 2026-09-18). Anything that stores a ring id (P-336's cutover writes, any
  cell citing a ring) can silently point at a different ring after the publisher re-publishes. Carried
  to P-336's review.
- **A process violation, stated.** The seat's heavy-scan take for the ingest returned exit 5
  (`LEASE_HELD`: the P-368 lane held the cortex window from 12:16:19Z to 13:01:19Z), and the command
  did not gate on the take's exit code, so the ingest ran from 12:18:04Z to 12:21:18Z inside P-368's
  window. Its effect is bounded: the ingest writes `tx_etj_boundary` and `tx_etj_source` only, which
  P-368 does not read; the most it could do is slow P-368's reads. From here every seat write command
  gates on the take's exit code.

## 3. Property Explorer (the map halves of P-270 and P-340)

Fresh clone of hauska-map at `55613fad`, `vercel link --yes --project property-explorer`, `.env.local`
removed, `vercel deploy --prod --yes`. Deployment `dpl_HafCcq8nZxFYUHySY3bYRHsiipT1`, read back by
field: `readyState READY`, target production, commit `55613fad`, aliases `smartsite.cloud`,
`www.smartsite.cloud`. The build log shows a non-fatal TS2741 in
`api/_lib/verdict-layer-merge.ts:168` (`LayerAbsenceWire` against `{district: string}`); that file was
last changed by P-92 and P-66, and tonight's diffs do not change the zoning facet's type, so it predates
this deploy. Graded with the signed-in probe after the cortex-api deploy.

**P-339 merged** (LDT #728, `ad99acaa`, 14 of 14 green against `824bd21e` after its second update).

## 4. cortex-api: the canary, pre-registered BEFORE it exists

The deploy carries LDT `2e7ca7c4..ad99acaa` minus nothing held back except #726 (P-366, not merged):
P-351 (the bake; not on cortex's serve path), P-331 (CI only), P-359 (the ETJ reader), P-270 city half
(the MCP situs label and a city-limits read), P-340 (the route's setback resolution, district mapping
and conflict row), P-339 (the MCP draw block's outcome). 0104 and the ETJ re-ingest are applied
(section 2), so the reader finds no `underived` ring.

The grader `scripts/cortex-canary-compare.mjs` compares only the draw route and node facets. It had no
class for any of this deploy's changes, so two classes were added and self-tested BEFORE the canary was
deployed (17 of 17, each with its violation: a non-ETJ node change on the same subject FAILS; the same
draw change on a non-P-340 subject FAILS; a P-340 subject's node change FAILS):

- `p359-etj`: a difference on a path naming the ETJ, on either route.
- `p340-subject`: any draw-route difference on P-340's seven measured subjects (`48209:145880`,
  `48209:166141`, `48209:140047`, `48209:142415`, `48209:97658`, `48453:239852`, `48453:367134`).

**Pre-registered grade.** Every difference falls in one of the two classes, or the canary FAILS and each
remaining difference is read against the code before any traffic moves. P-339 and P-270 change the MCP
paths (`routes/propertyExplorer.ts`, the stub), not these two routes, so a difference attributable to
them here is itself a finding. P-340's district-mapping change (Austin's base code `SF` no longer read
as a district) may reach Austin subjects beyond the seven; those land as FAIL and are read by hand, not
admitted by a wider pattern.

### The canary graded

- `deploy-canary` run `35443801974` (image tag `ad99acaa9f18...`), success. Traffic read by field:
  `cortex-api-00845-qev` tagged `canary` at 0 percent; `00843-yir` 100 percent (untagged); other
  tags `keyrot` (`00811-nux`), `p249-f816c21` (`00819-wug`), `staging` (`00824-qay`) at 0.
- **Calibration**, production against itself at 12:49Z: 93 comparisons over 52 subjects
  (`_inbox/2026-09-18_155840_surface_probe.json`), 0 differences
  (`_inbox/2026-09-19_cortex_canary_calibration.json`). Nothing flaps between identical calls.
- **Canary against production** (`_inbox/2026-09-19_cortex_canary_compare.json`): 93 comparisons,
  77 PASS, **16 FAIL** as graded, 232 differences: admitted `p340-subject` 133, `p359-etj` 79,
  `p270-vintage` 4; not admitted 16.
- **The 16, read by hand against the code, as pre-registered (no traffic moved first):**
  - `.cityLimitsFact.basis` on 13 subjects: the ETJ explanation sentence inside the city-limits fact.
    Before: "point-in-polygon against N ring(s)... no published ETJ ring contains it". After: "N
    published ETJ ring(s)... could not be tested and reach this point's own envelope, so ETJ here is
    unresolved". This is P-359's reader (`etjFactRead.ts`, `containment.ts`) on a path whose name
    does not carry "etj". Explained by P-359.
  - `.setbackSourceConflict` on 3 draw subjects outside P-340's seven (`48021:14899` Elgin,
    `48453:445501` Pflugerville, `48021:34049` Bastrop): the conflict row P-340 publishes wherever
    candidates disagree without a readable date (`setbackSourceConflict.ts`); on these three the
    served values do not move, only the disclosure is added. Explained by P-340.
  - The 4 `p270-vintage` admissions are on P-340's own subjects `48453:239852` and `48453:367134`
    (Austin's citation moves from the Land Development Code page to the R-1 source document): P-340's
    change, which `p340-subject` also admits. The older class matched first; no new subject was
    admitted by it.
- **ETJ status moves** (admitted by `p359-etj`): absent to unresolved on 9 subjects (`48021:14899`,
  `48209:145880`, `48209:166141`, `48209:140047`, `48209:150937`, `48453:445501`, `48453:959606`,
  `48453:941831`, `48453:352594`); present to unresolved on 1 (`48209:142415`); present to absent on 1
  (`48453:812200`, the Leander part of Travis: Leander's self-containing ring now served minus its
  city, P-359's headline fix).
- **Finding (P-376).** Most of the absent-to-unresolved subjects are INCORPORATED (Elgin, Kyle, San
  Marcos, Buda, per the same fact's city-limits line). A Texas ETJ is by definition unincorporated
  territory, so an incorporated parcel's ETJ answer is settled by its city-limits fact, and no ring
  needs testing. The reader answers "unresolved" (declared, with its reason) where the law already
  answers "not in an ETJ". It is a declared degradation, which ENFORCEMENT permits, and P-359's close
  sized the refused-ring population in advance; it does not block the shift. Carded.
- **Verdict: every difference is one of the deploy's named changes. Shift.**

### Shifted and graded (unsigned)

- `shift-traffic` run `35444253833`, success. Its post-shift P-279 step: `RESULT=clean`,
  `cortex-api serving=cortex-api-00845-qev tags=4 required=39 failing=0`.
- The `canary` tag removed from the serving revision (tagged revisions bill minimum instances). Traffic
  read by field afterwards: `cortex-api-00845-qev` 100 percent, untagged; `keyrot`, `p249-f816c21`,
  `staging` tags at 0 percent (other lanes'). **Rollback handle:** `cortex-api-00843-yir`. The
  traffic lease was deleted after the read.
- **Unsigned probe** 12:57Z (`_inbox/2026-09-19_125728_surface_probe.json`): PASS 8, FAIL 10,
  UNMEASURED 41 (every MCP leg: no session). The eight P-254 draw failures are the known family
  carded behind P-366 (#726, held) and P-374: Kyle `48209:145880`, Austin-in-Hays `48209:150937`,
  Waco `48309:187374` (prose), and the Travis minority parts `48453:812200`, `523600`, `482441`,
  `352594`, plus San Marcos-in-Caldwell `48055:40428`. They failed before this deploy too; four of them
  now decline `envelope-unverified` rather than `no-zoning-stamp`. **P-270's card half passes**:
  `48453:445501` composes "21404 GRAND NATIONAL AVE, Pflugerville, TX 78660".
- **Two coverage failures, and their second mechanism.** P-205 and P-210 for Austin and Cameron timed
  out ("cortex timed out after 9000ms") in that run. The mechanism first considered: the new revision
  is slower (P-359's reader tests served geometries). Rejected: the same revision answered both rows
  within budget twice at 13:01Z (`_inbox/2026-09-19_130142_surface_probe.json`,
  `_inbox/2026-09-19_130150_surface_probe.json`: P-210 3 of 3 PASS, P-205's map leg 4 of 4 PASS). The
  mechanism kept: the 12:57Z probe overlapped the P-368 lane's heavy-scan window on the same cortex
  database (to 13:01:19Z); a cold-start contribution in the revision's first minutes is not excluded.
- **Owed: the signed-in probe** for the MCP legs (P-339's draw block, P-270's MCP label, the P-254 MCP
  text rows). It needs the operator's sign-in.

### Signed-in probe (the operator signed in 13:12Z)

`_inbox/2026-09-19_131230_surface_probe.json`: **PASS 41, FAIL 8, UNMEASURED 10** (yesterday's run of
record at 22:13Z: 10 FAIL). The MCP leg now reads PASS on every codified bucket, including all eight
that still fail: the eight fail on the map's draw route only (the P-366, P-372, P-373, P-374 family:
Kyle `48209:145880`, Austin-in-Hays `48209:150937`, Waco `48309:187374`, the Travis minority parts
`48453:812200`, `523600`, `482441`, `352594`, San Marcos-in-Caldwell `48055:40428`). That is **P-339's
MCP half on the live surface**: the MCP no longer contradicts its own route on these parcels. The ten
UNMEASURED are eleven Williamson buckets whose map leg has nothing to draw from (X6/XD-7, P-350) and
the XD rows with no grader.

XD/X ledger: OPEN 7, CLOSED 10, UNMEASURED 7 (unchanged counts). **X2-address falls from 11 of 40 to
7 of 40**: P-270's four city-dropping parcels are gone; the seven left are the no-composed-address
class (X6/XD-7), not P-270's. **Instrument gap:** the P-270 row still reads "the MCP leg did not
measure" with a live MCP session, so P-270's MCP label is graded by nothing yet; recorded as a gap,
not as a pass.
