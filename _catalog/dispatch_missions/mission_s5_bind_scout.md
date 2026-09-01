You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not atoms --apply. Do not Harris PBF. Do not touch P:/legacy-design-tools.

Plan row R-08. Occupancy: read-only on P:/seat-worktrees/property/legacy-design-tools and P:/seat-worktrees/property/hauska-map. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 5.

## Mission

Item 5 is parcel bind: a fact atom that exists for a gold parcel is retrievable by that parcel's parcelNodeId on inspect. Dual-grammar misses (R-07 Q8) are in scope.

S2 already named consumers. Do not re-derive the 15-family table. Use `_inbox/2026-08-21_s2-family-scout_close.json`. In-scope for this card: families S2 marked as serving an atom or retiredStore that inspect shows (zoning-fact, setback-rule, buildable-envelope, road-node, flood-hazard-fact, land-use-fact). HOLD-not-this-surface stays HOLD.

For each in-scope family: name one live parcel in a county known to have those atoms, both key grammars, and whether inspect currently returns the atom, a dual-grammar miss, a retired store, or empty. Gold flood parcel is `48021:34137`. Do not live COUNT(*) on atoms. Point lookups and code reads only.

Fail if the atom is in the store and inspect is empty for that family. List those fails. Do not write product code.

## Return

CP1/CP2/CLOSE with one row per in-scope family. leave_behind: wiring cards for any fail.
