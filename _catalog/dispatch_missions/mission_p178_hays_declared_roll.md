## Mission — P-178 HAYS DECLARED ROLL: the 2026-08-26 export replaces the preliminary values, and the accounts it lacks are marked, not hidden

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread; the OPERATOR
gives the go for the production load in this thread. You start only after P-177 has merged and
published (the overseer tells you); the values must change under the crosswalk rule, not before it.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute

`_decisions/2026-09-13_hays_declared_2026_roll_is_the_8_26_export.md`.

### Where you work

`P:/seat-worktrees/property/legacy-design-tools-p178-hays-roll`, branch
`feat/p178-hays-declared-roll`, from `origin/main` after P-177's merge; declare the start commit.
`P:/legacy-design-tools` is someone else's checkout.

### What is true today (re-verify at your start)

- Production `cad_property` at `48209` / `tax_year 2026`: 134,606 rows from
  `2026-PRELIMINARY-DATA-EXPORT-FILES.zip`, `quick_ref_id` and `property_number` filled on
  134,216 of them by the P-175 backfill (`cad-backfill-published-identifiers`, LDT #654).
- The 8-26-2026 export (`hays.zip`, sha256 `7a4bd56d…`, PROPERTY member
  `PropertyDataExport1404449.txt`; the IMPROVEMENT member has 11 columns and the same first four
  headers, do not load it as the roll) carries 134,591 distinct accounts. Against the
  preliminary roll: 134,216 in both, market value identical on 88,692 and different on 45,524
  (5,804,233,014 dollars absolute), situs different on 509, 390 roll rows not in the export,
  375 export accounts not on the roll (`_inbox/2026-09-10_ctx-hays-rebind_addendum_source_reconciliation.json`).
- `upsertCadProperties` writes a WHOLE row and never deletes; a re-ingest therefore cannot
  drop the 390 and would leave them at notice values under the same tax_year with no marker.
- The parser reads `QuickRefID` and `PropertyNumber` (LDT #653); confirm at your start commit
  that a re-ingest writes them and does not null them.
- The loader runs as the Cloud Run job `ldt-cad-ingest` (P-169; 16Gi/4cpu was needed for
  Travis). No laptop `--apply` (frozen 2026-08-26).
- The declared-vintage registry is `lib/cad-ingest/src/vintage.ts` (`tryResolveDeclaredCadVintage`);
  the factory's cadRoll gate reads the declared vintage (`publish-cadroll-postcondition.mjs`).
- The card's dollar rows print `vintage: 2026-09-02T12:59:55Z`, the load time, not the drop.

### What you build, in order

1. **The marker.** A declared row state for accounts present on a prior drop of the same
   tax_year and absent from the declared drop: a column or typed state
   (`roll_membership = 'absent-from-declared-drop'`, with `declared_source_file`) that the
   reader and the facets surface as an honest disposition, never as a certified value. A
   migration; a violation test that a marked row cannot be served as `present` cadRoll.
2. **The vintage label.** The dollar rows' `vintage` is the drop's name and export date
   (`2026-08-26 certified export`), and until the load lands the preliminary rows read
   `2026 preliminary (notice values)`; wire both through the facets and `get_smart_site`.
3. **Declare.** Update the LDT vintage registry for 48209 to the 8-26 drop. Tests.
4. **Staging load.** Through `ldt-cad-ingest` on staging with the 8-26 PROPERTY member:
   dry-run record, then apply. Read, do not assume: rows updated, inserted (expect 375),
   marked (expect 390), identifier columns unchanged by digest, market value changed on
   45,524 (within the arithmetic of staging's own roll). Paste the record's tail. CP2.
5. **Production load, on the operator's go in this thread.** Same sequence; same numbers or
   a finding. Keep both record files and name them in the close.
6. **Publish.** Re-bake and publish Hays tier-1 through the factory job (staging then
   production, under the planner's lease if a service shifts). Read `get_smart_site` for
   `48209:97658` (629 Sturgeon under P-177's rule) and for three of the 45,524 moved accounts
   and three of the 390 marked; paste values, vintage labels and dispositions.

### Falsifiers, pre-registered

- If after step 5 `quick_ref_id IS NOT NULL` on 48209/2026 reads fewer than 134,216, the
  re-ingest clobbered the identifiers; stop before publish.
- If market value moved on a count far from 45,524, the wrong member or the wrong drop was
  loaded (check the 40-column header and the sha256).
- If any of the 390 serves a `present` cadRoll after step 6, the marker is not in the read path.
- If the row count for 48209/2026 fell, something deleted; the loader must not.
- If any county other than 48209 changed a row, the load was not scoped.

### Out of scope

Prior-year vintages. Other counties' declared drops. Node identity (ruled:
`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`).

### Close

`_inbox/<date>_p178-hays-roll_close.json`, `planRows` `["P-178"]`, with the migration and PR
numbers with merge SHAs and conclusion strings, both load records, the counts against the
pre-registered expectation, the publish run ids, the seven `get_smart_site` reads, and the
serving revisions by field. Write it in the doc_repo worktree the session running you is rooted
in; do not commit to doc_repo. `leave_behind` is required.
