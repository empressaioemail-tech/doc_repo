# A1 RRC county join — scratch

## GROUND-TRUTH (2026-08-11T22:46Z)
- tx_rrc_well: 1,396,049 total; county_fips assigned 1,394,336 (99.88%); 254 counties represented
- Before (P2.3 bbox): 499,924 / 35.8%; apply-time before was 506,245 (partial drift)
- Unassigned: 1712 in-TX-envelope + 1 outside TX bbox
- tx_rrc_pipeline: 491178/491178 county assigned (unchanged)
- Apply wall: 1801069 ms (~30 min); 921676 rows updated

## LESSON
- P2.3 tx_county_bbox wrong on 8.2% spot-check vs boundary PIP — must full reassign, not null-only
- postgres.js batch UPDATE: use unnest arrays, not sql(chunk) as VALUES table
- Residue wells at lat ~34 north Panhandle: inside county bbox, outside TIGER polygon (OK border / bad coords)

## OPEN
- Well-fact writer must query tx_rrc_well by lng/lat bbox for the 1713 county-null wells — not emit false absence atoms on nearby parcels
