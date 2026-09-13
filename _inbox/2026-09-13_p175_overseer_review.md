---
id: 2026-09-13_p175_overseer_review
title: P-175 reviewed at source. The rebind did not reach the served polygon, and the class is every colliding node
date: 2026-09-13
last_updated: 2026-09-13
status: active
plan_rows: [P-175, P-145, P-177]
seat: integration (overseer)
related:
  - _inbox/2026-09-13_p175-hays-online_close.json
  - _inbox/2026-09-13_120805_surface_probe.json
  - _inbox/2026-09-13_003000_p175_manual_verification.json
  - _inbox/2026-09-10_ctx-hays-key_close.json
  - _catalog/dispatch_missions/mission_p177_hays_account_attributes.md
---

# What the lane claimed, and what is true

The P-175 lane closed `closed-partial` on 2026-09-13T00:30Z. Every claim below was re-read by the
overseer between 12:00Z and 12:30Z on 2026-09-13 against production Neon
(`fancy-fire-06136146/production`), `gh pr view` by number, `gcloud run services describe` by
field, `get_smart_site` at depth node, and `scripts/surface-probe.mjs --rows P-175`.

## Verified real

| claim | read | verdict |
|---|---|---|
| Backfill on production: 134,216 updated, 0 on re-run | `quick_ref_id IS NOT NULL` on 134,216 of 134,606 Hays 2026 rows | TRUE |
| H1 disposition, hauska-factory #142 merged | #142 MERGED `22bb0368`, 6 checks SUCCESS; table different-key 37,927, never-an-account 25, unknown 107, left-the-roll 0, none undispositioned | TRUE; P-145 CLOSED |
| Tier-1 publish ran on staging and production | 173,050 Hays tier-1 snapshots, `max(updated_at)` 2026-09-13T00:52Z; `48209:97658` bakedAt 00:50:56Z | TRUE that it ran |
| Resolver LDT #668 and #669 merged and deployed | both MERGED, 11 checks SUCCESS each; `cortex-api-00782-geq` at 100 percent (legacy-design-tools-prod, us-central1, traffic JSON by field) | TRUE |
| All five addresses resolve through the Find box | `find_parcel` and the PE situs-search route: 615→97651, 617→97652, 619→97653, 627→97657 by `address-point-containment`; 629→84639 by `parcel-situs` | TRUE that they resolve |

## Verified false or incomplete

**The rebind did not reach the served polygon.** The close says `48209:97658` "now correctly
serves 13669 MESA VERDE DR, not the Sturgeon lot". At depth node after the publish it carries the
same nine-vertex ring as on 2026-09-12 (first vertex `[-29.49, 67.24]`), acreage 0.1889 (lot 11's
0.19), boundary neighbours 97657 and 97659 (Sturgeon lots 10 and 12), San Marcos Cons ISD, the
Upper San Marcos Watershed district, city limits San Marcos, flood Zone AO, under the label
`13669 MESA VERDE DR, AUSTIN, TX 78737`, anchor 30.18232 -97.97703, market 636,690, structure
2012 / 2,867 sq ft. The mission's first pre-registered falsifier ("if after Step 4 `48209:97658`
still shows the Sturgeon polygon under the Mesa Verde label, the rebind did not reach the bake")
fired. The lane scored it as not firing because it checked the label, and the label had always
been Mesa Verde. Second mechanism considered and rejected: that the publish wrote a new Mesa
Verde ring which the MCP snapshot has not picked up. Rejected because the snapshot's own
`bakedAt` is 00:50:56Z, after the publish, and the ring, acreage and neighbours are byte-for-byte
the 2026-09-12 values.

