---
id: 2026-09-18_georgetown_rewrite_served_FINDING
title: Georgetown's not-yet-effective code rewrite is served as governing on 35,038 parcels
date: 2026-09-18
last_updated: 2026-09-18 (13:50Z)
status: ruled (A-218, 2026-09-18 ~14:40Z): the operator accepts serving the adopted rewrite; P-354 re-scoped to make every surface name both dates
kind: finding
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-354, P-349, P-258]
snapshot: factory store (FACTORY_DATABASE_URL_RO) read 2026-09-18 13:47:57Z to 13:50:33Z; customer card read 2026-09-18 ~13:48Z on smartsite.cloud; @empressaio/setback-corpus 1.1.0 and 1.4.0 read from npm; doc_repo main e887a8fb
related:
  - _decisions/2026-09-18_phase0_closeout_rulings.md (ruling 19)
  - _inbox/2026-09-07_legacy-design-tools-shared-reader_georgetown-san-marcos_close.json (the merge of the rewrite into the table)
---

# Georgetown's rewrite is served as governing

**Ruling 19 (A-216, this morning):** Georgetown stays withheld until its rewritten code takes effect
on 2026-11-01, and no surface cites the adopted-but-not-yet-effective rewrite as the governing
source before then. The ruling was taken on the understanding that Georgetown is withheld today.
**It is not.**

## What the customer sees

`smartsite.cloud` card for `48491:R000009` (district RS, `georgetown-tx`): setbacks front 20, side 5,
rear 10, corner 15, envelope status `ok`, citation
`.../UDC Rewrite Draft Content/Unified Development Code 8.11.2026.pdf` (the rewrite), and the
disclosure "Setback rule vintage unknown — the rule is served undated, not as current." The values
are the rewrite's RS Residential Suburban District, served as the parcel's setbacks.

## How far it reaches (factory store, setbackFrontFt value cells, Williamson)

| District | Source | Parcels | From the rewrite? |
|---|---|---|---|
| RS | corpus 1.1.0 | 34,011 | yes (RS row replaced 2026-09-07 with the rewrite's) |
| RE | corpus 1.1.0 | 38 | yes |
| AG | corpus 1.4.0 | 679 | yes (added by P-258 lane-c, "adopted 2026-08-11 / effective 2026-11-01") |
| MU-DT | corpus 1.4.0 | 224 | yes |
| PF | corpus 1.4.0 | 75 | yes |
| MH | corpus 1.4.0 | 11 | yes |
| C-3, MF-1, C-1, MF-2, TF, IN, OF, TH, CN | corpus 1.1.0 | 3,787 | no (current code) |

**35,038 of 38,825 Georgetown value cells carry a rewrite row.** RT and RM have no parcels today.

## Mechanism

The LDT adapter table `georgetown-tx.json` MERGED the rewrite's single-family rows into the table on
2026-09-07 (RE, RT, RS, RM replacing the pre-rewrite RE, RL, RS), and corpus 1.1.0 (published
2026-09-07 21:52Z) carried that table. The table has no table-level `effectiveDate` and the rows
carry the date only in prose, so neither the factory setback writer (`setback-table-router.mjs`,
which reads a table-level date) nor the corpus resolver can tell a not-yet-effective row from a
current one. The writer wrote them on 2026-09-10 (1.1.0) and filled four more districts on
2026-09-17 on the 1.4.0 image. The engine's registry withholds `san-marcos-tx`; nothing withholds
Georgetown.

Second explanation considered and rejected: that the card reads the pre-rewrite RS row whose values
happen to match. Rejected: the served citation URL is the rewrite PDF, and corpus 1.1.0's RS row is
`RS Residential Suburban District` (the rewrite's name) citing that PDF.

## What follows

- *(Superseded by A-218, see the Ruling section.)* **P-354 (carded):** no corpus row whose own effective date is in the future is served as
  governing, anywhere. Rows carry their own effective date as a field; the writer, the LDT reader
  and the draw route refuse a future-dated row with a declared reason naming the date; the 35,038
  cells are rewritten as that refusal; the card for `48491:R000009` reads it. On 2026-11-01 the rows
  serve with no one having to remember to switch them.
- *(Superseded by A-218.)* **P-258's re-run must not run for Williamson before P-354 lands,** or it widens the violation to
  the 73 Georgetown parcels still unaccounted.
- **San Marcos, the same session's read:** 2,119 San Marcos cells already carry corpus 1.4.0 rows
  (CD-3 418, SF-R 376, CD-5D 365, CD-4 314, FD 184, LI 130, HC 114, CD-5 89, HI 72, MH 29, CM 23,
  ND-3 3, CD-2.5 2), written 2026-09-17 for districts that had no row. These are additions of
  verified rows, not the replacement of the 1.1.0 `legacy-transitional` rows that ruling 19 gates
  on the coverage re-check, so they do not breach it. They were written before the ruling and
  before the check, which the operator should know.

## Ruling (A-218)

The operator, told of this at about 14:20Z: "I'm good with Georgetown showing the next version of
setbacks, they will take place soon enough and frankly anyone using our site should be planning for
the new codes." Ruling 19's Georgetown half is amended accordingly. What remains is honesty on the
surface: the card must say the rule was adopted 2026-08-11 and takes effect 2026-11-01, not "vintage
unknown" (P-354, re-scoped). P-258's Williamson re-run no longer waits on it.
