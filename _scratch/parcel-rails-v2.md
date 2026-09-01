# parcel-rails-v2 scratch

## OPEN
- Fill cards and factory drift guard pin ENGINE_SHA >= 22e71e1.

## GROUND-TRUTH
- 2026-09-01T18:26Z origin/main of hauska-engine was bfa96424db85e4f656052e9334d86e61218a03cd (satisfies >= bfa9642).
- 2026-09-01T18:26Z claim GRANTED property / feat/parcel-rails-v2.
- 2026-09-01T18:27Z P-85 0084/0086 carry county_fips, recording_ref, document_type, job id, artifact id, clerk_portal_terms (county_fips, portal_id). Pointer is possible. acquiredBy is not a P-85 column.
- 2026-09-01T18:38:28Z hauska-engine #375 MERGED. mergeSha 22e71e1c18ec6bcefe590b97d36093ae3849a4fc. CI typecheck + test conclusion SUCCESS.

## LESSON
- UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS currently spreads ZONING_ENVELOPE_RAIL_KEYS. Adding a zoning-envelope scalar without freezing that list silently creates an NA rule the decision forbids.
- Poisoning the last earned cell of a rail demotes it to declared-ahead and the publish gate PASSES. The card's "poison one LIVE rail" test needs a second parcel that keeps the rail live. Single-parcel poison tests the known derivation limit, not the gate.

## DEAD-END
- Do not import @empressaio/atom-contract/access on this card: engine-core is pinned ^1.22.0 and the /access subpath is a 1.30.0 surface. Local pair type matches 19_the_instrument_contract.md.