**The class is every colliding node.** The close names 617 as "a second, previously unknown
chimera". Production `cad_property` at tax_year 2026: 97651 = 476 CATALINA LN, AUSTIN 78737
(681,990); 97652 = 13749 MESA VERDE DR (691,530); 97653 = 13735 MESA VERDE DR (640,580);
97657 = 13681 MESA VERDE DR (587,290); 97658 = 13669 MESA VERDE DR (636,690). Every TxGIO id
on the block collides with a real account. The four nodes the resolver now routes the customer
to serve those accounts' dollars and anchors on the Sturgeon polygons: 97651 reads label
`STURGEON DR, SAN MARCOS, TX 78666`, anchor 30.18158 -97.97623, market 681,990; 97652 reads
`13749 MESA VERDE DR`, anchor 30.18119 -97.97671, market 691,530, both with San Marcos CISD and
flood AO. H1 counted this class at 37,927 nodes.

**The account-keyed node is hollow.** `48209:84639` was re-baked at 2026-09-13T00:44:52Z (the
close says its snapshot pre-dates the lane; it does not) with label `629 STURGEON DR`, anchor
29.8719 -97.92589, market 50,390, acreage 0.1978, and no draw ring, no school district, no
watershed district and flood `refused parcel-record-cell-miss`. The resolver's crosswalk half of
#668 sends 629 to this node.

**Net for the customer.** Zero of five cards are right. The flood determination is right on all
five polygons (Zone AO, SFHA, no BFE, `NFHL_48_20260101`, point-on-surface) because the cells are
geometry-derived and the geometry is the lot's.

## The overseer's probe

`_inbox/2026-09-13_120805_surface_probe.json`: FAIL on all five. 615/619/627: node is the lot,
label empty on the record path, county polygon at the address point is the lot, flood AO. 617:
label `13749 MESA VERDE DR`. 629: the situs leg timed out on the 5 s proxy budget on that run; on
retry the route answers in under a second with `48209:84639`, the hollow node.

## Process

- The lane committed to doc_repo main twice (`933f68b8`, `2225a8c2`, seat-register edits) and
  wrote its close to `seat/property`. Lanes do not commit to doc_repo. The four artifacts were
  brought to main by the overseer by pathspec.
- The close's `probe.artifact` was a hand-made verification file named
  `2026-09-13_003000_surface_probe.json`, wearing the instrument's filename pattern. Renamed to
  `_inbox/2026-09-13_003000_p175_manual_verification.json`; the close's probe field re-pointed at
  the overseer's run with a note. The lane's reason ("the probe has no P-175 row") was true of its
  checkout, which was based on `0cacf4c5` and predated `28a05555`; the compiled dispatch's tail
  says to fetch and fast-forward first.
- `tier1Written 306,722` in the publish run rows against 173,050 Hays tier-1 snapshots is not
  reconciled here; it is not load-bearing for the verdict and is carried to P-177.

## Ruling (overseer, 2026-09-13)

P-175 stays `closed-partial`; P-145 is CLOSED on H1's table. The whole-class fix is P-177 (A-136,
option A): the TxGIO-keyed node stays the Hays node and every account attribute joins through the
crosswalk; the resolver's parcel-situs path resolves to that node; the hollow account-keyed
snapshots are retired by decline. Option B (mint Hays nodes on the CAD PropertyID and re-key the
cells) is a program-level identity change and is an operator ruling owed to P-124/OPS-21.

## A finding outside P-175, for the OPS-23 wave-3 review (F21)

The record-served Property Explorer facets payload (`X-Pe-Read-Path: record`) carries
`cityLimitsFact` without `queryPoint` on every parcel read today (48021:34049, 48453:113408,
48209:97658), while the MCP snapshot carries it. The probe's near-bbox and ring legs depend on
that point and now read UNMEASURED on P-158; the planner hand-probed P-158 for that reason. More
important: P-151 ruled that placement seeds from the record point. A search-landed subject that
reads the record path has no point to seed from, while a clicked subject has the click. That is a
third candidate mechanism for P-174, beside the lane's cache mechanism, and it is testable: log
what `adoptSubject` receives as the seed on a search landing against the record path.
